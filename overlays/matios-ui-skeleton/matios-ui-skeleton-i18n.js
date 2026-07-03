/* ============================================================
   MATIOS UI — matios-ui-skeleton-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Skeleton
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.Skeleton': {
      demo: {
        subtitle:        'Placeholder de carga animado — texto, círculo, rectángulo, tarjeta, lista, tabla · animaciones pulse y wave.',
        s1Title:         '1 — Texto · Círculo · Rectángulo',
        s2Title:         '2 — Tarjeta · Lista · Tabla',
        s3Title:         '3 — Animaciones',
        labelText:       'variant: text (4 líneas)',
        labelCircle:     'variant: circle',
        labelRect:       'variant: rect',
        labelCard:       'variant: card',
        labelList:       'variant: list (4 ítems)',
        labelTable:      'variant: table',
        labelPulse:      'animation: pulse',
        labelWave:       'animation: wave',
        labelNone:       'animation: none'
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.Skeleton': {
      demo: {
        subtitle:        'Animated loading placeholder — text, circle, rect, card, list, table · pulse and wave animations.',
        s1Title:         '1 — Text · Circle · Rect',
        s2Title:         '2 — Card · List · Table',
        s3Title:         '3 — Animations',
        labelText:       'variant: text (4 lines)',
        labelCircle:     'variant: circle',
        labelRect:       'variant: rect',
        labelCard:       'variant: card',
        labelList:       'variant: list (4 items)',
        labelTable:      'variant: table',
        labelPulse:      'animation: pulse',
        labelWave:       'animation: wave',
        labelNone:       'animation: none'
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.Skeleton': {
      demo: {
        subtitle:        'Placeholder de carregamento animado — texto, círculo, retângulo, cartão, lista, tabela · animações pulse e wave.',
        s1Title:         '1 — Texto · Círculo · Retângulo',
        s2Title:         '2 — Cartão · Lista · Tabela',
        s3Title:         '3 — Animações',
        labelText:       'variant: text (4 linhas)',
        labelCircle:     'variant: circle',
        labelRect:       'variant: rect',
        labelCard:       'variant: card',
        labelList:       'variant: list (4 itens)',
        labelTable:      'variant: table',
        labelPulse:      'animation: pulse',
        labelWave:       'animation: wave',
        labelNone:       'animation: none'
      }
    }
  });

})(window);
