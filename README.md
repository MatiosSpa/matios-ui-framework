# Matios UI Framework

Framework CSS/JS propio para aplicaciones web modernas.  
**Zero dependencias externas** — temas via CSS Variables, 30+ componentes, 262 íconos SVG.

---

## Inicio rápido

Abre `index.html` en tu browser para ver el showcase completo de componentes.  
O abre directamente `layouts/showcase.html` para la demo interactiva con layout real.

```
matios-ui-framework/
  index.html              ← Punto de entrada principal
  base/                   ← CSS base, tokens, temas
  forms/                  ← Input, Select, Checkbox, Picker, Rating, TagInput
  navigation/             ← Tabs, Accordion, Breadcrumb, Stepper, Drawer, Dropdown
  overlays/               ← Alert, Tooltip, Modal, Badge, Progress
  display/                ← Avatar, KPI Cards, Empty State, Timeline, Kanban
  data/                   ← DataTable, DataTable Docs, Charts
  calendar/               ← Calendario (v1.7.0)
  icons/                  ← 262 íconos SVG
  layouts/                ← Sistema de layouts + Showcase
```

---

## Uso básico

```html
<!-- 1. Base siempre primero -->
<link rel="stylesheet" href="base/matios-ui-base.css">

<!-- 2. El/los componentes que necesites -->
<link rel="stylesheet" href="forms/matios-ui-input/matios-ui-input.css">
<script src="forms/matios-ui-input/matios-ui-input.js"></script>

<!-- 3. Inicializar -->
<script>
  new MTS.Input('#mi-campo', {
    type: 'text',
    label: 'Nombre',
    placeholder: 'Ingresa tu nombre',
    required: true,
  });
</script>
```

---

## Temas

```html
<!-- Dark (default) -->
<html data-mts-theme="dark">

<!-- Light -->
<html data-mts-theme="light">

<!-- AcadPlan — azul eléctrico + violeta, tipografía Syne -->
<html data-mts-theme="acadplan">
```

Todos los componentes leen las mismas CSS Variables — al cambiar el tema en el `<html>`, toda la app se actualiza automáticamente.

---

## Componentes

### 📝 Formularios (`forms/`)
| Componente | Clase JS | Descripción |
|-----------|---------|-------------|
| Input | `MTS.Input` | text, email, password, number, textarea |
| Select | `MTS.Select` | grupos, multi-select, búsqueda |
| Checkbox | `MTS.Checkbox` / `MTS.CheckboxGroup` | checkbox con indeterminate |
| Radio | `MTS.Radio` | grupos de opciones |
| Toggle | `MTS.Toggle` | switch on/off |
| Slider | `MTS.Slider` | rango simple y doble |
| TagInput | `MTS.TagInput` | etiquetas con sugerencias y debounce |
| Rating | `MTS.Rating` | estrellas, medio punto, readonly |
| Picker | `MTS.Picker` | date / time / datetime / daterange |

### 🧭 Navegación (`navigation/`)
| Componente | Clase JS | Descripción |
|-----------|---------|-------------|
| Tabs | `MTS.Tabs` | underline / pill / card, horizontal/vertical |
| Accordion | `MTS.Accordion` | multiple, flush |
| Breadcrumb | `MTS.Breadcrumb` | separadores, maxItems, collapse |
| Stepper | `MTS.Stepper` | horizontal/vertical, estados |
| Drawer | `MTS.Drawer` | 4 posiciones, 4 tamaños |
| Dropdown | `MTS.Dropdown` | submenús, grupos, hover/click |

### 🪟 Overlays (`overlays/`)
| Componente | Clase JS | Descripción |
|-----------|---------|-------------|
| Alert | `MTS.Alert` | inline, banner, autoDismiss |
| Tooltip | `MTS.Tooltip` | 4 posiciones, flip automático |
| Modal | `MTS.Modal` | confirm / alert / prompt |
| Badge | `MTS.Badge` | CSS puro o JS, counter, removable |
| Progress | `MTS.Progress` | bar / circle / indeterminate |

### 🖼️ Display (`display/`)
| Componente | Clase JS | Descripción |
|-----------|---------|-------------|
| Avatar | `MTS.Avatar` / `MTS.AvatarGroup` | src/iniciales, status, badge, overlap |
| KPI Card | `MTS.KPICard` | valor, tendencia, sparkline SVG |
| Empty State | `MTS.EmptyState` | 4 variantes con ilustración SVG |
| Timeline | `MTS.Timeline` | vertical/horizontal, left/right/alternate |
| Kanban | `MTS.Kanban` | columnas, drag & drop, prioridad |

### 📊 Data (`data/`)
| Componente | Clase JS | Descripción |
|-----------|---------|-------------|
| DataTable | `MTS.DataTable` | sort, search, paginate, render custom |
| DataTable Docs | `MTS.DataTableDocument` | plugin para gestión de documentos |
| Chart | `MTS.Chart` | line / area / bar / pie / donut / gauge / heatmap |

### 📅 Calendario (`calendar/`)
`MTS.Calendar` v1.7.0 — 4 vistas (semana/mes/día/horario), drag & drop, resize, colisión, locked, menú contextual, 21 colores, datasource polimórfico.

### ✨ Íconos (`icons/`)
262 íconos SVG — outline + filled, 7 tamaños, colores semánticos, animaciones spin/pulse.
```html
<i class="mts-icon mts-icon-trash"></i>
<i class="mts-icon mts-icon-trash mts-icon--filled mts-icon--danger"></i>
<i class="mts-icon mts-icon-spinner mts-icon--spin mts-icon--primary"></i>
```

### 🏗️ Layouts (`layouts/`)
`MTS.Layout` — 4 variantes (sidebar / topbar / mixed / mini), tema en el objeto, toggle/collapse, mobile responsive.
```js
const layout = new MTS.Layout('#app', {
  type:  'mixed',
  theme: 'dark',       // 'dark' | 'light' | 'acadplan'
  nav:   [ ... ],
  user:  { name: 'Juan Pérez', role: 'Admin', initials: 'JP' },
  brand: { name: 'MiApp', initials: 'M' },
});
```

---

## CSS Variables principales

```css
/* Backgrounds */
--mts-bg-body, --mts-bg-surface, --mts-bg-surface-2

/* Texto */
--mts-text-primary, --mts-text-secondary, --mts-text-muted

/* Colores */
--mts-color-primary, --mts-color-success, --mts-color-warning, --mts-color-danger

/* Bordes y radios */
--mts-border-color, --mts-radius-sm, --mts-radius-md, --mts-radius-lg

/* Tipografía */
--mts-font-family

/* Sombras */
--mts-shadow-sm, --mts-shadow-md, --mts-shadow-lg, --mts-shadow-xl
```

---

## Eventos DOM

Todos los componentes emiten eventos con namespace `mts:componente:evento` con `bubbles: true`:

```js
document.getElementById('mi-calendario')
  .addEventListener('mts:calendar:eventDrop', e => {
    console.log('Evento movido:', e.detail.event);
  });

document.getElementById('mi-layout')
  .addEventListener('mts:layout:navClick', e => {
    console.log('Nav click:', e.detail.item);
  });
```

---

## Estructura de cada componente

```
matios-ui-xxx/
  matios-ui-xxx.css    ← estilos del componente
  matios-ui-xxx.js     ← lógica JS
  matios-ui-xxx.md     ← documentación y API completa
  demo.html            ← demo standalone del componente
```

---

*Matios UI — Construido con ❤️ sin dependencias externas*
