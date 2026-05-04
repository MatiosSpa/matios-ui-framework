# MTS.PhoneInput

🇬🇧 Phone input with integrated country selector, emoji flag, automatic formatting and country search. 38 countries included (full Americas + key international markets). Extensible via static methods. Zero dependencies.
🇪🇸 Input de teléfono con selector de país integrado, bandera emoji, formato automático y búsqueda de países. 38 países incluidos (América completa + mercados internacionales clave). Extensible vía métodos estáticos. 0 dependencias.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-phoneinput.css">
<script src="matios-ui-phoneinput.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `country` | `string` | `'CL'` | 🇬🇧 Initial ISO country code / 🇪🇸 Código ISO de país inicial |
| `value` | `string` | `''` | 🇬🇧 Initial phone digits / 🇪🇸 Dígitos iniciales |
| `label` | `string` | `''` | 🇬🇧 Field label / 🇪🇸 Etiqueta del campo |
| `hint` | `string` | `''` | 🇬🇧 Helper text / 🇪🇸 Texto de ayuda |
| `disabled` | `boolean` | `false` | 🇬🇧 Disables interaction / 🇪🇸 Deshabilita la interacción |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` |
| `onChange` | `function` | — | 🇬🇧 Fires on value or country change / 🇪🇸 Se dispara al cambiar valor o país |
| `onCountryChange` | `function` | — | 🇬🇧 Fires only when country changes / 🇪🇸 Se dispara solo al cambiar el país |

---

## Events / Eventos

🇬🇧 Use `onChange` and `onCountryChange` in the constructor. This is the recommended approach.
🇪🇸 Usa `onChange` y `onCountryChange` en el constructor. Este es el enfoque recomendado.

```js
new MTS.PhoneInput('#my-phone', {
  // Fires when phone number or country changes
  // Se dispara al cambiar el número o el país
  onChange: function(e) {
    console.log(e.detail.raw);       // → '912345678'
    console.log(e.detail.formatted); // → '9 1234 5678'
    console.log(e.detail.full);      // → '+56 9 1234 5678'
    console.log(e.detail.country);   // → { code: 'CL', dial: '+56', name: 'Chile', ... }
  },

  // Fires only when country selector changes
  // Se dispara solo al cambiar el selector de país
  onCountryChange: function(e) {
    console.log(e.detail.country); // → { code: 'MX', dial: '+52', name: 'México', ... }
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
    onChange: function(e) {
      console.log(e.detail.full); // → '+56 9 1234 5678'
    },
    onCountryChange: function(e) {
      console.log('Country changed to:', e.detail.country.name);
    },
  });
</script>
```

🇬🇧 Available `data-*` attributes:
🇪🇸 Atributos `data-*` disponibles:

| Attribute / Atributo | JS Option | Description / Descripción |
|----------------------|-----------|---------------------------|
| `data-label` | `label` | 🇬🇧 Field label / 🇪🇸 Etiqueta |
| `data-placeholder` | `placeholder` | 🇬🇧 Placeholder text / 🇪🇸 Texto de marcador |
| `data-hint` | `hint` | 🇬🇧 Helper text / 🇪🇸 Texto de ayuda |
| `data-value` | `value` | 🇬🇧 Initial digits / 🇪🇸 Dígitos iniciales |
| `data-country` | `country` | 🇬🇧 ISO code (`CL`, `AR`, `MX`...) / 🇪🇸 Código ISO |
| `data-disabled` | `disabled` | 🇬🇧 Presence activates / 🇪🇸 Presencia activa |
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
  onChange: function(e) {
    console.log(e.detail.full); // → '+56 9 1234 5678'
  },

  // Fires only on country change / Se dispara solo al cambiar el país
  onCountryChange: function(e) {
    console.log(e.detail.country.code); // → 'MX'
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
  .addEventListener('mts:phoneinput:change', function(e) {
    console.log(e.detail.full); // → '+56 9 1234 5678'
  });
```

---

## Country List / Lista de países

🇬🇧 38 countries are included by default, grouped by region: North America (CA, US, MX), Central America (GT, BZ, HN, SV, NI, CR, PA), Caribbean (CU, DO, HT, JM, PR, TT, BB), South America (CO, VE, GY, SR, BR, EC, PE, BO, PY, AR, CL, UY), Europe (ES, PT, GB, FR, DE, IT) and Asia/Pacific (CN, JP).
🇪🇸 Se incluyen 38 países por defecto, agrupados por región: América del Norte (CA, US, MX), América Central (GT, BZ, HN, SV, NI, CR, PA), Caribe (CU, DO, HT, JM, PR, TT, BB), América del Sur (CO, VE, GY, SR, BR, EC, PE, BO, PY, AR, CL, UY), Europa (ES, PT, GB, FR, DE, IT) y Asia/Pacífico (CN, JP).

---

## Extending Countries / Extender países

🇬🇧 Use the static methods to add countries without modifying the component. If the code already exists it is skipped — no duplicates.
🇪🇸 Usá los métodos estáticos para agregar países sin modificar el componente. Si el código ya existe se omite — sin duplicados.

```js
// Add one country / Agregar un país
// Returns true if added, false if already exists
// Retorna true si se agregó, false si ya existía
MTS.PhoneInput.addCountry({
  code: 'AU',
  dial: '+61',
  flag: '🇦🇺',
  name: 'Australia',
  fmt:  '### ### ###'
});
// → true

// Add multiple / Agregar varios
// Returns { added: N, skipped: M }
// Retorna { added: N, skipped: M }
MTS.PhoneInput.addCountries([
  { code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia',    fmt: '### ### ###'   },
  { code: 'NZ', dial: '+64', flag: '🇳🇿', name: 'Nueva Zelanda', fmt: '## ### ####'   },
  { code: 'CL', dial: '+56', flag: '🇨🇱', name: 'Chile',         fmt: '# #### ####'  }, // already exists
]);
// → { added: 2, skipped: 1 }
```

🇬🇧 Each entry requires: `code` (ISO 3166-1 alpha-2), `dial` (e.g. `'+61'`), `flag` (emoji), `name` (display name), `fmt` (format mask — `#` = digit, other chars = literal separator).
🇪🇸 Cada entrada requiere: `code` (ISO 3166-1 alpha-2), `dial` (ej. `'+61'`), `flag` (emoji), `name` (nombre visible), `fmt` (máscara de formato — `#` = dígito, otros chars = separador literal).

---
