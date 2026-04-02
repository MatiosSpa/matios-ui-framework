# matios-ui-fileupload

Zona de carga de archivos con drag & drop, preview de imágenes y validación.

---

## Instalación

```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-fileupload.css">
<script src="matios-ui-fileupload.js"></script>
```

---

## Uso básico

```js
const fu = new MTS.FileUpload('#zona', {
  accept:   'image/*,.pdf',
  multiple: true,
  maxSize:  5,        // MB
  maxFiles: 10,
  hint:     'PNG, JPG, PDF hasta 5MB',
  onChange: (files) => console.log(files),
  onError:  (err)   => console.error(err),
})
```

---

## Opciones

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `accept` | `string` | `'*'` | Tipos de archivo aceptados (`'image/*'`, `'.pdf,.doc'`) |
| `multiple` | `boolean` | `false` | Permite seleccionar múltiples archivos |
| `maxSize` | `number` | `null` | Tamaño máximo por archivo en MB |
| `maxFiles` | `number` | `null` | Número máximo de archivos |
| `label` | `string` | `'Arrastra archivos aquí o selecciona'` | Texto de la zona de drop |
| `hint` | `string` | `''` | Texto de ayuda bajo la zona |
| `preview` | `boolean` | `true` | Muestra miniaturas para imágenes |
| `disabled` | `boolean` | `false` | Desactiva la zona de carga |
| `onChange` | `function` | `null` | `(files: File[]) => {}` |
| `onError` | `function` | `null` | `(message: string) => {}` |

---

## API

```js
fu.getFiles()   // → File[] — archivos seleccionados
fu.clear()      // limpiar todos los archivos
fu.open()       // abrir el selector de archivos programáticamente
fu.on('change', (files) => {})
fu.on('error',  (msg)   => {})
```

---

## Eventos DOM

```js
el.addEventListener('mts:fileupload:change', (e) => {
  console.log(e.detail.files)
})
el.addEventListener('mts:fileupload:error', (e) => {
  console.log(e.detail.message)
})
```

---

## Ejemplos prácticos

```js
// Solo imágenes con preview
new MTS.FileUpload('#fotos', {
  accept:   'image/*',
  multiple: true,
  maxSize:  2,
  maxFiles: 5,
  preview:  true,
})

// Documentos sin preview
new MTS.FileUpload('#docs', {
  accept:   '.pdf,.doc,.docx,.xls,.xlsx',
  multiple: true,
  maxSize:  10,
  preview:  false,
  hint:     'PDF, Word o Excel hasta 10MB',
})

// Un solo archivo obligatorio
new MTS.FileUpload('#cv', {
  accept:   '.pdf',
  multiple: false,
  maxSize:  5,
  label:    'Sube tu CV en PDF',
})
```

---

## Callbacks

```js
new MTS.FileUpload('#zona', {
  onChange:  (files) => console.log('total:', files.length),
  onAdd:     (file)  => console.log('agregado:', file.name),
  onRemove:  (file)  => console.log('eliminado:', file.name),
  onError:   (errs)  => console.error('errores:', errs),
})
```

| Callback | Descripción |
|----------|-------------|
| `onChange(files)` | Se dispara al agregar o eliminar |
| `onAdd(file)` | Se dispara al agregar un archivo |
| `onRemove(file)` | Se dispara al eliminar un archivo |
| `onError(errors)` | Validaciones fallidas |

