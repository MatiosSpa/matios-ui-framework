# matios-ui-modal

Componente de diálogo / modal para Matios UI. Sin dependencias externas — reemplaza `bootstrap.Modal` con una API más limpia y eventos con namespace `mts:modal:*`.

---

## Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-modal.css">
<script src="matios-ui-modal.js"></script>
```

---

## Uso básico

```js
const modal = new MTS.Modal({
  title: 'Crear carpeta',
  body:  '<input type="text" class="mts-input" placeholder="Nombre de la carpeta">',
  buttons: [
    { label: 'Cancelar', variant: 'ghost',   close: true },
    { label: 'Crear',    variant: 'primary',  close: true,
      onClick: () => console.log('Crear!') },
  ],
});

modal.show();
```

---

## Configuración completa

```js
const modal = new MTS.Modal({

  // — Identificación —
  id:    'mi-modal',         // ID del elemento DOM (auto si no se provee)

  // — Contenido —
  title:   'Título del modal',
  body:    '<p>Contenido HTML</p>',   // string HTML o Element del DOM
  footer:  null,                      // HTML o Element custom en el footer

  // — Botones del footer —
  buttons: [
    {
      id:       'btn-cancel',        // ID opcional del botón
      label:    'Cancelar',
      variant:  'ghost',             // 'primary'|'secondary'|'ghost'|'danger'
      close:    true,                // cierra el modal al hacer click
      disabled: false,
      onClick:  () => {},
    },
    {
      id:      'btn-confirm',
      label:   'Confirmar',
      variant: 'primary',
      close:   false,                // no cierra — control manual
      onClick: () => {
        // hacer algo...
        modal.hide();
      },
    },
  ],

  // — Comportamiento —
  size:       'md',     // 'sm'|'md'|'lg'|'xl'|'fullscreen'
  closable:   true,     // muestra X y cierra con Esc
  backdrop:   true,     // click fuera cierra
  scrollable: false,    // body scrolleable en vez del viewport
  centered:   true,     // centrado vertical
  static:     false,    // true = no cierra con Esc ni backdrop

  // — Eventos (alternativa a .on()) —
  onShow:    (e) => {},
  onShown:   (e) => {},
  onHide:    (e) => {},
  onHidden:  (e) => {},
});
```

---

## API pública

```js
const modal = new MTS.Modal({ ... });

modal.show()                          // abre el modal
modal.hide()                          // cierra el modal
modal.toggle()                        // toggle open/close
modal.destroy()                       // destruye instancia y DOM

modal.setTitle('<b>Nuevo título</b>') // actualiza el título
modal.setBody('<p>Nuevo body</p>')    // actualiza el body

modal.setButtonDisabled('btn-ok', true)          // deshabilita botón
modal.setButtonLabel('btn-ok', 'Guardando...')   // cambia label
modal.setButtonLoading('btn-ok', true)           // spinner en botón

modal.isOpen                          // true/false — getter
modal.element                         // el elemento DOM del modal
```

---

## Eventos

Todos los eventos se emiten de dos formas simultáneas:

### 1. API `.on()` — recomendado

```js
modal.on('show',    (e) => console.log('abriendo'))
modal.on('shown',   (e) => console.log('abierto'))
modal.on('hide',    (e) => console.log('cerrando'))
modal.on('hidden',  (e) => console.log('cerrado'))

modal.off('shown', miCallback)  // remover listener
```

### 2. CustomEvent en el DOM — `mts:modal:[evento]`

```js
document.getElementById('mi-modal')
  .addEventListener('mts:modal:shown', (e) => {
    console.log('Modal abierto:', e.detail.modal)
  })
```

### Cancelar apertura/cierre

Los eventos `show` y `hide` son cancelables con `preventDefault()`:

```js
modal.on('hide', (e) => {
  if (formularioSuciio) {
    e.preventDefault()  // ← previene el cierre
    // mostrar confirmación...
  }
})
```

### Tabla de eventos

| Evento | Cuándo | Cancelable | Namespace DOM |
|--------|--------|-----------|---------------|
| `show` | Antes de abrir, animación no empezó | ✅ | `mts:modal:show` |
| `shown` | Después de abrir, animación terminó | ❌ | `mts:modal:shown` |
| `hide` | Antes de cerrar, animación no empezó | ✅ | `mts:modal:hide` |
| `hidden` | Después de cerrar, animación terminó | ❌ | `mts:modal:hidden` |

---

## Modales de conveniencia

### `MTS.Modal.confirm()` — Confirmación

Retorna una `Promise<boolean>`:

```js
const confirmado = await MTS.Modal.confirm({
  title:        '¿Eliminar elementos?',
  message:      'Esta acción no se puede deshacer.',
  confirmLabel: 'Eliminar',
  cancelLabel:  'Cancelar',
  variant:      'danger',   // color del botón confirmar
  size:         'sm',
})

if (confirmado) {
  // eliminar...
}
```

### `MTS.Modal.alert()` — Alerta simple

```js
await MTS.Modal.alert({
  title:   'Operación exitosa',
  message: 'La carpeta fue creada correctamente.',
  label:   'Aceptar',
})
```

### `MTS.Modal.prompt()` — Input de texto

Retorna `Promise<string|null>` — `null` si cancela:

```js
const nombre = await MTS.Modal.prompt({
  title:        'Renombrar archivo',
  label:        'Nuevo nombre',
  placeholder:  'Ingresa el nombre',
  value:        item.fileName,
  confirmLabel: 'Renombrar',
  cancelLabel:  'Cancelar',
})

if (nombre !== null) {
  // renombrar con `nombre`
}
```

---

## Migración desde Bootstrap

### Antes (Bootstrap)

```js
// En documentCreateFolderUI.js
this.createFolderModal = new bootstrap.Modal(
  document.getElementById('createFolderModal')
)

document.getElementById('createFolderModal')
  .addEventListener('shown.bs.modal', () => {
    document.getElementById('folderNameInput').focus()
  })

document.getElementById('createFolderModal')
  .addEventListener('hidden.bs.modal', () => {
    document.getElementById('folderNameInput').value = ''
  })

this.createFolderModal.show()
this.createFolderModal.hide()
```

### Opción A — Migración completa (recomendada)

```js
// Sin HTML en el cshtml — modal 100% en JS
this.createFolderModal = new MTS.Modal({
  title:  'Crear nueva carpeta',
  size:   'md',
  static: true,
  body: `
    <div class="mts-form-group">
      <label class="mts-label">Nombre de la carpeta</label>
      <input id="folderNameInput" type="text"
             class="mts-input" placeholder="Nombre" autocomplete="off">
    </div>
  `,
  buttons: [
    { label: 'Cancelar', variant: 'ghost',   close: true },
    { id: 'btn-crear', label: 'Crear', variant: 'primary',
      onClick: () => this.#crearCarpeta() },
  ],
  onShown:  () => document.getElementById('folderNameInput').focus(),
  onHidden: () => document.getElementById('folderNameInput').value = '',
})

this.createFolderModal.show()
this.createFolderModal.hide()
```

### Opción B — Migración mínima (envuelve HTML existente)

Si no quieres tocar el HTML del cshtml todavía:

```js
// Envuelve el elemento Bootstrap existente
this.createFolderModal = new MTS.Modal({
  elementId: 'createFolderModal',   // ← ID del modal en el cshtml
  size:      'md',
  static:    true,
})

// Los eventos ahora usan la API MTS
this.createFolderModal
  .on('shown',  () => document.getElementById('folderNameInput').focus())
  .on('hidden', () => document.getElementById('folderNameInput').value = '')

this.createFolderModal.show()
this.createFolderModal.hide()
```

### Tabla de equivalencias

| Bootstrap | MTS.Modal |
|-----------|-----------|
| `new bootstrap.Modal(el)` | `new MTS.Modal({ elementId: 'id' })` |
| `modal.show()` | `modal.show()` ✅ igual |
| `modal.hide()` | `modal.hide()` ✅ igual |
| `shown.bs.modal` | `mts:modal:shown` o `.on('shown', cb)` |
| `hidden.bs.modal` | `mts:modal:hidden` o `.on('hidden', cb)` |
| `data-bs-backdrop="static"` | `static: true` |
| `data-bs-dismiss="modal"` | `close: true` en el botón |

---

## Spinner en botón durante operación async

```js
const modal = new MTS.Modal({
  title: 'Subir documento',
  buttons: [
    { label: 'Cancelar', variant: 'ghost', close: true },
    {
      id:      'btn-upload',
      label:   'Subir',
      variant: 'primary',
      onClick: async () => {
        modal.setButtonLoading('btn-upload', true)
        try {
          await uploadService.upload(files)
          modal.hide()
        } catch (err) {
          await MTS.Modal.alert({ title: 'Error', message: err.message })
        } finally {
          modal.setButtonLoading('btn-upload', false)
        }
      }
    },
  ],
})
```

---

## Changelog

| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — Modal, confirm(), alert(), prompt(), eventos `mts:modal:*`, focus trap, backward compat Bootstrap |

---

**Siguiente:** [`matios-ui-toast.md`](./matios-ui-toast.md) — Notificaciones flotantes con `mts:toast:*`.

---

## Helpers estáticos — estilo callback

```js
// confirm — callback (recomendado)
MTS.Modal.confirm({
  title: '¿Eliminar?', message: 'Esta acción no se puede deshacer.',
  variant: 'danger', confirmText: 'Eliminar', cancelText: 'Cancelar',
  onConfirm: () => eliminar(),
  onCancel:  () => console.log('cancelado'),
})

// confirm — Promise (también funciona)
const ok = await MTS.Modal.confirm({ confirmText: 'Eliminar', variant: 'danger' })
if (ok) eliminar()

// alert — callback
MTS.Modal.alert({
  title: 'Guardado', message: 'Cambios guardados.',
  onAccept: () => console.log('aceptado'),
})

// prompt — callback
MTS.Modal.prompt({
  title: 'Renombrar', placeholder: 'Nuevo nombre...',
  onConfirm: (value) => renombrar(value),
  onCancel:  () => console.log('cancelado'),
})
```

