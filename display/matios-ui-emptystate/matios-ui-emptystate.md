# MTS.EmptyState

Empty-state placeholder with preset variants, custom icon, CTA button and size options.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-emptystate.css">
<script src="matios-ui-emptystate.js"></script>
```

---

## Usage

```js
// Preset variants
new MTS.EmptyState('#my-empty', {
  variant:  'no-data',
  action:   'Add first item',
  onAction: function (e) { createItem(); },
});

new MTS.EmptyState('#my-empty', {
  variant:     'search',
  title:       'No results for "dashboard"',
  description: 'Try different keywords.',
  action:      'Clear search',
  onAction:    function (e) { clearSearch(); },
});

new MTS.EmptyState('#my-empty', {
  variant:     'error',
  title:       'Something went wrong',
  description: 'We could not load the data.',
  action:      'Try again',
  onAction:    function (e) { reload(); },
});

new MTS.EmptyState('#my-empty', {
  variant:     'permissions',
  title:       'Access restricted',
  description: 'Contact your administrator.',
});

// Custom icon
new MTS.EmptyState('#my-empty', {
  variant:     'custom',
  icon:        '<svg>...</svg>',
  title:       'No messages',
  description: 'Start a conversation.',
  action:      'New message',
  onAction:    function (e) { openChat(); },
});

// Small size
new MTS.EmptyState('#my-empty', { variant: 'no-data', size: 'sm' });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | `string` | `'no-data'` | `'no-data'` · `'search'` · `'error'` · `'permissions'` · `'custom'` |
| `title` | `string` | auto | Title text (auto from variant) |
| `description` | `string` | auto | Description text |
| `action` | `string` | `null` | CTA button label |
| `icon` | `string` | auto | Custom SVG icon (overrides the variant icon) |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` |
| `onAction` | `function` | — | Fires when the CTA button is clicked |

---

## API

| Method | Description |
|--------|-------------|
| `update(options)` | Update any option and re-render |
| `on(event, cb)` / `off(event, cb)` | Register / remove listeners (`'action'`) |

```js
const es = new MTS.EmptyState('#my-empty', { variant: 'no-data' });
es.update({ variant: 'search', title: 'No results for "xyz"', description: 'Try different keywords.' });
es.on('action', function (e) { console.log('CTA clicked'); });
```

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onAction(fn)` / `on('action', fn)` | — | The CTA button is clicked |

Also dispatched as a DOM event:

```js
document.getElementById('my-empty')
  .addEventListener('mts:emptystate:action', function () { console.log('action clicked'); });
```

---

## Accessibility

- The preset icons are decorative; the title carries the message. Keep `title` concise and meaningful.
- The CTA renders as a real `<button>` — it is keyboard-focusable and activates on `Enter`/`Space`.

---

## Changelog

### Initial
- Empty state with `no-data` / `search` / `error` / `permissions` / `custom` variants, auto title/description per
  variant, custom icon, CTA button (`onAction`), sizes, and `update()`.
