# MTS.CommandPalette

Paleta de comandos tipo ⌘K. Búsqueda en tiempo real, grupos, shortcuts, navegación por teclado.

## Uso
```js
const palette = new MTS.CommandPalette({
  hotkey: 'k',  // Ctrl+K / ⌘K para abrir
  commands: [
    { id:'new',    label:'Nuevo documento', group:'Archivo', shortcut:'⌘N',
      icon: MTS.Icon.get('file'),   action: () => crearDoc() },
    { id:'save',   label:'Guardar',         group:'Archivo', shortcut:'⌘S',
      icon: MTS.Icon.get('save'),   action: () => guardar() },
    { id:'search', label:'Buscar usuarios', group:'Usuarios',
      keywords: ['user', 'persona'], action: () => buscarUsuarios() },
  ],
  onSelect: ({ command }) => console.log('ejecutó:', command.label),
})
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `commands` | `Array` | `[]` | Lista de comandos |
| `placeholder` | `string` | `'Buscar comando...'` | |
| `hotkey` | `string` | `'k'` | Tecla para ⌘+key / Ctrl+key |
| `maxResults` | `number` | `8` | Máximo resultados |
| `onSearch` | `function` | `null` | `(query) => commands[]` para búsqueda async |
| `onSelect` | `function` | `null` | `({ command }) => {}` |
| `onOpen` / `onClose` | `function` | `null` | |

## Estructura de comando
```js
{
  id:          'cmd-id',
  label:       'Nombre del comando',
  description: 'Descripción corta',
  group:       'Nombre del grupo',
  icon:        '<svg>...</svg>',
  shortcut:    '⌘K',
  keywords:    ['alias', 'búsqueda'],
  action:      (cmd) => {},
  disabled:    false,
}
```

## API
```js
const p = new MTS.CommandPalette({ commands: [...] })
p.open()
p.close()
p.toggle()
p.setCommands([...])
p.addCommands([...])
p.destroy()
```

## Búsqueda async
```js
new MTS.CommandPalette({
  onSearch: async (query) => {
    const res = await fetch('/api/search?q=' + query)
    return res.json()
  },
})
```
