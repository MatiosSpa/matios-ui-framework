# Navigation

🇬🇧 Navigation and interface structure components. Covers everything from global navigation controls (topbar, sidenav, tabbar) to content organization patterns (tabs, accordion, stepper) and contextual menus.
🇪🇸 Componentes de navegación y estructura de interfaz. Cubren desde controles de navegación global (topbar, sidenav, tabbar) hasta patrones de organización de contenido (tabs, accordion, stepper) y menús contextuales.

---

## Components / Componentes

| Componente | Clase JS | 🇬🇧 Description / 🇪🇸 Descripción |
|---|---|---|
| `matios-ui-accordion` | `MTS.Accordion` | 🇬🇧 Expandable sections — single/multiple open mode, flush, icons and programmatic control. / 🇪🇸 Secciones expandibles — modo single/multiple, flush, iconos y control programático. |
| `matios-ui-breadcrumb` | `MTS.Breadcrumb` | 🇬🇧 Breadcrumb with custom separator, icons and collapsible overflow. / 🇪🇸 Breadcrumb con separador personalizable, iconos y overflow colapsable. |
| `matios-ui-commandpalette` | `MTS.CommandPalette` | 🇬🇧 ⌘K command search with groups, actions and configurable keyboard shortcut. / 🇪🇸 Buscador de comandos tipo ⌘K con grupos, acciones y atajo de teclado configurable. |
| `matios-ui-contextmenu` | `MTS.ContextMenu` | 🇬🇧 Right-click context menu with actions, icons and keyboard shortcuts. / 🇪🇸 Menú contextual por click derecho con acciones, iconos y shortcuts de teclado. |
| `matios-ui-drawer` | `MTS.Drawer` | 🇬🇧 Sliding side panel — left/right/top/bottom positions, sm/md/lg/full sizes and static mode. / 🇪🇸 Panel lateral deslizante — posiciones left/right/top/bottom, tamaños sm/md/lg/full y modo static. |
| `matios-ui-dropdown` | `MTS.Dropdown` | 🇬🇧 Dropdown menu with groups, icons, shortcuts, dividers, submenus and hover mode. / 🇪🇸 Menú desplegable con grupos, iconos, shortcuts, dividers, submenús y modo hover. |
| `matios-ui-menu` | `MTS.Menu` | 🇬🇧 Navigation menu with n levels, icons and a single `onClick` handler. Base for `MTS.SideNav`. / 🇪🇸 Menú de navegación con n niveles, íconos y un único `onClick` handler. Base de `MTS.SideNav`. |
| `matios-ui-pagination` | `MTS.Pagination` | 🇬🇧 Full pagination — page size selector, record summary and jump-to-page. / 🇪🇸 Paginación completa — selector de tamaño de página, resumen de registros y salto a página. |
| `matios-ui-sidenav` | `MTS.SideNav` | 🇬🇧 Collapsible side navigation with `MTS.Menu` support, icons and mini mode (icons only). / 🇪🇸 Navegación lateral colapsable con soporte de `MTS.Menu`, iconos y modo mini (solo iconos). |
| `matios-ui-statusbar` | `MTS.StatusBar` | 🇬🇧 Bottom status bar with free slots (start, center, end). For IDE-style or dashboard apps. / 🇪🇸 Barra de estado inferior con slots libres (start, center, end). Para apps tipo IDE o dashboard. |
| `matios-ui-stepper` | `MTS.Stepper` | 🇬🇧 Unified wizard and progress — step-by-step flows, checkout, compact mode and per-step validation. / 🇪🇸 Wizard y progreso unificado — flujos paso a paso, checkout, compact y validación por paso. |
| `matios-ui-stepprogress` | `MTS.StepProgress` | 🇬🇧 Compatibility alias — the official component is `MTS.Stepper`. / 🇪🇸 Alias de compatibilidad — el componente oficial es `MTS.Stepper`. |
| `matios-ui-tabbar` | `MTS.TabBar` | 🇬🇧 Mobile-app style navigation bar with variants, badges and basic API. / 🇪🇸 Barra de navegación tipo app móvil con variantes, badges y API básica. |
| `matios-ui-tabs` | `MTS.Tabs` | 🇬🇧 Underline, pill and card tabs — horizontal/vertical — with icons, badges and lazy loading. / 🇪🇸 Pestañas estilo underline, pill y card — horizontal/vertical — con iconos, badges y lazy loading. |
| `matios-ui-topbar` | `MTS.TopBar` | 🇬🇧 Top bar for dashboards and apps — brand, content slots and composition with SideNav. / 🇪🇸 Barra superior para dashboards y apps — brand, slots de contenido y composición con SideNav. |

---

## Notes / Notas

- 🇬🇧 `MTS.SideNav` requires an `MTS.Menu` instance as its datasource. / 🇪🇸 `MTS.SideNav` requiere una instancia de `MTS.Menu` como datasource.
- 🇬🇧 `MTS.StepProgress` is a legacy alias — use `MTS.Stepper` in new projects. / 🇪🇸 `MTS.StepProgress` es alias legacy — usar `MTS.Stepper` en proyectos nuevos.
- 🇬🇧 `MTS.CommandPalette` registers its keyboard shortcut globally — avoid multiple instances per page. / 🇪🇸 `MTS.CommandPalette` registra el atajo de teclado globalmente; evitar múltiples instancias por página.
- 🇬🇧 `MTS.TopBar` and `MTS.SideNav` are designed to be used together via `MTS.Shell`. / 🇪🇸 `MTS.TopBar` y `MTS.SideNav` están diseñados para usarse juntos vía `MTS.Shell`.
---

🇬🇧 **To see detailed documentation for each component, expand the accordion in the demo and read its individual .md file.**
🇪🇸 **Para ver la documentación detallada de cada componente, expanda el acordeón en el demo y lea el .md individual.**
