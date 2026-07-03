# MTS.TabBar

Mobile-style bottom navigation bar with icons, labels, badges and three visual variants.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-tabbar.css">
<script src="matios-ui-tabbar.js"></script>
```

Optional: load `matios-ui-sanitize.js` before the component. When present, tab
`icon` HTML is passed through `MTS.Sanitize.html()`.

---

## Usage

```js
const tabbar = new MTS.TabBar('#my-tabbar', {
  variant:    'default',
  active:     'home',
  showLabels: true,
  tabs: [
    { id: 'home',    label: 'Home',    icon: ICON_HOME },
    { id: 'search',  label: 'Search',  icon: ICON_SEARCH },
    { id: 'inbox',   label: 'Inbox',   icon: ICON_INBOX, badge: 3 },
    { id: 'profile', label: 'Profile', icon: ICON_USER }
  ],
  onChange: function (e) { console.log(e.detail.id, e.detail.tab); }
});
```

The first argument is a CSS selector string or an `Element`. The bar is rendered
in place inside that element.

### Declarative attributes

`active`, `variant` and `showLabels` can also be set on the container. Explicit
`options` override the `data-*` values.

```html
<div id="my-tabbar" data-active="home" data-variant="pill" data-show-labels></div>
```

Note: the presence of `data-show-labels` (any value, or empty) sets
`showLabels` to `true`; it cannot force `false`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tabs` | `array` | `[]` | Tab items (see schema below) |
| `active` | `string` | first tab id | Initially active tab id |
| `variant` | `string` | `'default'` | `'default'` \| `'pill'` \| `'floating'` |
| `showLabels` | `boolean` | `true` | Show labels below the icons |
| `onChange` | `function` | — | Registered as a `change` listener (see Events) |

### Tab item schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `label` | `string` | Tab label (shown when `showLabels` is `true`) |
| `icon` | `string` | Icon HTML (sanitized when `MTS.Sanitize` is loaded) |
| `badge` | `string` \| `number` | Optional badge; hidden when `undefined`, `null` or `''` |

---

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `setActive(id)` | `this` | Activate a tab programmatically (does not fire `change`) |
| `setBadge(id, value)` | `this` | Update a badge; pass `null` / `''` / `undefined` to clear it |
| `on(event, callback)` | `this` | Subscribe to an event (see Events) |
| `destroy()` | — | Empty the container |

```js
const tabbar = new MTS.TabBar('#my-tabbar', { tabs: [/* … */] });
tabbar.setActive('profile');
tabbar.setBadge('inbox', 12);
```

---

## Events

Fired when the user clicks a tab. `setActive()` does **not** fire it.

| Source | Name | Payload |
|--------|------|---------|
| `onChange` option / `on('change', cb)` | `change` | `{ type: 'change', detail: { id, tab } }` |
| DOM `CustomEvent` (bubbles) | `mts:tabbar:change` | `e.detail = { id, tab }` |

`id` is the clicked tab id; `tab` is the full tab item object.

```js
const tabbar = new MTS.TabBar('#my-tabbar', { tabs: [/* … */] });
tabbar.on('change', function (e) { console.log(e.detail.id, e.detail.tab); });

document.getElementById('my-tabbar')
  .addEventListener('mts:tabbar:change', function (e) { console.log(e.detail.id); });
```

---

## i18n

The component has no built-in visible text of its own: tab labels are supplied
by the developer via `tabs[].label`. There are no localized chrome strings to
configure, so no language wiring is required for the component itself.

Language is a single global setting for the whole framework. Set it once at
startup with `MTS.setLanguage('es' | 'en' | 'pt')`; there is no per-instance
`locale` option.

---

## Accessibility

- Tabs are real `<button>` controls — keyboard-focusable and activatable; the
  active tab carries the `mts-tabbar__item--active` class.
- With `showLabels: false`, provide an accessible name (`aria-label` / `title`)
  on each icon-only tab, since no text label is rendered.
