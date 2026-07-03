/* ============================================================
   MATIOS UI — matios-ui-devpanel-i18n.js
   i18n del chrome del componente (es / en / pt)
   Namespace: MTS.DevPanel
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.DevPanel': {
      configTitle: 'Configuración',
      codeTitle:   'JavaScript',
      logTitle:    'Registro de actividad',
      clear:       'Limpiar'
    }
  });

  MTS.registerLanguage('en', {
    'MTS.DevPanel': {
      configTitle: 'Config',
      codeTitle:   'JavaScript',
      logTitle:    'Activity Log',
      clear:       'Clear'
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.DevPanel': {
      configTitle: 'Configuração',
      codeTitle:   'JavaScript',
      logTitle:    'Registro de atividade',
      clear:       'Limpar'
    }
  });

})(window);
