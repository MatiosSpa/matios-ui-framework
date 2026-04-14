# MTS.Lightbox

[EN] Media viewer with navigation, zoom and thumbnail strip. Supports images, HTML5 video, YouTube and Vimeo. Auto-bind from CSS selector.
[ES] Visor de medios con navegación, zoom y tira de miniaturas. Soporta imágenes, video HTML5, YouTube y Vimeo. Auto-bind desde selector CSS.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-lightbox.css">
<script src="matios-ui-lightbox.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `index` | `number` | `0` | [EN] Initially active item index / [ES] Índice activo inicial |
| `loop` | `boolean` | `true` | [EN] Infinite loop navigation / [ES] Navegación en loop infinito |
| `zoom` | `boolean` | `true` | [EN] Allow zoom on images / [ES] Permitir zoom en imágenes |
| `download` | `boolean` | `false` | [EN] Show download button / [ES] Mostrar botón de descarga |
| `counter` | `boolean` | `true` | [EN] Show item counter / [ES] Mostrar contador de ítems |
| `thumbnails` | `boolean` | `false` | [EN] Show thumbnail strip / [ES] Mostrar tira de miniaturas |
| `animation` | `string` | `'fade'` | `'fade'` · `'slide'` |
| `onOpen` | `function` | — | [EN] `({ item, index }) => {}` Fires when lightbox opens / [ES] Se dispara al abrir |
| `onClose` | `function` | — | [EN] Fires when lightbox closes / [ES] Se dispara al cerrar |
| `onChange` | `function` | — | [EN] `({ item, index }) => {}` Fires when active item changes / [ES] Se dispara al cambiar el ítem |

### Item schema / Esquema de ítem

| Property | Type | [EN] Description / [ES] Descripción |
|----------|------|--------------------------------------|
| `src` | `string` | [EN] Media URL (required) / [ES] URL del medio (requerido) |
| `type` | `string` | `'image'` · `'video'` · `'youtube'` · `'vimeo'` |
| `caption` | `string` | [EN] Caption text / [ES] Texto de pie de foto |
| `alt` | `string` | [EN] Image alt text / [ES] Texto alternativo |
| `thumb` | `string` | [EN] Thumbnail URL / [ES] URL de la miniatura |

---

## Events / Eventos

```js
const lb = new MTS.Lightbox([...], {
  // Fires when lightbox opens / Se dispara al abrir el lightbox
  onOpen: (e) => {
    console.log(e.detail.item);  // → { src, type, caption }
    console.log(e.detail.index); // → 0
  },
  // Fires when active item changes / Se dispara al cambiar el ítem activo
  onChange: (e) => {
    console.log(e.detail.index); // → 2
  },
  // Fires when lightbox closes / Se dispara al cerrar el lightbox
  onClose: (e) => console.log('closed'),
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// Programmatic / Programático
const lb = new MTS.Lightbox([
  { src: '/img/photo1.jpg', caption: 'Mountain view' },
  { src: '/img/photo2.jpg', caption: 'Ocean sunset'  },
  { src: '/img/photo3.jpg', caption: 'Forest trail'  },
], {
  loop:       true,
  zoom:       true,
  thumbnails: true,
  download:   true,
  onOpen:     (e) => console.log('opened:', e.detail.index),
  onChange:   (e) => console.log('changed:', e.detail.index),
  onClose:    ()  => console.log('closed'),
});

lb.open(0); // open at index 0 / abrir en el índice 0

// Mixed media / Medios mixtos
new MTS.Lightbox([
  { src: '/img/photo.jpg',                type: 'image'   },
  { src: '/video/clip.mp4',               type: 'video'   },
  { src: 'https://youtu.be/dQw4w9WgXcQ',  type: 'youtube' },
  { src: 'https://vimeo.com/123456789',   type: 'vimeo'   },
]).open();
```

---

## Auto-bind from CSS Selector / Auto-bind desde selector CSS

[EN] Pass a CSS selector instead of an array. The lightbox reads `data-*` attributes from each matched element and binds click events automatically.
[ES] Pasa un selector CSS en lugar de un arreglo. El lightbox lee atributos `data-*` de cada elemento y vincula los clicks automáticamente.

```html
<a href="/img/1.jpg" data-lightbox data-caption="Photo 1">
  <img src="/img/1-thumb.jpg" alt="Photo 1">
</a>
<a href="/img/2.jpg" data-lightbox data-caption="Photo 2">
  <img src="/img/2-thumb.jpg" alt="Photo 2">
</a>

<script>
  // Pass the selector — clicks are bound automatically
  // Pasa el selector — los clicks se vinculan automáticamente
  new MTS.Lightbox('[data-lightbox]', {
    thumbnails: true,
    onChange:   (e) =&gt; console.log(e.detail.index),
  });
</script>
```

| data attribute | [EN] Maps to / [ES] Mapea a |
|----------------|------------------------------|
| `href` / `src` | `item.src` |
| `data-type` | `item.type` |
| `data-caption` | `item.caption` |
| `data-alt` | `item.alt` |
| `data-thumb` | `item.thumb` |

---

## Keyboard Navigation / Navegación por teclado

| Key | [EN] Action / [ES] Acción |
|-----|--------------------------|
| `←` / `→` | [EN] Previous / Next / [ES] Anterior / Siguiente |
| `Escape` | [EN] Close / [ES] Cerrar |
| `+` / `-` | [EN] Zoom in / out (images) / [ES] Zoom in / out (imágenes) |

---

## API

```js
const lb = new MTS.Lightbox([...], { ... });

// Open at index / Abrir en el índice
lb.open(0)

// Close / Cerrar
lb.close()

// Navigate / Navegar
lb.next()
lb.prev()
lb.goTo(2)

// Register / remove listeners / Registrar / eliminar listeners
lb.on('open',   (e) => console.log(e.detail.index))
lb.on('change', (e) => console.log(e.detail.index))
lb.on('close',  (e) => {})
lb.off('change', handler)

// Destroy / Destruir
lb.destroy()
```

---

## DOM Events / Eventos DOM

```js
document.addEventListener('mts:lightbox:open',   (e) => console.log(e.detail.index));
document.addEventListener('mts:lightbox:change',  (e) => console.log(e.detail.index));
document.addEventListener('mts:lightbox:close',   () => {});
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Normalized to `.on()` pattern, bilingual docs / [ES] Normalizado al patrón `.on()`, docs bilingüe |
| 1.0.0 | [EN] Initial release — images, video, YouTube, Vimeo, zoom, thumbnails / [ES] Versión inicial |
