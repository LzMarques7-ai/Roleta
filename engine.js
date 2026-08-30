/* ROULETA DA VIDA V8 — motor de sorteio, perfil de poder e raridade.
   Princípio: cada opção da biblioteca tem a mesma chance de cair.
   Raridade NÃO participa do sorteio; é uma leitura posterior do personagem.
*/
const RNG = {
  uint32(){
    const a=new Uint32Array(1);
    if(globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(a);
    else a[0]=Math.floor(Math.random()*4294967296);
    return a[0];
  },
  int(max){
    if(max<=1)return 0;
    const limit=Math.floor(4294967296/max)*max;
    let x;
    do{x=this.uint32()}while(x>=limit);
    return x%max;
  },
  pick(arr){return arr[RNG.int(arr.length)]},
  chance(percent){return RNG.int(100)<percent}
};

function normalizeItem(x){
  if(typeof x==='string') return {name:x};
  if(Array.isArray(x)) return {name:x[0],effects:x[1]||{},ref:x[2]||''};
  return x||{name:'—'};
}
function label(x){return normalizeItem(x).name}
function listFor(key){return (LIBRARY[key]||[]).map(normalizeItem)}
function draw(key){
  const list=listFor(key);
  if(!list.length) return {name:'—'};
  return list[RNG.int(list.length)];
}
function drawPower(){
  const actions=POWER_ACTIONS.map(normalizeItem), domains=POWER_DOMAINS.map(normalizeItem), modifiers=POWER_MODIFIERS.map(normalizeItem);
  const a=RNG.pick(actions),d=RNG.pick(domains),m=RNG.pick(modifiers);
  const name=a.name+' '+d.name;
  const detail=m.name;
  const effects={...(POWER_EFFECTS[d.name]||{}),...(m.effects||{})};
  return {name,detail,ref:d.ref||a.ref||'',effects,tags:[a.name,d.name,m.name]};
}
function drawFor(key){
  if(key==='hasPower') return RNG.chance(70)?{name:'Sim',effects:{}}:{name:'Não',effects:{}};
  if(key==='power') return drawPower();
  return draw(key);
}

/* A V8 abandona a média "peso 100". Cada eixo recebe um nível qualitativo.
   O perfil final é lido por patamares, coerência e feitos extremos. */
const AXES=['Força','Resistência','Velocidade','Inteligência','Combate','Poder'];
function numericValue(item){
  const x=normalizeItem(item);
  if(Number.isFinite(x.value)) return x.value;
  return 50;
}
function clamp(n,a=0,b=100){return Math.max(a,Math.min(b,Math.round(n)))}
function collectEffects(...items){
  const out={};
  for(const item of items.flat()) for(const [k,v] of Object.entries(normalizeItem(item).effects||{})) out[k]=(out[k]||0)+Number(v||0);
  return out;
}
function tier(v){
  if(v<15)return {name:'Humano',rank:0};
  if(v<30)return {name:'Baixo',rank:1};
  if(v<45)return {name:'Comum',rank:2};
  if(v<60)return {name:'Treinado',rank:3};
  if(v<72)return {name:'Excepcional',rank:4};
  if(v<82)return {name:'Sobrenatural',rank:5};
  if(v<90)return {name:'Monstruoso',rank:6};
  if(v<96)return {name:'Lendário',rank:7};
  if(v<99)return {name:'Divino',rank:8};
  return {name:'Transcendente',rank:9};
}
function deriveStats(p){
  const effects=collectEffects(p.race,p.title,p.age,p.physical,p.speed,p.intelligence,p.combat,p.weapon,p.power);
  const stats={
    Força: numericValue(p.physical),
    Resistência: numericValue(p.physical),
    Velocidade: numericValue(p.speed),
    Inteligência: numericValue(p.intelligence),
    Combate: numericValue(p.combat),
    Poder: p.hasPower?52:0
  };
  for(const [k,v] of Object.entries(effects)) if(k in stats) stats[k]=clamp(stats[k]+v);
  if(!p.hasPower)stats.Poder=0;
  const tiers=Object.fromEntries(AXES.map(k=>[k,tier(stats[k])]));
  const ranks=AXES.map(k=>tiers[k].rank).sort((a,b)=>b-a);
  const peak=ranks[0], top3=ranks.slice(0,3).reduce((a,b)=>a+b,0), extremes=ranks.filter(x=>x>=8).length;
  let className='';
  if(peak>=9 || extremes>=2) className='Transcendente';
  else if(peak>=8) className='Divino';
  else if(peak>=7 || (peak>=6&&top3>=17)) className='Lendário';
  else if(peak>=6 || top3>=14) className='Mítico';
  else if(peak>=5 || top3>=11) className='Épico';
  else if(peak>=4 || top3>=8) className='Raro';
  else if(peak>=3 || top3>=5) className='Incomum';
  else className='Comum';
  const rarity=RARITIES.find(r=>r.name===className)||RARITIES[0];
  return {stats,tiers,rarity,profile:{peak,top3,extremes}};
}
const RARITIES=[
 {name:'Comum',stars:1,color:'#8b8b8b'},
 {name:'Incomum',stars:2,color:'#65d68a'},
 {name:'Raro',stars:3,color:'#5aa8ff'},
 {name:'Épico',stars:4,color:'#a777ff'},
 {name:'Mítico',stars:5,color:'#ff5ac8'},
 {name:'Lendário',stars:6,color:'#ffb84d'},
 {name:'Divino',stars:7,color:'#fff36b'},
 {name:'Transcendente',stars:8,color:'#72f5ff'}
];

function makeName(){
  const a=RNG.pick(NAME_A),b=RNG.pick(NAME_B);
  return a+b;
}
