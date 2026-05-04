# MTS.Modal

🇬🇧 Full-featured dialog modal with sizes, scrollable body, footer buttons, focus trap and convenience helpers (confirm, alert, prompt).
🇪🇸 Modal de diálogo completo con tamaños, body scrolleable, botones del footer, trampa de foco y helpers de conveniencia (confirm, alert, prompt).

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-modal.css">
<script src="matios-ui-modal.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `title` | `string` | `''` | 🇬🇧 Modal header title / 🇪🇸 Título del header |
| `body` | `string\|Element` | `''` | 🇬🇧 Body content / 🇪🇸 Contenido del body |
| `footer` | `string\|Element` | `null` | 🇬🇧 Footer HTML (overrides buttons) / 🇪🇸 HTML del footer (sobreescribe buttons) |
| `buttons` | `array` | `[]` | 🇬🇧 Footer buttons (see schema) / 🇪🇸 Botones del footer |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` · `'xl'` · `'fullscreen'` |
| `radius` | `string` | `'none'` | 🇬🇧 Panel border-radius / 🇪🇸 Radio de bordes del panel — `'none'` · `'sm'` · `'md'` · `'lg'` · `'xl'` |
| `closable` | `boolean` | `true` | 🇬🇧 Show × button and allow Esc / 🇪🇸 Mostrar botón × y permitir Esc |
| `backdrop` | `boolean` | `true` | 🇬🇧 Click outside closes modal / 🇪🇸 Click fuera cierra el modal |
| `scrollable` | `boolean` | `false` | 🇬🇧 Scrollable body / 🇪🇸 Body scrolleable |
| `centered` | `boolean` | `true` | 🇬🇧 Vertically centered / 🇪🇸 Centrado verticalmente |
| `static` | `boolean` | `false` | 🇬🇧 No close on Esc or backdrop / 🇪🇸 No cierra con Esc ni backdrop |
| `onShow` | `function` | — | 🇬🇧 Fires before modal shows (return false to cancel) / 🇪🇸 Se dispara antes de mostrar |
| `onShown` | `function` | — | 🇬🇧 Fires after modal is fully visible / 🇪🇸 Se dispara al estar completamente visible |
| `onHide` | `function` | — | 🇬🇧 Fires before modal hides (return false to cancel) / 🇪🇸 Se dispara antes de ocultar |
| `onHidden` | `function` | — | 🇬🇧 Fires after modal is fully hidden / 🇪🇸 Se dispara al estar completamente oculto |

### Button schema / Esquema de botón

| Property | Type | 🇬🇧 Description / 🇪🇸 Descripción |
|----------|------|--------------------------------------|
| `label` | `string` | 🇬🇧 Button text / 🇪🇸 Texto del botón |
| `variant` | `string` | `'primary'` · `'secondary'` · `'ghost'` · `'danger'` |
| `close` | `boolean` | 🇬🇧 Close modal on click / 🇪🇸 Cerrar modal al hacer click |
| `disabled` | `boolean` | 🇬🇧 Disables the button / 🇪🇸 Deshabilita el botón |
| `onClick` | `function` | 🇬🇧 Click handler / 🇪🇸 Handler de click |

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
