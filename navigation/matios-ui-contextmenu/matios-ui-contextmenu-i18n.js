/* ============================================================
   MATIOS UI — matios-ui-contextmenu-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.ContextMenu
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.ContextMenu': {
      demo: {
        subtitle:                'Menú contextual por click derecho con acciones, íconos y atajos.',
        s1Title:                 '1 — Básico',
        s2Title:                 '2 — Íconos y atajos',
        zoneBasicHint:           'Click derecho aquí',
        resultBasicPlaceholder:  '— abre el menú contextual —',
        zoneIconsHint:           'Zona con íconos y atajos',
        resultIconsPlaceholder:  '— click derecho para probar ítems con íconos —',
        selectPrefix:            'seleccionado → '
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.ContextMenu': {
      demo: {
        subtitle:                'Right-click context menu with actions, icons and shortcuts.',
        s1Title:                 '1 — Basic',
        s2Title:                 '2 — Icons and shortcuts',
        zoneBasicHint:           'Right-click here',
        resultBasicPlaceholder:  '— opens the context menu —',
        zoneIconsHint:           'Area with icons and shortcuts',
        resultIconsPlaceholder:  '— right-click to try items with icons —',
        selectPrefix:            'select → '
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.ContextMenu': {
      demo: {
        subtitle:                'Menu de contexto por clique direito com ações, ícones e atalhos.',
        s1Title:                 '1 — Básico',
        s2Title:                 '2 — Ícones e atalhos',
        zoneBasicHint:           'Clique com o botão direito aqui',
        resultBasicPlaceholder:  '— abre o menu de contexto —',
        zoneIconsHint:           'Área com ícones e atalhos',
        resultIconsPlaceholder:  '— clique direito para testar itens com ícones —',
        selectPrefix:            'selecionar → '
      }
    }
  });

})(window);
