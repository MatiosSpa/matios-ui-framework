# MTS.DiagnosticsPanel

Built-in diagnostics console for demos, QA, support and client reviews. It mounts as a docked bar (bottom by default) with a collapsible sheet that holds an activity/log viewer, a request inspector, an error viewer, session info and a report export. It can intercept `console`, `window` errors and `fetch` automatically.

---

## Installation

```html
<link rel="stylesheet" href="base/matios-ui-base.css">
<link rel="stylesheet" href="forms/matios-ui-button/matios-ui-button.css">
<link rel="stylesheet" href="layout/matios-ui-splitter/matios-ui-splitter.css">
<link rel="stylesheet" href="navigation/matios-ui-drawer/matios-ui-drawer.css">
<link rel="stylesheet" href="navigation/matios-ui-tabs/matios-ui-tabs.css">
<link rel="stylesheet" href="utilities/matios-ui-codeblock/matios-ui-codeblock.css">
<link rel="stylesheet" href="utilities/matios-ui-jsonviewer/matios-ui-jsonviewer.css">
<link rel="stylesheet" href="utilities/matios-ui-diagnosticspanel/matios-ui-diagnosticspanel.css">

<script src="base/matios-ui-i18n.js"></script>
<script src="forms/matios-ui-button/matios-ui-button.js"></script>
<script src="navigation/matios-ui-drawer/matios-ui-drawer.js"></script>
<script src="navigation/matios-ui-tabs/matios-ui-tabs.js"></script>
<script src="utilities/matios-ui-jsonviewer/matios-ui-jsonviewer.js"></script>
<script src="utilities/matios-ui-diagnosticspanel/matios-ui-diagnosticspanel-i18n.js"></script>
<script src="utilities/matios-ui-diagnosticspanel/matios-ui-diagnosticspanel.js"></script>
```

`MTS.Tabs` is required. `MTS.Drawer` + `MTS.JsonViewer` are optional: if present (and `showJsonViewer` is on), request bodies open in a JSON drawer; otherwise a plain `<pre>` detail is shown. `MTS.ButtonGroup` and `MTS.Icon` are used for the header actions when available, with a plain-button fallback.

---

## Usage

```js
const diagnostics = new MTS.DiagnosticsPanel(document.body, {
  title:                'DiagnosticsPanel',
  appName:              'My App',
  collapsed:            true,
  height:               '360px',
  showLogViewer:        true,
  showRequestInspector: true,
  showErrorViewer:      true,
  showSessionInfo:      true,
  showExport:           true,
  showJsonViewer:       true,
  captureConsole:       true,
  captureWindowErrors:  true,
  captureFetch:         true,
  maxEntries:           160
});

diagnostics.setSessionInfo({ user: 'demo@matios.dev', screen: '/calendar' });
diagnostics.log('info', 'Application ready');
```

The first argument is the host element or a CSS selector. When it is `document.body` (or `document.documentElement`) the panel docks to the viewport; otherwise it is embedded inside the given host. If the host is not found, the constructor logs an error and returns without building.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | When `false`, the panel is not built (state kept, no DOM) |
| `title` | `string` | `'Diagnostics'` | Label shown in the dock bar |
| `appName` | `string` | `document.title` or `'Matios App'` | Heading shown in the sheet header and report |
| `position` | `string` | `'bottom'` | Written to `data-position` on the root (CSS-driven) |
| `collapsed` | `boolean` | `true` | Start collapsed (sheet hidden) |
| `height` | `string` | `'340px'` | Sheet height (clamped to the viewport) |
| `maxEntries` | `number` | `120` | Max entries kept per section |
| `session` | `object` | `{}` | Extra fields merged into the initial session info |
| `showLogViewer` | `boolean` | `true` | Show the Activity (log) tab |
| `showRequestInspector` | `boolean` | `true` | Show the Requests tab |
| `showErrorViewer` | `boolean` | `true` | Show the Errors tab |
| `showSessionInfo` | `boolean` | `true` | Show the Session tab |
| `showExport` | `boolean` | `true` | Show the Export tab |
| `showJsonViewer` | `boolean` | `true` | Use the JSON drawer for request bodies (needs `MTS.Drawer` + `MTS.JsonViewer`) |
| `captureConsole` | `boolean` | `true` | Intercept `console.log/info/warn/error` |
| `captureWindowErrors` | `boolean` | `true` | Intercept global `error` and `unhandledrejection` |
| `captureFetch` | `boolean` | `true` | Intercept `window.fetch` requests automatically |

The global `console` / `fetch` / error hooks are installed once and shared across every panel instance (a single internal bridge); each instance still filters by its own `capture*` flags.

---

## API

All methods return the instance (for chaining) unless noted otherwise.

| Method | Description |
|--------|-------------|
| `log(type, message[, detail, meta])` | Add a log entry. `type` is a free string used as the badge/level (e.g. `'info'`, `'warn'`, `'error'`, `'success'`) |
| `addRequest(record)` | Add a request record manually (`method`, `url`, `status`, `ok`, `durationMs`, `requestBody`, `responseBody`) |
| `addError(error)` | Add an error entry (`name`, `message`, `stack`, `source`) |
| `setSessionInfo(info)` | Merge `info` into the session-info panel and refresh the export |
| `clear([section])` | Clear a section: `'logs'` \| `'requests'` \| `'errors'`, or `'all'` (default) |
| `show()` / `hide()` / `toggle([force])` | Control the sheet. `toggle(true)` opens, `toggle(false)` closes |
| `copyReport()` | Copy the text report to the clipboard. Returns a `Promise<boolean>` |
| `downloadReport([filename])` | Download the report as a `.txt` file (default `'diagnostics-report.txt'`) |
| `getReportText()` | Return the full text report as a string |
| `getReportData()` | Return the report as an object (`title`, `appName`, `session`, `counts`, and capped `logs`/`requests`/`errors` arrays) |
| `destroy()` | Unsubscribe global hooks, restore the host padding and remove the DOM |

```js
diagnostics.log('warn', 'Token about to expire', 'expires in 2 min');
diagnostics.log('error', 'Could not save', { code: 500 });
diagnostics.addRequest({
  method:     'POST',
  url:        '/api/v1/save',
  status:     200,
  ok:         true,
  durationMs: 42
});
diagnostics.downloadReport('diagnostics-2026-07-02.txt');
```

---

## i18n

The panel localizes its chrome (dock counts, tab labels, buttons, empty states and JSON-drawer titles) through the global i18n API under the namespace `MTS.DiagnosticsPanel`. Set the language once at startup:

```js
MTS.setLanguage('en');   // 'es' | 'en' | 'pt'
```

- `MTS.setLanguage(key)` sets the active language for every MTS component.
- `MTS.getLanguage()` returns the active key (default `'es'`).
- `MTS.getString()['MTS.DiagnosticsPanel']` is the string table the panel reads.

Load `base/matios-ui-i18n.js` and `matios-ui-diagnosticspanel-i18n.js` before the component. Built-in languages are `es`, `en` and `pt`; a missing key falls back to `es`. There is no per-instance `locale` option — the language is global and read at build time, so change it before constructing the panel (or rebuild after switching).

---

## Notes

- When mounted on `document.body`, the panel injects a fixed dock bar and reserves bottom padding on the host so it does not cover page content; `destroy()` restores it.
- `captureFetch: true` patches the global `window.fetch`, and `captureConsole` / `captureWindowErrors` patch `console` and the global error handlers — use only in development/demo environments.
- Single public instance per host; the internal views toggle via the `show*` flags — there are no separate subcomponents to instantiate.
- The report text (`getReportText` / `downloadReport`) is a stable plain-text export format and is not localized.

---

## Accessibility

- The panel is a developer/QA tool; keep it out of production builds or behind a flag so it does not interfere with the app's accessibility tree for end users.
