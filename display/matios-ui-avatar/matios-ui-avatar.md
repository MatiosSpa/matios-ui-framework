# MTS.Avatar

Avatar with image, initials fallback, status dot and badge. Auto-generates initials and a deterministic background color from the name. Ships with a companion `MTS.AvatarGroup` for overlapping stacks.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-avatar.css">
<script src="matios-ui-avatar.js"></script>
```

Optional (only if you localize the `aria-label` fallback):

```html
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-avatar-i18n.js"></script>
```

---

## Usage

```js
// With image (falls back to initials on error)
new MTS.Avatar('#av-img', {
  src: 'https://i.pravatar.cc/150?img=1',
  name: 'Ana García'
});

// Initials from name (auto color)
new MTS.Avatar('#av-initials', { name: 'Pedro Martínez' });   // → 'PM'

// Status dot
new MTS.Avatar('#av-online', {
  name: 'Laura',
  status: 'online'
});

// Square shape
new MTS.Avatar('#av-square', {
  name: 'Bot',
  square: true
});

// Badge
new MTS.Avatar('#av-badge', {
  name: 'Ana',
  badge: 3
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `src` | `string` | `null` | Image URL — falls back to initials on error |
| `name` | `string` | `''` | Full name — generates initials and an auto color |
| `initials` | `string` | auto | Manual initials — overrides `name` |
| `size` | `string` | `'md'` | `'xs'` \| `'sm'` \| `'md'` \| `'lg'` \| `'xl'` |
| `color` | `string` | auto | Background color for initials — auto-generated from `name` |
| `status` | `string` | `null` | `'online'` \| `'offline'` \| `'busy'` \| `'away'` |
| `square` | `boolean` | `false` | Square shape instead of circle |
| `badge` | `string` \| `number` | `null` | Badge text or number |

---

## Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `setStatus(value)` | `this` | Sets the status dot (`'online'`, `'offline'`, `'busy'`, `'away'`) or `null` to remove |
| `setSrc(url)` | `this` | Sets the image URL and rebuilds |
| `update(options)` | `this` | Patches any subset of `src`, `name`, `initials`, `color`, `size`, `status`, `square`, `badge` and rebuilds. Changing `name` (without an explicit `initials`/`color`) recomputes both from the new name; pass `status: null` / `badge: null` to clear them |

```js
const avatar = new MTS.Avatar('#my-avatar', { name: 'Ana García' });
avatar.setStatus('busy');
avatar.setSrc('https://example.com/photo.jpg');
avatar.update({ name: 'Carla Soto', status: 'online', badge: 2 });
```

---

## Static helpers

| Helper | Returns | Description |
|--------|---------|-------------|
| `MTS.Avatar.getInitials(name)` | `string` | Initials from a full name (first + last), uppercased |
| `MTS.Avatar.colorFromName(name)` | `string` | Deterministic hex color from a name |
| `MTS.Avatar.create(options)` | `Element` | Builds a detached `<div>` avatar and returns it |

```js
MTS.Avatar.getInitials('Ana García');    // → 'AG'
MTS.Avatar.getInitials('Pedro');         // → 'PE'
MTS.Avatar.colorFromName('Ana García');  // → '#…' (deterministic)

const el = MTS.Avatar.create({ name: 'Ana García', status: 'online' });
document.body.appendChild(el);
```

---

## MTS.AvatarGroup

Stacks overlapping avatars with an overflow counter.

```js
new MTS.AvatarGroup('#group', {
  avatars: [
    { src: 'https://i.pravatar.cc/150?img=1', name: 'Ana' },
    { name: 'Pedro Martínez' },
    { name: 'Laura Sánchez' },
    { name: 'Carlos Ruiz' },
    { name: 'María Torres' }
  ],
  max: 3,
  size: 'md'
});
```

### AvatarGroup options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `avatars` | `Array` | `[]` | Array of avatar option objects (`{ src?, name?, status?, ... }`) |
| `max` | `number` | `4` | Maximum visible avatars — the rest collapse into a `+N` counter |
| `size` | `string` | `'md'` | `'xs'` \| `'sm'` \| `'md'` \| `'lg'` — applied to every avatar |

Each entry in `avatars` is passed straight to `MTS.Avatar`, so any avatar option works (except `size`, which is set by the group).

---

## i18n

Namespace: `MTS.Avatar`. The only localizable runtime string is the `aria-label` fallback used when no `name` is provided (default `'Avatar'`). It is read from `MTS.getString()['MTS.Avatar'].messages.avatarLabel`.

Set the language once at startup with the global API; the component reads it automatically. There is no per-instance locale option.

```js
MTS.setLanguage('en');   // 'es' | 'en' | 'pt'
```

To override or add the fallback string:

```js
MTS.registerLocale('en', {
  'MTS.Avatar': {
    messages: { avatarLabel: 'Avatar' }
  }
});
```

The bundled `matios-ui-avatar-i18n.js` ships `es`, `en` and `pt`. The `demo.*` keys inside it are for the demo page only and are not read by the component.

---

## Accessibility

- The host element receives an `aria-label` — the `name` when set, otherwise the localized `avatarLabel` fallback.
- When `src` is set, the `<img>` uses `name` as its `alt`. Keep `name` meaningful.
- The status dot is decorative; convey status with text elsewhere if it carries meaning for assistive tech.
