# matios-ui-taginput

Input de etiquetas con sugerencias, debounce y búsqueda asíncrona.

## Instalación
```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-taginput.css">
<script src="matios-ui-taginput.js"></script>
```

## Uso rápido
```js
const taginput = new MTS.TagInput('#tags', {
  label:       'Etiquetas',
  placeholder: 'Agregar etiqueta...',
  tags:        ['urgente', 'revisión'],
  suggestions: ['urgente', 'pendiente', 'aprobado', 'rechazado', 'revisión'],
  onChange:    (e) => console.log(e.detail.tags),
})
```

## Con búsqueda asíncrona
```js
new MTS.TagInput('#tags', {
  allowCustom: false,
  debounce:    300,
  onSearch: async (query) => {
    const results = await api.searchTags(query)
    taginput.setSuggestions(results)
  },
})
```

## API
```js
taginput.getTags()              // → string[]
taginput.setTags(['a', 'b'])
taginput.addTag('nuevo')
taginput.removeTag('urgente')
taginput.setSuggestions([...]) // actualizar sugerencias
```

## Eventos DOM
| Evento | Namespace |
|--------|-----------|
| `add`    | `mts:taginput:add` |
| `remove` | `mts:taginput:remove` |
| `change` | `mts:taginput:change` |

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial |

---

## HTML declarativo

```html
<div id="miTags"
  data-label="Tecnologías"
  data-placeholder="Agrega..."
  data-max-tags="5"
  data-allow-custom>
</div>

<script>
new MTS.TagInput('#miTags', {
  tags: ['JavaScript', 'CSS'],
  onAdd:    (tag) => console.log('add:', tag),
  onRemove: (tag) => console.log('remove:', tag),
})
</script>
```

| Atributo | JS | Descripción |
|----------|-----|-------------|
| `data-label` | `label` | |
| `data-placeholder` | `placeholder` | |
| `data-max-tags` | `maxTags` | Máximo de tags |
| `data-allow-duplicates` | `allowDuplicates` | (presencia activa) |
| `data-allow-custom` | `allowCustom` | (presencia activa) |
| `data-disabled` | `disabled` | (presencia activa) |

