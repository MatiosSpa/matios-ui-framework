/* ============================================================
   MATIOS UI — matios-ui-ratingreview-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.RatingReview
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.RatingReview': {
      demo: {
        subtitle:               'Widget de reseñas con promedio, desglose por estrellas y votación interactiva.',
        s1Title:                '1 — Solo lectura con desglose',
        s2Title:                '2 — Interactivo — permite votar',
        s3Title:                '3 — update() — actualizar datos en vivo',
        interactivePlaceholder: '— haz click en las estrellas para calificar —',
        livePlaceholder:        '— usa los botones para simular nuevas reseñas —',
        onRatePrefix:           'onRate → estrellas: ',
        liveNewReview:          'update() → nueva reseña ★',
        liveAverage:            ' · promedio: ',
        liveTotal:              ' · total: ',
        liveReset:              'reset() → datos originales restaurados'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.RatingReview': {
      demo: {
        subtitle:               'Review widget with average, star breakdown and interactive voting.',
        s1Title:                '1 — Read-only with breakdown',
        s2Title:                '2 — Interactive — allows voting',
        s3Title:                '3 — update() — live data update',
        interactivePlaceholder: '— click the stars to rate —',
        livePlaceholder:        '— use the buttons to simulate new reviews —',
        onRatePrefix:           'onRate → stars: ',
        liveNewReview:          'update() → new review ★',
        liveAverage:            ' · average: ',
        liveTotal:              ' · total: ',
        liveReset:              'reset() → original data restored'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.RatingReview': {
      demo: {
        subtitle:               'Widget de avaliações com média, distribuição por estrelas e votação interativa.',
        s1Title:                '1 — Somente leitura com distribuição',
        s2Title:                '2 — Interativo — permite votar',
        s3Title:                '3 — update() — atualizar dados ao vivo',
        interactivePlaceholder: '— clique nas estrelas para avaliar —',
        livePlaceholder:        '— use os botões para simular novas avaliações —',
        onRatePrefix:           'onRate → estrelas: ',
        liveNewReview:          'update() → nova avaliação ★',
        liveAverage:            ' · média: ',
        liveTotal:              ' · total: ',
        liveReset:              'reset() → dados originais restaurados'
      }
    }
  });

})(window);
