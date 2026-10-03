const assert = require('node:assert/strict');
const { validate } = require('../vai-bem-board.js');

const triangle = [
  { kind: 'triangle', points: [20, 80, 20, 20, 75, 80], color: 'azul' },
  { kind: 'angle', x: 20, y: 80, x2: 20, y2: 20, x3: 75, y3: 80, radius: 6, text: '90°', color: 'amarelo' },
  { kind: 'angle', x: 20, y: 20, x2: 75, y2: 80, x3: 20, y3: 80, radius: 6, text: '60°', color: 'verde' },
  { kind: 'angle', x: 75, y: 80, x2: 20, y2: 80, x3: 20, y3: 20, radius: 6, text: '30°', color: 'vermelho' },
];

const checked = validate({ action: 'desenho', id: 'triangulo-auditado', title: 'Triângulo auditado', elements: triangle });
assert.equal(checked.elements.filter(element => element.kind === 'angle').length, 3);
assert.equal(checked.elements[1].text, '90°');

const hiddenEdge = validate({
  action: 'desenho',
  id: 'solido-auditado',
  title: 'Sólido auditado',
  elements: [{ kind: 'line', x: 10, y: 10, x2: 40, y2: 40, dashed: true, color: 'cinza' }],
});
assert.equal(hiddenEdge.elements[0].dashed, true);

assert.throws(
  () => validate({ action: 'desenho', id: 'rotulo-solto', title: 'Inválido', elements: [{ kind: 'text', x: 20, y: 20, text: '60°' }] }),
  /kind=angle/
);
assert.throws(
  () => validate({ action: 'desenho', id: 'raio-nulo', title: 'Inválido', elements: [{ kind: 'angle', x: 20, y: 20, x2: 20, y2: 20, x3: 40, y3: 40 }] }),
  /semirretas/
);
assert.throws(
  () => validate({ action: 'desenho', id: 'raios-colineares', title: 'Inválido', elements: [{ kind: 'angle', x: 20, y: 20, x2: 30, y2: 30, x3: 40, y3: 40 }] }),
  /mesma direção/
);
assert.throws(
  () => validate({ action: 'diagrama', id: 'soma-invalida', diagram: 'triangulo_retangulo', title: 'Inválido', labels: [], values: [90, 45, 44] }),
  /somando 180°/
);

console.log('Geometria da lousa validada: arcos, rótulos, triângulos e arestas ocultas.');
