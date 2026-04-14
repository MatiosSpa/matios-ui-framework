# MTS.Drawer

[EN] Sliding side panel with backdrop, four positions, four sizes, static mode and programmatic control.
[ES] Panel lateral deslizante con backdrop, cuatro posiciones, cuatro tamaños, modo estático y control programático.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-drawer.css">
<script src="matios-ui-drawer.js"></script>
```

---

## Options / Opciones

[EN] `MTS.Drawer` does not take a selector — it appends itself to `document.body`.
[ES] `MTS.Drawer` no recibe un selector — se agrega a `document.body`.

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `title` | `string` | `''` | [EN] Drawer header title / [ES] Título del header |
| `content` | `string\|Element` | `''` | [EN] Body content / [ES] Contenido del cuerpo |
| `footer` | `string\|Element` | `null` | [EN] Footer content / [ES] Contenido del pie |
| `position` | `string` | `'right'` | `'left'` · `'right'` · `'top'` · `'bottom'` |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` · `'full'` |
| `backdrop` | `boolean` | `true` | [EN] Show backdrop overlay / [ES] Mostrar fondo oscuro |
| `closable` | `boolean` | `true` | [EN] Show close button / [ES] Mostrar botón de cierre |
| `static` | `boolean` | `false` | [EN] Does not close on Esc or backdrop click / [ES] No cierra con Esc ni click en backdrop |
| `onOpen` | `function` | — | [EN] Fires when drawer opens / [ES] Se dispara al abrir |
| `onClose` | `function` | — | [EN] Fires when drawer closes / [ES] Se dispara al cerrar |

---

## Events / Eventos

```js
const drawer = new MTS.Drawer({
  title:   'Settings',
  content: '<p>Settings content</p>',
  // Fires when drawer opens / Se dispara al abrir el drawer
  onOpen:  () => console.log('opened'),
  // Fires when drawer closes / Se dispara al cerrar el drawer
  onClose: () => console.log('closed'),
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic / Básico
const drawer = new MTS.Drawer({
  title:    'Filters',
  content:  '<div id="filter-form"></div>',
  position: 'right',
  size:     'md',
  onOpen:   () => console.log('opened'),
  onClose:  () => console.log('closed'),
});

drawer.show();

// Left navigation / Navegación izquierda
const navDrawer = new MTS.Drawer({
  title:    'Navigation',
  position: 'left',
  size:     'sm',
  content:  '<nav>...</nav>',
});

// With footer / Con pie
const confirmDrawer = new MTS.Drawer({
  title:   'Delete record',
  content: '<p>Are you sure you want to delete this record?</p>',
  footer:  '<button onclick="confirmDrawer.hide()">Cancel</button> <button>Confirm</button>',
  static:  true,  // user must click a button / el usuario debe hacer click en un botón
});

// Bottom sheet
const sheet = new MTS.Drawer({
  title:    'Options',
  position: 'bottom',
  size:     'sm',
  content:  '<ul>...</ul>',
});
```

---

## API

```js
const drawer = new MTS.Drawer({ ... });

// Show / hide / Mostrar / ocultar
drawer.show()
drawer.hide()
drawer.toggle()

// Update content at runtime / Actualizar contenido en runtime
drawer.setTitle('New title')
drawer.setContent('<p>New content</p>')

// Register event listener / Registrar listener
drawer.on('open',  () => {})
drawer.on('close', () => {})

// Destroy and remove from DOM / Destruir y eliminar del DOM
drawer.destroy()
```

---

## DOM Events / Eventos DOM

```js
document.addEventListener('mts:drawer:open',  (e) => {});
document.addEventListener('mts:drawer:close', (e) => {});
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingües, docs estandarizados |
| 1.0.0 | [EN] Initial release — left/right/top/bottom, sm/md/lg/full, static mode / [ES] Versión inicial |
