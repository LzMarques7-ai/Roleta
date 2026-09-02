/* ROULETA DA VIDA — VISUAL ENGINE
   DATA-FIRST CHARACTER RENDERER
   O banco de referências é a fonte de decisão visual:
   race/title/appearance/condition/force/speed/intelligence/combat/talent/
   power/control/weapons/potential/life -> perfil -> composição -> SVG.
*/
(()=> {
'use strict';

const V = window.VISUAL_DATABASE || {};
const CI = window.CHARACTER_INTELLIGENCE;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=x=>String(x??'').trim();
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const rng=seed=>()=>{seed|=0;seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t^=t+Math.imul(t^(t>>>7),61|t);return((t^(t>>>14))>>>0)/4294967296};
const pick=(a,r)=>a[Math.floor(r()*a.length)];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const val=(p,k)=>clean(p?.[k]?.name ?? p?.[k] ?? '');
const tagsOf=x=>String(x?.tags||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
const textOf=x=>[x?.name,x?.refType,x?.refWhy,x?.ref,typeof x?.tags==='string'?x.tags:''].join(' ').toLowerCase();
const has=(profile,...xs)=>xs.some(x=>profile.has(x)||profile.tags.some(t=>t.includes(x.toLowerCase())));

function svg(name,attrs={},children=''){
  return `<${name} ${Object.entries(attrs).map(([k,v])=>`${k}="${esc(v)}"`).join(' ')}>${children}</${name}>`;
}

function defs(c){
 return `<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.bg}"/><stop offset=".55" stop-color="${c.mid}"/><stop offset="1" stop-color="#05060b"/></linearGradient>
  <radialGradient id="skin"><stop offset="0" stop-color="${c.skinHi}"/><stop offset="1" stop-color="${c.skin}"/></radialGradient>
  <linearGradient id="cloth" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c.clothHi}"/><stop offset=".5" stop-color="${c.cloth}"/><stop offset="1" stop-color="${c.clothDark}"/></linearGradient>
  <linearGradient id="hair" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c.hairHi}"/><stop offset=".5" stop-color="${c.hair}"/><stop offset="1" stop-color="${c.hairDark}"/></linearGradient>
  <filter id="glow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="soft"><feGaussianBlur stdDeviation="14"/></filter>
 </defs>`;
}

function colors(profile,p,r){
 const sets=V.paletteSets||{};
 let s=sets[profile.power]||sets.neutral||{bg:'#0b0e16',mid:'#263348',light:'#f4e7dc'};
 const appearance=textOf(p.appearance);
 let skin=V.skinTones?.warm||'#d7a080';
 if(/deep|escura|negra|ebony|dark/.test(appearance))skin=V.skinTones?.ebony||'#4b2b2a';
 else if(/blue|azul/.test(appearance))skin=V.skinTones?.blue||'#78b8d2';
 else if(/violet|violeta|roxa|purple/.test(appearance))skin=V.skinTones?.violet||'#9b7bb6';
 else if(/stone|pedra/.test(appearance))skin=V.skinTones?.stone||'#8d8f8b';
 else if(/metal/.test(appearance))skin='#aab4c2';
 else if(/porcelain|porcelana|clara/.test(appearance))skin=V.skinTones?.porcelain||'#f4d4c7';
 const hairName=appearance.match(/silver|pratead|white|branc|red|vermel|blue|azul|purple|roxo|pink|rosa|black|preto|blond|loiro/);
 let hair=V.hairColors?.black||'#141821';
 if(hairName){
   const q=hairName[0];
   if(/silver|pratead|white|branc/.test(q))hair=V.hairColors?.silver||'#b9c6d5';
   else if(/red|vermel/.test(q))hair=V.hairColors?.red||'#a94e4d';
   else if(/blue|azul/.test(q))hair=V.hairColors?.blue||'#4e7fcb';
   else if(/purple|roxo/.test(q))hair=V.hairColors?.purple||'#7554a6';
   else if(/pink|rosa/.test(q))hair=V.hairColors?.pink||'#c9689e';
   else if(/blond|loiro/.test(q))hair=V.hairColors?.blond||'#d9b66f';
 }
 return {
   bg:s.bg,mid:s.mid,accent:s.light,
   skin,skinHi:'#f2c0a7',
   cloth:s.mid,clothHi:s.light,clothDark:'#080b12',
   hair,hairHi:s.light,hairDark:'#11131b',
   eye:V.eyeColors?.cyan||'#66f4ff'
 };
}

function chooseFace(profile,r){
 const f=V.faceShapes||{};
 if(profile.species==='demon'||profile.species==='dragon')return f.angular||{w:88};
 if(profile.species==='merfolk')return f.delicate||{w:80};
 if(profile.species==='vamp')return f.gaunt||{w:74};
 if(profile.species==='golem')return f.square||{w:96};
 if(has(profile,'regal','royal','imperador','rei'))return f.regal||{w:88};
 return pick(Object.values(f),r)||{w:86};
}

function build(f){
 const p=f.p||f;
 const profile=CI?.profile?CI.profile(p):{tags:[],species:'human',power:'neutral',body:'balanced',clothing:'civilian',weapon:'none',anatomy:{}};
 const seed=hash(JSON.stringify(Object.fromEntries(Object.entries(p).map(([k,v])=>[k,v?.name||v]))));
 const r=rng(seed);
 const rarity=clamp(Number(f?.rarity?.stars||f?.stars||6),1,9);
 const c=colors(profile,p,r);
 const face=chooseFace(profile,r);
 const cx=256, headY=255;
 const bodyMap={balanced:{sh:154,tor:132,arm:34},athletic:{sh:168,tor:138,arm:40},muscular:{sh:190,tor:156,arm:50},towering:{sh:218,tor:178,arm:62},graceful:{sh:142,tor:122,arm:30}};
 const b=bodyMap[profile.body]||bodyMap.balanced;
 const headW=face.w||86;
 const skin=c.skin, cloth=c.cloth;

 let out=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 760" width="100%" height="100%" role="img" aria-label="${esc(p.name?.name||'Personagem')}">`;
 out+=defs(c);

 // BACKGROUND — determined by race/power/title, not generic.
 out+=`<rect width="512" height="760" fill="url(#bg)"/>`;
 const scene =
   profile.power==='water' ? 'water' :
   profile.power==='fire' ? 'fire' :
   profile.power==='ice' ? 'ice' :
   profile.power==='lightning' ? 'lightning' :
   profile.power==='cosmic' ? 'cosmic' :
   profile.power==='dark' ? 'dark' :
   profile.power==='nature' ? 'nature' :
   profile.clothing==='royal' ? 'royal' : 'neutral';

 if(scene==='cosmic'){
   out+=`<g opacity=".75">${Array.from({length:55},()=>`<circle cx="${(10+r()*492).toFixed(1)}" cy="${(10+r()*650).toFixed(1)}" r="${(.5+r()*2.2).toFixed(1)}" fill="${c.accent}"/>`).join('')}</g>`;
   out+=`<circle cx="256" cy="330" r="185" fill="none" stroke="${c.accent}" stroke-width="2" opacity=".25"/><circle cx="256" cy="330" r="145" fill="none" stroke="${c.accent}" stroke-width="1" opacity=".25"/>`;
 } else if(scene==='water'){
   out+=`<path d="M0 500 Q100 420 205 505 T512 485 V760H0Z" fill="${c.mid}" opacity=".7"/><path d="M0 560 Q120 480 240 560 T512 550" fill="none" stroke="${c.accent}" stroke-width="9" opacity=".22"/>`;
 } else if(scene==='fire'){
   out+=`<path d="M0 670 Q55 500 105 635 Q155 475 205 650 Q260 500 310 645 Q360 490 410 635 Q455 515 512 670 V760H0Z" fill="${c.accent}" opacity=".16"/>`;
 } else if(scene==='ice'){
   out+=`<g stroke="${c.accent}" stroke-width="5" opacity=".2"><path d="M20 700L90 500L72 390L140 300"/><path d="M492 700L422 500L440 390L372 300"/></g>`;
 } else if(scene==='lightning'){
   out+=`<path d="M75 160L150 245L115 310L195 395" fill="none" stroke="${c.accent}" stroke-width="5" opacity=".55"/><path d="M437 160L362 245L397 310L317 395" fill="none" stroke="${c.accent}" stroke-width="5" opacity=".55"/>`;
 } else if(scene==='royal'){
   out+=`<path d="M45 690V210 Q256 95 467 210V690" fill="none" stroke="${c.accent}" stroke-width="4" opacity=".18"/><path d="M90 610V245 M422 610V245" stroke="${c.accent}" stroke-width="3" opacity=".16"/>`;
 } else {
   out+=`<path d="M0 560 L110 410 L175 485 L256 340 L337 485 L402 410 L512 560 V760H0Z" fill="#070a12" opacity=".65"/>`;
 }

 // AURA — rarity + semantic profile.
 if(rarity>=6 || profile.power!=='neutral'){
   out+=`<ellipse cx="256" cy="360" rx="${150+rarity*8}" ry="${220+rarity*7}" fill="${c.accent}" opacity="${Math.min(.12,.035+rarity*.01)}" filter="url(#soft)"/>`;
 }
 if(profile.power==='cosmic'||rarity>=8){
   out+=`<g fill="none" stroke="${c.accent}" opacity=".35"><circle cx="256" cy="340" r="125"/><circle cx="256" cy="340" r="155" stroke-dasharray="4 12"/><circle cx="256" cy="340" r="190" stroke-dasharray="2 18"/></g>`;
 }

 // ANATOMY — explicit species traits.
 if(profile.anatomy.wings){
   out+=`<path d="M205 365 Q105 225 42 285 Q92 345 172 425 Q90 390 55 475 Q150 485 220 445Z" fill="${c.accent}" opacity=".20" stroke="${c.accent}" stroke-width="6"/><path d="M307 365 Q407 225 470 285 Q420 345 340 425 Q422 390 457 475 Q362 485 292 445Z" fill="${c.accent}" opacity=".20" stroke="${c.accent}" stroke-width="6"/>`;
 }
 if(profile.anatomy.tail){
   const tail=profile.species==='merfolk'
    ? `<path d="M330 610 Q430 640 414 705 Q395 750 322 715 Q360 695 370 660 Q355 635 330 610Z" fill="${c.cloth}" stroke="${c.accent}" stroke-width="3"/>`
    : `<path d="M345 570 Q470 610 440 675 Q405 720 355 690 Q415 650 390 620 Q370 600 345 570Z" fill="${c.cloth}" stroke="${c.accent}" stroke-width="4"/>`;
   out+=tail;
 }
 if(profile.anatomy.horns){
   out+=`<path d="M205 205 Q155 115 122 145 Q135 225 205 250Z" fill="${c.hair}" stroke="${c.accent}" stroke-width="4"/><path d="M307 205 Q357 115 390 145 Q377 225 307 250Z" fill="${c.hair}" stroke="${c.accent}" stroke-width="4"/>`;
 }
 if(profile.anatomy.fins){
   out+=`<path d="M162 535 Q92 570 120 625 Q158 605 180 570Z" fill="${c.accent}" opacity=".7"/><path d="M350 535 Q420 570 392 625 Q354 605 332 570Z" fill="${c.accent}" opacity=".7"/>`;
 }

 // NECK + BODY.
 const torsoTop=405, torsoBottom=715;
 out+=`<rect x="225" y="365" width="62" height="72" rx="28" fill="url(#skin)"/>`;
 out+=`<path d="M${cx-b.sh/2} ${torsoTop} Q256 380 ${cx+b.sh/2} ${torsoTop} L${cx+b.sh*.43} ${torsoBottom} Q256 735 ${cx-b.sh*.43} ${torsoBottom}Z" fill="url(#cloth)" stroke="${c.accent}" stroke-width="4"/>`;

 // Clothing silhouette and collar.
 if(profile.clothing==='royal'){
   out+=`<path d="M205 415 L256 455 L307 415 L334 430 L304 510 L208 510 L178 430Z" fill="${c.accent}" opacity=".18"/><path d="M213 420 L256 452 L299 420" fill="none" stroke="${c.accent}" stroke-width="6"/>`;
 } else if(profile.clothing==='divine'){
   out+=`<path d="M205 412 L256 470 L307 412 L330 430 L302 520 L210 520 L182 430Z" fill="${c.accent}" opacity=".22"/>`;
 } else if(profile.clothing==='knight'){
   out+=`<path d="M185 430 L220 400 L256 455 L292 400 L327 430 L310 485 L202 485Z" fill="#6f7889" opacity=".8" stroke="${c.accent}" stroke-width="3"/>`;
 } else if(profile.clothing==='tech'){
   out+=`<path d="M190 420H322L340 600H172Z" fill="none" stroke="${c.accent}" stroke-width="3" opacity=".65"/><path d="M210 455H302M205 490H307M200 525H312" stroke="${c.accent}" opacity=".35"/>`;
 } else {
   out+=`<path d="M210 420 Q256 455 302 420" fill="none" stroke="${c.accent}" stroke-width="4" opacity=".7"/>`;
 }

 // ARMS.
 out+=`<path d="M${cx-b.sh/2} 425 Q${cx-b.sh/2-18} 500 ${cx-b.sh/2-8} 625" fill="none" stroke="${cloth}" stroke-width="${b.arm}" stroke-linecap="round"/><path d="M${cx+b.sh/2} 425 Q${cx+b.sh/2+18} 500 ${cx+b.sh/2+8} 625" fill="none" stroke="${cloth}" stroke-width="${b.arm}" stroke-linecap="round"/>`;

 // HEAD.
 const faceH=180;
 out+=`<ellipse cx="256" cy="${headY}" rx="${headW/2}" ry="${faceH/2}" fill="url(#skin)" stroke="${c.accent}" stroke-width="4"/>`;
 if(profile.anatomy.pointedEars){
   out+=`<path d="M${256-headW/2+8} 250 L${256-headW/2-40} 220 L${256-headW/2+6} 285Z" fill="${skin}" stroke="${c.accent}" stroke-width="3"/><path d="M${256+headW/2-8} 250 L${256+headW/2+40} 220 L${256+headW/2-6} 285Z" fill="${skin}" stroke="${c.accent}" stroke-width="3"/>`;
 }

 // HAIR — appearance tag drives color and style.
 const hairStyle = /cabelo longo|long|ondas|waves/.test(textOf(p.appearance))?'long':
                   /spik|espet|pont/.test(textOf(p.appearance))?'spikes':
                   /bob/.test(textOf(p.appearance))?'bob':
                   /trança|braid/.test(textOf(p.appearance))?'braids':
                   profile.species==='elf'?'long':
                   profile.clothing==='royal'?'crown':'short';
 const hairPath={
   short:`M${256-headW/2-8} 245 Q${256-headW/2-10} 150 256 130 Q${256+headW/2+10} 150 ${256+headW/2+8} 245 Q${256+headW/2-12} 205 256 185 Q${256-headW/2+12} 205 ${256-headW/2-8} 245Z`,
   long:`M${256-headW/2-8} 250 Q${256-headW/2-18} 125 256 120 Q${256+headW/2+18} 125 ${256+headW/2+8} 250 L${256+headW/2+22} 390 Q${256+headW/2-25} 365 ${256+headW/2-12} 290 Q256 245 ${256-headW/2+12} 290 Q${256-headW/2+25} 365 ${256-headW/2-22} 390Z`,
   spikes:`M${256-headW/2-10} 245 L${256-headW/2+10} 135 L${256-35} 180 L256 105 L${256+35} 180 L${256+headW/2-10} 135 L${256+headW/2+10} 245 Q256 200 ${256-headW/2-10} 245Z`,
   bob:`M${256-headW/2-8} 250 Q${256-headW/2-12} 135 256 125 Q${256+headW/2+12} 135 ${256+headW/2+8} 250 L${256+headW/2+8} 320 Q${256+headW/2-15} 340 ${256+headW/2-28} 310 L${256-headW/2+28} 310 Q${256-headW/2+15} 340 ${256-headW/2-8} 320Z`,
   braids:`M${256-headW/2-8} 250 Q${256-headW/2} 135 256 125 Q${256+headW/2} 135 ${256+headW/2+8} 250 L${256+headW/2+40} 390 L${256+headW/2+5} 405 L${256+headW/2-10} 300 Q256 245 ${256-headW/2+10} 300 L${256-headW/2-5} 405 L${256-headW/2-40} 390Z`,
   crown:`M${256-headW/2-8} 245 Q${256-headW/2-5} 135 256 120 Q${256+headW/2+5} 135 ${256+headW/2+8} 245 L${256+headW/2-20} 205 L256 175 L${256-headW/2+20} 205Z`
 }[hairStyle];
 out+=`<path d="${hairPath}" fill="url(#hair)" stroke="${c.accent}" stroke-width="4"/>`;

 // EYES and expression. Power + appearance determine eye treatment.
 const eyeColor=profile.power==='fire'?'#ffb35c':profile.power==='ice'?'#bdf7ff':profile.power==='lightning'?'#fff36b':profile.power==='water'?'#72eaff':profile.power==='dark'?'#d477ff':profile.power==='cosmic'?'#ffffff':c.eye;
 const eyeY=255, ex=32;
 const eyeRx=profile.species==='vamp'?23:20;
 out+=`<path d="M${256-ex-eyeRx} ${eyeY} Q${256-ex} ${eyeY-12} ${256-ex+eyeRx} ${eyeY} Q${256-ex} ${eyeY+10} ${256-ex-eyeRx} ${eyeY}Z" fill="#f7f9ff"/><path d="M${256+ex-eyeRx} ${eyeY} Q${256+ex} ${eyeY-12} ${256+ex+eyeRx} ${eyeY} Q${256+ex} ${eyeY+10} ${256+ex-eyeRx} ${eyeY}Z" fill="#f7f9ff"/>`;
 out+=`<circle cx="${256-ex}" cy="${eyeY}" r="8" fill="${eyeColor}" ${profile.power!=='neutral'?'filter="url(#glow)"':''}/><circle cx="${256+ex}" cy="${eyeY}" r="8" fill="${eyeColor}" ${profile.power!=='neutral'?'filter="url(#glow)"':''}/>`;
 out+=`<path d="M${256-ex-20} 230 Q${256-ex} 218 ${256-ex+20} 230" stroke="#33262b" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M${256+ex-20} 230 Q${256+ex} 218 ${256+ex+20} 230" stroke="#33262b" stroke-width="6" fill="none" stroke-linecap="round"/>`;
 out+=`<path d="M256 258 L251 300 L265 306" stroke="#784f49" stroke-width="4" fill="none" stroke-linecap="round"/>`;
 out+=`<path d="M236 320 Q256 332 276 320" stroke="#743f4c" stroke-width="5" fill="none" stroke-linecap="round"/>`;

 // MARKINGS.
 const appearance=textOf(p.appearance);
 if(/heterocrom|heterochrom/.test(appearance))out+=`<circle cx="${256-ex}" cy="${eyeY}" r="8" fill="#ffd35d"/><circle cx="${256+ex}" cy="${eyeY}" r="8" fill="#66f4ff"/>`;
 if(/marca|sigil|luminos|glow|tattoo|tatuagem/.test(appearance))out+=`<path d="M256 335 l-12 20 12 16 12-16Z" fill="${c.accent}" opacity=".7" filter="url(#glow)"/>`;

 // SPECIES-specific facial details.
 if(profile.species==='vamp')out+=`<path d="M238 324 L246 345 L252 324 M260 324 L266 345 L274 324" fill="${c.accent}" opacity=".9"/>`;
 if(profile.species==='beast')out+=`<path d="M215 318 Q230 330 245 318 M267 318 Q282 330 297 318" stroke="${c.accent}" stroke-width="4" opacity=".6"/>`;
 if(profile.species==='cyber')out+=`<path d="M205 205H307V305H205Z" fill="none" stroke="${c.accent}" stroke-width="2" opacity=".4"/><circle cx="256" cy="270" r="4" fill="${c.accent}"/>`;
 if(profile.species==='golem')out+=`<path d="M210 195L225 185 M302 195L287 185 M215 300L235 315 M297 300L277 315" stroke="#727b80" stroke-width="6"/>`;

 // WEAPON — actual weapon category from the database.
 if(profile.weapon==='sword'){
   out+=`<g transform="rotate(18 390 470)"><rect x="384" y="310" width="12" height="275" rx="4" fill="${c.accent}"/><path d="M390 290 L410 335 L370 335Z" fill="#dfe9ff"/><rect x="372" y="580" width="48" height="10" rx="4" fill="${c.accent}"/><rect x="386" y="590" width="8" height="70" fill="#684735"/></g>`;
 } else if(profile.weapon==='spear'){
   out+=`<path d="M405 175L405 650" stroke="#7d5a43" stroke-width="8"/><path d="M405 150L425 205L405 188L385 205Z" fill="${c.accent}" stroke="#fff" stroke-width="2"/>`;
 } else if(profile.weapon==='bow'){
   out+=`<path d="M395 300 Q455 455 395 610" fill="none" stroke="${c.accent}" stroke-width="8"/><path d="M395 300L395 610" stroke="#fff" stroke-width="2"/><path d="M395 455L470 455" stroke="#fff" stroke-width="3"/>`;
 } else if(profile.weapon==='hammer'){
   out+=`<path d="M410 330L410 650" stroke="#7d5a43" stroke-width="10"/><rect x="375" y="285" width="70" height="65" rx="10" fill="#8995a8" stroke="${c.accent}" stroke-width="5"/>`;
 } else if(profile.weapon==='shield'){
   out+=`<path d="M420 315 Q485 340 475 455 Q465 555 420 590 Q375 555 365 455 Q355 340 420 315Z" fill="${c.mid}" stroke="${c.accent}" stroke-width="6"/><path d="M420 360L420 545 M390 450H450" stroke="${c.accent}" stroke-width="6"/>`;
 } else if(profile.weapon==='gun'){
   out+=`<path d="M370 430H460L470 455H425L410 510H380L390 455H370Z" fill="#3d4656" stroke="${c.accent}" stroke-width="3"/>`;
 }

 // ACCESSORIES driven by title/appearance.
 if(profile.clothing==='royal'){
   out+=`<path d="M218 150L238 112L256 145L274 112L294 150Z" fill="${c.accent}" stroke="#fff" stroke-width="3"/>`;
 }
 if(profile.clothing==='divine'){
   out+=`<circle cx="256" cy="105" r="42" fill="none" stroke="${c.accent}" stroke-width="4" opacity=".55"/>`;
 }
 if(profile.clothing==='assassin'){
   out+=`<path d="M190 390 Q256 430 322 390 L305 420 Q256 450 207 420Z" fill="#0b0d14" opacity=".95"/>`;
 }

 // ENERGY / MOTIFS.
 const motif = profile.power;
 if(motif==='lightning')out+=`<g stroke="${c.accent}" stroke-width="4" fill="none" opacity=".7"><path d="M95 330L135 375L115 410L165 455"/><path d="M417 330L377 375L397 410L347 455"/></g>`;
 if(motif==='fire')out+=`<g fill="${c.accent}" opacity=".55">${Array.from({length:10},()=>`<circle cx="${(90+r()*330).toFixed(1)}" cy="${(300+r()*330).toFixed(1)}" r="${(2+r()*5).toFixed(1)}"/>`).join('')}</g>`;
 if(motif==='ice')out+=`<g stroke="${c.accent}" stroke-width="3" opacity=".7">${Array.from({length:7},(_,i)=>`<path d="M${110+i*50} 620L${125+i*50} 570L${115+i*50} 530"/>`).join('')}</g>`;
 if(motif==='water')out+=`<g fill="none" stroke="${c.accent}" opacity=".5"><path d="M80 640Q150 590 220 640T440 640"/><path d="M60 680Q140 630 220 680T460 680"/></g>`;

 // rarity particles
 const count=rarity>=8?32:rarity>=6?22:rarity>=4?12:6;
 out+=`<g fill="${c.accent}" opacity=".6">${Array.from({length:count},()=>`<circle cx="${(18+r()*476).toFixed(1)}" cy="${(20+r()*700).toFixed(1)}" r="${(.8+r()*2.5).toFixed(1)}"/>`).join('')}</g>`;

 out+=`</svg>`;
 return {svg:out,profile};
}

function parseSVG(str){
 const doc=new DOMParser().parseFromString(str,'image/svg+xml');
 const el=doc.documentElement;
 if(!el || el.nodeName.toLowerCase()==='parsererror') throw new Error('Falha ao montar SVG visual');
 return document.importNode(el,true);
}

window.VisualEngine = {
 version:'data-first-1.0.0',
 generate(forge){
   const built=build(forge);
   const el=parseSVG(built.svg);
   el.dataset.visualEngine='data-first';
   el.dataset.species=built.profile.species;
   el.dataset.power=built.profile.power;
   el.dataset.tags=built.profile.tags.join(',');
   return el;
 }
};
})();
