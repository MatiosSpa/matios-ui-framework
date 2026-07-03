/* ============================================================
   MATIOS UI — matios-ui-progress-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Progress
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.Progress': {
      demo: {
        subtitle:        'Barra · círculo · indeterminado — variantes, rayado, animado y métodos de API.',
        s1Title:         '1 — Barras lineales',
        s2Title:         '2 — Rayado y tamaños',
        s3Title:         '3 — Circulares',
        s4Title:         '4 — Indeterminado + API',
        onboardingLabel: 'Incorporación',
        stepFormat:      'Paso {value} de 10',
        resultHint:      '— usa los botones —',
        onChangeEcho:    'onChange → valor:{value} pct:{pct}%',
        onCompleteEcho:  'onComplete → ¡Completado!'
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.Progress': {
      demo: {
        subtitle:        'Bar · circle · indeterminate — variants, striped, animated and API methods.',
        s1Title:         '1 — Linear bars',
        s2Title:         '2 — Striped and sizes',
        s3Title:         '3 — Circular',
        s4Title:         '4 — Indeterminate + API',
        onboardingLabel: 'Onboarding',
        stepFormat:      'Step {value} of 10',
        resultHint:      '— use the buttons —',
        onChangeEcho:    'onChange → value:{value} pct:{pct}%',
        onCompleteEcho:  'onComplete → Completed!'
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.Progress': {
      demo: {
        subtitle:        'Barra · círculo · indeterminado — variantes, listrado, animado e métodos de API.',
        s1Title:         '1 — Barras lineares',
        s2Title:         '2 — Listrado e tamanhos',
        s3Title:         '3 — Circulares',
        s4Title:         '4 — Indeterminado + API',
        onboardingLabel: 'Integração',
        stepFormat:      'Etapa {value} de 10',
        resultHint:      '— use os botões —',
        onChangeEcho:    'onChange → valor:{value} pct:{pct}%',
        onCompleteEcho:  'onComplete → Concluído!'
      }
    }
  });

})(window);
