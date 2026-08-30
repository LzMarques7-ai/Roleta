const $=s=>document.querySelector(s);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const STEPS=[
 ["race","Qual sua raça?","races"],
 ["title","Qual seu título?","titles"],
 ["age","Qual sua idade?","ages"],
 ["physical","Força e resistência?","physical"],
 ["speed","Velocidade?","speed"],
 ["intelligence","Inteligência?","intelligence"],
 ["combat","Combate?","combat"],
 ["hasPower","Possui poderes?","hasPower"],
 ["power","Qual é o seu poder?","powerRefs"],
 ["weapon","Qual é a sua arma?","weapons"]
];
let state={step:0,picks:[],hasPower:false,rotation:0,spinning:false};
function activeSteps(){return state.hasPower?STEPS:STEPS.filter(s=>s[0]!=="power")}
function values(key){
 const local=LIBRARY[key]||[];
 if(key==="powerRefs") return local;
 return local;
}
function wheelTexture(){
 return `repeating-conic-gradient(from 0deg,#070707 0deg 5.8deg,#101010 5.8deg 6deg)`;
}
function render(){
 const ss=activeSteps(),s=ss[state.step];
 const total=values(s[2]).length;
 document.querySelector("#app").innerHTML=`
 <main class="wrap">
   <header class="top"><span>ROULETA DA VIDA</span><span class="ver">V6</span></header>
   <h1 class="title">Roleta da vida</h1>
   <p class="subtitle">um giro por vez</p>
   <div class="step">${state.step+1} / ${ss.length}</div>
   <h2 class="question">${s[1]}</h2>
   <section class="stage">
     <div class="pointer"></div>
     <div id="wheel" class="wheel" style="background:${wheelTexture()}"></div>
     <button id="spin" class="center" aria-label="Girar a roleta">GIRAR</button>
   </section>
   <div id="result" class="result"></div>
   <button id="next" class="next hidden">PRÓXIMO</button>
 </main>`;
 $("#spin").onclick=spin;
}
function spin(){
 if(state.spinning)return;
 const ss=activeSteps(),s=ss[state.step],list=values(s[2]);
 if(!list.length)return;
 state.spinning=true;
 const idx=Math.floor(Math.random()*list.length);
 // Escolha uniforme: qualquer item, do primeiro ao último, tem exatamente 1/n.
 const n=list.length;
 const target=(idx+0.5)/n*360;
 const current=((state.rotation%360)+360)%360;
 const turns=5+Math.floor(Math.random()*4);
 const delta=turns*360+(360-target)-current;
 state.rotation+=delta;
 const wheel=$("#wheel"),spin=$("#spin");
 spin.disabled=true; spin.textContent="...";
 wheel.style.transition="transform 4.8s cubic-bezier(.09,.78,.12,1)";
 requestAnimationFrame(()=>wheel.style.transform=`rotate(${state.rotation}deg)`);
 setTimeout(()=>{
   const value=list[idx];
   state.picks.push({key:s[0],label:s[1],value});
   if(s[0]==="hasPower")state.hasPower=value==="Sim";
   state.spinning=false;
   $("#result").innerHTML=`<b>${esc(value)}</b><small>RESULTADO</small>`;
   spin.classList.add("hidden");
   const next=$("#next"); next.classList.remove("hidden");
   next.textContent=state.step===activeSteps().length-1?"VER PERSONAGEM":"PRÓXIMO GIRO";
   next.onclick=nextStep;
 },4900);
}
function nextStep(){
 if(state.step>=activeSteps().length-1){finish();return}
 state.step++;
 render();
}
function valuePower(value){
 const v=String(value).toLowerCase();
 let score=35;
 const keys=[
  ["super","10"],["energia","12"],["elemental","10"],["espaço","25"],["tempo","30"],
  ["causalidade","35"],["realidade","40"],["conceito","45"],["existência","48"],
  ["onisciência","50"],["onipresença","50"],["onipotência","55"],["narrativa","50"]
 ];
 for(const [k,n] of keys)if(v.includes(k))score+=Number(n);
 return Math.min(100,score);
}
function scale(key,value){
 const arr=LIBRARY[key]||[];
 const i=arr.indexOf(value);
 if(i<0)return 50;
 return Math.round(5+(i/(Math.max(1,arr.length-1)))*95);
}
function calculate(){
 const m=Object.fromEntries(state.picks.map(x=>[x.key,x.value]));
 const stats={
   "Força":scale("physical",m.physical),
   "Resistência":scale("physical",m.physical),
   "Velocidade":scale("speed",m.speed),
   "Inteligência":scale("intelligence",m.intelligence),
   "Combate":scale("combat",m.combat),
   "Poder":m.power?valuePower(m.power):0
 };
 let score=Math.round(Object.values(stats).reduce((a,b)=>a+b,0)/6);
 // Referências/sistemas de poder também podem resultar em níveis altos, mas sem peso oculto.
 if(m.power&&/onipotência|onipresença|onisciência|existência|conceito|realidade|causalidade|narrativa/i.test(m.power))
   score=Math.max(score,88);
 return {m,stats,score};
}
function rarity(score){
 if(score<18)return [0,"COMUM","#a5a5a5"];
 if(score<32)return [1,"INCOMUM","#78d68c"];
 if(score<46)return [2,"RARO","#76a8ff"];
 if(score<60)return [3,"ÉPICO","#b38cff"];
 if(score<72)return [4,"LENDÁRIO","#ffd65b"];
 if(score<84)return [5,"MÍTICO","#ff7777"];
 if(score<94)return [6,"DIVINO","#ff55d4"];
 return [7,"TRANSCENDENTE","#7df9ff"];
}
function finish(){
 const {m,stats,score}=calculate();
 const [r,name,color]=rarity(score);
 const first=["Aren","Kael","Ren","Sora","Nox","Kairo","Orion","Aster","Riven","Noa","Mira","Vey","Lio","Rin","Eli","Dante","Luna","Akio"];
 const last=["Valen","Voss","Kane","Ardent","Zenith","Noctis","Solari","Raven","Kuro","Vale","Dusk","Rei","Aster","Mori","Vega"];
 const characterName=`${pick(first)} ${pick(last)}`;
 const statsHTML=Object.entries(stats).map(([k,v])=>`
   <div class="stat" style="color:${color}">
     <span>${k}</span><b>${v}</b><div class="bar"><i style="width:${v}%"></i></div>
   </div>`).join("");
 const rows=state.picks.map(x=>`<div class="row"><span>${esc(x.label)}</span><b>${esc(x.value)}</b></div>`).join("");
 const powerSentence=m.power?`Seu poder se manifestou como ${String(m.power).toLowerCase()}.`:"Nenhum poder foi despertado.";
 const story=`${characterName} nasceu como ${String(m.race).toLowerCase()} e cresceu sob o título de ${String(m.title).toLowerCase()}. Aos ${m.age}, carregava ${String(m.physical).toLowerCase()} força e resistência, movia-se com ${String(m.speed).toLowerCase()} velocidade e possuía uma mente descrita como ${String(m.intelligence).toLowerCase()}. Em combate, era ${String(m.combat).toLowerCase()}. ${powerSentence} Sua arma era ${String(m.weapon).toLowerCase()}. A partir dessas condições, a vida desse personagem começa — sem destino pré-escrito.`;
 document.querySelector("#app").innerHTML=`
 <main class="wrap">
   <header class="top"><span>ROULETA DA VIDA</span><span class="ver">V6</span></header>
   <section class="final">
     <div class="stars" style="color:${color};text-shadow:0 0 ${6+r*5}px ${color}">${"★".repeat(r+1)}</div>
     <div class="rarity" style="color:${color}">${name}</div>
     <h1 style="text-shadow:0 0 ${r*3}px ${color}">${esc(characterName)}</h1>
     <div class="sub">${esc(m.race)} · ${esc(m.title)} · ${esc(m.age)}</div>
     <div class="score" style="color:${color}">${score}/100</div>
   </section>
   <section class="stats">${statsHTML}</section>
   <section class="sheet"><h2>FICHA</h2>${rows}</section>
   <p class="story">${esc(story)}</p>
   <button id="again" class="again">NOVO PERSONAGEM</button>
 </main>`;
 $("#again").onclick=()=>{state={step:0,picks:[],hasPower:false,rotation:0,spinning:false};render()};
}
window.addEventListener("referencepoolready",()=>{});
render();
hydrateReferencePool();
