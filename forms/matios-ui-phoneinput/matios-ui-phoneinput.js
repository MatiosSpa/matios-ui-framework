/* ============================================================
   MATIOS UI — matios-ui-phoneinput.js
   MTS.PhoneInput — Input de teléfono con selector de país
                    y formato automático. 0 dependencias.
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.PhoneInput = class MtsPhoneInput {
  /* Catálogo de países — América completa + mercados internacionales clave */
  static COUNTRIES = [
    /* ── América del Norte ── */
    { code:'CA', dial:'+1',   flag:'🇨🇦', name:'Canadá',          fmt:'(###) ###-####'   },
    { code:'US', dial:'+1',   flag:'🇺🇸', name:'Estados Unidos',  fmt:'(###) ###-####'   },
    { code:'MX', dial:'+52',  flag:'🇲🇽', name:'México',          fmt:'## #### ####'     },
    /* ── América Central ── */
    { code:'GT', dial:'+502', flag:'🇬🇹', name:'Guatemala',       fmt:'#### ####'        },
    { code:'BZ', dial:'+501', flag:'🇧🇿', name:'Belice',          fmt:'### ####'         },
    { code:'HN', dial:'+504', flag:'🇭🇳', name:'Honduras',        fmt:'####-####'        },
    { code:'SV', dial:'+503', flag:'🇸🇻', name:'El Salvador',     fmt:'#### ####'        },
    { code:'NI', dial:'+505', flag:'🇳🇮', name:'Nicaragua',       fmt:'#### ####'        },
    { code:'CR', dial:'+506', flag:'🇨🇷', name:'Costa Rica',      fmt:'#### ####'        },
    { code:'PA', dial:'+507', flag:'🇵🇦', name:'Panamá',          fmt:'#### ####'        },
    /* ── Caribe ── */
    { code:'CU', dial:'+53',  flag:'🇨🇺', name:'Cuba',            fmt:'# ### ####'       },
    { code:'DO', dial:'+1',   flag:'🇩🇴', name:'Rep. Dominicana', fmt:'###-###-####'     },
    { code:'HT', dial:'+509', flag:'🇭🇹', name:'Haití',           fmt:'## ## ####'       },
    { code:'JM', dial:'+1',   flag:'🇯🇲', name:'Jamaica',         fmt:'###-###-####'     },
    { code:'PR', dial:'+1',   flag:'🇵🇷', name:'Puerto Rico',     fmt:'###-###-####'     },
    { code:'TT', dial:'+1',   flag:'🇹🇹', name:'Trinidad y Tobago', fmt:'###-###-####'  },
    { code:'BB', dial:'+1',   flag:'🇧🇧', name:'Barbados',        fmt:'###-###-####'     },
    /* ── América del Sur ── */
    { code:'CO', dial:'+57',  flag:'🇨🇴', name:'Colombia',        fmt:'### ### ####'     },
    { code:'VE', dial:'+58',  flag:'🇻🇪', name:'Venezuela',       fmt:'### ### ####'     },
    { code:'GY', dial:'+592', flag:'🇬🇾', name:'Guyana',          fmt:'### ####'         },
    { code:'SR', dial:'+597', flag:'🇸🇷', name:'Surinam',         fmt:'### ####'         },
    { code:'BR', dial:'+55',  flag:'🇧🇷', name:'Brasil',          fmt:'## #####-####'    },
    { code:'EC', dial:'+593', flag:'🇪🇨', name:'Ecuador',         fmt:'## ### ####'      },
    { code:'PE', dial:'+51',  flag:'🇵🇪', name:'Perú',            fmt:'### ### ###'      },
    { code:'BO', dial:'+591', flag:'🇧🇴', name:'Bolivia',         fmt:'# ### ####'       },
    { code:'PY', dial:'+595', flag:'🇵🇾', name:'Paraguay',        fmt:'### ### ###'      },
    { code:'AR', dial:'+54',  flag:'🇦🇷', name:'Argentina',       fmt:'## ####-####'     },
    { code:'CL', dial:'+56',  flag:'🇨🇱', name:'Chile',           fmt:'# #### ####'      },
    { code:'UY', dial:'+598', flag:'🇺🇾', name:'Uruguay',         fmt:'# ### ## ##'      },
    /* ── Europa ── */
    { code:'ES', dial:'+34',  flag:'🇪🇸', name:'España',          fmt:'### ### ###'      },
    { code:'PT', dial:'+351', flag:'🇵🇹', name:'Portugal',        fmt:'### ### ###'      },
    { code:'GB', dial:'+44',  flag:'🇬🇧', name:'Reino Unido',     fmt:'#### ### ####'    },
    { code:'FR', dial:'+33',  flag:'🇫🇷', name:'Francia',         fmt:'# ## ## ## ##'    },
    { code:'DE', dial:'+49',  flag:'🇩🇪', name:'Alemania',        fmt:'#### ########'    },
    { code:'IT', dial:'+39',  flag:'🇮🇹', name:'Italia',          fmt:'### ### ####'     },
    /* ── Asia / Pacífico ── */
    { code:'CN', dial:'+86',  flag:'🇨🇳', name:'China',           fmt:'### #### ####'    },
    { code:'JP', dial:'+81',  flag:'🇯🇵', name:'Japón',           fmt:'## #### ####'     },
  ];

  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {string}   options.country     Código ISO inicial — default: 'CL'
   * @param {string}   options.value       Valor inicial (solo dígitos)
   * @param {string}   options.label       Etiqueta
   * @param {string}   options.placeholder Placeholder — default: usa el formato del país
   * @param {string}   options.hint
   * @param {boolean}  options.disabled
   * @param {string}   options.size        'sm'|'md'|'lg' — default: 'md'
   * @param {function} options.onChange    ({ raw, formatted, full, country }) => {}
   * @param {function} options.onCountryChange ({ country }) => {}
   */
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    /* ── data-* → inicialización HTML declarativa ── */
    const _ds = this._el?.dataset || {};
    const _fromHTML = {};
    if (_ds.label !== undefined) _fromHTML.label = _ds.label;
    if (_ds.placeholder !== undefined) _fromHTML.placeholder = _ds.placeholder;
    if (_ds.hint !== undefined) _fromHTML.hint = _ds.hint;
    if (_ds.value !== undefined) _fromHTML.value = _ds.value;
    if (_ds.country !== undefined) _fromHTML.country = _ds.country;
    if (_ds.disabled !== undefined) _fromHTML.disabled = true;
    if (_ds.size !== undefined) _fromHTML.size = _ds.size;
    options = { ..._fromHTML, ...options };

    this._countryCode = options.country     || 'CL';
    this._raw         = options.value       || '';
    this.label        = options.label       || '';
    this.placeholder  = options.placeholder || '';
    this.hint         = options.hint        || '';
    this.disabled     = options.disabled    ?? false;
    this.size         = options.size        || 'md';
    this.renderMode   = options.renderMode  || 'auto';
    this._error     = '';
    this._listeners = {};

    // Fires when value changes: ({ raw, formatted, full, country }) => {}
    // Se dispara al cambiar el valor
    if (options.onChange)       this.on('change',  options.onChange);

    // Fires when country changes: ({ country }) => {}
    // Se dispara al cambiar el país
    if (options.onCountryChange) this.on('country', options.onCountryChange);

    this._ddOpen = false;
    this._build();
    this._el._mtsInstance = this;
  }

  /* ── API ── */
  getValue()         { return { raw: this._raw, formatted: this._format(this._raw), full: this._country().dial + this._raw, country: this._country() }; }
  setValue(v)        { this._raw = v.replace(/\D/g,''); if(this._input) this._input.value = this._format(this._raw); return this; }
  setCountry(code)   { this._countryCode = code; this._build(); return this; }
  setError(msg)      { this._error = msg; this._renderError(); return this; }
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }
  clearError()       { this._error = ''; this._renderError(); return this; }
  disable()          { this.disabled = true;  this._build(); return this; }
  enable()           { this.disabled = false; this._build(); return this; }

  _country() { return MTS.PhoneInput.COUNTRIES.find(c => c.code === this._countryCode) || MTS.PhoneInput.COUNTRIES[0]; }

  _format(digits) {
    const fmt   = this._country().fmt;
    let   d     = digits.replace(/\D/g,'');
    let   out   = '';
    let   di    = 0;
    for (let i = 0; i < fmt.length && di < d.length; i++) {
      if (fmt[i] === '#') { out += d[di++]; }
      else { out += fmt[i]; if (di < d.length) {} }
    }
    // Agregar separadores pendientes
    for (let i = out.length; i < fmt.length; i++) {
      if (fmt[i] !== '#' && di < d.length) out += fmt[i];
      else break;
    }
    return out;
  }

  _build() {
    const explicitFieldOnly = this.renderMode === 'field-only';
    const explicitStandalone = this.renderMode === 'standalone';
    const parentIsGroup = this._el.parentElement?.classList.contains('mts-form-group');
    const fieldOnly = explicitFieldOnly || (!explicitStandalone && parentIsGroup);

    /* Limpiar dropdown anterior del body (portal) */
    if (this._dd && this._dd.parentNode) {
      this._dd.parentNode.removeChild(this._dd);
      this._dd = null;
    }
    /* Remover listener anterior de click-fuera */
    if (this._onDocClick) {
      document.removeEventListener('click', this._onDocClick);
      this._onDocClick = null;
    }

    this._el.innerHTML = '';
    this._el.classList.add('mts-phoneinput');
    const c = this._country();

    if (!fieldOnly && this.label) {
      const lbl = document.createElement('label');
      lbl.className = 'mts-phoneinput__label';
      lbl.textContent = this.label;
      this._el.appendChild(lbl);
    }

    const wrap = document.createElement('div');
    wrap.className = 'mts-phoneinput__wrap mts-phoneinput__wrap--' + this.size + (this.disabled ? ' mts-phoneinput__wrap--disabled' : '');

    /* Selector de país */
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'mts-phoneinput__country';
    trigger.disabled = this.disabled;
    var _S = typeof MTS !== 'undefined' && MTS.Sanitize;
    var _trigHtml = '<span class="mts-phoneinput__flag">' + (_S ? MTS.Sanitize.html(c.flag) : c.flag) + '</span>'
      + '<span class="mts-phoneinput__dial">' + (_S ? MTS.Sanitize.html(c.dial) : c.dial) + '</span>'
      + '<span class="mts-phoneinput__chevron">▾</span>';
    trigger.innerHTML = _trigHtml;
    trigger.addEventListener('click', (e) => { e.stopPropagation(); this._toggleDd(); });
    wrap.appendChild(trigger);
    this._trigger = trigger;

    /* Separador */
    const sep = document.createElement('div');
    sep.className = 'mts-phoneinput__sep';
    wrap.appendChild(sep);

    /* Input */
    const input = document.createElement('input');
    input.type        = 'tel';
    input.className   = 'mts-phoneinput__input';
    input.placeholder = this.placeholder || c.fmt.replace(/#/g,'0');
    input.disabled    = this.disabled;
    input.value       = this._format(this._raw);
    input.inputMode   = 'tel';
    this._input = input;

    input.addEventListener('input', () => {
      // Caret estable por CONTEO DE DÍGITOS: el reformateo inserta/quita separadores,
      // así que el índice de carácter viejo queda corrido. Contamos los dígitos a la
      // izquierda del caret y, tras reformatear, ubicamos el caret después de esa misma
      // cantidad de dígitos en el string formateado.
      const digitsLeft = input.value.slice(0, input.selectionStart).replace(/\D/g, '').length;
      this._raw = input.value.replace(/\D/g, '');
      const formatted = this._format(this._raw);
      input.value = formatted;

      let pos = formatted.length;
      if (digitsLeft <= 0) {
        pos = 0;
      } else {
        let seen = 0;
        for (let i = 0; i < formatted.length; i++) {
          const ch = formatted.charCodeAt(i);
          if (ch >= 48 && ch <= 57) { // 0-9
            seen++;
            if (seen === digitsLeft) { pos = i + 1; break; }
          }
        }
      }
      try { input.setSelectionRange(pos, pos); } catch(e){}
      this._emit('change', this.getValue());
    });
    input.addEventListener('focus', () => wrap.classList.add('mts-phoneinput__wrap--focus'));
    input.addEventListener('blur',  () => wrap.classList.remove('mts-phoneinput__wrap--focus'));
    input.addEventListener('keydown', (e) => { if (e.key === 'Escape') this._closeDd(); });
    wrap.appendChild(input);

    /* Dropdown de países */
    const dd = document.createElement('div');
    dd.className = 'mts-phoneinput__dd';
    dd.style.display = 'none';

    /* Búsqueda */
    const search = document.createElement('input');
    search.type = 'text';
    search.className = 'mts-phoneinput__dd-search';
    search.placeholder = 'Buscar país...';
    search.addEventListener('input', () => this._filterDd(search.value, list));
    search.addEventListener('click', e => e.stopPropagation());
    dd.appendChild(search);

    const list = document.createElement('ul');
    list.className = 'mts-phoneinput__dd-list';
    this._renderDdList(list, '');
    dd.appendChild(list);

    /* Portal: adjuntar dropdown al body para evitar clipping por stacking context */
    document.body.appendChild(dd);
    this._dd = dd;
    this._el.appendChild(wrap);
    this._wrap = wrap;

    /* Hint / Error */
    if (this.hint) {
      const h = document.createElement('div');
      h.className = 'mts-phoneinput__hint';
      h.textContent = this.hint;
      this._el.appendChild(h);
    }
    const errEl = document.createElement('div');
    errEl.className = 'mts-phoneinput__error';
    this._errorEl = errEl;
    this._el.appendChild(errEl);
    this._renderError();

    /* Cerrar dd al click fuera — listener único almacenado para poder removerlo */
    var _self = this;
    this._onDocClick = function(e) {
      if (_self._dd && !_self._dd.contains(e.target) && !_self._trigger.contains(e.target)) {
        _self._closeDd();
      }
    };
    document.addEventListener('click', this._onDocClick);
  }

  _renderDdList(list, query) {
    list.innerHTML = '';
    const q = query.toLowerCase();
    const countries = q
      ? MTS.PhoneInput.COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q))
      : MTS.PhoneInput.COUNTRIES;
    countries.forEach(c => {
      const li = document.createElement('li');
      li.className = 'mts-phoneinput__dd-item' + (c.code === this._countryCode ? ' mts-phoneinput__dd-item--active' : '');
      var _liS = typeof MTS !== 'undefined' && MTS.Sanitize;
      li.innerHTML = '<span class="mts-phoneinput__flag">' + (_liS ? MTS.Sanitize.html(c.flag) : c.flag) + '</span>'
        + '<span class="mts-phoneinput__dd-name">' + (_liS ? MTS.Sanitize.html(c.name) : c.name) + '</span>'
        + '<span class="mts-phoneinput__dd-dial">' + (_liS ? MTS.Sanitize.html(c.dial) : c.dial) + '</span>';
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this._countryCode = c.code;
        this._closeDd();
        this._build();
        setTimeout(() => this._input?.focus(), 50);
        this._emit('country', { country: c });
        this._emit('change', this.getValue());
      });
      list.appendChild(li);
    });
  }
  _filterDd(q, list) { this._renderDdList(list, q); }
  _toggleDd()   { this._ddOpen ? this._closeDd() : this._openDd(); }
  _positionDd() {
    var rect  = this._trigger.getBoundingClientRect();
    var dd    = this._dd;
    var ddW   = 280;
    var ddH   = dd.offsetHeight || 260;
    var left  = rect.left;
    var spaceBelow = window.innerHeight - rect.bottom;
    /* Evitar desborde por la derecha */
    if (left + ddW > window.innerWidth - 8) { left = window.innerWidth - ddW - 8; }
    if (left < 8) { left = 8; }
    dd.style.position = 'fixed';
    dd.style.zIndex   = '9999';
    dd.style.width    = ddW + 'px';
    dd.style.left     = left + 'px';
    if (spaceBelow >= ddH || spaceBelow >= 120) {
      dd.style.top    = (rect.bottom + 2) + 'px';
      dd.style.bottom = 'auto';
    } else {
      dd.style.top    = 'auto';
      dd.style.bottom = (window.innerHeight - rect.top + 2) + 'px';
    }
  }
  _openDd() {
    this._dd.style.display = '';
    this._positionDd();
    var searchEl = this._dd.querySelector('.mts-phoneinput__dd-search');
    if (searchEl) { searchEl.value = ''; searchEl.focus(); }
    this._renderDdList(this._dd.querySelector('.mts-phoneinput__dd-list'), '');
    this._ddOpen = true;
    this._trigger.classList.add('mts-phoneinput__country--open');
    /* Reposicionar al hacer scroll o resize (igual que MTS.Select) */
    var _self = this;
    this._onScrollResize = function() { _self._positionDd(); };
    window.addEventListener('scroll', this._onScrollResize, true);
    window.addEventListener('resize', this._onScrollResize);
  }
  _closeDd() {
    if (!this._dd) return;
    this._dd.style.display = 'none';
    this._ddOpen = false;
    this._trigger?.classList.remove('mts-phoneinput__country--open');
    /* Remover listeners de scroll/resize */
    if (this._onScrollResize) {
      window.removeEventListener('scroll', this._onScrollResize, true);
      window.removeEventListener('resize', this._onScrollResize);
      this._onScrollResize = null;
    }
  }
  _renderError() {
    if (!this._errorEl) return;
    this._errorEl.textContent = this._error;
    this._errorEl.style.display = this._error ? 'block' : 'none';
    this._wrap?.classList.toggle('mts-phoneinput__wrap--error', !!this._error);
  }
  _emit(event, detail) {
    var listeners = this._listeners[event] || [];
    listeners.forEach(function(fn) { fn({ type: event, detail: detail }); });
    if (this._el) {
      this._el.dispatchEvent(new CustomEvent('mts:phoneinput:' + event, { bubbles: true, detail: detail }));
    }
  }

  /**
   * Agrega un país si su code no existe ya en la lista.
   * @param {{ code, dial, flag, name, fmt }} entry
   * @returns {boolean} true si se agregó, false si ya existía
   */
  static addCountry(entry) {
    if (!entry || !entry.code) return false;
    var exists = MTS.PhoneInput.COUNTRIES.some(function(c) {
      return c.code === entry.code;
    });
    if (exists) return false;
    MTS.PhoneInput.COUNTRIES.push(entry);
    return true;
  }

  /**
   * Agrega múltiples países, omitiendo los que ya existen.
   * @param {Array} entries
   * @returns {{ added: number, skipped: number }}
   */
  static addCountries(entries) {
    var result = { added: 0, skipped: 0 };
    if (!Array.isArray(entries)) return result;
    entries.forEach(function(entry) {
      if (MTS.PhoneInput.addCountry(entry)) result.added++;
      else result.skipped++;
    });
    return result;
  }
};

