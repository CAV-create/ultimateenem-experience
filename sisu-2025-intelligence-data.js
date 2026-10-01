window.SISU_2025_INTELLIGENCE_DATA = {
  "version": "2026-09-27-sisu-2026-oficial-mec-auto-v1",
  "visibility": "internal_engine_only",
  "dataFile": "./data/sisu_2025_courses_compact.json",
  "summaryFile": "./data/sisu_2025_summary.json",
  "source": {
    "publisher": "SiSU/MEC",
    "retrieved_at": "2026-09-27",
    "urls": {
      "indice_oficial_sisu": "https://sisu.mec.gov.br/static/pdf/json_arquivos.json",
      "vagas_ofertadas_2026": "https://sisu.mec.gov.br/static/pdf/Portal_Sisu_2026_Vagas ofertadas.xlsx",
      "inscricoes_notas_corte_2026": "https://sisu.mec.gov.br/static/pdf/Portal Sisu_ Sisu2026_inscrições e notas de corte.xlsx"
    },
    "notes": [
      "Pesos, notas minimas, vagas e bonus vem do relatorio oficial de vagas ofertadas.",
      "Notas de corte e inscricoes vem do relatorio oficial da Chamada Regular.",
      "O caminho legado dos arquivos foi mantido para compatibilidade; a edicao ativa e declarada nos metadados."
    ]
  },
  "schema": [
    "id",
    "oferta_id",
    "edicao",
    "co_ies",
    "sg_ies",
    "no_ies",
    "categoria_adm",
    "organizacao",
    "campus",
    "municipio",
    "uf",
    "regiao",
    "co_curso",
    "curso",
    "grau",
    "turno",
    "periodicidade",
    "semestre",
    "modalidade",
    "tipo_cota",
    "vagas",
    "nota_corte",
    "inscricoes",
    "bonus_percentual",
    "peso_redacao",
    "peso_linguagens",
    "peso_matematica",
    "peso_humanas",
    "peso_natureza",
    "min_redacao",
    "min_linguagens",
    "min_matematica",
    "min_humanas",
    "min_natureza",
    "media_minima_enem"
  ],
  "summary": {
    "version": "2026-09-27-sisu-2026-oficial-mec-auto-v1",
    "edition": 2026,
    "rows": 62567,
    "unique_offers": 7390,
    "institutions": 136,
    "course_names": 663,
    "ufs": [
      "AC",
      "AL",
      "AM",
      "AP",
      "BA",
      "CE",
      "DF",
      "ES",
      "GO",
      "MA",
      "MG",
      "MS",
      "MT",
      "PA",
      "PB",
      "PE",
      "PI",
      "PR",
      "RJ",
      "RN",
      "RR",
      "RS",
      "SC",
      "SE",
      "SP",
      "TO"
    ],
    "administrative_categories": {
      "Pública Federal": 56330,
      "Pública Estadual": 6168,
      "Pública Municipal": 69
    },
    "merge_quality": {
      "offers_rows": 62567,
      "cutoff_rows": 62567,
      "merged_rows": 62567,
      "missing_cutoff_rows": 0
    },
    "source_urls": {
      "indice_oficial_sisu": "https://sisu.mec.gov.br/static/pdf/json_arquivos.json",
      "vagas_ofertadas_2026": "https://sisu.mec.gov.br/static/pdf/Portal_Sisu_2026_Vagas ofertadas.xlsx",
      "inscricoes_notas_corte_2026": "https://sisu.mec.gov.br/static/pdf/Portal Sisu_ Sisu2026_inscrições e notas de corte.xlsx"
    }
  },
  "formula": {
    "weighted_average": "(LC*peso_linguagens + CH*peso_humanas + CN*peso_natureza + MT*peso_matematica + RED*peso_redacao) / soma_pesos",
    "bonus_policy": "Bonus percentual so deve ser aplicado quando o aluno declarar elegibilidade."
  }
};
