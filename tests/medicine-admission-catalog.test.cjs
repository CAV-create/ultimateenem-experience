const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(path.join(root, "medicine-public-admission-data.js"), "utf8"), context);
const catalog = context.window.CAV_MEDICINE_PUBLIC_ADMISSION;

test("catálogo contém somente ofertas públicas oficiais de Medicina", () => {
  assert.equal(catalog.edition, 2026);
  assert.equal(catalog.selectionStage, "Chamada Regular");
  assert.match(catalog.source.publisher, /SiSU\/MEC/);
  assert.match(catalog.source.urls.indice_oficial_sisu, /sisu\.mec\.gov\.br/);
  assert.ok(catalog.source.urls.vagas_ofertadas_2026);
  assert.ok(catalog.source.urls.inscricoes_notas_corte_2026);
  assert.ok(catalog.offers.length >= 90);
  assert.ok(catalog.summary.institutions >= 60);
  assert.ok(catalog.summary.states >= 20);

  const allowedCategories = new Set(["Pública Federal", "Pública Estadual", "Pública Municipal"]);
  for (const offer of catalog.offers) {
    assert.equal(offer.course, "Medicina");
    assert.ok(allowedCategories.has(offer.administrativeCategory));
    assert.ok(offer.ampla.seats > 0);
    assert.ok(offer.ampla.cutoff > 0);
    for (const weight of Object.values(offer.weights)) assert.ok(Number(weight) > 0);
  }
});

test("referência oficial da UFRJ preserva cortes, vagas e pesos publicados", () => {
  const offer = catalog.offers.find((item) => item.institution === "UFRJ" && item.city === "Rio de Janeiro");
  assert.ok(offer, "Oferta da UFRJ/Rio de Janeiro não localizada.");
  assert.equal(offer.ampla.seats, 96);
  assert.equal(offer.ampla.cutoff, 833.86);
  assert.equal(offer.escolaPublica.seats, 33);
  assert.equal(offer.escolaPublica.cutoff, 821.22);
  assert.deepEqual(
    Array.from(offer.escolaPublica.components, (component) => component.code).sort(),
    ["LB_EP", "LI_EP"],
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(offer.weights)),
    { linguagens: 2, humanas: 1, natureza: 4, matematica: 2, redacao: 4 },
  );
});

test("tela mostra apenas ampla, escola pública, primeira chamada e cinco pesos", () => {
  const adapter = fs.readFileSync(path.join(root, "experiments/front-gpt-hard-test/hard-test-adapter.js"), "utf8");
  const index = fs.readFileSync(path.join(root, "experiments/front-gpt-hard-test/index.html"), "utf8");

  assert.match(index, /medicine-public-admission-data\.js/);
  assert.match(adapter, /1º corte · ampla concorrência/);
  assert.match(adapter, /1º corte · escola pública/);
  assert.match(adapter, /Vagas · ampla concorrência/);
  assert.match(adapter, /Vagas · escola pública/);
  assert.match(adapter, /Linguagens/);
  assert.match(adapter, /Humanas/);
  assert.match(adapter, /Natureza/);
  assert.match(adapter, /Matemática/);
  assert.match(adapter, /Redação/);
  assert.doesNotMatch(adapter, /LI_PPI|LB_PPI|LI_PCD|LB_PCD|LI_Q|LB_Q/);
});
