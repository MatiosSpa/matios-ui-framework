/* ============================================================
   MATIOS UI — matios-ui-copybutton.js  v1.0.0
   MTS.CopyButton — Botón que copia texto al portapapeles
   con feedback visual automático.
   ============================================================ */

window.MTS = window.MTS || {};

MTS.CopyButton = class MtsCopyButton {
  /**
   * @param {string|Element} selector
   * @param {object}  options
   * @param {string}  options.text          Texto a copiar (requerido si no hay target)
   * @param {string}  options.target        Selector del elemento cuyo textContent/value copiar
   * @param {string}  options.label         Texto del botón — default: 'Copiar'
   * @param {string}  options.labelCopied   Texto tras copiar — default: '¡Copiado!'
   * @param {string}  options.icon          SVG/emoji del ícono por defecto
   * @param {string}  options.iconCopied    SVG/emoji tras copiar
   * @param {string}  options.variant       Variante del botón — default: 'secondary'
   * @param {string}  options.size          'sm'|''|'lg'
   * @param {boolean} options.iconOnly      Solo ícono, sin texto
   * @param {number}  options.resetDelay    ms para resetear — default: 2000
   * @param {function} options.onCopy       Callback (text) => {}
   */
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) { console.error('[MTS.CopyButton] No encontrado:', selector); return; }
    /* ── data-* → inicialización HTML declarativa ── */
    const _ds = this._el?.dataset || {};
    const _fromHTML = {};
    if (_ds.text !== undefined) _fromHTML.text = _ds.text;
    if (_ds.target !== undefined) _fromHTML.target = _ds.target;
    if (_ds.label !== undefined) _fromHTML.label = _ds.label;
    if (_ds.labelCopied !== undefined) _fromHTML.labelCopied = _ds.labelCopied;
    if (_ds.variant !== undefined) _fromHTML.variant = _ds.variant;
    if (_ds.size !== undefined) _fromHTML.size = _ds.size;
    if (_ds.iconOnly !== undefined) _fromHTML.iconOnly = true;
    if (_ds.resetDelay !== undefined) _fromHTML.resetDelay = parseInt(_ds.resetDelay);
    options = { ..._fromHTML, ...options };


    this.text        = options.text        ?? null;
    this.target      = options.target      ?? null;
    this.label       = options.label       ?? 'Copiar';
    this.labelCopied = options.labelCopied ?? '¡Copiado!';
    this.icon        = options.icon        ?? this._defaultIcon();
    this.iconCopied  = options.iconCopied  ?? this._checkIcon();
    this.variant     = options.variant     ?? 'secondary';
    this.size        = options.size        ?? '';
    this.iconOnly    = options.iconOnly    ?? false;
    this.resetDelay  = options.resetDelay  ?? 2000;
    this._onCopy     = options.onCopy      ?? null;
    this._copied     = false;
    this._timer      = null;

    this._build();
  }

  /* ── API ──────────────────────────────────────────────── */

  setText(text) { this.text = text; return this; }

  copy() { this._doCopy(); return this; }

  destroy() { this._el.innerHTML = ''; }

  /* ── Build ────────────────────────────────────────────── */

  _build() {
    const classes = ['mts-btn', 'mts-btn--' + this.variant, 'mts-copybtn'];
    if (this.size) classes.push('mts-btn--' + this.size);
    this._el.className = classes.join(' ');
    this._el.setAttribute('type', 'button');
    this._el.setAttribute('aria-label', this.label);
    this._el.innerHTML = '';

    this._iconEl = document.createElement('span');
    this._iconEl.className = 'mts-btn__icon mts-copybtn__icon';
    this._iconEl.innerHTML = this.icon;
    this._el.appendChild(this._iconEl);

    if (!this.iconOnly) {
      this._labelEl = document.createElement('span');
      this._labelEl.className = 'mts-copybtn__label';
      this._labelEl.textContent = this.label;
      this._el.appendChild(this._labelEl);
    }

    this._el.addEventListener('click', () => this._doCopy());
  }

  _doCopy() {
    if (this._copied) return;

    const text = this._getText();
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      this._setCopied(true);
      if (this._onCopy) this._onCopy(text);
    }).catch(() => {
      /* Fallback para contextos sin clipboard API */
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        this._setCopied(true);
        if (this._onCopy) this._onCopy(text);
      } catch(e) {
        console.warn('[MTS.CopyButton] No se pudo copiar:', e);
      }
    });
  }

  _getText() {
    if (this.text) return this.text;
    if (this.target) {
      const el = typeof this.target === 'string'
        ? document.querySelector(this.target)
        : this.target;
      if (!el) return '';
      return el.value !== undefined ? el.value : el.textContent;
    }
    return '';
  }

  _setCopied(v) {
    this._copied = v;
    this._el.classList.toggle('mts-copybtn--copied', v);
    this._iconEl.innerHTML = v ? this.iconCopied : this.icon;
    if (this._labelEl) this._labelEl.textContent = v ? this.labelCopied : this.label;
    this._el.setAttribute('aria-label', v ? this.labelCopied : this.label);

    if (v) {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => this._setCopied(false), this.resetDelay);
    }
  }

  _defaultIcon() {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
  }

  _checkIcon() {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`;
  }
};
