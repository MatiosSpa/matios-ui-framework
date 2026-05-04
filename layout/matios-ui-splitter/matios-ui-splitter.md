# MTS.Splitter

Paneles redimensionables con drag. El contenedor debe tener exactamente 2 hijos.

## Uso
```html
<div id="split">
  <div class="panel-left">Panel izquierdo</div>
  <div class="panel-right">Panel derecho</div>
</div>
```
```js
new MTS.Splitter('#split', {
  direction:   'horizontal',
  initialSize: 30,   // primer panel 30%
  minSize:     15,
  maxSize:     85,
  onChange: ({ firstSize, secondSize }) => {
    console.log(firstSize + '% / ' + secondSize + '%')
  },
})
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `direction` | `string` | `'horizontal'` | `'horizontal'`\|`'vertical'` |
| `initialSize` | `number` | `50` | Tamaño inicial del primer panel en % |
| `minSize` | `number` | `10` | Mínimo % para cada panel |
| `maxSize` | `number` | `90` | Máximo % para el primer panel |
| `collapsible` | `boolean` | `false` | Doble click en el gutter colapsa un panel |
| `gutterSize` | `string` | `'6px'` | Ancho/alto del divisor |
| `onChange` | `function` | `null` | `({ sizes, firstSize, secondSize }) => {}` |
| `onDragStart` | `function` | `null` | 🇬🇧 Fires when drag starts / 🇪🇸 Se dispara al iniciar el drag |
| `onDragEnd` | `function` | `null` | `({ sizes }) => {}` |

## API
```js
const sp = new MTS.Splitter('#el')
sp.setSize(40)        // primer panel al 40%
sp.getSizes()         // → { firstSize:40, secondSize:60 }
sp.collapseFirst()    // colapsar panel izquierdo
sp.collapseSecond()   // colapsar panel derecho
sp.restore()          // restaurar al tamaño anterior
sp.destroy()
```
