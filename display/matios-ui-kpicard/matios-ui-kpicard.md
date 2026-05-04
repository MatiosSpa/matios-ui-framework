# MTS.KPICard

🇬🇧 KPI metric card with trend indicator, sparkline mini-chart, icon and variants. Supports real-time updates via `update()`.
🇪🇸 Tarjeta de métrica KPI con indicador de tendencia, mini gráfico sparkline, ícono y variantes. Soporta actualizaciones en tiempo real con `update()`.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-kpicard.css">
<script src="matios-ui-kpicard.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `label` | `string` | `''` | 🇬🇧 Metric label / 🇪🇸 Etiqueta de la métrica |
| `value` | `string\|number` | `0` | 🇬🇧 Main value / 🇪🇸 Valor principal |
| `unit` | `string` | `''` | 🇬🇧 Unit suffix: %, $, km, etc. / 🇪🇸 Sufijo de unidad |
| `trend` | `number` | `null` | 🇬🇧 Trend % (positive = up, negative = down) / 🇪🇸 Tendencia % |
| `trendLabel` | `string` | `''` | 🇬🇧 Label next to trend / 🇪🇸 Texto junto a la tendencia |
| `sparkline` | `number[]` | `[]` | 🇬🇧 Data array for mini chart / 🇪🇸 Array de datos para el mini gráfico |
| `variant` | `string` | `'default'` | `'default'` · `'primary'` · `'success'` · `'warning'` · `'danger'` |
| `icon` | `string` | `null` | 🇬🇧 SVG icon string / 🇪🇸 String SVG del ícono |
| `onClick` | `function` | — | 🇬🇧 Fires when card is clicked / 🇪🇸 Se dispara al hacer click |

---

## Events / Eventos

```js
const kpi = new MTS.KPICard('#my-kpi', {
  label: 'Revenue',
  value: 48500,
  unit:  '$',
  // Fires when card is clicked / Se dispara al hacer click en la card
  onClick: (e) => {
    console.log(e.detail.kpi); // → MTS.KPICard instance
  },
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic / Básico
new MTS.KPICard('#kpi-revenue', {
  label:      'Total Revenue',
  value:      48500,
  unit:       '$',
  trend:      12.4,           // positive = up arrow / positivo = flecha arriba
  trendLabel: 'vs last month',
  variant:    'success',
});

// With sparkline / Con sparkline
new MTS.KPICard('#kpi-visits', {
  label:     'Page visits',
  value:     '12,847',
  trend:     -3.2,            // negative = down arrow / negativo = flecha abajo
  sparkline: [45, 52, 38, 65, 48, 72, 61, 83, 55, 90],
  variant:   'primary',
});

// With icon / Con ícono
new MTS.KPICard('#kpi-users', {
  label:   'Active users',
  value:   1284,
  trend:   8.1,
  icon:    '<svg>...</svg>',
  variant: 'primary',
});

// Clickable / Clickeable
new MTS.KPICard('#kpi-orders', {
  label:     'Orders',
  value:     342,
  trend:     5.7,
  clickable: true,
  // Fires on click / Se dispara al hacer click
  onClick:   (e) => router.push('/orders'),
});
```

---

## API

```js
const kpi = new MTS.KPICard('#my-kpi', { label: 'Revenue', value: 0 });

// Update values at runtime / Actualizar valores en tiempo real
kpi.update({
  value:     52300,
  trend:     +8.2,
  sparkline: [50, 60, 45, 70, 55, 80],
})

// Register / remove listeners / Registrar / eliminar listeners
kpi.on('click', (e) => console.log(e.detail.kpi))
kpi.off('click', handler)
```

---

## DOM Event / Evento DOM

```js
document.getElementById('my-kpi')
  .addEventListener('mts:kpicard:click', (e) => {
    console.log(e.detail.kpi);
  });
```

---
