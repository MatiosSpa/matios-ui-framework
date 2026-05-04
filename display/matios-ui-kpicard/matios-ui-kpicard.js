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
  var key;
  for (key in opts) {
    if (opts.hasOwnProperty(key)) this[key] = opts[key];
  }
  this._build();
  return this;
};

MTS.KPICard.prototype._build = function() {
  var self = this;
  this._syncClasses();
  this._el.innerHTML = '';

  var clickListeners = this._listeners['click'];
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

  var header = document.createElement('div');
  header.className = 'mts-kpicard__header';

  var label = document.createElement('span');
  label.className = 'mts-kpicard__label';
  label.textContent = this.label;
  header.appendChild(label);

  if (this.icon) {
    var ic = document.createElement('div');
    ic.className = 'mts-kpicard__icon';
    ic.innerHTML = (typeof MTS !== 'undefined' && MTS.Sanitize) ? MTS.Sanitize.html(this.icon) : this.icon;
    header.appendChild(ic);
  }
  this._el.appendChild(header);

  var valueWrap = document.createElement('div');
  valueWrap.className = 'mts-kpicard__value-wrap';

  var val = document.createElement('span');
  val.className = 'mts-kpicard__value';
  val.textContent = this.value;
  valueWrap.appendChild(val);

  if (this.unit) {
    var unit = document.createElement('span');
    unit.className = 'mts-kpicard__unit';
    unit.textContent = this.unit;
    valueWrap.appendChild(unit);
  }
  this._el.appendChild(valueWrap);

  if (this.trend !== null) {
    var trendEl = document.createElement('div');
    var up = this.trend >= 0;
    trendEl.className = 'mts-kpicard__trend mts-kpicard__trend--' + (up ? 'up' : 'down');

    var arrow = document.createElement('span');
    arrow.className = 'mts-kpicard__trend-arrow';
    arrow.textContent = up ? '↑' : '↓';

    var pct = document.createElement('span');
    pct.textContent = Math.abs(this.trend) + '%';

    trendEl.appendChild(arrow);
    trendEl.appendChild(pct);

    if (this.trendLabel) {
      var lbl = document.createElement('span');
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
  var i, cls;
  var toRemove = [];
  var classList = this._el.classList;
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

  var clickListeners = this._listeners['click'];
  if (clickListeners && clickListeners.length) {
    this._el.classList.add('mts-kpicard--clickable');
  }
};

MTS.KPICard.prototype._buildSparkline = function() {
  var data  = this.sparkline;
  var min   = Math.min.apply(null, data);
  var max   = Math.max.apply(null, data);
  var range = max - min || 1;
  var w = 100, h = 32;
  var pts = [];
  var i, x, y;
  for (i = 0; i < data.length; i++) {
    x = (i / (data.length - 1)) * w;
    y = h - ((data[i] - min) / range) * (h - 4) - 2;
    pts.push(x + ',' + y);
  }
  var points = pts.join(' ');

  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
  svg.setAttribute('class', 'mts-kpicard__sparkline');
  svg.setAttribute('preserveAspectRatio', 'none');

  var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  polyline.setAttribute('points', points);
  polyline.setAttribute('fill', 'none');
  polyline.setAttribute('stroke', 'currentColor');
  polyline.setAttribute('stroke-width', '1.5');
  polyline.setAttribute('stroke-linecap', 'round');
  polyline.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(polyline);

  var wrap = document.createElement('div');
  wrap.className = 'mts-kpicard__sparkline-wrap';
  wrap.appendChild(svg);
  return wrap;
};

MTS.KPICard.prototype._emit = function(event, detail) {
  var listeners = this._listeners[event] || [];
  var i;
  for (i = 0; i < listeners.length; i++) {
    listeners[i]({ type: event, detail: detail });
  }
  if (this._el) {
    this._el.dispatchEvent(new CustomEvent('mts:kpicard:' + event, { bubbles: true, detail: detail }));
  }
};
