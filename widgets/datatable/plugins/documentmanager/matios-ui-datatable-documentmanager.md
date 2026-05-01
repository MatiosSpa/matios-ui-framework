# MTS.DocumentManagerPlugin

[EN] Transforms a DataTable into a full document manager with folder navigation, breadcrumb, drag-and-drop, dropzone, and file upload — all extendable via sub-plugins.
[ES] Transforma un DataTable en un gestor de documentos completo con navegación de carpetas, breadcrumb, drag-and-drop, dropzone y subida de archivos — todo extensible mediante sub-plugins.

---

## Installation / Instalación

```html
<!-- DataTable core (required) / DataTable core (requerido) -->
<link rel="stylesheet" href="matios-ui-datatable.css">
<script src="matios-ui-datatable.js"></script>
<script src="matios-ui-datatable-i18n.js"></script>

<!-- Shared menu (required by DM plugins) / Menú compartido (requerido por plugins DM) -->
<link rel="stylesheet" href="plugins/shared/matios-ui-datatable-menu.css">
<script src="plugins/shared/matios-ui-datatable-menu.js"></script>

<!-- DocumentManager -->
<link rel="stylesheet" href="plugins/documentmanager/matios-ui-datatable-documentmanager.css">
<script src="plugins/documentmanager/matios-ui-datatable-documentmanager.js"></script>
```

---

## Architecture / Arquitectura

[EN] The DocumentManager is a **plugin stack**. Each layer adds capabilities and is completely optional:
[ES] El DocumentManager es un **stack de plugins**. Cada capa agrega capacidades y es completamente opcional:

```
MTS.DataTable
 └── MTS.DocumentManagerPlugin             ← folder nav, breadcrumb, drag-drop, dropzone
      └── MTS.DocumentManagerUploadPlugin  ← upload modal with file list and progress
      └── MTS.DocumentManagerContextMenuPlugin  ← right-click / actions column
           └── MTS.DocumentManagerWorkflowPlugin ← approval lifecycle actions
```

[EN] Sub-plugins are passed via `plugins: [...]` in each parent's options.
[ES] Los sub-plugins se pasan mediante `plugins: [...]` en las opciones de cada padre.

---

## MTS.DocumentManagerPlugin

### Options / Opciones

| Option | Type | Default | Description / Descripción |
|--------|------|---------|---------------------------|
| `rootLabel` | `string` | `'Root'` | [EN] Label for the root folder in the breadcrumb / [ES] Etiqueta de la carpeta raíz en el breadcrumb |
| `breadcrumb` | `boolean` | `false` | [EN] Show folder navigation breadcrumb / [ES] Mostrar breadcrumb de navegación de carpetas |
| `dragDrop` | `boolean` | `false` | [EN] Enable drag-and-drop to move items between folders / [ES] Habilitar drag-and-drop para mover ítems entre carpetas |
| `dropzone` | `boolean` | `false` | [EN] Enable OS file drop over the table to trigger upload / [ES] Habilitar arrastre de archivos del OS sobre la tabla para disparar el upload |
| `accept` | `string` | `'*'` | [EN] Accepted file types — extensions (`.pdf`), MIME types (`image/*`), comma-separated / [ES] Tipos de archivo aceptados — extensiones (`.pdf`), MIME types (`image/*`), separados por coma |
| `multiple` | `boolean` | `true` | [EN] Allow uploading more than one file at a time / [ES] Permitir subir más de un archivo a la vez |
| `maxFiles` | `number\|null` | `null` | [EN] Maximum number of files per upload batch / [ES] Máximo de archivos por lote de subida |
| `maxFileSizeMB` | `number\|null` | `null` | [EN] Maximum file size in MB per file / [ES] Tamaño máximo por archivo en MB |
| `onFileExists` | `string` | `'ask'` | `'ask'` · `'replace'` · `'version'` · `'skip'` — [EN] Policy when a file with the same name already exists / [ES] Política cuando ya existe un archivo con el mismo nombre |
| `onFileDrop` | `function` | `null` | `(files, folder) => {}` — [EN] Fires when files are dropped on the dropzone / [ES] Se dispara al soltar archivos en el dropzone |
| `onUpload` | `async function` | `null` | `async (file, folder, { action, currentVersion }) => {}` — [EN] Called once per file during upload / [ES] Se llama una vez por archivo durante la subida |
| `onUploaded` | `function` | `null` | `(files, folder) => {}` — [EN] Fires when the entire batch finishes / [ES] Se dispara cuando termina todo el lote |
| `onError` | `function` | `null` | `(err, file, folder) => {}` — [EN] Fires when a file upload fails / [ES] Se dispara cuando falla la subida de un archivo |
| `onFileClick` | `function` | `null` | `(item) => {}` — [EN] Fires when the user clicks a file row / [ES] Se dispara al hacer clic en una fila de archivo |
| `onDrop` | `function` | `null` | `(items, folder) => {}` — [EN] Fires when items are dragged to a folder (move) / [ES] Se dispara al arrastrar ítems a una carpeta (mover) |
| `plugins` | `array` | `[]` | [EN] Sub-plugins: `DocumentManagerUploadPlugin`, `DocumentManagerContextMenuPlugin` / [ES] Sub-plugins del gestor de documentos |

### `onFileExists` values / valores de `onFileExists`

| Value | Behavior / Comportamiento |
|-------|---------------------------|
| `'ask'` | [EN] Shows per-file buttons: Replace / New version / Skip / [ES] Muestra botones por archivo: Reemplazar / Nueva versión / Omitir |
| `'replace'` | [EN] Auto-replaces the existing file / [ES] Reemplaza automáticamente el archivo existente |
| `'version'` | [EN] Auto-creates a new version / [ES] Crea automáticamente una nueva versión |
| `'skip'` | [EN] Auto-skips (does not upload) / [ES] Omite automáticamente (no sube) |

### `onUpload` callback

[EN] The third argument carries the conflict resolution decision when `onFileExists` is `'ask'`:
[ES] El tercer argumento lleva la decisión de resolución de conflicto cuando `onFileExists` es `'ask'`:

| Property | Type | Description / Descripción |
|----------|------|---------------------------|
| `action` | `'replace'\|'version'\|null` | [EN] `null` = new file with no conflict / [ES] `null` = archivo nuevo sin conflicto |
| `currentVersion` | `string\|null` | [EN] Version string returned by `onCheckFileExists`, if any / [ES] Versión retornada por `onCheckFileExists`, si existe |

### Static render helpers / Helpers de render estáticos

[EN] Use these in column `render` functions — they output ready-to-use HTML:
[ES] Úsalos en las funciones `render` de columna — devuelven HTML listo para usar:

```js
// Icon + name with folder/file styling / Ícono + nombre con estilo carpeta/archivo
render: (v, row) => MTS.DocumentManagerPlugin.renderName(v, row)

// Human-readable file size (KB, MB, GB) / Tamaño legible (KB, MB, GB)
render: MTS.DocumentManagerPlugin.renderSize

// Status badge (active / archived / etc.) / Badge de estado
render: MTS.DocumentManagerPlugin.renderStatus

// Workflow status badge / Badge de estado de workflow
render: MTS.DocumentManagerPlugin.renderWorkflowStatus
```

### `getItems()` method

[EN] Returns the items currently visible in the table (current page data). Useful in `onCheckFileExists` to detect duplicates without an HTTP call.
[ES] Retorna los ítems visibles actualmente en la tabla (datos de la página actual). Útil en `onCheckFileExists` para detectar duplicados sin llamada HTTP.

```js
const items = dm.getItems()
// → [{ id, name, type, size, modified, ... }, ...]
```

### Data contract / Contrato de datos

[EN] The `dataSource` must return items with at least:
[ES] El `dataSource` debe retornar ítems con al menos:

| Field | Type | Description / Descripción |
|-------|------|---------------------------|
| `id` | `string\|number` | [EN] Unique identifier / [ES] Identificador único |
| `name` | `string` | [EN] File or folder name / [ES] Nombre del archivo o carpeta |
| `type` | `'file'\|'folder'` | [EN] Item type — drives icon, click behavior and actions / [ES] Tipo de ítem — define ícono, comportamiento al clic y acciones |
| `size` | `number\|null` | [EN] File size in bytes (null for folders) / [ES] Tamaño en bytes (null para carpetas) |
| `modified` | `string` | [EN] Last modified date as string / [ES] Fecha de última modificación como string |
| `status` | `string\|null` | [EN] Item status (`active`, `archived`, …) / [ES] Estado del ítem |
| `workflowStatus` | `string\|null` | [EN] Workflow state — required only when using WorkflowPlugin / [ES] Estado del workflow — solo requerido con WorkflowPlugin |

### Usage / Uso

```js
const dm = new MTS.DocumentManagerPlugin({
  rootLabel:     'Documentos',
  breadcrumb:    true,
  dragDrop:      true,
  dropzone:      true,

  // File constraints / Restricciones de archivo
  accept:        '.pdf,.docx,.xlsx,image/*',
  multiple:      true,
  maxFiles:      10,
  maxFileSizeMB: 25,
  onFileExists:  'ask',

  onFileDrop: (files, folder) => dmUpload.open(files, folder),

  onUpload: async (file, folder, { action, currentVersion } = {}) => {
    const fd = new FormData();
    fd.append('file',           file);
    fd.append('folderId',       folder?.id ?? '');
    fd.append('action',         action         ?? '');
    fd.append('currentVersion', currentVersion ?? '');
    const res = await http.post('/api/documents/upload', fd);
    if (!res.success) throw new Error(res.message);
  },
  onUploaded:  (files, folder) => table.reload(),
  onError:     (err, file)     => console.error(err),
  onFileClick: (item)          => openPreview(item),
  onDrop:      (items, folder) => moveItems(items, folder),

  plugins: [dmUpload, dmContextMenu],
});

new MTS.DataTable({
  elementId: 'my-table',
  columns: [
    { field: 'name',     label: 'Nombre',    sortable: true,
      render: (v, row) => MTS.DocumentManagerPlugin.renderName(v, row) },
    { field: 'size',     label: 'Tamaño',    align: 'end', width: '100px',
      render: MTS.DocumentManagerPlugin.renderSize },
    { field: 'modified', label: 'Modificado', sortable: true },
    { field: 'status',   label: 'Estado',
      render: MTS.DocumentManagerPlugin.renderStatus },
  ],
  dataSource: async (query) => {
    const res = await http.get('/api/documents', { params: query });
    return res.data;
  },
  rowId:        'id',
  pageSize:     10,
  actionColumn: true,
  plugins:      [dm],
});
```

---

## MTS.DocumentManagerUploadPlugin

[EN] Upload modal with drag-drop area, file list, progress indicator, and conflict resolution. Must be installed as a sub-plugin of `DocumentManagerPlugin`.
[ES] Modal de subida con zona drag-drop, lista de archivos, indicador de progreso y resolución de conflictos. Debe instalarse como sub-plugin de `DocumentManagerPlugin`.

### Additional CSS / CSS adicional

```html
<link rel="stylesheet" href="plugins/documentmanager/matios-ui-datatable-documentmanager-upload.css">
<script src="plugins/documentmanager/matios-ui-datatable-documentmanager-upload.js"></script>

<!-- Modal dependency / Dependencia modal -->
<link rel="stylesheet" href="overlays/matios-ui-modal/matios-ui-modal.css">
<script src="overlays/matios-ui-modal/matios-ui-modal.js"></script>
```

### Options / Opciones

| Option | Type | Default | Description / Descripción |
|--------|------|---------|---------------------------|
| `uploadProgress` | `string` | `'none'` | `'none'` · `'spinner'` · `'bar'` — [EN] Progress indicator style per file / [ES] Estilo de indicador de progreso por archivo |
| `uploadCheck` | `object\|null` | `null` | [EN] File existence check hooks / [ES] Hooks para verificar existencia de archivos |
| `uploadCheck.onCheckFileExists` | `function` | — | `async (file, folder) => false \| true \| { version }` — [EN] Return `false` if the file doesn't exist, `true` or `{ version: 'v1' }` if it does / [ES] Retorna `false` si no existe, `true` o `{ version: 'v1' }` si existe |

### `onCheckFileExists` return values / valores de retorno

| Return | Meaning / Significado |
|--------|-----------------------|
| `false` | [EN] File does not exist — proceed with upload / [ES] El archivo no existe — proceder con la subida |
| `true` | [EN] File exists, no version info / [ES] El archivo existe, sin información de versión |
| `{ version: 'v1' }` | [EN] File exists with a known version — badge shown in UI / [ES] El archivo existe con versión conocida — badge mostrado en la UI |

### `open()` method

[EN] Opens the upload modal. Can be called from a toolbar button or `onFileDrop`.
[ES] Abre el modal de subida. Se puede llamar desde un botón de toolbar o desde `onFileDrop`.

```js
// Open empty / Abrir vacío
dmUpload.open()

// Open pre-loaded with dropped files / Abrir precargado con archivos soltados
dmUpload.open(files, folder)
```

### Constraints read from DocumentManagerPlugin / Restricciones leídas desde DocumentManagerPlugin

[EN] The upload plugin reads `accept`, `multiple`, `maxFiles`, `maxFileSizeMB`, and `onFileExists` directly from `dm._options`. Set them once on `DocumentManagerPlugin` — they apply to both the dropzone and the modal.
[ES] El plugin de upload lee `accept`, `multiple`, `maxFiles`, `maxFileSizeMB` y `onFileExists` directamente desde `dm._options`. Se configuran una sola vez en `DocumentManagerPlugin` y aplican tanto al dropzone como al modal.

### Usage / Uso

```js
const dmUpload = new MTS.DocumentManagerUploadPlugin({
  uploadProgress: 'bar',
  uploadCheck: {
    // Check against visible table data (no HTTP) / Verificar contra datos visibles (sin HTTP)
    onCheckFileExists: (file, folder) => {
      const items = dmUpload._dm?.getItems() ?? [];
      const found = items.find(i => i.type === 'file' && i.name === file.name);
      // Return { version } so the badge is shown in the conflict UI
      // Retornar { version } para mostrar el badge en la UI de conflicto
      return found ? { version: found.version ?? 'v1' } : false;
    },
  },
});
```

---

## MTS.DocumentManagerContextMenuPlugin

[EN] Adds a context menu (right-click or "Actions" column button) with standard document operations. Also injects the actions column into the table automatically.
[ES] Agrega un menú contextual (clic derecho o botón "Acciones") con operaciones estándar de documentos. También inyecta la columna de acciones en la tabla automáticamente.

### Additional CSS / CSS adicional

```html
<script src="plugins/documentmanager/matios-ui-datatable-documentmanager-contextmenu.js"></script>
```

### Options / Opciones

| Option | Type | Description / Descripción |
|--------|------|---------------------------|
| `onView` | `function` | `(item) => {}` — [EN] View file / [ES] Ver archivo |
| `onDownload` | `function` | `(items) => {}` — [EN] Download one or more files / [ES] Descargar uno o más archivos |
| `onOpen` | `function` | `(item) => {}` — [EN] Open folder / [ES] Abrir carpeta |
| `onRename` | `function` | `(item) => {}` — [EN] Rename item / [ES] Renombrar ítem |
| `onMove` | `function` | `(items) => {}` — [EN] Move items / [ES] Mover ítems |
| `onDelete` | `function` | `(items) => {}` — [EN] Delete items / [ES] Eliminar ítems |
| `plugins` | `array` | [EN] Context menu extensions — e.g. `DocumentManagerWorkflowPlugin` / [ES] Extensiones del menú contextual |

[EN] Omitting a handler removes that action from the menu — no need to pass empty functions.
[ES] Omitir un handler elimina esa acción del menú — no es necesario pasar funciones vacías.

### Usage / Uso

```js
const dmCtx = new MTS.DocumentManagerContextMenuPlugin({
  onView:     (item)  => openPreview(item),
  onDownload: (items) => downloadFiles(items),
  onRename:   (item)  => showRenameDialog(item),
  onMove:     (items) => showMoveDialog(items),
  onDelete:   (items) => confirmDelete(items),
  plugins:    [dmWorkflow],
});
```

---

## MTS.DocumentManagerWorkflowPlugin

[EN] Extends the context menu with approval lifecycle actions based on the item's `workflowStatus` field. Optionally renders workflow buttons in the toolbar.
[ES] Extiende el menú contextual con acciones del ciclo de vida de aprobación basadas en el campo `workflowStatus` del ítem. Opcionalmente renderiza botones de workflow en el toolbar.

### Lifecycle / Ciclo de vida

```
null/undefined  →  Iniciar       (onStart)
draft           →  Enviar a aprobación  (onSendForApproval)
pending         →  Aprobar (onApprove) · Rechazar (onReject)
review          →  Firmar  (onSign)    · Rechazar (onReject)
approved        →  (sin acciones / no actions)
rejected        →  Reiniciar  (onRestart)
signed          →  (estado final / final state)
```

### Additional CSS / CSS adicional

```html
<script src="plugins/documentmanager/matios-ui-datatable-documentmanager-workflow.js"></script>
```

### Options / Opciones

| Option | Type | Default | Description / Descripción |
|--------|------|---------|---------------------------|
| `statusField` | `string` | `'workflowStatus'` | [EN] Item field name that holds the workflow state / [ES] Nombre del campo del ítem que contiene el estado de workflow |
| `showInToolbar` | `boolean` | `false` | [EN] Inject workflow buttons into the toolbar / [ES] Inyectar botones de workflow en el toolbar |
| `onStart` | `function` | `null` | `(items) => {}` — `null → draft` |
| `onSendForApproval` | `function` | `null` | `(items) => {}` — `draft → pending` |
| `onApprove` | `function` | `null` | `(items) => {}` — `pending → approved` |
| `onSign` | `function` | `null` | `(items) => {}` — `review → signed` |
| `onReject` | `function` | `null` | `(items) => {}` — `pending\|review → rejected` |
| `onRestart` | `function` | `null` | `(items) => {}` — `rejected → draft` |

### Toolbar unanimity rule / Regla de unanimidad en toolbar

[EN] When `showInToolbar: true`, a toolbar button is enabled only when **all** selected items share the same workflow state that activates that action. Mixed selections disable all workflow buttons.
[ES] Con `showInToolbar: true`, un botón del toolbar se habilita solo cuando **todos** los ítems seleccionados comparten el mismo estado de workflow que activa esa acción. Selecciones mixtas deshabilitan todos los botones de workflow.

### Autonomous toolbar / Toolbar autónomo

[EN] If `MTS.DataTableToolbarPlugin` is **not** present, the workflow plugin renders its own toolbar bar automatically via `table.setToolbarLeft()`. No additional configuration is needed.
[ES] Si `MTS.DataTableToolbarPlugin` **no** está presente, el plugin de workflow renderiza su propia barra de botones automáticamente usando `table.setToolbarLeft()`. No se requiere configuración adicional.

### Usage / Uso

```js
const dmWorkflow = new MTS.DocumentManagerWorkflowPlugin({
  statusField:   'workflowStatus',
  showInToolbar: true,

  onStart:           (items) => api.post('/workflow/start',    { ids: ids(items) }),
  onSendForApproval: (items) => api.post('/workflow/submit',   { ids: ids(items) }),
  onApprove:         (items) => api.post('/workflow/approve',  { ids: ids(items) }),
  onSign:            (items) => api.post('/workflow/sign',     { ids: ids(items) }),
  onReject:          (items) => api.post('/workflow/reject',   { ids: ids(items) }),
  onRestart:         (items) => api.post('/workflow/restart',  { ids: ids(items) }),
});

// Install as context menu extension / Instalar como extensión del menú contextual
const dmCtx = new MTS.DocumentManagerContextMenuPlugin({
  // ...
  plugins: [dmWorkflow],
});
```

---

## Full example / Ejemplo completo

```js
// 1. Upload sub-plugin / Sub-plugin de upload
const dmUpload = new MTS.DocumentManagerUploadPlugin({
  uploadProgress: 'bar',
  uploadCheck: {
    onCheckFileExists: (file, folder) => {
      const items = dmUpload._dm?.getItems() ?? [];
      const found = items.find(i => i.type === 'file' && i.name === file.name);
      return found ? { version: found.version ?? 'v1' } : false;
    },
  },
});

// 2. Workflow sub-plugin / Sub-plugin de workflow
const dmWorkflow = new MTS.DocumentManagerWorkflowPlugin({
  statusField:       'workflowStatus',
  showInToolbar:     true,
  onStart:           (items) => console.log('start',  items),
  onSendForApproval: (items) => console.log('submit', items),
  onApprove:         (items) => console.log('approve', items),
  onSign:            (items) => console.log('sign',   items),
  onReject:          (items) => console.log('reject', items),
  onRestart:         (items) => console.log('restart', items),
});

// 3. Context menu sub-plugin / Sub-plugin de menú contextual
const dmCtx = new MTS.DocumentManagerContextMenuPlugin({
  onView:     (item)  => openPreview(item),
  onDownload: (items) => downloadFiles(items),
  onRename:   (item)  => showRenameDialog(item),
  onMove:     (items) => showMoveDialog(items),
  onDelete:   (items) => confirmAndDelete(items),
  plugins:    [dmWorkflow],
});

// 4. Main plugin / Plugin principal
const dm = new MTS.DocumentManagerPlugin({
  rootLabel:     'Documentos',
  breadcrumb:    true,
  dragDrop:      true,
  dropzone:      true,
  accept:        '.pdf,.docx,.xlsx,.pptx,image/*',
  multiple:      true,
  maxFiles:      10,
  maxFileSizeMB: 25,
  onFileExists:  'ask',
  onFileDrop:    (files, folder) => dmUpload.open(files, folder),
  onUpload: async (file, folder, { action, currentVersion } = {}) => {
    const fd = new FormData();
    fd.append('file',           file);
    fd.append('folderId',       folder?.id ?? '');
    fd.append('action',         action         ?? '');
    fd.append('currentVersion', currentVersion ?? '');
    await http.post('/api/documents/upload', fd);
  },
  onUploaded:  () => table.reload(),
  onFileClick: (item) => openPreview(item),
  onDrop:      (items, folder) => moveItems(items, folder),
  plugins:     [dmUpload, dmCtx],
});

// 5. Optional toolbar / Toolbar opcional
const toolbar = new MTS.DataTableToolbarPlugin({
  buttons: [
    { label: 'Subir',  icon: 'upload', action: () => dmUpload.open() },
    { separator: true },
    { label: 'Eliminar', icon: 'trash', danger: true,
      condition: (t) => t.getSelection().length > 0,
      action: (t) => confirmAndDelete(t.getSelection()) },
  ],
});

// 6. DataTable / DataTable
const table = new MTS.DataTable({
  elementId: 'my-dm',
  columns: [
    { field: 'name',           label: 'Nombre',    sortable: true, alwaysVisible: true,
      render: (v, row) => MTS.DocumentManagerPlugin.renderName(v, row) },
    { field: 'size',           label: 'Tamaño',    align: 'end', width: '100px',
      render: MTS.DocumentManagerPlugin.renderSize },
    { field: 'modified',       label: 'Modificado', sortable: true },
    { field: 'status',         label: 'Estado',
      render: MTS.DocumentManagerPlugin.renderStatus },
    { field: 'workflowStatus', label: 'Workflow',
      render: MTS.DocumentManagerPlugin.renderWorkflowStatus },
  ],
  dataSource: async (query) => {
    const res = await http.get('/api/documents', { params: query });
    if (!res.success) throw new Error(res.message);
    return res.data;
  },
  rowId:        'id',
  pageSize:     10,
  hover:        true,
  fixedHeader:  true,
  fixedHeaderHeight: '480px',
  selection:    { mode: 'single' },
  actionColumn: true,
  plugins:      [toolbar, dm],
  onSelectionChange: () => toolbar.update(),
});
```

---

## Locale / Localización

[EN] Pass `locale: 'es'` (or `'en'`) to `MTS.DataTable` to use built-in translations for all UI labels. Custom labels can be overridden via `locale` config object:
[ES] Pasa `locale: 'es'` (o `'en'`) a `MTS.DataTable` para usar las traducciones integradas en todos los labels. Los labels custom se pueden sobreescribir mediante el objeto `locale`:

```js
new MTS.DataTable({
  locale: {
    dm: {
      upload: {
        title:          'Subir archivos',
        dropHint:       'Arrastra archivos aquí o',
        selectBtn:      'Seleccionar archivos',
        uploadBtn:      'Subir',
        cancelBtn:      'Cancelar',
        actionReplace:  'Reemplazar',
        actionVersion:  'Nueva versión',
        actionSkip:     'Omitir',
        fileTypeNotAllowed: 'Tipo de archivo no permitido',
      },
      workflow: {
        start:           'Iniciar workflow',
        sendForApproval: 'Enviar a aprobación',
        approve:         'Aprobar',
        sign:            'Firmar',
        reject:          'Rechazar',
        restart:         'Reiniciar workflow',
      },
    },
  },
});
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 3.5.0 | [EN] File constraints (`accept`, `multiple`, `maxFiles`, `maxFileSizeMB`, `onFileExists`) moved to `DocumentManagerPlugin` / [ES] Restricciones de archivo movidas a `DocumentManagerPlugin` |
| 3.4.0 | [EN] Added `getItems()`, `_matchesAccept()`, extended extension icon map / [ES] Agregado `getItems()`, `_matchesAccept()`, mapa de íconos de extensión extendido |
| 3.0.0 | [EN] Initial public release with breadcrumb, dragDrop, dropzone, renderName, renderSize / [ES] Versión pública inicial con breadcrumb, dragDrop, dropzone, renderName, renderSize |

---

## MTS.DocumentManagerUploadPlugin Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Reads file constraints from `dm._options`; added conflict resolution UI with version badge and per-file action buttons; `onUpload` receives `{ action, currentVersion }`; dropzone disabled during active upload / [ES] Lee restricciones desde `dm._options`; UI de resolución de conflictos con badge de versión y botones por archivo; `onUpload` recibe `{ action, currentVersion }`; dropzone deshabilitado durante la subida |
| 1.0.0 | [EN] Initial release — drag-drop modal, file list, spinner/bar progress / [ES] Versión inicial — modal drag-drop, lista de archivos, progreso spinner/bar |

---

## MTS.DocumentManagerWorkflowPlugin Changelog

| Version | Description |
|---------|-------------|
| 2.3.0 | [EN] Autonomous toolbar: renders own toolbar bar when `DataTableToolbarPlugin` is absent / [ES] Toolbar autónomo: renderiza su propia barra cuando `DataTableToolbarPlugin` no está presente |
| 2.2.0 | [EN] `showInToolbar` option — injects workflow buttons into `DataTableToolbarPlugin` / [ES] Opción `showInToolbar` — inyecta botones de workflow en `DataTableToolbarPlugin` |
| 2.0.0 | [EN] Initial release — context menu actions per workflow state / [ES] Versión inicial — acciones de menú contextual según estado de workflow |
