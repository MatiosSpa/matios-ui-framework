# MTS.ConfirmButton

[EN] Two-step inline confirmation button. Prevents accidental actions without requiring a modal. Includes an auto-cancel timeout bar.
[ES] Botón de confirmación inline en 2 pasos. Evita acciones accidentales sin necesitar un modal. Incluye barra de timeout que auto-cancela.

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

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `label` | `string` | `'Eliminar'` | [EN] Initial button label / [ES] Label del botón inicial |
| `confirmLabel` | `string` | `'¿Confirmar?'` | [EN] Confirm button label / [ES] Label del botón confirmar |
| `cancelLabel` | `string` | `'No'` | [EN] Cancel button label / [ES] Label del botón cancelar |
| `variant` | `string` | `'secondary'` | [EN] Initial button variant / [ES] Variante inicial |
| `confirmVariant` | `string` | `'danger'` | [EN] Variant during confirmation / [ES] Variante al confirmar |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` |
| `timeout` | `number` | `4000` | [EN] Auto-cancel delay in ms. `0` = no timeout / [ES] Delay auto-cancelar en ms. `0` = sin timeout |
| `iconLeft` | `string` | `''` | [EN] Left icon HTML / [ES] HTML del ícono izquierdo |
| `onConfirm` | `function` | — | [EN] Fires when user confirms / [ES] Se dispara al confirmar |
| `onCancel` | `function` | — | [EN] Fires when user cancels or timeout expires / [ES] Se dispara al cancelar o expirar |

---

## Events / Eventos

[EN] Use `onConfirm` and `onCancel` in the constructor. This is the recommended approach.
[ES] Usa `onConfirm` y `onCancel` en el constructor. Este es el enfoque recomendado.

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

[EN] Available `data-*` attributes:
[ES] Atributos `data-*` disponibles:

| Attribute / Atributo | JS Option | Description / Descripción |
|----------------------|-----------|---------------------------|
| `data-label` | `label` | [EN] Initial label / [ES] Label inicial |
| `data-confirm-label` | `confirmLabel` | [EN] Confirm label / [ES] Label confirmar |
| `data-cancel-label` | `cancelLabel` | [EN] Cancel label / [ES] Label cancelar |
| `data-variant` | `variant` | |
| `data-confirm-variant` | `confirmVariant` | |
| `data-size` | `size` | `sm` · `md` · `lg` |
| `data-timeout` | `timeout` | [EN] ms, `0` = no timeout / [ES] ms, `0` = sin timeout |
| `data-disabled` | `disabled` | [EN] Presence activates / [ES] Presencia activa |

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

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingües, docs estandarizados |
| 1.0.0 | [EN] Initial release / [ES] Versión inicial |
