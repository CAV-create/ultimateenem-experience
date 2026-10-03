(() => {
  const testData = window.CAV_FRONT_GPT_TEST_DATA || { questions: [], patents: [] };
  const areaOrder = ["linguagens", "humanas", "natureza", "matematica"];
  const areas = {
    linguagens: { short: "Linguagens", name: "Linguagens, Códigos e suas Tecnologias" },
    humanas: { short: "Humanas", name: "Ciências Humanas e suas Tecnologias" },
    natureza: { short: "Natureza", name: "Ciências da Natureza e suas Tecnologias" },
    matematica: { short: "Matemática", name: "Matemática e suas Tecnologias" },
  };
  const specialistBank = window.CAV_SPECIALIST_RESIDENCIES || [];
  const DEMO_ACCESS = Object.freeze({
    login: "aluno@cavprime.local",
    password: "CAVPRIME2026",
    storageKey: "cavprime.hard-test.access.v1",
    token: "remembered-local-demo",
  });
  try {
    if (!localStorage.getItem(DEMO_ACCESS.storageKey)) {
      localStorage.setItem(DEMO_ACCESS.storageKey, DEMO_ACCESS.token);
    }
  } catch (_) {}
  const redactionProtocolVersion = "enem-2026-dual-rich-v2";
  const essayMinutesByPatent = Object.freeze({
    1: 80,
    2: 75,
    3: 70,
    4: 65,
    5: 65,
    6: 60,
    7: 60,
    8: 55,
  });
  const dischargePhrases = [
    "O seu texto não terá alta enquanto um especialista não passar no quarto.",
    "Nenhum texto recebe alta sem passar pela visita do especialista.",
    "Antes da alta, o especialista confere cada sinal do seu argumento.",
    "Seu texto continua em observação até a última leitura clínica.",
    "A alta só acontece depois que um especialista examina cada competência.",
    "Todo bom texto passa por uma visita cuidadosa antes de receber alta.",
  ];
  const productExperiences = {
    ultimate: {
      eyebrow: "Medicina pelo ENEM",
      title: "Preparação completa, guiada pela sua evolução.",
      description: "Listas, simulados, TRI, Redação, prontuário dos erros, universidade-alvo e progressão por patentes em uma única jornada.",
    },
    diadea: {
      eyebrow: "Exame de Qualificação UERJ",
      title: "Treino para transformar desempenho em Conceito A.",
      description: "Listas com conceito projetado, simulados completos de 60 questões, pontos UERJ e leitura separada das quatro áreas.",
    },
    discmed: {
      eyebrow: "Discursivas UERJ",
      title: "Biologia, Química e Redação com resposta demonstrada.",
      description: "Treino de respostas abertas, espelho de correção, reescrita orientada e acompanhamento dos componentes de Medicina.",
    },
    medpism: {
      eyebrow: "Medicina UFJF",
      title: "Uma preparação longitudinal para PISM I, II e III.",
      description: "Objetivas e discursivas padronizadas por módulo, pesos oficiais e referências de Medicina em Juiz de Fora e Governador Valadares.",
    },
    vaibem: {
      eyebrow: "Aula particular",
      title: "Explicação, conversa e acompanhamento no ritmo do aluno.",
      description: "Ambientes START e RISE, quadro interativo, caderno de aula e evolução pedagógica sem TRI nem patentes médicas.",
    },
  };
  const officialPortalLogos = Object.freeze({
    ultimate: "ultimate_enem.png",
    diadea: "dia_de_a.png",
    discmed: "discmed.png",
    medpism: "medpism.png",
    vaibem: "vaibem.png",
  });

  const officialPortalTaglines = Object.freeze({
    ultimate: ["KNOWLEDGE TRANSFORMS.", "GREATER FUTURES."],
    diadea: ["DISCIPLINE TODAY.", "GREAT ACHIEVEMENTS TOMORROW."],
    discmed: ["PRECISION TODAY.", "EXCELLENT RESULTS TOMORROW."],
    medpism: ["DISCIPLINE TODAY.", "EXCELLENT DOCTORS TOMORROW."],
    vaibem: ["BRIGHT MINDS.", "BRIGHTER FUTURES."],
  });

  const officialPortalMedicalTracks = Object.freeze({
    ultimate: { label: "ENEM" },
    diadea: { label: "UERJ · EXAME DE QUALIFICAÇÃO" },
    discmed: { label: "UERJ · DISCURSIVAS" },
    medpism: { label: "PISM · UFJF", detail: "OBJETIVAS E DISCURSIVAS" },
  });

  function officialPortalLogo(productKey) {
    const file = officialPortalLogos[productKey];
    const name = products[productKey]?.name || "CAVPRIME";
    const tagline = officialPortalTaglines[productKey] || [];
    return `<div class="portal-product-brand"><picture class="portal-product-logo logo-${productKey}"><img src="../../assets/cavprime/five-logos-20260926/portal-official-png-v2/${file}" alt="${name} - marca oficial" loading="eager" decoding="async"></picture><p class="portal-product-tagline" aria-label="${tagline.join(" ")}">${tagline.map((line) => `<span>${line}</span>`).join("")}</p></div>`;
  }

  function officialPortalCaption(productKey, product) {
    const track = officialPortalMedicalTracks[productKey];
    if (track) {
      return `<div class="portal-product-caption portal-medical-caption"><strong>MEDICINA</strong><span class="portal-caption-rule" aria-hidden="true"></span><small><span>${track.label}</span>${track.detail ? `<span class="portal-track-detail">${track.detail}</span>` : ""}</small></div>`;
    }
    if (productKey === "vaibem") {
      return `<div class="portal-product-caption portal-medical-caption portal-vaibem-caption"><strong>AULA PARTICULAR</strong><span class="portal-caption-rule" aria-hidden="true"></span><small>24h POR DIA · 7 DIAS POR SEMANA</small></div>`;
    }
    return `<div class="portal-product-caption"><strong>${product.subtitle}</strong>${product.state ? `<small>${product.state}</small>` : ""}</div>`;
  }
  const currentAffairsTopics = [
    { id: "clima-cidades", area: "natureza", title: "Eventos extremos e adaptação das cidades", source: "Boletim demonstrativo CAVPRIME", date: "27 set. 2026", summary: "Como ilhas de calor, impermeabilização do solo e desigualdade urbana ampliam riscos ambientais.", application: "Ciências da Natureza, Geografia e repertório de Redação.", skill: "Relacionar intervenção humana, ambiente e qualidade de vida." },
    { id: "ia-trabalho", area: "humanas", title: "Inteligência artificial e transformação do trabalho", source: "Boletim demonstrativo CAVPRIME", date: "26 set. 2026", summary: "Automação, qualificação profissional e os desafios de proteção social em novas relações de trabalho.", application: "Ciências Humanas e repertório sociocultural.", skill: "Analisar mudanças técnicas e relações de produção." },
    { id: "vacinas-informacao", area: "natureza", title: "Vacinação, confiança pública e circulação de informação", source: "Boletim demonstrativo CAVPRIME", date: "25 set. 2026", summary: "A relação entre cobertura vacinal, comunicação científica e prevenção coletiva.", application: "Biologia, Linguagens e Redação.", skill: "Avaliar estratégias de saúde coletiva e divulgação científica." },
    { id: "leitura-digital", area: "linguagens", title: "Leitura profunda em ambientes digitais", source: "Boletim demonstrativo CAVPRIME", date: "24 set. 2026", summary: "O impacto da atenção fragmentada na interpretação, na memória e na formação de leitores.", application: "Linguagens e projeto de Redação.", skill: "Relacionar suportes, práticas de leitura e efeitos de sentido." },
    { id: "mobilidade-direito", area: "humanas", title: "Mobilidade urbana como acesso a direitos", source: "Boletim demonstrativo CAVPRIME", date: "23 set. 2026", summary: "Tempo de deslocamento, segregação espacial e acesso desigual a educação, trabalho e saúde.", application: "Geografia, Sociologia e Redação.", skill: "Interpretar a produção do espaço urbano e seus conflitos." },
    { id: "dados-saude", area: "matematica", title: "Leitura de dados em políticas de saúde", source: "Boletim demonstrativo CAVPRIME", date: "22 set. 2026", summary: "Percentuais, taxas e escalas usados para comparar incidência, cobertura e distribuição de recursos.", application: "Matemática e Ciências da Natureza.", skill: "Interpretar indicadores e comparar grandezas em contexto." },
  ];
  const reportDocuments = [
    { title: "Relatório completo do aluno", detail: "Quatro simulados, dez listas de Matemática, dez redações, médias históricas, última redação, TRI, caderno dos erros e próxima conduta.", file: "CAVPRIME_UltimateENEM_Relatorio_Completo_Aluno_Ficticio_v1.pdf", pages: "4 páginas", preview: "ultimate-full-student-v1", previewPages: 4 },
    { title: "Relatório completo para a família", detail: "Síntese do ciclo, evidências separadas por fonte, pontos fortes, atenção pedagógica e plano conjunto para as próximas três semanas.", file: "CAVPRIME_UltimateENEM_Relatorio_Completo_Familia_Ficticia_v1.pdf", pages: "3 páginas", preview: "ultimate-full-family-v1", previewPages: 3 },
    { title: "Painéis longitudinais personalizados", detail: "UltimateENEM, DIA DE A, discMED, MedPISM, VaiBem START e VaiBem RISE, com médias, cortes e próximas condutas.", file: "CAVPRIME_Paineis_Longitudinais_6_Relatorios_v13.pdf", pages: "6 páginas", preview: "longitudinal-v13", previewPages: 6 },
    { title: "Relatórios analíticos dos seis ambientes", detail: "Listas, simulados, competências, acertos, erros, conceitos, TRI e referências oficiais conforme o curso.", file: "CAVPRIME_Relatorios_Analiticos_6_Ambientes_v2.pdf", pages: "8 páginas", preview: "analiticos-v2", previewPages: 8 },
    { title: "Relatório demonstrativo de Redação ENEM", detail: "Histórico, competências C1 a C5, dois corretores, evolução e próxima conduta.", file: "CAVPRIME_Relatorio_Redacao_ENEM_Demonstrativo_v3.pdf", pages: "Relatório específico", preview: "redacao-enem-v3", previewPages: 1 },
    { title: "Parecer completo de Redação - teste de banca", detail: "Dois corretores, terceira leitura, justificativa por competência, evidências, aderência ao projeto e plano de reescrita.", file: "CAVPRIME_Relatorio_Redacao_ENEM_Teste_Discrepancia_v1.pdf", pages: "5 páginas", preview: "redacao-feedback-v1", previewPages: 5 },
    { title: "Relatórios de evolução dos seis ambientes", detail: "Leitura pedagógica individual para cada curso e para as duas faixas do VaiBem.", file: "CAVPRIME_Relatorios_Evolucao_6_Ambientes_Identidade_Unificada_v5.pdf", pages: "6 páginas", preview: "evolucao-v5", previewPages: 6 },
    { title: "Relatórios para pais e responsáveis", detail: "Comunicação fictícia com as famílias, separando VaiBem START e VaiBem RISE.", file: "CAVPRIME_Relatorios_Familias_6_Ambientes_Identidade_Unificada_v5.pdf", pages: "6 páginas", preview: "familias-v5", previewPages: 6 },
    { title: "Listas de exercícios dos seis ambientes", detail: "Modelos fictícios personalizados por curso e por faixa do VaiBem.", file: "CAVPRIME_Listas_Exercicios_6_Ambientes_Identidade_Unificada_v5.pdf", pages: "6 páginas", preview: "listas-v5", previewPages: 6 },
    { title: "Kit de materiais pedagógicos", detail: "Lista, folha de Redação e folhas discursivas de Biologia e Química.", file: "CAVPRIME_Kit_Demonstrativo_Materiais_Didaticos_v2.pdf", pages: "5 páginas", preview: "kit-v2", previewPages: 5 },
  ];
  let manuscriptFile = null;
  let manuscriptObjectUrl = "";
  let activeRecognition = null;

  function normalizedText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function auditModeEnabled() {
    const query = new URLSearchParams(location.search);
    return query.get("auditReview") === "1" || query.get("diagnostics") === "1";
  }

  function specialistFor(context = "") {
    const searchable = normalizedText(context);
    return specialistBank.find((specialist) => specialist.contexts?.some((term) => searchable.includes(normalizedText(term))))
      || specialistBank.find((specialist) => specialist.id === "orientacao-geral")
      || { id: "orientacao-geral", name: "Especialista de plantão", residency: "Residência em Orientação de Estudos", focus: "próxima conduta pedagógica" };
  }

  function currentSpecialist(message = "") {
    const explicit = specialistBank.find((specialist) => specialist.id === state.assistantSpecialistId);
    return message ? specialistFor(`${location.hash} ${message}`) : (explicit || specialistFor(location.hash));
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const rawSourceQuestions = window.CAV_HARD_TEST_QUESTIONS || testData.questions || [];
  const validEnemQuestion = (item) => Array.isArray(item?.options) && item.options.length === 5 && /^[A-E]$/.test(item.answer || "") && new Set(item.options).size === 5;
  const rejectedEnemQuestions = rawSourceQuestions.filter((item) => !validEnemQuestion(item));
  if (rejectedEnemQuestions.length) console.error("Itens ENEM bloqueados: cada item precisa de um gabarito e quatro distratores distintos.", rejectedEnemQuestions.map((item) => item?.id || item?.number));
  const sourceQuestions = rawSourceQuestions.filter(validEnemQuestion).map((item) => ({
    id: item.id,
    areaId: item.areaId,
    area: item.area,
    title: item.medicalTitle || `Questão ${item.number} · ${item.source}`,
    text: item.stem,
    opts: item.options,
    correct: Math.max(0, "ABCDE".indexOf(item.answer)),
    explain: item.explanation,
    skill: item.skill,
    skillCode: item.skillCode,
    competency: item.competency,
    competencyCode: item.competencyCode,
    source: item.source,
    number: item.number,
    cropImage: item.cropImage || "",
    macrotheme: areas[item.areaId]?.short || item.area,
    microtheme: item.skill?.replace(/\.$/, "") || "Habilidade em classificação",
    distractorFeedback: item.distractorFeedback || item.distractors || null,
  }));

  const essayPacks = Array.from(
    new Map(
      (window.REDACTION_DB?.premiumTopicPacks || [])
        .filter((pack) => pack?.theme)
        .map((pack) => [pack.theme, pack]),
    ).values(),
  );

  const originalSave = save;
  const originalResourcesModal = resourcesModal;
  const originalRender = render;

  function emptyRun() {
    return { answers: {}, submitted: false, index: 0, attempt: 1, reasons: {} };
  }

  function ensureHardState() {
    state.hardArea ||= "natureza";
    state.hardRuns ||= {};
    areaOrder.forEach((areaId) => { state.hardRuns[areaId] ||= emptyRun(); });
    state.externalLists ||= [];
    state.externalDraft ||= { name: "", fileName: "", questions: [], answers: {}, index: 0, stage: "import" };
    state.hardEssayPackId ||= "";
    state.assistantMode ||= "local";
    state.hardAssistantMessages ||= [];
    state.assistantWaiting ||= false;
    state.errorNotes ||= {};
    state.errorAdvice ||= {};
    state.recoverySessions ||= {};
    state.recoveryHistory ||= [];
    state.recoveryMapVariants ||= {};
    state.activeRecoveryKey ||= "";
    state.recoveryAuditCourse ||= "ultimate";
    state.recoveryAuditArea ||= "linguagens";
    state.focusIncidents ||= 0;
    state.newsArea ||= "todas";
    state.newsSelections ||= currentAffairsTopics.map((topic) => topic.id);
    state.trials ||= {};
    state.examTimer ||= { key: "", duration: 0, remaining: 0, running: false, deadline: 0 };
    state.vaibemTrack ||= "start";
    state.vaibemTeacher ||= "math";
    state.vaibemLiveNotebooks ||= [];
    state.vaibemLiveNotebookId ||= "";
    state.essay.aiReview ||= null;
    state.essay.reviewStatus ||= "idle";
    state.essay.reviewMessage ||= "";
    state.essay.inputMode ||= "type";
    state.essay.manuscriptFileName ||= "";
    state.essay.manuscriptMimeType ||= "";
    if (state.essay.aiReview && state.essay.aiReview.protocolVersion !== redactionProtocolVersion) {
      state.essay.aiReview = null;
      state.essay.reviewStatus = "idle";
      state.essay.reviewMessage = "";
      state.essay.recorded = false;
      state.essay.evaluationSource = "";
      state.essay.scores = [null, null, null, null, null];
    }
    if (new URLSearchParams(location.search).get("auditReview") === "1" && !state.essay.aiReview) {
      const finalScores = [160, 120, 80, 120, 120];
      const evaluatorScores = [
        { id: "1", total: 600, resultStatus: "valid", scores: [160, 120, 80, 120, 120] },
        { id: "2", total: 960, resultStatus: "valid", scores: [200, 200, 160, 200, 200] },
        { id: "3", total: 600, resultStatus: "valid", scores: [160, 120, 80, 120, 120] },
      ];
      const titles = ["Domínio da modalidade escrita formal", "Compreensão do tema e repertório", "Seleção e organização dos argumentos", "Mecanismos linguísticos da argumentação", "Proposta de intervenção"];
      state.essay.aiReview = {
        protocolVersion: redactionProtocolVersion,
        total: 600,
        band: "Desempenho em consolidação",
        summary: "O texto compreende o recorte, mas precisa tornar as relações causais demonstráveis e organizar melhor a progressão dos argumentos antes da reescrita.",
        overallDiagnosis: {
          strongestPoint: "O texto permanece dentro do tema e apresenta uma proposta de intervenção relacionada ao problema discutido.",
          priority: "A C3 é a prioridade: as ideias aparecem em sequência, mas faltam relações causais, comprovação e autoria argumentativa.",
          projectReading: "A tese foi parcialmente executada. O primeiro eixo aparece de modo reconhecível; o segundo foi apenas mencionado, e o repertório constitucional não chegou a funcionar como prova.",
          progressionPotential: "Ao desenvolver um mecanismo causal completo e tornar o repertório produtivo, o texto pode ganhar simultaneamente em C2, C3 e C4.",
        },
        paragraphFeedback: [
          { section: "Introdução", status: "Parcialmente cumprida", diagnosis: "O tema é apresentado, mas a tese permanece ampla e os dois eixos não ficam delimitados com precisão.", rewriteFocus: "Encerrar a introdução com uma tese que nomeie duas causas distintas e recuperáveis nos desenvolvimentos." },
          { section: "Desenvolvimento 1", status: "Em construção", diagnosis: "A herança autoritária é citada, porém o texto não explica como ela reduz a confiança nas instituições nem apresenta uma evidência verificável.", rewriteFocus: "Construir a sequência causa, mecanismo, consequência e prova em quatro movimentos claros." },
          { section: "Desenvolvimento 2", status: "Insuficiente", diagnosis: "O segundo eixo surge como enumeração e repete parte do diagnóstico anterior, sem ampliar a defesa do ponto de vista.", rewriteFocus: "Escolher uma consequência atual, explicá-la e conectá-la à tese sem repetir o primeiro parágrafo." },
          { section: "Conclusão", status: "Pertinente, mas incompleta", diagnosis: "Há agente e ação, mas o meio de execução, o detalhamento e a verificação do resultado permanecem genéricos.", rewriteFocus: "Definir quem executa, por qual instrumento, com qual público, finalidade e forma de acompanhamento." },
        ],
        projectAlignment: [
          { element: "Tese", status: "Parcial", evidence: "A posição geral aparece, mas os dois eixos de defesa não são anunciados com nitidez." },
          { element: "Eixo 1", status: "Presente", evidence: "A herança autoritária é retomada no primeiro desenvolvimento, ainda sem mecanismo causal suficiente." },
          { element: "Eixo 2", status: "Pouco desenvolvido", evidence: "A desigualdade é mencionada, mas não se transforma em argumento autônomo." },
          { element: "Repertório", status: "Decorativo", evidence: "A Constituição de 1988 é citada, porém seu princípio não é interpretado nem usado para comprovar a tese." },
          { element: "Intervenção", status: "Parcial", evidence: "A campanha educativa é pertinente, mas faltam meio operacional, detalhamento e monitoramento." },
        ],
        rewritePlan: [
          "Reescrever o primeiro desenvolvimento com uma cadeia causal completa e uma evidência específica.",
          "Transformar a Constituição de 1988 em repertório produtivo, explicando a contradição entre o princípio democrático e a realidade analisada.",
          "Reconstruir a conclusão com agente, ação, meio, finalidade, público e acompanhamento.",
          "Fazer uma leitura final exclusiva para vírgulas, concordância e retomadas vagas como 'isso'.",
        ],
        competencies: [
          {
            code: "C1", title: titles[0], score: 160,
            analysis: "O registro é predominantemente formal e a estrutura dos períodos é compreensível, mas há desvios recorrentes de concordância e pontuação.",
            evidence: "Trecho fictício auditado: 'A herança autoritária do Brasil, faz com que as pessoas não confia nas instituições.'",
            nextStep: "Eliminar a vírgula entre sujeito e verbo e revisar a concordância verbal antes da nova leitura.",
            strength: "Vocabulário compatível com o texto dissertativo-argumentativo e períodos majoritariamente completos.",
            limitation: "Vírgula indevida e concordância oscilante reaparecem em mais de um ponto do texto.",
            descriptorMatch: "O desempenho se aproxima do nível 160: bom domínio, com poucos desvios que não impedem a compreensão global.",
            whyNotHigher: "O nível 200 exige desvios excepcionais e sem reincidência; aqui, a mesma natureza de problema aparece novamente.",
            rewriteExample: "A herança autoritária do Brasil faz com que parte da população não confie nas instituições.",
          },
          {
            code: "C2", title: titles[1], score: 120,
            analysis: "O tema foi compreendido, mas o repertório aparece como referência correta e pouco produtiva, sem sustentar efetivamente a argumentação.",
            evidence: "Trecho fictício auditado: 'A Constituição de 1988 fala que todos são iguais, mas isso não acontece.'",
            nextStep: "Explicar qual princípio constitucional foi frustrado e como essa contradição comprova a tese.",
            strength: "A referência à Constituição é legítima e pertinente ao debate sobre democracia e direitos.",
            limitation: "A citação permanece genérica e poderia ser retirada sem alterar o raciocínio do parágrafo.",
            descriptorMatch: "O nível 120 corresponde a desenvolvimento previsível, com domínio mediano do texto e repertório ainda pouco produtivo.",
            whyNotHigher: "Para 160, a referência precisa participar da explicação e conduzir uma conclusão argumentativa própria.",
            rewriteExample: "Embora a Constituição de 1988 consolide a igualdade política, a permanência de práticas autoritárias enfraquece a confiança pública e impede que esse princípio se realize plenamente.",
          },
          {
            code: "C3", title: titles[2], score: 80,
            analysis: "Os argumentos são pertinentes, porém aparecem mais enumerados do que desenvolvidos e comprovados.",
            evidence: "Trecho fictício auditado: 'Tem corrupção, desigualdade e falta de educação, por isso a democracia não funciona.'",
            nextStep: "Reescrever um desenvolvimento ligando causa, mecanismo, consequência e evidência.",
            strength: "O texto seleciona causas relacionadas ao problema e mantém um ponto de vista identificável.",
            limitation: "As causas são apenas listadas; não há hierarquia, mecanismo explicativo nem prova que sustente a conclusão.",
            descriptorMatch: "O nível 80 reconhece informações relacionadas ao tema, mas desorganizadas ou insuficientemente articuladas em defesa do ponto de vista.",
            whyNotHigher: "Para 120, seria necessário organizar os argumentos em uma progressão reconhecível e explicar como cada causa produz o problema.",
            rewriteExample: "A baixa educação política favorece a circulação de discursos autoritários porque reduz a capacidade de avaliar criticamente propostas que enfraquecem instituições democráticas; com isso, práticas antidemocráticas passam a ser naturalizadas.",
          },
          {
            code: "C4", title: titles[3], score: 120,
            analysis: "A articulação global é reconhecível, mas as retomadas vagas e a repetição de conectivos tornam a progressão mecânica.",
            evidence: "Trecho fictício auditado: 'Além disso, isso mostra o problema. Além disso, isso prejudica a democracia.'",
            nextStep: "Substituir retomadas vagas pelo nome da ideia retomada e variar a relação lógica entre as frases.",
            strength: "Há conectivos entre os períodos e o leitor consegue acompanhar a sequência geral.",
            limitation: "A repetição de 'além disso' e 'isso' não explicita se a relação é de causa, consequência, contraste ou conclusão.",
            descriptorMatch: "O nível 120 corresponde a articulação mediana, com inadequações e repertório coesivo pouco diversificado.",
            whyNotHigher: "O nível 160 exige poucas inadequações e maior diversidade de recursos coesivos intra e interparágrafos.",
            rewriteExample: "Como consequência dessa desconfiança institucional, amplia-se a adesão a soluções autoritárias, o que fragiliza a participação democrática.",
          },
          {
            code: "C5", title: titles[4], score: 120,
            analysis: "A proposta se relaciona ao tema e preserva os direitos humanos, mas ainda não esclarece a execução nem detalha o acompanhamento.",
            evidence: "Trecho fictício auditado: 'O governo deve fazer campanhas nas escolas para conscientizar as pessoas.'",
            nextStep: "Detalhar órgão responsável, instrumento, público, conteúdo, finalidade e forma de avaliação.",
            strength: "Há agente, ação educativa e finalidade compatível com o problema debatido.",
            limitation: "'Governo' e 'campanhas' são genéricos; não se sabe quem executa, como a ação chega ao público ou como será acompanhada.",
            descriptorMatch: "O nível 120 reconhece uma proposta mediana relacionada ao tema e articulada apenas parcialmente à discussão.",
            whyNotHigher: "Para 160, a proposta precisa apresentar elaboração mais concreta e retomar com nitidez o diagnóstico construído no texto.",
            rewriteExample: "O Ministério da Educação, em parceria com as secretarias estaduais, deve promover oficinas semestrais de educação política nas escolas, com análise de notícias e debates mediados, a fim de fortalecer a leitura crítica e a confiança nas instituições democráticas; a aprendizagem será acompanhada por avaliações diagnósticas antes e depois das atividades.",
          },
        ],
        correctionProcess: {
          initialReaders: 2,
          evaluators: evaluatorScores.map((evaluator) => ({
            id: evaluator.id,
            total: evaluator.total,
            resultStatus: evaluator.resultStatus,
            competencies: evaluator.scores.map((score, index) => ({ code: `C${index + 1}`, score })),
          })),
          discrepancy: {
            detected: true,
            totalDifference: 360,
            competencyDifferences: [40, 80, 80, 80, 80].map((difference, index) => ({ code: `C${index + 1}`, difference })),
            situationDivergence: false,
            reasons: ["Diferença de 360 pontos entre os totais, superior a 100."],
          },
          resolution: "third_evaluator_closest_pair",
          selectedEvaluators: ["1", "3"],
          thirdEvaluatorUsed: true,
          boardUsed: false,
        },
      };
      state.essay.scores = finalScores;
      state.essay.recorded = true;
      state.essay.evaluationSource = "audit";
      state.essay.reviewStatus = "complete";
    }
    if (!Number.isInteger(state.essay.dischargePhraseIndex)) {
      state.essay.dischargePhraseIndex = Math.floor(Math.random() * dischargePhrases.length);
    }
    if (!state.essay.evaluationSource && JSON.stringify(state.essay.scores) === JSON.stringify([160, 180, 160, 180, 180])) {
      state.essay.scores = [null, null, null, null, null];
      state.essay.recorded = false;
    }
  }

  function activePatentRule() {
    const level = Math.max(1, Number(state.patent || 1));
    const rule = testData.patents?.[level - 1];
    if (rule) {
      return {
        ...rule,
        essayTrainingMinutes: rule.essayTrainingMinutes ?? essayMinutesByPatent[level],
      };
    }
    return {
      level,
      name: patent().name,
      questionsPerCase: 20,
      minutesPerQuestion: 5,
      essayTrainingMinutes: essayMinutesByPatent[level] ?? 80,
    };
  }

  function patentCaseMinutes(rule = activePatentRule()) {
    return Number(rule.questionsPerCase || 20) * Number(rule.minutesPerQuestion || 5);
  }

  function formatMinutes(value) {
    const minutes = Number(value || 0);
    return Number.isInteger(minutes) ? String(minutes) : minutes.toFixed(1).replace(".", ",");
  }

  function formatTimer(totalSeconds) {
    const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const hours = Math.floor(safe / 3600);
    const minutes = Math.floor((safe % 3600) / 60);
    const seconds = safe % 60;
    return hours
      ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function timerRemaining() {
    const timer = state.examTimer;
    if (!timer.running || !timer.deadline) return Math.max(0, Number(timer.remaining) || 0);
    return Math.max(0, Math.ceil((timer.deadline - Date.now()) / 1000));
  }

  function setTimer(key, durationSeconds, start = false) {
    const duration = Math.max(60, Math.round(Number(durationSeconds) || 60));
    const current = state.examTimer || {};
    if (current.key !== key || !current.duration) {
      state.examTimer = { key, duration, remaining: duration, running: false, deadline: 0 };
    }
    if (start && !state.examTimer.running) {
      state.examTimer.remaining = timerRemaining() || duration;
      state.examTimer.deadline = Date.now() + state.examTimer.remaining * 1000;
      state.examTimer.running = true;
    }
    originalSave();
  }

  function pauseTimer() {
    if (!state.examTimer?.running) return;
    state.examTimer.remaining = timerRemaining();
    state.examTimer.running = false;
    state.examTimer.deadline = 0;
    originalSave();
  }

  function timerConfigForRoute(route) {
    const rule = activePatentRule();
    if (route === "questao") return { key: `ultimate:${state.hardArea}:${state.attempt}`, seconds: questions.length * Number(rule.minutesPerQuestion || 5) * 60, label: "Lista" };
    if (route === "lista-externa/responder") return { key: `external:${state.externalDraft.name || "lista"}`, seconds: Math.max(1, state.externalDraft.questions?.length || 1) * Number(rule.minutesPerQuestion || 5) * 60, label: "Lista externa" };
    if (route === "diadea/treino") return { key: "diadea:treino", seconds: 5 * 3 * 60, label: "Treino UERJ" };
    if (route === "medpism/treino") return { key: `medpism:${state.pism || "II"}`, seconds: 5 * 3 * 60, label: `PISM ${state.pism || "II"}` };
    if (route === "simulado") {
      const day = state.simulationDay === 2 ? 2 : 1;
      return { key: `enem:simulado:dia-${day}`, seconds: (day === 1 ? 330 : 300) * 60, label: `Simulado ENEM · dia ${day}` };
    }
    return null;
  }

  function optionRationale(questionItem, optionIndex) {
    if (optionIndex === questionItem.correct) return questionItem.explain;
    const configured = Array.isArray(questionItem.distractorFeedback)
      ? questionItem.distractorFeedback[optionIndex]
      : questionItem.distractorFeedback?.["ABCDE"[optionIndex]];
    if (configured) return String(configured);
    const option = String(questionItem.opts[optionIndex] || "esta alternativa").replace(/[.!?]+$/, "");
    return `Não serve porque “${option}” desloca o foco do comando ou não estabelece a relação exigida. ${questionItem.explain}`;
  }

  function errorPrescription(questionItem, key) {
    const reason = state.reason[key] || "Motivo ainda não identificado";
    const actions = {
      "Não sabia o conteúdo": "Retome o conceito-base e resolva dois itens fáceis antes de voltar a esta questão.",
      "Não reconheci a aplicação": "Compare o conceito com dois contextos diferentes e destaque no enunciado o sinal que indica sua aplicação.",
      Interpretação: "Reescreva o comando com suas palavras e marque evidências do texto antes de analisar as alternativas.",
      "Cálculo ou procedimento": "Refaça o procedimento em etapas, confira unidades e só então compare com as alternativas.",
      Distração: "Use uma conferência final de comando, unidade e alternativa marcada antes de avançar.",
      "Gestão de tempo": "Faça uma primeira passagem objetiva, sinalize a dúvida e retorne sem comprometer o restante da lista.",
      "Troquei uma resposta correta": "Registre qual evidência sustentava a primeira resposta e exija uma evidência mais forte antes de trocá-la.",
      "Chute sem estratégia": "Elimine alternativas incompatíveis com o comando e registre a evidência usada em cada descarte.",
    };
    return `${actions[reason] || "Identifique a origem do erro antes de refazer o item."} Depois, revise ${questionItem.skillCode}: ${questionItem.skill || questionItem.microtheme}.`;
  }

  function activeRun() {
    ensureHardState();
    return state.hardRuns[state.hardArea];
  }

  function activeQuestions(areaId = state.hardArea) {
    return sourceQuestions.filter((question) => question.areaId === areaId).slice(0, 6);
  }

  function syncRun() {
    const run = activeRun();
    run.answers = { ...(state.answers || {}) };
    run.submitted = Boolean(state.submitted);
    run.index = Number(state.index) || 0;
    run.attempt = Number(state.attempt) || 1;
  }

  function loadArea(areaId, persist = true) {
    if (!areas[areaId]) return;
    if (persist) syncRun();
    state.hardArea = areaId;
    const run = activeRun();
    state.answers = { ...(run.answers || {}) };
    state.submitted = Boolean(run.submitted);
    state.index = Math.min(Number(run.index) || 0, 5);
    state.attempt = Number(run.attempt) || 1;
    state.done = false;
    questions.splice(0, questions.length, ...activeQuestions(areaId));
  }

  ensureHardState();
  loadArea(state.hardArea, false);

  save = function hardSave() {
    syncRun();
    originalSave();
  };

  score = function hardScore() {
    return questions.reduce((total, question, index) => total + (state.answers[index] === question.correct ? 1 : 0), 0);
  };

  function completedAreaCount() {
    return areaOrder.filter((areaId) => state.hardRuns[areaId]?.submitted).length;
  }

  function runScore(areaId) {
    const run = state.hardRuns[areaId];
    const areaQuestions = activeQuestions(areaId);
    if (!run?.submitted) return null;
    return areaQuestions.reduce((total, question, index) => total + (run.answers[index] === question.correct ? 1 : 0), 0);
  }

  function wrongEntries() {
    const errors = [];
    areaOrder.forEach((areaId) => {
      const run = state.hardRuns[areaId];
      if (!run?.submitted) return;
      activeQuestions(areaId).forEach((question, index) => {
        if (run.answers[index] !== question.correct) errors.push({ areaId, question, index, answer: run.answers[index] });
      });
    });
    state.externalLists.filter((list) => list.completed).forEach((list) => {
      list.questions.forEach((question, index) => {
        if (list.answers[index] !== question.correct) errors.push({ areaId: `external:${list.id}`, question, index, answer: list.answers[index], list });
      });
    });
    return errors;
  }

  function nextArea() {
    return areaOrder.find((areaId) => !state.hardRuns[areaId]?.submitted) || null;
  }

  portal = function officialCoverPortal() {
    const selected = products[selectedProduct];
    return `<div class="portal portal-official"><header class="portal-official-status">${tag()}</header><main id="main"><section class="approved-cover" aria-label="CAVPRIME: disciplina transforma planos em vidas"><img src="../../assets/cavprime/final-20260925/07_USER_APPROVED/hero_cirurgiao_brand_tagline_clean_v7.png" alt="CAVPRIME: cirurgião no centro cirúrgico"><p class="approved-brand-tagline">GOOD PREPARATION SAVES LIVES</p><div class="approved-cover-copy" aria-label="Discipline turns plans into lives. An educational ecosystem designed to transform data, method and guidance into real progress."><p class="approved-cover-title"><span>DISCIPLINE</span><span>TURNS PLANS</span><span>INTO LIVES.</span></p><p class="approved-cover-subtitle"><span>AN EDUCATIONAL ECOSYSTEM DESIGNED TO TRANSFORM DATA,</span><span>METHOD AND GUIDANCE INTO REAL PROGRESS.</span></p></div></section><div class="product-heading">Escolha seu ambiente<span></span></div><div class="product-grid" role="group" aria-label="Produtos CAVPRIME">${Object.entries(products).map(([key, product]) => `<button class="product-tile ${selectedProduct === key ? "selected" : ""}" data-action="product" data-product="${key}" aria-pressed="${selectedProduct === key}">${selectedProduct === key ? `<span class="selected-mark">${icon("check")}</span>` : ""}${officialPortalLogo(key)}${officialPortalCaption(key, product)}</button>`).join("")}</div><div class="portal-action"><p>Seu ambiente reconhece o curso escolhido<br>e apresenta o próximo passo.</p>${btn(`Entrar no ${selected.name} ${icon("arrow")}`, "enter", "btn goldbtn")}</div></main><footer class="portal-footer"><span>CAVPRIME · ESTRATÉGIA E ACOMPANHAMENTO</span>${btn(`Mapa das experiências ${icon("arrow")}`, "map", "textbtn")}</footer></div>`;
  };

  login = function persistentDemoLogin() {
    const product = products[selectedProduct];
    return `<div class="login"><aside class="login-aside">${logo(selectedProduct)}<h2>Seu objetivo.<br>Seu ritmo.<br>Seu próximo passo.</h2><p>Uma experiência feita para você avançar, não para se perder em menus.</p></aside><main class="login-content" id="main">${link(icon("back") + "Voltar ao ecossistema", "portal")}${tag()}<h1>Seu acesso<br>já está preparado.</h1><p class="muted small">Use o acesso único do ${esc(product.name)}. Neste dispositivo, a sessão permanecerá salva.</p><form id="hard-login-form" class="space"><label class="field">Login<input id="hard-login" type="email" autocomplete="username" value="${DEMO_ACCESS.login}" required></label><label class="field space-sm">Senha<input id="hard-password" type="password" autocomplete="current-password" value="${DEMO_ACCESS.password}" required></label><label class="consent-line space-sm"><input id="hard-remember" type="checkbox" checked><span>Manter meu acesso neste dispositivo</span></label><button class="btn wfull" type="submit">Entrar no ${esc(product.name)} ${icon("arrow")}</button></form><p class="device-disclaimer">Seu acesso permanece salvo somente neste dispositivo.</p></main></div>`;
  };

  function mindMapEvolutionPage() {
    const branches = [
      ["01", "Evidência fóssil", "Fósseis registram organismos do passado, inclusive espécies extintas. Eles mostram que a vida não permaneceu imutável."],
      ["02", "Variação", "Indivíduos de uma população apresentam diferenças. Parte dessas variações pode ser herdada pelos descendentes."],
      ["03", "Seleção natural", "O ambiente favorece características que aumentam sobrevivência e reprodução. Seus portadores deixam mais descendentes."],
      ["04", "Adaptação", "Ao longo das gerações, a frequência de características vantajosas pode aumentar. Quem se adapta é a população, não o indivíduo."],
      ["05", "A lacuna de Darwin", "Darwin explicou o mecanismo da seleção, mas não conhecia genes e mutações, fontes fundamentais da variação hereditária."],
      ["06", "Armadilhas da prova", "Necessidade não cria uma característica. Evolução não tem intenção, não ocorre porque o organismo quer e não produz perfeição."],
    ];
    return shell(`<section class="clinical-mindmap" aria-labelledby="mindmap-title"><header class="clinical-mindmap-head"><div><span>HOSPITAL CAVMED · CASO DE RECUPERAÇÃO</span><strong>Biologia · evolução</strong></div><small>Mapa autoral do plantão</small></header><div class="clinical-mindmap-stage"><div class="clinical-mindmap-core"><small>IDEIA CENTRAL</small><h1 id="mindmap-title">EVOLUÇÃO</h1><p>Populações mudam ao longo das gerações.</p></div>${branches.map(([number, title, text], index) => `<article class="mind-branch branch-${index + 1}"><span>${number}</span><div><h2>${title}</h2><p>${text}</p></div></article>`).join("")}</div><div class="mindmap-example"><span class="mindmap-example-label">PRIMEIROS SOCORROS DO RACIOCÍNIO</span><div><strong>Situação</strong><p>Em uma população de insetos, alguns indivíduos já apresentam resistência a um inseticida.</p></div><div><strong>Raciocínio</strong><p>O produto elimina mais insetos sensíveis. Os resistentes sobrevivem e deixam proporcionalmente mais descendentes.</p></div><div><strong>Conclusão</strong><p>A resistência torna-se mais frequente. O inseticida selecionou uma variação preexistente; não criou a resistência.</p></div></div><footer class="clinical-mindmap-foot"><span>Material pedagógico autoral · médicos especialistas CAVMED</span><strong>Entenda o mecanismo. Depois, reconheça-o no enunciado.</strong></footer></section><div class="mindmap-actions">${link("Voltar ao prontuário", "erros", "btn outline")}${btn("Imprimir mapa mental " + icon("book"), "print-mindmap", "btn")}</div>`, "");
  }

  home = function hardHome() {
    ensureHardState();
    const rule = activePatentRule();
    const pending = nextArea();
    if (pending && pending !== state.hardArea) loadArea(pending);
    const run = activeRun();
    const errors = wrongEntries().length;
    let title = medicalCall().replace(" ", "<br>");
    let description = `Nossos médicos orientadores priorizaram ${areas[state.hardArea].short} a partir do ciclo atual. Você recebe a conduta; a inteligência permanece nos bastidores.`;
    let action = Object.keys(run.answers || {}).length ? "Continuar de onde parei" : "Iniciar lista agora";
    let route = run.submitted ? (errors ? "erros" : (nextArea() ? "plantao" : "redacao")) : "plantao";
    if (run.submitted && errors) {
      title = "Seus erros já foram<br>separados para você.";
      description = "O prontuário abriu apenas o que precisa de revisão, com habilidade, competência e comentário.";
      action = "Abrir meu prontuário";
    } else if (!nextArea()) {
      title = "As quatro áreas<br>foram examinadas.";
      description = "Agora, o próximo passo recomendado é avançar no projeto de Redação ou revisar evidências do ciclo.";
      action = "Continuar na Redação";
      route = "redacao";
    }
    const progress = Math.round((completedAreaCount() / 4) * 360);
    const sampleMinutes = Math.ceil(6 * Number(rule.minutesPerQuestion || 5));
    return shell(`<div class="home-intro"><div class="kicker">${patent().name} · ciclo de três semanas</div><h1>Olá, ${esc(state.name)}.</h1><p>Nossos médicos já organizaram o que merece sua atenção agora.</p></div><section class="priority"><div class="priority-top"><span class="kicker">Seu próximo passo</span><span class="pill goldpill">${patent().name}</span><span class="pill">${icon("clock")}Amostra: 6 questões · ${sampleMinutes} min</span><span class="pill clinical-rule">Caso da patente: ${rule.questionsPerCase} questões · ${formatMinutes(patentCaseMinutes(rule))} min</span></div><div class="priority-content"><div><h2>${title}</h2><p>${description}</p></div><div class="ring" style="background:conic-gradient(var(--gold) ${progress}deg,#ffffff12 0)"><div class="ring-inner"><strong>${completedAreaCount()}<span> / 4</span></strong><small>áreas<br>concluídas</small></div></div></div><div class="priority-cta">${link(action + " " + icon("arrow"), route, "btn goldbtn")}${btn("Por que este passo?", "why-hard", "textbtn")}</div></section><div class="today-progress">${areaOrder.map((areaId) => { const value = runScore(areaId); return `<div class="area-progress ${areaId === state.hardArea && value === null ? "pending" : ""}"><div><span>${areas[areaId].short}</span><span>${value === null ? (areaId === state.hardArea ? "Agora" : "A seguir") : `${value}/6`}</span></div><div class="bar"><span style="width:${value === null ? (areaId === state.hardArea ? 28 : 0) : 100}%"></span></div></div>`; }).join("")}</div>${row("Seu projeto de redação", `${essayPacks.length || 100} recortes preservados, uma decisão por vez.`, "redacao", "pen")}${row("Trazer uma lista externa", "Nossa equipe classifica, corrige e acumula o resultado.", "lista-externa", "book")}${row("Uma semana possível", "Prioridades organizadas. Tempo para descansar.", "semana", "calendar")}<div class="quiet-help">${link(icon("chat") + "Perguntar ao Médico Orientador", "assistente")}</div>`);
  };

  caseIntro = function hardCaseIntro() {
    const meta = areas[state.hardArea];
    const rule = activePatentRule();
    const minutes = Math.ceil(questions.length * Number(rule.minutesPerQuestion || 5));
    const auditPrescription = auditModeEnabled() ? `<div><strong>${rule.questionsPerCase}</strong><small>questões na prescrição integral</small></div><div><strong>${formatMinutes(patentCaseMinutes(rule))} min</strong><small>tempo da prescrição integral</small></div>` : "";
    return focus(`${pageHead(`${patent().name} · ${meta.short}`, medicalCall().replace(" ", "<br>"), "Seu bloco atual foi preparado conforme o desempenho e o tempo disponível.")}<div class="case-summary"><div><strong>${questions.length}</strong><small>questões deste bloco</small></div><div><strong>${minutes} min</strong><small>cronômetro do bloco</small></div>${auditPrescription}</div><div class="engine-caption">Competência, habilidade, macrotema e microtema acompanham cada resposta sem poluir a tela.</div><div class="area-picker">${areaOrder.map((areaId) => btn(`<strong>${areas[areaId].short}</strong><small>${state.hardRuns[areaId].submitted ? `${runScore(areaId)}/6 concluídas` : areaId === state.hardArea ? "Prioridade atual" : "Disponível"}</small>`, "area-pick", `area-choice ${areaId === state.hardArea ? "selected" : ""}`, `data-area="${areaId}"`)).join("")}</div><div class="space">${btn("Começar com cronômetro " + icon("arrow"), "start-questions")}</div>`);
  };

  question = function hardQuestion() {
    if (state.submitted) return result();
    const index = state.index;
    const questionItem = questions[index];
    const answered = Object.keys(state.answers).length;
    return focus(`<div class="focus-meta"><span>${areas[state.hardArea].name}</span><span>Questão ${index + 1} de ${questions.length}</span></div><div class="focus-progress"><span style="width:${((index + 1) / questions.length) * 100}%"></span></div><div class="kicker muted">${esc(questionItem.competencyCode)} · ${esc(questionItem.skillCode)}</div><h1 class="question-title">${esc(questionItem.title)}</h1>${questionItem.cropImage ? `<img class="question-crop" src="${esc(questionItem.cropImage)}" alt="Questão ${questionItem.number} de ${esc(questionItem.source)}">` : `<p class="question-text">${esc(questionItem.text)}</p>`}<p class="question-source">${esc(questionItem.source)} · questão ${questionItem.number} · item íntegro para teste de interface.</p><div class="options" role="radiogroup" aria-label="Alternativas">${questionItem.opts.map((option, optionIndex) => btn(`<span class="letter">${"ABCDE"[optionIndex]}</span><span>${esc(option)}</span>`, "answer", "option", `role="radio" aria-checked="${state.answers[index] === optionIndex}" data-value="${optionIndex}"`)).join("")}</div><div class="question-bottom">${btn(icon("back") + "Anterior", "prev-question", "textbtn", index === 0 ? "disabled" : "")}${btn((index === questions.length - 1 ? "Corrigir lista" : "Salvar e próxima") + " " + icon("arrow"), index === questions.length - 1 ? "submit-open" : "next-question", "btn", state.answers[index] === undefined ? "disabled" : "")}</div><p class="keyboard-note">${answered} de ${questions.length} respostas marcadas · a correção libera automaticamente o prontuário dos erros.</p>`);
  };

  function resultReviewItem(questionItem, index, areaId, answer) {
    const correct = answer === questionItem.correct;
    const key = `${areaId}:${index}`;
    const optionAudit = questionItem.opts.map((option, optionIndex) => `<div class="option-rationale ${optionIndex === questionItem.correct ? "correct" : ""}"><span>${"ABCDE"[optionIndex]}</span><p><strong>${optionIndex === questionItem.correct ? "Resposta correta" : "Por que não serve"}</strong>${esc(optionRationale(questionItem, optionIndex))}</p></div>`).join("");
    return `<details class="review-item answer-review" ${correct ? "" : "open"}><summary><span class="iconlabel"><span class="answer-mark ${correct ? "correct" : "wrong"}">${correct ? "✓" : "×"}</span><span>${index + 1}. ${esc(questionItem.title)}<small class="muted" style="display:block;margin-top:5px">${esc(questionItem.competencyCode)} · ${esc(questionItem.skillCode)}</small></span></span><span class="pill">${correct ? "Correta" : "Revisar"}</span></summary><p><strong>Sua resposta:</strong> ${answer === undefined ? "não respondida" : `${"ABCDE"[answer]}. ${esc(questionItem.opts[answer])}`}</p><p><strong>Gabarito:</strong> ${"ABCDE"[questionItem.correct]}. ${esc(questionItem.opts[questionItem.correct])}</p><div class="option-audit"><h3>Engenharia reversa das alternativas</h3>${optionAudit}</div><p><strong>Macrotema:</strong> ${esc(questionItem.macrotheme)} · <strong>Microtema:</strong> ${esc(questionItem.microtheme)}</p>${correct ? "" : `<div class="clinical-advice"><strong>Conduta recomendada</strong><p>${esc(errorPrescription(questionItem, key))}</p>${state.errorNotes[key] ? `<small><strong>Minha leitura:</strong> ${esc(state.errorNotes[key])}</small>` : ""}</div><div class="review-actions"><a class="btn recovery-start" href="#/recuperacao/${encodeURIComponent(key)}">${icon("book")} Fazer recuperação guiada</a>${btn(state.reason[key] || state.errorNotes[key] ? "Rever meu registro" : "Registrar por que errei", "error-reason", "textbtn under", `data-index="${esc(key)}"`)}</div>`}</details>`;
  }

  function activeRecoveryEntry() {
    return wrongEntries().find((entry) => `${entry.areaId}:${entry.index}` === state.activeRecoveryKey) || null;
  }

  function recoveryCourseKey() {
    return state.activeRecoveryCourse || state.product || currentProduct || "ultimate";
  }

  function recoveryCurriculum(entry) {
    if (!entry || !window.CAV_RECOVERY_ENGINE) return null;
    return window.CAV_RECOVERY_ENGINE.createSession(entry.question, recoveryCourseKey());
  }

  function recoveryRecord(key) {
    state.recoverySessions[key] ||= { answers: {}, startedAt: new Date().toISOString(), completedAt: "", score: 0 };
    return state.recoverySessions[key];
  }

  function recoveryAnswerAudit(questionItem, answer) {
    if (answer === undefined) return "";
    const correct = answer === questionItem.correct;
    const rows = questionItem.options.map((option, optionIndex) => {
      const isCorrect = optionIndex === questionItem.correct;
      const chosen = optionIndex === answer;
      const label = isCorrect ? "Resposta correta" : chosen ? "Sua escolha não serve" : "Por que não serve";
      const rationale = isCorrect
        ? questionItem.explanation
        : `“${option}” não responde ao conceito pedido. Compare com “${questionItem.options[questionItem.correct]}” e volte à relação central do enunciado.`;
      return `<div class="recovery-audit-row ${isCorrect ? "correct" : chosen ? "chosen-wrong" : ""}"><span>${"ABCDE"[optionIndex]}</span><p><strong>${label}</strong>${scientificText(rationale)}</p></div>`;
    }).join("");
    return `<div class="recovery-feedback ${correct ? "correct" : "wrong"}"><strong>${correct ? "Acertou. O fundamento está firme." : "Ainda não. Vamos usar este erro como pista."}</strong><div class="recovery-audit">${rows}</div></div>`;
  }

  function recoveryQuestionCard(questionItem, index, record) {
    const answer = record.answers[index];
    const answered = answer !== undefined;
    const options = questionItem.options.map((option, optionIndex) => {
      const classes = ["recovery-option"];
      if (answered && optionIndex === questionItem.correct) classes.push("correct");
      if (answered && optionIndex === answer && answer !== questionItem.correct) classes.push("wrong");
      return `<button type="button" class="${classes.join(" ")}" data-action="recovery-answer" data-index="${index}" data-value="${optionIndex}" ${answered ? "disabled" : ""}><span>${"ABCDE"[optionIndex]}</span><b>${scientificText(option)}</b></button>`;
    }).join("");
    const context = questionItem.context ? `<p class="recovery-question-context">${scientificText(questionItem.context)}</p>` : "";
    return `<article class="recovery-question ${answered ? "answered" : ""}"><header><span>Questão ${index + 1}</span><small>${esc(questionItem.difficulty || "Consolidação guiada")} · ${esc(questionItem.competencyCode)} · ${esc(questionItem.skillCode)}</small></header>${context}<h3 class="recovery-question-command">${markCommandVerb(questionItem.command || questionItem.prompt)}</h3><div class="recovery-options" role="radiogroup" aria-label="Alternativas da questão ${index + 1}">${options}</div>${recoveryAnswerAudit(questionItem, answer)}</article>`;
  }

  function commandKeyFromText(value = "") {
    const normalized = normalizedText(value);
    return Object.keys(window.CAV_RECOVERY_AUDIT?.commands || {}).find((key) => normalized.includes(key)) || "determine";
  }

  function commandButton(commandKey, visibleText = "") {
    const command = window.CAV_RECOVERY_AUDIT?.commands?.[commandKey] || window.CAV_RECOVERY_AUDIT?.commands?.determine;
    const label = visibleText || command?.label || commandKey;
    return `<button type="button" class="command-verb" data-action="command-help" data-command="${esc(commandKey)}" aria-label="Entender o comando ${esc(label)}"><u>${esc(label)}</u><span aria-hidden="true">?</span></button>`;
  }

  function scientificText(value = "") {
    const protectedTokens = [];
    const protect = (html) => {
      const token = `@@CAVSCI${protectedTokens.length}@@`;
      protectedTokens.push(html);
      return token;
    };
    let source = String(value);
    source = source.replace(/\[\[frac\|([^|\]]+)\|([^\]]+)\]\]/g, (_, numerator, denominator) => protect(`<span class="science-fraction science-fraction-inline"><span class="science-numerator">${scientificText(numerator)}</span><span class="science-denominator">${scientificText(denominator)}</span></span>`));
    source = source.replace(/\[\[cut\|([^|\]]+)\|([a-z]+)\]\]/gi, (_, content, tone) => {
      const safeTone = ["gold", "cyan", "rose", "green", "violet", "orange"].includes(tone.toLowerCase()) ? tone.toLowerCase() : "gold";
      return protect(`<span class="science-cut science-cut-${safeTone}">${scientificText(content)}</span>`);
    });
    let output = esc(source)
      .replace(/_\{([^{}]+)\}/g, '<sub class="science-sub">$1</sub>')
      .replace(/\^\{([^{}]+)\}/g, '<sup class="science-sup">$1</sup>')
      .replace(/&lt;=&gt;/g, '<span class="science-arrow science-arrow-equilibrium" role="img" aria-label="reação reversível em equilíbrio">⇌</span>')
      .replace(/-&gt;/g, '<span class="science-arrow science-arrow-forward" role="img" aria-label="forma ou produz">→</span>')
      .replace(/\bDelta\b/g, "Δ");
    output = output.replace(/=\s*@@CAVSCI(\d+)@@/g, (_, index) => `<span class="science-equality"><span class="science-equals">=</span>${protectedTokens[Number(index)] || ""}</span>`);
    output = output.replace(/@@CAVSCI(\d+)@@/g, (_, index) => protectedTokens[Number(index)] || "");
    return output;
  }

  function scientificEquation(equation) {
    if (!equation) return "";
    if (typeof equation === "string") return `<span class="science-equation-linear">${scientificText(equation)}</span>`;
    const symbol = equation.symbol ? `<span class="science-equation-symbol">${scientificText(equation.symbol)} =</span>` : "";
    const fraction = `<span class="science-fraction science-fraction-display"><span class="science-numerator">${scientificText(equation.numerator)}</span><span class="science-denominator">${scientificText(equation.denominator)}</span></span>`;
    const result = equation.result ? `<span class="science-equation-result">= ${scientificText(equation.result)}</span>` : "";
    return `<span class="science-equation-layout">${symbol}${fraction}${result}</span>`;
  }

  function renderProportionDiagram(model) {
    if (!model) return "";
    const kind = model.kind === "inverse" ? "inverse" : "direct";
    const leftFactor = model.leftVerticalFactor || model.verticalFactor || "";
    const rightFactor = model.rightVerticalFactor || model.verticalFactor || "";
    const horizontalFactor = model.horizontalFactor || "";
    const arrow = (factor) => `<span>${scientificText(factor)}</span><i aria-hidden="true">→</i>`;
    return `<section class="proportion-diagram proportion-${kind}" aria-label="Montagem da regra de três"><header><small>REGRA DE TRÊS EM DUAS LINHAS</small><strong>${scientificText(model.label || (kind === "inverse" ? "Relação inversamente proporcional" : "Relação diretamente proporcional"))}</strong></header><div class="proportion-headings"><span>${scientificText(model.leftTitle || "Grandeza A")}</span><i aria-hidden="true"></i><span>${scientificText(model.rightTitle || "Grandeza B")}</span></div><div class="proportion-row"><strong>${scientificText(model.topLeft)}</strong><b class="proportion-horizontal">${arrow(horizontalFactor)}</b><strong>${scientificText(model.topRight)}</strong></div><div class="proportion-vertical"><b><i aria-hidden="true">↓</i><span>${scientificText(leftFactor)}</span></b><i aria-hidden="true"></i><b><i aria-hidden="true">↓</i><span>${scientificText(rightFactor)}</span></b></div><div class="proportion-row"><strong>${scientificText(model.bottomLeft)}</strong><b class="proportion-horizontal">${arrow(horizontalFactor)}</b><strong>${scientificText(model.bottomRight)}</strong></div>${model.conclusion ? `<p><span>Conclusão</span>${scientificText(model.conclusion)}</p>` : ""}</section>`;
  }

  function renderMolarRelations(model) {
    if (!model?.relations?.length) return "";
    const relations = model.relations.map(({ value, note }) => `<article><span aria-hidden="true">⇄</span><div><strong>${scientificText(value)}</strong><small>${scientificText(note)}</small></div></article>`).join("");
    return `<section class="molar-relations"><header><div><div class="kicker">Ponte estequiométrica</div><h2>${scientificText(model.title)}</h2></div><small>USE SOMENTE A RELAÇÃO NECESSÁRIA</small></header><div class="molar-relations-grid"><div class="molar-center"><small>PONTO DE PARTIDA</small><strong>${scientificText(model.center || "1 mol")}</strong></div>${relations}</div><p>Primeiro balanceie a equação. Depois ligue diretamente o dado ao pedido, sem criar conversões que não ajudam o raciocínio.</p></section>`;
  }

  function markCommandVerb(value = "") {
    const commandKey = commandKeyFromText(value);
    const expression = new RegExp(`\\b(${commandKey})(?:-se)?\\b`, "i");
    const match = String(value).match(expression);
    if (!match) return `${commandButton(commandKey)} ${scientificText(value)}`;
    const index = match.index || 0;
    return `${scientificText(value.slice(0, index))}${commandButton(commandKey, match[0])}${scientificText(value.slice(index + match[0].length))}`;
  }

  function renderFlashcards(cards, prefix = "recovery") {
    return `<div class="anki-grid">${cards.map(([front, back], index) => `<button type="button" class="anki-card" data-action="flashcard-flip" aria-pressed="false" aria-label="Virar cartão de memória ${index + 1}"><span class="anki-card-inner"><span class="anki-face anki-front"><small>PERGUNTA ${index + 1}</small><strong>${scientificText(front.replace(/^Frente:\s*/i, ""))}</strong><em>Toque para ver a resposta</em></span><span class="anki-face anki-back"><small>RESPOSTA ${index + 1}</small><strong>${scientificText(back.replace(/^Verso:\s*/i, ""))}</strong><em>Toque para rever</em></span></span></button>`).join("")}</div>`;
  }

  const recoveryMapLenses = [
    { label: "Estrutura do assunto", title: "Do núcleo às relações que sustentam a resposta." },
    { label: "Pistas de prova", title: "Como reconhecer o assunto dentro de um novo contexto." },
    { label: "Aplicação e repertório", title: "Conceito, exemplo e transferência para outra questão." },
  ];

  function compactMapText(value = "", max = 190) {
    const clean = String(value).replace(/\s+/g, " ").trim();
    return clean.length > max ? `${clean.slice(0, max - 1).trim()}…` : clean;
  }

  function uniqueMapLeaves(values = []) {
    const seen = new Set();
    return values.map((value) => compactMapText(value)).filter((value) => {
      const key = normalizedText(value);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 4);
  }

  function rotateMapValues(values, offset) {
    if (!values.length) return [];
    const shift = ((offset % values.length) + values.length) % values.length;
    return values.slice(shift).concat(values.slice(0, shift));
  }

  function recoveryMindBranches(curriculum, variant = 0) {
    const map = Array.isArray(curriculum.map) ? curriculum.map : [];
    const cards = Array.isArray(curriculum.flashcards) ? curriculum.flashcards : [];
    const summary = Array.isArray(curriculum.microSummary) ? curriculum.microSummary : [];
    const examples = Array.isArray(curriculum.workedExamples) ? curriculum.workedExamples : [];
    const mapCandidates = map.map(([title, detail], index) => ({
      title,
      leaves: [
        detail,
        cards[(index + variant) % Math.max(cards.length, 1)]?.[1],
        summary[(index + variant) % Math.max(summary.length, 1)],
      ],
    }));
    const cardCandidates = cards.map(([front, back], index) => ({
      title: String(front).replace(/^Frente:\s*/i, ""),
      leaves: [
        back,
        map[(index + variant) % Math.max(map.length, 1)]?.[1],
        summary[(index + variant + 1) % Math.max(summary.length, 1)],
      ],
    }));
    const applicationCandidates = map.map(([title, detail], index) => ({
      title: index % 2 ? `Aplicação · ${title}` : `Conexão · ${title}`,
      leaves: [
        summary[(index + variant + 2) % Math.max(summary.length, 1)],
        detail,
        examples[(index + variant) % Math.max(examples.length, 1)]?.result,
        examples[(index + variant) % Math.max(examples.length, 1)]?.mirror,
      ],
    }));
    const banks = [mapCandidates, cardCandidates, applicationCandidates];
    const primary = banks[variant % banks.length].filter((item) => item.title);
    const reserve = banks.flat().filter((item) => item.title);
    const merged = [...rotateMapValues(primary, variant), ...rotateMapValues(reserve, variant + 1)];
    const seenTitles = new Set();
    const branches = [];
    merged.forEach((item) => {
      const titleKey = normalizedText(item.title);
      if (!titleKey || seenTitles.has(titleKey) || branches.length >= 6) return;
      seenTitles.add(titleKey);
      const leaves = uniqueMapLeaves(item.leaves);
      if (leaves.length) branches.push({ title: item.title, leaves });
    });
    return branches;
  }

  function recoveryStudyTools(curriculum) {
    const rotation = Number(state.recoveryMapVariants[state.activeRecoveryKey] || 0);
    const variant = rotation % recoveryMapLenses.length;
    const lens = recoveryMapLenses[variant];
    const branchData = recoveryMindBranches(curriculum, rotation);
    const connectorPaths = [
      "M500 380 C430 380 410 150 325 150",
      "M500 380 C570 380 590 150 675 150",
      "M500 380 C430 380 410 380 325 380",
      "M500 380 C570 380 590 380 675 380",
      "M500 380 C430 380 410 610 325 610",
      "M500 380 C570 380 590 610 675 610",
    ];
    const connectors = branchData.map((_, index) => `<path class="tone-${(index % 6) + 1}" d="${connectorPaths[index]}" pathLength="1"></path>`).join("");
    const branches = branchData.map(({ title, leaves }, index) => `<article class="mind-map-limb slot-${index + 1} tone-${(index % 6) + 1}"><div class="mind-map-branch"><header><i>${String(index + 1).padStart(2, "0")}</i><strong>${scientificText(title)}</strong></header><ul>${leaves.map((leaf) => `<li>${scientificText(leaf)}</li>`).join("")}</ul></div></article>`).join("");
    return `<section class="recovery-study-grid"><div class="mind-map"><header class="mind-map-heading"><div><div class="kicker">Mapa mental · ${esc(lens.label)}</div><h2>${esc(lens.title)}</h2></div><div class="mind-map-variant"><small>ABORDAGEM ${rotation + 1}</small>${btn("Ver outra abordagem", "recovery-map-next", "mind-map-refresh")}</div></header><div class="mind-map-canvas"><svg class="mind-map-connectors" viewBox="0 0 1000 760" preserveAspectRatio="none" aria-hidden="true">${connectors}</svg><div class="mind-map-core"><small>Diagnóstico central</small><strong>${scientificText(curriculum.title)}</strong><span>${scientificText(curriculum.microtheme)}</span></div><div class="mind-map-trunk">${branches}</div></div></div><div class="flashcard-stack"><div class="kicker">Prescrição de memória · 3 vezes ao dia</div>${renderFlashcards(curriculum.flashcards)}</div></section>`;
  }

  function recoveryInfographic(curriculum) {
    const map = curriculum.map || [];
    if (!map.length) return "";
    const actions = ["Reconheça o núcleo", "Relacione as pistas", "Aplique no contexto", "Confira a resposta", "Explique a escolha", "Retome o erro"];
    const panels = map.slice(0, 6).map(([title, detail], index, items) => `<article class="review-infographic-panel tone-${(index % 6) + 1}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${scientificText(title)}</strong><p>${scientificText(detail)}</p><small>${actions[index]}</small></article>${index < items.length - 1 ? '<i class="review-flow-arrow" aria-hidden="true"></i>' : ""}`).join("");
    return `<section class="review-infographic"><header><div><div class="kicker">Infográfico de revisão</div><h2>Do diagnóstico à resposta.</h2></div><small>LEITURA VISUAL DE 30 SEGUNDOS</small></header><div class="review-infographic-flow">${panels}</div><footer><span>Conduta final</span><strong>Use o percurso visual para explicar a ideia com suas próprias palavras antes de voltar à questão.</strong></footer></section>`;
  }

  function recoveryMicroSummary(curriculum) {
    const items = (curriculum.microSummary || []).map((item, index) => `<li><span>${index + 1}</span><p>${scientificText(item)}</p></li>`).join("");
    if (!items) return "";
    return `<section class="micro-summary"><header><div><div class="kicker">Microresumo de plantão</div><h2>O que você precisa lembrar agora</h2></div><small>LEITURA DE 60 SEGUNDOS</small></header><ol>${items}</ol></section>`;
  }

  function recoveryWorkedExample(curriculum) {
    const examples = curriculum.workedExamples || (curriculum.workedExample ? [curriculum.workedExample] : []);
    if (!examples.length) return "";
    return `<div class="worked-example-pair">${examples.map((example, exampleIndex) => {
      const steps = example.steps.map(([label, content]) => `<li><small>${esc(label)}</small><strong>${scientificText(content)}</strong></li>`).join("");
      const medicalLabel = exampleIndex ? "Plantão de consolidação" : "Primeiros socorros do raciocínio";
      return `<section class="worked-example"><header><div><div class="kicker">${medicalLabel}</div><h2>${scientificText(example.title)}</h2></div><span>${scientificEquation(example.formula)}</span></header><p class="worked-prompt">${markCommandVerb(example.prompt)}</p>${renderProportionDiagram(example.proportion)}<ol>${steps}</ol><div class="worked-result"><small>Resposta do exemplo</small><strong>${scientificText(example.result)}</strong></div><div class="mirror-callout"><span>${icon("copy")}</span><div><small>Agora faça igual</small><strong>${scientificText(example.mirror)}</strong></div></div></section>`;
    }).join("")}</div>`;
  }

  function solvedAuditExample(example, level) {
    const commandKey = commandKeyFromText(example.prompt);
    const steps = example.steps.map((step, index) => `<li><span>${index + 1}</span><p>${scientificText(step)}</p></li>`).join("");
    const equation = example.equation ? `<div class="audit-equation"><small>CONTA MONTADA E SIMPLIFICADA</small><strong>${scientificEquation(example.equation)}</strong><p>Os cortes coloridos representam somente fatores multiplicativos comuns.</p></div>` : "";
    const medicalLabel = normalizedText(level).includes("medio") ? "PLANTÃO DE CONSOLIDAÇÃO" : "PRIMEIROS SOCORROS DO RACIOCÍNIO";
    return `<article class="audit-solved-example level-${normalizedText(level)}"><header><div><small>${medicalLabel}</small><h3>${scientificText(example.title)}</h3></div><span>${commandButton(commandKey)}</span></header><p class="audit-example-prompt">${markCommandVerb(example.prompt)}</p>${renderProportionDiagram(example.proportion)}<ol>${steps}</ol>${equation}<footer><small>Resposta interpretada</small><strong>${scientificText(example.answer)}</strong></footer></article>`;
  }

  function renderScientificNotation(notation = []) {
    if (!notation.length) return "";
    return `<section class="audit-science-notation"><header><div><div class="kicker">Escrita científica protegida</div><h2>O símbolo também ensina.</h2></div><small>SUBSCRITO · SOBRESCRITO · SETAS</small></header><div>${notation.map(({ label, expression, note }) => `<article><small>${esc(label)}</small><strong>${scientificText(expression)}</strong><p>${scientificText(note)}</p></article>`).join("")}</div></section>`;
  }

  function renderQuantitativeProtocol(domain) {
    if (!domain.quantitative) return "";
    return `<section class="audit-quantitative-protocol"><header><div><div class="kicker">Regra transversal de cálculo</div><h2>O mesmo cuidado em toda matéria quantitativa.</h2></div><small>SEM ATALHOS OCULTOS</small></header><ol><li><span>01</span><p><strong>Dados e pedido</strong>Separe o que foi fornecido do que precisa ser encontrado.</p></li><li><span>02</span><p><strong>Grandezas e unidades</strong>Alinhe grandezas correspondentes e converta apenas quando necessário.</p></li><li><span>03</span><p><strong>Teste da relação</strong>Decida se é direta, inversa ou não proporcional. Nunca force uma regra de três.</p></li><li><span>04</span><p><strong>Duas linhas</strong>Conhecido acima, caso pedido abaixo, incógnita na coluna correspondente e fatores visíveis.</p></li><li><span>05</span><p><strong>Cálculo limpo</strong>Repita a operação correta e retire unidades da aritmética, salvo quando essenciais em Física.</p></li><li><span>06</span><p><strong>Resposta interpretada</strong>Recupere a unidade final e explique o significado do resultado.</p></li></ol></section>`;
  }

  function recoveryAuditPage() {
    const catalog = window.CAV_RECOVERY_AUDIT;
    if (!catalog) return shell(pageHead("Auditoria pedagógica", "A galeria não foi carregada.", "Atualize a página para tentar novamente."), "");
    const courseKey = catalog.courses[state.recoveryAuditCourse] ? state.recoveryAuditCourse : "ultimate";
    const course = catalog.courses[courseKey];
    const selectedArea = course.areas.find(([areaKey]) => areaKey === state.recoveryAuditArea) || course.areas[0];
    const [areaKey, areaLabel, domainKey] = selectedArea;
    const domain = catalog.domains[domainKey];
    state.recoveryAuditCourse = courseKey;
    state.recoveryAuditArea = areaKey;
    const command = catalog.commands[domain.command];
    const courseTabs = Object.entries(catalog.courses).map(([key, item]) => `<button type="button" class="audit-course-tab ${key === courseKey ? "active" : ""}" data-action="audit-course" data-course="${esc(key)}" aria-pressed="${key === courseKey}"><img src="../../assets/cavprime/five-logos-20260926/portal-official-png-v2/${esc(item.logo)}" alt=""><span>${esc(item.label)}</span></button>`).join("");
    const areaTabs = course.areas.map(([key, label]) => `<button type="button" class="audit-area-tab ${key === areaKey ? "active" : ""}" data-action="audit-area" data-area="${esc(key)}" aria-pressed="${key === areaKey}">${esc(label)}</button>`).join("");
    const dataRows = domain.data.map((item) => `<li><u>${scientificText(item)}</u></li>`).join("");
    const practice = domain.practice.map((item, index) => `<li><span>${index + 1}</span><p>${markCommandVerb(item)}</p></li>`).join("");
    const mapLink = domainKey === "biologia" ? link(`Abrir mapa mental completo de Célula ${icon("arrow")}`, "mapa-mental/celula", "btn goldbtn") : "";
    return shell(`${pageHead("Prancha de auditoria", "Cada erro vira<br>um caminho de domínio.", "Escolha um curso e uma área. O protocolo adapta linguagem, banca e nível sem expor a inteligência dos bastidores.")}<nav class="audit-course-tabs" aria-label="Cursos">${courseTabs}</nav><div class="audit-course-note"><strong>${esc(course.label)}</strong><span>${esc(course.note)}</span></div><nav class="audit-area-tabs" aria-label="Áreas do curso">${areaTabs}</nav><section class="audit-clinical-case"><header><span>HOSPITAL CAVMED · CASO DEMONSTRATIVO</span><strong>${esc(areaLabel)} · ${scientificText(domain.title)}</strong></header><div class="audit-command-line">${commandButton(domain.command)} <p>${scientificText(domain.prompt)}</p></div><div class="audit-diagnosis-grid"><div><small>Dados do problema</small><ul>${dataRows}</ul></div><div><small>Pedido</small><p>${scientificText(domain.ask)}</p></div><div><small>O verbo exige</small><p>${scientificText(command.requirement)}</p></div></div></section>${renderQuantitativeProtocol(domain)}${renderMolarRelations(domain.molarRelations)}<div class="audit-example-grid">${solvedAuditExample(domain.easy, "fácil")}${solvedAuditExample(domain.medium, "médio")}</div>${renderScientificNotation(domain.notation)}<section class="audit-flashcards"><header><div><div class="kicker">Prescrição de memória · 3 vezes ao dia</div><h2>Uma dose agora. Duas revisões ao longo do dia.</h2></div><small>TOQUE PARA VER A RESPOSTA</small></header>${renderFlashcards(domain.flashcards, `${courseKey}-${areaKey}`)}</section><section class="audit-practice"><header><div><div class="kicker">Treino de confiança</div><h2>Cinco questões acessíveis e bem contextualizadas.</h2></div><span>5 itens</span></header><ol>${practice}</ol></section><div class="audit-next-step"><div><small>Próximo passo sugerido</small><strong>Resolver os cinco itens e voltar à questão que abriu o prontuário.</strong></div>${mapLink || link(`Voltar ao mapa da jornada ${icon("arrow")}`, "mapa", "btn outline")}</div>`, "");
  }

  function cellMindMapPage() {
    const catalog = window.CAV_RECOVERY_AUDIT;
    const courseKey = catalog?.courses?.[state.recoveryAuditCourse] ? state.recoveryAuditCourse : "ultimate";
    const course = catalog?.courses?.[courseKey] || { label: "UltimateENEM", logo: "ultimate_enem.png" };
    const returnRoute = auditModeEnabled() ? "auditoria/recuperacao" : (state.activeRecoveryKey ? `recuperacao/${encodeURIComponent(state.activeRecoveryKey)}` : "erros");
    const cards = [
      ["01", "Teoria celular", ["Hooke nomeou as pequenas cavidades vistas na cortiça.", "Schleiden e Schwann associaram plantas e animais às células.", "Virchow consolidou: toda célula deriva de outra célula.", "Célula = unidade estrutural e funcional dos seres vivos."], "rose"],
      ["02", "Tipos de células", ["Procariótica: sem núcleo delimitado e sem organelas membranosas.", "Eucariótica: núcleo verdadeiro e compartimentos internos.", "Célula animal: sem parede celular e sem cloroplastos.", "Célula vegetal: parede, cloroplastos e grande vacúolo."], "gold"],
      ["03", "Membrana plasmática", ["Bicamada de fosfolipídios com proteínas associadas.", "Delimita a célula e mantém o meio interno.", "Controla a entrada e a saída de substâncias.", "Reconhecimento e comunicação dependem de proteínas e glicídios."], "green"],
      ["04", "Citoplasma e organelas", ["Mitocôndria: respiração celular e produção de ATP.", "Ribossomo: síntese de proteínas.", "Retículo e Golgi: produção, modificação e transporte.", "Lisossomo: digestão; citoesqueleto: forma e movimento."], "cyan"],
      ["05", "Núcleo e material genético", ["Envoltório nuclear duplo com poros seletivos.", "Cromatina = DNA associado a proteínas.", "Nucléolo participa da formação dos ribossomos.", "Expressão gênica orienta estrutura e funcionamento celular."], "violet"],
      ["06", "Diferenciação e tecidos", ["Células do organismo compartilham, em geral, o mesmo DNA.", "Genes diferentes podem ser ativados em cada tipo celular.", "Especializações produzem forma e função próprias.", "Células semelhantes organizam tecidos, órgãos e sistemas."], "orange"],
    ];
    return shell(`<section class="cell-map-sheet" aria-labelledby="cell-map-title"><header class="cell-map-header"><img src="../../assets/cavprime/five-logos-20260926/portal-official-png-v2/${esc(course.logo)}" alt="${esc(course.label)}"><div><small>HOSPITAL CAVMED · CIÊNCIAS DA VIDA</small><strong>Mapa mental autoral do plantão</strong></div></header><div class="cell-map-title"><span>MICRORESUMO VISUAL · ${esc(course.label)}</span><h1 id="cell-map-title">CÉLULA</h1><p>A unidade estrutural e funcional da vida</p></div><div class="cell-map-grid"><div class="cell-map-art"><img src="../../assets/cavprime/pedagogy/mindmaps/cell-biology-illustration-v1.avif" alt="Ilustração científica de células procariótica, animal e vegetal, organelas e membrana plasmática"><div class="cell-map-core"><strong>ESTRUTURA</strong><span>organização</span><i></i><strong>FUNÇÃO</strong><span>sobrevivência</span></div></div>${cards.map(([number, title, points, tone], index) => `<article class="cell-topic tone-${tone} topic-${index + 1}"><span>${number}</span><div><h2>${esc(title)}</h2><ul>${points.map((point) => `<li>${esc(point)}</li>`).join("")}</ul></div></article>`).join("")}</div><div class="cell-map-clinical"><strong>Leitura clínica em 20 segundos</strong><span>localize a estrutura</span><i></i><span>nomeie a função</span><i></i><span>relacione ao efeito celular</span></div><footer class="cell-map-footer"><span>Material pedagógico autoral · médicos especialistas do Hospital CAVMED</span><strong>Células hoje. Grandes conquistas amanhã.</strong></footer></section><div class="mindmap-actions">${link("Voltar ao atendimento", returnRoute, "btn outline")}${btn("Imprimir mapa mental " + icon("book"), "print-mindmap", "btn")}</div>`, "");
  }

  function recoveryPage() {
    const entry = activeRecoveryEntry();
    if (!entry) return shell(`${pageHead("Recuperação guiada", "Este atendimento precisa de uma questão de origem.", "Volte ao prontuário e escolha uma questão errada para começar.")}${link(`Abrir prontuário ${icon("arrow")}`, "erros", "btn")}`, "");
    const curriculum = recoveryCurriculum(entry);
    if (!curriculum?.supported) return shell(`${pageHead("Recuperação específica", "Este curso pede outro tipo de cuidado.", "O VaiBem usa trilhas adequadas à etapa escolar e não recebe automaticamente esta recuperação geral.")}${link(`Voltar ao prontuário ${icon("arrow")}`, "erros", "btn")}`, "");
    const key = state.activeRecoveryKey;
    const record = recoveryRecord(key);
    const answered = curriculum.questions.filter((_, index) => record.answers[index] !== undefined).length;
    const scoreValue = curriculum.questions.reduce((total, questionItem, index) => total + (record.answers[index] === questionItem.correct ? 1 : 0), 0);
    const complete = answered === curriculum.questions.length;
    const source = curriculum.source;
    const conclusion = complete ? `<div class="recovery-complete"><span>${icon(scoreValue >= 4 ? "check" : "book")}</span><div><small>Atendimento concluído</small><strong>${scoreValue} de ${curriculum.questions.length} fundamentos consolidados</strong><p>${scoreValue >= 4 ? "Você já pode voltar à questão de origem com mais segurança." : "O caminho está aberto. Reveja os cartões e refaça a questão de origem com calma."}</p></div>${link(`Voltar ao prontuário ${icon("arrow")}`, "erros", "btn")}</div>` : "";
    return shell(`${pageHead("Recuperação guiada", "Primeiro o fundamento.<br>Depois, a confiança.", "Cinco questões acessíveis, contextualizadas e ligadas à competência e à habilidade do erro original.")}<div class="recovery-identity"><div><small>Questão de origem</small><strong>${scientificText(entry.question.title)}</strong></div><div><span>${esc(curriculum.competencyCode)}</span><span>${esc(curriculum.skillCode)}</span><span>${scientificText(curriculum.microtheme)}</span></div></div><section class="recovery-source"><div><span class="source-badge">Caso clínico do Hospital CAVMED</span><h2>${scientificText(curriculum.title)}</h2><p>${scientificText(curriculum.summary)}</p><small><strong>${scientificText(source.title)}</strong> · ${scientificText(source.chapter)}</small><small>${scientificText(source.fit)}</small></div><aside><small>Clínica responsável</small><strong>${scientificText(source.path)}</strong><span>${scientificText(curriculum.policy.standard)}</span></aside></section>${recoveryMicroSummary(curriculum)}${recoveryStudyTools(curriculum)}${recoveryInfographic(curriculum)}${renderQuantitativeProtocol(curriculum)}${renderMolarRelations(curriculum.molarRelations)}${recoveryWorkedExample(curriculum)}${renderScientificNotation(curriculum.notation)}<div class="recovery-practice-head"><div><div class="kicker">Treino de confiança</div><h2>Resolva cinco questões contextualizadas da mesma habilidade.</h2></div><div class="recovery-progress"><strong>${answered}/5</strong><span><i style="width:${answered * 20}%"></i></span></div></div><div class="recovery-questions">${curriculum.questions.map((questionItem, index) => recoveryQuestionCard(questionItem, index, record)).join("")}</div>${conclusion}`, "erros");
  }

  result = function hardResult() {
    if (!state.submitted) return caseIntro();
    const total = score();
    const errors = questions.length - total;
    const following = nextArea();
    return focus(`<div class="result-head"><div class="score-circle">${icon(total >= 5 ? "check" : "book")}</div><div class="kicker muted">Correção concluída · ${areas[state.hardArea].short}</div><h1>${errors ? "Seu prontuário já está aberto." : "Bloco consolidado."}</h1><div class="result-score">${total}<span> / ${questions.length} acertos</span></div><p>${errors ? `As ${errors} questões erradas foram abertas abaixo com gabarito, comentário e classificação pedagógica.` : "Nenhum erro desta lista precisa entrar no prontuário."}</p></div><div class="engine-caption">Este resultado já foi incorporado ao seu histórico de aprendizagem.</div><div class="space">${questions.map((questionItem, index) => resultReviewItem(questionItem, index, state.hardArea, state.answers[index])).join("")}</div><div class="space">${following ? btn(`Continuar em ${areas[following].short} ${icon("arrow")}`, "advance-area", "btn wfull", `data-area="${following}"`) : link(`Avançar para Redação ${icon("arrow")}`, "redacao", "btn wfull")}</div>`);
  };

  errors = function hardErrors() {
    const errorsList = wrongEntries();
    return shell(`${pageHead("Revisão orientada", "Prontuário de aprendizagem.", "Somente as questões erradas entram aqui. Nossos médicos transformam competência, habilidade, motivo e percepção do aluno em uma próxima conduta.")}${errorsList.length ? errorsList.map((entry, position) => resultReviewItem(entry.question, entry.index, entry.areaId, entry.answer).replace("<details class=\"review-item answer-review\" open>", `<details class="review-item answer-review" ${position === 0 ? "open" : ""}>`)).join("") : `<div class="empty">${icon("check")}<h2>Nenhum erro pendente.</h2><p>Quando uma resposta estiver errada, o prontuário abrirá automaticamente na própria correção.</p>${link("Voltar ao próximo passo", "hoje", "btn")}</div>`}`);
  };

  function cumulativeStats() {
    let total = 0;
    let correct = 0;
    areaOrder.forEach((areaId) => {
      const run = state.hardRuns[areaId];
      if (!run?.submitted) return;
      total += 6;
      correct += runScore(areaId);
    });
    state.externalLists.filter((list) => list.completed).forEach((list) => {
      total += list.questions.length;
      correct += list.score;
    });
    return { total, correct, percent: total ? (correct / total) * 100 : 0 };
  }

  progress = function hardProgress() {
    const stats = cumulativeStats();
    const completedExternal = state.externalLists.filter((list) => list.completed).length;
    return shell(`${pageHead("Evolução com direção", "Você sabe onde está.<br>E o que fazer agora.", "Listas do app e listas externas ficam separadas na origem, mas trabalham juntas na leitura do ciclo.")}<div class="cumulative-strip"><div><small>Listas concluídas</small><strong>${completedAreaCount() + completedExternal}</strong><small>${completedAreaCount()} do app · ${completedExternal} externas</small></div><div><small>Média acumulada</small><strong>${stats.percent.toFixed(2)}%</strong><small>${stats.correct} acertos em ${stats.total || 0} respostas</small></div><div><small>Patente atual</small><strong>${patent().name}</strong><small>${stats.total ? (stats.percent >= 80 ? "Desempenho forte; preserve a consistência." : "O próximo ciclo já priorizou os pontos frágeis.") : "Conclua a primeira lista para iniciar a leitura."}</small></div></div><section class="space"><h2>Leitura por área.</h2>${areaOrder.map((areaId) => { const value = runScore(areaId); const percent = value === null ? 0 : value / 6 * 100; return `<div class="progress-row"><span>${areas[areaId].short}</span><div class="bar"><span style="width:${percent}%"></span></div><span>${value === null ? "—" : `${percent.toFixed(0)}%`}</span></div>`; }).join("")}</section>${row("Prontuário de atendimento", `${wrongEntries().length} questões aguardam ou preservam revisão.`, "erros", "book")}${row("Prontuário médico da aprendizagem", "Desempenho, evolução e próximas condutas em uma leitura única.", "relatorio", "chart")}` , "progresso");
  };

  report = function hardReport() {
    const stats = cumulativeStats();
    const completedExternal = state.externalLists.filter((list) => list.completed);
    const essayTotal = state.essay.recorded ? state.essay.scores.reduce((sum, value) => sum + value, 0) : null;
    const featuredDocument = studentRecordDocuments()[0];
    return shell(`${pageHead("Prontuário médico da aprendizagem", "Seu quadro completo.<br>Sua próxima conduta.", "Desempenho, evolução e orientações aparecem juntos, enquanto os cálculos internos permanecem nos bastidores.")}<div class="card"><div class="score-columns"><div><div class="kicker muted">Listas do app</div><h2 class="space-sm">${completedAreaCount()} concluídas</h2><p>${areaOrder.map((areaId) => `${areas[areaId].short}: ${runScore(areaId) === null ? "—" : `${runScore(areaId)}/6`}`).join(" · ")}</p></div><div><div class="kicker muted">Listas externas</div><h2 class="space-sm">${completedExternal.length} concluídas</h2><p>${completedExternal.length ? completedExternal.map((list) => `${esc(list.name)}: ${list.score}/${list.questions.length}`).join(" · ") : "Nenhuma lista externa concluída."}</p></div></div></div><div class="summary-row"><div class="kicker">Média objetiva acumulada</div><p>${stats.percent.toFixed(2)}% · ${stats.correct} acertos em ${stats.total || 0} questões respondidas.</p></div><div class="summary-row"><div class="kicker">Redação</div><p>${essayTotal === null ? "Projeto em andamento, sem avaliação registrada." : `${essayTotal}/1000 · resultado calculado segundo a regra de dois corretores.`}</p></div><div class="summary-row"><div class="kicker">Próxima conduta</div><p>${wrongEntries().length ? `Revisar ${wrongEntries().length} questões no prontuário antes de elevar a dificuldade.` : "Prosseguir para uma nova aplicação ou para o projeto de Redação."}</p></div><div class="document-preview space"><div class="document-preview-head"><span><small>Documento clínico-pedagógico</small><strong>${esc(featuredDocument.title)}</strong></span>${link(`Consultar meu prontuário ${icon("arrow")}`, "documentos/0", "textbtn")}</div>${reportDocumentPreview(featuredDocument, false)}</div>`, "progresso");
  };

  function reportDocumentHref(documentItem) {
    return `../../output/pdf/${encodeURIComponent(documentItem.file)}`;
  }

  function reportDocumentPreview(documentItem, allPages = true) {
    const pages = allPages ? documentItem.previewPages : 1;
    return `<div class="pdf-shell"><div class="pdf-pages">${Array.from({ length: pages }, (_, index) => `<figure class="pdf-page"><img src="../../output/pdf/previews/${documentItem.preview}/page-${index + 1}.jpg" loading="${index ? "lazy" : "eager"}" alt="${esc(documentItem.title)} · página ${index + 1} de ${documentItem.previewPages}"><figcaption>Página ${index + 1} de ${documentItem.previewPages}</figcaption></figure>`).join("")}</div></div>`;
  }

  function studentRecordDocuments() {
    return [
      {
        ...reportDocuments[0],
        title: "Prontuário médico da aprendizagem",
        detail: "Desempenho, evolução por área, Redação, prontuário dos erros e próximas condutas.",
      },
      {
        ...reportDocuments[1],
        title: "Síntese clínica para a família",
        detail: "Evidências do ciclo, pontos fortes, atenção pedagógica e plano conjunto para as próximas três semanas.",
      },
    ];
  }

  function documentHub(selectedIndex = 0) {
    const auditMode = auditModeEnabled();
    const visibleDocuments = auditMode ? reportDocuments : studentRecordDocuments();
    const safeIndex = Number.isInteger(selectedIndex) && visibleDocuments[selectedIndex] ? selectedIndex : 0;
    const selectedDocument = visibleDocuments[safeIndex];
    const heading = auditMode
      ? pageHead("Auditoria documental interna", "Identidade preservada.<br>Área segura em todas as páginas.", "Modelos fictícios e documentos de todos os cursos ficam restritos à auditoria.")
      : pageHead("Prontuário médico da aprendizagem", "Seu histórico completo.<br>Sem expor os bastidores.", "Aqui aparecem somente os documentos do aluno e a síntese destinada à família.");
    const editorialRule = auditMode ? `<div class="callout space"><strong>Regra editorial preservada.</strong><br>Nenhuma caixa toca cabeçalho ou rodapé; documentos com mais conteúdo criam novas páginas sem comprimir margens ou texto.</div>` : "";
    return shell(`${heading}<div class="document-grid">${visibleDocuments.map((documentItem, index) => `<a class="document-card ${index === safeIndex ? "active" : ""}" href="#/documentos/${index}" aria-current="${index === safeIndex ? "page" : "false"}"><span class="document-icon">${icon("book")}</span><span><small>${esc(documentItem.pages)}</small><strong>${esc(documentItem.title)}</strong><em>${esc(documentItem.detail)}</em></span>${icon("arrow")}</a>`).join("")}</div><section class="document-preview space"><div class="document-preview-head"><span><small>Visualização dentro do aplicativo</small><strong>${esc(selectedDocument.title)}</strong></span><a class="textbtn" href="${reportDocumentHref(selectedDocument)}" target="_blank" rel="noopener">Abrir documento completo ${icon("arrow")}</a></div>${reportDocumentPreview(selectedDocument, true)}</section>${editorialRule}`, "");
  }

  function patentRulesPage() {
    const rows = (testData.patents || []).map((rule) => {
      const essayMinutes = rule.essayTrainingMinutes ?? essayMinutesByPatent[Number(rule.level)];
      return `<tr class="${Number(rule.level) === Number(state.patent) ? "current" : ""}"><td><strong>${esc(rule.name)}</strong>${Number(rule.level) === Number(state.patent) ? "<small>Patente atual</small>" : ""}</td><td>${rule.questionsPerCase}</td><td>${formatMinutes(rule.minutesPerQuestion)} min</td><td>${formatMinutes(Number(rule.questionsPerCase) * Number(rule.minutesPerQuestion))} min</td><td>${formatMinutes(essayMinutes)} min</td></tr>`;
    }).join("");
    return shell(`${pageHead("Regra das oito patentes", "Volume e tempo sem dúvida.", "A amostra de seis itens existe apenas para testar a interface; o caso semanal segue a prescrição integral abaixo.")}<div class="table-scroll"><table class="rules-table"><thead><tr><th>Patente</th><th>Questões</th><th>Por questão</th><th>Caso completo</th><th>Redação</th></tr></thead><tbody>${rows}</tbody></table></div><div class="callout space"><strong>${esc(activePatentRule().name)}.</strong><br>Prescrição atual: ${activePatentRule().questionsPerCase} questões em ${formatMinutes(patentCaseMinutes())} minutos. A revisão de itens fáceis, recorrentes e estratégicos permanece em todas as patentes.</div>`, "");
  }

  function trialOnboarding() {
    const product = products[selectedProduct] || products.ultimate;
    const experience = productExperiences[selectedProduct] || productExperiences.ultimate;
    const existing = state.trials[selectedProduct];
    const end = existing?.endsAt ? new Date(existing.endsAt) : new Date(Date.now() + 7 * 86400000);
    if (existing) {
      return shell(`${pageHead("Degustação ativa", `Seus sete dias de<br>${esc(product.name)} começaram.`, `Acesso demonstrativo válido até ${end.toLocaleDateString("pt-BR")}.`)}<section class="priority"><div class="priority-top"><span class="kicker">Degustação completa</span><span class="pill goldpill">7 dias</span></div><div class="priority-content" style="grid-template-columns:1fr"><div><h2>${esc(experience.title)}</h2><p>${esc(experience.description)}</p></div></div><div class="priority-cta">${link("Entrar no curso " + icon("arrow"), selectedProduct === "ultimate" ? "hoje" : selectedProduct === "vaibem" ? "vaibem" : `${selectedProduct}/hoje`, "btn goldbtn")}</div></section>`, "", selectedProduct);
    }
    return shell(`${pageHead(experience.eyebrow, `Conheça ${esc(product.name)}<br>por sete dias.`, "Degustação completa, sem esconder recursos. O cadastro desta prévia permanece somente neste navegador.")}<div class="trial-layout"><section class="trial-promise"><div class="kicker muted">O que você vai experimentar</div><h2>${esc(experience.title)}</h2><p>${esc(experience.description)}</p><ul><li>Acesso completo durante sete dias.</li><li>Progresso preservado ao longo da degustação.</li><li>Próximo passo indicado dentro do próprio curso.</li></ul></section><form id="trial-form" class="card" data-product="${esc(selectedProduct)}"><label class="field">Nome<input id="trial-name" value="${esc(state.name || "")}" autocomplete="name" required maxlength="60"></label><label class="field space-sm">E-mail<input id="trial-email" type="email" autocomplete="email" placeholder="voce@email.com" required></label><label class="field space-sm">Crie uma senha<input id="trial-password" type="password" autocomplete="new-password" minlength="8" required></label><label class="consent-line space-sm"><input type="checkbox" required><span>Li e aceito iniciar a degustação demonstrativa de sete dias.</span></label><button type="submit" class="btn goldbtn wfull space">Começar meus sete dias ${icon("arrow")}</button><p class="note">Na produção, o e-mail será verificado antes da ativação. Nenhum dado real é enviado nesta prévia.</p></form></div>`, "", selectedProduct);
  }

  function newsFilteredTopics() {
    return currentAffairsTopics.filter((topic) => state.newsArea === "todas" || topic.area === state.newsArea);
  }

  currentNews = function hardCurrentNews() {
    const selectedCount = state.newsSelections.filter((id) => currentAffairsTopics.some((topic) => topic.id === id)).length;
    return shell(`${pageHead("Atualidades", "Notícia filtrada.<br>Repertório com finalidade.", "O fluxo de seleção e o caderno imprimível estão ativos. As notícias desta prévia são demonstrativas até a conexão com fontes editoriais verificadas.")}<div class="news-toolbar"><div class="chips" aria-label="Filtrar por área">${[["todas", "Todas"], ...areaOrder.map((id) => [id, areas[id].short])].map(([id, label]) => btn(label, "news-filter", `chip ${state.newsArea === id ? "selected" : ""}`, `data-area="${id}"`)).join("")}</div><div class="news-action"><span>${selectedCount} tópicos no caderno</span>${btn("Preparar leitura em PDF " + icon("download"), "news-print", "btn outline")}</div></div><div class="news-list">${newsFilteredTopics().map((topic) => `<article class="news-item"><label class="news-check"><input type="checkbox" data-news-id="${topic.id}" ${state.newsSelections.includes(topic.id) ? "checked" : ""}><span></span></label><div><div class="kicker muted">${esc(areas[topic.area]?.short || topic.area)} · ${esc(topic.date)}</div><h2>${esc(topic.title)}</h2><p>${esc(topic.summary)}</p><div class="news-meta"><span><strong>Aplicação:</strong> ${esc(topic.application)}</span><span><strong>Habilidade:</strong> ${esc(topic.skill)}</span><span><strong>Fonte nesta prévia:</strong> ${esc(topic.source)}</span></div></div></article>`).join("")}</div>`, "");
  };

  simulation = function hardSimulation() {
    const day = state.simulationDay === 2 ? 2 : 1;
    const duration = day === 1 ? 330 : 300;
    const timerKey = `enem:simulado:dia-${day}`;
    const displayedTime = state.examTimer.key === timerKey ? timerRemaining() : duration * 60;
    const todayIsSaturday = new Date().getDay() === 6;
    return shell(`${pageHead(`Simulado de sábado · ${patent().name}`, "O relógio reproduz<br>o tempo oficial.", "O simulado completo mantém 180 questões. A Língua Estrangeira é substituída por cinco itens de outras habilidades de Linguagens, conforme a regra do curso.")}<div class="simulation-days" role="tablist" aria-label="Dia do simulado">${btn("Dia 1 · 5h30", "simulation-day", `chip ${day === 1 ? "selected" : ""}`, `data-day="1" role="tab" aria-selected="${day === 1}"`)}${btn("Dia 2 · 5h", "simulation-day", `chip ${day === 2 ? "selected" : ""}`, `data-day="2" role="tab" aria-selected="${day === 2}"`)}</div><section class="priority space-sm"><div class="priority-top"><span class="kicker">${todayIsSaturday ? "Aplicação de sábado" : "Simulado programado para sábado"}</span><span class="pill goldpill">180 questões no ciclo completo</span></div><div class="priority-content"><div><h2>Dia ${day}.<br>${duration} minutos oficiais.</h2><p>Respostas são preservadas, o cronômetro continua mesmo com atualização da página e qualquer saída da tela é registrada no modo de prova.</p></div><div class="timer-hero" id="simulation-timer">${formatTimer(displayedTime)}</div></div><div class="priority-cta">${btn(`${state.examTimer.running && state.examTimer.key === timerKey ? "Pausar" : "Iniciar"} cronômetro ${icon("clock")}`, "timer-toggle", "btn goldbtn")}${btn("Entrar no modo de prova", "exam-focus", "textbtn")}</div></section><div class="callout space"><strong>Aplicação real.</strong><br>O cronômetro está pronto; esta prévia não replica as 180 questões na tela. O banco integral será conectado à jornada do UltimateENEM.</div>`, "");
  };

  function selectedEssayPack() {
    return essayPacks.find((pack) => pack.id === state.hardEssayPackId) || essayPacks.find((pack) => pack.theme === state.essay.theme) || essayPacks[0] || null;
  }

  function essaySearchResults(query = "") {
    const normalized = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return essayPacks.filter((pack) => !normalized || `${pack.title} ${pack.theme}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(normalized)).slice(0, 24).map((pack) => btn(`<span><strong>${esc(pack.theme)}</strong><small>${pack.competencyBoxes?.length || 5} competências · abrir projeto guiado</small></span>${icon("chevron")}`, "hard-theme", "resource-row", `data-pack="${esc(pack.id)}"`)).join("") || `<p class="note">Nenhum recorte encontrado.</p>`;
  }

  essayHome = function hardEssayHome() {
    const pack = selectedEssayPack();
    const hasDraft = Boolean(state.essay.text || state.essay.problem || state.essay.thesis);
    return shell(`${pageHead("Seu projeto de redação", "Uma decisão de cada vez.", "O banco completo permanece por trás da experiência; a tela mostra apenas a etapa que importa agora.")}<section class="card"><div class="kicker muted">${hasDraft ? "Projeto em andamento" : "Recorte recomendado"}</div><h2 class="essay-title space-sm">${esc(state.essay.theme || pack?.theme || "Escolha um recorte autoral")}</h2><p class="muted small space-sm">${hasDraft ? "Seu trabalho foi preservado. Continue exatamente da etapa em que parou." : `${essayPacks.length} projetos disponíveis no banco, com repertórios e orientações por competência.`}</p><div class="space">${link((hasDraft ? "Continuar meu projeto" : "Estudar este caso") + " " + icon("arrow"), "redacao/compreender", "btn")}</div></section>${row("Escolher outro recorte", "A busca só aparece quando você decide trocar o tema.", "redacao/temas", "book")}${row("Minhas avaliações", "Duas leituras independentes e nota final por competência.", "redacao/avaliacao", "chart")}<div class="quiet-help">${link(icon("chat") + "Dra. Helena Prado - Especialista em Redação", "assistente")}</div>`, "redacao");
  };

  essayThemes = function hardEssayThemes() {
    const recommended = essayPacks[(state.medicalRotation || 0) % Math.max(essayPacks.length, 1)];
    return shell(`${pageHead("Banco de recortes", "Um tema agora.<br>O banco inteiro quando precisar.", `${essayPacks.length} projetos preservados e organizados pela inteligência de Redação.`)}${recommended ? `<section class="priority"><div class="priority-top"><span class="kicker">Recorte recomendado</span><span class="pill">Projeto completo</span></div><div class="priority-content" style="grid-template-columns:1fr"><div><h2>${esc(recommended.theme)}</h2><p>A recomendação muda com o ciclo para evitar repertórios e projetos sempre iguais.</p></div></div><div class="priority-cta">${btn("Trabalhar este recorte " + icon("arrow"), "hard-theme", "btn goldbtn", `data-pack="${esc(recommended.id)}"`)}</div></section>` : ""}<details class="library-row space"><summary>Procurar outro recorte ${icon("chevron")}</summary><label class="field space-sm">Buscar no banco<input id="essay-hard-search" type="search" placeholder="Digite um tema, grupo ou problema social"></label><div class="essay-bank-results" id="essay-hard-results">${essaySearchResults("")}</div></details>`, "redacao");
  };

  function assetHref(path) {
    const normalized = String(path || "").replace(/^\.\//, "/");
    return new URL(normalized, window.location.origin).href;
  }

  function correctionProcessMarkup(process) {
    if (!process || !Array.isArray(process.evaluators)) return "";
    const resolutionCopy = process.resolution === "review_board"
      ? { title: "Junta médica de Redação concluída", text: "A discrepância permaneceu após a terceira leitura. A Junta Médica CAVMED releu o caso e definiu o parecer final." }
      : process.resolution === "third_evaluator_closest_pair"
        ? { title: "Terceira banca concluída", text: `O protocolo chamou automaticamente o 3º médico corretor. A nota final usa os pareceres ${process.selectedEvaluators?.join(" e ") || "mais próximos"}, o par concordante mais próximo.` }
        : { title: "Alta após dupla leitura", text: "O 1º e o 2º médico corretor ficaram dentro dos limites oficiais de concordância, e os dois pareceres foram consolidados pela média." };
    const statusLabels = {
      valid: "Texto válido",
      blank: "Em branco",
      insufficient_text: "Texto insuficiente",
      theme_escape: "Fuga ao tema",
      wrong_text_type: "Tipo textual inadequado",
      annulled: "Anulado",
      unreadable: "Ilegível",
      foreign_language: "Língua estrangeira",
    };
    const evaluatorLabel = (id) => {
      if (id === "Banca") return "Junta médica final";
      if (id === "1") return "1º médico corretor";
      if (id === "2") return "2º médico corretor";
      if (id === "3") return "3º médico corretor";
      return `Médico corretor ${esc(id)}`;
    };
    const evaluatorCards = process.evaluators.map((evaluator) => `<article class="reader-card"><div class="between"><div><small>${evaluatorLabel(evaluator.id)}</small><strong>${Number(evaluator.total) || 0}</strong></div><span class="pill">${esc(statusLabels[evaluator.resultStatus] || "Leitura concluída")}</span></div><div class="reader-scores">${(evaluator.competencies || []).map((item) => `<span><small>${esc(item.code)}</small><strong>${Number(item.score) || 0}</strong></span>`).join("")}</div></article>`).join("");
    const discrepancy = process.discrepancy?.detected
      ? `<div class="callout process-alert"><strong>Interconsulta acionada automaticamente.</strong><br>${esc((process.discrepancy.reasons || []).join(" ") || "A primeira dupla apresentou discrepância.")} Os médicos da terceira banca trabalharam no caso sem exigir uma nova solicitação do aluno.</div>`
      : `<p class="note">Não houve discrepância: a diferença total não ultrapassou 100 pontos, nenhuma competência ultrapassou 80 pontos de diferença e não houve divergência de situação.</p>`;
    return `<details class="library-row correction-process space" ${process.discrepancy?.detected ? "open" : ""}><summary>Prontuário da dupla correção ${icon("chevron")}</summary><div class="process-intro"><span class="process-icon">${icon(process.discrepancy?.detected ? "book" : "check")}</span><div><h3>${resolutionCopy.title}</h3><p>${resolutionCopy.text}</p></div></div>${discrepancy}<div class="reader-grid">${evaluatorCards}</div><p class="note"><strong>Regra ENEM 2026:</strong> cada médico corretor usa apenas 0, 40, 80, 120, 160 ou 200 por competência. A média das duas leituras selecionadas pode gerar uma nota final em intervalos de 20 pontos.</p></details>`;
  }

  function dualReviewWaitingMarkup() {
    return `<div class="callout green correction-waiting"><strong>O corpo clínico de Redação já iniciou o atendimento.</strong><br>As duas leituras são independentes e automáticas. Você não precisa chamar o segundo corretor.</div><div class="correction-route" aria-label="Etapas automáticas da correção"><div class="active"><span>1</span><div><strong>1º médico corretor</strong><small>Leitura independente em andamento</small></div></div><div class="active"><span>2</span><div><strong>2º médico corretor</strong><small>Leitura independente em andamento</small></div></div><div><span>3</span><div><strong>Terceira banca</strong><small>Entra automaticamente somente se houver discrepância oficial</small></div></div></div><p class="note">Se a terceira leitura ainda não resolver a divergência, a Junta Médica CAVMED assume o caso antes da liberação da nota.</p>`;
  }

  function reviewResult(review) {
    const competencies = Array.isArray(review?.competencies) ? review.competencies : [];
    const diagnosis = review?.overallDiagnosis || {};
    const paragraphFeedback = Array.isArray(review?.paragraphFeedback) ? review.paragraphFeedback : [];
    const projectAlignment = Array.isArray(review?.projectAlignment) ? review.projectAlignment : [];
    const rewritePlan = Array.isArray(review?.rewritePlan) ? review.rewritePlan : [];
    const priorityIndex = competencies.reduce((lowest, item, index, items) => (
      Number(item.score) < Number(items[lowest]?.score ?? Infinity) ? index : lowest
    ), 0);
    const competencyMarkup = competencies.map((item, index) => `<details class="library-row competency-review" ${index === priorityIndex ? "open" : ""}><summary><span><span class="kicker">C${index + 1} · ${index === priorityIndex ? "prioridade de reescrita" : "parecer completo"}</span><strong>${esc(item.title || `Competência ${index + 1}`)}</strong></span><span class="competency-summary-score">${Number(item.score) || 0}<small>/ 200</small></span>${icon("chevron")}</summary><div class="competency-review-body"><p class="review-analysis">${esc(item.analysis || "Análise não informada.")}</p><div class="review-two-columns"><section><span class="feedback-label positive">O que preservar</span><p>${esc(item.strength || "O parecer não registrou um ponto forte específico.")}</p></section><section><span class="feedback-label attention">O que limitou a nota</span><p>${esc(item.limitation || item.nextStep || "A competência ainda exige consolidação.")}</p></section></div>${item.evidence ? `<blockquote class="review-evidence"><span>Evidência observada</span>${esc(item.evidence)}</blockquote>` : ""}<div class="descriptor-reading"><div><span>Por que esta nota</span><p>${esc(item.descriptorMatch || item.analysis || "Consulte a análise da competência.")}</p></div><div><span>Por que ainda não subiu</span><p>${esc(item.whyNotHigher || "A banca não registrou comparação com o nível seguinte.")}</p></div></div><section class="rewrite-prescription"><span class="feedback-label">Conduta de reescrita</span><p>${esc(item.nextStep || "Reescreva o trecho indicado com mais precisão.")}</p>${item.rewriteExample ? `<div><small>Exemplo orientado</small><p>${esc(item.rewriteExample)}</p></div>` : ""}</section></div></details>`).join("");
    const diagnosisMarkup = Object.values(diagnosis).some(Boolean) ? `<section class="review-overview space"><div class="kicker">Leitura clínica do texto</div><div class="review-overview-grid"><div><span>Ponto mais forte</span><p>${esc(diagnosis.strongestPoint || "Ainda não informado.")}</p></div><div><span>Prioridade</span><p>${esc(diagnosis.priority || "Reescreva a competência de menor nota.")}</p></div><div><span>Texto x projeto</span><p>${esc(diagnosis.projectReading || "A aderência ao projeto ainda não foi registrada.")}</p></div><div><span>Potencial de evolução</span><p>${esc(diagnosis.progressionPotential || "A reescrita orientada permitirá medir a evolução.")}</p></div></div></section>` : "";
    const paragraphMarkup = paragraphFeedback.length ? `<details class="library-row rich-review-section space"><summary>Leitura por parágrafo ${icon("chevron")}</summary><div class="paragraph-review-list">${paragraphFeedback.map((item) => `<article><div><strong>${esc(item.section)}</strong><span>${esc(item.status)}</span></div><p>${esc(item.diagnosis)}</p><small><strong>Foco da reescrita:</strong> ${esc(item.rewriteFocus)}</small></article>`).join("")}</div></details>` : "";
    const alignmentMarkup = projectAlignment.length ? `<details class="library-row rich-review-section space"><summary>Aderência ao projeto de texto ${icon("chevron")}</summary><div class="project-alignment-list">${projectAlignment.map((item) => `<div><strong>${esc(item.element)}</strong><span>${esc(item.status)}</span><p>${esc(item.evidence)}</p></div>`).join("")}</div></details>` : "";
    const planMarkup = rewritePlan.length ? `<section class="rewrite-plan space"><div><span class="kicker">Prescrição para a segunda versão</span><h2>Uma mudança de cada vez.</h2></div><ol>${rewritePlan.map((item) => `<li><span>${icon("check")}</span><p>${esc(item)}</p></li>`).join("")}</ol></section>` : "";
    return `<div class="cumulative-strip"><div><small>Nota global</small><strong>${Number(review.total) || 0}</strong><small>/ 1000 pontos</small></div><div><small>Leitura da banca</small><strong>${esc(review.band || "Correção concluída")}</strong><small>Baseada no texto enviado</small></div><div><small>Próxima conduta</small><strong>C${priorityIndex + 1}</strong><small>Comece pela competência prioritária</small></div></div><div class="summary-row"><div class="kicker">Síntese do especialista</div><p>${esc(review.summary || "Revise os apontamentos por competência antes da reescrita.")}</p></div>${diagnosisMarkup}${correctionProcessMarkup(review.correctionProcess)}<section class="review-competencies space"><div class="section-intro"><span class="kicker">Parecer por competência</span><h2>A nota vem acompanhada do caminho.</h2><p>Abra cada competência para ver evidência, descritor e exemplo de reescrita. A prioridade já está aberta.</p></div><div class="stack space-sm">${competencyMarkup}</div></section>${paragraphMarkup}${alignmentMarkup}${planMarkup}`;
  }

  function essayProjectSummary() {
    const essay = state.essay;
    return `<div class="project-summary"><div><small>Problema</small><p>${esc(essay.problem || "Ainda não registrado.")}</p></div><div><small>Tese</small><p>${esc(essay.thesis || "Ainda não registrada.")}</p></div><div><small>Eixo 1</small><p>${esc(essay.a1 || "Ainda não registrado.")}</p></div><div><small>Eixo 2</small><p>${esc(essay.a2 || "Ainda não registrado.")}</p></div><div><small>Repertório</small><p>${esc(essay.repertory || "Ainda não registrado.")}</p></div></div>`;
  }

  function manuscriptPreview() {
    const essay = state.essay;
    if (essay.inputMode !== "upload") return `<div class="readonly essay-readonly">${esc(essay.text || "Seu texto ainda está vazio.")}</div>`;
    if (!manuscriptFile) return `<div class="empty"><h2>Selecione novamente o manuscrito.</h2><p>Por segurança, o arquivo não permanece carregado depois que a página é fechada. O nome preservado é ${esc(essay.manuscriptFileName || "o do último arquivo selecionado")}.</p>${link("Voltar ao envio", "redacao/escrever", "btn")}</div>`;
    if (!manuscriptObjectUrl) manuscriptObjectUrl = URL.createObjectURL(manuscriptFile);
    return manuscriptFile.type === "application/pdf"
      ? `<iframe class="pdf-frame" title="Redação manuscrita" src="${esc(manuscriptObjectUrl)}#view=FitH"></iframe>`
      : `<img class="manuscript-image" src="${esc(manuscriptObjectUrl)}" alt="Redação manuscrita enviada pelo aluno">`;
  }

  function matrixField(label, value = "") {
    return `<section class="matrix-field"><h3>${esc(label)}</h3><div class="matrix-answer">${value ? esc(value) : ""}</div></section>`;
  }

  essayAssessment = function hardEssayAssessment() {
    const essay = state.essay;
    const hasText = wordCount(essay.text) >= 80;
    const hasManuscript = essay.inputMode === "upload" && Boolean(manuscriptFile);
    const hasSubmission = hasText || hasManuscript;
    const specialist = specialistFor("redacao correcao competencias c1 c2 c3 c4 c5");
    const labels = ["Norma-padrão", "Tema e repertório", "Projeto argumentativo", "Coesão", "Proposta de intervenção"];
    const manualScores = Array.isArray(essay.scores) ? essay.scores : [null, null, null, null, null];
    const manualTotal = manualScores.every((value) => Number.isFinite(value))
      ? manualScores.reduce((sum, value) => sum + value, 0)
      : null;
    const status = essay.reviewStatus;
    const statusMessage = status === "loading"
      ? dualReviewWaitingMarkup()
      : status === "unavailable"
        ? `<div class="callout error"><strong>A leitura não foi concluída agora.</strong><br>${esc(essay.reviewMessage || "Seu texto foi preservado e nenhuma nota foi criada como substituta.")}</div>`
        : "";
    const primary = essay.aiReview
      ? `${reviewResult(essay.aiReview)}<div class="compare-actions space">${btn("Comparar texto e projeto " + icon("arrow"), "open-compare-tabs", "btn outline")}${link("Ver lado a lado nesta tela", "redacao/comparar", "textbtn under")}</div>`
      : `${statusMessage}<section class="card specialist-card"><div><div class="kicker muted">Coordenação do prontuário</div><h2 class="space-sm">${esc(specialist.name)}</h2><p><strong>${esc(specialist.residency)}</strong><br>${esc(specialist.focus)}</p></div><div><div class="kicker muted">Dupla correção automática</div><h2 class="space-sm">Nenhuma nota foi atribuída.</h2><p>${hasSubmission ? "Seu texto está pronto para duas leituras independentes. Se houver discrepância oficial, a terceira banca entra sem um novo pedido." : essay.inputMode === "upload" ? "Envie o PDF ou a foto do manuscrito antes de iniciar a dupla leitura." : "Escreva ao menos 80 palavras antes de iniciar a dupla leitura."}</p><div class="space-sm">${btn(status === "loading" ? "Corpo clínico em atendimento…" : "Enviar ao corpo clínico de Redação " + icon("arrow"), "essay-review-ai", "btn", status === "loading" || !hasSubmission ? "disabled" : "")}</div></div></section>`;
    const manual = `<details class="library-row space"><summary>Registrar uma correção recebida fora do nosso hospital ${icon("chevron")}</summary><p>Use somente quando um professor ou outra banca já tiver informado a <strong>nota final consolidada</strong>. Ela pode variar de 20 em 20 pela média dos avaliadores; a nota bruta de um único avaliador varia de 40 em 40.</p><form id="manual-assessment-form">${labels.map((label, index) => `<div class="rubric-row"><strong>C${index + 1}</strong><label for="manual-score-${index}">${label}</label><select id="manual-score-${index}" data-manual-score="${index}" required><option value="">Selecione</option>${Array.from({ length: 11 }, (_, value) => value * 20).map((scoreValue) => `<option value="${scoreValue}" ${manualScores[index] === scoreValue && essay.evaluationSource === "manual" ? "selected" : ""}>${scoreValue}</option>`).join("")}</select></div>`).join("")}<div class="rubric-score" id="manual-rubric-total">${manualTotal === null || essay.evaluationSource !== "manual" ? "—" : manualTotal} <span class="small muted">/ 1000</span></div><button type="submit" class="btn">Salvar correção recebida ${icon("check")}</button></form></details>`;
    return shell(`${pageHead("Correção da Redação", "A nota só aparece<br>depois da leitura.", "O checklist anterior foi sua revisão pessoal. Esta é a etapa de avaliação por competência.")}${primary}${manual}<div class="space-sm">${link("Voltar ao texto", "redacao/escrever", "textbtn under")}</div>`, "redacao");
  };

  essayStep = function hardEssayStep(step) {
    const pack = selectedEssayPack();
    const essay = state.essay;
    if (step === "matriz") {
      return shell(`${pageHead("Folha matriz", "Seu projeto no papel.<br>Uma decisão por campo.", esc(essay.theme))}<article class="matrix-sheet"><header><span>UltimateENEM · REDAÇÃO</span><strong>CAVPRIME</strong></header><h2>${esc(essay.theme)}</h2>${matrixField("1. Qual é o problema específico?", essay.problem)}${matrixField("2. Quem é diretamente afetado?", essay.affected)}${matrixField("3. Por que o problema persiste?", essay.causes)}${matrixField("4. Tese", essay.thesis)}<div class="matrix-columns">${matrixField("5. Primeiro eixo", essay.a1)}${matrixField("6. Segundo eixo", essay.a2)}</div>${matrixField("7. Repertório produtivo", essay.repertory)}${matrixField("8. Proposta de intervenção", essay.intervention)}<footer>GOOD PREPARATION SAVES LIVES</footer></article><div class="matrix-actions space">${btn("Imprimir folha matriz", "print-matrix", "btn")}${link("Voltar ao estudo do caso", "redacao/compreender", "btn outline")}</div>`, "redacao");
    }
    if (step === "material") {
      const pdfUrl = pack?.sourcePdf ? assetHref(pack.sourcePdf) : "";
      return shell(`${pageHead("Material essencial", "A fonte certa.<br>Somente quando precisar.", esc(essay.theme))}${pdfUrl ? `<div class="pdf-shell"><iframe class="pdf-frame" title="Material essencial de apoio à Redação" src="${esc(pdfUrl)}#view=FitH"></iframe></div>` : `<div class="empty"><h2>Material indisponível.</h2><p>Este recorte ainda não possui PDF vinculado.</p></div>`}<div class="space-sm">${link(icon("back") + " Voltar à revisão", "redacao/revisar", "btn outline")}</div>`, "redacao");
    }
    if (step === "texto") {
      return shell(`${pageHead("Meu texto", "Leia como se fosse<br>o primeiro contato.", esc(essay.theme))}${essayProjectSummary()}<div class="space">${manuscriptPreview()}</div><div class="space-sm">${link(icon("back") + " Voltar à revisão", "redacao/revisar", "btn outline")}</div>`, "redacao");
    }
    if (step === "comparar") {
      const pdfUrl = pack?.sourcePdf ? assetHref(pack.sourcePdf) : "";
      return shell(`${pageHead("Comparação clínica", "Texto e projeto.<br>Sem perder o contexto.", esc(essay.theme))}<div class="callout">Se o navegador bloquear as duas abas, esta visão mantém o texto e o material juntos para a sua conferência.</div><div class="compare-grid space"><section><div class="kicker muted">Seu texto</div><div class="compare-pane">${manuscriptPreview()}</div></section><section><div class="kicker muted">Projeto em PDF</div><div class="compare-pane">${pdfUrl ? `<iframe class="pdf-frame" title="Projeto de Redação em PDF" src="${esc(pdfUrl)}#view=FitH"></iframe>` : `<div class="empty"><p>Este recorte ainda não possui PDF vinculado.</p></div>`}</div></section></div><div class="space-sm">${link(icon("back") + " Voltar à revisão", "redacao/revisar", "btn outline")}</div>`, "redacao");
    }
    const stages = ["compreender", "planejar", "escrever", "revisar"];
    const stageIndex = Math.max(0, stages.indexOf(step));
    const box = pack?.competencyBoxes?.[Math.min(stageIndex + 1, 4)];
    let body = "";
    if (step === "compreender") body = `${pageHead("01 · Estudo do caso clínico", "Antes de escrever,<br>compreenda o paciente.", esc(essay.theme))}<section class="matrix-invitation"><div><div class="kicker muted">Antes de responder</div><h2>Imprima a folha matriz para montar seu projeto.</h2><p>Ela organiza o raciocínio no papel e acompanha todas as etapas desta Redação.</p></div>${link("Abrir folha matriz " + icon("arrow"), "redacao/matriz", "btn outline")}</section><div class="callout space-sm"><strong>Se optar por digitar, não perca o foco.</strong><br>Lembre-se: médicos trabalham o tempo todo com o motor do carro ligado.</div><div class="stack space"><label class="field">Qual é o problema específico?<textarea data-essay="problem" placeholder="Delimite o problema sem generalizar.">${esc(essay.problem)}</textarea></label><label class="field">Quem é diretamente afetado?<textarea data-essay="affected" placeholder="Identifique o grupo e o direito envolvido.">${esc(essay.affected || "")}</textarea></label><label class="field">Por que esse problema persiste?<textarea data-essay="causes" placeholder="Nomeie mecanismos, não apenas consequências.">${esc(essay.causes || "")}</textarea></label></div>${box ? `<details class="library-row space-sm"><summary>Validar com o especialista ${icon("chevron")}</summary><p><strong>${esc(box.title)}</strong></p><p>${esc(box.text)}</p></details>` : ""}<div class="space">${link("Montar meu projeto de texto " + icon("arrow"), "redacao/planejar", "btn")}</div>`;
    else if (step === "planejar") body = `${pageHead("02 · Projeto de texto", "Uma tese.<br>Dois eixos de defesa.", esc(essay.theme))}<div class="stack"><label class="field">Tese<textarea data-essay="thesis" placeholder="Qual posição será defendida?">${esc(essay.thesis)}</textarea></label><label class="field">Primeiro eixo<textarea data-essay="a1" placeholder="Causa, mecanismo ou falha estrutural.">${esc(essay.a1)}</textarea></label><label class="field">Segundo eixo<textarea data-essay="a2" placeholder="Consequência, omissão ou aprofundamento.">${esc(essay.a2)}</textarea></label><label class="field">Repertório produtivo<textarea data-essay="repertory" placeholder="Qual evidência realmente prova seu argumento?">${esc(essay.repertory)}</textarea></label></div>${box ? `<details class="library-row space-sm"><summary>Consultar um remédio que cura ${icon("chevron")}</summary><p><strong>${esc(box.title)}</strong></p><p>${esc(box.text)}</p><p class="note">${esc(box.note || "Use o repertório apenas se ele provar o argumento.")}</p></details>` : ""}<div class="space">${link("Escrever meu rascunho " + icon("arrow"), "redacao/escrever", "btn")}</div>`;
    else if (step === "escrever") {
      const typing = essay.inputMode !== "upload";
      const fileReady = Boolean(manuscriptFile);
      body = `${pageHead("03 · Rascunho", "Agora, escreva<br>com o projeto ao lado.", esc(essay.theme))}<div class="callout"><strong>Tese:</strong> ${esc(essay.thesis || "ainda não registrada")}<br><strong>Eixos:</strong> ${esc(essay.a1 || "—")} · ${esc(essay.a2 || "—")}</div><div class="input-mode-tabs space" role="tablist" aria-label="Forma de envio da Redação">${btn("Digitar no app", "essay-input-mode", `chip ${typing ? "selected" : ""}`, `data-mode="type" role="tab" aria-selected="${typing}"`)}${btn("Enviar PDF ou foto", "essay-input-mode", `chip ${!typing ? "selected" : ""}`, `data-mode="upload" role="tab" aria-selected="${!typing}"`)}</div>${typing ? `<label class="field space-sm"><span>Seu texto</span><textarea class="editor" data-essay="text" placeholder="Escreva sua redação completa…">${esc(essay.text)}</textarea></label><div class="editor-foot"><span id="word-count">${wordCount(essay.text)} palavras</span><span>Rascunho salvo neste navegador</span></div>` : `<label class="upload-zone space-sm ${fileReady ? "has-file" : ""}" id="essay-upload-zone"><span>${icon("book")}<strong>${fileReady ? esc(manuscriptFile.name) : "Selecionar PDF ou foto da Redação"}</strong><small>${fileReady ? "Manuscrito pronto para a visita do especialista" : "PDF, JPG, PNG ou WEBP · até 4 MB"}</small></span><input id="essay-manuscript" type="file" accept="application/pdf,image/jpeg,image/png,image/webp"></label><p class="note">O arquivo fica disponível somente durante esta sessão. Nenhuma nota aparece antes da leitura do especialista.</p>`}<div class="space">${link("Fazer minha revisão " + icon("arrow"), "redacao/revisar", "btn")}</div>`;
    }
    else {
      const checked = [0, 1, 2, 3, 4].filter((index) => essay[`check${index}`]).length;
      const pdfLink = pack?.sourcePdf
        ? link(`<span><strong>Abrir o material essencial</strong><small style="display:block;margin-top:5px;color:var(--muted)">PDF de apoio · abre dentro do app.</small></span>${icon("arrow")}`, "redacao/material", "report-link")
        : "";
      const revisionTitle = dischargePhrases[essay.dischargePhraseIndex % dischargePhrases.length];
      body = `${pageHead("04 · Alta textual", esc(revisionTitle), esc(essay.theme))}<div class="callout"><strong>Esta ainda não é a correção do especialista.</strong><br>Marque cada item somente depois de conferir o próprio texto. A nota será atribuída na próxima etapa.</div><div class="stack">${["Introdução com repertório, tese e dois eixos claros.", "Desenvolvimentos com tópico frasal, causa, consequência e prova.", "Conectivos variados, sem repetição mecânica.", "Intervenção com agente, ação, modo, finalidade e detalhamento.", "C1 revisada: concordância, crase, pontuação, registro e vocabulário."].map((label, index) => `<label class="checkline"><input type="checkbox" data-check="${index}" ${essay[`check${index}`] ? "checked" : ""}>${label}</label>`).join("")}</div><p class="note">${checked}/5 itens conferidos por você. Marcar um item não significa que o especialista o considerará atendido.</p>${pdfLink}<div class="compare-actions space-sm">${btn("Comparar texto e projeto " + icon("arrow"), "open-compare-tabs", "btn outline")}${link("Ver lado a lado nesta tela", "redacao/comparar", "textbtn under")}</div><div class="space">${link("Enviar para correção " + icon("arrow"), "redacao/avaliacao", "btn")}</div>`;
    }
    return shell(`<div class="stepper">${stages.map((_, index) => `<span class="${index < stageIndex ? "done" : index === stageIndex ? "active" : ""}"></span>`).join("")}</div>${body}`, "redacao");
  };

  async function requestEssayReview() {
    const essay = state.essay;
    const hasTypedText = wordCount(essay.text) >= 80;
    const hasManuscript = essay.inputMode === "upload" && Boolean(manuscriptFile);
    if ((!hasTypedText && !hasManuscript) || essay.reviewStatus === "loading") return;
    essay.reviewStatus = "loading";
    essay.reviewMessage = "";
    essay.aiReview = null;
    essay.recorded = false;
    essay.evaluationSource = "";
    essay.scores = [null, null, null, null, null];
    originalSave();
    render(false);
    try {
      let manuscript = null;
      if (hasManuscript) {
        if (manuscriptFile.size > 4 * 1024 * 1024) throw new Error("manuscript_too_large");
        manuscript = {
          fileName: manuscriptFile.name,
          mimeType: manuscriptFile.type,
          dataUrl: await readFileAsDataUrl(manuscriptFile),
        };
      }
      const response = await fetch("/api/cavprime-redacao-review-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: essay.theme,
          essay: hasTypedText ? essay.text : "",
          manuscript,
          project: {
            problem: essay.problem,
            affected: essay.affected || "",
            causes: essay.causes || "",
            thesis: essay.thesis,
            axis1: essay.a1,
            axis2: essay.a2,
            repertory: essay.repertory,
          },
        }),
        signal: AbortSignal.timeout(180000),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.review || !Array.isArray(payload.review.competencies)) {
        const requestError = new Error(payload.message || "review_unavailable");
        requestError.code = payload.error || "review_unavailable";
        requestError.status = response.status;
        throw requestError;
      }
      const scores = payload.review.competencies.map((item) => Number(item.score));
      if (scores.length !== 5 || scores.some((scoreValue) => !Number.isFinite(scoreValue))) throw new Error("invalid_review");
      essay.aiReview = payload.review;
      essay.scores = scores;
      essay.recorded = true;
      essay.evaluationSource = "ai";
      essay.reviewStatus = "complete";
      essay.reviewMessage = "";
    } catch (error) {
      essay.reviewStatus = "unavailable";
      const query = new URLSearchParams(location.search);
      const auditMode = query.get("auditReview") === "1" || query.get("diagnostics") === "1";
      if (error?.message === "manuscript_too_large") {
        essay.reviewMessage = "O arquivo ultrapassa 4 MB. Envie uma versão mais leve para continuar.";
      } else if (error?.code === "review_not_configured" && auditMode) {
        essay.reviewMessage = "Diagnóstico da auditoria: o servidor local está sem a credencial da banca inteligente. O texto foi preservado e nenhuma pontuação foi criada como substituta.";
      } else {
        essay.reviewMessage = "Os médicos plantonistas não conseguiram concluir a leitura agora. Seu texto foi preservado e nenhuma pontuação foi criada como substituta.";
      }
    }
    originalSave();
    render(false);
  }

  assistant = function hardAssistant() {
    const specialist = currentSpecialist();
    const messages = state.hardAssistantMessages.length ? state.hardAssistantMessages : [{ role: "assistant", text: "Estou acompanhando seu contexto. Posso indicar o próximo passo, explicar um erro ou ajudar a organizar sua Redação sem entregar um texto pronto." }];
    return shell(`${pageHead("Orientação contextual", medicalCall().replace(" ", "<br>"), "Sua pergunta é encaminhada ao plantão mais adequado para a etapa atual.")}<a class="specialist-link" href="#assistant-form"><span class="specialist-monogram">${esc(specialist.name.split(" ").slice(-1)[0].slice(0, 1))}</span><span><small>Especialista de plantão</small><strong>${esc(specialist.name)}</strong><em>${esc(specialist.residency)}</em></span>${icon("chevron")}</a>${state.assistantWaiting ? `<div class="callout green space-sm"><strong>Os médicos plantonistas estão trabalhando arduamente para lhe entregar os melhores resultados.</strong></div>` : ""}<div class="space">${messages.map((message) => `<div class="message ${message.role === "user" ? "user" : ""}">${message.role !== "user" && message.specialist ? `<small class="message-specialist">${esc(message.specialist)}</small>` : ""}${esc(message.text)}</div>`).join("")}</div><div class="chat-suggestions">${["Qual é meu próximo passo?", "O que devo revisar agora?", "Como organizar minha redação?"].map((text) => btn(text, "chat-suggestion", "chip", `data-value="${esc(text)}"`)).join("")}</div><form class="chat-form" id="assistant-form"><input id="assistant-input" aria-label="Sua dúvida" placeholder="Pergunte sem sair da sua jornada" maxlength="900" required><button type="submit" class="btn" aria-label="Enviar">${icon("arrow")}</button></form>`, "");
  };

  function localAssistantReply(message) {
    const normalized = message.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if (normalized.includes("redacao") || location.hash.includes("redacao")) return `Seu projeto está na etapa atual do recorte “${state.essay.theme}”. Responda somente ao campo visível; o próximo passo será liberado sem expor toda a estrutura de correção.`;
    if (normalized.includes("erro") || wrongEntries().length) return `Seu prontuário possui ${wrongEntries().length} questão(ões). Registre o motivo do erro antes de refazer: essa evidência melhora a próxima prescrição e o relatório.`;
    if (normalized.includes("lista") || normalized.includes("arquivo")) return "Use “Trazer uma lista externa”. Nossa equipe lê os itens, classifica competência, habilidade, macrotema e microtema, e abre a correção assim que a última resposta é registrada.";
    const pending = nextArea();
    return pending ? `Seu próximo passo é concluir a lista de ${areas[pending].short}. Somente as questões erradas seguirão para o prontuário.` : "As quatro áreas foram concluídas. O próximo passo recomendado é avançar no projeto de Redação e consolidar os erros pendentes.";
  }

  assistantSend = async function hardAssistantSend(rawMessage) {
    const message = String(rawMessage || "").trim();
    if (!message) return;
    const specialist = currentSpecialist(message);
    state.assistantSpecialistId = specialist.id;
    state.assistantWaiting = true;
    state.hardAssistantMessages.push({ role: "user", text: message });
    state.hardAssistantMessages = state.hardAssistantMessages.slice(-20);
    originalSave();
    render(false);
    let answer = "";
    try {
      const response = await fetch("/api/cavprime-assistant-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          context: {
            course: products[currentProduct]?.name || "UltimateENEM",
            view: location.hash.replace("#/", ""),
            specialist: `${specialist.name} · ${specialist.residency}`,
            specialistFocus: specialist.focus,
            patent: patent().name,
            completedLists: completedAreaCount() + state.externalLists.filter((list) => list.completed).length,
            accuracy: cumulativeStats().percent.toFixed(2),
            wrongItems: wrongEntries().length,
            essayStep: location.hash.includes("redacao") ? location.hash.split("/").pop() : "",
            activeArea: areas[state.hardArea].name,
          },
        }),
        signal: AbortSignal.timeout(18000),
      });
      const payload = await response.json();
      if (!response.ok || !payload.answer) throw new Error("assistant_unavailable");
      answer = payload.answer;
      state.assistantMode = "online";
    } catch (_) {
      answer = localAssistantReply(message);
      state.assistantMode = "local";
    }
    state.assistantWaiting = false;
    state.hardAssistantMessages.push({ role: "assistant", text: answer, specialist: `${specialist.name} · ${specialist.residency}` });
    state.hardAssistantMessages = state.hardAssistantMessages.slice(-20);
    originalSave();
    render(false);
  };

  function classifyQuestion(text, index) {
    const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if (/texto|linguagem|poema|narrador|leitura/.test(normalized)) return { areaId: "linguagens", competencyCode: "C6", skillCode: "H18", macrotheme: "Leitura e linguagem", microtheme: "Progressão e efeito de sentido" };
    if (/historia|sociedade|geografia|estado|cultura/.test(normalized)) return { areaId: "humanas", competencyCode: "CH:C3", skillCode: "H15", macrotheme: "Sociedade e território", microtheme: "Relações sociais e históricas" };
    if (/celula|energia|quimic|fisic|organismo|agua/.test(normalized)) return { areaId: "natureza", competencyCode: "CN:C4", skillCode: "H14", macrotheme: "Sistemas naturais", microtheme: "Relações físico-químicas e biológicas" };
    return { areaId: "matematica", competencyCode: "MT:C3", skillCode: "H12", macrotheme: "Raciocínio quantitativo", microtheme: `Resolução de problema ${index + 1}` };
  }

  function parseAnswerKey(value = "") {
    return (value.toUpperCase().match(/[A-E]/g) || []).map((letter) => "ABCDE".indexOf(letter));
  }

  function parseExternalText(text, answerKey) {
    const keys = parseAnswerKey(answerKey);
    const blocks = text.trim().split(/\n(?=\s*(?:QUEST[AÃ]O\s*)?\d+[.)-])/i).filter(Boolean);
    const parsed = blocks.map((block, index) => {
      const lines = block.split(/\n/).map((line) => line.trim()).filter(Boolean);
      const options = [];
      const stem = [];
      lines.forEach((line) => {
        const match = line.match(/^([A-E])[).:\-]\s*(.+)$/i);
        if (match) options["ABCDE".indexOf(match[1].toUpperCase())] = match[2];
        else stem.push(line.replace(/^\s*(?:QUEST[AÃ]O\s*)?\d+[.)-]?\s*/i, ""));
      });
      if (options.filter(Boolean).length < 2) return null;
      const classification = classifyQuestion(stem.join(" "), index);
      return {
        id: `external-${Date.now()}-${index}`,
        title: `Questão externa ${index + 1}`,
        text: stem.join(" "),
        opts: Array.from({ length: Math.max(5, options.length) }, (_, optionIndex) => options[optionIndex] || `Alternativa ${"ABCDE"[optionIndex]}`),
        correct: Number.isInteger(keys[index]) ? keys[index] : 0,
        explain: "Nossos médicos orientadores produzem o comentário a partir do enunciado, do gabarito e da habilidade classificada.",
        skill: classification.microtheme,
        ...classification,
      };
    }).filter(Boolean);
    return parsed;
  }

  function sampleExternalQuestions() {
    return sourceQuestions.slice(0, 4).map((question, index) => ({ ...question, id: `sample-external-${index}`, title: `Questão importada ${index + 1}` }));
  }

  function externalListHome() {
    const completed = state.externalLists.filter((list) => list.completed);
    return shell(`${pageHead("Lista externa", "Traga o material.<br>Nossa equipe organiza o restante.", "PDF, imagem ou texto: nossa equipe organiza cada item antes de você começar.")}<form id="external-import-form"><label class="upload-zone ${state.externalDraft.fileName ? "has-file" : ""}" id="external-upload-zone"><input id="external-file" type="file" accept="application/pdf,image/png,image/jpeg,image/webp"><span><strong>${state.externalDraft.fileName ? esc(state.externalDraft.fileName) : "Selecionar PDF ou imagem"}</strong><small>${state.externalDraft.fileName ? "Arquivo pronto para leitura" : "Toque aqui ou arraste o arquivo da lista"}</small></span></label><div class="fields space-sm"><label class="field">Nome da lista<input id="external-name" value="${esc(state.externalDraft.name || "Lista extra de revisão")}" maxlength="90" required></label><label class="field">Gabarito, se estiver separado<input id="external-key" placeholder="Ex.: A C D B E"></label></div><details class="library-row space-sm"><summary>Ou colar o texto das questões ${icon("chevron")}</summary><label class="field space-sm">Texto da lista<textarea id="external-text" rows="8" placeholder="Questão 1...\nA) ...\nB) ..."></textarea></label></details><div class="space">${btn("Ler e classificar " + icon("arrow"), "external-import", "btn", "type=submit")}</div></form>${completed.length ? `<section class="space"><h2>Listas acumuladas</h2>${completed.map((list) => `<div class="correction-row"><span class="answer-mark correct">✓</span><div><h3>${esc(list.name)}</h3><p>${list.questions.length} questões · ${new Date(list.completedAt).toLocaleDateString("pt-BR")}</p></div><span class="pill">${list.score}/${list.questions.length}</span></div>`).join("")}</section>` : ""}`, "");
  }

  function externalReview() {
    const draft = state.externalDraft;
    return shell(`${pageHead("Leitura concluída", "A lista já está organizada.", "Revise a classificação resumida. O aluno não precisa preencher competência ou habilidade manualmente.")}<div class="engine-caption">${draft.questions.length} questões classificadas · competência · habilidade · macrotema · microtema</div><div class="space">${draft.questions.map((question, index) => `<div class="classification-line"><strong>${index + 1}. ${esc(question.title)}</strong><span>${esc(question.competencyCode)}</span><span>${esc(question.skillCode)}</span><span>${esc(question.microtheme)}</span></div>`).join("")}</div><div class="space">${btn("Começar a responder " + icon("arrow"), "external-start", "btn")}</div>`, "");
  }

  function externalQuestion() {
    const draft = state.externalDraft;
    const questionItem = draft.questions[draft.index];
    return focus(`<div class="focus-meta"><span>${esc(draft.name)}</span><span>Questão ${draft.index + 1} de ${draft.questions.length}</span></div><div class="focus-progress"><span style="width:${((draft.index + 1) / draft.questions.length) * 100}%"></span></div><div class="kicker muted">${esc(questionItem.competencyCode)} · ${esc(questionItem.skillCode)}</div><h1 class="question-title">${esc(questionItem.title)}</h1><p class="question-text">${esc(questionItem.text)}</p><div class="options" role="radiogroup">${questionItem.opts.map((option, optionIndex) => btn(`<span class="letter">${"ABCDE"[optionIndex]}</span><span>${esc(option)}</span>`, "external-answer", "option", `data-value="${optionIndex}" aria-checked="${draft.answers[draft.index] === optionIndex}"`)).join("")}</div><p class="keyboard-note">Ao registrar a última resposta, a correção e o prontuário dos erros abrem automaticamente.</p>`, "UltimateENEM", "lista-externa");
  }

  function completeExternalList() {
    const draft = state.externalDraft;
    const scoreValue = draft.questions.reduce((total, question, index) => total + (draft.answers[index] === question.correct ? 1 : 0), 0);
    const list = {
      id: `list-${Date.now()}`,
      name: draft.name,
      fileName: draft.fileName,
      questions: draft.questions,
      answers: { ...draft.answers },
      score: scoreValue,
      completed: true,
      completedAt: new Date().toISOString(),
    };
    state.externalLists.push(list);
    state.externalActiveId = list.id;
    state.externalDraft = { name: "", fileName: "", questions: [], answers: {}, index: 0, stage: "import" };
    originalSave();
  }

  function externalResult() {
    const list = state.externalLists.find((item) => item.id === state.externalActiveId) || state.externalLists.at(-1);
    if (!list) return externalListHome();
    const errors = list.questions.length - list.score;
    return focus(`<div class="result-head"><div class="score-circle">${icon(errors ? "book" : "check")}</div><div class="kicker muted">Lista externa acumulada</div><h1>${errors ? "O prontuário abriu junto com a correção." : "Lista consolidada."}</h1><div class="result-score">${list.score}<span> / ${list.questions.length} acertos</span></div><p>${errors ? "Os erros aparecem abertos, com gabarito, comentário e classificação." : "Todas as respostas foram registradas como corretas."}</p></div><div class="space">${list.questions.map((questionItem, index) => resultReviewItem(questionItem, index, `external:${list.id}`, list.answers[index])).join("")}</div><div class="space">${link("Ver evolução acumulada " + icon("arrow"), "progresso", "btn wfull")}</div>`, "UltimateENEM", "lista-externa");
  }

  resourcesModal = function hardResourcesModal() {
    if (currentProduct === "vaibem") {
      const sessions = state.vaibemLiveNotebooks?.length || 0;
      openDialog("Sua aula, sem distrações.", [
        ["Escolher professor", "Etapa escolar e disciplina da próxima conversa", "vaibem"],
        ["Meu caderno", `${sessions} ${sessions === 1 ? "aula salva" : "aulas salvas"}`, "vaibem/caderno"],
        ["O que estou aprendendo", "Evidências acumuladas e próximo passo", "vaibem/evolucao"],
      ].map(([title, subtitle, route]) => link(`<span><strong>${title}</strong><small>${subtitle}</small></span>${icon("chevron")}`, route, "resource-row")).join(""));
      return;
    }
    if (currentProduct !== "ultimate") return originalResourcesModal();
    const entries = [
      [medicalCall(), "Próximo atendimento indicado pela equipe", "assistente"],
      ["Trazer uma lista externa", "PDF, imagem ou texto com classificação automática", "lista-externa"],
      ["Farmácia ENEM", "Questões selecionadas por área e habilidade", "banco"],
      ["Prontuário dos erros", `${wrongEntries().length} erros acumulados para revisão`, "erros"],
      ["Projeto de Redação", `${essayPacks.length} recortes preservados no banco`, "redacao"],
      [workdayName(), "Simulado com a lógica integral do ENEM", "simulado"],
      ["Universidade-alvo", "Meta do ciclo e referências de ingresso", "universidade"],
      ["Prontuário médico da aprendizagem", "Desempenho, evolução e próximas condutas", "relatorio"],
      ["Atualidades", "Notícias filtradas e caderno de leitura", "atualidades"],
    ];
    if (auditModeEnabled()) {
      entries.push(
        ["AUDITORIA · Recuperação global", "Todos os cursos, áreas, exemplos e prescrições de memória", "auditoria/recuperacao"],
        ["AUDITORIA · Modelos documentais", "Documentos fictícios de todos os ambientes", "documentos"],
        ["AUDITORIA · Regras internas", "Volume, tempos e parâmetros das patentes", "patentes"],
      );
    }
    openDialog("Só o que você precisa.", entries.map(([title, subtitle, route]) => link(`<span><strong>${title}</strong><small>${subtitle}</small></span>${icon("chevron")}`, route, "resource-row")).join(""));
  };
  handlers.resources = () => resourcesModal();

  bank = function hardBank() {
    return shell(`${pageHead("Farmácia ENEM", "Encontre a habilidade.<br>Treine com precisão.", "As questões selecionadas permanecem pesquisáveis sem despejar o banco inteiro na tela.")}<label class="field">Pesquisar por área, habilidade ou competência<input id="bank-search" type="search" placeholder="H18, interpretação, energia, matemática…"></label><div id="bank-results">${bankResults("")}</div><div class="space">${link("Voltar ao próximo passo " + icon("arrow"), "hoje", "btn")}</div>`);
  };

  bankResults = function hardBankResults(query) {
    const normalized = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return sourceQuestions.filter((question) => `${question.title} ${question.text} ${question.area} ${question.skill} ${question.skillCode} ${question.competencyCode}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(normalized)).map((question) => `<div class="bank-item"><h3>${esc(question.title)}</h3><p>${esc(question.area)} · ${esc(question.competencyCode)} · ${esc(question.skillCode)}</p><span class="classified-badge">${esc(question.microtheme)}</span></div>`).join("") || `<p class="note">Nenhum item encontrado.</p>`;
  };

  function hardJourneyMap() {
    const studentRows = `${row("Hoje", "A conduta prioritária do ciclo.", "hoje", "calendar")}${row("Listas e simulados", "Questões organizadas conforme o curso e a banca.", "plantao", "book")}${row("Lista externa", "Importação, classificação, resposta e prontuário.", "lista-externa", "grid")}${row("Projeto de Redação", "Folha matriz, projeto, escrita, manuscrito e correção.", "redacao", "pen")}${row("Prontuário dos erros", "Motivo percebido, orientação e próxima conduta.", "erros", "check")}${row("Atualidades", "Filtro pedagógico e caderno de leitura imprimível.", "atualidades", "book")}${row("Evolução", "Resultados acumulados e próxima conduta.", "progresso", "chart")}${row("Prontuário médico da aprendizagem", "Desempenho, evolução e documentos destinados à família.", "relatorio", "book")}${row("Orientação contextual", "Um especialista de plantão indicado para cada dúvida.", "assistente", "chat")}`;
    const auditRows = auditModeEnabled()
      ? `<div class="callout space"><strong>Área de auditoria interna.</strong><br>Os recursos abaixo não aparecem na jornada regular do aluno.</div>${row("AUDITORIA · Recuperação global", "Todos os cursos, áreas, exemplos e prescrições de memória.", "auditoria/recuperacao", "grid")}${row("AUDITORIA · Mapa mental demonstrativo", "Validação visual do material contextual de Biologia.", "mapa-mental/celula", "grid")}${row("AUDITORIA · Modelos documentais", "Documentos fictícios de todos os ambientes.", "documentos", "book")}${row("AUDITORIA · Regras internas das patentes", "Volume, tempos e parâmetros de progressão.", "patentes", "clock")}`
      : "";
    return shell(`${pageHead("Mapa da jornada", "Muito poder.<br>Um próximo passo por vez.", "O aluno vê apenas as ações que fazem sentido para o seu momento; parâmetros técnicos permanecem nos bastidores.")}${studentRows}${auditRows}`, "");
  }

  let activeVaiBemRoute = "";

  function vaiBemContext() {
    return {
      state,
      esc,
      shell,
      pageHead,
      row,
      link,
      btn,
      icon,
      save: originalSave,
      render: (...args) => render(...args),
      go,
      toast,
    };
  }

  const routeRenderer = function hardRouteRenderer(resetScroll = true) {
    let route = location.hash.replace(/^#\/?/, "") || "hoje";
    if (activeVaiBemRoute === "vaibem/sala" && route !== "vaibem/sala") {
      window.CAV_VAIBEM_LIVE?.dispose?.().catch(() => {});
    }
    activeVaiBemRoute = route;
    if (!auditModeEnabled() && ["auditoria/recuperacao", "patentes"].includes(route)) {
      route = "mapa";
      history.replaceState(null, "", `${location.pathname}${location.search}#/mapa`);
    }
    let html = null;
    const vaiBemLive = window.CAV_VAIBEM_LIVE;
    const vaiBemStudy = window.CAV_VAIBEM_STUDY;
    const vaiBemCtx = vaiBemContext();
    if (route === "vaibem" && vaiBemLive) html = vaiBemLive.renderHome(vaiBemCtx);
    else if (route === "vaibem/sala" && vaiBemLive) html = vaiBemLive.renderRoom(vaiBemCtx);
    else if (route === "vaibem/caderno" && vaiBemLive) html = vaiBemLive.renderNotebookList(vaiBemCtx);
    else if (route.startsWith("vaibem/caderno/") && vaiBemLive) html = vaiBemLive.renderNotebook(vaiBemCtx, decodeURIComponent(route.slice("vaibem/caderno/".length)));
    else if (route === "vaibem/evolucao" && vaiBemLive) html = vaiBemLive.renderProgress(vaiBemCtx);
    else if (route === "vaibem/atividade" && vaiBemStudy) html = vaiBemStudy.renderActivity(vaiBemCtx);
    else if (route.startsWith("vaibem/atividade/") && vaiBemStudy) html = vaiBemStudy.renderReview(vaiBemCtx, decodeURIComponent(route.slice("vaibem/atividade/".length)));
    else if (route === "vaibem/preparar" && vaiBemStudy) html = vaiBemStudy.renderPreparation(vaiBemCtx);
    else if (route === "vaibem/preparar/resultado" && vaiBemStudy) html = vaiBemStudy.renderPrepared(vaiBemCtx);
    else if (route === "lista-externa") html = externalListHome();
    else if (route === "lista-externa/revisar") html = externalReview();
    else if (route === "lista-externa/responder") html = externalQuestion();
    else if (route === "lista-externa/resultado") html = externalResult();
    else if (route === "recuperacao" || route.startsWith("recuperacao/")) {
      const routeKey = route.slice("recuperacao/".length);
      if (routeKey) {
        state.activeRecoveryKey = decodeURIComponent(routeKey);
        state.activeRecoveryCourse = state.product || currentProduct || "ultimate";
        recoveryRecord(state.activeRecoveryKey);
        originalSave();
      }
      html = recoveryPage();
    }
    else if (route === "mapa") html = hardJourneyMap();
    else if (route === "mapa-mental/evolucao") html = mindMapEvolutionPage();
    else if (route === "mapa-mental/celula") html = cellMindMapPage();
    else if (route === "auditoria/recuperacao") html = recoveryAuditPage();
    else if (route === "documentos" || route.startsWith("documentos/")) html = documentHub(Number(route.split("/")[1]) || 0);
    else if (route === "patentes") html = patentRulesPage();
    else if (route === "degustacao") html = trialOnboarding();
    if (html !== null) {
      closeDialog();
      $("#app").innerHTML = html;
      document.title = `${resourceRouteLabels[route] || "Jornada do aluno"} · CAVPRIME`;
      if (resetScroll) window.scrollTo(0, 0);
      applyExperienceCohesion();
      vaiBemLive?.mount?.(route, vaiBemCtx);
      vaiBemStudy?.mount?.(route, vaiBemCtx);
      return;
    }
    originalRender(resetScroll);
    document.title = "CAVPRIME · Jornada do aluno";
    applyExperienceCohesion();
  };
  render = routeRenderer;

  function applyRailSignature() {
    const rail = document.querySelector(".rail-foot");
    if (!rail) return;
    const fullBrand = new URLSearchParams(location.search).get("brand") === "full";
    const variant = fullBrand ? "full" : "medical";
    if (rail.dataset.variant === variant && rail.dataset.product === currentProduct) return;
    rail.dataset.variant = variant;
    rail.dataset.product = currentProduct;
    if (fullBrand) {
      rail.className = "rail-foot rail-full-brand";
      rail.innerHTML = `<img src="${EMBEDDED_ASSETS["cavprime.png"]}" alt="CAVPRIME">`;
      return;
    }
    rail.className = "rail-foot rail-medical-signature";
    rail.innerHTML = `<span>${currentProduct === "vaibem" ? "AULA PARTICULAR" : "MEDICINA"}</span><i aria-hidden="true"></i><small>by CAVPRIME</small>`;
  }

  const resourceRouteLabels = {
    "lista-externa": "Lista externa",
    "lista-externa/revisar": "Classificação da lista",
    "lista-externa/responder": "Lista externa",
    "lista-externa/resultado": "Correção da lista",
    vaibem: "VaiBem",
    "vaibem/sala": "Aula particular",
    "vaibem/caderno": "Meu caderno",
    "vaibem/evolucao": "Evolução",
    "vaibem/atividade": "Correção de atividade",
    "vaibem/preparar": "Preparar a próxima aula",
    "vaibem/preparar/resultado": "Aula preparada",
    recuperacao: "Recuperação guiada",
    erros: "Prontuário",
    relatorio: "Prontuário médico da aprendizagem",
    assistente: "Orientação",
    universidade: "Universidade-alvo",
    banco: "Banco de questões",
    simulado: "Simulado",
    atualidades: "Atualidades",
    mapa: "Mapa da jornada",
    documentos: "Prontuário médico da aprendizagem",
    patentes: "Regra das patentes",
    degustacao: "Degustação de sete dias",
    "mapa-mental/evolucao": "Mapa mental de Biologia",
    "mapa-mental/celula": "Mapa mental de Célula",
    "auditoria/recuperacao": "Prancha de recuperação",
  };

  const focusRouteLabels = {
    plantao: "UltimateENEM · Lista",
    questao: "UltimateENEM · Lista",
    resultado: "UltimateENEM · Correção",
    "lista-externa/responder": "UltimateENEM · Lista externa",
    "lista-externa/resultado": "UltimateENEM · Correção",
    "diadea/treino": "DIA DE A · Treino",
    "discmed/escrever": "DISCMED · Discursiva",
    "medpism/treino": "MEDPISM · Treino",
  };

  function enhancePortal() {
    if (!document.querySelector(".portal")) return;
    document.querySelectorAll(".product-tile[data-product]").forEach((tile) => {
      const productId = tile.dataset.product;
      const experience = productExperiences[productId];
      if (!experience || tile.querySelector(".course-popover")) return;
      tile.insertAdjacentHTML("beforeend", `<span class="course-popover"><small>${esc(experience.eyebrow)}</small><strong>${esc(experience.title)}</strong><em>${esc(experience.description)}</em><b>Degustação completa por 7 dias</b></span>`);
      tile.setAttribute("aria-describedby", `course-help-${productId}`);
      const popover = tile.querySelector(".course-popover");
      if (popover) popover.id = `course-help-${productId}`;
    });
    const action = document.querySelector('.portal-action [data-action="enter"]');
    if (action && action.dataset.trialProduct !== selectedProduct) {
      action.innerHTML = `Conhecer ${esc(products[selectedProduct]?.name || "o curso")} por 7 dias ${icon("arrow")}`;
      action.dataset.trialProduct = selectedProduct;
    }
    const grid = document.querySelector(".product-grid");
    if (grid && !document.querySelector(".portal-course-preview")) {
      const experience = productExperiences[selectedProduct] || productExperiences.ultimate;
      grid.insertAdjacentHTML("afterend", `<div class="portal-course-preview"><small>${esc(experience.eyebrow)}</small><strong>${esc(experience.title)}</strong><p>${esc(experience.description)}</p></div>`);
    }
  }

  function injectFocusTools(route) {
    const config = timerConfigForRoute(route);
    const header = document.querySelector(".focus-header");
    if (!header || !config) return;
    if (state.examTimer.key !== config.key || !state.examTimer.duration) setTimer(config.key, config.seconds, false);
    let tools = header.querySelector(".focus-tools");
    if (!tools) {
      const demoTag = header.querySelector(".demo-tag");
      const markup = `<div class="focus-tools"><button class="timer-button" data-action="timer-toggle" aria-label="Iniciar ou pausar cronômetro">${icon("clock")}<span id="exam-timer">${formatTimer(timerRemaining())}</span></button><button class="iconbtn focus-lock" data-action="exam-focus" aria-label="Entrar no modo de prova" title="Modo de prova">${icon("expand")}</button></div>`;
      if (demoTag) demoTag.insertAdjacentHTML("beforebegin", markup);
      else header.insertAdjacentHTML("beforeend", markup);
      tools = header.querySelector(".focus-tools");
    }
    tools?.classList.toggle("running", Boolean(state.examTimer.running));
  }

  function updateTimerDisplay() {
    const remaining = timerRemaining();
    const timerElement = document.querySelector("#exam-timer");
    const simulationElement = document.querySelector("#simulation-timer");
    if (timerElement) timerElement.textContent = formatTimer(remaining);
    if (simulationElement) simulationElement.textContent = formatTimer(remaining);
    if (state.examTimer.running && remaining <= 0) {
      state.examTimer.running = false;
      state.examTimer.remaining = 0;
      state.examTimer.deadline = 0;
      originalSave();
      toast("Tempo encerrado. Suas respostas permanecem salvas.");
    }
  }

  function applyExperienceCohesion() {
    applyRailSignature();
    const route = location.hash.replace(/^#\/?/, "") || "hoje";
    document.body.dataset.experienceRoute = route.replace(/[^a-z0-9-]+/gi, "-");
    document.body.dataset.experienceProduct = currentProduct || "ultimate";

    const routeLabel = resourceRouteLabels[route] || (route.startsWith("recuperacao/") ? resourceRouteLabels.recuperacao : "");
    const crumbLabel = document.querySelector(".crumb span:last-child");
    if (routeLabel && crumbLabel && crumbLabel.textContent !== routeLabel) crumbLabel.textContent = routeLabel;

    const resourceButton = document.querySelector('.sidebar-bottom [data-action="resources"]');
    if (resourceButton) {
      const resourceActive = currentProduct === "ultimate" && Boolean(routeLabel);
      resourceButton.classList.toggle("active", resourceActive);
      if (resourceActive) resourceButton.setAttribute("aria-current", "page");
      else resourceButton.removeAttribute("aria-current");
    }

    const focusWord = document.querySelector(".focus-word");
    const focusLabel = focusRouteLabels[route];
    if (focusWord && focusLabel && focusWord.textContent !== focusLabel) focusWord.textContent = focusLabel;
    document.querySelectorAll(".demo-tag").forEach((element) => {
      element.hidden = !auditModeEnabled();
      element.style.display = auditModeEnabled() ? "" : "none";
    });
    if (!auditModeEnabled()) {
      const footerText = document.querySelector(".page-footer > span");
      const footerMap = document.querySelector('.page-footer [data-action="map"]');
      if (footerText && footerText.textContent !== "Progresso salvo neste dispositivo.") {
        footerText.textContent = "Progresso salvo neste dispositivo.";
      }
      if (footerMap && footerMap.textContent !== "Ver mapa da jornada") {
        footerMap.textContent = "Ver mapa da jornada";
      }
    }
    enhancePortal();
    injectFocusTools(route);
    [document.querySelector("#app"), document.querySelector("#dialog")].filter(Boolean).forEach((root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        const normalized = node.nodeValue
          .replace(/ULTIMATE\s*ENEM/gi, "UltimateENEM")
          .replace(/VAI\s*BEM/gi, "VaiBem");
        if (normalized !== node.nodeValue) node.nodeValue = normalized;
        node = walker.nextNode();
      }
    });
  }

  const appRoot = document.querySelector("#app");
  if (appRoot) new MutationObserver(applyExperienceCohesion).observe(appRoot, { childList: true, subtree: true });
  window.setInterval(updateTimerDisplay, 1000);

  handlers["why-hard"] = () => openDialog("A inteligência trabalha nos bastidores.", `<p>A prioridade combina histórico, erros, recorrência, dificuldade autorizada pela patente e o tempo disponível.</p><p>O aluno recebe somente uma conduta clara. Fórmulas de progressão, percentuais internos e decisões técnicas não ocupam a tela.</p>`);
  handlers.about = () => auditModeEnabled()
    ? openDialog("Sobre esta auditoria", `<p>Os dados são fictícios e o progresso demonstrativo fica apenas neste navegador.</p><p>O teste preserva as marcas e os documentos homologados enquanto avalia uma nova experiência pós-login.</p>`, link("Ver mapa da jornada " + icon("arrow"), "mapa", "btn"))
    : openDialog("Sobre sua jornada", `<p>Seu histórico organiza resultados, orientações e próximas condutas sem expor cálculos ou parâmetros internos.</p>`, link("Ver mapa da jornada " + icon("arrow"), "mapa", "btn"));
  handlers.map = () => go("mapa");
  handlers["essay-review-ai"] = () => requestEssayReview();
  handlers["print-matrix"] = () => window.print();
  handlers["essay-input-mode"] = (button) => {
    const nextMode = button.dataset.mode === "upload" ? "upload" : "type";
    if (state.essay.inputMode === nextMode) return;
    state.essay.inputMode = nextMode;
    state.essay.aiReview = null;
    state.essay.reviewStatus = "idle";
    state.essay.reviewMessage = "";
    state.essay.recorded = false;
    state.essay.evaluationSource = "";
    state.essay.scores = [null, null, null, null, null];
    originalSave();
    render(false);
  };
  handlers["open-compare-tabs"] = () => {
    const base = `${location.origin}${location.pathname}${location.search}`;
    const textWindow = window.open(`${base}#/redacao/texto`, "_blank");
    const materialWindow = window.open(`${base}#/redacao/material`, "_blank");
    if (!textWindow || !materialWindow) {
      go("redacao/comparar");
      toast("O navegador bloqueou uma das abas. Abrimos a comparação lado a lado.");
      return;
    }
    toast("Texto e projeto foram abertos em duas abas.");
  };
  handlers["area-pick"] = (button) => { loadArea(button.dataset.area); originalSave(); render(false); };
  handlers["start-questions"] = () => {
    if (state.submitted) { go("resultado"); return; }
    const config = timerConfigForRoute("questao");
    setTimer(config.key, config.seconds, true);
    go("questao");
  };
  handlers["next-question"] = () => { if (state.answers[state.index] === undefined) return; state.index = Math.min(questions.length - 1, state.index + 1); save(); render(); };
  handlers["submit-open"] = () => {
    if (Object.keys(state.answers).length < questions.length) { toast(`Responda às ${questions.length} questões antes de corrigir.`); return; }
    openDialog("Corrigir esta lista?", `<p>Ao confirmar, os acertos serão marcados em verde e os erros abrirão imediatamente no prontuário com gabarito comentado.</p>`, btn("Continuar revisando", "close", "btn outline") + btn("Corrigir agora", "submit-final"));
  };
  handlers["submit-final"] = () => { pauseTimer(); state.submitted = true; save(); go("resultado"); };
  handlers.retry = () => { state.answers = {}; state.index = 0; state.submitted = false; state.attempt += 1; save(); go("questao"); };
  handlers["advance-area"] = (button) => { loadArea(button.dataset.area); originalSave(); go("plantao"); };
  handlers["error-reason"] = (button) => {
    const key = button.dataset.index;
    openDialog("O que aconteceu nesta questão?", `<p>Sua percepção ajuda nossos médicos orientadores a escolher a próxima intervenção.</p><form id="hard-reason-form" data-index="${esc(key)}" class="space-sm"><label class="field">Motivo<select id="reason-select">${["Não sabia o conteúdo", "Não reconheci a aplicação", "Interpretação", "Cálculo ou procedimento", "Distração", "Gestão de tempo", "Troquei uma resposta correta", "Chute sem estratégia"].map((reason) => `<option ${state.reason[key] === reason ? "selected" : ""}>${reason}</option>`).join("")}</select></label><label class="field space-sm">Minha percepção<textarea id="error-note" maxlength="600" placeholder="O que passou pela sua cabeça? O que você faria diferente?">${esc(state.errorNotes[key] || "")}</textarea></label><button type="submit" class="btn space">Salvar no prontuário ${icon("check")}</button></form>`);
  };
  handlers["recovery-open"] = (button) => {
    const key = button.dataset.index || "";
    const entry = wrongEntries().find((item) => `${item.areaId}:${item.index}` === key);
    if (!entry) {
      toast("Não foi possível localizar esta questão no prontuário.");
      return;
    }
    const courseKey = state.product || currentProduct || "ultimate";
    const policy = window.CAV_RECOVERY_ENGINE?.coursePolicies?.[courseKey];
    if (policy && !policy.enabled) return;
    state.activeRecoveryKey = key;
    state.activeRecoveryCourse = courseKey;
    recoveryRecord(key);
    originalSave();
    go("recuperacao");
  };
  handlers["recovery-map-next"] = () => {
    if (!state.activeRecoveryKey) return;
    const current = Number(state.recoveryMapVariants[state.activeRecoveryKey] || 0);
    state.recoveryMapVariants[state.activeRecoveryKey] = current + 1;
    originalSave();
    render(false);
    requestAnimationFrame(() => document.querySelector(".mind-map")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  handlers["recovery-answer"] = (button) => {
    const entry = activeRecoveryEntry();
    const curriculum = recoveryCurriculum(entry);
    if (!entry || !curriculum?.supported) return;
    const record = recoveryRecord(state.activeRecoveryKey);
    const index = Number(button.dataset.index);
    if (!Number.isInteger(index) || record.answers[index] !== undefined) return;
    record.answers[index] = Number(button.dataset.value);
    const answered = curriculum.questions.filter((_, questionIndex) => record.answers[questionIndex] !== undefined).length;
    if (answered === curriculum.questions.length) {
      record.score = curriculum.questions.reduce((total, questionItem, questionIndex) => total + (record.answers[questionIndex] === questionItem.correct ? 1 : 0), 0);
      record.completedAt = new Date().toISOString();
      const previous = state.recoveryHistory.find((item) => item.key === state.activeRecoveryKey);
      const historyItem = {
        key: state.activeRecoveryKey,
        course: recoveryCourseKey(),
        competencyCode: curriculum.competencyCode,
        skillCode: curriculum.skillCode,
        microtheme: curriculum.microtheme,
        score: record.score,
        total: curriculum.questions.length,
        completedAt: record.completedAt,
      };
      if (previous) Object.assign(previous, historyItem);
      else state.recoveryHistory.push(historyItem);
      toast("Recuperação concluída e registrada no ciclo.");
    }
    originalSave();
    render(false);
  };
  handlers["command-help"] = (button) => {
    const command = window.CAV_RECOVERY_AUDIT?.commands?.[button.dataset.command];
    if (!command) return;
    openDialog(`O que ${command.label.toLowerCase()} exige?`, `<div class="command-dialog"><p><strong>Entregue isto:</strong> ${esc(command.requirement)}</p><p><strong>Formato seguro:</strong> ${esc(command.format)}</p><p><strong>Armadilha comum:</strong> ${esc(command.trap)}</p></div>`);
  };
  handlers["flashcard-flip"] = (button) => {
    const flipped = button.classList.toggle("flipped");
    button.setAttribute("aria-pressed", String(flipped));
  };
  handlers["audit-course"] = (button) => {
    const catalog = window.CAV_RECOVERY_AUDIT;
    const course = catalog?.courses?.[button.dataset.course];
    if (!course) return;
    state.recoveryAuditCourse = button.dataset.course;
    state.recoveryAuditArea = course.areas[0][0];
    originalSave();
    render(false);
  };
  handlers["audit-area"] = (button) => {
    state.recoveryAuditArea = button.dataset.area;
    originalSave();
    render(false);
  };
  handlers["timer-toggle"] = () => {
    const route = location.hash.replace(/^#\/?/, "") || "hoje";
    const config = timerConfigForRoute(route);
    if (!config) return;
    if (state.examTimer.key !== config.key || !state.examTimer.duration) setTimer(config.key, config.seconds, false);
    if (state.examTimer.running) pauseTimer();
    else {
      if (timerRemaining() <= 0) state.examTimer.remaining = config.seconds;
      setTimer(config.key, config.seconds, true);
    }
    render(false);
  };
  handlers["simulation-day"] = (button) => {
    pauseTimer();
    state.simulationDay = Number(button.dataset.day) === 2 ? 2 : 1;
    const config = timerConfigForRoute("simulado");
    setTimer(config.key, config.seconds, false);
    originalSave();
    render(false);
  };
  handlers["exam-focus"] = async () => {
    const target = document.querySelector(".focus") || document.querySelector(".shell") || document.documentElement;
    try {
      if (!document.fullscreenElement) await target.requestFullscreen();
      state.examMode = true;
      originalSave();
      toast("Modo de prova ativado. Saídas desta tela serão registradas.");
    } catch (_) {
      toast("O navegador não autorizou a tela cheia. Suas respostas continuam salvas.");
    }
  };
  handlers["news-filter"] = (button) => { state.newsArea = button.dataset.area || "todas"; originalSave(); render(false); };
  handlers["news-print"] = () => {
    if (!state.newsSelections.length) { toast("Selecione ao menos um tópico para preparar a leitura."); return; }
    window.print();
  };
  handlers.microphone = async () => {
    const input = document.querySelector("#room-input");
    if (!input) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Recognition) {
        openDialog("Microfone autorizado.", "<p>O dispositivo permitiu a fala, mas este navegador não oferece transcrição automática. O aluno ainda pode participar por texto e ouvir a explicação.</p>");
        return;
      }
      activeRecognition?.abort?.();
      activeRecognition = new Recognition();
      activeRecognition.lang = "pt-BR";
      activeRecognition.interimResults = false;
      activeRecognition.maxAlternatives = 1;
      activeRecognition.onresult = (event) => {
        input.value = event.results?.[0]?.[0]?.transcript || "";
        input.focus();
        toast("Fala transcrita. Confira e envie sua resposta.");
      };
      activeRecognition.onerror = () => toast("Não foi possível transcrever agora. Você pode responder por texto.");
      activeRecognition.start();
      toast("Pode falar. A resposta aparecerá no campo para sua conferência.");
    } catch (_) {
      openDialog("Microfone não autorizado.", "<p>Libere o microfone nas permissões do navegador para responder falando. O modo de prova em tela cheia não impede a voz quando essa permissão está ativa.</p>");
    }
  };
  handlers["hard-theme"] = (button) => {
    const pack = essayPacks.find((item) => item.id === button.dataset.pack);
    if (!pack) return;
    state.hardEssayPackId = pack.id;
    state.essay.theme = pack.theme;
    state.essay.dischargePhraseIndex = (state.essay.dischargePhraseIndex + 1 + Math.floor(Math.random() * (dischargePhrases.length - 1))) % dischargePhrases.length;
    originalSave();
    go("redacao/compreender");
  };
  handlers.enter = () => {
    state.product = selectedProduct;
    originalSave();
    let remembered = false;
    try { remembered = localStorage.getItem(DEMO_ACCESS.storageKey) === DEMO_ACCESS.token; } catch (_) {}
    if (remembered) {
      go(selectedProduct === "ultimate" ? "hoje" : selectedProduct === "vaibem" ? "vaibem" : `${selectedProduct}/hoje`);
      return;
    }
    go("login");
  };
  handlers["print-mindmap"] = () => window.print();
  handlers["external-start"] = () => {
    state.externalDraft.index = 0;
    state.externalDraft.answers = {};
    state.externalDraft.stage = "answer";
    const config = timerConfigForRoute("lista-externa/responder");
    setTimer(config.key, config.seconds, true);
    originalSave();
    go("lista-externa/responder");
  };
  handlers["external-answer"] = (button) => {
    const draft = state.externalDraft;
    draft.answers[draft.index] = Number(button.dataset.value);
    if (draft.index === draft.questions.length - 1) {
      pauseTimer();
      completeExternalList();
      go("lista-externa/resultado");
      return;
    }
    draft.index += 1;
    originalSave();
    render();
  };

  async function importExternalList(form) {
    const fileInput = form.querySelector("#external-file");
    const file = fileInput?.files?.[0] || null;
    const text = form.querySelector("#external-text")?.value.trim() || "";
    const answerKey = form.querySelector("#external-key")?.value || "";
    const name = form.querySelector("#external-name")?.value.trim() || "Lista externa";
    let parsed = text ? parseExternalText(text, answerKey) : [];
    let usedFallback = false;
    if (!parsed.length && file) {
      try {
        if (file.size > 4 * 1024 * 1024) throw new Error("file_too_large");
        const dataUrl = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
        const response = await fetch("/api/cavprime-list-import-test", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, fileName: file.name, mimeType: file.type, dataUrl, answerKey }), signal: AbortSignal.timeout(150000) });
        const payload = await response.json();
        if (!response.ok || !Array.isArray(payload.questions) || !payload.questions.length) throw new Error("import_unavailable");
        parsed = payload.questions;
      } catch (_) {
        parsed = sampleExternalQuestions();
        usedFallback = true;
      }
    }
    if (!parsed.length) {
      toast("Selecione um arquivo ou cole questões com alternativas.");
      return;
    }
    state.externalDraft = { name, fileName: file?.name || "Texto colado", questions: parsed, answers: {}, index: 0, stage: "review" };
    originalSave();
    go("lista-externa/revisar");
    if (usedFallback) toast("Uma leitura demonstrativa foi carregada. O plantão fará a extração completa quando o serviço estiver disponível.");
  }

  document.addEventListener("submit", (event) => {
    if (event.target.id === "hard-login-form") {
      event.preventDefault();
      const loginValue = event.target.querySelector("#hard-login")?.value.trim() || "";
      const passwordValue = event.target.querySelector("#hard-password")?.value || "";
      if (loginValue !== DEMO_ACCESS.login || passwordValue !== DEMO_ACCESS.password) {
        toast("Login ou senha incorretos.");
        return;
      }
      try {
        if (event.target.querySelector("#hard-remember")?.checked) localStorage.setItem(DEMO_ACCESS.storageKey, DEMO_ACCESS.token);
        else localStorage.removeItem(DEMO_ACCESS.storageKey);
      } catch (_) {}
      state.product = selectedProduct;
      state.name ||= "Aluno CAVPRIME";
      originalSave();
      go(selectedProduct === "ultimate" ? "hoje" : selectedProduct === "vaibem" ? "vaibem" : `${selectedProduct}/hoje`);
      return;
    }
    if (event.target.id === "hard-reason-form") {
      event.preventDefault();
      const key = event.target.dataset.index;
      state.reason[key] = event.target.querySelector("#reason-select")?.value || "";
      state.errorNotes[key] = event.target.querySelector("#error-note")?.value.trim().slice(0, 600) || "";
      originalSave();
      closeDialog();
      toast("Registro salvo no prontuário.");
      render(false);
      return;
    }
    if (event.target.id === "trial-form") {
      event.preventDefault();
      const productId = event.target.dataset.product || selectedProduct;
      const startedAt = new Date();
      const endsAt = new Date(startedAt.getTime() + 7 * 86400000);
      state.name = event.target.querySelector("#trial-name")?.value.trim().slice(0, 60) || state.name;
      state.product = productId;
      state.trials[productId] = { startedAt: startedAt.toISOString(), endsAt: endsAt.toISOString(), status: "active" };
      selectedProduct = productId;
      originalSave();
      toast("Degustação completa ativada por sete dias.");
      go(productId === "ultimate" ? "hoje" : productId === "vaibem" ? "vaibem" : `${productId}/hoje`);
      return;
    }
    if (event.target.id === "external-import-form") {
      event.preventDefault();
      importExternalList(event.target);
      return;
    }
    if (event.target.id === "manual-assessment-form") {
      event.preventDefault();
      const values = [0, 1, 2, 3, 4].map((index) => event.target.querySelector(`#manual-score-${index}`)?.value ?? "");
      if (values.some((value) => value === "")) {
        toast("Selecione as cinco competências antes de salvar.");
        return;
      }
      state.essay.scores = values.map(Number);
      state.essay.recorded = true;
      state.essay.evaluationSource = "manual";
      state.essay.aiReview = null;
      state.essay.reviewStatus = "manual";
      state.essay.reviewMessage = "";
      originalSave();
      toast("Correção recebida registrada como manual.");
      render(false);
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.dataset.newsId) {
      const id = event.target.dataset.newsId;
      state.newsSelections = event.target.checked
        ? Array.from(new Set([...state.newsSelections, id]))
        : state.newsSelections.filter((item) => item !== id);
      originalSave();
      const count = document.querySelector(".news-action span");
      if (count) count.textContent = `${state.newsSelections.length} tópicos no caderno`;
      return;
    }
    if (event.target.id === "essay-manuscript") {
      const file = event.target.files?.[0] || null;
      if (file && !["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast("Envie um arquivo PDF, JPG, PNG ou WEBP.");
        event.target.value = "";
        return;
      }
      if (file && file.size > 4 * 1024 * 1024) {
        toast("O arquivo deve ter no máximo 4 MB.");
        event.target.value = "";
        return;
      }
      if (manuscriptObjectUrl) URL.revokeObjectURL(manuscriptObjectUrl);
      manuscriptObjectUrl = "";
      manuscriptFile = file;
      state.essay.manuscriptFileName = file?.name || "";
      state.essay.manuscriptMimeType = file?.type || "";
      state.essay.aiReview = null;
      state.essay.reviewStatus = "idle";
      state.essay.reviewMessage = "";
      state.essay.recorded = false;
      state.essay.evaluationSource = "";
      state.essay.scores = [null, null, null, null, null];
      originalSave();
      render(false);
      if (file) toast("Manuscrito pronto para a visita do especialista.");
      return;
    }
    if (event.target.id === "external-file") {
      const file = event.target.files?.[0];
      state.externalDraft.fileName = file?.name || "";
      const zone = document.querySelector("#external-upload-zone");
      if (zone) {
        zone.classList.toggle("has-file", Boolean(file));
        zone.querySelector("strong").textContent = file?.name || "Selecionar PDF ou imagem";
        zone.querySelector("small").textContent = file ? "Arquivo pronto para leitura" : "Toque aqui ou arraste o arquivo da lista";
      }
    }
    if (event.target.dataset.manualScore !== undefined) {
      const values = [0, 1, 2, 3, 4].map((index) => document.querySelector(`#manual-score-${index}`)?.value ?? "");
      const total = values.some((value) => value === "") ? "—" : values.reduce((sum, value) => sum + Number(value), 0);
      const totalElement = document.querySelector("#manual-rubric-total");
      if (totalElement) totalElement.innerHTML = `${total} <span class="small muted">/ 1000</span>`;
    }
  });

  document.addEventListener("input", (event) => {
    if (event.target.id === "essay-hard-search") {
      const results = document.querySelector("#essay-hard-results");
      if (results) results.innerHTML = essaySearchResults(event.target.value);
    }
    if (event.target.dataset.essay === "text" && state.essay.aiReview) {
      state.essay.aiReview = null;
      state.essay.reviewStatus = "idle";
      state.essay.reviewMessage = "";
      state.essay.recorded = false;
      state.essay.evaluationSource = "";
      state.essay.scores = [null, null, null, null, null];
      originalSave();
    }
  });

  function registerFocusIncident() {
    const now = Date.now();
    if (now - Number(state.lastFocusIncidentAt || 0) < 800) return false;
    state.lastFocusIncidentAt = now;
    state.focusIncidents += 1;
    originalSave();
    return true;
  }

  document.addEventListener("visibilitychange", () => {
    if (!state.examMode || !state.examTimer?.running) return;
    if (document.hidden) {
      registerFocusIncident();
    } else {
      toast(`Retorno ao modo de prova. Saídas registradas: ${state.focusIncidents}.`);
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (state.examMode && !document.fullscreenElement && state.examTimer?.running) {
      registerFocusIncident();
      state.examMode = false;
      originalSave();
      toast("A tela cheia foi encerrada. O cronômetro continua e a saída foi registrada.");
    }
  });

  Object.assign(products.ultimate, { name: "UltimateENEM", state: "" });
  Object.assign(products.diadea, { state: "" });
  Object.assign(products.discmed, { state: "" });
  Object.assign(products.medpism, { state: "" });
  Object.assign(products.vaibem, { name: "VaiBem", state: "" });

  if (!location.hash) {
    history.replaceState(null, "", `${location.pathname}${location.search}#/portal`);
  }
  render();
})();
