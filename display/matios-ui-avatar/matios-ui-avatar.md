# MTS.Avatar

Avatar with image, initials fallback, status dot, badge and group support. Auto-generates initials and a deterministic color from the name.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-avatar.css">
<script src="matios-ui-avatar.js"></script>
```

---

## Usage

```js
// With image (falls back to initials on error)
new MTS.Avatar('#avatar-img', { src: 'https://example.com/photo.jpg', name: 'Ana García', size: 'md' });

// Initials from name (auto color)
new MTS.Avatar('#avatar-initials', { name: 'Pedro Martínez', size: 'lg' });   // → 'PM'

// Manual initials + custom color
new MTS.Avatar('#avatar-custom', { initials: 'JD', color: '#7c3aed' });

// Status dot
new MTS.Avatar('#avatar-status', { name: 'Laura Sánchez', status: 'online' });

// Square shape + badge
new MTS.Avatar('#avatar-square', { name: 'Bot', square: true, badge: 3 });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `src` | `string` | `null` | Image URL — falls back to initials on error |
| `name` | `string` | `''` | Full name — generates initials and an auto color |
| `initials` | `string` | auto | Manual initials — overrides `name` |
| `size` | `string` | `'md'` | `'xs'` · `'sm'` · `'md'` · `'lg'` · `'xl'` |
| `color` | `string` | auto | Background color — auto-generated from `name` |
| `status` | `string` | `null` | `'online'` · `'offline'` · `'busy'` · `'away'` |
| `square` | `boolean` | `false` | Square shape |
| `badge` | `string \| number` | `null` | Badge text or number |

---

## API

| Method | Description |
|--------|-------------|
| `setStatus(value)` | Update the status dot (`'online'…` or `null` to remove) |
| `setSrc(url)` | Update the image |

```js
const avatar = new MTS.Avatar('#my-avatar', { name: 'Ana García' });
avatar.setStatus('busy');
avatar.setSrc('https://example.com/new-photo.jpg');
```

### MTS.AvatarGroup

Stack overlapping avatars with an overflow counter:

```js
new MTS.AvatarGroup('#group', {
  avatars: [
    { src: '/img/1.jpg', name: 'Ana' },
    { src: '/img/2.jpg', name: 'Pedro' },
    { name: 'Laura' }, { name: 'Carlos' }, { name: 'María' },
  ],
  max:  3,      // show 3, then "+2"
  size: 'md',
});
```

### Static helpers

```js
MTS.Avatar.getInitials('Ana García');    // → 'AG'
MTS.Avatar.getInitials('Pedro');         // → 'PE'
MTS.Avatar.colorFromName('Ana García');  // → '#…' (deterministic)
```

---

## Accessibility

- When `src` is set, the `<img>` gets the `name` as its `alt`. Keep `name` meaningful.
- The status dot is decorative; convey status with text elsewhere if it carries meaning for assistive tech.

---

## Changelog

### Initial
- Avatar with image + initials fallback, deterministic auto color, sizes, status dot, square shape and badge.
- `MTS.AvatarGroup` (overlap + overflow counter). Static helpers `getInitials` / `colorFromName`.
