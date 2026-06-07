/* ============================================================
   MATIOS UI — matios-ui-spinner-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Spinner
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Spinner': {
      demo: {
        subtitle:        'Indicadores de carga animados — 12 variantes, tonos de color, 5 tamaños, label y overlay.',
        s1Title:         '1 — Variantes',
        s2Title:         '2 — Tamaños',
        s3Title:         '3 — Colores',
        s4Title:         '4 — Multi-color',
        s5Title:         '5 — Label',
        s6Title:         '6 — Overlay',
        loadingLabel:    'Cargando...',
        overlayHint:     'Cubre la pantalla completa con fondo semitransparente. Se cierra automáticamente a los 2.5 s.',
        showOverlayBtn:  'Mostrar Overlay'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Spinner': {
      demo: {
        subtitle:        'Animated loading indicators — 12 variants, color tones, 5 sizes, label and overlay.',
        s1Title:         '1 — Variants',
        s2Title:         '2 — Sizes',
        s3Title:         '3 — Colors',
        s4Title:         '4 — Multi-color',
        s5Title:         '5 — Label',
        s6Title:         '6 — Overlay',
        loadingLabel:    'Loading...',
        overlayHint:     'Covers the full screen with a semitransparent backdrop. Closes automatically after 2.5 s.',
        showOverlayBtn:  'Show Overlay'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Spinner': {
      demo: {
        subtitle:        'Indicadores de carregamento animados — 12 variantes, tons de cor, 5 tamanhos, label e overlay.',
        s1Title:         '1 — Variantes',
        s2Title:         '2 — Tamanhos',
        s3Title:         '3 — Cores',
        s4Title:         '4 — Multicolor',
        s5Title:         '5 — Label',
        s6Title:         '6 — Overlay',
        loadingLabel:    'Carregando...',
        overlayHint:     'Cobre a tela inteira com fundo semitransparente. Fecha automaticamente após 2,5 s.',
        showOverlayBtn:  'Mostrar Overlay'
      }
    }
  });

})(window);
