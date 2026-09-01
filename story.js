/* ROULETA DA VIDA V19 — NARRATIVE DIRECTOR
   Não é um LLM externo: é síntese local baseada nos resultados sorteados.
   A função é explicar o personagem e, principalmente, explicar suas referências.
*/
(()=>{
'use strict';
const lower=x=>String(x||'').toLowerCase();
const joinRefs=refs=>Object.entries(refs||{}).filter(([k])=>!['name','hasPower'].includes(k)).map(([k,v])=>({k,v}));
function make(forge){
 const p=forge.p, r=forge.rarity, per=forge.personality;
 const race=p.race.name,title=p.title.name,age=p.age.name,appearance=p.appearance.name,condition=p.condition.name;
 const power=p.hasPower.name==='Sim'?p.power.name:'nenhum poder';
 const opening=p.life.name==='Tranquila'?`A vida de ${p.name.name} começou de forma relativamente estável, mas a combinação sorteada escondia um potencial incomum.`:
   p.life.name==='Trágica'?`A existência de ${p.name.name} já nasceu sob o signo das consequências. A vida sorteada como ${p.life.name.toLowerCase()} fez cada característica pesar mais.`:
   `Desde o começo, ${p.name.name} parecia reunir peças que normalmente não apareceriam na mesma pessoa.`;
 const capability=`Sua força veio como ${p.force.name}; sua velocidade, como ${p.speed.name}; sua inteligência, como ${p.intelligence.name}; e seu combate, como ${p.combat.name}. O talento central foi ${p.talent.name}.`;
 const identity=`Fisicamente, ${p.name.name} apresenta ${appearance} e ${condition}. O título ${title} muda a forma como o mundo tende a tratá-lo, enquanto a raça ${race} estabelece o ponto de partida de sua existência.`;
 const ability=p.hasPower.name==='Sim'?`O salto mais evidente veio com ${power}. O controle sorteado foi ${p.control.name}, então possuir a habilidade não significa automaticamente utilizá-la com perfeição.`:`O sorteio também decidiu que não haveria poder sobrenatural. Isso força a identidade do personagem a nascer da combinação entre corpo, talento, inteligência, combate, equipamento e escolhas.`;
 const path=`Com uma vida ${lower(p.life.name)}, ${p.name.name} tende a ser moldado por ${per.trait}. Busca ${per.ideal}, esbarra em ${per.flaw}, persegue ${per.goal} e evita ${per.fear}.`;
 const references=joinRefs(forge.refs).filter(x=>x.v?.type!=='sistema de nomes').map(({k,v})=>`**${label(k)}:** ${v.name} — referência em ${v.type}. ${v.why}.`);
 const summary=`A classificação final foi ${r.name} (${r.stars}/9). Ela não veio de um único resultado: o sistema observa a combinação, a quantidade de características excepcionais, extremos e sinergias.`;
 return {paragraphs:[opening,identity,capability,ability,path,summary],references};
}
function label(k){return ({race:'Raça',title:'Título',appearance:'Aparência',age:'Idade',condition:'Condição',force:'Força',speed:'Velocidade',intelligence:'Inteligência',combat:'Combate',talent:'Talento',power:'Poder',control:'Domínio',weapons:'Arma/equipamento',life:'Tipo de vida'}[k]||k);}
window.STORY_ENGINE={make};
})();
