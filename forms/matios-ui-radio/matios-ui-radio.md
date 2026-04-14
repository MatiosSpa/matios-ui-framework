# MTS.Radio

[EN] Radio button group component — single selection with vertical or horizontal layout.
[ES] Componente grupo de radio buttons — selección única con layout vertical u horizontal.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-radio.css">
<script src="matios-ui-radio.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `options` | `array` | `[]` | [EN] `[{ value, label, disabled? }]` |
| `value` | `string` | `null` | [EN] Initially selected value / [ES] Valor seleccionado inicialmente |
| `name` | `string` | auto | [EN] Radio group name (unique per group) / [ES] Nombre del grupo (único por grupo) |
| `disabled` | `boolean` | `false` | [EN] Disables all radio buttons / [ES] Deshabilita todos los radio buttons |
| `horizontal` | `boolean` | `false` | [EN] Horizontal layout / [ES] Layout horizontal |
| `onChange` | `function` | — | [EN] Fires when selection changes / [ES] Se dispara al cambiar la selección |

---

## Events / Eventos

[EN] Use `onChange` in the constructor. This is the recommended approach.
[ES] Usa `onChange` en el constructor. Este es el enfoque recomendado.

```js
new MTS.Radio('#my-radio', {
  options: [...],
  // Fires when user selects a different option / Se dispara al seleccionar una opción diferente
  onChange: (e) => {
    console.log(e.detail.value); // → selected value string / string del valor seleccionado
  },
});
```

---

## HTML Usage / Uso HTML

```html
<!-- Vertical (default) / Vertical -->
<div id="radio-priority"></div>

<script>
  new MTS.Radio('#radio-priority', {
    name:     'priority',
    value:    'medium',
    options: [
      { value: 'high',   label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low',    label: 'Low' },
    ],
    onChange: (e) => console.log(e.detail.value),
  });
</script>

<!-- Horizontal / Horizontal -->
<div id="radio-view"></div>

<script>
  new MTS.Radio('#radio-view', {
    horizontal: true,
    name:       'view',
    value:      'table',
    options: [
      { value: 'table', label: 'Table' },
      { value: 'cards', label: 'Cards' },
      { value: 'list',  label: 'List' },
    ],
    onChange: (e) => console.log(e.detail.value),
  });
</script>

<!-- With disabled option / Con opción deshabilitada -->
<div id="radio-plan"></div>

<script>
  new MTS.Radio('#radio-plan', {
    horizontal: true,
    name:       'plan',
    value:      'free',
    options: [
      { value: 'free',       label: 'Free' },
      { value: 'pro',        label: 'Pro' },
      { value: 'enterprise', label: 'Enterprise (coming soon)', disabled: true },
    ],
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
const radio = new MTS.Radio('#my-radio', {
  // Array of options / Arreglo de opciones
  options: [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C', disabled: true },
  ],

  // Initially selected value / Valor seleccionado inicialmente
  value: 'a',

  // Radio group name (unique per page) / Nombre del grupo (único por página)
  name: 'my-group',

  // Horizontal layout / Layout horizontal
  horizontal: false,

  // Disables all options / Deshabilita todas las opciones
  disabled: false,

  // Fires when selection changes / Se dispara al cambiar la selección
  onChange: (e) => console.log(e.detail.value),
});
```

---

## API

```js
const radio = new MTS.Radio('#my-radio', { ... });

// Returns selected value / Retorna el valor seleccionado
radio.getValue()        // → string | null

// Sets selected value programmatically / Establece el valor seleccionado programáticamente
radio.setValue('b')
```

---

## DOM Event / Evento DOM

```js
document.getElementById('my-radio')
  .addEventListener('mts:radio:change', (e) => {
    console.log(e.detail.value); // → selected value / valor seleccionado
  });
```

| Event / Evento | DOM Namespace |
|----------------|---------------|
| `onChange` | `mts:radio:change` |

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingües, docs estandarizados |
| 1.0.0 | [EN] Extracted from checkbox, fix horizontal layout / [ES] Extraído del checkbox, fix layout horizontal |
