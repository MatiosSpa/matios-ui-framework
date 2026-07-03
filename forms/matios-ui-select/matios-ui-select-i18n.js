/* ============================================================
   MATIOS UI — matios-ui-select-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Select
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.Select': {
      messages: { required: 'Este campo es obligatorio', placeholder: 'Selecciona...', searchPlaceholder: 'Buscar...', noResults: 'Sin resultados', minCharsHint: 'Escribe al menos {n} caracteres para buscar', loading: 'Buscando...' },
      demo: {
        subtitle:            'Select personalizado con búsqueda, multi-select, carga asíncrona, cascada y enhancement progresivo desde HTML declarativo.',
        s1Title:             '1 — Variantes básicas',
        s2Title:             '2 — Multi-select',
        s3Title:             '3 — Autocomplete',
        s4Title:             '4 — Cascada País → Estado → Ciudad',
        s5Title:             '5 — HTML declarativo + enhancement',
        emptyResult:         '— sin selección —',
        labelDeclarative:    'HTML declarativo',
        labelEnhanced:       'HTML declarativo + enhancement',
        valuePrefix:         'value → ',
        countryPrefix:       'country → ',
        statePrefix:         'state → ',
        cityPrefix:          'city → ',
        textSeparator:       ' | text → '
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.Select': {
      messages: { required: 'This field is required', placeholder: 'Select...', searchPlaceholder: 'Search...', noResults: 'No results', minCharsHint: 'Type at least {n} characters to search', loading: 'Searching...' },
      demo: {
        subtitle:            'Custom select with search, multi-select, async loading, cascading and progressive enhancement from declarative HTML.',
        s1Title:             '1 — Basic variants',
        s2Title:             '2 — Multi-select',
        s3Title:             '3 — Autocomplete',
        s4Title:             '4 — Cascade Country → State → City',
        s5Title:             '5 — Declarative HTML + enhancement',
        emptyResult:         '— no selection —',
        labelDeclarative:    'Declarative HTML',
        labelEnhanced:       'Declarative HTML + enhancement',
        valuePrefix:         'value → ',
        countryPrefix:       'country → ',
        statePrefix:         'state → ',
        cityPrefix:          'city → ',
        textSeparator:       ' | text → '
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.Select': {
      messages: { required: 'Este campo é obrigatório', placeholder: 'Selecione...', searchPlaceholder: 'Buscar...', noResults: 'Sem resultados', minCharsHint: 'Digite ao menos {n} caracteres para buscar', loading: 'Buscando...' },
      demo: {
        subtitle:            'Select personalizado com busca, multi-select, carregamento assíncrono, cascata e enhancement progressivo a partir de HTML declarativo.',
        s1Title:             '1 — Variantes básicas',
        s2Title:             '2 — Multi-select',
        s3Title:             '3 — Autocomplete',
        s4Title:             '4 — Cascata País → Estado → Cidade',
        s5Title:             '5 — HTML declarativo + enhancement',
        emptyResult:         '— sem seleção —',
        labelDeclarative:    'HTML declarativo',
        labelEnhanced:       'HTML declarativo + enhancement',
        valuePrefix:         'value → ',
        countryPrefix:       'country → ',
        statePrefix:         'state → ',
        cityPrefix:          'city → ',
        textSeparator:       ' | text → '
      }
    }
  });

})(window);
