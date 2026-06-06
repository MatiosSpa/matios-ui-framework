# MTS.JsonViewer

Collapsible JSON viewer for payloads, config, diagnostics and structured responses. Accepts a JSON string or a JavaScript object, formats it, and supports expand, collapse, paste and copy.

---

## Installation

```html
<link rel="stylesheet" href="utilities/matios-ui-jsonviewer/matios-ui-jsonviewer.css">
<script src="icons/matios-ui-icons.js"></script>
<script src="forms/matios-ui-copybutton/matios-ui-copybutton.js"></script>
<script src="utilities/matios-ui-jsonviewer/matios-ui-jsonviewer.js"></script>
```

`matios-ui-icons.js` is optional but improves the toggles with Matios icons.

---

## Usage

```js
// From a JSON string
new MTS.JsonViewer('#payload', {
  title:    'Request body',
  subtitle: 'POST /api/roles',
  data:     '{"name":"Admin","active":true,"modules":["users","billing"]}',
  copyable: true,
});

// From a JavaScript object
new MTS.JsonViewer('#session', {
  title: 'Session',
  data:  { user: 'demo@matios.dev', roles: ['owner', 'billing-admin'], active: true },
});

// Editable — the user can paste JSON directly
new MTS.JsonViewer('#editor', { title: 'Paste and format', editable: true, placeholder: 'Paste JSON and press Format' });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `data` | `string \| object \| array` | `''` | JSON string or JS structure to display |
| `title` | `string` | `''` | Top title |
| `subtitle` | `string` | `''` | Secondary text |
| `copyable` | `boolean` | `true` | Show the copy button |
| `height` | `string` | `'auto'` | Component height |
| `collapsedDepth` | `number \| null` | `null` | Collapse nodes beyond a given depth |
| `emptyText` | `string` | localized | Empty-state text |
| `editable` | `boolean` | `false` | Show an internal textarea to paste JSON |
| `placeholder` | `string` | localized | Textarea placeholder |

---

## API

| Method | Description |
|--------|-------------|
| `setData(data)` | Update the payload and re-render the tree |
| `setTitle(title[, subtitle])` | Update the toolbar title and subtitle |
| `expandAll()` / `collapseAll()` | Expand all / collapse the root's children |
| `format()` | In `editable` mode, parse and format the textarea content |
| `destroy()` | Clear the component |

```js
const viewer = new MTS.JsonViewer('#payload', { title: 'Response' });
viewer.setData({ status: 'ok', items: [1, 2, 3] });
viewer.expandAll();
```

---

## Notes

- If `data` is a string and `JSON.parse()` fails, the component shows the error, keeps the raw text and still allows
  copying the original content — useful for debugging malformed payloads.
- Integrates natively with `MTS.DiagnosticsPanel` and the `MTS.HttpClient` inspector.

---

## Accessibility

- Tree nodes are keyboard-operable (expand/collapse); the copy and format controls are real focusable buttons.

---

## Changelog

### 2026-05-17
- Documentation homologated to the standard template; full install paths; API converted to a table.
