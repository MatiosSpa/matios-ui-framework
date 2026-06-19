/* ============================================================
   MATIOS UI — matios-ui-timefilter.js
   MTS.TimeFilter — Time-window filter (Kibana-style)

   A trigger that shows the active window and opens a popover with 3 modes:
     · Relative — "Last N {minutes|hours|days|weeks}"
     · Absolute — from / to dates
     · Quick    — presets (15m, 1h, 6h, 24h, 7d, …)

   It does NOT filter data: it resolves a { from, to } range and hands it back
   through onChange / get(). The consumer decides what to do with it.

   In relative mode every get() recomputes to=now and from=now − n·unit, so an
   auto-refresh loop shows a window that advances on its own.

   Composes: MTS.Popover (manual) · MTS.NumberInput · MTS.Select ·
             MTS.DatePicker.Date|DateTime · MTS.Icon · MTS.Toast (optional)
   ============================================================ */

window.MTS = window.MTS || {};

MTS.TimeFilter = class MtsTimeFilter {

  /**
   * @param {string|Element} selector  host element (a <div>)
   * @param {object} options
   *   value        initial range — { mode:'relative', n, unit } | { mode:'absolute', from, to }
   *   quickRanges  array of { n, unit, label? } presets for the Quick tab
   *   units        enabled units in Relative — default ['m','h','d','w']
   *   withTime     boolean — Absolute takes time (DateTime) instead of day granularity
   *   position     popover position — default 'bottom'
   *   width        popover width — default '360px'
   *   locale       locale for default texts
   *   texts        object — overrides that win over the i18n catalog
   *   defaultTab   'relative'|'absolute'|'quick' — default 'relative'
   *   onChange     function(RangeResult) — fired on apply / quick pick
   *   onOpen/onClose function() — popover lifecycle
   */
  constructor(selector, options) {
    options = options || {};
    this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) { console.error('[MTS.TimeFilter] not found:', selector); return; }

    this.texts       = options.texts || {};
    this.position    = options.position || 'bottom';
    this.width       = options.width || '360px';
    this.withTime    = !!options.withTime;
    this._tab        = options.defaultTab || 'relative';
    this._listeners  = {};

    if (options.onChange) this.on('change', options.onChange);
    if (options.onOpen)   this.on('open', options.onOpen);
    if (options.onClose)  this.on('close', options.onClose);

    /* enabled units (in declared order), with their span in ms */
    const MS = { m: 60000, h: 3600000, d: 86400000, w: 604800000 };
    const enabled = (options.units && options.units.length) ? options.units : ['m', 'h', 'd', 'w'];
    const self = this;
    this.units = enabled
      .filter(function (u) { return MS[u]; })
      .map(function (u) { return { value: u, ms: MS[u] }; });

    /* quick presets */
    this.quickRanges = options.quickRanges || [
      { n: 15, unit: 'm' }, { n: 1, unit: 'h' }, { n: 6, unit: 'h' },
      { n: 24, unit: 'h' }, { n: 7, unit: 'd' }
    ];

    /* initial range */
    const v = options.value || { mode: 'relative', n: 1, unit: 'h' };
    this.range = (v.mode === 'absolute' && v.from && v.to)
      ? { mode: 'absolute', from: new Date(v.from), to: new Date(v.to) }
      : { mode: 'relative', n: v.n || 1, unit: v.unit || 'h' };

    /* popover popups that live in document.body must NOT close the panel */
    this._outside = function (e) {
      const popEl = self._popover && self._popover._pop;
      if (popEl && popEl.contains(e.target)) { return; }
      if (self._el && self._el.contains(e.target)) { return; }
      if (e.target && e.target.closest && e.target.closest("[class*='mts-picker'], .mts-select__dropdown")) { return; }
      self.close();
    };

    /* keep the panel glued to the trigger while the page scrolls / resizes */
    this._onReposition = function () { self._reposition(); };

    this._build();
  }

  /* ── locale: texts override → i18n → fallback ── */
  _t(key, fallback) {
    if (this.texts && this.texts[key] != null) return this.texts[key];
    try {
      const loc = (window.MTS && MTS.getLocale) ? MTS.getLocale() : null;
      const ns = loc && loc['MTS.TimeFilter'];
      if (ns && ns[key] != null) return ns[key];
    } catch (e) {}
    return fallback;
  }
  _unitLabel(u, n) {
    /* singular when n === 1 (e.g. "1 hour" vs "2 hours") */
    const key = (n === 1) ? 'unitsOne' : 'units';
    if (this.texts && this.texts[key] && this.texts[key][u] != null) return this.texts[key][u];
    try {
      const loc = (window.MTS && MTS.getLocale) ? MTS.getLocale() : null;
      const ns = loc && loc['MTS.TimeFilter'];
      if (ns && ns[key] && ns[key][u] != null) return ns[key][u];
      if (ns && ns.units && ns.units[u] != null) return ns.units[u]; // plural fallback
    } catch (e) {}
    const plural = { m: 'minutes', h: 'hours', d: 'days', w: 'weeks' };
    const single = { m: 'minute', h: 'hour', d: 'day', w: 'week' };
    return ((n === 1) ? single : plural)[u] || u;
  }
  _presetLabel(key) {
    if (this.texts && this.texts.presets && this.texts.presets[key] != null) return this.texts.presets[key];
    try {
      const loc = (window.MTS && MTS.getLocale) ? MTS.getLocale() : null;
      const ns = loc && loc['MTS.TimeFilter'];
      if (ns && ns.presets && ns.presets[key] != null) return ns.presets[key];
    } catch (e) {}
    const fb = { today: 'Today', yesterday: 'Yesterday', thisWeek: 'This week', lastWeek: 'Last week', thisMonth: 'This month', lastMonth: 'Last month' };
    return fb[key] || key;
  }

  /* ── range resolution ── */
  _unitMs(u) {
    for (let i = 0; i < this.units.length; i++) { if (this.units[i].value === u) { return this.units[i].ms; } }
    return 3600000;
  }
  _resolve() {
    if (this.range.mode === 'absolute' && this.range.from && this.range.to) {
      return { from: new Date(this.range.from), to: new Date(this.range.to) };
    }
    const to = new Date();
    const from = new Date(to.getTime() - (this.range.n || 1) * this._unitMs(this.range.unit || 'h'));
    return { from: from, to: to };
  }
  _fmt(d) {
    try { return this.withTime ? d.toLocaleString() : d.toLocaleDateString(); }
    catch (e) { return String(d); }
  }
  _label() {
    if (this.range.mode === 'absolute' && this.range.presetLabel) return this.range.presetLabel;
    if (this.range.mode === 'absolute' && this.range.from && this.range.to) {
      return this._fmt(new Date(this.range.from)) + ' → ' + this._fmt(new Date(this.range.to));
    }
    const n = this.range.n || 1;
    return this._t('lastN', 'Last') + ' ' + n + ' ' + this._unitLabel(this.range.unit || 'h', n);
  }
  /* resolve a semantic preset key → an absolute { from, to } */
  _resolvePreset(key) {
    const now = new Date();
    function startDay(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
    function endDay(d) { const x = new Date(d); x.setHours(23, 59, 59, 999); return x; }
    function startWeek(d) { const x = startDay(d); const dow = (x.getDay() + 6) % 7; x.setDate(x.getDate() - dow); return x; } // Monday = 0
    function startMonth(d) { const x = startDay(d); x.setDate(1); return x; }
    switch (key) {
      case 'today':     return { from: startDay(now), to: new Date() };
      case 'yesterday': { const y = new Date(now.getTime() - 86400000); return { from: startDay(y), to: endDay(y) }; }
      case 'thisWeek':  return { from: startWeek(now), to: new Date() };
      case 'lastWeek':  { const p = new Date(startWeek(now).getTime() - 1); return { from: startWeek(p), to: endDay(p) }; }
      case 'thisMonth': return { from: startMonth(now), to: new Date() };
      case 'lastMonth': { const p = new Date(startMonth(now).getTime() - 1); return { from: startMonth(p), to: endDay(p) }; }
      default: return null;
    }
  }

  /* ── public API ── */
  get() {
    const r = this._resolve();
    return {
      mode:    this.range.mode,
      n:       this.range.mode === 'relative' ? (this.range.n || 1) : null,
      unit:    this.range.mode === 'relative' ? (this.range.unit || 'h') : null,
      preset:  this.range.mode === 'absolute' ? (this.range.preset || null) : null,
      from:    r.from,
      to:      r.to,
      fromIso: r.from.toISOString(),
      toIso:   r.to.toISOString(),
      label:   this._label()
    };
  }
  getValue() { return this.get(); }

  set(range) {
    if (range) {
      this.range = (range.mode === 'absolute' && range.from && range.to)
        ? { mode: 'absolute', from: new Date(range.from), to: new Date(range.to), preset: range.preset || null, presetLabel: range.presetLabel || null }
        : { mode: 'relative', n: range.n || 1, unit: range.unit || 'h' };
    }
    this._setLabel();
    return this;
  }
  setQuickRanges(ranges) {
    this.quickRanges = ranges || [];
    if (this._tab === 'quick' && this._popover && this._popover._visible) this._buildPanels();
    return this;
  }
  apply(range) {
    if (range) this.set(range);
    this._setLabel();
    this._emit('change', this.get());
    return this;
  }
  query() {
    const r = this._resolve();
    return 'from=' + encodeURIComponent(r.from.toISOString()) + '&to=' + encodeURIComponent(r.to.toISOString());
  }
  open() {
    if (!this._popover) { return this; }
    this._popover.show();
    if (this._trigger) this._trigger.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', this._outside, true);
    window.addEventListener('scroll', this._onReposition, true);
    window.addEventListener('resize', this._onReposition);
    this._emit('open', {});
    return this;
  }
  close() {
    if (this._popover) this._popover.hide();
    if (this._trigger) this._trigger.setAttribute('aria-expanded', 'false');
    return this;
  }

  /* ── build trigger + popover ── */
  _build() {
    const self = this;
    this._el.classList.add('mts-timefilter');
    this._el.innerHTML = ''; // safe: clearing

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'mts-timefilter__trigger mts-btn mts-btn--secondary mts-btn--sm';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');

    const cal = (window.MTS && MTS.Icon && typeof MTS.Icon.get === 'function') ? MTS.Icon.get('calendar') : '';
    const icon = document.createElement('span');
    icon.className = 'mts-timefilter__icon';
    icon.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(cal) : cal;

    const labelEl = document.createElement('span');
    labelEl.className = 'mts-timefilter__label';
    labelEl.textContent = this._label();

    trigger.appendChild(icon);
    trigger.appendChild(labelEl);
    this._el.appendChild(trigger);
    this._trigger = trigger;
    this._labelEl = labelEl;

    if (typeof MTS === 'undefined' || typeof MTS.Popover !== 'function') { return; }
    this._popover = new MTS.Popover(trigger, {
      trigger:  'manual',
      position: this.position,
      width:    this.width,
      closable: false,
      arrow:    false,
      content:  '<div></div>',
      onShow:   function () { self._buildPanels(); },
      onHide:   function () {
        document.removeEventListener('click', self._outside, true);
        window.removeEventListener('scroll', self._onReposition, true);
        window.removeEventListener('resize', self._onReposition);
        if (self._trigger) self._trigger.setAttribute('aria-expanded', 'false');
        self._emit('close', {});
      }
    });
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (self._popover && self._popover._visible) { self.close(); } else { self.open(); }
    });
  }

  _setLabel() { if (this._labelEl) this._labelEl.textContent = this._label(); }

  _body() {
    return (this._popover && this._popover._pop)
      ? this._popover._pop.querySelector('.mts-popover__body')
      : null;
  }
  _reposition() {
    if (this._popover && typeof this._popover._position === 'function') this._popover._position();
  }

  /* ── panels ── */
  _buildPanels() {
    const self = this;
    const body = this._body();
    if (!body) { return; }
    body.innerHTML = ''; // safe: clearing

    const panelWrap = document.createElement('div');
    panelWrap.className = 'mts-timefilter__panel';
    panelWrap.setAttribute('role', 'dialog');

    /* tabs */
    const TABS = [
      { k: 'relative', l: this._t('tabRelative', 'Relative') },
      { k: 'absolute', l: this._t('tabAbsolute', 'Absolute') },
      { k: 'quick',    l: this._t('tabQuick',    'Quick') }
    ];
    const tabs = document.createElement('div');
    tabs.className = 'mts-timefilter__tabs';
    tabs.setAttribute('role', 'tablist');
    TABS.forEach(function (tb) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'mts-timefilter__tab mts-btn mts-btn--sm ' + (tb.k === self._tab ? 'mts-btn--primary' : 'mts-btn--ghost');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', tb.k === self._tab ? 'true' : 'false');
      b.textContent = tb.l;
      b.addEventListener('click', function () { self._tab = tb.k; self._buildPanels(); });
      b.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') { return; }
        e.preventDefault();
        let i = 0;
        for (let k = 0; k < TABS.length; k++) { if (TABS[k].k === self._tab) { i = k; break; } }
        i = e.key === 'ArrowRight' ? (i + 1) % TABS.length : (i - 1 + TABS.length) % TABS.length;
        self._tab = TABS[i].k;
        self._buildPanels();
      });
      tabs.appendChild(b);
    });
    panelWrap.appendChild(tabs);

    const panel = document.createElement('div');
    panel.className = 'mts-timefilter__body';
    panelWrap.appendChild(panel);
    body.appendChild(panelWrap);

    if (this._tab === 'relative') { this._panelRelative(panel); }
    else if (this._tab === 'absolute') { this._panelAbsolute(panel); }
    else { this._panelQuick(panel); }

    /* focus the first control for a11y */
    const first = panel.querySelector('input, button');
    if (first && typeof first.focus === 'function') { try { first.focus(); } catch (e) {} }

    this._reposition();
  }

  _panelRelative(panel) {
    const self = this;
    const row = document.createElement('div');
    row.className = 'mts-timefilter__row';
    const nHost = document.createElement('div');
    nHost.className = 'mts-timefilter__field-n';
    const unitHost = document.createElement('div');
    unitHost.className = 'mts-timefilter__field-unit';
    row.appendChild(nHost);
    row.appendChild(unitHost);
    panel.appendChild(row);

    const n = (this.range.mode === 'relative' ? this.range.n : 1) || 1;
    const unit = (this.range.mode === 'relative' ? this.range.unit : 'h') || 'h';

    let inN = null;
    if (typeof MTS.NumberInput === 'function') {
      inN = new MTS.NumberInput(nHost, {
        label: this._t('amount', 'Amount'), value: n, min: 1, step: 1, size: 'sm'
      });
    }
    let selUnit = null;
    if (typeof MTS.Select === 'function') {
      selUnit = new MTS.Select(unitHost, {
        label: this._t('unit', 'Unit'),
        options: this.units.map(function (u) { return { value: u.value, label: self._unitLabel(u.value) }; }),
        value: unit
      });
    }

    const actions = this._actionsRow();
    const btn = this._applyButton();
    btn.addEventListener('click', function () {
      let nv = inN ? parseInt(inN.getValue(), 10) : n;
      if (!(nv > 0)) { nv = 1; }
      self.range = { mode: 'relative', n: nv, unit: (selUnit ? selUnit.getValue() : unit) || 'h' };
      self._apply();
    });
    actions.appendChild(btn);
    panel.appendChild(actions);
  }

  _panelAbsolute(panel) {
    const self = this;
    const seed = this._resolve();

    const fromHost = document.createElement('div');
    fromHost.className = 'mts-timefilter__field';
    const toHost = document.createElement('div');
    toHost.className = 'mts-timefilter__field';
    panel.appendChild(fromHost);
    panel.appendChild(toHost);

    const err = document.createElement('div');
    err.className = 'mts-timefilter__error';
    err.setAttribute('aria-live', 'polite');
    panel.appendChild(err);
    this._errEl = err;

    const PickerClass = (typeof MTS !== 'undefined' && MTS.DatePicker)
      ? (this.withTime && typeof MTS.DatePicker.DateTime === 'function' ? MTS.DatePicker.DateTime
        : (typeof MTS.DatePicker.Date === 'function' ? MTS.DatePicker.Date : null))
      : null;

    if (PickerClass) {
      this._absFrom = new PickerClass(fromHost, { label: this._t('from', 'From') });
      this._absTo   = new PickerClass(toHost,   { label: this._t('to', 'To') });
      if (typeof this._absFrom.setValue === 'function') this._absFrom.setValue(seed.from);
      if (typeof this._absTo.setValue === 'function')   this._absTo.setValue(seed.to);
    }

    const actions = this._actionsRow();
    const btn = this._applyButton();
    btn.addEventListener('click', function () {
      const fd = (self._absFrom && self._absFrom.getValue) ? self._absFrom.getValue() : null;
      const td = (self._absTo && self._absTo.getValue) ? self._absTo.getValue() : null;
      if (!fd || !td) { self._warnRange(); return; }
      const from = new Date(fd);
      const to = new Date(td);
      if (!self.withTime) { from.setHours(0, 0, 0, 0); to.setHours(23, 59, 59, 999); }
      if (!(to > from)) { self._warnRange(); return; }
      self.range = { mode: 'absolute', from: from, to: to };
      self._apply();
    });
    actions.appendChild(btn);
    panel.appendChild(actions);
  }

  _panelQuick(panel) {
    const self = this;
    const wrap = document.createElement('div');
    wrap.className = 'mts-timefilter__quick';
    this.quickRanges.forEach(function (q) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'mts-timefilter__quick-btn mts-btn mts-btn--sm mts-btn--ghost';
      b.textContent = q.label || (q.preset ? self._presetLabel(q.preset) : (q.n + q.unit));
      b.addEventListener('click', function () {
        if (q.preset) {
          const r = self._resolvePreset(q.preset);
          if (!r) { return; }
          self.range = { mode: 'absolute', from: r.from, to: r.to, preset: q.preset, presetLabel: q.label || self._presetLabel(q.preset) };
        } else {
          self.range = { mode: 'relative', n: q.n, unit: q.unit };
        }
        self._apply();
      });
      wrap.appendChild(b);
    });
    panel.appendChild(wrap);
  }

  _actionsRow() {
    const a = document.createElement('div');
    a.className = 'mts-timefilter__actions';
    return a;
  }
  _applyButton() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mts-timefilter__apply mts-btn mts-btn--primary mts-btn--sm';
    btn.textContent = this._t('apply', 'Apply');
    return btn;
  }

  _warnRange() {
    const msg = this._t('invalidRange', 'Invalid range.');
    if (window.MTS && MTS.Toast && typeof MTS.Toast.show === 'function') {
      MTS.Toast.show({ variant: 'warning', message: msg, duration: 3500 });
    } else if (this._errEl) {
      this._errEl.textContent = msg;
    }
  }

  _apply() {
    this._setLabel();
    this.close();
    this._emit('change', this.get());
  }

  /* ── events ── */
  on(event, cb) { (this._listeners[event] = this._listeners[event] || []).push(cb); return this; }
  _emit(event, detail) {
    (this._listeners[event] || []).forEach(function (fn) { fn(detail); });
    if (this._el) this._el.dispatchEvent(new CustomEvent('mts:timefilter:' + event, { bubbles: true, detail: detail }));
  }

  destroy() {
    document.removeEventListener('click', this._outside, true);
    window.removeEventListener('scroll', this._onReposition, true);
    window.removeEventListener('resize', this._onReposition);
    if (this._popover && typeof this._popover.destroy === 'function') this._popover.destroy();
    this._popover = null;
    if (this._el) this._el.innerHTML = ''; // safe: clearing
    this._listeners = {};
  }
};
