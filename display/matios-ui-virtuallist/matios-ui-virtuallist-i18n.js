/* ============================================================
   MATIOS UI — matios-ui-virtuallist-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.VirtualList
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.VirtualList': {
      demo: {
        subtitle:           'Lista virtualizada — renderiza solo los ítems visibles · 100.000+ filas · scroll infinito vía onEndReached.',
        s1Title:            '1 — 100.000 ítems virtualizados',
        s2Title:            '2 — appendItems() — Scroll infinito simulado',
        bigResultHint:      '— haz scroll en la lista —',
        infResultHint:      '— haz scroll hasta el final para cargar más —',
        scrollEcho:         'onScroll → primer visible:{first} último visible:{last}',
        appendEcho:         'appendItems() → total: {total} ítems',
        badgeActive:        'Activo',
        badgeInactive:      'Inactivo',
        itemName:           'Usuario #{n}',
        postName:           'Publicación #{n}'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.VirtualList': {
      demo: {
        subtitle:           'Virtualized list — renders only visible items · 100,000+ rows · infinite scroll via onEndReached.',
        s1Title:            '1 — 100,000 virtualized items',
        s2Title:            '2 — appendItems() — Simulated infinite scroll',
        bigResultHint:      '— scroll the list —',
        infResultHint:      '— scroll to the bottom to load more —',
        scrollEcho:         'onScroll → firstVisible:{first} lastVisible:{last}',
        appendEcho:         'appendItems() → total: {total} items',
        badgeActive:        'Active',
        badgeInactive:      'Inactive',
        itemName:           'User #{n}',
        postName:           'Post #{n}'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.VirtualList': {
      demo: {
        subtitle:           'Lista virtualizada — renderiza apenas os itens visíveis · 100.000+ linhas · rolagem infinita via onEndReached.',
        s1Title:            '1 — 100.000 itens virtualizados',
        s2Title:            '2 — appendItems() — Rolagem infinita simulada',
        bigResultHint:      '— role a lista —',
        infResultHint:      '— role até o fim para carregar mais —',
        scrollEcho:         'onScroll → primeiro visível:{first} último visível:{last}',
        appendEcho:         'appendItems() → total: {total} itens',
        badgeActive:        'Ativo',
        badgeInactive:      'Inativo',
        itemName:           'Usuário #{n}',
        postName:           'Publicação #{n}'
      }
    }
  });

})(window);
