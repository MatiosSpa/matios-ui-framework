# matios-ui-kpicard

Tarjeta de métrica KPI con tendencia y sparkline SVG.

## Uso
```js
new MTS.KPICard('#card', {
  label:      'Documentos subidos',
  value:      '1,248',
  unit:       '',
  trend:      12.5,              // positivo ↑ verde, negativo ↓ rojo
  trendLabel: 'vs mes anterior',
  sparkline:  [42, 38, 55, 60, 48, 72, 65, 80], // mini gráfico
  variant:    'primary',         // 'default'|'primary'|'success'|'warning'|'danger'
  onClick:    () => {},
})

card.update({ value: '1,300', trend: 4.2 })
```

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — sparkline SVG, tendencia, variantes de color |
