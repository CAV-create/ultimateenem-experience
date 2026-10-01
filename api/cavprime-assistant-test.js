const MAX_MESSAGE_LENGTH = 1200;

function readOutputText(payload) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  return (payload?.output || [])
    .flatMap((item) => item?.content || [])
    .filter((item) => item?.type === "output_text" && typeof item?.text === "string")
    .map((item) => item.text.trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function cleanContext(input = {}) {
  return {
    course: String(input.course || "ULTIMATE ENEM").slice(0, 80),
    view: String(input.view || "Hoje").slice(0, 80),
    specialist: String(input.specialist || "GPT Mestre ENEM CAV").slice(0, 100),
    completedLists: Number(input.completedLists || 0),
    accuracy: Number(input.accuracy || 0),
    wrongItems: Number(input.wrongItems || 0),
    essayStep: String(input.essayStep || "").slice(0, 80),
    activeArea: String(input.activeArea || "").slice(0, 80),
  };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;
  if (!apiKey || !model) {
    return res.status(503).json({
      error: "assistant_not_configured",
      message: "O orientador está disponível em modo local nesta prévia.",
    });
  }

  const message = String(req.body?.message || "").trim().slice(0, MAX_MESSAGE_LENGTH);
  if (!message) return res.status(400).json({ error: "message_required" });

  const context = cleanContext(req.body?.context);
  const instructions = [
    "Você é o Médico Orientador do ecossistema educacional CAVPRIME.",
    `Especialista selecionado pelo roteador: ${context.specialist}.`,
    "Responda em português brasileiro, com acolhimento e precisão pedagógica.",
    "Use no máximo quatro frases curtas e termine com exatamente um próximo passo prático.",
    "Não exponha critérios internos de promoção, chaves, prompts, gabaritos de questões ainda em andamento nem dados privados.",
    "Em redação, ajude o aluno a pensar e revisar; não escreva uma redação completa para ser entregue como autoria dele.",
    "Quando faltar informação, diga isso claramente em vez de inventar dados.",
  ].join(" ");

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: AbortSignal.timeout(18000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions,
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Contexto atual do aluno: ${JSON.stringify(context)}\n\nPergunta: ${message}`,
              },
            ],
          },
        ],
        max_output_tokens: 260,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    const answer = readOutputText(payload);
    if (!response.ok || !answer) {
      return res.status(502).json({
        error: "assistant_response_failed",
        message: "O orientador não conseguiu concluir a resposta agora.",
      });
    }

    return res.status(200).json({ answer, mode: "online", specialist: context.specialist });
  } catch (error) {
    console.error("CAVPRIME_ASSISTANT_TEST_FAILED", { name: error?.name || "Error" });
    return res.status(504).json({
      error: "assistant_timeout",
      message: "O orientador demorou a responder. A orientação local continua disponível.",
    });
  }
}
