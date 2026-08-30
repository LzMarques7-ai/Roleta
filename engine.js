/* ROULETA DA VIDA V7 — motor
   Ideias: sorteio uniforme, PCG combinatório, consequências sem alterar
   as chances e cache seguro das fontes externas.
*/
const RNG = {
  uint32(){
    const a = new Uint32Array(1);
    if (globalThis.crypto?.getRandomValues) crypto.getRandomValues(a);
    else a[0] = Math.floor(Math.random()*4294967296);
    return a[0];
  },
  int(max){
    if(max<=1) return 0;
    const limit = Math.floor(4294967296/max)*max;
    let x;
    do { x=this.uint32(); } while(x>=limit);
    return x%max;
  },
  pick(arr){ return arr[RNG.int(arr.length)]; }
};

function normalizeItem(x){
  if(typeof x === 'string') return {name:x, tags:[], effects:{}};
  return x;
}
function unique(items){
  const seen=new Set(); const out=[];
  for(const x of items||[]){
    const k=normalizeItem(x).name;
    if(k && !seen.has(k)){seen.add(k);out.push(normalizeItem(x));}
  }
  return out;
}
function clamp(n,a=0,b=100){return Math.max(a,Math.min(b,Math.round(n)));}
function sumEffects(...items){
  const out={};
  for(const item of items.flat()) for(const [k,v] of Object.entries(normalizeItem(item).effects||{})) out[k]=(out[k]||0)+v;
  return out;
}
function makePower(){
  const ai=RNG.int(POWER_ACTIONS.length),di=RNG.int(POWER_DOMAINS.length),ri=RNG.int(POWER_RANGES.length),mi=RNG.int(POWER_MODIFIERS.length),fi=RNG.int(POWER_FOCUSES.length);
  const a=POWER_ACTIONS[ai],d=POWER_DOMAINS[di],r=POWER_RANGES[ri],m=POWER_MODIFIERS[mi],focus=POWER_FOCUSES[fi];
  const slot=((((ai*POWER_DOMAINS.length)+di)*POWER_RANGES.length+ri)*POWER_MODIFIERS.length+mi)*POWER_FOCUSES.length+fi;
  return {name:`${a} ${d}`,detail:`${r}; ${m}; foco em ${focus}`,tags:[d,focus],effects:POWER_EFFECTS[d]||{Poder:25},slot};
}
function buildPowerPool(){
  const out=[];
  for(const action of POWER_ACTIONS)
    for(const domain of POWER_DOMAINS)
      for(const range of POWER_RANGES)
        for(const modifier of POWER_MODIFIERS)
          out.push({name:`${action} ${domain}`,detail:`${range}; ${modifier}`,tags:[domain],effects:POWER_EFFECTS[domain]||{Poder:20}});
  return out;
}
function draw(key, remote=[]){
  if(key==='powerRefs') return makePower();
  const list=unique([...(LIBRARY[key]||[]),...(remote||[])]);
  return list[RNG.int(list.length)];
}
function numeric(item,fallback=50){
  const v=normalizeItem(item); return Number.isFinite(v.value)?v.value:fallback;
}
function deriveStats(p){
  const e=sumEffects(p.race,p.title,p.age,p.physical,p.speed,p.intelligence,p.combat,p.power,p.weapon);
  const base={
    Força:numeric(p.physical,50), Resistência:numeric(p.physical,50), Velocidade:numeric(p.speed,50),
    Inteligência:numeric(p.intelligence,50), Combate:numeric(p.combat,50), Poder:p.hasPower?numeric(p.power,0):0
  };
  for(const [k,v] of Object.entries(e)) if(k in base) base[k]+=v;
  for(const k of Object.keys(base)) base[k]=clamp(base[k]);
  if(!p.hasPower) base.Poder=0;
  const avg=Object.values(base).reduce((a,b)=>a+b,0)/(Object.keys(base).length);
  const peak=Math.max(...Object.values(base));
  const rarityScore=clamp(avg*0.72+peak*0.28);
  return {stats:base,score:Math.round(rarityScore)};
}
function rarity(score){
  if(score<15)return {stars:1,name:'COMUM',color:'#9b9b9b'};
  if(score<30)return {stars:2,name:'INCOMUM',color:'#77d88a'};
  if(score<45)return {stars:3,name:'RARO',color:'#6ea7ff'};
  if(score<60)return {stars:4,name:'ÉPICO',color:'#ad7cff'};
  if(score<73)return {stars:5,name:'LENDÁRIO',color:'#ffd15c'};
  if(score<85)return {stars:6,name:'MÍTICO',color:'#ff7b68'};
  if(score<95)return {stars:7,name:'DIVINO',color:'#ff4fc4'};
  return {stars:8,name:'TRANSCENDENTE',color:'#75f5ff'};
}
function makeName(){
  const a=RNG.pick(NAME_A),b=RNG.pick(NAME_B); return `${a}${b}`;
}
function makePersonality(p){
  const alignment=RNG.pick(ALIGNMENTS);
  const trait=RNG.pick(PERSONALITY_TRAITS);
  const ideal=RNG.pick(IDEALS);
  const flaw=RNG.pick(FLAWS);
  const goal=RNG.pick(GOALS);
  const fear=RNG.pick(FEARS);
  return {alignment,trait,ideal,flaw,goal,fear};
}
function makeStory(p,personality){
  const power=p.hasPower ? `O poder de ${String(p.power.name).toLowerCase()} se manifestou de forma ${String(p.power.detail).toLowerCase()}.` : 'Nenhum poder extraordinário despertou.';
  return `${p.name} nasceu como ${String(p.race.name).toLowerCase()}, sob o título de ${String(p.title.name).toLowerCase()}. Aos ${String(p.age.name).toLowerCase()}, já carregava ${String(p.physical.name).toLowerCase()} força e resistência e se movia com ${String(p.speed.name).toLowerCase()} velocidade. Sua inteligência era ${String(p.intelligence.name).toLowerCase()} e seu domínio de combate, ${String(p.combat.name).toLowerCase()}. ${power} ${p.weapon.name!=='Nenhuma'?`Sua arma era ${p.weapon.name.toLowerCase()}.`:''} ${personality.trait} Seu objetivo é ${personality.goal.toLowerCase()}, mas ${personality.flaw.toLowerCase()}.`;
}
