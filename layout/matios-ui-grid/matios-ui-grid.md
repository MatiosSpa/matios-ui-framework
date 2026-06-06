# MTS.Grid

CSS Grid utilities for structural page layout. Distributes content blocks across columns, rows and responsive spans without styling the inner component.

---

## Installation

```html
<link rel="stylesheet" href="base/matios-ui-base.css">
<link rel="stylesheet" href="layout/matios-ui-grid/matios-ui-grid.css">
<script src="layout/matios-ui-grid/matios-ui-grid.js"></script>
```

---

## Usage

### CSS only

```html
<div class="mts-grid mts-grid--gap-md">
  <div class="mts-g-col-8">Main content</div>
  <div class="mts-g-col-4">Sidebar</div>
</div>
```

### JavaScript helper

```js
new MTS.Grid('#my-grid', {
  className: 'mts-grid--gap-md',
  items: [
    { col: 8, html: '<div>Main</div>' },
    { col: 4, html: '<div>Sidebar</div>' },
  ],
});
```

The JS helper renders the same native CSS classes — it does not create a separate layout system.

### Responsive

```html
<div class="mts-grid mts-grid--gap-md">
  <div class="mts-g-col-12 mts-g-col-md-6 mts-g-col-lg-4">A</div>
  <div class="mts-g-col-12 mts-g-col-md-6 mts-g-col-lg-4">B</div>
  <div class="mts-g-col-12 mts-g-col-lg-4">C</div>
</div>
```

### Row spans (set `--mts-rows`)

```html
<div class="mts-grid mts-grid--gap-md" style="--mts-rows: 3;">
  <div class="mts-g-col-6 mts-g-row-2">Tall block</div>
  <div class="mts-g-col-6">Right top</div>
  <div class="mts-g-col-6">Right middle</div>
  <div class="mts-g-col-full">Full row</div>
</div>
```

---

## CSS Classes

### Core

| Class | Description |
|-------|-------------|
| `mts-grid` | Main grid container |
| `mts-grid--gap-sm` / `--gap-md` / `--gap-lg` | Small / medium / large gap |
| `mts-g-col-1` … `mts-g-col-12` | Column span (1–12) |
| `mts-g-col-full` / `mts-g-col-auto` | Full width / auto width |
| `mts-g-row-2` | Span 2 rows |
| `mts-g-start-3` | Start at column 3 |
| `mts-g-self-start` / `--center` / `--end` | Align the item on the cross axis |

### Layout shortcuts

| Class | Description |
|-------|-------------|
| `mts-grid--2` / `--3` / `--4` | 2 / 3 / 4 equal columns |
| `mts-grid--sidebar` / `--sidebar-right` | Sidebar left / right + content |
| `mts-grid--auto-fill` / `--auto-fit` | `auto-fill` / `auto-fit` columns |

### Responsive prefixes

| Breakpoint | Prefix |
|------------|--------|
| `576px` | `mts-g-col-sm-*` |
| `768px` | `mts-g-col-md-*` |
| `992px` | `mts-g-col-lg-*` |
| `1200px` | `mts-g-col-xl-*` |

---

## CSS Variables

| Variable | Description |
|----------|-------------|
| `--mts-rows` | Explicit number of grid rows (for `mts-g-row-*` spans) |

---

## Notes

- Use `MTS.Grid` for general page layout. For forms, use `MTS.FormLayout`.
- Demos may use the dashed-outline helpers from `support/demo-shared.css` to visualize cells.

---

## Changelog

### 2026-05-13
- Documentation homologated to the standard template.
