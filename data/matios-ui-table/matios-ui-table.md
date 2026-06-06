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
| `.mts-table__th--check` | Checkbox column (fixed width) |
| `.mts-table__th--actions` | Actions column |
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
| `.mts-table__td--check` | Checkbox column (fixed width) |
| `.mts-table__td--actions` | Actions column (right, no wrap) |
| `.mts-table__td--truncate` | Ellipsis truncation (requires consumer `max-width`) |

### Footer, empty state & checkbox

| Class | Description |
|-------|-------------|
| `.mts-table__tfoot` | Footer row (bold, top border) |
| `.mts-table__empty` / `__empty-icon` / `__empty-title` / `__empty-msg` | Empty-state cell + icon + messages |
| `.mts-table__checkbox` | Styled checkbox (accent-color primary) |

---

## Notes

- `mts-table--flush` removes side padding — useful inside an `MTS.Card` with a tight body.
- `mts-table--fixed` requires the wrapper to have a defined `max-height`; without it the header will not stick.
- `mts-table__td--truncate` requires a consumer-defined `max-width` — the component does not assume a width.
- For server-side pagination, sorting, filters and advanced plugins, use `MTS.DataTable` (`widgets/datatable`).

---

## Accessibility

- Use real `<th>` headers with proper scope so screen readers associate cells with columns.
- For `--clickable` rows, ensure the action is reachable by keyboard (a focusable control inside the row).

---

## Changelog

### 2026-05-17
- Documentation homologated to the standard template; fixed-header and truncation examples use a consumer class
  (no inline styles).
