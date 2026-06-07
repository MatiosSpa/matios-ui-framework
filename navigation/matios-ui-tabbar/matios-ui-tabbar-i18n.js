/* ============================================================
   MATIOS UI — matios-ui-tabbar-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.TabBar
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.TabBar': {
      demo: {
        subtitle:            'Barra de navegación tipo app móvil con variantes, badges y API básica.',
        s1Title:             '1 — Base',
        s2Title:             '2 — Variantes',
        s3Title:             '3 — API',
        resultPlaceholder:   '— cambia de tab —',
        apiResultPlaceholder:'— usa la API —',
        activePrefix:        'activo → '
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.TabBar': {
      demo: {
        subtitle:            'Mobile app-style navigation bar with variants, badges and basic API.',
        s1Title:             '1 — Base',
        s2Title:             '2 — Variants',
        s3Title:             '3 — API',
        resultPlaceholder:   '— switch tab —',
        apiResultPlaceholder:'— use the API —',
        activePrefix:        'active → '
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.TabBar': {
      demo: {
        subtitle:            'Barra de navegação estilo app móvel com variantes, badges e API básica.',
        s1Title:             '1 — Base',
        s2Title:             '2 — Variantes',
        s3Title:             '3 — API',
        resultPlaceholder:   '— troque de aba —',
        apiResultPlaceholder:'— use a API —',
        activePrefix:        'ativo → '
      }
    }
  });

})(window);
