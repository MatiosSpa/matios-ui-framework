/* ============================================================
   MATIOS UI — matios-ui-skeleton.js
   MTS.Skeleton — Placeholder animado de carga
   Eventos DOM: —
   Version: 2.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Skeleton = class MtsSkeleton {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {string}  options.variant   'text'|'circle'|'rect'|'card'|'table'|'list' — default: 'text'
   * @param {number}  options.lines     Líneas de texto (variant 'text') — default: 3
   * @param {number}  options.rows      Filas (variant 'table') — default: 4
   * @param {number}  options.cols      Columnas (variant 'table') — default: 4
   * @param {number}  options.items     Ítems (variant 'list') — default: 3
   * @param {string}  options.width     Ancho CSS del contenedor — default: '100%'
   * @param {string}  options.height    Alto CSS del contenedor — default: auto
   * @param {string}  options.animation 'pulse'|'wave'|'none' — default: 'pulse'
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

  /* ── API ── */
  show()    { this._el.style.display = ''; return this; }
  hide()    { this._el.style.display = 'none'; return this; }
  destroy() { this._el.replaceChildren(); }

  /* ── Internos ── */

  _syncClasses() {
    // Conservar clases externas (no-skeleton) / Keep external (non-skeleton) classes
    const keep = Array.from(this._el.classList).filter(cls => !cls.startsWith('mts-skeleton'));
    this._el.className = keep.join(' ');
    this._el.classList.add('mts-skeleton');
    this._el.classList.add('mts-skeleton--' + this.variant);
  }

  // Crea un hueso animado con dimensiones dinámicas
  // Creates an animated bone with dynamic dimensions
  _bone(w = '100%', h = '16px', br = '4px') {
    const el = document.createElement('div');
    el.className = 'mts-skeleton__bone mts-skeleton__bone--' + this.animation;
    el.style.width        = w;
    el.style.height       = h;
    el.style.borderRadius = br;
    return el;
  }

  _build() {
    this._el.replaceChildren();
    this._syncClasses();
    if (this.width)  this._el.style.width  = this.width;
    if (this.height) this._el.style.height = this.height;

    switch (this.variant) {

      case 'circle':
        this._el.appendChild(this._bone(this.height || '48px', this.height || '48px', '50%'));
        break;

      case 'rect':
        this._el.appendChild(this._bone('100%', this.height || '120px', 'var(--mts-radius-md)'));
        break;

      case 'text': {
        const wrap = document.createElement('div');
        wrap.className = 'mts-skeleton__text';
        for (let i = 0; i < this.lines; i++) {
          // Última línea más corta, alternando ancho entre líneas
          // Last line shorter, alternating width between lines
          const w = i === this.lines - 1 ? '65%' : (i % 2 === 0 ? '100%' : '88%');
          wrap.appendChild(this._bone(w, '14px'));
        }
        this._el.appendChild(wrap);
        break;
      }

      case 'card': {
        const card = document.createElement('div');
        card.className = 'mts-skeleton__card';

        card.appendChild(this._bone('100%', '160px', 'var(--mts-radius-md)')); // imagen / image
        card.appendChild(this._bone('60%', '18px'));                            // título / title

        const lines = document.createElement('div');
        lines.className = 'mts-skeleton__card-lines';
        lines.appendChild(this._bone('100%', '12px'));
        lines.appendChild(this._bone('80%',  '12px'));
        card.appendChild(lines);

        const foot = document.createElement('div');
        foot.className = 'mts-skeleton__card-footer';
        foot.appendChild(this._bone('80px', '28px', 'var(--mts-radius-full)'));
        foot.appendChild(this._bone('60px', '28px', 'var(--mts-radius-md)'));
        card.appendChild(foot);

        this._el.appendChild(card);
        break;
      }

      case 'list': {
        const wrap = document.createElement('div');
        wrap.className = 'mts-skeleton__list';

        for (let i = 0; i < this.items; i++) {
          const item = document.createElement('div');
          item.className = 'mts-skeleton__list-item';

          item.appendChild(this._bone('40px', '40px', '50%')); // avatar

          const info = document.createElement('div');
          info.className = 'mts-skeleton__list-info';
          info.appendChild(this._bone('55%', '14px'));
          info.appendChild(this._bone('35%', '11px'));
          item.appendChild(info);

          item.appendChild(this._bone('60px', '11px')); // valor derecho / right value
          wrap.appendChild(item);
        }
        this._el.appendChild(wrap);
        break;
      }

      case 'table': {
        const table = document.createElement('div');
        table.className = 'mts-skeleton__table';

        // Header — grid-template-columns es dinámico, el resto va en CSS
        // Header — grid-template-columns is dynamic, rest lives in CSS
        const header = document.createElement('div');
        header.className = 'mts-skeleton__table-header';
        header.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        for (let c = 0; c < this.cols; c++) {
          header.appendChild(this._bone('80%', '12px'));
        }
        table.appendChild(header);

        // Filas / Rows
        for (let r = 0; r < this.rows; r++) {
          const row = document.createElement('div');
          row.className = 'mts-skeleton__table-row';
          row.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
          for (let c = 0; c < this.cols; c++) {
            // Primera columna más ancha, resto aleatorio para aspecto natural
            // First column wider, rest random for natural appearance
            const w = c === 0 ? '90%' : (55 + Math.floor(Math.random() * 35)) + '%';
            row.appendChild(this._bone(w, '13px'));
          }
          table.appendChild(row);
        }
        this._el.appendChild(table);
        break;
      }

      default:
        this._el.appendChild(this._bone('100%', this.height || '16px'));
    }
  }
};
