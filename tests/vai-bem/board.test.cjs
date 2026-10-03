const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Board,validate,MOLECULES,DIAGRAMS,COLORS,DRAW_KINDS}=require('../../vai-bem-board.js');
class Element{
 constructor(){this.children=[];this.style={};this.attributes={};this.classes=new Set();this.classList={add:s=>this.classes.add(s),toggle:(s,on)=>on?this.classes.add(s):this.classes.delete(s)};this.textContent=''}
 append(...els){for(const el of els){el.parent=this;this.children.push(el)}}
 appendChild(el){this.append(el)}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this)}
 replaceChildren(){this.children=[]}
 setAttribute(k,v){this.attributes[k]=v}
 getAttribute(k){return this.attributes[k]}
 querySelectorAll(){return this.children.flatMap(c=>[...(c.attributes['data-group']?[c]:[]),...c.querySelectorAll()])}
}
global.document={createElement:()=>new Element(),createElementNS:()=>new Element()};
function fixture(){let now=0;const audio={exists:true,running:true,time:0,start:0,end:12};const board=new Board({container:new Element(),status:new Element(),audio:()=>audio,now:()=>now,schedule:()=>1,cancel(){}});return {board,audio,advance(ms){for(let n=0;n<ms;n+=100){now+=100;audio.time+=.1;board.tick()}}}}
test('long text is paced by audio; turnComplete never dumps words',()=>{
 const {board,audio,advance}=fixture();board.transcript('Uma cetona possui uma carbonila ligada a dois grupos carbônicos. Observe a estrutura e compare os grupos laterais.');
 const item=board.items[0];assert.equal(item.content.textContent,'');advance(1000);assert.ok(item.shown>0&&item.shown<item.words.length);
 board.finish();const before=item.content.textContent;assert.equal(item.content.textContent,before);audio.running=false;advance(2000);assert.equal(item.content.textContent,before);
 audio.running=true;advance(14000);assert.equal(item.content.textContent,item.text);assert.equal(board.items.length,0);
});
test('interruption drops unseen words and does not resume on the next turn',()=>{
 const {board,advance}=fixture();board.transcript('Uma frase longa que não deve continuar depois que o aluno interromper a explicação.');advance(500);const item=board.items[0],partial=item.content.textContent;board.interrupt();advance(3000);assert.equal(item.content.textContent,partial);assert.equal(board.items.length,0);
 board.command({action:'anotar',id:'new',kind:'definicao',text:'Nova ideia.'},'new-call');advance(2000);assert.equal(board.blocks.get('new').content.textContent,'Nova ideia.');
});
test('tool notes replace transcript fallback; repeated calls are idempotent; corrections replace blocks',()=>{
 const {board}=fixture();board.transcript('Fala informal');const args={action:'anotar',id:'concept',kind:'definicao',text:'A carbonila contém C=O.'};board.command(args,'call');board.command(args,'call');assert.equal(board.container.children.length,1);assert.equal(board.items.length,1);board.transcript('Outra fala informal');assert.equal(board.items.length,1);board.command({...args,text:'A carbonila é o grupo C=O.'},'correction');assert.equal(board.container.children.length,1);assert.equal(board.items[0].text,'A carbonila é o grupo C=O.');
});
test('molecules draw incrementally; highlight validates the actual structure',()=>{
 const {board,advance}=fixture();board.command({action:'molecula',id:'mol',molecule:'acetona'},'draw');const mol=board.blocks.get('mol');assert.ok(mol.steps.every(x=>x.style.opacity==='0'));advance(500);assert.ok(mol.shown>0&&mol.shown<mol.steps.length);board.command({action:'destacar',id:'hl',target:'mol',group:'carbonila'},'highlight');advance(6000);assert.ok(mol.element.querySelectorAll().some(x=>x.classes.has('board-highlight')));assert.throws(()=>board.command({action:'destacar',id:'bad',target:'mol',group:'hidroxila'}));
});
test('cancelled tool commands never appear and clear removes all pending work',()=>{
 const {board,advance}=fixture();board.command({action:'molecula',id:'mol',molecule:'etanol'},'cancel');board.cancelCalls(['cancel']);advance(5000);assert.equal(board.container.children.length,0);board.command({action:'anotar',id:'a',kind:'titulo',text:'Título'},'a');board.clear();advance(5000);assert.equal(board.items.length,0);assert.equal(board.container.children.length,0);
});
test('unsupported structures and prototype keys are rejected',()=>{
 for(const molecule of ['benzene','__proto__','toString'])assert.throws(()=>validate({action:'molecula',id:'a',molecule}));assert.throws(()=>validate({action:'anotar',id:'a',kind:'formula',text:'x'.repeat(241)}));assert.equal(Object.keys(MOLECULES).length,7);
});
test('late transcription is still progressive after audio ends, even after a long tab suspension',()=>{
 const {board,audio,advance}=fixture();audio.time=15;board.transcript('A anotação chegou depois da fala mas ainda deve ser apresentada progressivamente.');board.finish();const item=board.items[0];advance(200);assert.ok(item.shown<item.words.length);advance(6000);assert.equal(item.content.textContent,item.text);
});
test('stoichiometry preparation is invisible, stages are repeatable, updates replace stale calculations',()=>{
 global.VaiBemChem=require('../../vai-bem-chem.js');const {board,advance}=fixture();
 const args={action:'estequiometria',id:'calc',stage:'preparar',reactants:['CaCO3'],products:['CaO','CO2'],given:'CaCO3',target:'CO2',amount:100,givenUnit:'g',targetUnit:'g'};
 assert.equal(board.command(args,'p').calculation.answer,44);assert.equal(board.items.length,0);
 board.command({action:'estequiometria',id:'calc',stage:'regra_de_tres'},'r');assert.equal(board.items.length,1);board.command({action:'estequiometria',id:'calc',stage:'regra_de_tres'},'r2');assert.equal(board.items.length,1);
 board.command({...args,stage:'resultado'},'same-inputs');assert.equal(board.container.children.length,2);
 assert.equal(board.command({...args,amount:200},'p2').calculation.answer,88);assert.equal(board.items.length,0);assert.equal(board.container.children.length,0);
 board.command({action:'estequiometria',id:'calc',stage:'resultado'},'result');advance(1000);assert.ok(board.items[0].shown>0);board.clear();assert.equal(board.exercises.size,0);assert.equal(board.items.length,0);
});
test('rule of three follows photo, paces fraction and arrows, replaces corrections and cancels',()=>{
 global.VaiBemChem=require('../../vai-bem-chem.js');const {board,advance}=fixture();
 const args={action:'regra_de_tres',id:'photo',a:40,b:300,c:400,leftUnit:'g',rightUnit:'mol'};
 const result=board.command(args,'photo-call');assert.equal(result.calculation.answer,3000);
 const item=board.blocks.get('photo');assert.equal(item.steps.length,9);assert.ok(item.steps.every(x=>x.style.opacity==='0'));
 advance(1000);assert.equal(item.shown,1);assert.equal(item.steps[2].style.opacity,'0');
 board.command(args,'repeat');assert.equal(board.container.children.length,1);
 board.command({...args,c:200},'correction');assert.equal(board.container.children.length,1);
 board.cancelCalls(['correction']);assert.equal(board.items.length,0);
});
test('safe diagrams validate inputs and draw incrementally',()=>{
 const {board,advance}=fixture();
 assert.deepEqual(Object.keys(DIAGRAMS),['fracao','pizza','colecao','formas_geometricas','relogio','reta_numerica','plano_cartesiano','comparacao','venn','fluxo','ciclo','linha_do_tempo','mapa_conceitual','triangulo_retangulo','celula','atomo','sistema_solar','circuito_eletrico','forcas','onda']);
 board.command({action:'diagrama',id:'fraction',diagram:'fracao',title:'Três quartos',values:[3,4],labels:[]},'diagram');
 const item=board.blocks.get('fraction');assert.equal(item.steps.length,5);assert.ok(item.steps.every(step=>step.style.opacity==='0'));
 advance(800);assert.ok(item.shown>0&&item.shown<item.steps.length);advance(3000);assert.equal(item.shown,item.steps.length);
 assert.throws(()=>validate({action:'diagrama',id:'bad',diagram:'fracao',title:'Erro',values:[5,4]}));
 assert.throws(()=>validate({action:'diagrama',id:'bad',diagram:'fluxo',title:'Erro',labels:'Dados'}));
});

test('visual toolkit draws concrete child-friendly and cross-subject illustrations',()=>{
 const {board}=fixture();
 const samples=[
  {id:'pizza',diagram:'pizza',title:'Pizza',values:[3,4],labels:['3/4']},
  {id:'objects',diagram:'colecao',title:'Frutas',values:[6,8],labels:['frutas']},
  {id:'clock',diagram:'relogio',title:'Horário',values:[2,30],labels:[]},
  {id:'cell',diagram:'celula',title:'Célula',values:[],labels:['membrana','citoplasma','núcleo','mitocôndria']},
  {id:'atom',diagram:'atomo',title:'Átomo',values:[6,6],labels:['núcleo','elétrons']},
  {id:'circuit',diagram:'circuito_eletrico',title:'Circuito',values:[],labels:['pilha','lâmpada','interruptor']},
 ];
 for(const sample of samples){board.command({action:'diagrama',...sample},sample.id);const item=board.blocks.get(sample.id);assert.ok(item.steps.length>=3);assert.ok(item.steps.every(step=>step.style.opacity==='0'));}
 assert.throws(()=>validate({action:'diagrama',id:'bad-pizza',diagram:'pizza',title:'Pizza',values:[9,4],labels:[]}));
 assert.throws(()=>validate({action:'diagrama',id:'bad-clock',diagram:'relogio',title:'Relógio',values:[10,75],labels:[]}));
});

test('pizza supports twelve slices and rejects a thirteenth slice',()=>{
 const {board}=fixture();
 board.command({action:'diagrama',id:'pizza-12',diagram:'pizza',title:'Cinco doze avos',values:[5,12],labels:['5/12']},'pizza-12');
 assert.equal(board.blocks.get('pizza-12').steps.length,19);
 assert.throws(()=>validate({action:'diagrama',id:'pizza-13',diagram:'pizza',title:'Treze partes',values:[5,13],labels:[]}));
});

test('tables, connected mind maps, infographics and summaries reveal by meaningful blocks',()=>{
 const {board}=fixture();
 board.command({action:'tabela',id:'verbs',title:'Tempos verbais',columns:['Tempo','Exemplo','Uso'],rows:[['Presente','Eu estudo.','Agora'],['Futuro','Eu estudarei.','Depois']],highlightRows:[2],palette:'turquesa'},'table');
 assert.equal(board.blocks.get('verbs').steps.length,3);
 const branches=Array.from({length:8},(_,index)=>({title:`Ramo ${index+1}`,details:['Ideia central','Relação importante','Exemplo curto','Cuidado frequente','Síntese'],color:COLORS[index]}));
 board.command({action:'mapa_mental',id:'water',title:'Ciclo da água',palette:'amarelo',branches},'map');
 assert.equal(board.blocks.get('water').steps.length,9);
 board.command({action:'infografico',id:'review',title:'Revisão em quatro passos',subtitle:'Do conceito à resposta.',layout:'fluxo',panels:[{title:'Observe',detail:'Localize as pistas.',cue:'Leia com atenção',color:'azul'},{title:'Relacione',detail:'Conecte ao conteúdo.',cue:'Ative a memória',color:'turquesa'},{title:'Resolva',detail:'Aplique em etapas.',cue:'Um passo por vez',color:'amarelo'},{title:'Confira',detail:'Volte ao comando.',cue:'Responda ao pedido',color:'verde'}]},'info');
 assert.equal(board.blocks.get('review').steps.length,4);
 board.command({action:'resumo',id:'summary',title:'Ciclo da água',bullets:['Evaporação transfere água para a atmosfera.','Condensação forma gotículas.','Precipitação devolve água à superfície.'],keyPhrase:'A água circula e muda de estado.',recallQuestion:'Qual mudança forma as nuvens?',palette:'turquesa'},'summary');
 assert.equal(board.blocks.get('summary').steps.length,5);
 assert.throws(()=>validate({action:'tabela',id:'bad-table',title:'Erro',columns:['A','B'],rows:[['uma célula']]}));
 assert.throws(()=>validate({action:'mapa_mental',id:'bad-map',title:'Erro',branches:[{title:'Único',details:['Só um ramo']}]}));
 assert.throws(()=>validate({action:'mapa_mental',id:'too-many',title:'Erro',branches:[...branches,{title:'Ramo 9',details:['Excesso']}]}));
 assert.throws(()=>validate({action:'infografico',id:'bad-info',title:'Erro',panels:[{title:'Único',detail:'Só um painel'}]}));
 assert.throws(()=>validate({action:'resumo',id:'bad-summary',title:'Erro',bullets:['Só uma ideia'],keyPhrase:'Frase.',recallQuestion:'Pergunta?'}));
 assert.deepEqual(COLORS,['azul','verde','amarelo','vermelho','roxo','laranja','turquesa','cinza']);
});

test('safe drawing grammar accepts normalized primitives and rejects raw paths',()=>{
 const {board}=fixture();
 board.command({action:'desenho',id:'scene',title:'Casa e árvore',elements:[{kind:'rect',x:10,y:40,width:30,height:35,color:'amarelo',filled:true},{kind:'triangle',points:[8,40,25,20,42,40],color:'vermelho',filled:true},{kind:'arrow',x:45,y:60,x2:70,y2:30,color:'azul'},{kind:'text',x:55,y:12,text:'Cenário',color:'roxo'}]},'drawing');
 assert.equal(board.blocks.get('scene').steps.length,6);
 assert.deepEqual(DRAW_KINDS,['circle','ellipse','rect','line','arrow','triangle','polygon','text']);
 assert.throws(()=>validate({action:'desenho',id:'raw',title:'Inseguro',elements:[{kind:'path',d:'M0 0'}]}));
 assert.throws(()=>validate({action:'desenho',id:'outside',title:'Fora',elements:[{kind:'line',x:-1,y:0,x2:10,y2:10}]}));
});
