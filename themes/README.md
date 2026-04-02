# Temas — Matios UI

Sistema de temas via CSS Variables. Cada tema redefine las variables de `matios-ui-base.css`.

---

## Temas incluidos

| Archivo | Nombre | Descripción |
|---------|--------|-------------|
| `matios-ui-theme-dark.css`    | `dark`    | Oscuro neutro (default) |
| `matios-ui-theme-light.css`   | `light`   | Claro |
| `matios-ui-theme-violet.css` | `violet` | Púrpura oscuro profundo, Syne en títulos |

---

## Instalación

```html
<!-- Base siempre primero -->
<link rel="stylesheet" href="../base/matios-ui-base.css">

<!-- Luego el tema que quieras usar -->
<link rel="stylesheet" href="../themes/matios-ui-theme-dark.css">
<!-- o -->
<link rel="stylesheet" href="../themes/matios-ui-theme-violet.css">
```

---

## Activar un tema

### Via HTML
```html
<html data-mts-theme="dark">
<html data-mts-theme="light">
<html data-mts-theme="violeta">
```

### Via JavaScript
```js
document.documentElement.setAttribute('data-mts-theme', 'violeta');
```

### Via MTS.Layout
```js
const layout = new MTS.Layout('#app', {
  theme: 'violeta',
  onThemeChange: (t) => localStorage.setItem('mts-theme', t),
});

// Cambiar en runtime
layout.setTheme('dark');
layout.toggleTheme();   // alterna dark ↔ light
layout.getTheme();      // → 'dark'
```

---

## Variables principales

Todas las variables que puedes sobrescribir al crear un tema custom:

```css
[data-mts-theme="mi-tema"] {

  /* ── Colores de acento ── */
  --mts-color-primary:        #ff5500;
  --mts-color-primary-hover:  #e04d00;
  --mts-color-primary-active: #c44400;
  --mts-color-primary-light:  rgba(255,85,0,.12);
  --mts-color-primary-text:   #ffffff;

  --mts-color-accent:         #ffaa00;
  --mts-color-success:        #34d399;
  --mts-color-warning:        #fbbf24;
  --mts-color-danger:         #f87171;
  --mts-color-info:           #38bdf8;

  /* ── Fondos ── */
  --mts-bg-body:      #0a0a0a;
  --mts-bg-surface:   #111111;
  --mts-bg-surface-2: #1a1a1a;

  /* ── Texto ── */
  --mts-text-primary:   #ffffff;
  --mts-text-secondary: #cccccc;
  --mts-text-muted:     #888888;

  /* ── Bordes ── */
  --mts-border-color:       #333333;
  --mts-border-color-focus: #ff5500;

  /* ── Sombras ── */
  --mts-shadow-md: 0 2px 10px rgba(0,0,0,.5);
  --mts-shadow-lg: 0 4px 20px rgba(0,0,0,.6);

  /* ── Tipografía ── */
  --mts-font-family: 'Mi Fuente', sans-serif;
}
```

---

## Crear un tema custom completo

```css
/* mi-empresa-theme.css */
[data-mts-theme="mi-empresa"] {
  --mts-color-primary:       #e63946;   /* rojo corporativo */
  --mts-color-primary-hover: #c1121f;
  --mts-color-primary-light: rgba(230,57,70,.12);
  --mts-color-primary-text:  #ffffff;

  --mts-bg-body:      #1a0a0a;          /* rojo muy oscuro */
  --mts-bg-surface:   #220d0d;
  --mts-bg-surface-2: #2d1010;

  --mts-text-primary:   #f8eaea;
  --mts-text-secondary: #c9aaaa;
  --mts-text-muted:     #7a5555;

  --mts-border-color:       #3d1515;
  --mts-border-color-focus: #e63946;
}

/* Estilos específicos de tu tema */
[data-mts-theme="mi-empresa"] .mts-sidebar {
  background: linear-gradient(180deg, #220d0d, #1a0a0a);
}
```

```js
// Activar
document.documentElement.setAttribute('data-mts-theme', 'mi-empresa');
// o via Layout
layout.setTheme('mi-empresa');
```

---

## Nota sobre el tema `violet`

Requiere las fuentes de Google para los títulos:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet">
```

---

## Changelog

| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — dark, light, violeta |
