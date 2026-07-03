/* ============================================================
   MATIOS UI — matios-ui-dashboardgrid-i18n.js
   i18n del componente (es / en / pt)
   Namespace: MTS.DashboardGrid
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.DashboardGrid': {
      dragHandle:   'Mover widget',
      removeWidget: 'Eliminar widget',
      resizeHandle: 'Redimensionar widget',
      trayTitle:    'Widgets disponibles',
      trayEmpty:    'Todos los widgets están en el dashboard'
    }
  });

  MTS.registerLocale('en', {
    'MTS.DashboardGrid': {
      dragHandle:   'Move widget',
      removeWidget: 'Remove widget',
      resizeHandle: 'Resize widget',
      trayTitle:    'Available widgets',
      trayEmpty:    'All widgets are on the dashboard'
    }
  });

  MTS.registerLocale('pt', {
    'MTS.DashboardGrid': {
      dragHandle:   'Mover widget',
      removeWidget: 'Remover widget',
      resizeHandle: 'Redimensionar widget',
      trayTitle:    'Widgets disponíveis',
      trayEmpty:    'Todos os widgets estão no dashboard'
    }
  });

})(window);
