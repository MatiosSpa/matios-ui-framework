/* ============================================================
   MATIOS UI — matios-ui-tooltip-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Tooltip
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Tooltip': {
      demo: {
        subtitle:        'Tooltip con posicionamiento inteligente — hover, click, focus, variantes dark/light y contenido HTML.',
        s1Title:         '1 — Posiciones',
        s2Title:         '2 — Triggers',
        s3Title:         '3 — Variantes y HTML',
        s4Title:         '4 — initAll()',
        // Sección 1 — Posiciones
        labelTop:        'Arriba',
        labelBottom:     'Abajo',
        labelLeft:       'Izquierda',
        labelRight:      'Derecha',
        ttTop:           'Tooltip arriba',
        ttBottom:        'Tooltip abajo',
        ttLeft:          'Tooltip izquierda',
        ttRight:         'Tooltip derecha',
        // Sección 2 — Triggers
        labelHover:      'Hover',
        labelClick:      'Click',
        focusPlaceholder:'Enfócame',
        ttHover:         'Tooltip al pasar el mouse',
        ttClick:         'Click de nuevo para ocultar',
        ttFocus:         'Ingresa tu correo electrónico',
        // Sección 3 — Variantes y HTML
        labelDark:       'Oscuro',
        labelLight:      'Claro',
        labelHtml:       'Con HTML',
        labelCustom:     'Color personalizado',
        labelDelay:      'Con retraso',
        ttDark:          'Variante oscura (por defecto)',
        ttLight:         'Variante clara',
        ttHtml:          '<strong>Tip pro:</strong> Usa ⌘S para guardar.',
        ttCustom:        'Tooltip violeta personalizado',
        ttDelay:         'Aparece tras 500ms',
        // Sección 4 — initAll()
        ttDataTop:       'Tooltip desde data-tooltip',
        ttDataBottom:    'Posición abajo',
        ttDataLight:     'Variante clara',
        ttDataClick:     'Trigger por click'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Tooltip': {
      demo: {
        subtitle:        'Tooltip with smart positioning — hover, click, focus, dark/light variants and HTML content.',
        s1Title:         '1 — Positions',
        s2Title:         '2 — Triggers',
        s3Title:         '3 — Variants and HTML',
        s4Title:         '4 — initAll()',
        // Section 1 — Positions
        labelTop:        'Top',
        labelBottom:     'Bottom',
        labelLeft:       'Left',
        labelRight:      'Right',
        ttTop:           'Tooltip top',
        ttBottom:        'Tooltip bottom',
        ttLeft:          'Tooltip left',
        ttRight:         'Tooltip right',
        // Section 2 — Triggers
        labelHover:      'Hover',
        labelClick:      'Click',
        focusPlaceholder:'Focus me',
        ttHover:         'Hover tooltip',
        ttClick:         'Click again to hide',
        ttFocus:         'Enter your email address',
        // Section 3 — Variants and HTML
        labelDark:       'Dark',
        labelLight:      'Light',
        labelHtml:       'With HTML',
        labelCustom:     'Custom color',
        labelDelay:      'With delay',
        ttDark:          'Dark variant (default)',
        ttLight:         'Light variant',
        ttHtml:          '<strong>Pro tip:</strong> Use ⌘S to save.',
        ttCustom:        'Custom violet tooltip',
        ttDelay:         'Appears after 500ms',
        // Section 4 — initAll()
        ttDataTop:       'Tooltip from data-tooltip',
        ttDataBottom:    'Bottom position',
        ttDataLight:     'Light variant',
        ttDataClick:     'Click trigger'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Tooltip': {
      demo: {
        subtitle:        'Tooltip com posicionamento inteligente — hover, clique, foco, variantes dark/light e conteúdo HTML.',
        s1Title:         '1 — Posições',
        s2Title:         '2 — Gatilhos',
        s3Title:         '3 — Variantes e HTML',
        s4Title:         '4 — initAll()',
        // Seção 1 — Posições
        labelTop:        'Acima',
        labelBottom:     'Abaixo',
        labelLeft:       'Esquerda',
        labelRight:      'Direita',
        ttTop:           'Tooltip acima',
        ttBottom:        'Tooltip abaixo',
        ttLeft:          'Tooltip à esquerda',
        ttRight:         'Tooltip à direita',
        // Seção 2 — Gatilhos
        labelHover:      'Hover',
        labelClick:      'Clique',
        focusPlaceholder:'Foque aqui',
        ttHover:         'Tooltip ao passar o mouse',
        ttClick:         'Clique novamente para ocultar',
        ttFocus:         'Digite seu endereço de e-mail',
        // Seção 3 — Variantes e HTML
        labelDark:       'Escuro',
        labelLight:      'Claro',
        labelHtml:       'Com HTML',
        labelCustom:     'Cor personalizada',
        labelDelay:      'Com atraso',
        ttDark:          'Variante escura (padrão)',
        ttLight:         'Variante clara',
        ttHtml:          '<strong>Dica pro:</strong> Use ⌘S para salvar.',
        ttCustom:        'Tooltip violeta personalizado',
        ttDelay:         'Aparece após 500ms',
        // Seção 4 — initAll()
        ttDataTop:       'Tooltip a partir de data-tooltip',
        ttDataBottom:    'Posição abaixo',
        ttDataLight:     'Variante clara',
        ttDataClick:     'Gatilho por clique'
      }
    }
  });

})(window);
