/* V19 compatibility layer. The reference system now lives in library.js + engine.js. */
window.REFERENCE_ENGINE={version:'19.0.0',source:'local-library',storesProvenance:true};
window.refFor=window.refFor||function(obj){return obj?.ref||obj?.refWhy||''};
