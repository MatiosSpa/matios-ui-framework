# MTS.SprintBoard

Tablero Scrum: panel Backlog (izquierda) + Sprint Board (derecha) con drag bidireccional. Internamente usa `MTS.Kanban` para el panel Sprint. Emite eventos para que el consumer persista.

---

## Instalación

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

## Uso básico

```html
<div id="sprintboard" style="height: 600px"></div>
```

```js
const sb = new MTS.SprintBoard('#sprintboard', {
  dataSource: function() {
    return fetch('/api/sprint').then(function(r) { return r.json(); });
  },
  showVelocity: true,
  addStories: true,
});

sb.onStoryMove(function(e) {
  persistStory(e.story);
});
sb.onSprintStart(function(e) {
  activateSprint(e.sprint.id);
});
```

---

## Opciones

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `dataSource` | `fn(query) => Promise<{stories, sprints}>` | — | Carga async |
| `currentSprintId` | `string` | — | ID del sprint visible; se auto-detecta si hay uno `status:'active'` |
| `columns` | `array` | `[todo, wip, done]` | Columnas del Sprint Board (mismo schema que MTS.Kanban) |
| `showBacklog` | `boolean` | `true` | Mostrar panel Backlog |
| `showVelocity` | `boolean` | `false` | Mostrar barra de capacity |
| `splitter` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientación Backlog vs Sprint |
| `addStories` | `boolean` | `false` | Botón "+ Historia" en toolbar |
| `onLoad` | `fn` | — | Constructor handler |
| `onError` | `fn` | — | Constructor handler |
| `onStoryAdd` | `fn` | — | Constructor handler |
| `onStoryChange` | `fn` | — | Constructor handler |
| `onStoryMove` | `fn` | — | Constructor handler |
| `onStoryDelete` | `fn` | — | Constructor handler |
| `onSprintChange` | `fn` | — | Constructor handler |
| `onSprintStart` | `fn` | — | Constructor handler |
| `onSprintComplete` | `fn` | — | Constructor handler |
| `onSelect` | `fn` | — | Constructor handler |
| `addTask` | `object` | — | Activa el botón "+ Agregar historia" en la toolbar. El **modal lo pone el dev** |

### `addTask` — alta con modal del dev

El componente aporta el botón y la cosecha; el modal es del dev (un `MTS.Modal` o cualquier markup).

```js
addTask: {
  label: '+ Agregar historia',        // opcional
  form:  '#mi-form',                   // contenedor a cosechar (o `modal:`)
  open:  function () { miModal.show(); },
  close: function () { miModal.hide(); },
  map:   function (data) { return data; },  // opcional
}
```

Flujo: clic → `open()` → el dev confirma con `sb.submitAddTask()` (o `[data-mts-addtask-submit]`) → cosecha
por `name`/`id` (cosecha propia del componente) → `onAddTask({ data, resolve, reject })`. `resolve()` normaliza
canónico (estilo Jira) + alias → Story e inserta (`addStory`, location por `data._location` o `'backlog'`).
Alias: `summary`/`title`→`title` · `issuetype`/`type`→`type` · `key`→`code`. No reconocidos → `extras`.

### Story shape

```js
{
  id:           's1',
  code:         'PRJ-42',
  title:        'Como user quiero...',
  description:  '...',
  type:         'userstory' | 'task' | 'bug' | 'epic' | 'spike',
  storyPoints:  5,
  priority:     'low' | 'medium' | 'high' | 'critical',
  tags:         ['ui'],
  assignees:    [{ id, name, avatar }],
  sprintId:     null | 'sprint-7',
  status:       'todo' | 'wip' | 'done',
  parentEpicId: null,
}
```

### Sprint shape

```js
{
  id:        'sprint-7',
  number:    7,
  name:      'Sprint 7',
  goal:      'Cerrar UI de Onboarding',
  startDate: '2026-06-01',
  endDate:   '2026-06-14',
  status:    'planning' | 'active' | 'completed' | 'cancelled',
  capacity:  40,
  committed: 38,
}
```

---

## Eventos

| Método | Payload | Cuándo |
|---|---|---|
| `onAddTask(fn)` | `{data, resolve, reject}` | Confirmación del modal del dev (cosecha cruda). `resolve()` inserta, `reject()` cancela |
| `onLoad(fn)` | `{stories, sprints}` | DataSource resuelto |
| `onError(fn)` | `{error}` | DataSource rechazado |
| `onStoryAdd(fn)` | `{story, location}` | Historia agregada (`'backlog' \| 'sprint'`) |
| `onStoryChange(fn)` | `{story, fields}` | Historia actualizada |
| `onStoryMove(fn)` | `{story, from, to}` | Movida entre Backlog y Sprint, o entre columnas |
| `onStoryDelete(fn)` | `{story}` | Historia eliminada |
| `onSprintChange(fn)` | `{sprint, fields}` | Sprint editado |
| `onSprintStart(fn)` | `{sprint}` | Sprint activado |
| `onSprintComplete(fn)` | `{sprint, doneStories, pendingStories}` | Sprint cerrado |
| `onSelect(fn)` | `{stories}` | Selección cambió |

```js
const sb = new MTS.SprintBoard('#sb', { ... });

const disposeMove = sb.onStoryMove(function(e) {
  console.log(e.story.title, e.from.type, '→', e.to.type);
  persistStory(e.story);
});

disposeMove(); // unsubscribe
```

---

## API pública

| Método | Descripción |
|---|---|
| `addStory(story, location)` | location: `'backlog' \| 'sprint'` |
| `submitAddTask()` | Cosecha el form del modal del dev y dispara `onAddTask` (lo llama el botón confirmar del modal). Solo con la opción `addTask` |
| `updateStory(id, fields)` | Actualiza campos |
| `deleteStory(id)` | Elimina historia |
| `moveStory(id, target)` | target: `{type, columnId?}` |
| `startSprint(sprintId)` | Activa sprint — emite `onSprintStart` |
| `completeSprint(sprintId)` | Cierra sprint — mueve pendientes al backlog |
| `setCurrentSprint(sprintId)` | Cambia el sprint visible |
| `getBacklog()` | Devuelve historias sin sprint |
| `getCurrentSprintStories()` | Devuelve historias del sprint activo |
| `reload()` | Re-invoca dataSource |
| `destroy()` | Limpia DOM y listeners |

---

## Composición con MTS.Kanban

El panel Sprint usa `MTS.Kanban` internamente. El SprintBoard escucha `onCardMove` del Kanban y lo traduce a `onStoryMove` con el schema de stories. El consumer solo interactúa con la API de SprintBoard — no con el Kanban interno.

---

## Changelog

### 2026-05-31 — Demo consolidado + DevPanel + i18n + integración BE
- **i18n propio** `matios-ui-sprint-board-i18n.js` (es/en/pt, namespace `MTS.SprintBoard`) + método `_t()`.
  Todos los strings internos pasan por `_t()` con fallback: columnas (Por hacer/En curso/Completado), toolbar
  (Iniciar/Cerrar Sprint, "Sin sprint activo", "+ Historia", "+ Agregar historia"), Backlog/vacío, Capacidad/SP,
  flechas mover, y el form inline de historia.
- **Contrato `MTS.DevPanel`**: `getConfig()` (toggles `showBacklog`/`showVelocity`/`addStories`) + `getCode()`.
- **Demo único** `demo.html` (estilo Gantt/Kanban): board envuelto en **`MTS.DevPanel`** (Config·Log·Code) + Topbar
  (brand), **carga async** (`dataSource` → `{stories, sprints}`), modal único alta/edición (Input/Select: tipo,
  prioridad, puntos, responsable), **eventos → `apiSim`** (console.log + Activity Log): `onStoryAdd`→POST,
  `onStoryChange`→PATCH, `onStoryMove`→PATCH, `onStoryDelete`→DELETE, `onSprintStart`/`onSprintComplete`→POST.
  Clic en historia (`onSelect`) abre el modal de edición. **100% locale, sin CSS satélite.** Carpeta `demos/` eliminada.

### 2026-05-30 (2)
- Feature `addTask` — botón "+ Agregar historia" en toolbar + evento `onAddTask({data, resolve, reject})`.
  Modal del dev; cosecha propia por `name`/`id`; `_normalizeCanonicalStory` (Jira+alias →
  Story, `extras` para round-trip); `submitAddTask()`. Demo: `demos/demo_4`. Lógica propia del componente.

### 2026-05-30
- **Bug fix**: `_storyToCard()` referenciaba la constante inexistente `TYPE_ICONS` →
  `ReferenceError` al renderizar historias en el sprint. El título de la card es texto plano,
  así que se usa `story.title` directo.
- Creados los 3 demos del launcher: `demos/demo_1` (estático), `demos/demo_2` (async),
  `demos/demo_3` (eventos) — antes el launcher iframeaba archivos inexistentes (`Cannot GET`).

### 2026-05-29
- Componente nuevo — `widgets/boards/matios-ui-sprint-board/`
- Implementa los 10 eventos del levantamiento: `onLoad`, `onError`, `onStoryAdd`, `onStoryChange`, `onStoryMove`, `onStoryDelete`, `onSprintChange`, `onSprintStart`, `onSprintComplete`, `onSelect`
- Panel Sprint usa `MTS.Kanban` internamente (composición)
- Drag bidireccional Backlog ↔ Sprint via botones
- Columnas del Sprint draggables via MTS.Kanban
- Splitter horizontal configurable via `MTS.Splitter`
- Velocity banner con capacity bar
- `addStories: true` muestra formulario inline
