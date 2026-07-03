/* ============================================================
   MATIOS UI — matios-ui-itemlist-i18n.js
   i18n del componente (es / en / pt)
   Namespace: MTS.ItemList
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.ItemList': {
      empty:  'Sin resultados.',
      remove: 'Eliminar'
    }
  });

  MTS.registerLocale('en', {
    'MTS.ItemList': {
      empty:  'No results.',
      remove: 'Remove'
    }
  });

  MTS.registerLocale('pt', {
    'MTS.ItemList': {
      empty:  'Sem resultados.',
      remove: 'Remover'
    }
  });

})(window);
