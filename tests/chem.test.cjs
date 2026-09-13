const {test}=require('node:test');const assert=require('node:assert/strict');const chem=require('../vai-bem-chem.js');
test('formula parser handles nested groups, hydrates, and Unicode indices',()=>{
 assert.deepEqual(chem.formula('Al2(SO4)3'),{Al:2,S:3,O:12});assert.deepEqual(chem.formula('Ca(OH)2'),{Ca:1,O:2,H:2});assert.deepEqual(chem.formula('CuSO4·5H2O'),{Cu:1,S:1,O:9,H:10});assert.deepEqual(chem.formula('K4[Fe(CN)6]'),{K:4,Fe:1,C:6,N:6});assert.deepEqual(chem.formula('C₆H₁₂O₆'),{C:6,H:12,O:6});
 for(const input of ['2H2O','Na+','H0','H2O(aq)','Ca(OH2','H2O)','H2()','H02',''])assert.throws(()=>chem.formula(input),input);
});
test('exact conservation produces minimal coefficients for common and larger reactions',()=>{
 const cases=[[['H2','O2'],['H2O'],[2,1,2]],[['C2H6','O2'],['CO2','H2O'],[2,7,4,6]],[['Fe2O3','CO'],['Fe','CO2'],[1,3,2,3]],[['Al','HCl'],['AlCl3','H2'],[2,6,2,3]],[['Ca(OH)2','H3PO4'],['Ca3(PO4)2','H2O'],[3,2,1,6]],[['C8H18','O2'],['CO2','H2O'],[2,25,16,18]]];
 for(const [r,p,expected]of cases){const result=chem.balance(r,p);assert.deepEqual(result.coefficients,expected);assert.ok(result.audit.every(a=>a.left===a.right))}
 assert.throws(()=>chem.balance(['H2'],['CO2']));assert.throws(()=>chem.balance(['C','O2'],['CO','CO2']));assert.throws(()=>chem.balance(['H2','O2'],['H2O','O2']));
});
test('molar mass uses indices, parentheses and exercise-specific atomic masses',()=>{
 assert.equal(chem.molarMass('CaCO3').total,100);assert.equal(chem.molarMass('Al2(SO4)3').total,342);assert.equal(chem.molarMass('NaCl').total,58.5);assert.equal(chem.molarMass('H2O',{H:1.008,O:15.999}).total,18.015);assert.throws(()=>chem.molarMass('Xx2'));assert.throws(()=>chem.molarMass('H2O',{H:0}));
});
test('stoichiometry assembles mass rule of three with units and declared assumptions',()=>{
 const x=chem.exercise({reactants:['CaCO3'],products:['CaO','CO2'],given:'CaCO3',target:'CO2',amount:250,givenUnit:'g',targetUnit:'g'});
 assert.equal(x.calculation.answer,110);assert.equal(x.calculation.baseGiven,100);assert.equal(x.calculation.baseTarget,44);assert.deepEqual(x.stages.map(s=>s.key),['reacao','balanceamento','proporcao','massa_molar','regra_de_tres','resultado']);assert.deepEqual(x.stages[4].table.rows,[['100 g','44 g'],['250 g','x g']]);assert.match(x.stages[5].lines[1],/rendimento teórico/);
});
test('g/mol conversions and reverse product-to-reactant calculations',()=>{
 const args={reactants:['H2','O2'],products:['H2O'],given:'H2',target:'H2O',amount:4,givenUnit:'g',targetUnit:'mol'};assert.equal(chem.exercise(args).calculation.answer,2);
 assert.equal(chem.exercise({...args,amount:2,givenUnit:'mol',targetUnit:'g'}).calculation.answer,36);
 assert.equal(chem.exercise({...args,given:'H2O',target:'O2',amount:36,givenUnit:'g',targetUnit:'g'}).calculation.answer,32);
 assert.equal(chem.exercise({...args,amount:2,givenUnit:'mol',targetUnit:'mol'}).calculation.answer,2);
 for(const patch of [{amount:-1},{amount:Infinity},{givenUnit:'L'},{given:'NaCl'},{target:'H2'},{atomicMasses:[{element:'H',mass:NaN}]}])assert.throws(()=>chem.exercise({...args,...patch}));
});
test('reaction without quantities still supports teaching balance, ratios and molar mass',()=>{
 const x=chem.exercise({reactants:['N2','H2'],products:['NH3']});assert.deepEqual(x.coefficients,[1,3,2]);assert.equal(x.calculation,null);assert.equal(x.stages.length,4);assert.match(x.stages[1].lines.join('\n'),/a = 1; b = 3; c = 2/);
});
test('real RDKit renders skeletal and explicit-hydrogen SVGs, rejects invalid valence',async()=>{
 const init=require('../vendor/rdkit/RDKit_minimal.js');global.initRDKitModule=opts=>init({...opts,locateFile:f=>require('node:path').join(__dirname,'../vendor/rdkit',f)});
 const skeletal=await chem.molecule('CC(=O)Oc1ccccc1C(=O)O','bastao');assert.equal(skeletal.atomCount,13);assert.ok(skeletal.svg.includes('<svg'));assert.ok(skeletal.groups.carbonila);assert.ok(skeletal.groups.aromatico);
 const expanded=await chem.molecule('CCO','expandida');const implicit=await chem.molecule('CCO','bastao');assert.ok(expanded.svg.length>implicit.svg.length);assert.ok(expanded.groups.hidroxila);
 await assert.rejects(chem.molecule('C(C)(C)(C)(C)C'));await assert.rejects(chem.molecule('C'.repeat(161)));
});
test('general proportions calculate photo and inverse case and reject invalid values',()=>{
 const {ruleOfThree}=require('../vai-bem-chem.js');
 const p=ruleOfThree({a:40,b:300,c:400});assert.equal(p.answer,3000);assert.deepEqual(p.numerator,[400,300]);assert.equal(p.denominator,40);assert.equal(p.factor,10);
 assert.equal(ruleOfThree({a:4,b:12,c:8,relation:'inversa'}).answer,6);
 for(const n of [0,-1,NaN,Infinity,'40'])assert.throws(()=>ruleOfThree({a:n,b:300,c:400}));
});

test('horizontal shortcut matches the supplied photo and division works',()=>{
 const {ruleOfThree}=require('../vai-bem-chem.js');
 const p=ruleOfThree({a:30,b:90,c:80});assert.equal(p.direction,'horizontal');assert.equal(p.horizontalFactor,3);assert.equal(p.answer,240);
 assert.equal(ruleOfThree({a:90,b:30,c:60,direction:'horizontal'}).answer,20);
 assert.throws(()=>ruleOfThree({a:4,b:12,c:8,relation:'inversa',direction:'horizontal'}));
});
