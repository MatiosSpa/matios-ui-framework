/* ============================================================
   MATIOS UI — matios-ui-passwordstrength.js  v1.0.0
   MTS.PasswordStrength — Medidor de fortaleza de contraseña.

   Uso básico:
     const meter = new MTS.PasswordStrength('#meter', {
       input:       inPass,
       minLength:   8,
       minUppercase: 1,
       minNumbers:  1,
       minSpecial:  1,
       allowedSpecial: '!@#$%^&*',
     });
     meter.isValid();   // → boolean
     meter.getScore();  // → 0-100
     meter.getLevel();  // → 'weak' | 'fair' | 'strong' | 'very-strong'
   ============================================================ */

window.MTS = window.MTS || {};

MTS.PasswordStrength = class MtsPasswordStrength {

  /* ── Constructor ── */

  constructor(container, options) {
    options = options || {};

    this._container = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    if (!this._container) {
      console.error('[MTS.PasswordStrength] Contenedor no encontrado:', container);
      return;
    }

    this._input         = options.input         || null;
    this._showChecklist = options.showChecklist !== false;
    this._onChange      = options.onChange       || null;

    this._score    = 0;
    this._level    = '';
    this._results  = [];
    this._segments = [];
    this._ruleEls  = [];
    this._labelEl  = null;

    this._rules = this._parseRules(options);

    this._build();
    this._bind();
    this._applyMaxLength(options.maxLength);
    this._update();
  }

  /* ══════════════════════════════════════════════════════════════
     API PÚBLICA
  ══════════════════════════════════════════════════════════════ */

  /** Retorna true solo si el 100% de las reglas pasan. */
  isValid()  { return this._score === 100; }

  /** Retorna el puntaje actual (0-100). */
  getScore() { return this._score; }

  /** Retorna el nivel actual: '' | 'weak' | 'fair' | 'strong' | 'very-strong'. */
  getLevel() { return this._level; }

  /** Retorna los resultados de cada regla: [{ label, ok }]. */
  getResults() { return this._results.slice(); }

  /** Destruye el componente y limpia el contenedor. */
  destroy() {
    this._container.textContent = '';
    this._container.classList.remove(
      'mts-pwstrength',
      'mts-pwstrength--weak',
      'mts-pwstrength--fair',
      'mts-pwstrength--strong',
      'mts-pwstrength--very-strong'
    );
  }

  /* ══════════════════════════════════════════════════════════════
     MAXLENGTH AUTOMÁTICO
  ══════════════════════════════════════════════════════════════ */

  /** Si se configura maxLength, lo aplica automáticamente al input nativo. */
  _applyMaxLength(maxLength) {
    if (!maxLength) return;
    let inputEl = this._getInputEl();
    if (inputEl) inputEl.setAttribute('maxlength', maxLength);
  }

  /* ══════════════════════════════════════════════════════════════
     PARSING DE REGLAS
  ══════════════════════════════════════════════════════════════ */

  _parseRules(options) {
    const rules = [];

    if (options.minLength) {
      const n = options.minLength;
      rules.push({
        key:   'minLength',
        label: 'Mínimo ' + n + ' caracter' + (n !== 1 ? 'es' : ''),
        check: function(value) { return value.length >= n; },
      });
    }

    if (options.maxLength) {
      const n = options.maxLength;
      rules.push({
        key:   'maxLength',
        label: 'Máximo ' + n + ' caracter' + (n !== 1 ? 'es' : ''),
        check: function(value) { return value.length <= n; },
      });
    }

    if (options.minUppercase) {
      const n = options.minUppercase;
      rules.push({
        key:   'minUppercase',
        label: 'Al menos ' + n + ' mayúscula' + (n !== 1 ? 's' : ''),
        check: function(value) { return (value.match(/[A-Z]/g) || []).length >= n; },
      });
    }

    if (options.minLowercase) {
      const n = options.minLowercase;
      rules.push({
        key:   'minLowercase',
        label: 'Al menos ' + n + ' minúscula' + (n !== 1 ? 's' : ''),
        check: function(value) { return (value.match(/[a-z]/g) || []).length >= n; },
      });
    }

    if (options.minNumbers) {
      const n = options.minNumbers;
      rules.push({
        key:   'minNumbers',
        label: 'Al menos ' + n + ' número' + (n !== 1 ? 's' : ''),
        check: function(value) { return (value.match(/[0-9]/g) || []).length >= n; },
      });
    }

    if (options.minSpecial) {
      const n       = options.minSpecial;
      const special = options.allowedSpecial || '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const preview = special.length > 12 ? special.slice(0, 12) + '…' : special;
      /* Escapar para clase de caracteres en regex */
      const escaped = special.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      const regex   = new RegExp('[' + escaped + ']', 'g');
      rules.push({
        key:   'minSpecial',
        label: 'Al menos ' + n + ' símbolo' + (n !== 1 ? 's' : '') + ' (' + preview + ')',
        check: function(value) { return (value.match(regex) || []).length >= n; },
      });
    }

    return rules;
  }

  /* ══════════════════════════════════════════════════════════════
     CONSTRUCCIÓN DEL DOM
  ══════════════════════════════════════════════════════════════ */

  _build() {
    this._container.textContent = '';
    this._container.classList.add('mts-pwstrength');

    /* Barra + label */
    const barWrap = document.createElement('div');
    barWrap.className = 'mts-pwstrength__bar-wrap';

    const barEl = document.createElement('div');
    barEl.className = 'mts-pwstrength__bar';

    for (let i = 0; i < 4; i++) {
      const seg = document.createElement('div');
      seg.className = 'mts-pwstrength__segment';
      barEl.appendChild(seg);
      this._segments.push(seg);
    }

    this._labelEl = document.createElement('span');
    this._labelEl.className = 'mts-pwstrength__label';

    barWrap.appendChild(barEl);
    barWrap.appendChild(this._labelEl);
    this._container.appendChild(barWrap);

    /* Checklist */
    if (this._showChecklist && this._rules.length) {
      const list = document.createElement('ul');
      list.className = 'mts-pwstrength__checklist';

      const self = this;
      this._rules.forEach(function(rule) {
        const li = document.createElement('li');
        li.className = 'mts-pwstrength__rule';

        const iconEl = document.createElement('span');
        iconEl.className = 'mts-pwstrength__rule-icon';

        const textEl = document.createElement('span');
        textEl.className = 'mts-pwstrength__rule-text';
        textEl.textContent = rule.label;

        li.appendChild(iconEl);
        li.appendChild(textEl);
        list.appendChild(li);

        self._ruleEls.push({ li: li, iconEl: iconEl });
      });

      this._container.appendChild(list);
    }
  }

  /* ══════════════════════════════════════════════════════════════
     BINDING AL INPUT
  ══════════════════════════════════════════════════════════════ */

  _bind() {
    const inputEl = this._getInputEl();
    if (!inputEl) return;
    const self = this;
    inputEl.addEventListener('input', function() { self._update(); });
  }

  _getInputEl() {
    if (!this._input) return null;
    if (this._input._inputEl) return this._input._inputEl; /* MTS.Input */
    if (this._input.tagName)  return this._input;           /* elemento nativo */
    return null;
  }

  _getValue() {
    if (!this._input) return '';
    if (typeof this._input.getValue === 'function') return this._input.getValue();
    return this._input.value || '';
  }

  /* ══════════════════════════════════════════════════════════════
     EVALUACIÓN
  ══════════════════════════════════════════════════════════════ */

  _update() {
    const value   = this._getValue();
    const results = this._evaluateRules(value);
    const score   = this._calcScore(results);
    const level   = this._calcLevel(score, value);

    this._score   = score;
    this._level   = level;
    this._results = results;

    this._render(value, results, score, level);

    if (this._onChange) {
      this._onChange({
        score:   score,
        level:   level,
        isValid: this.isValid(),
        results: results,
      });
    }
  }

  _evaluateRules(value) {
    return this._rules.map(function(rule) {
      return { label: rule.label, ok: rule.check(value) };
    });
  }

  _calcScore(results) {
    if (!results.length) return 0;
    const passed = results.filter(function(r) { return r.ok; }).length;
    return Math.round((passed / results.length) * 100);
  }

  _calcLevel(score, value) {
    if (!value) return '';
    const active = this._scoreToSegments(score, value);
    const levels = ['', 'weak', 'fair', 'strong', 'very-strong'];
    return levels[active] || 'very-strong';
  }

  _scoreToSegments(score, value) {
    if (!value)      return 0;
    if (score === 0) return 1; /* algo se escribió pero nada pasa → mínimo 1 segmento rojo */
    return Math.min(4, Math.max(1, Math.round(score / 100 * 4)));
  }

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */

  _render(value, results, score, level) {
    /* Clase de nivel en el root */
    this._container.classList.remove(
      'mts-pwstrength--weak',
      'mts-pwstrength--fair',
      'mts-pwstrength--strong',
      'mts-pwstrength--very-strong'
    );
    if (level) this._container.classList.add('mts-pwstrength--' + level);

    /* Segmentos */
    const activeCount = this._scoreToSegments(score, value);
    this._segments.forEach(function(seg, i) {
      if (i < activeCount) {
        seg.classList.add('mts-pwstrength__segment--active');
      } else {
        seg.classList.remove('mts-pwstrength__segment--active');
      }
    });

    /* Label */
    const labelMap = {
      '':            '',
      'weak':        'Débil',
      'fair':        'Regular',
      'strong':      'Fuerte',
      'very-strong': 'Muy fuerte',
    };
    this._labelEl.textContent = labelMap[level] || '';

    /* Checklist */
    const self = this;
    results.forEach(function(result, i) {
      const els = self._ruleEls[i];
      if (!els) return;
      if (result.ok) {
        els.li.classList.add('mts-pwstrength__rule--ok');
        els.iconEl.textContent = '✓';
      } else {
        els.li.classList.remove('mts-pwstrength__rule--ok');
        els.iconEl.textContent = '';
      }
    });
  }

};
