/* ============================================================
   MATIOS UI — matios-ui-jsonviewer.js
   MTS.JsonViewer — visor plegable para payloads JSON
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.JsonViewer = function MtsJsonViewer(selector, options) {
  options = options || {};
  this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!this._el) { console.error('[MTS.JsonViewer] Not found / No encontrado:', selector); return; }

  var ds = this._el.dataset || {};

  function _def(a, b) { return (a !== undefined && a !== null) ? a : b; }

  this.title          = _def(options.title,          _def(ds.title,    ''));
  this.subtitle       = _def(options.subtitle,       _def(ds.subtitle, ''));
  this.copyable       = _def(options.copyable,       ds.copyable !== 'false');
  this.height         = _def(options.height,         _def(ds.height,   'auto'));
  this.collapsedDepth = _def(options.collapsedDepth, this._parseCollapsedDepth(ds.collapsedDepth));
  this.emptyText      = _def(options.emptyText,      _def(ds.emptyText,    'Sin datos JSON.'));
  this.editable       = _def(options.editable,       ds.editable === 'true');
  this.placeholder    = _def(options.placeholder,    _def(ds.placeholder, 'Pega aqui un JSON y presiona Format.'));

  this._source              = _def(options.data, _def(ds.data, ''));
  this._parsed              = null;
  this._raw                 = '';
  this._parseError          = '';
  this._collapsed           = new Set();
  this._copyInstance        = null;
  this._copyHost            = null;
  this._fallbackCopyHandler = null;
  this._copyTimer           = null;

  this._build();
  this.setData(this._source);
};

/* ════════════════════════════════════════════════════
   API PUBLICA
   ════════════════════════════════════════════════════ */

MTS.JsonViewer.prototype.setData = function(data) {
  this._source     = data;
  this._parsed     = null;
  this._raw        = '';
  this._parseError = '';

  if (data === undefined || data === null || data === '') {
    this._raw = '';
    this._collapsed.clear();
    this._render();
    return this;
  }

  if (typeof data === 'string') {
    this._raw = data;
    try {
      this._parsed = JSON.parse(data);
      this._raw = MTS.JsonViewer.safeStringify(this._parsed);
    } catch (error) {
      this._parseError = error && error.message ? error.message : 'JSON invalido.';
    }
  } else {
    this._parsed = data;
    this._raw = MTS.JsonViewer.safeStringify(data);
  }

  this._resetCollapsedState();
  this._render();
  return this;
};

MTS.JsonViewer.prototype.setTitle = function(title, subtitle) {
  this.title = (title !== undefined && title !== null) ? title : '';
  if (subtitle !== undefined) this.subtitle = (subtitle !== undefined && subtitle !== null) ? subtitle : '';
  this._renderToolbar();
  return this;
};

MTS.JsonViewer.prototype.format = function() {
  if (!this.editable || !this._input) return this;
  this.setData(this._input.value);
  return this;
};

MTS.JsonViewer.prototype.expandAll = function() {
  this._collapsed.clear();
  this._renderBody();
  return this;
};

MTS.JsonViewer.prototype.collapseAll = function() {
  this._collapsed = this._collectCollapsiblePaths(this._parsed, '$', 0);
  this._renderBody();
  return this;
};

MTS.JsonViewer.prototype.destroy = function() {
  clearTimeout(this._copyTimer);
  if (this._copyInstance && typeof this._copyInstance.destroy === 'function') this._copyInstance.destroy();
  if (this._copyHost && this._fallbackCopyHandler) this._copyHost.removeEventListener('click', this._fallbackCopyHandler);
  this._el.innerHTML = '';
};

/* ════════════════════════════════════════════════════
   BUILD
   ════════════════════════════════════════════════════ */

MTS.JsonViewer.prototype._build = function() {
  var self = this;
  this._el.innerHTML = '';
  this._el.classList.add('mts-jsonviewer');
  this._el.style.setProperty('--mts-jsonviewer-height', this.height || 'auto');

  this._toolbar = document.createElement('div');
  this._toolbar.className = 'mts-jsonviewer__toolbar';
  this._el.appendChild(this._toolbar);

  this._body = document.createElement('div');
  this._body.className = 'mts-jsonviewer__body';
  this._el.appendChild(this._body);

  if (this.editable) {
    this._editor = document.createElement('div');
    this._editor.className = 'mts-jsonviewer__editor';
    this._body.appendChild(this._editor);

    this._input = document.createElement('textarea');
    this._input.className = 'mts-jsonviewer__input';
    this._input.placeholder = this.placeholder;
    this._editor.appendChild(this._input);

    this._editorActions = document.createElement('div');
    this._editorActions.className = 'mts-jsonviewer__editor-actions';
    this._editor.appendChild(this._editorActions);

    this._formatBtn = this._makeActionButton('Format');
    this._formatBtn.addEventListener('click', function() { self.format(); });
    this._editorActions.appendChild(this._formatBtn);

    this._input.addEventListener('keydown', function(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        self.format();
      }
    });
  }

  this._viewer = document.createElement('div');
  this._viewer.className = 'mts-jsonviewer__viewer';
  this._body.appendChild(this._viewer);

  this._renderToolbar();
};

/* ════════════════════════════════════════════════════
   RENDER
   ════════════════════════════════════════════════════ */

MTS.JsonViewer.prototype._render = function() {
  this._renderToolbar();
  this._renderBody();
};

MTS.JsonViewer.prototype._renderToolbar = function() {
  var self = this;

  if (this._copyInstance && typeof this._copyInstance.destroy === 'function') {
    this._copyInstance.destroy();
    this._copyInstance = null;
  }
  if (this._copyHost && this._fallbackCopyHandler) {
    this._copyHost.removeEventListener('click', this._fallbackCopyHandler);
    this._fallbackCopyHandler = null;
  }

  this._toolbar.innerHTML = '';

  var meta = document.createElement('div');
  meta.className = 'mts-jsonviewer__meta';

  if (this.title) {
    var titleEl = document.createElement('p');
    titleEl.className = 'mts-jsonviewer__title';
    titleEl.textContent = this.title;
    meta.appendChild(titleEl);
  }

  if (this.subtitle) {
    var subtitleEl = document.createElement('p');
    subtitleEl.className = 'mts-jsonviewer__subtitle';
    subtitleEl.textContent = this.subtitle;
    meta.appendChild(subtitleEl);
  }

  if (this.title || this.subtitle) this._toolbar.appendChild(meta);

  var actions = document.createElement('div');
  actions.className = 'mts-jsonviewer__actions';

  var state = document.createElement('span');
  state.className = 'mts-jsonviewer__state' + (this._parseError ? ' is-error' : '');
  state.textContent = this._parseError ? 'RAW' : 'JSON';
  actions.appendChild(state);

  if (!this._parseError && this._isCompound(this._parsed)) {
    var collapseBtn = this._makeActionButton('Collapse');
    collapseBtn.addEventListener('click', function() { self.collapseAll(); });
    actions.appendChild(collapseBtn);

    var expandBtn = this._makeActionButton('Expand');
    expandBtn.addEventListener('click', function() { self.expandAll(); });
    actions.appendChild(expandBtn);
  }

  if (this.copyable) {
    this._copyHost = document.createElement('button');
    this._copyHost.type = 'button';
    this._copyHost.className = 'mts-btn mts-btn--secondary mts-btn--sm';
    actions.appendChild(this._copyHost);
  } else {
    this._copyHost = null;
  }

  this._toolbar.appendChild(actions);
  this._toolbar.hidden = !(this.title || this.subtitle || actions.children.length);
  this._syncCopyButton();
};

MTS.JsonViewer.prototype._renderBody = function() {
  this._viewer.innerHTML = '';

  if (this.editable && this._input && document.activeElement !== this._input) {
    this._input.value = this._raw || '';
  }

  if (!this._raw && !this._parsed && !this._parseError) {
    this._viewer.appendChild(this._empty(this.emptyText));
    return;
  }

  if (this._parseError) {
    var errorEl = document.createElement('div');
    errorEl.className = 'mts-jsonviewer__error';
    errorEl.innerHTML =
      '<span class="mts-jsonviewer__state is-error">JSON invalido</span>' +
      '<p class="mts-jsonviewer__error-text">' + this._escape(this._parseError) + '</p>';
    this._viewer.appendChild(errorEl);

    var rawEl = document.createElement('pre');
    rawEl.className = 'mts-jsonviewer__raw';
    rawEl.textContent = this._raw;
    this._viewer.appendChild(rawEl);
    return;
  }

  var tree = document.createElement('div');
  tree.className = 'mts-jsonviewer__tree';
  tree.appendChild(this._renderValue(this._parsed, '$', 0, null, true));
  this._viewer.appendChild(tree);
};

MTS.JsonViewer.prototype._renderValue = function(value, path, level, key, isRoot) {
  var self = this;
  var frag = document.createDocumentFragment();

  if (!this._isCompound(value)) {
    frag.appendChild(this._renderPrimitiveLine(value, key, level, isRoot));
    return frag;
  }

  var isArray  = Array.isArray(value);
  var collapsed = this._collapsed.has(path);
  var wrapper  = document.createElement('div');
  wrapper.className = 'mts-jsonviewer__node';

  var header = document.createElement('button');
  header.type = 'button';
  header.className = 'mts-jsonviewer__line mts-jsonviewer__line--toggle';
  header.style.setProperty('--level', level);

  var toggle = document.createElement('span');
  toggle.className = 'mts-jsonviewer__toggle';
  toggle.innerHTML = this._icon(collapsed ? 'chevron-right' : 'chevron-down');
  header.appendChild(toggle);

  if (!isRoot) header.appendChild(this._keyEl(key));

  var open = document.createElement('span');
  open.className = 'mts-jsonviewer__punctuation';
  open.textContent = isArray ? '[' : '{';
  header.appendChild(open);

  var summary = document.createElement('span');
  summary.className = 'mts-jsonviewer__summary';

  if (collapsed) {
    summary.textContent = ' ' + this._summary(value) + ' ';
    header.appendChild(summary);
    var closeCollapsed = document.createElement('span');
    closeCollapsed.className = 'mts-jsonviewer__punctuation';
    closeCollapsed.textContent = isArray ? ']' : '}';
    header.appendChild(closeCollapsed);
  } else {
    summary.textContent = ' ' + this._summary(value);
    header.appendChild(summary);
  }

  header.addEventListener('click', function() {
    if (self._collapsed.has(path)) self._collapsed.delete(path);
    else self._collapsed.add(path);
    self._renderBody();
  });
  wrapper.appendChild(header);

  if (!collapsed) {
    var keys = isArray
      ? value.map(function(_, index) { return index; })
      : Object.keys(value);
    var children = document.createElement('div');
    children.className = 'mts-jsonviewer__children';

    if (!keys.length) {
      var emptyEl = document.createElement('div');
      emptyEl.className = 'mts-jsonviewer__line mts-jsonviewer__line--empty';
      emptyEl.style.setProperty('--level', level + 1);
      emptyEl.innerHTML = '<span class="mts-jsonviewer__empty-label">' +
        (isArray ? '(empty array)' : '(empty object)') + '</span>';
      children.appendChild(emptyEl);
    } else {
      keys.forEach(function(childKey) {
        var childValue = value[childKey];
        var childPath = isArray ? path + '[' + childKey + ']' : path + '.' + childKey;
        children.appendChild(self._renderValue(childValue, childPath, level + 1, childKey, false));
      });
    }

    wrapper.appendChild(children);

    var close = document.createElement('div');
    close.className = 'mts-jsonviewer__line mts-jsonviewer__line--close';
    close.style.setProperty('--level', level);
    close.innerHTML =
      '<span class="mts-jsonviewer__spacer"></span>' +
      '<span class="mts-jsonviewer__punctuation">' + (isArray ? ']' : '}') + '</span>';
    wrapper.appendChild(close);
  }

  frag.appendChild(wrapper);
  return frag;
};

MTS.JsonViewer.prototype._renderPrimitiveLine = function(value, key, level, isRoot) {
  var line = document.createElement('div');
  line.className = 'mts-jsonviewer__line';
  line.style.setProperty('--level', level);

  var spacer = document.createElement('span');
  spacer.className = 'mts-jsonviewer__spacer';
  line.appendChild(spacer);

  if (!isRoot) line.appendChild(this._keyEl(key));

  var valueEl = document.createElement('span');
  valueEl.className = 'mts-jsonviewer__value ' + this._valueClass(value);
  valueEl.textContent = this._formatPrimitive(value);
  line.appendChild(valueEl);

  return line;
};

MTS.JsonViewer.prototype._keyEl = function(key) {
  var keyEl = document.createElement('span');
  keyEl.className = 'mts-jsonviewer__key';
  keyEl.textContent = '"' + String(key) + '": ';
  return keyEl;
};

/* ════════════════════════════════════════════════════
   COPY
   ════════════════════════════════════════════════════ */

MTS.JsonViewer.prototype._syncCopyButton = function() {
  var self = this;
  if (!this._copyHost) return;
  var copyText = this._raw || '';

  if (this._fallbackCopyHandler) {
    this._copyHost.removeEventListener('click', this._fallbackCopyHandler);
    this._fallbackCopyHandler = null;
  }

  if (this._copyInstance && typeof this._copyInstance.setText === 'function') {
    this._copyInstance.setText(copyText);
    return;
  }

  if (window.MTS && MTS.CopyButton) {
    this._copyInstance = new MTS.CopyButton(this._copyHost, {
      text: copyText,
      label: 'Copiar',
      labelCopied: 'Copiado',
      variant: 'secondary',
      size: 'sm'
    });
    return;
  }

  this._copyHost.innerHTML = '<span class="mts-btn__label">Copiar</span>';
  this._fallbackCopyHandler = function() {
    if (!copyText) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(copyText).then(function() { self._showFallbackCopied(); });
      return;
    }
    var ta = document.createElement('textarea');
    ta.value = copyText;
    ta.style.position = 'fixed';
    ta.style.opacity  = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    self._showFallbackCopied();
  };
  this._copyHost.addEventListener('click', this._fallbackCopyHandler);
};

MTS.JsonViewer.prototype._showFallbackCopied = function() {
  var self = this;
  this._copyHost.innerHTML = '<span class="mts-btn__label">Copiado</span>';
  clearTimeout(this._copyTimer);
  this._copyTimer = setTimeout(function() {
    if (self._copyHost) self._copyHost.innerHTML = '<span class="mts-btn__label">Copiar</span>';
  }, 1800);
};

/* ════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════ */

MTS.JsonViewer.prototype._makeActionButton = function(label) {
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'mts-btn mts-btn--secondary mts-btn--sm';
  btn.innerHTML = '<span class="mts-btn__label">' + label + '</span>';
  return btn;
};

MTS.JsonViewer.prototype._summary = function(value) {
  if (Array.isArray(value)) return value.length + (value.length === 1 ? ' item' : ' items');
  var count = Object.keys(value || {}).length;
  return count + (count === 1 ? ' key' : ' keys');
};

MTS.JsonViewer.prototype._valueClass = function(value) {
  if (value === null)           return 'is-null';
  if (typeof value === 'string')  return 'is-string';
  if (typeof value === 'number')  return 'is-number';
  if (typeof value === 'boolean') return 'is-boolean';
  return 'is-plain';
};

MTS.JsonViewer.prototype._formatPrimitive = function(value) {
  if (value === null)          return 'null';
  if (typeof value === 'string') return '"' + value + '"';
  return String(value);
};

MTS.JsonViewer.prototype._resetCollapsedState = function() {
  var self = this;
  this._collapsed.clear();
  if (!this._isCompound(this._parsed) || typeof this.collapsedDepth !== 'number') return;

  function walk(value, path, level) {
    if (!self._isCompound(value)) return;
    if (level >= self.collapsedDepth && path !== '$') self._collapsed.add(path);
    if (Array.isArray(value)) {
      value.forEach(function(item, index) { walk(item, path + '[' + index + ']', level + 1); });
      return;
    }
    Object.keys(value).forEach(function(key) { walk(value[key], path + '.' + key, level + 1); });
  }

  walk(this._parsed, '$', 0);
};

MTS.JsonViewer.prototype._collectCollapsiblePaths = function(value) {
  var set = new Set();

  function walk(node, nodePath) {
    if (!(!!node && typeof node === 'object')) return;
    if (nodePath !== '$') set.add(nodePath);
    if (Array.isArray(node)) {
      node.forEach(function(item, index) { walk(item, nodePath + '[' + index + ']'); });
      return;
    }
    Object.keys(node).forEach(function(key) { walk(node[key], nodePath + '.' + key); });
  }

  walk(value, '$');
  return set;
};

MTS.JsonViewer.prototype._empty = function(text) {
  var empty = document.createElement('div');
  empty.className = 'mts-jsonviewer__empty';
  empty.textContent = text;
  return empty;
};

MTS.JsonViewer.prototype._icon = function(name) {
  if (window.MTS && MTS.Icon && typeof MTS.Icon.get === 'function') return MTS.Icon.get(name);
  return name === 'chevron-down' ? '&#9662;' : '&#9656;';
};

MTS.JsonViewer.prototype._isCompound = function(value) {
  return !!value && typeof value === 'object';
};

MTS.JsonViewer.prototype._parseCollapsedDepth = function(value) {
  if (value === undefined || value === null || value === '') return null;
  var parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

MTS.JsonViewer.prototype._escape = function(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/* ── Static helper ── */
MTS.JsonViewer.safeStringify = function(value) {
  try {
    var seen = new WeakSet();
    return JSON.stringify(value, function(key, val) {
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) return '[Circular]';
        seen.add(val);
      }
      return val;
    }, 2);
  } catch (error) {
    return String(value !== undefined && value !== null ? value : '');
  }
};
