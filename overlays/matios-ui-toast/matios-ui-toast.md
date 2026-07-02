# MTS.Toast

Transient notification (snackbar) with variants, positions, an optional action button, auto-dismiss, a progress bar and a loading state. Static API — no instantiation required.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-toast.css">
<script src="matios-ui-icons.js"></script>
<script src="matios-ui-toast.js"></script>
```

`matios-ui-icons.js` is required: the status icons (`default`/`success`/`warning`/`danger`/`info`) are rendered through `MTS.Icon.get(...)`. The `loading` variant uses a CSS spinner instead of an icon.

---

## Usage

`MTS.Toast` is a static API — call `MTS.Toast.show(options)` directly. No instance is created and there is no `new`.

```js
// Basic (default variant)
MTS.Toast.show({ message: 'Changes saved.' });

// Success
MTS.Toast.show({
  variant: 'success',
  message: 'File uploaded successfully.',
  duration: 3000
});

// Warning with title
MTS.Toast.show({
  variant: 'warning',
  title: 'Low storage',
  message: 'Only 2GB remaining.',
  duration: 6000
});

// Danger — stays until closed
MTS.Toast.show({
  variant: 'danger',
  message: 'Connection failed. Please try again.',
  duration: 0,
  closable: true
});

// With an action button
MTS.Toast.show({
  variant: 'info',
  title: 'Update available',
  message: 'Version 2.0 is ready.',
  action: 'Install now',
  duration: 0,
  onAction: function () { installUpdate(); },
  onClose: function () { console.log('dismissed'); }
});

// Loading — close the returned handle manually when done
var loader = MTS.Toast.show({
  variant: 'loading',
  message: 'Uploading file...',
  duration: 0,
  closable: false
});
// ... later ...
loader.close();
MTS.Toast.show({ variant: 'success', message: 'Upload complete!' });
```

`MTS.Toast.show()` returns an object with a `close()` method to dismiss the toast programmatically.

### Shortcut helpers

Every variant except `default` has a shortcut on `MTS.Toast.show`. Each takes `(message, options)` and forwards to `show` with the matching `variant`:

```js
MTS.Toast.show.success('File saved.');
MTS.Toast.show.warning('Low disk space.', { duration: 6000 });
MTS.Toast.show.danger('Connection failed.', { duration: 0 });
MTS.Toast.show.info('New version available.');
MTS.Toast.show.loading('Working...');
```

The available shortcuts are `success`, `warning`, `danger`, `info` and `loading`. There is no `error` shortcut — use `danger`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `message` | `string` | — | Toast message (**required**) |
| `title` | `string` | none | Optional bold title above the message |
| `variant` | `string` | `'default'` | `'default'` \| `'success'` \| `'warning'` \| `'danger'` \| `'info'` \| `'loading'` |
| `position` | `string` | `'bottom-right'` | `'top-right'` \| `'top-left'` \| `'top-center'` \| `'bottom-right'` \| `'bottom-left'` \| `'bottom-center'` |
| `duration` | `number` | `4000` | Milliseconds before auto-close; `0` = no auto-close. For `variant: 'loading'` the default is `0` |
| `closable` | `boolean` | `true` | Show the × close button. For `variant: 'loading'` the default is `false` |
| `icon` | `string` | per-variant | HTML string to override the default variant icon |
| `action` | `string` | none | Action button label; omit for no action button |
| `onAction` | `function` | none | Called when the action button is clicked (the toast then closes) |
| `onClose` | `function` | none | Called after the toast finishes closing (auto, ×, or action) |

Notes:

- `duration` and `closable` default differently for `loading`: a loading toast does not auto-close and has no × by default, so it stays until you call `close()` on the returned handle.
- A progress bar is rendered along the bottom edge only when `duration > 0`.

---

## API

| Method | Description |
|--------|-------------|
| `MTS.Toast.show(options)` | Show a toast; returns `{ close }` |
| `MTS.Toast.show.success(message, options)` | Shortcut for `variant: 'success'` |
| `MTS.Toast.show.warning(message, options)` | Shortcut for `variant: 'warning'` |
| `MTS.Toast.show.danger(message, options)` | Shortcut for `variant: 'danger'` |
| `MTS.Toast.show.info(message, options)` | Shortcut for `variant: 'info'` |
| `MTS.Toast.show.loading(message, options)` | Shortcut for `variant: 'loading'` |
| `<returned>.close()` | Dismiss the toast programmatically |

```js
var toast = MTS.Toast.show({
  variant: 'loading',
  message: 'Processing...',
  duration: 0
});
toast.close();
```

---

## Events

Both callbacks receive a single event object.

| Callback | Argument | When |
|----------|----------|------|
| `onAction` | `{ type: 'action' }` | The action button is clicked (the toast closes right after) |
| `onClose` | `{ type: 'close' }` | The toast has finished its close transition (auto, ×, or action) |

---

## Stacking & positioning

- One fixed container is created per position on first use and reused afterward (six possible containers).
- Toasts in the same position stack vertically with an 8px gap.
- In `bottom-*` positions a new toast is appended below the existing ones; in `top-*` positions it is inserted above them.
- Containers cap their width at `min(420px, 100vw - 32px)`.

---

## Accessibility

- Each toast is given `role="alert"`, so screen readers announce it when it appears.
- The × close button uses the `×` glyph; there is no configurable label.
- For important messages, prefer `duration: 0` so the toast does not disappear before it can be read or acted on.

---

## Localization

This component has **no localizable runtime strings**. The only fixed piece of chrome is the `×` close glyph (a symbol, not translatable text); everything else — `message`, `title` and the `action` label — is supplied by the caller.

The sibling `matios-ui-toast-i18n.js` file contains **demo strings only** (under `MTS.Toast.demo`) and is not required to use the component. If you want the demo page to render in another language, load the global i18n and set the language once at startup:

```html
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-toast-i18n.js"></script>
```

```js
MTS.setLanguage('es'); // 'es' | 'en' | 'pt'
```

To add or override a language, register it before setting it:

```js
MTS.registerLocale('fr', { 'MTS.Toast': { /* ... */ } });
MTS.setLanguage('fr');
```

There is no per-instance `locale` option.
