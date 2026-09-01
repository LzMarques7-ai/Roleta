/* ROULETA DA VIDA — VISUAL ENGINE V18
   DETAILED CHARACTER ART / LOCAL-FIRST
   - 100% local: no Puter, Bing, OpenAI, API key, saldo or créditos.
   - Cada personagem recebe uma composição determinística própria.
   - A ficha é a fonte de verdade: raça, idade, aparência, título, força,
     velocidade, inteligência, combate, talento, poder, domínio e arma.
   - V18 troca o "boneco SVG" por uma ilustração procedural em camadas:
     anatomia, roupa, cabelo, rosto, acessórios, cenário, iluminação,
     partículas, efeitos e assinatura visual por referência.
   - Mantém a API pública esperada pelo projeto.
*/
(()=>{
  "use strict";

  const VERSION="18.0.0";
  const MODEL="local-detailed-character-illustration-v18";
  let active=null;

  const R={
    1:["COMUM","#8e949e"],2:["INCOMUM","#5fe08b"],3:["RARO","#54a8ff"],
    4:["ÉPICO","#9a68ff"],5:["LENDÁRIO","#ef5fd0"],6:["MÍTICO","#ffae45"],
    7:["DIVINO","#ffe85a"],8:["TRANSCENDENTE","#55eaff"],9:["ABSOLUTO","#ffffff"]
  };

  const clean=x=>String(x??"").replace(/\s+/g," ").trim();
  const val=(p,k)=>clean(p?.[k]?.name??p?.[k]??"desconhecido");
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&apos;"}[c]));

  function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function rng(seed){let x=(seed||1)>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296}}
  const pick=(a,r)=>a[Math.floor(r()*a.length)];
  const chance=(r,p)=>r()<p;

  function referenceFor(obj){
    if(!obj) return "";
    try{ if(typeof window.refFor==="function") return clean(window.refFor(obj)||""); }catch(_){ }
    return clean(obj?.ref||obj?.reference||"");
  }

  function brief(p,rarity,story){
    const stars=clamp(Number(rarity?.stars)||1,1,9);
    const power=val(p,"hasPower").toLowerCase()==="sim";
    const b={
      stars,name:val(p,"name"),race:val(p,"race"),age:val(p,"age"),title:val(p,"title"),
      appearance:val(p,"appearance"),condition:val(p,"condition"),force:val(p,"force"),
      speed:val(p,"speed"),intelligence:val(p,"intelligence"),combat:val(p,"combat"),
      talent:val(p,"talent"),power:power?val(p,"power"):"Nenhum poder",
      control:power?val(p,"control"):"Sem domínio",weapon:val(p,"weapons"),life:val(p,"life"),
      hasPower:power,story:Array.isArray(story)?story.filter(Boolean).join(" "):clean(story),
      refs:{race:referenceFor(p?.race),title:referenceFor(p?.title),appearance:referenceFor(p?.appearance),
        force:referenceFor(p?.force),speed:referenceFor(p?.speed),intelligence:referenceFor(p?.intelligence),
        combat:referenceFor(p?.combat),talent:referenceFor(p?.talent),power:referenceFor(p?.power),
        weapon:referenceFor(p?.weapons),condition:referenceFor(p?.condition)}
    };
    return b;
  }

  function corpus(b){return Object.values(b).filter(x=>typeof x==="string").join(" ").toLowerCase()}
  function has(t,...xs){return xs.some(x=>t.includes(x))}

  function traits(b){
    const t=corpus(b), refs=Object.values(b.refs||{}).join(" ").toLowerCase();
    const q=t+" "+refs;
    return {
      fire:has(q,"fogo","chama","inferno","lava","fire","phoenix","fênix","pyro"),
      ice:has(q,"gelo","glacial","ice","cryogenic","cry"),
      water:has(q,"água","oceano","mar","atlante","sereia","tritão","water"),
      lightning:has(q,"eletric","trovão","raio","lightning","thunder","flash"),
      dark:has(q,"trevas","escuridão","sombra","vamp","demônio","demon","hollow","ghoul","shadow","dark"),
      light:has(q,"luz","anjo","serafim","celestial","divino","angel","holy"),
      cosmic:has(q,"cósmic","cosmic","univers","galáct","estrela","space","cosmos","entidade","deus","divindade"),
      psychic:has(q,"telepat","mente","psíqu","psion","brainiac","geass","mental","psychic"),
      tech:has(q,"mecân","androide","ciborg","tecnolog","cyber","robot","armadura","stark","tesla","android"),
      magic:has(q,"mago","magia","alquim","chakra","ki","stand","bankai","geass","feiticeiro","grimório","cajado","varinha","sorcer"),
      elf:has(q,"elfo","elfa","fada","fae","kitsune","yōkai","youkai","vampiro"),
      horn:has(q,"chifre","chifres","demônio","demon","oni","minotauro","dragão","draconiano"),
      wing:has(q,"asa","asas","anjo","serafim","fênix","fada","wing"),
      giant:has(q,"gigante","titã","colossal","kaiju","monstruoso","titânico","giant"),
      aquatic:has(q,"sereia","tritão","atlante","peixe","aquático","aquatic"),
      beast:has(q,"lobisomem","fera","animal","bestial","lobo","tigre","urso","beast","werewolf"),
      muscle:has(q,"hulk","hércules","thor","strongman","eddie hall","hafþór","brian shaw","tom stoltman","colossal","titânico","muito forte","excepcionalmente forte"),
      sword:has(q,"espada","katana","sabre","excalibur","buster","masamune","kusanagi","vergil","zoro","espadachim","blade"),
      bow:has(q,"arco","arqueiro","hawkeye","gavião arqueiro","bow","archer"),
      hammer:has(q,"martelo","hammer","mjöl","mjölnir","stormbreaker"),
      shield:has(q,"escudo","shield","capitão américa","captain america"),
      gun:has(q,"pistola","rifle","revólver","arma de fogo","canhão","gun","firearm"),
      spear:has(q,"lança","spear","alabarda","halberd","tridente","trident"),
      rogue:has(q,"ladrão","assassino","mercenário","espião","rogue","ninja","thief","assassin"),
      royal:has(q,"rei","rainha","lorde","imperador","soberano","deus","duque","princesa","príncipe","profeta","oráculo","royal"),
      scientist:has(q,"cientista","professor","pesquisador","engenheiro","brainiac","reed richards","einstein","newton","turing","da vinci","stark"),
      martial:has(q,"lutador","artista marcial","boxe","karatê","jiu-jitsu","kung fu","muay thai","combatente","martial"),
      speedster:has(q,"flash","mercúrio","quicksilver","sonic","velocidade extrema","velocidade absurda","speedster")
    };
  }

  function allRefs(b){return Object.values(b.refs||{}).join(" ").toLowerCase()}

  function palette(b,tr){
    const t=corpus(b)+" "+allRefs(b);
    if(tr.ice)return ["#eefcff","#62dfff","#17305e","#bdf7ff","#79a8ff"];
    if(tr.fire)return ["#fff1d1","#ff6a45","#5b1831","#ffb32d","#ffe2a3"];
    if(tr.lightning)return ["#fffde3","#ffe05b","#393487","#8feaff","#d9d0ff"];
    if(tr.water)return ["#e8fbff","#51d9ff","#15487f","#a6f0ff","#4778ff"];
    if(tr.dark)return ["#f4e4ee","#e95c91","#25152d","#8b45c5","#ff9ab6"];
    if(tr.light)return ["#fffef0","#ffe86b","#4e4b8d","#ffffff","#9eeaff"];
    if(tr.tech)return ["#edf5ff","#67b7ff","#202941","#b8ddff","#5e7bff"];
    if(tr.cosmic)return ["#eff0ff","#a88cff","#151235","#e9d9ff","#62dcff"];
    if(tr.magic)return ["#f4edff","#a875ff","#241a46","#ff73d1","#8eeaff"];
    if(has(t,"japon","samurai","shinigami","oni","yōkai"))return ["#ffe8f4","#ef6ab3","#2e2046","#ffd0e8","#7ed8ff"];
    if(has(t,"planta","floresta","natureza","druida","dríade"))return ["#efffdc","#6fd58c","#173f31","#c8ff91","#72d7c0"];
    return ["#f4e7d7","#9e83ff","#24344f","#e3c8ad","#6bc8ff"];
  }

  function silhouetteStats(b,tr,r){
    const force=b.force.toLowerCase();
    let body=tr.giant?1.28:tr.muscle?1.18:has(force,"acima da média","forte","atleta","super-humano")?1.08:.95;
    let shoulder=tr.giant?205:tr.muscle?178:pick([145,154,164,172],r);
    let height=tr.giant?1.28:pick([.92,1,1.04,1.1],r);
    if(has(force,"fraco","baixa","criança"))body*=.82;
    return{body,shoulder,height};
  }

  function rarityDirection(n){
    return {
      1:"Ilustração limpa e quase cotidiana. Pouca energia visual; o interesse vem do design do personagem.",
      2:"Ilustração polida, com ambiente simples e pequenos detalhes materiais.",
      3:"Composição de colecionável rara, cenário reconhecível, iluminação mais cinematográfica e silhueta forte.",
      4:"Cena épica com pose expressiva, materiais detalhados e fundo narrativo.",
      5:"Full-art premium: composição dramática, profundidade, partículas e identidade visual muito marcada.",
      6:"Full-art lendário: iluminação em camadas, partículas temáticas, materiais ricos e sensação de cena congelada.",
      7:"Divino: escala extraordinária, atmosfera luminosa, partículas densas e composição de pôster.",
      8:"Transcendente: realidade distorcida de maneira coerente, efeitos holográficos e grande profundidade.",
      9:"Absoluto: composição quase impossível, prisma/holografia, múltiplas camadas de luz e acabamento máximo."
    }[n];
  }

  function background(b,tr,c,r,n){
    let s=`<rect width="512" height="760" fill="url(#bg)"/>`;
    const scenes=[
      `<path d="M0 540Q100 445 190 535T380 510T512 470V760H0Z" fill="${c[2]}" opacity=".62"/><path d="M0 610Q125 520 235 610T512 555V760H0Z" fill="#070a12" opacity=".78"/>`,
      `<g opacity=".35" fill="none" stroke="${c[4]}" stroke-width="2"><path d="M0 150H130L175 190H337L382 150H512"/><path d="M0 540H95L145 495H367L417 540H512"/><circle cx="256" cy="350" r="170"/><circle cx="256" cy="350" r="205"/></g>`,
      `<path d="M0 480L110 330L170 410L260 250L340 400L420 300L512 460V760H0Z" fill="${c[2]}" opacity=".72"/><path d="M0 540L125 425L220 520L330 395L512 525V760H0Z" fill="#070a12" opacity=".75"/>`,
      `<g opacity=".28" stroke="${c[0]}" fill="none"><path d="M40 580C140 440 370 440 472 580" stroke-width="8"/><path d="M70 630C160 505 352 505 442 630" stroke-width="3"/><path d="M90 260Q256 110 422 260" stroke-width="3"/></g>`
    ];
    s+=pick(scenes,r);
    if(tr.water)s+=`<g fill="none" stroke="${c[0]}" opacity=".18" stroke-width="9"><path d="M-20 565Q85 480 190 565T530 565"/><path d="M-20 610Q85 525 190 610T530 610"/></g>`;
    if(tr.fire)s+=`<g fill="${c[1]}" opacity=".16"><path d="M25 650Q75 505 120 625Q155 475 205 640Q260 485 302 645Q350 505 395 630Q440 510 500 650Z"/></g>`;
    if(tr.ice)s+=`<g stroke="${c[0]}" stroke-width="5" opacity=".2"><path d="M45 680L90 560L75 450L135 380"/><path d="M465 680L420 560L438 445L380 370"/></g>`;
    if(tr.cosmic||n>=8)s+=`<g fill="${c[0]}" opacity=".65">${Array.from({length:30},()=>`<circle cx="${(10+r()*492).toFixed(1)}" cy="${(20+r()*650).toFixed(1)}" r="${(.6+r()*2.4).toFixed(1)}"/>`).join("")}</g>`;
    return s;
  }

  function particles(c,r,n,tr){
    const count=n<=2?10:n<=4?18:n<=6?30:48;
    let s="";
    for(let i=0;i<count;i++){
      const x=16+r()*480,y=30+r()*640,rr=.6+r()*(n>=7?3.5:2.2);
      const type=i%5;
      if(type===0&&n>=5)s+=`<path d="M${x} ${y}l3 ${rr*3} ${rr*3} 3-3 3-3-3-3-3z" fill="${c[i%5]}" opacity="${.25+r()*.65}"/>`;
      else s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${c[i%5]}" opacity="${(.18+r()*.62).toFixed(2)}"/>`;
    }
    if(n>=6)s+=`<g fill="none" stroke="${c[1]}" opacity=".18"><ellipse cx="256" cy="350" rx="205" ry="290"/><ellipse cx="256" cy="350" rx="175" ry="250"/></g>`;
    if(n>=8)s+=`<g fill="none" stroke="url(#prism)" opacity=".36" stroke-width="3"><path d="M-30 235L545 40"/><path d="M-50 420L565 190"/><path d="M-30 630L555 395"/></g>`;
    return s;
  }

  function body(b,tr,c,r){
    const ss=silhouetteStats(b,tr,r), sh=ss.shoulder, body=ss.body, h=ss.height;
    const cx=256, top=365, left=cx-sh*body/2, right=cx+sh*body/2;
    const torsoW=(right-left)*.82, hip=torsoW*.72;
    let s=`<g transform="translate(0 ${10-(h-1)*24}) scale(1 ${h})" transform-origin="256 500">`;
    s+=`<path d="M${cx-torsoW/2} 395Q${cx} 365 ${cx+torsoW/2} 395L${cx+hip/2} 690Q${cx} 720 ${cx-hip/2} 690Z" fill="url(#cloth)" stroke="${c[2]}" stroke-width="5"/>`;
    s+=`<path d="M${cx-torsoW/2+8} 410Q${cx-torsoW/2-26} 460 ${cx-130} 610" fill="none" stroke="${c[1]}" stroke-width="${tr.muscle?18:12}" opacity=".85"/>`;
    s+=`<path d="M${cx+torsoW/2-8} 410Q${cx+torsoW/2+26} 460 ${cx+130} 610" fill="none" stroke="${c[1]}" stroke-width="${tr.muscle?18:12}" opacity=".85"/>`;
    // arms
    const arm=tr.martial||tr.muscle?52:43;
    s+=`<path d="M${cx-torsoW/2+10} 420Q${cx-sh/2-25} 465 ${cx-sh/2-42} 590L${cx-sh/2-20} 600Q${cx-sh/2+5} 485 ${cx-torsoW/2+35} 450Z" fill="url(#skin)" stroke="${c[2]}" stroke-width="5"/>`;
    s+=`<path d="M${cx+torsoW/2-10} 420Q${cx+sh/2+25} 465 ${cx+sh/2+42} 590L${cx+sh/2+20} 600Q${cx+sh/2-5} 485 ${cx+torsoW/2-35} 450Z" fill="url(#skin)" stroke="${c[2]}" stroke-width="5"/>`;
    // hands with fingers
    s+=hand(cx-sh/2-31,595,-1,c,r)+hand(cx+sh/2+31,595,1,c,r);
    // clothing detail
    if(tr.tech)s+=`<path d="M${cx-90} 425H${cx+90}M${cx-105} 470H${cx+105}" stroke="${c[0]}" opacity=".38" stroke-width="4"/><circle cx="${cx}" cy="505" r="22" fill="none" stroke="${c[4]}" stroke-width="5"/>`;
    else if(tr.royal)s+=`<path d="M${cx-80} 410L${cx} 500L${cx+80} 410" fill="none" stroke="${c[0]}" stroke-width="7" opacity=".72"/><path d="M${cx} 500L${cx} 685" stroke="${c[0]}" stroke-width="4" opacity=".55"/>`;
    else s+=`<path d="M${cx-70} 420Q${cx} 455 ${cx+70} 420" fill="none" stroke="${c[0]}" stroke-width="5" opacity=".5"/>`;
    s+=`<path d="M${cx-50} 650Q${cx} 668 ${cx+50} 650" fill="none" stroke="#05070b" stroke-width="18" opacity=".45"/>`;
    s+=`</g>`;
    return s;
  }

  function hand(x,y,dir,c,r){
    const spread=pick([14,18,22],r), w=dir<0?x-2:x+2;
    let fingers="";
    for(let i=0;i<4;i++){
      const fx=w+dir*(i*spread*.28), fy=y+8-(i%2)*3;
      fingers+=`<path d="M${fx} ${fy}q${dir*10} ${-8-i} ${dir*(14+i*2)} ${-2}" fill="none" stroke="url(#skin)" stroke-width="10" stroke-linecap="round"/>`;
    }
    return `<g>${fingers}<ellipse cx="${x}" cy="${y}" rx="27" ry="20" fill="url(#skin)" stroke="${c[2]}" stroke-width="4"/></g>`;
  }

  function skin(b,c,r){
    const t=corpus(b);
    if(has(t,"pele azul","pele verde","escama","golem","metálica","não humana"))return c[0];
    if(has(t,"negro","negra","black skin","african"))return "#70493b";
    if(has(t,"pálida","pálido","palido","albino","vamp"))return "#eadfdc";
    if(has(t,"asiát","japon","oriental"))return "#d7a985";
    return pick(["#f2c7a7","#dfa988","#c68a6b","#a96f58","#f5d2b7","#b97b61"],r);
  }

  function head(b,tr,c,r){
    const sk=skin(b,c,r), jaw=pick(["oval","angular","soft","long","square"],r);
    const w=jaw==="square"?83:jaw==="long"?69:jaw==="angular"?76:80;
    const top=120, chin=345;
    let s="";
    // neck + ears
    s+=`<path d="M232 305L232 390Q256 410 280 390L280 305" fill="url(#skin)" stroke="${c[2]}" stroke-width="5"/>`;
    if(tr.elf||tr.beast)s+=`<path d="M${256-w+4} 225L${256-w-80} 150L${256-w+20} 275Z" fill="url(#skin)" stroke="${c[2]}" stroke-width="6"/><path d="M${256+w-4} 225L${256+w+80} 150L${256+w-20} 275Z" fill="url(#skin)" stroke="${c[2]}" stroke-width="6"/>`;
    if(tr.horn)s+=`<path d="M205 172Q135 120 132 48Q190 73 225 138Z" fill="url(#horn)" stroke="${c[2]}" stroke-width="7"/><path d="M307 172Q377 120 380 48Q322 73 287 138Z" fill="url(#horn)" stroke="${c[2]}" stroke-width="7"/>`;
    if(tr.wing)s+=`<g fill="url(#wing)" stroke="${c[0]}" stroke-width="4" opacity=".9"><path d="M175 350Q50 300 58 165Q145 190 205 305Z"/><path d="M337 350Q462 300 454 165Q367 190 307 305Z"/></g>`;
    const headPath=`M256 ${top}Q${256-w} 145 ${256-w-2} 235Q${256-w+4} 300 216 328Q256 ${jaw==="long"?365:350} 296 328Q${256+w-4} 300 ${256+w+2} 235Q${256+w} 145 256 ${top}Z`;
    s+=`<path d="${headPath}" fill="url(#skin)" stroke="${c[2]}" stroke-width="6"/>`;
    // face planes
    s+=`<path d="M205 276Q220 318 256 325Q292 318 307 276" fill="none" stroke="#8b554a" stroke-width="4" opacity=".32"/>`;
    // eyebrows
    const brow=pick(["straight","arched","heavy","thin"],r);
    const bw=brow==="heavy"?9:brow==="thin"?4:6;
    s+=`<path d="M196 214Q220 ${brow==="arched"?190:204} 244 215M268 215Q292 ${brow==="arched"?190:204} 316 214" fill="none" stroke="#3a2830" stroke-width="${bw}" stroke-linecap="round"/>`;
    // eyes
    const eye=pick(["sharp","round","tired","wide"],r), iris=tr.cosmic||tr.psychic||b.stars>=6?c[0]:c[4];
    if(eye==="sharp")s+=`<path d="M194 238Q219 214 246 239Q219 254 194 238ZM266 239Q293 214 318 238Q293 254 266 239Z" fill="#15131a"/>`;
    else if(eye==="tired")s+=`<path d="M195 238Q220 224 245 239M267 239Q292 224 317 238" fill="none" stroke="#17151b" stroke-width="12" stroke-linecap="round"/>`;
    else s+=`<ellipse cx="221" cy="239" rx="${eye==="wide"?18:15}" ry="${eye==="wide"?16:13}" fill="#17151c"/><ellipse cx="291" cy="239" rx="${eye==="wide"?18:15}" ry="${eye==="wide"?16:13}" fill="#17151c"/>`;
    s+=`<circle cx="221" cy="239" r="${b.stars>=6?8:6}" fill="${iris}" filter="url(#glow)"/><circle cx="291" cy="239" r="${b.stars>=6?8:6}" fill="${iris}" filter="url(#glow)"/>`;
    // nose + mouth
    s+=`<path d="M256 238Q247 273 238 287Q256 295 274 287" fill="none" stroke="#925d53" stroke-width="5" stroke-linecap="round"/>`;
    const mouth=pick(["calm","smirk","stern","soft"],r);
    if(mouth==="smirk")s+=`<path d="M231 308Q258 320 281 303" fill="none" stroke="#713d46" stroke-width="6" stroke-linecap="round"/>`;
    else if(mouth==="stern")s+=`<path d="M232 311Q256 304 280 311" fill="none" stroke="#713d46" stroke-width="6" stroke-linecap="round"/>`;
    else s+=`<path d="M232 307Q256 ${mouth==="soft"?320:314} 280 307" fill="none" stroke="#713d46" stroke-width="5" stroke-linecap="round"/>`;
    // scars / marks
    const t=corpus(b);
    if(has(t,"cicatriz","scar","ferida","marcado"))s+=`<path d="M205 185L228 265M212 178L235 257" stroke="#8b4652" stroke-width="5" opacity=".8"/>`;
    if(tr.tech)s+=`<path d="M185 170Q256 130 327 170" fill="none" stroke="${c[4]}" stroke-width="5" opacity=".65"/><circle cx="314" cy="206" r="6" fill="${c[0]}" filter="url(#glow)"/>`;
    if(tr.dark)s+=`<path d="M208 292Q256 335 304 292" fill="none" stroke="#3a172c" stroke-width="10" opacity=".45"/>`;
    return s;
  }

  function hair(b,tr,c,r){
    const t=corpus(b);
    let col=has(t,"branco","prata","silver","white")?"#eef7ff":has(t,"vermelho","ruivo","red","scarlet")?"#a8434a":has(t,"azul","blue")?"#4d76d0":has(t,"rosa","pink")?"#d867a9":has(t,"preto","black")?"#171923":pick(["#252936","#5e3e30","#8d623f","#c49a68","#6d4f89","#3b566b"],r);
    const style=pick([0,1,2,3,4,5],r);
    const stroke=c[2], sw=6;
    const paths=[
      `M165 210Q135 98 205 60Q286 20 350 105Q370 150 345 218L315 164Q286 125 256 150Q215 120 165 210Z`,
      `M158 214Q145 75 256 52Q368 75 354 214L320 165L285 105L257 155L216 98L184 170Z`,
      `M160 205Q170 70 256 62Q342 70 352 205L312 153Q284 130 256 146Q220 132 190 162Z`,
      `M150 218Q160 84 250 54Q344 66 365 210Q330 194 295 145Q256 178 219 143Q186 190 150 218Z`,
      `M170 205Q130 125 192 72Q256 20 328 76Q368 124 340 210L308 172Q292 112 255 124Q214 108 170 205Z`,
      `M155 202Q185 58 255 66Q335 57 355 202L324 145Q300 116 276 139Q246 100 210 148Q188 173 155 202Z`
    ];
    let s=`<path d="${paths[style]}" fill="url(#hair)" stroke="${stroke}" stroke-width="${sw}"/>`;
    if(style===1||style===3)s+=`<path d="M190 120L175 215M222 96L212 160M290 98L302 158M324 120L340 210" fill="none" stroke="${c[0]}" stroke-width="5" opacity=".35"/>`;
    if(has(t,"trança","braid","trança longa"))s+=`<path d="M182 170Q120 270 175 390Q205 300 190 230" fill="none" stroke="${col}" stroke-width="26" stroke-linecap="round"/><path d="M330 170Q392 270 337 390Q307 300 322 230" fill="none" stroke="${col}" stroke-width="26" stroke-linecap="round"/>`;
    return s;
  }

  function outfit(b,tr,c,r){
    const title=b.title.toLowerCase(), n=b.stars;
    let s="";
    if(tr.tech)s+=`<path d="M145 390Q256 350 367 390L405 690Q256 720 107 690Z" fill="url(#armor)" stroke="${c[2]}" stroke-width="7"/><path d="M160 420H352M145 485H367M135 550H377" stroke="${c[0]}" stroke-width="4" opacity=".32"/>`;
    else if(tr.royal)s+=`<path d="M145 390Q256 350 367 390L455 700Q350 660 256 700Q162 660 57 700Z" fill="url(#royal)" stroke="${c[2]}" stroke-width="7"/><path d="M256 390V690M185 420Q256 475 327 420" stroke="${c[0]}" stroke-width="7" opacity=".58" fill="none"/>`;
    else if(tr.rogue)s+=`<path d="M150 390Q256 350 362 390L392 700Q256 735 120 700Z" fill="#121722" stroke="${c[2]}" stroke-width="7"/><path d="M145 405L256 485L367 405" fill="none" stroke="${c[1]}" stroke-width="8"/>`;
    else if(tr.martial)s+=`<path d="M150 392Q256 355 362 392L390 700Q256 720 122 700Z" fill="url(#cloth)" stroke="${c[2]}" stroke-width="7"/><path d="M256 400L256 700M175 415L337 560" stroke="${c[0]}" stroke-width="6" opacity=".5"/>`;
    else s+=`<path d="M145 392Q256 350 367 392L392 700Q256 735 120 700Z" fill="url(#cloth)" stroke="${c[2]}" stroke-width="7"/>`;
    // collar / chest piece
    if(tr.magic||tr.psychic||tr.cosmic||n>=6)s+=`<path d="M214 405L256 460L298 405L282 500L256 535L230 500Z" fill="url(#gem)" stroke="${c[0]}" stroke-width="5" filter="url(#glow)"/>`;
    else s+=`<path d="M210 405Q256 438 302 405" fill="none" stroke="${c[0]}" stroke-width="5" opacity=".55"/>`;
    if(has(title,"professor","mestre","lorde","rei","rainha"))s+=`<path d="M175 420Q256 460 337 420" fill="none" stroke="${c[0]}" stroke-width="8" opacity=".6"/>`;
    return s;
  }

  function weapon(b,tr,c,r){
    const t=corpus(b), ref=allRefs(b);
    const q=t+" "+ref;
    if(tr.sword)return `<g transform="rotate(${pick([-20,-12,12,18],r)} 420 350)"><path d="M420 90L438 94L432 370L412 370Z" fill="url(#blade)" stroke="${c[0]}" stroke-width="5" filter="url(#glow)"/><path d="M385 360H460L443 386H401Z" fill="${c[1]}"/><path d="M420 386L420 510" stroke="#4a3029" stroke-width="16"/><circle cx="420" cy="515" r="13" fill="${c[0]}"/></g>`;
    if(tr.bow)return `<g transform="rotate(${pick([-8,8],r)} 420 360)"><path d="M430 110Q350 350 430 590" fill="none" stroke="${c[0]}" stroke-width="10"/><path d="M430 110Q380 350 430 590" fill="none" stroke="#eee" stroke-width="2"/><path d="M330 350H455" stroke="${c[1]}" stroke-width="7"/><path d="M455 350L420 336L420 364Z" fill="${c[0]}"/></g>`;
    if(tr.hammer)return `<g transform="rotate(8 420 330)"><path d="M420 170V530" stroke="#70503c" stroke-width="17"/><rect x="350" y="100" width="140" height="105" rx="20" fill="url(#blade)" stroke="${c[0]}" stroke-width="7" filter="url(#glow)"/><path d="M365 135H475" stroke="${c[0]}" stroke-width="5" opacity=".45"/></g>`;
    if(tr.shield)return `<g><path d="M420 135Q500 170 470 350Q450 430 420 450Q390 430 370 350Q340 170 420 135Z" fill="url(#shield)" stroke="${c[0]}" stroke-width="9"/><path d="M420 205L440 255L493 260L451 292L463 345L420 314L377 345L389 292L347 260L400 255Z" fill="${c[1]}" opacity=".8"/></g>`;
    if(tr.spear)return `<g transform="rotate(${pick([-6,6],r)} 420 350)"><path d="M420 95L420 560" stroke="#b58a63" stroke-width="9"/><path d="M395 165L420 75L445 165L420 150Z" fill="url(#blade)" stroke="${c[0]}" stroke-width="6" filter="url(#glow)"/></g>`;
    if(tr.gun)return `<g transform="rotate(-8 420 350)"><rect x="345" y="265" width="145" height="46" rx="10" fill="#202636" stroke="${c[0]}" stroke-width="5"/><path d="M390 311L405 400L438 400L425 311Z" fill="#111722"/><circle cx="470" cy="287" r="8" fill="${c[4]}" filter="url(#glow)"/></g>`;
    if(has(q,"cajado","staff","varinha","wand"))return `<g><path d="M420 150Q390 330 425 560" fill="none" stroke="#8b6546" stroke-width="12"/><circle cx="420" cy="125" r="34" fill="url(#gem)" stroke="${c[0]}" stroke-width="6" filter="url(#glow)"/></g>`;
    // distinctive equipment even when the reference is unusual
    const shapes=[
      `<g transform="rotate(-12 420 360)"><path d="M420 125L438 430" stroke="${c[0]}" stroke-width="11"/><circle cx="420" cy="105" r="28" fill="${c[1]}" filter="url(#glow)"/></g>`,
      `<g><path d="M370 185L465 520" stroke="${c[0]}" stroke-width="7"/><path d="M355 205L382 190L470 505L445 518Z" fill="url(#blade)" opacity=".7"/></g>`
    ];
    return pick(shapes,r);
  }

  function powers(b,tr,c,r,n){
    if(!b.hasPower)return "";
    let s="";
    if(tr.fire)s+=`<g fill="none" stroke="${c[1]}" stroke-width="8" opacity=".78" filter="url(#glow)"><path d="M65 650Q110 520 155 610Q185 485 220 640"/><path d="M292 640Q330 500 365 610Q410 505 460 650"/></g>`;
    if(tr.ice)s+=`<g stroke="${c[0]}" stroke-width="7" fill="none" opacity=".8" filter="url(#glow)"><path d="M50 630L105 510L75 430L150 360"/><path d="M462 630L407 510L438 430L362 360"/></g>`;
    if(tr.lightning)s+=`<g fill="none" stroke="${c[0]}" stroke-width="7" opacity=".9" filter="url(#glow)">${[65,130,382,447].map((x,i)=>`<path d="M${x} 630L${x+35} ${530-i*22}L${x+12} ${460-i*15}L${x+62} ${360-i*12}"/>`).join("")}</g>`;
    if(tr.water)s+=`<g fill="none" stroke="${c[0]}" stroke-width="13" opacity=".72"><path d="M20 620Q110 510 200 620T530 620"/><path d="M5 665Q100 555 205 665T535 665"/></g>`;
    if(tr.dark)s+=`<g fill="${c[2]}" opacity=".66"><circle cx="75" cy="315" r="85"/><circle cx="442" cy="345" r="100"/><path d="M30 700Q145 520 256 610Q370 505 482 700Z"/></g>`;
    if(tr.light)s+=`<g fill="none" stroke="${c[0]}" opacity=".6"><circle cx="256" cy="300" r="175" stroke-width="9"/><circle cx="256" cy="300" r="215" stroke-width="3"/><path d="M256 65V535M35 300H477" stroke-width="4"/></g>`;
    if(tr.psychic)s+=`<g fill="none" stroke="${c[0]}" opacity=".56"><circle cx="256" cy="295" r="120" stroke-width="9"/><circle cx="256" cy="295" r="175" stroke-width="3" stroke-dasharray="8 13"/><path d="M115 295Q256 160 397 295Q256 430 115 295Z" stroke-width="5"/></g>`;
    if(tr.cosmic)s+=`<g fill="${c[0]}" opacity=".72">${Array.from({length:28},()=>`<circle cx="${20+r()*472}" cy="${80+r()*560}" r="${1+r()*4}"/>`).join("")}</g>`;
    if(tr.tech)s+=`<g fill="none" stroke="${c[4]}" opacity=".45" stroke-width="3"><path d="M20 210H115L160 245H352L397 210H492"/><path d="M30 570H130L180 530H332L382 570H482"/></g>`;
    if(tr.magic&&!tr.fire&&!tr.ice&&!tr.lightning&&!tr.dark&&!tr.light&&!tr.psychic&&!tr.cosmic&&!tr.tech)s+=`<g fill="none" stroke="${c[1]}" opacity=".56"><circle cx="256" cy="300" r="160" stroke-width="5"/><path d="M256 105L300 210L410 215L322 280L350 395L256 325L162 395L190 280L102 215L212 210Z" stroke-width="3"/></g>`;
    if(tr.speedster||has(b.speed.toLowerCase(),"flash","mercúrio","quicksilver","sonic","extrema","absurda"))s+=`<g stroke="${c[0]}" opacity=".38" stroke-width="6">${Array.from({length:10},(_,i)=>`<path d="M${5+i*53} ${120+i*36}L${110+i*45} ${80+i*22}"/>`).join("")}</g>`;
    return s;
  }

  function pose(b,tr,c,r){
    const speed=b.speed.toLowerCase(), combat=b.combat.toLowerCase();
    if(tr.speedster||has(speed,"flash","mercúrio","quicksilver","sonic","velocidade extrema","absurda"))return `<g opacity=".85"><path d="M170 590Q235 545 310 575" fill="none" stroke="${c[0]}" stroke-width="9"/><path d="M150 625Q240 575 335 610" fill="none" stroke="${c[1]}" stroke-width="5"/></g>`;
    if(has(combat,"mestre","expert","especialista","lendário","elite","veterano"))return `<g fill="none" stroke="${c[0]}" opacity=".3"><path d="M130 610Q256 470 382 610" stroke-width="4"/><path d="M105 665Q256 520 407 665" stroke-width="2"/></g>`;
    return "";
  }

  function accessories(b,tr,c,r){
    let s="";
    if(tr.royal)s+=`<path d="M212 365L256 335L300 365L286 380L256 362L226 380Z" fill="${c[1]}" stroke="${c[0]}" stroke-width="4"/>`;
    if(tr.tech)s+=`<g fill="none" stroke="${c[4]}" stroke-width="4" opacity=".75"><circle cx="185" cy="470" r="18"/><circle cx="327" cy="470" r="18"/><path d="M203 470H309"/></g>`;
    if(has(corpus(b),"óculos","oculos","glasses","óculos de grau"))s+=`<g fill="none" stroke="#252833" stroke-width="6"><rect x="180" y="220" width="75" height="48" rx="12"/><rect x="257" y="220" width="75" height="48" rx="12"/><path d="M255 238H257"/></g>`;
    if(has(corpus(b),"brinco","earring"))s+=`<g fill="${c[1]}" filter="url(#glow)"><circle cx="180" cy="278" r="8"/><circle cx="332" cy="278" r="8"/></g>`;
    if(tr.rogue)s+=`<path d="M170 400L256 475L342 400" fill="none" stroke="#080b11" stroke-width="22" opacity=".65"/>`;
    return s;
  }

  function buildSVG(p,rarity,story){
    const b=brief(p,rarity,story), n=b.stars, tr=traits(b), c=palette(b,tr), seed=hash(JSON.stringify(b)), r=rng(seed), m=R[n];
    const defs=`<defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#020309"/><stop offset=".48" stop-color="${c[2]}"/><stop offset="1" stop-color="#010104"/></linearGradient>
      <radialGradient id="aura"><stop stop-color="${c[0]}" stop-opacity=".48"/><stop offset=".5" stop-color="${c[1]}" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <linearGradient id="cloth" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c[2]}"/><stop offset=".48" stop-color="#0e1420"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>
      <linearGradient id="armor" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#edf6ff"/><stop offset=".28" stop-color="${c[2]}"/><stop offset=".72" stop-color="#111927"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>
      <linearGradient id="royal"><stop stop-color="#10152b"/><stop offset=".5" stop-color="${c[2]}"/><stop offset="1" stop-color="#090b14"/></linearGradient>
      <linearGradient id="gem"><stop stop-color="#fff"/><stop offset=".25" stop-color="${c[0]}"/><stop offset=".55" stop-color="${c[4]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>
      <linearGradient id="blade"><stop stop-color="#fff"/><stop offset=".2" stop-color="${c[0]}"/><stop offset=".5" stop-color="${c[1]}"/><stop offset=".75" stop-color="#fff"/><stop offset="1" stop-color="${c[2]}"/></linearGradient>
      <linearGradient id="shield"><stop stop-color="${c[2]}"/><stop offset=".5" stop-color="#101829"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>
      <linearGradient id="horn"><stop stop-color="#efe1bd"/><stop offset=".55" stop-color="#a48a61"/><stop offset="1" stop-color="#5b4b38"/></linearGradient>
      <linearGradient id="wing"><stop stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="${c[0]}" stop-opacity=".2"/></linearGradient>
      <linearGradient id="hair"><stop stop-color="#fff" stop-opacity=".16"/><stop offset=".18" stop-color="${c[1]}"/><stop offset=".8" stop-color="#10131d"/><stop offset="1" stop-color="${c[2]}"/></linearGradient>
      <linearGradient id="skin"><stop stop-color="#fff" stop-opacity=".13"/><stop offset=".18" stop-color="__SKIN__"/><stop offset="1" stop-color="#6c3f39" stop-opacity=".92"/></linearGradient>
      <linearGradient id="prism"><stop stop-color="#fff"/><stop offset=".2" stop-color="#65f7ff"/><stop offset=".45" stop-color="#ff65dc"/><stop offset=".7" stop-color="#fff06b"/><stop offset="1" stop-color="#fff"/></linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="soft"><feGaussianBlur stdDeviation="${7+n*1.3}"/></filter>
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 .05 0"/></filter>
    </defs>`;
    const sk=skin(b,c,r);
    const defsFixed=defs.replace("__SKIN__",sk);
    let s=`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1520" viewBox="0 0 512 760" role="img" aria-label="Arte de ${esc(b.name)}">${defsFixed}`;
    s+=background(b,tr,c,r,n);
    s+=`<circle cx="256" cy="315" r="285" fill="url(#aura)"/><ellipse cx="256" cy="390" rx="${160+n*9}" ry="${230+n*7}" fill="${c[1]}" opacity="${(.035+n*.012).toFixed(3)}" filter="url(#soft)"/>`;
    s+=particles(c,r,n,tr);
    s+=pose(b,tr,c,r);
    s+=powers(b,tr,c,r,n);
    s+=body(b,tr,c,r);
    s+=outfit(b,tr,c,r);
    s+=weapon(b,tr,c,r);
    s+=head(b,tr,c,r);
    s+=hair(b,tr,c,r);
    s+=accessories(b,tr,c,r);
    // foreground depth / cinematic light
    if(n>=5)s+=`<path d="M-40 690L550 80" stroke="#fff" stroke-width="24" opacity=".045"/><path d="M-20 720L545 125" stroke="${c[1]}" stroke-width="7" opacity=".12"/>`;
    if(n>=8)s+=`<rect width="512" height="760" fill="url(#prism)" opacity=".09"/><path d="M20 160L490 610" stroke="#fff" stroke-width="2" opacity=".12"/>`;
    // subtle print texture, but never a generic card UI inside the art
    s+=`<rect width="512" height="760" fill="#fff" opacity=".025" filter="url(#grain)"/>`;
    s+=`<rect x="8" y="8" width="496" height="744" rx="28" fill="none" stroke="${m[1]}" stroke-width="${n>=9?5:n>=7?4:n>=5?2.7:1.6}" opacity=".82"/>`;
    s+=`</svg>`;
    return s;
  }

  function buildPrompt(p,rarity,story){
    const b=brief(p,rarity,story), refs=Object.entries(b.refs).filter(([,x])=>x).map(([k,x])=>`${k}: ${x}`).join("; ");
    return `ROULETA DA VIDA V18 — detailed original collectible character illustration.\nRarity: ${R[b.stars][0]}. ${rarityDirection(b.stars)}\nCharacter: ${b.name}; race: ${b.race}; age: ${b.age}; title: ${b.title}; appearance: ${b.appearance}; condition: ${b.condition}; strength reference: ${b.force}; speed reference: ${b.speed}; intelligence reference: ${b.intelligence}; combat reference: ${b.combat}; talent: ${b.talent}; power: ${b.power}; control: ${b.control}; weapon/equipment: ${b.weapon}.\nReference map: ${refs||"none"}.\nOrigin/story: ${clean(b.story).slice(0,2600)}\nRULE: every visible design decision must come from the character sheet; do not default to a generic handsome fantasy humanoid.`;
  }

  function svgImage(svg){
    return new Promise((resolve,reject)=>{
      const blob=new Blob([svg],{type:"image/svg+xml;charset=utf-8"});
      const url=URL.createObjectURL(blob), img=new Image();
      img.decoding="async";img.alt="Arte detalhada do personagem";
      img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};
      img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("LOCAL_ART_LOAD_FAILED"))};
      img.src=url;
    });
  }

  function install(){
    if(document.getElementById("rv-card-v18"))return;
    const s=document.createElement("style");s.id="rv-card-v18";
    s.textContent=`.collector-card .ai-character-art{display:block;width:100%;height:100%;object-fit:cover;object-position:center top;background:#03050a;image-rendering:auto}.collector-8 .ai-character-art,.collector-9 .ai-character-art{filter:saturate(1.08) contrast(1.04)}`;
    document.head.appendChild(s);
  }

  async function generate(p,rarity,story){
    if(active)return active;
    active=(async()=>{
      const svg=buildSVG(p,rarity,story);
      try{return await svgImage(svg)}
      catch(e){const img=new Image();img.alt="Arte detalhada do personagem";img.src="data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg);return img}
    })();
    try{return await active}finally{active=null}
  }

  async function generateAfterUserGesture(p,rarity,story){return generate(p,rarity,story)}

  install();
  window.VisualEngine={MODEL,PROVIDER:"local",VERSION,version:VERSION,buildPrompt,buildSVG,generate,generateAfterUserGesture};
})();
