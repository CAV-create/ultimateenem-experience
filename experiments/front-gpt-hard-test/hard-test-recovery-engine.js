(() => {
  const coursePolicies = Object.freeze({
    ultimate: { enabled: true, label: "UltimateENEM", standard: "Competência e habilidade ENEM" },
    diadea: { enabled: true, label: "DIA DE A", standard: "Competência e habilidade UERJ" },
    discmed: { enabled: true, label: "discMED", standard: "Critério e habilidade discursiva UERJ" },
    medpism: { enabled: true, label: "MedPISM", standard: "Conteúdo programático e habilidade PISM" },
    vaibem: { enabled: true, label: "VaiBem", standard: "Recuperação específica por etapa escolar" },
    vaibem_start: { enabled: true, label: "VaiBem START", standard: "Habilidade escolar com linguagem concreta e passos curtos" },
    vaibem_rise: { enabled: true, label: "VaiBem RISE", standard: "Habilidade escolar com autonomia progressiva" },
  });

  const packs = {
    linguagem: {
      title: "Linguagem, intenção e efeito de sentido",
      sourceTitle: "Caso clínico CAVMED · Comunicação e diagnóstico textual",
      sourcePath: "Hospital CAVMED / Clínica da Linguagem",
      sourceChapter: "Tipos e gêneros textuais; funções da linguagem; variação e norma; intertextualidade",
      sourceFit: "Conduta pedagógica elaborada pelos médicos especialistas do Hospital CAVMED.",
      summary: "Todo texto combina uma finalidade, um público, um gênero e escolhas linguísticas. Para resolver uma questão, localize primeiro o comando, depois identifique a evidência textual que sustenta a resposta. Variação linguística não é erro automático: ela depende do grupo, da região, da época e da situação comunicativa. Nas funções da linguagem, observe qual elemento da comunicação recebe maior destaque. Na intertextualidade, um texto retoma outro para criar um novo efeito de sentido.",
      map: [
        ["Texto", "gênero + finalidade"],
        ["Contexto", "quem fala, para quem e onde"],
        ["Marcas", "vocabulário, registro e estrutura"],
        ["Efeito", "informar, convencer, emocionar ou manter contato"],
      ],
      flashcards: [
        ["Gênero textual", "Forma social concreta de comunicação, como notícia, anúncio ou carta."],
        ["Variação linguística", "Mudança regular da língua conforme grupo, região, época ou situação."],
        ["Função referencial", "Prioriza o assunto e a informação objetiva."],
        ["Intertextualidade", "Relação explícita ou implícita entre textos."],
      ],
      quiz: [
        ["Uma notícia apresenta dados sobre vacinação. Qual função tende a predominar?", "Referencial", ["Fática", "Poética", "Emotiva"], "A função referencial prioriza o assunto e a transmissão de informação."],
        ["A expressão usada apenas por um grupo profissional exemplifica qual fenômeno?", "Variação social", ["Erro gramatical", "Ausência de linguagem", "Tradução literal"], "Jargões e vocabulários de grupo são formas de variação social."],
        ["Um anúncio diz: ‘Participe agora’. A forma verbal destaca qual finalidade?", "Convencer o receptor", ["Descrever o canal", "Explicar o código", "Narrar um fato passado"], "O imperativo dirige a mensagem ao receptor e busca influenciá-lo."],
        ["Quando um texto retoma outro para produzir novo sentido, ocorre", "intertextualidade", ["isolamento textual", "erro de coesão", "neutralidade vocabular"], "A intertextualidade nasce do diálogo entre textos."],
        ["Antes de escolher a alternativa em uma questão de leitura, o passo mais seguro é", "localizar no texto a evidência pedida pelo comando", ["marcar a opção mais longa", "usar apenas opinião pessoal", "ignorar o gênero textual"], "A resposta precisa ser sustentada pelo comando e por uma evidência do texto."],
      ],
    },
    territorio: {
      title: "Sociedade, território e leitura da paisagem",
      sourceTitle: "Caso clínico CAVMED · Território e leitura da paisagem",
      sourcePath: "Hospital CAVMED / Clínica de Humanidades",
      sourceChapter: "Urbanização brasileira; dinâmica demográfica; cartografia; geologia e geomorfologia",
      sourceFit: "Caso clínico interdisciplinar preparado pelos médicos especialistas do Hospital CAVMED.",
      summary: "O território é produzido pela relação entre sociedade, economia, técnica, política e natureza. No Brasil, a urbanização acelerada foi impulsionada pela industrialização e pelo êxodo rural, muitas vezes sem infraestrutura suficiente. A dinâmica demográfica muda com natalidade, mortalidade, migração e envelhecimento. Mapas representam fenômenos segundo escala, orientação e legenda. Em fenômenos naturais, identifique o processo físico antes de associá-lo às transformações da paisagem.",
      map: [
        ["Território", "poder + ocupação"],
        ["Urbanização", "indústria + migração"],
        ["População", "natalidade + mortalidade + migração"],
        ["Paisagem", "ação humana + dinâmica natural"],
      ],
      flashcards: [
        ["Êxodo rural", "Deslocamento da população do campo para a cidade."],
        ["Crescimento vegetativo", "Diferença entre natalidade e mortalidade."],
        ["Escala cartográfica", "Relação entre a medida no mapa e a medida real."],
        ["Placas tectônicas", "Grandes blocos litosféricos cujo movimento transforma o relevo."],
      ],
      quiz: [
        ["Qual movimento populacional ajudou a acelerar a urbanização brasileira?", "Êxodo rural", ["Nomadismo sazonal", "Turismo internacional", "Migração pendular diária"], "O êxodo rural transferiu grande contingente do campo para as cidades."],
        ["Uma urbanização rápida e sem planejamento tende a produzir", "déficit de moradia, saneamento e transporte", ["distribuição perfeita de serviços", "fim das desigualdades", "redução automática da população"], "O crescimento urbano sem infraestrutura amplia problemas sociais e ambientais."],
        ["Se a natalidade diminui e a expectativa de vida aumenta, a tendência é de", "envelhecimento da população", ["explosão imediata da natalidade", "desaparecimento das cidades", "aumento obrigatório da mortalidade infantil"], "Menos nascimentos e maior longevidade elevam a participação relativa dos idosos."],
        ["Em um mapa, a legenda serve para", "explicar o significado de cores e símbolos", ["substituir a escala", "indicar apenas o norte", "eliminar as distâncias"], "A legenda permite interpretar a linguagem gráfica usada no mapa."],
        ["Terremotos e formação de grandes cadeias montanhosas podem estar ligados ao", "movimento de placas tectônicas", ["ciclo diário das marés", "orvalho matinal", "crescimento vegetativo"], "O encontro e o deslocamento de placas liberam energia e deformam a crosta."],
      ],
    },
    biologia: {
      title: "Organismo, adaptação e equilíbrio vital",
      sourceTitle: "Caso clínico CAVMED · Organismo e equilíbrio vital",
      sourcePath: "Hospital CAVMED / Clínica de Ciências da Vida",
      sourceChapter: "Ecologia; sistema respiratório; evolução; genética e programas de saúde",
      sourceFit: "Caso clínico preparado pelos médicos especialistas do Hospital CAVMED.",
      summary: "Ecologia estuda as relações dos seres vivos entre si e com fatores ambientais. Habitat é o local onde a espécie vive; nicho reúne seu modo de vida e uso de recursos. Adaptações favorecem sobrevivência e reprodução em certas condições. Processos vitais dependem de equilíbrio interno e trocas com o ambiente. Em saúde, mudanças rápidas em agentes infecciosos podem dificultar o reconhecimento imunológico e exigir atualização de estratégias preventivas.",
      map: [
        ["Organismo", "estrutura + função"],
        ["Ambiente", "fatores bióticos + abióticos"],
        ["Adaptação", "vantagem em determinada condição"],
        ["Saúde", "equilíbrio + prevenção"],
      ],
      flashcards: [
        ["Habitat", "Lugar onde uma espécie vive."],
        ["Nicho ecológico", "Modo de vida e uso de recursos por uma espécie."],
        ["Adaptação", "Característica que favorece sobrevivência e reprodução em um ambiente."],
        ["Homeostase", "Manutenção de condições internas relativamente estáveis."],
      ],
      quiz: [
        ["A Ecologia estuda principalmente", "as relações entre seres vivos e ambiente", ["somente nomes científicos", "apenas anatomia humana", "somente minerais"], "Ecologia integra fatores bióticos e abióticos."],
        ["O local onde uma espécie vive é seu", "habitat", ["gene", "nível trófico", "metabolismo"], "Habitat é o espaço ocupado habitualmente pela espécie."],
        ["Uma característica que aumenta a sobrevivência em certo ambiente é uma", "adaptação", ["poluição", "mutação necessariamente prejudicial", "cadeia mineral"], "A adaptação oferece vantagem nas condições em que a espécie vive."],
        ["A manutenção de condições internas relativamente estáveis recebe o nome de", "homeostase", ["sucessão", "erosão", "cartografia"], "Homeostase é o equilíbrio dinâmico do meio interno."],
        ["Uma alta taxa de mutação viral pode", "dificultar o reconhecimento pelo sistema imune", ["impedir toda reprodução viral", "eliminar a necessidade de prevenção", "transformar vírus em bactérias"], "Mudanças em estruturas virais podem reduzir a eficiência do reconhecimento imune prévio."],
      ],
    },
    ambiente: {
      title: "Impactos ambientais e relações de causa e efeito",
      sourceTitle: "Caso clínico CAVMED · Impactos ambientais",
      sourcePath: "Hospital CAVMED / Clínica de Saúde Ambiental",
      sourceChapter: "Questões ambientais contemporâneas; urbanização; clima",
      sourceFit: "Caso clínico preparado pelos médicos especialistas do Hospital CAVMED.",
      summary: "Problemas ambientais devem ser lidos como cadeias de causa, transporte e efeito. O efeito estufa natural mantém a temperatura do planeta, mas pode ser intensificado pelo aumento antrópico de gases. Nas cidades, impermeabilização, pouca vegetação e emissão de poluentes ampliam calor, enchentes e problemas de saúde. A melhor alternativa é a que atua no mecanismo apresentado pelo enunciado, não apenas a que parece genericamente positiva.",
      map: [
        ["Fonte", "onde o impacto começa"],
        ["Transporte", "como se espalha"],
        ["Efeito", "quem ou o que é atingido"],
        ["Intervenção", "ação no mecanismo correto"],
      ],
      flashcards: [
        ["Efeito estufa", "Retenção natural de parte do calor; sua intensificação aquece o planeta."],
        ["Ilha de calor", "Aquecimento urbano associado a superfícies construídas e pouca vegetação."],
        ["Bioacumulação", "Acúmulo de substância em um organismo ao longo do tempo."],
        ["Mitigação", "Ação que reduz causa, intensidade ou consequência de um impacto."],
      ],
      quiz: [
        ["O efeito estufa natural é importante porque", "ajuda a manter temperatura compatível com a vida", ["bloqueia toda radiação solar", "impede a circulação atmosférica", "elimina o vapor d’água"], "A retenção parcial de calor torna a temperatura média terrestre adequada à vida."],
        ["Mais árvores em áreas urbanas podem ajudar a", "reduzir calor e melhorar a infiltração da água", ["aumentar a impermeabilização", "eliminar todo vento", "produzir mais concreto"], "Vegetação oferece sombra, evapotranspiração e maior infiltração."],
        ["Para analisar um poluente, a sequência mais útil é", "fonte, transporte e efeito", ["cor, preço e propaganda", "nome, tamanho e opinião", "cidade, bandeira e idioma"], "A cadeia causal localiza origem, caminho e consequência do contaminante."],
        ["Uma medida de mitigação climática atua para", "reduzir emissões ou ampliar remoção de gases", ["aumentar a queima de combustíveis", "eliminar áreas verdes", "estimular desperdício energético"], "Mitigar significa reduzir a causa ou a intensidade do problema."],
        ["Ao escolher uma solução ambiental em uma questão, deve-se priorizar", "a ação ligada ao mecanismo descrito", ["a frase mais longa", "qualquer ação popular", "a alternativa com mais termos técnicos"], "A intervenção correta precisa responder à relação causal apresentada."],
      ],
    },
    fisica: {
      title: "Energia, grandezas e leitura científica",
      sourceTitle: "Caso clínico CAVMED · Energia e diagnóstico por imagem",
      sourcePath: "Hospital CAVMED / Clínica de Física Médica",
      sourceChapter: "Propriedades térmicas da água; medidas, proporções e leitura de dados",
      sourceFit: "Caso clínico interdisciplinar elaborado a partir dos microdados do item pelos médicos especialistas do Hospital CAVMED.",
      summary: "Questões físicas exigem identificar sistema, grandezas, unidade e transformação. Energia pode ser transferida e convertida; calor é energia em trânsito por diferença de temperatura. Materiais interagem de modos diferentes com ondas e radiações conforme suas propriedades. Em gráficos e esquemas científicos, leia primeiro eixos, símbolos e condições. A resposta deve respeitar a relação causal apresentada pelos dados.",
      map: [
        ["Sistema", "o que está sendo observado"],
        ["Grandezas", "energia, tempo, massa, velocidade"],
        ["Interação", "força, calor, onda ou radiação"],
        ["Efeito", "mudança prevista pelos dados"],
      ],
      flashcards: [
        ["Calor", "Energia transferida por diferença de temperatura."],
        ["Temperatura", "Medida relacionada ao estado de agitação das partículas."],
        ["Densidade", "Razão entre massa e volume."],
        ["Conservação de energia", "A energia se transforma, mas não surge do nada."],
      ],
      quiz: [
        ["Calor é", "energia transferida por diferença de temperatura", ["sinônimo obrigatório de temperatura", "uma unidade de massa", "ausência de movimento"], "Calor descreve transferência de energia entre sistemas."],
        ["Antes de calcular uma grandeza, deve-se conferir", "as unidades usadas", ["apenas a cor do gráfico", "o tamanho da alternativa", "a ordem alfabética"], "Unidades incompatíveis precisam ser convertidas antes do cálculo."],
        ["Um material mais denso em uma imagem de raios X tende a", "atenuar mais a radiação", ["não interagir com a radiação", "virar fonte de luz visível", "perder toda a massa"], "Maior atenuação dificulta a passagem dos raios X."],
        ["Em um gráfico científico, a primeira leitura deve identificar", "eixos, unidades e variáveis", ["apenas o título", "a alternativa mais curta", "a opinião do leitor"], "Eixos e unidades definem o significado dos dados."],
        ["Se a energia cinética de um sistema diminui por uma interação, ela", "foi transferida ou transformada", ["desapareceu sem efeito", "virou obrigatoriamente massa", "deixou de obedecer às unidades"], "A energia deve ser acompanhada pelas transferências e transformações do sistema."],
      ],
    },
    circuitos: {
      title: "Circuitos em série, passo a passo",
      sourceTitle: "Caso clínico CAVMED · Circuitos elétricos",
      sourcePath: "Hospital CAVMED / Clínica de Física Médica",
      sourceChapter: "Resistência equivalente; associação em série; unidade ohm",
      sourceFit: "Caso clínico preparado pelos médicos especialistas do Hospital CAVMED.",
      summary: "Em uma associação em série, a corrente percorre um único caminho e passa por todos os resistores. Para encontrar a resistência equivalente, identifique os valores, confirme que a ligação é em série e some as resistências. A unidade final é o ohm, representado por Ω. O segredo é não procurar uma fórmula difícil quando o circuito pede apenas uma soma organizada.",
      map: [["Diagnóstico", "confirmar ligação em série"], ["Dados", "listar R₁, R₂, R₃..."], ["Conduta", "Rₑq = R₁ + R₂ + ..."], ["Alta", "resultado acompanhado de Ω"]],
      flashcards: [["Circuito em série", "Há um único caminho para a corrente elétrica."], ["Resistência equivalente", "Em série, é a soma de todas as resistências."], ["Ohm", "Unidade de resistência elétrica, representada por Ω."], ["Conferência", "A resistência equivalente deve ser maior que cada resistência isolada."]],
      quiz: [
        ["Dois resistores de 2 Ω e 4 Ω estão em série. A resistência equivalente é", "6 Ω", ["2 Ω", "4 Ω", "8 Ω"], "Em série, somamos: 2 Ω + 4 Ω = 6 Ω."],
        ["Resistores de 3 Ω, 5 Ω e 2 Ω estão em série. A resistência equivalente é", "10 Ω", ["5 Ω", "8 Ω", "30 Ω"], "Somamos todas as resistências: 3 + 5 + 2 = 10 Ω."],
        ["Em uma associação em série, a corrente elétrica", "percorre um único caminho", ["se divide obrigatoriamente", "é sempre igual a zero", "não atravessa os resistores"], "A associação em série possui apenas um caminho para a corrente."],
        ["A unidade usada para expressar resistência elétrica é", "ohm", ["watt", "volt por segundo", "ampere-hora"], "A resistência elétrica é medida em ohms, símbolo Ω."],
        ["Se uma associação em série tem resistores de 1 Ω e 9 Ω, sua resistência equivalente é", "10 Ω", ["8 Ω", "9 Ω", "0,1 Ω"], "A soma 1 + 9 fornece 10 Ω."],
      ],
    },
    quimica: {
      title: "Escala de pH e fatores de dez",
      sourceTitle: "Caso clínico CAVMED · Leitura química do pH",
      sourcePath: "Hospital CAVMED / Clínica de Química",
      sourceChapter: "Escala logarítmica; concentração de H⁺; comparação entre soluções",
      sourceFit: "Caso clínico preparado pelos médicos especialistas do Hospital CAVMED.",
      summary: "A escala de pH é logarítmica. Cada diferença de uma unidade representa uma variação de dez vezes na concentração de íons H⁺. Por isso, uma solução de pH 3 tem dez vezes mais H⁺ que uma de pH 4 e cem vezes mais que uma de pH 5. Primeiro calcule a diferença entre os valores; depois transforme essa diferença em uma potência de dez.",
      map: [["Compare", "identifique o menor e o maior pH"], ["Diferença", "calcule ΔpH"], ["Fator", "use 10^{Delta pH}"], ["Sentido", "menor pH significa mais H^{+}"]],
      flashcards: [["Escala logarítmica", "Cada unidade de pH corresponde a um fator 10."], ["Menor pH", "Indica maior concentração de H^{+}."], ["Diferença de 2", "Corresponde a 10^{+2}, isto é, 100 vezes."], ["Diferença de 3", "Corresponde a 10^{+3}, isto é, 1 000 vezes."]],
      quiz: [
        ["Uma solução tem pH 2 e outra pH 4. A primeira possui concentração de H^{+}", "100 vezes maior", ["2 vezes maior", "10 vezes maior", "100 vezes menor"], "A diferença é 2; logo, 10^{+2} = 100. Como o pH é menor, a concentração é maior."],
        ["Entre pH 3 e pH 6, a diferença de concentração de H^{+} é de", "1 000 vezes", ["3 vezes", "30 vezes", "100 vezes"], "A diferença é 3; portanto, 10^{+3} = 1 000."],
        ["A solução com maior concentração de H⁺ é a de", "pH 2", ["pH 4", "pH 7", "pH 9"], "Quanto menor o pH, maior a concentração de H⁺."],
        ["Uma diferença de uma unidade de pH representa um fator", "10", ["1", "2", "100"], "A escala de pH varia em potências de dez."],
        ["Uma solução de pH 5 comparada a uma de pH 3 tem concentração de H⁺", "100 vezes menor", ["2 vezes menor", "10 vezes maior", "100 vezes maior"], "A diferença é 2 e o pH 5 é maior; portanto, há 100 vezes menos H⁺."],
      ],
    },
    estequiometria: {
      title: "Estequiometria pela ponte do mol",
      sourceTitle: "Caso clínico CAVMED · Relações estequiométricas",
      sourcePath: "Hospital CAVMED / Clínica de Química",
      sourceChapter: "Equação balanceada; mol; massa molar; entidades; volume gasoso",
      sourceFit: "Caso clínico preparado pelos médicos especialistas do Hospital CAVMED.",
      summary: "A equação balanceada fornece a razão em mol entre reagentes e produtos. Um mol também se relaciona à massa molar em gramas, a 6,02 · 10^{23} entidades e, quando o enunciado adota as CNTP compatíveis, a 22,4 L de gás. Escolha somente a ponte que liga o dado ao pedido e monte a proporção em duas linhas, com grandezas correspondentes na mesma coluna.",
      map: [["Equação", "balancear antes da conta"], ["Mol", "ler a razão dos coeficientes"], ["Ponte", "massa, entidades ou volume"], ["Escala", "aplicar o mesmo fator nas duas colunas"]],
      flashcards: [["1 mol e massa", "Corresponde à massa molar expressa em gramas."], ["1 mol e entidades", "Corresponde a 6,02 · 10^{23} moléculas, átomos, íons ou unidades de fórmula."], ["1 mol de gás nas CNTP", "Corresponde a 22,4 L somente quando o enunciado adota essa condição."], ["Primeiro passo", "Balancear a equação e identificar o dado e o pedido."]],
      quiz: [
        ["Na reação 2 H_{2} + O_{2} -> 2 H_{2}O, 1 mol de O_{2} forma quantos mol de H_{2}O?", "2 mol", ["1 mol", "3 mol", "4 mol"], "Os coeficientes mostram a razão 1:2 entre O₂ e H₂O."],
        ["Um mol de qualquer espécie contém", "6,02 · 10^{23} entidades", ["22,4 entidades", "1 entidade", "10^{2} entidades"], "A constante de Avogadro liga mol e número de entidades."],
        ["Para converter mol em massa, a ponte necessária é", "a massa molar", ["o pH", "a temperatura de fusão", "o número atômico isolado"], "A massa molar informa quantos gramas correspondem a um mol."],
        ["Antes de usar os coeficientes de uma reação, é necessário", "balancear a equação", ["apagar os índices", "trocar os produtos", "somar todas as massas molares"], "Somente a equação balanceada fornece a proporção estequiométrica correta."],
        ["Se 1 mol de O_{2} produz 36 g de H_{2}O, 3 mol produzem", "108 g", ["12 g", "36 g", "72 g"], "A quantidade foi multiplicada por 3; a massa correspondente também deve ser multiplicada por 3."],
      ],
    },
    porcentagem: {
      title: "Porcentagem sem atalhos perigosos",
      sourceTitle: "Caso clínico CAVMED · Porcentagem",
      sourcePath: "Hospital CAVMED / Clínica de Raciocínio Quantitativo",
      sourceChapter: "Taxa percentual; desconto; acréscimo; valor final",
      sourceFit: "Conduta pedagógica elaborada pelos médicos especialistas do Hospital CAVMED.",
      summary: "Porcentagem é uma parte de cada cem. Para calcular desconto ou acréscimo, encontre primeiro o valor da porcentagem e só depois subtraia ou some ao valor inicial. Separar essas duas etapas evita confundir o tamanho do desconto com o preço final.",
      map: [["Base", "identifique o valor inicial"], ["Taxa", "transforme p% em [[frac|p|100]]"], ["Parte", "calcule base · taxa"], ["Final", "subtraia no desconto; some no acréscimo"]],
      flashcards: [["10%", "É a décima parte do valor."], ["15%", "Pode ser calculado como 10% + 5%."], ["Desconto", "Valor final = inicial − desconto."], ["Acréscimo", "Valor final = inicial + acréscimo."]],
      quiz: [
        ["Um produto de R$ 60 recebe desconto de 10%. O preço final é", "R$ 54", ["R$ 6", "R$ 50", "R$ 66"], "10% de 60 é 6; então 60 − 6 = 54."],
        ["20% de 50 correspondem a", "10", ["5", "20", "30"], "[[frac|20|100]] · 50 = 10."],
        ["Um valor de R$ 80 recebe acréscimo de 25%. O total é", "R$ 100", ["R$ 20", "R$ 85", "R$ 105"], "25% de 80 é 20; então 80 + 20 = 100."],
        ["Um desconto de 30% em R$ 100 reduz o preço em", "R$ 30", ["R$ 3", "R$ 70", "R$ 130"], "[[frac|30|100]] · 100 = 30."],
        ["Depois de um desconto de R$ 12 sobre R$ 80, o preço final é", "R$ 68", ["R$ 12", "R$ 72", "R$ 92"], "Preço final é 80 − 12 = 68."],
      ],
    },
    funcao_linear: {
      title: "Função linear como conta organizada",
      sourceTitle: "Caso clínico CAVMED · Função linear",
      sourcePath: "Hospital CAVMED / Clínica de Raciocínio Quantitativo",
      sourceChapter: "Taxa fixa; valor variável; substituição na expressão",
      sourceFit: "Conduta pedagógica elaborada pelos médicos especialistas do Hospital CAVMED.",
      summary: "Em uma função linear aplicada ao cotidiano, separe o valor fixo da parte que depende da quantidade. Escreva a expressão, substitua a quantidade informada e calcule na ordem correta. A taxa fixa aparece uma única vez; a taxa variável é multiplicada pela quantidade.",
      map: [["Fixo", "valor cobrado uma vez"], ["Taxa", "valor por unidade"], ["Modelo", "V = fixo + taxa · quantidade"], ["Cálculo", "substitua e resolva"]],
      flashcards: [["Termo fixo", "Não muda quando a quantidade varia."], ["Taxa variável", "Multiplica a quantidade usada."], ["Substituição", "Troque a variável pelo valor informado."], ["Conferência", "Teste se o resultado faz sentido no contexto."]],
      quiz: [
        ["Uma entrega cobra R$ 5 fixos mais R$ 3 por quilômetro. Em 4 km, custa", "R$ 17", ["R$ 8", "R$ 12", "R$ 20"], "V = 5 + 3 · 4 = 5 + 12 = 17."],
        ["Um serviço cobra R$ 10 fixos e R$ 2 por unidade. Para 5 unidades, o total é", "R$ 20", ["R$ 12", "R$ 15", "R$ 25"], "V = 10 + 2 · 5 = 20."],
        ["Na expressão V = 8 + 2k, o número 8 representa", "a taxa fixa", ["a quantidade k", "o valor por quilômetro", "o resultado final"], "O termo sem variável é a parcela fixa."],
        ["Na expressão V = 8 + 2k, o número 2 representa", "o valor por unidade", ["a taxa fixa", "a quantidade total", "o desconto"], "O coeficiente de k é a taxa variável."],
        ["Se V = 4 + 5x e x = 2, então V vale", "14", ["9", "10", "18"], "V = 4 + 5 · 2 = 14."],
      ],
    },
    escala: {
      title: "Escala cartográfica com unidades visíveis",
      sourceTitle: "Caso clínico CAVMED · Escalas e conversões",
      sourcePath: "Hospital CAVMED / Clínica de Raciocínio Quantitativo",
      sourceChapter: "Escala numérica; distância no mapa; conversão de centímetros para quilômetros",
      sourceFit: "Conduta pedagógica elaborada pelos médicos especialistas do Hospital CAVMED.",
      summary: "Na escala 1:n, cada unidade medida no mapa representa n unidades reais. Multiplique a medida do mapa por n e só depois converta a unidade. Para transformar centímetros em quilômetros, divida por 100 000. Registre as unidades nos dados e nas conversões, faça a aritmética limpa e recupere a unidade na resposta final.",
      map: [["Escala", "1:n"], ["Mapa", "medida em centímetros"], ["Real", "mapa · n"], ["Conversão", "100 000 cm = 1 km"]],
      flashcards: [["Escala 1:100 000", "1 cm no mapa representa 1 km real."], ["Distância real", "Medida no mapa multiplicada pelo denominador."], ["Conversão", "100 000 cm correspondem a 1 km."], ["Regra de segurança", "Unidade nos dados e na resposta; aritmética intermediária sem repetições."]],
      quiz: [
        ["Em escala 1:100 000, uma distância de 2 cm no mapa corresponde a", "2 km", ["200 m", "20 km", "200 km"], "Cada centímetro representa 1 km; então 2 cm representam 2 km."],
        ["Em escala 1:50 000, 2 cm no mapa correspondem a", "1 km", ["100 m", "2 km", "10 km"], "2 · 50 000 = 100 000 cm = 1 km."],
        ["Na escala 1:200 000, 1 cm no mapa representa", "2 km", ["200 m", "20 km", "200 km"], "200 000 cm equivalem a 2 km."],
        ["Para obter a distância real, multiplicamos a medida do mapa pelo", "denominador da escala", ["numerador da escala", "número de cidades", "título do mapa"], "O denominador informa quantas unidades reais correspondem a uma unidade no mapa."],
        ["100 000 centímetros equivalem a", "1 quilômetro", ["10 metros", "100 metros", "10 quilômetros"], "1 km = 1 000 m = 100 000 cm."],
      ],
    },
    probabilidade: {
      title: "Probabilidade sem susto",
      sourceTitle: "Caso clínico CAVMED · Probabilidade",
      sourcePath: "Hospital CAVMED / Clínica de Raciocínio Quantitativo",
      sourceChapter: "Probabilidade e análise combinatória",
      sourceFit: "Conduta pedagógica elaborada pelos médicos especialistas do Hospital CAVMED.",
      summary: "Probabilidade compara casos favoráveis com todos os casos possíveis quando eles têm a mesma chance. O resultado fica entre 0 e 1, ou entre 0% e 100%. Antes de calcular, descreva o espaço amostral e o evento pedido. Em tabelas, conte apenas os elementos que satisfazem a condição. Evite somar categorias sobrepostas sem corrigir a interseção.",
      map: [["Experimento", "situação aleatória"], ["Espaço amostral", "todos os resultados"], ["Evento", "resultado de interesse"], ["Probabilidade", "[[frac|favoráveis|possíveis]]"]],
      flashcards: [["Espaço amostral", "Conjunto de todos os resultados possíveis."], ["Evento", "Subconjunto de resultados de interesse."], ["Evento impossível", "Probabilidade zero."], ["Evento certo", "Probabilidade um, ou 100%."]],
      quiz: [
        ["Uma caixa tem 4 fichas azuis e 1 vermelha. A chance de retirar uma azul é", "[[frac|4|5]]", ["[[frac|1|5]]", "[[frac|1|4]]", "[[frac|5|4]]"], "Há quatro casos favoráveis entre cinco fichas possíveis: [[frac|4|5]]."],
        ["Ao lançar um dado comum, quantos resultados possíveis existem?", "6", ["2", "5", "12"], "As faces numeradas de 1 a 6 formam o espaço amostral."],
        ["A probabilidade de um evento impossível é", "0", ["[[frac|1|2]]", "1", "100"], "Um evento impossível não possui caso favorável."],
        ["Para calcular uma probabilidade simples, usamos", "casos favoráveis divididos por casos possíveis", ["casos possíveis menos favoráveis", "apenas casos favoráveis", "média das alternativas"], "A razão compara o evento ao espaço amostral."],
        ["Em uma caixa com 3 bolas azuis e 2 vermelhas, a chance de azul é", "[[frac|3|5]]", ["[[frac|2|5]]", "[[frac|1|3]]", "[[frac|5|3]]"], "São três casos favoráveis entre cinco bolas ao todo."],
      ],
    },
    estatistica: {
      title: "Dados, média e leitura de gráficos",
      sourceTitle: "Caso clínico CAVMED · Estatística",
      sourcePath: "Hospital CAVMED / Clínica de Raciocínio Quantitativo",
      sourceChapter: "Introdução à Estatística",
      sourceFit: "Conduta pedagógica elaborada pelos médicos especialistas do Hospital CAVMED.",
      summary: "A Estatística organiza dados para descrever situações e reconhecer tendências. Média é soma dividida pela quantidade; mediana é o valor central após ordenar; moda é o valor mais frequente. Gráficos exigem leitura de título, eixos, unidade, escala e legenda. Medidas de dispersão indicam o quanto os valores se afastam da média.",
      map: [["Dados", "coleta e organização"], ["Centro", "média, mediana e moda"], ["Dispersão", "variação e desvio"], ["Gráfico", "eixos + escala + legenda"]],
      flashcards: [["Média", "Soma dos valores dividida pela quantidade."], ["Mediana", "Valor central após ordenar os dados."], ["Moda", "Valor que mais se repete."], ["Amplitude", "Maior valor menos menor valor."]],
      quiz: [
        ["A média de 4 e 6 é", "5", ["2", "4", "10"], "Somamos 4 + 6 e dividimos por 2."],
        ["Nos dados 1, 2, 2 e 5, a moda é", "2", ["1", "2,5", "5"], "O valor 2 é o que mais aparece."],
        ["Nos dados 2, 4 e 9, a mediana é", "4", ["2", "5", "9"], "Após ordenar, 4 ocupa a posição central."],
        ["Antes de comparar barras de um gráfico, é essencial observar", "a escala do eixo", ["apenas a cor", "o sobrenome do autor", "o número de letras do título"], "A escala determina quanto cada altura representa."],
        ["A amplitude dos dados 3, 7 e 8 é", "5", ["3", "7", "8"], "Amplitude é 8 menos 3."],
      ],
    },
    proporcionalidade: {
      title: "Grandezas e proporcionalidade",
      sourceTitle: "Caso clínico CAVMED · Grandezas e proporcionalidade",
      sourcePath: "Hospital CAVMED / Clínica de Raciocínio Quantitativo",
      sourceChapter: "Proporcionalidade; regra de três; escalas; porcentagem",
      sourceFit: "Conduta pedagógica elaborada pelos médicos especialistas do Hospital CAVMED.",
      summary: "Razão é uma divisão entre grandezas comparáveis; proporção é a igualdade entre duas razões. Em grandezas diretamente proporcionais, ambas variam no mesmo sentido e na mesma razão. Nas inversamente proporcionais, uma aumenta enquanto a outra diminui de modo compensatório. Antes de montar a conta, identifique unidades e o tipo de relação.",
      map: [["Razão", "comparação por divisão"], ["Proporção", "igualdade de razões"], ["Direta", "variam no mesmo sentido"], ["Inversa", "uma sobe e a outra desce"]],
      flashcards: [["Razão", "Quociente entre dois valores."], ["Proporção", "Igualdade entre duas razões."], ["Grandezas diretas", "Variam no mesmo sentido e razão."], ["Grandezas inversas", "Variam em sentidos opostos de modo compensatório."]],
      quiz: [
        ["Se 2 cadernos custam R$ 10, 4 cadernos custam", "R$ 20", ["R$ 5", "R$ 10", "R$ 40"], "Dobrar a quantidade dobra o custo, mantendo o preço unitário."],
        ["Velocidade constante: ao dobrar o tempo de viagem, a distância", "dobra", ["cai pela metade", "não muda", "fica zero"], "Tempo e distância são diretamente proporcionais nessa condição."],
        ["Para a mesma tarefa, mais trabalhadores podem exigir", "menos tempo", ["mais tempo sempre", "a mesma quantidade de trabalho por pessoa e mais tempo", "distância maior"], "Número de trabalhadores e tempo tendem a ser inversamente proporcionais."],
        ["A razão entre 2 aprovados e 10 inscritos é", "[[frac|1|5]]", ["[[frac|2|5]]", "5", "[[frac|8|10]]"], "A razão [[frac|2|10]] simplifica para [[frac|1|5]]."],
        ["Antes de usar regra de três, deve-se", "identificar se a relação é direta ou inversa", ["somar todos os números", "ignorar unidades", "escolher a maior alternativa"], "O tipo de proporcionalidade define a montagem correta."],
      ],
    },
    geometria: {
      title: "Forma, medida e decomposição",
      sourceTitle: "Caso clínico CAVMED · Forma, medida e decomposição",
      sourcePath: "Hospital CAVMED / Clínica de Raciocínio Quantitativo",
      sourceChapter: "Áreas de superfícies planas; relações métricas; sólidos geométricos",
      sourceFit: "Conduta pedagógica elaborada pelos médicos especialistas do Hospital CAVMED.",
      summary: "Resolver geometria começa por traduzir a situação em uma figura e marcar as medidas conhecidas. Perímetro mede o contorno; área mede a superfície; volume mede o espaço ocupado. Figuras complexas podem ser decompostas em formas simples. A unidade final precisa acompanhar a grandeza: comprimento, área ao quadrado ou volume ao cubo.",
      map: [["Figura", "desenhar e nomear"], ["Medidas", "dados + unidade"], ["Estratégia", "fórmula ou decomposição"], ["Resposta", "valor + unidade correta"]],
      flashcards: [["Perímetro", "Medida do contorno."], ["Área", "Medida da superfície."], ["Volume", "Medida do espaço ocupado."], ["Triângulo", "Área igual a base vezes altura dividida por dois."]],
      quiz: [
        ["A área de um retângulo de 4 cm por 2 cm é", "8 cm²", ["6 cm", "8 cm", "16 cm²"], "Área do retângulo é base vezes altura: 4 · 2 = 8 cm²."],
        ["O perímetro de um quadrado de lado 3 cm é", "12 cm", ["6 cm", "9 cm²", "27 cm³"], "Somamos os quatro lados: 4 · 3."],
        ["A área de um triângulo de base 6 e altura 4 é", "12", ["10", "24", "48"], "Calculamos [[frac|6 · 4|2]] = 12."],
        ["Uma figura composta pode ser resolvida ao", "decompô-la em figuras simples", ["ignorar suas medidas", "somar apenas os ângulos", "trocar área por perímetro"], "A decomposição permite calcular partes conhecidas e reuni-las."],
        ["A unidade adequada para volume é", "cm³", ["cm", "cm²", "graus"], "Volume é tridimensional e usa unidade cúbica."],
      ],
    },
  };

  const microSummaries = Object.freeze({
    linguagem: ["Leia primeiro o comando da questão.", "Localize no texto a evidência que sustenta a resposta.", "Relacione escolha linguística, público e efeito de sentido."],
    territorio: ["Identifique o espaço e os grupos envolvidos.", "Monte a cadeia causa → transformação → consequência.", "Confirme a resposta com um elemento da paisagem ou do processo histórico."],
    biologia: ["Nomeie a estrutura ou o processo biológico.", "Descubra o que entra, sai ou se transforma.", "Relacione o mecanismo ao efeito observado no organismo."],
    ambiente: ["Localize a fonte do impacto.", "Acompanhe como ele se espalha.", "Escolha a intervenção que atua diretamente no mecanismo."],
    fisica: ["Anote as grandezas e as unidades.", "Escolha uma relação física compatível com os dados.", "Substitua, calcule e confira se a unidade final faz sentido."],
    circuitos: ["Confirme que o circuito está em série.", "Liste todas as resistências.", "Some os valores e mantenha a unidade Ω."],
    quimica: ["Calcule a diferença entre os valores de pH.", "Transforme a diferença em potência de dez.", "Lembre: menor pH significa maior concentração de H⁺."],
    estequiometria: ["Balanceie a equação e leia a razão em mol.", "Escolha a ponte direta entre o dado e o pedido.", "Monte duas linhas e aplique o mesmo fator às grandezas diretamente proporcionais."],
    porcentagem: ["Encontre o valor inicial.", "Calcule a porcentagem desse valor.", "Só depois some ou subtraia para obter o valor final."],
    funcao_linear: ["Separe a parte fixa da variável.", "Monte a expressão.", "Substitua a quantidade e resolva na ordem correta."],
    escala: ["Multiplique a medida do mapa pelo denominador.", "Registre a unidade nos dados e retire repetições da aritmética.", "Converta centímetros para quilômetros e recupere a unidade no final."],
    probabilidade: ["Conte todos os resultados possíveis.", "Conte somente os casos favoráveis.", "Divida favoráveis por possíveis e simplifique."],
    estatistica: ["Organize os dados antes de calcular.", "Escolha média, mediana ou moda conforme o comando.", "Faça a conta e interprete o valor no contexto."],
    proporcionalidade: ["Organize as grandezas com suas unidades.", "Decida se a relação é direta ou inversa.", "Monte a proporção e confira o sentido do resultado."],
    geometria: ["Desenhe ou reconheça a figura.", "Marque as medidas conhecidas.", "Escolha a fórmula, calcule e escreva a unidade correta."],
  });

  const quantitativePackKeys = new Set([
    "fisica",
    "circuitos",
    "quimica",
    "estequiometria",
    "porcentagem",
    "funcao_linear",
    "escala",
    "probabilidade",
    "estatistica",
    "proporcionalidade",
    "geometria",
  ]);

  const notationByPack = Object.freeze({
    quimica: [
      { label: "Fórmula química", expression: "H_{2}SO_{4}", note: "Índices de átomos ficam subscritos." },
      { label: "Carga iônica", expression: "Ca^{2+}(aq) + CO_{3}^{2-}(aq) -> CaCO_{3}(s)", note: "Cargas ficam sobrescritas; coeficientes permanecem na linha de base." },
      { label: "Reação irreversível", expression: "2 H_{2}(g) + O_{2}(g) -> 2 H_{2}O(l)", note: "A seta simples aponta para os produtos." },
      { label: "Equilíbrio químico", expression: "N_{2}O_{4}(g) <=> 2 NO_{2}(g)", note: "Equilíbrio usa duas semissetas opostas." },
    ],
    estequiometria: [
      { label: "Equação balanceada", expression: "2 H_{2}(g) + O_{2}(g) -> 2 H_{2}O(l)", note: "Os coeficientes fornecem a relação em mol." },
      { label: "Constante de Avogadro", expression: "1 mol corresponde a 6,02 · 10^{23} entidades", note: "Use moléculas, átomos, íons ou unidades de fórmula conforme o caso." },
      { label: "Equilíbrio químico", expression: "N_{2}O_{4}(g) <=> 2 NO_{2}(g)", note: "Equilíbrio usa duas semissetas opostas." },
    ],
  });

  const workedExamples = Object.freeze({
    fisica: {
      title: "Modelo resolvido: densidade",
      prompt: "Uma amostra de 180 g ocupa 60 cm³. Qual é sua densidade?",
      formula: "d = [[frac|m|V]]",
      steps: [["1. Dados e pedido", "m = 180 g; V = 60 cm^{3}; determinar d."], ["2. Unidades", "As grandezas já estão em unidades compatíveis para g · cm^{-3}."], ["3. Fórmula isolada", "d = [[frac|m|V]]."], ["4. Substituição", "d = [[frac|180 g|60 cm^{3}]]."], ["5. Cálculo e unidade", "180 dividido por 60 resulta em 3; d = 3 g · cm^{-3}."]],
      result: "d = 3 g · cm^{-3}",
      mirror: "Na primeira questão, mantenha as quatro linhas e troque somente os valores.",
    },
    circuitos: {
      title: "Modelo resolvido: resistores em série",
      prompt: "Dois resistores de 3 Ω e 5 Ω estão ligados em série. Qual é a resistência equivalente?",
      formula: "Rₑq = R₁ + R₂",
      steps: [["1. Diagnóstico", "A ligação é em série."], ["2. Dados", "R₁ = 3 Ω e R₂ = 5 Ω"], ["3. Substituição", "Rₑq = 3 + 5"], ["4. Resultado", "Rₑq = 8 Ω"]],
      result: "8 Ω",
      mirror: "Na primeira questão, copie a mesma soma e troque 3 e 5 por 2 e 4.",
    },
    quimica: {
      title: "Modelo resolvido: comparação de pH",
      prompt: "Uma solução tem pH 3 e outra pH 5. Quantas vezes a primeira tem mais H⁺?",
      formula: "fator = 10^{Delta pH}",
      steps: [["1. Dados e pedido", "pH_{1} = 3; pH_{2} = 5; determinar o fator de concentração de H^{+}."], ["2. Diferença", "ΔpH = 5 − 3 = 2."], ["3. Potência", "fator = 10^{Delta pH} = 10^{+2}."], ["4. Cálculo", "10^{+2} = 100."], ["5. Sentido", "pH 3 é menor, então apresenta maior concentração de H^{+}."]],
      result: "100 vezes mais H⁺",
      mirror: "Na primeira questão, repita as quatro linhas usando pH 2 e pH 4.",
    },
    estequiometria: {
      title: "Modelo resolvido: relação direta em duas linhas",
      prompt: "Na reação 2 H_{2}(g) + O_{2}(g) -> 2 H_{2}O(l), qual massa de água é formada por 0,50 mol de O_{2}?",
      formula: "1 mol de O_{2} corresponde a 2 · 18 g de H_{2}O",
      steps: [["1. Equação", "A equação já está balanceada: 2 H_{2} + O_{2} -> 2 H_{2}O."], ["2. Ponte direta", "1 mol de O_{2} corresponde a 2 mol de H_{2}O, isto é, 2 · 18 g."], ["3. Sem vírgula", "0,50 = 5 · 10^{-1}."], ["4. Mesmo fator", "De 1 para 0,50, dividimos por 2; de 36 para x, também dividimos por 2."], ["5. Resultado", "x = 36 ÷ 2 = 18; recupere a unidade na resposta."]],
      proportion: {
        kind: "direct",
        label: "Relação diretamente proporcional",
        leftTitle: "Quantidade de O_{2}",
        rightTitle: "Massa de H_{2}O",
        topLeft: "1 mol de O_{2}",
        topRight: "2 · 18 g de H_{2}O",
        bottomLeft: "0,50 mol de O_{2}",
        bottomRight: "x",
        horizontalFactor: "× 36",
        leftVerticalFactor: "÷ 2",
        rightVerticalFactor: "÷ 2",
        conclusion: "x = 18 g de H_{2}O",
      },
      result: "18 g de H_{2}O",
      mirror: "Balanceie, escolha a ponte entre o dado e o pedido e repita o mesmo fator nas duas colunas.",
    },
    porcentagem: {
      title: "Modelo resolvido: desconto",
      prompt: "Um produto de R$ 80 recebe desconto de 15%. Qual é o preço final?",
      formula: "D = [[frac|valor · taxa|100]]",
      steps: [["1. Dados e pedido", "Valor inicial = R$ 80; taxa = 15%; determinar o preço final."], ["2. Taxa sem decimal", "15% = [[frac|15|100]]."], ["3. Desconto", "D = [[frac|80 · 15|100]] = 12."], ["4. Valor final", "80 − 12 = 68."], ["5. Resposta", "O produto custa R$ 68."]],
      result: "R$ 68",
      mirror: "Na primeira questão, copie o roteiro usando R$ 60 e 10%.",
    },
    funcao_linear: {
      title: "Modelo resolvido: taxa fixa mais consumo",
      prompt: "Uma corrida custa R$ 8 fixos mais R$ 2 por quilômetro. Quanto custa percorrer 5 km?",
      formula: "V = 8 + 2 · k",
      steps: [["1. Dados e pedido", "Taxa fixa = R$ 8; taxa variável = R$ 2 · km^{-1}; distância = 5 km."], ["2. Modelo", "V = fixo + taxa · distância."], ["3. Substituição", "V = 8 + 2 · 5."], ["4. Cálculo", "V = 8 + 10."], ["5. Resultado", "V = R$ 18."]],
      result: "R$ 18",
      mirror: "Na primeira questão, mantenha o modelo e troque os valores por 5, 3 e 4.",
    },
    escala: {
      title: "Modelo resolvido: distância no mapa",
      prompt: "Na escala 1:100 000, uma distância mede 3 cm no mapa. Qual é a distância real?",
      formula: "D_{real} = D_{mapa} · escala",
      steps: [["1. Dados e pedido", "D_{mapa} = 3 cm; escala = 1:100 000; determinar D_{real}."], ["2. Potência", "100 000 = 10^{+5}."], ["3. Multiplicação limpa", "D_{real} = 3 · 10^{+5}."], ["4. Conversão", "1 km = 10^{+5} cm."], ["5. Resultado", "A distância real é 3 km."]],
      result: "3 km",
      mirror: "Na primeira questão, repita o roteiro usando 2 cm na mesma escala.",
    },
    probabilidade: {
      title: "Modelo resolvido: evento simples",
      prompt: "Uma caixa tem 3 fichas verdes e 2 douradas. Qual é a chance de retirar uma verde?",
      formula: "P = [[frac|favoráveis|possíveis]]",
      steps: [["1. Dados e pedido", "3 fichas verdes; 2 douradas; determinar P(verde)."], ["2. Possíveis", "3 + 2 = 5 fichas."], ["3. Favoráveis", "3 fichas verdes."], ["4. Fração", "P(verde) = [[frac|3|5]]."], ["5. Resultado", "A chance é [[frac|3|5]], equivalente a 60%. "]],
      result: "P(verde) = [[frac|3|5]]",
      mirror: "Na primeira questão, conte novamente os casos possíveis e favoráveis antes de dividir.",
    },
    estatistica: {
      title: "Modelo resolvido: média aritmética",
      prompt: "Qual é a média entre 6 e 8?",
      formula: "média = [[frac|soma|quantidade]]",
      steps: [["1. Dados e pedido", "Valores 6 e 8; determinar a média aritmética."], ["2. Soma", "6 + 8 = 14."], ["3. Quantidade", "Há 2 valores."], ["4. Fração", "média = [[frac|14|2]] = 7."], ["5. Resultado", "A média dos dois valores é 7."]],
      result: "7",
      mirror: "Na primeira questão, copie o roteiro usando os valores 4 e 6.",
    },
    proporcionalidade: {
      title: "Modelo resolvido: proporção direta",
      prompt: "Uma caixa contém 2 frascos. Quantos frascos há em 70 caixas iguais?",
      formula: "1 caixa -> 2 frascos",
      steps: [["1. Dados e pedido", "1 caixa corresponde a 2 frascos; determinar quantos frascos há em 70 caixas."], ["2. Relação", "Mais caixas significam mais frascos na mesma razão: relação direta."], ["3. Duas linhas", "Coloque caixas na primeira coluna e frascos na segunda; a relação conhecida fica acima do caso pedido."], ["4. Mesmo fator", "De 1 para 70, multiplique por 70. Faça o mesmo de 2 para x."], ["5. Resultado", "x = 2 · 70 = 140 frascos."]],
      proportion: {
        kind: "direct",
        label: "Relação diretamente proporcional",
        leftTitle: "Caixas",
        rightTitle: "Frascos",
        topLeft: "1 caixa",
        topRight: "2 frascos",
        bottomLeft: "70 caixas",
        bottomRight: "x",
        horizontalFactor: "× 2",
        leftVerticalFactor: "× 70",
        rightVerticalFactor: "× 70",
        conclusion: "x = 2 · 70 = 140 frascos",
      },
      result: "140 frascos",
      mirror: "Organize duas linhas, descubra o fator e repita a mesma operação na outra coluna.",
    },
    geometria: {
      title: "Modelo resolvido: área do retângulo",
      prompt: "Um retângulo mede 5 cm de base e 2 cm de altura. Qual é sua área?",
      formula: "A = b · h",
      steps: [["1. Dados e pedido", "b = 5 cm; h = 2 cm; determinar A."], ["2. Fórmula isolada", "A = b · h."], ["3. Substituição numérica", "A = 5 · 2."], ["4. Cálculo", "5 · 2 = 10."], ["5. Resultado", "A = 10 cm^{2}."]],
      result: "A = 10 cm^{2}",
      mirror: "Na primeira questão, copie as quatro linhas usando base 4 e altura 2.",
    },
  });

  const mediumWorkedExamples = Object.freeze({
    fisica: {
      title: "Modelo médio: velocidade com conversão de tempo",
      prompt: "Um móvel percorre 900 m em 3 min. Determine a velocidade média em m · s^{-1}.",
      formula: "v = [[frac|Delta s|Delta t]]",
      steps: [["1. Dados e pedido", "Δs = 900 m; Δt = 3 min; determinar v em m · s^{-1}."], ["2. Conversão", "3 min = 3 · 6 · 10^{+1} s = 18 · 10^{+1} s."], ["3. Substituição limpa", "v = [[frac|900|18 · 10^{+1}]]."], ["4. Simplificação", "900 = 9 · 10^{+2}; corte a potência comum e divida 9 por 18."], ["5. Resultado", "v = 5 m · s^{-1}."]],
      result: "v = 5 m · s^{-1}",
      mirror: "Converta primeiro o tempo e só depois substitua na relação de velocidade.",
    },
    circuitos: {
      title: "Modelo médio: três resistores em série",
      prompt: "Resistores de 4 Ω, 6 Ω e 3 Ω estão em série. Determine a resistência equivalente.",
      formula: "R_{eq} = R_{1} + R_{2} + R_{3}",
      steps: [["1. Diagnóstico", "A corrente percorre um único caminho: associação em série."], ["2. Dados", "R_{1} = 4 Ω; R_{2} = 6 Ω; R_{3} = 3 Ω."], ["3. Substituição limpa", "R_{eq} = 4 + 6 + 3."], ["4. Cálculo", "R_{eq} = 13."], ["5. Resultado", "Recupere Ω na resposta final."]],
      result: "R_{eq} = 13 Ω",
      mirror: "Confirme a associação e some todos os resistores uma única vez.",
    },
    quimica: {
      title: "Modelo médio: comparação logarítmica",
      prompt: "Compare uma solução de pH 4 com outra de pH 7 quanto à concentração de H^{+}.",
      formula: "fator = 10^{Delta pH}",
      steps: [["1. Dados e pedido", "pH_{1} = 4; pH_{2} = 7; determinar o fator de concentração."], ["2. Diferença", "ΔpH = 7 − 4 = 3."], ["3. Potência", "fator = 10^{+3}."], ["4. Cálculo", "10^{+3} = 1 000."], ["5. Sentido", "A solução de pH 4 possui maior concentração de H^{+}."]],
      result: "A solução de pH 4 tem 1 000 vezes mais H^{+}",
      mirror: "Calcule a diferença e só depois interprete qual solução é mais ácida.",
    },
    estequiometria: {
      title: "Modelo médio: mol para número de moléculas",
      prompt: "Determine o número de moléculas existente em 0,25 mol de CO_{2}.",
      formula: "1 mol corresponde a 6,02 · 10^{23} moléculas",
      steps: [["1. Dados e pedido", "0,25 mol de CO_{2}; determinar o número de moléculas."], ["2. Sem vírgula", "0,25 = 25 · 10^{-2}."], ["3. Relação direta", "1 mol corresponde a 6,02 · 10^{23}; 0,25 mol corresponde a x."], ["4. Fator", "De 1 para 0,25, dividimos por 4; aplique o mesmo fator ao número de moléculas."], ["5. Resultado", "x = 1,505 · 10^{23} moléculas."]],
      proportion: {
        kind: "direct",
        label: "Relação diretamente proporcional",
        leftTitle: "Quantidade de matéria",
        rightTitle: "Número de moléculas",
        topLeft: "1 mol de CO_{2}",
        topRight: "6,02 · 10^{23} moléculas",
        bottomLeft: "0,25 mol de CO_{2}",
        bottomRight: "x",
        horizontalFactor: "× 6,02 · 10^{23}",
        leftVerticalFactor: "÷ 4",
        rightVerticalFactor: "÷ 4",
        conclusion: "x = 1,505 · 10^{23} moléculas de CO_{2}",
      },
      result: "1,505 · 10^{23} moléculas de CO_{2}",
      mirror: "Escolha a ponte do mol que corresponde exatamente ao pedido.",
    },
    porcentagem: {
      title: "Modelo médio: acréscimo em duas etapas",
      prompt: "Uma mensalidade de R$ 250 recebe acréscimo de 12%. Determine o novo valor.",
      formula: "A = [[frac|valor · taxa|100]]",
      steps: [["1. Dados e pedido", "Valor inicial = 250; taxa = 12%; determinar o total após o acréscimo."], ["2. Parte percentual", "A = [[frac|250 · 12|100]]."], ["3. Simplificação", "Corte fatores comuns antes de multiplicar."], ["4. Acréscimo", "A = 30."], ["5. Valor final", "250 + 30 = 280; recupere R$ na resposta."]],
      result: "R$ 280",
      mirror: "Calcule primeiro a parte percentual e somente depois some ao valor inicial.",
    },
    funcao_linear: {
      title: "Modelo médio: tarifa fixa e três unidades",
      prompt: "Um serviço cobra R$ 6 fixos e R$ 4 por unidade. Determine o total para 3 unidades.",
      formula: "V = 6 + 4 · q",
      steps: [["1. Dados", "Parcela fixa = 6; taxa = 4; q = 3."], ["2. Modelo", "V = fixo + taxa · quantidade."], ["3. Substituição", "V = 6 + 4 · 3."], ["4. Cálculo", "V = 6 + 12 = 18."], ["5. Resultado", "Recupere R$ na resposta final."]],
      result: "R$ 18",
      mirror: "Mantenha separadas a parcela fixa e a parte que varia.",
    },
    escala: {
      title: "Modelo médio: escala com conversão final",
      prompt: "Na escala 1:50 000, uma estrada mede 4 cm no mapa. Determine a distância real em quilômetros.",
      formula: "D_{real} = D_{mapa} · escala",
      steps: [["1. Dados e pedido", "Medida no mapa = 4 cm; escala = 1:50 000; determinar quilômetros reais."], ["2. Potência", "50 000 = 5 · 10^{+4}."], ["3. Multiplicação", "4 · 5 · 10^{+4} = 2 · 10^{+5}."], ["4. Conversão", "1 km corresponde a 10^{+5} cm."], ["5. Resultado", "A distância real é 2 km."]],
      result: "2 km",
      mirror: "Resolva primeiro na unidade do mapa e converta somente no final.",
    },
    probabilidade: {
      title: "Modelo médio: evento em um conjunto maior",
      prompt: "Uma urna possui 5 fichas vermelhas e 3 azuis. Determine a probabilidade de retirar uma vermelha.",
      formula: "P = [[frac|favoráveis|possíveis]]",
      steps: [["1. Possíveis", "5 + 3 = 8 fichas."], ["2. Favoráveis", "Há 5 fichas vermelhas."], ["3. Fração", "P = [[frac|5|8]]."], ["4. Conferência", "O resultado deve estar entre 0 e 1."], ["5. Interpretação", "Cinco dos oito resultados simples são favoráveis."]],
      result: "P = [[frac|5|8]]",
      mirror: "Conte o total antes de separar os casos favoráveis.",
    },
    estatistica: {
      title: "Modelo médio: média de quatro valores",
      prompt: "Determine a média dos valores 3, 5, 7 e 9.",
      formula: "média = [[frac|soma|quantidade]]",
      steps: [["1. Dados", "Valores: 3, 5, 7 e 9."], ["2. Soma", "3 + 5 + 7 + 9 = 24."], ["3. Quantidade", "Há 4 valores."], ["4. Divisão", "média = [[frac|24|4]] = 6."], ["5. Interpretação", "6 representa o centro aritmético do conjunto."]],
      result: "6",
      mirror: "Some todos os valores e divida exatamente pela quantidade de dados.",
    },
    proporcionalidade: {
      title: "Modelo médio: proporção inversa",
      prompt: "Se 4 trabalhadores concluem uma tarefa em 6 dias, em quantos dias 8 trabalhadores, com o mesmo ritmo, concluem a tarefa?",
      formula: "trabalhadores · dias = constante",
      steps: [["1. Dados e pedido", "4 trabalhadores correspondem a 6 dias; 8 trabalhadores correspondem a x."], ["2. Diagnóstico", "Mais trabalhadores exigem menos dias: relação inversamente proporcional."], ["3. Fatores", "De 4 para 8, multiplique por 2; na coluna dos dias, divida por 2."], ["4. Cálculo", "x = 6 ÷ 2 = 3."], ["5. Resultado", "A equipe conclui a tarefa em 3 dias."]],
      proportion: {
        kind: "inverse",
        label: "Relação inversamente proporcional",
        leftTitle: "Trabalhadores",
        rightTitle: "Dias",
        topLeft: "4 trabalhadores",
        topRight: "6 dias",
        bottomLeft: "8 trabalhadores",
        bottomRight: "x",
        horizontalFactor: "",
        leftVerticalFactor: "× 2",
        rightVerticalFactor: "÷ 2",
        conclusion: "Uma coluna dobra e a outra cai pela metade: x = 3 dias.",
      },
      result: "3 dias",
      mirror: "Em relações inversas, aplique operações opostas nas duas colunas.",
    },
    geometria: {
      title: "Modelo médio: área do triângulo",
      prompt: "Determine a área de um triângulo de base 10 cm e altura 6 cm.",
      formula: "A = [[frac|b · h|2]]",
      steps: [["1. Dados e pedido", "b = 10 cm; h = 6 cm; determinar A."], ["2. Fórmula", "A = [[frac|b · h|2]]."], ["3. Substituição limpa", "A = [[frac|10 · 6|2]]."], ["4. Corte", "Simplifique 10 com 2 antes de multiplicar."], ["5. Resultado", "A = 30 cm^{2}."]],
      result: "A = 30 cm^{2}",
      mirror: "Monte a fração vertical e simplifique antes da multiplicação.",
    },
  });

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function isQuantitativeCase(metadata, packKey) {
    if (quantitativePackKeys.has(packKey)) return true;
    const text = normalize(`${metadata.title} ${metadata.text} ${metadata.skill} ${metadata.microtheme} ${metadata.macrotheme}`);
    return /calcule|determine.*(?:valor|taxa|media|distancia|tempo|massa|volume)|porcent|proporcao|probabil|estatistic|escala|concentracao|densidade|frequencia|crescimento|velocidade|aceleracao|energia|potencia|vazao|heranca quantitativa/.test(text);
  }

  function resolvePackKey(metadata = {}) {
    const text = normalize(`${metadata.areaId} ${metadata.area} ${metadata.title} ${metadata.text} ${metadata.skill} ${metadata.microtheme} ${metadata.macrotheme}`);
    const areaId = normalize(metadata.areaId);
    if (areaId === "linguagens") return "linguagem";
    if (areaId === "humanas") return "territorio";
    if (areaId === "natureza") {
      if (/circuit|resistor|eletric|corrente|tensao|ohm/.test(text)) return "circuitos";
      if (/estequiom|massa molar|quantidade de materia|numero de mol|\bmol\b/.test(text)) return "estequiometria";
      if (/\bph\b|quim|atomo|ion|ligac|solucao|concentracao|reacao/.test(text)) return "quimica";
      if (/polu|ambient|clima|arboriz|efeito estufa/.test(text)) return "ambiente";
      if (/termodinam|energia mecan|raios x|movimento|fisic|particula|densidade/.test(text)) return "fisica";
      return "biologia";
    }
    if (areaId === "matematica") {
      if (/porcent|desconto|acrescim/.test(text)) return "porcentagem";
      if (/geometr|area|volume|espaco e forma|triang|circulo|retang/.test(text)) return "geometria";
      if (/funcao|tarifa|equacao|algebr|variavel/.test(text)) return "funcao_linear";
      if (/escala|cartograf|distancia no mapa/.test(text)) return "escala";
      if (/probabil|aleator|combinator/.test(text)) return "probabilidade";
      if (/estatistic|tendencia central|mediana|media|moda|dispers|grafico|tabela/.test(text)) return "estatistica";
      return "proporcionalidade";
    }
    if (/linguagem|texto|textual|linguistic|liter|interlocu|genero|libras|coes|retomada/.test(text)) return "linguagem";
    if (/circuit|resistor|eletric|corrente|tensao|ohm/.test(text)) return "circuitos";
    if (/estequiom|massa molar|quantidade de materia|numero de mol|\bmol\b/.test(text)) return "estequiometria";
    if (/\bph\b|quim|atomo|ion|ligac|solucao|concentracao|reacao/.test(text)) return "quimica";
    if (/porcent|desconto|acrescim/.test(text)) return "porcentagem";
    if (/funcao|tarifa|equacao|algebr|variavel/.test(text)) return "funcao_linear";
    if (/escala|cartograf|distancia no mapa/.test(text)) return "escala";
    if (/probabil|aleator|combinator/.test(text)) return "probabilidade";
    if (/estatistic|tendencia central|dispers|grafico|tabela/.test(text)) return "estatistica";
    if (/propor|grandeza|convers|medida/.test(text)) return "proporcionalidade";
    if (/geometr|area|volume|espaco e forma|triang|circulo/.test(text)) return "geometria";
    if (/polu|ambient|clima|arboriz|efeito estufa/.test(text)) return "ambiente";
    if (/ecolog|organismo|fisiolog|imun|saude|virus|celul|genet|adapt/.test(text)) return "biologia";
    if (/termodinam|energia|raios x|movimento|mecanic|fisic|particula/.test(text)) return "fisica";
    if (/sociedade|territ|paisagem|demograf|urbani|cultura|histori|inclus|trabalho|tecnologia/.test(text)) return "territorio";
    if (areaId === "matematica") return "proporcionalidade";
    if (areaId === "natureza") return "biologia";
    if (areaId === "humanas") return "territorio";
    return "linguagem";
  }

  const enemExtraDistractors = Object.freeze({
    linguagem: ["Conativa", "Variação histórica", "Expressar a emoção do emissor", "citação sem produção de novo sentido", "eliminar opções antes de localizar a evidência"],
    territorio: ["Migração de retorno", "expansão uniforme da infraestrutura urbana", "crescimento da participação de jovens", "definir a projeção cartográfica", "intemperismo provocado apenas pela chuva"],
    biologia: ["as propriedades físicas das rochas", "população", "característica adquirida pelo uso", "mutualismo", "impedir a entrada do vírus na célula por completo"],
    ambiente: ["elimina toda variação de temperatura", "aumentar o escoamento superficial", "consumo, propaganda e preço", "substituir vegetação por superfícies escuras", "a medida mais abrangente, mesmo sem relação causal"],
    fisica: ["matéria que permanece armazenada no corpo", "a quantidade de casas decimais", "atravessar o material sem atenuação", "somente a cor das linhas", "deixou de existir durante o movimento"],
    circuitos: ["12 Ω", "6 Ω", "aumenta a cada resistor", "joule", "11 Ω"],
    quimica: ["1 000 vezes maior", "300 vezes", "pH 12", "1 000", "10 vezes menor"],
    estequiometria: ["0,5 mol", "6,02 · 10² entidades", "a densidade da solução", "multiplicar todos os índices por dois", "144 g"],
    porcentagem: ["R$ 56", "25", "R$ 120", "R$ 100", "R$ 64"],
    funcao_linear: ["R$ 9", "R$ 30", "o valor por unidade", "a quantidade k", "20"],
    escala: ["2 m", "100 km", "0,2 km", "orientação do mapa", "100 quilômetros"],
    probabilidade: ["[[frac|4|1]]", "8", "−1", "casos possíveis divididos por favoráveis", "[[frac|3|2]]"],
    estatistica: ["6", "3", "15", "apenas o maior valor", "11"],
    proporcionalidade: ["R$ 15", "quadruplica", "o dobro do tempo", "[[frac|1|2]]", "multiplicar todos os valores entre si"],
    geometria: ["4 cm²", "12 cm²", "6", "substituir todas as medidas por uma média", "cm⁴"],
  });

  function completeEnemDistractors(packKey, index, correct, distractors) {
    const values = [...new Set(distractors.map((value) => String(value).trim()))].filter((value) => value && value !== correct);
    const extra = enemExtraDistractors[packKey]?.[index];
    if (values.length < 4 && extra && extra !== correct && !values.includes(extra)) values.push(extra);
    if (values.length !== 4) throw new Error(`Item ENEM inválido em ${packKey}:${index + 1}: esperado um gabarito e quatro distratores`);
    return values;
  }

  function rotateOptions(correct, distractors, shift) {
    const all = [correct, ...distractors];
    const amount = shift % all.length;
    const options = all.slice(amount).concat(all.slice(0, amount));
    return { options, correct: options.indexOf(correct) };
  }

  function fallbackWorkedExample(pack, index, level) {
    const first = pack.map[index % pack.map.length] || pack.map[0];
    const second = pack.map[(index + 1) % pack.map.length] || first;
    const [firstTitle, firstDetail] = first;
    const [secondTitle, secondDetail] = second;
    return {
      level,
      title: `${level === "Fácil" ? "Modelo fácil" : "Modelo médio"}: ${pack.title}`,
      prompt: level === "Fácil" ? `Explique o papel de ${firstTitle} neste assunto.` : `Relacione ${firstTitle} e ${secondTitle} neste assunto.`,
      formula: "comando -> evidência -> relação -> resposta",
      steps: [
        ["1. Comando", "Sublinhe o verbo e diga o que ele exige."],
        ["2. Conceito central", `${firstTitle}: ${firstDetail}.`],
        ["3. Segundo conceito", `${secondTitle}: ${secondDetail}.`],
        ["4. Relação", level === "Fácil" ? `Explique ${firstTitle} com suas próprias palavras.` : `Mostre como ${firstTitle} ajuda a compreender ${secondTitle}.`],
      ],
      result: level === "Fácil" ? `${firstTitle}: ${firstDetail}.` : `${firstTitle} deve ser conectado a ${secondTitle} por uma relação explícita.`,
      mirror: "Use o mesmo roteiro em outro conceito do assunto, sem copiar esta resposta.",
    };
  }

  function createSession(metadata = {}, courseKey = "ultimate") {
    const policy = coursePolicies[courseKey] || coursePolicies.ultimate;
    if (!policy.enabled) return { supported: false, policy };
    const packKey = resolvePackKey(metadata);
    const pack = packs[packKey];
    const competencyCode = metadata.competencyCode || "Competência em classificação";
    const skillCode = metadata.skillCode || "Habilidade em classificação";
    const questions = pack.quiz.map(([prompt, correctText, distractors, explanation], index) => {
      const finalDistractors = courseKey === "ultimate" ? completeEnemDistractors(packKey, index, correctText, distractors) : distractors;
      const ordered = rotateOptions(correctText, finalDistractors, index + 1);
      return {
        id: `${metadata.id || packKey}:recovery:${index + 1}`,
        prompt,
        options: ordered.options,
        correct: ordered.correct,
        explanation,
        competencyCode,
        skillCode,
        difficulty: "Muito fácil",
      };
    });
    return {
      supported: true,
      version: "cavmed-clinical-recovery-v7-enem-five-options",
      policy,
      packKey,
      quantitative: isQuantitativeCase(metadata, packKey),
      molarRelations: packKey === "estequiometria" ? {
        title: "Com um dado, alcance as outras representações",
        center: "1 mol",
        relations: [
          { value: "MM em gramas", note: "massa correspondente à massa molar" },
          { value: "6,02 · 10^{23} entidades", note: "moléculas, átomos, íons ou unidades de fórmula" },
          { value: "22,4 L de gás", note: "somente quando o enunciado adotar as CNTP compatíveis" },
        ],
      } : null,
      notation: notationByPack[packKey] || [],
      title: pack.title,
      competencyCode,
      competency: metadata.competency || "Competência preservada do item de origem",
      skillCode,
      skill: metadata.skill || metadata.microtheme || "Habilidade preservada do item de origem",
      macrotheme: metadata.macrotheme || metadata.area || "Tema em classificação",
      microtheme: metadata.microtheme || metadata.skill || "Microtema em classificação",
      source: {
        title: pack.sourceTitle,
        path: pack.sourcePath,
        chapter: pack.sourceChapter,
        fit: pack.sourceFit,
      },
      summary: pack.summary,
      map: pack.map,
      microSummary: microSummaries[packKey] || pack.map.map(([title, detail]) => `${title}: ${detail}.`),
      flashcards: pack.flashcards,
      workedExamples: [
        { level: "Fácil", ...(workedExamples[packKey] || fallbackWorkedExample(pack, 0, "Fácil")) },
        { level: "Médio", ...(mediumWorkedExamples[packKey] || fallbackWorkedExample(pack, 1, "Médio")) },
      ],
      workedExample: workedExamples[packKey] || fallbackWorkedExample(pack, 0, "Fácil"),
      questions,
    };
  }

  window.CAV_RECOVERY_ENGINE = Object.freeze({
    version: "2.4.0",
    coursePolicies,
    createSession,
    resolvePackKey,
  });
})();
