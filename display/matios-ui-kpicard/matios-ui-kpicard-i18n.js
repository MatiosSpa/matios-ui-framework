/* ============================================================
   MATIOS UI — matios-ui-kpicard-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.KPICard
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.KPICard': {
      demo: {
        subtitle:           'Demo de KPICard actualizado al patrón Preview | HTML | JavaScript.',
        s1Title:            '1 — Básico',
        s2Title:            '2 — Variantes',
        s3Title:            '3 — Clickable',
        s4Title:            '4 — API update()',
        clickableLabel:     'Tickets abiertos',
        clickResultPlaceholder: '— click en la tarjeta —',
        clickPrefix:        'click → '
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.KPICard': {
      demo: {
        subtitle:           'KPICard demo updated to the Preview | HTML | JavaScript pattern.',
        s1Title:            '1 — Basic',
        s2Title:            '2 — Variants',
        s3Title:            '3 — Clickable',
        s4Title:            '4 — API update()',
        clickableLabel:     'Open tickets',
        clickResultPlaceholder: '— click on the card —',
        clickPrefix:        'click → '
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.KPICard': {
      demo: {
        subtitle:           'Demo do KPICard atualizado ao padrão Preview | HTML | JavaScript.',
        s1Title:            '1 — Básico',
        s2Title:            '2 — Variantes',
        s3Title:            '3 — Clicável',
        s4Title:            '4 — API update()',
        clickableLabel:     'Tickets abertos',
        clickResultPlaceholder: '— clique no cartão —',
        clickPrefix:        'clique → '
      }
    }
  });

})(window);
