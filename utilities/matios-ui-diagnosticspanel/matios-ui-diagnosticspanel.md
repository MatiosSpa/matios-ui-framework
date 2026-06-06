# MTS.DiagnosticsPanel

Built-in diagnostics console for demos, QA, support and client reviews. Mounts as a fixed bottom bar with a log viewer, request inspector, error viewer and session info.

---

## Installation

```html
<link rel="stylesheet" href="base/matios-ui-base.css">
<link rel="stylesheet" href="forms/matios-ui-button/matios-ui-button.css">
<link rel="stylesheet" href="layout/matios-ui-splitter/matios-ui-splitter.css">
<link rel="stylesheet" href="navigation/matios-ui-drawer/matios-ui-drawer.css">
<link rel="stylesheet" href="navigation/matios-ui-tabs/matios-ui-tabs.css">
<link rel="stylesheet" href="utilities/matios-ui-jsonviewer/matios-ui-jsonviewer.css">
<link rel="stylesheet" href="utilities/matios-ui-diagnosticspanel/matios-ui-diagnosticspanel.css">

<script src="forms/matios-ui-button/matios-ui-button.js"></script>
<script src="navigation/matios-ui-drawer/matios-ui-drawer.js"></script>
<script src="navigation/matios-ui-tabs/matios-ui-tabs.js"></script>
<script src="utilities/matios-ui-jsonviewer/matios-ui-jsonviewer.js"></script>
<script src="utilities/matios-ui-diagnosticspanel/matios-ui-diagnosticspanel.js"></script>
```

---

## Usage

```js
const diagnostics = new MTS.DiagnosticsPanel(document.body, {
  appName:              'My App',
  collapsed:            true,
  showLogViewer:        true,
  showRequestInspector: true,
  showErrorViewer:      true,
  showSessionInfo:      true,
  showExport:           true,
  showJsonViewer:       true,
  captureConsole:       true,
  captureWindowErrors:  true,
  captureFetch:         true,
});

diagnostics.log('info', 'Application ready');
diagnostics.setSessionInfo({ user: 'demo@matios.dev', screen: '/calendar' });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `appName` | `string` | `''` | App name shown in the header |
| `collapsed` | `boolean` | `false` | Start collapsed |
| `height` | `number` | `300` | Panel height in px |
| `maxEntries` | `number` | `500` | Max entries per section |
| `showLogViewer` | `boolean` | `true` | Show the log viewer |
| `showRequestInspector` | `boolean` | `true` | Show the request inspector |
| `showErrorViewer` | `boolean` | `true` | Show the error viewer |
| `showSessionInfo` | `boolean` | `true` | Show the session info |
| `showExport` | `boolean` | `true` | Show the export-report button |
| `showJsonViewer` | `boolean` | `true` | Show the integrated JSON viewer |
| `captureConsole` | `boolean` | `false` | Intercept `console.log/warn/error` |
| `captureWindowErrors` | `boolean` | `false` | Intercept global `window` errors |
| `captureFetch` | `boolean` | `false` | Intercept `fetch` requests automatically |

---

## API

| Method | Description |
|--------|-------------|
| `log(type, message[, detail, meta])` | Add a log entry. Types: `'info'` · `'warn'` · `'error'` · `'success'` |
| `addRequest(record)` | Add a record to the request inspector manually |
| `addError(record)` | Add an error to the error viewer |
| `setSessionInfo(info)` | Update the session-info panel with the given object |
| `clear([section])` | Clear a section (`'log'` / `'requests'` / `'errors'`) or all if omitted |
| `show()` / `hide()` / `toggle([force])` | Control the panel |
| `copyReport()` | Copy the report to the clipboard |
| `downloadReport([filename])` | Download the report as a `.txt` file |
| `getReportText()` | Return the report as a string |

```js
diagnostics.log('warn', 'Token about to expire', 'expires in 2 min');
diagnostics.log('error', 'Could not save', { code: 500 });
diagnostics.downloadReport('diagnostics-2026-05-17.txt');
```

---

## Notes

- The panel is injected as a fixed bar in `document.body` — no prior markup required.
- `captureFetch: true` patches the global `window.fetch` — use only in development/demo environments.
- Single public instance; the internal views toggle via the flags — there are no separate subcomponents to instantiate.
- Ideal for client demos, QA sessions and field technical support.

---

## Accessibility

- The panel is a developer/QA tool; keep it out of production builds or behind a flag so it does not interfere with
  the app's accessibility tree for end users.

---

## Changelog

### 2026-05-17
- Documentation homologated to the standard template (full install paths; Options and API as tables).
