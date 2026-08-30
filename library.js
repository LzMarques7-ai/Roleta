/* ROULETA DA VIDA V8 — biblioteca local-first.
   As opções do sorteio têm chance uniforme.
   As referências são conceitos/escalas presentes em mitologia, literatura,
   cinema, séries, quadrinhos, jogos, anime e mangá. Não há raridade escondida.
*/
const LIBRARY={
 races:[
  ['Humano'],['Elfo'],['Elfo Negro'],['Anão'],['Orc'],['Goblin'],['Troll'],['Ogro'],['Gigante'],['Fada'],['Draconiano'],['Dragão'],['Vampiro'],['Lobisomem'],['Demônio'],['Anjo'],['Serafim'],['Semideus'],['Deus'],['Espírito'],['Fantasma'],['Yōkai'],['Kitsune'],['Oni'],['Shinigami'],['Hollow'],['Quincy'],['Homúnculo'],['Ciborgue'],['Androide'],['Alienígena'],['Mutante'],['Metamorfo'],['Elemental'],['Golem'],['Titã'],['Fênix'],['Quimera'],['Centauro'],['Sereia'],['Tritão'],['Ninfa'],['Dríade'],['Minotauro'],['Medusa'],['Sátiro'],['Naga'],['Djinn'],['Ifrit'],['Jinn'],['Rakshasa'],['Asura'],['Rakshasa'],['Valkyrie'],['Gigante de Gelo'],['Gigante de Fogo'],['Anão Negro'],['Fauno'],['Duende'],['Banshee'],['Dullahan'],['Leprechaun'],['Kelpie'],['Grifo'],['Harpia'],['Súcubo'],['Íncubo'],['Ghoul'],['Kaiju'],['Saiyajin'],['Namekuseijin'],['Kryptoniano'],['Viltrumita'],['Asgardiano'],['Atlante'],['Amazonas'],['Metahumano'],['Inumano'],['Eternos'],['Celestial'],['Symbiote'],['Guardião de Oa'],['Kree'],['Skrull'],['Twi’lek'],['Wookiee'],['Vulcano'],['Klingon'],['Time Lord'],['Dalek'],['Cyberman'],['Replicante'],['Cylon'],['Predador'],['Zerg'],['Protoss'],['Terrano'],['Esper'],['Psíquico'],
 ],
 titles:[
  ['Ninguém'],['Camponês'],['Artesão'],['Mercador'],['Viajante'],['Explorador'],['Caçador'],['Aventureiro'],['Guarda'],['Soldado'],['Cavaleiro'],['Mercenário'],['Ladrão'],['Assassino'],['Espião'],['Batedor'],['Monge'],['Sacerdote'],['Curandeiro'],['Alquimista'],['Mago'],['Feiticeiro'],['Invocador'],['Necromante'],['Duelista'],['Espadachim'],['Arqueiro'],['Capitão'],['Comandante'],['General'],['Almirante'],['Rei'],['Rainha'],['Príncipe'],['Princesa'],['Imperador'],['Imperatriz'],['Duque'],['Soberano'],['Campeão'],['Herói'],['Anti-herói'],['Vilão'],['Senhor da Guerra'],['Lorde Demônio'],['Profeta'],['Oráculo'],['Guardião'],['Arauto'],['Executor'],['Escolhido'],['Reencarnado'],['Avatar'],['Mestre'],['Lenda'],['Monarca'],['Soberano Celestial'],['Soberano Abissal'],['Deus Vivo'],['Entidade Suprema'],['Portador da Relíquia'],['Mestre de Guilda'],['Líder de Clã'],['Comandante de Esquadrão'],['Agente Secreto'],['Detetive'],['Cientista'],['Engenheiro'],['Inventor'],['Piloto'],['Professor'],['Estudante'],['Atleta'],['Gladiador'],['Campeão Mundial'],['Mestre de Artes Marciais'],['Juiz'],['Carrasco'],['Regente'],['Fundador'],['Conquistador'],['Libertador'],['Rei dos Monstros'],['Imperador Galáctico'],['Comandante Supremo'],['Guardião de Portal'],['Mestre de Espadas'],['Mestre de Magia'],['Mestre de Nen'],['Mestre de Chakra'],['Mestre de Ki'],['Mestre de Alquimia']
 ],
 ages:[
  ['Recém-nascido',5],['1 ano',8],['3 anos',10],['5 anos',12],['8 anos',15],['10 anos',17],['12 anos',19],['13 anos',20],['15 anos',25],['16 anos',27],['17 anos',29],['18 anos',32],['20 anos',35],['21 anos',36],['25 anos',40],['30 anos',45],['35 anos',48],['40 anos',50],['50 anos',54],['60 anos',56],['70 anos',58],['80 anos',60],['100 anos',62],['150 anos',65],['300 anos',70],['500 anos',74],['1.000 anos',78],['5.000 anos',82],['10.000 anos',86],['100.000 anos',90],['1 milhão de anos',94],['Idade desconhecida',55],['Imortal — aparência infantil',60],['Imortal — aparência jovem',72],['Imortal — aparência adulta',78],['Imortal — aparência idosa',68],['Existe fora do tempo',100],['Nasceu ontem',8],['Mais velho que a própria civilização',96]
 ].map(x=>({name:x[0],value:x[1]})),
 physical:[
  ['Extremamente fraco',5],['Muito fraco',12],['Fraco',20],['Abaixo da média',32],['Comum',45],['Bem condicionado',55],['Atlético',62],['Forte',70],['Muito forte',78],['Excepcionalmente forte',84],['Sobre-humano',90],['Monstruoso',94],['Colossal',96],['Titânico',98],['Divino',99],['Cósmico',100],['Transcendente',100],['Sem limite conhecido',100]
 ].map(x=>({name:x[0],value:x[1]})),
 speed:[
  ['Muito lento',5],['Lento',15],['Comum',35],['Ágil',50],['Muito ágil',60],['Excepcionalmente rápido',70],['Supersônico',78],['Hipersônico',84],['Velocidade de relâmpago',88],['Próximo da velocidade da luz',94],['Velocidade da luz',97],['Além da luz',99],['Movimento instantâneo',100],['Teleporte de curta distância',95],['Teleporte de longa distância',98],['Movimento temporal',100],['Velocidade fora do tempo',100],['Velocidade conceitual',100],['Parada temporal própria',98],['Deslocamento dimensional',100]
 ].map(x=>({name:x[0],value:x[1]})),
 intelligence:[
  ['Instintivo',5],['Muito limitado',12],['Limitado',20],['Abaixo da média',32],['Comum',45],['Perspicaz',55],['Inteligente',65],['Muito inteligente',72],['Gênio',80],['Gênio excepcional',86],['Mente estratégica',88],['Intelecto extraordinário',92],['Intelecto sobre-humano',95],['Mente de nível planetário',97],['Mente de nível estelar',98],['Mente de nível galáctico',99],['Mente de nível universal',100],['Conhecimento quase absoluto',100],['Onisciência parcial',100],['Onisciência',100]
 ].map(x=>({name:x[0],value:x[1]})),
 combat:[
  ['Nunca lutou',5],['Sem experiência',12],['Amador',22],['Briga de rua',32],['Treinado',45],['Combatente competente',55],['Veterano',65],['Especialista',74],['Mestre marcial',82],['Mestre de armas',86],['Especialista em múltiplas armas',89],['Assassino experiente',91],['Lenda viva',94],['Mestre absoluto',97],['Predador de elite',98],['Guerreiro divino',99],['Combatente transcendental',100],['Impossível de medir',100]
 ].map(x=>({name:x[0],value:x[1]})),
 hasPower:[{name:'Não'},{name:'Sim'}],
 weapons:[
  ['Nenhuma'],['Punhos'],['Garras'],['Adagas'],['Espada curta'],['Espada longa'],['Katana'],['Nodachi'],['Duas espadas'],['Espada pesada'],['Espada colossal'],['Florete'],['Rapieira'],['Sabre'],['Lança'],['Alabarda'],['Foice'],['Martelo de guerra'],['Machado'],['Machado duplo'],['Arco'],['Arco longo'],['Besta'],['Arco de energia'],['Chakram'],['Kunai'],['Shuriken'],['Corrente'],['Chicote'],['Bastão'],['Bo'],['Nunchaku'],['Tonfa'],['Manoplas'],['Escudo'],['Lança e escudo'],['Arma de fogo'],['Revólver'],['Pistola'],['Espingarda'],['Rifle'],['Rifle de energia'],['Canhão'],['Lança-chamas'],['Arma de plasma'],['Sabre de luz'],['Keyblade'],['Buster Sword'],['Mjölnir'],['Stormbreaker'],['Excalibur'],['Masamune'],['Kusanagi'],['Espada de energia'],['Foice espiritual'],['Grimório'],['Cajado'],['Varinha'],['Anel'],['Amuleto'],['Relíquia']
 ].map(x=>({name:x[0]}))
};

const POWER_ACTIONS=[
 {name:'Manipulação de',ref:'conceito recorrente em ficção especulativa'},
 {name:'Controle de',ref:'ficção de superpoderes'},
 {name:'Criação de',ref:'fantasia e ficção científica'},
 {name:'Projeção de',ref:'fantasia e quadrinhos'},
 {name:'Absorção de',ref:'ficção de superpoderes'},
 {name:'Amplificação de',ref:'anime, mangá e quadrinhos'},
 {name:'Transmutação de',ref:'alquimia e fantasia'},
 {name:'Negação de',ref:'ficção de superpoderes'},
 {name:'Selamento de',ref:'fantasia, anime e mangá'},
 {name:'Distorção de',ref:'ficção científica e fantasia'},
 {name:'Percepção de',ref:'ficção especulativa'},
 {name:'Roubo de',ref:'ficção de superpoderes'},
 {name:'Invocação de',ref:'fantasia'},
 {name:'Regeneração por',ref:'fantasia e ficção de superpoderes'},
 {name:'Conversão de',ref:'ficção científica'},
 {name:'Anulação de',ref:'ficção de superpoderes'},
 {name:'Duplicação de',ref:'ficção especulativa'},
 {name:'Intangibilidade através de',ref:'quadrinhos, anime e ficção científica'},
 {name:'Existência além de',ref:'cosmologia ficcional'},
 {name:'Percepção além de',ref:'ficção especulativa'}
];
const POWER_DOMAINS=[
 {name:'tempo',ref:'Doctor Who; Steins;Gate; JoJo; ficção científica'},
 {name:'espaço',ref:'ficção científica e quadrinhos'},
 {name:'gravidade',ref:'ficção científica'},
 {name:'matéria',ref:'alquimia; ficção científica'},
 {name:'energia',ref:'quadrinhos; anime; ficção científica'},
 {name:'fogo',ref:'mitologia e fantasia'},
 {name:'água',ref:'mitologia e fantasia'},
 {name:'gelo',ref:'mitologia e fantasia'},
 {name:'vento',ref:'mitologia e fantasia'},
 {name:'terra',ref:'mitologia e fantasia'},
 {name:'relâmpago',ref:'mitologia e fantasia'},
 {name:'luz',ref:'mitologia e religião comparada'},
 {name:'trevas',ref:'mitologia e fantasia'},
 {name:'sangue',ref:'fantasia; horror'},
 {name:'vida',ref:'fantasia'},
 {name:'morte',ref:'mitologia; fantasia'},
 {name:'alma',ref:'mitologia; fantasia'},
 {name:'mente',ref:'ficção de superpoderes'},
 {name:'memória',ref:'ficção especulativa'},
 {name:'sonhos',ref:'Sandman; mitologia; fantasia'},
 {name:'emoções',ref:'ficção de superpoderes'},
 {name:'som',ref:'ficção de superpoderes'},
 {name:'vibração',ref:'quadrinhos; ficção científica'},
 {name:'eletricidade',ref:'ficção científica e super-heróis'},
 {name:'magnetismo',ref:'quadrinhos; ficção científica'},
 {name:'metal',ref:'fantasia e super-heróis'},
 {name:'cristal',ref:'fantasia'},
 {name:'planta',ref:'fantasia e mitologia'},
 {name:'veneno',ref:'fantasia; RPGs'},
 {name:'ácido',ref:'ficção de superpoderes'},
 {name:'fumaça',ref:'fantasia e quadrinhos'},
 {name:'areia',ref:'anime e fantasia'},
 {name:'areia movediça',ref:'fantasia'},
 {name:'cinzas',ref:'fantasia'},
 {name:'névoa',ref:'fantasia e horror'},
 {name:'escuridão',ref:'fantasia e horror'},
 {name:'gravidade zero',ref:'ficção científica'},
 {name:'dimensões',ref:'ficção científica e quadrinhos'},
 {name:'portais',ref:'fantasia e ficção científica'},
 {name:'probabilidade',ref:'ficção especulativa'},
 {name:'causalidade',ref:'ficção especulativa'},
 {name:'destino',ref:'mitologia e fantasia'},
 {name:'sorte',ref:'mitologia e ficção'},
 {name:'azar',ref:'ficção de superpoderes'},
 {name:'conceitos',ref:'fantasia metafísica'},
 {name:'nomes',ref:'mitologia e fantasia'},
 {name:'palavras',ref:'fantasia e ficção'},
 {name:'linguagem',ref:'ficção especulativa'},
 {name:'verdade',ref:'fantasia metafísica'},
 {name:'mentira',ref:'ficção especulativa'},
 {name:'ordem',ref:'fantasia metafísica'},
 {name:'caos',ref:'mitologia e fantasia'},
 {name:'realidade',ref:'ficção científica e fantasia'},
 {name:'ilusão',ref:'fantasia e horror'},
 {name:'reflexos',ref:'ficção de superpoderes'},
 {name:'sombras',ref:'fantasia e horror'},
 {name:'luz solar',ref:'mitologia e fantasia'},
 {name:'lua',ref:'mitologia e fantasia'},
 {name:'estrelas',ref:'mitologia e ficção científica'},
 {name:'cosmos',ref:'ficção científica'},
 {name:'espaço-tempo',ref:'relatividade e ficção científica'},
 {name:'calor',ref:'ficção científica'},
 {name:'frio',ref:'ficção especulativa'},
 {name:'pressão',ref:'ficção científica'},
 {name:'densidade',ref:'ficção científica'},
 {name:'inércia',ref:'ficção científica'},
 {name:'entropia',ref:'ficção científica'},
 {name:'radiação',ref:'ficção científica'},
 {name:'plasma',ref:'ficção científica'},
 {name:'antimatéria',ref:'ficção científica'},
 {name:'matéria escura',ref:'ficção científica'},
 {name:'energia cinética',ref:'ficção científica'},
 {name:'energia potencial',ref:'ficção científica'},
 {name:'fronteiras dimensionais',ref:'ficção científica'},
 {name:'telepatia',ref:'quadrinhos; ficção especulativa'},
 {name:'telecinese',ref:'quadrinhos; anime; ficção científica'},
 {name:'precognição',ref:'ficção especulativa'},
 {name:'clarividência',ref:'folclore e ficção'},
 {name:'teletransporte',ref:'ficção científica'},
 {name:'metamorfose',ref:'mitologia e fantasia'},
 {name:'regeneração',ref:'quadrinhos; horror; fantasia'},
 {name:'imortalidade',ref:'mitologia e fantasia'},
 {name:'invulnerabilidade',ref:'mitologia e super-heróis'},
 {name:'superforça',ref:'quadrinhos e anime'},
 {name:'supervelocidade',ref:'quadrinhos e anime'},
 {name:'sentidos',ref:'ficção de superpoderes'},
 {name:'aura',ref:'anime, mangá e fantasia'},
 {name:'ki',ref:'Dragon Ball e artes marciais ficcionais'},
 {name:'chakra',ref:'Naruto e tradições indianas reinterpretadas'},
 {name:'nen',ref:'Hunter × Hunter'},
 {name:'reiatsu',ref:'Bleach'},
 {name:'haki',ref:'One Piece'},
 {name:'quirk',ref:'My Hero Academia'},
 {name:'stands',ref:'JoJo’s Bizarre Adventure'},
 {name:'alquimia',ref:'Fullmetal Alchemist e tradição alquímica'},
 {name:'magia',ref:'fantasia, RPGs e literatura'},
 {name:'maldição',ref:'Jujutsu Kaisen e horror'},
 {name:'fruta do diabo',ref:'One Piece'},
 {name:'respiração',ref:'Demon Slayer'},
 {name:'transformação',ref:'anime, mangá e quadrinhos'},
 {name:'armamento',ref:'fantasia e ficção científica'},
 {name:'barreira',ref:'fantasia e anime'},
 {name:'invocação espiritual',ref:'folclore e fantasia'}
];
const POWER_MODIFIERS=[
 {name:'à distância'}, {name:'por contato'}, {name:'em área'}, {name:'de precisão'}, {name:'em cadeia'},
 {name:'de forma contínua'}, {name:'de forma instantânea'}, {name:'com custo físico'}, {name:'com custo mental'},
 {name:'através de um objeto'}, {name:'através do próprio corpo'}, {name:'em escala limitada'}, {name:'em escala massiva'},
 {name:'sob condição específica'}, {name:'de forma inconsciente'}, {name:'após preparação'}, {name:'em estado emocional extremo'},
 {name:'com risco de retorno'}, {name:'sem controle perfeito'}, {name:'com domínio excepcional'}
];
const POWER_EFFECTS={
 'tempo':{Poder:28},'espaço':{Poder:28},'gravidade':{Poder:25},'realidade':{Poder:38},'causalidade':{Poder:40},'conceitos':{Poder:42},'destino':{Poder:36},'cosmos':{Poder:35},'antimatéria':{Poder:34},'matéria escura':{Poder:34},'telepatia':{Inteligência:8,Poder:18},'telecinese':{Poder:18},'precognição':{Inteligência:10,Poder:20},'teletransporte':{Velocidade:15,Poder:22},'metamorfose':{Poder:15},'regeneração':{Resistência:20,Poder:15},'imortalidade':{Resistência:35,Poder:18},'invulnerabilidade':{Resistência:40,Poder:22},'superforça':{Força:30,Poder:18},'supervelocidade':{Velocidade:30,Poder:18},'ki':{Força:10,Combate:12,Poder:20},'chakra':{Velocidade:8,Combate:10,Poder:20},'nen':{Combate:12,Inteligência:8,Poder:20},'reiatsu':{Poder:22,Resistência:8},'haki':{Combate:15,Poder:18},'quirk':{Poder:18},'stands':{Combate:10,Poder:25},'alquimia':{Inteligência:12,Poder:20},'magia':{Inteligência:10,Poder:22},'maldição':{Poder:25},'fruta do diabo':{Poder:25},'respiração':{Combate:12,Velocidade:8,Poder:12},'barreira':{Resistência:20,Poder:18}
};

const NAME_A=['Aki','Aren','Arin','Aya','Cael','Dai','Eli','Eren','Haru','Ilya','Jin','Kai','Kira','Lio','Luan','Mika','Nara','Noa','Rin','Sora','Tao','Yuna','Zane','Ari','Ren','Lena','Mio','Niko','Ryo','Theo','Vera','Zuri'];
const NAME_B=['n','ra','ki','el','an','or','is','en','a','o','ir','us','ia','on','ei','ar','yn','eo','ai','eth'];
const ALIGNMENTS=['altruísta','neutro','pragmático','individualista','idealista','ambicioso','honrado','caótico','reservado','vingativo'];
const PERSONALITY_TRAITS=['observador e desconfiado','impulsivo, mas leal','calmo sob pressão','orgulhoso e competitivo','curioso até o limite','disciplinado e reservado','carismático e imprevisível','compassivo com quem sofre','frio quando precisa decidir','teimoso diante de autoridades','adaptável e difícil de intimidar','idealista, mesmo após perdas'];
const IDEALS=['proteger quem não consegue se proteger','descobrir a verdade sobre seu passado','superar seu próprio limite','viver sem depender de ninguém','deixar um legado que sobreviva a ele','impedir que o poder caia nas mãos erradas','provar que sua origem não define seu destino','encontrar um lugar onde possa pertencer','vingar uma injustiça antiga','compreender a natureza do próprio poder'];
const FLAWS=['subestima os próprios limites','tem dificuldade em confiar','confunde orgulho com coragem','carrega culpa por erros antigos','age antes de entender todas as consequências','tem medo de perder o controle','não sabe abandonar uma disputa','guarda ressentimentos por tempo demais','sente necessidade de provar seu valor','evita falar sobre o que realmente sente'];
const GOALS=['descobrir quem o criou','encontrar uma pessoa desaparecida','dominar completamente sua habilidade','derrubar alguém que controla sua região','proteger sua família','entender a origem de sua espécie','encontrar a verdade por trás de uma guerra','alcançar o maior nível de combate possível','romper uma maldição','construir uma vida que não dependa de seu passado'];
const FEARS=['perder o controle do próprio poder','ficar sozinho novamente','descobrir que sua vida foi construída sobre uma mentira','tornar-se igual ao inimigo que odeia','falhar quando alguém depender dele','ser lembrado apenas pelos seus erros','perder a própria identidade','descobrir que não existe limite para o que pode fazer'];
