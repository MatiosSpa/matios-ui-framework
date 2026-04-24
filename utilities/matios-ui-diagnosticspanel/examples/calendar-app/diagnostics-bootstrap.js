(function () {
  var apiPrefix = new URL('./mock-api/', window.location.href);
  var localApiPath = apiPrefix.pathname.replace(/\/$/, '');
  var legacyApiPath = '/calendar_v2/mock-api';

  function rewriteUrl(input) {
    if (typeof input !== 'string') return input;
    if (input.indexOf(legacyApiPath) !== 0) return input;
    return input.replace(legacyApiPath, localApiPath);
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw-calendar.js', { scope: './' }).catch(function (err) {
      console.warn('[diagnostics-demo] Service worker no disponible:', err.message);
    });
  }

  var originalFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    if (typeof input === 'string') return originalFetch(rewriteUrl(input), init);
    if (input && input.url && input.clone) {
      return originalFetch(new Request(rewriteUrl(input.url), input), init);
    }
    return originalFetch(input, init);
  };

  var diagnostics = new MTS.DiagnosticsPanel(document.body, {
    title: 'DiagnosticsPanel',
    appName: 'Calendar V2 preview',
    collapsed: true,
    height: '360px',
    showLogViewer: true,
    showRequestInspector: true,
    showErrorViewer: true,
    showSessionInfo: true,
    showExport: true,
    showJsonViewer: true,
    captureConsole: true,
    captureWindowErrors: true,
    captureFetch: true,
    maxEntries: 160
  });

  diagnostics.setSessionInfo({
    user: 'demo@matios.dev',
    screen: 'calendar-app',
    mockApi: localApiPath,
    lang: document.documentElement.lang || 'es'
  });

  window.__MTS_DIAGNOSTICS__ = diagnostics;
  window.devPanel = {
    log: function (type, msg, detail) {
      diagnostics.log(type, msg, detail);
    },
    clearLog: function () {
      diagnostics.clear('logs');
    }
  };

  window.addEventListener('load', function () {
    diagnostics.log('info', 'Calendar V2 diagnostics ready', localApiPath);
  });
})();
