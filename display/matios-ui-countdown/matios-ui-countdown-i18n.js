/* ============================================================
   MATIOS UI — matios-ui-countdown-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Countdown
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Countdown': {
      demo: {
        subtitle:          'Temporizador de cuenta regresiva animado — bloques, compacto, minimal y API imperativa.',
        s1Title:           '1 — Variante: bloques (por defecto)',
        s2Title:           '2 — Compacto y minimal',
        s3Title:           '3 — API — pause · resume · setTarget',
        resultPlaceholder: '— usa los botones —',
        tickPrefix:        'onTick → ',
        completeText:      'onComplete → ¡Tiempo agotado!'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Countdown': {
      demo: {
        subtitle:          'Animated countdown timer — blocks, compact, minimal, and imperative API.',
        s1Title:           '1 — Variant: blocks (default)',
        s2Title:           '2 — Compact and minimal',
        s3Title:           '3 — API — pause · resume · setTarget',
        resultPlaceholder: '— use the buttons —',
        tickPrefix:        'onTick → ',
        completeText:      'onComplete → Time is up!'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Countdown': {
      demo: {
        subtitle:          'Cronômetro de contagem regressiva animado — blocos, compacto, minimal e API imperativa.',
        s1Title:           '1 — Variante: blocos (padrão)',
        s2Title:           '2 — Compacto e minimal',
        s3Title:           '3 — API — pause · resume · setTarget',
        resultPlaceholder: '— use os botões —',
        tickPrefix:        'onTick → ',
        completeText:      'onComplete → Tempo esgotado!'
      }
    }
  });

})(window);
