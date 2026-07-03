# MTS.RatingReview

Rating review widget with average score, star display, breakdown bars and optional interactive voting.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-ratingreview.css">
<!-- optional: multilingual UI text (es / en / pt) -->
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-ratingreview-i18n.js"></script>
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
| `onRate` | `function` | — | Fires when the user rates (only in `interactive` mode); receives `e` where `e.detail.stars` is the chosen 1–5 value |

---

## API

| Method | Description |
|--------|-------------|
| `update(options)` | Merge the given options onto the instance and re-render. Accepts any option (`average`, `total`, `breakdown`, `interactive`, `size`). Returns the instance. |
| `on(event, cb)` | Register a listener. Only `'rate'` is emitted. Returns the instance. |
| `off(event, cb)` | Remove a previously registered listener. Returns the instance. |

```js
const widget = new MTS.RatingReview('#my-widget', {
  average: 4.3,
  total:   1284,
});

widget.update({
  average:   4.5,
  total:     1300,
  breakdown: { 5: 750, 4: 380, 3: 110, 2: 48, 1: 12 },
});

widget.on('rate', function (e) {
  console.log(e.detail.stars);
});
```

The instance fields `average`, `total`, `breakdown`, `interactive` and `size` are public and can be read directly (the demo reads `widget.total` / `widget.breakdown` to compute the next state before calling `update()`).

---

## Events

Only one event is emitted, and only when `interactive` is `true`.

| Event | Registration | Payload | When |
|-------|--------------|---------|------|
| `rate` | `onRate` option, or `on('rate', fn)` | `{ stars }` | The user clicks one of the interactive stars |

The `onRate` option is a shortcut registered as `on('rate', fn)` at construction.

Listener callbacks receive `{ type: 'rate', detail: { stars } }`. The same event is also dispatched on the host element as a bubbling DOM `CustomEvent` named `mts:ratingreview:rate`, whose `detail` is `{ stars }`:

```js
document.getElementById('my-widget')
  .addEventListener('mts:ratingreview:rate', function (e) {
    console.log(e.detail.stars);
  });
```

---

## i18n

UI text is resolved through the global language API. Load `matios-ui-i18n.js` and
`matios-ui-ratingreview-i18n.js`, then set the language once at startup:

```js
MTS.setLanguage('en'); // 'es' · 'en' · 'pt'
```

The component reads its chrome from `MTS.getString()['MTS.RatingReview']`. Keys:

| Key | `es` | `en` | `pt` |
|-----|------|------|------|
| `reviews` | reseñas | reviews | avaliações |
| `yourRating` | Tu calificación: | Your rating: | Sua avaliação: |

If the i18n files are not loaded, the built-in Spanish fallbacks are used. There is no
per-instance `locale` option — the language is global.

---

## Accessibility

- In `interactive` mode each star is a real `<button type="button">`, so the control is keyboard-operable; the `yourRating` label precedes the stars.
- The breakdown bars are a visual summary; the `average` and `total` carry the headline meaning.
