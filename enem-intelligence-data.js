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
