# MTS.GanttChart — Contrato Frontend ↔ Backend

> Para el desarrollador **backend**. Define qué consume y qué emite `MTS.GanttChart`, para que el BE
> sepa exactamente **qué endpoints exponer, qué payloads recibe y qué forma debe devolver**.
>
> Principio: **el FE no persiste nada.** El BE es la fuente de verdad. El FE (1) pide los datos
> (`dataSource`), (2) los dibuja, y (3) cuando el usuario hace una acción, emite un evento `onXxxx` con un
> payload listo para mandar al BE. El consumer (la pantalla) es quien hace el `fetch`.
>
> Modelo canónico de dominio (alineado a MS Project): `internal-docs/spec_modelo-canonico-proyectos.md`.

---

## 1. Carga de datos — `dataSource`

El FE pide las tareas vía `dataSource` (función o `{url, method, headers, params}`). El BE debe responder:

```jsonc
// GET /api/projects/:id/tasks   →
{
  "data":  [ /* Task[] */ ],
  "links": [ /* Link[] (opcional, dependencias explícitas) */ ]
}
```

---

## 2. Forma de la tarea (Task)

```jsonc
{
  "id":           "t4",                  // string, único (PK)
  "wbs":          "1.3",                 // jerarquía plana por WBS ('1', '1.1', '1.1.1')
  "label":        "Validación",          // nombre visible
  "start":        "2025-01-20",          // 'YYYY-MM-DD'
  "end":          "2025-01-31",          // 'YYYY-MM-DD'
  "progress":     0.7,                   // 0..1
  "color":        "#3b82f6",             // opcional
  "status":       "wip",                 // libre
  "predecessors": ["1.2"],               // WBS de las dependencias (modo plano)
  "assignees":    [ { "uid": "u4", "name": "Carlos Ruiz", "avatar": "url?" } ],

  // — Línea base (foto del plan). Ver §4 —
  "baselineStart":    "2025-01-20",
  "baselineEnd":      "2025-01-28",
  "baselineProgress": 0.0
}
```

**Notas para el BE:**
- **Jerarquía**: modo plano por `wbs` (recomendado, lo usa el FE) **o** anidado con `children: [...]`. Elegir uno.
- **`predecessors`**: referencian **WBS** (no IDs) en modo plano. Al reordenar, el FE recalcula WBS y remapea.
- **`assignees[].uid`**: id de la persona en tu BD (FK a usuarios). `name` es display, `avatar` opcional.
- Campos con prefijo `_` que veas en el FE (`_level`, `_startTs`, etc.) son **derivados** — NO los persistas.

### Link (opcional — dependencias explícitas con tipo)
```jsonc
{ "id": "l1", "from": "t1", "to": "t2", "type": "FS", "lag": 0 }   // FS | FF | SS | SF
```

### DDL sugerido (PostgreSQL)
```sql
CREATE TABLE task (
  id           text PRIMARY KEY,
  project_id   text NOT NULL REFERENCES project(id),
  wbs          text NOT NULL,            -- '1', '1.1', '1.1.1' (jerarquía + orden)
  label        text NOT NULL,
  start        date,
  "end"        date,
  progress     numeric DEFAULT 0,        -- 0..1
  color        text,
  status       text,
  predecessors jsonb DEFAULT '[]',       -- WBS de dependencias
  -- línea base (§4, modelo A):
  baseline_start    date,
  baseline_end      date,
  baseline_progress numeric,
  baseline_set_at   timestamptz,
  extras       jsonb DEFAULT '{}'
);
CREATE TABLE task_assignee (             -- N:M tarea ↔ usuario
  task_id text REFERENCES task(id),
  uid     text REFERENCES app_user(uid),
  PRIMARY KEY (task_id, uid)
);
CREATE TABLE task_link (                 -- dependencias explícitas (opcional)
  id   text PRIMARY KEY,
  from_id text REFERENCES task(id),
  to_id   text REFERENCES task(id),
  type text DEFAULT 'FS',               -- FS|FF|SS|SF
  lag  int DEFAULT 0
);
```

---

## 3. Eventos del FE → endpoints del BE

Cada acción del usuario emite un evento con el payload ya listo. Mapeo sugerido:

| Evento FE | Endpoint sugerido | Body que recibe el BE |
|-----------|-------------------|------------------------|
| `onTaskAdd` | `POST /api/tasks` | la **tarea completa** creada (con `assignees[].uid`, `predecessors` WBS) |
| `onTaskChange` | `PATCH /api/tasks/:id` | **solo los campos que cambiaron** (`fields`) |
| `onTaskMove` / `onTaskResize` | `PATCH /api/tasks/:id` | `{ start, end }` (al soltar la barra) |
| `onTaskDelete` | `DELETE /api/tasks/:id` | `{ id }` (borra la tarea y sus hijas WBS) |
| `onAssigneesChange` | `PUT /api/tasks/:id/assignees` | `[{ uid, name }]` |
| `onReorder` | `PUT /api/tasks/reorder` | orden + WBS nuevo de TODAS las tareas |
| `onBaselineSave` | `POST /api/projects/:id/baseline` | snapshot del plan (ver §4) |
| `onExport` / `onImport` | `POST /api/projects/:id/export\|import` | tareas / archivo (ver §5) |

### Ejemplos de payload

```jsonc
// onTaskAdd  →  POST /api/tasks
{ "id":"t20", "wbs":"6", "label":"Capacitación", "start":"2025-07-01", "end":"2025-07-10",
  "progress":0, "predecessors":["5"], "assignees":[{ "uid":"u1", "name":"Ana García" }] }

// onTaskChange  →  PATCH /api/tasks/t4
{ "end":"2025-02-04", "progress":0.8 }            // solo lo que cambió

// onReorder  →  PUT /api/tasks/reorder
{ "moved":"t12", "mode":"into", "target":"t10",
  "order":[ { "id":"t1","wbs":"1","predecessors":[] },
            { "id":"t2","wbs":"1.1","predecessors":["1"] }, /* ...todas... */ ] }
```

---

## 4. Línea base (baseline) — la "foto" del plan

La línea base es una **foto congelada del cronograma** (fechas planificadas) tomada en un momento. Sirve para
comparar **plan vs real** (desvío). Se persiste en la BD (es la fuente de verdad); el FE solo la dispara y la dibuja.

### Cómo guardarla en la BD — 2 modelos

**Modelo A — columnas en la propia tabla `task` (recomendado para empezar; 1 línea base):**
```sql
ALTER TABLE task ADD COLUMN baseline_start    date;
ALTER TABLE task ADD COLUMN baseline_end      date;
ALTER TABLE task ADD COLUMN baseline_progress numeric;   -- opcional
ALTER TABLE task ADD COLUMN baseline_set_at   timestamptz;
```
Al recibir `POST /baseline`, el BE copia `start/end/progress` actuales a las columnas `baseline_*` y sella `baseline_set_at`. Inmutables hasta re-tomar.

**Modelo B — tabla aparte (múltiples líneas base / historial, estilo MS Project B0..B10):**
```sql
project_baseline( id PK, project_id FK, name, created_at, created_by )
baseline_task   ( baseline_id FK, task_id FK, start, end, progress )   -- detalle congelado
```

### Endpoint
```jsonc
// onBaselineSave  →  POST /api/projects/:id/baseline
{ "baseline": [
    { "id":"t1", "start":"2025-01-06", "end":"2025-01-31", "progress":0 },
    { "id":"t4", "start":"2025-01-20", "end":"2025-01-28", "progress":0 }
    /* ...una entrada por tarea... */
] }
```
El FE manda el snapshot que ve (reflejo inmediato). El BE puede tomarlo tal cual, o re-congelar desde su propia
data (más seguro ante discrepancias). Respuesta: `200 OK`.

### Cómo vuelve y se dibuja
En el `GET` de tareas, cada Task incluye `baselineStart` / `baselineEnd` (y opcional `baselineProgress`).
El FE dibuja una **barra fantasma fina (gris) bajo la barra real** entre esas fechas; la separación es el desvío.
Si la tarea **no** trae `baseline*`, no se dibuja nada (la feature es opcional por tarea).

> Desvío: lo **calcula y muestra el FE** (columna "Desvío" = `end − baselineEnd` en días, + = atraso). El BE
> NO necesita persistirlo (es derivado). Si querés exponerlo para reportes server-side, es opcional.

---

## 5. Importar / Exportar (formatos conocidos)

- **CSV**: se resuelve 100% en el FE (no requiere BE).
- **Excel (.xlsx)** y **MS Project (MSPDI .xml)**: el BE serializa/parsea contra el **modelo canónico**
  (adapters `fromMSProject` / `toMSProject`, etc. — fase 2, `matios-platform-projects`).

```jsonc
// onExport (no-CSV)  →  POST /api/projects/:id/export?format=msproject
{ "filename":"proyecto.xml", "tasks":[ /* Task[] */ ] }      // el BE devuelve el archivo

// onImport (no-CSV)  →  POST /api/projects/:id/import?format=excel
// multipart con el archivo → el BE responde { data: Task[], links?: Link[] } (mismo shape que §1)
```

---

## 6. Convenciones transversales (aplican a los 3 boards)

**Auth / headers.** El `dataSource` acepta `{ headers }`; mandá ahí el token (`Authorization: Bearer …`).
Los `fetch` de las mutaciones (POST/PATCH/DELETE/PUT) los hace el consumer → agregale los mismos headers.

**Generación y reconciliación de `id`.** Si el usuario crea una tarea, el FE le pone un id temporal (`t-<ts>`).
El BE debería responder al `POST` con el **id canónico**; el consumer reemplaza el temporal (`updateTask`) para
mantener coherencia (predecesores referencian WBS, no id, así que no se rompen). Si tu BD acepta el id del FE, devolvé el mismo.

**UI optimista + rollback.** El FE aplica el cambio en pantalla al instante (y soporta undo/redo local) y luego
emite el evento. Si el `fetch` falla, el consumer debe **revertir** (`reload()` desde el `dataSource`, o `undo()`).
El componente no hace rollback contra el BE solo.

**Manejo de errores.** En la carga, error → **`onError({ error })`**. En mutaciones, el consumer maneja el `.catch`.
Forma sugerida del error del BE:
```jsonc
{ "error": { "code": "VALIDATION", "message": "Fecha fin < fecha inicio", "fields": { "end": "inválida" } } }
```

**Validaciones mínimas (server-side, no confíes solo en el FE).**
- `label` no vacío; `end >= start`; `progress ∈ [0,1]`; `wbs` único por proyecto y bien formado.
- `predecessors` referencian WBS existentes; sin ciclos. `baselineEnd >= baselineStart`.

**Códigos de estado.** `200` (update ok), `201` (created + id), `204` (deleted), `409` (conflicto WBS/orden),
`422` (validación). El consumer reacciona según el código.

---

## Resumen para el BE
1. Exponer `GET /tasks` con `{ data, links? }` y la Task de §2 (incluí `baseline*` y `assignees[].uid`).
2. Implementar los endpoints de §3 (POST/PATCH/DELETE/PUT) con los payloads indicados.
3. Para baseline: columnas `baseline_*` (modelo A) + `POST /baseline`, y devolver esos campos en el GET.
4. Para Excel/MSProject: adapters contra el modelo canónico.
5. Reconciliación de `id`, UI optimista, errores y validaciones → §6.
