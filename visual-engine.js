/* ROULETA DA VIDA V19 — LOCAL CHARACTER VISUAL FORGE
   Não gera imagem por IA externa. Monta uma ilustração SVG em camadas a partir
   do DNA sorteado: referência -> tags -> anatomia -> roupa -> pose -> ambiente -> efeitos.
   Assim, a arte é reproduzível, gratuita e funciona em celulares sem login.
*/
(()=>{
'use strict';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let x=(seed||1)>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296}}
const pick=(a,r)=>a[Math.floor(r()*a.length)];
const tags=x=>String(x?.tags||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
const corpus=p=>Object.values(p).map(x=>x?.name||x||'').join(' ').toLowerCase();
const has=(set,...a)=>a.some(x=>set.has(x)||set.has(x.toLowerCase()));
const clean=x=>String(x??'').replace(/\s+/g,' ').trim();
const R=[null,['COMUM','#a1a7b0'],['INCOMUM','#62df91'],['RARO','#58a9ff'],['ÉPICO','#9b6cff'],['LENDÁRIO','#ff62cf'],['MÍTICO','#ffad43'],['DIVINO','#ffe85b'],['TRANSCENDENTE','#62e9ff'],['ABSOLUTO','#ffffff']];
function brief(f){const p=f.p||f;const refs=f.refs||{};return {p,refs,stars:f.rarity?.stars||1,name:p.name?.name||p.name||'Personagem'};}
function palette(t,n){
 if(has(t,'fire','phoenix'))return ['#fff1cf','#ff6848','#351423','#ffba3e','#ffd99a'];
 if(has(t,'ice'))return ['#effcff','#69e6ff','#172b4d','#b7f6ff','#83aaff'];
 if(has(t,'lightning','speedster'))return ['#fffce0','#ffe15a','#2c2960','#8deaff','#d6d0ff'];
 if(has(t,'water','mermaid','triton'))return ['#e6fbff','#54d8ff','#12365f','#a5efff','#5c8dff'];
 if(has(t,'dark','demon','vamp','hollow'))return ['#f8e8f1','#ef5e98','#211323','#9b4de0','#ff9ab8'];
 if(has(t,'light','angel'))return ['#fffef2','#ffe96a','#35345f','#ffffff','#a9ecff'];
 if(has(t,'tech','cyber','android'))return ['#eef6ff','#63b9ff','#151d2e','#b9e2ff','#5f79ff'];
 if(has(t,'cosmic','celestial','god','timelord'))return ['#f0efff','#ad8cff','#14122d','#f0dcff','#5fe4ff'];
 if(has(t,'magic','mage','alchemy'))return ['#f5efff','#ad7cff','#251945','#ff72d4','#8ceeff'];
 if(has(t,'nature','elf','fae'))return ['#f0ffdf','#6bd78e','#173a2b','#c7ff9a','#72d7bf'];
 return ['#f5e9dd','#8d78ff','#1c2b3f','#e6c4a1','#70c9ff'];
}
function background(b,t,c,r,n){
 let s=`<rect width="512" height="760" fill="#020307"/><rect width="512" height="760" fill="url(#bg)"/>`;
 const scene=pick([
  `<path d="M0 545L80 455L150 510L230 390L315 500L405 420L512 500V760H0Z" fill="${c[2]}"/><path d="M0 600L115 505L210 585L315 490L512 570V760H0Z" fill="#070b13"/>`,
  `<g fill="none" stroke="${c[4]}" opacity=".26"><circle cx="256" cy="320" r="130" stroke-width="2"/><circle cx="256" cy="320" r="190" stroke-width="4"/><path d="M30 210H160L205 250H307L352 210H482M30 550H125L170 510H342L387 550H482" stroke-width="3"/></g>`,
  `<path d="M0 520Q70 455 140 520T280 510T420 500T512 460V760H0Z" fill="${c[2]}"/><path d="M0 590Q85 520 165 585T335 570T512 540V760H0Z" fill="#05080e"/>`,
  `<g fill="none" stroke="${c[0]}" opacity=".18"><path d="M30 630C110 470 402 470 482 630" stroke-width="10"/><path d="M60 675C145 535 367 535 452 675" stroke-width="4"/><path d="M90 215Q256 90 422 215" stroke-width="3"/></g>`
 ],r);
 s+=scene;
 if(has(t,'water'))s+=`<g fill="none" stroke="${c[0]}" opacity=".28" stroke-width="10"><path d="M-20 610Q80 520 180 610T540 610"/><path d="M-20 665Q90 570 200 665T540 665"/></g>`;
 if(has(t,'fire'))s+=`<path d="M15 690Q55 555 105 655Q145 500 190 670Q235 535 275 675Q330 505 370 665Q430 535 500 690Z" fill="${c[1]}" opacity=".22"/>`;
 if(has(t,'ice'))s+=`<g fill="none" stroke="${c[0]}" opacity=".24" stroke-width="5"><path d="M40 690L100 540L75 430L145 350"/><path d="M472 690L412 540L438 430L367 350"/></g>`;
 if(has(t,'tech'))s+=`<g stroke="${c[4]}" opacity=".25"><path d="M20 160H120L160 195H350L390 160H492M20 580H100L145 545H367L412 580H492" fill="none" stroke-width="3"/><circle cx="90" cy="160" r="5" fill="${c[4]}"/><circle cx="420" cy="580" r="5" fill="${c[4]}"/></g>`;
 if(has(t,'cosmic')||n>=8){for(let i=0;i<48;i++){s+=`<circle cx="${(10+r()*492).toFixed(1)}" cy="${(20+r()*650).toFixed(1)}" r="${(.5+r()*2.6).toFixed(1)}" fill="${pick(c,r)}" opacity="${(.18+r()*.62).toFixed(2)}"/>`}}
 return s;
}
function effects(t,c,r,n){let s='';const count=n<=2?10:n<=4?18:n<=6?30:52;for(let i=0;i<count;i++){const x=15+r()*482,y=25+r()*650,sz=.8+r()*(n>=7?4:2.4);if(i%6===0&&n>=5)s+=`<path d="M${x} ${y}l${sz} ${sz*2.4}l${sz*2.4} ${sz}l-${sz*2.4} ${sz}l-${sz} ${-sz}Z" fill="${pick(c,r)}" opacity="${.25+r()*.6}"/>`;else s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz.toFixed(1)}" fill="${pick(c,r)}" opacity="${.16+r()*.7}"/>`}
 if(n>=6)s+=`<g fill="none" stroke="${c[1]}" opacity=".22"><ellipse cx="256" cy="345" rx="205" ry="292"/><ellipse cx="256" cy="345" rx="165" ry="238"/></g>`;
 if(n>=8)s+=`<g fill="none" stroke="url(#prism)" opacity=".4" stroke-width="3"><path d="M-40 220L552 25M-60 405L570 180M-30 635L550 390"/></g>`;
 if(has(t,'speedster'))s+=`<g stroke="${c[0]}" opacity=".4" stroke-width="5">${Array.from({length:9},(_,i)=>`<path d="M${-10+i*65} ${150+i*32}L${100+i*45} ${105+i*18}"/>`).join('')}</g>`;
 if(has(t,'psychic','mind'))s+=`<g fill="none" stroke="${c[4]}" opacity=".3"><path d="M85 320Q256 120 427 320Q256 520 85 320Z" stroke-width="7"/><circle cx="256" cy="320" r="120" stroke-width="3" stroke-dasharray="7 12"/></g>`;
 return s;
}
function body(t,c,r,b){
 const muscle=has(t,'muscle','strongman','giant','titan','kaiju'), armor=has(t,'armor','tech','cyber','kryptonian'), royal=has(t,'royal','god','angel'), rogue=has(t,'rogue','assassin','hunter');
 const w=muscle?190:pick([145,158,170,180],r), hip=w*.72;
 const torso=pick([355,365,380],r), arm=muscle?55:44;
 let s='';
 const outfit=armor?`url(#armor)`:royal?`url(#royal)`: `url(#cloth)`;
 s+=`<path d="M${256-w/2} ${torso}Q256 ${torso-38} ${256+w/2} ${torso}L${256+hip/2} 710Q256 735 ${256-hip/2} 710Z" fill="${outfit}" stroke="${c[2]}" stroke-width="6"/>`;
 s+=`<path d="M${256-w/2+8} ${torso+16}Q${256-w/2-35} ${torso+90} ${256-w/2-42} 625" fill="none" stroke="${c[1]}" stroke-width="${arm}" opacity=".85"/>`;
 s+=`<path d="M${256+w/2-8} ${torso+16}Q${256+w/2+35} ${torso+90} ${256+w/2+42} 625" fill="none" stroke="${c[1]}" stroke-width="${arm}" opacity=".85"/>`;
 if(armor)s+=`<path d="M180 405H332M170 455H342" stroke="${c[0]}" stroke-width="5" opacity=".45"/><circle cx="256" cy="500" r="22" fill="none" stroke="${c[4]}" stroke-width="5"/>`;
 else if(royal)s+=`<path d="M190 395L256 495L322 395" fill="none" stroke="${c[0]}" stroke-width="8" opacity=".7"/><path d="M256 495V700" stroke="${c[0]}" stroke-width="4" opacity=".5"/>`;
 else if(rogue)s+=`<path d="M175 405L256 475L337 405" fill="none" stroke="#06080d" stroke-width="24" opacity=".72"/>`;
 else s+=`<path d="M195 420Q256 452 317 420" fill="none" stroke="${c[0]}" stroke-width="5" opacity=".5"/>`;
 return s;
}
function face(t,c,r,b){
 const skin=has(t,'blue','alien','water')?'#77b6d2':has(t,'elf','fae','angel')?'#f0d4c5':has(t,'dark','demon')?'#8f5d55':pick(['#f1c7a8','#dfaa88','#c78969','#a96e58','#f4d3ba','#b97a61'],r);
 const shapes=[['oval',78],['angular',72],['square',84],['long',68],['heart',76]],fs=pick(shapes,r),w=fs[1];
 let s=`<path d="M232 305V390Q256 408 280 390V305" fill="${skin}" stroke="${c[2]}" stroke-width="5"/>`;
 if(has(t,'wing'))s+=`<g fill="url(#wing)" stroke="${c[0]}" stroke-width="4" opacity=".9"><path d="M180 365Q45 310 62 155Q150 190 207 315Z"/><path d="M332 365Q467 310 450 155Q362 190 305 315Z"/></g>`;
 if(has(t,'horn','oni','dragon','demon'))s+=`<path d="M205 170Q132 115 135 45Q192 70 225 140Z" fill="url(#horn)" stroke="${c[2]}" stroke-width="7"/><path d="M307 170Q380 115 377 45Q320 70 287 140Z" fill="url(#horn)" stroke="${c[2]}" stroke-width="7"/>`;
 if(has(t,'elf','fae','fox','kitsune'))s+=`<path d="M${256-w+7} 220L${256-w-65} 135L${256-w+20} 280Z" fill="${skin}" stroke="${c[2]}" stroke-width="6"/><path d="M${256+w-7} 220L${256+w+65} 135L${256+w-20} 280Z" fill="${skin}" stroke="${c[2]}" stroke-width="6"/>`;
 s+=`<path d="M256 120Q${256-w} 145 ${256-w-2} 235Q${256-w+4} 300 215 330Q256 ${fs[0]==='long'?366:350} 297 330Q${256+w-4} 300 ${256+w+2} 235Q${256+w} 145 256 120Z" fill="${skin}" stroke="${c[2]}" stroke-width="6"/>`;
 const brow=pick(['straight','arched','heavy','thin'],r),eye=pick(['sharp','round','tired','wide','cat'],r),iris=has(t,'cosmic','psychic','lightning')?c[0]:c[4];
 s+=`<path d="M194 214Q220 ${brow==='arched'?188:204} 244 214M268 214Q292 ${brow==='arched'?188:204} 318 214" fill="none" stroke="#32262b" stroke-width="${brow==='heavy'?9:brow==='thin'?4:6}" stroke-linecap="round"/>`;
 if(eye==='sharp'||eye==='cat')s+=`<path d="M193 239Q220 213 247 239Q220 256 193 239ZM265 239Q292 213 319 239Q292 256 265 239Z" fill="#15131b"/>`;
 else if(eye==='tired')s+=`<path d="M194 240Q220 224 246 240M266 240Q292 224 318 240" fill="none" stroke="#15131b" stroke-width="13" stroke-linecap="round"/>`;
 else s+=`<ellipse cx="221" cy="239" rx="${eye==='wide'?18:15}" ry="${eye==='wide'?17:13}" fill="#15131b"/><ellipse cx="291" cy="239" rx="${eye==='wide'?18:15}" ry="${eye==='wide'?17:13}" fill="#15131b"/>`;
 s+=`<circle cx="221" cy="239" r="${b.stars>=6?8:6}" fill="${iris}" filter="url(#glow)"/><circle cx="291" cy="239" r="${b.stars>=6?8:6}" fill="${iris}" filter="url(#glow)"/>`;
 const mouth=pick(['calm','smirk','stern','soft'],r);s+=`<path d="M232 308Q256 ${mouth==='smirk'?320:mouth==='stern'?304:314} 280 308" fill="none" stroke="#713d46" stroke-width="5" stroke-linecap="round"/>`;
 if(has(t,'scar'))s+=`<path d="M205 180L228 265M212 176L235 258" stroke="#8b4652" stroke-width="5" opacity=".8"/>`;
 if(has(t,'mask','hollow'))s+=`<path d="M185 220Q256 175 327 220L315 290Q256 320 197 290Z" fill="#eef5ff" opacity=".85"/><path d="M205 238Q221 220 242 239M270 239Q291 220 307 238" stroke="#12131a" stroke-width="7"/>`;
 return s;
}
function hair(t,c,r){
 const col=has(t,'silver','white')?'#edf6ff':has(t,'red')?'#a9484d':has(t,'blue')?'#4f79d5':has(t,'pink')?'#d767a9':has(t,'black','dark')?'#161923':pick(['#2b2e39','#63402e','#8d623e','#c39a69','#6e4d8d','#3c596e'],r);
 const paths=[
  `M158 215Q145 75 256 50Q367 75 354 215L320 160Q286 115 256 145Q220 115 184 170Z`,
  `M155 220Q155 70 255 60Q355 70 360 220L315 165L275 100L255 150L215 105L182 170Z`,
  `M150 205Q165 55 255 65Q350 55 370 205Q330 190 292 145Q256 175 220 142Q185 185 150 205Z`,
  `M165 205Q120 130 190 65Q256 18 330 78Q378 130 345 210L305 170Q280 118 250 135Q210 115 165 205Z`,
  `M170 208Q145 100 220 62Q300 32 350 120Q365 165 340 220L300 168Q260 135 230 165Z`,
  `M158 212Q170 90 256 45Q342 90 354 212L315 154L285 115L256 160L225 110L190 165Z`
 ];
 return `<path d="${pick(paths,r)}" fill="${col}" stroke="${c[2]}" stroke-width="7"/>`;
}
function weapon(p,t,c,r){const q=corpus(p), x=420; if(has(t,'none'))return '';
 if(has(t,'lightsaber'))return `<g transform="rotate(8 420 350)"><path d="M420 180V535" stroke="#d7d7d7" stroke-width="13"/><path d="M420 165V65" stroke="${c[0]}" stroke-width="15" filter="url(#glow)"/><rect x="397" y="510" width="46" height="45" rx="10" fill="#343b49"/></g>`;
 if(has(t,'hammer','mjolnir'))return `<g transform="rotate(8 420 330)"><path d="M420 185V560" stroke="#75533d" stroke-width="18"/><rect x="348" y="105" width="144" height="105" rx="18" fill="url(#blade)" stroke="${c[0]}" stroke-width="8" filter="url(#glow)"/><path d="M360 140H480" stroke="${c[0]}" stroke-width="5" opacity=".45"/></g>`;
 if(has(t,'shield'))return `<g><path d="M420 120Q505 155 475 350Q452 430 420 458Q388 430 365 350Q335 155 420 120Z" fill="url(#shield)" stroke="${c[0]}" stroke-width="9"/><path d="M420 190L440 245L500 250L452 286L466 345L420 312L374 345L388 286L340 250L400 245Z" fill="${c[1]}" opacity=".85"/></g>`;
 if(has(t,'bow'))return `<g transform="rotate(-7 420 350)"><path d="M425 105Q345 350 425 595" fill="none" stroke="${c[0]}" stroke-width="11"/><path d="M425 105Q375 350 425 595" fill="none" stroke="#eee" stroke-width="2"/><path d="M330 350H465L430 334L430 366Z" fill="${c[1]}"/></g>`;
 if(has(t,'spear','trident'))return `<g transform="rotate(-5 420 350)"><path d="M420 85V565" stroke="#a77d5a" stroke-width="9"/><path d="M390 170L420 65L450 170L420 145Z" fill="url(#blade)" stroke="${c[0]}" stroke-width="6" filter="url(#glow)"/></g>`;
 if(has(t,'sword','katana','scythe','keyblade'))return `<g transform="rotate(12 420 350)"><path d="M420 560L420 195" stroke="#7e604a" stroke-width="13"/><path d="M420 205L450 85L470 45L438 215Z" fill="url(#blade)" stroke="${c[0]}" stroke-width="6" filter="url(#glow)"/><circle cx="420" cy="215" r="22" fill="#181c25" stroke="${c[1]}" stroke-width="6"/></g>`;
 if(has(t,'gun','firearm','rifle'))return `<g transform="rotate(-9 420 350)"><rect x="340" y="265" width="160" height="48" rx="10" fill="#202735" stroke="${c[0]}" stroke-width="5"/><path d="M390 313L407 405L443 405L430 313Z" fill="#10151f"/><circle cx="470" cy="288" r="8" fill="${c[4]}" filter="url(#glow)"/></g>`;
 if(has(t,'staff','magic','grimorio'))return `<g><path d="M420 150Q388 330 425 570" fill="none" stroke="#8a6447" stroke-width="12"/><circle cx="420" cy="120" r="34" fill="url(#gem)" stroke="${c[0]}" stroke-width="6" filter="url(#glow)"/></g>`;
 return `<g transform="rotate(-10 420 350)"><path d="M420 120L438 445" stroke="${c[0]}" stroke-width="12"/><circle cx="420" cy="105" r="28" fill="${c[1]}" filter="url(#glow)"/></g>`;
}
function accessories(p,t,c,r){let s='';if(has(t,'royal','god'))s+=`<path d="M205 170L220 125L256 155L292 125L307 170L292 188L256 168L220 188Z" fill="url(#gem)" stroke="${c[0]}" stroke-width="5"/>`;if(has(t,'tech','cyber'))s+=`<g fill="none" stroke="${c[4]}" stroke-width="4"><circle cx="183" cy="470" r="18"/><circle cx="329" cy="470" r="18"/><path d="M201 470H311"/></g>`;if(has(t,'fox','kitsune'))s+=`<path d="M175 385Q115 325 150 265Q188 315 214 350" fill="none" stroke="${c[1]}" stroke-width="24" stroke-linecap="round" opacity=".85"/>`;return s;}
function buildSVG(f){const b=brief(f),p=b.p,t=new Set(tags(p.race).concat(tags(p.title),tags(p.appearance),tags(p.condition),tags(p.force),tags(p.speed),tags(p.intelligence),tags(p.combat),tags(p.talent),tags(p.power),tags(p.weapons)));const n=b.stars,c=palette(t,n),r=rng(hash(f.visualSeed||JSON.stringify(p))),skin=has(t,'blue')?'#78b7d4':pick(['#f1c7a8','#dca684','#c78a6c','#a96e58','#f5d3b9','#b87b62'],r);
 const defs=`<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#02030a"/><stop offset=".48" stop-color="${c[2]}"/><stop offset="1" stop-color="#010104"/></linearGradient><radialGradient id="aura"><stop stop-color="${c[0]}" stop-opacity=".5"/><stop offset=".55" stop-color="${c[1]}" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient><linearGradient id="cloth"><stop stop-color="#111a29"/><stop offset=".5" stop-color="${c[2]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient><linearGradient id="armor"><stop stop-color="#f4fbff"/><stop offset=".28" stop-color="${c[2]}"/><stop offset=".72" stop-color="#111a2a"/><stop offset="1" stop-color="${c[1]}"/></linearGradient><linearGradient id="royal"><stop stop-color="#0c1020"/><stop offset=".5" stop-color="${c[2]}"/><stop offset="1" stop-color="#080a12"/></linearGradient><linearGradient id="gem"><stop stop-color="#fff"/><stop offset=".3" stop-color="${c[0]}"/><stop offset=".65" stop-color="${c[4]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient><linearGradient id="blade"><stop stop-color="#fff"/><stop offset=".25" stop-color="${c[0]}"/><stop offset=".55" stop-color="${c[1]}"/><stop offset=".8" stop-color="#fff"/><stop offset="1" stop-color="${c[2]}"/></linearGradient><linearGradient id="shield"><stop stop-color="${c[2]}"/><stop offset=".5" stop-color="#111829"/><stop offset="1" stop-color="${c[1]}"/></linearGradient><linearGradient id="horn"><stop stop-color="#f2e5c4"/><stop offset=".55" stop-color="#a48b62"/><stop offset="1" stop-color="#584936"/></linearGradient><linearGradient id="wing"><stop stop-color="#fff" stop-opacity=".96"/><stop offset="1" stop-color="${c[0]}" stop-opacity=".18"/></linearGradient><linearGradient id="prism"><stop stop-color="#fff"/><stop offset=".2" stop-color="#65f8ff"/><stop offset=".45" stop-color="#ff63dc"/><stop offset=".7" stop-color="#fff16c"/><stop offset="1" stop-color="#fff"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="soft"><feGaussianBlur stdDeviation="${7+n*1.2}"/></filter></defs>`;
 let s=`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1520" viewBox="0 0 512 760" role="img" aria-label="Arte de ${esc(b.name)}">${defs}`;
 s+=background(p,t,c,r,n);s+=`<circle cx="256" cy="315" r="285" fill="url(#aura)"/><ellipse cx="256" cy="395" rx="${155+n*10}" ry="${225+n*8}" fill="${c[1]}" opacity="${(.04+n*.012).toFixed(3)}" filter="url(#soft)"/>`;s+=effects(t,c,r,n);
 // Pose varies according to combat/speed/role rather than always front-facing.
 const lean=has(t,'speedster')?-12:has(t,'martial','assassin')?8:has(t,'royal')?-3:pick([-5,0,5],r);
 s+=`<g transform="rotate(${lean} 256 470)">`;
 s+=body(t,c,r,p);s+=weapon(p,t,c,r);s+=face(t,c,r,b);s+=hair(t,c,r);s+=accessories(p,t,c,r);s+=`</g>`;
 if(n>=7)s+=`<path d="M-40 680L552 80" stroke="#fff" stroke-width="26" opacity=".045"/><path d="M-20 720L545 125" stroke="${c[1]}" stroke-width="8" opacity=".13"/>`;
 if(n>=8)s+=`<rect width="512" height="760" fill="url(#prism)" opacity=".075"/><path d="M15 170L495 610" stroke="#fff" stroke-width="2" opacity=".15"/>`;
 s+=`<rect width="512" height="760" fill="#fff" opacity=".025"/>`;
 return s+'</svg>';
}
function buildPrompt(f){return `LOCAL VISUAL FORGE V19. Assemble an original collectible character from the exact roulette DNA. Character: ${f.p.name?.name}; race ${f.p.race?.name}; title ${f.p.title?.name}; appearance ${f.p.appearance?.name}; strength ${f.p.force?.name}; speed ${f.p.speed?.name}; intelligence ${f.p.intelligence?.name}; combat ${f.p.combat?.name}; talent ${f.p.talent?.name}; power ${f.p.power?.name}; weapon ${f.p.weapons?.name}. Reference provenance is explanatory metadata, not an instruction to copy artwork.`}
async function generate(f){const svg=buildSVG(f);return new Promise((resolve,reject)=>{const img=new Image();img.alt=`Arte detalhada de ${f.p.name?.name||'personagem'}`;const blob=new Blob([svg],{type:'image/svg+xml'}),url=URL.createObjectURL(blob);img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('LOCAL_ART_FAILED'))};img.src=url})}
window.VisualEngine={VERSION:'19.0.0',version:'19.0.0',MODEL:'local-character-forge-v19',PROVIDER:'local',buildSVG,buildPrompt,generate,generateAfterUserGesture:generate};
})();
