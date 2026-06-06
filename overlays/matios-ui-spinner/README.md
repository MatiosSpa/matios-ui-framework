# MTS.Spinner

Animated loading indicators — multiple variants, five sizes, semantic/custom colors (up to three tones), label and full-screen overlay.

> The canonical, up-to-date documentation lives in
> [`matios-ui-spinner.md`](./matios-ui-spinner.md) — Installation, Usage, Options, API, CSS Variables, Accessibility
> and Changelog. This README is a short pointer.

## Quick start

```html
<link rel="stylesheet" href="matios-ui-spinner.css">
<script src="matios-ui-spinner.js"></script>

<div id="my-spinner"></div>
<script> new MTS.Spinner('#my-spinner', { variant: 'clock' }); </script>
```

Default variant is `'ring'`. Available variants: `ring`, `dual`, `triple`, `orbital`, `dots`, `bars`, `roller`,
`clock`, `ellipsis`, `grid`, `ripple`, `activity`, `bounce`. See `matios-ui-spinner.md` for the full reference.
