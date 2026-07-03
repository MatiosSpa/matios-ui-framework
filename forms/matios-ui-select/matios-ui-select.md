# MTS.Select

Select component with in-list search, multi-select, option groups, icons, per-option disable and external async search.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-select.css">
<script src="matios-ui-icons.js"></script>
<script src="matios-ui-select-i18n.js"></script>
<script src="matios-ui-select.js"></script>
```

`matios-ui-icons.js` is required (the dropdown arrow and the selected check are rendered via `MTS.Icon`).
`matios-ui-select-i18n.js` provides the localized chrome (placeholder, search placeholder, "No results", required message).

---

## Usage

### JavaScript

```js
const sel = new MTS.Select('#my-select', {
  label: 'Select an option',
  placeholder: 'Select a country...',
  value: 'a',
  options: [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B', disabled: true },
    { value: 'c', label: 'Option C' }
  ],
  onChange: function (e) { console.log(e.detail.value, e.detail.text); }
});
```

### Option groups

```js
new MTS.Select('#grouped', {
  options: [
    { value: 'react', label: 'React', group: 'Frontend' },
    { value: 'vue', label: 'Vue', group: 'Frontend' },
    { value: 'node', label: 'Node.js', group: 'Backend' }
  ]
});
```

### Multi-select

```js
new MTS.Select('#tags', {
  label: 'Technologies',
  multiple: true,
  searchable: true,
  maxSelect: 3,
  value: ['js'],
  options: [
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'css', label: 'CSS' }
  ],
  onChange: function (e) { console.log(e.detail.value); }
});
```

### Async external search (`onSearch`)

`onSearch` is a data-source function, not an event: it owns the fetch and returns the option list. When it is
defined the component does not filter locally — it renders whatever the function returns. It is debounced
(`debounce`) and only fires once `minChars` are typed.

```js
new MTS.Select('#users', {
  label: 'Search users',
  searchable: true,
  minChars: 2,
  debounce: 400,
  onSearch: async function (query) {
    const res = await fetch('/api/users?q=' + query);
    return res.json(); // must resolve to [{ value, label }]
  },
  onChange: function (e) { console.log(e.detail.value); }
});
```

### HTML with `data-*`

Declarative attributes are read on init and merged under any options passed in JS (JS wins).

```html
<div
  id="sel-tags"
  data-label="Technologies"
  data-placeholder="Choose..."
  data-multiple
  data-searchable
  data-clearable></div>

<script>
  new MTS.Select('#sel-tags', {
    options: [
      { value: 'js',  label: 'JavaScript' },
      { value: 'ts',  label: 'TypeScript' },
      { value: 'css', label: 'CSS' }
    ],
    value: ['js']
  });
</script>
```

Supported `data-*` attributes: `data-label`, `data-placeholder`, `data-hint`, `data-value`, `data-multiple`,
`data-searchable`, `data-clearable`, `data-disabled`, `data-required`, `data-error-message`, `data-max-select`.
`data-name` sets the hidden input `name` (falls back to the container `id`).

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `options` | `array` | `[]` | `[{ value, label, group?, icon?, disabled? }]` |
| `value` | `any` | `null` (single) / `[]` (multiple) | Initial selected value(s) |
| `label` | `string` | `''` | Field label |
| `placeholder` | `string` | localized `Select...` | Placeholder text |
| `hint` | `string` | `''` | Helper text below the field |
| `multiple` | `boolean` | `false` | Allow multiple selection (renders tags) |
| `searchable` | `boolean` | `false` | Show a search input inside the dropdown |
| `clearable` | `boolean` | `false` | Show the clear (`×`) button |
| `disabled` | `boolean` | `false` | Disables interaction |
| `required` | `boolean` | `false` | Opt-in `validate()` — see [Form Field Contract](../FORM-FIELD-CONTRACT.md) |
| `errorMessage` | `string` | `null` | Overrides the `required` message (localized default when `null`) |
| `maxSelect` | `number` | `null` | Max selections in multi mode |
| `debounce` | `number` | `300` | Debounce delay for `onSearch` (ms) |
| `minChars` | `number` | `1` | Min chars to trigger `onSearch` (`0` = fire on open) |
| `renderMode` | `string` | `'auto'` | `'auto'` \| `'field-only'` \| `'standalone'` — layout mode (see below) |
| `onSearch` | `function` | — | Async data source: `async (query) → [{ value, label, ... }]` |
| `onChange` | `function` | — | Fires on selection change |
| `onSelect` | `function` | — | Alias of `onChange` |

**`renderMode`** — `'auto'` (default) renders `field-only` (no label/hint/error wrapper) when the container's parent
has class `mts-form-group`, otherwise the full field. `'field-only'` and `'standalone'` force either behavior.

---

## Option shape

| Key | Type | Description |
|-----|------|-------------|
| `value` | `any` | Option value (used for selection and the hidden input) |
| `label` | `string` | Visible text |
| `group` | `string` | Optional group header the option is listed under |
| `icon` | `string` | Optional inline icon markup shown before the label (sanitized) |
| `disabled` | `boolean` | Renders the option non-selectable |

---

## API

| Method | Description |
|--------|-------------|
| `getValue()` | Current value — `any \| null` (single) or `array` (multiple) |
| `getText()` | Selected label(s); joined with `, ` in multiple mode |
| `getOptions()` | Current option list as a shallow copy |
| `setValue(value)` | Set the value programmatically (fires `change`) |
| `clear()` | Clear the selection (fires `change`) |
| `setOptions(array[, enable])` | Replace the options list; `enable=true` also enables the field |
| `validate()` | Validates `required` (empty = no selection); sets inline error, emits `validate`, returns `boolean` |
| `setError(msg)` | Set the error state / message |
| `clearError()` | Clear the error state |
| `open()` / `close()` / `toggle()` | Control the dropdown |
| `enable()` / `disable()` | Enable / disable interaction |
| `on(event, cb)` / `off(event, cb)` | Register / remove an instance listener |
| `destroy()` | Remove the dropdown, clear the container and detach global listeners |

`getValue()`/`getText()` are also available as the read-only getters `sel.value` / `sel.text`.

```js
const sel = new MTS.Select('#my-select', { options: [/* … */] });
sel.setValue('b');
sel.setOptions([{ value: 'x', label: 'X' }]);
```

---

## Events

Listen via the `onChange` option, `on('change', cb)`, or the DOM `CustomEvent`. The instance-listener callback
receives `{ type, target, detail }`; the DOM event carries the same fields on `event.detail` (plus `select`).

| Event | DOM event | Payload (`detail`) |
|-------|-----------|--------------------|
| `change` | `mts:select:change` | single: `{ value, text, option }` · multiple: `{ value, text, options }` |
| `open` | `mts:select:open` | `{}` |
| `close` | `mts:select:close` | `{}` |
| `validate` | `mts:select:validate` | `{ valid, errors }` |

```js
document.getElementById('my-select')
  .addEventListener('mts:select:change', function (e) { console.log(e.detail.value); });
```

---

## i18n

Localized under the `MTS.Select` namespace (`messages`) via the global language API. Set the language once at
startup with `MTS.setLanguage('es' | 'en' | 'pt')`; the component reads its chrome from
`MTS.getString()['MTS.Select'].messages`. There is no per-instance `locale` option.

| Key | en | Used for |
|-----|-----|----------|
| `placeholder` | `Select...` | Default trigger placeholder (overridden by the `placeholder` option) |
| `searchPlaceholder` | `Search...` | Search input placeholder |
| `noResults` | `No results` | Empty list message |
| `minCharsHint` | `Type at least {n} characters to search` | Shown when fewer than `minChars` are typed (`{n}` = `minChars`) |
| `loading` | `Searching...` | Shown while `onSearch` is in flight |
| `required` | `This field is required` | Default `validate()` error (overridden by `errorMessage`) |

Bundled languages: `es`, `en`, `pt`. An explicit `placeholder` / `errorMessage` option always takes precedence
over the localized default.

---

## CSS Variables

Uses the framework base tokens for surface, border, text and accent colors, plus the popup/dropdown surface and
shadow tokens. Theme via `data-mts-mode` / `data-mts-accent`.

**Validation classes:** `.mts-form-error` (inline message), `.mts-form-hint` (helper text), `.mts-label--required` (red asterisk on the label) — shared, single source in `base/matios-ui-base.css`. Error state: `.mts-select__trigger--error`. See [Form Field Contract](../FORM-FIELD-CONTRACT.md).

---

## Accessibility

- The trigger is keyboard-operable: open with `Enter`/`Space`/arrows, navigate options with arrows (wraps, skips
  disabled), select the highlighted option with `Enter`, close with `Esc`.
- In `searchable` mode the search field receives focus on open; selected options are announced.
- Provide a `label` (or `aria-label`) so the control has an accessible name.
