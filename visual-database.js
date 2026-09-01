/* ROULETA DA VIDA V20 — VISUAL FORM DATABASE
   Biblioteca local de formas. Não gera uma imagem externa: fornece peças visuais
   combináveis para o Visual Engine montar um personagem único e consistente.
*/
(()=>{
'use strict';
const V={
  faceShapes:{oval:{jaw:'soft',chin:'round',width:1.00},angular:{jaw:'sharp',chin:'defined',width:.94},square:{jaw:'broad',chin:'flat',width:1.08},long:{jaw:'narrow',chin:'long',width:.92},heart:{jaw:'tapered',chin:'point',width:.98},diamond:{jaw:'wide',chin:'point',width:.90}},
  eyeShapes:{almond:{shape:'almond',scale:1},sharp:{shape:'sharp',scale:.86},round:{shape:'round',scale:1.1},hooded:{shape:'hooded',scale:.92},cat:{shape:'cat',scale:.88},wide:{shape:'wide',scale:1.15},tired:{shape:'tired',scale:.9}},
  brows:{straight:{angle:0,weight:5},arched:{angle:-12,weight:5},heavy:{angle:3,weight:8},thin:{angle:-6,weight:3},furrowed:{angle:8,weight:7}},
  noses:{straight:'straight',small:'small',strong:'strong',sharp:'sharp',soft:'soft'},
  mouths:{calm:'calm',smirk:'smirk',stern:'stern',soft:'soft',confident:'confident',neutral:'neutral'},
  hair:{
    short_spikes:'short spiky silhouette',long_flow:'long flowing silhouette',wolf_cut:'layered wolf cut',slick:'slicked-back silhouette',curly:'curly volume',braided:'braided silhouette',bob:'short bob',ponytail:'high ponytail',messy:'messy layered hair',mohawk:'angular mohawk',bald:'shaved/bald head',crown:'regal structured hair'
  },
  bodies:{slim:{shoulders:132,torso:118,arms:35,hips:92},athletic:{shoulders:158,torso:132,arms:43,hips:102},muscular:{shoulders:184,torso:150,arms:52,hips:112},imposing:{shoulders:205,torso:166,arms:59,hips:126},graceful:{shoulders:142,torso:122,arms:31,hips:108},mechanical:{shoulders:178,torso:154,arms:49,hips:108},ethereal:{shoulders:148,torso:126,arms:34,hips:100}},
  clothing:{
    civilian:{top:'tailored everyday clothing',detail:'seams, folds and layered fabric'},
    traveler:{top:'weathered travel coat',detail:'belts, straps, pockets and worn edges'},
    warrior:{top:'functional combat outfit',detail:'reinforced panels, wraps and practical fasteners'},
    knight:{top:'ornate light armor',detail:'engraved plates, leather joints and heraldic details'},
    royal:{top:'ceremonial high-status attire',detail:'structured collar, embroidery and jewelry'},
    mage:{top:'layered arcane robes',detail:'stitched symbols, fabric layers and small charms'},
    rogue:{top:'dark fitted stealth clothing',detail:'hidden straps, asymmetrical panels and utility pouches'},
    scholar:{top:'scholarly coat and layered garments',detail:'books, notes, pens and refined materials'},
    tech:{top:'advanced technical suit',detail:'segmented armor, luminous interfaces and micro-panels'},
    divine:{top:'ceremonial celestial attire',detail:'ornamental metal, translucent fabric and symbolic geometry'},
    monster:{top:'anatomy-dominant silhouette',detail:'natural textures, claws, scales, fur or stone where supported'}
  },
  poses:{neutral:'three-quarter standing portrait with relaxed shoulders',heroic:'dynamic three-quarter stance with one shoulder forward',combat:'combat-ready stance with weight shifted and hands prepared',regal:'upright commanding stance with controlled posture',speed:'forward-leaning motion pose with directional flow',mystic:'balanced ritual stance with one hand shaping the power',intimidating:'low-angle dominant stance with broad silhouette',scholar:'composed stance with subtle analytical gesture'},
  scenes:{urban:'layered city depth, distant architecture and atmospheric perspective',forest:'deep foliage layers, shafts of light and foreground leaves',ruins:'ancient structures, dust, broken stone and depth',cosmic:'nebula-like gradients, stars and geometric celestial forms',royal:'grand hall architecture, banners, columns and controlled light',battle:'distant debris, smoke, energy traces and dramatic perspective',laboratory:'technical panels, instruments, glass reflections and cool depth',mythic:'monumental landscape, sacred geometry and atmospheric scale',minimal:'abstract studio-like depth with restrained environmental storytelling'},
  particles:{dust:'dust motes',spark:'small luminous sparks',ember:'embers',frost:'ice fragments',leaf:'floating leaves',star:'star particles',shard:'glass-like shards',rune:'tiny geometric glyphs',energy:'energy motes'},
  accessories:{earring:'small metallic earrings',necklace:'layered necklace',scarf:'textured scarf',gloves:'fitted gloves',belt:'utility belt',crown:'subtle crown/tiara',visor:'technical visor',amulet:'distinctive pendant',shoulder:'structured shoulder piece'},
  anatomy:{human:{ears:false,horns:false,wings:false,tail:false,scales:false},elf:{ears:true,horns:false,wings:false,tail:false,scales:false},fae:{ears:true,horns:false,wings:true,tail:false,scales:false},demon:{ears:false,horns:true,wings:false,tail:true,scales:false},dragon:{ears:false,horns:true,wings:true,tail:true,scales:true},angel:{ears:false,horns:false,wings:true,tail:false,scales:false},beast:{ears:true,horns:false,wings:false,tail:true,scales:false},vamp:{ears:false,horns:false,wings:false,tail:false,scales:false},cyber:{ears:false,horns:false,wings:false,tail:false,scales:false,mechanical:true},spirit:{ears:false,horns:false,wings:false,tail:false,scales:false,ethereal:true}}
};
window.VISUAL_DATABASE=V;
})();
