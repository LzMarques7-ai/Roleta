/*
ROULETA DA VIDA — V6
A biblioteca é deliberadamente separada do motor.
Não existe peso de raridade: cada item da mesma roleta recebe peso 1.
A expansão procedural cria combinações novas sem fingir que a web é uma
"biblioteca infinita". Fontes externas são opcionais e entram como referências.
*/
const LIBRARY = {
  races: [
    "Humano","Elfo","Elfo Negro","Anão","Orc","Goblin","Troll","Ogro","Gigante","Fada",
    "Draconiano","Dragão","Vampiro","Lobisomem","Demônio","Anjo","Serafim","Semideus","Deus",
    "Espírito","Fantasma","Yokai","Kitsune","Oni","Shinigami","Homúnculo","Ciborgue","Androide",
    "Alienígena","Mutante","Metamorfo","Elemental","Golem","Titã","Entidade Cósmica","Entidade Abstrata",
    "Parasita","Monstro","Fera","Fera Mágica","Constructo","Celestial","Infernal","Familiar","Autômato",
    "Sereiano","Tritão","Ninfa","Dríade","Fênix","Serpente Ancestral","Quimera","Gigante de Pedra",
    "Gigante de Gelo","Gigante de Fogo","Povo-Fera","Dragão Celestial","Dragão Abissal",
    "Vampiro Ancestral","Demônio Primordial","Espírito Guardião","Devorador de Mundos",
    "Ser Cósmico","Avatar","Forma de Vida Artificial",
    "Saiyajin","Kryptoniano","Viltrumita","Asgardiano","Kree","Skrull","Atlante","Amazonas",
    "Inumano","Eternauta","Metahumano","Portador de Stand","Usuário de Nen","Usuário de Chakra",
    "Shinobi","Quincy","Hollow","Mago","Bruxo","Feiticeiro","Maldição","Caçador de Demônios",
    "Ghoul","Híbrido Humano-Demônio","Híbrido Humano-Animal","Híbrido Mágico","Espécie Sintética",
    "Ser de Energia","Ser de Plasma","Ser de Sombra","Ser de Luz","Ser Astral","Ser Dimensional",
    "Ser Paradoxal","Entidade de Sonho","Entidade de Memória","Entidade de Conceito","Avatar Divino"
  ],
  titles: [
    "Ninguém","Camponês","Artesão","Mercador","Viajante","Explorador","Caçador","Aventureiro",
    "Guarda","Soldado","Cavaleiro","Mercenário","Ladrão","Assassino","Espião","Batedor","Monge",
    "Sacerdote","Curandeiro","Alquimista","Mago","Feiticeiro","Invocador","Necromante","Duelista",
    "Espadachim","Arqueiro","Capitão","Comandante","General","Almirante","Rei","Rainha","Príncipe",
    "Princesa","Imperador","Imperatriz","Duque","Soberano","Campeão","Herói","Anti-Herói","Vilão",
    "Senhor da Guerra","Lorde Demônio","Profeta","Oráculo","Guardião","Arauto","Executor","Escolhido",
    "Reencarnado","Avatar","Mestre","Lenda","Monarca Eterno","Soberano Celestial","Soberano Abissal",
    "Deus Vivo","Entidade Suprema","Portador da Relíquia","Mestre de Guilda","Líder de Clã",
    "Comandante de Esquadrão","General de Exército","Rei dos Piratas","Caçador de Recompensas",
    "Agente Secreto","Detetive","Cientista","Engenheiro","Inventor","Piloto","Mercador de Relíquias",
    "Professor","Estudante","Atleta","Gladiador","Campeão Mundial","Mestre de Artes Marciais",
    "Guardião de Portal","Juiz","Carrasco","Soberano do Submundo","Regente","Fundador","Conquistador",
    "Libertador","Rei dos Monstros","Imperador Galáctico","Arauto do Fim"
  ],
  ages: [
    "Recém-nascido","1 ano","3 anos","5 anos","8 anos","10 anos","12 anos","13 anos","15 anos",
    "16 anos","17 anos","18 anos","20 anos","21 anos","25 anos","30 anos","35 anos","40 anos",
    "50 anos","60 anos","70 anos","80 anos","100 anos","150 anos","300 anos","500 anos","1.000 anos",
    "5.000 anos","10.000 anos","100.000 anos","1 milhão de anos","Idade desconhecida",
    "Imortal — aparência infantil","Imortal — aparência jovem","Imortal — aparência adulta",
    "Imortal — aparência idosa","Existe fora do tempo"
  ],
  physical: [
    "Extremamente fraco","Muito fraco","Fraco","Abaixo da média","Comum","Bem condicionado",
    "Atlético","Forte","Muito forte","Excepcionalmente forte","Sobre-humano","Monstruoso",
    "Colossal","Titânico","Divino","Cósmico","Transcendente","Sem limite conhecido"
  ],
  speed: [
    "Muito lento","Lento","Comum","Ágil","Muito ágil","Excepcionalmente rápido","Supersônico",
    "Hipersônico","Relâmpago em combate","Próximo da velocidade da luz","Velocidade da luz",
    "Além da luz","Instantâneo em curtas distâncias","Teleporte de curta distância",
    "Teleporte de longa distância","Movimento instantâneo","Velocidade temporal",
    "Movimento fora do tempo","Velocidade conceitual","Sem limite conhecido"
  ],
  intelligence: [
    "Instintivo","Muito limitado","Limitado","Abaixo da média","Comum","Perspicaz","Inteligente",
    "Muito inteligente","Gênio","Gênio excepcional","Mente estratégica","Intelecto extraordinário",
    "Intelecto sobre-humano","Mente de nível planetário","Mente de nível estelar","Mente de nível galáctico",
    "Mente de nível universal","Conhecimento quase absoluto","Onisciência parcial","Onisciência",
    "Consciência além da lógica"
  ],
  combat: [
    "Nunca lutou","Sem experiência","Amador","Briga de rua","Treinado","Combatente competente",
    "Veterano","Especialista","Mestre marcial","Mestre de armas","Especialista em múltiplas armas",
    "Assassino experiente","Lenda viva","Mestre absoluto","Predador de elite","Guerreiro divino",
    "Combatente transcendental","Impossível de medir"
  ],
  hasPower: ["Não","Sim"],
  powerRefs: [
    "Ki","Chakra","Nen","Haki","Quirk","Stand","Bankai","Reiatsu","Energia Amaldiçoada","Magia",
    "Alquimia","Psionismo","Telepatia","Telecinese","Força","Bending","Aura","Mutação Genética",
    "Anel de Energia","Artefato Mágico","Pacto","Contrato Espiritual","Invocação","Runas",
    "Feitiçaria","Necromancia","Domínio Elemental","Transformação","Regeneração","Absorção",
    "Duplicação","Ilusão","Manipulação de Som","Manipulação de Luz","Manipulação de Trevas",
    "Manipulação de Gravidade","Manipulação de Espaço","Manipulação de Tempo","Manipulação de Alma",
    "Manipulação de Memória","Manipulação de Sonhos","Manipulação de Vida","Manipulação de Morte",
    "Manipulação de Matéria","Manipulação de Energia","Manipulação de Probabilidade",
    "Manipulação de Destino","Manipulação de Causalidade","Manipulação da Realidade",
    "Manipulação de Conceitos","Manipulação da Existência","Apagamento Existencial","Criação de Vida",
    "Criação de Matéria","Criação de Dimensões","Alteração de Leis","Alteração da Narrativa",
    "Onisciência","Onipresença","Onipotência"
  ],
  weapons: [
    "Nenhuma","Punhos","Garras","Adagas","Espada curta","Espada longa","Katana","Nodachi",
    "Duas espadas","Espada pesada","Espada colossal","Lança","Tridente","Alabarda","Machado",
    "Martelo","Arco","Arco longo","Besta","Pistola","Duas pistolas","Rifle","Espingarda",
    "Arma de energia","Canhão","Cajado","Varinha","Grimório","Foice","Foice da alma","Corrente",
    "Chicote","Lâmina oculta","Arma viva","Arma amaldiçoada","Arma sagrada","Arma divina",
    "Arma cósmica","Arma dimensional","Relíquia ancestral","Artefato desconhecido",
    "Arma que muda de forma","Arma que absorve poderes","Arma que manipula a realidade",
    "Arma de fogo","Arma de plasma","Arma psíquica","Arma espiritual","Arma feita de energia",
    "Arma que retorna ao dono","Arma que cresce com o usuário","Arma ligada à alma"
  ]
};

const POWER_DOMAINS=[
 "fogo","água","gelo","vento","terra","raio","luz","trevas","metal","sangue","plantas","som",
 "gravidade","magnetismo","pressão","calor","frio","energia","matéria","antimatéria","plasma",
 "espaço","tempo","memória","sonhos","alma","vida","morte","probabilidade","sorte","destino",
 "causalidade","realidade","dimensões","leis físicas","leis mágicas","conceitos","existência",
 "informação","emoções","medo","dor","vontade","identidade","nome verdadeiro","linguagem",
 "história","narrativa","distância","movimento","velocidade","massa","entropia","gravidade",
 "vácuo","sombras","luz solar","energia vital","energia espiritual","energia psíquica"
];
const POWER_ACTIONS=[
 "criação de","controle de","absorção de","conversão de","projeção de","selamento de",
 "amplificação de","anulação de","manipulação de","roubo de","cópia de","inversão de",
 "divisão de","fusão de","transmutação de","negação de","reflexão de","compressão de",
 "expansão de","reescrita de"
];
const POWER_RANGES=[
 "um alvo","uma pessoa","um objeto","uma área pequena","uma casa","um bairro","uma cidade",
 "uma região","um país","um continente","um planeta","um sistema estelar","uma galáxia",
 "um universo","múltiplos universos","uma linha do tempo","todas as linhas do tempo",
 "uma dimensão","múltiplas dimensões","escala conceitual","escala existencial"
];
const POWER_MODIFIERS=[
 "sem custo aparente","com custo físico","com custo mental","exigindo concentração",
 "ativado por emoção","ativado por contato","ativado pela voz","ativado pelo olhar",
 "limitado por tempo","que cresce durante o combate","que se adapta ao inimigo",
 "que fica mais forte após cada uso","que pode ser compartilhado","que pode ser roubado",
 "que pode evoluir","que ignora defesas comuns","que exige um contrato","que exige um sacrifício"
];

for(const action of POWER_ACTIONS)
 for(const domain of POWER_DOMAINS)
  for(const range of POWER_RANGES)
   for(const modifier of POWER_MODIFIERS)
    LIBRARY.powerRefs.push(`${action} ${domain} em ${range}, ${modifier}`);

LIBRARY.powerRefs=[...new Set(LIBRARY.powerRefs)];
const REMOTE_LIBRARY={characters:[],works:[],authors:[]};
window.ROULETTE_LIBRARY_VERSION="6.0";
