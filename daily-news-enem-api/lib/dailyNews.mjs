const FEEDS = [
  {
    section: "Brasil e cidadania",
    url:
      "https://news.google.com/rss/search?q=Brasil%20sociedade%20cidadania%20direitos%20pol%C3%ADtica%20p%C3%BAblica%20when:1d&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  },
  {
    section: "Educação e juventude",
    url:
      "https://news.google.com/rss/search?q=educa%C3%A7%C3%A3o%20escola%20juventude%20ENEM%20Brasil%20when:7d&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  },
  {
    section: "Ciência, saúde e ambiente",
    url:
      "https://news.google.com/rss/search?q=ci%C3%AAncia%20sa%C3%BAde%20meio%20ambiente%20clima%20tecnologia%20Brasil%20when:1d&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  },
  {
    section: "Economia e trabalho",
    url:
      "https://news.google.com/rss/search?q=economia%20trabalho%20renda%20desigualdade%20infla%C3%A7%C3%A3o%20Brasil%20when:1d&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  },
  {
    section: "Mundo e direitos humanos",
    url:
      "https://news.google.com/rss/search?q=mundo%20geopol%C3%ADtica%20migra%C3%A7%C3%B5es%20conflitos%20direitos%20humanos%20when:1d&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  },
  {
    section: "Cultura, linguagem e tecnologia",
    url:
      "https://news.google.com/rss/search?q=cultura%20linguagem%20m%C3%ADdia%20redes%20sociais%20tecnologia%20Brasil%20when:1d&hl=pt-BR&gl=BR&ceid=BR:pt-419",
  },
];

const ENEM_AREAS = ["Redação ENEM", "Linguagens", "Matemática", "Ciências Humanas", "Ciências da Natureza"];

const FALLBACK_SOURCES = [
  {
    id: 0,
    section: "Modo demonstração",
    title: "Configure internet e variáveis da API para gerar o plantão com notícias reais do dia",
    url: "https://news.google.com/topstories?hl=pt-BR&gl=BR&ceid=BR:pt-419",
    source: "Google Notícias",
    publishedAt: new Date().toISOString(),
  },
];

export async function buildDailyNewsBrief(_options = {}) {
  const headlines = await getHeadlines();
  const sources = headlines.length ? headlines : FALLBACK_SOURCES;
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;

  if (!apiKey || !model) {
    return {
      generatedAt: new Date().toISOString(),
      sourceCount: sources.length,
      brief: fallbackBrief(sources, !headlines.length),
      sources,
    };
  }

  try {
    const brief = normalizeBrief(await buildAiBrief({ headlines: sources, apiKey, model }), sources);
    return {
      generatedAt: new Date().toISOString(),
      sourceCount: sources.length,
      brief,
      sources,
    };
  } catch (error) {
    console.error("[ultimateenem-ai-news-fallback]", error);
    return {
      generatedAt: new Date().toISOString(),
      sourceCount: sources.length,
      brief: fallbackBrief(sources, !headlines.length, error),
      sources,
    };
  }
}

async function getHeadlines() {
  const batches = await Promise.allSettled(FEEDS.map(fetchFeed));
  const all = batches.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
  const seen = new Set();
  const deduped = [];

  for (const item of all) {
    const key = normalizeTitle(item.title);
    if (!item.title || !item.url || seen.has(key)) continue;
    seen.add(key);
    deduped.push({ ...item, id: deduped.length });
  }

  return deduped.slice(0, 48);
}

async function fetchFeed(feed) {
  const response = await fetch(feed.url, {
    headers: { "User-Agent": "ultimateenem-daily-news/1.0" },
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) throw new Error(`RSS falhou em ${feed.section}: ${response.status}`);

  const xml = await response.text();
  const items = parseRssItems(xml);

  return items.slice(0, 8).map((item, index) => ({
    id: index,
    section: feed.section,
    title: cleanText(item.title),
    url: item.link || "",
    source: cleanText(item.source || extractGoogleNewsSource(item.title) || feed.section),
    publishedAt: safeDate(item.pubDate),
  }));
}

function parseRssItems(xml) {
  return [...String(xml).matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((match) => {
    const raw = match[1];
    return {
      title: readTag(raw, "title"),
      link: readTag(raw, "link"),
      source: readTag(raw, "source"),
      pubDate: readTag(raw, "pubDate"),
    };
  });
}

function readTag(raw, tag) {
  const match = String(raw).match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

async function buildAiBrief({ headlines, apiKey, model }) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions: [
        "Você é um editor educacional brasileiro especializado exclusivamente no ENEM.",
        "Use somente as manchetes e metadados fornecidos. Não invente fatos, números, datas ou nomes.",
        "Quando a informação for insuficiente, escreva: 'segundo as manchetes capturadas'.",
        "Não cite UERJ, UFJF, PISM ou vestibulares específicos.",
        "Retorne exclusivamente JSON válido, sem markdown.",
        "O JSON deve ter: date, headline, enemFocus, sections e pedagogicalPick.",
        "enemFocus.redacao deve ter repertorio, possibleThemes e interventionAngles.",
        "Cada interventionAngle deve ter theme, agent, action, means, purpose e detail.",
        "enemFocus.objectiveAreas deve ter linguagens, matematica, cienciasHumanas e cienciasDaNatureza.",
        "Cada section deve ter title e bullets. Cada bullet deve ter title, summary, enemUse, enemAreas e sourceIds.",
        "pedagogicalPick deve ter title, reason, suggestedUse, enemAreas e sourceIds.",
        "sourceIds deve conter apenas IDs reais da lista recebida.",
        "O tom deve ser de cursinho forte, direto, motivador e tecnicamente cuidadoso para ENEM.",
      ].join("\n"),
      input: JSON.stringify({
        date: todayInSaoPaulo(),
        task: "Gerar plantão diário de atualidades para o app ultimateENEM experience.",
        allowedAreas: ENEM_AREAS,
        headlines,
        outputShape: {
          date: "YYYY-MM-DD",
          headline: "frase-síntese do dia",
          enemFocus: {
            redacao: {
              repertorio: "repertório sociocultural aproveitável em texto dissertativo-argumentativo",
              possibleThemes: ["tema 1", "tema 2", "tema 3"],
              interventionAngles: [
                {
                  theme: "tema",
                  agent: "agente",
                  action: "ação",
                  means: "meio/modo",
                  purpose: "finalidade",
                  detail: "detalhamento",
                },
              ],
            },
            objectiveAreas: {
              linguagens: ["uso didático"],
              matematica: ["uso didático"],
              cienciasHumanas: ["uso didático"],
              cienciasDaNatureza: ["uso didático"],
            },
          },
          sections: [
            {
              title: "seção",
              bullets: [
                {
                  title: "notícia",
                  summary: "síntese cuidadosa",
                  enemUse: "como usar no ENEM",
                  enemAreas: ["Redação ENEM"],
                  sourceIds: [0],
                },
              ],
            },
          ],
          pedagogicalPick: {
            title: "melhor aposta pedagógica do dia",
            reason: "justificativa",
            suggestedUse: "como usar no treino",
            enemAreas: ["Redação ENEM"],
            sourceIds: [0],
          },
        },
      }),
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.message || `OpenAI respondeu ${response.status}`);
  }

  return extractJson(readResponseText(payload));
}

function fallbackBrief(sources, offline = false, error = null) {
  const grouped = groupBy(sources.slice(0, 24), (item) => item.section || "Atualidades");
  const headline = offline
    ? "Plantão ENEM em modo demonstração"
    : "Plantão automático de manchetes com foco no ENEM";
  const warning = error
    ? "A análise com IA não foi concluída agora; o app manteve uma triagem básica para não interromper o estudo."
    : "Configure OPENAI_API_KEY e OPENAI_MODEL para receber a análise completa de repertório, temas e intervenção.";

  return {
    date: todayInSaoPaulo(),
    headline,
    enemFocus: {
      redacao: {
        repertorio: offline
          ? "Use este modo apenas para testar a tela. O repertório real depende das manchetes do dia e da análise do endpoint publicado."
          : "As manchetes capturadas podem virar repertório sociocultural quando conectadas a problema social, grupo afetado, causa e consequência.",
        possibleThemes: [
          "Desafios para garantir cidadania e acesso a direitos no Brasil",
          "Caminhos para fortalecer a educação midiática entre jovens brasileiros",
          "A importância da ciência e da política pública para a proteção coletiva",
        ],
        interventionAngles: [
          {
            theme: "Educação midiática e cidadania",
            agent: "Ministério da Educação, em parceria com escolas públicas",
            action: "implementar oficinas de leitura crítica de notícias",
            means: "por meio de projetos interdisciplinares com análise de fontes, dados e linguagem",
            purpose: "reduzir desinformação e fortalecer a participação cidadã dos estudantes",
            detail: "com produção de textos argumentativos, debates orientados e checagem de fontes originais",
          },
        ],
      },
      objectiveAreas: {
        linguagens: ["Analisar manchetes, editoriais, campanhas, gêneros digitais e estratégias argumentativas."],
        matematica: ["Converter dados citados nas notícias em percentuais, gráficos, médias, taxas e comparação de grandezas."],
        cienciasHumanas: ["Relacionar fatos atuais a cidadania, território, trabalho, direitos humanos e políticas públicas."],
        cienciasDaNatureza: ["Aproximar saúde, ambiente, clima, energia e tecnologia de evidências científicas e impactos sociais."],
      },
    },
    sections: Object.entries(grouped).map(([section, items]) => ({
      title: section,
      bullets: items.slice(0, 4).map((item) => ({
        title: item.title,
        summary: offline
          ? warning
          : "Manchete capturada automaticamente. Valide a fonte original antes de usar como repertório em texto ou aula.",
        enemUse: "Procure problema social, causa, consequência, grupo afetado, dados e possível intervenção.",
        enemAreas: ["Redação ENEM", "Ciências Humanas", "Linguagens"],
        sourceIds: [item.id],
      })),
    })),
    pedagogicalPick: {
      title: offline ? "Conectar endpoint real" : sources[0]?.title || "Escolha a notícia com maior força ENEM",
      reason: warning,
      suggestedUse: "Transformar a notícia em tese, repertório produtivo, parágrafo autoral e proposta C5 completa.",
      enemAreas: ["Redação ENEM", "Ciências Humanas", "Linguagens"],
      sourceIds: sources.slice(0, 3).map((item) => item.id),
    },
  };
}

function normalizeBrief(brief, sources) {
  const safe = brief && typeof brief === "object" ? brief : {};
  const fallback = fallbackBrief(sources);
  return {
    date: safe.date || fallback.date,
    headline: safe.headline || fallback.headline,
    enemFocus: {
      redacao: {
        repertorio: safe.enemFocus?.redacao?.repertorio || fallback.enemFocus.redacao.repertorio,
        possibleThemes: asTextArray(safe.enemFocus?.redacao?.possibleThemes, fallback.enemFocus.redacao.possibleThemes),
        interventionAngles: Array.isArray(safe.enemFocus?.redacao?.interventionAngles)
          ? safe.enemFocus.redacao.interventionAngles
          : fallback.enemFocus.redacao.interventionAngles,
      },
      objectiveAreas: {
        linguagens: asTextArray(safe.enemFocus?.objectiveAreas?.linguagens, fallback.enemFocus.objectiveAreas.linguagens),
        matematica: asTextArray(safe.enemFocus?.objectiveAreas?.matematica, fallback.enemFocus.objectiveAreas.matematica),
        cienciasHumanas: asTextArray(
          safe.enemFocus?.objectiveAreas?.cienciasHumanas,
          fallback.enemFocus.objectiveAreas.cienciasHumanas,
        ),
        cienciasDaNatureza: asTextArray(
          safe.enemFocus?.objectiveAreas?.cienciasDaNatureza,
          fallback.enemFocus.objectiveAreas.cienciasDaNatureza,
        ),
      },
    },
    sections: Array.isArray(safe.sections) ? safe.sections : fallback.sections,
    pedagogicalPick: safe.pedagogicalPick || fallback.pedagogicalPick,
  };
}

function readResponseText(payload) {
  if (typeof payload.output_text === "string") return payload.output_text;
  const texts = [];
  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") texts.push(content.text);
    }
  }
  return texts.join("\n");
}

function extractJson(text) {
  const start = String(text).indexOf("{");
  const end = String(text).lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("A IA não retornou JSON válido.");
  return JSON.parse(String(text).slice(start, end + 1));
}

function todayInSaoPaulo() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function normalizeTitle(title) {
  return cleanText(title)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractGoogleNewsSource(title = "") {
  const parts = String(title).split(" - ");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

function safeDate(value) {
  const date = new Date(String(value || ""));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function cleanText(value) {
  return decodeXml(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeXml(value = "") {
  return String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function groupBy(items, keyFn) {
  return items.reduce((groups, item) => {
    const key = keyFn(item);
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});
}

function asTextArray(value, fallback) {
  const array = Array.isArray(value) ? value : typeof value === "string" ? [value] : [];
  const cleaned = array.map((item) => String(item || "").trim()).filter(Boolean);
  return cleaned.length ? cleaned : fallback;
}
