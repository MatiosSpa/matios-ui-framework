/* ============================================================
   MATIOS UI — matios-ui-devpanel.js
   MTS.DevPanel — Generic developer panel for any component.

   Wraps a component element with:
     · Left   → Config panel  (auto-generated from component.getConfig())
     · Right  → Code panel    (auto-generated from component.getCode())
     · Bottom → Activity log  (auto-subscribed via watch events[])

   Usage:
     const panel = new MTS.DevPanel('#my-component', {
       enabled: true,           // false = no-op, component untouched
       watch:   cal,            // component instance — reads getConfig() + getCode()
       panels:  ['config', 'log', 'code'],
       events:  [               // events to auto-log
         { name:'eventClick', badge:'click', label:'onEventClick',
           payload: d => d.event?.title },
       ],
     });

     panel.log('click', 'Something happened', 'detail');
     panel.clearLog();
     panel.refreshCode();

   Component contract (optional but recommended):
     component.getConfig() → Array of config items with { key, type, label, value, options?, apply }
     component.getCode()   → String of JS code representing current config
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DevPanel = class MtsDevPanel {

  constructor(selector, options = {}) {
    this._target  = typeof selector === 'string'
      ? document.querySelector(selector) : selector;

    this.enabled  = options.enabled  ?? true;
    this.panels   = options.panels   ?? ['config', 'log', 'code'];
    this.watch    = options.watch    ?? null;   /* component instance */
    this.events   = options.events   ?? [];     /* [{ name, badge, label, payload }] */

    this._logCount   = 0;
    this._listeners  = [];

    if (!this.enabled || !this._target) return;

    this._build();
    this._bindEvents();
    this.refreshCode();
  }

  /* ── Public API ─────────────────────────────────────────── */

  log(badge, message, detail = '') {
    if (!this._logBodyEl) return;
    this._logCount++;
    if (this._logCountEl) this._logCountEl.textContent = this._logCount;
    const row  = document.createElement('div');
    row.className = 'dp-log__row';
    const time = new Date().toLocaleTimeString('es-CL',
      { hour:'2-digit', minute:'2-digit', second:'2-digit' });
    var _timeEl = document.createElement('span'); _timeEl.className = 'dp-log__time'; _timeEl.textContent = time;
    var _badgeEl = document.createElement('span'); _badgeEl.className = 'dp-log__badge dp-log__badge--' + badge; _badgeEl.textContent = badge;
    var _msgEl = document.createElement('span'); _msgEl.className = 'dp-log__msg'; _msgEl.textContent = message;
    row.appendChild(_timeEl); row.appendChild(_badgeEl); row.appendChild(_msgEl);
    if (detail) { var _detailEl = document.createElement('span'); _detailEl.className = 'dp-log__detail'; _detailEl.textContent = detail; row.appendChild(_detailEl); }
    this._logBodyEl.prepend(row);
    const rows = this._logBodyEl.querySelectorAll('.dp-log__row');
    if (rows.length > 200) rows[rows.length - 1].remove();
  }

  clearLog() {
    if (!this._logBodyEl) return;
    this._logBodyEl.innerHTML = '';
    this._logCount = 0;
    if (this._logCountEl) this._logCountEl.textContent = '0';
  }

  refreshCode() {
    if (!this._codeBodyEl) return;
    const code = this.watch?.getCode?.();
    if (!code) return;
    this._codeBodyEl.innerHTML = this._highlight(code);
    /* Auto-expand code panel on first content */
    if (this._codePanelEl?.classList.contains('collapsed')) {
      this._codePanelEl.classList.remove('collapsed');
      const btn = this._codePanelEl.querySelector('.dp-panel__toggle');
      if (btn) btn.innerHTML = this._icon('chevron-right');
    }
  }

  destroy() {
    this._listeners.forEach(({ target, name, fn }) => {
      if (target?.off) target.off(name, fn);
      else if (target?.removeEventListener) target.removeEventListener(name, fn);
    });
    this._listeners = [];
    if (this._wrapEl && this._target) this._wrapEl.replaceWith(this._target);
  }

  /* ── Build DOM ──────────────────────────────────────────── */

  _build() {
    const target = this._target;
    const parent = target.parentNode;

    const wrap = document.createElement('div');
    wrap.className = 'dp-wrap';
    this._wrapEl = wrap;

    /* dp-row contiene los dos splitters anidados */
    const row = document.createElement('div');
    row.className = 'dp-row';
    /* right-side = center + code — contenedor para el segundo splitter */
    const rightSide = document.createElement('div');
    rightSide.className = 'dp-right-side';

    /* ── Config panel (left) ── */
    if (this.panels.includes('config')) {
      const cfgPanel = document.createElement('div');
      cfgPanel.className = 'dp-panel dp-panel--config';
      cfgPanel.innerHTML =
        '<div class="dp-panel__header">' +
          '<span class="dp-panel__icon">' + this._icon('settings') + '</span>' +
          '<span class="dp-panel__title">Config</span>' +
          '<button class="dp-panel__toggle" data-panel="config">' + this._icon('chevron-left') + '</button>' +
        '</div>' +
        '<div class="dp-panel__body" id="dp-cfg-body"></div>';
      this._configPanelEl = cfgPanel;
      this._configBodyEl  = cfgPanel.querySelector('#dp-cfg-body');
      this._buildConfigPanel();
      row.appendChild(cfgPanel);
    }

    /* ── Center ── */
    const center = document.createElement('div');
    center.className = 'dp-center';
    center.appendChild(target);
    rightSide.appendChild(center);

    /* ── Code panel (right) ── */
    if (this.panels.includes('code')) {
      const codePanel = document.createElement('div');
      codePanel.className = 'dp-panel dp-panel--code collapsed';
      codePanel.innerHTML =
        '<div class="dp-panel__header">' +
          '<span class="dp-panel__icon">' + this._icon('code') + '</span>' +
          '<span class="dp-panel__title">JavaScript</span>' +
          '<button class="dp-panel__btn" id="dp-copy-btn">' + this._icon('copy') + '</button>' +
          '<button class="dp-panel__toggle" data-panel="code">' + this._icon('chevron-right') + '</button>' +
        '</div>' +
        '<div class="dp-panel__body dp-code__body" id="dp-code-body"></div>';
      this._codePanelEl = codePanel;
      this._codeBodyEl  = codePanel.querySelector('#dp-code-body');
      codePanel.querySelector('#dp-copy-btn').addEventListener('click', () => this._copyCode());
      rightSide.appendChild(codePanel);
    }

    row.appendChild(rightSide);
    wrap.appendChild(row);

    /* Init splitters after DOM is attached — needs real px dimensions */
    requestAnimationFrame(() => {
      if (typeof MTS === 'undefined' || !MTS.Splitter) return;

      /* Splitter 2: center | code */
      if (this.panels.includes('code') && rightSide.children.length >= 2) {
        const rsW    = rightSide.getBoundingClientRect().width || 1000;
        const codePx = 280;
        const codePC = Math.max(15, Math.min(40, (codePx / rsW) * 100));
        this._splitterRight = new MTS.Splitter(rightSide, {
          direction:   'horizontal',
          initialSize: 100 - codePC,
          minSize:     20,
          collapsible: true,
          gutterSize:  '5px',
        });
      }

      /* Splitter 1: config | rightSide */
      if (this.panels.includes('config') && row.children.length >= 2) {
        const rowW   = row.getBoundingClientRect().width || 1400;
        const cfgPx  = 200;
        const cfgPC  = Math.max(5, Math.min(35, (cfgPx / rowW) * 100));
        this._splitterLeft = new MTS.Splitter(row, {
          direction:   'horizontal',
          initialSize: cfgPC,
          minSize:     5,
          maxSize:     40,
          collapsible: true,
          gutterSize:  '5px',
        });
      }
    });

    /* ── Log panel (bottom) ── */
    if (this.panels.includes('log')) {
      const logPanel = document.createElement('div');
      logPanel.className = 'dp-log';
      logPanel.innerHTML =
        '<div class="dp-log__header" id="dp-log-header">' +
          '<span class="dp-log__icon">' + this._icon('activity') + '</span>' +
          '<span class="dp-log__label">Activity Log</span>' +
          '<span class="dp-log__count" id="dp-log-count">0</span>' +
          '<div class="dp-log__spacer"></div>' +
          '<button class="dp-log__clear" id="dp-log-clear">Clear</button>' +
          '<span class="dp-log__chevron">▾</span>' +
        '</div>' +
        '<div class="dp-log__body" id="dp-log-body"></div>';
      this._logPanelEl = logPanel;
      this._logBodyEl  = logPanel.querySelector('#dp-log-body');
      this._logCountEl = logPanel.querySelector('#dp-log-count');
      logPanel.querySelector('#dp-log-header').addEventListener('click', () =>
        logPanel.classList.toggle('open'));
      logPanel.querySelector('#dp-log-clear').addEventListener('click', e => {
        e.stopPropagation(); this.clearLog();
      });
      wrap.appendChild(logPanel);
    }

    parent.insertBefore(wrap, target.nextSibling);

    /* Toggle buttons */
    wrap.querySelectorAll('.dp-panel__toggle').forEach(btn => {
      btn.addEventListener('click', () => this._togglePanel(btn.dataset.panel));
    });
  }

  /* ── Config panel auto-generated from component.getConfig() ── */
  _buildConfigPanel() {
    if (!this._configBodyEl || !this.watch?.getConfig) return;
    const items = this.watch.getConfig();
    if (!items?.length) return;

    /* Group items */
    const groups = {};
    items.forEach(item => {
      const g = item.group || 'General';
      if (!groups[g]) groups[g] = [];
      groups[g].push(item);
    });

    Object.entries(groups).forEach(([groupName, groupItems]) => {
      const section = document.createElement('div');
      section.className = 'dp-cfg-group';
      section.innerHTML = '<div class="dp-cfg-group__title">' + this._escape(groupName) + '</div>';

      groupItems.forEach(item => {
        const row = document.createElement('div');
        row.className = 'dp-cfg-row';

        if (item.type === 'toggle') {
          row.innerHTML =
            '<div class="dp-cfg-toggle' + (item.value ? ' on' : '') + '" data-key="' + this._escape(item.key) + '">' +
              '<span class="dp-cfg-toggle__label">' + this._escape(item.label) + '</span>' +
              '<div class="dp-cfg-toggle__switch"></div>' +
            '</div>';
          const tog = row.querySelector('.dp-cfg-toggle');
          tog.addEventListener('click', () => {
            const isOn = tog.classList.toggle('on');
            item.apply(isOn, this.watch);
            this.refreshCode();
          });

        } else if (item.type === 'select') {
          row.innerHTML =
            '<label class="dp-cfg-label">' + this._escape(item.label) + '</label>' +
            '<select class="dp-cfg-select" data-key="' + this._escape(item.key) + '">' +
              (item.options || []).map(o =>
                '<option value="' + this._escape(o.value) + '"' + (String(o.value) === String(item.value) ? ' selected' : '') + '>' + this._escape(o.label) + '</option>'
              ).join('') +
            '</select>';
          row.querySelector('select').addEventListener('change', e => {
            item.apply(e.target.value, this.watch);
            this.refreshCode();
          });

        } else if (item.type === 'time') {
          row.innerHTML =
            '<label class="dp-cfg-label">' + this._escape(item.label) + '</label>' +
            '<input class="dp-cfg-input" type="text" value="' + this._escape(item.value||'') + '" data-key="' + this._escape(item.key) + '" placeholder="HH:MM">';
          row.querySelector('input').addEventListener('change', e => {
            item.apply(e.target.value, this.watch);
            this.refreshCode();
          });

        } else if (item.type === 'number') {
          row.innerHTML =
            '<label class="dp-cfg-label">' + this._escape(item.label) + '</label>' +
            '<input class="dp-cfg-input" type="number" value="' + this._escape(item.value||'') + '" data-key="' + this._escape(item.key) + '">';
          row.querySelector('input').addEventListener('change', e => {
            item.apply(parseInt(e.target.value), this.watch);
            this.refreshCode();
          });
        }

        if (item.description) row.title = item.description;
        section.appendChild(row);
      });

      this._configBodyEl.appendChild(section);
    });
  }

  /* ── Event binding ──────────────────────────────────────── */

  _bindEvents() {
    if (!this.watch) return;
    this.events.forEach(({ name, badge, label, payload }) => {
      const fn = (e) => {
        const d   = e?.detail ?? e;
        const msg = label || name;
        const det = payload ? (()=>{ try{ return payload(d); }catch(x){ return ''; } })() : '';
        this.log(badge || 'event', msg, det);
        this.refreshCode();
      };
      if (this.watch.on) {
        this.watch.on(name, fn);
        this._listeners.push({ target: this.watch, name, fn });
      }
    });
  }

  /* ── Panel toggle ───────────────────────────────────────── */

  _togglePanel(name) {
    const el = name === 'config' ? this._configPanelEl : this._codePanelEl;
    if (!el) return;
    el.classList.toggle('collapsed');
    const btn = el.querySelector('.dp-panel__toggle');
    if (!btn) return;
    if (name === 'config') {
      btn.innerHTML = el.classList.contains('collapsed')
        ? this._icon('chevron-right') : this._icon('chevron-left');
    } else {
      btn.innerHTML = el.classList.contains('collapsed')
        ? this._icon('chevron-left') : this._icon('chevron-right');
    }
  }

  /* ── Syntax highlight ───────────────────────────────────── */

  _highlight(code) {
    return code
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/('.*?'|".*?")/g,'<span class="dp-str">$1</span>')
      .replace(/(`[^`]*`)/g,'<span class="dp-str">$1</span>')
      .replace(/\b(const|let|var|new|function|return|async|await|true|false|null|undefined|if|else|for|of|in)\b/g,'<span class="dp-kw">$1</span>')
      .replace(/\b([A-Z][A-Za-z]*\.[A-Za-z]+)\b/g,'<span class="dp-cls">$1</span>')
      .replace(/(\/\/[^\n]*)/g,'<span class="dp-cmt">$1</span>')
      .replace(/\b(\d+)\b/g,'<span class="dp-num">$1</span>');
  }

  _copyCode() {
    if (!this._codeBodyEl) return;
    navigator.clipboard?.writeText(this._codeBodyEl.innerText).then(() => {
      const btn = this._wrapEl?.querySelector('#dp-copy-btn');
      if (btn) {
        btn.innerHTML = this._icon('check');
        setTimeout(() => btn.innerHTML = this._icon('copy'), 1500);
      }
    });
  }

  _icon(name) {
    return MTS?.Icon?.get?.(name, 13) || '';
  }

  _escape(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
};
