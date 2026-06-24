# MTS.ColorPicker

Standalone color picker with H/S/L sliders, preset palette, hex input and hex/rgb/hsl output formats. Trigger and inline modes. Zero dependencies.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-colorpicker.css">
<script src="matios-ui-colorpicker.js"></script>
```

---

## Usage

```js
// Trigger mode (popup)
const cp = new MTS.ColorPicker('#my-picker', {
  value:       '#4f8eff',
  label:       'Primary color',
  format:      'hex', // 'hex' | 'rgb' | 'hsl'
  showPresets: true,
  showSliders: true,
  showInput:   true,
  onChange: function (c) {
    console.log(c.hex);       // → '#4f8eff' (always hex)
    console.log(c.value);     // → depends on format
    console.log(c.formatted); // → 'rgb(79, 142, 255)' when format: 'rgb'
  },
});

// Inline mode (always visible)
new MTS.ColorPicker('#picker-inline', {
  inline:   true,
  value:    '#34d399',
  format:   'rgb',
  onChange: function (c) { console.log(c.value); }, // → 'rgb(52, 211, 153)'
});
```

### HTML with `data-*`

```html
<div id="picker-brand" data-value="#7c3aed" data-label="Brand color" data-format="hex"></div>
<div id="picker-inline" data-inline></div>

<script> new MTS.ColorPicker('#picker-brand', { onChange: function (c) { console.log(c.hex); } }); </script>
```

Available `data-*`: `data-value`, `data-label`, `data-format`, `data-inline`, `data-disabled`, `data-size`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `string` | `'#4f8eff'` | Initial color (hex) |
| `label` | `string` | `''` | Field label |
| `format` | `string` | `'hex'` | Output format: `'hex'` · `'rgb'` · `'hsl'` |
| `presets` | `array` | 14 colors | Preset color palette |
| `showPresets` | `boolean` | `true` | Show the preset palette |
| `showSliders` | `boolean` | `true` | Show the HSL sliders |
| `showInput` | `boolean` | `true` | Show the hex input |
| `inline` | `boolean` | `false` | Always visible, no trigger |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` |
| `disabled` | `boolean` | `false` | Disables interaction |
| `required` | `boolean` | `false` | Opt-in `validate()`. Pass `value: null` for an empty start so `required` is meaningful (see [Form Field Contract](../FORM-FIELD-CONTRACT.md)) |
| `errorMessage` | `string` | `null` | Overrides the `required` message (localized default when `null`) |
| `onChange` | `function` | — | Fires when the color changes — `{ hex, value, formatted }` |
| `onOpen` | `function` | — | Fires when the popup opens |
| `onClose` | `function` | — | Fires when the popup closes |

---

## API

| Method | Description |
|--------|-------------|
| `getValue()` | Current value, respecting `format` (`'#4f8eff'` / `'rgb(…)'` / `'hsl(…)'`) |
| `getHex()` | Always returns the hex value |
| `setValue(color)` | Set the color programmatically |
| `setFormat(fmt)` | Change the output format |
| `validate()` | Validates `required` (empty = no color / `value: null`), inline error + `'validate'` event → `boolean` |
| `setError(msg)` / `clearError()` | Set / clear the error state |
| `open()` / `close()` | Control the popup (trigger mode) |
| `enable()` / `disable()` | Enable / disable interaction |
| `destroy()` | Destroy the instance |

```js
const cp = new MTS.ColorPicker('#my-picker', { value: '#4f8eff' });
cp.setValue('#00ff00');
cp.setFormat('rgb');
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` | `mts:colorpicker:change` | `{ hex, value, formatted }` |
| `onOpen` / `onClose` | — | — |

```js
document.getElementById('my-picker')
  .addEventListener('mts:colorpicker:change', function (e) { console.log(e.detail.hex); });
```

---

## CSS Classes

Validation (form-field contract) - see [Form Field Contract](../FORM-FIELD-CONTRACT.md):

- `.mts-form-error` (inline message), `.mts-form-hint` (helper text), `.mts-label--required` (red asterisk on the label) - shared, single source in `base/matios-ui-base.css`.
- `.mts-colorpicker__trigger-wrap--error` - error state on the control (red border), toggled by `setError()`.

---

## Accessibility

- The hex input accepts typed values; the sliders are keyboard-operable (arrow keys step H/S/L).
- Provide a `label` so the control has an accessible name; the preset swatches expose their color value.

---

## Changelog

### 2026-06-23
- Validation contract: `required` + `errorMessage` + `validate()` + `setError`/`clearError` (inline error, localized message). Now supports `value: null` (empty state) so `required` is meaningful. See [Form Field Contract](../FORM-FIELD-CONTRACT.md).

### Initial
- Color picker with HSL sliders, preset palette, hex input, hex/rgb/hsl output, trigger and inline modes,
  and `getValue` / `getHex` / `setValue` / `setFormat` API.
