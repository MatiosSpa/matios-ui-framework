/* ============================================================
   MATIOS UI — matios-ui-tooltip.js
   MTS.Tooltip — Tooltip con posicionamiento inteligente
   Eventos DOM: mts:tooltip:show | mts:tooltip:hide
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Tooltip = class MtsTooltip {
  /**
   * @param {string|Element} target   Elemento que dispara el tooltip
   * @param {object} options
   * @param {string}   options.content    HTML o texto del tooltip
   * @param {string}   options.position   'top'|'bottom'|'left'|'right' — default: 'top'
   * @param {string}   options.trigger    'hover'|'click'|'focus' — default: 'hover'
   * @param {number}   options.delay      ms antes de mostrar — default: 0
   * @param {number}   options.hideDelay  ms antes de ocultar — default: 0
   * @param {number}   options.offset     px de separación — default: 8
   * @param {string}   options.variant    'dark'|'light' — default: 'dark'
   * @param {number}   options.maxWidth   px — default: 220
   */
  constructor(target, options = {}) {
    this._target   = typeof target === 'string' ? document.querySelector(target) : target;
    if (!this._target) return;
    this.content   = options.content   || '';
    this.position  = options.position  || 'top';
    this.triggerOn = options.trigger   || 'hover';
    this.delay     = options.delay     ?? 0;
    this.hideDelay = options.hideDelay ?? 0;
    this.offset    = options.offset    ?? 8;
    this.variant   = options.variant   || 'dark';
    this.maxWidth  = options.maxWidth  ?? 220;
    this._isVisible = false;
    this._showTimer = null;
    this._hideTimer = null;
    this._listeners = {};
    this._build();
    this._bindEvents();
  }

  show() {
    clearTimeout(this._hideTimer);
    this._showTimer = setTimeout(() => {
      if (this._isVisible) return;
      this._isVisible = true;
      this._tooltipEl.removeAttribute('hidden');
      this._tooltipEl.innerHTML = this.content;
      this._position();
      requestAnimationFrame(() => this._tooltipEl.classList.add('mts-tooltip--visible'));
      this._emit('show', {});
    }, this.delay);
    return this;
  }

  hide() {
    clearTimeout(this._showTimer);
    this._hideTimer = setTimeout(() => {
      if (!this._isVisible) return;
      this._isVisible = false;
      this._tooltipEl.classList.remove('mts-tooltip--visible');
      setTimeout(() => this._tooltipEl.setAttribute('hidden', ''), 150);
      this._emit('hide', {});
    }, this.hideDelay);
    return this;
  }

  setContent(html) { this.content = html; if (this._isVisible) { this._tooltipEl.innerHTML = html; this._position(); } return this; }
  destroy()        { this._tooltipEl?.remove(); this._unbindEvents(); }
  on(e, cb)        { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }

  _build() {
    this._tooltipEl = document.createElement('div');
    this._tooltipEl.className = `mts-tooltip mts-tooltip--${this.variant}`;
    this._tooltipEl.setAttribute('role', 'tooltip');
    this._tooltipEl.setAttribute('hidden', '');
    this._tooltipEl.style.maxWidth = `${this.maxWidth}px`;
    document.body.appendChild(this._tooltipEl);
    this._target.setAttribute('aria-describedby', this._tooltipEl.id = `mts-tt-${Date.now()}`);
  }

  _position() {
    const tr = this._target.getBoundingClientRect();
    const tt = this._tooltipEl.getBoundingClientRect();
    const s  = { x: window.scrollX, y: window.scrollY };
    let pos  = this.position;
    let top, left;

    // Calcular posición
    const positions = {
      top:    { top: tr.top + s.y - tt.height - this.offset,        left: tr.left + s.x + tr.width / 2 - tt.width / 2 },
      bottom: { top: tr.bottom + s.y + this.offset,                  left: tr.left + s.x + tr.width / 2 - tt.width / 2 },
      left:   { top: tr.top + s.y + tr.height / 2 - tt.height / 2,  left: tr.left + s.x - tt.width - this.offset },
      right:  { top: tr.top + s.y + tr.height / 2 - tt.height / 2,  left: tr.right + s.x + this.offset },
    };

    // Flip si sale de pantalla
    if (pos === 'top'    && tr.top    < tt.height + this.offset) pos = 'bottom';
    if (pos === 'bottom' && tr.bottom > window.innerHeight - tt.height - this.offset) pos = 'top';
    if (pos === 'left'   && tr.left   < tt.width + this.offset)  pos = 'right';
    if (pos === 'right'  && tr.right  > window.innerWidth - tt.width - this.offset)   pos = 'left';

    ({ top, left } = positions[pos]);
    left = Math.max(8, Math.min(left, window.innerWidth + s.x - tt.width - 8));

    this._tooltipEl.style.top  = `${top}px`;
    this._tooltipEl.style.left = `${left}px`;
    this._tooltipEl.dataset.position = pos;
  }

  _bindEvents() {
    if (this.triggerOn === 'hover') {
      this._target.addEventListener('mouseenter', this._onShow = () => this.show());
      this._target.addEventListener('mouseleave', this._onHide = () => this.hide());
      this._tooltipEl.addEventListener('mouseenter', () => clearTimeout(this._hideTimer));
      this._tooltipEl.addEventListener('mouseleave', () => this.hide());
    } else if (this.triggerOn === 'focus') {
      this._target.addEventListener('focus',  this._onShow = () => this.show());
      this._target.addEventListener('blur',   this._onHide = () => this.hide());
    } else {
      this._target.addEventListener('click',  this._onShow = () => this._isVisible ? this.hide() : this.show());
      document.addEventListener('click', this._docClick = (e) => { if (!this._target.contains(e.target)) this.hide(); });
    }
    document.addEventListener('keydown', this._onEsc = (e) => { if (e.key === 'Escape') this.hide(); });
    window.addEventListener('scroll', this._onScroll = () => { if (this._isVisible) this._position(); }, true);
    window.addEventListener('resize', this._onResize = () => { if (this._isVisible) this._position(); });
  }

  _unbindEvents() {
    this._target.removeEventListener('mouseenter', this._onShow);
    this._target.removeEventListener('mouseleave', this._onHide);
    this._target.removeEventListener('focus',  this._onShow);
    this._target.removeEventListener('blur',   this._onHide);
    this._target.removeEventListener('click',  this._onShow);
    document.removeEventListener('keydown', this._onEsc);
    document.removeEventListener('click',   this._docClick);
    window.removeEventListener('scroll', this._onScroll, true);
    window.removeEventListener('resize', this._onResize);
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._target.dispatchEvent(new CustomEvent(`mts:tooltip:${event}`, { bubbles: true, detail }));
  }

  /* Inicialización masiva via data attributes */
  static initAll(selector = '[data-mts-tooltip]') {
    document.querySelectorAll(selector).forEach(el => {
      new MTS.Tooltip(el, {
        content:  el.dataset.mtsTooltip,
        position: el.dataset.mtsTooltipPosition || 'top',
        trigger:  el.dataset.mtsTooltipTrigger  || 'hover',
        variant:  el.dataset.mtsTooltipVariant  || 'dark',
      });
    });
  }
};
