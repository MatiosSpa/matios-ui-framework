/* ============================================================
   MATIOS UI — matios-ui-confirmbutton.js
   MTS.ConfirmButton — Botón con confirmación inline (2 pasos)
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.ConfirmButton = class MtsConfirmButton {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {string}   options.label          Label del botón inicial
   * @param {string}   options.confirmLabel   Label del botón de confirmar — default: '¿Confirmar?'
   * @param {string}   options.cancelLabel    Label del botón cancelar — default: 'No'
   * @param {string}   options.variant        Variante del botón inicial — default: 'secondary'
   * @param {string}   options.confirmVariant Variante al confirmar — default: 'danger'
   * @param {string}   options.size           'sm'|'md'|'lg' — default: 'md'
   * @param {number}   options.timeout        ms para auto-cancelar si no confirma — default: 4000
   * @param {string}   options.iconLeft       Ícono HTML izquierdo
   * @param {function} options.onConfirm      Callback al confirmar
   * @param {function} options.onCancel       Callback al cancelar
   */
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    /* ── data-* → inicialización HTML declarativa ── */
    const _ds = this._el?.dataset || {};
    const _fromHTML = {};
    if (_ds.label !== undefined) _fromHTML.label = _ds.label;
    if (_ds.confirmLabel !== undefined) _fromHTML.confirmLabel = _ds.confirmLabel;
    if (_ds.cancelLabel !== undefined) _fromHTML.cancelLabel = _ds.cancelLabel;
    if (_ds.variant !== undefined) _fromHTML.variant = _ds.variant;
    if (_ds.confirmVariant !== undefined) _fromHTML.confirmVariant = _ds.confirmVariant;
    if (_ds.size !== undefined) _fromHTML.size = _ds.size;
    if (_ds.timeout !== undefined) _fromHTML.timeout = parseInt(_ds.timeout);
    if (_ds.disabled !== undefined) _fromHTML.disabled = true;
    options = { ..._fromHTML, ...options };

    this.label          = options.label          || 'Eliminar';
    this.confirmLabel   = options.confirmLabel   || '¿Confirmar?';
    this.cancelLabel    = options.cancelLabel    || 'No';
    this.variant        = options.variant        || 'secondary';
    this.confirmVariant = options.confirmVariant || 'danger';
    this.size           = options.size           || 'md';
    this.timeout        = options.timeout        ?? 4000;
    this.iconLeft       = options.iconLeft       || '';
    this.onConfirm      = options.onConfirm      || null;
    this.onCancel       = options.onCancel       || null;
    this._pending       = false;
    this._timer         = null;
    this._build();
  }

  /* ── API ── */
  reset()   { this._setPending(false); return this; }
  disable() { this._el.querySelectorAll('button').forEach(b => b.disabled = true); return this; }
  enable()  { this._el.querySelectorAll('button').forEach(b => b.disabled = false); return this; }

  _build() {
    this._el.innerHTML = '';
    this._el.className = 'mts-confirmbutton';

    /* Botón principal */
    this._btnMain = document.createElement('button');
    this._btnMain.type = 'button';
    this._btnMain.className = 'mts-btn mts-btn--' + this.variant + ' mts-btn--' + this.size;
    this._btnMain.innerHTML = (this.iconLeft ? '<span class="mts-btn__icon">' + this.iconLeft + '</span>' : '') + '<span>' + this.label + '</span>';
    this._btnMain.addEventListener('click', () => this._setPending(true));
    this._el.appendChild(this._btnMain);

    /* Grupo de confirmación (oculto inicialmente) */
    this._group = document.createElement('div');
    this._group.className = 'mts-confirmbutton__group';
    this._group.style.display = 'none';

    this._btnConfirm = document.createElement('button');
    this._btnConfirm.type = 'button';
    this._btnConfirm.className = 'mts-btn mts-btn--' + this.confirmVariant + ' mts-btn--' + this.size;
    this._btnConfirm.textContent = this.confirmLabel;
    this._btnConfirm.addEventListener('click', () => {
      this._setPending(false);
      if (this.onConfirm) this.onConfirm();
    });

    this._btnCancel = document.createElement('button');
    this._btnCancel.type = 'button';
    this._btnCancel.className = 'mts-btn mts-btn--ghost mts-btn--' + this.size;
    this._btnCancel.textContent = this.cancelLabel;
    this._btnCancel.addEventListener('click', () => {
      this._setPending(false);
      if (this.onCancel) this.onCancel();
    });

    /* Barra de timeout */
    this._bar = document.createElement('div');
    this._bar.className = 'mts-confirmbutton__bar';
    const fill = document.createElement('div');
    fill.className = 'mts-confirmbutton__bar-fill';
    this._bar.appendChild(fill);
    this._barFill = fill;

    this._group.appendChild(this._btnConfirm);
    this._group.appendChild(this._btnCancel);
    this._group.appendChild(this._bar);
    this._el.appendChild(this._group);
  }

  _setPending(pending) {
    clearTimeout(this._timer);
    clearInterval(this._barInterval);
    this._pending = pending;

    if (pending) {
      this._btnMain.style.display = 'none';
      this._group.style.display   = 'flex';
      this._group.classList.add('mts-confirmbutton__group--in');

      /* Barra de timeout */
      if (this.timeout > 0) {
        this._barFill.style.transition = 'none';
        this._barFill.style.width = '100%';
        requestAnimationFrame(() => {
          this._barFill.style.transition = 'width ' + this.timeout + 'ms linear';
          this._barFill.style.width = '0%';
        });
        this._timer = setTimeout(() => {
          this._setPending(false);
          if (this.onCancel) this.onCancel();
        }, this.timeout);
      }
      this._btnConfirm.focus();
    } else {
      this._group.classList.remove('mts-confirmbutton__group--in');
      this._group.style.display   = 'none';
      this._btnMain.style.display = '';
      this._barFill.style.width = '100%';
    }
  }
};
