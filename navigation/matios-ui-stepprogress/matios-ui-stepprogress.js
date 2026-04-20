/* ============================================================
   MATIOS UI — matios-ui-stepprogress.js
   MTS.StepProgress — compatibility alias for MTS.Stepper
   Version: 2.0.0
   ============================================================ */

window.MTS = window.MTS || {};

(function () {
  var warned = false;

  function warnDeprecated() {
    if (warned) return;
    warned = true;
    try {
      console.warn('[MTS.StepProgress] Deprecated. Use MTS.Stepper with mode:"progress".');
    } catch (e) {}
  }

  class LegacyStepProgress {
    constructor(selector, options = {}) {
      this._el = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;
      if (!this._el) return;
      this.steps = options.steps || [];
      this.active = options.active ?? 0;
      this.variant = options.variant || 'default';
      this.clickable = options.clickable ?? false;
      this._listeners = {};
      if (options.onChange) this.on('change', options.onChange);
      this._build();
    }

    goTo(index) {
      if (index < 0 || index >= this.steps.length) return this;
      this.active = index;
      this._build();
      this._emit('change', { index: index, step: this.steps[index] });
      return this;
    }

    next() { return this.goTo(Math.min(this.active + 1, this.steps.length - 1)); }
    prev() { return this.goTo(Math.max(this.active - 1, 0)); }

    setStepStatus(index, status) {
      if (this.steps[index]) {
        this.steps[index]._status = status;
        this._build();
      }
      return this;
    }

    getActive() { return { index: this.active, step: this.steps[this.active] }; }
    getSteps() { return (this.steps || []).map(function (s) { return Object.assign({}, s); }); }

    on(e, cb) {
      if (!this._listeners[e]) this._listeners[e] = [];
      this._listeners[e].push(cb);
      return this;
    }

    off(e, cb) {
      this._listeners[e] = (this._listeners[e] || []).filter(function (fn) { return fn !== cb; });
      return this;
    }

    destroy() {
      if (this._el) this._el.innerHTML = '';
    }

    _build() {
      this._el.innerHTML = '';
      this._syncClasses(['mts-stepprogress', 'mts-stepprogress--' + this.variant]);

      var total = this.steps.length;
      var self = this;

      this.steps.forEach(function (step, i) {
        var isDone = i < self.active;
        var isActive = i === self.active;
        var isError = step._status === 'error';

        var item = document.createElement('div');
        item.className =
          'mts-stepprogress__item' +
          (isDone ? ' mts-stepprogress__item--done' : '') +
          (isActive ? ' mts-stepprogress__item--active' : '') +
          (isError ? ' mts-stepprogress__item--error' : '');

        if (self.clickable && i <= self.active) {
          item.classList.add('mts-stepprogress__item--clickable');
          item.addEventListener('click', function () { self.goTo(i); });
        }

        var indicator = document.createElement('div');
        indicator.className = 'mts-stepprogress__indicator';

        if (isError) {
          indicator.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
        } else if (isDone) {
          indicator.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
        } else {
          var num = document.createElement('span');
          num.textContent = i + 1;
          indicator.appendChild(num);
        }

        item.appendChild(indicator);

        if (self.variant !== 'dots') {
          var text = document.createElement('div');
          text.className = 'mts-stepprogress__text';

          var label = document.createElement('div');
          label.className = 'mts-stepprogress__label';
          label.textContent = step.label;
          text.appendChild(label);

          if (step.description && self.variant === 'default') {
            var desc = document.createElement('div');
            desc.className = 'mts-stepprogress__desc';
            desc.textContent = step.description;
            text.appendChild(desc);
          }

          item.appendChild(text);
        }

        if (i < total - 1) {
          var line = document.createElement('div');
          line.className = 'mts-stepprogress__line' + (isDone ? ' mts-stepprogress__line--done' : '');
          item.appendChild(line);
        }

        self._el.appendChild(item);
      });

      var pct = total > 1 ? (this.active / (total - 1)) * 100 : 0;
      var bar = document.createElement('div');
      bar.className = 'mts-stepprogress__bar';

      var fill = document.createElement('div');
      fill.className = 'mts-stepprogress__bar-fill';
      fill.style.width = pct + '%';

      bar.appendChild(fill);
      this._el.appendChild(bar);
    }

    _syncClasses(classes) {
      var previousMatiosClasses = Array.from(this._el.classList).filter(function (cls) {
        return cls === 'mts-stepprogress' || cls.indexOf('mts-stepprogress--') === 0;
      });
      if (previousMatiosClasses.length) this._el.classList.remove.apply(this._el.classList, previousMatiosClasses);
      this._el.classList.add.apply(this._el.classList, classes.filter(Boolean));
    }

    _emit(event, detail) {
      (this._listeners[event] || []).forEach(function (fn) { fn({ type: event, detail: detail }); });
      this._el.dispatchEvent(new CustomEvent('mts:stepprogress:' + event, { bubbles: true, detail: detail }));
    }
  }

  MTS.StepProgress = class MtsStepProgressAlias {
    constructor(selector, options = {}) {
      this._el = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;
      if (!this._el) return;

      this._listeners = {};
      this._usingStepper = typeof MTS.Stepper === 'function';

      if (this._usingStepper) {
        warnDeprecated();
        var self = this;
        var userOnChange = options.onChange;
        var userOnComplete = options.onComplete;
        var userOnStepClick = options.onStepClick;
        var userOnStatusChange = options.onStatusChange;

        this._impl = new MTS.Stepper(this._el, Object.assign({}, options, {
          mode: 'progress',
          onChange: function (e) {
            self._emit('change', e.detail);
            if (typeof userOnChange === 'function') userOnChange(e);
          },
          onComplete: function (e) {
            self._emit('complete', e.detail);
            if (typeof userOnComplete === 'function') userOnComplete(e);
          },
          onStepClick: function (e) {
            self._emit('stepclick', e.detail);
            if (typeof userOnStepClick === 'function') userOnStepClick(e);
          },
          onStatusChange: function (e) {
            self._emit('statuschange', e.detail);
            if (typeof userOnStatusChange === 'function') userOnStatusChange(e);
          }
        }));
      } else {
        this._impl = new LegacyStepProgress(this._el, options);
      }
    }

    next() { this._impl.next(); return this; }
    prev() { this._impl.prev(); return this; }
    goTo(index) { this._impl.goTo(index); return this; }
    setStepStatus(index, status) { this._impl.setStepStatus(index, status); return this; }
    getActive() { return this._impl.getActive(); }
    getSteps() {
      if (typeof this._impl.getSteps === 'function') return this._impl.getSteps();
      return [];
    }

    on(event, cb) {
      if (this._usingStepper) {
        if (!this._listeners[event]) this._listeners[event] = [];
        this._listeners[event].push(cb);
      } else {
        this._impl.on(event, cb);
      }
      return this;
    }

    off(event, cb) {
      if (this._usingStepper) {
        this._listeners[event] = (this._listeners[event] || []).filter(function (fn) { return fn !== cb; });
      } else {
        this._impl.off(event, cb);
      }
      return this;
    }

    destroy() {
      if (this._impl && typeof this._impl.destroy === 'function') this._impl.destroy();
    }

    _emit(event, detail) {
      (this._listeners[event] || []).forEach(function (fn) { fn({ type: event, detail: detail }); });
      this._el.dispatchEvent(new CustomEvent('mts:stepprogress:' + event, { bubbles: true, detail: detail }));
    }
  };
})();
