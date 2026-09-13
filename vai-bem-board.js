/* VAI BEM: local, bounded board commands. No generated HTML or code is executed. */
(function(root){
'use strict';
const MOLECULES={
 acetona:{title:'Acetona · propanona',left:'CH₃',right:'CH₃',oxygen:true,group:'carbonila'},
 cetona:{title:'Cetona · estrutura geral',left:'R',right:'R′',oxygen:true,group:'carbonila'},
 etanal:{title:'Etanal · aldeído',left:'CH₃',right:'H',oxygen:true,group:'carbonila'},
 aldeido:{title:'Aldeído · estrutura geral',left:'R',right:'H',oxygen:true,group:'carbonila'},
 acido_acetico:{title:'Ácido acético · etanoico',left:'CH₃',right:'OH',oxygen:true,group:'carboxila'},
 etanol:{title:'Etanol · álcool',left:'CH₃',center:'CH₂',right:'OH',group:'hidroxila'},
 eteno:{title:'Eteno · alceno',left:'CH₂',right:'CH₂',double:true,group:'dupla'}
};
const KINDS={titulo:'Conceito',definicao:'Definição',formula:'Fórmula',etapa:'Passo',exemplo:'Exemplo'};
const declaration={name:'atualizar_lousa',description:'Escreve uma anotação curta, desenha uma estrutura química disponível ou destaca parte de um desenho. Retorna imediatamente quando a ação é aceita na fila; a apresentação acontece aos poucos junto ao áudio. Use antes de explicar cada conceito, sem transcrever toda a fala. Reutilize id para corrigir uma anotação.',parameters:{type:'OBJECT',properties:{
 action:{type:'STRING',enum:['anotar','molecula','destacar']},
 id:{type:'STRING',description:'Identificador curto único do bloco. Reutilize para corrigir; ex. cetona-1.'},
 text:{type:'STRING',description:'Anotação em português revisado, até 240 caracteres; use símbolos Unicode em fórmulas, sem Markdown.'},
 kind:{type:'STRING',enum:Object.keys(KINDS)},
 molecule:{type:'STRING',enum:Object.keys(MOLECULES)},
 target:{type:'STRING',description:'id do desenho a destacar'},
 group:{type:'STRING',enum:['carbonila','carboxila','hidroxila','laterais','dupla','estrutura']}
},required:['action','id']}};
function validate(args){
 if(!args||typeof args!=='object'||!['anotar','molecula','destacar'].includes(args.action))throw Error('Ação inválida');
 if(typeof args.id!=='string'||! /^[a-zA-Z0-9_-]{1,64}$/.test(args.id))throw Error('id inválido');
 if(args.action==='anotar'){
  if(typeof args.text!=='string'||!args.text.trim()||args.text.length>240)throw Error('Use uma anotação de 1 a 240 caracteres');
  if(!Object.hasOwn(KINDS,args.kind))throw Error('Tipo de anotação inválido');
  return {action:args.action,id:args.id,text:args.text.trim().replace(/\s+/g,' '),kind:args.kind};
 }
 if(args.action==='molecula'){
  if(!Object.hasOwn(MOLECULES,args.molecule))throw Error('Estrutura não disponível; use uma fórmula em anotar');
  return {action:args.action,id:args.id,molecule:args.molecule};
 }
 if(typeof args.target!=='string'||! /^[a-zA-Z0-9_-]{1,64}$/.test(args.target)||!['carbonila','carboxila','hidroxila','laterais','dupla','estrutura'].includes(args.group))throw Error('Destaque inválido');
 return {action:args.action,id:args.id,target:args.target,group:args.group};
}
class Board{
 constructor({container,status,audio,now=()=>performance.now(),schedule=fn=>requestAnimationFrame(fn),cancel=id=>cancelAnimationFrame(id)}){
  Object.assign(this,{container,status,audio,now,schedule,cancel});this.items=[];this.blocks=new Map();this.calls=new Map();this.turn=1;this.toolTurns=new Set();this.closedTurns=new Set();this.lastTick=now();this.credit=0;this.frame=null;
 }
 wake(){if(this.frame===null)this.frame=this.schedule(()=>{this.frame=null;this.tick();if(this.items.length)this.wake()})}
 enqueue(item){item.turn=this.turn;item.created=this.now();this.items.push(item);this.wake();return item}
 note(args,callId){
  const old=this.blocks.get(args.id);
  if(old&&old.text===args.text&&old.kind===args.kind)return;
  if(old){this.items=this.items.filter(x=>x.id!==args.id);old.element.remove()}
  const element=document.createElement('div');element.className='board-note board-'+args.kind;
  const label=document.createElement('span');label.className='board-label';label.textContent=KINDS[args.kind]||'Anotação';
  const content=document.createElement('div');content.className='board-content';element.append(label,content);element.hidden=true;this.container.appendChild(element);
  const item={...args,element,content,words:args.text.match(/\S+\s*/g)||[],shown:0,callId};
  this.blocks.set(args.id,item);this.enqueue(item);
 }
 command(raw,callId){
  if(callId&&this.calls.has(callId))return this.calls.get(callId);
  const args=validate(raw);
  if(this.items.length>=50)throw Error('Lousa ocupada; aguarde antes de adicionar anotações');
  if(args.action==='destacar'){
   const block=this.blocks.get(args.target),spec=MOLECULES[block?.molecule];
   if(!spec)throw Error('Desenho não encontrado');
   const valid=['estrutura','laterais',spec.group];if(spec.oxygen)valid.push('carbonila');
   if(!valid.includes(args.group))throw Error('Grupo ausente nessa estrutura');
  }
  this.toolTurns.add(this.turn);this.removeFallback(this.turn);
  if(args.action==='anotar')this.note(args,callId);
  else if(args.action==='molecula'){
   const old=this.blocks.get(args.id);if(old){old.element.remove();this.items=this.items.filter(x=>x.id!==args.id)}
   const element=document.createElement('figure');element.className='board-figure';element.hidden=true;
   const caption=document.createElement('figcaption');caption.textContent=MOLECULES[args.molecule].title;
   const {svg,steps}=drawMolecule(args.molecule);element.append(caption,svg);this.container.appendChild(element);
   const item={...args,element,steps,shown:0,callId};this.blocks.set(args.id,item);this.enqueue(item);
  }else this.enqueue({...args,shown:0,callId});
  const result={ok:true,status:'enfileirado',id:args.id};
  if(args.action==='molecula')result.groups=['estrutura','laterais',MOLECULES[args.molecule].group,...(MOLECULES[args.molecule].oxygen?['carbonila']:[])];
  if(callId){this.calls.set(callId,result);if(this.calls.size>200)this.calls.delete(this.calls.keys().next().value)}
  return result;
 }
 removeFallback(turn){const id='transcript-'+turn,old=this.blocks.get(id);if(old){old.element.remove();this.blocks.delete(id)}this.items=this.items.filter(x=>x.id!==id)}
 transcript(text){
  if(this.toolTurns.has(this.turn)||!text.trim())return;
  const id='transcript-'+this.turn;let item=this.blocks.get(id);
  if(!item){this.note({action:'anotar',id,text,kind:'transcript'});item=this.blocks.get(id)}
  else{item.text=text;item.words=text.match(/\S+\s*/g)||[];if(!this.items.includes(item)){this.items.push(item);this.wake()}}
 }
 finish(){this.closedTurns.add(this.turn);this.turn++;this.wake()}
 cancelCalls(ids){for(const id of ids){this.calls.set(id,{ok:false,status:'cancelado'});this.items=this.items.filter(item=>{if(item.callId!==id)return true;if(item.element)item.element.remove();this.blocks.delete(item.id);return false})}}
 interrupt(){
  for(const item of this.items){if(item.element){if(!item.shown){item.element.remove();this.blocks.delete(item.id)}else item.element.classList.add('board-partial')}}
  this.items=[];this.turn++;this.credit=0;if(this.frame!==null)this.cancel(this.frame);this.frame=null;this.status.textContent='Anotação pausada para ouvir você';
 }
 clear(){this.interrupt();this.container.replaceChildren();this.blocks.clear();this.calls.clear();this.toolTurns.clear();this.closedTurns.clear();this.status.textContent='Folha limpa'}
 tick(){
  const now=this.now(),dt=Math.min(100,Math.max(0,now-this.lastTick));this.lastTick=now;
  const item=this.items[0];if(!item){this.credit=0;return}
  const audio=this.audio();
  // Never race ahead of scheduled audio or advance while AudioContext is suspended.
  const playing=audio.running&&audio.time>=audio.start&&audio.time<audio.end;
  const tail=this.closedTurns.has(item.turn)&&(!audio.exists||(audio.running&&audio.time>=audio.end));
  if(!playing&&!tail){this.credit=0;this.status.textContent='Aguardando a explicação';return}
  const units=item.words?item.words.length-item.shown:item.steps?item.steps.length-item.shown:1;
  const remaining=Math.max(1,audio.end-audio.time);
  const rate=item.words?Math.max(3,Math.min(6,units/remaining)):3;
  this.credit+=dt/1000*rate;
  if(this.credit<1)return;
  // At most two words per animation tick, including after tab suspension.
  const count=Math.min(item.words?2:1,Math.floor(this.credit));this.credit-=count;
  if(item.element)item.element.hidden=false;
  if(item.words){item.shown=Math.min(item.words.length,item.shown+count);item.content.textContent=item.words.slice(0,item.shown).join('').trimEnd()}
  else if(item.steps){for(let i=0;i<count&&item.shown<item.steps.length;i++)item.steps[item.shown++].style.opacity='1'}
  else{const block=this.blocks.get(item.target);if(block){for(const el of block.element.querySelectorAll('[data-group]')){const groups=el.getAttribute('data-group').split(' ');el.classList.toggle('board-highlight',item.group==='estrutura'||groups.includes(item.group))}}item.shown=1}
  this.status.textContent=tail?'Concluindo a anotação…':'Professor falando e escrevendo…';
  const total=item.words?item.words.length:item.steps?item.steps.length:1;
  if(item.shown>=total){this.items.shift();this.credit=0;if(!this.items.length)this.status.textContent='Explicação registrada'}
 }
}
function drawMolecule(name){
 const m=MOLECULES[name],ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
 svg.setAttribute('viewBox','0 0 440 190');svg.setAttribute('role','img');svg.setAttribute('aria-label',m.title);const steps=[];
 const make=(tag,attrs,text)=>{const el=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));if(text)el.textContent=text;el.style.opacity='0';svg.appendChild(el);steps.push(el);return el};
 const label=(x,y,text,group)=>make('text',{x,y,'text-anchor':'middle','dominant-baseline':'middle','data-group':group},text);
 const line=(x1,y1,x2,y2,group)=>make('line',{x1,y1,x2,y2,'data-group':group});
 if(m.double){label(130,110,m.left,'laterais');line(175,103,265,103,'dupla');line(175,117,265,117,'dupla');label(310,110,m.right,'laterais')}
 else{
  label(80,125,m.left,'laterais');line(120,125,185,125,'laterais');label(220,125,m.center||'C',m.oxygen?'carbonila carboxila':'estrutura');
  if(m.oxygen){line(214,96,214,62,'carbonila carboxila');line(226,96,226,62,'carbonila carboxila');label(220,38,'O','carbonila carboxila')}
  line(250,125,315,125,m.group==='carboxila'?'carboxila':'laterais');label(360,125,m.right,m.group==='hidroxila'?'hidroxila':m.group==='carboxila'?'carboxila':'laterais');
 }
 return {svg,steps};
}
const api={Board,declaration,validate,MOLECULES};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.VaiBemBoard=api;
})(typeof window!=='undefined'?window:globalThis);
