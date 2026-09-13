const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../vai-bem-v2.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
function app(){
  const elements=new Map();
  const ctx=vm.createContext({VaiBemChem:{ready:()=>Promise.resolve()},VaiBemBoard:require('../vai-bem-board.js'),performance:{now:()=>0},requestAnimationFrame:()=>1,cancelAnimationFrame(){},Blob,ArrayBuffer,TextDecoder,console:{error(){}},document:{querySelector(s){if(!elements.has(s))elements.set(s,{});return elements.get(s)}},window:{addEventListener(){}}});
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
test('microphone sends realtimeInput.audio PCM and can restart after cleanup',async()=>{
 const ctx=app();let stopped=0,closed=0;const sent=[];
 const node=()=>({connect(){},disconnect(){}});
 class AudioContext{
  constructor(){this.state='running';this.sampleRate=48000;this.destination={}}
  createMediaStreamSource(){return node()}
  createScriptProcessor(){return node()}
  createGain(){return {...node(),gain:{value:1}}}
  async close(){closed++;this.state='closed'}
 }
 ctx.window.AudioContext=AudioContext;
 ctx.navigator={mediaDevices:{getUserMedia:async()=>({getTracks:()=>[{stop(){stopped++}}]})}};
 ctx.WebSocket={OPEN:1};ctx.btoa=s=>Buffer.from(s,'binary').toString('base64');
 ctx.socket={readyState:1,send:s=>sent.push(JSON.parse(s))};
 vm.runInContext("$('#meterBar').style={};ws=socket;connected=true;setupReady=true",ctx);
 await vm.runInContext('startMic()',ctx);
 ctx.event={inputBuffer:{getChannelData:()=>new Float32Array(2048).fill(0.1)}};
 vm.runInContext('processor.onaudioprocess(event)',ctx);
 assert.equal(sent.length,1);
 assert.deepEqual(Object.keys(sent[0].realtimeInput),['audio']);
 assert.equal(sent[0].realtimeInput.audio.mimeType,'audio/pcm;rate=16000');
 assert.ok(Buffer.from(sent[0].realtimeInput.audio.data,'base64').length>0);
 await vm.runInContext('releaseSessionResources()',ctx);
 assert.equal(stopped,1);assert.equal(closed,1);
 assert.equal(vm.runInContext('micStarted===false && stream===null && inputCtx===null',ctx),true);
 vm.runInContext('connected=true;setupReady=true',ctx);
 await vm.runInContext('startMic()',ctx);
 assert.equal(vm.runInContext('micStarted',ctx),true);
 await vm.runInContext('releaseSessionResources()',ctx);
 assert.equal(stopped,2);assert.equal(closed,2);
});
