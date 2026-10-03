export const config = { maxDuration: 240 };

let enemProtocolPromise;

function loadEnemProtocol() {
  if (!enemProtocolPromise) {
    // Vercel empacota este endpoint como CommonJS. O import dinamico preserva
    // a compatibilidade com o modulo ESM sem converter a carga em require().
    enemProtocolPromise = import("./_lib/enem-redaction-2026.mjs");
  }
  return enemProtocolPromise;
}

const MAX_ESSAY_LENGTH = 16000;
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);
const TRANSIENT_PROVIDER_STATUSES = new Set([429, 500, 502, 503, 504]);
const REDACTION_RETRY_DELAYS_MS = Object.freeze([1800, 5200, 14000]);
const GEMINI_REVIEW_SPACING_MS = 1400;
const EVALUATION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["resultStatus", "humanRightsViolation", "band", "summary", "overallDiagnosis", "paragraphFeedback", "projectAlignment", "rewritePlan", "competencies"],
  properties: {
    resultStatus: {
      type: "string",
      enum: ["valid", "blank", "insufficient_text", "theme_escape", "wrong_text_type", "annulled", "unreadable", "foreign_language"],
    },
    humanRightsViolation: { type: "boolean" },
    band: { type: "string" },
    summary: { type: "string" },
    overallDiagnosis: {
      type: "object",
      additionalProperties: false,
      required: ["strongestPoint", "priority", "projectReading", "progressionPotential"],
      properties: {
        strongestPoint: { type: "string" },
        priority: { type: "string" },
        projectReading: { type: "string" },
        progressionPotential: { type: "string" },
      },
    },
    paragraphFeedback: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["section", "status", "diagnosis", "rewriteFocus"],
        properties: {
          section: { type: "string" },
          status: { type: "string" },
          diagnosis: { type: "string" },
          rewriteFocus: { type: "string" },
        },
      },
    },
    projectAlignment: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["element", "status", "evidence"],
        properties: {
          element: { type: "string" },
          status: { type: "string" },
          evidence: { type: "string" },
        },
      },
    },
    rewritePlan: {
      type: "array",
      minItems: 3,
      maxItems: 4,
      items: { type: "string" },
    },
    competencies: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["score", "analysis", "evidence", "nextStep", "strength", "limitation", "descriptorMatch", "whyNotHigher", "rewriteExample"],
        properties: {
          score: { type: "integer", enum: [0, 40, 80, 120, 160, 200] },
          analysis: { type: "string" },
          evidence: { type: "string" },
          nextStep: { type: "string" },
          strength: { type: "string" },
          limitation: { type: "string" },
          descriptorMatch: { type: "string" },
          whyNotHigher: { type: "string" },
          rewriteExample: { type: "string" },
        },
      },
    },
  },
};

function readOutputText(payload) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) return payload.output_text.trim();
  return (payload?.output || [])
    .flatMap((item) => item?.content || [])
    .filter((item) => item?.type === "output_text" && typeof item?.text === "string")
    .map((item) => item.text.trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function readGeminiText(payload) {
  return (payload?.candidates || [])
    .flatMap((candidate) => candidate?.content?.parts || [])
    .map((part) => typeof part?.text === "string" ? part.text.trim() : "")
    .filter(Boolean)
    .join("\n")
    .trim();
}

function parseJson(text) {
  return JSON.parse(String(text || "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim());
}

function safeText(value, max = 1000) {
  return String(value || "").trim().slice(0, max);
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function durationToMilliseconds(value) {
  const match = String(value || "").trim().match(/^(\d+(?:\.\d+)?)s$/i);
  return match ? Math.round(Number(match[1]) * 1000) : 0;
}

function retryAfterMilliseconds(response, payload) {
  const retryAfter = response?.headers?.get?.("retry-after");
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds >= 0) return Math.round(seconds * 1000);
    const date = Date.parse(retryAfter);
    if (Number.isFinite(date)) return Math.max(0, date - Date.now());
  }
  const retryInfo = (payload?.error?.details || []).find((item) => (
    String(item?.["@type"] || "").endsWith("google.rpc.RetryInfo")
  ));
  return durationToMilliseconds(retryInfo?.retryDelay);
}

function normalizeManuscript(value) {
  if (!value || typeof value !== "object") return null;
  const fileName = safeText(value.fileName || "redacao", 180);
  const mimeType = safeText(value.mimeType, 80).toLowerCase();
  const dataUrl = String(value.dataUrl || "");
  if (!ALLOWED_FILE_TYPES.has(mimeType)) throw new Error("unsupported_manuscript");
  const match = dataUrl.match(/^data:([^;,]+);base64,([A-Za-z0-9+/=]+)$/);
  if (!match || match[1].toLowerCase() !== mimeType) throw new Error("invalid_manuscript");
  const size = Buffer.byteLength(Buffer.from(match[2], "base64"));
  if (!size || size > MAX_FILE_BYTES) throw new Error("manuscript_too_large");
  return { fileName, mimeType, dataUrl };
}

function buildEssayInput(theme, essay, project, previousEvaluations = null) {
  const input = {
    theme,
    project: {
      problem: safeText(project.problem, 1200),
      affected: safeText(project.affected, 800),
      causes: safeText(project.causes, 1200),
      thesis: safeText(project.thesis, 1200),
      axis1: safeText(project.axis1, 1200),
      axis2: safeText(project.axis2, 1200),
      repertory: safeText(project.repertory, 1200),
    },
    essay: essay || "Redação manuscrita anexada ao pedido de correção.",
  };
  if (previousEvaluations) input.previousEvaluations = previousEvaluations;
  return input;
}

function buildContent(input, manuscript) {
  const content = [{ type: "input_text", text: JSON.stringify(input) }];
  if (!manuscript) return content;
  if (manuscript.mimeType === "application/pdf") {
    content.push({ type: "input_file", filename: manuscript.fileName, file_data: manuscript.dataUrl });
  } else {
    content.push({ type: "input_image", image_url: manuscript.dataUrl, detail: "high" });
  }
  return content;
}

async function requestOpenAIEvaluation({ apiKey, model, instructions, input, manuscript, timeout = 60000 }) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    signal: AbortSignal.timeout(timeout),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions,
      input: [{ role: "user", content: buildContent(input, manuscript) }],
      max_output_tokens: 6500,
      store: false,
      text: {
        format: {
          type: "json_schema",
          name: "cavprime_enem_redaction_evaluation",
          strict: true,
          schema: EVALUATION_SCHEMA,
        },
      },
    }),
  });
  const payload = await response.json().catch(() => ({}));
  const outputText = readOutputText(payload);
  if (!response.ok || !outputText) {
    const error = new Error("review_response_failed");
    error.upstream = {
      status: response.status,
      code: payload?.error?.code || "",
      type: payload?.error?.type || "",
    };
    throw error;
  }
  return parseJson(outputText);
}

async function requestGeminiEvaluation({ apiKey, model, instructions, input, manuscript, timeout = 60000 }) {
  const cleanModel = String(model || "gemini-3.8-flash").replace(/^models\//, "");
  if (!/^[a-z0-9._-]+$/i.test(cleanModel)) throw new Error("gemini_model_invalid");
  const parts = [
    { text: `${instructions}\nESQUEMA JSON OBRIGATORIO: ${JSON.stringify(EVALUATION_SCHEMA)}` },
    { text: JSON.stringify(input) },
  ];
  if (manuscript) {
    const match = manuscript.dataUrl.match(/^data:([^;,]+);base64,([A-Za-z0-9+/=]+)$/);
    if (!match) throw new Error("invalid_manuscript");
    parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
  }
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent`, {
    method: "POST",
    signal: AbortSignal.timeout(timeout),
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 6500,
      },
    }),
  });
  const payload = await response.json().catch(() => ({}));
  const outputText = readGeminiText(payload);
  if (!response.ok || !outputText) {
    const error = new Error("review_response_failed");
    error.upstream = {
      provider: "gemini",
      status: response.status,
      code: payload?.error?.status || "",
      type: payload?.error?.code || "",
    };
    error.retryAfterMs = retryAfterMilliseconds(response, payload);
    throw error;
  }
  return parseJson(outputText);
}

async function requestEvaluation({ providers, instructions, input, manuscript, timeout = 60000 }) {
  let lastError = null;
  if (providers.openAIKey && providers.openAIModel) {
    try {
      return await requestOpenAIEvaluation({
        apiKey: providers.openAIKey,
        model: providers.openAIModel,
        instructions,
        input,
        manuscript,
        timeout,
      });
    } catch (error) {
      lastError = error;
    }
  }
  if (providers.geminiKey) {
    const models = Array.from(new Set([
      providers.geminiModel,
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
    ].filter(Boolean)));
    for (const model of models) {
      for (let attempt = 0; attempt <= REDACTION_RETRY_DELAYS_MS.length; attempt += 1) {
        try {
          return await requestGeminiEvaluation({
            apiKey: providers.geminiKey,
            model,
            instructions,
            input,
            manuscript,
            timeout,
          });
        } catch (error) {
          lastError = error;
          const status = error?.upstream?.status;
          if (status === 404) break;
          if (!TRANSIENT_PROVIDER_STATUSES.has(status)) throw error;
          if (attempt >= REDACTION_RETRY_DELAYS_MS.length) throw error;
          const providerDelay = Math.min(Math.max(Number(error?.retryAfterMs) || 0, 0), 30000);
          await wait(Math.max(REDACTION_RETRY_DELAYS_MS[attempt], providerDelay));
        }
      }
    }
  }
  throw lastError || new Error("review_provider_unavailable");
}

async function requestInitialEvaluations({ providers, buildEvaluatorInstructions, input, manuscript }) {
  const requestReader = (id) => requestEvaluation({
    providers,
    instructions: buildEvaluatorInstructions(id),
    input,
    manuscript,
  });
  const geminiIsPrimary = Boolean(
    providers.geminiKey
    && !(providers.openAIKey && providers.openAIModel),
  );
  if (!geminiIsPrimary) {
    return Promise.all([requestReader("1"), requestReader("2")]);
  }
  // Mantem pareceres cegos e independentes, mas evita que duas requisicoes
  // simultaneas disputem a mesma cota do plantao Gemini.
  const first = await requestReader("1");
  await wait(GEMINI_REVIEW_SPACING_MS);
  const second = await requestReader("2");
  return [first, second];
}

function publicEvaluator(evaluation) {
  return {
    id: evaluation.evaluatorId,
    total: evaluation.total,
    resultStatus: evaluation.resultStatus,
    competencies: evaluation.competencies.map((item) => ({ code: item.code, score: item.score })),
  };
}

function publicDiscrepancy(comparison) {
  return {
    detected: comparison.detected,
    totalDifference: comparison.totalDifference,
    competencyDifferences: comparison.competencyDifferences,
    situationDivergence: comparison.situationDivergence,
    reasons: comparison.reasons,
  };
}

export default async function handler(req, res) {
  const startedAt = Date.now();
  res.setHeader("Cache-Control", "no-store, max-age=0");
  let protocol;
  try {
    protocol = await loadEnemProtocol();
  } catch (error) {
    console.error(JSON.stringify({
      level: "error",
      message: "CAVPRIME_REDACTION_PROTOCOL_LOAD_FAILED",
      error: error?.message || String(error),
      durationMs: Date.now() - startedAt,
    }));
    return res.status(500).json({
      error: "review_protocol_unavailable",
      message: "O protocolo da banca nao foi carregado. Nenhuma nota foi registrada.",
    });
  }
  const {
    ENEM_REDACTION_PROTOCOL_VERSION,
    buildBoardInstructions,
    buildEvaluatorInstructions,
    buildFinalFromPair,
    chooseClosestPair,
    compareEvaluations,
    sanitizeEvaluation,
  } = protocol;
  const providers = {
    openAIKey: process.env.OPENAI_API_KEY,
    openAIModel: process.env.OPENAI_REDACTION_MODEL || process.env.OPENAI_MODEL,
    geminiKey: process.env.GEMINI_API_KEY,
    geminiModel: process.env.GEMINI_REDACTION_MODEL || process.env.GEMINI_VISION_MODEL || "gemini-3.8-flash",
  };
  const configured = Boolean(
    (providers.openAIKey && providers.openAIModel)
    || providers.geminiKey,
  );
  if (req.method === "GET") {
    return res.status(200).json({
      configured,
      missing: configured ? [] : ["REDACTION_REVIEW_PROVIDER"],
      protocolVersion: ENEM_REDACTION_PROTOCOL_VERSION,
    });
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  if (!configured) {
    return res.status(503).json({
      error: "review_not_configured",
      message: "A banca inteligente ainda não está configurada neste ambiente.",
    });
  }

  const theme = safeText(req.body?.theme, 500);
  const essay = safeText(req.body?.essay, MAX_ESSAY_LENGTH);
  const project = req.body?.project && typeof req.body.project === "object" ? req.body.project : {};
  let manuscript = null;
  try {
    manuscript = normalizeManuscript(req.body?.manuscript);
  } catch (error) {
    return res.status(400).json({ error: error?.message || "invalid_manuscript" });
  }
  if (!theme || (!manuscript && essay.split(/\s+/).filter(Boolean).length < 80)) {
    return res.status(400).json({ error: "essay_too_short" });
  }

  const baseInput = buildEssayInput(theme, essay, project);

  try {
    const [rawA, rawB] = await requestInitialEvaluations({
      providers,
      buildEvaluatorInstructions,
      input: baseInput,
      manuscript,
    });
    const evaluatorA = sanitizeEvaluation(rawA, "1");
    const evaluatorB = sanitizeEvaluation(rawB, "2");
    const initialComparison = compareEvaluations(evaluatorA, evaluatorB);
    const evaluators = [evaluatorA, evaluatorB];
    let finalReview;
    let resolution = "mean_two";
    let selectedEvaluators = ["1", "2"];
    let boardUsed = false;

    if (!initialComparison.detected) {
      finalReview = buildFinalFromPair(evaluatorA, evaluatorB);
    } else {
      const rawC = await requestEvaluation({
        providers,
        instructions: buildEvaluatorInstructions("3"),
        input: baseInput,
        manuscript,
      });
      const evaluatorC = sanitizeEvaluation(rawC, "3");
      evaluators.push(evaluatorC);
      const closestPair = chooseClosestPair(evaluators);
      if (closestPair) {
        finalReview = buildFinalFromPair(...closestPair.evaluations);
        selectedEvaluators = closestPair.evaluations.map((item) => item.evaluatorId);
        resolution = "third_evaluator_closest_pair";
      } else {
        const boardInput = buildEssayInput(theme, essay, project, evaluators.map((evaluation) => ({
          evaluator: evaluation.evaluatorId,
          resultStatus: evaluation.resultStatus,
          total: evaluation.total,
          summary: evaluation.summary,
          competencies: evaluation.competencies,
        })));
        const rawBoard = await requestEvaluation({
          providers,
          instructions: buildBoardInstructions(),
          input: boardInput,
          manuscript,
          timeout: 75000,
        });
        const board = sanitizeEvaluation(rawBoard, "Banca");
        evaluators.push(board);
        finalReview = {
          total: board.total,
          band: board.band,
          summary: board.summary,
          overallDiagnosis: board.overallDiagnosis,
          paragraphFeedback: board.paragraphFeedback,
          projectAlignment: board.projectAlignment,
          rewritePlan: board.rewritePlan,
          competencies: board.competencies,
          selectedEvaluators: ["Banca"],
        };
        selectedEvaluators = ["Banca"];
        resolution = "review_board";
        boardUsed = true;
      }
    }

    return res.status(200).json({
      review: {
        ...finalReview,
        protocolVersion: ENEM_REDACTION_PROTOCOL_VERSION,
        correctionProcess: {
          initialReaders: 2,
          evaluators: evaluators.map(publicEvaluator),
          discrepancy: publicDiscrepancy(initialComparison),
          resolution,
          selectedEvaluators,
          thirdEvaluatorUsed: evaluators.some((item) => item.evaluatorId === "3"),
          boardUsed,
        },
      },
      mode: "online",
    });
  } catch (error) {
    console.error("CAVPRIME_REDACTION_REVIEW_TEST_FAILED", {
      name: error?.name || "Error",
      message: error?.message || "",
      upstream: error?.upstream || null,
    });
    const upstreamStatus = Number(error?.upstream?.status) || 0;
    const providerBusy = upstreamStatus === 429 || upstreamStatus === 503;
    if (providerBusy) res.setHeader("Retry-After", "45");
    return res.status(providerBusy ? 503 : error?.message === "review_response_failed" ? 502 : 504).json({
      error: providerBusy
        ? "review_busy"
        : error?.message === "review_response_failed"
          ? "review_response_failed"
          : "review_timeout",
      message: providerBusy
        ? "O corpo clínico está com a capacidade momentaneamente ocupada. O prontuário foi preservado para nova tentativa automática."
        : "A banca não concluiu todas as leituras necessárias. Nenhuma nota foi registrada.",
      ...(providerBusy ? { retryAfterSeconds: 45 } : {}),
    });
  }
}
