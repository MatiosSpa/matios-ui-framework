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
new MTS.Tabs('#my-tabs', {
  variant: 'underline',
  active: 'overview',
  tabs: [
    { id: 'overview', label: 'Overview', content: '<p>Overview content</p>' },
    { id: 'details',  label: 'Details',  content: '<p>Details content</p>' },
    { id: 'history',  label: 'History',  content: '<p>History content</p>', disabled: true },
  ],
  onChange: function (e) {
    console.log(e.detail.id);
    console.log(e.detail.tab);
  },
});
```

The first argument is a CSS selector string or an `Element`. The instance builds itself in place.

```js
// Pill variant with a preselected tab
new MTS.Tabs('#tabs-pill', {
  variant: 'pill',
  active: 'week',
  tabs: [/* … */],
});

// Vertical layout
new MTS.Tabs('#tabs-vertical', {
  variant: 'card',
  direction: 'vertical',
  navWidth: '160px',
  height: '220px',
  tabs: [/* … */],
});

// With icons and badges
new MTS.Tabs('#tabs-icons', {
  tabs: [
    { id: 'inbox', label: 'Inbox', icon: '<svg>...</svg>', badge: 5, content: '<p>5 new messages</p>' },
  ],
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tabs` | `array` | `[]` | Tab items (see schema below) |
| `active` | `string` | first tab id | Initially active tab id |
| `variant` | `string` | `'underline'` | `'underline'` \| `'pill'` \| `'card'` |
| `direction` | `string` | `'horizontal'` | `'horizontal'` \| `'vertical'` |
| `lazy` | `boolean` | `false` | Render a panel only when it is first activated |
| `border` | `boolean` | `true` | Show the separator border between nav and panels |
| `borderWidth` | `string` | `'2px'` | Separator border width |
| `height` | `string` | `'360px'` | Panel height: `'auto'` \| `'stretch'` \| e.g. `'200px'` |
| `stretch` | `boolean` | `false` | Stretch panels to fill the container height (alias for `height: 'stretch'`) |
| `navWidth` | `string` | `null` | Nav width in vertical mode (e.g. `'200px'`); only applied when `direction: 'vertical'` |
| `panelBorder` | `boolean` | `true` | Left border on the panel in vertical mode |
| `onChange` | `function` | — | Fires when the active tab changes; receives `{ type: 'change', detail: { id, tab } }` |

### Tab item schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `label` | `string` | Tab label (rendered as text) |
| `content` | `string` \| `Element` \| `function` | Panel content: HTML string, a DOM `Element`, or a function returning an `Element` |
| `icon` | `string` | Icon HTML (optional) |
| `badge` | `string` \| `number` | Badge text (optional; `null` renders no badge) |
| `disabled` | `boolean` | Disables the tab (optional) |

---

## API

| Method | Description |
|--------|-------------|
| `setActive(id)` | Activate a tab programmatically. No-op if `id` is not found. Returns the instance. |
| `addTab(tab)` | Append a tab item and rebuild. Returns the instance. |
| `removeTab(id)` | Remove a tab by id and rebuild; if it was active, the first remaining tab becomes active. Returns the instance. |
| `getTabs()` | Current tabs as a shallow-copied array |
| `on(event, cb)` | Listen to `'change'`. Returns the instance. |
| `destroy()` | Empty the container element |

```js
const tabs = new MTS.Tabs('#my-tabs', {
  tabs: [
    { id: 'alpha', label: 'Alpha', content: '<p>Alpha</p>' },
    { id: 'beta',  label: 'Beta',  content: '<p>Beta</p>' },
    { id: 'gamma', label: 'Gamma', content: '<p>Gamma</p>' },
  ],
});

tabs.setActive('beta');
tabs.addTab({ id: 'delta', label: 'Delta', content: '<p>Delta</p>' });
tabs.removeTab('delta');
tabs.getTabs();   // → [{ id, label, … }, …] (shallow copy)
```

---

## Events

| Option | DOM event | Payload (`detail`) |
|--------|-----------|--------------------|
| `onChange` | `mts:tabs:change` | `{ id, tab }` |

`change` is the only event emitted. It fires whenever `setActive` runs (from a click, keyboard navigation, or a programmatic call). The DOM event bubbles.

```js
document.getElementById('my-tabs')
  .addEventListener('mts:tabs:change', function (e) {
    console.log(e.detail.id);
    console.log(e.detail.tab);
  });
```

The `onChange` option is registered as a `'change'` listener. Its callback receives `{ type: 'change', detail: { id, tab } }`, so read the id via `e.detail.id`.

---

## Accessibility

- The nav is a `role="tablist"`; each tab is a `role="tab"` button and each panel is a `role="tabpanel"` linked back to its tab.
- Tabs are keyboard-navigable: arrow keys move between tabs (`Left`/`Right` when horizontal, `Up`/`Down` when vertical), and a `disabled` tab is skipped.
- The active state is exposed via `aria-selected`.

---

## Internationalization

`MTS.Tabs` renders no built-in chrome text: tab labels, icons and badges are all supplied by you, so the component itself has nothing to translate. Set the global language once at startup with `MTS.setLanguage('en')` for the rest of the framework; there is no per-instance `locale` option.
