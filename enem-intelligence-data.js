window.ENEM_INTELLIGENCE_DATA = {
  generatedAt: "2026-06-18",
  title: "Motor interno de inteligencia ENEM Medicina",
  visibility: "internal-engine-only",
  primaryUse:
    "Ajustar escolha de questoes para plantoes medicos, simulados, listas e revisao pos-erro sem exibir estes dados ao aluno.",
  sources: [
    {
      file: "RANKING ENEM HABILIDADES.pdf",
      role: "Regua estrategica de TRI, frequencia, habilidades criticas para Medicina, emergentes e em declinio.",
    },
    {
      file: "Como_sao_montadas_as_questoes_do_ENEM_Bastidores_do_BNI_e_INEP.pdf",
      role: "Criterios internos de qualidade de item: texto-base, comando, alternativas, distratores, matriz, pre-teste e TRI.",
    },
  ],
  humanasCav2020_2025: {
    status: "local_app_ready",
    schemaVersion: "humanas_2020_2025_cav_v2",
    source: {
      label: "Base pedagógica interna CAVMED",
      workbookSheetsAudited: 58,
    },
    scope: {
      areaEnem: "CH",
      areaName: "Ciências Humanas e suas Tecnologias",
      yearsMain: [2020, 2021, 2022, 2023, 2024, 2025],
      applications: ["Primeira aplicação regular"],
      control2015Rows: 10,
    },
    metrics: {
      items: 270,
      alternatives: 1350,
      distractors: 1080,
      literalCorrectAnswers: 270,
      recurrenceFamilies: 37,
      recurrenceMatrixItems: 270,
      archaeologySheets: 19,
      synthesisSheets: 19,
      evidenceSheets: 4,
      sanitationSources: 38,
      sanitationLogEntries: 840,
      disciplines: {
        Geografia: 90,
        História: 79,
        Sociologia: 52,
        Filosofia: 49,
      },
      answerKeys: {
        A: 57,
        B: 58,
        C: 51,
        D: 53,
        E: 51,
      },
      topSkills: {
        "CH:H23": 13,
        "CH:H03": 12,
        "CH:H27": 12,
        "CH:H05": 12,
        "CH:H01": 12,
        "CH:H26": 11,
        "CH:H11": 11,
        "CH:H06": 10,
        "CH:H15": 10,
        "CH:H16": 10,
        "CH:H07": 10,
      },
      triParameterB: {
        min: -0.9257,
        p25: 0.5101,
        median: 0.9396,
        p75: 1.4236,
        max: 11.1422,
      },
      dVectorMeans: {
        external: 2.8,
        internal: 4.31,
        inference: 3.22,
        redundancy: 1.19,
        specialistGain: 3.77,
        transfer: 4.15,
        literalness: 2.56,
      },
    },
    priority2026: {
      familyCounts: {
        "A - prioridade maxima": 19,
        "B - prioridade alta": 15,
        "C - complementar": 3,
      },
      recurrenceLevels: {
        "Transversal - presente nas 6 edicoes": 10,
        "Muito recorrente - presente em 4 ou 5 edicoes": 18,
        "Recorrente - presente em 3 edicoes": 6,
        "Recorrencia moderada - presente em 2 edicoes": 2,
        "Pontual - presente em 1 edicao": 1,
      },
      topFamilies: [
        {
          code: "F02",
          macroaxis: "Filosofia, conhecimento e existência",
          family: "Conhecimento, linguagem, percepção e ciência",
          priority: "A - prioridade maxima",
          items: 14,
        },
        {
          code: "C01",
          macroaxis: "Identidades, cultura e relações sociais",
          family: "Gênero, mulheres, corpo e divisão sexual",
          priority: "A - prioridade maxima",
          items: 14,
        },
        {
          code: "E01",
          macroaxis: "Natureza, ambiente e recursos",
          family: "Clima, atmosfera, água e mudanças climáticas",
          priority: "A - prioridade maxima",
          items: 13,
        },
        {
          code: "A03",
          macroaxis: "Poder, Estado e cidadania",
          family: "Repressão, disciplina, censura e controle social",
          priority: "A - prioridade maxima",
          items: 12,
        },
      ],
    },
    distractorPatterns: {
      "Informação não sustentada": 288,
      "Conceito ou processo em contexto inadequado": 196,
      "Inversão ou contradição": 175,
      "Deslocamento temático, de agente ou de escala": 137,
      "Generalização, redução ou parte pelo todo": 98,
      "Nexo causal inadequado": 82,
    },
    gptRouting: {
      "GPT Mestre ENEM CAV":
        "Usa a camada de Humanas para diagnostico, roteamento e sintese estrategica, preservando os contratos V2.",
      "GPT Ciências Humanas ENEM CAV":
        "Usa a camada para explicacao, treino, revisao profunda, recorrencia, distratores e arqueologia pedagogica de Humanas.",
      "Gerador de Questões ENEM CAV":
        "Usa familias de recorrencia, nucleo verdadeiro, operacao cognitiva e macroclasses de distratores para criar questoes autorais.",
    },
    guardrails: [
      "Nao usar esta camada para Redacao, Linguagens, Natureza ou Matematica.",
      "Nao inventar CO_ITEM, gabarito, habilidade, tema, familia, autoria, fonte ou estatistica.",
      "Prioridade pedagogica CAV 2026 nao e promessa causal de TRI nem previsao de repeticao literal.",
      "Resposta correta literal preservada quando recuperada.",
      "Distratores devem ser explicados por macroclasse e mecanismo sedutor.",
      "Skill CH:Hxx permanece rastreavel e nao substitui tema/subtema quando estes existirem.",
    ],
  },
  triDoctrine: {
    core:
      "Nao basta aumentar acertos; e preciso aumentar acertos coerentes. O aluno deve acertar faceis e medias de habilidades recorrentes antes de apostar em dificeis isoladas.",
    planningRules: [
      "Nao errar questao facil ou media de habilidade recorrente.",
      "Reduzir chute em item dificil desconectado do repertorio do aluno.",
      "Dominar familias de habilidades que aparecem todos os anos.",
      "Construir consistencia por area, principalmente em Matematica e Natureza.",
      "Usar Linguagens e Humanas para blindar media geral e sustentar repertorio de redacao.",
    ],
  },
  strategicLevels: {
    essential: {
      label: "Nivel 1 - Habilidades essenciais",
      frequencyTier: "high",
      priority: 100,
      beginnerCore: true,
      rationale: "Habilidades que o aluno nao pode errar, pois geram coerencia TRI.",
    },
    highFrequency: {
      label: "Nivel 2 - Alta frequencia",
      frequencyTier: "high",
      priority: 88,
      rationale: "Habilidades repetidas no historico 2015-2025 e adequadas ao treino recorrente.",
    },
    medicineCritical: {
      label: "Nivel 3 - Criticas para Medicina",
      frequencyTier: "high",
      priority: 92,
      rationale: "Habilidades que ajudam a romper teto de nota em Natureza e Matematica.",
    },
    emerging: {
      label: "Nivel 4 - Emergentes",
      frequencyTier: "medium",
      priority: 70,
      rationale: "Habilidades que cresceram no recorte recente e devem entrar progressivamente.",
    },
    decline: {
      label: "Nivel 5 - Em declinio relativo",
      frequencyTier: "low",
      priority: 24,
      rationale: "Devem ser estudadas para nao zerar repertorio, mas nao comandam o planejamento.",
    },
  },
  skillProfiles: {
    "mat-proporcao": {
      level: "essential",
      medicineCritical: true,
      tags: ["proporcionalidade", "porcentagem", "escala", "taxas", "razao"],
    },
    "mat-funcoes": {
      level: "medicineCritical",
      beginnerCore: true,
      tags: ["funcoes", "graficos", "modelagem", "variacao"],
    },
    "mat-estatistica": {
      level: "essential",
      medicineCritical: true,
      tags: ["estatistica", "media", "mediana", "tabelas", "leitura critica de dados"],
    },
    "mat-probabilidade": {
      level: "medicineCritical",
      tags: ["probabilidade", "risco", "evidencia", "tomada de decisao"],
    },
    "mat-geometria-plana": {
      level: "medicineCritical",
      tags: ["geometria metrica", "area", "semelhanca", "medidas"],
    },
    "mat-geometria-espacial": {
      level: "highFrequency",
      tags: ["volume", "medidas", "planificacao"],
    },
    "bio-ecologia": {
      level: "essential",
      medicineCritical: true,
      tags: ["ecologia", "meio ambiente", "ciclos", "impactos ambientais"],
    },
    "bio-genetica": {
      level: "medicineCritical",
      tags: ["genetica", "biotecnologia", "hereditariedade", "saude publica"],
    },
    "bio-celular": {
      level: "medicineCritical",
      tags: ["fisiologia", "bioquimica", "celula", "metabolismo"],
    },
    "quim-estequiometria": {
      level: "medicineCritical",
      tags: ["estequiometria", "proporcao", "rendimento", "pureza"],
    },
    "quim-solucoes": {
      level: "medicineCritical",
      tags: ["concentracao", "quimica ambiental", "solucoes", "unidades"],
    },
    "fis-eletricidade": {
      level: "highFrequency",
      tags: ["energia", "potencia", "consumo", "eletroquimica"],
    },
    "fis-mecanica": {
      level: "highFrequency",
      tags: ["energia", "trabalho", "fenomenos"],
    },
    "fis-termologia": {
      level: "emerging",
      tags: ["energia", "calor", "clima", "mudancas climaticas"],
    },
    "ling-interpretacao": {
      level: "essential",
      beginnerCore: true,
      tags: ["interpretacao textual", "inferencias", "funcao social", "leitura critica"],
    },
    "ling-generos": {
      level: "highFrequency",
      tags: ["generos textuais", "funcao social", "suporte", "interlocutor"],
    },
    "ling-variacao": {
      level: "emerging",
      tags: ["diversidade cultural", "identidade", "patrimonio linguistico"],
    },
    "ling-literatura": {
      level: "highFrequency",
      tags: ["identidade cultural", "patrimonio literario", "arte"],
    },
    "ling-coesao": {
      level: "highFrequency",
      tags: ["progressao", "coesao", "organizacao textual"],
    },
    "hum-atualidades": {
      level: "emerging",
      tags: ["saude publica", "tecnologia", "ia", "ambiente", "geopolitica"],
    },
    "hum-sociologia": {
      level: "essential",
      tags: ["cidadania", "identidade cultural", "trabalho", "movimentos sociais"],
    },
    "hum-geografia-fisica": {
      level: "emerging",
      tags: ["meio ambiente", "mudancas climaticas", "biomas", "riscos ambientais"],
    },
    "hum-geografia-humana": {
      level: "highFrequency",
      tags: ["populacao", "urbanizacao", "desigualdade", "territorio"],
    },
    "hum-hist-brasil": {
      level: "essential",
      tags: ["cidadania", "democracia", "direitos", "memoria"],
    },
    "hum-cartografia": {
      level: "essential",
      tags: ["mapas", "escala", "graficos", "leitura de dados"],
    },
  },
  matrixSkillAdjustments: {
    matematica: {
      H01: { level: "decline", note: "Representacoes de numeros e operacoes perderam centralidade relativa." },
      H02: { level: "decline", note: "Padroes numericos e contagem nao devem comandar o plano." },
      H04: { level: "decline", note: "Razoabilidade de resultados numericos caiu no recorte recente." },
      H26: { level: "decline", note: "Analise de graficos/tabelas para argumentacao ficou abaixo de habilidades recentes mais fortes." },
    },
    linguagens: {
      H16: { level: "decline", note: "Literatura permanece importante, mas H16 perdeu predominio recente." },
      H24: { level: "decline", note: "Progressao/organizacao textual nao deve comandar o planejamento." },
      H28: { level: "decline", note: "Impacto social das tecnologias perdeu forca relativa isolada." },
    },
    humanas: {
      H08: { level: "decline", note: "Fluxos populacionais e problemas socioeconomicos nao devem ser eixo principal." },
      H11: { level: "decline", note: "Registros de grupos sociais no tempo e espaco perdeu centralidade relativa." },
      H27: { level: "decline", note: "Democracia/cidadania continua importante, mas nao deve comandar sozinho o plano." },
    },
    natureza: {
      H08: { level: "decline", note: "Obtencao/transformacao/reciclagem de recursos perdeu forca relativa." },
      H17: { level: "decline", note: "Linguagens e representacoes em Ciencias nao devem ser eixo principal." },
      H18: { level: "decline", note: "Propriedades de produtos/sistemas/procedimentos tecnologicos perdeu centralidade relativa." },
      H19: { level: "decline", note: "Metodo cientifico aplicado a problemas sociais/economicos/ambientais caiu no recorte recente." },
    },
  },
  levelSelectionPolicy: {
    iniciante: "Somente questoes faceis de habilidades essenciais ou de alta frequencia, preservando coerencia TRI.",
    mediano: "Manter faceis recorrentes, ampliar medias e inserir emergentes com baixo risco.",
    avancado: "Simulado completo: faceis continuam obrigatorias, medias consolidam consistencia e dificeis/raras buscam diferenciacao TRI.",
  },
  bniItemModel: {
    components: [
      "texto-base contextualizado verbal ou nao verbal",
      "enunciado claro com acao cognitiva especifica",
      "cinco alternativas com um gabarito e quatro distratores plausiveis",
    ],
    qualitySignals: {
      matrixLinked: 12,
      reliableOptions: 12,
      visualContext: 8,
      pedagogicalComment: 8,
      distractorAnalysis: 6,
      officialSource: 6,
    },
    selectionRules: [
      "Evitar itens sem alternativa confiavel.",
      "Priorizar questoes com comando, texto-base e recursos visuais preservados.",
      "Valorizar distratores plausiveis porque revelam erro de raciocinio.",
      "Balancear faceis, medias e dificeis para simular a montagem real do ENEM.",
      "Evitar repeticao excessiva de tema, autor ou familia de raciocinio no mesmo bloco.",
    ],
  },
};
