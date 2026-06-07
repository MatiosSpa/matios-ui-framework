/* ============================================================
   MATIOS UI — matios-ui-scroll-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Scroll
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Scroll': {
      demo: {
        subtitle:        'Contenedor scrollable con scrollbar temático, fades de borde adaptativos y eventos de posición.',
        s1Title:         '1 — Vertical (default)',
        s2Title:         '2 — Horizontal',
        s3Title:         '3 — Both',
        s4Title:         '4 — fadeBg personalizado (dentro de surface)',
        s5Title:         '5 — Eventos onScroll · onReachStart · onReachEnd',
        s6Title:         '6 — API programática',
        logWaiting:      'Esperando scroll...',
        logScroll:       'onScroll → scrollTop: ',
        logReachStart:   '⬆ onReachStart — llegaste al inicio',
        logReachEnd:     '⬇ onReachEnd — llegaste al final',
        alertPosition:   'Posición: ',
        para1:           'El diseño de sistemas UI es el arte de crear componentes coherentes y reutilizables que escalen en cualquier producto digital.',
        para2:           'Un buen sistema de diseño define tokens, patrones y comportamientos que los equipos pueden adoptar sin fricciones.',
        para3:           'La consistencia visual no surge de la coincidencia — surge de decisiones deliberadas documentadas y compartidas.',
        para4:           'Cada componente debería ser capaz de vivir de forma aislada sin depender del contexto donde se usa.',
        para5:           'El dark mode no es solo invertir colores — implica repensar contrastes, jerarquías y sombras desde cero.',
        para6:           'La accesibilidad no es una capa encima del diseño: es parte del diseño desde el primer trazo.',
        para7:           'Los tokens CSS permiten que un mismo componente se adapte a cualquier tema sin tocar una línea de JS.',
        chipComponents:  'Componentes',
        chipTokens:      'Tokens',
        chipThemes:      'Temas',
        chipDarkMode:    'Dark Mode',
        chipAccessibility:'Accesibilidad',
        chipTypography:  'Tipografía',
        chipIcons:       'Iconos',
        chipSpacing:     'Spacing',
        chipBorders:     'Borders',
        chipShadows:     'Shadows',
        chipAnimations:  'Animaciones',
        chipForms:       'Formularios',
        chipOverlays:    'Overlays',
        chipNavigation:  'Navegación',
        chipDisplay:     'Display'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Scroll': {
      demo: {
        subtitle:        'Scrollable container with themed scrollbar, adaptive edge fades and position events.',
        s1Title:         '1 — Vertical (default)',
        s2Title:         '2 — Horizontal',
        s3Title:         '3 — Both',
        s4Title:         '4 — Custom fadeBg (inside surface)',
        s5Title:         '5 — Events onScroll · onReachStart · onReachEnd',
        s6Title:         '6 — Programmatic API',
        logWaiting:      'Waiting for scroll...',
        logScroll:       'onScroll → scrollTop: ',
        logReachStart:   '⬆ onReachStart — you reached the start',
        logReachEnd:     '⬇ onReachEnd — you reached the end',
        alertPosition:   'Position: ',
        para1:           'UI systems design is the art of creating coherent, reusable components that scale across any digital product.',
        para2:           'A good design system defines tokens, patterns and behaviors that teams can adopt without friction.',
        para3:           'Visual consistency does not happen by chance — it comes from deliberate decisions, documented and shared.',
        para4:           'Each component should be able to live in isolation without depending on the context where it is used.',
        para5:           'Dark mode is not just inverting colors — it means rethinking contrasts, hierarchies and shadows from scratch.',
        para6:           'Accessibility is not a layer on top of design: it is part of the design from the very first stroke.',
        para7:           'CSS tokens let the same component adapt to any theme without touching a single line of JS.',
        chipComponents:  'Components',
        chipTokens:      'Tokens',
        chipThemes:      'Themes',
        chipDarkMode:    'Dark Mode',
        chipAccessibility:'Accessibility',
        chipTypography:  'Typography',
        chipIcons:       'Icons',
        chipSpacing:     'Spacing',
        chipBorders:     'Borders',
        chipShadows:     'Shadows',
        chipAnimations:  'Animations',
        chipForms:       'Forms',
        chipOverlays:    'Overlays',
        chipNavigation:  'Navigation',
        chipDisplay:     'Display'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Scroll': {
      demo: {
        subtitle:        'Contêiner rolável com barra de rolagem temática, fades de borda adaptativos e eventos de posição.',
        s1Title:         '1 — Vertical (padrão)',
        s2Title:         '2 — Horizontal',
        s3Title:         '3 — Ambos',
        s4Title:         '4 — fadeBg personalizado (dentro de surface)',
        s5Title:         '5 — Eventos onScroll · onReachStart · onReachEnd',
        s6Title:         '6 — API programática',
        logWaiting:      'Aguardando rolagem...',
        logScroll:       'onScroll → scrollTop: ',
        logReachStart:   '⬆ onReachStart — você chegou ao início',
        logReachEnd:     '⬇ onReachEnd — você chegou ao final',
        alertPosition:   'Posição: ',
        para1:           'O design de sistemas de UI é a arte de criar componentes coerentes e reutilizáveis que escalam em qualquer produto digital.',
        para2:           'Um bom sistema de design define tokens, padrões e comportamentos que as equipes podem adotar sem atrito.',
        para3:           'A consistência visual não surge por acaso — surge de decisões deliberadas, documentadas e compartilhadas.',
        para4:           'Cada componente deveria ser capaz de viver de forma isolada sem depender do contexto onde é usado.',
        para5:           'O dark mode não é apenas inverter cores — implica repensar contrastes, hierarquias e sombras do zero.',
        para6:           'A acessibilidade não é uma camada sobre o design: é parte do design desde o primeiro traço.',
        para7:           'Os tokens CSS permitem que o mesmo componente se adapte a qualquer tema sem tocar uma linha de JS.',
        chipComponents:  'Componentes',
        chipTokens:      'Tokens',
        chipThemes:      'Temas',
        chipDarkMode:    'Dark Mode',
        chipAccessibility:'Acessibilidade',
        chipTypography:  'Tipografia',
        chipIcons:       'Ícones',
        chipSpacing:     'Spacing',
        chipBorders:     'Borders',
        chipShadows:     'Shadows',
        chipAnimations:  'Animações',
        chipForms:       'Formulários',
        chipOverlays:    'Overlays',
        chipNavigation:  'Navegação',
        chipDisplay:     'Display'
      }
    }
  });

})(window);
