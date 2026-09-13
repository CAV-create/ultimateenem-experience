const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Board,validate,MOLECULES}=require('../vai-bem-board.js');
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
