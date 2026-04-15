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
   * @param {Array}    options.presets     Colores de la paleta — default: 14 colores
   * @param {boolean}  options.showPresets Muestra paleta — default: true
   * @param {boolean}  options.showSliders Muestra sliders HSL — default: true
   * @param {boolean}  options.showInput         Muestra input de texto — default: true
   * @param {boolean}  options.showFormatSwitch  Muestra botón para cambiar hex/rgb/hsl — default: true
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
    /* ── data-* → inicialización HTML declarativa ── */
    const _ds = this._el?.dataset || {};
    const _fromHTML = {};
    if (_ds.value !== undefined) _fromHTML.value = _ds.value;
    if (_ds.label !== undefined) _fromHTML.label = _ds.label;
    if (_ds.format !== undefined) _fromHTML.format = _ds.format;
    if (_ds.inline !== undefined) _fromHTML.inline = true;
    if (_ds.disabled !== undefined) _fromHTML.disabled = true;
    if (_ds.size !== undefined) _fromHTML.size = _ds.size;
    options = { ..._fromHTML, ...options };

    // Initial color value (hex) / Valor de color inicial (hex)
    this._hex = this._toHex(options.value) || '#4f8eff';

    // Field label / Etiqueta del campo
    this.label = options.label || '';

    // Output format: 'hex' | 'rgb' | 'hsl' / Formato de salida
    this.format = options.format || 'hex';

    // Preset color palette / Paleta de colores preset
    this.presets = options.presets || [
      '#f87171','#fb923c','#fbbf24','#a3e635','#34d399',
      '#38bdf8','#818cf8','#c084fc','#f472b6','#94a3b8',
      '#ffffff','#64748b','#1e293b','#000000',
    ];

    // Show preset palette / Mostrar paleta de presets
    this.showPresets = options.showPresets ?? true;

    // Show HSL sliders / Mostrar sliders HSL
    this.showSliders = options.showSliders ?? true;

    // Show hex input / Mostrar input hex
    this.showInput = options.showInput ?? true;

    // Show format switch button (hex/rgb/hsl) / Mostrar botón de formato
    this.showFormatSwitch = options.showFormatSwitch ?? true;

    // Always visible, no trigger button / Siempre visible, sin botón trigger
    this.inline = options.inline ?? false;

    // Size: 'sm' | 'md' | 'lg' / Tamaño
    this.size = options.size || 'md';

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

    this._open       = false;
    this._popEl      = null;
    this._build();
  }

  /* ── API ── */
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }
  getValue()       { return this._formatOutput(); }
  getHex()         { return this._hex; }
  setValue(color)  { this._hex = this._toHex(color) || color; this._updateTrigger(); if (this._open) this._renderPop(); return this; }
  setFormat(f)     { this.format = f; this._updateTrigger(); return this; }
  open()           { this._openPop(); return this; }
  close()          { this._closePop(); return this; }
  disable()        { this.disabled = true;  this._build(); return this; }
  enable()         { this.disabled = false; this._build(); return this; }
  destroy()        { this._closePop(); this._el.innerHTML = ''; }

  /* ── Build ── */
  _build() {
    this._el.innerHTML = '';
    this._el.className = 'mts-colorpicker';
    /* Heredar ancho completo si está dentro de un form-group */
    if (this._el.parentElement?.classList.contains('mts-form-group')) {
      this._el.style.width = '100%';
    }

    if (this.label) {
      const lbl = document.createElement('label');
      lbl.className = 'mts-colorpicker__label';
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
    } else {
      /* Modo trigger — botón que abre popup */
      const triggerWrap = document.createElement('div');
      triggerWrap.className = 'mts-colorpicker__trigger-wrap mts-colorpicker__trigger-wrap--' + this.size;

      const swatch = document.createElement('div');
      swatch.className = 'mts-colorpicker__swatch';
      swatch.style.background = this._hex;

      const valText = document.createElement('span');
      valText.className = 'mts-colorpicker__val';
      valText.textContent = this._formatOutput();
      this._valText = valText;

      const chevron = document.createElement('span');
      chevron.className = 'mts-colorpicker__chevron';
      chevron.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';

      triggerWrap.appendChild(swatch);
      triggerWrap.appendChild(valText);
      triggerWrap.appendChild(chevron);

      if (!this.disabled) {
        triggerWrap.style.cursor = 'pointer';
        triggerWrap.addEventListener('click', (e) => { e.stopPropagation(); this._open ? this._closePop() : this._openPop(); });
      } else {
        triggerWrap.classList.add('mts-colorpicker__trigger-wrap--disabled');
      }

      this._triggerWrap = triggerWrap;
      this._swatchEl    = swatch;
      this._el.appendChild(triggerWrap);

      /* Cerrar al click fuera */
      document.addEventListener('click', () => this._closePop());
    }
  }

  _openPop() {
    if (this._open || this.disabled) return;
    this._closePop();
    this._open = true;

    const pop = document.createElement('div');
    pop.className = 'mts-colorpicker__pop';
    pop.addEventListener('click', e => e.stopPropagation());
    document.body.appendChild(pop);
    this._popEl = pop;
    this._renderPop();
    this._positionPop();
    this._triggerWrap?.classList.add('mts-colorpicker__trigger-wrap--open');
    this._emit('open', {});
  }

  _closePop() {
    if (!this._open || this.inline) return;
    this._open = false;
    this._popEl?.remove();
    this._popEl = null;
    this._triggerWrap?.classList.remove('mts-colorpicker__trigger-wrap--open');
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

    /* ── Preview + hex input ── */
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
      hexInp.addEventListener('input', (e) => {
        const v = e.target.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
          this._hex = v;
          preview.style.background = v;
          this._syncSliders();
        }
      });
      this._hexInpEl = hexInp;
      topRow.appendChild(preview); topRow.appendChild(hexInp);
      this._popEl.appendChild(topRow);
    }

    /* ── Sliders H, S, L ── */
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
        inp.addEventListener('input', (e) => {
          num.textContent = e.target.value;
          this._hex = this._hslToHex(
            cfg.key==='h' ? Number(e.target.value) : +this._sliders.h.value,
            cfg.key==='s' ? Number(e.target.value)/100 : +this._sliders.s.value/100,
            cfg.key==='l' ? Number(e.target.value)/100 : +this._sliders.l.value/100,
          );
          if (this._previewEl) this._previewEl.style.background = this._hex;
          if (this._hexInpEl)  this._hexInpEl.value = this._hex;
          if (this._swatchEl)  this._swatchEl.style.background = this._hex;
          if (this._valText)   this._valText.textContent = this._formatOutput();
        });
        this._sliders[cfg.key] = inp;
        row.appendChild(lbl); row.appendChild(inp); row.appendChild(num);
        sliders.appendChild(row);
      });
      this._popEl.appendChild(sliders);
    }

    /* ── Paleta de presets ── */
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

    /* ── Footer — only in popup mode (not inline) ── */
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
  }

  _emitChange() {
    const detail = { hex: this._hex, value: this._formatOutput(), formatted: this._formatOutput() };
    this._emit('change', detail);
  }

  /* ── Formatos ── */
  _formatOutput() {
    if (this.format === 'rgb') return this._hexToRGB(this._hex);
    if (this.format === 'hsl') {
      const [h,s,l] = this._hexToHSL(this._hex);
      return 'hsl(' + Math.round(h) + ', ' + Math.round(s*100) + '%, ' + Math.round(l*100) + '%)';
    }
    return this._hex;
  }

  /* ── Color helpers ── */
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
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el?.dispatchEvent(new CustomEvent(`mts:colorpicker:${event}`, { bubbles: true, detail }));
  }
};
