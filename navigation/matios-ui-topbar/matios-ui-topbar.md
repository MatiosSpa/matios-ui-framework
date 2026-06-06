# MTS.Topbar

Top bar for dashboards and apps — brand with logo, configurable content slots, and natural composition with `MTS.SideNav`.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-topbar.css">
<script src="matios-ui-topbar.js"></script>
```

---

## Usage

```html
<div id="my-topbar"></div>
```

```js
new MTS.Topbar('#my-topbar', {
  brand: {
    logo:    '<img src="logo.svg" width="28" height="28">',
    title:   'My App',
    onClick: function () { router.push('/'); },
  },
  end: '<button class="mts-btn mts-btn--secondary mts-btn--sm">Profile</button>',
});
```

### CSS only (no JS)

```html
<header class="mts-topbar">
  <div class="mts-topbar__brand">
    <div class="mts-topbar__logo"><img src="logo.svg" width="28" height="28"></div>
    <div class="mts-topbar__brand-info">
      <div class="mts-topbar__title">My App</div>
      <div class="mts-topbar__subtitle">v1.0.0</div>
    </div>
  </div>
  <div class="mts-topbar__spacer"></div>
  <div class="mts-topbar__end">
    <button class="mts-btn mts-btn--secondary mts-btn--sm">Profile</button>
  </div>
</header>
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `brand` | `object` | `null` | `{ logo, title, subtitle, href, onClick }` |
| `brand.logo` | `string` | — | Logo HTML (image, gradient div, etc.) |
| `brand.title` | `string` | — | App name — accepts HTML (e.g. to color a span) |
| `brand.subtitle` | `string` | — | Tagline or version below the title |
| `brand.href` | `string` | — | If provided, the brand renders as an `<a>` |
| `brand.onClick` | `function` | — | Brand click handler |
| `start` | `string \| Element` | `null` | Left slot (between brand and spacer) |
| `center` | `string \| Element` | `null` | Center slot — replaces the spacer |
| `end` | `string \| Element` | `null` | Right slot |
| `height` | `string` | `null` | Override `--mts-topbar-height` (e.g. `'50px'`) |
| `sticky` | `boolean` | `false` | `position:sticky; top:0` |
| `shadow` | `boolean` | `true` | Bottom box-shadow |
| `border` | `boolean` | `true` | Bottom border |

---

## API

| Method | Description |
|--------|-------------|
| `setBrand(brand)` | Update the brand and rebuild |
| `setStart(content)` | Update the start slot (HTML or Element) |
| `setEnd(content)` | Update the end slot (HTML or Element) |
| `setCenter(content)` | Update the center slot (triggers rebuild) |
| `getSlot(name)` | Return the slot Element: `'brand'`, `'start'`, `'center'`, `'spacer'`, `'end'` |
| `destroy()` | Remove the component and restore the DOM |

```js
const tb = new MTS.Topbar('#el', { brand: { title: 'App' } });
tb.setEnd('<button>Profile</button>');
// getSlot returns the Element, so MTS components can be injected directly:
new MTS.Button(tb.getSlot('end'), { label: 'Profile' });
```

---

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--mts-topbar-height` | `52px` | Bar height |
| `--mts-topbar-bg` | `var(--mts-bg-surface)` | Background color |
| `--mts-topbar-border-color` | `var(--mts-border-color)` | Bottom border and divider color |
| `--mts-topbar-shadow` | `0 1px 4px rgba(0,0,0,.07)` | Bottom shadow |
| `--mts-topbar-padding` | `0 var(--mts-space-4)` | Horizontal padding |
| `--mts-topbar-gap` | `var(--mts-space-3)` | Gap between sections |

---

## Layout with SideNav

The standard dashboard composition — topbar on top + sidenav on the left, using framework layout utilities
(no inline styles):

```html
<div class="mts-vh-100 mts-d-flex mts-flex-col">
  <div id="topbar"></div>
  <div class="mts-d-flex mts-flex-1 mts-overflow-hidden">
    <div id="sidenav"></div>
    <main class="mts-flex-1"><!-- content (scrollable) --></main>
  </div>
</div>
```

```js
new MTS.Topbar('#topbar', { brand: { logo: '...', title: 'My Dashboard' } });
new MTS.SideNav('#sidenav', { items: [/* … */], onChange: function (e) { navigate(e.detail.id); } });
```

---

## Notes

- The `selector` element becomes `.mts-topbar` directly — no extra wrapper is created.
- A divider `<span class="mts-topbar__divider"></span>` can be placed inside any slot to separate action groups.
- For `sticky`, the parent needs `height:100vh` (or similar) for sticky positioning to work.

---

## Changelog

### Initial
- Top bar with brand (logo/title/subtitle/href/onClick), start/center/end slots, sticky/shadow/border options,
  CSS-only usage, `--mts-topbar-*` variables, and `setBrand` / `setStart` / `setEnd` / `setCenter` / `getSlot`.
