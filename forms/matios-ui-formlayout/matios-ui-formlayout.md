# MTS.FormLayout

Form layout system — pure CSS, no JavaScript. Controls how fields, labels and inputs are distributed. There is no `MTS.FormLayout` constructor: you apply the classes below directly to your markup.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-formlayout.css">
```

`matios-ui-base.css` provides the design tokens (spacing, colors, typography) the layout reads via CSS variables. The `.mts-input` / `.mts-btn` classes used in the examples come from the input and button components — load their stylesheets too if you use them.

---

## Usage

### Stack (default) — label above, input below

```html
<form class="mts-form">
  <div class="mts-form-group">
    <label class="mts-form-label mts-form-label--required" for="name">Full name</label>
    <input class="mts-input" id="name" placeholder="John Doe">
  </div>
  <div class="mts-form-group">
    <label class="mts-form-label" for="email">Email</label>
    <input class="mts-input" id="email" type="email">
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

A field can also span a fixed number of columns with `.mts-form-group--span-2` or `.mts-form-group--span-3`.

### Horizontal — label left, field right (`--mts-form-label-width`)

```html
<form class="mts-form mts-form--horizontal">
  <div class="mts-form-group"><label class="mts-form-label">Email</label><input class="mts-input" type="email"></div>
</form>
```

Override the label column width per form with `style="--mts-form-label-width:200px"`.

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

### Field helpers

| Class | Description |
|-------|-------------|
| `.mts-form-group` | Field wrapper (label + input + hint/error) |
| `.mts-form-group--full` | Span all columns (grid mode) |
| `.mts-form-group--span-2` / `--span-3` | Span 2 / 3 columns (grid mode) |
| `.mts-form-label` | Field label |
| `.mts-form-label--required` | Adds the red asterisk |
| `.mts-form-label--hidden` | Visually hidden but accessible (inline mode) |
| `.mts-form-hint` / `.mts-form-error` | Helper / error text below the field |

### Footer, sections and card

| Class | Description |
|-------|-------------|
| `.mts-form-footer` | Button area |
| `.mts-form-footer--start` / `--end` / `--between` | Align buttons left / right / both ends |
| `.mts-form-section` | Section block (stacks its fields) |
| `.mts-form-section__title` / `__desc` | Section heading / description |
| `.mts-form-divider` | Horizontal divider (spans all grid columns) |
| `.mts-form-card` | Card wrapper with padding and border |
| `.mts-form-card__header` | Card header block (bottom border) |
| `.mts-form-card__title` / `__subtitle` | Card title / subtitle |

---

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--mts-form-gap` | `16px` | Space between fields |
| `--mts-form-label-width` | `160px` | Label width in horizontal mode |
| `--mts-form-cols` | `2` | Columns in grid mode |

Set them per form with an inline `style` (e.g. `style="--mts-form-cols:3"`) or globally on `:root`. The `.mts-form--sm` and `.mts-form--lg` modifiers change `--mts-form-gap` to `8px` and `24px` respectively.

---

## Responsive

All modes collapse to a stack on mobile (`< 576px`): horizontal → stack, inline → stacked fields, grid → 1 column (`--full` / `--span-2` / `--span-3` all fall back to a single column).

---

## Accessibility

- Use `.mts-form-label--hidden` to keep a label accessible while hiding it visually instead of removing it.
- Pair every input with a `.mts-form-label` (and tie them with `for` / `id`) so each field has an accessible name.

---

## i18n

`MTS.FormLayout` is a pure-CSS class system with **no localizable runtime strings** — it has no JavaScript and renders no chrome of its own. Every visible string (labels, hints, buttons, section and card text) is markup you write, so localize it wherever you build the form.

The sibling `matios-ui-formlayout-i18n.js` (namespace `MTS.FormLayout`) exists **only** to translate the `demo.html` page; it registers `MTS.FormLayout.demo.*` keys for `es` / `en` / `pt` and is not needed in production. The framework-wide language surface is `MTS.setLanguage(lang)` at startup plus `MTS.getLanguage()` / `MTS.getString()`; this component reads none of it.
