/* História: construída somente depois dos 16 giros.
   A roleta define QUEM ele é; esta camada define COMO chegou até ali.
*/
const STORY_ENGINE=(()=>{
  const R=RV.randomInt, P=(a)=>a[R(a.length)];
  const common=[
    "viveu uma infância relativamente estável e aprendeu cedo a observar o mundo antes de agir.",
    "cresceu cercado por pessoas que tinham expectativas muito diferentes sobre quem deveria se tornar.",
    "passou boa parte da juventude tentando entender por que parecia diferente dos demais.",
    "aprendeu suas primeiras lições com as pessoas mais próximas, antes de descobrir que seu mundo era maior do que imaginava."
  ];
  const hardship=[
    "um período difícil obrigou-o a amadurecer antes da hora.",
    "uma escolha aparentemente pequena acabou mudando o rumo de sua vida.",
    "uma pessoa importante se afastou e deixou uma pergunta que nunca desapareceu completamente.",
    "um fracasso ensinou que possuir capacidade não significava saber usá-la."
  ];
  const power=[
    "Quando sua capacidade se tornou evidente, a reação dos outros foi tão importante quanto a própria habilidade.",
    "O domínio dessa característica não aconteceu de uma vez; ele precisou aprender seus limites e conviver com as consequências de cada tentativa.",
    "Por algum tempo, tentou esconder aquilo que o diferenciava. A estratégia funcionou até o dia em que já não foi possível continuar escondendo.",
    "O poder não resolveu sua vida. Ele apenas aumentou as possibilidades — e também os problemas."
  ];
  const noPower=[
    "Sem uma habilidade sobrenatural para resolver seus problemas, precisou depender de disciplina, inteligência, talento e das próprias escolhas.",
    "Sua ausência de poderes acabou moldando uma personalidade mais prática: cada avanço precisou ser conquistado.",
    "Aquilo que lhe faltava em poder extraordinário foi compensado, pouco a pouco, por experiência e adaptação."
  ];
  const endings=[
    "Hoje, sua maior questão não é descobrir quem poderia ser, mas decidir o que fazer com aquilo que já se tornou.",
    "A vida ainda não chegou ao fim de seu arco; existe uma parte da história que depende das próximas escolhas.",
    "O passado explica suas marcas, mas não determina sozinho o que acontecerá a seguir."
  ];
  function make(p, personality){
    const life=(p.life?.name||"Comum").toLowerCase();
    let opening;
    if(life==="comum"||life==="tranquila") opening="Apesar de sua natureza incomum, sua vida seguiu por muito tempo um caminho relativamente normal.";
    else if(life==="trágica") opening="Sua existência foi marcada por acontecimentos que deixaram consequências profundas.";
    else if(life==="caótica"||life==="imprevisível") opening="Poucas coisas em sua vida aconteceram de maneira previsível.";
    else opening="Desde cedo, sua existência pareceu destinada a produzir acontecimentos que ultrapassavam uma vida comum.";
    const race=`Nasceu como ${p.race.name}${p.origin?`, em uma origem ligada a ${p.origin.name.toLowerCase()}`:""}.`;
    const age=`Chegou à idade de ${p.age.name.toLowerCase()} carregando ${p.title.name.toLowerCase()} como título ou posição.`;
    const body=`Sua aparência — ${p.appearance.name} — fazia com que as pessoas formassem opiniões sobre ele antes mesmo de conhecê-lo.`;
    const growth=`Seu desenvolvimento foi influenciado por uma condição física descrita como ${p.condition.name.toLowerCase()}, enquanto seu talento principal se aproximava de ${p.talent.name.toLowerCase()}.`;
    const turning=P(hardship);
    const ability=p.hasPower?P(power):P(noPower);
    const control=p.hasPower?`Aprender a lidar com ${p.power.name.toLowerCase()} exigiu ${p.control.name.toLowerCase()}.`:`Sua evolução veio de ${p.combat.name.toLowerCase()} e de sua capacidade de adaptação.`;
    const weapon=p.weapon.name==="Nenhuma"?"Não dependia de uma arma para definir sua identidade.":`Quando precisava lutar, recorria a ${p.weapon.name.toLowerCase()}.`;
    const personalityLine=`Com o tempo, tornou-se ${personality.trait.toLowerCase()}, guiado por ${personality.ideal.toLowerCase()}, mas marcado por ${personality.flaw.toLowerCase()}.`;
    const present=`Seu objetivo passou a ser ${personality.goal.toLowerCase()}, enquanto ${personality.fear.toLowerCase()} continuava sendo uma possibilidade que evitava encarar.`;
    return [opening,race,age,body,growth,turning,ability,control,weapon,personalityLine,present,P(endings)];
  }
  return {make};
})();
