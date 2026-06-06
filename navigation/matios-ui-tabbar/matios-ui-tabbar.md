# MTS.TabBar

Mobile-style bottom navigation bar with icons, labels, badges and three visual variants.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-tabbar.css">
<script src="matios-ui-tabbar.js"></script>
```

---

## Usage

```js
const tabbar = new MTS.TabBar('#my-tabbar', {
  variant:    'default', // 'default' | 'pill' | 'floating'
  active:     'home',
  showLabels: true,
  tabs: [
    { id: 'home',    label: 'Home',    icon: ICON_HOME },
    { id: 'explore', label: 'Explore', icon: ICON_EXPLORE },
    { id: 'inbox',   label: 'Inbox',   icon: ICON_INBOX, badge: 5 },
    { id: 'profile', label: 'Profile', icon: ICON_USER },
  ],
  onChange: function (e) { console.log(e.detail.id, e.detail.tab); },
});
```

Also supports `data-active` and `data-variant` on the container.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tabs` | `array` | `[]` | Tab items (see schema below) |
| `active` | `string` | first tab | Initially active tab id |
| `variant` | `string` | `'default'` | `'default'` · `'pill'` · `'floating'` |
| `showLabels` | `boolean` | `true` | Show labels below the icons |
| `onChange` | `function` | — | Fires when the active tab changes — `{ id, tab }` |

### Tab item schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `label` | `string` | Tab label |
| `icon` | `string` | Icon HTML |
| `badge` | `string \| number` | Badge count or text |

---

## API

| Method | Description |
|--------|-------------|
| `setActive(id)` | Activate a tab programmatically |
| `setBadge(id, value)` | Update (or clear with `null`) a badge |
| `destroy()` | Destroy the instance |

```js
const tabbar = new MTS.TabBar('#my-tabbar', { tabs: [/* … */] });
tabbar.setActive('profile');
tabbar.setBadge('inbox', 12);
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` | `mts:tabbar:change` | `{ id, tab }` |

```js
document.getElementById('my-tabbar')
  .addEventListener('mts:tabbar:change', function (e) { console.log(e.detail.id); });
```

---

## Accessibility

- Tabs are real controls — keyboard-focusable and activatable; the active tab is exposed as the current state.
- With `showLabels: false`, provide an accessible name (`aria-label`/title) on each icon-only tab.

---

## Changelog

### Initial
- Bottom tab bar with default/pill/floating variants, icons, optional labels, badges, `onChange`, and
  `setActive` / `setBadge`.
