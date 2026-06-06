# matios-ui-grid

Native CSS grid system — 12 columns, responsive, no JS, no build step.

---

## Installation

```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="../../base/matios-ui-grid.css">
```

---

## Usage

```html
<!-- 12-column grid (default) -->
<div class="mts-grid">
  <div class="mts-g-col-6">Left half</div>
  <div class="mts-g-col-6">Right half</div>
</div>

<!-- Unequal columns -->
<div class="mts-grid">
  <div class="mts-g-col-8">Main content</div>
  <div class="mts-g-col-4">Sidebar</div>
</div>

<!-- 3 columns with a large gap (via control variables) -->
<div class="mts-grid" style="--mts-columns:3; --mts-gap:2rem">...</div>
```

### Responsive

Breakpoint prefixes: `sm` (576px), `md` (768px), `lg` (992px), `xl` (1200px).

```html
<div class="mts-grid">
  <div class="mts-g-col-12 mts-g-col-md-6 mts-g-col-lg-4">...</div>
  <div class="mts-g-col-12 mts-g-col-md-6 mts-g-col-lg-4">...</div>
</div>
```

---

## CSS Classes

### Columns & alignment

| Class | Description |
|-------|-------------|
| `.mts-g-col-{1..12}` | Span N of 12 columns (e.g. `-3` = 25%, `-6` = 50%, `-8` = 66%) |
| `.mts-g-col-{sm\|md\|lg\|xl}-{1..12}` | Responsive span per breakpoint |
| `.mts-g-start-{n}` | Start at column `n` |
| `.mts-grid--center` / `--start` / `--end` | `align-items: center / start / end` |

### Gap modifiers

| Class | Gap |
|-------|-----|
| `.mts-grid--no-gap` | 0 |
| `.mts-grid--gap-xs` / `-sm` / `-md` / `-lg` / `-xl` | 4 / 8 / 16 / 24 / 32 px |

---

## CSS Variables

Applied directly on the `.mts-grid` container:

| Variable | Default | Description |
|----------|---------|-------------|
| `--mts-columns` | `12` | Number of columns |
| `--mts-rows` | `1` | Number of rows |
| `--mts-gap` | `1rem` | Horizontal and vertical gap |
| `--mts-col-gap` | — | Horizontal gap only |
| `--mts-row-gap` | — | Vertical gap only |

---

## Notes

- This is the low-level CSS grid (`base/`). For structural page layout with a JS helper and layout shortcuts, see
  `MTS.Grid` (`layout/matios-ui-grid`); for forms, see `MTS.FormLayout`.

---

## Changelog

### Initial
- Native 12-column CSS grid: column/responsive/start classes, gap modifiers, alignment, and `--mts-columns` /
  `--mts-rows` / `--mts-gap` control variables.
