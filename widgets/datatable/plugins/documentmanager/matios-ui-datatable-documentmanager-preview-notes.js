/* ============================================================
   MATIOS UI — MTS.DocumentManagerPreviewNotesPanel  v1.1.0
   Panel lateral del PreviewPlugin — notas y comentarios.

   Requiere: MTS.DocumentManagerPreviewPlugin, MTS.Button, MTS.Modal

   Opciones:
     onLoad(item)         → Promise<note[]>
     onSave(item, text)   → Promise<note>   — nota recién creada
     onDelete(note, item) → Promise          — opcional

   note = {
     id, user, name, lastName,
     text,    — contenido de la nota
     date,    — string con fecha/hora formateada
     isOwn,   — true si pertenece al usuario actual
   }
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DocumentManagerPreviewNotesPanel = class DocumentManagerPreviewNotesPanel {

  get key() { return 'dm-notes'; }

  get label() {
    let loc = MTS.DataTable?._activeLocale?.['MTS.DocumentManagerPreviewNotesPanel'] ?? {};
    return loc.panelLabel || 'Notas';
  }

  get icon() {
    return typeof MTS.Icon !== 'undefined' ? MTS.Icon.get('messages') : null;
  }

  constructor(options) {
    options = options || {};
    this._onLoad      = typeof options.onLoad   === 'function' ? options.onLoad   : null;
    this._onSave      = typeof options.onSave   === 'function' ? options.onSave   : null;
    this._onDelete    = typeof options.onDelete === 'function' ? options.onDelete : null;
    this._addTooltip  = options.addTooltip  || null;
    this._preview     = null;
  }

  install(preview)  { this._preview = preview; }
  uninstall()       { this._preview = null;    }

  /* ── Skeleton ─────────────────────────────────────────── */

  render(item) {
    let wrap = document.createElement('div');
    wrap.className = 'dm-notes dm-notes--loading';
    for (let i = 0; i < 3; i++) {
      wrap.appendChild(this._buildSkeletonItem());
    }
    return wrap;
  }

  /* ── Load ─────────────────────────────────────────────── */

  load(item) {
    let self = this;
    if (!this._onLoad) {
      return this._buildEmptyEl();
    }
    return Promise.resolve(this._onLoad(item))
      .then(function(notes) {
        return self._renderPanel(notes || [], item);
      })
      .catch(function(err) {
        console.error('[MTS.DocumentManagerPreviewNotesPanel] Error al cargar notas:', err);
        return self._buildEmptyEl();
      });
  }

  /* ── Panel: cabecera + lista ──────────────────────────── */

  _renderPanel(notes, item) {
    let self = this;
    let loc  = MTS.DataTable?._activeLocale?.['MTS.DocumentManagerPreviewNotesPanel'] ?? {};

    let wrap = document.createElement('div');
    wrap.className = 'dm-notes';

    /* ── Cabecera con botón Agregar ────────────────────── */
    if (typeof this._onSave === 'function') {
      let headerBar = document.createElement('div');
      headerBar.className = 'dm-notes__header-bar';

      let tooltip = this._addTooltip || loc.send || 'Agregar';
      let addWrap = document.createElement('div');
      let addBtn  = new MTS.Button(addWrap, {
        variant:   'ghost',
        size:      'sm',
        iconOnly:  true,   // botón-ícono compacto (sin padding de label)
        iconLeft:  typeof MTS.Icon !== 'undefined' ? MTS.Icon.get('add') : '',
        ariaLabel: tooltip,
      });
      addBtn._el.setAttribute('title', tooltip);
      addBtn.on('click', function() {
        self._openAddModal(item, listEl, loc);
      });
      headerBar.appendChild(addWrap);
      wrap.appendChild(headerBar);
    }

    /* ── Lista ─────────────────────────────────────────── */
    let listEl = document.createElement('div');
    listEl.className = 'dm-notes__list';
    wrap.appendChild(listEl);

    if (!notes.length) {
      let emptyEl = document.createElement('p');
      emptyEl.className   = 'dm-notes__empty';
      emptyEl.textContent = loc.noNotes || 'Sin notas.';
      listEl.appendChild(emptyEl);
    } else {
      notes.forEach(function(note) {
        listEl.appendChild(self._buildNoteItem(note, item, listEl, loc));
      });
    }

    return wrap;
  }

  /* ── Modal: nueva nota ────────────────────────────────── */

  _openAddModal(item, listEl, loc) {
    let self = this;

    /* Body del modal */
    let bodyEl = document.createElement('div');

    let textarea = document.createElement('textarea');
    textarea.className   = 'dm-notes__textarea';
    textarea.placeholder = loc.placeholder || 'Escribe una nota...';
    textarea.rows        = 4;
    bodyEl.appendChild(textarea);

    let errorEl = document.createElement('span');
    errorEl.className = 'dm-notes__error';
    errorEl.hidden    = true;
    bodyEl.appendChild(errorEl);

    let modal = new MTS.Modal({
      title:    loc.addTitle || 'Nueva nota',
      body:     bodyEl,
      size:     'sm',
      static:   true,
      scrollable: false,
      buttons: [
        {
          label:   loc.cancel || 'Cancelar',
          variant: 'ghost',
          close:   true,
        },
        {
          id:       'dm-notes-add-btn',
          label:    loc.send || 'Agregar',
          variant:  'primary',
          disabled: true,
          onClick:  function() {
            let text = textarea.value.trim();
            if (!text) return;

            modal.setButtonLoading('dm-notes-add-btn', true);
            errorEl.hidden = true;

            Promise.resolve(self._onSave(item, text))
              .then(function(note) {
                modal.destroy();

                /* Quitar estado vacío si existía */
                let emptyEl = listEl.querySelector('.dm-notes__empty');
                if (emptyEl) emptyEl.remove();

                /* Agregar la nueva nota al final */
                let newLoc = MTS.DataTable?._activeLocale?.['MTS.DocumentManagerPreviewNotesPanel'] ?? {};
                listEl.appendChild(self._buildNoteItem(note, item, listEl, newLoc));
                /* Scroll DENTRO de la lista (no burbujea al panel/página): idempotente —
                   no-op si la lista no desborda, baja al final si hay muchas notas. */
                listEl.scrollTop = listEl.scrollHeight;
              })
              .catch(function(err) {
                console.error('[MTS.DocumentManagerPreviewNotesPanel] Error al guardar nota:', err);
                modal.setButtonLoading('dm-notes-add-btn', false);
                errorEl.textContent = loc.errorSave || 'Error al guardar la nota.';
                errorEl.hidden      = false;
              });
          },
        },
      ],
      onShown: function() {
        textarea.focus();

        textarea.addEventListener('input', function() {
          modal.setButtonDisabled('dm-notes-add-btn', !textarea.value.trim());
          errorEl.hidden = true;
        });

        /* Ctrl+Enter para enviar */
        textarea.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            if (textarea.value.trim()) {
              let addBtnEl = modal.element.querySelector('#dm-notes-add-btn');
              if (addBtnEl && !addBtnEl.disabled) addBtnEl.click();
            }
          }
        });
      },
    });

    modal.show();
  }

  /* ── Fila de nota ─────────────────────────────────────── */

  _buildNoteItem(note, item, listEl, loc) {
    let self = this;

    let row = document.createElement('div');
    row.className = 'dm-notes__item' + (note.isOwn ? ' dm-notes__item--own' : '');

    /* Avatar */
    let avatarEl = document.createElement('div');
    avatarEl.className   = 'dm-notes__avatar';
    avatarEl.textContent = MTS.DocumentManagerPreviewNotesPanel._initials(note.name, note.lastName);
    avatarEl.setAttribute('aria-hidden', 'true');
    row.appendChild(avatarEl);

    /* Contenido */
    let contentEl = document.createElement('div');
    contentEl.className = 'dm-notes__content';

    /* Header: nombre + fecha + botón eliminar */
    let headerEl = document.createElement('div');
    headerEl.className = 'dm-notes__header';

    let authorEl = document.createElement('span');
    authorEl.className   = 'dm-notes__author';
    authorEl.textContent = (note.name || '') + ' ' + (note.lastName || '');
    headerEl.appendChild(authorEl);

    if (note.date) {
      let dateEl = document.createElement('span');
      dateEl.className   = 'dm-notes__date';
      dateEl.textContent = note.date;
      headerEl.appendChild(dateEl);
    }

    /* Botón eliminar — solo notas propias con onDelete definido */
    if (note.isOwn && typeof self._onDelete === 'function') {
      let delWrap = document.createElement('div');
      delWrap.className = 'dm-notes__delete-wrap';
      let delBtn = new MTS.Button(delWrap, {
        variant:   'ghost',
        size:      'xs',
        iconLeft:  typeof MTS.Icon !== 'undefined' ? MTS.Icon.get('trash-2') : '',
        ariaLabel: loc.delete || 'Eliminar nota',
      });
      delBtn.on('click', function() {
        delBtn.disable();
        Promise.resolve(self._onDelete(note, item))
          .then(function() {
            row.remove();
          })
          .catch(function(err) {
            console.error('[MTS.DocumentManagerPreviewNotesPanel] Error al eliminar nota:', err);
            delBtn.enable();
          });
      });
      headerEl.appendChild(delWrap);
    }

    contentEl.appendChild(headerEl);

    /* Texto */
    let textEl = document.createElement('p');
    textEl.className   = 'dm-notes__text';
    textEl.textContent = note.text;
    contentEl.appendChild(textEl);

    row.appendChild(contentEl);
    return row;
  }

  /* ── Skeleton ─────────────────────────────────────────── */

  _buildSkeletonItem() {
    let row = document.createElement('div');
    row.className = 'dm-notes__skeleton-item';

    let avatar = document.createElement('div');
    avatar.className = 'dm-notes__skeleton-avatar';
    row.appendChild(avatar);

    let lines = document.createElement('div');
    lines.className = 'dm-notes__skeleton-lines';

    let l1 = document.createElement('div');
    l1.className = 'dm-notes__skeleton-line dm-notes__skeleton-line--header';
    let l2 = document.createElement('div');
    l2.className = 'dm-notes__skeleton-line dm-notes__skeleton-line--text';
    let l3 = document.createElement('div');
    l3.className = 'dm-notes__skeleton-line dm-notes__skeleton-line--text-short';

    lines.appendChild(l1);
    lines.appendChild(l2);
    lines.appendChild(l3);
    row.appendChild(lines);
    return row;
  }

  _buildEmptyEl() {
    let loc = MTS.DataTable?._activeLocale?.['MTS.DocumentManagerPreviewNotesPanel'] ?? {};
    let p = document.createElement('p');
    p.className   = 'dm-notes__empty';
    p.textContent = loc.noNotes || 'Sin notas.';
    return p;
  }

  /* ── Helpers ──────────────────────────────────────────── */

  static _initials(name, lastName) {
    let a = (name     || '').trim().charAt(0).toUpperCase();
    let b = (lastName || '').trim().charAt(0).toUpperCase();
    return a + b;
  }

};
