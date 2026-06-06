# Contributing to Matios UI Framework

Thanks for your interest in contributing! Matios UI is a zero-dependency, no-build framework of pure CSS + JavaScript.
These guidelines keep every component consistent and easy to maintain.

## Getting started

1. Clone the repository.
2. Open `index.html` (or any `demo.html`) directly in a browser, or serve the folder with any static server
   (e.g. a Live Server extension). **There is no build step.**
3. Make your change and verify it in the relevant `demo.html`.

## Project structure

Every component is self-contained:

```
matios-ui-xxx/
├── matios-ui-xxx.css      # styles (BEM: .mts-xxx, .mts-xxx__el, .mts-xxx--mod)
├── matios-ui-xxx.js       # window.MTS.Xxx
├── matios-ui-xxx.md       # documentation (see template below)
└── demo.html              # runnable demo
```

Components are grouped under `forms/`, `navigation/`, `overlays/`, `display/`, `layout/`, `data/`, `utilities/`,
`widgets/`, plus `base/`, `icons/` and `themes/`.

## Coding conventions

- **Zero dependencies, no build.** Plain ES5/ES6 JavaScript and CSS only.
- **Namespace.** All public classes live under `window.MTS` (e.g. `MTS.Input`).
- **Design tokens only.** Use the `--mts-*` CSS variables from `base/` — no magic colors, sizes, or shadows.
- **No satellite CSS / no inline styles.** Style through component CSS and the framework utility classes; do not add
  ad-hoc `<style>` blocks or inline `style="..."` in components or demos. (Dynamic, data-driven values set from JS —
  e.g. a user-picked color or a progress width — are the documented exception.)
- **No native fallbacks where a component exists.** Use `MTS.Modal`/`MTS.Toast`/etc. instead of `alert()`/native UI.
- **English method names.**
- **Theming.** Support the mode + accent model (`data-mts-mode`, `data-mts-accent`) and high-contrast.
- **Events.** Emit DOM events under the `mts:*` namespace; expose an `onXxxx` callback API (see `MTS._defineEvents`).
- **Lifecycle.** Provide a `destroy()` that removes listeners and DOM.
- **Accessibility.** Keyboard operability, real semantics/ARIA where applicable, accessible names for icon-only controls.
- **i18n.** Components that show text read from a locale (`base/matios-ui-i18n.js` + a per-component `{component}-i18n.js`),
  never hard-coded strings.

## Documentation

Public docs are **English, single-language**. Each component `.md` follows this template (in order):

```
# MTS.Component
One-line description.

## Installation
## Usage
## Options
## API
## Events
## CSS Variables   (or CSS Classes, when the component's API is class-based)
## Accessibility
## Changelog        (by date — components are not versioned individually)
```

A Spanish entry page exists at [`README.es.md`](./README.es.md); component docs themselves stay in English.

## Pull requests

- Keep changes focused and self-contained.
- Update the component's `.md` (Options/API/Events/Changelog) when behavior changes.
- Verify the component's `demo.html` still works.
- Be kind and follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
