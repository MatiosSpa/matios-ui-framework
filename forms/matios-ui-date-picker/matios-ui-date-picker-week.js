/* ============================================================
   MATIOS UI — matios-ui-picker-week.js  v2.0.0
   MTS.DatePicker.Week — Selector de semana
   Requiere: matios-ui-picker-base.js
   ============================================================ */

MTS.DatePicker.Week = class MtsDatePickerWeek extends MTS.DatePicker.Base {

  constructor(selector, options = {}) {
    options.placeholder  = options.placeholder || "Semana 01 - 2025";
    options.closeOnSelect = options.closeOnSelect ?? true;
    super(selector, options);
    this._viewDate   = new Date();
    this._weekStart  = null;
    this._weekEnd    = null;
  }

  setValue(date) {
    if (date) { this._setWeekFromDate(new Date(date)); this._updateInputValue(); }
    return this;
  }

  _modeClass() { return "week"; }

  _setWeekFromDate(date) {
    const d   = new Date(date);
    const day = d.getDay() === 0 ? 6 : d.getDay() - 1;
    d.setDate(d.getDate() - day);
    this._weekStart = new Date(d);
    d.setDate(d.getDate() + 6);
    this._weekEnd = new Date(d);
    this._value   = { start: new Date(this._weekStart), end: new Date(this._weekEnd) };
  }

  _getWeekNumber(date) {
    const d   = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    const year = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - year) / 86400000) + 1) / 7);
  }

  _updatePopupContent() {
    this._popupEl.innerHTML = "";
    this._renderCalendar(this._popupEl, this._viewDate, false, 0);
  }

  _selectDate(date) {
    this._setWeekFromDate(date);
    this._viewDate = new Date(this._weekStart);
    this._updateInputValue();
    this._emit("change", { value: this._value, formatted: this._input.value });
    if (this.closeOnSelect) this.close();
    else this._updatePopupContent();
  }

  _isSelected(date) {
    if (!this._weekStart || !this._weekEnd) return false;
    return date >= this._weekStart && date <= this._weekEnd;
  }

  _isInRange(date) { return this._isSelected(date); }

  _updateInputValue() {
    if (!this._value) { this._input.value = ""; return; }
    const w = this._getWeekNumber(this._weekStart);
    this._input.value = this._chrome("week", "Semana") + " " + String(w).padStart(2,"0") + " - " + this._weekStart.getFullYear();
    this._clearBtn?.classList.add("mts-picker__clear--visible");
  }
};
