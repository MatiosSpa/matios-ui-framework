/* ============================================================
   MATIOS UI — matios-ui-timeline.js
   MTS.Timeline — Línea de tiempo vertical/horizontal
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Timeline = class MtsTimeline {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {Array}    options.events    [{ id, title, description?, date?, icon?, color?, badge? }]
   * @param {string}   options.direction 'vertical'|'horizontal' — default: 'vertical'
   * @param {string}   options.align     'left'|'right'|'alternate' — default: 'left' (solo vertical)
   * @param {function} options.onEventClick
   */
  constructor(selector, options = {}) {
    this._el       = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    this.events    = options.events    || [];
    this.direction = options.direction || 'vertical';
    this.align     = options.align     || 'left';
    this.onEventClick = options.onEventClick || null;
    this._build();
  }

  setEvents(events) { this.events = events; this._build(); return this; }
  addEvent(event)   { this.events.push(event); this._build(); return this; }

  _build() {
    this._el.className = `mts-timeline mts-timeline--${this.direction} mts-timeline--${this.align}`;
    this._el.innerHTML = '';

    this.events.forEach((ev, idx) => {
      const item = document.createElement('div');
      item.className = 'mts-timeline__item';
      if (this.onEventClick) { item.classList.add('mts-timeline__item--clickable'); item.addEventListener('click', () => this.onEventClick(ev, idx)); }

      // Punto/ícono
      const dot = document.createElement('div');
      dot.className = 'mts-timeline__dot';
      if (ev.color) dot.style.background = ev.color;
      if (ev.icon) { dot.innerHTML = ev.icon; dot.classList.add('mts-timeline__dot--icon'); }

      // Contenido
      const content = document.createElement('div');
      content.className = 'mts-timeline__content';

      if (ev.date || ev.badge) {
        const meta = document.createElement('div');
        meta.className = 'mts-timeline__meta';
        if (ev.badge) { const b = document.createElement('span'); b.className = `mts-badge mts-badge--${ev.badge.variant || 'default'} mts-badge--sm`; b.textContent = ev.badge.label; meta.appendChild(b); }
        if (ev.date) { const d = document.createElement('span'); d.className = 'mts-timeline__date'; d.textContent = ev.date; meta.appendChild(d); }
        content.appendChild(meta);
      }

      const title = document.createElement('div');
      title.className = 'mts-timeline__title';
      title.textContent = ev.title;
      content.appendChild(title);

      if (ev.description) {
        const desc = document.createElement('div');
        desc.className = 'mts-timeline__description';
        desc.innerHTML = ev.description;
        content.appendChild(desc);
      }

      item.appendChild(dot);
      item.appendChild(content);
      this._el.appendChild(item);
    });
  }
};
