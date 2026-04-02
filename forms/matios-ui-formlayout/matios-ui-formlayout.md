# matios-ui-formlayout

Layout de formularios — CSS puro, sin JS. Controla cómo se distribuyen los campos, labels e inputs.

---

## Instalación

```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="../../base/matios-ui-grid.css">
<link rel="stylesheet" href="matios-ui-formlayout.css">
```

---

## Patrones disponibles

| Clase | Descripción |
|-------|-------------|
| `.mts-form` | Stack (default) — label arriba, input abajo |
| `.mts-form--horizontal` | Label izquierda + campo derecha |
| `.mts-form--inline` | Todos los campos en una sola línea |
| `.mts-form--grid` | Grid de columnas — controlado via `--mts-form-cols` |

---

## Stack (default)

```html
<form class="mts-form">
  <div class="mts-form-group">
    <label class="mts-form-label mts-form-label--required">Nombre</label>
    <input class="mts-input" placeholder="Juan Pérez">
  </div>
  <div class="mts-form-group">
    <label class="mts-form-label">Email</label>
    <input class="mts-input" type="email" placeholder="juan@empresa.com">
    <span class="mts-form-hint">Te enviaremos la confirmación aquí.</span>
  </div>
  <div class="mts-form-footer mts-form-footer--end">
    <button class="mts-btn mts-btn--secondary">Cancelar</button>
    <button class="mts-btn mts-btn--primary">Guardar</button>
  </div>
</form>
```

---

## Grid

Distribuye los campos en columnas. Controla el número via `--mts-form-cols`.

```html
<form class="mts-form mts-form--grid" style="--mts-form-cols:2">
  <div class="mts-form-group">
    <label class="mts-form-label">Nombre</label>
    <input class="mts-input" placeholder="Juan">
  </div>
  <div class="mts-form-group">
    <label class="mts-form-label">Apellido</label>
    <input class="mts-input" placeholder="Pérez">
  </div>
  <!-- Campo que ocupa las 2 columnas -->
  <div class="mts-form-group mts-form-group--full">
    <label class="mts-form-label">Dirección</label>
    <input class="mts-input" placeholder="Av. Principal 123">
  </div>
  <div class="mts-form-footer mts-form-footer--end mts-form-group--full">
    <button class="mts-btn mts-btn--primary">Guardar</button>
  </div>
</form>

<!-- 3 columnas -->
<form class="mts-form mts-form--grid" style="--mts-form-cols:3">
  ...
</form>
```

---

## Horizontal

Label a la izquierda, campo a la derecha. Controla el ancho del label via `--mts-form-label-width`.

```html
<form class="mts-form mts-form--horizontal">
  <div class="mts-form-group">
    <label class="mts-form-label">Email</label>
    <input class="mts-input" type="email">
  </div>
  <div class="mts-form-group">
    <label class="mts-form-label">Contraseña</label>
    <input class="mts-input" type="password">
    <span class="mts-form-hint">Mínimo 8 caracteres.</span>
  </div>
</form>

<!-- Label más ancho -->
<form class="mts-form mts-form--horizontal" style="--mts-form-label-width:200px">
  ...
</form>
```

---

## Inline

Todos los campos en una sola línea. Ideal para barras de búsqueda o filtros.

```html
<form class="mts-form mts-form--inline">
  <div class="mts-form-group">
    <label class="mts-form-label">Buscar</label>
    <input class="mts-input" placeholder="Nombre o email...">
  </div>
  <div class="mts-form-group">
    <label class="mts-form-label">Estado</label>
    <!-- MTS.Select o select nativo -->
  </div>
  <button class="mts-btn mts-btn--primary">Buscar</button>
</form>

<!-- Sin labels visibles -->
<form class="mts-form mts-form--inline">
  <div class="mts-form-group">
    <label class="mts-form-label mts-form-label--hidden">Buscar</label>
    <input class="mts-input" placeholder="Buscar...">
  </div>
  <button class="mts-btn mts-btn--primary">🔍</button>
</form>
```

---

## Secciones

Divide el formulario en bloques con separador visual.

```html
<form class="mts-form">
  <div class="mts-form-section">
    <h3 class="mts-form-section__title">Datos personales</h3>
    <p class="mts-form-section__desc">Información básica del usuario.</p>
    <div class="mts-form-group">...</div>
    <div class="mts-form-group">...</div>
  </div>
  <div class="mts-form-section">
    <h3 class="mts-form-section__title">Dirección</h3>
    <div class="mts-form-group">...</div>
  </div>
</form>
```

---

## Form Card

Formulario envuelto en una card con header y padding.

```html
<div class="mts-form-card">
  <div class="mts-form-card__header">
    <h2 class="mts-form-card__title">Nuevo usuario</h2>
    <p class="mts-form-card__subtitle">Completa los datos para crear la cuenta.</p>
  </div>
  <form class="mts-form">
    ...
  </form>
</div>
```

---

## Tamaños

| Clase | Descripción |
|-------|-------------|
| `.mts-form--sm` | Compacto — menos espacio entre campos |
| `.mts-form` | Mediano (default) |
| `.mts-form--lg` | Espacioso — más espacio entre campos |

---

## CSS Variables

| Variable | Default | Descripción |
|----------|---------|-------------|
| `--mts-form-gap` | `16px` | Espacio entre campos |
| `--mts-form-label-width` | `160px` | Ancho del label en modo horizontal |
| `--mts-form-cols` | `2` | Columnas en modo grid |

---

## Clases de apoyo

| Clase | Descripción |
|-------|-------------|
| `.mts-form-group` | Wrapper de un campo (label + input + hint/error) |
| `.mts-form-group--full` | Campo que ocupa todas las columnas (modo grid) |
| `.mts-form-group--span-2` | Campo que ocupa 2 columnas |
| `.mts-form-label` | Label del campo |
| `.mts-form-label--required` | Agrega asterisco rojo al label |
| `.mts-form-label--hidden` | Label accesible pero visualmente oculto |
| `.mts-form-hint` | Texto de ayuda bajo el campo |
| `.mts-form-error` | Texto de error bajo el campo |
| `.mts-form-footer` | Área de botones al final del formulario |
| `.mts-form-footer--end` | Botones alineados a la derecha |
| `.mts-form-footer--between` | Botones en los extremos |
| `.mts-form-section` | Sección con separador visual |
| `.mts-form-divider` | Línea separadora horizontal |
| `.mts-form-card` | Card con padding y borde |

---

## Responsive

Todos los modos colapsan automáticamente a stack en mobile (`< 576px`):
- Horizontal → stack (label arriba)
- Inline → stack (campos apilados)
- Grid → 1 columna
