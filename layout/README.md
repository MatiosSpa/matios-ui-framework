# Layout

🇬🇧 Page structure and composition components. They manage space, area distribution and scroll/intersection behaviors. They are the foundation on which all other components are mounted.
🇪🇸 Componentes de estructura y composición de página. Gestionan el espacio, la distribución de áreas y los comportamientos de scroll e intersección. Son la base sobre la que se montan los demás componentes.

---

## Components / Componentes

| Componente | Clase JS | 🇬🇧 Description / 🇪🇸 Descripción |
|---|---|---|
| `matios-ui-grid` | — (CSS) | 🇬🇧 Structural layout with native CSS Grid — responsive spans, area helpers and column helpers. / 🇪🇸 Distribución estructural con CSS Grid nativo — spans responsivos, helpers de área y column helpers. |
| `matios-ui-intersectionreveal` | `MTS.IntersectionReveal` | 🇬🇧 Animates elements as they enter the viewport using IntersectionObserver. Replaces AOS/ScrollReveal. / 🇪🇸 Anima elementos al entrar al viewport usando IntersectionObserver. Reemplaza AOS/ScrollReveal. |
| `matios-ui-scroll` | `MTS.Scroll` | 🇬🇧 Scrollable container with themed scrollbar, adaptive edge fades and scroll events. / 🇪🇸 Contenedor scrollable con scrollbar temático, fades de borde adaptativos y eventos de scroll. |
| `matios-ui-scrollspy` | `MTS.ScrollSpy` | 🇬🇧 Highlights the active navigation link based on the visible section during scroll. / 🇪🇸 Resalta el link de navegación activo según la sección visible durante el scroll. |
| `matios-ui-shell` | `MTS.Shell` | 🇬🇧 Application layout orchestrator. Applies CSS Grid to the root element and assigns named areas (topbar, sidenav, main, statusbar). / 🇪🇸 Orquestador de layout de aplicación. Aplica CSS Grid al elemento raíz y asigna áreas nombradas (topbar, sidenav, main, statusbar). |
| `matios-ui-splitter` | `MTS.Splitter` | 🇬🇧 Drag-resizable panels — horizontal, vertical and collapsible. / 🇪🇸 Paneles redimensionables por drag — horizontal, vertical y colapsable. |

---

## Notes / Notas

- 🇬🇧 `MTS.Shell` is the entry point for full application layouts — it coordinates `MTS.TopBar`, `MTS.SideNav` and `MTS.StatusBar`. / 🇪🇸 `MTS.Shell` es el punto de entrada para layouts de aplicación completos — coordina `MTS.TopBar`, `MTS.SideNav` y `MTS.StatusBar`.
- 🇬🇧 `matios-ui-grid` is CSS-only — no JS required. Use alongside `MTS.Shell` for internal subdivisions. / 🇪🇸 `matios-ui-grid` es CSS puro — no requiere JS. Usar junto a `MTS.Shell` para subdivisiones internas.
- 🇬🇧 `MTS.IntersectionReveal` uses native IntersectionObserver — no polyfill, no dependencies. / 🇪🇸 `MTS.IntersectionReveal` usa `IntersectionObserver` nativo — sin polyfill, sin dependencias.
- 🇬🇧 `MTS.Splitter` can be nested for complex IDE-style layouts. / 🇪🇸 `MTS.Splitter` puede anidarse para layouts complejos de tipo IDE.
---

🇬🇧 **To see detailed documentation for each component, expand the accordion in the demo and read its individual .md file.**
🇪🇸 **Para ver la documentación detallada de cada componente, expanda el acordeón en el demo y lea el .md individual.**
