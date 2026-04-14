# MTS.PhoneInput

[EN] Phone input with integrated country selector, emoji flag, automatic formatting and country search. 20 countries included. Zero dependencies.
[ES] Input de teléfono con selector de país integrado, bandera emoji, formato automático y búsqueda de países. 20 países incluidos. 0 dependencias.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-phoneinput.css">
<script src="matios-ui-phoneinput.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `country` | `string` | `'CL'` | [EN] Initial ISO country code / [ES] Código ISO de país inicial |
| `value` | `string` | `''` | [EN] Initial phone digits / [ES] Dígitos iniciales |
| `label` | `string` | `''` | [EN] Field label / [ES] Etiqueta del campo |
| `hint` | `string` | `''` | [EN] Helper text / [ES] Texto de ayuda |
| `disabled` | `boolean` | `false` | [EN] Disables interaction / [ES] Deshabilita la interacción |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` |
| `onChange` | `function` | — | [EN] Fires on value or country change / [ES] Se dispara al cambiar valor o país |
| `onCountryChange` | `function` | — | [EN] Fires only when country changes / [ES] Se dispara solo al cambiar el país |

---

## Events / Eventos

[EN] Use `onChange` and `onCountryChange` in the constructor. This is the recommended approach.
[ES] Usa `onChange` y `onCountryChange` en el constructor. Este es el enfoque recomendado.

```js
new MTS.PhoneInput('#my-phone', {
  // Fires when phone number or country changes
  // Se dispara al cambiar el número o el país
  onChange: (e) => {
    console.log(e.detail.raw);       // → '912345678'
    console.log(e.detail.formatted); // → '9 1234 5678'
    console.log(e.detail.full);      // → '+56 9 1234 5678'
    console.log(e.detail.country);   // → 'CL'
  },

  // Fires only when country selector changes
  // Se dispara solo al cambiar el selector de país
  onCountryChange: (e) => {
    console.log(e.detail.country); // → 'MX'
  },
});
```

---

## HTML Usage / Uso HTML

```html
<div id="phone-contact"
  data-label="Phone number"
  data-country="CL">
</div>

<script>
  new MTS.PhoneInput('#phone-contact', {
    onChange: (e) => {
      console.log(e.detail.full); // → '+56 9 1234 5678'
    },
    onCountryChange: (e) => {
      console.log('Country changed to:', e.detail.country);
    },
  });
</script>
```

[EN] Available `data-*` attributes:
[ES] Atributos `data-*` disponibles:

| Attribute / Atributo | JS Option | Description / Descripción |
|----------------------|-----------|---------------------------|
| `data-label` | `label` | [EN] Field label / [ES] Etiqueta |
| `data-placeholder` | `placeholder` | |
| `data-hint` | `hint` | [EN] Helper text / [ES] Texto de ayuda |
| `data-value` | `value` | [EN] Initial digits / [ES] Dígitos iniciales |
| `data-country` | `country` | [EN] ISO code (`CL`, `AR`, `MX`...) / [ES] Código ISO |
| `data-disabled` | `disabled` | [EN] Presence activates / [ES] Presencia activa |
| `data-size` | `size` | `sm` · `md` · `lg` |

---

## JavaScript Usage / Uso JavaScript

```js
const phone = new MTS.PhoneInput('#my-phone', {
  // Initial country (ISO code) / País inicial (código ISO)
  country: 'CL',

  // Field label / Etiqueta del campo
  label: 'Phone number',

  // Size: 'sm' | 'md' | 'lg' / Tamaño
  size: 'md',

  // Fires on value or country change / Se dispara al cambiar valor o país
  onChange: (e) => {
    console.log(e.detail.full); // → '+56 9 1234 5678'
  },

  // Fires only on country change / Se dispara solo al cambiar el país
  onCountryChange: (e) => {
    console.log(e.detail.country); // → 'MX'
  },
});
```

---

## API

```js
const phone = new MTS.PhoneInput('#my-phone', { ... });

// Get current value / Obtener valor actual
phone.getValue()
// → { raw: '912345678', formatted: '9 1234 5678', full: '+56 9 1234 5678', country: 'CL' }

// Set phone digits programmatically / Establecer dígitos programáticamente
phone.setValue('912345678')

// Change country programmatically / Cambiar país programáticamente
phone.setCountry('MX')

// Error state / Estado de error
phone.setError('Invalid number')
phone.clearError()

// Enable / disable / Habilitar / deshabilitar
phone.disable()
phone.enable()
```

---

## DOM Event / Evento DOM

```js
document.getElementById('my-phone')
  .addEventListener('mts:phoneinput:change', (e) => {
    console.log(e.detail.full); // → '+56 9 1234 5678'
  });
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual docs, standardized structure / [ES] Docs bilingüe, estructura estandarizada |
| 1.0.0 | [EN] Initial release — 20 countries, auto-format, emoji flags / [ES] Versión inicial |
