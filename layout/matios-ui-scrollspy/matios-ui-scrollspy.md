# MTS.ScrollSpy

Highlights the nav link of the section currently in view. Listens to the `scroll` event of the window (or a scroll container) and toggles the active class on the matching nav link.

---

## Installation

```html
<link rel="stylesheet" href="layout/matios-ui-scrollspy/matios-ui-scrollspy.css">
<script src="layout/matios-ui-scrollspy/matios-ui-scrollspy.js"></script>
```

Optional, only if you localize the demo strings:

```html
<script src="base/matios-ui-i18n.js"></script>
<script src="layout/matios-ui-scrollspy/matios-ui-scrollspy-i18n.js"></script>
```

---

## Usage

```html
<nav id="spy-nav" class="mts-spy-nav mts-spy-nav--indicator">
  <a href="#s-intro">Introduction</a>
  <a href="#s-install">Installation</a>
  <a href="#s-uso">Basic usage</a>
  <a href="#s-api">API</a>
  <a href="#s-eventos">Events</a>
</nav>

<div id="spy-scroll">
  <section id="s-intro">...</section>
  <section id="s-install">...</section>
  <section id="s-uso">...</section>
  <section id="s-api">...</section>
  <section id="s-eventos">...</section>
</div>
```

```js
new MTS.ScrollSpy({
  sections: '#s-intro, #s-install, #s-uso, #s-api, #s-eventos',
  nav: '#spy-nav',
  scrollContainer: '#spy-scroll',
  offset: 24,
  onChange: function (info) {
    console.log('active section:', info.id);
  },
});
```

The constructor takes a single options object. There is no element/selector first argument.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sections` | `string \| Array` | `[]` | CSS selector, or array of selectors, of the sections to track |
| `nav` | `string` | `null` | Selector of the navigation container whose links get the active class |
| `scrollContainer` | `string \| Element` | `window` | Scroll container when scrolling does not happen on the window |
| `linkAttr` | `string` | `'href'` | Nav link attribute that holds the section id (matched as `#id`) |
| `offset` | `number` | `80` | Offset from the top (px) of the activation line |
| `activeClass` | `string` | `'active'` | CSS class applied to the active nav link |
| `onChange` | `function` | `null` | `function (info) { }` — receives `{ id, section, link }` when the active section changes |

Notes on behavior:

- `sections` is resolved with `querySelectorAll`; a single string is treated as one selector (commas inside it select multiple elements).
- If no section is under the activation line, the last section whose top has been passed becomes active; if none, the first section is used.
- A section is matched to a nav link when the link's `linkAttr` value equals `#` + the section `id`.

---

## API

| Method | Description |
|--------|-------------|
| `destroy()` | Removes the `scroll` listener from the scroll container |

There is no `refresh()`, `getConfig()`, or `getCode()` method.

---

## Events

| Callback / Event | Payload | When |
|------------------|---------|------|
| `onChange` | `{ id, section, link }` | The active section changes |
| `mts:scrollspy:change` | `detail: { id, section, link }` | Dispatched on the `nav` element (bubbles) when the active section changes; only fired if `nav` is set |

`id` is the section id (string), `section` is the active section element (or `null`), and `link` is the matching nav link element (or `null`).

---

## Notes

- The nav applies `activeClass` to the link whose `linkAttr` matches the visible section id.
- For scroll inside a panel (not the window), pass `scrollContainer` with the panel selector.
- `mts-spy-nav--indicator` adds an animated side line to the active link.

---

## Accessibility

- Mark the current link with `aria-current="true"` in addition to the visual `activeClass` so assistive tech tracks the active section.

---

## i18n

- The component reads no runtime chrome from i18n: nav text and section content are supplied by the developer, so there is nothing to localize inside the component itself.
- `matios-ui-scrollspy-i18n.js` registers the `MTS.ScrollSpy` namespace only for the demo strings (`es` / `en` / `pt`, default `es`), read via `MTS.getString()['MTS.ScrollSpy'].demo`.
- Set the language once at startup with `MTS.setLanguage('es' | 'en' | 'pt')`. There is no per-instance `locale` option and no `getMessages` / `setLocale` / `getLocale`.
