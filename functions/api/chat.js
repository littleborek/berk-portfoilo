import { SYSTEM_PROMPTS, CRITIC_PROMPT } from '../../config/prompts.js';
import { sendNotification } from '../../utils/notify.js';
import { postToSheet } from '../../utils/sheet.js';

const AI_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS & Safety
  const origin = request.headers.get('Origin') || '';
  const allowedOrigins = ['https://berkk.cloud', 'http://localhost:3000', 'http://localhost:8788', 'http://127.0.0.1:8788'];
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    const { message, history = [], lang = 'tr' } = await request.json();
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

    // 1. Kariyer Yanıt Ajanı (Generation)
    const systemPrompt = SYSTEM_PROMPTS[lang] || SYSTEM_PROMPTS.tr;
    const messages = [{ role: 'system', content: systemPrompt }];
    history.slice(-6).forEach(msg => messages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.text }));
    messages.push({ role: 'user', content: message });

    let aiResponse = await env.AI.run(AI_MODEL, { messages, max_tokens: 512 });
    let reply = aiResponse?.response || '';

    if (!reply) {
      throw new Error('AI generated an empty response');
    }

    // 2. Yanıt Değerlendirici (Self-Critic)
    const criticMessages = [
      { role: 'system', content: CRITIC_PROMPT },
      { role: 'user', content: `Kullanıcı Mesajı: ${message}\nAsistan Yanıtı: ${reply}` }
    ];
    const criticResponse = await env.AI.run(AI_MODEL, { messages: criticMessages, max_tokens: 256 });
    const criticReply = criticResponse?.response || '';

    let evaluation = { score: 15, needs_revision: false };
    if (criticReply) {
      try {
        // Extract JSON from potential markdown
        const jsonStr = criticReply.match(/\{[\s\S]*\}/)?.[0];
        if (jsonStr) evaluation = JSON.parse(jsonStr);
      } catch (e) {
        console.warn('Critic evaluation parse failed');
      }
    }

    // 3. Otomatik Revizyon (Revision Loop - 1 step)
    if (evaluation.needs_revision) {
      const revisionMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.slice(1),
        { role: 'assistant', content: reply },
        { role: 'user', content: `ELEŞTİRİ: ${evaluation.feedback}\nLütfen yanıtını bu eleştiriye göre daha profesyonel ve doğru bir şekilde revize et.` }
      ];
      const revisedAiResponse = await env.AI.run(AI_MODEL, { messages: revisionMessages, max_tokens: 512 });
      reply = revisedAiResponse?.response || reply;
    }

    // Tag & Actions Logic
    const hasRelay = reply.includes('[RELAY]');
    const isCritical = reply.includes('[CRITICAL]');
    const isUnknown = reply.includes('[UNKNOWN]');

    const cleanReply = reply
      .replace(/\[RELAY\]/g, '')
      .replace(/\[ACTION:[^\]]+\]/g, '')
      .replace(/\[CRITICAL\]/g, '').replace(/\[UNKNOWN\]/g, '').trim();

    const actions = [];
    const actionRegex = /\[ACTION:([^\]]+)\]/g;
    let match;
    while ((match = actionRegex.exec(reply)) !== null) {
      const [type, payload] = match[1].split(':');
      actions.push({ type, payload });
    }

    // Logging & Notifications
    const logData = { timestamp: new Date().toISOString(), ip, message, reply: cleanReply, critic_score: evaluation.score };
    context.waitUntil(postToSheet(logData, env));

    // Telegram / Mobil Bildirim
    const shouldNotify = isCritical || isUnknown || evaluation.score < 10;
    if (shouldNotify) {
      context.waitUntil(sendNotification(message, env, {
        type: isCritical ? 'CRITICAL' : (isUnknown ? 'UNKNOWN' : 'LOW_CONFIDENCE'),
        priority: isCritical ? 2 : 1,
        payload: { ai_reply: cleanReply, score: evaluation.score, feedback: evaluation.feedback }
      }));
    }

    return new Response(JSON.stringify({
      reply: cleanReply,
      relay: hasRelay,
      actions,
      agent_metadata: { score: evaluation.score, feedback: evaluation.feedback }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Agent Loop Error:', error);
    return new Response(JSON.stringify({ error: 'Agent could not process request' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
