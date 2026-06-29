/* ============================================================
   MATIOS UI — matios-ui-lightbox.js
   MTS.Lightbox — Visor de medios con navegación y zoom
   Soporta: imágenes, video HTML5, YouTube, Vimeo
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.Lightbox = class MtsLightbox {
  /**
   * @param {Array|string} items    Array de items O selector CSS (auto-detecta data-lightbox)
   * @param {object} options
   *
   * Item:
   * { src, type?: 'image'|'video'|'youtube'|'vimeo', alt?, caption?, thumb? }
   *
   * @param {number}   options.index       Índice inicial — default: 0
   * @param {boolean}  options.loop        Loop infinito — default: true
   * @param {boolean}  options.zoom        Permite zoom en imágenes — default: true
   * @param {boolean}  options.download    Botón de descarga — default: false
   * @param {boolean}  options.counter     Muestra contador — default: true
   * @param {boolean}  options.thumbnails  Muestra tira de miniaturas — default: false
   * @param {string}   options.animation   'fade'|'slide' — default: 'fade'
   * @param {function} options.onOpen      ({ item, index }) => {}
   * @param {function} options.onClose     () => {}
   * @param {function} options.onChange    ({ item, index }) => {}
   */
  constructor(items, options = {}) {
    /* Si es selector CSS, recoger items desde atributos data-* */
    if (typeof items === 'string') {
      const els = [...document.querySelectorAll(items)];
      this._items = els.map(el => ({
        src:     el.dataset.src     || el.href || el.src || '',
        type:    el.dataset.type    || 'image',
        caption: el.dataset.caption || el.title || '',
        alt:     el.dataset.alt     || '',
        thumb:   el.dataset.thumb   || el.querySelector('img')?.src || '',
      }));
      /* Auto-bind click en cada elemento */
      els.forEach((el, idx) => {
        el.addEventListener('click', (e) => { e.preventDefault(); this.open(idx); });
      });
    } else {
      this._items = items || [];
    }

    // Infinite loop navigation / Navegación en loop infinito
    this.loop = options.loop ?? true;

    // Allow zoom on images / Permitir zoom en imágenes
    this.zoom = options.zoom ?? true;

    // Show download button / Mostrar botón de descarga
    this.download = options.download ?? false;

    // Show item counter / Mostrar contador de ítems
    this.counter = options.counter ?? true;

    // Show thumbnails strip / Mostrar tira de miniaturas
    this.thumbnails = options.thumbnails ?? false;

    // Transition animation: 'fade' | 'slide' / Animación de transición
    this.animation = options.animation || 'fade';

    // Initially active index / Índice activo inicial
    this._idx = options.index ?? 0;

    this._el        = null;
    this._zoomed    = false;
    this._zoomScale = 1;
    this._listeners = {};

    // Fires when lightbox opens: ({ item, index }) => {} / Se dispara al abrir
    if (options.onOpen)   this.on('open',   options.onOpen);

    // Fires when lightbox closes / Se dispara al cerrar
    if (options.onClose)  this.on('close',  options.onClose);

    // Fires when active item changes: ({ item, index }) => {} / Se dispara al cambiar el ítem activo
    if (options.onChange) this.on('change', options.onChange);
  }

  /* ── API ── */
  open(index)  { this._idx = index ?? 0; this._render(); return this; }
  close()      { this._destroy(); return this; }
  next()       { this._nav(1);  return this; }
  prev()       { this._nav(-1); return this; }
  goTo(index)  { this._idx = index; this._updateMedia(); this._updateUI(); return this; }
  addItems(items) { this._items = this._items.concat(items); return this; }
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }
  destroy()  { this._destroy(); }

  _render() {
    this._destroy();
    const lb = document.createElement('div');
    lb.className = 'mts-lb';
    lb.addEventListener('click', (e) => { if (e.target === lb || e.target === this._mediaWrap) this._destroy(); });

    /* Toolbar superior */
    const toolbar = document.createElement('div');
    toolbar.className = 'mts-lb__toolbar';

    if (this.counter) {
      this._counterEl = document.createElement('span');
      this._counterEl.className = 'mts-lb__counter';
      toolbar.appendChild(this._counterEl);
    }

    const actions = document.createElement('div');
    actions.className = 'mts-lb__actions';

    if (this.download) {
      const dlBtn = document.createElement('a');
      dlBtn.className = 'mts-lb__btn';
      dlBtn.download = '';
      dlBtn.innerHTML = MTS.Icon.get('download');
      this._dlBtn = dlBtn;
      actions.appendChild(dlBtn);
    }

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'mts-lb__btn';
    closeBtn.innerHTML = MTS.Icon.get('close');
    closeBtn.addEventListener('click', () => this._destroy());
    actions.appendChild(closeBtn);
    toolbar.appendChild(actions);
    lb.appendChild(toolbar);

    /* Área de media */
    this._mediaWrap = document.createElement('div');
    this._mediaWrap.className = 'mts-lb__media-wrap';
    lb.appendChild(this._mediaWrap);

    /* Nav prev/next */
    if (this._items.length > 1) {
      const prev = document.createElement('button');
      prev.type = 'button'; prev.className = 'mts-lb__nav mts-lb__nav--prev';
      prev.innerHTML = MTS.Icon.get('chevron-left');
      prev.addEventListener('click', (e) => { e.stopPropagation(); this._nav(-1); });
      lb.appendChild(prev);

      const next = document.createElement('button');
      next.type = 'button'; next.className = 'mts-lb__nav mts-lb__nav--next';
      next.innerHTML = MTS.Icon.get('chevron-right');
      next.addEventListener('click', (e) => { e.stopPropagation(); this._nav(1); });
      lb.appendChild(next);
    }

    /* Caption */
    this._captionEl = document.createElement('div');
    this._captionEl.className = 'mts-lb__caption';
    lb.appendChild(this._captionEl);

    /* Miniaturas */
    if (this.thumbnails && this._items.length > 1) {
      const strip = document.createElement('div');
      strip.className = 'mts-lb__thumbs';
      this._items.forEach((item, i) => {
        const th = document.createElement('div');
        th.className = 'mts-lb__thumb' + (i === this._idx ? ' mts-lb__thumb--active' : '');
        th.style.backgroundImage = 'url(' + (item.thumb || item.src) + ')';
        th.addEventListener('click', (e) => { e.stopPropagation(); this.goTo(i); });
        strip.appendChild(th);
        item._thumbEl = th;
      });
      this._thumbStrip = strip;
      lb.appendChild(strip);
    }

    document.body.appendChild(lb);
    this._el = lb;
    document.body.style.overflow = 'hidden';

    /* Teclado */
    this._keyHandler = (e) => {
      if (e.key === 'Escape')     this._destroy();
      if (e.key === 'ArrowLeft')  this._nav(-1);
      if (e.key === 'ArrowRight') this._nav(1);
    };
    document.addEventListener('keydown', this._keyHandler);

    this._updateMedia();
    this._updateUI();
    requestAnimationFrame(() => lb.classList.add('mts-lb--visible'));

    this._emit('open', { item: this._items[this._idx], index: this._idx });
  }

  _updateMedia() {
    if (!this._mediaWrap) return;
    this._mediaWrap.innerHTML = '';
    this._zoomed = false; this._zoomScale = 1;

    const item = this._items[this._idx];
    if (!item) return;

    const type = item.type || (item.src.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image');

    if (type === 'video') {
      const vid = document.createElement('video');
      vid.className = 'mts-lb__video';
      vid.src = item.src; vid.controls = true; vid.autoplay = true;
      vid.addEventListener('click', e => e.stopPropagation());
      this._mediaWrap.appendChild(vid);

    } else if (type === 'youtube') {
      const id = item.src.match(/(?:v=|youtu\.be\/)([^&\?]+)/)?.[1] || item.src;
      const iframe = document.createElement('iframe');
      iframe.className = 'mts-lb__iframe';
      iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1';
      iframe.allow = 'autoplay;fullscreen';
      iframe.addEventListener('click', e => e.stopPropagation());
      this._mediaWrap.appendChild(iframe);

    } else if (type === 'vimeo') {
      const id = item.src.match(/vimeo\.com\/(\d+)/)?.[1] || item.src;
      const iframe = document.createElement('iframe');
      iframe.className = 'mts-lb__iframe';
      iframe.src = 'https://player.vimeo.com/video/' + id + '?autoplay=1';
      iframe.allow = 'autoplay;fullscreen';
      iframe.addEventListener('click', e => e.stopPropagation());
      this._mediaWrap.appendChild(iframe);

    } else {
      /* Imagen */
      const img = document.createElement('img');
      img.className = 'mts-lb__img mts-lb__img--' + this.animation;
      img.src = item.src; img.alt = item.alt || '';
      img.draggable = false;
      requestAnimationFrame(() => img.classList.add('mts-lb__img--in'));

      if (this.zoom) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          this._zoomed = !this._zoomed;
          this._zoomScale = this._zoomed ? 2 : 1;
          img.style.transform = 'scale(' + this._zoomScale + ')';
          img.style.cursor = this._zoomed ? 'zoom-out' : 'zoom-in';
        });
      } else {
        img.addEventListener('click', e => e.stopPropagation());
      }

      if (this._dlBtn) this._dlBtn.href = item.src;
      this._mediaWrap.appendChild(img);
    }
  }

  _updateUI() {
    const item = this._items[this._idx];
    if (this._counterEl) this._counterEl.textContent = (this._idx + 1) + ' / ' + this._items.length;
    if (this._captionEl) { this._captionEl.textContent = item?.caption || ''; this._captionEl.style.display = item?.caption ? '' : 'none'; }
    /* Thumbs */
    if (this._thumbStrip) {
      this._items.forEach((it, i) => {
        it._thumbEl?.classList.toggle('mts-lb__thumb--active', i === this._idx);
      });
    }
    this._emit('change', { item, index: this._idx });
  }

  _nav(dir) {
    const len = this._items.length;
    if (!this.loop && (this._idx + dir < 0 || this._idx + dir >= len)) return;
    this._idx = (this._idx + dir + len) % len;
    this._updateMedia();
    this._updateUI();
  }

  _destroy() {
    if (!this._el) return;
    this._el.remove(); this._el = null;
    document.body.style.overflow = '';
    if (this._keyHandler) { document.removeEventListener('keydown', this._keyHandler); this._keyHandler = null; }
    this._emit('close', {});
  }
  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    document.dispatchEvent(new CustomEvent(`mts:lightbox:${event}`, { detail }));
  }
};
