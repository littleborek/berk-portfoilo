const FORMSPREE_URL = 'https://formspree.io/f/xdkyzopw';

export async function onRequestPost(context) {
  const { request, env } = context;

  const origin = request.headers.get('Origin') || '';
  const allowedOrigins = ['https://berkk.cloud', 'http://localhost:3000', 'http://localhost:8788', 'http://127.0.0.1:8788'];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    const { message, chatHistory = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { GOOGLE_SCRIPT_URL: googleScriptUrl } = env;

    const historyText = chatHistory
      .slice(-6)
      .map(msg => `${msg.role === 'user' ? 'Ziyaretçi' : 'Asistan'}: ${msg.text}`)
      .join('\n');

    const timestamp = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
    let response;

    if (googleScriptUrl) {
      // Google Sheets Apps Script integration
      response = await fetch(googleScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'Chatbot',
          name: 'Ziyaretçi',
          email: 'bilinmiyor',
          message,
          history: historyText,
          date: timestamp
        })
      });
    } else {
      // Fallback to Formspree
      const emailBody = '📬 Chatbot üzerinden yeni mesaj iletildi!\n\n'
        + '━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
        + `📝 İletilen Mesaj:\n${message}\n\n`
        + '━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
        + `💬 Son Konuşma Geçmişi:\n${historyText || 'Geçmiş yok'}\n\n`
        + '━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
        + `⏰ Tarih: ${timestamp}`;

      const formData = new FormData();
      formData.append('name', 'Chatbot Relay');
      formData.append('email', 'chatbot@berkk.cloud');
      formData.append('message', emailBody);

      response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });
    }

    if (!response.ok) {
      throw new Error('Relay provider error');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Relay function error:', error);
    return new Response(JSON.stringify({ error: 'Failed to relay message' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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
