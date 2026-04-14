# MTS.ImageGallery

[EN] Image gallery with grid, masonry and list layouts, filters, multi-selection and built-in lightbox.
[ES] Galería de imágenes con layouts grid, masonry y list, filtros, selección múltiple y lightbox integrado.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-imagegallery.css">
<script src="matios-ui-imagegallery.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `images` | `array` | `[]` | [EN] Image items (see schema) / [ES] Ítems de imagen |
| `layout` | `string` | `'grid'` | `'grid'` · `'masonry'` · `'list'` |
| `cols` | `number` | `3` | [EN] Grid columns / [ES] Columnas del grid |
| `gap` | `string` | `'8px'` | [EN] Gap between items / [ES] Espacio entre ítems |
| `selectable` | `boolean` | `false` | [EN] Allow multi-selection / [ES] Permitir selección múltiple |
| `lightbox` | `boolean` | `true` | [EN] Open lightbox on click / [ES] Abrir lightbox al hacer click |
| `filters` | `boolean` | `false` | [EN] Show filter buttons by category / [ES] Mostrar botones de filtro por categoría |
| `onSelect` | `function` | — | [EN] `({ selected, image }) => {}` Fires when selection changes / [ES] Se dispara al cambiar la selección |
| `onOpen` | `function` | — | [EN] `({ image, index }) => {}` Fires when image opens in lightbox / [ES] Se dispara al abrir una imagen |

### Image schema / Esquema de imagen

| Property | Type | [EN] Description / [ES] Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | [EN] Unique identifier / [ES] Identificador único |
| `src` | `string` | [EN] Image URL / [ES] URL de la imagen |
| `thumb` | `string` | [EN] Thumbnail URL (optional) / [ES] URL de miniatura (opcional) |
| `alt` | `string` | [EN] Alt text / [ES] Texto alternativo |
| `caption` | `string` | [EN] Caption shown in lightbox / [ES] Pie de foto en el lightbox |
| `category` | `string` | [EN] Filter category / [ES] Categoría para filtros |

---

## Events / Eventos

```js
new MTS.ImageGallery('#my-gallery', {
  images: [...],
  // Fires when selection changes / Se dispara al cambiar la selección
  onSelect: (e) => {
    console.log(e.detail.selected); // → [{ id, src, ... }, ...]
    console.log(e.detail.image);    // → last toggled image
  },
  // Fires when image opens in lightbox / Se dispara al abrir en lightbox
  onOpen: (e) => {
    console.log(e.detail.image); // → { id, src, caption, ... }
    console.log(e.detail.index); // → 2
  },
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic grid with lightbox / Grid básico con lightbox
new MTS.ImageGallery('#my-gallery', {
  layout:   'grid',
  cols:     3,
  lightbox: true,
  images: [
    { id:'1', src:'/img/photo1.jpg', alt:'Mountain', caption:'Mountain view', category:'nature' },
    { id:'2', src:'/img/photo2.jpg', alt:'Ocean',    caption:'Ocean sunset',  category:'nature' },
    { id:'3', src:'/img/photo3.jpg', alt:'City',     caption:'City at night', category:'urban'  },
  ],
  onOpen: (e) => console.log('opened:', e.detail.image.id),
});

// With filters / Con filtros
new MTS.ImageGallery('#my-gallery', {
  filters:  true,   // shows All · nature · urban buttons
  lightbox: true,
  images: [...],
});

// Multi-selection / Selección múltiple
new MTS.ImageGallery('#my-gallery', {
  selectable: true,
  lightbox:   false,
  images: [...],
  onSelect: (e) => {
    console.log('selected:', e.detail.selected.length);
    updateToolbar(e.detail.selected);
  },
});

// Masonry layout / Layout masonry
new MTS.ImageGallery('#my-gallery', {
  layout: 'masonry',
  cols:   4,
  images: [...],
});
```

---

## API

```js
const gallery = new MTS.ImageGallery('#my-gallery', { images: [...] });

// Get selected images / Obtener imágenes seleccionadas
gallery.getSelected()  // → [{ id, src, ... }, ...]

// Clear selection / Limpiar selección
gallery.clearSelection()

// Set images / Establecer imágenes
gallery.setImages([...])

// Register listeners / Registrar listeners
gallery.on('select', (e) => console.log(e.detail.selected))
gallery.on('open',   (e) => console.log(e.detail.image))
gallery.off('select', handler)
```

---

## DOM Events / Eventos DOM

```js
el.addEventListener('mts:imagegallery:select', (e) => console.log(e.detail));
el.addEventListener('mts:imagegallery:open',   (e) => console.log(e.detail));
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Normalized to `.on()`, bilingual docs / [ES] Normalizado a `.on()`, docs bilingüe |
| 1.0.0 | [EN] Initial release — grid/masonry/list, filters, selection, lightbox / [ES] Versión inicial |
