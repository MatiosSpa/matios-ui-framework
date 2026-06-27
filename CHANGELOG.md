# Changelog

All notable changes to **Matios UI Framework** are documented here. The framework is versioned as a single unit;
individual components are not versioned separately — each component's `.md` keeps its own dated changelog.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

_Nothing yet._

## [1.0.0] — 2026-06-26

First public release.

### Tooling & distribution
- **npm package** (`@matios/ui`) with `dist/` bundles built by esbuild: global/UMD (`matios-ui.min.js`), ESM
  (`matios-ui.esm.mjs`) and a single CSS bundle (`matios-ui.min.css`). CDN-ready via jsDelivr / unpkg. The source stays a
  zero-dependency, no-build `window.MTS` set — the bundles are an additive distribution channel.
- **TypeScript declarations** (`dist/matios-ui.d.ts`, UMD) generated from source: 150 members typed (component classes
  with options + methods, utilities, i18n).
- **Smoke test + CI** (`test/smoke.js`, GitHub Actions): every component script is loaded in a browser-like stub and
  asserted to initialize cleanly. Zero runtime dependencies.
- Browser baseline pinned to **ES2020** (modern evergreen browsers — see README "Browser support").

### Added
- `LICENSE` (MIT), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, this root `CHANGELOG.md` and `RELEASING.md` — open-source
  scaffolding. `README.es.md` — Spanish entry page (component docs themselves are English single-language).
- `MTS.DocumentManagerPlugin`: `showFileExtensionColor` (color the file icon by type — PDF/Word/Excel/… — off by default,
  theme-aware) and `iconSize`.
- `MTS.Card`: opt-in `radius` / `border` (modifiers + `setRadius` / `setBorder`), without changing defaults.
- `MTS.Menu`: **Priority+ Navigation** — `overflow: "auto"` collapses horizontal items that don't fit into a "More"
  dropdown, recalculated on resize (`ResizeObserver`). New `overflowLabel` / `overflowIcon` options and a localized `more`
  key (es/en/pt).
- Portuguese (`pt`) locale across every component (DataTable + plugins + DocumentManager included).

### Changed
- **Documentation normalized to English, single-language**, one canonical template per component (Installation · Usage ·
  Options · API · Events · CSS Variables · Accessibility · Changelog). Counts corrected (308 icons, 85+ components).
- **`var` → `let` across the codebase** — 0 declaration-site `var` outside demos.
- Badges flattened (removed the colored glow `box-shadow`). `file-pdf` icon now uses an "A" (Acrobat) mark, consistent
  with the other file-type icons (Word "W", PowerPoint "P", …).
- `MTS.Spinner` docs reconciled with the implementation (default variant `ring`; 13 variants).

### Fixed
- DocumentManager: preview title icon built as DOM nodes (was escaped text); notes panel no longer shifts when adding a
  note; bigger file icons (16 → 20px) and a flat version badge.
- `MTS.Kanban`: Mode B (cards supplied separately with `colId`) no longer crashes when a column ends up with no cards.
- `MTS.DataTable`: the empty state applies `fixedHeaderHeight`, so the layout no longer collapses between data / no-data.
- `MTS.DatePicker.*`: mounted on a `<div>` it renders a `<label>` and a visible input (consistent with `MTS.Input` /
  `MTS.Select`); mounting on an existing `<input>` still works.
- TDZ regression from the `var` → `let` sweep (`let MTS = MTS || {}` self-reference) fixed to `window.MTS = window.MTS || {}`.

---

[Unreleased]: https://github.com/MatiosSpa/matios-ui-framework/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/MatiosSpa/matios-ui-framework/releases/tag/v1.0.0

> Earlier internal history is tracked under `internal-docs/matios_framework/changelog/`.
