export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  const { question = '', subject = 'Matemática', grade = '6º ano', teacher = 'Profa. Lia', history = [] } = req.body || {};
  if (!question.trim()) return res.status(400).json({ error: 'question_required' });

  const token = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  if (!token) return res.status(503).json({ error: 'ai_auth_unavailable' });

  const system = `Você é ${teacher}, professor particular digital do VAI BEM. Fale em português do Brasil, com naturalidade, acolhimento e objetividade. O público desta sessão é ${grade}, na disciplina ${subject}.

Regras pedagógicas:
- responda à dúvida real do aluno, sem limitar o assunto a frases pré-cadastradas;
- não faça uma aula expositiva longa; localize a lacuna e intervenha apenas no necessário;
- explique de forma adequada à idade, usando exemplos e analogias quando ajudarem;
- quando houver cálculo, fórmula, estrutura química ou procedimento, mostre o raciocínio em etapas curtas;
- nunca invente que viu uma imagem, apostila ou resolução que não foi enviada;
- se faltar contexto, faça uma pergunta curta de esclarecimento;
- ao final, proponha uma pequena aplicação para o aluno demonstrar compreensão;
- se a pergunta parecer ser de uma avaliação em andamento, não entregue a resposta final: ajude pelo raciocínio;
- o VAI BEM não é um catálogo de videoaulas. É estratégia, diagnóstico e intervenção individual.

Retorne APENAS JSON válido, sem markdown, no formato:
{
  "speech": "resposta oral natural e curta",
  "notebook": ["linha 1", "linha 2", "linha 3"],
  "challenge": "pergunta curta para o aluno tentar sozinho",
  "needs_clarification": false
}`;

  const messages = [
    { role: 'system', content: system },
    ...history.slice(-8).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '') })),
    { role: 'user', content: question.trim() }
  ];

  try {
    const r = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-5.6-luna',
        messages,
        temperature: 0.45,
        response_format: { type: 'json_object' }
      })
    });

    const raw = await r.text();
    if (!r.ok) return res.status(r.status).json({ error: 'gateway_error', detail: raw.slice(0, 500) });
    const data = JSON.parse(raw);
    const text = data?.choices?.[0]?.message?.content || '{}';
    let parsed;
    try { parsed = JSON.parse(text); }
    catch { parsed = { speech: text, notebook: [], challenge: '', needs_clarification: false }; }

    return res.status(200).json({
      speech: String(parsed.speech || '').trim(),
      notebook: Array.isArray(parsed.notebook) ? parsed.notebook.map(String).slice(0, 12) : [],
      challenge: String(parsed.challenge || '').trim(),
      needs_clarification: Boolean(parsed.needs_clarification)
    });
  } catch (e) {
    return res.status(500).json({ error: 'tutor_failed', detail: String(e?.message || e) });
  }
}
