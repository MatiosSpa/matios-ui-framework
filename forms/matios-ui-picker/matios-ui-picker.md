# MTS.Picker

Selectores de fecha, hora, rango, mes, semana y color. Cada tipo es una clase independiente que extiende una base común.

---

## Instalación
```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-picker-shared.css">

<!-- Cargar solo los que necesitas -->
<script src="matios-ui-picker-base.js"></script>
<script src="matios-ui-picker-date.js"></script>
<script src="matios-ui-picker-time.js"></script>
<script src="matios-ui-picker-datetime.js"></script>
<script src="matios-ui-picker-daterange.js"></script>
<script src="matios-ui-picker-month.js"></script>
<script src="matios-ui-picker-week.js"></script>
<script src="matios-ui-picker-color.js"></script>
```

---

## MTS.Picker.Date — Solo fecha
```js
const dp = new MTS.Picker.Date('#mi-input', {
  format:   'DD/MM/YYYY',
  locale:   'es-CL',
  minDate:  new Date('2024-01-01'),
  maxDate:  new Date('2025-12-31'),
  disabledDays: [0, 6],   // 0=Dom, 6=Sáb
  clearable: true,
  onChange: (e) => console.log(e.detail.value, e.detail.formatted),
})
dp.setValue(new Date())
dp.getValue()    // → Date
dp.clear()
```

---

## MTS.Picker.Time — Solo hora
```js
new MTS.Picker.Time('#mi-input', {
  timeStep:  15,    // pasos en minutos
  startHour: 8,
  endHour:   20,
  onChange: (e) => console.log(e.detail.formatted),
})
```

---

## MTS.Picker.DateTime — Fecha + hora
```js
new MTS.Picker.DateTime('#mi-input', {
  format:   'DD/MM/YYYY',
  timeStep:  5,
  onChange: (e) => console.log(e.detail.value),
})
```

---

## MTS.Picker.DateRange — Rango de fechas
```js
const rp = new MTS.Picker.DateRange('#mi-input', {
  onChange: (e) => {
    console.log(e.detail.value.start)   // Date inicio
    console.log(e.detail.value.end)     // Date fin
    console.log(e.detail.formatted)     // "01/03/2025 → 15/03/2025"
  },
})
rp.setValue([new Date('2025-03-01'), new Date('2025-03-15')])
rp.getValue()   // → { start: Date, end: Date }
```

---

## MTS.Picker.Month — Mes y año
```js
new MTS.Picker.Month('#mi-input', {
  onChange: (e) => console.log(e.detail.formatted),  // "03/2025"
})
```

---

## MTS.Picker.Week — Semana
```js
new MTS.Picker.Week('#mi-input', {
  onChange: (e) => {
    console.log(e.detail.value.start)   // lunes de la semana
    console.log(e.detail.value.end)     // domingo de la semana
    console.log(e.detail.formatted)     // "Semana 12 - 2025"
  },
})
```

---

## MTS.Picker.Color — Color (hex, rgb, hsl)
```js
const cp = new MTS.Picker.Color('#mi-input', {
  value:       '#4f8eff',
  colorFormat: 'hex',      // 'hex' | 'rgb' | 'hsl'
  presets: ['#f87171', '#34d399', '#4f8eff', '#a78bfa'],
  onChange: (e) => {
    console.log(e.detail.value)    // "#4f8eff" | "rgb(...)" | "hsl(...)"
    console.log(e.detail.hex)      // siempre el hex
  },
})
cp.setValue('#ff5500')
cp.getValue()   // → string en el formato configurado
```

---

## API común (todos los pickers)
```js
picker.open()
picker.close()
picker.getValue()       // → valor según tipo
picker.setValue(...)    // → instancia (chainable)
picker.clear()
picker.destroy()

picker.on('change', (e) => { e.detail.value; e.detail.formatted })
picker.on('open',   () => {})
picker.on('close',  () => {})

// Alias — ambos funcionan igual
picker.on('change',  fn)
picker.on('onSelect', fn)  // alias
```

---

## Eventos DOM
```js
document.getElementById('mi-input')
  .addEventListener('mts:picker:change', (e) => {
    console.log(e.detail.value)
    console.log(e.detail.formatted)
  })
```

---

## Changelog
| Versión | Descripción |
|---------|-------------|
| 2.0.0 | Separado en clases individuales. Fix cierre al seleccionar. MTS.Picker.Month, Week, Color nuevos. |
| 1.0.0 | Release inicial (clase única con modos) |
