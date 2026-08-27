
const R = arr => arr[Math.floor(Math.random()*arr.length)];
const clamp=(n,a=1,b=100)=>Math.max(a,Math.min(b,Math.round(n)));
const baseStats={forca:50,velocidade:50,resistencia:50,inteligencia:50,sabedoria:50,carisma:50,disciplina:50,criatividade:50,sorte:50,combate:50,potencial:50,saude:50};
const data={
species:[
 {n:"Humano",m:{},tag:"Versátil"},
 {n:"Elfo",m:{inteligencia:10,velocidade:8,criatividade:8,resistencia:-4},tag:"Arcano"},
 {n:"Orc",m:{forca:22,resistencia:18,velocidade:-8,inteligencia:-7},tag:"Brutal"},
 {n:"Anão",m:{forca:14,resistencia:20,velocidade:-12,disciplina:10},tag:"Inabalável"},
 {n:"Vampiro",m:{velocidade:16,carisma:10,saude:10,sorte:-4,potencial:20},tag:"Sobrenatural"},
 {n:"Demônio",m:{forca:18,carisma:8,resistencia:12,sabedoria:-6,potencial:25},tag:"Abissal"},
 {n:"Draconiano",m:{forca:20,resistencia:20,inteligencia:6,potencial:22},tag:"Dracônico"},
 {n:"Fada",m:{velocidade:18,criatividade:20,forca:-18,resistencia:-10,potencial:15},tag:"Feérico"}
],
origins:[
 {n:"Família pobre",m:{disciplina:6,resistencia:5,sorte:-8},social:-15},
 {n:"Classe média",m:{inteligencia:4,disciplina:4,saude:3},social:0},
 {n:"Família rica",m:{carisma:8,inteligencia:8,sorte:7,disciplina:-2},social:18},
 {n:"Nobreza",m:{carisma:15,sabedoria:8,disciplina:7,combate:4,sorte:8},social:30},
 {n:"Orfanato",m:{resistencia:10,sabedoria:5,disciplina:5,sorte:-10},social:-10},
 {n:"Clã guerreiro",m:{forca:10,combate:18,disciplina:10,carisma:-3},social:8},
 {n:"Academia de elite",m:{inteligencia:16,sabedoria:12,disciplina:10,combate:2},social:12}
],
personalities:[
 {n:"Arrogante",m:{carisma:7,disciplina:-8,sabedoria:-5,combate:5},tags:["Ego alto","Confrontador"]},
 {n:"Disciplinado",m:{disciplina:20,combate:8,saude:5,sorte:-2},tags:["Focado","Constante"]},
 {n:"Genial",m:{inteligencia:22,criatividade:15,disciplina:-4},tags:["Gênio","Curioso"]},
 {n:"Empático",m:{carisma:10,sabedoria:12,criatividade:6,combate:-4},tags:["Empático","Diplomático"]},
 {n:"Impulsivo",m:{velocidade:8,combate:10,disciplina:-15,sabedoria:-8},tags:["Impulsivo","Corajoso"]},
 {n:"Reservado",m:{sabedoria:10,criatividade:10,carisma:-8,disciplina:6},tags:["Observador","Introspectivo"]},
 {n:"Ambicioso",m:{carisma:8,disciplina:10,potencial:8,sabedoria:-3},tags:["Ambicioso","Competitivo"]},
 {n:"Preguiçoso",m:{criatividade:7,sorte:5,disciplina:-22,saude:-4},tags:["Preguiçoso","Improvisador"]}
],
talents:[
 {n:"Força excepcional",m:{forca:25,resistencia:10,combate:8}},
 {n:"Mente analítica",m:{inteligencia:20,sabedoria:12,criatividade:8}},
 {n:"Reflexos absurdos",m:{velocidade:24,combate:12}},
 {n:"Líder nato",m:{carisma:22,sabedoria:8,disciplina:8}},
 {n:"Artista prodígio",m:{criatividade:25,carisma:8}},
 {n:"Sobrevivente",m:{resistencia:18,sabedoria:12,sorte:5,saude:8}},
 {n:"Nenhum talento evidente",m:{sorte:3}}
],
powers:[
 {n:"Nenhum poder",m:{potencial:-8},power:0},
 {n:"Pirocinese",m:{potencial:15,inteligencia:5,combate:10},power:72},
 {n:"Telepatia",m:{potencial:22,inteligencia:12,sabedoria:8},power:84},
 {n:"Regeneração",m:{potencial:18,saude:25,resistencia:8},power:80},
 {n:"Manipulação temporal",m:{potencial:38,inteligencia:12,sabedoria:8,disciplina:-5},power:98},
 {n:"Manipulação da gravidade",m:{potencial:30,forca:8,inteligencia:10},power:93},
 {n:"Controle de sombras",m:{potencial:24,velocidade:8,criatividade:10,carisma:4},power:87},
 {n:"Transmutação",m:{potencial:28,inteligencia:16,criatividade:12},power:92}
],
destiny:[
 {n:"Vida comum",m:{sorte:4},risk:15},
 {n:"Herói improvável",m:{coragem:0,carisma:5,potencial:10,sorte:8},risk:55},
 {n:"Vilão em ascensão",m:{potencial:18,carisma:8,sabedoria:-5,sorte:2},risk:78},
 {n:"Lenda mundial",m:{potencial:25,carisma:12,sorte:12},risk:92},
 {n:"Tragédia anunciada",m:{sorte:-22,saude:-8,potencial:8},risk:95}
],
names:["Kael","Auren","Nox","Eryon","Lys","Darian","Riven","Aster","Mika","Zeph","Orion","Varek","Elian","Nyra","Soren"],
titles:["o Inesperado","o Último Herdeiro","o Sem-Nome","o Quebrador de Destinos","o Escolhido","o Sobrevivente","o Prodígio","o Condenado"]
};
let current=null;

function mod(obj, stats){for(const [k,v] of Object.entries(obj||{})){if(k in stats)stats[k]+=v}}
function generate(){
 const rolls={species:R(data.species),origin:R(data.origins),personality:R(data.personalities),talent:R(data.talents),power:R(data.powers),destiny:R(data.destiny)};
 const s={...baseStats}; Object.values(rolls).forEach(x=>mod(x.m,s));
 // hidden interaction rules: results influence each other
 if(rolls.species.n==="Vampiro" && rolls.origin.n==="Nobreza"){s.carisma+=8;s.sorte+=5}
 if(rolls.personality.n==="Genial" && rolls.talent.n==="Mente analítica"){s.inteligencia+=10;s.potencial+=6}
 if(rolls.personality.n==="Disciplinado" && rolls.power.power>=90){s.potencial+=8;s.disciplina+=7}
 if(rolls.personality.n==="Preguiçoso" && rolls.power.n!=="Nenhum poder"){s.disciplina-=8;s.potencial-=5}
 if(rolls.destiny.n==="Tragédia anunciada"){s.resistencia+=8;s.sabedoria+=5}
 if(rolls.destiny.n==="Lenda mundial"){s.carisma+=8;s.potencial+=8}
 for(const k in s)s[k]=clamp(s[k]);
 const avg=Object.values(s).reduce((a,b)=>a+b,0)/Object.keys(s).length;
 const rarity=clamp(avg/1.15 + (rolls.power.power||0)*.12 + (rolls.species.n==="Humano"?0:7),1,100);
 const rank=rarity>=90?"★★★★★ LENDÁRIO":rarity>=78?"★★★★☆ ÉPICO":rarity>=62?"★★★☆☆ RARO":rarity>=45?"★★☆☆☆ INCOMUM":"★☆☆☆☆ COMUM";
 const name=R(names)+" "+R(titles);
 current={rolls,s,avg,rarity,rank,name};
 render();
 document.getElementById("result").style.display="block";
 document.getElementById("result").classList.remove("flash"); void document.getElementById("result").offsetWidth; document.getElementById("result").classList.add("flash");
}
function render(){
 const r=current.rolls,s=current.s;
 const live=[["Espécie",r.species.n],["Origem",r.origin.n],["Personalidade",r.personality.n],["Talento",r.talent.n],["Poder",r.power.n],["Destino",r.destiny.n]];
 document.getElementById("liveRolls").innerHTML=live.map(x=>`<div class="roll"><small>${x[0]}</small><strong>${x[1]}</strong></div>`).join("");
 document.getElementById("charName").textContent=current.name;
 document.getElementById("charTitle").textContent=`${r.species.tag||"Indivíduo"} • ${r.power.n}`;
 document.getElementById("rarity").textContent=`${current.rank}  •  Índice geral ${Math.round(current.avg)}/100`;
 document.getElementById("tags").innerHTML=[r.species.tag,r.personality.n,r.talent.n,r.destiny.n].map(t=>`<span class="tag">${t}</span>`).join("");
 const labels={forca:"Força",velocidade:"Velocidade",resistencia:"Resistência",inteligencia:"Inteligência",sabedoria:"Sabedoria",carisma:"Carisma",disciplina:"Disciplina",criatividade:"Criatividade",sorte:"Sorte",combate:"Combate",potencial:"Potencial",saude:"Saúde"};
 document.getElementById("stats").innerHTML=Object.entries(s).map(([k,v])=>`<div class="stat"><div class="stat-head"><span>${labels[k]}</span><b>${v}</b></div><div class="bar"><div class="fill" style="width:${v}%"></div></div></div>`).join("");
 document.getElementById("identity").innerHTML=`<b>Espécie:</b> ${r.species.n}<br><b>Origem:</b> ${r.origin.n}<br><b>Talento:</b> ${r.talent.n}<br><b>Status social:</b> ${r.origin.social>20?"Muito alto":r.origin.social>5?"Acima da média":r.origin.social<0?"Baixo":"Médio"}`;
 document.getElementById("psy").innerHTML=`<b>Personalidade:</b> ${r.personality.n}.<br>${r.personality.tags?.join(" • ")||""}<br><br>As características foram incorporadas aos atributos; por isso a mesma personalidade produz resultados diferentes dependendo de espécie, origem e talento.`;
 document.getElementById("power").innerHTML=`<b>${r.power.n}</b><br>Potência estimada: ${r.power.power||"—"}/100.<br><br>O poder modifica diretamente potencial e outros atributos. Poderes raros também elevam a raridade final.`;
 const tension = r.destiny.n==="Tragédia anunciada" ? "Apesar do potencial, o destino impõe uma trajetória de perdas e pressão." : r.destiny.n==="Lenda mundial" ? "As circunstâncias favorecem uma trajetória extraordinária e de grande impacto." : "Seu destino ainda é relativamente aberto, permitindo que escolhas futuras tenham grande peso.";
 document.getElementById("story").innerHTML=`${current.name} nasceu como ${r.species.n.toLowerCase()}, em uma ${r.origin.n.toLowerCase()}. Seu ${r.talent.n.toLowerCase()} moldou a forma como aprendeu a sobreviver e crescer. Sua personalidade ${r.personality.n.toLowerCase()} cria vantagens e limitações próprias. ${r.power.n==="Nenhum poder"?"Não possui poderes sobrenaturais conhecidos.":`Despertou ${r.power.n.toLowerCase()}, uma capacidade de potencial ${r.power.power}/100.`} ${tension}`;
}
function saveCurrent(){
 if(!current){generate();return}
 const arr=JSON.parse(localStorage.getItem("forge_history")||"[]"); arr.unshift(current); localStorage.setItem("forge_history",JSON.stringify(arr.slice(0,20))); loadHistory();
}
function loadHistory(){
 const arr=JSON.parse(localStorage.getItem("forge_history")||"[]"); const h=document.getElementById("history");
 h.innerHTML=arr.length?arr.map((x,i)=>`<div class="history-item" onclick="loadSaved(${i})"><b>${x.name}</b> <span>${x.rank} • ${x.rolls.species.n} • ${x.rolls.power.n}</span></div>`).join(""):"<div style='color:var(--muted);font-size:13px'>Nenhum personagem salvo ainda.</div>";
}
function loadSaved(i){const a=JSON.parse(localStorage.getItem("forge_history")||"[]");current=a[i];render();document.getElementById("result").style.display="block";window.scrollTo({top:0,behavior:"smooth"})}
function clearAll(){current=null;document.getElementById("result").style.display="none";document.getElementById("liveRolls").innerHTML=["Espécie","Origem","Personalidade","Talento","Poder","Destino"].map(x=>`<div class="roll"><small>${x}</small><strong>—</strong></div>`).join("")}
async function share(){if(!current)return;const text=`${current.name}\n${current.rank}\n${current.rolls.species.n} • ${current.rolls.power.n}\nForça ${current.s.forca} | INT ${current.s.inteligencia} | POT ${current.s.potencial}`; if(navigator.share)await navigator.share({title:"Meu personagem",text});else alert(text)}
loadHistory();
