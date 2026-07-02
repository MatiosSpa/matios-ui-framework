/* ============================================================
   MATIOS UI — matios-ui-sprint-board.js
   MTS.SprintBoard — Backlog + Sprint Board con drag bidireccional

   Dep: base/matios-ui-base.js      (MTS._defineEvents)
        layout/matios-ui-splitter   (MTS.Splitter)
        widgets/boards/matios-ui-kanban (MTS.Kanban — panel Sprint)

   Estructura:
     [ Backlog (izq) ] | [ Sprint actual (der) ]
     Splitter horizontal separa los paneles.
     Drag bidireccional: Backlog ↔ Sprint.

   Eventos (via MTS._defineEvents):
     onLoad | onError |
     onStoryAdd | onStoryChange | onStoryMove | onStoryDelete |
     onSprintChange | onSprintStart | onSprintComplete | onSelect
   ============================================================ */

(function (global) {
  'use strict';

  global.MTS = global.MTS || {};

  /* ── Constantes ─────────────────────────────────────────── */

  let STORY_TYPES = ['userstory', 'task', 'bug', 'epic', 'spike'];
  let PRIORITIES  = ['low', 'medium', 'high', 'critical'];
  let SP_VALUES   = [1, 2, 3, 5, 8, 13, 21];

  let TYPE_ICON_NAMES = {
    userstory: 'book-open',
    task:      'check-circle',
    bug:       'bug',
    epic:      'lightning',
    spike:     'cpu',
  };

  let TYPE_COLORS = {
    userstory: 'var(--mts-color-primary)',
    task:      'var(--mts-color-success)',
    bug:       'var(--mts-color-danger)',
    epic:      'var(--mts-color-warning)',
    spike:     'var(--mts-text-muted)',
  };

  let STATUS_COLS = ['todo', 'wip', 'done'];

  // ── Cosecha de formulario (modal del dev) ────────────────
  // clave = name||id ; valor = _mtsInstance.getValue()/.value. Sin clave → se ignora.
  function collectAddTaskData(root) {
    let data = {};
    if (!root) return data;
    let walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (node) {
        if (node.hasAttribute && node.hasAttribute('data-mts-collect-ignore')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      let isMts = !!node._mtsInstance;
      let isNative = (node.tagName === 'INPUT' || node.tagName === 'SELECT' || node.tagName === 'TEXTAREA') &&
        node.type !== 'submit' && node.type !== 'button' && node.type !== 'reset' && node.type !== 'image';
      if (!isMts && !isNative) continue;
      if (isNative && !isMts) {
        let p = node.parentNode, inside = false;
        while (p && p !== root) { if (p._mtsInstance) { inside = true; break; } p = p.parentNode; }
        if (inside) continue;
      }
      let key = (node.getAttribute && node.getAttribute('name')) || node.id;
      if (!key) continue;
      if (Object.prototype.hasOwnProperty.call(data, key)) continue;
      let inst = node._mtsInstance, val;
      if (inst && typeof inst.getValue === 'function')       val = inst.getValue();
      else if (inst && typeof inst.isChecked === 'function') val = inst.isChecked();
      else if (inst && typeof inst.getTags === 'function')   val = inst.getTags();
      else if (node.type === 'checkbox' || node.type === 'radio') val = node.checked;
      else val = node.value !== undefined ? node.value : '';
      data[key] = val;
    }
    return data;
  }

  /* ── MTS.SprintBoard ────────────────────────────────────── */

  function SprintBoard(selector, options) {
    this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;

    let opts = options || {};
    this._opts           = opts;
    this._dataSource     = opts.dataSource || null;
    this._currentSprintId = opts.currentSprintId || null;
    this._columns        = opts.columns || [
      { id: 'todo', title: this._t('colTodo', 'Por hacer'),  color: 'var(--mts-text-muted)' },
      { id: 'wip',  title: this._t('colWip', 'En curso'),    color: 'var(--mts-color-warning)' },
      { id: 'done', title: this._t('colDone', 'Completado'), color: 'var(--mts-color-success)' },
    ];
    this._showBacklog    = opts.showBacklog    !== false;
    this._showVelocity   = opts.showVelocity   === true;
    this._splitterDir    = opts.splitter       || 'horizontal';
    this._addStories     = opts.addStories     === true;

    this._stories  = [];
    this._sprints  = [];
    this._selected = {};

    this._kanban   = null;
    this._splitter = null;

    // Regla 1: API de eventos explícita
    MTS._defineEvents(this, [
      'load', 'error',
      'addTask',
      'storyAdd', 'storyChange', 'storyMove', 'storyDelete',
      'sprintChange', 'sprintStart', 'sprintComplete',
      'select',
    ], opts);

    // Flujo de autoría con modal del dev (botón se renderiza en _renderToolbar)
    this._addTaskCfg = opts.addTask || null;

    this._buildDOM();

    if (this._dataSource) {
      this._load();
    }
  }

  /* ── API pública ─────────────────────────────────────────── */

  // i18n: texto propio del componente (capa MTS.SprintBoard) con fallback.
  SprintBoard.prototype._t = function (key, fallback) {
    let loc = (global.MTS && typeof global.MTS.getString === 'function') ? global.MTS.getString()['MTS.SprintBoard'] : null;
    return (loc && loc[key] != null) ? loc[key] : fallback;
  };

  // Contrato MTS.DevPanel: getConfig() + getCode()
  SprintBoard.prototype.getConfig = function () {
    return [
      { group: 'Paneles', key: 'showBacklog', type: 'toggle', label: 'Backlog', value: this._showBacklog,
        description: 'Muestra el panel Backlog a la izquierda',
        apply: function (v, sb) { sb._showBacklog = v; sb._buildDOM(); sb._renderAll(); } },
      { group: 'Paneles', key: 'showVelocity', type: 'toggle', label: 'Velocity', value: this._showVelocity,
        description: 'Banner de capacidad del sprint',
        apply: function (v, sb) { sb._showVelocity = v; sb._buildDOM(); sb._renderAll(); } },
      { group: 'Edición', key: 'addStories', type: 'toggle', label: 'Alta inline', value: this._addStories,
        description: 'Botón "+ Historia" inline en la toolbar',
        apply: function (v, sb) { sb._addStories = v; sb._renderToolbar(); } },
    ];
  };
  SprintBoard.prototype.getCode = function () {
    let sel = (this._el && this._el.id) ? ("'#" + this._el.id + "'") : "'#sprint'";
    return [
      'const sprint = new MTS.SprintBoard(' + sel + ', {',
      '  dataSource:   myDataSource,',
      '  showBacklog:  ' + this._showBacklog + ',',
      '  showVelocity: ' + this._showVelocity + ',',
      '});',
    ].join('\n');
  };

  // Normaliza un objeto canónico (alineado a Jira) + alias → shape interno de Story.
  // Acepta: summary|title, issuetype|type, key|code; storyPoints, priority, status, assignees.
  SprintBoard.prototype._normalizeCanonicalStory = function (t) {
    t = t || {};
    let out = {};
    out.id          = t.id || ('s-' + Date.now());
    out.code        = t.code || t.key || undefined;
    out.title       = t.title || t.summary || '';
    out.description = t.description || '';
    out.type        = t.type || t.issuetype || 'userstory';
    if (t.storyPoints != null && t.storyPoints !== '') { out.storyPoints = Number(t.storyPoints); }
    out.priority    = t.priority || 'medium';
    if (t.status) { out.status = t.status; }
    if (Array.isArray(t.assignees)) { out.assignees = t.assignees; }
    else if (t.assignee) { out.assignees = [{ name: t.assignee }]; }
    if (Array.isArray(t.tags)) { out.tags = t.tags; }
    if (t._location) { out._location = t._location; }

    let known = { id:1, code:1, key:1, title:1, summary:1, description:1, type:1, issuetype:1,
                  storyPoints:1, priority:1, status:1, assignees:1, assignee:1, tags:1, _location:1 };
    out.extras = {};
    Object.keys(t).forEach(function (k) { if (!known[k]) { out.extras[k] = t[k]; } });

    return out;
  };

  // Cosecha el modal del dev y dispara onAddTask. Lo llama el botón confirmar del modal del dev.
  SprintBoard.prototype.submitAddTask = function () {
    let cfg = this._addTaskCfg;
    if (!cfg) return this;
    let root = typeof cfg.form === 'string'  ? document.querySelector(cfg.form)
             : cfg.form ? cfg.form
             : typeof cfg.modal === 'string' ? document.querySelector(cfg.modal)
             : cfg.modal || null;
    if (!root) return this;

    let data = collectAddTaskData(root);
    if (typeof cfg.map === 'function') { data = cfg.map(data) || data; }

    let self = this, settled = false;
    function finish(story) {
      if (settled) return;
      settled = true;
      let t = (story && typeof story === 'object') ? story : data;
      t = self._normalizeCanonicalStory(t);
      self.addStory(t, t._location || 'backlog');
      if (typeof cfg.close === 'function') cfg.close();
    }
    let ev = { data: data, resolve: finish, reject: function () { settled = true; } };
    let has = this._listeners.addTask && this._listeners.addTask.length;
    this._emit('addTask', ev);
    if (!has) finish();
    return this;
  };

  SprintBoard.prototype.addStory = function (story, location) {
    story._id = story.id || ('s' + Date.now());
    if (location === 'sprint' && this._currentSprintId) {
      story.sprintId = this._currentSprintId;
      story.status   = story.status || 'todo';
    } else {
      story.sprintId = null;
    }
    this._stories.push(story);
    this._emit('storyAdd', { story: story, location: location || 'backlog' });
    this._renderAll();
    return this;
  };

  SprintBoard.prototype.updateStory = function (id, fields) {
    let story = this._storyById(id);
    if (!story) return this;
    let changed = {};
    let keys    = Object.keys(fields);
    for (let i = 0; i < keys.length; i++) {
      if (story[keys[i]] !== fields[keys[i]]) { story[keys[i]] = fields[keys[i]]; changed[keys[i]] = fields[keys[i]]; }
    }
    if (Object.keys(changed).length) {
      this._emit('storyChange', { story: story, fields: changed });
      this._renderAll();
    }
    return this;
  };

  SprintBoard.prototype.deleteStory = function (id) {
    let story = this._storyById(id);
    if (!story) return this;
    let idx = this._stories.indexOf(story);
    this._stories.splice(idx, 1);
    this._emit('storyDelete', { story: story });
    this._renderAll();
    return this;
  };

  SprintBoard.prototype.moveStory = function (id, target) {
    let story = this._storyById(id);
    if (!story) return this;
    let from = { type: story.sprintId ? 'sprint' : 'backlog', columnId: story.status };
    if (target.type === 'sprint') {
      story.sprintId = this._currentSprintId;
      story.status   = target.columnId || 'todo';
    } else {
      story.sprintId = null;
      story.status   = null;
    }
    this._emit('storyMove', { story: story, from: from, to: target });
    this._renderAll();
    return this;
  };

  SprintBoard.prototype.startSprint = function (sprintId) {
    let sprint = this._sprintById(sprintId);
    if (!sprint) return this;
    sprint.status = 'active';
    this._currentSprintId = sprintId;
    this._emit('sprintStart', { sprint: sprint });
    this._renderAll();
    return this;
  };

  SprintBoard.prototype.completeSprint = function (sprintId) {
    let sprint = this._sprintById(sprintId);
    if (!sprint) return this;
    sprint.status = 'completed';
    let done    = this._stories.filter(function(s) { return s.sprintId === sprintId && s.status === 'done'; });
    let pending = this._stories.filter(function(s) { return s.sprintId === sprintId && s.status !== 'done'; });
    // Mover pendientes al backlog
    pending.forEach(function(s) { s.sprintId = null; s.status = null; });
    this._emit('sprintComplete', { sprint: sprint, doneStories: done, pendingStories: pending });
    this._renderAll();
    return this;
  };

  SprintBoard.prototype.setCurrentSprint = function (sprintId) {
    this._currentSprintId = sprintId;
    this._renderAll();
    return this;
  };

  SprintBoard.prototype.getBacklog = function () {
    return this._stories.filter(function(s) { return !s.sprintId; });
  };

  SprintBoard.prototype.getCurrentSprintStories = function () {
    let id = this._currentSprintId;
    return this._stories.filter(function(s) { return s.sprintId === id; });
  };

  SprintBoard.prototype.reload = function () {
    if (this._dataSource) { this._load(); }
    return this;
  };

  SprintBoard.prototype.destroy = function () {
    if (this._splitter && this._splitter.destroy) this._splitter.destroy();
    this._el.innerHTML = ''; // safe: clearing
    this._el.classList.remove('mts-sb');
    this._disposeAllListeners();
    this._stories = [];
    this._sprints = [];
  };

  /* ── Interno: load ─────────────────────────────────────── */

  SprintBoard.prototype._load = function () {
    let self = this;
    let promise;
    try   { promise = Promise.resolve(this._dataSource({})); }
    catch (e) { promise = Promise.reject(e); }

    promise.then(function(res) {
      self._stories = res.stories || [];
      self._sprints = res.sprints || [];
      if (!self._currentSprintId) {
        let active = self._sprints.find(function(s) { return s.status === 'active'; });
        if (active) self._currentSprintId = active.id;
      }
      self._emit('load', { stories: self._stories, sprints: self._sprints });
      self._renderAll();
    }).catch(function(err) {
      self._emit('error', { error: err });
    });
  };

  /* ── Interno: build DOM base ──────────────────────────── */

  SprintBoard.prototype._buildDOM = function () {
    this._el.innerHTML = ''; // safe: clearing
    this._el.classList.add('mts-sb');

    // Velocity banner (opcional)
    if (this._showVelocity) {
      let banner = document.createElement('div');
      banner.className = 'mts-sb__velocity';
      this._velocityEl = banner;
      this._el.appendChild(banner);
    }

    // Sprint selector + actions toolbar
    let toolbar = document.createElement('div');
    toolbar.className = 'mts-sb__toolbar';
    this._toolbarEl = toolbar;
    this._el.appendChild(toolbar);

    // Split panel
    let splitWrap = document.createElement('div');
    splitWrap.className = 'mts-sb__split';
    this._splitEl = splitWrap;

    // Panel Backlog (izq)
    if (this._showBacklog) {
      let backlogPanel = document.createElement('div');
      backlogPanel.className = 'mts-sb__backlog-panel';
      this._backlogEl = backlogPanel;
      splitWrap.appendChild(backlogPanel);
    }

    // Panel Sprint (der)
    let sprintPanel = document.createElement('div');
    sprintPanel.className = 'mts-sb__sprint-panel';
    this._sprintPanelEl = sprintPanel;
    splitWrap.appendChild(sprintPanel);

    this._el.appendChild(splitWrap);

    // Inicializar Splitter si hay backlog
    if (this._showBacklog && global.MTS && global.MTS.Splitter) {
      this._splitter = new global.MTS.Splitter(splitWrap, {
        direction:   this._splitterDir,
        initialSize: 35,
        minSize:     20,
        maxSize:     60,
        gutterSize:  '5px',
      });
    }
  };

  /* ── Interno: render completo ─────────────────────────── */

  SprintBoard.prototype._renderAll = function () {
    this._renderToolbar();
    if (this._showBacklog) this._renderBacklog();
    this._renderSprint();
    if (this._showVelocity) this._renderVelocity();
  };

  SprintBoard.prototype._renderToolbar = function () {
    let self    = this;
    let toolbar = this._toolbarEl;
    toolbar.innerHTML = ''; // safe: clearing

    let sprint  = this._currentSprint();
    let sprintLabel = sprint ? (sprint.name || this._t('sprintFallback', 'Sprint')) + (sprint.goal ? ' — ' + sprint.goal : '') : this._t('noSprint', 'Sin sprint activo');

    let info = document.createElement('div');
    info.className = 'mts-sb__sprint-info';
    let nameEl = document.createElement('span');
    nameEl.className   = 'mts-sb__sprint-name';
    nameEl.textContent = sprintLabel;
    info.appendChild(nameEl);
    toolbar.appendChild(info);

    let actions = document.createElement('div');
    actions.className = 'mts-sb__toolbar-actions';

    if (sprint && sprint.status === 'planning') {
      let btnStart = document.createElement('button');
      btnStart.className   = 'mts-btn mts-btn--primary mts-btn--sm';
      btnStart.textContent = this._t('startSprint', 'Iniciar Sprint');
      btnStart.addEventListener('click', function() { self.startSprint(sprint.id); });
      actions.appendChild(btnStart);
    }

    if (sprint && sprint.status === 'active') {
      let btnComplete = document.createElement('button');
      btnComplete.className   = 'mts-btn mts-btn--ghost mts-btn--sm';
      btnComplete.textContent = this._t('closeSprint', 'Cerrar Sprint');
      btnComplete.addEventListener('click', function() { self.completeSprint(sprint.id); });
      actions.appendChild(btnComplete);
    }

    if (this._addStories) {
      let btnAdd = document.createElement('button');
      btnAdd.className   = 'mts-btn mts-btn--ghost mts-btn--sm';
      btnAdd.textContent = this._t('addStoryInline', '+ Historia');
      btnAdd.addEventListener('click', function() { self._showAddStoryForm(); });
      actions.appendChild(btnAdd);
    }

    if (this._addTaskCfg) {
      let cfg = this._addTaskCfg;
      let btnAddTask = document.createElement('button');
      btnAddTask.className   = 'mts-btn mts-btn--primary mts-btn--sm';
      btnAddTask.textContent = cfg.label || this._t('addStoryDefault', '+ Agregar historia');
      btnAddTask.addEventListener('click', function() { if (typeof cfg.open === 'function') cfg.open(); });
      actions.appendChild(btnAddTask);
    }

    toolbar.appendChild(actions);
  };

  SprintBoard.prototype._renderBacklog = function () {
    let self = this;
    let panel = this._backlogEl;
    panel.innerHTML = ''; // safe: clearing

    let header = document.createElement('div');
    header.className = 'mts-sb__panel-header';
    let h = document.createElement('span');
    h.className   = 'mts-sb__panel-title';
    h.textContent = this._t('backlog', 'Backlog');
    let backlog = this.getBacklog();
    let count = document.createElement('span');
    count.className   = 'mts-sb__panel-count';
    count.textContent = backlog.length;
    header.appendChild(h);
    header.appendChild(count);
    panel.appendChild(header);

    if (!backlog.length) {
      let empty = document.createElement('div');
      empty.className   = 'mts-sb__empty';
      empty.textContent = this._t('backlogEmpty', 'Backlog vacío');
      panel.appendChild(empty);
      return;
    }

    let list = document.createElement('div');
    list.className = 'mts-sb__backlog-list';
    backlog.forEach(function(story) {
      list.appendChild(self._buildStoryRow(story, 'backlog'));
    });
    panel.appendChild(list);
  };

  SprintBoard.prototype._renderSprint = function () {
    let self   = this;
    let panel  = this._sprintPanelEl;
    panel.innerHTML = ''; // safe: clearing

    let sprint  = this._currentSprint();
    let stories = this.getCurrentSprintStories();

    let header = document.createElement('div');
    header.className = 'mts-sb__panel-header';
    let h = document.createElement('span');
    h.className   = 'mts-sb__panel-title';
    h.textContent = sprint ? (sprint.name || 'Sprint') : 'Sprint';
    let totalSP = stories.reduce(function(acc, s) { return acc + (s.storyPoints || 0); }, 0);
    let spBadge = document.createElement('span');
    spBadge.className   = 'mts-sb__sp-badge';
    spBadge.textContent = totalSP + ' SP';
    header.appendChild(h);
    header.appendChild(spBadge);
    panel.appendChild(header);

    // Usar MTS.Kanban internamente para el panel Sprint
    if (global.MTS && global.MTS.Kanban) {
      let kanbanEl = document.createElement('div');
      kanbanEl.className = 'mts-sb__kanban-wrap';
      panel.appendChild(kanbanEl);

      let kanbanCols = this._columns.map(function(col) {
        let colStories = stories.filter(function(s) { return s.status === col.id; });
        return {
          id:    col.id,
          title: col.title,
          color: col.color,
          cards: colStories.map(function(s) { return self._storyToCard(s); }),
        };
      });

      if (this._kanban) { try { this._kanban.destroy(); } catch(e) {} }

      this._kanban = new global.MTS.Kanban(kanbanEl, {
        columns:  kanbanCols,
        addCards: false,
        onCardMove: function(e) {
          let story = self._storyById(e.card.id);
          if (!story) return;
          let from = { type: 'sprint', columnId: story.status };
          story.status = e.toColId;
          let to   = { type: 'sprint', columnId: e.toColId };
          self._emit('storyMove', { story: story, from: from, to: to });
          self._renderSprint();
        },
        onCardClick: function(e) {
          let story = self._storyById(e.card.id);
          if (story) {
            let prev = !!self._selected[story.id];
            self._selected = {};
            if (!prev) self._selected[story.id] = true;
            self._emit('select', { stories: self._getSelected() });
          }
        },
      });
    } else {
      // Fallback sin MTS.Kanban: columnas simples
      let cols = document.createElement('div');
      cols.className = 'mts-sb__cols';
      this._columns.forEach(function(col) {
        let colEl = document.createElement('div');
        colEl.className = 'mts-sb__col';
        let colH = document.createElement('div');
        colH.className   = 'mts-sb__col-title';
        colH.textContent = col.title;
        colEl.appendChild(colH);
        let colStories = stories.filter(function(s) { return s.status === col.id; });
        colStories.forEach(function(s) { colEl.appendChild(self._buildStoryRow(s, 'sprint')); });
        cols.appendChild(colEl);
      });
      panel.appendChild(cols);
    }
  };

  SprintBoard.prototype._renderVelocity = function () {
    let sprint  = this._currentSprint();
    let stories = this.getCurrentSprintStories();
    if (!sprint || !this._velocityEl) return;

    let total     = stories.reduce(function(a, s) { return a + (s.storyPoints || 0); }, 0);
    let committed = sprint.committed || sprint.capacity || 0;
    let pct       = committed ? Math.min(100, Math.round(total / committed * 100)) : 0;

    let el = this._velocityEl;
    el.innerHTML = ''; // safe: clearing

    let label = document.createElement('span');
    label.className   = 'mts-sb__velocity-label';
    label.textContent = this._t('capacity', 'Capacidad') + ': ' + total + ' / ' + committed + ' ' + this._t('sp', 'SP') + ' (' + pct + '%)';
    el.appendChild(label);

    let bar = document.createElement('div');
    bar.className = 'mts-sb__capacity-bar';
    let fill = document.createElement('div');
    fill.className           = 'mts-sb__capacity-fill' + (pct > 100 ? ' mts-sb__capacity-fill--over' : '');
    fill.style.width         = Math.min(100, pct) + '%';
    bar.appendChild(fill);
    el.appendChild(bar);
  };

  /* ── Interno: build story row ─────────────────────────── */

  SprintBoard.prototype._buildStoryRow = function (story, location) {
    let self = this;
    let row  = document.createElement('div');
    row.className = 'mts-sb__story' +
      (this._selected[story.id] ? ' mts-sb__story--selected' : '') +
      (story.priority ? ' mts-sb__story--' + story.priority : '');
    row.dataset.storyId = story.id;

    // Tipo icono — usa MTS.Icon si está disponible, fallback a inicial
    let typeEl = document.createElement('span');
    typeEl.className = 'mts-sb__story-type';
    typeEl.title     = story.type || 'userstory';
    typeEl.style.color = TYPE_COLORS[story.type] || TYPE_COLORS.userstory;
    let iconName = TYPE_ICON_NAMES[story.type] || TYPE_ICON_NAMES.userstory;
    if (global.MTS && global.MTS.Icon) {
      MTS.Icon.render(iconName, typeEl); // safe: literal icon SVG from registry
    } else {
      typeEl.textContent = iconName.charAt(0).toUpperCase();
    }
    row.appendChild(typeEl);

    // Código + título
    let body = document.createElement('div');
    body.className = 'mts-sb__story-body';
    if (story.code) {
      let code = document.createElement('span');
      code.className   = 'mts-sb__story-code';
      code.textContent = story.code;
      body.appendChild(code);
    }
    let title = document.createElement('span');
    title.className   = 'mts-sb__story-title';
    title.textContent = story.title || '';
    body.appendChild(title);
    row.appendChild(body);

    // Story points badge
    if (story.storyPoints != null) {
      let sp = document.createElement('span');
      sp.className   = 'mts-sb__sp-badge mts-sb__sp-badge--sm';
      sp.textContent = story.storyPoints;
      row.appendChild(sp);
    }

    // Botón mover (backlog → sprint / sprint → backlog)
    let btnMove = document.createElement('button');
    btnMove.className = 'mts-sb__story-move';
    if (location === 'backlog') {
      btnMove.title       = this._t('moveToSprint', 'Mover al Sprint');
      btnMove.textContent = '→';
      btnMove.addEventListener('click', function() {
        self.moveStory(story.id, { type: 'sprint', columnId: 'todo' });
      });
    } else {
      btnMove.title       = this._t('moveToBacklog', 'Mover al Backlog');
      btnMove.textContent = '←';
      btnMove.addEventListener('click', function() {
        self.moveStory(story.id, { type: 'backlog' });
      });
    }
    row.appendChild(btnMove);

    // Click para selección
    row.addEventListener('click', function(e) {
      if (e.target === btnMove) return;
      let prev = !!self._selected[story.id];
      if (!e.ctrlKey && !e.metaKey) self._selected = {};
      if (prev && (e.ctrlKey || e.metaKey)) {
        delete self._selected[story.id];
      } else {
        self._selected[story.id] = true;
      }
      self._emit('select', { stories: self._getSelected() });
      self._renderBacklog();
    });

    return row;
  };

  SprintBoard.prototype._storyToCard = function (story) {
    return {
      id:          story.id,
      title:       story.title || '',
      description: story.description || undefined,
      priority:    story.priority,
      tags:        story.tags,
      assignee:    story.assignees && story.assignees[0] ? story.assignees[0].name : undefined,
    };
  };

  /* ── Interno: add story form ──────────────────────────── */

  SprintBoard.prototype._showAddStoryForm = function () {
    // Form simple modal-less para agregar historia al backlog
    let self  = this;
    let panel = this._backlogEl || this._sprintPanelEl;

    // Evitar duplicados
    if (panel.querySelector('.mts-sb__add-form')) return;

    let form = document.createElement('div');
    form.className = 'mts-sb__add-form';

    let titleInput = document.createElement('input');
    titleInput.className   = 'mts-sb__add-input';
    titleInput.placeholder = this._t('titlePh', 'Título de la historia *');
    titleInput.type        = 'text';

    let spSelect = document.createElement('select');
    spSelect.className = 'mts-sb__add-field';
    let optNone = document.createElement('option');
    optNone.value       = '';
    optNone.textContent = this._t('sp', 'SP');
    spSelect.appendChild(optNone);
    SP_VALUES.forEach(function(v) {
      let o = document.createElement('option');
      o.value       = String(v);
      o.textContent = String(v);
      spSelect.appendChild(o);
    });

    let actions = document.createElement('div');
    actions.className = 'mts-sb__add-actions';

    let confirmBtn = document.createElement('button');
    confirmBtn.className   = 'mts-btn mts-btn--primary mts-btn--sm';
    confirmBtn.textContent = this._t('add', 'Agregar');

    let cancelBtn = document.createElement('button');
    cancelBtn.className   = 'mts-btn mts-btn--ghost mts-btn--sm';
    cancelBtn.textContent = this._t('cancel', 'Cancelar');

    actions.appendChild(confirmBtn);
    actions.appendChild(cancelBtn);
    form.appendChild(titleInput);
    form.appendChild(spSelect);
    form.appendChild(actions);
    panel.insertBefore(form, panel.firstChild);
    titleInput.focus();

    let cancel = function() { form.remove(); };
    let confirm = function() {
      let title = titleInput.value.trim();
      if (!title) { titleInput.focus(); return; }
      let sp = spSelect.value ? parseInt(spSelect.value) : undefined;
      self.addStory({ id: 's' + Date.now(), title: title, storyPoints: sp, type: 'userstory' }, 'backlog');
      form.remove();
    };

    confirmBtn.addEventListener('click', confirm);
    cancelBtn.addEventListener('click', cancel);
    titleInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') confirm();
      if (e.key === 'Escape') cancel();
    });
  };

  /* ── Interno: helpers ─────────────────────────────────── */

  SprintBoard.prototype._storyById = function (id) {
    for (let i = 0; i < this._stories.length; i++) {
      if (this._stories[i].id === id) return this._stories[i];
    }
    return null;
  };

  SprintBoard.prototype._sprintById = function (id) {
    for (let i = 0; i < this._sprints.length; i++) {
      if (this._sprints[i].id === id) return this._sprints[i];
    }
    return null;
  };

  SprintBoard.prototype._currentSprint = function () {
    if (!this._currentSprintId) return null;
    return this._sprintById(this._currentSprintId);
  };

  SprintBoard.prototype._getSelected = function () {
    let self = this;
    return this._stories.filter(function(s) { return self._selected[s.id]; });
  };

  global.MTS.SprintBoard = SprintBoard;

}(typeof window !== 'undefined' ? window : this));
