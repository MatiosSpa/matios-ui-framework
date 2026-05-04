# MTS.Kanban

🇬🇧 Kanban board with drag & drop, WIP limits, card priorities, assignees and programmatic API.
🇪🇸 Tablero Kanban con drag & drop, límites WIP, prioridades de tarjeta, asignados y API programática.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-kanban.css">
<script src="matios-ui-kanban.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `columns` | `array` | `[]` | 🇬🇧 Column definitions (see schema) / 🇪🇸 Definición de columnas |
| `addCards` | `boolean` | `false` | 🇬🇧 Show "Add card" button per column / 🇪🇸 Mostrar botón "Agregar tarjeta" |
| `onMove` | `function` | — | 🇬🇧 `({ card, fromColId, toColId, newIndex }) => {}` Fires on card move / 🇪🇸 Se dispara al mover una tarjeta |
| `onCardClick` | `function` | — | 🇬🇧 `({ card, colId }) => {}` Fires on card click / 🇪🇸 Se dispara al hacer click en una tarjeta |
| `onAddCard` | `function` | — | 🇬🇧 `({ card, colId }) => {}` Fires when a card is added / 🇪🇸 Se dispara al agregar una tarjeta |
| `onSearchAssignee` | `function` | — | 🇬🇧 `(query) => items[]` Async assignee search / 🇪🇸 Búsqueda async de asignados |

### Column schema / Esquema de columna

| Property | Type | 🇬🇧 Description / 🇪🇸 Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | 🇬🇧 Unique identifier / 🇪🇸 Identificador único |
| `title` | `string` | 🇬🇧 Column header title / 🇪🇸 Título del header |
| `color` | `string` | 🇬🇧 Header accent color / 🇪🇸 Color de acento del header |
| `wip` | `number` | 🇬🇧 Max cards (WIP limit) / 🇪🇸 Límite máximo de tarjetas |
| `cards` | `array` | 🇬🇧 Initial cards / 🇪🇸 Tarjetas iniciales |

### Card schema / Esquema de tarjeta

| Property | Type | 🇬🇧 Description / 🇪🇸 Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | 🇬🇧 Unique identifier / 🇪🇸 Identificador único |
| `title` | `string` | 🇬🇧 Card title / 🇪🇸 Título de la tarjeta |
| `description` | `string` | 🇬🇧 Body text / 🇪🇸 Texto del cuerpo |
| `priority` | `string` | `'low'` · `'medium'` · `'high'` · `'critical'` |
| `tags` | `string[]` | 🇬🇧 Tag labels / 🇪🇸 Etiquetas |
| `assignees` | `array` | `[{ name, avatar? }]` |
| `dueDate` | `string` | 🇬🇧 Due date label / 🇪🇸 Fecha límite |

---

## Events / Eventos

```js
new MTS.Kanban('#my-board', {
  columns: [...],
  // Fires when a card is moved / Se dispara al mover una tarjeta
  onMove: (e) => {
    console.log(e.detail.card);      // → card object
    console.log(e.detail.fromColId); // → 'backlog'
    console.log(e.detail.toColId);   // → 'in-progress'
    console.log(e.detail.newIndex);  // → 1
  },
  // Fires when a card is clicked / Se dispara al hacer click en una tarjeta
  onCardClick: (e) => {
    console.log(e.detail.card.id);
    console.log(e.detail.colId);
  },
  // Fires when a card is added / Se dispara al agregar una tarjeta
  onAddCard: (e) => {
    console.log(e.detail.card, e.detail.colId);
  },
});
```

---

## JavaScript Usage / Uso JavaScript

```js
const board = new MTS.Kanban('#my-board', {
  addCards: true,
  columns: [
    {
      id:    'backlog',
      title: 'Backlog',
      cards: [
        {
          id:          'card-1',
          title:       'Set up CI/CD pipeline',
          description: 'Configure GitHub Actions.',
          priority:    'high',
          tags:        ['devops', 'infra'],
          assignees:   [{ name: 'Ana García' }],
          dueDate:     'Dec 15',
        },
      ],
    },
    { id: 'todo',        title: 'To Do',       wip: 5, cards: [] },
    { id: 'in-progress', title: 'In Progress',  wip: 3, cards: [] },
    { id: 'done',        title: 'Done',  color: '#16a34a', cards: [] },
  ],
  onMove:      (e) => saveState(e.detail),
  onCardClick: (e) => openDetail(e.detail.card),
  onAddCard:   (e) => console.log('added:', e.detail.card),
});
```

---

## API

```js
const board = new MTS.Kanban('#my-board', { ... });

// Add card to column / Agregar tarjeta a columna
board.addCard('backlog', { id: 'new-1', title: 'New task' })

// Move card programmatically / Mover tarjeta programáticamente
board.moveCard('card-1', 'done')

// Remove card / Eliminar tarjeta
board.removeCard('card-1')

// Get all cards / Obtener todas las tarjetas
board.getCards()         // → all cards flat
board.getCards('backlog') // → cards in column

// Register listeners / Registrar listeners
board.on('move',      (e) => console.log(e.detail))
board.on('cardClick', (e) => console.log(e.detail.card))
board.on('cardAdd',   (e) => console.log(e.detail.card))
board.off('move', handler)
```

---

## DOM Events / Eventos DOM

```js
el.addEventListener('mts:kanban:move',      (e) => console.log(e.detail));
el.addEventListener('mts:kanban:cardClick', (e) => console.log(e.detail));
el.addEventListener('mts:kanban:cardAdd',   (e) => console.log(e.detail));
```

---
