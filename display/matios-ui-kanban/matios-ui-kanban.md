# MTS.Kanban

[EN] Kanban board with drag & drop, WIP limits, card priorities, assignees and programmatic API.
[ES] Tablero Kanban con drag & drop, límites WIP, prioridades de tarjeta, asignados y API programática.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-kanban.css">
<script src="matios-ui-kanban.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `columns` | `array` | `[]` | [EN] Column definitions (see schema) / [ES] Definición de columnas |
| `addCards` | `boolean` | `false` | [EN] Show "Add card" button per column / [ES] Mostrar botón "Agregar tarjeta" |
| `onMove` | `function` | — | [EN] `({ card, fromColId, toColId, newIndex }) => {}` Fires on card move / [ES] Se dispara al mover una tarjeta |
| `onCardClick` | `function` | — | [EN] `({ card, colId }) => {}` Fires on card click / [ES] Se dispara al hacer click en una tarjeta |
| `onAddCard` | `function` | — | [EN] `({ card, colId }) => {}` Fires when a card is added / [ES] Se dispara al agregar una tarjeta |
| `onSearchAssignee` | `function` | — | [EN] `(query) => items[]` Async assignee search / [ES] Búsqueda async de asignados |

### Column schema / Esquema de columna

| Property | Type | [EN] Description / [ES] Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | [EN] Unique identifier / [ES] Identificador único |
| `title` | `string` | [EN] Column header title / [ES] Título del header |
| `color` | `string` | [EN] Header accent color / [ES] Color de acento del header |
| `wip` | `number` | [EN] Max cards (WIP limit) / [ES] Límite máximo de tarjetas |
| `cards` | `array` | [EN] Initial cards / [ES] Tarjetas iniciales |

### Card schema / Esquema de tarjeta

| Property | Type | [EN] Description / [ES] Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | [EN] Unique identifier / [ES] Identificador único |
| `title` | `string` | [EN] Card title / [ES] Título de la tarjeta |
| `description` | `string` | [EN] Body text / [ES] Texto del cuerpo |
| `priority` | `string` | `'low'` · `'medium'` · `'high'` · `'critical'` |
| `tags` | `string[]` | [EN] Tag labels / [ES] Etiquetas |
| `assignees` | `array` | `[{ name, avatar? }]` |
| `dueDate` | `string` | [EN] Due date label / [ES] Fecha límite |

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

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] `onMove/onCardClick/onAddCard` normalized to `.on()`, bilingual docs / [ES] Normalizados a `.on()`, docs bilingüe |
| 1.0.0 | [EN] Initial release — drag & drop, WIP limits, priorities, assignees / [ES] Versión inicial |
