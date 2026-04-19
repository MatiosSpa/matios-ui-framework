# MTS.FormLayout v2

Safe evolution of `MTS.FormLayout`.

`v2` is **not only the grid**. The 12-column grid is the backbone, but the component also includes:

- `.mts-form-grid`
- `.mts-form-row`
- `.mts-form-col-12`
- `.mts-form-col-6`
- `.mts-form-col-4`
- `.mts-form-horizontal`
- `.mts-form-inline`
- `.mts-form-actions`
- `.mts-form-section`
- `.mts-form-card`

---

## Installation

```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="../matios-ui-input/matios-ui-input.css">
<link rel="stylesheet" href="../matios-ui-button/matios-ui-button.css">
<link rel="stylesheet" href="./matios-ui-formlayout-v2.css">
```

---

## Main classes

| Class | Purpose |
|---|---|
| `.mts-form-v2` | Main form wrapper |
| `.mts-form-grid` | 12-column grid |
| `.mts-form-row` | Nested row inside the grid |
| `.mts-form-col-12` | Full width field |
| `.mts-form-col-6` | Half width field |
| `.mts-form-col-4` | One-third width field |
| `.mts-form-horizontal` | Label on the left, field on the right |
| `.mts-form-inline` | Compact filters / quick search layout |
| `.mts-form-actions` | Action row |
| `.mts-form-section` | Section block with spacing and divider |
| `.mts-form-card` | Card wrapper for full form surfaces |

---

## Example — horizontal

```html
<form class="mts-form-v2 mts-form-horizontal" onsubmit="return false">
  <div class="mts-form-group">
    <label class="mts-form-label mts-form-label--required">Email</label>
    <input class="mts-input" type="email" placeholder="user@example.com">
    <span class="mts-form-hint">We will use this email to notify the user.</span>
  </div>
</form>
```

## Example — inline filters

```html
<form class="mts-form-v2 mts-form-inline" onsubmit="return false">
  <div class="mts-form-group mts-form-inline__field mts-form-inline__field--grow">
    <label class="mts-form-label mts-form-label--hidden">Search</label>
    <input class="mts-input" placeholder="Search by name or email">
  </div>

  <div class="mts-form-group mts-form-inline__field">
    <label class="mts-form-label mts-form-label--hidden">Status</label>
    <input class="mts-input" placeholder="All statuses">
  </div>

  <div class="mts-form-actions mts-form-inline__actions">
    <button class="mts-btn mts-btn--ghost" type="button">Clear</button>
    <button class="mts-btn mts-btn--primary" type="submit">Search</button>
  </div>
</form>
```

## Example — form card

```html
<div class="mts-form-card">
  <div class="mts-form-card__header">
    <h2 class="mts-form-card__title">Create workspace</h2>
    <p class="mts-form-card__subtitle">Basic information for the new workspace.</p>
  </div>

  <form class="mts-form-v2">...</form>
</div>
```

---

## Notes

- `matios-ui-formlayout` remains the stable/legacy version.
- `matios-ui-formlayout-v2` is the safe place for improvements.
- `v2` is broader than the grid. The grid is only one part of the layout system.
