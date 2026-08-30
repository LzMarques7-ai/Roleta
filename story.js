/* ROULETA DA VIDA V8 — gerador de passado.
   Usa uma gramática de storylets: eventos têm função, consequência e ligação.
   A história só é construída depois do último giro. */
const STORY={
  origins:[
   ['Nascido em uma comunidade isolada','cresceu cercado por regras que não compreendia.'],
   ['Nascido no centro de uma cidade movimentada','aprendeu cedo que sobreviver também era saber ler as pessoas.'],
   ['Filho de uma família influente','teve acesso a privilégios que também trouxeram inimigos.'],
   ['Nascido em meio a uma guerra','conheceu a violência antes de entender por que ela existia.'],
   ['Encontrado ainda bebê','cresceu com uma pergunta que ninguém conseguia responder: de onde veio?'],
   ['Criado por alguém de outra espécie','aprendeu a viver entre dois mundos sem pertencer totalmente a nenhum.'],
   ['Nascido em uma época de paz','viu a própria vida mudar quando a paz acabou.'],
   ['Nascido em um lugar considerado amaldiçoado','cresceu ouvindo que sua existência era um mau presságio.'],
   ['Nascido entre estudiosos e pesquisadores','foi educado para observar antes de agir.'],
   ['Nascido entre guerreiros','foi treinado antes mesmo de poder escolher seu próprio caminho.']
  ],
  childhood:[
   'Um adulto importante desapareceu de sua vida sem deixar explicações.',
   'Uma promessa feita na infância passou a definir várias de suas escolhas.',
   'Descobriu que sua origem escondia uma verdade que os adultos tentavam proteger.',
   'Foi subestimado durante anos e aprendeu a transformar isso em combustível.',
   'Encontrou alguém que se tornou seu primeiro verdadeiro aliado.',
   'Cometeu um erro que não podia ser desfeito e precisou conviver com a consequência.',
   'Foi obrigado a abandonar o lugar onde cresceu.',
   'Presenciou um acontecimento que mudou para sempre sua visão do mundo.',
   'Passou anos tentando provar que era capaz de fazer algo que todos julgavam impossível.'
  ],
  turning:[
   'Tudo mudou quando um inimigo poderoso entrou em sua vida.',
   'A virada veio quando precisou escolher entre salvar alguém e proteger a si mesmo.',
   'Sua vida mudou quando descobriu que uma pessoa em quem confiava havia mentido.',
   'Um acidente revelou uma capacidade que estava adormecida.',
   'Uma derrota pública destruiu a imagem que tinha de si mesmo.',
   'Uma perda transformou uma ambição antiga em uma necessidade.',
   'Recebeu uma oportunidade que parecia boa demais para ser verdadeira.',
   'Foi perseguido por algo que nem sequer entendia.',
   'Descobriu que seu maior rival possuía uma ligação inesperada com seu passado.'
  ],
  awakening:[
   'O poder apareceu de forma violenta e deixou uma marca permanente.',
   'O poder surgiu em um momento de medo, quando seu corpo reagiu antes de sua mente.',
   'A habilidade foi despertada após anos de treinamento e fracassos.',
   'A manifestação foi silenciosa, mas mudou a forma como todos ao redor o enxergavam.',
   'O despertar aconteceu quando já não havia outra saída.',
   'A capacidade veio acompanhada de uma consequência que ninguém havia previsto.'
  ],
  cost:[
   'A vitória teve um preço: alguém importante deixou de confiar nele.',
   'Para seguir adiante, precisou abandonar uma parte da vida que conhecia.',
   'O novo poder resolveu um problema e criou dois outros.',
   'A fama trouxe atenção indesejada e transformou antigos aliados em possíveis ameaças.',
   'A escolha salvou uma vida, mas fechou para sempre uma porta.',
   'Quanto mais forte ficou, mais difícil se tornou voltar a uma vida normal.'
  ],
  present:[
   'Hoje, busca uma resposta que ainda não encontrou.',
   'Hoje, quer impedir que outra pessoa passe pelo que passou.',
   'Hoje, procura alguém que desapareceu de seu passado.',
   'Hoje, tenta descobrir até onde seu próprio potencial pode chegar.',
   'Hoje, vive entre o desejo de poder e o medo de se tornar aquilo que combate.',
   'Hoje, carrega uma promessa que ainda não cumpriu.',
   'Hoje, está diante de uma escolha que pode mudar seu futuro novamente.'
  ]
};
function sPick(list){return RNG.pick(list)}
function storySentence(p){
  const race=label(p.race).toLowerCase(), title=label(p.title).toLowerCase(), age=label(p.age).toLowerCase();
  const power=p.hasPower?`Seu despertar revelou ${label(p.power).toLowerCase()}, uma habilidade associada a ${p.power.ref||'tradições de fantasia e ficção'}.`:'Seu caminho não dependeu de um poder sobrenatural.';
  const weapon=label(p.weapon);
  return `${p.name} é ${race} e carrega o título de ${title}. Aos ${age}, ${power} ${weapon!=='Nenhuma'?`Aprendeu a lutar usando ${weapon.toLowerCase()}.`:''}`;
}
function makeStory(p,personality){
  const [origin,originDetail]=sPick(STORY.origins);
  const childhood=sPick(STORY.childhood);
  const turning=sPick(STORY.turning);
  const awakening=p.hasPower?sPick(STORY.awakening):sPick(['Em vez de despertar um poder, precisou desenvolver disciplina e técnica para sobreviver.','Sua maior evolução veio do treinamento, não de uma habilidade sobrenatural.']);
  const cost=sPick(STORY.cost);
  const present=sPick(STORY.present);
  const intro=storySentence(p);
  const personalityLine=`Sua personalidade se tornou ${personality.trait.toLowerCase()}; seu ideal é ${personality.ideal.toLowerCase()}, mas ${personality.flaw.toLowerCase()}.`;
  return [
   intro,
   `${origin}. ${originDetail}`,
   childhood,
   turning,
   awakening,
   cost,
   personalityLine,
   `${present} Seu objetivo é ${personality.goal.toLowerCase()}, enquanto seu maior medo é ${personality.fear.toLowerCase()}.`
  ];
}
function makePersonality(){
  return {
   alignment:RNG.pick(ALIGNMENTS), trait:RNG.pick(PERSONALITY_TRAITS), ideal:RNG.pick(IDEALS),
   flaw:RNG.pick(FLAWS), goal:RNG.pick(GOALS), fear:RNG.pick(FEARS)
  };
}
