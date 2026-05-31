# MTS.Kanban

Tablero Kanban con drag & drop entre columnas, WIP limits, prioridades, asignados y formulario de agregar tarjeta inline.

---

## Instalación

```html
<link rel="stylesheet" href="base/matios-ui-base.css">
<link rel="stylesheet" href="widgets/boards/matios-ui-kanban/matios-ui-kanban.css">

<script src="base/matios-ui-base.js"></script>
<script src="widgets/boards/matios-ui-kanban/matios-ui-kanban.js"></script>
```

---

## Uso básico

```html
<div id="kanban"></div>
```

```js
const kanban = new MTS.Kanban('#kanban', {
  columns: [
    { id: 'todo', title: 'To Do', cards: [
      { id: 'c1', title: 'Configurar CI/CD', priority: 'high', tags: ['devops'] },
    ]},
    { id: 'wip',  title: 'En Curso', wip: 3, cards: [] },
    { id: 'done', title: 'Done',             cards: [] },
  ],
  onCardMove: function(e) {
    console.log(e.card.title, e.fromColId, '→', e.toColId);
  },
});
```

---

## Opciones

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `columns` | `Column[]` | `[]` | Columnas del tablero con sus tarjetas |
| `addCards` | `boolean` | `false` | Muestra botón "Agregar tarjeta" inline en cada columna |
| `addTask` | `object` | — | Activa toolbar con botón "+ Agregar tarea". El **modal lo pone el dev** (ver abajo). `showButton:false` = el dev pone su propio botón y confirma con `submitAddTask()` |
| `editColumns` | `boolean` | `false` | Gestión de columnas en vivo: renombrar (doble clic en el título), borrar (× en el header) y un tile **"+ Columna"** al final. Emite `columnAdd`/`columnRemove`/`columnChange` |
| `dataSource` | `fn(query) => Promise<{columns, cards}>` | — | Carga async de datos |
| `onSearchAssignee` | `fn(q) => items[]` | — | Búsqueda async de usuarios para el formulario |
| `onLoad` | `fn` | — | Constructor handler |
| `onCardAdd` | `fn` | — | Constructor handler |
| `onCardChange` | `fn` | — | Constructor handler |
| `onCardMove` | `fn` | — | Constructor handler (antes `onMove`) |
| `onCardDelete` | `fn` | — | Constructor handler |
| `onCardClick` | `fn` | — | Constructor handler |
| `onColumnChange` | `fn` | — | Constructor handler |
| `onAddTask` | `fn` | — | Constructor handler (request del modal del dev) |

### `addTask` — alta con modal del dev

El componente aporta una toolbar con el botón y la cosecha; el modal es del dev (un `MTS.Modal`).

```js
addTask: {
  label: '+ Agregar tarea',           // opcional
  form:  '#mi-form',                   // contenedor a cosechar (o `modal:`)
  open:  function () { miModal.show(); },
  close: function () { miModal.hide(); },
  map:   function (data) { return data; },  // opcional
}
```

Flujo: clic → `open()` → el dev confirma con `kanban.submitAddTask()` (o `[data-mts-addtask-submit]`) →
cosecha por `name`/`id` → `onAddTask({ data, resolve, reject })`. `resolve()` normaliza canónico (estilo Trello)
+ alias → card e inserta en la columna (`columnId`/`idList`, o la primera). Alias: `name`/`title`→`title` ·
`desc`/`description` · `idList`/`columnId` · `labels`/`tags` · `members`/`assignee`. No reconocidos → `card.extras`.

> Activar `addTask` agrega una toolbar arriba de las columnas (clase `mts-kanban--has-toolbar`).
> Sin `addTask`, la estructura del tablero no cambia (retrocompat — incluido el Kanban embebido en SprintBoard).

### Column shape

```js
{
  id:    'backlog',
  title: 'Backlog',
  color: '#3b82f6',    // accent del header
  wip:   5,            // límite — muestra badge rojo si se supera
  cards: [...]
}
```

### Card shape

```js
{
  id:          'card-1',
  title:       'Configurar CI/CD',
  description: 'Texto libre...',
  priority:    'low' | 'medium' | 'high' | 'critical',
  tags:        ['devops', 'backend'],
  assignee:    'Ana Torres',       // nombre — se muestra como initiales
  dueDate:     'Dec 15'            // texto libre
}
```

---

## Eventos

Todos los métodos `onXxxx` devuelven un `dispose()` para unsubscribe.

| Método | Payload | Cuándo |
|---|---|---|
| `onLoad(fn)` | `{columns}` | DataSource resuelto |
| `onAddTask(fn)` | `{data, resolve, reject}` | Confirmación del modal del dev (cosecha cruda). `resolve()` inserta, `reject()` cancela |
| `onCardAdd(fn)` | `{card, colId}` | Nueva tarjeta ya insertada (via `onAddTask`→resolve, inline o `.addCard()`) |
| `onCardChange(fn)` | `{card, fields}` | Campos de tarjeta actualizados via `updateCard()` |
| `onCardMove(fn)` | `{card, fromColId, toColId, position, newIndex}` | Tarjeta arrastrada entre columnas |
| `onCardDelete(fn)` | `{card, colId}` | Tarjeta eliminada via `removeCard()` |
| `onCardClick(fn)` | `{card, colId}` | Click en tarjeta |
| `onColumnAdd(fn)` | `{column, index}` | Columna agregada (`addColumn()` / tile "+ Columna") |
| `onColumnRemove(fn)` | `{column}` | Columna eliminada (`removeColumn()` / × del header) |
| `onColumnChange(fn)` | `{column, fields}` | Columna renombrada (`renameColumn()` / doble clic en el título) |

```js
// Suscribirse con dispose
const dispose = kanban.onCardMove(function(e) {
  console.log(e.card.title, e.fromColId, '→', e.toColId);
});
dispose(); // unsubscribe

// Constructor handler (atajo)
new MTS.Kanban('#board', {
  onCardMove: function(e) { ... }
});
```

**Nota:** Los eventos DOM `mts:kanban:card-move`, `mts:kanban:card-add`, etc. siguen funcionando para integración externa.

---

## API pública

| Método | Descripción |
|---|---|
| `addCard(colId, card)` | Agrega tarjeta a una columna |
| `submitAddTask()` | Cosecha el form del modal del dev y dispara `onAddTask` (lo llama el botón confirmar). Solo con la opción `addTask` |
| `updateCard(id, fields)` | Actualiza campos de una tarjeta; emite `onCardChange` |
| `moveCard(cardId, toColId, idx?)` | Mueve tarjeta; idx = posición destino (default 0) |
| `removeCard(cardId)` | Elimina tarjeta; emite `onCardDelete` |
| `setColumns(cols)` | Reemplaza TODAS las columnas y reconstruye |
| `addColumn(col, index?)` | Agrega una columna (autogenera `id`/`cards` si faltan); emite `onColumnAdd` |
| `removeColumn(id)` | Elimina una columna; emite `onColumnRemove` |
| `renameColumn(id, title)` | Renombra una columna; emite `onColumnChange` |
| `reload()` | Re-invoca dataSource o reconstruye |
| `destroy()` | Limpia DOM y listeners |

---

## Variables CSS

El tablero hereda los tokens del framework (`--mts-bg-surface`, `--mts-color-primary`, etc.). No hay tokens propios que sobreescribir en la mayoría de los casos.

---

## Changelog

### 2026-05-31 — Demo consolidado + DevPanel + i18n + integración BE
- **i18n propio** `matios-ui-kanban-i18n.js` (es/en/pt, namespace `MTS.Kanban`) + método `_t()`. Todos los
  strings internos del componente (toolbar, form inline, prioridades, "Buscando…", "Sin resultados", placeholders)
  pasan por `_t()` con fallback.
- **Contrato `MTS.DevPanel`**: `getConfig()` (toggle `addCards`) + `getCode()`.
- **`addTask.showButton: false`**: el dev pone su propio botón (toolbar/Topbar) y confirma con `submitAddTask()`
  (igual que el Gantt). Sin la opción el tablero no cambia.
- **Demo único** `demo.html` (estilo Gantt/calendar): board envuelto en **`MTS.DevPanel`** (Config·Log·Code),
  Topbar + botón "+ Tarjeta", **carga async** (dataSource con `setTimeout`), modal único alta/edición (Input/Select),
  **eventos → `apiSim`** (console.log + Activity Log): `onCardAdd`→POST, `onCardChange`→PATCH, `onCardMove`→PATCH,
  `onCardDelete`→DELETE, `onColumnChange`→PATCH; `onCardClick`→abre edición. **100% locale, sin CSS satélite.**
  Carpeta `demos/` eliminada.
- **Gestión de columnas dinámica** (opción `editColumns`): métodos `addColumn`/`removeColumn`/`renameColumn`
  + eventos `columnAdd`/`columnRemove`/`columnChange`. UI: tile **"+ Columna"**, renombrar (doble clic en el
  título) y borrar (× en el header). Demo: cableado a `apiSim` (`POST`/`DELETE`/`PATCH /api/columns`). Las columnas
  siempre fueron dinámicas (vía `columns`/`dataSource`/`setColumns`); esto agrega la gestión granular + UI.

### 2026-05-30
- Feature `addTask` — toolbar con botón "+ Agregar tarea" + evento `onAddTask({data, resolve, reject})`.
  Modal del dev; cosecha por `name`/`id`; `_normalizeCanonicalCard` (Trello+alias → card, `extras`); `submitAddTask()`.
  Estructura guardada tras `addTask` (`mts-kanban--has-toolbar` + `__cols`); sin `addTask` el DOM no cambia
  (retrocompat, incl. Kanban embebido en SprintBoard). Demo: `demos/demo_4`. Lógica propia del componente (sin dependencias de `base/` salvo `_defineEvents`).

### 2026-05-29
- **Breaking**: Archivos movidos a `widgets/boards/matios-ui-kanban/`
- **Breaking**: `onMove` → `onCardMove` (API explícita via `MTS._defineEvents`)
- **Breaking**: handlers reciben payload directo (no envuelto en `{type, detail}`)
- Nuevos eventos: `onLoad`, `onCardChange`, `onCardDelete`, `onColumnChange`
- Nuevos métodos: `updateCard(id, fields)`, `reload()`
- DOM events conservados para backward compat (`mts:kanban:card-move`, etc.)
- Dependencia: requiere `base/matios-ui-base.js`
- CSS: `assigneeDropdown` z-index migrado a `var(--mts-z-popover)`
- Arrow functions eliminadas de `_getDragAfterEl`, `_syncClasses`, callbacks DOM
- `innerHTML` auditado: solo clearing y literals — `// safe:` comentados
