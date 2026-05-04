# MTS.ConfirmButton

🇬🇧 Two-step inline confirmation button. Prevents accidental actions without requiring a modal. Includes an auto-cancel timeout bar.
🇪🇸 Botón de confirmación inline en 2 pasos. Evita acciones accidentales sin necesitar un modal. Incluye barra de timeout que auto-cancela.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-button.css">
<link rel="stylesheet" href="matios-ui-confirmbutton.css">
<script src="matios-ui-button.js"></script>
<script src="matios-ui-confirmbutton.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `label` | `string` | `'Eliminar'` | 🇬🇧 Initial button label / 🇪🇸 Label del botón inicial |
| `confirmLabel` | `string` | `'¿Confirmar?'` | 🇬🇧 Confirm button label / 🇪🇸 Label del botón confirmar |
| `cancelLabel` | `string` | `'No'` | 🇬🇧 Cancel button label / 🇪🇸 Label del botón cancelar |
| `variant` | `string` | `'secondary'` | 🇬🇧 Initial button variant / 🇪🇸 Variante inicial |
| `confirmVariant` | `string` | `'danger'` | 🇬🇧 Variant during confirmation / 🇪🇸 Variante al confirmar |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` |
| `timeout` | `number` | `4000` | 🇬🇧 Auto-cancel delay in ms. `0` = no timeout / 🇪🇸 Delay auto-cancelar en ms. `0` = sin timeout |
| `iconLeft` | `string` | `''` | 🇬🇧 Left icon HTML / 🇪🇸 HTML del ícono izquierdo |
| `onConfirm` | `function` | — | 🇬🇧 Fires when user confirms / 🇪🇸 Se dispara al confirmar |
| `onCancel` | `function` | — | 🇬🇧 Fires when user cancels or timeout expires / 🇪🇸 Se dispara al cancelar o expirar |

---

## Events / Eventos

🇬🇧 Use `onConfirm` and `onCancel` in the constructor. This is the recommended approach.
🇪🇸 Usa `onConfirm` y `onCancel` en el constructor. Este es el enfoque recomendado.

```js
new MTS.ConfirmButton('#my-btn', {
  // Fires when user clicks the confirm button / Se dispara al hacer click en confirmar
  onConfirm: () => {
    deleteRecord();
  },

  // Fires when user cancels or the timeout bar expires
  // Se dispara al cancelar o cuando expira la barra de timeout
  onCancel: () => {
    console.log('cancelled');
  },
});
```

---

## HTML Usage / Uso HTML

```html
<div id="btn-delete"
  data-label="Delete record"
  data-confirm-label="Yes, delete"
  data-cancel-label="Cancel"
  data-variant="secondary"
  data-confirm-variant="danger"
  data-timeout="5000">
</div>

<script>
  new MTS.ConfirmButton('#btn-delete', {
    onConfirm: () => console.log('deleted'),
    onCancel:  () => console.log('cancelled'),
  });
</script>
```

🇬🇧 Available `data-*` attributes:
🇪🇸 Atributos `data-*` disponibles:

| Attribute / Atributo | JS Option | Description / Descripción |
|----------------------|-----------|---------------------------|
| `data-label` | `label` | 🇬🇧 Initial label / 🇪🇸 Label inicial |
| `data-confirm-label` | `confirmLabel` | 🇬🇧 Confirm label / 🇪🇸 Label confirmar |
| `data-cancel-label` | `cancelLabel` | 🇬🇧 Cancel label / 🇪🇸 Label cancelar |
| `data-variant` | `variant` | 🇬🇧 Initial button variant / 🇪🇸 Variante del botón inicial |
| `data-confirm-variant` | `confirmVariant` | 🇬🇧 Confirm step variant / 🇪🇸 Variante del paso de confirmación |
| `data-size` | `size` | `sm` · `md` · `lg` |
| `data-timeout` | `timeout` | 🇬🇧 ms, `0` = no timeout / 🇪🇸 ms, `0` = sin timeout |
| `data-disabled` | `disabled` | 🇬🇧 Presence activates / 🇪🇸 Presencia activa |

---

## JavaScript Usage / Uso JavaScript

```js
const btn = new MTS.ConfirmButton('#my-btn', {
  // Initial label / Label inicial
  label: 'Delete record',

  // Confirm step label / Label del paso de confirmación
  confirmLabel: 'Yes, delete',

  // Cancel label / Label de cancelar
  cancelLabel: 'No, keep it',

  // Initial variant / Variante inicial
  variant: 'secondary',

  // Variant shown during confirmation / Variante al confirmar
  confirmVariant: 'danger',

  // Auto-cancel after 4 seconds / Auto-cancelar tras 4 segundos
  timeout: 4000,

  // Fires on confirm / Se dispara al confirmar
  onConfirm: () => deleteRecord(),

  // Fires on cancel or timeout / Se dispara al cancelar o expirar
  onCancel: () => console.log('cancelled'),
});
```

---

## API

```js
const btn = new MTS.ConfirmButton('#my-btn', { ... });

// Reset to initial state / Resetear al estado inicial
btn.reset()

// Disable / enable all buttons / Deshabilitar / habilitar todos los botones
btn.disable()
btn.enable()
```

---
