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
  "speech": "resposta oral natural, clara e curta",
  "notebook": ["ponto essencial 1", "ponto essencial 2", "ponto essencial 3"],
  "challenge": "pergunta curta para o aluno tentar sozinho",
  "needs_clarification": false
}

Mantenha a resposta completa dentro desse JSON. Não acrescente nenhum texto antes ou depois.`;

  const messages = [
    { role: 'system', content: system },
    ...history.slice(-8).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '') })),
    { role: 'user', content: question.trim() }
  ];

  const models = [
    'minimax/minimax-m3-free',
    'inclusionai/ling-3.0-flash-vl-free',
    'inclusionai/ling-3.0-flash-sante-free'
  ];

  const failures = [];

  function unescapeJsonString(s='') {
    try { return JSON.parse('"' + s.replace(/\\?"/g, '\\"') + '"'); }
    catch { return s.replace(/\\n/g, ' ').replace(/\\"/g, '"').replace(/\\\\/g, '\\'); }
  }

  function parseTutorText(text='') {
    const cleaned = String(text).replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    try {
      const obj = JSON.parse(cleaned);
      return {
        speech: String(obj.speech || '').trim(),
        notebook: Array.isArray(obj.notebook) ? obj.notebook.map(String).filter(Boolean).slice(0, 8) : [],
        challenge: String(obj.challenge || '').trim(),
        needs_clarification: Boolean(obj.needs_clarification)
      };
    } catch {}

    // Recuperação robusta para modelos gratuitos que às vezes truncam JSON perto do final.
    const speechMatch = cleaned.match(/"speech"\s*:\s*"([\s\S]*?)"\s*,\s*"notebook"/i)
      || cleaned.match(/"speech"\s*:\s*"([\s\S]*?)(?:"\s*,|$)/i);
    const speech = speechMatch ? unescapeJsonString(speechMatch[1]).trim() : '';

    let notebook = [];
    const notebookBlock = cleaned.match(/"notebook"\s*:\s*\[([\s\S]*?)(?:\]\s*,\s*"challenge"|\]\s*[,}]|$)/i);
    if (notebookBlock) {
      notebook = [...notebookBlock[1].matchAll(/"((?:\\.|[^"\\])*)"/g)]
        .map(m => unescapeJsonString(m[1]).trim())
        .filter(Boolean)
        .slice(0, 8);
    }

    const challengeMatch = cleaned.match(/"challenge"\s*:\s*"([\s\S]*?)(?:"\s*,|"\s*}|$)/i);
    const challenge = challengeMatch ? unescapeJsonString(challengeMatch[1]).trim() : '';

    // Nunca devolve o JSON bruto para a interface.
    return {
      speech: speech || 'Vamos trabalhar esse ponto juntos. Vou registrar os pontos essenciais no caderno.',
      notebook: notebook.length ? notebook : [
        'Dúvida do aluno: ' + question.trim(),
        'Retome o conceito central explicado oralmente e identifique a diferença principal.',
        'Em seguida, aplique o conceito em um exemplo curto para verificar a compreensão.'
      ],
      challenge,
      needs_clarification: false
    };
  }

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
          temperature: 0.3,
          max_tokens: 1200
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
      const parsed = parseTutorText(text);

      return res.status(200).json({
        selftest: isSelfTest || undefined,
        model_used: model,
        speech: parsed.speech,
        notebook: parsed.notebook,
        challenge: parsed.challenge,
        needs_clarification: parsed.needs_clarification
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
