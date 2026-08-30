/*
  FONTES EXTERNAS OPCIONAIS
  A V6 não depende delas para funcionar.
  Jikan oferece dados de personagens de anime/mangá.
  MediaWiki permite pesquisas em wikis/Wikipedia.
  Open Library oferece busca de obras/livros.
*/
const SOURCES={
  async jikanCharacters(pages=4){
    const out=[];
    for(let page=1;page<=pages;page++){
      try{
        const r=await fetch(`https://api.jikan.moe/v4/characters?page=${page}&limit=25`);
        if(!r.ok) break;
        const j=await r.json();
        for(const x of j.data||[]) if(x.name) out.push(x.name);
        await new Promise(r=>setTimeout(r,350));
      }catch(e){break}
    }
    return [...new Set(out)];
  },
  async mediaWikiSearch(q="fictional character",limit=50){
    try{
      const u=`https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(q)}&limit=${limit}`;
      const r=await fetch(u,{headers:{"Api-User-Agent":"Roleta-da-Vida/6.0"}});
      if(!r.ok) return [];
      const j=await r.json();
      return (j.pages||[]).map(x=>x.title).filter(Boolean);
    }catch(e){return []}
  },
  async openLibrarySearch(q="fantasy character",limit=50){
    try{
      const u=`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=${limit}`;
      const r=await fetch(u);
      if(!r.ok) return [];
      const j=await r.json();
      return (j.docs||[]).map(x=>x.title).filter(Boolean);
    }catch(e){return []}
  }
};
async function hydrateReferencePool(){
  const tasks=[
    SOURCES.jikanCharacters(3),
    SOURCES.mediaWikiSearch("fictional character",40),
    SOURCES.mediaWikiSearch("anime character",40),
    SOURCES.mediaWikiSearch("mythological creature",40),
    SOURCES.openLibrarySearch("fantasy fiction",40)
  ];
  try{
    const [jikan,w1,w2,w3,books]=await Promise.all(tasks);
    REMOTE_LIBRARY.characters=[...new Set([...jikan,...w1,...w2,...w3])];
    REMOTE_LIBRARY.works=[...new Set(books)];
  }catch(e){}
  window.dispatchEvent(new CustomEvent("referencepoolready"));
}
