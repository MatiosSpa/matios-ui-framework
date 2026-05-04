/* ============================================================
   MATIOS UI — matios-ui-confirmbutton.js
   MTS.ConfirmButton — Two-step inline confirmation button
   Version: 1.1.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.ConfirmButton = class MtsConfirmButton {
  constructor(selector, options = {}) {
    // Target element / Elemento objetivo
    this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;

    // Read data-* for declarative HTML initialization
    // Lee data-* para inicialización HTML declarativa
    const _ds = this._el?.dataset || {};
    const _fromHTML = {};
    if (_ds.label          !== undefined) _fromHTML.label          = _ds.label;
    if (_ds.confirmLabel   !== undefined) _fromHTML.confirmLabel   = _ds.confirmLabel;
    if (_ds.cancelLabel    !== undefined) _fromHTML.cancelLabel    = _ds.cancelLabel;
    if (_ds.variant        !== undefined) _fromHTML.variant        = _ds.variant;
    if (_ds.confirmVariant !== undefined) _fromHTML.confirmVariant = _ds.confirmVariant;
    if (_ds.size           !== undefined) _fromHTML.size           = _ds.size;
    if (_ds.timeout        !== undefined) _fromHTML.timeout        = parseInt(_ds.timeout);
    if (_ds.disabled       !== undefined) _fromHTML.disabled       = true;
    options = { ..._fromHTML, ...options };

    // Initial button label / Label del botón inicial
    this.label = options.label || 'Eliminar';

    // Label shown on the confirm button / Label del botón de confirmar
    this.confirmLabel = options.confirmLabel || '¿Confirmar?';

    // Label shown on the cancel button / Label del botón de cancelar
    this.cancelLabel = options.cancelLabel || 'No';

    // Initial button variant / Variante del botón inicial
    this.variant = options.variant || 'secondary';

    // Variant shown during confirmation / Variante al pedir confirmación
    this.confirmVariant = options.confirmVariant || 'danger';

    // Size: 'sm' | 'md' | 'lg' / Tamaño
    this.size = options.size || 'md';

    // Auto-cancel timeout in ms. 0 = no timeout / Timeout en ms. 0 = sin timeout
    this.timeout = options.timeout ?? 4000;

    // Left icon HTML / HTML del ícono izquierdo
    this.iconLeft = options.iconLeft || '';

    // Fires when user confirms / Se dispara cuando el usuario confirma
    this.onConfirm = options.onConfirm || null;

    // Fires when user cancels or timeout expires / Se dispara al cancelar o expirar el timeout
    this.onCancel = options.onCancel || null;

    this._pending      = false;
    this._timer        = null;
    this._barInterval  = null;
    this._build();
  }

  // Reset to initial state / Resetear al estado inicial
  reset()   { this._setPending(false); return this; }

  // Disable all buttons / Deshabilitar todos los botones
  disable() { this._el.querySelectorAll('button').forEach(b => b.disabled = true); return this; }

  // Enable all buttons / Habilitar todos los botones
  enable()  { this._el.querySelectorAll('button').forEach(b => b.disabled = false); return this; }

  _syncClasses() {
    const keep = Array.from(this._el.classList).filter(cls => !cls.startsWith('mts-confirmbutton'));
    this._el.className = keep.join(' ');
    this._el.classList.add('mts-confirmbutton');
  }

  _build() {
    this._el.innerHTML = '';
    this._syncClasses();

    this._btnMain = document.createElement('button');
    this._btnMain.type      = 'button';
    this._btnMain.className = 'mts-btn mts-btn--' + this.variant + ' mts-btn--' + this.size;
    if (this.iconLeft) {
      var _iconSpan = document.createElement('span');
      _iconSpan.className = 'mts-btn__icon';
      _iconSpan.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(this.iconLeft) : this.iconLeft;
      this._btnMain.appendChild(_iconSpan);
    }
    var _labelSpan = document.createElement('span');
    _labelSpan.textContent = this.label;
    this._btnMain.appendChild(_labelSpan);
    this._btnMain.addEventListener('click', () => this._setPending(true));
    this._el.appendChild(this._btnMain);

    this._group = document.createElement('div');
    this._group.className    = 'mts-confirmbutton__group';
    this._group.style.display = 'none';

    this._btnConfirm = document.createElement('button');
    this._btnConfirm.type      = 'button';
    this._btnConfirm.className = 'mts-btn mts-btn--' + this.confirmVariant + ' mts-btn--' + this.size;
    this._btnConfirm.textContent = this.confirmLabel;
    this._btnConfirm.addEventListener('click', () => {
      this._setPending(false);
      if (this.onConfirm) this.onConfirm();
    });

    this._btnCancel = document.createElement('button');
    this._btnCancel.type      = 'button';
    this._btnCancel.className = 'mts-btn mts-btn--ghost mts-btn--' + this.size;
    this._btnCancel.textContent = this.cancelLabel;
    this._btnCancel.addEventListener('click', () => {
      this._setPending(false);
      if (this.onCancel) this.onCancel();
    });

    this._bar = document.createElement('div');
    this._bar.className = 'mts-confirmbutton__bar';
    const fill = document.createElement('div');
    fill.className   = 'mts-confirmbutton__bar-fill';
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

      if (this.timeout > 0) {
        this._barFill.style.transition = 'none';
        this._barFill.style.width      = '100%';
        requestAnimationFrame(() => {
          this._barFill.style.transition = 'width ' + this.timeout + 'ms linear';
          this._barFill.style.width      = '0%';
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
      this._barFill.style.width   = '100%';
    }
  }
};
