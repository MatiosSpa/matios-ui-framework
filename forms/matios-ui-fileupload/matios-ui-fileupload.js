/* ============================================================
   MATIOS UI — matios-ui-fileupload.js  v1.0.0
   MTS.FileUpload — Zona de arrastrar/soltar archivos

   Uso:
     const fu = new MTS.FileUpload('#zona', {
       accept:      'image/*,.pdf',
       multiple:    true,
       maxSize:     5,          // MB
       maxFiles:    10,
       label:       'Suelta archivos aquí o haz click',
       hint:        'PNG, JPG, PDF hasta 5MB',
       preview:     true,       // miniaturas para imágenes
       onChange:    (files) => console.log(files),
       onError:     (err)   => console.error(err),
     })

     fu.getFiles()         → FileList / File[]
     fu.clear()
     fu.open()             → abre el selector de archivos
   ============================================================ */

window.MTS = window.MTS || {};

MTS.FileUpload = class MtsFileUpload {
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string'
      ? document.querySelector(selector) : selector;
    if (!this._el) { console.error('[MTS.FileUpload] No encontrado:', selector); return; }

    this.accept    = options.accept    || '*';
    this.multiple  = options.multiple  ?? false;
    this.maxSize   = options.maxSize   || null;    // MB
    this.maxFiles  = options.maxFiles  || null;
    this.label     = options.label     || 'Arrastra archivos aquí o <span>selecciona</span>';
    this.hint      = options.hint      || '';
    this.preview   = options.preview   ?? true;
    this.disabled  = options.disabled  ?? false;
    this._onChange = options.onChange  || null;
    this._onError  = options.onError   || null;
    this._onAdd    = options.onAdd     || null;
    this._onRemove = options.onRemove  || null;
    this._files    = [];
    this._listeners = {};

    this._build();
  }

  /* ── API ── */
  getFiles()  { return [...this._files]; }
  clear()     { this._files = []; this._renderPreviews(); this._syncInput(); }
  open()      { this._inputEl?.click(); }
  on(e, fn)   { (this._listeners[e] = this._listeners[e]||[]).push(fn); return this; }

  /* ── BUILD ── */
  _build() {
    this._el.className = 'mts-fileupload';
    this._el.innerHTML = '';

    /* Zona de drop */
    this._zone = document.createElement('div');
    this._zone.className = 'mts-fileupload__zone' + (this.disabled?' mts-fileupload__zone--disabled':'');

    /* Ícono upload */
    const icon = document.createElement('div');
    icon.className = 'mts-fileupload__icon';
    icon.innerHTML = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="19" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>
      <path d="M20 27V14M14 20l6-6 6 6" stroke="currentColor" stroke-width="1.8"
        stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    this._zone.appendChild(icon);

    /* Label */
    const lbl = document.createElement('div');
    lbl.className = 'mts-fileupload__label';
    lbl.innerHTML = this.label;
    this._zone.appendChild(lbl);

    /* Hint */
    if (this.hint) {
      const h = document.createElement('span');
      h.className = 'mts-fileupload__hint';
      h.textContent = this.hint;
      this._zone.appendChild(h);
    }

    /* Input file oculto */
    this._inputEl = document.createElement('input');
    this._inputEl.type     = 'file';
    this._inputEl.accept   = this.accept;
    this._inputEl.multiple = this.multiple;
    this._inputEl.style.display = 'none';
    this._zone.appendChild(this._inputEl);
    this._el.appendChild(this._zone);

    /* Lista de previews */
    this._previewList = document.createElement('div');
    this._previewList.className = 'mts-fileupload__list';
    this._el.appendChild(this._previewList);

    this._bindEvents();
  }

  _bindEvents() {
    if (this.disabled) return;

    /* Click → abrir selector */
    this._zone.addEventListener('click', () => this._inputEl.click());
    this._inputEl.addEventListener('change', (e) => {
      this._addFiles(Array.from(e.target.files || []));
      this._inputEl.value = '';
    });

    /* Drag & drop */
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
      const files = Array.from(e.dataTransfer?.files || []);
      this._addFiles(files);
    });
  }

  _addFiles(newFiles) {
    const errors = [];

    newFiles.forEach(file => {
      /* Validar tamaño */
      if (this.maxSize && file.size > this.maxSize * 1024 * 1024) {
        errors.push(`"${file.name}" supera el límite de ${this.maxSize}MB.`);
        return;
      }
      /* Validar tipo */
      if (this.accept && this.accept !== '*') {
        const accepted = this.accept.split(',').map(s=>s.trim());
        const ok = accepted.some(a => {
          if (a.endsWith('/*')) return file.type.startsWith(a.replace('/*',''));
          if (a.startsWith('.')) return file.name.toLowerCase().endsWith(a.toLowerCase());
          return file.type === a;
        });
        if (!ok) { errors.push(`"${file.name}" no es un tipo aceptado.`); return; }
      }
      /* Verificar si ya existe */
      if (this._files.some(f => f.name===file.name && f.size===file.size)) return;
      /* Solo uno si !multiple */
      if (!this.multiple) this._files = [];
      this._files.push(file);
    });

    /* Validar máximo de archivos */
    if (this.maxFiles && this._files.length > this.maxFiles) {
      errors.push(`Máximo ${this.maxFiles} archivos.`);
      this._files = this._files.slice(0, this.maxFiles);
    }

    if (errors.length) {
      errors.forEach(e => this._emit('error', { message: e }));
      this._onError?.(errors);
      this._showZoneError(errors[0]);
    }

    this._renderPreviews();
    this._syncInput();
    this._emit('change', { files: this.getFiles() });
    this._onChange?.(this.getFiles());
    newFiles.forEach(f => this._onAdd?.(f));
  }

  _renderPreviews() {
    this._previewList.innerHTML = '';
    if (!this._files.length) return;

    this._files.forEach((file, idx) => {
      const item = document.createElement('div');
      item.className = 'mts-fileupload__item';

      /* Preview imagen o ícono genérico */
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
        const ext = file.name.split('.').pop().toUpperCase().slice(0,4);
        thumb.innerHTML = `<span style="font-size:10px;font-weight:700;color:var(--mts-color-primary)">${ext}</span>`;
      }
      item.appendChild(thumb);

      /* Info */
      const info = document.createElement('div');
      info.className = 'mts-fileupload__info';
      const name = document.createElement('span');
      name.className = 'mts-fileupload__name';
      name.textContent = file.name;
      name.title = file.name;
      const size = document.createElement('span');
      size.className = 'mts-fileupload__size';
      size.textContent = this._formatSize(file.size);
      info.appendChild(name);
      info.appendChild(size);
      item.appendChild(info);

      /* Botón eliminar */
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'mts-fileupload__remove';
      remove.setAttribute('aria-label', 'Eliminar');
      remove.innerHTML = '&times;';
      remove.addEventListener('click', (e) => {
        e.stopPropagation();
        const removed = this._files.splice(idx, 1)[0];
        this._renderPreviews();
        this._syncInput();
        this._emit('change', { files: this.getFiles() });
        this._onChange?.(this.getFiles());
        this._onRemove?.(removed);
      });
      item.appendChild(remove);
      this._previewList.appendChild(item);
    });
  }

  _syncInput() {
    /* Actualizar clase de la zona */
    this._zone.classList.toggle('mts-fileupload__zone--has-files', this._files.length > 0);
  }

  _showZoneError(msg) {
    const old = this._zone.querySelector('.mts-fileupload__zone-error');
    if (old) old.remove();
    const err = document.createElement('span');
    err.className = 'mts-fileupload__zone-error';
    err.textContent = msg;
    this._zone.appendChild(err);
    setTimeout(() => err.remove(), 4000);
  }

  _formatSize(bytes) {
    if (bytes < 1024)        return `${bytes} B`;
    if (bytes < 1024*1024)   return `${(bytes/1024).toFixed(1)} KB`;
    return `${(bytes/(1024*1024)).toFixed(1)} MB`;
  }

  _emit(event, detail) {
    (this._listeners[event]||[]).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:fileupload:${event}`, { bubbles: true, detail }));
  }
};
