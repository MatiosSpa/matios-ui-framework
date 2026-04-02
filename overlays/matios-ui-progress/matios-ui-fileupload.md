# matios-ui-fileupload

Dropzone con drag & drop, validación y progreso real de subida via XHR para Matios UI.

---

## Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-progress.css">
<link rel="stylesheet" href="matios-ui-fileupload.css">
<script src="matios-ui-progress.js"></script>
<script src="matios-ui-fileupload.js"></script>
```

> `matios-ui-progress` es opcional pero recomendado — si está cargado, `MTS.FileUpload` lo usa automáticamente para mostrar el progreso.

---

## Por qué XHR y no fetch

```
fetch  → 0% ············ 100%  (sin progreso intermedio)
XHR    → 0% → 23% → 67% → 100% (progreso real byte a byte)
```

`fetch` no expone progreso de subida. `MTS.FileUpload` usa `XMLHttpRequest` internamente para reportar el progreso real.

---

## Uso rápido

```js
const uploader = new MTS.FileUpload('#dropzone', {
  url:     '/api/v1/documents/upload',
  headers: { Authorization: 'Bearer TOKEN' },
  accept:  '.pdf,.docx,.xlsx',
  maxSize: 10 * 1024 * 1024, // 10 MB
})
```

```html
<div id="dropzone"></div>
```

---

## Configuración completa

```js
new MTS.FileUpload('#dropzone', {

  // — Upload —
  url:       '/api/upload',
  method:    'POST',
  headers:   { Authorization: 'Bearer TOKEN' },
  fieldName: 'files',           // nombre del campo en el FormData
  extraData: { folderId: 5 },   // datos adicionales al form

  // — Restricciones —
  maxSize:   10 * 1024 * 1024,  // 10 MB por archivo
  maxFiles:  5,                 // máximo 5 archivos a la vez
  accept:    '.pdf,.docx,image/*',
  multiple:  true,              // permite múltiples archivos

  // — Comportamiento —
  autoUpload:      true,    // sube automáticamente al seleccionar
  showProgress:    true,    // muestra barra de progreso interna
  timeout:         30000,   // 30 segundos de timeout
  withCredentials: false,

  // — Textos i18n —
  texts: {
    drop:        'Arrastra tus archivos aquí',
    or:          'o',
    browse:      'Selecciona archivos',
    uploading:   'Subiendo...',
    complete:    'Subido correctamente',
    error:       'Error al subir',
    maxSize:     'Archivo demasiado grande',
    maxFiles:    'Máximo de archivos alcanzado',
    invalidType: 'Tipo de archivo no permitido',
  },

  // — Validación custom —
  onValidate: (file) => {
    if (file.name.includes('..')) return 'Nombre de archivo inválido'
    return true  // retorna true si es válido, string de error si no
  },

  // — Callbacks —
  onDrop:     (e) => console.log('Archivos:', e.detail.files),
  onProgress: (e) => console.log(`${e.detail.pct}% — ${e.detail.loaded}/${e.detail.total}`),
  onComplete: (e) => MTS.Toast.success(`${e.detail.file.name} subido`),
  onError:    (e) => MTS.Toast.error(e.detail.error),
  onRemove:   (e) => console.log('Removido:', e.detail.file.name),
})
```

---

## API pública

```js
const uploader = new MTS.FileUpload('#dropzone', config)

// Subida
uploader.upload()              // inicia subida de archivos pendientes
uploader.addFiles(fileList)    // agrega archivos programáticamente

// Archivos
uploader.getFiles()            // → array de FileItem
uploader.clear()               // limpia todos los archivos

// Destruir
uploader.destroy()
```

### Estructura de FileItem

```js
{
  id:       'fu-1234-abc',     // ID único interno
  file:     File,              // objeto File nativo
  status:   'pending',         // 'pending'|'uploading'|'complete'|'error'
  progress: 0,                 // 0-100
  error:    null,              // mensaje de error si falló
  response: null,              // respuesta del servidor
}
```

---

## Eventos

### API `.on()`

```js
uploader.on('drop',     (e) => console.log('Archivos soltados:', e.detail.files))
uploader.on('progress', (e) => console.log(`${e.detail.pct}%`))
uploader.on('complete', (e) => console.log('Respuesta:', e.detail.response))
uploader.on('error',    (e) => console.log('Error:', e.detail.error))
uploader.on('remove',   (e) => console.log('Removido:', e.detail.file.name))
```

### CustomEvent DOM — `mts:fileupload:[evento]`

```js
document.getElementById('dropzone')
  .addEventListener('mts:fileupload:complete', (e) => {
    console.log('Subido:', e.detail.file.name)
    console.log('Respuesta:', e.detail.response)
  })
```

### Tabla de eventos

| Evento | Cuándo | Namespace DOM |
|--------|--------|---------------|
| `drop` | Al soltar/seleccionar archivos | `mts:fileupload:drop` |
| `progress` | Durante la subida (múltiples veces) | `mts:fileupload:progress` |
| `complete` | Al completar la subida de un archivo | `mts:fileupload:complete` |
| `error` | Al fallar la subida o validación | `mts:fileupload:error` |
| `remove` | Al remover un archivo de la lista | `mts:fileupload:remove` |

---

## Ejemplos

### Con progress bar externo

```js
const bar = new MTS.Progress('#mi-progress', {
  variant:   'default',
  size:      'md',
  showLabel: true,
})

const uploader = new MTS.FileUpload('#dropzone', {
  url:          '/api/upload',
  showProgress: false,        // deshabilita el progress interno
  onProgress:   (e) => bar.setValue(e.detail.pct),
  onComplete:   (e) => {
    bar.setVariant('success')
    setTimeout(() => bar.reset(), 2000)
    MTS.Toast.success('Archivos subidos correctamente')
  },
  onError: (e) => {
    bar.setVariant('danger')
    MTS.Toast.error(e.detail.error)
  },
})
```

### Upload manual (sin autoUpload)

```js
const uploader = new MTS.FileUpload('#dropzone', {
  url:        '/api/upload',
  autoUpload: false,          // no sube automáticamente
})

// Botón confirmar
document.getElementById('btn-upload').addEventListener('click', () => {
  const files = uploader.getFiles()
  if (!files.length) {
    MTS.Toast.warning('Selecciona al menos un archivo')
    return
  }
  uploader.upload()
})
```

### Toast de carga → éxito

```js
new MTS.FileUpload('#dropzone', {
  url: '/api/upload',
  onDrop: () => {
    MTS._uploadToast = MTS.Toast.loading('Subiendo archivos...')
  },
  onComplete: () => {
    MTS._uploadToast?.hide()
    MTS.Toast.success('Subido correctamente')
  },
  onError: (e) => {
    MTS._uploadToast?.hide()
    MTS.Toast.error(e.detail.error)
  },
})
```

### Migración desde el dropzone Bootstrap actual

```js
// Antes — documentUploadUI.js con Bootstrap + fetch (sin progreso real)
this.uploadModal = new bootstrap.Modal(document.getElementById('uploadDocumentModal'))

// Después — MTS.FileUpload con XHR y progreso real
const uploader = new MTS.FileUpload('#dropzoneWrapper', {
  url:       configManager.getApiUrl() + '/upload',
  headers:   secureStorage.getHeaders(),
  fieldName: 'files',
  extraData: {
    WorkspaceId:    3,
    DocumentTypeId: 4,
    ParentId:       configManager.getBaseFolderId(),
  },
  multiple: true,
  onComplete: (e) => {
    documentUIManager.documentGrid.refresh()
    MTS.Toast.success(`${e.detail.file.name} subido correctamente`)
  },
  onError: (e) => MTS.Toast.error(e.detail.error),
})
```

---

## Changelog

| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — Dropzone drag & drop, XHR con progreso real, validación, integración con MTS.Progress y MTS.Toast |

---

**Siguiente:** [`matios-ui-input.md`](./matios-ui-input.md) — Inputs, textareas y grupos de formulario.
