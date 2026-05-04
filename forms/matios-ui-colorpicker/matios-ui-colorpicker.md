# MTS.ColorPicker

🇬🇧 Standalone color picker with H/S/L sliders, preset palette, hex input and hex/rgb/hsl output formats. Trigger and inline modes. Zero dependencies.
🇪🇸 Selector de color standalone con sliders H/S/L, paleta de presets, input hex y formatos hex/rgb/hsl. Modos trigger e inline. 0 dependencias.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-colorpicker.css">
<script src="matios-ui-colorpicker.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `value` | `string` | `'#4f8eff'` | 🇬🇧 Initial color (hex) / 🇪🇸 Color inicial (hex) |
| `label` | `string` | `''` | 🇬🇧 Field label / 🇪🇸 Etiqueta del campo |
| `format` | `string` | `'hex'` | 🇬🇧 Output format: `'hex'` · `'rgb'` · `'hsl'` / 🇪🇸 Formato de salida |
| `presets` | `array` | 14 colors | 🇬🇧 Preset color palette / 🇪🇸 Paleta de colores preset |
| `showPresets` | `boolean` | `true` | 🇬🇧 Show preset palette / 🇪🇸 Mostrar paleta |
| `showSliders` | `boolean` | `true` | 🇬🇧 Show HSL sliders / 🇪🇸 Mostrar sliders HSL |
| `showInput` | `boolean` | `true` | 🇬🇧 Show hex input / 🇪🇸 Mostrar input hex |
| `inline` | `boolean` | `false` | 🇬🇧 Always visible, no trigger / 🇪🇸 Siempre visible, sin trigger |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` |
| `disabled` | `boolean` | `false` | 🇬🇧 Disables interaction / 🇪🇸 Deshabilita la interacción |
| `onChange` | `function` | — | 🇬🇧 Fires when color changes / 🇪🇸 Se dispara al cambiar el color |
| `onOpen` | `function` | — | 🇬🇧 Fires when popup opens / 🇪🇸 Se dispara al abrir el popup |
| `onClose` | `function` | — | 🇬🇧 Fires when popup closes / 🇪🇸 Se dispara al cerrar el popup |

---

## Events / Eventos

🇬🇧 Use `onChange`, `onOpen` and `onClose` in the constructor.
🇪🇸 Usa `onChange`, `onOpen` y `onClose` en el constructor.

```js
new MTS.ColorPicker('#my-picker', {
  // Fires when user selects a color / Se dispara al seleccionar un color
  onChange: ({ hex, value, formatted }) => {
    console.log(hex);       // → '#4f8eff' (always hex / siempre hex)
    console.log(value);     // → depends on format / depende del format
    console.log(formatted); // → 'rgb(79, 142, 255)' if format: 'rgb'
  },

  // Fires when popup opens / Se dispara al abrir el popup
  onOpen: () => console.log('opened'),

  // Fires when popup closes / Se dispara al cerrar el popup
  onClose: () => console.log('closed'),
});
```

---

## HTML Usage / Uso HTML

```html
<!-- Trigger mode (popup) / Modo trigger (popup) -->
<div id="picker-brand"
  data-value="#7c3aed"
  data-label="Brand color"
  data-format="hex">
</div>

<script>
  new MTS.ColorPicker('#picker-brand', {
    onChange: ({ hex }) => console.log('Color:', hex),
  });
</script>

<!-- Inline mode (always visible) / Modo inline (siempre visible) -->
<div id="picker-inline" data-inline></div>

<script>
  new MTS.ColorPicker('#picker-inline', {
    value:    '#34d399',
    onChange: ({ hex }) => console.log(hex),
  });
</script>
```

🇬🇧 Available `data-*` attributes:
🇪🇸 Atributos `data-*` disponibles:

| Attribute / Atributo | JS Option |
|----------------------|-----------|
| `data-value` | `value` |
| `data-label` | `label` |
| `data-format` | `format` |
| `data-inline` | `inline` (presence activates) |
| `data-disabled` | `disabled` (presence activates) |
| `data-size` | `size` |

---

## JavaScript Usage / Uso JavaScript

```js
// Trigger mode / Modo trigger (popup)
const cp = new MTS.ColorPicker('#my-picker', {
  value:       '#4f8eff',
  label:       'Primary color',
  format:      'hex',       // 'hex' | 'rgb' | 'hsl'
  showPresets: true,
  showSliders: true,
  showInput:   true,
  size:        'md',
  onChange: ({ hex, value }) => {
    document.getElementById('preview').style.background = hex;
  },
});

// Inline mode / Modo inline
new MTS.ColorPicker('#picker-inline', {
  inline:   true,
  value:    '#34d399',
  format:   'rgb',
  onChange: ({ value }) => console.log(value), // → 'rgb(52, 211, 153)'
});
```

---

## API

```js
const cp = new MTS.ColorPicker('#my-picker', { ... });

// Get current value (respects format) / Obtener valor actual (respeta format)
cp.getValue()         // → '#4f8eff' | 'rgb(79,142,255)' | 'hsl(218,100%,66%)'

// Always returns hex / Siempre retorna hex
cp.getHex()           // → '#4f8eff'

// Set color programmatically / Establecer color programáticamente
cp.setValue('#00ff00')

// Change output format / Cambiar formato de salida
cp.setFormat('rgb')   // → subsequent getValue() returns 'rgb(...)'

// Open / close popup / Abrir / cerrar popup
cp.open()
cp.close()

// Enable / disable / Habilitar / deshabilitar
cp.disable()
cp.enable()

// Destroy / Destruir
cp.destroy()
```

---

## DOM Event / Evento DOM

```js
document.getElementById('my-picker')
  .addEventListener('mts:colorpicker:change', (e) => {
    console.log(e.detail.hex);   // → always hex
    console.log(e.detail.value); // → formatted value
  });
```

---
