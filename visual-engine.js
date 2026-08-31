/* ROULETA DA VIDA — V11 Visual Engine
   Uses Puter.js + FLUX Schnell. No API key is stored in the site.
   The user-pays model is handled by Puter authentication.
*/
(() => {
  "use strict";

  const MODEL = "black-forest-labs/flux-schnell";

  const esc = v => String(v ?? "").replace(/[&<>\"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));

  const rarityDirection = {
    1: "common collectible card art, restrained lighting, simple background, low visual spectacle",
    2: "uncommon collectible card art, clean lighting, subtle atmospheric detail",
    3: "rare collectible card art, polished illustration, stronger silhouette and controlled effects",
    4: "epic collectible card art, cinematic lighting, richer environment and visible character energy",
    5: "legendary collectible card art, dramatic composition, sophisticated lighting, powerful atmosphere",
    6: "mythic collectible card art, intense cinematic lighting, elaborate magical or technological effects",
    7: "divine collectible card art, spectacular aura, complex energy effects, extraordinary composition",
    8: "transcendent collectible card art, surreal scale, radiant effects, highly elaborate background and lighting",
    9: "absolute chromatic legendary collectible card art, prismatic holographic atmosphere, impossible scale, breathtaking celestial lighting, premium fantasy trading-card illustration"
  };

  const styleDNA = [
    "original character illustration for a premium collectible character card",
    "consistent house art direction across an entire fictional card game",
    "portrait-focused three-quarter or full upper-body composition",
    "single clear focal character, readable silhouette, expressive face",
    "polished digital illustration, crisp line control, rich but coherent materials",
    "dramatic cinematic rim lighting, controlled depth, sophisticated color grading",
    "fantasy/anime-inspired character illustration without copying any specific franchise or existing character",
    "no card frame, no UI, no borders, no logos, no readable text inside the artwork",
    "vertical composition designed to fit the art window of a collectible card"
  ].join(", ");

  function val(p,k,fallback="desconhecido"){
    return p?.[k]?.name || fallback;
  }

  function buildPrompt(p, rarity, story){
    const refs=[];
    for(const [label,obj] of [["race",p.race],["power",p.power],["weapon",p.weapons]]){
      if(obj?.name && typeof window.refFor === "function"){
        const ref=window.refFor(obj);
        if(ref)refs.push(`${label} reference: ${ref}`);
      }
    }

    const storyText=(story||[])
      .filter(x=>!String(x).startsWith("###"))
      .join(" ")
      .replace(/\s+/g," ")
      .slice(0,1800);

    return `${styleDNA}.

CHARACTER:
Name: ${val(p,"name","Unnamed")}
Race: ${val(p,"race")}
Title: ${val(p,"title")}
Age: ${val(p,"age")}
Appearance: ${val(p,"appearance")}
Body condition: ${val(p,"condition")}
Strength: ${val(p,"force")}
Speed: ${val(p,"speed")}
Intelligence: ${val(p,"intelligence")}
Combat: ${val(p,"combat")}
Talent: ${val(p,"talent")}
Powers: ${p.hasPower?.name === "Sim" ? val(p,"power") : "none"}
Power control: ${p.hasPower?.name === "Sim" ? val(p,"control") : "not applicable"}
Weapon/equipment: ${val(p,"weapons")}
Life type: ${val(p,"life")}

RARITY ${rarity.stars}/9: ${rarity.name}. ${rarityDirection[rarity.stars]}

REFERENCE CONTEXT (use only as inspiration for the concept, create an original character): ${refs.join("; ") || "none"}

ORIGIN CONTEXT: ${storyText || "No additional origin context."}

VISUAL RULES: The character must look like a member of the same card collection as every other Roleta da Vida character. Keep the composition and rendering language consistent regardless of race or power. Let rarity change spectacle, lighting, effects and background complexity, not the fundamental art direction. Do not write the character's name in the image. Do not imitate an exact existing character, screenshot, card, or franchise artwork.`;
  }

  async function generate(p,rarity,story){
    if(!window.puter?.ai?.txt2img) throw new Error("Puter.js não carregou");

    // Puter handles user authentication for AI calls. The explicit sign-in
    // method is intentionally not called here because browsers can block
    // authentication popups unless they originate from a user gesture.
    const prompt=buildPrompt(p,rarity,story);
    const image=await window.puter.ai.txt2img(prompt,{
      model:MODEL,
      width:768,
      height:1080,
      steps:4
    });
    if(!(image instanceof HTMLImageElement)) throw new Error("A IA não devolveu uma imagem válida");
    return image;
  }

  window.VisualEngine={generate,buildPrompt,MODEL};
})();
