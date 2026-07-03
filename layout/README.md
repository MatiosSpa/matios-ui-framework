# Layout

Page structure and composition components. They manage space, area distribution and scroll/intersection behaviors — the foundation other components mount on.

---

## Components

| Component | JS class | Description |
|-----------|----------|-------------|
| `matios-ui-dashboardgrid` | `MTS.DashboardGrid` | Bento dashboard grid — drag & drop, widget tray, resize and collision modes. |
| `matios-ui-grid` | — (CSS) | Structural layout with native CSS Grid — responsive spans, layout shortcuts and a JS helper (`MTS.Grid`). |
| `matios-ui-intersectionreveal` | `MTS.IntersectionReveal` | Animates elements as they enter the viewport using IntersectionObserver. Replaces AOS/ScrollReveal. |
| `matios-ui-scroll` | `MTS.Scroll` | Scrollable container with a themed scrollbar, adaptive edge fades and scroll events. |
| `matios-ui-scrollspy` | `MTS.ScrollSpy` | Highlights the active navigation link based on the visible section during scroll. |
| `matios-ui-shell` | `MTS.Shell` | Layout orchestrator — Topbar + SideNav + StatusBar + main region with CSS Grid. |
| `matios-ui-splitter` | `MTS.Splitter` | Drag-resizable panels — horizontal, vertical and collapsible. |

---

## Notes

- `MTS.Grid` is for general page layout; for forms use `MTS.FormLayout`. The low-level CSS grid lives in `base/matios-ui-grid`.
- `MTS.IntersectionReveal` uses native `IntersectionObserver` — no polyfill, no dependencies.
- `MTS.Splitter` can be nested for complex IDE-style layouts.

> For detailed documentation of each component, see its individual `.md` file.
