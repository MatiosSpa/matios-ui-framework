/* ============================================================
   MATIOS UI — matios-ui-kpicard.js
   MTS.KPICard — Tarjeta de métrica con tendencia y sparkline
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.KPICard = class MtsKPICard {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {string}   options.label       Etiqueta de la métrica
   * @param {string|number} options.value  Valor principal
   * @param {string}   options.unit        Unidad (%, $, km, etc.)
   * @param {number}   options.trend       % de cambio (positivo/negativo)
   * @param {string}   options.trendLabel  Texto junto a la tendencia
   * @param {Array}    options.sparkline   Datos para mini gráfico [n, n, n...]
   * @param {string}   options.variant     'default'|'primary'|'success'|'warning'|'danger'
   * @param {string}   options.icon        SVG string del ícono
   * @param {function} options.onClick
   */
  constructor(selector, options = {}) {
    this._el     = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    // Metric label / Etiqueta de la métrica
    this.label = options.label || '';

    // Main value / Valor principal
    this.value = options.value ?? 0;

    // Unit suffix: %, $, km, etc. / Sufijo de unidad
    this.unit = options.unit || '';

    // Trend percentage (positive = up, negative = down) / Porcentaje de tendencia
    this.trend = options.trend ?? null;

    // Label next to the trend / Texto junto a la tendencia
    this.trendLabel = options.trendLabel || '';

    // Sparkline data array / Array de datos para el mini gráfico
    this.sparkline = options.sparkline || [];

    // Color variant: 'default' | 'primary' | 'success' | 'warning' | 'danger'
    // Variante de color
    this.variant = options.variant || 'default';

    // SVG icon string / String SVG del ícono
    this.icon = options.icon || null;

    this._listeners = {};

    // Fires when KPI card is clicked / Se dispara al hacer click en la KPI card
    if (options.onClick) this.on('click', options.onClick);

    this._build();
  }

  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }

  update(opts = {}) {
    Object.assign(this, opts);
    this._build();
    return this;
  }

  _build() {
    this._el.className = `mts-kpicard mts-kpicard--${this.variant}${this._listeners['click']?.length ? ' mts-kpicard--clickable' : ''}`;
    this._el.innerHTML = '';
    if (this._listeners['click']?.length) { this._el.style.cursor = 'pointer'; this._el.addEventListener('click', () => this._emit('click', { kpi: this })); }

    const header = document.createElement('div');
    header.className = 'mts-kpicard__header';

    const label = document.createElement('span');
    label.className = 'mts-kpicard__label';
    label.textContent = this.label;
    header.appendChild(label);

    if (this.icon) {
      const ic = document.createElement('div');
      ic.className = 'mts-kpicard__icon';
      ic.innerHTML = this.icon;
      header.appendChild(ic);
    }
    this._el.appendChild(header);

    const valueWrap = document.createElement('div');
    valueWrap.className = 'mts-kpicard__value-wrap';

    const val = document.createElement('span');
    val.className = 'mts-kpicard__value';
    val.textContent = this.value;
    valueWrap.appendChild(val);

    if (this.unit) {
      const unit = document.createElement('span');
      unit.className = 'mts-kpicard__unit';
      unit.textContent = this.unit;
      valueWrap.appendChild(unit);
    }
    this._el.appendChild(valueWrap);

    if (this.trend !== null) {
      const trendEl = document.createElement('div');
      const up = this.trend >= 0;
      trendEl.className = `mts-kpicard__trend mts-kpicard__trend--${up ? 'up' : 'down'}`;
      trendEl.innerHTML = `<span class="mts-kpicard__trend-arrow">${up ? '↑' : '↓'}</span><span>${Math.abs(this.trend)}%</span>${this.trendLabel ? `<span class="mts-kpicard__trend-label">${this.trendLabel}</span>` : ''}`;
      this._el.appendChild(trendEl);
    }

    if (this.sparkline.length > 1) {
      this._el.appendChild(this._buildSparkline());
    }
  }

  _buildSparkline() {
    const data   = this.sparkline;
    const min    = Math.min(...data);
    const max    = Math.max(...data);
    const range  = max - min || 1;
    const w = 100, h = 32;
    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    }).join(' ');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('class', 'mts-kpicard__sparkline');
    svg.setAttribute('preserveAspectRatio', 'none');

    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', points);
    polyline.setAttribute('fill', 'none');
    polyline.setAttribute('stroke', 'currentColor');
    polyline.setAttribute('stroke-width', '1.5');
    polyline.setAttribute('stroke-linecap', 'round');
    polyline.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(polyline);

    const wrap = document.createElement('div');
    wrap.className = 'mts-kpicard__sparkline-wrap';
    wrap.appendChild(svg);
    return wrap;
  }
  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el?.dispatchEvent(new CustomEvent(`mts:kpicard:${event}`, { bubbles: true, detail }));
  }
};
