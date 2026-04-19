# Matios UI

**Matios UI** is a zero-dependency UI framework for modern web applications built with **plain CSS and JavaScript**.

It is designed to be:
- **framework-agnostic**
- **themeable via CSS variables**
- **easy to inspect and extend**
- **usable directly from static HTML**
- **consistent across demos, docs, and real apps**

Matios UI includes:
- **60+ components**
- **278 SVG icons**
- **mode + accent theming**
- **high-contrast support**
- **live component demos**
- **component-level documentation**
- **real showcase pages and app shells**

---

## Why Matios UI

Most UI libraries are tied to a framework, overloaded with dependencies, or hard to customize.

Matios UI takes a different approach:

- **No external runtime dependencies**
- **Pure CSS + JS**
- **Same design language across the whole framework**
- **Simple folder structure**
- **Each component ships with its own CSS, JS, docs, and demo**
- **Easy to use in legacy apps, server-rendered apps, static sites, or custom platforms**

---

## Features

- **Zero dependencies**
- **Mode-based theming**
  - `dark`
  - `light`
  - `high-contrast`
- **Accent layer**
  - `violet`
  - `olive`
  - `blue`
- **Reusable demo shell**
- **Per-component documentation**
- **Component grouping by domain**
- **Accessible visual direction**
- **Responsive-friendly layout tools**
- **Built-in HTTP client helper**
- **calendar and full calendar demos**
- **Consistent naming and structure across the framework**

---

## Quick Start

Open `index.html` in your browser to explore the framework.

```text
matios-ui-framework/
├─ index.html
├─ base/
├─ forms/
├─ navigation/
├─ overlays/
├─ display/
├─ layout/
├─ data/
├─ icons/
├─ shared/
├─ themes/
├─ calendar/
├─ /
└─ apps-showcase/
```

### Minimal usage

```html
<link rel="stylesheet" href="base/matios-ui-base.css">

<link rel="stylesheet" href="themes/matios-ui-mode-dark.css">
<link rel="stylesheet" href="themes/matios-ui-accent-violet.css">

<link rel="stylesheet" href="forms/matios-ui-input/matios-ui-input.css">
<script src="forms/matios-ui-input/matios-ui-input.js"></script>

<div id="nameInput"></div>

<script>
  new MTS.Input('#nameInput', {
    label: 'Name',
    placeholder: 'Enter your name'
  });
</script>
```

---

## Theming

Matios UI uses a **mode + accent** model.

### Modes

```html
<html data-mts-mode="dark">
<html data-mts-mode="light">
<html data-mts-mode="high-contrast">
```

### Accents

```html
<html data-mts-mode="dark" data-mts-accent="violet">
<html data-mts-mode="light" data-mts-accent="olive">
<html data-mts-mode="dark" data-mts-accent="blue">
```

### High Contrast

`high-contrast` is a full mode on its own.

```html
<html data-mts-mode="high-contrast">
```

It does **not require an accent** to work correctly.

If an integrator decides to combine high contrast with an accent, that is possible at application level, but the framework treats **high-contrast as a complete standalone mode**.

### Theme CSS files

```html
<link rel="stylesheet" href="themes/matios-ui-mode-dark.css">
<link rel="stylesheet" href="themes/matios-ui-mode-light.css">
<link rel="stylesheet" href="themes/matios-ui-mode-high-contrast.css">

<link rel="stylesheet" href="themes/matios-ui-accent-violet.css">
<link rel="stylesheet" href="themes/matios-ui-accent-olive.css">
<link rel="stylesheet" href="themes/matios-ui-accent-blue.css">
```

---

## Project Structure

Every component follows the same structure:

```text
matios-ui-xxx/
├─ matios-ui-xxx.css
├─ matios-ui-xxx.js
├─ matios-ui-xxx.md
└─ demo.html
```

This makes the framework:
- easy to learn
- easy to debug
- easy to maintain
- easy to extend

---

## Component Groups

### Forms
Inputs and form helpers such as:
- Button
- Input
- Select
- Checkbox
- Radio
- Toggle
- Slider
- TagInput
- Rating
- Date Picker
- File Upload
- Validation
- Number Input
- Phone Input
- Color Picker
- Rich Text Editor
- FormLayout
- Copy Button
- Confirm Button
- Label

### Navigation
Navigation and interaction patterns such as:
- Tabs
- Accordion
- Breadcrumb
- Stepper
- Drawer
- Dropdown
- Pagination
- Command Palette
- Context Menu
- SideNav
- TabBar
- ScrollSpy
- Intersection Reveal

### Overlays
Transient feedback and layered UI:
- Alert
- Badge
- Tooltip
- Modal
- Popover
- Toast
- Progress
- Skeleton
- Spinner
- Lightbox

### Display
Presentation-focused components:
- Avatar
- Card
- KPI Card
- Empty State
- Timeline
- Kanban
- Sortable List
- Countdown
- Rating Review
- Tree
- Image Gallery
- Virtual List
- Splitter

### Layout
Structural page composition:
- Grid
- ScrollSpy
- Intersection Reveal
- Splitter

### Data
Data visualization and data-heavy UI:
- Table
- Infinite scroll utilities
- additional data-oriented demos and helpers

### Shared
Cross-cutting helpers:
- HttpClient
- internal demo/shared support

### Icons
Built-in SVG icon system:
- **278 icons**
- outline / filled support
- semantic coloring
- size variants
- easy usage in components and demos

Example:

```html
<i class="mts-icon mts-icon-trash"></i>
<i class="mts-icon mts-icon-trash mts-icon--filled mts-icon--danger"></i>
<i class="mts-icon mts-icon-loader mts-icon--spin"></i>
```

### Themes
Dedicated theme demo and structure for:
- mode switching
- accent switching
- high contrast preview
- CSS variable inspection

### Calendars
Matios UI includes calendar-related work such as:
- calendar demos
- calendar implementation
- richer schedule-oriented UI examples

### Showcase
The framework also includes higher-level demo pages and showcase experiences to validate components in realistic layouts.

---

## Documentation Strategy

Matios UI is not just a component dump.

It follows a documentation pattern where each component includes:

- a **standalone demo**
- a **Markdown documentation file**
- real **HTML / JavaScript usage examples**
- a **consistent preview structure**

This makes the repo useful both as:
- a UI framework
- and a living reference library

---

## Design Principles

Matios UI is being shaped around these principles:

- **Use Matios components first**
- **Avoid fake demo-only UI when a real component already exists**
- **Keep visual consistency across demos**
- **Keep helpers minimal**
- **Respect the framework naming and grouping**
- **Prefer clarity over cleverness**
- **Keep the framework easy to inspect from source**

---

## Accessibility Direction

Matios UI includes a dedicated **high-contrast mode** and is moving toward stronger accessibility consistency through:

- visible focus states
- stronger contrast handling
- semantic colors
- clearer interactive states
- reusable theme variables

---

## Events and Integration

Components can emit events using the `mts:*` namespace pattern, making integration with external apps straightforward.

Example:

```javascript
document.getElementById('my-calendar')
  .addEventListener('mts:calendar:eventDrop', function (e) {
    console.log(e.detail);
  });
```

Because Matios UI is framework-agnostic, it can be integrated into:
- static HTML projects
- server-rendered apps
- legacy enterprise systems
- microfrontend environments
- custom JavaScript applications

---

## Current Status

Matios UI is already in a strong state:

- the framework structure is coherent
- demos are much more consistent
- mode/accent theming is consolidated
- high-contrast mode is integrated
- calendar  compatibility was restored in the v2 architecture
- the repo is approaching a very solid open-source baseline

This is no longer just a prototype.
It is a real framework with its own visual and technical identity.

---

## Recommended Entry Points

- `index.html` → main framework shell
- `themes/demo.html` → theming preview
- `icons/demo.html` → icon system
- group `demo.html` files → grouped component navigation
- per-component `demo.html` files → isolated usage examples

---

## License / Usage

Use it, inspect it, adapt it, and build on top of it.

Matios UI is being built to be practical, understandable, and genuinely reusable.

---

**Matios UI**  
Zero-dependency UI framework.  
Pure CSS. Pure JavaScript. Real structure.
