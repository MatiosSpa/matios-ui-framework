# MTS.SideNav

Navegación lateral colapsable tipo dashboard. Submenús, badges, grupos, íconos y colapso animado.

## Uso
```js
new MTS.SideNav('#sidebar', {
  active: 'dashboard',
  items: [
    { group: 'Principal' },
    { id:'dashboard', label:'Dashboard',  icon: MTS.Icon.get('home'),  href:'/dashboard' },
    { id:'users',     label:'Usuarios',   icon: MTS.Icon.get('users'), badge: 12, children: [
      { id:'users-list',  label:'Lista',     href:'/users' },
      { id:'users-roles', label:'Roles',     href:'/users/roles' },
    ]},
    { divider: true },
    { id:'settings',  label:'Config',     icon: MTS.Icon.get('settings'), href:'/settings' },
  ],
  onChange: ({ item }) => console.log('navegó a:', item.label),
})
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `items` | `Array` | `[]` | Árbol de items |
| `active` | `string` | `''` | ID del item activo |
| `collapsed` | `boolean` | `false` | Colapsado (solo íconos) |
| `logo` | `string` | `''` | HTML del logo |
| `footer` | `string` | `''` | HTML del footer |
| `accordion` | `boolean` | `true` | Un submenú abierto a la vez |
| `collapseBtn` | `string` | `null` | Selector de botón externo |
| `onChange` | `function` | `null` | `({ item }) => {}` |
| `onCollapse` | `function` | `null` | `(collapsed) => {}` |

## Item
```js
{ id, label, icon?, href?, badge?, children?, group?, divider?, disabled? }
```

## API
```js
const nav = new MTS.SideNav('#el', { items:[...] })
nav.setActive('users')
nav.collapse()
nav.expand()
nav.toggleCollapse()
nav.setBadge('users', 15)
nav.setItems([...])
```
