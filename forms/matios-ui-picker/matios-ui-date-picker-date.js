/* ============================================================
   MATIOS UI — matios-ui-picker-date.js  v2.0.0
   MTS.DatePicker.Date — Selector de fecha
   Requiere: matios-ui-picker-base.js
   ============================================================ */

MTS.DatePicker.Date = class MtsDatePickerDate extends MTS.DatePicker.Base {

  constructor(selector, options = {}) {
    options.placeholder  = options.placeholder || "DD/MM/YYYY";
    options.closeOnSelect = options.closeOnSelect ?? true;
    options.format        = options.format || "DD/MM/YYYY";
    super(selector, options);
    this.format    = options.format;
    this._viewDate = new Date();
  }

  setValue(date) {
    this._value    = date ? new Date(date) : null;
    this._viewDate = this._value ? new Date(this._value) : new Date();
    this._updateInputValue();
    return this;
  }

  _modeClass() { return "date"; }

  _updatePopupContent() {
    this._popupEl.innerHTML = "";
    this._renderCalendar(this._popupEl, this._viewDate);
  }

  _selectDate(date) {
    this._value = new Date(date);
    this._viewDate = new Date(date);
    this._updateInputValue();
    this._emit("change", { value: this._value, formatted: this._input.value });
    if (this.closeOnSelect) this.close();
    else this._updatePopupContent();
  }

  _isSelected(date) {
    return this._value ? this._isSameDay(date, this._value) : false;
  }

  _updateInputValue() {
    this._input.value = this._value ? this._formatDate(this._value) : "";
    if (this._value) this._clearBtn?.classList.add("mts-picker__clear--visible");
    else             this._clearBtn?.classList.remove("mts-picker__clear--visible");
  }
};
