# MTS.Lightbox

Media viewer with navigation, zoom and thumbnail strip. Supports images, HTML5 video, YouTube and Vimeo. Instantiated from an array of items or auto-bound from a CSS selector.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-lightbox.css">

<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-icons.js"></script>
<script src="matios-ui-lightbox-i18n.js"></script>
<script src="matios-ui-lightbox.js"></script>
```

`matios-ui-icons.js` provides the toolbar and navigation icons (`download`, `close`, `chevron-left`, `chevron-right`). `matios-ui-i18n.js` + `matios-ui-lightbox-i18n.js` provide the localized chrome (close/prev/next/download labels and the counter).

---

## Usage

### Programmatic

Pass an array of items. Call `open()` to show the viewer.

```js
const lb = new MTS.Lightbox([
  { src: '/img/photo1.jpg', caption: 'Mountain view' },
  { src: '/img/photo2.jpg', caption: 'Ocean sunset' },
  { src: '/img/photo3.jpg', caption: 'Forest trail' },
], {
  loop: true,
  zoom: true,
  thumbnails: true,
  download: true,
  onChange: function (e) { console.log('changed:', e.detail.index); },
});
lb.open(0);
```

Mixed media — set `type` per item:

```js
new MTS.Lightbox([
  { src: '/img/photo.jpg',               type: 'image' },
  { src: '/video/clip.mp4',              type: 'video' },
  { src: 'https://youtu.be/dQw4w9WgXcQ', type: 'youtube' },
  { src: 'https://vimeo.com/123456789',  type: 'vimeo' },
]).open();
```

If `type` is omitted, a `.mp4`/`.webm`/`.ogg` extension is detected as `video`, otherwise the item is treated as an image.

### Auto-bind from a CSS selector

Pass a CSS selector string instead of an array. The lightbox reads `data-*` from each matched element, and binds a click handler to each so clicking opens the viewer at that item.

```html
<a href="/img/1.jpg" data-lightbox data-caption="Photo 1"><img src="/img/1-thumb.jpg" alt="Photo 1"></a>
<a href="/img/2.jpg" data-lightbox data-caption="Photo 2"><img src="/img/2-thumb.jpg" alt="Photo 2"></a>

<script>
  new MTS.Lightbox('[data-lightbox]', { thumbnails: true });
</script>
```

Attribute mapping per matched element:

| Attribute | Maps to | Fallback |
|-----------|---------|----------|
| `data-src` | `item.src` | `href`, then `src` |
| `data-type` | `item.type` | `'image'` |
| `data-caption` | `item.caption` | `title` |
| `data-alt` | `item.alt` | — |
| `data-thumb` | `item.thumb` | first inner `<img>` `src` |

---

## Options

Passed as the second argument: `new MTS.Lightbox(items, options)`.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `index` | `number` | `0` | Initially active item index |
| `loop` | `boolean` | `true` | Infinite loop navigation |
| `zoom` | `boolean` | `true` | Allow click-to-zoom on images (toggles 1x / 2x) |
| `download` | `boolean` | `false` | Show the download button in the toolbar |
| `counter` | `boolean` | `true` | Show the item counter |
| `thumbnails` | `boolean` | `false` | Show the thumbnail strip (only when there is more than one item) |
| `animation` | `string` | `'fade'` | Image transition: `'fade'` \| `'slide'` |
| `onOpen` | `function` | — | `({ item, index })` when the lightbox opens |
| `onClose` | `function` | — | Fires when the lightbox closes |
| `onChange` | `function` | — | `({ item, index })` when the active item changes |

### Item schema

| Property | Type | Description |
|----------|------|-------------|
| `src` | `string` | Media URL (**required**) |
| `type` | `string` | `'image'` \| `'video'` \| `'youtube'` \| `'vimeo'` — omitted infers from the extension |
| `caption` | `string` | Caption text shown below the media |
| `alt` | `string` | Image alt text |
| `thumb` | `string` | Thumbnail URL (falls back to `src` in the strip) |

---

## API

| Method | Description |
|--------|-------------|
| `open([index])` | Render and open the viewer at `index` (default `0`). Returns `this` |
| `close()` | Close and remove the viewer. Returns `this` |
| `next()` | Go to the next item. Returns `this` |
| `prev()` | Go to the previous item. Returns `this` |
| `goTo(index)` | Jump to a specific item. Returns `this` |
| `addItems(items)` | Append more items to the collection. Returns `this` |
| `on(event, cb)` | Add a listener for `'open'` \| `'change'` \| `'close'`. Returns `this` |
| `off(event, cb)` | Remove a previously added listener. Returns `this` |
| `destroy()` | Close and tear down the instance |

```js
const lb = new MTS.Lightbox(items, { loop: true });
lb.open(0);
lb.next();
```

---

## Events

Each event is passed to the matching `on*` option/`on()` listener as `{ type, detail }`, and is also dispatched on `document` as a `CustomEvent` whose `detail` is the payload below.

| Option / `on()` | DOM event | Payload (`detail`) |
|-----------------|-----------|--------------------|
| `onOpen` / `'open'` | `mts:lightbox:open` | `{ item, index }` |
| `onChange` / `'change'` | `mts:lightbox:change` | `{ item, index }` |
| `onClose` / `'close'` | `mts:lightbox:close` | `{}` |

```js
document.addEventListener('mts:lightbox:change', function (e) {
  console.log(e.detail.index);
});
```

---

## Keyboard & interaction

- `←` / `→` — previous / next item.
- `Esc` — close.
- Click on an image (when `zoom` is enabled) toggles zoom (1x / 2x).
- Clicking the backdrop or outside the media closes the viewer.

---

## i18n

The chrome (close / previous / next / download `aria-label`s and the counter template) is localized through the global i18n API under the `MTS.Lightbox` namespace. Set the language once at startup:

```js
MTS.setLanguage('es'); // 'es' | 'en' | 'pt'
```

Built-in keys under `MTS.Lightbox`:

| Key | English default |
|-----|-----------------|
| `close` | `Close` |
| `prev` | `Previous` |
| `next` | `Next` |
| `download` | `Download` |
| `counter` | `{current} / {total}` |

The `counter` value is a template — `{current}` and `{total}` are interpolated at render time.

To add or override a language, register a locale before instantiating:

```js
MTS.registerLocale('en', {
  'MTS.Lightbox': {
    close:    'Close',
    prev:     'Previous',
    next:     'Next',
    download: 'Download',
    counter:  '{current} of {total}',
  },
});
```
