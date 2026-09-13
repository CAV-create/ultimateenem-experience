const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../vai-bem-v2.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
function app(){
  const elements=new Map();
  const ctx=vm.createContext({Blob,ArrayBuffer,TextDecoder,console:{error(){}},document:{querySelector(s){if(!elements.has(s))elements.set(s,{});return elements.get(s)}},window:{addEventListener(){}}});
  vm.runInContext(script,ctx);
  return ctx;
}
test('reproduces original Blob error; decodes all supported frame types',async()=>{
 const ctx=app(),json='{"setupComplete":{}}';
 assert.throws(()=>JSON.parse(new Blob([json])),SyntaxError);
 for(const data of [json,new Blob([json]),new TextEncoder().encode(json).buffer,new TextEncoder().encode(json)]){
  ctx.data=data;
  assert.equal(JSON.stringify(await vm.runInContext('decodeLiveMessage(data)',ctx)),json);
 }
 ctx.data='{invalid';
 await assert.rejects(vm.runInContext('decodeLiveMessage(data)',ctx));
});
test('Blob setupComplete reaches microphone startup',async()=>{
 const ctx=app();
 vm.runInContext('var micCalls=0; startMic=async()=>{micCalls++}; ws={}; connected=true; attachLiveMessages(ws);',ctx);
 ctx.frame=new Blob(['{"setupComplete":{}}']);
 await vm.runInContext('ws.onmessage({data:frame})',ctx);
 assert.equal(vm.runInContext('setupReady && micCalls===1',ctx),true);
});
test('slow Blob preserves order, invalid JSON does not poison queue, stale socket is ignored',async()=>{
 const ctx=app();let release;
 const first=new Blob(['{"id":1}']);first.text=()=>new Promise(r=>release=()=>r('{"id":1}'));
 ctx.first=first;
 vm.runInContext('var seen=[];handleServer=m=>seen.push(m.id);ws={};connected=true;attachLiveMessages(ws);var oldSocket=ws;',ctx);
 const pending=vm.runInContext('ws.onmessage({data:first});ws.onmessage({data:\'{"id":2}\'})',ctx);
 await new Promise(r=>setImmediate(r));release();await pending;
 await vm.runInContext('ws.onmessage({data:"invalid"});ws.onmessage({data:\'{"id":3}\'})',ctx);
 vm.runInContext('ws={}',ctx);
 await vm.runInContext('oldSocket.onmessage({data:\'{"id":4}\'})',ctx);
 assert.equal(vm.runInContext('JSON.stringify(seen)',ctx),'[1,2,3]');
});
