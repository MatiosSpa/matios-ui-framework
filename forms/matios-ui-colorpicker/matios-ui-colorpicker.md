# MTS.ColorPicker

Selector de color standalone con sliders H/S/L, paleta de presets, input hex y soporte hex/rgb/hsl. Modos trigger e inline. 0 dependencias.

## Uso
```js
new MTS.ColorPicker('#el', {
  value:   '#4f8eff',
  format:  'hex',
  onChange: ({ hex, value }) => console.log(hex, value),
})
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `value` | `string` | `'#4f8eff'` | Color inicial (hex) |
| `label` | `string` | `''` | Etiqueta |
| `format` | `string` | `'hex'` | `'hex'`\|`'rgb'`\|`'hsl'` |
| `presets` | `Array` | 14 colores | Paleta de presets |
| `showPresets` | `boolean` | `true` | Muestra paleta |
| `showSliders` | `boolean` | `true` | Muestra sliders HSL |
| `showInput` | `boolean` | `true` | Muestra input hex |
| `inline` | `boolean` | `false` | Siempre visible, sin trigger |
| `size` | `string` | `'md'` | `'sm'`\|`'md'`\|`'lg'` |
| `disabled` | `boolean` | `false` | |
| `onChange` | `function` | `null` | `({ hex, value, formatted }) => {}` |
| `onOpen` | `function` | `null` | Al abrir el popup |
| `onClose` | `function` | `null` | Al cerrar el popup |

## API
```js
const cp = new MTS.ColorPicker('#el', { value: '#ff0000' })
cp.getValue()        // → '#ff0000' (según format)
cp.getHex()          // → '#ff0000' siempre hex
cp.setValue('#00ff00')
cp.setFormat('rgb')  // → 'rgb(0, 255, 0)'
cp.open()
cp.close()
cp.disable() / cp.enable()
cp.destroy()
```

## Eventos DOM
```js
el.addEventListener('mts:colorpicker:change', (e) => {
  console.log(e.detail.hex, e.detail.value)
})
```

---

## HTML declarativo

```html
<div id="miColor" data-value="#7c3aed" data-label="Color de marca" data-format="hex"></div>

<script>
new MTS.ColorPicker('#miColor', {
  onChange: ({ hex }) => console.log('Color:', hex),
})
</script>
```

| Atributo | JS | Descripción |
|----------|-----|-------------|
| `data-value` | `value` | Color inicial |
| `data-label` | `label` | |
| `data-format` | `format` | `hex`·`rgb`·`hsl` |
| `data-inline` | `inline` | Siempre visible (presencia activa) |
| `data-disabled` | `disabled` | (presencia activa) |
| `data-size` | `size` | `sm`·`md`·`lg` |

