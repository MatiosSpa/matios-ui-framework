# matios-ui-breadcrumb

Ruta de navegación con separadores configurables y colapso automático.

## Uso
```js
const bc = new MTS.Breadcrumb('#bc', {
  separator: '/',
  maxItems:  4,     // colapsa con "..." si supera
  items: [
    { label: 'Inicio',      href: '/' },
    { label: 'Documentos',  onClick: () => loadDocs() },
    { label: 'Contratos',   onClick: () => loadContracts() },
    { label: 'Contrato #42' },   // último = current
  ],
  onClick: (e) => console.log('Click en:', e.detail.item.label),
})

bc.push({ label: 'Versiones', onClick: () => {} })
bc.pop()
bc.setItems([...])
```

## Eventos DOM
| Evento | Namespace |
|--------|-----------|
| `click` | `mts:breadcrumb:click` |

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial |
