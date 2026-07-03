# MTS.ConfirmButton

Two-step inline confirmation button. Prevents accidental actions without requiring a modal. Includes an auto-cancel timeout bar.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-button.css">
<link rel="stylesheet" href="matios-ui-confirmbutton.css">
<script src="matios-ui-confirmbutton.js"></script>

<!-- Optional: i18n for the default labels + demo strings -->
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-confirmbutton-i18n.js"></script>
```

> The component renders its own `.mts-btn` elements, so it only needs `matios-ui-button.css` (not `matios-ui-button.js`).

---

## Usage

```js
const btn = new MTS.ConfirmButton('#my-btn', {
  label:          'Delete record',
  confirmLabel:   'Yes, delete',
  cancelLabel:    'No, keep it',
  variant:        'secondary',
  confirmVariant: 'danger',
  timeout:        4000, // auto-cancel after 4s
  onConfirm:      function () { deleteRecord(); },
  onCancel:       function () { console.log('cancelled'); },
});
```

### HTML with `data-*`

```html
<div id="btn-delete"
  data-label="Delete record"
  data-confirm-label="Yes, delete"
  data-cancel-label="Cancel"
  data-confirm-variant="danger"
  data-timeout="5000"></div>

<script> new MTS.ConfirmButton('#btn-delete', { onConfirm: function () { /* … */ } }); </script>
```

Available `data-*`: `data-label`, `data-confirm-label`, `data-cancel-label`, `data-variant`,
`data-confirm-variant`, `data-size`, `data-timeout`, `data-disabled`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `label` | `string` | `'Delete'` | Initial button label |
| `confirmLabel` | `string` | `'Confirm?'` | Confirm button label |
| `cancelLabel` | `string` | `'No'` | Cancel button label |
| `variant` | `string` | `'secondary'` | Initial button variant |
| `confirmVariant` | `string` | `'danger'` | Variant during confirmation |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` |
| `timeout` | `number` | `4000` | Auto-cancel delay in ms. `0` = no timeout |
| `iconLeft` | `string` | `''` | Left icon HTML |
| `onConfirm` | `function` | — | Fires when the user confirms |
| `onCancel` | `function` | — | Fires when the user cancels or the timeout expires |

> Default labels resolve from the active locale; the values above are illustrative English defaults.

---

## API

| Method | Description |
|--------|-------------|
| `reset()` | Reset to the initial (pre-confirmation) state |
| `disable()` / `enable()` | Disable / enable all buttons |

```js
const btn = new MTS.ConfirmButton('#my-btn', { onConfirm: function () {} });
btn.reset();
```

---

## Events

Both are **constructor option callbacks** (there is no `.on()` subscription method). Each is called with no arguments.

| Callback | When |
|----------|------|
| `onConfirm` | The user clicks the confirm button |
| `onCancel` | The user cancels, or the timeout bar expires |

---

## Accessibility

- Both steps render real buttons; focus moves to the confirm action so `Enter`/`Space` completes or cancels it.
- The timeout auto-cancels — keep `timeout` long enough for assistive-tech users, or set `0` to disable it.

---

## Internationalization (i18n)

The three default labels — `label` (`Delete`), `confirmLabel` (`Confirm?`) and `cancelLabel` (`No`) — are read from the `MTS.ConfirmButton` namespace of the active language, with an English fallback when the i18n script isn't loaded. Bundled languages: `es`, `en`, `pt`.

```js
MTS.setLanguage('en');   // 'es' | 'en' | 'pt' — set once at startup, before creating components
```

Passing `label` / `confirmLabel` / `cancelLabel` (or their `data-*` equivalents) overrides the localized text for that instance. The optional file `matios-ui-confirmbutton-i18n.js` also carries the strings the demo page uses (under `MTS.ConfirmButton.demo`).
