# matios-ui-kanban

Tablero Kanban con columnas configurables y drag & drop entre ellas.

## Instalación
```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-avatar.css">  <!-- opcional para assignee -->
<link rel="stylesheet" href="matios-ui-kanban.css">
<script src="matios-ui-avatar.js"></script>
<script src="matios-ui-kanban.js"></script>
```

## Uso
```js
const kanban = new MTS.Kanban('#tablero', {
  addCards: true,
  columns: [
    {
      id: 'backlog', title: 'Backlog', color: '#6c757d',
      cards: [
        {
          id: 'c1', title: 'Diseñar login',
          description: 'Crear mockup en Figma',
          tags: ['UI', 'Alta prioridad'],
          assignee: 'Juan Pérez',
          priority: 'high',   // 'high'|'medium'|'low' — borde de color
        },
      ]
    },
    {
      id: 'doing', title: 'En progreso', color: '#004b5d', wip: 3,
      cards: [
        { id: 'c2', title: 'Implementar DataTable', tags: ['Backend'] },
      ]
    },
    {
      id: 'done', title: 'Completado', color: '#1a7f4b',
      cards: []
    },
  ],
  onMove:      (card, from, to, idx) => console.log(`${card.title}: ${from} → ${to}`),
  onCardClick: (card, colId) => console.log('Click:', card.title),
  onAddCard:   (colId) => {
    kanban.addCard(colId, { id: `c${Date.now()}`, title: 'Nueva tarjeta' })
  },
})

kanban.addCard('backlog', { id: 'c3', title: 'Nueva tarea' })
kanban.removeCard('c1')
kanban.moveCard('c2', 'done', 0)
kanban.setColumns([...])
```

## Prioridades (color del borde izquierdo)
| Valor | Color |
|-------|-------|
| `high`   | Rojo |
| `medium` | Naranja |
| `low`    | Verde |

## WIP Limit
Si `wip: 3` y hay 3+ tarjetas, el contador de la columna se muestra en rojo.

## Eventos DOM
| Evento | Namespace |
|--------|-----------|
| `move`      | `mts:kanban:move` |
| `drop`      | `mts:kanban:drop` |
| `cardClick` | `mts:kanban:cardClick` |
| `addCard`   | `mts:kanban:addCard` |

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — drag & drop entre columnas, WIP limit, prioridades, assignee |
