# Themes — Matios UI

Arquitectura oficial de temas basada en:

- **Modes**
  - `matios-ui-mode-dark.css`
  - `matios-ui-mode-light.css`
  - `matios-ui-mode-high-contrast.css`
- **Accents**
  - `matios-ui-accent-corporate.css`
  - `matios-ui-accent-navy.css`
  - `matios-ui-accent-emerald.css`
  - `matios-ui-accent-petrol.css`
  - `matios-ui-accent-blue.css`
  - `matios-ui-accent-olive.css`
  - `matios-ui-accent-violet.css`

## Regla base

- `data-mts-mode` define la base visual completa.
- `data-mts-accent` es opcional y redefine como minimo la familia primaria; tambien puede ajustar el accent decorativo si el theme lo necesita.
- `high-contrast` funciona completo por sí solo.

## Activación

```html
<html data-mts-mode="dark">
<html data-mts-mode="light">
<html data-mts-mode="high-contrast">

<html data-mts-mode="dark" data-mts-accent="violet">
<html data-mts-mode="light" data-mts-accent="olive">
<html data-mts-mode="dark" data-mts-accent="corporate">
<html data-mts-mode="light" data-mts-accent="petrol">
```

## CSS a importar

```html
<link rel="stylesheet" href="../base/matios-ui-base.css">

<link rel="stylesheet" href="../themes/matios-ui-mode-dark.css">
<link rel="stylesheet" href="../themes/matios-ui-mode-light.css">
<link rel="stylesheet" href="../themes/matios-ui-mode-high-contrast.css">

<link rel="stylesheet" href="../themes/matios-ui-accent-corporate.css">
<link rel="stylesheet" href="../themes/matios-ui-accent-navy.css">
<link rel="stylesheet" href="../themes/matios-ui-accent-emerald.css">
<link rel="stylesheet" href="../themes/matios-ui-accent-petrol.css">
<link rel="stylesheet" href="../themes/matios-ui-accent-violet.css">
<link rel="stylesheet" href="../themes/matios-ui-accent-olive.css">
<link rel="stylesheet" href="../themes/matios-ui-accent-blue.css">
```

## High contrast

`matios-ui-mode-high-contrast.css` es un **mode** completo:

- negro puro
- texto blanco
- foco reforzado
- bordes muy visibles
- paleta pensada para accesibilidad

No necesita accent para funcionar.

Si un integrador además carga un accent encima, la mezcla queda bajo su responsabilidad.

## Crear un mode custom

```css
[data-mts-mode="mi-empresa"] {
  --mts-bg-body:      #1a0a0a;
  --mts-bg-surface:   #220d0d;
  --mts-bg-surface-2: #2d1010;

  --mts-text-primary:   #f8eaea;
  --mts-text-secondary: #c9aaaa;
  --mts-text-muted:     #7a5555;

  --mts-border-color:       #3d1515;
  --mts-border-color-focus: #e63946;
}
```

## Crear un accent custom

```css
[data-mts-accent="brand"] {
  --mts-color-primary:        #e63946;
  --mts-color-primary-hover:  #c1121f;
  --mts-color-primary-light:  rgba(230,57,70,.12);
  --mts-color-primary-text:   #ffffff;
  --mts-btn-shadow-primary:   0 4px 14px rgba(230,57,70,.4);
  --mts-btn-ring-primary:     0 0 0 3px rgba(230,57,70,.25);
  --mts-border-color-focus:   #e63946;
  --mts-color-accent:         #7c3aed;
  --mts-color-accent-hover:   #6d28d9;
  --mts-color-accent-text:    #ffffff;
}
```

## Nota de limpieza

`matios-ui-theme-high-contrast.css` pasa a ser `matios-ui-mode-high-contrast.css`.

Si quieres dejar el árbol limpio, elimina el archivo legacy anterior al aplicar este cambio.
