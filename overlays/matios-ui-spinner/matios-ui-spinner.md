# MTS.Spinner

Indicadores de carga animados con 5 variantes visuales.

## Uso

```js
new MTS.Spinner('#el', { variant: 'circle', size: 'md' })
```

## Opciones

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `variant` | `string` | `'circle'` | `'circle'` \| `'ring'` \| `'dots'` \| `'bars'` \| `'pulse'` |
| `size` | `string` | `'md'` | `'xs'` \| `'sm'` \| `'md'` \| `'lg'` \| `'xl'` |
| `color` | `string` | `null` | Color CSS override |
| `label` | `string` | `''` | Texto debajo |
| `overlay` | `boolean` | `false` | Modo pantalla completa |

## API

```js
const sp = new MTS.Spinner('#el', { variant: 'dots', label: 'Cargando...' })
sp.show()
sp.hide()
sp.destroy()
```

---

## HTML declarativo

```html
<div id="miSpinner" data-variant="primary" data-size="lg" data-label="Cargando..."></div>
<script>new MTS.Spinner('#miSpinner')</script>
```

| Atributo | JS | Descripción |
|----------|-----|-------------|
| `data-variant` | `variant` | `primary`·`secondary`·`white` |
| `data-size` | `size` | `sm`·`md`·`lg`·`xl` |
| `data-label` | `label` | Texto accesible |
| `data-overlay` | `overlay` | (presencia activa) |
| `data-color` | `color` | Color CSS |

