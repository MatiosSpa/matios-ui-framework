# MTS.Icon

[EN] SVG icon library — 278 icons, outline + filled variants, 7 sizes, semantic colors. Zero dependencies, auto-initialized on DOM load.
[ES] Librería de íconos SVG — 278 íconos, variantes outline + filled, 7 tamaños, colores semánticos. Cero dependencias, auto-inicializado al cargar el DOM.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="icons/matios-ui-icons.css">
<script src="icons/matios-ui-icons.js"></script>
```

---

## CSS Classes / Clases CSS

[EN] Use `<i>` tags with `mts-icon` + `mts-icon-{name}`. Auto-initialized on DOMContentLoaded.
[ES] Usa etiquetas `<i>` con `mts-icon` + `mts-icon-{name}`. Se auto-inicializa en DOMContentLoaded.

```html
<!-- Basic / Básico -->
<i class="mts-icon mts-icon-trash"></i>

<!-- Filled variant / Variante filled -->
<i class="mts-icon mts-icon-trash mts-icon--filled"></i>

<!-- Sizes / Tamaños -->
<i class="mts-icon mts-icon-star mts-icon--xs"></i>   <!-- 12px -->
<i class="mts-icon mts-icon-star mts-icon--sm"></i>   <!-- 14px -->
<i class="mts-icon mts-icon-star mts-icon--md"></i>   <!-- 18px (default) -->
<i class="mts-icon mts-icon-star mts-icon--lg"></i>   <!-- 22px -->
<i class="mts-icon mts-icon-star mts-icon--xl"></i>   <!-- 28px -->
<i class="mts-icon mts-icon-star mts-icon--2xl"></i>  <!-- 36px -->
<i class="mts-icon mts-icon-star mts-icon--3xl"></i>  <!-- 48px -->

<!-- Semantic colors / Colores semánticos -->
<i class="mts-icon mts-icon-check-circle mts-icon--success"></i>
<i class="mts-icon mts-icon-alert-circle mts-icon--warning"></i>
<i class="mts-icon mts-icon-x-circle     mts-icon--danger"></i>
<i class="mts-icon mts-icon-info         mts-icon--info"></i>
<i class="mts-icon mts-icon-star         mts-icon--primary"></i>
<i class="mts-icon mts-icon-moon         mts-icon--muted"></i>
```

---

## JavaScript API

```js
// Get SVG string / Obtener string SVG
MTS.Icon.get('trash')           // → '<svg ...>...</svg>'
MTS.Icon.get('trash', true)     // filled variant / variante filled

// Inject into element / Inyectar en elemento
MTS.Icon.render('edit', document.getElementById('my-icon'))
MTS.Icon.render('edit', el, true)   // filled

// List all icon names / Listar todos los nombres
MTS.Icon.list()   // → ['activity', 'add', 'alert', ...]

// Re-initialize icons added dynamically / Re-inicializar íconos dinámicos
MTS.Icon.initAll()
MTS.Icon.initAll(container)   // scope to container
```

---

## Usage Examples / Ejemplos de uso

```html
<!-- In a button / En un botón -->
<button class="mts-btn mts-btn--primary">
  <i class="mts-icon mts-icon-download mts-icon--sm"></i>
  Download
</button>

<!-- In a nav item / En ítem de navegación -->
<div class="nav-item">
  <i class="mts-icon mts-icon-home mts-icon--md"></i>
  Dashboard
</div>

<!-- Dynamic injection / Inyección dinámica -->
<script>
  document.getElementById('my-icon').innerHTML = MTS.Icon.get('user', 20);
</script>
```

---

## Categories / Categorías

| Category / Categoría | Examples / Ejemplos |
|---------------------|---------------------|
| Acción | search, filter, sort, add, trash, edit, save, download, upload, copy, share, refresh, undo, redo |
| Navegación | home, arrow-*, chevron-*, menu, sidebar, compass, map |
| Estado | check, check-circle, alert, alert-circle, info, x-circle, loader, spinner |
| Archivo | file, file-text, folder, folder-open, archive, paperclip, image |
| Comunicación | mail, message, bell, phone, video, wifi, rss |
| Datos / Charts | bar-chart, pie-chart, line-chart, activity, database, table, grid |
| Dispositivo | monitor, smartphone, tablet, cpu, hard-drive, printer, camera |
| Edición / Texto | bold, italic, underline, align-*, list, code, type |
| Finanzas | dollar-sign, credit-card, shopping-cart, tag, percent |
| Personas | user, users, user-plus, user-check |
| Media | play, pause, stop, volume, music, film, youtube |
| Tiempo | clock, calendar, sunrise, sunset, moon, sun |
| UI | eye, eye-off, lock, unlock, settings, sliders, toggle-*, more-* |
| Seguridad | shield, key, fingerprint |
| Layout | columns, layout, sidebar, maximize, minimize, move |

---

## Size Reference / Referencia de tamaños

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

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual docs, standardized / [ES] Docs bilingüe, estandarizado |
| 1.0.0 | [EN] Initial release — 278 icons, outline/filled, 7 sizes / [ES] Versión inicial |
