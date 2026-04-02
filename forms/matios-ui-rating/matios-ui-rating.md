# matios-ui-rating

Estrellas de valoración con hover, medio punto y readonly.

## Uso
```js
const rating = new MTS.Rating('#rating', {
  value:     3.5,
  max:       5,
  halfStars: true,
  size:      'md',  // 'sm'|'md'|'lg'
  readonly:  false,
  onChange:  (e) => console.log(e.detail.value),
})
rating.getValue()   // → 3.5
rating.setValue(4)
```

## Eventos DOM
| Evento | Namespace |
|--------|-----------|
| `change` | `mts:rating:change` |
| `hover`  | `mts:rating:hover` |

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial |

---

## HTML declarativo

```html
<div id="miRating" data-value="3.5" data-max="5" data-half-stars data-size="lg"></div>

<script>
new MTS.Rating('#miRating', {
  onChange: (v) => console.log('Rating:', v),
})
</script>
```

| Atributo | JS | Descripción |
|----------|-----|-------------|
| `data-value` | `value` | Valor inicial |
| `data-max` | `max` | Total de estrellas |
| `data-half-stars` | `halfStars` | (presencia activa) |
| `data-readonly` | `readonly` | (presencia activa) |
| `data-size` | `size` | `sm`·`md`·`lg` |

