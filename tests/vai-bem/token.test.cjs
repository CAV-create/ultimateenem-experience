const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

const code = fs.readFileSync(path.join(__dirname, '../../api/gemini-live-token.js'), 'utf8')
  .replace('export default async function handler', 'async function handler');

async function run({
  key = 'server-only-secret',
  model = '',
  method = 'POST',
  probe = false,
  fetchImpl = async () => ({ ok: true, text: async () => JSON.stringify({ name: 'ephemeral-token' }) }),
} = {}) {
  const logs = [];
  const ctx = vm.createContext({
    process: { env: { GEMINI_API_KEY: key, GEMINI_LIVE_MODEL: model } },
    fetch: fetchImpl,
    AbortSignal,
    Date,
    console: { error: (...entry) => logs.push(entry) },
  });
  vm.runInContext(code, ctx);
  const result = { headers: {} };
  ctx.req = { method, query: probe ? { probe: 'token' } : {} };
  ctx.res = {
    setHeader(name, value) { result.headers[name] = value; },
    status(status) { result.status = status; return this; },
    json(body) { result.body = body; return body; },
  };
  await vm.runInContext('handler(req,res)', ctx);
  return { ...result, logs };
}

test('backend sends credentials only upstream; client receives only the ephemeral credential', async () => {
  let request;
  const result = await run({
    fetchImpl: async (url, options) => {
      request = { url, options };
      return { ok: true, text: async () => JSON.stringify({ name: 'ephemeral-token' }) };
    },
  });
  assert.equal(result.status, 200);
  assert.equal(result.body.token, 'ephemeral-token');
  assert.equal(JSON.stringify(result).includes('server-only-secret'), false);
  assert.equal(request.options.headers['x-goog-api-key'], 'server-only-secret');
  assert.ok(request.options.signal);
  assert.equal(JSON.parse(request.options.body).uses, 1);
  assert.match(result.headers['Cache-Control'], /no-store/);
});

test('probe omits the token; missing keys and invalid methods fail clearly', async () => {
  const result = await run({ method: 'GET', probe: true });
  assert.equal(result.status, 200);
  assert.equal(result.body.tokenIssuance, true);
  assert.equal(JSON.stringify(result).includes('ephemeral-token'), false);
  assert.equal((await run({ key: '' })).status, 503);
  assert.equal((await run({ method: 'DELETE' })).status, 405);
});

test('uses the stable Live model by default and validates an override', async () => {
  assert.equal((await run({ method: 'GET', probe: true })).body.model, 'models/gemini-3.8-live');
  assert.equal((await run({ method: 'GET', probe: true, model: 'gemini-custom-live' })).body.model, 'models/gemini-custom-live');
  assert.equal((await run({ model: 'bad model' })).status, 500);
});

test('upstream failures and exceptions do not reflect raw secrets to logs or clients', async () => {
  const denied = await run({
    fetchImpl: async () => ({
      ok: false,
      status: 403,
      text: async () => JSON.stringify({ error: { message: 'server-only-secret', status: 'PERMISSION_DENIED' } }),
    }),
  });
  assert.equal(denied.status, 502);
  assert.equal(JSON.stringify(denied).includes('server-only-secret'), false);
  const timeout = await run({ fetchImpl: async () => { throw Error('server-only-secret'); } });
  assert.equal(timeout.status, 500);
  assert.equal(JSON.stringify(timeout).includes('server-only-secret'), false);
});
