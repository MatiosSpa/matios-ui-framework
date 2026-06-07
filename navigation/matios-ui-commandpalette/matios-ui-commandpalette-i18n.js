/* ============================================================
   MATIOS UI — matios-ui-commandpalette-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.CommandPalette
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.CommandPalette': {
      demo: {
        subtitle:                 'Buscador de comandos tipo ⌘K con comandos agrupados y acciones.',
        s1Title:                  '1 — Básico',
        s2Title:                  '2 — Agrupado',
        btnOpenBasic:             'Abrir palette',
        btnCloseBasic:            'Cerrar',
        btnOpenGrouped:           'Abrir palette agrupada',
        resultBasicPlaceholder:   '— abre la palette para probar comandos —',
        resultGroupedPlaceholder: '— palette con grupos y shortcuts —',
        searchPlaceholder:        'Buscar comando...',
        cmdDashboard:             'Ir al Dashboard',
        cmdSettings:              'Abrir ajustes',
        cmdNew:                   'Crear nuevo',
        cmdThemeDark:             'Modo oscuro',
        cmdThemeLight:            'Modo claro'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.CommandPalette': {
      demo: {
        subtitle:                 '⌘K-style command search with grouped commands and actions.',
        s1Title:                  '1 — Basic',
        s2Title:                  '2 — Grouped',
        btnOpenBasic:             'Open palette',
        btnCloseBasic:            'Close',
        btnOpenGrouped:           'Open grouped palette',
        resultBasicPlaceholder:   '— open the palette to try commands —',
        resultGroupedPlaceholder: '— palette with groups and shortcuts —',
        searchPlaceholder:        'Search command...',
        cmdDashboard:             'Go to Dashboard',
        cmdSettings:              'Open settings',
        cmdNew:                   'Create new',
        cmdThemeDark:             'Dark mode',
        cmdThemeLight:            'Light mode'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.CommandPalette': {
      demo: {
        subtitle:                 'Busca de comandos no estilo ⌘K com comandos agrupados e ações.',
        s1Title:                  '1 — Básico',
        s2Title:                  '2 — Agrupado',
        btnOpenBasic:             'Abrir palette',
        btnCloseBasic:            'Fechar',
        btnOpenGrouped:           'Abrir palette agrupada',
        resultBasicPlaceholder:   '— abra a palette para testar comandos —',
        resultGroupedPlaceholder: '— palette com grupos e atalhos —',
        searchPlaceholder:        'Buscar comando...',
        cmdDashboard:             'Ir ao Dashboard',
        cmdSettings:              'Abrir configurações',
        cmdNew:                   'Criar novo',
        cmdThemeDark:             'Modo escuro',
        cmdThemeLight:            'Modo claro'
      }
    }
  });

})(window);
