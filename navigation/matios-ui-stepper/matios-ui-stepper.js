/* ============================================================
   MATIOS UI — matios-ui-stepper.js
   MTS.Stepper — Flujo paso a paso y progreso visual
   
   Modos:
     'wizard'   — pasos con contenido/paneles (formularios, tablas, etc.)
     'progress' — solo indicador visual, sin paneles

   Variantes (mode:'progress'):
     'default'  — indicador + label + descripción
     'compact'  — indicador pequeño + label
     'dots'     — puntos minimalistas con barra de progreso

   Eventos DOM:
     mts:stepper:change       — cambio de paso
     mts:stepper:complete     — llegó al último paso
     mts:stepper:stepclick    — click manual en un paso
     mts:stepper:statuschange — cambio de estado de un paso

   Version: 2.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Stepper = class MtsStepper {

  constructor(selector, options = {}) {
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) { console.error('[MTS.Stepper] No encontrado:', selector); return; }

    // Mode: 'wizard' (panels with content) | 'progress' (visual indicator only)
    // Modo: 'wizard' (paneles con contenido) | 'progress' (solo indicador visual)
    this.mode = options.mode || 'wizard';

    // Variant (progress mode only): 'default' | 'compact' | 'dots'
    // Variante (solo modo progress)
    this.variant = options.variant || 'default';

    // Steps array — each item is a step definition / Arreglo de pasos
    this.steps = (options.steps || []).map(s => ({ ...s }));

    // Initially active step index / Índice del paso activo inicial
    this.active = options.active ?? 0;

    // Layout direction: 'horizontal' | 'vertical' / Dirección del layout
    this.direction = options.direction || 'horizontal';

    // Allow clicking steps to navigate / Permitir navegar haciendo click en los pasos
    this.clickable = options.clickable ?? false;

    this._listeners = {};
    this._panelEls  = {};

    // Fires when active step changes / Se dispara al cambiar el paso activo
    if (options.onChange)       this.on('change',       options.onChange);

    // Fires when the last step is reached / Se dispara al llegar al último paso
    if (options.onComplete)     this.on('complete',     options.onComplete);

    // Fires when user clicks a step (clickable mode) / Se dispara al hacer click en un paso
    if (options.onStepClick)    this.on('stepclick',    options.onStepClick);

    // Fires when a step status changes / Se dispara al cambiar el estado de un paso
    if (options.onStatusChange) this.on('statuschange', options.onStatusChange);

    this._build();
  }

  /* â”€â”€ API â”€â”€ */
  next() {
    if (this.active < this.steps.length - 1) {
      this.goTo(this.active + 1, 'next');
    } else {
      this._emit('complete', { steps: this.getSteps() });
    }
    return this;
  }

  prev() {
    if (this.active > 0) this.goTo(this.active - 1, 'prev');
    return this;
  }

  goTo(index, direction) {
    direction = direction || 'jump';
    if (index < 0 || index >= this.steps.length) return this;
    if (this.steps[index] && this.steps[index].disabled) return this;
    let prev = this.active;
    this.active = index;
    this._renderIndicators();
    if (this.mode === 'wizard') this._showPanel(index);
    this._emit('change', {
      index:     index,
      prev:      prev,
      step:      this.steps[index],
      direction: direction,
    });
    return this;
  }

  setStepStatus(index, status) {
    if (!this.steps[index]) return this;
    this.steps[index].status = status;
    this._renderIndicators();
    this._emit('statuschange', { index: index, status: status, step: this.steps[index] });
    return this;
  }

  getSteps()  { return this.steps.map(function(s){ return Object.assign({}, s); }); }
  getActive() { return { index: this.active, step: this.steps[this.active] }; }
  isFirst()   { return this.active === 0; }
  isLast()    { return this.active === this.steps.length - 1; }

  setSteps(steps) {
    this.steps     = steps.map(function(s){ return Object.assign({}, s); });
    this._panelEls = {};
    this.active    = 0;
    this._build();
    return this;
  }

  on(e, cb)  {
    if (!this._listeners[e]) this._listeners[e] = [];
    this._listeners[e].push(cb);
    return this;
  }
  off(e, cb) {
    this._listeners[e] = (this._listeners[e] || []).filter(function(f){ return f !== cb; });
    return this;
  }
  destroy()  { this._el.innerHTML = ''; this._panelEls = {}; }

  /* â”€â”€ Build â”€â”€ */
  _build() {
    this._el.innerHTML = '';
    this._panelEls    = {};
    this._progressBar = null;

    let modeClass    = 'mts-stepper--' + this.mode;
    let variantClass = this.mode === 'progress' ? ' mts-stepper--' + this.variant : '';
    let dirClass     = 'mts-stepper--' + this.direction;
    this._syncClasses(['mts-stepper', modeClass, dirClass].concat(variantClass.trim() ? [variantClass.trim()] : []));

    /* Track de indicadores */
    this._trackEl = document.createElement('div');
    this._trackEl.className = 'mts-stepper__track';
    this._el.appendChild(this._trackEl);
    this._renderIndicators();

    /* Paneles — solo wizard */
    if (this.mode === 'wizard') {
      this._panelsEl = document.createElement('div');
      this._panelsEl.className = 'mts-stepper__panels';
      this._el.appendChild(this._panelsEl);
      this._buildPanels();
      this._showPanel(this.active);
    }

    /* Barra de progreso — solo dots */
    if (this.mode === 'progress' && this.variant === 'dots') {
      this._progressBar = document.createElement('div');
      this._progressBar.className = 'mts-stepper__progress-bar';
      let fill = document.createElement('div');
      fill.className = 'mts-stepper__progress-fill';
      this._progressBar.appendChild(fill);
      this._trackEl.appendChild(this._progressBar);
      this._updateProgressBar();
    }
  }

  /* â”€â”€ Indicadores â”€â”€ */
  _renderIndicators() {
    if (!this._trackEl) return;
    this._trackEl.innerHTML = '';
    let self = this;

    this.steps.forEach(function(step, idx) {
      let isDone   = idx < self.active;
      let isActive = idx === self.active;
      let isError  = step.status === 'error';
      let status   = isError ? 'error' : isDone ? 'complete' : isActive ? 'active' : 'pending';

      let item = document.createElement('div');
      item.className = 'mts-stepper__step mts-stepper__step--' + status;
      if (step.disabled) item.classList.add('mts-stepper__step--disabled');

      /* Click */
      if (self.clickable && !step.disabled && idx !== self.active) {
        item.classList.add('mts-stepper__step--clickable');
        (function(i, s){
          item.addEventListener('click', function() {
            self._emit('stepclick', { index: i, step: s });
            self.goTo(i, 'jump');
          });
        })(idx, step);
      }

      /* Indicador circular */
      let indicator = document.createElement('div');
      indicator.className = 'mts-stepper__indicator';

      if (isError) {
        indicator.innerHTML = MTS.Icon.get('close');
      } else if (isDone) {
        indicator.innerHTML = MTS.Icon.get('check');
      } else if (step.icon && self.variant !== 'dots') {
        indicator.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(step.icon) : step.icon;
      } else if (self.variant !== 'dots') {
        indicator.textContent = idx + 1;
      }
      item.appendChild(indicator);

      /* Texto — no en dots */
      if (self.variant !== 'dots') {
        let textWrap = document.createElement('div');
        textWrap.className = 'mts-stepper__text';

        let label = document.createElement('span');
        label.className = 'mts-stepper__label';
        label.textContent = step.label;
        textWrap.appendChild(label);

        if (step.description && self.variant !== 'compact') {
          let desc = document.createElement('span');
          desc.className = 'mts-stepper__description';
          desc.textContent = step.description;
          textWrap.appendChild(desc);
        }
        item.appendChild(textWrap);
      }

      /* Línea conectora — no en el último */
      if (idx < self.steps.length - 1) {
        let line = document.createElement('div');
        line.className = 'mts-stepper__line' + (isDone ? ' mts-stepper__line--done' : '');
        item.appendChild(line);
      }

      self._trackEl.appendChild(item);
    });

    if (this._progressBar) this._updateProgressBar();
  }

  /* â”€â”€ Paneles (wizard) â”€â”€ */
  _buildPanels() {
    let self = this;
    this.steps.forEach(function(step, idx) {
      let panel = document.createElement('div');
      panel.className = 'mts-stepper__panel';
      panel.dataset.idx = idx;
      panel.style.display = 'none';
      self._panelsEl.appendChild(panel);
      self._panelEls[idx] = panel;
    });
  }

  _showPanel(index) {
    let self = this;
    Object.values(this._panelEls).forEach(function(p){ p.style.display = 'none'; });
    let panel = this._panelEls[index];
    if (!panel) return;

    /* Lazy render — solo la primera vez */
    if (!panel.dataset.rendered) {
      let step     = this.steps[index];
      let content  = step.content;
      if (content !== undefined && content !== null) {
        let resolved = typeof content === 'function' ? content() : content;
        if (typeof resolved === 'string') {
          panel.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(resolved) : resolved;
        } else if (resolved instanceof Element || resolved instanceof DocumentFragment) {
          panel.innerHTML = '';
          panel.appendChild(resolved);
        }
      }
      panel.dataset.rendered = '1';
    }
    panel.style.display = '';
  }

  /* â”€â”€ Barra progreso (dots) â”€â”€ */
  _updateProgressBar() {
    if (!this._progressBar) return;
    let fill = this._progressBar.querySelector('.mts-stepper__progress-fill');
    if (!fill) return;
    let pct = this.steps.length > 1
      ? (this.active / (this.steps.length - 1)) * 100
      : 0;
    fill.style.width = pct + '%';
  }

  /* â”€â”€ Emit â”€â”€ */
  _emit(event, detail) {
    let self = this;
    (this._listeners[event] || []).forEach(function(fn){ fn({ type: event, detail: detail }); });
    this._el.dispatchEvent(new CustomEvent('mts:stepper:' + event, { bubbles: true, detail: detail }));
  }

  _syncClasses(classes) {
    let previousMatiosClasses = Array.from(this._el.classList).filter(function(cls) {
      return cls === 'mts-stepper' || cls.indexOf('mts-stepper--') === 0;
    });
    if (previousMatiosClasses.length) this._el.classList.remove.apply(this._el.classList, previousMatiosClasses);
    this._el.classList.add.apply(this._el.classList, classes.filter(Boolean));
  }
};

