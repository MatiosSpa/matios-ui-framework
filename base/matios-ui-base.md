# mts-base.css

El cimiento de todo el framework MTS. Define los **design tokens**, el **reset**, el **sistema de temas** y las **utilidades** que todos los componentes usan.

---

## Instalación

Incluye el archivo antes de cualquier otro CSS de MTS:

```html
<link rel="stylesheet" href="mts-base.css">
<!-- luego los componentes -->
<link rel="stylesheet" href="mts-grid.css">
<link rel="stylesheet" href="mts-calendar.css">
```

---

## Temas

El sistema de temas funciona con el atributo `data-mts-theme` en cualquier elemento contenedor. Si lo pones en `<html>` o `<body>`, aplica globalmente.

### Temas incluidos

| Valor | Descripción |
|-------|-------------|
| `light` | Claro (por defecto) |
| `dark` | Oscuro |
| `ocean` | Azul océano (ejemplo de tema custom) |

### Uso

```html
<!-- Tema claro (por defecto, no necesitas ponerlo) -->
<html data-mts-theme="light">

<!-- Tema oscuro -->
<html data-mts-theme="dark">

<!-- Tema personalizado -->
<html data-mts-theme="ocean">
```

### Cambiar tema con JS

```js
// Cambiar tema globalmente
document.documentElement.setAttribute('data-mts-theme', 'dark');

// Toggle dark/light
const current = document.documentElement.getAttribute('data-mts-theme');
document.documentElement.setAttribute(
  'data-mts-theme',
  current === 'dark' ? 'light' : 'dark'
);
```

### Crear tu propio tema

Copia este bloque en tu CSS y redefine solo las variables que necesitas:

```css
[data-mts-theme="mi-tema"] {
  --mts-color-primary:       #7c3aed;
  --mts-color-primary-hover: #6d28d9;
  --mts-color-accent:        #f59e0b;
  --mts-bg-body:             #faf5ff;
}
```

---

## Design Tokens

Todas las variables CSS disponibles bajo el prefijo `--mts-`.

### Colores

```css
/* Primario */
--mts-color-primary         /* Color principal de la marca */
--mts-color-primary-hover   /* Hover del primario */
--mts-color-primary-active  /* Active/pressed del primario */
--mts-color-primary-light   /* Versión clara para fondos/focus ring */
--mts-color-primary-text    /* Texto sobre fondo primario */

/* Acento */
--mts-color-accent
--mts-color-accent-hover
--mts-color-accent-text

/* Semánticos */
--mts-color-success / --mts-color-success-light / --mts-color-success-text
--mts-color-warning / --mts-color-warning-light / --mts-color-warning-text
--mts-color-danger  / --mts-color-danger-light  / --mts-color-danger-text
--mts-color-info    / --mts-color-info-light    / --mts-color-info-text

/* Grises (escala de 50 a 900) */
--mts-gray-50  /* más claro */
--mts-gray-100
--mts-gray-200
--mts-gray-300
--mts-gray-400
--mts-gray-500
--mts-gray-600
--mts-gray-700
--mts-gray-800
--mts-gray-900  /* más oscuro */
```

### Superficies y texto

```css
--mts-bg-body        /* Fondo de página */
--mts-bg-surface     /* Fondo de tarjetas / paneles */
--mts-bg-surface-2   /* Fondo alternativo (zebra, hover) */

--mts-text-primary   /* Texto principal */
--mts-text-secondary /* Texto secundario */
--mts-text-muted     /* Texto apagado */
--mts-text-disabled  /* Texto deshabilitado */
--mts-text-inverse   /* Texto sobre fondo oscuro */
```

### Tipografía

```css
--mts-font-family    /* Sans-serif del sistema */
--mts-font-mono      /* Monoespaciada */

/* Tamaños */
--mts-font-size-xs    /* 11px */
--mts-font-size-sm    /* 13px */
--mts-font-size-md    /* 14px — base */
--mts-font-size-lg    /* 16px */
--mts-font-size-xl    /* 20px */
--mts-font-size-2xl   /* 24px */
--mts-font-size-3xl   /* 30px */

/* Pesos */
--mts-font-weight-normal    /* 400 */
--mts-font-weight-medium    /* 500 */
--mts-font-weight-semibold  /* 600 */
--mts-font-weight-bold      /* 700 */
```

### Espaciado

```css
--mts-space-1   /* 4px  */
--mts-space-2   /* 8px  */
--mts-space-3   /* 12px */
--mts-space-4   /* 16px */
--mts-space-5   /* 20px */
--mts-space-6   /* 24px */
--mts-space-8   /* 32px */
--mts-space-10  /* 40px */
--mts-space-12  /* 48px */
```

### Radios de borde

```css
--mts-radius-xs    /* 2px  */
--mts-radius-sm    /* 4px  */
--mts-radius-md    /* 6px  — más usado */
--mts-radius-lg    /* 10px — cards */
--mts-radius-xl    /* 16px */
--mts-radius-full  /* 9999px — pills, avatares */
```

### Sombras

```css
--mts-shadow-xs   /* muy sutil */
--mts-shadow-sm   /* elementos pequeños */
--mts-shadow-md   /* cards, dropdowns */
--mts-shadow-lg   /* modales, popovers */
--mts-shadow-xl   /* drawers, overlays grandes */
```

### Z-index

```css
--mts-z-base       /* 1    */
--mts-z-dropdown   /* 100  */
--mts-z-sticky     /* 200  */
--mts-z-overlay    /* 300  */
--mts-z-modal      /* 400  */
--mts-z-toast      /* 500  */
--mts-z-tooltip    /* 600  */
```

### Transiciones

```css
--mts-transition-fast  /* 0.12s ease */
--mts-transition-base  /* 0.20s ease */
--mts-transition-slow  /* 0.35s ease */
```

---

## Clases de componente

### Panel `.mts-panel`

Contenedor principal de cada sección de la aplicación.

```html
<div class="mts-panel">
  <div class="mts-panel__header">
    <div>
      <h1 class="mts-panel__title">Título de la sección</h1>
      <p class="mts-panel__subtitle">Descripción opcional</p>
    </div>
    <div class="mts-panel__actions">
      <button class="mts-btn mts-btn--primary">+ Nuevo</button>
    </div>
  </div>
  <hr class="mts-separator">
  <div class="mts-panel__body">
    <!-- contenido -->
  </div>
</div>
```

### Surface `.mts-surface`

Bloque con borde y fondo, para agrupar contenido.

```html
<!-- Estándar -->
<div class="mts-surface"> ... </div>

<!-- Con sombra, sin borde -->
<div class="mts-surface mts-surface--elevated"> ... </div>

<!-- Bordes rectos -->
<div class="mts-surface mts-surface--flat"> ... </div>
```

### Layout `.mts-layout`

Shell para aplicaciones con sidebar.

```html
<div class="mts-layout">
  <aside class="mts-layout__sidebar" id="sidebar">
    <!-- navegación -->
  </aside>

  <div class="mts-layout__main">
    <header class="mts-layout__topbar">
      <!-- topbar -->
    </header>
    <main class="mts-layout__content">
      <!-- páginas -->
    </main>
    <footer class="mts-layout__footer">
      © 2025 Mi App
    </footer>
  </div>
</div>
```

Para colapsar el sidebar:

```js
document.getElementById('sidebar').classList.toggle('mts-layout__sidebar--collapsed');
```

---

## Botones `.mts-btn`

```html
<!-- Variantes -->
<button class="mts-btn mts-btn--primary">Primario</button>
<button class="mts-btn mts-btn--secondary">Secundario</button>
<button class="mts-btn mts-btn--ghost">Ghost</button>
<button class="mts-btn mts-btn--danger">Eliminar</button>
<button class="mts-btn mts-btn--link">Enlace</button>

<!-- Tamaños -->
<button class="mts-btn mts-btn--primary mts-btn--xs">Extra small</button>
<button class="mts-btn mts-btn--primary mts-btn--sm">Small</button>
<button class="mts-btn mts-btn--primary">Default</button>
<button class="mts-btn mts-btn--primary mts-btn--lg">Large</button>
<button class="mts-btn mts-btn--primary mts-btn--xl">Extra large</button>

<!-- Modificadores -->
<button class="mts-btn mts-btn--primary mts-btn--block">Ancho completo</button>
<button class="mts-btn mts-btn--primary mts-btn--round">Redondeado</button>
<button class="mts-btn mts-btn--ghost mts-btn--icon">✕</button>

<!-- Deshabilitado -->
<button class="mts-btn mts-btn--primary" disabled>Deshabilitado</button>
```

---

## Formularios

```html
<div class="mts-form-group">
  <label class="mts-label mts-label--required">Nombre</label>
  <input type="text" class="mts-input" placeholder="Ingresa tu nombre">
  <span class="mts-form-hint">Mínimo 3 caracteres</span>
</div>

<div class="mts-form-group">
  <label class="mts-label">Descripción</label>
  <textarea class="mts-textarea" rows="4"></textarea>
</div>

<div class="mts-form-group">
  <label class="mts-label">País</label>
  <select class="mts-select">
    <option>Chile</option>
    <option>Perú</option>
  </select>
</div>

<!-- Estado de error -->
<div class="mts-form-group">
  <label class="mts-label">Email</label>
  <input type="email" class="mts-input mts-input--error" value="invalid">
  <span class="mts-form-error">Ingresa un email válido</span>
</div>
```

---

## Loaders

```html
<!-- Bolitas animadas (tu original mejorada) -->
<div class="mts-loader">
  <div class="mts-loader__balls">
    <div class="mts-loader__ball"></div>
    <div class="mts-loader__ball"></div>
    <div class="mts-loader__ball"></div>
    <div class="mts-loader__ball"></div>
    <div class="mts-loader__ball"></div>
  </div>
  <span class="mts-loader__text">Cargando...</span>
</div>

<!-- Spinner circular -->
<span class="mts-spinner"></span>
<span class="mts-spinner mts-spinner--sm"></span>
<span class="mts-spinner mts-spinner--lg"></span>
```

---

## Skeleton

```html
<div class="mts-skeleton mts-skeleton--title"></div>
<div class="mts-skeleton mts-skeleton--text"></div>
<div class="mts-skeleton mts-skeleton--text" style="width: 80%"></div>
<div class="mts-skeleton mts-skeleton--text" style="width: 60%"></div>
```

---

## Tipografía utilitaria

```html
<h1 class="mts-h1">Título 1</h1>
<h2 class="mts-h2">Título 2</h2>
<h3 class="mts-h3">Título 3</h3>

<p class="mts-text-muted mts-text-sm">Texto pequeño apagado</p>
<span class="mts-text-danger mts-text-bold">Error importante</span>
<code class="mts-mono">codigo.ejemplo()</code>
<p class="mts-truncate" style="width: 200px">Texto largo que se trunca con puntos suspensivos</p>
```

---

## Utilidades de layout

```html
<!-- Flex -->
<div class="mts-d-flex mts-items-center mts-justify-between mts-gap-3">
  <span>Izquierda</span>
  <span>Derecha</span>
</div>

<!-- Responsive -->
<span class="mts-hide-mobile">Solo desktop</span>
<span class="mts-hide-tablet">Solo desktop grande</span>

<!-- Espaciado -->
<div class="mts-mb-4 mts-p-3"> ... </div>
```

---

## Changelog

| Versión | Descripción |
|---------|-------------|
| 1.0.0   | Release inicial — tokens, reset, temas light/dark/ocean, panel, layout, botones, forms, loaders, skeleton, utilidades |

---

**Siguiente componente:** [`mts-grid.css`](./mts-grid.md) — Tabla de datos con ordenamiento, paginación, búsqueda y drag & drop.
