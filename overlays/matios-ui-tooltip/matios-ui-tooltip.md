# MTS.Tooltip

Tooltip with smart positioning, multiple triggers, variants and HTML content support. Includes `initAll()` for bulk initialization from HTML attributes.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-tooltip.css">
<script src="matios-ui-tooltip.js"></script>
```

---

## Usage

```js
// Basic hover
new MTS.Tooltip('#btn-save', { content: 'Save document', position: 'top' });

// Click trigger with HTML content
new MTS.Tooltip('#btn-info', {
  content: '<strong>Pro tip:</strong> Use ⌘S to save quickly.', trigger: 'click', position: 'bottom', maxWidth: 260,
});

// With delays
new MTS.Tooltip('#btn-help', { content: 'Detailed help text.', delay: 400, hideDelay: 200, position: 'right' });

// Light variant + events
const tt = new MTS.Tooltip('#btn-track', { content: 'Track this', variant: 'light' });
tt.on('show', function () { analytics.track('tooltip_shown'); });
```

### HTML with `data-*` (bulk init)

```html
<button data-tooltip="Save document" data-tooltip-position="top">Save</button>
<button data-tooltip="Delete item" data-tooltip-position="bottom" data-tooltip-variant="light">Delete</button>

<script>
  MTS.Tooltip.initAll();           // all [data-tooltip] elements
  MTS.Tooltip.initAll('#my-area'); // or within a container
</script>
```

Supported `data-*`: `data-tooltip`, `data-tooltip-position`, `data-tooltip-trigger`, `data-tooltip-variant`,
`data-tooltip-delay`, `data-tooltip-max-width`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `content` | `string` | `''` | Tooltip HTML or text |
| `position` | `string` | `'top'` | `'top'` · `'bottom'` · `'left'` · `'right'` |
| `trigger` | `string` | `'hover'` | `'hover'` · `'click'` · `'focus'` |
| `delay` | `number` | `0` | Show delay in ms |
| `hideDelay` | `number` | `0` | Hide delay in ms |
| `offset` | `number` | `8` | Gap between target and tooltip in px |
| `variant` | `string` | `'dark'` | `'dark'` · `'light'` |
| `maxWidth` | `number` | `220` | Max width in px |
| `color` | `string` | `null` | Custom text color |
| `bg` | `string` | `null` | Custom background color |

---

## API

| Method | Description |
|--------|-------------|
| `show()` / `hide()` | Show / hide manually |
| `setContent(value)` | Update content at runtime |
| `on(event, cb)` / `off(event, cb)` | Listen to `'show'` / `'hide'` |
| `destroy()` | Destroy the instance |
| `MTS.Tooltip.initAll([scope])` | Initialize all `[data-tooltip]` elements (optionally within a scope) |

```js
const tt = new MTS.Tooltip('#my-btn', { content: 'Hello' });
tt.setContent('New tooltip text');
```

---

## Events

| Method | DOM event | When |
|--------|-----------|------|
| `on('show', fn)` | `mts:tooltip:show` | The tooltip shows |
| `on('hide', fn)` | `mts:tooltip:hide` | The tooltip hides |

```js
document.getElementById('my-btn')
  .addEventListener('mts:tooltip:show', function () { console.log('shown'); });
```

---

## Accessibility

- Prefer the `focus` (or `hover`+`focus`) trigger so keyboard users can reveal the tooltip; `Esc` hides it.
- Keep essential information out of tooltip-only content — tooltips are supplementary, not the sole source.

---

## Changelog

### Initial
- Tooltip with smart positioning, hover/click/focus triggers, show/hide delays, dark/light variants, custom
  colors, HTML content, `setContent`, and `initAll()` bulk init from `data-*` attributes.
