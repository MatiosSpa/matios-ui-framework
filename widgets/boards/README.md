# Boards Kit

Componentes de gestión de proyectos y flujos de trabajo. Todos viven en este grupo porque son tableros conceptualmente: Gantt (temporal), Kanban (flujo), SprintBoard (ágil).

| Componente | Estado | Descripción |
|---|---|---|
| `MTS.GanttChart` | ✅ | Gantt SVG + Grid WBS + inline editing + undo/redo |
| `MTS.Kanban` | ✅ | Tablero columnas con drag & drop, WIP limits, prioridades |
| `MTS.SprintBoard` | ✅ | Backlog + Sprint Board con drag bidireccional |

## Uso

```html
<script src="base/matios-ui-base.js"></script>
<script src="widgets/boards/matios-ui-gantt-chart/matios-ui-gantt-chart.js"></script>
<script src="widgets/boards/matios-ui-kanban/matios-ui-kanban.js"></script>
<script src="widgets/boards/matios-ui-sprint-board/matios-ui-sprint-board.js"></script>
```

## Regla de agrupación

Los componentes de este grupo siguen la **Regla 2 — Agrupación por dominio** del framework. Ver `internal-docs/widgets-organization-rule.md`.
