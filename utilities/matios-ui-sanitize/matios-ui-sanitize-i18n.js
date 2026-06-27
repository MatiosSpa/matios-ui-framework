/* ============================================================
   MATIOS UI — matios-ui-sanitize-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Sanitize
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Sanitize': {
      demo: {
        subtitle:        'Utilidad de escape y sanitización para prevención de XSS. Sin dependencias.',
        s1Title:         '1 — html() — Sanitiza HTML completo',
        s2Title:         '2 — escape() — Escapa entidades HTML',
        s3Title:         '3 — attr() — Seguro para atributos',
        s4Title:         '4 — url() — Bloquea protocolos peligrosos',
        s5Title:         '5 — text() — Para textContent',
        labelInput:      'Entrada — escribe algo',
        labelOutputHtml: 'Salida sanitizada',
        labelOutputEsc:  'Salida escapada',
        placeholderScript: 'Ej: <script>alert(1)<\/script>',
        placeholderAttr:   'Ej: He said "hi" & bye',
        urlBlocked:      '(bloqueada — retorna "")'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Sanitize': {
      demo: {
        subtitle:        'Escape and sanitization utility for XSS prevention. No dependencies.',
        s1Title:         '1 — html() — Sanitizes full HTML',
        s2Title:         '2 — escape() — Escapes HTML entities',
        s3Title:         '3 — attr() — Safe for attributes',
        s4Title:         '4 — url() — Blocks dangerous protocols',
        s5Title:         '5 — text() — For textContent',
        labelInput:      'Input — type something',
        labelOutputHtml: 'Sanitized output',
        labelOutputEsc:  'Escaped output',
        placeholderScript: 'E.g.: <script>alert(1)<\/script>',
        placeholderAttr:   'E.g.: He said "hi" & bye',
        urlBlocked:      '(blocked — returns "")'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Sanitize': {
      demo: {
        subtitle:        'Utilitário de escape e sanitização para prevenção de XSS. Sem dependências.',
        s1Title:         '1 — html() — Sanitiza HTML completo',
        s2Title:         '2 — escape() — Escapa entidades HTML',
        s3Title:         '3 — attr() — Seguro para atributos',
        s4Title:         '4 — url() — Bloqueia protocolos perigosos',
        s5Title:         '5 — text() — Para textContent',
        labelInput:      'Entrada — digite algo',
        labelOutputHtml: 'Saída sanitizada',
        labelOutputEsc:  'Saída escapada',
        placeholderScript: 'Ex: <script>alert(1)<\/script>',
        placeholderAttr:   'Ex: He said "hi" & bye',
        urlBlocked:      '(bloqueada — retorna "")'
      }
    }
  });

})(window);
