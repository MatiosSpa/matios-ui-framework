# MTS.JsonViewer

Collapsible JSON viewer for payloads, config, diagnostics and structured responses. Accepts a JSON string or a JavaScript value, formats it, and supports expand, collapse, paste and copy. Invalid JSON strings fall back to a raw view with the parse error.

---

## Installation

```html
<link rel="stylesheet" href="utilities/matios-ui-jsonviewer/matios-ui-jsonviewer.css">
<script src="icons/matios-ui-icons.js"></script>
<script src="forms/matios-ui-copybutton/matios-ui-copybutton.js"></script>
<script src="base/matios-ui-i18n.js"></script>
<script src="utilities/matios-ui-jsonviewer/matios-ui-jsonviewer-i18n.js"></script>
<script src="utilities/matios-ui-jsonviewer/matios-ui-jsonviewer.js"></script>
```

- `icons/matios-ui-icons.js` is optional; when present the toggle chevrons use Matios icons, otherwise Unicode arrows.
- `forms/matios-ui-copybutton/matios-ui-copybutton.js` is optional; when present the copy button uses `MTS.CopyButton`, otherwise a built-in Clipboard fallback is used.
- `base/matios-ui-i18n.js` + `matios-ui-jsonviewer-i18n.js` localize the toolbar labels, state badges and summaries. Without them the component uses its built-in Spanish defaults.

---

## Usage

```js
// From a JSON string
new MTS.JsonViewer('#payload', {
  title:    'Request payload',
  subtitle: 'POST /api/workflows',
  data:     '{"name":"Admin","active":true,"modules":["users","billing"]}',
  copyable: true
});

// From a JavaScript value
new MTS.JsonViewer('#session', {
  title: 'Session',
  data:  { user: 'demo@matios.dev', roles: ['owner', 'billing-admin'], active: true }
});

// Editable — the user can paste JSON and press Format
new MTS.JsonViewer('#editor', {
  title:       'Paste and format',
  editable:    true,
  placeholder: 'Paste your JSON here and press Format'
});
```

The first argument is a CSS selector string or an element. The component renders in place; there is no `.mount()`.

Options can also be supplied through `data-*` attributes on the host element (`data-title`, `data-subtitle`, `data-copyable`, `data-height`, `data-collapsed-depth`, `data-empty-text`, `data-editable`, `data-placeholder`, `data-data`). Explicit `options` take precedence.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `data` | `string \| object \| array \| null` | `''` | JSON string, or any JS value to display. Invalid JSON strings fall back to raw + parse error |
| `title` | `string` | `''` | Toolbar title |
| `subtitle` | `string` | `''` | Toolbar secondary text |
| `copyable` | `boolean` | `true` | Show the copy button |
| `height` | `string` | `'auto'` | CSS height of the component (set as `--mts-jsonviewer-height`) |
| `collapsedDepth` | `number \| null` | `null` | Collapse every node at or beyond this depth on load; `null` keeps all expanded |
| `emptyText` | `string` | i18n `emptyText` | Text shown when there is no data |
| `editable` | `boolean` | `false` | Show an internal textarea plus a Format button to paste JSON |
| `placeholder` | `string` | i18n `placeholder` | Textarea placeholder (editable mode) |

---

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `setData(data)` | `this` | Replace the payload and re-render. Same value types as the `data` option |
| `setTitle(title[, subtitle])` | `this` | Update the toolbar title (and subtitle if given) |
| `format()` | `this` | In `editable` mode, parse and format the current textarea content. No-op otherwise |
| `expandAll()` | `this` | Expand every node |
| `collapseAll()` | `this` | Collapse every collapsible node in the tree |
| `destroy()` | `undefined` | Tear down the copy button, clear timers and empty the host element |

`MTS.JsonViewer.safeStringify(value)` is a static helper that stringifies a value with 2-space indent and `[Circular]` guards.

```js
const viewer = new MTS.JsonViewer('#payload', { title: 'Response' });
viewer.setData({ status: 'ok', items: [1, 2, 3] });
viewer.expandAll();
```

---

## Behavior

- When `data` is a string and `JSON.parse()` fails, the toolbar badge shows `RAW`, an error line shows the parse message, and the original raw text is kept and still copyable — useful for debugging malformed payloads.
- Collapsed compound nodes show a summary (`{n} items` for arrays, `{n} keys` for objects); empty compounds show `(empty array)` / `(empty object)`.
- The toolbar `Collapse` / `Expand` buttons only appear when the root value is an object or array.
- In `editable` mode, `Ctrl`/`Cmd` + `Enter` inside the textarea triggers `format()`.

---

## i18n

The component reads its toolbar labels, state badges and summaries from the global i18n table under the `MTS.JsonViewer` namespace. Set the language once at startup with `MTS.setLanguage`; there is no per-instance locale option.

```js
MTS.setLanguage('en');
new MTS.JsonViewer('#payload', { data: { ok: true } });
```

Keys under `MTS.JsonViewer` (`{n}` is replaced by the count):

| Key | es | en | pt |
|-----|----|----|----|
| `copy` | Copiar | Copy | Copiar |
| `copied` | Copiado | Copied | Copiado |
| `collapseAll` | Contraer | Collapse | Recolher |
| `expandAll` | Expandir | Expand | Expandir |
| `format` | Formatear | Format | Formatar |
| `stateJson` | JSON | JSON | JSON |
| `stateRaw` | RAW | RAW | RAW |
| `invalidJson` | JSON invalido | Invalid JSON | JSON invalido |
| `emptyText` | Sin datos JSON. | No JSON data. | Sem dados JSON. |
| `placeholder` | Pega aqui un JSON y presiona Format. | Paste JSON here and press Format. | Cole um JSON aqui e pressione Format. |
| `emptyArray` | (arreglo vacio) | (empty array) | (array vazio) |
| `emptyObject` | (objeto vacio) | (empty object) | (objeto vazio) |
| `itemOne` | {n} elemento | {n} item | {n} item |
| `itemMany` | {n} elementos | {n} items | {n} itens |
| `keyOne` | {n} clave | {n} key | {n} chave |
| `keyMany` | {n} claves | {n} keys | {n} chaves |

Bundled locales: `es` (default), `en`, `pt`. Override or add strings with `MTS.registerLocale`:

```js
MTS.registerLocale('en', {
  'MTS.JsonViewer': { copy: 'Copy JSON' }
});
```

If `base/matios-ui-i18n.js` is not loaded, the component uses its built-in Spanish defaults.

---

## Accessibility

- Tree nodes are real focusable buttons that expand/collapse on click or keyboard activation; the copy and format controls are real focusable buttons.
