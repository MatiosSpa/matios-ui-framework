# MTS.Autocomplete

Attaches to an existing `<input>` and adds autocomplete behavior: a suggestions dropdown, an internal `value` separate from the visible text, keyboard navigation, and a `×` button to clear.

Supports both an **async function** datasource and a **static array**.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-autocomplete.css">
<script src="matios-ui-autocomplete.js"></script>

<!-- Optional: enables en / pt copy for the dropdown, clear button and required message -->
<script src="../../base/matios-ui-i18n.js"></script>
<script src="matios-ui-autocomplete-i18n.js"></script>
```

The component requires an existing `<input>` element; it wraps that element in place. If the target is not an `INPUT`, the constructor is a no-op.

---

## Basic usage

```html
<input id="ac-static" type="text" placeholder="Type a country..." autocomplete="browser-off">
```

```js
new MTS.Autocomplete('#ac-static', {
  datasource: [
    { value: 'CL', text: 'Chile'     },
    { value: 'AR', text: 'Argentina' },
    { value: 'PE', text: 'Peru'      },
    { value: 'CO', text: 'Colombia'  },
    { value: 'MX', text: 'Mexico'    }
  ],
  minChars: 1,
  onSelect: function(item) {
    console.log('text:', item.text, 'value:', item.value);
  }
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `datasource` | `function` \| `array` | `null` | Data source. A function receives `(query, done)` — call `done(results[])`; an array is filtered internally by `textField` |
| `valueField` | `string` | `'value'` | Item field that acts as the identifier. Stored on the input's `data-mts-value` |
| `textField` | `string` | `'text'` | Item field shown in the input and the dropdown |
| `minChars` | `number` | `1` | Minimum number of characters before the search is triggered |
| `debounce` | `number` | `300` | Milliseconds to wait before launching the query (applies to the function datasource) |
| `empty` | `string` | localized | Message shown when there are no matches. Defaults to the localized `empty` string (`No results.` in English) |
| `required` | `boolean` | `false` | Opt-in `validate()` — empty = no selected value (see [Form Field Contract](../FORM-FIELD-CONTRACT.md)) |
| `errorMessage` | `string` | `null` | Overrides the `required` message. When `null`, the localized default is used |
| `onSelect` | `function` | — | Called when an item is selected. Receives the full item object |
| `onChange` | `function` | — | Called when an item is selected or cleared. Receives the item or `null` |
| `onClear` | `function` | — | Called when the value is cleared (via the `×` button or `clear()`) |

There are no `placeholder`, `label`, `maxResults`, `highlightMatch`, `freeSolo`/`allowCustom`, `clearable`, `source`, `dataSource`, `options`, `items` or `onSearch` options — the component reads `placeholder`/label directly from the underlying `<input>` and always shows the clear button when there is text.

---

## Function vs array datasource

The datasource follows the framework's overridable async-fetch convention: the consumer supplies the fetch as a function, and the component calls it (debounced) with the query plus a `done` callback.

```js
// Async function — the consumer performs the fetch, then calls done(results)
datasource: function(query, done) {
  fetch('/api/search?q=' + encodeURIComponent(query))
    .then(function(r) { return r.json(); })
    .then(done);
}

// Static array — filtered internally by textField (contains, case-insensitive)
datasource: [
  { value: 1, text: 'Ana Perez'   },
  { value: 2, text: 'Luis Soto'    },
  { value: 3, text: 'Paz Morales'  }
]
```

`debounce` only applies to the function datasource; an array datasource is filtered synchronously.

---

## Value vs Text

The component keeps **two independent values**:

| | Where it lives | How to read it |
|---|---|---|
| **Text** (what the user sees) | `input.value` | `ac.getText()` |
| **Value** (identifier) | `input[data-mts-value]` | `ac.getValue()` |

When the user edits the text after making a selection, the `value` is cleared automatically (and `onChange(null)` fires) until a new selection is made.

```html
<!-- after selecting "Ana Perez" (id: 42) -->
<input type="text" value="Ana Perez" data-mts-value="42">
```

---

## API

```js
var ac = new MTS.Autocomplete('#input', options);

ac.getValue()              // → string from data-mts-value, or null
ac.getText()               // → string from input.value
ac.getItem()               // → full object of the last selected item, or null

ac.setValue(value, text)   // programmatic selection; sets text + data-mts-value (chainable)
ac.clear()                 // clears input + data-mts-value; fires onClear + onChange(null) (chainable)

ac.validate()              // → boolean; when required, a value must be selected (shows inline error)
ac.setError(msg)           // sets the inline error + error state (chainable)
ac.clearError()            // clears the inline error (chainable)

ac.destroy()               // removes the dropdown, unbinds listeners and unwraps the input
```

There is no `open`/`close`/`setOptions`/`getConfig`/`getCode` method; the dropdown opens on input and closes on selection, `Escape`, or outside click.

---

## Events

Callbacks (`onSelect`, `onChange`, `onClear`) are passed as options — see the table above.

One native DOM event is dispatched, from `validate()`:

| Event | When | `detail` |
|-------|------|----------|
| `mts:autocomplete:validate` | Every `validate()` call | `{ valid: boolean, errors: string[] }` — `errors` is empty when valid, otherwise holds the current error message |

The event bubbles from the underlying `<input>`.

---

## Keyboard

| Key | Action |
|-----|--------|
| `↓` / `↑` | Navigate between suggestions (wraps around) |
| `Enter` | Select the active item |
| `Escape` | Close the dropdown |

---

## Internationalization

Localized strings live under the namespace `MTS.Autocomplete` in `matios-ui-autocomplete-i18n.js` (loaded after `base/matios-ui-i18n.js`). The active language is set globally once at startup:

```js
MTS.setLanguage('en');   // 'es' (default) | 'en' | 'pt'
```

There is no per-instance `locale` option. Bundled keys (under `MTS.Autocomplete.messages`):

| Key | es | en | pt | Used for |
|-----|----|----|----|----------|
| `empty` | `Sin resultados.` | `No results.` | `Sem resultados.` | Dropdown "no matches" row (override per instance with the `empty` option) |
| `clear` | `Limpiar` | `Clear` | `Limpar` | `aria-label` of the `×` button |
| `required` | `Este campo es obligatorio` | `This field is required` | `Este campo é obrigatório` | Default `validate()` error (override per instance with `errorMessage`) |

If the i18n files are not loaded, the component falls back to the English defaults shown above.

---

## CSS Classes

Validation (form-field contract) — see [Form Field Contract](../FORM-FIELD-CONTRACT.md):

- `.mts-form-error` (inline message), `.mts-form-hint` (helper text), `.mts-label--required` (red asterisk on the label) — shared, single source in `base/matios-ui-base.css`.
- `.mts-ac__wrap--error` — error state on the control (red border), toggled by `setError()` / `validate()`.

Component structure: `.mts-ac__wrap` (wrapper), `.mts-ac__clear` (× button), `.mts-ac__dropdown` (portal in `body`), `.mts-ac__item` / `.mts-ac__item--active` (suggestions), `.mts-ac__empty` (no-matches row), `.mts-ac__wrap--open`, `.mts-ac__wrap--loading`.
