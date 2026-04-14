# MTS.Tooltip

[EN] Tooltip with smart positioning, multiple triggers, variants and HTML content support. Includes `initAll()` for bulk initialization from HTML attributes.
[ES] Tooltip con posicionamiento inteligente, múltiples triggers, variantes y soporte de HTML. Incluye `initAll()` para inicialización masiva desde atributos HTML.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-tooltip.css">
<script src="matios-ui-tooltip.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `content` | `string` | `''` | [EN] Tooltip HTML or text / [ES] HTML o texto del tooltip |
| `position` | `string` | `'top'` | `'top'` · `'bottom'` · `'left'` · `'right'` |
| `trigger` | `string` | `'hover'` | `'hover'` · `'click'` · `'focus'` |
| `delay` | `number` | `0` | [EN] Show delay in ms / [ES] Delay para mostrar en ms |
| `hideDelay` | `number` | `0` | [EN] Hide delay in ms / [ES] Delay para ocultar en ms |
| `offset` | `number` | `8` | [EN] Gap between target and tooltip in px / [ES] Separación en px |
| `variant` | `string` | `'dark'` | `'dark'` · `'light'` |
| `maxWidth` | `number` | `220` | [EN] Max width in px / [ES] Ancho máximo en px |
| `color` | `string` | `null` | [EN] Custom text color / [ES] Color de texto personalizado |
| `bg` | `string` | `null` | [EN] Custom background color / [ES] Color de fondo personalizado |

---

## Events / Eventos

```js
const tt = new MTS.Tooltip('#my-btn', {
  content:  'Click to save',
  position: 'top',
});

// Fires when tooltip shows / Se dispara al mostrar el tooltip
tt.on('show', () => console.log('shown'));

// Fires when tooltip hides / Se dispara al ocultar el tooltip
tt.on('hide', () => console.log('hidden'));
```

---

## HTML Usage / Uso HTML

```html
<!-- data-tooltip enables automatic init / data-tooltip habilita init automática -->
<button data-tooltip="Save document" data-tooltip-position="top">Save</button>
<button data-tooltip="Delete item"   data-tooltip-position="bottom" data-tooltip-variant="light">Delete</button>

<script>
  MTS.Tooltip.initAll(); // init all [data-tooltip] elements / inicializa todos los elementos [data-tooltip]
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic hover / Hover básico
new MTS.Tooltip('#btn-save', {
  content:  'Save document',
  position: 'top',
});

// Click trigger / Trigger click
new MTS.Tooltip('#btn-info', {
  content:  '&lt;strong&gt;Pro tip:&lt;/strong&gt; Use ⌘S to save quickly.',
  trigger:  'click',
  position: 'bottom',
  maxWidth: 260,
});

// With delay / Con delay
new MTS.Tooltip('#btn-help', {
  content:   'Detailed help text here.',
  delay:     400,     // wait 400ms before showing / esperar 400ms antes de mostrar
  hideDelay: 200,
  position:  'right',
});

// Custom colors / Colores personalizados
new MTS.Tooltip('#btn-custom', {
  content: 'Custom styled tooltip',
  bg:      '#7c3aed',
  color:   '#ffffff',
});

// Light variant / Variante clara
new MTS.Tooltip('#btn-light', {
  content: 'Light tooltip',
  variant: 'light',
});

// Events / Eventos
const tt = new MTS.Tooltip('#btn-track', {
  content: 'Track this',
});
tt.on('show', () => analytics.track('tooltip_shown'));
tt.on('hide', () => analytics.track('tooltip_hidden'));
```

---

## Bulk Init / Inicialización masiva

```js
// Initialize all elements with data-tooltip attribute
// Inicializa todos los elementos con el atributo data-tooltip
MTS.Tooltip.initAll();

// Or initialize within a specific container / O dentro de un contenedor específico
MTS.Tooltip.initAll('#my-section');
```

```html
<!-- Supported data-* attributes / Atributos data-* soportados -->
<button
  data-tooltip="Tooltip text"
  data-tooltip-position="bottom"
  data-tooltip-trigger="click"
  data-tooltip-variant="light"
  data-tooltip-delay="300"
  data-tooltip-max-width="300">
  Button
</button>
```

---

## API

```js
const tt = new MTS.Tooltip('#my-btn', { ... });

// Show / hide manually / Mostrar / ocultar manualmente
tt.show()
tt.hide()

// Update content at runtime / Actualizar contenido en runtime
tt.setContent('New tooltip text')

// Register listeners / Registrar listeners
tt.on('show', () => {})
tt.on('hide', () => {})
tt.off('show', handler)

// Destroy / Destruir
tt.destroy()
```

---

## DOM Events / Eventos DOM

```js
document.getElementById('my-btn')
  .addEventListener('mts:tooltip:show', () => console.log('shown'));

document.getElementById('my-btn')
  .addEventListener('mts:tooltip:hide', () => console.log('hidden'));
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingüe, docs estandarizados |
| 1.0.0 | [EN] Initial release — smart positioning, initAll(), HTML content / [ES] Versión inicial |
