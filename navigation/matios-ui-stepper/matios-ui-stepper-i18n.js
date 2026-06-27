/* ============================================================
   MATIOS UI — matios-ui-stepper-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Stepper
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Stepper': {
      demo: {
        subtitle:                   'Wizard + progreso. Componente oficial unificado para flujos, checkout, compacto y puntos.',
        aliasNote:                  'MTS.StepProgress queda como alias de compatibilidad. Los ejemplos nuevos viven en MTS.Stepper.',
        s1Title:                    '1 — Wizard',
        s2Title:                    '2 — Checkout con navegación',
        s3Title:                    '3 — Compacto + clickable',
        s4Title:                    '4 — Puntos / pipeline',
        s5Title:                    '5 — API + estado',
        resultWizardPlaceholder:    '— navega los pasos —',
        resultCheckoutPlaceholder:  '— navega el checkout —',
        resultCompactPlaceholder:   '— haz click en los pasos —',
        resultStatusPlaceholder:    '— usa la API —',
        pipelineLabel:              'Seguimiento de pipeline',
        compactStep1:               'Datos',
        compactStep2:               'Seguridad',
        compactStep3:               'Confirmar',
        compactStep4:               'Listo',
        stepPrefix:                 'paso → ',
        statusPrefix:               'estado → '
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Stepper': {
      demo: {
        subtitle:                   'Wizard + progress. Official unified component for flows, checkout, compact and dots.',
        aliasNote:                  'MTS.StepProgress remains as a compatibility alias. New examples live in MTS.Stepper.',
        s1Title:                    '1 — Wizard',
        s2Title:                    '2 — Checkout with navigation',
        s3Title:                    '3 — Compact + clickable',
        s4Title:                    '4 — Dots / pipeline',
        s5Title:                    '5 — API + status',
        resultWizardPlaceholder:    '— navigate the steps —',
        resultCheckoutPlaceholder:  '— navigate the checkout —',
        resultCompactPlaceholder:   '— click on the steps —',
        resultStatusPlaceholder:    '— use the API —',
        pipelineLabel:              'Pipeline tracker',
        compactStep1:               'Details',
        compactStep2:               'Security',
        compactStep3:               'Confirm',
        compactStep4:               'Done',
        stepPrefix:                 'step → ',
        statusPrefix:               'status → '
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Stepper': {
      demo: {
        subtitle:                   'Wizard + progresso. Componente oficial unificado para fluxos, checkout, compacto e pontos.',
        aliasNote:                  'MTS.StepProgress permanece como alias de compatibilidade. Os novos exemplos vivem em MTS.Stepper.',
        s1Title:                    '1 — Wizard',
        s2Title:                    '2 — Checkout com navegação',
        s3Title:                    '3 — Compacto + clicável',
        s4Title:                    '4 — Pontos / pipeline',
        s5Title:                    '5 — API + status',
        resultWizardPlaceholder:    '— navegue pelos passos —',
        resultCheckoutPlaceholder:  '— navegue pelo checkout —',
        resultCompactPlaceholder:   '— clique nos passos —',
        resultStatusPlaceholder:    '— use a API —',
        pipelineLabel:              'Rastreador de pipeline',
        compactStep1:               'Dados',
        compactStep2:               'Segurança',
        compactStep3:               'Confirmar',
        compactStep4:               'Pronto',
        stepPrefix:                 'passo → ',
        statusPrefix:               'status → '
      }
    }
  });

})(window);
