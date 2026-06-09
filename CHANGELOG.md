# Changelog

All notable changes to **Matios UI Framework** are documented here. The framework is versioned as a single unit;
individual components are not versioned separately — each component's `.md` keeps its own dated changelog.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- `LICENSE` (MIT), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md` and this root `CHANGELOG.md` — open-source scaffolding for
  the public release.
- `README.es.md` — Spanish entry page (the component docs themselves are English single-language).
- `MTS.Card`: opt-in `radius` / `border` (modifiers + `setRadius` / `setBorder`), without changing defaults.
- `MTS.Menu`: **Priority+ Navigation** — `overflow: "auto"` collapses horizontal items that don't fit into a "More"
  dropdown, recalculated on container resize (`ResizeObserver`). New `overflowLabel` / `overflowIcon` options and a
  localized `more` key (es/en/pt).
- Portuguese (`pt`) locale added to the base i18n catalog for every component (DataTable + plugins + DocumentManager\*) —
  previously only `es` / `en`.

### Changed
- **Documentation normalized to English, single-language**, with one canonical template per component
  (Installation · Usage · Options · API · Events · CSS Variables · Accessibility · Changelog). Root `README.md`
  component lists corrected (e.g. `RichEditor`, `Validate`; removed non-existent `Shell`/`StatusBar`; added Boards).
- `MTS.Spinner` docs reconciled with the implementation (default variant `ring`; 13 variants).

### Fixed
- DocumentManager preview: the title icon rendered as escaped text — now built as DOM nodes.
- `MTS.Kanban`: Mode B (cards supplied separately with `colId`) no longer crashes when a column ends up with no cards.
- `MTS.DataTable`: the empty state now applies `fixedHeaderHeight`, so the layout no longer collapses/jumps between the
  data and no-data states.
- `MTS.DatePicker.*`: when mounted on a `<div>` with the canonical API, it now renders a `<label>` and a visible input
  (consistent with `MTS.Input` / `MTS.Select`); mounting on an existing `<input>` still works.

---

> Earlier internal history is tracked under `internal-docs/matios_framework/changelog/`.
