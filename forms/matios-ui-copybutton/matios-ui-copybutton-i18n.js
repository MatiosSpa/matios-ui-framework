/* ============================================================
   MATIOS UI — matios-ui-copybutton-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.CopyButton
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.CopyButton': {
      demo: {
        subtitle:        'Botón para copiar texto o contenido objetivo al portapapeles con feedback visual.',
        s1Title:         '1 — Variantes y tamaños',
        s2Title:         '2 — Solo ícono',
        s3Title:         '3 — Con target',
        s4Title:         '4 — Bloque de código',
        s5Title:         '5 — HTML declarativo + enhancement',
        resultPlaceholder: '— haz click para copiar —',
        copiedPrefix:    'copiado: '
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.CopyButton': {
      demo: {
        subtitle:        'Button to copy text or target content to the clipboard with visual feedback.',
        s1Title:         '1 — Variants and sizes',
        s2Title:         '2 — Icon only',
        s3Title:         '3 — With target',
        s4Title:         '4 — Code block',
        s5Title:         '5 — Declarative HTML + enhancement',
        resultPlaceholder: '— click to copy —',
        copiedPrefix:    'copied: '
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.CopyButton': {
      demo: {
        subtitle:        'Botão para copiar texto ou conteúdo alvo para a área de transferência com feedback visual.',
        s1Title:         '1 — Variantes e tamanhos',
        s2Title:         '2 — Apenas ícone',
        s3Title:         '3 — Com target',
        s4Title:         '4 — Bloco de código',
        s5Title:         '5 — HTML declarativo + enhancement',
        resultPlaceholder: '— clique para copiar —',
        copiedPrefix:    'copiado: '
      }
    }
  });

})(window);
