# Matios UI — v1.0.3

Documentation & i18n release. Every component's help `.md` was audited against its real source code, the demos were aligned with the real API, hard-coded chrome was wired to the global i18n system, and a dead legacy file was removed. No breaking changes to component behavior.

---

## Documentation audit (all components)

Every help `.md` was rewritten **from the code** — options, methods, events, enums and defaults now match exactly what each component actually exposes. Invented options and stale claims were removed; the terse per-file `Changelog` sections were dropped (the canonical history lives in `CHANGELOG.md`).

- **Real API, not aspirational** — e.g. documented `MTS.MenuButton` and `MTS.SplitButton` (shipped but undocumented), corrected the `MTS.CopyButton` `onCopy` payload to `{ type, detail: { text } }`, and reframed `MTS.ConfirmButton`'s `onConfirm` / `onCancel` as constructor callbacks.
- **`MTS.DatePicker`** — documented the modular design (`.Base` + the `Date` / `Time` / `DateTime` / `DateRange` / `Month` / `Week` plugins).

---

## Internationalization

Hard-coded Spanish chrome across several components was moved into the global i18n table, with an English fallback when the i18n script is not loaded.

- Wired to i18n: button `Actions`, label `optional`, copybutton `Copy` / `Copied!`, confirmbutton `Delete` / `Confirm?` / `No`, and more.
- **Validation** rule messages are now internal to the component (`es` / `en` / `pt`), selected by the active language; override per rule with `message`.
- Language is driven by a single global switch:

```js
MTS.setLanguage('en'); // 'es' | 'en' | 'pt'
```

---

## Theming docs corrected

The base documentation described a `data-mts-theme` attribute that does not exist. It now documents the real system:

| Attribute | Purpose |
|-----------|---------|
| `data-mts-mode` | Full visual base — `dark`, `light`, `high-contrast`, `midnight`, `obsidian`, `forest`, `abyss`, `ember`, `dune` |
| `data-mts-accent` | Optional accent family — `violet`, `navy`, `emerald`, `blue`, and more |

```html
<html data-mts-mode="dark" data-mts-accent="violet">
```

---

## Demo fixes

Demos are now verified against the real API, so the copy-paste examples work as shown.

- **Tooltip** — the `initAll()` demo used `data-tooltip*` attributes, but `MTS.Tooltip.initAll()` reads `data-mts-tooltip*`; the tooltips never initialized. Fixed.
- **Modal** — `MTS.Modal.confirm()` takes `confirmLabel` / `cancelLabel` / `variant`; the demo passed `confirm` / `cancel` / `danger`, which were silently ignored. Fixed.
- **FormLayout** — the demo's JavaScript tab now rebuilds the same form with the DOM API and `MTS.Input` / `MTS.Button`, instead of a placeholder comment.

---

## Cleanup

- Removed the dead pre-modular `matios-ui-date-picker.js` monolith. It had zero references and, when bundled, its `MTS.DatePicker = class` overwrote the modular namespace — so the published bundle exposed a different `MTS.DatePicker` than the source. Removing it aligns the bundle with the demos.

---

> The framework is versioned as a single unit. See `CHANGELOG.md` for the full, running history across every release.
