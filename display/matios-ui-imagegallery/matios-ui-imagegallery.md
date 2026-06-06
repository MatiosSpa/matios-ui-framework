# MTS.ImageGallery

Image gallery with grid, masonry and list layouts, category filters, multi-selection and a built-in lightbox.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-imagegallery.css">
<script src="matios-ui-imagegallery.js"></script>
```

---

## Usage

```js
// Basic grid with lightbox
new MTS.ImageGallery('#my-gallery', {
  layout:   'grid',
  cols:     3,
  lightbox: true,
  images: [
    { id: '1', src: '/img/photo1.jpg', alt: 'Mountain', caption: 'Mountain view', category: 'nature' },
    { id: '2', src: '/img/photo2.jpg', alt: 'Ocean',    caption: 'Ocean sunset',  category: 'nature' },
    { id: '3', src: '/img/photo3.jpg', alt: 'City',     caption: 'City at night', category: 'urban'  },
  ],
  onOpen: function (e) { console.log('opened:', e.detail.image.id); },
});

// With category filters (renders All · nature · urban buttons)
new MTS.ImageGallery('#my-gallery', { filters: true, lightbox: true, images: [/* … */] });

// Multi-selection
new MTS.ImageGallery('#my-gallery', {
  selectable: true,
  lightbox:   false,
  images: [/* … */],
  onSelect: function (e) { updateToolbar(e.detail.selected); },
});

// Masonry layout
new MTS.ImageGallery('#my-gallery', { layout: 'masonry', cols: 4, images: [/* … */] });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `images` | `array` | `[]` | Image items (see schema below) |
| `layout` | `string` | `'grid'` | `'grid'` · `'masonry'` · `'list'` |
| `cols` | `number` | `3` | Grid columns |
| `gap` | `string` | `'8px'` | Gap between items |
| `selectable` | `boolean` | `false` | Allow multi-selection |
| `lightbox` | `boolean` | `true` | Open the lightbox on click |
| `filters` | `boolean` | `false` | Show category filter buttons |
| `onSelect` | `function` | — | Fires when selection changes — `({ selected, image })` |
| `onOpen` | `function` | — | Fires when an image opens in the lightbox — `({ image, index })` |

### Image schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `src` | `string` | Image URL |
| `thumb` | `string` | Thumbnail URL (optional) |
| `alt` | `string` | Alt text |
| `caption` | `string` | Caption shown in the lightbox |
| `category` | `string` | Filter category |

---

## API

| Method | Description |
|--------|-------------|
| `getSelected()` | Returns the selected images `[{ id, src, … }]` |
| `clearSelection()` | Clear the current selection |
| `setImages(array)` | Replace the image set and re-render |
| `on(event, cb)` / `off(event, cb)` | Register / remove listeners (`'select'`, `'open'`) |

```js
const gallery = new MTS.ImageGallery('#my-gallery', { images: [/* … */] });
gallery.on('select', function (e) { console.log(e.detail.selected); });
gallery.on('open',   function (e) { console.log(e.detail.image); });
```

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onSelect(fn)` / `on('select', fn)` | `{ selected, image }` | Selection changes (`image` = last toggled) |
| `onOpen(fn)` / `on('open', fn)` | `{ image, index }` | An image opens in the lightbox |

Also dispatched as DOM events:

```js
el.addEventListener('mts:imagegallery:select', function (e) { console.log(e.detail); });
el.addEventListener('mts:imagegallery:open',   function (e) { console.log(e.detail); });
```

---

## Accessibility

- Always provide `alt` for each image — it is applied to the rendered `<img>`.
- The lightbox traps focus while open and closes on `Esc`; navigate between images with the arrow keys.

---

## Changelog

### Initial
- Image gallery with `grid` / `masonry` / `list` layouts, category filters, multi-selection, built-in lightbox,
  and `getSelected` / `clearSelection` / `setImages`.
