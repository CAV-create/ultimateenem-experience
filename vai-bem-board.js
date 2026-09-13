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
 action:{type:'STRING',enum:['anotar','molecula','destacar','estrutura','estequiometria']},
 id:{type:'STRING',description:'Identificador curto único do bloco. Reutilize para corrigir; ex. cetona-1.'},
 text:{type:'STRING',description:'Anotação em português revisado, até 240 caracteres; use símbolos Unicode em fórmulas, sem Markdown.'},
 kind:{type:'STRING',enum:Object.keys(KINDS)},
 molecule:{type:'STRING',enum:Object.keys(MOLECULES)},
 smiles:{type:'STRING',description:'SMILES da molécula real, até 1500 caracteres. Necessário em estrutura. Não use nomes como SMILES.'},
 title:{type:'STRING',description:'Nome da molécula ou título do exercício, até 100 caracteres.'},
 format:{type:'STRING',enum:['bastao','expandida'],description:'Bastão omite C e H ligados a C; expandida mostra hidrogênios explícitos.'},
 reactants:{type:'ARRAY',items:{type:'STRING'},description:'Fórmulas dos reagentes, sem coeficientes ou estados físicos. Ex.: [C2H6,O2]'},
 products:{type:'ARRAY',items:{type:'STRING'},description:'Fórmulas dos produtos. Ex.: [CO2,H2O]'},
 given:{type:'STRING',description:'Fórmula da espécie cuja quantidade é conhecida.'},
 target:{type:'STRING',description:'Para destacar: id do desenho. Para estequiometria: fórmula da espécie procurada.'},
 amount:{type:'NUMBER',description:'Quantidade conhecida, positiva.'},
 givenUnit:{type:'STRING',enum:['g','mol']},targetUnit:{type:'STRING',enum:['g','mol']},
 atomicMasses:{type:'ARRAY',items:{type:'OBJECT',properties:{element:{type:'STRING'},mass:{type:'NUMBER'}},required:['element','mass']},description:'Massas atômicas fornecidas no exercício; prevalecem sobre os valores escolares arredondados.'},
 stage:{type:'STRING',enum:['preparar','reacao','balanceamento','proporcao','massa_molar','regra_de_tres','resultado'],description:'Em estequiometria: preparar calcula e devolve tudo sem exibir; depois use mesmo id e uma etapa de cada vez. Reenvie os dados completos para modificar o exercício.'},
  group:{type:'STRING',enum:['carbonila','carboxila','hidroxila','laterais','dupla','aromatico','estrutura']}
},required:['action','id']}};
function validate(args){
 if(!args||typeof args!=='object'||!['anotar','molecula','destacar','estrutura','estequiometria'].includes(args.action))throw Error('Ação inválida');
 if(typeof args.id!=='string'||! /^[a-zA-Z0-9_-]{1,64}$/.test(args.id))throw Error('id inválido');
 if(args.action==='estrutura'){
  if(typeof args.smiles!=='string'||!args.smiles||args.smiles.length>1500)throw Error('Informe o SMILES da estrutura');
  if(!['bastao','expandida'].includes(args.format||'bastao'))throw Error('Formato inválido');
  if(typeof args.title!=='string'||!args.title.trim()||args.title.length>100)throw Error('Informe um nome de até 100 caracteres');
  return {action:args.action,id:args.id,smiles:args.smiles,title:args.title,format:args.format||'bastao'};
 }
 if(args.action==='estequiometria'){
  if(!['preparar','reacao','balanceamento','proporcao','massa_molar','regra_de_tres','resultado'].includes(args.stage))throw Error('Informe a etapa do exercício');
  return {...args};
 }
 if(args.action==='anotar'){
  if(typeof args.text!=='string'||!args.text.trim()||args.text.length>240)throw Error('Use uma anotação de 1 a 240 caracteres');
  if(!Object.hasOwn(KINDS,args.kind))throw Error('Tipo de anotação inválido');
  return {action:args.action,id:args.id,text:args.text.trim().replace(/\s+/g,' '),kind:args.kind};
 }
 if(args.action==='molecula'){
  if(!Object.hasOwn(MOLECULES,args.molecule))throw Error('Estrutura não disponível; use uma fórmula em anotar');
  return {action:args.action,id:args.id,molecule:args.molecule};
 }
 if(typeof args.target!=='string'||! /^[a-zA-Z0-9_-]{1,64}$/.test(args.target)||!['carbonila','carboxila','hidroxila','laterais','dupla','aromatico','estrutura'].includes(args.group))throw Error('Destaque inválido');
 return {action:args.action,id:args.id,target:args.target,group:args.group};
}
class Board{
 constructor({container,status,audio,now=()=>performance.now(),schedule=fn=>requestAnimationFrame(fn),cancel=id=>cancelAnimationFrame(id)}){
  Object.assign(this,{container,status,audio,now,schedule,cancel});this.epoch=0;this.exercises=new Map();this.items=[];this.blocks=new Map();this.calls=new Map();this.turn=1;this.toolTurns=new Set();this.closedTurns=new Set();this.lastTick=now();this.credit=0;this.frame=null;
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
 async commandAsync(raw,callId){
  const args=validate(raw);
  if(callId&&this.calls.has(callId))return this.calls.get(callId);
  if(args.action!=='estrutura')return this.command(args,callId);
  const epoch=this.epoch;
  const result=await root.VaiBemChem.molecule(args.smiles,args.format);
  if(epoch!==this.epoch)return {ok:false,status:'cancelado'};
  if(callId&&this.calls.has(callId))return this.calls.get(callId);
  if(this.items.length>=50)throw Error('Lousa ocupada; aguarde');
  this.toolTurns.add(this.turn);this.removeFallback(this.turn);
  const old=this.blocks.get(args.id);if(old){old.element.remove();this.items=this.items.filter(x=>x.id!==args.id)}
  const element=document.createElement('figure');element.className='board-figure board-rdkit';element.hidden=true;
  const caption=document.createElement('figcaption');caption.textContent=args.title+' · '+(args.format==='bastao'?'fórmula em bastão':'hidrogênios explícitos');
  const toolbar=document.createElement('div');toolbar.className='molecule-formats';
  const {svg,steps}=moleculeSvg(result,args.title);element.append(caption,toolbar,svg);
  const item={...args,element,steps,shown:0,groups:result.groups,callId};
  for(const [format,label]of [['bastao','Bastão'],['expandida','Com hidrogênios']]){
   const button=document.createElement('button');button.type='button';button.textContent=label;button.setAttribute('aria-pressed',String(args.format===format));
   button.onclick=async()=>{if(format===item.format)return;button.disabled=true;const epoch=this.epoch;
    try{const updated=await root.VaiBemChem.molecule(args.smiles,format);if(epoch!==this.epoch||this.blocks.get(args.id)!==item)return;
     const drawing=moleculeSvg(updated,args.title);const previous=item.shown;item.element.querySelector('svg')?.replaceWith(drawing.svg);
     item.steps=drawing.steps;item.groups=updated.groups;item.format=format;item.shown=Math.min(previous,item.steps.length);
     if(!this.items.includes(item))item.shown=item.steps.length;
     for(let i=0;i<item.shown;i++)item.steps[i].style.opacity='1';
     caption.textContent=args.title+' · '+(format==='bastao'?'fórmula em bastão':'hidrogênios explícitos');
     for(const b of toolbar.children)if(b!==zoom)b.setAttribute('aria-pressed',String(b.textContent===label));
    }catch(e){this.status.textContent=e.message}finally{button.disabled=false}
   };toolbar.appendChild(button);
  }
  const zoom=document.createElement('button');zoom.type='button';zoom.textContent='Ampliar';zoom.onclick=()=>{
   const dialog=document.createElement('dialog');dialog.className='molecule-dialog';
   const heading=document.createElement('h2');heading.textContent=args.title;
   const close=document.createElement('button');close.type='button';close.textContent='Fechar';close.onclick=()=>dialog.close();
   const label=document.createElement('label');label.textContent='Zoom ';const range=document.createElement('input');range.type='range';range.min='50';range.max='180';range.value='100';range.setAttribute('aria-label','Zoom da molécula');label.appendChild(range);
   const viewport=document.createElement('div');viewport.className='molecule-zoom-view';const large=item.element.querySelector('svg').cloneNode(true);for(const el of large.querySelectorAll('[data-group]'))el.style.opacity='1';large.style.width='700px';large.style.maxWidth='none';large.style.height='auto';viewport.appendChild(large);range.oninput=()=>large.style.width=(700*Number(range.value)/100)+'px';
   dialog.append(heading,close,label,viewport);dialog.addEventListener('close',()=>dialog.remove(),{once:true});document.body.appendChild(dialog);dialog.showModal();
  };toolbar.appendChild(zoom);
  this.container.appendChild(element);this.blocks.set(args.id,item);this.enqueue(item);
  const response={ok:true,status:'enfileirado',id:args.id,format:args.format,atoms:result.atomCount,canonicalSmiles:result.canonical,groups:['estrutura',...Object.keys(result.groups)]};
  if(callId)this.calls.set(callId,response);return response;
 }
 stoichiometry(args,callId){
  let data=this.exercises.get(args.id);
  if(args.reactants!==undefined||args.products!==undefined){
   const updated=root.VaiBemChem.exercise(args),changed=JSON.stringify(data)!==JSON.stringify(updated);data=updated;this.exercises.set(args.id,data);
   if(changed)for(const [id,item]of this.blocks)if(item.exerciseId===args.id){item.element.remove();this.blocks.delete(id);this.items=this.items.filter(x=>x!==item)}
  }
  if(!data)throw Error('Prepare primeiro a reação com reagentes e produtos');
  if(args.stage==='preparar')return {ok:true,status:'calculado',id:args.id,...data};
  const stage=data.stages.find(s=>s.key===args.stage);if(!stage)throw Error('Essa etapa requer quantidade conhecida e espécie procurada');
  const id=args.id+'-'+stage.key;
  if(!this.blocks.has(id)){
   this.toolTurns.add(this.turn);this.removeFallback(this.turn);
   const element=document.createElement('section');element.className='board-stoich';element.hidden=true;
   const heading=document.createElement('h3');heading.textContent=stage.title;element.appendChild(heading);
   if(stage.table){const table=document.createElement('table');const tr=document.createElement('tr');for(const t of stage.table.headers){const th=document.createElement('th');th.scope='col';th.textContent=t;tr.appendChild(th)}table.appendChild(tr);for(const row of stage.table.rows){const tr=document.createElement('tr');for(const t of row){const td=document.createElement('td');td.textContent=t;tr.appendChild(td)}table.appendChild(tr)}element.appendChild(table)}
   const content=document.createElement('div');content.className='stoich-lines';element.appendChild(content);this.container.appendChild(element);
   const text=stage.lines.join('\n');const item={id,exerciseId:args.id,element,content,text,words:text.match(/\S+\s*/g)||[],shown:0,callId};this.blocks.set(id,item);this.enqueue(item);
  }
  return {ok:true,status:'enfileirado',id:args.id,stage:stage.key,explanation:stage,calculation:data.calculation,atomicMasses:data.atomicMasses};
 }
 command(raw,callId){
  if(callId&&this.calls.has(callId))return this.calls.get(callId);
  const args=validate(raw);
  if(args.action==='estequiometria'){const result=this.stoichiometry(args,callId);if(callId)this.calls.set(callId,result);return result}
  if(args.action==='estrutura')throw Error('Use o carregamento assíncrono de estruturas');
  if(this.items.length>=50)throw Error('Lousa ocupada; aguarde antes de adicionar anotações');
  if(args.action==='destacar'){
   const block=this.blocks.get(args.target),spec=MOLECULES[block?.molecule];
   if(!spec&&!block?.groups)throw Error('Desenho não encontrado');
   const valid=block.groups?['estrutura',...Object.keys(block.groups)]:['estrutura','laterais',spec.group];if(spec?.oxygen)valid.push('carbonila');
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
  this.epoch++;
  for(const item of this.items){if(item.element){if(!item.shown){item.element.remove();this.blocks.delete(item.id)}else item.element.classList.add('board-partial')}}
  this.items=[];this.turn++;this.credit=0;if(this.frame!==null)this.cancel(this.frame);this.frame=null;this.status.textContent='Anotação pausada para ouvir você';
 }
 clear(){this.interrupt();this.container.replaceChildren();this.blocks.clear();this.exercises.clear();this.calls.clear();this.toolTurns.clear();this.closedTurns.clear();this.status.textContent='Folha limpa'}
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
  const rate=item.words?Math.max(3,Math.min(6,units/remaining)):item.action==='estrutura'?Math.max(5,Math.min(24,units/remaining)):3;
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
function moleculeSvg(result,title){
 const parsed=new DOMParser().parseFromString(result.svg,'image/svg+xml');
 if(parsed.querySelector('parsererror'))throw Error('Falha ao desenhar a molécula');
 const svg=document.importNode(parsed.documentElement,true);svg.setAttribute('role','img');svg.setAttribute('aria-label',title+' · '+result.format);
 // Only accept geometry from the bundled renderer; never accept executable SVG.
 const allowed=new Set(['svg','g','path','line','polygon','polyline','circle','ellipse','rect','text','tspan','defs','clipPath']);
 for(const el of [...svg.querySelectorAll('*')]){
  if(!allowed.has(el.localName)){el.remove();continue}
  for(const attr of [...el.attributes])if(/^on/i.test(attr.name)||/href/i.test(attr.name)||/url\((?!#)/i.test(attr.value))el.removeAttribute(attr.name);
 }
 const geometry=[...svg.querySelectorAll('path,line,polygon,polyline,circle,ellipse,text')];
 for(const el of geometry){const cls=el.getAttribute('class')||'';const atoms=[...cls.matchAll(/atom-(\d+)/g)].map(m=>Number(m[1])),bonds=[...cls.matchAll(/bond-(\d+)/g)].map(m=>Number(m[1]));const groups=['estrutura'];
  for(const [name,match]of Object.entries(result.groups))if((bonds.length?bonds.some(b=>match.bonds.includes(b)):atoms.some(a=>match.atoms.includes(a))))groups.push(name);
  el.setAttribute('data-group',groups.join(' '));el.setAttribute('data-kind',bonds.length?'bond':'atom');
 }
 // Reveal each bond/atom as a group; all paths of a letter appear together.
 const chunks=new Map();for(const el of geometry){const cls=el.getAttribute('class')||'';const key=/bond-\d+/.exec(cls)?.[0]||/atom-\d+/.exec(cls)?.[0]||'other';if(!chunks.has(key))chunks.set(key,[]);chunks.get(key).push(el);el.style.opacity='0'}
 const steps=[...chunks.values()].map(els=>({style:{set opacity(value){for(const el of els)el.style.opacity=value}}}));
 return {svg,steps};
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
