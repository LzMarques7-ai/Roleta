/* ROULETA DA VIDA — V11.1 Visual Engine
   Puter.js + FLUX Schnell.
   Robust browser integration: authentication, provider selection,
   supported image options, retry and safe DOM image normalization.
*/
(() => {
  "use strict";

  const MODEL = "black-forest-labs/flux-schnell";
  const PROVIDER = "replicate-image-generation";
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

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function waitForPuter() {
    const started = Date.now();
    while (!window.puter?.ai?.txt2img) {
      if (Date.now() - started > 15000) throw new Error("Puter.js não carregou a tempo");
      await wait(100);
    }
    return window.puter;
  }

  async function ensureAuth(allowPopup = false) {
    const puter = await waitForPuter();
    if (puter.auth?.isSignedIn?.()) return puter;

    // Preferred path on GitHub Pages: Puter's UI authentication dialog.
    // It is safer for mobile browsers than trying to create a raw popup.
    if (allowPopup && puter.ui?.authenticateWithPuter) {
      await puter.ui.authenticateWithPuter();
      if (puter.auth?.isSignedIn?.()) return puter;
    }

    throw new Error("AUTH_REQUIRED");
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
    if (result instanceof HTMLImageElement) return result;

    if (typeof result === "string") {
      const img = new Image();
      img.src = result;
      return img;
    }

    if (result && typeof result.src === "string") {
      const img = new Image();
      img.src = result.src;
      return img;
    }

    if (result && typeof result.url === "string") {
      const img = new Image();
      img.src = result.url;
      return img;
    }

    throw new Error("IMAGE_RESULT_INVALID");
  }

  async function generateOnce(prompt) {
    const puter = await waitForPuter();

    // These are the image options documented for Replicate-backed models.
    // width/height are intentionally NOT used here; ratio is the supported
    // cross-provider option for this provider/model.
    const result = await withTimeout(
      puter.ai.txt2img(prompt, {
        provider: PROVIDER,
        model: MODEL,
        ratio: { w: 2, h: 3 },
        steps: 4,
        output_megapixels: "0.5",
        response_format: "webp"
      }),
      TIMEOUT_MS
    );

    const image = normalizeImage(result);
    await new Promise((resolve, reject) => {
      if (image.complete && image.naturalWidth > 0) return resolve();
      image.onload = resolve;
      image.onerror = () => reject(new Error("IMAGE_LOAD_FAILED"));
    });
    return image;
  }

  async function generate(p, rarity, story, options = {}) {
    const prompt = buildPrompt(p, rarity, story);
    let lastError = null;

    // If the visitor is already signed in, this is completely automatic.
    // If not, the first automatic attempt reports AUTH_REQUIRED rather than
    // opening a popup that mobile Safari may block.
    if (!options.skipAuth) await ensureAuth(Boolean(options.userGesture));

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        return await generateOnce(prompt);
      } catch (err) {
        lastError = err;
        if (attempt < MAX_ATTEMPTS) await wait(900);
      }
    }

    throw lastError || new Error("IMAGE_GENERATION_FAILED");
  }

  async function generateAfterUserGesture(p, rarity, story) {
    // This path is used by the retry/activation button. Because it is called
    // from a real click, authentication UI is allowed by mobile browsers.
    await ensureAuth(true);
    return generate(p, rarity, story, { skipAuth: true, userGesture: true });
  }

  window.VisualEngine = {
    MODEL,
    PROVIDER,
    buildPrompt,
    generate,
    generateAfterUserGesture
  };
})();
