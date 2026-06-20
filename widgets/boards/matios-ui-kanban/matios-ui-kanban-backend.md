# MTS.Kanban — Contrato Frontend ↔ Backend

> Para el desarrollador **backend**. Define qué consume y qué emite `MTS.Kanban`, para que el BE
> sepa exactamente **qué endpoints exponer, qué payloads recibe y qué forma debe devolver**.
>
> Principio: **el FE no persiste nada.** El BE es la fuente de verdad. El FE (1) pide los datos
> (`dataSource`), (2) los dibuja, y (3) cuando el usuario hace una acción (crear/editar/mover/borrar
> tarjeta, gestionar columnas) emite un evento `onXxxx` con un payload **listo para mandar al BE**.
> El consumer (la pantalla) es quien hace el `fetch`.
>
> Modelo canónico de dominio (alineado a **Trello**): `_claude_summary/spec_modelo-canonico-proyectos.md`.
> Convenciones transversales (auth, errores, UI optimista, ids) → §6.

---

## 1. Carga de datos — `dataSource`

El FE pide los datos vía `dataSource` (función `fn(query) => Promise` o `{url, method, headers, params}`).
El BE debe responder con **uno** de estos dos shapes:

```jsonc
// GET /api/boards/:id   →   (A) columnas con tarjetas embebidas (recomendado)
{
  "columns": [
    { "id": "todo",  "title": "Por hacer", "color": "#64748b", "wip": null, "cards": [ /* Card[] */ ] },
    { "id": "doing", "title": "En curso",   "color": "#f59e0b", "wip": 3,    "cards": [ /* Card[] */ ] },
    { "id": "done",  "title": "Hecho",      "color": "#10b981", "cards": [] }
  ]
}

// (B) columnas + tarjetas planas (el FE agrupa por card.colId)
{
  "columns": [ { "id":"todo", "title":"Por hacer" }, { "id":"doing", "title":"En curso" } ],
  "cards":   [ { "id":"c1", "colId":"todo", "title":"…" }, { "id":"c2", "colId":"doing", "title":"…" } ]
}
```

- `query` puede llevar filtros/paginación (`{ params: { assignee, label, q } }`) y **auth** (`{ headers: { Authorization } }`). Ver §6.
- Respuesta de error: ver shape en §6 (dispara… nota: Kanban no tiene `onError`; usar el `.catch` del `dataSource`).

---

## 2. Formas (Column / Card)

### Column
| Campo | Tipo | Req | Notas |
|-------|------|-----|-------|
| `id` | string | ✔ | PK de la columna (`todo`, `doing`, `done`, o uuid) |
| `title` | string | ✔ | Nombre visible |
| `color` | string | — | Color del punto del header (hex o `var(--mts-*)`) |
| `wip` | number | — | Límite WIP; si `cards.length >= wip` el contador se marca en rojo |
| `cards` | Card[] | — | Tarjetas (modo A); en modo B van aparte con `colId` |

### Card (canónico Trello + alias)
| Campo | Tipo | Req | Notas |
|-------|------|-----|-------|
| `id` | string | ✔ | PK. Si el FE crea una tarjeta sin id, autogenera `c-<ts>` → el BE debe devolver el id canónico (ver §6) |
| `title` | string | ✔ | Acepta alias `name` (Trello) |
| `description` | string | — | Acepta alias `desc` |
| `priority` | string | — | `low` \| `medium` \| `high` (estilo del borde de la tarjeta) |
| `tags` | string[] | — | Acepta alias `labels` (Trello) |
| `assignee` | string | — | Nombre del responsable. Acepta `members[0].name` (Trello). Para FK a usuario, ver nota uid abajo |
| `due` | string | — | Fecha límite `'YYYY-MM-DD'` |
| `colId` | string | (modo B) | Columna a la que pertenece (solo en el shape B de carga) |
| `extras` | object | — | Campos no reconocidos quedan acá (round-trip) |

> **uid del responsable:** el shape interno usa `assignee` como **string** (nombre). Si en tu BD el responsable
> es una FK, podés mandar `members: [{ uid, name }]` (el FE toma `members[0].name` para mostrar) y conservar el
> `uid` en `extras` o adoptar `assignee: { uid, name }` en tu capa. Recomendado: incluir `uid` para el BE.

### DDL sugerido (PostgreSQL)
```sql
CREATE TABLE board_column (
  id         text PRIMARY KEY,
  board_id   text NOT NULL REFERENCES board(id),
  title      text NOT NULL,
  color      text,
  wip        int,
  position   int NOT NULL            -- orden de las columnas
);
CREATE TABLE card (
  id          text PRIMARY KEY,
  column_id   text NOT NULL REFERENCES board_column(id),
  title       text NOT NULL,
  description text,
  priority    text,                  -- low|medium|high
  assignee_uid text REFERENCES app_user(uid),
  due         date,
  position    int NOT NULL,          -- orden dentro de la columna
  labels      jsonb DEFAULT '[]',
  extras      jsonb DEFAULT '{}'
);
```

---

## 3. Eventos del FE → endpoints del BE

| Evento FE | Endpoint sugerido | Body | Respuesta esperada |
|-----------|-------------------|------|--------------------|
| `onCardAdd` | `POST /api/cards` | la **tarjeta completa** creada (`{ title, priority?, assignee?, … }` + `colId`) | `201` + `{ id }` canónico (ver §6) |
| `onCardChange` | `PATCH /api/cards/:id` | **solo los campos que cambiaron** (`fields`) | `200` |
| `onCardMove` | `PATCH /api/cards/:id` | `{ colId, position }` (columna destino + posición 1-based) | `200` |
| `onCardDelete` | `DELETE /api/cards/:id` | `{ id }` | `204` |
| `onColumnAdd` | `POST /api/columns` | `{ id, title, index }` | `201` + `{ id }` |
| `onColumnRemove` | `DELETE /api/columns/:id` | `{ id }` | `204` (decidí en el BE qué pasa con las tarjetas: borrar/mover) |
| `onColumnChange` | `PATCH /api/columns/:id` | `{ title }` (renombre) | `200` |
| `onCardClick` | — | (no persiste; el FE abre detalle/edición) | — |

> Payload exacto: lo que el demo manda con `apiSim(method, path, payload)`. Cada acción se ve en consola
> como `→ API <METHOD> <path>` con el body.

### Ejemplos de payload
```jsonc
// onCardAdd  →  POST /api/cards
{ "id":"c-1717000000000", "title":"Configurar CI", "priority":"high",
  "assignee":"Ana García", "description":"GitHub Actions", "colId":"todo" }

// onCardChange  →  PATCH /api/cards/c1
{ "priority":"medium", "assignee":"Luis Pérez" }      // solo lo que cambió

// onCardMove  →  PATCH /api/cards/c1
{ "colId":"doing", "position":2 }                     // movida a 'doing', 2da posición

// onColumnAdd  →  POST /api/columns
{ "id":"col-1717000000000", "title":"QA", "index":3 }

// onColumnChange  →  PATCH /api/columns/qa
{ "title":"Quality Assurance" }
```

---

## 4. Gestión de columnas (opción `editColumns`)

Con `editColumns: true`, el usuario puede **agregar / renombrar / borrar** columnas en vivo (tile "+ Columna",
doble clic en el título, × en el header). Cada acción emite `onColumnAdd` / `onColumnChange` / `onColumnRemove`
(ver §3). El **orden** de las columnas lo define el array que devuelve el `dataSource`; si querés persistir
reordenamiento de columnas, agregá una columna `position` y un endpoint propio (no lo emite el componente hoy).

Sin `editColumns`, las columnas son fijas (solo se definen por `columns`/`dataSource`).

---

## 5. (No aplica import/export)

`MTS.Kanban` no expone import/export propio (a diferencia del Gantt). Si lo necesitás, se resuelve en el
consumer/BE contra el modelo canónico Trello.

---

## 6. Convenciones transversales (aplican a los 3 boards)

**Auth / headers.** El `dataSource` acepta `{ headers }`; mandá ahí el token (`Authorization: Bearer …`).
Los `fetch` de las mutaciones (POST/PATCH/DELETE) los hace el consumer → agregale los mismos headers.

**Generación y reconciliación de `id`.** Si el usuario crea una tarjeta/columna, el FE le pone un id temporal
(`c-<timestamp>` / `col-<timestamp>`). El BE debería responder al `POST` con el **id canónico**; el consumer
reemplaza el temporal por el real (`updateCard`/`setColumns`) para mantener la coherencia. Si tu BD acepta el id
del FE como PK, devolvé el mismo.

**UI optimista + rollback.** El FE aplica el cambio en pantalla **al instante** y luego emite el evento. Si el
`fetch` al BE falla, el consumer debe **revertir** (volver a `reload()` desde el `dataSource`, o deshacer el
cambio local). El componente no hace rollback solo.

**Manejo de errores.** Forma sugerida de error del BE (cualquier endpoint):
```jsonc
// 4xx/5xx →
{ "error": { "code": "VALIDATION", "message": "Título requerido", "fields": { "title": "requerido" } } }
```
El consumer muestra el error (toast/inline) y revierte si corresponde.

**Validaciones mínimas (server-side, no confíes solo en el FE).**
- `title` no vacío. `priority ∈ {low,medium,high}`. `colId` existente.
- `position` dentro de rango. `due` fecha válida.

**Códigos de estado.** `200` (update ok), `201` (created, + id), `204` (deleted), `409` (conflicto de orden/estado),
`422` (validación). El consumer reacciona según el código.

---

## Resumen para el BE
1. Exponer `GET /api/boards/:id` con `{ columns }` (o `{ columns, cards }`) y las formas de §2.
2. Implementar los endpoints de §3 (cards + columns) con los payloads y respuestas indicados.
3. Devolver el **id canónico** en los `POST` (reconciliación).
4. Validar server-side (§6) y responder errores con el shape de §6.
