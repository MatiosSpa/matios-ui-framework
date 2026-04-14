# MTS.Badge

[EN] Badge, pill and counter component. Works via CSS classes alone or with JS for dynamic counters, removable tags and notification dots.
[ES] Componente de badge, pill y contador. Funciona con clases CSS solas o con JS para contadores dinámicos, tags removibles y dots de notificación.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-badge.css">
<script src="matios-ui-badge.js"></script>
```

---

## CSS Only / Solo CSS

[EN] No JS needed for static badges — just add classes.
[ES] Sin JS para badges estáticos — solo agrega clases.

```html
<!-- Variants / Variantes -->
<span class="mts-badge">Default</span>
<span class="mts-badge mts-badge--primary">Primary</span>
<span class="mts-badge mts-badge--success">Active</span>
<span class="mts-badge mts-badge--warning">Pending</span>
<span class="mts-badge mts-badge--danger">Error</span>
<span class="mts-badge mts-badge--info">Info</span>

<!-- Sizes / Tamaños -->
<span class="mts-badge mts-badge--xs">XS</span>
<span class="mts-badge mts-badge--sm">SM</span>
<span class="mts-badge mts-badge--lg">LG</span>

<!-- Dot notification / Dot de notificación -->
<span class="mts-badge mts-badge--danger mts-badge--dot mts-badge--pulse"></span>
```

---

## Options / Opciones (JS)

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `label` | `string` | element text | [EN] Badge text / [ES] Texto del badge |
| `count` | `number` | `null` | [EN] Numeric counter / [ES] Contador numérico |
| `maxCount` | `number` | `99` | [EN] Max before showing "99+" / [ES] Máximo antes de mostrar "99+" |
| `dot` | `boolean` | `false` | [EN] Dot only, no text / [ES] Solo punto, sin texto |
| `variant` | `string` | `'default'` | `'default'` · `'primary'` · `'success'` · `'warning'` · `'danger'` · `'info'` · `'accent'` |
| `shape` | `string` | `'pill'` | `'pill'` · `'square'` · `'dot'` |
| `size` | `string` | `'md'` | `'xs'` · `'sm'` · `'md'` · `'lg'` |
| `removable` | `boolean` | `false` | [EN] Show remove button / [ES] Mostrar botón de remover |
| `pulse` | `boolean` | `false` | [EN] Pulse animation (for notification dots) / [ES] Animación de pulso |
| `onRemove` | `function` | — | [EN] Fires when remove button is clicked / [ES] Se dispara al hacer click en remover |

---

## Events / Eventos

```js
new MTS.Badge('#my-badge', {
  label:    'TypeScript',
  removable: true,
  // Fires when remove button is clicked / Se dispara al hacer click en remover
  onRemove: (e) => {
    console.log(e.detail.badge); // → MTS.Badge instance
  },
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// Dynamic counter / Contador dinámico
const badge = new MTS.Badge('#badge-inbox', {
  count:    42,
  maxCount: 99,   // shows "99+" above / muestra "99+" si supera
  variant:  'danger',
});
badge.setCount(100); // → shows "99+" / muestra "99+"
badge.setCount(0);   // → hides (zero state) / oculta (estado cero)

// Removable tag / Tag removible
new MTS.Badge('#tag-ts', {
  label:     'TypeScript',
  variant:   'primary',
  removable: true,
  // Fires on remove / Se dispara al remover
  onRemove:  (e) => e.detail.badge._el.remove(),
});

// Notification dot with pulse / Dot de notificación con pulso
new MTS.Badge('#btn-notifications', {
  dot:     true,
  pulse:   true,
  variant: 'danger',
});

// Static label / Label estático
new MTS.Badge('#status-badge', {
  label:   'Active',
  variant: 'success',
  shape:   'pill',
  size:    'sm',
});
```

---

## API

```js
const badge = new MTS.Badge('#my-badge', { ... });

// Update counter / Actualizar contador
badge.setCount(5)
badge.setCount(0)    // hides badge / oculta el badge
badge.setCount(null) // removes counter / elimina el contador

// Update label / Actualizar label
badge.setLabel('Updated')

// Register listeners / Registrar listeners
badge.on('remove', (e) => console.log(e.detail.badge))
badge.off('remove', handler)
```

---

## Static Methods / Métodos estáticos

```js
// Render a badge HTML string / Renderizar un string HTML de badge
MTS.Badge.render({ label: 'NEW', variant: 'primary', size: 'sm' })
// → '<span class="mts-badge mts-badge--primary mts-badge--sm">NEW</span>'
```

---

## DOM Event / Evento DOM

```js
document.getElementById('my-badge')
  .addEventListener('mts:badge:remove', (e) => {
    console.log(e.detail.badge);
  });
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] `onRemove` normalized to `.on()`, bilingual docs / [ES] `onRemove` normalizado a `.on()`, docs bilingüe |
| 1.0.0 | [EN] Initial release — CSS variants, JS counter, removable, pulse dot / [ES] Versión inicial |
