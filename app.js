/* ROLETADA VIDA V8 — fluxo corrigido */
(() => {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c =>
    ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]
  );

  const steps = [
    ["race","Qual sua raça?"],
    ["title","Qual seu título?"],
    ["appearance","Como você é?"],
    ["name","Qual é o seu nome?"],
    ["age","Qual sua idade?"],
    ["condition","Como é seu corpo?"],
    ["force","Qual é sua força?"],
    ["speed","Qual é sua velocidade?"],
    ["intelligence","Qual é sua inteligência?"],
    ["combat","Como você luta?"],
    ["talent","Qual é seu talento?"],
    ["hasPower","Possui poderes?"],
    ["power","Qual é o seu poder?"],
    ["control","Quanto domina seu poder?"],
    ["weapons","Arma ou equipamento?"],
    ["potential","Qual é seu potencial?"],
    ["life","Como será sua vida?"]
  ];

  const state = {
    index: 0,
    picks: Object.create(null),
    rotation: 0,
    spinning: false,
    timer: null
  };

  function activeSteps() {
    return steps.filter(s => s[0] !== "power" || state.picks.hasPower?.name === "Sim");
  }

  function getOptions(key) {
    if (key === "race") return Array.isArray(LIBRARY?.races) ? LIBRARY.races : [];
    if (key === "title") return Array.isArray(LIBRARY?.titles) ? LIBRARY.titles : RV.fallback.titles;
    if (key === "age") return Array.isArray(LIBRARY?.ages) ? LIBRARY.ages : [];
    if (key === "speed") return Array.isArray(LIBRARY?.speed) ? LIBRARY.speed : RV.fallback.speed;
    if (key === "intelligence") return Array.isArray(LIBRARY?.intelligence) ? LIBRARY.intelligence : RV.fallback.intelligence;
    if (key === "combat") return Array.isArray(LIBRARY?.combat) ? LIBRARY.combat : RV.fallback.combat;
    if (key === "weapons") return Array.isArray(LIBRARY?.weapons) ? LIBRARY.weapons : RV.fallback.weapons;

    const map = {
      appearance: "appearance",
      condition: "condition",
      force: "force",
      talent: "talent",
      control: "control",
      potential: "potential",
      life: "life"
    };
    if (map[key]) return RV.fallback[map[key]] || [];
    if (key === "hasPower") return [{name:"Sim"}, {name:"Não"}];
    if (key === "power") return RV.fallback.powers || [];
    return [];
  }

  function pickFor(key) {
    if (key === "race") return RV.race();
    if (key === "name") return { name: RV.name() };
    if (key === "hasPower") return { name: RV.yesPower() ? "Sim" : "Não" };
    if (key === "power") return RV.power();

    const list = getOptions(key);
    if (!list.length) return {name:"Indefinido"};
    return RV.norm(list[RV.randomInt(list.length)]);
  }

  function ensureCanvas() {
    const c = $("#wheel");
    if (!c) return;
    const box = c.parentElement;
    const rect = box.getBoundingClientRect();
    const cssSize = Math.max(220, Math.floor(Math.min(rect.width, rect.height)));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = cssSize * dpr;
    c.height = cssSize * dpr;
    c.style.width = cssSize + "px";
    c.style.height = cssSize + "px";

    const ctx = c.getContext("2d");
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,cssSize,cssSize);

    const cx = cssSize/2, cy = cssSize/2, r = cssSize/2 - 2;
    const segments = 60;

    for (let i=0; i<segments; i++) {
      const a = -Math.PI/2 + i*2*Math.PI/segments;
      const b = -Math.PI/2 + (i+1)*2*Math.PI/segments;
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      ctx.arc(cx,cy,r,a,b);
      ctx.closePath();
      ctx.fillStyle = i % 2 ? "#080808" : "#101010";
      ctx.fill();
      ctx.strokeStyle = "#1d1d1d";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function render() {
    const list = activeSteps();
    if (state.index >= list.length) {
      reveal();
      return;
    }

    const [key, question] = list[state.index];

    $("#app").innerHTML = `
      <main class="screen">
        <header><span>ROULETA DA VIDA</span><span>V8</span></header>
        <div class="title">Roleta da Vida</div>
        <div class="counter">${state.index + 1} / ${list.length}</div>

        <section class="wheelbox">
          <div class="pointer" aria-hidden="true"></div>
          <canvas id="wheel"></canvas>
          <button id="spin" type="button">GIRAR</button>
        </section>

        <h2>${esc(question)}</h2>

        <div id="result" class="result" aria-live="polite">
          <div class="result-value">—</div>
          <div class="result-label">aguardando giro</div>
        </div>

        <div id="continueArea" class="continue-area"></div>
      </main>
    `;

    ensureCanvas();
  }

  function showResult(value, last) {
    const result = $("#result");
    const area = $("#continueArea");
    if (!result || !area) return;

    const n = RV.norm(value);
    result.classList.add("has-result");
    result.innerHTML = `
      <div class="result-value">${esc(n.name)}</div>
      <div class="result-label">resultado sorteado</div>
    `;

    area.innerHTML = `
      <button id="nextButton" class="next" type="button">
        ${last ? "REVELAR PERSONAGEM" : "PRÓXIMO"}
      </button>
    `;

    const next = $("#nextButton");
    if (next) {
      next.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (last) reveal();
        else {
          state.index++;
          render();
        }
      }, {once:true});
    }
  }

  function spin() {
    if (state.spinning) return;

    const list = activeSteps();
    const step = list[state.index];
    if (!step) return;

    const [key] = step;
    const wheel = $("#wheel");
    const button = $("#spin");
    if (!wheel || !button) return;

    const value = pickFor(key);
    const last = state.index === list.length - 1;

    state.spinning = true;
    button.disabled = true;
    button.textContent = "…";

    const extra = 5 + RV.randomInt(4);
    const randomAngle = RV.randomInt(360);
    state.rotation += extra * 360 + randomAngle;

    wheel.style.transform = `rotate(${state.rotation}deg)`;

    clearTimeout(state.timer);
    state.timer = setTimeout(() => {
      state.spinning = false;
      state.picks[key] = RV.norm(value);

      /* Resultado aparece SOMENTE depois que a roleta para. */
      showResult(value, last);
    }, 4200);
  }

  function personality() {
    const p = a => a[RV.randomInt(a.length)];
    return {
      trait:p(["reservado","curioso","determinado","orgulhoso","melancólico","impulsivo","calculista","compassivo","ambicioso","desconfiado"]),
      ideal:p(["liberdade","conhecimento","proteção","poder","justiça","verdade","independência"]),
      flaw:p(["orgulho","impaciência","medo de falhar","desconfiança","teimosia","isolamento"]),
      goal:p(["entender sua própria natureza","proteger alguém importante","superar seus próprios limites","encontrar respostas sobre seu passado","viver sem depender de ninguém"]),
      fear:p(["perder o controle","ficar sozinho","descobrir uma verdade pior do que imaginava","não alcançar seu potencial"])
    };
  }

  function reveal() {
    if (state.spinning) return;

    const p = {...state.picks};
    p.hasPower = p.hasPower?.name === "Sim";

    if (!p.hasPower) delete p.power;
    if (!p.name?.name) p.name = {name:RV.name()};

    const prof = RV.profile(p);
    const rar = prof.rarity;
    const story = STORY_ENGINE.make(p, personality());

    document.body.className = `rarity-${rar.stars}`;

    const stats = Object.entries(prof.labels).map(([key,val]) => `
      <div class="stat">
        <span>${esc(key)}</span>
        <b>${esc(val?.name || "—")}</b>
      </div>
    `).join("");

    const refs = Object.values(p)
      .filter(v => v?.ref)
      .map(v => `<p>${esc(v.ref)}</p>`)
      .join("");

    $("#app").innerHTML = `
      <main class="screen final" style="--rarity:${esc(rar.color)}">
        <header><span>ROULETA DA VIDA</span><span>V8</span></header>

        <section class="reveal">
          <div class="stars">${"★".repeat(rar.stars)}</div>
          <div class="rarity-name">${esc(rar.name)}</div>
          <div class="name">${esc(p.name.name)}</div>
          <div class="sub">${esc(p.race?.name || "")}${p.title?.name ? " · " + esc(p.title.name) : ""}</div>
        </section>

        <section class="stats">${stats}</section>

        <section class="story">
          <h3>COMO CHEGOU ATÉ AQUI</h3>
          ${story.map(s => `<p>${esc(s)}</p>`).join("")}
        </section>

        ${refs ? `<section class="refs"><h3>REFERÊNCIAS</h3>${refs}</section>` : ""}

        <button id="newCharacter" class="again" type="button">NOVO PERSONAGEM</button>
      </main>
    `;

    $("#newCharacter")?.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      clearTimeout(state.timer);
      state.index = 0;
      state.picks = Object.create(null);
      state.rotation = 0;
      state.spinning = false;
      document.body.className = "";
      window.scrollTo(0,0);
      render();
    });
  }

  $("#app").addEventListener("click", (e) => {
    const spinButton = e.target.closest("#spin");
    if (spinButton) {
      e.preventDefault();
      spin();
    }
  });

  window.addEventListener("resize", () => {
    if (!state.spinning) ensureCanvas();
  });

  render();
})();