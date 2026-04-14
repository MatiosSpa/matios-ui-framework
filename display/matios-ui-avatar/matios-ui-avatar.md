# MTS.Avatar

[EN] Avatar component with image, initials fallback, status dot, badge and group support. Auto-generates initials and color from name.
[ES] Componente de avatar con imagen, fallback a iniciales, dot de estado, badge y soporte de grupo. Genera iniciales y color automáticamente desde el nombre.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-avatar.css">
<script src="matios-ui-avatar.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `src` | `string` | `null` | [EN] Image URL — falls back to initials on error / [ES] URL de imagen — cae a iniciales si falla |
| `name` | `string` | `''` | [EN] Full name — generates initials and auto color / [ES] Nombre completo — genera iniciales y color |
| `initials` | `string` | auto | [EN] Manual initials — overrides name / [ES] Iniciales manuales — sobreescribe name |
| `size` | `string` | `'md'` | `'xs'` · `'sm'` · `'md'` · `'lg'` · `'xl'` |
| `color` | `string` | auto | [EN] Background color — auto-generated from name / [ES] Color de fondo — auto desde name |
| `status` | `string` | `null` | `'online'` · `'offline'` · `'busy'` · `'away'` |
| `square` | `boolean` | `false` | [EN] Square shape / [ES] Forma cuadrada |
| `badge` | `string\|number` | `null` | [EN] Badge text or number / [ES] Texto o número en badge |

---

## JavaScript Usage / Uso JavaScript

```js
// With image / Con imagen
new MTS.Avatar('#avatar-img', {
  src:  'https://example.com/photo.jpg',
  name: 'Ana García',
  size: 'md',
});

// Initials from name / Iniciales desde name
new MTS.Avatar('#avatar-initials', {
  name: 'Pedro Martínez',   // → 'PM', auto color
  size: 'lg',
});

// Manual initials + custom color / Iniciales manuales + color
new MTS.Avatar('#avatar-custom', {
  initials: 'JD',
  color:    '#7c3aed',
  size:     'md',
});

// With status dot / Con dot de estado
new MTS.Avatar('#avatar-status', {
  name:   'Laura Sánchez',
  status: 'online',   // 'online' | 'offline' | 'busy' | 'away'
});

// Square shape / Forma cuadrada
new MTS.Avatar('#avatar-square', {
  name:   'Bot',
  square: true,
  size:   'lg',
});

// With badge / Con badge
new MTS.Avatar('#avatar-badge', {
  name:  'Carlos',
  badge: 3,
});
```

---

## HTML Usage / Uso HTML

```html
<div id="my-avatar"></div>

<script>
  new MTS.Avatar('#my-avatar', {
    src:    'photo.jpg',
    name:   'Ana García',
    status: 'online',
  });
</script>
```

---

## API

```js
const avatar = new MTS.Avatar('#my-avatar', { name: 'Ana García' });

// Update status / Actualizar estado
avatar.setStatus('online')
avatar.setStatus('busy')
avatar.setStatus(null)   // remove dot / quitar dot

// Update image / Actualizar imagen
avatar.setSrc('https://example.com/new-photo.jpg')
```

---

## AvatarGroup / Grupo de avatares

```js
// Stack overlapping avatars / Apilar avatares superpuestos
new MTS.AvatarGroup('#group', {
  avatars: [
    { src: '/img/1.jpg', name: 'Ana' },
    { src: '/img/2.jpg', name: 'Pedro' },
    { name: 'Laura' },
    { name: 'Carlos' },
    { name: 'María' },
  ],
  max:  3,      // show max 3, then "+2" / mostrar máx 3, luego "+2"
  size: 'md',
});
```

---

## Static Helpers / Helpers estáticos

```js
// Generate initials from name / Generar iniciales desde nombre
MTS.Avatar.getInitials('Ana García')   // → 'AG'
MTS.Avatar.getInitials('Pedro')        // → 'PE'

// Generate consistent color from name / Generar color consistente desde nombre
MTS.Avatar.colorFromName('Ana García') // → '#...' (deterministic)
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingüe, docs estandarizados |
| 1.0.0 | [EN] Initial release — image/initials, status, badge, group / [ES] Versión inicial |
