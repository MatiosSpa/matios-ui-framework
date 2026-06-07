/* ============================================================
   MATIOS UI — matios-ui-radio-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Radio
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Radio': {
      demo: {
        subtitle:            'Grupo de radio buttons vertical y horizontal, con opción deshabilitada y grupo completo deshabilitado.',
        s1Title:             '1 — Vertical (por defecto)',
        s2Title:             '2 — Horizontal',
        s3Title:             '3 — Con opción deshabilitada',
        s4Title:             '4 — Grupo completo deshabilitado',
        selectPlaceholder:   '— selecciona una opción —',
        valuePrefix:         'valor: ',
        optHigh:             'Alta',
        optMedium:           'Media',
        optLow:              'Baja',
        optTable:            'Tabla',
        optCards:            'Tarjetas',
        optList:             'Lista',
        optFree:             'Free',
        optPro:              'Pro',
        optEnterprise:       'Enterprise (próximamente)',
        optActive:           'Activo',
        optInactive:         'Inactivo',
        optPending:          'Pendiente'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Radio': {
      demo: {
        subtitle:            'Vertical and horizontal radio button group, with a disabled option and a fully disabled group.',
        s1Title:             '1 — Vertical (default)',
        s2Title:             '2 — Horizontal',
        s3Title:             '3 — With a disabled option',
        s4Title:             '4 — Fully disabled group',
        selectPlaceholder:   '— select an option —',
        valuePrefix:         'value: ',
        optHigh:             'High',
        optMedium:           'Medium',
        optLow:              'Low',
        optTable:            'Table',
        optCards:            'Cards',
        optList:             'List',
        optFree:             'Free',
        optPro:              'Pro',
        optEnterprise:       'Enterprise (coming soon)',
        optActive:           'Active',
        optInactive:         'Inactive',
        optPending:          'Pending'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Radio': {
      demo: {
        subtitle:            'Grupo de radio buttons vertical e horizontal, com opção desabilitada e grupo totalmente desabilitado.',
        s1Title:             '1 — Vertical (padrão)',
        s2Title:             '2 — Horizontal',
        s3Title:             '3 — Com opção desabilitada',
        s4Title:             '4 — Grupo totalmente desabilitado',
        selectPlaceholder:   '— selecione uma opção —',
        valuePrefix:         'valor: ',
        optHigh:             'Alta',
        optMedium:           'Média',
        optLow:              'Baixa',
        optTable:            'Tabela',
        optCards:            'Cartões',
        optList:             'Lista',
        optFree:             'Free',
        optPro:              'Pro',
        optEnterprise:       'Enterprise (em breve)',
        optActive:           'Ativo',
        optInactive:         'Inativo',
        optPending:          'Pendente'
      }
    }
  });

})(window);
