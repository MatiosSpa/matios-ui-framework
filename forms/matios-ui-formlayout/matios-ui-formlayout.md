# MTS.FormLayout

Form layout system — pure CSS, no JavaScript. Controls how fields, labels and inputs are distributed.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-formlayout.css">
```

---

## Usage

### Stack (default) — label above, input below

```html
<form class="mts-form">
  <div class="mts-form-group">
    <label class="mts-form-label mts-form-label--required">Name</label>
    <input class="mts-input" placeholder="John Doe">
  </div>
  <div class="mts-form-group">
    <label class="mts-form-label">Email</label>
    <input class="mts-input" type="email" placeholder="john@company.com">
    <span class="mts-form-hint">We'll send confirmations here.</span>
  </div>
  <div class="mts-form-footer mts-form-footer--end">
    <button class="mts-btn mts-btn--secondary">Cancel</button>
    <button class="mts-btn mts-btn--primary">Save</button>
  </div>
</form>
```

### Grid — columns via `--mts-form-cols`

```html
<form class="mts-form mts-form--grid" style="--mts-form-cols:2">
  <div class="mts-form-group"><label class="mts-form-label">First name</label><input class="mts-input"></div>
  <div class="mts-form-group"><label class="mts-form-label">Last name</label><input class="mts-input"></div>
  <!-- spans all columns -->
  <div class="mts-form-group mts-form-group--full"><label class="mts-form-label">Address</label><input class="mts-input"></div>
</form>
```

### Horizontal — label left, field right (`--mts-form-label-width`)

```html
<form class="mts-form mts-form--horizontal">
  <div class="mts-form-group"><label class="mts-form-label">Email</label><input class="mts-input" type="email"></div>
</form>
```

### Inline — all fields in one row (search bars, filters)

```html
<form class="mts-form mts-form--inline">
  <div class="mts-form-group"><label class="mts-form-label">Search</label><input class="mts-input"></div>
  <button class="mts-btn mts-btn--primary">Search</button>
</form>
```

Sections (`.mts-form-section` + `__title` / `__desc`) and a card wrapper (`.mts-form-card` + `__header` /
`__title` / `__subtitle`) are also available.

---

## CSS Classes

### Layout patterns

| Class | Description |
|-------|-------------|
| `.mts-form` | Stack (default) — label above, input below |
| `.mts-form--horizontal` | Label left, field right |
| `.mts-form--inline` | All fields in one line |
| `.mts-form--grid` | Column grid — controlled via `--mts-form-cols` |
| `.mts-form--sm` / `.mts-form--lg` | Compact / spacious spacing |

### Helpers

| Class | Description |
|-------|-------------|
| `.mts-form-group` | Field wrapper (label + input + hint/error) |
| `.mts-form-group--full` / `--span-2` | Span all / 2 columns (grid mode) |
| `.mts-form-label` | Field label |
| `.mts-form-label--required` | Adds the red asterisk |
| `.mts-form-label--hidden` | Visually hidden but accessible |
| `.mts-form-hint` / `.mts-form-error` | Helper / error text below the field |
| `.mts-form-footer` / `--end` / `--between` | Button area (default / right / both ends) |
| `.mts-form-section` / `.mts-form-divider` | Section block / horizontal divider |
| `.mts-form-card` | Card wrapper with padding and border |

---

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--mts-form-gap` | `16px` | Space between fields |
| `--mts-form-label-width` | `160px` | Label width in horizontal mode |
| `--mts-form-cols` | `2` | Columns in grid mode |

---

## Responsive

All modes collapse to a stack on mobile (`< 576px`): horizontal → stack, inline → stacked fields, grid → 1 column.

---

## Accessibility

- Use `--hidden` to keep a label accessible while hiding it visually instead of removing it.
- Pair every input with a `.mts-form-label` (and tie them with `for`/`id`) so each field has an accessible name.

---

## Changelog

### Initial
- Pure-CSS form layout system: stack/horizontal/inline/grid patterns, size variants, field/footer/section/card
  helpers, responsive collapse, and `--mts-form-gap` / `--mts-form-label-width` / `--mts-form-cols` variables.
