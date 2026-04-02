# matios-ui-badge

Badges, pills y contadores para Matios UI. Usable directo en HTML con clases CSS o programáticamente con `MTS.Badge`.

---

## Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-badge.css">
<script src="matios-ui-badge.js"></script>
```

---

## Uso directo en HTML — sin JS

La forma más común — solo clases CSS:

```html
<!-- Variantes -->
<span class="mts-badge mts-badge--default">Default</span>
<span class="mts-badge mts-badge--primary">Primary</span>
<span class="mts-badge mts-badge--success">Activo</span>
<span class="mts-badge mts-badge--warning">Pendiente</span>
<span class="mts-badge mts-badge--danger">Error</span>
<span class="mts-badge mts-badge--info">Info</span>
<span class="mts-badge mts-badge--accent">Nuevo</span>

<!-- Outline -->
<span class="mts-badge mts-badge--outline-success">Activo</span>
<span class="mts-badge mts-badge--outline-danger">Rechazado</span>

<!-- Tamaños -->
<span class="mts-badge mts-badge--success mts-badge--xs">xs</span>
<span class="mts-badge mts-badge--success mts-badge--sm">sm</span>
<span class="mts-badge mts-badge--success mts-badge--md">md</span>
<span class="mts-badge mts-badge--success mts-badge--lg">lg</span>

<!-- Formas -->
<span class="mts-badge mts-badge--primary mts-badge--pill">Pill</span>
<span class="mts-badge mts-badge--primary mts-badge--square">Square</span>

<!-- Dot — solo punto de color -->
<span class="mts-badge mts-badge--dot mts-badge--success"></span>
<span class="mts-badge mts-badge--dot mts-badge--danger"></span>

<!-- Dot con pulso — para notificaciones activas -->
<span class="mts-badge mts-badge--dot mts-badge--danger mts-badge--pulse"></span>
```

---

## Badge sobre un elemento — contador

```html
<!-- Badge posicionado sobre un botón -->
<div class="mts-badge-wrap">
  <button class="mts-btn mts-btn--ghost mts-btn--icon">🔔</button>
  <span class="mts-badge mts-badge--danger mts-badge--xs mts-badge--pill mts-badge--counter">5</span>
</div>

<!-- Posiciones del counter -->
<div class="mts-badge-wrap">
  <button class="mts-btn">Mensajes</button>
  <span class="mts-badge mts-badge--primary mts-badge--xs mts-badge--counter mts-badge--counter-tr">12</span>
</div>
```

---

## Uso programático — MTS.Badge

```js
// Sobre un elemento existente
const badge = new MTS.Badge('#mi-badge', {
  label:    'Activo',
  variant:  'success',
  shape:    'pill',
  size:     'md',
})

// Badge de contador
const counter = new MTS.Badge('#notif-badge', {
  count:    5,
  maxCount: 99,      // muestra "99+" si supera
  variant:  'danger',
  shape:    'pill',
  size:     'xs',
})

// Badge removable (tags, filtros)
const tag = new MTS.Badge('#tag', {
  label:    'Documentos',
  variant:  'primary',
  removable: true,
  onRemove: (badge) => {
    console.log('Tag removido')
    badge.destroy()
  }
})
```

---

## API pública

```js
const badge = new MTS.Badge('#el', config)

// Contador
badge.setCount(10)      // establece
badge.increment()       // +1
badge.increment(5)      // +5
badge.decrement()       // -1

// Apariencia
badge.setVariant('danger')
badge.setLabel('Nuevo texto')
badge.setPulse(true)    // activa animación de pulso

// Visibilidad
badge.show()
badge.hide()
badge.destroy()         // remueve del DOM
```

---

## Métodos estáticos

```js
// Crear elemento badge listo para insertar
const el = MTS.Badge.create({
  label:   'Confirmada',
  variant: 'success',
  size:    'sm',
})
document.querySelector('#contenedor').appendChild(el)

// Generar HTML string — para usar en innerHTML / content de columnas
MTS.Badge.html('Activo', 'success')
// → '<span class="mts-badge mts-badge--success mts-badge--md mts-badge--pill">Activo</span>'
```

### Uso en columnas del DataTable

```js
columns: [
  {
    field:   'estado',
    label:   'Estado',
    content: (item) => {
      const map = {
        activo:   MTS.Badge.html('Activo',   'success'),
        inactivo: MTS.Badge.html('Inactivo', 'default'),
        pendiente:MTS.Badge.html('Pendiente','warning'),
        error:    MTS.Badge.html('Error',    'danger'),
      }
      return map[item.estado] || MTS.Badge.html(item.estado, 'default')
    }
  }
]
```

---

## Variantes disponibles

| Clase | Color | Uso típico |
|-------|-------|-----------|
| `mts-badge--default` | Gris | Estado neutral, categorías |
| `mts-badge--primary` | Azul petróleo | Seleccionado, activo principal |
| `mts-badge--success` | Verde | Confirmado, aprobado, activo |
| `mts-badge--warning` | Naranja | Pendiente, en revisión |
| `mts-badge--danger` | Rojo | Error, rechazado, eliminado |
| `mts-badge--info` | Azul | Informativo, en proceso |
| `mts-badge--accent` | Amarillo | Destacado, nuevo, beta |
| `mts-badge--outline-*` | Outline | Versión sin relleno |

---

## Dot con pulso — notificación activa

```html
<!-- Online indicator -->
<div style="display:flex; align-items:center; gap:8px;">
  <span class="mts-badge mts-badge--dot mts-badge--success mts-badge--pulse"></span>
  <span>Sistema operativo</span>
</div>

<!-- Notificación no leída -->
<div class="mts-badge-wrap">
  <button class="mts-btn mts-btn--ghost">Alertas</button>
  <span class="mts-badge mts-badge--dot mts-badge--danger mts-badge--pulse mts-badge--counter"></span>
</div>
```

---

## Tags removables

```html
<!-- Tags de filtro removables — solo HTML -->
<div style="display:flex; gap:6px; flex-wrap:wrap;">
  <span class="mts-badge mts-badge--primary mts-badge--removable">
    <span class="mts-badge__label">Documentos</span>
    <button class="mts-badge__remove" onclick="this.closest('.mts-badge').remove()">×</button>
  </span>
  <span class="mts-badge mts-badge--primary mts-badge--removable">
    <span class="mts-badge__label">2025</span>
    <button class="mts-badge__remove" onclick="this.closest('.mts-badge').remove()">×</button>
  </span>
</div>
```

---

## Changelog

| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — 7 variantes, outline, pill/square/dot, contador, pulso, removable, posicionado |

---

**Siguiente:** [`matios-ui-progress.md`](./matios-ui-progress.md) — Barras de progreso y spinners.

---

## HTML declarativo

```html
<span id="b1" data-count="5" data-variant="danger" data-pulse></span>
<span id="b2" data-label="Nuevo" data-variant="success"></span>

<script>
const badge = new MTS.Badge('#b1')
badge.setCount(12)
new MTS.Badge('#b2')
</script>
```

| Atributo | JS | Descripción |
|----------|-----|-------------|
| `data-label` | `label` | Texto |
| `data-count` | `count` | Número |
| `data-max-count` | `maxCount` | Máximo antes de `+` |
| `data-variant` | `variant` | |
| `data-size` | `size` | |
| `data-dot` | `dot` | Solo punto (presencia activa) |
| `data-pulse` | `pulse` | Animación (presencia activa) |
| `data-removable` | `removable` | Botón × (presencia activa) |

