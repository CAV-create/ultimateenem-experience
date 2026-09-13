(function(root){
'use strict';
// Rounded educational atomic masses; explicit values in the exercise override these.
const MASSES={H:1,He:4,Li:7,Be:9,B:11,C:12,N:14,O:16,F:19,Ne:20,Na:23,Mg:24,Al:27,Si:28,P:31,S:32,Cl:35.5,Ar:40,K:39,Ca:40,Sc:45,Ti:48,V:51,Cr:52,Mn:55,Fe:56,Co:59,Ni:59,Cu:63.5,Zn:65,Ga:70,Ge:73,As:75,Se:79,Br:80,Kr:84,Rb:85.5,Sr:88,Mo:96,Ag:108,Cd:112,Sn:119,Sb:122,Te:128,I:127,Xe:131,Cs:133,Ba:137,Pt:195,Au:197,Hg:200.5,Pb:207};
const sub=s=>String(s).replace(/[0-9]/g,d=>'₀₁₂₃₄₅₆₇₈₉'[d]);
const fmt=n=>Number(n.toPrecision(8)).toLocaleString('pt-BR',{maximumSignificantDigits:8});
function formula(raw){
 if(typeof raw!=='string'||raw.length>100||!raw)throw Error('Fórmula inválida');
 const s=raw.replace(/[₀-₉]/g,d=>String('₀₁₂₃₄₅₆₇₈₉'.indexOf(d)));
 if(!/^[A-Za-z0-9()[\]·]+$/.test(s))throw Error('Use fórmulas neutras, sem coeficientes, estados físicos ou cargas');
 let i=0,depth=0;
 function number(){const start=i;while(/\d/.test(s[i]||'!'))i++;if(start===i)return 1;const n=Number(s.slice(start,i));if(n<1||n>1000||s[start]==='0')throw Error('Índice inválido');return n}
 function group(end){if(++depth>8)throw Error('Fórmula muito complexa');const counts={};let entries=0;
  while(i<s.length&&s[i]!==end&&s[i]!=='·'){
   let part;if(s[i]==='('||s[i]==='['){const close=s[i++]==='('?')':']';part=group(close);if(s[i++]!==close)throw Error('Parênteses não fechados')}
   else{const m=/^[A-Z][a-z]?/.exec(s.slice(i));if(!m)throw Error('Fórmula inválida');i+=m[0].length;part={[m[0]]:1}}
   const n=number();for(const [el,v]of Object.entries(part)){counts[el]=(counts[el]||0)+v*n;if(counts[el]>100000)throw Error('Fórmula muito grande')}entries++;
  }
  depth--;if(!entries)throw Error('Grupo vazio');return counts;
 }
 const counts=group(null);
 while(i<s.length&&s[i]==='·'){i++;const n=number(),part=group(null);for(const [el,v]of Object.entries(part))counts[el]=(counts[el]||0)+v*n}
 if(i!==s.length)throw Error('Fórmula inválida');return counts;
}
function gcd(a,b){a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b]}return a}
function frac(n,d=1n){if(!d)throw Error('Divisão por zero');if(d<0n){n=-n;d=-d}const g=gcd(n,d);return [n/g,d/g]}
const add=(a,b)=>frac(a[0]*b[1]+b[0]*a[1],a[1]*b[1]);
const mul=(a,b)=>frac(a[0]*b[0],a[1]*b[1]);
const div=(a,b)=>frac(a[0]*b[1],a[1]*b[0]);
function balance(reactants,products){
 if(!Array.isArray(reactants)||!Array.isArray(products)||!reactants.length||!products.length||reactants.length+products.length>10)throw Error('Use de 1 a 10 espécies na reação');
 const species=[...reactants,...products];if(new Set(species).size!==species.length)throw Error('Remova espécies repetidas ou catalisadores dos dois lados');
 const counts=species.map(formula),elements=[...new Set(counts.flatMap(c=>Object.keys(c)))];
 const a=elements.map(el=>counts.map((c,j)=>frac(BigInt((c[el]||0)*(j<reactants.length?1:-1)))));
 const pivots=[];let row=0;
 for(let col=0;col<species.length&&row<a.length;col++){
  const pivot=a.findIndex((r,k)=>k>=row&&r[col][0]!==0n);if(pivot<0)continue;
  [a[row],a[pivot]]=[a[pivot],a[row]];const v=a[row][col];a[row]=a[row].map(x=>div(x,v));
  for(let k=0;k<a.length;k++)if(k!==row){const factor=a[k][col];a[k]=a[k].map((x,j)=>add(x,mul(frac(-factor[0],factor[1]),a[row][j])))}
  pivots.push(col);row++;
 }
 const free=species.map((_,i)=>i).filter(i=>!pivots.includes(i));if(free.length!==1)throw Error('A reação não tem um balanceamento único com essas espécies. Confira reagentes e produtos');
 const x=species.map(()=>frac(0n));x[free[0]]=frac(1n);for(let r=pivots.length-1;r>=0;r--){let sum=frac(0n);for(let j=pivots[r]+1;j<x.length;j++)sum=add(sum,mul(a[r][j],x[j]));x[pivots[r]]=frac(-sum[0],sum[1])}
 let lcm=1n;for(const f of x)lcm=lcm/gcd(lcm,f[1])*f[1];let ints=x.map(f=>f[0]*(lcm/f[1]));if(ints.every(v=>v<0n))ints=ints.map(v=>-v);if(ints.some(v=>v<=0n||v>1000000n))throw Error('Não há coeficientes positivos válidos para essa reação');
 const g=ints.reduce((g,v)=>gcd(g,v));const coefficients=ints.map(v=>Number(v/g));
 const audit=elements.map(el=>({element:el,left:counts.slice(0,reactants.length).reduce((s,c,i)=>s+(c[el]||0)*coefficients[i],0),right:counts.slice(reactants.length).reduce((s,c,i)=>s+(c[el]||0)*coefficients[i+reactants.length],0)}));
 if(audit.some(x=>x.left!==x.right))throw Error('Falha na conservação dos átomos');return {species,counts,coefficients,audit,reactants,products};
}
function molarMass(f,overrides={}){const counts=formula(f);const terms=Object.entries(counts).map(([element,count])=>{const mass=Object.hasOwn(overrides,element)?overrides[element]:MASSES[element];if(!Number.isFinite(mass)||mass<=0||mass>300)throw Error('Informe a massa atômica de '+element);return {element,count,mass,total:count*mass}});return {formula:f,terms,total:terms.reduce((s,t)=>s+t.total,0)}}
function exercise(args){
 const r=balance(args.reactants,args.products),overrides={};
 if(args.atomicMasses!==undefined){if(!Array.isArray(args.atomicMasses)||args.atomicMasses.length>40)throw Error('Massas atômicas inválidas');for(const a of args.atomicMasses){if(!a||typeof a.element!=='string'||! /^[A-Z][a-z]?$/.test(a.element)||typeof a.mass!=='number'||a.mass<=0||a.mass>300||!Number.isFinite(a.mass))throw Error('Massa atômica inválida');overrides[a.element]=a.mass}}
 const masses=r.species.map(f=>molarMass(f,overrides));
 const side=(xs,offset,balanced)=>xs.map((f,i)=>(balanced&&r.coefficients[offset+i]!==1?r.coefficients[offset+i]+' ':'')+sub(f)).join(' + ');
 const equation=(balanced)=>side(r.reactants,0,balanced)+' → '+side(r.products,r.reactants.length,balanced);
 const stages=[{key:'reacao',title:'1 · Reação',lines:[equation(false),'Identifique reagentes e produtos. Os índices das fórmulas não mudam no balanceamento.']},
 {key:'balanceamento',title:'2 · Balanceamento',lines:[r.species.slice(0,r.reactants.length).map((f,i)=>`${String.fromCharCode(97+i)} ${sub(f)}`).join(' + ')+' → '+r.species.slice(r.reactants.length).map((f,i)=>`${String.fromCharCode(97+i+r.reactants.length)} ${sub(f)}`).join(' + '),...r.audit.map(a=>`${a.element}: ${r.species.slice(0,r.reactants.length).map((f,i)=>({i,n:r.counts[i][a.element]||0})).filter(x=>x.n).map(x=>`${x.n===1?'':x.n}${String.fromCharCode(97+x.i)}`).join(' + ')||'0'} = ${r.species.slice(r.reactants.length).map((f,j)=>({i:j+r.reactants.length,n:r.counts[j+r.reactants.length][a.element]||0})).filter(x=>x.n).map(x=>`${x.n===1?'':x.n}${String.fromCharCode(97+x.i)}`).join(' + ')||'0'}`),`Menores coeficientes inteiros: ${r.coefficients.map((c,i)=>`${String.fromCharCode(97+i)} = ${c}`).join('; ')}`,equation(true),...r.audit.map(a=>`${a.element}: ${a.left} átomos à esquerda = ${a.right} à direita ✓`)]},
 {key:'proporcao',title:'3 · Proporção estequiométrica',lines:[r.species.map((f,i)=>`${r.coefficients[i]} mol de ${sub(f)}`).join(' : '),'Os coeficientes expressam proporções em mol, não em gramas.']},
 {key:'massa_molar',title:'4 · Massa molar',lines:[`Massas atômicas usadas (u): ${Object.entries(Object.fromEntries(masses.flatMap(m=>m.terms.map(t=>[t.element,t.mass])))).map(([e,m])=>`${e} = ${fmt(m)}`).join('; ')}. Valores escolares arredondados, salvo os fornecidos no enunciado.`,...masses.map(m=>`M(${sub(m.formula)}) = ${m.terms.map(t=>`${t.count}×${fmt(t.mass)}`).join(' + ')} = ${fmt(m.total)} g/mol`)]}];
 let calculation=null;
 const hasGiven=args.given!==undefined||args.target!==undefined||args.amount!==undefined||args.givenUnit!==undefined||args.targetUnit!==undefined;
 if(hasGiven){
  const a=r.species.indexOf(args.given),b=r.species.indexOf(args.target);
  if(a<0||b<0||a===b)throw Error('Indique uma espécie conhecida e outra diferente como alvo');
  if(typeof args.amount!=='number'||!Number.isFinite(args.amount)||args.amount<=0||args.amount>1e12)throw Error('Quantidade conhecida inválida');
  if(!['g','mol'].includes(args.givenUnit)||!['g','mol'].includes(args.targetUnit))throw Error('Use unidades g ou mol');
  const baseGiven=r.coefficients[a]*(args.givenUnit==='g'?masses[a].total:1),baseTarget=r.coefficients[b]*(args.targetUnit==='g'?masses[b].total:1),answer=args.amount*baseTarget/baseGiven;
  calculation={given:args.given,target:args.target,amount:args.amount,givenUnit:args.givenUnit,targetUnit:args.targetUnit,baseGiven,baseTarget,answer};
  stages.push({key:'regra_de_tres',title:'5 · Regra de três',table:{headers:[sub(args.given),sub(args.target)],rows:[[`${fmt(baseGiven)} ${args.givenUnit}`,`${fmt(baseTarget)} ${args.targetUnit}`],[`${fmt(args.amount)} ${args.givenUnit}`,`x ${args.targetUnit}`]]},lines:[`(${fmt(baseGiven)} ${args.givenUnit}) × (x ${args.targetUnit}) = (${fmt(args.amount)} ${args.givenUnit}) × (${fmt(baseTarget)} ${args.targetUnit})`,`x = (${fmt(args.amount)} × ${fmt(baseTarget)} ÷ ${fmt(baseGiven)}) ${args.targetUnit}`]});
  stages.push({key:'resultado',title:'6 · Resultado',lines:[`x = ${fmt(answer)} ${args.targetUnit} de ${sub(args.target)}`,'Hipóteses: reagente puro, demais reagentes em excesso e conversão completa (rendimento teórico).']});
 }
 return {balancedEquation:equation(true),coefficients:r.coefficients,audit:r.audit,masses,atomicMasses:Object.fromEntries(masses.flatMap(m=>m.terms.map(t=>[t.element,t.mass]))),calculation,stages};
}
let loading=null;
function ready(){if(!loading){loading=new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('O motor de desenho ainda não carregou. Tente novamente.')),15000);if(typeof root.initRDKitModule!=='function'){clearTimeout(timer);reject(Error('Motor de desenho indisponível'));return}root.initRDKitModule({locateFile:f=>'/vendor/rdkit/'+f}).then(m=>{clearTimeout(timer);resolve(m)},e=>{clearTimeout(timer);reject(e)})}).catch(e=>{loading=null;throw e})}return loading}
async function molecule(smiles,format='bastao'){
 if(typeof smiles!=='string'||!smiles||smiles.length>1500||/[<>\s]/.test(smiles))throw Error('SMILES inválido ou muito longo');
 if(!['bastao','expandida'].includes(format))throw Error('Formato inválido');
 const rdkit=await ready();let mol,expanded;
 try{
  mol=rdkit.get_mol(smiles);if(!mol||!mol.is_valid())throw Error('Estrutura química inválida; confira o SMILES');
  const data=JSON.parse(mol.get_json()).molecules[0];if(data.atoms.length>160)throw Error('Limite de 160 átomos explícitos por desenho');
  const canonical=mol.get_smiles();let drawing=mol;
  if(format==='expandida'){expanded=rdkit.get_mol(mol.add_hs(),JSON.stringify({removeHs:false}));if(!expanded)throw Error('Não foi possível expandir os hidrogênios');drawing=expanded;drawing.set_new_coords()}
  const groups={};const patterns={carbonila:'[C]=[O]',carboxila:'[C](=[O])[O;H1]',hidroxila:'[O;H1]',dupla:'[C]=[C]',aromatico:'a1aaaaa1'};
  for(const [group,pattern]of Object.entries(patterns)){const q=rdkit.get_qmol(pattern);try{const matches=JSON.parse(drawing.get_substruct_matches(q));if(matches.length)groups[group]={atoms:[...new Set(matches.flatMap(m=>m.atoms))],bonds:[...new Set(matches.flatMap(m=>m.bonds))]}}finally{q?.delete()}}
  const svg=drawing.get_svg_with_highlights(JSON.stringify({width:700,height:360,bondLineWidth:2,minFontSize:12,maxFontSize:22,addStereoAnnotation:true}));
  return {svg,canonical,groups,atomCount:data.atoms.length,format};
 }finally{expanded?.delete();mol?.delete()}
}
const api={formula,balance,molarMass,exercise,MASSES,fmt,sub,ready,molecule};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.VaiBemChem=api;
})(typeof window!=='undefined'?window:globalThis);
