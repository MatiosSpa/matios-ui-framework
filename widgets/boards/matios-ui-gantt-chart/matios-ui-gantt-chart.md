# MTS.GanttChart

Componente Gantt SVG + Grid WBS jerárquico con inline editing, drag & drop, undo/redo y DataSource async. Diseñado para gestión de proyectos. Se conecta con `MTS.Kanban` o `MTS.SprintBoard` via eventos sin acoplamiento.

---

## Instalación

```html
<!-- Dependencias obligatorias -->
<link rel="stylesheet" href="base/matios-ui-base.css">
<link rel="stylesheet" href="layout/matios-ui-splitter/matios-ui-splitter.css">
<link rel="stylesheet" href="widgets/boards/matios-ui-gantt-chart/matios-ui-gantt-chart.css">

<script src="base/matios-ui-base.js"></script>
<script src="layout/matios-ui-splitter/matios-ui-splitter.js"></script>
<script src="widgets/boards/matios-ui-gantt-chart/matios-ui-gantt-chart.js"></script>

<!-- Opcional: edición de color inline -->
<link rel="stylesheet" href="forms/matios-ui-colorpicker/matios-ui-colorpicker.css">
<script src="forms/matios-ui-colorpicker/matios-ui-colorpicker.js"></script>

<!-- Opcional: i18n (es/en/pt). Locale base + archivo propio del componente -->
<script src="base/matios-ui-i18n.js"></script>
<script src="widgets/boards/matios-ui-gantt-chart/matios-ui-gantt-chart-i18n.js"></script>
```

### i18n

El componente lee sus textos de la capa `MTS.GanttChart` del locale activo
(`MTS.getLocale()['MTS.GanttChart']`), con fallback en inglés si no se carga ningún locale.

- **Locale base**: `base/matios-ui-i18n.js` (`MTS.Locales` / `MTS.getLocale` / `MTS.registerLocale`, deep-merge).
- **Locale propio**: `matios-ui-gantt-chart-i18n.js` (mismo nombre del componente + `-i18n`) registra
  `es` / `en` / `pt` bajo `MTS.GanttChart`: `months`, `weekPrefix`, labels de columnas por defecto
  (`colWbs`, `colLabel`, `colStart`, `colEnd`, `colDuration`, `colDurationHours`, `colPredecessors`),
  `today`, `empty`, `errorPrefix`, `loadError`, `reorderHint`.
- Idioma activo: `MTS._locale` (default `'es'`). Para extender/sobrescribir: `MTS.registerLocale('es', { 'MTS.GanttChart': { today: 'Hoy' } })`.

---

## Uso básico

```html
<div id="gantt" style="height: 500px"></div>
```

```js
const gantt = new MTS.GanttChart('#gantt', {
  dataSource: function(query) {
    return fetch('/api/tasks').then(function(r) { return r.json(); });
  },
  scale:    'week',
  editable: true,
});

gantt.onTaskChange(function(e) {
  console.log('Tarea editada:', e.task.id, e.fields);
});
```

---

## Opciones

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `dataSource` | `fn(query) \| {url, method, headers, params}` | — | Carga async de tareas. La función debe devolver `{data: Task[], links?: Link[]}` |
| `columns` | `Column[]` | DEFAULT_COLUMNS | Columnas del grid izquierdo |
| `scale` | `'day' \| 'week' \| 'month'` | `'week'` | Escala de tiempo inicial |
| `editable` | `boolean` | `true` | Permite drag/resize/inline edit |
| `rowHeight` | `number` | `36` | Alto de fila en px |
| `gridWidth` | `number` | — | Ancho inicial del panel grid en px |
| `hoursPerDay` | `number` | `8` | Para calcular `durationHours` |
| `undoLimit` | `number` | `50` | Pila undo/redo |
| `palette` | `string[]` | 10 colores | Colores auto-asignados cuando `task.color` no se define |
| `i18n` | `object` | — | Override de labels internos |
| `addTask` | `object` | — | Activa el botón "+ Agregar tarea" en la toolbar. El **modal lo pone el dev**. Ver abajo |
| `editTask` | `boolean` | `false` | Doble clic en el **nombre** emite `onTaskEdit` (modal completo); en otras celdas editables emite `onCellEdit` (editor por celda). Desactiva la edición inline. Clic simple sigue seleccionando |
| `reorderable` | `boolean` | `false` | Muestra un handle de arrastre por fila. Soltar entre filas = mover como hermano; soltar sobre una fila = anidar (hija). Renumera el WBS y reordena solo; emite `onReorder` |

### `addTask` — alta de tareas con modal del dev

El componente solo aporta el botón estándar y la **cosecha**; el modal es del dev (un `MTS.Modal` o cualquier markup).

```js
addTask: {
  form:  '#mi-form',                  // contenedor a cosechar (o `modal:`)
  open:  function () { miModal.show(); },   // cómo abrir el modal del dev
  close: function () { miModal.hide(); },   // cómo cerrarlo al confirmar
  label: '+ Agregar tarea',           // opcional, texto del botón
  map:   function (data) { return data; },  // opcional, transforma lo cosechado
}
```

> Con `showButton: false`, el board **no** renderiza su botón — el dev pone el suyo (ej. en una `MTS.Topbar`)
> y dispara el alta con `gantt.submitAddTask()`. El resto del flujo (form/cosecha/`onAddTask`) es igual.

Flujo: clic en el botón → `open()` → el dev confirma llamando `gantt.submitAddTask()` (o con un
botón `[data-mts-addtask-submit]` dentro del form) → el board **cosecha cada control por su `name`/`id`**
(cosecha propia del componente) → emite `onAddTask({ data, resolve, reject })`.

- `data` = diccionario crudo `{ clave: valor }` (clave = `name` o `id`; sin clave → no se incluye).
- `resolve(task?)` → normaliza canónico+alias → estructura interna del Gantt e inserta.
- `reject()` → no inserta (modal queda abierto).
- Sin handler de `onAddTask` → autoinserta con lo cosechado.

**Alias aceptados al normalizar** (canónico MS Project + atajos):
`name`/`label`/`title` → `label` · `finish`/`end` → `end` · `percentComplete` (0–100)/`progress` (0–1) →
`progress` · `predecessors`/`deps` (array o string con comas) → `predecessors`. Campos no reconocidos
quedan en `task.extras` (round-trip / backend).
| `onLoad` | `fn` | — | Constructor handler (atajo) |
| `onError` | `fn` | — | Constructor handler (atajo) |
| `onTaskAdd` | `fn` | — | Constructor handler (atajo) |
| `onTaskChange` | `fn` | — | Constructor handler (atajo) |
| `onTaskMove` | `fn` | — | Constructor handler (atajo) |
| `onTaskResize` | `fn` | — | Constructor handler (atajo) |
| `onTaskDelete` | `fn` | — | Constructor handler (atajo) |
| `onLinkAdd` | `fn` | — | Constructor handler (atajo) |
| `onLinkRemove` | `fn` | — | Constructor handler (atajo) |
| `onSelect` | `fn` | — | Constructor handler (atajo) |
| `onScaleChange` | `fn` | — | Constructor handler (atajo) |
| `onExport` | `fn` | — | Constructor handler (atajo) |

### Column shape

```js
{
  field:    'label',    // campo del objeto task
  label:    'Tarea',   // header del grid
  width:    200,        // px
  editable: true,       // permite inline edit / editor por celda (onCellEdit)
  type:     'date',     // 'text' | 'date' | 'number' (opcional)
  hidden:   false,      // oculta la columna (toggle en runtime con setColumnVisible)
}
```

### Task shape

```js
{
  id:           't1',
  wbs:          '1.2',
  label:        'Análisis de alcance',
  start:        '2026-01-13',           // YYYY-MM-DD
  end:          '2026-01-17',
  color:        '#3b82f6',              // opcional — usa palette si no se define
  progress:     0.5,                    // 0..1
  status:       'wip',                  // libre
  predecessors: ['1.1'],                // WBS o IDs
  assignees:    [{ uid: 'u1', name: 'Ana', avatar: 'url?' }], // uid = id de la persona (para el BE); name visible; avatar opcional
  children:     [...],                  // alternativa a wbs jerarquía plana

  // — Línea base (opcional, foto del plan). Si vienen, se dibuja la barra fantasma —
  baselineStart:    '2026-01-13',       // 'YYYY-MM-DD'
  baselineEnd:      '2026-01-17',
  baselineProgress: 0,                  // opcional
}
```

### Link shape

```js
{
  id:   'l1',
  from: 't1',
  to:   't2',
  type: 'FS',   // 'FS' | 'FF' | 'SS' | 'SF'
  lag:  0
}
```

---

## Eventos

Todos los métodos `onXxxx` devuelven un `dispose()` para unsubscribe. Los constructor handlers son atajos — no son la única forma de suscribirse.

| Método | Payload | Cuándo |
|---|---|---|
| `onLoad(fn)` | `{tasks, links}` | DataSource resuelto |
| `onError(fn)` | `{error}` | DataSource rechazado |
| `onAddTask(fn)` | `{data, resolve, reject}` | Confirmación del modal del dev (cosecha cruda). `resolve()` inserta, `reject()` cancela |
| `onTaskAdd(fn)` | `{task}` | Nueva tarea ya insertada (via `onAddTask`→resolve, UI o `.addTask()`) |
| `onTaskChange(fn)` | `{task, fields}` | Cualquier campo cambió (inline edit) |
| `onTaskMove(fn)` | `{task}` | Barra arrastrada completa |
| `onTaskResize(fn)` | `{task}` | Borde derecho redimensionado |
| `onTaskDelete(fn)` | `{task}` | Tarea eliminada |
| `onAssigneesClick(fn)` | `{task, assignees, setAssignees}` | Clic en la celda Asignados. El dev abre su modal y guarda con `setAssignees([...])` |
| `onAssigneesChange(fn)` | `{task, assignees}` | Asignados actualizados (via `setAssignees`) |
| `onTaskEdit(fn)` | `{task, updateTask}` | Doble clic en el **nombre** (con `editTask`). El dev abre su modal con todos los campos y guarda con `updateTask(fields)` |
| `onCellEdit(fn)` | `{task, field, column, anchorEl, updateTask}` | Doble clic en una celda **editable que no es el nombre** (con `editTask` + listener). El dev ancla su editor a `anchorEl` (ideal: `MTS.Popover`) con el control del `field` y guarda con `updateTask(fields)` |
| `onReorder(fn)` | `{task, mode, target, tasks}` | Tarea reordenada/anidada por drag (con `reorderable`). `mode`: `before`/`after`/`into`. `tasks` = lista con el WBS/orden nuevo |
| `onBaselineSave(fn)` | `{tasks, baseline}` | Se tomó la línea base (`saveBaseline()`). `baseline` = snapshot `[{id, start, end, progress}]` listo para `POST` al BE |
| `onLinkAdd(fn)` | `{link}` | Dependencia creada |
| `onLinkRemove(fn)` | `{link}` | Dependencia eliminada |
| `onSelect(fn)` | `{tasks}` | Selección cambió |
| `onScaleChange(fn)` | `{scale}` | Usuario cambió escala |
| `onExport(fn)` | `{format, filename, tasks, csv?}` | "Guardar como" (`exportTasks`). `csv` listo para `'csv'`; otros formatos los serializa el backend |
| `onImport(fn)` | `{file, format, name}` | "Abrir" (`importFile`). El consumer parsea el archivo (adapters) y carga con `setTasks()` |

```js
// Suscribirse con dispose
const dispose = gantt.onTaskChange(function(e) {
  persistir(e.task);
});

// Unsubscribe cuando ya no se necesita
dispose();

// Once pattern
const off = gantt.onLoad(function(e) {
  inicializar(e.tasks);
  off();
});
```

### Integración con backend

Los payloads de los eventos vienen **listos para enviar al BE** (la tarea/`fields` ya normalizados; `assignees`
con `uid`; `predecessors` con WBS). El componente NO persiste — el consumer decide a qué endpoint mandar. Mapeo típico:

| Evento | Acción BE sugerida | Payload |
|--------|--------------------|---------|
| `onTaskAdd` | `POST /tasks` | `e.task` (tarea completa creada) |
| `onTaskChange` | `PATCH /tasks/:id` | `e.fields` (solo lo que cambió: modal, celda, inline, color) |
| `onTaskMove` · `onTaskResize` | `PATCH /tasks/:id` | `{ start, end }` de `e.task` (dispara al soltar la barra) |
| `onTaskDelete` | `DELETE /tasks/:id` | `{ id }` |
| `onAssigneesChange` | `PUT /tasks/:id/assignees` | `e.assignees` (`[{ uid, name }]`) |
| `onReorder` | `PUT /tasks/reorder` | `e.tasks` con el WBS/orden nuevo (recalculado) |
| `onBaselineSave` | `POST /projects/:id/baseline` | `e.baseline` = `[{id, start, end, progress}]` (la foto del plan) |
| `onExport` / `onImport` | `POST /projects/export\|import` | `e.tasks` / archivo (CSV se resuelve en el front; Excel/MSProject los serializa el BE) |

> El **demo** muestra esto en vivo: cada acción llama a `apiSim(method, path, payload)` que hace `console.log`
> del payload y lo escribe en el Activity Log — así se ve exactamente qué iría al backend.
>
> 📄 **Contrato completo para el dev backend** (endpoints, shapes, baseline, import/export):
> [`matios-ui-gantt-chart-backend.md`](matios-ui-gantt-chart-backend.md).

### Línea base (baseline)

Foto congelada del plan para comparar **plan vs real**. Si una tarea trae `baselineStart`/`baselineEnd`, el Gantt
dibuja una **barra fantasma fina (gris) bajo la barra real**; la separación es el desvío. `saveBaseline()` toma la
foto (copia las fechas actuales) y emite `onBaselineSave` para que el BE la persista. **El FE solo muestra; la
foto vive en la BD.** Detalle de persistencia (modelos de tabla, endpoint) en el contrato de backend.

---

## API pública

| Método | Descripción |
|---|---|
| `addTask(task, parentId?)` | Agrega tarea (con undo/redo) |
| `submitAddTask()` | Cosecha el form del modal del dev y dispara `onAddTask` (lo llama el botón confirmar del modal). Solo activo con la opción `addTask` |
| `setAssignees(id, assignees)` | Reemplaza los asignados de una tarea, re-renderiza y emite `onAssigneesChange`. Lo suele llamar el dev desde `onAssigneesClick` (`e.setAssignees`) |
| `exportTasks(format?, filename?)` | "Guardar como" — emite `onExport({format, filename, tasks, csv?})`. `'csv'` genera el CSV; `'excel'`/`'msproject'` pasan el data para que el backend serialice |
| `importFile(file)` | "Abrir" — emite `onImport({file, format, name})` (formato detectado por extensión: csv/excel/msproject). El consumer/backend parsea y carga con `setTasks()` |
| `setTasks(input)` | Carga un set nuevo de tareas (array o `{data, links}`). Normaliza, re-renderiza y emite `onLoad`. Útil tras importar |
| `updateTask(id, fields)` | Actualiza campos (con undo/redo) |
| `deleteTask(id)` | Elimina tarea y subtareas WBS (con undo/redo) |
| `addLink(link)` | Agrega dependencia |
| `removeLink(id)` | Elimina dependencia |
| `getTasks()` | Devuelve copia del array de tareas |
| `getLinks()` | Devuelve copia del array de links |
| `getColumns()` | Devuelve copia del array de columnas (con su estado `hidden`) |
| `setColumnVisible(field, visible)` | Muestra/oculta una columna en runtime (toggla `col.hidden` + re-render). Ideal para un selector de columnas en la toolbar |
| `saveBaseline()` | Toma la **línea base**: copia `start/end/progress` actuales a `baseline*` (dibuja la barra fantasma) y emite `onBaselineSave({tasks, baseline})` para persistir en el BE |
| `clearBaseline()` | Borra la línea base de todas las tareas (saca la barra fantasma). El consumer persiste el borrado por su cuenta |
| `setScale(scale)` | Cambia escala: `'day' \| 'week' \| 'month'` |
| `collapseAll()` | Colapsa todos los nodos padre |
| `expandAll()` | Expande todos los nodos padre |
| `undo()` | Deshace último comando |
| `redo()` | Rehace último comando |
| `reload()` | Re-invoca el dataSource |
| `getConfig()` | Contrato `MTS.DevPanel` — items de config (escala, editable, reorderable, editTask, rowHeight) con `apply` |
| `getCode()` | Contrato `MTS.DevPanel` — string JS del `new MTS.GanttChart(...)` según el estado actual |
| `destroy()` | Limpia DOM, listeners y estado |

---

## Variables CSS

```css
.mts-gantt {
  --mts-gantt-row-h:        36px;
  --mts-gantt-header-h:     48px;
  --mts-gantt-today-color:  var(--mts-color-danger);
  --mts-gantt-sel-bg:       var(--mts-color-primary-light);
  --mts-gantt-sel-border:   var(--mts-color-primary);
}
```

---

## Clases CSS principales

```
.mts-gantt                — contenedor raíz
.mts-gantt__split         — layout horizontal grid | gantt
.mts-gantt__grid-panel    — panel izquierdo (grid)
.mts-gantt__gantt-panel   — panel derecho (SVG Gantt)
.mts-gantt__tr            — fila del grid
.mts-gantt__tr--group     — fila de nodo padre WBS
.mts-gantt__tr--selected  — fila seleccionada
.mts-gantt__td            — celda del grid
.mts-gantt__bar           — barra SVG de tarea
.mts-gantt__bar--group    — barra de nodo padre
.mts-gantt__milestone     — diamante SVG (duración 0)
.mts-gantt__link          — flecha de dependencia
.mts-gantt__today-line    — línea vertical "Hoy"
```

---

## Conectar con MTS.Kanban via eventos

```js
function progressToColId(p) {
  return p === 1 ? 'done' : (p > 0 ? 'wip' : 'todo');
}

const gantt = new MTS.GanttChart('#gantt', { dataSource: fetchTasks });
let kanban = null, syncing = false;

gantt.onLoad(function(e) {
  kanban = new MTS.Kanban('#kanban', {
    columns: buildColumnsFromTasks(e.tasks),
    onCardMove: function(ev) {
      if (syncing) return;
      syncing = true;
      gantt.updateTask(ev.card.id, { progress: colIdToProgress(ev.toColId) });
      syncing = false;
    },
  });
});

gantt.onTaskChange(function(e) {
  if (!kanban || syncing || !e.fields.hasOwnProperty('progress')) return;
  syncing = true;
  kanban.moveCard(e.task.id, progressToColId(e.task.progress), 0);
  syncing = false;
});
```

---

## Changelog

### 2026-05-30 (19)
- **Cierre de baseline**: columna **Desvío** (`field:'variance'` → `fin real − fin plan` en días, color late/early/ontime
  con tokens), **tooltip** en la barra fantasma (`<title>` "Línea base: inicio – fin", i18n `baselineLabel`),
  método **`clearBaseline()`** + acción "Borrar línea base" en el menú (locale es/en/pt). Locale `ui.cols.variance`.

### 2026-05-30 (18)
- **Línea base (baseline)**: campos `baselineStart`/`baselineEnd`/`baselineProgress` por tarea → el Gantt dibuja
  una **barra fantasma** (gris, fina) bajo la barra real (token `--mts-text-muted`). Método **`saveBaseline()`**
  (copia el plan actual + emite `onBaselineSave({tasks, baseline})`). Evento `baselineSave`.
- **Demo**: líneas base de ejemplo en el seed, item "Guardar línea base" en el menú Edición, `onBaselineSave` → `apiSim('POST', '/api/projects/p1/baseline', …)`.
- **Nuevo doc** `matios-ui-gantt-chart-backend.md`: contrato completo FE↔BE para el dev backend (dataSource,
  Task shape, eventos→endpoints, baseline con 2 modelos de tabla + endpoint, import/export). Sección "Integración con backend" enlaza a él.

### 2026-05-30 (17)
- **`assignees` con `uid`**: forma `{ uid, name, avatar? }` — el `uid` identifica a la persona para el BE
  (el componente solo usa `name`/`avatar`; `uid` viaja en el dato). Doc en Task shape.
- **Integración con backend documentada**: nueva sección que mapea cada evento → llamada BE, aclarando que
  los payloads vienen listos para enviar (`assignees` con uid, `predecessors` con WBS, `fields` normalizados).
- **Demo**: helper `apiSim(method, path, payload)` que hace `console.log` del payload + lo escribe en el
  Activity Log; cableado a `onTaskAdd` (POST), `onTaskChange`/`onTaskMove`/`onTaskResize` (PATCH),
  `onTaskDelete` (DELETE), `onAssigneesChange` (PUT), `onReorder` (PUT reorder), export/import. Equipo con `uid`.
- **Token**: sombra del avatar `rgba(...)` → `var(--mts-shadow-xs)` (cumple la norma de tokens).

### 2026-05-30 (16)
- **Demo 100% locale** (norma nueva: locale obligatorio para todo componente). `matios-ui-gantt-chart-i18n.js`
  suma la sección `ui` (es/en/pt): menú del toolbar, columnas, modales, labels, placeholders, formatos. El
  `demo.html` lee todo de `MTS.getLocale()['MTS.GanttChart'].ui` — cero strings en duro (salvo el brand y el log de diagnóstico).

### 2026-05-30 (15)
- **Mostrar/ocultar columnas en runtime**: `col.hidden` por columna + métodos `getColumns()` y
  `setColumnVisible(field, visible)`. El render itera solo columnas visibles (`_visibleColumns()`).
- **Demo**: menú **"Columnas"** en el toolbar (`MTS.Menu`) con un check por columna; el nombre de la tarea
  queda siempre visible. Export (`_buildCSV`) sigue incluyendo todas las columnas.

### 2026-05-30 (14)
- **Editor por celda** — nuevo evento `onCellEdit({ task, field, column, anchorEl, updateTask })`. Con
  `editTask` + listener, el doble clic en una celda editable que **no** sea el nombre lo dispara (el nombre
  sigue abriendo el modal completo). El editor lo pone el dev, anclado a `anchorEl` (patrón: `MTS.Popover`).
- **Demo**: columna **Dependencias** (`predecessors`) + editores por celda con `MTS.Popover` anclado
  (dependencias→`MTS.TagInput`, fechas→`MTS.DatePicker`, avance→`MTS.Slider`). Las dependencias del modal
  completo pasaron de `CheckboxGroup` a **`MTS.TagInput`** (chips, no ocupa tanto alto). Todo con componentes existentes.

### 2026-05-30 (13)
- **i18n propio del componente**: nuevo `matios-ui-gantt-chart-i18n.js` (`es`/`en`/`pt` bajo `MTS.GanttChart`).
  Componente: helper `gT()` + método `_t()`, `defaultColumns()` con locale, y todos los strings en duro
  (meses, prefijo de semana, "Today", vacío, error, handle de reordenar) reemplazados con fallback. Ver sección **i18n**.
- **Lista (grid) rediseñada**: celda `%` como **mini-barra** de progreso (`.mts-gantt__pct`/`-fill`/`-num`),
  zebra en filas impares, filas de fase con acento lateral, avatares con sombra.
- **Demo** sin CSS satélite ni inline (utilidades + FormLayout): modal de alta/edición a 2 columnas
  (Responsables a la derecha), botón "+ Tarea" con ícono `add` + `size:'sm'`, layout full-page 100%.

### 2026-05-30 (12)
- **Demo consolidado**: `demo.html` ahora es un demo único self-contained (estilo `calendar/`) — página
  completa con toolbar (`MTS.Topbar`+`Menu`+`Button`) y el Gantt envuelto por **`MTS.DevPanel`** (paneles
  **Config · Log · Code**). Eliminada la carpeta `demos/` (era un launcher con iframes).
- **Contrato `MTS.DevPanel`**: el Gantt implementa `getConfig()` (escala/editable/reorderable/editTask/rowHeight
  con `apply`) y `getCode()` (string del constructor según el estado). El log se cablea desde los `onXxxx`
  a `dev.log(...)` (el Gantt usa `onXxxx`, no `.on(STRING)`, por eso no se auto-suscribe vía `events[]`).

### 2026-05-30 (11)
- Undo/redo también cubre **mover/redimensionar barras** en el gráfico (`taskMove`/`taskResize`): se hace
  `_pushHistory()` en el primer movimiento del drag. Ahora Ctrl+Z deshace en ambos paneles (grilla y gráfico).

### 2026-05-30 (10)
- **Undo/redo por snapshots** (reemplaza el CommandStack): cada mutación llama `_pushHistory()` (snapshot
  del estado, misma estructura que los datos) ANTES de cambiar. Ahora `undo`/`redo` cubren **todo**:
  agregar, editar, eliminar, **reordenar/anidar**, **asignar responsables** e importar. `undoLimit` configurable.
- **Fix scroll del gráfico**: el `svg { max-width:100% }` global de base aplastaba el SVG del gráfico → no
  desbordaba → sin scroll (la grilla son `<div>`, por eso esa sí). Override: `.mts-gantt__gantt-* svg { max-width:none }`.

### 2026-05-30 (9)
- Atajos de teclado **Ctrl+Z / Ctrl+Y** (y Ctrl+Shift+Z) para undo/redo cuando `editable`. El grid es
  focusable (`tabindex=0`); haz clic dentro del Gantt y usa el teclado. Ignora si el foco está en un input.

### 2026-05-30 (8)
- Fix: al agregar tarea sin `wbs`, `_normalizeCanonicalTask` asigna el **siguiente WBS de nivel superior**
  (antes usaba `_tasks.length+1`, que contaba subtareas).

### 2026-05-30 (7)
- "Guardar como" / "Abrir": `exportTasks(format, filename)` (+ `filename` en `onExport`), `importFile(file)`
  + evento `onImport({file, format, name})`, y `setTasks(input)` para cargar lo importado. CSV en el front;
  Excel/MS Project (MSPDI) los serializa/parsea el backend. demo_8: menú **Archivo** (Abrir/Guardar como),
  "Guardar como" con nombre (`MTS.Input`) + formato (`MTS.Select`), e import CSV roundtrip client-side.

### 2026-05-30 (6)
- Scroll horizontal en la grilla: `.mts-gantt__grid-body` pasa a `overflow:auto`, las filas llevan
  `min-width = suma de columnas` y el header sincroniza `scrollLeft` con el body. Si las columnas no
  entran en el panel, aparece scroll en vez de clipear. Scrollbars 6px → 10px (grid + gantt body).

### 2026-05-30 (5)
- `addTask.showButton: false` — el board no renderiza su botón (el dev lo pone, ej. en `MTS.Topbar`).
- Método `exportTasks(format)` + `_buildCSV` — emite `onExport({format, tasks, csv?})`. CSV client-side;
  Excel/MS Project los serializa el backend (modelo canónico, fase 2).
- demo_8 "Ejemplo completo": toolbar `MTS.Topbar` + `MTS.Menu` (Vista/WBS/Edición) + `MTS.Button`
  (+Tarea / Exportar), modal de exportación multi-formato (CSV/Excel/MSProject).

### 2026-05-30 (4)
- Opción `reorderable` + evento `onReorder`: drag & drop de filas para reordenar (hermano) y anidar
  (hija). La jerarquía vive en el `wbs` → al soltar se reconstruye el árbol, se mueve el nodo + subárbol
  y se renumera todo el WBS; re-render automático. Handle por fila + indicadores de drop
  (`--drop-before`/`--drop-after`/`--drop-into`). No crea/borra predecesores, pero los **remapea** al
  renumerar (WBS viejo → id → WBS nuevo) para que los vínculos sigan apuntando a la misma tarea. Demo: `demos/demo_7`.

### 2026-05-30 (3)
- Opción `editTask` + evento `onTaskEdit({ task, updateTask })`: doble clic en la fila abre el editor
  completo (modal del dev) con nombre, dependencias, responsables, fechas y avance (`MTS.Slider`).
  Con `editTask` activo se desactiva la edición inline de celdas. Demo: `demos/demo_6`.

### 2026-05-30 (2)
- Edición de asignados desde la celda: la celda `Asignados` es clickeable (cuando `editable`) y emite
  `onAssigneesClick({ task, assignees, setAssignees })`. El modal lo pone el dev; guarda con
  `e.setAssignees([...])`. Nuevo método `setAssignees(id, arr)` + evento `onAssigneesChange`. CSS
  `.mts-gantt__assignees--editable` / `.mts-gantt__assignees-add`. Demo: `demos/demo_5`.
- Recordatorio: nombre de tarea (doble clic, inline) y color (clic → ColorPicker) ya existían.

### 2026-05-30
- Feature `addTask` — botón "+ Agregar tarea" en toolbar + evento `onAddTask({data, resolve, reject})`.
  El modal lo provee el dev; el board cosecha por `name`/`id` (lógica propia) y normaliza
  canónico+alias → estructura interna. Nuevo método `submitAddTask()`. Demo: `demos/demo_4`.
- CSS: nueva regla `.mts-gantt__toolbar`.
- Antes el Gantt no tenía UI de alta (solo `.addTask()` programático).

### 2026-05-29
- **Breaking**: Renombrado `MTS.ProjectManager` → `MTS.GanttChart`
- **Breaking**: Archivos movidos a `widgets/boards/matios-ui-gantt-chart/`
- **Breaking**: API de eventos migrada de `.on(STRING)` → `.onXxxx(fn)` (via `MTS._defineEvents`)
- **Breaking**: CSS BEM renombrado `mts-project__*` → `mts-gantt__*`
- Dependencia: requiere `base/matios-ui-base.js` (`MTS._defineEvents`)
- `taskMove` y `taskResize` ya emitían separado — comportamiento conservado
- `innerHTML = ''` (clearing) documentado con comentarios `safe:`
- Sync Kanban built-in eliminado — patrón canonical via eventos (ver demo_3)
