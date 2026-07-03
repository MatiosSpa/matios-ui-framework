/* ============================================================
   MATIOS UI — matios-ui-copybutton.js
   MTS.CopyButton — Copy-to-clipboard button with visual feedback
   Version: 1.1.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.CopyButton = class MtsCopyButton {
  constructor(selector, options = {}) {
    // Target element / Elemento objetivo
    this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) { console.error('[MTS.CopyButton] Not found / No encontrado:', selector); return; }

    // Read data-* for declarative HTML initialization
    // Lee data-* para inicialización HTML declarativa
    const _ds = this._el?.dataset || {};
    const _fromHTML = {};
    if (_ds.text        !== undefined) _fromHTML.text        = _ds.text;
    if (_ds.target      !== undefined) _fromHTML.target      = _ds.target;
    if (_ds.label       !== undefined) _fromHTML.label       = _ds.label;
    if (_ds.labelCopied !== undefined) _fromHTML.labelCopied = _ds.labelCopied;
    if (_ds.variant     !== undefined) _fromHTML.variant     = _ds.variant;
    if (_ds.size        !== undefined) _fromHTML.size        = _ds.size;
    if (_ds.iconOnly    !== undefined) _fromHTML.iconOnly    = true;
    if (_ds.resetDelay  !== undefined) _fromHTML.resetDelay  = parseInt(_ds.resetDelay);
    options = { ..._fromHTML, ...options };

    // Static text to copy / Texto estático a copiar
    this.text = options.text ?? null;

    // Selector/element whose value or textContent to copy
    // Selector/elemento cuyo value o textContent copiar
    this.target = options.target ?? null;

    // Button label / Label del botón
    this.label = options.label ?? this._t('copy', 'Copy');

    // Label shown after copying / Label mostrado tras copiar
    this.labelCopied = options.labelCopied ?? this._t('copied', 'Copied!');

    // Default icon SVG / SVG del ícono por defecto
    this.icon = options.icon ?? this._defaultIcon();

    // Icon shown after copying / Ícono mostrado tras copiar
    this.iconCopied = options.iconCopied ?? this._checkIcon();

    // Button variant / Variante del botón
    this.variant = options.variant ?? 'secondary';

    // Size: 'sm' | '' | 'lg' / Tamaño
    this.size = options.size ?? '';

    // Icon only mode / Modo solo ícono
    this.iconOnly = options.iconOnly ?? false;

    // Delay in ms before resetting to initial state / Delay en ms antes de resetear
    this.resetDelay = options.resetDelay ?? 2000;

    this._listeners = {};
    // Fires after text is copied: ({ text }) => {} / Se dispara tras copiar el texto
    if (options.onCopy) this.on('copy', options.onCopy);

    this._copied = false;
    this._timer  = null;
    this._build();
  }

  // Change the text to copy / Cambiar el texto a copiar
  setText(text) { this.text = text; return this; }

  // Trigger copy programmatically / Disparar copia programáticamente
  copy() { this._doCopy(); return this; }

  // Destroy the component / Destruir el componente
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }
  destroy()  { this._el.innerHTML = ''; }

  /* Localized chrome lookup — MTS.CopyButton → messages namespace; English fallback. */
  _t(key, fallback) {
    try {
      const ns = (typeof window !== 'undefined' && window.MTS && MTS.getString) ? MTS.getString()['MTS.CopyButton'] : null;
      const m  = ns && ns.messages;
      if (m && m[key] != null) return m[key];
    } catch (e) {}
    return fallback;
  }

  _build() {
    this._syncClasses();
    this._el.setAttribute('type', 'button');
    this._renderState(false);
    if (!this._handleClick) this._handleClick = () => this._doCopy();
    this._el.removeEventListener('click', this._handleClick);
    this._el.addEventListener('click', this._handleClick);
  }

  _syncClasses() {
    const previousMatiosClasses = [...this._el.classList].filter(cls =>
      cls === 'mts-btn' || cls.startsWith('mts-btn--')
    );
    if (previousMatiosClasses.length) this._el.classList.remove(...previousMatiosClasses);

    const classes = ['mts-btn', 'mts-btn--' + this.variant];
    if (this.size)     classes.push('mts-btn--' + this.size);
    if (this.iconOnly) classes.push('mts-btn--icon');
    this._el.classList.add(...classes);
  }

  _renderState(copied) {
    this._el.innerHTML = '';
    const ic = document.createElement('span');
    ic.className = 'mts-btn__icon-left';
    let _icon = copied ? this.iconCopied : this.icon;
    ic.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(_icon) : _icon;
    this._el.appendChild(ic);
    if (!this.iconOnly) {
      const lbl = document.createElement('span');
      lbl.className   = 'mts-btn__label';
      lbl.textContent = copied ? this.labelCopied : this.label;
      this._el.appendChild(lbl);
    }
  }

  async _doCopy() {
    if (this._copied) return;
    let text = this.text;

    if (!text && this.target) {
      const el = typeof this.target === 'string'
        ? document.querySelector(this.target)
        : this.target;
      if (el) text = el.value !== undefined ? el.value : el.textContent;
    }

    if (!text) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity  = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      this._copied = true;
      this._renderState(true);
      this._el.classList.add('mts-copybutton--copied');
      this._emit('copy', { text });
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        this._copied = false;
        this._renderState(false);
        this._el.classList.remove('mts-copybutton--copied');
      }, this.resetDelay);
    } catch (e) {
      console.error('[MTS.CopyButton] Copy failed / Error al copiar:', e);
    }
  }

  _defaultIcon() {
    return MTS.Icon.get('copy');
  }

  _checkIcon() {
    return MTS.Icon.get('check');
  }
  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el?.dispatchEvent(new CustomEvent(`mts:copybutton:${event}`, { bubbles: true, detail }));
  }
};

