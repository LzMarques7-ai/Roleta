/* ROULETA DA VIDA V21 — VISUAL FORM DATABASE
   Atlas local de peças. O motor combina dezenas de dimensões para que cada vida
   tenha silhueta, rosto, roupa, anatomia e atmosfera próprias.
*/
(()=>{
'use strict';
const V={
 faceShapes:{
  oval:{w:86,jaw:'soft',chin:'round'},angular:{w:88,jaw:'sharp',chin:'defined'},square:{w:94,jaw:'broad',chin:'flat'},long:{w:79,jaw:'narrow',chin:'long'},heart:{w:84,jaw:'tapered',chin:'point'},diamond:{w:82,jaw:'wide',chin:'point'},round:{w:94,jaw:'soft',chin:'round'},gaunt:{w:74,jaw:'narrow',chin:'point'}
 },
 eyeShapes:{almond:{rx:22,ry:11},sharp:{rx:23,ry:7},round:{rx:18,ry:18},hooded:{rx:21,ry:9},cat:{rx:24,ry:8},wide:{rx:25,ry:12},tired:{rx:20,ry:8},monolid:{rx:22,ry:10}},
 brows:{straight:{tilt:0,weight:5},arched:{tilt:-9,weight:5},heavy:{tilt:4,weight:8},thin:{tilt:-7,weight:3},furrowed:{tilt:9,weight:7},sharp:{tilt:-14,weight:6}},
 noses:{straight:'straight',small:'small',strong:'strong',sharp:'sharp',soft:'soft',aquiline:'aquiline'},
 mouths:{calm:'calm',smirk:'smirk',stern:'stern',soft:'soft',confident:'confident',neutral:'neutral',full:'full',thin:'thin'},
 skinTones:{porcelain:'#f4d4c7',warm:'#d7a080',tan:'#a96f50',deep:'#75493f',olive:'#b98569',amber:'#c98c5f',ashen:'#a5a0a0',blue:'#78b8d2',violet:'#9b7bb6',stone:'#8d8f8b'},
 eyeColors:{brown:'#4b2f2a',hazel:'#8b7a45',green:'#67b978',blue:'#6bbcff',gray:'#b7c7d8',violet:'#b47cff',gold:'#ffd35d',red:'#ff667b',cyan:'#66f4ff',black:'#10131a'},
 hair:{
  short:'short layered cut',spikes:'textured spiky cut',long:'long flowing hair',wolf:'wolf cut',slick:'slicked-back hair',curly:'curly volume',braids:'braided hair',bob:'short bob',ponytail:'high ponytail',messy:'messy layered hair',mohawk:'angular mohawk',bald:'shaved head',crown:'regal sculpted hair',sidecut:'undercut with long side sweep',waves:'long soft waves',dread:'thick locs',twintails:'twin tails',undercut:'clean undercut',veil:'long veil-like strands',feather:'feathered layered hair'
 },
 hairColors:{black:'#141821',brown:'#684735',chestnut:'#915d43',blond:'#d9b66f',white:'#eaf2f5',silver:'#b9c6d5',red:'#a94e4d',blue:'#4e7fcb',pink:'#c9689e',purple:'#7554a6',green:'#4d8a68',teal:'#4d9296'},
 bodies:{slim:{shoulders:132,torso:118,arms:28,hips:92},athletic:{shoulders:158,torso:132,arms:38,hips:102},muscular:{shoulders:184,torso:150,arms:49,hips:112},imposing:{shoulders:208,torso:168,arms:58,hips:126},graceful:{shoulders:142,torso:122,arms:30,hips:108},mechanical:{shoulders:178,torso:154,arms:47,hips:108},ethereal:{shoulders:148,torso:126,arms:32,hips:100},heroic:{shoulders:195,torso:156,arms:53,hips:112},lithe:{shoulders:150,torso:126,arms:34,hips:98}},
 clothing:{
  civilian:{top:'tailored civilian layers',accent:'seams and fabric folds'},traveler:{top:'weathered travel coat',accent:'belts, straps and pockets'},warrior:{top:'functional combat outfit',accent:'reinforced panels and wraps'},knight:{top:'ornate light armor',accent:'engraved plates and leather joints'},royal:{top:'ceremonial high-status attire',accent:'embroidery, collar and jewelry'},mage:{top:'layered arcane robes',accent:'stitched symbols and charms'},rogue:{top:'dark fitted stealth clothing',accent:'asymmetry and utility pouches'},scholar:{top:'scholarly coat',accent:'fine seams, papers and clasps'},tech:{top:'advanced technical suit',accent:'segmented armor and luminous interfaces'},divine:{top:'celestial ceremonial attire',accent:'ornamental metal and translucent layers'},monster:{top:'anatomy-dominant silhouette',accent:'natural textures'},street:{top:'fashion-forward streetwear',accent:'panels, chains and layered fabric'},royalbattle:{top:'battle-worn ceremonial armor',accent:'heraldic plates and damage marks'}
 },
 poses:{neutral:'three-quarter portrait',heroic:'heroic three-quarter stance',combat:'combat-ready stance',regal:'upright commanding stance',speed:'forward-leaning motion pose',mystic:'ritual stance with one hand shaping power',intimidating:'low-angle dominant stance',scholar:'composed analytical stance',duelist:'angled duelist stance'},
 scenes:{urban:'layered night city',forest:'deep enchanted forest',ruins:'ancient ruined sanctuary',cosmic:'vast cosmic field',royal:'grand ceremonial hall',battle:'war-torn battlefield',laboratory:'advanced laboratory',mythic:'monumental mythic landscape',desert:'windswept ancient desert',ocean:'deep luminous oceanic space',void:'abstract dark void',street:'neon urban street'},
 accessories:{earring:'metal earrings',necklace:'layered necklace',scarf:'textured scarf',gloves:'fitted gloves',belt:'utility belt',crown:'crown or tiara',visor:'technical visor',amulet:'distinctive pendant',shoulder:'structured shoulder piece',rings:'multiple rings',mask:'half mask',cape:'short ceremonial cape',hairpin:'ornate hairpin'},
 anatomy:{
  human:{ears:false,horns:false,wings:false,tail:false,scales:false,claws:false},elf:{ears:true,horns:false,wings:false,tail:false,scales:false,claws:false},fae:{ears:true,horns:false,wings:true,tail:false,scales:false,claws:false},demon:{ears:false,horns:true,wings:false,tail:true,scales:false,claws:true},dragon:{ears:false,horns:true,wings:true,tail:true,scales:true,claws:true},angel:{ears:false,horns:false,wings:true,tail:false,scales:false,claws:false},beast:{ears:true,horns:false,wings:false,tail:true,scales:false,claws:true},vamp:{ears:false,horns:false,wings:false,tail:false,scales:false,claws:true},cyber:{ears:false,horns:false,wings:false,tail:false,scales:false,claws:false,mechanical:true},spirit:{ears:false,horns:false,wings:false,tail:false,scales:false,claws:false,ethereal:true},golem:{ears:false,horns:false,wings:false,tail:false,scales:false,claws:true,stone:true},seraph:{ears:false,horns:false,wings:true,tail:false,scales:false,claws:false,manyWings:true}
 },
 motifs:['runes','constellations','geometric','flames','frost','leaves','circuit','stainedglass','waves','thorns','none']
};
window.VISUAL_DATABASE=V;
})();
