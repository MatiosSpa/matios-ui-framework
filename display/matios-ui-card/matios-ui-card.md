# MTS.Card

🇬🇧 Generic card with header, body, footer, cover image, variants, hover/click states and action buttons. Works via CSS classes alone or with JS.
🇪🇸 Card genérica con header, body, footer, imagen de portada, variantes, estados hover/click y botones de acción. Funciona con clases CSS solas o con JS.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-card.css">
<script src="matios-ui-card.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `title` | `string` | `null` | 🇬🇧 Header title / 🇪🇸 Título del header |
| `subtitle` | `string` | `null` | 🇬🇧 Header subtitle / 🇪🇸 Subtítulo del header |
| `body` | `string` | `null` | 🇬🇧 Body HTML / 🇪🇸 HTML del cuerpo |
| `image` | `string` | `null` | 🇬🇧 Cover image URL / 🇪🇸 URL de imagen de portada |
| `imageAlt` | `string` | `''` | 🇬🇧 Image alt text / 🇪🇸 Texto alternativo |
| `imageRatio` | `string` | `'default'` | `'default'` · `'square'` · `'wide'` |
| `variant` | `string` | `null` | `'flat'` · `'elevated'` · `'outlined'` · `'primary'` · `'success'` · `'warning'` · `'danger'` |
| `size` | `string` | `''` | `''` · `'sm'` · `'lg'` |
| `hoverable` | `boolean` | `false` | 🇬🇧 Show hover lift effect / 🇪🇸 Efecto de elevación al hover |
| `clickable` | `boolean` | `false` | 🇬🇧 Make card clickable / 🇪🇸 Hacer la card clickeable |
| `selected` | `boolean` | `false` | 🇬🇧 Selected state / 🇪🇸 Estado seleccionado |
| `horizontal` | `boolean` | `false` | 🇬🇧 Horizontal layout / 🇪🇸 Layout horizontal |
| `actions` | `array` | `[]` | 🇬🇧 Header action buttons `[{ label, icon, variant, onClick }]` / 🇪🇸 Botones en el header |
| `footer` | `array` | `[]` | 🇬🇧 Footer buttons `[{ label, icon, variant, onClick }]` / 🇪🇸 Botones del footer |
| `footerAlign` | `string` | `'start'` | `'start'` · `'end'` · `'between'` · `'center'` |
| `onClick` | `function` | — | 🇬🇧 Fires when clickable card is clicked / 🇪🇸 Se dispara al hacer click en la card |

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

| Class | 🇬🇧 Effect / 🇪🇸 Efecto |
|-------|--------------------------|
| `.mts-card` | 🇬🇧 Base card / 🇪🇸 Card base |
| `.mts-card--elevated` | 🇬🇧 Drop shadow / 🇪🇸 Sombra |
| `.mts-card--outlined` | 🇬🇧 Border only / 🇪🇸 Solo borde |
| `.mts-card--hoverable` | 🇬🇧 Lift on hover / 🇪🇸 Eleva al hover |
| `.mts-card--clickable` | 🇬🇧 Pointer cursor / 🇪🇸 Cursor pointer |
| `.mts-card--selected` | 🇬🇧 Selected highlight / 🇪🇸 Resaltado seleccionado |
| `.mts-card--horizontal` | 🇬🇧 Side-by-side layout / 🇪🇸 Layout lado a lado |
| `.mts-card--sm / --lg` | 🇬🇧 Size modifiers / 🇪🇸 Modificadores de tamaño |

---
