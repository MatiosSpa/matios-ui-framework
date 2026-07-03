/* ============================================================
   MATIOS UI — matios-ui-avatar.js
   MTS.Avatar | MTS.AvatarGroup
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Avatar = class MtsAvatar {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {string}   options.src      URL de imagen
   * @param {string}   options.name     Nombre completo — genera iniciales
   * @param {string}   options.initials Iniciales manuales (sobrescribe name)
   * @param {string}   options.size     'xs'|'sm'|'md'|'lg'|'xl' — default: 'md'
   * @param {string}   options.color    Color de fondo (auto si no se pasa)
   * @param {string}   options.status   'online'|'offline'|'busy'|'away'
   * @param {boolean}  options.square   Forma cuadrada — default: false
   * @param {string}   options.badge    Texto o número en badge
   */
  constructor(selector, options = {}) {
    this._el    = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    // Image URL — falls back to initials on error / URL de imagen — cae a iniciales si falla
    this.src = options.src || null;

    // Full name — used to generate initials and auto color / Nombre completo — genera iniciales y color auto
    this.name = options.name || '';

    // Manual initials — overrides name / Iniciales manuales — sobreescribe name
    this.initials = options.initials || MTS.Avatar.getInitials(this.name);

    // Size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' / Tamaño
    this.size = options.size || 'md';

    // Background color (auto-generated from name if not set) / Color de fondo (auto desde name)
    this.color = options.color || MTS.Avatar.colorFromName(this.name);

    // Status dot: 'online' | 'offline' | 'busy' | 'away' / Indicador de estado
    this.status = options.status || null;

    // Square shape / Forma cuadrada
    this.square = options.square ?? false;

    // Badge text or number / Texto o número en badge
    this.badge = options.badge ?? null;

    this._build();
  }

  setStatus(status) { this.status = status; this._build(); return this; }
  setSrc(src)       { this.src = src; this._build(); return this; }

  // Patch any subset of fields and re-render. When `name` changes without an explicit
  // `initials`/`color` in the same call, both are recomputed from the new name.
  update(options = {}) {
    if ('src'      in options) this.src      = options.src;
    if ('name'     in options) this.name     = options.name || '';
    if ('initials' in options) this.initials = options.initials;
    else if ('name' in options) this.initials = MTS.Avatar.getInitials(this.name);
    if ('color'    in options) this.color    = options.color;
    else if ('name' in options) this.color   = MTS.Avatar.colorFromName(this.name);
    if ('size'     in options) this.size     = options.size;
    if ('status'   in options) this.status   = options.status;
    if ('square'   in options) this.square   = options.square;
    if ('badge'    in options) this.badge    = options.badge;
    this._build();
    return this;
  }

  _t(key, fallback) {
    try { const ns = (window.MTS && MTS.getString) ? MTS.getString()['MTS.Avatar'] : null; const m = ns && ns.messages; if (m && m[key] != null) return m[key]; } catch (e) {}
    return fallback;
  }

  _syncClasses() {
    const keep = Array.from(this._el.classList).filter(cls => !cls.startsWith('mts-avatar'));
    this._el.className = keep.join(' ');
    this._el.classList.add('mts-avatar', `mts-avatar--${this.size}`);
    if (this.square) this._el.classList.add('mts-avatar--square');
  }

  _build() {
    this._syncClasses();
    this._el.setAttribute('aria-label', this.name || this._t('avatarLabel', 'Avatar'));
    this._el.innerHTML = '';

    if (this.src) {
      const img = document.createElement('img');
      img.src = this.src; img.alt = this.name;
      img.className = 'mts-avatar__img';
      img.addEventListener('error', () => { img.remove(); this._buildInitials(); });
      this._el.appendChild(img);
    } else {
      this._buildInitials();
    }

    if (this.status) {
      const dot = document.createElement('span');
      dot.className = `mts-avatar__status mts-avatar__status--${this.status}`;
      this._el.appendChild(dot);
    }

    if (this.badge != null) {
      const b = document.createElement('span');
      b.className = 'mts-avatar__badge';
      b.textContent = this.badge;
      this._el.appendChild(b);
    }
  }

  _buildInitials() {
    const span = document.createElement('span');
    span.className = 'mts-avatar__initials';
    span.textContent = this.initials;
    span.style.background = this.color;
    this._el.appendChild(span);
  }

  static getInitials(name = '') {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }

  static colorFromName(name = '') {
    const colors = ['#004b5d','#1a7f4b','#b45309','#7c3aed','#0077a8','#c0392b','#e67e22','#16a085'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  static create(options = {}) {
    const el = document.createElement('div');
    new MTS.Avatar(el, options);
    return el;
  }
};

MTS.AvatarGroup = class MtsAvatarGroup {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {Array}    options.avatars  [{ src?, name?, status? }]
   * @param {number}   options.max      Máximo visible — default: 4
   * @param {string}   options.size     'xs'|'sm'|'md'|'lg'
   */
  constructor(selector, options = {}) {
    this._el    = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    this.avatars = options.avatars || [];
    this.max     = options.max     ?? 4;
    this.size    = options.size    || 'md';
    this._build();
  }

  _syncClasses() {
    const keep = Array.from(this._el.classList).filter(cls => !cls.startsWith('mts-avatar-group'));
    this._el.className = keep.join(' ');
    this._el.classList.add('mts-avatar-group');
  }

  _build() {
    this._syncClasses();
    this._el.innerHTML = '';
    const visible = this.avatars.slice(0, this.max);
    const rest    = this.avatars.length - this.max;

    visible.forEach(av => {
      const wrap = document.createElement('div');
      new MTS.Avatar(wrap, { ...av, size: this.size });
      this._el.appendChild(wrap);
    });

    if (rest > 0) {
      const more = document.createElement('div');
      more.className = `mts-avatar mts-avatar--${this.size} mts-avatar--more`;
      const span = document.createElement('span');
      span.className = 'mts-avatar__initials';
      span.style.background = '#6c757d';
      span.textContent = `+${rest}`;
      more.appendChild(span);
      this._el.appendChild(more);
    }
  }
};
