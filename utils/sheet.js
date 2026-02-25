export async function postToSheet(payload, env) {
    const url = env.GOOGLE_SCRIPT_URL;
    if (!url) {
        console.warn('Google Sheet URL not configured');
        return false;
    }
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            console.warn('Failed to write to Google Sheet', await res.text());
        }
        return res.ok;
    } catch (e) {
        console.warn('Error posting to Google Sheet', e);
        return false;
    }
}
