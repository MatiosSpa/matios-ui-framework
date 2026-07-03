# MTS.PanelDropdown

Floating panel anchored to a trigger — notifications, user menu, rich contextual actions. The body is an item list (dot / icon / title / description / timestamp / unread) with optional dividers, an optional header (title + counter badge) and an optional CTA footer. It renders as a `position:fixed` portal appended to `<body>`, so it escapes any container `overflow:hidden`. Only one panel is open at a time (opening one closes any other).

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-paneldropdown.css">
<script src="matios-ui-paneldropdown.js"></script>
```

---

## Usage

The first argument is the trigger element (an `Element` or a CSS selector string). The second is the options object.

```js
// Notifications panel
const pd = new MTS.PanelDropdown(document.getElementById('notif-btn'), {
  position: 'bottom-end',
  header:   { title: 'Notifications', badge: 3 },
  items: [
    { id: 'n1', dot: '#10b981', icon: 'mts-icon-check-circle',
      title: 'Order #1047 delivered',
      description: 'Ana Torres received her order.',
      timestamp: '5 min ago', unread: true },
    { id: 'n2', dot: '#6366f1', icon: 'mts-icon-user-plus',
      title: 'New user registered',
      description: 'Rodrigo Campos signed up.',
      timestamp: '18 min ago', unread: true },
    { divider: true },
    { id: 'n4', dot: '#f59e0b', icon: 'mts-icon-dollar-sign',
      title: 'Payment processed',
      description: '$4,200 received from Luis Herrera.',
      timestamp: '1 hour ago' },
  ],
  footer: { label: 'View all notifications', onClick: function () { console.log('view all'); } },
});

// User menu — no footer
new MTS.PanelDropdown(document.getElementById('user-btn'), {
  position: 'bottom-end',
  width:    260,
  header:   { title: 'Carlos Méndez' },
  items: [
    { id: 'profile', icon: 'mts-icon-user',        title: 'My profile' },
    { id: 'config',  icon: 'mts-icon-settings',     title: 'Settings' },
    { divider: true },
    { id: 'logout',  icon: 'mts-icon-log-out',      title: 'Log out' },
  ],
  footer: null,
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `header` | `{ title, badge? } \| null` | `null` | Header with title and counter badge |
| `items` | `array` | `[]` | Body items (see schema below) |
| `footer` | `{ label, onClick } \| null` | `null` | Footer with a CTA button |
| `width` | `number` | `320` | Panel width in px |
| `maxHeight` | `number` | `420` | Max body height (enables scroll) |
| `position` | `string` | `'bottom-end'` | `'bottom-end'` · `'bottom-start'` |
| `onOpen` | `function` | — | Fires when the panel opens |
| `onClose` | `function` | — | Fires when the panel closes |

### Item schema

Each entry is either a normal item or a divider: `{ divider: true }`.

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Identifier — passed back to `onClick` |
| `title` | `string` | Primary text |
| `description` | `string` | Secondary (muted) text |
| `timestamp` | `string` | Right-aligned text — e.g. "5 min ago" |
| `dot` | `string` | CSS color of the indicator dot — e.g. `'#10b981'` |
| `icon` | `string` | MTS icon class — e.g. `'mts-icon-bell'` |
| `unread` | `boolean` | Highlighted background for unread items |
| `onClick` | `function(item)` | Click callback — receives the item; closes the panel automatically |
| `divider` | `boolean` | When `true`, renders a separator line instead of an item |

---

## API

| Method | Description |
|--------|-------------|
| `open()` / `close()` / `toggle()` | Control the panel |
| `setItems(items)` | Replace the items (live while open) |
| `setHeaderBadge(n)` | Update the header counter (`0` hides the badge) |
| `on(event, fn)` | Listen to `'open'` / `'close'` |
| `off(event, fn)` | Remove a previously registered listener |
| `destroy()` | Close the panel and remove all listeners |

```js
pd.setItems(newItems);
pd.setHeaderBadge(0);
```

---

## Events

| Method | When |
|--------|------|
| `onOpen` / `on('open', fn)` | The panel opens |
| `onClose` / `on('close', fn)` | The panel closes |

---

## Behavior

- Clicking the trigger toggles the panel; clicking outside it closes it. On scroll the panel is repositioned while the trigger stays visible, and closes once the trigger leaves the viewport.
- Position (`bottom-end` / `bottom-start`) is corrected against the viewport edges, flipping above the trigger when there is not enough room below.
- The panel body scrolls when content exceeds `maxHeight`.

---

## Accessibility

- `unread` is a visual cue only — convey unread state in text as well for assistive tech.

---

## Internationalization

The component renders no chrome text of its own — every visible string (header title, item titles/descriptions/timestamps, footer label) is supplied by you through the options. There is nothing to localize at runtime, so no per-instance language setting exists.

To translate the strings you pass in, resolve them yourself before building the options. The global language API applies:

```js
MTS.setLanguage('es'); // 'es' | 'en' | 'pt'
```

The `MTS.PanelDropdown` i18n namespace shipped with the package holds only the demo-page strings, not component chrome.
