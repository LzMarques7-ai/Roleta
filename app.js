/* ROULETA DA VIDA — V11 • AI ART
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
  /* O valor numérico continua sendo apenas um sinal de escala.
     A raridade NÃO é uma soma de "pontos de poder". */
  const n=Number(x?.value);
  if(Number.isFinite(n)) return Math.max(0,Math.min(100,n));

  const effects=x?.effects||{};
  const vals=Object.values(effects).map(Number).filter(Number.isFinite);
  if(vals.length) return Math.max(0,Math.min(100,50+Math.max(...vals)*2));
  return 45;
}

function itemTier(x){
  const v=scoreOf(x);
  if(v<=15) return 0;       // praticamente inútil
  if(v<=32) return 1;       // fraco
  if(v<=50) return 2;       // comum
  if(v<=68) return 3;       // competente
  if(v<=82) return 4;       // excepcional
  if(v<=91) return 5;       // sobre-humano
  if(v<=96) return 6;       // monstruoso
  if(v<=99) return 7;       // extremo
  return 8;                 // limite conceitual / absoluto
}

function calculateRarity(p){
  /*
    V9.1 — classificação por perfil, não por "nota 100".

    O sorteio continua 100% uniforme. A classificação só acontece depois.
    Em vez de somar atributos, observamos:
      • o pior lado do personagem;
      • quantas áreas realmente excepcionais existem;
      • o teto de poder/raça;
      • sinergias raras entre resultados;
      • presença ou ausência de poder.

    Isso permite algo que a versão anterior não fazia bem:
    um personagem com UM resultado absurdo e várias fraquezas pode ser
    mediano, enquanto uma combinação consistente de resultados extremos
    pode alcançar 8–9 estrelas.
  */
  const core=[
    p.force,p.speed,p.intelligence,p.combat,p.talent,p.condition,
    p.control,p.weapons,p.life
  ];
  if(p.hasPower?.name==='Sim') core.push(p.power);

  const tiers=core.map(itemTier);
  const extraordinary=tiers.filter(t=>t>=5).length;
  const extreme=tiers.filter(t=>t>=7).length;
  const absolute=tiers.filter(t=>t>=8).length;
  const weak=tiers.filter(t=>t<=1).length;
  const avg=tiers.length?tiers.reduce((a,b)=>a+b,0)/tiers.length:0;
  const peak=Math.max(0,...tiers);

  const raceTier=itemTier(p.race);
  const titleTier=itemTier(p.title);
  const ageTier=itemTier(p.age);
  const weaponTier=itemTier(p.weapons);
  const powerTier=p.hasPower?.name==='Sim'?itemTier(p.power):-1;
  const controlTier=p.hasPower?.name==='Sim'?itemTier(p.control):-1;

  /* "coerência" recompensa um personagem que sustenta seu nível em várias
     dimensões. Não é média de pontos: é quantidade de áreas que chegaram
     a determinados patamares. */
  const breadth=(
    tiers.filter(t=>t>=4).length +
    (raceTier>=4?1:0) +
    (titleTier>=4?1:0)
  );

  let stars=1;

  // 1–3: personagens realmente comuns/fracos.
  if(peak>=3 || breadth>=2) stars=2;
  if(peak>=4 && breadth>=3) stars=3;
  if((extraordinary>=1 && breadth>=3) || (peak>=5 && breadth>=4)) stars=4;

  // 5–6: claramente excepcionais, mas ainda não "lenda".
  if(extraordinary>=2 && breadth>=4) stars=5;
  if((extraordinary>=3 && breadth>=5) || (peak>=6 && breadth>=4)) stars=6;

  // 7: combinação muito acima da média.
  if((extraordinary>=4 && breadth>=6) || (extreme>=1 && breadth>=5)) stars=7;

  // 8: precisa de múltiplas características extremas ou uma combinação
  // extremamente rara e coerente.
  if((extreme>=2 && breadth>=6) ||
     (absolute>=1 && extraordinary>=3 && breadth>=6) ||
     (powerTier>=7 && controlTier>=6 && raceTier>=5 && breadth>=5)) stars=8;

  // 9: deliberadamente raro. Um único "deus" não basta.
  // É necessário um conjunto quase completo de resultados de topo.
  if((absolute>=2 && extreme>=3 && breadth>=8 && weak<=1) ||
     (absolute>=1 && extreme>=4 && breadth>=8 && powerTier>=7 && controlTier>=7 && weak===0)){
    stars=9;
  }

  /* Um personagem sem poderes não é penalizado duas vezes. Ele simplesmente
     não recebe os critérios de sinergia sobrenatural. */
  if(p.hasPower?.name!=='Sim'){
    stars=Math.min(stars,8);
  }

  const meta=[
    ['Comum','#8d8d8d'],
    ['Incomum','#63d68b'],
    ['Raro','#55a8ff'],
    ['Épico','#9c6cff'],
    ['Lendário','#ed63d3'],
    ['Mítico','#ffad42'],
    ['Divino','#fff05c'],
    ['Transcendente','#58e9ff'],
    ['Absoluto','#ffffff']
  ][stars-1];

  return {
    stars,
    name:meta[0],
    color:meta[1],
    avg,
    profile:{peak,extraordinary,extreme,absolute,weak,breadth,raceTier,titleTier,ageTier,weaponTier,powerTier,controlTier}
  };
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
    <header><span>ROULETA DA VIDA</span><span>V11</span></header>
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


function portraitSVG(p, rarity){
  const hue = ["#777","#65d391","#5ca9ff","#a777ff","#ef67d5","#ffad42","#fff05a","#5be9ff","#ffffff"][rarity.stars-1];
  const name=esc(p.name?.name||"Personagem");
  const race=esc(p.race?.name||"Raça desconhecida");
  const power=esc(p.power?.name||"Sem poder");
  const hair=["#161616","#f2f2f2","#8c6a4a","#b83b3b","#315fbd","#8d3ca8","#d5c36a","#5e9d75"][RV.randomInt(8)];
  const eye=["#e8e8e8","#c94c4c","#4ca7d8","#d9a52e","#7d55c7","#63d18a"][RV.randomInt(6)];
  const glow=rarity.stars>=7 ? `filter="url(#g)"` : "";
  return `<svg class="portrait-svg" viewBox="0 0 600 760" role="img" aria-label="${name}">
    <defs>
      <radialGradient id="bg"><stop offset="0" stop-color="${hue}" stop-opacity=".34"/><stop offset=".55" stop-color="#111" stop-opacity=".55"/><stop offset="1" stop-color="#000"/></radialGradient>
      <filter id="g"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <linearGradient id="coat" x1="0" x2="1"><stop stop-color="#111"/><stop offset=".5" stop-color="${hue}" stop-opacity=".55"/><stop offset="1" stop-color="#050505"/></linearGradient>
    </defs>
    <rect width="600" height="760" fill="#030303"/>
    <rect width="600" height="760" fill="url(#bg)"/>
    <g opacity=".35">${Array.from({length:18},(_,i)=>`<circle cx="${40+(i*83)%520}" cy="${60+(i*137)%640}" r="${1+(i%3)}" fill="${hue}"/>`).join("")}</g>
    <ellipse cx="300" cy="675" rx="225" ry="75" fill="#000" opacity=".8"/>
    <path d="M105 720 Q130 535 215 490 L385 490 Q470 535 495 720Z" fill="url(#coat)" stroke="${hue}" stroke-opacity=".5" stroke-width="3"/>
    <path d="M235 488 L300 560 L365 488" fill="#070707" stroke="${hue}" stroke-opacity=".45" stroke-width="2"/>
    <ellipse cx="300" cy="350" rx="125" ry="155" fill="#b88468" stroke="${hue}" stroke-opacity=".65" stroke-width="4" ${glow}/>
    <path d="M175 315 Q170 145 300 130 Q430 145 425 315 Q395 245 350 210 Q290 270 190 245Z" fill="${hair}" stroke="${hue}" stroke-opacity=".6" stroke-width="5"/>
    <ellipse cx="253" cy="350" rx="17" ry="12" fill="${eye}" ${rarity.stars>=7?'filter="url(#g)"':''}/>
    <ellipse cx="347" cy="350" rx="17" ry="12" fill="${eye}" ${rarity.stars>=7?'filter="url(#g)"':''}/>
    <path d="M255 430 Q300 450 345 430" fill="none" stroke="#522f2f" stroke-width="7" stroke-linecap="round"/>
    ${p.hasPower?.name==="Sim"?`<path d="M95 575 Q170 505 210 545 Q155 605 100 645 M505 575 Q430 505 390 545 Q445 605 500 645" fill="none" stroke="${hue}" stroke-width="${rarity.stars>=7?10:5}" opacity=".8"/>`:""}
    <text x="300" y="55" text-anchor="middle" fill="${hue}" font-size="12" font-family="sans-serif" font-weight="900" letter-spacing="4">${race.toUpperCase()}</text>
    <text x="300" y="710" text-anchor="middle" fill="#fff" font-size="16" font-family="sans-serif" font-weight="900">${name}</text>
    <text x="300" y="735" text-anchor="middle" fill="#777" font-size="9" font-family="sans-serif">${power}</text>
  </svg>`;
}

function cardShell(p, rarity, story){
  const refs=[
    ["Raça",p.race],["Poder",p.power],["Arma / equipamento",p.weapons]
  ].filter(([,x])=>refFor(x));
  const stat=(label,x)=>`<div class="stat"><span>${esc(label)}</span><b>${esc(x?.name||"—")}</b></div>`;
  return `
  <main class="screen final visual-final" style="--rarity:${esc(rarity.color)}">
    <header><span>ROULETA DA VIDA</span><span>V11</span></header>
    <section class="collector-card" id="collectorCard" data-stars="${rarity.stars}">
      <div class="holo"></div>
      <div class="card-art" id="cardArt">${portraitSVG(p,rarity)}<div class="ai-art-status" id="aiArtStatus"><span class="ai-orb"></span><b>CRIANDO A ARTE</b><small>A história terminou. A aparência está sendo materializada…</small></div></div>
      <div class="card-content">
        <div class="card-top"><div class="stars">${rarityStars(rarity.stars)}</div><div class="rarity-name">${esc(rarity.name)}</div></div>
        <div class="name">${esc(p.name.name)}</div>
        <div class="sub">${esc(p.race.name)} · ${esc(p.title.name)} · ${esc(p.age.name)}</div>
        <div class="card-badge">${rarity.stars}/9</div>
      </div>
    </section>
    <div class="card-actions">
      <button id="tiltHelp" class="next" type="button">INTERAGIR COM CARD</button>
      <button id="showDetails" class="next" type="button">ABRIR FICHA</button>
    </div>
    <section id="details" class="details-panel" hidden>
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
    </section>
    <button id="newCharacter" class="again" type="button">NOVO PERSONAGEM</button>
  </main>`;
}

async function reveal(){
  if(state.spinning)return;
  const p={...state.picks};
  p.hasPower=safe(p.hasPower);
  const defaults={
    name:["Pessoa sem nome",0],race:["Humano",10],title:["Ninguém",5],age:["18 anos",50],
    appearance:["aparência comum",50],condition:["condição comum",50],
    force:["força comum",50],speed:["velocidade comum",50],intelligence:["inteligência comum",50],
    combat:["sem experiência",20],talent:["nenhum talento excepcional",10],
    weapons:["Nenhuma",10],life:["Comum",30]
  };
  for(const [k,[n,v]] of Object.entries(defaults)) if(!p[k])p[k]={name:n,value:v};
  if(p.hasPower.name!=="Sim"){delete p.power;delete p.control}
  else {if(!p.power)p.power={name:"Poder desconhecido",value:50};if(!p.control)p.control={name:"controle básico",value:30}}
  const rarity=calculateRarity(p);
  document.body.className=`rarity-${rarity.stars}`;
  const story=buildOrigin(p);
  app.innerHTML=cardShell(p,rarity,story);
  requestAnimationFrame(()=>{
    const card=document.getElementById("collectorCard");
    if(!card)return;
    const stars=rarity.stars;
    card.classList.add(`collector-${stars}`);
    let raf=0;
    const move=(clientX,clientY)=>{
      const r=card.getBoundingClientRect(),x=(clientX-r.left)/r.width-.5,y=(clientY-r.top)/r.height-.5;
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{card.style.setProperty("--rx",`${-y*8}deg`);card.style.setProperty("--ry",`${x*10}deg`);card.style.setProperty("--mx",`${(x+.5)*100}%`);card.style.setProperty("--my",`${(y+.5)*100}%`)});
    };
    card.addEventListener("pointermove",e=>move(e.clientX,e.clientY),{passive:true});
    card.addEventListener("pointerleave",()=>{card.style.setProperty("--rx","0deg");card.style.setProperty("--ry","0deg");card.style.setProperty("--mx","50%");card.style.setProperty("--my","50%")},{passive:true});
  });

  // A história é o gatilho: assim que ela existe, a arte começa automaticamente.
  try{
    if(!window.VisualEngine?.generate) throw new Error("Motor visual indisponível");
    const image=await window.VisualEngine.generate(p,rarity,story);
    const art=document.getElementById("cardArt");
    const status=document.getElementById("aiArtStatus");
    if(art && image){
      art.querySelector(".portrait-svg")?.remove();
      image.className="ai-character-art";
      image.alt=`Arte de ${p.name.name}`;
      image.loading="eager";
      art.insertBefore(image,art.firstChild);
      if(status)status.remove();
      const card=document.getElementById("collectorCard");
      card?.classList.add("art-ready");
    }
  }catch(err){
    console.warn("Geração de arte não concluída:",err);
    const status=document.getElementById("aiArtStatus");
    if(status){
      status.innerHTML=`<span class="ai-orb ai-error"></span><b>ARTE INDISPONÍVEL</b><small>O personagem continua salvo. Você pode tentar novamente.</small><button id="retryArt" class="next" type="button">TENTAR ARTE</button>`;
    }
  }
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
  if(b.id==="showDetails"){
    e.preventDefault();
    const d=document.getElementById("details");
    if(d){d.hidden=!d.hidden;b.textContent=d.hidden?"ABRIR FICHA":"FECHAR FICHA";d.scrollIntoView({behavior:"smooth",block:"start"});}
    return;
  }
  if(b.id==="tiltHelp"){
    e.preventDefault();
    const c=document.getElementById("collectorCard");
    if(c){c.classList.add("card-pulse");setTimeout(()=>c.classList.remove("card-pulse"),900);}
    return;
  }
  if(b.id==="retryArt"){
    e.preventDefault();
    // Rebuild the final screen from the existing picks without changing any roll.
    reveal();
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