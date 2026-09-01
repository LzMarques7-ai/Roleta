/* ROULETA DA VIDA V20 — LOCAL CHARACTER FORGE
   Montagem visual local, determinística e rica. A imagem é composta em SVG
   usando um banco de formas reutilizáveis + DNA da roleta. Nenhum crédito,
   login ou serviço externo é necessário.
*/
(()=>{
'use strict';
const DB=window.VISUAL_DATABASE||{};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hash=s=>{let h=2166136261;for(let i=0;i<String(s).length;i++){h^=String(s).charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const rng=seed=>{let x=(seed||1)>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/4294967296}};
const pick=(a,r)=>a[Math.floor(r()*a.length)];
const tags=x=>String(x?.tags||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
const clean=x=>String(x??'').replace(/\s+/g,' ').trim();
const val=(p,k)=>clean(p?.[k]?.name||'');
const has=(set,...a)=>a.some(x=>set.has(x));
const rarityColor=n=>({1:'#a1a7b0',2:'#62df91',3:'#58a9ff',4:'#9b6cff',5:'#ff62cf',6:'#ffad43',7:'#ffe85b',8:'#62e9ff',9:'#ffffff'}[n]||'#a1a7b0');
function brief(f){return {p:f.p||f,stars:Number(f.rarity?.stars)||1,name:f.p?.name?.name||'Personagem'};}
function palette(t,n){
 if(has(t,'fire','phoenix'))return ['#fff0cf','#ff6348','#321321','#ffb52f','#ffd69b'];
 if(has(t,'ice'))return ['#effdff','#68e4ff','#172b4d','#b7f5ff','#86aaff'];
 if(has(t,'lightning','speedster'))return ['#fffde0','#ffe05a','#29275b','#91eaff','#d7d0ff'];
 if(has(t,'water','mermaid','triton'))return ['#e8fcff','#54d8ff','#12375f','#a5efff','#628dff'];
 if(has(t,'dark','demon','vamp','hollow'))return ['#f9eaf1','#f05f9a','#211324','#9d4ce0','#ff9cbb'];
 if(has(t,'light','angel'))return ['#fffef2','#ffe969','#35345f','#ffffff','#a9ecff'];
 if(has(t,'tech','cyber','android'))return ['#eef6ff','#61baff','#151d2e','#b8e3ff','#617dff'];
 if(has(t,'cosmic','celestial','god','timelord'))return ['#f0efff','#ae8cff','#14122d','#f0dcff','#5fe4ff'];
 if(has(t,'magic','mage','alchemy'))return ['#f5efff','#ad7cff','#251945','#ff72d4','#8ceeff'];
 if(has(t,'nature','elf','fae'))return ['#f0ffdf','#6bd78e','#173a2b','#c7ff9a','#72d7bf'];
 return ['#f5e9dd','#8d78ff','#1c2b3f','#e6c4a1','#70c9ff'];
}
function chooseForm(t,r){
 const face=pick(Object.keys(DB.faceShapes||{oval:{}}),r),eye=pick(Object.keys(DB.eyeShapes||{almond:{}}),r),brow=pick(Object.keys(DB.brows||{straight:{}}),r),nose=pick(Object.keys(DB.noses||{straight:''}),r),mouth=pick(Object.keys(DB.mouths||{calm:''}),r);
 const hair=has(t,'bald')?'bald':has(t,'silver')?'long_flow':has(t,'red')?'messy':has(t,'royal','god')?'crown':pick(Object.keys(DB.hair||{messy:''}),r);
 const body=has(t,'giant','titan','kaiju','muscle','strongman')?'imposing':has(t,'armor','cyber')?'mechanical':has(t,'elf','fae','angel')?'graceful':has(t,'rogue','assassin')?'athletic':pick(Object.keys(DB.bodies||{athletic:{}}),r);
 const clothing=has(t,'royal','god','angel')?'divine':has(t,'armor','knight')?'knight':has(t,'mage','magic')?'mage':has(t,'rogue','assassin')?'rogue':has(t,'tech','cyber')?'tech':has(t,'scholar','science','intelligence')?'scholar':has(t,'warrior','soldier','combat')?'warrior':'civilian';
 const pose=has(t,'speedster')?'speed':has(t,'martial','assassin','combat')?'combat':has(t,'royal','god')?'regal':has(t,'psychic','magic')?'mystic':has(t,'villain','demon')?'intimidating':pick(Object.keys(DB.poses||{heroic:''}),r);
 const scene=has(t,'tech','cyber')?'laboratory':has(t,'cosmic','celestial','god')?'cosmic':has(t,'royal')?'royal':has(t,'water')?'mythic':has(t,'forest','nature','elf')?'forest':has(t,'battle','warrior')?'battle':pick(Object.keys(DB.scenes||{minimal:''}),r);
 return {face,eye,brow,nose,mouth,hair,body,clothing,pose,scene};
}
function svgDefs(c,n){return `<defs>
 <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#02030a"/><stop offset=".48" stop-color="${c[2]}"/><stop offset="1" stop-color="#010104"/></linearGradient>
 <radialGradient id="halo"><stop stop-color="${c[0]}" stop-opacity=".52"/><stop offset=".55" stop-color="${c[1]}" stop-opacity=".16"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
 <linearGradient id="cloth" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0c1320"/><stop offset=".45" stop-color="${c[2]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>
 <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f9fdff"/><stop offset=".2" stop-color="${c[0]}"/><stop offset=".55" stop-color="#1c2536"/><stop offset=".82" stop-color="${c[1]}"/><stop offset="1" stop-color="#fff"/></linearGradient>
 <linearGradient id="gem"><stop stop-color="#fff"/><stop offset=".3" stop-color="${c[0]}"/><stop offset=".65" stop-color="${c[4]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>
 <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f6d2ba"/><stop offset=".5" stop-color="#c98a6b"/><stop offset="1" stop-color="#8d594d"/></linearGradient>
 <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="soft"><feGaussianBlur stdDeviation="${8+n*1.3}"/></filter>
 <pattern id="grain" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="2" r=".5" fill="#fff" opacity=".12"/><circle cx="5" cy="6" r=".4" fill="#fff" opacity=".08"/></pattern>
 <linearGradient id="prism"><stop stop-color="#fff"/><stop offset=".2" stop-color="#64f7ff"/><stop offset=".45" stop-color="#ff63dc"/><stop offset=".7" stop-color="#fff16c"/><stop offset="1" stop-color="#fff"/></linearGradient>
 </defs>`}
function scene(t,c,r,n,kind){let s=`<rect width="512" height="760" fill="#020307"/><rect width="512" height="760" fill="url(#bg)"/>`;
 const scenes={
  cosmic:`<g opacity=".28" fill="none" stroke="${c[4]}"><circle cx="256" cy="300" r="125" stroke-width="2"/><circle cx="256" cy="300" r="205" stroke-width="4"/><path d="M0 500Q120 410 220 485T512 440V760H0Z" fill="${c[2]}" stroke="none"/></g>`,
  forest:`<path d="M0 560L55 370L110 540L170 330L220 545L285 360L340 535L410 300L470 530L512 390V760H0Z" fill="#071a17"/><path d="M0 640Q130 550 250 635T512 590V760H0Z" fill="#04090b"/>`,
  royal:`<path d="M55 700V260L125 195L195 260V700M317 700V260L387 195L457 260V700" fill="#090d18" stroke="${c[1]}" stroke-width="3" opacity=".5"/><path d="M0 560Q120 500 256 555T512 520V760H0Z" fill="#05070d"/>`,
  laboratory:`<g fill="none" stroke="${c[4]}" opacity=".26"><path d="M30 165H150L185 200H327L362 165H482M30 590H120L160 550H352L392 590H482" stroke-width="3"/><circle cx="90" cy="165" r="5" fill="${c[4]}"/><circle cx="422" cy="590" r="5" fill="${c[4]}"/></g>`,
  battle:`<path d="M0 585L95 450L155 540L245 410L315 535L405 390L512 505V760H0Z" fill="#11131b"/><path d="M0 640L120 555L215 630L330 525L512 610V760H0Z" fill="#05070b"/>`,
  mythic:`<path d="M0 545Q80 450 160 520T300 500T512 455V760H0Z" fill="#0a1725"/><path d="M30 610Q256 510 482 610" fill="none" stroke="${c[4]}" stroke-width="5" opacity=".35"/>`,
  minimal:`<ellipse cx="256" cy="430" rx="205" ry="285" fill="url(#halo)"/>`
 };
 s+=scenes[kind]||scenes.minimal;
 for(let i=0;i<(n>=8?90:n>=6?55:32);i++){const x=12+r()*488,y=30+r()*630,sz=.6+r()*(n>=7?4.2:2.6);s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz.toFixed(1)}" fill="${pick(c,r)}" opacity="${(.12+r()*.72).toFixed(2)}"/>`}
 return s;
}
function anatomy(t,c,r,n){let s='';const skin=has(t,'blue')?'#72b9d7':has(t,'stone','golem')?'#7e817e':'url(#skin)';
 const dragon=has(t,'dragon','draconian'),demon=has(t,'demon','oni'),angel=has(t,'angel','fae','wing'),beast=has(t,'beast','wolf','kitsune','fox'),cyber=has(t,'cyber','android','robot');
 if(angel)s+=`<g fill="url(#metal)" stroke="${c[0]}" stroke-width="5" opacity=".88"><path d="M176 355Q55 305 64 150Q150 188 210 322Z"/><path d="M336 355Q457 305 448 150Q362 188 302 322Z"/></g>`;
 if(dragon||demon)s+=`<path d="M207 172Q135 112 138 45Q194 68 226 140Z" fill="url(#metal)" stroke="${c[2]}" stroke-width="7"/><path d="M305 172Q377 112 374 45Q318 68 286 140Z" fill="url(#metal)" stroke="${c[2]}" stroke-width="7"/>`;
 if(beast)s+=`<path d="M190 225L135 132L220 180Z" fill="${skin}" stroke="${c[2]}" stroke-width="6"/><path d="M322 225L377 132L292 180Z" fill="${skin}" stroke="${c[2]}" stroke-width="6"/>`;
 if(dragon)s+=`<path d="M155 500Q105 470 78 405M357 500Q407 470 434 405" fill="none" stroke="${c[1]}" stroke-width="34" stroke-linecap="round" opacity=".8"/>`;
 if(demon)s+=`<path d="M176 505Q90 525 115 610M336 505Q422 525 397 610" fill="none" stroke="${c[1]}" stroke-width="24" stroke-linecap="round" opacity=".7"/>`;
 if(cyber)s+=`<g fill="none" stroke="${c[4]}" stroke-width="4" opacity=".8"><circle cx="185" cy="470" r="20"/><circle cx="327" cy="470" r="20"/><path d="M205 470H307M256 390V560"/></g>`;
 if(has(t,'tail'))s+=`<path d="M340 570Q470 520 425 405Q398 350 365 405" fill="none" stroke="${c[1]}" stroke-width="25" stroke-linecap="round" opacity=".75"/>`;
 return s;
}
function face(t,c,r,b,f){const fs=DB.faceShapes?.[f.face]||{width:1}, es=DB.eyeShapes?.[f.eye]||{scale:1}, br=DB.brows?.[f.brow]||{weight:5};const w=86*fs.width, eyeScale=es.scale;let s='';
 s+=`<path d="M256 125Q${256-w} 150 ${256-w-3} 238Q${256-w+2} 302 216 330Q256 ${fs.chin==='point'?370:350} 296 330Q${256+w-2} 302 ${256+w+3} 238Q${256+w} 150 256 125Z" fill="${has(t,'blue')?'#72b9d7':has(t,'metal','stone')?'#8a8e91':'url(#skin)'}" stroke="${c[2]}" stroke-width="7"/>`;
 const by=DB.brows?.[f.brow]?.angle||0; s+=`<path d="M190 214Q220 ${204+by} 246 214M266 214Q292 ${204+by} 322 214" fill="none" stroke="#30252b" stroke-width="${br.weight}" stroke-linecap="round"/>`;
 const ey=221, er=12*eyeScale;
 if(['sharp','cat'].includes(DB.eyeShapes?.[f.eye]?.shape))s+=`<path d="M190 242Q220 213 250 242Q220 260 190 242ZM262 242Q292 213 322 242Q292 260 262 242Z" fill="#11131a"/>`;
 else if(f.eye==='tired')s+=`<path d="M191 242Q220 226 248 242M264 242Q292 226 321 242" fill="none" stroke="#11131a" stroke-width="13" stroke-linecap="round"/>`;
 else s+=`<ellipse cx="221" cy="${ey}" rx="${er}" ry="${er*.9}" fill="#11131a"/><ellipse cx="291" cy="${ey}" rx="${er}" ry="${er*.9}" fill="#11131a"/>`;
 const iris=has(t,'cosmic','psychic','lightning','magic')?c[0]:c[4];s+=`<circle cx="221" cy="242" r="${Math.max(5,6*eyeScale)}" fill="${iris}" filter="url(#glow)"/><circle cx="291" cy="242" r="${Math.max(5,6*eyeScale)}" fill="${iris}" filter="url(#glow)"/>`;
 s+=`<path d="M256 252Q${f.nose==='sharp'?245:251} 286 256 294Q${f.nose==='strong'?269:261} 286 270" fill="none" stroke="#744b47" stroke-width="4" stroke-linecap="round"/>`;
 const my=f.mouth==='smirk'?320:f.mouth==='stern'?303:f.mouth==='confident'?316:312;s+=`<path d="M230 309Q256 ${my} 282 309" fill="none" stroke="#713d46" stroke-width="5" stroke-linecap="round"/>`;
 if(has(t,'scar'))s+=`<path d="M205 185L228 270M212 181L235 263" stroke="#8b4652" stroke-width="5" opacity=".82"/>`;
 if(has(t,'mask','hollow'))s+=`<path d="M184 220Q256 174 328 220L316 292Q256 321 196 292Z" fill="#eef5ff" opacity=".82"/><path d="M205 240Q221 221 242 239M270 239Q291 221 307 240" stroke="#12131a" stroke-width="7"/>`;
 return s;
}
function hair(t,c,r,f){if(f.hair==='bald')return '';const col=has(t,'silver','white')?'#edf6ff':has(t,'red')?'#b84e55':has(t,'blue')?'#4d78d5':has(t,'pink')?'#d96eae':has(t,'black','dark')?'#151923':pick(['#282c36','#65412f','#8d623e','#c49b6a','#6f4d8d','#3b596e'],r);const paths={short_spikes:'M158 215Q145 78 256 48Q367 78 354 215L320 160L285 115L256 150L222 108L185 170Z',long_flow:'M150 230Q118 80 256 45Q394 80 362 230L322 190Q335 310 282 345L300 175Q256 128 210 175L230 345Q175 310 190 190Z',wolf_cut:'M148 210Q145 80 210 62L180 185L222 145L256 65L290 145L332 185L302 62Q367 80 364 210L315 165L286 190L256 135L226 190L197 165Z',slick:'M155 190Q170 72 256 60Q342 72 357 190Q315 155 278 138L256 128L234 138Q197 155 155 190Z',curly:'M152 225Q126 150 166 85Q205 35 256 65Q307 35 346 85Q386 150 360 225L325 180Q305 112 256 128Q207 112 187 180Z',braided:'M155 215Q150 82 256 55Q362 82 357 215L330 165L300 125L256 145L212 125L182 165Z',bob:'M155 215Q150 75 256 58Q362 75 357 215L322 185L305 275L207 275L190 185Z',ponytail:'M160 220Q145 82 256 55Q350 72 350 210L390 130Q415 175 365 245L318 170L282 140L256 150L225 112L190 175Z',messy:'M150 215Q145 72 256 52Q367 72 362 215L325 155L300 115L275 165L240 105L205 170L180 150Z',mohawk:'M170 220L190 85L220 145L256 42L292 145L322 85L342 220L300 170L256 150L212 170Z',crown:'M155 210L178 78L225 128L256 55L287 128L334 78L357 210L315 165L280 135L256 155L232 135L197 165Z'};return `<path d="${paths[f.hair]||paths.messy}" fill="${col}" stroke="${c[2]}" stroke-width="7"/>`}
function body(t,c,r,f){const b=DB.bodies?.[f.body]||DB.bodies?.athletic||{shoulders:158,torso:132,arms:43,hips:102};const clothing=DB.clothing?.[f.clothing]||DB.clothing?.civilian;let s='';const y=365,sw=b.shoulders/2,hip=b.hips/2;
 s+=`<path d="M${256-sw} ${y+22}Q256 ${y-18} ${256+sw} ${y+22}L${256+hip} 735Q256 752 ${256-hip} 735Z" fill="url(#cloth)" stroke="${c[2]}" stroke-width="7"/>`;
 s+=`<path d="M${256-sw+8} ${y+28}Q${256-sw-35} 455 ${256-sw-50} 625M${256+sw-8} ${y+28}Q${256+sw+35} 455 ${256+sw+50} 625" fill="none" stroke="${has(t,'armor','tech','cyber')?'#8e9caf':c[1]}" stroke-width="${b.arms}" stroke-linecap="round" opacity=".9"/>`;
 if(f.clothing==='knight'||f.clothing==='tech')s+=`<path d="M${190} 395H322M${180} 445H332" stroke="${c[0]}" stroke-width="5" opacity=".55"/><circle cx="256" cy="505" r="22" fill="none" stroke="${c[4]}" stroke-width="5"/>`;
 if(f.clothing==='royal'||f.clothing==='divine')s+=`<path d="M190 395L256 500L322 395" fill="none" stroke="${c[0]}" stroke-width="8" opacity=".75"/><path d="M205 420L256 450L307 420" fill="none" stroke="${c[1]}" stroke-width="4"/>`;
 if(f.clothing==='rogue')s+=`<path d="M175 405L256 485L337 405" fill="none" stroke="#05070b" stroke-width="25" opacity=".75"/>`;
 if(f.clothing==='scholar')s+=`<path d="M198 420Q256 452 314 420" fill="none" stroke="#d8c9a9" stroke-width="5" opacity=".75"/>`;
 return s;
}
function equipment(t,c,r){if(has(t,'none'))return '';if(has(t,'shield'))return `<g><path d="M420 150Q500 175 476 355Q452 438 420 462Q388 438 364 355Q340 175 420 150Z" fill="url(#metal)" stroke="${c[0]}" stroke-width="8"/><path d="M420 205L441 260L500 265L453 300L466 358L420 326L374 358L387 300L340 265L399 260Z" fill="${c[1]}" opacity=".85"/></g>`;if(has(t,'hammer','mjolnir'))return `<g transform="rotate(7 420 350)"><path d="M420 190V570" stroke="#795640" stroke-width="18"/><rect x="348" y="105" width="145" height="108" rx="18" fill="url(#metal)" stroke="${c[0]}" stroke-width="8" filter="url(#glow)"/></g>`;if(has(t,'sword','katana','scythe','keyblade'))return `<g transform="rotate(12 420 350)"><path d="M420 565V205" stroke="#795f49" stroke-width="13"/><path d="M420 205L452 85L472 45L438 218Z" fill="url(#metal)" stroke="${c[0]}" stroke-width="6" filter="url(#glow)"/><circle cx="420" cy="215" r="22" fill="#181c25" stroke="${c[1]}" stroke-width="6"/></g>`;if(has(t,'bow'))return `<g transform="rotate(-7 420 350)"><path d="M425 105Q345 350 425 595" fill="none" stroke="${c[0]}" stroke-width="11"/><path d="M425 105Q375 350 425 595" fill="none" stroke="#eee" stroke-width="2"/><path d="M330 350H465L430 334L430 366Z" fill="${c[1]}"/></g>`;if(has(t,'spear','trident'))return `<g transform="rotate(-5 420 350)"><path d="M420 85V565" stroke="#a77d5a" stroke-width="9"/><path d="M390 170L420 65L450 170L420 145Z" fill="url(#metal)" stroke="${c[0]}" stroke-width="6" filter="url(#glow)"/></g>`;if(has(t,'gun','rifle'))return `<g transform="rotate(-9 420 350)"><rect x="340" y="265" width="160" height="48" rx="10" fill="#202735" stroke="${c[0]}" stroke-width="5"/><path d="M390 313L407 405L443 405L430 313Z" fill="#10151f"/></g>`;return `<g transform="rotate(-10 420 350)"><path d="M420 120L438 445" stroke="${c[0]}" stroke-width="12"/><circle cx="420" cy="105" r="28" fill="${c[1]}" filter="url(#glow)"/></g>`}
function effects(t,c,r,n){let s='';for(let i=0;i<(n<=2?14:n<=4?28:n<=6?45:72);i++){const x=10+r()*492,y=20+r()*680,sz=.7+r()*(n>=7?5:3);const shape=i%5===0?'diamond':i%5===1?'ring':'dot';if(shape==='ring')s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz*2}" fill="none" stroke="${pick(c,r)}" stroke-width="1.5" opacity="${(.15+r()*.65).toFixed(2)}"/>`;else if(shape==='diamond')s+=`<path d="M${x} ${y-sz*2}L${x+sz*2} ${y}L${x} ${y+sz*2}L${x-sz*2} ${y}Z" fill="${pick(c,r)}" opacity="${(.18+r()*.7).toFixed(2)}"/>`;else s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${sz.toFixed(1)}" fill="${pick(c,r)}" opacity="${(.18+r()*.7).toFixed(2)}"/>`}
 if(n>=6)s+=`<g fill="none" stroke="${c[1]}" opacity=".25"><ellipse cx="256" cy="350" rx="205" ry="292"/><ellipse cx="256" cy="350" rx="165" ry="240"/></g>`;
 if(n>=7)s+=`<path d="M-40 690L552 90" stroke="#fff" stroke-width="22" opacity=".055"/><path d="M-20 720L550 120" stroke="${c[1]}" stroke-width="7" opacity=".14"/>`;
 if(n>=8)s+=`<rect width="512" height="760" fill="url(#prism)" opacity=".08"/><path d="M20 150L492 610M-20 350L532 650M60 700L470 120" stroke="#fff" stroke-width="2" opacity=".16"/>`;
 if(has(t,'fire'))s+=`<path d="M15 710Q55 560 105 655Q145 500 190 680Q235 535 275 685Q330 510 370 670Q430 540 500 710Z" fill="${c[1]}" opacity=".25" filter="url(#glow)"/>`;
 if(has(t,'ice'))s+=`<g stroke="${c[0]}" opacity=".4" stroke-width="4"><path d="M40 690L105 520L80 420L145 330"/><path d="M472 690L407 520L432 420L367 330"/></g>`;
 if(has(t,'lightning','speedster'))s+=`<path d="M30 240L170 200L110 300L260 245L195 355" fill="none" stroke="${c[0]}" stroke-width="5" opacity=".35"/>`;
 return s;
}
function buildSVG(f){const b=brief(f),p=b.p,t=new Set(Object.values(p).flatMap(tags)),n=b.stars,c=palette(t,n),r=rng(hash(f.visualSeed||JSON.stringify(p))),form=chooseForm(t,r);let s=`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1520" viewBox="0 0 512 760" role="img" aria-label="Arte de ${esc(b.name)}">${svgDefs(c,n)}`;
 s+=scene(t,c,r,n,form.scene);s+=`<circle cx="256" cy="320" r="250" fill="url(#halo)" opacity=".8"/>`;s+=effects(t,c,r,n);
 const lean=has(t,'speedster')?-10:has(t,'martial','assassin')?7:has(t,'royal')?-2:pick([-4,0,4],r);s+=`<g transform="rotate(${lean} 256 470)">`;
 s+=body(t,c,r,form);s+=anatomy(t,c,r,n);s+=`<path d="M232 305V390Q256 410 280 390V305" fill="url(#skin)" stroke="${c[2]}" stroke-width="5"/>`;s+=face(t,c,r,b,form);s+=hair(t,c,r,form);s+=equipment(t,c,r);s+=`</g>`;
 if(n>=7)s+=`<g opacity=".7"><circle cx="256" cy="350" r="235" fill="none" stroke="${c[0]}" stroke-width="2"/><circle cx="256" cy="350" r="225" fill="none" stroke="${c[4]}" stroke-width="1" stroke-dasharray="3 12"/></g>`;
 s+=`<rect width="512" height="760" fill="url(#grain)" opacity=".45"/>`;
 if(n>=8)s+=`<rect width="512" height="760" fill="url(#prism)" opacity=".035"/>`;
 return s+'</svg>';
}
function buildPrompt(f){return `LOCAL V20 CHARACTER FORGE. Assemble a unique original character from the exact roulette DNA. Use the local visual form database to vary face shape, eyes, brows, nose, mouth, hair, body proportions, clothing construction, pose, anatomy, environment, equipment and effects. Never replace the character with a generic human. Reference provenance explains the source inspiration; it is not an instruction to copy existing artwork.`}
async function generate(f){
 const svg=buildSVG(f);const holder=document.createElement('div');holder.className='local-art-holder';holder.innerHTML=svg;const el=holder.firstElementChild;el.classList.add('local-character-svg');el.setAttribute('preserveAspectRatio','xMidYMid meet');return el;
}
window.VisualEngine={VERSION:'20.0.0',version:'20.0.0',MODEL:'local-character-forge-v20',PROVIDER:'local',buildSVG,buildPrompt,generate,generateAfterUserGesture:generate};
})();
