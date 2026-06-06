# Widgets

High-level, complex components that combine multiple framework pieces with their own business logic. Unlike the base-group components, widgets are complete, self-contained units with their own plugin system or views.

---

## Widgets

| Widget | JS class | Description |
|--------|----------|-------------|
| `calendar` | `MTS.Calendar` (v2) | Full calendar with month/week/day/agenda views, event system, i18n, themes and a UI orchestrator. |
| `datatable` | `MTS.DataTable` | Dynamic table with server-side pagination, search, sort, selection and an extensible plugin system. |
| `charts` | — | In development. |
| `dashboard` | — | In development. |

### Boards (`widgets/boards/`)

| Widget | JS class | Description |
|--------|----------|-------------|
| `matios-ui-gantt-chart` | `MTS.GanttChart` | SVG Gantt + WBS grid with inline editing, drag & drop, undo/redo, baseline and async datasource. |
| `matios-ui-kanban` | `MTS.Kanban` | Kanban board with drag & drop, WIP limits, column management and an event API. |
| `matios-ui-sprint-board` | `MTS.SprintBoard` | Scrum board (Backlog + Sprint) composed from `MTS.Kanban`, with velocity and lifecycle events. |

Each board ships a `*-backend.md` FE↔BE contract for the backend developer.

---

## MTS.DataTable plugins

| Plugin | JS class | Description |
|--------|----------|-------------|
| Toolbar | `MTS.DataTableToolbarPlugin` | Action toolbar with state-reactive buttons over the table. |
| Filter | `MTS.DataTableFilterPlugin` | Filter chips (static or async select) with a filter panel. |
| Column Visibility | `MTS.DataTableColumnVisibilityPlugin` | Show/hide columns via a control panel. |
| Expand Row | `MTS.DataTableExpandRowPlugin` | Expandable rows with custom content. |
| Document Manager | `MTS.DocumentManagerPlugin` | Full document manager (upload, preview, context menu, workflow). |

---

## Notes

- Widgets have their own internal folder structure — see `widgets/<name>/` for specific demos and documentation.
- `MTS.DataTable` loads plugins independently — include only the ones you need.
- `MTS.Calendar` requires loading the view modules you intend to use (`matios-ui-calendar-week.js`, `-month.js`, …).

> For detailed documentation of each widget, see its individual `.md` file.
