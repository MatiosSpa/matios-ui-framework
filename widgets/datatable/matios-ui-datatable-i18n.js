/* ============================================================
   MATIOS UI — matios-ui-datatable-i18n.js  v1.0.0

   Textos del DataTable y sus plugins por locale.
   Cargar DESPUÉS de matios-ui-datatable.js.

   Uso:
     new MTS.DataTable({ locale: 'es', ... })   // default
     new MTS.DataTable({ locale: 'en', ... })

   Locale custom:
     MTS.DataTable.registerLocale('pt', { ... })
     new MTS.DataTable({ locale: 'pt', ... })
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DataTableLocales = {

  /* ── Español ─────────────────────────────────────────── */
  es: {

    /* Core DataTable */
    search:   'Buscar...',
    noData:   'Sin resultados',
    loading:  'Cargando...',
    error:    'Error al cargar datos.',
    retry:    'Reintentar',
    showing:  'Mostrando {start}–{end} de {total}',
    perPage:  'Filas:',
    previous: 'Anterior',
    next:     'Siguiente',

    /* FilterPlugin */
    filter: {
      button:     'Filtrar',
      clearAll:   'Limpiar todo',
      searchHint: 'Buscar {label}...',
      noResults:  'Sin resultados',
      loadError:  'Error al cargar opciones',
      removeChip: 'Quitar filtro {label}',
    },

    /* ColumnVisibilityPlugin */
    colvis: {
      toggle: 'Mostrar / ocultar columnas',
      empty:  'No hay columnas configurables',
    },

    /* DocumentManagerPlugin */
    dm: {
      nav: 'Navegación de carpetas',
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
      ctx: {
        view:     'Ver',
        download: 'Descargar',
        rename:   'Renombrar',
        move:     'Mover',
        delete:   'Eliminar',
        open:     'Abrir',
      },
      workflow: {
        start:           'Iniciar workflow',
        sendForApproval: 'Enviar a aprobación',
        approve:         'Aprobar',
        sign:            'Firmar',
        reject:          'Rechazar',
        restart:         'Reiniciar workflow',
      },
    },

  },

  /* ── English ─────────────────────────────────────────── */
  en: {

    /* Core DataTable */
    search:   'Search...',
    noData:   'No results',
    loading:  'Loading...',
    error:    'Error loading data.',
    retry:    'Retry',
    showing:  'Showing {start}–{end} of {total}',
    perPage:  'Rows:',
    previous: 'Previous',
    next:     'Next',

    /* FilterPlugin */
    filter: {
      button:     'Filter',
      clearAll:   'Clear all',
      searchHint: 'Search {label}...',
      noResults:  'No results',
      loadError:  'Error loading options',
      removeChip: 'Remove filter {label}',
    },

    /* ColumnVisibilityPlugin */
    colvis: {
      toggle: 'Show / hide columns',
      empty:  'No configurable columns',
    },

    /* DocumentManagerPlugin */
    dm: {
      nav: 'Folder navigation',
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
      ctx: {
        view:     'View',
        download: 'Download',
        rename:   'Rename',
        move:     'Move',
        delete:   'Delete',
        open:     'Open',
      },
      workflow: {
        start:           'Start workflow',
        sendForApproval: 'Send for approval',
        approve:         'Approve',
        sign:            'Sign',
        reject:          'Reject',
        restart:         'Restart workflow',
      },
    },

  },

};

/* Registrar locale custom */
MTS.DataTable.registerLocale = function(key, obj) {
  MTS.DataTableLocales[key] = obj;
};

/* Obtener locale — fallback a 'es' */
MTS.DataTable.getLocale = function(key) {
  return MTS.DataTableLocales[key] || MTS.DataTableLocales['es'];
};
