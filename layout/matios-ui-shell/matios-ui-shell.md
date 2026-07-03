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
<!-- Shell does not create elements — it works on the ones that already exist. -->
<div id="app">
  <div id="topbar"></div>
  <div id="sidenav"></div>
  <div id="main"></div>
  <div id="statusbar"></div>
</div>
```

```js
// 1. Initialize the components on their own elements first.
const topbar    = new MTS.Topbar('#topbar', { /* … */ });
const sidenav   = new MTS.SideNav('#sidenav', { /* … */ });
const statusbar = new MTS.StatusBar('#statusbar', { /* … */ });

// 2. Shell joins them — accepts any combination of the three.
new MTS.Shell('#app', {
  topbar:    topbar,
  sidenav:   sidenav,
  statusbar: statusbar,
  main:      '#main',
});
```

Each slot reference accepts an MTS instance, a string selector, or an `Element`. Shell adds
`mts-shell` (plus `mts-shell--top` / `mts-shell--side` / `mts-shell--status` for the present slots)
to the root, and `mts-shell__topbar` / `mts-shell__sidenav` / `mts-shell__main` /
`mts-shell__statusbar` to each child.

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
| `height` | `string` | `null` | Total shell height (e.g. `'100dvh'`, `'800px'`). When omitted, the shell inherits the CSS default `--mts-shell-height: 100vh` |

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

## i18n

Shell renders **no chrome text of its own** — it only applies CSS classes to the elements you pass in, so there is
nothing for it to translate. Any user-facing copy (menu labels, brand title, status text) comes from the components
mounted into the slots (`MTS.Topbar`, `MTS.SideNav`, `MTS.StatusBar`), which localize themselves via the global
language API.

Set the language once at startup with the global API — there is no per-instance `locale` option and no
`getMessages` / `setLocale` / `getLocale`:

```js
MTS.setLanguage('es'); // 'es' | 'en' | 'pt'
```

The `MTS.Shell` i18n namespace (in `matios-ui-shell-i18n.js`) contains only strings for this demo page
(`MTS.getString()['MTS.Shell'].demo.*`); it is not consumed by the component itself.
