# MTS.FormLayout

🇬🇧 Form layout system — pure CSS, no JavaScript. Controls how fields, labels and inputs are distributed.
🇪🇸 Sistema de layout de formularios — CSS puro, sin JavaScript. Controla cómo se distribuyen los campos, labels e inputs.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-formlayout.css">
```

---

## Layout Patterns / Patrones de layout

| Class / Clase | 🇬🇧 Description / 🇪🇸 Descripción |
|---------------|--------------------------------------|
| `.mts-form` | 🇬🇧 Stack (default) — label above, input below / 🇪🇸 Stack — label arriba, input abajo |
| `.mts-form--horizontal` | 🇬🇧 Label left, field right / 🇪🇸 Label izquierda, campo derecha |
| `.mts-form--inline` | 🇬🇧 All fields in one line / 🇪🇸 Todos los campos en una línea |
| `.mts-form--grid` | 🇬🇧 Column grid — controlled via `--mts-form-cols` / 🇪🇸 Grid de columnas |

---

## Helper Classes / Clases de apoyo

| Class / Clase | 🇬🇧 Description / 🇪🇸 Descripción |
|---------------|--------------------------------------|
| `.mts-form-group` | 🇬🇧 Field wrapper (label + input + hint/error) / 🇪🇸 Wrapper del campo |
| `.mts-form-group--full` | 🇬🇧 Spans all columns (grid mode) / 🇪🇸 Ocupa todas las columnas |
| `.mts-form-group--span-2` | 🇬🇧 Spans 2 columns / 🇪🇸 Ocupa 2 columnas |
| `.mts-form-label` | 🇬🇧 Field label / 🇪🇸 Label del campo |
| `.mts-form-label--required` | 🇬🇧 Adds red asterisk / 🇪🇸 Agrega asterisco rojo |
| `.mts-form-label--hidden` | 🇬🇧 Visually hidden but accessible / 🇪🇸 Oculto visualmente pero accesible |
| `.mts-form-hint` | 🇬🇧 Helper text below field / 🇪🇸 Texto de ayuda |
| `.mts-form-error` | 🇬🇧 Error text below field / 🇪🇸 Texto de error |
| `.mts-form-footer` | 🇬🇧 Button area at bottom / 🇪🇸 Área de botones al final |
| `.mts-form-footer--end` | 🇬🇧 Buttons right-aligned / 🇪🇸 Botones alineados a la derecha |
| `.mts-form-footer--between` | 🇬🇧 Buttons at both ends / 🇪🇸 Botones en los extremos |
| `.mts-form-section` | 🇬🇧 Section with visual separator / 🇪🇸 Sección con separador visual |
| `.mts-form-divider` | 🇬🇧 Horizontal divider line / 🇪🇸 Línea separadora horizontal |
| `.mts-form-card` | 🇬🇧 Card wrapper with padding and border / 🇪🇸 Card con padding y borde |

---

## CSS Variables

| Variable | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|----------|---------|--------------------------------------|
| `--mts-form-gap` | `16px` | 🇬🇧 Space between fields / 🇪🇸 Espacio entre campos |
| `--mts-form-label-width` | `160px` | 🇬🇧 Label width in horizontal mode / 🇪🇸 Ancho del label en modo horizontal |
| `--mts-form-cols` | `2` | 🇬🇧 Columns in grid mode / 🇪🇸 Columnas en modo grid |

---

## Stack (default)

```html
<form class="mts-form">
  <div class="mts-form-group">
    <label class="mts-form-label mts-form-label--required">Name</label>
    <input class="mts-input" placeholder="John Doe">
  </div>
  <div class="mts-form-group">
    <label class="mts-form-label">Email</label>
    <input class="mts-input" type="email" placeholder="john@company.com">
    <span class="mts-form-hint">We'll send confirmations here.</span>
  </div>
  <div class="mts-form-footer mts-form-footer--end">
    <button class="mts-btn mts-btn--secondary">Cancel</button>
    <button class="mts-btn mts-btn--primary">Save</button>
  </div>
</form>
```

---

## Grid

🇬🇧 Distributes fields in columns. Control the count via `--mts-form-cols`.
🇪🇸 Distribuye los campos en columnas. Controla el número via `--mts-form-cols`.

```html
<!-- 2 columns / 2 columnas -->
<form class="mts-form mts-form--grid" style="--mts-form-cols:2">
  <div class="mts-form-group">
    <label class="mts-form-label">First name</label>
    <input class="mts-input" placeholder="John">
  </div>
  <div class="mts-form-group">
    <label class="mts-form-label">Last name</label>
    <input class="mts-input" placeholder="Doe">
  </div>
  <!-- Full-width field / Campo ancho completo -->
  <div class="mts-form-group mts-form-group--full">
    <label class="mts-form-label">Address</label>
    <input class="mts-input" placeholder="Main St. 123">
  </div>
  <div class="mts-form-footer mts-form-footer--end mts-form-group--full">
    <button class="mts-btn mts-btn--primary">Save</button>
  </div>
</form>

<!-- 3 columns / 3 columnas -->
<form class="mts-form mts-form--grid" style="--mts-form-cols:3">
  ...
</form>
```

---

## Horizontal

🇬🇧 Label on the left, field on the right. Control label width via `--mts-form-label-width`.
🇪🇸 Label a la izquierda, campo a la derecha. Controla el ancho via `--mts-form-label-width`.

```html
<form class="mts-form mts-form--horizontal">
  <div class="mts-form-group">
    <label class="mts-form-label">Email</label>
    <input class="mts-input" type="email">
  </div>
  <div class="mts-form-group">
    <label class="mts-form-label">Password</label>
    <input class="mts-input" type="password">
    <span class="mts-form-hint">Minimum 8 characters.</span>
  </div>
</form>

<!-- Wider label / Label más ancho -->
<form class="mts-form mts-form--horizontal" style="--mts-form-label-width:200px">
  ...
</form>
```

---

## Inline

🇬🇧 All fields in one row. Ideal for search bars or filters.
🇪🇸 Todos los campos en una fila. Ideal para barras de búsqueda o filtros.

```html
<form class="mts-form mts-form--inline">
  <div class="mts-form-group">
    <label class="mts-form-label">Search</label>
    <input class="mts-input" placeholder="Name or email...">
  </div>
  <div class="mts-form-group">
    <label class="mts-form-label">Status</label>
    <!-- MTS.Select or native select -->
  </div>
  <button class="mts-btn mts-btn--primary">Search</button>
</form>
```

---

## Sections / Secciones

🇬🇧 Divides the form into blocks with a visual separator.
🇪🇸 Divide el formulario en bloques con separador visual.

```html
<form class="mts-form">
  <div class="mts-form-section">
    <h3 class="mts-form-section__title">Personal data</h3>
    <p class="mts-form-section__desc">Basic user information.</p>
    <div class="mts-form-group">...</div>
  </div>
  <div class="mts-form-section">
    <h3 class="mts-form-section__title">Address</h3>
    <div class="mts-form-group">...</div>
  </div>
</form>
```

---

## Form Card

🇬🇧 Form wrapped in a card with header and padding.
🇪🇸 Formulario envuelto en una card con header y padding.

```html
<div class="mts-form-card">
  <div class="mts-form-card__header">
    <h2 class="mts-form-card__title">New user</h2>
    <p class="mts-form-card__subtitle">Fill in the details to create the account.</p>
  </div>
  <form class="mts-form">
    ...
  </form>
</div>
```

---

## Sizes / Tamaños

| Class / Clase | 🇬🇧 Description / 🇪🇸 Descripción |
|---------------|--------------------------------------|
| `.mts-form--sm` | 🇬🇧 Compact — less space between fields / 🇪🇸 Compacto — menos espacio |
| `.mts-form` | 🇬🇧 Default / 🇪🇸 Por defecto |
| `.mts-form--lg` | 🇬🇧 Spacious — more space between fields / 🇪🇸 Espacioso — más espacio |

---

## Responsive

🇬🇧 All modes collapse automatically to stack on mobile (`< 576px`):
🇪🇸 Todos los modos colapsan automáticamente a stack en mobile (`< 576px`):
- Horizontal → stack (label above / label arriba)
- Inline → stack (stacked fields / campos apilados)
- Grid → 1 column / 1 columna

---
