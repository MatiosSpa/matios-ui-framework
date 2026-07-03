# MTS.Icon

SVG icon library — 308 icons, outline + filled variants, 7 sizes, semantic colors. Zero dependencies, auto-initialized on DOM load.

---

## Installation

```html
<link rel="stylesheet" href="icons/matios-ui-icons.css">
<script src="icons/matios-ui-icons.js"></script>
```

---

## Usage

### CSS classes

Use `<i>` tags with `mts-icon` + `mts-icon-{name}`. Auto-initialized on `DOMContentLoaded`.

```html
<!-- Basic + filled -->
<i class="mts-icon mts-icon-trash"></i>
<i class="mts-icon mts-icon-trash mts-icon--filled"></i>

<!-- Sizes -->
<i class="mts-icon mts-icon-star mts-icon--xs"></i>   <!-- 12px -->
<i class="mts-icon mts-icon-star mts-icon--md"></i>   <!-- 18px (default) -->
<i class="mts-icon mts-icon-star mts-icon--3xl"></i>  <!-- 48px -->

<!-- Semantic colors -->
<i class="mts-icon mts-icon-check-circle mts-icon--success"></i>
<i class="mts-icon mts-icon-alert-circle mts-icon--warning"></i>
<i class="mts-icon mts-icon-x-circle     mts-icon--danger"></i>
<i class="mts-icon mts-icon-info         mts-icon--info"></i>
<i class="mts-icon mts-icon-star         mts-icon--primary"></i>
<i class="mts-icon mts-icon-moon         mts-icon--muted"></i>

<!-- In a button -->
<button class="mts-btn mts-btn--primary"><i class="mts-icon mts-icon-download mts-icon--sm"></i> Download</button>
```

---

## JavaScript API

| Method | Description |
|--------|-------------|
| `MTS.Icon.get(name[, filled])` | Returns the SVG string (`filled` for the filled variant) |
| `MTS.Icon.render(name, el[, filled])` | Inject the icon into an element |
| `MTS.Icon.list()` | List all icon names |
| `MTS.Icon.initAll([container])` | Re-initialize icons added dynamically (optionally scoped) |

```js
MTS.Icon.get('trash');                                  // → '<svg …>…</svg>'
MTS.Icon.get('mts-icon-trash');                         // same icon — the 'mts-icon-' prefix is accepted too
MTS.Icon.render('edit', document.getElementById('ic')); // inject
document.getElementById('my-icon').innerHTML = MTS.Icon.get('user');
```

`get()` (and `render()`) accept **either the plain name** (`'trash'`) **or the CSS-class form** (`'mts-icon-trash'`) — the `mts-icon-` prefix is stripped when present. The same applies to the `icon` config of `MTS.Menu` / `MTS.PanelDropdown` (and `MTS.SideNav` / `MTS.Topbar`, which use `MTS.Menu`): both `icon: 'user'` and `icon: 'mts-icon-user'` work.

---

## Sizes

| Class | Size |
|-------|------|
| `mts-icon--xs` | 12px |
| `mts-icon--sm` | 14px |
| `mts-icon--md` | 18px (default) |
| `mts-icon--lg` | 22px |
| `mts-icon--xl` | 28px |
| `mts-icon--2xl` | 36px |
| `mts-icon--3xl` | 48px |

---

## Categories

Action, Navigation, State, File, Communication, Data/Charts, Device, Editing/Text, Finance, People, Media, Time,
UI, Security and Layout — e.g. `search`, `home`, `check-circle`, `file-text`, `mail`, `bar-chart`, `monitor`,
`bold`, `dollar-sign`, `user`, `play`, `clock`, `eye`, `shield`, `columns`. Use `MTS.Icon.list()` for the full set.

---

## Accessibility

- Icons render as `<svg>` and are decorative by default; add `aria-label` (or adjacent text) when an icon conveys
  meaning on its own, or `aria-hidden="true"` when it merely decorates labeled content.
  (`get` / `render` / `list` / `initAll`), auto-init on DOM load.
