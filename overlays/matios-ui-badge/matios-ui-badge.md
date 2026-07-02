# MTS.Badge

Badge, pill and counter component. Works via CSS classes alone, or with JS for dynamic counters, removable tags and notification dots.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-badge.css">
<script src="matios-ui-badge.js"></script>
```

Optional — load the i18n file before the component to localize the remove-button `aria-label` (es / en / pt):

```html
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-badge-i18n.js"></script>
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

<!-- Square shape -->
<span class="mts-badge mts-badge--success mts-badge--square">Square</span>

<!-- Notification dot with pulse -->
<span class="mts-badge mts-badge--danger mts-badge--dot mts-badge--pulse"></span>
```

### JavaScript (element-first)

The constructor takes an element or a selector and initializes it in place.

```js
// Dynamic counter
const badge = new MTS.Badge('#badge-count', {
  count: 42,
  maxCount: 99,
  variant: 'danger',
  shape: 'pill',
  size: 'md'
});
badge.setCount(100); // → "99+"
badge.setCount(0);   // → adds mts-badge--zero (zero state)

// Removable tag
new MTS.Badge('#tag-ts', {
  label: 'TypeScript',
  variant: 'primary',
  removable: true,
  onRemove: function (e) {
    e.detail.badge._el.remove();
  }
});

// Notification dot with pulse
new MTS.Badge('#badge-dot', {
  dot: true,
  pulse: true,
  variant: 'danger'
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `label` | `string` | element text | Badge text |
| `count` | `number` | `null` | Numeric counter (renders the formatted number instead of `label`) |
| `maxCount` | `number` | `99` | Max value before showing `"99+"` |
| `dot` | `boolean` | `false` | Render only a dot, no content |
| `variant` | `string` | `'default'` | `'default'` \| `'primary'` \| `'success'` \| `'warning'` \| `'danger'` \| `'info'` \| `'accent'` |
| `shape` | `string` | `'pill'` | `'pill'` \| `'square'` \| `'dot'` |
| `size` | `string` | `'md'` | `'xs'` \| `'sm'` \| `'md'` \| `'lg'` |
| `removable` | `boolean` | `false` | Show the remove (×) button |
| `pulse` | `boolean` | `false` | Pulse animation (for notification dots) |
| `onRemove` | `function` | — | Shortcut for `on('remove', cb)` — fires when the remove button is clicked |

---

## Methods

All setters return `this` (chainable).

| Method | Description |
|--------|-------------|
| `setCount(n)` | Set the counter; `0` adds the `mts-badge--zero` class (zero state) |
| `increment(by = 1)` | Add `by` to the current count |
| `decrement(by = 1)` | Subtract `by` from the current count (floored at `0`) |
| `setLabel(text)` | Update the label text |
| `setVariant(variant)` | Swap the variant class |
| `setPulse(active)` | Toggle the pulse animation |
| `show()` | Remove the `mts-badge--hidden` class |
| `hide()` | Add the `mts-badge--hidden` class |
| `destroy()` | Remove the element from the DOM |
| `on(event, cb)` | Subscribe to an event (`'remove'`) |
| `off(event, cb)` | Unsubscribe |

```js
const badge = new MTS.Badge('#my-badge', { count: 5, variant: 'danger' });
badge.increment();     // 6
badge.decrement(2);    // 4
badge.setVariant('warning').setPulse(true);
```

---

## Static helpers

| Helper | Returns | Description |
|--------|---------|-------------|
| `MTS.Badge.create(options)` | `HTMLElement` | Builds a new `<span>` badge (same `options` as the constructor) ready to insert |
| `MTS.Badge.html(label, variant = 'default', size = 'md', shape = 'pill')` | `string` | Returns a badge HTML string (for `innerHTML`) |

```js
// Element
const el = MTS.Badge.create({ label: 'NEW', variant: 'primary', size: 'sm' });
document.body.appendChild(el);

// HTML string
MTS.Badge.html('NEW', 'primary', 'sm');
// → '<span class="mts-badge mts-badge--primary mts-badge--sm mts-badge--pill">NEW</span>'
```

---

## Events

The `'remove'` event fires both to `on('remove', cb)` listeners and as a bubbling DOM `CustomEvent`.

| Event | DOM event | Payload |
|-------|-----------|---------|
| `remove` | `mts:badge:remove` | `{ badge }` |

The `onRemove` callback receives `{ type: 'remove', detail: { badge } }`, so the badge instance is at `e.detail.badge`.

```js
document.getElementById('my-badge')
  .addEventListener('mts:badge:remove', function (e) {
    console.log(e.detail.badge);
  });
```

---

## CSS classes

`.mts-badge` (base) plus modifiers:

| Modifier | Purpose |
|----------|---------|
| `--default` `--primary` `--success` `--warning` `--danger` `--info` `--accent` | Variant |
| `--pill` `--square` `--dot` | Shape |
| `--xs` `--sm` `--md` `--lg` | Size |
| `--dot` | Dot only, no text |
| `--pulse` | Pulse animation |
| `--removable` | Applied when the remove button is present |
| `--zero` | Applied by `setCount(0)` (zero state) |
| `--hidden` | Applied by `hide()` |

---

## i18n

The only localizable runtime string is the remove button's `aria-label`. It is read from `MTS.getString()['MTS.Badge'].removeLabel` (keys shipped for `es` / `en` / `pt`); if the i18n file is not loaded it falls back to `"Remove"`. All badge content (`label`, `count`) is developer-supplied and not localized by the component.

Set the language once at startup with `MTS.setLanguage('es' | 'en' | 'pt')`. There is no per-instance locale option.

---

## Accessibility

- A counter badge attached to a control should be reflected in the control's accessible name (e.g. "Inbox, 42 unread").
- A `dot`-only badge is decorative — convey its meaning in adjacent text for assistive tech.
- The remove button carries a localized `aria-label`.
