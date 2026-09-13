const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
const code=fs.readFileSync(require('node:path').join(__dirname,'../api/gemini-live-token.js'),'utf8').replace('export default async function handler','async function handler');
async function run({key='server-only-secret',method='POST',probe=false,fetchImpl=async()=>({ok:true,text:async()=>'{"name":"ephemeral-token"}'})}={}){
 const logs=[];const ctx=vm.createContext({process:{env:{GEMINI_API_KEY:key}},fetch:fetchImpl,AbortSignal,Date,console:{error:(...x)=>logs.push(x)}});vm.runInContext(code,ctx);
 const result={headers:{}};ctx.req={method,query:probe?{probe:'token'}:{}};ctx.res={setHeader(k,v){result.headers[k]=v},status(s){result.status=s;return this},json(body){result.body=body;return body}};await vm.runInContext('handler(req,res)',ctx);return {...result,logs};
}
test('backend sends credentials only upstream; successful client response contains only ephemeral credential',async()=>{
 let request;const r=await run({fetchImpl:async(url,opts)=>{request={url,opts};return {ok:true,text:async()=>'{"name":"ephemeral-token"}'}}});assert.equal(r.status,200);assert.equal(r.body.token,'ephemeral-token');assert.equal(JSON.stringify(r).includes('server-only-secret'),false);assert.equal(request.opts.headers['x-goog-api-key'],'server-only-secret');assert.ok(request.opts.signal);assert.equal(JSON.parse(request.opts.body).uses,1);assert.match(r.headers['Cache-Control'],/no-store/);
});
test('probe does not return ephemeral token; missing key and invalid methods fail clearly',async()=>{
 const r=await run({method:'GET',probe:true});assert.equal(r.status,200);assert.equal(r.body.tokenIssuance,true);assert.equal(JSON.stringify(r).includes('ephemeral-token'),false);assert.equal((await run({key:''})).status,503);assert.equal((await run({method:'DELETE'})).status,405);
});
test('upstream failures and exceptions do not reflect raw secrets to logs or clients',async()=>{
 const r=await run({fetchImpl:async()=>({ok:false,status:403,text:async()=>'{"error":{"message":"server-only-secret","status":"PERMISSION_DENIED"}}'})});assert.equal(r.status,502);assert.equal(JSON.stringify(r).includes('server-only-secret'),false);
 const timeout=await run({fetchImpl:async()=>{throw Error('server-only-secret')}});assert.equal(timeout.status,500);assert.equal(JSON.stringify(timeout).includes('server-only-secret'),false);
});
