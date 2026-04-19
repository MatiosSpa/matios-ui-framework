/* ============================================================
   MATIOS UI — matios-ui-picker-daterange.js  v2.0.0
   MTS.DatePicker.DateRange — Selector de rango de fechas
   Requiere: matios-ui-picker-base.js
   ============================================================ */

MTS.DatePicker.DateRange = class MtsDatePickerDateRange extends MTS.DatePicker.Base {

  constructor(selector, options = {}) {
    options.placeholder  = options.placeholder || "DD/MM/YYYY → DD/MM/YYYY";
    options.closeOnSelect = options.closeOnSelect ?? false;  // NO cerrar — esperar que el usuario complete el rango
    options.format        = options.format || "DD/MM/YYYY";
    super(selector, options);
    this.format      = options.format;
    this.btnClear    = options.btnClear  || null;
    this.btnAccept   = options.btnAccept || null;
    this._viewDate   = new Date();
    this._viewDate2  = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
    this._rangeStart = null;
    this._rangeEnd   = null;
    this._hoverDate  = null;
  }

  setValue(dates) {
    if (Array.isArray(dates)) {
      this._rangeStart = dates[0] ? new Date(dates[0]) : null;
      this._rangeEnd   = dates[1] ? new Date(dates[1]) : null;
      this._value      = { start: this._rangeStart, end: this._rangeEnd };
      this._updateInputValue();
    }
    return this;
  }

  getValue() { return this._value; }

  clear() {
    this._value = null; this._rangeStart = null; this._rangeEnd = null;
    this._input.value = "";
    this._clearBtn?.classList.remove("mts-picker__clear--visible");
    this._emit("change", { value: null, formatted: "" });
    return this;
  }

  _modeClass() { return "daterange"; }

  _updatePopupContent() {
    this._popupEl.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "mts-picker-range";
    this._renderCalendar(wrap, this._viewDate,  true, 0);
    this._renderCalendar(wrap, this._viewDate2, true, 1);
    this._popupEl.appendChild(wrap);

    /* Info del rango */
    const info = document.createElement("div");
    info.className = "mts-picker-range__info";
    const s = this._rangeStart ? this._formatDate(this._rangeStart) : "—";
    const e = this._rangeEnd   ? this._formatDate(this._rangeEnd)   : "—";
    info.innerHTML = "<span>" + s + "</span><span class=\"mts-picker-range__arrow\">→</span><span>" + e + "</span>";
    this._popupEl.appendChild(info);

    /* Footer con Limpiar + Aceptar */
    this._renderFooter(this._popupEl, "Limpiar");
  }

  /* Sobreescribir _renderFooter para DateRange */
  _renderFooter(container, clearLabel) {
    const labelClear  = this.btnClear  || clearLabel || "Limpiar";
    const labelAccept = this.btnAccept || "Aceptar";

    const footer = document.createElement("div");
    footer.className = "mts-picker-footer";

    const clearBtn = document.createElement("button");
    clearBtn.className   = "mts-btn mts-btn--ghost mts-btn--sm";
    clearBtn.textContent = labelClear;
    clearBtn.addEventListener("click", () => { this.clear(); this._updatePopupContent(); });

    const okBtn = document.createElement("button");
    okBtn.className   = "mts-btn mts-btn--primary mts-btn--sm";
    okBtn.textContent = labelAccept;
    okBtn.disabled    = !this._rangeStart || !this._rangeEnd;
    okBtn.addEventListener("click", () => {
      if (this._rangeStart && this._rangeEnd) {
        this._value = { start: this._rangeStart, end: this._rangeEnd };
        this._updateInputValue();
        this._emit("change", { value: this._value, formatted: this._input.value });
        this.close();
      }
    });

    footer.appendChild(clearBtn); footer.appendChild(okBtn);
    container.appendChild(footer);
  }

  _selectDate(date) {
    if (!this._rangeStart || (this._rangeStart && this._rangeEnd)) {
      /* Primer click — inicio del rango */
      this._rangeStart = new Date(date);
      this._rangeEnd   = null;
      this._hoverDate  = null;
      this._refreshDayClasses();   // actualizar clases sin reconstruir DOM
    } else {
      /* Segundo click — fin del rango */
      if (date < this._rangeStart) {
        this._rangeEnd   = new Date(this._rangeStart);
        this._rangeStart = new Date(date);
      } else {
        this._rangeEnd = new Date(date);
      }
      this._value = { start: this._rangeStart, end: this._rangeEnd };
      this._updateInputValue();
      this._emit("change", { value: this._value, formatted: this._input.value });
      this._refreshDayClasses();
      /* Botón "Aceptar" cierra — no cerramos automáticamente */
    }
  }

  /* Actualiza clases CSS de los días sin reconstruir el popup */
  _refreshDayClasses() {
    const buttons = this._popupEl.querySelectorAll(".mts-picker-cal__day:not(.mts-picker-cal__day--empty)");
    buttons.forEach(btn => {
      /* Leer la fecha del atributo data-date */
      const ts = btn.dataset.date;
      if (!ts) return;
      const date = new Date(Number(ts));

      btn.classList.remove(
        "mts-picker-cal__day--selected",
        "mts-picker-cal__day--range-start",
        "mts-picker-cal__day--range-end",
        "mts-picker-cal__day--in-range"
      );

      if (this._isRangeStart(date)) btn.classList.add("mts-picker-cal__day--range-start");
      if (this._isRangeEnd(date))   btn.classList.add("mts-picker-cal__day--range-end");
      if (this._isInRange(date))    btn.classList.add("mts-picker-cal__day--in-range");
      if (this._isSelected(date))   btn.classList.add("mts-picker-cal__day--selected");
    });

    /* Actualizar info del rango */
    let info = this._popupEl.querySelector(".mts-picker-range__info");
    if (!info) {
      info = document.createElement("div");
      info.className = "mts-picker-range__info";
      /* insertar antes del footer */
      const footer = this._popupEl.querySelector(".mts-picker-footer");
      if (footer) this._popupEl.insertBefore(info, footer);
      else this._popupEl.appendChild(info);
    }
    const s = this._rangeStart ? this._formatDate(this._rangeStart) : "—";
    const e = this._rangeEnd   ? this._formatDate(this._rangeEnd)   : "—";
    info.innerHTML = "<span>" + s + "</span><span class=\"mts-picker-range__arrow\">→</span><span>" + e + "</span>";

    /* Habilitar/deshabilitar botón Aceptar */
    const okBtn = this._popupEl.querySelector(".mts-picker-footer .mts-btn--primary");
    if (okBtn) okBtn.disabled = !this._rangeStart || !this._rangeEnd;
  }

  _isSelected(date)    { return (this._rangeStart && this._isSameDay(date, this._rangeStart)) || (this._rangeEnd && this._isSameDay(date, this._rangeEnd)); }
  _isRangeStart(date)  { return this._rangeStart && this._isSameDay(date, this._rangeStart); }
  _isRangeEnd(date)    { return this._rangeEnd   && this._isSameDay(date, this._rangeEnd); }
  _isInRange(date) {
    const start = this._rangeStart;
    const end   = this._rangeEnd || this._hoverDate;
    if (!start || !end) return false;
    const [a,b] = start <= end ? [start,end] : [end,start];
    return date > a && date < b;
  }

  _updateInputValue() {
    const s = this._rangeStart ? this._formatDate(this._rangeStart) : "";
    const e = this._rangeEnd   ? this._formatDate(this._rangeEnd)   : "";
    this._input.value = s && e ? s + " → " + e : s;
    if (this._rangeStart) this._clearBtn?.classList.add("mts-picker__clear--visible");
    else                   this._clearBtn?.classList.remove("mts-picker__clear--visible");
  }
};
