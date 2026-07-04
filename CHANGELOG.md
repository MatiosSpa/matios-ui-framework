# Changelog

All notable changes to **Matios UI Framework** are documented here. The framework is versioned as a single unit;
individual components are not versioned separately — each component's `.md` keeps its own dated changelog.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

_Nothing yet._

## [1.0.3] — 2026-07-05

Global language API and rename (`registerLocale`→`registerLanguage`, aliased), theming and component hardening
(tooltip dark variant, revived `data-mts-mode` overrides), more forgiving icon inputs, and the data-loading
override pattern finished across the data components. Fully backward compatible — patch.

Data-loading components standardized around the same override pattern: they `fetch` internally by default, but every
request is overridable via a dev-provided async function (you own the transport — native `fetch`, `MTS.HttpClient`,
auth, interceptors). The built-in `{ url }` paths now honor the headers and params you configure.

### Added
- **DataTable `{ url }` dataSource** now merges `ds.params` (fixed query params) with the live paging/sort/search query
  — previously `params` was documented but ignored. The live query wins on key clashes.
- **FilterPlugin async `optionsSource`** now accepts `method` (`'GET'` default / `'POST'`/…), `params` (extra query
  params) and `headers` (e.g. `Authorization`) on its internal fetch: `optionsSource: { url, method?, valueField,
  labelField, limit?, params?, headers? }`. GET sends `params`/`search`/`limit` in the query string; non-GET in the JSON body.
- **Calendar enums** (values are plain strings — non-breaking): `MTS.Calendar.VIEW` / `MTS.Calendar.VIEWS_ALL` and
  `MTS.CalendarUI.ACTION` — typo-safe alternatives to the `'week'` / `'create'` magic strings.
- **`MTS.CalendarUI.commit(action, event)`** — public method to trigger the persistence funnel (`onEvent`) and paint the
  grid from your own button/modal, reusing the same path as the built-in modals and drag/resize.
- **Calendar `pt` locale** — built-in Brazilian Portuguese; `locale` is now `'es'` · `'en'` · `'pt'`.
- **i18n language API** — `MTS.setLanguage(code)` sets the global language, `MTS.getLanguage()` returns the active code
  (defaults to `'es'`), and `MTS.getString()` returns the active language's string table (`MTS.getString()['MTS.X']`).
  One `MTS.setLanguage()` at startup drives every component — there is no per-instance `locale` option.
- **DatePicker `linkRange` now works with time** — the Time picker honors `minDate`/`maxDate` (out-of-range hours/minutes
  are shown disabled instead of removed), so `linkRange(start, end)` also constrains a start/end **time** pair: on the same
  day the end must be at least the start hour + 1; across days the time is unconstrained.
- **Icons accept both forms** — `MTS.Icon.get()` / `render()` and the `icon:` config of `MTS.Menu` / `MTS.PanelDropdown`
  (and `MTS.SideNav` / `MTS.Topbar`, which use `MTS.Menu`) accept either the plain name (`'trash'`) or the CSS-class form
  (`'mts-icon-trash'`) — the `mts-icon-` prefix is stripped when present.

### Changed
- **i18n registration renamed** — `MTS.registerLocale`→`MTS.registerLanguage` and `MTS.Locales`→`MTS.Languages`
  (plus `MTS.DataTable`/`MTS.Calendar` registration). The old names stay as **aliases** — non-breaking.
- **Language is global-only** — components read the active language solely from `MTS.getLanguage()`. The per-instance
  `locale` option was removed from `MTS.DataTable`, `MTS.Calendar` and `MTS.CalendarUI` (they previously defaulted to
  `'es'` and ignored a global `MTS.setLanguage()`). Change the language once, at startup.
- **Calendar**: `dataSource` (camelCase) is now the canonical loader option, aligned with `MTS.DataTable` and
  `MTS.GanttChart`. The legacy lowercase `datasource` still works as an **alias** (same for `dataSourceParser` /
  `dataSourceParams`). No breaking change — existing code keeps running.

### Fixed
- **DataTable / Gantt `{ url }` dataSource**: `Content-Type: application/json` is now added **only** for non-GET
  requests (which carry a body) and **only when the dev didn't set their own** — a plain GET no longer forces an
  unnecessary CORS preflight. Gantt additionally **clones** the `headers` object instead of mutating the dev's.
- **Calendar built-in delete** now calls `onEvent('delete', …)` before removing the event from the grid — previously it
  removed it visually but never notified the persistence layer, so deletions were never sent to the backend.
- **Inputs (`.mts-input` / `.mts-textarea`)**: browser autofill no longer paints a white/yellow background over the
  themed surface — masked with `-webkit-box-shadow … inset` + `-webkit-text-fill-color`, so autofilled fields keep the
  active theme's colors (fixes the white-background bug in dark mode).
- **Accordion**: releases its animated `max-height` to `none` after the open transition, so an open panel follows
  dynamically-resizing content (e.g. an auto-sizing iframe) instead of staying clamped to the height measured at open time.
- **Tooltip dark variant** now uses the inverse-surface tokens, so it renders opaque and legible on every mode (it was
  transparent on the dark modes). The declarative API reads `data-mts-tooltip-*` attributes, fixing a collision with the
  target's own `data-variant` (e.g. an `MTS.Button` used as the tooltip target).
- **Dead `data-mts-theme` overrides revived** — badge, progress, slider, fileupload, kanban and calendar had light/dark
  overrides keyed on the non-existent `data-mts-theme` (so they never applied); they now key on the real `data-mts-mode`
  (`light` is the only light mode — every other mode is dark).

### Docs
If you clone the repo, the live demos are the fastest way in — each one is copy-paste runnable and its **"View docs"**
button now opens the matching Markdown.
- **`MTS.DataTable` — per-plugin docs & examples**: each demo now ships its own `.md` (the base table **plus** the full
  plugin, built from the real plugin source and demo code) reachable from **"View docs"** — `ContextMenu`,
  `ColumnActions`, `Toolbar`, `Filter`, `ColumnVisibility`, `ExpandRow`, and the composite `DocumentManager` (rewritten
  inside-out: Upload · Workflow · Preview + Metadata/Notes/Versions/BasicInfo panels · ContextMenu, with the i18n namespaces).
- **`MTS.DataTableFilterPlugin`** example now shows two async `optionsSource` side by side — one `POST` and one `GET` —
  each carrying its own `headers`, so the new `method`/`headers` support is visible at a glance.
- **`MTS.Calendar` / `MTS.CalendarUI`** — full copy-paste example rewritten around the new enums, `commit(action, event)`
  and the `onEvent` persistence funnel.
- **`MTS.DataTable`** — consolidated to a single complete example, corrected against the real component API (the
  previously documented `onLoad` / `onError` / `{ page, size }` did not exist).

## [1.0.2] — 2026-06-29

Maintenance release. First version published via CI with **npm provenance** (cryptographically signed, verifiable
build origin). No code changes over 1.0.1.

### Added
- `bugs` (issues URL) and a generous `engines.node` floor in `package.json` (packaging metadata).

## [1.0.1] — 2026-06-29

Maintenance release — internal icon consolidation, polish and fixes. No public API changes; safe drop-in over 1.0.0.

### Added
- **8 new icons** in the `MTS.Icon` set: `indent`, `outdent`, `unlink`, `eraser`, `text-color`, `bg-color`
  (added while migrating the RichEditor toolbar), plus `git-branch` and `log-out`. Aliases for common Feather-style
  names: `loader`→spinner, `dollar-sign`→dollar, `help-circle`→help, `zap`→lightning, `cog`→settings. **316 icons** total.

### Changed
- **All component icons now resolve through `MTS.Icon`** (internal): inline SVG glyphs across ItemList, Select, Accordion,
  Menu, SideNav, Tree, Input, ColorPicker, Calendar, Toast, Alert, CopyButton, CommandPalette, Stepper, StepProgress,
  ImageGallery, Lightbox, NumberInput, SortableList, RichEditor and the DataTable DocumentManager preview were replaced
  by `MTS.Icon.get()`. Single source of truth; theme-reactive. (`MTS.Icon` ships in the bundle, so this is transparent
  for bundle/CDN consumers.) Decorative graphics and partial-fill rating stars stay as-is.
- **Themed scrollbar**, more distinguishable: applied globally (document + any scroll container) and in `MTS.Shell` —
  thin, token-driven (`--mts-border-color-strong` thumb over a faint `--mts-bg-surface-2` track, rounded "pill"),
  adapts to dark/light/accent instead of the default browser scrollbar.
- **`MTS.Shell`**: status bar now spans the full width at the bottom (sidenav tucks between topbar and status, mirroring
  the topbar); themed scrollbar for the sidenav/main scroll areas.

### Fixed
- **`MTS.Shell` sidenav** now scrolls on its own when its content exceeds the viewport (was clipped with no scrollbar).
- **`MTS.ItemList`** icons resolve via `MTS.Icon` (dropped a private registry + silent fallback to the wrong glyph).

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
