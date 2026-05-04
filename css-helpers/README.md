# CSS Helpers — Matios UI Framework

Clases utilitarias CSS puras (sin JS) que complementan `matios-ui-base.css`.
Inspiradas en las utilidades de Bootstrap 5, adaptadas al sistema de tokens y convención BEM de MTS.

---

## Convención de naming

Este módulo sigue **BEM (Block Element Modifier)**:

```
.mts-{bloque}--{modificador}
        ^^
   doble guión = modificador
```

Ejemplos:
```css
.mts-flex--row              /* flex-direction: row */
.mts-align-items--center    /* align-items: center */
.mts-text-color--primary    /* color: var(--mts-text-primary) */
.mts-bg-color--danger       /* background-color: var(--mts-color-danger) */
.mts-rounded--lg            /* border-radius: var(--mts-radius-lg) */
.mts-shadow--sm             /* box-shadow: var(--mts-shadow-sm) */
```

**Excepción:** spacing (`m-*`, `p-*`, `gap-*`) y display (`d-*`) usan naming plano
porque la escala numérica o el patrón Bootstrap ya son autoexplicativos.

---

## Uso

### Todo en uno (barrel)
```html
<link rel="stylesheet" href="css-helpers/matios-ui-css-helpers.css">
```

### Por módulo (recomendado en producción)
```html
<link rel="stylesheet" href="css-helpers/matios-ui-helpers-spacing.css">
<link rel="stylesheet" href="css-helpers/matios-ui-helpers-flex.css">
```

---

## Archivos

| Archivo | Prioridad | Clases clave |
|---------|-----------|-------------|
| `helpers-spacing.css` | 🔴 Alta | `mts-m-*`, `mts-p-*`, `mts-gap-*` |
| `helpers-display.css` | 🔴 Alta | `mts-d-none`, `mts-d-flex` |
| `helpers-flex.css` | 🔴 Alta | `mts-flex--row`, `mts-align-items--center`, `mts-justify-content--between` |
| `helpers-sizing.css` | 🔴 Alta | `mts-w--100`, `mts-h--auto`, `mts-min-vh--100` |
| `helpers-text.css` | 🔴 Alta | `mts-text--center`, `mts-fw--bold`, `mts-text--truncate` |
| `helpers-colors.css` | 🔴 Alta | `mts-text-color--primary`, `mts-text-color--danger` |
| `helpers-position.css` | 🔴 Alta | `mts-position--absolute`, `mts-top--0`, `mts-translate-middle` |
| `helpers-background.css` | 🟡 Media | `mts-bg-color--primary`, `mts-bg-color--surface` |
| `helpers-borders.css` | 🟡 Media | `mts-border`, `mts-rounded--lg`, `mts-border-color--danger` |
| `helpers-shadows.css` | 🟡 Media | `mts-shadow--sm`, `mts-shadow--lg` |
| `helpers-overflow.css` | 🟡 Media | `mts-overflow-hidden`, `mts-overflow-y-auto` |
| `helpers-interactions.css` | 🟡 Media | `mts-pe--none`, `mts-user-select--none`, `mts-cursor--pointer` |
| `helpers-visibility.css` | 🟢 Baja | `mts-visible`, `mts-invisible`, `mts-sr-only`, `mts-opacity--50` |
| `helpers-vertical-align.css` | 🟢 Baja | `mts-align--middle`, `mts-align--top` |
| `helpers-float.css` | 🟢 Baja | `mts-float--left`, `mts-clearfix` |

---

## Diferencia con base.css

`matios-ui-base.css` ya incluye un subconjunto básico de utilidades para uso inmediato.
Este módulo es la versión **completa y estandarizada** con BEM, ideal para proyectos que
necesitan la cobertura total de utilidades sin importar Bootstrap.

Los aliases de compatibilidad en `base.css` (naming antiguo) serán eliminados una vez
completada la barrida de componentes (TAREA-22 del changelog).
