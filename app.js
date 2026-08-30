/* ROULETA DA VIDA V7 — interface e fluxo */
const $=s=>document.querySelector(s);
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STEPS=[
 ['race','Qual sua raça?','races'],['title','Qual seu título?','titles'],['age','Qual sua idade?','ages'],
 ['physical','Força e resistência?','physical'],['speed','Velocidade?','speed'],['intelligence','Inteligência?','intelligence'],
 ['combat','Combate?','combat'],['hasPower','Possui poderes?','hasPower'],['power','Qual é o seu poder?','powerRefs'],['weapon','Arma?','weapons']
];
let state={step:0,picks:[],hasPower:false,rotation:0,spinning:false,remoteReady:false};
function activeSteps(){return state.hasPower?STEPS:STEPS.filter(x=>x[0]!=='power')}
function pool(key){
 if(key==='powerRefs')return null;
 return LIBRARY[key]||[];
}
function label(item){return typeof item==='string'?item:item.name}
function getItem(key){
 if(key==='powerRefs')return makePower();
 return draw(key);
}
function wheelTexture(){
 return 'repeating-conic-gradient(from 0deg,#050505 0deg 7deg,#111 7deg 13deg,#080808 13deg 18deg)';
}
function render(){
 const ss=activeSteps(),s=ss[state.step];
 const count=s[2]==='powerRefs'?'4,4 milhões de combinações':pool(s[2]).length+' opções';
 document.querySelector('#app').innerHTML=`
 <main class="wrap">
  <header class="top"><span>ROULETA DA VIDA</span><span>V7</span></header>
  <h1 class="title">Roleta da vida</h1>
  <div class="step">${state.step+1}/${ss.length}</div>
  <h2 class="question">${s[1]}</h2>
  <section class="stage">
   <div class="pointer"></div><div id="wheel" class="wheel" style="background:${wheelTexture()}"></div>
   <button id="spin" class="center">GIRAR</button>
  </section>
  <div class="count">${count}</div>
  <div id="result" class="result"></div>
  <button id="next" class="next hidden">PRÓXIMO</button>
 </main>`;
 $('#spin').onclick=spin;
}
function spin(){
 if(state.spinning)return;
 const ss=activeSteps(),s=ss[state.step];
 state.spinning=true;
 const value=getItem(s[2]);
 const list=pool(s[2]);
 const n=s[2]==='powerRefs'?(POWER_ACTIONS.length*POWER_DOMAINS.length*POWER_RANGES.length*POWER_MODIFIERS.length*POWER_FOCUSES.length):list.length;
 const idx=s[2]==='powerRefs'?(value.slot??RNG.int(n)):Math.max(0,list.findIndex(x=>label(x)===label(value)));
 const target=((idx+0.5)/n)*360;
 const current=((state.rotation%360)+360)%360;
 const turns=5+RNG.int(4);
 const delta=turns*360+(360-target)-current;
 state.rotation+=delta;
 const wheel=$('#wheel'),button=$('#spin'); button.disabled=true;button.textContent='…';
 wheel.style.transition='transform 4.7s cubic-bezier(.08,.8,.12,1)';
 requestAnimationFrame(()=>wheel.style.transform=`rotate(${state.rotation}deg)`);
 setTimeout(()=>{
  state.picks.push({key:s[0],label:s[1],value});
  if(s[0]==='hasPower')state.hasPower=label(value)==='Sim';
  state.spinning=false;
  $('#result').innerHTML=`<b>${esc(label(value))}</b><small>RESULTADO</small>`;
  button.classList.add('hidden');
  const next=$('#next');next.classList.remove('hidden');next.textContent=state.step===activeSteps().length-1?'CRIAR PERSONAGEM':'PRÓXIMO GIRO';next.onclick=nextStep;
 },4750);
}
function nextStep(){if(state.step>=activeSteps().length-1){finish();return}state.step++;render()}
function finish(){
 const m=Object.fromEntries(state.picks.map(x=>[x.key,x.value]));
 const p={...m,name:makeName(),hasPower:label(m.hasPower)==='Sim'};
 const personality=makePersonality(p);p.personality=personality;
 const {stats,score}=deriveStats(p);const rar=rarity(score);
 const reference=REMOTE_LIBRARY.characters.length?RNG.pick(REMOTE_LIBRARY.characters):null;
 p.reference=reference;
 const statHTML=Object.entries(stats).map(([k,v])=>`<div class="stat"><span>${k}</span><b>${v}</b><i><em style="width:${v}%"></em></i></div>`).join('');
 const rows=state.picks.map(x=>`<div class="row"><span>${esc(x.label)}</span><b>${esc(label(x.value))}</b></div>`).join('');
 const power=p.hasPower?`O poder despertou como ${label(p.power).toLowerCase()}, ${p.power.detail.toLowerCase()}.`:'Nenhum poder extraordinário despertou.';
 const story=`${p.name} nasceu como ${label(p.race).toLowerCase()} e recebeu o título de ${label(p.title).toLowerCase()}. Aos ${label(p.age).toLowerCase()}, tinha ${label(p.physical).toLowerCase()} força e resistência, ${label(p.speed).toLowerCase()} velocidade, uma mente ${label(p.intelligence).toLowerCase()} e ${label(p.combat).toLowerCase()} experiência de combate. ${power} ${p.weapon.name!=='Nenhuma'?`Sua arma era ${p.weapon.name.toLowerCase()}.`:''} ${personality.trait} Seu ideal é ${personality.ideal} Seu objetivo é ${personality.goal} Seu maior medo é ${personality.fear}`;
 document.querySelector('#app').innerHTML=`
 <main class="wrap final-page">
  <header class="top"><span>ROULETA DA VIDA</span><span>V7</span></header>
  <section class="final">
   <div class="stars" style="color:${rar.color};text-shadow:0 0 ${5+rar.stars*4}px ${rar.color}">${'★'.repeat(rar.stars)}</div>
   <div class="rarity" style="color:${rar.color}">${rar.name}</div>
   <h1 style="text-shadow:0 0 ${rar.stars*2}px ${rar.color}">${esc(p.name)}</h1>
   <div class="sub">${esc(label(p.race))} · ${esc(label(p.title))} · ${esc(label(p.age))}</div>
   <div class="score" style="color:${rar.color}">${score}/100</div>
  </section>
  <section class="stats">${statHTML}</section>
  <section class="sheet"><h2>FICHA</h2>${rows}</section>
  <section class="story"><p>${esc(story)}</p><p class="personality"><b>${esc(personality.alignment)}</b> · ${esc(personality.flaw)}</p>${reference?`<p class="source">matriz externa: ${esc(reference.name)}</p>`:''}</section>
  <button id="again" class="again">NOVO PERSONAGEM</button>
 </main>`;
 $('#again').onclick=()=>{state={step:0,picks:[],hasPower:false,rotation:0,spinning:false,remoteReady:state.remoteReady};render()};
}
window.addEventListener('referencepoolready',()=>{state.remoteReady=true});
render();
hydrateReferencePool();
