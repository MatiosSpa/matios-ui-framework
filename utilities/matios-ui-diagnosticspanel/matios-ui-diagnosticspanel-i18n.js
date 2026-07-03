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
      eyebrow:            'Utilidades',
      clear:             'Limpiar',
      copy:              'Copiar',
      download:          'Descargar',
      unitLogs:          'logs',
      unitRequests:      'requests',
      unitErrors:        'errores',
      tabActivity:       'Actividad',
      tabRequests:       'Requests',
      tabErrors:         'Errores',
      tabSession:        'Sesion',
      tabExport:         'Export',
      tabRequest:        'Request',
      tabResponse:       'Response',
      requestPrompt:     'Selecciona un request para ver mas detalle.',
      requestPlaceholder: 'Selecciona un request',
      requestBody:       'Request body',
      responseBody:      'Response body',
      drawerTitle:       'Request JSON',
      emptyLogs:         'Todavia no hay actividad registrada.',
      emptyRequests:     'Todavia no hay requests interceptados.',
      emptyErrors:       'Todavia no hay errores capturados.',
      reportCopied:      'Reporte copiado',
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
      eyebrow:            'Utilities',
      clear:             'Clear',
      copy:              'Copy',
      download:          'Download',
      unitLogs:          'logs',
      unitRequests:      'requests',
      unitErrors:        'errors',
      tabActivity:       'Activity',
      tabRequests:       'Requests',
      tabErrors:         'Errors',
      tabSession:        'Session',
      tabExport:         'Export',
      tabRequest:        'Request',
      tabResponse:       'Response',
      requestPrompt:     'Select a request to see more detail.',
      requestPlaceholder: 'Select a request',
      requestBody:       'Request body',
      responseBody:      'Response body',
      drawerTitle:       'Request JSON',
      emptyLogs:         'No activity recorded yet.',
      emptyRequests:     'No requests intercepted yet.',
      emptyErrors:       'No errors captured yet.',
      reportCopied:      'Report copied',
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
      eyebrow:            'Utilitarios',
      clear:             'Limpar',
      copy:              'Copiar',
      download:          'Baixar',
      unitLogs:          'logs',
      unitRequests:      'requisicoes',
      unitErrors:        'erros',
      tabActivity:       'Atividade',
      tabRequests:       'Requisicoes',
      tabErrors:         'Erros',
      tabSession:        'Sessao',
      tabExport:         'Exportar',
      tabRequest:        'Requisicao',
      tabResponse:       'Resposta',
      requestPrompt:     'Selecione uma requisicao para ver mais detalhes.',
      requestPlaceholder: 'Selecione uma requisicao',
      requestBody:       'Corpo da requisicao',
      responseBody:      'Corpo da resposta',
      drawerTitle:       'Requisicao JSON',
      emptyLogs:         'Ainda nao ha atividade registrada.',
      emptyRequests:     'Ainda nao ha requisicoes interceptadas.',
      emptyErrors:       'Ainda nao ha erros capturados.',
      reportCopied:      'Relatorio copiado',
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
