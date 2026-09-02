/* ROULETA DA VIDA — CHARACTER INTELLIGENCE
   Resolve o banco estruturado em um perfil visual.
   Não intercepta outros módulos e não usa API externa.
*/
(()=> {
'use strict';

const norm = x => String(x ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const uniq = a => [...new Set(a.filter(Boolean))];

function readItem(x){
  if(!x) return {text:'',tags:[],visual:{}};
  const text = norm([
    x.name, x.ref, x.refType, x.refWhy, x.description,
    typeof x.tags === 'string' ? x.tags : Array.isArray(x.tags) ? x.tags.join(' ') : ''
  ].join(' '));
  const tags = uniq([
    ...(typeof x.tags === 'string' ? x.tags.split(',').map(norm) : (x.tags||[]).map(norm)),
    ...Object.keys(x.visual||{}).map(norm),
    ...Object.values(x.visual||{}).map(v=>norm(v))
  ]);
  return {text,tags,visual:x.visual||{}};
}

function profile(p){
  const items = Object.entries(p||{}).map(([slot,value])=>({slot,...readItem(value)}));
  const text = items.map(x=>x.text).join(' ');
  const tags = uniq(items.flatMap(x=>x.tags));
  const has = (...q) => q.some(v=>text.includes(norm(v)) || tags.some(t=>t.includes(norm(v))));

  const species =
    has('dragão','dragon') ? 'dragon' :
    has('sereia','mermaid','tritão','merfolk') ? 'merfolk' :
    has('anjo','angel','serafim') ? 'angel' :
    has('demônio','demon','oni') ? 'demon' :
    has('golem') ? 'golem' :
    has('ciborgue','cyborg','androide','android') ? 'cyber' :
    has('espírito','spirit','shinigami') ? 'spirit' :
    has('vampiro','vamp') ? 'vamp' :
    has('lobisomem','werewolf') ? 'beast' :
    has('elfo','elf') ? 'elf' : 'human';

  const power =
    has('fogo','fire','chama','phoenix','fênix') ? 'fire' :
    has('gelo','ice','frost','glacial') ? 'ice' :
    has('eletric','electric','lightning','trovão','raio') ? 'lightning' :
    has('água','water','oceano','ocean','sereia','tritão') ? 'water' :
    has('trevas','dark','shadow','sombra','demon') ? 'dark' :
    has('luz','light','holy','divino','celestial','angel') ? 'light' :
    has('cósmico','cosmic','galáctico','galactic','space','univers') ? 'cosmic' :
    has('tecnologia','tech','cyber','android') ? 'tech' :
    has('magia','magic','mago','mage','alquimia','alchemy') ? 'magic' :
    has('natureza','nature','floresta','forest') ? 'nature' : 'neutral';

  const body =
    has('giant','gigante','titan','titã','kaiju','colossal') ? 'towering' :
    has('muscle','muscular','strongman','strong','forte','hulk') ? 'muscular' :
    has('athletic','atlético','atleta') ? 'athletic' :
    has('slim','delicado','graceful') ? 'graceful' : 'balanced';

  const clothing =
    has('imperador','imperatriz','rei','rainha','royal','regal') ? 'royal' :
    has('sacerdote','priest','holy','cleric') ? 'divine' :
    has('cavaleiro','knight','armor','armadura') ? 'knight' :
    has('mago','mage','wizard','magic') ? 'mage' :
    has('assassino','assassin','rogue','ninja') ? 'assassin' :
    has('cientista','scientist','science') ? 'scientist' :
    has('ciborgue','cyber','tech') ? 'tech' :
    has('mercenário','mercenary') ? 'warrior' : 'civilian';

  const weapon =
    has('espada','sword','katana','blade','shinigami') ? 'sword' :
    has('lança','spear','trident','tridente') ? 'spear' :
    has('arco','bow','archer') ? 'bow' :
    has('martelo','hammer','mjölnir') ? 'hammer' :
    has('escudo','shield') ? 'shield' :
    has('pistola','rifle','gun','firearm') ? 'gun' : 'none';

  const anatomy = {
    horns: species==='dragon'||species==='demon',
    wings: species==='dragon'||species==='angel',
    tail: species==='dragon'||species==='demon'||species==='beast'||species==='merfolk',
    scales: species==='dragon'||species==='merfolk',
    claws: species==='dragon'||species==='demon'||species==='beast'||species==='vamp',
    fins: species==='merfolk',
    mechanical: species==='cyber',
    ethereal: species==='spirit',
    stone: species==='golem',
    pointedEars: species==='elf'
  };

  return {
    version:'2.0.0',
    slots:items,
    tags,
    species,power,body,clothing,weapon,anatomy,
    has,
    sourcePriority: items.map(x=>({slot:x.slot,tags:x.tags,visual:x.visual}))
  };
}

window.CHARACTER_INTELLIGENCE = { version:'2.0.0', profile };
})();
