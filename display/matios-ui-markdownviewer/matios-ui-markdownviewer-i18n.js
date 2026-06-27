/* ============================================================
   MATIOS UI — matios-ui-markdownviewer-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.MarkdownViewer
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.MarkdownViewer': {
      demo: {
        subtitle:   'Renderiza archivos .md remotos con el estilo de prosa del framework. Fetch + parse + render en una línea.',
        s1Title:    '1 — Básico — URL remota',
        s2Title:    '2 — Cambio de URL en runtime',
        btnA:       'Componente A',
        btnB:       'Componente B'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.MarkdownViewer': {
      demo: {
        subtitle:   'Renders remote .md files using the framework prose style. Fetch + parse + render in one line.',
        s1Title:    '1 — Basic — remote URL',
        s2Title:    '2 — Runtime URL change',
        btnA:       'Component A',
        btnB:       'Component B'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.MarkdownViewer': {
      demo: {
        subtitle:   'Renderiza arquivos .md remotos com o estilo de prosa do framework. Fetch + parse + render em uma linha.',
        s1Title:    '1 — Básico — URL remota',
        s2Title:    '2 — Troca de URL em runtime',
        btnA:       'Componente A',
        btnB:       'Componente B'
      }
    }
  });

})(window);
