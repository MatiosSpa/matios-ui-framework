# MTS.Kanban

Kanban board with drag & drop between columns, WIP limits, priorities, assignees and an inline add-card form.

---

## Installation

```html
<link rel="stylesheet" href="base/matios-ui-base.css">
<link rel="stylesheet" href="widgets/boards/matios-ui-kanban/matios-ui-kanban.css">
<script src="base/matios-ui-base.js"></script>
<script src="widgets/boards/matios-ui-kanban/matios-ui-kanban.js"></script>
```

---

## Usage

```html
<div id="kanban"></div>
```

```js
const kanban = new MTS.Kanban('#kanban', {
  columns: [
    { id: 'todo', title: 'To Do', cards: [
      { id: 'c1', title: 'Set up CI/CD', priority: 'high', tags: ['devops'] },
    ]},
    { id: 'wip',  title: 'In Progress', wip: 3, cards: [] },
    { id: 'done', title: 'Done', cards: [] },
  ],
  onCardMove: function (e) { console.log(e.card.title, e.fromColId, '→', e.toColId); },
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `columns` | `Column[]` | `[]` | Board columns with their cards |
| `addCards` | `boolean` | `false` | Show an inline "Add card" button in each column |
| `addTask` | `object` | — | Enables a toolbar with an "+ Add task" button. **The modal is supplied by the dev** (see below). `showButton:false` = dev provides their own button and confirms with `submitAddTask()` |
| `editColumns` | `boolean` | `false` | Live column management: rename (double-click the title), delete (× in the header) and a "+ Column" tile. Emits `columnAdd`/`columnRemove`/`columnChange` |
| `dataSource` | `fn(query) → Promise<{columns, cards}>` | — | Async data load |
| `onSearchAssignee` | `fn(q) → items[]` | — | Async user search for the form |
| `onLoad` / `onCardAdd` / `onCardChange` / `onCardMove` / `onCardDelete` / `onCardClick` / `onColumnChange` / `onAddTask` | `fn` | — | Constructor handlers |

### `addTask` — add via the dev's modal

The component provides the toolbar button and harvests the form; the modal is the dev's (an `MTS.Modal`):

```js
addTask: {
  label: '+ Add task',
  form:  '#my-form',                        // container to harvest (or `modal:`)
  open:  function () { myModal.show(); },
  close: function () { myModal.hide(); },
  map:   function (data) { return data; },  // optional
}
```

Flow: click → `open()` → dev confirms with `kanban.submitAddTask()` → harvest by `name`/`id` →
`onAddTask({ data, resolve, reject })`. `resolve()` normalizes a canonical (Trello-style) card + aliases and inserts
it. Aliases: `name`/`title`→`title`, `desc`/`description`, `idList`/`columnId`, `labels`/`tags`, `members`/`assignee`;
unrecognized fields → `card.extras`. Enabling `addTask` adds a toolbar (`mts-kanban--has-toolbar`); without it the
board structure is unchanged (backward-compatible, including the Kanban embedded in SprintBoard).

### Column & Card shapes

```js
// Column
{ id: 'backlog', title: 'Backlog', color: '#3b82f6', wip: 5, cards: [/* … */] }

// Card
{
  id: 'card-1', title: 'Set up CI/CD', description: 'Free text…',
  priority: 'low' | 'medium' | 'high' | 'critical',
  tags: ['devops', 'backend'], assignee: 'Ana Torres', dueDate: 'Dec 15',
}
```

---

## Events

Every `onXxxx` method returns a `dispose()` to unsubscribe.

| Method | Payload | When |
|--------|---------|------|
| `onLoad(fn)` | `{ columns }` | DataSource resolved |
| `onAddTask(fn)` | `{ data, resolve, reject }` | Dev modal confirmation (raw harvest); `resolve()` inserts, `reject()` cancels |
| `onCardAdd(fn)` | `{ card, colId }` | New card inserted |
| `onCardChange(fn)` | `{ card, fields }` | Card fields updated via `updateCard()` |
| `onCardMove(fn)` | `{ card, fromColId, toColId, position, newIndex }` | Card dragged between columns |
| `onCardDelete(fn)` | `{ card, colId }` | Card removed via `removeCard()` |
| `onCardClick(fn)` | `{ card, colId }` | Card click |
| `onColumnAdd(fn)` / `onColumnRemove(fn)` / `onColumnChange(fn)` | `{ column[, index/fields] }` | Column added / removed / renamed |

```js
const dispose = kanban.onCardMove(function (e) { console.log(e.card.title); });
dispose(); // unsubscribe
```

DOM events (`mts:kanban:card-move`, `mts:kanban:card-add`, …) remain available for external integration.

### Backend integration

The FE does not persist — event payloads are ready to send to the BE:

| Event | BE action | Payload |
|-------|-----------|---------|
| `onCardAdd` | `POST /api/cards` | full card + `colId` |
| `onCardChange` | `PATCH /api/cards/:id` | `fields` (what changed) |
| `onCardMove` | `PATCH /api/cards/:id` | `{ colId, position }` |
| `onCardDelete` | `DELETE /api/cards/:id` | `{ id }` |
| `onColumnAdd` / `onColumnRemove` / `onColumnChange` | `POST` / `DELETE` / `PATCH /api/columns` | column |

> Full backend contract (dataSource, Card/Column shapes, DDL, ids, errors, validations):
> [`matios-ui-kanban-backend.md`](matios-ui-kanban-backend.md). The demo shows it live via `apiSim` (console + Activity Log).

---

## API

| Method | Description |
|--------|-------------|
| `addCard(colId, card)` | Add a card to a column |
| `submitAddTask()` | Harvest the dev modal form and fire `onAddTask` (only with the `addTask` option) |
| `updateCard(id, fields)` | Update card fields; emits `onCardChange` |
| `moveCard(cardId, toColId[, idx])` | Move a card (idx = target position, default 0) |
| `removeCard(cardId)` | Remove a card; emits `onCardDelete` |
| `setColumns(cols)` | Replace ALL columns and rebuild |
| `addColumn(col[, index])` / `removeColumn(id)` / `renameColumn(id, title)` | Column management; emit the column events |
| `reload()` | Re-invoke dataSource or rebuild |
| `destroy()` | Clear DOM and listeners |

---

## CSS Variables

The board inherits the framework tokens (`--mts-bg-surface`, `--mts-color-primary`, …). In most cases there are no
component-specific tokens to override.

---

## Accessibility

- Provide a keyboard path to move cards (drag & drop is a pointer gesture); reflect WIP-limit breaches in text, not
  color alone.

---

## Changelog

### 2026-05-31 — Consolidated demo + DevPanel + i18n + BE integration
- Own i18n `matios-ui-kanban-i18n.js` (es/en/pt, namespace `MTS.Kanban`) + `_t()`; all internal strings localized.
- `MTS.DevPanel` contract: `getConfig()` (toggle `addCards`) + `getCode()`.
- `addTask.showButton: false`: the dev supplies their own button and confirms with `submitAddTask()`.
- Single consolidated `demo.html` (DevPanel + Topbar + async dataSource + add/edit modal + `apiSim`); `demos/` removed.
- Dynamic column management (`editColumns`): `addColumn` / `removeColumn` / `renameColumn` + the column events and UI.
- FE↔BE contract: new `matios-ui-kanban-backend.md` + "Backend integration" section here.

### 2026-05-30
- `addTask` feature — toolbar button + `onAddTask({ data, resolve, reject })`; dev modal; harvest by `name`/`id`;
  canonical+alias card normalization; `submitAddTask()`.

### 2026-05-29
- **Breaking**: moved to `widgets/boards/matios-ui-kanban/`; `onMove` → `onCardMove`; handlers receive the payload
  directly. New events `onLoad`/`onCardChange`/`onCardDelete`/`onColumnChange`; new methods `updateCard`/`reload`.
  DOM events kept for backward compatibility. Requires `base/matios-ui-base.js`.
