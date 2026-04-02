# MTS.Popover

Tooltip enriquecido con título, contenido HTML, flecha y botón de cierre.

## Uso
```js
new MTS.Popover('#btn', {
  title:   'Información del usuario',
  content: '<p>Email: juan@empresa.com</p><p>Rol: Administrador</p>',
  position: 'bottom',
  trigger:  'click',
})
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `title` | `string` | `''` | Título del popover |
| `content` | `string` | `''` | Contenido HTML |
| `position` | `string` | `'bottom'` | `'top'`\|`'bottom'`\|`'left'`\|`'right'` |
| `trigger` | `string` | `'click'` | `'click'`\|`'hover'` |
| `offset` | `number` | `8` | Separación en px |
| `arrow` | `boolean` | `true` | Muestra flecha |
| `closable` | `boolean` | `true` | Botón × |
| `width` | `string` | `'260px'` | Ancho CSS |
| `onShow` | `function` | `null` | |
| `onHide` | `function` | `null` | |

## API
```js
const pop = new MTS.Popover('#btn', { content:'...' })
pop.show()
pop.hide()
pop.toggle()
pop.setContent('<p>Nuevo contenido</p>')
pop.destroy()
```

---

## HTML declarativo

```html
<button id="miBtn"
  data-title="Más información"
  data-content="Aquí el contenido del popover."
  data-position="bottom"
  data-trigger="click"
  data-closable>
  Info
</button>

<script>
new MTS.Popover('#miBtn', {
  onShow: () => console.log('abierto'),
  onHide: () => console.log('cerrado'),
})
</script>
```

| Atributo | JS | Descripción |
|----------|-----|-------------|
| `data-title` | `title` | |
| `data-content` | `content` | |
| `data-position` | `position` | `top`·`bottom`·`left`·`right` |
| `data-trigger` | `trigger` | `click`·`hover` |
| `data-closable` | `closable` | Botón × (presencia activa) |
| `data-width` | `width` | Ancho |

