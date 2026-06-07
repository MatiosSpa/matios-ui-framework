/* ============================================================
   MATIOS UI — matios-ui-emptystate-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.EmptyState
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.EmptyState': {
      demo: {
        subtitle:           'Demo de EmptyState actualizado al patrón Preview | HTML | JavaScript.',
        s1Title:            '1 — Variantes',
        s2Title:            '2 — Tamaños',
        s3Title:            '3 — API update()',
        actionAddItem:      'Agregar ítem',
        searchTitle:        'Sin resultados para "dashboard"',
        searchDescription:  'Prueba con otras palabras.',
        actionClearSearch:  'Limpiar búsqueda',
        actionRetry:        'Reintentar',
        permsDescription:   'Contacta al administrador.',
        actionAddItemEn:    'Add item',
        dynNoResults:       'Sin resultados',
        dynAdjustFilters:   'Ajusta los filtros',
        actionClear:        'Limpiar',
        actionAdd:          'Agregar',
        resultPlaceholder:  '— usa los botones —',
        clickPrefix:        'click → '
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.EmptyState': {
      demo: {
        subtitle:           'EmptyState demo updated to the Preview | HTML | JavaScript pattern.',
        s1Title:            '1 — Variants',
        s2Title:            '2 — Sizes',
        s3Title:            '3 — update() API',
        actionAddItem:      'Add item',
        searchTitle:        'No results for "dashboard"',
        searchDescription:  'Try different keywords.',
        actionClearSearch:  'Clear search',
        actionRetry:        'Retry',
        permsDescription:   'Contact your administrator.',
        actionAddItemEn:    'Add item',
        dynNoResults:       'No results',
        dynAdjustFilters:   'Adjust the filters',
        actionClear:        'Clear',
        actionAdd:          'Add',
        resultPlaceholder:  '— use the buttons —',
        clickPrefix:        'click → '
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.EmptyState': {
      demo: {
        subtitle:           'Demo do EmptyState atualizado ao padrão Preview | HTML | JavaScript.',
        s1Title:            '1 — Variantes',
        s2Title:            '2 — Tamanhos',
        s3Title:            '3 — API update()',
        actionAddItem:      'Adicionar item',
        searchTitle:        'Sem resultados para "dashboard"',
        searchDescription:  'Tente com outras palavras.',
        actionClearSearch:  'Limpar busca',
        actionRetry:        'Tentar novamente',
        permsDescription:   'Entre em contato com o administrador.',
        actionAddItemEn:    'Add item',
        dynNoResults:       'Sem resultados',
        dynAdjustFilters:   'Ajuste os filtros',
        actionClear:        'Limpar',
        actionAdd:          'Adicionar',
        resultPlaceholder:  '— use os botões —',
        clickPrefix:        'clique → '
      }
    }
  });

})(window);
