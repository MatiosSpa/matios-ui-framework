/* ============================================================
   MATIOS UI — matios-ui-picker-datetime.js  v2.0.0
   MTS.Picker.DateTime — Selector de fecha y hora
   Requiere: matios-ui-picker-base.js
   ============================================================ */

MTS.Picker.DateTime = class MtsPickerDateTime extends MTS.Picker.Base {

  constructor(selector, options = {}) {
    options.placeholder  = options.placeholder || "DD/MM/YYYY HH:MM";
    options.closeOnSelect = options.closeOnSelect ?? false;
    options.format        = options.format || "DD/MM/YYYY";  // setear ANTES de super()
    super(selector, options);
    this.format          = options.format;
    this.timeStep        = options.timeStep  || 5;
    this.startHour       = options.startHour ?? 0;
    this.endHour         = options.endHour   ?? 23;
    this._viewDate       = new Date();
    const now = new Date();
    this._selectedHour   = now.getHours();
    this._selectedMinute = Math.round(now.getMinutes() / this.timeStep) * this.timeStep;
  }

  setValue(date) {
    this._value = date ? new Date(date) : null;
    if (this._value) {
      this._viewDate       = new Date(this._value);
      this._selectedHour   = this._value.getHours();
      this._selectedMinute = this._value.getMinutes();
      this._updateInputValue();
    }
    return this;
  }

  _modeClass()     { return "datetime"; }
  _defaultFormat() { return "DD/MM/YYYY"; }

  _updatePopupContent() {
    this._popupEl.innerHTML = "";
    this._renderCalendar(this._popupEl, this._viewDate);
    const divider = document.createElement("div");
    divider.className = "mts-picker-datetime__divider";
    this._popupEl.appendChild(divider);
    const wrap = document.createElement("div");
    wrap.className = "mts-picker-time";
    wrap.appendChild(this._buildTimeColumn("hour",   this._buildHours(),   this._selectedHour));
    wrap.appendChild(this._buildTimeSeparator());
    wrap.appendChild(this._buildTimeColumn("minute", this._buildMinutes(), this._selectedMinute));
    this._popupEl.appendChild(wrap);
    this._renderFooter(this._popupEl, "Hoy");
  }

  _selectDate(date) {
    if (!this._value) this._value = new Date();
    this._value = new Date(date.getFullYear(), date.getMonth(), date.getDate(),
      this._selectedHour, this._selectedMinute, 0);
    this._viewDate = new Date(this._value);
    this._updatePopupContent();
  }

  _confirmSelection() {
    if (!this._value) this._value = new Date();
    this._value.setHours(this._selectedHour, this._selectedMinute, 0, 0);
    this._updateInputValue();
    this._emit("change", { value: this._value, formatted: this._input.value });
  }

  _isSelected(date) {
    return this._value ? this._isSameDay(date, this._value) : false;
  }

  _updateInputValue() {
    this._input.value = this._value
      ? this._formatDate(this._value) + " " + this._formatTime(this._value.getHours(), this._value.getMinutes())
      : "";
    if (this._value) this._clearBtn?.classList.add("mts-picker__clear--visible");
    else             this._clearBtn?.classList.remove("mts-picker__clear--visible");
  }
};
