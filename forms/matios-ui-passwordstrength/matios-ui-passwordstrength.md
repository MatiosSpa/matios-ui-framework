# MTS.PasswordStrength

Medidor de fortaleza de contraseña en tiempo real. Se integra con `MTS.Input` — detecta la instancia automáticamente. Compatible con `MTS.Validate` vía regla `custom`.

---

## Instalación

```html
<link rel="stylesheet" href="matios-ui-input.css">
<link rel="stylesheet" href="matios-ui-passwordstrength.css">

<script src="matios-ui-input.js"></script>
<script src="matios-ui-passwordstrength.js"></script>
```

---

## Opciones

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `input` | `MTS.Input \| HTMLElement` | — | Input al que se vincula (obligatorio) |
| `minLength` | `number` | — | Largo mínimo de la contraseña |
| `maxLength` | `number` | — | Largo máximo de la contraseña. Se aplica automáticamente como `maxlength` en el input nativo — el usuario no puede escribir más caracteres. |
| `minUppercase` | `number` | — | Cantidad mínima de letras mayúsculas |
| `minLowercase` | `number` | — | Cantidad mínima de letras minúsculas |
| `minNumbers` | `number` | — | Cantidad mínima de dígitos numéricos |
| `minSpecial` | `number` | — | Cantidad mínima de símbolos especiales |
| `allowedSpecial` | `string` | `'!@#$%^&*()_+-=[]{}|;:,.<>?'` | Símbolos especiales permitidos |
| `showChecklist` | `boolean` | `true` | Muestra el checklist de reglas debajo de la barra |
| `onChange` | `function` | — | Callback al cambiar el puntaje: `({ score, level, isValid, results })` |

---

## API

```js
const meter = new MTS.PasswordStrength('#meter', { input: inPass, minLength: 8, ... });

meter.isValid()    // → boolean — true solo si el 100% de las reglas pasan
meter.getScore()   // → number  — puntaje 0-100
meter.getLevel()   // → string  — '' | 'weak' | 'fair' | 'strong' | 'very-strong'
meter.getResults() // → [{ label: string, ok: boolean }]
meter.destroy()    // limpia el contenedor y remueve clases
```

---

## Niveles

| Nivel | Label | Color | Segmentos activos |
|---|---|---|---|
| `weak` | Débil | danger (rojo) | 1 / 4 |
| `fair` | Regular | warning (naranja) | 2 / 4 |
| `strong` | Fuerte | info (azul) | 3 / 4 |
| `very-strong` | Muy fuerte | success (verde) | 4 / 4 |

El nivel se calcula en función del porcentaje de reglas que pasan (0-100%). El campo vacío siempre muestra la barra en estado neutro (sin nivel).

---

## Uso básico

```js
const inPass = new MTS.Input('#campo-pass', {
  label: 'Contraseña',
  type:  'password',
});

new MTS.PasswordStrength('#meter', {
  input:     inPass,
  minLength: 8,
});
```

---

## Reglas completas

```js
new MTS.PasswordStrength('#meter', {
  input:          inPass,
  minLength:      8,
  minUppercase:   1,
  minLowercase:   1,
  minNumbers:     1,
  minSpecial:     1,
  allowedSpecial: '!@#$%^&*',
});
```

---

## Integración con MTS.Validate

`isValid()` retorna `true` solo cuando el 100% de las reglas pasan. Se usa como regla `custom` en `MTS.Validate`:

```js
const meter = new MTS.PasswordStrength('#meter', {
  input:     inPass,
  minLength: 8,
  // ... más reglas
});

new MTS.Validate(form, {
  rules: {
    password: {
      custom: function() {
        return meter.isValid() || 'La contraseña no cumple los requisitos.';
      },
    },
  },
  onValid: function(data) { guardarClave(data); },
});
```

---

## Solo barra (sin checklist)

```js
new MTS.PasswordStrength('#meter', {
  input:         inPass,
  minLength:     8,
  showChecklist: false,
});
```

---

## Callback onChange

```js
new MTS.PasswordStrength('#meter', {
  input:    inPass,
  // ... reglas
  onChange: function(data) {
    console.log(data.score);    // 0-100
    console.log(data.level);    // 'weak' | 'fair' | 'strong' | 'very-strong'
    console.log(data.isValid);  // boolean
    console.log(data.results);  // [{ label, ok }]
  },
});
```

---
