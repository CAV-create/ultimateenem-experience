// Preview do VAI BEM: POST para uso normal; GET com ?selftest=1 para autoteste seguro.
export default async function handler(req, res) {
  const isSelfTest = req.method === 'GET' && req.query?.selftest === '1';
  if (req.method !== 'POST' && !isSelfTest) return res.status(405).json({ error: 'method_not_allowed' });

  const payload = isSelfTest
    ? { question: 'Qual é a diferença entre álcool e fenol?', subject: 'Química Orgânica', grade: '2º ano do Ensino Médio', teacher: 'Prof. Rafael', history: [] }
    : (req.body || {});

  const { question = '', subject = 'Matemática', grade = '6º ano', teacher = 'Profa. Lia', history = [] } = payload;
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

  const models = [
    'google/gemini-3.6-flash',
    'openai/gpt-5.6-sol',
    'anthropic/claude-opus-5'
  ];

  const failures = [];

  try {
    for (const model of models) {
      const r = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.35
        })
      });

      const raw = await r.text();
      if (!r.ok) {
        failures.push({ model, status: r.status, detail: raw.slice(0, 400) });
        console.error('VAI_BEM_GATEWAY_MODEL_FAILURE', { model, status: r.status, detail: raw.slice(0, 400) });
        continue;
      }

      const data = JSON.parse(raw);
      const text = data?.choices?.[0]?.message?.content || '';
      let parsed;
      try {
        const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
        parsed = JSON.parse(cleaned);
      } catch {
        parsed = {
          speech: text || 'Vamos trabalhar esse ponto juntos.',
          notebook: [],
          challenge: '',
          needs_clarification: false
        };
      }

      return res.status(200).json({
        selftest: isSelfTest || undefined,
        model_used: model,
        speech: String(parsed.speech || '').trim(),
        notebook: Array.isArray(parsed.notebook) ? parsed.notebook.map(String).slice(0, 12) : [],
        challenge: String(parsed.challenge || '').trim(),
        needs_clarification: Boolean(parsed.needs_clarification)
      });
    }

    return res.status(502).json({
      error: 'all_gateway_models_failed',
      attempts: failures.map(f => ({ model: f.model, status: f.status, detail: f.detail }))
    });
  } catch (e) {
    console.error('VAI_BEM_TUTOR_FAILED', e);
    return res.status(500).json({ error: 'tutor_failed', detail: String(e?.message || e) });
  }
}
