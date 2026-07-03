# MTS.EmptyState

Empty-state placeholder with preset variants, an auto icon/title/description per variant, an optional CTA button, and size options.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-emptystate.css">

<!-- Optional: global i18n (English / Portuguese). Without it the component uses its Spanish defaults. -->
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-emptystate-i18n.js"></script>

<script src="matios-ui-emptystate.js"></script>
```

---

## Usage

```js
// Preset variant — title and description are filled in automatically
new MTS.EmptyState('#es-nodata', {
  variant:  'no-data',
  action:   'Add item',
  onAction: function (e) { createItem(); },
});

// Override any auto text per instance
new MTS.EmptyState('#es-search', {
  variant:     'search',
  title:       'No results for "dashboard"',
  description: 'Try different keywords.',
  action:      'Clear search',
  onAction:    function (e) { clearSearch(); },
});

new MTS.EmptyState('#es-error', {
  variant:  'error',
  action:   'Retry',
  onAction: function (e) { reload(); },
});

new MTS.EmptyState('#es-perms', {
  variant:     'permissions',
  description: 'Contact your administrator.',
});

// Custom SVG icon
new MTS.EmptyState('#es-custom', {
  icon:        '<svg>...</svg>',
  title:       'No messages',
  description: 'Start a conversation.',
  action:      'New message',
  onAction:    function (e) { openChat(); },
});

// Size
new MTS.EmptyState('#es-sm', {
  variant: 'no-data',
  size:    'sm',
});
```

The constructor is element-first: `new MTS.EmptyState(el|selector, options)`. It renders in place — there is no `.mount()`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | `string` | `'no-data'` | Preset. `'no-data'` \| `'search'` \| `'error'` \| `'permissions'`. Any other value (e.g. `'custom'`) falls back to the `no-data` icon and an empty auto description. |
| `title` | `string` | auto | Title text. Auto-filled from `variant` when omitted. |
| `description` | `string` | auto | Description text. Auto-filled from `variant` when omitted; empty for unknown variants. |
| `action` | `string` | `null` | CTA button label. No button is rendered when omitted. |
| `onAction` | `function` | — | Registered as an `'action'` listener; fires when the CTA button is clicked. |
| `icon` | `string` | auto | Custom SVG markup that overrides the variant icon. Sanitized via `MTS.Sanitize.html` when available. |
| `size` | `string` | `'md'` | `'sm'` \| `'md'` \| `'lg'`. Applied as the `mts-emptystate--<size>` modifier class. |

The auto `title` / `description` for the four preset variants come from the i18n table (see below); passing `title` or `description` always overrides them.

---

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `update(options)` | `this` | Merges `options` onto the instance and re-renders. |
| `on(event, cb)` | `this` | Registers a listener (only `'action'` is emitted). |
| `off(event, cb)` | `this` | Removes a previously registered listener. |

```js
const es = new MTS.EmptyState('#my-empty', { variant: 'no-data' });
es.update({ variant: 'search', title: 'No results for "xyz"', description: 'Try different keywords.' });
es.on('action', function (e) { console.log('CTA clicked', e.type, e.detail); });
```

---

## Events

| Callback | Payload | When |
|----------|---------|------|
| `onAction(fn)` / `on('action', fn)` | `{ type: 'action', detail: {} }` | The CTA button is clicked. |

The same click is also dispatched as a bubbling DOM `CustomEvent` on the host element:

```js
document.getElementById('my-empty')
  .addEventListener('mts:emptystate:action', function () { console.log('action clicked'); });
```

---

## i18n

The auto title/description for each preset variant are read from the global i18n table under the `MTS.EmptyState` namespace (`messages` sub-object). Language is set once, globally:

```js
MTS.setLanguage('en'); // 'es' (default) | 'en' | 'pt'
```

There is no per-instance language option. Any `title` / `description` you pass in `options` always wins over the i18n default.

Keys under `MTS.getString()['MTS.EmptyState'].messages`:

| Key | Used for |
|-----|----------|
| `titleNoData` / `descNoData` | `variant: 'no-data'` |
| `titleSearch` / `descSearch` | `variant: 'search'` |
| `titleError` / `descError` | `variant: 'error'` |
| `titlePermissions` / `descPermissions` | `variant: 'permissions'` |
| `titleDefault` | Title fallback for an unknown variant |

Override or extend a locale with `MTS.registerLocale`:

```js
MTS.registerLocale('en', {
  'MTS.EmptyState': { messages: { titleNoData: 'Nothing to show' } }
});
```

Without `matios-ui-i18n.js` / `matios-ui-emptystate-i18n.js` loaded, the component falls back to its built-in Spanish strings.

---

## Accessibility

- The preset icons are decorative; the title carries the message. Keep `title` concise and meaningful.
- The CTA renders as a real `<button>` — it is keyboard-focusable and activates on `Enter` / `Space`.
