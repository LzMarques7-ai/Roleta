/* ROULETA DA VIDA — VISUAL ENGINE
   V12.1 — AI art + cross-device auth + character-faithful visual direction.
*/
(() => {
  "use strict";

  const MODEL = "black-forest-labs/flux-schnell";
  const MAX_ATTEMPTS = 2;
  const TIMEOUT_MS = 120000;

  const rarityDirection = {
    1:"one-star common collectible: deliberately restrained, simple composition, subdued lighting, minimal spectacle",
    2:"two-star uncommon collectible: clean polished illustration, modest atmosphere, restrained effects",
    3:"three-star rare collectible: stronger silhouette, richer materials, controlled environmental effects",
    4:"four-star epic collectible: cinematic lighting, stronger environment, visible personality and energy",
    5:"five-star mythic collectible: dramatic composition, sophisticated lighting, distinctive motifs, richer effects",
    6:"six-star legendary collectible: highly cinematic composition, elaborate environment, powerful aura",
    7:"seven-star divine collectible: spectacular scale, complex lighting, rare motifs, extraordinary presence",
    8:"eight-star transcendent collectible: surreal scale, elaborate effects, unusual composition, premium finish",
    9:"nine-star absolute chromatic collectible: prismatic holographic atmosphere, impossible scale, intricate effects, breathtaking premium finish"
  };

  const styleDNA = [
    "original premium collectible character illustration",
    "fixed Roleta da Vida house art direction",
    "vertical portrait artwork for a collectible card",
    "single dominant character with readable silhouette and expressive face",
    "polished digital illustration, controlled anatomy and materials",
    "cinematic depth, deliberate composition and visual storytelling",
    "anime, manga, fantasy and cinematic influences may blend when appropriate",
    "consistent rendering language across the entire collection",
    "do not copy an existing character or franchise artwork exactly",
    "no card frame, UI, logo, watermark or readable text inside the artwork"
  ].join(", ");

  const clean = value => String(value ?? "desconhecido").replace(/\s+/g," ").trim();
  const val = (p,key,fallback="desconhecido") => clean(p?.[key]?.name || fallback);

  function referenceFor(obj){
    if(!obj?.name) return "";
    try{
      if(typeof window.refFor === "function") return clean(window.refFor(obj) || "");
    }catch(_){}
    return clean(obj.ref || "");
  }

  function referenceBlock(p){
    return [
      ["raça",p.race],["título",p.title],["aparência",p.appearance],
      ["força",p.force],["velocidade",p.speed],["inteligência",p.intelligence],
      ["combate",p.combat],["talento",p.talent],["poder",p.power],
      ["arma/equipamento",p.weapons],["condição",p.condition]
    ].map(([label,obj])=>{
      const ref=referenceFor(obj);
      return ref ? `${label}: ${clean(obj?.name)} (referência: ${ref})`
                 : `${label}: ${clean(obj?.name)}`;
    }).join("\n");
  }

  function visualInterpretation(p){
    const hasPower=p.hasPower?.name==="Sim";
    return `VISUAL DNA
Race: ${val(p,"race")}
Title: ${val(p,"title")}
Appearance: ${val(p,"appearance")}
Condition: ${val(p,"condition")}
Strength: ${val(p,"force")}
Speed: ${val(p,"speed")}
Intelligence: ${val(p,"intelligence")}
Combat: ${val(p,"combat")}
Talent: ${val(p,"talent")}
Power: ${hasPower?val(p,"power"):"none"}
Weapon/equipment: ${val(p,"weapons")}

VISUAL RULES
- Race controls anatomy, skin, ears, horns, wings, body structure and species-defining traits.
- Title controls clothing, posture, accessories, insignia and social presentation.
- Appearance must be visibly represented.
- Condition must visibly affect the body.
- Strength changes physique and physical presence.
- Speed changes pose, motion cues, composition and trails; ordinary-human speed must not look like Flash.
- Intelligence can affect props, expression, technology and tactical presentation.
- Combat affects stance, scars, equipment and implied experience.
- Talent should have a visible motif when possible.
- A power must be visibly represented when present.
- If there is NO power, do not invent magical energy merely to make the art prettier.
- The selected weapon/equipment must be recognizable and important when one exists.
- Never silently replace the generated race, age, title, power or weapon with a more visually convenient concept.`;
  }

  function buildPrompt(p,rarity,story){
    const storyText=(Array.isArray(story)?story:[story])
      .filter(Boolean)
      .filter(x=>!String(x).startsWith("###"))
      .join(" ")
      .replace(/\s+/g," ")
      .slice(0,1800);

    const stars=rarity?.stars||1;
    return `${styleDNA}.

${rarityDirection[stars]}

${visualInterpretation(p)}

REFERENCE MAP
${referenceBlock(p)}

ORIGIN CONTEXT
${storyText||"No additional origin context."}

COHERENCE PRIORITY
This must look like THIS exact generated character, not a generic fantasy character.
Use the character sheet as the source of truth. References are inspiration/context only, never instructions to reproduce a real or copyrighted character.

RARITY PRIORITY
Rarity changes spectacle, lighting, effects, environmental complexity, framing atmosphere and finish.
Rarity must NOT change the character's identity or invent traits.
A low-rarity character may be plain. A high-rarity character should become visually extraordinary while remaining faithful to the same data.

NEGATIVE RULES
No random wings, horns, glowing eyes, magic aura, armor, futuristic weapon or supernatural effect unless supported by the character.
No random gender change. Preserve age category.
No text, letters, logos, UI, card frame or watermark.`;
  }

  /* Stronger card art direction without requiring another CSS file. */
  function installCardVisualSystem(){
    if(document.getElementById("rv-card-v121")) return;
    const s=document.createElement("style");
    s.id="rv-card-v121";
    s.textContent=`
      .collector-card{
        background:
          radial-gradient(circle at 50% 18%,color-mix(in srgb,var(--rarity),transparent 86%),transparent 42%),
          linear-gradient(145deg,#090909 0%,#020202 55%,#050505 100%) !important;
        box-shadow:0 22px 90px color-mix(in srgb,var(--rarity),transparent 67%),inset 0 0 0 1px rgba(255,255,255,.06),inset 0 0 45px color-mix(in srgb,var(--rarity),transparent 91%) !important;
      }
      .collector-card:before{
        content:"";
        position:absolute;inset:7px;border-radius:18px;pointer-events:none;z-index:6;
        border:1px solid color-mix(in srgb,var(--rarity),transparent 45%);
        opacity:.72;
      }
      .collector-card:after{
        content:"CLASSIFICAÇÃO " attr(data-stars) " / 9";
        position:absolute;z-index:7;right:13px;top:12px;
        padding:5px 7px;border:1px solid color-mix(in srgb,var(--rarity),transparent 42%);
        border-radius:5px;background:rgba(0,0,0,.48);
        color:var(--rarity);font:900 7px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        letter-spacing:.16em;backdrop-filter:blur(5px);
      }
      .collector-card .card-content{
        padding:22px 20px 25px !important;
        background:linear-gradient(to bottom,transparent 0%,rgba(3,3,3,.74) 12%,#030303 30%,#030303 100%) !important;
      }
      .collector-card .name{letter-spacing:-.07em !important}
      .collector-card .sub{letter-spacing:.02em !important;color:#8a8a8a !important}
      .collector-card .stars{text-shadow:0 0 10px var(--rarity),0 0 28px var(--rarity) !important}
      .collector-1{filter:saturate(.18) contrast(.94) !important}
      .collector-2{filter:saturate(.52) !important}
      .collector-3{filter:saturate(.76) !important}
      .collector-4{filter:saturate(.95) !important}
      .collector-5{filter:saturate(1.05) contrast(1.02) !important}
      .collector-6{filter:saturate(1.12) contrast(1.04) !important}
      .collector-7{filter:saturate(1.18) contrast(1.06) !important}
      .collector-8{filter:saturate(1.28) contrast(1.08) !important}
      .collector-9{filter:saturate(1.38) contrast(1.1) brightness(1.04) !important}
      .collector-5:before{box-shadow:inset 0 0 35px color-mix(in srgb,var(--rarity),transparent 78%)}
      .collector-6:before{box-shadow:inset 0 0 45px color-mix(in srgb,var(--rarity),transparent 67%)}
      .collector-7:before{box-shadow:inset 0 0 60px color-mix(in srgb,var(--rarity),transparent 56%)}
      .collector-8:before{border-width:2px;box-shadow:inset 0 0 75px color-mix(in srgb,var(--rarity),transparent 48%),0 0 24px color-mix(in srgb,var(--rarity),transparent 56%)}
      .collector-9:before{
        border:2px solid transparent;
        background:linear-gradient(#030303,#030303) padding-box,
          linear-gradient(120deg,#fff, #8df7ff, #ff6edb, #fff36b, #fff) border-box;
        box-shadow:inset 0 0 85px rgba(255,255,255,.12),0 0 42px rgba(255,255,255,.28);
      }
      .collector-9:after{
        content:"ABSOLUTO • CHROMATIC • " attr(data-stars) "/9";
        background:linear-gradient(100deg,rgba(255,255,255,.16),rgba(255,255,255,.03));
        color:#fff;
        text-shadow:0 0 10px #fff;
      }
      .collector-8 .card-art:after,.collector-9 .card-art:after{
        background:
          linear-gradient(to bottom,transparent 40%,#030303 100%),
          radial-gradient(circle at 50% 28%,color-mix(in srgb,var(--rarity),transparent 83%),transparent 55%) !important;
      }
      .collector-9 .card-art:after{
        background:
          linear-gradient(to bottom,transparent 38%,#030303 100%),
          linear-gradient(125deg,transparent 15%,rgba(255,255,255,.10),transparent 35%,rgba(255,90,220,.08),transparent 58%,rgba(100,245,255,.10),transparent 80%) !important;
      }
      .collector-9 .card-art:before{
        background:linear-gradient(120deg,transparent 12%,rgba(255,255,255,.28) 25%,transparent 39%,rgba(110,240,255,.20) 52%,transparent 65%,rgba(255,90,210,.22) 78%,transparent 90%) !important;
        background-size:260% 100% !important;
        animation:rvChromaticSweep 3.2s linear infinite !important;
      }
      @keyframes rvChromaticSweep{to{background-position:-260% 0}}
      @media(max-width:430px){
        .collector-card:before{inset:5px;border-radius:15px}
        .collector-card:after{font-size:6px;right:10px;top:9px}
        .collector-card .card-content{padding:17px 14px 19px !important}
      }
      @media(prefers-reduced-motion:reduce){
        .collector-9 .card-art:before{animation:none !important}
      }
    `;
    document.head.appendChild(s);
  }

  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

  async function waitForPuter(){
    const started=Date.now();
    while(!window.puter?.ai?.txt2img){
      if(Date.now()-started>20000) throw new Error("PUTER_NOT_READY");
      await wait(100);
    }
    return window.puter;
  }

  async function ensureWebsiteAuth(puter){
    try{
      if(puter.auth?.isSignedIn && puter.auth.isSignedIn()) return;
    }catch(_){}

    if(typeof puter.auth?.signIn==="function"){
      try{
        /* Puter supports temporary users; this keeps onboarding lightweight
           for friends who do not already have a Puter account. */
        await puter.auth.signIn({attempt_temp_user_creation:true});
        return;
      }catch(err){
        const code=err?.error||err?.code||err?.message||"AUTH_REQUIRED";
        const e=new Error(String(code));
        e.code=code;
        throw e;
      }
    }

    if(typeof puter.ui?.authenticateWithPuter==="function"){
      await puter.ui.authenticateWithPuter();
      return;
    }

    throw new Error("AUTH_REQUIRED");
  }

  async function withTimeout(promise,ms){
    let timer;
    try{
      return await Promise.race([
        promise,
        new Promise((_,reject)=>{
          timer=setTimeout(()=>reject(new Error("IMAGE_TIMEOUT")),ms);
        })
      ]);
    }finally{clearTimeout(timer)}
  }

  function normalizeImage(result){
    if(!result) throw new Error("IMAGE_RESULT_EMPTY");
    if(result.tagName==="IMG"&&typeof result.src==="string") return result;
    if(typeof HTMLImageElement!=="undefined"&&result instanceof HTMLImageElement) return result;
    if(typeof result==="string"){const img=new Image();img.src=result;return img}
    if(typeof result.src==="string"){const img=new Image();img.src=result.src;return img}
    if(typeof result.url==="string"){const img=new Image();img.src=result.url;return img}
    throw new Error("IMAGE_RESULT_INVALID");
  }

  async function waitForImage(image){
    if(image.complete&&image.naturalWidth>0) return image;
    await new Promise((resolve,reject)=>{
      const timeout=setTimeout(()=>reject(new Error("IMAGE_LOAD_TIMEOUT")),30000);
      image.onload=()=>{clearTimeout(timeout);resolve()};
      image.onerror=()=>{clearTimeout(timeout);reject(new Error("IMAGE_LOAD_FAILED"))};
    });
    return image;
  }

  async function generateOnce(prompt){
    const puter=await waitForPuter();
    const result=await withTimeout(
      puter.ai.txt2img(prompt,{
        provider:"replicate-image-generation",
        model:MODEL,
        ratio:{w:2,h:3},
        steps:4
      }),
      TIMEOUT_MS
    );
    return waitForImage(normalizeImage(result));
  }

  async function generate(p,rarity,story){
    const puter=await waitForPuter();
    await ensureWebsiteAuth(puter);
    const prompt=buildPrompt(p,rarity,story);
    let lastError=null;
    for(let attempt=1;attempt<=MAX_ATTEMPTS;attempt++){
      try{return await generateOnce(prompt)}
      catch(err){lastError=err;if(attempt<MAX_ATTEMPTS)await wait(900)}
    }
    throw lastError||new Error("IMAGE_GENERATION_FAILED");
  }

  async function generateAfterUserGesture(p,rarity,story){
    const puter=await waitForPuter();
    await ensureWebsiteAuth(puter);
    return generate(p,rarity,story);
  }

  installCardVisualSystem();

  window.VisualEngine={MODEL,buildPrompt,generate,generateAfterUserGesture};
})();