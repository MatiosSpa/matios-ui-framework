/* ============================================================
   MATIOS UI — matios-ui-picker-base.js  v2.0.0
   MTS.DatePicker.Base — Clase base compartida por todos los pickers
   No instanciar directamente. Usa MTS.DatePicker.Date, Time, etc.
   ============================================================ */

window.MTS = window.MTS || {};
MTS.DatePicker = MTS.DatePicker || {};

MTS.DatePicker.Base = class MtsDatePickerBase {

  constructor(selector, options = {}) {
    this._input = typeof selector === "string"
      ? document.querySelector(selector)
      : selector;
    if (!this._input) { console.error("[MTS.DatePicker] No encontrado:", selector); return; }

    this.locale       = options.locale      || "es-CL";
    this.minDate      = options.minDate     || null;
    this.maxDate      = options.maxDate     || null;
    this.disabledDays = options.disabledDays || [];
    this.clearable    = options.clearable   ?? true;
    this.readonly     = options.readonly    ?? true;
    this.placeholder  = options.placeholder || "";
    this.closeOnSelect = options.closeOnSelect ?? true;
    this._listeners   = {};
    this._isOpen      = false;
    this._popupEl     = null;
    this._value       = null;
    /* Vista del calendario: 'days' | 'months' | 'years' */
    this._calView     = 'days';
    this._calViewYear = new Date().getFullYear(); // año visible en la vista years

    if (options.onChange)  this.on("change", options.onChange);
    if (options.onSelect)  this.on("change", options.onSelect);
    if (options.onOpen)    this.on("open",   options.onOpen);
    if (options.onClose)   this.on("close",  options.onClose);

    /* Textos de botones configurables */
    this.btnToday  = options.btnToday  || null;
    this.btnNow    = options.btnNow    || null;
    this.btnAccept = options.btnAccept || null;

    this._setupInput();
    this._buildPopup();
    this._bindEvents();
    this._input._mtsInstance = this;
  }

  /* ── API pública ── */
  open() {
    if (this._isOpen) return this;
    if (!this._emit("open")) return this;
    this._isOpen = true;
    this._calView = 'days';  /* siempre empezar en vista de días */
    this._updatePopupContent();
    this._positionPopup();
    this._popupEl.removeAttribute("hidden");
    requestAnimationFrame(() => this._popupEl.classList.add("mts-picker-popup--visible"));
    return this;
  }

  close() {
    if (!this._isOpen) return this;
    if (!this._emit("close")) return this;
    this._isOpen = false;
    this._popupEl.classList.remove("mts-picker-popup--visible");
    const el = this._popupEl;
    setTimeout(() => { if (!this._isOpen) el.setAttribute("hidden", ""); }, 200);
    return this;
  }

  getValue() { return this._value; }

  clear() {
    this._value = null;
    this._input.value = "";
    this._clearBtn?.classList.remove("mts-picker__clear--visible");
    this._emit("change", { value: null, formatted: "" });
    return this;
  }

  destroy() {
    this._popupEl?.remove();
    this._wrapperEl?.replaceWith(this._input);
    document.removeEventListener("click", this._outsideClick);
    document.removeEventListener("keydown", this._onKeyDown);
  }

  on(event, cb)  { (this._listeners[event] = this._listeners[event] || []).push(cb); return this; }
  off(event, cb) { this._listeners[event] = (this._listeners[event] || []).filter(f => f !== cb); return this; }

  /* ── Setup ── */
  _setupInput() {
    this._wrapperEl = document.createElement("div");
    this._wrapperEl.className = "mts-picker-wrap";
    this._input.parentNode.insertBefore(this._wrapperEl, this._input);
    this._wrapperEl.appendChild(this._input);
    this._input.classList.add("mts-picker-input");
    this._input.placeholder = this.placeholder;
    if (this.readonly) this._input.readOnly = true;
    this._input.autocomplete = "off";

    const icon = document.createElement("span");
    icon.className = "mts-picker-icon " + this._iconClass();
    icon.setAttribute("aria-hidden", "true");
    this._wrapperEl.appendChild(icon);

    if (this.clearable) {
      const clear = document.createElement("button");
      clear.className = "mts-picker__clear";
      clear.setAttribute("aria-label", "Limpiar");
      clear.setAttribute("tabindex", "-1");
      clear.innerHTML = "&times;";
      clear.addEventListener("click", (e) => { e.stopPropagation(); this.clear(); this.close(); });
      this._wrapperEl.appendChild(clear);
      this._clearBtn = clear;
    }
  }

  _iconClass() { return "mts-picker-icon--date"; }

  _buildPopup() {
    this._popupEl = document.createElement("div");
    this._popupEl.className = "mts-picker-popup mts-picker-popup--" + this._modeClass();
    this._popupEl.setAttribute("hidden", "");
    this._popupEl.setAttribute("role", "dialog");
    document.body.appendChild(this._popupEl);
  }

  _modeClass() { return "date"; }

  _updatePopupContent() { /* override en cada subclase */ }

  _positionPopup() {
    const rect = this._wrapperEl.getBoundingClientRect();
    this._popupEl.style.position = "fixed";
    this._popupEl.style.zIndex   = '9999';
    this._popupEl.style.left     = rect.left + "px";
    this._popupEl.style.top      = (rect.bottom + 6) + "px";
    this._popupEl.style.minWidth = Math.max(rect.width, 280) + "px";
    requestAnimationFrame(() => {
      const pr = this._popupEl.getBoundingClientRect();
      if (pr.right  > window.innerWidth)  this._popupEl.style.left = (rect.right - pr.width) + "px";
      if (pr.bottom > window.innerHeight) this._popupEl.style.top  = (rect.top - pr.height - 6) + "px";
    });
  }

  _bindEvents() {
    this._internalClick = false;
    this._popupEl.addEventListener("mousedown", () => { this._internalClick = true; });
    this._wrapperEl.addEventListener("mousedown", () => { this._internalClick = true; });

    this._wrapperEl.addEventListener("click", (e) => {
      if (e.target === this._clearBtn) return;
      this._isOpen ? this.close() : this.open();
    });

    this._outsideClick = (e) => {
      if (this._internalClick) { this._internalClick = false; return; }
      if (!this._popupEl.contains(e.target) && !this._wrapperEl.contains(e.target)) this.close();
    };
    document.addEventListener("click", this._outsideClick);

    this._onKeyDown = (e) => { if (e.key === "Escape" && this._isOpen) this.close(); };
    document.addEventListener("keydown", this._onKeyDown);

    window.addEventListener("scroll", () => { if (this._isOpen) this._positionPopup(); }, true);
    window.addEventListener("resize", () => { if (this._isOpen) this._positionPopup(); });
  }

  /* ── Helpers calendario compartidos ── */
  _renderCalendar(container, viewDate, rangeMode = false, calIndex = 0) {
    const view = this._calView || 'days';

    if (view === 'months') {
      this._renderMonthGrid(container, viewDate, calIndex);
      return;
    }
    if (view === 'years') {
      this._renderYearGrid(container, viewDate, calIndex);
      return;
    }

    /* ── Vista de días (default) ── */
    const cal = document.createElement("div");
    cal.className = "mts-picker-cal";
    const header = document.createElement("div");
    header.className = "mts-picker-cal__header";

    const prevBtn = document.createElement("button");
    prevBtn.className = "mts-picker-cal__nav";
    prevBtn.setAttribute("aria-label", "Mes anterior");
    prevBtn.innerHTML = "&#8249;";
    prevBtn.addEventListener("click", () => {
      if (calIndex === 0) {
        this._viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        if (rangeMode) this._viewDate2 = new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() + 1, 1);
      } else {
        this._viewDate2 = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
      }
      this._updatePopupContent();
    });

    /* Título clickeable → va a vista de meses */
    const monthYear = document.createElement("button");
    monthYear.className = "mts-picker-cal__month-year mts-picker-cal__month-year--btn";
    monthYear.textContent = this._formatMonthYear(viewDate);
    monthYear.title = "Ver meses";
    monthYear.addEventListener("click", () => {
      this._calViewYear = viewDate.getFullYear();
      this._calView = 'months';
      this._updatePopupContent();
    });

    const nextBtn = document.createElement("button");
    nextBtn.className = "mts-picker-cal__nav";
    nextBtn.setAttribute("aria-label", "Mes siguiente");
    nextBtn.innerHTML = "&#8250;";
    nextBtn.addEventListener("click", () => {
      if (calIndex === 0) {
        this._viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        if (rangeMode) this._viewDate2 = new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() + 1, 1);
      } else {
        this._viewDate2 = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
      }
      this._updatePopupContent();
    });

    header.appendChild(prevBtn); header.appendChild(monthYear); header.appendChild(nextBtn);
    cal.appendChild(header);

    const weekdays = document.createElement("div");
    weekdays.className = "mts-picker-cal__weekdays";
    ["Lu","Ma","Mi","Ju","Vi","Sá","Do"].forEach(d => {
      const span = document.createElement("span"); span.textContent = d; weekdays.appendChild(span);
    });
    cal.appendChild(weekdays);

    const grid = document.createElement("div");
    grid.className = "mts-picker-cal__grid";
    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const lastDay  = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    for (let i = 0; i < startOffset; i++) {
      const e = document.createElement("span");
      e.className = "mts-picker-cal__day mts-picker-cal__day--empty";
      grid.appendChild(e);
    }

    const today = new Date();
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
      const btn  = document.createElement("button");
      btn.className  = "mts-picker-cal__day";
      btn.textContent = d;
      btn.dataset.date = date.getTime();
      if (this._isSameDay(date, today))          btn.classList.add("mts-picker-cal__day--today");
      if (this._isDisabled(date))                btn.classList.add("mts-picker-cal__day--disabled");
      if (this._isSelected(date))                btn.classList.add("mts-picker-cal__day--selected");
      if (rangeMode && this._isInRange(date))    btn.classList.add("mts-picker-cal__day--in-range");
      if (rangeMode && this._isRangeStart(date)) btn.classList.add("mts-picker-cal__day--range-start");
      if (rangeMode && this._isRangeEnd(date))   btn.classList.add("mts-picker-cal__day--range-end");

      if (!this._isDisabled(date)) {
        btn.addEventListener("click", () => this._selectDate(date));
        if (rangeMode && this._rangeStart && !this._rangeEnd) {
          btn.addEventListener("mouseenter", () => {
            this._hoverDate = date;
            if (this._refreshDayClasses) this._refreshDayClasses();
            else this._updatePopupContent();
          });
        }
      } else {
        btn.disabled = true;
      }
      grid.appendChild(btn);
    }
    cal.appendChild(grid);
    container.appendChild(cal);
  }

  /* ── Vista de MESES ── */
  _renderMonthGrid(container, viewDate, calIndex = 0) {
    const year = this._calViewYear;
    const cal  = document.createElement("div");
    cal.className = "mts-picker-cal";

    const header = document.createElement("div");
    header.className = "mts-picker-cal__header";

    const prevBtn = document.createElement("button");
    prevBtn.className = "mts-picker-cal__nav";
    prevBtn.innerHTML = "&#8249;";
    prevBtn.addEventListener("click", () => { this._calViewYear--; this._updatePopupContent(); });

    /* Año clickeable → va a vista de años */
    const yearBtn = document.createElement("button");
    yearBtn.className = "mts-picker-cal__month-year mts-picker-cal__month-year--btn";
    yearBtn.textContent = year;
    yearBtn.title = "Ver años";
    yearBtn.addEventListener("click", () => { this._calView = 'years'; this._updatePopupContent(); });

    const nextBtn = document.createElement("button");
    nextBtn.className = "mts-picker-cal__nav";
    nextBtn.innerHTML = "&#8250;";
    nextBtn.addEventListener("click", () => { this._calViewYear++; this._updatePopupContent(); });

    header.appendChild(prevBtn); header.appendChild(yearBtn); header.appendChild(nextBtn);
    cal.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "mts-picker-cal__month-grid";
    const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    const selMonth = this._value ? this._value.getMonth() : -1;
    const selYear  = this._value ? this._value.getFullYear() : -1;
    const curMonth = new Date().getMonth();
    const curYear  = new Date().getFullYear();

    MONTHS.forEach((m, i) => {
      const btn = document.createElement("button");
      btn.className = "mts-picker-cal__month-item";
      btn.textContent = m;
      if (i === selMonth && year === selYear) btn.classList.add("mts-picker-cal__month-item--selected");
      if (i === curMonth && year === curYear) btn.classList.add("mts-picker-cal__month-item--today");
      btn.addEventListener("click", () => {
        /* Navegar a ese mes y volver a vista de días */
        if (calIndex === 0) {
          this._viewDate = new Date(year, i, 1);
        } else {
          this._viewDate2 = new Date(year, i, 1);
        }
        this._calView = 'days';
        this._updatePopupContent();
      });
      grid.appendChild(btn);
    });

    cal.appendChild(grid);
    container.appendChild(cal);
  }

  /* ── Vista de AÑOS ── */
  _renderYearGrid(container, viewDate, calIndex = 0) {
    const decade = Math.floor(this._calViewYear / 10) * 10;
    const cal    = document.createElement("div");
    cal.className = "mts-picker-cal";

    const header = document.createElement("div");
    header.className = "mts-picker-cal__header";

    const prevBtn = document.createElement("button");
    prevBtn.className = "mts-picker-cal__nav";
    prevBtn.innerHTML = "&#8249;";
    prevBtn.addEventListener("click", () => { this._calViewYear -= 10; this._updatePopupContent(); });

    const rangeSpan = document.createElement("button");
    rangeSpan.className = "mts-picker-cal__month-year";
    rangeSpan.textContent = decade + " – " + (decade + 9);
    rangeSpan.style.cursor = "default";  /* no clickeable en vista de años */

    const nextBtn = document.createElement("button");
    nextBtn.className = "mts-picker-cal__nav";
    nextBtn.innerHTML = "&#8250;";
    nextBtn.addEventListener("click", () => { this._calViewYear += 10; this._updatePopupContent(); });

    header.appendChild(prevBtn); header.appendChild(rangeSpan); header.appendChild(nextBtn);
    cal.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "mts-picker-cal__year-grid";
    const selYear = this._value ? this._value.getFullYear() : -1;
    const curYear = new Date().getFullYear();

    for (let y = decade; y < decade + 10; y++) {
      const btn = document.createElement("button");
      btn.className = "mts-picker-cal__year-item";
      btn.textContent = y;
      if (y === selYear) btn.classList.add("mts-picker-cal__year-item--selected");
      if (y === curYear) btn.classList.add("mts-picker-cal__year-item--today");
      btn.addEventListener("click", () => {
        this._calViewYear = y;
        this._calView = 'months';  /* volver a vista de meses */
        this._updatePopupContent();
      });
      grid.appendChild(btn);
    }

    cal.appendChild(grid);
    container.appendChild(cal);
  }

  _buildTimeColumn(type, items, selected) {
    const col = document.createElement("div");
    col.className = "mts-picker-time__col";

    const step = (delta) => {
      if (type === "hour") {
        const min = this.startHour ?? 0;
        const max = this.endHour   ?? 23;
        let v = this._selectedHour + delta;
        if (v < min) v = max;
        if (v > max) v = min;
        this._selectedHour = v;
      } else {
        const mins = this._buildMinutes();
        const idx  = mins.indexOf(this._selectedMinute);
        const next = idx + delta;
        this._selectedMinute = mins[(next + mins.length) % mins.length];
      }
      this._updatePopupContent();
    };

    /* Flecha arriba */
    const upBtn = document.createElement("button");
    upBtn.className = "mts-picker-time__arrow mts-picker-time__arrow--up";
    upBtn.innerHTML = "&#8679;";
    upBtn.addEventListener("click", () => step(-1));

    /* ── 5 items fijos: 2 arriba del seleccionado, el activo, 2 abajo ── */
    const idx = items.indexOf(selected);
    const visibleItems = [-2, -1, 0, 1, 2].map(offset => {
      const i = (idx + offset + items.length) % items.length;
      return items[i];
    });

    const list = document.createElement("div");
    list.className = "mts-picker-time__list mts-picker-time__list--fixed";

    visibleItems.forEach((val, pos) => {
      const item = document.createElement("div");
      item.className = "mts-picker-time__item";
      item.textContent = String(val).padStart(2, "0");
      if (pos === 2) item.classList.add("mts-picker-time__item--selected"); // centro = posición 2
      item.addEventListener("click", () => {
        if (type === "hour") this._selectedHour   = val;
        else                  this._selectedMinute = val;
        this._updatePopupContent();
      });
      list.appendChild(item);
    });

    /* Flecha abajo */
    const downBtn = document.createElement("button");
    downBtn.className = "mts-picker-time__arrow mts-picker-time__arrow--down";
    downBtn.innerHTML = "&#8681;";
    downBtn.addEventListener("click", () => step(1));

    col.appendChild(upBtn);
    col.appendChild(list);
    col.appendChild(downBtn);
    return col;
  }

  _buildTimeSeparator() {
    const sep = document.createElement("div");
    sep.className = "mts-picker-time__separator";
    sep.textContent = ":";
    return sep;
  }

  _buildHours() {
    const h = []; for (let i = this.startHour ?? 0; i <= (this.endHour ?? 23); i++) h.push(i); return h;
  }

  _buildMinutes() {
    const m = []; for (let i = 0; i < 60; i += (this.timeStep ?? 5)) m.push(i); return m;
  }

  _renderFooter(container, todayLabel = "Hoy") {
    /* Textos configurables: btnToday / btnNow / btnAccept */
    const labelLeft  = this.btnNow || this.btnToday || todayLabel;
    const labelRight = this.btnAccept || "Aceptar";
    const isTime     = todayLabel === "Ahora";

    const footer = document.createElement("div");
    footer.className = "mts-picker-footer";

    const todayBtn = document.createElement("button");
    todayBtn.className   = "mts-btn mts-btn--ghost mts-btn--sm";
    todayBtn.textContent = labelLeft;
    todayBtn.addEventListener("click", () => {
      const now = new Date();
      this._selectedHour   = now.getHours();
      this._selectedMinute = Math.round(now.getMinutes() / (this.timeStep ?? 5)) * (this.timeStep ?? 5);
      this._viewDate       = new Date(now);
      if (!isTime) this._selectDate(now);
      else this._updatePopupContent();
    });

    const okBtn = document.createElement("button");
    okBtn.className   = "mts-btn mts-btn--primary mts-btn--sm";
    okBtn.textContent = labelRight;
    okBtn.addEventListener("click", () => { this._confirmSelection(); this.close(); });

    footer.appendChild(todayBtn); footer.appendChild(okBtn);
    container.appendChild(footer);
  }

  _confirmSelection() { /* override */ }
  _selectDate(date)   { /* override */ }
  _isSelected(date)   { return false; }

  _isDisabled(date) {
    if (this.minDate && date < this.minDate) return true;
    if (this.maxDate && date > this.maxDate) return true;
    if (this.disabledDays?.includes(date.getDay())) return true;
    return false;
  }

  _isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  _isInRange(date)    { return false; }
  _isRangeStart(date) { return false; }
  _isRangeEnd(date)   { return false; }

  _formatMonthYear(date) {
    return date.toLocaleDateString(this.locale, { month: "long", year: "numeric" })
      .replace(/^\w/, c => c.toUpperCase());
  }

  _formatDate(date) {
    if (!date) return "";
    const d = String(date.getDate()).padStart(2,"0");
    const m = String(date.getMonth()+1).padStart(2,"0");
    return (this.format || "DD/MM/YYYY").replace("DD",d).replace("MM",m).replace("YYYY",date.getFullYear());
  }

  _formatTime(h, m) {
    return String(h).padStart(2,"0") + ":" + String(m).padStart(2,"0");
  }

  _emit(eventName, detail = {}) {
    let cancelled = false;
    const ev = { type: eventName, target: this, detail, preventDefault: () => { cancelled = true; } };
    (this._listeners[eventName] || []).forEach(fn => fn(ev));
    if (cancelled) return false;
    this._input.dispatchEvent(new CustomEvent("mts:picker:" + eventName, {
      bubbles: true, cancelable: true, detail: { picker: this, ...detail },
    }));
    return !cancelled;
  }
};

/* Alias de compatibilidad / Compatibility alias */
window.MTS.Picker = window.MTS.DatePicker;
