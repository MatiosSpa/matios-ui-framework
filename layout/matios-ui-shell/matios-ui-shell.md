# MTS.Shell

Application layout orchestrator. Applies CSS Grid to the root element and distributes the slots (Topbar, SideNav, main, StatusBar) based on which components are present. It does not move or create elements — it only adds classes.

---

## Installation

```html
<link rel="stylesheet" href="layout/matios-ui-shell/matios-ui-shell.css">
<script src="layout/matios-ui-shell/matios-ui-shell.js"></script>
```

---

## Usage

```html
<div id="mainTopbar"></div>
<nav id="sideNav"></nav>
<div id="mainContent"></div>
<div id="mainStatusBar"></div>
```

```js
const topbar    = new MTS.Topbar('#mainTopbar', { /* … */ });
const sidenav   = new MTS.SideNav('#sideNav', { /* … */ });
const statusbar = new MTS.StatusBar('#mainStatusBar', { /* … */ });

new MTS.Shell(document.body, {
  topbar:    topbar,
  sidenav:   sidenav,
  statusbar: statusbar,
  main:      '#mainContent',
});
```

> **Important:** initialize `MTS.Topbar`, `MTS.SideNav` and `MTS.StatusBar` **before** `MTS.Shell`. Shell uses
> `classList.add()` (additive), while those components use `className =` (replacement); if Shell runs first, the slot
> classes are lost.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `topbar` | `MTS.Topbar \| string \| Element` | `null` | Topbar instance, selector or Element |
| `sidenav` | `MTS.SideNav \| string \| Element` | `null` | SideNav instance, selector or Element |
| `statusbar` | `MTS.StatusBar \| string \| Element` | `null` | StatusBar instance, selector or Element |
| `main` | `string \| Element` | `null` | Selector or Element of the main content area |
| `height` | `string` | `'100vh'` | Total shell height (e.g. `'100dvh'`, `'800px'`) |

All slots are optional — Shell applies the correct grid template based on which slots are present.

---

## API

| Method | Description |
|--------|-------------|
| `setMain(content)` | Replace the `main` slot content (HTML string, `Element`, or `null` to clear). Masterpage pattern: the shell persists, only the inside changes |
| `getSlot(name)` | Returns the slot `Element` — `'topbar'` · `'sidenav'` · `'main'` · `'statusbar'` |
| `destroy()` | Remove the classes Shell added (does not destroy the child components) |

---

## Slot combinations

Shell detects which slots are present and applies the matching grid template:

```
Only main:           main
Topbar + main:       topbar / main
Side + main:         sidenav | main
Top + Side + main:   topbar  topbar
                     sidenav main
Top + Side + Status: topbar  topbar
                     sidenav main
                     sidenav status
```

---

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--mts-shell-height` | `100vh` | Total shell height (set via the `height` option) |

---

## Notes

- Shell only adds classes — it does not move or recreate DOM elements.
- The `main` slot gets `overflow: hidden` by default; add `mts-shell__main--scroll` for the main to scroll on its own.
- `setMain()` sanitizes HTML strings with `MTS.Sanitize` when available.

---

## Accessibility

- Compose with real landmarks (`<nav>` for the sidenav, `<main>` for content) so the shell exposes proper structure.

---

## Changelog

### 2026-05-13
- Documentation created.
