# MTS Utilities

Utilidades transversales — infraestructura de app que no pertenece a forms, navigation ni overlays.

---

## Componentes

| Componente | Descripción |
|------------|-------------|
| `MTS.Browser` | Navegador web embebido con historial y controles |
| `MTS.CodeBlock` | Bloque de código con highlight, líneas y copy |
| `MTS.DevPanel` | Panel de desarrollo flotante para debug en runtime |
| `MTS.DiagnosticsPanel` | Panel de diagnóstico del sistema y del entorno |
| `MTS.HttpClient` | Cliente HTTP visual — request builder, headers y response |
| `MTS.JsonViewer` | Visualizador de JSON con colapso de nodos y búsqueda |
| `MTS.SessionTimeout` | Timeout de sesión — barra fija + modal de advertencia con countdown |

---

## MTS.SessionTimeout

Ver documentación completa en [`matios-ui-sessiontimeout/matios-ui-sessiontimeout.md`](matios-ui-sessiontimeout/matios-ui-sessiontimeout.md).

```js
new MTS.SessionTimeout({
  timeoutMinutes: 30,
  warningMinutes: 5,
  messages: {
    title:      'Tu sesión está por vencer',
    body:       'Por inactividad, tu sesión se cerrará en {time}.',
    warning:    'Si tenés trabajo sin guardar, podrías perderlo.',
    btnRefresh: 'Renovar sesión',
    btnExpire:  'Cerrar sesión',
  },
  onRefresh: function(done) { renovarToken(); done(); },
  onExpire:  function()     { logout(); },
});
```
