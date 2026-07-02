# MTS.Spinner

Animated loading indicator with 13 variants, five sizes, semantic or custom colors (up to three), label text and full-screen overlay mode.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-spinner.css">
<script src="matios-ui-spinner.js"></script>
```

`matios-ui-spinner.css` requires `matios-ui-base.css` and a loaded mode theme.

---

## Usage

```js
// Basic (default variant is 'ring')
new MTS.Spinner('#loading', { variant: 'clock', size: 'md' });

// With a label
new MTS.Spinner('#loading-label', { variant: 'bars', size: 'lg', label: 'Loading data...' });

// Custom color
new MTS.Spinner('#loading-custom', { variant: 'roller', color: '#7c3aed' });

// Multi-color (dual / orbital / triple)
new MTS.Spinner('#loading-dual', {
  variant: 'dual',
  color:   'var(--mts-color-primary)',
  color2:  'var(--mts-color-warning)',
});

// Full-screen overlay
const overlay = new MTS.Spinner('#loading-overlay', { variant: 'clock', size: 'xl', overlay: true, label: 'Processing...' });
overlay.show();
overlay.hide();
```

### HTML with `data-*`

```html
<div id="my-spinner" data-variant="activity" data-size="lg" data-color="warning" data-label="Loading..." data-overlay></div>
<script> new MTS.Spinner('#my-spinner'); </script>
```

Supported `data-*`: `data-variant`, `data-size`, `data-color`, `data-color2`, `data-color3`, `data-label`,
`data-overlay`. `data-overlay` is treated as a boolean (its presence enables the overlay). `options` always take
priority over `data-*`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `variant` | `string` | `'ring'` | Spinner type (see variants below) |
| `size` | `string` | `'md'` | `'xs'` · `'sm'` · `'md'` · `'lg'` · `'xl'` — scales the spinner via CSS `zoom` (0.20 / 0.30 / 0.45 / 0.60 / 0.80) |
| `color` | `string` | `null` | Semantic tone (`'warning'` / `'danger'` / `'success'` / `'muted'`) or any CSS color value |
| `color2` | `string` | `null` | Secondary color — `dual`, `orbital`, `triple` (inherits `color` if unset) |
| `color3` | `string` | `null` | Tertiary color — `orbital`, `triple` (inherits `color` if unset) |
| `label` | `string` | `''` | Text below the spinner |
| `overlay` | `boolean` | `false` | Full-screen overlay with a semi-transparent backdrop |

### Variants

`ring` (default) · `dual` · `triple` · `orbital` · `dots` · `bars` · `roller` · `clock` · `ellipsis` · `grid` ·
`ripple` · `activity` · `bounce`. `dual` / `orbital` / `triple` render multiple independent rings and support
`color2` / `color3`.

---

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `show()` | `this` | Show the spinner (chainable) |
| `hide()` | `this` | Hide the spinner (chainable) |
| `destroy()` | `void` | Empty the element and remove all classes |

```js
const sp = new MTS.Spinner('#my-spinner', { variant: 'bars', size: 'lg' });
sp.hide();
sp.show();
sp.destroy();
```

---

## CSS Variables

The component exposes three custom properties, overridable on the container:

| Variable | Default | Use |
|----------|---------|-----|
| `--mts-spinner-color` | `var(--mts-color-primary)` | Main color — all variants |
| `--mts-spinner-color-2` | `var(--mts-spinner-color)` | Secondary — `dual`, `orbital`, `triple` |
| `--mts-spinner-color-3` | `var(--mts-spinner-color)` | Tertiary — `orbital`, `triple` |

---

## Accessibility

- The component does not set ARIA attributes itself. Mark the loading region with `aria-busy="true"` and provide a
  `label` (or `aria-label`) so the spinner has an accessible name; announce when loading completes.
