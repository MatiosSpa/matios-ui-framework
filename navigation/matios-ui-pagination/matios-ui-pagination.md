# MTS.Pagination

Paginación completa con resumen "Mostrando X-Y de Z", selector de page size y salto directo a página.

## Uso
```js
const pag = new MTS.Pagination('#el', {
  total:    500,
  page:     1,
  pageSize: 10,
  onChange: (e) => {
    console.log(e.detail.page, e.detail.pageSize)
    cargarDatos(e.detail.page, e.detail.pageSize)
  },
})
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `total` | `number` | `0` | Total de registros |
| `page` | `number` | `1` | Página actual |
| `pageSize` | `number` | `10` | Registros por página |
| `pageSizes` | `Array` | `[10,25,50,100]` | Opciones de tamaño |
| `showSizes` | `boolean` | `true` | Selector de page size |
| `showInfo` | `boolean` | `true` | "Mostrando X-Y de Z" |
| `showJump` | `boolean` | `false` | Input para ir a página |
| `siblings` | `number` | `1` | Páginas a cada lado del activo |
| `size` | `string` | `'md'` | `'sm'`\|`'md'`\|`'lg'` |
| `onChange` | `function` | `null` | `({ page, pageSize, total, from, to }) => {}` |

## API
```js
pag.setPage(3)
pag.setTotal(1200)
pag.setPageSize(25)
pag.getState() // → { page, pageSize, total, from, to }
```

---

## HTML declarativo

```html
<div id="miPag"
  data-total="250"
  data-page="1"
  data-page-size="20"
  data-show-info
  data-show-jump>
</div>

<script>
new MTS.Pagination('#miPag', {
  onChange: ({ page, pageSize }) => cargar(page, pageSize),
})
</script>
```

| Atributo | JS | Descripción |
|----------|-----|-------------|
| `data-total` | `total` | Total de registros |
| `data-page` | `page` | Página actual |
| `data-page-size` | `pageSize` | Por página |
| `data-size` | `size` | `sm`·`''`·`lg` |
| `data-show-info` | `showInfo` | (presencia activa) |
| `data-show-jump` | `showJump` | (presencia activa) |

