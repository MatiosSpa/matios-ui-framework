# Widgets

🇬🇧 High-level complex components that combine multiple framework pieces and their own business logic. Unlike base group components, widgets are complete and self-contained units with their own plugin system or views.
🇪🇸 Componentes complejos de alto nivel que combinan múltiples piezas del framework y lógica de negocio propia. A diferencia de los componentes de los grupos base, los widgets son unidades completas y autónomas con su propio sistema de plugins o vistas.

---

## Widgets

| Widget | Clase JS | 🇬🇧 Description / 🇪🇸 Descripción |
|---|---|---|
| `calendar` | `MTS.Calendar` | 🇬🇧 Full calendar with month, week, day and schedule views. Event system, i18n, themes and plugin API. / 🇪🇸 Calendario completo con vistas mes, semana, día y agenda. Sistema de eventos, i18n, temas y API de plugins. |
| `datatable` | `MTS.DataTable` | 🇬🇧 Dynamic table with server-side pagination, search, sort, selection and extensible plugin system. / 🇪🇸 Tabla dinámica con paginación server-side, búsqueda, sort, selección y sistema de plugins extensible. |
| `charts` | — | 🇬🇧 In development. / 🇪🇸 En desarrollo. |
| `dashboard` | — | 🇬🇧 In development. / 🇪🇸 En desarrollo. |

---

## MTS.DataTable Plugins

| Plugin | Clase JS | 🇬🇧 Description / 🇪🇸 Descripción |
|---|---|---|
| Column Visibility | `MTS.DataTableColumnVisibilityPlugin` | 🇬🇧 Column visibility toggle with control panel. / 🇪🇸 Toggle de visibilidad de columnas con panel de control. |
| Context Menu | `MTS.ContextMenuPlugin` | 🇬🇧 Right-click context menu on rows. / 🇪🇸 Menú contextual por click derecho en filas. |
| Filter | `MTS.DataTableFilterPlugin` | 🇬🇧 Advanced filters with chips and filter panel. / 🇪🇸 Filtros avanzados con chips y panel de filtrado. |
| Toolbar | `MTS.DataTableToolbarPlugin` | 🇬🇧 Action toolbar with buttons over the table. / 🇪🇸 Barra de herramientas con botones de acción sobre la tabla. |
| Expand Row | `MTS.DataTableExpandRowPlugin` | 🇬🇧 Expandable rows with custom content. / 🇪🇸 Filas expandibles con contenido personalizado. |
| Row Actions | `MTS.DataTableColumnActionsPlugin` | 🇬🇧 Standalone per-row action column. / 🇪🇸 Columna de acciones standalone por fila. |
| Document Manager | `MTS.DataTableDocumentManagerPlugin` | 🇬🇧 Full document manager with upload, preview and workflow. / 🇪🇸 Gestor de documentos completo con upload, preview y workflow. |

---

## Notes / Notas

- 🇬🇧 Widgets have their own internal folder structure — see `widgets/<name>/` for specific demos and documentation. / 🇪🇸 Los widgets tienen su propia estructura de carpetas interna — ver `widgets/<nombre>/` para demos y documentación específica.
- 🇬🇧 `MTS.DataTable` loads plugins independently — only include the ones you need. / 🇪🇸 `MTS.DataTable` carga los plugins de forma independiente — solo incluir los que se necesiten.
- 🇬🇧 `MTS.Calendar` requires loading the view modules to be used (`matios-ui-calendar-month.js`, `matios-ui-calendar-week.js`, etc.). / 🇪🇸 `MTS.Calendar` requiere cargar los módulos de vista que se vayan a usar (`matios-ui-calendar-month.js`, `matios-ui-calendar-week.js`, etc.).
