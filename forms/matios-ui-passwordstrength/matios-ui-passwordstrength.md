# MTS.PasswordStrength

Real-time password-strength meter for a password input. It binds to an `MTS.Input` instance (detected automatically) or to a native `<input>`, evaluates configurable rules on every keystroke, and renders a 4-segment bar, a strength label, and an optional rule checklist. `isValid()` makes it easy to gate a form with `MTS.Validate`.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-input.css">
<link rel="stylesheet" href="matios-ui-passwordstrength.css">
<script src="matios-ui-input.js"></script>
<script src="matios-ui-passwordstrength.js"></script>

<!-- Optional: load i18n if you switch languages at runtime -->
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-passwordstrength-i18n.js"></script>
```

---

## Usage

```js
const inPass = new MTS.Input('#s1-pass', {
  label:       'Password',
  type:        'password',
  placeholder: '••••••••',
});

new MTS.PasswordStrength('#s1-meter', {
  input:     inPass,
  minLength: 8,
});
```

Full rule set (matches demo section 2):

```js
new MTS.PasswordStrength('#s2-meter', {
  input:          inPass,
  minLength:      8,
  minUppercase:   1,
  minLowercase:   1,
  minNumbers:     1,
  minSpecial:     1,
  allowedSpecial: '!@#$%^&*',
});
```

Bar only (no checklist):

```js
new MTS.PasswordStrength('#s3-meter', {
  input:          inPass,
  minLength:      6,
  minNumbers:     1,
  minSpecial:     1,
  allowedSpecial: '!@#$%',
  showChecklist:  false,
});
```

---

## Constructor

```js
new MTS.PasswordStrength(container, options)
```

- `container` — a CSS selector string or a DOM element. The meter (bar, label, checklist) is rendered inside it. If the container is not found, the component logs an error and does nothing.
- `options` — see below.

The `container` is where the meter renders; the password field itself is the separate `input` you pass in `options`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `input` | `MTS.Input \| HTMLElement` | `null` | Password input the meter observes. Accepts an `MTS.Input` instance (its `_inputEl` / `getValue()` are used) or a native input element. Without it the meter renders but never updates |
| `minLength` | `number` | — | Minimum password length. Omit to skip this rule |
| `maxLength` | `number` | — | Maximum length. Also applied as the `maxlength` attribute on the native input, so the user cannot type beyond it |
| `minUppercase` | `number` | — | Minimum uppercase letters `[A-Z]` |
| `minLowercase` | `number` | — | Minimum lowercase letters `[a-z]` |
| `minNumbers` | `number` | — | Minimum digits `[0-9]` |
| `minSpecial` | `number` | — | Minimum special symbols (from `allowedSpecial`) |
| `allowedSpecial` | `string` | `` '!@#$%^&*()_+-=[]{}\|;:,.<>?' `` | Set of characters that count as "special" for the `minSpecial` rule. Only used when `minSpecial` is set |
| `showChecklist` | `boolean` | `true` | Show the rule checklist below the bar. When `false`, only the bar and label render |
| `onChange` | `function` | `null` | Called on every evaluation with `{ score, level, isValid, results }` |

Each `min*` / `maxLength` rule is added only when its option is provided. The checklist shows one item per active rule; when a value is present, passing items get a `✓` icon.

> **Note:** there is no `showBar` option — the bar always renders. Only the checklist is toggleable, via `showChecklist`.

---

## Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `isValid()` | `boolean` | `true` only when the score is exactly `100` (every rule passes) |
| `getScore()` | `number` | Current score, `0`–`100` |
| `getLevel()` | `string` | Current level: `'' \| 'weak' \| 'fair' \| 'strong' \| 'very-strong'` (empty when the field is empty) |
| `getResults()` | `Array` | Copy of the per-rule results: `[{ label, ok }]` |
| `destroy()` | `void` | Empties the container and removes the component classes |

---

## Scoring algorithm & strength levels

The score is the percentage of rules that currently pass:

```
score = round(passedRules / totalRules * 100)
```

The strength level derives from the number of active bar segments (out of 4):

- Empty field → `0` segments, level `''` (neutral bar).
- Something typed but no rule passes → `1` segment (level `weak`).
- Otherwise → `min(4, max(1, round(score / 100 * 4)))` segments.

| Level | Active segments | Score band |
|-------|-----------------|-----------|
| `''` (none) | 0 / 4 | empty field |
| `weak` | 1 / 4 | > 0% (up to ~37%) |
| `fair` | 2 / 4 | ~38–62% |
| `strong` | 3 / 4 | ~63–87% |
| `very-strong` | 4 / 4 | ~88–100% |

The root container also gets a matching modifier class: `mts-pwstrength--weak`, `--fair`, `--strong`, or `--very-strong`, which drives the bar color (danger / warning / info / success). `isValid()` is independent of the level — it is `true` only at score `100`.

---

## Events

| Callback | Payload | When |
|----------|---------|------|
| `onChange` | `{ score, level, isValid, results }` | Fired on construction and on every `input` event of the bound field |

```js
new MTS.PasswordStrength('#s5-meter', {
  input:     inPass,
  minLength: 8,
  minUppercase: 1,
  minNumbers:   1,
  minSpecial:   1,
  onChange: function (data) {
    console.log(data.score);    // 0-100
    console.log(data.level);    // 'weak' | 'fair' | 'strong' | 'very-strong'
    console.log(data.isValid);  // boolean
    console.log(data.results);  // [{ label, ok }]
  },
});
```

---

## Integration with MTS.Validate

`isValid()` returns `true` only when every rule passes, so it works as a `custom` rule:

```js
const meter = new MTS.PasswordStrength('#meter', {
  input:     inPass,
  minLength: 8,
});

new MTS.Validate(form, {
  rules: {
    password: {
      custom: function () {
        return meter.isValid() || 'The password does not meet the requirements.';
      },
    },
  },
  onValid: function (data) {
    savePassword(data);
  },
});
```

---

## Internationalization (i18n)

The meter's own chrome — the strength labels (`Weak` / `Fair` / `Strong` / `Very strong`) and the auto-generated rule descriptions ("Minimum 8 characters", "At least 1 uppercase letter", …) — is localized through the global MTS i18n table under the `MTS.PasswordStrength` namespace. Bundled languages: `es`, `en`, `pt`.

Set the language once at startup, before creating components:

```js
MTS.setLanguage('en');          // 'es' | 'en' | 'pt'
MTS.getLanguage();              // → 'en'
MTS.getString()['MTS.PasswordStrength'];  // active-language strings for this component
```

Components already on the page do not re-localize automatically; set the language before constructing them (or re-create them after switching).

This component has no `labels` / `levels` option — the strength labels and rule descriptions come entirely from the active language of the shared MTS i18n table (namespace `MTS.PasswordStrength`), so the wording follows `MTS.setLanguage(...)`. The bundled keys are `levelWeak`, `levelFair`, `levelStrong`, `levelVeryStrong`, and the singular/plural rule pairs `minLength_one`/`minLength_many`, `maxLength_one`/`_many`, `minUppercase_one`/`_many`, `minLowercase_one`/`_many`, `minNumbers_one`/`_many`, `minSpecial_one`/`_many`. Rule strings use the `{n}` placeholder (count) and, for `minSpecial`, `{list}` (the allowed-symbol preview).

---

## Accessibility

- The meter complements (does not replace) clear text requirements — the checklist conveys which rules pass.
- Consider wrapping the level label in an `aria-live` region so screen-reader users hear strength changes.
