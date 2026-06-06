# MTS.Alert

Inline alert and banner with variants, icons, action button and auto-dismiss. Works via JS and as pure HTML/CSS.

---

## Installation

```html
<link rel="stylesheet" href="overlays/matios-ui-alert/matios-ui-alert.css">
<script src="overlays/matios-ui-alert/matios-ui-alert.js"></script>
```

---

## Usage

```js
// Basic
new MTS.Alert('#my-alert', { variant: 'warning', message: 'There are unsaved changes.' });

// With an action button
new MTS.Alert('#my-alert', {
  variant:  'warning',
  title:    'Session expiring',
  message:  'Your session expires in 5 minutes.',
  action:   'Renew now',
  onAction: function () { renewSession(); },
  onClose:  function () { console.log('closed'); },
});
```

### HTML with `data-*`

```html
<div id="my-alert"
  data-variant="success"
  data-title="Done"
  data-message="Your changes were saved."
  data-closable
  data-auto-dismiss="5000"></div>

<script> new MTS.Alert('#my-alert'); </script>
```

### CSS only (no JS)

```html
<div class="mts-alert mts-alert--success">
  <div class="mts-alert__icon"><!-- SVG --></div>
  <div class="mts-alert__body">
    <div class="mts-alert__title">Saved</div>
    <div class="mts-alert__message">Your changes were saved successfully.</div>
  </div>
</div>
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | `string` | `'info'` | `'info'` · `'success'` · `'warning'` · `'danger'` |
| `title` | `string` | `''` | Optional title above the message |
| `message` | `string` | `''` | Main message |
| `closable` | `boolean` | `true` | Show the × close button |
| `icon` | `boolean` | `true` | Show the variant icon |
| `action` | `string` | `null` | Inline action button label |
| `onAction` | `function` | `null` | Fires when the action button is clicked |
| `onClose` | `function` | `null` | Fires when the alert is closed |
| `autoDismiss` | `number` | `0` | Auto-close after N ms (`0` = disabled) |

---

## API

| Method | Description |
|--------|-------------|
| `close()` | Close the alert with animation |
| `setMessage(msg)` | Replace the message text at runtime |
| `on(event, fn)` | Listen to `'action'` / `'close'` |

```js
const alert = new MTS.Alert('#container', { variant: 'info', message: 'Loading...' });
alert.setMessage('Process complete.');
alert.on('close', function () { console.log('closed'); });
```

---

## Events

| Method | DOM event | When |
|--------|-----------|------|
| `onAction` / `on('action', fn)` | — | The action button is clicked |
| `onClose` / `on('close', fn)` | `mts:alert:close` | The alert is closed |

```js
document.getElementById('my-alert')
  .addEventListener('mts:alert:close', function () { console.log('closed'); });
```

---

## Notes

- `action` + `onAction` must be passed together for the button to render.
- `autoDismiss` combined with `closable: false` works well for unobtrusive confirmation banners.
- The `data-*` attributes allow declarative init without extra JS (useful for server-side rendering).

---

## Accessibility

- Render alerts in an `aria-live` region (assertive for `danger`/`warning`) so they are announced.
- The close and action controls are real buttons, focusable and keyboard-activatable.

---

## Changelog

### 2026-05-17
- Fix: the action button never rendered — `_build()` checked `this.onAction` instead of the registered listener.
- Arrow functions → `function ()` in `close()` / `_build()` / `_emit()`; `closeBtn` now uses `textContent = '×'`.
