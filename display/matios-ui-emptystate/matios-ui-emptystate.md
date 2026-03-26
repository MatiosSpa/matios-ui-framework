# matios-ui-emptystate

Estado vacío con ilustración SVG, título y CTA.

## Uso
```js
new MTS.EmptyState('#empty', {
  variant:     'no-data',     // 'no-data'|'search'|'error'|'permissions'
  title:       'Sin documentos',
  description: 'Sube tu primer documento para comenzar.',
  action:      'Subir documento',
  onAction:    () => uploader.open(),
  size:        'md',           // 'sm'|'md'|'lg'
})

// En DataTable cuando no hay resultados
new MTS.EmptyState('#tabla', {
  variant: 'search',
  title:   'Sin resultados',
  description: `No encontramos resultados para "${query}"`,
})
```

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — 4 variantes con ilustraciones SVG propias |
