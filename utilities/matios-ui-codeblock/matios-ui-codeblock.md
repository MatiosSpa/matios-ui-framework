# MTS.CodeBlock

Bloque de codigo reutilizable con syntax highlighting y copia opcional.

## Uso minimo

```html
<div id="snippet"></div>
```

```javascript
new MTS.CodeBlock('#snippet', {
  title: 'index.html',
  subtitle: 'apps/users/index.html',
  language: 'html',
  code: '<section class="mts-surface">...</section>'
});
```

## Opciones

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `code` | `string` | `''` | Texto fuente a renderizar |
| `language` | `string` | `'text'` | Lenguaje o alias (`js`, `ts`, `cs`, `html`, `sql`, etc.) |
| `title` | `string` | `''` | Titulo corto del snippet |
| `subtitle` | `string` | `''` | Meta secundaria, por ejemplo ruta del archivo |
| `copyable` | `boolean` | `true` | Muestra accion de copiado |
| `wrap` | `boolean` | `false` | Activa `pre-wrap` para lineas largas |

## Metodos

```javascript
const block = new MTS.CodeBlock('#snippet', { code: 'const ok = true;', language: 'javascript' });

block.setCode('const ok = false;');
block.setLanguage('typescript');
block.setTitle('main.ts', 'src/main.ts');
```

## Lenguajes soportados

- `html`
- `xml`
- `css`
- `javascript`
- `typescript`
- `jsx`
- `tsx`
- `json`
- `csharp`
- `java`
- `sql`
- `bash`
- `powershell`
- `yaml`
- `text`

## Alias utiles

- `js` -> `javascript`
- `ts` -> `typescript`
- `cs` -> `csharp`
- `sh` -> `bash`
- `ps1` -> `powershell`
- `markup` -> `html`
- `scss` / `less` -> `css`

## Notas

- Si `MTS.CopyButton` esta cargado, `CodeBlock` lo usa para el boton de copia.
- Si no esta disponible, hace fallback a un boton simple con clipboard nativo.
- El highlighting busca ser claro y consistente, no un parser completo de cada lenguaje.
