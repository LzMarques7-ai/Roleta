/* Fontes externas são opcionais. Nunca alteram probabilidades.
   A biblioteca local é o fallback e o jogo funciona offline. */
const REMOTE_LIBRARY={characters:[],works:[],concepts:[],status:[]};
const CACHE_TTL=7*24*60*60*1000;
function rvCacheGet(k){try{const x=JSON.parse(localStorage.getItem(k)||"null");return x&&Date.now()-x.t<CACHE_TTL?x.v:null}catch{return null}}
function rvCacheSet(k,v){try{localStorage.setItem(k,JSON.stringify({t:Date.now(),v}))}catch{}}
async function rvFetch(url,options={}){const c=new AbortController(),t=setTimeout(()=>c.abort(),6500);try{const r=await fetch(url,{...options,signal:c.signal});if(!r.ok)throw Error(r.status);return await r.json()}finally{clearTimeout(t)}}
async function hydrateReferencePool(){
  /* Não bloqueia a experiência. As referências remotas são educativas. */
  try{
    const cached=rvCacheGet("rv8:refs");
    if(cached){REMOTE_LIBRARY.characters=cached;window.dispatchEvent(new CustomEvent("referencepoolready"));return cached}
    const j=await rvFetch("https://api.jikan.moe/v4/random/characters");
    if(j?.data?.name){REMOTE_LIBRARY.characters=[{name:j.data.name,source:"Jikan"}];rvCacheSet("rv8:refs",REMOTE_LIBRARY.characters)}
  }catch{}
  window.dispatchEvent(new CustomEvent("referencepoolready"));
  return REMOTE_LIBRARY.characters;
}
