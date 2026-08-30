/* ROULETA DA VIDA V8 FINAL
   Sorteio uniforme. A raridade só é calculada depois.
   Nenhum valor 0–100 é usado como atributo do jogador.
*/
const RV = (() => {
  const fallback = {
    appearance:[
      ["aparência humana comum",0],["rosto marcante",1],["beleza incomum",2],["corpo atlético",2],
      ["porte imponente",3],["traços sobrenaturais",4],["olhos de aparência incomum",4],["pele não humana",5],
      ["estrutura corporal monstruosa",5],["corpo parcialmente mecânico",5],["corpo metamórfico",6],
      ["corpo de energia",7],["forma colossal",7],["forma angelical",7],["forma demoníaca",7],
      ["aparência que não parece pertencer à espécie humana",8]
    ],
    origin:[
      ["origem desconhecida",1],["família comum",1],["família de guerreiros",2],["ordem religiosa",2],
      ["clã tradicional",2],["sociedade militar",3],["academia",2],["nobreza",3],["submundo",3],
      ["laboratório",4],["colônia extraterrestre",5],["reino sobrenatural",5],["plano espiritual",6],
      ["civilização avançada",6],["dimensão alternativa",7]
    ],
    condition:[
      ["saúde frágil",0],["condição comum",1],["boa constituição",2],["excelente constituição",3],
      ["regeneração incomum",4],["corpo extremamente resistente",6],["corpo praticamente indestrutível",8],
      ["existência não convencional",9]
    ],
    talent:[
      ["nenhum talento excepcional",0],["memória excelente",1],["coordenação excepcional",2],
      ["talento artístico",1],["talento científico",2],["talento estratégico",3],["talento mágico",4],
      ["talento marcial",4],["talento para tecnologia",4],["talento para liderança",3],
      ["talento sobrenatural",6],["talento extraordinário em múltiplas áreas",7]
    ],
    control:[
      ["não possui controle especial",0],["controle instintivo",2],["controle básico",3],
      ["controle disciplinado",4],["controle avançado",6],["controle excepcional",7],
      ["domínio quase perfeito",8],["domínio absoluto",9]
    ],
    potential:[
      ["potencial limitado",0],["potencial comum",1],["potencial acima da média",2],
      ["alto potencial",4],["potencial excepcional",6],["potencial monstruoso",7],
      ["potencial extraordinário",8],["potencial desconhecido",5],["potencial aparentemente ilimitado",9]
    ],
    life:[
      ["Comum",0],["Tranquila",1],["Aventureira",2],["Difícil",2],["Imprevisível",3],
      ["Grandiosa",4],["Trágica",3],["Caótica",4],["Extraordinária",5],["Lendária",6],
      ["Mítica",7],["Divina",8],["Sem precedentes",9]
    ],
    powers:[
      ["Regeneração — Wolverine",5],["Telepatia — Professor X",6],["Telecinese — ficção de superpoderes",5],
      ["Manipulação do tempo — ficção científica",8],["Viagem no tempo — Doctor Who",7],
      ["Alquimia — Fullmetal Alchemist",5],["Nen — Hunter × Hunter",5],["Chakra — Naruto",5],
      ["Ki — Dragon Ball",5],["Bankai — Bleach",7],["Geass — Code Geass",6],
      ["Respiração do Sol — Demon Slayer",5],["One For All — My Hero Academia",7],
      ["Stand — JoJo's Bizarre Adventure",6],["Magenkyō Sharingan — Naruto",7],
      ["Mimetismo — ficção de superpoderes",4],["Intangibilidade — ficção de superpoderes",6],
      ["Invisibilidade — ficção de superpoderes",4],["Manipulação de gravidade — ficção científica",7],
      ["Manipulação de eletricidade — quadrinhos e anime",5],["Controle de gelo — fantasia",4],
      ["Controle de fogo — fantasia e mitologia",4],["Controle de água — fantasia e mitologia",4],
      ["Controle de sombras — fantasia",5],["Controle de sangue — fantasia e horror",6],
      ["Necromancia — fantasia",6],["Invocação — fantasia",5],["Precognição — ficção especulativa",6],
      ["Probabilidade — ficção especulativa",7],["Causalidade — ficção especulativa",9],
      ["Manipulação da realidade — ficção especulativa",9],["Manipulação de matéria — ficção científica",8],
      ["Manipulação de energia — ficção científica",6],["Manipulação de alma — fantasia",7],
      ["Manipulação de sonhos — Sandman e mitologia",6],["Manipulação de memória — ficção especulativa",6],
      ["Controle de plantas — fantasia",3],["Comunicação com animais — fantasia",2],
      ["Respirar debaixo d'água — fantasia",2],["Visão noturna — fantasia",1],
      ["Sentir emoções — ficção de superpoderes",2],["Falar com insetos — fantasia",1],
      ["Produzir uma pequena faísca — fantasia",0],["Mover objetos muito leves — ficção de superpoderes",1],
      ["Alterar a própria temperatura em pequena escala — ficção",1]
    ],
    weapons:[
      ["Nenhuma",0],["faca",1],["bastão",1],["arco",2],["lança",2],["espada",2],["katana",3],
      ["machado",2],["foice",3],["martelo de guerra",3],["arco longo",3],["besta",2],
      ["duas espadas",3],["manoplas",3],["escudo",2],["grimório",4],["cajado mágico",4],
      ["arma de fogo",3],["rifle",3],["arma de energia",5],["sabre de luz — Star Wars",6],
      ["Excalibur — lenda arturiana",7],["Mjölnir — mitologia nórdica",8],["Stormbreaker — Marvel",7],
      ["Kusanagi — mitologia japonesa",6],["Keyblade — Kingdom Hearts",6]
    ],
    force:[
      ["incapaz de enfrentar alguém",0],["fisicamente comum",1],["bem condicionado",2],["atlético",3],
      ["muito forte",4],["excepcionalmente forte",5],["sobre-humano",6],["monstruoso",7],
      ["colossal",8],["titânico",9],["divino",10],["cósmico",11]
    ],
    speed:[
      ["muito lento",0],["velocidade comum",1],["ágil",2],["extremamente ágil",3],["supersônico",4],
      ["hipersônico",5],["próximo da velocidade da luz",6],["velocidade da luz",7],
      ["além da luz",8],["movimento instantâneo",9],["movimento fora do tempo",10]
    ],
    intelligence:[
      ["capacidade intelectual limitada",0],["comum",1],["perspicaz",2],["inteligente",3],
      ["muito inteligente",4],["gênio",5],["mente estratégica excepcional",6],["intelecto sobre-humano",7],
      ["intelecto de escala planetária",8],["intelecto de escala cósmica",9],["onisciência",11]
    ],
    combat:[
      ["nunca lutou",0],["sem experiência",1],["amador",2],["treinado",3],["combatente competente",4],
      ["veterano",5],["especialista",6],["mestre marcial",7],["mestre de armas",8],["lenda viva",9],
      ["guerreiro divino",10],["combatente impossível de medir",11]
    ],
    titles:[
      ["Ninguém",0],["Camponês",0],["Artesão",1],["Mercador",1],["Viajante",1],["Caçador",2],
      ["Explorador",2],["Guarda",2],["Soldado",3],["Cavaleiro",3],["Mercenário",3],["Ladrão",2],
      ["Espião",4],["Assassino",5],["Mago",4],["Alquimista",4],["Sacerdote",3],["Curandeiro",3],
      ["Capitão",4],["Comandante",5],["General",6],["Rei",5],["Imperador",7],["Campeão",5],
      ["Herói",5],["Anti-herói",4],["Vilão",5],["Senhor da Guerra",6],["Lorde Demônio",8],
      ["Profeta",6],["Oráculo",6],["Avatar",7],["Escolhido",7],["Mestre",6],["Conquistador",7],
      ["Imperador Galáctico",9],["Deus Vivo",10],["Entidade Suprema",11]
    ]
  };

  const raceRanks = {
    "Humano":1,"Elfo":2,"Elfo Negro":3,"Anão":2,"Orc":3,"Goblin":1,"Troll":4,"Ogro":4,"Gigante":6,
    "Fada":3,"Draconiano":5,"Dragão":8,"Vampiro":5,"Lobisomem":5,"Demônio":6,"Anjo":7,"Serafim":8,
    "Semideus":8,"Deus":10,"Espírito":5,"Fantasma":3,"Yōkai":5,"Kitsune":5,"Oni":5,"Shinigami":6,
    "Hollow":6,"Quincy":5,"Homúnculo":5,"Ciborgue":4,"Androide":4,"Alienígena":3,"Mutante":4,
    "Metamorfo":4,"Elemental":6,"Golem":5,"Titã":8,"Fênix":8,"Quimera":4,"Centauro":3,"Sereia":3,
    "Tritão":3,"Ninfa":3,"Dríade":4,"Minotauro":4,"Medusa":5,"Sátiro":2,"Naga":4,"Djinn":7,"Ifrit":7,
    "Jinn":7,"Rakshasa":7,"Asura":7,"Valkyrie":7,"Gigante de Gelo":7,"Gigante de Fogo":7,"Banshee":5,
    "Dullahan":5,"Kelpie":3,"Grifo":5,"Harpia":3,"Súcubo":5,"Íncubo":5,"Ghoul":3,"Kaiju":8,
    "Saiyajin":7,"Namekuseijin":4,"Kryptoniano":9,"Viltrumita":8,"Asgardiano":7,"Atlante":4,
    "Amazonas":4,"Metahumano":5,"Inumano":5,"Eternos":8,"Celestial":11,"Symbiote":6,"Guardião de Oa":7,
    "Kree":4,"Skrull":4,"Twi’lek":2,"Wookiee":3,"Vulcano":3,"Klingon":3,"Time Lord":8,"Dalek":7,
    "Cyberman":5,"Replicante":3,"Cylon":4,"Predador":5,"Zerg":6,"Protoss":7,"Terrano":1,
    "Esper":5,"Psíquico":5
  };

  const names = {
    first:["Akira","Aiko","Ren","Rin","Haru","Yuki","Sora","Kai","Ryu","Mei","Lena","Nora","Elian","Elias","Lucian","Mira","Viktor","Iris","Dante","Valen","Arthur","Evelyn","Milo","Theo","Adrian","Naomi","Levi","Amara","Soren","Freya","Nikolai","Zara","Samir","Layla","Kenji","Emi","Hugo","Clara","Rafael","Luna"],
    last:["Aoki","Kurosawa","Hayashi","Mori","Takeda","Arakawa","Silva","Costa","Moreau","Dubois","Blackwood","Ashford","Ravenwood","Vale","Everett","Cruz","Navarro","Volkov","Kovacs","Hale","Sterling","Nightingale","Frost","Grimm","Stone","Reyes","Sato","Khan","Ishikawa","Mercer"]
  };

  function arr(key){ return Array.isArray(LIBRARY?.[key]) && LIBRARY[key].length ? LIBRARY[key] : fallback[key] || []; }
  function norm(x){
    if(Array.isArray(x)) return {name:String(x[0]), value:Number.isFinite(x[1])?x[1]:undefined, ref:x[2]||""};
    if(typeof x==="string") return {name:x};
    return x||{name:"—"};
  }
  function randomInt(max){
    if(max<=1) return 0;
    const c=globalThis.crypto;
    if(c?.getRandomValues){
      const max32=0x100000000, limit=Math.floor(max32/max)*max;
      const a=new Uint32Array(1); do{c.getRandomValues(a)}while(a[0]>=limit);
      return a[0]%max;
    }
    return Math.floor(Math.random()*max);
  }
  function pick(list){ return norm(list[randomInt(list.length)]); }
  function draw(key){ return pick(arr(key)); }
  function race(){ const x=draw("races"); x.rank=raceRanks[x.name]??3; return x; }
  function name(){ return pick(names.first).name+" "+pick(names.last).name; }
  function power(){ return pick(fallback.powers); }
  function yesPower(){ return randomInt(100)<70; }
  function score(x){ const n=norm(x); if(Number.isFinite(n.value)) return n.value; return 2; }

  const rarity=[
    ["Comum",1,"#777777"],["Incomum",2,"#65d68a"],["Raro",3,"#5aa8ff"],["Épico",4,"#a777ff"],
    ["Mítico",5,"#ff5ac8"],["Lendário",6,"#ffb84d"],["Divino",7,"#fff36b"],["Transcendente",8,"#72f5ff"]
  ];
  function rarityOf(p){
    const vals=[
      p.race.rank??3, score(p.condition), score(p.force), score(p.speed), score(p.intelligence),
      score(p.combat), p.hasPower?score(p.power):0, score(p.control), score(p.talent),
      score(p.weapon), score(p.potential), score(p.title)
    ].sort((a,b)=>b-a);
    const peak=vals[0], top=vals.slice(0,4).reduce((a,b)=>a+b,0);
    let idx=0;
    if(peak>=10 || top>=38) idx=7;
    else if(peak>=8 || top>=32) idx=6;
    else if(peak>=7 || top>=27) idx=5;
    else if(peak>=6 || top>=22) idx=4;
    else if(peak>=5 || top>=17) idx=3;
    else if(peak>=4 || top>=12) idx=2;
    else if(peak>=2 || top>=7) idx=1;
    return {name:rarity[idx][0],stars:rarity[idx][1],color:rarity[idx][2],peak,top};
  }

  function profile(p){
    const out={Força:p.force,Velocidade:p.speed,Inteligência:p.intelligence,Combate:p.combat,Controle:p.control,Potencial:p.potential};
    const r=rarityOf(p); return {labels:out,rarity:r};
  }

  return {fallback,draw,race,name,power,yesPower,profile,rarity,randomInt,norm,score};
})();