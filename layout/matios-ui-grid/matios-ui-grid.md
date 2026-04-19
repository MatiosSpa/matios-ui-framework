# MTS.Grid

Native CSS Grid utilities for structural page layout. Use `MTS.Grid` to distribute content blocks across columns, rows and responsive spans without styling the inner component itself.

---

## Description

`MTS.Grid` is the layout layer for page distribution.

Use it for:

- page sections
- dashboards
- sidebars
- content splits
- responsive blocks
- nested layout composition

Do not use it to replace `MTS.FormLayout`.

---

## Installation

```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="../../base/matios-ui-grid.css">
<link rel="stylesheet" href="../../layout/matios-ui-grid/matios-ui-grid.css">
<script src="../../layout/matios-ui-grid/matios-ui-grid.js"></script>
```

---

## Core classes

| Class | Purpose |
|------|---------|
| `mts-grid` | Main grid container |
| `mts-grid--gap-sm` | Small gap |
| `mts-grid--gap-md` | Medium gap |
| `mts-grid--gap-lg` | Large gap |
| `mts-g-col-1` ... `mts-g-col-12` | Column span |
| `mts-g-col-full` | Full width |
| `mts-g-col-auto` | Auto width |
| `mts-g-row-2` | Row span |
| `mts-g-start-3` | Start on column 3 |
| `mts-g-self-start` | Align item to start |
| `mts-g-self-center` | Align item to center |
| `mts-g-self-end` | Align item to end |

---

## Responsive classes

| Breakpoint | Prefix |
|-----------|--------|
| `576px` | `mts-g-col-sm-*` |
| `768px` | `mts-g-col-md-*` |
| `992px` | `mts-g-col-lg-*` |
| `1200px` | `mts-g-col-xl-*` |

Example:

```html
<div class="mts-grid mts-grid--gap-md">
  <div class="mts-g-col-12 mts-g-col-md-6 mts-g-col-lg-4">A</div>
  <div class="mts-g-col-12 mts-g-col-md-6 mts-g-col-lg-4">B</div>
  <div class="mts-g-col-12 mts-g-col-md-12 mts-g-col-lg-4">C</div>
</div>
```

---

## Equal columns

```html
<div class="mts-grid mts-grid--3 mts-grid--gap-md">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

---

## Fixed spans

```html
<div class="mts-grid mts-grid--gap-md">
  <div class="mts-g-col-8">Main</div>
  <div class="mts-g-col-4">Sidebar</div>
</div>
```

---

## Start column

```html
<div class="mts-grid mts-grid--gap-md">
  <div class="mts-g-col-4 mts-g-start-3">Starts at column 3</div>
  <div class="mts-g-col-full">Full width row</div>
</div>
```

---

## Row span

```html
<div class="mts-grid mts-grid--gap-md" style="--mts-rows:3;">
  <div class="mts-g-col-6 mts-g-row-2">Tall block</div>
  <div class="mts-g-col-6">Right top</div>
  <div class="mts-g-col-6">Right middle</div>
  <div class="mts-g-col-full">Footer row</div>
</div>
```

---

## Helper shortcuts already available

```html
<div class="mts-grid mts-grid--sidebar mts-grid--gap-md">
  <aside>Sidebar</aside>
  <section>Main content</section>
</div>
```

Also available:

- `mts-grid--2`
- `mts-grid--3`
- `mts-grid--4`
- `mts-grid--sidebar`
- `mts-grid--sidebar-right`
- `mts-grid--auto-fill`
- `mts-grid--auto-fit`

---

## JavaScript helper

```javascript
const grid = new MTS.Grid('#grid-js-demo', {
  className: 'mts-grid--gap-md',
  items: [
    {
      col: 8,
      html: '<div>Main</div>',
    },
    {
      col: 4,
      html: '<div>Sidebar</div>',
    },
  ],
});
```

The JavaScript helper renders the same native CSS classes. It does not create a second layout system.

---

## Notes

- `MTS.Grid` is for general page distribution.
- `MTS.FormLayout` stays focused on form structure.
- The demo may use shared dotted-outline helpers from `./shared/demo-shared.css` only to make grid boundaries easier to read.
