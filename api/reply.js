// Vercel serverless endpoint for the birthday website.
// Configure SHEETS_WEB_APP_URL and SHEETS_API_SECRET in Vercel.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { type, message } = req.body || {};
  if (!['opened', 'hug', 'reply'].includes(type)) {
    return res.status(400).json({ ok: false, error: 'Invalid event type' });
  }

  const cleanMessage = typeof message === 'string' ? message.trim().slice(0, 1500) : '';
  if (type === 'reply' && !cleanMessage) {
    return res.status(400).json({ ok: false, error: 'Please write a message first' });
  }

  const endpoint = process.env.SHEETS_WEB_APP_URL;
  const secret = process.env.SHEETS_API_SECRET;
  if (!endpoint || !secret) {
    console.error('Missing SHEETS_WEB_APP_URL or SHEETS_API_SECRET.');
    return res.status(503).json({ ok: false, error: 'Reply service is not configured yet' });
  }

  const payload = {
    secret,
    type,
    name: 'Shubhada',
    message: type === 'opened'
      ? 'Shubhada opened the birthday website.'
      : type === 'hug'
        ? '🫂 Shubhada sent Pooja a warm hug.'
        : cleanMessage
  };

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });
    const responseText = await upstream.text();
    let result;
    try { result = JSON.parse(responseText); } catch { result = null; }
    if (!upstream.ok || !result || result.ok !== true) {
      console.error('Google Apps Script submission failed:', upstream.status, responseText.slice(0, 300));
      return res.status(502).json({ ok: false, error: 'Could not save the message' });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Reply submission failed:', error);
    return res.status(502).json({ ok: false, error: 'Could not save the message' });
  }
}
