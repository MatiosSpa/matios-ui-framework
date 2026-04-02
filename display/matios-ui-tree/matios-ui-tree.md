# MTS.Tree

Árbol colapsable de jerarquías con soporte de selección, checkboxes, íconos y líneas de conexión.

## Uso
```js
new MTS.Tree('#el', {
  selectable: true,
  expandAll:  false,
  nodes: [
    { id:'n1', label:'Proyectos', children: [
      { id:'n2', label:'Frontend', children: [
        { id:'n3', label:'index.html' },
        { id:'n4', label:'styles.css' },
      ]},
      { id:'n5', label:'Backend', children: [
        { id:'n6', label:'server.js' },
      ]},
    ]},
  ],
  onSelect: ({ node, path }) => console.log(node.label),
})
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `nodes` | `Array` | `[]` | Árbol de nodos |
| `expandAll` | `boolean` | `false` | Expandir todo al inicio |
| `selectable` | `boolean` | `false` | Permite seleccionar nodos |
| `checkable` | `boolean` | `false` | Muestra checkboxes con propagación |
| `showIcons` | `boolean` | `true` | Íconos folder/file automáticos |
| `showLines` | `boolean` | `true` | Líneas de conexión |
| `onSelect` | `function` | `null` | `({ node, path }) => {}` |
| `onToggle` | `function` | `null` | `({ node, expanded }) => {}` |
| `onCheck` | `function` | `null` | `({ node, checked, checkedIds }) => {}` |

## Estructura de nodo
```js
{
  id:        'unique-id',   // requerido
  label:     'Mi nodo',     // requerido
  icon:      '<svg>...',    // HTML SVG custom (opcional)
  children:  [...],         // nodos hijos (opcional)
  expanded:  false,         // abierto por defecto
  disabled:  false,
  badge:     3,             // número o texto
}
```

## API
```js
const tree = new MTS.Tree('#el', { nodes: [...] })
tree.expand('n1')
tree.collapse('n1')
tree.expandAll2()
tree.collapseAll()
tree.select('n3')
tree.check('n2', true)
tree.getChecked()    // → ['n2','n3','n4']
tree.getSelected()   // → { id, label, ... }
tree.setNodes([...]) // reemplazar árbol completo
```
