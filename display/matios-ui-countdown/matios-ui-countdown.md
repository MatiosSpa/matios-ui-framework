# MTS.Countdown

[EN] Animated countdown timer with three variants, configurable units, custom labels and pause/resume control.
[ES] Contador regresivo animado con tres variantes, unidades configurables, labels personalizados y control de pause/resume.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-countdown.css">
<script src="matios-ui-countdown.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `target` | `Date\|string\|number` | — | [EN] Target date (required) / [ES] Fecha objetivo (requerido) |
| `variant` | `string` | `'blocks'` | `'blocks'` · `'compact'` · `'minimal'` |
| `showDays` | `boolean` | `true` | [EN] Show days unit / [ES] Mostrar días |
| `showHours` | `boolean` | `true` | [EN] Show hours unit / [ES] Mostrar horas |
| `showMins` | `boolean` | `true` | [EN] Show minutes unit / [ES] Mostrar minutos |
| `showSecs` | `boolean` | `true` | [EN] Show seconds unit / [ES] Mostrar segundos |
| `separator` | `string` | `':'` | [EN] Separator between blocks / [ES] Separador entre bloques |
| `labels` | `object` | `{ days, hours, mins, secs }` | [EN] Custom unit labels / [ES] Labels de unidades |
| `onTick` | `function` | — | [EN] `({ days, hours, mins, secs, total }) => {}` Fires every second / [ES] Se dispara cada segundo |
| `onComplete` | `function` | — | [EN] Fires when countdown reaches zero / [ES] Se dispara al llegar a cero |

---

## Events / Eventos

```js
new MTS.Countdown('#my-countdown', {
  target: new Date(Date.now() + 24 * 60 * 60 * 1000),
  // Fires every second / Se dispara cada segundo
  onTick: (e) => {
    console.log(e.detail.days);  // → 0
    console.log(e.detail.hours); // → 23
    console.log(e.detail.mins);  // → 59
    console.log(e.detail.secs);  // → 42
    console.log(e.detail.total); // → ms remaining
  },
  // Fires when reaches zero / Se dispara al llegar a cero
  onComplete: (e) => console.log('Done!'),
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// Blocks variant (default) / Variante bloques
const cd = new MTS.Countdown('#my-countdown', {
  target:  new Date('2025-12-31T23:59:59'),
  variant: 'blocks',
  onComplete: (e) => showConfetti(),
});

// Compact — inline style / Estilo inline
new MTS.Countdown('#my-countdown', {
  target:  new Date(Date.now() + 2 * 60 * 60 * 1000),
  variant: 'compact',
  labels:  { days: 'd', hours: 'h', mins: 'm', secs: 's' },
});

// Minimal — only numbers / Solo números
new MTS.Countdown('#my-countdown', {
  target:    new Date(Date.now() + 30 * 60 * 1000),
  variant:   'minimal',
  showDays:  false,
  separator: ':',
});

// With tick handler / Con handler de tick
new MTS.Countdown('#my-countdown', {
  target:   new Date(Date.now() + 60000),
  onTick:   (e) => updateProgressBar(e.detail.total),
  onComplete: () => alert('Time is up!'),
});
```

---

## API

```js
const cd = new MTS.Countdown('#my-countdown', { target: ... });

// Pause / resume / Pausar / reanudar
cd.pause()
cd.resume()

// Change target / Cambiar objetivo
cd.setTarget(new Date('2026-01-01'))
cd.setTarget(Date.now() + 3600000)  // 1 hour from now

// Register listeners / Registrar listeners
cd.on('tick',     (e) => console.log(e.detail.secs))
cd.on('complete', (e) => console.log('done'))
cd.off('tick',    handler)

// Destroy / Destruir
cd.destroy()
```

---

## DOM Events / Eventos DOM

```js
el.addEventListener('mts:countdown:tick',     (e) => console.log(e.detail));
el.addEventListener('mts:countdown:complete',  () => console.log('done'));
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] `onTick`/`onComplete` normalized to `.on()`, bilingual docs / [ES] Normalizados a `.on()`, docs bilingüe |
| 1.0.0 | [EN] Initial release — blocks/compact/minimal, pause/resume / [ES] Versión inicial |
