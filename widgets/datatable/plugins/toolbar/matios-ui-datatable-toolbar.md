# MTS.DataTableToolbarPlugin

Barra de botones de acción sobre el DataTable. Los botones pueden ser estáticos o **reactivos al estado de la tabla** mediante `condition` y `update()`.

---

## Instalación

```js
const toolbar = new MTS.DataTableToolbarPlugin({ buttons: [...] })

new MTS.DataTable({
  plugins: [toolbar],
  ...
})
```

**Dependencias CSS/JS:** `matios-ui-button.css` + `matios-ui-button.js`

---

## Opciones de cada botón

| Propiedad | Tipo | Descripción |
|---|---|---|
| `label` | `string` | Texto visible. Opcional si hay `icon`. |
| `icon` | `string` | Nombre de icono MTS sin prefijo (ej: `'plus'`). Opcional si hay `label`. |
| `tooltip` | `string` | Atributo `title` + `aria-label` en icon-only. |
| `variant` | `string` | Variante MTS.Button. Default: `'secondary'`. |
| `danger` | `boolean` | Shorthand para `variant: 'danger'`. |
| `disabled` | `boolean` | Siempre deshabilitado, independiente del estado. |
| `condition` | `(table) => boolean` | Si retorna `false`, el botón se deshabilita. Se re-evalúa con `update()`. |
| `action` | `(table) => void` | Callback al hacer clic. Recibe la instancia del DataTable. |

`{ separator: true }` crea un corte visual entre grupos de botones.

---

## API pública

### `toolbar.update()`

Re-evalúa todas las `condition` y habilita/deshabilita botones según el resultado. **No re-renderiza** — solo actualiza el atributo `disabled` de cada botón.

### `toolbar.addButtons(buttons, id)`

Inyecta un conjunto de botones al final del toolbar, precedido por un separador automático. `id` identifica el conjunto para poder eliminarlo después.

Devuelve `this` (chainable).

### `toolbar.removeButtons(id)`

Elimina el conjunto de botones previamente inyectado con ese `id` y re-renderiza el toolbar.

Devuelve `this` (chainable).

---

## Toolbar reactivo al contexto

Los botones con `condition` se habilitan o deshabilitan dinámicamente según lo que ocurre en la tabla. El mecanismo es manual y deliberado: el dev decide **cuándo** y **ante qué eventos** llamar `toolbar.update()`.

### Patrón básico — reaccionar a la selección

```js
new MTS.DataTable({
  plugins: [toolbar],
  onSelectionChange: () => toolbar.update(),
})
```

Con esto, cada vez que el usuario selecciona o deselecciona filas, todas las `condition` se re-evalúan.

### ¿Por qué es manual y no automático?

Cada tabla tiene su propia lógica de negocio. Un toolbar de usuarios reacciona diferente a uno de documentos. Hacerlo automático requeriría que el plugin conozca esa lógica, lo cual rompería la separación de responsabilidades.

El patrón `onSelectionChange: () => toolbar.update()` es suficientemente simple para ser el estándar en todos los casos.

---

## Ejemplo — Activar/Desactivar usuario

```js
const toolbar = new MTS.DataTableToolbarPlugin({
  buttons: [
    {
      label:     'Activar',
      icon:      'check-circle',
      tooltip:   'Activar el usuario seleccionado',
      // Habilitado solo si la selección es un único usuario inactivo
      condition: (table) => {
        const sel = table.getSelection()
        return sel.length === 1 && sel[0].status === 'inactive'
      },
      action: (table) => {
        const [user] = table.getSelection()
        console.log('[users.onActivar]')
        console.log(user)
      },
    },
    {
      label:     'Desactivar',
      icon:      'pause',
      tooltip:   'Desactivar el usuario seleccionado',
      condition: (table) => {
        const sel = table.getSelection()
        return sel.length === 1 && sel[0].status === 'active'
      },
      action: (table) => {
        const [user] = table.getSelection()
        console.log('[users.onDesactivar]')
        console.log(user)
      },
    },
  ],
})

new MTS.DataTable({
  plugins: [toolbar],
  onSelectionChange: () => toolbar.update(),
  ...
})
```

---

## Ejemplo — DocumentManager (Subir, Mover, Eliminar)

Cuando el toolbar coexiste con `MTS.DocumentManagerPlugin`, los botones pueden acceder a la carpeta actual via `dm.getItem()` (requiere cerrar sobre la referencia `dm`):

```js
const dm      = new MTS.DocumentManagerPlugin({...})
const toolbar = new MTS.DataTableToolbarPlugin({
  buttons: [
    {
      label:  'Subir',
      icon:   'upload',
      // dm.getItem() → carpeta actual, null si estás en el root
      action: () => {
        console.log('[dm.onSubir]')
        console.log(dm.getItem())
      },
    },
    { separator: true },
    {
      label:     'Mover',
      icon:      'move',
      condition: (table) => table.getSelection().length > 0,
      action:    (table) => {
        console.log('[dm.onMover]')
        console.log(table.getSelection())
      },
    },
    {
      label:     'Eliminar',
      icon:      'trash',
      danger:    true,
      condition: (table) => table.getSelection().length > 0,
      action:    (table) => {
        console.log('[dm.onEliminar]')
        console.log(table.getSelection())
      },
    },
  ],
})

new MTS.DataTable({
  plugins:           [toolbar, dm],
  onSelectionChange: () => toolbar.update(),
  ...
})
```

---

## Inyección de botones desde plugins externos

Otros plugins pueden añadir sus propios botones al toolbar usando `addButtons` / `removeButtons`. Esto les permite integrarse sin conocer la configuración inicial del toolbar.

```js
// Dentro de install() de un plugin:
const toolbar = table.getPlugin('MTS.DataTableToolbarPlugin')
if (toolbar) {
  toolbar.addButtons([
    { label: 'Aprobar', icon: 'check-circle', condition: ..., action: ... },
  ], 'miPlugin')
}

// Dentro de uninstall() del plugin:
toolbar?.removeButtons('miPlugin')
```

El `id` actúa como namespace del conjunto: permite añadir y quitar en bloque sin afectar otros botones.

### Ejemplo real — `showInToolbar` en WorkflowPlugin

`MTS.DocumentManagerWorkflowPlugin` soporta la opción `showInToolbar: true`, que inyecta automáticamente los botones de workflow (Iniciar, Enviar, Aprobar, Firmar, Rechazar, Reiniciar) al toolbar disponible.

Las condiciones usan **unanimidad de estado**: todos los ítems seleccionados deben compartir el mismo estado para que la acción se habilite.

```js
new MTS.DocumentManagerWorkflowPlugin({
  statusField:   'workflowStatus',
  showInToolbar: true,             // ← inyecta botones de workflow en el toolbar
  onApprove:     (items) => {},
  onReject:      (items) => {},
  // ...
})
```

Requiere que el toolbar esté instalado **antes** que el DM en el array de plugins, y que el dev llame `toolbar.update()` en `onSelectionChange`.

---

## Changelog

| Versión | Cambios |
|---|---|
| 1.2.0 | `addButtons(buttons, id)` / `removeButtons(id)` para inyección desde plugins externos |
| 1.1.0 | Versión inicial |
