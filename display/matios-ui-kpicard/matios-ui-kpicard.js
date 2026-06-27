/* ============================================================
   MATIOS UI — matios-ui-kpicard.js
   MTS.KPICard — Tarjeta de métrica con tendencia y sparkline
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.KPICard = function MtsKPICard(selector, options) {
  options = options || {};

  this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!this._el) return;

  // Metric label / Etiqueta de la métrica
  this.label = options.label || '';

  // Main value / Valor principal
  this.value = (options.value !== undefined && options.value !== null) ? options.value : 0;

  // Unit suffix: %, $, km, etc. / Sufijo de unidad
  this.unit = options.unit || '';

  // Trend percentage (positive = up, negative = down) / Porcentaje de tendencia
  this.trend = (options.trend !== undefined && options.trend !== null) ? options.trend : null;

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
  this._handleClick = null;

  // Fires when KPI card is clicked / Se dispara al hacer click en la KPI card
  if (options.onClick) this.on('click', options.onClick);

  this._build();
};

MTS.KPICard.prototype.on = function(e, cb) {
  if (!this._listeners[e]) this._listeners[e] = [];
  this._listeners[e].push(cb);
  return this;
};

MTS.KPICard.prototype.off = function(e, cb) {
  this._listeners[e] = (this._listeners[e] || []).filter(function(f) { return f !== cb; });
  return this;
};

MTS.KPICard.prototype.update = function(opts) {
  opts = opts || {};
  let key;
  for (key in opts) {
    if (opts.hasOwnProperty(key)) this[key] = opts[key];
  }
  this._build();
  return this;
};

MTS.KPICard.prototype._build = function() {
  let self = this;
  this._syncClasses();
  this._el.innerHTML = '';

  let clickListeners = this._listeners['click'];
  if (clickListeners && clickListeners.length) {
    this._el.style.cursor = 'pointer';
    if (!this._handleClick) {
      this._handleClick = function() { self._emit('click', { kpi: self }); };
    }
    this._el.removeEventListener('click', this._handleClick);
    this._el.addEventListener('click', this._handleClick);
  } else {
    this._el.style.cursor = '';
    if (this._handleClick) this._el.removeEventListener('click', this._handleClick);
  }

  let header = document.createElement('div');
  header.className = 'mts-kpicard__header';

  let label = document.createElement('span');
  label.className = 'mts-kpicard__label';
  label.textContent = this.label;
  header.appendChild(label);

  if (this.icon) {
    let ic = document.createElement('div');
    ic.className = 'mts-kpicard__icon';
    ic.innerHTML = (typeof MTS !== 'undefined' && MTS.Sanitize) ? MTS.Sanitize.html(this.icon) : this.icon;
    header.appendChild(ic);
  }
  this._el.appendChild(header);

  let valueWrap = document.createElement('div');
  valueWrap.className = 'mts-kpicard__value-wrap';

  let val = document.createElement('span');
  val.className = 'mts-kpicard__value';
  val.textContent = this.value;
  valueWrap.appendChild(val);

  if (this.unit) {
    let unit = document.createElement('span');
    unit.className = 'mts-kpicard__unit';
    unit.textContent = this.unit;
    valueWrap.appendChild(unit);
  }
  this._el.appendChild(valueWrap);

  if (this.trend !== null) {
    let trendEl = document.createElement('div');
    let up = this.trend >= 0;
    trendEl.className = 'mts-kpicard__trend mts-kpicard__trend--' + (up ? 'up' : 'down');

    let arrow = document.createElement('span');
    arrow.className = 'mts-kpicard__trend-arrow';
    arrow.textContent = up ? '↑' : '↓';

    let pct = document.createElement('span');
    pct.textContent = Math.abs(this.trend) + '%';

    trendEl.appendChild(arrow);
    trendEl.appendChild(pct);

    if (this.trendLabel) {
      let lbl = document.createElement('span');
      lbl.className = 'mts-kpicard__trend-label';
      lbl.textContent = this.trendLabel;
      trendEl.appendChild(lbl);
    }
    this._el.appendChild(trendEl);
  }

  if (this.sparkline.length > 1) {
    this._el.appendChild(this._buildSparkline());
  }
};

MTS.KPICard.prototype._syncClasses = function() {
  let i, cls;
  let toRemove = [];
  let classList = this._el.classList;
  for (i = 0; i < classList.length; i++) {
    cls = classList[i];
    if (cls === 'mts-kpicard' || cls.indexOf('mts-kpicard--') === 0) {
      toRemove.push(cls);
    }
  }
  for (i = 0; i < toRemove.length; i++) {
    this._el.classList.remove(toRemove[i]);
  }

  this._el.classList.add('mts-kpicard');
  this._el.classList.add('mts-kpicard--' + this.variant);

  let clickListeners = this._listeners['click'];
  if (clickListeners && clickListeners.length) {
    this._el.classList.add('mts-kpicard--clickable');
  }
};

MTS.KPICard.prototype._buildSparkline = function() {
  let data  = this.sparkline;
  let min   = Math.min.apply(null, data);
  let max   = Math.max.apply(null, data);
  let range = max - min || 1;
  let w = 100, h = 32;
  let pts = [];
  let i, x, y;
  for (i = 0; i < data.length; i++) {
    x = (i / (data.length - 1)) * w;
    y = h - ((data[i] - min) / range) * (h - 4) - 2;
    pts.push(x + ',' + y);
  }
  let points = pts.join(' ');

  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
  svg.setAttribute('class', 'mts-kpicard__sparkline');
  svg.setAttribute('preserveAspectRatio', 'none');

  let polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  polyline.setAttribute('points', points);
  polyline.setAttribute('fill', 'none');
  polyline.setAttribute('stroke', 'currentColor');
  polyline.setAttribute('stroke-width', '1.5');
  polyline.setAttribute('stroke-linecap', 'round');
  polyline.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(polyline);

  let wrap = document.createElement('div');
  wrap.className = 'mts-kpicard__sparkline-wrap';
  wrap.appendChild(svg);
  return wrap;
};

MTS.KPICard.prototype._emit = function(event, detail) {
  let listeners = this._listeners[event] || [];
  let i;
  for (i = 0; i < listeners.length; i++) {
    listeners[i]({ type: event, detail: detail });
  }
  if (this._el) {
    this._el.dispatchEvent(new CustomEvent('mts:kpicard:' + event, { bubbles: true, detail: detail }));
  }
};
