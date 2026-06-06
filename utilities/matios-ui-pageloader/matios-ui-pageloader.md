# MTS.PageLoader

NProgress-style page loading indicator. A fixed bar at the top or bottom of the screen with automatic trickle. Three modes: bar only, full overlay with spinner or progress, or both at once.

**Dependencies:** `MTS.Progress`, `MTS.Spinner`.

---

## Installation

```html
<link rel="stylesheet" href="forms/matios-ui-progress/matios-ui-progress.css">
<link rel="stylesheet" href="forms/matios-ui-spinner/matios-ui-spinner.css">
<link rel="stylesheet" href="utilities/matios-ui-pageloader/matios-ui-pageloader.css">

<script src="forms/matios-ui-progress/matios-ui-progress.js"></script>
<script src="forms/matios-ui-spinner/matios-ui-spinner.js"></script>
<script src="utilities/matios-ui-pageloader/matios-ui-pageloader.js"></script>
```

---

## Usage

```js
// Bar
const loader = new MTS.PageLoader({ mode: 'bar' });
loader.start();
fetch('/api/data')
  .then(function (res) { return res.json(); })
  .then(function (data) { loader.done(); })
  .catch(function () { loader.error(); });

// Blocker (overlay with spinner)
new MTS.PageLoader({ mode: 'blocker', backdropOpacity: 0.7, blur: true, loader: { variant: 'ring', size: 'lg' } });

// Blocker with a progress circle
new MTS.PageLoader({ mode: 'blocker', loader: { type: 'circle', size: 'lg', variant: 'primary' } });

// Bar + blocker at once
new MTS.PageLoader({ mode: 'both', position: 'top', variant: 'primary' });

// Bottom bar, success variant
new MTS.PageLoader({ mode: 'bar', position: 'bottom', variant: 'success', trickleSpeed: 600 });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mode` | `string` | `'bar'` | `'bar'` · `'blocker'` · `'both'` |
| `position` | `string` | `'top'` | Bar position: `'top'` · `'bottom'` |
| `variant` | `string` | `'primary'` | Color variant for bar and loader |
| `minimum` | `number` | `0.08` | Initial value on `start()` (0–1) |
| `trickle` | `boolean` | `true` | Enable automatic advance |
| `trickleSpeed` | `number` | `400` | Interval (ms) between trickle steps |
| `speed` | `number` | `200` | Fade-out duration (ms) on complete |
| `blur` | `boolean` | `false` | Add a blur effect to the blocker backdrop |
| `backdropOpacity` | `number` | `0.85` | Blocker backdrop opacity (0–1) |
| `bar` | `object` | `null` | Extra options for the `MTS.Progress` bar |
| `loader` | `object` | `null` | Center loader. Without `type` → `MTS.Spinner` (`variant` = type). With `type: 'circle'` → `MTS.Progress` (`variant` = color). |

---

## API

| Method | Description |
|--------|-------------|
| `start()` | Show the loader and begin the automatic trickle |
| `done()` | Complete to 100% and fade out |
| `error()` | Complete in the danger color and fade out |
| `set(n)` | Set progress manually (0–1) |
| `increment(n)` | Add to the current value |
| `destroy()` | Destroy the component and clear the DOM |

```js
const loader = new MTS.PageLoader({ mode: 'bar' });
loader.start();
loader.set(0.6);
loader.done();
```

---

## Notes

- The bar and blocker are injected into `document.body` automatically — no prior markup required.
- The trickle uses natural damping (`remaining * 0.1`) — it slows as it nears 1 and never reaches 100% on its own;
  only `done()` / `error()` complete it.
- `error()` adds `mts-pageloader__bar-wrap--error`, overriding the fill color to danger.
- `backdropOpacity` controls the backdrop opacity without affecting the center spinner/progress; `blur: true` applies
  `backdrop-filter: blur(8px)`.

---

## Accessibility

- For the blocker mode, mark the page region `aria-busy="true"` while loading and restore focus when done.

---

## Changelog

### 2026-05-17
- Install paths corrected to full paths from the framework root.
