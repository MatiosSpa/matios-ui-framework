# MTS.Select

[EN] Select component with search, multi-select, option groups, icons and external async search.
[ES] Componente select con búsqueda, multi-selección, grupos de opciones, íconos y búsqueda asíncrona externa.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-select.css">
<script src="matios-ui-select.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `options` | `array` | `[]` | [EN] `[{ value, label, group?, icon?, disabled? }]` |
| `value` | `any` | `null` | [EN] Initial selected value / [ES] Valor seleccionado inicialmente |
| `label` | `string` | `''` | [EN] Field label / [ES] Etiqueta del campo |
| `placeholder` | `string` | `'Selecciona...'` | |
| `hint` | `string` | `''` | [EN] Helper text / [ES] Texto de ayuda |
| `multiple` | `boolean` | `false` | [EN] Allow multiple selection / [ES] Permitir selección múltiple |
| `searchable` | `boolean` | `false` | [EN] Enable search inside list / [ES] Habilitar búsqueda en la lista |
| `clearable` | `boolean` | `false` | [EN] Show clear button / [ES] Mostrar botón limpiar |
| `disabled` | `boolean` | `false` | [EN] Disables interaction / [ES] Deshabilita la interacción |
| `maxSelect` | `number` | `null` | [EN] Max selections in multi mode / [ES] Máximo de selecciones en modo multi |
| `debounce` | `number` | `300` | [EN] Debounce delay for `onSearch` in ms / [ES] Delay debounce para `onSearch` en ms |
| `minChars` | `number` | `1` | [EN] Min chars to trigger `onSearch` / [ES] Mínimo de caracteres para disparar `onSearch` |
| `onSearch` | `function` | — | [EN] Async search: `async (query) => [{value, label}]` / [ES] Búsqueda asíncrona |
| `onChange` | `function` | — | [EN] Fires on selection change / [ES] Se dispara al cambiar la selección |

---

## Events / Eventos

[EN] Use `onChange` in the constructor. This is the recommended approach.
[ES] Usa `onChange` en el constructor. Este es el enfoque recomendado.

```js
new MTS.Select('#my-select', {
  options: [...],
  // Fires when selection changes / Se dispara al cambiar la selección
  onChange: (e) => {
    console.log(e.detail.value);   // → selected value / valor seleccionado
    console.log(e.detail.text);    // → selected label / label seleccionado
    console.log(e.detail.option);  // → full option object / objeto opción completo
  },
});
```

[EN] For multi-select, the event detail contains:
[ES] Para multi-select, el detalle del evento contiene:

```js
onChange: (e) => {
  console.log(e.detail.value);   // → ['val1', 'val2']
  console.log(e.detail.text);    // → ['Label 1', 'Label 2']
  console.log(e.detail.options); // → [{value, label}, ...]
},
```

---

## HTML Usage / Uso HTML

```html
<!-- Basic select / Select básico -->
<div id="sel-country"
  data-label="Country"
  data-placeholder="Select a country..."
  data-clearable>
</div>

<script>
  new MTS.Select('#sel-country', {
    options: [
      { value: 'cl', label: 'Chile' },
      { value: 'ar', label: 'Argentina' },
      { value: 'mx', label: 'México' },
    ],
    onChange: (e) => console.log(e.detail.value),
  });
</script>

<!-- Multi-select / Multi-selección -->
<div id="sel-tags"
  data-label="Technologies"
  data-multiple
  data-searchable>
</div>

<script>
  new MTS.Select('#sel-tags', {
    options: [
      { value: 'js',  label: 'JavaScript' },
      { value: 'ts',  label: 'TypeScript' },
      { value: 'css', label: 'CSS' },
    ],
    value:    ['js'],
    onChange: (e) => console.log(e.detail.value),
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic / Básico
const sel = new MTS.Select('#my-select', {
  // Options list / Lista de opciones
  options: [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B', disabled: true },
    { value: 'c', label: 'Option C' },
  ],

  // Initial value / Valor inicial
  value: 'a',

  // Field label / Etiqueta del campo
  label: 'Select an option',

  // Fires on change / Se dispara al cambiar
  onChange: (e) => console.log(e.detail.value, e.detail.text),
});

// With option groups / Con grupos de opciones
new MTS.Select('#my-select', {
  options: [
    { value: 'a1', label: 'Alpha 1', group: 'Group A' },
    { value: 'a2', label: 'Alpha 2', group: 'Group A' },
    { value: 'b1', label: 'Beta 1',  group: 'Group B' },
  ],
  label: 'Grouped select',
});

// With async external search / Con búsqueda externa asíncrona
new MTS.Select('#my-select', {
  label:     'Search users',
  searchable: true,
  minChars:   2,
  debounce:   400,
  // Called by the component on each keystroke
  // El componente lo llama en cada tecla
  onSearch: async (query) => {
    const res = await fetch('/api/users?q=' + query);
    return res.json(); // must return [{value, label}] / debe retornar [{value, label}]
  },
  onChange: (e) => console.log(e.detail.value),
});
```

---

## API

```js
const sel = new MTS.Select('#my-select', { ... });

// Get / set value / Obtener / establecer valor
sel.getValue()         // → value | [value, ...]
sel.getValue()         // → string | null (single) | string[] (multiple)
sel.setText()          // → selected label string / label del valor seleccionado
sel.setValue('b')

// Clear selection / Limpiar selección
sel.clear()

// Replace options list / Reemplazar lista de opciones
sel.setOptions([{ value: 'x', label: 'X' }])
sel.setOptions([...], true) // true = also enable / true = también habilita

// Open / close / toggle dropdown / Abrir / cerrar / alternar dropdown
sel.open()
sel.close()
sel.toggle()

// Enable / disable / Habilitar / deshabilitar
sel.enable()
sel.disable()

// Destroy / Destruir
sel.destroy()
```

---

## DOM Events / Eventos DOM

```js
document.getElementById('my-select')
  .addEventListener('mts:select:change', (e) => {
    console.log(e.detail.value);
  });
```

| Event / Evento | DOM Namespace |
|----------------|---------------|
| `onChange` | `mts:select:change` |
| — | `mts:select:open` |
| — | `mts:select:close` |

---

## Changelog

| Version | Description |
|---------|-------------|
| 2.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingües, docs estandarizados |
| 2.0.0 | [EN] Portal dropdown, async search, multi-select, groups / [ES] Dropdown portal, búsqueda asíncrona, multi-selección, grupos |
| 1.0.0 | [EN] Initial release / [ES] Versión inicial |
