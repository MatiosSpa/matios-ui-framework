# MTS.ScrollSpy

Detects the visible section while scrolling and highlights the matching link in the nav. Uses `IntersectionObserver` internally — no polling.

---

## Installation

```html
<link rel="stylesheet" href="layout/matios-ui-scrollspy/matios-ui-scrollspy.css">
<script src="layout/matios-ui-scrollspy/matios-ui-scrollspy.js"></script>
```

---

## Usage

```html
<nav id="my-nav" class="mts-spy-nav mts-spy-nav--indicator">
  <a href="#intro">Introduction</a>
  <a href="#install">Installation</a>
  <a href="#usage">Usage</a>
</nav>

<section id="intro">...</section>
<section id="install">...</section>
<section id="usage">...</section>
```

```js
new MTS.ScrollSpy({
  sections:        '#intro, #install, #usage',
  nav:             '#my-nav',
  scrollContainer: '#my-scroll-panel',
  offset:          80,
  onChange: function (info) { console.log('active section:', info.id); },
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sections` | `string \| Array` | — | CSS selector(s) of the sections to observe |
| `nav` | `string` | `null` | Selector of the navigation container |
| `scrollContainer` | `string \| Element` | `window` | Scroll container when it is not the window |
| `linkAttr` | `string` | `'href'` | Link attribute that holds the section id |
| `offset` | `number` | `80` | Offset from the top (px) for the activation point |
| `activeClass` | `string` | `'active'` | CSS class applied to the active link |
| `onChange` | `function` | `null` | `({ id, section, link })` — fires when the active section changes |

---

## API

| Method | Description |
|--------|-------------|
| `destroy()` | Disconnect the observer and clear listeners |

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onChange` | `{ id, section, link }` | The active section changes |

---

## Notes

- The nav applies `activeClass` to the link whose `href` matches the visible section id.
- For scroll inside a panel (not the window), pass `scrollContainer` with the panel selector.
- `mts-spy-nav--indicator` adds an animated side line to the active link.

---

## Accessibility

- Mark the current link with `aria-current="true"` in addition to the visual `activeClass` so assistive tech tracks
  the active section.

---

## Changelog

### 2026-05-13
- Documentation homologated to the standard template.
