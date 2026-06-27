# MTS.DocumentManagerPlugin

Transforms a DataTable into a full document manager with folder navigation, breadcrumb, drag-and-drop, dropzone and file upload — all extendable via sub-plugins.

---

## Installation

```html
<!-- DataTable core (required) -->
<link rel="stylesheet" href="matios-ui-datatable.css">
<script src="matios-ui-datatable.js"></script>
<script src="matios-ui-datatable-i18n.js"></script>

<!-- Shared menu (required by DM plugins) -->
<link rel="stylesheet" href="plugins/shared/matios-ui-datatable-menu.css">
<script src="plugins/shared/matios-ui-datatable-menu.js"></script>

<!-- DocumentManager -->
<link rel="stylesheet" href="plugins/documentmanager/matios-ui-datatable-documentmanager.css">
<script src="plugins/documentmanager/matios-ui-datatable-documentmanager.js"></script>
```

---

## Architecture

The DocumentManager is a **plugin stack**. Each layer adds capabilities and is completely optional:

```
MTS.DataTable
 └── MTS.DocumentManagerPlugin                 ← folder nav, breadcrumb, drag-drop, dropzone
      ├── MTS.DocumentManagerUploadPlugin      ← upload modal with file list and progress
      ├── MTS.DocumentManagerPreviewPlugin     ← fullscreen preview modal with side panel
      └── MTS.DocumentManagerContextMenuPlugin ← right-click / actions column
           └── MTS.DocumentManagerWorkflowPlugin ← approval lifecycle actions
```

Sub-plugins are passed via `plugins: [...]` in each parent's options.

---

## MTS.DocumentManagerPlugin

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rootLabel` | `string` | `'Root'` | Label for the root folder in the breadcrumb |
| `breadcrumb` | `boolean` | `false` | Show the folder navigation breadcrumb |
| `showFileExtensionColor` | `boolean` | `false` | Color the file icon by type (PDF red, Word blue, Excel green, …). Off by default → icons follow the theme |
| `dragDrop` | `boolean` | `false` | Enable drag-and-drop to move items between folders |
| `dropzone` | `boolean` | `false` | Enable OS file drop over the table to trigger upload |
| `accept` | `string` | `'*'` | Accepted file types — extensions (`.pdf`), MIME types (`image/*`), comma-separated |
| `multiple` | `boolean` | `true` | Allow uploading more than one file at a time |
| `maxFiles` | `number \| null` | `null` | Maximum number of files per upload batch |
| `maxFileSizeMB` | `number \| null` | `null` | Maximum file size in MB per file |
| `onFileExists` | `string` | `'ask'` | `'ask'` · `'replace'` · `'version'` · `'skip'` — policy when a same-name file exists |
| `onFileDrop` | `function` | `null` | `(files, folder)` — fires when files are dropped on the dropzone |
| `onUpload` | `async function` | `null` | `async (file, folder, { action, currentVersion })` — called once per file |
| `onUploaded` | `function` | `null` | `(files, folder)` — fires when the batch finishes |
| `onError` | `function` | `null` | `(err, file, folder)` — fires when an upload fails |
| `onFileClick` | `function` | `null` | `(item)` — fires when a file row is clicked |
| `onDrop` | `function` | `null` | `(items, folder)` — fires when items are dragged to a folder (move) |
| `plugins` | `array` | `[]` | Sub-plugins (Upload, Preview, ContextMenu) |

**`onFileExists` values:** `'ask'` (per-file buttons: Replace / New version / Skip), `'replace'`, `'version'`,
`'skip'` (auto).

**`onUpload` third argument** (when `onFileExists` is `'ask'`): `{ action: 'replace'|'version'|null, currentVersion: string|null }`
(`null` action = new file with no conflict).

### File-type icon colors (`showFileExtensionColor`)

When enabled, the plugin adds a `mts-dm--file-colors` class to the table root and wraps each file icon in
`mts-dm-ext--{family}` (the `family` is derived from the file extension). Well-known types get a recognizable,
theme-aware color; unknown types keep the theme/accent color. Each color is a CSS variable you can override:

| Family | Color | Token | Extensions |
|--------|-------|-------|------------|
| PDF | red | `--mts-dm-file-pdf` | pdf |
| Word | blue | `--mts-dm-file-word` | doc, docx, odt, rtf |
| Excel / CSV | green | `--mts-dm-file-excel` | xls, xlsx, ods, csv |
| PowerPoint | orange | `--mts-dm-file-ppt` | ppt, pptx, odp |
| Image | teal | `--mts-dm-file-image` | jpg, png, svg, gif, webp |
| Video | violet | `--mts-dm-file-video` | mp4, mov, mkv, avi |
| Audio | pink | `--mts-dm-file-audio` | mp3, wav, flac, m4a |
| Code | cyan | `--mts-dm-file-code` | js, ts, py, json, html, … |
| Archive | amber | `--mts-dm-file-zip` | zip, rar, 7z, gz, tar |
| Email | sky blue | `--mts-dm-file-mail` | msg, eml, pst |
| Access | maroon | `--mts-dm-file-access` | mdb, accdb |
| Other | theme color | — | txt, visio, project, onenote, … |

Dark mode uses slightly brighter variants; `high-contrast` collapses file icons to monochrome.
`MTS.DocumentManagerPlugin._extToType(ext)` returns `{ icon, family }` if you need the mapping directly.

### Static render helpers

Use in column `render` functions — they output ready-to-use HTML:

```js
render: function (v, row) { return MTS.DocumentManagerPlugin.renderName(v, row); } // icon + name (+ version badge)
render: MTS.DocumentManagerPlugin.renderSize           // human-readable size
render: MTS.DocumentManagerPlugin.renderStatus         // status badge
render: MTS.DocumentManagerPlugin.renderWorkflowStatus // workflow status badge
```

### `getItems()`

Returns the items currently visible in the table (current page data). Useful in `onCheckFileExists` to detect
duplicates without an HTTP call: `dm.getItems()` → `[{ id, name, type, size, modified, … }]`.

### Data contract

The `dataSource` must return items with the fields your columns and plugins need. Only `id`, `name` and `type` are
strictly required; all others are optional (missing ones show `—` in built-in panels).

| Field | Type | Used by | Notes |
|-------|------|---------|-------|
| `id` | `string \| number` | All | Unique identifier |
| `name` | `string` | DM, Preview | File or folder name |
| `type` | `'file' \| 'folder'` | DM, Preview | Drives icon, click behavior and actions |
| `ext` | `string` | DM, Preview | Extension without dot (`pdf`, `docx`) |
| `mimeType` | `string \| null` | Preview | MIME type — file icon and BasicInfoPanel |
| `version` | `string \| number \| null` | DM, Preview | Inline badge in the row and preview header |
| `sizeFormatted` | `string \| null` | BasicInfoPanel | Human-readable size — preferred over `size` |
| `size` | `number \| null` | BasicInfoPanel | Bytes — fallback when `sizeFormatted` is absent |
| `createdAt` / `modifiedAt` / `updatedAt` | `string \| null` | BasicInfoPanel | Dates (`modifiedAt` preferred over `updatedAt`) |
| `status` | `string \| null` | DM, BasicInfoPanel | Item status (`active`, `archived`, …) |
| `owner` / `author` | `string \| null` | BasicInfoPanel | Owner — `owner` preferred over `author` |
| `workflowStatus` | `string \| null` | WorkflowPlugin | Required only when using WorkflowPlugin |

### Usage

```js
const dm = new MTS.DocumentManagerPlugin({
  rootLabel:     'Documents',
  breadcrumb:    true,
  dragDrop:      true,
  dropzone:      true,
  accept:        '.pdf,.docx,.xlsx,image/*',
  multiple:      true,
  maxFiles:      10,
  maxFileSizeMB: 25,
  onFileExists:  'ask',
  onFileDrop:  function (files, folder) { dmUpload.open(files, folder); },
  onUpload: async function (file, folder, opts) {
    opts = opts || {};
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folderId', folder ? folder.id : '');
    fd.append('action', opts.action || '');
    fd.append('currentVersion', opts.currentVersion || '');
    const res = await http.post('/api/documents/upload', fd);
    if (!res.success) throw new Error(res.message);
  },
  onUploaded:  function () { table.reload(); },
  onFileClick: function (item) { openPreview(item); },
  onDrop:      function (items, folder) { moveItems(items, folder); },
  plugins: [dmUpload, dmContextMenu],
});

new MTS.DataTable({
  elementId: 'my-table',
  columns: [
    { field: 'name', label: 'Name', sortable: true, render: function (v, row) { return MTS.DocumentManagerPlugin.renderName(v, row); } },
    { field: 'sizeFormatted', label: 'Size', align: 'end', width: '100px' },
    { field: 'modifiedAt', label: 'Modified', sortable: true },
    { field: 'status', label: 'Status', render: MTS.DocumentManagerPlugin.renderStatus },
  ],
  dataSource: async function (query) { const res = await http.get('/api/documents', { params: query }); return res.data; },
  rowId: 'id', pageSize: 10, actionColumn: true, plugins: [dm],
});
```

---

## MTS.DocumentManagerUploadPlugin

Upload modal with a drag-drop area, file list, progress indicator and conflict resolution. Installed as a sub-plugin
of `DocumentManagerPlugin`.

```html
<link rel="stylesheet" href="plugins/documentmanager/matios-ui-datatable-documentmanager-upload.css">
<script src="plugins/documentmanager/matios-ui-datatable-documentmanager-upload.js"></script>
<link rel="stylesheet" href="overlays/matios-ui-modal/matios-ui-modal.css">
<script src="overlays/matios-ui-modal/matios-ui-modal.js"></script>
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `uploadProgress` | `string` | `'none'` | `'none'` · `'spinner'` · `'bar'` — per-file progress style |
| `uploadCheck` | `object \| null` | `null` | File-existence check hooks |
| `uploadCheck.onCheckFileExists` | `function` | — | `async (file, folder) → false \| true \| { version }` |

`open([files, folder])` opens the modal (empty or pre-loaded). The plugin reads `accept`, `multiple`, `maxFiles`,
`maxFileSizeMB` and `onFileExists` directly from the `DocumentManagerPlugin` — set them once there.

```js
const dmUpload = new MTS.DocumentManagerUploadPlugin({
  uploadProgress: 'bar',
  uploadCheck: {
    onCheckFileExists: function (file, folder) {
      const items = (dmUpload._dm && dmUpload._dm.getItems()) || [];
      const found = items.find(function (i) { return i.type === 'file' && i.name === file.name; });
      return found ? { version: found.version || 'v1' } : false; // { version } shows the badge in the conflict UI
    },
  },
});
```

---

## MTS.DocumentManagerContextMenuPlugin

Adds a context menu (right-click or "Actions" column button) with standard document operations, and injects the
actions column automatically. Omitting a handler removes that action from the menu.

```html
<script src="plugins/documentmanager/matios-ui-datatable-documentmanager-contextmenu.js"></script>
```

| Option | Type | Description |
|--------|------|-------------|
| `onView` | `function` | `(item)` — view file |
| `onDownload` | `function` | `(items)` — download one or more files |
| `onOpen` | `function` | `(item)` — open folder |
| `onRename` | `function` | `(item)` — rename item |
| `onMove` | `function` | `(items)` — move items |
| `onDelete` | `function` | `(items)` — delete items |
| `plugins` | `array` | Context-menu extensions — e.g. `DocumentManagerWorkflowPlugin` |

---

## MTS.DocumentManagerWorkflowPlugin

Extends the context menu with approval lifecycle actions based on the item's `workflowStatus`. Optionally renders
workflow buttons in the toolbar.

```
null/undefined → Start            (onStart)
draft          → Send for approval (onSendForApproval)
pending        → Approve (onApprove) · Reject (onReject)
review         → Sign    (onSign)    · Reject (onReject)
approved       → (no actions)
rejected       → Restart (onRestart)
signed         → (final state)
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `statusField` | `string` | `'workflowStatus'` | Item field holding the workflow state |
| `showInToolbar` | `boolean` | `false` | Inject workflow buttons into the toolbar |
| `onStart` / `onSendForApproval` / `onApprove` / `onSign` / `onReject` / `onRestart` | `function` | `null` | `(items)` lifecycle transitions |

**Toolbar unanimity rule:** with `showInToolbar: true`, a button is enabled only when **all** selected items share
the same state that activates it; mixed selections disable all workflow buttons. **Autonomous toolbar:** if
`MTS.DataTableToolbarPlugin` is not present, the workflow plugin renders its own bar via `table.setToolbarLeft()`.

```js
const dmWorkflow = new MTS.DocumentManagerWorkflowPlugin({
  statusField: 'workflowStatus',
  showInToolbar: true,
  onStart:           function (items) { api.post('/workflow/start',   { ids: ids(items) }); },
  onSendForApproval: function (items) { api.post('/workflow/submit',  { ids: ids(items) }); },
  onApprove:         function (items) { api.post('/workflow/approve', { ids: ids(items) }); },
  onSign:            function (items) { api.post('/workflow/sign',    { ids: ids(items) }); },
  onReject:          function (items) { api.post('/workflow/reject',  { ids: ids(items) }); },
  onRestart:         function (items) { api.post('/workflow/restart', { ids: ids(items) }); },
});

const dmCtx = new MTS.DocumentManagerContextMenuPlugin({ /* … */ plugins: [dmWorkflow] });
```

---

## MTS.DocumentManagerPreviewPlugin

Opens a fullscreen modal with an iframe to preview the document. The modal has a collapsible side panel with an
accordion of sub-panels (metadata, workflow, custom). Header buttons: ← prev, → next, version badge, Replace,
Download. The plugin does **not** intercept `onFileClick` automatically — the dev wires it.

```html
<link rel="stylesheet" href="plugins/documentmanager/matios-ui-datatable-documentmanager-preview.css">
<script src="plugins/documentmanager/matios-ui-datatable-documentmanager-preview.js"></script>
<link rel="stylesheet" href="overlays/matios-ui-modal/matios-ui-modal.css">
<script src="overlays/matios-ui-modal/matios-ui-modal.js"></script>
<link rel="stylesheet" href="navigation/matios-ui-accordion/matios-ui-accordion.css">
<script src="navigation/matios-ui-accordion/matios-ui-accordion.js"></script>
<script src="overlays/matios-ui-badge/matios-ui-badge.js"></script>
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `panels` | `array` | `[]` | Sub-panels for the side accordion |
| `urlResolver` | `function` | `null` | `(item) → string \| null` — iframe URL for the item |
| `onDownload` | `function` | `null` | `(item)` — "Download" header button |
| `onReplace` | `function` | `null` | `(item, file, version) → Promise` — "Replace" → picker → confirm overlay (return a Promise to drive the progress bar) |
| `onPrev` / `onNext` | `function` | `null` | `(currentItem)` — ← / → header buttons |
| `panelVisible` | `boolean` | `true` | Side panel visible on open |
| `panelWidth` | `string` | `'340px'` | Width of the open side panel |

`show(item[, url])` opens the preview (with the `urlResolver` URL or an explicit one). **Replace flow:** clicking
"Replace" opens a file picker → a confirm overlay shows file info, a version input (suggested `parseInt(currentVersion)+1`)
and an extension-mismatch warning; "Upload" calls `onReplace(item, file, version)` and, if it returns a Promise, shows
an indeterminate progress bar then success/error.

**Sub-panel interface:**

```js
{
  key: string, label: string, icon: string | null,
  install(preview), uninstall(),
  render(item) → Element,                      // synchronous skeleton
  load(item) → Element | Promise<Element>,     // async real content
}
```

```js
const dmPreview = new MTS.DocumentManagerPreviewPlugin({
  panels: [new MTS.DocumentManagerPreviewBasicInfoPanel()],
  urlResolver: function (item) { return '/api/documents/' + item.id + '/retrieve'; },
  onDownload:  function (item) { window.open('/api/documents/' + item.id + '/download'); },
  onReplace:   function (item, file, version) {
    return http.upload('/api/documents/' + item.id + '/replace', file, { data: { version: version } })
      .then(function (res) { if (!res.success) throw new Error(res.message); table.reload(); });
  },
  onPrev: function (cur) { const f = dm.getItems().filter(function (i) { return i.type === 'file'; }); const idx = f.findIndex(function (i) { return i.id === cur.id; }); if (idx > 0) dmPreview.show(f[idx - 1]); },
  onNext: function (cur) { const f = dm.getItems().filter(function (i) { return i.type === 'file'; }); const idx = f.findIndex(function (i) { return i.id === cur.id; }); if (idx < f.length - 1) dmPreview.show(f[idx + 1]); },
});

const dm = new MTS.DocumentManagerPlugin({ onFileClick: function (item) { dmPreview.show(item); }, plugins: [dmPreview, dmUpload, dmCtx] });
```

---

## MTS.DocumentManagerPreviewBasicInfoPanel

Built-in side panel rendering item metadata in a compact label/value layout. Configurable via `options.fields`; if
omitted, uses default fields.

```js
// Default
new MTS.DocumentManagerPreviewBasicInfoPanel();

// Custom fields — each entry reads item[field] or uses resolve(item)
new MTS.DocumentManagerPreviewBasicInfoPanel({
  fields: [
    { label: 'Name',     field: 'name' },
    { label: 'Version',  field: 'version' },
    { label: 'Modified', field: 'modifiedAt' },
    { label: 'Area', resolve: function (item) { return item.department || '—'; } },
  ],
});

// Clone and extend the defaults
const myFields = MTS.DocumentManagerPreviewBasicInfoPanel.DEFAULT_FIELDS.slice();
myFields.push({ label: 'Area', field: 'department' });
new MTS.DocumentManagerPreviewBasicInfoPanel({ fields: myFields });
```

Default fields: Name · Type · Size · Version · Created · Modified · Status · Owner.

---

## Localization

Pass `locale: 'es'` (or `'en'`) to `MTS.DataTable` for built-in translations of all UI labels, or override via a
`locale` config object:

```js
new MTS.DataTable({
  locale: {
    dm: {
      upload:   { title: 'Upload files', dropHint: 'Drop files here or', selectBtn: 'Select files', uploadBtn: 'Upload', cancelBtn: 'Cancel', actionReplace: 'Replace', actionVersion: 'New version', actionSkip: 'Skip', fileTypeNotAllowed: 'File type not allowed' },
      workflow: { start: 'Start workflow', sendForApproval: 'Send for approval', approve: 'Approve', sign: 'Sign', reject: 'Reject', restart: 'Restart workflow' },
    },
  },
});
```

---

## Accessibility

- The context menu, breadcrumb and modal controls are keyboard-operable; the preview modal traps focus and closes on `Esc`.
- The dropzone supplements an explicit upload button — provide both so drag is not the only path.

---

## Changelog

### 2026-06-26 — File-type icon colors
- New opt-in option `showFileExtensionColor` (default `false`): colors each file icon by type (PDF red, Word blue,
  Excel green, …) using theme-aware CSS variables; unknown types keep the theme color. Gated by a `mts-dm--file-colors`
  root class, so default behavior is unchanged. New helper `_extToType(ext) → { icon, family }`.

### 2026-06-26
- Notes panel: fixed the panel shifting when adding a note. `scrollIntoView` bubbled to the nearest scrollable
  ancestor (panel/page) when the list wasn't overflowing — replaced with `listEl.scrollTop = listEl.scrollHeight`
  (scrolls only the list; no-op when it doesn't overflow). Header bar is now `position: sticky` so the "+" never
  scrolls out of view.

### 2026-06-25
- Panel header buttons are now compact icon buttons (`iconOnly: true`): the notes "+" (add note) and the metadata
  "edit" button. They previously reserved label padding/width and looked oversized in the panel header.

### Initial
- DocumentManager plugin stack over `MTS.DataTable`: folder navigation, breadcrumb, drag-drop, OS dropzone, upload
  modal with conflict resolution and progress, context menu, approval workflow (with toolbar injection), fullscreen
  preview with side-panel accordion (BasicInfoPanel), render helpers, data contract and full localization.
