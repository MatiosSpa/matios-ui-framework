# MTS.Countdown

🇬🇧 Animated countdown timer with three variants, configurable units, custom labels and pause/resume control.
🇪🇸 Contador regresivo animado con tres variantes, unidades configurables, labels personalizados y control de pause/resume.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-countdown.css">
<script src="matios-ui-countdown.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `target` | `Date\|string\|number` | — | 🇬🇧 Target date (required) / 🇪🇸 Fecha objetivo (requerido) |
| `variant` | `string` | `'blocks'` | `'blocks'` · `'compact'` · `'minimal'` |
| `showDays` | `boolean` | `true` | 🇬🇧 Show days unit / 🇪🇸 Mostrar días |
| `showHours` | `boolean` | `true` | 🇬🇧 Show hours unit / 🇪🇸 Mostrar horas |
| `showMins` | `boolean` | `true` | 🇬🇧 Show minutes unit / 🇪🇸 Mostrar minutos |
| `showSecs` | `boolean` | `true` | 🇬🇧 Show seconds unit / 🇪🇸 Mostrar segundos |
| `separator` | `string` | `':'` | 🇬🇧 Separator between blocks / 🇪🇸 Separador entre bloques |
| `labels` | `object` | `{ days, hours, mins, secs }` | 🇬🇧 Custom unit labels / 🇪🇸 Labels de unidades |
| `onTick` | `function` | — | 🇬🇧 `({ days, hours, mins, secs, total }) => {}` Fires every second / 🇪🇸 Se dispara cada segundo |
| `onComplete` | `function` | — | 🇬🇧 Fires when countdown reaches zero / 🇪🇸 Se dispara al llegar a cero |

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
