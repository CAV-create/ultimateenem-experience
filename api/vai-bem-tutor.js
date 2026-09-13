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

  const system = `Você é ${teacher}, professor particular digital do VAI BEM. Fale em português do Brasil, de forma espontânea, humana, breve e didática. O aluno está em ${grade}, na disciplina ${subject}.

Seu comportamento deve parecer o de um professor particular sentado ao lado do aluno e escrevendo no papel enquanto explica:
- responda exatamente à dúvida atual;
- NÃO faça aula expositiva longa;
- explique em 2 a 4 passos curtos;
- cada passo deve conter uma fala natural e uma anotação curta;
- a anotação deve corresponder diretamente à mesma ideia que está sendo falada naquele passo;
- sempre que possível, faça a fala começar pela própria frase que será escrita, para permitir fala e escrita simultâneas;
- cada anotação deve ser uma frase, conceito, fórmula ou exemplo completo, sem abreviações desnecessárias;
- use português brasileiro natural e terminologia correta da disciplina;
- em Química, prefira pronúncias e grafias brasileiras usuais: íon, ânion, cátion, enolato, fenóxido, pKa;
- use o histórico apenas para continuidade dentro desta disciplina;
- se o aluno mudar de assunto, acompanhe a nova dúvida sem insistir no tópico anterior;
- se a pergunta atual for muito curta ou ambígua, interprete-a à luz da última pergunta do aluno; se ainda assim faltar contexto, faça UMA pergunta curta de esclarecimento;
- quando couber, termine com um microdesafio para verificar compreensão;
- não entregue respostas prontas de avaliações em andamento; conduza pelo raciocínio;
- o VAI BEM é intervenção individual, não videoaula.

Retorne APENAS JSON válido, curto, sem markdown, neste formato:
{
  "steps": [
    {"speech":"frase curta que o professor fala enquanto escreve","note":"frase curta que aparece no caderno"},
    {"speech":"próxima frase curta","note":"segunda anotação"}
  ],
  "challenge":"microdesafio curto ou vazio",
  "needs_clarification":false
}

Cada speech deve ter no máximo 22 palavras. Cada note deve ter no máximo 120 caracteres. Evite repetir introduções como 'ótima pergunta'.`;

  const compactHistory = history.slice(-5).map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, 700)
  }));

  const messages = [
    { role: 'system', content: system },
    ...compactHistory,
    { role: 'user', content: question.trim() }
  ];

  const models = [
    'minimax/minimax-m3-free',
    'inclusionai/ling-3.0-flash-vl-free',
    'inclusionai/ling-3.0-flash-sante-free'
  ];

  const failures = [];

  function cleanFence(text='') {
    return String(text).replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  }

  function parseTutorText(text='') {
    const cleaned = cleanFence(text);
    try {
      const obj = JSON.parse(cleaned);
      const steps = Array.isArray(obj.steps)
        ? obj.steps.map(s => ({ speech: String(s?.speech || '').trim(), note: String(s?.note || '').trim() })).filter(s => s.speech || s.note).slice(0, 4)
        : [];
      if (steps.length) return { steps, challenge: String(obj.challenge || '').trim(), needs_clarification: Boolean(obj.needs_clarification) };
    } catch {}

    const steps = [];
    const pairRe = /"speech"\s*:\s*"([\s\S]*?)"\s*,\s*"note"\s*:\s*"([\s\S]*?)"/g;
    for (const m of cleaned.matchAll(pairRe)) {
      const speech = m[1].replace(/\\n/g,' ').replace(/\\"/g,'"').trim();
      const note = m[2].replace(/\\n/g,' ').replace(/\\"/g,'"').trim();
      if (speech || note) steps.push({ speech, note });
      if (steps.length >= 4) break;
    }

    if (!steps.length) {
      steps.push({
        speech: 'Vamos localizar exatamente o ponto da sua dúvida.',
        note: 'Dúvida: ' + question.trim().slice(0, 100)
      });
    }

    const challengeMatch = cleaned.match(/"challenge"\s*:\s*"([\s\S]*?)(?:"\s*,|"\s*}|$)/i);
    const challenge = challengeMatch ? challengeMatch[1].replace(/\\n/g,' ').replace(/\\"/g,'"').trim() : '';
    return { steps, challenge, needs_clarification: false };
  }

  try {
    for (const model of models) {
      const r = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages, temperature: 0.2, max_tokens: 600 })
      });

      const raw = await r.text();
      if (!r.ok) {
        failures.push({ model, status: r.status, detail: raw.slice(0, 300) });
        console.error('VAI_BEM_GATEWAY_MODEL_FAILURE', { model, status: r.status, detail: raw.slice(0, 300) });
        continue;
      }

      const data = JSON.parse(raw);
      const text = data?.choices?.[0]?.message?.content || '';
      const parsed = parseTutorText(text);
      return res.status(200).json({
        selftest: isSelfTest || undefined,
        model_used: model,
        steps: parsed.steps,
        speech: parsed.steps.map(s => s.speech).filter(Boolean).join(' '),
        notebook: parsed.steps.map(s => s.note).filter(Boolean),
        challenge: parsed.challenge,
        needs_clarification: parsed.needs_clarification
      });
    }

    return res.status(502).json({ error: 'all_gateway_models_failed', attempts: failures });
  } catch (e) {
    console.error('VAI_BEM_TUTOR_FAILED', e);
    return res.status(500).json({ error: 'tutor_failed', detail: String(e?.message || e) });
  }
}
