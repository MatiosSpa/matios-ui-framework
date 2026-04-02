# matios-ui-select

Select con búsqueda interna, multi-select, grupos y búsqueda externa async.

---

## Instalación
```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-select.css">
<script src="matios-ui-select.js"></script>
```

---

## Uso básico
```js
const sel = new MTS.Select('#mi-select', {
  label: 'País',
  options: [
    { value: 'cl', label: 'Chile' },
    { value: 'pe', label: 'Perú' },
    { value: 'co', label: 'Colombia' },
  ],
  onChange: (e) => console.log(e.detail.value),
})
```

---

## Con grupos
```js
new MTS.Select('#select', {
  options: [
    { value: 'stgo', label: 'Santiago',     group: 'Chile' },
    { value: 'vina', label: 'Viña del Mar', group: 'Chile' },
    { value: 'lima', label: 'Lima',          group: 'Perú' },
  ],
})
```

---

## Multi-select
```js
new MTS.Select('#select', {
  multiple:  true,
  maxSelect: 3,
  options:   [...],
  value:     ['cl', 'pe'],
})
```

---

## Con búsqueda interna
Filtra las opciones ya cargadas — no requiere llamada externa.
```js
new MTS.Select('#select', {
  searchable: true,
  options: [...],
})
```

---

## Con búsqueda externa (onSearch)
El componente **no hace fetch**. Emite el query y el dev decide de dónde vienen los datos.

```js
new MTS.Select('#select', {
  searchable: true,
  placeholder: 'Buscar usuario...',
  debounce: 300,    // ms de espera antes de llamar onSearch
  minChars: 2,      // mínimo de caracteres para disparar

  onSearch: async (query) => {
    // El dev controla completamente la fuente de datos
    const res = await fetch(`/api/usuarios?q=${query}`)
    const data = await res.json()
    // Debe retornar un array de { value, label }
    return data.map(u => ({ value: u.id, label: u.nombre }))
  },

  onChange: (e) => console.log('Seleccionado:', e.detail.value),
})
```

El componente muestra un spinner mientras `onSearch` está en curso.

Si `minChars: 0`, dispara `onSearch` al abrir el dropdown (carga inicial).

---

## Configuración completa
```js
new MTS.Select('#select', {
  // — Datos —
  options:     [],          // opciones iniciales
  value:       null,        // valor inicial (o [] para multiple)

  // — Apariencia —
  label:       'Label',
  placeholder: 'Selecciona...',
  hint:        'Texto de ayuda',

  // — Comportamiento —
  multiple:    false,       // multi-select
  maxSelect:   null,        // límite de selección en multi
  searchable:  false,       // habilitar campo de búsqueda
  clearable:   false,       // botón × para limpiar
  disabled:    false,

  // — Búsqueda externa (opcional) —
  onSearch:    async (query) => [...],  // si se define, búsqueda es externa
  debounce:    300,         // ms antes de llamar onSearch
  minChars:    1,           // mínimo de chars para disparar onSearch (0 = al abrir)

  // — Callbacks —
  onChange: (e) => console.log(e.detail.value),
})
```

---

## API
```js
const sel = new MTS.Select('#select', config)

// Valor
sel.getValue()           // → value | value[]
sel.setValue('cl')
sel.setValue(['cl','pe']) // multi
sel.clear()

// Opciones
sel.setOptions([...])    // reemplaza opciones y re-renderiza

// Estado
sel.open()
sel.close()
sel.toggle()
sel.destroy()

// Eventos
sel.on('change', (e) => console.log(e.detail.value))
sel.on('open',   (e) => {})
sel.on('close',  (e) => {})
sel.off('change', handler)
```

---

## Eventos DOM
| Evento   | Namespace DOM          | Detail                  |
|----------|------------------------|-------------------------|
| `change` | `mts:select:change`    | `{ select, value }`     |
| `open`   | `mts:select:open`      | `{ select }`            |
| `close`  | `mts:select:close`     | `{ select }`            |

```js
document.getElementById('select')
  .addEventListener('mts:select:change', (e) => {
    console.log(e.detail.value)
  })
```

---

## Ejemplo completo — búsqueda con API real
```js
new MTS.Select('#buscar-producto', {
  searchable:  true,
  clearable:   true,
  placeholder: 'Buscar producto...',
  debounce:    400,
  minChars:    2,

  onSearch: async (query) => {
    try {
      const res = await fetch(`https://api.ejemplo.com/productos?q=${encodeURIComponent(query)}`)
      const { items } = await res.json()
      return items.map(p => ({
        value: p.id,
        label: p.nombre,
        group: p.categoria,   // opcional
      }))
    } catch {
      return []
    }
  },

  onChange: (e) => {
    console.log('Producto seleccionado, id:', e.detail.value)
  },
})
```

---

## Changelog
| Versión | Descripción |
|---------|-------------|
| 2.0.0 | `onSearch` externo — el componente ya no hace fetch. Loading spinner. Arquitectura limpia. |
| 1.0.0 | Release inicial |

---

## HTML declarativo

```html
<div id="miSelect"
  data-label="País"
  data-placeholder="Selecciona..."
  data-searchable
  data-clearable>
</div>

<script>
new MTS.Select('#miSelect', {
  options: [
    { value: 'cl', label: '🇨🇱 Chile' },
    { value: 'ar', label: '🇦🇷 Argentina' },
  ],
  onChange: ({ value }) => console.log(value),
})
</script>
```

| Atributo | JS | Descripción |
|----------|-----|-------------|
| `data-label` | `label` | |
| `data-placeholder` | `placeholder` | |
| `data-hint` | `hint` | |
| `data-value` | `value` | Valor inicial |
| `data-multiple` | `multiple` | (presencia activa) |
| `data-searchable` | `searchable` | (presencia activa) |
| `data-clearable` | `clearable` | (presencia activa) |
| `data-disabled` | `disabled` | (presencia activa) |
| `data-max-select` | `maxSelect` | Máximo seleccionables |

