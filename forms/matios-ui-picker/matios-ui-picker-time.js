/* ============================================================
   MATIOS UI — matios-ui-picker-time.js  v2.0.0
   MTS.Picker.Time — Selector de hora
   Requiere: matios-ui-picker-base.js
   ============================================================ */

MTS.Picker.Time = class MtsPickerTime extends MTS.Picker.Base {

  constructor(selector, options = {}) {
    options.placeholder  = options.placeholder || "HH:MM";
    options.closeOnSelect = options.closeOnSelect ?? false;
    super(selector, options);
    this.timeStep       = options.timeStep  || 5;
    this.startHour      = options.startHour ?? 0;
    this.endHour        = options.endHour   ?? 23;
    const now = new Date();
    this._selectedHour   = now.getHours();
    this._selectedMinute = Math.round(now.getMinutes() / this.timeStep) * this.timeStep;
  }

  setValue(date) {
    const d = date ? new Date(date) : null;
    if (d) {
      this._selectedHour   = d.getHours();
      this._selectedMinute = d.getMinutes();
      this._value          = d;
      this._updateInputValue();
    }
    return this;
  }

  _modeClass()  { return "time"; }
  _iconClass()  { return "mts-picker-icon--time"; }

  _updatePopupContent() {
    this._popupEl.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "mts-picker-time";
    wrap.appendChild(this._buildTimeColumn("hour",   this._buildHours(),   this._selectedHour));
    wrap.appendChild(this._buildTimeSeparator());
    wrap.appendChild(this._buildTimeColumn("minute", this._buildMinutes(), this._selectedMinute));
    this._popupEl.appendChild(wrap);
    this._renderFooter(this._popupEl, "Ahora");
  }

  _confirmSelection() {
    if (!this._value) this._value = new Date();
    this._value.setHours(this._selectedHour, this._selectedMinute, 0, 0);
    this._updateInputValue();
    this._emit("change", { value: this._value, formatted: this._input.value });
  }

  _updateInputValue() {
    this._input.value = this._value
      ? this._formatTime(this._value.getHours(), this._value.getMinutes())
      : "";
    if (this._value) this._clearBtn?.classList.add("mts-picker__clear--visible");
    else             this._clearBtn?.classList.remove("mts-picker__clear--visible");
  }
};
