# MTS.FileUpload

🇬🇧 File upload zone with drag & drop, image preview, file type and size validation. Zero dependencies.
🇪🇸 Zona de carga de archivos con drag & drop, preview de imágenes, validación de tipo y tamaño. 0 dependencias.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-fileupload.css">
<script src="matios-ui-fileupload.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `accept` | `string` | `'*'` | 🇬🇧 Accepted file types (e.g. `'image/*'`, `'.pdf,.doc'`) / 🇪🇸 Tipos aceptados |
| `multiple` | `boolean` | `false` | 🇬🇧 Allow multiple files / 🇪🇸 Permitir múltiples archivos |
| `maxSize` | `number` | `null` | 🇬🇧 Max file size in MB / 🇪🇸 Tamaño máximo en MB |
| `maxFiles` | `number` | `null` | 🇬🇧 Max number of files / 🇪🇸 Número máximo de archivos |
| `label` | `string` | `'Arrastra archivos aquí o selecciona'` | 🇬🇧 Drop zone label / 🇪🇸 Label de la zona |
| `hint` | `string` | `''` | 🇬🇧 Helper text / 🇪🇸 Texto de ayuda |
| `preview` | `boolean` | `true` | 🇬🇧 Show image thumbnails / 🇪🇸 Mostrar miniaturas de imágenes |
| `disabled` | `boolean` | `false` | 🇬🇧 Disables the zone / 🇪🇸 Deshabilita la zona |
| `onChange` | `function` | — | 🇬🇧 `(files: File[]) => {}` Fires on add or remove / 🇪🇸 Se dispara al agregar o eliminar |
| `onAdd` | `function` | — | 🇬🇧 `(file: File) => {}` Fires when a file is added / 🇪🇸 Se dispara al agregar un archivo |
| `onRemove` | `function` | — | 🇬🇧 `(file: File) => {}` Fires when a file is removed / 🇪🇸 Se dispara al eliminar |
| `onError` | `function` | — | 🇬🇧 `(errors: string[]) => {}` Fires on validation failure / 🇪🇸 Se dispara al fallar validación |

---

## Events / Eventos

🇬🇧 Use `onChange`, `onAdd`, `onRemove` and `onError` in the constructor. This is the recommended approach.
🇪🇸 Usa `onChange`, `onAdd`, `onRemove` y `onError` en el constructor. Este es el enfoque recomendado.

```js
new MTS.FileUpload('#my-zone', {
  // Fires when file list changes / Se dispara al cambiar la lista de archivos
  onChange: (files) => {
    console.log('files:', files.length);
  },

  // Fires when a file is added / Se dispara al agregar un archivo
  onAdd: (file) => {
    console.log('added:', file.name);
  },

  // Fires when a file is removed / Se dispara al eliminar un archivo
  onRemove: (file) => {
    console.log('removed:', file.name);
  },

  // Fires on validation errors / Se dispara en errores de validación
  onError: (errors) => {
    console.error('errors:', errors);
  },
});
```

---

## HTML Usage / Uso HTML

```html
<!-- Image upload with preview / Carga de imágenes con preview -->
<div id="upload-photos"></div>

<script>
  new MTS.FileUpload('#upload-photos', {
    accept:   'image/*',
    multiple: true,
    maxSize:  2,
    maxFiles: 5,
    hint:     'PNG, JPG up to 2MB · Max 5 files',
    onChange: (files) => console.log(files.length),
  });
</script>

<!-- Single document / Documento único -->
<div id="upload-cv"></div>

<script>
  new MTS.FileUpload('#upload-cv', {
    accept:   '.pdf',
    multiple: false,
    maxSize:  5,
    label:    'Upload your CV in PDF',
    hint:     'PDF up to 5MB',
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
// Images with preview / Imágenes con preview
new MTS.FileUpload('#upload-photos', {
  accept:   'image/*',
  multiple: true,
  maxSize:  2,       // MB
  maxFiles: 5,
  preview:  true,
  hint:     'PNG, JPG up to 2MB',
  onChange: (files) => console.log('total:', files.length),
  onAdd:    (file)  => console.log('added:', file.name),
  onRemove: (file)  => console.log('removed:', file.name),
  onError:  (errs)  => console.error(errs),
});

// Documents without preview / Documentos sin preview
new MTS.FileUpload('#upload-docs', {
  accept:   '.pdf,.doc,.docx,.xls,.xlsx',
  multiple: true,
  maxSize:  10,
  preview:  false,
  hint:     'PDF, Word or Excel up to 10MB',
});
```

---

## API

```js
const fu = new MTS.FileUpload('#my-zone', { ... });

// Returns current file list / Retorna la lista de archivos actual
fu.getFiles()     // → File[]

// Clear all files / Limpiar todos los archivos
fu.clear()

// Open the file selector programmatically / Abrir el selector programáticamente
fu.open()
```

---

## DOM Events / Eventos DOM

```js
document.getElementById('my-zone')
  .addEventListener('mts:fileupload:change', (e) => {
    console.log(e.detail.files); // → File[]
  });

document.getElementById('my-zone')
  .addEventListener('mts:fileupload:error', (e) => {
    console.log(e.detail.message);
  });
```

| Event / Evento | DOM Namespace |
|----------------|---------------|
| `onChange` | `mts:fileupload:change` |
| `onError` | `mts:fileupload:error` |

---
