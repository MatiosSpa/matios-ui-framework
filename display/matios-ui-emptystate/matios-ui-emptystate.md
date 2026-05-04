# MTS.EmptyState

🇬🇧 Empty state placeholder with preset variants, custom icon, CTA button and size options.
🇪🇸 Placeholder de estado vacío con variantes predefinidas, ícono custom, botón CTA y opciones de tamaño.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-emptystate.css">
<script src="matios-ui-emptystate.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `variant` | `string` | `'no-data'` | `'no-data'` · `'search'` · `'error'` · `'permissions'` · `'custom'` |
| `title` | `string` | auto | 🇬🇧 Title text (auto from variant) / 🇪🇸 Título (auto desde variante) |
| `description` | `string` | auto | 🇬🇧 Description text / 🇪🇸 Texto de descripción |
| `action` | `string` | `null` | 🇬🇧 CTA button label / 🇪🇸 Label del botón CTA |
| `icon` | `string` | auto | 🇬🇧 Custom SVG icon (overrides variant) / 🇪🇸 Ícono SVG custom |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` |
| `onAction` | `function` | — | 🇬🇧 Fires when CTA button is clicked / 🇪🇸 Se dispara al hacer click en el botón CTA |

---

## Events / Eventos

```js
new MTS.EmptyState('#my-empty', {
  variant: 'no-data',
  action:  'Add item',
  // Fires when CTA button is clicked / Se dispara al hacer click en el CTA
  onAction: (e) => openCreateDialog(),
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// Preset variants / Variantes predefinidas
new MTS.EmptyState('#my-empty', {
  variant: 'no-data',      // no results / sin resultados
  action:  'Add first item',
  onAction: (e) => createItem(),
});

new MTS.EmptyState('#my-empty', {
  variant:     'search',   // no search results / sin resultados de búsqueda
  title:       'No results for "dashboard"',
  description: 'Try different keywords.',
  action:      'Clear search',
  onAction:    (e) => clearSearch(),
});

new MTS.EmptyState('#my-empty', {
  variant:     'error',    // error state / estado de error
  title:       'Something went wrong',
  description: 'We could not load the data.',
  action:      'Try again',
  onAction:    (e) => reload(),
});

new MTS.EmptyState('#my-empty', {
  variant:     'permissions',  // no access / sin acceso
  title:       'Access restricted',
  description: 'Contact your administrator.',
});

// Custom icon / Ícono personalizado
new MTS.EmptyState('#my-empty', {
  variant:     'custom',
  icon:        '<svg>...</svg>',
  title:       'No messages',
  description: 'Start a conversation.',
  action:      'New message',
  onAction:    (e) => openChat(),
});

// Small size / Tamaño pequeño
new MTS.EmptyState('#my-empty', {
  variant: 'no-data',
  size:    'sm',
});
```

---

## API

```js
const es = new MTS.EmptyState('#my-empty', { variant: 'no-data' });

// Update any option and re-render / Actualizar cualquier opción y re-renderizar
es.update({
  variant:     'search',
  title:       'No results for "xyz"',
  description: 'Try different keywords.',
})

// Register / remove listeners / Registrar / eliminar listeners
es.on('action', (e) => console.log('CTA clicked'))
es.off('action', handler)
```

---

## DOM Event / Evento DOM

```js
document.getElementById('my-empty')
  .addEventListener('mts:emptystate:action', () => console.log('action clicked'));
```

---
