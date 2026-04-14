# MTS.Card

[EN] Generic card with header, body, footer, cover image, variants, hover/click states and action buttons. Works via CSS classes alone or with JS.
[ES] Card genérica con header, body, footer, imagen de portada, variantes, estados hover/click y botones de acción. Funciona con clases CSS solas o con JS.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-card.css">
<script src="matios-ui-card.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `title` | `string` | `null` | [EN] Header title / [ES] Título del header |
| `subtitle` | `string` | `null` | [EN] Header subtitle / [ES] Subtítulo del header |
| `body` | `string` | `null` | [EN] Body HTML / [ES] HTML del cuerpo |
| `image` | `string` | `null` | [EN] Cover image URL / [ES] URL de imagen de portada |
| `imageAlt` | `string` | `''` | [EN] Image alt text / [ES] Texto alternativo |
| `imageRatio` | `string` | `'default'` | `'default'` · `'square'` · `'wide'` |
| `variant` | `string` | `null` | `'flat'` · `'elevated'` · `'outlined'` · `'primary'` · `'success'` · `'warning'` · `'danger'` |
| `size` | `string` | `''` | `''` · `'sm'` · `'lg'` |
| `hoverable` | `boolean` | `false` | [EN] Show hover lift effect / [ES] Efecto de elevación al hover |
| `clickable` | `boolean` | `false` | [EN] Make card clickable / [ES] Hacer la card clickeable |
| `selected` | `boolean` | `false` | [EN] Selected state / [ES] Estado seleccionado |
| `horizontal` | `boolean` | `false` | [EN] Horizontal layout / [ES] Layout horizontal |
| `actions` | `array` | `[]` | [EN] Header action buttons `[{ label, icon, variant, onClick }]` / [ES] Botones en el header |
| `footer` | `array` | `[]` | [EN] Footer buttons `[{ label, icon, variant, onClick }]` / [ES] Botones del footer |
| `footerAlign` | `string` | `'start'` | `'start'` · `'end'` · `'between'` · `'center'` |
| `onClick` | `function` | — | [EN] Fires when clickable card is clicked / [ES] Se dispara al hacer click en la card |

---

## Events / Eventos

```js
const card = new MTS.Card('#my-card', {
  title:     'Product',
  clickable: true,
  // Fires when card is clicked / Se dispara al hacer click en la card
  onClick: (e) => {
    console.log(e.detail.card);  // → MTS.Card instance
    console.log(e.detail.event); // → MouseEvent
  },
});
```

---

## CSS Only / Solo CSS

```html
<!-- Base card without JS / Card base sin JS -->
<div class="mts-card">
  <div class="mts-card__header">
    <div class="mts-card__title">Title</div>
    <div class="mts-card__subtitle">Subtitle</div>
  </div>
  <div class="mts-card__body">
    <p>Card body content.</p>
  </div>
  <div class="mts-card__footer">
    <button class="mts-btn mts-btn--primary">Action</button>
  </div>
</div>
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic / Básico
new MTS.Card('#my-card', {
  title:    'Product name',
  subtitle: 'Category',
  body:     '<p>Product description here.</p>',
  variant:  'elevated',
});

// With image and actions / Con imagen y acciones
new MTS.Card('#card-product', {
  title:      'Mountain Trek',
  subtitle:   'Footwear',
  image:      '/img/product.jpg',
  imageRatio: 'wide',
  body:       '<p>Premium hiking boots.</p>',
  actions: [
    { label: 'Edit',   variant: 'ghost',   onClick: () => edit() },
    { label: 'Delete', variant: 'danger',  onClick: () => remove() },
  ],
  footer: [
    { label: 'Cancel', variant: 'ghost',   onClick: () => cancel() },
    { label: 'Buy',    variant: 'primary', onClick: () => buy() },
  ],
  footerAlign: 'between',
});

// Clickable card / Card clickeable
new MTS.Card('#card-nav', {
  title:     'Analytics',
  body:      '<p>View your metrics.</p>',
  clickable: true,
  hoverable: true,
  // Fires on click / Se dispara al hacer click
  onClick: (e) => router.push('/analytics'),
});
```

---

## API

```js
const card = new MTS.Card('#my-card', { ... });

// Register / remove listeners / Registrar / eliminar listeners
card.on('click', (e) => console.log(e.detail.card))
card.off('click', handler)
```

---

## DOM Event / Evento DOM

```js
document.getElementById('my-card')
  .addEventListener('mts:card:click', (e) => {
    console.log(e.detail.card);
  });
```

---

## CSS Classes / Clases CSS

| Class | [EN] Effect / [ES] Efecto |
|-------|--------------------------|
| `.mts-card` | [EN] Base card / [ES] Card base |
| `.mts-card--elevated` | [EN] Drop shadow / [ES] Sombra |
| `.mts-card--outlined` | [EN] Border only / [ES] Solo borde |
| `.mts-card--hoverable` | [EN] Lift on hover / [ES] Eleva al hover |
| `.mts-card--clickable` | [EN] Pointer cursor / [ES] Cursor pointer |
| `.mts-card--selected` | [EN] Selected highlight / [ES] Resaltado seleccionado |
| `.mts-card--horizontal` | [EN] Side-by-side layout / [ES] Layout lado a lado |
| `.mts-card--sm / --lg` | [EN] Size modifiers / [ES] Modificadores de tamaño |

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] `onClick` normalized to `.on()`, bilingual docs / [ES] `onClick` normalizado a `.on()`, docs bilingüe |
| 1.0.0 | [EN] Initial release / [ES] Versión inicial |
