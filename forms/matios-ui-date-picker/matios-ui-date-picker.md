# MTS.DatePicker

[EN] Date, time, range, month and week selectors. Each type is an independent class extending a common base. Zero dependencies.
[ES] Selectores de fecha, hora, rango, mes y semana. Cada tipo es una clase independiente que extiende una base común. Cero dependencias.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-picker.css">

<!-- Load only what you need / Cargar solo los que necesitas -->
<script src="matios-ui-picker-base.js"></script>
<script src="matios-ui-picker-date.js"></script>
<script src="matios-ui-picker-time.js"></script>
<script src="matios-ui-picker-datetime.js"></script>
<script src="matios-ui-picker-daterange.js"></script>
<script src="matios-ui-picker-month.js"></script>
<script src="matios-ui-picker-week.js"></script>
```

---

## MTS.DatePicker.Date — Date only / Solo fecha

```js
const dp = new MTS.DatePicker.Date('#mi-input', {
  format:       'DD/MM/YYYY',
  locale:       'es-CL',
  clearable:    true,
  minDate:      new Date('2024-01-01'),
  maxDate:      new Date('2025-12-31'),
  disabledDays: [0, 6],   // 0=Sun/Dom, 6=Sat/Sáb
  onChange:     (e) => console.log(e.detail.value, e.detail.formatted),
});

dp.setValue(new Date());
dp.getValue();   // → Date
dp.clear();
```

---

## MTS.DatePicker.Time — Time only / Solo hora

```js
new MTS.DatePicker.Time('#mi-input', {
  timeStep:  15,    // step in minutes / paso en minutos
  startHour: 8,
  endHour:   20,
  btnNow:    'Ahora',
  btnAccept: 'Aceptar',
  onChange:  (e) => console.log(e.detail.formatted),  // → '09:30'
});
```

---

## MTS.DatePicker.DateTime — Date + Time / Fecha + Hora

```js
new MTS.DatePicker.DateTime('#mi-input', {
  format:    'DD/MM/YYYY',
  timeStep:  5,
  btnToday:  'Hoy',
  btnAccept: 'Aceptar',
  onChange:  (e) => console.log(e.detail.value, e.detail.formatted),
});
```

---

## MTS.DatePicker.DateRange — Date range / Rango de fechas

```js
const rp = new MTS.DatePicker.DateRange('#mi-input', {
  format:    'DD/MM/YYYY',
  btnClear:  'Limpiar',
  btnAccept: 'Aplicar',
  onChange:  (e) => {
    console.log(e.detail.value.start);   // Date start / Date inicio
    console.log(e.detail.value.end);     // Date end / Date fin
    console.log(e.detail.formatted);     // '01/03/2025 → 15/03/2025'
  },
});

rp.setValue([new Date('2025-03-01'), new Date('2025-03-15')]);
rp.getValue();   // → { start: Date, end: Date }
```

---

## MTS.DatePicker.Month — Month & Year / Mes y Año

```js
new MTS.DatePicker.Month('#mi-input', {
  onChange: (e) => console.log(e.detail.formatted),  // → '03/2025'
});
```

---

## MTS.DatePicker.Week — Week / Semana

```js
new MTS.DatePicker.Week('#mi-input', {
  onChange: (e) => {
    console.log(e.detail.value.start);   // Monday / lunes de la semana
    console.log(e.detail.value.end);     // Sunday / domingo de la semana
    console.log(e.detail.formatted);     // 'Semana 12 - 2025'
  },
});
```

---

---

## Common API / API común

```js
picker.open()
picker.close()
picker.getValue()        // → value by type / valor según tipo
picker.setValue(...)     // chainable
picker.clear()
picker.destroy()

// Events / Eventos
picker.on('change', (e) => {
  e.detail.value;       // native value / valor nativo (Date, string, objeto)
  e.detail.formatted;   // formatted string / string formateado en el input
});
picker.on('open',  () => {});
picker.on('close', () => {});

// DOM events / Eventos DOM
document.getElementById('mi-input')
  .addEventListener('mts:picker:change', (e) => {
    console.log(e.detail.value, e.detail.formatted);
  });
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 2.0.0 | [EN] Split into individual classes. MTS.DatePicker.Month, Week, Color added. / [ES] Separado en clases individuales. MTS.DatePicker.Month, Week, Color nuevos. |
| 1.0.0 | [EN] Initial release (single class with modes) / [ES] Release inicial (clase única con modos) |
