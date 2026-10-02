const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const code = fs.readFileSync(path.join(__dirname, '../experiments/front-gpt-hard-test/hard-test-questions.js'), 'utf8');
const adapterCode = fs.readFileSync(path.join(__dirname, '../experiments/front-gpt-hard-test/hard-test-adapter.js'), 'utf8');

test('every native UltimateENEM item has one answer and four distinct distractors', () => {
  const window = {};
  vm.runInContext(code, vm.createContext({ window }));
  assert.ok(window.CAV_HARD_TEST_QUESTIONS.length > 0);
  for (const item of window.CAV_HARD_TEST_QUESTIONS) {
    assert.equal(item.options.length, 5, `${item.id} deve ter alternativas A-E`);
    assert.equal(new Set(item.options).size, 5, `${item.id} não pode repetir alternativa`);
    assert.match(item.answer, /^[A-E]$/, `${item.id} precisa de gabarito A-E`);
  }
});

test('recovery interface labels all five ENEM alternatives from A to E', () => {
  const labels = [...adapterCode.matchAll(/\$\{\"(ABCDE)\"\[optionIndex\]\}/g)];
  assert.ok(labels.length >= 2, 'questão e correção devem compartilhar a escala A-E');
  assert.doesNotMatch(adapterCode, /\$\{\"ABCD\"\[optionIndex\]\}/);
});

test('student-facing recovery uses medical memory prescription and separated context', () => {
  assert.match(adapterCode, /Prescrição de memória · 3 vezes ao dia/);
  assert.match(adapterCode, /recovery-question-context/);
  assert.match(adapterCode, /recovery-question-command/);
  assert.doesNotMatch(adapterCode, /Flashcards estilo Anki|Modelo Anki|Muito fácil/);
});
