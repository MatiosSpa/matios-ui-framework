# Display

Visualization and content-presentation components. They do not take direct user input — their role is to display data, states and collections clearly and consistently with the MTS design system.

---

## Components

| Component | JS class | Description |
|-----------|----------|-------------|
| `matios-ui-avatar` | `MTS.Avatar` | Avatar with image, initials or icon. Size/shape variants and stacked avatar groups. |
| `matios-ui-card` | `MTS.Card` | Generic card with header, body, footer, image, variants and hoverable/clickable states. |
| `matios-ui-countdown` | `MTS.Countdown` | Animated countdown timer — blocks, compact, minimal, with an imperative API. |
| `matios-ui-emptystate` | `MTS.EmptyState` | Empty state with icon, title, description and CTA action. For lists, searches and errors. |
| `matios-ui-imagegallery` | `MTS.ImageGallery` | Image gallery with grid/masonry/list layouts, category filters and multi-selection. |
| `matios-ui-kpicard` | `MTS.KPICard` | Metric card with main value, trend, sparkline and color variants. |
| `matios-ui-ratingreview` | `MTS.RatingReview` | Review widget with average, star breakdown and interactive voting. |
| `matios-ui-sortablelist` | `MTS.SortableList` | Drag & drop sortable list with numbering, move buttons, icons and badges. |
| `matios-ui-timeline` | `MTS.Timeline` | Vertical timeline with items, icons, color variants and alternating layout. |
| `matios-ui-tree` | `MTS.Tree` | Tree view with expand/collapse, single/multiple selection and checkboxes. |
| `matios-ui-virtuallist` | `MTS.VirtualList` | Virtualized list — renders only visible items. Handles 100,000+ rows with infinite scroll. |

---

## Notes

- `MTS.VirtualList` is the right component for large lists — do not use `matios-ui-table` for high-volume flat lists.
- `MTS.SortableList` includes its own drag & drop logic — no external dependencies.
- `MTS.EmptyState` is the system's standard empty state — use it consistently instead of ad-hoc messages.

> For detailed documentation of each component, see its individual `.md` file.
