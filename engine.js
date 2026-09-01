/* ROULETA DA VIDA V19 — CHARACTER FORGE
   Sorteio independente COM reposição. Combinações não são limitadas.
   Raridade é uma classificação posterior do conjunto, não um peso de sorteio.
*/
(()=>{
'use strict';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function randomInt(max){
  if(max<=1)return 0;
  const c=globalThis.crypto;
  if(c?.getRandomValues){const a=new Uint32Array(1),lim=Math.floor(0x100000000/max)*max;do{c.getRandomValues(a)}while(a[0]>=lim);return a[0]%max;}
  return Math.floor(Math.random()*max);
}
const norm=x=>Array.isArray(x)?{name:String(x[0]),value:Number(x[1]??50),ref:String(x[2]??'')}:({...x});
const pick=a=>norm(a[randomInt(a.length)]);
const draw=k=>pick(LIBRARY[k]||[]);
const firstNames=['Akira','Aiko','Ren','Rin','Haru','Yuki','Sora','Kai','Ryu','Mei','Lena','Nora','Elian','Lucian','Mira','Viktor','Iris','Dante','Valen','Arthur','Evelyn','Milo','Theo','Adrian','Naomi','Levi','Amara','Soren','Freya','Nikolai','Zara','Samir','Layla','Kenji','Emi','Hugo','Clara','Rafael','Luna'];
const lastNames=['Aoki','Kurosawa','Hayashi','Mori','Takeda','Arakawa','Silva','Costa','Moreau','Dubois','Blackwood','Ashford','Ravenwood','Vale','Everett','Cruz','Navarro','Volkov','Kovacs','Hale','Sterling','Nightingale','Frost','Grimm','Stone','Reyes','Sato','Khan','Ishikawa','Mercer'];
const name=()=>firstNames[randomInt(firstNames.length)]+' '+lastNames[randomInt(lastNames.length)];
const yesPower=()=>randomInt(100)<68;
const score=x=>Number.isFinite(Number(x?.value))?Number(x.value):50;
const tags=x=>String(x?.tags||'').split(',').map(s=>s.trim()).filter(Boolean);
const tier=v=>v<20?0:v<35?1:v<50?2:v<65?3:v<78?4:v<88?5:v<94?6:v<98?7:8;
const rarityNames=[['Comum',1,'#9aa0aa'],['Incomum',2,'#63df92'],['Raro',3,'#59adff'],['Épico',4,'#9d70ff'],['Lendário',5,'#ff67d3'],['Mítico',6,'#ffad45'],['Divino',7,'#ffe75d'],['Transcendente',8,'#63eaff'],['Absoluto',9,'#fff']];
function rarity(p){
  const keys=['race','title','appearance','age','condition','force','speed','intelligence','combat','talent','potential','weapons','life'];
  if(p.hasPower?.name==='Sim')keys.push('power','control');
  const ts=keys.map(k=>tier(score(p[k])));
  const high=ts.filter(x=>x>=5).length, extreme=ts.filter(x=>x>=7).length, absolute=ts.filter(x=>x>=8).length;
  const breadth=ts.filter(x=>x>=4).length;
  const weak=ts.filter(x=>x<=1).length;
  const synergies=countSynergy(p);
  let stars=1;
  if(breadth>=2||Math.max(...ts)>=2)stars=2;
  if(breadth>=4||high>=1)stars=3;
  if(breadth>=5&&high>=2)stars=4;
  if(breadth>=6&&high>=3)stars=5;
  if((breadth>=7&&high>=3)||extreme>=1||synergies>=2)stars=6;
  if((breadth>=8&&extreme>=2)||absolute>=1||synergies>=3)stars=7;
  if((breadth>=9&&extreme>=3)||(absolute>=2&&high>=5)||synergies>=4)stars=8;
  if((breadth>=11&&extreme>=4&&weak<=1)||(absolute>=3&&synergies>=4&&weak===0))stars=9;
  if(p.hasPower?.name!=='Sim')stars=Math.min(stars,8);
  const r=rarityNames[stars-1];
  return {name:r[0],stars,color:r[2],high,extreme,absolute,breadth,synergies};
}
function countSynergy(p){
  const sets=Object.values(p).map(x=>new Set(tags(x)));
  let n=0;
  const hasAll=(a,b)=>sets.some(s=>s.has(a))&&sets.some(s=>s.has(b));
  if(hasAll('speedster','lightning'))n++;
  if(hasAll('dragon','fire'))n++;
  if(hasAll('psychic','mind'))n++;
  if(hasAll('sword','katana'))n++;
  if(hasAll('cosmic','energy'))n++;
  if(hasAll('tech','armor'))n++;
  if(hasAll('wing','light'))n++;
  if(hasAll('demon','dark'))n++;
  if(hasAll('martial','muscle'))n++;
  if(hasAll('science','tech'))n++;
  return n;
}
function personality(p){
  const pool=[['observador','conhecimento','orgulho','entender o mundo','perder o controle'],['curioso','liberdade','impaciência','descobrir algo impossível','ficar preso ao passado'],['determinado','proteção','teimosia','provar seu valor','falhar com alguém'],['calculista','verdade','desconfiança','encontrar a resposta definitiva','ser enganado'],['melancólico','independência','isolamento','construir uma vida própria','ficar sozinho'],['ambicioso','poder','orgulho','alcançar o topo','ser esquecido'],['compassivo','justiça','medo de ferir outros','proteger quem ama','não conseguir salvar alguém'],['imprevisível','liberdade','impulsividade','viver algo que ninguém viveu','uma vida sem sentido']];
  const a=pool[randomInt(pool.length)];
  return {trait:a[0],ideal:a[1],flaw:a[2],goal:a[3],fear:a[4]};
}
function reference(obj){if(!obj)return null;return {name:obj.name||'—',type:obj.refType||'referência',why:obj.refWhy||obj.ref||'sem descrição',value:score(obj),tags:tags(obj)};}
function compose(p){
 const refs={};for(const k of Object.keys(p)){if(k!=='hasPower')refs[k]=reference(p[k]);}
 const visualSeed=[p.name?.name,...Object.keys(p).map(k=>p[k]?.name||'')].join('|');
 const fake={p,rarity:rarity(p),personality:personality(p),refs,visualSeed};
 fake.synergies=fake.rarity.synergies;
 return fake;
}
function forge(){
  const p={race:draw('races'),title:draw('titles'),appearance:draw('appearance'),name:{name:name(),refType:'sistema de nomes',refWhy:'combinação procedural de nomes disponíveis'},age:draw('age'),condition:draw('condition'),force:draw('force'),speed:draw('speed'),intelligence:draw('intelligence'),combat:draw('combat'),talent:draw('talent'),hasPower:{name:yesPower()?'Sim':'Não'}};
  if(p.hasPower.name==='Sim'){p.power=draw('power');p.control=draw('control');}else{p.power={name:'Nenhum poder',refType:'estado',refWhy:'o sorteio de poderes foi desativado porque a roleta caiu em Não',value:0,tags:'none'};p.control={name:'Sem domínio',refType:'estado',refWhy:'não há poder para dominar',value:0,tags:'none'};}
  p.potential=draw('potential');p.weapons=draw('weapons');p.life=draw('life');
  const pers=personality(p),rar=rarity(p);
  const refs={};for(const k of Object.keys(p)){if(k==='hasPower')continue;refs[k]=reference(p[k]);}
  const visualSeed=[p.name.name,...Object.keys(p).map(k=>p[k]?.name||'')].join('|');
  return {p,personality:pers,rarity:rar,refs,visualSeed,synergies:rar.synergies};
}
window.RV={randomInt,pick,draw,name,yesPower,score,tier,rarity,forge,compose,reference,tags};
})();
