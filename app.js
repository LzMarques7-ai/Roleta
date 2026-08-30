/* ROULETA DA VIDA — V9
   V8 wheel preserved.
   V9 changes: 16 character-focused rolls, true 9-star post-roll rarity,
   no power-domain roll when powers = No, reference provenance, detailed origin,
   collectible-card presentation, defensive state handling.
*/
(() => {
"use strict";

const app=document.getElementById("app");
if(!app) return;

const STEPS=[
 ["race","Qual sua raça?"],
 ["title","Qual seu título?"],
 ["appearance","Como você é?"],
 ["name","Qual é o seu nome?"],
 ["age","Qual sua idade?"],
 ["condition","Como é seu corpo?"],
 ["force","Qual é sua força?"],
 ["speed","Qual é sua velocidade?"],
 ["intelligence","Qual é sua inteligência?"],
 ["combat","Como você luta?"],
 ["talent","Qual é seu talento?"],
 ["hasPower","Possui poderes?"],
 ["power","Qual é o seu poder?"],
 ["control","Quanto domina seu poder?"],
 ["weapons","Arma ou equipamento?"],
 ["life","Como será sua vida?"]
];

const state={index:0,picks:Object.create(null),rotation:0,spinning:false,timer:null};

const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function activeSteps(){
  return STEPS.filter(([k])=>{
    if(k==="power" || k==="control") return state.picks.hasPower?.name==="Sim";
    return true;
  });
}

function safe(v){
  if(Array.isArray(v)) return {name:String(v[0]??"—"),value:v[1]};
  if(v && typeof v==="object") return {
    name:String(v.name??v.label??"—"),
    value:v.value,
    ref:v.ref||""
  };
  return {name:String(v??"—")};
}

function choose(k){
  if(k==="race") return safe(RV.race());
  if(k==="name") return {name:String(RV.name())};
  if(k==="hasPower") return {name:RV.yesPower()?"Sim":"Não"};
  if(k==="power") return safe(RV.power());

  if(k==="title"){
    const a=window.LIBRARY?.titles;
    return a?.length ? safe(a[RV.randomInt(a.length)]) : safe(RV.draw("titles"));
  }
  if(k==="age"){
    const a=window.LIBRARY?.ages;
    return a?.length ? safe(a[RV.randomInt(a.length)]) : safe(RV.draw("ages"));
  }

  try{
    if(typeof RV.draw==="function") return safe(RV.draw(k));
  }catch(e){
    console.warn("Sorteio protegido:",k,e);
  }

  const direct=window.LIBRARY?.[k];
  if(Array.isArray(direct)&&direct.length) return safe(direct[RV.randomInt(direct.length)]);
  return {name:"—"};
}

/* Referências reais/educativas: quando a própria entrada já traz a obra,
   usamos-a; para nomes conhecidos, enriquecemos a ficha. */
const REFS={
 "Ghoul":"Tokyo Ghoul",
 "Saiyajin":"Dragon Ball",
 "Namekuseijin":"Dragon Ball",
 "Kryptoniano":"DC — Superman",
 "Viltrumita":"Invincible",
 "Asgardiano":"Marvel / mitologia nórdica",
 "Shinigami":"Bleach / tradição japonesa",
 "Hollow":"Bleach",
 "Quincy":"Bleach",
 "Homúnculo":"Fullmetal Alchemist / alquimia",
 "Symbiote":"Marvel",
 "Guardião de Oa":"DC — Green Lantern",
 "Kree":"Marvel",
 "Skrull":"Marvel",
 "Time Lord":"Doctor Who",
 "Dalek":"Doctor Who",
 "Cyberman":"Doctor Who",
 "Saiyajin":"Dragon Ball",
 "Twi’lek":"Star Wars",
 "Wookiee":"Star Wars",
 "Vulcano":"Star Trek",
 "Klingon":"Star Trek",
 "Zerg":"StarCraft",
 "Protoss":"StarCraft",
 "Predador":"Predator",
 "Djinn":"mitologia árabe / folclore islâmico",
 "Ifrit":"folclore islâmico",
 "Jinn":"folclore árabe",
 "Rakshasa":"mitologia hindu",
 "Asura":"mitologia hindu/budista",
 "Valkyrie":"mitologia nórdica",
 "Kitsune":"folclore japonês",
 "Oni":"folclore japonês",
 "Yōkai":"folclore japonês",
 "Medusa":"mitologia grega",
 "Minotauro":"mitologia grega",
 "Fênix":"mitologias e literatura fantástica",
 "Grifo":"mitologia e folclore europeu",
 "Banshee":"folclore irlandês",
 "Dullahan":"folclore irlandês",
 "Kelpie":"folclore escocês",
 "Naga":"mitologias do sul e sudeste asiático",
 "Dríade":"mitologia grega",
 "Ninfa":"mitologia grega",
 "Fauno":"mitologia romana",
 "Súcubo":"folclore europeu",
 "Íncubo":"folclore europeu",
 "Lobisomem":"folclore europeu",
 "Vampiro":"folclore europeu / literatura gótica",
 "Anjo":"tradições abraâmicas",
 "Serafim":"tradições abraâmicas",
 "Semideus":"mitologias diversas",
 "Deus":"mitologias e ficção",
 "Mjölnir":"mitologia nórdica / Marvel",
 "Stormbreaker":"Marvel",
 "Excalibur":"lenda arturiana",
 "Kusanagi":"mitologia japonesa",
 "Keyblade":"Kingdom Hearts",
 "Buster Sword":"Final Fantasy VII",
 "Sabre de luz — Star Wars":"Star Wars"
};

const POWER_REFS={
 "Regeneração — Wolverine":"Marvel — Wolverine",
 "Telepatia — Professor X":"Marvel — Professor X",
 "Viagem no tempo — Doctor Who":"Doctor Who",
 "Alquimia — Fullmetal Alchemist":"Fullmetal Alchemist",
 "Nen — Hunter × Hunter":"Hunter × Hunter",
 "Chakra — Naruto":"Naruto",
 "Ki — Dragon Ball":"Dragon Ball",
 "Bankai — Bleach":"Bleach",
 "Geass — Code Geass":"Code Geass",
 "Respiração do Sol — Demon Slayer":"Demon Slayer",
 "One For All — My Hero Academia":"My Hero Academia",
 "Stand — JoJo's Bizarre Adventure":"JoJo's Bizarre Adventure",
 "Magenkyō Sharingan — Naruto":"Naruto",
 "Manipulação de sonhos — Sandman e mitologia":"The Sandman / mitologia",
 "sabre de luz — Star Wars":"Star Wars"
};

function refFor(x){
  if(!x?.name) return null;
  const n=x.name;
  if(POWER_REFS[n]) return POWER_REFS[n];
  if(n.includes(" — ")) return n.split(" — ").slice(1).join(" — ");
  for(const key of Object.keys(REFS)) if(n===key || n.includes(key)) return REFS[key];
  return null;
}

function scoreOf(x){
  const n=Number(x?.value);
  if(Number.isFinite(n)) return Math.max(0,Math.min(100,n));
  return 50;
}

/* Raridade é calculada somente depois. Não altera nenhuma probabilidade.
   O resultado é uma classificação do conjunto, não um peso do sorteio. */
function calculateRarity(p){
  const values=[
    p.race?.rank!=null ? p.race.rank*9.09 : 30,
    scoreOf(p.condition),scoreOf(p.force),scoreOf(p.speed),
    scoreOf(p.intelligence),scoreOf(p.combat),scoreOf(p.talent),
    scoreOf(p.control),scoreOf(p.weapons),scoreOf(p.life)
  ];
  if(p.hasPower?.name==="Sim") values.push(scoreOf(p.power));
  else values.push(10);

  const avg=values.reduce((a,b)=>a+b,0)/values.length;
  const extreme=values.filter(v=>v>=90).length;
  const rareRef=(refFor(p.race)||refFor(p.power)||refFor(p.weapons))?5:0;

  let stars;
  if(avg<20) stars=1;
  else if(avg<32) stars=2;
  else if(avg<44) stars=3;
  else if(avg<56) stars=4;
  else if(avg<68) stars=5;
  else if(avg<78) stars=6;
  else if(avg<88) stars=7;
  else if(avg<95) stars=8;
  else stars=9;

  /* Extremes and unusual references can elevate an otherwise middling
     character, without changing any draw probability. */
  if(stars<9 && extreme>=4) stars++;
  if(stars<9 && rareRef && avg>=58) stars++;
  stars=Math.max(1,Math.min(9,stars));

  const meta=[
    ["Comum","#777777"],["Incomum","#63d68b"],["Raro","#55a8ff"],
    ["Épico","#9c6cff"],["Mítico","#ed63d3"],["Lendário","#ffad42"],
    ["Divino","#fff05c"],["Transcendente","#58e9ff"],["Absoluto","#ffffff"]
  ][stars-1];

  return {stars,name:meta[0],color:meta[1],avg};
}

function rarityStars(n){return "★".repeat(n)+"☆".repeat(9-n)}

function makePersonality(){
  const pick=a=>a[RV.randomInt(a.length)];
  return {
    trait:pick(["reservado","curioso","determinado","orgulhoso","melancólico","impulsivo","calculista","compassivo","ambicioso","desconfiado"]),
    ideal:pick(["liberdade","conhecimento","proteção","poder","justiça","verdade","independência"]),
    flaw:pick(["orgulho","impaciência","medo de falhar","desconfiança","teimosia","isolamento"]),
    goal:pick(["entender sua própria natureza","proteger alguém importante","superar seus próprios limites","descobrir a verdade sobre seu passado","viver sem depender de ninguém"]),
    fear:pick(["perder o controle","ficar sozinho","descobrir uma verdade pior do que imaginava","não alcançar seu potencial"])
  };
}

function buildOrigin(p){
  const race=p.race?.name||"desconhecida";
  const title=p.title?.name||"sem título";
  const age=p.age?.name||"idade desconhecida";
  const appearance=p.appearance?.name||"aparência comum";
  const condition=p.condition?.name||"condição comum";
  const force=p.force?.name||"força comum";
  const speed=p.speed?.name||"velocidade comum";
  const intel=p.intelligence?.name||"inteligência comum";
  const combat=p.combat?.name||"sem experiência";
  const talent=p.talent?.name||"nenhum talento excepcional";
  const weapon=p.weapons?.name||"nenhuma arma";
  const life=p.life?.name||"Comum";
  const power=p.power?.name||"nenhum poder";
  const control=p.control?.name||"sem domínio especial";
  const pers=makePersonality();

  const referenceLines=[];
  for(const [label,obj] of [
    ["Raça",p.race],["Poder",p.power],["Arma/equipamento",p.weapons]
  ]){
    const r=refFor(obj);
    if(r) referenceLines.push(`${label}: ${obj.name} — referência: ${r}.`);
  }

  const originTone = [
    "A vida começou sem qualquer garantia de grandeza.",
    "Desde cedo havia algo incomum naquela existência.",
    "A primeira impressão que deixava nas pessoas escondia o que ainda viria a despertar."
  ][RV.randomInt(3)];

  const turning = p.hasPower?.name==="Sim"
    ? `O ponto de ruptura aconteceu quando o poder ${power} apareceu. No começo, possuir a habilidade não significava dominá-la: ${control.toLowerCase()} era o limite daquele momento.`
    : `Não houve despertar sobrenatural. A trajetória precisou ser construída sem um poder próprio, e isso tornou cada conquista dependente de ${combat.toLowerCase()}, disciplina e das escolhas feitas ao longo da vida.`;

  const body = [
    `### O começo`,
    `${originTone} Nascido como ${race}, com ${age}, apresentava ${appearance} e uma ${condition}. Seu título naquele momento era ${title}.`,
    `### O que existia por trás`,
    `As capacidades começaram a aparecer de maneiras diferentes. Sua força era ${force}; sua velocidade, ${speed}; sua inteligência, ${intel}; e sua experiência de combate era descrita como ${combat}. O talento mais marcante era ${talent}.`,
    `### A virada`,
    turning,
    `### O caminho`,
    `A vida tomou um rumo ${life.toLowerCase()}. O personagem passou a ser reconhecido como ${title}, enquanto ${weapon.toLowerCase()} se tornou parte importante de sua identidade. O que parecia uma característica isolada começou a alterar suas escolhas e a forma como outras pessoas o enxergavam.`,
    `### Quem ele se tornou`,
    `Com o tempo, ${pers.trait} tornou-se uma das marcas de sua personalidade. Buscava ${pers.ideal}, carregava o defeito de ${pers.flaw} e perseguia o objetivo de ${pers.goal}. O maior medo era ${pers.fear}.`,
    `### Presente`,
    `É assim que a combinação sorteada deixou de ser apenas uma lista de atributos e virou uma pessoa: ${race}, ${title}, ${age}, com ${force}, ${speed}, ${intel} e ${combat}. Sua história chegou ao ponto em que suas próprias características passaram a definir o tipo de futuro que poderia construir.`,
    ...(referenceLines.length?["### Referências",...referenceLines]:[])
  ];
  return body;
}

function drawWheel(){
  const c=document.getElementById("wheel"); if(!c)return;
  const b=c.parentElement;
  const size=Math.max(220,Math.floor(Math.min(b.clientWidth,b.clientHeight)));
  const d=Math.min(devicePixelRatio||1,2);
  c.width=size*d;c.height=size*d;c.style.width=size+"px";c.style.height=size+"px";
  const x=c.getContext("2d");x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,size,size);
  const cx=size/2,cy=size/2,r=size/2-2,n=60;
  for(let i=0;i<n;i++){
    const a=-Math.PI/2+i*2*Math.PI/n,z=-Math.PI/2+(i+1)*2*Math.PI/n;
    x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,r,a,z);x.closePath();
    x.fillStyle=i%2?"#080808":"#101010";x.fill();
    x.strokeStyle="#1d1d1d";x.lineWidth=1;x.stroke();
  }
  x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.strokeStyle="#333";x.lineWidth=1.5;x.stroke();
}

function render(){
  const list=activeSteps();
  if(state.index>=list.length){reveal();return;}
  const [key,q]=list[state.index];

  app.innerHTML=`
  <main class="screen">
    <header><span>ROULETA DA VIDA</span><span>V9</span></header>
    <div class="title">Roleta da Vida</div>
    <div class="counter">${state.index+1} / ${list.length}</div>
    <section class="wheelbox">
      <div class="pointer" aria-hidden="true"></div>
      <canvas id="wheel"></canvas>
      <button id="spin" type="button">GIRAR</button>
    </section>
    <h2>${esc(q)}</h2>
    <div id="result" class="result" aria-live="polite">
      <div class="result-value">—</div><div class="result-label">aguardando giro</div>
    </div>
    <div id="continueArea" class="continue-area"></div>
  </main>`;
  drawWheel();
}

function showResult(v,last){
  const r=document.getElementById("result"),a=document.getElementById("continueArea");
  if(!r||!a)return;
  const n=safe(v);
  r.classList.add("has-result");
  r.innerHTML=`<div class="result-value">${esc(n.name)}</div><div class="result-label">resultado sorteado</div>`;
  a.innerHTML=`<button id="nextButton" class="next" type="button" data-action="${last?"reveal":"next"}">${last?"REVELAR PERSONAGEM":"PRÓXIMO"}</button>`;
}

function spin(){
  if(state.spinning)return;
  const list=activeSteps(),cur=list[state.index];
  const wheel=document.getElementById("wheel"),button=document.getElementById("spin");
  if(!cur||!wheel||!button)return;

  const [key]=cur,value=choose(key),last=state.index===list.length-1;
  state.spinning=true;button.disabled=true;button.textContent="…";
  state.rotation+=(5+RV.randomInt(4))*360+RV.randomInt(360);
  wheel.style.transform=`rotate(${state.rotation}deg)`;
  clearTimeout(state.timer);
  state.timer=setTimeout(()=>{
    state.picks[key]=safe(value);
    state.spinning=false;
    showResult(state.picks[key],last);
  },4200);
}

function reveal(){
  if(state.spinning)return;
  const p={...state.picks};
  p.hasPower=p.hasPower?.name==="Sim";

  if(!p.name)p.name={name:RV.name()};
  if(!p.race)p.race={name:"Humano",rank:1};
  if(!p.title)p.title={name:"Ninguém"};
  if(!p.age)p.age={name:"18 anos"};
  if(!p.appearance)p.appearance={name:"aparência comum"};
  if(!p.condition)p.condition={name:"condição comum"};
  if(!p.force)p.force={name:"fisicamente comum",value:1};
  if(!p.speed)p.speed={name:"velocidade comum",value:1};
  if(!p.intelligence)p.intelligence={name:"comum",value:1};
  if(!p.combat)p.combat={name:"sem experiência",value:1};
  if(!p.talent)p.talent={name:"nenhum talento excepcional",value:0};
  if(!p.weapons)p.weapons={name:"Nenhuma",value:0};
  if(!p.life)p.life={name:"Comum",value:0};
  if(!p.hasPower){delete p.power;delete p.control}
  else {
    if(!p.power)p.power={name:"Poder desconhecido",value:50};
    if(!p.control)p.control={name:"controle básico",value:30};
  }

  const rarity=calculateRarity(p);
  document.body.className=`rarity-${rarity.stars}`;

  const story=buildOrigin(p);
  const refs=[
    ["Raça",p.race],["Poder",p.power],["Arma / equipamento",p.weapons]
  ].filter(([,x])=>refFor(x));

  const stat=(label,x)=>`<div class="stat"><span>${esc(label)}</span><b>${esc(x?.name||"—")}</b></div>`;

  app.innerHTML=`
  <main class="screen final" style="--rarity:${esc(rarity.color)}">
    <header><span>ROULETA DA VIDA</span><span>V9</span></header>
    <section class="card">
      <div class="card-top">
        <div class="stars">${rarityStars(rarity.stars)}</div>
        <div class="rarity-name">${esc(rarity.name)}</div>
      </div>
      <div class="name">${esc(p.name.name)}</div>
      <div class="sub">${esc(p.race.name)} · ${esc(p.title.name)} · ${esc(p.age.name)}</div>
      <div class="card-badge">${rarity.stars}/9</div>
    </section>

    <section class="stats">
      ${stat("RAÇA",p.race)}${stat("TÍTULO",p.title)}
      ${stat("APARÊNCIA",p.appearance)}${stat("CONDIÇÃO",p.condition)}
      ${stat("FORÇA",p.force)}${stat("VELOCIDADE",p.speed)}
      ${stat("INTELIGÊNCIA",p.intelligence)}${stat("COMBATE",p.combat)}
      ${stat("TALENTO",p.talent)}${stat("PODER",p.hasPower?p.power:{name:"Nenhum"})}
      ${stat("DOMÍNIO",p.hasPower?p.control:{name:"Não se aplica"})}${stat("ARMA / EQUIPAMENTO",p.weapons)}
      ${stat("TIPO DE VIDA",p.life)}
    </section>

    ${refs.length?`<section class="refs"><h3>DE ONDE VIERAM AS REFERÊNCIAS</h3>${refs.map(([l,x])=>`<p><b>${esc(l)}:</b> ${esc(x.name)}<br><span>${esc(refFor(x))}</span></p>`).join("")}</section>`:""}

    <section class="story"><h3>ORIGEM DO PERSONAGEM</h3>${story.map(x=>x.startsWith("### ")?`<h4>${esc(x.slice(4))}</h4>`:`<p>${esc(x)}</p>`).join("")}</section>

    <button id="newCharacter" class="again" type="button">NOVO PERSONAGEM</button>
  </main>`;
}

document.addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.id==="spin"){e.preventDefault();spin();return}
  if(b.id==="nextButton"){
    e.preventDefault();
    if(b.dataset.action==="reveal")reveal();
    else {state.index++;render()}
    return;
  }
  if(b.id==="newCharacter"){
    e.preventDefault();
    clearTimeout(state.timer);
    state.index=0;state.picks=Object.create(null);state.rotation=0;state.spinning=false;
    document.body.className="";
    window.scrollTo(0,0);render();
  }
},true);

window.addEventListener("resize",()=>{if(!state.spinning&&document.getElementById("wheel"))drawWheel()});
render();
})();