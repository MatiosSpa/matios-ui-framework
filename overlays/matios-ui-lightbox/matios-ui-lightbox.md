# MTS.Lightbox

Media viewer with navigation, zoom and thumbnail strip. Supports images, HTML5 video, YouTube and Vimeo. Auto-binds from a CSS selector.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-lightbox.css">
<script src="matios-ui-lightbox.js"></script>
```

---

## Usage

### Programmatic

```js
const lb = new MTS.Lightbox([
  { src: '/img/photo1.jpg', caption: 'Mountain view' },
  { src: '/img/photo2.jpg', caption: 'Ocean sunset' },
  { src: '/img/photo3.jpg', caption: 'Forest trail' },
], {
  loop: true, zoom: true, thumbnails: true, download: true,
  onChange: function (e) { console.log('changed:', e.detail.index); },
});
lb.open(0);

// Mixed media
new MTS.Lightbox([
  { src: '/img/photo.jpg',               type: 'image' },
  { src: '/video/clip.mp4',              type: 'video' },
  { src: 'https://youtu.be/dQw4w9WgXcQ', type: 'youtube' },
  { src: 'https://vimeo.com/123456789',  type: 'vimeo' },
]).open();
```

### Auto-bind from a CSS selector

Pass a selector instead of an array. The lightbox reads `data-*` from each matched element and binds clicks:

```html
<a href="/img/1.jpg" data-lightbox data-caption="Photo 1"><img src="/img/1-thumb.jpg" alt="Photo 1"></a>
<a href="/img/2.jpg" data-lightbox data-caption="Photo 2"><img src="/img/2-thumb.jpg" alt="Photo 2"></a>

<script>
  new MTS.Lightbox('[data-lightbox]', { thumbnails: true });
</script>
```

Mapping: `href`/`src` → `item.src`, `data-type` → `item.type`, `data-caption` → `item.caption`,
`data-alt` → `item.alt`, `data-thumb` → `item.thumb`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `index` | `number` | `0` | Initially active item index |
| `loop` | `boolean` | `true` | Infinite loop navigation |
| `zoom` | `boolean` | `true` | Allow zoom on images |
| `download` | `boolean` | `false` | Show the download button |
| `counter` | `boolean` | `true` | Show the item counter |
| `thumbnails` | `boolean` | `false` | Show the thumbnail strip |
| `animation` | `string` | `'fade'` | `'fade'` · `'slide'` |
| `onOpen` | `function` | — | `({ item, index })` when the lightbox opens |
| `onClose` | `function` | — | Fires when the lightbox closes |
| `onChange` | `function` | — | `({ item, index })` when the active item changes |

### Item schema

| Property | Type | Description |
|----------|------|-------------|
| `src` | `string` | Media URL (**required**) |
| `type` | `string` | `'image'` · `'video'` · `'youtube'` · `'vimeo'` |
| `caption` | `string` | Caption text |
| `alt` | `string` | Image alt text |
| `thumb` | `string` | Thumbnail URL |

---

## API

| Method | Description |
|--------|-------------|
| `open([index])` | Open at an index |
| `close()` | Close the lightbox |
| `next()` / `prev()` / `goTo(i)` | Navigate |
| `on(event, cb)` / `off(event, cb)` | Listen to `'open'` / `'change'` / `'close'` |
| `destroy()` | Destroy the instance |

```js
const lb = new MTS.Lightbox(items, { loop: true });
lb.open(0);
lb.next();
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onOpen` | `mts:lightbox:open` | `{ item, index }` |
| `onChange` | `mts:lightbox:change` | `{ item, index }` |
| `onClose` | `mts:lightbox:close` | — |

```js
document.addEventListener('mts:lightbox:change', function (e) { console.log(e.detail.index); });
```

---

## Accessibility

- Keyboard: `←`/`→` previous/next, `Esc` closes, `+`/`-` zoom in/out on images.
- Focus is trapped while open and returned on close; provide `alt`/`caption` for each item.

---

## Changelog

### Initial
- Media lightbox for images, HTML5 video, YouTube and Vimeo; navigation, zoom, thumbnail strip, counter, download,
  fade/slide animation, CSS-selector auto-bind, full keyboard control, and `open` / `close` / `next` / `prev` / `goTo`.
