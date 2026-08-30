/* V8 HOTFIX — resultado da raça + REVELAR PERSONAGEM
   Substitua apenas app.js.
   Este arquivo mantém a lógica da V8 e corrige o fluxo de navegação. */
(() => {
"use strict";
const app=document.getElementById("app");
if(!app)return;

const steps=[
["race","Qual sua raça?"],["title","Qual seu título?"],["appearance","Como você é?"],
["name","Qual é o seu nome?"],["age","Qual sua idade?"],["condition","Como é seu corpo?"],
["force","Qual é sua força?"],["speed","Qual é sua velocidade?"],
["intelligence","Qual é sua inteligência?"],["combat","Como você luta?"],
["talent","Qual é seu talento?"],["hasPower","Possui poderes?"],
["power","Qual é o seu poder?"],["control","Quanto domina seu poder?"],
["weapons","Arma ou equipamento?"],["potential","Qual é seu potencial?"],
["life","Como será sua vida?"]
];

const S={i:0,p:{},rot:0,busy:false,timer:null};
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function active(){return steps.filter(x=>x[0]!=="power"||S.p.hasPower?.name==="Sim")}

function list(k){
  return [];
}

function pick(k){
  const safeNorm = value => {
    if(Array.isArray(value)){
      return {name:String(value[0] ?? "—"), value:value[1]};
    }
    if(value && typeof value === "object"){
      return {name:String(value.name ?? value.label ?? "—"), value:value.value};
    }
    if(value != null) return {name:String(value)};
    return {name:"—"};
  };

  const safeLibraryPick = key => {
    const pool = window.LIBRARY?.[key];
    if(!Array.isArray(pool) || pool.length === 0) return null;
    return safeNorm(pool[RV.randomInt(pool.length)]);
  };

  if(k==="race") return safeNorm(RV.race());
  if(k==="name") return {name:String(RV.name())};
  if(k==="hasPower") return {name:RV.yesPower() ? "Sim" : "Não"};
  if(k==="power") return safeNorm(RV.power());

  /* TÍTULO e IDADE são as duas categorias que têm nomes diferentes
     entre a pergunta, o engine e a biblioteca. Elas são resolvidas
     diretamente pelas chaves reais da LIBRARY. */
  if(k==="title"){
    return safeLibraryPick("titles")
      || {name:"Ninguém"};
  }

  if(k==="age"){
    return safeLibraryPick("ages")
      || {name:"18 anos"};
  }

  /* Categorias que usam as chaves reais do engine. */
  const engineKey = {
    appearance:"appearance",
    condition:"condition",
    force:"force",
    speed:"speed",
    intelligence:"intelligence",
    combat:"combat",
    talent:"talent",
    control:"control",
    weapons:"weapons",
    potential:"potential",
    life:"life"
  }[k];

  if(engineKey && typeof RV.draw==="function"){
    try{
      const value=RV.draw(engineKey);
      if(value && value.name) return safeNorm(value);
    }catch(error){
      console.warn("Falha no sorteio de", k, error);
    }
  }

  /* Último fallback: biblioteca direta. */
  const direct = safeLibraryPick(k);
  if(direct) return direct;

  return {name:"—"};
}
function draw(){
const c=document.getElementById("wheel");if(!c)return;
const b=c.parentElement,size=Math.max(220,Math.floor(Math.min(b.clientWidth,b.clientHeight))),d=Math.min(devicePixelRatio||1,2);
c.width=size*d;c.height=size*d;c.style.width=size+"px";c.style.height=size+"px";
const x=c.getContext("2d");x.setTransform(d,0,0,d,0,0);
const cx=size/2,cy=size/2,r=size/2-2,n=60;
x.clearRect(0,0,size,size);
for(let i=0;i<n;i++){
const a=-Math.PI/2+i*2*Math.PI/n,z=-Math.PI/2+(i+1)*2*Math.PI/n;
x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,r,a,z);x.closePath();
x.fillStyle=i%2?"#080808":"#101010";x.fill();x.strokeStyle="#1d1d1d";x.stroke();
}
x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.strokeStyle="#333";x.lineWidth=1.5;x.stroke();
}

function render(){
const a=active();
if(S.i>=a.length){reveal();return}
const [k,q]=a[S.i];
app.innerHTML=`<main class="screen"><header><span>ROULETA DA VIDA</span><span>V8</span></header>
<div class="title">Roleta da Vida</div><div class="counter">${S.i+1} / ${a.length}</div>
<section class="wheelbox"><div class="pointer"></div><canvas id="wheel"></canvas><button id="spin" type="button">GIRAR</button></section>
<h2>${esc(q)}</h2><div id="result" class="result" aria-live="polite"><div class="result-value">—</div><div class="result-label">aguardando giro</div></div>
<div id="continueArea" class="continue-area"></div></main>`;
draw();
}

function result(v,last){
const r=document.getElementById("result"),a=document.getElementById("continueArea");if(!r||!a)return;
const n=RV.norm(v);
r.classList.add("has-result");
r.innerHTML=`<div class="result-value">${esc(n.name)}</div><div class="result-label">resultado sorteado</div>`;
a.innerHTML=`<button id="nextButton" class="next" type="button" data-action="${last?"reveal":"next"}">${last?"REVELAR PERSONAGEM":"PRÓXIMO"}</button>`;
}

function spin(){
if(S.busy)return;
const a=active(),cur=a[S.i],w=document.getElementById("wheel"),b=document.getElementById("spin");
if(!cur||!w||!b)return;
const [k]=cur,v=pick(k),last=S.i===a.length-1;
S.busy=true;b.disabled=true;b.textContent="…";
S.rot+=(5+RV.randomInt(4))*360+RV.randomInt(360);
w.style.transform=`rotate(${S.rot}deg)`;
clearTimeout(S.timer);
S.timer=setTimeout(()=>{
S.p[k]=RV.norm(v);
S.busy=false;
result(S.p[k],last);
},4200);
}

function personality(){
const q=a=>a[RV.randomInt(a.length)];
return{
trait:q(["reservado","curioso","determinado","orgulhoso","melancólico","impulsivo","calculista","compassivo","ambicioso","desconfiado"]),
ideal:q(["liberdade","conhecimento","proteção","poder","justiça","verdade","independência"]),
flaw:q(["orgulho","impaciência","medo de falhar","desconfiança","teimosia","isolamento"]),
goal:q(["entender sua própria natureza","proteger alguém importante","superar seus próprios limites","encontrar respostas sobre seu passado","viver sem depender de ninguém"]),
fear:q(["perder o controle","ficar sozinho","descobrir uma verdade pior do que imaginava","não alcançar seu potencial"])
};
}

function reveal(){
if(S.busy)return;
const p={...S.p};

p.hasPower=p.hasPower?.name==="Sim";
if(!p.name?.name)p.name={name:RV.name()};

/* aliases exigidos pelo story.js */
if(!p.weapon)p.weapon=p.weapons||{name:"Nenhuma"};
if(!p.origin)p.origin={name:"uma origem não determinada"};
if(!p.age)p.age={name:"idade indeterminada"};
if(!p.appearance)p.appearance={name:"aparência comum"};
if(!p.condition)p.condition={name:"condição comum"};
if(!p.talent)p.talent={name:"nenhum talento excepcional"};
if(!p.combat)p.combat={name:"sem experiência"};
if(!p.control)p.control={name:"não possui controle especial"};
if(!p.life)p.life={name:"Comum"};
if(!p.hasPower)delete p.power;

let prof;
try{prof=RV.profile(p)}catch(e){console.error("RV.profile:",e);return}

let story;
try{story=STORY_ENGINE.make(p,personality())}
catch(e){console.error("STORY_ENGINE:",e);story=["O personagem foi formado pelas características sorteadas.","Sua trajetória será definida a partir de quem ele se tornou."]}

const r=prof.rarity||{stars:1,name:"Comum",color:"#777"};
document.body.className=`rarity-${r.stars}`;

const stats=Object.entries(prof.labels||{}).map(([k,v])=>
`<div class="stat"><span>${esc(k)}</span><b>${esc(v?.name||"—")}</b></div>`).join("");

app.innerHTML=`<main class="screen final" style="--rarity:${esc(r.color)}">
<header><span>ROULETA DA VIDA</span><span>V8</span></header>
<section class="reveal"><div class="stars">${"★".repeat(r.stars)}</div>
<div class="rarity-name">${esc(r.name)}</div><div class="name">${esc(p.name.name)}</div>
<div class="sub">${esc(p.race?.name||"")}${p.title?.name?" · "+esc(p.title.name):""}</div></section>
<section class="stats">${stats}</section>
<section class="story"><h3>COMO CHEGOU ATÉ AQUI</h3>${story.map(x=>`<p>${esc(x)}</p>`).join("")}</section>
<button id="newCharacter" class="again" type="button">NOVO PERSONAGEM</button></main>`;
}

/* Um único listener permanente no document.
   #app é recriado a cada etapa, portanto listeners presos aos botões anteriores
   não são usados para controlar a navegação. */
document.addEventListener("click",e=>{
const b=e.target.closest("button");if(!b)return;
if(b.id==="spin"){e.preventDefault();spin();return}
if(b.id==="nextButton"){
e.preventDefault();
if(b.dataset.action==="reveal")reveal();
else{S.i++;render()}
return;
}
if(b.id==="newCharacter"){
e.preventDefault();clearTimeout(S.timer);
S.i=0;S.p={};S.rot=0;S.busy=false;document.body.className="";
window.scrollTo(0,0);render();
}
},true);

window.addEventListener("resize",()=>{if(!S.busy&&document.getElementById("wheel"))draw()});
render();
})();