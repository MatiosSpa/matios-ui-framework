/* ============================================================
   MATIOS UI — matios-ui-timeline-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Timeline
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.Timeline': {
      demo: {
        subtitle:        'Demo de Timeline actualizado al patrón Preview | HTML | JavaScript.',
        s1Title:         '1 — Básica',
        s2Title:         '2 — Alineaciones',
        s3Title:         '3 — addEvent() / setEvents()',
        initialTitle:    'Evento inicial',
        initialDate:     'Inicio',
        randomTitle:     'Evento #',
        randomDate:      'Ahora',
        randomDesc:      'Creado dinámicamente.'
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.Timeline': {
      demo: {
        subtitle:        'Timeline demo updated to the Preview | HTML | JavaScript pattern.',
        s1Title:         '1 — Basic',
        s2Title:         '2 — Alignments',
        s3Title:         '3 — addEvent() / setEvents()',
        initialTitle:    'Initial event',
        initialDate:     'Start',
        randomTitle:     'Event #',
        randomDate:      'Now',
        randomDesc:      'Created dynamically.'
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.Timeline': {
      demo: {
        subtitle:        'Demo de Timeline atualizado ao padrão Preview | HTML | JavaScript.',
        s1Title:         '1 — Básica',
        s2Title:         '2 — Alinhamentos',
        s3Title:         '3 — addEvent() / setEvents()',
        initialTitle:    'Evento inicial',
        initialDate:     'Início',
        randomTitle:     'Evento #',
        randomDate:      'Agora',
        randomDesc:      'Criado dinamicamente.'
      }
    }
  });

})(window);
