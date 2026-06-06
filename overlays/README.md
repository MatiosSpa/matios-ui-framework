# Overlays

Components that layer over the main content: notifications, status feedback, dialogs and tooltips. All manage their own lifecycle (open, animate, close) and are accessible via a JS API.

---

## Components

| Component | JS class | Description |
|-----------|----------|-------------|
| `matios-ui-alert` | `MTS.Alert` | Inline alerts and banners — info/success/warning/danger, action button, auto-dismiss. |
| `matios-ui-badge` | `MTS.Badge` | Badges, pills and counters — CSS-only or via JS — removable tags and dot notifications. |
| `matios-ui-lightbox` | `MTS.Lightbox` | Media viewer — images, video, YouTube, Vimeo — with zoom, thumbnails and auto-binding. |
| `matios-ui-modal` | `MTS.Modal` | Dialog modal — sizes, footer buttons, scrollable, static, confirm/alert/prompt helpers. |
| `matios-ui-popover` | `MTS.Popover` | Rich tooltip with title, HTML body, arrow, smart positioning and click/hover triggers. |
| `matios-ui-progress` | `MTS.Progress` | Bar and circle progress — determinate/indeterminate, color variants, striped and animated. |
| `matios-ui-skeleton` | `MTS.Skeleton` | Animated loading placeholder — text, circle, rect, card, list and table — pulse and wave. |
| `matios-ui-spinner` | `MTS.Spinner` | Animated loading indicators — multiple variants, color tones and 5 sizes. |
| `matios-ui-toast` | `MTS.Toast` | Transient notifications — variants, positions, action button and loading state. |
| `matios-ui-tooltip` | `MTS.Tooltip` | Tooltip with smart positioning — hover/click/focus triggers and dark/light variants. |

---

## Notes

- `MTS.Alert` is for persistent in-flow messages; `MTS.Toast` is for ephemeral, out-of-flow notifications.
- Use `MTS.Popover` (over `MTS.Tooltip`) when the content is rich HTML.
- `MTS.Skeleton` should replace full-page spinners when the content structure is known in advance.
- `MTS.Badge` can be used as pure CSS without instantiating JS when no dynamic behavior is needed.

> For detailed documentation of each component, see its individual `.md` file.
