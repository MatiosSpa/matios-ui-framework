# MTS.Modal

[EN] Full-featured dialog modal with sizes, scrollable body, footer buttons, focus trap and convenience helpers (confirm, alert, prompt).
[ES] Modal de diálogo completo con tamaños, body scrolleable, botones del footer, trampa de foco y helpers de conveniencia (confirm, alert, prompt).

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-modal.css">
<script src="matios-ui-modal.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `title` | `string` | `''` | [EN] Modal header title / [ES] Título del header |
| `body` | `string\|Element` | `''` | [EN] Body content / [ES] Contenido del body |
| `footer` | `string\|Element` | `null` | [EN] Footer HTML (overrides buttons) / [ES] HTML del footer (sobreescribe buttons) |
| `buttons` | `array` | `[]` | [EN] Footer buttons (see schema) / [ES] Botones del footer |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` · `'xl'` · `'fullscreen'` |
| `closable` | `boolean` | `true` | [EN] Show × button and allow Esc / [ES] Mostrar botón × y permitir Esc |
| `backdrop` | `boolean` | `true` | [EN] Click outside closes modal / [ES] Click fuera cierra el modal |
| `scrollable` | `boolean` | `false` | [EN] Scrollable body / [ES] Body scrolleable |
| `centered` | `boolean` | `true` | [EN] Vertically centered / [ES] Centrado verticalmente |
| `static` | `boolean` | `false` | [EN] No close on Esc or backdrop / [ES] No cierra con Esc ni backdrop |
| `onShow` | `function` | — | [EN] Fires before modal shows (return false to cancel) / [ES] Se dispara antes de mostrar |
| `onShown` | `function` | — | [EN] Fires after modal is fully visible / [ES] Se dispara al estar completamente visible |
| `onHide` | `function` | — | [EN] Fires before modal hides (return false to cancel) / [ES] Se dispara antes de ocultar |
| `onHidden` | `function` | — | [EN] Fires after modal is fully hidden / [ES] Se dispara al estar completamente oculto |

### Button schema / Esquema de botón

| Property | Type | [EN] Description / [ES] Descripción |
|----------|------|--------------------------------------|
| `label` | `string` | [EN] Button text / [ES] Texto del botón |
| `variant` | `string` | `'primary'` · `'secondary'` · `'ghost'` · `'danger'` |
| `close` | `boolean` | [EN] Close modal on click / [ES] Cerrar modal al hacer click |
| `disabled` | `boolean` | [EN] Disables the button / [ES] Deshabilita el botón |
| `onClick` | `function` | [EN] Click handler / [ES] Handler de click |

---

## Events / Eventos

```js
const modal = new MTS.Modal({
  title: 'Confirm action',
  body:  '<p>Are you sure?</p>',
  // Fires before showing (return false to cancel) / Se dispara antes de mostrar
  onShow:   () => console.log('about to show'),
  // Fires after fully shown / Se dispara al estar completamente visible
  onShown:  () => console.log('shown'),
  // Fires before hiding / Se dispara antes de ocultar
  onHide:   () => console.log('about to hide'),
  // Fires after fully hidden / Se dispara al estar completamente oculto
  onHidden: () => console.log('hidden'),
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic / Básico
const modal = new MTS.Modal({
  title: 'Edit user',
  body:  '<div id="user-form"></div>',
  size:  'md',
  buttons: [
    { label: 'Cancel', variant: 'ghost',   close: true },
    { label: 'Save',   variant: 'primary', onClick: () => saveUser() },
  ],
  onShown:  () => initForm('#user-form'),
  onHidden: () => console.log('closed'),
});
modal.show();

// Large scrollable / Grande con scroll
new MTS.Modal({
  title:      'Terms of service',
  body:       longContent,
  size:       'lg',
  scrollable: true,
  buttons: [
    { label: 'Accept', variant: 'primary', close: true },
  ],
}).show();

// Static — user must click a button / Estático — usuario debe hacer click
new MTS.Modal({
  title:   'Required action',
  body:    '<p>You must complete this step.</p>',
  static:  true,
  buttons: [
    { label: 'Done', variant: 'primary', close: true },
  ],
}).show();
```

---

## Convenience Helpers / Helpers de conveniencia

```js
// Confirm dialog / Diálogo de confirmación
MTS.Modal.confirm({
  title:   'Delete record',
  message: 'This action cannot be undone.',
  confirm: 'Delete',
  cancel:  'Cancel',
  danger:  true,
  onConfirm: () => deleteRecord(),
  onCancel:  () => console.log('cancelled'),
});

// Alert dialog / Diálogo de alerta
MTS.Modal.alert({
  title:   'Done',
  message: 'The record was saved successfully.',
  onClose: () => console.log('acknowledged'),
});

// Prompt dialog / Diálogo de prompt
MTS.Modal.prompt({
  title:       'Rename file',
  placeholder: 'New name...',
  value:       currentName,
  onConfirm:   (value) => renameFile(value),
});
```

---

## API

```js
const modal = new MTS.Modal({ ... });

// Show / hide / toggle / Mostrar / ocultar / alternar
modal.show()
modal.hide()
modal.toggle()

// Update content at runtime / Actualizar contenido en runtime
modal.setTitle('New title')
modal.setBody('<p>New content</p>')

// Button state / Estado de botón
modal.setButtonState('btn-save', { disabled: true, label: 'Saving...' })

// Register / remove listeners / Registrar / eliminar listeners
modal.on('shown',  () => console.log('shown'))
modal.on('hidden', () => console.log('hidden'))
modal.off('shown', handler)

// Destroy / Destruir
modal.destroy()
```

---

## DOM Events / Eventos DOM

```js
document.addEventListener('mts:modal:show',   (e) => {});
document.addEventListener('mts:modal:shown',  (e) => {});
document.addEventListener('mts:modal:hide',   (e) => {});
document.addEventListener('mts:modal:hidden', (e) => {});
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingüe, docs estandarizados |
| 1.0.0 | [EN] Initial release — sizes, buttons, confirm/alert/prompt helpers, focus trap / [ES] Versión inicial |
