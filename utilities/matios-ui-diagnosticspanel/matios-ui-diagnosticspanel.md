# MTS.DiagnosticsPanel

Consola integrada de diagnostico para demos, QA, soporte y revisiones con cliente.

## Para que sirve

- capturar actividad manual desde la app
- interceptar requests `fetch`
- escuchar errores globales de `window`
- exportar un reporte en texto
- dejar una consola inferior integrada, tipo barra de soporte

## Dependencias

- `base/matios-ui-base.css`
- `forms/matios-ui-button/matios-ui-button.css`
- `forms/matios-ui-button/matios-ui-button.js`
- `layout/matios-ui-splitter/matios-ui-splitter.css`
- `navigation/matios-ui-drawer/matios-ui-drawer.css`
- `navigation/matios-ui-drawer/matios-ui-drawer.js`
- `navigation/matios-ui-tabs/matios-ui-tabs.css`
- `navigation/matios-ui-tabs/matios-ui-tabs.js`
- `utilities/matios-ui-jsonviewer/matios-ui-jsonviewer.css`
- `utilities/matios-ui-jsonviewer/matios-ui-jsonviewer.js`
- `utilities/matios-ui-diagnosticspanel/matios-ui-diagnosticspanel.css`
- `utilities/matios-ui-diagnosticspanel/matios-ui-diagnosticspanel.js`

## Uso basico

```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="../../forms/matios-ui-button/matios-ui-button.css">
<link rel="stylesheet" href="../../layout/matios-ui-splitter/matios-ui-splitter.css">
<link rel="stylesheet" href="../../navigation/matios-ui-drawer/matios-ui-drawer.css">
<link rel="stylesheet" href="../../navigation/matios-ui-tabs/matios-ui-tabs.css">
<link rel="stylesheet" href="../matios-ui-jsonviewer/matios-ui-jsonviewer.css">
<link rel="stylesheet" href="./matios-ui-diagnosticspanel.css">

<script src="../../forms/matios-ui-button/matios-ui-button.js"></script>
<script src="../../navigation/matios-ui-drawer/matios-ui-drawer.js"></script>
<script src="../../navigation/matios-ui-tabs/matios-ui-tabs.js"></script>
<script src="../matios-ui-jsonviewer/matios-ui-jsonviewer.js"></script>
<script src="./matios-ui-diagnosticspanel.js"></script>
```

```javascript
const diagnostics = new MTS.DiagnosticsPanel(document.body, {
  appName: 'Calendar V2 demo',
  collapsed: true,
  showLogViewer: true,
  showRequestInspector: true,
  showErrorViewer: true,
  showSessionInfo: true,
  showExport: true,
  showJsonViewer: true,
  captureConsole: true,
  captureWindowErrors: true,
  captureFetch: true
});

diagnostics.log('info', 'Aplicacion lista');
diagnostics.setSessionInfo({
  user: 'demo@matios.dev',
  screen: '/calendar'
});
```

## API publica

- `log(type, message, detail?, meta?)`
- `addRequest(record)`
- `addError(record)`
- `setSessionInfo(info)`
- `clear(section?)`
- `show()`
- `hide()`
- `toggle(force?)`
- `copyReport()`
- `downloadReport(filename?)`
- `getReportText()`

## Flags principales

- `showLogViewer`
- `showRequestInspector`
- `showErrorViewer`
- `showSessionInfo`
- `showExport`
- `showJsonViewer`
- `captureConsole`
- `captureWindowErrors`
- `captureFetch`
- `collapsed`
- `height`
- `maxEntries`

## Nota

La idea es que exista una sola componente publica y que las vistas internas se prendan o apaguen por propiedades, sin exponer subcomponentes aparte.
