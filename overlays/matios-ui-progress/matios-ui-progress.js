/* ============================================================
   MATIOS UI — matios-ui-progress.js  v1.0.0
   MTS.Progress — bar | circle | indeterminate
   ============================================================ */
window.MTS = window.MTS || {};

MTS.Progress = class MtsProgress {
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string'
      ? document.querySelector(selector) : selector;
    if (!this._el) { console.error('[MTS.Progress] No encontrado:', selector); return; }

    this.type        = options.type        || 'bar';
    this.value       = options.value       ?? 0;
    this.min         = options.min         ?? 0;
    this.max         = options.max         ?? 100;
    this.variant     = options.variant     || 'default';
    this.size        = options.size        || 'md';
    this.showLabel   = options.showLabel   ?? false;
    this.showValue   = options.showValue   ?? false;
    this.striped     = options.striped     ?? false;
    this.animated    = options.animated    ?? false;
    this.rounded     = options.rounded     ?? true;
    this.radius      = options.radius      || 40;
    this.strokeWidth = options.strokeWidth || 6;
    this.label       = options.label       || '';
    this.labelFormat = options.labelFormat || null;
    this._listeners  = {};
    this._indeterminate = (this.type === 'indeterminate');

    if (options.onChange)   this.on('change',   options.onChange);
    if (options.onComplete) this.on('complete',  options.onComplete);

    this._build();
  }

  /* ── API pública ── */
  setValue(v, animate = true) {
    this.value = Math.min(this.max, Math.max(this.min, Number(v)));
    this._update(animate);
    const pct = this._pct();
    this._emit('change', { value: this.value, pct });
    if (this.value >= this.max) this._emit('complete', { value: this.value });
    return this;
  }
  increment(n = 1) { return this.setValue(this.value + n); }
  decrement(n = 1) { return this.setValue(this.value - n); }
  reset()          { return this.setValue(this.min); }
  setVariant(v)    { this.variant = v; this._applyVariant(); return this; }
  setIndeterminate(b) {
    this._indeterminate = b;
    if (this._fillEl) {
      this._fillEl.classList.toggle('mts-progress__fill--indeterminate', b);
    }
    return this;
  }
  on(event, fn) { (this._listeners[event] = this._listeners[event] || []).push(fn); return this; }
  destroy()     { this._el.innerHTML = ''; }

  /* ── Build ── */
  _build() {
    this._el.innerHTML = '';
    this._el.className = `mts-progress-wrap mts-progress-wrap--${this.type}`;

    if (this.type === 'circle') {
      this._buildCircle();
    } else {
      this._buildBar();
    }
  }

  _buildBar() {
    /* Label superior */
    if (this.label || this.showLabel || this.showValue) {
      const hdr = document.createElement('div');
      hdr.className = 'mts-progress__header';
      if (this.label) {
        const lbl = document.createElement('span');
        lbl.className = 'mts-progress__label';
        lbl.textContent = this.label;
        hdr.appendChild(lbl);
      }
      if (this.showLabel || this.showValue) {
        this._labelEl = document.createElement('span');
        this._labelEl.className = 'mts-progress__pct';
        hdr.appendChild(this._labelEl);
      }
      this._el.appendChild(hdr);
    }

    /* Track */
    const track = document.createElement('div');
    track.className = [
      'mts-progress__track',
      `mts-progress__track--${this.size}`,
      this.rounded ? 'mts-progress__track--rounded' : '',
    ].filter(Boolean).join(' ');

    /* Fill */
    this._fillEl = document.createElement('div');
    this._fillEl.className = [
      'mts-progress__fill',
      `mts-progress__fill--${this.variant}`,
      this.striped  ? 'mts-progress__fill--striped'  : '',
      this.animated ? 'mts-progress__fill--animated'  : '',
      this._indeterminate ? 'mts-progress__fill--indeterminate' : '',
      this.rounded  ? 'mts-progress__fill--rounded'  : '',
    ].filter(Boolean).join(' ');

    track.appendChild(this._fillEl);
    this._el.appendChild(track);
    this._update(false);
  }

  _buildCircle() {
    const r   = this.radius;
    const sw  = this.strokeWidth;
    const size = (r + sw) * 2;
    const circ = 2 * Math.PI * r;

    const wrap = document.createElement('div');
    wrap.className = 'mts-progress__circle-wrap';
    wrap.style.cssText = `position:relative;display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;`;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width',  size);
    svg.setAttribute('height', size);
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.style.transform = 'rotate(-90deg)';

    /* Track circle */
    const trackC = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    trackC.setAttribute('cx', r + sw);
    trackC.setAttribute('cy', r + sw);
    trackC.setAttribute('r',  r);
    trackC.setAttribute('fill', 'none');
    trackC.setAttribute('stroke-width', sw);
    trackC.setAttribute('class', 'mts-progress__circle-track');

    /* Fill circle */
    this._circleEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this._circleEl.setAttribute('cx', r + sw);
    this._circleEl.setAttribute('cy', r + sw);
    this._circleEl.setAttribute('r',  r);
    this._circleEl.setAttribute('fill', 'none');
    this._circleEl.setAttribute('stroke-width', sw);
    this._circleEl.setAttribute('stroke-linecap', 'round');
    this._circleEl.setAttribute('stroke-dasharray', circ);
    this._circleEl.setAttribute('class', `mts-progress__circle-fill mts-progress__circle-fill--${this.variant}`);
    this._circleCircumference = circ;

    svg.appendChild(trackC);
    svg.appendChild(this._circleEl);
    wrap.appendChild(svg);

    /* Label central */
    if (this.showLabel || this.showValue || this.label) {
      this._centerLabelEl = document.createElement('div');
      this._centerLabelEl.className = 'mts-progress__circle-label';
      this._centerLabelEl.style.cssText = 'position:absolute;display:flex;flex-direction:column;align-items:center;justify-content:center;';
      wrap.appendChild(this._centerLabelEl);
    }

    /* Label debajo */
    if (this.label) {
      const lbl = document.createElement('div');
      lbl.className = 'mts-progress__circle-name';
      lbl.textContent = this.label;
      lbl.style.cssText = 'font-size:11px;color:var(--mts-text-muted);margin-top:4px;text-align:center;';
      this._el.style.cssText = 'display:inline-flex;flex-direction:column;align-items:center;';
      this._el.appendChild(wrap);
      this._el.appendChild(lbl);
    } else {
      this._el.appendChild(wrap);
    }

    this._update(false);
  }

  _update(animate = true) {
    const pct = this._pct();
    const labelText = this._labelText(pct);

    if (this.type === 'circle') {
      if (this._circleEl) {
        const offset = this._circleCircumference * (1 - pct / 100);
        this._circleEl.style.transition = animate ? 'stroke-dashoffset .5s ease' : 'none';
        this._circleEl.setAttribute('stroke-dashoffset', offset);
      }
      if (this._centerLabelEl) {
        this._centerLabelEl.innerHTML = `<span style="font-size:${this.radius > 35 ? 18 : 14}px;font-weight:800;color:var(--mts-text-primary)">${labelText}</span>`;
      }
    } else {
      if (this._fillEl) {
        this._fillEl.style.transition = animate ? 'width .4s cubic-bezier(.4,0,.2,1)' : 'none';
        this._fillEl.style.width = `${pct}%`;
        this._applyVariant();
      }
      if (this._labelEl) this._labelEl.textContent = labelText;
    }
  }

  _applyVariant() {
    if (!this._fillEl) return;
    // Limpiar variantes anteriores
    this._fillEl.className = this._fillEl.className.replace(/mts-progress__fill--\w+/g, '').trim();
    this._fillEl.className += ` mts-progress__fill mts-progress__fill--${this.variant}`;
    if (this.striped)  this._fillEl.className += ' mts-progress__fill--striped';
    if (this.animated) this._fillEl.className += ' mts-progress__fill--animated';
    if (this._indeterminate) this._fillEl.className += ' mts-progress__fill--indeterminate';
    if (this.rounded)  this._fillEl.className += ' mts-progress__fill--rounded';
  }

  _pct() {
    return Math.round(((this.value - this.min) / (this.max - this.min)) * 100);
  }

  _labelText(pct) {
    if (this.labelFormat) return this.labelFormat(this.value, this.max, pct);
    if (this.showValue) return `${this.value} / ${this.max}`;
    return `${pct}%`;
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:progress:${event}`, { bubbles: true, detail }));
  }
};
