# MTS.ImageGallery

Image gallery with `grid`, `masonry` and `list` variants, tag filters, multi-selection and a built-in lightbox.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-imagegallery.css">
<script src="matios-ui-icons.js"></script>
<script src="matios-ui-imagegallery.js"></script>
```

`matios-ui-icons.js` is required — the select check, the zoom button and the lightbox navigation use `MTS.Icon`.

Optional (only if you localize the built-in chrome — the `All` filter button and the empty-state text):

```html
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-imagegallery-i18n.js"></script>
```

---

## Usage

```js
const images = [
  { id: '1', src: '/img/photo1.jpg', thumb: '/img/thumb1.jpg', alt: 'Mountain', caption: 'Mountain view', tags: ['nature'] },
  { id: '2', src: '/img/photo2.jpg', thumb: '/img/thumb2.jpg', alt: 'Ocean',    caption: 'Ocean sunset',  tags: ['nature'] },
  { id: '3', src: '/img/photo3.jpg', thumb: '/img/thumb3.jpg', alt: 'City',     caption: 'City at night', tags: ['urban'] }
];

// Grid with tag filters and lightbox (renders All / nature / urban buttons)
new MTS.ImageGallery('#gallery-grid', {
  variant: 'grid',
  cols: 3,
  gap: '8px',
  filters: ['nature', 'urban'],
  lightbox: true,
  images: images,
  onOpen: function (e) {
    console.log('opened:', e.detail.image.caption, e.detail.index);
  }
});

// Multi-selection (no lightbox)
const gallery = new MTS.ImageGallery('#gallery-select', {
  variant: 'grid',
  cols: 4,
  selectable: true,
  lightbox: false,
  images: images,
  onSelect: function (e) {
    console.log(e.detail.selected.length + ' selected');
  }
});

// Masonry / list variants
new MTS.ImageGallery('#gallery-masonry', { variant: 'masonry', cols: 2, images: images });
new MTS.ImageGallery('#gallery-list',    { variant: 'list',              images: images });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `images` | `array` | `[]` | Image items (see schema below) |
| `variant` | `string` | `'grid'` | `'grid'` \| `'masonry'` \| `'list'` |
| `cols` | `number` | `3` | Grid columns (only applied when `variant` is `'grid'`) |
| `gap` | `string` | `'8px'` | CSS gap between items |
| `selectable` | `boolean` | `false` | Show a check overlay and allow multi-selection |
| `lightbox` | `boolean` | `true` | Open the built-in lightbox on card click |
| `showCaption` | `boolean` | `true` | Show the caption on the card overlay (when the item has one) |
| `filters` | `array` | `[]` | Tag strings to render as filter buttons; empty means no filter bar |
| `onSelect` | `function` | — | Shorthand for `on('select', fn)` — `({ selected, image })` |
| `onOpen` | `function` | — | Shorthand for `on('open', fn)` — `({ image, index })` |

### Image schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier (used by selection APIs) |
| `src` | `string` | Full-size image URL (shown in the lightbox) |
| `thumb` | `string` | Thumbnail URL (optional; falls back to `src`) |
| `alt` | `string` | Alt text (falls back to `caption`, then empty) |
| `caption` | `string` | Caption shown on the card overlay and in the lightbox |
| `tags` | `array` | Tag strings; an item matches a filter when its `tags` include the active tag |

---

## API

| Method | Description |
|--------|-------------|
| `setImages(array)` | Replace the image set, clear the selection and re-render. Returns `this` |
| `getSelected()` | Returns the selected image objects `[{ id, src, … }]` |
| `clearSelection()` | Clear the current selection and re-render. Returns `this` |
| `setFilter(tag)` | Set the active tag filter and re-render. Returns `this` |
| `clearFilter()` | Clear the active tag filter and re-render. Returns `this` |
| `openLightbox(index)` | Open the lightbox at the given image index. Returns `this` |
| `on(event, cb)` | Register a listener (`'select'`, `'open'`). Returns `this` |
| `off(event, cb)` | Remove a listener. Returns `this` |
| `destroy()` | Close the lightbox and empty the host element |

```js
const gallery = new MTS.ImageGallery('#gallery', { images: images });
gallery.on('select', function (e) { console.log(e.detail.selected); });
gallery.on('open',   function (e) { console.log(e.detail.image); });
```

---

## Events

Both events fire through the registered callbacks (`on`/`off` or the `onSelect`/`onOpen` options) and are also dispatched as bubbling DOM `CustomEvent`s on the host element.

| Event | Payload | When |
|-------|---------|------|
| `select` / `mts:imagegallery:select` | `{ selected, image }` | Selection changes (`image` = last toggled, `selected` = full current set) |
| `open` / `mts:imagegallery:open` | `{ image, index }` | An image opens in the lightbox |

```js
el.addEventListener('mts:imagegallery:select', function (e) { console.log(e.detail); });
el.addEventListener('mts:imagegallery:open',   function (e) { console.log(e.detail); });
```

---

## Lightbox

When `lightbox` is `true`, clicking a card (or calling `openLightbox(index)`) opens a built-in overlay that shows the full-size `src`, the `caption`, and a `n / total` counter. With more than one image it renders previous / next buttons. It closes on backdrop click, on the close button, or on `Esc`, and navigates with the left / right arrow keys. This is a self-contained overlay — it does not depend on `MTS.Lightbox`.

---

## Accessibility

- Always provide `alt` for each image — it is applied to the rendered `<img>` (it falls back to `caption`, then to an empty string).
- The lightbox closes on `Esc` and navigates between images with the arrow keys.

---

## i18n

Namespace: `MTS.ImageGallery`. The only localizable runtime chrome is the `all` filter button (default `'Todos'` / `'All'`) and the `empty` state text (default `'Sin imágenes'` / `'No images'`), read from `MTS.getString()['MTS.ImageGallery'].messages`. Captions, alt text and tag labels are developer-supplied and are not translated.

Set the language once at startup with `MTS.setLanguage('es' | 'en' | 'pt')`; there is no per-instance locale option.

```js
MTS.setLanguage('en');
const strings = MTS.getString()['MTS.ImageGallery'].messages;
// strings.all → 'All', strings.empty → 'No images'
```
