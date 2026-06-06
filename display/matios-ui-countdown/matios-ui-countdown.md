# MTS.Countdown

Animated countdown timer with three variants, configurable units, custom labels and pause/resume control.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-countdown.css">
<script src="matios-ui-countdown.js"></script>
```

---

## Usage

```js
// Blocks variant (default)
const cd = new MTS.Countdown('#my-countdown', {
  target:  new Date('2025-12-31T23:59:59'),
  variant: 'blocks',
  onComplete: function (e) { showConfetti(); },
});

// Compact — inline style with custom labels
new MTS.Countdown('#my-countdown', {
  target:  new Date(Date.now() + 2 * 60 * 60 * 1000),
  variant: 'compact',
  labels:  { days: 'd', hours: 'h', mins: 'm', secs: 's' },
});

// Minimal — numbers only, no days
new MTS.Countdown('#my-countdown', {
  target:    new Date(Date.now() + 30 * 60 * 1000),
  variant:   'minimal',
  showDays:  false,
  separator: ':',
});

// Tick handler
new MTS.Countdown('#my-countdown', {
  target: new Date(Date.now() + 60000),
  onTick:     function (e) { updateProgressBar(e.detail.total); },
  onComplete: function ()  { notify('Time is up!'); },
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `target` | `Date \| string \| number` | — | Target date (**required**) |
| `variant` | `string` | `'blocks'` | `'blocks'` · `'compact'` · `'minimal'` |
| `showDays` | `boolean` | `true` | Show the days unit |
| `showHours` | `boolean` | `true` | Show the hours unit |
| `showMins` | `boolean` | `true` | Show the minutes unit |
| `showSecs` | `boolean` | `true` | Show the seconds unit |
| `separator` | `string` | `':'` | Separator between blocks |
| `labels` | `object` | `{ days, hours, mins, secs }` | Custom unit labels |
| `onTick` | `function` | — | Fires every second — `({ days, hours, mins, secs, total })` |
| `onComplete` | `function` | — | Fires when the countdown reaches zero |

---

## API

| Method | Description |
|--------|-------------|
| `pause()` / `resume()` | Pause / resume the timer |
| `setTarget(date)` | Change the target (`Date`, ISO string or timestamp) |
| `on(event, cb)` / `off(event, cb)` | Register / remove listeners (`'tick'`, `'complete'`) |
| `destroy()` | Stop the timer and clear the DOM |

```js
const cd = new MTS.Countdown('#my-countdown', { target: '2026-01-01' });
cd.pause();
cd.resume();
cd.setTarget(Date.now() + 3600000); // 1 hour from now
```

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onTick(fn)` / `on('tick', fn)` | `{ days, hours, mins, secs, total }` | Every second |
| `onComplete(fn)` / `on('complete', fn)` | — | Countdown reaches zero |

Also dispatched as DOM events:

```js
el.addEventListener('mts:countdown:tick',     function (e) { console.log(e.detail); });
el.addEventListener('mts:countdown:complete', function ()  { console.log('done'); });
```

---

## Accessibility

- For a visible countdown that conveys urgency, wrap it in an `aria-live="polite"` region (or `off` if updates
  every second would be too noisy for screen readers).

---

## Changelog

### Initial
- Countdown timer with `blocks` / `compact` / `minimal` variants, configurable units, custom labels, separator,
  `onTick` / `onComplete`, and `pause` / `resume` / `setTarget` / `destroy`.
