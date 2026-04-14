# MTS.Popover

[EN] Rich tooltip with title, HTML body, arrow, close button and smart positioning.
[ES] Tooltip enriquecido con título, body HTML, flecha, botón de cierre y posicionamiento inteligente.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-popover.css">
<script src="matios-ui-popover.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `title` | `string` | `''` | [EN] Popover header title / [ES] Título del header |
| `content` | `string` | `''` | [EN] Body HTML or text / [ES] HTML o texto del cuerpo |
| `position` | `string` | `'bottom'` | `'top'` · `'bottom'` · `'left'` · `'right'` |
| `trigger` | `string` | `'click'` | `'click'` · `'hover'` |
| `offset` | `number` | `8` | [EN] Gap in px between target and popover / [ES] Separación en px |
| `arrow` | `boolean` | `true` | [EN] Show arrow / [ES] Mostrar flecha |
| `closable` | `boolean` | `true` | [EN] Show × in header / [ES] Mostrar × en el header |
| `width` | `string` | `'260px'` | [EN] Popover width / [ES] Ancho del popover |
| `onShow` | `function` | — | [EN] Fires when popover shows / [ES] Se dispara al mostrar |
| `onHide` | `function` | — | [EN] Fires when popover hides / [ES] Se dispara al ocultar |

---

## Events / Eventos

```js
const pop = new MTS.Popover('#my-btn', {
  title:   'Help',
  content: '<p>Explanatory text here.</p>',
  // Fires when popover shows / Se dispara al mostrar el popover
  onShow: (e) => console.log('shown'),
  // Fires when popover hides / Se dispara al ocultar el popover
  onHide: (e) => console.log('hidden'),
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic click trigger / Trigger click básico
new MTS.Popover('#btn-help', {
  title:   'What is this?',
  content: '<p>This field requires a valid email address.</p>',
  position: 'bottom',
  trigger:  'click',
});

// Hover trigger / Trigger hover
new MTS.Popover('#btn-info', {
  title:    'Pro tip',
  content:  '<p>Use <kbd>⌘S</kbd> to save quickly.</p>',
  position: 'top',
  trigger:  'hover',
  arrow:    true,
});

// No close button — custom width / Sin botón de cierre — ancho personalizado
new MTS.Popover('#btn-preview', {
  title:    'Preview',
  content:  '<img src="preview.jpg" style="width:100%;border-radius:6px">',
  closable: false,
  width:    '320px',
  onShow:   (e) => console.log('opened'),
  onHide:   (e) => console.log('closed'),
});
```

---

## HTML Declarative / HTML Declarativo

```html
<button id="my-btn"
  data-title="Need help?"
  data-content="Contact support at help@example.com"
  data-position="top"
  data-trigger="click">
  Help
</button>

<script>
  new MTS.Popover('#my-btn');
</script>
```

| Attribute / Atributo | JS Option |
|----------------------|-----------|
| `data-title` | `title` |
| `data-content` | `content` |
| `data-position` | `position` |
| `data-trigger` | `trigger` |
| `data-closable` | `closable` |
| `data-width` | `width` |

---

## API

```js
const pop = new MTS.Popover('#my-btn', { ... });

// Show / hide / toggle / Mostrar / ocultar / alternar
pop.show()
pop.hide()
pop.toggle()

// Update content at runtime / Actualizar contenido en runtime
pop.setContent('<p>New content</p>')

// Register / remove listeners / Registrar / eliminar listeners
pop.on('show', (e) => {})
pop.on('hide', (e) => {})
pop.off('show', handler)

// Destroy / Destruir
pop.destroy()
```

---

## DOM Events / Eventos DOM

```js
document.getElementById('my-btn')
  .addEventListener('mts:popover:show', () => console.log('shown'));

document.getElementById('my-btn')
  .addEventListener('mts:popover:hide', () => console.log('hidden'));
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Normalized `onShow`/`onHide` to `.on()`, bilingual docs / [ES] Normalizados `onShow`/`onHide` a `.on()`, docs bilingüe |
| 1.0.0 | [EN] Initial release / [ES] Versión inicial |
