# MTS.TabBar

[EN] Mobile-style bottom navigation bar with icons, labels, badges and three visual variants.
[ES] Barra de navegación inferior estilo móvil con íconos, labels, badges y tres variantes visuales.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-tabbar.css">
<script src="matios-ui-tabbar.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `tabs` | `array` | `[]` | [EN] Tab items (see schema below) / [ES] Ítems del tab bar |
| `active` | `string` | first tab | [EN] Initially active tab ID / [ES] ID del tab activo inicial |
| `variant` | `string` | `'default'` | `'default'` · `'pill'` · `'floating'` |
| `showLabels` | `boolean` | `true` | [EN] Show labels below icons / [ES] Mostrar labels bajo los íconos |
| `onChange` | `function` | — | [EN] Fires when active tab changes / [ES] Se dispara al cambiar el tab activo |

### Tab item schema / Esquema de ítem

| Property | Type | [EN] Description / [ES] Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | [EN] Unique identifier / [ES] Identificador único |
| `label` | `string` | [EN] Tab label / [ES] Texto del tab |
| `icon` | `string` | [EN] Icon HTML / [ES] HTML del ícono |
| `badge` | `string\|number` | [EN] Badge count or text / [ES] Contador o texto del badge |

---

## Events / Eventos

```js
new MTS.TabBar('#my-tabbar', {
  tabs: [...],
  // Fires when active tab changes / Se dispara al cambiar el tab activo
  onChange: (e) => {
    console.log(e.detail.id);  // → 'home'
    console.log(e.detail.tab); // → { id, label, icon, badge }
  },
});
```

---

## HTML Usage / Uso HTML

```html
<div id="app-tabbar"
  data-active="home"
  data-variant="default">
</div>

<script>
  const ICON_HOME   = '&lt;svg&gt;...&lt;/svg&gt;';
  const ICON_SEARCH = '&lt;svg&gt;...&lt;/svg&gt;';

  new MTS.TabBar('#app-tabbar', {
    tabs: [
      { id: 'home',     label: 'Home',    icon: ICON_HOME,   badge: null },
      { id: 'search',   label: 'Search',  icon: ICON_SEARCH, badge: null },
      { id: 'messages', label: 'Messages',icon: ICON_MSG,    badge: 3    },
      { id: 'profile',  label: 'Profile', icon: ICON_USER,   badge: null },
    ],
    onChange: (e) =&gt; console.log(e.detail.id),
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
const tabbar = new MTS.TabBar('#my-tabbar', {
  // Visual variant: 'default' | 'pill' | 'floating'
  variant: 'default',

  // Initially active tab / Tab activo inicial
  active: 'home',

  // Show labels below icons / Mostrar labels bajo los íconos
  showLabels: true,

  tabs: [
    { id: 'home',     label: 'Home',     icon: ICON_HOME    },
    { id: 'explore',  label: 'Explore',  icon: ICON_EXPLORE },
    { id: 'inbox',    label: 'Inbox',    icon: ICON_INBOX, badge: 5 },
    { id: 'profile',  label: 'Profile',  icon: ICON_USER    },
  ],

  // Fires when active tab changes / Se dispara al cambiar el tab activo
  onChange: (e) => {
    console.log(e.detail.id);  // → 'explore'
    console.log(e.detail.tab); // → { id, label, icon, badge }
  },
});
```

---

## API

```js
const tabbar = new MTS.TabBar('#my-tabbar', { ... });

// Set active tab programmatically / Activar tab programáticamente
tabbar.setActive('profile')

// Update badge value / Actualizar valor del badge
tabbar.setBadge('inbox', 12)   // set badge / establecer badge
tabbar.setBadge('inbox', null) // clear badge / limpiar badge

// Destroy / Destruir
tabbar.destroy()
```

---

## DOM Event / Evento DOM

```js
document.getElementById('my-tabbar')
  .addEventListener('mts:tabbar:change', (e) => {
    console.log(e.detail.id);
  });
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingües, docs estandarizados |
| 1.0.0 | [EN] Initial release — default/pill/floating, badges, labels / [ES] Versión inicial |
