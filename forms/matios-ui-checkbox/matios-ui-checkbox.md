# MTS.Checkbox

[EN] Checkbox component — individual with indeterminate state, and groups with vertical or horizontal layout.
[ES] Componente checkbox — individual con estado indeterminado, y grupos con layout vertical u horizontal.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-checkbox.css">
<script src="matios-ui-checkbox.js"></script>
```

---

## MTS.Checkbox — Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `label` | `string` | `''` | [EN] Text next to checkbox / [ES] Texto junto al checkbox |
| `checked` | `boolean` | `false` | [EN] Initial checked state / [ES] Estado inicial |
| `indeterminate` | `boolean` | `false` | [EN] Partial selection state / [ES] Estado de selección parcial |
| `disabled` | `boolean` | `false` | [EN] Disables interaction / [ES] Deshabilita la interacción |
| `value` | `string` | `''` | [EN] Value associated with this checkbox / [ES] Valor asociado a este checkbox |
| `onChange` | `function` | — | [EN] Fires on state change / [ES] Se dispara al cambiar el estado |

---

## MTS.CheckboxGroup — Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `options` | `array` | `[]` | [EN] `[{ value, label, disabled? }]` |
| `value` | `array` | `[]` | [EN] Initially selected values / [ES] Valores seleccionados inicialmente |
| `disabled` | `boolean` | `false` | [EN] Disables all checkboxes / [ES] Deshabilita todos los checkboxes |
| `horizontal` | `boolean` | `false` | [EN] Horizontal layout / [ES] Layout horizontal |
| `onChange` | `function` | — | [EN] Fires when selection changes / [ES] Se dispara al cambiar la selección |

---

## Events / Eventos

[EN] Use `onChange` in the constructor. This is the recommended approach.
[ES] Usa `onChange` en el constructor. Este es el enfoque recomendado.

```js
// Individual checkbox / Checkbox individual
new MTS.Checkbox('#my-checkbox', {
  // Fires on every state change / Se dispara en cada cambio de estado
  onChange: (e) => {
    console.log(e.detail.checked); // → true | false
    console.log(e.detail.value);   // → string value / valor string
  },
});

// Group / Grupo
new MTS.CheckboxGroup('#my-group', {
  options: [...],
  // Fires when any checkbox changes / Se dispara cuando cualquier checkbox cambia
  onChange: (e) => {
    console.log(e.detail.value); // → ['val1', 'val2', ...]
  },
});
```

---

## HTML Usage / Uso HTML

```html
<!-- Individual checkbox / Checkbox individual -->
<div id="chk-terms"></div>

<script>
  new MTS.Checkbox('#chk-terms', {
    label:    'I accept the terms',
    checked:  false,
    onChange: (e) => console.log(e.detail.checked),
  });
</script>

<!-- Group vertical (default) / Grupo vertical -->
<div id="chk-formats"></div>

<script>
  new MTS.CheckboxGroup('#chk-formats', {
    options: [
      { value: 'pdf',  label: 'PDF' },
      { value: 'xlsx', label: 'Excel' },
      { value: 'csv',  label: 'CSV', disabled: true },
    ],
    value:    ['pdf'],
    onChange: (e) => console.log(e.detail.value),
  });
</script>

<!-- Group horizontal / Grupo horizontal -->
<div id="chk-days"></div>

<script>
  new MTS.CheckboxGroup('#chk-days', {
    horizontal: true,
    options: [
      { value: 'mon', label: 'Monday' },
      { value: 'tue', label: 'Tuesday' },
      { value: 'wed', label: 'Wednesday' },
    ],
    value: ['mon'],
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
// Individual / Individual
const chk = new MTS.Checkbox('#my-checkbox', {
  // Text next to checkbox / Texto junto al checkbox
  label: 'Accept terms',

  // Initial state / Estado inicial
  checked: false,

  // Partial selection / Selección parcial
  indeterminate: false,

  // Fires on change / Se dispara al cambiar
  onChange: (e) => console.log(e.detail.checked),
});

// Group / Grupo
const group = new MTS.CheckboxGroup('#my-group', {
  options: [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C', disabled: true },
  ],
  value:      ['a'],
  horizontal: false,
  disabled:   false,
  onChange:   (e) => console.log(e.detail.value),
});
```

---

## API

```js
const chk = new MTS.Checkbox('#my-checkbox', { ... });

// Returns current state / Retorna el estado actual
chk.isChecked()              // → boolean

// Sets state programmatically / Establece el estado programáticamente
chk.setChecked(true)
chk.setChecked(false)

// Toggles current state / Invierte el estado actual
chk.toggle()

// Sets indeterminate state / Establece el estado indeterminado
chk.setIndeterminate(true)

// ── Group API ─────────────────────────────────
const group = new MTS.CheckboxGroup('#my-group', { ... });

// Returns selected values array / Retorna arreglo de valores seleccionados
group.getValue()             // → ['val1', 'val2', ...]
```

---

## DOM Event / Evento DOM

```js
document.getElementById('my-checkbox')
  .querySelector('input')
  .addEventListener('mts:checkbox:change', (e) => {
    console.log(e.detail.checked); // → true | false
  });
```

| Event / Evento | DOM Namespace |
|----------------|---------------|
| `onChange` | `mts:checkbox:change` |

---

## Changelog

| Version | Description |
|---------|-------------|
| 2.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingües, docs estandarizados |
| 2.0.0 | [EN] Split from monolithic checkbox file, fix horizontal layout / [ES] Separado del archivo monolítico, fix layout horizontal |
| 1.0.0 | [EN] Initial release / [ES] Versión inicial |
