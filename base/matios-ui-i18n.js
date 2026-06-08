/* ============================================================
   MATIOS UI — matios-ui-i18n.js  v1.0.0

   Fuente única de verdad para todos los textos internos de
   los componentes MTS. Cubre SOLO los strings que los
   componentes generan internamente — NO es un sistema de
   i18n de aplicación.

   Carga DESPUÉS de los componentes que quieras traducir.
   Es completamente opcional: sin este archivo todos los
   componentes funcionan en español (sus defaults internos).

   ── API ────────────────────────────────────────────────────

   // Cambiar locale global (afecta todos los componentes)
   MTS.setLocale('en')

   // Obtener el objeto de un locale
   MTS.getLocale('en')               // → { 'MTS.DataTable': {...}, ... }
   MTS.getLocale()                   // → locale activo (default: 'es')

   // Agregar o sobreescribir keys — deep merge, sin pisar el resto
   MTS.registerLocale('es', {
     'MTS.DocumentManagerPreviewPlugin': { download: 'Bajar archivo' }
   })

   // Registrar un locale nuevo completo
   MTS.registerLocale('pt', {
     'MTS.DataTable': { search: 'Pesquisar...', noData: 'Sem resultados', ... },
     'MTS.DocumentManagerPlugin': { ... },
   })

   ── AGRUPACIÓN ─────────────────────────────────────────────
   Cada sección usa el nombre del componente como clave
   (coincide con descriptor.name en los plugins del DataTable).
   Si un componente no tiene sección, usa sus defaults internos.

   ── AÑADIR UN COMPONENTE NUEVO ──────────────────────────────
   1. Agregar la sección en 'es' y 'en' con el nombre del componente.
   2. En el componente, implementar _t(key) usando MTS.getLocale().
   3. Documentar las keys disponibles en el JSDoc del componente.
   ============================================================ */

window.MTS = window.MTS || {};

/* ── Utilidad: deep merge recursivo ───────────────────────── */
MTS._deepMerge = function(target, source) {
  var result = Object.assign({}, target);
  Object.keys(source).forEach(function(key) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = MTS._deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  });
  return result;
};

/* ── Registro de locales ───────────────────────────────────── */
MTS.Locales = {

  /* ── Español ─────────────────────────────────────────────── */
  es: {

    'MTS.DataTable': {
      search:   'Buscar...',
      noData:   'Sin resultados',
      loading:  'Cargando...',
      error:    'Error al cargar datos.',
      retry:    'Reintentar',
      showing:  'Mostrando {start}–{end} de {total}',
      perPage:  'Filas:',
      previous: 'Anterior',
      next:     'Siguiente',
    },

    'MTS.DataTableFilterPlugin': {
      button:     'Filtrar',
      clearAll:   'Limpiar todo',
      searchHint: 'Buscar {label}...',
      noResults:  'Sin resultados',
      loadError:  'Error al cargar opciones',
      removeChip: 'Quitar filtro {label}',
    },

    'MTS.DataTableColumnVisibilityPlugin': {
      toggle: 'Mostrar / ocultar columnas',
      empty:  'No hay columnas configurables',
    },

    'MTS.DocumentManagerPlugin': {
      nav:      'Navegación de carpetas',
      dropzone: 'Suelta los archivos aquí',
      status: {
        active:   'Activo',
        archived: 'Archivado',
        deleted:  'Eliminado',
      },
      workflowStatus: {
        draft:    'Borrador',
        pending:  'Pendiente',
        review:   'En revisión',
        approved: 'Aprobado',
        rejected: 'Rechazado',
        signed:   'Firmado',
      },
    },

    'MTS.DocumentManagerContextMenuPlugin': {
      view:     'Ver',
      download: 'Descargar',
      rename:   'Renombrar',
      move:     'Mover',
      delete:   'Eliminar',
      open:     'Abrir',
    },

    'MTS.DocumentManagerWorkflowPlugin': {
      start:           'Iniciar workflow',
      sendForApproval: 'Enviar a aprobación',
      approve:         'Aprobar',
      sign:            'Firmar',
      reject:          'Rechazar',
      restart:         'Reiniciar workflow',
      participants:    'Participantes',
      noParticipants:  'Sin participantes.',
      statusPending:   'Pendiente',
      statusApproved:  'Aprobado',
      statusRejected:  'Rechazado',
      statusSigned:    'Firmado',
    },

    'MTS.DocumentManagerUploadPlugin': {
      title:              'Subir archivos',
      cancel:             'Cancelar',
      upload:             'Subir',
      retry:              'Reintentar fallidos',
      dropHint:           'Arrastra archivos aquí',
      selectFiles:        'Seleccionar archivos',
      noFiles:            'No hay archivos seleccionados',
      removeFile:         'Eliminar archivo de la lista',
      fileTooLarge:       'Archivo demasiado grande',
      fileTypeNotAllowed: 'Tipo de archivo no permitido',
      maxFiles:           'Máx. {n} archivos',
      maxSize:            'Máx. {n} MB por archivo',
      actionReplace:      'Reemplazar',
      actionVersion:      'Nueva versión',
      actionSkip:         'Omitir',
      statusPending:      'Pendiente',
      statusChecking:     'Verificando...',
      statusExists:       'Ya existe',
      statusReady:        'Listo',
      statusDone:         'Subido',
      statusError:        'Error al subir',
      statusSkipped:      'Omitido',
    },

    'MTS.DocumentManagerPreviewPlugin': {
      download:           'Descargar',
      replace:            'Reemplazar',
      prevDoc:            'Documento anterior',
      nextDoc:            'Documento siguiente',
      panelToggle:        'Mostrar u ocultar panel lateral',
      iframeTitle:        'Vista previa del documento',
      confirmTitle:       'Reemplazar documento',
      confirmVersionLabel: 'Nueva versión:',
      confirmVersionAriaLabel: 'Nueva versión del documento',
      confirmUpload:      'Subir',
      confirmCancel:      'Cancelar',
      confirmUploading:   'Subiendo...',
      confirmSuccess:     'Documento reemplazado.',
      confirmError:       'Error al subir el archivo.',
      confirmRetry:       'Reintentar',
      confirmClose:       'Cerrar',
      confirmExtWarning:  'El archivo seleccionado tiene una extensión diferente al documento actual.',
    },

    'MTS.DocumentManagerPreviewBasicInfoPanel': {
      panelLabel:     'Información básica',
      fieldName:      'Nombre',
      fieldType:      'Tipo',
      fieldSize:      'Tamaño',
      fieldVersion:   'Versión',
      fieldCreatedAt:  'Creado',
      fieldModifiedAt: 'Modificado',
      fieldStatus:    'Estado',
      fieldOwner:     'Propietario',
    },

    'MTS.DocumentManagerPreviewVersionsPanel': {
      panelLabel:  'Versiones',
      noVersions:  'Sin versiones.',
      current:     'Actual',
    },

    'MTS.DocumentManagerPreviewNotesPanel': {
      panelLabel:  'Notas',
      noNotes:     'Sin notas.',
      addTitle:    'Nueva nota',
      placeholder: 'Escribe una nota...',
      send:        'Agregar',
      cancel:      'Cancelar',
      delete:      'Eliminar nota',
      errorSave:   'Error al guardar la nota.',
      errorDelete: 'Error al eliminar la nota.',
    },

    'MTS.DocumentManagerPreviewMetadataPanel': {
      panelLabel:  'Metadatos',
      noFields:    'Sin metadatos configurados.',
      editTitle:   'Editar metadatos',
      edit:        'Editar',
      save:        'Guardar',
      cancel:      'Cancelar',
      errorSave:   'Error al guardar.',
    },

  },

  /* ── English ──────────────────────────────────────────────── */
  en: {

    'MTS.DataTable': {
      search:   'Search...',
      noData:   'No results',
      loading:  'Loading...',
      error:    'Error loading data.',
      retry:    'Retry',
      showing:  'Showing {start}–{end} of {total}',
      perPage:  'Rows:',
      previous: 'Previous',
      next:     'Next',
    },

    'MTS.DataTableFilterPlugin': {
      button:     'Filter',
      clearAll:   'Clear all',
      searchHint: 'Search {label}...',
      noResults:  'No results',
      loadError:  'Error loading options',
      removeChip: 'Remove filter {label}',
    },

    'MTS.DataTableColumnVisibilityPlugin': {
      toggle: 'Show / hide columns',
      empty:  'No configurable columns',
    },

    'MTS.DocumentManagerPlugin': {
      nav:      'Folder navigation',
      dropzone: 'Drop files here',
      status: {
        active:   'Active',
        archived: 'Archived',
        deleted:  'Deleted',
      },
      workflowStatus: {
        draft:    'Draft',
        pending:  'Pending',
        review:   'In review',
        approved: 'Approved',
        rejected: 'Rejected',
        signed:   'Signed',
      },
    },

    'MTS.DocumentManagerContextMenuPlugin': {
      view:     'View',
      download: 'Download',
      rename:   'Rename',
      move:     'Move',
      delete:   'Delete',
      open:     'Open',
    },

    'MTS.DocumentManagerWorkflowPlugin': {
      start:           'Start workflow',
      sendForApproval: 'Send for approval',
      approve:         'Approve',
      sign:            'Sign',
      reject:          'Reject',
      restart:         'Restart workflow',
      participants:    'Participants',
      noParticipants:  'No participants.',
      statusPending:   'Pending',
      statusApproved:  'Approved',
      statusRejected:  'Rejected',
      statusSigned:    'Signed',
    },

    'MTS.DocumentManagerUploadPlugin': {
      title:              'Upload files',
      cancel:             'Cancel',
      upload:             'Upload',
      retry:              'Retry failed',
      dropHint:           'Drag files here',
      selectFiles:        'Select files',
      noFiles:            'No files selected',
      removeFile:         'Remove file from list',
      fileTooLarge:       'File too large',
      fileTypeNotAllowed: 'File type not allowed',
      maxFiles:           'Max. {n} files',
      maxSize:            'Max. {n} MB per file',
      actionReplace:      'Replace',
      actionVersion:      'New version',
      actionSkip:         'Skip',
      statusPending:      'Pending',
      statusChecking:     'Checking...',
      statusExists:       'Already exists',
      statusReady:        'Ready',
      statusDone:         'Uploaded',
      statusError:        'Upload error',
      statusSkipped:      'Skipped',
    },

    'MTS.DocumentManagerPreviewPlugin': {
      download:           'Download',
      replace:            'Replace',
      prevDoc:            'Previous document',
      nextDoc:            'Next document',
      panelToggle:        'Show or hide side panel',
      iframeTitle:        'Document preview',
      confirmTitle:       'Replace document',
      confirmVersionLabel: 'New version:',
      confirmVersionAriaLabel: 'New document version',
      confirmUpload:      'Upload',
      confirmCancel:      'Cancel',
      confirmUploading:   'Uploading...',
      confirmSuccess:     'Document replaced.',
      confirmError:       'Error uploading file.',
      confirmRetry:       'Retry',
      confirmClose:       'Close',
      confirmExtWarning:  'The selected file has a different extension than the current document.',
    },

    'MTS.DocumentManagerPreviewBasicInfoPanel': {
      panelLabel:     'Basic information',
      fieldName:      'Name',
      fieldType:      'Type',
      fieldSize:      'Size',
      fieldVersion:   'Version',
      fieldCreatedAt:  'Created',
      fieldModifiedAt: 'Modified',
      fieldStatus:    'Status',
      fieldOwner:     'Owner',
    },

    'MTS.DocumentManagerPreviewVersionsPanel': {
      panelLabel:  'Versions',
      noVersions:  'No versions.',
      current:     'Current',
    },

    'MTS.DocumentManagerPreviewNotesPanel': {
      panelLabel:  'Notes',
      noNotes:     'No notes.',
      addTitle:    'New note',
      placeholder: 'Write a note...',
      send:        'Add',
      cancel:      'Cancel',
      delete:      'Delete note',
      errorSave:   'Error saving the note.',
      errorDelete: 'Error deleting the note.',
    },

    'MTS.DocumentManagerPreviewMetadataPanel': {
      panelLabel:  'Metadata',
      noFields:    'No metadata configured.',
      editTitle:   'Edit metadata',
      edit:        'Edit',
      save:        'Save',
      cancel:      'Cancel',
      errorSave:   'Error saving.',
    },

  },

  /* ── Português ────────────────────────────────────────────── */
  pt: {

    'MTS.DataTable': {
      search:   'Pesquisar...',
      noData:   'Sem resultados',
      loading:  'Carregando...',
      error:    'Erro ao carregar dados.',
      retry:    'Tentar novamente',
      showing:  'Mostrando {start}–{end} de {total}',
      perPage:  'Linhas:',
      previous: 'Anterior',
      next:     'Próximo',
    },

    'MTS.DataTableFilterPlugin': {
      button:     'Filtrar',
      clearAll:   'Limpar tudo',
      searchHint: 'Pesquisar {label}...',
      noResults:  'Sem resultados',
      loadError:  'Erro ao carregar opções',
      removeChip: 'Remover filtro {label}',
    },

    'MTS.DataTableColumnVisibilityPlugin': {
      toggle: 'Mostrar / ocultar colunas',
      empty:  'Não há colunas configuráveis',
    },

    'MTS.DocumentManagerPlugin': {
      nav:      'Navegação de pastas',
      dropzone: 'Solte os arquivos aqui',
      status: {
        active:   'Ativo',
        archived: 'Arquivado',
        deleted:  'Excluído',
      },
      workflowStatus: {
        draft:    'Rascunho',
        pending:  'Pendente',
        review:   'Em revisão',
        approved: 'Aprovado',
        rejected: 'Rejeitado',
        signed:   'Assinado',
      },
    },

    'MTS.DocumentManagerContextMenuPlugin': {
      view:     'Ver',
      download: 'Baixar',
      rename:   'Renomear',
      move:     'Mover',
      delete:   'Excluir',
      open:     'Abrir',
    },

    'MTS.DocumentManagerWorkflowPlugin': {
      start:           'Iniciar workflow',
      sendForApproval: 'Enviar para aprovação',
      approve:         'Aprovar',
      sign:            'Assinar',
      reject:          'Rejeitar',
      restart:         'Reiniciar workflow',
      participants:    'Participantes',
      noParticipants:  'Sem participantes.',
      statusPending:   'Pendente',
      statusApproved:  'Aprovado',
      statusRejected:  'Rejeitado',
      statusSigned:    'Assinado',
    },

    'MTS.DocumentManagerUploadPlugin': {
      title:              'Enviar arquivos',
      cancel:             'Cancelar',
      upload:             'Enviar',
      retry:              'Tentar novamente os que falharam',
      dropHint:           'Arraste arquivos aqui',
      selectFiles:        'Selecionar arquivos',
      noFiles:            'Nenhum arquivo selecionado',
      removeFile:         'Remover arquivo da lista',
      fileTooLarge:       'Arquivo muito grande',
      fileTypeNotAllowed: 'Tipo de arquivo não permitido',
      maxFiles:           'Máx. {n} arquivos',
      maxSize:            'Máx. {n} MB por arquivo',
      actionReplace:      'Substituir',
      actionVersion:      'Nova versão',
      actionSkip:         'Ignorar',
      statusPending:      'Pendente',
      statusChecking:     'Verificando...',
      statusExists:       'Já existe',
      statusReady:        'Pronto',
      statusDone:         'Enviado',
      statusError:        'Erro ao enviar',
      statusSkipped:      'Ignorado',
    },

    'MTS.DocumentManagerPreviewPlugin': {
      download:           'Baixar',
      replace:            'Substituir',
      prevDoc:            'Documento anterior',
      nextDoc:            'Próximo documento',
      panelToggle:        'Mostrar ou ocultar painel lateral',
      iframeTitle:        'Pré-visualização do documento',
      confirmTitle:       'Substituir documento',
      confirmVersionLabel: 'Nova versão:',
      confirmVersionAriaLabel: 'Nova versão do documento',
      confirmUpload:      'Enviar',
      confirmCancel:      'Cancelar',
      confirmUploading:   'Enviando...',
      confirmSuccess:     'Documento substituído.',
      confirmError:       'Erro ao enviar o arquivo.',
      confirmRetry:       'Tentar novamente',
      confirmClose:       'Fechar',
      confirmExtWarning:  'O arquivo selecionado tem uma extensão diferente do documento atual.',
    },

    'MTS.DocumentManagerPreviewBasicInfoPanel': {
      panelLabel:     'Informações básicas',
      fieldName:      'Nome',
      fieldType:      'Tipo',
      fieldSize:      'Tamanho',
      fieldVersion:   'Versão',
      fieldCreatedAt:  'Criado',
      fieldModifiedAt: 'Modificado',
      fieldStatus:    'Situação',
      fieldOwner:     'Proprietário',
    },

    'MTS.DocumentManagerPreviewVersionsPanel': {
      panelLabel:  'Versões',
      noVersions:  'Sem versões.',
      current:     'Atual',
    },

    'MTS.DocumentManagerPreviewNotesPanel': {
      panelLabel:  'Notas',
      noNotes:     'Sem notas.',
      addTitle:    'Nova nota',
      placeholder: 'Escreva uma nota...',
      send:        'Adicionar',
      cancel:      'Cancelar',
      delete:      'Excluir nota',
      errorSave:   'Erro ao salvar a nota.',
      errorDelete: 'Erro ao excluir a nota.',
    },

    'MTS.DocumentManagerPreviewMetadataPanel': {
      panelLabel:  'Metadados',
      noFields:    'Nenhum metadado configurado.',
      editTitle:   'Editar metadados',
      edit:        'Editar',
      save:        'Salvar',
      cancel:      'Cancelar',
      errorSave:   'Erro ao salvar.',
    },

  },

};

/* ── API global ───────────────────────────────────────────── */

/** Locale activo (default 'es') */
MTS._locale = 'es';

/**
 * Cambia el locale activo para todos los componentes MTS.
 * Los componentes que ya están montados no se actualizan
 * automáticamente — re-montar o recargar la página.
 * @param {string} key — clave de locale registrada en MTS.Locales
 */
MTS.setLocale = function(key) {
  MTS._locale = key;
};

/**
 * Retorna el objeto de locale para la clave dada.
 * Si la clave no existe, cae a 'es'.
 * @param {string} [key] — si se omite usa MTS._locale
 * @returns {object}
 */
MTS.getLocale = function(key) {
  var k = key || MTS._locale || 'es';
  return MTS.Locales[k] || MTS.Locales['es'] || {};
};

/**
 * Registra o extiende un locale con deep merge.
 * Las keys existentes no mencionadas en `overrides` se preservan.
 *
 * @param {string} key      — clave del locale ('es', 'en', 'pt', ...)
 * @param {object} overrides — objeto parcial a mezclar
 *
 * @example
 * // Sobreescribir solo el botón de descarga en español
 * MTS.registerLocale('es', {
 *   'MTS.DocumentManagerPreviewPlugin': { download: 'Bajar archivo' }
 * })
 *
 * @example
 * // Registrar un locale nuevo (parcial — lo no definido usa fallback 'es')
 * MTS.registerLocale('pt', {
 *   'MTS.DataTable': { search: 'Pesquisar...', noData: 'Sem resultados' }
 * })
 */
MTS.registerLocale = function(key, overrides) {
  MTS.Locales[key] = MTS._deepMerge(MTS.Locales[key] || {}, overrides);
};

/* ── Compatibilidad con MTS.DataTable.registerLocale ─────── */
/* Mapea el sistema antiguo al nuevo para no romper código existente */
if (window.MTS && window.MTS.DataTable) {
  MTS.DataTable.registerLocale = function(key, obj) {
    /* El objeto antiguo tenía estructura plana con dm.*, filter, colvis.
       Lo mapeamos a la nueva estructura por nombre de componente. */
    var mapped = {};
    if (obj['MTS.DataTable'] || obj.search !== undefined) {
      /* Ya viene en nuevo formato o es solo strings raíz */
      MTS.registerLocale(key, obj);
      return;
    }
    /* Mapeo legacy → nuevo */
    var dtKeys = ['search','noData','loading','error','retry','showing','perPage','previous','next'];
    var dtSection = {};
    dtKeys.forEach(function(k) { if (obj[k] !== undefined) dtSection[k] = obj[k]; });
    if (Object.keys(dtSection).length) mapped['MTS.DataTable'] = dtSection;
    if (obj.filter)  mapped['MTS.DataTableFilterPlugin']             = obj.filter;
    if (obj.colvis)  mapped['MTS.DataTableColumnVisibilityPlugin']   = obj.colvis;
    if (obj.dm) {
      var dm = obj.dm;
      var dmSection = {};
      if (dm.nav)            dmSection.nav      = dm.nav;
      if (dm.dropzoneLabel)  dmSection.dropzone = dm.dropzoneLabel;
      if (dm.status)         dmSection.status         = dm.status;
      if (dm.workflowStatus) dmSection.workflowStatus = dm.workflowStatus;
      if (Object.keys(dmSection).length) mapped['MTS.DocumentManagerPlugin'] = dmSection;
      if (dm.ctx)      mapped['MTS.DocumentManagerContextMenuPlugin'] = dm.ctx;
      if (dm.workflow) mapped['MTS.DocumentManagerWorkflowPlugin']    = dm.workflow;
      if (dm.upload)   mapped['MTS.DocumentManagerUploadPlugin']      = dm.upload;
      if (dm.preview)  mapped['MTS.DocumentManagerPreviewPlugin']     = dm.preview;
    }
    if (obj.dmUpload) mapped['MTS.DocumentManagerUploadPlugin'] = obj.dmUpload;
    MTS.registerLocale(key, mapped);
  };
  MTS.DataTable.getLocale = function(key) {
    return MTS.getLocale(key);
  };
}
