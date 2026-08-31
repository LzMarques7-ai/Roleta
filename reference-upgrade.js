/* ROULETA DA VIDA V12 — REFERENCE ENGINE
   Sorteio independente, uniforme e COM reposição.
   Cada entrada ocupa exatamente UMA posição na roleta.
   value = metadado de escala para a raridade; NUNCA é peso de sorteio.
*/
(()=>{"use strict";

const randomIndex=max=>{
  if(max<=1)return 0;
  const c=globalThis.crypto;
  if(c?.getRandomValues){
    const a=new Uint32Array(1), lim=Math.floor(0x100000000/max)*max;
    do{c.getRandomValues(a)}while(a[0]>=lim);
    return a[0]%max;
  }
  return Math.floor(Math.random()*max);
};
const parse=s=>s.trim().split("\n").filter(Boolean).map(row=>{
  const [name,ref,value]=row.split("|");
  return {name,ref:ref||"",value:Number(value??50)};
});
const pick=a=>({...a[randomIndex(a.length)]});

const DATA={
force:parse(`
Pessoa muito fraca|referência humana|5
Criança pequena|referência humana|8
Pessoa sedentária|referência humana|15
Pessoa comum|referência humana|25
Pessoa condicionada|referência humana|32
Atleta amador|desempenho humano|38
Atleta de elite|desempenho humano|48
Hafþór Björnsson|strongman real|55
Eddie Hall|strongman real|55
Brian Shaw|strongman real|57
Tom Stoltman|strongman real|57
Hércules|mitologia grega|66
Capitão América|Marvel|66
Homem-Aranha|Marvel|60
Pantera Negra|Marvel|61
Bane|DC|55
Batman|DC|38
Hulk|Marvel|92
Thor|Marvel|87
Thanos|Marvel|95
Colossus|Marvel|88
Juggernaut|Marvel|90
Superman|DC|94
Mulher-Maravilha|DC|82
Aquaman|DC|66
Shazam|DC|84
Darkseid|DC|97
Doomsday|DC|98
Lobo|DC|87
Omni-Man|Invincible|88
Homelander|The Boys|79
Soldier Boy|The Boys|72
Saitama|One-Punch Man|99
Garou|One-Punch Man|93
Goku|Dragon Ball|94
Vegeta|Dragon Ball|91
Broly|Dragon Ball|97
Jiren|Dragon Ball|96
Frieza|Dragon Ball|87
Kaido|One Piece|91
Big Mom|One Piece|86
Luffy|One Piece|78
Zoro|One Piece|68
Yujiro Hanma|Baki|82
Baki Hanma|Baki|65
All Might|My Hero Academia|85
Endeavor|My Hero Academia|70
Escanor|Nanatsu no Taizai|89
Meliodas|Nanatsu no Taizai|86
Kratos|God of War|91
Asura|Asura's Wrath|96
Doom Slayer|DOOM|94
Master Chief|Halo|58
Samus Aran|Metroid|55
Geralt de Rívia|The Witcher|48
Conan|Conan the Barbarian|54
`),
speed:parse(`
Pessoa muito lenta|referência humana|5
Caminhada normal|referência humana|18
Pessoa comum correndo|referência humana|25
Atleta treinado|desempenho humano|35
Usain Bolt|atletismo real|46
Michael Johnson|atletismo real|43
Florence Griffith-Joyner|atletismo real|43
Guepardo|animal real|50
Cavalo de corrida|animal real|44
Hawkeye|Marvel|35
Viúva Negra|Marvel|38
Capitão América|Marvel|48
Homem-Aranha|Marvel|62
Pantera Negra|Marvel|61
Wolverine|Marvel|50
Mercúrio|Marvel|92
Thor|Marvel|67
Flash|DC|99
Superman|DC|94
Mulher-Maravilha|DC|78
Zoom|DC|96
Reverse-Flash|DC|97
Kid Flash|DC|88
Quicksilver|Marvel|90
Sonic|Sonic the Hedgehog|95
Shadow|Sonic the Hedgehog|94
Metal Sonic|Sonic the Hedgehog|90
Goku|Dragon Ball|92
Vegeta|Dragon Ball|91
Whis|Dragon Ball|98
Beerus|Dragon Ball|93
Jiren|Dragon Ball|89
Frieza|Dragon Ball|84
Luffy|One Piece|65
Sanji|One Piece|70
Kizaru|One Piece|97
Minato Namikaze|Naruto|83
Might Guy|Naruto|84
Rock Lee|Naruto|68
Killua Zoldyck|Hunter × Hunter|73
Levi Ackerman|Attack on Titan|57
Zenitsu Agatsuma|Demon Slayer|72
Yoriichi Tsugikuni|Demon Slayer|86
Koro-sensei|Assassination Classroom|93
Saitama|One-Punch Man|89
Dante|Devil May Cry|86
Vergil|Devil May Cry|86
A-Train|The Boys|81
Dash|Os Incríveis|76
`),
intelligence:parse(`
Capacidade intelectual limitada|referência humana|12
Pessoa comum|referência humana|25
Leitor dedicado|humano|35
Estudante brilhante|humano|45
Professor universitário|humano|52
Alan Turing|pessoa real|63
Albert Einstein|pessoa real|64
Marie Curie|pessoa real|60
Isaac Newton|pessoa real|65
Leonardo da Vinci|pessoa real|67
Ada Lovelace|pessoa real|58
Carl Friedrich Gauss|pessoa real|66
Nikola Tesla|pessoa real|58
Sherlock Holmes|literatura|68
Mycroft Holmes|literatura|75
Hannibal Lecter|literatura/cinema|60
Batman|DC|67
Tony Stark|Marvel|82
Reed Richards|Marvel|94
Victor Von Doom|Marvel|90
Bruce Banner|Marvel|86
Charles Xavier|Marvel|88
Shuri|Marvel|83
Lex Luthor|DC|88
Brainiac|DC|97
Ozymandias|Watchmen|81
Riddler|DC|72
Light Yagami|Death Note|83
L|Death Note|92
Near|Death Note|80
Lelouch Lamperouge|Code Geass|88
Senku Ishigami|Dr. Stone|77
Bulma|Dragon Ball|72
Shikamaru Nara|Naruto|78
Itachi Uchiha|Naruto|75
Orochimaru|Naruto|82
Kisuke Urahara|Bleach|88
Mayuri Kurotsuchi|Bleach|86
Aizen|Bleach|91
Armin Arlert|Attack on Titan|69
Erwin Smith|Attack on Titan|73
Johan Liebert|Monster|76
Makima|Chainsaw Man|82
Shiro|No Game No Life|94
Sora|No Game No Life|88
Kurisu Makise|Steins;Gate|76
Rick Sanchez|Rick and Morty|98
The Doctor|Doctor Who|96
Q|Star Trek|99
Spock|Star Trek|76
Data|Star Trek|86
Thrawn|Star Wars|89
`),
combat:parse(`
Nunca lutou|referência humana|5
Briga de rua|experiência humana|18
Amador|experiência humana|25
Praticante iniciante|artes marciais|32
Praticante avançado|artes marciais|45
Bruce Lee|pessoa real|55
Miyamoto Musashi|figura histórica|62
Anderson Silva|pessoa real|62
Georges St-Pierre|pessoa real|63
Khabib Nurmagomedov|pessoa real|64
Muhammad Ali|pessoa real|55
Mike Tyson|pessoa real|58
Hattori Hanzo|figura histórica/lendária|56
Roronoa Zoro|One Piece|80
Dracule Mihawk|One Piece|88
Monkey D. Garp|One Piece|86
Sanji|One Piece|72
Levi Ackerman|Attack on Titan|75
Mikasa Ackerman|Attack on Titan|70
Guts|Berserk|84
Griffith|Berserk|78
Thorfinn|Vinland Saga|70
Thorkell|Vinland Saga|78
Kenshin Himura|Rurouni Kenshin|78
Shishio Makoto|Rurouni Kenshin|77
Hiei|Yu Yu Hakusho|86
Kurama|Yu Yu Hakusho|79
Sasuke Uchiha|Naruto|82
Itachi Uchiha|Naruto|84
Might Guy|Naruto|89
Rock Lee|Naruto|76
Madara Uchiha|Naruto|93
Aizen|Bleach|91
Ichigo Kurosaki|Bleach|84
Kenpachi Zaraki|Bleach|92
Byakuya Kuchiki|Bleach|83
Killua Zoldyck|Hunter × Hunter|78
Hisoka|Hunter × Hunter|80
Chrollo Lucilfer|Hunter × Hunter|83
Satoru Gojo|Jujutsu Kaisen|91
Toji Fushiguro|Jujutsu Kaisen|88
Sukuna|Jujutsu Kaisen|95
Tanjiro Kamado|Demon Slayer|73
Yoriichi Tsugikuni|Demon Slayer|96
Muzan Kibutsuji|Demon Slayer|90
All Might|My Hero Academia|88
Daredevil|Marvel|72
Shang-Chi|Marvel|84
Iron Fist|Marvel|82
Batman|DC|83
Deathstroke|DC|86
Nightwing|DC|78
Wonder Woman|DC|90
Deadpool|Marvel|76
Wolverine|Marvel|79
Doom Slayer|DOOM|91
Kratos|God of War|94
Dante|Devil May Cry|92
Vergil|Devil May Cry|92
`),
appearance:parse(`
aparência humana comum|realidade|10
rosto comum|realidade|15
rosto jovem|realidade|22
aparência atlética|realidade|30
porte imponente|realidade|38
beleza clássica|arquétipo artístico|45
beleza incomum|arquétipo artístico|52
traços delicados|arquétipo artístico|42
traços marcantes|arquétipo artístico|50
olhos heterocrômicos|traço real|45
cabelos prateados|fantasia|42
cabelos brancos naturais|realidade|35
cabelos vermelhos|estética|34
pele muito pálida|realidade|28
pele azulada|fantasia|48
pele metálica|ficção científica|55
chifres|fantasia|52
orelhas pontudas|fantasia|38
asas|fantasia/mitologia|62
cauda|fantasia|50
escamas|fantasia|58
marcas luminosas|fantasia|64
olhos brilhantes|fantasia|60
corpo parcialmente mecânico|ficção científica|64
corpo totalmente mecânico|ficção científica|72
corpo de sombra|fantasia|75
corpo de energia|ficção científica|80
forma espectral|folclore|65
forma angelical|mitologia|70
forma demoníaca|mitologia/fantasia|70
forma vampírica|folclore/literatura|55
forma lupina|folclore|54
forma de dragão|mitologia|86
forma colossal|mitologia/kaiju|84
aparência de elfo|fantasia|45
aparência de oni|folclore japonês|55
aparência de kitsune|folclore japonês|52
aparência de sereia|mitologia|48
aparência de golem|folclore|65
aparência de quimera|mitologia|62
aparência alienígena|ficção científica|55
aparência de androide|ficção científica|52
aparência de cyborg|ficção científica|60
aparência monstruosa|horror/fantasia|58
aparência etérea|fantasia|70
aparência cósmica|ficção científica|88
aparência impossível de classificar|ficção especulativa|95
`),
condition:parse(`
saúde muito frágil|realidade|5
saúde frágil|realidade|12
condição comum|realidade|25
boa saúde|realidade|35
boa constituição|realidade|42
excelente constituição|realidade|50
atleta saudável|realidade|55
resistência acima da média|realidade|60
resistência de atleta de elite|realidade|66
resistência de Capitão América|Marvel|72
resistência de Homem-Aranha|Marvel|70
resistência de Wolverine|Marvel|78
regeneração de Deadpool|Marvel|84
regeneração de Wolverine|Marvel|80
pele de aço|quadrinhos|78
corpo blindado|ficção científica|74
corpo de pedra|fantasia|80
corpo de metal|ficção científica|82
corpo de diamante|ficção|88
corpo praticamente indestrutível|ficção|94
regeneração extrema|ficção|92
imortalidade|mitologia/ficção|90
corpo de energia|ficção científica|88
existência espectral|fantasia|72
existência incorpórea|fantasia|78
resistência a fogo|fantasia|62
resistência a gelo|fantasia|62
resistência a veneno|fantasia|58
resistência a radiação|ficção científica|70
resistência ao vácuo|ficção científica|78
resistência temporal|ficção especulativa|92
resistência dimensional|ficção especulativa|94
corpo adaptativo|ficção científica|82
regeneração de Cell|Dragon Ball|90
regeneração de Majin Buu|Dragon Ball|91
resistência de Saiyajin|Dragon Ball|78
resistência de Kryptoniano|DC|90
resistência de Viltrumita|Invincible|88
resistência de Asgardiano|Marvel|76
resistência de Titã|mitologia|82
resistência de Dragão|fantasia|85
resistência de Kaiju|cinema|87
resistência de Superman|DC|95
resistência de Hulk|Marvel|96
resistência de Doomsday|DC|98
existência além de biologia|ficção especulativa|96
`),
talent:parse(`
nenhum talento excepcional|realidade|8
boa memória|realidade|25
boa coordenação|realidade|28
talento musical|realidade|35
talento artístico|realidade|35
talento matemático|realidade|38
talento científico|realidade|42
talento mecânico|realidade|40
talento para liderança|realidade|42
talento estratégico|realidade|50
talento para investigação|literatura/realidade|50
talento para furtividade|ficção|45
talento marcial|ficção|52
talento mágico|fantasia|58
talento alquímico|Fullmetal Alchemist|55
talento para Nen|Hunter × Hunter|58
talento para chakra|Naruto|55
talento para ki|Dragon Ball|60
talento para tecnologia|ficção científica|52
talento de inventor|ficção|60
talento de piloto|realidade/ficção|45
talento de detetive|literatura/cinema|52
talento de estrategista|ficção/história|58
talento de espadachim|ficção|62
talento de arqueiro|história/ficção|52
talento de sobrevivência|realidade|55
talento de adaptação|ficção científica|65
talento sobrenatural|fantasia|68
talento psíquico|ficção|70
talento de precognição|ficção|75
talento telepático|ficção|72
talento de manipulação|ficção|70
talento de estratégia militar|história/ficção|65
talento de gênio científico|ficção|78
talento de inventor impossível|ficção científica|85
talento de mestre marcial|ficção|80
talento de usuário de Stand|JoJo|72
talento de usuário de Geass|Code Geass|70
talento de usuário de magia|fantasia|65
talento de usuário de alquimia|Fullmetal Alchemist|62
talento de usuário de Quirk|My Hero Academia|60
talento de guerreiro lendário|mitologia/ficção|82
talento divino|mitologia|88
talento cósmico|ficção especulativa|94
talento aparentemente impossível|ficção especulativa|98
`),
weapons:parse(`
Nenhuma|sem equipamento|5
pedra|objeto comum|8
pau|objeto comum|10
canivete|objeto real|20
faca|objeto real|24
bastão|objeto real|22
arco simples|história|28
arco longo|história|34
besta|história|34
lança|história|35
espada curta|história|35
espada longa|história|40
sabre|história|38
rapieira|história|36
katana|história|42
nodachi|história|45
foice|história|34
machado|história|38
martelo de guerra|história|42
alabarda|história|44
manoplas|história/ficção|35
nunchaku|artes marciais|36
tonfa|artes marciais|38
kunai|Naruto/história japonesa|35
shuriken|história japonesa|35
chakram|história/cultura|36
chicote|objeto real|25
corrente|objeto real|27
escudo|história|32
mosquete|história|36
revólver|história|38
pistola|objeto real|38
espingarda|objeto real|40
rifle|objeto real|43
rifle de precisão|objeto real|50
metralhadora|ficção/realidade|50
canhão|história|50
lança-chamas|século XX|48
arma de plasma|ficção científica|62
rifle de energia|ficção científica|60
blaster|Star Wars|55
sabre de luz|Star Wars|72
Keyblade|Kingdom Hearts|68
Buster Sword|Final Fantasy VII|70
Masamune|tradição/ficção japonesa|62
Kusanagi|mitologia japonesa|68
Excalibur|lenda arturiana|78
Durandal|literatura medieval|70
Gram|mitologia nórdica|68
Gungnir|mitologia nórdica|78
Mjölnir|mitologia nórdica/Marvel|88
Stormbreaker|Marvel|84
Leviathan Axe|God of War|78
Blades of Chaos|God of War|80
Master Sword|The Legend of Zelda|72
Hylian Shield|The Legend of Zelda|58
Moonlight Greatsword|Dark Souls|72
Dragonslayer|Berserk|70
Nichirin Sword|Demon Slayer|60
Zangetsu|Bleach|76
Tensa Zangetsu|Bleach|84
Samehada|Naruto|72
Kubikiribocho|Naruto|60
Spear of Longinus|Evangelion|82
Death Note|Death Note|74
Green Lantern Ring|DC|90
Infinity Gauntlet|Marvel|99
Lasso of Truth|DC|68
Portal Gun|Rick and Morty|75
Gravity Gun|Half-Life|65
Energy Sword|Halo|62
Hidden Blade|Assassin's Creed|48
Wabbajack|The Elder Scrolls|75
Daedric Artifact|The Elder Scrolls|78
Narsil|Tolkien|62
Sting|Tolkien|55
Andúril|Tolkien|70
Vorpal Sword|literatura fantástica|68
Trident of Poseidon|mitologia grega|76
Sword of Gryffindor|Harry Potter|65
Elder Wand|Harry Potter|82
Darksaber|Star Wars|74
`),
power:parse(`
visão noturna|ficção|18
olfato sobrenatural|ficção|22
respirar debaixo d'água|fantasia|20
comunicação com animais|fantasia|25
regeneração|fantasia|55
regeneração de Wolverine|Marvel|70
regeneração de Deadpool|Marvel|78
invisibilidade|ficção|45
intangibilidade|ficção|60
telepatia|ficção|60
telepatia de Professor X|Marvel|82
telecinese|ficção|58
telecinese de Jean Grey|Marvel|90
precognição|ficção|62
controle mental|ficção|68
teletransporte|ficção|70
teletransporte de Minato|Naruto|78
viagem no tempo|ficção científica|78
viagem no tempo de Doctor Who|Doctor Who|90
manipulação temporal|ficção|92
manipulação gravitacional|ficção|82
manipulação de matéria|ficção científica|84
manipulação de energia|ficção científica|76
manipulação de realidade|ficção|97
manipulação de causalidade|ficção|99
manipulação de probabilidade|ficção|88
controle de fogo|mitologia/fantasia|45
controle de gelo|fantasia|48
controle de água|mitologia/fantasia|44
controle de vento|mitologia/fantasia|46
controle de terra|mitologia/fantasia|44
controle de relâmpago|mitologia/fantasia|55
controle de eletricidade|ficção|62
controle de metal|ficção|58
controle de plantas|fantasia|38
controle de sangue|fantasia/horror|68
controle de sombras|fantasia|58
controle de luz|fantasia|62
controle de trevas|fantasia|65
necromancia|fantasia|70
invocação|fantasia|60
selamento|fantasia/anime|62
criação de construtos|fantasia|58
alquimia|Fullmetal Alchemist|62
Nen|Hunter × Hunter|70
Chakra|Naruto|65
Ki|Dragon Ball|72
Haki|One Piece|70
Stand|JoJo's Bizarre Adventure|74
Bankai|Bleach|82
Geass|Code Geass|76
Magenkyō Sharingan|Naruto|80
Rinnegan|Naruto|90
One For All|My Hero Academia|82
All For One|My Hero Academia|88
Respiração do Sol|Demon Slayer|72
Energia Amaldiçoada|Jujutsu Kaisen|68
Seis Olhos|Jujutsu Kaisen|92
Limitless|Jujutsu Kaisen|90
Domain Expansion|Jujutsu Kaisen|86
Time Stop|JoJo's Bizarre Adventure|88
The World|JoJo's Bizarre Adventure|88
Star Platinum|JoJo's Bizarre Adventure|84
Hamon|JoJo's Bizarre Adventure|55
Dark Phoenix|Marvel|97
Chaos Magic|Marvel|96
Reality Stone|Marvel|98
Phoenix Force|Marvel|99
Speed Force|DC|99
Lantern constructs|DC|75
Omega Effect|DC|98
Heat Vision|DC|72
Freeze Breath|DC|58
Spider-Sense|Marvel|50
Web-shooters|Marvel|42
Adamantium skeleton|Marvel|70
Symbiote bond|Marvel|68
Super Saiyan|Dragon Ball|80
Ultra Instinct|Dragon Ball|98
Ultra Ego|Dragon Ball|94
Devil Fruit|One Piece|60
Ope Ope no Mi|One Piece|84
Hito Hito no Mi Model Nika|One Piece|96
Quirk: Explosion|My Hero Academia|60
Quirk: Erasure|My Hero Academia|68
Quirk: Decay|My Hero Academia|80
Quirk: Rewind|My Hero Academia|90
Bending de água|Avatar|52
Bending de fogo|Avatar|52
Bending de terra|Avatar|54
Bending de ar|Avatar|54
Avatar State|Avatar|84
Reality Warping|ficção|98
Cosmic Awareness|quadrinhos|94
Omnipresence|ficção metafísica|99
Omniscience|ficção metafísica|99
`),
races:parse(`
Humano|realidade|10
Elfo|fantasia|30
Elfo Negro|fantasia|35
Anão|fantasia|25
Orc|fantasia|32
Goblin|folclore/fantasia|20
Troll|folclore|38
Ogro|folclore|38
Gigante|mitologia|55
Fada|folclore|32
Draconiano|fantasia|58
Dragão|mitologia/fantasia|88
Vampiro|folclore/literatura|55
Lobisomem|folclore|55
Demônio|mitologia/ficção|65
Anjo|tradições abraâmicas|65
Serafim|tradições abraâmicas|82
Semideus|mitologias|78
Deus|mitologias|95
Espírito|mitologia|45
Fantasma|folclore|30
Yōkai|folclore japonês|48
Kitsune|folclore japonês|50
Oni|folclore japonês|52
Shinigami|Bleach/folclore japonês|62
Hollow|Bleach|60
Quincy|Bleach|52
Homúnculo|Fullmetal Alchemist|55
Ciborgue|ficção científica|42
Androide|ficção científica|44
Alienígena|ficção científica|30
Mutante|Marvel|42
Metamorfo|fantasia|44
Elemental|fantasia|60
Golem|folclore|55
Titã|mitologia|82
Fênix|mitologia|85
Quimera|mitologia|48
Centauro|mitologia|35
Sereia|mitologia|35
Tritão|mitologia|35
Ninfa|mitologia|30
Dríade|mitologia|38
Minotauro|mitologia|48
Medusa|mitologia|52
Sátiro|mitologia|28
Naga|mitologia asiática|44
Djinn|folclore árabe|65
Ifrit|folclore árabe|72
Jinn|folclore árabe|62
Rakshasa|mitologia hindu|70
Asura|mitologia hindu/budista|72
Valkyrie|mitologia nórdica|70
Gigante de Gelo|mitologia nórdica|68
Gigante de Fogo|mitologia nórdica|72
Banshee|folclore irlandês|48
Dullahan|folclore irlandês|52
Leprechaun|folclore irlandês|20
Kelpie|folclore escocês|35
Grifo|mitologia/folclore|55
Harpia|mitologia grega|38
Súcubo|folclore europeu|50
Íncubo|folclore europeu|50
Ghoul|Tokyo Ghoul / folclore|38
Kaiju|cinema japonês|80
Saiyajin|Dragon Ball|72
Namekuseijin|Dragon Ball|48
Kryptoniano|DC|92
Viltrumita|Invincible|82
Asgardiano|Marvel|70
Atlante|DC/mitologia|45
Amazonas|mitologia/ficção|48
Metahumano|DC|52
Inumano|Marvel|55
Eternos|Marvel|80
Celestial|Marvel|99
Symbiote|Marvel|65
Guardião de Oa|DC|75
Kree|Marvel|42
Skrull|Marvel|42
Twi’lek|Star Wars|28
Wookiee|Star Wars|40
Vulcano|Star Trek|38
Klingon|Star Trek|45
Time Lord|Doctor Who|82
Dalek|Doctor Who|72
Cyberman|Doctor Who|55
Replicante|Blade Runner|32
Cylon|Battlestar Galactica|42
Predador|Predator|58
Zerg|StarCraft|62
Protoss|StarCraft|72
Terrano|StarCraft|20
Esper|ficção científica|55
Psíquico|ficção|55
Híbrido Saiyajin|Dragon Ball|82
Meio-demônio|fantasia|55
Meio-dragão|fantasia|62
Vampiro ancestral|fantasia|68
Deus Antigo|horror cósmico|92
Entidade Cósmica|ficção especulativa|98
Entidade Abstrata|ficção metafísica|99
`),
titles:parse(`
Ninguém|humano|5
Camponês|história|8
Artesão|história|15
Mercador|história|18
Viajante|história|20
Explorador|história|25
Caçador|história|28
Aventureiro|fantasia|30
Guarda|história|28
Soldado|história|32
Cavaleiro|história|38
Mercenário|história/ficção|35
Ladrão|história/ficção|28
Assassino|história/ficção|48
Espião|história/ficção|50
Batedor|história|30
Monge|história/religião|34
Sacerdote|religião/ficção|30
Curandeiro|história/fantasia|35
Alquimista|história/fantasia|48
Mago|fantasia|52
Feiticeiro|fantasia|55
Invocador|fantasia|55
Necromante|fantasia|62
Duelista|história/ficção|52
Espadachim|história/ficção|50
Arqueiro|história/ficção|42
Capitão|história/ficção|48
Comandante|história|58
General|história|62
Almirante|história|60
Rei|história/mitologia|65
Rainha|história/mitologia|65
Príncipe|história/ficção|48
Princesa|história/ficção|48
Imperador|história|72
Imperatriz|história|72
Duque|história|44
Soberano|história/ficção|65
Campeão|história/ficção|58
Herói|mitologia/ficção|60
Anti-herói|ficção|55
Vilão|ficção|55
Senhor da Guerra|história/ficção|68
Lorde Demônio|fantasia|80
Profeta|religião/ficção|60
Oráculo|mitologia|62
Guardião|mitologia/ficção|50
Arauto|mitologia/ficção|52
Executor|ficção|55
Escolhido|ficção|62
Reencarnado|anime/mangá|58
Avatar|religião/ficção|68
Mestre|ficção|55
Lenda|ficção|65
Monarca|história|70
Soberano Celestial|fantasia|85
Soberano Abissal|fantasia|85
Deus Vivo|mitologia/ficção|94
Entidade Suprema|ficção metafísica|99
Mestre de Guilda|RPG/fantasia|50
Líder de Clã|história/ficção|48
Comandante de Esquadrão|ficção|55
Agente Secreto|ficção|50
Detetive|literatura/cinema|45
Cientista|realidade|40
Engenheiro|realidade|38
Inventor|ficção|48
Piloto|realidade/ficção|38
Professor|realidade|35
Estudante|realidade|20
Atleta|realidade|35
Gladiador|história|48
Campeão Mundial|esporte|55
Mestre de Artes Marciais|história/ficção|62
Juiz|realidade|25
Carrasco|história|35
Regente|história|45
Fundador|história/ficção|55
Conquistador|história/ficção|68
Rei dos Monstros|ficção|82
Imperador Galáctico|ficção científica|88
Comandante Supremo|ficção|75
Guardião de Portal|fantasia|68
Mestre de Espadas|ficção|72
Mestre de Magia|fantasia|76
Mestre de Nen|Hunter × Hunter|75
Mestre de Chakra|Naruto|72
Mestre de Ki|Dragon Ball|78
`),
age:parse(`
Recém-nascido|realidade|5
1 ano|realidade|8
3 anos|realidade|10
5 anos|realidade|12
8 anos|realidade|15
10 anos|realidade|18
12 anos|realidade|20
15 anos|realidade|25
16 anos|realidade|27
17 anos|realidade|29
18 anos|realidade|32
20 anos|realidade|35
25 anos|realidade|40
30 anos|realidade|44
40 anos|realidade|48
50 anos|realidade|52
60 anos|realidade|55
70 anos|realidade|58
80 anos|realidade|60
100 anos|fantasia|62
150 anos|fantasia|65
300 anos|fantasia|70
500 anos|fantasia|74
1.000 anos|fantasia|78
5.000 anos|fantasia|82
10.000 anos|fantasia|86
100.000 anos|ficção|92
1 milhão de anos|ficção|96
Idade desconhecida|ficção|55
Existe fora do tempo|ficção metafísica|99
`),
life:parse(`
Vida completamente comum|realidade|10
Vida tranquila|realidade|20
Vida de estudante|realidade|22
Vida profissional comum|realidade|25
Vida de atleta|realidade|32
Vida de aventureiro|fantasia|42
Vida de mercenário|ficção|45
Vida de caçador|história/ficção|38
Vida de guerreiro|história/ficção|48
Vida de nobre|história|42
Vida de rei|história/ficção|55
Vida de fugitivo|ficção|50
Vida de sobrevivente|ficção|55
Vida de herói|mitologia/ficção|65
Vida de vilão|ficção|60
Vida trágica|literatura/ficção|58
Vida marcada por guerra|história/ficção|55
Vida de lenda|ficção|72
Vida mítica|mitologia|80
Vida divina|mitologia|88
Vida cósmica|ficção científica|94
Vida sem precedentes|ficção especulativa|99
`)
};

const first=`Aarav|India
Akira|Japão
Aiko|Japão
Amara|África/Índia
Amelia|Europa
Anika|Índia
Arjun|Índia
Arthur|Europa
Aya|Japão
Ayumi|Japão
Beatriz|Brasil
Bruno|Brasil
Cassian|Europa
Celine|Europa
Clara|Europa
Daichi|Japão
Dante|Europa
Diego|Espanha/América Latina
Elias|Europa
Elena|Europa
Emi|Japão
Emilia|Europa
Evelyn|Europa
Félix|Europa
Freya|nórdico
Gabriel|Brasil/Europa
Hana|Japão
Haru|Japão
Haruki|Japão
Hector|Grécia
Helena|Grécia
Hugo|Europa
Ibrahim|Oriente Médio
Iris|Grécia
Isabella|Europa
Ivan|Rússia
Jasper|Europa
Jin|Coreia/China/Japão
Jun|Japão
Kael|ficção
Kai|várias culturas
Kaito|Japão
Kara|Europa
Katsuki|Japão
Kazuki|Japão
Kenji|Japão
Kieran|Irlanda
Kira|Japão/Europa
Klaus|Europa
Kohaku|Japão
Lara|Europa
Layla|Oriente Médio
Leandro|Grécia/América Latina
Levi|Europa
Liam|Europa
Lina|Europa
Lucian|Europa
Luna|latim
Maya|várias culturas
Mei|China/Japão
Mia|Europa
Mika|Japão/Europa
Milo|Europa
Mira|Europa
Naomi|Hebraico/Japão
Nikolai|Rússia
Nora|Europa
Noah|Hebraico
Oliver|Europa
Rafael|Brasil/Europa
Ren|Japão
Rei|Japão
Rin|Japão
Riven|ficção
Ryu|Japão
Sabrina|Europa
Samir|Oriente Médio
Sasha|Europa
Selene|Grécia
Shin|Japão
Shiro|Japão
Sofia|Europa
Sora|Japão
Soren|nórdico
Theo|Europa
Valen|ficção/Europa
Valentina|América Latina
Viktor|Europa
William|Europa
Xavier|Europa
Yuki|Japão
Yuna|Japão
Zara|Oriente Médio/Europa
Zayn|Oriente Médio
Zoe|Europa`;

const last=`Aoki|Japão
Arai|Japão
Arakawa|Japão
Ashford|ficção/Europa
Blackwood|Europa/ficção
Bennett|Inglaterra
Bianchi|Itália
Blanc|França
Carvalho|Portugal/Brasil
Castro|Espanha/América Latina
Cavalcanti|Itália/Brasil
Costa|Portugal/Brasil
Cruz|Europa/América Latina
Dubois|França
Everett|Inglaterra
Fischer|Europa
Frost|Europa/ficção
Garcia|Espanha
Grimm|Alemanha/folclore
Hale|Inglaterra
Hayashi|Japão
Henderson|Escócia/Inglaterra
Ishikawa|Japão
Ivanov|Rússia
Khan|Ásia
Kobayashi|Japão
Kovacs|Europa Central
Kurosawa|Japão
Laurent|França
Mercer|Inglaterra
Miller|Inglaterra
Mori|Japão
Moreau|França
Navarro|Espanha
Nightingale|Inglaterra
Okada|Japão
Park|Coreia
Petrov|Rússia
Reyes|Espanha/América Latina
Rossi|Itália
Sato|Japão
Silva|Brasil/Portugal
Sterling|Inglaterra
Stone|Inglaterra
Suzuki|Japão
Takeda|Japão
Tanaka|Japão
Vale|Europa/ficção
Volkov|Rússia
Walker|Inglaterra
Watanabe|Japão
Weber|Alemanha
White|Inglaterra
Yamamoto|Japão
Yoshida|Japão
Ziegler|Alemanha`;

const namesA=first.split("\n").map(x=>x.split("|")[0]);
const namesB=last.split("\n").map(x=>x.split("|")[0]);
const lib=a=>a.map(x=>[x.name,x.value,x.ref]);

/* V12.1 — instalação defensiva.
   IMPORTANTE:
   engine.js declara `RV` e library.js declara `LIBRARY` como bindings globais
   (const), não como propriedades de window. A V12 original usava window.RV,
   portanto quebrava antes mesmo de instalar o motor de referências.
*/
function installReferenceEngine(){
  // Se o script tiver sido colocado antes do engine/app, espera o próximo tick.
  if(typeof RV==="undefined" || !RV || typeof RV.draw!=="function"){
    setTimeout(installReferenceEngine,0);
    return;
  }

  const originalDraw=RV.draw.bind(RV);

  RV.draw=key=>DATA[key] ? pick(DATA[key]) : originalDraw(key);
  RV.race=()=>{
    const x=pick(DATA.races);
    x.rank=Math.max(1,Math.min(11,Math.round(x.value/9)));
    return x;
  };
  RV.power=()=>pick(DATA.power);
  RV.name=()=>`${namesA[randomIndex(namesA.length)]} ${namesB[randomIndex(namesB.length)]}`;
  RV.yesPower=()=>RV.randomInt(100)<70;

  // LIBRARY também é um binding global, não necessariamente window.LIBRARY.
  if(typeof LIBRARY!=="undefined" && LIBRARY){
    for(const k of ["titles","age","races","weapons","force","speed","intelligence","combat","appearance","condition","talent","life"]){
      const key=k==="age"?"ages":k;
      if(DATA[k]) LIBRARY[key]=lib(DATA[k]);
    }
  }

  globalThis.RV12={
    version:"12.1.0",
    randomModel:"independent-with-replacement",
    equalWeight:true,
    antiRepeat:false,
    hiddenWeights:false,
    combinationsPreserved:true,
    sizes:Object.fromEntries(Object.entries(DATA).map(([k,v])=>[k,v.length]))
  };

  console.info("[Roleta da Vida] V12.1 ativa:",globalThis.RV12);
}

installReferenceEngine();
})();
