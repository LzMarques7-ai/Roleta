/* ROULETA DA VIDA V21 — APPLICATION
   Fluxo resiliente: roletas -> forja -> raridade -> ficha -> arte.
   A montagem nunca depende de uma etapa externa de IA.
*/
(()=>{
'use strict';
const app=document.getElementById('app'); if(!app)return;
const VERSION='21.0.0';
const STEPS=[
 ['race','RAÇA','Qual será a natureza desse personagem?','races'],
 ['title','TÍTULO','Que posição ele ocupa no mundo?','titles'],
 ['appearance','APARÊNCIA','Como o personagem realmente se parece?','appearance'],
 ['name','NOME','Quem ele é?','name'],
 ['age','IDADE','Quanto tempo existe?','age'],
 ['condition','CONDIÇÃO','Como o corpo funciona?','condition'],
 ['force','FORÇA','Qual referência define sua força?','force'],
 ['speed','VELOCIDADE','Qual referência define sua velocidade?','speed'],
 ['intelligence','INTELIGÊNCIA','Qual referência define sua mente?','intelligence'],
 ['combat','COMBATE','Quem/que arquétipo define seu nível de luta?','combat'],
 ['talent','TALENTO','Em que ele naturalmente se destaca?','talent'],
 ['hasPower','PODER','O acaso lhe concedeu uma habilidade extraordinária?','power'],
 ['control','DOMÍNIO','Quanto ele domina aquilo que recebeu?','control'],
 ['weapons','ARMA / EQUIPAMENTO','Que objeto entra nessa história?','weapons'],
 ['potential','POTENCIAL','Até onde essa pessoa pode chegar?','potential'],
 ['life','TIPO DE VIDA','Que tipo de existência o aguarda?','life']
];
let step=0,spinning=false,rotation=0,timer=null,forge={p:{}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const active=()=>STEPS.filter(([k])=>k!=='control'||forge?.p?.hasPower?.name==='Sim');
function wheel(){
 const c=document.getElementById('wheel'); if(!c)return;
 const box=c.parentElement,size=Math.max(250,Math.floor(Math.min(box.clientWidth,box.clientHeight))),d=Math.min(devicePixelRatio||1,2);
 c.width=size*d;c.height=size*d;c.style.width=size+'px';c.style.height=size+'px';
 const x=c.getContext('2d'),cx=size/2,cy=size/2,r=size/2-2,n=72;x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,size,size);
 for(let i=0;i<n;i++){const a=-Math.PI/2+i*2*Math.PI/n,b=-Math.PI/2+(i+1)*2*Math.PI/n;x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,r,a,b);x.closePath();x.fillStyle=i%3===0?'#151515':i%3===1?'#0c0c0c':'#101010';x.fill();x.strokeStyle='#202020';x.stroke()}
 x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.strokeStyle='#4a4a4a';x.lineWidth=1.5;x.stroke();
}
function render(){
 const list=active();
 if(step>=list.length){reveal();return;}
 const [key,label,q]=list[step];
 app.innerHTML=`<main class="screen"><header><span>ROULETA DA VIDA</span><span>V${VERSION.replace('.0.0','')}</span></header><div class="eyebrow">FORJA PROCEDURAL DE PERSONAGENS</div><h1>Uma vida. Milhões de combinações.</h1><div class="counter">${step+1} / ${list.length}</div><section class="wheelbox"><div class="pointer"></div><canvas id="wheel"></canvas><button id="spin" type="button">GIRAR</button></section><div class="step-label">${esc(label)}</div><h2>${esc(q)}</h2><div id="result" class="result"><div class="result-value">—</div><div class="result-label">aguardando o acaso</div></div><div id="continueArea"></div><p class="hint">Cada roleta sorteia independentemente. Referências podem repetir entre categorias; a identidade final nasce da combinação.</p></main>`;
 wheel();
}
function choose(key,db){
 if(key==='name')return {name:RV.name(),refType:'sistema de nomes',refWhy:'combinação procedural de nomes do banco local',value:30,tags:'name'};
 if(key==='hasPower')return {name:RV.yesPower()?'Sim':'Não',refType:'regra do sistema',refWhy:'chance independente de receber um poder',value:0,tags:'power'};
 return RV.draw(db);
}
function spin(){
 if(spinning)return;
 const list=active(),cur=list[step]; if(!cur)return;
 const [key]=cur,btn=document.getElementById('spin'),c=document.getElementById('wheel'),value=choose(key,cur[3]);
 if(!btn||!c||!value||!value.name){if(btn){btn.disabled=false;btn.textContent='GIRAR'}return;}
 spinning=true;btn.disabled=true;btn.textContent='…';rotation+=(5+RV.randomInt(4))*360+RV.randomInt(360);c.style.transform=`rotate(${rotation}deg)`;
 clearTimeout(timer);
 timer=setTimeout(()=>{
   try{
    forge=forge&&forge.p?forge:{p:{}}; forge.p[key]=value;
    const r=document.getElementById('result'); if(r){r.classList.add('has-result');r.innerHTML=`<div class="result-value">${esc(value.name)}</div><div class="result-label">resultado sorteado · ${esc(value.refWhy||value.refType||'banco local')}</div>`;}
    const area=document.getElementById('continueArea'); if(area)area.innerHTML=`<button class="next" data-action="next">${step===active().length-1?'FORJAR PERSONAGEM':'PRÓXIMO'}</button>`;
   }catch(err){console.error('Roleta da Vida: erro ao guardar sorteio',err);}
   spinning=false;
 },900);
}
function normalizeForReveal(p){
 const out={...(p||{})};
 const required=['race','title','appearance','age','condition','force','speed','intelligence','combat','talent','potential','weapons','life'];
 for(const k of required){if(!out[k]?.name){out[k]=RV.draw(({race:'races',title:'titles',appearance:'appearance',age:'age',condition:'condition',force:'force',speed:'speed',intelligence:'intelligence',combat:'combat',talent:'talent',potential:'potential',weapons:'weapons',life:'life'})[k]);}}
 if(!out.name?.name)out.name={name:RV.name(),refType:'sistema de nomes',refWhy:'nome procedural'};
 if(!out.hasPower?.name)out.hasPower={name:RV.yesPower()?'Sim':'Não',refType:'regra do sistema',refWhy:'chance independente'};
 if(out.hasPower.name==='Sim'){
   if(!out.power?.name)out.power=RV.draw('power');
   if(!out.control?.name)out.control=RV.draw('control');
 }else{
   out.power={name:'Nenhum poder',refType:'estado',refWhy:'o sorteio de poderes foi desativado porque a roleta caiu em Não',value:0,tags:'none'};
   out.control={name:'Sem domínio',refType:'estado',refWhy:'não há poder para dominar',value:0,tags:'none'};
 }
 return out;
}
function reveal(){
 clearTimeout(timer); spinning=false;
 try{
   const p=normalizeForReveal(forge?.p||{});
   forge=RV.compose(p);
   drawFinal();
 }catch(err){
   console.error('Roleta da Vida: falha ao montar personagem',err);
   // Último fallback: usa a forja completa independente da tela anterior.
   try{forge=RV.forge();drawFinal();}
   catch(fatal){console.error('Roleta da Vida: fallback fatal',fatal);showFatal(fatal);}
 }
}
function showFatal(err){
 app.innerHTML=`<main class="screen final"><header><span>ROULETA DA VIDA</span><span>V21</span></header><h1>Falha inesperada na forja</h1><p class="story-error">O navegador interrompeu a montagem desta vida. A próxima tentativa reconstrói a ficha do zero.</p><p class="error-code">${esc(err?.message||'erro desconhecido')}</p><button class="again" data-action="new">NOVA VIDA</button></main>`;
}
function refRows(f){
 const refs=Object.entries(f.refs||{}).filter(([k,v])=>!['name','hasPower'].includes(k)&&v);
 return refs.map(([k,v])=>`<div class="ref-row"><span>${esc(label(k))}</span><div><b>${esc(v.name)}</b><small>${esc(v.type||'referência')} · ${esc(v.why||'sem descrição')}</small></div></div>`).join('');
}
function drawFinal(){
 const f=forge,r=f?.rarity||RV.rarity(f.p),refsHtml=refRows(f),storyData=(window.STORY_ENGINE&&STORY_ENGINE.make)?STORY_ENGINE.make(f):{paragraphs:['A vida foi montada pela combinação independente das roletas.'],references:[]};
 const p=f.p;
 app.innerHTML=`<main class="screen final" style="--rarity:${esc(r.color)}"><header><span>ROULETA DA VIDA</span><span>V21</span></header><section class="collector-card collector-${r.stars}" id="collectorCard"><div class="holo"></div><div class="card-head"><span>${esc(r.name.toUpperCase())}</span><span>${r.stars}/9</span></div><div id="art" class="art"><div class="art-loading">FORJANDO<br>IDENTIDADE</div></div><div class="card-bottom"><div class="stars">${'★'.repeat(r.stars)}<span>${'★'.repeat(9-r.stars)}</span></div><div class="rarity-name">${esc(r.name)}</div><div class="card-name">${esc(p.name?.name||'Personagem')}</div><div class="subline">${esc(p.race?.name||'—')} · ${esc(p.title?.name||'—')} · ${esc(p.age?.name||'—')}</div></div></section><section class="identity"><h3>DNA DO PERSONAGEM</h3><div class="grid">${stat('RAÇA',p.race)}${stat('APARÊNCIA',p.appearance)}${stat('FORÇA',p.force)}${stat('VELOCIDADE',p.speed)}${stat('INTELIGÊNCIA',p.intelligence)}${stat('COMBATE',p.combat)}${stat('TALENTO',p.talent)}${stat('POTENCIAL',p.potential)}${stat('PODER',p.power)}${stat('DOMÍNIO',p.control)}${stat('ARMA / EQUIPAMENTO',p.weapons)}${stat('VIDA',p.life)}</div></section><section class="explain"><h3>REFERÊNCIAS DA FORJA</h3><p class="explain-intro">Cada referência abaixo explica de onde veio a ideia do resultado e o que ela influencia. Não significa que a arte copie a pessoa ou personagem.</p>${refsHtml||'<p class="explain-intro">A ficha não possui referências externas.</p>'}</section><section class="story"><h3>LEITURA DA FORJA</h3>${storyData.paragraphs.map(x=>`<p>${esc(x)}</p>`).join('')}</section><button class="again" data-action="new">NOVA VIDA</button></main>`;
 const art=document.getElementById('art');
 Promise.resolve().then(()=>{
   if(!window.VisualEngine||typeof VisualEngine.generate!=='function')throw new Error('VisualEngine indisponível');
   return VisualEngine.generate(f);
 }).then(el=>{if(!art||!el)return;art.innerHTML='';el.classList.add('ai-character-art');art.appendChild(el);}).catch(err=>{console.error('Roleta da Vida: falha visual',err);if(art)art.innerHTML='<div class="art-loading">ARTE LOCAL RECONSTRUÍDA</div>';});
}
function stat(label,obj){return `<div><span>${esc(label)}</span><b>${esc(obj?.name||'—')}</b></div>`;}
function label(k){return ({race:'Raça',title:'Título',appearance:'Aparência',age:'Idade',condition:'Condição',force:'Força',speed:'Velocidade',intelligence:'Inteligência',combat:'Combate',talent:'Talento',power:'Poder',control:'Domínio',weapons:'Arma / equipamento',life:'Tipo de vida'}[k]||k);}
function fresh(){clearTimeout(timer);step=0;spinning=false;rotation=0;forge={p:{}};document.body.className='';render();scrollTo(0,0);}
document.addEventListener('click',e=>{const a=e.target.closest('[data-action]')?.dataset.action;if(a==='next'){if(spinning)return;const list=active();if(step>=list.length-1)reveal();else{step++;render();}}if(e.target.id==='spin')spin();if(a==='new')fresh();});
addEventListener('resize',()=>{if(!spinning&&document.getElementById('wheel'))wheel();});
fresh();
})();
