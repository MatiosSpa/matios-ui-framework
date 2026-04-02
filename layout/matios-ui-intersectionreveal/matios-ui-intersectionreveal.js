/* ============================================================
   MATIOS UI — matios-ui-intersectionreveal.js
   MTS.IntersectionReveal — Anima elementos al entrar al viewport
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.IntersectionReveal = class MtsIntersectionReveal {
  /**
   * @param {string|NodeList|Array} selector  Selector CSS o colección de elementos
   * @param {object} options
   * @param {string}  options.animation  'fade'|'fade-up'|'fade-down'|'fade-left'|'fade-right'|'zoom'|'flip' — default: 'fade-up'
   * @param {number}  options.duration   ms — default: 600
   * @param {number}  options.delay      ms de delay base — default: 0
   * @param {number}  options.stagger    ms entre cada elemento — default: 0
   * @param {string}  options.easing     CSS easing — default: 'cubic-bezier(.4,0,.2,1)'
   * @param {number}  options.threshold  0-1 qué fracción debe ser visible — default: 0.15
   * @param {boolean} options.once       Animar solo la primera vez — default: true
   * @param {function} options.onReveal  (element, index) => {}
   */
  constructor(selector, options = {}) {
    this.animation = options.animation || 'fade-up';
    this.duration  = options.duration  ?? 600;
    this.delay     = options.delay     ?? 0;
    this.stagger   = options.stagger   ?? 0;
    this.easing    = options.easing    || 'cubic-bezier(.4,0,.2,1)';
    this.threshold = options.threshold ?? 0.15;
    this.once      = options.once      ?? true;
    this.onReveal  = options.onReveal  || null;

    /* Recoger elementos */
    let els;
    if (typeof selector === 'string') {
      els = [...document.querySelectorAll(selector)];
    } else if (selector instanceof NodeList || Array.isArray(selector)) {
      els = [...selector];
    } else {
      els = [selector];
    }
    this._els = els;
    this._init();
  }

  destroy() { if (this._observer) this._observer.disconnect(); }

  /* Revelar todos inmediatamente (sin animación) */
  revealAll() {
    this._els.forEach(el => { el.style.opacity = ''; el.style.transform = ''; el.style.transition = ''; });
    this.destroy();
    return this;
  }

  _init() {
    const hidden = this._hiddenStyles();

    this._els.forEach((el, i) => {
      Object.assign(el.style, hidden);
      el.dataset.mtsRevealIdx = i;
    });

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el  = entry.target;
        const idx = +el.dataset.mtsRevealIdx;
        const del = this.delay + idx * this.stagger;
        el.style.transition = `opacity ${this.duration}ms ${this.easing} ${del}ms, transform ${this.duration}ms ${this.easing} ${del}ms`;
        el.style.opacity    = '1';
        el.style.transform  = 'none';
        if (this.onReveal) this.onReveal(el, idx);
        el.dispatchEvent(new CustomEvent('mts:reveal', { bubbles:true, detail:{ index:idx } }));
        if (this.once) this._observer.unobserve(el);
      });
    }, { threshold: this.threshold });

    this._els.forEach(el => this._observer.observe(el));
  }

  _hiddenStyles() {
    const anim = this.animation;
    const base = { opacity:'0', transition:'none' };
    if (anim === 'fade')       return { ...base, transform:'none' };
    if (anim === 'fade-up')    return { ...base, transform:'translateY(24px)' };
    if (anim === 'fade-down')  return { ...base, transform:'translateY(-24px)' };
    if (anim === 'fade-left')  return { ...base, transform:'translateX(24px)' };
    if (anim === 'fade-right') return { ...base, transform:'translateX(-24px)' };
    if (anim === 'zoom')       return { ...base, transform:'scale(0.9)' };
    if (anim === 'flip')       return { ...base, transform:'rotateX(-20deg)', transformOrigin:'top' };
    return base;
  }
};
