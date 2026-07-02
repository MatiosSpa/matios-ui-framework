# MTS.Alert

Inline alert and banner with variants, icons, an optional action button and auto-dismiss. Works via JavaScript and as pure HTML/CSS.

---

## Installation

```html
<link rel="stylesheet" href="overlays/matios-ui-alert/matios-ui-alert.css">
<script src="icons/matios-ui-icons.js"></script>
<script src="overlays/matios-ui-alert/matios-ui-alert.js"></script>
```

`matios-ui-icons.js` is required: the component draws its variant icon through `MTS.Icon.get(...)`.

Optional (only if you localize the component chrome):

```html
<script src="base/matios-ui-i18n.js"></script>
<script src="overlays/matios-ui-alert/matios-ui-alert-i18n.js"></script>
```

---

## Usage

```js
// Basic
new MTS.Alert('#my-alert', {
  variant: 'warning',
  message: 'There are unsaved changes.'
});

// With an action button
new MTS.Alert('#my-alert', {
  variant: 'warning',
  title: 'Session expiring',
  message: 'Your session expires in 5 minutes.',
  action: 'Renew now',
  onAction: function () { renewSession(); },
  onClose: function () { console.log('closed'); }
});
```

The constructor mounts the alert in-place inside the container element and returns the instance. `MTS.Alert.show(selector, options)` is a static shortcut that does the same thing.

```js
MTS.Alert.show('#my-alert', {
  variant: 'success',
  message: 'Saved.'
});
```

### HTML with `data-*`

A subset of options can be set declaratively on the container. Constructor options passed in JavaScript override the `data-*` values.

```html
<div id="my-alert"
  data-variant="success"
  data-title="Done"
  data-message="Your changes were saved."
  data-closable
  data-auto-dismiss="5000"></div>

<script> new MTS.Alert('#my-alert'); </script>
```

Recognized attributes: `data-variant`, `data-title`, `data-message`, `data-closable` (presence sets `closable: true`), `data-auto-dismiss` (ms), `data-show-borders` (presence sets `showBorders: true`).

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
| `variant` | `string` | `'info'` | `'info'` \| `'success'` \| `'warning'` \| `'danger'` |
| `title` | `string` | `''` | Optional title above the message |
| `message` | `string` | `''` | Main message |
| `closable` | `boolean` | `true` | Show the `×` close button |
| `icon` | `boolean` | `true` | Show the variant icon |
| `showBorders` | `boolean` | `false` | Add a subtle `0.5px` border on the other three sides (the `4px` left accent border is always present). Also via `data-show-borders`. |
| `action` | `string` | `null` | Inline action button label. Renders only when `onAction` is also provided. |
| `onAction` | `function` | `null` | Fires when the action button is clicked |
| `onClose` | `function` | `null` | Fires when the alert is closed |
| `autoDismiss` | `number` | `0` | Auto-close after N ms (`0` = disabled) |

---

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `close()` | `this` | Close the alert with the closing animation, then remove it from the DOM and emit `close` |
| `setMessage(msg)` | `this` | Replace the message text at runtime |
| `on(event, fn)` | `this` | Subscribe to `'action'` or `'close'` |
| `MTS.Alert.show(selector, options)` | instance | Static shortcut for `new MTS.Alert(selector, options)` |

```js
const alert = new MTS.Alert('#container', {
  variant: 'info',
  message: 'Loading...'
});
alert.setMessage('Process complete.');
alert.on('close', function () { console.log('closed'); });
```

---

## Events

Callbacks receive `{ type, detail }`. Each event also dispatches a bubbling DOM `CustomEvent` on the container.

| Callback / listener | DOM event | When |
|---------------------|-----------|------|
| `onAction` / `on('action', fn)` | `mts:alert:action` | The action button is clicked |
| `onClose` / `on('close', fn)` | `mts:alert:close` | The alert finishes closing |

```js
document.getElementById('my-alert')
  .addEventListener('mts:alert:close', function () { console.log('closed'); });
```

---

## i18n

The only component-chrome string is the close button's `aria-label`, taken from the `MTS.Alert` namespace (`closeLabel`, default `'Close'`). Everything the user reads — `title`, `message`, `action` — is content you pass in, so localize it in your own layer.

Load the i18n scripts (optional; only if you need the localized `aria-label`), set the language once at startup, then create alerts. The bundle ships `es` / `en` / `pt`.

```html
<script src="base/matios-ui-i18n.js"></script>
<script src="overlays/matios-ui-alert/matios-ui-alert-i18n.js"></script>
<script src="overlays/matios-ui-alert/matios-ui-alert.js"></script>
<script>
  MTS.setLanguage('en');
</script>
```

Add or override a locale with `MTS.registerLocale`:

```js
MTS.registerLocale('en', {
  'MTS.Alert': {
    closeLabel: 'Dismiss'
  }
});
```

There is no per-instance `locale` option: language is a single global setting applied with `MTS.setLanguage`.

---

## Notes

- `action` and `onAction` must be passed together for the button to render.
- `autoDismiss` combined with `closable: false` works well for unobtrusive confirmation banners.
- The `data-*` attributes allow declarative init without extra JS (useful for server-side rendering).

---

## Accessibility

- The alert uses `role="alert"` for the `danger` variant and `role="status"` for the others, so screen readers announce it when it appears.
- The close and action controls are real `<button>` elements, focusable and keyboard-activatable.
- The close button carries a localized `aria-label` (`closeLabel`).
