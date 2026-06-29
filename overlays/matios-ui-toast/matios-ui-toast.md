# MTS.Toast

Transient notification (snackbar) with variants, positions, action button, auto-dismiss and loading state. Static API — no instantiation required.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-toast.css">
<script src="matios-ui-toast.js"></script>
```

---

## Usage

`MTS.Toast` is a static API — call `MTS.Toast.show(options)` directly.

```js
// Basic
MTS.Toast.show({ message: 'Changes saved.' });

// Success
MTS.Toast.show({ variant: 'success', message: 'File uploaded successfully.', duration: 3000 });

// Warning with title
MTS.Toast.show({ variant: 'warning', title: 'Low storage', message: 'Only 2GB remaining.', duration: 6000 });

// Danger — stays until closed
MTS.Toast.show({ variant: 'danger', message: 'Connection failed. Please try again.', duration: 0, closable: true });

// With an action button
MTS.Toast.show({
  variant: 'info', message: 'New version available.', action: 'Update now',
  onAction: function () { installUpdate(); },
  onClose:  function () { console.log('dismissed'); },
});

// Loading — close manually when done
const loader = MTS.Toast.show({ variant: 'loading', message: 'Uploading file...', duration: 0, closable: false });
await doHeavyWork();
loader.close();
MTS.Toast.show({ variant: 'success', message: 'Done!', position: 'top-center', duration: 2000 });
```

`MTS.Toast.show()` returns an object with a `close()` method to dismiss the toast programmatically.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `message` | `string` | — | Toast message (**required**) |
| `title` | `string` | `null` | Optional title |
| `variant` | `string` | `'default'` | `'default'` · `'success'` · `'warning'` · `'danger'` · `'info'` · `'loading'` |
| `position` | `string` | `'bottom-right'` | `top/bottom` × `left/center/right` |
| `duration` | `number` | `4000` | Auto-close after ms (`0` = manual close) |
| `closable` | `boolean` | `true` | Show the × button |
| `action` | `string` | `null` | Action button label |
| `icon` | `string` | auto | Custom icon HTML |
| `onAction` | `function` | — | Fires when the action button is clicked |
| `onClose` | `function` | — | Fires when the toast closes |

---

## API

| Method | Description |
|--------|-------------|
| `MTS.Toast.show(options)` | Show a toast; returns `{ close() }` |
| `<returned>.close()` | Dismiss the toast programmatically |

```js
const toast = MTS.Toast.show({ variant: 'loading', message: 'Processing...', duration: 0 });
toast.close();
```

---

## Events

| Callback | When |
|----------|------|
| `onAction` | The action button is clicked |
| `onClose` | The toast closes (auto or manual) |

---

## Accessibility

- Toasts render in an `aria-live` region so screen readers announce them; `danger`/`warning` use assertive timing.
- For important actions, prefer `duration: 0` so the toast does not disappear before it can be read or acted on.

---

## Changelog

### 2026-06-29
- Status icons migrated to `MTS.Icon` (`alert-circle`/`check`/`alert-triangle`/`x-circle`/`info`); dropped inline SVG. The
  loading state keeps its CSS spinner. Requires `matios-ui-icons.js`.

### Initial
- Static toast API with default/success/warning/danger/info/loading variants, six positions, auto-dismiss or manual
  close, optional title/action/icon, and a returned handle with `close()`.
