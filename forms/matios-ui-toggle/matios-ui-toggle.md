# MTS.Toggle

🇬🇧 On/off switch component with three sizes, optional label, and disabled state.
🇪🇸 Componente switch encendido/apagado con tres tamaños, label opcional y estado disabled.

---

## Installation / Instalación

🇬🇧 Include the base CSS, the component CSS and the component JS in your HTML.
🇪🇸 Incluye el CSS base, el CSS del componente y el JS del componente en tu HTML.

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-toggle.css">
<script src="matios-ui-toggle.js"></script>
```

---

## Options / Opciones

🇬🇧 All options are passed as the second argument to the constructor.
🇪🇸 Todas las opciones se pasan como segundo argumento al constructor.

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `label` | `string` | `''` | 🇬🇧 Text displayed next to the switch / 🇪🇸 Texto junto al switch |
| `checked` | `boolean` | `false` | 🇬🇧 Initial state / 🇪🇸 Estado inicial |
| `disabled` | `boolean` | `false` | 🇬🇧 Disables all interaction / 🇪🇸 Deshabilita toda interacción |
| `size` | `string` | `'md'` | 🇬🇧 Size variant: `'sm'` · `'md'` · `'lg'` / 🇪🇸 Variante de tamaño |
| `onChange` | `function` | — | 🇬🇧 Fires when state changes / 🇪🇸 Se dispara al cambiar el estado |

---

## Size Reference / Referencia de tamaños

| `size` | Width / Ancho | Height / Alto |
|--------|---------------|---------------|
| `sm`   | 32px          | 18px          |
| `md`   | 42px          | 24px          |
| `lg`   | 52px          | 30px          |

---

## Events / Eventos

🇬🇧 Use `onXxx` callbacks in the constructor. This is the recommended approach — no need for `addEventListener` or `.on()`.
🇪🇸 Usa los callbacks `onXxx` en el constructor. Este es el enfoque recomendado — no necesitas `addEventListener` ni `.on()`.

```js
new MTS.Toggle('#my-toggle', {
  // Fires when the switch is turned on or off
  // Se dispara cuando el switch se enciende o apaga
  onChange: (e) => {
    console.log(e.detail.checked); // → true | false
  },
});
```

🇬🇧 The event object contains:
🇪🇸 El objeto de evento contiene:

| Property / Propiedad | Type / Tipo | Description / Descripción |
|----------------------|-------------|---------------------------|
| `e.detail.checked` | `boolean` | 🇬🇧 Current state / 🇪🇸 Estado actual |

---

## HTML Usage / Uso HTML

🇬🇧 Declare the structure in HTML and instantiate with JavaScript. The component reads the element and builds the switch inside it.
🇪🇸 Declara la estructura en HTML e instancia con JavaScript. El componente lee el elemento y construye el switch dentro.

```html
<div id="my-toggle"></div>

<script>
  new MTS.Toggle('#my-toggle', {
    label:    'Active notifications',
    checked:  true,
    size:     'md',
    onChange: (e) => console.log('checked:', e.detail.checked),
  });
</script>
```

🇬🇧 Disabled state:
🇪🇸 Estado disabled:

```html
<div id="my-toggle-disabled"></div>

<script>
  new MTS.Toggle('#my-toggle-disabled', {
    label:    'Not available',
    disabled: true,
    checked:  false,
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

🇬🇧 Create the component entirely from JavaScript — the container only needs to exist in the DOM.
🇪🇸 Crea el componente completamente desde JavaScript — el contenedor solo necesita existir en el DOM.

```js
const toggle = new MTS.Toggle('#my-toggle', {
  // Text next to the switch / Texto junto al switch
  label: 'Active notifications',

  // Initial state / Estado inicial
  checked: true,

  // Size: 'sm' | 'md' | 'lg' / Tamaño
  size: 'md',

  // Fires on every state change / Se dispara en cada cambio de estado
  onChange: (e) => {
    console.log('checked:', e.detail.checked); // → true | false
  },
});
```

---

## API

🇬🇧 Methods available on the instance after creation.
🇪🇸 Métodos disponibles en la instancia después de crearla.

```js
const toggle = new MTS.Toggle('#my-toggle', { ... });

// Returns current state / Retorna el estado actual
toggle.isChecked()        // → boolean

// Sets state programmatically / Establece el estado programáticamente
toggle.setChecked(true)
toggle.setChecked(false)

// Toggles current state / Invierte el estado actual
toggle.toggle()
```

---

## DOM Event / Evento DOM

🇬🇧 If you need to listen from outside the component instance (e.g. from another module), use the native DOM event.
🇪🇸 Si necesitas escuchar desde fuera de la instancia (ej: desde otro módulo), usa el evento DOM nativo.

```js
document.getElementById('my-toggle')
  .querySelector('input')
  .addEventListener('mts:toggle:change', (e) => {
    console.log(e.detail.checked); // → true | false
  });
```

---
