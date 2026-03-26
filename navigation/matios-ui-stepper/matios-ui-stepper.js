/* ============================================================
   MATIOS UI — matios-ui-stepper.js
   MTS.Stepper — Flujo paso a paso
   Eventos DOM: mts:stepper:change | mts:stepper:complete
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Stepper = class MtsStepper {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {Array}    options.steps      [{ id, label, description?, icon?, status? }]
   *                   status: 'pending'|'active'|'complete'|'error'
   * @param {number}   options.active     Índice del paso activo — default: 0
   * @param {string}   options.direction  'horizontal'|'vertical' — default: 'horizontal'
   * @param {boolean}  options.clickable  Permite navegar clickeando
   * @param {function} options.onChange
   * @param {function} options.onComplete
   */
  constructor(selector, options = {}) {
    this._el       = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    this.steps     = options.steps     || [];
    this.active    = options.active    ?? 0;
    this.direction = options.direction || 'horizontal';
    this.clickable = options.clickable ?? false;
    this._listeners = {};
    if (options.onChange)   this.on('change',   options.onChange);
    if (options.onComplete) this.on('complete', options.onComplete);
    this._build();
  }

  next()          { if (this.active < this.steps.length - 1) { this.setStep(this.active + 1); } else { this._emit('complete', {}); } return this; }
  prev()          { if (this.active > 0) this.setStep(this.active - 1); return this; }
  setStep(idx)    { this.active = Math.max(0, Math.min(this.steps.length - 1, idx)); this._render(); this._emit('change', { index: this.active, step: this.steps[this.active] }); return this; }
  setStatus(idx, status) { if (this.steps[idx]) { this.steps[idx].status = status; this._render(); } return this; }
  isFirst()       { return this.active === 0; }
  isLast()        { return this.active === this.steps.length - 1; }
  on(e, cb)       { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  destroy()       { this._el.innerHTML = ''; }

  _build() {
    this._el.className = `mts-stepper mts-stepper--${this.direction}`;
    this._render();
  }

  _render() {
    this._el.innerHTML = '';
    this.steps.forEach((step, idx) => {
      const status = idx < this.active ? 'complete' : idx === this.active ? 'active' : (step.status || 'pending');
      const item = document.createElement('div');
      item.className = `mts-stepper__step mts-stepper__step--${status}`;
      if (this.clickable && idx !== this.active) {
        item.classList.add('mts-stepper__step--clickable');
        item.addEventListener('click', () => this.setStep(idx));
      }

      // Indicador
      const indicator = document.createElement('div');
      indicator.className = 'mts-stepper__indicator';
      if (status === 'complete') {
        indicator.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
      } else if (status === 'error') {
        indicator.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3v4M7 9.5h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
      } else if (step.icon) {
        indicator.innerHTML = step.icon;
      } else {
        indicator.textContent = idx + 1;
      }

      // Contenido
      const content = document.createElement('div');
      content.className = 'mts-stepper__content';
      const label = document.createElement('span');
      label.className = 'mts-stepper__label';
      label.textContent = step.label;
      content.appendChild(label);
      if (step.description) {
        const desc = document.createElement('span');
        desc.className = 'mts-stepper__description';
        desc.textContent = step.description;
        content.appendChild(desc);
      }

      // Línea conectora
      const line = document.createElement('div');
      line.className = 'mts-stepper__line';

      item.appendChild(indicator);
      item.appendChild(content);
      if (idx < this.steps.length - 1) item.appendChild(line);
      this._el.appendChild(item);
    });
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:stepper:${event}`, { bubbles: true, detail }));
  }
};
