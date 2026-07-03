# MTS.CopyButton

Copy-to-clipboard button with automatic visual feedback, target-element support and custom icons.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-button.css">
<link rel="stylesheet" href="matios-ui-copybutton.css">
<!-- Required: the default copy/check icons come from MTS.Icon -->
<script src="matios-ui-icons.js"></script>
<script src="matios-ui-button.js"></script>
<script src="matios-ui-copybutton.js"></script>

<!-- Optional: i18n for the button label + demo strings -->
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-copybutton-i18n.js"></script>
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
  onCopy:      function (e) { console.log('copied:', e.detail.text); },
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
  new MTS.CopyButton('#btn-copy', { onCopy: function (e) { console.log('copied:', e.detail.text); } });
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
| `onCopy` | `function` | — | Fires after a successful copy. The handler receives one argument: `{ type: 'copy', detail: { text } }` |

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

The `onCopy` callback and the `copy` listener (registered with `on('copy', fn)`) both receive a single object `{ type: 'copy', detail: { text } }` — read the copied value as `e.detail.text`.

| Registration | Payload | When |
|--------------|---------|------|
| `onCopy` option / `on('copy', fn)` | `{ type, detail: { text } }` | After a successful copy |

A bubbling DOM `CustomEvent` is also dispatched on the element, with the text in its `detail`:

```js
document.getElementById('my-btn')
  .addEventListener('mts:copybutton:copy', function (e) { console.log(e.detail.text); });
```

---

## Internationalization (i18n)

The button's own chrome — the `label` (`Copy`) and `labelCopied` (`Copied!`) text — is read from the `MTS.CopyButton` namespace of the active language, with an English fallback when the i18n script isn't loaded. Bundled languages: `es`, `en`, `pt`.

```js
MTS.setLanguage('en');   // 'es' | 'en' | 'pt' — set once at startup, before creating components
```

Passing `label` / `labelCopied` explicitly overrides the localized text for that instance. The optional file `matios-ui-copybutton-i18n.js` also carries the strings the demo page uses (under `MTS.CopyButton.demo`).

---

## Accessibility

- For `iconOnly` buttons, provide an accessible name (`aria-label`) since there is no visible label.
- The copied state is conveyed by both label and icon change; the label change also helps assistive tech.
