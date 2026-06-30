# matios-ui-base

The foundation of the entire MTS framework. Defines the **design tokens**, the **reset**, the **theme system** and the **utilities** every component uses.

---

## Installation

Include this file before any other MTS CSS:

```html
<link rel="stylesheet" href="matios-ui-base.css">
<!-- then the components -->
<link rel="stylesheet" href="matios-ui-grid.css">
```

---

## Themes

The theme system works through the `data-mts-theme` attribute on any container. Set it on `<html>` or `<body>` to
apply globally.

| Value | Description |
|-------|-------------|
| `light` | Light (default) |
| `dark` | Dark |
| `ocean` | Ocean blue (example custom theme) |

```html
<html data-mts-theme="dark">
```

```js
// Change the theme globally
document.documentElement.setAttribute('data-mts-theme', 'dark');

// Toggle dark/light
const current = document.documentElement.getAttribute('data-mts-theme');
document.documentElement.setAttribute('data-mts-theme', current === 'dark' ? 'light' : 'dark');
```

### Create your own theme

Copy this block into your CSS and redefine only the variables you need:

```css
[data-mts-theme="my-theme"] {
  --mts-color-primary:       #7c3aed;
  --mts-color-primary-hover: #6d28d9;
  --mts-color-accent:        #f59e0b;
  --mts-bg-body:             #faf5ff;
}
```

---

## Design tokens

All CSS variables under the `--mts-` prefix.

### Colors

```css
/* Primary */
--mts-color-primary  --mts-color-primary-hover  --mts-color-primary-active  --mts-color-primary-light  --mts-color-primary-text
/* Accent */
--mts-color-accent  --mts-color-accent-hover  --mts-color-accent-text
/* Semantic (each with -light and -text variants) */
--mts-color-success  --mts-color-warning  --mts-color-danger  --mts-color-info
/* Grays (50 lightest → 900 darkest) */
--mts-gray-50 … --mts-gray-900
```

### Surfaces & text

```css
--mts-bg-body        /* page background */
--mts-bg-surface     /* card / panel background */
--mts-bg-surface-2   /* alternate background (zebra, hover) */

--mts-text-primary   --mts-text-secondary  --mts-text-muted  --mts-text-disabled  --mts-text-inverse
```

### Typography

```css
--mts-font-family    --mts-font-mono
/* Sizes */ --mts-font-size-xs (11) · -sm (13) · -md (14, base) · -lg (16) · -xl (20) · -2xl (24) · -3xl (30)
/* Weights */ --mts-font-weight-normal (400) · -medium (500) · -semibold (600) · -bold (700)
```

### Spacing, radius, shadow

```css
/* Spacing */ --mts-space-1 (4px) · -2 (8) · -3 (12) · -4 (16) · -5 (20) · -6 (24) · -8 (32) · -10 (40) · -12 (48)
/* Radius */  --mts-radius-xs (2) · -sm (4) · -md (6) · -lg (10, cards) · -xl (16) · -full (9999, pills/avatars)
/* Shadow */  --mts-shadow-xs · -sm · -md (cards, dropdowns) · -lg (modals, popovers) · -xl (drawers, large overlays)
```

### Z-index

```css
--mts-z-base     /* 1   */
--mts-z-dropdown /* 100 — dropdowns within their own stacking context */
--mts-z-sticky   /* 200 */
--mts-z-overlay  /* 300 — modal backdrop */
--mts-z-modal    /* 400 */
--mts-z-popover  /* 500 — portals that must float over the modal (dropdowns, pickers, autocomplete) */
--mts-z-toast    /* 600 */
--mts-z-tooltip  /* 700 */
```

### Transitions

```css
--mts-transition-fast  /* 0.12s ease */
--mts-transition-base  /* 0.20s ease */
--mts-transition-slow  /* 0.35s ease */
```

---

## Component classes

### Panel `.mts-panel`

Main container for each application section: `.mts-panel__header` / `__title` / `__subtitle` / `__actions` / `__body`,
plus `.mts-separator`.

```html
<div class="mts-panel">
  <div class="mts-panel__header">
    <div><h1 class="mts-panel__title">Section title</h1><p class="mts-panel__subtitle">Optional description</p></div>
    <div class="mts-panel__actions"><button class="mts-btn mts-btn--primary">+ New</button></div>
  </div>
  <hr class="mts-separator">
  <div class="mts-panel__body"><!-- content --></div>
</div>
```

### Surface `.mts-surface`

Bordered, filled block to group content: base, `--elevated` (shadow, no border), `--flat` (square corners).

### Layout `.mts-layout`

App shell with a sidebar: `.mts-layout__sidebar` / `__main` / `__topbar` / `__content` / `__footer`. Collapse the
sidebar by toggling `.mts-layout__sidebar--collapsed`.

---

## Buttons `.mts-btn`

```html
<!-- Variants -->
<button class="mts-btn mts-btn--primary">Primary</button>
<button class="mts-btn mts-btn--secondary">Secondary</button>
<button class="mts-btn mts-btn--ghost">Ghost</button>
<button class="mts-btn mts-btn--danger">Delete</button>
<button class="mts-btn mts-btn--link">Link</button>

<!-- Sizes: --xs, --sm, (default), --lg, --xl. Modifiers: --block, --round, --icon -->
<button class="mts-btn mts-btn--primary mts-btn--lg mts-btn--block">Full width</button>
<button class="mts-btn mts-btn--primary" disabled>Disabled</button>
```

---

## Forms

```html
<div class="mts-form-group">
  <label class="mts-label mts-label--required">Name</label>
  <input type="text" class="mts-input" placeholder="Enter your name">
  <span class="mts-form-hint">Minimum 3 characters</span>
</div>

<div class="mts-form-group">
  <label class="mts-label">Email</label>
  <input type="email" class="mts-input mts-input--error" value="invalid">
  <span class="mts-form-error">Enter a valid email</span>
</div>
```

Also: `.mts-textarea`, `.mts-select`.

---

## Loaders & skeleton

```html
<span class="mts-spinner"></span>
<span class="mts-spinner mts-spinner--sm"></span>

<div class="mts-skeleton mts-skeleton--title"></div>
<div class="mts-skeleton mts-skeleton--text"></div>
```

---

## Typography & layout utilities

```html
<h1 class="mts-h1">Heading 1</h1>
<p class="mts-text-muted mts-text-sm">Small muted text</p>
<span class="mts-text-danger mts-text-bold">Important error</span>
<code class="mts-mono">code.example()</code>

<!-- Flex -->
<div class="mts-d-flex mts-items-center mts-justify-between mts-gap-3"><span>Left</span><span>Right</span></div>

<!-- Responsive helpers -->
<span class="mts-hide-mobile">Desktop only</span>

<!-- Spacing -->
<div class="mts-mb-4 mts-p-3">…</div>
```

Layout utilities include: `mts-d-flex`, `mts-flex-col`, `mts-flex-1`, `mts-gap-*`, `mts-items-center`,
`mts-justify-between`, `mts-h-full`, `mts-vh-100`, `mts-min-w-0`, `mts-min-h-0`, `mts-overflow-hidden`, `mts-p-0`,
`mts-mb-*`, `mts-mono`, `mts-truncate`, `mts-hide-mobile` / `mts-hide-tablet`.

---

## matios-ui-base.js — shared JS

Base JS file of the framework. Load it **before** the components that require it.

```html
<script src="base/matios-ui-base.js"></script>
<script src="widgets/boards/matios-ui-gantt-chart/matios-ui-gantt-chart.js"></script>
```

### `MTS._defineEvents(instance, eventNames, opts)`

Mixin that generates the explicit event API on any component.

| Parameter | Type | Description |
|-----------|------|-------------|
| `instance` | `object` | The component instance (`this` in the constructor) |
| `eventNames` | `string[]` | Event names in camelCase |
| `opts` | `object` | Constructor options — registers `opts.onXxxx` automatically |

It adds to `instance`: `onXxxx(handler)` → returns `dispose()`; `_emit(name, payload)`; and
`_disposeAllListeners()` (call in `destroy()`).

```js
function MyComponent(el, opts) {
  this._el = typeof el === 'string' ? document.querySelector(el) : el;
  MTS._defineEvents(this, ['load', 'itemAdd', 'itemRemove'], opts);
}

const comp = new MyComponent('#host', { onLoad: function (e) { console.log('loaded', e); } });
const disposeAdd = comp.onItemAdd(function (e) { persist(e.item); });
disposeAdd(); // unsubscribe

MyComponent.prototype.destroy = function () { this._disposeAllListeners(); /* … */ };
```

---

## Accessibility

- Tokens drive contrast; when adding a custom theme keep text/surface pairs above WCAG AA contrast.
- Respect `prefers-reduced-motion` for the loaders/skeleton animations in your app shell.

---

## Changelog

### 2026-06-29
- Global themed scrollbar: thin, token-driven, applied to the document and any scrollable container, so every page/demo
  adapts to dark/light/accent instead of showing the default browser scrollbar. Thumb uses `--mts-border-color-strong`
  over a faint `--mts-bg-surface-2` track, with a `background-clip: padding-box` gap so it reads as a defined pill
  (more distinguishable than a flush thumb); `--mts-color-primary` on hover. Components with their own scroll
  (`MTS.Scroll`, `MTS.Shell`) override the thumb width.

### 2026-05-29
- `matios-ui-base.js` created — `MTS._defineEvents` mixin for the explicit event API (Boards Kit).
- Token `--mts-z-popover: 500` added to the z-index stack; toast 500→600, tooltip 600→700.
