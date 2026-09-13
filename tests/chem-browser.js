(async()=>{
 const report=document.createElement('pre');report.id='chem-test-report';report.style='white-space:pre-wrap;background:#12351d;color:white;padding:12px;font:13px monospace';document.body.prepend(report);
 const results=[];const check=(condition,label)=>{if(!condition)throw Error(label);results.push(label);report.textContent=results.join('\n')};
 try{
  await VaiBemChem.ready();check(true,'RDKit carregado');
  // Synthetic playback clock exercises the same production board without microphone input.
  let time=0;board.audio=()=>({exists:true,running:true,time,start:0,end:10000});board.now=()=>time*1000;
  const advance=n=>{for(let i=0;i<n;i++){time+=.1;board.tick()}};
  const r=await board.commandAsync({action:'estrutura',id:'aspirin',title:'Aspirina',smiles:'CC(=O)Oc1ccccc1C(=O)O',format:'bastao'},'aspirin');
  check(r.ok&&r.atoms===13&&r.groups.includes('carbonila'),'Aspirina em bastão: 13 átomos e carbonila reconhecida');
  advance(4);check(board.blocks.get('aspirin').shown>0&&board.blocks.get('aspirin').shown<board.blocks.get('aspirin').steps.length,'Desenho progressivo');
  advance(300);board.command({action:'destacar',id:'h1',target:'aspirin',group:'carbonila'},'h1');advance(20);
  check(document.querySelectorAll('.board-rdkit .board-highlight').length>0,'Destaque de carbonila');
  const b=board.blocks.get('aspirin');const formatButtons=b.element.querySelectorAll('button');await formatButtons[1].onclick();
  check(b.format==='expandida'&&b.element.querySelector('svg'),'Troca para hidrogênios explícitos');
  await formatButtons[0].onclick();check(b.format==='bastao','Retorno ao bastão');
  const larger=await board.commandAsync({action:'estrutura',id:'ibuprofen',title:'Ibuprofeno',smiles:'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O',format:'bastao'},'ibu');advance(300);check(larger.ok&&larger.atoms===15,'Molécula ramificada com anel');
  const before=document.querySelectorAll('.board-rdkit').length;
  try{await board.commandAsync({action:'estrutura',id:'invalid',title:'Inválida',smiles:'C(C)(C)(C)(C)C',format:'bastao'},'bad');throw Error('Accepted invalid structure')}catch(e){check(document.querySelectorAll('.board-rdkit').length===before&&e.message!=='Accepted invalid structure','Valência inválida rejeitada sem desenho falso')}
  const data=board.command({action:'estequiometria',id:'calc',stage:'preparar',reactants:['C2H6','O2'],products:['CO2','H2O'],given:'C2H6',target:'CO2',amount:30,givenUnit:'g',targetUnit:'g'},'prepare');
  check(data.calculation.answer===88&&data.coefficients.join(',')==='2,7,4,6','Combustão: coeficientes 2:7:4:6; 30 g de etano → 88 g de CO₂');
  check(document.querySelectorAll('.board-stoich').length===0,'Preparar não despeja a resolução');
  for(const stage of data.stages){board.command({action:'estequiometria',id:'calc',stage:stage.key},stage.key);advance(1500)}
  check(document.querySelectorAll('.board-stoich').length===6&&[...document.querySelectorAll('.board-stoich')].every(el=>!el.hidden)&&board.items.length===0,'Seis etapas separadas e visíveis registradas');
  check(document.querySelector('.board-proportion').textContent.includes('60 g176 g30 gx g'),'Regra de três com unidades: 60 g : 176 g = 30 g : x');
  const blocks=document.querySelectorAll('.board-stoich').length;board.command({action:'estequiometria',id:'calc',stage:'resultado'},'repeat-result');check(document.querySelectorAll('.board-stoich').length===blocks,'Repetir uma etapa não duplica o caderno');
  board.command({action:'regra_de_tres',id:'photo',a:40,b:300,c:400,leftUnit:'g',rightUnit:'mol'},'photo');advance(1000);
  check(document.querySelectorAll('.proportion-fraction')[1].textContent==='400 × 30040','Fração vertical igual ao exemplo');
  check(document.querySelectorAll('.proportion-answer')[1].textContent.includes('3.000 mol'),'Resultado do exemplo: 3.000 mol');
  check(document.querySelectorAll('.proportion-factor')[3].textContent==='× 10','Seta de multiplicação por 10');
  board.command({action:'regra_de_tres',id:'horizontal',a:30,b:90,c:80,leftUnit:'g',rightUnit:'L'},'horizontal');advance(1000);
  check(document.querySelector('.proportion-horizontal').textContent.includes('× 3'),'Fator horizontal por 3');
  check(document.querySelectorAll('.proportion-answer')[2].textContent.includes('240 L'),'Exemplo horizontal: 240 L');
  document.querySelectorAll('.board-proportion')[2].scrollIntoView({block:'center'});
  check(document.documentElement.scrollWidth<=innerWidth,'Sem transbordamento horizontal');
  report.textContent='PASSOU · '+results.length+' verificações\n'+results.join('\n');
 }catch(e){report.style.background='#711';report.textContent='FALHOU: '+e.message+'\n'+results.join('\n');console.error(e)}
})();
