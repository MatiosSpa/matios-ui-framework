# MTS.PanelDropdown

Panel flotante anclado a un trigger — notificaciones, menú de usuario, acciones contextuales enriquecidas. Portal `position:fixed` que escapa cualquier `overflow:hidden`.

---

## Instalación

```html
<link rel="stylesheet" href="matios-ui-paneldropdown.css">
<script src="matios-ui-paneldropdown.js"></script>
```

---

## Opciones

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `header` | `{ title, badge? } \| null` | `null` | Header con título y badge contador |
| `items` | `Array` | `[]` | Ítems del cuerpo (ver estructura abajo) |
| `footer` | `{ label, onClick } \| null` | `null` | Footer con botón CTA |
| `width` | `number` | `320` | Ancho del panel en px |
| `maxHeight` | `number` | `420` | Altura máxima del body (activa scroll) |
| `position` | `string` | `'bottom-end'` | `'bottom-end'` · `'bottom-start'` |
| `onOpen` | `function` | — | Se dispara al abrir |
| `onClose` | `function` | — | Se dispara al cerrar |

### Estructura de ítem

```js
// Ítem completo
{ id, title, description?, timestamp?, dot?, icon?, unread?, onClick? }

// Divider
{ divider: true }
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `id` | `string` | Identificador |
| `title` | `string` | Texto principal |
| `description` | `string` | Texto secundario (muted) |
| `timestamp` | `string` | Tiempo relativo — "Hace 5 min" |
| `dot` | `string` | Color CSS del dot indicador — `'#10b981'` |
| `icon` | `string` | Clase del ícono MTS — `'mts-icon-bell'` |
| `unread` | `boolean` | Fondo resaltado para ítems no leídos |
| `onClick` | `function(item)` | Callback al hacer click — cierra el panel automáticamente |

---

## Uso

```js
// Panel de notificaciones
const pd = new MTS.PanelDropdown(document.getElementById('btn-notif'), {
  position: 'bottom-end',
  header:   { title: 'Notificaciones', badge: 3 },
  items: [
    {
      id:          'n1',
      dot:         '#10b981',
      icon:        'mts-icon-check-circle',
      title:       'Pedido #1047 entregado',
      description: 'Ana Torres recibió su pedido.',
      timestamp:   'Hace 5 min',
      unread:      true,
      onClick:     function(item) { console.log(item.id); },
    },
    { divider: true },
    { id: 'n2', dot: '#6366f1', icon: 'mts-icon-user-plus',
      title: 'Nuevo usuario', timestamp: 'Hace 1 hora' },
  ],
  footer: {
    label:   'Ver todas las notificaciones',
    onClick: function() { router.push('/notificaciones'); },
  },
});

// Menú de usuario — sin footer
new MTS.PanelDropdown(avatarEl, {
  position: 'bottom-end',
  width:    260,
  header:   { title: 'Carlos Méndez' },
  items: [
    { id:'perfil',  icon:'mts-icon-user',     title: 'Mi perfil' },
    { id:'config',  icon:'mts-icon-settings',  title: 'Configuración' },
    { divider: true },
    { id:'logout',  icon:'mts-icon-log-out',   title: 'Cerrar sesión' },
  ],
});
```

---

## API

```js
pd.open()                // Abre el panel
pd.close()               // Cierra el panel
pd.toggle()              // Alterna
pd.setItems(items)       // Reemplaza los ítems (funciona en caliente si está abierto)
pd.setHeaderBadge(n)     // Actualiza el contador del header (0 = oculta el badge)
pd.destroy()             // Desmonta y limpia listeners

pd.on('open',  fn)       // Evento: panel abierto
pd.on('close', fn)       // Evento: panel cerrado
```

---

## Changelog

### v1.0.0 — 2026-05-07
- Componente inicial
- Portal `position:fixed` — escapa `overflow:hidden` de cualquier contenedor
- Header con title + badge contador
- Body con scroll — ítems: dot de color, ícono, title, description, timestamp, unread
- Footer con botón CTA
- Posición: `bottom-end` / `bottom-start` con corrección automática de viewport
- Click fuera cierra el panel
