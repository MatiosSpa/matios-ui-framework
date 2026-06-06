# MTS.SprintBoard

Scrum board: a Backlog panel (left) + Sprint Board (right) with bidirectional drag. Uses `MTS.Kanban` internally for the Sprint panel. Emits events so the consumer persists.

---

## Installation

```html
<link rel="stylesheet" href="base/matios-ui-base.css">
<link rel="stylesheet" href="layout/matios-ui-splitter/matios-ui-splitter.css">
<link rel="stylesheet" href="widgets/boards/matios-ui-kanban/matios-ui-kanban.css">
<link rel="stylesheet" href="widgets/boards/matios-ui-sprint-board/matios-ui-sprint-board.css">

<script src="base/matios-ui-base.js"></script>
<script src="layout/matios-ui-splitter/matios-ui-splitter.js"></script>
<script src="widgets/boards/matios-ui-kanban/matios-ui-kanban.js"></script>
<script src="widgets/boards/matios-ui-sprint-board/matios-ui-sprint-board.js"></script>
```

---

## Usage

```html
<div id="sprintboard" style="height: 600px"></div>
```

```js
const sb = new MTS.SprintBoard('#sprintboard', {
  dataSource:   function () { return fetch('/api/sprint').then(function (r) { return r.json(); }); },
  showVelocity: true,
  addStories:   true,
});

sb.onStoryMove(function (e) { persistStory(e.story); });
sb.onSprintStart(function (e) { activateSprint(e.sprint.id); });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dataSource` | `fn(query) → Promise<{stories, sprints}>` | — | Async load |
| `currentSprintId` | `string` | — | Visible sprint id; auto-detected if one has `status:'active'` |
| `columns` | `array` | `[todo, wip, done]` | Sprint Board columns (same schema as `MTS.Kanban`) |
| `showBacklog` | `boolean` | `true` | Show the Backlog panel |
| `showVelocity` | `boolean` | `false` | Show the capacity bar |
| `splitter` | `'horizontal' \| 'vertical'` | `'horizontal'` | Backlog vs Sprint orientation |
| `addStories` | `boolean` | `false` | "+ Story" button in the toolbar |
| `addTask` | `object` | — | Enables the "+ Add story" toolbar button. **The modal is supplied by the dev** |
| `onLoad` / `onError` / `onStoryAdd` / `onStoryChange` / `onStoryMove` / `onStoryDelete` / `onSprintChange` / `onSprintStart` / `onSprintComplete` / `onSelect` | `fn` | — | Constructor handlers |

### `addTask` — add via the dev's modal

The component provides the button and harvests the form; the modal is the dev's. Flow: click → `open()` → dev confirms
with `sb.submitAddTask()` → harvest by `name`/`id` → `onAddTask({ data, resolve, reject })`. `resolve()` normalizes a
canonical (Jira-style) Story + aliases and inserts it (`addStory`, location from `data._location` or `'backlog'`).
Aliases: `summary`/`title`→`title`, `issuetype`/`type`→`type`, `key`→`code`; unrecognized → `extras`.

### Story & Sprint shapes

```js
// Story
{
  id: 's1', code: 'PRJ-42', title: 'As a user I want…', description: '…',
  type: 'userstory' | 'task' | 'bug' | 'epic' | 'spike',
  storyPoints: 5, priority: 'low' | 'medium' | 'high' | 'critical',
  tags: ['ui'], assignees: [{ id, name, avatar }],
  sprintId: null | 'sprint-7', status: 'todo' | 'wip' | 'done', parentEpicId: null,
}

// Sprint
{
  id: 'sprint-7', number: 7, name: 'Sprint 7', goal: 'Close onboarding UI',
  startDate: '2026-06-01', endDate: '2026-06-14',
  status: 'planning' | 'active' | 'completed' | 'cancelled', capacity: 40, committed: 38,
}
```

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onAddTask(fn)` | `{ data, resolve, reject }` | Dev modal confirmation; `resolve()` inserts, `reject()` cancels |
| `onLoad(fn)` | `{ stories, sprints }` | DataSource resolved |
| `onError(fn)` | `{ error }` | DataSource rejected |
| `onStoryAdd(fn)` | `{ story, location }` | Story added (`'backlog' \| 'sprint'`) |
| `onStoryChange(fn)` | `{ story, fields }` | Story updated |
| `onStoryMove(fn)` | `{ story, from, to }` | Moved between Backlog/Sprint or columns |
| `onStoryDelete(fn)` | `{ story }` | Story removed |
| `onSprintChange(fn)` | `{ sprint, fields }` | Sprint edited |
| `onSprintStart(fn)` | `{ sprint }` | Sprint activated |
| `onSprintComplete(fn)` | `{ sprint, doneStories, pendingStories }` | Sprint closed |
| `onSelect(fn)` | `{ stories }` | Selection changed |

```js
const dispose = sb.onStoryMove(function (e) { persistStory(e.story); });
dispose(); // unsubscribe
```

### Backend integration

The FE does not persist — event payloads are ready to send to the BE:

| Event | BE action | Payload |
|-------|-----------|---------|
| `onStoryAdd` | `POST /api/stories` | full story (`assignees[].uid`, `type`, `storyPoints`, `_location`) |
| `onStoryChange` | `PATCH /api/stories/:id` | `fields` |
| `onStoryMove` | `PATCH /api/stories/:id` | `{ from, to }` |
| `onStoryDelete` | `DELETE /api/stories/:id` | `{ id }` |
| `onSprintStart` / `onSprintComplete` | `POST /api/sprints/:id/start\|complete` | `{ id }` / `{ done, pending }` |

> Full backend contract (dataSource, Story/Sprint shapes, DDL, sprint lifecycle, ids, errors, validations):
> [`matios-ui-sprint-board-backend.md`](matios-ui-sprint-board-backend.md). The demo shows it live via `apiSim`.

---

## API

| Method | Description |
|--------|-------------|
| `addStory(story, location)` | location: `'backlog' \| 'sprint'` |
| `submitAddTask()` | Harvest the dev modal form and fire `onAddTask` (only with the `addTask` option) |
| `updateStory(id, fields)` / `deleteStory(id)` | Update / delete a story |
| `moveStory(id, target)` | target: `{ type, columnId? }` |
| `startSprint(id)` / `completeSprint(id)` | Activate / close a sprint (close moves pending stories to the backlog) |
| `setCurrentSprint(id)` | Change the visible sprint |
| `getBacklog()` / `getCurrentSprintStories()` | Read helpers |
| `reload()` / `destroy()` | Re-invoke dataSource / clean up |

---

## Composition with MTS.Kanban

The Sprint panel uses `MTS.Kanban` internally. SprintBoard listens to the Kanban's `onCardMove` and translates it to
`onStoryMove` with the story schema. The consumer only interacts with the SprintBoard API — not the inner Kanban.

---

## Accessibility

- Backlog ↔ Sprint moves are also available via buttons (not only drag); convey story type/priority in text, not
  color alone.

---

## Changelog

### 2026-05-31 — Consolidated demo + DevPanel + i18n + BE integration
- Own i18n `matios-ui-sprint-board-i18n.js` (es/en/pt, namespace `MTS.SprintBoard`) + `_t()`; all internal strings localized.
- `MTS.DevPanel` contract: `getConfig()` (toggles `showBacklog`/`showVelocity`/`addStories`) + `getCode()`.
- Single consolidated `demo.html` (DevPanel + Topbar + async dataSource + add/edit modal + `apiSim`); `demos/` removed.
- FE↔BE contract: new `matios-ui-sprint-board-backend.md` + "Backend integration" section here.

### 2026-05-30
- `addTask` feature — "+ Add story" toolbar button + `onAddTask({ data, resolve, reject })`; dev modal; canonical
  (Jira-style) + alias story normalization; `submitAddTask()`.
- Fix: `_storyToCard()` referenced a non-existent `TYPE_ICONS` constant → render `ReferenceError`.

### 2026-05-29
- New component — `widgets/boards/matios-ui-sprint-board/`. Implements the 10 events; Sprint panel composed from
  `MTS.Kanban`; bidirectional Backlog ↔ Sprint; configurable `MTS.Splitter`; velocity banner with capacity bar.
