# MTS.DocumentManagerPlugin

> Turns an `MTS.DataTable` into a complete document manager — breadcrumb folder
> navigation, drag & drop, an OS dropzone, upload, a fullscreen preview, a context
> menu and an approval workflow.

`MTS.DocumentManagerPlugin` is **not a single widget**. It is a *host* plugin for
`MTS.DataTable` that composes a set of small **sub-plugins**, each responsible for
one capability. You build it **inside-out**, exactly the order the code is written:

1. instantiate the sub-plugins (upload, workflow, preview panels, preview, context menu),
2. nest them into the `DocumentManagerPlugin`,
3. add the `DocumentManagerPlugin` to the `DataTable`.

This document follows that same order. If you just want the finished code, jump to
[Complete example](#complete-example).

---

## Architecture — how the pieces nest

```
MTS.DataTable
  plugins: [ toolbar, filter, colVis, dm ]
        │
        └─ dm  (MTS.DocumentManagerPlugin)          ← breadcrumb nav, drag & drop, dropzone
             plugins: [ dmUpload, dmPreview, contextMenu ]
               ├─ dmUpload   (…UploadPlugin)         ← upload modal + progress + conflict resolution
               ├─ dmPreview  (…PreviewPlugin)        ← fullscreen preview + side-panel accordion
               │     panels: [ BasicInfo, Metadata, Versions, Notes, workflow.participantsPanel ]
               └─ contextMenu (…ContextMenuPlugin)   ← right-click / actions column
                     plugins: [ dmWorkflow ]
                       └─ dmWorkflow (…WorkflowPlugin)
```

One piece is deliberately cross-cutting: **`dmWorkflow` surfaces in three places at once**

```
dmWorkflow
  ├─ sub-plugin of contextMenu   → its actions appear in the context menu
  ├─ showInToolbar: true         → its buttons appear in the DataTable toolbar
  └─ .participantsPanel          → plugged into dmPreview.panels (approval side panel)
```

That is why order matters: `dmWorkflow` must be created **before** `dmPreview` (to hand it
`.participantsPanel`) and **before** `contextMenu` (to pass it as a sub-plugin).

---

## The row item

Every table row is a document item. The `dataSource` returns them; columns, renders and
sub-plugins read their fields. Only `id`, `name` and `type` are strictly required — the
rest are optional and drive specific features.

| Field | Type | Required | Used by |
|-------|------|----------|---------|
| `id` | `string \| number` | yes | `rowId`, navigation, every action |
| `name` | `string` | yes | `renderName`, preview, click behavior |
| `type` | `'file' \| 'folder'` | yes | `renderName` icon, click (folder navigates / file opens), drag targets |
| `parentId` | `string \| number \| null` | — | Folder navigation filter (see below) — the item's parent folder |
| `ext` | `string` | — | `renderName` file icon (extension without dot: `pdf`, `docx`) |
| `version` | `string \| number \| null` | — | `renderName` version badge |
| `size` | `number \| null` | — | `renderSize` helper (bytes) |
| `sizeFormatted` | `string \| null` | — | Pre-formatted size from the server (used directly, no render) |
| `modifiedAt` | `string \| null` | — | Date column |
| `status` | `'active' \| 'archived' \| 'deleted'` | — | `renderStatus` badge |
| `workflowStatus` | `'draft' \| 'pending' \| 'review' \| 'approved' \| 'rejected' \| 'signed'` | — | `renderWorkflowStatus` badge, WorkflowPlugin |

Preview side panels read a few more fields (`mimeType`, `owner`, `createdAt`, …) — those are
listed in the [preview panels](#the-preview-panels) section where they are actually consumed.

### Folder navigation is a query param

The plugin does **not** filter client-side. When the user opens a folder it calls
`table.setParams({ parentId })` and reloads, so your `dataSource` receives `parentId` in the
query and returns that folder's children. At the root, `parentId` is the string `'null'`.

```js
dataSource: async function (query) {
  // query.parentId === 'null' at the root, or the folder id when navigated in
  const res = await http.get('documents', { params: query });
  if (!res.success) throw new Error(res.message);
  return res.data;   // { data: item[], total, totalPages }
}
```

---

## Installation (core)

The core below is enough for the base table. **Each sub-plugin section lists the extra
scripts/styles it needs** — add them as you compose the stack.

```html
<!-- DataTable core (required) -->
<link rel="stylesheet" href="matios-ui-datatable.css">
<script src="matios-ui-datatable.js"></script>
<script src="matios-ui-i18n.js"></script>

<!-- DocumentManager host -->
<link rel="stylesheet" href="plugins/documentmanager/matios-ui-datatable-documentmanager.css">
<script src="plugins/documentmanager/matios-ui-datatable-documentmanager.js"></script>
```

`MTS.Icon` is required (breadcrumb and file icons); `MTS.Sanitize`, if present, is used to
escape server-provided names.

---

## The host table

The DocumentManager lives inside a normal `MTS.DataTable`. The columns use the plugin's
**static render helpers**, and `selection.mode` controls how rows are selected (the
DocumentManager itself adds no checkboxes — it defers selection to the table).

```js
new MTS.DataTable({
  elementId: 'table',
  columns: [
    {
      field:         'name',
      label:         'Name',
      sortable:      true,
      alwaysVisible: true,
      render:        function (v, row) { return MTS.DocumentManagerPlugin.renderName(v, row); },
    },
    { field: 'sizeFormatted',  label: 'Size',     align: 'end',    width: '100px' },
    { field: 'modifiedAt',     label: 'Modified', align: 'end',    width: '130px', sortable: true },
    {
      field:  'status',
      label:  'Status',
      align:  'center',
      width:  '110px',
      render: MTS.DocumentManagerPlugin.renderStatus,
    },
    {
      field:  'workflowStatus',
      label:  'Workflow',
      align:  'center',
      width:  '130px',
      render: MTS.DocumentManagerPlugin.renderWorkflowStatus,
    },
  ],
  dataSource: async function (query) {
    const res = await http.get('documents', { params: query });
    if (!res.success) throw new Error(res.message);
    return res.data;
  },
  rowId:        'id',
  pageSize:     5,
  selection:    { mode: 'single' },   // 'single' | 'multi' — no checkboxes are added by the DM
  actionColumn: true,                 // reserves the actions column the context menu uses
  plugins:      [dm],                 // dm is assembled in the sections below
});
```

### Static render helpers

Static methods on `MTS.DocumentManagerPlugin` that output ready-to-use HTML for column
`render`. `renderStatus` and `renderWorkflowStatus` are localized from the table's `locale`.

| Helper | Signature | Output |
|--------|-----------|--------|
| `renderName` | `(value, row)` | File/folder icon + name + version badge |
| `renderSize` | `(value)` | Human-readable size from bytes (`B`/`KB`/`MB`/`GB`) |
| `renderStatus` | `(value)` | Badge for `active` / `archived` / `deleted` |
| `renderWorkflowStatus` | `(value)` | Badge for `draft` / `pending` / `review` / `approved` / `rejected` / `signed` |

> `renderName` and `renderSize` receive the raw value; `renderStatus` / `renderWorkflowStatus`
> are passed by reference (`render: MTS.DocumentManagerPlugin.renderStatus`).

---

## Upload — `MTS.DocumentManagerUploadPlugin`

The upload modal: an internal dropzone, a file list with per-file state, duplicate detection,
conflict resolution and a per-file progress indicator. It is a **sub-plugin of the
DocumentManager** — the dev decides when it opens.

**How it connects up**
- Added to `dm.plugins: [dmUpload, …]`.
- **You open it** — it never auto-opens. Wire it to a toolbar button and/or the DM dropzone:
  `onFileDrop: function (files, folder) { dmUpload.open(files, folder); }`.
- **It reads its file rules and lifecycle from the DM host, not from its own options:**
  `accept`, `multiple`, `maxFiles`, `maxFileSizeMB`, `onFileExists` and the
  `onUpload` / `onUploaded` / `onError` callbacks all live on `MTS.DocumentManagerPlugin`.
  Set them once there — Upload only drives the modal UI.

### Install

```html
<link rel="stylesheet" href="plugins/documentmanager/matios-ui-datatable-documentmanager-upload.css">
<script src="plugins/documentmanager/matios-ui-datatable-documentmanager-upload.js"></script>
<!-- MTS.Modal (required) -->
<link rel="stylesheet" href="overlays/matios-ui-modal/matios-ui-modal.css">
<script src="overlays/matios-ui-modal/matios-ui-modal.js"></script>
```

### Options (own)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `uploadProgress` | `'bar' \| 'spinner'` | `'bar'` | Per-file progress indicator style. There is no `'none'`. |
| `modalPosition` | `'top' \| 'center' \| 'bottom'` | `'top'` | Vertical position of the upload modal |
| `uploadCheck` | `object \| null` | `null` | Duplicate-detection hook (see below) |
| `uploadCheck.onCheckFileExists` | `async (file, folder)` | — | Return `false` (new file), `true`, or `{ version }` to flag an existing file — the `version` shows as a badge in the conflict UI |

> `accept`, `multiple`, `maxFiles`, `maxFileSizeMB` and `onFileExists` are **not** options here —
> they are read from the DocumentManager host.

### Method

`open(files = null, folder = null)` — opens the modal. `files` (`File[]`) pre-loads the list;
`folder` defaults to the current folder (`dm.getItem()`).

### Upload lifecycle

Persistence runs entirely through the **DocumentManager's** callbacks — Upload only drives the UI:

1. `dmUpload.open(files?, folder?)`.
2. If `uploadCheck.onCheckFileExists` is set, each file is checked; existing files enter a
   conflict state resolved per `onFileExists`.
3. On **Upload**, once per file: `dm.onUpload(file, folder, { action, currentVersion })` — returns
   a Promise. `action` is `'replace' · 'version' · null`; `currentVersion` is the existing file's
   version or `null`.
4. All succeed → `dm.onUploaded(uploadedFiles, folder)`; the modal closes and the table reloads.
5. Any failure → `dm.onError(err, file, folder)`; the modal stays open and the button becomes **Retry**.

**Conflict policy** (`onFileExists` on the DM): `'ask'` shows per-file **Replace / New version / Skip**
buttons; `'replace'` / `'version'` / `'skip'` resolve automatically without prompting.

### Example

```js
const dmUpload = new MTS.DocumentManagerUploadPlugin({
  uploadProgress: 'bar',
  uploadCheck: {
    // Return { version } to mark the file as existing and show the conflict UI.
    onCheckFileExists: function (file, folder) {
      const items = (dmUpload._dm && dmUpload._dm.getItems()) || [];
      const found = items.find(function (i) { return i.type === 'file' && i.name === file.name; });
      return found ? { version: found.version || 'v1' } : false;
    },
  },
});

// The file rules and the upload lifecycle live on the DocumentManager host:
const dm = new MTS.DocumentManagerPlugin({
  accept:        '.pdf,.docx,.xlsx,image/*',
  multiple:      true,
  maxFiles:      10,
  maxFileSizeMB: 25,
  onFileExists:  'ask',
  dropzone:      true,
  onFileDrop:    function (files, folder) { dmUpload.open(files, folder); },
  onUpload:      async function (file, folder, opts) {
    opts = opts || {};
    const fd = new FormData();
    fd.append('file',           file);
    fd.append('folderId',       folder ? folder.id : '');
    fd.append('action',         opts.action         || '');
    fd.append('currentVersion', opts.currentVersion || '');
    const res = await http.post('documents/upload', fd);
    if (!res.success) throw new Error(res.message);
  },
  onUploaded: function (files, folder) { console.log('[dm.onUploaded]', files, folder); },
  onError:    function (err, file, folder) { console.log('[dm.onError]', err, file); },
  plugins:    [dmUpload],
});
```

---

## Workflow — `MTS.DocumentManagerWorkflowPlugin`

An approval lifecycle driven by each item's `workflowStatus`. This is the most cross-cutting
piece: a **single instance surfaces in three places at once**.

**How it connects up** — declare it *first*, before Preview and ContextMenu:
- **Context menu** — pass it as a sub-plugin of the ContextMenu: `contextMenu.plugins: [dmWorkflow]`.
  It is a *context-menu extension*, not a DM plugin.
- **Toolbar** — set `showInToolbar: true` and it injects its buttons by itself (into
  `MTS.DataTableToolbarPlugin` if present, otherwise it renders its own bar via `setToolbarLeft`).
- **Preview** — hand its `.participantsPanel` to `dmPreview.panels` to show the approval chain.

Because Preview needs `.participantsPanel` and the ContextMenu needs the instance, `dmWorkflow`
must be created before both.

### Install

```html
<link rel="stylesheet" href="plugins/documentmanager/matios-ui-datatable-documentmanager-workflow.css">
<script src="plugins/documentmanager/matios-ui-datatable-documentmanager-workflow.js"></script>
<!-- MTS.Button (toolbar + panel buttons) and MTS.SortableList (participants reorder) -->
<link rel="stylesheet" href="display/matios-ui-sortablelist/matios-ui-sortablelist.css">
<script src="forms/matios-ui-button/matios-ui-button.js"></script>
<script src="display/matios-ui-sortablelist/matios-ui-sortablelist.js"></script>
```

### The status lifecycle

The clicked item's `workflowStatus` decides which action appears. An action only shows when its
callback is provided.

| `workflowStatus` | Action(s) | Callback(s) |
|---|---|---|
| `null` / `undefined` | Start | `onStart` |
| `draft` | Send for approval | `onSendForApproval` |
| `pending` | Approve · Reject | `onApprove` · `onReject` |
| `review` | Sign · Reject | `onSign` · `onReject` |
| `rejected` | Restart | `onRestart` |
| `approved` | — (no actions) | — |
| `signed` | — (final state) | — |

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `statusField` | `string` | `'workflowStatus'` | Item field holding the workflow state |
| `showInToolbar` | `boolean` | `false` | Also render the workflow buttons in the toolbar |
| `currentUser` | `string \| null` | `null` | The logged-in user's key — enables the participants panel's Approve/Reject only when it is this user's turn |
| `onStart` | `(items)` | `null` | `null` → `draft` |
| `onSendForApproval` | `(items)` | `null` | `draft` → `pending` |
| `onApprove` | `(items, participant?)` | `null` | `pending` → `approved`. `participant` is set **only** when triggered from the participants panel |
| `onSign` | `(items)` | `null` | `review` → `signed` |
| `onReject` | `(items, participant?)` | `null` | `pending`/`review` → `rejected`. `participant` set **only** from the participants panel |
| `onRestart` | `(items)` | `null` | `rejected` → `draft` |
| `onLoadParticipants` | `(item) → participants[]` | `null` | Loads the approval chain for the participants panel (may return a Promise) |
| `onReorder` | `(participants, item)` | `null` | Fired when the chain is reordered by drag; `participants` carries the new `order` |

> The same `onApprove` / `onReject` handle both the menu/toolbar (`items` only) and the
> participants panel (`items`, `participant`) — write them to tolerate the optional second argument.

### Toolbar rule — state unanimity

With `showInToolbar: true`, a button is enabled only when **all** selected rows share the state
that action needs (Reject enables when all share `pending`, or all share `review`). Mixed
selections disable every workflow button.

### The participants panel

`dmWorkflow.participantsPanel` is a ready-made **Preview side panel** (key `'participants'`). Add
it to `dmPreview.panels`. It renders the approval chain as a reorderable list plus Approve / Reject
buttons. `onLoadParticipants(item)` returns the chain; each participant:

| Field | Type | Purpose |
|---|---|---|
| `id` | `string \| number` | Reorder identity |
| `name` / `lastName` | `string` | Display name + avatar initials |
| `user` | `string` | User key — matched against `currentUser` |
| `status` | `'pending' \| 'approved' \| 'rejected' \| 'signed'` | Badge + reorder lock |
| `order` | `number` | Position in the chain |
| `cantReorder` | `boolean` | Pins this participant (also locked when `status` is `approved`/`rejected`/`signed`) |

**Whose turn:** Approve / Reject are enabled only when `currentUser` is a participant whose
`status` is `pending` **and** everyone before them has already `approved`/`signed`. When the user
acts, the panel calls `onApprove([item], participant)` / `onReject([item], participant)` and
reloads itself.

### Example

```js
const dmWorkflow = new MTS.DocumentManagerWorkflowPlugin({
  statusField:   'workflowStatus',
  showInToolbar: true,
  currentUser:   'crojas',   // the logged-in user

  onLoadParticipants: function (item) {
    return http.get('documents/' + item.id + '/participants')
      .then(function (res) { return res.data.data; });
  },
  onReorder: function (participants, item) {
    return http.post('documents/' + item.id + '/participants/reorder', {
      order: participants.map(function (p) { return p.id; }),
    });
  },

  onStart:           function (items) { console.log('[start]',   items); },
  onSendForApproval: function (items) { console.log('[submit]',  items); },
  onApprove:         function (items, participant) { console.log('[approve]', items, participant); },
  onSign:            function (items) { console.log('[sign]',    items); },
  onReject:          function (items, participant) { console.log('[reject]',  items, participant); },
  onRestart:         function (items) { console.log('[restart]', items); },
});

// The three surfaces it feeds:
//   · contextMenu.plugins: [dmWorkflow]                       → context-menu actions
//   · showInToolbar: true                                     → toolbar buttons (automatic)
//   · dmPreview.panels: [ …, dmWorkflow.participantsPanel ]   → approval side panel
```

---

## Preview panels

The Preview's collapsible side accordion is filled with **panels**. Four are built-in; the Workflow
[participants panel](#the-participants-panel) is a fifth. Anything matching the **panel interface**
below can be added — that is how you build custom panels.

### Panel interface

```js
{
  key:   string,              // unique accordion id
  label: string,              // accordion title (a getter; localized)
  icon:  string | null,       // inline SVG (a getter)
  install(preview),           // called when the Preview installs
  uninstall(),
  render(item) → Element,                     // synchronous skeleton
  load(item)   → Element | Promise<Element>,  // async real content
}
```

`render` paints a skeleton immediately; `load` returns the real content — usually a Promise from
your API. Panels are **lazy**: `load` runs the first time its accordion section opens.

### BasicInfo — `MTS.DocumentManagerPreviewBasicInfoPanel`

Read-only key/value metadata straight from the item — **no callbacks**. `fields` is optional; without
it, `DEFAULT_FIELDS` are shown (Name · Type · Size · Version · Created · Modified · Status · Owner).

| Option | Type | Default | Description |
|---|---|---|---|
| `fields` | `array` | `DEFAULT_FIELDS` | Rows to display |

Each `fields` entry is `{ label, field }` (reads `item[field]`) or `{ label, resolve(item) }`
(computed). Extend the defaults through the static `DEFAULT_FIELDS`:

```js
// Defaults (Name · Type · Size · Version · Created · Modified · Status · Owner)
new MTS.DocumentManagerPreviewBasicInfoPanel();

// Custom fields
new MTS.DocumentManagerPreviewBasicInfoPanel({
  fields: [
    { label: 'Name',     field: 'name' },
    { label: 'Version',  field: 'version' },
    { label: 'Modified', field: 'modifiedAt' },
    { label: 'Area',     resolve: function (item) { return item.department || '—'; } },
  ],
});

// Clone and extend the defaults
const fields = MTS.DocumentManagerPreviewBasicInfoPanel.DEFAULT_FIELDS.slice();
fields.push({ label: 'Area', field: 'department' });
new MTS.DocumentManagerPreviewBasicInfoPanel({ fields: fields });
```

### Metadata — `MTS.DocumentManagerPreviewMetadataPanel`

Editable metadata: a read view plus an edit modal (the edit button appears only when `onSave` is
set). Requires `MTS.Button`, `MTS.Input`, `MTS.Select`, `MTS.Modal` (and optionally `MTS.NumberInput`
/ `MTS.DatePicker` for rich number/date fields).

| Option | Type | Description |
|---|---|---|
| `onLoad` | `(item) → Promise<field[]>` | Loads the editable fields with their current values |
| `onSave` | `(item, fields) → Promise` | Persists the updated fields (same array, new `value`s). Omit → read-only |
| `editTooltip` | `string` | Tooltip for the edit button |

Each field: `{ id, label, type, value, options?, decimals? }` where `type` is
`'input' · 'select' · 'date' · 'datetime' · 'number' · 'textarea'`; `options: [{ id, value, text }]`
is for `select`; `decimals` for `number`.

```js
const dmMetadata = new MTS.DocumentManagerPreviewMetadataPanel({
  onLoad: function (item) {
    return http.get('documents/' + item.id + '/metadata').then(function (res) { return res.data.data; });
  },
  onSave: function (item, fields) {
    return http.put('documents/' + item.id + '/metadata', { fields: fields });
  },
});
```

### Notes — `MTS.DocumentManagerPreviewNotesPanel`

A comment thread. The add button appears only with `onSave`; a note's delete button appears only on
own notes (`isOwn`) when `onDelete` is set. Requires `MTS.Button`, `MTS.Modal`.

| Option | Type | Description |
|---|---|---|
| `onLoad` | `(item) → Promise<note[]>` | Loads the notes |
| `onSave` | `(item, text) → Promise<note>` | Creates a note; **return the created note** so it can be appended |
| `onDelete` | `(note, item) → Promise` | Deletes a note. Omit → no delete button |
| `addTooltip` | `string` | Tooltip for the add button |

Each note: `{ id, user, name, lastName, text, date, isOwn }` — `date` is a preformatted string;
`isOwn` marks the current user's notes.

```js
const dmNotes = new MTS.DocumentManagerPreviewNotesPanel({
  onLoad:   function (item) { return http.get('documents/' + item.id + '/notes').then(function (r) { return r.data.data; }); },
  onSave:   function (item, text) { return http.post('documents/' + item.id + '/notes', { text: text }).then(function (r) { return r.data.data; }); },
  onDelete: function (note, item) { return http.delete('documents/' + item.id + '/notes/' + note.id); },
});
```

### Versions — `MTS.DocumentManagerPreviewVersionsPanel`

The version history. Clicking a version loads its `url` into the preview iframe and fires
`onVersionSelect`. Uses `MTS.Badge`.

| Option | Type | Description |
|---|---|---|
| `onLoad` | `(item) → Promise<version[]>` | Loads the version history |
| `onVersionSelect` | `(version, item)` | Optional — audit hook when a version is clicked |

Each version: `{ id, name, version, parentId, size, modified, author, url, isCurrent }` — `url` is
loaded into the iframe when the row is clicked; `isCurrent` marks the active version.

```js
const dmVersions = new MTS.DocumentManagerPreviewVersionsPanel({
  onLoad: function (item) {
    return http.get('documents/' + item.id + '/versions').then(function (r) { return r.data.data; });
  },
  onVersionSelect: function (version, item) {
    console.log('[version]', version.version, item.id);
  },
});
```

---

## Preview — `MTS.DocumentManagerPreviewPlugin`

A fullscreen modal that renders the document in an iframe next to a collapsible side accordion of
[panels](#preview-panels). The header carries ← prev, → next, a version badge, **Replace** and
**Download**, plus a file-type icon in the title.

**How it connects up**
- Added to `dm.plugins: [dmPreview, …]`.
- **It does not intercept clicks** — you open it yourself, typically from the DM's `onFileClick`:
  `onFileClick: function (item) { dmPreview.show(item); }`.
- Its `panels` are the built-in panels and/or `dmWorkflow.participantsPanel`. The Replace file
  picker inherits `accept` from the DocumentManager host.

Instantiate it **before** the DocumentManager (its callbacks reference `dm` / other plugins), and
create the panels it receives first.

### Install

```html
<link rel="stylesheet" href="plugins/documentmanager/matios-ui-datatable-documentmanager-preview.css">
<script src="plugins/documentmanager/matios-ui-datatable-documentmanager-preview.js"></script>
<!-- MTS.Modal, MTS.Accordion, MTS.Badge (required) -->
<link rel="stylesheet" href="overlays/matios-ui-modal/matios-ui-modal.css">
<script src="overlays/matios-ui-modal/matios-ui-modal.js"></script>
<link rel="stylesheet" href="navigation/matios-ui-accordion/matios-ui-accordion.css">
<script src="navigation/matios-ui-accordion/matios-ui-accordion.js"></script>
<script src="overlays/matios-ui-badge/matios-ui-badge.js"></script>
<!-- plus each panel's own dependencies (see Preview panels) -->
```

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `panels` | `array` | `[]` | Side-accordion panels (built-in and/or `dmWorkflow.participantsPanel`) |
| `urlResolver` | `(item) → string \| null` | `null` | Iframe URL for the item. Overridden by an explicit URL in `show(item, url)` |
| `onDownload` | `(item)` | `null` | Header **Download** button. Omit → no button |
| `onReplace` | `(item, file, version) → Promise` | `null` | Header **Replace** button. Return a Promise to drive the confirm overlay's progress bar. Omit → no button |
| `onPrev` | `(currentItem)` | `null` | Header **←** button |
| `onNext` | `(currentItem)` | `null` | Header **→** button |
| `panelVisible` | `boolean` | `true` | Side panel open when the preview opens |
| `panelWidth` | `string` | `'340px'` | Width of the open side panel |

### Methods

| Method | Description |
|---|---|
| `show(item, url?)` | Opens the preview. `url` overrides `urlResolver(item)` — resolve it externally when needed |
| `hide()` | Closes the preview |
| `loadUrl(url)` | Swaps the iframe URL without changing the active item (used by the Versions panel) |

### Replace flow

Clicking **Replace** opens a file picker (its `accept` inherited from the DM) → a confirm overlay
shows the file, a version input (suggesting `parseInt(currentVersion) + 1`) and an
extension-mismatch warning → **Upload** calls `onReplace(item, file, version)`. If that returns a
Promise, the overlay shows an indeterminate bar, then success (auto-closes and reloads the iframe)
or an error with **Retry** / **Close**.

### Example

```js
const dmPreview = new MTS.DocumentManagerPreviewPlugin({
  panels: [
    new MTS.DocumentManagerPreviewBasicInfoPanel(),
    dmMetadata,
    dmVersions,
    dmNotes,
    dmWorkflow.participantsPanel,   // the Workflow panel plugs in here
  ],
  urlResolver: function (item) { return 'documents/' + item.id + '/retrieve'; },
  onDownload:  function (item) { window.open('documents/' + item.id + '/download'); },
  onReplace:   function (item, file, version) {
    return http.upload('documents/' + item.id + '/replace', file, { data: { version: version } })
      .then(function (res) { if (!res.success) throw new Error(res.message); });
  },
  onPrev: function (cur) {
    const files = dm.getItems().filter(function (i) { return i.type === 'file'; });
    const idx   = files.findIndex(function (i) { return i.id === cur.id; });
    if (idx > 0) dmPreview.show(files[idx - 1]);
  },
  onNext: function (cur) {
    const files = dm.getItems().filter(function (i) { return i.type === 'file'; });
    const idx   = files.findIndex(function (i) { return i.id === cur.id; });
    if (idx < files.length - 1) dmPreview.show(files[idx + 1]);
  },
  panelVisible: true,
  panelWidth:   '340px',
});
```

> The built-in panels read a few extra item fields: `mimeType` / `contentType` (file-type icon and
> BasicInfo's *Type*), `owner` / `author` (BasicInfo's *Owner*), `createdAt` / `updatedAt`. All are
> optional — missing ones render as `—`.

---

## Context menu — `MTS.DocumentManagerContextMenuPlugin`

A per-row menu with the standard document actions, reachable **two ways**: right-clicking a row, and
(when the table sets `actionColumn: true`) a trigger button in the actions column. It is also the
**host for the Workflow plugin**.

**How it connects up**
- Added to `dm.plugins: [contextMenu, …]`. On install it wires the DM's `onContextMenuRequest`
  hook and, if the table has `actionColumn: true`, injects the actions column automatically.
- Workflow and any other context-menu extensions go in **its own** `plugins: [dmWorkflow]`.

### Install

```html
<script src="plugins/documentmanager/matios-ui-datatable-documentmanager-contextmenu.js"></script>
<!-- MTS.DataTableMenu — the shared menu (required) -->
<link rel="stylesheet" href="plugins/shared/matios-ui-datatable-menu.css">
<script src="plugins/shared/matios-ui-datatable-menu.js"></script>
```

### Options

| Option | Type | Argument | Description |
|---|---|---|---|
| `onView` | `(item)` | single | View a file |
| `onDownload` | `(items)` | batch | Download — disabled when every item is `locked` |
| `onOpen` | `(item)` | single | Open a folder (also navigates into it) |
| `onRename` | `(item)` | single | Rename an item |
| `onMove` | `(items)` | batch | Move items |
| `onDelete` | `(items)` | batch | Delete items |
| `plugins` | `array` | — | Context-menu extensions, e.g. `[dmWorkflow]` |

**single vs batch** — `onView` / `onOpen` / `onRename` always receive the **clicked** item. The batch
callbacks (`onDownload` / `onMove` / `onDelete`) receive the **resolved selection**: if the clicked
row is part of the current selection they get all selected items, otherwise just the clicked one.

**Menus** — files show *View · Download · | · Rename · Move · | · Delete*; folders show
*Open · | · Rename · Move · | · Delete*. The standard items **always appear** — an action whose
callback you didn't provide simply does nothing (it is not removed).

### Extending it

Sub-plugins passed in `plugins: [...]` receive `install(contextMenu)` and add items via
`contextMenu.addItems(fn)`, where `fn(contextItem, items)` returns item defs (each may carry a
`condition(contextItem, items)`). Their items are appended after a separator. The six callback names
above and the `provides: 'dmContextMenu'` identity are reserved — an extension declaring them is
rejected with a console warning. `addItems(fn)` is also public for one-off extensions without a
formal plugin.

### Example

```js
const contextMenu = new MTS.DocumentManagerContextMenuPlugin({
  onView:     function (item)  { dmPreview.show(item); },
  onDownload: function (items) { console.log('[download]', items); },
  onOpen:     function (item)  { console.log('[open]',     item);  },
  onRename:   function (item)  { console.log('[rename]',   item);  },
  onMove:     function (items) { console.log('[move]',     items); },
  onDelete:   function (items) { console.log('[delete]',   items); },
  plugins: [dmWorkflow],   // Workflow actions are hosted here
});
```

---

## DocumentManager — assembling the host

`MTS.DocumentManagerPlugin` is the host that ties the sub-plugins together and owns the shared file
rules and the upload funnel. You pass it the sub-plugins built above in `plugins: [...]`, plus its
own navigation/display options and event callbacks.

### Options — navigation & display

| Option | Type | Default | Description |
|---|---|---|---|
| `rootLabel` | `string` | `'Documentos'` | Breadcrumb root label |
| `breadcrumb` | `boolean` | `true` | Show the breadcrumb in the toolbar's left slot |
| `showFileExtensionColor` | `boolean` | `false` | Color file icons by type (opt-in) |
| `iconSize` | `string \| number` | `null` (→ `20px`) | File/folder icon size (`--mts-dm-icon-size`) |
| `dragDrop` | `boolean` | `false` | Internal drag & drop to move items into folders |
| `dropzone` | `boolean` | `false` | OS file drop over the table |

### Options — file rules (read by the Upload plugin and the dropzone)

| Option | Type | Default | Description |
|---|---|---|---|
| `accept` | `string` | `'*'` | Accepted extensions/MIME (`'.pdf,.docx,image/*'`) |
| `multiple` | `boolean` | `true` | Allow multiple files |
| `maxFiles` | `number \| null` | `null` | Max files per upload |
| `maxFileSizeMB` | `number \| null` | `null` | Max size per file (MB) |
| `onFileExists` | `'ask' \| 'replace' \| 'version' \| 'skip'` | `'ask'` | Duplicate policy |

### Options — events & plugins

| Option | Signature | Fired by |
|---|---|---|
| `onFileClick` | `(item)` | Clicking a file's name |
| `onDrop` | `(items, targetFolder)` | Internal drag onto a folder |
| `onFileDrop` | `(files, folder)` | OS files dropped on the dropzone |
| `onUpload` | `async (file, folder, { action, currentVersion })` | Upload plugin, once per file |
| `onUploaded` | `(files, folder)` | Upload plugin, batch success |
| `onError` | `(err, file, folder)` | Upload plugin, per-file failure |
| `onContextMenuRequest` | `(item, x, y)` | Right-click — **set automatically** by the ContextMenu plugin |
| `plugins` | `array` | The sub-plugins: `[dmUpload, dmPreview, contextMenu]` |

> The file rules and `onUpload`/`onUploaded`/`onError` live here because the **Upload** plugin reads
> them. `onContextMenuRequest` is wired by the **ContextMenu** plugin, so you rarely set it by hand.

### Methods

| Method | Returns | Description |
|---|---|---|
| `getItem()` | current folder or `null` | The folder currently navigated (root → `null`) |
| `getItems()` | items on the current page | Visible rows — used e.g. in `onCheckFileExists` |

### Composition

```js
const dm = new MTS.DocumentManagerPlugin({
  rootLabel:   'Documents',
  breadcrumb:  true,
  dragDrop:    true,
  dropzone:    true,

  accept:        '.pdf,.docx,.xlsx,image/*',
  multiple:      true,
  maxFiles:      10,
  maxFileSizeMB: 25,
  onFileExists:  'ask',

  onFileDrop:  function (files, folder) { dmUpload.open(files, folder); },
  onFileClick: function (item)          { dmPreview.show(item); },
  onUpload:    async function (file, folder, opts) { /* POST the file, throw on failure */ },
  onUploaded:  function (files, folder) { /* refresh / toast */ },
  onError:     function (err, file)     { /* report */ },
  onDrop:      function (items, folder) { /* persist the move */ },

  plugins: [dmUpload, dmPreview, contextMenu],   // contextMenu hosts dmWorkflow
});
```

Finally, add `dm` to the table next to the standard DataTable plugins — the full wiring is the
[Complete example](#complete-example) below.

---

## Complete example

The full stack wired together, in construction order (sub-plugins → DocumentManager → DataTable).
This is the code that runs in the live demo.

```js
// Set the language once, at startup — every component inherits it.
MTS.setLanguage('en');

// ── HTTP client ────────────────────────────────────────────────────────────
const http = new MTS.HttpClient({
  baseUrl: '/api',
  headers: { 'X-App-Name': 'my-app' },
});

// ── Base DataTable plugins ─────────────────────────────────────────────────
const toolbar = new MTS.DataTableToolbarPlugin({
  buttons: [
    { label: 'Upload',     icon: 'upload',      tooltip: 'Upload a file to the current folder',
      action: function () { dmUpload.open(); } },
    { label: 'New folder', icon: 'folder-plus', tooltip: 'Create a new folder here',
      action: function () { console.log('[newFolder]'); } },
    { separator: true },
    { label: 'Download', icon: 'download', tooltip: 'Download the selected files',
      condition: function (table) { return table.getSelection().length > 0; },
      action:    function (table) { console.log('[download]', table.getSelection()); } },
    { label: 'Delete', icon: 'trash', danger: true, tooltip: 'Delete the selected items',
      condition: function (table) { return table.getSelection().length > 0; },
      action:    function (table) { console.log('[delete]', table.getSelection()); } },
  ],
});

const filter = new MTS.DataTableFilterPlugin({
  filters: [
    { field: 'status', label: 'Status', type: 'select',
      options: [{ value: 'active', label: 'Active' }, { value: 'archived', label: 'Archived' }] },
    { field: 'workflowStatus', label: 'Workflow', type: 'select',
      options: [
        { value: 'draft',    label: 'Draft'     },
        { value: 'pending',  label: 'Pending'   },
        { value: 'review',   label: 'In review' },
        { value: 'approved', label: 'Approved'  },
        { value: 'signed',   label: 'Signed'    },
        { value: 'rejected', label: 'Rejected'  },
      ] },
  ],
});

const colVis = new MTS.DataTableColumnVisibilityPlugin();

// ── DocumentManager sub-plugins (inside-out) ───────────────────────────────
const dmUpload = new MTS.DocumentManagerUploadPlugin({
  uploadProgress: 'bar',
  uploadCheck: {
    onCheckFileExists: function (file, folder) {
      const items = (dmUpload._dm && dmUpload._dm.getItems()) || [];
      const found = items.find(function (i) { return i.type === 'file' && i.name === file.name; });
      return found ? { version: found.version || 'v1' } : false;
    },
  },
});

const dmWorkflow = new MTS.DocumentManagerWorkflowPlugin({
  statusField:   'workflowStatus',
  showInToolbar: true,
  currentUser:   'crojas',
  onLoadParticipants: function (item) {
    return http.get('documents/' + item.id + '/participants').then(function (res) { return res.data.data; });
  },
  onReorder: function (participants, item) {
    return http.post('documents/' + item.id + '/participants/reorder', {
      order: participants.map(function (p) { return p.id; }),
    });
  },
  onStart:           function (items) { console.log('[start]',   items); },
  onSendForApproval: function (items) { console.log('[submit]',  items); },
  onApprove:         function (items, participant) { console.log('[approve]', items, participant); },
  onSign:            function (items) { console.log('[sign]',    items); },
  onReject:          function (items, participant) { console.log('[reject]',  items, participant); },
  onRestart:         function (items) { console.log('[restart]', items); },
});

const dmMetadata = new MTS.DocumentManagerPreviewMetadataPanel({
  onLoad: function (item)         { return http.get('documents/' + item.id + '/metadata').then(function (r) { return r.data.data; }); },
  onSave: function (item, fields) { return http.put('documents/' + item.id + '/metadata', { fields: fields }); },
});

const dmNotes = new MTS.DocumentManagerPreviewNotesPanel({
  onLoad:   function (item)       { return http.get('documents/' + item.id + '/notes').then(function (r) { return r.data.data; }); },
  onSave:   function (item, text) { return http.post('documents/' + item.id + '/notes', { text: text }).then(function (r) { return r.data.data; }); },
  onDelete: function (note, item) { return http.delete('documents/' + item.id + '/notes/' + note.id); },
});

const dmVersions = new MTS.DocumentManagerPreviewVersionsPanel({
  onLoad:          function (item)          { return http.get('documents/' + item.id + '/versions').then(function (r) { return r.data.data; }); },
  onVersionSelect: function (version, item) { console.log('[version]', version.version, item.id); },
});

const dmPreview = new MTS.DocumentManagerPreviewPlugin({
  panels: [
    new MTS.DocumentManagerPreviewBasicInfoPanel(),
    dmMetadata,
    dmVersions,
    dmNotes,
    dmWorkflow.participantsPanel,
  ],
  urlResolver: function (item) { return 'documents/' + item.id + '/retrieve'; },
  onDownload:  function (item) { window.open('/api/documents/' + item.id + '/download'); },
  onReplace:   function (item, file, version) {
    return http.upload('documents/' + item.id + '/replace', file, { data: { version: version } })
      .then(function (res) { if (!res.success) throw new Error(res.message); });
  },
  onPrev: function (cur) {
    const files = dm.getItems().filter(function (i) { return i.type === 'file'; });
    const idx   = files.findIndex(function (i) { return i.id === cur.id; });
    if (idx > 0) dmPreview.show(files[idx - 1]);
  },
  onNext: function (cur) {
    const files = dm.getItems().filter(function (i) { return i.type === 'file'; });
    const idx   = files.findIndex(function (i) { return i.id === cur.id; });
    if (idx < files.length - 1) dmPreview.show(files[idx + 1]);
  },
  panelVisible: true,
  panelWidth:   '340px',
});

// ── DocumentManager host ───────────────────────────────────────────────────
const dm = new MTS.DocumentManagerPlugin({
  rootLabel:   'Documents',
  breadcrumb:  true,
  showFileExtensionColor: true,
  dragDrop:    true,
  dropzone:    true,

  accept:        '.pdf,.docx,.xlsx,.html,.pptx,image/*',
  multiple:      true,
  maxFiles:      10,
  maxFileSizeMB: 25,
  onFileExists:  'ask',

  onFileDrop: function (files, folder) { dmUpload.open(files, folder); },
  onUpload: async function (file, folder, opts) {
    opts = opts || {};
    const fd = new FormData();
    fd.append('file',           file);
    fd.append('folderId',       folder ? folder.id : '');
    fd.append('action',         opts.action         || '');
    fd.append('currentVersion', opts.currentVersion || '');
    const res = await http.post('documents/upload', fd);
    if (!res.success) throw new Error(res.message);
  },
  onUploaded:  function (files, folder) { console.log('[uploaded]', files, folder); },
  onError:     function (err, file)     { console.log('[error]', err, file); },
  onFileClick: function (item)          { dmPreview.show(item); },
  onDrop:      function (items, folder) { console.log('[move]', items, folder); },

  plugins: [
    dmUpload,
    dmPreview,
    new MTS.DocumentManagerContextMenuPlugin({
      onView:     function (item)  { dmPreview.show(item); },
      onDownload: function (items) { console.log('[download]', items); },
      onOpen:     function (item)  { console.log('[open]',     item);  },
      onRename:   function (item)  { console.log('[rename]',   item);  },
      onMove:     function (items) { console.log('[move]',     items); },
      onDelete:   function (items) { console.log('[delete]',   items); },
      plugins: [dmWorkflow],   // Workflow is hosted by the context menu
    }),
  ],
});

// ── DataTable ──────────────────────────────────────────────────────────────
new MTS.DataTable({
  elementId: 'documents-table',
  columns: [
    { field: 'name', label: 'Name', sortable: true, alwaysVisible: true,
      render: function (v, row) { return MTS.DocumentManagerPlugin.renderName(v, row); } },
    { field: 'sizeFormatted',  label: 'Size',     align: 'end',    width: '100px' },
    { field: 'modifiedAt',     label: 'Modified', align: 'end',    width: '130px', sortable: true },
    { field: 'status',         label: 'Status',   align: 'center', width: '110px',
      render: MTS.DocumentManagerPlugin.renderStatus },
    { field: 'workflowStatus', label: 'Workflow', align: 'center', width: '130px',
      render: MTS.DocumentManagerPlugin.renderWorkflowStatus },
  ],
  dataSource: async function (query) {
    // query includes parentId (folder navigation), plus paging/sort/search/filters
    const res = await http.get('documents', { params: query });
    if (!res.success) throw new Error(res.message);
    return res.data;   // { data: item[], total, totalPages }
  },
  rowId:             'id',
  pageSize:          5,
  hover:             true,
  fixedHeader:       true,
  fixedHeaderHeight: '480px',
  sort:       { column: 'name', direction: 'asc' },
  search:     { enabled: true, minChars: 1, width: '260px' },
  selection:  { mode: 'single' },
  pagination: { pageSizeOptions: [5, 10, 20, 50, 100] },
  actionColumn: true,
  plugins: [toolbar, filter, colVis, dm],
  onSelectionChange: function (items) {
    toolbar.update();
    console.log('[selection]', items);
  },
});
```

---

## Localization

Every string is localized. Set the language **once at startup** and every component — the DataTable
and all the DocumentManager sub-plugins — inherits it:

```js
MTS.setLanguage('en');   // 'es' (default) · 'en' · 'pt'
```

Each plugin reads its **own namespace** from the active locale:

| Namespace | Covers |
|---|---|
| `MTS.DocumentManagerPlugin` | breadcrumb, dropzone hint, `status` / `workflowStatus` badge labels |
| `MTS.DocumentManagerUploadPlugin` | upload modal (`selectFiles`, `dropHint`, conflict actions, statuses) |
| `MTS.DocumentManagerContextMenuPlugin` | menu items (`view`, `download`, `open`, `rename`, `move`, `delete`) |
| `MTS.DocumentManagerWorkflowPlugin` | workflow actions + participant statuses |
| `MTS.DocumentManagerPreviewPlugin` | preview header + replace overlay |
| `MTS.DocumentManagerPreviewBasicInfoPanel` | panel label + default field labels |
| `MTS.DocumentManagerPreviewMetadataPanel` | metadata panel + edit modal |
| `MTS.DocumentManagerPreviewNotesPanel` | notes panel + add modal |
| `MTS.DocumentManagerPreviewVersionsPanel` | versions panel |

Each plugin localizes its chrome from the active global language; set it once at startup with `MTS.setLanguage(code)`.

---

## Accessibility

- The context menu, breadcrumb and modal controls are keyboard-operable; the preview modal traps
  focus and closes on `Esc`.
- The dropzone supplements an explicit upload button — provide both so drag is not the only path.
