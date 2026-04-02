/* ============================================================
   MATIOS UI — matios-ui-ratingreview.js
   MTS.RatingReview — Sistema de reseñas con breakdown
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.RatingReview = class MtsRatingReview {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {number}   options.average    Promedio (1-5) — default: 0
   * @param {number}   options.total      Total de reseñas
   * @param {object}   options.breakdown  { 5:n, 4:n, 3:n, 2:n, 1:n }
   * @param {boolean}  options.interactive Permite votar — default: false
   * @param {string}   options.size       'sm'|'md'|'lg' — default: 'md'
   * @param {function} options.onRate     (stars) => {}
   */
  constructor(selector, options = {}) {
    this._el       = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    this.average     = options.average     ?? 0;
    this.total       = options.total       ?? 0;
    this.breakdown   = options.breakdown   || { 5:0, 4:0, 3:0, 2:0, 1:0 };
    this.interactive = options.interactive ?? false;
    this.size        = options.size        || 'md';
    this.onRate      = options.onRate      || null;
    this._hover      = 0;
    this._selected   = 0;
    this._build();
  }

  update(opts) { Object.assign(this, opts); this._build(); return this; }

  _stars(count, size) {
    let out = '';
    for (let i = 1; i <= 5; i++) {
      const full  = count >= i;
      const half  = !full && count >= i - 0.5;
      const color = (full || half) ? 'var(--mts-color-warning,#f59e0b)' : 'var(--mts-border-color)';
      out += '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="' + (full ? color : 'none') + '" stroke="' + color + '" stroke-width="1.5">'
           + '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>'
           + (half ? '<clipPath id="h' + i + '"><rect x="0" y="0" width="12" height="24"/></clipPath><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="' + color + '" clip-path="url(#h' + i + ')"/>' : '')
           + '</svg>';
    }
    return out;
  }

  _build() {
    this._el.innerHTML = '';
    this._el.className = 'mts-ratingreview mts-ratingreview--' + this.size;

    /* Columna izquierda: score grande */
    const left = document.createElement('div');
    left.className = 'mts-ratingreview__score';
    const avg = document.createElement('div');
    avg.className = 'mts-ratingreview__avg';
    avg.textContent = this.average.toFixed(1);
    const starsEl = document.createElement('div');
    starsEl.className = 'mts-ratingreview__stars';
    starsEl.innerHTML = this._stars(this.average, this.size === 'lg' ? 20 : 16);
    const totalEl = document.createElement('div');
    totalEl.className = 'mts-ratingreview__total';
    totalEl.textContent = this.total.toLocaleString('es-CL') + ' reseñas';
    left.appendChild(avg);
    left.appendChild(starsEl);
    left.appendChild(totalEl);
    this._el.appendChild(left);

    /* Columna derecha: breakdown */
    const right = document.createElement('div');
    right.className = 'mts-ratingreview__breakdown';
    for (let s = 5; s >= 1; s--) {
      const count = this.breakdown[s] || 0;
      const pct   = this.total > 0 ? Math.round(count / this.total * 100) : 0;
      const row   = document.createElement('div');
      row.className = 'mts-ratingreview__row';
      row.innerHTML = '<span class="mts-ratingreview__row-stars">' + s + ' ★</span>'
                    + '<div class="mts-ratingreview__bar"><div class="mts-ratingreview__bar-fill" style="width:' + pct + '%"></div></div>'
                    + '<span class="mts-ratingreview__row-pct">' + pct + '%</span>';
      right.appendChild(row);
    }
    this._el.appendChild(right);

    /* Estrellas interactivas */
    if (this.interactive) {
      const iRow = document.createElement('div');
      iRow.className = 'mts-ratingreview__interactive';
      const lbl = document.createElement('span');
      lbl.className = 'mts-ratingreview__interactive-label';
      lbl.textContent = 'Tu calificación:';
      iRow.appendChild(lbl);
      const starsWrap = document.createElement('div');
      starsWrap.className = 'mts-ratingreview__interactive-stars';
      for (let s = 1; s <= 5; s++) {
        const star = document.createElement('button');
        star.type = 'button';
        star.className = 'mts-ratingreview__star-btn';
        star.dataset.val = s;
        star.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
        star.addEventListener('mouseenter', () => {
          this._hover = s;
          this._updateInteractive(starsWrap);
        });
        star.addEventListener('mouseleave', () => {
          this._hover = 0;
          this._updateInteractive(starsWrap);
        });
        star.addEventListener('click', () => {
          this._selected = s;
          if (this.onRate) this.onRate(s);
          this._el.dispatchEvent(new CustomEvent('mts:ratingreview:rate', { bubbles:true, detail:{ stars:s } }));
          this._updateInteractive(starsWrap);
        });
        starsWrap.appendChild(star);
      }
      this._updateInteractive(starsWrap);
      iRow.appendChild(starsWrap);
      this._el.appendChild(iRow);
    }
  }

  _updateInteractive(wrap) {
    const active = this._hover || this._selected;
    wrap.querySelectorAll('.mts-ratingreview__star-btn').forEach((btn, i) => {
      btn.classList.toggle('mts-ratingreview__star-btn--active', i < active);
    });
  }
};
