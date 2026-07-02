# MTS.Table

Pure-CSS table component — no JavaScript. Classes for variants, row states, fixed header, special columns and responsive layout.

---

## Installation

```html
<link rel="stylesheet" href="data/matios-ui-table/matios-ui-table.css">
```

---

## Usage

```html
<div class="mts-table-wrap">
  <table class="mts-table">
    <thead>
      <tr>
        <th class="mts-table__th">Name</th>
        <th class="mts-table__th">Email</th>
        <th class="mts-table__th mts-table__th--center">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr class="mts-table__row">
        <td class="mts-table__td">Ana García</td>
        <td class="mts-table__td">ana@example.com</td>
        <td class="mts-table__td mts-table__td--center"><span class="mts-badge mts-badge--success">Active</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

### Variants

```html
<table class="mts-table mts-table--striped">...</table>   <!-- striped rows -->
<table class="mts-table mts-table--hover">...</table>     <!-- hover highlight -->
<table class="mts-table mts-table--bordered">...</table>  <!-- cell borders -->
<table class="mts-table mts-table--compact">...</table>   <!-- compact padding -->
<table class="mts-table mts-table--flush">...</table>     <!-- no outer padding (inside cards) -->
```

### Fixed header

Add `.mts-table--fixed` and give the wrapper a `max-height` + `overflow-y` from your own CSS:

```html
<div class="mts-table-wrap my-table-scroll">
  <table class="mts-table mts-table--hover mts-table--fixed">...</table>
</div>
```

```css
.my-table-scroll { max-height: 300px; overflow-y: auto; }
```

### Responsive

Add `.mts-table--responsive` and a `data-label` on each `<td>` — used as the column label in mobile view:

```html
<table class="mts-table mts-table--responsive">
  <tbody>
    <tr class="mts-table__row">
      <td class="mts-table__td" data-label="Name">Ana García</td>
      <td class="mts-table__td" data-label="Email">ana@example.com</td>
    </tr>
  </tbody>
</table>
```

### Sortable headers

Mark the column with `.mts-table__th--sortable`, add `.mts-table__th--asc` / `--desc` for the active direction, and place the CSS-triangle icon inside:

```html
<th class="mts-table__th mts-table__th--sortable mts-table__th--asc">
  Name
  <span class="mts-table__sort">
    <span class="mts-table__sort-up"></span>
    <span class="mts-table__sort-down"></span>
  </span>
</th>
```

### Actions column

Use `.mts-table__td--actions` on the cell (right-aligned, no wrap) to hold icon-only buttons. The header stays a plain `.mts-table__th`:

```html
<td class="mts-table__td mts-table__td--actions">
  <button class="mts-btn mts-btn--ghost mts-btn--sm mts-btn--icon">
    <i class="mts-icon mts-icon-eye mts-icon--sm"></i>
  </button>
  <button class="mts-btn mts-btn--ghost mts-btn--sm mts-btn--icon">
    <i class="mts-icon mts-icon-edit mts-icon--sm"></i>
  </button>
  <button class="mts-btn mts-btn--ghost mts-btn--sm mts-btn--icon">
    <i class="mts-icon mts-icon-trash mts-icon--sm"></i>
  </button>
</td>
```

### Checkbox selection

Fixed-width checkbox column via `.mts-table__th--check` / `.mts-table__td--check`, with a styled `.mts-table__checkbox`. Combine with `.mts-table__row--selected` to highlight checked rows:

```html
<tr class="mts-table__row mts-table__row--selected">
  <td class="mts-table__td mts-table__td--check">
    <input type="checkbox" class="mts-table__checkbox" checked>
  </td>
  <td class="mts-table__td">Ana García</td>
</tr>
```

### Empty state

A single full-width cell with `.mts-table__empty` and its icon / title / message elements:

```html
<tr>
  <td colspan="4" class="mts-table__empty">
    <i class="mts-icon mts-icon-inbox mts-icon--xl mts-table__empty-icon"></i>
    <div class="mts-table__empty-title">No records found</div>
    <div class="mts-table__empty-msg">Try other filters or add a new item.</div>
  </td>
</tr>
```

### Footer / totals

Put a `.mts-table__tfoot` row inside `<tfoot>` (bold, top border):

```html
<tfoot>
  <tr class="mts-table__tfoot">
    <td class="mts-table__td" colspan="2"><strong>Total</strong></td>
    <td class="mts-table__td mts-table__td--end"><strong>286</strong></td>
    <td class="mts-table__td mts-table__td--end"><strong>$2.356,70</strong></td>
  </tr>
</tfoot>
```

### Truncated text

`.mts-table__td--truncate` clips overflow with an ellipsis (default `max-width: 200px`). Add a `title` for the full-text native tooltip:

```html
<td class="mts-table__td mts-table__td--truncate" title="Full description here…">
  Full description here…
</td>
```

---

## CSS Classes

### Wrapper & table

| Class | Description |
|-------|-------------|
| `.mts-table-wrap` | Container with horizontal scroll |
| `.mts-table` | Base table |
| `.mts-table--striped` | Striped rows |
| `.mts-table--hover` | Hover highlight |
| `.mts-table--bordered` | Cell borders |
| `.mts-table--compact` | Compact padding |
| `.mts-table--flush` | Removes outer padding (use inside cards) |
| `.mts-table--fixed` | Fixed header (requires `max-height` on the wrapper) |
| `.mts-table--responsive` | Stacks rows on mobile using `data-label` |

### Headers

| Class | Description |
|-------|-------------|
| `.mts-table__th` | Header cell |
| `.mts-table__th--sortable` | Sortable column (cursor + hover) |
| `.mts-table__th--asc` / `--desc` | Active ascending / descending sort |
| `.mts-table__th--end` / `--center` | Right / center alignment |
| `.mts-table__th--check` | Checkbox column (fixed 40px width) |
| `.mts-table__sort` / `__sort-up` / `__sort-down` | Sort icon container + CSS-triangle arrows |

### Rows

| Class | Description |
|-------|-------------|
| `.mts-table__row` | Table row |
| `.mts-table__row--selected` | Selected state |
| `.mts-table__row--success` / `--warning` / `--danger` / `--info` | State highlight |
| `.mts-table__row--muted` | Dimmed / disabled appearance |
| `.mts-table__row--clickable` | Pointer cursor on hover |
| `.mts-table__row--dragging` / `--drag-over` | Drag source / drop target |

### Cells

| Class | Description |
|-------|-------------|
| `.mts-table__td` | Table cell |
| `.mts-table__td--end` / `--center` | Right / center alignment |
| `.mts-table__td--check` | Checkbox column (fixed 40px width) |
| `.mts-table__td--actions` | Actions column (right-aligned, no wrap) |
| `.mts-table__td--truncate` | Ellipsis truncation (default `max-width: 200px`, override per cell) |

### Footer, empty state & checkbox

| Class | Description |
|-------|-------------|
| `.mts-table__tfoot` | Footer row (bold, top border) |
| `.mts-table__empty` / `__empty-icon` / `__empty-title` / `__empty-msg` | Empty-state cell + icon + messages |
| `.mts-table__checkbox` | Styled checkbox (accent-color primary) |

---

## Notes

- `mts-table--flush` removes side padding — useful inside an `MTS.Card` with a tight body.
- `mts-table--fixed` requires the wrapper to have a defined `max-height` (+ `overflow-y: auto`); without it the header will not stick.
- `mts-table__td--truncate` ships a default `max-width: 200px`; override it per cell (`style="max-width: …"`) when a column needs a different width. Pair it with a `title` attribute for the native full-text tooltip.
- The actions column has no header-cell modifier — the header is a plain `mts-table__th`; only `mts-table__td--actions` (right-aligned, no wrap) is a real class. The demo tags the header with `mts-table__th--actions` purely as a marker, but it has no styling effect.
- For server-side pagination, sorting, filters and advanced plugins, use `MTS.DataTable` (`widgets/datatable`), which reuses these classes internally.

---

## Accessibility

- Use real `<th>` headers with proper scope so screen readers associate cells with columns.
- For `--clickable` rows, ensure the action is reachable by keyboard (a focusable control inside the row).

> The `demo.html` page is localized (es / en / pt) via `matios-ui-table-i18n.js`; the component itself is pure CSS and has no runtime strings.
