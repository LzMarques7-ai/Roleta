/* ROULETA DA VIDA — V11.2 Visual Engine
   Browser-safe Puter.js + FLUX Schnell integration.
   Automatic generation uses Puter's documented txt2img flow directly;
   explicit sign-in is only requested from the user-initiated retry button.
*/
(() => {
  "use strict";

  const MODEL = "black-forest-labs/flux-schnell";
  const MAX_ATTEMPTS = 2;
  const TIMEOUT_MS = 120000;

  const rarityDirection = {
    1: "common collectible character art, restrained lighting, simple atmospheric background, modest detail",
    2: "uncommon collectible character art, clean lighting, subtle atmosphere, slightly richer materials",
    3: "rare collectible character art, polished illustration, stronger silhouette, controlled visual effects",
    4: "epic collectible character art, cinematic lighting, richer environment, visible character energy",
    5: "legendary collectible character art, dramatic composition, sophisticated lighting, powerful atmosphere",
    6: "mythic collectible character art, intense cinematic lighting, elaborate magical or technological effects",
    7: "divine collectible character art, spectacular aura, complex energy effects, extraordinary composition",
    8: "transcendent collectible character art, surreal scale, radiant effects, highly elaborate background and lighting",
    9: "absolute chromatic legendary collectible character art, prismatic holographic atmosphere, impossible scale, breathtaking celestial lighting, premium trading-card illustration"
  };

  const styleDNA = [
    "original character illustration for a premium collectible character card",
    "consistent house art direction across the entire Roleta da Vida card collection",
    "portrait-focused three-quarter or full upper-body composition",
    "single clear focal character, readable silhouette, expressive face",
    "polished digital illustration, crisp controlled rendering, coherent materials",
    "cinematic rim lighting, controlled depth, sophisticated color grading",
    "fantasy and anime-inspired character illustration without copying any specific franchise character",
    "vertical composition, character centered, designed for a portrait card art window",
    "no card frame, no UI, no logos, no watermark, no readable text inside the artwork"
  ].join(", ");

  const clean = value => String(value ?? "desconhecido").replace(/\s+/g, " ").trim();
  const val = (p, key, fallback = "desconhecido") => clean(p?.[key]?.name || fallback);

  function buildPrompt(p, rarity, story) {
    const refs = [];
    for (const [label, obj] of [["race", p.race], ["power", p.power], ["weapon", p.weapons]]) {
      if (obj?.name && typeof window.refFor === "function") {
        try {
          const ref = window.refFor(obj);
          if (ref) refs.push(`${label}: ${clean(ref)}`);
        } catch (_) {}
      }
    }

    const storyText = (Array.isArray(story) ? story : [story])
      .filter(Boolean)
      .filter(x => !String(x).startsWith("###"))
      .join(" ")
      .replace(/\s+/g, " ")
      .slice(0, 1600);

    const hasPower = clean(p.hasPower?.name).toLowerCase() === "sim";

    return `${styleDNA}.

CHARACTER
Name: ${val(p, "name", "Unnamed")}
Race: ${val(p, "race")}
Title: ${val(p, "title")}
Age: ${val(p, "age")}
Appearance: ${val(p, "appearance")}
Condition: ${val(p, "condition")}
Strength: ${val(p, "force")}
Speed: ${val(p, "speed")}
Intelligence: ${val(p, "intelligence")}
Combat: ${val(p, "combat")}
Talent: ${val(p, "talent")}
Power: ${hasPower ? val(p, "power") : "none"}
Power control: ${hasPower ? val(p, "control") : "not applicable"}
Weapon/equipment: ${val(p, "weapons")}
Life type: ${val(p, "life")}

RARITY ${rarity?.stars || 1}/9: ${clean(rarity?.name || "Comum")}. ${rarityDirection[rarity?.stars || 1]}

REFERENCE CONTEXT: ${refs.join("; ") || "none"}

ORIGIN CONTEXT: ${storyText || "No additional origin context."}

VISUAL RULES: Keep this character visually consistent with the Roleta da Vida collection. Rarity changes spectacle, lighting, effects and background complexity, but not the fundamental art direction. Preserve the character's race, age and defining appearance. Create an original interpretation; do not reproduce an exact existing character, screenshot, trading card, logo or franchise artwork. Do not place text, names, symbols or UI on the artwork.`;
  }

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function waitForPuter() {
    const started = Date.now();
    while (!window.puter?.ai?.txt2img) {
      if (Date.now() - started > 20000) throw new Error("PUTER_NOT_READY");
      await wait(100);
    }
    return window.puter;
  }

  async function withTimeout(promise, ms) {
    let timer;
    try {
      return await Promise.race([
        promise,
        new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error("IMAGE_TIMEOUT")), ms);
        })
      ]);
    } finally {
      clearTimeout(timer);
    }
  }

  function normalizeImage(result) {
    if (!result) throw new Error("IMAGE_RESULT_EMPTY");

    // Puter normally returns an HTMLImageElement. Avoid instanceof because
    // cross-realm DOM objects can fail that check on some mobile browsers.
    if (result.tagName === "IMG" && typeof result.src === "string") return result;
    if (typeof HTMLImageElement !== "undefined" && result instanceof HTMLImageElement) return result;

    if (typeof result === "string") {
      const img = new Image();
      img.src = result;
      return img;
    }

    if (typeof result.src === "string") {
      const img = new Image();
      img.src = result.src;
      return img;
    }

    if (typeof result.url === "string") {
      const img = new Image();
      img.src = result.url;
      return img;
    }

    throw new Error("IMAGE_RESULT_INVALID");
  }

  async function waitForImage(image) {
    if (image.complete && image.naturalWidth > 0) return image;
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("IMAGE_LOAD_TIMEOUT")), 30000);
      image.onload = () => { clearTimeout(timeout); resolve(); };
      image.onerror = () => { clearTimeout(timeout); reject(new Error("IMAGE_LOAD_FAILED")); };
    });
    return image;
  }

  async function generateOnce(prompt) {
    const puter = await waitForPuter();

    // Keep the first request deliberately simple. These are the documented
    // Puter/FLUX Schnell parameters and avoid provider-specific mismatches.
    const result = await withTimeout(
      puter.ai.txt2img(prompt, {
        model: MODEL,
        ratio: { w: 2, h: 3 },
        steps: 4
      }),
      TIMEOUT_MS
    );

    return waitForImage(normalizeImage(result));
  }

  async function generate(p, rarity, story) {
    const prompt = buildPrompt(p, rarity, story);
    let lastError = null;

    // Important: do NOT preflight authentication here. Puter documents that
    // website AI calls handle authentication automatically. Preflighting with
    // a custom auth gate was the source of false AUTH_REQUIRED states.
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        return await generateOnce(prompt);
      } catch (err) {
        lastError = err;
        if (attempt < MAX_ATTEMPTS) await wait(1000);
      }
    }

    throw lastError || new Error("IMAGE_GENERATION_FAILED");
  }

  async function generateAfterUserGesture(p, rarity, story) {
    const puter = await waitForPuter();

    // A retry is a real user click, so an explicit sign-in popup is allowed.
    if (puter.auth?.isSignedIn && !puter.auth.isSignedIn()) {
      if (typeof puter.auth.signIn === "function") {
        await puter.auth.signIn();
      } else if (puter.ui?.authenticateWithPuter) {
        await puter.ui.authenticateWithPuter();
      }
    }

    return generate(p, rarity, story);
  }

  window.VisualEngine = {
    MODEL,
    buildPrompt,
    generate,
    generateAfterUserGesture
  };
})();
