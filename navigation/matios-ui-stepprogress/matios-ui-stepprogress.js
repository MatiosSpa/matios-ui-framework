/* ============================================================
   MATIOS UI — matios-ui-stepprogress.js
   MTS.StepProgress — Progreso de pasos tipo checkout/wizard
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.StepProgress = class MtsStepProgress {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {Array}    options.steps      [{ id, label, description? }]
   * @param {number}   options.active     Índice activo — default: 0
   * @param {string}   options.variant    'default'|'compact'|'dots' — default: 'default'
   * @param {boolean}  options.clickable  Permite navegar clickeando — default: false
   * @param {function} options.onChange   (index, step) => {}
   */
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) return;
    // Step items: [{ id, label, description? }] / Ítems de pasos
    this.steps = options.steps || [];

    // Initially active step index / Índice del paso activo inicial
    this.active = options.active ?? 0;

    // Visual variant: 'default' | 'compact' | 'dots' / Variante visual
    this.variant = options.variant || 'default';

    // Allow clicking steps to navigate / Permitir navegar haciendo click en los pasos
    this.clickable = options.clickable ?? false;

    this._listeners = {};

    // Fires when active step changes: ({ index, step }) => {}
    // Se dispara al cambiar el paso activo
    if (options.onChange) this.on('change', options.onChange);
    this._build();
  }

  goTo(index) {
    if (index < 0 || index >= this.steps.length) return this;
    this.active = index;
    this._build();
    this._emit('change', { index, step: this.steps[index] });
    return this;
  }
  next() { return this.goTo(Math.min(this.active + 1, this.steps.length - 1)); }
  prev() { return this.goTo(Math.max(this.active - 1, 0)); }
  setStepStatus(index, status) {
    if (this.steps[index]) {
      this.steps[index]._status = status; // 'complete'|'error'|'pending'
      this._build();
    }
    return this;
  }
  getActive() { return { index: this.active, step: this.steps[this.active] }; }
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }

  _build() {
    this._el.innerHTML = '';
    this._el.className = `mts-stepprogress mts-stepprogress--${this.variant}`;

    const total = this.steps.length;

    this.steps.forEach((step, i) => {
      const isDone    = i < this.active;
      const isActive  = i === this.active;
      const isError   = step._status === 'error';

      /* Item */
      const item = document.createElement('div');
      item.className = `mts-stepprogress__item${isDone ? ' mts-stepprogress__item--done' : ''}${isActive ? ' mts-stepprogress__item--active' : ''}${isError ? ' mts-stepprogress__item--error' : ''}`;
      if (this.clickable && i <= this.active) {
        item.classList.add('mts-stepprogress__item--clickable');
        item.addEventListener('click', () => this.goTo(i));
      }

      /* Indicador */
      const indicator = document.createElement('div');
      indicator.className = 'mts-stepprogress__indicator';

      if (isError) {
        indicator.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
      } else if (isDone) {
        indicator.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;
      } else {
        const num = document.createElement('span');
        num.textContent = i + 1;
        indicator.appendChild(num);
      }

      item.appendChild(indicator);

      if (this.variant !== 'dots') {
        /* Texto */
        const text = document.createElement('div');
        text.className = 'mts-stepprogress__text';
        const label = document.createElement('div');
        label.className = 'mts-stepprogress__label';
        label.textContent = step.label;
        text.appendChild(label);
        if (step.description && this.variant === 'default') {
          const desc = document.createElement('div');
          desc.className = 'mts-stepprogress__desc';
          desc.textContent = step.description;
          text.appendChild(desc);
        }
        item.appendChild(text);
      }

      /* Línea de conexión (no en el último) */
      if (i < total - 1) {
        const line = document.createElement('div');
        line.className = `mts-stepprogress__line${isDone ? ' mts-stepprogress__line--done' : ''}`;
        item.appendChild(line);
      }

      this._el.appendChild(item);
    });

    /* Barra de progreso total */
    const pct = total > 1 ? (this.active / (total - 1)) * 100 : 0;
    const bar = document.createElement('div');
    bar.className = 'mts-stepprogress__bar';
    const fill = document.createElement('div');
    fill.className = 'mts-stepprogress__bar-fill';
    fill.style.width = pct + '%';
    bar.appendChild(fill);
    this._el.appendChild(bar);
  }
  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:stepprogress:${event}`, { bubbles: true, detail }));
  }
};
