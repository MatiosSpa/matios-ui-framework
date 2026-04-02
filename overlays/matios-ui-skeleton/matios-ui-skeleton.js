/* ============================================================
   MATIOS UI — matios-ui-skeleton.js
   MTS.Skeleton — Placeholder animado de carga
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Skeleton = class MtsSkeleton {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {string}   options.variant  'text'|'circle'|'rect'|'card'|'table'|'list' — default: 'text'
   * @param {number}   options.lines    Líneas para variant 'text' — default: 3
   * @param {number}   options.rows     Filas para variant 'table' — default: 4
   * @param {number}   options.cols     Columnas para variant 'table' — default: 4
   * @param {number}   options.items    Items para variant 'list' — default: 3
   * @param {string}   options.width    Ancho CSS — default: '100%'
   * @param {string}   options.height   Alto CSS — default: auto
   * @param {string}   options.animation 'pulse'|'wave'|'none' — default: 'pulse'
   */
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) return;
    this.variant   = options.variant   || 'text';
    this.lines     = options.lines     ?? 3;
    this.rows      = options.rows      ?? 4;
    this.cols      = options.cols      ?? 4;
    this.items     = options.items     ?? 3;
    this.width     = options.width     || '100%';
    this.height    = options.height    || null;
    this.animation = options.animation || 'pulse';
    this._build();
  }

  show()    { this._el.style.display = ''; return this; }
  hide()    { this._el.style.display = 'none'; return this; }
  destroy() { this._el.innerHTML = ''; }

  _bone(w = '100%', h = '16px', br = '4px') {
    const el = document.createElement('div');
    el.className = `mts-skeleton__bone mts-skeleton__bone--${this.animation}`;
    el.style.width = w; el.style.height = h; el.style.borderRadius = br;
    return el;
  }

  _build() {
    this._el.innerHTML = '';
    this._el.className = 'mts-skeleton';
    if (this.width)  this._el.style.width  = this.width;
    if (this.height) this._el.style.height = this.height;

    switch (this.variant) {

      case 'circle':
        this._el.appendChild(this._bone(this.height||'48px', this.height||'48px', '50%'));
        break;

      case 'rect':
        this._el.appendChild(this._bone('100%', this.height||'120px', 'var(--mts-radius-md)'));
        break;

      case 'text': {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
        for (let i = 0; i < this.lines; i++) {
          const w = i === this.lines - 1 ? '65%' : (i % 2 === 0 ? '100%' : '88%');
          wrap.appendChild(this._bone(w, '14px'));
        }
        this._el.appendChild(wrap);
        break;
      }

      case 'card': {
        const card = document.createElement('div');
        card.style.cssText = 'display:flex;flex-direction:column;gap:12px;padding:16px;background:var(--mts-bg-surface);border:1px solid var(--mts-border-color);border-radius:var(--mts-radius-lg);';
        /* Imagen */
        card.appendChild(this._bone('100%', '160px', 'var(--mts-radius-md)'));
        /* Título */
        card.appendChild(this._bone('60%', '18px'));
        /* Líneas */
        const lines = document.createElement('div');
        lines.style.cssText = 'display:flex;flex-direction:column;gap:6px;';
        lines.appendChild(this._bone('100%', '12px'));
        lines.appendChild(this._bone('80%',  '12px'));
        card.appendChild(lines);
        /* Footer */
        const foot = document.createElement('div');
        foot.style.cssText = 'display:flex;justify-content:space-between;align-items:center;';
        foot.appendChild(this._bone('80px', '28px', 'var(--mts-radius-full)'));
        foot.appendChild(this._bone('60px', '28px', 'var(--mts-radius-md)'));
        card.appendChild(foot);
        this._el.appendChild(card);
        break;
      }

      case 'list': {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;flex-direction:column;gap:12px;';
        for (let i = 0; i < this.items; i++) {
          const row = document.createElement('div');
          row.style.cssText = 'display:flex;align-items:center;gap:12px;';
          row.appendChild(this._bone('40px', '40px', '50%'));
          const info = document.createElement('div');
          info.style.cssText = 'flex:1;display:flex;flex-direction:column;gap:6px;';
          info.appendChild(this._bone('55%', '14px'));
          info.appendChild(this._bone('35%', '11px'));
          row.appendChild(info);
          row.appendChild(this._bone('60px', '11px'));
          wrap.appendChild(row);
        }
        this._el.appendChild(wrap);
        break;
      }

      case 'table': {
        const table = document.createElement('div');
        table.style.cssText = 'display:flex;flex-direction:column;gap:0;';
        /* Header */
        const header = document.createElement('div');
        header.style.cssText = `display:grid;grid-template-columns:repeat(${this.cols},1fr);gap:12px;padding:10px 14px;background:var(--mts-bg-surface-2);border-radius:var(--mts-radius-md) var(--mts-radius-md) 0 0;border:1px solid var(--mts-border-color);border-bottom:none;`;
        for (let c = 0; c < this.cols; c++) header.appendChild(this._bone('80%', '12px'));
        table.appendChild(header);
        /* Rows */
        for (let r = 0; r < this.rows; r++) {
          const row = document.createElement('div');
          row.style.cssText = `display:grid;grid-template-columns:repeat(${this.cols},1fr);gap:12px;padding:12px 14px;border:1px solid var(--mts-border-color);border-bottom:${r===this.rows-1?'1px':'none'} solid var(--mts-border-color);${r===this.rows-1?'border-radius:0 0 var(--mts-radius-md) var(--mts-radius-md);':''}`;
          for (let c = 0; c < this.cols; c++) {
            row.appendChild(this._bone(c === 0 ? '90%' : `${55 + Math.random()*35|0}%`, '13px'));
          }
          table.appendChild(row);
        }
        this._el.appendChild(table);
        break;
      }

      default:
        this._el.appendChild(this._bone('100%', this.height||'16px'));
    }
  }
};
