# MTS.PageLoader

Indicador de carga de página estilo NProgress. Barra fija en el borde superior o inferior de la pantalla con avance automático (trickle). Soporta tres modos: solo barra, overlay completo con spinner o progress, o ambos simultáneamente.

**Dependencias:** `MTS.Progress`, `MTS.Spinner`

---

## Instalación

```html
<link rel="stylesheet" href="matios-ui-progress.css">
<link rel="stylesheet" href="matios-ui-spinner.css">
<link rel="stylesheet" href="matios-ui-pageloader.css">

<script src="matios-ui-progress.js"></script>
<script src="matios-ui-spinner.js"></script>
<script src="matios-ui-pageloader.js"></script>
```

---

## Opciones

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `mode` | `string` | `'bar'` | Modo de display: `'bar'`, `'blocker'` o `'both'` |
| `position` | `string` | `'top'` | Posición de la barra: `'top'` o `'bottom'` |
| `variant` | `string` | `'primary'` | Variante de color para barra y loader |
| `minimum` | `number` | `0.08` | Valor inicial al llamar `start()` (0–1) |
| `trickle` | `boolean` | `true` | Activa el avance automático |
| `trickleSpeed` | `number` | `400` | Intervalo en ms entre cada paso de trickle |
| `speed` | `number` | `200` | Duración en ms del fade out al completar |
| `blur` | `boolean` | `false` | Agrega efecto blur al backdrop del blocker |
| `backdropOpacity` | `number` | `0.85` | Opacidad del fondo del blocker (0–1) |
| `bar` | `object` | `null` | Opciones adicionales para `MTS.Progress` (barra) |
| `loader` | `object` | `null` | Opciones para el loader central. Sin `type` → `MTS.Spinner` (`variant` = tipo: `ring`, `dual`, `bars`…). Con `type: 'circle'` → `MTS.Progress` (`variant` = color). |

---

## API

```js
const loader = new MTS.PageLoader({ mode: 'bar' });

loader.start()       // Muestra el loader y comienza el trickle automático
loader.done()        // Completa al 100% y desaparece con fade out
loader.error()       // Completa en color danger y desaparece
loader.set(0.6)      // Establece el progreso manualmente (0–1)
loader.increment(0.1)// Suma al valor actual
loader.destroy()     // Destruye el componente y limpia el DOM
```

---

## Uso básico

```js
const loader = new MTS.PageLoader({ mode: 'bar' });

loader.start();

fetch('/api/data')
  .then(function(res) { return res.json(); })
  .then(function(data) {
    loader.done();
  })
  .catch(function() {
    loader.error();
  });
```

---

## Modo blocker (overlay con spinner)

```js
const loader = new MTS.PageLoader({
  mode: 'blocker',
  backdropOpacity: 0.7,
  blur: true,
  loader: { variant: 'ring', size: 'lg' },
});

loader.start();
// ... operación async
loader.done();
```

---

## Modo blocker con progress circle

```js
const loader = new MTS.PageLoader({
  mode: 'blocker',
  loader: {
    type:    'circle',
    size:    'lg',
    variant: 'primary',
  },
});

loader.start();
loader.set(0.4);
loader.done();
```

---

## Modo bar + blocker simultáneos

```js
const loader = new MTS.PageLoader({
  mode: 'both',
  position: 'top',
  variant: 'primary',
});

loader.start();
// ... carga
loader.done();
```

---

## Barra en bottom con variante success

```js
const loader = new MTS.PageLoader({
  mode: 'bar',
  position: 'bottom',
  variant: 'success',
  trickleSpeed: 600,
});

loader.start();
```

---

## Notas

- La barra y el blocker se inyectan automáticamente en `document.body`. No requieren markup HTML previo.
- El trickle usa amortiguación natural (`remaining * 0.1`) — el avance se ralentiza conforme se acerca a 1 sin llegar nunca al 100% automáticamente. Solo `done()` o `error()` completan al máximo.
- `error()` añade la clase `mts-pageloader__bar-wrap--error` que sobreescribe el color del fill a `danger`.
- `backdropOpacity` controla la opacidad del fondo sin afectar al spinner o progress central.
- Con `blur: true`, el backdrop aplica `backdrop-filter: blur(8px)`.

---
