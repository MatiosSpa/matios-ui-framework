/* ============================================================
   MATIOS UI — matios-ui-jsonviewer.js
   MTS.JsonViewer — visor plegable para payloads JSON
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.JsonViewer = class MtsJsonViewer {
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) { console.error('[MTS.JsonViewer] Not found / No encontrado:', selector); return; }

    const ds = this._el.dataset || {};
    this.title = options.title ?? ds.title ?? '';
    this.subtitle = options.subtitle ?? ds.subtitle ?? '';
    this.copyable = options.copyable ?? ds.copyable !== 'false';
    this.height = options.height ?? ds.height ?? 'auto';
    this.collapsedDepth = options.collapsedDepth ?? this._parseCollapsedDepth(ds.collapsedDepth);
    this.emptyText = options.emptyText ?? ds.emptyText ?? 'Sin datos JSON.';
    this.editable = options.editable ?? ds.editable === 'true';
    this.placeholder = options.placeholder ?? ds.placeholder ?? 'Pega aqui un JSON y presiona Format.';

    this._source = options.data ?? ds.data ?? '';
    this._parsed = null;
    this._raw = '';
    this._parseError = '';
    this._collapsed = new Set();
    this._copyInstance = null;
    this._copyHost = null;
    this._fallbackCopyHandler = null;
    this._copyTimer = null;

    this._build();
    this.setData(this._source);
  }

  setData(data) {
    this._source = data;
    this._parsed = null;
    this._raw = '';
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
  }

  setTitle(title, subtitle) {
    this.title = title ?? '';
    if (subtitle !== undefined) this.subtitle = subtitle ?? '';
    this._renderToolbar();
    return this;
  }

  format() {
    if (!this.editable || !this._input) return this;
    this.setData(this._input.value);
    return this;
  }

  expandAll() {
    this._collapsed.clear();
    this._renderBody();
    return this;
  }

  collapseAll() {
    this._collapsed = this._collectCollapsiblePaths(this._parsed, '$', 0);
    this._renderBody();
    return this;
  }

  destroy() {
    clearTimeout(this._copyTimer);
    if (this._copyInstance && typeof this._copyInstance.destroy === 'function') this._copyInstance.destroy();
    if (this._copyHost && this._fallbackCopyHandler) this._copyHost.removeEventListener('click', this._fallbackCopyHandler);
    this._el.innerHTML = '';
  }

  _build() {
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
      this._formatBtn.addEventListener('click', () => this.format());
      this._editorActions.appendChild(this._formatBtn);

      this._input.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
          event.preventDefault();
          this.format();
        }
      });
    }

    this._viewer = document.createElement('div');
    this._viewer.className = 'mts-jsonviewer__viewer';
    this._body.appendChild(this._viewer);

    this._renderToolbar();
  }

  _render() {
    this._renderToolbar();
    this._renderBody();
  }

  _renderToolbar() {
    if (this._copyInstance && typeof this._copyInstance.destroy === 'function') {
      this._copyInstance.destroy();
      this._copyInstance = null;
    }
    if (this._copyHost && this._fallbackCopyHandler) {
      this._copyHost.removeEventListener('click', this._fallbackCopyHandler);
      this._fallbackCopyHandler = null;
    }

    this._toolbar.innerHTML = '';

    const meta = document.createElement('div');
    meta.className = 'mts-jsonviewer__meta';

    if (this.title) {
      const title = document.createElement('p');
      title.className = 'mts-jsonviewer__title';
      title.textContent = this.title;
      meta.appendChild(title);
    }

    if (this.subtitle) {
      const subtitle = document.createElement('p');
      subtitle.className = 'mts-jsonviewer__subtitle';
      subtitle.textContent = this.subtitle;
      meta.appendChild(subtitle);
    }

    if (this.title || this.subtitle) this._toolbar.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'mts-jsonviewer__actions';

    const state = document.createElement('span');
    state.className = 'mts-jsonviewer__state' + (this._parseError ? ' is-error' : '');
    state.textContent = this._parseError ? 'RAW' : 'JSON';
    actions.appendChild(state);

    if (!this._parseError && this._isCompound(this._parsed)) {
      const collapseBtn = this._makeActionButton('Collapse');
      collapseBtn.addEventListener('click', () => this.collapseAll());
      actions.appendChild(collapseBtn);

      const expandBtn = this._makeActionButton('Expand');
      expandBtn.addEventListener('click', () => this.expandAll());
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
  }

  _renderBody() {
    this._viewer.innerHTML = '';

    if (this.editable && this._input && document.activeElement !== this._input) {
      this._input.value = this._raw || '';
    }

    if (!this._raw && !this._parsed && !this._parseError) {
      this._viewer.appendChild(this._empty(this.emptyText));
      return;
    }

    if (this._parseError) {
      const error = document.createElement('div');
      error.className = 'mts-jsonviewer__error';
      error.innerHTML =
        '<span class="mts-jsonviewer__state is-error">JSON invalido</span>' +
        '<p class="mts-jsonviewer__error-text">' + this._escape(this._parseError) + '</p>';
      this._viewer.appendChild(error);

      const raw = document.createElement('pre');
      raw.className = 'mts-jsonviewer__raw';
      raw.textContent = this._raw;
      this._viewer.appendChild(raw);
      return;
    }

    const tree = document.createElement('div');
    tree.className = 'mts-jsonviewer__tree';
    tree.appendChild(this._renderValue(this._parsed, '$', 0, null, true));
    this._viewer.appendChild(tree);
  }

  _renderValue(value, path, level, key, isRoot) {
    const frag = document.createDocumentFragment();

    if (!this._isCompound(value)) {
      frag.appendChild(this._renderPrimitiveLine(value, key, level, isRoot));
      return frag;
    }

    const isArray = Array.isArray(value);
    const collapsed = this._collapsed.has(path);
    const wrapper = document.createElement('div');
    wrapper.className = 'mts-jsonviewer__node';

    const header = document.createElement('button');
    header.type = 'button';
    header.className = 'mts-jsonviewer__line mts-jsonviewer__line--toggle';
    header.style.setProperty('--level', level);

    const toggle = document.createElement('span');
    toggle.className = 'mts-jsonviewer__toggle';
    toggle.innerHTML = this._icon(collapsed ? 'chevron-right' : 'chevron-down');
    header.appendChild(toggle);

    if (!isRoot) header.appendChild(this._keyEl(key));

    const open = document.createElement('span');
    open.className = 'mts-jsonviewer__punctuation';
    open.textContent = isArray ? '[' : '{';
    header.appendChild(open);

    const summary = document.createElement('span');
    summary.className = 'mts-jsonviewer__summary';

    if (collapsed) {
      summary.textContent = ' ' + this._summary(value) + ' ';
      header.appendChild(summary);

      const closeCollapsed = document.createElement('span');
      closeCollapsed.className = 'mts-jsonviewer__punctuation';
      closeCollapsed.textContent = isArray ? ']' : '}';
      header.appendChild(closeCollapsed);
    } else {
      summary.textContent = ' ' + this._summary(value);
      header.appendChild(summary);
    }

    header.addEventListener('click', () => {
      if (this._collapsed.has(path)) this._collapsed.delete(path);
      else this._collapsed.add(path);
      this._renderBody();
    });
    wrapper.appendChild(header);

    if (!collapsed) {
      const keys = isArray ? value.map(function (_, index) { return index; }) : Object.keys(value);
      const children = document.createElement('div');
      children.className = 'mts-jsonviewer__children';

      if (!keys.length) {
        const empty = document.createElement('div');
        empty.className = 'mts-jsonviewer__line mts-jsonviewer__line--empty';
        empty.style.setProperty('--level', level + 1);
        empty.innerHTML = '<span class="mts-jsonviewer__empty-label">' + (isArray ? '(empty array)' : '(empty object)') + '</span>';
        children.appendChild(empty);
      } else {
        keys.forEach((childKey) => {
          const childValue = value[childKey];
          const childPath = isArray ? path + '[' + childKey + ']' : path + '.' + childKey;
          children.appendChild(this._renderValue(childValue, childPath, level + 1, childKey, false));
        });
      }

      wrapper.appendChild(children);

      const close = document.createElement('div');
      close.className = 'mts-jsonviewer__line mts-jsonviewer__line--close';
      close.style.setProperty('--level', level);
      close.innerHTML = '<span class="mts-jsonviewer__spacer"></span><span class="mts-jsonviewer__punctuation">' + (isArray ? ']' : '}') + '</span>';
      wrapper.appendChild(close);
    }

    frag.appendChild(wrapper);
    return frag;
  }

  _renderPrimitiveLine(value, key, level, isRoot) {
    const line = document.createElement('div');
    line.className = 'mts-jsonviewer__line';
    line.style.setProperty('--level', level);

    const spacer = document.createElement('span');
    spacer.className = 'mts-jsonviewer__spacer';
    line.appendChild(spacer);

    if (!isRoot) line.appendChild(this._keyEl(key));

    const valueEl = document.createElement('span');
    valueEl.className = 'mts-jsonviewer__value ' + this._valueClass(value);
    valueEl.textContent = this._formatPrimitive(value);
    line.appendChild(valueEl);

    return line;
  }

  _keyEl(key) {
    const keyEl = document.createElement('span');
    keyEl.className = 'mts-jsonviewer__key';
    keyEl.textContent = '"' + String(key) + '": ';
    return keyEl;
  }

  _syncCopyButton() {
    if (!this._copyHost) return;
    const copyText = this._raw || '';

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
    this._fallbackCopyHandler = () => {
      if (!copyText) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(copyText).then(() => this._showFallbackCopied());
        return;
      }
      const ta = document.createElement('textarea');
      ta.value = copyText;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this._showFallbackCopied();
    };
    this._copyHost.addEventListener('click', this._fallbackCopyHandler);
  }

  _showFallbackCopied() {
    this._copyHost.innerHTML = '<span class="mts-btn__label">Copiado</span>';
    clearTimeout(this._copyTimer);
    this._copyTimer = setTimeout(() => {
      if (this._copyHost) this._copyHost.innerHTML = '<span class="mts-btn__label">Copiar</span>';
    }, 1800);
  }

  _makeActionButton(label) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mts-btn mts-btn--secondary mts-btn--sm';
    btn.innerHTML = '<span class="mts-btn__label">' + label + '</span>';
    return btn;
  }

  _summary(value) {
    if (Array.isArray(value)) return value.length + (value.length === 1 ? ' item' : ' items');
    const count = Object.keys(value || {}).length;
    return count + (count === 1 ? ' key' : ' keys');
  }

  _valueClass(value) {
    if (value === null) return 'is-null';
    if (typeof value === 'string') return 'is-string';
    if (typeof value === 'number') return 'is-number';
    if (typeof value === 'boolean') return 'is-boolean';
    return 'is-plain';
  }

  _formatPrimitive(value) {
    if (value === null) return 'null';
    if (typeof value === 'string') return '"' + value + '"';
    return String(value);
  }

  _resetCollapsedState() {
    this._collapsed.clear();
    if (!this._isCompound(this._parsed) || typeof this.collapsedDepth !== 'number') return;

    const walk = (value, path, level) => {
      if (!this._isCompound(value)) return;
      if (level >= this.collapsedDepth && path !== '$') this._collapsed.add(path);

      if (Array.isArray(value)) {
        value.forEach((item, index) => walk(item, path + '[' + index + ']', level + 1));
        return;
      }

      Object.keys(value).forEach((key) => walk(value[key], path + '.' + key, level + 1));
    };

    walk(this._parsed, '$', 0);
  }

  _collectCollapsiblePaths(value, path, level) {
    const set = new Set();
    const walk = (node, nodePath) => {
      if (!this._isCompound(node)) return;
      if (nodePath !== '$') set.add(nodePath);
      if (Array.isArray(node)) {
        node.forEach((item, index) => walk(item, nodePath + '[' + index + ']'));
        return;
      }
      Object.keys(node).forEach((key) => walk(node[key], nodePath + '.' + key));
    };
    walk(value, path, level);
    return set;
  }

  _empty(text) {
    const empty = document.createElement('div');
    empty.className = 'mts-jsonviewer__empty';
    empty.textContent = text;
    return empty;
  }

  _icon(name) {
    if (window.MTS && MTS.Icon && typeof MTS.Icon.get === 'function') return MTS.Icon.get(name);
    return name === 'chevron-down' ? '▾' : '▸';
  }

  _isCompound(value) {
    return !!value && typeof value === 'object';
  }

  _parseCollapsedDepth(value) {
    if (value === undefined || value === null || value === '') return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  _escape(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  static safeStringify(value) {
    try {
      const seen = new WeakSet();
      return JSON.stringify(value, function (key, val) {
        if (typeof val === 'object' && val !== null) {
          if (seen.has(val)) return '[Circular]';
          seen.add(val);
        }
        return val;
      }, 2);
    } catch (error) {
      return String(value ?? '');
    }
  }
};
