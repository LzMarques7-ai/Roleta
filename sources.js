/* ROULETA DA VIDA V8 — referências externas opcionais.
   A aplicação não depende de nenhuma API para sortear ou funcionar.
   As fontes servem para ampliar a camada educativa e nunca alteram probabilidades.
*/
const REMOTE_LIBRARY={characters:[],works:[],concepts:[],status:[]};
const CACHE_TTL=7*24*60*60*1000;
function cacheGet(key){try{const x=JSON.parse(localStorage.getItem(key)||'null');return x&&Date.now()-x.t<CACHE_TTL?x.v:null}catch{return null}}
function cacheSet(key,v){try{localStorage.setItem(key,JSON.stringify({t:Date.now(),v}))}catch{}}
async function fetchJSON(url,opts={}){
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),7000);
 try{const r=await fetch(url,{...opts,signal:controller.signal,cache:'no-store'});if(!r.ok)throw new Error(String(r.status));return await r.json()}
 finally{clearTimeout(timer)}
}
async function jikan(){
 const key='rv8:jikan';const c=cacheGet(key);if(c)return c;
 try{const out=[];for(let i=0;i<5;i++){const j=await fetchJSON('https://api.jikan.moe/v4/random/characters');if(j?.data?.name)out.push({name:j.data.name,source:'Jikan'});await new Promise(r=>setTimeout(r,1100))}const v=[...new Map(out.map(x=>[x.name,x])).values()];cacheSet(key,v);REMOTE_LIBRARY.status.push(['Jikan',true,v.length]);return v}catch{REMOTE_LIBRARY.status.push(['Jikan',false,0]);return []}
}
async function wikipedia(q){
 const key='rv8:wiki:'+q;const c=cacheGet(key);if(c)return c;
 try{const u='https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch='+encodeURIComponent(q)+'&srlimit=50&format=json&origin=*';const j=await fetchJSON(u);const v=(j?.query?.search||[]).map(x=>({name:x.title,source:'Wikipedia'}));cacheSet(key,v);REMOTE_LIBRARY.status.push(['Wikipedia: '+q,true,v.length]);return v}catch{REMOTE_LIBRARY.status.push(['Wikipedia: '+q,false,0]);return []}
}
async function wikidata(){
 const key='rv8:wikidata';const c=cacheGet(key);if(c)return c;
 try{const query='SELECT ?item ?itemLabel WHERE { ?item wdt:P31/wdt:P279* wd:Q4271324 . SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } } LIMIT 150';const u='https://query.wikidata.org/sparql?format=json&query='+encodeURIComponent(query);const j=await fetchJSON(u,{headers:{Accept:'application/sparql-results+json'}});const v=(j?.results?.bindings||[]).map(x=>({name:x.itemLabel?.value,source:'Wikidata'})).filter(x=>x.name);cacheSet(key,v);REMOTE_LIBRARY.status.push(['Wikidata',true,v.length]);return v}catch{REMOTE_LIBRARY.status.push(['Wikidata',false,0]);return []}
}
async function openLibrary(){
 const key='rv8:openlibrary';const c=cacheGet(key);if(c)return c;
 try{const terms=['fantasy','mythology','science fiction','superhero','manga','anime','horror'];const all=[];for(const term of terms){const j=await fetchJSON('https://openlibrary.org/search.json?q='+encodeURIComponent(term)+'&limit=50&fields=title');for(const d of j.docs||[])if(d.title)all.push({name:d.title,source:'Open Library'})}const v=[...new Map(all.map(x=>[x.name,x])).values()];cacheSet(key,v);REMOTE_LIBRARY.status.push(['Open Library',true,v.length]);return v}catch{REMOTE_LIBRARY.status.push(['Open Library',false,0]);return []}
}
async function anilist(){
 const key='rv8:anilist';const c=cacheGet(key);if(c)return c;
 try{const query='{Page(page:1,perPage:50){media(type:ANIME,sort:POPULARITY_DESC){title{romaji} characters(perPage:25){nodes{name{full}}}}}}';const j=await fetchJSON('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query})});const out=[];for(const media of j?.data?.Page?.media||[])for(const c of media.characters?.nodes||[])if(c.name?.full)out.push({name:c.name.full,source:'AniList'});const v=[...new Map(out.map(x=>[x.name,x])).values()];cacheSet(key,v);REMOTE_LIBRARY.status.push(['AniList',true,v.length]);return v}catch{REMOTE_LIBRARY.status.push(['AniList',false,0]);return []}
}
async function hydrateReferencePool(){
 const jobs=[jikan(),wikipedia('fictional character'),wikipedia('mythological creature'),wikipedia('superpower'),wikidata(),openLibrary(),anilist()];
 const results=await Promise.allSettled(jobs);const flat=[];for(const r of results)if(r.status==='fulfilled')flat.push(...r.value);
 REMOTE_LIBRARY.characters=[...new Map(flat.map(x=>[x.name,x])).values()];
 REMOTE_LIBRARY.works=REMOTE_LIBRARY.characters.filter(x=>/Library/i.test(x.source));
 REMOTE_LIBRARY.concepts=REMOTE_LIBRARY.characters;
 window.dispatchEvent(new CustomEvent('referencepoolready',{detail:REMOTE_LIBRARY}));
 return REMOTE_LIBRARY;
}
