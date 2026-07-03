# MTS.Countdown

Animated countdown timer with three variants, configurable units, custom labels and pause/resume control.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-countdown.css">

<!-- Optional: i18n (unit labels in en / pt). Load before the component. -->
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-countdown-i18n.js"></script>

<script src="matios-ui-countdown.js"></script>
```

The i18n scripts are optional. Without them the component uses its built-in Spanish
unit labels (`días` · `horas` · `min` · `seg`).

---

## Usage

```js
// Blocks variant (default)
const cd = new MTS.Countdown('#my-countdown', {
  target: new Date('2025-12-31T23:59:59'),
  variant: 'blocks',
  onComplete: function (e) { showConfetti(); },
});

// Compact — inline style with custom labels
new MTS.Countdown('#my-countdown', {
  target: new Date(Date.now() + 2 * 60 * 60 * 1000),
  variant: 'compact',
  labels: { days: 'd', hours: 'h', mins: 'm', secs: 's' },
});

// Minimal — numbers only, no days
new MTS.Countdown('#my-countdown', {
  target: new Date(Date.now() + 30 * 60 * 1000),
  variant: 'minimal',
  showDays: false,
  separator: ':',
});

// Tick handler
new MTS.Countdown('#my-countdown', {
  target: new Date(Date.now() + 60000),
  onTick: function (e) { updateProgressBar(e.detail.total); },
  onComplete: function () { notify('Time is up!'); },
});
```

The first argument is an element or a CSS selector string. The countdown starts
automatically on construction.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `target` | `Date \| string \| number` | — | Target date/time: `Date`, ISO string, or timestamp in ms (**required**) |
| `variant` | `string` | `'blocks'` | `'blocks'` · `'compact'` · `'minimal'` |
| `showDays` | `boolean` | `true` | Show the days unit |
| `showHours` | `boolean` | `true` | Show the hours unit |
| `showMins` | `boolean` | `true` | Show the minutes unit |
| `showSecs` | `boolean` | `true` | Show the seconds unit |
| `separator` | `string` | `':'` | Separator between blocks (used by `compact` / `minimal`) |
| `labels` | `object` | from i18n | Unit labels `{ days, hours, mins, secs }` — merged over the i18n defaults |
| `onTick` | `function` | — | Fires every second — receives `{ type, detail: { days, hours, mins, secs, total } }` |
| `onComplete` | `function` | — | Fires when the countdown reaches zero |

Notes:

- `labels` defaults come from the active language (namespace `MTS.Countdown`). Any key you
  pass overrides only that unit; the rest keep the i18n value.
- In the `minimal` variant labels are not rendered (numbers only); the `separator` is shown
  between blocks in `compact` and `minimal`, not in `blocks`.

---

## API

| Method | Description |
|--------|-------------|
| `start()` | Start the timer (no-op if already running) |
| `pause()` | Pause the timer |
| `resume()` | Resume the timer (alias of `start()`) |
| `setTarget(date)` | Change the target (`Date`, ISO string or timestamp) and refresh immediately |
| `on(event, cb)` | Register a listener (`'tick'`, `'complete'`) |
| `off(event, cb)` | Remove a listener |
| `destroy()` | Stop the timer and clear the element's DOM |

```js
const cd = new MTS.Countdown('#my-countdown', { target: '2026-01-01' });
cd.pause();
cd.resume();
cd.setTarget(Date.now() + 3600000); // 1 hour from now
```

All methods except `destroy()` return the instance, so they can be chained.

---

## Events

Listeners can be registered via the `onTick` / `onComplete` options or `on(event, cb)`.
Each callback receives `{ type, detail }`.

| Event | Payload (`detail`) | When |
|-------|--------------------|------|
| `tick` | `{ days, hours, mins, secs, total }` | Every second |
| `complete` | `{}` | Countdown reaches zero (timer auto-pauses) |

The same events are also dispatched as bubbling DOM `CustomEvent`s on the element:

```js
el.addEventListener('mts:countdown:tick', function (e) { console.log(e.detail); });
el.addEventListener('mts:countdown:complete', function () { console.log('done'); });
```

---

## i18n

Unit labels are localized through the shared MTS i18n layer under the namespace
`MTS.Countdown`. Set the language once at startup:

```js
MTS.setLanguage('en'); // 'es' (default) | 'en' | 'pt'
```

Built-in label keys:

| Key | es | en | pt |
|-----|----|----|----|
| `days` | `días` | `days` | `dias` |
| `hours` | `horas` | `hours` | `horas` |
| `mins` | `min` | `min` | `min` |
| `secs` | `seg` | `sec` | `seg` |

Override or add a language with `MTS.registerLocale`:

```js
MTS.registerLocale('en', {
  'MTS.Countdown': {
    days: 'd',
    hours: 'h',
    mins: 'm',
    secs: 's',
  },
});
```

A per-instance `labels` option always wins over the i18n values. There is no per-instance
`locale` option — language is global.

---

## Accessibility

- For a visible countdown that conveys urgency, wrap it in an `aria-live="polite"` region
  (or `off` if per-second updates would be too noisy for screen readers).
