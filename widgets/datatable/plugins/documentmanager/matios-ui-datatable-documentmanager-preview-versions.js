/* ============================================================
   MATIOS UI — MTS.DocumentManagerPreviewVersionsPanel  v1.0.0
   Panel lateral del PreviewPlugin — historial de versiones.

   Requiere: MTS.DocumentManagerPreviewPlugin

   Opciones:
     onLoad(item)              → Promise<version[]>
     onVersionSelect(ver,item) → void  (opcional, auditoría)

   version = {
     id, name, version, parentId,
     size, modified, author,
     url,        — URL para cargar en el iframe
     isCurrent,  — true en la versión activa
   }
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DocumentManagerPreviewVersionsPanel = class DocumentManagerPreviewVersionsPanel {

  get key() { return 'dm-versions'; }

  get label() {
    var loc = MTS.DataTable?._activeLocale?.['MTS.DocumentManagerPreviewVersionsPanel'] ?? {};
    return loc.panelLabel || 'Versiones';
  }

  get icon() {
    return typeof MTS.Icon !== 'undefined' ? MTS.Icon.get('clock') : null;
  }

  constructor(options) {
    options = options || {};
    this._onLoad          = typeof options.onLoad          === 'function' ? options.onLoad          : null;
    this._onVersionSelect = typeof options.onVersionSelect === 'function' ? options.onVersionSelect : null;
    this._preview         = null;
  }

  install(preview)  { this._preview = preview; }
  uninstall()       { this._preview = null;    }

  /* ── Skeleton ─────────────────────────────────────────── */

  render(item) {
    var wrap = document.createElement('div');
    wrap.className = 'dm-versions dm-versions--loading';
    var list = document.createElement('div');
    list.className = 'dm-versions__list';
    for (var i = 0; i < 3; i++) {
      list.appendChild(this._buildSkeletonRow());
    }
    wrap.appendChild(list);
    return wrap;
  }

  /* ── Load ─────────────────────────────────────────────── */

  load(item) {
    var self = this;
    if (!this._onLoad) {
      return this._buildEmptyEl();
    }
    return Promise.resolve(this._onLoad(item))
      .then(function(versions) {
        return self._renderList(versions || [], item);
      })
      .catch(function(err) {
        console.error('[MTS.DocumentManagerPreviewVersionsPanel] Error al cargar versiones:', err);
        return self._buildEmptyEl();
      });
  }

  /* ── Render lista ─────────────────────────────────────── */

  _renderList(versions, item) {
    var self = this;
    var loc  = MTS.DataTable?._activeLocale?.['MTS.DocumentManagerPreviewVersionsPanel'] ?? {};

    var wrap = document.createElement('div');
    wrap.className = 'dm-versions';

    if (!versions.length) {
      wrap.appendChild(this._buildEmptyEl());
      return wrap;
    }

    var list = document.createElement('div');
    list.className = 'dm-versions__list';
    wrap.appendChild(list);

    var rowEls = [];

    versions.forEach(function(version) {
      var row = document.createElement('div');
      row.className = 'dm-versions__item' + (version.isCurrent ? ' dm-versions__item--active' : '');
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');

      /* Badge de versión — izquierda */
      var badgeWrap = document.createElement('div');
      badgeWrap.className = 'dm-versions__badge-wrap';
      if (typeof MTS.Badge !== 'undefined') {
        new MTS.Badge(badgeWrap, {
          label:   'v' + version.version,
          variant: version.isCurrent ? 'primary' : 'default',
        });
      } else {
        badgeWrap.textContent = 'v' + version.version;
      }
      row.appendChild(badgeWrap);

      /* Info: nombre + meta — centro */
      var info = document.createElement('div');
      info.className = 'dm-versions__info';

      var nameEl = document.createElement('div');
      nameEl.className   = 'dm-versions__name';
      nameEl.textContent = version.name || ('Versión ' + version.version);
      nameEl.title       = nameEl.textContent;
      info.appendChild(nameEl);

      var metaParts = [];
      if (version.author)   metaParts.push(version.author);
      if (version.modified) metaParts.push(version.modified);
      if (version.size != null) {
        metaParts.push(MTS.DocumentManagerPreviewVersionsPanel._formatSize(version.size));
      }
      if (metaParts.length) {
        var metaEl = document.createElement('div');
        metaEl.className   = 'dm-versions__meta';
        metaEl.textContent = metaParts.join(' · ');
        info.appendChild(metaEl);
      }

      row.appendChild(info);

      /* Badge "Actual" — derecha, solo en isCurrent */
      if (version.isCurrent) {
        var currentWrap = document.createElement('div');
        currentWrap.className = 'dm-versions__current-wrap';
        if (typeof MTS.Badge !== 'undefined') {
          new MTS.Badge(currentWrap, {
            label:   loc.current || 'Actual',
            variant: 'success',
          });
        }
        row.appendChild(currentWrap);
      }

      /* Click */
      row.addEventListener('click', function() {
        rowEls.forEach(function(r) { r.classList.remove('dm-versions__item--active'); });
        row.classList.add('dm-versions__item--active');

        if (version.url && self._preview) {
          self._preview.loadUrl(version.url);
        }
        if (typeof self._onVersionSelect === 'function') {
          self._onVersionSelect(version, item);
        }
      });

      row.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          row.click();
        }
      });

      rowEls.push(row);
      list.appendChild(row);
    });

    return wrap;
  }

  /* ── Helpers ──────────────────────────────────────────── */

  _buildSkeletonRow() {
    var row = document.createElement('div');
    row.className = 'dm-versions__skeleton-row';

    var badge = document.createElement('div');
    badge.className = 'dm-versions__skeleton-badge';
    row.appendChild(badge);

    var lines = document.createElement('div');
    lines.className = 'dm-versions__skeleton-lines';

    var l1 = document.createElement('div');
    l1.className = 'dm-versions__skeleton-line dm-versions__skeleton-line--name';
    var l2 = document.createElement('div');
    l2.className = 'dm-versions__skeleton-line dm-versions__skeleton-line--meta';

    lines.appendChild(l1);
    lines.appendChild(l2);
    row.appendChild(lines);
    return row;
  }

  _buildEmptyEl() {
    var loc = MTS.DataTable?._activeLocale?.['MTS.DocumentManagerPreviewVersionsPanel'] ?? {};
    var p = document.createElement('p');
    p.className   = 'dm-versions__empty';
    p.textContent = loc.noVersions || 'Sin versiones.';
    return p;
  }

  static _formatSize(bytes) {
    if (bytes == null)        return '';
    if (bytes < 1024)         return bytes + ' B';
    if (bytes < 1024 * 1024)  return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

};
