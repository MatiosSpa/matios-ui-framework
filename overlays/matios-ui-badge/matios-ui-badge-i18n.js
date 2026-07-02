/* ============================================================
   MATIOS UI — matios-ui-badge-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Badge
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Badge': {
      removeLabel: 'Quitar',
      demo: {
        subtitle:        'Badges, pills y contadores — solo CSS o vía JS — tags removibles y notification dots.',
        s1Title:         '1 — Solo CSS',
        s2Title:         '2 — Tamaños y formas',
        s3Title:         '3 — Vía JS',
        jsNoneNeeded:    '// No se necesita JavaScript.',
        jsCssOnly:       '// Esta variante usa solo clases CSS del componente.',
        jsCssShapes:     '// Tamaños, shapes y dot/pulse funcionan solo con clases CSS.',
        resultPlaceholder: '— usa los botones o remueve un tag —',
        removePrefix:    'onRemove → '
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Badge': {
      removeLabel: 'Remove',
      demo: {
        subtitle:        'Badges, pills and counters — CSS-only or via JS — removable tags and notification dots.',
        s1Title:         '1 — CSS only',
        s2Title:         '2 — Sizes and shapes',
        s3Title:         '3 — Via JS',
        jsNoneNeeded:    '// No JavaScript needed.',
        jsCssOnly:       '// This variant uses only the component CSS classes.',
        jsCssShapes:     '// Sizes, shapes and dot/pulse work with CSS classes only.',
        resultPlaceholder: '— use the buttons or remove a tag —',
        removePrefix:    'onRemove → '
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Badge': {
      removeLabel: 'Remover',
      demo: {
        subtitle:        'Badges, pills e contadores — só CSS ou via JS — tags removíveis e notification dots.',
        s1Title:         '1 — Só CSS',
        s2Title:         '2 — Tamanhos e formas',
        s3Title:         '3 — Via JS',
        jsNoneNeeded:    '// Nenhum JavaScript necessário.',
        jsCssOnly:       '// Esta variante usa apenas classes CSS do componente.',
        jsCssShapes:     '// Tamanhos, formas e dot/pulse funcionam apenas com classes CSS.',
        resultPlaceholder: '— use os botões ou remova um tag —',
        removePrefix:    'onRemove → '
      }
    }
  });

})(window);
