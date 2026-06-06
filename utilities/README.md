# Utilities

Cross-cutting framework utilities. These are not visual components — they provide services, debug tools, sanitization and flow control that other components and applications consume.

---

## Modules

| Module | JS class | Description |
|--------|----------|-------------|
| `matios-ui-browser` | `MTS.Browser` | Universal browser API — geolocation, clipboard, notifications, network, battery, fullscreen, storage and more. |
| `matios-ui-codeblock` | `MTS.CodeBlock` | Code blocks with syntax highlighting and copy-to-clipboard. |
| `matios-ui-devpanel` | `MTS.DevPanel` | Lightweight development panel for runtime state inspection and component config. |
| `matios-ui-diagnosticspanel` | `MTS.DiagnosticsPanel` | Built-in bottom console for logs, requests, errors, session info and diagnostics export. |
| `matios-ui-httpclient` | `MTS.HttpClient` | HTTP client with a consistent contract, timeout, retry, interceptors, upload and download. |
| `matios-ui-jsonviewer` | `MTS.JsonViewer` | JSON payload viewer with formatting, node collapsing and copy. |
| `matios-ui-pageloader` | `MTS.PageLoader` | NProgress-style page loader — fixed bar with automatic trickle and programmatic control. |
| `matios-ui-sanitize` | `MTS.Sanitize` | HTML escaping and sanitization for XSS prevention. No external dependencies. |
| `matios-ui-sessiontimeout` | `MTS.SessionTimeout` | Inactivity session-timeout management — fixed bar, configurable warning modal and expiry callback. |

---

## Notes

- `MTS.DiagnosticsPanel` and `MTS.DevPanel` are development tools — do not include them in production builds.
- Use `MTS.Sanitize` whenever inserting dynamic HTML into the DOM from untrusted sources.
- `MTS.HttpClient` exposes an optional global instance via `MTS.HttpClient.create()` for centralized use without per-module config.
- `MTS.JsonViewer` integrates with `MTS.DiagnosticsPanel` for the response inspection panel.

> For detailed documentation of each module, see its individual `.md` file.
