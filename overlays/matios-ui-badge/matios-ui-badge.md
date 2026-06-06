# MTS.Badge

Badge, pill and counter component. Works via CSS classes alone or with JS for dynamic counters, removable tags and notification dots.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-badge.css">
<script src="matios-ui-badge.js"></script>
```

---

## Usage

### CSS only (no JS)

```html
<span class="mts-badge mts-badge--primary">Primary</span>
<span class="mts-badge mts-badge--success">Active</span>
<span class="mts-badge mts-badge--danger">Error</span>

<!-- Sizes -->
<span class="mts-badge mts-badge--xs">XS</span>
<span class="mts-badge mts-badge--lg">LG</span>

<!-- Notification dot with pulse -->
<span class="mts-badge mts-badge--danger mts-badge--dot mts-badge--pulse"></span>
```

### JavaScript

```js
// Dynamic counter
const badge = new MTS.Badge('#badge-inbox', { count: 42, maxCount: 99, variant: 'danger' });
badge.setCount(100); // → "99+"
badge.setCount(0);   // → hidden (zero state)

// Removable tag
new MTS.Badge('#tag-ts', {
  label: 'TypeScript', variant: 'primary', removable: true,
  onRemove: function (e) { e.detail.badge._el.remove(); },
});

// Notification dot with pulse
new MTS.Badge('#btn-notifications', { dot: true, pulse: true, variant: 'danger' });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `label` | `string` | element text | Badge text |
| `count` | `number` | `null` | Numeric counter |
| `maxCount` | `number` | `99` | Max before showing "99+" |
| `dot` | `boolean` | `false` | Dot only, no text |
| `variant` | `string` | `'default'` | `'default'` · `'primary'` · `'success'` · `'warning'` · `'danger'` · `'info'` · `'accent'` |
| `shape` | `string` | `'pill'` | `'pill'` · `'square'` · `'dot'` |
| `size` | `string` | `'md'` | `'xs'` · `'sm'` · `'md'` · `'lg'` |
| `removable` | `boolean` | `false` | Show the remove button |
| `pulse` | `boolean` | `false` | Pulse animation (for notification dots) |
| `onRemove` | `function` | — | Fires when the remove button is clicked |

---

## API

| Method | Description |
|--------|-------------|
| `setCount(n)` | Update the counter (`0` hides, `null` removes the counter) |
| `setLabel(text)` | Update the label |
| `on(event, cb)` / `off(event, cb)` | Listen to `'remove'` |
| `MTS.Badge.render(options)` | Returns a badge HTML string (static) |

```js
const badge = new MTS.Badge('#my-badge', { count: 5, variant: 'danger' });
badge.setCount(0);
MTS.Badge.render({ label: 'NEW', variant: 'primary', size: 'sm' });
// → '<span class="mts-badge mts-badge--primary mts-badge--sm">NEW</span>'
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onRemove` | `mts:badge:remove` | `{ badge }` |

```js
document.getElementById('my-badge')
  .addEventListener('mts:badge:remove', function (e) { console.log(e.detail.badge); });
```

---

## CSS Classes

`.mts-badge` (base) + `--{primary|success|warning|danger|info|accent}` (variant), `--{xs|sm|lg}` (size),
`--dot` (dot only), `--pulse` (pulse animation), `--square` (square shape).

---

## Accessibility

- A counter badge attached to a control should be reflected in the control's accessible name (e.g. "Inbox, 42 unread").
- A `dot`-only badge is decorative — convey its meaning in adjacent text for assistive tech.

---

## Changelog

### Initial
- Badge/pill/counter with 7 variants, 4 sizes, pill/square/dot shapes, `maxCount` overflow, removable tags,
  pulse dots, CSS-only usage, `setCount` / `setLabel`, and static `render()`.
