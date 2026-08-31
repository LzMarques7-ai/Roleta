/* ROULETA DA VIDA — VISUAL ENGINE V16
   Arte local-first, ilimitada e sem login.
   Não depende de Puter, Bing, OpenAI, API key, saldo ou créditos.

   V16: arte procedural com identidade por personagem.
   A composição usa raça + aparência + força + velocidade + combate +
   poder + arma para evitar o "boneco genérico" repetido.
*/
(()=>{"use strict";

const VERSION="16.0.0", MODEL="local-character-art-v16";
let active=null;

const R={
  1:["COMUM","#8d8d8d"],2:["INCOMUM","#63d68b"],3:["RARO","#55a8ff"],
  4:["ÉPICO","#9c6cff"],5:["LENDÁRIO","#ed63d3"],6:["MÍTICO","#ffad42"],
  7:["DIVINO","#fff05c"],8:["TRANSCENDENTE","#58e9ff"],9:["ABSOLUTO","#fff"]
};

const v=(p,k)=>String(p?.[k]?.name??p?.[k]??"desconhecido").replace(/\s+/g," ").trim();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]));
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let x=(seed||1)>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296}}
function pick(a,r){return a[Math.floor(r()*a.length)]}
function clamp(n,a,b){return Math.max(a,Math.min(b,n))}

function brief(p,rarity){
  const power=v(p,"hasPower").toLowerCase()==="sim";
  return {
    stars:clamp(Number(rarity?.stars)||1,1,9),name:v(p,"name"),race:v(p,"race"),
    title:v(p,"title"),appearance:v(p,"appearance"),condition:v(p,"condition"),
    force:v(p,"force"),speed:v(p,"speed"),intelligence:v(p,"intelligence"),
    combat:v(p,"combat"),talent:v(p,"talent"),
    power:power?v(p,"power"):"Nenhum poder",control:power?v(p,"control"):"Sem domínio",
    weapon:v(p,"weapons"),life:v(p,"life")
  };
}
function text(b){return Object.values(b).join(" ").toLowerCase()}

function palette(b){
  const t=text(b);
  if(/gelo|ice|frio|glacial|cry/.test(t))return["#eaffff","#65ddff","#193c72","#d9f7ff"];
  if(/fogo|inferno|lava|chama|fire|hell/.test(t))return["#fff2c9","#ff7654","#741d31","#ffb13b"];
  if(/eletric|trovão|raio|lightning|flash|thunder/.test(t))return["#fffde0","#ffe05a","#4b3aa6","#8ce7ff"];
  if(/água|oceano|mar|atlante|sereia|tritão|water/.test(t))return["#e4fbff","#58d9ff","#174b9d","#a8f2ff"];
  if(/planta|dríade|floresta|natureza|plant/.test(t))return["#edffd9","#70df8d","#17533e","#c9ff85"];
  if(/vamp|sangue|hollow|ghoul|blood/.test(t))return["#ffe1e8","#ee5576","#34152e","#ff9db1"];
  if(/anjo|serafim|deus|celestial|divino|angel/.test(t))return["#fffef1","#fff06b","#5a4f9d","#ffffff"];
  if(/mecân|androide|ciborg|tecnolog|cyber|robot|brainiac/.test(t))return["#edf5ff","#71b3ff","#202d4d","#b8d9ff"];
  if(/yōkai|oni|kitsune|japon|shinigami|samurai/.test(t))return["#ffe5f3","#f46fb4","#3b2366","#ffd1ec"];
  if(/cosmic|cósmic|univers|galáct|estrela|space|cosmos/.test(t))return["#eef1ff","#9b8cff","#17113d","#e3d8ff"];
  return["#f1e5d5","#a58cff","#263b58","#d7c5a8"];
}

function traits(b){
  const t=text(b);
  return {
    speed:/flash|superman|mercúrio|quicksilver|sonic|velocidade da luz|além da luz|instantâneo|temporal|velocidade fora do tempo/.test(t),
    lightning:/flash|eletric|trovão|raio|lightning|thunder/.test(t),
    fire:/fogo|inferno|lava|chama|fire/.test(t),
    ice:/gelo|glacial|frio|ice/.test(t),
    water:/água|oceano|mar|atlante|sereia|tritão|water/.test(t),
    dark:/trevas|escuridão|sombras|vamp|hollow|ghoul|demônio|demon|shadow/.test(t),
    light:/luz|anjo|serafim|celestial|divino|angel/.test(t),
    tech:/mecân|androide|ciborg|tecnolog|cyber|robot|brainiac|stark|tesla/.test(t),
    psychic:/telepat|mente|psíqu|psion|brainiac|xavier|geass/.test(t),
    cosmic:/cósmic|cosmic|univers|galáct|estrela|cosmos|entidade|deus/.test(t),
    wings:/asas|anjo|serafim|fênix|fada|wing/.test(t),
    horns:/chifre|chifres|demônio|demon|oni|minotauro|dragão|draconiano/.test(t),
    elf:/elfo|fada|vamp|yōkai|kitsune|vulcano|twi/.test(t),
    muscular:/hulk|hércules|thor|strongman|eddie hall|hafþór|brian shaw|tom stoltman|colossal|titânico|muito forte|excepcionalmente forte|monstruoso/.test(t),
    sword:/espada|katana|sabre|excalibur|buster|masamune|kusanagi|vergil|zoro|mestre de espadas|espadachim/.test(t),
    bow:/arco|arqueiro|hawkeye|gavião arqueiro/.test(t),
    hammer:/mjöl|mjölnir|stormbreaker|martelo|hammer/.test(t),
    shield:/escudo|shield|capitão américa/.test(t),
    gun:/pistola|rifle|revólver|arma de fogo|canhão/.test(t),
    magic:/mago|magia|alquim|nen|chakra|ki|stand|bankai|geass|feiticeiro|grimório|cajado|varinha/.test(t),
    speedLines:/flash|superman|mercúrio|quicksilver|sonic|dash|a-train|velocidade/.test(t),
    brain:/brainiac|reed richards|tony stark|rick sanchez|the doctor|spock|data|einstein|newton|turing|da vinci|shuri|lex luthor/.test(t),
    giant:/gigante|titã|colossal|kaiju|monstruoso|titânico/.test(t)
  };
}

function rarityFx(n,c,r){
  let s="";
  const count=n<=2?8:n<=4?14:n<=6?24:34;
  for(let i=0;i<count;i++){
    const x=30+r()*452,y=35+r()*420,rr=.7+r()*(n>=7?3.8:2.4);
    s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${c[i%3]}" opacity="${(.18+r()*.58).toFixed(2)}"/>`;
  }
  if(n>=5)s+=`<g fill="none" stroke="${c[1]}" opacity=".20"><circle cx="256" cy="300" r="${165+n*7}"/><circle cx="256" cy="300" r="${195+n*7}"/></g>`;
  if(n>=7)s+=`<g opacity=".18" stroke="${c[0]}" stroke-width="3"><path d="M-20 180L532 20M-40 350L560 110M-20 520L540 270"/></g>`;
  if(n>=8)for(let i=0;i<7;i++){const x=35+r()*442,y=60+r()*500;s+=`<path d="M${x} ${y}l4 10 11 1-8 7 3 11-10-6-9 6 2-11-8-7 11-1z" fill="${c[i%3]}" opacity=".8"/>`}
  return s;
}

function face(b,c,t,r){
  const tr=traits(b);
  const skin=/pele azul|azul|verde|escama|metálica|golem|não humana/.test(t)?c[0]:"#d8ad91";
  const shape=pick([
    "M177 205Q180 125 256 112Q332 125 335 205L318 326Q288 375 256 382Q224 375 194 326Z",
    "M183 198Q186 118 256 108Q326 118 329 198L315 315Q287 366 256 376Q225 366 197 315Z",
    "M174 208Q180 130 256 110Q332 130 338 208L311 330Q282 365 256 372Q230 365 201 330Z"
  ],r);
  let ears="";
  if(/elfo|fada|vamp|yōkai|kitsune|vulcano|twi/.test(t))ears=`<path d="M190 214L106 156L181 266M322 214L406 156L331 266" fill="${skin}" stroke="${c[1]}" stroke-width="5"/>`;
  let horns="";
  if(tr.horns)horns=`<path d="M210 155Q150 110 135 45Q188 75 222 128M302 155Q362 110 377 45Q324 75 290 128" fill="${c[2]}" stroke="${c[1]}" stroke-width="7"/>`;
  const eye=tr.cosmic||tr.psychic||b.stars>=6?c[0]:c[1];
  return `${horns}${ears}<path d="${shape}" fill="${skin}" stroke="${c[1]}" stroke-width="6"/>
    <path d="M198 230Q222 210 245 229M267 229Q290 210 314 230" fill="none" stroke="#4a3340" stroke-width="8" stroke-linecap="round"/>
    <path d="M203 246Q224 230 244 246Q224 265 203 246ZM268 246Q288 230 309 246Q288 265 268 246Z" fill="#171722"/>
    <circle cx="226" cy="247" r="${b.stars>=6?8:5}" fill="${eye}" ${b.stars>=6||tr.psychic||tr.cosmic?'filter="url(#glow)"':''}/>
    <circle cx="286" cy="247" r="${b.stars>=6?8:5}" fill="${eye}" ${b.stars>=6||tr.psychic||tr.cosmic?'filter="url(#glow)"':''}/>
    <path d="M247 258Q244 283 236 292Q256 300 276 292" fill="none" stroke="#9b685e" stroke-width="5" stroke-linecap="round"/>
    <path d="M226 318Q256 ${/veterano|mestre/.test(b.combat.toLowerCase())?'326':'322'} 286 318" fill="none" stroke="#6f4244" stroke-width="5" stroke-linecap="round"/>`;
}

function hair(b,c,r){
  const t=text(b);
  const color=/branco|prata|silver|white/.test(t)?"#eef7ff":/vermelho|ruivo|red/.test(t)?"#a83d43":/azul|blue/.test(t)?"#4d79d8":/preto|negro|black/.test(t)?"#171821":c[2];
  return pick([
    `<path d="M165 210Q145 98 256 66Q367 98 347 210Q312 160 279 139Q234 172 165 210Z" fill="${color}" stroke="${c[1]}" stroke-width="6"/><path d="M186 120Q238 83 313 119" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="8"/>`,
    `<path d="M163 208Q160 88 256 66Q352 88 349 208L317 164L286 111L260 154L220 105L192 169Z" fill="${color}" stroke="${c[1]}" stroke-width="6"/>`,
    `<path d="M169 198Q190 70 256 72Q322 70 343 198L312 153Q285 136 256 145Q225 134 195 158Z" fill="${color}" stroke="${c[1]}" stroke-width="6"/>`
  ],r);
}

function body(b,c,r){
  const tr=traits(b);
  const huge=tr.giant||tr.muscular||/divino|cósmico|titânico/.test(b.force.toLowerCase());
  const thin=/muito fraco|frágil|incapaz|limitado/.test((b.force+" "+b.condition).toLowerCase());
  const shoulder=huge?190:thin?122:155;
  const armor=tr.tech?`<path d="M${256-shoulder} 405Q256 350 ${256+shoulder} 405L${340+shoulder/4} 660Q256 720 ${172-shoulder/5} 660Z" fill="url(#armor)" stroke="${c[1]}" stroke-width="7"/><path d="M${185-shoulder/3} 450L256 520L${327+shoulder/3} 450" fill="none" stroke="${c[0]}" stroke-width="8" opacity=".55"/>`:"";
  const royal=/rei|rainha|lorde|imperador|soberano|deus|duque|princesa|príncipe|profeta|oráculo/.test(b.title.toLowerCase());
  const cloak=royal?`<path d="M${256-shoulder} 405Q135 420 84 650Q180 695 256 660Q332 695 428 650Q377 420 ${256+shoulder} 405Z" fill="${c[2]}" opacity=".72" stroke="${c[1]}" stroke-width="6"/>`:"";
  const suit=tr.tech?armor:`<path d="M${256-shoulder} 402Q256 350 ${256+shoulder} 402L${340+shoulder/4} 660Q256 710 ${172-shoulder/5} 660Z" fill="url(#coat)" stroke="${c[1]}" stroke-width="7"/><path d="M${204-shoulder/5} 420Q170 470 145 610M${308+shoulder/5} 420Q342 470 367 610" fill="none" stroke="${c[2]}" stroke-width="${huge?40:34}" stroke-linecap="round"/>`;
  const insignia=tr.magic||tr.psychic||tr.cosmic?`<path d="M256 465l24 34-24 42-24-42z" fill="${c[0]}" stroke="${c[1]}" stroke-width="5" filter="url(#glow)"/>`:"";
  const pose=pick([
    `<path d="M${195-shoulder/6} 430Q120 390 72 300" fill="none" stroke="${c[2]}" stroke-width="42" stroke-linecap="round"/><path d="M${317+shoulder/6} 430Q392 390 440 300" fill="none" stroke="${c[2]}" stroke-width="42" stroke-linecap="round"/>`,
    `<path d="M${198-shoulder/6} 430Q125 500 92 610" fill="none" stroke="${c[2]}" stroke-width="42" stroke-linecap="round"/><path d="M${314+shoulder/6} 430Q387 500 420 610" fill="none" stroke="${c[2]}" stroke-width="42" stroke-linecap="round"/>`,
    `<path d="M${200-shoulder/6} 430Q115 430 65 510" fill="none" stroke="${c[2]}" stroke-width="42" stroke-linecap="round"/><path d="M${312+shoulder/6} 430Q397 430 447 510" fill="none" stroke="${c[2]}" stroke-width="42" stroke-linecap="round"/>`
  ],r);
  return `${cloak}${suit}<path d="M224 345V420Q256 444 288 420V345" fill="#c9957e" stroke="${c[1]}" stroke-width="5"/>${insignia}${pose}`;
}

function wings(b,c){
  if(!traits(b).wings)return "";
  const dark=/demon|demônio|trevas|sombras/.test(text(b)),fill=dark?c[2]:c[0];
  return `<g opacity=".9"><path d="M188 410Q72 330 54 165Q150 205 214 335Q120 250 86 120Q186 165 230 330Z" fill="${fill}" stroke="${c[1]}" stroke-width="6"/><path d="M324 410Q440 330 458 165Q362 205 298 335Q392 250 426 120Q326 165 282 330Z" fill="${fill}" stroke="${c[1]}" stroke-width="6"/></g>`;
}

function weapon(b,c){
  const t=b.weapon.toLowerCase();
  if(!b.weapon||/nenhuma|nenhum|sem arma/.test(t))return "";
  if(/arco|bow/.test(t))return `<g transform="translate(0 10)"><path d="M420 390Q505 260 420 130M424 140V380" fill="none" stroke="${c[0]}" stroke-width="10"/><path d="M424 142L495 250L424 358" fill="none" stroke="${c[1]}" stroke-width="4"/><circle cx="424" cy="250" r="9" fill="${c[1]}" filter="url(#glow)"/></g>`;
  if(/espada|katana|excalibur|sabre|buster|kusanagi|masamune|keyblade|stormbreaker|mjöl/.test(t))return `<g transform="rotate(${/katana|vergil/.test(t)?-18:16} 410 300)"><path d="M404 92L422 88L431 350L411 358Z" fill="${c[0]}" stroke="${c[1]}" stroke-width="5" filter="url(#glow)"/><path d="M380 338H448L432 362H396Z" fill="${c[1]}"/><circle cx="414" cy="340" r="8" fill="${c[0]}"/></g>`;
  if(/martelo|hammer|mjöl|stormbreaker/.test(t))return `<g transform="rotate(10 415 280)"><path d="M415 160V420" stroke="${c[0]}" stroke-width="13"/><rect x="362" y="108" width="106" height="68" rx="12" fill="${c[1]}" stroke="${c[0]}" stroke-width="6" filter="url(#glow)"/></g>`;
  if(/lança|spear|alabarda/.test(t))return `<path d="M420 92L428 430" stroke="${c[0]}" stroke-width="9"/><path d="M402 135L420 74L438 135Z" fill="${c[1]}" stroke="${c[0]}" stroke-width="5" filter="url(#glow)"/>`;
  if(/escudo|shield/.test(t))return `<path d="M395 150Q485 170 455 335Q420 380 385 335Q355 170 395 150Z" fill="${c[2]}" stroke="${c[0]}" stroke-width="9"/><circle cx="405" cy="255" r="24" fill="${c[1]}" opacity=".85"/>`;
  if(/pistola|rifle|revólver|arma de fogo|canhão/.test(t))return `<g transform="rotate(-10 420 300)"><rect x="350" y="235" width="105" height="32" rx="8" fill="#222938" stroke="${c[1]}" stroke-width="5"/><path d="M388 267L400 330L426 330L420 267Z" fill="#141923"/><circle cx="448" cy="251" r="7" fill="${c[0]}" filter="url(#glow)"/></g>`;
  return `<g><path d="M420 160L430 400" stroke="${c[0]}" stroke-width="11"/><circle cx="420" cy="145" r="22" fill="${c[1]}" filter="url(#glow)"/></g>`;
}

function effects(b,c,tr,r,n){
  let s="";
  if(tr.lightning)s+=`<g fill="none" stroke="${c[0]}" stroke-width="5" opacity=".78" filter="url(#glow)">${Array.from({length:5},(_,i)=>`<path d="M${55+i*92} 610L${105+i*70} 470L${75+i*84} 390L${140+i*70} 270"/>`).join("")}</g>`;
  else if(tr.fire)s+=`<g opacity=".8"><path d="M70 630Q105 500 150 575Q170 460 210 600Q240 485 270 620Q320 490 350 585Q390 500 442 630Z" fill="${c[1]}"/><path d="M110 630Q140 540 170 610Q205 525 230 625Q270 530 300 620Q340 540 380 630Z" fill="${c[0]}" opacity=".72"/></g>`;
  else if(tr.ice)s+=`<g fill="none" stroke="${c[0]}" stroke-width="5" opacity=".8">${[110,170,342,402].map(x=>`<path d="M${x} 610L${x-35} 520L${x+8} 470L${x-12} 390"/>`).join("")}</g>`;
  else if(tr.water)s+=`<g fill="none" stroke="${c[0]}" stroke-width="10" opacity=".55"><path d="M35 590Q115 500 190 590T350 590T510 590"/><path d="M35 625Q115 535 190 625T350 625T510 625"/></g>`;
  else if(tr.dark)s+=`<g fill="${c[2]}" opacity=".72"><circle cx="92" cy="210" r="60"/><circle cx="420" cy="260" r="72"/><path d="M80 620Q155 470 256 560Q350 455 450 620Z"/></g>`;
  else if(tr.light)s+=`<g fill="none" stroke="${c[0]}" opacity=".65"><circle cx="256" cy="270" r="170" stroke-width="8"/><circle cx="256" cy="270" r="205" stroke-width="3"/><path d="M256 80V460M66 270H446" stroke-width="4"/></g>`;
  else if(tr.tech)s+=`<g fill="none" stroke="${c[1]}" opacity=".34" stroke-width="2"><path d="M40 180H150L190 220H320L360 180H472"/><path d="M35 560H120L160 520H350L395 560H477"/>${Array.from({length:8},(_,i)=>`<circle cx="${65+i*54}" cy="${120+(i%3)*210}" r="5" fill="${c[0]}"/>`).join("")}</g>`;
  else if(tr.psychic)s+=`<g fill="none" stroke="${c[0]}" opacity=".38"><circle cx="256" cy="270" r="120" stroke-width="8"/><circle cx="256" cy="270" r="165" stroke-width="3" stroke-dasharray="8 14"/><path d="M145 270Q256 170 367 270Q256 370 145 270Z" stroke-width="5"/></g>`;
  else if(tr.cosmic)s+=`<g fill="${c[0]}" opacity=".65">${Array.from({length:18},()=>`<circle cx="${35+r()*442}" cy="${60+r()*540}" r="${1+r()*3}"/>`).join("")}</g><path d="M60 640Q256 350 452 640" fill="none" stroke="${c[1]}" stroke-width="5" opacity=".4"/>`;
  else if(tr.magic)s+=`<g fill="none" stroke="${c[1]}" opacity=".45"><circle cx="256" cy="285" r="150" stroke-width="4"/><path d="M256 100L300 205L410 210L322 275L350 380L256 320L162 380L190 275L102 210L212 205Z" stroke-width="3"/></g>`;
  if(tr.speedLines||tr.speed)s+=`<g stroke="${c[0]}" opacity=".26" stroke-width="4">${Array.from({length:9},(_,i)=>`<path d="M${20+i*58} ${110+i*24}L${120+i*52} ${72+i*20}"/>`).join("")}</g>`;
  if(n>=7)s+=`<path d="M-30 690L540 80" stroke="#fff" stroke-width="22" opacity=".07"/><path d="M-30 650L540 40" stroke="${c[1]}" stroke-width="7" opacity=".12"/>`;
  return s;
}

function buildSVG(p,rarity){
  const b=brief(p,rarity),n=b.stars,m=R[n],seed=hash(JSON.stringify(b)),r=rng(seed),c=palette(b),tr=traits(b),t=text(b);
  const defs=`<defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#05070d"/><stop offset=".48" stop-color="${c[2]}"/><stop offset="1" stop-color="#020205"/></linearGradient>
    <radialGradient id="aura"><stop stop-color="${c[0]}" stop-opacity=".46"/><stop offset=".55" stop-color="${c[1]}" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="coat" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c[2]}"/><stop offset=".48" stop-color="#111725"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>
    <linearGradient id="armor" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#dcecff"/><stop offset=".35" stop-color="${c[2]}"/><stop offset=".75" stop-color="#111827"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>
    <linearGradient id="chrome"><stop stop-color="#fff"/><stop offset=".18" stop-color="#62f7ff"/><stop offset=".38" stop-color="#ff65df"/><stop offset=".58" stop-color="#fff16b"/><stop offset=".78" stop-color="#7d8cff"/><stop offset="1" stop-color="#fff"/></linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="${10+n*1.7}"/></filter>
    <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .08 0"/></filter>
  </defs>`;
  const aura=`<circle cx="256" cy="290" r="260" fill="url(#aura)"/><ellipse cx="256" cy="300" rx="${125+n*8}" ry="${205+n*6}" fill="${c[1]}" opacity="${.05+n*.014}" filter="url(#blur)"/>`;
  const bgMotif=tr.brain?`<g fill="none" stroke="${c[1]}" opacity=".18" stroke-width="2"><path d="M40 160H145L190 205H322L367 160H472"/><path d="M50 520H140L190 470H322L372 520H462"/></g>`:"";
  const chrome=n===9?`<rect width="512" height="700" fill="url(#chrome)" opacity=".13"/><path d="M-40 590L560 80" stroke="#fff" stroke-width="32" opacity=".12"/>`:"";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1400" viewBox="0 0 512 700">
    ${defs}<rect width="512" height="700" fill="url(#bg)"/>
    ${aura}${bgMotif}${rarityFx(n,c,r)}${effects(b,c,tr,r,n)}${wings(b,c)}
    ${body(b,c,r)}${face(b,c,t,r)}${hair(b,c,r)}${weapon(b,c)}
    ${n>=6?`<g opacity=".72">${Array.from({length:n+2},(_,i)=>`<path d="M${70+i*42} ${640-(i%3)*13}l4 10 11 1-8 7 2 11-9-6-9 6 2-11-8-7 11-1z" fill="${c[i%3]}"/>`).join("")}</g>`:""}
    ${chrome}<rect width="512" height="700" fill="#fff" opacity=".035" filter="url(#grain)"/>
    <rect x="7" y="7" width="498" height="686" rx="30" fill="none" stroke="${m[1]}" stroke-width="${n>=9?5:n>=7?3:1.5}" opacity=".72"/>
  </svg>`;
}

function image(svg){
  const i=new Image();
  i.decoding="async";i.alt="Arte do personagem";
  i.src="data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg);
  return i;
}

function install(){
  if(document.getElementById("rv-card-v16"))return;
  const s=document.createElement("style");s.id="rv-card-v16";
  s.textContent=".collector-card .ai-character-art{display:block;width:100%;height:100%;object-fit:cover;object-position:center top;image-rendering:auto;background:#05070d}.collector-9 .ai-character-art{filter:saturate(1.18) contrast(1.06)}";
  document.head.appendChild(s);
}

async function generate(p,rarity,story){
  if(active)return active;
  active=(async()=>{const i=image(buildSVG(p,rarity));try{if(i.decode)await i.decode()}catch(_){}return i})();
  try{return await active}finally{active=null}
}
async function generateAfterUserGesture(p,rarity,story){return generate(p,rarity,story)}

install();
window.VisualEngine={MODEL,PROVIDER:"local",buildPrompt:()=>"",buildSVG,generate,generateAfterUserGesture,version:VERSION};
})();