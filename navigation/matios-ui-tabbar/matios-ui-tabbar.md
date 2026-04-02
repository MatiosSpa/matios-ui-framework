# MTS.TabBar

Barra de navegación estilo app mobile. Variantes default, pill y floating.

## Uso
```js
new MTS.TabBar('#el', {
  active: 'home',
  tabs: [
    { id:'home',    label:'Inicio',    icon: MTS.Icon.get('home')    },
    { id:'search',  label:'Buscar',    icon: MTS.Icon.get('search'), badge: 3 },
    { id:'profile', label:'Perfil',    icon: MTS.Icon.get('user')    },
  ],
  onChange: (e) => console.log('tab:', e.detail.id),
})
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `tabs` | `Array` | `[]` | `[{ id, label, icon, badge? }]` |
| `active` | `string` | primer tab | ID del tab activo |
| `variant` | `string` | `'default'` | `'default'`\|`'pill'`\|`'floating'` |
| `showLabels` | `boolean` | `true` | Muestra labels debajo |
| `onChange` | `function` | `null` | `({ id, tab }) => {}` |

## API
```js
const tb = new MTS.TabBar('#el', { tabs:[...] })
tb.setActive('search')
tb.setBadge('search', 5)
tb.setBadge('search', null) // quitar badge
```

---

## HTML declarativo

```html
<div id="miTabbar" data-active="home" data-show-labels></div>

<script>
new MTS.TabBar('#miTabbar', {
  tabs: [
    { id: 'home',   label: 'Inicio', icon: '🏠' },
    { id: 'search', label: 'Buscar', icon: '🔍' },
    { id: 'profile',label: 'Perfil', icon: '👤' },
  ],
  onChange: ({ id }) => console.log('tab:', id),
})
</script>
```

| Atributo | JS | Descripción |
|----------|-----|-------------|
| `data-active` | `active` | ID del tab activo |
| `data-variant` | `variant` | |
| `data-show-labels` | `showLabels` | (presencia activa) |

