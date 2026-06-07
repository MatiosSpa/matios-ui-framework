/* ============================================================
   MATIOS UI — matios-ui-dropdown-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Dropdown
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Dropdown': {
      demo: {
        subtitle:          'Menú desplegable — grupos, íconos, atajos, divisores, submenús y modo hover.',
        s1Title:           '1 — Básico con eventos',
        s2Title:           '2 — Con íconos y atajos',
        s3Title:           '3 — Con grupos',
        s4Title:           '4 — Submenús anidados',
        resultPlaceholder: '— selecciona un ítem —',
        onOpenText:        'onOpen → dropdown abierto',
        onCloseText:       'onClose → dropdown cerrado'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Dropdown': {
      demo: {
        subtitle:          'Dropdown menu — groups, icons, shortcuts, dividers, submenus and hover mode.',
        s1Title:           '1 — Basic with events',
        s2Title:           '2 — With icons and shortcuts',
        s3Title:           '3 — With groups',
        s4Title:           '4 — Nested submenus',
        resultPlaceholder: '— select an item —',
        onOpenText:        'onOpen → dropdown opened',
        onCloseText:       'onClose → dropdown closed'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Dropdown': {
      demo: {
        subtitle:          'Menu suspenso — grupos, ícones, atalhos, divisores, submenus e modo hover.',
        s1Title:           '1 — Básico com eventos',
        s2Title:           '2 — Com ícones e atalhos',
        s3Title:           '3 — Com grupos',
        s4Title:           '4 — Submenus aninhados',
        resultPlaceholder: '— selecione um item —',
        onOpenText:        'onOpen → dropdown aberto',
        onCloseText:       'onClose → dropdown fechado'
      }
    }
  });

})(window);
