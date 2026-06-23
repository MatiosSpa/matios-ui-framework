# MTS.DatePicker

Date, time, range, month and week selectors. Each type is an independent class extending a common base. Zero dependencies.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-picker.css">

<!-- Load only what you need -->
<script src="matios-ui-picker-base.js"></script>
<script src="matios-ui-picker-date.js"></script>
<script src="matios-ui-picker-time.js"></script>
<script src="matios-ui-picker-datetime.js"></script>
<script src="matios-ui-picker-daterange.js"></script>
<script src="matios-ui-picker-month.js"></script>
<script src="matios-ui-picker-week.js"></script>
```

---

## Usage

### Date only — `MTS.DatePicker.Date`

```js
const dp = new MTS.DatePicker.Date('#my-input', {
  format:       'DD/MM/YYYY',
  locale:       'es-CL',
  clearable:    true,
  minDate:      new Date('2024-01-01'),
  maxDate:      new Date('2025-12-31'),
  disabledDays: [0, 6], // 0 = Sunday, 6 = Saturday
  onChange:     function (e) { console.log(e.detail.value, e.detail.formatted); },
});

dp.setValue(new Date());
dp.getValue(); // → Date
```

### Time only — `MTS.DatePicker.Time`

```js
new MTS.DatePicker.Time('#my-input', {
  timeStep:  15,  // minutes
  startHour: 8,
  endHour:   20,
  btnNow:    'Now',
  btnAccept: 'Accept',
  onChange:  function (e) { console.log(e.detail.formatted); }, // → '09:30'
});
```

### Date + time — `MTS.DatePicker.DateTime`

```js
new MTS.DatePicker.DateTime('#my-input', {
  format: 'DD/MM/YYYY', timeStep: 5, btnToday: 'Today', btnAccept: 'Accept',
  onChange: function (e) { console.log(e.detail.value, e.detail.formatted); },
});
```

### Date range — `MTS.DatePicker.DateRange`

```js
const rp = new MTS.DatePicker.DateRange('#my-input', {
  format: 'DD/MM/YYYY', btnClear: 'Clear', btnAccept: 'Apply',
  onChange: function (e) {
    console.log(e.detail.value.start); // Date
    console.log(e.detail.value.end);   // Date
    console.log(e.detail.formatted);   // '01/03/2025 → 15/03/2025'
  },
});

rp.setValue([new Date('2025-03-01'), new Date('2025-03-15')]);
rp.getValue(); // → { start: Date, end: Date }
```

### Month & year — `MTS.DatePicker.Month`

```js
new MTS.DatePicker.Month('#my-input', { onChange: function (e) { console.log(e.detail.formatted); } }); // → '03/2025'
```

### Week — `MTS.DatePicker.Week`

```js
new MTS.DatePicker.Week('#my-input', {
  onChange: function (e) {
    console.log(e.detail.value.start); // Monday of the week
    console.log(e.detail.value.end);   // Sunday of the week
    console.log(e.detail.formatted);   // 'Week 12 - 2025'
  },
});
```

---

## Options

Common across types (each type adds its own — see the examples above):

| Option | Type | Description |
|--------|------|-------------|
| `format` | `string` | Display format mask (e.g. `'DD/MM/YYYY'`) |
| `locale` | `string` | Locale for month/day names and formatting |
| `clearable` | `boolean` | Show the clear control |
| `minDate` / `maxDate` | `Date` | Selectable range bounds |
| `disabledDays` | `number[]` | Weekdays to disable (`0` = Sunday … `6` = Saturday) |
| `timeStep` | `number` | Minute step (Time / DateTime) |
| `startHour` / `endHour` | `number` | Hour bounds (Time) |
| `btnNow` / `btnToday` / `btnAccept` / `btnClear` | `string` | Action button labels (localizable) |
| `required` | `boolean` | Opt-in `validate()` — empty = `getValue() === null` (see [Form Field Contract](../FORM-FIELD-CONTRACT.md)) |
| `errorMessage` | `string` | Overrides the `required` message (localized default when unset) |
| `onChange` / `onOpen` / `onClose` | `function` | Lifecycle callbacks |

---

## API

Shared by every picker type:

| Method | Description |
|--------|-------------|
| `open()` / `close()` | Open / close the popup |
| `getValue()` | Value by type (`Date`, string, or `{ start, end }`) |
| `setValue(value)` | Set the value (chainable) |
| `setMinDate(date)` / `setMaxDate(date)` | Update the bounds at runtime (`Date` \| string \| `null`) — **refreshes the open calendar live** (chainable) |
| `clear()` | Clear the value |
| `validate()` | Validates `required` (empty = `getValue() === null`), inline error + `'validate'` event → `boolean` |
| `setError(msg)` / `clearError()` | Set / clear the error state |
| `destroy()` | Destroy the instance |
| `on(event, cb)` | Listen to `'change'`, `'open'`, `'close'` |

---

## Linked range (`linkRange`)

Link two **independent** pickers as a "From / To" range — the *to* can't be earlier than the *from* (and the *from* can't go past the *to*). The two fields are laid out wherever you want.

```js
var from = new MTS.DatePicker.Date('#from', { label: 'From' });
var to   = new MTS.DatePicker.Date('#to',   { label: 'To' });

var link = MTS.DatePicker.linkRange(from, to, {
  allowSameDay: true,   // allow from === to (default true)
  clampTo: true         // if changing 'from' leaves 'to' earlier, snap 'to' to 'from' (default true)
});
// link.destroy() to unlink
```

It wires `to.setMinDate(from)` and `from.setMaxDate(to)` on each change, with live calendar refresh. For a single combined two-calendar control, use `MTS.DatePicker.DateRange` instead.

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` / `on('change', fn)` | `mts:picker:change` | `{ value, formatted }` |
| `onOpen` / `on('open', fn)` | — | — |
| `onClose` / `on('close', fn)` | — | — |

```js
document.getElementById('my-input')
  .addEventListener('mts:picker:change', function (e) { console.log(e.detail.value, e.detail.formatted); });
```

---

## Accessibility

- The popup traps focus while open and closes on `Esc`; the calendar grid is navigable with the arrow keys.
- `disabledDays`, `minDate` and `maxDate` are skipped by keyboard navigation.
- Provide a label on the bound input so the picker has an accessible name.

---

## Changelog

### 2026-06-23
- Validation contract (all picker types via `Base`): `required` + `errorMessage` + `validate()` + `setError`/`clearError` (inline error, localized message). See [Form Field Contract](../FORM-FIELD-CONTRACT.md).

### 2026-06-12
- `setMinDate(date)` / `setMaxDate(date)` — runtime bounds with **live refresh** of the open calendar.
- `MTS.DatePicker.linkRange(from, to, opts)` — link two independent pickers as a "From / To" range.

### Initial
- Independent picker classes (`Date`, `Time`, `DateTime`, `DateRange`, `Month`, `Week`) over a shared base, with
  format masks, locale, min/max and disabled days, configurable action labels, and a common open/value/clear API.
