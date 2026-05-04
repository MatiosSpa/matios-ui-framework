# MTS.Topbar

Barra superior para dashboards y apps — brand con logo, slots de contenido configurables, y composición natural con `MTS.SideNav`.

## Uso

```html
<div id="mi-topbar"></div>
```

```js
new MTS.Topbar('#mi-topbar', {
  brand: {
    logo: '<img src="logo.svg" width="28" height="28">',
    title: 'Mi<span style="color:var(--mts-color-primary)">App</span>',
    onClick: function() { /* ir al inicio */ }
  },
  end: '<button class="mts-btn mts-btn--secondary mts-btn--sm">Perfil</button>'
});
```

## Opciones

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `brand` | `object` | `null` | `{ logo, title, subtitle, href, onClick }` |
| `brand.logo` | `string` | — | HTML del logo (imagen, div con gradiente, etc.) |
| `brand.title` | `string` | — | Nombre de la app — acepta HTML para colorear spans |
| `brand.subtitle` | `string` | — | Tagline o versión debajo del título |
| `brand.href` | `string` | — | Si se provee, el brand se renderiza como `<a>` |
| `brand.onClick` | `function` | — | Handler de click en el brand |
| `start` | `string\|Element` | `null` | Slot izquierdo (entre brand y spacer) |
| `center` | `string\|Element` | `null` | Slot central — reemplaza el spacer |
| `end` | `string\|Element` | `null` | Slot derecho |
| `height` | `string` | `null` | Override de `--mts-topbar-height`. Ej: `'50px'` |
| `sticky` | `boolean` | `false` | `position:sticky; top:0` |
| `shadow` | `boolean` | `true` | Box-shadow inferior |
| `border` | `boolean` | `true` | Border-bottom |

## API

```js
var tb = new MTS.Topbar('#el', { brand: { title: 'App' } });

tb.setBrand({ title: 'Nueva App', logo: '...' });
tb.setStart('<span>Breadcrumb</span>');
tb.setEnd('<button>Perfil</button>');
tb.setCenter('<input placeholder="Buscar...">');
tb.getSlot('end');   // → Element del slot end
tb.destroy();
```

| Método | Descripción |
|--------|-------------|
| `setBrand(brand)` | Actualiza el brand y reconstruye |
| `setStart(content)` | Actualiza slot start (HTML o Element) |
| `setEnd(content)` | Actualiza slot end (HTML o Element) |
| `setCenter(content)` | Actualiza slot center (provoca rebuild) |
| `getSlot(name)` | Retorna el Element del slot: `'brand'`, `'start'`, `'center'`, `'spacer'`, `'end'` |
| `destroy()` | Elimina el componente y restaura el DOM |

## Personalizar vía CSS

```css
#mi-topbar {
  --mts-topbar-height: 60px;
  --mts-topbar-bg: var(--mts-bg-surface-2);
  --mts-topbar-shadow: 0 2px 8px rgba(0,0,0,.12);
}
```

| Variable | Default | Descripción |
|----------|---------|-------------|
| `--mts-topbar-height` | `52px` | Altura de la barra |
| `--mts-topbar-bg` | `var(--mts-bg-surface)` | Color de fondo |
| `--mts-topbar-border-color` | `var(--mts-border-color)` | Color del borde inferior y dividers |
| `--mts-topbar-shadow` | `0 1px 4px rgba(0,0,0,.07)` | Sombra inferior |
| `--mts-topbar-padding` | `0 var(--mts-space-4)` | Padding horizontal |
| `--mts-topbar-gap` | `var(--mts-space-3)` | Gap entre secciones |

## Layout con SideNav

La composición estándar de dashboard: topbar en la parte superior + sidenav a la izquierda.

```html
<div style="height:100vh;display:flex;flex-direction:column">
  <div id="topbar"></div>
  <div style="display:flex;flex:1;overflow:hidden">
    <div id="sidenav"></div>
    <main style="flex:1;overflow-y:auto;padding:24px">
      <!-- contenido -->
    </main>
  </div>
</div>
```

```js
new MTS.Topbar('#topbar', {
  brand: { logo: '...', title: 'Mi Dashboard' },
  end: '<button class="mts-btn mts-btn--ghost mts-btn--sm mts-btn--icon">...</button>'
});

new MTS.SideNav('#sidenav', {
  items: [
    { id: 'home',    label: 'Inicio',    icon: '...' },
    { id: 'reports', label: 'Reportes',  icon: '...' },
    { divider: true },
    { id: 'config',  label: 'Config',    icon: '...' },
  ],
  onChange: function(e) { navigate(e.detail.id); }
});
```

## Uso sin JavaScript (HTML puro)

El Topbar también funciona como HTML puro usando las clases directamente:

```html
<header class="mts-topbar">
  <div class="mts-topbar__brand">
    <div class="mts-topbar__logo">
      <img src="logo.svg" width="28" height="28">
    </div>
    <div class="mts-topbar__brand-info">
      <div class="mts-topbar__title">Mi App</div>
      <div class="mts-topbar__subtitle">v1.0.0</div>
    </div>
  </div>
  <div class="mts-topbar__start">
    <!-- contenido opcional izquierdo -->
  </div>
  <div class="mts-topbar__spacer"></div>
  <div class="mts-topbar__end">
    <button class="mts-btn mts-btn--secondary mts-btn--sm">Perfil</button>
  </div>
</header>
```

## Notas

- El elemento `selector` se convierte directamente en `.mts-topbar` — no crea un wrapper extra.
- `getSlot('end')` retorna el Element, por lo que se pueden inyectar componentes MTS directamente (`new MTS.Button(tb.getSlot('end'), { ... })`).
- El divider `<span class="mts-topbar__divider"></span>` puede usarse dentro de cualquier slot para separar grupos de acciones visualmente.
- Para sticky, el elemento padre necesita `height:100vh` o similar para que el sticky funcione correctamente.
