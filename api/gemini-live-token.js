export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'gemini_api_key_missing',
      message: 'Configure GEMINI_API_KEY no ambiente da Vercel para habilitar o VAI BEM V2.'
    });
  }

  const model = 'models/gemini-3.1-flash-live-preview';
  const expireTime = new Date(Date.now() + 20 * 60 * 1000).toISOString();
  const newSessionExpireTime = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  // No piloto, o token é de uso único e vida curta. As restrições finas de
  // BidiGenerateContent serão adicionadas depois de validarmos a sessão real
  // com o modelo Live, evitando incompatibilidades de configuração no primeiro teste.
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
        detail: raw.slice(0, 600)
      });
      return res.status(502).json({
        error: 'gemini_token_failed',
        status: response.status,
        detail: data?.error?.message || raw.slice(0, 240)
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
