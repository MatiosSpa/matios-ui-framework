/* ============================================================
   MATIOS UI — matios-ui-codeblock-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.CodeBlock
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.CodeBlock': {
      copy:    'Copiar',
      copied:  '¡Copiado!',
      tooltip: 'Copiar',
      demo: {
        subtitle:   'Resaltado de sintaxis Matios para snippets compartidos, preview de código en demos y vistas de fuente dentro del showcase.',
        s1Title:    '1 — HTML / CSS / JavaScript',
        s2Title:    '2 — CSharp / Java / SQL',
        s3Title:    '3 — Bash / JSON / YAML',
        s4Title:    '4 — Ajuste de línea opcional'
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.CodeBlock': {
      copy:    'Copy',
      copied:  'Copied!',
      tooltip: 'Copy',
      demo: {
        subtitle:   'Matios syntax highlighting for shared snippets, code preview in demos and source views inside the showcase.',
        s1Title:    '1 — HTML / CSS / JavaScript',
        s2Title:    '2 — CSharp / Java / SQL',
        s3Title:    '3 — Bash / JSON / YAML',
        s4Title:    '4 — Optional wrap'
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.CodeBlock': {
      copy:    'Copiar',
      copied:  'Copiado!',
      tooltip: 'Copiar',
      demo: {
        subtitle:   'Realce de sintaxe Matios para snippets compartilhados, preview de código em demos e visualizações de fonte dentro do showcase.',
        s1Title:    '1 — HTML / CSS / JavaScript',
        s2Title:    '2 — CSharp / Java / SQL',
        s3Title:    '3 — Bash / JSON / YAML',
        s4Title:    '4 — Quebra de linha opcional'
      }
    }
  });

})(window);
