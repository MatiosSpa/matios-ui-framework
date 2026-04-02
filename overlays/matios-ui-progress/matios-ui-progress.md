# matios-ui-progress

Barra de progreso lineal, circular e indeterminada para Matios UI.

---

## Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-progress.css">
<script src="matios-ui-progress.js"></script>
```

---

## Tipos

| Tipo | Cuándo usarlo |
|------|--------------|
| `bar` | Progreso lineal general — default |
| `circle` | KPIs, métricas redondas |
| `indeterminate` | Carga sin valor conocido |

---

## Uso rápido

```js
// Barra lineal
const bar = new MTS.Progress('#mi-div', { value: 65 })
bar.setValue(80)

// Circular con label
const circle = new MTS.Progress('#mi-div', {
  type:      'circle',
  value:     75,
  showLabel: true,
})

// Indeterminado — animación infinita
const loader = new MTS.Progress('#mi-div', { type: 'indeterminate' })
```

---

## Configuración completa

```js
new MTS.Progress('#el', {
  // — Tipo —
  type:        'bar',       // 'bar'|'circle'|'indeterminate'

  // — Valor —
  value:       0,           // valor actual
  min:         0,           // mínimo
  max:         100,         // máximo

  // — Apariencia —
  variant:     'default',   // 'default'|'success'|'warning'|'danger'|'info'|'accent'
  size:        'md',        // 'xs'|'sm'|'md'|'lg'
  showLabel:   true,        // muestra el %
  showValue:   false,       // muestra "65 / 100" en vez del %
  striped:     false,       // efecto rayado
  animated:    false,       // rayas en movimiento
  rounded:     true,        // bordes redondeados

  // — Solo para circle —
  radius:      40,          // radio en px
  strokeWidth: 6,           // grosor del trazo

  // — Formato del label —
  labelFormat: (value, max, pct) => `${value} de ${max}`,

  // — Eventos —
  onChange:   (e) => console.log(e.detail.pct),
  onComplete: (e) => console.log('Completado'),
})
```

---

## API pública

```js
const bar = new MTS.Progress('#el', config)

// Valor
bar.setValue(75)           // con animación
bar.setValue(75, false)    // sin animación
bar.increment()            // +1
bar.increment(10)          // +10
bar.decrement(5)           // -5
bar.reset()                // vuelve al mínimo

// Apariencia
bar.setVariant('success')
bar.setIndeterminate(true)  // activa animación infinita
bar.setIndeterminate(false) // vuelve al modo normal

// Destruir
bar.destroy()
```

---

## Eventos

### API `.on()`

```js
bar.on('change',   (e) => console.log('Valor:', e.detail.value, 'Pct:', e.detail.pct))
bar.on('complete', (e) => MTS.Toast.success('Proceso completado'))
```

### CustomEvent DOM — `mts:progress:[evento]`

```js
document.getElementById('mi-div')
  .addEventListener('mts:progress:change', (e) => {
    console.log('Progreso:', e.detail.pct)
  })
```

### Tabla de eventos

| Evento | Cuándo | Cancelable | Namespace DOM |
|--------|--------|-----------|---------------|
| `change` | Al cambiar el valor | ❌ | `mts:progress:change` |
| `complete` | Al llegar al máximo | ❌ | `mts:progress:complete` |

---

## Ejemplos

### Barra con colores dinámicos

```js
const bar = new MTS.Progress('#bar', { value: 0, showLabel: true })

bar.on('change', (e) => {
  const pct = e.detail.pct
  if (pct < 30)      bar.setVariant('danger')
  else if (pct < 70) bar.setVariant('warning')
  else               bar.setVariant('success')
})
```

### Circular como KPI

```js
new MTS.Progress('#kpi-ocupacion', {
  type:        'circle',
  value:       78,
  max:         100,
  variant:     'info',
  size:        'lg',
  showLabel:   true,
  strokeWidth: 8,
  labelFormat: (v, m, pct) => `${pct}%`,
})
```

### Simular progreso de carga

```js
const bar = new MTS.Progress('#bar', {
  type:    'bar',
  value:   0,
  variant: 'primary',
  size:    'sm',
})

let val = 0
const interval = setInterval(() => {
  val += Math.random() * 15
  if (val >= 100) { bar.setValue(100); clearInterval(interval); return; }
  bar.setValue(Math.round(val))
}, 300)
```

### Solo con HTML — sin JS

```html
<!-- Barra simple -->
<div class="mts-progress mts-progress--success mts-progress--md">
  <div class="mts-progress__track">
    <div class="mts-progress__fill mts-progress__fill--success" style="width:65%"></div>
  </div>
  <span class="mts-progress__label">65%</span>
</div>

<!-- Rayado animado -->
<div class="mts-progress mts-progress--primary mts-progress--striped mts-progress--animated mts-progress--lg">
  <div class="mts-progress__track">
    <div class="mts-progress__fill mts-progress__fill--default" style="width:45%"></div>
  </div>
</div>

<!-- Indeterminado -->
<div class="mts-progress mts-progress--indeterminate mts-progress--default mts-progress--sm">
  <div class="mts-progress__track">
    <div class="mts-progress__fill mts-progress__fill--default mts-progress__fill--indeterminate"></div>
  </div>
</div>
```

---

## Changelog

| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — bar, circle, indeterminate, eventos `mts:progress:*` |

---

**Siguiente:** [`matios-ui-fileupload.md`](./matios-ui-fileupload.md) — Dropzone con progreso real via XHR.
