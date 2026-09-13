// VAI BEM V2 — emissor de token efêmero para Gemini Live
export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(apiKey ? 200 : 503).json({
      ok: Boolean(apiKey),
      geminiApiKeyConfigured: Boolean(apiKey)
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (!apiKey) {
    return res.status(503).json({
      error: 'gemini_api_key_missing',
      message: 'GEMINI_API_KEY não está disponível neste deployment.'
    });
  }

  const model = 'models/gemini-3.1-flash-live-preview';
  const expireTime = new Date(Date.now() + 20 * 60 * 1000).toISOString();
  const newSessionExpireTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  // REST /v1beta/auth_tokens recebe os campos do AuthToken diretamente no corpo.
  const body = {
    uses: 1,
    expireTime,
    newSessionExpireTime
  };

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/auth_tokens', {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const raw = await response.text();
    let data = {};
    try { data = JSON.parse(raw); } catch {}

    if (!response.ok || !data?.name) {
      console.error('GEMINI_LIVE_TOKEN_FAILED', {
        status: response.status,
        detail: raw.slice(0, 900)
      });
      return res.status(502).json({
        error: 'gemini_token_failed',
        status: response.status,
        detail: data?.error?.message || raw.slice(0, 400)
      });
    }

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(200).json({
      token: data.name,
      model,
      expiresAt: expireTime
    });
  } catch (error) {
    console.error('GEMINI_LIVE_TOKEN_EXCEPTION', error);
    return res.status(500).json({
      error: 'gemini_token_exception',
      detail: String(error?.message || error)
    });
  }
}
