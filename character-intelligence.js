/* ROULETA DA VIDA V23 — CHARACTER INTELLIGENCE LAYER
   Camada local de inteligência entre LIBRARY -> ENGINE -> VISUAL ENGINE.

   Objetivo:
   - transformar referências do banco em sinais semânticos;
   - combinar todas as roletas antes da renderização;
   - enriquecer tags para que o visual-engine consiga interpretar referências
     que não existiam no vocabulário visual original;
   - produzir visualPlan / visualDNA para card, arte e futuras camadas;
   - permanecer 100% local, determinístico e sem API externa.
*/
(()=> {
'use strict';

const VERSION = '23.0.0';
const norm = s => String(s ?? '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLowerCase();

const splitTags = x => String(x?.tags || '')
  .split(',')
  .map(s => norm(s).trim())
  .filter(Boolean);

const uniq = a => [...new Set(a.filter(Boolean))];

const textOf = x => norm([
  x?.name, x?.ref, x?.refWhy, x?.refType, x?.description,
  x?.source, x?.why
].filter(Boolean).join(' '));

/*
 * Vocabulário semântico.
 * A regra não substitui o banco: ela interpreta o banco.
 * Novas referências podem funcionar sem serem cadastradas aqui
 * se suas tags já forem suficientemente descritivas.
 */
const RULES = [
  [/shinigami|ceifador|death god|death spirit/, ['spirit','sword','death','ritual','dark','supernatural']],
  [/homuncul|homunculus/, ['alchemy','science','artificial','immortal','alchemy']],
  [/metahuman|metahumano|superhuman|super[- ]human/, ['meta','superhuman','power','enhanced','heroic']],
  [/dragon|dragao|draconic/, ['dragon','fire','scale','wing','beast','strong']],
  [/phoenix|fenix/, ['phoenix','fire','wing','light','immortal']],
  [/angel|anjo/, ['angel','wing','light','holy']],
  [/seraph|serafim/, ['seraph','angel','wing','light','holy']],
  [/demon|demonio|demoniac/, ['demon','dark','fire','horn','monstrous']],
  [/oni/, ['oni','demon','horn','dark','strong']],
  [/vampire|vampiro/, ['vamp','dark','immortal','night','elegant']],
  [/werewolf|lobisomem|lycan/, ['wolf','beast','muscle','night','claw']],
  [/elf|elfo/, ['elf','nature','graceful','forest','magic']],
  [/fae|fairy|fada/, ['fae','nature','magic','wing','forest']],
  [/merfolk|triton|sereia|mermaid/, ['merfolk','water','ocean','magic']],
  [/golem/, ['golem','stone','armor','strong']],
  [/cyborg|cyber|android|robot/, ['cyber','tech','android','armor','science']],
  [/alien|extraterrestrial|extraterrestre/, ['alien','cosmic','space','tech']],
  [/god|deity|divine|deus|divino/, ['god','light','cosmic','holy','royal']],
  [/cosmic|galactic|galax|space|espacial|universo/, ['cosmic','celestial','space','energy']],
  [/emperor|imperador|imperatriz|empress|king|queen|rei|rainha|royal|monarch|monarca/, ['royal','regal','divine']],
  [/priest|sacerdote|sacerdotisa|cleric|holy/, ['holy','magic','ritual','light']],
  [/mage|mago|magician|wizard|brux|feiticeir/, ['mage','magic','mystic']],
  [/knight|cavaleiro|paladin|paladino/, ['knight','armor','sword','warrior']],
  [/warrior|guerreiro|soldier|soldado/, ['warrior','combat','strong']],
  [/assassin|assassino|rogue|ladrao|thief/, ['assassin','rogue','lithe','dark']],
  [/pirate|pirata/, ['pirate','ocean','rogue']],
  [/monk|monge|martial|artes marciais/, ['monk','martial','muscle','combat']],
  [/scientist|cientista|science|ciencia|scholar|estudioso/, ['scientist','science','tech','intelligence']],
  [/hero|heroi|protagonist/, ['heroic','light']],
  [/villain|vilao|antihero|anti-heroi|anti hero/, ['villain','dark','intimidating']],
  [/immortal|imortal|eternal|eterno/, ['immortal','supernatural']],
  [/regeneration|regeneracao|healing|cura/, ['regeneration','enhanced']],
  [/fire|fogo|flame|chama|solar|sun/, ['fire','sun','energy']],
  [/ice|gelo|frost|neve/, ['ice','frost','water']],
  [/lightning|eletric|electric|raio|thunder/, ['lightning','energy','speedster']],
  [/water|agua|ocean|oceano/, ['water','ocean']],
  [/dark|sombr|shadow|sombra|void|vazio/, ['dark','shadow']],
  [/light|luz|holy|sagrado/, ['light','holy']],
  [/nature|natureza|forest|floresta|plant|planta/, ['nature','forest']],
  [/psychic|psiquic|mind|mental|telepath/, ['psychic','mind','mystic']],
  [/teleport|teleporte|space[- ]time/, ['cosmic','energy','magic']],
  [/speedster|velocista|flash|speed|velocidade/, ['speedster','lightning']],
  [/strongman|bodybuilder|muscle|muscular|forca|força/, ['muscle','strong']],
  [/sword|espada|katana|blade|lamina|lâmina/, ['sword','warrior','duelist']],
  [/armor|armadura|armored/, ['armor','tech','strong']],
  [/tech|technology|tecnologia/, ['tech','science']],
  [/magic|magia|arcane|arcano/, ['magic','mystic']],
  [/wing|asa|asas/, ['wing','light']],
  [/horn|chifre|chifres/, ['horn','demon']],
  [/scale|escama|escamas/, ['scale','dragon']],
  [/beast|fera|animal|wolf|fox|kitsune/, ['beast']],
  [/red|vermelho|scarlet/, ['red','fire']],
  [/blue|azul|cyan/, ['blue','water']],
  [/silver|prata|white|branco|branca/, ['silver','white']],
  [/gold|ouro|dourado|dourada/, ['gold','royal']],
  [/pink|rosa/, ['pink']],
  [/green|verde/, ['green','nature']]
];

const applyRules = text => {
  const tags = [];
  for (const [re, add] of RULES) if (re.test(text)) tags.push(...add);
  return tags;
};

function collect(p) {
  const all = [];
  const byField = {};
  for (const [key, value] of Object.entries(p || {})) {
    if (!value || typeof value !== 'object') continue;
    const own = uniq([...splitTags(value), ...applyRules(textOf(value))]);
    byField[key] = own;
    all.push(...own);
  }
  return uniq(all);
}

function expandField(value, globalTags) {
  if (!value || typeof value !== 'object') return value;
  const own = uniq([
    ...splitTags(value),
    ...applyRules(textOf(value)),
    ...globalTags
  ]);
  return {...value, tags: own.join(',')};
}

function priority(tagSet, tag) {
  return tagSet.has(tag) ? 1 : 0;
}

function buildPlan(p, globalTags) {
  const t = new Set(globalTags);
  const pickFirst = (...xs) => xs.find(x => t.has(x)) || null;
  const body =
    pickFirst('towering','giant','titan','kaiju','strongman','muscle','strong',
              'mechanical','monstrous','graceful','lithe') || 'balanced';

  const anatomy =
    pickFirst('dragon','oni','demon','seraph','angel','fae','elf','merfolk',
              'faun','beast','cyber','android','golem','spirit','human') || 'human';

  const clothing =
    pickFirst('royal','divine','knight','armor','mage','magic','alchemy',
              'rogue','assassin','tech','scientist','warrior','soldier',
              'pirate','monk','street') || 'neutral';

  const pose =
    pickFirst('speedster','martial','assassin','combat','royal','god',
              'psychic','magic','villain','demon','sword','katana') || 'portrait';

  const scene =
    pickFirst('cosmic','celestial','space','tech','cyber','royal','water',
              'ocean','forest','nature','battle','warrior','urban','street',
              'temple','library','underworld','garden','spaceport') || 'neutral';

  const palette =
    pickFirst('fire','phoenix','sun','ice','frost','lightning','water',
              'merfolk','triton','dark','demon','vamp','shadow','hollow',
              'light','angel','holy','tech','cyber','android','science',
              'cosmic','celestial','god','nature','elf','fae') || 'neutral';

  const face = pickFirst('demon','oni','beast','angel','seraph','spirit','cyber');
  const hair = pickFirst('silver','white','red','blue','pink','green','gold','royal');
  const eyes = pickFirst('lightning','fire','sun','ice','psychic','magic','dark','demon');
  const effects = uniq([
    ...['fire','ice','lightning','magic','psychic','cosmic','dark','light',
        'spirit','energy','regeneration'].filter(x=>t.has(x)),
    anatomy !== 'human' ? anatomy : null
  ]);

  const dominant = [
    ['anatomy', anatomy],
    ['body', body],
    ['clothing', clothing],
    ['pose', pose],
    ['scene', scene],
    ['palette', palette]
  ];

  return {
    version: VERSION,
    dominantTags: globalTags.slice(0, 24),
    anatomy,
    body,
    clothing,
    pose,
    scene,
    palette,
    face: face || 'procedural',
    hair: hair || 'procedural',
    eyes: eyes || 'procedural',
    effects,
    dominant,
    sourceFields: Object.keys(p || {}),
    reasoning: [
      anatomy !== 'human' ? `Anatomia influenciada por ${anatomy}` : 'Anatomia humana/procedural',
      body !== 'balanced' ? `Corpo influenciado por ${body}` : 'Corpo procedural',
      clothing !== 'neutral' ? `Vestuário influenciado por ${clothing}` : 'Vestuário procedural',
      scene !== 'neutral' ? `Cenário influenciado por ${scene}` : 'Cenário procedural',
      effects.length ? `Efeitos derivados: ${effects.join(', ')}` : 'Sem efeito dominante'
    ]
  };
}

function compatibility(p, globalTags) {
  const t = new Set(globalTags);
  const rules = [
    ['dragon','fire'], ['psychic','mind'], ['sword','katana'], ['cosmic','energy'],
    ['tech','armor'], ['wing','light'], ['demon','dark'], ['martial','muscle'],
    ['science','tech'], ['spirit','sword'], ['royal','cosmic'], ['holy','light'],
    ['alchemy','science'], ['immortal','supernatural'], ['water','merfolk']
  ];
  const pairs = [];
  for (const [a,b] of rules) if (t.has(a) && t.has(b)) pairs.push(`${a}+${b}`);
  return {score: pairs.length, pairs};
}

function install() {
  try {
  if (!window.RV || typeof window.RV.compose !== 'function') {
    console.warn('[CIL] RV ainda não disponível.');
    return false;
  }
  if (window.RV.__CIL23) return true;

  const originalCompose = window.RV.compose;
  const originalForge = window.RV.forge;

  const intelligenceCompose = function(seed) {
    const result = originalCompose(seed || {});
    const p = {...(result.p || {})};

    const collected = collect(p);
    const expanded = {};
    for (const [key,value] of Object.entries(p)) {
      expanded[key] = expandField(value, collected);
    }

    const plan = buildPlan(expanded, collected);
    const compat = compatibility(expanded, collected);

    result.p = expanded;
    result.visualPlan = plan;
    result.visualDNA = {
      tags: collected,
      compatibility: compat,
      references: Object.fromEntries(
        Object.entries(expanded)
          .filter(([,v]) => v && typeof v === 'object')
          .map(([k,v]) => [k, {
            name: v.name || '',
            refType: v.refType || '',
            refWhy: v.refWhy || v.ref || '',
            tags: splitTags(v)
          }])
      )
    };

    // Recalcula a raridade depois da expansão sem alterar o sorteio original.
    try {
      result.rarity = window.RV.rarity(expanded);
      result.synergies = result.rarity.synergies;
    } catch (_) {}

    result.visualSeed = [
      result.p.name?.name || '',
      ...Object.keys(expanded).map(k => expanded[k]?.name || ''),
      collected.join(',')
    ].join('|');

    result.cil = {
      version: VERSION,
      active: true,
      tagCount: collected.length,
      compatibilityScore: compat.score,
      compatibilityPairs: compat.pairs
    };

    return result;
  };

  window.RV.compose = intelligenceCompose;
  window.RV.forge = function() { return intelligenceCompose({}); };
  window.RV.CIL = {
    version: VERSION,
    collect,
    buildPlan,
    compatibility,
    expandField
  };
  window.RV.__CIL23 = true;

  // API global para debug/testes.
  window.CharacterIntelligence = {
    version: VERSION,
    analyze(character) {
      const p = character?.p || character || {};
      const tags = collect(p);
      return {
        tags,
        visualPlan: buildPlan(p, tags),
        compatibility: compatibility(p, tags)
      };
    }
  };

  console.log(`[CIL ${VERSION}] Character Intelligence Layer ativa.`);
  return true;
  } catch (err) {
    console.error('[CIL] Camada desativada para preservar a aplicação:', err);
    window.CharacterIntelligence = window.CharacterIntelligence || {
      version: VERSION,
      analyze: character => ({tags:[], visualPlan:null, compatibility:{score:0,pairs:[]}})
    };
    return false;
  }
}

if (!install()) {
  window.addEventListener('load', install, {once:true});
}
})();
