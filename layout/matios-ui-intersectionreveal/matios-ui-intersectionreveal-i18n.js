/* ============================================================
   MATIOS UI — matios-ui-intersectionreveal-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.IntersectionReveal
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.IntersectionReveal': {
      demo: {
        subtitle:      'Anima elementos al entrar al viewport. Reemplaza AOS/ScrollReveal.',
        s1Title:       '1 — Diferentes animaciones',
        cardFadeUp:    'Desde abajo',
        cardFadeDown:  'Desde arriba',
        cardFadeLeft:  'Desde la derecha',
        cardFadeRight: 'Desde la izquierda',
        cardZoom:      'Acercamiento',
        cardFlip:      'Giro vertical',
        replayBtn:     'Repetir animación'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.IntersectionReveal': {
      demo: {
        subtitle:      'Animates elements as they enter the viewport. Replaces AOS/ScrollReveal.',
        s1Title:       '1 — Different animations',
        cardFadeUp:    'From below',
        cardFadeDown:  'From above',
        cardFadeLeft:  'From the right',
        cardFadeRight: 'From the left',
        cardZoom:      'Zoom in',
        cardFlip:      'Vertical flip',
        replayBtn:     'Replay animation'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.IntersectionReveal': {
      demo: {
        subtitle:      'Anima elementos ao entrar na viewport. Substitui AOS/ScrollReveal.',
        s1Title:       '1 — Diferentes animações',
        cardFadeUp:    'De baixo',
        cardFadeDown:  'De cima',
        cardFadeLeft:  'Da direita',
        cardFadeRight: 'Da esquerda',
        cardZoom:      'Aproximação',
        cardFlip:      'Giro vertical',
        replayBtn:     'Repetir animação'
      }
    }
  });

})(window);
