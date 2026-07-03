# MTS.DatePicker

Date, time, datetime, range, month and week selectors. Each type is an independent class that extends a shared base (`MTS.DatePicker.Base`). Zero dependencies.

---

## Installation

```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-date-picker.css">

<!-- Base first, then only the picker types you use -->
<script src="matios-ui-date-picker-base.js"></script>
<script src="matios-ui-date-picker-date.js"></script>
<script src="matios-ui-date-picker-time.js"></script>
<script src="matios-ui-date-picker-datetime.js"></script>
<script src="matios-ui-date-picker-daterange.js"></script>
<script src="matios-ui-date-picker-month.js"></script>
<script src="matios-ui-date-picker-week.js"></script>

<!-- Optional: localized chrome and messages (load AFTER base/matios-ui-i18n.js) -->
<script src="../../base/matios-ui-i18n.js"></script>
<script src="matios-ui-date-picker-i18n.js"></script>
```

`matios-ui-date-picker-base.js` must load before every type file. `MTS.DatePicker.linkRange` is defined in the base file.

---

## Usage

### Date only — `MTS.DatePicker.Date`

```js
var dp = new MTS.DatePicker.Date('#my-input', {
  format:       'DD/MM/YYYY',
  clearable:    true,
  minDate:      new Date('2024-01-01'),
  maxDate:      new Date('2025-12-31'),
  disabledDays: [0, 6],
  onChange:     function (e) { console.log(e.detail.value, e.detail.formatted); }
});

dp.setValue(new Date());
dp.getValue(); // -> Date
```

### Time only — `MTS.DatePicker.Time`

```js
new MTS.DatePicker.Time('#my-input', {
  timeStep:  15,
  startHour: 8,
  endHour:   20,
  btnNow:    'Now',
  btnAccept: 'Accept',
  onChange:  function (e) { console.log(e.detail.formatted); } // -> '09:30'
});
```

Value is confirmed with the footer **Now / Accept** buttons (this type does not close on select).

### Date + time — `MTS.DatePicker.DateTime`

```js
new MTS.DatePicker.DateTime('#my-input', {
  format:    'DD/MM/YYYY',
  timeStep:  5,
  btnToday:  'Today',
  btnAccept: 'Accept',
  onChange:  function (e) { console.log(e.detail.value, e.detail.formatted); }
});
```

### Date range — `MTS.DatePicker.DateRange`

```js
var rp = new MTS.DatePicker.DateRange('#my-input', {
  format:    'DD/MM/YYYY',
  btnClear:  'Clear',
  btnAccept: 'Apply',
  onChange:  function (e) {
    console.log(e.detail.value.start); // Date
    console.log(e.detail.value.end);   // Date
    console.log(e.detail.formatted);   // '01/03/2025 → 15/03/2025'
  }
});

rp.setValue([new Date('2025-03-01'), new Date('2025-03-15')]);
rp.getValue(); // -> { start: Date, end: Date }
```

Two calendars; first click sets the start, second sets the end. Confirm with the footer **Apply** button.

### Month & year — `MTS.DatePicker.Month`

```js
new MTS.DatePicker.Month('#my-input', {
  onChange: function (e) { console.log(e.detail.value, e.detail.formatted); } // -> '03/2025'
});
```

`getValue()` returns a `Date` set to the first day of the selected month.

### Week — `MTS.DatePicker.Week`

```js
new MTS.DatePicker.Week('#my-input', {
  onChange: function (e) {
    console.log(e.detail.value.start); // Monday of the week
    console.log(e.detail.value.end);   // Sunday of the week
    console.log(e.detail.formatted);   // 'Week 12 - 2025'
  }
});
```

---

## Options

Common across all types (constructed on `MTS.DatePicker.Base`):

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `locale` | `string` | `'es-CL'` | Locale for the calendar header month/year label only (`toLocaleDateString`). Weekday and month-grid labels come from the i18n chrome — see [i18n](#i18n). |
| `format` | `string` | `'DD/MM/YYYY'` | Display mask (`DD`, `MM`, `YYYY`). Applies to `Date` / `DateTime` / `DateRange`. |
| `minDate` | `Date` \| `string` | `null` | Earliest selectable date. |
| `maxDate` | `Date` \| `string` | `null` | Latest selectable date. |
| `disabledDays` | `number[]` | `[]` | Weekdays to disable (`0` = Sunday … `6` = Saturday). |
| `clearable` | `boolean` | `true` | Show the clear (`×`) control. |
| `readonly` | `boolean` | `true` | Render the bound input read-only. |
| `placeholder` | `string` | per type | Input placeholder. |
| `label` | `string` | `''` | Rendered as a `<label>` only when the host is a container element (not an `<input>`). |
| `closeOnSelect` | `boolean` | per type | Close the popup on selection. Default `true` for `Date` / `Month` / `Week`, `false` for `Time` / `DateTime` / `DateRange`. |
| `required` | `boolean` | `false` | Opt-in `validate()` — empty when `getValue() === null`. |
| `errorMessage` | `string` | `null` | Overrides the localized `required` message. |
| `onChange` | `function` | — | Alias: `onSelect`. Receives `(e)` with `e.detail`. |
| `onOpen` | `function` | — | Popup opened. |
| `onClose` | `function` | — | Popup closed. |

Type-specific options:

| Option | Type | Default | Types | Description |
|--------|------|---------|-------|-------------|
| `timeStep` | `number` | `5` | `Time`, `DateTime` | Minute step. |
| `startHour` | `number` | `0` | `Time`, `DateTime` | First hour listed. |
| `endHour` | `number` | `23` | `Time`, `DateTime` | Last hour listed. |
| `btnToday` | `string` | localized | `DateTime` | Footer left-button label. |
| `btnNow` | `string` | localized | `Time` | Footer left-button label. |
| `btnAccept` | `string` | localized | `Time`, `DateTime`, `DateRange` | Footer confirm-button label. |
| `btnClear` | `string` | localized | `DateRange` | Footer clear-button label. |

Only `Time`, `DateTime` and `DateRange` render a footer; `Date`, `Month` and `Week` commit on selection (subject to `closeOnSelect`), so the footer button options do not apply to them.

---

## API

Shared by every picker type:

| Method | Description |
|--------|-------------|
| `open()` | Open the popup (chainable). |
| `close()` | Close the popup (chainable). |
| `getValue()` | Value by type: `Date`, or `{ start, end }` for `DateRange` / `Week` (`Time` returns the confirmed `Date`). |
| `setValue(value)` | Set the value (chainable). `DateRange` takes `[start, end]`. |
| `setMinDate(date)` | Update `minDate` (`Date` \| `string` \| `null`) and refresh the open calendar live (chainable). |
| `setMaxDate(date)` | Update `maxDate` (`Date` \| `string` \| `null`) and refresh the open calendar live (chainable). |
| `clear()` | Clear the value and emit `change` with `value: null` (chainable). |
| `validate()` | Validate `required` (empty = `getValue() === null`); toggles inline error and emits `validate` -> returns `boolean`. |
| `setError(msg)` | Set the inline error and error state (chainable). |
| `clearError()` | Clear the inline error (chainable). |
| `destroy()` | Remove the popup and restore/clear the host element. |
| `on(event, cb)` | Listen to `'change'`, `'open'`, `'close'`, `'validate'` (chainable). |
| `off(event, cb)` | Remove a listener (chainable). |

Setting a value auto-clears any standing validation error (the base subscribes to its own `change` event).

---

## Linked range (`linkRange`)

Link two **independent** pickers as a "From / To" range — the *to* can't be earlier than the *from* (and the *from* can't go past the *to*). The two fields are laid out wherever you want.

```js
var from = new MTS.DatePicker.Date('#from', { label: 'From' });
var to   = new MTS.DatePicker.Date('#to',   { label: 'To' });

var link = MTS.DatePicker.linkRange(from, to, {
  allowSameDay: true, // allow from === to (default true)
  clampTo:      true  // if changing 'from' leaves 'to' earlier, snap 'to' to 'from' (default true)
});
// link.destroy() to unlink
```

It wires `to.setMinDate(from)` and `from.setMaxDate(to)` on each change, with live calendar refresh. When both pickers are `Time` / `DateTime`, the link becomes time-aware and enforces a 1-hour minimum gap (`allowSameDay` / `clampTo` still apply). For a single combined two-calendar control, use `MTS.DatePicker.DateRange` instead.

---

## Events

| Callback | DOM event | Payload (`e.detail`) |
|----------|-----------|----------------------|
| `onChange` / `on('change', fn)` | `mts:picker:change` | `{ value, formatted }` |
| `onOpen` / `on('open', fn)` | `mts:picker:open` | `{}` |
| `onClose` / `on('close', fn)` | `mts:picker:close` | `{}` |
| `on('validate', fn)` | `mts:picker:validate` | `{ valid, errors }` |

`value` is a `Date`, `null`, or `{ start, end }` depending on type; `formatted` is the current input string. DOM events bubble from the bound input and also carry `detail.picker` (the instance). Calling `preventDefault()` on the `open` / `close` callback event cancels the transition.

```js
document.getElementById('my-input')
  .addEventListener('mts:picker:change', function (e) {
    console.log(e.detail.value, e.detail.formatted);
  });
```

---

## i18n

Localized chrome and messages read from the global `MTS.getString()['MTS.DatePicker']` namespace (provided by `matios-ui-date-picker-i18n.js`). Set the language once at startup with `MTS.setLanguage('es' | 'en' | 'pt')`; there is no per-instance `locale` for the i18n text (the `locale` option only affects the calendar header's month/year formatting). Without the i18n file, the component falls back to Spanish defaults.

Namespace: `MTS.DatePicker`

| Group | Key | Notes |
|-------|-----|-------|
| `messages` | `required` | Default `validate()` error (overridable per instance via `errorMessage`). |
| `chrome` | `weekdays` | 7-item array, Monday-first. |
| `chrome` | `monthsShort` | 12-item array (month / month-year grids). |
| `chrome` | `today` | Footer left button (`DateTime`). |
| `chrome` | `now` | Footer left button (`Time`). |
| `chrome` | `accept` | Footer confirm button. |
| `chrome` | `clear` | `DateRange` footer clear button. |
| `chrome` | `week` | `Week` value prefix (e.g. `Week 12 - 2025`). |
| `chrome` | `clearAria` | Clear control `aria-label`. |
| `chrome` | `prevMonth` / `nextMonth` | Calendar nav `aria-label`s. |
| `chrome` | `viewMonths` / `viewYears` | Header drill-down `title`s. |

Per-instance `btnToday` / `btnNow` / `btnAccept` / `btnClear` options override the localized footer labels.

```js
MTS.setLanguage('en');
new MTS.DatePicker.Date('#my-input');
```

---

## CSS Classes

Validation (form-field contract):

- `.mts-form-error` — inline message, shared, single source in `base/matios-ui-base.css`.
- `.mts-label--required` — red asterisk on the label.
- `.mts-picker-wrap--error` — error state on the control (red border), toggled by `setError()`.

---

## Accessibility

- The popup closes on `Esc` and on outside click.
- `disabledDays`, `minDate` and `maxDate` are skipped: disabled days are non-interactive; out-of-range times render but are not selectable.
- The clear control and calendar nav carry localized `aria-label`s; provide a label on the bound input so the picker has an accessible name.
