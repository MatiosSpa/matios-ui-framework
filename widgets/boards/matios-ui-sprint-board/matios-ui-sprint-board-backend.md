# MTS.SprintBoard — Frontend ↔ Backend Contract

> For the **backend** developer. Defines what `MTS.SprintBoard` consumes and emits, so the BE
> knows exactly **which endpoints to expose, which payloads it receives and what shape it must return**.
>
> Principle: **the FE persists nothing.** The BE is the source of truth. The FE (1) requests the data
> (`dataSource`), (2) renders it (Backlog ↔ Sprint), and (3) when the user performs an action (create/edit/
> move/delete story, start/close sprint) it emits an `onXxxx` event with a payload **ready for the BE**.
> The consumer (the screen) is the one that performs the `fetch`.
>
> Canonical domain model (aligned with **Jira**): `_claude_summary/spec_modelo-canonico-proyectos.md`.
> Cross-cutting conventions (auth, errors, optimistic UI, ids) → §6.

---

## 1. Data loading — `dataSource`

The FE requests the data via `dataSource` (`fn(query) => Promise` or `{url, method, headers, params}`). The BE responds:

```jsonc
// GET /api/projects/:id/sprintboard   →
{
  "stories": [ /* Story[] */ ],   // backlog + the sprint's stories (distinguished by sprintId/status)
  "sprints": [ /* Sprint[] */ ]   // the active sprint is detected by status:'active'
}
```

- `query`: filters/auth (`{ params, headers }`, see §6).
- On error, the component emits **`onError({ error })`** (unlike the Kanban). Error shape in §6.
- The **current sprint** is auto-detected as the first one with `status:'active'` (or set via `currentSprintId`).

---

## 2. Shapes (Story / Sprint)

### Story (canonical Jira + aliases)
| Field | Type | Req | Notes |
|-------|------|-----|-------|
| `id` | string | ✔ | PK. Without an id → the FE auto-generates `s-<ts>` and the BE returns the canonical one (§6) |
| `code` | string | — | Visible key like `PRJ-42`. Accepts alias `key` (Jira) |
| `title` | string | ✔ | Accepts alias `summary` (Jira) |
| `description` | string | — | |
| `type` | string | — | `userstory` \| `task` \| `bug` \| `epic` \| `spike`. Accepts alias `issuetype`. Default `userstory` |
| `storyPoints` | number | — | Estimate (Fibonacci scale 1,2,3,5,8,13,21) |
| `priority` | string | — | `low` \| `medium` \| `high` \| `critical`. Default `medium` |
| `status` | string | — | Sprint column: `todo` \| `wip` \| `done` (null = in backlog) |
| `sprintId` | string | — | Sprint it belongs to (null = backlog) |
| `assignees` | object[] | — | `[{ uid, name, avatar? }]`. Accepts `assignee` (string) → wraps it |
| `tags` | string[] | — | Labels |
| `extras` | object | — | Unrecognized fields (round-trip) |

### Sprint
| Field | Type | Req | Notes |
|-------|------|-----|-------|
| `id` | string | ✔ | PK |
| `number` | number | — | Sprint number (display) |
| `name` | string | — | E.g. `Sprint 7` |
| `goal` | string | — | Sprint goal (shown next to the name) |
| `startDate` / `endDate` | string | — | `'YYYY-MM-DD'` |
| `status` | string | ✔ | `planning` \| `active` \| `completed` (the `active` one is shown; `planning` enables "Start") |
| `capacity` | number | — | Capacity in SP (for the velocity bar) |
| `committed` | number | — | Committed SP (the bar's denominator; falls back to `capacity` if missing) |

### Suggested DDL (PostgreSQL)
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
CREATE TABLE story_assignee (             -- N:M story ↔ user
  story_id text REFERENCES story(id),
  uid      text REFERENCES app_user(uid),
  PRIMARY KEY (story_id, uid)
);
```

---

## 3. FE events → BE endpoints

| FE event | Suggested endpoint | Body | Response |
|-----------|-------------------|------|-----------|
| `onStoryAdd` | `POST /api/stories` | the **full story** created (with `assignees[].uid`, `type`, `storyPoints`, `_location`) | `201` + `{ id }` |
| `onStoryChange` | `PATCH /api/stories/:id` | **only the fields that changed** (`fields`) | `200` |
| `onStoryMove` | `PATCH /api/stories/:id` | `{ from, to }` (source/destination: backlog ↔ sprint+column) | `200` |
| `onStoryDelete` | `DELETE /api/stories/:id` | `{ id }` | `204` |
| `onSprintStart` | `POST /api/sprints/:id/start` | `{ id }` | `200` (status → `active`) |
| `onSprintComplete` | `POST /api/sprints/:id/complete` | `{ done, pending }` (counts) | `200` (status → `completed`; the BE decides what to do with the `pending` ones) |
| `onSelect` | — | (does not persist; the FE opens the story detail/edit view) | — |

> The `onStoryMove` carries `from`/`to` as location descriptors:
> `to = { type:'sprint', columnId:'todo' }` (to the sprint, column) or `to = { type:'backlog' }`.
> The BE translates this into `sprint_id` + `status` (e.g. `to.type==='backlog'` → `sprint_id=null, status=null`).

### Payload examples
```jsonc
// onStoryAdd  →  POST /api/stories
{ "id":"s-1717000000000", "title":"Login with Google", "type":"userstory",
  "storyPoints":5, "priority":"high", "assignees":[{ "uid":"u1", "name":"Ana Torres" }],
  "_location":"backlog" }

// onStoryChange  →  PATCH /api/stories/s2
{ "storyPoints":8, "priority":"critical" }                 // only what changed

// onStoryMove  →  PATCH /api/stories/s5   (from backlog to the sprint, column 'todo')
{ "from": { "type":"backlog" }, "to": { "type":"sprint", "columnId":"todo" } }

// onSprintComplete  →  POST /api/sprints/sprint-7/complete
{ "done": 4, "pending": 1 }
```

---

## 4. Sprint lifecycle + Velocity

- **Start** (`status:'planning'` → "Start Sprint" button → `onSprintStart`): the BE sets `status='active'`.
- **Close** (`status:'active'` → "Close Sprint" button → `onSprintComplete`): the BE sets `status='completed'`.
  BE business decision: what happens to the **pending** stories (not `done`)? → move them to the backlog,
  or to the next sprint. The component only reports the counts (`done`/`pending`).
- **Velocity** (`showVelocity` option): the FE computes `Σ storyPoints / committed` for the bar. The BE only
  needs to expose `sprint.committed` (or `capacity`). The real total is derived on the FE.

---

## 5. (Import/export not applicable)

`MTS.SprintBoard` does not expose its own import/export. If it is needed (backlog CSV, Jira sync), it is resolved
in the consumer/BE against the canonical Jira model.

---

## 6. Cross-cutting conventions (apply to all 3 boards)

**Auth / headers.** The `dataSource` accepts `{ headers }` (token `Authorization: Bearer …`). The mutation `fetch`
calls are made by the consumer → same headers.

**`id` generation and reconciliation.** If the user creates a story, the FE assigns it a temporary id (`s-<ts>`).
The BE should return the **canonical id** in the `POST`; the consumer replaces the temporary one (`updateStory`) to
keep consistency. If your DB accepts the FE id, return the same one.

**Optimistic UI + rollback.** The FE applies the change on screen instantly and then emits the event. If the
`fetch` fails, the consumer must **revert** (`reload()` from the `dataSource` or undo locally). The component
does not roll back on its own.

**Error handling.** On load, error → `onError({ error })`. On mutations, the consumer handles the `.catch`.
Suggested BE error shape:
```jsonc
{ "error": { "code": "VALIDATION", "message": "Title required", "fields": { "title": "required" } } }
```

**Minimum validations (server-side).** `title` not empty; `type ∈ {userstory,task,bug,epic,spike}`;
`priority ∈ {low,medium,high,critical}`; `status ∈ {todo,wip,done}|null`; `storyPoints` numeric;
`sprintId` exists; `status`↔`sprintId` consistency (backlog ⇒ both null).

**Status codes.** `200` (update/transition ok), `201` (created + id), `204` (deleted),
`409` (sprint state conflict), `422` (validation).

---

## Summary for the BE
1. Expose `GET …/sprintboard` with `{ stories, sprints }` and the shapes from §2.
2. Implement §3 (stories + sprint start/complete) with the indicated payloads/responses.
3. Return the **canonical id** in the `POST`s (reconciliation).
4. Define the sprint close policy (what happens to the `pending` ones).
5. Validate server-side (§6) and respond with errors using the §6 shape.
