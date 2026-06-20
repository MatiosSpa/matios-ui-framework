/**
 * MTS.Chart (v2.1.0) — clase base
 * SVG puro · 0 dependencias · XSS-safe
 *
 * Exporta:
 *   MTS.Chart — clase base (tooltip, leyenda, ResizeObserver, update, destroy, eventos)
 *
 * Utilidades compartidas accesibles desde archivos de tipo via MTS.Chart._utils:
 *   { svgEl, niceScale, defaultFmt, easeOut, PALETTE }
 *
 * Seguridad:
 *   - Todos los datos de usuario (labels, nombres de dataset, valores)
 *     se insertan con textContent. Nunca innerHTML con datos externos.
 *   - Tooltips construidos con createElement + textContent.
 *   - Funciones formatter son código del desarrollador (trusted);
 *     su resultado igual va a textContent.
 */
(function (global) {
  'use strict';

  if (!global.MTS) global.MTS = {};

  const SVG_NS = 'http://www.w3.org/2000/svg';

  // ── Paleta automática (5 familias × 4 tonos) ────────────────────────────────
  const _PALETTE = [
    '#3b82f6', '#10b981', '#e53935', '#f59e0b', '#7c3aed',
    '#1d4ed8', '#0f766e', '#cc0000', '#92400e', '#4c1d95',
    '#0d2b6b', '#115e59', '#7f0000', '#451a00', '#2e1065',
    '#60a5fa', '#34d399', '#f87171', '#fbbf24', '#a78bfa',
  ];

  // ── Utilidades ───────────────────────────────────────────────────────────────

  function _svgEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      const keys = Object.keys(attrs);
      for (let k = 0; k < keys.length; k++) {
        el.setAttribute(keys[k], attrs[keys[k]]);
      }
    }
    return el;
  }

  function _niceNum(x, round) {
    if (x === 0) return 1;
    const exp = Math.floor(Math.log10(Math.abs(x)));
    const f   = x / Math.pow(10, exp);
    let nf;
    if (round) {
      nf = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10;
    } else {
      nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
    }
    return nf * Math.pow(10, exp);
  }

  function _niceScale(rawMin, rawMax, tickCount) {
    if (rawMin === rawMax) rawMax = rawMin + 1;
    const range   = _niceNum(rawMax - rawMin, false);
    const step    = _niceNum(range / (tickCount - 1), true);
    const niceMin = Math.floor(rawMin / step) * step;
    const niceMax = Math.ceil(rawMax  / step) * step;
    const ticks   = [];
    let v = niceMin;
    while (v <= niceMax + step * 0.001) {
      ticks.push(Math.round(v * 1e9) / 1e9);
      v = Math.round((v + step) * 1e9) / 1e9;
    }
    return { min: niceMin, max: niceMax, ticks: ticks };
  }

  function _defaultFmt(v) {
    if (Math.abs(v) >= 1e6) return (v / 1e6).toFixed(1) + 'M';
    if (Math.abs(v) >= 1e3) return (v / 1e3).toFixed(1) + 'K';
    const r = Math.round(v * 100) / 100;
    return String(r);
  }

  function _easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // ── MtsChart (base) ──────────────────────────────────────────────────────────

  class MtsChart {
    constructor(el, cfg) {
      if (typeof el === 'string') el = document.querySelector(el);
      if (!el) throw new Error('MTS.Chart: element not found');
      this._el        = el;
      this._cfg       = cfg || {};
      this._listeners = {};
      this._svg       = null;
      this._legendEl  = null;
      this._tooltipEl = null;
      this._ro        = null;
      this._animReq   = null;
      this._init();
    }

    get _type() { return 'chart'; }

    _init() {
      this._el.classList.add('mts-chart', 'mts-chart--' + this._type);
      this._tooltipEl = this._buildTooltip();
      this._render();
      const self = this;
      const opts = this._cfg.options || {};
      if (opts.responsive !== false) {
        this._ro = new ResizeObserver(function () {
          if (self._el.clientWidth > 0 && self._el.clientHeight >= 0) {
            self._render();
          }
        });
        this._ro.observe(this._el);
      }
    }

    // ── Tooltip ────────────────────────────────────────────────────────────────

    _buildTooltip() {
      const t = document.createElement('div');
      t.className = 'mts-chart__tooltip';
      this._el.appendChild(t);
      return t;
    }

    _showTooltip(e, label, value, dsLabel, color) {
      const t    = this._tooltipEl;
      const opts = this._cfg.options || {};
      while (t.firstChild) t.removeChild(t.firstChild);

      if (dsLabel) {
        const ds  = document.createElement('div');
        ds.className = 'mts-chart__tooltip-dataset';
        const dot = document.createElement('span');
        dot.className = 'mts-chart__tooltip-dot';
        dot.style.background = color;
        const name = document.createElement('span');
        name.textContent = dsLabel;
        ds.appendChild(dot);
        ds.appendChild(name);
        t.appendChild(ds);
      }

      const row = document.createElement('div');
      row.className = 'mts-chart__tooltip-row';

      const lbl = document.createElement('span');
      lbl.className = 'mts-chart__tooltip-label';
      lbl.textContent = label;

      const val = document.createElement('span');
      val.className = 'mts-chart__tooltip-value';
      const fmt = opts.tooltip && opts.tooltip.formatter;
      val.textContent = fmt ? fmt(value, label) : _defaultFmt(value);

      row.appendChild(lbl);
      row.appendChild(val);
      t.appendChild(row);

      t.classList.add('mts-chart__tooltip--visible');
      this._moveTooltip(e);
    }

    _moveTooltip(e) {
      const t    = this._tooltipEl;
      const rect = this._el.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const tw   = t.offsetWidth;
      const th   = t.offsetHeight;
      const elW  = this._el.offsetWidth;
      const left = (x + tw + 16 > elW) ? x - tw - 12 : x + 12;
      t.style.left = left + 'px';
      t.style.top  = Math.max(0, y - th / 2) + 'px';
    }

    _hideTooltip() {
      this._tooltipEl.classList.remove('mts-chart__tooltip--visible');
    }

    // ── Render (abstracto — subclases sobreescriben) ───────────────────────────

    _render() {}

    // ── Leyenda ────────────────────────────────────────────────────────────────

    _buildLegend(datasets, dotClass) {
      const wrap = document.createElement('div');
      wrap.className = 'mts-chart__legend';

      for (let i = 0; i < datasets.length; i++) {
        const ds    = datasets[i];
        const color = ds.color || _PALETTE[i % _PALETTE.length];

        const item = document.createElement('div');
        item.className = 'mts-chart__legend-item';

        const dot = document.createElement('span');
        dot.className = 'mts-chart__legend-dot' + (dotClass ? ' ' + dotClass : '');
        dot.style.background = color;

        const lbl = document.createElement('span');
        lbl.className = 'mts-chart__legend-label';
        lbl.textContent = ds.label || ('Serie ' + (i + 1));

        item.appendChild(dot);
        item.appendChild(lbl);
        wrap.appendChild(item);
      }

      this._el.appendChild(wrap);
      return wrap;
    }

    // ── API pública ────────────────────────────────────────────────────────────

    on(event, fn) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(fn);
      return this;
    }

    onClick(fn) {
      return this.on('click', fn);
    }

    _emit(event, detail) {
      const fns = this._listeners[event] || [];
      for (let i = 0; i < fns.length; i++) fns[i](detail);
    }

    update(patch) {
      if (patch.data)    this._cfg.data    = patch.data;
      if (patch.options) {
        this._cfg.options = {};
        const src  = patch.options;
        const keys = Object.keys(src);
        for (let k = 0; k < keys.length; k++) {
          this._cfg.options[keys[k]] = src[keys[k]];
        }
      }
      this._render();
    }

    destroy() {
      if (this._ro)        { this._ro.disconnect(); this._ro = null; }
      if (this._animReq)   { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)       { this._svg.remove();       this._svg       = null; }
      if (this._legendEl)  { this._legendEl.remove();  this._legendEl  = null; }
      if (this._tooltipEl) { this._tooltipEl.remove(); this._tooltipEl = null; }
      this._el.classList.remove('mts-chart', 'mts-chart--' + this._type);
      this._listeners = {};
    }
  }

  // ── Utilidades compartidas (accesibles por archivos de tipo) ─────────────────
  MtsChart._utils = {
    svgEl:      _svgEl,
    niceScale:  _niceScale,
    defaultFmt: _defaultFmt,
    easeOut:    _easeOut,
    PALETTE:    _PALETTE,
  };

  global.MTS.Chart = MtsChart;

}(typeof window !== 'undefined' ? window : this));
