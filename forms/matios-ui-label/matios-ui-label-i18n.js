/* ============================================================
   MATIOS UI — matios-ui-label-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Label
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Label': {
      demo: {
        subtitle:           'Etiquetas de formulario con badges required/optional, hint, error y enhancement progresivo.',
        s1Title:            '1 — HTML puro',
        s2Title:            '2 — Hint y error',
        s3Title:            '3 — Tamaños',
        s4Title:            '4 — API programática',
        s5Title:            '5 — HTML completo + enhancement',
        apiResultHint:      '— usa los botones para probar la API —'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Label': {
      demo: {
        subtitle:           'Form labels with required/optional badges, hint, error and progressive enhancement.',
        s1Title:            '1 — Pure HTML',
        s2Title:            '2 — Hint and error',
        s3Title:            '3 — Sizes',
        s4Title:            '4 — Programmatic API',
        s5Title:            '5 — Full HTML + enhancement',
        apiResultHint:      '— use the buttons to try the API —'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Label': {
      demo: {
        subtitle:           'Rótulos de formulário com badges required/optional, dica, erro e enhancement progressivo.',
        s1Title:            '1 — HTML puro',
        s2Title:            '2 — Dica e erro',
        s3Title:            '3 — Tamanhos',
        s4Title:            '4 — API programática',
        s5Title:            '5 — HTML completo + enhancement',
        apiResultHint:      '— use os botões para testar a API —'
      }
    }
  });

})(window);
