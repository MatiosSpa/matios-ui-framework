# MTS.PanelDropdown

Floating panel anchored to a trigger — notifications, user menu, rich contextual actions. A `position:fixed` portal that escapes any `overflow:hidden`.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-paneldropdown.css">
<script src="matios-ui-paneldropdown.js"></script>
```

---

## Usage

The first argument is the trigger element.

```js
// Notifications panel
const pd = new MTS.PanelDropdown(document.getElementById('btn-notif'), {
  position: 'bottom-end',
  header:   { title: 'Notifications', badge: 3 },
  items: [
    {
      id: 'n1', dot: '#10b981', icon: 'mts-icon-check-circle',
      title: 'Order #1047 delivered', description: 'Ana Torres received her order.',
      timestamp: '5 min ago', unread: true,
      onClick: function (item) { console.log(item.id); },
    },
    { divider: true },
    { id: 'n2', dot: '#6366f1', icon: 'mts-icon-user-plus', title: 'New user', timestamp: '1 hour ago' },
  ],
  footer: { label: 'See all notifications', onClick: function () { router.push('/notifications'); } },
});

// User menu — no footer
new MTS.PanelDropdown(avatarEl, {
  position: 'bottom-end',
  width:    260,
  header:   { title: 'Carlos Méndez' },
  items: [
    { id: 'profile', icon: 'mts-icon-user',     title: 'My profile' },
    { id: 'config',  icon: 'mts-icon-settings', title: 'Settings' },
    { divider: true },
    { id: 'logout',  icon: 'mts-icon-log-out',  title: 'Sign out' },
  ],
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

`{ id, title, description?, timestamp?, dot?, icon?, unread?, onClick? }` or `{ divider: true }`.

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Identifier |
| `title` | `string` | Primary text |
| `description` | `string` | Secondary (muted) text |
| `timestamp` | `string` | Relative time — e.g. "5 min ago" |
| `dot` | `string` | CSS color of the indicator dot — e.g. `'#10b981'` |
| `icon` | `string` | MTS icon class — e.g. `'mts-icon-bell'` |
| `unread` | `boolean` | Highlighted background for unread items |
| `onClick` | `function(item)` | Click callback — closes the panel automatically |

---

## API

| Method | Description |
|--------|-------------|
| `open()` / `close()` / `toggle()` | Control the panel |
| `setItems(items)` | Replace the items (live while open) |
| `setHeaderBadge(n)` | Update the header counter (`0` hides the badge) |
| `on(event, fn)` | Listen to `'open'` / `'close'` |
| `destroy()` | Unmount and clean up listeners |

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

## Accessibility

- Opens from the trigger and closes on outside click and `Esc`; the panel body scrolls when content exceeds `maxHeight`.
- `unread` is a visual cue — convey unread state in text as well for assistive tech.

---

## Changelog

### 2026-05-07
- Initial component. `position:fixed` portal escaping any container `overflow:hidden`.
- Header (title + counter badge), scrollable body (dot/icon/title/description/timestamp/unread), CTA footer.
- `bottom-end` / `bottom-start` positioning with automatic viewport correction; outside-click closes the panel.
