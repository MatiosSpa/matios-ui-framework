/* ============================================================
   MATIOS UI — matios-ui-colorpicker.js
   MTS.ColorPicker — Selector de color standalone
                     Hex, RGB, HSL — sliders H/S/L — paleta
   0 dependencias.
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.ColorPicker = class MtsColorPicker {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {string}   options.value       Color inicial (hex) — default: '#4f8eff'
   * @param {string}   options.label       Etiqueta
   * @param {string}   options.format      'hex'|'rgb'|'hsl' — default: 'hex'
   * @param {Array}    options.presets     Colores de la paleta (máx. 20) — default: 20 colores
   * @param {boolean}  options.showPresets Muestra paleta — default: true
   * @param {boolean}  options.showSliders Muestra sliders HSL — default: true
   * @param {boolean}  options.showInput         Muestra input de texto — default: true
   * @param {boolean}  options.showFormatSwitch  Muestra botón para cambiar hex/rgb/hsl — default: true
   * @param {boolean}  options.showTriggerText   Muestra el valor hex/rgb/hsl en el trigger — default: true
   * @param {string}   options.triggerVariant    'default'|'preview' — default: 'default'
   * @param {string}   options.previewText       Texto del chip en triggerVariant:'preview' — default: 'Vista previa'
   * @param {boolean}  options.inline      Siempre visible (sin trigger) — default: false
   * @param {string}   options.size        'sm'|'md'|'lg' — default: 'md'
   * @param {boolean}  options.disabled
   * @param {function} options.onChange    ({ hex, value, formatted }) => {}
   * @param {function} options.onOpen
   * @param {function} options.onClose
   */
  constructor(selector, options = {}) {
    this._el      = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    /* â”€â”€ data-* â†’ inicialización HTML declarativa â”€â”€ */
    const _ds = this._el?.dataset || {};
    const _fromHTML = {};
    if (_ds.value !== undefined) _fromHTML.value = _ds.value;
    if (_ds.label !== undefined) _fromHTML.label = _ds.label;
    if (_ds.format !== undefined) _fromHTML.format = _ds.format;
    if (_ds.inline !== undefined) _fromHTML.inline = true;
    if (_ds.disabled !== undefined) _fromHTML.disabled = true;
    if (_ds.size !== undefined) _fromHTML.size = _ds.size;
    if (_ds.required !== undefined) _fromHTML.required = true;
    if (_ds.errorMessage !== undefined) _fromHTML.errorMessage = _ds.errorMessage;
    options = { ..._fromHTML, ...options };

    // Initial color value (hex) / Valor de color inicial (hex). Explicit null = empty (for required).
    this._hex = (options.value === null) ? null : (this._toHex(options.value) || '#4f8eff');

    // Form-field contract
    this.required     = options.required     ?? false;
    this.errorMessage = options.errorMessage ?? null;
    this._error       = '';

    // Field label / Etiqueta del campo
    this.label = options.label || '';

    // Output format: 'hex' | 'rgb' | 'hsl' / Formato de salida
    this.format = options.format || 'hex';

    // Preset color palette / Paleta de colores preset
    // Max 20 colors (4 rows × 5 cols). Excess colors are silently trimmed.
    // Default: 20 colors — 5 families × 4 tones (navy→sky, petrol→mint, crimson, amber, violet)
    const _rawPresets = options.presets || [
      '#0a1628','#0d2b6b','#1d4ed8','#3b82f6',
      '#0c2a35','#115e59','#0f766e','#10b981',
      '#3b0000','#7f0000','#cc0000','#e53935',
      '#451a00','#92400e','#f59e0b','#ffb737',
      '#2e1065','#4c1d95','#7c3aed','#a78bfa',
    ];
    this.presets = _rawPresets.slice(0, 20);

    // Show preset palette / Mostrar paleta de presets
    this.showPresets = options.showPresets ?? true;

    // Show HSL sliders / Mostrar sliders HSL
    this.showSliders = options.showSliders ?? true;

    // Show hex input / Mostrar input hex
    this.showInput = options.showInput ?? true;

    // Show format switch button (hex/rgb/hsl) / Mostrar botón de formato
    this.showFormatSwitch = options.showFormatSwitch ?? true;

    // Show hex/rgb/hsl text in trigger / Muestra el valor en el trigger
    this.showTriggerText = options.showTriggerText ?? true;

    // Trigger variant: 'default' | 'preview'
    this.triggerVariant = options.triggerVariant || 'default';

    // Text shown inside the preview chip (triggerVariant:'preview')
    this.previewText = options.previewText || 'Vista previa';

    // Always visible, no trigger button / Siempre visible, sin botón trigger
    this.inline = options.inline ?? false;

    // Size: 'sm' | 'md' | 'lg' / Tamaño
    this.size = options.size || 'md';

    // Render mode: 'auto' | 'field-only' | 'standalone'
    // Modo de render: 'auto' | 'field-only' | 'standalone'
    this.renderMode = options.renderMode || 'auto';

    // Disables interaction / Deshabilita la interacción
    this.disabled = options.disabled ?? false;

    // Fires when color changes / Se dispara al cambiar el color
    this._listeners = {};

    // Fires when color changes: ({ hex, value, formatted }) => {}
    // Se dispara al cambiar el color
    if (options.onChange) this.on('change', options.onChange);

    // Fires when popup opens / Se dispara al abrir el popup
    // Fires when picker opens / Se dispara al abrir el picker
    if (options.onOpen)  this.on('open',  options.onOpen);

    // Fires when picker closes / Se dispara al cerrar el picker
    if (options.onClose) this.on('close', options.onClose);

    // Auto-clear a standing validation error whenever the color changes
    var self = this;
    this.on('change', function () { if (self._error) self.clearError(); });

    this._open       = false;
    this._popEl      = null;
    this._build();
  }

  /* â”€â”€ API â”€â”€ */
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }
  getValue()       { return this._formatOutput(); }
  getHex()         { return this._hex; }
  setValue(color)  { this._hex = (color == null || color === '') ? null : (this._toHex(color) || color); this._updateTrigger(); if (this._open) this._renderPop(); return this; }

  // ── Form-field validation contract ──
  setError(msg) {
    this._error = msg || '';
    if (!this._errEl || !this._errEl.isConnected) {
      this._errEl = document.createElement('span');
      this._errEl.className = 'mts-form-error';
      this._el.appendChild(this._errEl);
    }
    this._errEl.textContent = this._error;
    this._errEl.style.display = this._error ? '' : 'none';
    if (this._triggerWrap) this._triggerWrap.classList.toggle('mts-colorpicker__trigger-wrap--error', !!this._error);
    return this;
  }
  clearError() { return this.setError(''); }
  validate() {
    const ok = !this.required || this._hex != null;
    if (ok) this.clearError(); else this.setError(this.errorMessage || this._t('required', 'This field is required'));
    this._emit('validate', { valid: ok, errors: ok ? [] : [this._error] });
    return ok;
  }
  _t(key, fallback) {
    try { const ns = (window.MTS && MTS.getLocale) ? MTS.getLocale()['MTS.ColorPicker'] : null; const m = ns && ns.messages; if (m && m[key] != null) return m[key]; } catch (e) {}
    return fallback;
  }
  setFormat(f)     { this.format = f; this._updateTrigger(); return this; }
  open()           { this._openPop(); return this; }
  close()          { this._closePop(); return this; }
  disable()        { this.disabled = true;  this._build(); return this; }
  enable()         { this.disabled = false; this._build(); return this; }
  destroy()        { this._closePop(); this._el.innerHTML = ''; }

  /* â”€â”€ Build â”€â”€ */
  _build() {
    const explicitFieldOnly = this.renderMode === 'field-only';
    const explicitStandalone = this.renderMode === 'standalone';
    const parentIsGroup = this._el.parentElement?.classList.contains('mts-form-group');
    const fieldOnly = explicitFieldOnly || (!explicitStandalone && parentIsGroup);

    this._el.innerHTML = '';
    this._el.classList.add('mts-colorpicker');

    if (!fieldOnly && this.label) {
      const lbl = document.createElement('label');
      lbl.className = 'mts-colorpicker__label' + (this.required ? ' mts-label--required' : '');
      lbl.textContent = this.label;
      this._el.appendChild(lbl);
    }

    if (this.inline) {
      /* Modo inline — popup siempre visible dentro del contenedor */
      const pop = document.createElement('div');
      pop.className = 'mts-colorpicker__pop mts-colorpicker__pop--inline';
      this._el.appendChild(pop);
      this._popEl = pop;
      this._renderPop();
    } else if (this.triggerVariant === 'preview') {
      /* Modo preview — chip de color + botón icono */
      this._buildPreviewTrigger();
      const self = this;
      document.addEventListener('click', function() { self._closePop(); });
    } else {
      /* Modo trigger default — swatch + valor + chevron */
      const triggerWrap = document.createElement('div');
      triggerWrap.className = 'mts-colorpicker__trigger-wrap mts-colorpicker__trigger-wrap--' + this.size;

      const swatch = document.createElement('div');
      swatch.className = 'mts-colorpicker__swatch';
      swatch.style.background = this._hex;

      const chevron = document.createElement('span');
      chevron.className = 'mts-colorpicker__chevron';
      chevron.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';

      triggerWrap.appendChild(swatch);
      if (this.showTriggerText) {
        const valText = document.createElement('span');
        valText.className = 'mts-colorpicker__val';
        valText.textContent = this._formatOutput();
        this._valText = valText;
        triggerWrap.appendChild(valText);
      }
      triggerWrap.appendChild(chevron);

      if (!this.disabled) {
        triggerWrap.style.cursor = 'pointer';
        const self = this;
        triggerWrap.addEventListener('click', function(e) { e.stopPropagation(); if (self._open) { self._closePop(); } else { self._openPop(); } });
      } else {
        triggerWrap.classList.add('mts-colorpicker__trigger-wrap--disabled');
      }

      this._triggerWrap = triggerWrap;
      this._swatchEl    = swatch;
      this._el.appendChild(triggerWrap);

      const self = this;
      document.addEventListener('click', function() { self._closePop(); });
    }
  }

  _buildPreviewTrigger() {
    const wrap = document.createElement('div');
    wrap.className = 'mts-colorpicker__preview-trigger';

    /* Chip — muestra el color de fondo + texto de ejemplo */
    const chip = document.createElement('div');
    chip.className = 'mts-colorpicker__preview-chip';
    chip.style.background = this._hex;
    chip.style.color = this._contrastColor(this._hex);
    chip.textContent = this.previewText;
    /* Evitar que click en el chip cierre el popup */
    chip.addEventListener('click', function(e) { e.stopPropagation(); });
    this._previewChip = chip;

    /* Botón icono — abre/cierra el popup */
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mts-colorpicker__preview-chip-btn';
    btn.setAttribute('aria-label', 'Seleccionar color');
    btn.innerHTML = (typeof MTS !== 'undefined' && MTS.Icon) ? MTS.Icon.get('palette', 16) : '';
    this._previewBtn = btn;

    const self = this;
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (self._open) { self._closePop(); } else { self._openPop(); }
    });

    wrap.appendChild(chip);
    wrap.appendChild(btn);
    this._el.appendChild(wrap);
    this._triggerWrap = wrap; /* referencia para _positionPop */
  }

  _openPop() {
    if (this._open || this.disabled) return;
    this._closePop();
    this._open = true;

    const pop = document.createElement('div');
    pop.className = 'mts-colorpicker__pop';
    pop.addEventListener('click', function(e) { e.stopPropagation(); });
    document.body.appendChild(pop);
    this._popEl = pop;
    this._renderPop();
    this._positionPop();

    const self = this;
    this._scrollHandler = function() { self._positionPop(); };
    window.addEventListener('scroll', this._scrollHandler, true);

    this._triggerWrap?.classList.add('mts-colorpicker__trigger-wrap--open');
    this._previewBtn?.classList.add('mts-colorpicker__preview-chip-btn--open');
    this._emit('open', {});
  }

  _closePop() {
    if (!this._open || this.inline) return;
    this._open = false;
    this._popEl?.remove();
    this._popEl = null;
    if (this._scrollHandler) {
      window.removeEventListener('scroll', this._scrollHandler, true);
      this._scrollHandler = null;
    }
    this._triggerWrap?.classList.remove('mts-colorpicker__trigger-wrap--open');
    this._previewBtn?.classList.remove('mts-colorpicker__preview-chip-btn--open');
    this._emit('close', {});
  }

  _positionPop() {
    if (!this._popEl || !this._triggerWrap) return;
    const tr = this._triggerWrap.getBoundingClientRect();
    const pop = this._popEl;
    pop.style.position = 'fixed';
    pop.style.zIndex   = '9999';
    let top  = tr.bottom + 6;
    let left = tr.left;
    const pr = pop.getBoundingClientRect();
    if (left + pr.width > window.innerWidth  - 8) left = window.innerWidth  - pr.width - 8;
    if (top  + pr.height > window.innerHeight - 8) top  = tr.top - pr.height - 6;
    pop.style.left = left + 'px';
    pop.style.top  = top  + 'px';
  }

  _renderPop() {
    if (!this._popEl) return;
    this._popEl.innerHTML = '';
    const [h, s, l] = this._hexToHSL(this._hex);

    /* â”€â”€ Preview + hex input â”€â”€ */
    if (this.showInput) {
      const topRow = document.createElement('div');
      topRow.className = 'mts-colorpicker__top';
      const preview = document.createElement('div');
      preview.className = 'mts-colorpicker__preview';
      preview.style.background = this._hex;
      this._previewEl = preview;
      const hexInp = document.createElement('input');
      hexInp.type = 'text'; hexInp.maxLength = 7;
      hexInp.className = 'mts-colorpicker__hex-input';
      hexInp.value = this._hex;
      hexInp.spellcheck = false;
      const self = this;
      hexInp.addEventListener('input', function(e) {
        const v = e.target.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
          self._hex = v;
          preview.style.background = v;
          self._syncSliders();
          self._emitChange();
        }
      });
      this._hexInpEl = hexInp;
      topRow.appendChild(preview); topRow.appendChild(hexInp);
      this._popEl.appendChild(topRow);
    }

    /* â”€â”€ Sliders H, S, L â”€â”€ */
    if (this.showSliders) {
      const sliders = document.createElement('div');
      sliders.className = 'mts-colorpicker__sliders';
      this._sliders = {};
      [
        { label:'H', min:0, max:360, val:Math.round(h),      key:'h' },
        { label:'S', min:0, max:100, val:Math.round(s*100),  key:'s' },
        { label:'L', min:0, max:100, val:Math.round(l*100),  key:'l' },
      ].forEach(cfg => {
        const row = document.createElement('div');
        row.className = 'mts-colorpicker__slider-row';
        const lbl = document.createElement('span'); lbl.textContent = cfg.label;
        const inp = document.createElement('input');
        inp.type = 'range'; inp.min = cfg.min; inp.max = cfg.max; inp.value = cfg.val;
        inp.className = 'mts-colorpicker__slider mts-colorpicker__slider--' + cfg.key;
        const num = document.createElement('span'); num.textContent = cfg.val;
        const self = this;
        inp.addEventListener('input', function(e) {
          num.textContent = e.target.value;
          self._hex = self._hslToHex(
            cfg.key==='h' ? Number(e.target.value) : +self._sliders.h.value,
            cfg.key==='s' ? Number(e.target.value)/100 : +self._sliders.s.value/100,
            cfg.key==='l' ? Number(e.target.value)/100 : +self._sliders.l.value/100,
          );
          if (self._previewEl) self._previewEl.style.background = self._hex;
          if (self._hexInpEl)  self._hexInpEl.value = self._hex;
          if (self._swatchEl)  self._swatchEl.style.background = self._hex;
          if (self._valText)   self._valText.textContent = self._formatOutput();
          self._emitChange();
        });
        this._sliders[cfg.key] = inp;
        row.appendChild(lbl); row.appendChild(inp); row.appendChild(num);
        sliders.appendChild(row);
      });
      this._popEl.appendChild(sliders);
    }

    /* â”€â”€ Paleta de presets â”€â”€ */
    if (this.showPresets && this.presets.length) {
      const palette = document.createElement('div');
      palette.className = 'mts-colorpicker__palette';
      this.presets.forEach(color => {
        const sw = document.createElement('button');
        sw.type = 'button'; sw.className = 'mts-colorpicker__preset';
        sw.style.background = color; sw.title = color;
        if (color.toLowerCase() === this._hex.toLowerCase()) sw.classList.add('mts-colorpicker__preset--active');
        sw.addEventListener('click', () => {
          this._hex = color;
          this._updateTrigger();
          this._renderPop();
          this._emitChange();
        });
        palette.appendChild(sw);
      });
      this._popEl.appendChild(palette);
    }

    /* â”€â”€ Footer — only in popup mode (not inline) â”€â”€ */
    if (!this.inline) {
      const footer = document.createElement('div');
      footer.className = 'mts-colorpicker__footer';

      const fmtBtn = document.createElement('button');
      fmtBtn.type = 'button'; fmtBtn.className = 'mts-btn mts-btn--ghost mts-btn--sm';
      fmtBtn.textContent = this.format.toUpperCase();
      if (!this.showFormatSwitch) fmtBtn.style.display = 'none';
      fmtBtn.addEventListener('click', () => {
        const fmts = ['hex','rgb','hsl'];
        this.format = fmts[(fmts.indexOf(this.format)+1) % fmts.length];
        fmtBtn.textContent = this.format.toUpperCase();
        if (this._valText) this._valText.textContent = this._formatOutput();
      });

      const okBtn = document.createElement('button');
      okBtn.type = 'button'; okBtn.className = 'mts-btn mts-btn--primary mts-btn--sm';
      okBtn.textContent = 'Aceptar';
      okBtn.addEventListener('click', () => {
        this._updateTrigger();
        this._emitChange();
        this._closePop();
      });

      footer.appendChild(fmtBtn); footer.appendChild(okBtn);
      this._popEl.appendChild(footer);
    }
  }

  _syncSliders() {
    if (!this._sliders) return;
    const [h, s, l] = this._hexToHSL(this._hex);
    if (this._sliders.h) this._sliders.h.value = Math.round(h);
    if (this._sliders.s) this._sliders.s.value = Math.round(s*100);
    if (this._sliders.l) this._sliders.l.value = Math.round(l*100);
  }

  _updateTrigger() {
    if (this._swatchEl) this._swatchEl.style.background = this._hex;
    if (this._valText)  this._valText.textContent = this._formatOutput();
    if (this._previewChip) {
      this._previewChip.style.background = this._hex;
      this._previewChip.style.color = this._contrastColor(this._hex);
    }
  }

  /* Devuelve '#ffffff' o '#1a1a1a' según la luminancia del color de fondo */
  _contrastColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) > 128 ? '#1a1a1a' : '#ffffff';
  }

  _emitChange() {
    const detail = { hex: this._hex, value: this._formatOutput(), formatted: this._formatOutput() };
    this._emit('change', detail);
  }

  /* â”€â”€ Formatos â”€â”€ */
  _formatOutput() {
    if (this._hex == null) return '';
    if (this.format === 'rgb') return this._hexToRGB(this._hex);
    if (this.format === 'hsl') {
      const [h,s,l] = this._hexToHSL(this._hex);
      return 'hsl(' + Math.round(h) + ', ' + Math.round(s*100) + '%, ' + Math.round(l*100) + '%)';
    }
    return this._hex;
  }

  /* â”€â”€ Color helpers â”€â”€ */
  _toHex(color) {
    if (!color) return null;
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) return color;
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = color;
    return ctx.fillStyle;
  }
  _hexToRGB(hex) {
    const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }
  _hexToHSL(hex) {
    let r=parseInt(hex.slice(1,3),16)/255, g=parseInt(hex.slice(3,5),16)/255, b=parseInt(hex.slice(5,7),16)/255;
    const max=Math.max(r,g,b), min=Math.min(r,g,b); let h,s,l=(max+min)/2;
    if (max===min) { h=s=0; } else {
      const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min);
      switch(max){ case r:h=((g-b)/d+(g<b?6:0))/6;break; case g:h=((b-r)/d+2)/6;break; case b:h=((r-g)/d+4)/6;break; }
      h*=360;
    }
    return [h,s,l];
  }
  _hslToHex(h,s,l) {
    const hue2rgb=(p,q,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return p+(q-p)*6*t;if(t<1/2)return q;if(t<2/3)return p+(q-p)*(2/3-t)*6;return p;};
    h/=360; let r,g,b;
    if(s===0){r=g=b=l;}else{const q=l<0.5?l*(1+s):l+s-l*s,p=2*l-q;r=hue2rgb(p,q,h+1/3);g=hue2rgb(p,q,h);b=hue2rgb(p,q,h-1/3);}
    const toH=x=>Math.round(x*255).toString(16).padStart(2,'0');
    return '#'+toH(r)+toH(g)+toH(b);
  }
  _emit(event, detail) {
    (this._listeners[event] || []).forEach(function(fn) { fn(detail); });
    this._el?.dispatchEvent(new CustomEvent('mts:colorpicker:' + event, { bubbles: true, detail }));
  }
};

