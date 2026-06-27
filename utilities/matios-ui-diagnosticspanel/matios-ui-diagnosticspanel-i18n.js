/* ============================================================
   MATIOS UI — matios-ui-diagnosticspanel-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.DiagnosticsPanel
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.DiagnosticsPanel': {
      demo: {
        subtitle:        'Consola integrada inferior para logs, requests, errores, sesion y export de diagnostico dentro de una app real.',
        loading:         'Cargando...',
        htmlTitle:       'Uso real en calendar-app',
        htmlSubtitle:    'HTML real resumido',
        jsTitle:         'Integracion real de diagnostics-bootstrap.js + app.js',
        jsSubtitle:      'JavaScript comentado'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.DiagnosticsPanel': {
      demo: {
        subtitle:        'Bottom docked console for logs, requests, errors, session and diagnostics export inside a real app.',
        loading:         'Loading...',
        htmlTitle:       'Real usage in calendar-app',
        htmlSubtitle:    'Condensed real HTML',
        jsTitle:         'Real integration of diagnostics-bootstrap.js + app.js',
        jsSubtitle:      'Commented JavaScript'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.DiagnosticsPanel': {
      demo: {
        subtitle:        'Console integrado inferior para logs, requisições, erros, sessão e exportação de diagnóstico dentro de um app real.',
        loading:         'Carregando...',
        htmlTitle:       'Uso real no calendar-app',
        htmlSubtitle:    'HTML real resumido',
        jsTitle:         'Integração real de diagnostics-bootstrap.js + app.js',
        jsSubtitle:      'JavaScript comentado'
      }
    }
  });

})(window);
