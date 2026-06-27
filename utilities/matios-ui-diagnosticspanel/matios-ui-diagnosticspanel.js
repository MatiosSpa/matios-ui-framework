/* ============================================================
   MATIOS UI — matios-ui-diagnosticspanel.js
   MTS.DiagnosticsPanel — consola integrada de diagnostico
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DiagnosticsPanel = function MtsDiagnosticsPanel(selector, options) {
  options = options || {};

  this._host = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!this._host) {
    console.error('[MTS.DiagnosticsPanel] Not found / No encontrado:', selector);
    return;
  }

  function _def(a, b) { return (a !== undefined && a !== null) ? a : b; }

  this.enabled    = _def(options.enabled, true);
  this.title      = options.title    || 'Diagnostics';
  this.appName    = options.appName  || document.title || 'Matios App';
  this.position   = options.position || 'bottom';
  this.collapsed  = _def(options.collapsed, true);
  this.height     = options.height   || '340px';
  this.maxEntries = Number.isFinite(options.maxEntries) ? options.maxEntries : 120;

  this.showLogViewer         = _def(options.showLogViewer,         true);
  this.showRequestInspector  = _def(options.showRequestInspector,  true);
  this.showErrorViewer       = _def(options.showErrorViewer,       true);
  this.showSessionInfo       = _def(options.showSessionInfo,       true);
  this.showExport            = _def(options.showExport,            true);
  this.showJsonViewer        = _def(options.showJsonViewer,        true);

  this.captureConsole       = _def(options.captureConsole,       true);
  this.captureWindowErrors  = _def(options.captureWindowErrors,  true);
  this.captureFetch         = _def(options.captureFetch,         true);

  this.logs     = [];
  this.requests = [];
  this.errors   = [];
  this.session  = Object.assign({
    appName:   this.appName,
    path:      location.pathname,
    mode:      document.documentElement.getAttribute('data-mts-mode')   || '',
    accent:    document.documentElement.getAttribute('data-mts-accent') || '',
    startedAt: new Date().toISOString(),
    userAgent: navigator.userAgent || ''
  }, options.session || {});

  this._tabs             = null;
  this._tabsHost         = null;
  this._dock             = null;
  this._sheet            = null;
  this._headerGroupHost  = null;
  this._resizeHandle     = null;
  this._dockIcon         = null;
  this._logList          = null;
  this._requestList      = null;
  this._requestDetail    = null;
  this._jsonDrawer       = null;
  this._jsonDrawerTabs   = null;
  this._jsonRequestViewer  = null;
  this._jsonResponseViewer = null;
  this._errorList        = null;
  this._sessionView      = null;
  this._exportPreview    = null;
  this._countNodes       = {};
  this._paddingTarget    = null;
  this._originalPaddingBottom = '';

  this._boundResize = this._syncPanelHeight.bind(this);

  if (!this.enabled) return;

  this._build();
  this._subscribeGlobals();
  this._renderAll();

  window.addEventListener('resize', this._boundResize);
};

/* ════════════════════════════════════════════════════
   API PUBLICA
   ════════════════════════════════════════════════════ */

MTS.DiagnosticsPanel.prototype.setSessionInfo = function(info) {
  info = info || {};
  this.session = Object.assign({}, this.session, info);
  this._renderSession();
  this._renderExport();
  return this;
};

MTS.DiagnosticsPanel.prototype.log = function(type, message, detail, meta) {
  if (detail === undefined || detail === null) detail = '';
  if (meta   === undefined || meta   === null) meta   = {};
  this.logs.unshift({
    id:        this._uid('log'),
    level:     String(type    || 'info'),
    message:   String(message || ''),
    detail:    String(detail),
    meta:      meta,
    createdAt: new Date().toISOString()
  });
  this._trim(this.logs);
  this._renderLogs();
  this._updateCounts();
  return this;
};

MTS.DiagnosticsPanel.prototype.addRequest = function(record) {
  record = record || {};
  this.requests.unshift(Object.assign({
    id:           this._uid('req'),
    method:       'GET',
    url:          '',
    status:       0,
    ok:           false,
    durationMs:   0,
    requestBody:  '',
    responseBody: '',
    createdAt:    new Date().toISOString()
  }, record));
  this._trim(this.requests);
  this._renderRequests();
  this._renderExport();
  this._updateCounts();
  return this;
};

MTS.DiagnosticsPanel.prototype.addError = function(error) {
  error = error || {};
  this.errors.unshift(Object.assign({
    id:        this._uid('err'),
    name:      'Error',
    message:   '',
    stack:     '',
    source:    'runtime',
    createdAt: new Date().toISOString()
  }, error));
  this._trim(this.errors);
  this._renderErrors();
  this._renderExport();
  this._updateCounts();
  return this;
};

MTS.DiagnosticsPanel.prototype.clear = function(section) {
  if (section === undefined || section === null) section = 'all';
  if (section === 'all' || section === 'logs')     this.logs     = [];
  if (section === 'all' || section === 'requests') this.requests = [];
  if (section === 'all' || section === 'errors')   this.errors   = [];
  this._renderAll();
  return this;
};

MTS.DiagnosticsPanel.prototype.toggle = function(force) {
  let shouldOpen = typeof force === 'boolean' ? force : this.collapsed;
  if (shouldOpen) this.show();
  else            this.hide();
  return this;
};

MTS.DiagnosticsPanel.prototype.show = function() {
  this.collapsed = false;
  this._root.classList.add('mts-diag--open');
  if (this._toggleBtn) this._toggleBtn.innerHTML = this._chevron('down');
  if (this._dockIcon)  this._dockIcon.innerHTML  = this._chevron('down');
  return this;
};

MTS.DiagnosticsPanel.prototype.hide = function() {
  this.collapsed = true;
  this._root.classList.remove('mts-diag--open');
  if (this._toggleBtn) this._toggleBtn.innerHTML = this._chevron('up');
  if (this._dockIcon)  this._dockIcon.innerHTML  = this._chevron('up');
  return this;
};

MTS.DiagnosticsPanel.prototype.copyReport = function() {
  let text = this.getReportText();
  if (!text) return Promise.resolve(false);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(function() { return true; });
  }
  let ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity  = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  return Promise.resolve(true);
};

MTS.DiagnosticsPanel.prototype.downloadReport = function(filename) {
  filename = filename || 'diagnostics-report.txt';
  let blob = new Blob([this.getReportText()], { type: 'text/plain;charset=utf-8' });
  let url  = URL.createObjectURL(blob);
  let link = document.createElement('a');
  link.href     = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  return this;
};

MTS.DiagnosticsPanel.prototype.getReportData = function() {
  return {
    title:    this.title,
    appName:  this.appName,
    session:  Object.assign({}, this.session),
    counts: {
      logs:     this.logs.length,
      requests: this.requests.length,
      errors:   this.errors.length
    },
    logs:     this.logs.slice(0, 40),
    requests: this.requests.slice(0, 25),
    errors:   this.errors.slice(0, 25)
  };
};

MTS.DiagnosticsPanel.prototype.getReportText = function() {
  let self = this;
  let data  = this.getReportData();
  let lines = [];
  lines.push('Matios Diagnostics Report');
  lines.push('=========================');
  lines.push('');
  lines.push('App: '       + (data.appName || ''));
  lines.push('Title: '     + (data.title   || ''));
  lines.push('Generated: ' + new Date().toISOString());
  lines.push('Path: '      + (data.session.path   || ''));
  lines.push('Mode: '      + (data.session.mode   || ''));
  lines.push('Accent: '    + (data.session.accent || ''));
  lines.push('');
  lines.push('Session');
  lines.push('-------');
  Object.keys(data.session).forEach(function(key) {
    lines.push(key + ': ' + self._stringify(data.session[key]));
  });
  lines.push('');
  lines.push('Counts');
  lines.push('------');
  lines.push('Logs: '     + data.counts.logs);
  lines.push('Requests: ' + data.counts.requests);
  lines.push('Errors: '   + data.counts.errors);
  lines.push('');
  lines.push('Logs');
  lines.push('----');
  data.logs.forEach(function(item) {
    lines.push('[' + self._formatTime(item.createdAt) + '] ' +
      item.level.toUpperCase() + ' - ' + item.message +
      (item.detail ? ' | ' + item.detail : ''));
  });
  lines.push('');
  lines.push('Requests');
  lines.push('--------');
  data.requests.forEach(function(item) {
    lines.push('[' + self._formatTime(item.createdAt) + '] ' +
      item.method + ' ' + item.url + ' => ' + item.status +
      ' (' + item.durationMs + ' ms)');
    if (item.requestBody)  lines.push('request: '  + self._compact(item.requestBody));
    if (item.responseBody) lines.push('response: ' + self._compact(item.responseBody));
  });
  lines.push('');
  lines.push('Errors');
  lines.push('------');
  data.errors.forEach(function(item) {
    lines.push('[' + self._formatTime(item.createdAt) + '] ' +
      item.name + ': ' + item.message);
    if (item.stack) lines.push(item.stack);
  });
  return lines.join('\n');
};

MTS.DiagnosticsPanel.prototype.destroy = function() {
  window.removeEventListener('resize', this._boundResize);
  this._unsubscribeGlobals();
  if (this._jsonDrawer && typeof this._jsonDrawer.destroy === 'function') this._jsonDrawer.destroy();
  this._restoreDockOffset();
  if (this._tabs && this._tabs.destroy) this._tabs.destroy();
  if (this._root && this._root.parentNode) this._root.parentNode.removeChild(this._root);
};

/* ════════════════════════════════════════════════════
   BUILD
   ════════════════════════════════════════════════════ */

MTS.DiagnosticsPanel.prototype._build = function() {
  let self = this;

  this._root = document.createElement('section');
  this._root.className = 'mts-diag' + (this.collapsed ? '' : ' mts-diag--open');
  this._root.dataset.position = this.position;
  this._root.style.setProperty('--mts-diag-height', this.height);

  if (this._host === document.body || this._host === document.documentElement) {
    this._root.classList.add('mts-diag--viewport');
    this._paddingTarget = document.body;
    this._originalPaddingBottom = document.body.style.paddingBottom || '';
    document.body.appendChild(this._root);
  } else {
    let computed = window.getComputedStyle(this._host);
    if (computed.position === 'static') this._host.style.position = 'relative';
    this._root.classList.add('mts-diag--embedded');
    this._paddingTarget = this._host;
    this._originalPaddingBottom = this._host.style.paddingBottom || '';
    this._host.appendChild(this._root);
  }

  /* ── Dock ── */
  this._dock = document.createElement('div');
  this._dock.className = 'mts-diag__dock';
  this._dock.innerHTML =
    '<div class="mts-diag__dock-main">' +
      '<span class="mts-diag__dock-icon" data-diag-icon>' + this._chevron(this.collapsed ? 'up' : 'down') + '</span>' +
      '<div class="mts-diag__dock-title">' + this._escape(this.title) + '</div>' +
      '<div class="mts-diag__counts">' +
        '<span class="mts-diag__count" data-count="logs">0 logs</span>' +
        '<span class="mts-diag__count" data-count="requests">0 requests</span>' +
        '<span class="mts-diag__count" data-count="errors">0 errores</span>' +
      '</div>' +
    '</div>' +
    '<div class="mts-diag__dock-actions"></div>';
  this._root.appendChild(this._dock);

  this._countNodes.logs     = this._dock.querySelector('[data-count="logs"]');
  this._countNodes.requests = this._dock.querySelector('[data-count="requests"]');
  this._countNodes.errors   = this._dock.querySelector('[data-count="errors"]');
  this._dockIcon            = this._dock.querySelector('[data-diag-icon]');

  let dockActions = this._dock.querySelector('.mts-diag__dock-actions');

  let clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'dp-log__clear';
  clearBtn.textContent = 'Clear';
  clearBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    self.clear();
  });
  dockActions.appendChild(clearBtn);

  this._toggleBtn = document.createElement('button');
  this._toggleBtn.type = 'button';
  this._toggleBtn.className = 'mts-diag__toggle';
  this._toggleBtn.innerHTML = this._chevron(this.collapsed ? 'up' : 'down');
  this._toggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    self.toggle();
  });
  dockActions.appendChild(this._toggleBtn);
  this._dock.addEventListener('click', function() { self.toggle(); });

  /* ── Sheet ── */
  this._sheet = document.createElement('div');
  this._sheet.className = 'mts-diag__sheet mts-surface';
  this._root.appendChild(this._sheet);

  this._resizeHandle = document.createElement('div');
  this._resizeHandle.className = 'mts-diag__gutter mts-splitter__gutter mts-splitter__gutter--vertical';
  this._resizeHandle.innerHTML = '<div class="mts-splitter__handle"></div>';
  this._sheet.appendChild(this._resizeHandle);
  this._bindResize();

  let header = document.createElement('div');
  header.className = 'mts-diag__header';
  header.innerHTML =
    '<div>' +
      '<p class="mts-diag__eyebrow">Utilities</p>' +
      '<h3 class="mts-diag__heading">' + this._escape(this.appName) + '</h3>' +
    '</div>' +
    '<div class="mts-diag__header-actions"></div>';
  this._sheet.appendChild(header);

  let headerActions = header.querySelector('.mts-diag__header-actions');

  this._headerGroupHost = document.createElement('div');
  this._headerGroupHost.className = 'mts-diag__button-group';
  headerActions.appendChild(this._headerGroupHost);

  this._tabsHost = document.createElement('div');
  this._tabsHost.className = 'mts-diag__tabs';
  this._sheet.appendChild(this._tabsHost);

  this._buildTabs();
  this._buildHeaderActions();
  this._buildJsonDrawer();

  this._syncPanelHeight();
  this._applyDockOffset();
};

MTS.DiagnosticsPanel.prototype._buildTabs = function() {
  let tabs = [];

  if (this.showLogViewer) {
    this._logList = document.createElement('div');
    this._logList.className = 'mts-diag__list';
    tabs.push({ id: 'logs', label: 'Activity', content: this._wrapPanel(this._logList) });
  }

  if (this.showRequestInspector) {
    let reqWrap = document.createElement('div');
    reqWrap.className = this._canUseJsonViewer() ? 'mts-diag__stack mts-diag__stack--single' : 'mts-diag__stack';
    this._requestList = document.createElement('div');
    this._requestList.className = 'mts-diag__list';
    reqWrap.appendChild(this._requestList);
    if (!this._canUseJsonViewer()) {
      this._requestDetail = document.createElement('pre');
      this._requestDetail.className = 'mts-diag__detail';
      this._requestDetail.textContent = 'Selecciona un request para ver mas detalle.';
      reqWrap.appendChild(this._requestDetail);
    }
    tabs.push({ id: 'requests', label: 'Requests', content: this._wrapPanel(reqWrap) });
  }

  if (this.showErrorViewer) {
    this._errorList = document.createElement('div');
    this._errorList.className = 'mts-diag__list';
    tabs.push({ id: 'errors', label: 'Errors', content: this._wrapPanel(this._errorList) });
  }

  if (this.showSessionInfo) {
    this._sessionView = document.createElement('div');
    this._sessionView.className = 'mts-diag__session';
    tabs.push({ id: 'session', label: 'Session', content: this._wrapPanel(this._sessionView) });
  }

  if (this.showExport) {
    let exportWrap = document.createElement('div');
    exportWrap.className = 'mts-diag__stack mts-diag__stack--single';
    this._exportPreview = document.createElement('pre');
    this._exportPreview.className = 'mts-diag__detail';
    exportWrap.appendChild(this._exportPreview);
    tabs.push({ id: 'export', label: 'Export', content: this._wrapPanel(exportWrap) });
  }

  this._tabs = new MTS.Tabs(this._tabsHost, {
    variant: 'card',
    lazy:    false,
    stretch: true,
    tabs:    tabs
  });
};

MTS.DiagnosticsPanel.prototype._buildJsonDrawer = function() {
  if (!this._canUseJsonViewer()) return;

  let content = document.createElement('div');
  content.className = 'mts-diag__jsondrawer-content';

  let tabsHost = document.createElement('div');
  tabsHost.className = 'mts-diag__jsondrawer-tabs';
  content.appendChild(tabsHost);

  let requestHost = document.createElement('div');
  requestHost.className = 'mts-h-full';

  let responseHost = document.createElement('div');
  responseHost.className = 'mts-h-full';

  this._jsonDrawerTabs = new MTS.Tabs(tabsHost, {
    variant: 'card',
    stretch: true,
    lazy:    false,
    tabs: [
      { id: 'request',  label: 'Request',  content: requestHost  },
      { id: 'response', label: 'Response', content: responseHost }
    ]
  });

  this._jsonRequestViewer = new MTS.JsonViewer(requestHost, {
    title:    'Request body',
    subtitle: 'Selecciona un request',
    copyable: true,
    height:   '100%'
  });

  this._jsonResponseViewer = new MTS.JsonViewer(responseHost, {
    title:    'Response body',
    subtitle: 'Selecciona un request',
    copyable: true,
    height:   '100%'
  });

  this._jsonDrawer = new MTS.Drawer({
    title:    'Request JSON',
    content:  content,
    position: 'right',
    size:     'lg',
    backdrop: false,
    closable: true
  });
};

MTS.DiagnosticsPanel.prototype._buildHeaderActions = function() {
  let self = this;
  if (!this._headerGroupHost) return;
  this._headerGroupHost.innerHTML = '';

  if (window.MTS && MTS.ButtonGroup) {
    new MTS.ButtonGroup(this._headerGroupHost, [
      {
        label:   'Copiar',
        variant: 'secondary',
        size:    'sm',
        icon:    this._icon('copy', 14),
        onClick: function() {
          self.copyReport().then(function() { self.log('info', 'Reporte copiado', 'clipboard'); });
        }
      },
      {
        label:   'Descargar',
        variant: 'secondary',
        size:    'sm',
        icon:    this._icon('download', 14),
        onClick: function() { self.downloadReport(); }
      }
    ], {
      size:          'sm',
      activeOnClick: false
    });
    return;
  }

  let copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'mts-btn mts-btn--secondary mts-btn--sm';
  copyBtn.innerHTML = this._icon('copy', 14) + '<span class="mts-btn__label">Copiar</span>';
  copyBtn.addEventListener('click', function() {
    self.copyReport().then(function() { self.log('info', 'Reporte copiado', 'clipboard'); });
  });
  this._headerGroupHost.appendChild(copyBtn);

  let downloadBtn = document.createElement('button');
  downloadBtn.type = 'button';
  downloadBtn.className = 'mts-btn mts-btn--secondary mts-btn--sm';
  downloadBtn.innerHTML = this._icon('download', 14) + '<span class="mts-btn__label">Descargar</span>';
  downloadBtn.addEventListener('click', function() { self.downloadReport(); });
  this._headerGroupHost.appendChild(downloadBtn);
};

/* ════════════════════════════════════════════════════
   RENDER
   ════════════════════════════════════════════════════ */

MTS.DiagnosticsPanel.prototype._wrapPanel = function(content) {
  let panel = document.createElement('div');
  panel.className = 'mts-diag__panel';
  panel.appendChild(content);
  return panel;
};

MTS.DiagnosticsPanel.prototype._renderAll = function() {
  this._renderLogs();
  this._renderRequests();
  this._renderErrors();
  this._renderSession();
  this._renderExport();
  this._updateCounts();
};

MTS.DiagnosticsPanel.prototype._renderLogs = function() {
  let self = this;
  if (!this._logList) return;
  this._logList.innerHTML = '';
  if (!this.logs.length) {
    this._logList.appendChild(this._empty('Todavia no hay actividad registrada.'));
    return;
  }
  this.logs.forEach(function(item) {
    let row = document.createElement('article');
    row.className = 'mts-diag__item';
    row.innerHTML =
      '<div class="mts-diag__item-top">' +
        '<span class="mts-diag__badge mts-diag__badge--' + self._escape(item.level) + '">' + self._escape(item.level) + '</span>' +
        '<span class="mts-diag__time">' + self._escape(self._formatTime(item.createdAt)) + '</span>' +
      '</div>' +
      '<div class="mts-diag__message">' + self._escape(item.message) + '</div>' +
      (item.detail ? '<div class="mts-diag__detail-inline">' + self._escape(item.detail) + '</div>' : '');
    self._logList.appendChild(row);
  });
  this._renderExport();
};

MTS.DiagnosticsPanel.prototype._renderRequests = function() {
  let self = this;
  if (!this._requestList) return;
  this._requestList.innerHTML = '';
  if (!this.requests.length) {
    this._requestList.appendChild(this._empty('Todavia no hay requests interceptados.'));
    if (this._requestDetail) this._requestDetail.textContent = 'Selecciona un request para ver mas detalle.';
    return;
  }
  this.requests.forEach(function(item, index) {
    let row = document.createElement('button');
    row.type = 'button';
    row.className = 'mts-diag__request';
    row.innerHTML =
      '<div class="mts-diag__request-main">' +
        '<span class="mts-diag__request-method">' + self._escape(item.method) + '</span>' +
        '<span class="mts-diag__request-url">'    + self._escape(item.url)    + '</span>' +
      '</div>' +
      '<div class="mts-diag__request-side">' +
        '<span class="mts-diag__status ' + (item.ok ? 'is-ok' : 'is-error') + '">' + self._escape(String(item.status)) + '</span>' +
        '<span class="mts-diag__time">' + self._escape(String(item.durationMs)) + ' ms</span>' +
      '</div>';
    row.addEventListener('click', function() {
      if (self._canUseJsonViewer() && self._jsonDrawer) {
        self._openJsonDrawerForRequest(item);
        return;
      }
      if (self._requestDetail) {
        self._requestDetail.textContent =
          'Request\n-------\n' +
          'Time: '     + self._formatTime(item.createdAt) + '\n' +
          'Method: '   + item.method + '\n' +
          'URL: '      + item.url    + '\n' +
          'Status: '   + item.status + '\n' +
          'Duration: ' + item.durationMs + ' ms\n\n' +
          'Request Body\n------------\n' + (item.requestBody  || '(empty)') + '\n\n' +
          'Response Body\n-------------\n' + (item.responseBody || '(empty)');
      }
    });
    self._requestList.appendChild(row);
    if (!self._canUseJsonViewer() && !index && self._requestDetail &&
        self._requestDetail.textContent.indexOf('Request\n-------') !== 0) {
      row.click();
    }
  });
};

MTS.DiagnosticsPanel.prototype._renderErrors = function() {
  let self = this;
  if (!this._errorList) return;
  this._errorList.innerHTML = '';
  if (!this.errors.length) {
    this._errorList.appendChild(this._empty('Todavia no hay errores capturados.'));
    return;
  }
  this.errors.forEach(function(item) {
    let row = document.createElement('article');
    row.className = 'mts-diag__item';
    row.innerHTML =
      '<div class="mts-diag__item-top">' +
        '<span class="mts-diag__badge mts-diag__badge--error">' + self._escape(item.source || 'error') + '</span>' +
        '<span class="mts-diag__time">' + self._escape(self._formatTime(item.createdAt)) + '</span>' +
      '</div>' +
      '<div class="mts-diag__message">' + self._escape((item.name ? item.name + ': ' : '') + item.message) + '</div>' +
      (item.stack ? '<pre class="mts-diag__detail mts-diag__detail--compact">' + self._escape(item.stack) + '</pre>' : '');
    self._errorList.appendChild(row);
  });
};

MTS.DiagnosticsPanel.prototype._renderSession = function() {
  let self = this;
  if (!this._sessionView) return;
  this._sessionView.innerHTML = '';
  Object.keys(this.session).forEach(function(key) {
    let row = document.createElement('div');
    row.className = 'mts-diag__kv';
    row.innerHTML =
      '<span class="mts-diag__kv-key">'   + self._escape(key) + '</span>' +
      '<span class="mts-diag__kv-value">' + self._escape(self._stringify(self.session[key])) + '</span>';
    self._sessionView.appendChild(row);
  });
};

MTS.DiagnosticsPanel.prototype._renderExport = function() {
  if (!this._exportPreview) return;
  this._exportPreview.textContent = this.getReportText();
};

MTS.DiagnosticsPanel.prototype._updateCounts = function() {
  if (this._countNodes.logs)     this._countNodes.logs.textContent     = this.logs.length     + ' logs';
  if (this._countNodes.requests) this._countNodes.requests.textContent = this.requests.length + ' requests';
  if (this._countNodes.errors)   this._countNodes.errors.textContent   = this.errors.length   + ' errores';
};

/* ════════════════════════════════════════════════════
   LAYOUT / RESIZE
   ════════════════════════════════════════════════════ */

MTS.DiagnosticsPanel.prototype._syncPanelHeight = function() {
  if (!this._sheet) return;
  let dockHeight    = this._dock ? this._dock.offsetHeight : 44;
  let viewportHeight = window.innerHeight || 900;
  let maxHeight     = Math.max(220, viewportHeight - dockHeight - 48);
  let configured    = this._parsePx(this.height);
  let finalHeight   = Math.min(configured || 340, maxHeight);
  if (this._root) this._root.style.setProperty('--mts-diag-dock-h', dockHeight + 'px');
  this._sheet.style.setProperty('--mts-diag-sheet-height', finalHeight + 'px');
  this._applyDockOffset(dockHeight);
};

MTS.DiagnosticsPanel.prototype._openJsonDrawerForRequest = function(item) {
  if (!this._jsonDrawer || !this._jsonRequestViewer || !this._jsonResponseViewer) return;
  let title = item.method + ' ' + item.url;
  this._jsonDrawer.setTitle(this._escape(title));
  this._jsonRequestViewer.setTitle('Request body',  this._formatTime(item.createdAt));
  this._jsonRequestViewer.setData(item.requestBody  || '');
  this._jsonResponseViewer.setTitle('Response body', 'Status ' + item.status + ' • ' + item.durationMs + ' ms');
  this._jsonResponseViewer.setData(item.responseBody || '');
  let activeTab = item.requestBody ? 'request' : 'response';
  if (this._jsonDrawerTabs && typeof this._jsonDrawerTabs.setActive === 'function') {
    this._jsonDrawerTabs.setActive(activeTab);
  }
  this._jsonDrawer.show();
};

MTS.DiagnosticsPanel.prototype._canUseJsonViewer = function() {
  return !!(this.showJsonViewer && window.MTS && MTS.Drawer && MTS.JsonViewer);
};

MTS.DiagnosticsPanel.prototype._applyDockOffset = function(dockHeight) {
  if (!this._paddingTarget) return;
  let target = this._paddingTarget;
  let computed = window.getComputedStyle(target);
  let inlinePadding = target.style.paddingBottom;
  let basePadding = parseFloat(inlinePadding || computed.paddingBottom) || 0;
  let reserve = (dockHeight || (this._dock ? this._dock.offsetHeight : 36)) + 8;

  if (!target.dataset.mtsDiagBasePaddingBottom) {
    target.dataset.mtsDiagBasePaddingBottom = String(basePadding);
  }

  let original = parseFloat(target.dataset.mtsDiagBasePaddingBottom || '0') || 0;
  target.style.paddingBottom = (original + reserve) + 'px';
};

MTS.DiagnosticsPanel.prototype._restoreDockOffset = function() {
  if (!this._paddingTarget) return;
  let target = this._paddingTarget;
  if (this._originalPaddingBottom) target.style.paddingBottom = this._originalPaddingBottom;
  else target.style.removeProperty('padding-bottom');
  delete target.dataset.mtsDiagBasePaddingBottom;
};

MTS.DiagnosticsPanel.prototype._bindResize = function() {
  let self = this;
  if (!this._resizeHandle || !this._sheet) return;
  let min       = 180;
  let startY    = 0;
  let startHeight = 0;

  function onMove(clientY) {
    let next = Math.max(min, startHeight + (startY - clientY));
    self.height = next + 'px';
    self._syncPanelHeight();
  }

  function stop() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup',   stop);
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend',  stop);
    document.body.style.userSelect = '';
    document.body.style.cursor     = '';
    self._resizeHandle.classList.remove('mts-splitter__gutter--dragging');
  }

  function onMouseMove(e) { onMove(e.clientY); }

  function onTouchMove(e) {
    if (!e.touches || !e.touches.length) return;
    e.preventDefault();
    onMove(e.touches[0].clientY);
  }

  function start(clientY) {
    startY      = clientY;
    startHeight = self._sheet.getBoundingClientRect().height;
    self._resizeHandle.classList.add('mts-splitter__gutter--dragging');
    document.body.style.userSelect = 'none';
    document.body.style.cursor     = 'row-resize';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',   stop);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend',  stop);
  }

  this._resizeHandle.addEventListener('mousedown', function(e) {
    e.preventDefault();
    start(e.clientY);
  });

  this._resizeHandle.addEventListener('touchstart', function(e) {
    if (!e.touches || !e.touches.length) return;
    e.preventDefault();
    start(e.touches[0].clientY);
  }, { passive: false });
};

/* ════════════════════════════════════════════════════
   GLOBAL INTERCEPTS (console / fetch / onerror)
   ════════════════════════════════════════════════════ */

MTS.DiagnosticsPanel.prototype._subscribeGlobals = function() {
  let self = this;
  let bridge = MTS.DiagnosticsPanel._bridge = MTS.DiagnosticsPanel._bridge || {
    consolePatched: false,
    fetchPatched:   false,
    errorPatched:   false,
    subscribers:    new Set()
  };
  bridge.subscribers.add(this);

  /* ── Console ── */
  if (this.captureConsole && !bridge.consolePatched) {
    bridge.consolePatched  = true;
    bridge.originalConsole = {};
    ['log', 'info', 'warn', 'error'].forEach(function(method) {
      bridge.originalConsole[method] = console[method].bind(console);
      console[method] = function() {
        let args = Array.prototype.slice.call(arguments);
        bridge.subscribers.forEach(function(panel) {
          if (panel.captureConsole) panel.log(method, panel._argsToMessage(args), '', { source: 'console' });
        });
        bridge.originalConsole[method].apply(console, args);
      };
    });
  }

  /* ── Fetch ── */
  if (this.captureFetch && !bridge.fetchPatched) {
    bridge.fetchPatched  = true;
    bridge.originalFetch = window.fetch.bind(window);
    window.fetch = function(input, init) {
      init = init || {};
      let startedAt   = Date.now();
      let method      = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
      let url         = typeof input === 'string' ? input : (input && input.url) || '';
      let requestBody = init && init.body ? String(init.body) : '';

      return bridge.originalFetch(input, init).then(function(response) {
        let clone = response.clone();
        return clone.text().then(function(responseBody) {
          let record = {
            method:       method,
            url:          url,
            status:       response.status,
            ok:           response.ok,
            durationMs:   Date.now() - startedAt,
            requestBody:  self._limit(requestBody,  4000),
            responseBody: self._limit(responseBody, 4000)
          };
          bridge.subscribers.forEach(function(panel) {
            if (panel.captureFetch) panel.addRequest(record);
          });
          return response;
        }, function() {
          /* clone.text() failed — still forward the original response */
          let record = {
            method:       method,
            url:          url,
            status:       response.status,
            ok:           response.ok,
            durationMs:   Date.now() - startedAt,
            requestBody:  self._limit(requestBody, 4000),
            responseBody: ''
          };
          bridge.subscribers.forEach(function(panel) {
            if (panel.captureFetch) panel.addRequest(record);
          });
          return response;
        });
      }, function(error) {
        let record = {
          method:       method,
          url:          url,
          status:       0,
          ok:           false,
          durationMs:   Date.now() - startedAt,
          requestBody:  self._limit(requestBody, 4000),
          responseBody: error && error.message ? error.message : 'Network error'
        };
        bridge.subscribers.forEach(function(panel) {
          if (panel.captureFetch) panel.addRequest(record);
          if (panel.captureWindowErrors) panel.addError({
            name:    error && error.name    ? error.name    : 'FetchError',
            message: error && error.message ? error.message : 'Network error',
            stack:   error && error.stack   ? error.stack   : '',
            source:  'fetch'
          });
        });
        throw error;
      });
    };
  }

  /* ── Window errors ── */
  if (this.captureWindowErrors && !bridge.errorPatched) {
    bridge.errorPatched = true;
    bridge.onError = function(event) {
      bridge.subscribers.forEach(function(panel) {
        if (!panel.captureWindowErrors) return;
        panel.addError({
          name:    event.error && event.error.name  ? event.error.name  : 'Error',
          message: event.message || 'Runtime error',
          stack:   event.error && event.error.stack ? event.error.stack : '',
          source:  'window'
        });
      });
    };
    bridge.onRejection = function(event) {
      let reason = event.reason || {};
      bridge.subscribers.forEach(function(panel) {
        if (!panel.captureWindowErrors) return;
        panel.addError({
          name:    reason.name    || 'UnhandledRejection',
          message: reason.message || String(reason),
          stack:   reason.stack   || '',
          source:  'promise'
        });
      });
    };
    window.addEventListener('error',            bridge.onError);
    window.addEventListener('unhandledrejection', bridge.onRejection);
  }
};

MTS.DiagnosticsPanel.prototype._unsubscribeGlobals = function() {
  let bridge = MTS.DiagnosticsPanel._bridge;
  if (!bridge) return;
  bridge.subscribers.delete(this);
};

/* ════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════ */

MTS.DiagnosticsPanel.prototype._empty = function(text) {
  let el = document.createElement('div');
  el.className = 'mts-diag__empty';
  el.textContent = text;
  return el;
};

MTS.DiagnosticsPanel.prototype._trim = function(items) {
  if (items.length > this.maxEntries) items.length = this.maxEntries;
};

MTS.DiagnosticsPanel.prototype._uid = function(prefix) {
  MTS.DiagnosticsPanel.__seq = (MTS.DiagnosticsPanel.__seq || 0) + 1;
  return prefix + '-' + MTS.DiagnosticsPanel.__seq;
};

MTS.DiagnosticsPanel.prototype._formatTime = function(value) {
  let d = value ? new Date(value) : new Date();
  return d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

MTS.DiagnosticsPanel.prototype._parsePx = function(value) {
  if (typeof value === 'number') return value;
  let match = String(value || '').match(/(\d+(?:\.\d+)?)px/);
  return match ? Number(match[1]) : null;
};

MTS.DiagnosticsPanel.prototype._argsToMessage = function(args) {
  let self = this;
  return args.map(function(arg) { return self._stringify(arg); }).join(' ');
};

MTS.DiagnosticsPanel.prototype._stringify = function(value) {
  if (typeof value === 'string')  return value;
  if (value == null)              return '';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  try { return JSON.stringify(value); } catch (err) { return String(value); }
};

MTS.DiagnosticsPanel.prototype._compact = function(value) {
  return this._stringify(value).replace(/\s+/g, ' ').trim();
};

MTS.DiagnosticsPanel.prototype._limit = function(value, max) {
  let text = value == null ? '' : String(value);
  return text.length > max ? text.slice(0, max) + '\n…' : text;
};

MTS.DiagnosticsPanel.prototype._escape = function(value) {
  return String(value == null ? '' : value)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
};

MTS.DiagnosticsPanel.prototype._chevron = function(direction) {
  return direction === 'down' ? '&#9662;' : '&#9652;';
};

MTS.DiagnosticsPanel.prototype._icon = function(name, size) {
  if (window.MTS && MTS.Icon && typeof MTS.Icon.get === 'function') {
    return MTS.Icon.get(name, size || 14);
  }
  return '';
};
