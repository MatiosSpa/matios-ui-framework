# MTS.Kanban — Frontend ↔ Backend Contract

> For the **backend** developer. Defines what `MTS.Kanban` consumes and emits, so the BE
> knows exactly **which endpoints to expose, which payloads it receives, and what shape it must return**.
>
> Principle: **the FE persists nothing.** The BE is the source of truth. The FE (1) requests the data
> (`dataSource`), (2) renders it, and (3) when the user performs an action (create/edit/move/delete
> card, manage columns) emits an `onXxxx` event with a payload **ready to send to the BE**.
> The consumer (the screen) is the one that performs the `fetch`.
>
> Canonical domain model (aligned with **Trello**): `_claude_summary/spec_modelo-canonico-proyectos.md`.
> Cross-cutting conventions (auth, errors, optimistic UI, ids) → §6.

---

## 1. Data loading — `dataSource`

The FE requests the data via `dataSource` (function `fn(query) => Promise` or `{url, method, headers, params}`).
The BE must respond with **one** of these two shapes:

```jsonc
// GET /api/boards/:id   →   (A) columns with embedded cards (recommended)
{
  "columns": [
    { "id": "todo",  "title": "To do",   "color": "#64748b", "wip": null, "cards": [ /* Card[] */ ] },
    { "id": "doing", "title": "In progress", "color": "#f59e0b", "wip": 3,    "cards": [ /* Card[] */ ] },
    { "id": "done",  "title": "Done",     "color": "#10b981", "cards": [] }
  ]
}

// (B) columns + flat cards (the FE groups by card.colId)
{
  "columns": [ { "id":"todo", "title":"To do" }, { "id":"doing", "title":"In progress" } ],
  "cards":   [ { "id":"c1", "colId":"todo", "title":"…" }, { "id":"c2", "colId":"doing", "title":"…" } ]
}
```

- `query` can carry filters/pagination (`{ params: { assignee, label, q } }`) and **auth** (`{ headers: { Authorization } }`). See §6.
- Error response: see shape in §6 (fires… note: Kanban has no `onError`; use the `dataSource`'s `.catch`).

---

## 2. Shapes (Column / Card)

### Column
| Field | Type | Req | Notes |
|-------|------|-----|-------|
| `id` | string | ✔ | Column PK (`todo`, `doing`, `done`, or uuid) |
| `title` | string | ✔ | Visible name |
| `color` | string | — | Color of the header dot (hex or `var(--mts-*)`) |
| `wip` | number | — | WIP limit; if `cards.length >= wip` the counter turns red |
| `cards` | Card[] | — | Cards (mode A); in mode B they go separately with `colId` |

### Card (canonical Trello + aliases)
| Field | Type | Req | Notes |
|-------|------|-----|-------|
| `id` | string | ✔ | PK. If the FE creates a card without an id, it auto-generates `c-<ts>` → the BE must return the canonical id (see §6) |
| `title` | string | ✔ | Accepts alias `name` (Trello) |
| `description` | string | — | Accepts alias `desc` |
| `priority` | string | — | `low` \| `medium` \| `high` (style of the card border) |
| `tags` | string[] | — | Accepts alias `labels` (Trello) |
| `assignee` | string | — | Name of the assignee. Accepts `members[0].name` (Trello). For an FK to a user, see the uid note below |
| `due` | string | — | Due date `'YYYY-MM-DD'` |
| `colId` | string | (mode B) | Column it belongs to (only in load shape B) |
| `extras` | object | — | Unrecognized fields land here (round-trip) |

> **Assignee uid:** the internal shape uses `assignee` as a **string** (name). If in your DB the assignee
> is an FK, you can send `members: [{ uid, name }]` (the FE takes `members[0].name` to display) and keep the
> `uid` in `extras`, or adopt `assignee: { uid, name }` in your layer. Recommended: include `uid` for the BE.

### Suggested DDL (PostgreSQL)
```sql
CREATE TABLE board_column (
  id         text PRIMARY KEY,
  board_id   text NOT NULL REFERENCES board(id),
  title      text NOT NULL,
  color      text,
  wip        int,
  position   int NOT NULL            -- column order
);
CREATE TABLE card (
  id          text PRIMARY KEY,
  column_id   text NOT NULL REFERENCES board_column(id),
  title       text NOT NULL,
  description text,
  priority    text,                  -- low|medium|high
  assignee_uid text REFERENCES app_user(uid),
  due         date,
  position    int NOT NULL,          -- order within the column
  labels      jsonb DEFAULT '[]',
  extras      jsonb DEFAULT '{}'
);
```

---

## 3. FE events → BE endpoints

| FE event | Suggested endpoint | Body | Expected response |
|-----------|-------------------|------|--------------------|
| `onCardAdd` | `POST /api/cards` | the **full card** created (`{ title, priority?, assignee?, … }` + `colId`) | `201` + canonical `{ id }` (see §6) |
| `onCardChange` | `PATCH /api/cards/:id` | **only the fields that changed** (`fields`) | `200` |
| `onCardMove` | `PATCH /api/cards/:id` | `{ colId, position }` (target column + 1-based position) | `200` |
| `onCardDelete` | `DELETE /api/cards/:id` | `{ id }` | `204` |
| `onColumnAdd` | `POST /api/columns` | `{ id, title, index }` | `201` + `{ id }` |
| `onColumnRemove` | `DELETE /api/columns/:id` | `{ id }` | `204` (decide in the BE what happens to the cards: delete/move) |
| `onColumnChange` | `PATCH /api/columns/:id` | `{ title }` (rename) | `200` |
| `onCardClick` | — | (does not persist; the FE opens detail/edit) | — |

> Exact payload: what the demo sends with `apiSim(method, path, payload)`. Each action shows in the console
> as `→ API <METHOD> <path>` with the body.

### Payload examples
```jsonc
// onCardAdd  →  POST /api/cards
{ "id":"c-1717000000000", "title":"Configure CI", "priority":"high",
  "assignee":"Ana García", "description":"GitHub Actions", "colId":"todo" }

// onCardChange  →  PATCH /api/cards/c1
{ "priority":"medium", "assignee":"Luis Pérez" }      // only what changed

// onCardMove  →  PATCH /api/cards/c1
{ "colId":"doing", "position":2 }                     // moved to 'doing', 2nd position

// onColumnAdd  →  POST /api/columns
{ "id":"col-1717000000000", "title":"QA", "index":3 }

// onColumnChange  →  PATCH /api/columns/qa
{ "title":"Quality Assurance" }
```

---

## 4. Column management (`editColumns` option)

With `editColumns: true`, the user can **add / rename / delete** columns live (the "+ Column" tile,
double-click on the title, × in the header). Each action emits `onColumnAdd` / `onColumnChange` / `onColumnRemove`
(see §3). The **order** of the columns is defined by the array returned by the `dataSource`; if you want to persist
column reordering, add a `position` column and a dedicated endpoint (the component does not emit it today).

Without `editColumns`, the columns are fixed (only defined by `columns`/`dataSource`).

---

## 5. (Import/export does not apply)

`MTS.Kanban` exposes no import/export of its own (unlike the Gantt). If you need it, resolve it in the
consumer/BE against the canonical Trello model.

---

## 6. Cross-cutting conventions (apply to all 3 boards)

**Auth / headers.** The `dataSource` accepts `{ headers }`; send the token there (`Authorization: Bearer …`).
The mutation `fetch` calls (POST/PATCH/DELETE) are made by the consumer → add the same headers there.

**`id` generation and reconciliation.** If the user creates a card/column, the FE assigns it a temporary id
(`c-<timestamp>` / `col-<timestamp>`). The BE should respond to the `POST` with the **canonical id**; the consumer
replaces the temporary one with the real one (`updateCard`/`setColumns`) to keep consistency. If your DB accepts the
FE's id as PK, return the same one.

**Optimistic UI + rollback.** The FE applies the change on screen **instantly** and then emits the event. If the
`fetch` to the BE fails, the consumer must **revert** (call `reload()` again from the `dataSource`, or undo the
local change). The component does not roll back on its own.

**Error handling.** Suggested BE error shape (any endpoint):
```jsonc
// 4xx/5xx →
{ "error": { "code": "VALIDATION", "message": "Title required", "fields": { "title": "required" } } }
```
The consumer shows the error (toast/inline) and reverts if applicable.

**Minimum validations (server-side, don't trust the FE alone).**
- `title` not empty. `priority ∈ {low,medium,high}`. `colId` exists.
- `position` within range. `due` valid date.

**Status codes.** `200` (update ok), `201` (created, + id), `204` (deleted), `409` (order/state conflict),
`422` (validation). The consumer reacts according to the code.

---

## Summary for the BE
1. Expose `GET /api/boards/:id` with `{ columns }` (or `{ columns, cards }`) and the shapes from §2.
2. Implement the endpoints from §3 (cards + columns) with the indicated payloads and responses.
3. Return the **canonical id** in the `POST` calls (reconciliation).
4. Validate server-side (§6) and respond with errors using the §6 shape.
