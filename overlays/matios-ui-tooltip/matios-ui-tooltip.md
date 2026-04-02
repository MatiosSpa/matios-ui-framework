# matios-ui-tooltip

Tooltip con posicionamiento inteligente (flip automático), delay y variantes.

## Instalación
```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-tooltip.css">
<script src="matios-ui-tooltip.js"></script>
```

## Uso rápido
```js
new MTS.Tooltip('#mi-btn', {
  content:  'Eliminar documento',
  position: 'top',      // 'top'|'bottom'|'left'|'right'
  trigger:  'hover',    // 'hover'|'click'|'focus'
  variant:  'dark',     // 'dark'|'light'
  delay:    200,
  hideDelay: 100,
})
```

## Inicialización masiva via HTML
```html
<button data-mts-tooltip="Guardar cambios"
        data-mts-tooltip-position="top"
        data-mts-tooltip-variant="dark">
  Guardar
</button>
```
```js
MTS.Tooltip.initAll() // inicializa todos los [data-mts-tooltip]
```

## API
```js
const tt = new MTS.Tooltip('#el', config)
tt.show()
tt.hide()
tt.setContent('Nuevo texto')
tt.destroy()
```

## Eventos DOM
| Evento | Namespace |
|--------|-----------|
| `show` | `mts:tooltip:show` |
| `hide` | `mts:tooltip:hide` |

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — flip automático, dark/light, hover/click/focus |

---

## HTML declarativo

```html
<button id="miBtn" data-content="Guardar cambios" data-position="top">💾</button>
<script>new MTS.Tooltip('#miBtn')</script>

<!-- Con trigger click -->
<span id="info" data-content="Más información" data-trigger="click">ℹ️</span>
<script>new MTS.Tooltip('#info')</script>
```

| Atributo | JS | Descripción |
|----------|-----|-------------|
| `data-content` | `content` | Texto del tooltip |
| `data-position` | `position` | `top`·`bottom`·`left`·`right` |
| `data-trigger` | `trigger` | `hover`·`click`·`focus` |
| `data-delay` | `delay` | ms de espera |
| `data-variant` | `variant` | `dark`·`light` |
| `data-max-width` | `maxWidth` | Ancho máximo |

