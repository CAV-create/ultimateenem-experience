const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const protocolPath = path.join(__dirname, '../api/_lib/enem-redaction-2026.mjs');
const adapterPath = path.join(__dirname, '../experiments/front-gpt-hard-test/hard-test-adapter.js');
const endpointPath = path.join(__dirname, '../api/cavprime-redacao-review-test.js');

function rawEvaluation(scores, resultStatus = 'valid') {
  return {
    resultStatus,
    humanRightsViolation: false,
    competencies: scores.map((score) => ({ score })),
  };
}

test('ENEM discrepancy respects the official strict thresholds', async () => {
  const protocol = await import(pathToFileURL(protocolPath));
  const base = protocol.sanitizeEvaluation(rawEvaluation([160, 160, 160, 160, 160]), '1');

  const belowTotalThreshold = protocol.sanitizeEvaluation(rawEvaluation([120, 120, 160, 160, 160]), '2');
  assert.equal(protocol.compareEvaluations(base, belowTotalThreshold).totalDifference, 80);
  assert.equal(protocol.compareEvaluations(base, belowTotalThreshold).detected, false);

  const exactlyEightyInOneCompetency = protocol.sanitizeEvaluation(rawEvaluation([80, 160, 160, 160, 160]), '2');
  assert.equal(protocol.compareEvaluations(base, exactlyEightyInOneCompetency).competencyDifferences[0].difference, 80);
  assert.equal(protocol.compareEvaluations(base, exactlyEightyInOneCompetency).detected, false);

  const overOneHundred = protocol.sanitizeEvaluation(rawEvaluation([80, 120, 160, 160, 160]), '2');
  assert.equal(protocol.compareEvaluations(base, overOneHundred).totalDifference, 120);
  assert.equal(protocol.compareEvaluations(base, overOneHundred).detected, true);

  const overEightyInOneCompetency = protocol.sanitizeEvaluation(rawEvaluation([40, 200, 200, 200, 200]), '2');
  assert.equal(protocol.compareEvaluations(base, overEightyInOneCompetency).competencyDifferences[0].difference, 120);
  assert.equal(protocol.compareEvaluations(base, overEightyInOneCompetency).detected, true);
});

test('a situation disagreement automatically requires another reader', async () => {
  const protocol = await import(pathToFileURL(protocolPath));
  const valid = protocol.sanitizeEvaluation(rawEvaluation([0, 0, 0, 0, 0], 'valid'), '1');
  const blank = protocol.sanitizeEvaluation(rawEvaluation([0, 0, 0, 0, 0], 'blank'), '2');
  const comparison = protocol.compareEvaluations(valid, blank);
  assert.equal(comparison.situationDivergence, true);
  assert.equal(comparison.detected, true);
});

test('third reader selects one unique non-discrepant closest pair', async () => {
  const protocol = await import(pathToFileURL(protocolPath));
  const first = protocol.sanitizeEvaluation(rawEvaluation([120, 120, 120, 120, 120]), '1');
  const second = protocol.sanitizeEvaluation(rawEvaluation([200, 200, 200, 200, 200]), '2');
  const third = protocol.sanitizeEvaluation(rawEvaluation([120, 160, 120, 120, 120]), '3');
  const pair = protocol.chooseClosestPair([first, second, third]);
  assert.deepEqual(pair.evaluations.map((item) => item.evaluatorId), ['1', '3']);
  assert.equal(pair.comparison.detected, false);
  assert.equal(protocol.buildFinalFromPair(...pair.evaluations).total, 620);
});

test('student interface makes dual review and automatic third board explicit', () => {
  const adapter = fs.readFileSync(adapterPath, 'utf8');
  const endpoint = fs.readFileSync(endpointPath, 'utf8');
  assert.match(adapter, /Você não precisa chamar o segundo corretor/);
  assert.match(adapter, /1º médico corretor/);
  assert.match(adapter, /2º médico corretor/);
  assert.match(adapter, /3º médico corretor/);
  assert.match(adapter, /Junta médica final/);
  assert.match(adapter, /Interconsulta acionada automaticamente/);
  assert.match(adapter, /process\.discrepancy\?\.detected \? "open"/);
  assert.match(endpoint, /Promise\.all\(\[/, 'os dois primeiros corretores devem trabalhar em paralelo');
  assert.match(endpoint, /buildEvaluatorInstructions\("3"\)/, 'a terceira leitura deve ser automática');
  assert.match(endpoint, /maxDuration: 240/, 'a função deve comportar terceira leitura e junta médica');
  assert.match(adapter, /AbortSignal\.timeout\(230000\)/, 'o navegador deve aguardar o fluxo clínico completo');
});
