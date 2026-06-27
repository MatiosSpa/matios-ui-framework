/* ============================================================
   MATIOS UI — matios-ui-avatar-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Avatar
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Avatar': {
      demo: {
        subtitle:    'Demo de Avatar actualizado al patrón Preview | HTML | JavaScript.',
        s1Title:     '1 — Básico y estados',
        s2Title:     '2 — Tamaños',
        s3Title:     '3 — AvatarGroup',
        s4Title:     '4 — API setStatus() / setSrc()',
        btnUpdate:   'update()',
        btnRestore:  'restaurar'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Avatar': {
      demo: {
        subtitle:    'Avatar demo updated to the Preview | HTML | JavaScript pattern.',
        s1Title:     '1 — Basic and states',
        s2Title:     '2 — Sizes',
        s3Title:     '3 — AvatarGroup',
        s4Title:     '4 — API setStatus() / setSrc()',
        btnUpdate:   'update()',
        btnRestore:  'restore'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Avatar': {
      demo: {
        subtitle:    'Demo de Avatar atualizado ao padrão Preview | HTML | JavaScript.',
        s1Title:     '1 — Básico e estados',
        s2Title:     '2 — Tamanhos',
        s3Title:     '3 — AvatarGroup',
        s4Title:     '4 — API setStatus() / setSrc()',
        btnUpdate:   'update()',
        btnRestore:  'restaurar'
      }
    }
  });

})(window);
