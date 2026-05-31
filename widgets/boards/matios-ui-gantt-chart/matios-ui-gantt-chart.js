/* ============================================================
   MATIOS UI — matios-ui-gantt-chart.js
   MTS.GanttChart — Gantt + Grid WBS con plugins de datos

   Dep: base/matios-ui-base.js  (MTS._defineEvents)
        layout/matios-ui-splitter/matios-ui-splitter.js
   Opcional: forms/matios-ui-colorpicker/matios-ui-colorpicker.js

   API:
     new MTS.GanttChart(selector, options)
     options.dataSource  — fn async (query) => {data, links} | {url, method, headers, params}
     options.columns     — columnas del grid (ver DEFAULT_COLUMNS)
     options.scale       — 'day' | 'week' | 'month'
     options.editable    — boolean
     options.rowHeight   — px
     options.gridWidth   — px
     options.hoursPerDay — número

   Métodos:
     .addTask(task, parentId?)
     .updateTask(id, fields)
     .deleteTask(id)
     .addLink(link)
     .removeLink(id)
     .collapseAll() / .expandAll()
     .undo() / .redo()
     .setScale(scale)
     .getTasks() / .getLinks()
     .reload()
     .destroy()

   Eventos (via MTS._defineEvents — cada uno devuelve dispose()):
     onLoad | onError | onTaskAdd | onTaskChange | onTaskMove | onTaskResize
     onTaskDelete | onLinkAdd | onLinkRemove | onSelect | onScaleChange | onExport
   ============================================================ */

(function (global) {
  'use strict';

  // ── Utilidades de fecha ──────────────────────────────────────

  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var MS_DAY = 86400000;

  // i18n: textos propios del componente (capa MTS.GanttChart del locale activo) con fallback.
  // El locale base lo aporta matios-ui-i18n.js; las cadenas del Gantt, matios-ui-gantt-chart-i18n.js.
  function gT(key, fallback) {
    var loc = (global.MTS && typeof global.MTS.getLocale === 'function') ? global.MTS.getLocale() : null;
    var g   = loc && loc['MTS.GanttChart'];
    var v   = g ? g[key] : undefined;
    return (v !== undefined && v !== null) ? v : fallback;
  }

  // Gantt "activo" (último con el que se interactuó) para los atajos de teclado undo/redo.
  var _activeGantt = null;

  function parseDate(s) {
    if (s instanceof Date) return s.getTime();
    if (typeof s === 'number') return s;
    var p = String(s).split('-');
    if (p.length === 3) return new Date(+p[0], +p[1] - 1, +p[2]).getTime();
    return new Date(s).getTime();
  }

  function tsToStr(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function daysDiff(a, b) { return Math.round((b - a) / MS_DAY); }

  function startOfDay(ts)   { var d = new Date(ts); d.setHours(0,0,0,0); return d.getTime(); }
  function startOfWeek(ts)  { var d = new Date(ts); d.setDate(d.getDate() - (d.getDay() + 6) % 7); d.setHours(0,0,0,0); return d.getTime(); }
  function startOfMonth(ts) { var d = new Date(ts); d.setDate(1); d.setHours(0,0,0,0); return d.getTime(); }

  function addDays(ts, n)   { return ts + n * MS_DAY; }
  function addWeeks(ts, n)  { return addDays(ts, n * 7); }
  function addMonths(ts, n) { var d = new Date(ts); d.setMonth(d.getMonth() + n); return d.getTime(); }

  function snapToScale(ts, scale) {
    if (scale === 'day')   return startOfDay(ts);
    if (scale === 'week')  return startOfWeek(ts);
    return startOfMonth(ts);
  }

  function addScale(ts, n, scale) {
    if (scale === 'day')   return addDays(ts, n);
    if (scale === 'week')  return addWeeks(ts, n);
    return addMonths(ts, n);
  }

  function isoWeek(ts) {
    var d     = new Date(ts);
    var jan4  = new Date(d.getFullYear(), 0, 4);
    var s1    = new Date(jan4);
    s1.setDate(jan4.getDate() - (jan4.getDay() + 6) % 7);
    return Math.max(1, Math.floor((d - s1) / (7 * MS_DAY)) + 1);
  }

  // ── Utilidades WBS ───────────────────────────────────────────

  function wbsLevel(wbs)   { return String(wbs).split('.').length - 1; }

  function wbsCompare(a, b) {
    var pa = String(a).split('.').map(Number);
    var pb = String(b).split('.').map(Number);
    for (var i = 0; i < Math.max(pa.length, pb.length); i++) {
      var va = pa[i] || 0, vb = pb[i] || 0;
      if (va !== vb) return va - vb;
    }
    return 0;
  }

  function flattenTree(tasks, level) {
    level = level || 0;
    var result = [];
    for (var i = 0; i < tasks.length; i++) {
      var t = tasks[i];
      t._level = level;
      t._hasChildren = !!(t.children && t.children.length);
      result.push(t);
      if (t._hasChildren) {
        var sub = flattenTree(t.children, level + 1);
        for (var j = 0; j < sub.length; j++) result.push(sub[j]);
      }
    }
    return result;
  }

  function normalizeTasks(tasks, hoursPerDay) {
    var flat;
    var hasChildren = tasks.some(function (t) { return t.children && t.children.length; });
    if (hasChildren) {
      flat = flattenTree(tasks, 0);
    } else {
      flat = tasks.slice().sort(function (a, b) { return wbsCompare(a.wbs, b.wbs); });
      for (var i = 0; i < flat.length; i++) {
        flat[i]._level = wbsLevel(flat[i].wbs);
      }
      for (var i = 0; i < flat.length; i++) {
        flat[i]._hasChildren = false;
        if (i < flat.length - 1) {
          flat[i]._hasChildren = String(flat[i + 1].wbs).startsWith(String(flat[i].wbs) + '.');
        }
      }
    }
    var hpd = hoursPerDay || 8;
    for (var i = 0; i < flat.length; i++) {
      var t = flat[i];
      t._startTs = parseDate(t.start);
      t._endTs   = parseDate(t.end);
      t._duration      = daysDiff(t._startTs, t._endTs);
      t._durationHours = t._duration * hpd;
      // Línea base (foto del plan): timestamps para dibujar la barra fantasma (si la tarea los trae).
      t._baseStartTs = t.baselineStart ? parseDate(t.baselineStart) : null;
      t._baseEndTs   = t.baselineEnd   ? parseDate(t.baselineEnd)   : null;
      if (!Array.isArray(t.assignees))    t.assignees    = t.assignees    ? [t.assignees]    : [];
      if (!Array.isArray(t.predecessors)) t.predecessors = t.predecessors ? [t.predecessors] : [];
      if (t.progress == null) t.progress = 0;
      if (!t.status) t.status = 'todo';
    }
    return flat;
  }

  // ── SVG helper ───────────────────────────────────────────────

  function svgEl(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    }
    return el;
  }

  // ── Paleta ───────────────────────────────────────────────────

  var PALETTE = [
    '#4f8eff','#10b981','#f59e0b','#e53935','#a78bfa',
    '#06b6d4','#f97316','#ec4899','#84cc16','#6366f1',
  ];

  // ── Columnas por defecto ─────────────────────────────────────

  function defaultColumns() {
    return [
      { field: 'wbs',           label: gT('colWbs', '#'),                     width: 55,  editable: false },
      { field: 'label',         label: gT('colLabel', 'Task name'),           width: 200, editable: true  },
      { field: 'start',         label: gT('colStart', 'Start'),               width: 95,  editable: true, type: 'date' },
      { field: 'end',           label: gT('colEnd', 'End'),                   width: 95,  editable: true, type: 'date' },
      { field: 'duration',      label: gT('colDuration', 'Days'),             width: 55,  editable: false },
      { field: 'durationHours', label: gT('colDurationHours', 'Hours'),       width: 55,  editable: false },
      { field: 'predecessors',  label: gT('colPredecessors', 'Predecessors'), width: 95,  editable: true  },
    ];
  }

  // ── Cosecha de formulario (modal del dev) ────────────────────
  // clave = name||id ; valor = _mtsInstance.getValue()/.value. Sin clave → se ignora.
  function collectAddTaskData(root) {
    var data = {};
    if (!root) return data;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (node) {
        if (node.hasAttribute && node.hasAttribute('data-mts-collect-ignore')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var node;
    while ((node = walker.nextNode())) {
      var isMts = !!node._mtsInstance;
      var isNative = (node.tagName === 'INPUT' || node.tagName === 'SELECT' || node.tagName === 'TEXTAREA') &&
        node.type !== 'submit' && node.type !== 'button' && node.type !== 'reset' && node.type !== 'image';
      if (!isMts && !isNative) continue;
      if (isNative && !isMts) {
        var p = node.parentNode, inside = false;
        while (p && p !== root) { if (p._mtsInstance) { inside = true; break; } p = p.parentNode; }
        if (inside) continue;
      }
      var key = (node.getAttribute && node.getAttribute('name')) || node.id;
      if (!key) continue;
      if (Object.prototype.hasOwnProperty.call(data, key)) continue;
      var inst = node._mtsInstance, val;
      if (inst && typeof inst.getValue === 'function')       val = inst.getValue();
      else if (inst && typeof inst.isChecked === 'function') val = inst.isChecked();
      else if (inst && typeof inst.getTags === 'function')   val = inst.getTags();
      else if (node.type === 'checkbox' || node.type === 'radio') val = node.checked;
      else val = node.value !== undefined ? node.value : '';
      data[key] = val;
    }
    return data;
  }

  // ── MTS.GanttChart ───────────────────────────────────────────

  class MtsGanttChart {

    constructor(selector, options) {
      this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (!this._el) return;

      var opts = options || {};
      this._opts       = opts;
      this._scale      = opts.scale      || 'week';
      this._rowH       = opts.rowHeight  || 36;
      this._hpd        = opts.hoursPerDay || 8;
      this._editable   = opts.editable !== false;
      this._columns    = opts.columns || defaultColumns();
      this._tasks      = [];
      this._links      = [];
      this._history    = [];   // snapshots para undo
      this._future     = [];   // snapshots para redo
      this._undoLimit  = opts.undoLimit || 50;
      this._collapsed  = {};
      this._selected   = {};
      this._dataSource = opts.dataSource || null;

      // Regla 1: API de eventos explícita via MTS._defineEvents
      MTS._defineEvents(this, [
        'load', 'error',
        'addTask',
        'taskAdd', 'taskChange', 'taskMove', 'taskResize', 'taskDelete',
        'assigneesClick', 'assigneesChange',
        'taskEdit', 'cellEdit', 'reorder', 'baselineSave',
        'linkAdd', 'linkRemove',
        'select', 'scaleChange', 'export', 'import',
      ], opts);

      this._buildDOM();
      this._load();
    }

    // ── API pública ────────────────────────────────────────────

    updateTask(id, fields) {
      var task = this._taskById(id);
      if (!task) return this;
      this._pushHistory();
      var keys = Object.keys(fields);
      for (var i = 0; i < keys.length; i++) task[keys[i]] = fields[keys[i]];
      this._recalc(task);
      this._emit('taskChange', { task: task, fields: fields });
      this._renderGrid();
      this._renderGantt();
      return this;
    }

    addTask(task, parentId) {
      task._level = 0;
      task._hasChildren = false;
      task._startTs = parseDate(task.start);
      task._endTs   = parseDate(task.end);
      this._recalc(task);
      if (!Array.isArray(task.assignees))    task.assignees    = [];
      if (!Array.isArray(task.predecessors)) task.predecessors = [];
      this._pushHistory();
      this._tasks.push(task);
      this._emit('taskAdd', { task: task });
      this._renderGrid();
      this._renderGantt();
      return this;
    }

    // Normaliza un objeto canónico (alineado a MS Project) + alias → shape interno del Gantt.
    // Acepta: name|label|title, finish|end, percentComplete(0-100)|progress(0-1),
    //         predecessors|deps (array o string separado por comas).
    _normalizeCanonicalTask(t) {
      t = t || {};
      var out = {};

      out.id    = t.id || ('t-' + Date.now());
      out.label = t.label || t.name || t.title || '';
      out.start = t.start || t.Start || '';
      out.end   = t.end   || t.finish || t.Finish || '';
      if (out.start) out.start = tsToStr(parseDate(out.start));  // acepta Date (ej. MTS.DatePicker) o string
      if (out.end)   out.end   = tsToStr(parseDate(out.end));

      if (t.percentComplete != null && t.percentComplete !== '') {
        out.progress = Number(t.percentComplete) / 100;
      } else if (t.progress != null && t.progress !== '') {
        out.progress = Number(t.progress);
      }

      var deps = t.predecessors != null ? t.predecessors : t.deps;
      if (typeof deps === 'string') {
        deps = deps.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      }
      out.predecessors = Array.isArray(deps) ? deps : [];

      if (t.color) { out.color = t.color; }
      if (Array.isArray(t.assignees)) { out.assignees = t.assignees; }
      else if (t.assignee) { out.assignees = [{ name: t.assignee }]; }

      if (t.wbs) {
        out.wbs = t.wbs;
      } else {
        // Siguiente WBS de nivel superior (no contar subtareas)
        var maxTop = 0;
        this._tasks.forEach(function (x) {
          var w = String(x.wbs);
          if (w.indexOf('.') < 0) { var n = parseInt(w, 10); if (!isNaN(n) && n > maxTop) maxTop = n; }
        });
        out.wbs = String(maxTop + 1);
      }

      // arrastra campos extra que el dev haya cosechado (round-trip / backend)
      var known = { id:1, label:1, name:1, title:1, start:1, Start:1, end:1, finish:1, Finish:1,
                    percentComplete:1, progress:1, predecessors:1, deps:1, color:1, assignees:1, assignee:1, wbs:1 };
      out.extras = {};
      Object.keys(t).forEach(function (k) { if (!known[k]) { out.extras[k] = t[k]; } });

      return out;
    }

    // Cosecha el modal del dev y dispara onAddTask. Lo llama el botón confirmar del modal del dev.
    submitAddTask() {
      var cfg = this._opts.addTask;
      if (!cfg) return this;
      var root = typeof cfg.form === 'string'  ? document.querySelector(cfg.form)
               : cfg.form ? cfg.form
               : typeof cfg.modal === 'string' ? document.querySelector(cfg.modal)
               : cfg.modal || null;
      if (!root) return this;

      var data = collectAddTaskData(root);
      if (typeof cfg.map === 'function') { data = cfg.map(data) || data; }

      var self = this, settled = false;
      function finish(task) {
        if (settled) return;
        settled = true;
        var t = (task && typeof task === 'object') ? task : data;
        t = self._normalizeCanonicalTask(t);
        self.addTask(t);
        if (typeof cfg.close === 'function') cfg.close();
      }
      var ev = { data: data, resolve: finish, reject: function () { settled = true; } };
      var has = this._listeners.addTask && this._listeners.addTask.length;
      this._emit('addTask', ev);
      if (!has) finish();
      return this;
    }

    // Asignados — clic en la celda dispara onAssigneesClick con un setter.
    // El dev abre su modal (muestra los actuales) y guarda con e.setAssignees([...]).
    _emitAssigneesClick(task) {
      var self = this;
      this._emit('assigneesClick', {
        task:         task,
        assignees:    (task.assignees || []).slice(),
        setAssignees: function (arr) { self.setAssignees(task.id, arr); }
      });
    }

    setAssignees(id, assignees) {
      var task = this._taskById(id);
      if (!task) return this;
      this._pushHistory();
      task.assignees = Array.isArray(assignees) ? assignees : [];
      this._emit('assigneesChange', { task: task, assignees: task.assignees });
      this._renderGrid();
      return this;
    }

    // Edición completa — doble clic en la fila (opción editTask). El dev abre su modal con
    // todos los campos (prefijados desde e.task) y guarda con e.updateTask(fields).
    _emitTaskEdit(task) {
      var self = this;
      this._emit('taskEdit', {
        task:       task,
        updateTask: function (fields) { self.updateTask(task.id, fields); }
      });
    }

    // Editor por celda: doble clic en una celda editable que NO sea el nombre (que va al modal completo).
    // El componente entrega el campo + el elemento ancla (la celda) + updateTask; el editor lo pone el dev
    // (mismo patrón que taskEdit/assigneesClick). Ideal para anclar un MTS.Popover a la celda.
    _emitCellEdit(task, col, anchorEl) {
      var self = this;
      this._emit('cellEdit', {
        task:       task,
        field:      col.field,
        column:     col,
        anchorEl:   anchorEl,
        updateTask: function (fields) { self.updateTask(task.id, fields); }
      });
    }

    // Exportar ("Guardar como") — emite onExport({ format, filename, tasks, csv? }). CSV se genera acá;
    // Excel/MSProject los resuelve el consumer/backend desde el payload (modelo canónico, fase 2).
    exportTasks(format, filename) {
      format = format || 'csv';
      var ext = format === 'csv' ? 'csv' : (format === 'excel' ? 'xlsx' : (format === 'msproject' ? 'xml' : format));
      var tasks   = this.getTasks();
      var payload = { format: format, filename: filename || ('proyecto.' + ext), tasks: tasks };
      if (format === 'csv') { payload.csv = this._buildCSV(tasks); }
      this._emit('export', payload);
      return payload;
    }

    // Importar ("Abrir") — el dev abre un archivo y el board emite onImport({ file, format, name }).
    // El consumer/backend lo parsea (adapters del modelo canónico) y carga con setTasks().
    importFile(file) {
      if (!file) return this;
      var name = file.name || '';
      var ext  = name.indexOf('.') >= 0 ? name.split('.').pop().toLowerCase() : '';
      var format = ext === 'csv' ? 'csv'
                 : (ext === 'xlsx' || ext === 'xls') ? 'excel'
                 : (ext === 'xml' || ext === 'mpp') ? 'msproject'
                 : ext;
      this._emit('import', { file: file, format: format, name: name });
      return this;
    }

    // Carga un set nuevo de tareas (ej. resultado de importar). Acepta array o { data, links }.
    setTasks(input) {
      var res  = input || [];
      var data = Array.isArray(res) ? res : (res.data || []);
      if (this._tasks && this._tasks.length) this._pushHistory();
      this._tasks = normalizeTasks(data, this._hpd);
      this._links = (res && res.links) || [];
      this._collapsed = {};
      this._emit('load', { tasks: this._tasks, links: this._links });
      this._renderGrid();
      this._renderGantt();
      return this;
    }

    _buildCSV(tasks) {
      var cols = this._columns;
      function cell(v) {
        if (Array.isArray(v)) { v = v.map(function (x) { return (x && x.name) ? x.name : x; }).join(' | '); }
        if (v == null) { v = ''; }
        v = String(v).replace(/"/g, '""');
        return /[",\n]/.test(v) ? '"' + v + '"' : v;
      }
      var header = cols.map(function (c) { return cell(c.label); }).join(',');
      var rows = tasks.map(function (t) {
        return cols.map(function (c) { return cell(t[c.field]); }).join(',');
      });
      return header + '\n' + rows.join('\n');
    }

    // ── Reordenar/anidar por drag ────────────────────────────
    _dropMode(e, tr) {
      var rect = tr.getBoundingClientRect();
      var y = e.clientY - rect.top;
      if (y < rect.height * 0.30) return 'before';
      if (y > rect.height * 0.70) return 'after';
      return 'into';
    }
    _markDrop(tr, mode) {
      this._clearDropMarks();
      tr.classList.add('mts-gantt__tr--drop-' + mode);
    }
    _unmarkDrop(tr) {
      tr.classList.remove('mts-gantt__tr--drop-before', 'mts-gantt__tr--drop-after', 'mts-gantt__tr--drop-into');
    }
    _clearDropMarks() {
      if (!this._gridBody) return;
      var marked = this._gridBody.querySelectorAll('.mts-gantt__tr--drop-before, .mts-gantt__tr--drop-after, .mts-gantt__tr--drop-into');
      for (var i = 0; i < marked.length; i++) this._unmarkDrop(marked[i]);
    }

    _buildTree() {
      var sorted = this._tasks.slice().sort(function (a, b) { return wbsCompare(a.wbs, b.wbs); });
      var map = {}, roots = [];
      sorted.forEach(function (t) {
        var node = { task: t, children: [] };
        var wbs  = String(t.wbs);
        map[wbs] = node;
        var dot  = wbs.lastIndexOf('.');
        var parentWbs = dot >= 0 ? wbs.substring(0, dot) : null;
        if (parentWbs && map[parentWbs]) map[parentWbs].children.push(node);
        else roots.push(node);
      });
      return roots;
    }
    _findNode(nodes, id) {
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].task.id === id) return { node: nodes[i], parentArr: nodes, index: i };
        var found = this._findNode(nodes[i].children, id);
        if (found) return found;
      }
      return null;
    }
    _isDescendant(node, id) {
      for (var i = 0; i < node.children.length; i++) {
        if (node.children[i].task.id === id) return true;
        if (this._isDescendant(node.children[i], id)) return true;
      }
      return false;
    }
    _renumber(nodes, prefix) {
      for (var i = 0; i < nodes.length; i++) {
        var wbs = prefix ? prefix + '.' + (i + 1) : String(i + 1);
        nodes[i].task.wbs = wbs;
        this._renumber(nodes[i].children, wbs);
      }
    }

    _moveTask(dragId, targetId, mode) {
      if (dragId === targetId) return this;
      // Snapshot WBS→id ANTES de renumerar (los predecesores referencian WBS)
      var oldWbsToId = {};
      this._tasks.forEach(function (t) { oldWbsToId[String(t.wbs)] = t.id; });

      var roots    = this._buildTree();
      var dragInfo = this._findNode(roots, dragId);
      if (!dragInfo) return this;
      // No soltar una tarea dentro de su propio subárbol
      if (this._isDescendant(dragInfo.node, targetId)) return this;

      this._pushHistory();

      // Sacar el nodo arrastrado (con su subárbol)
      dragInfo.parentArr.splice(dragInfo.index, 1);

      // Reubicar respecto al target (re-buscar por si cambió el índice)
      var targetInfo = this._findNode(roots, targetId);
      if (!targetInfo) return this;
      if (mode === 'into') {
        targetInfo.node.children.push(dragInfo.node);
      } else {
        var arr = targetInfo.parentArr;
        var idx = arr.indexOf(targetInfo.node);
        arr.splice(mode === 'before' ? idx : idx + 1, 0, dragInfo.node);
      }

      // Renumerar WBS de cero y re-aplanar en pre-orden
      this._renumber(roots, '');
      var flat = [];
      (function walk(nodes, level) {
        nodes.forEach(function (n) {
          n.task._level       = level;
          n.task._hasChildren = n.children.length > 0;
          flat.push(n.task);
          walk(n.children, level + 1);
        });
      })(roots, 0);
      this._tasks = flat;

      // Remapear predecesores: WBS viejo → id → WBS nuevo (mantiene los vínculos correctos)
      var idToNewWbs = {};
      this._tasks.forEach(function (t) { idToNewWbs[t.id] = String(t.wbs); });
      this._tasks.forEach(function (t) {
        if (!Array.isArray(t.predecessors)) return;
        t.predecessors = t.predecessors.map(function (p) {
          var id = oldWbsToId[String(p)];
          return (id && idToNewWbs[id]) ? idToNewWbs[id] : p;
        });
      });

      this._renderGrid();
      this._renderGantt();
      this._emit('reorder', { task: dragInfo.node.task, mode: mode, target: targetId, tasks: this._tasks });
      return this;
    }

    deleteTask(id) {
      var task = this._taskById(id);
      if (!task) return this;
      var wbsStr = String(task.wbs);
      var self = this;
      var toRemove = this._tasks.filter(function (t) {
        return t.id === id || String(t.wbs).startsWith(wbsStr + '.');
      });
      this._pushHistory();
      toRemove.forEach(function (t) {
        var i = self._tasks.indexOf(t);
        if (i >= 0) self._tasks.splice(i, 1);
      });
      this._emit('taskDelete', { task: task });
      this._renderGrid();
      this._renderGantt();
      return this;
    }

    addLink(link) {
      this._links.push(link);
      this._emit('linkAdd', { link: link });
      this._renderGantt();
      return this;
    }

    removeLink(id) {
      var idx = this._links.findIndex(function (l) { return l.id === id; });
      if (idx < 0) return this;
      var link = this._links.splice(idx, 1)[0];
      this._emit('linkRemove', { link: link });
      this._renderGantt();
      return this;
    }

    collapseAll() {
      for (var i = 0; i < this._tasks.length; i++) {
        if (this._tasks[i]._hasChildren) this._collapsed[this._tasks[i].id] = true;
      }
      this._renderGrid();
      this._renderGantt();
      return this;
    }

    expandAll() {
      this._collapsed = {};
      this._renderGrid();
      this._renderGantt();
      return this;
    }

    // ── Historial (snapshots) ────────────────────────────────
    // Cada mutación llama _pushHistory() ANTES de cambiar; undo/redo navegan el historial.
    // El snapshot tiene la misma estructura que los datos (sin los campos internos _*).
    _snapshot() {
      var clean = this._tasks.map(function (t) {
        var c = {};
        for (var k in t) { if (t.hasOwnProperty(k) && k.charAt(0) !== '_') c[k] = t[k]; }
        return c;
      });
      return JSON.parse(JSON.stringify(clean));
    }
    _pushHistory() {
      this._future = [];
      this._history.push(this._snapshot());
      if (this._history.length > this._undoLimit) this._history.shift();
    }
    _applyState(state) {
      this._tasks = normalizeTasks(JSON.parse(JSON.stringify(state)), this._hpd);
      this._renderGrid();
      this._renderGantt();
    }

    undo() {
      if (!this._history.length) return this;
      this._future.push(this._snapshot());
      this._applyState(this._history.pop());
      this._emit('load', { tasks: this._tasks, links: this._links });
      return this;
    }
    redo() {
      if (!this._future.length) return this;
      this._history.push(this._snapshot());
      this._applyState(this._future.pop());
      this._emit('load', { tasks: this._tasks, links: this._links });
      return this;
    }

    setScale(scale) {
      this._scale = scale;
      this._renderGantt();
      this._emit('scaleChange', { scale: scale });
      return this;
    }

    getTasks()  { return this._tasks.slice(); }
    getLinks()  { return this._links.slice(); }
    reload()    { this._load(); return this; }

    // ── Visibilidad de columnas (mostrar/ocultar en runtime) ──
    getColumns() { return this._columns.slice(); }

    setColumnVisible(field, visible) {
      for (var i = 0; i < this._columns.length; i++) {
        if (this._columns[i].field === field) { this._columns[i].hidden = (visible === false); break; }
      }
      this._renderGrid();
      return this;
    }

    // ── Línea base (baseline): foto del plan actual ──────────
    // Copia start/end/progress actuales a baseline* (reflejo inmediato: barra fantasma),
    // y emite onBaselineSave({ tasks, baseline }) para que el consumer la persista en el BE.
    saveBaseline() {
      var snap = [];
      for (var i = 0; i < this._tasks.length; i++) {
        var t = this._tasks[i];
        t.baselineStart    = t.start;
        t.baselineEnd      = t.end;
        t.baselineProgress = t.progress;
        t._baseStartTs = t.start ? parseDate(t.start) : null;
        t._baseEndTs   = t.end   ? parseDate(t.end)   : null;
        snap.push({ id: t.id, start: t.start, end: t.end, progress: t.progress });
      }
      this._renderGantt();
      this._emit('baselineSave', { tasks: this._tasks, baseline: snap });
      return this;
    }

    // Borra la línea base (la barra fantasma desaparece). El consumer persiste el borrado por su cuenta.
    clearBaseline() {
      for (var i = 0; i < this._tasks.length; i++) {
        var t = this._tasks[i];
        delete t.baselineStart; delete t.baselineEnd; delete t.baselineProgress;
        t._baseStartTs = null; t._baseEndTs = null;
      }
      this._renderGrid();
      this._renderGantt();
      return this;
    }

    // ── i18n: texto del componente (capa MTS.GanttChart) con fallback ──
    _t(key, fallback) { return gT(key, fallback); }

    // ── Contrato MTS.DevPanel: getConfig() + getCode() ───────
    getConfig() {
      return [
        { group:'Vista', key:'scale', type:'select', label:'Escala', value:this._scale,
          options:[{value:'day',label:'Día'},{value:'week',label:'Semana'},{value:'month',label:'Mes'}],
          description:'Escala de tiempo del gráfico',
          apply:function (v, g) { g.setScale(v); } },
        { group:'Edición', key:'editable', type:'toggle', label:'Editable', value:this._editable,
          description:'Permite drag/resize/edición inline',
          apply:function (v, g) { g._editable = v; g._renderGrid(); g._renderGantt(); } },
        { group:'Edición', key:'reorderable', type:'toggle', label:'Reordenar (drag WBS)', value:!!this._opts.reorderable,
          description:'Arrastrar filas para reordenar/anidar',
          apply:function (v, g) { g._opts.reorderable = v; g._renderGrid(); } },
        { group:'Edición', key:'editTask', type:'toggle', label:'Editar en modal', value:!!this._opts.editTask,
          description:'Doble clic abre el modal del dev',
          apply:function (v, g) { g._opts.editTask = v; g._renderGrid(); } },
        { group:'Layout', key:'rowHeight', type:'number', label:'Alto de fila (px)', value:this._rowH,
          description:'Altura de cada fila',
          apply:function (v, g) { g._rowH = parseInt(v, 10) || 36; g._el.style.setProperty('--mts-gantt-row-h', g._rowH + 'px'); g._renderGrid(); g._renderGantt(); } },
      ];
    }
    getCode() {
      var sel = (this._el && this._el.id) ? ("'#" + this._el.id + "'") : "'#gantt'";
      return [
        'const gantt = new MTS.GanttChart(' + sel + ', {',
        '  dataSource:  myDataSource,',
        "  scale:       '" + this._scale + "',",
        '  editable:    ' + this._editable + ',',
        '  reorderable: ' + (!!this._opts.reorderable) + ',',
        '  editTask:    ' + (!!this._opts.editTask) + ',',
        '  rowHeight:   ' + this._rowH + ',',
        '});'
      ].join('\n');
    }

    destroy() {
      if (this._dragCleanup) this._dragCleanup();
      if (this._kbHandler) { document.removeEventListener('keydown', this._kbHandler); this._kbHandler = null; }
      if (_activeGantt === this) { _activeGantt = null; }
      this._el.innerHTML = ''; // safe: clearing
      this._el.classList.remove('mts-gantt');
      this._disposeAllListeners();
      this._tasks = [];
      this._links = [];
    }

    // ── Interno: recalcular campos derivados ─────────────────

    _recalc(task) {
      if (task.start) task._startTs = parseDate(task.start);
      if (task.end)   task._endTs   = parseDate(task.end);
      task._duration      = daysDiff(task._startTs, task._endTs);
      task._durationHours = task._duration * this._hpd;
    }

    // ── Interno: load dataSource ─────────────────────────────

    _load() {
      var self = this;
      if (!this._dataSource) {
        this._tasks = [];
        this._links = [];
        this._renderGrid();
        this._renderGantt();
        return;
      }
      this._showLoading();

      var query = this._opts.queryParams || {};
      var promise;

      if (typeof this._dataSource === 'function') {
        try   { promise = Promise.resolve(this._dataSource(query)); }
        catch (e) { promise = Promise.reject(e); }
      } else if (this._dataSource && this._dataSource.url) {
        var ds     = this._dataSource;
        var method = (ds.method || 'GET').toUpperCase();
        var params = Object.assign({}, ds.params || {}, query);
        var url    = ds.url;
        var fetchOpts = { method: method, headers: ds.headers || {} };
        if (method === 'GET') {
          var qs = new URLSearchParams(params).toString();
          if (qs) url += (url.indexOf('?') >= 0 ? '&' : '?') + qs;
        } else {
          fetchOpts.headers['Content-Type'] = 'application/json';
          fetchOpts.body = JSON.stringify(params);
        }
        promise = fetch(url, fetchOpts).then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        });
      } else {
        return;
      }

      promise.then(function (res) {
        var data = Array.isArray(res) ? res : (res.data || []);
        self._tasks = normalizeTasks(data, self._hpd);
        self._links = res.links || [];
        self._emit('load', { tasks: self._tasks, links: self._links });
        self._renderGrid();
        self._renderGantt();
      }).catch(function (err) {
        self._emit('error', { error: err });
        self._showError(err.message || self._t('loadError', 'Error al cargar'));
      });
    }

    // ── Interno: construir DOM base ──────────────────────────

    _buildDOM() {
      var self = this;
      this._el.innerHTML = ''; // safe: clearing
      this._el.classList.add('mts-gantt');
      this._el.style.setProperty('--mts-gantt-row-h', this._rowH + 'px');

      // Atajos de teclado undo/redo (cuando editable). Listener global scopeado al gantt activo:
      // se marca activo al hacer mousedown dentro, así Ctrl+Z/Y operan sobre el que tocaste.
      if (this._editable && !this._kbHandler) {
        this._el.addEventListener('mousedown', function () { _activeGantt = self; });
        this._kbHandler = function (e) {
          if (_activeGantt !== self) return;
          var t = e.target;
          if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
          var k = (e.key || '').toLowerCase();
          if ((e.ctrlKey || e.metaKey) && k === 'z' && !e.shiftKey) { e.preventDefault(); self.undo(); }
          else if ((e.ctrlKey || e.metaKey) && (k === 'y' || (k === 'z' && e.shiftKey))) { e.preventDefault(); self.redo(); }
        };
        document.addEventListener('keydown', this._kbHandler);
      }

      // ── Toolbar de autoría (opcional) — botón "+ Agregar tarea" ──
      // Con addTask.showButton:false el dev provee su propio botón (ej. en una MTS.Topbar) y
      // dispara el alta con gantt.submitAddTask(); el flujo (form/cosecha/onAddTask) sigue igual.
      if (this._opts.addTask && this._opts.addTask.showButton !== false) {
        var cfg = this._opts.addTask;
        var toolbar = document.createElement('div');
        toolbar.className = 'mts-gantt__toolbar';
        var addBtn = document.createElement('button');
        addBtn.type        = 'button';
        addBtn.className    = 'mts-btn mts-btn--primary mts-btn--sm mts-gantt__addtask-btn';
        addBtn.textContent  = cfg.label || '+ Agregar tarea';
        addBtn.addEventListener('click', function () {
          if (typeof cfg.open === 'function') cfg.open();
        });
        toolbar.appendChild(addBtn);
        this._el.appendChild(toolbar);
      }

      var split = document.createElement('div');
      split.className = 'mts-gantt__split';

      // Panel izquierdo
      var gridPanel = document.createElement('div');
      gridPanel.className = 'mts-gantt__grid-panel';

      var gridHeader = document.createElement('div');
      gridHeader.className = 'mts-gantt__grid-header';
      this._buildGridHeader(gridHeader);

      var gridBody = document.createElement('div');
      gridBody.className = 'mts-gantt__grid-body';

      gridPanel.appendChild(gridHeader);
      gridPanel.appendChild(gridBody);

      // Panel derecho
      var ganttPanel = document.createElement('div');
      ganttPanel.className = 'mts-gantt__gantt-panel';

      var ganttHeader = document.createElement('div');
      ganttHeader.className = 'mts-gantt__gantt-header';

      var ganttBody = document.createElement('div');
      ganttBody.className = 'mts-gantt__gantt-body';

      ganttPanel.appendChild(ganttHeader);
      ganttPanel.appendChild(ganttBody);

      split.appendChild(gridPanel);
      split.appendChild(ganttPanel);
      this._el.appendChild(split);

      this._gridPanel   = gridPanel;
      this._gridHeader  = gridHeader;
      this._gridBody    = gridBody;
      this._ganttPanel  = ganttPanel;
      this._ganttHeader = ganttHeader;
      this._ganttBody   = ganttBody;

      // ── MTS.Splitter — divide grid y gantt ──────────────────
      if (global.MTS && global.MTS.Splitter) {
        this._splitter = new global.MTS.Splitter(split, {
          direction:   'horizontal',
          initialSize: this._opts.gridWidth ? Math.round(this._opts.gridWidth / (this._el.clientWidth || 800) * 100) : 35,
          minSize:     15,
          maxSize:     75,
          gutterSize:  '5px',
          onChange: function () {
            requestAnimationFrame(function () {
              self._renderGrid();
              self._renderGantt();
            });
          },
        });
      } else {
        console.warn('[MTS.GanttChart] MTS.Splitter no encontrado — el divisor requiere layout/matios-ui-splitter.js');
      }

      this._setupScrollSync();
    }

    // ── Interno: columnas visibles (respeta col.hidden) ─────
    _visibleColumns() {
      return this._columns.filter(function (c) { return !c.hidden; });
    }

    // ── Interno: anchos de columna calculados ───────────────

    _getColWidths() {
      var cols   = this._visibleColumns();
      var panelW = this._gridPanel ? this._gridPanel.clientWidth : 0;
      var sbW    = (this._gridBody && this._gridBody.offsetWidth > 0)
                    ? (this._gridBody.offsetWidth - this._gridBody.clientWidth)
                    : 0;
      var available = panelW - sbW;

      if (available <= 0) {
        return cols.map(function (col) { return col.width || 80; });
      }

      var labelIdx  = -1;
      var otherSum  = 0;
      var labelMin  = 80;
      for (var i = 0; i < cols.length; i++) {
        if (cols[i].field === 'label') {
          labelIdx = i;
          labelMin = cols[i].width || 80;
        } else {
          otherSum += (cols[i].width || 60);
        }
      }

      var widths = [];
      for (var i = 0; i < cols.length; i++) {
        if (i === labelIdx) {
          widths.push(Math.max(labelMin, available - otherSum));
        } else {
          widths.push(cols[i].width || 60);
        }
      }
      return widths;
    }

    _buildGridHeader(container, widths) {
      container.innerHTML = ''; // safe: clearing
      var cols = this._visibleColumns();
      var w = widths || this._getColWidths();
      for (var i = 0; i < cols.length; i++) {
        var col = cols[i];
        var th  = document.createElement('div');
        th.className     = 'mts-gantt__th';
        th.style.flex    = '0 0 ' + w[i] + 'px';
        th.style.width   = w[i] + 'px';
        th.textContent   = col.label;
        container.appendChild(th);
      }
    }

    // ── Interno: scroll sincronizado ─────────────────────────

    _setupScrollSync() {
      var self   = this;
      var locked = false;

      this._gridBody.addEventListener('scroll', function () {
        if (locked) return;
        locked = true;
        self._ganttBody.scrollTop = self._gridBody.scrollTop;
        // Header del grid sigue el scroll horizontal del body
        if (self._gridHeader) self._gridHeader.scrollLeft = self._gridBody.scrollLeft;
        locked = false;
      });

      this._ganttBody.addEventListener('scroll', function () {
        if (locked) return;
        locked = true;
        self._gridBody.scrollTop  = self._ganttBody.scrollTop;
        if (self._ganttHeader && self._ganttHeaderSvg) {
          self._ganttHeader.scrollLeft = self._ganttBody.scrollLeft;
        }
        locked = false;
      });
    }

    // ── Interno: filas visibles (respetando collapse) ────────

    _visibleRows() {
      var rows = [];
      var i    = 0;
      while (i < this._tasks.length) {
        var task = this._tasks[i];
        rows.push(task);
        if (this._collapsed[task.id] && task._hasChildren) {
          i++;
          var prefix = String(task.wbs) + '.';
          while (i < this._tasks.length && String(this._tasks[i].wbs).startsWith(prefix)) i++;
        } else {
          i++;
        }
      }
      return rows;
    }

    // ── Interno: render grid ─────────────────────────────────

    _renderGrid() {
      var self   = this;
      var widths = this._getColWidths();
      var totalW = widths.reduce(function (a, b) { return a + b; }, 0);
      this._buildGridHeader(this._gridHeader, widths);
      this._gridBody.innerHTML = ''; // safe: clearing
      var rows = this._visibleRows();
      if (!rows.length) { this._showEmptyGrid(); return; }
      for (var ri = 0; ri < rows.length; ri++) {
        var row = this._buildGridRow(rows[ri], widths);
        // min-width = suma de columnas → si no entran en el panel, el body scrollea horizontal
        row.style.minWidth = totalW + 'px';
        this._gridBody.appendChild(row);
      }
    }

    _buildGridRow(task, widths) {
      var self = this;
      var tr   = document.createElement('div');
      tr.className = 'mts-gantt__tr' +
        (task._hasChildren         ? ' mts-gantt__tr--group'    : '') +
        (this._selected[task.id]   ? ' mts-gantt__tr--selected' : '');
      tr.dataset.taskId = task.id;
      tr.style.height   = this._rowH + 'px';

      tr.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('.mts-gantt__toggle')) return;
        if (!e.ctrlKey && !e.metaKey) self._selected = {};
        if (self._selected[task.id]) {
          delete self._selected[task.id];
        } else {
          self._selected[task.id] = true;
        }
        self._renderGrid();
        self._renderGanttRowBgs();
        self._emit('select', { tasks: self._getSelectedTasks() });
      });

      if (this._opts.editTask) {
        tr.style.cursor = 'pointer';
        tr.addEventListener('dblclick', function (e) {
          if (e.target.closest && e.target.closest('.mts-gantt__toggle')) return;
          e.stopPropagation();
          self._emitTaskEdit(task);
        });
      }

      // ── Reordenar/anidar por drag (opción reorderable) ──
      if (this._opts.reorderable) {
        tr.classList.add('mts-gantt__tr--reorderable');

        var handle = document.createElement('span');
        handle.className   = 'mts-gantt__drag-handle';
        handle.draggable   = true;
        handle.title       = this._t('reorderHint', 'Arrastrar para reordenar / anidar');
        handle.textContent = '☰'; // ☰
        handle.addEventListener('dragstart', function (e) {
          self._dragTaskId = task.id;
          e.dataTransfer.effectAllowed = 'move';
          try { e.dataTransfer.setData('text/plain', task.id); } catch (err) {}
          try { e.dataTransfer.setDragImage(tr, 12, 12); } catch (err) {}
          tr.classList.add('mts-gantt__tr--dragging');
        });
        handle.addEventListener('dragend', function () {
          tr.classList.remove('mts-gantt__tr--dragging');
          self._clearDropMarks();
          self._dragTaskId = null;
        });
        tr.appendChild(handle);

        tr.addEventListener('dragover', function (e) {
          if (!self._dragTaskId || self._dragTaskId === task.id) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          self._markDrop(tr, self._dropMode(e, tr));
        });
        tr.addEventListener('dragleave', function (e) {
          if (!tr.contains(e.relatedTarget)) self._unmarkDrop(tr);
        });
        tr.addEventListener('drop', function (e) {
          if (!self._dragTaskId || self._dragTaskId === task.id) return;
          e.preventDefault();
          var mode = self._dropMode(e, tr);
          self._clearDropMarks();
          self._moveTask(self._dragTaskId, task.id, mode);
          self._dragTaskId = null;
        });
      }

      var cols = this._visibleColumns();
      for (var ci = 0; ci < cols.length; ci++) {
        tr.appendChild(this._buildCell(task, cols[ci], widths ? widths[ci] : cols[ci].width));
      }
      return tr;
    }

    _buildCell(task, col, colWidth) {
      var self  = this;
      var td    = document.createElement('div');
      var field = col.field;
      var w     = colWidth != null ? colWidth : (col.width || 80);

      td.className   = 'mts-gantt__td mts-gantt__td--' + field;
      td.style.flex  = '0 0 ' + w + 'px';
      td.style.width = w + 'px';

      if (field === 'label') {
        var indent = document.createElement('span');
        indent.style.cssText = 'display:inline-block;width:' + (task._level * 18) + 'px;flex-shrink:0';
        td.appendChild(indent);

        if (task._hasChildren) {
          var toggle = document.createElement('span');
          toggle.className = 'mts-gantt__toggle' + (this._collapsed[task.id] ? '' : ' mts-gantt__toggle--open');
          var svg  = svgEl('svg', { viewBox: '0 0 10 10', fill: 'none', width: 10, height: 10 });
          var path = svgEl('path', { d: 'M3 1l4 4-4 4', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
          svg.appendChild(path);
          toggle.appendChild(svg);
          toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            self._collapsed[task.id] = !self._collapsed[task.id];
            self._renderGrid();
            self._renderGantt();
          });
          td.appendChild(toggle);
        } else {
          var ph = document.createElement('span');
          ph.className = 'mts-gantt__toggle-placeholder';
          td.appendChild(ph);
        }

        var lbl = document.createElement('span');
        lbl.className   = 'mts-gantt__label-text';
        lbl.textContent = task.label || '';
        td.appendChild(lbl);

      } else if (field === 'wbs') {
        td.textContent = task.wbs || '';

      } else if (field === 'duration') {
        td.textContent = task._duration + 'd';

      } else if (field === 'durationHours') {
        td.textContent = task._durationHours + 'h';

      } else if (field === 'predecessors') {
        td.textContent = (task.predecessors || []).join(', ');

      } else if (field === 'progress') {
        var pctVal = Math.round((task.progress || 0) * 100);
        var pct    = document.createElement('div');
        pct.className = 'mts-gantt__pct';
        var fillBar = document.createElement('div');
        fillBar.className   = 'mts-gantt__pct-fill';
        fillBar.style.width = pctVal + '%';
        if (pctVal >= 100) fillBar.classList.add('mts-gantt__pct-fill--done');
        var pctNum = document.createElement('span');
        pctNum.className   = 'mts-gantt__pct-num';
        pctNum.textContent = pctVal + '%';
        pct.appendChild(fillBar);
        pct.appendChild(pctNum);
        td.appendChild(pct);

      } else if (field === 'variance') {
        // Desvío vs línea base: (fin real − fin plan) en días. + = atrasado, − = adelantado.
        if (task._baseEndTs && task._endTs) {
          var dd  = Math.round((task._endTs - task._baseEndTs) / MS_DAY);
          var vsp = document.createElement('span');
          vsp.className = 'mts-gantt__variance mts-gantt__variance--' + (dd > 0 ? 'late' : (dd < 0 ? 'early' : 'ontime'));
          vsp.textContent = (dd > 0 ? '+' : '') + dd + 'd';
          td.appendChild(vsp);
        } else {
          td.textContent = '—';
        }

      } else if (field === 'color') {
        if (col.editable !== false && this._editable && global.MTS && global.MTS.ColorPicker) {
          var cpWrap = document.createElement('div');
          cpWrap.className = 'mts-gantt__cp-wrap';
          new global.MTS.ColorPicker(cpWrap, {
            value:            task.color || PALETTE[0],
            showTriggerText:  false,
            showSliders:      false,
            showInput:        false,
            showFormatSwitch: false,
            size:             'sm',
            onChange: function (detail) {
              self.updateTask(task.id, { color: detail.hex });
            },
          });
          td.appendChild(cpWrap);
        } else {
          var swatch = document.createElement('span');
          swatch.className        = 'mts-gantt__color-swatch';
          swatch.style.background = task.color || PALETTE[0];
          td.appendChild(swatch);
        }
        return td;

      } else if (field === 'assignees') {
        var wrap      = document.createElement('div');
        wrap.className = 'mts-gantt__assignees';
        var assignees = task.assignees || [];
        for (var ai = 0; ai < Math.min(assignees.length, 3); ai++) {
          var av = document.createElement('div');
          av.className = 'mts-gantt__assignee';
          if (assignees[ai].avatar) {
            var img = document.createElement('img');
            img.src = assignees[ai].avatar;
            img.alt = assignees[ai].name || '';
            av.appendChild(img);
          } else {
            av.textContent = (assignees[ai].name || '?').charAt(0).toUpperCase();
          }
          wrap.appendChild(av);
        }
        if (assignees.length > 3) {
          var more = document.createElement('div');
          more.className   = 'mts-gantt__assignee';
          more.textContent = '+' + (assignees.length - 3);
          wrap.appendChild(more);
        }
        var hasAssigneesListener = this._listeners.assigneesClick && this._listeners.assigneesClick.length;
        if (this._editable && col.editable !== false && hasAssigneesListener) {
          if (!assignees.length) {
            var ph = document.createElement('span');
            ph.className   = 'mts-gantt__assignees-add';
            ph.textContent = '+';
            wrap.appendChild(ph);
          }
          wrap.classList.add('mts-gantt__assignees--editable');
          wrap.addEventListener('click', function (e) {
            e.stopPropagation();
            self._emitAssigneesClick(task);
          });
        }
        td.appendChild(wrap);
        return td;

      } else if (field === 'start' || field === 'end') {
        td.textContent = task[field] || '';

      } else {
        td.textContent = task[field] != null ? String(task[field]) : '';
      }

      var notEditable = !col.editable || !this._editable ||
        field === 'wbs' || field === 'duration' || field === 'durationHours';

      var hasCellEditListener = this._listeners.cellEdit && this._listeners.cellEdit.length;

      if (!notEditable && this._opts.editTask && hasCellEditListener && field !== 'label') {
        // Editor por celda: doble clic → onCellEdit (el dev ancla su popover a la celda).
        // El nombre (label) NO entra acá: burbujea a la fila → modal completo (onTaskEdit).
        td.style.cursor = 'pointer';
        td.addEventListener('dblclick', function (e) {
          e.stopPropagation();
          self._emitCellEdit(task, col, td);
        });
      } else if (!notEditable && !this._opts.editTask) {
        // Edición inline clásica (cuando no se usa editTask).
        td.style.cursor = 'text';
        td.addEventListener('dblclick', function (e) {
          e.stopPropagation();
          self._startEdit(task, col, td);
        });
      }

      return td;
    }

    // ── Interno: inline editing ──────────────────────────────

    _startEdit(task, col, td) {
      var self = this;
      if (td.classList.contains('mts-gantt__td--editing')) return;
      td.classList.add('mts-gantt__td--editing');
      td.innerHTML = ''; // safe: clearing before building input

      var field    = col.field;
      var type     = col.type || 'text';
      var oldValue = field === 'predecessors' ? (task.predecessors || []).slice() : task[field];

      var input = document.createElement('input');
      input.className = 'mts-gantt__cell-input';

      if (type === 'date') {
        input.type  = 'date';
        input.value = task[field] || '';
      } else if (field === 'predecessors') {
        input.type  = 'text';
        input.value = (task.predecessors || []).join(', ');
      } else if (field === 'progress') {
        input.type  = 'number';
        input.min   = '0';
        input.max   = '100';
        input.step  = '1';
        input.value = Math.round((task.progress || 0) * 100);
      } else {
        input.type  = 'text';
        input.value = task[field] != null ? String(task[field]) : '';
      }

      td.appendChild(input);
      input.focus();
      input.select();

      function commit() {
        var raw      = input.value.trim();
        var newValue;
        if (field === 'predecessors') {
          newValue = raw ? raw.split(',').map(function (s) { return s.trim(); }).filter(Boolean) : [];
        } else if (field === 'progress') {
          newValue = Math.min(1, Math.max(0, (parseFloat(raw) || 0) / 100));
        } else {
          newValue = raw;
        }
        td.classList.remove('mts-gantt__td--editing');
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          var fields = {};
          fields[field] = newValue;
          self.updateTask(task.id, fields);
        } else {
          self._renderGrid();
        }
      }

      function cancel() {
        td.classList.remove('mts-gantt__td--editing');
        self._renderGrid();
      }

      input.addEventListener('blur', commit);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter')  { input.blur(); }
        if (e.key === 'Escape') { input.removeEventListener('blur', commit); cancel(); }
        e.stopPropagation();
      });
    }

    // ── Nota: color picker ───────────────────────────────────
    // La edición de color usa MTS.ColorPicker directamente en
    // _buildCell (campo 'color'). No se requiere método separado.

    // ── Interno: render Gantt completo ───────────────────────

    _renderGantt() {
      if (this._dragCleanup) { this._dragCleanup(); this._dragCleanup = null; }
      this._ganttHeader.innerHTML = ''; // safe: clearing
      this._ganttBody.innerHTML   = ''; // safe: clearing
      if (!this._tasks.length) return;

      var self    = this;
      var rows    = this._visibleRows();
      var scale   = this._scale;
      var rowH    = this._rowH;
      var MONTH_H = 26;
      var SCALE_H = 22;
      var HEADER_H = MONTH_H + SCALE_H;

      var xMin = Infinity, xMax = -Infinity;
      for (var i = 0; i < this._tasks.length; i++) {
        if (this._tasks[i]._startTs < xMin) xMin = this._tasks[i]._startTs;
        if (this._tasks[i]._endTs   > xMax) xMax = this._tasks[i]._endTs;
      }
      xMin = snapToScale(xMin, scale);
      xMax = addScale(snapToScale(xMax, scale), 2, scale);

      var cols = [];
      var ts   = xMin;
      while (ts <= xMax) { cols.push(ts); ts = addScale(ts, 1, scale); }
      if (!cols.length) return;

      var xEnd   = addScale(cols[cols.length - 1], 1, scale);
      var xRange = xEnd - cols[0];
      var contW  = this._ganttPanel.clientWidth || 600;
      var totalW = Math.max(contW, cols.length * 60);
      var colW   = totalW / cols.length;

      function xScale(t) { return (t - cols[0]) / xRange * totalW; }

      // ── Header SVG ────────────────────────────────────────

      var hSvg = svgEl('svg', { width: totalW, height: HEADER_H, style: 'display:block' });
      hSvg.appendChild(svgEl('rect', { x: 0, y: 0, width: totalW, height: HEADER_H, fill: 'var(--mts-bg-surface-2)' }));

      var MTHS  = this._t('months', MONTHS);
      var prevM = -1, mStart = 0;
      function flushMonth(endCi) {
        if (prevM < 0) return;
        var mx0 = xScale(cols[mStart]);
        var mx1 = endCi < cols.length ? xScale(cols[endCi]) : xScale(xEnd);
        var mw  = mx1 - mx0;
        if (mw < 4) return;
        hSvg.appendChild(svgEl('line', { x1: mx0.toFixed(1), y1: 0, x2: mx0.toFixed(1), y2: MONTH_H, stroke: 'var(--mts-border-color)', 'stroke-width': 1 }));
        var ml = svgEl('text', { x: (mx0 + mw / 2).toFixed(1), y: (MONTH_H / 2).toFixed(1), 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'class': 'mts-gantt__axis-label mts-gantt__axis-label--month' });
        ml.textContent = MTHS[new Date(cols[mStart]).getMonth()] + ' ' + new Date(cols[mStart]).getFullYear();
        hSvg.appendChild(ml);
      }
      for (var ci = 0; ci < cols.length; ci++) {
        var m = new Date(cols[ci]).getMonth();
        if (m !== prevM) { flushMonth(ci); prevM = m; mStart = ci; }
      }
      flushMonth(cols.length);

      hSvg.appendChild(svgEl('line', { x1: 0, y1: MONTH_H, x2: totalW, y2: MONTH_H, stroke: 'var(--mts-border-color)', 'stroke-width': 0.5 }));

      for (var ci = 0; ci < cols.length; ci++) {
        var cx = xScale(cols[ci]);
        var cw = ci < cols.length - 1 ? xScale(cols[ci + 1]) - cx : colW;
        if (cw < 14) continue;
        var sl = svgEl('text', { x: (cx + cw / 2).toFixed(1), y: (MONTH_H + SCALE_H / 2).toFixed(1), 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'class': 'mts-gantt__axis-label' });
        var cd = new Date(cols[ci]);
        if      (scale === 'week') sl.textContent = this._t('weekPrefix', 'W') + isoWeek(cols[ci]);
        else if (scale === 'day')  sl.textContent = String(cd.getDate());
        else                       sl.textContent = MTHS[cd.getMonth()];
        hSvg.appendChild(sl);
      }

      hSvg.appendChild(svgEl('line', { x1: 0, y1: HEADER_H, x2: totalW, y2: HEADER_H, stroke: 'var(--mts-border-color)', 'stroke-width': 1 }));

      this._ganttHeader.style.overflowX = 'hidden';
      this._ganttHeader.appendChild(hSvg);
      this._ganttHeaderSvg = hSvg;

      // ── Body SVG ──────────────────────────────────────────

      var chartH = rows.length * rowH;
      var bSvg   = svgEl('svg', { width: totalW, height: chartH, style: 'display:block' });

      var defs  = svgEl('defs');
      var mkr   = svgEl('marker', { id: 'mts-gantt-arrow', markerWidth: 7, markerHeight: 7, refX: 6, refY: 3.5, orient: 'auto' });
      mkr.appendChild(svgEl('path', { d: 'M0,0.5 L0,6.5 L7,3.5 Z', fill: 'var(--mts-text-muted,#6b7280)' }));
      defs.appendChild(mkr);
      bSvg.appendChild(defs);

      for (var ci = 0; ci < cols.length; ci++) {
        var cx = xScale(cols[ci]);
        var cw = ci < cols.length - 1 ? xScale(cols[ci + 1]) - cx : colW;
        if (ci % 2 === 1) {
          bSvg.appendChild(svgEl('rect', { x: cx.toFixed(1), y: 0, width: cw.toFixed(1), height: chartH, fill: 'var(--mts-bg-surface-2)' }));
        }
        bSvg.appendChild(svgEl('line', { x1: cx.toFixed(1), y1: 0, x2: cx.toFixed(1), y2: chartH, 'class': 'mts-gantt__grid-line' }));
      }

      var todayTs = startOfDay(Date.now());
      if (todayTs >= cols[0] && todayTs <= xEnd) {
        var tx = xScale(todayTs);
        bSvg.appendChild(svgEl('line', { x1: tx.toFixed(1), y1: 0, x2: tx.toFixed(1), y2: chartH, 'class': 'mts-gantt__today-line' }));
        var todayLbl = svgEl('text', { x: (tx + 3).toFixed(1), y: 10, 'class': 'mts-gantt__today-label' });
        todayLbl.textContent = this._t('today', 'Today');
        bSvg.appendChild(todayLbl);
      }

      var gRowBg = svgEl('g');
      for (var ri = 0; ri < rows.length; ri++) {
        var rowY = ri * rowH;
        if (rows[ri]._hasChildren) gRowBg.appendChild(svgEl('rect', { x: 0, y: rowY, width: totalW, height: rowH, 'class': 'mts-gantt__row-bg--group' }));
        if (this._selected[rows[ri].id]) gRowBg.appendChild(svgEl('rect', { x: 0, y: rowY, width: totalW, height: rowH, 'class': 'mts-gantt__row-bg--selected' }));
        gRowBg.appendChild(svgEl('line', { x1: 0, y1: rowY + rowH, x2: totalW, y2: rowY + rowH, 'class': 'mts-gantt__grid-line' }));
      }
      bSvg.appendChild(gRowBg);
      this._gRowBg = gRowBg;

      // ── Barras ──────────────────────────────────────────────

      var gBars  = svgEl('g');
      var barPad = 6;
      var barH   = rowH - barPad * 2;
      var HANDLE = 8;
      var barMeta = {};
      var pIdx   = 0;

      for (var ri = 0; ri < rows.length; ri++) {
        var task  = rows[ri];
        var rowY  = ri * rowH;
        var color = task.color || PALETTE[pIdx % PALETTE.length];
        if (!task.color) pIdx++;

        if (task._duration === 0) {
          var mx = xScale(task._startTs);
          var my = rowY + rowH / 2;
          var ms = barH / 2;
          gBars.appendChild(svgEl('polygon', {
            points: mx + ',' + (my - ms) + ' ' + (mx + ms) + ',' + my + ' ' + mx + ',' + (my + ms) + ' ' + (mx - ms) + ',' + my,
            'class': 'mts-gantt__milestone',
          }));
          barMeta[task.id] = { task: task, bx: mx, bw: 0, barY: rowY + barPad, barH: barH };
          continue;
        }

        var bx   = xScale(task._startTs);
        var bw   = Math.max(4, xScale(task._endTs) - bx);
        var barY = rowY + barPad;

        // Línea base: barra fantasma fina, debajo de la barra real (entre baselineStart..baselineEnd).
        if (task._baseStartTs && task._baseEndTs) {
          var blx = xScale(task._baseStartTs);
          var blw = Math.max(2, xScale(task._baseEndTs) - blx);
          var blRect = svgEl('rect', {
            x: blx.toFixed(1), y: (barY + barH + 1).toFixed(1), width: blw.toFixed(1), height: 4,
            rx: 2, 'class': 'mts-gantt__bar-baseline',
          });
          var blTitle = svgEl('title');
          blTitle.textContent = this._t('baselineLabel', 'Línea base') + ': ' + task.baselineStart + ' – ' + task.baselineEnd;
          blRect.appendChild(blTitle);
          gBars.appendChild(blRect);
        }

        var bar = svgEl('rect', {
          x: bx.toFixed(1), y: barY, width: bw.toFixed(1), height: barH,
          fill: color, rx: task._hasChildren ? 2 : 3,
          'class': 'mts-gantt__bar' + (task._hasChildren ? ' mts-gantt__bar--group' : ''),
          style: (this._editable && !task._hasChildren) ? 'cursor:grab' : 'cursor:pointer',
          opacity: task._hasChildren ? '1' : '0.88',
        });

        if (task.progress > 0 && !task._hasChildren) {
          gBars.appendChild(svgEl('rect', {
            x: bx.toFixed(1), y: barY, width: (bw * Math.min(1, task.progress)).toFixed(1), height: barH,
            fill: '#fff', rx: 3, 'class': 'mts-gantt__bar-progress',
          }));
        }

        var ilbl = svgEl('text', { x: (bx + bw / 2).toFixed(1), y: (barY + barH / 2).toFixed(1), 'class': 'mts-gantt__bar-label', opacity: bw > 50 ? '1' : '0' });
        ilbl.textContent = task.label || '';

        gBars.appendChild(bar);
        gBars.appendChild(ilbl);

        var lH = null, rH = null;
        if (this._editable && !task._hasChildren) {
          lH = svgEl('rect', { x: bx.toFixed(1), y: barY, width: HANDLE, height: barH, fill: 'rgba(255,255,255,0)', style: 'cursor:ew-resize' });
          rH = svgEl('rect', { x: (bx + bw - HANDLE).toFixed(1), y: barY, width: HANDLE, height: barH, fill: 'rgba(255,255,255,0)', style: 'cursor:ew-resize' });
          gBars.appendChild(lH);
          gBars.appendChild(rH);
        }

        (function (barEl, t, col) {
          barEl.addEventListener('mouseenter', function () { barEl.setAttribute('opacity', '1'); });
          barEl.addEventListener('mouseleave', function () { barEl.setAttribute('opacity', t._hasChildren ? '1' : '0.88'); });
          barEl.addEventListener('click',      function () { self._emit('select', { tasks: [t] }); });
        }(bar, task, color));

        barMeta[task.id] = { task: task, color: color, barEl: bar, ilbl: ilbl, lH: lH, rH: rH, barY: barY, barH: barH, bx: bx, bw: bw };
      }

      bSvg.appendChild(gBars);

      var gDeps = svgEl('g');
      this._renderDeps(gDeps, barMeta, xScale, rows);
      bSvg.appendChild(gDeps);

      this._ganttBody.appendChild(bSvg);

      this._bodySvg  = bSvg;
      this._barMeta  = barMeta;
      this._gDeps    = gDeps;
      this._xScaleFn = xScale;
      this._xMin     = xMin;
      this._xEnd     = xEnd;
      this._xRange   = xRange;
      this._cols     = cols;
      this._totalW   = totalW;
      this._barPad   = barPad;
      this._barH_g   = barH;

      if (this._editable) this._setupDrag(bSvg, barMeta, xScale, xRange, totalW, rowH, scale);

      var self2 = this;
      setTimeout(function () { self2._ganttHeader.scrollLeft = self2._ganttBody.scrollLeft; }, 0);
    }

    // ── Interno: dependencias (flechas) ──────────────────────

    _renderDeps(gDeps, barMeta, xScaleFn, rows) {
      while (gDeps.firstChild) gDeps.removeChild(gDeps.firstChild);
      var wbsMap = {};
      for (var i = 0; i < this._tasks.length; i++) wbsMap[this._tasks[i].wbs] = this._tasks[i];

      for (var ri = 0; ri < rows.length; ri++) {
        var task = rows[ri];
        if (!task.predecessors || !task.predecessors.length) continue;
        var tgt = barMeta[task.id];
        if (!tgt || !tgt.barEl) continue;

        for (var pi = 0; pi < task.predecessors.length; pi++) {
          var pred = wbsMap[task.predecessors[pi]];
          if (!pred) continue;
          var src = barMeta[pred.id];
          if (!src || !src.barEl) continue;

          var sx  = src.bx + src.bw;
          var sy  = src.barY + src.barH / 2;
          var tx  = tgt.bx;
          var ty  = tgt.barY + tgt.barH / 2;
          var gap = tx - sx;
          var cp1 = sx + Math.max(16, gap * 0.4);
          var cp2 = tx - Math.max(16, gap * 0.4);
          var d   = 'M ' + sx.toFixed(1) + ' ' + sy.toFixed(1) +
            ' C ' + cp1.toFixed(1) + ' ' + sy.toFixed(1) +
            ' '   + cp2.toFixed(1) + ' ' + ty.toFixed(1) +
            ' '   + tx.toFixed(1)  + ' ' + ty.toFixed(1);

          gDeps.appendChild(svgEl('path', { d: d, 'class': 'mts-gantt__link', 'marker-end': 'url(#mts-gantt-arrow)' }));
        }
      }
    }

    // ── Interno: actualizar solo fondos de filas en Gantt ────

    _renderGanttRowBgs() {
      if (!this._gRowBg) return;
      var g     = this._gRowBg;
      var rows  = this._visibleRows();
      var rowH  = this._rowH;
      var totalW = this._totalW || 600;
      while (g.firstChild) g.removeChild(g.firstChild);
      for (var ri = 0; ri < rows.length; ri++) {
        var rowY = ri * rowH;
        if (rows[ri]._hasChildren) g.appendChild(svgEl('rect', { x: 0, y: rowY, width: totalW, height: rowH, 'class': 'mts-gantt__row-bg--group' }));
        if (this._selected[rows[ri].id]) g.appendChild(svgEl('rect', { x: 0, y: rowY, width: totalW, height: rowH, 'class': 'mts-gantt__row-bg--selected' }));
        g.appendChild(svgEl('line', { x1: 0, y1: rowY + rowH, x2: totalW, y2: rowY + rowH, 'class': 'mts-gantt__grid-line' }));
      }
    }

    // ── Interno: drag move + resize ──────────────────────────

    _setupDrag(svg, barMeta, xScaleFn, xRange, totalW, rowH, scale) {
      var self = this;
      var ds   = null;

      function svgPx(e) {
        return e.clientX - svg.getBoundingClientRect().left + self._ganttBody.scrollLeft;
      }

      function updateBarEl(meta) {
        var task = meta.task;
        var bx   = xScaleFn(task._startTs);
        var bw   = Math.max(4, xScaleFn(task._endTs) - bx);
        meta.barEl.setAttribute('x',     bx.toFixed(1));
        meta.barEl.setAttribute('width', bw.toFixed(1));
        meta.ilbl.setAttribute('x',      (bx + bw / 2).toFixed(1));
        meta.ilbl.setAttribute('opacity', bw > 50 ? '1' : '0');
        meta.bx = bx; meta.bw = bw;
        if (meta.lH) {
          meta.lH.setAttribute('x', bx.toFixed(1));
          meta.rH.setAttribute('x', (bx + bw - 8).toFixed(1));
        }
        self._renderDeps(self._gDeps, self._barMeta, xScaleFn, self._visibleRows());
      }

      function onMouseDown(e) {
        if (e.button !== 0) return;
        var el   = e.target;
        var ids  = Object.keys(barMeta);
        var meta = null, type = null;
        for (var i = 0; i < ids.length; i++) {
          var m = barMeta[ids[i]];
          if (!m.barEl) continue;
          if (el === m.lH)    { type = 'resize-left';  meta = m; break; }
          if (el === m.rH)    { type = 'resize-right'; meta = m; break; }
          if (el === m.barEl) { type = 'move';         meta = m; break; }
        }
        if (!meta) return;
        e.preventDefault();
        if (type === 'move') meta.barEl.style.cursor = 'grabbing';
        ds = { type: type, meta: meta, startPx: svgPx(e), origStart: meta.task._startTs, origEnd: meta.task._endTs };
      }

      function onMouseMove(e) {
        if (!ds) return;
        // Snapshot al primer movimiento real (para que Ctrl+Z deshaga el mover/redimensionar la barra)
        if (!ds._pushed) { self._pushHistory(); ds._pushed = true; }
        e.preventDefault();
        var dx   = svgPx(e) - ds.startPx;
        var dt   = dx / totalW * xRange;
        var task = ds.meta.task;

        if (ds.type === 'move') {
          var dur = ds.origEnd - ds.origStart;
          var ns  = snapToScale(ds.origStart + dt, scale);
          task._startTs = ns;
          task._endTs   = ns + dur;
        } else if (ds.type === 'resize-right') {
          var ne = snapToScale(ds.origEnd + dt, scale);
          if (ne <= task._startTs) ne = addScale(task._startTs, 1, scale);
          task._endTs = ne;
        } else {
          var ns = snapToScale(ds.origStart + dt, scale);
          if (ns >= task._endTs) ns = addScale(task._endTs, -1, scale);
          task._startTs = ns;
        }
        task._duration      = daysDiff(task._startTs, task._endTs);
        task._durationHours = task._duration * self._hpd;
        updateBarEl(ds.meta);
      }

      function onMouseUp() {
        if (!ds) return;
        var meta = ds.meta;
        var task = meta.task;
        task.start = tsToStr(task._startTs);
        task.end   = tsToStr(task._endTs);

        var eventName = ds.type === 'move' ? 'taskMove' : 'taskResize';
        if (ds.type === 'move') meta.barEl.style.cursor = 'grab';
        self._emit(eventName, { task: task });
        self._updateGridRowDates(task);
        ds = null;
      }

      svg.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup',   onMouseUp);

      this._dragCleanup = function () {
        svg.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup',   onMouseUp);
      };
    }

    // ── Interno: actualizar celdas de fecha en el grid ───────

    _updateGridRowDates(task) {
      var row = this._gridBody.querySelector('[data-task-id="' + task.id + '"]');
      if (!row) return;
      var tds  = row.querySelectorAll('.mts-gantt__td');
      var cols = this._visibleColumns();
      for (var i = 0; i < cols.length; i++) {
        var col = cols[i];
        var td  = tds[i];
        if (!td) continue;
        if (col.field === 'start')         td.textContent = task.start || '';
        if (col.field === 'end')           td.textContent = task.end   || '';
        if (col.field === 'duration')      td.textContent = task._duration + 'd';
        if (col.field === 'durationHours') td.textContent = task._durationHours + 'h';
      }
    }

    // ── Interno: helpers ─────────────────────────────────────

    _taskById(id) {
      for (var i = 0; i < this._tasks.length; i++) {
        if (this._tasks[i].id === id) return this._tasks[i];
      }
      return null;
    }

    _getSelectedTasks() {
      var self = this;
      return this._tasks.filter(function (t) { return self._selected[t.id]; });
    }

    // ── Interno: estados vacío / carga / error ────────────────

    _showLoading() {
      this._gridBody.innerHTML = ''; // safe: clearing
      for (var i = 0; i < 8; i++) {
        var row = document.createElement('div');
        row.className  = 'mts-gantt__skeleton-row';
        row.style.height = this._rowH + 'px';
        var widths = [40, 140, 70, 70, 40, 40, 60];
        for (var j = 0; j < widths.length; j++) {
          var bone = document.createElement('div');
          bone.className   = 'mts-gantt__skeleton-bone';
          bone.style.width = widths[j] + 'px';
          row.appendChild(bone);
        }
        this._gridBody.appendChild(row);
      }
      this._ganttBody.innerHTML = ''; // safe: clearing
    }

    _showEmptyGrid() {
      var empty = document.createElement('div');
      empty.className = 'mts-gantt__empty';
      var msg = document.createElement('span');
      msg.textContent = this._t('empty', 'No hay tareas');
      empty.appendChild(msg);
      this._gridBody.appendChild(empty);
    }

    _showError(msg) {
      this._gridBody.innerHTML = ''; // safe: clearing
      var err  = document.createElement('div');
      err.className = 'mts-gantt__empty';
      var span = document.createElement('span');
      span.textContent = this._t('errorPrefix', 'Error: ') + msg;
      err.appendChild(span);
      this._gridBody.appendChild(err);
    }
  }

  global.MTS = global.MTS || {};
  global.MTS.GanttChart = MtsGanttChart;

}(typeof window !== 'undefined' ? window : this));
