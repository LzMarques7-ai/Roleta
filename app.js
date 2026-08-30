/* ROULETA DA VIDA V8 — interface.
   Um giro por vez. O wheel é visual; o sorteio é feito separadamente com RNG.
   A interface usa delegação de eventos para não perder botões após re-render.
*/
const $=s=>document.querySelector(s);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STEPS=[
 ['race','Qual sua raça?','races'],
 ['title','Qual seu título?','titles'],
 ['age','Qual sua idade?','ages'],
 ['physical','Força e durabilidade?','physical'],
 ['speed','Velocidade?','speed'],
 ['intelligence','Inteligência?','intelligence'],
 ['combat','Combate?','combat'],
 ['hasPower','Possui poderes?','hasPower'],
 ['power','Qual é o seu poder?','power'],
 ['weapon','Arma?','weapons']
];
let state={step:0,picks:[],hasPower:false,rotation:0,spinning:false,spinToken:0};

function activeSteps(){return state.hasPower?STEPS:STEPS.filter(s=>s[0]!=='power')}
function currentStep(){return activeSteps()[state.step]}
function visualWheel(canvas,highlight=-1){
  if(!canvas)return;
  const rect=canvas.getBoundingClientRect();
  const dpr=Math.min(window.devicePixelRatio||1,2);
  const size=Math.max(260,Math.floor(Math.min(rect.width||300,rect.height||300)));
  if(canvas.width!==size*dpr){canvas.width=size*dpr;canvas.height=size*dpr;}
  const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,size,size);
  const cx=size/2,cy=size/2,r=size/2-2,n=60;
  for(let i=0;i<n;i++){
    const a=-Math.PI/2+i*(Math.PI*2/n),b=-Math.PI/2+(i+1)*(Math.PI*2/n);
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,a,b);ctx.closePath();
    ctx.fillStyle=i===highlight?'#1b1b1b':(i%2?'#0b0b0b':'#111111');ctx.fill();
    ctx.strokeStyle='#191919';ctx.lineWidth=1;ctx.stroke();
  }
  ctx.beginPath();ctx.arc(cx,cy,r-1,0,Math.PI*2);ctx.strokeStyle='#292929';ctx.lineWidth=1;ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,r*.25,0,Math.PI*2);ctx.fillStyle='#000';ctx.fill();ctx.strokeStyle='#222';ctx.stroke();
}
function render(){
  const ss=activeSteps();
  if(state.step>=ss.length)state.step=ss.length-1;
  const s=ss[state.step];
  document.querySelector('#app').innerHTML=`
   <main class="screen">
    <header class="topbar"><span>ROULETA DA VIDA</span><span>V8</span></header>
    <h1>Roleta da vida</h1>
    <div class="progress">${state.step+1} / ${ss.length}</div>
    <section class="roulette" aria-label="Roleta de sorteio">
      <div class="pointer" aria-hidden="true"></div>
      <canvas id="wheel" class="wheel"></canvas>
      <button class="spin" data-action="spin" aria-label="Girar a roleta">GIRAR</button>
    </section>
    <h2>${esc(s[1])}</h2>
    <div id="result" class="result" aria-live="polite">—</div>
   </main>`;
  visualWheel($('#wheel'));
}
function spin(){
  if(state.spinning)return;
  const s=currentStep();
  if(!s)return;
  const value=drawFor(s[2]);
  const token=++state.spinToken;state.spinning=true;
  const wheel=$('#wheel'),button=document.querySelector('[data-action="spin"]');
  if(!wheel||!button){state.spinning=false;return;}
  const visualSlot=RNG.int(60);
  const current=((state.rotation%360)+360)%360;
  const target=(visualSlot+0.5)*(360/60);
  let delta=(360-target-current+360)%360;
  delta+=360*(6+RNG.int(4));
  state.rotation+=delta;
  button.disabled=true;button.textContent='…';
  wheel.style.transform=`rotate(${state.rotation}deg)`;
  window.setTimeout(()=>{
    if(token!==state.spinToken)return;
    state.spinning=false;
    state.picks.push({key:s[0],question:s[1],value});
    if(s[0]==='hasPower')state.hasPower=label(value)==='Sim';
    const result=$('#result');
    if(result)result.innerHTML=`<strong>${esc(label(value))}</strong><span>resultado</span>`;
    const next=document.createElement('button');
    next.className='next';next.dataset.action='next';next.textContent=state.step===activeSteps().length-1?'CRIAR PERSONAGEM':'PRÓXIMO GIRO';
    result?.after(next);
  },4600);
}
function next(){
  if(state.spinning)return;
  if(state.step>=activeSteps().length-1){finish();return}
  state.step++;render();
}
function finish(){
  const picked=Object.fromEntries(state.picks.map(x=>[x.key,x.value]));
  const p={...picked,name:makeName(),hasPower:label(picked.hasPower)==='Sim'};
  if(!p.hasPower)delete p.power;
  const personality=makePersonality();
  const profile=deriveStats(p);
  const story=makeStory(p,personality);
  const rar=profile.rarity;
  const statHTML=Object.entries(profile.stats).map(([k,v])=>`<div class="stat"><span>${esc(k)}</span><b>${v}</b><i><em style="width:${v}%"></em></i></div>`).join('');
  const refs=state.picks.map(x=>{const v=normalizeItem(x.value);return v.ref?`<div class="reference"><span>${esc(x.question)}</span><b>${esc(v.ref)}</b></div>`:''}).join('');
  document.querySelector('#app').innerHTML=`
   <main class="screen final-screen" style="--rarity:${rar.color}">
    <header class="topbar"><span>ROULETA DA VIDA</span><span>V8</span></header>
    <section class="reveal">
      <div class="stars" aria-label="${rar.stars} estrelas">${'★'.repeat(rar.stars)}</div>
      <div class="rarity">${rar.name}</div>
      <h1>${esc(p.name)}</h1>
      <p>${esc(label(p.race))} · ${esc(label(p.title))}</p>
    </section>
    <section class="stats">${statHTML}</section>
    <section class="story"><h2>O QUE O LEVOU ATÉ AQUI</h2>${story.map(x=>`<p>${esc(x)}</p>`).join('')}</section>
    <section class="references"><h2>REFERÊNCIAS</h2>${refs||'<p>Conceitos combinados a partir da biblioteca local.</p>'}</section>
    <button class="again" data-action="new">NOVO PERSONAGEM</button>
   </main>`;
}
function newCharacter(){
  state={step:0,picks:[],hasPower:false,rotation:0,spinning:false,spinToken:state.spinToken+1};
  render();window.scrollTo({top:0,behavior:'instant'});
}
document.addEventListener('click',e=>{
  const action=e.target.closest('[data-action]')?.dataset.action;
  if(action==='spin')spin();
  else if(action==='next')next();
  else if(action==='new')newCharacter();
});
let resizeTimer;
window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>visualWheel($('#wheel')),80)});
window.addEventListener('pageshow',()=>{if(!state.spinning)render()});
render();
if(typeof hydrateReferencePool==='function')hydrateReferencePool();
