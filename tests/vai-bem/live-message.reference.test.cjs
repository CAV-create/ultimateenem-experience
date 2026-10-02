const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const code = fs.readFileSync(path.join(__dirname, '../../experiments/front-gpt-hard-test/vai-bem-live.js'), 'utf8');

function loadModule() {
  const window = {};
  const context = vm.createContext({
    window,
    document: {},
    location: { search: '', hash: '' },
    Blob,
    ArrayBuffer,
    TextDecoder,
    URLSearchParams,
    console,
  });
  vm.runInContext(code, context);
  return window.CAV_VAIBEM_LIVE;
}

test('decodes string, Blob, ArrayBuffer and typed-array Live frames', async () => {
  const live = loadModule();
  const json = JSON.stringify({ setupComplete: {} });
  const typed = new TextEncoder().encode(json);
  for (const frame of [json, new Blob([json]), typed.buffer, typed]) {
    assert.equal(JSON.stringify(await live.decodeLiveMessage(frame)), json);
  }
  await assert.rejects(live.decodeLiveMessage('{invalid'));
});

test('locks tutoring to Brazilian Portuguese and exposes START and RISE teachers', () => {
  const live = loadModule();
  assert.match(live.systemInstruction(), /PORTUGUÊS DO BRASIL/);
  assert.match(live.systemInstruction(), /nunca afirme que desenhou sem chamar a ferramenta/i);
  assert.match(live.systemInstruction(), /pizza deve ser um círculo com fatias/);
  assert.match(live.systemInstruction(), /action=tabela/);
  assert.match(live.systemInstruction(), /action=mapa_mental/);
  assert.match(live.systemInstruction(), /action=desenho/);
  assert.match(live.systemInstruction(), /vale para Matemática, Língua Portuguesa/);
  assert.equal(live.teachers.math.track, 'start');
  assert.equal(live.teachers.chem.track, 'rise');
  assert.equal(Object.keys(live.teachers).length, 17);
  assert.equal(JSON.stringify(Object.keys(live.areas)), JSON.stringify(['exatas', 'linguagens', 'natureza', 'humanas']));
  const portraits = new Set();
  for (const teacher of Object.values(live.teachers)) {
    assert.match(teacher.teacher, /^Dr(a)?\./);
    assert.match(teacher.specialty, /^Especialista em /);
    assert.ok(live.areas[teacher.area]);
    assert.match(teacher.portrait, /^\/assets\/vaibem\/specialists\/[a-z-]+\.webp$/);
    assert.ok(fs.existsSync(path.join(__dirname, '../..', teacher.portrait.slice(1))));
    portraits.add(teacher.portrait);
  }
  assert.equal(portraits.size, 17);
});

test('client sends PCM through realtimeInput.audio and never embeds a long-lived API key', () => {
  assert.match(code, /realtimeInput:\s*\{\s*audio:/);
  assert.match(code, /audio\/pcm;rate=16000/);
  assert.doesNotMatch(code, /GEMINI_API_KEY|x-goog-api-key/);
  assert.match(code, /\/api\/gemini-live-token/);
});

test('the Live setup declares the safe board tool and output audio', () => {
  assert.match(code, /functionDeclarations:\s*\[window\.VaiBemBoard\.declaration\]/);
  assert.match(code, /responseModalities:\s*\["AUDIO"\]/);
  assert.match(code, /action=diagrama/);
  assert.match(code, /Pizza 5\/12/);
});
