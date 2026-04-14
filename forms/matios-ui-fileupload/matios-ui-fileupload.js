/* ============================================================
   MATIOS UI — matios-ui-fileupload.js
   MTS.FileUpload — Drag & drop file upload zone
   Version: 1.1.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.FileUpload = class MtsFileUpload {
  constructor(selector, options = {}) {
    // Target container element / Elemento contenedor
    this._el = typeof selector === 'string'
      ? document.querySelector(selector) : selector;
    if (!this._el) { console.error('[MTS.FileUpload] Not found / No encontrado:', selector); return; }

    // Accepted file types (e.g. 'image/*', '.pdf,.doc') / Tipos de archivo aceptados
    this.accept = options.accept || '*';

    // Allow multiple file selection / Permitir selección de múltiples archivos
    this.multiple = options.multiple ?? false;

    // Maximum file size in MB / Tamaño máximo por archivo en MB
    this.maxSize = options.maxSize || null;

    // Maximum number of files / Número máximo de archivos
    this.maxFiles = options.maxFiles || null;

    // Drop zone label HTML / HTML del label de la zona de drop
    this.label = options.label || 'Arrastra archivos aquí o <span>selecciona</span>';

    // Helper text below the zone / Texto de ayuda debajo de la zona
    this.hint = options.hint || '';

    // Show image thumbnails / Mostrar miniaturas de imágenes
    this.preview = options.preview ?? true;

    // Disables the drop zone / Deshabilita la zona
    this.disabled = options.disabled ?? false;

    // Fires when files change (add or remove) / Se dispara al agregar o eliminar archivos
    this._files     = [];
    this._listeners = {};

    // Fires when file list changes: ({ files }) => {} / Se dispara al cambiar la lista de archivos
    if (options.onChange) this.on('change', options.onChange);

    // Fires when a file fails validation: ({ message }) => {} / Se dispara al fallar validación
    if (options.onError)  this.on('error',  options.onError);

    // Fires when a file is added: (file) => {} / Se dispara al agregar un archivo
    if (options.onAdd)    this.on('add',    options.onAdd);

    // Fires when a file is removed: (file) => {} / Se dispara al remover un archivo
    if (options.onRemove) this.on('remove', options.onRemove);
    this._build();
  }

  /* ── API ─────────────────────────────────────────────── */

  // Returns current file list / Retorna la lista de archivos actual
  getFiles() { return [...this._files]; }

  // Clear all files / Limpiar todos los archivos
  clear() { this._files = []; this._renderPreviews(); this._syncInput(); }

  // Open the file selector programmatically / Abrir el selector de archivos programáticamente
  open() { this._inputEl?.click(); }

  // Register an event listener / Registrar un listener de evento
  on(e, fn) { (this._listeners[e] = this._listeners[e] || []).push(fn); return this; }

  /* ── Build / Construcción ───────────────────────────── */

  _build() {
    this._el.className = 'mts-fileupload';
    this._el.innerHTML = '';

    // Drop zone / Zona de drop
    this._zone = document.createElement('div');
    this._zone.className = 'mts-fileupload__zone' + (this.disabled ? ' mts-fileupload__zone--disabled' : '');

    // Upload icon / Ícono de carga
    const icon = document.createElement('div');
    icon.className = 'mts-fileupload__icon';
    icon.innerHTML = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="19" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>
      <path d="M20 27V14M14 20l6-6 6 6" stroke="currentColor" stroke-width="1.8"
        stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    this._zone.appendChild(icon);

    const lbl = document.createElement('div');
    lbl.className = 'mts-fileupload__label';
    lbl.innerHTML = this.label;
    this._zone.appendChild(lbl);

    if (this.hint) {
      const h = document.createElement('span');
      h.className   = 'mts-fileupload__hint';
      h.textContent = this.hint;
      this._zone.appendChild(h);
    }

    // Hidden file input / Input file oculto
    this._inputEl = document.createElement('input');
    this._inputEl.type            = 'file';
    this._inputEl.accept          = this.accept;
    this._inputEl.multiple        = this.multiple;
    this._inputEl.style.display   = 'none';
    this._zone.appendChild(this._inputEl);
    this._el.appendChild(this._zone);

    // Preview list / Lista de previews
    this._previewList = document.createElement('div');
    this._previewList.className = 'mts-fileupload__list';
    this._el.appendChild(this._previewList);

    this._bindEvents();
  }

  _bindEvents() {
    if (this.disabled) return;

    // Click to open file selector / Click para abrir selector
    this._zone.addEventListener('click', () => this._inputEl.click());
    this._inputEl.addEventListener('change', (e) => {
      this._addFiles(Array.from(e.target.files || []));
      this._inputEl.value = '';
    });

    // Drag & drop events / Eventos drag & drop
    this._zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this._zone.classList.add('mts-fileupload__zone--dragover');
    });
    this._zone.addEventListener('dragleave', () => {
      this._zone.classList.remove('mts-fileupload__zone--dragover');
    });
    this._zone.addEventListener('drop', (e) => {
      e.preventDefault();
      this._zone.classList.remove('mts-fileupload__zone--dragover');
      this._addFiles(Array.from(e.dataTransfer?.files || []));
    });
  }

  _addFiles(newFiles) {
    const errors = [];

    newFiles.forEach(file => {
      // Validate file size / Validar tamaño
      if (this.maxSize && file.size > this.maxSize * 1024 * 1024) {
        errors.push(`"${file.name}" supera el límite de ${this.maxSize}MB.`);
        return;
      }
      // Validate file type / Validar tipo
      if (this.accept && this.accept !== '*') {
        const accepted = this.accept.split(',').map(s => s.trim());
        const ok = accepted.some(a => {
          if (a.endsWith('/*')) return file.type.startsWith(a.replace('/*', ''));
          if (a.startsWith('.')) return file.name.toLowerCase().endsWith(a.toLowerCase());
          return file.type === a;
        });
        if (!ok) { errors.push(`"${file.name}" no es un tipo aceptado.`); return; }
      }
      // Skip duplicates / Omitir duplicados
      if (this._files.some(f => f.name === file.name && f.size === file.size)) return;
      // Single file mode — replace / Modo un solo archivo — reemplazar
      if (!this.multiple) this._files = [];
      this._files.push(file);
    });

    // Validate max files / Validar máximo de archivos
    if (this.maxFiles && this._files.length > this.maxFiles) {
      errors.push(`Máximo ${this.maxFiles} archivos.`);
      this._files = this._files.slice(0, this.maxFiles);
    }

    if (errors.length) {
      errors.forEach(e => this._emit('error', { message: e }));

      this._showZoneError(errors[0]);
    }

    this._renderPreviews();
    this._syncInput();
    this._emit('change', { files: this.getFiles() });
    newFiles.forEach(f => this._emit('add', f));
  }

  _renderPreviews() {
    this._previewList.innerHTML = '';
    if (!this._files.length) return;

    this._files.forEach((file, idx) => {
      const item = document.createElement('div');
      item.className = 'mts-fileupload__item';

      const thumb = document.createElement('div');
      thumb.className = 'mts-fileupload__thumb';
      if (this.preview && file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:4px;';
        const reader = new FileReader();
        reader.onload = (e) => { img.src = e.target.result; };
        reader.readAsDataURL(file);
        thumb.appendChild(img);
      } else {
        const ext = file.name.split('.').pop().toUpperCase().slice(0, 4);
        thumb.innerHTML = `<span style="font-size:10px;font-weight:700;color:var(--mts-color-primary)">${ext}</span>`;
      }
      item.appendChild(thumb);

      const info = document.createElement('div');
      info.className = 'mts-fileupload__info';
      const name = document.createElement('span');
      name.className   = 'mts-fileupload__name';
      name.textContent = file.name;
      name.title       = file.name;
      const size = document.createElement('span');
      size.className   = 'mts-fileupload__size';
      size.textContent = this._formatSize(file.size);
      info.appendChild(name);
      info.appendChild(size);
      item.appendChild(info);

      const remove = document.createElement('button');
      remove.type      = 'button';
      remove.className = 'mts-fileupload__remove';
      remove.setAttribute('aria-label', 'Eliminar');
      remove.innerHTML = '&times;';
      remove.addEventListener('click', (e) => {
        e.stopPropagation();
        const removed = this._files.splice(idx, 1)[0];
        this._renderPreviews();
        this._syncInput();
        this._emit('change', { files: this.getFiles() });
        this._emit('remove', removed);
      });
      item.appendChild(remove);
      this._previewList.appendChild(item);
    });
  }

  _syncInput() {
    this._zone.classList.toggle('mts-fileupload__zone--has-files', this._files.length > 0);
  }

  _showZoneError(msg) {
    const old = this._zone.querySelector('.mts-fileupload__zone-error');
    if (old) old.remove();
    const err = document.createElement('span');
    err.className   = 'mts-fileupload__zone-error';
    err.textContent = msg;
    this._zone.appendChild(err);
    setTimeout(() => err.remove(), 4000);
  }

  _formatSize(bytes) {
    if (bytes < 1024)       return `${bytes} B`;
    if (bytes < 1024*1024)  return `${(bytes/1024).toFixed(1)} KB`;
    return `${(bytes/(1024*1024)).toFixed(1)} MB`;
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:fileupload:${event}`, { bubbles: true, detail }));
  }
};
