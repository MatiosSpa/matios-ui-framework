/* ============================================================
   MATIOS UI — matios-ui-grid.js
   MTS.Grid — Optional helper for rendering the native CSS Grid API
   Uses the same classes from ../../base/matios-ui-grid.css
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Grid = class MtsGrid {
  constructor(selector, options = {}) {
    this._mount = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._mount) {
      console.error('[MTS.Grid] Mount element not found:', selector);
      return;
    }

    this.options = {
      className: '',
      style: null,
      items: [],
      ...options,
    };

    this._root = null;
    this.render();
  }

  render() {
    this.clear();

    this._root = document.createElement('div');
    this._root.className = this._buildGridClassName(this.options.className);
    this._applyStyle(this._root, this.options.style);

    (this.options.items || []).forEach((item) => {
      this._root.appendChild(this._buildItem(item));
    });

    this._mount.appendChild(this._root);
    return this;
  }

  setItems(items = []) {
    this.options.items = Array.isArray(items) ? items : [];
    return this.render();
  }

  appendItem(item = {}) {
    this.options.items.push(item);
    if (this._root) {
      this._root.appendChild(this._buildItem(item));
    }
    return this;
  }

  clear() {
    if (this._mount) this._mount.innerHTML = '';
    this._root = null;
    return this;
  }

  destroy() {
    return this.clear();
  }

  _buildGridClassName(className) {
    return ['mts-grid', className || ''].join(' ').trim();
  }

  _buildItem(item = {}) {
    const el = document.createElement(item.tag || 'div');
    const classes = [];

    if (item.className) classes.push(item.className);
    if (item.col) classes.push(`mts-g-col-${item.col}`);
    if (item.row) classes.push(`mts-g-row-${item.row}`);
    if (item.start) classes.push(`mts-g-start-${item.start}`);
    if (item.rowStart) classes.push(`mts-g-row-start-${item.rowStart}`);
    if (item.full) classes.push('mts-g-col-full');
    if (item.auto) classes.push('mts-g-col-auto');
    if (item.self) classes.push(`mts-g-self-${item.self}`);

    ['sm', 'md', 'lg', 'xl'].forEach((bp) => {
      if (item[bp]) classes.push(`mts-g-col-${bp}-${item[bp]}`);
      if (item[`start${bp.toUpperCase()}`]) classes.push(`mts-g-start-${bp}-${item[`start${bp.toUpperCase()}`]}`);
    });

    el.className = classes.join(' ').trim();
    this._applyStyle(el, item.style);

    if (item.html != null) {
      el.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(item.html) : item.html;
    } else if (item.text != null) {
      el.textContent = item.text;
    }

    return el;
  }

  _applyStyle(el, style) {
    if (!style) return;
    if (typeof style === 'string') {
      el.style.cssText = style;
      return;
    }

    Object.keys(style).forEach((key) => {
      el.style.setProperty(key, style[key]);
    });
  }
};
