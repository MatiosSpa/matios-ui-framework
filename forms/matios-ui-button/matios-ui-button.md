# MTS.Button

🇬🇧 Button component with variants, sizes, icons, loading state, groups and custom styles.
🇪🇸 Componente botón con variantes, tamaños, íconos, estado loading, grupos y estilos custom.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-button.css">
<script src="matios-ui-button.js"></script>
```

---

## Options / Opciones

🇬🇧 All options are passed as the second argument to the constructor.
🇪🇸 Todas las opciones se pasan como segundo argumento al constructor.

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `label` | `string` | button text | 🇬🇧 Visible text / 🇪🇸 Texto visible |
| `variant` | `string` | `'primary'` | `'primary'` · `'secondary'` · `'ghost'` · `'danger'` · `'success'` · `'warning'` · `'link'` |
| `size` | `string` | `''` | `'xs'` · `'sm'` · `''` · `'lg'` · `'xl'` |
| `block` | `boolean` | `false` | 🇬🇧 Full width / 🇪🇸 Ancho completo |
| `round` | `boolean` | `false` | 🇬🇧 Pill border-radius / 🇪🇸 Border-radius pill |
| `iconOnly` | `boolean` | `false` | 🇬🇧 Square padding, no text / 🇪🇸 Padding cuadrado, sin texto |
| `iconLeft` | `string` | `null` | 🇬🇧 Left icon HTML / 🇪🇸 HTML del ícono izquierdo |
| `iconRight` | `string` | `null` | 🇬🇧 Right icon HTML / 🇪🇸 HTML del ícono derecho |
| `disabled` | `boolean` | `false` | 🇬🇧 Disables interaction / 🇪🇸 Deshabilita la interacción |
| `loading` | `boolean` | `false` | 🇬🇧 Shows spinner / 🇪🇸 Muestra spinner |
| `shadow` | `boolean` | `false` | 🇬🇧 Colored shadow / 🇪🇸 Sombra de color |
| `ring` | `boolean` | `false` | 🇬🇧 Semitransparent ring / 🇪🇸 Ring semitransparente |
| `className` | `string` | `''` | 🇬🇧 Extra CSS classes / 🇪🇸 Clases CSS adicionales |
| `style` | `object` | `null` | 🇬🇧 Inline styles / 🇪🇸 Estilos inline |
| `onClick` | `function` | — | 🇬🇧 Fires on click / 🇪🇸 Se dispara al hacer click |

---

## Events / Eventos

🇬🇧 Use `onClick` in the constructor. This is the recommended approach — no need for `addEventListener`.
🇪🇸 Usa `onClick` en el constructor. Este es el enfoque recomendado — no necesitas `addEventListener`.

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

🇬🇧 The callback receives:
🇪🇸 El callback recibe:

| Parameter | Type | Description / Descripción |
|-----------|------|---------------------------|
| `event` | `MouseEvent` | 🇬🇧 Native DOM click event / 🇪🇸 Evento click DOM nativo |
| `instance` | `MTS.Button` | 🇬🇧 The button instance / 🇪🇸 La instancia del botón |

---

## HTML Usage / Uso HTML

🇬🇧 Declare the button in HTML using `data-*` attributes, then instantiate with JavaScript.
🇪🇸 Declara el botón en HTML usando atributos `data-*`, luego instancia con JavaScript.

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

🇬🇧 Available `data-*` attributes:
🇪🇸 Atributos `data-*` disponibles:

| Attribute / Atributo | JS Option | Description / Descripción |
|----------------------|-----------|---------------------------|
| `data-label` | `label` | 🇬🇧 Button text / 🇪🇸 Texto del botón |
| `data-variant` | `variant` | `primary` · `secondary` · `ghost` · `danger` · `success` · `warning` · `link` |
| `data-size` | `size` | `xs` · `sm` · `lg` · `xl` |
| `data-disabled` | `disabled` | 🇬🇧 Presence activates / 🇪🇸 Presencia activa |
| `data-loading` | `loading` | 🇬🇧 Presence activates / 🇪🇸 Presencia activa |
| `data-block` | `block` | 🇬🇧 Full width / 🇪🇸 Ancho completo |
| `data-round` | `round` | 🇬🇧 Pill shape / 🇪🇸 Forma pill |
| `data-icon-only` | `iconOnly` | 🇬🇧 Square padding / 🇪🇸 Padding cuadrado |
| `data-shadow` | `shadow` | 🇬🇧 Colored shadow / 🇪🇸 Sombra de color |
| `data-ring` | `ring` | 🇬🇧 Semitransparent ring / 🇪🇸 Ring semitransparente |

---

## JavaScript Usage / Uso JavaScript

🇬🇧 Create the component entirely from JavaScript — the container only needs to exist in the DOM.
🇪🇸 Crea el componente completamente desde JavaScript — el contenedor solo necesita existir en el DOM.

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

🇬🇧 Methods available on the instance after creation.
🇪🇸 Métodos disponibles en la instancia después de crearla.

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

🇬🇧 Groups buttons visually — shared borders, no gap, border-radius only on the edges.
🇪🇸 Agrupa botones visualmente — bordes compartidos, sin gap, border-radius solo en los extremos.

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

🇬🇧 If you need to listen from outside the component instance, use the native DOM event.
🇪🇸 Si necesitas escuchar desde fuera de la instancia, usa el evento DOM nativo.

```js
document.getElementById('my-btn')
  .addEventListener('mts:button:click', (e) => {
    console.log(e.detail.button); // → MTS.Button instance / instancia MTS.Button
  });
```

---
