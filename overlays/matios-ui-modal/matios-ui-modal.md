# MTS.Modal

Full-featured dialog modal with sizes, border radius, scrollable body, footer buttons, vertical positioning, focus trap and convenience helpers (`confirm`, `alert`, `prompt`). Supports stacked modals and wrapping an existing HTML element for Bootstrap migration.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-modal.css">
<script src="matios-ui-modal.js"></script>
```

Optional, for localized chrome (close button `aria-label` and the default `confirm` / `alert` / `prompt` titles and button labels):

```html
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-modal-i18n.js"></script>
```

---

## Usage

```js
// Basic
const modal = new MTS.Modal({
  title: 'Edit user',
  body:  '<div id="user-form"></div>',
  size:  'md',
  buttons: [
    { label: 'Cancel', variant: 'ghost',   close: true },
    { label: 'Save',   variant: 'primary', onClick: function () { saveUser(); } },
  ],
  onShown:  function () { initForm('#user-form'); },
  onHidden: function () { console.log('closed'); },
});
modal.show();

// Large, scrollable
new MTS.Modal({
  title: 'Terms of service',
  body: longContent,
  size: 'lg',
  scrollable: true,
  buttons: [{ label: 'Accept', variant: 'primary', close: true }],
}).show();

// Static — does not close on Esc or backdrop; the user must click a button
new MTS.Modal({
  title: 'Required action',
  body: '<p>You must complete this step.</p>',
  static: true,
  buttons: [{ label: 'Done', variant: 'primary', close: true }],
}).show();
```

### Convenience helpers

All three are `static` methods and return a `Promise`. Optional callbacks run in addition to resolving the promise.

```js
// Resolves to true (confirm) or false (cancel)
MTS.Modal.confirm({
  title: 'Delete record',
  message: 'This action cannot be undone.',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
  variant: 'danger',
}).then(function (ok) {
  if (ok) { deleteRecord(); }
});

// Callback form (runs alongside the promise)
MTS.Modal.confirm({
  title: 'Delete record',
  message: 'This action cannot be undone.',
  onConfirm: function () { deleteRecord(); },
  onCancel:  function () { /* ... */ },
});

// Resolves when accepted
MTS.Modal.alert({
  title: 'Done',
  message: 'The record was saved successfully.',
});

// Resolves to the entered string, or null if cancelled
MTS.Modal.prompt({
  title: 'Rename file',
  placeholder: 'New name...',
  value: currentName,
}).then(function (value) {
  if (value !== null) { renameFile(value); }
});
```

---

## Options

Passed to `new MTS.Modal(options)`.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | `string` | auto (`mts-modal-<ts>`) | DOM `id` of the dialog element |
| `title` | `string \| Element` | `''` | Header title (string sets `textContent`; `Element` is appended) |
| `body` | `string \| Element` | `''` | Body content (string is sanitized via `MTS.Sanitize` if present) |
| `footer` | `string \| Element` | `null` | Custom footer content, rendered before any `buttons` |
| `buttons` | `array` | `[]` | Footer buttons (see schema below) |
| `size` | `string` | `'md'` | `'sm'` \| `'md'` \| `'lg'` \| `'xl'` \| `'fullscreen'` |
| `radius` | `string` | `'none'` | Panel border-radius — `'none'` \| `'sm'` \| `'md'` \| `'lg'` \| `'xl'` |
| `position` | `string` | `'center'` | Vertical position — `'top'` \| `'center'` \| `'bottom'` |
| `centered` | `boolean` | `true` | Backward-compat alias — `false` maps to `position: 'top'` (ignored when `position` is set) |
| `closable` | `boolean` | `true` | Show the × button and allow closing with `Esc` |
| `backdrop` | `boolean` | `true` | Click outside closes the modal (forced `false` when `static: true`) |
| `scrollable` | `boolean` | `false` | Scrollable body |
| `static` | `boolean` | `false` | Do not close on `Esc` or backdrop |
| `closeAriaLabel` | `string` | i18n `'Cerrar'` | `aria-label` of the × button |
| `elementId` | `string` | `null` | Wrap an existing modal element by id (Bootstrap migration) |
| `onShow` | `function` | — | Before show (call `preventDefault()` / return handling to cancel) |
| `onShown` | `function` | — | After fully visible |
| `onHide` | `function` | — | Before hide (cancelable) |
| `onHidden` | `function` | — | After fully hidden |

### Button schema

Each entry of `buttons`:

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Optional DOM `id` (needed for `setButton*` methods) |
| `label` | `string` | Button text |
| `variant` | `string` | `'primary'` \| `'secondary'` \| `'ghost'` \| `'danger'` (default `'secondary'`) |
| `close` | `boolean` | Close the modal on click |
| `disabled` | `boolean` | Render the button disabled |
| `onClick` | `function` | Click handler — receives the modal instance as its argument |

---

## Instance methods

| Method | Description |
|--------|-------------|
| `show()` | Open the modal (chainable) |
| `hide()` | Close the modal (chainable) |
| `toggle()` | Show if hidden, hide if open |
| `setTitle(content)` | Update the title (string → `textContent`; `Element` → appended) |
| `setBody(content)` | Update the body (string is sanitized; `Element` is appended) |
| `setButtonDisabled(buttonId, disabled)` | Enable/disable a footer button by id |
| `setButtonLabel(buttonId, label)` | Change a footer button's text by id |
| `setButtonLoading(buttonId, loading)` | Toggle an inline spinner + disabled state on a button by id |
| `on(event, cb)` | Register a lifecycle listener (`'show'` \| `'shown'` \| `'hide'` \| `'hidden'`) |
| `off(event, cb)` | Remove a listener |
| `destroy()` | Hide, release focus and remove the DOM after the transition |

Read-only properties: `isOpen` (`boolean`), `element` (the dialog DOM node).

```js
const modal = new MTS.Modal({
  title: 'Edit',
  buttons: [{ id: 'btn-save', label: 'Save', variant: 'primary' }],
});
modal.show();
modal.setButtonLoading('btn-save', true);
```

> `setTitle` / `setBody` with a string set `textContent` / sanitized HTML (safe for untrusted data); pass an `Element` to inject markup directly.

---

## Static methods

| Method | Returns | Description |
|--------|---------|-------------|
| `MTS.Modal.confirm(options)` | `Promise<boolean>` | Confirmation dialog — resolves `true` on confirm, `false` on cancel |
| `MTS.Modal.alert(options)` | `Promise<void>` | Simple alert with a single accept button |
| `MTS.Modal.prompt(options)` | `Promise<string\|null>` | Text input dialog — resolves the value, or `null` if cancelled |
| `MTS.Modal.getInstance(elementId)` | `MTS.Modal \| null` | Look up a registered instance by element id |

### `confirm` options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | i18n `'¿Estás seguro?'` | Dialog title |
| `message` | `string` | `''` | Body text |
| `confirmLabel` | `string` | i18n `'Confirmar'` | Confirm button label (alias: `confirmText`) |
| `cancelLabel` | `string` | i18n `'Cancelar'` | Cancel button label (alias: `cancelText`) |
| `variant` | `string` | `'danger'` | Variant of the confirm button |
| `size` | `string` | `'sm'` | Modal size |
| `onConfirm` | `function` | `null` | Optional callback, runs before resolving `true` |
| `onCancel` | `function` | `null` | Optional callback, runs before resolving `false` |

### `alert` options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | i18n `'Aviso'` | Dialog title |
| `message` | `string` | `''` | Body text |
| `label` | `string` | i18n `'Aceptar'` | Accept button label |
| `size` | `string` | `'sm'` | Modal size |
| `onAccept` | `function` | `null` | Optional callback, runs before resolving |

### `prompt` options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | i18n `'Ingresa un valor'` | Dialog title |
| `label` | `string` | `''` | Optional field label |
| `placeholder` | `string` | `''` | Input placeholder |
| `value` | `string` | `''` | Initial input value |
| `confirmLabel` | `string` | i18n `'Aceptar'` | Confirm button label |
| `cancelLabel` | `string` | i18n `'Cancelar'` | Cancel button label |
| `size` | `string` | `'sm'` | Modal size |

---

## Events

Lifecycle events fire on both the instance (via `on(...)` or the `onX` options) and as bubbling DOM `CustomEvent`s on the dialog element. `show` and `hide` are cancelable.

| Instance / option | DOM event | When | Cancelable |
|-------------------|-----------|------|------------|
| `onShow` | `mts:modal:show` | Before show | Yes |
| `onShown` | `mts:modal:shown` | Fully visible | No |
| `onHide` | `mts:modal:hide` | Before hide | Yes |
| `onHidden` | `mts:modal:hidden` | Fully hidden | No |
| — | `mts:modal:buttonClick` | A footer button was clicked | No |

The synthetic event passed to instance listeners exposes `type`, `target` (the instance), `detail` and `preventDefault()`. The DOM `CustomEvent.detail` carries `{ modal }` (and, for `buttonClick`, `{ id, label, variant, modal }`).

```js
modal.on('shown', function (e) { console.log('shown', e.target); });

document.addEventListener('mts:modal:hide', function (e) {
  if (!confirmed) { e.preventDefault(); } // cancel the close
});

document.addEventListener('mts:modal:buttonClick', function (e) {
  console.log('clicked', e.detail.id, e.detail.label);
});
```

---

## Close / backdrop / Escape behavior

- **× button** — shown only when `closable: true`; clicking it calls `hide()`.
- **Escape** — closes the modal only while it is open, `closable: true`, and not `static`.
- **Backdrop click** — closes only when `backdrop: true` and not `static`. Setting `static: true` forces `backdrop` to `false`.
- **Stacked modals** — each modal opened over another receives an incremental z-index so its backdrop covers the modal below. The body scroll-lock (`mts-modal-open`) is released only when the last modal in the stack closes.

---

## Accessibility

- The dialog uses `role="dialog"` with `aria-modal="true"`, and toggles `aria-hidden` / `hidden` on open/close.
- Focus is trapped inside the modal while open (Tab / Shift+Tab cycle) and restored to the trigger element on close.
- The × button carries a localized `aria-label` (see i18n). With `closable: false` you must provide an explicit in-content close path.

---

## i18n

The component localizes its own chrome: the × button `aria-label` and the default titles / button labels of the `confirm` / `alert` / `prompt` helpers. These are read from `MTS.getString()['MTS.Modal'].chrome`; per-call options (`title`, `confirmLabel`, `closeAriaLabel`, ...) always override the localized value.

Load the global i18n and the component i18n, then set the language **once** at startup:

```html
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-modal-i18n.js"></script>
```

```js
MTS.setLanguage('es'); // 'es' | 'en' | 'pt'
```

Namespace: **`MTS.Modal`** — chrome strings under `chrome`, demo-page strings under `demo`. To add or override a language, register it before setting it:

```js
MTS.registerLocale('fr', {
  'MTS.Modal': {
    chrome: {
      closeAriaLabel: 'Fermer',
      confirmTitle:   'Êtes-vous sûr ?',
      confirmLabel:   'Confirmer',
      cancelLabel:    'Annuler',
      alertTitle:     'Avis',
      acceptLabel:    'OK',
      promptTitle:    'Saisissez une valeur',
    },
  },
});
MTS.setLanguage('fr');
```

If the component i18n is not loaded, the chrome falls back to built-in literals. There is no per-instance `locale` option.
