# matios-ui-avatar

Avatar con imagen, iniciales automáticas, estado y grupos con overlap.

## Uso
```js
// Avatar individual
new MTS.Avatar('#av', {
  src:    'https://example.com/foto.jpg',
  name:   'Juan Pérez',      // genera iniciales "JP" automáticamente
  size:   'md',              // 'xs'|'sm'|'md'|'lg'|'xl'
  status: 'online',          // 'online'|'offline'|'busy'|'away'
  square: false,
  badge:  3,
})

// Crear elemento sin selector
const el = MTS.Avatar.create({ name: 'María Alarcón', size: 'sm' })
document.getElementById('contenedor').appendChild(el)

// Grupo con overlap
new MTS.AvatarGroup('#group', {
  max:  4,
  size: 'sm',
  avatars: [
    { name: 'Juan Pérez',    status: 'online' },
    { name: 'María Alarcón', status: 'busy' },
    { src: '/foto.jpg',      name: 'Carlos Ruiz' },
    { name: 'Ana Torres' },
    { name: 'Pedro Díaz' },  // → aparece como "+1"
  ],
})
```

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — imagen, iniciales, colores automáticos, estado, grupo |
