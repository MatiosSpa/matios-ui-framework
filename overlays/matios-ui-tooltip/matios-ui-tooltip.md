# MTS.Tooltip

Tooltip with smart positioning (auto-flip when it would overflow the viewport), hover / click / focus triggers, show / hide delays, dark / light variants, custom colors and HTML-or-text content. Includes a static `initAll()` for bulk initialization from `data-mts-tooltip*` attributes.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-tooltip.css">
<script src="matios-ui-tooltip.js"></script>
```

---

## Usage

The component is element-first: `new MTS.Tooltip(target, options)`, where `target` is a CSS selector string or an `Element`. If the target cannot be resolved, the constructor silently does nothing.

```js
// Basic hover
new MTS.Tooltip('#btn-save', {
  content: 'Save document',
  position: 'top'
});

// Click trigger with HTML-or-text content
new MTS.Tooltip('#btn-info', {
  content: '<strong>Pro tip:</strong> Use ⌘S to save quickly.',
  trigger: 'click',
  position: 'bottom',
  maxWidth: 260
});

// With delays
new MTS.Tooltip('#btn-help', {
  content: 'Detailed help text.',
  delay: 400,
  hideDelay: 200,
  position: 'right'
});

// Light variant + event listener
const tt = new MTS.Tooltip('#btn-track', {
  content: 'Track this',
  variant: 'light'
});
tt.on('show', function () { analytics.track('tooltip_shown'); });
```

### Bulk init from HTML attributes

`MTS.Tooltip.initAll()` scans the document for `[data-mts-tooltip]` elements and creates one tooltip per element.

```html
<button
  data-mts-tooltip="Save document"
  data-mts-tooltip-position="top">Save</button>

<button
  data-mts-tooltip="Delete item"
  data-mts-tooltip-position="bottom"
  data-mts-tooltip-variant="light">Delete</button>

<script>
  MTS.Tooltip.initAll();                    // all [data-mts-tooltip] elements
  MTS.Tooltip.initAll('#my-toolbar button'); // or a custom selector
</script>
```

Attributes read by `initAll()`:

| Attribute | Maps to option |
|-----------|----------------|
| `data-mts-tooltip` | `content` |
| `data-mts-tooltip-position` | `position` |
| `data-mts-tooltip-trigger` | `trigger` |
| `data-mts-tooltip-variant` | `variant` |
| `data-mts-tooltip-color` | `color` |
| `data-mts-tooltip-bg` | `bg` |

The constructor also reads a separate set of `data-*` attributes off the target element when they are present (option values passed explicitly to the constructor take precedence): `data-content`, `data-position`, `data-trigger`, `data-delay`, `data-variant`, `data-max-width`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `content` | `string` | `''` | Tooltip content (rendered as text) |
| `position` | `string` | `'top'` | `'top'` \| `'bottom'` \| `'left'` \| `'right'` |
| `trigger` | `string` | `'hover'` | `'hover'` \| `'click'` \| `'focus'` |
| `delay` | `number` | `0` | Show delay in ms |
| `hideDelay` | `number` | `0` | Hide delay in ms |
| `offset` | `number` | `8` | Gap between target and tooltip in px |
| `variant` | `string` | `'dark'` | `'dark'` \| `'light'` |
| `maxWidth` | `number` | `220` | Max width in px |
| `color` | `string` | `null` | Custom text color (inline style) |
| `bg` | `string` | `null` | Custom background color (inline style) |

Note: although `content` accepts an HTML string, the tooltip renders it as plain text (`textContent`), so markup is escaped and shown literally.

---

## Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `show()` | `this` | Show the tooltip (honors `delay`) |
| `hide()` | `this` | Hide the tooltip (honors `hideDelay`) |
| `setContent(value)` | `this` | Update the content; re-positions if currently visible |
| `on(event, callback)` | `this` | Subscribe to `'show'` / `'hide'` |
| `destroy()` | `undefined` | Remove the tooltip element and unbind all listeners |
| `MTS.Tooltip.initAll([selector])` | `undefined` | Static. Initialize all matching elements (default selector `[data-mts-tooltip]`) |

```js
const tt = new MTS.Tooltip('#my-btn', { content: 'Hello' });
tt.setContent('New tooltip text');
```

---

## Events

Callbacks registered with `on(...)` receive an object `{ type, detail }`. The same events are also dispatched as bubbling DOM `CustomEvent`s on the target element.

| Callback | DOM event | When |
|----------|-----------|------|
| `on('show', fn)` | `mts:tooltip:show` | The tooltip becomes visible |
| `on('hide', fn)` | `mts:tooltip:hide` | The tooltip is hidden |

```js
document.getElementById('my-btn')
  .addEventListener('mts:tooltip:show', function () { console.log('shown'); });
```

---

## Behavior notes

- Positioning auto-flips to the opposite side when the preferred side would overflow the viewport, and clamps horizontally to stay on screen.
- The tooltip repositions on `scroll` and `resize` while visible.
- Pressing `Escape` hides the tooltip. For the `click` trigger, clicking outside the target also hides it; for `hover`, moving the pointer onto the tooltip keeps it open.
- The tooltip element carries `role="tooltip"`, and the target receives an `aria-describedby` pointing to it.

---

## Accessibility

- Prefer the `focus` trigger (or pair `hover` with a focus-capable target) so keyboard users can reveal the tooltip; `Esc` hides it.
- Keep essential information out of tooltip-only content — tooltips are supplementary, not the sole source.

---

## Internationalization

The component has no localizable runtime strings — all tooltip content is developer-supplied, and the only fixed markup is the ARIA `role`/`aria-describedby` wiring. The accompanying `matios-ui-tooltip-i18n.js` (namespace `MTS.Tooltip`) contains **demo-only** strings and is not required at runtime.

If you localize the surrounding page, set the language once at startup via the global API:

```js
MTS.setLanguage('es'); // 'es' | 'en' | 'pt'
```

Supply your own tooltip `content` per instance in the desired language.
