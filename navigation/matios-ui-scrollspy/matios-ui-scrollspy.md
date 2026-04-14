# MTS.ScrollSpy

[EN] Highlights the navigation link corresponding to the currently visible section as the user scrolls.
[ES] Resalta el link de navegación correspondiente a la sección visible mientras el usuario hace scroll.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<script src="matios-ui-scrollspy.js"></script>
```

---

## Options / Opciones

[EN] `MTS.ScrollSpy` takes no selector — it observes the page scroll globally.
[ES] `MTS.ScrollSpy` no recibe selector — observa el scroll de la página globalmente.

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `sections` | `string\|string[]` | `[]` | [EN] CSS selector(s) for content sections / [ES] Selector(es) CSS de las secciones |
| `nav` | `string` | — | [EN] Navigation container selector / [ES] Selector del contenedor de navegación |
| `linkAttr` | `string` | `'href'` | [EN] Link attribute containing the section ID / [ES] Atributo del link con el ID de sección |
| `offset` | `number` | `80` | [EN] Scroll offset in px from top / [ES] Offset en px desde el top |
| `activeClass` | `string` | `'active'` | [EN] CSS class applied to the active link / [ES] Clase CSS aplicada al link activo |
| `onChange` | `function` | — | [EN] Fires when active section changes / [ES] Se dispara al cambiar la sección activa |

---

## Events / Eventos

```js
new MTS.ScrollSpy({
  sections: '.section',
  nav:      '#page-nav',
  // Fires when active section changes / Se dispara al cambiar la sección activa
  onChange: (e) => {
    console.log(e.detail.id);      // → 'introduction'
    console.log(e.detail.section); // → HTMLElement
    console.log(e.detail.link);    // → HTMLElement | null
  },
});
```

---

## HTML Usage / Uso HTML

```html
<!-- Navigation / Navegación -->
<nav id="page-nav">
  <a href="#intro">Introduction</a>
  <a href="#features">Features</a>
  <a href="#install">Installation</a>
  <a href="#api">API</a>
</nav>

<!-- Content sections / Secciones de contenido -->
<section id="intro">...</section>
<section id="features">...</section>
<section id="install">...</section>
<section id="api">...</section>

<script>
  new MTS.ScrollSpy({
    sections:    'section',
    nav:         '#page-nav',
    activeClass: 'active',
    offset:      80,
    onChange: (e) =&gt; console.log('active:', e.detail.id),
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic / Básico
const spy = new MTS.ScrollSpy({
  // Section selector / Selector de secciones
  sections:    'section[id]',

  // Nav container / Contenedor de navegación
  nav:         '#sidebar-nav',

  // Offset to account for fixed header / Offset para el header fijo
  offset:      64,

  // CSS class for the active nav link / Clase CSS para el link activo
  activeClass: 'nav-active',

  // Fires on section change / Se dispara al cambiar la sección
  onChange: (e) => {
    console.log('active section:', e.detail.id);
    updateBreadcrumb(e.detail.id);
  },
});

// Multiple section selectors / Múltiples selectores de sección
new MTS.ScrollSpy({
  sections: ['.docs-section', '.api-section'],
  nav:      '#docs-nav',
  onChange: (e) => console.log(e.detail.id),
});

// Custom link attribute / Atributo de link personalizado
new MTS.ScrollSpy({
  sections:  '.section',
  nav:       '#nav',
  linkAttr:  'data-section',  // <a data-section="intro">
  onChange:  (e) => console.log(e.detail.id),
});
```

---

## API

```js
const spy = new MTS.ScrollSpy({ ... });

// Register / remove listeners / Registrar / eliminar listeners
spy.on('change', (e) => console.log(e.detail.id))
spy.off('change', handler)

// Stop observing / Dejar de observar
spy.destroy()
```

---

## DOM Event / Evento DOM

```js
document.getElementById('page-nav')
  .addEventListener('mts:scrollspy:change', (e) => {
    console.log(e.detail.id);      // → active section id
    console.log(e.detail.section); // → HTMLElement
    console.log(e.detail.link);    // → active nav link | null
  });
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Normalized to `.on()` pattern, bilingual docs / [ES] Normalizado al patrón `.on()`, docs bilingüe |
| 1.0.0 | [EN] Initial release / [ES] Versión inicial |
