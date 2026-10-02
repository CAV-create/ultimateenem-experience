const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const code = fs.readFileSync(path.join(__dirname, '../experiments/front-gpt-hard-test/hard-test-recovery-engine.js'), 'utf8');

function engine() {
  const window = {};
  vm.runInContext(code, vm.createContext({ window, console }));
  return window.CAV_RECOVERY_ENGINE;
}

test('UltimateENEM recovery always has one answer and four distractors', () => {
  const recovery = engine();
  const cases = [
    ['linguagem', { areaId: 'linguagens', title: 'Leitura textual' }],
    ['territorio', { areaId: 'humanas', title: 'Território' }],
    ['biologia', { areaId: 'natureza', title: 'Célula e adaptação' }],
    ['ambiente', { areaId: 'natureza', title: 'Poluição ambiental' }],
    ['fisica', { areaId: 'natureza', title: 'Energia física' }],
    ['circuitos', { areaId: 'natureza', title: 'Circuito e resistor' }],
    ['quimica', { areaId: 'natureza', title: 'pH e concentração' }],
    ['estequiometria', { areaId: 'natureza', title: 'Estequiometria e mol' }],
    ['porcentagem', { areaId: 'matematica', title: 'Porcentagem e desconto' }],
    ['funcao_linear', { areaId: 'matematica', title: 'Função e tarifa' }],
    ['escala', { areaId: 'matematica', title: 'Escala cartográfica' }],
    ['probabilidade', { areaId: 'matematica', title: 'Probabilidade' }],
    ['estatistica', { areaId: 'matematica', title: 'Estatística e mediana' }],
    ['proporcionalidade', { areaId: 'matematica', title: 'Grandezas proporcionais' }],
    ['geometria', { areaId: 'matematica', title: 'Geometria e área' }],
  ];
  for (const [expectedPack, metadata] of cases) {
    const session = recovery.createSession(metadata, 'ultimate');
    assert.equal(session.packKey, expectedPack);
    assert.equal(session.questions.length, 5);
    for (const question of session.questions) {
      assert.equal(question.options.length, 5, `${expectedPack} deve ter alternativas A-E`);
      assert.equal(new Set(question.options).size, 5, `${expectedPack} não pode repetir alternativa`);
      assert.ok(question.correct >= 0 && question.correct <= 4);
      assert.ok(question.context.length >= 80, `${expectedPack} precisa de contexto suficiente`);
      assert.match(question.command, /^(Identifique|Analise|Determine|Relacione|Calcule|Compare|Explique|Justifique)\b/);
      assert.equal(question.prompt, `${question.context} ${question.command}`);
      assert.equal(question.difficulty, 'Consolidação guiada');
    }
  }
});

test('other courses retain their own objective format', () => {
  const recovery = engine();
  const uerj = recovery.createSession({ areaId: 'linguagens', title: 'Leitura textual' }, 'diadea');
  assert.ok(uerj.questions.every((question) => question.options.length === 4));
});
