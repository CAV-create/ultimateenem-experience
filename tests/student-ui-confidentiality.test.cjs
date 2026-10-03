const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const adapter = fs.readFileSync(
  path.resolve(__dirname, "../experiments/front-gpt-hard-test/hard-test-adapter.js"),
  "utf8",
);

test("a tela do aluno não expõe a justificativa interna de priorização", () => {
  assert.doesNotMatch(adapter, /Por que este passo\?/);
  assert.doesNotMatch(adapter, /why-hard/);
  assert.doesNotMatch(adapter, /A prioridade combina histórico, erros, recorrência/);
  assert.doesNotMatch(adapter, /Nossos médicos orientadores priorizaram/);
});
