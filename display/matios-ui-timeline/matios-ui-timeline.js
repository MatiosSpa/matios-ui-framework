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
    // Timeline events: [{ id, title, description?, date?, icon?, color?, badge? }]
    // Eventos de la timeline
    this.events = options.events || [];

    // Layout direction: 'vertical' | 'horizontal' / Dirección del layout
    this.direction = options.direction || 'vertical';

    // Alignment (vertical only): 'left' | 'right' | 'alternate' / Alineación (solo vertical)
    this.align = options.align || 'left';

    this._listeners = {};

    // Fires when an event item is clicked: ({ event, index }) => {}
    // Se dispara al hacer click en un ítem de la timeline
    if (options.onEventClick) this.on('eventclick', options.onEventClick);

    this._build();
  }

  setEvents(events) { this.events = events; this._build(); return this; }
  addEvent(event)   { this.events.push(event); this._build(); return this; }
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }

  _build() {
    this._el.className = `mts-timeline mts-timeline--${this.direction} mts-timeline--${this.align}`;
    this._el.innerHTML = '';

    this.events.forEach((ev, idx) => {
      const item = document.createElement('div');
      item.className = 'mts-timeline__item';
      if (this._listeners['eventclick']?.length) {
        item.classList.add('mts-timeline__item--clickable');
        item.addEventListener('click', () => this._emit('eventclick', { event: ev, index: idx }));
      }

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
  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el?.dispatchEvent(new CustomEvent(`mts:timeline:${event}`, { bubbles: true, detail }));
  }
};
