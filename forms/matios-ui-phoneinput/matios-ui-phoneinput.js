/* ============================================================
   MATIOS UI — matios-ui-phoneinput.js
   MTS.PhoneInput — Input de teléfono con selector de país
                    y formato automático. 0 dependencias.
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.PhoneInput = class MtsPhoneInput {
  /* Catálogo de países con código, bandera emoji y formato */
  static COUNTRIES = [
    { code:'CL', dial:'+56',  flag:'🇨🇱', name:'Chile',          fmt:'# #### ####'      },
    { code:'AR', dial:'+54',  flag:'🇦🇷', name:'Argentina',      fmt:'## ####-####'     },
    { code:'MX', dial:'+52',  flag:'🇲🇽', name:'México',         fmt:'## #### ####'     },
    { code:'CO', dial:'+57',  flag:'🇨🇴', name:'Colombia',       fmt:'### ### ####'     },
    { code:'PE', dial:'+51',  flag:'🇵🇪', name:'Perú',           fmt:'### ### ###'      },
    { code:'VE', dial:'+58',  flag:'🇻🇪', name:'Venezuela',      fmt:'### ### ####'     },
    { code:'EC', dial:'+593', flag:'🇪🇨', name:'Ecuador',        fmt:'## ### ####'      },
    { code:'BO', dial:'+591', flag:'🇧🇴', name:'Bolivia',        fmt:'# ### ####'       },
    { code:'PY', dial:'+595', flag:'🇵🇾', name:'Paraguay',       fmt:'### ### ###'      },
    { code:'UY', dial:'+598', flag:'🇺🇾', name:'Uruguay',        fmt:'# ### ## ##'      },
    { code:'BR', dial:'+55',  flag:'🇧🇷', name:'Brasil',         fmt:'## #####-####'    },
    { code:'US', dial:'+1',   flag:'🇺🇸', name:'Estados Unidos', fmt:'(###) ###-####'   },
    { code:'ES', dial:'+34',  flag:'🇪🇸', name:'España',         fmt:'### ### ###'      },
    { code:'GB', dial:'+44',  flag:'🇬🇧', name:'Reino Unido',    fmt:'#### ### ####'    },
    { code:'DE', dial:'+49',  flag:'🇩🇪', name:'Alemania',       fmt:'#### ########'    },
    { code:'FR', dial:'+33',  flag:'🇫🇷', name:'Francia',        fmt:'# ## ## ## ##'    },
    { code:'IT', dial:'+39',  flag:'🇮🇹', name:'Italia',         fmt:'### ### ####'     },
    { code:'PT', dial:'+351', flag:'🇵🇹', name:'Portugal',       fmt:'### ### ###'      },
    { code:'CN', dial:'+86',  flag:'🇨🇳', name:'China',          fmt:'### #### ####'    },
    { code:'JP', dial:'+81',  flag:'🇯🇵', name:'Japón',          fmt:'## #### ####'     },
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
    this._el.innerHTML = '';
    this._el.className = 'mts-phoneinput';
    /* Heredar ancho completo si está dentro de un form-group */
    if (this._el.parentElement?.classList.contains('mts-form-group')) {
      this._el.style.width = '100%';
    }
    const c = this._country();

    if (this.label) {
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
    trigger.innerHTML = '<span class="mts-phoneinput__flag">' + c.flag + '</span><span class="mts-phoneinput__dial">' + c.dial + '</span><span class="mts-phoneinput__chevron">▾</span>';
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
      this._raw = input.value.replace(/\D/g,'');
      const formatted = this._format(this._raw);
      const cursor = input.selectionStart;
      input.value = formatted;
      // Restaurar cursor aproximado
      try { input.setSelectionRange(cursor, cursor); } catch(e){}
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

    wrap.appendChild(dd);
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

    /* Cerrar dd al click fuera */
    document.addEventListener('click', () => this._closeDd());
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
      li.innerHTML = '<span class="mts-phoneinput__flag">' + c.flag + '</span><span class="mts-phoneinput__dd-name">' + c.name + '</span><span class="mts-phoneinput__dd-dial">' + c.dial + '</span>';
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
  _openDd()  {
    this._dd.style.display = '';
    this._dd.querySelector('.mts-phoneinput__dd-search')?.focus();
    this._ddOpen = true;
    this._trigger.classList.add('mts-phoneinput__country--open');
  }
  _closeDd() {
    if (!this._dd) return;
    this._dd.style.display = 'none';
    this._ddOpen = false;
    this._trigger?.classList.remove('mts-phoneinput__country--open');
  }
  _renderError() {
    if (!this._errorEl) return;
    this._errorEl.textContent = this._error;
    this._errorEl.style.display = this._error ? 'block' : 'none';
    this._wrap?.classList.toggle('mts-phoneinput__wrap--error', !!this._error);
  }
  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el?.dispatchEvent(new CustomEvent(`mts:phoneinput:${event}`, { bubbles: true, detail }));
  }
};
