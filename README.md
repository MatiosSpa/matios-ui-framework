<p align="center">
  <img src="./logos/Matios-UI-logo-768w.png" alt="Matios UI Framework" width="420"/>
</p>

<h1 align="center">Matios UI Framework</h1>

<p align="center">
  Zero-dependency UI framework built with pure CSS and JavaScript.<br>
  Mode + accent theming &nbsp;·&nbsp; High-contrast support &nbsp;·&nbsp; 60+ components &nbsp;·&nbsp; 278 icons
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
`Button` · `Input` · `Select` · `Checkbox` · `Radio` · `Toggle` · `Slider` · `TagInput` · `Rating` · `DatePicker` · `FileUpload` · `NumberInput` · `PhoneInput` · `ColorPicker` · `RichTextEditor` · `FormLayout` · `CopyButton` · `ConfirmButton` · `Label` · `PasswordStrength` · `Validation`

### Navigation
`Tabs` · `Accordion` · `Breadcrumb` · `Stepper` · `Drawer` · `Dropdown` · `Pagination` · `CommandPalette` · `ContextMenu` · `SideNav` · `TabBar` · `Topbar` · `StatusBar` · `Menu` · `ScrollSpy` · `IntersectionReveal`

### Overlays
`Alert` · `Badge` · `Tooltip` · `Modal` · `Popover` · `Toast` · `Progress` · `Skeleton` · `Spinner` · `Lightbox`

### Display
`Avatar` · `Card` · `KPICard` · `EmptyState` · `Timeline` · `Kanban` · `SortableList` · `Countdown` · `RatingReview` · `Tree` · `ImageGallery` · `VirtualList` · `Splitter`

### Layout
`Grid` · `Shell` · `Scroll` · `Splitter` · `ScrollSpy` · `IntersectionReveal`

### Data
`Table` · `DataTable` (widget)

### Utilities
`HttpClient` · `CodeBlock` · `DevPanel` · `DiagnosticsPanel` · `JsonViewer` · `SessionTimeout` · `PageLoader` · `Sanitize` · `Browser`

### Icons
**278 icons** — outline / filled · semantic color variants · size variants · spin animation

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
| **DataTable** | Full-featured data grid — sort, filter, pagination, plugins (DocumentManager, Toolbar, ColVis, ExpandRow, ContextMenu, Workflow, Filter) |
| **Dashboard** | Admin template — Shell + Topbar + SideNav + StatusBar + KPI Cards + DataTable + Cards + Timeline |
| **Calendar** | Month / week / day / schedule views with event management |

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

---

## Status

Matios UI is **production-ready** as a framework — coherent structure, consistent theming, full component coverage, and real documentation per component.

---

<p align="center">
  <strong>Matios UI Framework</strong><br>
  Pure CSS &nbsp;·&nbsp; Pure JavaScript &nbsp;·&nbsp; Real structure.
</p>
