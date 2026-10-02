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
const DIAGRAMS={
 fracao:'Fração em barra',pizza:'Fração em pizza',colecao:'Coleção de objetos',formas_geometricas:'Formas geométricas',relogio:'Relógio',
 reta_numerica:'Reta numérica',plano_cartesiano:'Plano cartesiano',comparacao:'Comparação',venn:'Diagrama de Venn',
 fluxo:'Fluxo',ciclo:'Ciclo',linha_do_tempo:'Linha do tempo',mapa_conceitual:'Mapa conceitual',triangulo_retangulo:'Triângulo retângulo',
 celula:'Célula',atomo:'Átomo',sistema_solar:'Sistema solar',circuito_eletrico:'Circuito elétrico',forcas:'Diagrama de forças',onda:'Onda'
};
const declaration={name:'atualizar_lousa',description:'Escreve uma anotação curta, desenha um diagrama pedagógico ou estrutura química, resolve uma proporção ou destaca parte de um desenho. Retorna imediatamente quando a ação é aceita na fila; a apresentação acontece aos poucos junto ao áudio. Use antes de explicar cada conceito, sem transcrever toda a fala. Reutilize id para corrigir um bloco.',parameters:{type:'OBJECT',properties:{
 action:{type:'STRING',enum:['anotar','diagrama','molecula','destacar','estrutura','estequiometria','regra_de_tres']},
 a:{type:'NUMBER',description:'Regra de três: valor superior esquerdo.'},b:{type:'NUMBER',description:'Valor superior direito.'},c:{type:'NUMBER',description:'Valor inferior esquerdo; x fica à direita.'},
 direction:{type:'STRING',enum:['horizontal','vertical'],description:'Direção das setas; omita para escolher o fator mais simples. Horizontal apenas para proporção direta.'},
 relation:{type:'STRING',enum:['direta','inversa']},leftUnit:{type:'STRING'},rightUnit:{type:'STRING'},leftLabel:{type:'STRING'},rightLabel:{type:'STRING'},
 id:{type:'STRING',description:'Identificador curto único do bloco. Reutilize para corrigir; ex. cetona-1.'},
 text:{type:'STRING',description:'Anotação em português revisado, até 240 caracteres; use símbolos Unicode em fórmulas, sem Markdown.'},
 kind:{type:'STRING',enum:Object.keys(KINDS)},
 diagram:{type:'STRING',enum:Object.keys(DIAGRAMS),description:'Diagrama pedagógico seguro e determinístico.'},
 labels:{type:'ARRAY',items:{type:'STRING'},description:'Rótulos curtos do diagrama. Em fluxo ou ciclo, use de 2 a 6 etapas.'},
    values:{type:'ARRAY',items:{type:'NUMBER'},description:'Valores do diagrama. Pizza ou fração: [numerador,denominador]. Coleção: [destacados,total]. Relógio: [hora,minuto]. Reta: [mínimo,máximo,pontos...]. Comparação: um valor por rótulo.'},
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
 if(!args||typeof args!=='object'||!['anotar','diagrama','molecula','destacar','estrutura','estequiometria','regra_de_tres'].includes(args.action))throw Error('Ação inválida');
 if(typeof args.id!=='string'||! /^[a-zA-Z0-9_-]{1,64}$/.test(args.id))throw Error('id inválido');
 if(args.action==='regra_de_tres')return {...args,...root.VaiBemChem.ruleOfThree(args)};
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
 if(args.action==='diagrama'){
  if(!Object.hasOwn(DIAGRAMS,args.diagram))throw Error('Tipo de diagrama inválido');
  if(typeof args.title!=='string'||!args.title.trim()||args.title.length>100)throw Error('Informe um título de até 100 caracteres');
  if(args.labels!==undefined&&!Array.isArray(args.labels))throw Error('Rótulos do diagrama inválidos');
  if(args.values!==undefined&&!Array.isArray(args.values))throw Error('Valores do diagrama inválidos');
  const labels=(args.labels||[]).map(value=>String(value).trim());
  const values=args.values||[];
  if(labels.length>8||labels.some(value=>!value||value.length>40))throw Error('Use até 8 rótulos de 1 a 40 caracteres');
  if(values.length>10||values.some(value=>typeof value!=='number'||!Number.isFinite(value)||Math.abs(value)>1e9))throw Error('Valores do diagrama inválidos');
  if(['fracao','pizza'].includes(args.diagram)&&!(values.length===2&&Number.isInteger(values[0])&&Number.isInteger(values[1])&&values[0]>=0&&values[1]>=1&&values[1]<=12&&values[0]<=values[1]))throw Error('Fração exige numerador e denominador inteiros, com denominador de 1 a 12');
  if(args.diagram==='colecao'&&!(values.length===2&&Number.isInteger(values[0])&&Number.isInteger(values[1])&&values[0]>=0&&values[1]>=1&&values[1]<=24&&values[0]<=values[1]))throw Error('Coleção exige destacados e total inteiros, com total de 1 a 24');
  if(args.diagram==='relogio'&&!(values.length===2&&Number.isInteger(values[0])&&Number.isInteger(values[1])&&values[0]>=0&&values[0]<=23&&values[1]>=0&&values[1]<=59))throw Error('Relógio exige hora de 0 a 23 e minuto de 0 a 59');
  if(args.diagram==='reta_numerica'&&!(values.length>=2&&values[0]<values[1]&&values.slice(2).every(value=>value>=values[0]&&value<=values[1])))throw Error('Reta numérica exige mínimo, máximo e pontos dentro do intervalo');
  if(args.diagram==='comparacao'&&!(labels.length>=2&&labels.length<=4&&values.length===labels.length&&values.every(value=>value>=0)))throw Error('Comparação exige de 2 a 4 rótulos e um valor não negativo para cada um');
  if(['fluxo','ciclo'].includes(args.diagram)&&!(labels.length>=2&&labels.length<=6))throw Error('Fluxo ou ciclo exige de 2 a 6 etapas');
  if(['venn','linha_do_tempo','mapa_conceitual'].includes(args.diagram)&&!(labels.length>=2&&labels.length<=6))throw Error('Esse diagrama exige de 2 a 6 rótulos');
  if(args.diagram==='linha_do_tempo'&&values.length&&values.length!==labels.length)throw Error('Linha do tempo exige um valor por rótulo ou nenhum valor');
  if(args.diagram==='plano_cartesiano'&&!(values.length>=2&&values.length<=8&&values.length%2===0))throw Error('Plano cartesiano exige pares x e y, até quatro pontos');
  if(args.diagram==='atomo'&&values.length&&!(values.length===2&&values.every(value=>Number.isInteger(value)&&value>=0&&value<=18)))throw Error('Átomo aceita [prótons,elétrons], de 0 a 18');
  if(args.diagram==='onda'&&values.length&&!(values.length===2&&values[0]>0&&values[0]<=5&&values[1]>=1&&values[1]<=4))throw Error('Onda aceita [amplitude,ciclos] dentro dos limites didáticos');
  if(args.diagram==='triangulo_retangulo'&&labels.length>3)throw Error('Triângulo aceita até 3 rótulos');
  return {action:args.action,id:args.id,diagram:args.diagram,title:args.title.trim(),labels,values};
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
 proportion(args,callId,exerciseId){
  const data=root.VaiBemChem.ruleOfThree(args),old=this.blocks.get(args.id),signature=JSON.stringify(data);
  if(old?.signature===signature)return data;
  if(old){old.element.remove();this.items=this.items.filter(x=>x!==old)}
  this.toolTurns.add(this.turn);this.removeFallback(this.turn);
  const element=document.createElement('section');element.className='board-stoich board-proportion';element.hidden=true;
  const make=(tag,cls,text,parent=element)=>{const el=document.createElement(tag);el.className=cls;if(text!==undefined)el.textContent=text;parent.appendChild(el);return el};
  make('h3','','Regra de três · '+data.relation);
  const steps=[],step=el=>{el.style.opacity='0';steps.push(el);return el},f=root.VaiBemChem.fmt;
  const diagram=parent=>{
   const grid=make('div','proportion-grid',undefined,parent);
   if(data.leftLabel||data.rightLabel){const labels=make('div','proportion-row proportion-labels',undefined,grid);make('span','',data.leftLabel,labels);make('span','','',labels);make('span','',data.rightLabel,labels)}
   for(const [left,right]of [[f(data.a)+' '+data.leftUnit,f(data.b)+' '+data.rightUnit],[f(data.c)+' '+data.leftUnit,'x '+data.rightUnit]]){const row=step(make('div','proportion-row',undefined,grid));make('span','',left.trim(),row);make('span','proportion-stroke','',row);make('span','',right.trim(),row)}
   return grid;
  };
  diagram(element);
  const cross=step(make('div','proportion-cross',data.relation==='direta'?f(data.a)+'x = '+f(data.c)+' × '+f(data.b):f(data.c)+'x = '+f(data.a)+' × '+f(data.b)));
  const equation=make('div','proportion-equation');const fraction=step(make('span','proportion-expression',undefined,equation));make('span','','x =',fraction);
  const stacked=make('span','proportion-fraction',undefined,fraction);make('span','proportion-numerator',data.numerator.map(f).join(' × '),stacked);make('span','proportion-denominator',f(data.denominator),stacked);
  make('span','proportion-answer','⇒ x = '+f(data.answer)+' '+data.rightUnit,step(make('span','',undefined,equation)));
  const horizontal=data.direction==='horizontal';const factors=make('div','proportion-factors'+(horizontal?' proportion-horizontal':''));diagram(factors);
  for(const [side,operation]of [['left','×'],['right',data.relation==='direta'?'×':'÷']]){
   const arrow=step(make('div','proportion-factor proportion-factor-'+side,undefined,factors));
   make('span','',(horizontal&&data.horizontalFactor<1?'÷':operation)+' '+f(horizontal?(data.horizontalFactor<1?1/data.horizontalFactor:data.horizontalFactor):data.factor),arrow);
   const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox',horizontal?'0 0 300 55':'0 0 40 90');svg.setAttribute('aria-hidden','true');
   const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',horizontal?(side==='left'?'M10 48 Q145 -30 290 48 M275 34 L290 48 L271 49':'M10 7 Q145 85 290 7 M274 7 L290 7 L281 23'):side==='left'?'M32 5 C4 20 4 62 32 80 M20 79 L32 80 L29 67':'M8 5 C36 20 36 62 8 80 M20 79 L8 80 L11 67');svg.appendChild(path);arrow.appendChild(svg);
  }
  this.container.appendChild(element);const item={id:args.id,exerciseId,element,steps,shown:0,callId,signature,pace:1.2};this.blocks.set(args.id,item);this.enqueue(item);return data;
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
  if(stage.key==='regra_de_tres'){const c=data.calculation;this.proportion({id,a:c.baseGiven,b:c.baseTarget,c:c.amount,leftUnit:c.givenUnit,rightUnit:c.targetUnit,leftLabel:root.VaiBemChem.sub(c.given),rightLabel:root.VaiBemChem.sub(c.target)},callId,args.id)}
  else if(!this.blocks.has(id)){
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
  if(args.action==='regra_de_tres'){const result={ok:true,status:'enfileirado',id:args.id,calculation:this.proportion(args,callId)};if(callId)this.calls.set(callId,result);return result}
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
  else if(args.action==='diagrama'){
   const old=this.blocks.get(args.id);if(old){old.element.remove();this.items=this.items.filter(x=>x.id!==args.id)}
   const element=document.createElement('figure');element.className='board-figure board-diagram';element.hidden=true;
   const caption=document.createElement('figcaption');caption.textContent=args.title;
   const {svg,steps}=drawDiagram(args);element.append(caption,svg);this.container.appendChild(element);
   const item={...args,element,steps,shown:0,callId};this.blocks.set(args.id,item);this.enqueue(item);
  }
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
  const rate=item.pace|| (item.words?Math.max(3,Math.min(6,units/remaining)):item.action==='estrutura'?Math.max(5,Math.min(24,units/remaining)):3);
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
function drawDiagram(args){
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg'),steps=[];
 svg.setAttribute('viewBox','0 0 640 300');svg.setAttribute('role','img');svg.setAttribute('aria-label',args.title);
 const make=(tag,attrs={},text)=>{const el=document.createElementNS(ns,tag);for(const [key,value]of Object.entries(attrs))el.setAttribute(key,String(value));if(text!==undefined)el.textContent=String(text);el.style.opacity='0';svg.appendChild(el);steps.push(el);return el};
 const text=(x,y,value,anchor='middle',cls='diagram-text')=>make('text',{x,y,'text-anchor':anchor,'dominant-baseline':'middle',class:cls},value);
 const line=(x1,y1,x2,y2,cls='diagram-line')=>make('line',{x1,y1,x2,y2,class:cls});
 const path=(d,cls='diagram-line')=>make('path',{d,class:cls});
 const polar=(cx,cy,r,angle)=>({x:cx+Math.cos(angle)*r,y:cy+Math.sin(angle)*r});
 const arrow=(x1,y1,x2,y2)=>{line(x1,y1,x2,y2,'diagram-line diagram-arrow');const angle=Math.atan2(y2-y1,x2-x1),size=11;line(x2,y2,x2-size*Math.cos(angle-.55),y2-size*Math.sin(angle-.55),'diagram-line');line(x2,y2,x2-size*Math.cos(angle+.55),y2-size*Math.sin(angle+.55),'diagram-line')};
 if(args.diagram==='fracao'){
  const [numerator,denominator]=args.values,width=440,height=115,startX=100,startY=90,cell=width/denominator;
  for(let index=0;index<denominator;index++){make('rect',{x:startX+index*cell,y:startY,width:cell,height,rx:5,class:index<numerator?'diagram-fill':'diagram-shape'});}
  text(320,238,`${numerator}/${denominator}`,'middle','diagram-equation');
 }else if(args.diagram==='pizza'){
  const [numerator,denominator]=args.values,cx=320,cy=138,r=105;
  if(denominator===1)make('circle',{cx,cy,r,class:numerator?'diagram-pizza-full':'diagram-pizza-empty'});
  else for(let index=0;index<denominator;index++){
   const start=-Math.PI/2+index*2*Math.PI/denominator,end=-Math.PI/2+(index+1)*2*Math.PI/denominator,a=polar(cx,cy,r,start),b=polar(cx,cy,r,end),large=end-start>Math.PI?1:0;
   path(`M ${cx} ${cy} L ${a.x} ${a.y} A ${r} ${r} 0 ${large} 1 ${b.x} ${b.y} Z`,index<numerator?'diagram-pizza-full':'diagram-pizza-empty');
   if(index<numerator){const topping=polar(cx,cy,r*.56,(start+end)/2);make('circle',{cx:topping.x,cy:topping.y,r:7,class:'diagram-topping'});}
  }
  make('circle',{cx,cy,r,class:'diagram-crust'});text(320,270,`${numerator}/${denominator} da pizza`,'middle','diagram-equation');
 }else if(args.diagram==='colecao'){
  const [highlighted,total]=args.values,columns=Math.min(8,Math.ceil(Math.sqrt(total))),gapX=500/columns,rows=Math.ceil(total/columns),gapY=Math.min(72,155/Math.max(1,rows-1));
  for(let index=0;index<total;index++){
   const row=Math.floor(index/columns),column=index%columns,count=Math.min(columns,total-row*columns),offset=(columns-count)*gapX/2,x=70+offset+column*gapX+gapX/2,y=70+row*gapY;
   make('circle',{cx:x,cy:y,r:22,class:index<highlighted?'diagram-object-active':'diagram-object'});path(`M ${x} ${y-22} Q ${x+10} ${y-38} ${x+22} ${y-28}`,'diagram-leaf');
  }
  text(320,260,`${highlighted} de ${total} ${args.labels[0]||'objetos'}`,'middle','diagram-equation');
 }else if(args.diagram==='formas_geometricas'){
  const labels=args.labels.length?args.labels:['círculo','triângulo','quadrado','hexágono'];
  make('circle',{cx:105,cy:140,r:55,class:'diagram-color-a'});make('polygon',{points:'235,195 290,85 345,195',class:'diagram-color-b'});make('rect',{x:390,y:88,width:106,height:106,rx:5,class:'diagram-color-c'});make('polygon',{points:'545,86 590,112 590,166 545,192 500,166 500,112',class:'diagram-color-d'});
  [105,290,443,545].forEach((x,index)=>text(x,235,labels[index]||['círculo','triângulo','quadrado','hexágono'][index]));
 }else if(args.diagram==='relogio'){
  const [hour,minute]=args.values,cx=320,cy=143,r=108;
  make('circle',{cx,cy,r,class:'diagram-clock'});for(let value=1;value<=12;value++){const point=polar(cx,cy,r-22,-Math.PI/2+value*2*Math.PI/12);text(point.x,point.y,value)}
  const minutePoint=polar(cx,cy,r-30,-Math.PI/2+minute*2*Math.PI/60),hourPoint=polar(cx,cy,r-55,-Math.PI/2+((hour%12)+minute/60)*2*Math.PI/12);
  line(cx,cy,hourPoint.x,hourPoint.y,'diagram-hand diagram-hour');line(cx,cy,minutePoint.x,minutePoint.y,'diagram-hand diagram-minute');make('circle',{cx,cy,r:7,class:'diagram-point'});text(320,278,`${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`,'middle','diagram-equation');
 }else if(args.diagram==='reta_numerica'){
  const [min,max,...marks]=args.values,startX=70,endX=570,y=152;arrow(startX,y,endX,y);
  const divisions=8;for(let index=0;index<=divisions;index++){const x=startX+(endX-startX)*index/divisions;line(x,y-10,x,y+10);if(index===0||index===divisions)text(x,y+31,index===0?min:max)}
  for(const value of marks){const x=startX+(value-min)/(max-min)*(endX-startX);make('circle',{cx:x,cy:y,r:9,class:'diagram-point'});text(x,y-28,value)}
 }else if(args.diagram==='plano_cartesiano'){
  const cx=320,cy=150;arrow(65,cy,585,cy);arrow(cx,265,cx,35);text(590,cy-16,'x');text(cx+18,28,'y');
  for(let index=0;index<args.values.length;index+=2){const x=args.values[index],y=args.values[index+1],px=cx+x*42,py=cy-y*42;line(px,cy,px,py,'diagram-guide');line(cx,py,px,py,'diagram-guide');make('circle',{cx:px,cy:py,r:8,class:'diagram-point'});text(px+14,py-15,args.labels[index/2]||`(${x}, ${y})`,'start');}
 }else if(args.diagram==='comparacao'){
  const max=Math.max(...args.values,1),slot=500/args.values.length;
  args.values.forEach((value,index)=>{const height=150*value/max,x=75+index*slot,y=225-height;make('rect',{x,y,width:Math.min(78,slot-22),height,rx:7,class:'diagram-fill'});text(x+Math.min(78,slot-22)/2,y-16,value);text(x+Math.min(78,slot-22)/2,252,args.labels[index])});
 }else if(args.diagram==='venn'){
  const labels=args.labels,cx=labels.length===3?[260,380,320]:[270,370],cy=labels.length===3?[125,125,190]:[150,150];
  labels.forEach((label,index)=>{make('circle',{cx:cx[index],cy:cy[index],r:90,class:`diagram-venn diagram-venn-${index+1}`});text(cx[index]+(index===0?-45:index===1?45:0),cy[index]+(index===2?48:-48),label);});
 }else if(args.diagram==='triangulo_retangulo'){
  line(135,230,500,230);line(135,230,135,55);line(135,55,500,230);line(135,205,160,205);line(160,205,160,230);
  text(300,252,args.labels[0]||'base');text(105,145,args.labels[1]||'altura');text(335,122,args.labels[2]||'hipotenusa');
 }else if(args.diagram==='fluxo'){
  const count=args.labels.length,gap=500/(count-1);args.labels.forEach((label,index)=>{const x=70+index*gap;if(index)arrow(x-gap+70,150,x-70,150);make('rect',{x:x-66,y:112,width:132,height:76,rx:14,class:'diagram-shape'});text(x,150,label)});
 }else if(args.diagram==='ciclo'){
  const count=args.labels.length,cx=320,cy=150,radius=102,points=args.labels.map((_,index)=>{const angle=-Math.PI/2+index*2*Math.PI/count;return {x:cx+Math.cos(angle)*radius,y:cy+Math.sin(angle)*radius}});
  points.forEach((point,index)=>{const next=points[(index+1)%count];arrow(point.x,point.y,next.x,next.y);make('circle',{cx:point.x,cy:point.y,r:38,class:'diagram-shape'});text(point.x,point.y,args.labels[index])});
 }else if(args.diagram==='linha_do_tempo'){
  const count=args.labels.length,startX=75,endX=565,y=150;line(startX,y,endX,y,'diagram-line timeline-line');args.labels.forEach((label,index)=>{const x=count===1?320:startX+index*(endX-startX)/(count-1);make('circle',{cx:x,cy:y,r:10,class:'diagram-point'});line(x,y-16,x,y+16);text(x,index%2?205:92,args.values[index]??label);if(args.values.length)text(x,index%2?235:62,label);});
 }else if(args.diagram==='mapa_conceitual'){
  const [center,...nodes]=args.labels,cx=320,cy=150,radius=108;make('ellipse',{cx,cy,rx:80,ry:42,class:'diagram-concept-center'});text(cx,cy,center);nodes.forEach((label,index)=>{const angle=-Math.PI/2+index*2*Math.PI/nodes.length,point=polar(cx,cy,radius,angle),edge=polar(cx,cy,70,angle);line(edge.x,edge.y,point.x,point.y,'diagram-line');make('ellipse',{cx:point.x,cy:point.y,rx:64,ry:31,class:'diagram-shape'});text(point.x,point.y,label);});
 }else if(args.diagram==='celula'){
  const labels=args.labels.length?args.labels:['membrana','citoplasma','núcleo','mitocôndria'];make('ellipse',{cx:320,cy:145,rx:220,ry:112,class:'diagram-cell'});make('circle',{cx:325,cy:142,r:48,class:'diagram-nucleus'});make('circle',{cx:325,cy:142,r:18,class:'diagram-nucleolus'});path('M 185 120 C 210 85 255 95 246 129 C 235 166 194 165 185 120 Z','diagram-organelle');path('M 395 176 C 423 139 472 151 461 187 C 448 220 407 214 395 176 Z','diagram-organelle');make('ellipse',{cx:415,cy:92,rx:24,ry:14,class:'diagram-vesicle'});
  text(92,72,labels[0]||'membrana','start');line(178,82,112,76,'diagram-guide');text(92,245,labels[1]||'citoplasma','start');line(195,212,112,238,'diagram-guide');text(505,65,labels[2]||'núcleo','start');line(367,112,498,72,'diagram-guide');text(505,230,labels[3]||'mitocôndria','start');line(450,195,498,222,'diagram-guide');
 }else if(args.diagram==='atomo'){
  const protons=args.values[0]??6,electrons=args.values[1]??6,cx=320,cy=145;make('circle',{cx,cy,r:40,class:'diagram-nucleus'});text(cx,cy,`${protons} p⁺`);[0,60,-60].forEach(angle=>make('ellipse',{cx,cy,rx:155,ry:62,transform:`rotate(${angle} ${cx} ${cy})`,class:'diagram-orbit'}));for(let index=0;index<Math.min(electrons,12);index++){const angle=index*2*Math.PI/Math.min(electrons,12),point=polar(cx,cy,index%3===0?155:112,angle);make('circle',{cx:point.x,cy:point.y,r:8,class:'diagram-electron'});}text(320,276,`${protons} prótons · ${electrons} elétrons`,'middle','diagram-equation');
 }else if(args.diagram==='sistema_solar'){
  const labels=args.labels.length?args.labels:['Sol','Mercúrio','Vênus','Terra','Marte','Júpiter'],planetCount=labels.length-1;make('circle',{cx:82,cy:150,r:48,class:'diagram-sun'});text(82,220,labels[0]);const sizes=[8,12,13,10,24,20,18];for(let index=1;index<labels.length;index++){const x=planetCount===1?330:150+(index-1)*420/(planetCount-1);make('circle',{cx:x,cy:150,r:sizes[index]||10,class:`diagram-planet diagram-planet-${index}`});text(x,198,labels[index]);}
 }else if(args.diagram==='circuito_eletrico'){
  path('M 120 90 H 480 V 220 H 120 V 90','diagram-wire');line(105,125,105,185,'diagram-line');line(125,112,125,198,'diagram-line');text(82,155,args.labels[0]||'pilha','end');make('circle',{cx:480,cy:150,r:42,class:'diagram-lamp'});path('M 455 150 Q 480 118 505 150 Q 480 182 455 150','diagram-filament');line(245,220,295,190,'diagram-switch');line(295,220,345,220,'diagram-wire');text(292,258,args.labels[2]||'interruptor');text(535,150,args.labels[1]||'lâmpada','start');
 }else if(args.diagram==='forcas'){
  make('rect',{x:245,y:105,width:150,height:90,rx:10,class:'diagram-color-c'});text(320,150,'corpo');const labels=args.labels.length?args.labels:['normal','peso','força','atrito'];arrow(320,105,320,35);text(334,48,labels[0],'start');arrow(320,195,320,270);text(334,258,labels[1],'start');arrow(395,150,555,150);text(475,130,labels[2]);arrow(245,150,85,150);text(165,130,labels[3]);
 }else if(args.diagram==='onda'){
  const amplitude=(args.values[0]??2)*24,cycles=args.values[1]??2,startX=65,endX=575,mid=150,segments=cycles*2,width=(endX-startX)/segments;line(startX,mid,endX,mid,'diagram-guide');let d=`M ${startX} ${mid}`;for(let index=0;index<segments;index++){const x1=startX+index*width,x2=x1+width,peak=index%2===0?mid-amplitude:mid+amplitude;d+=` Q ${x1+width/2} ${peak} ${x2} ${mid}`;}path(d,'diagram-wave');arrow(110,mid,110,mid-amplitude);text(122,mid-amplitude/2,'amplitude','start');line(190,242,190+2*width,242,'diagram-line');text(190+width,265,'comprimento de onda');
 }
 return {svg,steps};
}
const api={Board,declaration,validate,MOLECULES,DIAGRAMS};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.VaiBemBoard=api;
})(typeof window!=='undefined'?window:globalThis);
