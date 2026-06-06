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

### Changed
- **Documentation normalized to English, single-language**, with one canonical template per component
  (Installation · Usage · Options · API · Events · CSS Variables · Accessibility · Changelog). Root `README.md`
  component lists corrected (e.g. `RichEditor`, `Validate`; removed non-existent `Shell`/`StatusBar`; added Boards).
- `MTS.Spinner` docs reconciled with the implementation (default variant `ring`; 13 variants).

### Fixed
- DocumentManager preview: the title icon rendered as escaped text — now built as DOM nodes.

---

> Earlier internal history is tracked under `internal-docs/matios_framework/changelog/`.
