export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const { text = '', teacher = 'lia' } = req.body || {};
  if (!text.trim()) return res.status(400).json({ error: 'text_required' });

  const token = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  if (!token) return res.status(503).json({ error: 'ai_auth_unavailable' });

  const isFemale = teacher === 'lia';
  const instructions = isFemale
    ? 'Fale em português brasileiro. Voz feminina adulta, espontânea, acolhedora e segura, como uma professora particular conversando ao lado do aluno. Sotaque carioca leve e natural, sem caricatura, sem gírias excessivas, sem tom de locução. Ritmo conversacional e clareza didática.'
    : 'Fale em português brasileiro. Voz masculina adulta, espontânea, acolhedora e segura, como um professor particular conversando ao lado do aluno. Sotaque carioca leve e natural, sem caricatura, sem gírias excessivas, sem tom de locução. Ritmo conversacional, pequenas pausas e entonação didática.';

  try {
    const r = await fetch('https://ai-gateway.vercel.sh/v4/ai/speech-model', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'ai-model-id': 'openai/gpt-4o-mini-tts'
      },
      body: JSON.stringify({
        text: text.slice(0, 1800),
        voice: isFemale ? 'coral' : 'cedar',
        outputFormat: 'mp3',
        instructions,
        speed: 1.02,
        language: 'pt-BR'
      })
    });
    const raw = await r.text();
    if (!r.ok) return res.status(r.status).json({ error: 'speech_gateway_error', detail: raw.slice(0, 500) });
    const data = JSON.parse(raw);
    return res.status(200).json({ audio: data.audio, format: 'mp3', warnings: data.warnings || [] });
  } catch (e) {
    return res.status(500).json({ error: 'speech_failed', detail: String(e?.message || e) });
  }
}
