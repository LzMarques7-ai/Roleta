/* V8 FINAL — UI robusta para celulares.
   Canvas responsivo + delegação de eventos + estado único.
*/
(()=>{
  const $=s=>document.querySelector(s), esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const steps=[
    ["race","Qual sua raça?","race"],["origin","Qual sua origem?","origin"],["appearance","Como você é?","appearance"],
    ["name","Qual é o seu nome?","name"],["age","Qual sua idade?","age"],["condition","Como é seu corpo?","condition"],
    ["force","Qual é sua força?","force"],["speed","Qual é sua velocidade?","speed"],["intelligence","Qual é sua inteligência?","intelligence"],
    ["combat","Como você luta?","combat"],["talent","Qual é seu talento?","talent"],["hasPower","Possui poderes?","hasPower"],
    ["power","Qual é o seu poder?","power"],["control","Quanto domina isso?","control"],["weapon","Arma ou equipamento?","weapons"],
    ["potential","Qual é seu potencial?","potential"],["life","Como será sua vida?","life"]
  ];
  const state={step:0,picks:{},rotation:0,spinning:false,token:0};
  const opts=(key)=>{
    if(key==="race")return (LIBRARY.races||[]).map(RV.norm);
    if(key==="origin")return RV.fallback.origin.map(x=>({name:x[0],value:x[1]}));
    if(key==="appearance")return RV.fallback.appearance.map(x=>({name:x[0],value:x[1]}));
    if(key==="name")return [{name:RV.name()}];
    if(key==="age")return (LIBRARY.ages||RV.fallback.ages||[]).map(RV.norm);
    if(key==="condition")return RV.fallback.condition.map(x=>({name:x[0],value:x[1]}));
    if(key==="force")return RV.fallback.force.map(x=>({name:x[0],value:x[1]}));
    if(key==="speed")return RV.fallback.speed.map(x=>({name:x[0],value:x[1]}));
    if(key==="intelligence")return RV.fallback.intelligence.map(x=>({name:x[0],value:x[1]}));
    if(key==="combat")return RV.fallback.combat.map(x=>({name:x[0],value:x[1]}));
    if(key==="talent")return RV.fallback.talent.map(x=>({name:x[0],value:x[1]}));
    if(key==="hasPower")return [{name:"Sim"},{name:"Não"}];
    if(key==="power")return RV.fallback.powers.map(x=>({name:x[0],value:x[1],ref:x[0].split(" — ").slice(1).join(" — ")}));
    if(key==="control")return RV.fallback.control.map(x=>({name:x[0],value:x[1]}));
    if(key==="weapons")return RV.fallback.weapons.map(x=>({name:x[0],value:x[1]}));
    if(key==="potential")return RV.fallback.potential.map(x=>({name:x[0],value:x[1]}));
    if(key==="life")return RV.fallback.life.map(x=>({name:x[0],value:x[1]}));
    return [];
  };
  function active(){return steps.filter(s=>s[0]!=="power"||state.picks.hasPower?.name==="Sim")}
  function drawCanvas(c){
    const rect=c.getBoundingClientRect(), dpr=Math.min(devicePixelRatio||1,2), size=Math.max(220,Math.floor(Math.min(rect.width,rect.height)));
    c.width=size*dpr;c.height=size*dpr;const x=c.getContext("2d");x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,size,size);
    const n=Math.min(72,Math.max(36,Math.floor(size/6))), cx=size/2, cy=size/2, r=size/2-2;
    for(let i=0;i<n;i++){const a=-Math.PI/2+i*2*Math.PI/n,b=-Math.PI/2+(i+1)*2*Math.PI/n;x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,r,a,b);x.closePath();x.fillStyle=i%2?"#090909":"#101010";x.fill();x.strokeStyle="#1c1c1c";x.lineWidth=1;x.stroke()}
    x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.strokeStyle="#333";x.lineWidth=1.2;x.stroke();
  }
  function render(){
    const a=active();if(state.step>=a.length)state.step=a.length-1;const s=a[state.step];
    $("#app").innerHTML=`<main class="screen"><header><span>ROULETA DA VIDA</span><span>V8</span></header>
    <div class="title">Roleta da Vida</div><div class="counter">${state.step+1} / ${a.length}</div>
    <section class="wheelbox"><div class="pointer"></div><canvas id="wheel"></canvas><button id="spin" data-action="spin">GIRAR</button></section>
    <h2>${esc(s[1])}</h2><div id="result" class="result">—</div></main>`;
    drawCanvas($("#wheel"));
  }
  function spin(){
    if(state.spinning)return;const s=active()[state.step];if(!s)return;
    let value;
    if(s[0]==="hasPower")value={name:RV.yesPower()?"Sim":"Não"};
    else if(s[0]==="name")value={name:RV.name()};
    else value=RV.draw(s[2]);
    if(s[0]==="power")value=RV.power();
    const token=++state.token;state.spinning=true;const wheel=$("#wheel"),btn=$("#spin");
    const slots=48,slot=RV.randomInt(slots),target=(slot+.5)*360/slots,current=((state.rotation%360)+360)%360;
    let delta=(360-target-current+360)%360;delta+=360*(5+RV.randomInt(4));state.rotation+=delta;
    btn.disabled=true;btn.textContent="…";wheel.style.transform=`rotate(${state.rotation}deg)`;
    setTimeout(()=>{if(token!==state.token)return;state.spinning=false;state.picks[s[0]]=RV.norm(value);
      const r=$("#result");r.innerHTML=`<strong>${esc(RV.norm(value).name)}</strong><small>resultado</small>`;
      const b=document.createElement("button");b.className="next";b.dataset.action="next";b.textContent=state.step===active().length-1?"REVELAR PERSONAGEM":"PRÓXIMO";r.after(b);
    },4200);
  }
  function next(){if(state.spinning)return;if(state.step>=active().length-1)finish();else{state.step++;render()}}
  function finish(){
    const p={...state.picks};p.hasPower=p.hasPower?.name==="Sim";if(!p.hasPower)delete p.power;
    if(!p.name?.name)p.name={name:RV.name()}; if(p.race){p.race.rank=RV.fallback?({"Humano":1,"Dragão":8,"Ghoul":3,"Saiyajin":7,"Kryptoniano":9,"Deus":10,"Celestial":11}[p.race.name]||3):3}
    const personality={trait:pick(["reservado","curioso","determinado","orgulhoso","melancólico","impulsivo","calculista","compassivo","ambicioso","desconfiado"]),ideal:pick(["liberdade","conhecimento","proteção","poder","justiça","verdade","independência"]),flaw:pick(["orgulho","impaciência","medo de falhar","desconfiança","teimosia","isolamento"]),goal:pick(["entender sua própria natureza","proteger alguém importante","superar seus próprios limites","encontrar respostas sobre seu passado","viver sem depender de ninguém"]),fear:pick(["perder o controle","ficar sozinho","descobrir uma verdade pior do que imaginava","não alcançar seu potencial"])};
    const prof=RV.profile(p),rar=prof.rarity, story=STORY_ENGINE.make(p,personality);
    const rows=Object.entries(prof.labels).map(([k,v])=>`<div class="stat"><span>${k}</span><b>${esc(v?.name||"—")}</b></div>`).join("");
    const refs=Object.values(p).filter(x=>x?.ref).map(x=>`<p>${esc(x.ref)}</p>`).join("");
    document.body.className=`rarity-${rar.stars}`;
    $("#app").innerHTML=`<main class="screen final" style="--rarity:${rar.color}"><header><span>ROULETA DA VIDA</span><span>V8</span></header>
      <section class="reveal"><div class="stars">${"★".repeat(rar.stars)}</div><div class="rarity-name">${rar.name}</div><div class="name">${esc(p.name.name)}</div><div class="sub">${esc(p.race?.name||"")} · ${esc(p.title?.name||"")}</div></section>
      <section class="stats">${rows}</section><section class="story"><h3>COMO CHEGOU ATÉ AQUI</h3>${story.map(x=>`<p>${esc(x)}</p>`).join("")}</section>
      ${refs?`<section class="refs"><h3>REFERÊNCIAS</h3>${refs}</section>`:""}
      <button class="again" data-action="new">NOVO PERSONAGEM</button></main>`;
  }
  function pick(a){return a[RV.randomInt(a.length)]}
  function fresh(){state.step=0;state.picks={};state.rotation=0;state.spinning=false;state.token++;document.body.className="";render();scrollTo(0,0)}
  document.addEventListener("click",e=>{const a=e.target.closest("[data-action]")?.dataset.action;if(a==="spin")spin();if(a==="next")next();if(a==="new")fresh()});
  addEventListener("resize",()=>{const c=$("#wheel");if(c&&!state.spinning)drawCanvas(c)});
  render();
})();
