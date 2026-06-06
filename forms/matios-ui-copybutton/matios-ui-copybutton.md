# MTS.CopyButton

Copy-to-clipboard button with automatic visual feedback, target-element support and custom icons.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-button.css">
<link rel="stylesheet" href="matios-ui-copybutton.css">
<script src="matios-ui-button.js"></script>
<script src="matios-ui-copybutton.js"></script>
```

---

## Usage

```js
// Copy static text
const btn = new MTS.CopyButton('#my-btn', {
  text:        'npm install matios-ui',
  label:       'Copy',
  labelCopied: 'Copied!',
  variant:     'secondary',
  resetDelay:  2000,
  onCopy:      function (text) { console.log('copied:', text); },
});

// Copy from another element (reads .value or .textContent)
new MTS.CopyButton('#btn-key', { target: '#api-key', iconOnly: true, size: 'sm', variant: 'ghost' });
```

### HTML with `data-*`

```html
<button id="btn-copy" data-text="npm install matios-ui" data-label="Copy" data-variant="secondary"></button>

<!-- Copy from an input -->
<div class="mts-d-flex mts-gap-1">
  <input id="api-key" class="mts-input" value="sk-1234567890abcdef" readonly>
  <button id="btn-key" data-icon-only data-variant="ghost"></button>
</div>

<script>
  new MTS.CopyButton('#btn-copy', { onCopy: function (text) { console.log('copied:', text); } });
  new MTS.CopyButton('#btn-key', { target: '#api-key' });
</script>
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `text` | `string` | `null` | Static text to copy |
| `target` | `string \| Element` | `null` | Selector/element whose `value` or `textContent` to copy |
| `label` | `string` | localized | Button label |
| `labelCopied` | `string` | localized | Label shown after copying |
| `icon` | `string` | clipboard SVG | Default icon |
| `iconCopied` | `string` | check SVG | Icon shown after copying |
| `variant` | `string` | `'secondary'` | Button variant |
| `size` | `string` | `''` | `'sm'` · `''` · `'lg'` |
| `iconOnly` | `boolean` | `false` | Icon only, no label |
| `resetDelay` | `number` | `2000` | ms before resetting to the initial state |
| `onCopy` | `function` | — | Fires after copying — `(text)` |

---

## API

| Method | Description |
|--------|-------------|
| `setText(text)` | Change the text to copy at runtime |
| `copy()` | Trigger the copy programmatically |
| `destroy()` | Destroy the instance |

```js
const btn = new MTS.CopyButton('#my-btn', { text: 'hello' });
btn.setText('new text to copy');
btn.copy();
```

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onCopy(fn)` | `(text)` | After a successful copy |

---

## Accessibility

- For `iconOnly` buttons, provide an accessible name (`aria-label`) since there is no visible label.
- The copied state is conveyed by both label and icon change; the label change also helps assistive tech.

---

## Changelog

### Initial
- Copy-to-clipboard button with static text or target element, label/icon swap feedback with `resetDelay`,
  `iconOnly`, variants/sizes, `onCopy`, and `setText` / `copy`.
