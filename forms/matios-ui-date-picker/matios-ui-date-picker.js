/* ============================================================
   MATIOS UI — matios-ui-picker.js
   MTS.Picker — Selector de fecha, hora, datetime y rango

   Modos:
     · date      — mini calendario
     · time      — columnas scrolleables
     · datetime  — calendario + hora
     · daterange — dos calendarios

   Eventos DOM:
     mts:picker:open   | mts:picker:close | mts:picker:change

   Requiere: matios-ui-base.css + matios-ui-picker.css
   Version:  1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DatePicker = class MtsDatePicker {

  /* ============================================================
     Constructor
     ============================================================ */

  /**
   * @param {string|Element} selector   Input o selector CSS
   * @param {object}         options
   *
   * — Modo —
   * @param {string}   options.mode         'date'|'time'|'datetime'|'daterange' — default: 'date'
   *
   * — Formato —
   * @param {string}   options.format       Formato de fecha — default según modo
   * @param {string}   options.locale       Locale — default: 'es-CL'
   * @param {number}   options.timeStep     Paso en minutos para el time — default: 5
   * @param {number}   options.startHour    Hora inicial en lista — default: 0
   * @param {number}   options.endHour      Hora final en lista — default: 23
   *
   * — Restricciones —
   * @param {Date}     options.minDate      Fecha mínima seleccionable
   * @param {Date}     options.maxDate      Fecha máxima seleccionable
   * @param {Array}    options.disabledDays  Días deshabilitados [0=Dom...6=Sáb]
   *
   * — Comportamiento —
   * @param {boolean}  options.closeOnSelect  Cierra al seleccionar — default: true (date), false (datetime)
   * @param {boolean}  options.clearable      Muestra botón limpiar — default: true
   * @param {string}   options.placeholder    Placeholder del input
   * @param {boolean}  options.readonly       Input solo lectura — default: true
   *
   * — Callbacks —
   * @param {function} options.onChange     (value, rawDate) => {}
   * @param {function} options.onOpen       () => {}
   * @param {function} options.onClose      () => {}
   */
  constructor(selector, options = {}) {
    this._input = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (!this._input) {
      console.error(`[MTS.DatePicker] Elemento no encontrado: ${selector}`);
      return;
    }

    // — Opciones —
    this.mode         = options.mode        || 'date';
    this.locale       = options.locale      || 'es-CL';
    this.timeStep     = options.timeStep    || 5;
    this.startHour    = options.startHour   ?? 0;
    this.endHour      = options.endHour     ?? 23;
    this.minDate      = options.minDate     || null;
    this.maxDate      = options.maxDate     || null;
    this.disabledDays = options.disabledDays || [];
    this.clearable    = options.clearable   ?? true;
    this.readonly     = options.readonly    ?? true;
    this.placeholder  = options.placeholder || this._defaultPlaceholder();
    this.closeOnSelect = options.closeOnSelect ?? (this.mode === 'date' || this.mode === 'daterange');

    // Formato por defecto según modo
    this.format = options.format || this._defaultFormat();

    // — Callbacks —
    this._listeners = {};
    if (options.onChange)  this.on('change', options.onChange);
    if (options.onSelect)  this.on('change', options.onSelect);  // alias onSelect
    if (options.onOpen)    this.on('open',   options.onOpen);
    if (options.onClose)   this.on('close',  options.onClose);

    // — Estado —
    this._isOpen      = false;
    this._popupEl     = null;
    this._value       = null;       // Date | { start, end } para daterange
    this._viewDate    = new Date(); // Mes/año visible en el calendario
    this._viewDate2   = new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() + 1, 1); // Para daterange
    this._rangeStart  = null;       // Para daterange
    this._rangeEnd    = null;
    this._selectedHour   = new Date().getHours();
    this._selectedMinute = Math.round(new Date().getMinutes() / this.timeStep) * this.timeStep;

    // — Setup —
    this._setupInput();
    this._buildPopup();
    this._bindEvents();
  }

  /* ============================================================
     API PÚBLICA
     ============================================================ */

  /** Abre el picker */
  open() {
    if (this._isOpen) return this;
    if (!this._emit('open')) return this;

    this._isOpen = true;
    this._updatePopupContent();
    this._positionPopup();

    this._popupEl.removeAttribute('hidden');
    requestAnimationFrame(() => this._popupEl.classList.add('mts-picker-popup--visible'));

    return this;
  }

  /** Cierra el picker */
  close() {
    if (!this._isOpen) return this;
    if (!this._emit('close')) return this;

    this._isOpen = false;
    this._popupEl.classList.remove('mts-picker-popup--visible');

    const el = this._popupEl;
    setTimeout(() => { if (!this._isOpen) el.setAttribute('hidden', ''); }, 200);

    return this;
  }

  /** Establece el valor programáticamente */
  setValue(date) {
    if (this.mode === 'daterange') {
      if (Array.isArray(date)) {
        this._rangeStart = date[0] ? new Date(date[0]) : null;
        this._rangeEnd   = date[1] ? new Date(date[1]) : null;
        this._value      = { start: this._rangeStart, end: this._rangeEnd };
      }
    } else {
      this._value = date ? new Date(date) : null;
      if (this._value) {
        this._viewDate        = new Date(this._value);
        this._selectedHour    = this._value.getHours();
        this._selectedMinute  = this._value.getMinutes();
      }
    }
    this._updateInputValue();
    return this;
  }

  /** Obtiene el valor actual */
  getValue() {
    return this._value;
  }

  /** Limpia el valor */
  clear() {
    this._value      = null;
    this._rangeStart = null;
    this._rangeEnd   = null;
    this._input.value = '';
    this._emit('change', { value: null, raw: null });
    this._el('mts-picker__clear')?.classList.remove('mts-picker__clear--visible');
    return this;
  }

  /** Destruye la instancia */
  destroy() {
    this._popupEl?.remove();
    this._wrapperEl?.replaceWith(this._input);
    document.removeEventListener('click', this._outsideClick);
    document.removeEventListener('keydown', this._onKeyDown);
  }

  /** Registra listener */
  on(event, cb) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(cb);
    return this;
  }

  /** Remueve listener */
  off(event, cb) {
    if (!this._listeners[event]) return this;
    this._listeners[event] = this._listeners[event].filter(f => f !== cb);
    return this;
  }

  /* ============================================================
     SETUP
     ============================================================ */

  _setupInput() {
    // Envolver input en wrapper
    this._wrapperEl = document.createElement('div');
    this._wrapperEl.className = 'mts-picker-wrap';
    /* Heredar ancho completo si está dentro de un form-group */
    if (this._input.parentElement?.classList.contains('mts-form-group')) {
      this._wrapperEl.style.width = '100%';
    }
    this._input.parentNode.insertBefore(this._wrapperEl, this._input);
    this._wrapperEl.appendChild(this._input);

    // Configurar input
    this._input.classList.add('mts-picker-input');
    this._input.placeholder = this.placeholder;
    if (this.readonly) this._input.readOnly = true;
    this._input.autocomplete = 'off';

    // Ícono calendario/reloj
    const icon = document.createElement('span');
    icon.className = `mts-picker-icon ${this.mode === 'time' ? 'mts-picker-icon--time' : 'mts-picker-icon--date'}`;
    icon.setAttribute('aria-hidden', 'true');
    this._wrapperEl.appendChild(icon);

    // Botón limpiar
    if (this.clearable) {
      const clear = document.createElement('button');
      clear.className = 'mts-picker__clear';
      clear.setAttribute('aria-label', 'Limpiar');
      clear.setAttribute('tabindex', '-1');
      clear.innerHTML = '&times;';
      clear.addEventListener('click', (e) => {
        e.stopPropagation();
        this.clear();
        this.close();
      });
      this._wrapperEl.appendChild(clear);
      this._clearBtn = clear;
    }
  }

  /* ============================================================
     CONSTRUCCIÓN DEL POPUP
     ============================================================ */

  _buildPopup() {
    this._popupEl = document.createElement('div');
    this._popupEl.className = `mts-picker-popup mts-picker-popup--${this.mode}`;
    this._popupEl.setAttribute('hidden', '');
    this._popupEl.setAttribute('role', 'dialog');
    this._popupEl.setAttribute('aria-modal', 'false');
    document.body.appendChild(this._popupEl);
  }

  _updatePopupContent() {
    this._popupEl.innerHTML = '';

    switch (this.mode) {
      case 'date':      this._renderCalendar(this._popupEl, this._viewDate);        break;
      case 'time':      this._renderTimePicker(this._popupEl);                       break;
      case 'datetime':  this._renderDatetime(this._popupEl);                         break;
      case 'daterange': this._renderDateRange(this._popupEl);                        break;
    }

    // Footer con botones Hoy/Ahora y Aceptar
    if (this.mode !== 'date') {
      this._renderFooter(this._popupEl);
    }
  }

  /* ============================================================
     MODO DATE — mini calendario
     ============================================================ */

  _renderCalendar(container, viewDate, rangeMode = false, calIndex = 0) {
    const cal = document.createElement('div');
    cal.className = 'mts-picker-cal';

    // — Header del mes —
    const header = document.createElement('div');
    header.className = 'mts-picker-cal__header';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'mts-picker-cal__nav';
    prevBtn.setAttribute('aria-label', 'Mes anterior');
    prevBtn.innerHTML = '&#8249;';
    prevBtn.addEventListener('click', () => {
      if (calIndex === 0) {
        this._viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        if (rangeMode) this._viewDate2 = new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() + 1, 1);
      } else {
        this._viewDate2 = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
      }
      this._updatePopupContent();
    });

    const monthYear = document.createElement('span');
    monthYear.className = 'mts-picker-cal__month-year';
    monthYear.textContent = this._formatMonthYear(viewDate);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'mts-picker-cal__nav';
    nextBtn.setAttribute('aria-label', 'Mes siguiente');
    nextBtn.innerHTML = '&#8250;';
    nextBtn.addEventListener('click', () => {
      if (calIndex === 0) {
        this._viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        if (rangeMode) this._viewDate2 = new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() + 1, 1);
      } else {
        this._viewDate2 = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
      }
      this._updatePopupContent();
    });

    header.appendChild(prevBtn);
    header.appendChild(monthYear);
    header.appendChild(nextBtn);
    cal.appendChild(header);

    // — Días de la semana —
    const weekdays = document.createElement('div');
    weekdays.className = 'mts-picker-cal__weekdays';
    ['Lu','Ma','Mi','Ju','Vi','Sá','Do'].forEach(d => {
      const span = document.createElement('span');
      span.textContent = d;
      weekdays.appendChild(span);
    });
    cal.appendChild(weekdays);

    // — Grid de días —
    const grid = document.createElement('div');
    grid.className = 'mts-picker-cal__grid';

    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const lastDay  = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);

    // Offset — lunes es 0
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    // Celdas vacías antes
    for (let i = 0; i < startOffset; i++) {
      const empty = document.createElement('span');
      empty.className = 'mts-picker-cal__day mts-picker-cal__day--empty';
      grid.appendChild(empty);
    }

    // Días del mes
    const today = new Date();
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date    = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
      const dayBtn  = document.createElement('button');
      dayBtn.className  = 'mts-picker-cal__day';
      dayBtn.textContent = d;

      // Clases de estado
      if (this._isSameDay(date, today))       dayBtn.classList.add('mts-picker-cal__day--today');
      if (this._isDisabled(date))             dayBtn.classList.add('mts-picker-cal__day--disabled');
      if (this._isSelected(date))             dayBtn.classList.add('mts-picker-cal__day--selected');
      if (rangeMode && this._isInRange(date)) dayBtn.classList.add('mts-picker-cal__day--in-range');
      if (rangeMode && this._isRangeStart(date)) dayBtn.classList.add('mts-picker-cal__day--range-start');
      if (rangeMode && this._isRangeEnd(date))   dayBtn.classList.add('mts-picker-cal__day--range-end');

      if (!this._isDisabled(date)) {
        dayBtn.addEventListener('click', () => this._selectDate(date));
        // Hover para preview del rango
        if (rangeMode && this._rangeStart && !this._rangeEnd) {
          dayBtn.addEventListener('mouseenter', () => {
            this._hoverDate = date;
            this._updatePopupContent();
          });
        }
      } else {
        dayBtn.disabled = true;
      }

      grid.appendChild(dayBtn);
    }

    cal.appendChild(grid);
    container.appendChild(cal);
  }

  /* ============================================================
     MODO TIME — columnas scrolleables
     ============================================================ */

  _renderTimePicker(container) {
    const wrap = document.createElement('div');
    wrap.className = 'mts-picker-time';

    wrap.appendChild(this._buildTimeColumn('hour',   this._buildHours(),   this._selectedHour));
    wrap.appendChild(this._buildTimeSeparator());
    wrap.appendChild(this._buildTimeColumn('minute', this._buildMinutes(), this._selectedMinute));

    container.appendChild(wrap);
  }

  _buildTimeColumn(type, items, selected) {
    const col = document.createElement('div');
    col.className = 'mts-picker-time__col';

    const upBtn = document.createElement('button');
    upBtn.className = 'mts-picker-time__arrow mts-picker-time__arrow--up';
    upBtn.innerHTML = '&#8679;';
    upBtn.addEventListener('click', () => {
      if (type === 'hour') {
        this._selectedHour = this._selectedHour <= this.startHour
          ? this.endHour
          : this._selectedHour - 1;
      } else {
        const mins = this._buildMinutes();
        const idx  = mins.indexOf(this._selectedMinute);
        this._selectedMinute = mins[idx <= 0 ? mins.length - 1 : idx - 1];
      }
      this._updatePopupContent();
    });

    const list = document.createElement('div');
    list.className = 'mts-picker-time__list';

    items.forEach(val => {
      const item = document.createElement('div');
      item.className = 'mts-picker-time__item';
      item.textContent = String(val).padStart(2, '0');
      if (val === selected) item.classList.add('mts-picker-time__item--selected');
      item.addEventListener('click', () => {
        if (type === 'hour') this._selectedHour   = val;
        else                  this._selectedMinute = val;
        this._updatePopupContent();
      });
      list.appendChild(item);
    });

    const downBtn = document.createElement('button');
    downBtn.className = 'mts-picker-time__arrow mts-picker-time__arrow--down';
    downBtn.innerHTML = '&#8681;';
    downBtn.addEventListener('click', () => {
      if (type === 'hour') {
        this._selectedHour = this._selectedHour >= this.endHour
          ? this.startHour
          : this._selectedHour + 1;
      } else {
        const mins = this._buildMinutes();
        const idx  = mins.indexOf(this._selectedMinute);
        this._selectedMinute = mins[idx >= mins.length - 1 ? 0 : idx + 1];
      }
      this._updatePopupContent();
    });

    col.appendChild(upBtn);
    col.appendChild(list);
    col.appendChild(downBtn);

    // Scroll al elemento seleccionado
    requestAnimationFrame(() => {
      const sel = list.querySelector('.mts-picker-time__item--selected');
      if (sel) sel.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });

    return col;
  }

  _buildTimeSeparator() {
    const sep = document.createElement('div');
    sep.className = 'mts-picker-time__separator';
    sep.textContent = ':';
    return sep;
  }

  _buildHours() {
    const hours = [];
    for (let h = this.startHour; h <= this.endHour; h++) hours.push(h);
    return hours;
  }

  _buildMinutes() {
    const mins = [];
    for (let m = 0; m < 60; m += this.timeStep) mins.push(m);
    return mins;
  }

  /* ============================================================
     MODO DATETIME — calendario + hora
     ============================================================ */

  _renderDatetime(container) {
    this._renderCalendar(container, this._viewDate);
    const divider = document.createElement('div');
    divider.className = 'mts-picker-datetime__divider';
    container.appendChild(divider);
    this._renderTimePicker(container);
  }

  /* ============================================================
     MODO DATERANGE — dos calendarios
     ============================================================ */

  _renderDateRange(container) {
    const wrap = document.createElement('div');
    wrap.className = 'mts-picker-range';
    this._renderCalendar(wrap, this._viewDate,  true, 0);
    this._renderCalendar(wrap, this._viewDate2, true, 1);
    container.appendChild(wrap);

    // Info del rango seleccionado
    if (this._rangeStart || this._rangeEnd) {
      const info = document.createElement('div');
      info.className = 'mts-picker-range__info';
      const startStr = this._rangeStart ? this._formatDate(this._rangeStart) : '—';
      const endStr   = this._rangeEnd   ? this._formatDate(this._rangeEnd)   : '—';
      info.innerHTML = `<span>${startStr}</span><span class="mts-picker-range__arrow">→</span><span>${endStr}</span>`;
      container.appendChild(info);
    }
  }

  /* ============================================================
     FOOTER — botones de acción
     ============================================================ */

  _renderFooter(container) {
    const footer = document.createElement('div');
    footer.className = 'mts-picker-footer';

    // Botón hoy/ahora
    const todayBtn = document.createElement('button');
    todayBtn.className   = 'mts-btn mts-btn--ghost mts-btn--sm';
    todayBtn.textContent = this.mode === 'time' ? 'Ahora' : 'Hoy';
    todayBtn.addEventListener('click', () => {
      const now = new Date();
      this._selectedHour   = now.getHours();
      this._selectedMinute = Math.round(now.getMinutes() / this.timeStep) * this.timeStep;
      this._viewDate       = new Date(now);
      if (this.mode !== 'time') this._selectDate(now);
      else this._updatePopupContent();
    });

    // Botón aceptar
    const okBtn = document.createElement('button');
    okBtn.className   = 'mts-btn mts-btn--primary mts-btn--sm';
    okBtn.textContent = 'Aceptar';
    okBtn.addEventListener('click', () => {
      this._confirmSelection();
      this.close();
    });

    footer.appendChild(todayBtn);
    footer.appendChild(okBtn);
    container.appendChild(footer);
  }

  /* ============================================================
     SELECCIÓN
     ============================================================ */

  _selectDate(date) {
    if (this.mode === 'daterange') {
      if (!this._rangeStart || (this._rangeStart && this._rangeEnd)) {
        // Primer click — inicio del rango
        this._rangeStart = new Date(date);
        this._rangeEnd   = null;
        this._hoverDate  = null;
      } else {
        // Segundo click — fin del rango
        if (date < this._rangeStart) {
          this._rangeEnd   = new Date(this._rangeStart);
          this._rangeStart = new Date(date);
        } else {
          this._rangeEnd = new Date(date);
        }
        this._value = { start: this._rangeStart, end: this._rangeEnd };
        this._updateInputValue();
        this._emitChange();
        if (this.closeOnSelect) this.close();
      }
      this._updatePopupContent();
      return;
    }

    // Modo date / datetime
    if (!this._value) this._value = new Date();
    this._value = new Date(
      date.getFullYear(), date.getMonth(), date.getDate(),
      this._selectedHour, this._selectedMinute, 0
    );
    this._viewDate = new Date(this._value);

    if (this.mode === 'date') {
      this._updateInputValue();
      this._emitChange();
      if (this.closeOnSelect) this.close();
      else this._updatePopupContent();
    } else {
      // datetime — solo actualiza el calendario, espera al Aceptar
      this._updatePopupContent();
    }
  }

  _confirmSelection() {
    if (this.mode === 'time') {
      if (!this._value) this._value = new Date();
      this._value.setHours(this._selectedHour, this._selectedMinute, 0, 0);
    } else if (this.mode === 'datetime') {
      if (!this._value) this._value = new Date();
      this._value.setHours(this._selectedHour, this._selectedMinute, 0, 0);
    }
    this._updateInputValue();
    this._emitChange();
  }

  /* ============================================================
     INPUT
     ============================================================ */

  _updateInputValue() {
    if (!this._value && !this._rangeStart) {
      this._input.value = '';
      this._clearBtn?.classList.remove('mts-picker__clear--visible');
      return;
    }

    if (this.mode === 'daterange') {
      const s = this._rangeStart ? this._formatDate(this._rangeStart) : '';
      const e = this._rangeEnd   ? this._formatDate(this._rangeEnd)   : '';
      this._input.value = s && e ? `${s} → ${e}` : s;
    } else {
      this._input.value = this._formatValue(this._value);
    }

    this._clearBtn?.classList.add('mts-picker__clear--visible');
  }

  /* ============================================================
     POSICIONAMIENTO
     ============================================================ */

  _positionPopup() {
    const rect  = this._wrapperEl.getBoundingClientRect();
    const popup = this._popupEl;

    popup.style.position = 'fixed';
    popup.style.left     = `${rect.left}px`;
    popup.style.top      = `${rect.bottom + 6}px`;
    popup.style.minWidth = `${Math.max(rect.width, 280)}px`;

    // Ajustar si se sale de la pantalla
    requestAnimationFrame(() => {
      const pr = popup.getBoundingClientRect();
      if (pr.right > window.innerWidth) {
        popup.style.left = `${rect.right - pr.width}px`;
      }
      if (pr.bottom > window.innerHeight) {
        popup.style.top = `${rect.top - pr.height - 6}px`;
      }
    });
  }

  /* ============================================================
     EVENTOS
     ============================================================ */

  _bindEvents() {
    // Abrir al click en el input o wrapper
    this._wrapperEl.addEventListener('click', (e) => {
      if (e.target === this._clearBtn) return;
      this._isOpen ? this.close() : this.open();
    });

    // Cerrar al click fuera — con flag para clicks internos que reconstruyen DOM
    this._internalClick = false;
    this._popupEl.addEventListener('mousedown', () => { this._internalClick = true; });
    this._wrapperEl.addEventListener('mousedown', () => { this._internalClick = true; });

    this._outsideClick = (e) => {
      if (this._internalClick) { this._internalClick = false; return; }
      if (!this._popupEl.contains(e.target) && !this._wrapperEl.contains(e.target)) {
        this.close();
      }
    };
    document.addEventListener('click', this._outsideClick);

    // Escape cierra
    this._onKeyDown = (e) => {
      if (e.key === 'Escape' && this._isOpen) this.close();
    };
    document.addEventListener('keydown', this._onKeyDown);

    // Reposicionar en scroll/resize
    window.addEventListener('scroll',  () => { if (this._isOpen) this._positionPopup(); }, true);
    window.addEventListener('resize',  () => { if (this._isOpen) this._positionPopup(); });
  }

  _emit(eventName, detail = {}) {
    const handlers  = this._listeners[eventName] || [];
    let cancelled   = false;
    const synthetic = {
      type: eventName,
      target: this,
      preventDefault: () => { cancelled = true; },
      detail,
    };
    handlers.forEach(fn => fn(synthetic));
    if (cancelled) return false;

    const domEvent = new CustomEvent(`mts:picker:${eventName}`, {
      bubbles:    true,
      cancelable: true,
      detail:     { picker: this, ...detail },
    });
    this._input.dispatchEvent(domEvent);
    return !cancelled;
  }

  _emitChange() {
    const value = this.mode === 'daterange'
      ? { start: this._rangeStart, end: this._rangeEnd }
      : this._value;
    this._emit('change', { value, formatted: this._input.value });
  }

  /* ============================================================
     HELPERS DE FECHA
     ============================================================ */

  _isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth()    === b.getMonth()    &&
           a.getDate()     === b.getDate();
  }

  _isSelected(date) {
    if (!this._value) return false;
    return this._isSameDay(date, this._value);
  }

  _isDisabled(date) {
    if (this.minDate && date < this.minDate) return true;
    if (this.maxDate && date > this.maxDate) return true;
    if (this.disabledDays.includes(date.getDay())) return true;
    return false;
  }

  _isInRange(date) {
    const start = this._rangeStart;
    const end   = this._rangeEnd || this._hoverDate;
    if (!start || !end) return false;
    const [a, b] = start <= end ? [start, end] : [end, start];
    return date > a && date < b;
  }

  _isRangeStart(date) {
    return this._rangeStart && this._isSameDay(date, this._rangeStart);
  }

  _isRangeEnd(date) {
    return this._rangeEnd && this._isSameDay(date, this._rangeEnd);
  }

  _formatMonthYear(date) {
    return date.toLocaleDateString(this.locale, { month: 'long', year: 'numeric' })
      .replace(/^\w/, c => c.toUpperCase());
  }

  _formatDate(date) {
    if (!date) return '';
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return this.format
      .replace('DD', d)
      .replace('MM', m)
      .replace('YYYY', y);
  }

  _formatTime(date) {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }

  _formatValue(date) {
    if (!date) return '';
    if (this.mode === 'date')     return this._formatDate(date);
    if (this.mode === 'time')     return this._formatTime(date);
    if (this.mode === 'datetime') return `${this._formatDate(date)} ${this._formatTime(date)}`;
    return '';
  }

  _defaultFormat() {
    switch (this.mode) {
      case 'time':     return 'HH:mm';
      case 'datetime': return 'DD/MM/YYYY HH:mm';
      default:         return 'DD/MM/YYYY';
    }
  }

  _defaultPlaceholder() {
    switch (this.mode) {
      case 'time':      return 'HH:mm';
      case 'datetime':  return 'DD/MM/YYYY HH:mm';
      case 'daterange': return 'DD/MM/YYYY → DD/MM/YYYY';
      default:          return 'DD/MM/YYYY';
    }
  }

  _el(cls) {
    return this._popupEl?.querySelector(`.${cls}`);
  }
};
