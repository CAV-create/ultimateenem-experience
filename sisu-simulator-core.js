(function () {
  const AREA_TO_TRI = {
    linguagens: "LC",
    humanas: "CH",
    natureza: "CN",
    matematica: "MT",
  };

  const SCORE_FIELDS = ["linguagens", "humanas", "natureza", "matematica", "redacao"];
  let cachedPayload = null;
  let cachedRows = null;

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function toNumber(value) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }

  function decodeRows(payload) {
    const schema = payload.schema || [];
    return (payload.rows || []).map((row) =>
      schema.reduce((acc, key, index) => {
        acc[key] = row[index];
        return acc;
      }, {}),
    );
  }

  async function loadSisu2025Data() {
    if (cachedRows) return { payload: cachedPayload, rows: cachedRows };
    const config = window.SISU_2025_INTELLIGENCE_DATA || {};
    const file = config.dataFile || "./data/sisu_2025_courses_compact.json";
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Falha ao carregar base SiSU 2025: HTTP ${response.status}`);
    }
    cachedPayload = await response.json();
    cachedRows = decodeRows(cachedPayload);
    return { payload: cachedPayload, rows: cachedRows };
  }

  function getTriRow(areaId, hits, statistic = "median") {
    const triArea = AREA_TO_TRI[areaId] || areaId;
    const rows = Array.isArray(window.ENEM_NOTAS_ACERTOS_TRI_DATA?.rows)
      ? window.ENEM_NOTAS_ACERTOS_TRI_DATA.rows
      : [];
    const latestYear = Number(window.ENEM_NOTAS_ACERTOS_TRI_DATA?.latestYear) || 2025;
    const scoreFromRow = (row) => toNumber(row?.[statistic]) ?? toNumber(row?.median) ?? toNumber(row?.mean);
    const exactRows = rows
      .filter((item) => item.area === triArea && Number(item.hits) === Number(hits))
      .sort((a, b) => Number(b.year) - Number(a.year));
    const exactRow = exactRows.find((item) => scoreFromRow(item) !== null);
    if (exactRow) return scoreFromRow(exactRow);
    const fallbackRows = rows
      .filter((item) => item.area === triArea && scoreFromRow(item) !== null)
      .sort((a, b) => {
        const hitDistance = Math.abs(Number(a.hits) - Number(hits)) - Math.abs(Number(b.hits) - Number(hits));
        if (hitDistance) return hitDistance;
        return Number(b.year || latestYear) - Number(a.year || latestYear);
      });
    return fallbackRows.length ? scoreFromRow(fallbackRows[0]) : null;
  }

  function estimateScoresFromHits(hits = {}, redacao, statistic = "median") {
    const scores = {};
    Object.keys(AREA_TO_TRI).forEach((areaId) => {
      const value = getTriRow(areaId, hits[areaId], statistic);
      scores[areaId] = value;
    });
    scores.redacao = toNumber(redacao);
    return scores;
  }

  function getWeights(row) {
    return {
      linguagens: toNumber(row.peso_linguagens) ?? 1,
      humanas: toNumber(row.peso_humanas) ?? 1,
      natureza: toNumber(row.peso_natureza) ?? 1,
      matematica: toNumber(row.peso_matematica) ?? 1,
      redacao: toNumber(row.peso_redacao) ?? 1,
    };
  }

  function getMinimums(row) {
    return {
      linguagens: toNumber(row.min_linguagens) ?? 0,
      humanas: toNumber(row.min_humanas) ?? 0,
      natureza: toNumber(row.min_natureza) ?? 0,
      matematica: toNumber(row.min_matematica) ?? 0,
      redacao: toNumber(row.min_redacao) ?? 0,
    };
  }

  function calculateWeightedScore(scores = {}, weights = {}) {
    let totalWeight = 0;
    let weighted = 0;
    for (const area of SCORE_FIELDS) {
      const score = toNumber(scores[area]);
      const weight = toNumber(weights[area]);
      if (score === null || weight === null || weight <= 0) return null;
      weighted += score * weight;
      totalWeight += weight;
    }
    return totalWeight ? Math.round((weighted / totalWeight) * 100) / 100 : null;
  }

  function checkMinimums(scores = {}, row) {
    const minimums = getMinimums(row);
    const failures = [];
    for (const area of SCORE_FIELDS) {
      const score = toNumber(scores[area]);
      const min = toNumber(minimums[area]) ?? 0;
      if (min > 0 && (score === null || score < min)) failures.push({ area, score, min });
    }
    return failures;
  }

  function chanceBand(delta, cutoff, minimumFailures) {
    if (minimumFailures.length) return "bloqueado_por_nota_minima";
    if (!Number.isFinite(cutoff) || cutoff <= 0) return "sem_corte_competitivo_no_relatorio";
    if (delta >= 25) return "acima_com_folga";
    if (delta >= 0) return "competitivo_acima_do_corte";
    if (delta >= -15) return "zona_de_batalha";
    if (delta >= -40) return "precisa_ganho_controlado";
    return "fora_no_momento";
  }

  function evaluateRow(row, scores = {}, options = {}) {
    const weights = getWeights(row);
    const rawScore = calculateWeightedScore(scores, weights);
    const bonus = toNumber(row.bonus_percentual) || 0;
    const applyBonus = Boolean(options.applyBonus);
    const finalScore = rawScore === null ? null : applyBonus ? Math.round(rawScore * (1 + bonus / 100) * 100) / 100 : rawScore;
    const cutoff = toNumber(row.nota_corte);
    const minimumFailures = checkMinimums(scores, row);
    const delta = finalScore !== null && cutoff !== null ? Math.round((finalScore - cutoff) * 100) / 100 : null;
    return {
      id: row.id,
      oferta_id: row.oferta_id,
      curso: row.curso,
      instituicao: row.sg_ies,
      nome_instituicao: row.no_ies,
      campus: row.campus,
      municipio: row.municipio,
      uf: row.uf,
      grau: row.grau,
      turno: row.turno,
      modalidade: row.tipo_cota,
      vagas: row.vagas,
      inscricoes: row.inscricoes,
      nota_corte_2025_cr: cutoff,
      nota_calculada: finalScore,
      nota_sem_bonus: rawScore,
      bonus_percentual: bonus,
      bonus_aplicado: applyBonus && bonus > 0,
      delta,
      chance: chanceBand(delta, cutoff, minimumFailures),
      pesos: weights,
      notas_minimas: getMinimums(row),
      reprovado_por_minima: minimumFailures,
    };
  }

  function validOfferRow(row) {
    const vagas = toNumber(row.vagas);
    const cutoff = toNumber(row.nota_corte_2025_cr ?? row.nota_corte);
    return (vagas ?? 0) > 0 && (cutoff ?? 0) > 0;
  }

  function compareSisuResults(a, b) {
    const aDelta = Number.isFinite(a.delta) ? a.delta : -9999;
    const bDelta = Number.isFinite(b.delta) ? b.delta : -9999;
    return bDelta - aDelta || (b.nota_corte_2025_cr || 0) - (a.nota_corte_2025_cr || 0);
  }

  function shouldCollapseOffers(options = {}) {
    return !normalizeText(options.modalidade || options.tipo_cota || "");
  }

  function offerCollapseKey(row) {
    return row.oferta_id || [
      row.instituicao,
      row.nome_instituicao,
      row.curso,
      row.campus,
      row.municipio,
      row.uf,
      row.grau,
      row.turno,
    ].map(normalizeText).join("|");
  }

  function collapseBestOfferRows(rows = []) {
    const byOffer = new Map();
    for (const row of rows) {
      const key = offerCollapseKey(row);
      const current = byOffer.get(key);
      if (!current || compareSisuResults(row, current) < 0) byOffer.set(key, row);
    }
    return [...byOffer.values()].sort(compareSisuResults);
  }

  function filterRows(rows, filters = {}) {
    const query = normalizeText(filters.query || [filters.curso, filters.instituicao, filters.municipio].filter(Boolean).join(" "));
    const terms = query ? query.split(/\s+/).filter(Boolean) : [];
    const exactCourse = normalizeText(filters.cursoExato || filters.exactCourse || "");
    const courseTerm = normalizeText(filters.curso || filters.course || "");
    const institutionTerm = normalizeText(filters.instituicao || filters.institution || "");
    const cityTerm = normalizeText(filters.municipio || filters.city || "");
    const modalidade = normalizeText(filters.modalidade || filters.tipo_cota || "");
    const uf = normalizeText(filters.uf || "");
    return rows.filter((row) => {
      if (exactCourse && normalizeText(row.curso) !== exactCourse) return false;
      if (courseTerm && !normalizeText(row.curso).includes(courseTerm)) return false;
      if (institutionTerm && !normalizeText([row.sg_ies, row.no_ies].join(" ")).includes(institutionTerm)) return false;
      if (cityTerm && !normalizeText(row.municipio).includes(cityTerm)) return false;
      if (modalidade && normalizeText(row.tipo_cota) !== modalidade) return false;
      if (uf && normalizeText(row.uf) !== uf) return false;
      if (!terms.length) return true;
      const haystack = normalizeText(
        [row.curso, row.sg_ies, row.no_ies, row.campus, row.municipio, row.uf, row.grau, row.turno].join(" "),
      );
      return terms.every((term) => haystack.includes(term));
    });
  }

  async function simulateSisu2025(options = {}) {
    const { rows } = await loadSisu2025Data();
    const scores = options.scores || estimateScoresFromHits(options.hits || {}, options.redacao, options.statistic || "median");
    const filtered = filterRows(rows, options);
    const evaluated = filtered
      .map((row) => evaluateRow(row, scores, options))
      .filter(validOfferRow)
      .sort(compareSisuResults);
    const collapsed = shouldCollapseOffers(options);
    const finalRows = collapsed ? collapseBestOfferRows(evaluated) : evaluated;
    return {
      version: window.SISU_2025_INTELLIGENCE_DATA?.version || "sisu-2025",
      source: window.SISU_2025_INTELLIGENCE_DATA?.source || null,
      input: { ...options, scores },
      total_matches: finalRows.length,
      raw_matches: evaluated.length,
      collapsed_by_offer: collapsed,
      results: finalRows.slice(0, Math.max(1, Number(options.limit) || 30)),
    };
  }

  function scoresFromSimuladoCorrection(correction, redacao, statistic = "median") {
    const hits = {};
    (correction?.areas || []).forEach((area) => {
      hits[area.areaId] = area.score;
    });
    return estimateScoresFromHits(hits, redacao, statistic);
  }

  window.UltimateEnemSisuSimulator = {
    loadSisu2025Data,
    estimateScoresFromHits,
    scoresFromSimuladoCorrection,
    calculateWeightedScore,
    evaluateRow,
    simulateSisu2025,
  };
})();
