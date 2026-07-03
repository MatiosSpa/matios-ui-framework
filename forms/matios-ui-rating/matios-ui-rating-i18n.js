/* ============================================================
   MATIOS UI — matios-ui-rating-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Rating
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.Rating': {
      messages: { required: 'Este campo es obligatorio', starLabel: '{n} estrellas' },
      demo: {
        subtitle:                'Calificación por estrellas con variantes, tamaños y enhancement progresivo desde HTML declarativo.',
        s1Title:                 '1 — Variantes',
        s2Title:                 '2 — Tamaños y API',
        s3Title:                 '3 — HTML declarativo + enhancement',
        resultBasicPlaceholder:  '— haz click en las estrellas —',
        resultApiPlaceholder:    '— usa los botones —',
        resultDeclPlaceholder:   '— HTML declarativo + enhancement —',
        echoBasic:               'Básico → ',
        echoHalf:                'Medio → ',
        echoScale10:             'Escala 10 → ',
        echoChange:              'onChange → ',
        echoSetValue:            'setValue(',
        echoGetValue:            'getValue() → '
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.Rating': {
      messages: { required: 'This field is required', starLabel: '{n} stars' },
      demo: {
        subtitle:                'Star rating with variants, sizes and progressive enhancement from declarative HTML.',
        s1Title:                 '1 — Variants',
        s2Title:                 '2 — Sizes and API',
        s3Title:                 '3 — Declarative HTML + enhancement',
        resultBasicPlaceholder:  '— click the stars —',
        resultApiPlaceholder:    '— use the buttons —',
        resultDeclPlaceholder:   '— declarative HTML + enhancement —',
        echoBasic:               'Basic → ',
        echoHalf:                'Half → ',
        echoScale10:             'Scale 10 → ',
        echoChange:              'onChange → ',
        echoSetValue:            'setValue(',
        echoGetValue:            'getValue() → '
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.Rating': {
      messages: { required: 'Este campo é obrigatório', starLabel: '{n} estrelas' },
      demo: {
        subtitle:                'Avaliação por estrelas com variantes, tamanhos e enhancement progressivo a partir de HTML declarativo.',
        s1Title:                 '1 — Variantes',
        s2Title:                 '2 — Tamanhos e API',
        s3Title:                 '3 — HTML declarativo + enhancement',
        resultBasicPlaceholder:  '— clique nas estrelas —',
        resultApiPlaceholder:    '— use os botões —',
        resultDeclPlaceholder:   '— HTML declarativo + enhancement —',
        echoBasic:               'Básico → ',
        echoHalf:                'Meio → ',
        echoScale10:             'Escala 10 → ',
        echoChange:              'onChange → ',
        echoSetValue:            'setValue(',
        echoGetValue:            'getValue() → '
      }
    }
  });

})(window);
