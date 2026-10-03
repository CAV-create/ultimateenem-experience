import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inputPath = path.join(root, "data/sisu_2025_courses_compact.json");
const outputPath = path.join(root, "medicine-public-admission-data.js");
const payload = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const index = Object.fromEntries((payload.schema || []).map((key, position) => [key, position]));
const required = [
  "oferta_id", "edicao", "sg_ies", "no_ies", "categoria_adm", "campus", "municipio", "uf",
  "curso", "turno", "tipo_cota", "vagas", "nota_corte", "peso_redacao", "peso_linguagens",
  "peso_matematica", "peso_humanas", "peso_natureza",
];
for (const key of required) {
  if (!(key in index)) throw new Error(`Campo oficial ausente: ${key}`);
}

const publicCategories = new Set(["Pública Federal", "Pública Estadual", "Pública Municipal"]);
const schoolPublicCodes = new Set(["LB_EP", "LI_EP"]);
const rows = (payload.rows || []).filter((row) => (
  String(row[index.curso] || "").trim().toUpperCase() === "MEDICINA"
  && publicCategories.has(String(row[index.categoria_adm] || "").trim())
));
const editions = new Set(rows.map((row) => Number(row[index.edicao])).filter(Number.isFinite));
if (editions.size !== 1 || Math.min(...editions) < 2026) {
  throw new Error("A base local precisa conter uma única edição oficial do SiSU, de 2026 ou posterior, antes de regenerar o catálogo.");
}
const grouped = new Map();
for (const row of rows) {
  const offerId = String(row[index.oferta_id] || "");
  if (!offerId) continue;
  if (!grouped.has(offerId)) grouped.set(offerId, []);
  grouped.get(offerId).push(row);
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function summarize(modalityRows) {
  const valid = modalityRows
    .map((row) => ({
      code: String(row[index.tipo_cota] || ""),
      seats: number(row[index.vagas]) || 0,
      cutoff: number(row[index.nota_corte]),
    }))
    .filter((item) => item.seats > 0);
  const cutoffs = valid.map((item) => item.cutoff).filter((value) => value !== null && value > 0);
  return {
    seats: valid.reduce((total, item) => total + item.seats, 0),
    cutoff: cutoffs.length ? round2(Math.max(...cutoffs)) : null,
    cutoffMin: cutoffs.length ? round2(Math.min(...cutoffs)) : null,
    cutoffMax: cutoffs.length ? round2(Math.max(...cutoffs)) : null,
    components: valid,
  };
}

const offers = [...grouped.entries()].map(([offerId, offerRows]) => {
  const base = offerRows[0];
  const ampla = summarize(offerRows.filter((row) => String(row[index.tipo_cota] || "").toUpperCase() === "AC"));
  const escolaPublica = summarize(offerRows.filter((row) => schoolPublicCodes.has(String(row[index.tipo_cota] || "").toUpperCase())));
  if (!ampla.seats || ampla.cutoff === null) throw new Error(`Oferta de Medicina sem ampla concorrência válida: ${offerId}`);
  return {
    id: offerId,
    edition: number(base[index.edicao]),
    course: "Medicina",
    institution: String(base[index.sg_ies] || "").trim(),
    institutionName: String(base[index.no_ies] || "").trim(),
    administrativeCategory: String(base[index.categoria_adm] || "").trim(),
    campus: String(base[index.campus] || "").trim(),
    city: String(base[index.municipio] || "").trim(),
    uf: String(base[index.uf] || "").trim(),
    shift: String(base[index.turno] || "").trim(),
    ampla,
    escolaPublica,
    weights: {
      linguagens: number(base[index.peso_linguagens]),
      humanas: number(base[index.peso_humanas]),
      natureza: number(base[index.peso_natureza]),
      matematica: number(base[index.peso_matematica]),
      redacao: number(base[index.peso_redacao]),
    },
  };
}).sort((left, right) => (
  left.uf.localeCompare(right.uf, "pt-BR")
  || left.institution.localeCompare(right.institution, "pt-BR")
  || left.city.localeCompare(right.city, "pt-BR")
  || left.campus.localeCompare(right.campus, "pt-BR")
));

const categoryCounts = Object.fromEntries([...publicCategories].map((category) => [
  category,
  offers.filter((offer) => offer.administrativeCategory === category).length,
]));
const catalog = {
  version: `${payload.version}-medicine-public-v1`,
  edition: offers[0]?.edition || null,
  scope: "public_medicine_enem_sisu",
  selectionStage: "Chamada Regular",
  cutoffMeaning: "Nota do último classificado na Chamada Regular",
  schoolPublicRule: "Maior corte oficial entre as modalidades exclusivas de escola pública LB_EP e LI_EP; vagas somadas das duas modalidades.",
  source: payload.source || null,
  summary: {
    offers: offers.length,
    institutions: new Set(offers.map((offer) => offer.institution)).size,
    states: new Set(offers.map((offer) => offer.uf)).size,
    categories: categoryCounts,
  },
  offers,
};

const output = `window.CAV_MEDICINE_PUBLIC_ADMISSION = Object.freeze(${JSON.stringify(catalog)});\n`;
fs.writeFileSync(outputPath, output, "utf8");
console.log(`Catálogo de Medicina pública: ${offers.length} ofertas, ${catalog.summary.institutions} instituições.`);
