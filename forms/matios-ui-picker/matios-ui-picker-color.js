/* ============================================================
   MATIOS UI — matios-ui-picker-color.js  v2.0.0
   MTS.Picker.Color — Selector de color (hex, rgb, hsl)
   Requiere: matios-ui-picker-base.js
   ============================================================ */

MTS.Picker.Color = class MtsPickerColor extends MTS.Picker.Base {

  constructor(selector, options = {}) {
    options.placeholder  = options.placeholder || "#000000";
    options.closeOnSelect = options.closeOnSelect ?? false;
    options.readonly      = options.readonly ?? false;
    super(selector, options);
    this._hex    = options.value || "#4f8eff";
    this._format = options.colorFormat || "hex"; // "hex" | "rgb" | "hsl"
    this._presets = options.presets || [
      "#f87171","#fb923c","#fbbf24","#a3e635","#34d399",
      "#38bdf8","#818cf8","#c084fc","#f472b6","#94a3b8",
      "#ffffff","#64748b","#1e293b","#000000",
    ];
    this._updateInputValue();
  }

  setValue(color) {
    this._hex = this._toHex(color) || color;
    this._updateInputValue();
    return this;
  }

  getValue() { return this._formatOutput(); }

  _modeClass()  { return "color"; }
  _iconClass()  { return "mts-picker-icon--color"; }

  _updatePopupContent() {
    this._popupEl.innerHTML = "";

    /* Preview + input hex */
    const top = document.createElement("div");
    top.className = "mts-picker-color__top";

    const preview = document.createElement("div");
    preview.className = "mts-picker-color__preview";
    preview.style.background = this._hex;

    const hexInput = document.createElement("input");
    hexInput.type  = "text";
    hexInput.className   = "mts-picker-color__hex-input";
    hexInput.value       = this._hex;
    hexInput.maxLength   = 7;
    hexInput.spellcheck  = false;
    hexInput.addEventListener("input", (e) => {
      const v = e.target.value;
      if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
        this._hex = v;
        preview.style.background = v;
        this._updateHSL();
      }
    });

    top.appendChild(preview); top.appendChild(hexInput);
    this._popupEl.appendChild(top);

    /* Sliders H, S, L */
    const sliders = document.createElement("div");
    sliders.className = "mts-picker-color__sliders";
    const [h, s, l] = this._hexToHSL(this._hex);

    [
      { label:"H", min:0,   max:360, val:Math.round(h),   key:"h" },
      { label:"S", min:0,   max:100, val:Math.round(s*100), key:"s" },
      { label:"L", min:0,   max:100, val:Math.round(l*100), key:"l" },
    ].forEach(cfg => {
      const row = document.createElement("div");
      row.className = "mts-picker-color__slider-row";
      const lbl = document.createElement("span");
      lbl.textContent = cfg.label;
      const input = document.createElement("input");
      input.type  = "range"; input.min = cfg.min; input.max = cfg.max; input.value = cfg.val;
      input.className = "mts-picker-color__slider mts-picker-color__slider--" + cfg.key;
      const val = document.createElement("span");
      val.textContent = cfg.val;
      input.addEventListener("input", (e) => {
        val.textContent = e.target.value;
        const [hNew, sNew, lNew] = [
          cfg.key === "h" ? Number(e.target.value) : h,
          cfg.key === "s" ? Number(e.target.value)/100 : s,
          cfg.key === "l" ? Number(e.target.value)/100 : l,
        ];
        this._hex = this._hslToHex(hNew, sNew, lNew);
        hexInput.value = this._hex;
        preview.style.background = this._hex;
      });
      row.appendChild(lbl); row.appendChild(input); row.appendChild(val);
      sliders.appendChild(row);
    });
    this._popupEl.appendChild(sliders);

    /* Paleta de presets */
    const palette = document.createElement("div");
    palette.className = "mts-picker-color__palette";
    this._presets.forEach(color => {
      const swatch = document.createElement("button");
      swatch.className = "mts-picker-color__swatch";
      swatch.style.background = color;
      swatch.title = color;
      if (color.toLowerCase() === this._hex.toLowerCase())
        swatch.classList.add("mts-picker-color__swatch--selected");
      swatch.addEventListener("click", () => {
        this._hex = color;
        hexInput.value = color;
        preview.style.background = color;
        this._updatePopupContent();
      });
      palette.appendChild(swatch);
    });
    this._popupEl.appendChild(palette);

    /* Footer */
    const footer = document.createElement("div");
    footer.className = "mts-picker-footer";
    const formatBtn = document.createElement("button");
    formatBtn.className   = "mts-btn mts-btn--ghost mts-btn--sm";
    formatBtn.textContent = this._format.toUpperCase();
    formatBtn.addEventListener("click", () => {
      const formats = ["hex","rgb","hsl"];
      this._format = formats[(formats.indexOf(this._format)+1) % formats.length];
      formatBtn.textContent = this._format.toUpperCase();
    });
    const okBtn = document.createElement("button");
    okBtn.className   = "mts-btn mts-btn--primary mts-btn--sm";
    okBtn.textContent = "Aceptar";
    okBtn.addEventListener("click", () => {
      this._value = this._formatOutput();
      this._updateInputValue();
      this._emit("change", { value: this._value, hex: this._hex, formatted: this._input.value });
      this.close();
    });
    footer.appendChild(formatBtn); footer.appendChild(okBtn);
    this._popupEl.appendChild(footer);
  }

  _updateHSL() { /* se recalcula en updatePopupContent */ }

  _formatOutput() {
    if (this._format === "rgb") return this._hexToRGB(this._hex);
    if (this._format === "hsl") {
      const [h,s,l] = this._hexToHSL(this._hex);
      return "hsl(" + Math.round(h) + ", " + Math.round(s*100) + "%, " + Math.round(l*100) + "%)";
    }
    return this._hex;
  }

  _updateInputValue() {
    const output = this._formatOutput();
    this._input.value = output;
    this._wrapperEl.style.setProperty("--picker-color-preview", this._hex);
    this._clearBtn?.classList.add("mts-picker__clear--visible");
  }

  /* ── Color helpers ── */
  _toHex(color) {
    if (!color) return null;
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) return color;
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = color;
    return ctx.fillStyle; // normaliza a hex
  }

  _hexToRGB(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }

  _hexToHSL(hex) {
    let r = parseInt(hex.slice(1,3),16)/255;
    let g = parseInt(hex.slice(3,5),16)/255;
    let b = parseInt(hex.slice(5,7),16)/255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    let h, s, l = (max+min)/2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d/(2-max-min) : d/(max+min);
      switch(max) {
        case r: h = ((g-b)/d + (g<b?6:0))/6; break;
        case g: h = ((b-r)/d + 2)/6; break;
        case b: h = ((r-g)/d + 4)/6; break;
      }
      h *= 360;
    }
    return [h, s, l];
  }

  _hslToHex(h, s, l) {
    const hue2rgb = (p,q,t) => {
      if (t<0) t+=1; if (t>1) t-=1;
      if (t<1/6) return p+(q-p)*6*t;
      if (t<1/2) return q;
      if (t<2/3) return p+(q-p)*(2/3-t)*6;
      return p;
    };
    h /= 360;
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
      const q = l < 0.5 ? l*(1+s) : l+s-l*s;
      const p = 2*l-q;
      r = hue2rgb(p,q,h+1/3); g = hue2rgb(p,q,h); b = hue2rgb(p,q,h-1/3);
    }
    const toH = x => Math.round(x*255).toString(16).padStart(2,"0");
    return "#" + toH(r) + toH(g) + toH(b);
  }
};
