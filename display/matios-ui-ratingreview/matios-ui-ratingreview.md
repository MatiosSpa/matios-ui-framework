# MTS.RatingReview

Rating review widget with average score, star display, breakdown bars and optional interactive voting.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-ratingreview.css">
<script src="matios-ui-ratingreview.js"></script>
```

---

## Usage

```js
// Read-only — shows score and breakdown
new MTS.RatingReview('#my-widget', {
  average:   4.3,
  total:     1284,
  size:      'md',
  breakdown: { 5: 720, 4: 380, 3: 120, 2: 48, 1: 16 },
});

// Interactive — the user can rate
new MTS.RatingReview('#my-widget', {
  average:     4.3,
  total:       1284,
  breakdown:   { 5: 720, 4: 380, 3: 120, 2: 48, 1: 16 },
  interactive: true,
  onRate: function (e) {
    fetch('/api/rate', { method: 'POST', body: JSON.stringify({ stars: e.detail.stars }) });
  },
});

// Large size
new MTS.RatingReview('#my-widget', {
  average: 4.8, total: 523, breakdown: { 5: 480, 4: 30, 3: 8, 2: 3, 1: 2 }, size: 'lg',
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `average` | `number` | `0` | Average rating (1–5) |
| `total` | `number` | `0` | Total number of reviews |
| `breakdown` | `object` | `{5:0,4:0,3:0,2:0,1:0}` | Count per star |
| `interactive` | `boolean` | `false` | Show interactive voting stars |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` |
| `onRate` | `function` | — | Fires when the user rates — `({ stars })` |

---

## API

| Method | Description |
|--------|-------------|
| `update(options)` | Update data (average, total, breakdown) and re-render |
| `on(event, cb)` / `off(event, cb)` | Register / remove listeners (`'rate'`) |

```js
const widget = new MTS.RatingReview('#my-widget', { average: 4.3, total: 1284 });
widget.update({ average: 4.5, total: 1300, breakdown: { 5: 750, 4: 380, 3: 110, 2: 48, 1: 12 } });
widget.on('rate', function (e) { console.log(e.detail.stars); });
```

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onRate(fn)` / `on('rate', fn)` | `{ stars }` | The user clicks a star (when `interactive`) |

Also dispatched as a DOM event:

```js
document.getElementById('my-widget')
  .addEventListener('mts:ratingreview:rate', function (e) { console.log(e.detail.stars); });
```

---

## Accessibility

- In `interactive` mode the stars are keyboard-operable; convey the current value with text for assistive tech.
- The breakdown bars are a visual summary; the `average` and `total` carry the headline meaning.

---

## Changelog

### Initial
- Rating widget with average score, star display, per-star breakdown bars, optional interactive voting
  (`onRate`), sizes, and `update()`.
