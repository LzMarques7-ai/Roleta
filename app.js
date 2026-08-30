const A=x=>x[Math.floor(Math.random()*x.length)];
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));
const rounds=[
["race","Qual sua raça?","races"],["title","Qual seu título?","titles"],["age","Qual sua idade?","ages"],
["physical","Força e durabilidade?","physical"],["speed","Velocidade?","speed"],["intelligence","Inteligência?","intelligence"],
["combat","Combate?","combat"],["hasPower","Possui poderes?","hasPower"],["power","Qual poder?","powers"],
["weapon","Arma?","weapons"],["luck","Sorte?","luck"],["weakness","Fraqueza?","weakness"],["potential","Potencial?","potential"]
];
let S={i:0,picks:[],powerEnabled:false};

function options(key){
  if(key==="hasPower") return ["Não","Sim"];
  return LIBRARY[key] || [];
}
function activeRounds(){ return S.powerEnabled ? rounds : rounds.filter(r=>r[0]!=="power"); }
function reset(){S={i:0,picks:[],powerEnabled:false};render()}
function render(){
  const rs=activeRounds(), r=rs[S.i];
  const localCount=Object.values(LIBRARY).reduce((n,a)=>n+a.length,0);
  const remoteCount=REMOTE_LIBRARY.characters.length;
  document.querySelector("#app").innerHTML=`<main class="wrap">
  <header><b>CHARACTER ROULETTE</b><span>V5</span></header>
  <section class="intro"><div class="tag">GERADOR DE PERSONAGEM</div><h1>Uma roleta.<br>Qualquer resultado.</h1>
  <p>Um giro por vez. Cada opção da categoria possui exatamente o mesmo peso.</p></section>
  <section class="card"><div class="progress"><i style="width:${S.i/rs.length*100}%"></i></div>
  <div class="counter">${S.i+1} / ${rs.length}</div><h2>${r[1]}</h2><p class="muted">O resultado só é revelado no fim do giro.</p>
  <div class="wheel"><div id="rolling">?</div><small>ROLE PARA DESCOBRIR</small></div>
  <button id="go">GIRAR</button><div id="result" class="result hidden"></div></section>
  <section class="card mini"><b>BIBLIOTECA</b><p>${localCount} opções-base + ${remoteCount} personagens carregados de catálogos públicos.</p>
  </section></main>`;
  document.querySelector("#go").onclick=spin;
}
function spin(){
  const r=activeRounds()[S.i], list=options(r[2]);
  const go=document.querySelector("#go"), box=document.querySelector("#rolling"), result=document.querySelector("#result");
  go.disabled=true; let t=0;
  const timer=setInterval(()=>{box.textContent=A(list);t++;if(t>34){
    clearInterval(timer);const value=A(list);S.picks.push({key:r[0],value});if(r[0]==="hasPower")S.powerEnabled=value==="Sim";
    box.textContent=value;result.classList.remove("hidden");result.innerHTML=`<b>${esc(value)}</b><span>Resultado registrado.</span>`;
    go.textContent=S.i===activeRounds().length-1?"VER PERSONAGEM":"PRÓXIMO GIRO";go.disabled=false;go.onclick=next;
  }},48);
}
function next(){if(S.i===activeRounds().length-1){finish();return}S.i++;render()}

function scoreFromLabel(v,type){
  const lists={physical:LIBRARY.physical,speed:LIBRARY.speed,intelligence:LIBRARY.intelligence,combat:LIBRARY.combat,luck:LIBRARY.luck,potential:LIBRARY.potential};
  const a=lists[type]||[];
  const i=a.indexOf(String(v).toLowerCase()==String(v)?v:String(v));
  return i<0?Math.min(100,10+(String(v).length*13)%91):Math.round(5+i*95/Math.max(1,a.length-1));
}
function scorePower(p){return Math.min(100,25+(String(p).length*17)%76)}
function finish(){
  const map=Object.fromEntries(S.picks.map(x=>[x.key,x.value]));
  const stats={
    Força:scoreFromLabel(map.physical,"physical"),Durabilidade:scoreFromLabel(map.physical,"physical"),
    Velocidade:scoreFromLabel(map.speed,"speed"),Inteligência:scoreFromLabel(map.intelligence,"intelligence"),
    Combate:scoreFromLabel(map.combat,"combat"),Poder:map.power?scorePower(map.power):0,
    Potencial:scoreFromLabel(map.potential,"potential"),Sorte:scoreFromLabel(map.luck,"luck")
  };
  const score=Math.round(Object.values(stats).reduce((a,b)=>a+b,0)/8);
  const name=A(["Aren","Kael","Ren","Nox","Sora","Riven","Orion","Aster","Kairo","Lys","Darian","Veyra","Noa","Akira"])+" "+A(["Valen","Kane","Voss","Ardent","Noctis","Solari","Raven","Zenith","Astra","Kuro"]);
  const rows=Object.entries(stats).map(([k,v])=>`<div class="stat"><span>${k}</span><b>${v}</b><i><em style="width:${v}%"></em></i></div>`).join("");
  const results=S.picks.map(x=>`<div class="row"><span>${rounds.find(r=>r[0]===x.key)?.[1]}</span><b>${esc(x.value)}</b></div>`).join("");
  const p=map.power?`despertou ${map.power}`:"não recebeu nenhum poder";
  document.querySelector("#app").innerHTML=`<main class="wrap"><header><b>CHARACTER ROULETTE</b><span>V5</span></header>
  <section class="hero"><div class="tag">PERSONAGEM GERADO</div><h1>${name}</h1><p>${esc(map.race)} • ${esc(map.title)} • ${esc(map.age)}</p><strong>${score}/100</strong></section>
  <section class="card"><h2>Estatísticas</h2><div class="stats">${rows}</div></section>
  <section class="card"><h2>Ficha sorteada</h2><div class="rows">${results}</div></section>
  <section class="card"><h2>História</h2><p class="story">${name} nasceu como ${esc(map.race).toLowerCase()} e recebeu o título de ${esc(map.title).toLowerCase()}. Aos ${esc(map.age)}, possuía ${esc(map.physical).toLowerCase()} força e durabilidade, ${esc(map.speed).toLowerCase()} velocidade, ${esc(map.intelligence).toLowerCase()} inteligência e ${esc(map.combat).toLowerCase()} experiência de combate. Em seu caminho, ${p}. Sua arma era ${esc(map.weapon).toLowerCase()}, sua sorte era ${esc(map.luck).toLowerCase()} e carregava a fraqueza: ${esc(map.weakness).toLowerCase()}. Seu potencial foi classificado como ${esc(map.potential).toLowerCase()}. A história começa agora — sem balanceamento artificial.</p></section>
  <section class="card"><button id="again">CRIAR OUTRO</button></section></main>`;
  document.querySelector("#again").onclick=reset;
}
window.addEventListener("libraryready",()=>{if(document.querySelector(".mini"))render()});
reset();