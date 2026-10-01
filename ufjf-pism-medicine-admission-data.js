(function attachUfjfPismMedicineAdmissionReference(globalScope) {
  "use strict";

  const reference = {
    version: "20260927-ufjf-pism-2026-medicina-score-engine-v3",
    institution: "Universidade Federal de Juiz de Fora",
    process: "PISM 2026",
    course: "Medicina",
    year: 2026,
    call: "Resultado final",
    visibleModality: {
      officialCode: "C",
      label: "Ampla concorrencia",
    },
    scoreScale: 1300,
    scoring: {
      formula: "(PISM I bruto x 2) + (PISM II bruto x 3) + (PISM III bruto x 5)",
      modules: {
        pism1: { weight: 2, objectiveMaximum: 40, discursiveMaximum: 80, rawMaximum: 120, weightedMaximum: 240 },
        pism2: { weight: 3, objectiveMaximum: 40, discursiveMaximum: 80, rawMaximum: 120, weightedMaximum: 360 },
        pism3: { weight: 5, objectiveMaximum: 40, discursiveMaximum: 100, rawMaximum: 140, weightedMaximum: 700 },
      },
    },
    campuses: [
      {
        id: "ufjf-pism-2026-medicina-juiz-de-fora-grupo-c",
        campus: "Juiz de Fora",
        officialCourseLabel: "Medicina - Integral - Juiz de Fora",
        approvedCount: 44,
        finalCutoff: 1040.25,
        cutoffCandidate: {
          classificationPosition: 44,
          modules: [
            { id: "pism1", objective: 29, discursive: 62.25, rawTotal: 91.25, weightedTotal: 182.5 },
            { id: "pism2", objective: 35, discursive: 61.75, rawTotal: 96.75, weightedTotal: 290.25 },
            { id: "pism3", objective: 34, discursive: 79.5, rawTotal: 113.5, weightedTotal: 567.5 },
          ],
        },
      },
      {
        id: "ufjf-pism-2026-medicina-governador-valadares-grupo-c",
        campus: "Governador Valadares",
        officialCourseLabel: "Medicina - Integral - Governador Valadares",
        approvedCount: 24,
        finalCutoff: 957.75,
        cutoffCandidate: {
          classificationPosition: 24,
          modules: [
            { id: "pism1", objective: 29, discursive: 53.25, rawTotal: 82.25, weightedTotal: 164.5 },
            { id: "pism2", objective: 30, discursive: 55.25, rawTotal: 85.25, weightedTotal: 255.75 },
            { id: "pism3", objective: 32, discursive: 75.5, rawTotal: 107.5, weightedTotal: 537.5 },
          ],
        },
      },
    ],
    provenance: {
      publisher: "UFJF - COPESE",
      methodology:
        "O corte final corresponde a pontuacao do ultimo aprovado do Grupo C em Medicina. Objetiva e discursiva sao os componentes oficiais desse candidato em cada modulo, e nao cortes autonomos por tipo de prova. Nenhum dado pessoal e armazenado no aplicativo.",
      sources: [
        {
          label: "PISM 2026 - documentos e resultados oficiais",
          url: "https://www2.ufjf.br/copese/vestibular-pism-2/vestibular-pism-edicoes-anteriores/pism-2026/",
        },
        {
          label: "Edital PISM 2026 retificado",
          url: "https://www2.ufjf.br/copese/wp-content/uploads/sites/42/2025/09/08_2025_Edital-08-2025_PISM-2026_Retificado-pelos-10-11-e-12_2025.pdf",
        },
        {
          label: "Resultado final - Medicina Juiz de Fora - Grupo C",
          url: "https://processoseletivo.ufjf.br/2026/resultadofinalpism3/aprovados_listagem_3087_502_13.html",
        },
        {
          label: "Resultado final - Medicina Governador Valadares - Grupo C",
          url: "https://processoseletivo.ufjf.br/2026/resultadofinalpism3/aprovados_listagem_6190_526_13.html",
        },
      ],
    },
  };

  const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

  function standardizeAssessmentScore(moduleId, input) {
    const rules = reference.scoring.modules[moduleId];
    if (!rules) throw new Error(`Modulo PISM desconhecido: ${moduleId}`);

    const values = [
      ["objectiveScore", input.objectiveScore, "objectiveTotal", input.objectiveTotal],
      ["discursiveScore", input.discursiveScore, "discursiveTotal", input.discursiveTotal],
    ];
    for (const [scoreName, score, totalName, total] of values) {
      if (!Number.isFinite(score) || !Number.isFinite(total) || total <= 0 || score < 0 || score > total) {
        throw new Error(`${scoreName} deve estar entre zero e ${totalName}.`);
      }
    }

    const objective = (input.objectiveScore / input.objectiveTotal) * rules.objectiveMaximum;
    const discursive = (input.discursiveScore / input.discursiveTotal) * rules.discursiveMaximum;
    const rawTotal = objective + discursive;
    const weightedTotal = rawTotal * rules.weight;
    return Object.freeze({
      moduleId,
      objective: round2(objective),
      objectiveMaximum: rules.objectiveMaximum,
      discursive: round2(discursive),
      discursiveMaximum: rules.discursiveMaximum,
      rawTotal: round2(rawTotal),
      rawMaximum: rules.rawMaximum,
      weightedTotal: round2(weightedTotal),
      weightedMaximum: rules.weightedMaximum,
      percentage: round2((rawTotal / rules.rawMaximum) * 100),
    });
  }

  const standardizeListScore = (moduleId, input) => standardizeAssessmentScore(moduleId, input);
  const standardizeSimulationScore = (moduleId, input) => standardizeAssessmentScore(moduleId, input);
  const getModuleRules = (moduleId) => {
    const rules = reference.scoring.modules[moduleId];
    if (!rules) throw new Error(`Modulo PISM desconhecido: ${moduleId}`);
    return Object.freeze({ moduleId, ...rules });
  };

  globalScope.UFJF_PISM_MEDICINE_ADMISSION_REFERENCE = Object.freeze(reference);
  globalScope.UFJF_PISM_SCORE_ENGINE = Object.freeze({
    getModuleRules,
    standardizeAssessmentScore,
    standardizeListScore,
    standardizeSimulationScore,
  });
})(typeof window !== "undefined" ? window : globalThis);
