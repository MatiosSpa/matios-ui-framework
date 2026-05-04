# Utilities

🇬🇧 Cross-cutting framework utilities. These are not visual components per se — they provide services, debug tools, sanitization and flow control that other components and applications consume.
🇪🇸 Utilidades transversales del framework. No son componentes visuales per se — proveen servicios, herramientas de debug, sanitización y control de flujo que otros componentes y aplicaciones consumen.

---

## Components / Componentes

| Componente | Clase JS | 🇬🇧 Description / 🇪🇸 Descripción |
|---|---|---|
| `matios-ui-browser` | `MTS.Browser` | 🇬🇧 Universal browser API — device info, storage, clipboard, geolocation, network, media query and more. / 🇪🇸 API universal de browser — device info, storage, clipboard, geolocation, network, media query y más. |
| `matios-ui-codeblock` | `MTS.CodeBlock` | 🇬🇧 Syntax highlighting for snippets in demos and documentation. Theme support and clipboard copy. / 🇪🇸 Syntax highlighting para snippets en demos y documentación. Soporte de temas y copia al portapapeles. |
| `matios-ui-devpanel` | `MTS.DevPanel` | 🇬🇧 Lightweight development panel for state inspection during development. / 🇪🇸 Panel de desarrollo liviano para inspección de estado durante el desarrollo. |
| `matios-ui-diagnosticspanel` | `MTS.DiagnosticsPanel` | 🇬🇧 Integrated bottom console for logs, requests, errors, session info and diagnostic export inside a real app. / 🇪🇸 Consola integrada inferior para logs, requests, errores, sesión y export de diagnóstico dentro de una app real. |
| `matios-ui-httpclient` | `MTS.HttpClient` | 🇬🇧 HTTP client with consistent contract, timeout, retry, interceptors, upload and download. No dependencies. / 🇪🇸 HTTP client con contrato consistente, timeout, retry, interceptores, upload y download. Sin dependencias. |
| `matios-ui-jsonviewer` | `MTS.JsonViewer` | 🇬🇧 JSON payload viewer with formatting, node folding, search and copy. / 🇪🇸 Visor de payloads JSON con formato, plegado de nodos, búsqueda y copia. |
| `matios-ui-pageloader` | `MTS.PageLoader` | 🇬🇧 NProgress-style page load indicator — fixed bar with automatic progress and programmatic control. / 🇪🇸 Indicador de carga de página estilo NProgress — barra fija con avance automático y control programático. |
| `matios-ui-sanitize` | `MTS.Sanitize` | 🇬🇧 HTML escaping and sanitization for XSS prevention. No external dependencies. / 🇪🇸 Escape y sanitización HTML para prevención de XSS. Sin dependencias externas. |
| `matios-ui-sessiontimeout` | `MTS.SessionTimeout` | 🇬🇧 Session timeout management by inactivity — fixed progress bar, configurable warning and expiration callback. / 🇪🇸 Gestión de timeout de sesión por inactividad — barra de progreso fija, advertencia configurable y callback de expiración. |

---

## Notes / Notas

- 🇬🇧 `MTS.DiagnosticsPanel` and `MTS.DevPanel` are development tools — do not include in production builds. / 🇪🇸 `MTS.DiagnosticsPanel` y `MTS.DevPanel` son herramientas de desarrollo — no incluir en builds de producción.
- 🇬🇧 `MTS.Sanitize` must be used whenever dynamic HTML from untrusted sources is inserted into the DOM. / 🇪🇸 `MTS.Sanitize` debe usarse siempre que se inserte HTML dinámico en el DOM desde fuentes no confiables.
- 🇬🇧 `MTS.HttpClient` exposes an optional global instance (`MTS.Http`) for centralized use without per-module configuration. / 🇪🇸 `MTS.HttpClient` expone una instancia global opcional (`MTS.Http`) para uso centralizado sin configuración por módulo.
- 🇬🇧 `MTS.JsonViewer` integrates with `MTS.DiagnosticsPanel` for the response inspection panel. / 🇪🇸 `MTS.JsonViewer` se integra con `MTS.DiagnosticsPanel` para el panel de inspección de responses.
