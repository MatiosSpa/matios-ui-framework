/* ============================================================
   MATIOS UI — matios-ui-stepprogress-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.StepProgress
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.StepProgress': {
      demo: {
        subtitle:            'Alias de compatibilidad. El componente oficial ahora es MTS.Stepper.',
        compatNote:          'Usa MTS.Stepper para ejemplos nuevos. Este demo solo confirma compatibilidad.',
        s1Title:             '1 — Alias de compatibilidad',
        resultPlaceholder:   '— alias activo —',
        stepPrefix:          'paso → '
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.StepProgress': {
      demo: {
        subtitle:            'Compatibility alias. The official component is now MTS.Stepper.',
        compatNote:          'Use MTS.Stepper for new examples. This demo only confirms compatibility.',
        s1Title:             '1 — Compatibility alias',
        resultPlaceholder:   '— alias active —',
        stepPrefix:          'step → '
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.StepProgress': {
      demo: {
        subtitle:            'Alias de compatibilidade. O componente oficial agora é MTS.Stepper.',
        compatNote:          'Use MTS.Stepper para novos exemplos. Este demo apenas confirma a compatibilidade.',
        s1Title:             '1 — Alias de compatibilidade',
        resultPlaceholder:   '— alias ativo —',
        stepPrefix:          'passo → '
      }
    }
  });

})(window);
