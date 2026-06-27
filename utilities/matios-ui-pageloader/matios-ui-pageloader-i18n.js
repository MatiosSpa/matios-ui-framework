/* ============================================================
   MATIOS UI — matios-ui-pageloader-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.PageLoader
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.PageLoader': {
      demo: {
        subtitle:       'Indicador de carga de página estilo NProgress. Barra fija con avance automático (trickle), overlay blocker con spinner o progress circle, o ambos a la vez.',
        s1Title:        '1 — Barra (top)',
        s2Title:        '2 — Barra (bottom) y variantes',
        s3Title:        '3 — Blocker con spinner',
        s4Title:        '4 — Blocker con progress circle',
        s5Title:        '5 — Modo both (barra + blocker)',
        s6Title:        '6 — Error',
        btnTop:         'Simular carga (top)',
        btnSpinner:     'Simular blocker (spinner)',
        btnCircle:      'Simular blocker (progress circle)',
        btnBoth:        'Simular barra + blocker',
        btnDone:        'Simular done()',
        btnError:       'Simular error()'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.PageLoader': {
      demo: {
        subtitle:       'NProgress-style page loading indicator. Fixed bar with automatic trickle, blocker overlay with spinner or progress circle, or both at once.',
        s1Title:        '1 — Bar (top)',
        s2Title:        '2 — Bar (bottom) and variants',
        s3Title:        '3 — Blocker with spinner',
        s4Title:        '4 — Blocker with progress circle',
        s5Title:        '5 — Both mode (bar + blocker)',
        s6Title:        '6 — Error',
        btnTop:         'Simulate load (top)',
        btnSpinner:     'Simulate blocker (spinner)',
        btnCircle:      'Simulate blocker (progress circle)',
        btnBoth:        'Simulate bar + blocker',
        btnDone:        'Simulate done()',
        btnError:       'Simulate error()'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.PageLoader': {
      demo: {
        subtitle:       'Indicador de carregamento de página estilo NProgress. Barra fixa com avanço automático (trickle), overlay blocker com spinner ou progress circle, ou ambos ao mesmo tempo.',
        s1Title:        '1 — Barra (topo)',
        s2Title:        '2 — Barra (base) e variantes',
        s3Title:        '3 — Blocker com spinner',
        s4Title:        '4 — Blocker com progress circle',
        s5Title:        '5 — Modo both (barra + blocker)',
        s6Title:        '6 — Erro',
        btnTop:         'Simular carregamento (topo)',
        btnSpinner:     'Simular blocker (spinner)',
        btnCircle:      'Simular blocker (progress circle)',
        btnBoth:        'Simular barra + blocker',
        btnDone:        'Simular done()',
        btnError:       'Simular error()'
      }
    }
  });

})(window);
