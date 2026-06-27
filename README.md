<p align="center">
  <img src="./logos/Matios-UI-logo-768w.png" alt="Matios UI Framework" width="420"/>
</p>

<h1 align="center">Matios UI Framework</h1>

<p align="center">
  Zero-dependency UI framework built with pure CSS and JavaScript.<br>
  Mode + accent theming &nbsp;·&nbsp; High-contrast support &nbsp;·&nbsp; 85+ components &nbsp;·&nbsp; 308 icons
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/dependencies-0-brightgreen.svg" alt="Zero dependencies">
  <img src="https://img.shields.io/badge/build-none-lightgrey.svg" alt="No build step">
  &nbsp;·&nbsp; <a href="./README.es.md">Español</a>
</p>

---

## Why Matios UI

Most UI libraries are tied to a framework, overloaded with dependencies, or difficult to adapt to real projects.

Matios UI takes a different approach:

| | |
|---|---|
| **Zero dependencies** | Pure CSS + plain JavaScript — no build step required |
| **Framework-agnostic** | Works in static sites, server-rendered apps, legacy systems, and microfrontends |
| **Self-contained components** | Each component ships with its own `.css`, `.js`, `.md` docs, and `demo.html` |
| **Real theming** | Mode + accent model with full high-contrast support |
| **Easy to inspect** | Open, readable source — no minified bundles to reverse-engineer |

---

## Install

**CDN (no build, no install)** — the whole framework in two tags:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@matios/ui/dist/matios-ui.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@matios/ui/themes/matios-ui-accent-violet.css">
<script src="https://cdn.jsdelivr.net/npm/@matios/ui/dist/matios-ui.min.js"></script>
```

**npm** — for bundlers (Vite, webpack, etc.):

```bash
npm install @matios/ui
```

```js
import "@matios/ui";        // registers window.MTS (all components)
import "@matios/ui/css";    // base + component styles
import "@matios/ui/themes/matios-ui-accent-violet.css";

new MTS.Button("#btn", { label: "Hello", variant: "primary" });
```

**TypeScript** — type declarations ship with the package (`dist/matios-ui.d.ts`).
`MTS`, every component class and its options are typed out of the box, for both
`import MTS from "matios-ui"` and the global `window.MTS`.

> The `dist/` bundles and `.d.ts` are produced by `npm run build` (esbuild). The
> source stays a zero-dependency, no-build set of `window.MTS` scripts — you can
> also drop the individual component files in via `<script>`, exactly as below.
> Adding npm/CDN/types changed nothing about that.

---

## Quick Start

Open `index.html` in your browser to explore the full component library.

```
matios-ui-framework/
├── index.html
├── base/
├── forms/
├── navigation/
├── overlays/
├── display/
├── layout/
├── data/
├── icons/
├── utilities/
├── widgets/
├── themes/
├── support/
└── apps-showcase/
```

### Minimal Usage

```html
<!-- Base + theme -->
<link rel="stylesheet" href="base/matios-ui-base.css">
<link rel="stylesheet" href="themes/matios-ui-mode-dark.css">
<link rel="stylesheet" href="themes/matios-ui-accent-violet.css">

<!-- Component -->
<link rel="stylesheet" href="forms/matios-ui-input/matios-ui-input.css">
<script src="forms/matios-ui-input/matios-ui-input.js"></script>

<div id="my-input"></div>

<script>
  new MTS.Input('#my-input', {
    label: 'Name',
    placeholder: 'Enter your name'
  });
</script>
```

---

## Running locally

The framework has **no build step**, but the explorer and demos load files over HTTP (component docs, demos, mock data) — so serve the folder instead of opening files directly via `file://`.

**VS Code + Live Server (recommended)**

1. Install the **Live Server** extension by *Ritwick Dey* — [marketplace](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
2. Right-click `index.html` → **Open with Live Server**.
3. The browser opens at `http://127.0.0.1:5500` with live reload on save.

**Or any static server**

```bash
npx serve .
# or
python -m http.server 5500
```

---

## Theming

Matios UI uses a **mode + accent** model controlled by HTML attributes.

### Modes

```html
<html data-mts-mode="light">
<html data-mts-mode="dark">
<html data-mts-mode="high-contrast">
```

### Accents

```html
<html data-mts-mode="dark" data-mts-accent="violet">
<html data-mts-mode="light" data-mts-accent="blue">
```

Available accents: `violet` · `olive` · `blue` · `corporate` · `navy` · `emerald` · `petrol`

> `high-contrast` is a standalone mode — it does not require an accent.

---

## Component Groups

### Forms
`Button` · `Input` · `Select` · `Checkbox` · `Radio` · `Toggle` · `Slider` · `TagInput` · `Rating` · `DatePicker` · `FileUpload` · `NumberInput` · `PhoneInput` · `NationalId` · `ColorPicker` · `RichEditor` · `FormLayout` · `FormGuard` · `CopyButton` · `ConfirmButton` · `Label` · `PasswordStrength` · `TransferList` · `Validate`

### Navigation
`Tabs` · `Accordion` · `Breadcrumb` · `Stepper` · `StepProgress` · `Drawer` · `Dropdown` · `PanelDropdown` · `Pagination` · `CommandPalette` · `ContextMenu` · `SideNav` · `TabBar` · `Topbar` · `Menu`

### Overlays
`Alert` · `Badge` · `Tooltip` · `Modal` · `Popover` · `Toast` · `Progress` · `Skeleton` · `Spinner` · `Lightbox`

### Display
`Avatar` · `Card` · `KPICard` · `EmptyState` · `Timeline` · `SortableList` · `Countdown` · `RatingReview` · `Tree` · `ImageGallery` · `VirtualList` · `MarkdownViewer`

### Layout
`Grid` · `Scroll` · `Splitter` · `ScrollSpy` · `IntersectionReveal`

### Data
`Table` · `DataTable` (widget)

### Utilities
`HttpClient` · `CodeBlock` · `DevPanel` · `DiagnosticsPanel` · `JsonViewer` · `SessionTimeout` · `PageLoader` · `Sanitize` · `Browser`

### Icons
**308 icons** — outline / filled · semantic color variants · size variants · spin animation

```html
<i class="mts-icon mts-icon-trash"></i>
<i class="mts-icon mts-icon-trash mts-icon--filled mts-icon--danger"></i>
<i class="mts-icon mts-icon-loader mts-icon--spin"></i>
```

---

## Widgets

Higher-level components composed from primitives.

| Widget | Description |
|---|---|
| **DataTable** | Full-featured data grid — sort, filter, pagination, plugins (DocumentManager, Toolbar, ColumnVisibility, ExpandRow, Filter) |
| **Calendar** | Month / week / day / agenda views with event management, drag & drop and async datasource |
| **Boards** | `GanttChart` (SVG Gantt + WBS, baseline, undo/redo) · `Kanban` · `SprintBoard` — each with an FE↔BE contract doc |
| **Dashboard** | Admin template — _in development_ |

---

## Component Structure

Every component follows the same pattern:

```
matios-ui-xxx/
├── matios-ui-xxx.css
├── matios-ui-xxx.js
├── matios-ui-xxx.md
└── demo.html
```

---

## Apps Showcase

`apps-showcase/` contains complete, realistic UI screens built exclusively with Matios UI components.

**Groups available:**
- **Authentication** — login, forgot-password, reset-password, verify-email, workspace-selector, session-expired, access-denied, accept-invitation
- **Onboarding** — signup-basic, signup-with-company, invite-team, onboarding-complete
- **Account** — profile-overview, security-settings
- **Settings** — workspace-settings, security-policies
- **Support** — ticket-inbox, ticket-detail, ticket-resolution
- **Productivity** — task-board, calendar-planner, task-detail
- **Notifications** — notification-center, activity-feed
- **Admin** — members-list, member-detail, invite-member, access-review, role-detail
- **Billing** — current-plan, invoice-history, payment-methods, usage-and-limits, plan-change-preview
- **Developers** — api-keys, webhooks
- **Integrations** — integrations-hub, integration-detail, connect-provider, sync-history
- **Documents** — recent-files, file-preview, share-dialog
- **Search** — global-search, search-results
- **System** — error-404, error-403, error-500, maintenance-mode, empty-workspace

---

## Entry Points

| File | Purpose |
|---|---|
| `index.html` | Main framework explorer |
| `themes/demo.html` | Mode + accent theming preview |
| `icons/demo.html` | Full icon catalog |
| `apps-showcase/index.html` | Showcase screen catalog |
| `<group>/demo.html` | Grouped component navigation |
| `<component>/demo.html` | Isolated component demo |

---

## Events

Components emit events using the `mts:*` namespace:

```javascript
document.getElementById('my-calendar')
  .addEventListener('mts:calendar:eventDrop', function(e) {
    console.log(e.detail);
  });
```

---

## Design Principles

- Use Matios components first — avoid ad-hoc UI when a real component exists
- Each component is self-contained and independent
- Demos are consistent, realistic, and inspectable
- Source is readable — no build pipeline required
- Naming, grouping, and structure follow the same conventions throughout

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full coding conventions, rules, and development flow.

---

## Status

Matios UI is **production-ready** as a framework — coherent structure, consistent theming, full component coverage, and real documentation per component.

---

## Browser support

Modern evergreen browsers. The codebase targets **ES2020** (optional chaining `?.` and nullish `??`); it uses no newer
syntax or APIs, no transpiler and no polyfills.

| Browser | Minimum |
|---|---|
| Chrome / Edge | 80+ |
| Firefox | 78+ |
| Safari | 14+ |

Internet Explorer is not supported. The bundles published to npm (`dist/` — generated by `npm run build`, not committed to the repo) are pinned to this baseline via the esbuild target.

---

## Versioning

Matios UI follows [Semantic Versioning](https://semver.org/). The framework is versioned as a single unit (`MAJOR.MINOR.PATCH`);
component-level changes are tracked by date in each component's `.md`. See [`CHANGELOG.md`](./CHANGELOG.md) for releases
and [`RELEASING.md`](./RELEASING.md) for the release process.

---

## Documentation

- Every component has its own `.md` (Installation · Usage · Options · API · Events · CSS Variables · Accessibility · Changelog) next to its `.css`/`.js`/`demo.html`.
- Each component group has a `README.md` index listing its components.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) and the [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md). Issues and pull requests are welcome.

## License

[MIT](./LICENSE) © Matios SpA.

## 💛 Support

Matios UI is free and MIT-licensed. If it saves you time, you can support its ongoing development:

[![Support on Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20me-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/gcontrerasgomez)

<details>
<summary><strong>🪙 Donate with crypto</strong></summary>

<br>

| Network | Address |
|---|---|
| **Ethereum / EVM** (ETH, USDC, …) | `0x5ea6F302Fb8a9865540FfCC42F7264c996532dC3` |
| **Bitcoin** (native SegWit) | `bc1qv43are3facy6lyuzp5qpdqpt8x7tcz2cx3aspe` |
| **Solana** (SOL, SPL) | `BYtfMGEoxBLf5DMPoLyebUJpEh1hW9jGEvjiaEiuRmjw` |
| **TRON** (USDT-TRC20) | `TFHuJKpPNZcdEPsfCknDpvY6CzQbpWYGUv` |

</details>

Every contribution helps keep the project maintained — thank you 🙏

## Español

¿Prefieres español? Lee la [guía de inicio en español](./README.es.md).

---

<p align="center">
  <strong>Matios UI Framework</strong><br>
  Pure CSS &nbsp;·&nbsp; Pure JavaScript &nbsp;·&nbsp; Real structure.
</p>
