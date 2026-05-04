# MTS.Checkbox

🇬🇧 Checkbox component — individual with indeterminate state, and groups with vertical or horizontal layout.
🇪🇸 Componente checkbox — individual con estado indeterminado, y grupos con layout vertical u horizontal.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-checkbox.css">
<script src="matios-ui-checkbox.js"></script>
```

---

## MTS.Checkbox — Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `label` | `string` | `''` | 🇬🇧 Text next to checkbox / 🇪🇸 Texto junto al checkbox |
| `checked` | `boolean` | `false` | 🇬🇧 Initial checked state / 🇪🇸 Estado inicial |
| `indeterminate` | `boolean` | `false` | 🇬🇧 Partial selection state / 🇪🇸 Estado de selección parcial |
| `disabled` | `boolean` | `false` | 🇬🇧 Disables interaction / 🇪🇸 Deshabilita la interacción |
| `value` | `string` | `''` | 🇬🇧 Value associated with this checkbox / 🇪🇸 Valor asociado a este checkbox |
| `onChange` | `function` | — | 🇬🇧 Fires on state change / 🇪🇸 Se dispara al cambiar el estado |

---

## MTS.CheckboxGroup — Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `options` | `array` | `[]` | 🇬🇧 `[{ value, label, disabled? }]` |
| `value` | `array` | `[]` | 🇬🇧 Initially selected values / 🇪🇸 Valores seleccionados inicialmente |
| `disabled` | `boolean` | `false` | 🇬🇧 Disables all checkboxes / 🇪🇸 Deshabilita todos los checkboxes |
| `horizontal` | `boolean` | `false` | 🇬🇧 Horizontal layout / 🇪🇸 Layout horizontal |
| `onChange` | `function` | — | 🇬🇧 Fires when selection changes / 🇪🇸 Se dispara al cambiar la selección |

---

## Events / Eventos

🇬🇧 Use `onChange` in the constructor. This is the recommended approach.
🇪🇸 Usa `onChange` en el constructor. Este es el enfoque recomendado.

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
