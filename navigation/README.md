# Navigation

Navigation and interface-structure components. From global navigation controls (topbar, sidenav, tabbar) to content-organization patterns (tabs, accordion, stepper) and contextual menus.

---

## Components

| Component | JS class | Description |
|-----------|----------|-------------|
| `matios-ui-accordion` | `MTS.Accordion` | Expandable sections — single/multiple open, flush, icons and programmatic control. |
| `matios-ui-breadcrumb` | `MTS.Breadcrumb` | Breadcrumb with custom separator, icons and collapsible overflow. |
| `matios-ui-commandpalette` | `MTS.CommandPalette` | ⌘K command search with groups, actions and a configurable shortcut. |
| `matios-ui-contextmenu` | `MTS.ContextMenu` | Right-click context menu with actions, icons and keyboard shortcuts. |
| `matios-ui-drawer` | `MTS.Drawer` | Sliding side panel — left/right/top/bottom, sm/md/lg/full sizes and static mode. |
| `matios-ui-dropdown` | `MTS.Dropdown` | Dropdown menu with groups, icons, shortcuts, dividers, submenus and hover mode. |
| `matios-ui-menu` | `MTS.Menu` | Navigation model with n levels and a single `onClick` — base for `MTS.Topbar` / `MTS.SideNav`. |
| `matios-ui-pagination` | `MTS.Pagination` | Full pagination — page-size selector, record summary and jump-to-page. |
| `matios-ui-paneldropdown` | `MTS.PanelDropdown` | Floating anchored panel — notifications, user menu, rich actions. |
| `matios-ui-sidenav` | `MTS.SideNav` | Collapsible side navigation with `MTS.Menu` support, icons and mini (icons-only) mode. |
| `matios-ui-statusbar` | `MTS.StatusBar` | Bottom status bar with free slots — dots, tags and items. |
| `matios-ui-stepper` | `MTS.Stepper` | Unified wizard + progress — step flows, checkout, compact mode, per-step status. |
| `matios-ui-stepprogress` | `MTS.StepProgress` | Compatibility alias — the official component is `MTS.Stepper`. |
| `matios-ui-tabbar` | `MTS.TabBar` | Mobile-app style bottom navigation bar with variants, badges and a basic API. |
| `matios-ui-tabs` | `MTS.Tabs` | Underline/pill/card tabs — horizontal/vertical — with icons, badges and lazy loading. |
| `matios-ui-topbar` | `MTS.Topbar` | Top bar for dashboards and apps — brand, content slots and composition with SideNav. |

---

## Notes

- `MTS.SideNav` and `MTS.Topbar` consume an `MTS.Menu` instance as their navigation model.
- `MTS.StepProgress` is a legacy alias — use `MTS.Stepper` in new projects.
- `MTS.CommandPalette` registers its keyboard shortcut globally — avoid multiple instances per page.
- `MTS.Topbar` + `MTS.SideNav` are designed to compose into a dashboard shell (see the Topbar "Layout with SideNav" example).

> For detailed documentation of each component, see its individual `.md` file.
