/* Carrega bibliotecas públicas em tempo de execução.
   Se uma fonte estiver indisponível, a roleta continua funcionando com a biblioteca local.
*/
const REMOTE_LIBRARY = { characters: [], races: [], powers: [], weapons: [], titles: [] };
const SOURCE_STATUS = [];

function addUnique(arr, value) {
  if (!value) return;
  const v = String(value).trim();
  if (v && !arr.includes(v)) arr.push(v);
}
function addCharacter(c, source) {
  if (!c || !c.name) return;
  REMOTE_LIBRARY.characters.push({
    name: c.name,
    source,
    race: c.appearance?.race || null,
    intelligence: Number(c.powerstats?.intelligence) || null,
    strength: Number(c.powerstats?.strength) || null,
    speed: Number(c.powerstats?.speed) || null,
    durability: Number(c.powerstats?.durability) || null,
    power: Number(c.powerstats?.power) || null,
    combat: Number(c.powerstats?.combat) || null,
    publisher: c.biography?.publisher || null,
    alignment: c.biography?.alignment || null
  });
}
async function loadRemoteLibraries() {
  const jobs = [
    ["Anime Character Offline Database", SOURCES.animeCharacters.raw, async data => {
      const list = Array.isArray(data?.data) ? data.data : [];
      list.forEach(c => {
        addCharacter({name:c.name, appearance:{race:null}, biography:{publisher:"Anime/Mangá"}}, "Anime/Mangá");
      });
      SOURCE_STATUS.push({name:"Anime/Mangá",ok:true,count:list.length});
    }],
    ["Superhero API", SOURCES.superheroes.raw, async data => {
      const list = Array.isArray(data) ? data : [];
      list.forEach(c => {
        addCharacter(c, c.biography?.publisher || "Quadrinhos");
        addUnique(LIBRARY.races, c.appearance?.race);
      });
      SOURCE_STATUS.push({name:"Quadrinhos",ok:true,count:list.length});
    }]
  ];
  await Promise.all(jobs.map(async ([name,url,fn]) => {
    try {
      const res = await fetch(url, {cache:"force-cache"});
      if (!res.ok) throw new Error(String(res.status));
      await fn(await res.json());
    } catch (e) {
      SOURCE_STATUS.push({name,ok:false,error:String(e)});
    }
  }));
  window.dispatchEvent(new Event("libraryready"));
}
loadRemoteLibraries();