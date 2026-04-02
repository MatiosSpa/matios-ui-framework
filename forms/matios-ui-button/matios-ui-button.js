/* ============================================================
   MATIOS UI — matios-ui-button.js  v1.1.0
   MTS.Button — Botón con variantes, estados y eventos
   MTS.ButtonGroup — Grupo de botones
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Button = class MtsButton {
  /**
   * @param {string|Element} selector
   * @param {object}   options
   * @param {string}   options.label      Texto del botón
   * @param {string}   options.variant    'primary'|'secondary'|'ghost'|'danger'|'success'|'warning'|'link'
   * @param {string}   options.size       'xs'|'sm'|''|'lg'|'xl'
   * @param {boolean}  options.block      Ancho completo
   * @param {boolean}  options.round      Border-radius full
   * @param {boolean}  options.iconOnly   Solo ícono (padding cuadrado)
   * @param {boolean}  options.disabled
   * @param {boolean}  options.loading    Muestra spinner
   * @param {string}   options.iconLeft   HTML del ícono izquierdo
   * @param {string}   options.iconRight  HTML del ícono derecho
   * @param {string}   options.className  Clases CSS adicionales
   * @param {object}   options.style      Estilos CSS inline custom
   * @param {boolean}  options.shadow     Sombra de color del botón
   * @param {boolean}  options.ring       Ring semitransparente alrededor del botón
   * @param {function} options.onClick    (event, instance) => {}
   */
  constructor(selector, options = {}) {
    this._el = typeof selector === "string"
      ? document.querySelector(selector)
      : selector;
    if (!this._el) { console.error("[MTS.Button] No encontrado:", selector); return; }
    /* ── data-* → inicialización HTML declarativa ── */
    const _ds = this._el?.dataset || {};
    const _fromHTML = {};
    if (_ds.label !== undefined) _fromHTML.label = _ds.label;
    if (_ds.variant !== undefined) _fromHTML.variant = _ds.variant;
    if (_ds.size !== undefined) _fromHTML.size = _ds.size;
    if (_ds.disabled !== undefined) _fromHTML.disabled = true;
    if (_ds.loading !== undefined) _fromHTML.loading = true;
    if (_ds.block !== undefined) _fromHTML.block = true;
    if (_ds.round !== undefined) _fromHTML.round = true;
    if (_ds.iconOnly !== undefined) _fromHTML.iconOnly = true;
    if (_ds.shadow !== undefined) _fromHTML.shadow = true;
    if (_ds.ring !== undefined) _fromHTML.ring = true;
    options = { ..._fromHTML, ...options };


    this.label     = options.label     ?? this._el.textContent.trim();
    this.variant   = options.variant   || "primary";
    this.size      = options.size      || "";
    this.block     = options.block     ?? false;
    this.round     = options.round     ?? false;
    this.iconOnly  = options.iconOnly  ?? false;
    this.disabled  = options.disabled  ?? false;
    this.loading   = options.loading   ?? false;
    this.iconLeft  = options.iconLeft  || null;
    this.iconRight = options.iconRight || null;
    this.className = options.className || "";
    this.customStyle = options.style   || null;
    this.shadow    = options.shadow    ?? false;
    this.ring      = options.ring      ?? false;
    this._onClick  = options.onClick   || null;
    this._listeners = {};

    this._build();
    this._bindEvents();
  }

  /* ── API ──────────────────────────────────────────────── */

  enable()  { this.disabled = false; this._el.disabled = false; this._el.classList.remove("mts-btn--disabled"); return this; }
  disable() { this.disabled = true;  this._el.disabled = true;  this._el.classList.add("mts-btn--disabled");    return this; }

  setLoading(v) {
    this.loading = v;
    this._el.disabled = v || this.disabled;
    const sp = this._el.querySelector(".mts-btn__spinner");
    if (v && !sp) {
      const el = document.createElement("span");
      el.className = "mts-btn__spinner";
      this._el.insertBefore(el, this._el.firstChild);
    } else if (!v && sp) {
      sp.remove();
    }
    return this;
  }

  setLabel(text) {
    this.label = text;
    const lbl = this._el.querySelector(".mts-btn__label");
    if (lbl) lbl.textContent = text;
    return this;
  }

  setVariant(variant) {
    ["primary","secondary","ghost","danger","success","warning","link"].forEach(v =>
      this._el.classList.remove("mts-btn--" + v));
    this.variant = variant;
    this._el.classList.add("mts-btn--" + variant);
    return this;
  }

  setShadow(v) {
    this.shadow = v;
    this._el.classList.toggle("mts-btn--shadow", v);
    return this;
  }

  setRing(v) {
    this.ring = v;
    this._el.classList.toggle("mts-btn--ring", v);
    return this;
  }

  on(event, cb)  { (this._listeners[event] = this._listeners[event] || []).push(cb); return this; }
  off(event, cb) { this._listeners[event] = (this._listeners[event] || []).filter(f => f !== cb); return this; }
  destroy()      { this._el.replaceWith(this._el.cloneNode(true)); }

  /* ── Build ────────────────────────────────────────────── */

  _build() {
    const classes = ["mts-btn", "mts-btn--" + this.variant];
    if (this.size)      classes.push("mts-btn--" + this.size);
    if (this.block)     classes.push("mts-btn--block");
    if (this.round)     classes.push("mts-btn--round");
    if (this.iconOnly)  classes.push("mts-btn--icon");
    if (this.disabled)  classes.push("mts-btn--disabled");
    if (this.shadow)    classes.push("mts-btn--shadow");
    if (this.ring)      classes.push("mts-btn--ring");
    if (this.className) this.className.split(" ").forEach(c => c && classes.push(c));

    this._el.className = classes.join(" ");
    this._el.disabled  = this.disabled || this.loading;
    this._el.innerHTML = "";

    /* CSS custom inline */
    if (this.customStyle) {
      Object.assign(this._el.style, this.customStyle);
    }

    if (this.loading) {
      const sp = document.createElement("span");
      sp.className = "mts-btn__spinner";
      this._el.appendChild(sp);
    }

    if (this.iconLeft) {
      const ic = document.createElement("span");
      ic.className = "mts-btn__icon-left";
      ic.innerHTML = this.iconLeft;
      this._el.appendChild(ic);
    }

    if (!this.iconOnly && this.label) {
      const lbl = document.createElement("span");
      lbl.className = "mts-btn__label";
      lbl.textContent = this.label;
      this._el.appendChild(lbl);
    }

    if (this.iconRight) {
      const ic = document.createElement("span");
      ic.className = "mts-btn__icon-right";
      ic.innerHTML = this.iconRight;
      this._el.appendChild(ic);
    }
  }

  _bindEvents() {
    this._el.addEventListener("click", (e) => {
      if (this.disabled || this.loading) { e.preventDefault(); return; }
      this._onClick?.(e, this);
      (this._listeners["click"] || []).forEach(fn => fn(e, this));
      this._el.dispatchEvent(new CustomEvent("mts:button:click", {
        bubbles: true, detail: { button: this },
      }));
    });
  }
};

/* ── MTS.ButtonGroup ─────────────────────────────────────── */
MTS.ButtonGroup = class MtsButtonGroup {
  /**
   * @param {string|Element} selector   Contenedor div
   * @param {Array}  buttons            [{ label, variant, onClick, ... }]
   * @param {object} options
   * @param {string} options.size       Tamaño para todos los botones del grupo
   * @param {boolean} options.activeOnClick  Marcar botón como activo al hacer click — default: true
   */
  constructor(selector, buttons = [], options = {}) {
    this._el = typeof selector === "string"
      ? document.querySelector(selector)
      : selector;
    if (!this._el) { console.error("[MTS.ButtonGroup] No encontrado:", selector); return; }

    this._activeOnClick = options.activeOnClick ?? true;
    this._el.className = "mts-btn-group";
    this._instances = [];

    buttons.forEach((cfg, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      this._el.appendChild(btn);

      const originalOnClick = cfg.onClick || null;
      const instance = new MTS.Button(btn, {
        ...cfg,
        size: cfg.size || options.size || "",
        onClick: null,  // se bindea abajo directamente en el DOM
      });
      this._instances.push(instance);

      /* Bindear click directo en el elemento para garantizar que this sea el grupo */
      btn.addEventListener("click", (e) => {
        if (instance.disabled || instance.loading) return;
        if (this._activeOnClick) this._setActive(idx);
        originalOnClick?.(e, instance);
      });
    });

    /* Aplicar border-radius directamente via style — gana sobre cualquier CSS */
    this._applyGroupStyles();
  }

  /* Marca el botón en índice como activo, quita activo a los demás */
  setActive(index) { this._setActive(index); return this; }

  _setActive(activeIdx) {
    this._instances.forEach((inst, i) => {
      if (i === activeIdx) {
        inst._el.classList.add("mts-btn--active");
      } else {
        inst._el.classList.remove("mts-btn--active");
      }
    });
  }

  /* Aplica border-radius via style inline — no puede ser sobreescrito por base.css */
  _applyGroupStyles() {
    const total = this._instances.length;
    const r     = "var(--mts-radius-md)";

    this._instances.forEach((inst, i) => {
      const el = inst._el;

      /* Sin gap entre botones — margen 0 y borde derecho oculto salvo el último */
      el.style.margin      = "0";
      el.style.borderRight = i < total - 1 ? "0" : "";

      /* Border-radius: solo extremos */
      if (total === 1) {
        el.style.borderRadius = r;
      } else if (i === 0) {
        el.style.borderRadius = r + " 0 0 " + r;
      } else if (i === total - 1) {
        el.style.borderRadius = "0 " + r + " " + r + " 0";
      } else {
        el.style.borderRadius = "0";
      }
    });
  }

  getButtons()     { return this._instances; }
  getButton(index) { return this._instances[index] || null; }
};
