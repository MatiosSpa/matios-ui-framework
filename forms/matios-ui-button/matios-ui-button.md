# MTS.Button

[EN] Button component with variants, sizes, icons, loading state, groups and custom styles.
[ES] Componente botón con variantes, tamaños, íconos, estado loading, grupos y estilos custom.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-button.css">
<script src="matios-ui-button.js"></script>
```

---

## Options / Opciones

[EN] All options are passed as the second argument to the constructor.
[ES] Todas las opciones se pasan como segundo argumento al constructor.

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `label` | `string` | button text | [EN] Visible text / [ES] Texto visible |
| `variant` | `string` | `'primary'` | `'primary'` · `'secondary'` · `'ghost'` · `'danger'` · `'success'` · `'warning'` · `'link'` |
| `size` | `string` | `''` | `'xs'` · `'sm'` · `''` · `'lg'` · `'xl'` |
| `block` | `boolean` | `false` | [EN] Full width / [ES] Ancho completo |
| `round` | `boolean` | `false` | [EN] Pill border-radius / [ES] Border-radius pill |
| `iconOnly` | `boolean` | `false` | [EN] Square padding, no text / [ES] Padding cuadrado, sin texto |
| `iconLeft` | `string` | `null` | [EN] Left icon HTML / [ES] HTML del ícono izquierdo |
| `iconRight` | `string` | `null` | [EN] Right icon HTML / [ES] HTML del ícono derecho |
| `disabled` | `boolean` | `false` | [EN] Disables interaction / [ES] Deshabilita la interacción |
| `loading` | `boolean` | `false` | [EN] Shows spinner / [ES] Muestra spinner |
| `shadow` | `boolean` | `false` | [EN] Colored shadow / [ES] Sombra de color |
| `ring` | `boolean` | `false` | [EN] Semitransparent ring / [ES] Ring semitransparente |
| `className` | `string` | `''` | [EN] Extra CSS classes / [ES] Clases CSS adicionales |
| `style` | `object` | `null` | [EN] Inline styles / [ES] Estilos inline |
| `onClick` | `function` | — | [EN] Fires on click / [ES] Se dispara al hacer click |

---

## Events / Eventos

[EN] Use `onClick` in the constructor. This is the recommended approach — no need for `addEventListener`.
[ES] Usa `onClick` en el constructor. Este es el enfoque recomendado — no necesitas `addEventListener`.

```js
new MTS.Button('#my-btn', {
  // Fires on every click, receives the DOM event and the instance
  // Se dispara en cada click, recibe el evento DOM y la instancia
  onClick: (event, instance) => {
    instance.setLoading(true);
    instance.setLabel('Saving...');
    setTimeout(() => {
      instance.setLoading(false);
      instance.setLabel('Saved ✓');
    }, 1500);
  },
});
```

[EN] The callback receives:
[ES] El callback recibe:

| Parameter | Type | Description / Descripción |
|-----------|------|---------------------------|
| `event` | `MouseEvent` | [EN] Native DOM click event / [ES] Evento click DOM nativo |
| `instance` | `MTS.Button` | [EN] The button instance / [ES] La instancia del botón |

---

## HTML Usage / Uso HTML

[EN] Declare the button in HTML using `data-*` attributes, then instantiate with JavaScript.
[ES] Declara el botón en HTML usando atributos `data-*`, luego instancia con JavaScript.

```html
<button id="btn-save"
  data-variant="primary"
  data-label="Save"
  data-shadow>
</button>

<script>
  new MTS.Button('#btn-save', {
    // Fires on click / Se dispara al hacer click
    onClick: (event, instance) => {
      instance.setLoading(true);
      setTimeout(() => instance.setLoading(false), 1500);
    },
  });
</script>
```

[EN] Available `data-*` attributes:
[ES] Atributos `data-*` disponibles:

| Attribute / Atributo | JS Option | Description / Descripción |
|----------------------|-----------|---------------------------|
| `data-label` | `label` | [EN] Button text / [ES] Texto del botón |
| `data-variant` | `variant` | `primary` · `secondary` · `ghost` · `danger` · `success` · `warning` · `link` |
| `data-size` | `size` | `xs` · `sm` · `lg` · `xl` |
| `data-disabled` | `disabled` | [EN] Presence activates / [ES] Presencia activa |
| `data-loading` | `loading` | [EN] Presence activates / [ES] Presencia activa |
| `data-block` | `block` | [EN] Full width / [ES] Ancho completo |
| `data-round` | `round` | [EN] Pill shape / [ES] Forma pill |
| `data-icon-only` | `iconOnly` | [EN] Square padding / [ES] Padding cuadrado |
| `data-shadow` | `shadow` | [EN] Colored shadow / [ES] Sombra de color |
| `data-ring` | `ring` | [EN] Semitransparent ring / [ES] Ring semitransparente |

---

## JavaScript Usage / Uso JavaScript

[EN] Create the component entirely from JavaScript — the container only needs to exist in the DOM.
[ES] Crea el componente completamente desde JavaScript — el contenedor solo necesita existir en el DOM.

```js
const btn = new MTS.Button('#my-btn', {
  // Visible text / Texto visible
  label: 'Save changes',

  // Visual variant / Variante visual
  variant: 'primary',

  // Size: 'xs' | 'sm' | '' | 'lg' | 'xl' / Tamaño
  size: '',

  // Colored shadow / Sombra de color
  shadow: true,

  // Fires on click / Se dispara al hacer click
  onClick: (event, instance) => {
    console.log('clicked!');
  },
});
```

---

## API

[EN] Methods available on the instance after creation.
[ES] Métodos disponibles en la instancia después de crearla.

```js
const btn = new MTS.Button('#my-btn', { ... });

// Enable / disable interaction / Habilitar / deshabilitar interacción
btn.enable()
btn.disable()

// Show / hide loading spinner / Mostrar / ocultar spinner de carga
btn.setLoading(true)
btn.setLoading(false)

// Change label at runtime / Cambiar texto en runtime
btn.setLabel('Saved ✓')

// Change variant at runtime / Cambiar variante en runtime
btn.setVariant('secondary')

// Toggle shadow / Activar o desactivar sombra
btn.setShadow(true)
btn.setShadow(false)

// Toggle ring / Activar o desactivar ring
btn.setRing(true)
btn.setRing(false)

// Destroy the instance / Destruir la instancia
btn.destroy()
```

---

## MTS.ButtonGroup

[EN] Groups buttons visually — shared borders, no gap, border-radius only on the edges.
[ES] Agrupa botones visualmente — bordes compartidos, sin gap, border-radius solo en los extremos.

```js
const group = new MTS.ButtonGroup('#my-group', [
  // Each object accepts the same options as MTS.Button
  // Cada objeto acepta las mismas opciones que MTS.Button
  { label: 'Day',   variant: 'secondary', onClick: () => {} },
  { label: 'Week',  variant: 'secondary', onClick: () => {} },
  { label: 'Month', variant: 'primary',   onClick: () => {} },
]);

// Set active button by index / Establecer botón activo por índice
group.setActive(2)

// Access individual buttons / Acceder a botones individuales
group.getButton(0).disable()
group.getButton(1).setLabel('New label')
group.getButtons()   // → [MTS.Button, MTS.Button, ...]
```

---

## DOM Event / Evento DOM

[EN] If you need to listen from outside the component instance, use the native DOM event.
[ES] Si necesitas escuchar desde fuera de la instancia, usa el evento DOM nativo.

```js
document.getElementById('my-btn')
  .addEventListener('mts:button:click', (e) => {
    console.log(e.detail.button); // → MTS.Button instance / instancia MTS.Button
  });
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingües, docs estandarizados |
| 1.0.0 | [EN] Initial release — variants, ButtonGroup, loading, onClick / [ES] Versión inicial |
