/* ============================================================
   MATIOS UI — matios-ui-picker-month.js  v2.0.0
   MTS.DatePicker.Month — Selector de mes/año
   Requiere: matios-ui-picker-base.js
   ============================================================ */

MTS.DatePicker.Month = class MtsDatePickerMonth extends MTS.DatePicker.Base {

  constructor(selector, options = {}) {
    options.placeholder  = options.placeholder || "MM/YYYY";
    options.closeOnSelect = options.closeOnSelect ?? true;
    super(selector, options);
    this._viewYear = new Date().getFullYear();
  }

  setValue(date) {
    this._value = date ? new Date(date) : null;
    if (this._value) { this._viewYear = this._value.getFullYear(); this._updateInputValue(); }
    return this;
  }

  _modeClass() { return "month"; }

  _updatePopupContent() {
    this._popupEl.innerHTML = "";
    const header = document.createElement("div");
    header.className = "mts-picker-cal__header";

    const prevBtn = document.createElement("button");
    prevBtn.className = "mts-picker-cal__nav"; prevBtn.innerHTML = "&#8249;";
    prevBtn.addEventListener("click", () => { this._viewYear--; this._updatePopupContent(); });

    const yearSpan = document.createElement("span");
    yearSpan.className = "mts-picker-cal__month-year";
    yearSpan.textContent = this._viewYear;

    const nextBtn = document.createElement("button");
    nextBtn.className = "mts-picker-cal__nav"; nextBtn.innerHTML = "&#8250;";
    nextBtn.addEventListener("click", () => { this._viewYear++; this._updatePopupContent(); });

    header.appendChild(prevBtn); header.appendChild(yearSpan); header.appendChild(nextBtn);
    this._popupEl.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "mts-picker-month__grid";
    const months = this._chrome("monthsShort", ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]);

    months.forEach((m, i) => {
      const btn = document.createElement("button");
      btn.className   = "mts-picker-month__item";
      btn.textContent = m;
      const isSelected = this._value &&
        this._value.getMonth() === i &&
        this._value.getFullYear() === this._viewYear;
      if (isSelected) btn.classList.add("mts-picker-month__item--selected");
      btn.addEventListener("click", () => {
        this._value = new Date(this._viewYear, i, 1);
        this._updateInputValue();
        this._emit("change", { value: this._value, formatted: this._input.value });
        if (this.closeOnSelect) this.close();
        else this._updatePopupContent();
      });
      grid.appendChild(btn);
    });
    this._popupEl.appendChild(grid);
  }

  _updateInputValue() {
    if (!this._value) { this._input.value = ""; return; }
    const m = String(this._value.getMonth() + 1).padStart(2,"0");
    this._input.value = m + "/" + this._value.getFullYear();
    this._clearBtn?.classList.add("mts-picker__clear--visible");
  }
};
