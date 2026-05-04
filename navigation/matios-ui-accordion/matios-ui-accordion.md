# MTS.Accordion

🇬🇧 Expandable sections component with single or multiple open panels, flush mode and icons.
🇪🇸 Componente de secciones expandibles con panel único o múltiple abierto, modo flush e íconos.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-accordion.css">
<script src="matios-ui-accordion.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `items` | `array` | `[]` | 🇬🇧 Accordion items (see below) / 🇪🇸 Ítems del acordeón |
| `multiple` | `boolean` | `false` | 🇬🇧 Allow multiple panels open simultaneously / 🇪🇸 Permitir múltiples paneles abiertos |
| `flush` | `boolean` | `false` | 🇬🇧 No card border — flat style / 🇪🇸 Sin borde card — estilo plano |
| `onOpen` | `function` | — | 🇬🇧 Fires when a panel opens / 🇪🇸 Se dispara al abrir un panel |
| `onClose` | `function` | — | 🇬🇧 Fires when a panel closes / 🇪🇸 Se dispara al cerrar un panel |

### Item schema / Esquema de ítem

| Property | Type | 🇬🇧 Description / 🇪🇸 Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | 🇬🇧 Unique identifier / 🇪🇸 Identificador único |
| `title` | `string` | 🇬🇧 Panel header text / 🇪🇸 Texto del header |
| `content` | `string` | 🇬🇧 Panel HTML content / 🇪🇸 Contenido HTML del panel |
| `icon` | `string` | 🇬🇧 Icon HTML (optional) / 🇪🇸 HTML del ícono (opcional) |
| `open` | `boolean` | 🇬🇧 Initially open / 🇪🇸 Abierto inicialmente |
| `disabled` | `boolean` | 🇬🇧 Disables the panel / 🇪🇸 Deshabilita el panel |

---

## Events / Eventos

```js
new MTS.Accordion('#my-accordion', {
  items: [...],
  // Fires when a panel opens / Se dispara al abrir un panel
  onOpen: (e) => {
    console.log(e.detail.id); // → 'panel-1'
  },
  // Fires when a panel closes / Se dispara al cerrar un panel
  onClose: (e) => {
    console.log(e.detail.id); // → 'panel-1'
  },
});
```

---

## HTML Usage / Uso HTML

```html
<div id="my-accordion"></div>

<script>
  new MTS.Accordion('#my-accordion', {
    items: [
      {
        id:      'item-1',
        title:   'What is Matios UI?',
        content: '<p>A zero-dependency component library.</p>',
        open:    true,
      },
      {
        id:      'item-2',
        title:   'How do I install it?',
        content: '<p>Add the CSS and JS files to your project.</p>',
      },
      {
        id:       'item-3',
        title:    'Premium features',
        content:  '<p>Coming soon.</p>',
        disabled: true,
      },
    ],
    onOpen:  (e) =&gt; console.log('opened:', e.detail.id),
    onClose: (e) =&gt; console.log('closed:', e.detail.id),
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
// Single open (default) / Un panel abierto (por defecto)
new MTS.Accordion('#accordion-basic', {
  items: [
    { id: 'a', title: 'Section A', content: '<p>Content A</p>', open: true },
    { id: 'b', title: 'Section B', content: '<p>Content B</p>' },
    { id: 'c', title: 'Section C', content: '<p>Content C</p>' },
  ],
  onOpen:  (e) => console.log('opened:', e.detail.id),
  onClose: (e) => console.log('closed:', e.detail.id),
});

// Multiple open / Múltiples abiertos
new MTS.Accordion('#accordion-multi', {
  multiple: true,
  items: [...],
});

// Flush — no card border / Sin borde card
new MTS.Accordion('#accordion-flush', {
  flush: true,
  items: [...],
});

// With icons / Con íconos
new MTS.Accordion('#accordion-icons', {
  items: [
    { id: 'a', icon: '<svg>...</svg>', title: 'Settings', content: '...' },
    { id: 'b', icon: '<svg>...</svg>', title: 'Profile',  content: '...' },
  ],
});
```

---

## API

```js
const acc = new MTS.Accordion('#my-accordion', { ... });

// Open / close a panel by id / Abrir / cerrar un panel por id
acc.open('panel-id')
acc.close('panel-id')
acc.toggle('panel-id')

// Open / close all / Abrir / cerrar todos
acc.openAll()
acc.closeAll()

// Check if open / Verificar si está abierto
acc.isOpen('panel-id')    // → boolean

// Register event listener / Registrar listener
acc.on('open',  (e) => console.log(e.detail.id))
acc.on('close', (e) => console.log(e.detail.id))

// Destroy / Destruir
acc.destroy()
```

---

## DOM Events / Eventos DOM

```js
document.getElementById('my-accordion')
  .addEventListener('mts:accordion:open', (e) => {
    console.log(e.detail.id);
  });
```

| Event / Evento | DOM Namespace |
|----------------|---------------|
| `onOpen` | `mts:accordion:open` |
| `onClose` | `mts:accordion:close` |

---
