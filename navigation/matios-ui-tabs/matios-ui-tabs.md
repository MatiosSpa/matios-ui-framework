# MTS.Tabs

Tab component with underline, pill and card variants, horizontal and vertical layout, lazy rendering, icons and badges.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-tabs.css">
<script src="matios-ui-tabs.js"></script>
```

---

## Usage

```js
// Underline (default)
new MTS.Tabs('#tabs-basic', {
  variant: 'underline',
  tabs: [
    { id: 'a', label: 'Tab A', content: '<p>Content A</p>' },
    { id: 'b', label: 'Tab B', content: '<p>Content B</p>' },
    { id: 'c', label: 'Tab C', content: '<p>Content C</p>', disabled: true },
  ],
  onChange: function (e) { console.log(e.detail.id); },
});

// Pill variant with a preselected tab
new MTS.Tabs('#tabs-pill', { variant: 'pill', active: 'b', tabs: [/* … */] });

// Vertical layout
new MTS.Tabs('#tabs-vertical', { variant: 'card', direction: 'vertical', navWidth: '180px', height: '300px', tabs: [/* … */] });

// With icons and badges
new MTS.Tabs('#tabs-icons', {
  tabs: [{ id: 'inbox', label: 'Inbox', badge: 5, icon: '<svg>...</svg>', content: '...' }],
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tabs` | `array` | `[]` | Tab items (see schema below) |
| `active` | `string` | first tab | Initially active tab id |
| `variant` | `string` | `'underline'` | `'underline'` · `'pill'` · `'card'` · `'bordered'` |
| `direction` | `string` | `'horizontal'` | `'horizontal'` · `'vertical'` |
| `lazy` | `boolean` | `false` | Render a panel only when first activated |
| `border` | `boolean` | `true` | Show the separator border between nav and panels |
| `borderWidth` | `string` | `'2px'` | Separator border width |
| `height` | `string` | `'360px'` | Panel height: `'auto'` · `'stretch'` · e.g. `'200px'` |
| `stretch` | `boolean` | `false` | Alias for `height: 'stretch'` |
| `navWidth` | `string` | `null` | Nav width in vertical mode (e.g. `'200px'`) |
| `panelBorder` | `boolean` | `true` | Left border on the panel in vertical mode |
| `onChange` | `function` | — | Fires when the active tab changes — `{ id, tab }` |

### Tab item schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `label` | `string` | Tab label |
| `content` | `string` | Panel HTML content |
| `icon` | `string` | Icon HTML (optional) |
| `badge` | `string \| number` | Badge text (optional) |
| `disabled` | `boolean` | Disables the tab |

---

## API

| Method | Description |
|--------|-------------|
| `setActive(id)` | Activate a tab programmatically |
| `addTab(tab)` | Add a tab |
| `removeTab(id)` | Remove a tab |
| `on(event, cb)` | Listen to `'change'` |
| `destroy()` | Destroy the instance |

```js
const tabs = new MTS.Tabs('#my-tabs', { tabs: [/* … */] });
tabs.setActive('details');
tabs.addTab({ id: 'new', label: 'New Tab', content: '<p>...</p>' });
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` | `mts:tabs:change` | `{ id, tab }` |

```js
document.getElementById('my-tabs')
  .addEventListener('mts:tabs:change', function (e) { console.log(e.detail.id); });
```

---

## Accessibility

- Tabs are keyboard-navigable (arrow keys move between tabs, `Enter`/`Space` activate); a `disabled` tab is skipped.
- Each panel is associated with its tab and the active state is exposed to assistive tech.

---

## Changelog

### Initial
- Tabs with underline/pill/card/bordered variants, horizontal/vertical layout, lazy panels, icons and badges,
  configurable height/nav width, `onChange`, and `setActive` / `addTab` / `removeTab`.
