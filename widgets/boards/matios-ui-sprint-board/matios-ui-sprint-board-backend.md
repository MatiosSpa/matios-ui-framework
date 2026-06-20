# MTS.SprintBoard — Contrato Frontend ↔ Backend

> Para el desarrollador **backend**. Define qué consume y qué emite `MTS.SprintBoard`, para que el BE
> sepa exactamente **qué endpoints exponer, qué payloads recibe y qué forma debe devolver**.
>
> Principio: **el FE no persiste nada.** El BE es la fuente de verdad. El FE (1) pide los datos
> (`dataSource`), (2) los dibuja (Backlog ↔ Sprint), y (3) cuando el usuario hace una acción (crear/editar/
> mover/borrar historia, iniciar/cerrar sprint) emite un evento `onXxxx` con un payload **listo para el BE**.
> El consumer (la pantalla) es quien hace el `fetch`.
>
> Modelo canónico de dominio (alineado a **Jira**): `_claude_summary/spec_modelo-canonico-proyectos.md`.
> Convenciones transversales (auth, errores, UI optimista, ids) → §6.

---

## 1. Carga de datos — `dataSource`

El FE pide los datos vía `dataSource` (`fn(query) => Promise` o `{url, method, headers, params}`). El BE responde:

```jsonc
// GET /api/projects/:id/sprintboard   →
{
  "stories": [ /* Story[] */ ],   // backlog + las del sprint (se distinguen por sprintId/status)
  "sprints": [ /* Sprint[] */ ]   // el sprint activo se detecta por status:'active'
}
```

- `query`: filtros/auth (`{ params, headers }`, ver §6).
- En error, el componente emite **`onError({ error })`** (a diferencia del Kanban). Forma del error en §6.
- El **sprint actual** se autodetecta como el primero con `status:'active'` (o se fija con `currentSprintId`).

---

## 2. Formas (Story / Sprint)

### Story (canónico Jira + alias)
| Campo | Tipo | Req | Notas |
|-------|------|-----|-------|
| `id` | string | ✔ | PK. Sin id → el FE autogenera `s-<ts>` y el BE devuelve el canónico (§6) |
| `code` | string | — | Clave visible tipo `PRJ-42`. Acepta alias `key` (Jira) |
| `title` | string | ✔ | Acepta alias `summary` (Jira) |
| `description` | string | — | |
| `type` | string | — | `userstory` \| `task` \| `bug` \| `epic` \| `spike`. Acepta alias `issuetype`. Default `userstory` |
| `storyPoints` | number | — | Estimación (escala Fibonacci 1,2,3,5,8,13,21) |
| `priority` | string | — | `low` \| `medium` \| `high` \| `critical`. Default `medium` |
| `status` | string | — | Columna del sprint: `todo` \| `wip` \| `done` (null = en backlog) |
| `sprintId` | string | — | Sprint al que pertenece (null = backlog) |
| `assignees` | object[] | — | `[{ uid, name, avatar? }]`. Acepta `assignee` (string) → lo envuelve |
| `tags` | string[] | — | Etiquetas |
| `extras` | object | — | Campos no reconocidos (round-trip) |

### Sprint
| Campo | Tipo | Req | Notas |
|-------|------|-----|-------|
| `id` | string | ✔ | PK |
| `number` | number | — | Nº de sprint (display) |
| `name` | string | — | Ej. `Sprint 7` |
| `goal` | string | — | Objetivo del sprint (se muestra junto al nombre) |
| `startDate` / `endDate` | string | — | `'YYYY-MM-DD'` |
| `status` | string | ✔ | `planning` \| `active` \| `completed` (el `active` se muestra; `planning` habilita "Iniciar") |
| `capacity` | number | — | Capacidad en SP (para la barra de velocity) |
| `committed` | number | — | SP comprometidos (denominador de la barra; cae a `capacity` si falta) |

### DDL sugerido (PostgreSQL)
```sql
CREATE TABLE sprint (
  id        text PRIMARY KEY,
  project_id text NOT NULL REFERENCES project(id),
  number    int,
  name      text,
  goal      text,
  start_date date,
  end_date   date,
  status    text NOT NULL,         -- planning|active|completed
  capacity  int,
  committed int
);
CREATE TABLE story (
  id           text PRIMARY KEY,
  project_id   text NOT NULL REFERENCES project(id),
  code         text,               -- PRJ-42
  title        text NOT NULL,
  description  text,
  type         text DEFAULT 'userstory',
  story_points int,
  priority     text DEFAULT 'medium',
  status       text,               -- todo|wip|done | null (backlog)
  sprint_id    text REFERENCES sprint(id),  -- null = backlog
  tags         jsonb DEFAULT '[]',
  extras       jsonb DEFAULT '{}'
);
CREATE TABLE story_assignee (             -- N:M historia ↔ usuario
  story_id text REFERENCES story(id),
  uid      text REFERENCES app_user(uid),
  PRIMARY KEY (story_id, uid)
);
```

---

## 3. Eventos del FE → endpoints del BE

| Evento FE | Endpoint sugerido | Body | Respuesta |
|-----------|-------------------|------|-----------|
| `onStoryAdd` | `POST /api/stories` | la **historia completa** creada (con `assignees[].uid`, `type`, `storyPoints`, `_location`) | `201` + `{ id }` |
| `onStoryChange` | `PATCH /api/stories/:id` | **solo los campos que cambiaron** (`fields`) | `200` |
| `onStoryMove` | `PATCH /api/stories/:id` | `{ from, to }` (origen/destino: backlog ↔ sprint+columna) | `200` |
| `onStoryDelete` | `DELETE /api/stories/:id` | `{ id }` | `204` |
| `onSprintStart` | `POST /api/sprints/:id/start` | `{ id }` | `200` (status → `active`) |
| `onSprintComplete` | `POST /api/sprints/:id/complete` | `{ done, pending }` (conteos) | `200` (status → `completed`; el BE decide qué hace con las `pending`) |
| `onSelect` | — | (no persiste; el FE abre el detalle/edición de la historia) | — |

> El `onStoryMove` lleva `from`/`to` como descriptores de ubicación:
> `to = { type:'sprint', columnId:'todo' }` (al sprint, columna) o `to = { type:'backlog' }`.
> El BE traduce a `sprint_id` + `status` (ej. `to.type==='backlog'` → `sprint_id=null, status=null`).

### Ejemplos de payload
```jsonc
// onStoryAdd  →  POST /api/stories
{ "id":"s-1717000000000", "title":"Login con Google", "type":"userstory",
  "storyPoints":5, "priority":"high", "assignees":[{ "uid":"u1", "name":"Ana Torres" }],
  "_location":"backlog" }

// onStoryChange  →  PATCH /api/stories/s2
{ "storyPoints":8, "priority":"critical" }                 // solo lo que cambió

// onStoryMove  →  PATCH /api/stories/s5   (del backlog al sprint, columna 'todo')
{ "from": { "type":"backlog" }, "to": { "type":"sprint", "columnId":"todo" } }

// onSprintComplete  →  POST /api/sprints/sprint-7/complete
{ "done": 4, "pending": 1 }
```

---

## 4. Ciclo de vida del Sprint + Velocity

- **Iniciar** (`status:'planning'` → botón "Iniciar Sprint" → `onSprintStart`): el BE pone `status='active'`.
- **Cerrar** (`status:'active'` → botón "Cerrar Sprint" → `onSprintComplete`): el BE pone `status='completed'`.
  Decisión de negocio del BE: ¿qué pasa con las historias **pending** (no `done`)? → moverlas al backlog,
  o al próximo sprint. El componente solo informa los conteos (`done`/`pending`).
- **Velocity** (opción `showVelocity`): el FE calcula `Σ storyPoints / committed` para la barra. El BE solo
  necesita exponer `sprint.committed` (o `capacity`). El total real se deriva en el FE.

---

## 5. (No aplica import/export)

`MTS.SprintBoard` no expone import/export propio. Si se necesita (CSV de backlog, sync con Jira), se resuelve
en el consumer/BE contra el modelo canónico Jira.

---

## 6. Convenciones transversales (aplican a los 3 boards)

**Auth / headers.** El `dataSource` acepta `{ headers }` (token `Authorization: Bearer …`). Los `fetch` de las
mutaciones los hace el consumer → mismos headers.

**Generación y reconciliación de `id`.** Si el usuario crea una historia, el FE le pone id temporal (`s-<ts>`).
El BE debería devolver el **id canónico** en el `POST`; el consumer reemplaza el temporal (`updateStory`) para
mantener coherencia. Si tu BD acepta el id del FE, devolvé el mismo.

**UI optimista + rollback.** El FE aplica el cambio en pantalla al instante y luego emite el evento. Si el
`fetch` falla, el consumer debe **revertir** (`reload()` desde el `dataSource` o deshacer local). El componente
no hace rollback solo.

**Manejo de errores.** En la carga, error → `onError({ error })`. En mutaciones, el consumer maneja el `.catch`.
Forma sugerida del error del BE:
```jsonc
{ "error": { "code": "VALIDATION", "message": "Título requerido", "fields": { "title": "requerido" } } }
```

**Validaciones mínimas (server-side).** `title` no vacío; `type ∈ {userstory,task,bug,epic,spike}`;
`priority ∈ {low,medium,high,critical}`; `status ∈ {todo,wip,done}|null`; `storyPoints` numérico;
`sprintId` existente; coherencia `status`↔`sprintId` (backlog ⇒ ambos null).

**Códigos de estado.** `200` (update/transición ok), `201` (created + id), `204` (deleted),
`409` (conflicto de estado de sprint), `422` (validación).

---

## Resumen para el BE
1. Exponer `GET …/sprintboard` con `{ stories, sprints }` y las formas de §2.
2. Implementar §3 (stories + sprint start/complete) con payloads/respuestas indicados.
3. Devolver el **id canónico** en los `POST` (reconciliación).
4. Definir la política de cierre de sprint (qué pasa con las `pending`).
5. Validar server-side (§6) y responder errores con el shape de §6.
