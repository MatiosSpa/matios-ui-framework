# MTS.Select

Select component with search, multi-select, option groups, icons and external async search.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-select.css">
<script src="matios-ui-select.js"></script>
```

---

## Usage

### JavaScript

```js
// Basic
const sel = new MTS.Select('#my-select', {
  label: 'Select an option',
  value: 'a',
  options: [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B', disabled: true },
    { value: 'c', label: 'Option C' },
  ],
  onChange: function (e) { console.log(e.detail.value, e.detail.text); },
});

// Option groups
new MTS.Select('#grouped', {
  options: [
    { value: 'a1', label: 'Alpha 1', group: 'Group A' },
    { value: 'a2', label: 'Alpha 2', group: 'Group A' },
    { value: 'b1', label: 'Beta 1',  group: 'Group B' },
  ],
});

// Async external search
new MTS.Select('#users', {
  label:      'Search users',
  searchable: true,
  minChars:   2,
  debounce:   400,
  onSearch: async function (query) {
    const res = await fetch('/api/users?q=' + query);
    return res.json(); // must return [{ value, label }]
  },
  onChange: function (e) { console.log(e.detail.value); },
});
```

### HTML with `data-*`

```html
<div id="sel-tags" data-label="Technologies" data-multiple data-searchable></div>

<script>
  new MTS.Select('#sel-tags', {
    options: [
      { value: 'js',  label: 'JavaScript' },
      { value: 'ts',  label: 'TypeScript' },
      { value: 'css', label: 'CSS' },
    ],
    value: ['js'],
  });
</script>
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `options` | `array` | `[]` | `[{ value, label, group?, icon?, disabled? }]` |
| `value` | `any` | `null` | Initial selected value |
| `label` | `string` | `''` | Field label |
| `placeholder` | `string` | localized | Placeholder text |
| `hint` | `string` | `''` | Helper text |
| `multiple` | `boolean` | `false` | Allow multiple selection |
| `searchable` | `boolean` | `false` | Enable search inside the list |
| `clearable` | `boolean` | `false` | Show the clear button |
| `disabled` | `boolean` | `false` | Disables interaction |
| `required` | `boolean` | `false` | Opt-in `validate()` — see [Form Field Contract](../FORM-FIELD-CONTRACT.md) |
| `errorMessage` | `string` | `null` | Overrides the `required` message (localized default when `null`) |
| `maxSelect` | `number` | `null` | Max selections in multi mode |
| `debounce` | `number` | `300` | Debounce delay for `onSearch` (ms) |
| `minChars` | `number` | `1` | Min chars to trigger `onSearch` |
| `onSearch` | `function` | — | Async search: `async (query) → [{ value, label }]` |
| `onChange` | `function` | — | Fires on selection change |

---

## API

| Method | Description |
|--------|-------------|
| `getValue()` | Get the value — `string \| null` (single) or `string[]` (multiple) |
| `getText()` | Get the selected label(s) |
| `setValue(value)` | Set the value programmatically |
| `clear()` | Clear the selection |
| `setOptions(array[, enable])` | Replace the options list (`enable=true` also enables the field) |
| `getOptions()` | Current option list as a shallow copy |
| `validate()` | Validates `required` (empty = no selection), inline error + `'validate'` event → `boolean` |
| `setError(msg)` / `clearError()` | Set / clear the error state |
| `open()` / `close()` / `toggle()` | Control the dropdown |
| `enable()` / `disable()` | Enable / disable interaction |
| `destroy()` | Destroy the instance |

```js
const sel = new MTS.Select('#my-select', { options: [/* … */] });
sel.setValue('b');
sel.setOptions([{ value: 'x', label: 'X' }]);
```

---

## Events

| Method / event | DOM event | Payload |
|----------------|-----------|---------|
| `onChange` | `mts:select:change` | single: `{ value, text, option }` · multiple: `{ value, text, options }` |
| — | `mts:select:open` | — |
| — | `mts:select:close` | — |

```js
document.getElementById('my-select')
  .addEventListener('mts:select:change', function (e) { console.log(e.detail.value); });
```

---

## CSS Variables

Uses the framework base tokens for surface, border, text and accent colors, plus the popup/dropdown surface and
shadow tokens. Theme via `data-mts-mode` / `data-mts-accent`.

**Validation classes:** `.mts-form-error` (inline message), `.mts-form-hint` (helper text), `.mts-label--required` (red asterisk on the label) — shared, single source in `base/matios-ui-base.css`. Error state: `.mts-select__trigger--error`. See [Form Field Contract](../FORM-FIELD-CONTRACT.md).

---

## Accessibility

- The trigger is keyboard-operable: open with `Enter`/`Space`/arrows, navigate options with arrows, select with
  `Enter`, close with `Esc`.
- In `searchable` mode the search field receives focus on open; selected options are announced.
- Provide a `label` (or `aria-label`) so the control has an accessible name.

---

## Changelog

### 2026-06-23
- Validation contract: `required` + `errorMessage` + `validate()` + `setError`/`clearError` (inline error, localized message). See [Form Field Contract](../FORM-FIELD-CONTRACT.md).
- `getOptions()` — read back the current option list as a shallow copy (collection-API symmetry with `setOptions`).

### 2026-06-22
- Fix: the dropdown now flips up when there's more room above than below (previously a fixed `>= 120px` threshold forced it downward, clipping options off the bottom of the viewport near the screen/modal edge). Its list height is also capped to the available space and scrolls when options don't fit.

### Initial
- Select with single/multiple selection, in-list search, async external search (`onSearch` + debounce/minChars),
  option groups, icons, per-option disable, `maxSelect`, clearable, and full programmatic API.
