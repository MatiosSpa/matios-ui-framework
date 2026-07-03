# MTS.ColorPicker

Standalone color picker with H/S/L sliders, preset palette, hex input and hex/rgb/hsl output formats. Trigger, preview and inline modes. Zero dependencies.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-colorpicker.css">
<script src="matios-ui-icons.js"></script>
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-colorpicker-i18n.js"></script>
<script src="matios-ui-colorpicker.js"></script>
```

`matios-ui-icons.js` is required — the trigger chevron and the preview-mode button use `MTS.Icon`. The i18n scripts are required for localized chrome (the `Apply` button, the preview aria-label and the preview chip text); without them the built-in English fallbacks are used.

---

## Usage

```js
// Trigger mode (popup)
const cp = new MTS.ColorPicker('#my-picker', {
  value: '#4f8eff',
  label: 'Primary color',
  format: 'hex',
  showPresets: true,
  showSliders: true,
  showInput: true,
  onChange: function (c) {
    console.log(c.hex);       // → '#4f8eff' (always hex)
    console.log(c.value);     // → depends on format
    console.log(c.formatted); // → same as value (e.g. 'rgb(79, 142, 255)' when format: 'rgb')
  }
});

// Inline mode (always visible)
new MTS.ColorPicker('#picker-inline', {
  inline: true,
  value: '#34d399',
  format: 'rgb',
  onChange: function (c) { console.log(c.value); } // → 'rgb(52, 211, 153)'
});
```

### HTML with `data-*`

```html
<div id="picker-brand" data-value="#7c3aed" data-label="Brand color" data-format="hex"></div>
<div id="picker-inline" data-inline></div>

<script>
  new MTS.ColorPicker('#picker-brand', { onChange: function (c) { console.log(c.hex); } });
</script>
```

Available `data-*`: `data-value`, `data-label`, `data-format`, `data-inline`, `data-disabled`, `data-size`, `data-required`, `data-error-message`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `value` | `string` | `'#4f8eff'` | Initial color (any CSS color; normalized to hex). Pass `null` for an empty start |
| `label` | `string` | `''` | Field label |
| `format` | `string` | `'hex'` | Output format: `'hex'` \| `'rgb'` \| `'hsl'` |
| `presets` | `array` | 20 colors | Preset color palette (max 20; excess is silently trimmed) |
| `showPresets` | `boolean` | `true` | Show the preset palette |
| `showSliders` | `boolean` | `true` | Show the HSL sliders |
| `showInput` | `boolean` | `true` | Show the hex text input |
| `showFormatSwitch` | `boolean` | `true` | Show the format-switch button (HEX/RGB/HSL) in the popup footer |
| `showTriggerText` | `boolean` | `true` | Show the current value text next to the swatch in the trigger |
| `triggerVariant` | `string` | `'default'` | `'default'` (swatch + value + chevron) \| `'preview'` (color chip + icon button) |
| `previewText` | `string` | localized | Text inside the chip when `triggerVariant: 'preview'` (localized default) |
| `inline` | `boolean` | `false` | Always visible, no trigger |
| `size` | `string` | `'md'` | `'sm'` \| `'md'` \| `'lg'` |
| `renderMode` | `string` | `'auto'` | `'auto'` \| `'field-only'` \| `'standalone'` — controls label rendering when nested in a `.mts-form-group` |
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
| `getValue()` | Current value, respecting `format` (`'#4f8eff'` / `'rgb(…)'` / `'hsl(…)'`; `''` when empty) |
| `getHex()` | Always returns the hex value (or `null` when empty) |
| `setValue(color)` | Set the color programmatically (`null`/`''` clears it) |
| `setFormat(fmt)` | Change the output format (`'hex'` \| `'rgb'` \| `'hsl'`) |
| `validate()` | Validates `required` (empty = no color / `value: null`); shows inline error and emits `'validate'` → `boolean` |
| `setError(msg)` / `clearError()` | Set / clear the error state |
| `open()` / `close()` | Control the popup (trigger mode) |
| `enable()` / `disable()` | Enable / disable interaction (rebuilds the control) |
| `on(event, cb)` / `off(event, cb)` | Add / remove a listener (`'change'`, `'open'`, `'close'`, `'validate'`) |
| `destroy()` | Close the popup and empty the container |

```js
const cp = new MTS.ColorPicker('#my-picker', { value: '#4f8eff' });
cp.setValue('#00ff00');
cp.setFormat('rgb');
```

---

## Events

Callbacks (`onChange` / `onOpen` / `onClose`) and `on()` listeners both fire; a bubbling DOM `CustomEvent` is also dispatched on the host element for every event.

| Callback | Listener key | DOM event | Payload (`detail`) |
|----------|--------------|-----------|--------------------|
| `onChange` | `'change'` | `mts:colorpicker:change` | `{ hex, value, formatted }` |
| `onOpen` | `'open'` | `mts:colorpicker:open` | `{}` |
| `onClose` | `'close'` | `mts:colorpicker:close` | `{}` |
| — | `'validate'` | `mts:colorpicker:validate` | `{ valid, errors }` |

```js
document.getElementById('my-picker')
  .addEventListener('mts:colorpicker:change', function (e) { console.log(e.detail.hex); });
```

---

## CSS Classes

Validation (form-field contract) — see [Form Field Contract](../FORM-FIELD-CONTRACT.md):

- `.mts-form-error` (inline message), `.mts-form-hint` (helper text), `.mts-label--required` (red asterisk on the label) — shared, single source in `base/matios-ui-base.css`.
- `.mts-colorpicker__trigger-wrap--error` — error state on the control (red border), toggled by `setError()`.

---

## i18n

Localized chrome lives under the `MTS.ColorPicker` namespace (`messages` block) in `matios-ui-colorpicker-i18n.js`, for `es` / `en` / `pt`. The active language is the global one — set it once at startup with `MTS.setLanguage('es' | 'en' | 'pt')`; there is no per-instance `locale` option.

Localized keys:

| Key | en | Used for |
|-----|-----|----------|
| `required` | `This field is required` | Default `required` validation message |
| `apply` | `Apply` | Popup footer confirm button |
| `pickColor` | `Pick a color` | `aria-label` of the preview-mode icon button |
| `previewText` | `Preview` | Default chip text in `triggerVariant: 'preview'` |

---

## Accessibility

- The hex input accepts typed values; the sliders are keyboard-operable (arrow keys step H/S/L).
- Provide a `label` so the control has an accessible name; the preset swatches expose their color value via `title`.
- In `triggerVariant: 'preview'`, the icon button has a localized `aria-label`.
