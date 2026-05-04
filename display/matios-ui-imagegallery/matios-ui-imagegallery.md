# MTS.ImageGallery

🇬🇧 Image gallery with grid, masonry and list layouts, filters, multi-selection and built-in lightbox.
🇪🇸 Galería de imágenes con layouts grid, masonry y list, filtros, selección múltiple y lightbox integrado.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-imagegallery.css">
<script src="matios-ui-imagegallery.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `images` | `array` | `[]` | 🇬🇧 Image items (see schema) / 🇪🇸 Ítems de imagen |
| `layout` | `string` | `'grid'` | `'grid'` · `'masonry'` · `'list'` |
| `cols` | `number` | `3` | 🇬🇧 Grid columns / 🇪🇸 Columnas del grid |
| `gap` | `string` | `'8px'` | 🇬🇧 Gap between items / 🇪🇸 Espacio entre ítems |
| `selectable` | `boolean` | `false` | 🇬🇧 Allow multi-selection / 🇪🇸 Permitir selección múltiple |
| `lightbox` | `boolean` | `true` | 🇬🇧 Open lightbox on click / 🇪🇸 Abrir lightbox al hacer click |
| `filters` | `boolean` | `false` | 🇬🇧 Show filter buttons by category / 🇪🇸 Mostrar botones de filtro por categoría |
| `onSelect` | `function` | — | 🇬🇧 `({ selected, image }) => {}` Fires when selection changes / 🇪🇸 Se dispara al cambiar la selección |
| `onOpen` | `function` | — | 🇬🇧 `({ image, index }) => {}` Fires when image opens in lightbox / 🇪🇸 Se dispara al abrir una imagen |

### Image schema / Esquema de imagen

| Property | Type | 🇬🇧 Description / 🇪🇸 Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | 🇬🇧 Unique identifier / 🇪🇸 Identificador único |
| `src` | `string` | 🇬🇧 Image URL / 🇪🇸 URL de la imagen |
| `thumb` | `string` | 🇬🇧 Thumbnail URL (optional) / 🇪🇸 URL de miniatura (opcional) |
| `alt` | `string` | 🇬🇧 Alt text / 🇪🇸 Texto alternativo |
| `caption` | `string` | 🇬🇧 Caption shown in lightbox / 🇪🇸 Pie de foto en el lightbox |
| `category` | `string` | 🇬🇧 Filter category / 🇪🇸 Categoría para filtros |

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
