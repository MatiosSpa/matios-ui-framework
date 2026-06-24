/* ============================================================
   MATIOS UI — matios-ui-slider.js
   MTS.Slider
   Version: 3.1.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Slider = class MtsSlider {
  constructor(selector, options = {}) {
    // Target container element / Elemento contenedor
    this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;

    // Minimum value / Valor mínimo
    this.min = options.min ?? 0;

    // Maximum value / Valor máximo
    this.max = options.max ?? 100;

    // Step increment / Incremento de paso
    this.step = options.step ?? 1;

    // Enable dual-thumb range mode / Activar modo rango de dos thumbs
    this.range = options.range ?? false;

    // Label text shown above the slider / Texto de label sobre el slider
    this.label = options.label || '';

    // Show current value next to label / Mostrar valor actual junto al label
    this.showValue = options.showValue ?? true;

    // Custom value formatter: (value) => string / Formateador personalizado de valor
    this.labelFormat = options.labelFormat || null;

    this._listeners = {};

    // Internal values / Valores internos
    if (this.range) {
      var val  = options.value;
      this._v1 = Array.isArray(val) ? val[0] : this.min;
      this._v2 = Array.isArray(val) ? val[1] : this.max;
    } else {
      this._v1 = options.value ?? this.min;
    }

    // Fires when value changes / Se dispara al cambiar el valor
    if (options.onChange) this.on('change', options.onChange);

    // Form-field contract (a slider always holds a value → required is a no-op,
    // but the API is kept uniform with the rest of the form fields)
    this.required     = options.required     ?? false;
    this.errorMessage = options.errorMessage ?? null;
    this._error       = '';

    this._build();
    this._el._mtsInstance = this;
  }

  // Returns current value — number for simple, [min, max] for range
  // Retorna el valor actual — número para simple, [min, max] para rango
  getValue() { return this.range ? [this._v1, this._v2] : this._v1; }

  /* ── Form-field validation contract — a slider always has a value, so validate() is always true ── */
  setError(msg) {
    this._error = msg || '';
    if (!this._errEl || !this._errEl.isConnected) {
      this._errEl = document.createElement('span');
      this._errEl.className = 'mts-form-error';
      this._el.appendChild(this._errEl);
    }
    this._errEl.textContent = this._error;
    this._errEl.style.display = this._error ? '' : 'none';
    return this;
  }
  clearError() { return this.setError(''); }
  validate() {
    this.clearError();
    this._emit('validate', { valid: true, errors: [] });
    return true;
  }
  _t(key, fallback) {
    try { const ns = (window.MTS && MTS.getLocale) ? MTS.getLocale()['MTS.Slider'] : null; const m = ns && ns.messages; if (m && m[key] != null) return m[key]; } catch (e) {}
    return fallback;
  }

  // Sets value programmatically / Establece el valor programáticamente
  setValue(v) {
    if (this.range && Array.isArray(v)) {
      this._v1 = this._clamp(v[0]);
      this._v2 = this._clamp(v[1]);
    } else {
      this._v1 = this._clamp(v);
    }
    this._render();
    return this;
  }

  // Registers an event listener / Registra un listener de evento
  on(e, cb) {
    if (!this._listeners[e]) this._listeners[e] = [];
    this._listeners[e].push(cb);
    return this;
  }

  _syncClasses() {
    const keep = Array.from(this._el.classList).filter(cls => !cls.startsWith('mts-slider-wrap'));
    this._el.className = keep.join(' ');
    this._el.classList.add('mts-slider-wrap');
  }

  _clamp(v) { return Math.min(this.max, Math.max(this.min, Number(v))); }

  _snap(v) {
    // Snap to nearest step / Redondear al step más cercano
    var snapped = Math.round((v - this.min) / this.step) * this.step + this.min;
    return Math.min(this.max, Math.max(this.min, snapped));
  }

  _pct(v) { return ((v - this.min) / (this.max - this.min)) * 100; }

  _build() {
    this._syncClasses();
    this._el.innerHTML = '';

    // Header: label + value display / Cabecera: label + display del valor
    if (this.label || this.showValue) {
      this._header = document.createElement('div');
      this._header.className = 'mts-slider__header';
      if (this.label) {
        var lbl = document.createElement('span');
        lbl.className   = 'mts-label' + (this.required ? ' mts-label--required' : '');
        lbl.textContent = this.label;
        this._header.appendChild(lbl);
      }
      if (this.showValue) {
        this._valueDisplay = document.createElement('span');
        this._valueDisplay.className = 'mts-slider__value';
        this._header.appendChild(this._valueDisplay);
      }
      this._el.appendChild(this._header);
    }

    // Track container / Contenedor del track
    this._track = document.createElement('div');
    this._track.className = 'mts-slider__track';

    // Rail (gray background) / Rail (fondo gris)
    this._rail = document.createElement('div');
    this._rail.className = 'mts-slider__rail';
    this._track.appendChild(this._rail);

    // Fill (active range color) / Fill (color del rango activo)
    this._fill = document.createElement('div');
    this._fill.className = 'mts-slider__fill';
    this._track.appendChild(this._fill);

    // Thumb 1 (single or range minimum) / Thumb 1 (simple o mínimo del rango)
    this._thumb1 = document.createElement('div');
    this._thumb1.className = 'mts-slider__thumb';
    this._track.appendChild(this._thumb1);
    this._bindThumb(this._thumb1, 1);

    // Thumb 2 (range maximum only) / Thumb 2 (solo máximo del rango)
    if (this.range) {
      this._thumb2 = document.createElement('div');
      this._thumb2.className = 'mts-slider__thumb';
      this._track.appendChild(this._thumb2);
      this._bindThumb(this._thumb2, 2);
    }

    this._el.appendChild(this._track);
    this._render();
  }

  _bindThumb(thumb, which) {
    var self     = this;
    var dragging = false;

    thumb.addEventListener('mousedown', startDrag);
    thumb.addEventListener('touchstart', startDrag, { passive: false });

    function startDrag(e) {
      e.preventDefault();
      dragging = true;
      thumb.classList.add('mts-slider__thumb--active');
      if (self.range) {
        self._thumb1.style.zIndex = which === 1 ? '4' : '3';
        self._thumb2.style.zIndex = which === 2 ? '4' : '3';
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('mouseup',   stopDrag);
      document.addEventListener('touchend',  stopDrag);
    }

    function onMove(e) {
      if (!dragging) return;
      e.preventDefault();
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var rect    = self._track.getBoundingClientRect();
      var pct     = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      var val     = self._snap(self.min + pct * (self.max - self.min));

      if (which === 1) {
        // Thumb 1 cannot exceed thumb 2 / Thumb 1 no puede superar al thumb 2
        if (self.range) val = Math.min(val, self._v2);
        self._v1 = val;
      } else {
        // Thumb 2 cannot go below thumb 1 / Thumb 2 no puede ir por debajo del thumb 1
        val = Math.max(val, self._v1);
        self._v2 = val;
      }

      self._render();
      self._emit('change', { value: self.getValue() });
    }

    function stopDrag() {
      dragging = false;
      thumb.classList.remove('mts-slider__thumb--active');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('mouseup',   stopDrag);
      document.removeEventListener('touchend',  stopDrag);
    }
  }

  _render() {
    var pct1 = this._pct(this._v1);
    if (this.range) {
      var pct2 = this._pct(this._v2);
      this._fill.style.left    = pct1 + '%';
      this._fill.style.width   = (pct2 - pct1) + '%';
      this._thumb1.style.left  = pct1 + '%';
      this._thumb2.style.left  = pct2 + '%';
      if (this._valueDisplay) {
        this._valueDisplay.textContent = this.labelFormat
          ? this.labelFormat([this._v1, this._v2])
          : this._v1 + ' – ' + this._v2;
      }
    } else {
      this._fill.style.left   = '0%';
      this._fill.style.width  = pct1 + '%';
      this._thumb1.style.left = pct1 + '%';
      if (this._valueDisplay) {
        this._valueDisplay.textContent = this.labelFormat
          ? this.labelFormat(this._v1)
          : this._v1;
      }
    }
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent('mts:slider:' + event, { bubbles: true, detail }));
  }
};
