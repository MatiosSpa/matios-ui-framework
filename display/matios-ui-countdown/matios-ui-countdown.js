/* ============================================================
   MATIOS UI — matios-ui-countdown.js
   MTS.Countdown — Contador regresivo animado
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.Countdown = class MtsCountdown {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {Date|string|number} options.target  Fecha/hora objetivo (Date, ISO string, o timestamp ms)
   * @param {string}   options.variant    'blocks'|'compact'|'minimal' — default: 'blocks'
   * @param {boolean}  options.showDays   — default: true
   * @param {boolean}  options.showHours  — default: true
   * @param {boolean}  options.showMins   — default: true
   * @param {boolean}  options.showSecs   — default: true
   * @param {string}   options.separator  Separador entre bloques — default: ':'
   * @param {object}   options.labels     { days, hours, mins, secs } — default: español
   * @param {function} options.onTick     ({ days, hours, mins, secs, total }) => {}
   * @param {function} options.onComplete Cuando llega a 0
   */
  constructor(selector, options = {}) {
    this._el      = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    // Target date: Date object, ISO string or timestamp ms / Fecha objetivo: Date, ISO string o timestamp ms
    const t = options.target;
    this._target = t instanceof Date ? t : new Date(t);

    // Visual variant: 'blocks' | 'compact' | 'minimal' / Variante visual
    this.variant = options.variant || 'blocks';

    // Show/hide each unit / Mostrar u ocultar cada unidad
    this.showDays  = options.showDays  ?? true;
    this.showHours = options.showHours ?? true;
    this.showMins  = options.showMins  ?? true;
    this.showSecs  = options.showSecs  ?? true;

    // Separator between blocks (compact/minimal) / Separador entre bloques
    this.separator = options.separator || ':';

    // Unit labels — defaults from i18n (MTS.Countdown), per-option override wins
    // Labels de cada unidad — defaults desde i18n; el override por opción manda
    this.labels = Object.assign({
      days:  this._t('days',  'días'),
      hours: this._t('hours', 'horas'),
      mins:  this._t('mins',  'min'),
      secs:  this._t('secs',  'seg'),
    }, options.labels || {});
    this._interval = null;
    this._prev     = {};
    this._listeners = {};

    // Fires every second with current values: ({ days, hours, mins, secs, total }) => {}
    // Se dispara cada segundo con los valores actuales
    if (options.onTick)     this.on('tick',     options.onTick);

    // Fires when countdown reaches zero / Se dispara cuando el contador llega a cero
    if (options.onComplete) this.on('complete', options.onComplete);

    this._build();
    this.start();
  }

  start() {
    if (this._interval) return this;
    this._tick();
    this._interval = setInterval(() => this._tick(), 1000);
    return this;
  }
  pause()   { clearInterval(this._interval); this._interval = null; return this; }
  resume()  { return this.start(); }
  destroy() { this.pause(); this._el.innerHTML = ''; }
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }

  _t(key, fallback) {
    let loc = (window.MTS && typeof MTS.getString === 'function') ? MTS.getString()['MTS.Countdown'] : null;
    return (loc && loc[key] != null) ? loc[key] : fallback;
  }

  _syncClasses() {
    const keep = Array.from(this._el.classList).filter(cls => !cls.startsWith('mts-countdown'));
    this._el.className = keep.join(' ');
    this._el.classList.add('mts-countdown', `mts-countdown--${this.variant}`);
  }

  setTarget(t) {
    this._target = t instanceof Date ? t : new Date(t);
    this._tick();
    return this;
  }

  _calc() {
    const diff = Math.max(0, this._target - Date.now());
    const total = Math.floor(diff / 1000);
    return {
      total,
      days:  Math.floor(total / 86400),
      hours: Math.floor((total % 86400) / 3600),
      mins:  Math.floor((total % 3600)  / 60),
      secs:  total % 60,
    };
  }

  _pad(n) { return String(n).padStart(2, '0'); }

  _build() {
    this._el.innerHTML = '';
    this._syncClasses();
    this._units = {};
    const units = [
      { key:'days',  show:this.showDays,  label:this.labels.days  },
      { key:'hours', show:this.showHours, label:this.labels.hours },
      { key:'mins',  show:this.showMins,  label:this.labels.mins  },
      { key:'secs',  show:this.showSecs,  label:this.labels.secs  },
    ].filter(u => u.show);

    units.forEach((unit, i) => {
      if (i > 0 && this.variant !== 'blocks') {
        const sep = document.createElement('span');
        sep.className = 'mts-countdown__sep';
        sep.textContent = this.separator;
        this._el.appendChild(sep);
      }

      const block = document.createElement('div');
      block.className = 'mts-countdown__block';

      const val = document.createElement('span');
      val.className = 'mts-countdown__value';
      val.textContent = '00';
      block.appendChild(val);

      if (this.variant !== 'minimal') {
        const lbl = document.createElement('span');
        lbl.className = 'mts-countdown__label';
        lbl.textContent = unit.label;
        block.appendChild(lbl);
      }

      this._el.appendChild(block);
      this._units[unit.key] = val;
    });
  }

  _tick() {
    const v = this._calc();
    const map = { days:v.days, hours:v.hours, mins:v.mins, secs:v.secs };

    Object.entries(map).forEach(([key, num]) => {
      if (!this._units[key]) return;
      const str = this._pad(num);
      if (str !== this._prev[key]) {
        this._units[key].textContent = str;
        /* Flash de cambio */
        this._units[key].parentElement.classList.remove('mts-countdown__block--flip');
        void this._units[key].parentElement.offsetWidth;
        this._units[key].parentElement.classList.add('mts-countdown__block--flip');
        this._prev[key] = str;
      }
    });

    this._emit('tick', v);
    this._el.dispatchEvent(new CustomEvent('mts:countdown:tick', { bubbles:true, detail:v }));

    if (v.total === 0) {
      this.pause();
      this._emit('complete', {});
      this._el.dispatchEvent(new CustomEvent('mts:countdown:complete', { bubbles:true }));
    }
  }
  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el?.dispatchEvent(new CustomEvent(`mts:countdown:${event}`, { bubbles: true, detail }));
  }
};
