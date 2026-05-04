# Overlays

🇬🇧 Components that layer over the main content: notifications, status feedback, dialogs and tooltips. All manage their own lifecycle (open, animate, close) and are accessible via JS API.
🇪🇸 Componentes que se superponen al contenido principal: notificaciones, feedback de estado, diálogos y tooltips. Todos gestionan su propio ciclo de vida (apertura, animación, cierre) y son accesibles vía API JS.

---

## Components / Componentes

| Componente | Clase JS | 🇬🇧 Description / 🇪🇸 Descripción |
|---|---|---|
| `matios-ui-alert` | `MTS.Alert` | 🇬🇧 Inline alerts and banners — info/success/warning/danger variants, action button and auto-dismiss. / 🇪🇸 Alertas inline y banners — variantes info/success/warning/danger, botón de acción y auto-dismiss. |
| `matios-ui-badge` | `MTS.Badge` | 🇬🇧 Badges, pills and counters — CSS-only or via JS — removable tags and dot notifications. / 🇪🇸 Badges, pills y contadores — CSS-only o vía JS — tags removibles y notificaciones de punto. |
| `matios-ui-lightbox` | `MTS.Lightbox` | 🇬🇧 Media viewer — images, video, YouTube, Vimeo — with zoom, thumbnails and auto-binding. / 🇪🇸 Visor de medios — imágenes, video, YouTube, Vimeo — con zoom, thumbnails y auto-binding. |
| `matios-ui-modal` | `MTS.Modal` | 🇬🇧 Dialog modal — sizes, footer buttons, scrollable, static, confirm/alert/prompt helpers. / 🇪🇸 Diálogo modal — tamaños, botones de footer, scrollable, static, confirm/alert/prompt helpers. |
| `matios-ui-popover` | `MTS.Popover` | 🇬🇧 Rich tooltip with title, HTML body, arrow, smart positioning and click/hover triggers. / 🇪🇸 Tooltip enriquecido con título, cuerpo HTML, flecha, posicionamiento inteligente y triggers click/hover. |
| `matios-ui-progress` | `MTS.Progress` | 🇬🇧 Bar and circle progress — determinate/indeterminate, color variants, striped and animated. / 🇪🇸 Barra y círculo de progreso — determinado/indeterminado, variantes de color, striped y animado. |
| `matios-ui-skeleton` | `MTS.Skeleton` | 🇬🇧 Animated loading placeholder — text, circle, rect, card, list and table — pulse and wave. / 🇪🇸 Placeholder de carga animado — texto, círculo, rect, card, lista y tabla — pulso y wave. |
| `matios-ui-spinner` | `MTS.Spinner` | 🇬🇧 Animated loading indicators — 12 variants, color tones and 5 sizes. / 🇪🇸 Indicadores de carga animados — 12 variantes, tones de color y 5 tamaños. |
| `matios-ui-toast` | `MTS.Toast` | 🇬🇧 Transient notifications — variants, positions, action button and loading state. / 🇪🇸 Notificaciones transitorias — variantes, posiciones, botón de acción y estado loading. |
| `matios-ui-tooltip` | `MTS.Tooltip` | 🇬🇧 Tooltip with smart positioning — hover/click/focus triggers and dark/light variants. / 🇪🇸 Tooltip con smart positioning — triggers hover/click/focus y variantes dark/light. |

---

## Notes / Notas

- 🇬🇧 `MTS.Alert` is for persistent in-flow messages. `MTS.Toast` is for ephemeral out-of-flow notifications. / 🇪🇸 `MTS.Alert` es para mensajes persistentes dentro del flujo de página. `MTS.Toast` es para notificaciones efímeras fuera del flujo.
- 🇬🇧 `MTS.Popover` extends `MTS.Tooltip` — use Popover when the content is rich HTML. / 🇪🇸 `MTS.Popover` extiende `MTS.Tooltip` — usar Popover cuando el contenido sea HTML rico.
- 🇬🇧 `MTS.Skeleton` should replace full-page spinners when the content structure is known in advance. / 🇪🇸 `MTS.Skeleton` debe reemplazar a cualquier spinner de página completa cuando se conoce la estructura del contenido a cargar.
- 🇬🇧 `MTS.Badge` can be used as pure CSS without instantiating JS when no dynamic behavior is needed. / 🇪🇸 `MTS.Badge` puede usarse como CSS puro sin instanciar JS cuando no se requiere comportamiento dinámico.
---

🇬🇧 **To see detailed documentation for each component, expand the accordion in the demo and read its individual .md file.**
🇪🇸 **Para ver la documentación detallada de cada componente, expanda el acordeón en el demo y lea el .md individual.**
