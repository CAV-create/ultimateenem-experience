const DAY_COUNT = 120;
const PASSING_SCORE = 4;
const STORAGE_KEY = "medfocus120-state-v1";
const BRAND_NAME = "ultimateENEM experience";
const BRAND_SUBTITLE = "Preparação intensiva, diagnóstico de performance e experiência premium para Medicina.";
const DAILY_REQUIRED_BY_AREA = 5;
const DAILY_TOTAL_QUESTIONS = 20;
const SIMULADO_TOTAL_QUESTIONS = 180;
const SIMULADO_QUESTIONS_BY_AREA = 45;
const APP_VIEWS = ["today", "clinic", "plan", "bank", "redacao", "news", "simulado", "performance"];
const TRI_CLINIC_QUANTITIES = [5, 10, 15, 20, 30];
const SIMULADO_ENEM_TIMES = [
  { label: "Caderno Dia 1 + Redação", start: "13h30", end: "19h00", duration: "5h30", areas: "Linguagens, Humanas e redação manuscrita" },
  { label: "Caderno Dia 2", start: "13h30", end: "18h30", duration: "5h", areas: "Natureza e Matemática" },
];
const TIMER_PRESETS = {
  focus: { label: "Foco", seconds: 50 * 60 },
  short: { label: "Pausa", seconds: 10 * 60 },
  "enem-day-one": { label: "Caderno Dia 1 + Redação", seconds: 5.5 * 60 * 60 },
  "enem-day-two": { label: "Caderno Dia 2", seconds: 5 * 60 * 60 },
};
const IS_LOCAL_SERVER_PREVIEW =
  typeof window !== "undefined" &&
  window.location.protocol !== "file:" &&
  ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
const DAILY_NEWS_PRODUCTION_ENDPOINT = "https://ultimateenem-experience-api.vercel.app/api/noticias/diarias";
const DAILY_NEWS_DEFAULT_ENDPOINT = IS_LOCAL_SERVER_PREVIEW
  ? "http://localhost:3000/api/noticias/diarias"
  : DAILY_NEWS_PRODUCTION_ENDPOINT;
const DAILY_NEWS_SAMPLE_PAYLOAD = {
  generatedAt: "",
  sourceCount: 0,
  brief: {
    date: "",
    headline: "Plantão de atualidades pronto para receber notícias diárias com foco ENEM",
    enemFocus: {
      redacao: {
        repertorio:
          "Quando o endpoint estiver conectado, este bloco transforma manchetes do dia em repertório sociocultural, temas prováveis e caminhos de intervenção no padrão ENEM.",
        possibleThemes: [
          "Desafios para garantir cidadania em contextos de desigualdade social no Brasil",
          "Caminhos para fortalecer a educação midiática entre jovens brasileiros",
          "A importância da ciência e da saúde pública para a proteção coletiva",
        ],
        interventionAngles: [
          {
            theme: "Educação midiática",
            agent: "Ministério da Educação e escolas",
            action: "inserir oficinas de leitura crítica de notícias",
            means: "por meio de projetos interdisciplinares com análise de fontes, dados e linguagem",
            purpose: "reduzir desinformação e ampliar a participação cidadã",
            detail: "com produção de textos argumentativos e debates orientados por professores de Linguagens e Humanas",
          },
        ],
      },
      objectiveAreas: {
        linguagens: ["Ler criticamente manchetes, editoriais, campanhas, gêneros digitais e estratégias argumentativas."],
        matematica: ["Usar dados públicos, percentuais, taxas e gráficos citados nas notícias para treinar leitura estatística."],
        cienciasHumanas: ["Relacionar fatos atuais a cidadania, trabalho, território, direitos humanos, política pública e desigualdade."],
        cienciasDaNatureza: ["Aproximar notícias de saúde, ambiente, clima, tecnologia, energia e método científico."],
      },
    },
    sections: [
      {
        title: "Modo de uso no app",
        bullets: [
          {
            title: "Conectar endpoint ou colar JSON",
            summary: "Use o endpoint do pacote anexado ou cole a resposta JSON gerada pelo servidor.",
            enemUse: "O app organiza o material em repertório, temas, intervenção, exames por área e fontes originais.",
            enemAreas: ["Redação ENEM", "Linguagens", "Ciências Humanas"],
            sourceIds: [],
          },
        ],
      },
    ],
    pedagogicalPick: {
      title: "Escolha pedagógica do dia",
      reason: "Priorize notícias com problema social, grupo afetado, causas, consequências e possibilidade de intervenção.",
      suggestedUse: "Transformar a notícia em tese, repertório produtivo, parágrafo autoral e proposta C5 completa.",
      enemAreas: ["Redação ENEM", "Ciências Humanas", "Linguagens"],
      sourceIds: [],
    },
  },
  sources: [],
};
const MISSION_AREAS = ["linguagens", "humanas", "natureza", "matematica"];
const DIFFICULTY_LABELS = {
  easy: "Fácil",
  medium: "Média",
  hard: "Difícil",
};
const MEDICAL_CASES = {
  easy: {
    linguagens: [
      {
        title: "Orientação de alta: virose leve",
        specialty: "Medicina de Família",
        patient: "Paciente com febre baixa e dúvidas sobre cuidados em casa.",
        vitals: "comunicação clara, leitura do enunciado e segurança básica",
        success: "você orientou a alta com clareza e evitou alarme desnecessário",
      },
      {
        title: "Pronto atendimento: dor de garganta simples",
        specialty: "Clínica Médica",
        patient: "Paciente precisa entender sinais de alerta e tratamento correto.",
        vitals: "interpretação, comando da questão e vocabulário",
        success: "você separou o que é essencial do que é ruído no caso",
      },
    ],
    humanas: [
      {
        title: "Acolhimento: campanha de vacinação",
        specialty: "Saúde Pública",
        patient: "Comunidade precisa compreender direitos, acesso e confiança na ciência.",
        vitals: "contexto social, cidadania e leitura de fontes",
        success: "você fortaleceu a adesão da comunidade com boa análise social",
      },
      {
        title: "UBS: prevenção de dengue no bairro",
        specialty: "Medicina Preventiva",
        patient: "Famílias organizam ações contra focos de mosquito.",
        vitals: "território, cultura local e políticas públicas",
        success: "você conectou ambiente, sociedade e prevenção",
      },
    ],
    natureza: [
      {
        title: "Hidratação: intoxicação alimentar leve",
        specialty: "Gastroenterologia",
        patient: "Paciente com náusea e desidratação leve após alimento contaminado.",
        vitals: "biologia, química básica e relação causa-efeito",
        success: "você hidratou o paciente e identificou o mecanismo do quadro",
      },
      {
        title: "Curativo simples: ferida superficial",
        specialty: "Enfermaria Clínica",
        patient: "Paciente precisa de limpeza correta e prevenção de infecção.",
        vitals: "células, microrganismos e processos naturais",
        success: "você protegeu a cicatrização com raciocínio científico",
      },
    ],
    matematica: [
      {
        title: "Dose segura: cálculo de soro oral",
        specialty: "Pediatria",
        patient: "Criança precisa de volume proporcional ao peso e ao tempo.",
        vitals: "proporção, unidades e conferência de resultado",
        success: "você calculou a dose com segurança e evitou erro de unidade",
      },
      {
        title: "Triagem: fila de atendimento",
        specialty: "Gestão Hospitalar",
        patient: "Equipe organiza tempos de espera e prioridade de atendimento.",
        vitals: "porcentagem, média e leitura de dados",
        success: "você organizou o fluxo com precisão e calma",
      },
    ],
  },
  medium: {
    linguagens: [
      {
        title: "Consulta difícil: adesão ao tratamento",
        specialty: "Psiquiatria e Clínica Médica",
        patient: "Paciente entende pouco a prescrição e precisa de comunicação empática.",
        vitals: "argumentação, gênero textual e inferência",
        success: "você traduziu informação complexa sem perder rigor",
      },
    ],
    humanas: [
      {
        title: "Vigilância: surto de arbovirose",
        specialty: "Epidemiologia",
        patient: "Município precisa decidir ações com base em mapas, dados e desigualdades.",
        vitals: "cartografia, Estado, território e decisão pública",
        success: "você priorizou recursos onde o risco era maior",
      },
    ],
    natureza: [
      {
        title: "Crise moderada: asma no pronto-socorro",
        specialty: "Pneumologia",
        patient: "Paciente com falta de ar precisa de estabilização e leitura de sinais.",
        vitals: "fisiologia, gases, energia e interpretação experimental",
        success: "você estabilizou a respiração com raciocínio integrado",
      },
      {
        title: "Investigação: anemia ferropriva",
        specialty: "Hematologia",
        patient: "Paciente apresenta fadiga e exames sugerem deficiência nutricional.",
        vitals: "química, biologia celular e metabolismo",
        success: "você relacionou exame, causa e conduta de estudo",
      },
    ],
    matematica: [
      {
        title: "Leito monitorado: ajuste de medicação",
        specialty: "Farmacologia Clínica",
        patient: "Dose precisa variar conforme concentração e intervalo de tempo.",
        vitals: "funções, gráficos, taxa de variação e proporção",
        success: "você ajustou a curva de dose sem perder o controle",
      },
      {
        title: "Centro cirúrgico: escala de materiais",
        specialty: "Cirurgia",
        patient: "Equipe estima materiais por procedimento e margem de segurança.",
        vitals: "combinatória, estimativa e medidas",
        success: "você preparou a sala com cálculo enxuto e confiável",
      },
    ],
  },
  hard: {
    linguagens: [
      {
        title: "Reunião de equipe: comunicação de notícia complexa",
        specialty: "Oncologia",
        patient: "Família precisa compreender cenário delicado com linguagem precisa.",
        vitals: "efeito de sentido, argumentação e leitura crítica",
        success: "você conduziu a comunicação com precisão e humanidade",
      },
    ],
    humanas: [
      {
        title: "Comitê de crise: colapso de saneamento",
        specialty: "Medicina Social",
        patient: "Cidade enfrenta internações evitáveis por falhas estruturais.",
        vitals: "política pública, desigualdade, território e cidadania",
        success: "você identificou a causa estrutural e priorizou intervenção",
      },
    ],
    natureza: [
      {
        title: "Sala vermelha: sepse em evolução",
        specialty: "Medicina Intensiva",
        patient: "Paciente grave exige leitura rápida de sinais e resposta integrada.",
        vitals: "bioquímica, fisiologia, energia e tomada de decisão",
        success: "você reconheceu o padrão crítico e coordenou a estabilização",
      },
      {
        title: "Emergência: tromboembolismo pulmonar",
        specialty: "Cardiologia e Pneumologia",
        patient: "Paciente com dor torácica e baixa oxigenação precisa de raciocínio fino.",
        vitals: "circulação, gases, força, energia e evidências",
        success: "você conectou sinais e mecanismo com precisão de prova",
      },
    ],
    matematica: [
      {
        title: "UTI: previsão de ocupação de leitos",
        specialty: "Medicina Intensiva",
        patient: "Hospital precisa prever demanda usando dados e tendência.",
        vitals: "estatística, função, probabilidade e tomada de decisão",
        success: "você antecipou gargalos e protegeu a capacidade da equipe",
      },
      {
        title: "Pesquisa clínica: análise de eficácia",
        specialty: "Medicina Baseada em Evidências",
        patient: "Estudo compara grupos, risco e impacto de intervenção.",
        vitals: "probabilidade, leitura de gráficos e interpretação de dados",
        success: "você interpretou o estudo com rigor de aprovação",
      },
    ],
  },
};
const LEVEL_RULES = {
  iniciante: {
    label: "Iniciante",
    theory: 60,
    exercises: 40,
    mix: { easy: 100, medium: 0, hard: 0 },
    note: "Construir base com questões fáceis e habilidades recorrentes, protegendo a coerência da prova.",
  },
  mediano: {
    label: "Mediano",
    theory: 40,
    exercises: 60,
    mix: { easy: 30, medium: 60, hard: 10 },
    note: "Atacar lacunas específicas e converter teoria em acerto.",
  },
  avancado: {
    label: "Avançado",
    theory: 20,
    exercises: 80,
    mix: { easy: 20, medium: 45, hard: 35 },
    note: "Manter fáceis, ampliar médias e difíceis e incluir raras para ganho de desempenho sem perder coerência.",
  },
};
const MATRIX_DATA = window.ENEM_DATA?.matrix || { areas: {} };

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const COMPETENCIES = [
  {
    id: "natureza",
    name: "Ciências da Natureza",
    short: "Natureza",
    colorClass: "tag-natureza",
    skills: [
      {
        id: "bio-celular",
        title: "Biologia celular",
        focus: "membranas, organelas, respiração e síntese proteica",
        core: "relacionar estrutura celular, função e fluxo de energia",
        trap: "confundir organela, processo e consequência",
        cue: "voltar ao comando, localizar a organela citada e ligar função ao efeito",
      },
      {
        id: "bio-genetica",
        title: "Genética e hereditariedade",
        focus: "DNA, cromossomos, heredogramas e probabilidade genética",
        core: "traduzir cruzamentos e heredogramas em proporções",
        trap: "somar probabilidades quando o evento pede multiplicação",
        cue: "separar genótipo, fenótipo e condição pedida no enunciado",
      },
      {
        id: "bio-ecologia",
        title: "Ecologia e impactos ambientais",
        focus: "cadeias alimentares, ciclos biogeoquímicos e sucessão",
        core: "explicar relações entre população, ambiente e energia",
        trap: "tratar todo impacto como efeito imediato e isolado",
        cue: "procurar causa, escala temporal e nível trófico envolvido",
      },
      {
        id: "quim-estequiometria",
        title: "Estequiometria",
        focus: "mol, massa, proporção, rendimento e pureza",
        core: "converter unidades e respeitar a proporção da equação balanceada",
        trap: "calcular com equação química não balanceada",
        cue: "balancear, converter para mol e só depois aplicar a razão",
      },
      {
        id: "quim-solucoes",
        title: "Soluções e concentração",
        focus: "molaridade, diluição, mistura e unidades",
        core: "relacionar quantidade de soluto, volume e concentração",
        trap: "misturar mL, L, g e mol sem conversão",
        cue: "anotar unidades antes da conta e converter tudo para a mesma base",
      },
      {
        id: "fis-mecanica",
        title: "Mecânica",
        focus: "cinemática, dinâmica, energia, trabalho e potência",
        core: "identificar forças, conservação e grandezas vetoriais",
        trap: "usar fórmula sem desenhar o sistema físico",
        cue: "fazer diagrama simples e decidir se há resultante ou conservação",
      },
      {
        id: "fis-eletricidade",
        title: "Eletricidade",
        focus: "circuitos, potência, resistores e consumo",
        core: "interpretar corrente, tensão, resistência e energia elétrica",
        trap: "confundir potência com energia consumida",
        cue: "separar grandezas instantâneas de grandezas acumuladas no tempo",
      },
      {
        id: "fis-termologia",
        title: "Termologia",
        focus: "calor, temperatura, mudanças de estado e gases",
        core: "distinguir calor trocado, temperatura e energia interna",
        trap: "achar que temperatura sempre muda quando há calor",
        cue: "verificar se existe mudança de fase ou equilíbrio térmico",
      },
    ],
  },
  {
    id: "matematica",
    name: "Matemática e Raciocínio",
    short: "Matemática",
    colorClass: "tag-matematica",
    skills: [
      {
        id: "mat-proporcao",
        title: "Razão, proporção e porcentagem",
        focus: "escalas, taxas, descontos, aumentos e variação relativa",
        core: "comparar partes e total usando a mesma referência",
        trap: "aplicar porcentagem sobre a base errada",
        cue: "identificar qual valor é 100% antes de calcular",
      },
      {
        id: "mat-funcoes",
        title: "Funções e gráficos",
        focus: "linear, quadrática, exponencial, leitura de gráficos",
        core: "ligar variável, crescimento e representação gráfica",
        trap: "confundir valor da função com taxa de variação",
        cue: "observar eixos, unidade, inclinação e ponto pedido",
      },
      {
        id: "mat-estatistica",
        title: "Estatística",
        focus: "média, mediana, moda, dispersão e leitura de dados",
        core: "resumir dados sem perder o significado do conjunto",
        trap: "usar média quando a pergunta pede posição ou dispersão",
        cue: "decidir se a questão cobra tendência central ou variabilidade",
      },
      {
        id: "mat-geometria-plana",
        title: "Geometria plana",
        focus: "áreas, perímetros, semelhança e ângulos",
        core: "decompor figuras e usar relações de semelhança",
        trap: "calcular área quando a pergunta pede perímetro",
        cue: "marcar no desenho o que é comprimento, área e ângulo",
      },
      {
        id: "mat-geometria-espacial",
        title: "Geometria espacial",
        focus: "volume, área total, cortes e planificações",
        core: "visualizar sólidos e relacionar faces, arestas e volume",
        trap: "trocar unidade quadrada por cúbica",
        cue: "escrever a dimensão física do resultado esperado",
      },
      {
        id: "mat-trigonometria",
        title: "Trigonometria",
        focus: "seno, cosseno, tangente, triângulos e ciclo",
        core: "modelar razões entre lados e ângulos",
        trap: "aplicar seno, cosseno ou tangente no lado errado",
        cue: "identificar hipotenusa, oposto e adjacente antes da fórmula",
      },
      {
        id: "mat-probabilidade",
        title: "Probabilidade",
        focus: "eventos, independência, união, interseção e condicional",
        core: "contar casos favoráveis e possíveis com critério",
        trap: "contar casos repetidos ou incompatíveis",
        cue: "desenhar árvore, tabela ou conjunto antes da operação",
      },
      {
        id: "mat-combinatoria",
        title: "Análise combinatória",
        focus: "arranjos, combinações, permutações e princípio multiplicativo",
        core: "decidir se a ordem importa e se há repetição",
        trap: "usar arranjo quando a ordem não muda o resultado",
        cue: "testar dois exemplos trocados para ver se contam como diferentes",
      },
    ],
  },
  {
    id: "linguagens",
    name: "Linguagens e Redação",
    short: "Linguagens",
    colorClass: "tag-linguagens",
    skills: [
      {
        id: "ling-interpretacao",
        title: "Interpretação de texto",
        focus: "inferência, tese, finalidade e pistas de sentido",
        core: "provar a resposta com evidência do texto",
        trap: "escolher alternativa verdadeira que não responde ao comando",
        cue: "voltar ao trecho e sublinhar a pista que sustenta a resposta",
      },
      {
        id: "ling-generos",
        title: "Gêneros textuais",
        focus: "função social, suporte, interlocutor e estrutura",
        core: "reconhecer finalidade comunicativa e contexto de circulação",
        trap: "classificar gênero só pelo tema",
        cue: "identificar quem fala, para quem fala e com qual objetivo",
      },
      {
        id: "ling-coesao",
        title: "Coesão e coerência",
        focus: "conectivos, progressão, retomada e referenciação",
        core: "acompanhar como as ideias se ligam no texto",
        trap: "ignorar o valor lógico dos conectivos",
        cue: "substituir o conectivo mentalmente e ver se o sentido muda",
      },
      {
        id: "ling-variacao",
        title: "Variação linguística",
        focus: "registro, norma, preconceito linguístico e adequação",
        core: "avaliar linguagem pelo contexto de uso",
        trap: "tratar variação como erro automaticamente",
        cue: "verificar situação, interlocutor e efeito pretendido",
      },
      {
        id: "ling-literatura",
        title: "Literatura brasileira",
        focus: "escolas, contexto histórico, voz poética e recursos",
        core: "ligar forma literária, contexto e visão de mundo",
        trap: "decorar escola sem analisar o texto apresentado",
        cue: "partir do excerto e só depois acionar repertório histórico",
      },
      {
        id: "ling-gramatica",
        title: "Gramática em contexto",
        focus: "sintaxe, concordância, pontuação e efeitos de sentido",
        core: "entender regra como recurso de sentido no texto",
        trap: "resolver por nomenclatura sem olhar a função",
        cue: "perguntar que efeito a construção produz naquele trecho",
      },
      {
        id: "ling-redacao",
        title: "Redação argumentativa",
        focus: "tese, repertório, desenvolvimento e proposta de intervenção",
        core: "defender tese com argumento organizado e intervenção viável",
        trap: "listar repertórios sem conectá-los ao problema",
        cue: "amarrar causa, consequência e agente de intervenção",
      },
    ],
  },
  {
    id: "humanas",
    name: "Ciências Humanas",
    short: "Humanas",
    colorClass: "tag-humanas",
    skills: [
      {
        id: "hum-hist-brasil",
        title: "História do Brasil",
        focus: "colonização, escravidão, república, ditadura e cidadania",
        core: "relacionar processo histórico, grupo social e permanência",
        trap: "tratar fatos como datas soltas",
        cue: "perguntar quem ganhou, quem perdeu e o que permaneceu",
      },
      {
        id: "hum-hist-geral",
        title: "História geral",
        focus: "revoluções, guerras, imperialismo e mundo contemporâneo",
        core: "entender ruptura, continuidade e disputa de poder",
        trap: "ignorar o contexto econômico e político do evento",
        cue: "situar tempo, espaço e atores antes de escolher a alternativa",
      },
      {
        id: "hum-geografia-fisica",
        title: "Geografia física",
        focus: "clima, relevo, hidrografia, biomas e riscos ambientais",
        core: "ligar fenômeno natural a escala e dinâmica territorial",
        trap: "confundir clima com tempo atmosférico",
        cue: "checar duração, escala espacial e processo físico envolvido",
      },
      {
        id: "hum-geografia-humana",
        title: "Geografia humana",
        focus: "urbanização, população, economia, agropecuária e indústria",
        core: "analisar território, fluxo e desigualdade socioespacial",
        trap: "ler mapa ou dado sem considerar escala",
        cue: "identificar unidade territorial, período e indicador",
      },
      {
        id: "hum-sociologia",
        title: "Sociologia",
        focus: "cultura, trabalho, estratificação, poder e movimentos sociais",
        core: "explicar práticas sociais por relações e instituições",
        trap: "responder com opinião pessoal no lugar de conceito",
        cue: "procurar o conceito sociológico que organiza o fenômeno",
      },
      {
        id: "hum-filosofia",
        title: "Filosofia",
        focus: "ética, política, conhecimento, razão e modernidade",
        core: "identificar problema filosófico e argumento do autor",
        trap: "confundir concordância pessoal com interpretação do texto",
        cue: "separar tese, justificativa e conceito central",
      },
      {
        id: "hum-atualidades",
        title: "Atualidades e cidadania",
        focus: "direitos, saúde pública, tecnologia, ambiente e geopolítica",
        core: "conectar tema atual a causas, dados e consequências",
        trap: "usar senso comum sem evidência",
        cue: "buscar no texto a relação entre fato, indicador e impacto social",
      },
      {
        id: "hum-cartografia",
        title: "Cartografia e mapas",
        focus: "escala, projeções, coordenadas, gráficos e mapas temáticos",
        core: "interpretar representação espacial e seus limites",
        trap: "comparar mapas com escalas diferentes como se fossem iguais",
        cue: "ler legenda, escala, orientação e fonte antes das opções",
      },
    ],
  },
];

const ENEM_DATA = window.ENEM_DATA || { questions: [], redacao: {} };
const REDACTION_MICRODATA = window.REDACTION_MICRODATA || {};
const REDACTION_STAGE9_DATA = window.REDACTION_INTELLIGENCE_STAGE9 || {};
const DEFAULT_REDACTION_LIBRARY = {
  repertories: [
    {
      id: "cf-1988",
      title: "Constituição Federal de 1988",
      area: "Direitos e cidadania",
      bestFor: "C2 e C5",
      themes: ["saúde", "educação", "segurança alimentar", "moradia", "igualdade"],
      summary: "Use quando o tema cobrar direito social, acesso desigual ou omissão do poder público.",
      bridge: "A Constituição de 1988 garante direitos sociais; entretanto, a distância entre norma e prática revela a permanência do problema.",
      sample: "No tema sobre acesso à saúde, ela valida a tese de que o Estado deve reduzir barreiras territoriais e econômicas.",
      avoid: "Não use apenas para dizer que 'todo mundo tem direito'. Explique qual direito foi negado e por qual mecanismo.",
    },
    {
      id: "paulo-freire",
      title: "Paulo Freire",
      area: "Educação crítica",
      bestFor: "C2 e C3",
      themes: ["educação", "letramento", "participação social", "desinformação", "cidadania"],
      summary: "Funciona quando o problema depende de consciência crítica, formação cidadã e autonomia do indivíduo.",
      bridge: "Na perspectiva freireana, a educação deve formar sujeitos capazes de ler criticamente a realidade.",
      sample: "Em um texto sobre combate à desinformação, Freire ajuda a defender educação midiática como prevenção.",
      avoid: "Evite citar Freire em temas puramente ambientais ou tecnológicos se não houver conexão com formação cidadã.",
    },
    {
      id: "djamila-ribeiro",
      title: "Djamila Ribeiro",
      area: "Desigualdades e voz social",
      bestFor: "C2",
      themes: ["racismo", "gênero", "invisibilidade", "representatividade", "violência simbólica"],
      summary: "Boa escolha quando o tema envolve grupos silenciados, falta de escuta pública ou desigualdade histórica.",
      bridge: "A discussão sobre lugar de fala evidencia que grupos afetados precisam participar da construção das soluções.",
      sample: "Em temas sobre mulheres, população negra ou minorias, o repertório ajuda a justificar políticas com participação social.",
      avoid: "Não transforme o repertório em frase solta; mostre como a ausência de voz piora o problema.",
    },
    {
      id: "bauman",
      title: "Zygmunt Bauman",
      area: "Modernidade e vínculos frágeis",
      bestFor: "C2 e C3",
      themes: ["tecnologia", "consumo", "solidão", "relações sociais", "individualismo"],
      summary: "Use quando o tema envolve rapidez, fragilidade dos vínculos, consumo ou relações superficiais.",
      bridge: "Bauman descreve uma modernidade marcada pela fluidez das relações, o que ajuda a explicar a instabilidade dos vínculos sociais.",
      sample: "Em temas sobre saúde mental, redes sociais ou consumo, ele sustenta a análise de isolamento e imediatismo.",
      avoid: "Não use Bauman para qualquer tema. A ponte precisa passar por fluidez, instabilidade ou individualismo.",
    },
    {
      id: "lei-8080",
      title: "Lei Orgânica da Saúde - SUS",
      area: "Saúde pública",
      bestFor: "C2 e C5",
      themes: ["saúde", "vacinação", "prevenção", "saneamento", "território"],
      summary: "Repertório forte para temas de saúde como direito, prevenção e acesso universal.",
      bridge: "A lógica do SUS estabelece saúde como direito e dever do Estado, mas a desigualdade territorial limita sua efetivação.",
      sample: "No tema sobre vacinação, pode fundamentar ação de busca ativa e comunicação comunitária.",
      avoid: "Não cite o SUS se o tema não tiver relação com saúde, prevenção, ambiente ou qualidade de vida.",
    },
    {
      id: "eca",
      title: "Estatuto da Criança e do Adolescente",
      area: "Proteção integral",
      bestFor: "C2 e C5",
      themes: ["infância", "educação", "violência", "trabalho infantil", "proteção digital"],
      summary: "Ajuda quando o problema atinge crianças e adolescentes e exige rede de proteção.",
      bridge: "O ECA prevê proteção integral, o que torna inadmissível a naturalização de violações contra crianças e adolescentes.",
      sample: "Em temas sobre evasão escolar ou violência infantil, sustenta intervenção com escola, família e assistência social.",
      avoid: "Evite se o grupo afetado não for criança ou adolescente.",
    },
  ],
  sourcePacks: [
    {
      id: "cartilha-enem-2025",
      title: `Cartilha dos Calouros ENEM ${new Date().getFullYear()}`,
      type: "Manual Oficial dos Preceptores",
      sourceLabel: "INEP/MEC",
      availability: "PDF completo",
      links: [
        {
          label: "Abrir cartilha oficial",
          url: "https://download.inep.gov.br/publicacoes/institucionais/avaliacoes_e_exames_da_educacao_basica/a_redacao_no_enem_2025_cartilha_do_participante.pdf",
        },
      ],
      themes: ["critérios oficiais", "C1 a C5", "nota zero", "repertório produtivo"],
      readingFocus:
        "Leia como corretor: cada competência tem um comportamento observável no texto, não uma frase mágica para decorar.",
      essentialPoints: [
        "C1 cobra modalidade formal, estrutura sintática, desvios e escolha de registro.",
        "C2 pune fuga, tangenciamento e repertório de bolso; o repertório precisa ser pertinente, contextualizado e articulado.",
        "C3 observa projeto de texto, autoria, organização das informações e defesa de ponto de vista.",
        "C4 avalia coesão lógica; conectivo em excesso ou sem relação de sentido pode atrapalhar.",
        "C5 exige proposta explícita, concreta, articulada ao texto e respeitosa aos direitos humanos.",
      ],
      howToUse:
        "Use como checklist antes de corrigir a própria redação: tema, tese, repertório, progressão, coesão e intervenção.",
      examinerCare:
        "Não confundir cartilha com fórmula pronta. O avaliador procura projeto de texto, não decoração de modelos.",
      closingPair: "Se começar pela cartilha, feche com uma revisão C1-C5 antes de passar a limpo.",
    },
    {
      id: "cf-1988-leitura",
      title: "Constituição Federal de 1988",
      type: "Lei maior",
      sourceLabel: "Senado Federal / Planalto",
      availability: "Texto completo disponível",
      links: [
        {
          label: "Texto consolidado no Senado",
          url: "https://www2.senado.leg.br/bdsf/handle/id/518231",
        },
        {
          label: "Texto no Planalto",
          url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
        },
      ],
      themes: ["direitos sociais", "cidadania", "saúde", "educação", "meio ambiente", "renda", "trabalho", "economia"],
      readingFocus:
        "Estude os artigos que viram ponte de redação: direitos sociais, saúde, educação, cultura, meio ambiente, criança, adolescente e idoso.",
      essentialPoints: [
        "Art. 6 ajuda em temas de moradia, saúde, alimentação, educação, trabalho, transporte e segurança.",
        "Art. 170 ajuda em temas econômicos: ordem econômica, valorização do trabalho humano e justiça social.",
        "Art. 196 é forte para saúde pública: direito social, dever do Estado e políticas de acesso.",
        "Art. 205 fundamenta educação como desenvolvimento da pessoa e preparo para cidadania.",
        "Art. 225 sustenta temas ambientais e responsabilidade coletiva.",
        "Art. 227 ajuda em infância, juventude e proteção integral.",
      ],
      howToUse:
        "Comece pela Constituição quando o eixo for direito negado; depois prove a distância entre norma e prática.",
      examinerCare:
        "Não escreva só 'a Constituição garante direitos'. Diga qual direito, qual grupo ficou sem acesso e por qual causa.",
      closingPair:
        "Se abrir com Constituição, feche com agente público específico e uma medida que reduza a distância entre lei e realidade.",
    },
    {
      id: "ibge-sis-leitura",
      title: "IBGE - Síntese de Indicadores Sociais",
      type: "Fonte de dados socioeconômicos",
      sourceLabel: "IBGE",
      availability: "Página oficial com relatórios e tabelas",
      links: [
        {
          label: "Abrir fonte IBGE",
          url: "https://www.ibge.gov.br/estatisticas/sociais/populacao/9221-sintese-de-indicadores-sociais.html",
        },
      ],
      themes: ["renda", "pobreza", "desigualdade", "trabalho", "crise financeira", "custo de vida"],
      readingFocus:
        "Procure dados sobre renda, pobreza, desigualdade, trabalho e acesso a direitos para transformar economia em problema social concreto.",
      essentialPoints: [
        "Dados do IBGE ajudam a evitar argumento genérico sobre crise financeira.",
        "Use renda, pobreza e trabalho para mostrar grupo afetado e consequência social.",
        "Cruze o dado com Constituição: direito existe, mas a instabilidade econômica reduz acesso real.",
      ],
      howToUse:
        "Use quando o tema envolver crise financeira, renda, pobreza, custo de vida, desemprego ou desigualdade econômica.",
      examinerCare:
        "Não jogue número solto. Explique quem foi afetado, qual direito ficou comprometido e que causa mantém o problema.",
      closingPair:
        "Se abrir com IBGE, feche com Ministério do Desenvolvimento Social, Ministério do Trabalho ou políticas de renda, qualificação e proteção social.",
    },
    {
      id: "bcb-cidadania-financeira",
      title: "Banco Central - Cidadania Financeira",
      type: "Educação financeira e consumo",
      sourceLabel: "Banco Central do Brasil",
      availability: "Portal oficial",
      links: [
        {
          label: "Abrir portal do BC",
          url: "https://www.bcb.gov.br/cidadaniafinanceira",
        },
      ],
      themes: ["endividamento", "educação financeira", "consumo", "juros", "crédito", "crise financeira"],
      readingFocus:
        "Use para temas em que a crise financeira envolve endividamento familiar, consumo, crédito, juros e baixa educação financeira.",
      essentialPoints: [
        "Educação financeira só funciona bem no ENEM se vier ligada a renda, proteção social e regulação.",
        "Endividamento pode ser tratado como efeito de baixa renda, crédito caro e vulnerabilidade informacional.",
        "A intervenção precisa combinar escola, orientação pública e proteção contra práticas abusivas.",
      ],
      howToUse:
        "Use para defender educação financeira como prevenção, sem culpar individualmente famílias vulneráveis.",
      examinerCare:
        "Não transforme crise financeira em falha moral do cidadão. Mostre contexto econômico, renda e acesso desigual à informação.",
      closingPair:
        "Se abrir com Banco Central, feche com MEC, Procons, bancos públicos e campanhas de orientação financeira nas escolas e comunidades.",
    },
    {
      id: "sus-lei-8080",
      title: "Lei Orgânica da Saúde - Lei 8.080/1990",
      type: "Lei de saúde pública",
      sourceLabel: "Planalto",
      availability: "Texto completo disponível",
      links: [
        {
          label: "Abrir Lei 8.080",
          url: "https://www.planalto.gov.br/ccivil_03/leis/l8080.htm",
        },
      ],
      themes: ["SUS", "vacinação", "prevenção", "saneamento", "território"],
      readingFocus:
        "Procure universalidade, integralidade, fatores determinantes da saúde e organização do cuidado em rede.",
      essentialPoints: [
        "Saúde não é só hospital: envolve alimentação, moradia, saneamento, trabalho, renda, educação e ambiente.",
        "Universalidade e integralidade permitem discutir acesso desigual e cuidado preventivo.",
        "A atenção básica ajuda a propor busca ativa, equipes multiprofissionais e acompanhamento territorial.",
      ],
      howToUse:
        "Use em temas de saúde pública para transformar o argumento em política concreta, não em apelo genérico.",
      examinerCare:
        "Evite receitar solução médica individual quando o tema pede política pública, prevenção e acesso coletivo.",
      closingPair:
        "Se começar pelo SUS, feche com Ministério da Saúde, secretarias municipais, UBS e agentes comunitários.",
    },
    {
      id: "eca-lei-8069",
      title: "Estatuto da Criança e do Adolescente - Lei 8.069/1990",
      type: "Marco de proteção",
      sourceLabel: "Planalto",
      availability: "Texto completo disponível",
      links: [
        {
          label: "Abrir ECA",
          url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm",
        },
      ],
      themes: ["infância", "juventude", "violência", "educação", "proteção digital"],
      readingFocus:
        "Estude proteção integral, prioridade absoluta, escola, família, comunidade, Conselho Tutelar e rede de garantia.",
      essentialPoints: [
        "Criança e adolescente devem ser tratados como sujeitos de direitos, não como responsabilidade apenas da família.",
        "Prioridade absoluta ajuda a defender políticas intersetoriais em educação, saúde, assistência e segurança.",
        "Conselhos e escolas podem aparecer como agentes quando o tema envolve violência, evasão ou vulnerabilidade.",
      ],
      howToUse:
        "Use quando o grupo afetado for criança ou adolescente e a tese envolver proteção insuficiente.",
      examinerCare:
        "Não proponha punições violentas ou exposição pública. A C5 deve respeitar direitos humanos.",
      closingPair:
        "Se abrir com ECA, feche com Conselho Tutelar, escola, assistência social e campanha de identificação precoce.",
    },
    {
      id: "lei-10639-leitura",
      title: "Lei 10.639/2003",
      type: "Educação e relações étnico-raciais",
      sourceLabel: "Planalto",
      availability: "Texto completo disponível",
      links: [
        {
          label: "Abrir Lei 10.639",
          url: "https://www.planalto.gov.br/ccivil_03/leis/2003/L10.639.htm",
        },
      ],
      themes: ["herança africana", "racismo", "currículo", "memória", "representatividade"],
      readingFocus:
        "A lei é excelente quando o problema envolve currículo eurocêntrico, apagamento histórico e valorização afro-brasileira.",
      essentialPoints: [
        "Torna obrigatório o ensino de história e cultura afro-brasileira no currículo escolar.",
        "Ajuda a defender formação docente, material didático e continuidade da política, não ação comemorativa isolada.",
        "Dialoga com literatura, história, artes, religiões de matriz africana e identidade nacional.",
      ],
      howToUse:
        "Use para mostrar que a solução já tem base legal, mas precisa de execução pedagógica permanente.",
      examinerCare:
        "Não limite a intervenção ao Dia da Consciência Negra; isso enfraquece a ideia de política contínua.",
      closingPair:
        "Se abrir com Lei 10.639, feche com Maria Firmina dos Reis, História Geral da África ou formação docente.",
    },
    {
      id: "ursula-maria-firmina",
      title: "Úrsula - Maria Firmina dos Reis",
      type: "Romance abolicionista",
      sourceLabel: "Edição digital / domínio público",
      availability: "Obra em domínio público; leitura integral disponível em edições digitais",
      links: [
        {
          label: "Ler edição digital",
          url: "https://odanoburu.github.io/ursula/",
        },
        {
          label: "Contexto da autora",
          url: "https://pt.wikipedia.org/wiki/Maria_Firmina_dos_Reis",
        },
      ],
      themes: ["herança africana", "racismo", "mulheres negras", "literatura", "apagamento"],
      readingFocus:
        "Não use só o nome da obra. Estude como a autora rompe a visão escravocrata e dá humanidade aos personagens negros.",
      essentialPoints: [
        "A obra denuncia a brutalidade da escravização em uma literatura escrita por mulher negra no século XIX.",
        "É forte para discutir apagamento de autoras negras no cânone literário e no currículo.",
        "Funciona muito bem quando o argumento é invisibilidade simbólica ou reparação cultural.",
      ],
      howToUse:
        "Use em desenvolvimento sobre escola, literatura e memória: explique o que a obra revela e por que isso prova seu argumento.",
      examinerCare:
        "A cartilha alerta contra repertório decorativo. Maria Firmina só pontua bem se for explicada e ligada ao tema.",
      closingPair:
        "Se abrir com Maria Firmina, feche com Lei 10.639 ou políticas de leitura de autoras negras nas escolas.",
    },
    {
      id: "paulo-freire-leitura",
      title: "Paulo Freire - educação crítica",
      type: "Conceito educacional",
      sourceLabel: "Obra autoral protegida",
      availability: "Use conceitos e referências; não reproduza capítulos",
      links: [
        {
          label: "Contexto de Pedagogia do Oprimido",
          url: "https://pt.wikipedia.org/wiki/Pedagogia_do_Oprimido",
        },
      ],
      themes: ["educação", "cidadania", "letramento", "desinformação", "autonomia"],
      readingFocus:
        "Estude educação dialógica, leitura crítica da realidade e autonomia do estudante.",
      essentialPoints: [
        "Freire é forte quando a causa do problema passa por baixa formação crítica.",
        "O repertório melhora quando você mostra como educação gera participação social.",
        "Combina bem com políticas de escola, formação docente e educação midiática.",
      ],
      howToUse:
        "Use para defender que informação sem formação crítica não muda comportamento social.",
      examinerCare:
        "Não use Freire em qualquer tema. Se não houver educação, consciência crítica ou cidadania, procure outro repertório.",
      closingPair:
        "Se abrir com Freire, feche com MEC, formação docente, oficinas escolares ou educação midiática.",
    },
    {
      id: "chimamanda-historia-unica",
      title: "Chimamanda Ngozi Adichie - O perigo de uma história única",
      type: "Palestra e conceito cultural",
      sourceLabel: "TED",
      availability: "Palestra pública; use o conceito, não frases decoradas",
      links: [
        {
          label: "Contexto da palestra",
          url: "https://en.wikipedia.org/wiki/The_Danger_of_a_Single_Story",
        },
      ],
      themes: ["estereótipos", "representatividade", "cultura", "racismo", "mídia"],
      readingFocus:
        "O conceito ajuda a mostrar que narrativas únicas simplificam grupos sociais e produzem estereótipos.",
      essentialPoints: [
        "Funciona em temas de invisibilidade, mídia, cultura, educação e preconceito.",
        "É melhor quando combinado com exemplo brasileiro específico, como currículo, literatura ou publicidade.",
        "Pode abrir argumento sobre como a falta de pluralidade reduz a humanidade de grupos sociais.",
      ],
      howToUse:
        "Use para explicar o mecanismo do estereótipo; depois traga uma consequência concreta no Brasil.",
      examinerCare:
        "Não basta escrever o nome da palestra. Explique qual história única está sendo produzida e por quem.",
      closingPair:
        "Se abrir com Chimamanda, feche com Maria Firmina, Lei 10.639 ou democratização de representações na mídia.",
    },
  ],
  rubricAlerts: [
    {
      code: "C1",
      title: "Sintaxe é sinal vital",
      officialBasis:
        "A cartilha trata estrutura sintática, convenções da escrita, gramática e registro formal como parte da Competência I.",
      studentCommand:
        "Revise período truncado, vírgula no lugar de ponto, concordância, regência, crase, pontuação e informalidade.",
      avoid: "Frase longa sem verbo claro, período quebrado e oralidade como 'a gente vê que'.",
      trainingCheck: "Leia cada parágrafo em voz baixa: se faltar sujeito, verbo ou fechamento, reescreva antes de passar a limpo.",
    },
    {
      code: "C2",
      title: "Repertório de bolso perde força",
      officialBasis:
        "A cartilha define repertório produtivo como pertinente, contextualizado e articulado ao argumento.",
      studentCommand:
        "Explique a fonte, conecte ao recorte temático e mostre como ela prova sua tese.",
      avoid: "Usar Utopia, Bauman, Constituição ou Freire como enfeite genérico para qualquer tema.",
      trainingCheck: "Depois do repertório, escreva uma frase começando por 'isso comprova que...'.",
    },
    {
      code: "C3",
      title: "Projeto de texto aparece no caminho",
      officialBasis:
        "A Competência III avalia seleção, relação, organização e interpretação de informações em defesa de ponto de vista.",
      studentCommand:
        "Defina tese, duas causas ou eixos, ordem dos parágrafos e consequência social antes de escrever.",
      avoid: "Listar argumentos sem hierarquia ou trocar de problema no meio do desenvolvimento.",
      trainingCheck: "Se o D2 não conversa com a tese da introdução, o projeto de texto perdeu o pulso.",
    },
    {
      code: "C4",
      title: "Coesão não é colar conectivo",
      officialBasis:
        "A cartilha avisa que conectivos precisam estabelecer relações lógicas adequadas entre as ideias.",
      studentCommand:
        "Use retomadas, sinônimos, pronomes, causa, oposição, consequência e conclusão com função real.",
      avoid: "Repetir 'além disso' em todos os parágrafos ou usar 'portanto' sem concluir nada.",
      trainingCheck: "Troque o conector por uma pergunta: causa? oposição? consequência? Se não responder, ajuste.",
    },
    {
      code: "C5",
      title: "Intervenção precisa de receita completa",
      officialBasis:
        "A cartilha exige proposta explícita, concreta, relacionada ao tema, articulada à discussão e compatível com direitos humanos.",
      studentCommand:
        "Inclua agente, ação, meio ou modo, finalidade e detalhamento ligado ao problema discutido.",
      avoid: "Dizer 'o governo deve investir' sem explicar quem, como, para quê e em qual frente.",
      trainingCheck: "Circule os cinco elementos da intervenção. Se um não aparece, a alta ainda não veio.",
    },
    {
      code: "ZERO",
      title: "Parada textual: risco de nota zero",
      officialBasis:
        "A cartilha aponta nota zero por fuga total, tipo textual inadequado, texto insuficiente, identificação, ilegibilidade e outras situações.",
      studentCommand:
        "Mantenha o recorte inteiro do tema explícito e escreva texto dissertativo-argumentativo em prosa.",
      avoid: "Mencionar o tema só no título, copiar texto motivador, narrar experiência pessoal como eixo principal ou fugir do Brasil quando o recorte pede Brasil.",
      trainingCheck: "Antes da conclusão, verifique se qualquer leitor entenderia o tema mesmo sem ver a proposta.",
    },
  ],
  authorCrossovers: [
    {
      id: "ibge-constituicao",
      start: "IBGE",
      closeWith: "Constituição de 1988",
      bestThemes: ["crise financeira", "renda", "pobreza", "trabalho", "desigualdade"],
      bridge:
        "Comece por dados socioeconômicos para mostrar o impacto concreto da crise; depois feche com a Constituição para provar que renda, trabalho e proteção social não são favores, mas direitos.",
      closing:
        "Na C5, use agente público específico e política de renda, qualificação profissional ou proteção social territorializada.",
      caution: "Não use dado econômico como decoração. O número precisa revelar grupo afetado, causa e consequência.",
    },
    {
      id: "bcb-educacao-financeira",
      start: "Banco Central",
      closeWith: "Educação financeira comunitária",
      bestThemes: ["endividamento", "consumo", "crédito", "juros", "crise financeira"],
      bridge:
        "Comece pelo endividamento como sintoma social, não como falha moral; depois proponha educação financeira articulada a renda, proteção do consumidor e orientação pública.",
      closing:
        "Na C5, combine MEC, Banco Central, Procons e escolas públicas para oficinas de orçamento, crédito responsável e prevenção ao superendividamento.",
      caution: "Não culpe a família endividada. A banca valoriza análise de estrutura econômica, informação e acesso.",
    },
    {
      id: "freire-constituicao",
      start: "Paulo Freire",
      closeWith: "Constituição de 1988",
      bestThemes: ["educação", "desinformação", "cidadania", "participação política"],
      bridge:
        "Comece pela formação crítica do cidadão e feche mostrando que educação é direito social e dever público.",
      closing:
        "Na C5, use MEC ou secretarias de educação com oficinas, formação docente e material de leitura crítica.",
      caution: "Não deixe Freire abstrato: diga qual prática educativa muda o comportamento social.",
    },
    {
      id: "maria-firmina-lei-10639",
      start: "Maria Firmina dos Reis",
      closeWith: "Lei 10.639/2003",
      bestThemes: ["herança africana", "racismo", "literatura", "memória cultural"],
      bridge:
        "Abra com a autora para provar apagamento simbólico e feche com a lei para transformar memória em política escolar.",
      closing:
        "Na C5, proponha formação docente, biblioteca antirracista e acompanhamento anual da aplicação da lei.",
      caution: "Explique a obra ou a autora; só citar 'Úrsula' vira repertório decorativo.",
    },
    {
      id: "chimamanda-maria-firmina",
      start: "Chimamanda Adichie",
      closeWith: "Maria Firmina dos Reis",
      bestThemes: ["representatividade", "mídia", "estereótipos", "currículo"],
      bridge:
        "Use a história única para explicar o mecanismo do estereótipo e Maria Firmina para mostrar uma narrativa brasileira silenciada.",
      closing:
        "Na C5, combine mídia pública, escola e editais de leitura para pluralizar vozes.",
      caution: "Não trate Chimamanda como citação universal; traduza o conceito para o recorte brasileiro.",
    },
    {
      id: "sus-constituicao",
      start: "Lei 8.080/SUS",
      closeWith: "Constituição de 1988",
      bestThemes: ["saúde pública", "vacinação", "saneamento", "prevenção"],
      bridge:
        "Comece pelo SUS para explicar o funcionamento da política pública e feche com a Constituição para reforçar o direito social.",
      closing:
        "Na C5, use Ministério da Saúde, secretarias, UBS, agentes comunitários e busca ativa territorial.",
      caution: "Evite solução individualizante; tema de saúde pública pede rede, prevenção e acesso.",
    },
    {
      id: "eca-freire",
      start: "ECA",
      closeWith: "Paulo Freire",
      bestThemes: ["infância", "juventude", "evasão escolar", "proteção digital"],
      bridge:
        "Abra com proteção integral e feche com educação crítica para mostrar que proteger também é formar autonomia.",
      closing:
        "Na C5, una escola, Conselho Tutelar, família e assistência social com protocolo de acompanhamento.",
      caution: "Não proponha controle violento ou exposição pública de crianças e adolescentes.",
    },
    {
      id: "djamila-constituicao",
      start: "Djamila Ribeiro",
      closeWith: "Constituição de 1988",
      bestThemes: ["racismo", "gênero", "invisibilidade", "representatividade"],
      bridge:
        "Comece pela crítica ao silenciamento de grupos sociais e feche com igualdade, cidadania e acesso a direitos.",
      closing:
        "Na C5, proponha participação dos grupos afetados na criação da política, para evitar solução feita sem escuta.",
      caution: "Não use 'lugar de fala' para excluir diálogo; use para defender participação qualificada dos afetados.",
    },
  ],
  competencyExamples: [
    {
      code: "C2",
      title: "Repertório produtivo",
      rule: "C2 forte tem repertório legitimado, pertinente e conectado ao ponto de vista.",
      weak: "Segundo Bauman, a sociedade é líquida. Isso mostra que o problema é grave.",
      strong:
        "A leitura de Bauman sobre vínculos frágeis ajuda a explicar por que, nas redes sociais, a validação imediata pode substituir relações de apoio, ampliando a vulnerabilidade emocional dos jovens.",
    },
    {
      code: "C4",
      title: "Costura entre ideias",
      rule: "C4 forte não empilha frases: ela mostra relação de causa, oposição, consequência e retomada.",
      weak: "O problema existe. As escolas não ajudam. O governo deve agir.",
      strong:
        "Nesse contexto, a baixa educação midiática intensifica o problema; além disso, a ausência de campanhas públicas impede que a população reconheça fontes confiáveis.",
    },
    {
      code: "C5",
      title: "Intervenção completa",
      rule: "C5 forte responde: quem faz, o que faz, como faz, para quê faz e com qual detalhe.",
      weak: "O governo deve criar campanhas para resolver o problema.",
      strong:
        "O Ministério da Educação deve implementar oficinas de checagem de informações nas escolas públicas, por meio de materiais digitais e formação docente, a fim de reduzir a circulação de notícias falsas entre adolescentes.",
    },
  ],
  c1Tips: [
    {
      id: "enem-adjunto-deslocado",
      title: "Abra o parágrafo com precisão",
      rule: "Adjunto ou conector deslocado pede vírgula depois da abertura.",
      memory: "Se começou com 'Nesse sentido', 'Dessa forma' ou 'Historicamente', respira com vírgula antes da tese.",
      reason: "Nas redações nota 1000 do acervo, a abertura formal organiza tempo, contexto ou relação lógica antes da ideia principal.",
      sourceEssay: "Base ENEM: Caio Silva Braga, Recife (PE), tema envelhecimento.",
      sourceExcerpt: "Padrão observado: abertura contextual curta antes da afirmação central do parágrafo.",
      examples: [
        [
          "Base ENEM: Caio apresenta uma leitura histórica antes de afirmar sua tese sobre envelhecer no Brasil.",
          "Imite o mecanismo, não copie o repertório: Historicamente, no Brasil, o envelhecimento foi tratado de modo desigual.",
          "Depois da vírgula, vem a afirmação principal do período, sem enrolação.",
          "Use assim: Historicamente, no Brasil, o acesso digno à velhice não alcançou todos os grupos sociais.",
          "Regra para lembrar: <rule>",
        ],
        [
          "Base ENEM: Lucas Rodrigues usa expressões como 'Sob essa lógica' para guiar a leitura do avaliador.",
          "Esse início mostra relação entre tese e argumento, sem parecer frase decorada.",
          "Use assim: Sob essa lógica, a negligência estatal compromete o acesso da população idosa a serviços públicos.",
          "A vírgula fecha a abertura e deixa o verbo principal respirar.",
          "Regra para lembrar: <rule>",
        ],
        [
          "Base ENEM: Laryssa Melo introduz argumento com 'De início', marcando progressão limpa.",
          "Esse conector é simples, mas funciona porque anuncia a primeira causa do problema.",
          "Use assim: De início, a escassez de fiscalização permite a violação de direitos assegurados por lei.",
          "Sem a vírgula, a abertura fica colada ao restante da frase e perde clareza.",
          "Regra para lembrar: <rule>",
        ],
      ],
    },
    {
      id: "enem-regencia-crase",
      title: "Crase com cara de redação real",
      rule: "Revise crase em expressões como 'devido à', 'em relação à' e 'acesso à'.",
      memory: "No ENEM, crase boa quase sempre nasce de regência: devido a, acesso a, em relação a.",
      reason: "Redações de alta nota usam essas estruturas para explicar causa, comparação e direito sem tropeço gramatical.",
      sourceEssay: "Base ENEM: Lucas Rodrigues e Laryssa Melo, redações sobre envelhecimento.",
      sourceExcerpt: "Padrão observado: uso recorrente de estruturas causais e referenciais com substantivos femininos.",
      examples: [
        [
          "Base ENEM: as redações sobre idosos relacionam negligência estatal e qualidade de vida.",
          "A estrutura pede regência: devido a + a escassez = devido à escassez.",
          "Use assim: O problema se agrava devido à escassez de políticas públicas contínuas.",
          "No masculino, seria devido ao descaso; por isso, no feminino, use devido à escassez.",
          "Regra para lembrar: <rule>",
        ],
        [
          "Base ENEM: Laryssa usa linguagem jurídica ao falar de direitos e dignidade.",
          "Acesso pede preposição a; se o nome seguinte aceita artigo feminino, ocorre crase.",
          "Use assim: O acesso à dignidade humana depende da fiscalização de direitos previstos em lei.",
          "Teste: acesso ao respeito; logo, acesso à dignidade.",
          "Regra para lembrar: <rule>",
        ],
        [
          "Base ENEM: os textos nota 1000 retomam o problema sem repetir sempre a mesma palavra.",
          "Em relação a + a velhice vira em relação à velhice.",
          "Use assim: Em relação à velhice, a sociedade brasileira ainda reproduz estereótipos excludentes.",
          "Esse ajuste é pequeno, mas sinaliza domínio da escrita formal.",
          "Regra para lembrar: <rule>",
        ],
      ],
    },
    {
      id: "enem-concordancia-retomada",
      title: "Retomada limpa, verbo estável",
      rule: "Faça verbo e retomadas concordarem com o termo central que você escolheu.",
      memory: "Antes de escrever 'os quais', 'as quais' ou 'isso ocorre', encontre quem está sendo retomado.",
      reason: "Textos nota 1000 mantêm concordância porque retomam ideias com precisão, sem mudar sujeito no meio do período.",
      sourceEssay: "Base ENEM: Laryssa Melo, Fortaleza (CE), tema envelhecimento.",
      sourceExcerpt: "Padrão observado: retomada de 'perspectivas' por forma feminina plural e progressão sem quebra sintática.",
      examples: [
        [
          "Base ENEM: Laryssa trata 'perspectivas' como termo feminino plural ao longo do período.",
          "Se o termo é plural, a retomada também precisa ir ao plural.",
          "Use assim: As perspectivas negativas sobre a velhice, as quais circulam no cotidiano, reforçam práticas discriminatórias.",
          "Não troque para 'o qual' nem mude o verbo para singular no meio da frase.",
          "Regra para lembrar: <rule>",
        ],
        [
          "Base ENEM: Lucas organiza o argumento em torno de 'Estado' e 'empresas'.",
          "Quando o sujeito é composto, o verbo acompanha a soma das causas.",
          "Use assim: O descaso estatal e a má conduta privada impulsionam a precarização do cuidado.",
          "Esse plural deixa claro que os dois agentes sustentam o problema.",
          "Regra para lembrar: <rule>",
        ],
        [
          "Base ENEM: Clara de Oliveira trabalha com 'desafios' e depois especifica suas causas.",
          "Se o núcleo é singular, não deixe o complemento comandar o verbo.",
          "Use assim: A ausência de abordagem histórica aprofundada favorece estereótipos sobre a herança africana.",
          "O verbo concorda com 'ausência', não com 'estereótipos'.",
          "Regra para lembrar: <rule>",
        ],
      ],
    },
    {
      id: "enem-registro-formal",
      title: "Registro formal sem enfeite vazio",
      rule: "Prefira vocabulário formal, específico e natural ao tema.",
      memory: "Nota alta não escreve difícil por vaidade; escreve preciso para o avaliador não duvidar.",
      reason: "As redações do acervo usam termos como negligência, escassez, precarização e invisibilidade para nomear causas reais.",
      sourceEssay: "Base ENEM: Lucas Rodrigues, Laryssa Melo e Clara de Oliveira.",
      sourceExcerpt: "Padrão observado: substantivos abstratos precisos substituem expressões vagas como 'coisa', 'muito ruim' ou 'falta de tudo'.",
      examples: [
        [
          "Base ENEM: Lucas nomeia a causa como negligência estatal, não como 'problema do governo'.",
          "Evite: O governo não liga para os idosos.",
          "Prefira: A negligência estatal fragiliza o acesso da população idosa a políticas públicas.",
          "A frase fica formal sem virar texto artificial.",
          "Regra para lembrar: <rule>",
        ],
        [
          "Base ENEM: Laryssa usa 'escassez de fiscalização' para indicar causa concreta.",
          "Evite: Ninguém fiscaliza direito e tudo fica bagunçado.",
          "Prefira: A escassez de fiscalização permite o descumprimento de normas de proteção social.",
          "Esse tipo de escolha vocabular melhora a C1 e fortalece a argumentação.",
          "Regra para lembrar: <rule>",
        ],
        [
          "Base ENEM: Clara relaciona escola, sociedade e valorização cultural com termos específicos.",
          "Evite: A escola ensina mal esse assunto.",
          "Prefira: A abordagem escolar superficial compromete a valorização da herança africana.",
          "A precisão do nome escolhido evita oralidade e generalização.",
          "Regra para lembrar: <rule>",
        ],
      ],
    },
    {
      id: "enem-intercalacao",
      title: "Intercalação só com duas travas",
      rule: "Expressões explicativas no meio da frase precisam de duas pausas.",
      memory: "Abriu explicação no meio do período? Feche antes de continuar a ideia principal.",
      reason: "Redações nota 1000 usam explicações, exemplos e detalhamentos sem quebrar a sintaxe do período.",
      sourceEssay: "Base ENEM: Lucas Rodrigues, Lauro de Freitas (BA), tema envelhecimento.",
      sourceExcerpt: "Padrão observado: intercalações como idade, exemplo ou detalhamento aparecem isoladas por vírgulas ou parênteses.",
      examples: [
        [
          "Base ENEM: Lucas intercala explicação sobre a composição do corpo político antes de retomar a consequência.",
          "Use a mesma lógica: O corpo político, distante da realidade da velhice, tende a negligenciar demandas específicas.",
          "A expressão do meio está isolada por duas vírgulas.",
          "Sem a segunda pausa, a frase fica truncada e perde C1.",
          "Regra para lembrar: <rule>",
        ],
        [
          "Base ENEM: textos de alta nota inserem exemplos sem abandonar a frase principal.",
          "Use assim: As unidades básicas, como espaços de cuidado preventivo, precisam atender idosos com equipes qualificadas.",
          "O exemplo aparece no meio, mas não atropela sujeito e verbo.",
          "A leitura continua limpa para o avaliador.",
          "Regra para lembrar: <rule>",
        ],
        [
          "Base ENEM: Laryssa usa detalhamentos para especificar lugares, leis e grupos afetados.",
          "Use assim: Muitos espaços públicos, inclusive mercados e centros comerciais, desrespeitam prioridades legais.",
          "A intercalação acrescenta precisão, não confusão.",
          "Se a pausa abriu, ela precisa fechar.",
          "Regra para lembrar: <rule>",
        ],
      ],
    },
    {
      id: "enem-periodo-controlado",
      title: "Período longo com comando",
      rule: "Em período longo, mantenha uma ideia central e conectores claros.",
      memory: "Frase nota 1000 pode ser longa; o que ela não pode é virar corredor sem placa.",
      reason: "O acervo ENEM mostra períodos extensos, mas com causa, consequência e retomadas bem marcadas.",
      sourceEssay: "Base ENEM: Clara de Oliveira e Marina Vieira Almeida Lima, tema herança africana.",
      sourceExcerpt: "Padrão observado: períodos maiores funcionam quando cada trecho tem função sintática nítida.",
      examples: [
        [
          "Base ENEM: Clara encadeia causa educacional e efeito social no mesmo período.",
          "Use assim: A abordagem escolar superficial limita o conhecimento histórico dos estudantes e, por consequência, favorece estereótipos.",
          "Há uma ideia central: o efeito da escola sobre a percepção social.",
          "O conector 'por consequência' guia a leitura.",
          "Regra para lembrar: <rule>",
        ],
        [
          "Base ENEM: Marina relaciona Estado, cultura e invisibilização sem trocar de assunto.",
          "Use assim: A omissão estatal reduz o alcance de manifestações culturais afro-brasileiras e amplia sua invisibilidade social.",
          "A frase tem dois verbos, mas o mesmo sujeito controla os dois.",
          "Isso evita período quebrado e melhora a fluidez da C1.",
          "Regra para lembrar: <rule>",
        ],
        [
          "Base ENEM: textos nota 1000 não empilham 'que, que, que' sem direção.",
          "Use assim: A ausência de políticas permanentes compromete a formação crítica e mantém práticas discriminatórias no cotidiano.",
          "A frase é direta, com sujeito, verbo e consequência.",
          "Se precisar de nova causa, abra outro período.",
          "Regra para lembrar: <rule>",
        ],
      ],
    },
  ],
  nota1000Essays: [
    {
      id: "modelo-2024-caio",
      year: "2024",
      theme: "Desafios para a valorização da herança africana no Brasil",
      student: "Caio Silva Braga",
      source: "Exemplo de alta performance anexado ao projeto",
      paragraphs: [
        "Em 'O Karaíba', Daniel Munduruku reconta a invasão europeia no Brasil a partir da ótica dos povos originários. Embora o foco da obra seja indígena, sua proposta evidencia como narrativas oficiais frequentemente apagam grupos fundamentais para a formação nacional. Nesse sentido, a herança africana, apesar de estruturar a cultura brasileira, ainda é subvalorizada por parte da sociedade.",
        "Em primeiro lugar, a permanência do racismo estrutural dificulta o reconhecimento efetivo das contribuições africanas. Isso ocorre porque a história ensinada e difundida em muitos espaços ainda privilegia perspectivas eurocêntricas, reduzindo a população negra à experiência da escravidão. Como consequência, manifestações religiosas, artísticas e linguísticas de matriz africana são tratadas de forma estereotipada ou marginalizada.",
        "Além disso, a baixa presença de políticas educativas contínuas impede que a valorização cultural ultrapasse datas comemorativas. A Lei 10.639, que tornou obrigatório o ensino de história e cultura afro-brasileira, representa avanço importante; contudo, sua aplicação irregular limita a formação crítica dos estudantes. Dessa forma, a escola deixa de cumprir plenamente seu papel de combater preconceitos e ampliar repertórios.",
        "Portanto, o Ministério da Educação deve fortalecer a implementação da Lei 10.639 nas redes de ensino, por meio da formação de professores, da distribuição de materiais didáticos produzidos por pesquisadores negros e do acompanhamento anual das escolas. Tal medida deve ocorrer em parceria com universidades públicas e movimentos culturais, a fim de garantir que a herança africana seja compreendida como elemento central da identidade brasileira.",
      ],
    },
    {
      id: "modelo-2024-generico",
      year: "2024",
      theme: "Valorização de matrizes culturais brasileiras",
      student: "Modelo editável de estudo",
      source: "Base inicial do ultimateENEM experience",
      paragraphs: [
        "A construção da identidade brasileira é resultado de múltiplas matrizes culturais, mas nem todas recebem o mesmo reconhecimento social. Nesse cenário, grupos historicamente marginalizados continuam tendo suas contribuições reduzidas ou folclorizadas. Tal realidade evidencia um obstáculo à cidadania cultural e exige enfrentamento educacional e institucional.",
        "Sob essa perspectiva, a escola possui papel central na superação da invisibilidade histórica. Quando o currículo apresenta a cultura popular apenas de modo superficial, o estudante não compreende os conflitos, os saberes e as resistências que formaram o país. Assim, a ausência de abordagem crítica contribui para a reprodução de preconceitos fora do ambiente escolar.",
        "Ademais, a mídia e os espaços culturais nem sempre democratizam a representação desses grupos. A concentração de prestígio em manifestações associadas às elites faz com que outras expressões artísticas sejam vistas como secundárias. Com isso, práticas culturais legítimas perdem financiamento, público e reconhecimento simbólico.",
        "Logo, secretarias de educação e cultura devem criar programas permanentes de valorização das matrizes culturais brasileiras, mediante editais, visitas pedagógicas, materiais didáticos e participação de mestres da cultura local. Essa ação deve priorizar escolas públicas e territórios periféricos, com a finalidade de ampliar o respeito à diversidade e fortalecer a memória coletiva.",
      ],
    },
    {
      id: "modelo-2025-estudo",
      year: "2025",
      theme: "Tema 2025 a preencher",
      student: "Redação nota 1000 editável",
      source: "Espaço reservado para novos anexos",
      paragraphs: [
        "Insira aqui a introdução original da redação nota 1000, mantendo tese, contextualização e recorte temático. O ideal é que este parágrafo apresente repertório pertinente e anuncie os dois eixos de desenvolvimento sem listar ideias soltas.",
        "Insira aqui o primeiro desenvolvimento, preservando tópico frasal, explicação, repertório e ligação direta com a tese. Observe se o parágrafo mostra causa, consequência e grupo afetado.",
        "Insira aqui o segundo desenvolvimento, mantendo progressão em relação ao parágrafo anterior. Verifique se há conectivo adequado, nova dimensão do problema e argumentação sem repetição.",
        "Insira aqui a conclusão, com proposta de intervenção completa: agente, ação, modo, finalidade e detalhamento. Confira se ela respeita direitos humanos e se responde ao problema discutido no texto.",
      ],
    },
  ],
};
const REDACTION_LIBRARY = mergeRedactionLibrary(DEFAULT_REDACTION_LIBRARY, window.REDACTION_DB);
const REDACAO_WEEK_COUNT = Math.ceil(DAY_COUNT / 7);
const REDACAO_SCORE_FIELDS = [
  { id: "c1", label: "C1", title: "Escrita formal" },
  { id: "c2", label: "C2", title: "Tema e repertório" },
  { id: "c3", label: "C3", title: "Argumentação" },
  { id: "c4", label: "C4", title: "Coesão" },
  { id: "c5", label: "C5", title: "Intervenção" },
];
const SKILL_ID_BY_TITLE = buildSkillTitleIndex();
const IMPORTED_QUESTIONS = Array.isArray(ENEM_DATA.questions) ? ENEM_DATA.questions : [];
const STRUCTURED_QUESTIONS = IMPORTED_QUESTIONS.filter(
  (question) =>
    question.status === "ativa" &&
    Array.isArray(question.options) &&
    question.options.length === 5 &&
    /^[A-E]$/.test(question.answer || ""),
);
const QUESTION_COUNTS_BY_AREA = buildQuestionCountsByArea();
const QUESTION_COUNTS_BY_SKILL = buildQuestionCountsBySkill();
const HIGH_FREQUENCY_SKILL_MAP = buildHighFrequencySkillMap();
const OFFICIAL_SKILL_FREQUENCY_DOCUMENT = window.HABILIDADES_FREQUENCIA_DATA || { areas: [] };
const INTERNAL_ENEM_INTELLIGENCE = window.ENEM_INTELLIGENCE_DATA || {};
const REAL_TRI_ACERTO_DATA = window.ENEM_TRI_ACERTO_DATA || {};
const NOTAS_ACERTOS_TRI_DATA = window.ENEM_NOTAS_ACERTOS_TRI_DATA || { rows: [] };
const LINGUAGENS_FOREIGN_LANGUAGE_SKILLS = new Set(["H05", "H06", "H07", "H08"]);
const FREQUENCY_TIER_LABELS = {
  high: "Muito cobrada",
  medium: "Cobrança média",
  low: "Pouco cobrada",
  unknown: "Incidência em revisão",
};
const PLAN = buildPlan();
const QUESTIONS = buildQuestionBank();
const QUESTION_BY_ID = buildQuestionIndex();

const app = document.getElementById("app");
let store = loadStore();
let activeView = isValidAppView(store.uiState?.activeView) ? store.uiState.activeView : "today";
let selectedDay = Number.isFinite(Number(store.uiState?.selectedDay)) ? Number(store.uiState.selectedDay) : null;
let authMode = "login";
let quizState = null;
let pendingScrollRestore = Number.isFinite(Number(store.uiState?.scrollY)) ? Number(store.uiState.scrollY) : null;
let shouldScrollTop = pendingScrollRestore === null;
let dailyNewsAutoFetchStarted = false;
let timer = {
  seconds: 50 * 60,
  running: false,
  mode: "Foco",
  intervalId: null,
};

function buildPlan() {
  return Array.from({ length: DAY_COUNT }, (_, index) => {
    const day = index + 1;
    const competency = COMPETENCIES[index % COMPETENCIES.length];
    const cycle = Math.floor(index / COMPETENCIES.length);
    const skill = competency.skills[cycle % competency.skills.length];
    const round = Math.floor(cycle / competency.skills.length) + 1;
    const phase = getPhase(day);

    return {
      day,
      competencyId: competency.id,
      competencyName: competency.name,
      competencyShort: competency.short,
      colorClass: competency.colorClass,
      skillId: skill.id,
      skillTitle: skill.title,
      focus: skill.focus,
      phase,
      round,
      tasks: [
        `Revisar ${skill.focus}.`,
        `Fazer um resumo ativo usando a ideia-chave: ${skill.core}.`,
        "Responder 5 questões e refazer o bloco até atingir 80%.",
      ],
    };
  });
}

function getPhase(day) {
  if (day <= 40) return "Fundação";
  if (day <= 80) return "Aplicação";
  if (day <= 104) return "Integração";
  return "Reta final";
}

function mergeRedactionLibrary(defaults, custom = {}) {
  return {
    repertories: [...defaults.repertories, ...(Array.isArray(custom.repertories) ? custom.repertories : [])],
    sourcePacks: [...defaults.sourcePacks, ...(Array.isArray(custom.sourcePacks) ? custom.sourcePacks : [])],
    rubricAlerts: [...defaults.rubricAlerts, ...(Array.isArray(custom.rubricAlerts) ? custom.rubricAlerts : [])],
    authorCrossovers: [
      ...defaults.authorCrossovers,
      ...(Array.isArray(custom.authorCrossovers) ? custom.authorCrossovers : []),
    ],
    competencyExamples: [
      ...defaults.competencyExamples,
      ...(Array.isArray(custom.competencyExamples) ? custom.competencyExamples : []),
    ],
    c1Tips: [...defaults.c1Tips, ...(Array.isArray(custom.c1Tips) ? custom.c1Tips : [])],
    nota1000Essays: [
      ...defaults.nota1000Essays,
      ...(Array.isArray(custom.nota1000Essays) ? custom.nota1000Essays : []),
    ],
    premiumTopicPacks: Array.isArray(custom.premiumTopicPacks) ? custom.premiumTopicPacks : [],
    themeArchive: Array.isArray(custom.themeArchive) ? custom.themeArchive : [],
    themePatternAnalysis: custom.themePatternAnalysis || {},
  };
}

function pickRandomItems(items, count) {
  const pool = [...(items || [])];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }
  return pool.slice(0, count);
}

function buildSkillTitleIndex() {
  const index = {};
  COMPETENCIES.forEach((competency) => {
    competency.skills.forEach((skill) => {
      index[skill.title] = skill.id;
    });
  });
  return index;
}

function buildQuestionCountsByArea() {
  return STRUCTURED_QUESTIONS.reduce((counts, question) => {
    counts[question.competencyId] = (counts[question.competencyId] || 0) + 1;
    return counts;
  }, {});
}

function buildQuestionCountsBySkill() {
  return STRUCTURED_QUESTIONS.reduce((counts, question) => {
    const skillId = SKILL_ID_BY_TITLE[question.skill] || getFallbackSkillId(question.competencyId);
    counts[skillId] = (counts[skillId] || 0) + 1;
    return counts;
  }, {});
}

function buildHighFrequencySkillMap() {
  return COMPETENCIES.map((competency) => {
    const areaTotal = QUESTION_COUNTS_BY_AREA[competency.id] || 0;
    const skills = competency.skills
      .map((skill) => {
        const count = QUESTION_COUNTS_BY_SKILL[skill.id] || 0;
        const recurrence = areaTotal ? Math.round((count / areaTotal) * 1000) / 10 : 0;
        return {
          competency,
          skill,
          count,
          recurrence,
          priority:
            recurrence >= 18
              ? "Alta incidência"
              : recurrence >= 10
                ? "Incidência média"
                : count
                  ? "Aparece na base"
                  : "Aguardando itens",
        };
      })
      .sort((a, b) => b.count - a.count || a.skill.title.localeCompare(b.skill.title, "pt-BR"));
    const top = skills[0];
    return {
      competency,
      areaTotal,
      skills,
      topSkill: top?.skill?.title || "sem dados suficientes",
      topRecurrence: top?.recurrence || 0,
    };
  });
}

function getSkillRecurrence(skillId, areaId) {
  const areaTotal = QUESTION_COUNTS_BY_AREA[areaId] || 0;
  if (!areaTotal) return 0;
  return Math.round(((QUESTION_COUNTS_BY_SKILL[skillId] || 0) / areaTotal) * 1000) / 10;
}

function getQuestionFrequencyProfile(question, skillId = "") {
  const official = getOfficialFrequencyProfile(question.competencyId, question.matrixSkillCode);
  const strategic = getSkillIntelligenceProfile(skillId, question.competencyId, question.matrixSkillCode);
  if (official.tier !== "unknown") return applyInternalIntelligenceToFrequency(official, strategic);
  return applyInternalIntelligenceToFrequency(getLocalSkillFrequencyProfile(skillId, question.competencyId), strategic);
}

function getOfficialFrequencyProfile(areaId, skillCode) {
  const normalizedCode = normalizeSkillCode(skillCode);
  if (!normalizedCode) return createFrequencyProfile("unknown", "sem código oficial", 0);
  if (areaId === "linguagens" && LINGUAGENS_FOREIGN_LANGUAGE_SKILLS.has(normalizedCode)) {
    return createFrequencyProfile("low", "língua estrangeira fora do treino", 0, { excluded: true });
  }

  const area = getOfficialFrequencyArea(areaId);
  if (!area) return createFrequencyProfile("unknown", "área sem régua oficial", 0);

  const regular = getDisplayFrequencyRows(area, "regularApplication2015_2025").find((row) => row.skill === normalizedCode);
  const recent = getDisplayFrequencyRows(area, "recentRegular2025").find((row) => row.skill === normalizedCode);
  const broad = getDisplayFrequencyRows(area, "operationalBroad2015_2025").find((row) => row.skill === normalizedCode);

  if (regular) {
    if (regular.rank <= 5) {
      return createFrequencyProfile("high", "prioridade forte na 1ª aplicação", regular.total, {
        rank: regular.rank,
        competency: regular.competency,
        description: regular.description,
      });
    }
    return createFrequencyProfile("medium", "prioridade média na 1ª aplicação", regular.total, {
      rank: regular.rank,
      competency: regular.competency,
      description: regular.description,
    });
  }

  if (recent && recent.count >= 5) {
    return createFrequencyProfile("medium", "habilidade emergente no recorte recente", recent.count, {
      competency: recent.competency,
      description: recent.description,
    });
  }

  if (broad) {
    return createFrequencyProfile("medium", "presença histórica relevante", broad.total, {
      rank: broad.rank,
      competency: broad.competency,
      description: broad.description,
    });
  }

  return createFrequencyProfile("low", "fora do topo operacional", 0);
}

function getOfficialFrequencyArea(areaId) {
  const areas = Array.isArray(OFFICIAL_SKILL_FREQUENCY_DOCUMENT.areas)
    ? OFFICIAL_SKILL_FREQUENCY_DOCUMENT.areas
    : [];
  return areas.find((area) => area.id === areaId) || null;
}

function normalizeSkillCode(skillCode) {
  const match = String(skillCode || "").toUpperCase().match(/H\d{2}/);
  return match ? match[0] : "";
}

function getRealTriSkillProfile(areaId = "", skillCode = "") {
  const code = normalizeSkillCode(skillCode);
  if (!code) return null;
  const byArea = REAL_TRI_ACERTO_DATA.byAreaSkill || {};
  return byArea[areaId]?.[code] || null;
}

function getRealTriDifficultyParameter(profile) {
  const difficulty = profile?.dominantTriDifficulty || profile?.realTriDominantDifficulty || "";
  if (!difficulty) return null;
  const proficiency = profile.estimatedProficiency || profile.realTriEstimatedProficiency || {
    "Fácil": "400-500",
    "Média": "500-600",
    "Difícil": "600-700",
    "Muito Difícil": "700-800+",
  }[difficulty];
  return proficiency ? { difficulty, proficiency } : null;
}

function getLocalSkillFrequencyProfile(skillId, areaId) {
  const recurrence = getSkillRecurrence(skillId, areaId);
  if (recurrence >= 18) return createFrequencyProfile("high", "alta presença no banco local", recurrence);
  if (recurrence >= 10) return createFrequencyProfile("medium", "presença média no banco local", recurrence);
  if (recurrence > 0) return createFrequencyProfile("low", "baixa presença no banco local", recurrence);
  return createFrequencyProfile("unknown", "incidência aguardando questões", 0);
}

function getSkillIntelligenceProfile(skillId = "", areaId = "", skillCode = "") {
  const skillProfiles = INTERNAL_ENEM_INTELLIGENCE.skillProfiles || {};
  const matrixAdjustments = INTERNAL_ENEM_INTELLIGENCE.matrixSkillAdjustments || {};
  const bySkill = skillProfiles[skillId] || null;
  const code = normalizeSkillCode(skillCode);
  const byMatrix = code ? matrixAdjustments[areaId]?.[code] || null : null;
  const byRealTri = getRealTriSkillProfile(areaId, code);
  if (!bySkill && !byMatrix && !byRealTri) return null;
  const levels = INTERNAL_ENEM_INTELLIGENCE.strategicLevels || {};
  const level = byMatrix?.level || bySkill?.level || byRealTri?.level || "highFrequency";
  const levelMeta = levels[level] || {};
  return {
    ...levelMeta,
    ...(byRealTri || {}),
    ...(bySkill || {}),
    ...(byMatrix || {}),
    level,
    skillId,
    areaId,
    skillCode: code,
  };
}

function applyInternalIntelligenceToFrequency(profile, strategic) {
  if (!strategic || profile.excluded) return profile;
  const tierRank = { unknown: 0, low: 1, medium: 2, high: 3 };
  const strategicTier =
    strategic.frequencyTier ||
    (strategic.level === "decline"
      ? "low"
      : strategic.level === "emerging"
        ? "medium"
        : ["essential", "highFrequency", "medicineCritical"].includes(strategic.level)
          ? "high"
          : profile.tier);
  const tier =
    strategic.level === "decline"
      ? "low"
      : tierRank[strategicTier] > tierRank[profile.tier]
        ? strategicTier
        : profile.tier;
  const source =
    strategic.level === "decline"
      ? "nível 5 interno: estudar sem comandar planejamento"
      : `${strategic.label || "régua interna ENEM Medicina"} + ${profile.source}`;
  const realAccuracy = strategic.realAccuracy || {};

  return createFrequencyProfile(tier, source, Math.max(Number(profile.score || 0), Number(strategic.priority || 0)), {
    ...profile,
    tier,
    strategicLevel: strategic.level,
    strategicLabel: strategic.label,
    strategicNote: strategic.note || strategic.rationale || "",
    medicineCritical: Boolean(strategic.medicineCritical),
    beginnerCore: Boolean(strategic.beginnerCore),
    realMedicineScore: strategic.medicineScore,
    realMedicineLevel: strategic.medicineLevel,
    realTrend: strategic.trend,
    realRankInArea: strategic.rankInArea,
    realHistoricalPercent: strategic.historicalPercent,
    realRecentPercent: strategic.percent2023_2025,
    realDeltaPp: strategic.deltaPp,
    realTriDominantDifficulty: strategic.dominantTriDifficulty,
    realTriDifficultyDistribution: strategic.triDifficultyDistribution,
    realTriEstimatedProficiency: strategic.estimatedProficiency,
    realTriParameterSummary: strategic.triParameterSummary,
    realTriEstimatedDiscrimination: strategic.estimatedDiscrimination,
    realTriEstimatedCasual: strategic.estimatedCasual,
    realAccuracy,
    realAccuracyItems: realAccuracy.itemsWithPercentCorrect,
    realAvgPercentCorrect: realAccuracy.avgPercentCorrect ?? strategic.triParameterSummary?.avgPercentCorrect,
    realMedianPercentCorrect: realAccuracy.medianPercentCorrect,
    realAccuracyPriorityIndex: realAccuracy.triPriorityIndex,
  });
}

function createFrequencyProfile(tier, source, score = 0, extra = {}) {
  return {
    tier,
    label: FREQUENCY_TIER_LABELS[tier] || FREQUENCY_TIER_LABELS.unknown,
    source,
    score,
    ...extra,
  };
}

function getFrequencyTierWeight(tier) {
  if (tier === "high") return 100;
  if (tier === "medium") return 62;
  if (tier === "low") return 28;
  return 42;
}

function getEstimatedDifficulty(question) {
  const seed = Number(question.number || 0) || hashString(question.id || question.text || "");
  const bucket = seed % 10;
  if (bucket <= 2) return "easy";
  if (bucket <= 7) return "medium";
  return "hard";
}

function hashString(value) {
  return String(value)
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
}

function buildQuestionBank() {
  const bank = {};
  const fallbacks = {};
  COMPETENCIES.forEach((competency) => {
    competency.skills.forEach((skill) => {
      bank[skill.id] = [];
      fallbacks[skill.id] = [
        {
          id: `${skill.id}-q1`,
          text: `Em uma questão de ${skill.title}, qual atitude mostra melhor domínio da habilidade?`,
          options: [
            `Usar ${skill.core} para justificar a alternativa escolhida.`,
            "Procurar uma palavra parecida nas opções e marcar rapidamente.",
            "Escolher a alternativa mais longa, pois costuma ser a mais completa.",
            "Ignorar o comando e resolver apenas pelo tema geral.",
          ],
          answer: 0,
          explanation: `O domínio aparece quando o aluno usa a habilidade central: ${skill.core}.`,
        },
        {
          id: `${skill.id}-q2`,
          text: `Qual erro deve acender alerta imediato ao estudar ${skill.title}?`,
          options: [
            "Registrar o motivo do erro no caderno de revisão.",
            `Cair no padrão de erro: ${skill.trap}.`,
            "Voltar ao texto-base antes de marcar a opção.",
            "Conferir unidade, escala ou contexto quando aparecem dados.",
          ],
          answer: 1,
          explanation: `Esse é o desvio mais provável nessa habilidade: ${skill.trap}.`,
        },
        {
          id: `${skill.id}-q3`,
          text: `Ao errar uma questão dessa habilidade, qual revisão tem maior impacto no dia seguinte?`,
          options: [
            "Copiar a resolução pronta e seguir para outro assunto.",
            "Marcar a resposta correta sem reprocessar o raciocínio.",
            `Refazer sem consulta usando esta pista: ${skill.cue}.`,
            "Trocar imediatamente de matéria para evitar cansaço.",
          ],
          answer: 2,
          explanation: `A revisão ativa deve forçar o raciocínio. A pista certa aqui é: ${skill.cue}.`,
        },
        {
          id: `${skill.id}-q4`,
          text: `Se o enunciado mistura texto, tabela ou gráfico com ${skill.title}, qual sequência é mais segura?`,
          options: [
            "Ler alternativas, escolher por eliminação estética e conferir depois.",
            "Resolver primeiro por memória e usar os dados apenas se sobrar tempo.",
            "Pular o comando para ganhar velocidade na primeira leitura.",
            "Ler o comando, localizar os dados úteis, conferir unidades e só então comparar opções.",
          ],
          answer: 3,
          explanation: "Questões integradas costumam punir pressa. Comando, dados e unidades vêm antes das opções.",
        },
        {
          id: `${skill.id}-q5`,
          text: `Na meta diária de ${skill.title}, quando o aluno deve considerar o bloco aprovado?`,
          options: [
            "Quando acertar pelo menos 4 das 5 questões e entender os erros cometidos.",
            "Quando terminar as 5 questões, mesmo com muitos erros.",
            "Quando acertar só as questões fáceis e pular as difíceis.",
            "Quando revisar a teoria por mais tempo, sem testar por questões.",
          ],
          answer: 0,
          explanation: "A regra do app é 80%: em 5 questões, o mínimo é 4 acertos.",
        },
      ];
    });
  });

  STRUCTURED_QUESTIONS.forEach((question) => {
    const skillId = SKILL_ID_BY_TITLE[question.skill] || getFallbackSkillId(question.competencyId);
    if (!bank[skillId]) return;
    const frequencyProfile = getQuestionFrequencyProfile(question, skillId);
    bank[skillId].push({
      id: question.id,
      text: `${question.source} | Questão ${question.number}`,
      options: question.options,
      answer: "ABCDE".indexOf(question.answer),
      explanation: question.explanation || `Gabarito oficial: ${question.answer}. Fonte: ${question.source}.`,
      source: question.source,
      number: question.number,
      area: question.area,
      competencyId: question.competencyId,
      skillId,
      skillTitle: question.skill,
      matrixCompetencyCode: question.matrixCompetencyCode,
      matrixCompetencyDescription: question.matrixCompetencyDescription,
      matrixSkillCode: question.matrixSkillCode,
      matrixSkillDescription: question.matrixSkillDescription,
      matrixLinkConfidence: question.matrixLinkConfidence,
      recurrence: getSkillRecurrence(skillId, question.competencyId),
      difficulty: getEstimatedDifficulty(question),
      pageNumber: question.pageNumber,
      pdfUrl: question.pdfUrl,
      pdfFileUrl: question.pdfFileUrl,
      cropImage: question.cropImage,
      stimulusImage: question.stimulusImage,
      visualSourceType: question.visualSourceType,
      visualSourceLabel: question.visualSourceLabel,
      extractedStem: question.stem,
      extractedOptions: question.extractedOptions,
      hasReliableOptions: question.hasReliableOptions,
      transcriptionStatus: question.transcriptionStatus,
      officialAnswer: question.officialAnswer,
      resolvedAnswer: question.resolvedAnswer,
      pedagogicalComment: question.pedagogicalComment,
      alternativesAnalysis: question.alternativesAnalysis,
      cognitiveAxis: question.cognitiveAxis,
      correctionSheet: question.correctionSheet,
      frequencyTier: frequencyProfile.tier,
      frequencyLabel: frequencyProfile.label,
      frequencySource: frequencyProfile.source,
      frequencyScore: frequencyProfile.score,
      frequencyRank: frequencyProfile.rank,
      frequencyExcluded: Boolean(frequencyProfile.excluded),
      strategicLevel: frequencyProfile.strategicLevel,
      strategicLabel: frequencyProfile.strategicLabel,
      strategicNote: frequencyProfile.strategicNote,
      medicineCritical: Boolean(frequencyProfile.medicineCritical),
      beginnerCore: Boolean(frequencyProfile.beginnerCore),
      realMedicineScore: frequencyProfile.realMedicineScore,
      realMedicineLevel: frequencyProfile.realMedicineLevel,
      realTrend: frequencyProfile.realTrend,
      realRankInArea: frequencyProfile.realRankInArea,
      realHistoricalPercent: frequencyProfile.realHistoricalPercent,
      realRecentPercent: frequencyProfile.realRecentPercent,
      realDeltaPp: frequencyProfile.realDeltaPp,
      realTriDominantDifficulty: frequencyProfile.realTriDominantDifficulty,
      realTriDifficultyDistribution: frequencyProfile.realTriDifficultyDistribution,
      realTriEstimatedProficiency: frequencyProfile.realTriEstimatedProficiency,
      realTriParameterSummary: frequencyProfile.realTriParameterSummary,
      realTriEstimatedDiscrimination: frequencyProfile.realTriEstimatedDiscrimination,
      realTriEstimatedCasual: frequencyProfile.realTriEstimatedCasual,
      realAccuracy: frequencyProfile.realAccuracy,
      realAccuracyItems: frequencyProfile.realAccuracyItems,
      realAvgPercentCorrect: frequencyProfile.realAvgPercentCorrect,
      realMedianPercentCorrect: frequencyProfile.realMedianPercentCorrect,
      realAccuracyPriorityIndex: frequencyProfile.realAccuracyPriorityIndex,
      imported: true,
    });
  });

  Object.keys(bank).forEach((skillId) => {
    if (bank[skillId].length < 5) {
      bank[skillId] = [...bank[skillId], ...fallbacks[skillId]].slice(0, 5);
    }
    const skill = findSkillById(skillId);
    bank[skillId] = bank[skillId].map((question) => {
      const competencyId = question.competencyId || findCompetencyBySkillId(skillId)?.id || "linguagens";
      const localFrequency = getLocalSkillFrequencyProfile(skillId, competencyId);
      return {
        ...question,
        skillId,
        skillTitle: question.skillTitle || skill?.title || "Habilidade",
        competencyId,
        matrixCompetencyCode: question.matrixCompetencyCode,
        matrixCompetencyDescription: question.matrixCompetencyDescription,
        matrixSkillCode: question.matrixSkillCode,
        matrixSkillDescription: question.matrixSkillDescription,
        matrixLinkConfidence: question.matrixLinkConfidence,
        recurrence: question.recurrence ?? getSkillRecurrence(skillId, competencyId),
        difficulty: question.difficulty || "easy",
        frequencyTier: question.frequencyTier || localFrequency.tier,
        frequencyLabel: question.frequencyLabel || localFrequency.label,
        frequencySource: question.frequencySource || localFrequency.source,
        frequencyScore: question.frequencyScore ?? localFrequency.score,
        frequencyRank: question.frequencyRank,
        frequencyExcluded: Boolean(question.frequencyExcluded),
        strategicLevel: question.strategicLevel,
        strategicLabel: question.strategicLabel,
        strategicNote: question.strategicNote,
        medicineCritical: Boolean(question.medicineCritical),
        beginnerCore: Boolean(question.beginnerCore),
        realMedicineScore: question.realMedicineScore,
        realMedicineLevel: question.realMedicineLevel,
        realTrend: question.realTrend,
        realRankInArea: question.realRankInArea,
        realHistoricalPercent: question.realHistoricalPercent,
        realRecentPercent: question.realRecentPercent,
        realDeltaPp: question.realDeltaPp,
        realTriDominantDifficulty: question.realTriDominantDifficulty,
        realTriDifficultyDistribution: question.realTriDifficultyDistribution,
        realTriEstimatedProficiency: question.realTriEstimatedProficiency,
        realTriParameterSummary: question.realTriParameterSummary,
        realTriEstimatedDiscrimination: question.realTriEstimatedDiscrimination,
        realTriEstimatedCasual: question.realTriEstimatedCasual,
        realAccuracy: question.realAccuracy,
        realAccuracyItems: question.realAccuracyItems,
        realAvgPercentCorrect: question.realAvgPercentCorrect,
        realMedianPercentCorrect: question.realMedianPercentCorrect,
        realAccuracyPriorityIndex: question.realAccuracyPriorityIndex,
      };
    });
  });

  return bank;
}

function buildQuestionIndex() {
  return Object.values(QUESTIONS).reduce((index, questions) => {
    questions.forEach((question) => {
      index[question.id] = question;
    });
    return index;
  }, {});
}

function getFallbackSkillId(competencyId) {
  const competency = COMPETENCIES.find((item) => item.id === competencyId) || COMPETENCIES[0];
  return competency.skills[0].id;
}

function findSkillById(skillId) {
  for (const competency of COMPETENCIES) {
    const skill = competency.skills.find((item) => item.id === skillId);
    if (skill) return skill;
  }
  return null;
}

function findCompetencyBySkillId(skillId) {
  return COMPETENCIES.find((competency) => competency.skills.some((skill) => skill.id === skillId)) || null;
}

function loadStore() {
  try {
    if (typeof localStorage === "undefined") return { users: {}, sessionEmail: "" };
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return parsed && parsed.users ? parsed : { users: {}, sessionEmail: "" };
  } catch {
    return { users: {}, sessionEmail: "" };
  }
}

function isValidAppView(view) {
  return APP_VIEWS.includes(String(view || ""));
}

function saveStore() {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    }
  } catch (error) {
    console.warn("Não foi possível salvar os dados locais do app.", error);
  }
}

function persistUiState(options = {}) {
  const scrollY = Number.isFinite(Number(options.scrollY))
    ? Number(options.scrollY)
    : Math.max(window.scrollY || 0, document.documentElement?.scrollTop || 0, document.body?.scrollTop || 0);
  store.uiState = {
    ...(store.uiState || {}),
    activeView: isValidAppView(activeView) ? activeView : "today",
    selectedDay: selectedDay || null,
    scrollY: Math.max(0, Math.round(scrollY)),
    updatedAt: new Date().toISOString(),
  };
  saveStore();
}

function getCurrentUser() {
  return store.sessionEmail ? store.users[store.sessionEmail] : null;
}

function saveCurrentUser(user) {
  store.users[user.email] = user;
  saveStore();
}

async function hashPassword(password) {
  if (!window.crypto?.subtle) return btoa(unescape(encodeURIComponent(password)));
  const encoded = new TextEncoder().encode(password);
  const buffer = await window.crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function daysSince(dateString) {
  const start = new Date(`${dateString}T00:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(1, Math.floor((today - start) / 86400000) + 1);
}

function getCompletedDays(user) {
  return Object.values(user.progress || {}).filter((day) => day.passed).length;
}

function getUnlockedDay(user) {
  let next = 1;
  while (next <= DAY_COUNT && user.progress?.[next]?.passed) next += 1;
  return clamp(next, 1, DAY_COUNT);
}

function getTargetDay(user) {
  const calendarDay = clamp(daysSince(user.startDate), 1, DAY_COUNT);
  const unlockedDay = getUnlockedDay(user);
  return clamp(Math.min(calendarDay, unlockedDay), 1, DAY_COUNT);
}

function getDayStatus(user, day) {
  if (user.progress?.[day]?.passed) return "done";
  if (day <= getUnlockedDay(user)) return "available";
  return "locked";
}

function getCurrentMission(user, day) {
  const level = classifyStudent(user);
  const record = getMissionRecord(user, day);
  record.assignments = record.assignments || {};
  return MISSION_AREAS.map((areaId) => {
    const competency = COMPETENCIES.find((item) => item.id === areaId);
    const savedSkillId = record.assignments[areaId]?.skillId;
    const skill = savedSkillId
      ? competency.skills.find((item) => item.id === savedSkillId) || selectPrioritySkill(user, competency, level)
      : selectPrioritySkill(user, competency, level);
    record.assignments[areaId] = record.assignments[areaId] || {
      skillId: skill.id,
      createdAt: new Date().toISOString(),
    };
    const questions = selectMissionQuestions(user, skill.id, day, areaId, level.id);
    const clinicalCase = getMedicalCase(areaId, level.id, day, skill.id);
    return {
      areaId,
      competency,
      skill,
      clinicalCase,
      questions,
      recurrence: getSkillRecurrence(skill.id, areaId),
      priority: calculateSkillPriority(user, areaId, skill.id, level.id),
      progress: getMissionBlock(user, day, areaId),
    };
  });
}

function getMissionRecord(user, day) {
  user.dailyMissions = user.dailyMissions || {};
  user.dailyMissions[day] = user.dailyMissions[day] || {
    blocks: {},
    selfPerception: "",
    restChecked: false,
    completedAt: "",
  };
  return user.dailyMissions[day];
}

function getMissionBlock(user, day, areaId) {
  return getMissionRecord(user, day).blocks[areaId] || {
    passed: false,
    bestScore: 0,
    attempts: 0,
    corrected: false,
  };
}

function isMissionComplete(user, day) {
  const mission = getMissionRecord(user, day);
  const blocksDone = MISSION_AREAS.every((areaId) => mission.blocks[areaId]?.passed);
  return blocksDone && Boolean(mission.selfPerception) && Boolean(mission.restChecked);
}

function getMissionCompletion(user, day) {
  const mission = getMissionRecord(user, day);
  const completedBlocks = MISSION_AREAS.filter((areaId) => mission.blocks[areaId]?.passed).length;
  return {
    completedBlocks,
    totalBlocks: MISSION_AREAS.length,
    questionsDone: completedBlocks * DAILY_REQUIRED_BY_AREA,
    complete: isMissionComplete(user, day),
  };
}

function classifyStudent(user) {
  const attempts = user.attemptLog || [];
  if (attempts.length < 4) {
    return {
      id: "iniciante",
      ...LEVEL_RULES.iniciante,
      reason: "histórico insuficiente para diagnóstico fino",
    };
  }

  const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const totalQuestions = attempts.reduce((sum, attempt) => sum + (attempt.total || 5), 0);
  const overall = totalQuestions ? Math.round((totalScore / totalQuestions) * 100) : 0;
  const easyStats = getDifficultyStats(user, "easy");
  const easyAccuracy = easyStats.total ? Math.round((easyStats.correct / easyStats.total) * 100) : 0;

  if (overall < 50 || easyAccuracy < 80) {
    return {
      id: "iniciante",
      ...LEVEL_RULES.iniciante,
      reason: overall < 50 ? "acerto geral abaixo de 50%" : "acerto nas fáceis abaixo de 80%",
    };
  }

  if (overall >= 75 && easyAccuracy >= 80) {
    return {
      id: "avancado",
      ...LEVEL_RULES.avancado,
      reason: "acerto geral acima de 75% e base fácil consolidada",
    };
  }

  return {
    id: "mediano",
    ...LEVEL_RULES.mediano,
    reason: "base parcial com lacunas prioritárias abaixo de 80%",
  };
}

function getDifficultyStats(user, difficulty) {
  const results = (user.attemptLog || []).flatMap((attempt) => attempt.questionResults || []);
  return results.reduce(
    (stats, result) => {
      if (result.difficulty !== difficulty) return stats;
      stats.total += 1;
      if (result.correct) stats.correct += 1;
      return stats;
    },
    { total: 0, correct: 0 },
  );
}

function selectPrioritySkill(user, competency, level) {
  const ranked = competency.skills
    .map((skill) => ({
      skill,
      score: calculateSkillPriority(user, competency.id, skill.id, level.id),
    }))
    .sort((a, b) => b.score - a.score);
  const readyWithImportedQuestions = ranked.find((item) => getImportedQuestionCount(item.skill.id) >= DAILY_REQUIRED_BY_AREA);
  return readyWithImportedQuestions?.skill || ranked[0]?.skill || competency.skills[0];
}

function getImportedQuestionCount(skillId) {
  return (QUESTIONS[skillId] || []).filter((question) => question.imported).length;
}

function calculateSkillPriority(user, areaId, skillId, levelId) {
  const accuracy = getSkillAccuracy(user, skillId);
  const lowPerformance = accuracy === null ? 72 : 100 - accuracy;
  const recurrence = getSkillRecurrence(skillId, areaId);
  const incidence = getSkillIncidenceScore(skillId, areaId, levelId);
  const difficultyFit = getDifficultyFitScore(levelId, skillId);
  const recentError = hasRecentError(user, skillId) ? 100 : 0;
  const strategic = getStrategicSkillPriorityScore(getSkillIntelligenceProfile(skillId, areaId), levelId);
  return Math.round(lowPerformance * 0.26 + incidence * 0.3 + recurrence * 0.08 + difficultyFit * 0.1 + recentError * 0.1 + strategic * 0.16);
}

function getStrategicSkillPriorityScore(profile, levelId) {
  if (!profile) return 45;
  const level = profile.level || "highFrequency";
  const defaults = {
    essential: { iniciante: 100, mediano: 96, avancado: 92 },
    highFrequency: { iniciante: 92, mediano: 90, avancado: 84 },
    medicineCritical: { iniciante: 78, mediano: 92, avancado: 100 },
    emerging: { iniciante: 42, mediano: 70, avancado: 86 },
    decline: { iniciante: 8, mediano: 18, avancado: 32 },
  };
  return Number(profile.priority || defaults[level]?.[levelId] || defaults.highFrequency[levelId] || 55);
}

function getSkillIncidenceScore(skillId, areaId, levelId) {
  const imported = (QUESTIONS[skillId] || []).filter((question) => question.imported && !question.frequencyExcluded);
  if (!imported.length) return getFrequencyTierWeight(getLocalSkillFrequencyProfile(skillId, areaId).tier);

  const high = imported.filter((question) => question.frequencyTier === "high").length;
  const medium = imported.filter((question) => question.frequencyTier === "medium").length;
  const low = imported.filter((question) => question.frequencyTier === "low").length;
  const total = imported.length || 1;

  if (levelId === "iniciante") {
    return Math.round(((high * 100 + medium * 45 + low * 10) / total) * 10) / 10;
  }
  if (levelId === "avancado") {
    return Math.round(((high * 88 + medium * 76 + low * 72) / total) * 10) / 10;
  }
  return Math.round(((high * 88 + medium * 82 + low * 46) / total) * 10) / 10;
}

function getSkillAccuracy(user, skillId) {
  const attempts = (user.attemptLog || []).filter((attempt) => attempt.skillId === skillId);
  if (!attempts.length) return null;
  const score = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const total = attempts.reduce((sum, attempt) => sum + (attempt.total || 5), 0);
  return total ? Math.round((score / total) * 100) : null;
}

function hasRecentError(user, skillId) {
  return [...(user.attemptLog || [])]
    .reverse()
    .slice(0, 12)
    .some((attempt) => attempt.skillId === skillId && attempt.score < (attempt.total || 5));
}

function getDifficultyFitScore(levelId, skillId) {
  const pool = QUESTIONS[skillId] || [];
  if (!pool.length) return 50;
  const preferred = getPrimaryDifficulty(levelId);
  const matches = pool.filter((question) => question.difficulty === preferred).length;
  return Math.round((matches / pool.length) * 100);
}

function getPrimaryDifficulty(levelId) {
  if (levelId === "avancado") return "hard";
  if (levelId === "mediano") return "medium";
  return "easy";
}

function getMedicalCase(areaId, levelId, day, skillId = "") {
  const difficulty = getPrimaryDifficulty(levelId);
  const fallback = MEDICAL_CASES[difficulty]?.natureza || MEDICAL_CASES.easy.natureza;
  const cases = MEDICAL_CASES[difficulty]?.[areaId] || fallback;
  const index = Math.abs(day + hashString(areaId + skillId)) % cases.length;
  return {
    ...cases[index],
    difficulty,
  };
}

function selectMissionQuestions(user, skillId, day, areaId, levelId) {
  const pool = QUESTIONS[skillId] || [];
  const mix = LEVEL_RULES[levelId].mix;
  const targets = getQuestionTargets(mix);
  const chosen = [];
  const used = new Set();
  const previous = getMissionRecord(user, day).blocks?.[areaId] || {};
  const attemptSeed = previous.passed ? 0 : Number(previous.attempts || 0);
  const recentIds = previous.passed ? new Set() : new Set(previous.lastQuestionIds || []);

  Object.entries(targets).forEach(([difficulty, count]) => {
    const candidates = getQuestionCandidatesForLevel(pool, difficulty, levelId);
    const matches = prioritizeFreshQuestions(
      orderQuestionsForLevel(
        rotateQuestions(candidates, day + hashString(areaId) + attemptSeed * 31),
        levelId,
      ),
      recentIds,
      count,
    );
    matches.slice(0, count).forEach((question) => {
      chosen.push(question);
      used.add(question.id);
    });
  });

  prioritizeFreshQuestions(
    orderQuestionsForLevel(
      rotateQuestions(pool.filter((question) => !question.frequencyExcluded), day + hashString(skillId) + attemptSeed * 47),
      levelId,
    ),
    recentIds,
    DAILY_REQUIRED_BY_AREA,
  ).forEach((question) => {
    if (chosen.length >= DAILY_REQUIRED_BY_AREA) return;
    if (used.has(question.id)) return;
    chosen.push(question);
    used.add(question.id);
  });

  return chosen.slice(0, DAILY_REQUIRED_BY_AREA);
}

function getQuestionCandidatesForLevel(pool, difficulty, levelId) {
  const byDifficulty = pool.filter((question) => question.difficulty === difficulty && !question.frequencyExcluded);
  if (levelId !== "iniciante") return byDifficulty;

  const highIncidence = byDifficulty.filter((question) => question.frequencyTier === "high" || question.beginnerCore);
  if (highIncidence.length >= DAILY_REQUIRED_BY_AREA) return highIncidence;
  return byDifficulty;
}

function orderQuestionsForLevel(list, levelId) {
  return list
    .map((question, index) => ({
      question,
      index,
      score: getQuestionSelectionScore(question, levelId),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.question);
}

function getQuestionSelectionScore(question, levelId) {
  const frequencyWeight = getFrequencyTierWeight(question.frequencyTier);
  const difficultyWeights = {
    iniciante: { easy: 100, medium: 12, hard: 0 },
    mediano: { easy: 78, medium: 100, hard: 38 },
    avancado: { easy: 92, medium: 95, hard: 100 },
  };
  const levelWeights = difficultyWeights[levelId] || difficultyWeights.iniciante;
  const difficultyWeight = levelWeights[question.difficulty] ?? 50;
  const rareBonus = levelId === "avancado" && question.frequencyTier === "low" ? 18 : 0;
  const highBaseBonus = question.difficulty === "easy" && question.frequencyTier === "high" ? 12 : 0;
  const strategic = getSkillIntelligenceProfile(question.skillId, question.competencyId, question.matrixSkillCode);
  const strategicBonus = (getStrategicSkillPriorityScore(strategic, levelId) - 50) * 0.22;
  const bniQualityBonus = getBniItemQualityBonus(question) * 0.18;
  const realMedicineScore = Math.min(Number(question.realMedicineScore || strategic?.medicineScore || 0), 130);
  const realMedicineBonus = realMedicineScore * 0.04;
  return frequencyWeight * 0.48 + difficultyWeight * 0.32 + rareBonus + highBaseBonus + strategicBonus + bniQualityBonus + realMedicineBonus;
}

function getBniItemQualityBonus(question) {
  const weights = INTERNAL_ENEM_INTELLIGENCE.bniItemModel?.qualitySignals || {};
  let score = 0;
  if (question.matrixSkillCode) score += weights.matrixLinked || 0;
  if (question.hasReliableOptions || question.imported) score += weights.reliableOptions || 0;
  if (question.cropImage || question.stimulusImage || question.visualSourceType) score += weights.visualContext || 0;
  if (question.pedagogicalComment || question.explanation) score += weights.pedagogicalComment || 0;
  if (Array.isArray(question.alternativesAnalysis) && question.alternativesAnalysis.length) score += weights.distractorAnalysis || 0;
  if (question.source || question.officialAnswer) score += weights.officialSource || 0;
  return Math.min(score, 52);
}

function prioritizeFreshQuestions(list, recentIds, minimumFresh = DAILY_REQUIRED_BY_AREA) {
  if (!recentIds?.size) return list;
  const fresh = list.filter((question) => !recentIds.has(question.id));
  const repeated = list.filter((question) => recentIds.has(question.id));
  return fresh.length >= minimumFresh ? [...fresh, ...repeated] : [...fresh, ...repeated];
}

function getQuestionTargets(mix) {
  const raw = {
    easy: Math.round((mix.easy / 100) * DAILY_REQUIRED_BY_AREA),
    medium: Math.round((mix.medium / 100) * DAILY_REQUIRED_BY_AREA),
    hard: Math.round((mix.hard / 100) * DAILY_REQUIRED_BY_AREA),
  };
  while (raw.easy + raw.medium + raw.hard < DAILY_REQUIRED_BY_AREA) {
    raw.medium += 1;
  }
  while (raw.easy + raw.medium + raw.hard > DAILY_REQUIRED_BY_AREA) {
    if (raw.easy >= raw.medium && raw.easy > 0) raw.easy -= 1;
    else if (raw.medium > 0) raw.medium -= 1;
    else raw.hard -= 1;
  }
  return raw;
}

function rotateQuestions(list, seed) {
  if (!list.length) return [];
  const offset = Math.abs(seed) % list.length;
  return [...list.slice(offset), ...list.slice(0, offset)];
}

function render() {
  const user = getCurrentUser();
  if (!user) {
    pendingScrollRestore = null;
    requestScrollTop();
    renderAuth();
    flushScrollPosition();
    return;
  }

  if (!isValidAppView(activeView)) activeView = "today";
  if (!selectedDay) selectedDay = clamp(Number(store.uiState?.selectedDay || getTargetDay(user)), 1, DAY_COUNT);
  renderApp(user);
  flushScrollPosition();
}

function renderAuth() {
  const modeTitle = authMode === "login" ? "Entrar" : "Criar acesso";
  app.innerHTML = `
    <main class="auth-shell">
      <section class="auth-visual" aria-label="${BRAND_NAME}">
        <div class="auth-visual-content">
          <div class="brand-mark"><span class="brand-symbol">U</span><span>${BRAND_NAME}</span></div>
          <div class="auth-copy">
            <img class="brand-logo-art" src="./assets/brand/ultimate-enem-prof-cav.png" alt="ultimateENEM experience Prof. CAV" />
            <div class="auth-focus-board" aria-hidden="true">
              <img src="./assets/brand/plano-diario-foco-prof-cav.png" alt="" />
              <span>Crânio, foco e alta performance para Medicina</span>
            </div>
            <h1>Medicina pede direção diária.</h1>
            <p>${BRAND_SUBTITLE}</p>
          </div>
        </div>
      </section>
      <section class="auth-panel">
        <div class="auth-card">
          <h2>${modeTitle}</h2>
          <p>${authMode === "login" ? "Use seu e-mail e senha para voltar ao plano." : "Crie uma conta de treino para iniciar o plano."}</p>
          <div class="auth-tabs" role="tablist" aria-label="Acesso">
            <button class="auth-tab ${authMode === "login" ? "active" : ""}" data-auth-mode="login" type="button">Entrar</button>
            <button class="auth-tab ${authMode === "signup" ? "active" : ""}" data-auth-mode="signup" type="button">Criar conta</button>
          </div>
          <form id="authForm" class="form-grid">
            ${
              authMode === "signup"
                ? `<label class="field"><span>Nome</span><input name="name" autocomplete="name" required minlength="2" /></label>`
                : ""
            }
            <label class="field"><span>E-mail</span><input name="email" type="email" autocomplete="email" required /></label>
            <label class="field"><span>Senha</span><input name="password" type="password" autocomplete="${authMode === "login" ? "current-password" : "new-password"}" required minlength="6" /></label>
            ${
              authMode === "signup"
                ? `<label class="field"><span>Início do plano</span><input name="startDate" type="date" value="${todayISO()}" required /></label>`
                : ""
            }
            ${
              authMode === "signup"
                ? `
                  <label class="field"><span>Tempo real em casa por dia</span><select name="availableTime"><option value="2h">Até 2h</option><option value="3h">3h</option><option value="4h">4h</option><option value="5h+">5h ou mais</option></select></label>
                  <label class="field"><span>Horário de aula</span><input name="schoolSchedule" placeholder="Ex.: 7h às 13h" /></label>
                  <label class="field"><span>Sono médio</span><select name="sleep"><option value="7-8h">7 a 8h</option><option value="6h">6h</option><option value="menos de 6h">Menos de 6h</option><option value="8h+">Mais de 8h</option></select></label>
                  <label class="field"><span>Universidade-alvo</span><input name="targetUniversity" placeholder="Ex.: USP, UFMG, UFPE" /></label>
                  <label class="field"><span>Nota atual estimada</span><input name="currentScore" type="number" min="0" max="1000" placeholder="Ex.: 680" /></label>
                  <label class="field"><span>Maior dificuldade percebida</span><select name="mainDifficulty"><option value="Natureza">Natureza</option><option value="Matemática">Matemática</option><option value="Redação">Redação</option><option value="Tempo de prova">Tempo de prova</option><option value="Constância">Constância</option></select></label>
                `
                : ""
            }
            <button class="primary-btn" type="submit">${modeTitle}</button>
          </form>
          <div id="authMessage" class="form-message" role="status"></div>
          <p class="demo-note">Protótipo local: as contas ficam salvas apenas neste navegador.</p>
        </div>
      </section>
    </main>
  `;

  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      authMode = button.dataset.authMode;
      renderAuth();
    });
  });

  document.getElementById("authForm").addEventListener("submit", handleAuthSubmit);
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const message = document.getElementById("authMessage");
  const form = new FormData(event.currentTarget);
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");

  if (!email || password.length < 6) {
    message.textContent = "Informe e-mail e senha com pelo menos 6 caracteres.";
    return;
  }

  const passwordHash = await hashPassword(password);

  if (authMode === "signup") {
    if (store.users[email]) {
      message.textContent = "Já existe uma conta com esse e-mail.";
      return;
    }
    const user = {
      email,
      name: String(form.get("name") || "").trim() || "Aluno",
      passwordHash,
      startDate: String(form.get("startDate") || todayISO()),
      createdAt: new Date().toISOString(),
      progress: {},
      attemptLog: [],
      studyLog: [],
      profile: {
        availableTime: String(form.get("availableTime") || "3h"),
        schoolSchedule: String(form.get("schoolSchedule") || "").trim(),
        sleep: String(form.get("sleep") || "7-8h"),
        targetUniversity: String(form.get("targetUniversity") || "").trim(),
        currentScore: String(form.get("currentScore") || "").trim(),
        mainDifficulty: String(form.get("mainDifficulty") || "Natureza"),
        goalCourse: "Medicina",
      },
    };
    store.users[email] = user;
    store.sessionEmail = email;
    activeView = "today";
    selectedDay = getTargetDay(user);
    persistUiState({ scrollY: 0 });
    requestScrollTop();
    saveStore();
    render();
    return;
  }

  const user = store.users[email];
  if (!user || user.passwordHash !== passwordHash) {
    message.textContent = "E-mail ou senha inválidos.";
    return;
  }

  store.sessionEmail = email;
  selectedDay = Number.isFinite(Number(store.uiState?.selectedDay))
    ? clamp(Number(store.uiState.selectedDay), 1, DAY_COUNT)
    : getTargetDay(user);
  activeView = isValidAppView(store.uiState?.activeView) ? store.uiState.activeView : "today";
  pendingScrollRestore = Number.isFinite(Number(store.uiState?.scrollY)) ? Number(store.uiState.scrollY) : null;
  if (pendingScrollRestore === null) requestScrollTop();
  saveStore();
  render();
}

function renderApp(user) {
  const completed = getCompletedDays(user);
  const unlocked = getUnlockedDay(user);
  const targetDay = getTargetDay(user);
  const accuracy = getOverallAccuracy(user);
  const mission = getMissionCompletion(user, targetDay);
  const clinicAccess = getTriClinicAccess(user);

  app.innerHTML = `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand-mark"><span class="brand-symbol">U</span><span>${BRAND_NAME}</span></div>
        <div class="student-pill">
          <strong>${escapeHTML(user.name)}</strong>
          <span>${escapeHTML(user.email)}</span>
        </div>
        <nav class="nav-list" aria-label="Principal">
          ${navButton("today", "Plantão", `${mission.questionsDone}/${DAILY_TOTAL_QUESTIONS}`)}
          ${navButton("clinic", "Clínica", clinicAccess.unlocked ? "Rx" : "UTI")}
          ${navButton("plan", "Semana", "7d")}
          ${navButton("bank", "Banco", STRUCTURED_QUESTIONS.length)}
          ${navButton("redacao", "Redação", "1K")}
          ${navButton("news", "Atualidades", "ENEM")}
          ${navButton("simulado", "Simulado", "180")}
          ${navButton("performance", "Desempenho", `${accuracy}%`)}
        </nav>
        <div class="sidebar-footer">
          <button class="ghost-btn" id="resetDemoBtn" type="button">Zerar progresso</button>
          <button class="danger-btn" id="logoutBtn" type="button">Sair</button>
        </div>
      </aside>
      <main class="main">
        ${renderTopbar(user, completed, unlocked)}
        ${renderView(user)}
      </main>
    </div>
  `;

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      activeView = button.dataset.view;
      quizState = null;
      persistUiState({ scrollY: 0 });
      requestScrollTop();
      render();
    });
  });

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    stopTimer();
    store.sessionEmail = "";
    selectedDay = null;
    activeView = "today";
    requestScrollTop();
    saveStore();
    render();
  });

  document.getElementById("resetDemoBtn")?.addEventListener("click", () => {
    if (!window.confirm("Zerar todo o progresso desta conta?")) return;
    user.progress = {};
    user.attemptLog = [];
    user.studyLog = [];
    selectedDay = 1;
    quizState = null;
    activeView = "today";
    persistUiState({ scrollY: 0 });
    requestScrollTop();
    saveCurrentUser(user);
    render();
  });

  bindViewEvents(user);
}

function navButton(view, label, count) {
  return `
    <button class="nav-btn ${activeView === view ? "active" : ""}" data-view="${view}" type="button">
      <span>${label}</span>
      <span class="nav-count">${count}</span>
    </button>
  `;
}

function renderTopbar(user, completed, unlocked) {
  return `
    <header class="topbar">
      <div class="page-title">
        <h1>${getPageTitle()}</h1>
        <p>${getPageSubtitle(user, completed, unlocked)}</p>
      </div>
      <span class="status-chip">${completed}/${DAY_COUNT} dias concluídos</span>
    </header>
  `;
}

function getPageTitle() {
  const titles = {
    today: "Plantão do Dia",
    clinic: "Clínica de Performance",
    plan: "Planejamento semanal",
    bank: "Banco ENEM",
    redacao: "Redação nota 1000",
    news: "Atualidades ENEM",
    simulado: "Simulado de Sábado",
    performance: "Desempenho",
  };
  return titles[activeView];
}

function getPageSubtitle(user, completed, unlocked) {
  const level = classifyStudent(user);
  if (activeView === "today") return `20 questões obrigatórias: 5 por área. Nível atual: ${level.label}.`;
  if (activeView === "clinic") return "Plantão eletivo para medianos e alta performance, com prescrição de questões por assunto.";
  if (activeView === "plan") return `Semana recalculada por nível, desempenho, erros recentes e descanso protegido.`;
  if (activeView === "bank") return `${IMPORTED_QUESTIONS.length} questões importadas dos PDFs, ${STRUCTURED_QUESTIONS.length} prontas para correção automática.`;
  if (activeView === "redacao") return "Critérios oficiais, checklist de correção e padrões dos textos nota 1000.";
  if (activeView === "news") return "Notícias diárias transformadas em repertório, temas, intervenção e uso nas áreas do ENEM.";
  if (activeView === "simulado") return "180 questões, redação manuscrita e plano pós-prova orientado pelos erros.";
  return `Conta iniciada em ${formatDate(user.startDate)}.`;
}

function renderView(user) {
  if (activeView === "clinic") return renderTriClinicView(user);
  if (activeView === "plan") return renderPlanView(user);
  if (activeView === "bank") return renderBankView();
  if (activeView === "redacao") return renderRedacaoView(user);
  if (activeView === "news") return renderDailyNewsView(user);
  if (activeView === "simulado") return renderSimuladoView(user);
  if (activeView === "performance") {
    const day = selectedDay || getTargetDay(user);
    if (!isMissionComplete(user, day)) return renderPerformanceLocked(user, day);
    return renderPerformanceView(user);
  }
  return renderTodayView(user);
}

function renderPerformanceLocked(user, day) {
  const completion = getMissionCompletion(user, day);
  const pendingAreas = getCurrentMission(user, day)
    .filter((block) => !block.progress.passed)
    .map((block) => block.competency.short)
    .join(", ");
  return `
    <section class="panel locked-panel">
      <div class="panel-header">
        <div>
          <h2>Painel completo bloqueado por enquanto</h2>
          <p>Você ainda não concluiu o plantão diário. Termine o essencial para liberar o diagnóstico completo.</p>
        </div>
        <span class="status-chip">${completion.questionsDone}/${DAILY_TOTAL_QUESTIONS}</span>
      </div>
      <div class="feedback">
        ${pendingAreas ? `Áreas pendentes: ${escapeHTML(pendingAreas)}.` : "Falta registrar autopercepção e descanso protegido."}
      </div>
      <div class="button-row">
        <button class="primary-btn" data-view="today" type="button">Voltar ao plantão</button>
      </div>
    </section>
  `;
}

function renderTodayView(user) {
  const day = selectedDay || getTargetDay(user);
  const missionBlocks = getCurrentMission(user, day);
  const status = getDayStatus(user, day);
  const mission = getMissionRecord(user, day);
  const completion = getMissionCompletion(user, day);
  const level = classifyStudent(user);
  const accuracy = getOverallAccuracy(user);
  const redacaoAverage = getRedacaoAverage(user);

  return `
    <section class="grid metrics-grid">
      ${metric("Questões hoje", `${completion.questionsDone}/${DAILY_TOTAL_QUESTIONS}`, completion.complete ? "plantão concluído" : "plantão em andamento")}
      ${metric("Nível", level.label, level.reason)}
      ${metric("Teoria/exercícios", `${level.theory}/${level.exercises}`, level.note)}
      ${metric("Redação média", redacaoAverage ? `${redacaoAverage}` : "sem dados", "meta competitiva para Medicina")}
    </section>

    <section class="grid today-layout">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Plantão ${day}: quatro casos para evoluir</h2>
            <p>Cada área vira um caso clínico simbólico. Bateu 80%, o paciente recebe a melhor conduta.</p>
          </div>
          <span class="status-chip">${statusLabel(status)}</span>
        </div>
        <ul class="task-list">
          <li>5 questões por caso: Linguagens, Humanas, Natureza e Matemática.</li>
          <li>Correção ativa dos erros para liberar a evolução do paciente.</li>
          <li>Registro de autopercepção e descanso protegido.</li>
        </ul>
        <div class="mission-controls">
          <label class="field">
            <span>Autopercepção de hoje</span>
            <select id="selfPerceptionSelect">
              <option value="">Registrar depois</option>
              <option value="facil" ${mission.selfPerception === "facil" ? "selected" : ""}>Fácil</option>
              <option value="medio" ${mission.selfPerception === "medio" ? "selected" : ""}>Médio</option>
              <option value="dificil" ${mission.selfPerception === "dificil" ? "selected" : ""}>Difícil</option>
            </select>
          </label>
          <label class="check-row">
            <input id="restCheck" type="checkbox" ${mission.restChecked ? "checked" : ""} />
            <span>Descanso protegido confirmado: recuperação mental também é tarefa.</span>
          </label>
        </div>
        ${
          completion.complete
            ? `<div class="feedback success">Plantão concluído. Seus quatro pacientes evoluíram bem e o painel completo está liberado.</div>
               <div class="button-row"><button class="primary-btn" id="goNextDayBtn" type="button" ${day >= DAY_COUNT ? "disabled" : ""}>Ir para amanhã</button></div>`
            : `<div class="feedback">Faltam ${DAILY_TOTAL_QUESTIONS - completion.questionsDone} questões para fechar o plantão com segurança e registrar os itens finais.</div>`
        }
        ${renderTimer()}
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Ambulatório ENEM</h2>
            <p>Os casos são calibrados por desempenho, dificuldade, erros recentes e coerência de prova.</p>
          </div>
          <span class="status-chip">${completion.completedBlocks}/4 áreas</span>
        </div>
        <div class="mission-grid">
          ${missionBlocks.map((block) => renderMissionBlock(user, day, block, status)).join("")}
        </div>
        ${renderMissionQuiz(user, day)}
      </article>
    </section>
  `;
}

function getTriClinicAccess(user) {
  const level = classifyStudent(user);
  return {
    level,
    unlocked: level.id === "mediano" || level.id === "avancado",
    ward:
      level.id === "avancado"
        ? "Centro cirúrgico de alta performance"
        : level.id === "mediano"
          ? "Enfermaria de evolução monitorada"
          : "Ala de estabilização da base",
  };
}

function renderTriClinicView(user) {
  const access = getTriClinicAccess(user);
  const settings = getTriClinicSettings(user);
  const selectedSkill = findSkillById(settings.skillId);
  const available = (QUESTIONS[settings.skillId] || []).filter((question) => !question.frequencyExcluded).length;
  const session = user.triClinicSession || null;

  if (!access.unlocked) {
    return `
      <section class="panel locked-panel clinic-locked-panel">
        <div class="panel-header">
          <div>
            <h2>Ala em observação</h2>
            <p>Esta clínica abre quando as fáceis estiverem estáveis. Primeiro, precisamos garantir que a base não derrube a nota.</p>
          </div>
          <span class="status-chip">${escapeHTML(access.level.label)}</span>
        </div>
        <div class="feedback">
          Conduta do preceptor: mantenha o plantão diário, bata 80% nas questões fáceis e volte quando os sinais vitais da base estiverem seguros.
        </div>
      </section>
    `;
  }

  return `
    <section class="grid metrics-grid clinic-metrics">
      ${metric("Ala", access.level.id === "avancado" ? "Alta performance" : "Intermediária", access.ward)}
      ${metric("Assunto", selectedSkill?.title || "Em seleção", "prescrição por habilidade")}
      ${metric("Dose", `${settings.quantity} questões`, "ajuste eletivo do plantão")}
      ${metric("Estoque", available, "itens disponíveis para esse assunto")}
    </section>

    <section class="grid clinic-layout">
      <article class="panel clinic-control-panel">
        <div class="panel-header">
          <div>
            <h2>Prescrição eletiva</h2>
            <p>Escolha área, assunto e dose. A seleção fina fica no prontuário interno do app.</p>
          </div>
          <span class="status-chip">${escapeHTML(access.ward)}</span>
        </div>
        ${renderTriClinicControls(settings)}
      </article>

      <article class="panel clinic-protocol-panel">
        <div class="panel-header">
          <div>
            <h2>Conduta da clínica</h2>
            <p>O aluno escolhe o foco; o app escolhe os itens certos para o momento dele.</p>
          </div>
          <span class="status-chip">sem bastidores</span>
        </div>
        <ul class="task-list">
          <li>Mediano recebe fáceis importantes, médias e poucas difíceis quando fizer sentido.</li>
          <li>Alta performance mantém fáceis no radar e recebe médias, difíceis e raras com maior ganho.</li>
          <li>O resultado entra no prontuário para recalibrar os próximos plantões.</li>
        </ul>
      </article>
    </section>

    ${session ? renderTriClinicSession(user, session) : renderTriClinicEmptyState(settings)}
  `;
}

function renderTriClinicControls(settings) {
  const selectedArea = COMPETENCIES.find((competency) => competency.id === settings.areaId) || COMPETENCIES[0];
  return `
    <div class="clinic-form-grid">
      <label class="field">
        <span>Área do plantão</span>
        <select id="triClinicAreaSelect">
          ${COMPETENCIES.map(
            (competency) => `<option value="${escapeHTML(competency.id)}" ${competency.id === settings.areaId ? "selected" : ""}>${escapeHTML(competency.name)}</option>`,
          ).join("")}
        </select>
      </label>
      <label class="field">
        <span>Assunto em atendimento</span>
        <select id="triClinicSkillSelect">
          ${selectedArea.skills
            .map((skill) => {
              const count = (QUESTIONS[skill.id] || []).filter((question) => !question.frequencyExcluded).length;
              return `<option value="${escapeHTML(skill.id)}" ${skill.id === settings.skillId ? "selected" : ""}>${escapeHTML(skill.title)} (${count})</option>`;
            })
            .join("")}
        </select>
      </label>
      <label class="field">
        <span>Dose de questões</span>
        <select id="triClinicQuantitySelect">
          ${TRI_CLINIC_QUANTITIES.map(
            (quantity) => `<option value="${quantity}" ${quantity === settings.quantity ? "selected" : ""}>${quantity} questões</option>`,
          ).join("")}
        </select>
      </label>
    </div>
    <div class="button-row">
      <button class="primary-btn" id="triClinicGenerateBtn" type="button">Abrir plantão eletivo</button>
      <button class="secondary-btn" id="triClinicClearBtn" type="button">Limpar prescrição</button>
    </div>
  `;
}

function renderTriClinicEmptyState(settings) {
  const skill = findSkillById(settings.skillId);
  return `
    <section class="panel redacao-wide clinic-session-panel">
      <div class="empty-state">
        Nenhum plantão eletivo aberto. Escolha a dose para ${escapeHTML(skill?.title || "o assunto selecionado")} e inicie a clínica.
      </div>
    </section>
  `;
}

function renderTriClinicSession(user, session) {
  const questions = getTriClinicSessionQuestions(session);
  const score = getTriClinicSessionScore(session, questions);
  const answered = Object.keys(session.answers || {}).length;
  const level = classifyStudent(user);
  const skill = findSkillById(session.skillId);
  const passed = session.checked && questions.length && score >= Math.ceil(questions.length * 0.8);
  return `
    <section class="panel redacao-wide clinic-session-panel">
      <div class="panel-header">
        <div>
          <h2>Prontuário eletivo aberto</h2>
          <p>${escapeHTML(skill?.title || "Assunto selecionado")} · ${answered}/${questions.length} respondidas.</p>
        </div>
        <span class="status-chip">${session.checked ? `${score}/${questions.length}` : "em atendimento"}</span>
      </div>
      ${
        session.checked
          ? `<div class="feedback ${passed ? "success" : "fail"}">${
              passed
                ? "Alta liberada: o plantão eletivo respondeu bem ao tratamento."
                : "Paciente ainda em observação: reforce os erros antes de aumentar a dose."
            }</div>`
          : ""
      }
      <div class="button-row">
        <button class="primary-btn" id="triClinicCheckBtn" type="button" ${answered < questions.length ? "disabled" : ""}>Dar diagnóstico</button>
        <button class="secondary-btn" id="triClinicRegenerateBtn" type="button">Nova prescrição</button>
      </div>
      <div class="clinic-question-list">
        ${questions.map((question, index) => renderTriClinicQuestionCard(question, session, index, level)).join("")}
      </div>
    </section>
  `;
}

function renderTriClinicQuestionCard(question, session, index, level) {
  const selected = session.answers?.[question.id];
  const checked = Boolean(session.checked);
  const report = buildEnemTriItemReport(question);
  return `
    <article class="clinic-question-card question-box">
      <div class="mini-meta question-meta">
        <span>Questão ${String(index + 1).padStart(2, "0")}</span>
        <span>${escapeHTML(question.source || "Acervo ENEM")}</span>
        <span>${escapeHTML(DIFFICULTY_LABELS[question.difficulty] || "Média")}</span>
        <span>${escapeHTML(getClinicDoseLabel(question, level.id))}</span>
      </div>
      <p class="question-title">${escapeHTML(getQuestionPrompt(question))}</p>
      ${renderQuestionVisual(question, index + 1)}
      <div class="option-grid">
        ${(question.options || [])
          .map((option, optionIndex) => {
            const isSelected = Number(selected) === optionIndex;
            const isCorrect = checked && optionIndex === question.answer;
            const isWrong = checked && isSelected && optionIndex !== question.answer;
            return `
              <button class="option-btn ${isSelected ? "selected" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}" data-clinic-answer="${escapeHTML(question.id)}" data-option-index="${optionIndex}" type="button" ${checked ? "disabled" : ""}>
                <span class="option-letter">${String.fromCharCode(65 + optionIndex)}</span>
                <span>${escapeHTML(option)}</span>
              </button>
            `;
          })
          .join("")}
      </div>
      ${
        checked
          ? `<div class="clinic-feedback">
              <strong>Conduta do preceptor</strong>
              <p>${escapeHTML(getTriClinicQuestionFeedback(question, selected, report))}</p>
            </div>`
          : ""
      }
    </article>
  `;
}

function getTriClinicAccessLabel(levelId) {
  if (levelId === "avancado") return "alta performance";
  if (levelId === "mediano") return "intermediário";
  return "base em estabilização";
}

function getTriClinicSettings(user) {
  const stored = user.triClinicSettings || {};
  const area = COMPETENCIES.find((competency) => competency.id === stored.areaId) || COMPETENCIES[0];
  const skill = area.skills.find((item) => item.id === stored.skillId) || area.skills[0];
  const quantity = TRI_CLINIC_QUANTITIES.includes(Number(stored.quantity)) ? Number(stored.quantity) : 10;
  return {
    areaId: area.id,
    skillId: skill.id,
    quantity,
  };
}

function saveTriClinicSettings(user, patch = {}) {
  const current = getTriClinicSettings(user);
  const next = { ...current, ...patch };
  const area = COMPETENCIES.find((competency) => competency.id === next.areaId) || COMPETENCIES[0];
  const skill = area.skills.find((item) => item.id === next.skillId) || area.skills[0];
  user.triClinicSettings = {
    areaId: area.id,
    skillId: skill.id,
    quantity: TRI_CLINIC_QUANTITIES.includes(Number(next.quantity)) ? Number(next.quantity) : current.quantity,
  };
}

function createTriClinicSession(user) {
  const access = getTriClinicAccess(user);
  if (!access.unlocked) return;
  const settings = getTriClinicSettings(user);
  const questions = selectTriClinicQuestions(user, settings.skillId, settings.quantity, access.level.id);
  user.triClinicSession = {
    id: `clinic-${Date.now()}`,
    areaId: settings.areaId,
    skillId: settings.skillId,
    quantity: settings.quantity,
    levelId: access.level.id,
    questionIds: questions.map((question) => question.id),
    answers: {},
    checked: false,
    createdAt: new Date().toISOString(),
  };
}

function selectTriClinicQuestions(user, skillId, quantity, levelId) {
  const pool = (QUESTIONS[skillId] || []).filter((question) => !question.frequencyExcluded);
  const eligible = pool.filter((question) => isTriClinicQuestionEligible(question, levelId));
  const sourcePool = eligible.length >= Math.min(quantity, 5) ? eligible : pool;
  const seed = hashString(`${skillId}-${levelId}-${todayISO()}-${user.attemptLog?.length || 0}`);
  const recentIds = new Set((user.triClinicHistory || []).slice(-5).flatMap((item) => item.questionIds || []));
  return sourcePool
    .map((question, index) => ({
      question,
      score: getTriClinicQuestionScore(question, levelId) + ((seed + index * 17) % 19) - (recentIds.has(question.id) ? 28 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.question)
    .slice(0, quantity);
}

function isTriClinicQuestionEligible(question, levelId) {
  if (levelId === "avancado") return true;
  if (question.difficulty === "hard" && question.frequencyTier === "low" && !question.medicineCritical) return false;
  if (question.frequencyTier === "low" && question.difficulty !== "easy") return false;
  return true;
}

function getTriClinicQuestionScore(question, levelId) {
  const report = buildEnemTriItemReport(question);
  const base = getQuestionSelectionScore(question, levelId);
  const priorityWeight = {
    "Prioridade Máxima": 34,
    "Prioridade Alta": 24,
    "Prioridade Média": 12,
    "Prioridade Baixa": 4,
  }[report.strategy.studyPriority] || 8;
  const gainWeight = {
    "Muito alto": 30,
    Alto: 22,
    Médio: 12,
    Baixo: 4,
  }[report.strategy.triGain] || 8;
  const levelWeight =
    levelId === "avancado"
      ? { easy: 16, medium: 24, hard: 32 }[question.difficulty] || 18
      : { easy: 30, medium: 28, hard: 12 }[question.difficulty] || 18;
  return base + priorityWeight + gainWeight + levelWeight;
}

function getTriClinicSessionQuestions(session = {}) {
  return (session.questionIds || []).map((id) => QUESTION_BY_ID[id]).filter(Boolean);
}

function getTriClinicSessionScore(session = {}, questions = getTriClinicSessionQuestions(session)) {
  return questions.reduce((score, question) => score + (Number(session.answers?.[question.id]) === question.answer ? 1 : 0), 0);
}

function getClinicDoseLabel(question, levelId) {
  if (levelId === "avancado" && question.difficulty === "hard") return "Dose alta";
  if (question.frequencyTier === "high" || question.beginnerCore) return "Dose essencial";
  if (question.frequencyTier === "low") return "Dose rara";
  return "Dose monitorada";
}

function getTriClinicQuestionFeedback(question, selected, report) {
  const answerLetter = Number.isInteger(question.answer) ? "ABCDE"[question.answer] : question.resolvedAnswer || question.officialAnswer || "";
  const hit = Number(selected) === question.answer;
  const explanation = cleanFeedbackText(question.pedagogicalComment || question.explanation || "Revise o comando e refaça o raciocínio antes de avançar.");
  const dose = report.strategy.triGain === "Muito alto" || report.strategy.triGain === "Alto" ? "boa resposta para ganhar competitividade" : "boa resposta para manter estabilidade";
  return `${hit ? "Acerto registrado" : "Revisão necessária"}: gabarito ${answerLetter}. ${explanation} Conduta: ${dose}, mantendo as fáceis sob controle.`;
}

function recordTriClinicAttempt(user, session) {
  if (!session || session.recordedAt) return;
  const questions = getTriClinicSessionQuestions(session);
  const skill = findSkillById(session.skillId);
  const competency = findCompetencyBySkillId(session.skillId);
  const score = getTriClinicSessionScore(session, questions);
  const questionResults = questions.map((question) => ({
    id: question.id,
    skillId: session.skillId,
    areaId: session.areaId,
    difficulty: question.difficulty || "medium",
    correct: Number(session.answers?.[question.id]) === question.answer,
  }));
  user.attemptLog = user.attemptLog || [];
  user.attemptLog.push({
    day: selectedDay || getTargetDay(user),
    source: "clinic",
    competencyId: competency?.id || session.areaId,
    competencyShort: competency?.short || "Clínica",
    skillId: session.skillId,
    skillTitle: skill?.title || "Assunto eletivo",
    score,
    total: questions.length,
    passed: questions.length ? score >= Math.ceil(questions.length * 0.8) : false,
    questionResults,
    createdAt: new Date().toISOString(),
  });
  user.triClinicHistory = user.triClinicHistory || [];
  user.triClinicHistory.push({
    sessionId: session.id,
    skillId: session.skillId,
    questionIds: session.questionIds || [],
    score,
    total: questions.length,
    createdAt: new Date().toISOString(),
  });
  session.recordedAt = new Date().toISOString();
}

function buildEnemTriItemReport(question = {}) {
  const competency = findCompetencyBySkillId(question.skillId) || COMPETENCIES.find((item) => item.id === question.competencyId) || null;
  const skill = findSkillById(question.skillId);
  const command = inferQuestionCommand(question);
  const tri = estimateTriParameters(question);
  const frequency = getHistoricalIncidenceProfile(question);
  const studyPriority = inferStudyPriority(question, tri, frequency);
  const triGain = inferTriGainPotential(question, tri, frequency);
  return {
    identification: {
      area: competency?.name || question.area || "Área em revisão",
      predominantDiscipline: inferPredominantDiscipline(question),
      mainSubject: skill?.title || question.skillTitle || "Assunto em revisão",
      secondarySubjects: inferSecondarySubjects(question),
      interdisciplinarity: inferInterdisciplinarity(question),
    },
    matrix: {
      competencyNumber: question.matrixCompetencyCode || "em revisão",
      competencyDescription: question.matrixCompetencyDescription || "",
      primarySkill: question.matrixSkillCode || "em revisão",
      primarySkillText: question.matrixSkillDescription || "",
      secondarySkill: "",
    },
    cognitive: {
      bloom: inferBloomLevel(question, command),
      enemLevel: inferEnemCognitiveLevel(question),
      explanation: "Classificação estimada pelo comando, texto-base, habilidade vinculada, distratores e dificuldade operacional do item.",
    },
    statement: {
      textBaseImportance: inferTextBaseImportance(question),
      mainVerb: command.verb,
      cognitiveAction: command.action,
    },
    pedagogy: {
      resolution: question.pedagogicalComment || question.explanation || "Resolução comentada aguardando curadoria.",
      prerequisites: inferPrerequisites(question),
      contents: [skill?.focus || question.skillTitle || "conteúdo em revisão"].filter(Boolean),
    },
    distractors: analyzeQuestionDistractors(question),
    tri,
    historical: frequency,
    strategy: {
      idealTimeMinutes: inferIdealResolutionTime(question),
      studyPriority,
      triGain,
      studentProfile: inferStudentProfile(question, tri),
    },
    summary: {
      area: competency?.name || question.area || "Área em revisão",
      discipline: inferPredominantDiscipline(question),
      competency: question.matrixCompetencyCode || "em revisão",
      skill: question.matrixSkillCode || "em revisão",
      subject: skill?.title || question.skillTitle || "Assunto em revisão",
      cognitiveLevel: inferEnemCognitiveLevel(question),
      triDifficulty: tri.parameterB.difficulty,
      historicalFrequency: frequency.frequency,
      studyPriority,
      triGain,
    },
  };
}

function inferPredominantDiscipline(question = {}) {
  const skillId = question.skillId || "";
  const title = normalizeForMatch(question.skillTitle || "");
  if (question.competencyId === "matematica") return "Matemática";
  if (skillId.startsWith("bio") || title.includes("biologia")) return "Biologia";
  if (skillId.startsWith("quim") || title.includes("quim")) return "Química";
  if (skillId.startsWith("fis") || title.includes("fisica")) return "Física";
  if (skillId.startsWith("hist") || title.includes("historia")) return "História";
  if (skillId.startsWith("geo") || title.includes("geografia")) return "Geografia";
  if (skillId.startsWith("socio") || title.includes("sociologia")) return "Sociologia";
  if (skillId.startsWith("filo") || title.includes("filosofia")) return "Filosofia";
  if (question.competencyId === "linguagens") return title.includes("redacao") ? "Redação" : "Linguagens";
  return question.area || "Disciplina em revisão";
}

function inferSecondarySubjects(question = {}) {
  const haystack = normalizeForMatch([question.text, question.extractedStem, question.skillTitle, question.matrixSkillDescription].join(" "));
  const subjects = [];
  [
    ["gráfico/tabela", ["grafico", "tabela", "percentual", "dados"]],
    ["leitura de texto", ["texto", "enunciado", "excerto", "leitura"]],
    ["política pública", ["estado", "governo", "politica", "direito"]],
    ["ambiente e saúde", ["ambiente", "saude", "saneamento", "doenca"]],
    ["cálculo", ["calcule", "valor", "medida", "funcao"]],
  ].forEach(([label, tokens]) => {
    if (tokens.some((token) => haystack.includes(token))) subjects.push(label);
  });
  return subjects.slice(0, 3);
}

function inferInterdisciplinarity(question = {}) {
  const count = inferSecondarySubjects(question).length + (question.visualSourceType ? 1 : 0);
  if (count >= 3) return "Alto";
  if (count >= 1) return "Médio";
  return "Baixo";
}

function inferQuestionCommand(question = {}) {
  const text = normalizeForMatch([question.extractedStem, question.text, question.matrixSkillDescription].join(" "));
  const commands = [
    ["calcular", "Calcular"],
    ["inferir", "Inferir"],
    ["interpretar", "Interpretar"],
    ["comparar", "Comparar"],
    ["relacionar", "Relacionar"],
    ["avaliar", "Avaliar"],
    ["explicar", "Explicar"],
    ["identificar", "Identificar"],
    ["analisar", "Analisar"],
    ["determinar", "Calcular"],
  ];
  const found = commands.find(([verb]) => text.includes(verb));
  return {
    verb: found?.[0] || "identificar",
    action: found?.[1] || (question.competencyId === "matematica" ? "Calcular" : "Interpretar"),
  };
}

function inferBloomLevel(question = {}, command = inferQuestionCommand(question)) {
  if (["Avaliar"].includes(command.action)) return "Avaliar";
  if (["Analisar", "Inferir", "Relacionar", "Comparar"].includes(command.action)) return "Analisar";
  if (["Calcular"].includes(command.action)) return question.difficulty === "hard" ? "Analisar" : "Aplicar";
  if (question.difficulty === "easy") return "Compreender";
  return "Aplicar";
}

function inferEnemCognitiveLevel(question = {}) {
  if (question.difficulty === "hard") return question.frequencyTier === "low" ? "Alto" : "Médio-Alto";
  if (question.difficulty === "medium") return "Médio";
  return "Baixo";
}

function inferTextBaseImportance(question = {}) {
  if (question.stimulusImage || question.cropImage || question.visualSourceType) return "Fundamental";
  const textLength = String(question.extractedStem || question.text || "").length;
  if (textLength > 240) return "Fundamental";
  if (textLength > 90) return "Importante";
  return "Dispensável";
}

function inferPrerequisites(question = {}) {
  const skill = findSkillById(question.skillId);
  const prerequisites = [skill?.core, skill?.focus, question.matrixSkillDescription].filter(Boolean);
  return [...new Set(prerequisites)].slice(0, 4);
}

function analyzeQuestionDistractors(question = {}) {
  const analysis = splitAlternativesAnalysis(question.alternativesAnalysis || "");
  return (question.options || []).map((option, index) => {
    const letter = "ABCDE"[index];
    const correct = index === question.answer;
    return {
      alternative: letter,
      correct,
      reason: correct ? "Gabarito oficial." : analysis[index] || "Distrator a revisar na curadoria comentada.",
      type: correct ? "correta" : inferDistractorType(option, question),
    };
  });
}

function inferDistractorType(option = "", question = {}) {
  const text = normalizeForMatch(`${option} ${question.extractedStem || ""}`);
  if (/(calculo|valor|medida|porcentagem|percentual)/.test(text)) return "Erro de cálculo";
  if (/(sempre|nunca|todo|todos|apenas)/.test(text)) return "Generalização indevida";
  if (/(conceito|definicao|termo)/.test(text)) return "Confusão terminológica";
  if (question.cropImage || question.stimulusImage) return "Leitura parcial do texto";
  return "Interpretação superficial";
}

function estimateTriParameters(question = {}) {
  const quality = getBniItemQualityBonus(question);
  const realTriProfile = getRealTriSkillProfile(question.competencyId, question.matrixSkillCode);
  const realParameterSummary = realTriProfile?.triParameterSummary || question.realTriParameterSummary || {};
  const realAccuracy = realTriProfile?.realAccuracy || question.realAccuracy || {};
  const avgPercentCorrect = Number(
    realAccuracy.avgPercentCorrect ??
    realParameterSummary.avgPercentCorrect ??
    question.realAvgPercentCorrect ??
    0
  );
  const percentSnippet = avgPercentCorrect > 0
    ? `; acerto real médio=${avgPercentCorrect.toFixed(1)}% em ${realAccuracy.itemsWithPercentCorrect || realParameterSummary.itemsWithPercentCorrect || 0} itens`
    : "";
  const fallbackDiscrimination =
    quality >= 70 ? "Muito alto" : quality >= 52 ? "Alto" : quality >= 34 ? "Médio" : quality >= 18 ? "Baixo" : "Muito baixo";
  const discrimination = realTriProfile?.estimatedDiscrimination || question.realTriEstimatedDiscrimination || fallbackDiscrimination;
  const difficultyMap = {
    easy: { difficulty: "Fácil", proficiency: "400-500" },
    medium: { difficulty: "Média", proficiency: "500-600" },
    hard: { difficulty: question.frequencyTier === "low" ? "Muito difícil" : "Difícil", proficiency: question.frequencyTier === "low" ? "700-800+" : "600-700" },
  };
  const realTriParameter = getRealTriDifficultyParameter(realTriProfile || question);
  const parameterB = realTriParameter || difficultyMap[question.difficulty] || difficultyMap.medium;
  const fallbackCasual = Array.isArray(question.options) && question.options.length === 5 && Array.isArray(question.alternativesAnalysis)
    ? "Baixo"
    : question.hasReliableOptions
      ? "Médio"
      : "Alto";
  const casual = realTriProfile?.estimatedCasual || question.realTriEstimatedCasual || fallbackCasual;
  const realJustification = realTriProfile
    ? `Estimativa baseada nos parâmetros TRI médios da habilidade ${realTriProfile.skill}: A=${realParameterSummary.avgA ?? "s/d"}, B=${realParameterSummary.avgB ?? "s/d"}, C=${realParameterSummary.avgC ?? "s/d"} em ${realParameterSummary.itemsWithTriParams || 0} itens${percentSnippet}.`
    : "";
  return {
    parameterA: {
      discrimination,
      justification:
        realJustification ||
        "Estimativa baseada em vínculo à matriz, qualidade dos distratores, presença de comentário, fonte oficial e confiabilidade das alternativas.",
    },
    parameterB,
    parameterC: {
      casual,
      justification:
        realJustification || "Estimativa pelo número de alternativas, força dos distratores e confiabilidade da transcrição.",
    },
  };
}

function getHistoricalIncidenceProfile(question = {}) {
  const realTriProfile = getRealTriSkillProfile(question.competencyId, question.matrixSkillCode);
  const frequency =
    question.frequencyTier === "high"
      ? "Alta"
      : question.frequencyTier === "medium"
        ? "Média"
        : question.frequencyTier === "low"
          ? "Baixa"
          : "Média";
  const sourceYear = String(question.source || "").match(/20\d{2}/)?.[0];
  const years = sourceYear ? [sourceYear] : [];
  return {
    frequency,
    recurrence: question.frequencyLabel || "Incidência em revisão",
    years,
    chargingForms: [question.skillTitle || "habilidade vinculada", question.visualSourceType || "interpretação do comando"].filter(Boolean),
    reappearanceProbability: question.frequencyTier === "high" ? "Alta" : question.frequencyTier === "low" ? "Baixa" : "Média",
    justification: realTriProfile
      ? `${realTriProfile.skill} ocupa o ${realTriProfile.rankInArea}º lugar da área na régua Medicina 2015-2025, com ${realTriProfile.totalItems} itens e tendência ${String(realTriProfile.trend || "estável").replaceAll("_", " ")}.`
      : question.frequencySource || "Régua interna aguardando ampliação da base histórica.",
  };
}

function inferStudyPriority(question = {}, tri = estimateTriParameters(question), frequency = getHistoricalIncidenceProfile(question)) {
  if (question.medicineCritical || question.beginnerCore || question.frequencyTier === "high") return "Prioridade Máxima";
  if (frequency.reappearanceProbability === "Alta" || tri.parameterA.discrimination === "Alto") return "Prioridade Alta";
  if (question.frequencyTier === "medium" || question.difficulty === "medium") return "Prioridade Média";
  return "Prioridade Baixa";
}

function inferTriGainPotential(question = {}, tri = estimateTriParameters(question), frequency = getHistoricalIncidenceProfile(question)) {
  const realTriProfile = getRealTriSkillProfile(question.competencyId, question.matrixSkillCode);
  const medicineScore = Number(realTriProfile?.medicineScore || question.realMedicineScore || 0);
  const realAccuracy = realTriProfile?.realAccuracy || question.realAccuracy || {};
  const avgPercentCorrect = Number(realAccuracy.avgPercentCorrect ?? question.realAvgPercentCorrect ?? 0);
  if (medicineScore >= 70 && avgPercentCorrect > 0 && avgPercentCorrect < 32) return "Muito alto";
  if (medicineScore >= 70 && avgPercentCorrect > 0 && avgPercentCorrect < 45 && ["Difícil", "Muito Difícil", "Média"].includes(tri.parameterB.difficulty)) return "Muito alto";
  if (medicineScore >= 95 && ["Difícil", "Muito Difícil", "Média"].includes(tri.parameterB.difficulty)) return "Muito alto";
  if (medicineScore >= 70) return "Alto";
  if (question.difficulty === "hard" && tri.parameterA.discrimination !== "Muito baixo") return "Muito alto";
  if (question.difficulty === "medium" && frequency.frequency !== "Baixa") return "Alto";
  if (question.difficulty === "easy" && question.frequencyTier === "high") return "Alto";
  if (question.frequencyTier === "low") return "Médio";
  return "Médio";
}

function inferIdealResolutionTime(question = {}) {
  if (question.difficulty === "hard") return question.cropImage || question.stimulusImage ? 4 : 3;
  if (question.difficulty === "medium") return question.cropImage || question.stimulusImage ? 3 : 2;
  return 2;
}

function inferStudentProfile(question = {}, tri = estimateTriParameters(question)) {
  const proficiency = tri.parameterB.proficiency;
  const skill = findSkillById(question.skillId);
  return {
    approximateProficiency: proficiency,
    masteredSkills: [skill?.core, question.matrixSkillDescription].filter(Boolean),
    commonErrors: [skill?.trap || "leitura parcial do comando", inferDistractorType("", question)].filter(Boolean),
  };
}

function renderMissionBlock(user, day, block, status) {
  const progress = getMissionBlock(user, day, block.areaId);
  const score = `${progress.bestScore || 0}/${DAILY_REQUIRED_BY_AREA}`;
  const accuracy = getSkillAccuracy(user, block.skill.id);
  const matrix = getPrimaryMatrixForSkill(block.skill.id);
  const clinicalCase = block.clinicalCase;
  return `
    <article class="mission-card ${progress.passed ? "done" : ""}">
      <div class="mission-card-head">
        <span class="competency-tag ${block.competency.colorClass}">${block.competency.short}</span>
        <span class="skill-count">${score}</span>
      </div>
      <div class="case-kicker">${escapeHTML(clinicalCase.specialty)} · ${escapeHTML(DIFFICULTY_LABELS[clinicalCase.difficulty])}</div>
      <h3>${escapeHTML(clinicalCase.title)}</h3>
      <p>${escapeHTML(clinicalCase.patient)}</p>
      <div class="case-vitals">
        <strong>Sinais vitais de estudo</strong>
        <span>${escapeHTML(clinicalCase.vitals)}</span>
      </div>
      <p class="case-skill">Habilidade do plantão: ${escapeHTML(block.skill.title)}.</p>
      <div class="mini-meta">
        <span>${escapeHTML(getMatrixCodeLabel(matrix))}</span>
        <span>Prioridade ${priorityLabel(block.priority)}</span>
        <span>${accuracy === null ? "sem histórico" : `${accuracy}% na habilidade`}</span>
      </div>
      <button class="${progress.passed ? "secondary-btn" : "primary-btn"}" data-start-area="${block.areaId}" type="button" ${status === "locked" ? "disabled" : ""}>
        ${progress.passed ? "Revisar caso" : "Atender caso"}
      </button>
    </article>
  `;
}

function renderMissionQuiz(user, day) {
  if (!quizState || quizState.day !== day || !quizState.areaId) return "";

  const block = getCurrentMission(user, day).find((item) => item.areaId === quizState.areaId);
  if (!block) return "";

  if (quizState.finished) {
    const score = quizState.score;
    const passed = score >= PASSING_SCORE;
    const clinicalCase = block.clinicalCase;
    return `
      <div class="feedback ${passed ? "success" : "fail"}">
        ${block.competency.short}: ${score}/5. ${
          passed
            ? `${escapeHTML(clinicalCase.success)}. Caso evoluído com segurança.`
            : "Conduta em ajuste: revise o raciocínio e refaça até chegar a 4 acertos."
        }
      </div>
      <div class="button-row">
        <button class="${passed ? "secondary-btn" : "primary-btn"}" data-start-area="${block.areaId}" type="button">${passed ? "Revisar prontuário" : "Reatender caso"}</button>
      </div>
      <div class="quiz-feedback-list">
        ${quizState.items.map((question, index) => renderQuestionFeedbackCard(question, block, user, index)).join("")}
      </div>
    `;
  }

  const currentIndex = quizState.currentIndex;
  const question = quizState.items[currentIndex];
  const selected = quizState.answers[currentIndex];
  const progress = Math.round(((currentIndex + 1) / quizState.items.length) * 100);

  return `
    <div class="quiz-progress">
      <span>${block.clinicalCase.title}: questão ${currentIndex + 1} de ${quizState.items.length}</span>
      <div class="progress-track" aria-hidden="true"><div class="progress-fill" style="width: ${progress}%"></div></div>
    </div>
    <div class="question-box">
      <div class="patient-chart">
        <strong>${escapeHTML(block.clinicalCase.specialty)}</strong>
        <span>${escapeHTML(block.clinicalCase.patient)}</span>
      </div>
      <div class="mini-meta question-meta">
        <span>${escapeHTML(getMatrixCodeLabel(question))}</span>
        <span>${escapeHTML(DIFFICULTY_LABELS[question.difficulty] || "Média")}</span>
        <span>${escapeHTML(question.source || "Questão modelo")}</span>
      </div>
      <p class="question-title">${escapeHTML(getQuestionPrompt(question))}</p>
      ${renderQuestionVisual(question, currentIndex + 1)}
      ${renderMatrixCallout(question)}
      <div class="option-list">
        ${question.options
          .map(
            (option, index) => `
              <button class="option-btn ${selected === index ? "selected" : ""}" data-answer="${index}" type="button">
                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                <span>${escapeHTML(option)}</span>
              </button>
            `,
          )
          .join("")}
      </div>
    </div>
    <div class="button-row">
      <button class="secondary-btn" id="prevQuestionBtn" type="button" ${currentIndex === 0 ? "disabled" : ""}>Voltar</button>
      <button class="primary-btn" id="nextQuestionBtn" type="button" ${selected === undefined ? "disabled" : ""}>
        ${currentIndex === quizState.items.length - 1 ? "Corrigir" : "Próxima"}
      </button>
    </div>
  `;
}

function getQuestionPrompt(question) {
  if (question?.imported && question.cropImage) {
    return "Marque a alternativa correta.";
  }
  return question?.text || "Questão modelo";
}

function renderQuestionVisual(question, sequenceNumber = 1) {
  if (!question?.cropImage) return "";
  const displayNumber = String(sequenceNumber).padStart(2, "0");
  const bannerClass = question.day === 2 ? "day-two" : "day-one";
  const stimulus = question.stimulusImage
    ? `
      <div class="question-visual-block">
        <strong>Texto-base oficial</strong>
        <img class="question-crop-image" src="${escapeHTML(question.stimulusImage)}" alt="${escapeHTML(`Texto-base da ${question.source}, questões relacionadas à ${question.number}`)}" loading="lazy" />
      </div>
    `
    : "";
  return `
    <figure class="question-visual-card">
      ${stimulus}
      <div class="question-visual-block">
        <strong>Item do plantão</strong>
        <div class="question-crop-frame">
          <img class="question-crop-image" src="${escapeHTML(question.cropImage)}" alt="${escapeHTML(`${question.source}, questão ${question.number}`)}" loading="lazy" />
          <div class="question-crop-header ${bannerClass}" aria-hidden="true">
            <span>QUESTÃO ${displayNumber}</span>
          </div>
        </div>
      </div>
      <figcaption>
        ${escapeHTML(`${question.source}, item selecionado para esta habilidade.`)}
      </figcaption>
    </figure>
  `;
}

function getQuestionFeedback(question, block, user) {
  const parts = getQuestionFeedbackParts(question, block, user);
  return `${parts.answerLabel}. ${parts.explanation} ${parts.alternativesText} ${parts.matrixText} ${parts.studyText}`;
}

function renderQuestionFeedbackCard(question, block, user, index) {
  const parts = getQuestionFeedbackParts(question, block, user);
  const isCorrect = quizState.answers[index] === question.answer;
  return `
    <article class="question-feedback-card ${isCorrect ? "correct" : "review"}">
      <div class="question-feedback-head">
        <span>QUESTÃO ${String(index + 1).padStart(2, "0")}</span>
        <strong>${isCorrect ? "correta" : "revisar"}</strong>
      </div>
      <div class="question-feedback-section">
        <strong>Gabarito</strong>
        <p>${escapeHTML(parts.answerLabel)}</p>
      </div>
      <div class="question-feedback-section">
        <strong>Explicação comentada</strong>
        <p>${escapeHTML(parts.explanation)}</p>
      </div>
      ${
        parts.alternatives.length
          ? `<div class="question-feedback-section">
              <strong>Explicação dos distratores</strong>
              <ul>
                ${parts.alternatives.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
              </ul>
            </div>`
          : ""
      }
      ${
        parts.matrixText
          ? `<div class="question-feedback-section">
              <strong>Competência e habilidade</strong>
              <p>${escapeHTML(parts.matrixText)}</p>
            </div>`
          : ""
      }
      <div class="question-feedback-section">
        <strong>Conduta de estudo</strong>
        <p>${escapeHTML(parts.studyText)}</p>
      </div>
    </article>
  `;
}

function getQuestionFeedbackParts(question, block, user) {
  const skillAccuracy = getSkillAccuracy(user, block.skill.id);
  const priority = priorityLabel(block.priority);
  const matrixText = question.matrixSkillCode
    ? `Matriz ${getMatrixCodeLabel(question)}: ${question.matrixSkillDescription}.`
    : `${block.competency.short}: ${block.skill.title}.`;
  const answerLetter = Number.isInteger(question.answer) ? "ABCDE"[question.answer] : question.resolvedAnswer || question.officialAnswer || "";
  const answerText = Number.isInteger(question.answer) ? question.options?.[question.answer] : "";
  const directAnswerText = isGenericOptionText(answerText) ? "" : answerText;
  const answerLabel = answerLetter
    ? `Alternativa ${answerLetter}${directAnswerText ? ` - ${directAnswerText}` : ""}`
    : "Gabarito oficial não identificado.";
  const explanation = cleanFeedbackText(question.pedagogicalComment || question.explanation || "Confira o gabarito e refaça o raciocínio.");
  const alternatives = splitAlternativesAnalysis(question.alternativesAnalysis || "");
  const alternativesText = alternatives.length ? `Distratores: ${alternatives.join(" ")}` : "";
  const studyText = `Conduta: ${block.clinicalCase.vitals}. Prioridade: ${priority}${skillAccuracy === null ? " por ausência de histórico." : ` porque seu desempenho atual está em ${skillAccuracy}%.`} Mantenha as fáceis no radar para proteger a coerência da prova.`;
  return {
    answerLabel,
    explanation,
    alternatives,
    alternativesText,
    matrixText,
    studyText,
  };
}

function cleanFeedbackText(text = "") {
  return String(text)
    .replace(/\s*Análise das alternativas:.*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitAlternativesAnalysis(text = "") {
  const clean = String(text).replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const matches = [...clean.matchAll(/([A-E]\)\s.*?)(?=\s[A-E]\)\s|$)/g)].map((match) => match[1].trim());
  return matches.length ? matches : [clean];
}

function isGenericOptionText(text = "") {
  return /^Alternativa [A-E](?:\s*\([^)]*\))?$/i.test(String(text).trim());
}

function priorityLabel(score) {
  if (score >= 70) return "Alta";
  if (score >= 45) return "Média";
  return "Baixa";
}

function getMatrixCodeLabel(question) {
  if (!question?.matrixSkillCode) return "Matriz em revisão";
  return `${question.matrixCompetencyCode || "C?"} · ${question.matrixSkillCode}`;
}

function getPrimaryMatrixForSkill(skillId) {
  return (QUESTIONS[skillId] || []).find((question) => question.matrixSkillCode) || null;
}

function renderMatrixCallout(question) {
  if (!question?.matrixSkillCode) {
    return `
      <div class="matrix-callout">
        <strong>Matriz ENEM</strong>
        <span>Esta questão ainda precisa ser vinculada a uma habilidade oficial da matriz.</span>
      </div>
    `;
  }
  return `
    <div class="matrix-callout">
      <strong>Matriz ENEM 2026: ${escapeHTML(getMatrixCodeLabel(question))}</strong>
      <span>${escapeHTML(question.matrixSkillDescription || "Descrição da habilidade não encontrada.")}</span>
      <small>${escapeHTML(question.matrixLinkConfidence || "classificação pedagógica do app")}</small>
    </div>
  `;
}

function metric(label, value, helper) {
  return `
    <div class="metric-card">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${helper}</small>
    </div>
  `;
}

function renderTimer() {
  return `
    <div class="timer-box">
      <div class="timer-display">
        <strong id="timerValue">${formatSeconds(timer.seconds)}</strong>
        <span>${timer.mode}</span>
      </div>
      <div class="button-row">
        <button class="primary-btn" id="timerToggleBtn" type="button">${timer.running ? "Pausar" : "Iniciar"}</button>
        <button class="secondary-btn" data-timer-mode="focus" type="button">50 min</button>
        <button class="secondary-btn" data-timer-mode="short" type="button">10 min</button>
        <button class="ghost-btn" id="timerResetBtn" type="button">Reiniciar</button>
      </div>
    </div>
  `;
}

function renderSimuladoTimer() {
  return `
    <section class="panel simulado-timer-panel">
      <div class="panel-header">
        <div>
          <h2>Cronômetro oficial do simulado</h2>
          <p>Escolha o caderno e rode a prova no mesmo ritmo do ENEM.</p>
        </div>
        <span class="status-chip">${escapeHTML(timer.mode)}</span>
      </div>
      <div class="timer-box official-timer">
        <div class="timer-display">
          <strong id="timerValue">${formatSeconds(timer.seconds)}</strong>
          <span>${escapeHTML(timer.mode)}</span>
        </div>
        <div class="button-row">
          <button class="primary-btn" id="timerToggleBtn" type="button">${timer.running ? "Pausar" : "Iniciar"}</button>
          <button class="secondary-btn" data-timer-mode="enem-day-one" type="button">Dia 1 - 5h30</button>
          <button class="secondary-btn" data-timer-mode="enem-day-two" type="button">Dia 2 - 5h</button>
          <button class="ghost-btn" id="timerResetBtn" type="button">Reiniciar</button>
        </div>
      </div>
      <p class="simulado-timer-note">
        Dia 1: 13h30 às 19h, com redação manuscrita. Dia 2: 13h30 às 18h30. O aluno deve treinar pausa, marcação e conferência como no dia oficial.
      </p>
    </section>
  `;
}

function renderPlanView(user) {
  const day = selectedDay || getTargetDay(user);
  const level = classifyStudent(user);
  const priorities = getWeeklyPriorities(user).slice(0, 5);
  const profile = user.profile || {};
  const restBlocks = getProtectedRestBlocks(profile);

  return `
    <section class="grid metrics-grid">
      ${metric("Semana do dia", day, "gerada a partir do nível e erros recentes")}
      ${metric("Proporção", `${level.theory}%/${level.exercises}%`, "teoria e exercícios")}
      ${metric("Simulado", level.id === "iniciante" ? "por fase" : "rigoroso", "sábado é dia de prova")}
      ${metric("Descanso", `${restBlocks.length} blocos`, "proteção contra sobrecarga")}
    </section>

    <section class="grid weekly-layout">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Estrutura semanal</h2>
            <p>O aluno sabe exatamente o que fazer, sem depender de improviso.</p>
          </div>
          <span class="status-chip">${level.label}</span>
        </div>
        <div class="week-list">
          ${renderWeekRows(priorities, level)}
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Prioridades da semana</h2>
            <p>Ordenadas por desempenho, dificuldade, base interna e erro recente.</p>
          </div>
        </div>
        <div class="priority-list">
          ${priorities
            .map(
              (item) => `
                <div class="priority-row">
                  <span class="competency-tag ${item.competency.colorClass}">${item.competency.short}</span>
                  <div>
                    <strong>${escapeHTML(item.skill.title)}</strong>
                    <small>${escapeHTML(item.reason)}</small>
                  </div>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>
    </section>

    <section class="panel rest-panel">
      <div class="panel-header">
        <div>
          <h2>Descanso sem culpa</h2>
          <p>Recuperação mental e consolidação de memória entram como tarefa obrigatória.</p>
        </div>
        <span class="status-chip">${profile.sleep || "sono não informado"}</span>
      </div>
      <div class="rest-grid">
        ${restBlocks
          .map(
            (block) => `
              <div class="rest-card">
                <strong>${block.day}</strong>
                <span>${block.time}</span>
                <small>${block.reason}</small>
              </div>
            `,
          )
          .join("")}
      </div>
      <div class="feedback">Se a semana ficar sem pelo menos 4 blocos reais de descanso, o plano entra em risco alto de sobrecarga.</div>
    </section>
  `;
}

function getWeeklyPriorities(user) {
  const level = classifyStudent(user);
  return COMPETENCIES.flatMap((competency) =>
    competency.skills.map((skill) => {
      const accuracy = getSkillAccuracy(user, skill.id);
      const recent = hasRecentError(user, skill.id);
      const score = calculateSkillPriority(user, competency.id, skill.id, level.id);
      return {
        competency,
        skill,
        score,
        reason: `${accuracy === null ? "sem histórico suficiente" : `${accuracy}% de acerto`} + prioridade pedagógica${recent ? " + erro recente" : ""}.`,
      };
    }),
  ).sort((a, b) => b.score - a.score);
}

function renderWeekRows(priorities, level) {
  const main = priorities[0]?.skill.title || "habilidade prioritária";
  const second = priorities[1]?.skill.title || "revisão ativa";
  const third = priorities[2]?.skill.title || "lista adaptativa";
  const rows = [
    ["Segunda", `Correção profunda do simulado + retomada de ${main}.`],
    ["Terça", `Teoria dirigida (${level.theory}%) + 20 questões obrigatórias.`],
    ["Quarta", `Exercícios por habilidade + tema de redação da semana.`],
    ["Quinta", `Teoria curta + lista adaptativa em ${second}.`],
    ["Sexta", `Revisão ativa + lista estratégica em ${third}.`],
    ["Sábado", level.id === "iniciante" ? "Simulado por fase com relatório pedagógico." : "Simulado ENEM rigoroso com tempo controlado."],
    ["Domingo", "Correção final, replanejamento e descanso protegido."],
  ];
  return rows
    .map(
      ([day, activity]) => `
        <div class="week-row">
          <strong>${day}</strong>
          <span>${escapeHTML(activity)}</span>
        </div>
      `,
    )
    .join("");
}

function getProtectedRestBlocks(profile = {}) {
  const late = profile.sleep === "menos de 6h";
  const time = late ? "21h00 às 22h30" : "21h30 às 22h30";
  return [
    { day: "Segunda", time, reason: "descompressão pós-correção" },
    { day: "Quarta", time, reason: "consolidação após redação" },
    { day: "Sexta", time, reason: "preservar energia para simulado" },
    { day: "Domingo", time: "tarde livre protegida", reason: "replanejar sem culpa" },
  ];
}

function renderPlanCards(user, filter) {
  return PLAN.filter((day) => filter === "all" || day.competencyId === filter)
    .map((day) => {
      const status = getDayStatus(user, day.day);
      const score = user.progress?.[day.day]?.bestScore;
      return `
        <article class="plan-card ${status}">
          <div class="plan-card-header">
            <span class="day-pill">Dia ${day.day}</span>
            <span class="competency-tag ${day.colorClass}">${day.competencyShort}</span>
          </div>
          <h3>${day.skillTitle}</h3>
          <p>${day.focus}</p>
          <div class="mini-meta">
            <span>${day.phase}</span>
            <span>${statusLabel(status)}</span>
            ${score !== undefined ? `<span>${score}/5</span>` : ""}
          </div>
          <button class="${status === "locked" ? "ghost-btn" : "secondary-btn"}" data-select-day="${day.day}" type="button" ${status === "locked" ? "disabled" : ""}>Abrir dia</button>
        </article>
      `;
    })
    .join("");
}

function renderBankView() {
  const anuladas = IMPORTED_QUESTIONS.filter((question) => question.status === "anulada").length;
  const matrixSkillCount = Object.values(MATRIX_DATA.areas || {}).reduce(
    (total, area) => total + Object.keys(area.skills || {}).length,
    0,
  );
  return `
    <section class="grid metrics-grid bank-metrics">
      ${metric("Importadas", IMPORTED_QUESTIONS.length, "questões lidas dos PDFs")}
      ${metric("Corrigíveis", STRUCTURED_QUESTIONS.length, "com gabarito oficial")}
      ${metric("Matriz 2026", matrixSkillCount, "habilidades oficiais carregadas")}
      ${metric("Anuladas", anuladas, "mantidas fora do treino")}
    </section>
    <section class="bank-toolbar">
      <input id="bankSearch" type="search" placeholder="Buscar habilidade, área ou questão" aria-label="Buscar habilidade, área ou questão" />
      <span class="status-chip">${ENEM_DATA.generatedAt ? `Base gerada em ${formatDate(ENEM_DATA.generatedAt)}` : "Base local"}</span>
    </section>
    <section id="bankGrid" class="grid bank-grid">
      ${renderSkillCards("")}
    </section>
  `;
}

function getDisplayFrequencyRows(area, key) {
  const rows = Array.isArray(area?.[key]) ? area[key] : [];
  if (area?.id !== "linguagens") return rows;
  return rows.filter((row) => !LINGUAGENS_FOREIGN_LANGUAGE_SKILLS.has(row.skill));
}

function renderSkillCards(search) {
  const term = search.trim().toLowerCase();
  return COMPETENCIES.flatMap((competency) =>
    competency.skills.map((skill) => ({ competency, skill })),
  )
    .filter(({ competency, skill }) => {
      const text = `${competency.name} ${skill.title} ${skill.focus}`.toLowerCase();
      return !term || text.includes(term);
    })
    .map(({ competency, skill }) => {
      const count = QUESTIONS[skill.id]?.filter((question) => question.imported).length || 0;
      const total = QUESTIONS[skill.id]?.length || 0;
      return `
        <article class="skill-card">
          <span class="competency-tag ${competency.colorClass}">${competency.short}</span>
          <h3>${skill.title}</h3>
          <p>${skill.focus}</p>
          <span class="skill-count">${count ? `${count} ENEM` : `${total} modelo`}</span>
        </article>
      `;
    })
    .join("");
}

function renderQuestionSamples(search) {
  const term = search.trim().toLowerCase();
  const samples = STRUCTURED_QUESTIONS.filter((question) => {
    const text = `${question.source} ${question.area} ${question.skill} ${question.number} ${question.stem}`.toLowerCase();
    return !term || text.includes(term);
  }).slice(0, 6);

  if (!samples.length) return `<div class="empty-state">Nenhuma questão encontrada para essa busca.</div>`;

  return samples
    .map(
      (question) => `
        <article class="question-sample">
          <div class="mini-meta">
            <span>${escapeHTML(question.source)}</span>
            <span>Questão ${question.number}</span>
            ${question.pageNumber ? `<span>Página ${question.pageNumber}</span>` : ""}
            <span>${escapeHTML(getMatrixCodeLabel(question))}</span>
            <span>Gabarito ${question.answer}</span>
          </div>
          <h3>${escapeHTML(question.skill)}</h3>
          <small class="matrix-sample">${escapeHTML(question.matrixSkillDescription || "Habilidade da matriz em revisão.")}</small>
          <p>Questão preservada com enunciado, recursos visuais e alternativas.</p>
          ${question.cropImage ? `<img class="sample-question-thumb" src="${escapeHTML(question.cropImage)}" alt="${escapeHTML(`${question.source}, questão ${question.number}`)}" loading="lazy" />` : ""}
        </article>
      `,
    )
    .join("");
}

function renderDailyNewsView(user) {
  const endpoint = user.dailyNewsEndpoint || DAILY_NEWS_DEFAULT_ENDPOINT;
  const payload = getDailyNewsPayload(user);
  const brief = payload.brief || {};
  const focus = brief.enemFocus || {};
  const redacao = focus.redacao || {};
  const sections = Array.isArray(brief.sections) ? brief.sections : [];
  const sources = Array.isArray(payload.sources) ? payload.sources : [];
  const isSample = !user.dailyNewsPayload;

  return `
    <section class="grid metrics-grid">
      ${metric("Status", isSample ? "pronto" : "carregado", isSample ? "aguardando endpoint real" : "resumo salvo neste navegador")}
      ${metric("Fontes", `${payload.sourceCount || sources.length || 0}`, "manchetes usadas pelo gerador")}
      ${metric("Data", formatDailyNewsDate(brief.date || payload.generatedAt), "referência do plantão")}
      ${metric("Foco", "ENEM", "redação e quatro áreas")}
    </section>

    <section class="panel daily-news-hero">
      <div class="panel-header">
        <div>
          <h2>${escapeHTML(brief.headline || "Plantão de atualidades ENEM")}</h2>
          <p>Como doses homeopáticas de atualidades diariamente podem lhe tirar da internação e virar repertório, tema provável, proposta C5 e conexões com as áreas do ENEM.</p>
        </div>
        <span class="status-chip">${escapeHTML(isSample ? "modo preparo" : "notícias carregadas")}</span>
      </div>
      <div class="daily-news-setup-grid">
        <label class="field">
          <span>Endpoint do resumo diário</span>
          <input id="dailyNewsEndpointInput" value="${escapeHTML(endpoint)}" placeholder="/api/noticias/diarias" />
        </label>
        <div class="button-row daily-news-actions">
          <button class="primary-btn" id="fetchDailyNewsBtn" type="button">Buscar notícias</button>
          <button class="secondary-btn" id="useDailyNewsSampleBtn" type="button">Ver modelo</button>
        </div>
      </div>
      <label class="field daily-news-json-field">
        <span>Ou cole aqui o JSON gerado pelo endpoint</span>
        <textarea id="dailyNewsJsonInput" placeholder="Cole a resposta JSON de /api/noticias/diarias"></textarea>
      </label>
      <div class="button-row">
        <button class="secondary-btn" id="loadDailyNewsJsonBtn" type="button">Carregar JSON</button>
        <span id="dailyNewsStatus" class="daily-news-status" role="status"></span>
      </div>
    </section>

    ${renderDailyNewsRedacao(redacao)}
    ${renderDailyNewsObjectiveAreas(focus.objectiveAreas || {})}
    ${renderDailyNewsPedagogicalPick(brief.pedagogicalPick || {}, sources)}
    ${renderDailyNewsSections(sections, sources)}
    ${renderDailyNewsSources(sources)}
  `;
}

function getDailyNewsPayload(user) {
  return user.dailyNewsPayload?.brief ? user.dailyNewsPayload : DAILY_NEWS_SAMPLE_PAYLOAD;
}

function normalizeDailyNewsPayload(raw) {
  const value = typeof raw === "string" ? JSON.parse(raw) : raw;
  const payload = value?.brief
    ? value
    : {
        generatedAt: new Date().toISOString(),
        sourceCount: Array.isArray(value?.sources) ? value.sources.length : 0,
        brief: value,
        sources: Array.isArray(value?.sources) ? value.sources : [],
      };

  if (!payload?.brief || typeof payload.brief !== "object") {
    throw new Error("JSON sem o campo brief.");
  }

  return {
    generatedAt: payload.generatedAt || new Date().toISOString(),
    sourceCount: Number(payload.sourceCount || payload.sources?.length || 0),
    brief: payload.brief,
    sources: Array.isArray(payload.sources) ? payload.sources : [],
  };
}

async function fetchDailyNewsForUser(user, endpoint, status, options = {}) {
  const targetEndpoint = endpoint || DAILY_NEWS_DEFAULT_ENDPOINT;
  if (!targetEndpoint) {
    if (status) status.textContent = "Endpoint de Atualidades não configurado.";
    return false;
  }

  if (status) status.textContent = options.auto ? "Carregando plantão de hoje..." : "Buscando plantão...";

  try {
    const response = await fetch(targetEndpoint, { cache: "no-store" });
    if (!response.ok) throw new Error(`Resposta ${response.status}`);
    const payload = normalizeDailyNewsPayload(await response.json());
    user.dailyNewsEndpoint = targetEndpoint;
    user.dailyNewsPayload = payload;
    saveCurrentUser(user);
    render();
    return true;
  } catch (error) {
    if (status) status.textContent = `Não consegui buscar agora. Confira a API ou tente novamente. ${error.message || error}`;
    return false;
  }
}

function renderDailyNewsRedacao(redacao) {
  const themes = toTextList(redacao.possibleThemes);
  const angles = Array.isArray(redacao.interventionAngles) ? redacao.interventionAngles : [];
  return `
    <section class="panel redacao-wide daily-news-section">
      <div class="panel-header">
        <div>
          <h2>Redação ENEM</h2>
          <p>O resumo diário vira repertório, tema provável e intervenção completa.</p>
        </div>
        <span class="status-chip">C2 + C5</span>
      </div>
      <div class="daily-news-redacao-grid">
        <article class="news-card highlight">
          <strong>Repertório aproveitável</strong>
          <p>${escapeHTML(redacao.repertorio || "Aguardando geração do repertório do dia.")}</p>
        </article>
        <article class="news-card">
          <strong>Temas possíveis</strong>
          ${renderNewsList(themes, "Sem temas gerados ainda.")}
        </article>
      </div>
      <div class="news-card-grid">
        ${angles.length
          ? angles.map((angle) => renderInterventionAngle(angle)).join("")
          : `<article class="news-card"><strong>Intervenção C5</strong><p>Aguardando ângulos de intervenção do resumo diário.</p></article>`}
      </div>
    </section>
  `;
}

function renderInterventionAngle(angle) {
  const rows = [
    ["Tema", angle.theme],
    ["Agente", angle.agent],
    ["Ação", angle.action],
    ["Meio/modo", angle.means],
    ["Finalidade", angle.purpose],
    ["Detalhamento", angle.detail],
  ].filter(([, value]) => value);
  return `
    <article class="news-card intervention-card">
      <strong>Proposta de intervenção</strong>
      <div class="intervention-rows">
        ${rows
          .map(
            ([label, value]) => `
              <div><span>${escapeHTML(label)}</span><p>${escapeHTML(value)}</p></div>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderDailyNewsObjectiveAreas(areas) {
  const items = [
    { key: "linguagens", label: "Linguagens", tag: "LG", prescription: "Anamnese textual da notícia" },
    { key: "matematica", label: "Matemática", tag: "MT", prescription: "Raio-X dos números do dia" },
    { key: "cienciasHumanas", label: "Ciências Humanas", tag: "CH", prescription: "Anamnese social do Brasil" },
    { key: "cienciasDaNatureza", label: "Ciências da Natureza", tag: "CN", prescription: "Exame laboratorial da notícia" },
  ];
  return `
    <section class="panel redacao-wide">
      <div class="panel-header">
        <div>
          <h2>Doses homeopáticas de atualidades</h2>
          <p>Como uma notícia por dia pode tirar o futuro médico da internação e virar leitura, dado, contexto ou problema científico.</p>
        </div>
      </div>
      <div class="daily-news-area-grid">
        ${items
          .map(
            (item) => `
              <article class="news-card">
                <span class="competency-tag">${escapeHTML(item.tag)}</span>
                <span class="news-medical-dose"><strong>${escapeHTML(item.prescription)}</strong></span>
                <strong>${escapeHTML(item.label)}</strong>
                ${renderNewsList(toTextList(areas[item.key]), "Aguardando conexão didática.")}
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderDailyNewsPedagogicalPick(pick, sources) {
  const firstArea = toTextList(pick.enemAreas)[0] || "ENEM";
  return `
    <section class="panel redacao-wide daily-news-pick">
      <div class="panel-header">
        <div>
          <h2>Melhor aposta pedagógica do dia</h2>
          <p>Escolha principal para aula, repertório ou treino autoral.</p>
        </div>
        <span class="status-chip">${escapeHTML(firstArea)}</span>
      </div>
      <article class="news-card highlight">
        <strong>${escapeHTML(pick.title || "Aguardando seleção pedagógica")}</strong>
        <p>${escapeHTML(pick.reason || "Quando o endpoint estiver conectado, o app destacará a notícia mais útil para Redação ENEM e interdisciplinaridade.")}</p>
        <p>${escapeHTML(pick.suggestedUse || "")}</p>
        ${renderNewsSourceLinks(pick.sourceIds, sources)}
      </article>
    </section>
  `;
}

function renderDailyNewsSections(sections, sources) {
  if (!sections.length) return `<section class="panel redacao-wide"><div class="empty-state">Sem seções de notícias carregadas.</div></section>`;
  return `
    <section class="panel redacao-wide">
      <div class="panel-header">
        <div>
          <h2>Notícias organizadas para o ENEM</h2>
          <p>Resumo, uso provável no exame e fonte original para checagem.</p>
        </div>
      </div>
      <div class="daily-news-section-grid">
        ${sections
          .map(
            (section) => `
              <article class="news-card section-card">
                <h3>${escapeHTML(section.title || "Seção")}</h3>
                ${(section.bullets || [])
                  .map(
                    (bullet) => `
                      <div class="news-bullet">
                        <strong>${escapeHTML(bullet.title || "Notícia")}</strong>
                        <p>${escapeHTML(bullet.summary || "")}</p>
                        <small>${escapeHTML(bullet.enemUse || "")}</small>
                        ${renderNewsAreaPills(bullet.enemAreas)}
                        ${renderNewsSourceLinks(bullet.sourceIds, sources)}
                      </div>
                    `,
                  )
                  .join("")}
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderDailyNewsSources(sources) {
  if (!sources.length) {
    return `
      <section class="panel redacao-wide">
        <div class="empty-state">As fontes originais aparecerão aqui depois que o endpoint real for carregado.</div>
      </section>
    `;
  }
  return `
    <section class="panel redacao-wide">
      <div class="panel-header">
        <div>
          <h2>Fontes originais</h2>
          <p>O aluno deve validar contexto, data e desdobramentos antes de usar como repertório.</p>
        </div>
      </div>
      <div class="news-source-list">
        ${sources
          .slice(0, 18)
          .map(
            (source) => `
              <a class="news-source-row" href="${escapeHTML(source.url || "#")}" target="_blank" rel="noopener noreferrer">
                <span>${escapeHTML(source.section || "Fonte")}</span>
                <strong>${escapeHTML(source.title || "Notícia")}</strong>
                <small>${escapeHTML(source.source || formatDailyNewsDate(source.publishedAt) || "abrir fonte")}</small>
              </a>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderNewsList(items, emptyText) {
  if (!items.length) return `<p>${escapeHTML(emptyText)}</p>`;
  return `
    <ul class="news-list">
      ${items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
    </ul>
  `;
}

function renderNewsAreaPills(areas) {
  const items = toTextList(areas);
  if (!items.length) return "";
  return `<div class="news-pill-row">${items.map((item) => `<span>${escapeHTML(item)}</span>`).join("")}</div>`;
}

function renderNewsSourceLinks(sourceIds = [], sources = []) {
  const ids = Array.isArray(sourceIds) ? sourceIds : [];
  if (!ids.length) return "";
  return `
    <div class="news-source-links">
      ${ids
        .map((id) => {
          const source = sources.find((item) => String(item.id) === String(id));
          const label = source?.source || source?.section || `Fonte ${id}`;
          if (!source?.url) return `<span>${escapeHTML(label)}</span>`;
          return `<a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>`;
        })
        .join("")}
    </div>
  `;
}

function toTextList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function formatDailyNewsDate(value) {
  if (!value) return "a definir";
  const raw = String(value);
  const date = new Date(raw.includes("T") ? raw : `${raw}T00:00:00`);
  if (Number.isNaN(date.getTime())) return raw;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(date);
}

function renderSimuladoView(user) {
  const level = classifyStudent(user);
  const plan = buildSimuladoPlan(user, level);
  const indicators = getPerformanceIndicators(user);
  const weakSkills = getSkillsBelowTarget(user).slice(0, 8);
  return `
    <section class="grid metrics-grid">
      ${metric("Simulado sábado", `${SIMULADO_TOTAL_QUESTIONS}`, "questões no padrão ENEM completo")}
      ${metric("Redação", "manual", "escreve, escaneia e envia para correção")}
      ${metric("Nível atual", level.label, getSimuladoLevelProtocol(level).short)}
      ${metric("Próximo sábado", getNextSaturdayLabel(), "prova cronometrada")}
    </section>

    ${renderSimuladoTimer()}
    ${renderNotasPorAcertosTriPanel()}

    <section class="panel simulado-hero-panel">
      <div class="panel-header">
        <div>
          <h2>Protocolo de prova do sábado</h2>
          <p>${escapeHTML(getSimuladoLevelProtocol(level).description)}</p>
        </div>
        <span class="status-chip">${escapeHTML(level.label)}</span>
      </div>
      <div class="simulado-protocol-grid">
        ${SIMULADO_ENEM_TIMES.map(
          (item) => `
            <article class="simulado-time-card">
              <span>${escapeHTML(item.label)}</span>
              <strong>${escapeHTML(item.start)} - ${escapeHTML(item.end)}</strong>
              <p>${escapeHTML(item.duration)} oficiais. ${escapeHTML(item.areas)}.</p>
            </article>
          `,
        ).join("")}
      </div>
    </section>

    <section class="grid simulado-layout">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Distribuição das 180 questões</h2>
            <p>45 questões por grande área, com dificuldade ajustada ao nível do aluno.</p>
          </div>
        </div>
        <div class="simulado-area-grid">
          ${plan.areas.map((area) => renderSimuladoAreaCard(area)).join("")}
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Redação manuscrita</h2>
            <p>O aluno escreve à mão, escaneia e envia. A correção por OCR entra na etapa com servidor.</p>
          </div>
        </div>
        <div class="simulado-redacao-box">
          <label class="field">
            <span>Upload do PDF ou imagem da redação</span>
            <input id="simuladoEssayUpload" type="file" accept="application/pdf,image/*" />
          </label>
          <div class="feedback">
            Protocolo de correção: OCR da letra manuscrita, marcações coloridas por C1 a C5, justificativa de cada marcação e nota conforme cartilha oficial do ENEM.
          </div>
        </div>
      </article>
    </section>

    <section class="panel redacao-wide">
      <div class="panel-header">
        <div>
          <h2>Indicadores por competência</h2>
          <p>Percentual de acertos acumulado por grande área. Após os simulados, este painel guia o plano da semana.</p>
        </div>
      </div>
      ${renderCompetencyIndicatorGrid(indicators.competencies)}
    </section>

    <section class="panel redacao-wide">
      <div class="panel-header">
        <div>
          <h2>Indicadores por habilidade</h2>
          <p>As habilidades abaixo mostram acerto, volume e prioridade de revisão.</p>
        </div>
      </div>
      ${renderSkillIndicatorTable(indicators.skills)}
    </section>

    <section class="panel redacao-wide">
      <div class="panel-header">
        <div>
          <h2>Plano pós-simulado</h2>
          <p>A semana seguinte deve nascer dos erros do simulado: primeiro as fáceis perdidas, depois médias e, só para alta performance, difíceis.</p>
        </div>
        <span class="status-chip">${weakSkills.length || 0} prioridades</span>
      </div>
      ${renderPostSimuladoPlan(weakSkills, level)}
    </section>
  `;
}

function renderNotasPorAcertosTriPanel() {
  const rows = Array.isArray(NOTAS_ACERTOS_TRI_DATA.rows) ? NOTAS_ACERTOS_TRI_DATA.rows : [];
  const year = Number(NOTAS_ACERTOS_TRI_DATA.latestYear) || Math.max(...rows.map((row) => Number(row.year)).filter(Number.isFinite));
  if (!rows.length || !Number.isFinite(year)) return "";

  const reference = [
    { area: "LC", label: "Linguagens", hits: 31 },
    { area: "CH", label: "Humanas", hits: 34 },
    { area: "CN", label: "Natureza", hits: 22 },
    { area: "MT", label: "Matemática", hits: 24 },
  ];

  return `
    <section class="panel redacao-wide">
      <div class="panel-header">
        <div>
          <h2>Nota provável por acertos</h2>
          <p>Veja quanto alunos com esses acertos costumaram tirar no ENEM.</p>
        </div>
        <span class="status-chip">${year}</span>
      </div>
      <div class="simulado-area-grid">
        ${reference.map((item) => renderNotasPorAcertosTriCard(item, year)).join("")}
      </div>
    </section>
  `;
}

function renderNotasPorAcertosTriCard(item, year) {
  const row = findNotasPorAcertosTriRow(year, item.area, item.hits);
  if (!row) {
    return `
      <article class="simulado-area-card">
        <div class="plan-card-header">
          <span class="competency-tag">${escapeHTML(item.area)}</span>
          <span class="day-pill">${item.hits}/45</span>
        </div>
        <h3>${escapeHTML(item.label)}</h3>
        <p>Faixa ainda não disponível para este recorte.</p>
      </article>
    `;
  }

  return `
    <article class="simulado-area-card">
      <div class="plan-card-header">
        <span class="competency-tag">${escapeHTML(item.area)}</span>
        <span class="day-pill">${item.hits}/45</span>
      </div>
      <h3>${escapeHTML(item.label)}</h3>
      <div class="simulado-difficulty-row">
        <span>Nota média: <strong>${formatTriScore(row.mean)}</strong></span>
        <span>Nota do meio: <strong>${formatTriScore(row.median)}</strong></span>
      </div>
      <div class="simulado-skill-list">
        <div>
          <strong>${formatTriScore(row.p25)} a ${formatTriScore(row.p75)}</strong>
          <small>faixa mais comum para esses acertos</small>
        </div>
        <div>
          <strong>${formatTriScore(row.p90)}</strong>
          <small>nota alta de referência; ${formatTriSample(row.sample)} alunos na base</small>
        </div>
      </div>
    </article>
  `;
}

function findNotasPorAcertosTriRow(year, area, hits) {
  const rows = Array.isArray(NOTAS_ACERTOS_TRI_DATA.rows) ? NOTAS_ACERTOS_TRI_DATA.rows : [];
  return rows.find((row) => Number(row.year) === Number(year) && row.area === area && Number(row.hits) === Number(hits));
}

function formatTriScore(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "s/d";
  return numeric.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function formatTriSample(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "amostra sem dado";
  return numeric.toLocaleString("pt-BR");
}

function renderSimuladoAreaCard(area) {
  return `
    <article class="simulado-area-card">
      <div class="plan-card-header">
        <span class="competency-tag ${area.competency.colorClass}">${area.competency.short}</span>
        <span class="day-pill">${area.total}</span>
      </div>
      <h3>${escapeHTML(area.competency.name)}</h3>
      <div class="simulado-difficulty-row">
        <span>Fáceis: <strong>${area.targets.easy}</strong></span>
        <span>Médias: <strong>${area.targets.medium}</strong></span>
        <span>Difíceis: <strong>${area.targets.hard}</strong></span>
      </div>
      <div class="simulado-skill-list">
        ${area.skills
          .map(
            (item) => `
              <div>
                <strong>${escapeHTML(item.skill.title)}</strong>
                <small>${escapeHTML(item.count)} itens previstos - prioridade de treino ajustada ao nível</small>
              </div>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function buildSimuladoPlan(user, level) {
  const protocol = getSimuladoLevelProtocol(level);
  return {
    level,
    protocol,
    areas: COMPETENCIES.map((competency) => {
      const targets = getSimuladoQuestionTargets(protocol.mix);
      const rankedSkills = competency.skills
        .map((skill) => ({
          skill,
          recurrence: getSkillRecurrence(skill.id, competency.id),
          priority: calculateSkillPriority(user, competency.id, skill.id, level.id),
        }))
        .sort((a, b) => b.recurrence + b.priority - (a.recurrence + a.priority));
      const skills = distributeSimuladoSkills(rankedSkills.slice(0, protocol.skillBreadth), SIMULADO_QUESTIONS_BY_AREA);
      return {
        competency,
        total: SIMULADO_QUESTIONS_BY_AREA,
        targets,
        skills,
      };
    }),
  };
}

function getSimuladoLevelProtocol(level) {
  if (level.id === "iniciante") {
    return {
      short: "somente fáceis recorrentes",
      description:
        "Iniciante faz somente questões fáceis das competências e habilidades mais recorrentes. O objetivo é consolidar base e proteger a coerência da prova.",
      mix: { easy: 100, medium: 0, hard: 0 },
      skillBreadth: 5,
    };
  }
  if (level.id === "avancado") {
    return {
      short: "simulado completo com base protegida",
      description:
        "Alta performance mantém questões fáceis para proteger coerência de prova e acrescenta médias, difíceis e raras para buscar diferenciação.",
      mix: { easy: 25, medium: 40, hard: 35 },
      skillBreadth: 9,
    };
  }
  return {
    short: "fáceis e médias com incremento de desempenho",
    description:
      "Intermediário mantém fáceis importantes, amplia médias e insere poucas difíceis para ganhar repertório sem quebrar a coerência da prova.",
    mix: { easy: 35, medium: 55, hard: 10 },
    skillBreadth: 7,
  };
}

function getSimuladoQuestionTargets(mix) {
  const raw = {
    easy: Math.round((mix.easy / 100) * SIMULADO_QUESTIONS_BY_AREA),
    medium: Math.round((mix.medium / 100) * SIMULADO_QUESTIONS_BY_AREA),
    hard: Math.round((mix.hard / 100) * SIMULADO_QUESTIONS_BY_AREA),
  };
  while (raw.easy + raw.medium + raw.hard < SIMULADO_QUESTIONS_BY_AREA) raw.medium += 1;
  while (raw.easy + raw.medium + raw.hard > SIMULADO_QUESTIONS_BY_AREA) {
    if (raw.medium > 0) raw.medium -= 1;
    else if (raw.easy > 0) raw.easy -= 1;
    else raw.hard -= 1;
  }
  return raw;
}

function distributeSimuladoSkills(rankedSkills, total) {
  if (!rankedSkills.length) return [];
  const base = Math.floor(total / rankedSkills.length);
  let rest = total - base * rankedSkills.length;
  return rankedSkills.map((item) => ({
    ...item,
    count: base + (rest-- > 0 ? 1 : 0),
  }));
}

function getPerformanceIndicators(user) {
  const attempts = user.attemptLog || [];
  const competencies = COMPETENCIES.map((competency) => {
    const compAttempts = attempts.filter((attempt) => attempt.competencyId === competency.id);
    const correct = compAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const total = compAttempts.reduce((sum, attempt) => sum + (attempt.total || DAILY_REQUIRED_BY_AREA), 0);
    return {
      competency,
      correct,
      total,
      percent: total ? Math.round((correct / total) * 100) : 0,
    };
  });
  const skills = COMPETENCIES.flatMap((competency) =>
    competency.skills.map((skill) => {
      const skillAttempts = attempts.filter((attempt) => attempt.skillId === skill.id);
      const correct = skillAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
      const total = skillAttempts.reduce((sum, attempt) => sum + (attempt.total || DAILY_REQUIRED_BY_AREA), 0);
      return {
        competency,
        skill,
        correct,
        total,
        percent: total ? Math.round((correct / total) * 100) : 0,
        recurrence: getSkillRecurrence(skill.id, competency.id),
      };
    }),
  ).sort((a, b) => {
    const aMissing = a.total ? 0 : 1;
    const bMissing = b.total ? 0 : 1;
    if (aMissing !== bMissing) return aMissing - bMissing;
    return a.percent - b.percent || b.recurrence - a.recurrence;
  });
  return { competencies, skills };
}

function renderCompetencyIndicatorGrid(items) {
  return `
    <div class="simulado-indicator-grid">
      ${items
        .map(
          (item) => `
            <article class="indicator-card">
              <span class="competency-tag ${item.competency.colorClass}">${item.competency.short}</span>
              <strong>${item.total ? `${item.percent}%` : "sem dados"}</strong>
              <small>${item.total ? `${item.correct}/${item.total} acertos` : "aguardando simulado ou plantão"}</small>
              <div class="bar-track"><div class="bar-fill" style="width: ${item.percent}%"></div></div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderSkillIndicatorTable(items) {
  const visible = items.slice(0, 16);
  if (!visible.length) return `<div class="empty-state">Sem indicadores de habilidade ainda.</div>`;
  return `
    <div class="skill-indicator-table">
      ${visible
        .map(
          (item) => `
            <div class="skill-indicator-row">
              <span class="competency-tag ${item.competency.colorClass}">${item.competency.short}</span>
              <div>
                <strong>${escapeHTML(item.skill.title)}</strong>
                <small>${escapeHTML(item.skill.focus)}</small>
              </div>
              <span>${item.total ? `${item.percent}%` : "sem dados"}</span>
              <small>${item.total ? `${item.correct}/${item.total}` : "aguardando treino"}</small>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderPostSimuladoPlan(weakSkills, level) {
  if (!weakSkills.length) {
    return `
      <div class="feedback success">
        Sem histórico suficiente de erros. Depois do primeiro simulado, o plano semanal será recalculado pelas habilidades com menor percentual.
      </div>
    `;
  }
  return `
    <div class="post-simulado-grid">
      ${weakSkills
        .map(
          (item, index) => `
            <article class="post-simulado-card">
              <span class="day-pill">${index + 1}</span>
              <h3>${escapeHTML(item.skill.title)}</h3>
              <p>${escapeHTML(item.skill.focus)}</p>
              <small>${escapeHTML(level.id === "iniciante" ? "Revisar com questões fáceis recorrentes." : level.id === "avancado" ? "Inserir médias e difíceis para ganho de desempenho." : "Reforçar fáceis e médias antes das difíceis.")}</small>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function getNextSaturdayLabel() {
  const date = new Date();
  const daysUntilSaturday = (6 - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + daysUntilSaturday);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(date);
}

function renderRedacaoView(user) {
  const redacao = ENEM_DATA.redacao || {};
  const competencies = getRedacaoCompetencies(redacao);
  const essays = getEditableEssays(user, redacao);
  const theme = user.weeklyEssayTheme || "Desafios para valorizar a saúde mental dos estudantes no Brasil";
  const repertories = REDACTION_LIBRARY.repertories;
  const sourcePacks = REDACTION_LIBRARY.sourcePacks;
  const rubricAlerts = REDACTION_LIBRARY.rubricAlerts;
  const authorCrossovers = REDACTION_LIBRARY.authorCrossovers;
  const premiumTopicPacks = REDACTION_LIBRARY.premiumTopicPacks || [];
  const themeArchive = REDACTION_LIBRARY.themeArchive || [];
  const themePatternAnalysis = REDACTION_LIBRARY.themePatternAnalysis || {};
  const dailyC1Tips = getDailyC1Tips(user);
  const redacaoWeek = getActiveRedacaoWeek(user);
  const redacaoSummary = getRedacaoWeekSummary(user, redacaoWeek);
  const activeEssayYear = user.redacaoEssayYear || "todos";

  return `
    <section class="grid metrics-grid">
      ${metric("Competências", competencies.length || 5, "matriz oficial da redação")}
      ${metric("Nota máxima", "1000", "cinco critérios de 200 pontos")}
      ${metric("Média semanal", redacaoSummary.average ? redacaoSummary.average : "sem nota", `${redacaoSummary.filled}/3 redações lançadas`)}
      ${metric("Meta redação", redacaoSummary.target.label, redacaoSummary.target.helper)}
    </section>

    <section class="grid redacao-layout">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Medicação Caseira para o 1000</h2>
            <p>Os cinco critérios oficiais funcionam como sinais vitais: se um cai, a nota sente.</p>
          </div>
        </div>
        <div class="competency-list">
          ${competencies
            .map(
              (item) => `
                <div class="competency-row">
                  <span class="day-pill">C${item.number}</span>
                  <div>
                    <h3>${escapeHTML(item.title)}</h3>
                    <p>${escapeHTML(item.summary)}</p>
                    <small>${escapeHTML(item.studentAction)}</small>
                  </div>
                </div>
              `,
            )
            .join("")}
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Prontuário do tema da semana</h2>
            <p>Ao cadastrar o tema, o app abre uma prescrição de escrita para treino.</p>
          </div>
        </div>
        <label class="field">
          <span>Tema</span>
          <input id="essayThemeInput" value="${escapeHTML(theme)}" />
        </label>
        <div class="button-row">
          <button class="primary-btn" id="saveEssayThemeBtn" type="button">Gerar prescrição</button>
          <button class="secondary-btn" id="spinEssayPlanBtn" type="button">Nova conduta</button>
        </div>
        <div class="essay-plan" id="essayPlan">
          ${renderEssayPlan(theme, user.essayPlanSeed || 0)}
        </div>
      </article>
    </section>

    ${renderPremiumTopicPacks(premiumTopicPacks)}

    ${renderRedacaoScoreTracker(user, redacaoWeek)}

    ${renderRedacaoMicrodataPanel(REDACTION_MICRODATA)}

    <section class="panel redacao-wide redacao-official-panel">
      <div class="panel-header">
        <div>
          <h2>Protocolo do corretor na prática</h2>
          <p>Condutas oficiais da cartilha: o que estabiliza a nota e o que manda o texto para observação.</p>
        </div>
        <span class="status-chip">INEP 2025</span>
      </div>
      ${renderRubricAlerts(rubricAlerts)}
    </section>

    <section class="panel redacao-wide source-library-panel">
      <div class="panel-header">
        <div>
          <h2>Prontuário de Leitura ENEM</h2>
          <p>Fontes, trechos de consulta e modo de uso para prescrever repertório sem abrir documento gigante.</p>
        </div>
        <span class="status-chip">${sourcePacks.length} fontes em estoque</span>
      </div>
      ${renderSourceReadingRoom(sourcePacks)}
    </section>

    ${renderThemePatternMap(themePatternAnalysis, themeArchive)}

    <section class="panel redacao-wide author-crossover-panel">
      <div class="panel-header">
          <div>
          <h2>Junta médica de repertórios</h2>
          <p>Combinações para abrir com repertório forte e fechar com intervenção coerente, sem parecer modelo decorado.</p>
        </div>
        <span class="status-chip">${authorCrossovers.length} rotas</span>
      </div>
      ${renderAuthorCrossovers(authorCrossovers)}
    </section>

    <section class="panel redacao-wide">
      <div class="panel-header">
        <div>
          <h2>Farmácia da Norma Culta</h2>
          <p>Plantão C1 com 3 prescrições do dia e lupa para resgatar qualquer regra do prontuário.</p>
        </div>
        <span class="status-chip">plantão do dia</span>
      </div>
      <div class="c1-pharmacy-toolbar">
        <label class="field">
          <span>Lupa do prontuário C1</span>
          <input id="c1TipSearchInput" placeholder="Ex.: crase, vírgula, concordância, registro formal..." />
        </label>
      </div>
      <div id="c1TipBoard">
        ${renderC1TipBoard(dailyC1Tips)}
      </div>
    </section>

    <section class="panel redacao-wide">
      <div class="panel-header">
        <div>
          <h2>Farmácia de Repertórios</h2>
          <p>Doses de autores, leis, dados e referências culturais para montar argumentos com alta argumentativa.</p>
        </div>
        <span class="status-chip">${repertories.length} prescrições</span>
      </div>
      ${renderRepertoryBank(repertories)}
    </section>

    <section class="grid redacao-layout">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Exames por competência</h2>
            <p>C2, C4 e C5 com diagnóstico rápido: fraco versus forte.</p>
          </div>
        </div>
        ${renderCompetencyExamples()}
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Checklist de alta textual</h2>
            <p>Antes de enviar, revise como banca: forma, argumento e intervenção.</p>
          </div>
        </div>
        <ul class="task-list">
          <li>Introdução com repertório, tese e dois eixos claros.</li>
          <li>Desenvolvimentos com tópico frasal, causa, consequência e prova.</li>
          <li>Conectivos variados, sem repetir “além disso” em todo parágrafo.</li>
          <li>Intervenção com agente, ação, modo, finalidade e detalhamento.</li>
          <li>C1 revisada: concordância, crase, pontuação, registro e vocabulário.</li>
        </ul>
      </article>
    </section>

    <section class="panel essay-panel redacao-wide">
      <div class="panel-header">
        <div>
          <h2>Prontuário de redações nota 1000</h2>
          <p>Organizadas por ano, tema, aluno e parágrafos. Pesquise trechos e ajuste quando novos anexos entrarem.</p>
        </div>
      </div>
      <div class="essay-search-toolbar">
        <label class="field">
          <span>Buscar no prontuário: trecho, tema, ano ou aluno</span>
          <input id="essaySearchInput" placeholder="Ex.: crase, Constituição, 2024, Caio..." />
        </label>
        <button class="secondary-btn compact-btn" id="clearEssaySearchBtn" type="button">Limpar</button>
      </div>
      ${renderEssayYearTabs(essays, activeEssayYear)}
      <div class="editable-essay-grid" id="essayLibrary">
        ${renderEssayCards(essays, "", activeEssayYear)}
      </div>
    </section>
  `;
}

function renderPremiumTopicPacks(packs = []) {
  if (!packs.length) return "";
  return `
    <section class="panel redacao-wide premium-topic-panel">
      <div class="panel-header">
        <div>
          <h2>Plantão de Repertório por Competência</h2>
          <p>Prescrições curtas para transformar tema, repertório e intervenção em texto autoral de alto desempenho.</p>
        </div>
        <span class="status-chip">prescrição ativa</span>
      </div>
      <div class="premium-topic-grid">
        ${packs.map((pack) => renderPremiumTopicPack(pack)).join("")}
      </div>
    </section>
  `;
}

function renderPremiumTopicPack(pack) {
  return `
    <article class="premium-topic-card">
      <div class="premium-topic-head">
        <div>
          <span>Prontuário do tema</span>
          <h3>${escapeHTML(pack.title)}</h3>
          <p>${escapeHTML(pack.theme)}</p>
        </div>
      </div>
      <div class="premium-protocol-box">
        <strong>Diagnóstico do plantão</strong>
        <p>Use as caixas abaixo como doses de repertório e escrita: cada competência recebe apenas o trecho necessário para montar uma redação própria, sem abrir material corrido.</p>
      </div>
      <div class="premium-competency-grid">
        ${(pack.competencyBoxes || []).map((box) => renderPremiumCompetencyBox(pack.id, box)).join("")}
      </div>
    </article>
  `;
}

function renderPremiumCompetencyBox(packId, box) {
  const copyId = `premium-${packId}-${box.code}`.replace(/[^a-z0-9_-]/gi, "-");
  return `
    <article class="premium-competency-box">
      <div class="training-paragraph-head">
        <span class="day-pill">${escapeHTML(box.code)}</span>
        <div>
          <h4>${escapeHTML(box.title)}</h4>
          <small>${escapeHTML(box.focus)}</small>
        </div>
      </div>
      <textarea id="${escapeHTML(copyId)}" class="premium-copy-text" rows="7">${escapeHTML(box.text)}</textarea>
      <div class="premium-note">
        <strong>Olhar de corretor</strong>
        <span>${escapeHTML(box.note)}</span>
      </div>
      <button class="secondary-btn compact-btn" type="button" data-copy-target="${escapeHTML(copyId)}" data-copy-label="Copiar trecho">Copiar trecho</button>
    </article>
  `;
}

function renderThemePatternMap(analysis = {}, themes = []) {
  const trendCards = analysis.trendCards || [];
  const indispensable = analysis.indispensableRepertories2026 || [];
  if (!trendCards.length && !indispensable.length && !themes.length) return "";
  return `
    <section class="panel redacao-wide theme-pattern-panel">
      <div class="panel-header">
        <div>
          <h2>Tomografia ENEM 2009-2025</h2>
          <p>Tomografia dos temas oficiais para orientar repertório, tese e intervenção sem abrir PDFs inteiros.</p>
        </div>
        <span class="status-chip">${themes.length} temas catalogados</span>
      </div>
      <div class="theme-pattern-grid">
        ${trendCards
          .map(
            (item) => `
              <article class="theme-pattern-card">
                <h3>${escapeHTML(item.title)}</h3>
                <p>${escapeHTML(item.insight)}</p>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="indispensable-panel">
        <div>
          <h3>Prescrições de repertório para 2026</h3>
          <p>${escapeHTML(analysis.prediction2026 || "A central clínica de redação deve priorizar repertórios que cruzem direito social, grupo afetado e política pública executável.")}</p>
        </div>
        <div class="indispensable-grid">
          ${indispensable
            .map(
              (item) => `
                <article class="indispensable-card">
                  <strong>${escapeHTML(item.title)}</strong>
                  <span>${escapeHTML(item.use)}</span>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
      ${renderThemeArchiveCompact(themes)}
    </section>
  `;
}

function renderThemeArchiveCompact(themes = []) {
  if (!themes.length) return "";
  const families = countBy(themes, "family");
  const topFamilies = Object.entries(families)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  return `
    <div class="theme-archive-compact">
      <div class="plan-shelf-head">
        <h3>Sinais recorrentes por família temática</h3>
        <span>2009-2025</span>
      </div>
      <div class="theme-family-row">
        ${topFamilies.map(([family, count]) => `<span>${escapeHTML(family)} <strong>${count}</strong></span>`).join("")}
      </div>
      <details class="theme-archive-details">
        <summary>Abrir temas catalogados em lista curta</summary>
        <div class="theme-archive-list">
          ${themes
            .map(
              (item) => `
                <div class="theme-archive-row">
                  <strong>${escapeHTML(item.year)}</strong>
                  <span>${escapeHTML(item.theme)}</span>
                  <small>${escapeHTML(item.application)} · ${escapeHTML(item.axis)}</small>
                </div>
              `,
            )
            .join("")}
        </div>
      </details>
    </div>
  `;
}

function countBy(items, key) {
  return (items || []).reduce((acc, item) => {
    const value = item?.[key] || "outros";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function renderRedacaoMicrodataPanel(data = {}) {
  const global = data.global || {};
  const profile = data.promptProfile || {};
  if (!global.validRedactions || !profile.targets?.length) return "";
  const competencies = global.competencies || [];
  const weakest = [...competencies].sort((a, b) => Number(a.average || 999) - Number(b.average || 999))[0];
  const strongest = [...competencies].sort((a, b) => Number(b.average || 0) - Number(a.average || 0))[0];
  const threshold840 = global.thresholds?.["840"]?.percent ?? 0;
  const threshold940 = global.thresholds?.["940"]?.percent ?? 0;
  const threshold960 = global.thresholds?.["960"]?.percent ?? 0;
  const diagnosis = profile.statisticalDiagnosis || [];
  const zeroRisk = profile.zeroRisk?.mainStatus;
  return `
    <section class="panel redacao-wide theme-pattern-panel">
      <div class="panel-header">
        <div>
          <h2>Tomografia estatística da redação</h2>
          <p>Microdados oficiais de 2015 a 2024 convertidos em meta, risco e prescrição C1-C5.</p>
        </div>
        <span class="status-chip">microdados oficiais</span>
      </div>
      <section class="grid metrics-grid">
        ${metric("Média nacional", formatRedacaoMicroNumber(global.averageScore), "redações válidas 2015-2024")}
        ${metric("Meta 840+", `${formatRedacaoMicroNumber(threshold840)}%`, "primeira alta da enfermaria")}
        ${metric("Meta 940+", `${formatRedacaoMicroNumber(threshold940)}%`, "alta performance Medicina")}
        ${metric("Meta 960+", `${formatRedacaoMicroNumber(threshold960)}%`, "zona elite do centro cirúrgico")}
      </section>
      <div class="theme-pattern-grid">
        <article class="theme-pattern-card">
          <h3>Sinal vital mais sensível</h3>
          <p>${escapeHTML(weakest ? `${weakest.code}: ${weakest.title}, média ${weakest.average}. Reforçar essa competência evita queda brusca da nota.` : "Competência em análise.")}</p>
        </article>
        <article class="theme-pattern-card">
          <h3>Sinal vital mais estável</h3>
          <p>${escapeHTML(strongest ? `${strongest.code}: ${strongest.title}, média ${strongest.average}. Use essa estabilidade como base, sem abandonar revisão.` : "Competência em análise.")}</p>
        </article>
        <article class="theme-pattern-card">
          <h3>Risco de nota zero</h3>
          <p>${escapeHTML(zeroRisk ? `${zeroRisk.label} foi o status irregular mais frequente fora das redações sem problemas. Conduta: tema explícito, prosa dissertativo-argumentativa e texto completo.` : "Sem intercorrência dominante no agregado.")}</p>
        </article>
      </div>
      <div class="indispensable-panel">
        <div>
          <h3>Prescrição por meta</h3>
          <p>${escapeHTML(diagnosis[0] || "Use os microdados para calibrar metas, sem transformar o treino em tabela fria.")}</p>
        </div>
        <div class="indispensable-grid">
          ${profile.targets
            .map(
              (target) => `
                <article class="indispensable-card">
                  <strong>${escapeHTML(target.level)} · ${escapeHTML(target.target)}</strong>
                  <span>${escapeHTML(`${formatRedacaoMicroNumber(target.microdataPercent)}% atingiram essa marca. ${target.prescription}`)}</span>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function formatRedacaoMicroNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "--";
  return number.toLocaleString("pt-BR", { minimumFractionDigits: number < 10 ? 2 : 0, maximumFractionDigits: 2 });
}

function renderRedacaoScoreTracker(user, week) {
  const record = getRedacaoWeekRecord(user, week);
  const summary = getRedacaoWeekSummary(user, week);
  return `
    <section class="panel redacao-wide redacao-score-panel">
      <div class="panel-header">
        <div>
          <h2>Prontuário semanal de redação</h2>
          <p>Registre 3 redações por semana com nota geral e C1 a C5. O diagnóstico acompanha a meta do nível atual.</p>
        </div>
        <span class="status-chip">${summary.filled}/3 lançadas</span>
      </div>
      <div class="redacao-score-toolbar">
        <label class="field redacao-week-field">
          <span>Semana</span>
          <select id="redacaoWeekSelect">
            ${Array.from({ length: REDACAO_WEEK_COUNT }, (_, index) => {
              const value = index + 1;
              return `<option value="${value}" ${value === week ? "selected" : ""}>Semana ${value}</option>`;
            }).join("")}
          </select>
        </label>
        <div id="redacaoScoreSummary">
          ${renderRedacaoScoreSummary(summary)}
        </div>
      </div>
      <div class="redacao-score-grid">
        ${record.essays.map((essay, index) => renderRedacaoScoreCard(essay, week, index)).join("")}
      </div>
    </section>
  `;
}

function renderRedacaoScoreSummary(summary) {
  const statusClass = summary.status === "success" ? "success" : summary.status === "pending" ? "pending" : "watch";
  return `
    <div class="redacao-diagnosis ${statusClass}">
      <div class="score-summary-metrics">
        <span><strong>${summary.average || "sem média"}</strong><small>média geral</small></span>
        <span><strong>${summary.target.label}</strong><small>meta da fase</small></span>
        <span><strong>${summary.bestCompetency.label}</strong><small>melhor C</small></span>
        <span><strong>${summary.weakestCompetency.label}</strong><small>ajuste fino</small></span>
      </div>
      <p>${escapeHTML(summary.message)}</p>
    </div>
  `;
}

function renderRedacaoScoreCard(essay, week, index) {
  const total = getDisplayScoreValue(essay.total);
  return `
    <article class="redacao-score-card">
      <div class="score-card-head">
        <div>
          <h3>Redação ${index + 1}</h3>
          <small>${escapeHTML(getEssayScoreStatus(essay))}</small>
        </div>
        <span class="day-pill">${getEssayComputedTotal(essay) || "--"}</span>
      </div>
      <label class="field">
        <span>Nota geral</span>
        <input data-redacao-score data-week="${week}" data-slot="${index}" data-field="total" type="number" inputmode="numeric" min="0" max="1000" step="20" value="${escapeHTML(total)}" placeholder="0 a 1000" />
      </label>
      <div class="competency-score-grid">
        ${REDACAO_SCORE_FIELDS.map(
          (field) => `
            <label class="field">
              <span>${field.label}</span>
              <input data-redacao-score data-week="${week}" data-slot="${index}" data-field="${field.id}" type="number" inputmode="numeric" min="0" max="200" step="40" value="${escapeHTML(getDisplayScoreValue(essay[field.id]))}" placeholder="0 a 200" title="${escapeHTML(field.title)}" />
            </label>
          `,
        ).join("")}
      </div>
    </article>
  `;
}

function getActiveRedacaoWeek(user) {
  const currentWeek = Math.ceil((selectedDay || getTargetDay(user)) / 7);
  return clamp(Number(user.redacaoActiveWeek || currentWeek), 1, REDACAO_WEEK_COUNT);
}

function getRedacaoWeekRecord(user, week) {
  const stored = user.redacaoWeeks?.[week] || {};
  const essays = Array.from({ length: 3 }, (_, index) => ({ ...(stored.essays?.[index] || {}) }));
  return { week, essays };
}

function getRedacaoLevelTarget(user) {
  const level = classifyStudent(user);
  if (level.id === "avancado") {
    return {
      id: "avancado",
      label: "940-960",
      min: 940,
      stretch: 960,
      helper: "zona de aprovação em Medicina",
    };
  }
  if (level.id === "mediano") {
    return {
      id: "intermediario",
      label: "880-900",
      min: 880,
      stretch: 900,
      helper: "subida para brigar por vaga",
    };
  }
  return {
    id: "iniciante",
    label: "840",
    min: 840,
    stretch: 840,
    helper: "base mínima da enfermaria",
  };
}

function getRedacaoWeekSummary(user, week) {
  const record = getRedacaoWeekRecord(user, week);
  const target = getRedacaoLevelTarget(user);
  const totals = record.essays.map(getEssayComputedTotal).filter((score) => score !== null);
  const filled = totals.length;
  const average = filled ? Math.round(totals.reduce((sum, score) => sum + score, 0) / filled) : 0;
  const competencyAverages = REDACAO_SCORE_FIELDS.map((field) => {
    const values = record.essays
      .map((essay) => parseScoreValue(essay[field.id], 200))
      .filter((score) => score !== null);
    const averageScore = values.length ? Math.round(values.reduce((sum, score) => sum + score, 0) / values.length) : 0;
    return { ...field, average: averageScore, filled: values.length };
  });
  const filledCompetencies = competencyAverages.filter((item) => item.filled);
  const weakestCompetency = filledCompetencies.length
    ? [...filledCompetencies].sort((a, b) => a.average - b.average)[0]
    : { label: "--", title: "sem dados", average: 0 };
  const bestCompetency = filledCompetencies.length
    ? [...filledCompetencies].sort((a, b) => b.average - a.average)[0]
    : { label: "--", title: "sem dados", average: 0 };
  const complete = filled >= 3;
  const success = complete && average >= target.min;
  const stretchSuccess = complete && average >= target.stretch;
  return {
    week,
    target,
    filled,
    average,
    complete,
    success,
    stretchSuccess,
    status: success ? "success" : filled ? "watch" : "pending",
    weakestCompetency,
    bestCompetency,
    competencyAverages,
    message: getRedacaoMedicalMessage({ average, filled, target, success, stretchSuccess, weakestCompetency }),
  };
}

function getRedacaoMedicalMessage({ average, filled, target, success, stretchSuccess, weakestCompetency }) {
  if (!filled) {
    return "Plantão aguardando exames: lance as 3 redações da semana para eu abrir o prontuário completo.";
  }
  if (filled < 3) {
    return `Paciente em observação: já temos ${filled}/3 redações, mas ainda faltam exames para decidir alta da enfermaria.`;
  }
  if (success) {
    if (stretchSuccess && target.stretch > target.min) {
      return `Alta com honras do centro cirúrgico: média ${average}. A redação está com sinais vitais de aprovação e resposta excelente ao tratamento.`;
    }
    return `Alta da enfermaria de redação: média ${average}. Conduta precisa, tese estável e intervenção respirando como atleta em prova final.`;
  }
  return `Vai continuar internado no plantão da redação: média ${average}, meta ${target.label}. Não posso retirar os antibióticos ainda; ajuste a dose de treino em ${weakestCompetency.label} (${weakestCompetency.title}).`;
}

function getEssayScoreStatus(essay) {
  const total = getEssayComputedTotal(essay);
  if (total === null) return "aguardando nota";
  if (total >= 940) return "nível alta competitiva";
  if (total >= 880) return "nível intermediário forte";
  if (total >= 840) return "base estabilizada";
  return "em tratamento intensivo";
}

function getEssayComputedTotal(essay = {}) {
  const total = parseScoreValue(essay.total, 1000);
  if (total !== null) return total;
  const competencyScores = REDACAO_SCORE_FIELDS.map((field) => parseScoreValue(essay[field.id], 200));
  if (competencyScores.every((score) => score !== null)) {
    return competencyScores.reduce((sum, score) => sum + score, 0);
  }
  return null;
}

function parseScoreValue(value, max) {
  if (value === "" || value === undefined || value === null) return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return clamp(Math.round(number), 0, max);
}

function getDisplayScoreValue(value) {
  return value === undefined || value === null ? "" : String(value);
}

function getRedacaoCompetencies(redacao) {
  if (Array.isArray(redacao.competencies) && redacao.competencies.length) return redacao.competencies;
  return [
    {
      number: 1,
      title: "Domínio da modalidade escrita formal",
      summary: "Convenções da escrita, gramática, sintaxe, registro e vocabulário preciso.",
      studentAction: "Revisar período por período antes de finalizar.",
    },
    {
      number: 2,
      title: "Compreensão do tema e repertório",
      summary: "Tema bem delimitado e repertório sociocultural produtivo.",
      studentAction: "Usar referência legitimada e explicar por que ela prova a tese.",
    },
    {
      number: 3,
      title: "Projeto de texto",
      summary: "Seleção, organização e interpretação dos argumentos.",
      studentAction: "Definir tese e dois eixos antes de escrever.",
    },
    {
      number: 4,
      title: "Coesão e progressão",
      summary: "Mecanismos linguísticos que ligam frases e parágrafos.",
      studentAction: "Variar conectivos e retomar termos-chave com precisão.",
    },
    {
      number: 5,
      title: "Proposta de intervenção",
      summary: "Ação concreta, agente, meio, finalidade e detalhamento.",
      studentAction: "Fechar o texto com solução específica e respeitosa aos direitos humanos.",
    },
  ];
}

function getDailyC1Tips(user) {
  const tips = REDACTION_LIBRARY.c1Tips || [];
  if (tips.length <= 3) return tips;
  const seed = hashString(`${todayISO()}-${selectedDay || getTargetDay(user)}-farmacia-c1`);
  return pickRotating(tips, seed, 3);
}

function getC1TipSearchResults(term = "") {
  const clean = normalizeForMatch(term).trim();
  if (!clean) return [];
  const tokens = clean.split(/\s+/).filter((token) => token.length > 2);
  return (REDACTION_LIBRARY.c1Tips || []).filter((tip) => {
    const haystack = normalizeForMatch([
      tip.title,
      tip.rule,
      tip.memory,
      tip.reason,
      tip.sourceEssay,
      tip.sourceExcerpt,
      ...(tip.examples || []).flat(),
    ].join(" "));
    return tokens.every((token) => haystack.includes(token));
  });
}

function renderC1TipBoard(tips, options = {}) {
  const searchTerm = options.searchTerm || "";
  if (!tips.length) {
    return `<div class="empty-state">Nenhuma prescrição encontrada na Farmácia da Norma Culta para "${escapeHTML(searchTerm)}".</div>`;
  }
  return `
    ${searchTerm ? `<p class="c1-search-result-note">Resultado da lupa: ${tips.length} prescrição${tips.length === 1 ? "" : "ões"} encontrada${tips.length === 1 ? "" : "s"}.</p>` : ""}
    <div class="c1-tip-grid">
      ${tips
        .map(
          (tip) => `
            <article class="c1-tip-card">
              <div class="c1-tip-head">
                <span class="day-pill">C1</span>
                <div>
                  <h3>${escapeHTML(tip.title)}</h3>
                  <p><strong class="c1-highlight">${escapeHTML(tip.rule)}</strong></p>
                </div>
              </div>
              <p class="memory-line">${escapeHTML(tip.memory)}</p>
              <small>${escapeHTML(tip.reason)}</small>
              ${
                tip.sourceEssay || tip.sourceExcerpt
                  ? `<div class="c1-source-box">
                      ${tip.sourceEssay ? `<strong>${escapeHTML(tip.sourceEssay)}</strong>` : ""}
                      ${tip.sourceExcerpt ? `<span>${escapeHTML(tip.sourceExcerpt)}</span>` : ""}
                    </div>`
                  : ""
              }
              <details class="c1-example-drawer">
                <summary>Abrir receitas de aplicação</summary>
                <div class="c1-example-list">
                  ${(tip.examples || []).map((example, index) => renderRuleExampleLines(example, tip.rule, index)).join("")}
                </div>
              </details>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderRuleExampleLines(lines, rule, index) {
  const ruleMarkup = `<strong class="c1-highlight">${escapeHTML(rule)}</strong>`;
  return `
    <div class="c1-example">
      <strong>Exemplo ${index + 1}</strong>
      <p>
        ${lines
          .map((line) => escapeHTML(line).replace("&lt;rule&gt;", ruleMarkup))
          .join("<br />")}
      </p>
    </div>
  `;
}

function renderRepertoryBank(repertories) {
  return `
    <div class="repertory-grid">
      ${repertories
        .map(
          (item) => `
            <article class="repertory-card">
              <div class="repertory-head">
                <span>${escapeHTML(item.bestFor)}</span>
                <small>${escapeHTML(item.area)}</small>
              </div>
              <h3>${escapeHTML(item.title)}</h3>
              <p>${escapeHTML(item.summary)}</p>
              <div class="repertory-tags">
                ${item.themes.map((theme) => `<span>${escapeHTML(theme)}</span>`).join("")}
              </div>
              <div class="repertory-use">
                <strong>Ponte de aplicação</strong>
                <p>${escapeHTML(item.bridge)}</p>
                <strong>Prescrição no texto</strong>
                <p>${escapeHTML(item.sample)}</p>
                <strong>Contraindicação</strong>
                <p>${escapeHTML(item.avoid)}</p>
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderRubricAlerts(alerts) {
  return `
    <div class="rubric-alert-grid">
      ${(alerts || [])
        .map((item) => {
          const isZero = item.code === "ZERO";
          return `
            <article class="rubric-alert-card">
              <div class="rubric-alert-head">
                <span class="day-pill">${escapeHTML(item.code)}</span>
                <div>
                  <h3>${escapeHTML(item.title)}</h3>
                  <p>${escapeHTML(item.officialBasis)}</p>
                </div>
              </div>
              <div class="rubric-alert-body">
                <strong>${isZero ? "Conduta de quem quer ser Calouro Med ano que vem" : "Conduta do futuro médico"}</strong>
                <p>${escapeHTML(item.studentCommand)}</p>
                <strong>${isZero ? "Não entre na zona de anulação" : "Evite no plantão médico"}</strong>
                <p>${escapeHTML(item.avoid)}</p>
                <strong>${isZero ? "Checagem anti-zero antes da entrega" : "Checagem rápida para alta"}</strong>
                <p>${escapeHTML(item.trainingCheck)}</p>
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderSourceReadingRoom(sourcePacks) {
  return `
    <div class="source-room-grid">
      ${(sourcePacks || [])
        .map(
          (item) => `
            <article class="source-card">
              <div class="source-card-head">
                <div>
                  <span>${escapeHTML(getSourceDisplayType(item))}</span>
                  <h3>${escapeHTML(getSourceDisplayTitle(item))}</h3>
                </div>
                <small>${escapeHTML(item.sourceLabel)}</small>
              </div>
              <div class="source-link-row">
                ${(item.links || []).map((link) => renderExternalLink(link)).join("")}
              </div>
              <div class="source-pill-row">
                <span>${escapeHTML(getSourceDisplayAvailability(item))}</span>
                ${(item.themes || []).slice(0, 5).map((theme) => `<span>${escapeHTML(theme)}</span>`).join("")}
              </div>
              <p class="source-reading-focus">${escapeHTML(item.readingFocus)}</p>
              <div class="source-essential-box">
                <strong>Trechos para consulta</strong>
                <ul>
                  ${(item.essentialPoints || []).map((point) => `<li>${escapeHTML(point)}</li>`).join("")}
                </ul>
              </div>
              <div class="source-use-box">
                <strong>Prescrição no texto</strong>
                <p>${escapeHTML(item.howToUse)}</p>
                <strong>Dica dos residentes</strong>
                <p>${escapeHTML(item.examinerCare)}</p>
                <strong>A junta médica recomenda</strong>
                <p>${escapeHTML(item.closingPair)}</p>
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderAuthorCrossovers(crossovers) {
  return `
    <div class="author-crossover-grid">
      ${(crossovers || [])
        .map(
          (item) => `
            <article class="crossover-card">
              <div class="crossover-flow">
                <span>${escapeHTML(item.start)}</span>
                <strong>+</strong>
                <span>${escapeHTML(item.closeWith)}</span>
              </div>
              <div class="repertory-tags">
                ${(item.bestThemes || []).map((theme) => `<span>${escapeHTML(theme)}</span>`).join("")}
              </div>
              <div class="crossover-copy">
                <strong>Ponte autoral</strong>
                <p>${escapeHTML(item.bridge)}</p>
                <strong>A junta médica recomenda</strong>
                <p>${escapeHTML(item.closing)}</p>
                <strong>Dica dos residentes</strong>
                <p>${escapeHTML(item.caution)}</p>
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderExternalLink(link = {}) {
  const href = normalizeExternalURL(link.url);
  return `<a class="source-link" href="${escapeHTML(href)}" target="_blank" rel="noreferrer">${escapeHTML(link.label || "Abrir fonte")}</a>`;
}

function getCurrentEnemYear() {
  return new Date().getFullYear();
}

function getSourceDisplayTitle(item = {}) {
  if (item.id === "cartilha-enem-2025") return `Cartilha dos Calouros ENEM ${getCurrentEnemYear()}`;
  return item.title || "Fonte ENEM";
}

function getSourceDisplayType(item = {}) {
  if (item.id === "cartilha-enem-2025") return "Manual Oficial dos Preceptores";
  return item.type || "Fonte guiada";
}

function getSourceDisplayAvailability(item = {}) {
  if (item.id === "cartilha-enem-2025") return "Leitura guiada por competência";
  return item.availability || "Fonte guiada";
}

function normalizeExternalURL(url = "") {
  try {
    const parsed = new URL(String(url));
    if (parsed.protocol === "https:" || parsed.protocol === "http:") return parsed.href;
  } catch {
    return "#";
  }
  return "#";
}

function renderCompetencyExamples() {
  return `
    <div class="competency-example-grid">
      ${REDACTION_LIBRARY.competencyExamples
        .map(
          (item) => `
            <article class="competency-example-card">
              <span class="day-pill">${escapeHTML(item.code)}</span>
              <h3>${escapeHTML(item.title)}</h3>
              <p>${escapeHTML(item.rule)}</p>
              <div>
                <strong>Fraco</strong>
                <small>${escapeHTML(item.weak)}</small>
              </div>
              <div>
                <strong>Forte</strong>
                <small>${escapeHTML(item.strong)}</small>
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function getEditableEssays(user, redacao = ENEM_DATA.redacao || {}) {
  const officialStage9 = getStage9Nota1000Essays();
  const seeded = REDACTION_LIBRARY.nota1000Essays;
  const legacy = Array.isArray(redacao.essays)
    ? redacao.essays.map((essay, index) => normalizeLegacyEssay(essay, index)).filter(Boolean)
    : [];
  const base = uniqueEssaysById([...officialStage9, ...seeded, ...legacy]);
  return base.map((essay) => applyEssayEdit(essay, user.redacaoEssayEdits?.[essay.id]));
}

function getStage9Nota1000Essays() {
  const rows = Array.isArray(REDACTION_STAGE9_DATA.note1000) ? REDACTION_STAGE9_DATA.note1000 : [];
  return rows.map((essay, index) => ({
    id: essay.id || `oficial-1000-${index + 1}`,
    year: essay.year || essay.ano || "Ano a revisar",
    theme: essay.theme || essay.tema || "Tema oficial a revisar",
    student: essay.student || essay.autor || `Redação oficial ${index + 1}`,
    source: `Cartilha oficial INEP ${essay.fonte_arquivo || ""}`.trim(),
    paragraphs: Array.isArray(essay.paragraphs) && essay.paragraphs.length >= 3
      ? essay.paragraphs
      : splitLegacyEssay(essay.texto_integral || ""),
    officialComment: essay.comentario_oficial || "",
    score: essay.score || essay.nota_total || "1000",
    officialExtracted: true,
  }));
}

function uniqueEssaysById(essays = []) {
  const seen = new Set();
  return essays.filter((essay) => {
    const id = essay.id || `${essay.year}-${essay.student}-${essay.theme}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function normalizeLegacyEssay(essay, index) {
  const rawText = String(essay.excerpt || "").trim();
  if (!rawText) return null;
  return {
    id: `anexo-${index + 1}`,
    year: rawText.match(/20\d{2}/)?.[0] || "Ano a revisar",
    theme: inferLegacyTheme(rawText),
    student: extractLegacyStudent(rawText) || essay.title || `Redação anexada ${index + 1}`,
    source: essay.title || "Anexo importado",
    paragraphs: splitLegacyEssay(rawText),
  };
}

function extractLegacyStudent(text) {
  const match = text.match(/Reda[çc][aã]o(?: do Enem \d{4})? de\s+([^,]+),/i) || text.match(/Reda[çc][aã]o do de\s+([^,]+),/i);
  return match?.[1]?.trim() || "";
}

function inferLegacyTheme(text) {
  const lower = text.toLowerCase();
  if (lower.includes("herança africana") || lower.includes("africana")) return "Desafios para a valorização da herança africana no Brasil";
  if (lower.includes("idoso") || lower.includes("velhice") || lower.includes("envelhecimento")) return "Desafios para a valorização da velhice no Brasil";
  if (lower.includes("invisibilidade") && lower.includes("registro civil")) return "Invisibilidade e registro civil";
  return "Tema a revisar";
}

function splitLegacyEssay(text) {
  const cleaned = text
    .replace(/Reda[çc][aã]o(?: do Enem \d{4})? de\s+[^,]+,\s*de\s*[^.]+\.\s*/i, "")
    .replace(/Reda[çc][aã]o do de\s+[^,]+,\s*de\s*[^.]+\.\s*/i, "")
    .trim();
  const explicit = cleaned.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  if (explicit.length >= 3) return explicit;
  const markers = [
    "Em primeiro lugar,",
    "Nesse contexto,",
    "Sob essa perspectiva,",
    "Além disso,",
    "Ademais,",
    "Portanto,",
    "Logo,",
    "Dessa forma,",
    "Diante disso,",
  ];
  let marked = cleaned;
  markers.forEach((marker) => {
    marked = marked.replaceAll(` ${marker}`, `\n\n${marker}`);
  });
  const byMarker = marked.split(/\n{2,}/).map((part) => part.trim()).filter((part) => part.length > 40);
  if (byMarker.length >= 3) return byMarker;
  return chunkSentencesIntoParagraphs(cleaned);
}

function chunkSentencesIntoParagraphs(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks = [[], [], [], []];
  sentences.forEach((sentence, index) => {
    const bucket = Math.min(3, Math.floor((index / Math.max(1, sentences.length)) * 4));
    chunks[bucket].push(sentence.trim());
  });
  return chunks.map((chunk) => chunk.join(" ").trim()).filter(Boolean);
}

function applyEssayEdit(essay, edit = {}) {
  const paragraphs = [...(essay.paragraphs || [])];
  (edit.paragraphs || []).forEach((paragraph, index) => {
    if (typeof paragraph === "string") paragraphs[index] = paragraph;
  });
  return {
    ...essay,
    year: edit.year ?? essay.year,
    theme: edit.theme ?? essay.theme,
    student: edit.student ?? essay.student,
    source: edit.source ?? essay.source,
    paragraphs,
  };
}

function renderEssayCards(essays, searchTerm = "", activeYear = "todos") {
  const filtered = essays.filter((essay) => matchesEssaySearch(essay, searchTerm));
  if (!searchTerm.trim()) {
    const byYear = activeYear === "todos" ? filtered : filtered.filter((essay) => String(essay.year) === String(activeYear));
    if (!byYear.length) return `<div class="empty-state">Nenhuma redação encontrada nesta aba.</div>`;
    return `
      <div class="essay-summary-grid">
        ${byYear.map((essay) => renderEssaySummaryCard(essay)).join("")}
      </div>
    `;
  }
  if (!filtered.length) {
    return `<div class="empty-state">Nenhuma redação encontrada para essa busca.</div>`;
  }
  return filtered
    .map(
      (essay) => `
        <article class="editable-essay-card" data-essay-card-id="${escapeHTML(essay.id)}">
          <div class="essay-meta-grid">
            <label class="field">
              <span>Ano</span>
              <input data-redacao-edit data-essay-id="${escapeHTML(essay.id)}" data-field="year" value="${escapeHTML(essay.year)}" />
            </label>
            <label class="field">
              <span>Aluno(a)</span>
              <input data-redacao-edit data-essay-id="${escapeHTML(essay.id)}" data-field="student" value="${escapeHTML(essay.student)}" />
            </label>
            <label class="field essay-theme-field">
              <span>Tema</span>
              <input data-redacao-edit data-essay-id="${escapeHTML(essay.id)}" data-field="theme" value="${escapeHTML(essay.theme)}" />
            </label>
          </div>
          <label class="field">
            <span>Fonte / observação</span>
            <input data-redacao-edit data-essay-id="${escapeHTML(essay.id)}" data-field="source" value="${escapeHTML(essay.source || "")}" />
          </label>
          <div class="essay-copy-row">
            <button class="secondary-btn compact-btn" type="button" data-copy-essay>Copiar modelo para Word</button>
            <small>Use como instrumento de montagem autoral: adapte tese, recorte e repertório ao seu tema.</small>
          </div>
          ${renderEssayThemeUses(essay)}
          <div class="essay-paragraphs">
            ${(essay.paragraphs || [])
              .map(
                (paragraph, index) => `
                  <label class="field">
                    <span>Parágrafo ${index + 1}</span>
                    <textarea class="essay-edit-field paragraph-editor" data-redacao-edit data-essay-id="${escapeHTML(essay.id)}" data-field="paragraph" data-paragraph-index="${index}" rows="5">${escapeHTML(paragraph)}</textarea>
                  </label>
                `,
              )
              .join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderEssaySummaryCard(essay) {
  const preview = (essay.paragraphs || []).join(" ").slice(0, 220);
  return `
    <article class="essay-summary-card">
      <div class="essay-summary-top">
        <span class="day-pill">${escapeHTML(essay.year)}</span>
        <small>${escapeHTML(essay.source || "Acervo ENEM")}</small>
      </div>
      <h3>${escapeHTML(essay.theme)}</h3>
      <strong>${escapeHTML(essay.student)}</strong>
      ${renderEssayThemeUses(essay, { compact: true })}
      <p>${escapeHTML(preview)}${preview.length >= 220 ? "..." : ""}</p>
      <button class="secondary-btn compact-btn" type="button" data-essay-open="${escapeHTML(essay.id)}">Abrir em parágrafos</button>
    </article>
  `;
}

function renderEssayThemeUses(essay, options = {}) {
  const uses = Array.isArray(essay.themeUses) ? essay.themeUses : [];
  if (!uses.length) return "";
  return `
    <div class="${options.compact ? "essay-use-chips compact" : "essay-use-chips"}">
      <strong>Indicações de uso</strong>
      ${uses.map((theme) => `<span>${escapeHTML(theme)}</span>`).join("")}
    </div>
  `;
}

function renderEssayYearTabs(essays, activeYear = "todos") {
  const years = ["todos", ...Array.from(new Set((essays || []).map((essay) => String(essay.year)).filter(Boolean))).sort((a, b) => Number(b) - Number(a))];
  return `
    <div class="essay-year-tabs" role="tablist" aria-label="Filtrar redações por ano">
      ${years
        .map((year) => {
          const active = String(activeYear) === String(year);
          const label = year === "todos" ? "Todos" : year;
          return `<button class="${active ? "active" : ""}" type="button" data-essay-year-filter="${escapeHTML(year)}">${escapeHTML(label)}</button>`;
        })
        .join("")}
    </div>
  `;
}

function matchesEssaySearch(essay, searchTerm) {
  const term = searchTerm.trim().toLowerCase();
  if (!term) return true;
  return serializeEssayForSearch(essay).includes(term);
}

function serializeEssayForSearch(essay) {
  return `${essay.id} ${essay.year} ${essay.theme} ${essay.student} ${essay.source} ${(essay.paragraphs || []).join(" ")}`.toLowerCase();
}

const ESSAY_THEME_PROFILES = [
  {
    id: "doacao-orgaos-transplantes",
    label: "doação de órgãos e confiança pública",
    keywords: [
      "doacao de orgaos",
      "doacao",
      "orgaos",
      "orgao",
      "transplante",
      "transplantes",
      "recusa familiar",
      "morte encefalica",
      "morte cerebral",
      "doador",
      "doadores",
      "lista de espera",
      "snt",
      "sistema nacional de transplantes",
      "abto",
      "cihdott",
      "prodot",
      "luto",
      "familia",
      "autorizacao familiar",
      "comunicacao hospitalar",
      "morte",
      "saude publica",
    ],
    problem: "a recusa familiar que impede potenciais doadores de se tornarem doadores efetivos",
    group: "pacientes em lista de espera, familiares em luto, equipes hospitalares e usuários do SUS",
    causes: [
      "desinformação sobre morte encefálica",
      "comunicação hospitalar pouco humanizada",
      "ausência de conversa prévia sobre a vontade de doar",
      "desconfiança pública no sistema de transplantes",
    ],
    consequences: [
      "perda de potenciais doações",
      "ampliação do tempo em lista de espera",
      "fragilização da confiança no SUS",
      "redução do acesso a tratamentos de alta complexidade",
    ],
    sourceIds: [
      "sistema-nacional-transplantes",
      "lei-transplantes-autorizacao",
      "cfm-morte-encefalica",
      "abto-registro-transplantes",
      "philippe-aries-morte",
      "habermas-agir-comunicativo-saude",
      "hans-jonas-responsabilidade",
      "decreto-9175-transplantes",
      "cf-1988-leitura",
    ],
    crossoverIds: [
      "snt-constituicao-abto",
      "cfm-educacao-morte-encefalica",
      "habermas-cihdott-prodot",
      "aries-lei10211-conversa-familiar",
      "hans-jonas-bioetica-vida",
    ],
    agents: ["Ministério da Saúde", "Sistema Nacional de Transplantes", "hospitais com CIHDOTT"],
    action: "promover educação pública permanente e acolhimento hospitalar humanizado sobre doação de órgãos",
    means: "campanhas em linguagem simples, módulos escolares, UBS, comunicação pública, capacitação de equipes e protocolos de abordagem familiar",
    purpose: "reduzir mitos, estimular conversa familiar em vida e aumentar a confiança social no sistema de transplantes",
  },
  {
    id: "saude",
    label: "saúde pública",
    keywords: ["saude", "mental", "sus", "vacina", "vacinacao", "hospital", "dengue", "saneamento", "alimentacao", "fome"],
    problem: "a dificuldade de transformar direitos sanitários em cuidado cotidiano",
    group: "populações que dependem da rede pública e de políticas preventivas",
    causes: ["desigualdade territorial", "baixa prevenção contínua", "falhas de comunicação pública", "subfinanciamento de ações básicas"],
    consequences: ["sobrecarga dos serviços", "agravamento de vulnerabilidades", "aumento de doenças evitáveis"],
    sourceIds: ["sus-lei-8080", "cf-1988-leitura", "cartilha-enem-2025"],
    crossoverIds: ["sus-constituicao", "freire-constituicao"],
    agents: ["Ministério da Saúde", "secretarias municipais de saúde", "unidades básicas de saúde"],
    action: "ampliar ações preventivas e busca ativa territorial",
    means: "campanhas locais, agentes comunitários e monitoramento de indicadores",
    purpose: "reduzir barreiras de acesso e evitar o agravamento do problema",
  },
  {
    id: "educacao",
    label: "educação e cidadania",
    keywords: ["educacao", "escola", "ensino", "professor", "letramento", "alfabetizacao", "evasao", "aprendizagem"],
    problem: "a insuficiência de uma formação crítica e continuada",
    group: "estudantes de escolas públicas e comunidades com menor acesso cultural",
    causes: ["currículo pouco conectado à realidade social", "desigualdade de acesso a materiais qualificados", "formação docente insuficiente"],
    consequences: ["reprodução de desigualdades", "baixa participação cidadã", "fragilização da autonomia intelectual"],
    sourceIds: ["paulo-freire-leitura", "cf-1988-leitura", "cartilha-enem-2025"],
    crossoverIds: ["freire-constituicao", "eca-freire"],
    agents: ["Ministério da Educação", "secretarias estaduais de educação", "escolas públicas"],
    action: "implementar práticas de leitura crítica e formação docente",
    means: "oficinas, materiais didáticos orientados por evidências e acompanhamento pedagógico",
    purpose: "fortalecer autonomia, permanência escolar e participação cidadã",
  },
  {
    id: "juventude-negra-periferica",
    label: "juventude negra, periferia e oportunidades",
    keywords: [
      "jovem",
      "jovens",
      "juventude",
      "negro",
      "negra",
      "pretos",
      "pardos",
      "periferia",
      "periferico",
      "perifericos",
      "ensino superior",
      "universidade",
      "universitario",
      "cotas",
      "permanencia",
      "assistencia estudantil",
      "mercado de trabalho",
      "empregabilidade",
      "estagio",
      "trainee",
      "mobilidade social",
    ],
    problem: "as barreiras raciais e territoriais que restringem acesso, permanência e inserção profissional",
    group: "jovens negros e periféricos que buscam formação superior e trabalho qualificado",
    causes: [
      "racismo estrutural",
      "desigualdade educacional de base",
      "insuficiência de permanência estudantil",
      "discriminação e redes restritas no mercado de trabalho",
    ],
    consequences: [
      "evasão universitária",
      "sub-representação em ocupações qualificadas",
      "bloqueio de mobilidade social",
      "manutenção da informalidade e da desigualdade de renda",
    ],
    sourceIds: [
      "lei-cotas-ensino-superior",
      "ibge-pnad-educacao-racial",
      "pnaes-permanencia",
      "bourdieu-capital-cultural",
      "estatuto-igualdade-racial",
      "florestan-integracao-negro",
      "carolina-quarto-despejo",
      "cf-1988-leitura",
      "ibge-sis-leitura",
    ],
    crossoverIds: [
      "florestan-lei-cotas",
      "bourdieu-pnaes",
      "carolina-constituicao",
      "estatuto-igualdade-mercado",
      "djamila-constituicao",
    ],
    agents: ["Ministério da Educação", "universidades federais", "Ministério do Trabalho e Ministério da Igualdade Racial"],
    action: "integrar acesso, permanência universitária e entrada em oportunidades profissionais qualificadas",
    means:
      "bolsas, moradia estudantil, alimentação, transporte, tutoria acadêmica, apoio psicossocial, estágios afirmativos e mentorias",
    purpose: "reduzir evasão, ampliar conclusão de curso e converter formação em mobilidade social concreta",
  },
  {
    id: "afro",
    label: "memória, racismo e herança africana",
    keywords: ["africana", "afro", "racismo", "negro", "negra", "quilombo", "matriz", "religiao", "heranca", "ancestralidade"],
    problem: "o apagamento histórico e simbólico de contribuições afro-brasileiras",
    group: "população negra e comunidades de matriz africana",
    causes: ["currículo eurocêntrico", "racismo estrutural", "baixa representatividade cultural"],
    consequences: ["naturalização de estereótipos", "desvalorização da memória coletiva", "violação da cidadania cultural"],
    sourceIds: ["lei-10639-leitura", "ursula-maria-firmina", "chimamanda-historia-unica"],
    crossoverIds: ["maria-firmina-lei-10639", "chimamanda-maria-firmina", "djamila-constituicao"],
    agents: ["Ministério da Educação", "secretarias de cultura", "universidades públicas"],
    action: "fortalecer a aplicação contínua da educação antirracista",
    means: "formação docente, acervos de autores negros e avaliação anual dos currículos",
    purpose: "reparar apagamentos e valorizar a herança africana como eixo da identidade brasileira",
  },
  {
    id: "protecao-infantojuvenil-violencia-sexual",
    label: "proteção infantojuvenil e rede de acolhimento",
    keywords: [
      "exploracao sexual",
      "violencia sexual",
      "abuso",
      "aliciamento",
      "infantojuvenil",
      "crianca",
      "criancas",
      "adolescente",
      "adolescentes",
      "eca",
      "conselho tutelar",
      "creas",
      "disque 100",
      "escuta protegida",
      "depoimento especial",
      "revitimizacao",
      "subnotificacao",
      "impunidade",
      "ambiente digital",
      "online",
      "plataformas",
      "direitos humanos",
    ],
    problem: "a falha coletiva na proteção integral de crianças e adolescentes contra violações graves de direitos",
    group: "crianças e adolescentes expostos à vulnerabilidade social, ao silêncio institucional e a riscos presenciais ou digitais",
    causes: [
      "vulnerabilidade socioeconômica e territorial",
      "subnotificação e cultura do silêncio",
      "fragilidade da rede intersetorial de proteção",
      "fiscalização insuficiente de redes presenciais e digitais",
    ],
    consequences: [
      "revitimização institucional",
      "impunidade de agressores e redes de exploração",
      "agravamento de traumas e ruptura de vínculos",
      "permanência da distância entre lei e proteção concreta",
    ],
    sourceIds: [
      "lei-13431-escuta-protegida",
      "unicef-fbsp-violencia-sexual",
      "disque-100-protecao",
      "eca-lei-8069",
      "cf-1988-leitura",
      "judith-herman-trauma",
      "eca-digital-protecao-online",
      "anjos-do-sol-repertorio",
    ],
    crossoverIds: [
      "constituicao-eca-unicef",
      "lei13431-disque100",
      "judith-herman-creas",
      "freire-18maio",
      "eca-digital-policia-federal",
    ],
    agents: ["Ministério dos Direitos Humanos e da Cidadania", "Conselhos Tutelares e CREAS", "Ministério da Educação"],
    action: "articular prevenção, denúncia, responsabilização e acolhimento humanizado",
    means:
      "formação obrigatória de profissionais, campanhas de denúncia, protocolos de escuta protegida e integração do Disque 100 à rede local",
    purpose: "identificar riscos mais cedo, interromper redes de aliciamento e proteger vítimas sem revitimização",
  },
  {
    id: "educacao-sem-violencia-infancia",
    label: "educação sem violência e proteção da infância",
    keywords: [
      "lei menino bernardo",
      "menino bernardo",
      "castigo fisico",
      "castigos fisicos",
      "tratamento cruel",
      "tratamentos crueis",
      "tratamento degradante",
      "tratamentos degradantes",
      "palmada",
      "disciplina positiva",
      "educacao sem violencia",
      "educacao parental",
      "violencia domestica",
      "familia",
      "crianca",
      "criancas",
      "adolescente",
      "adolescentes",
      "conselho tutelar",
      "henry borel",
      "winnicott",
      "montessori",
    ],
    problem: "a permanência de práticas punitivas violentas na educação de crianças e adolescentes",
    group: "crianças e adolescentes expostos a castigos físicos, humilhações e fragilidade da rede de proteção familiar",
    causes: [
      "naturalização cultural da punição física como método educativo",
      "baixa divulgação da Lei Menino Bernardo",
      "insuficiência de orientação familiar e educação parental",
      "fragilidade da rede local de identificação e encaminhamento",
    ],
    consequences: [
      "comprometimento de vínculos afetivos e segurança emocional",
      "reprodução intergeracional da violência",
      "subnotificação de práticas degradantes",
      "distância entre proteção legal e cotidiano familiar",
    ],
    sourceIds: [
      "lei-menino-bernardo",
      "eca-lei-8069",
      "cf-1988-leitura",
      "oms-castigo-corporal",
      "winnicott-ambiente-seguro",
      "montessori-educacao-autonomia",
      "lei-henry-borel",
      "lei-13431-escuta-protegida",
    ],
    crossoverIds: [
      "lei-menino-bernardo-eca-constituicao",
      "winnicott-oms-educacao-parental",
      "machado-lei-menino-bernardo",
      "henry-borel-escuta-protegida-conselho",
      "eca-freire",
    ],
    agents: ["Ministério dos Direitos Humanos e da Cidadania", "Ministério da Educação", "Conselhos Tutelares e secretarias municipais"],
    action: "promover educação parental sem violência e fortalecer a rede local de proteção",
    means:
      "oficinas em escolas, CRAS e UBS, materiais sobre disciplina positiva, formação de profissionais e protocolos de encaminhamento",
    purpose: "substituir a cultura da punição física por cuidado, limite, orientação e proteção integral",
  },
  {
    id: "infancia",
    label: "infância e juventude",
    keywords: ["crianca", "adolescente", "infancia", "juventude", "jovem", "bullying", "protecao", "exploracao"],
    problem: "a fragilidade da rede de proteção integral",
    group: "crianças, adolescentes e suas famílias",
    causes: ["subnotificação de violações", "baixa integração entre escola e assistência social", "desigualdade familiar e territorial"],
    consequences: ["evasão escolar", "adoecimento emocional", "manutenção de ciclos de vulnerabilidade"],
    sourceIds: ["eca-lei-8069", "cf-1988-leitura", "paulo-freire-leitura"],
    crossoverIds: ["eca-freire", "freire-constituicao"],
    agents: ["Conselhos Tutelares", "escolas públicas", "Centros de Referência de Assistência Social"],
    action: "integrar identificação precoce, acolhimento e acompanhamento familiar",
    means: "protocolos escolares, canais de denúncia e equipes multiprofissionais",
    purpose: "garantir proteção integral sem violar direitos",
  },
  {
    id: "inclusao-digital-cidadania",
    label: "inclusão digital e cidadania",
    keywords: [
      "inclusao digital",
      "exclusao digital",
      "conectividade",
      "internet",
      "banda larga",
      "wi-fi",
      "wifi",
      "gesac",
      "computadores",
      "dispositivo",
      "celular",
      "tecnologia",
      "digitalizacao",
      "servicos digitais",
      "governo digital",
      "letramento digital",
      "alfabetizacao digital",
      "acessibilidade digital",
      "dados pessoais",
      "privacidade",
      "populacoes marginalizadas",
      "marginalizadas",
      "periferias",
      "rurais",
      "ribeirinhas",
      "quilombolas",
      "indigenas",
      "idosos",
      "pessoas com deficiencia",
    ],
    problem: "a exclusão digital que impede o acesso pleno a informação, serviços públicos, educação, trabalho e participação cidadã",
    group: "populações marginalizadas por renda, território, idade, deficiência ou pertencimento comunitário",
    causes: [
      "desigualdade de infraestrutura tecnológica",
      "custo de conexão e equipamentos",
      "letramento digital insuficiente",
      "barreiras de acessibilidade em serviços digitais",
    ],
    consequences: [
      "bloqueio de acesso a serviços públicos digitais",
      "dependência de terceiros para tarefas cidadãs básicas",
      "exposição a golpes, desinformação e uso inseguro de dados",
      "reprodução da desigualdade educacional e profissional",
    ],
    sourceIds: [
      "marco-civil-internet",
      "tic-domicilios-2024",
      "milton-santos-cidadanias-mutiladas",
      "castells-sociedade-rede",
      "paulo-freire-leitura",
      "lbi-acessibilidade-digital",
      "governo-digital-lei-14129",
      "lgpd-seguranca-digital",
      "wifi-brasil-gesac",
      "carolina-quarto-despejo",
    ],
    crossoverIds: [
      "marco-civil-tic-milton",
      "freire-governo-digital",
      "carolina-tic-constituicao",
      "lbi-governo-digital",
      "castells-lgpd",
    ],
    agents: ["Ministério das Comunicações", "Ministério da Educação", "Ministério da Gestão e da Inovação em Serviços Públicos"],
    action: "integrar conectividade significativa, acesso a dispositivos, letramento digital e acessibilidade em serviços públicos",
    means:
      "Wi-Fi Brasil/GESAC, laboratórios comunitários, oficinas em escolas e CRAS, materiais acessíveis, suporte humanizado e formação de agentes locais",
    purpose: "transformar tecnologia em infraestrutura de cidadania para grupos historicamente excluídos",
  },
  {
    id: "acesso-justica-equidade",
    label: "acesso à justiça e equidade",
    keywords: [
      "acesso a justica",
      "acesso à justica",
      "justica",
      "equidade",
      "defensoria",
      "judiciario",
      "juridico",
      "assistencia juridica",
      "gratuidade",
      "processo",
      "morosidade",
      "linguagem juridica",
      "burocracia",
      "direitos",
      "desigualdade juridica",
      "racismo institucional",
      "justica seletiva",
      "discriminacao social",
      "discriminacao institucional",
      "vieses institucionais",
    ],
    problem: "a distância entre garantias jurídicas formais e proteção concreta para grupos socialmente vulnerabilizados",
    group: "pessoas pobres, população negra, mulheres, pessoas com deficiência, idosos e comunidades afastadas dos serviços de justiça",
    causes: [
      "barreiras socioeconômicas no acesso à assistência jurídica",
      "distância territorial e informacional dos órgãos públicos",
      "linguagem jurídica excessivamente técnica",
      "vieses raciais, de gênero, classe, idade e deficiência nas instituições",
    ],
    consequences: [
      "direitos violados sem resposta efetiva",
      "desconfiança das instituições",
      "reprodução da justiça seletiva",
      "cidadania formal sem proteção material",
    ],
    sourceIds: [
      "constituicao-acesso-justica",
      "defensoria-publica-acesso",
      "cappelletti-garth-acesso",
      "boaventura-democratizacao-justica",
      "cnj-protocolos-antidiscriminatorios",
      "kafka-processo-burocracia",
      "bourdieu-capital-cultural",
      "lbi-acessibilidade-digital",
    ],
    crossoverIds: [
      "constituicao-defensoria-cappelletti",
      "bourdieu-kafka-linguagem-simples",
      "avesso-pele-cnj-racial",
      "lbi-governo-digital",
      "djamila-constituicao",
    ],
    agents: ["Defensorias Públicas", "Conselho Nacional de Justiça", "Ministério da Educação"],
    action: "ampliar assistência jurídica territorializada, linguagem simples e formação antidiscriminatória",
    means:
      "núcleos itinerantes, mutirões jurídicos, atendimento digital assistido, cartilhas acessíveis, cursos obrigatórios e educação em direitos",
    purpose: "transformar acesso formal à justiça em proteção efetiva e equânime",
  },
  {
    id: "tecnologia",
    label: "tecnologia e informação",
    keywords: ["internet", "rede", "redes", "digital", "tecnologia", "desinformacao", "fake", "algoritmo", "inteligencia artificial"],
    problem: "o uso pouco crítico de tecnologias e informações digitais",
    group: "usuários expostos a fluxos intensos de informação",
    causes: ["baixa educação midiática", "opacidade algorítmica", "consumo acelerado de conteúdos"],
    consequences: ["desinformação", "isolamento social", "decisões públicas e privadas mal fundamentadas"],
    sourceIds: ["paulo-freire-leitura", "cf-1988-leitura", "cartilha-enem-2025"],
    crossoverIds: ["freire-constituicao", "djamila-constituicao"],
    agents: ["Ministério da Educação", "plataformas digitais", "agências de comunicação pública"],
    action: "desenvolver educação midiática e transparência informacional",
    means: "oficinas escolares, painéis de checagem e campanhas de verificação",
    purpose: "reduzir manipulações e ampliar autonomia crítica",
  },
  {
    id: "genero",
    label: "gênero e invisibilidade social",
    keywords: ["mulher", "mulheres", "genero", "feminina", "maternidade", "violencia domestica", "assedio", "assedi"],
    problem: "a permanência de desigualdades de gênero nas instituições e no cotidiano",
    group: "mulheres e grupos socialmente invisibilizados",
    causes: ["naturalização de papéis sociais desiguais", "baixa escuta institucional", "subnotificação de violências"],
    consequences: ["limitação da autonomia", "reprodução de violência simbólica", "acesso desigual a oportunidades"],
    sourceIds: ["cf-1988-leitura", "cartilha-enem-2025", "chimamanda-historia-unica"],
    crossoverIds: ["djamila-constituicao", "chimamanda-maria-firmina"],
    agents: ["Ministério das Mulheres", "escolas", "centros de referência especializados"],
    action: "ampliar prevenção, acolhimento e participação dos grupos afetados",
    means: "campanhas permanentes, atendimento humanizado e formação de servidores",
    purpose: "combater desigualdades sem substituir escuta por solução genérica",
  },
  {
    id: "ambiente",
    label: "meio ambiente e sustentabilidade",
    keywords: ["ambiente", "ambiental", "clima", "lixo", "sustentabilidade", "agua", "queimada", "desmatamento"],
    problem: "a distância entre responsabilidade ambiental e prática cotidiana",
    group: "populações expostas a riscos socioambientais",
    causes: ["fiscalização insuficiente", "educação ambiental descontínua", "priorização de interesses econômicos imediatos"],
    consequences: ["degradação de territórios", "risco sanitário", "injustiça ambiental"],
    sourceIds: ["cf-1988-leitura", "sus-lei-8080", "cartilha-enem-2025"],
    crossoverIds: ["sus-constituicao", "freire-constituicao"],
    agents: ["Ministério do Meio Ambiente", "prefeituras", "escolas públicas"],
    action: "articular fiscalização, educação ambiental e saneamento territorial",
    means: "monitoramento público, coleta seletiva orientada e projetos escolares comunitários",
    purpose: "reduzir danos ambientais e proteger comunidades vulneráveis",
  },
  {
    id: "velhice",
    label: "velhice e dignidade",
    keywords: ["idoso", "idosos", "velhice", "envelhecimento", "terceira idade", "longevidade"],
    problem: "a desvalorização social da velhice",
    group: "pessoas idosas e suas redes de cuidado",
    causes: ["etarismo", "baixa acessibilidade urbana", "fragilidade de políticas de cuidado"],
    consequences: ["isolamento social", "violação de direitos", "adoecimento físico e emocional"],
    sourceIds: ["cf-1988-leitura", "sus-lei-8080", "cartilha-enem-2025"],
    crossoverIds: ["sus-constituicao", "freire-constituicao"],
    agents: ["Ministério dos Direitos Humanos", "secretarias de saúde", "centros de convivência"],
    action: "ampliar políticas de cuidado, acessibilidade e convivência intergeracional",
    means: "mapeamento de idosos vulneráveis, UBS e programas comunitários",
    purpose: "garantir autonomia, pertencimento e dignidade na velhice",
  },
  {
    id: "economia",
    label: "economia, renda e política pública",
    keywords: [
      "financeira",
      "financeiro",
      "crise",
      "economia",
      "economica",
      "economico",
      "inflacao",
      "endividamento",
      "superendividamento",
      "desemprego",
      "renda",
      "juros",
      "credito",
      "consumo",
      "custo",
      "pobreza",
      "tributaria",
      "tributario",
      "trabalho",
      "mercado",
    ],
    problem: "a instabilidade econômica que restringe direitos básicos e aprofunda desigualdades",
    group: "famílias de baixa renda, trabalhadores informais e jovens em inserção produtiva",
    causes: ["desigualdade de renda", "educação financeira insuficiente", "precarização do trabalho", "acesso desigual ao crédito"],
    consequences: ["endividamento familiar", "insegurança alimentar", "redução do acesso a moradia, educação e saúde"],
    sourceIds: ["ibge-sis-leitura", "cf-1988-leitura", "bcb-cidadania-financeira"],
    crossoverIds: ["ibge-constituicao", "bcb-educacao-financeira", "freire-constituicao"],
    agents: ["Ministério do Desenvolvimento Social", "Ministério do Trabalho", "Banco Central e Procons"],
    action: "ampliar proteção social, orientação financeira e qualificação produtiva",
    means: "mapeamento de famílias vulneráveis, oficinas públicas, renegociação orientada e programas de renda e emprego",
    purpose: "reduzir o impacto da crise financeira sobre direitos básicos e autonomia familiar",
  },
  {
    id: "cidadania",
    label: "cidadania e direitos sociais",
    keywords: [],
    problem: "a distância entre direitos previstos e acesso real",
    group: "grupos socialmente vulnerabilizados",
    causes: ["negligência institucional", "desigualdade socioeconômica", "baixa educação cidadã"],
    consequences: ["invisibilidade social", "manutenção de desigualdades", "perda de confiança nas instituições"],
    sourceIds: ["cf-1988-leitura", "paulo-freire-leitura", "cartilha-enem-2025"],
    crossoverIds: ["freire-constituicao", "djamila-constituicao"],
    agents: ["governo federal", "secretarias municipais", "escolas e organizações comunitárias"],
    action: "criar políticas públicas continuadas e territorializadas",
    means: "diagnóstico local, campanhas educativas e avaliação de resultados",
    purpose: "aproximar o direito formal da experiência concreta da população",
  },
];

function renderEssayPlan(theme, spin = 0) {
  const cleanTheme = theme.trim() || "tema da semana";
  const plan = buildEssayPlan(cleanTheme, spin);
  return `
    <div class="essay-plan-diagnosis">
      <span class="status-chip">${escapeHTML(plan.profile.label)}</span>
      <h3>Prescrição autoral para "${escapeHTML(cleanTheme)}"</h3>
      <p>${escapeHTML(plan.diagnosis)}</p>
    </div>
    <div class="essay-plan-grid essay-plan-grid-rich">
      ${renderEssayPlanBox("Anamnese estratégica", [
        `Problema central: ${plan.profile.problem}.`,
        `Grupo afetado: ${plan.profile.group}.`,
        `Pergunta de leitura: quem perde direitos, por qual causa e com qual consequência social?`,
      ])}
      ${renderEssayPlanBox("Hipóteses de tese defensáveis", plan.theses)}
      ${renderEssayPlanBox("Repertórios prescritos", plan.sources.map((item) => `${getSourceDisplayTitle(item)}: ${item.howToUse}`))}
      ${renderEssayPlanBox("Evolução C2/C3", [
        `Abra o D1 com ${plan.causes[0]} e prove que essa causa sustenta o problema.`,
        `Use ${plan.sources[0]?.title || "um repertório legitimado"} para explicar o mecanismo, não para enfeitar a frase.`,
        `Feche com consequência: ${plan.consequences[0]}.`,
      ])}
      ${renderEssayPlanBox("Monitorização C4", [
        `D1: causa principal. D2: causa complementar, sem repetir o mesmo argumento.`,
        `Conectores recomendados: ${plan.connectors.join(", ")}.`,
        `Retomada elegante: troque o tema por "essa conjuntura", "tal cenário" ou "esse obstáculo social".`,
      ])}
      ${renderEssayPlanBox("Alta C5", [
        `Agente: ${plan.agent}.`,
        `Ação: ${plan.profile.action}.`,
        `Meio: ${plan.profile.means}.`,
        `Finalidade: ${plan.profile.purpose}.`,
      ])}
      ${renderEssayPlanBox("Risco de tangenciamento", [
        `Não trate apenas do assunto amplo; mantenha o recorte "${cleanTheme}" visível na introdução, nos desenvolvimentos e na conclusão.`,
        `Se o tema pedir Brasil, não fuja para exemplos internacionais como eixo principal.`,
      ])}
      ${renderEssayPlanBox("Checklist de alta", [
        "Tese clara, dois eixos, repertório produtivo, coesão variada e proposta completa.",
        "Depois de cada repertório, escreva mentalmente: isso comprova que...",
      ])}
    </div>
    ${renderPlanSourceShelf(plan.sources)}
    ${renderPlanCrossoverShelf(plan.crossovers)}
    ${renderAuthorialTraining(plan)}
  `;
}

function renderEssayPlanBox(title, lines) {
  const copyId = `plan-${hashString(title + lines.join("|"))}`.replace(/[^a-z0-9_-]/gi, "-");
  return `
    <article class="essay-plan-box">
      <div class="copy-box-head">
        <strong>${escapeHTML(title)}</strong>
        <button class="secondary-btn compact-btn" type="button" data-copy-target="${escapeHTML(copyId)}" data-copy-label="Copiar">Copiar</button>
      </div>
      <textarea id="${escapeHTML(copyId)}" class="plan-copy-text" rows="${Math.max(4, Math.min(8, lines.length + 2))}">${escapeHTML(lines.join("\n"))}</textarea>
    </article>
  `;
}

function renderPlanSourceShelf(sources) {
  return `
    <div class="plan-shelf">
      <div class="plan-shelf-head">
        <h3>Prontuário de leitura para o tema</h3>
        <span>${sources.length} fontes úteis</span>
      </div>
      <div class="plan-source-grid">
        ${sources
          .map(
            (item) => `
              <article class="plan-source-card">
                <div>
                  <small>${escapeHTML(getSourceDisplayType(item))}</small>
                  <h4>${escapeHTML(getSourceDisplayTitle(item))}</h4>
                </div>
                <p>${escapeHTML(item.readingFocus)}</p>
                <div class="source-essential-box compact">
                  <strong>Procure no exame</strong>
                  <ul>
                    ${(item.essentialPoints || []).slice(0, 2).map((point) => `<li>${escapeHTML(point)}</li>`).join("")}
                  </ul>
                </div>
                <div class="source-link-row">
                  ${(item.links || []).slice(0, 2).map((link) => renderExternalLink(link)).join("")}
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderPlanCrossoverShelf(crossovers) {
  return `
    <div class="plan-shelf">
      <div class="plan-shelf-head">
        <h3>JUNTA MÉDICA PARA TRATAR O CASO</h3>
        <span>${crossovers.length} rotas autorais</span>
      </div>
      <div class="plan-crossover-grid">
        ${crossovers
          .map(
            (item) => `
              <article class="plan-crossover-card">
                <div class="crossover-flow">
                  <span>${escapeHTML(item.start)}</span>
                  <strong>+</strong>
                  <span>${escapeHTML(item.closeWith)}</span>
                </div>
                <p>${escapeHTML(item.bridge)}</p>
                <small>${escapeHTML(item.closing)}</small>
              </article>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderAuthorialTraining(plan) {
  return `
    <div class="authorial-training">
      <div class="plan-shelf-head">
        <h3>Oficina clínica de parágrafos autorais</h3>
        <span>C2, C3, C4 e C5</span>
      </div>
      <div class="authorial-paragraph-grid">
        ${plan.paragraphs.map((paragraph) => renderTrainingParagraph(paragraph)).join("")}
      </div>
    </div>
  `;
}

function renderTrainingParagraph(paragraph) {
  return `
    <article class="training-paragraph-card">
      <div class="training-paragraph-head">
        <span class="day-pill">${escapeHTML(paragraph.code)}</span>
        <div>
          <h4>${escapeHTML(paragraph.title)}</h4>
          <small>${escapeHTML(paragraph.focus)}</small>
        </div>
      </div>
      <p>${markPlanText(paragraph.text, paragraph.highlight)}</p>
      <div class="grammar-note">
        <strong>Conduta de norma culta</strong>
        <span>${escapeHTML(paragraph.grammarNote)}</span>
      </div>
    </article>
  `;
}

function markPlanText(text, highlight) {
  const safeText = escapeHTML(text);
  const safeHighlight = escapeHTML(highlight);
  if (!safeHighlight || !safeText.includes(safeHighlight)) return safeText;
  return safeText.replace(safeHighlight, `<mark class="grammar-highlight">${safeHighlight}</mark>`);
}

function buildEssayPlan(theme, spin = 0) {
  const profile = detectThemeProfile(theme);
  const seed = getTextSeed(theme) + Number(spin || 0) * 37;
  const causes = pickRotating(profile.causes, seed, 2);
  const consequences = pickRotating(profile.consequences, seed + 5, 2);
  const connectors = pickRotating(["Nesse contexto", "Sob essa lógica", "Além desse fator", "Como consequência", "Portanto"], seed + 3, 4);
  const agent = pickRotating(profile.agents, seed + 9, 1)[0];
  const sources = selectThemeItems(REDACTION_LIBRARY.sourcePacks || [], profile, theme, profile.sourceIds, seed, 3);
  const crossovers = selectThemeItems(REDACTION_LIBRARY.authorCrossovers || [], profile, theme, profile.crossoverIds, seed + 2, 3);
  const diagnosis = `O protocolo reconheceu plantão de ${profile.label}. A prescrição prioriza ${causes[0]}, ${causes[1]} e consequência social ligada a ${consequences[0]}.`;
  const theses = [
    `Tese 1: ${causes[0]} e ${causes[1]} impedem o enfrentamento de ${profile.problem}.`,
    `Tese 2: o problema persiste porque ${profile.group} enfrenta ${causes[0]} e, ao mesmo tempo, ${consequences[0]}.`,
    `Tese de alta nota: a solução exige transformar repertório legal/cultural em política pública específica, e não apenas constatar a gravidade do tema.`,
  ];
  return {
    theme,
    profile,
    causes,
    consequences,
    connectors,
    agent,
    sources,
    crossovers,
    diagnosis,
    theses,
    paragraphs: buildTrainingParagraphs({ theme, profile, causes, consequences, agent, sources, crossovers }),
  };
}

function detectThemeProfile(theme) {
  const normalized = normalizeForMatch(theme);
  const scored = ESSAY_THEME_PROFILES.map((profile) => ({
    profile,
    score: profile.keywords.reduce((sum, keyword) => sum + (normalized.includes(keyword) ? 1 : 0), 0),
  })).sort((a, b) => b.score - a.score);
  return scored[0]?.score ? scored[0].profile : ESSAY_THEME_PROFILES[ESSAY_THEME_PROFILES.length - 1];
}

function selectThemeItems(items, profile, theme, preferredIds, seed, count) {
  const preferred = preferredIds.map((id) => items.find((item) => item.id === id)).filter(Boolean);
  const scored = items
    .map((item) => ({ item, score: scoreThemeItem(item, profile, theme) }))
    .filter(({ item, score }) => score > 0 && !preferred.some((preferredItem) => preferredItem.id === item.id))
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
  const relevant = uniqueById([...pickRotating(preferred, seed, preferred.length), ...pickRotating(scored, seed + 3, scored.length)]);
  const fallback = uniqueById([...relevant, ...items]);
  return fallback.slice(0, count);
}

function scoreThemeItem(item, profile, theme) {
  const haystack = normalizeForMatch([
    item.title,
    item.type,
    item.sourceLabel,
    item.readingFocus,
    item.howToUse,
    item.bridge,
    item.closing,
    ...(item.themes || []),
    ...(item.bestThemes || []),
    ...(item.essentialPoints || []),
  ].join(" "));
  const themeWords = normalizeForMatch(theme).split(/\s+/).filter((word) => word.length > 3);
  const themeScore = themeWords.reduce((sum, word) => sum + (haystack.includes(word) ? 1 : 0), 0);
  const profileScore = profile.keywords.reduce((sum, word) => sum + (haystack.includes(word) ? 1 : 0), 0);
  return themeScore + profileScore;
}

function buildTrainingParagraphs({ theme, profile, causes, consequences, agent, sources, crossovers }) {
  const mainSource = sources[0] ? getSourceDisplayTitle(sources[0]) : "um repertório legitimado";
  const secondSource = sources[1] ? getSourceDisplayTitle(sources[1]) : "a Constituição de 1988";
  const crossover = crossovers[0];
  const introHighlight = `não decorre de escolhas individuais isoladas, mas de ${causes[0]}`;
  const c3Highlight = `Isso ocorre porque ${causes[0]} limita a ação coletiva`;
  const c4Highlight = "Além desse fator, tal cenário";
  const c5Highlight = `por meio de ${profile.means}, a fim de ${profile.purpose}`;
  return [
    {
      code: "C2",
      title: "Introdução com repertório produtivo",
      focus: "Tema, repertório e tese conectados.",
      text: `No debate sobre ${theme}, ${mainSource} permite compreender que o problema ${introHighlight}. Nesse cenário, ${causes[0]} e ${causes[1]} sustentam a permanência de ${profile.problem} no Brasil.`,
      highlight: introHighlight,
      grammarNote:
        "A construção 'não..., mas...' cria paralelismo argumentativo e evita repertório decorativo; a vírgula depois de 'Nesse cenário' marca adjunto adverbial deslocado.",
    },
    {
      code: "C3",
      title: "Desenvolvimento com autoria",
      focus: "Causa, explicação e consequência social.",
      text: `Em primeiro lugar, ${causes[0]} enfraquece o enfrentamento de ${theme}. ${c3Highlight} e impede que ${profile.group} acesse respostas consistentes. Como consequência, observa-se ${consequences[0]}, o que confirma a necessidade de intervenção pública planejada.`,
      highlight: c3Highlight,
      grammarNote:
        "O tópico frasal vem no início do parágrafo; a oração causal com 'porque' explica o mecanismo do argumento, exatamente o que fortalece a C3.",
    },
    {
      code: "C4",
      title: "Progressão entre argumentos",
      focus: "Coesão referencial e sequencial.",
      text: `${c4Highlight} é agravado por ${causes[1]}. Essa conjuntura retoma o problema inicial sem repetir mecanicamente o tema e permite aproximar ${secondSource} da realidade discutida. Desse modo, o texto progride do diagnóstico para a consequência social.`,
      highlight: c4Highlight,
      grammarNote:
        "A expressão 'Além desse fator' soma novo argumento, enquanto 'Essa conjuntura' faz retomada referencial e evita repetição pobre.",
    },
    {
      code: "C5",
      title: "Conclusão com intervenção completa",
      focus: "Agente, ação, meio, finalidade e detalhamento.",
      text: `Portanto, ${agent} deve ${profile.action}, ${c5Highlight}. Para isso, a medida deve priorizar ${profile.group}, com avaliação periódica de resultados e participação social, especialmente quando o cruzamento ${crossover ? `${crossover.start} + ${crossover.closeWith}` : "autoral escolhido"} sustentar a tese.`,
      highlight: c5Highlight,
      grammarNote:
        "As locuções 'por meio de' e 'a fim de' explicitam modo e finalidade; isso ajuda a proposta a ficar completa e articulada à discussão.",
    },
  ];
}

function pickRotating(items, seed, count) {
  const list = [...(items || [])];
  if (!list.length) return [];
  const start = Math.abs(seed) % list.length;
  return [...list.slice(start), ...list.slice(0, start)].slice(0, count);
}

function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item?.id || item?.title;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getTextSeed(text) {
  return String(text)
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function normalizeForMatch(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function renderPerformanceView(user) {
  const attempts = [...(user.attemptLog || [])].reverse().slice(0, 12);
  const level = classifyStudent(user);
  const easyStats = getDifficultyStats(user, "easy");
  const easyAccuracy = easyStats.total ? Math.round((easyStats.correct / easyStats.total) * 100) : 0;
  const belowTarget = getSkillsBelowTarget(user);
  const recurringErrors = getRecurringErrorCount(user);
  return `
    <section class="grid metrics-grid">
      ${metric("Nível", level.label, level.reason)}
      ${metric("Fáceis", easyStats.total ? `${easyAccuracy}%` : "sem dados", "trava para subir de nível")}
      ${metric("Abaixo de 80%", belowTarget.length, "habilidades prioritárias")}
      ${metric("Erros recorrentes", recurringErrors, "últimas tentativas")}
    </section>

    <section class="grid performance-layout">
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Acerto por competência</h2>
            <p>Média das tentativas feitas neste navegador.</p>
          </div>
        </div>
        <div class="bar-list">
          ${COMPETENCIES.map((competency) => {
            const compAttempts = (user.attemptLog || []).filter((attempt) => attempt.competencyId === competency.id);
            const average = compAttempts.length
              ? Math.round((compAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / (compAttempts.length * 5)) * 100)
              : 0;
            return `
              <div class="bar-row">
                <div class="bar-label"><span>${competency.short}</span><span>${average}%</span></div>
                <div class="bar-track"><div class="bar-fill" style="width: ${average}%"></div></div>
              </div>
            `;
          }).join("")}
        </div>
      </article>
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Tentativas recentes</h2>
            <p>Histórico do treino diário e das revisões.</p>
          </div>
        </div>
        ${
          attempts.length
            ? `
              <table class="attempt-table">
                <thead><tr><th>Dia</th><th>Habilidade</th><th>Nota</th><th>Data</th></tr></thead>
                <tbody>
                  ${attempts
                    .map(
                      (attempt) => `
                        <tr>
                          <td>${attempt.day}</td>
                          <td>${escapeHTML(attempt.skillTitle)}</td>
                          <td>${attempt.score}/${attempt.total || 5}</td>
                          <td>${formatDateTime(attempt.createdAt)}</td>
                        </tr>
                      `,
                    )
                    .join("")}
                </tbody>
              </table>
            `
            : `<div class="empty-state">Nenhuma tentativa registrada ainda.</div>`
        }
      </article>
    </section>
  `;
}

function getSkillsBelowTarget(user) {
  return COMPETENCIES.flatMap((competency) =>
    competency.skills
      .map((skill) => ({ competency, skill, accuracy: getSkillAccuracy(user, skill.id) }))
      .filter((item) => item.accuracy !== null && item.accuracy < 80),
  );
}

function getRecurringErrorCount(user) {
  const counts = {};
  (user.attemptLog || []).slice(-12).forEach((attempt) => {
    if (attempt.score >= (attempt.total || 5)) return;
    counts[attempt.skillId] = (counts[attempt.skillId] || 0) + 1;
  });
  return Object.values(counts).filter((count) => count >= 2).length;
}

function bindViewEvents(user) {
  document.getElementById("timerToggleBtn")?.addEventListener("click", toggleTimer);
  document.getElementById("timerResetBtn")?.addEventListener("click", () => {
    stopTimer();
    timer.seconds = getCurrentTimerPreset().seconds;
    render();
  });
  document.querySelectorAll("[data-timer-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      stopTimer();
      const preset = TIMER_PRESETS[button.dataset.timerMode] || TIMER_PRESETS.focus;
      timer.mode = preset.label;
      timer.seconds = preset.seconds;
      render();
    });
  });

  document.querySelectorAll("[data-start-area]").forEach((button) => {
    button.addEventListener("click", () => startQuiz(user, selectedDay, button.dataset.startArea));
  });
  document.getElementById("selfPerceptionSelect")?.addEventListener("change", (event) => {
    const mission = getMissionRecord(user, selectedDay);
    mission.selfPerception = event.target.value;
    updateDailyCompletion(user, selectedDay);
    saveCurrentUser(user);
    render();
  });
  document.getElementById("restCheck")?.addEventListener("change", (event) => {
    const mission = getMissionRecord(user, selectedDay);
    mission.restChecked = event.target.checked;
    updateDailyCompletion(user, selectedDay);
    saveCurrentUser(user);
    render();
  });
  document.getElementById("goNextDayBtn")?.addEventListener("click", () => {
    selectedDay = clamp((selectedDay || 1) + 1, 1, DAY_COUNT);
    quizState = null;
    activeView = "today";
    persistUiState({ scrollY: 0 });
    requestScrollTop();
    render();
  });

  document.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      quizState.answers[quizState.currentIndex] = Number(button.dataset.answer);
      render();
    });
  });

  document.getElementById("prevQuestionBtn")?.addEventListener("click", () => {
    quizState.currentIndex = Math.max(0, quizState.currentIndex - 1);
    render();
  });

  document.getElementById("nextQuestionBtn")?.addEventListener("click", () => {
    if (quizState.currentIndex === quizState.items.length - 1) {
      finishQuiz(user);
      return;
    }
    quizState.currentIndex += 1;
    render();
  });

  document.querySelectorAll("[data-select-day]").forEach((button) => bindSelectDay(button));

  document.getElementById("bankSearch")?.addEventListener("input", (event) => {
    document.getElementById("bankGrid").innerHTML = renderSkillCards(event.target.value);
  });

  document.getElementById("fetchDailyNewsBtn")?.addEventListener("click", async () => {
    const endpointInput = document.getElementById("dailyNewsEndpointInput");
    const status = document.getElementById("dailyNewsStatus");
    const endpoint = endpointInput?.value?.trim() || DAILY_NEWS_DEFAULT_ENDPOINT;
    await fetchDailyNewsForUser(user, endpoint, status);
  });

  document.getElementById("loadDailyNewsJsonBtn")?.addEventListener("click", () => {
    const input = document.getElementById("dailyNewsJsonInput");
    const endpointInput = document.getElementById("dailyNewsEndpointInput");
    const status = document.getElementById("dailyNewsStatus");
    try {
      const payload = normalizeDailyNewsPayload(input?.value || "");
      user.dailyNewsEndpoint = endpointInput?.value?.trim() || DAILY_NEWS_DEFAULT_ENDPOINT;
      user.dailyNewsPayload = payload;
      saveCurrentUser(user);
      render();
    } catch (error) {
      if (status) status.textContent = `JSON inválido: ${error.message || error}`;
    }
  });

  document.getElementById("useDailyNewsSampleBtn")?.addEventListener("click", () => {
    delete user.dailyNewsPayload;
    user.dailyNewsEndpoint = document.getElementById("dailyNewsEndpointInput")?.value?.trim() || DAILY_NEWS_DEFAULT_ENDPOINT;
    saveCurrentUser(user);
    render();
  });

  if (activeView === "news" && !user.dailyNewsPayload && DAILY_NEWS_DEFAULT_ENDPOINT && !dailyNewsAutoFetchStarted) {
    dailyNewsAutoFetchStarted = true;
    const endpointInput = document.getElementById("dailyNewsEndpointInput");
    const status = document.getElementById("dailyNewsStatus");
    fetchDailyNewsForUser(user, endpointInput?.value?.trim() || DAILY_NEWS_DEFAULT_ENDPOINT, status, { auto: true });
  }

  bindTriClinicEvents(user);

  document.getElementById("saveEssayThemeBtn")?.addEventListener("click", () => {
    const input = document.getElementById("essayThemeInput");
    user.weeklyEssayTheme = input?.value?.trim() || "";
    saveCurrentUser(user);
    render();
  });

  document.getElementById("spinEssayPlanBtn")?.addEventListener("click", () => {
    const input = document.getElementById("essayThemeInput");
    user.weeklyEssayTheme = input?.value?.trim() || user.weeklyEssayTheme || "";
    user.essayPlanSeed = Number(user.essayPlanSeed || 0) + 1;
    saveCurrentUser(user);
    render();
  });

  document.getElementById("essayThemeInput")?.addEventListener("input", (event) => {
    const plan = document.getElementById("essayPlan");
    if (!plan) return;
    plan.innerHTML = renderEssayPlan(event.target.value, user.essayPlanSeed || 0);
    bindCopyButtons();
  });

  document.getElementById("essaySearchInput")?.addEventListener("input", (event) => {
    const library = document.getElementById("essayLibrary");
    if (!library) return;
    library.innerHTML = renderEssayCards(getEditableEssays(user), event.target.value, user.redacaoEssayYear || "todos");
    bindEssayLibraryEvents(user);
    bindRedacaoEditEvents(user);
  });

  document.getElementById("c1TipSearchInput")?.addEventListener("input", (event) => {
    const board = document.getElementById("c1TipBoard");
    if (!board) return;
    const term = event.target.value || "";
    const tips = term.trim() ? getC1TipSearchResults(term) : getDailyC1Tips(user);
    board.innerHTML = renderC1TipBoard(tips, { searchTerm: term.trim() });
  });

  document.getElementById("clearEssaySearchBtn")?.addEventListener("click", () => {
    const input = document.getElementById("essaySearchInput");
    const library = document.getElementById("essayLibrary");
    if (input) input.value = "";
    if (library) library.innerHTML = renderEssayCards(getEditableEssays(user), "", user.redacaoEssayYear || "todos");
    bindEssayLibraryEvents(user);
    bindRedacaoEditEvents(user);
  });

  document.getElementById("redacaoWeekSelect")?.addEventListener("change", (event) => {
    user.redacaoActiveWeek = Number(event.target.value);
    saveCurrentUser(user);
    render();
  });

  bindRedacaoScoreEvents(user);
  bindEssayLibraryEvents(user);
  bindCopyButtons();
  bindRedacaoEditEvents(user);
}

function bindTriClinicEvents(user) {
  document.getElementById("triClinicAreaSelect")?.addEventListener("change", (event) => {
    const area = COMPETENCIES.find((competency) => competency.id === event.target.value) || COMPETENCIES[0];
    saveTriClinicSettings(user, { areaId: area.id, skillId: area.skills[0].id });
    delete user.triClinicSession;
    saveCurrentUser(user);
    render();
  });

  document.getElementById("triClinicSkillSelect")?.addEventListener("change", (event) => {
    saveTriClinicSettings(user, { skillId: event.target.value });
    delete user.triClinicSession;
    saveCurrentUser(user);
    render();
  });

  document.getElementById("triClinicQuantitySelect")?.addEventListener("change", (event) => {
    saveTriClinicSettings(user, { quantity: Number(event.target.value) });
    saveCurrentUser(user);
  });

  document.getElementById("triClinicGenerateBtn")?.addEventListener("click", () => {
    createTriClinicSession(user);
    saveCurrentUser(user);
    render();
  });

  document.getElementById("triClinicRegenerateBtn")?.addEventListener("click", () => {
    createTriClinicSession(user);
    saveCurrentUser(user);
    render();
  });

  document.getElementById("triClinicClearBtn")?.addEventListener("click", () => {
    delete user.triClinicSession;
    saveCurrentUser(user);
    render();
  });

  document.querySelectorAll("[data-clinic-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      const session = user.triClinicSession;
      if (!session || session.checked) return;
      session.answers = session.answers || {};
      session.answers[button.dataset.clinicAnswer] = Number(button.dataset.optionIndex);
      saveCurrentUser(user);
      render();
    });
  });

  document.getElementById("triClinicCheckBtn")?.addEventListener("click", () => {
    const session = user.triClinicSession;
    if (!session) return;
    session.checked = true;
    recordTriClinicAttempt(user, session);
    saveCurrentUser(user);
    render();
  });
}

function bindEssayLibraryEvents(user) {
  document.querySelectorAll("[data-essay-year-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      user.redacaoEssayYear = button.dataset.essayYearFilter || "todos";
      saveCurrentUser(user);
      render();
    });
  });
  document.querySelectorAll("[data-essay-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const essayId = button.dataset.essayOpen;
      const essay = getEditableEssays(user).find((item) => item.id === essayId);
      const input = document.getElementById("essaySearchInput");
      const library = document.getElementById("essayLibrary");
      const search = essay?.student || essay?.theme || essayId || "";
      if (input) input.value = search;
      if (library) library.innerHTML = renderEssayCards(getEditableEssays(user), search, user.redacaoEssayYear || "todos");
      bindRedacaoEditEvents(user);
    });
  });
}

function bindCopyButtons() {
  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    if (button.dataset.copyBound === "true") return;
    button.dataset.copyBound = "true";
    button.addEventListener("click", async () => {
      const target = document.getElementById(button.dataset.copyTarget);
      const text = target?.value || target?.textContent || "";
      if (!text) return;
      try {
        await navigator.clipboard?.writeText(text);
        button.textContent = "Copiado";
        window.setTimeout(() => {
          button.textContent = button.dataset.copyLabel || "Copiar";
        }, 1200);
      } catch {
        target?.focus();
        target?.select?.();
      }
    });
  });
  document.querySelectorAll("[data-copy-essay]").forEach((button) => {
    if (button.dataset.copyBound === "true") return;
    button.dataset.copyBound = "true";
    button.addEventListener("click", async () => {
      const card = button.closest(".editable-essay-card");
      if (!card) return;
      const fieldValue = (field) => card.querySelector(`[data-redacao-edit][data-field="${field}"]`)?.value?.trim() || "";
      const paragraphs = Array.from(card.querySelectorAll('[data-redacao-edit][data-field="paragraph"]'))
        .map((item) => item.value.trim())
        .filter(Boolean);
      const text = [
        `Ano: ${fieldValue("year")}`,
        `Tema: ${fieldValue("theme")}`,
        `Modelo: ${fieldValue("student")}`,
        fieldValue("source") ? `Fonte: ${fieldValue("source")}` : "",
        "",
        ...paragraphs,
      ]
        .filter((line, index, list) => line || list[index - 1])
        .join("\n\n");
      if (!text.trim()) return;
      try {
        await navigator.clipboard?.writeText(text);
        button.textContent = "Copiado para Word";
        window.setTimeout(() => {
          button.textContent = "Copiar modelo para Word";
        }, 1400);
      } catch {
        const firstParagraph = card.querySelector('[data-redacao-edit][data-field="paragraph"]');
        firstParagraph?.focus();
        firstParagraph?.select?.();
      }
    });
  });
}

function bindRedacaoScoreEvents(user) {
  document.querySelectorAll("[data-redacao-score]").forEach((field) => {
    field.addEventListener("input", () => {
      const week = Number(field.dataset.week);
      const slot = Number(field.dataset.slot);
      const scoreField = field.dataset.field;
      if (!week || !Number.isInteger(slot) || !scoreField) return;
      user.redacaoWeeks = user.redacaoWeeks || {};
      const record = user.redacaoWeeks[week] || { essays: [{}, {}, {}] };
      record.essays = Array.from({ length: 3 }, (_, index) => ({ ...(record.essays?.[index] || {}) }));
      record.essays[slot][scoreField] = field.value;
      user.redacaoWeeks[week] = record;
      saveCurrentUser(user);
      const summary = document.getElementById("redacaoScoreSummary");
      if (summary) summary.innerHTML = renderRedacaoScoreSummary(getRedacaoWeekSummary(user, week));
    });
  });
}

function bindRedacaoEditEvents(user) {
  document.querySelectorAll("[data-redacao-edit]").forEach((field) => {
    field.addEventListener("input", () => {
      const essayId = field.dataset.essayId;
      if (!essayId) return;
      user.redacaoEssayEdits = user.redacaoEssayEdits || {};
      const edit = user.redacaoEssayEdits[essayId] || {};
      if (field.dataset.field === "paragraph") {
        const index = Number(field.dataset.paragraphIndex || 0);
        edit.paragraphs = edit.paragraphs || [];
        edit.paragraphs[index] = field.value;
      } else {
        edit[field.dataset.field] = field.value;
      }
      user.redacaoEssayEdits[essayId] = edit;
      saveCurrentUser(user);
    });
  });
}

function bindSelectDay(button) {
  button.addEventListener("click", () => {
    selectedDay = Number(button.dataset.selectDay);
    activeView = "today";
    quizState = null;
    persistUiState({ scrollY: 0 });
    requestScrollTop();
    render();
  });
}

function requestScrollTop() {
  shouldScrollTop = true;
}

function flushScrollPosition() {
  if (pendingScrollRestore !== null) {
    const targetY = Math.max(0, Number(pendingScrollRestore) || 0);
    pendingScrollRestore = null;
    shouldScrollTop = false;
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: targetY, left: 0, behavior: "auto" });
      window.setTimeout(() => {
        window.scrollTo({ top: targetY, left: 0, behavior: "auto" });
      }, 0);
    });
    return;
  }
  if (!shouldScrollTop) return;
  shouldScrollTop = false;
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 0);
  });
}

function startQuiz(user, day, areaId = "linguagens") {
  const block = getCurrentMission(user, day).find((item) => item.areaId === areaId);
  if (!block) return;
  quizState = {
    day,
    areaId,
    skillId: block.skill.id,
    competencyId: block.competency.id,
    competencyShort: block.competency.short,
    skillTitle: block.skill.title,
    items: block.questions,
    answers: {},
    currentIndex: 0,
    finished: false,
    score: 0,
  };
  saveCurrentUser(user);
  render();
}

function finishQuiz(user) {
  const score = quizState.items.reduce((total, question, index) => {
    return total + (quizState.answers[index] === question.answer ? 1 : 0);
  }, 0);
  const mission = getMissionRecord(user, quizState.day);
  const passed = score >= PASSING_SCORE;
  const previous = mission.blocks[quizState.areaId] || {};
  const attempts = (previous.attempts || 0) + 1;
  const questionResults = quizState.items.map((question, index) => ({
    id: question.id,
    skillId: quizState.skillId,
    areaId: quizState.competencyId,
    difficulty: question.difficulty || "medium",
    correct: quizState.answers[index] === question.answer,
  }));

  mission.blocks[quizState.areaId] = {
    passed: Boolean(previous.passed || passed),
    bestScore: Math.max(previous.bestScore || 0, score),
    attempts,
    corrected: true,
    lastQuestionIds: quizState.items.map((question) => question.id),
    completedAt: passed ? new Date().toISOString() : previous.completedAt || "",
  };
  user.attemptLog = user.attemptLog || [];
  user.attemptLog.push({
    day: quizState.day,
    competencyId: quizState.competencyId,
    competencyShort: quizState.competencyShort,
    skillId: quizState.skillId,
    skillTitle: quizState.skillTitle,
    score,
    total: quizState.items.length,
    passed,
    questionResults,
    createdAt: new Date().toISOString(),
  });
  updateDailyCompletion(user, quizState.day);

  quizState.finished = true;
  quizState.score = score;
  saveCurrentUser(user);
  render();
}

function updateDailyCompletion(user, day) {
  const mission = getMissionRecord(user, day);
  user.progress = user.progress || {};
  const complete = isMissionComplete(user, day);
  const blockScores = Object.values(mission.blocks || {});
  const bestScore = blockScores.reduce((sum, block) => sum + (block.bestScore || 0), 0);
  const attempts = blockScores.reduce((sum, block) => sum + (block.attempts || 0), 0);
  user.progress[day] = {
    passed: complete,
    bestScore,
    attempts,
    completedAt: complete ? mission.completedAt || new Date().toISOString() : "",
  };
  if (complete && !mission.completedAt) {
    mission.completedAt = user.progress[day].completedAt;
  }
}

function toggleTimer() {
  if (timer.running) {
    stopTimer();
    render();
    return;
  }
  timer.running = true;
  timer.intervalId = window.setInterval(() => {
    timer.seconds = Math.max(0, timer.seconds - 1);
    const value = document.getElementById("timerValue");
    if (value) value.textContent = formatSeconds(timer.seconds);
    if (timer.seconds === 0) {
      stopTimer();
      render();
    }
  }, 1000);
  render();
}

function stopTimer() {
  if (timer.intervalId) window.clearInterval(timer.intervalId);
  timer.intervalId = null;
  timer.running = false;
}

function getCurrentTimerPreset() {
  return Object.values(TIMER_PRESETS).find((preset) => preset.label === timer.mode) || TIMER_PRESETS.focus;
}

function getOverallAccuracy(user) {
  const attempts = user.attemptLog || [];
  if (!attempts.length) return 0;
  const score = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const total = attempts.reduce((sum, attempt) => sum + (attempt.total || 5), 0);
  return total ? Math.round((score / total) * 100) : 0;
}

function getRedacaoAverage(user) {
  const weeklyScores = Object.values(user.redacaoWeeks || {}).flatMap((record) =>
    (record.essays || []).map(getEssayComputedTotal).filter((score) => score !== null),
  );
  if (weeklyScores.length) {
    return Math.round(weeklyScores.reduce((sum, score) => sum + score, 0) / weeklyScores.length);
  }
  const scores = user.redacaoScores || [];
  if (scores.length) {
    return Math.round(scores.reduce((sum, score) => sum + Number(score || 0), 0) / scores.length);
  }
  const currentScore = Number(user.profile?.currentScore || 0);
  return currentScore >= 0 && currentScore <= 1000 ? currentScore || 0 : 0;
}

function statusLabel(status) {
  if (status === "done") return "concluído";
  if (status === "available") return "liberado";
  return "bloqueado";
}

function formatSeconds(totalSeconds) {
  if (totalSeconds >= 3600) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(`${dateString}T00:00:00`));
}

function formatDateTime(dateString) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(dateString));
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function registerServiceWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

  const protocol = window.location?.protocol;
  const hostname = window.location?.hostname;
  const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(hostname);
  if (protocol !== "https:" && !isLocalHost) return;

  const register = () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.warn("O modo instalável/offline não pôde ser ativado.", error);
    });
  };

  if (document.readyState === "complete") {
    register();
  } else if (typeof window.addEventListener === "function") {
    window.addEventListener("load", register, { once: true });
  }
}

if (typeof document !== "undefined") {
  document.addEventListener(
    "click",
    (event) => {
      const link = event.target?.closest?.("a[href]");
      if (!link) return;
      persistUiState();
    },
    true,
  );
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => persistUiState());
  window.addEventListener("beforeunload", () => persistUiState());
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") persistUiState();
  });
}

registerServiceWorker();
render();
