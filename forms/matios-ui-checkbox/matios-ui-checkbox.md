# matios-ui-checkbox

Checkbox, CheckboxGroup, Radio, Toggle/Switch y Slider/Range en un solo archivo.

## Instalación
```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-checkbox.css">
<script src="matios-ui-checkbox.js"></script>
```

## Checkbox
```js
const chk = new MTS.Checkbox('#chk', {
  label:   'Acepto los términos',
  checked: false,
  onChange: (e) => console.log(e.detail.checked),
})
chk.isChecked()        // → boolean
chk.setChecked(true)
chk.toggle()
chk.setIndeterminate(true)
```

## CheckboxGroup
```js
const group = new MTS.CheckboxGroup('#group', {
  options: [
    { value: 'pdf',  label: 'PDF' },
    { value: 'docx', label: 'Word' },
    { value: 'xlsx', label: 'Excel', disabled: true },
  ],
  value:    ['pdf'],
  onChange: (e) => console.log(e.detail.value),
})
group.getValue() // → ['pdf', 'docx']
```

## Radio
```js
const radio = new MTS.Radio('#radio', {
  name:    'formato',
  options: [
    { value: 'table', label: 'Tabla' },
    { value: 'card',  label: 'Tarjetas' },
    { value: 'list',  label: 'Lista' },
  ],
  value:    'table',
  onChange: (e) => console.log(e.detail.value),
})
radio.getValue()     // → 'table'
radio.setValue('card')
```

## Toggle / Switch
```js
const toggle = new MTS.Toggle('#toggle', {
  label:    'Notificaciones activas',
  checked:  true,
  size:     'md',  // 'sm'|'md'|'lg'
  onChange: (e) => console.log(e.detail.checked),
})
toggle.isChecked()    // → boolean
toggle.setChecked(false)
toggle.toggle()
```

## Slider / Range
```js
// Simple
const slider = new MTS.Slider('#slider', {
  min:   0, max: 100, step: 5,
  value: 40,
  label: 'Volumen',
  showValue: true,
  labelFormat: (v) => `${v}%`,
  onChange: (e) => console.log(e.detail.value),
})

// Rango doble
const range = new MTS.Slider('#range', {
  range:  true,
  min:    0, max: 1000, step: 10,
  value:  200, value2: 800,
  label:  'Precio',
  labelFormat: ([a, b]) => `$${a} – $${b}`,
  onChange: (e) => console.log(e.detail.value), // → [200, 800]
})
slider.getValue()     // → number | [number, number]
slider.setValue(60)   // simple
slider.setValue([300, 700]) // rango
```

## Eventos DOM
| Componente | Evento | Namespace |
|-----------|--------|-----------|
| Checkbox | `change` | `mts:checkbox:change` |
| Radio | `change` | `mts:radio:change` |
| Toggle | `change` | `mts:toggle:change` |
| Slider | `change` | `mts:slider:change` |

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — Checkbox, CheckboxGroup, Radio, Toggle, Slider |
