# MTS.GanttChart

Hierarchical SVG Gantt + WBS grid with inline editing, drag & drop, undo/redo and an async DataSource. Built for project management. Connects to `MTS.Kanban` or `MTS.SprintBoard` through events, without coupling.

---

## Installation

```html
<!-- Required -->
<link rel="stylesheet" href="base/matios-ui-base.css">
<link rel="stylesheet" href="layout/matios-ui-splitter/matios-ui-splitter.css">
<link rel="stylesheet" href="widgets/boards/matios-ui-gantt-chart/matios-ui-gantt-chart.css">
<script src="base/matios-ui-base.js"></script>
<script src="layout/matios-ui-splitter/matios-ui-splitter.js"></script>
<script src="widgets/boards/matios-ui-gantt-chart/matios-ui-gantt-chart.js"></script>

<!-- Optional: inline color editing -->
<link rel="stylesheet" href="forms/matios-ui-colorpicker/matios-ui-colorpicker.css">
<script src="forms/matios-ui-colorpicker/matios-ui-colorpicker.js"></script>

<!-- Optional: i18n (es/en/pt) — base locale + component locale -->
<script src="base/matios-ui-i18n.js"></script>
<script src="widgets/boards/matios-ui-gantt-chart/matios-ui-gantt-chart-i18n.js"></script>
```

### i18n

The component reads its text from the `MTS.GanttChart` layer of the active language
(`MTS.getString()['MTS.GanttChart']`), with an English fallback when no locale is loaded. Its own locale file
`matios-ui-gantt-chart-i18n.js` registers `es`/`en`/`pt` (months, column labels, `today`, `empty`, errors,
`reorderHint`, `baselineLabel`, and the `ui` section for the demo). Override with
`MTS.registerLocale('es', { 'MTS.GanttChart': { today: 'Hoy' } })`.

---

## Usage

```html
<div id="gantt" style="height: 500px"></div>
```

```js
const gantt = new MTS.GanttChart('#gantt', {
  dataSource: function (query) { return fetch('/api/tasks').then(function (r) { return r.json(); }); },
  scale:    'week',
  editable: true,
});

gantt.onTaskChange(function (e) { console.log('Task edited:', e.task.id, e.fields); });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dataSource` | `fn(query) \| {url, method, headers, params}` | — | Async task load. Returns `{ data: Task[], links?: Link[] }` |
| `columns` | `Column[]` | default columns | Left grid columns |
| `scale` | `'day' \| 'week' \| 'month'` | `'week'` | Initial time scale |
| `editable` | `boolean` | `true` | Allow drag / resize / inline edit |
| `rowHeight` | `number` | `36` | Row height in px |
| `gridWidth` | `number` | — | Initial grid panel width in px |
| `hoursPerDay` | `number` | `8` | To compute `durationHours` |
| `undoLimit` | `number` | `50` | Undo/redo stack size |
| `palette` | `string[]` | 10 colors | Auto-assigned when `task.color` is undefined |
| `addTask` | `object` | — | Enables the "+ Add task" toolbar button. **The modal is supplied by the dev** (see below) |
| `editTask` | `boolean` | `false` | Double-click the **name** emits `onTaskEdit` (full modal); other editable cells emit `onCellEdit` (per-cell editor). Disables inline editing; single click still selects |
| `reorderable` | `boolean` | `false` | Per-row drag handle. Drop between rows = move as sibling; drop on a row = nest (child). Renumbers the WBS and reorders; emits `onReorder` |
| `onLoad` / `onError` / `onTaskAdd` / `onTaskChange` / `onTaskMove` / `onTaskResize` / `onTaskDelete` / `onLinkAdd` / `onLinkRemove` / `onSelect` / `onScaleChange` / `onExport` | `fn` | — | Constructor handler shortcuts |

### `addTask` — add via the dev's modal

The component provides the standard button and the harvest; the modal is the dev's:

```js
addTask: {
  form:  '#my-form',                        // container to harvest (or `modal:`)
  open:  function () { myModal.show(); },
  close: function () { myModal.hide(); },
  label: '+ Add task',                      // optional
  map:   function (data) { return data; },  // optional
}
```

Flow: click → `open()` → dev confirms with `gantt.submitAddTask()` → the board harvests each control by `name`/`id`
→ `onAddTask({ data, resolve, reject })`. `resolve(task?)` normalizes canonical + aliases and inserts; `reject()`
cancels; no handler → auto-insert. With `showButton: false` the board does not render its own button (the dev places
one, e.g. in an `MTS.Topbar`). Aliases (MS Project canonical + shortcuts): `name`/`label`/`title`→`label`,
`finish`/`end`→`end`, `percentComplete`(0–100)/`progress`(0–1)→`progress`, `predecessors`/`deps`→`predecessors`;
unrecognized fields → `task.extras`.

### Shapes

```js
// Column
{ field: 'label', label: 'Task', width: 200, editable: true, type: 'date', hidden: false }

// Task
{
  id: 't1', wbs: '1.2', label: 'Scope analysis', start: '2026-01-13', end: '2026-01-17',
  color: '#3b82f6', progress: 0.5, status: 'wip', predecessors: ['1.1'],
  assignees: [{ uid: 'u1', name: 'Ana', avatar: 'url?' }], // uid = person id (for the BE)
  children: [/* … */],
  // Baseline (optional plan snapshot — draws the ghost bar if present):
  baselineStart: '2026-01-13', baselineEnd: '2026-01-17', baselineProgress: 0,
}

// Link
{ id: 'l1', from: 't1', to: 't2', type: 'FS' /* 'FS'|'FF'|'SS'|'SF' */, lag: 0 }
```

---

## Events

Every `onXxxx` method returns a `dispose()` to unsubscribe; constructor handlers are shortcuts.

| Method | Payload | When |
|--------|---------|------|
| `onLoad(fn)` / `onError(fn)` | `{ tasks, links }` / `{ error }` | DataSource resolved / rejected |
| `onAddTask(fn)` | `{ data, resolve, reject }` | Dev modal confirmation (raw harvest) |
| `onTaskAdd(fn)` | `{ task }` | New task inserted |
| `onTaskChange(fn)` | `{ task, fields }` | A field changed (inline edit) |
| `onTaskMove(fn)` / `onTaskResize(fn)` | `{ task }` | Bar dragged / right edge resized |
| `onTaskDelete(fn)` | `{ task }` | Task removed |
| `onAssigneesClick(fn)` | `{ task, assignees, setAssignees }` | Click on the Assignees cell — open your modal, save with `setAssignees([...])` |
| `onAssigneesChange(fn)` | `{ task, assignees }` | Assignees updated |
| `onTaskEdit(fn)` | `{ task, updateTask }` | Double-click the name (with `editTask`) — open the full modal, save with `updateTask(fields)` |
| `onCellEdit(fn)` | `{ task, field, column, anchorEl, updateTask }` | Double-click an editable non-name cell — anchor your editor to `anchorEl` (e.g. `MTS.Popover`) |
| `onReorder(fn)` | `{ task, mode, target, tasks }` | Row reordered/nested by drag. `mode`: `before`/`after`/`into` |
| `onBaselineSave(fn)` | `{ tasks, baseline }` | Baseline captured (`saveBaseline()`); `baseline` is ready to `POST` |
| `onLinkAdd(fn)` / `onLinkRemove(fn)` | `{ link }` | Dependency created / removed |
| `onSelect(fn)` | `{ tasks }` | Selection changed |
| `onScaleChange(fn)` | `{ scale }` | User changed the scale |
| `onExport(fn)` / `onImport(fn)` | `{ format, filename, tasks, csv? }` / `{ file, format, name }` | "Save as" / "Open" |

```js
const dispose = gantt.onTaskChange(function (e) { persist(e.task); });
dispose(); // unsubscribe
```

### Backend integration

Payloads are ready to send to the BE (normalized task/`fields`; `assignees` with `uid`; `predecessors` as WBS). The
component does not persist — the consumer chooses the endpoint:

| Event | Suggested BE action | Payload |
|-------|---------------------|---------|
| `onTaskAdd` | `POST /tasks` | `e.task` |
| `onTaskChange` | `PATCH /tasks/:id` | `e.fields` (only what changed) |
| `onTaskMove` · `onTaskResize` | `PATCH /tasks/:id` | `{ start, end }` |
| `onTaskDelete` | `DELETE /tasks/:id` | `{ id }` |
| `onAssigneesChange` | `PUT /tasks/:id/assignees` | `e.assignees` (`[{ uid, name }]`) |
| `onReorder` | `PUT /tasks/reorder` | `e.tasks` with the new WBS/order |
| `onBaselineSave` | `POST /projects/:id/baseline` | `e.baseline` = `[{ id, start, end, progress }]` |
| `onExport` / `onImport` | `POST /projects/export\|import` | `e.tasks` / file (CSV resolved on the front; Excel/MSProject serialized by the BE) |

> Full backend contract (endpoints, shapes, baseline, import/export):
> [`matios-ui-gantt-chart-backend.md`](matios-ui-gantt-chart-backend.md). The demo shows it live via `apiSim`.

### Baseline

A frozen snapshot of the plan to compare **plan vs actual**. If a task has `baselineStart`/`baselineEnd`, the Gantt
draws a thin grey **ghost bar** under the real bar; the gap is the variance (see the `variance` column). `saveBaseline()`
captures the snapshot and emits `onBaselineSave` for the BE to persist; `clearBaseline()` removes it. The FE only
displays — the snapshot lives in the DB.

---

## API

| Method | Description |
|--------|-------------|
| `addTask(task[, parentId])` | Add a task (with undo/redo) |
| `submitAddTask()` | Harvest the dev modal form and fire `onAddTask` (only with the `addTask` option) |
| `setAssignees(id, assignees)` | Replace a task's assignees, re-render, emit `onAssigneesChange` |
| `exportTasks([format, filename])` | "Save as" — emits `onExport` (`'csv'` generates the CSV) |
| `importFile(file)` | "Open" — emits `onImport` (format detected by extension) |
| `setTasks(input)` | Load a new task set (array or `{ data, links }`); emits `onLoad` |
| `updateTask(id, fields)` / `deleteTask(id)` | Update / delete (with undo/redo) |
| `addLink(link)` / `removeLink(id)` | Add / remove a dependency |
| `getTasks()` / `getLinks()` / `getColumns()` | Return copies |
| `setColumnVisible(field, visible)` | Show/hide a column at runtime |
| `saveBaseline()` / `clearBaseline()` | Capture / clear the baseline |
| `setScale(scale)` | `'day' \| 'week' \| 'month'` |
| `collapseAll()` / `expandAll()` | Collapse / expand parent nodes |
| `undo()` / `redo()` | Undo / redo |
| `reload()` | Re-invoke the dataSource |
| `getConfig()` / `getCode()` | `MTS.DevPanel` contract |
| `destroy()` | Clean up DOM, listeners and state |

---

## CSS Variables

```css
.mts-gantt {
  --mts-gantt-row-h:       36px;
  --mts-gantt-header-h:    48px;
  --mts-gantt-today-color: var(--mts-color-danger);
  --mts-gantt-sel-bg:      var(--mts-color-primary-light);
  --mts-gantt-sel-border:  var(--mts-color-primary);
}
```

## CSS Classes

`.mts-gantt` (root) · `__split` · `__grid-panel` · `__gantt-panel` · `__tr` / `--group` / `--selected` · `__td` ·
`__bar` / `--group` · `__milestone` · `__link` · `__today-line` · `__bar-baseline` (ghost bar).

---

## Connecting with MTS.Kanban via events

```js
function progressToColId(p) { return p === 1 ? 'done' : (p > 0 ? 'wip' : 'todo'); }

const gantt = new MTS.GanttChart('#gantt', { dataSource: fetchTasks });
let kanban = null, syncing = false;

gantt.onLoad(function (e) {
  kanban = new MTS.Kanban('#kanban', {
    columns: buildColumnsFromTasks(e.tasks),
    onCardMove: function (ev) {
      if (syncing) return;
      syncing = true; gantt.updateTask(ev.card.id, { progress: colIdToProgress(ev.toColId) }); syncing = false;
    },
  });
});

gantt.onTaskChange(function (e) {
  if (!kanban || syncing || !e.fields.hasOwnProperty('progress')) return;
  syncing = true; kanban.moveCard(e.task.id, progressToColId(e.task.progress), 0); syncing = false;
});
```

---

## Accessibility

- The grid is focusable (`tabindex=0`); `Ctrl+Z` / `Ctrl+Y` undo/redo when `editable`. Drag/resize are pointer
  gestures — inline/cell editing and the dev modal provide keyboard paths.

---

## Changelog

### 2026-07-01
- `{ url }` dataSource: `Content-Type: application/json` is now added only for non-GET requests and only when the dev
  didn't provide one; the `headers` object is cloned instead of mutated. `params` + `queryParams` merge unchanged.

### 2026-05-30
- **Baseline**: `baselineStart`/`baselineEnd`/`baselineProgress` per task → thin grey ghost bar under the real bar;
  `saveBaseline()` / `clearBaseline()` + `onBaselineSave`; **Variance** column (`field:'variance'`, late/early/ontime).
  New backend contract doc `matios-ui-gantt-chart-backend.md`.
- **`assignees` with `uid`** (`{ uid, name, avatar? }`) and a documented backend-integration mapping; demo `apiSim`.
- **Per-cell editor** — `onCellEdit({ task, field, column, anchorEl, updateTask })`; demo adds a Dependencies column
  with anchored `MTS.Popover` editors (TagInput / DatePicker / Slider).
- **Own i18n** `matios-ui-gantt-chart-i18n.js` (es/en/pt) + `_t()`; redesigned grid (progress mini-bar, zebra, phase
  accent); demo with no satellite/inline CSS.
- **Show/hide columns at runtime** (`setColumnVisible` / `getColumns`); consolidated `demo.html` wrapped in
  `MTS.DevPanel` (`getConfig` / `getCode`); `demos/` folder removed.
- **Undo/redo by snapshots** covering add/edit/delete/reorder/assignees/import, plus bar move/resize; `Ctrl+Z`/`Ctrl+Y`.
- **Save as / Open** (`exportTasks` / `importFile` / `setTasks`, CSV on the front); horizontal grid scroll;
  `reorderable` + `onReorder` (sibling/nest with WBS renumber + predecessor remap); `editTask` + `onTaskEdit`;
  editable assignees cell (`onAssigneesClick` / `setAssignees`); `addTask` toolbar button.

### 2026-05-29
- **Breaking**: renamed `MTS.ProjectManager` → `MTS.GanttChart`; moved to `widgets/boards/matios-ui-gantt-chart/`;
  events migrated from `.on(STRING)` → `.onXxxx(fn)`; CSS BEM `mts-project__*` → `mts-gantt__*`. Requires
  `base/matios-ui-base.js`. Built-in Kanban sync removed in favor of the event pattern.
