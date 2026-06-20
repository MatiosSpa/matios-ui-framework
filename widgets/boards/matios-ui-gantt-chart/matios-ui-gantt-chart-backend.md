# MTS.GanttChart — Frontend ↔ Backend Contract

> For the **backend** developer. Defines what `MTS.GanttChart` consumes and emits, so the BE
> knows exactly **which endpoints to expose, what payloads it receives, and what shape it must return**.
>
> Principle: **the FE persists nothing.** The BE is the source of truth. The FE (1) requests the data
> (`dataSource`), (2) renders it, and (3) when the user performs an action, emits an `onXxxx` event with a
> payload ready to send to the BE. The consumer (the screen) is the one that does the `fetch`.
>
> Canonical domain model (aligned with MS Project): `internal-docs/spec_modelo-canonico-proyectos.md`.

---

## 1. Data loading — `dataSource`

The FE requests the tasks via `dataSource` (a function or `{url, method, headers, params}`). The BE must respond:

```jsonc
// GET /api/projects/:id/tasks   →
{
  "data":  [ /* Task[] */ ],
  "links": [ /* Link[] (optional, explicit dependencies) */ ]
}
```

---

## 2. Task shape (Task)

```jsonc
{
  "id":           "t4",                  // string, unique (PK)
  "wbs":          "1.3",                 // flat hierarchy by WBS ('1', '1.1', '1.1.1')
  "label":        "Validación",          // visible name
  "start":        "2025-01-20",          // 'YYYY-MM-DD'
  "end":          "2025-01-31",          // 'YYYY-MM-DD'
  "progress":     0.7,                   // 0..1
  "color":        "#3b82f6",             // optional
  "status":       "wip",                 // free-form
  "predecessors": ["1.2"],               // WBS of the dependencies (flat mode)
  "assignees":    [ { "uid": "u4", "name": "Carlos Ruiz", "avatar": "url?" } ],

  // — Baseline (snapshot of the plan). See §4 —
  "baselineStart":    "2025-01-20",
  "baselineEnd":      "2025-01-28",
  "baselineProgress": 0.0
}
```

**Notes for the BE:**
- **Hierarchy**: flat mode by `wbs` (recommended, used by the FE) **or** nested with `children: [...]`. Choose one.
- **`predecessors`**: reference **WBS** (not IDs) in flat mode. When reordering, the FE recomputes the WBS and remaps.
- **`assignees[].uid`**: the person's id in your DB (FK to users). `name` is for display, `avatar` is optional.
- Fields prefixed with `_` that you may see in the FE (`_level`, `_startTs`, etc.) are **derived** — do NOT persist them.

### Link (optional — explicit dependencies with a type)
```jsonc
{ "id": "l1", "from": "t1", "to": "t2", "type": "FS", "lag": 0 }   // FS | FF | SS | SF
```

### Suggested DDL (PostgreSQL)
```sql
CREATE TABLE task (
  id           text PRIMARY KEY,
  project_id   text NOT NULL REFERENCES project(id),
  wbs          text NOT NULL,            -- '1', '1.1', '1.1.1' (hierarchy + order)
  label        text NOT NULL,
  start        date,
  "end"        date,
  progress     numeric DEFAULT 0,        -- 0..1
  color        text,
  status       text,
  predecessors jsonb DEFAULT '[]',       -- WBS of dependencies
  -- baseline (§4, model A):
  baseline_start    date,
  baseline_end      date,
  baseline_progress numeric,
  baseline_set_at   timestamptz,
  extras       jsonb DEFAULT '{}'
);
CREATE TABLE task_assignee (             -- N:M task ↔ user
  task_id text REFERENCES task(id),
  uid     text REFERENCES app_user(uid),
  PRIMARY KEY (task_id, uid)
);
CREATE TABLE task_link (                 -- explicit dependencies (optional)
  id   text PRIMARY KEY,
  from_id text REFERENCES task(id),
  to_id   text REFERENCES task(id),
  type text DEFAULT 'FS',               -- FS|FF|SS|SF
  lag  int DEFAULT 0
);
```

---

## 3. FE events → BE endpoints

Each user action emits an event with the payload already prepared. Suggested mapping:

| FE event | Suggested endpoint | Body the BE receives |
|-----------|-------------------|------------------------|
| `onTaskAdd` | `POST /api/tasks` | the **full task** that was created (with `assignees[].uid`, `predecessors` WBS) |
| `onTaskChange` | `PATCH /api/tasks/:id` | **only the fields that changed** (`fields`) |
| `onTaskMove` / `onTaskResize` | `PATCH /api/tasks/:id` | `{ start, end }` (when the bar is dropped) |
| `onTaskDelete` | `DELETE /api/tasks/:id` | `{ id }` (deletes the task and its WBS children) |
| `onAssigneesChange` | `PUT /api/tasks/:id/assignees` | `[{ uid, name }]` |
| `onReorder` | `PUT /api/tasks/reorder` | new order + WBS of ALL the tasks |
| `onBaselineSave` | `POST /api/projects/:id/baseline` | snapshot of the plan (see §4) |
| `onExport` / `onImport` | `POST /api/projects/:id/export\|import` | tasks / file (see §5) |

### Payload examples

```jsonc
// onTaskAdd  →  POST /api/tasks
{ "id":"t20", "wbs":"6", "label":"Capacitación", "start":"2025-07-01", "end":"2025-07-10",
  "progress":0, "predecessors":["5"], "assignees":[{ "uid":"u1", "name":"Ana García" }] }

// onTaskChange  →  PATCH /api/tasks/t4
{ "end":"2025-02-04", "progress":0.8 }            // only what changed

// onReorder  →  PUT /api/tasks/reorder
{ "moved":"t12", "mode":"into", "target":"t10",
  "order":[ { "id":"t1","wbs":"1","predecessors":[] },
            { "id":"t2","wbs":"1.1","predecessors":["1"] }, /* ...all of them... */ ] }
```

---

## 4. Baseline — the "snapshot" of the plan

The baseline is a **frozen snapshot of the schedule** (planned dates) taken at a point in time. It is used to
compare **plan vs actual** (variance). It is persisted in the DB (it is the source of truth); the FE only triggers and draws it.

### How to store it in the DB — 2 models

**Model A — columns in the `task` table itself (recommended to start; 1 baseline):**
```sql
ALTER TABLE task ADD COLUMN baseline_start    date;
ALTER TABLE task ADD COLUMN baseline_end      date;
ALTER TABLE task ADD COLUMN baseline_progress numeric;   -- optional
ALTER TABLE task ADD COLUMN baseline_set_at   timestamptz;
```
When it receives `POST /baseline`, the BE copies the current `start/end/progress` into the `baseline_*` columns and stamps `baseline_set_at`. Immutable until re-taken.

**Model B — separate table (multiple baselines / history, MS Project B0..B10 style):**
```sql
project_baseline( id PK, project_id FK, name, created_at, created_by )
baseline_task   ( baseline_id FK, task_id FK, start, end, progress )   -- frozen detail
```

### Endpoint
```jsonc
// onBaselineSave  →  POST /api/projects/:id/baseline
{ "baseline": [
    { "id":"t1", "start":"2025-01-06", "end":"2025-01-31", "progress":0 },
    { "id":"t4", "start":"2025-01-20", "end":"2025-01-28", "progress":0 }
    /* ...one entry per task... */
] }
```
The FE sends the snapshot it sees (immediate reflection). The BE can take it as-is, or re-freeze from its own
data (safer against discrepancies). Response: `200 OK`.

### How it comes back and is drawn
In the `GET` of tasks, each Task includes `baselineStart` / `baselineEnd` (and optionally `baselineProgress`).
The FE draws a **thin ghost bar (gray) below the actual bar** between those dates; the gap is the variance.
If the task does **not** carry `baseline*`, nothing is drawn (the feature is optional per task).

> Variance: it is **computed and shown by the FE** (the "Variance" column = `end − baselineEnd` in days, + = delay). The BE
> does NOT need to persist it (it is derived). If you want to expose it for server-side reports, that is optional.

---

## 5. Import / Export (known formats)

- **CSV**: resolved 100% in the FE (does not require the BE).
- **Excel (.xlsx)** and **MS Project (MSPDI .xml)**: the BE serializes/parses against the **canonical model**
  (adapters `fromMSProject` / `toMSProject`, etc. — phase 2, `matios-platform-projects`).

```jsonc
// onExport (non-CSV)  →  POST /api/projects/:id/export?format=msproject
{ "filename":"proyecto.xml", "tasks":[ /* Task[] */ ] }      // the BE returns the file

// onImport (non-CSV)  →  POST /api/projects/:id/import?format=excel
// multipart with the file → the BE responds { data: Task[], links?: Link[] } (same shape as §1)
```

---

## 6. Cross-cutting conventions (apply to all 3 boards)

**Auth / headers.** The `dataSource` accepts `{ headers }`; send the token there (`Authorization: Bearer …`).
The mutation `fetch` calls (POST/PATCH/DELETE/PUT) are made by the consumer → add the same headers to them.

**`id` generation and reconciliation.** If the user creates a task, the FE assigns it a temporary id (`t-<ts>`).
The BE should respond to the `POST` with the **canonical id**; the consumer replaces the temporary one (`updateTask`) to
keep consistency (predecessors reference WBS, not id, so they don't break). If your DB accepts the FE's id, return the same one.

**Optimistic UI + rollback.** The FE applies the change on screen instantly (and supports local undo/redo) and then
emits the event. If the `fetch` fails, the consumer must **revert** (`reload()` from the `dataSource`, or `undo()`).
The component does not roll back against the BE on its own.

**Error handling.** On load, an error → **`onError({ error })`**. On mutations, the consumer handles the `.catch`.
Suggested shape of the BE error:
```jsonc
{ "error": { "code": "VALIDATION", "message": "End date < start date", "fields": { "end": "invalid" } } }
```

**Minimum validations (server-side, do not rely on the FE alone).**
- `label` not empty; `end >= start`; `progress ∈ [0,1]`; `wbs` unique per project and well-formed.
- `predecessors` reference existing WBS; no cycles. `baselineEnd >= baselineStart`.

**Status codes.** `200` (update ok), `201` (created + id), `204` (deleted), `409` (WBS/order conflict),
`422` (validation). The consumer reacts according to the code.

---

## Summary for the BE
1. Expose `GET /tasks` with `{ data, links? }` and the Task from §2 (include `baseline*` and `assignees[].uid`).
2. Implement the endpoints from §3 (POST/PATCH/DELETE/PUT) with the indicated payloads.
3. For baseline: `baseline_*` columns (model A) + `POST /baseline`, and return those fields in the GET.
4. For Excel/MSProject: adapters against the canonical model.
5. `id` reconciliation, optimistic UI, errors and validations → §6.
