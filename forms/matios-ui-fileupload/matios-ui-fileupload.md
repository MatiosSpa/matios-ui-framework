# MTS.FileUpload

File upload zone with drag & drop, image preview, and file type/size validation. Zero dependencies.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-fileupload.css">
<script src="matios-ui-fileupload.js"></script>
```

---

## Usage

```js
// Images with preview
new MTS.FileUpload('#upload-photos', {
  accept:   'image/*',
  multiple: true,
  maxSize:  2,  // MB
  maxFiles: 5,
  preview:  true,
  hint:     'PNG, JPG up to 2MB · Max 5 files',
  onChange: function (files) { console.log('total:', files.length); },
  onAdd:    function (file)  { console.log('added:', file.name); },
  onRemove: function (file)  { console.log('removed:', file.name); },
  onError:  function (errs)  { console.error(errs); },
});

// Documents without preview
new MTS.FileUpload('#upload-docs', {
  accept:   '.pdf,.doc,.docx,.xls,.xlsx',
  multiple: true,
  maxSize:  10,
  preview:  false,
  hint:     'PDF, Word or Excel up to 10MB',
});
```

The container only needs to exist in the DOM (`<div id="upload-photos"></div>`).

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `accept` | `string` | `'*'` | Accepted file types (e.g. `'image/*'`, `'.pdf,.doc'`) |
| `multiple` | `boolean` | `false` | Allow multiple files |
| `maxSize` | `number` | `null` | Max file size in MB |
| `maxFiles` | `number` | `null` | Max number of files |
| `label` | `string` | localized | Drop-zone label |
| `hint` | `string` | `''` | Helper text |
| `preview` | `boolean` | `true` | Show image thumbnails |
| `disabled` | `boolean` | `false` | Disables the zone |
| `onChange` | `function` | — | `(files: File[])` — fires on add or remove |
| `onAdd` | `function` | — | `(file: File)` — fires when a file is added |
| `onRemove` | `function` | — | `(file: File)` — fires when a file is removed |
| `onError` | `function` | — | `(errors: string[])` — fires on validation failure |

---

## API

| Method | Description |
|--------|-------------|
| `getFiles()` | Returns the current `File[]` |
| `clear()` | Clear all files |
| `open()` | Open the native file selector programmatically |

```js
const fu = new MTS.FileUpload('#my-zone', { accept: 'image/*', multiple: true });
console.log(fu.getFiles());
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` | `mts:fileupload:change` | `{ files }` |
| `onError` | `mts:fileupload:error` | `{ message }` |
| `onAdd` / `onRemove` | — | `(file)` |

```js
document.getElementById('my-zone')
  .addEventListener('mts:fileupload:change', function (e) { console.log(e.detail.files); });
```

---

## Accessibility

- The drop zone is also clickable/keyboard-activatable to open the native picker — drag & drop is an enhancement,
  not the only path.
- Validation errors are surfaced via `onError` and near the zone; keep `hint` describing the accepted types/size.

---

## Changelog

### Initial
- File upload zone with drag & drop, image thumbnails, `accept` / `maxSize` / `maxFiles` validation, single or
  multiple files, and `getFiles` / `clear` / `open` plus add/remove/change/error callbacks.
