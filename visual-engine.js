/* ROULETA DA VIDA — VISUAL ENGINE
   V14 — GPT Image 2 + character-faithful art direction + premium collectible cards.
*/
(() => {
  "use strict";

  const MODEL = "gpt-image-2";
  const PROVIDER = null;
  const MAX_ATTEMPTS = 1;
  const TIMEOUT_MS = 180000;
  let activeGeneration = null;

  const rarityDirection = {
    1:"1-star common collectible. Deliberately simple, restrained composition, natural lighting, minimal effects, clean readable character.",
    2:"2-star uncommon collectible. Polished but restrained illustration, modest atmosphere, subtle environmental detail.",
    3:"3-star rare collectible. Strong silhouette, richer materials, controlled cinematic lighting and a meaningful environment.",
    4:"4-star epic collectible. Cinematic scene, dynamic composition, distinctive lighting and visible personality.",
    5:"5-star mythic collectible. Premium full-art composition, dramatic perspective, sophisticated lighting, environmental storytelling and distinctive motifs.",
    6:"6-star legendary collectible. Highly cinematic full-art scene, layered lighting, particles tied to the character, strong depth and premium finish.",
    7:"7-star divine collectible. Extraordinary cinematic composition, elaborate environment, luminous effects, depth, particles and rare collectible-card presentation.",
    8:"8-star transcendent collectible. Surreal but coherent scale, intricate environment, advanced lighting, holographic atmosphere, particles and premium visual effects.",
    9:"9-star absolute chromatic collectible. Spectacular full-art key visual, prismatic/chromatic atmosphere, layered holographic light, intricate particles, impossible cinematic scale, luxurious premium finish."
  };

  const clean = v => String(v ?? "desconhecido").replace(/\s+/g," ").trim();
  const val = (p,k) => clean(p?.[k]?.name || p?.[k] || "desconhecido");

  function referenceFor(obj){
    if(!obj?.name) return "";
    try{
      if(typeof window.refFor === "function") return clean(window.refFor(obj) || "");
    }catch(_){}
    return clean(obj.ref || "");
  }

  function refs(p){
    return [
      ["race",p.race],["title",p.title],["appearance",p.appearance],
      ["strength",p.force],["speed",p.speed],["intelligence",p.intelligence],
      ["combat",p.combat],["talent",p.talent],["power",p.power],
      ["weapon",p.weapons],["condition",p.condition]
    ].map(([k,v])=>{
      const r=referenceFor(v);
      return `${k}: ${clean(v?.name || v)}${r?` — reference: ${r}`:""}`;
    }).join("\n");
  }

  function buildPrompt(p,rarity,story){
    const stars=Math.max(1,Math.min(9,Number(rarity?.stars)||1));
    const hasPower=val(p,"hasPower").toLowerCase()==="sim";
    const origin=(Array.isArray(story)?story:[story]).filter(Boolean)
      .filter(x=>!String(x).startsWith("###"))
      .join(" ").replace(/\s+/g," ").slice(0,2200);

    return `ROULETA DA VIDA — OFFICIAL COLLECTIBLE CHARACTER KEY ART

Create the final vertical character illustration for an original collectible card. This is NOT a generic fantasy portrait and NOT a random beautiful person. The character sheet below is the absolute source of truth.

RARITY DIRECTION
${rarityDirection[stars]}

CHARACTER SHEET
Name: ${val(p,"name")}
Race/species: ${val(p,"race")}
Age: ${val(p,"age")}
Title: ${val(p,"title")}
Appearance: ${val(p,"appearance")}
Condition: ${val(p,"condition")}
Strength reference: ${val(p,"force")}
Speed reference: ${val(p,"speed")}
Intelligence reference: ${val(p,"intelligence")}
Combat reference: ${val(p,"combat")}
Talent: ${val(p,"talent")}
Power: ${hasPower?val(p,"power"):"NONE — this character has no supernatural power"}
Weapon/equipment: ${val(p,"weapons")}

REFERENCE MAP
${refs(p)}

ORIGIN STORY CONTEXT
${origin||"No story context supplied."}

ART DIRECTION
1. Design the character from the complete sheet before rendering. Every major visual choice must have a reason in the sheet.
2. Race determines anatomy and species traits. Do not add wings, horns, tails, unusual eyes, glowing skin or other fantasy anatomy unless supported by the race/appearance.
3. Appearance must be visibly recognizable: face, hair, body, clothing and distinctive traits should follow it.
4. Title affects wardrobe, status symbols, posture and social presentation.
5. Strength affects physical presence and believable physique, but do not turn a human reference into a monster unless the sheet supports it.
6. Speed affects action, pose, motion, perspective and environmental motion. A speed reference such as Flash should create extreme motion; a human-level reference must remain human-scale.
7. Intelligence affects expression, props, technology, planning cues and tactical composition when appropriate.
8. Combat affects stance, scars, weapon handling and implied experience.
9. Talent should have a subtle visual motif when possible.
10. If a power exists, show its specific nature in action. Do not replace it with generic blue magic.
11. If there is NO power, do not invent magical aura, energy beams or supernatural effects just to make the image prettier.
12. The selected weapon/equipment must be recognizable and visually important when one exists.
13. References are conceptual inspiration only. Do not reproduce copyrighted characters, actors, artworks or logos exactly. Translate the useful visual concept into an original character.
14. Use varied cinematic compositions: action, environmental portrait, close-up, low angle, high angle, dramatic side composition, movement or quiet scene depending on the character. Do NOT default to a standing character against a generic background.
15. The environment should communicate who this character is and, when useful, echo the origin story.
16. Make the image beautiful because of composition, lighting, materials, storytelling and character specificity — not because of generic fantasy effects.

COLLECTION STYLE
Premium modern trading-card key art. Cohesive house style across the collection: polished digital illustration, strong anatomy, rich materials, cinematic depth, expressive faces, controlled color harmony, sophisticated lighting, deliberate composition. Anime/manga/fantasy/cinematic influences may blend when the references call for them, but the final image must remain original.

RARITY EFFECTS
The rarity changes spectacle and finish, never the character's identity.
1–2 stars: simple and clean.
3–4 stars: richer environment and cinematic lighting.
5–6 stars: premium full-art feeling, stronger depth, particles and character-specific effects.
7–8 stars: elaborate cinematic environment, luminous particles, holographic light, layered reflections and premium collectible finish.
9 stars: chromatic/prismatic lighting, holographic atmosphere, intricate particles, multiple depth layers, spectacular key-art composition and an unmistakably legendary presentation.

HARD NEGATIVES
No generic fantasy hero. No random armor. No random wings. No random horns. No random glowing eyes. No generic magic aura. No irrelevant weapon. No unexplained futuristic technology. No gender change. Preserve the generated age category. No card frame. No UI. No logo. No watermark. No readable text. No captions. No signature.`;
  }

  function installCardVisualSystem(){
    if(document.getElementById("rv-card-v14")) return;
    const s=document.createElement("style");
    s.id="rv-card-v14";
    s.textContent=`
      .collector-card{position:relative;overflow:hidden;background:radial-gradient(circle at 50% 18%,color-mix(in srgb,var(--rarity),transparent 84%),transparent 45%),linear-gradient(145deg,#090909,#020202 60%,#060606)!important;box-shadow:0 24px 100px color-mix(in srgb,var(--rarity),transparent 62%),inset 0 0 0 1px rgba(255,255,255,.08),inset 0 0 55px color-mix(in srgb,var(--rarity),transparent 90%)!important}
      .collector-card:before{content:"";position:absolute;inset:6px;border-radius:18px;pointer-events:none;z-index:8;border:1px solid color-mix(in srgb,var(--rarity),transparent 38%);opacity:.8}
      .collector-card:after{content:"CLASSIFICAÇÃO " attr(data-stars) " / 9";position:absolute;z-index:9;right:12px;top:11px;padding:5px 7px;border:1px solid color-mix(in srgb,var(--rarity),transparent 35%);border-radius:5px;background:rgba(0,0,0,.48);color:var(--rarity);font:900 7px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.15em;backdrop-filter:blur(6px)}
      .collector-card .card-content{position:relative;z-index:10;padding:22px 20px 25px!important;background:linear-gradient(to bottom,transparent 0%,rgba(3,3,3,.70) 13%,#030303 31%,#030303)!important}
      .collector-card .stars{text-shadow:0 0 10px var(--rarity),0 0 28px var(--rarity)!important}
      .collector-1{filter:saturate(.25) contrast(.95)!important}.collector-2{filter:saturate(.5)!important}.collector-3{filter:saturate(.75)!important}.collector-4{filter:saturate(.95)!important}.collector-5{filter:saturate(1.05) contrast(1.03)!important}.collector-6{filter:saturate(1.12) contrast(1.05)!important}.collector-7{filter:saturate(1.18) contrast(1.07)!important}.collector-8{filter:saturate(1.28) contrast(1.09)!important}.collector-9{filter:saturate(1.4) contrast(1.1) brightness(1.04)!important}
      .collector-5:before{box-shadow:inset 0 0 40px color-mix(in srgb,var(--rarity),transparent 74%)}
      .collector-6:before{box-shadow:inset 0 0 55px color-mix(in srgb,var(--rarity),transparent 64%)}
      .collector-7:before{box-shadow:inset 0 0 70px color-mix(in srgb,var(--rarity),transparent 54%)}
      .collector-8:before{border-width:2px;box-shadow:inset 0 0 85px color-mix(in srgb,var(--rarity),transparent 45%),0 0 28px color-mix(in srgb,var(--rarity),transparent 52%)}
      .collector-9:before{border:2px solid transparent;background:linear-gradient(#030303,#030303) padding-box,linear-gradient(120deg,#fff,#7df8ff,#ff66d8,#fff36a,#fff) border-box;box-shadow:inset 0 0 95px rgba(255,255,255,.14),0 0 48px rgba(255,255,255,.3)}
      .collector-9:after{content:"ABSOLUTO • CHROMATIC • " attr(data-stars) "/9";color:#fff;text-shadow:0 0 12px #fff;background:linear-gradient(100deg,rgba(255,255,255,.18),rgba(255,255,255,.035))}
      .collector-8 .card-art:before,.collector-9 .card-art:before{content:"";position:absolute;inset:0;pointer-events:none;z-index:5;background:repeating-linear-gradient(125deg,transparent 0 16%,color-mix(in srgb,var(--rarity),transparent 92%) 17%,transparent 19%);mix-blend-mode:screen;opacity:.75}
      .collector-9 .card-art:before{background:linear-gradient(120deg,transparent 10%,rgba(255,255,255,.28) 24%,transparent 38%,rgba(100,245,255,.22) 51%,transparent 64%,rgba(255,80,210,.22) 77%,transparent 90%);background-size:260% 100%;animation:rvChromaticSweep 3s linear infinite;mix-blend-mode:screen}
      .collector-7 .card-art:after,.collector-8 .card-art:after,.collector-9 .card-art:after{content:"";position:absolute;inset:0;pointer-events:none;z-index:6;background:radial-gradient(circle at 50% 25%,color-mix(in srgb,var(--rarity),transparent 84%),transparent 58%),linear-gradient(to bottom,transparent 35%,rgba(3,3,3,.72) 100%)}
      .collector-9 .card-art:after{background:linear-gradient(125deg,transparent 12%,rgba(255,255,255,.11),transparent 34%,rgba(255,70,210,.08),transparent 56%,rgba(80,235,255,.10),transparent 82%)}
      @keyframes rvChromaticSweep{to{background-position:-260% 0}}
      @media(max-width:430px){.collector-card:before{inset:5px;border-radius:15px}.collector-card:after{font-size:6px;right:9px;top:8px}.collector-card .card-content{padding:17px 14px 19px!important}}
      @media(prefers-reduced-motion:reduce){.collector-9 .card-art:before{animation:none}}
    `;
    document.head.appendChild(s);
  }

  const wait=ms=>new Promise(r=>setTimeout(r,ms));

  async function waitForPuter(){
    const start=Date.now();
    while(!window.puter?.ai?.txt2img){
      if(Date.now()-start>20000) throw new Error("PUTER_NOT_READY");
      await wait(100);
    }
    return window.puter;
  }

  // Puter.js manages authentication for txt2img. Do not force a login or redirect
  // from the character screen: this keeps the generation flow usable across devices.

  async function withTimeout(promise,ms){
    let timer;
    try{return await Promise.race([promise,new Promise((_,rej)=>timer=setTimeout(()=>rej(new Error("IMAGE_TIMEOUT")),ms))])}
    finally{clearTimeout(timer)}
  }

  function normalizeImage(result){
    if(!result) throw new Error("IMAGE_RESULT_EMPTY");
    // Puter txt2img resolves to an HTMLImageElement according to its API contract.
    if(typeof HTMLImageElement!=="undefined" && result instanceof HTMLImageElement) return result;
    if(result?.tagName==="IMG" && typeof result.src==="string") return result;
    if(typeof result==="string"){const img=new Image();img.src=result;return img}
    if(typeof result?.src==="string"){const img=new Image();img.src=result.src;return img}
    if(typeof result?.url==="string"){const img=new Image();img.src=result.url;return img}
    throw new Error("IMAGE_RESULT_INVALID");
  }

  async function generateOnce(prompt){
    const puter=await waitForPuter();
    const result=await withTimeout(
      puter.ai.txt2img(prompt,{model:"openai/gpt-image-2",quality:"high",ratio:{w:2,h:3}}),
      TIMEOUT_MS
    );
    return normalizeImage(result);
  }

  async function generate(p,rarity,story){
    if(activeGeneration) return activeGeneration;
    activeGeneration=(async()=>generateOnce(buildPrompt(p,rarity,story)))();
    try{return await activeGeneration}
    finally{activeGeneration=null}
  }

  // Kept for compatibility with older app integrations. No forced auth here.
  async function generateAfterUserGesture(p,rarity,story){
    return generate(p,rarity,story);
  }

  installCardVisualSystem();
  window.VisualEngine={MODEL,PROVIDER,buildPrompt,generate,generateAfterUserGesture,version:"14.0.0"};
})();