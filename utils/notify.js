export async function sendNotification(message, env, { priority = 0, type = 'INFO', payload = {} } = {}) {
    const TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = env.TELEGRAM_CHAT_ID;
    const FORMSPREE_URL = env.FORMSPREE_URL;

    // 1. Telegram (Primary)
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        try {
            const cleanMessage = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const cleanReply = (payload.ai_reply || 'Yok').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const context = (payload.context || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

            let htmlText = `📬 <b>Bildirim: ${type}</b>\n\n` +
                `<b>Kullanıcı:</b> ${cleanMessage}\n` +
                `<b>AI Yanıtı:</b> ${cleanReply}\n` +
                `<b>Durum:</b> ${payload.status || 'Aktif'}\n` +
                `<b>Skor:</b> ${payload.score}/15`;

            if (context) {
                htmlText += `\n\n<b>Konuşma Özeti:</b>\n<i>${context}</i>`;
            }

            const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: htmlText,
                    parse_mode: 'HTML'
                }),
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error('Telegram API Error:', errText);
            }
        } catch (e) {
            console.error('Telegram fetch failed', e);
        }
    }

    // 2. Formspree / Email (Backup)
    if (FORMSPREE_URL) {
        try {
            await fetch(FORMSPREE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: `Chatbot Alert: ${type}`,
                    message: message,
                    timestamp: new Date().toISOString(),
                    ...payload
                }),
            });
        } catch (e) {
            console.warn('Formspree notification failed', e);
        }
    }
}
