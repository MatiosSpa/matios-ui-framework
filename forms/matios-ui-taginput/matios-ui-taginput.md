# MTS.TagInput

🇬🇧 Tag input with autocomplete, debounce and object support. Each tag stores `{ uid, name }` — uid is the unique identifier (email, id, uuid, etc.), name is what's displayed.
🇪🇸 Input de tags con autocompletado, debounce y soporte de objetos. Cada tag guarda `{ uid, name }` — uid es el identificador único (email, id, uuid, etc.), name es lo que se muestra.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-taginput.css">
<script src="matios-ui-taginput.js"></script>
```

---

## Basic usage / Uso básico

```js
const ti = new MTS.TagInput('#el', {
  label:       'Invitados',
  placeholder: 'Buscar persona...',
  allowCustom: false,   // solo permite seleccionar de sugerencias
  onSearch: async (q) => {
    const res = await fetch('/api/attendees?q=' + encodeURIComponent(q));
    return res.json(); // → [{ uid, name }, ...]
  },
  onChange: (e) => {
    console.log(e.detail.tags);
    // → [{ uid: 'ana@mail.com', name: 'Ana López' }, ...]
  },
});

ti.getTags();
// → [{ uid: 'ana@mail.com', name: 'Ana López' }]
```

---

## Static suggestions / Sugerencias estáticas

```js
new MTS.TagInput('#el', {
  suggestions: [
    { uid: 'ana@mail.com',    name: 'Ana López'    },
    { uid: 'carlos@mail.com', name: 'Carlos Ruiz'  },
    { uid: 'maria@mail.com',  name: 'María Torres' },
  ],
});
```

---

## Pre-loaded tags / Tags precargados

```js
new MTS.TagInput('#el', {
  tags: [
    { uid: 'ana@mail.com', name: 'Ana López' },
  ],
});
```

---

## Options / Opciones

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tags` | `{ uid, name }[]` | `[]` | Initial tags / Tags iniciales |
| `suggestions` | `{ uid, name }[]` | `[]` | Static suggestions / Sugerencias estáticas |
| `label` | `string` | `''` | Field label / Etiqueta |
| `placeholder` | `string` | `'Agregar...'` | Input placeholder |
| `maxTags` | `number\|null` | `null` | Max tags allowed / Máximo de tags |
| `allowCustom` | `boolean` | `true` | Allow free-text tags / Permitir texto libre |
| `allowDuplicates` | `boolean` | `false` | Allow duplicate uids / Permitir duplicados |
| `debounce` | `number` | `300` | Debounce ms for onSearch |
| `onSearch` | `async (q) => { uid, name }[]` | `null` | Async search handler |
| `onChange` | `(e) => void` | — | Fires on tag add/remove |
| `onAdd` | `(e) => void` | — | Fires when tag is added |
| `onRemove` | `(e) => void` | — | Fires when tag is removed |

---

## API

```js
ti.getTags()                           // → [{ uid, name }, ...]
ti.setTags([{ uid, name }])            // replace all tags
ti.addTag({ uid: 'x@y.com', name: 'X' }) // add one tag
ti.removeTag('x@y.com')               // remove by uid
ti.setSuggestions([{ uid, name }])    // replace suggestions
ti.on('change', (e) => e.detail.tags) // [{ uid, name }, ...]
ti.on('add',    (e) => e.detail.tag)  // { uid, name }
ti.on('remove', (e) => e.detail.tag)  // { uid, name }
ti.destroy()
```

---
