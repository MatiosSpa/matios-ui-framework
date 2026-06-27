/* ============================================================
   MATIOS UI — matios-ui-infinite-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Infinite
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Infinite': {
      demo: {
        subtitle:               'Scroll infinito con carga incremental controlada por el desarrollador en layouts vertical y grid.',
        s1Title:                '1 — Layout vertical',
        s2Title:                '2 — Layout grid',
        s3Title:                '3 — reset() y eventos',
        resultVerticalHint:     '— haz scroll hasta el final para cargar más —',
        resultGridHint:         '— layout grid con tarjetas simples —',
        resultEventsHint:       '— observa onLoad y onEnd —',
        itemUserPrefix:         'Usuario ',
        itemProductPrefix:      'Producto ',
        itemRecordPrefix:       'Registro ',
        echoLoadPagePrefix:     'onLoad → página:',
        echoLoadItems:          ' ítems:',
        echoEndTotalPrefix:     'onEnd → total:',
        resetLabel:             'reset()'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Infinite': {
      demo: {
        subtitle:               'Infinite scroll with incremental loading controlled by the developer in vertical and grid layouts.',
        s1Title:                '1 — Vertical layout',
        s2Title:                '2 — Grid layout',
        s3Title:                '3 — reset() and events',
        resultVerticalHint:     '— scroll to the bottom to load more —',
        resultGridHint:         '— grid layout with simple cards —',
        resultEventsHint:       '— watch onLoad and onEnd —',
        itemUserPrefix:         'User ',
        itemProductPrefix:      'Product ',
        itemRecordPrefix:       'Record ',
        echoLoadPagePrefix:     'onLoad → page:',
        echoLoadItems:          ' items:',
        echoEndTotalPrefix:     'onEnd → total:',
        resetLabel:             'reset()'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Infinite': {
      demo: {
        subtitle:               'Scroll infinito com carregamento incremental controlado pelo desenvolvedor em layouts vertical e grade.',
        s1Title:                '1 — Layout vertical',
        s2Title:                '2 — Layout grade',
        s3Title:                '3 — reset() e eventos',
        resultVerticalHint:     '— role até o final para carregar mais —',
        resultGridHint:         '— layout grade com cartões simples —',
        resultEventsHint:       '— observe onLoad e onEnd —',
        itemUserPrefix:         'Usuário ',
        itemProductPrefix:      'Produto ',
        itemRecordPrefix:       'Registro ',
        echoLoadPagePrefix:     'onLoad → página:',
        echoLoadItems:          ' itens:',
        echoEndTotalPrefix:     'onEnd → total:',
        resetLabel:             'reset()'
      }
    }
  });

})(window);
