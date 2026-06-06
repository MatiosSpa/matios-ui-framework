# MTS.PasswordStrength

Real-time password-strength meter. Integrates with `MTS.Input` — it detects the instance automatically. Works with `MTS.Validate` via a `custom` rule.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-input.css">
<link rel="stylesheet" href="matios-ui-passwordstrength.css">
<script src="matios-ui-input.js"></script>
<script src="matios-ui-passwordstrength.js"></script>
```

---

## Usage

```js
// Basic
const inPass = new MTS.Input('#field-pass', { label: 'Password', type: 'password' });
new MTS.PasswordStrength('#meter', { input: inPass, minLength: 8 });

// Full rule set
new MTS.PasswordStrength('#meter', {
  input:          inPass,
  minLength:      8,
  minUppercase:   1,
  minLowercase:   1,
  minNumbers:     1,
  minSpecial:     1,
  allowedSpecial: '!@#$%^&*',
});

// Bar only (no checklist)
new MTS.PasswordStrength('#meter', { input: inPass, minLength: 8, showChecklist: false });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `input` | `MTS.Input \| HTMLElement` | — | Input it binds to (**required**) |
| `minLength` | `number` | — | Minimum password length |
| `maxLength` | `number` | — | Maximum length. Applied as `maxlength` on the native input — the user cannot type more |
| `minUppercase` | `number` | — | Minimum uppercase letters |
| `minLowercase` | `number` | — | Minimum lowercase letters |
| `minNumbers` | `number` | — | Minimum digits |
| `minSpecial` | `number` | — | Minimum special symbols |
| `allowedSpecial` | `string` | ``'!@#$%^&*()_+-=[]{}|;:,.<>?'`` | Allowed special symbols |
| `showChecklist` | `boolean` | `true` | Show the rule checklist below the bar |
| `onChange` | `function` | — | Score callback — `({ score, level, isValid, results })` |

---

## API

| Method | Description |
|--------|-------------|
| `isValid()` | `true` only when 100% of the rules pass |
| `getScore()` | Score `0–100` |
| `getLevel()` | `'' \| 'weak' \| 'fair' \| 'strong' \| 'very-strong'` |
| `getResults()` | `[{ label, ok }]` |
| `destroy()` | Clear the container and remove classes |

### Levels

| Level | Color | Active segments |
|-------|-------|-----------------|
| `weak` | danger | 1 / 4 |
| `fair` | warning | 2 / 4 |
| `strong` | info | 3 / 4 |
| `very-strong` | success | 4 / 4 |

The level is computed from the percentage of passing rules (0–100%). An empty field shows a neutral bar (no level).

### Integration with MTS.Validate

`isValid()` returns `true` only when every rule passes — use it as a `custom` rule:

```js
const meter = new MTS.PasswordStrength('#meter', { input: inPass, minLength: 8 });

new MTS.Validate(form, {
  rules: {
    password: { custom: function () { return meter.isValid() || 'The password does not meet the requirements.'; } },
  },
  onValid: function (data) { savePassword(data); },
});
```

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onChange(fn)` | `{ score, level, isValid, results }` | The score changes |

---

## Accessibility

- The meter complements (does not replace) clear text requirements — the checklist conveys which rules pass.
- Consider an `aria-live` region for the level text so screen-reader users hear strength changes.

---

## Changelog

### Initial
- Real-time password-strength meter bound to `MTS.Input`, configurable rules (length/upper/lower/number/special),
  4 strength levels, rule checklist, `MTS.Validate` integration, and `isValid` / `getScore` / `getLevel` / `getResults`.
