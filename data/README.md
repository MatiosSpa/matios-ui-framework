# Data

Components for presenting and loading tabular data and collections. They complement `MTS.DataTable` (`widgets/datatable`) for simpler use cases or infinite-scroll requirements.

---

## Components

| Component | JS class | Description |
|-----------|----------|-------------|
| `matios-ui-infinite` | `MTS.Infinite` | Infinite scroll with developer-controlled incremental loading. Vertical, grid and table layouts. |
| `matios-ui-table` | — (CSS) | Pure-CSS table — no JavaScript. Variants, cell states, fixed header and responsive layout. |

---

## Notes

- `matios-ui-table` is CSS-only — ideal for simple static or server-rendered tables.
- For server-side pagination, sorting, filters and advanced plugins, use `MTS.DataTable` (`widgets/datatable`).
- `MTS.Infinite` works with any container — it is not coupled to `matios-ui-table`.

> For detailed documentation of each component, see its individual `.md` file.
