# Boards Kit

Project-management and workflow components. They all live in this group because they are conceptually boards: Gantt (time), Kanban (flow), SprintBoard (agile).

| Component | Status | Description |
|---|---|---|
| `MTS.GanttChart` | ✅ | SVG Gantt + WBS grid + inline editing + undo/redo |
| `MTS.Kanban` | ✅ | Column board with drag & drop, WIP limits, priorities |
| `MTS.SprintBoard` | ✅ | Backlog + Sprint Board with bidirectional drag |

## Usage

```html
<script src="base/matios-ui-base.js"></script>
<script src="widgets/boards/matios-ui-gantt-chart/matios-ui-gantt-chart.js"></script>
<script src="widgets/boards/matios-ui-kanban/matios-ui-kanban.js"></script>
<script src="widgets/boards/matios-ui-sprint-board/matios-ui-sprint-board.js"></script>
```

## Grouping rule

The components in this group follow the framework's **Rule 2 — Grouping by domain**. See `internal-docs/widgets-organization-rule.md`.
