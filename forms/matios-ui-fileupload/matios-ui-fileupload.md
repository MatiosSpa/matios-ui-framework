# MTS.FileUpload

File upload zone with drag & drop, image preview, and file type/size validation. Zero dependencies.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-fileupload.css">

<!-- Optional: i18n for localized chrome (label, validation errors, remove aria-label) -->
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-fileupload-i18n.js"></script>

<script src="matios-ui-fileupload.js"></script>
```

Without the i18n files the component still works, falling back to its built-in Spanish strings.

---

## Usage

```js
// Images with preview
new MTS.FileUpload('#upload-photos', {
  accept: 'image/*',
  multiple: true,
  maxSize: 2,
  maxFiles: 5,
  preview: true,
  hint: 'PNG, JPG up to 2MB · Max 5 files',
  onChange: function (e) { console.log('total:', e.detail.files.length); },
  onAdd: function (e) { console.log('added:', e.detail.name); },
  onRemove: function (e) { console.log('removed:', e.detail.name); },
  onError: function (e) { console.error(e.detail.message); }
});

// Documents without preview
new MTS.FileUpload('#upload-docs', {
  accept: '.pdf,.doc,.docx,.xls,.xlsx',
  multiple: true,
  maxSize: 10,
  preview: false,
  hint: 'PDF, Word or Excel up to 10MB'
});
```

The container only needs to exist in the DOM (`<div id="upload-photos"></div>`).

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `accept` | `string` | `'*'` | Accepted file types (e.g. `'image/*'`, `'.pdf,.doc'`) |
| `multiple` | `boolean` | `false` | Allow multiple files. When `false`, a new selection replaces the current file |
| `maxSize` | `number` | `null` | Max file size in MB |
| `maxFiles` | `number` | `null` | Max number of files |
| `label` | `string` | localized | Drop-zone label (HTML; sanitized with `MTS.Sanitize` when available) |
| `hint` | `string` | `''` | Helper text below the zone |
| `preview` | `boolean` | `true` | Show image thumbnails |
| `disabled` | `boolean` | `false` | Disables the zone (no click/drag binding) |
| `onChange` | `function` | — | Shortcut for `.on('change', fn)` |
| `onAdd` | `function` | — | Shortcut for `.on('add', fn)` |
| `onRemove` | `function` | — | Shortcut for `.on('remove', fn)` |
| `onError` | `function` | — | Shortcut for `.on('error', fn)` |

---

## API

| Method | Description |
|--------|-------------|
| `getFiles()` | Returns a copy of the current `File[]` |
| `clear()` | Clears all files |
| `open()` | Opens the native file selector programmatically |
| `on(event, fn)` | Registers an event listener; returns `this` |

```js
const fu = new MTS.FileUpload('#my-zone', { accept: 'image/*', multiple: true });
console.log(fu.getFiles());
```

---

## Events

Listeners registered via `on(event, fn)` (or the `onX` option shortcuts) receive a single
`{ type, detail }` object. The same events also dispatch a bubbling `CustomEvent` on the
container element, whose `detail` matches the table below.

| Event | DOM event | `detail` |
|-------|-----------|----------|
| `change` | `mts:fileupload:change` | `{ files }` — current `File[]` |
| `add` | `mts:fileupload:add` | the added `File` |
| `remove` | `mts:fileupload:remove` | the removed `File` |
| `error` | `mts:fileupload:error` | `{ message }` — one string per validation failure |

`change` fires on add and on remove. `add` fires once per file passed to the selection (before
duplicate/limit filtering). `error` fires once per validation failure, and the first message is
also shown transiently near the zone.

```js
document.getElementById('my-zone')
  .addEventListener('mts:fileupload:change', function (e) { console.log(e.detail.files); });
```

---

## i18n

Localized chrome is read from `MTS.getString()['MTS.FileUpload']` via the global language API.
Set the language once at startup with `MTS.setLanguage('es' | 'en' | 'pt')`; there is no
per-instance `locale` option. Explicit `label` / `hint` options always win over the localized
defaults.

| Key | Purpose | Placeholders |
|-----|---------|--------------|
| `label` | Default drop-zone label | — |
| `removeLabel` | Remove-button `aria-label` | — |
| `errorTooLarge` | File exceeds `maxSize` | `{name}`, `{size}` |
| `errorType` | File type not in `accept` | `{name}` |
| `errorMaxFiles` | More files than `maxFiles` | `{n}` |

Bundled locales: `es` (default), `en`, `pt`.

---

## Accessibility

- The drop zone is also clickable to open the native picker — drag & drop is an enhancement,
  not the only path.
- Validation errors are surfaced via the `error` event and shown transiently near the zone;
  keep `hint` describing the accepted types/size.
- The remove button exposes a localized `aria-label` (`removeLabel`).
