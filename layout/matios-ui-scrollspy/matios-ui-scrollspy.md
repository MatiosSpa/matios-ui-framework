# MTS.ScrollSpy

Detecta la sección visible durante el scroll y resalta el link correspondiente en el nav.

## Uso
```html
<nav id="mi-nav" class="mts-spy-nav mts-spy-nav--indicator">
  <a href="#intro">Introducción</a>
  <a href="#instalacion">Instalación</a>
  <a href="#uso">Uso</a>
</nav>
```
```js
new MTS.ScrollSpy({
  sections: '#intro, #instalacion, #uso',
  nav:       '#mi-nav',
  offset:     80,
  onChange:  ({ id }) => console.log('sección activa:', id),
})
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `sections` | `string\|Array` | — | Selector(es) CSS de las secciones |
| `nav` | `string` | `null` | Selector del contenedor de navegación |
| `linkAttr` | `string` | `'href'` | Atributo del link con el ID |
| `offset` | `number` | `80` | Offset desde el top en px |
| `activeClass` | `string` | `'active'` | Clase CSS para el link activo |
| `onChange` | `function` | `null` | `({ id, section, link }) => {}` |
