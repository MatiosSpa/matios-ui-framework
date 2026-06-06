<p align="center">
  <img src="./logos/Matios-UI-logo-768w.png" alt="Matios UI Framework" width="420"/>
</p>

<h1 align="center">Matios UI Framework</h1>

<p align="center">
  Framework de UI sin dependencias, hecho con CSS y JavaScript puros.<br>
  Theming por modo + acento &nbsp;·&nbsp; Soporte de alto contraste &nbsp;·&nbsp; 80+ componentes &nbsp;·&nbsp; 278 íconos
</p>

<p align="center">
  <a href="./README.md">English</a> &nbsp;·&nbsp; <a href="./LICENSE">MIT</a>
</p>

---

> **Nota de idioma.** La documentación completa del framework (este README en inglés y los `.md` de cada componente)
> está en **inglés**, el estándar de la comunidad open source. Esta página es la **puerta de entrada en español**.
> La interfaz de los componentes sí es multi-idioma en runtime (es/en/pt).

---

## Por qué Matios UI

La mayoría de las librerías de UI están atadas a un framework, sobrecargadas de dependencias, o son difíciles de
adaptar a proyectos reales. Matios UI toma otro camino:

| | |
|---|---|
| **Cero dependencias** | CSS puro + JavaScript plano — sin paso de build |
| **Agnóstico de framework** | Funciona en sitios estáticos, apps server-rendered, sistemas legacy y microfrontends |
| **Componentes autónomos** | Cada componente trae su propio `.css`, `.js`, doc `.md` y `demo.html` |
| **Theming real** | Modelo modo + acento con soporte completo de alto contraste |
| **Fácil de inspeccionar** | Código abierto y legible — sin bundles minificados |

---

## Inicio rápido

Abre `index.html` en tu navegador para explorar la librería completa de componentes.

```html
<!-- Base + tema -->
<link rel="stylesheet" href="base/matios-ui-base.css">
<link rel="stylesheet" href="themes/matios-ui-mode-dark.css">
<link rel="stylesheet" href="themes/matios-ui-accent-violet.css">

<!-- Componente -->
<link rel="stylesheet" href="forms/matios-ui-input/matios-ui-input.css">
<script src="forms/matios-ui-input/matios-ui-input.js"></script>

<div id="mi-input"></div>
<script>
  new MTS.Input('#mi-input', { label: 'Nombre', placeholder: 'Ingresa tu nombre' });
</script>
```

---

## Theming

Matios UI usa un modelo **modo + acento** controlado por atributos HTML:

```html
<html data-mts-mode="light">
<html data-mts-mode="dark" data-mts-accent="violet">
<html data-mts-mode="high-contrast">
```

Acentos disponibles: `violet` · `olive` · `blue` · `corporate` · `navy` · `emerald` · `petrol`.
`high-contrast` es un modo independiente — no requiere acento.

---

## Grupos de componentes

- **Forms** — Button, Input, Select, Checkbox, Radio, Toggle, Slider, TagInput, Rating, DatePicker, FileUpload, NumberInput, PhoneInput, ColorPicker, RichEditor, FormLayout, FormGuard, CopyButton, ConfirmButton, Label, PasswordStrength, TransferList, Validate
- **Navigation** — Tabs, Accordion, Breadcrumb, Stepper, Drawer, Dropdown, PanelDropdown, Pagination, CommandPalette, ContextMenu, SideNav, TabBar, Topbar, Menu
- **Overlays** — Alert, Badge, Tooltip, Modal, Popover, Toast, Progress, Skeleton, Spinner, Lightbox
- **Display** — Avatar, Card, KPICard, EmptyState, Timeline, SortableList, Countdown, RatingReview, Tree, ImageGallery, VirtualList, MarkdownViewer
- **Layout** — Grid, Scroll, Splitter, ScrollSpy, IntersectionReveal
- **Data** — Table (CSS), DataTable (widget)
- **Utilities** — HttpClient, CodeBlock, DevPanel, DiagnosticsPanel, JsonViewer, SessionTimeout, PageLoader, Sanitize, Browser
- **Widgets** — DataTable (+ plugins), Calendar, Boards (Gantt · Kanban · SprintBoard)
- **Icons** — 278 íconos (outline/filled, colores semánticos, tamaños, animación spin)

---

## Documentación

Cada componente tiene su `.md` (Installation · Usage · Options · API · Events · CSS Variables · Accessibility ·
Changelog) junto a su `.css`/`.js`/`demo.html`. Los docs detallados están en inglés; el `README.md` raíz es el
punto de entrada principal.

## Contribuir

Ver [`CONTRIBUTING.md`](./CONTRIBUTING.md) y el [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

## Licencia

[MIT](./LICENSE) © Matios SpA.

---

<p align="center">
  <strong>Matios UI Framework</strong><br>
  CSS puro &nbsp;·&nbsp; JavaScript puro &nbsp;·&nbsp; Estructura real.
</p>
