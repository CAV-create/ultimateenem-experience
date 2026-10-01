(function attachUerjMedicineAdmissionReference(globalScope) {
  "use strict";

  const reference = {
    version: "20260926-uerj-medicina-2026-componentes-corte-v3",
    institution: "Universidade do Estado do Rio de Janeiro",
    course: "Medicina",
    year: 2026,
    call: "Primeira classificacao",
    publishedAt: "2026-01-16",
    visibleModalities: ["ampla_concorrencia", "rede_publica"],
    scoreScale: 100,
    scoring: {
      formula: "pontos_EQ + (2 x Biologia) + Quimica + Redacao",
      maximums: {
        exame_qualificacao: 20,
        biologia_ponderada: 40,
        quimica: 20,
        redacao: 20,
      },
    },
    campuses: [
      {
        id: "uerj-medicina-maracana-2026",
        campus: "Maracanã",
        officialCourseLabel: "Medicina (RIO)",
        city: "Rio de Janeiro",
        totalSeats: 104,
        amplaConcorrencia: {
          officialCode: "NR",
          label: "Ampla concorrencia",
          cutoff: 86.75,
          seats: 57,
          cutoffComponents: {
            classificationPosition: 57,
            exameQualificacao: 20,
            biologiaRaw: 19.5,
            biologiaWeighted: 39,
            quimica: 15.75,
            redacao: 12,
          },
        },
        redePublica: {
          officialCode: "RP",
          label: "Rede publica",
          cutoff: 74.0,
          seats: 21,
          cutoffComponents: {
            classificationPosition: 21,
            exameQualificacao: 20,
            biologiaRaw: 17.25,
            biologiaWeighted: 34.5,
            quimica: 9.5,
            redacao: 10,
          },
        },
      },
      {
        id: "uerj-medicina-cabo-frio-2026",
        campus: "Cabo Frio",
        officialCourseLabel: "Medicina (CABO FRIO)",
        city: "Cabo Frio",
        totalSeats: 40,
        amplaConcorrencia: {
          officialCode: "NR",
          label: "Ampla concorrencia",
          cutoff: 85.75,
          seats: 22,
          cutoffComponents: {
            classificationPosition: 22,
            exameQualificacao: 20,
            biologiaRaw: 14.75,
            biologiaWeighted: 29.5,
            quimica: 18.25,
            redacao: 18,
          },
        },
        redePublica: {
          officialCode: "RP",
          label: "Rede publica",
          cutoff: 76.25,
          seats: 8,
          cutoffComponents: {
            classificationPosition: 8,
            exameQualificacao: 20,
            biologiaRaw: 15.5,
            biologiaWeighted: 31,
            quimica: 13.25,
            redacao: 12,
          },
        },
      },
    ],
    provenance: {
      publisher: "UERJ - DSEA/PR-1",
      methodology:
        "Corte reconstruido pela pontuacao final do ultimo classificado de cada fila NR/RP na primeira classificacao oficial. Os componentes exibem as notas desse candidato de corte: Biologia com peso 2, em 40 pontos, e Quimica e Redacao em 20 pontos. As notas publicadas apos revisao prevalecem quando existentes.",
      sources: [
        {
          label: "Resultados do Exame Discursivo - Vestibular Estadual 2026",
          url: "https://www.vestibular.uerj.br/?page_id=16418",
        },
        {
          label: "Classificacao oficial UERJ 2026",
          url: "https://www.vestibular.uerj.br/anexos/263/classificacao_UERJ_2026.pdf",
        },
        {
          label: "Notas oficiais do Exame Discursivo UERJ 2026",
          url: "https://www.vestibular.uerj.br/anexos/263/notas/NOTAS_PROVA_DISCURSIVA_UERJ_2026_O_a_Z.pdf",
        },
        {
          label: "Resultado nominal do 1o Exame de Qualificacao 2026",
          url: "https://www.vestibular.uerj.br/?page_id=15728",
        },
        {
          label: "Resultado nominal do 2o Exame de Qualificacao 2026",
          url: "https://www.vestibular.uerj.br/?page_id=16013",
        },
      ],
    },
  };

  globalScope.UERJ_MEDICINE_ADMISSION_REFERENCE = Object.freeze(reference);
})(typeof window !== "undefined" ? window : globalThis);
