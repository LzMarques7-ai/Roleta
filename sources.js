/* ROULETA DA VIDA V7 — fontes externas opcionais
   As fontes enriquecem a camada de referências; o jogo nunca depende delas.
   Jikan: anime/mangá; MediaWiki/Wikidata: conhecimento estruturado; Open Library: obras.
*/
const REMOTE_LIBRARY={characters:[],works:[],concepts:[],status:[]};
const CACHE_TTL=24*60*60*1000;
function cacheGet(key){try{const x=JSON.parse(localStorage.getItem(key)||'null');return x&&Date.now()-x.t<CACHE_TTL?x.v:null}catch{return null}}
function cacheSet(key,v){try{localStorage.setItem(key,JSON.stringify({t:Date.now(),v}))}catch{}}
async function fetchJSON(url,opts={}){const r=await fetch(url,{...opts,cache:'no-store'});if(!r.ok)throw new Error(String(r.status));return r.json()}
async function jikan(){
 const key='rv7:jikan'; const c=cacheGet(key); if(c)return c;
 try{
  const out=[];
  for(let i=0;i<3;i++){
   const j=await fetchJSON('https://api.jikan.moe/v4/random/characters');
   if(j?.data?.name)out.push({name:j.data.name,source:'Jikan'});
   await new Promise(r=>setTimeout(r,1100));
  }
  cacheSet(key,out); REMOTE_LIBRARY.status.push(['Jikan',true,out.length]); return out;
 }catch(e){REMOTE_LIBRARY.status.push(['Jikan',false,0]);return []}
}
async function mediaWiki(q){
 const key='rv7:wiki:'+q; const c=cacheGet(key); if(c)return c;
 try{
  const u='https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch='+encodeURIComponent(q)+'&srlimit=50&format=json&origin=*';
  const j=await fetchJSON(u); const out=(j?.query?.search||[]).map(x=>({name:x.title,source:'Wikipedia'})); cacheSet(key,out); REMOTE_LIBRARY.status.push(['Wikipedia:'+q,true,out.length]); return out;
 }catch(e){REMOTE_LIBRARY.status.push(['Wikipedia:'+q,false,0]);return []}
}
async function wikidata(){
 const key='rv7:wikidata'; const c=cacheGet(key); if(c)return c;
 try{
  const query=`SELECT ?item ?itemLabel WHERE { ?item wdt:P31/wdt:P279* wd:Q4271324 . SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } } LIMIT 80`;
  const u='https://query.wikidata.org/sparql?format=json&query='+encodeURIComponent(query);
  const j=await fetchJSON(u,{headers:{Accept:'application/sparql-results+json'}});
  const out=(j?.results?.bindings||[]).map(x=>({name:x.itemLabel?.value,source:'Wikidata'})).filter(x=>x.name);
  cacheSet(key,out); REMOTE_LIBRARY.status.push(['Wikidata',true,out.length]); return out;
 }catch(e){REMOTE_LIBRARY.status.push(['Wikidata',false,0]);return []}
}
async function openLibrary(){
 const key='rv7:openlibrary'; const c=cacheGet(key); if(c)return c;
 try{
  const q=['fantasy','science fiction','mythology','superhero'];
  const all=[];
  for(const term of q){
   const j=await fetchJSON('https://openlibrary.org/search.json?q='+encodeURIComponent(term)+'&limit=25&fields=title');
   for(const d of j.docs||[])if(d.title)all.push({name:d.title,source:'Open Library'});
  }
  const out=[...new Map(all.map(x=>[x.name,x])).values()]; cacheSet(key,out); REMOTE_LIBRARY.status.push(['Open Library',true,out.length]); return out;
 }catch(e){REMOTE_LIBRARY.status.push(['Open Library',false,0]);return []}
}
async function hydrateReferencePool(){
 const results=await Promise.allSettled([jikan(),mediaWiki('fictional character'),mediaWiki('mythological creature'),mediaWiki('superpower'),wikidata(),openLibrary()]);
 const flat=[]; for(const r of results)if(r.status==='fulfilled')flat.push(...r.value);
 REMOTE_LIBRARY.characters=[...new Map(flat.map(x=>[x.name,x])).values()];
 REMOTE_LIBRARY.works=REMOTE_LIBRARY.characters.filter(x=>/Library/.test(x.source));
 REMOTE_LIBRARY.concepts=REMOTE_LIBRARY.characters;
 window.dispatchEvent(new CustomEvent('referencepoolready',{detail:REMOTE_LIBRARY}));
 return REMOTE_LIBRARY;
}
