window.SISU_2025_INTELLIGENCE_DATA = {
  "version": "2026-08-29-sisu-2025-oficial-mec-v1",
  "visibility": "internal_engine_only",
  "dataFile": "./data/sisu_2025_courses_compact.json",
  "summaryFile": "./data/sisu_2025_summary.json",
  "source": {
    "publisher": "SiSU/MEC",
    "retrieved_at": "2026-08-29",
    "urls": {
      "indice_oficial_sisu": "https://sisu.mec.gov.br/static/pdf/json_arquivos.json",
      "vagas_ofertadas_2025": "https://sisu.mec.gov.br/static/pdf/Portal_Sisu%202025_Vagas%20ofertadas.xlsx",
      "inscricoes_notas_corte_2025": "https://sisu.mec.gov.br/static/pdf/Portal%20Sisu_Sisu%202025_Inscri%C3%A7%C3%B5es%20e%20notas%20de%20corte.xlsx"
    },
    "notes": [
      "Pesos, notas mínimas, vagas e bônus vêm do relatório oficial de vagas ofertadas do SiSU 2025.",
      "Notas de corte e inscrições vêm do relatório oficial de inscrições e notas de corte da Chamada Regular 2025.",
      "A nota de corte zero foi preservada quando consta assim no relatório oficial; o simulador deve tratar como dado sem competição efetiva."
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
    "version": "2026-08-29-sisu-2025-oficial-mec-v1",
    "rows": 58203,
    "unique_offers": 6863,
    "institutions": 124,
    "course_names": 628,
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
      "Pública Federal": 52378,
      "Pública Estadual": 5810,
      "Pública Municipal": 15
    },
    "course_rows_by_area_hint": {
      "medicina_like": 1574,
      "direito_like": 1109,
      "engenharia_like": 10269
    },
    "merge_quality": {
      "vagas_rows": 58203,
      "notas_rows": 58203,
      "merged_rows": 58203,
      "missing_cutoff_rows": 0
    },
    "source_urls": {
      "indice_oficial_sisu": "https://sisu.mec.gov.br/static/pdf/json_arquivos.json",
      "vagas_ofertadas_2025": "https://sisu.mec.gov.br/static/pdf/Portal_Sisu%202025_Vagas%20ofertadas.xlsx",
      "inscricoes_notas_corte_2025": "https://sisu.mec.gov.br/static/pdf/Portal%20Sisu_Sisu%202025_Inscri%C3%A7%C3%B5es%20e%20notas%20de%20corte.xlsx"
    }
  },
  "formula": {
    "weighted_average": "(LC*peso_linguagens + CH*peso_humanas + CN*peso_natureza + MT*peso_matematica + RED*peso_redacao) / soma_pesos",
    "bonus_policy": "Bônus percentual do curso/modalidade só deve ser aplicado se o aluno declarar elegibilidade para aquela ação afirmativa/regional."
  }
};
