# MTS.Autocomplete

Attaches to an existing `<input>` and adds autocomplete behavior: a suggestions dropdown, an internal `value` separate from the visible text, keyboard navigation, and a `×` button to clear.

Supports both an **async function** datasource and a **static array**.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-autocomplete.css">
<script src="matios-ui-autocomplete.js"></script>
```

---

## Basic usage

```html
<input id="user-search" type="text" placeholder="Search user...">
```

```js
new MTS.Autocomplete('#user-search', {
  datasource: function(query, done) {
    fetch('/api/users?q=' + query)
      .then(function(r) { return r.json(); })
      .then(done);
  },
  valueField: 'id',
  textField:  'name',
  onSelect: function(item) {
    console.log('value:', item.id, '— text:', item.name);
  }
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `datasource` | `function` or `array` | `null` | Data source. A function receives `(query, done)` — call `done(results[])`; an array is filtered internally by `textField` |
| `valueField` | `string` | `'value'` | Item field that acts as the identifier. Stored in the input's `data-mts-value` |
| `textField` | `string` | `'text'` | Item field shown in the input when selected |
| `minChars` | `number` | `1` | Minimum number of characters to trigger the search |
| `debounce` | `number` | `300` | Milliseconds to wait before launching the query (applies only to a function datasource) |
| `empty` | `string` | `'No results.'` | Message shown when there are no matches |
| `onSelect` | `function` | — | Fires when an item is selected. Receives the full item object |
| `onChange` | `function` | — | Fires when an item is selected or cleared. Receives the item or `null` |
| `onClear` | `function` | — | Fires when the `×` button is pressed |
| `required` | `boolean` | `false` | Opt-in `validate()` — empty = no selected value (see [Form Field Contract](../FORM-FIELD-CONTRACT.md)) |
| `errorMessage` | `string` | `null` | Overrides the `required` message (localized default when `null`) |

---

## Function vs array datasource

```js
// Async function — the consumer performs the fetch
datasource: function(query, done) {
  fetch('/api/search?q=' + encodeURIComponent(query))
    .then(function(r) { return r.json(); })
    .then(done);
}

// Static array — filtered internally by textField (contains, case-insensitive)
datasource: [
  { value: 1, text: 'Ana Perez'  },
  { value: 2, text: 'Luis Soto'  },
  { value: 3, text: 'Paz Morales'}
]
```

---

## Value vs Text

The component keeps **two independent values**:

| | Where it lives | How to read it |
|---|---|---|
| **Text** (what the user sees) | `input.value` | `ac.getText()` |
| **Value** (identifier) | `input[data-mts-value]` | `ac.getValue()` |

When the user edits the text after making a selection, the `value` is cleared automatically until a new selection is made.

```html
<!-- after selecting "Ana Perez" (id: 42) -->
<input type="text" value="Ana Perez" data-mts-value="42">
```

---

## API

```js
const ac = new MTS.Autocomplete('#input', options);

ac.getValue()              // → string from data-mts-value, or null
ac.getText()               // → string from input.value
ac.getItem()               // → full object of the last selected item, or null

ac.setValue(value, text)   // programmatic selection
ac.clear()                 // clears input + data-mts-value + fires onClear/onChange
ac.validate()              // → boolean; required = a value must be selected (inline error)
ac.setError(msg)           // ac.clearError()
ac.destroy()               // clears DOM, event listeners and unwraps the input
```

---

## Keyboard

| Key | Action |
|-------|--------|
| `↓` / `↑` | Navigate between suggestions |
| `Enter` | Select the active item |
| `Escape` | Close the dropdown |

---

## Changelog

### 2026-06-23
- Validation contract: `required` + `errorMessage` + `validate()` + `setError`/`clearError` (inline error, localized message via new i18n). See [Form Field Contract](../FORM-FIELD-CONTRACT.md).

### Initial
- Component created. Async function datasource + static array, `valueField`/`textField`, debounce, loading spinner, keyboard navigation, `×` button, `data-mts-value` on the input, `_mtsInstance` for FormGuard. Demo in `forms/matios-ui-input/demo.html`.
