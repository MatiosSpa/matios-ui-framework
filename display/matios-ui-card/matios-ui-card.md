# matios-ui-card

Card genérica con header, body, footer, imagen, variantes y estados interactivos.

---

## Instalación

```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-card.css">
<script src="matios-ui-card.js"></script>
```

---

## HTML puro

```html
<!-- Card básica -->
<div class="mts-card">
  <div class="mts-card__header">
    <div class="mts-card__header-content">
      <div class="mts-card__title">Título</div>
      <div class="mts-card__subtitle">Subtítulo opcional</div>
    </div>
  </div>
  <div class="mts-card__body">Contenido del cuerpo.</div>
  <div class="mts-card__footer mts-card__footer--end">
    <button class="mts-btn mts-btn--ghost mts-btn--sm">Cancelar</button>
    <button class="mts-btn mts-btn--primary mts-btn--sm">Aceptar</button>
  </div>
</div>

<!-- Con imagen -->
<div class="mts-card">
  <img class="mts-card__image" src="foto.jpg" alt="Foto">
  <div class="mts-card__body">...</div>
</div>

<!-- Hoverable -->
<div class="mts-card mts-card--hoverable">...</div>

<!-- Clickable -->
<div class="mts-card mts-card--clickable">...</div>

<!-- Elevated -->
<div class="mts-card mts-card--elevated">...</div>

<!-- Con acento de color -->
<div class="mts-card mts-card--primary">...</div>
<div class="mts-card mts-card--success">...</div>
<div class="mts-card mts-card--danger">...</div>
```

---

## Via JS

```js
const card = new MTS.Card('#mi-card', {
  title:    'Título de la card',
  subtitle: 'Subtítulo opcional',
  body:     '<p>Contenido HTML del cuerpo.</p>',
  variant:  'elevated',
  hoverable: true,
  clickable: true,
  actions: [
    { icon: '✏️', variant: 'ghost', onClick: () => console.log('editar') },
  ],
  footer: [
    { label: 'Cancelar', variant: 'ghost',   onClick: () => {} },
    { label: 'Guardar',  variant: 'primary',  onClick: () => {} },
  ],
  footerAlign: 'end',
  onClick: (e, card) => console.log('card clickeada'),
})
```

---

## Opciones

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `title` | `string` | `null` | Título del header |
| `subtitle` | `string` | `null` | Subtítulo del header |
| `body` | `string` | `null` | HTML del cuerpo |
| `image` | `string` | `null` | URL de imagen |
| `imageRatio` | `string` | `'default'` | `'default'` · `'square'` · `'wide'` |
| `variant` | `string` | `null` | `'flat'` · `'elevated'` · `'outlined'` · `'primary'` · `'success'` · `'warning'` · `'danger'` |
| `size` | `string` | `''` | `'sm'` · `''` · `'lg'` |
| `hoverable` | `boolean` | `false` | Efecto hover con sombra y lift |
| `clickable` | `boolean` | `false` | Cursor pointer + efecto click |
| `selected` | `boolean` | `false` | Borde de selección primario |
| `horizontal` | `boolean` | `false` | Imagen a la izquierda, contenido a la derecha |
| `actions` | `Array` | `[]` | Botones en el header |
| `footer` | `Array` | `[]` | Botones en el footer |
| `footerAlign` | `string` | `'start'` | `'start'` · `'end'` · `'between'` · `'center'` |
| `onClick` | `function` | `null` | Callback al hacer click (solo si `clickable:true`) |

---

## API

```js
card.setSelected(true)        // marcar como seleccionada
card.setTitle('Nuevo título') // cambiar título
card.setBody('<p>HTML</p>')   // cambiar cuerpo
card.setLoading(true)         // activar estado skeleton
card.destroy()                // destruir
```

---

## Clases CSS

| Clase | Descripción |
|-------|-------------|
| `.mts-card` | Base |
| `.mts-card--flat` | Sin borde, sin sombra |
| `.mts-card--elevated` | Con sombra media |
| `.mts-card--outlined` | Borde fuerte, fondo transparente |
| `.mts-card--primary/success/warning/danger` | Acento en borde izquierdo |
| `.mts-card--hoverable` | Efecto hover |
| `.mts-card--clickable` | Cursor pointer + active |
| `.mts-card--selected` | Borde de selección |
| `.mts-card--horizontal` | Imagen a la izquierda |
| `.mts-card--sm / --lg` | Tamaños |
| `.mts-card--loading` | Estado skeleton animado |
| `.mts-card__header` | Zona de título y acciones |
| `.mts-card__body` | Cuerpo de contenido |
| `.mts-card__footer` | Zona de acciones inferiores |
| `.mts-card__image` | Imagen superior |
