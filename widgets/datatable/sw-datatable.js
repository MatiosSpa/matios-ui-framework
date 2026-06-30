/* ============================================================
   sw-datatable.js — MTS.DataTable Mock API
   Ubicación: datatable/sw-datatable.js
   Scope: ./ (intercepta solo dentro de datatable/)

   Registrar en demo.html:
     navigator.serviceWorker.register('./sw-datatable.js', { scope: './' })
   ============================================================ */

const SW_NAME = 'sw-datatable';
const VERSION = 'datatable-api-v4';

// Prefijo de la mock-api derivado de la ubicación REAL del SW → location-independent:
// funciona montado en "/", en "/live-demo/" o donde sea, sin hardcodear la ruta.
const API_PREFIX = self.location.pathname.replace(/[^/]*$/, '') + 'mock-api/';

self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (!url.pathname.startsWith(API_PREFIX)) return;
  if (url.pathname.endsWith('.json')) return; // dejar pasar JSONs estáticos
  event.respondWith(handleRequest(event.request, url));
});

/* ── Router ───────────────────────────────────────────────── */
async function handleRequest(request, url) {
  const path   = url.pathname.replace(API_PREFIX, '').replace(/\/$/, '');
  const params = url.searchParams;
  const method = request.method;

  console.log(`[${SW_NAME} ${method}] /${path}`, Object.fromEntries(params));
  await delay(80 + Math.random() * 120); // latencia realista

  try {

    /* ── GET /items ── */
    if (path === 'items' && method === 'GET') {
      const data   = await loadJson('items.json');
      const result = applyQuery(data, params);
      return jsonResponse(result);
    }

    /* ── GET /documents ── */
    if (path === 'documents' && method === 'GET') {
      const data   = await loadJson('documents.json');
      const result = applyDocumentsQuery(data, params);
      return jsonResponse(result);
    }

    /* ── POST /documents/upload ── */
    if (path === 'documents/upload' && method === 'POST') {
      let filename = 'archivo';
      let filesize = 0;
      let folderId = null;
      try {
        const fd = await request.formData();
        const file = fd.get('file');
        if (file) { filename = file.name; filesize = file.size; }
        folderId = fd.get('folderId') || null;
        if (folderId === '' || folderId === 'null') folderId = null;
      } catch { /* si el body no es FormData, ignorar */ }

      await delay(400 + Math.random() * 600); // simula latencia de upload

      return jsonResponse({
        success:  true,
        data: {
          id:             `upload-${Date.now()}`,
          name:           filename,
          type:           'file',
          size:           filesize,
          parentId:       folderId,
          modified:       new Date().toLocaleDateString('es-CL'),
          status:         'active',
          workflowStatus: 'draft',
        },
      });
    }

    /* ── POST /documents/:id/replace ── */
    if (/^documents\/[^/]+\/replace$/.test(path) && method === 'POST') {
      let filename = 'archivo';
      let filesize = 0;
      let version  = null;
      try {
        const fd = await request.formData();
        const file = fd.get('file');
        if (file) { filename = file.name; filesize = file.size; }
        version = fd.get('version') || null;
      } catch { /* ignorar si no es FormData */ }

      await delay(600 + Math.random() * 800); // simula latencia de subida

      return jsonResponse({
        success: true,
        data: {
          name:     filename,
          size:     filesize,
          version:  version ? parseInt(version, 10) : null,
          modified: new Date().toLocaleDateString('es-CL'),
        },
      });
    }

    /* ── GET /documents/:id/participants ── */
    if (/^documents\/[^/]+\/participants$/.test(path) && method === 'GET') {
      await delay(300 + Math.random() * 200);
      return jsonResponse({
        success: true,
        data: [
          { id: 'p1', name: 'Ana',    lastName: 'Martínez', user: 'amartinez', cantReorder: false, status: 'approved' },
          { id: 'p2', name: 'Carlos', lastName: 'Rojas',    user: 'crojas',    cantReorder: false, status: 'pending'  },
          { id: 'p3', name: 'Laura',  lastName: 'Vega',     user: 'lvega',     cantReorder: true,  status: 'pending'  },
        ],
      });
    }

    /* ── GET /documents/:id/metadata ── */
    if (/^documents\/[^/]+\/metadata$/.test(path) && method === 'GET') {
      await delay(250 + Math.random() * 150);
      return jsonResponse({
        success: true,
        data: [
          {
            id:    'docType',
            label: 'Tipo de documento',
            type:  'select',
            value: 'contrato',
            options: [
              { id: 'op1', value: 'contrato',  text: 'Contrato'  },
              { id: 'op2', value: 'factura',   text: 'Factura'   },
              { id: 'op3', value: 'informe',   text: 'Informe'   },
              { id: 'op4', value: 'propuesta', text: 'Propuesta' },
            ],
          },
          {
            id:      'area',
            label:   'Área',
            type:    'input',
            value:   'Legal',
            options: [],
          },
          {
            id:      'importance',
            label:   'Importancia',
            type:    'select',
            value:   'alta',
            options: [
              { id: 'i1', value: 'alta',  text: 'Alta'  },
              { id: 'i2', value: 'media', text: 'Media' },
              { id: 'i3', value: 'baja',  text: 'Baja'  },
            ],
          },
          {
            id:      'dueDate',
            label:   'Vencimiento',
            type:    'date',
            value:   '2025-06-30',
            options: [],
          },
          {
            id:    'status',
            label: 'Estado',
            type:  'select',
            value: 'revision',
            options: [
              { id: 's1', value: 'borrador',  text: 'Borrador'    },
              { id: 's2', value: 'revision',  text: 'En revisión' },
              { id: 's3', value: 'aprobado',  text: 'Aprobado'    },
              { id: 's4', value: 'rechazado', text: 'Rechazado'   },
            ],
          },
          {
            id:      'owner',
            label:   'Responsable',
            type:    'input',
            value:   'Carlos Rojas',
            options: [],
          },
          {
            id:      'costCenter',
            label:   'Centro de costo',
            type:    'input',
            value:   'CC-4421',
            options: [],
          },
          {
            id:      'contractValue',
            label:   'Valor contrato',
            type:    'number',
            value:   '12500000',
            options: [],
          },
          {
            id:    'currency',
            label: 'Moneda',
            type:  'select',
            value: 'clp',
            options: [
              { id: 'c1', value: 'clp', text: 'CLP' },
              { id: 'c2', value: 'usd', text: 'USD' },
              { id: 'c3', value: 'eur', text: 'EUR' },
            ],
          },
          {
            id:      'notes',
            label:   'Observaciones',
            type:    'textarea',
            value:   'Contrato bajo revisión del área legal. Pendiente firma del representante legal antes del vencimiento.',
            options: [],
          },
        ],
      });
    }

    /* ── PUT /documents/:id/metadata ── */
    if (/^documents\/[^/]+\/metadata$/.test(path) && method === 'PUT') {
      await delay(300 + Math.random() * 200);
      return jsonResponse({ success: true });
    }

    /* ── GET /documents/:id/notes ── */
    if (/^documents\/[^/]+\/notes$/.test(path) && method === 'GET') {
      await delay(300 + Math.random() * 200);
      return jsonResponse({
        success: true,
        data: [
          {
            id:       'note-1',
            user:     'amartinez',
            name:     'Ana',
            lastName: 'Martínez',
            text:     'Revisé el contrato. La cláusula 3.2 necesita ajuste antes de enviar a firma.',
            date:     '10/01/2025 09:14',
            isOwn:    false,
          },
          {
            id:       'note-2',
            user:     'crojas',
            name:     'Carlos',
            lastName: 'Rojas',
            text:     'De acuerdo. Voy a coordinar con el área legal para revisar esa sección.',
            date:     '10/01/2025 11:32',
            isOwn:    true,
          },
          {
            id:       'note-3',
            user:     'lvega',
            name:     'Laura',
            lastName: 'Vega',
            text:     'Legal ya revisó. Pueden proceder con la aprobación.',
            date:     '12/01/2025 16:05',
            isOwn:    false,
          },
          {
            id:       'note-4',
            user:     'pmorales',
            name:     'Pedro',
            lastName: 'Morales',
            text:     'Necesitamos también la firma del subgerente de finanzas antes de cerrar el proceso.',
            date:     '13/01/2025 08:50',
            isOwn:    false,
          },
          {
            id:       'note-5',
            user:     'crojas',
            name:     'Carlos',
            lastName: 'Rojas',
            text:     'Confirmo que el subgerente ya firmó. Documentación completa en el repositorio corporativo.',
            date:     '13/01/2025 10:15',
            isOwn:    true,
          },
          {
            id:       'note-6',
            user:     'amartinez',
            name:     'Ana',
            lastName: 'Martínez',
            text:     'Perfecto. Queda pendiente solo el envío formal al cliente para su contrafirma.',
            date:     '14/01/2025 14:22',
            isOwn:    false,
          },
          {
            id:       'note-7',
            user:     'gsoto',
            name:     'Gloria',
            lastName: 'Soto',
            text:     'El cliente confirma recepción. Esperamos contrafirma en un plazo de 5 días hábiles.',
            date:     '15/01/2025 09:03',
            isOwn:    false,
          },
        ],
      });
    }

    /* ── POST /documents/:id/notes ── */
    if (/^documents\/[^/]+\/notes$/.test(path) && method === 'POST') {
      let text     = '';
      let document = null;
      try {
        const body = await request.json();
        text     = body.text     || '';
        document = body.document || null;
      } catch { /* ignorar */ }

      console.log(`[${SW_NAME}] Nueva nota en "${document?.name || document?.id}":`, text);

      await delay(300 + Math.random() * 200);
      return jsonResponse({
        success: true,
        data: {
          id:           `note-${Date.now()}`,
          user:         'crojas',
          name:         'Carlos',
          lastName:     'Rojas',
          text:         text,
          date:         new Date().toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' }),
          isOwn:    true,
          document: document,
        },
      });
    }

    /* ── GET /documents/:id/versions ── */
    if (/^documents\/[^/]+\/versions$/.test(path) && method === 'GET') {
      await delay(300 + Math.random() * 200);
      return jsonResponse({
        success: true,
        data: [
          {
            id:        'ver-3',
            version:   3,
            name:      'Acuerdo_NDA_Proveedor_Y_v3.docx',
            parentId:  null,
            size:      204800,
            modified:  '15/04/2025',
            author:    'Ana Martínez',
            url:       'https://www.w3.org/WAI/WCAG21/wcag21.pdf',
            isCurrent: true,
          },
          {
            id:        'ver-2',
            version:   2,
            name:      'Acuerdo_NDA_Proveedor_Y_v2.docx',
            parentId:  null,
            size:      198400,
            modified:  '02/03/2025',
            author:    'Carlos Rojas',
            url:       'https://www.w3.org/WAI/WCAG21/wcag21.pdf',
            isCurrent: false,
          },
          {
            id:        'ver-1',
            version:   1,
            name:      'Acuerdo_NDA_Proveedor_Y_v1.docx',
            parentId:  null,
            size:      185600,
            modified:  '10/01/2025',
            author:    'Ana Martínez',
            url:       'https://www.w3.org/WAI/WCAG21/wcag21.pdf',
            isCurrent: false,
          },
        ],
      });
    }

    /* ── POST /documents/:id/participants/reorder ── */
    if (/^documents\/[^/]+\/participants\/reorder$/.test(path) && method === 'POST') {
      await delay(200);
      return jsonResponse({ success: true });
    }

    /* ── GET /departments ── */
    if (path === 'departments' && method === 'GET') {
      const data   = await loadJson('departments.json');
      const result = applyLookupQuery(data, params);
      return jsonResponse(result);
    }

    /* ── GET /roles ── */
    if (path === 'roles' && method === 'GET') {
      const data   = await loadJson('roles.json');
      const result = applyLookupQuery(data, params);
      return jsonResponse(result);
    }

    return errorResponse(404, `Endpoint no encontrado: ${path}`);

  } catch (err) {
    console.error(`[${SW_NAME}] Error en ${path}:`, err);
    return errorResponse(500, err.message);
  }
}

/* ── Params reservados del query engine ───────────────────── */
const RESERVED_PARAMS = new Set(['search', 'orderBy', 'orderDir', 'pageSize', 'pageNumber']);

/* ── Query engine: field filters + search + sort + paginate ── */
function applyQuery(data, params) {
  let result = [...data];

  // Field filters — cualquier param no reservado filtra por campo exacto
  for (const [key, val] of params.entries()) {
    if (RESERVED_PARAMS.has(key) || val === '' || val === null) continue;
    result = result.filter(item => String(item[key] ?? '') === val);
  }

  // Search — sobre todos los campos string
  const q = (params.get('search') || '').trim().toLowerCase();
  if (q) {
    result = result.filter(item =>
      Object.values(item).some(v =>
        v !== null && v !== undefined && String(v).toLowerCase().includes(q)
      )
    );
  }

  // Sort
  const orderBy  = params.get('orderBy');
  const orderDir = (params.get('orderDir') || 'asc').toLowerCase();
  if (orderBy) {
    result.sort((a, b) => {
      const va = a[orderBy] ?? '';
      const vb = b[orderBy] ?? '';
      const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: 'base' });
      return orderDir === 'desc' ? -cmp : cmp;
    });
  }

  // Paginate
  const pageSize   = Math.max(1, parseInt(params.get('pageSize')   || '10', 10));
  const pageNumber = Math.max(1, parseInt(params.get('pageNumber') || '1',  10));
  const total      = result.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start      = (pageNumber - 1) * pageSize;

  return {
    data:       result.slice(start, start + pageSize),
    total,
    totalPages,
    pageNumber,
    pageSize,
  };
}

/* ── Query engine para lookups: search + limit ────────────── */
function applyLookupQuery(data, params) {
  let result = [...data];

  // Búsqueda por nombre
  const q = (params.get('search') || '').trim().toLowerCase();
  if (q) {
    result = result.filter(item =>
      String(item.name ?? '').toLowerCase().includes(q)
    );
  }

  // Orden alfabético siempre
  result.sort((a, b) => String(a.name).localeCompare(String(b.name), undefined, { sensitivity: 'base' }));

  // Limit (sin paginación — es un lookup)
  const limit = parseInt(params.get('limit') || '0', 10);
  const total = result.length;
  if (limit > 0) result = result.slice(0, limit);

  return { data: result, total };
}

/* ── Query engine especializado para documentos ───────────── */
function applyDocumentsQuery(data, params) {
  let result = [...data];

  // Filtro por carpeta (parentId)
  const parentIdParam = params.get('parentId');
  if (parentIdParam !== null) {
    const pid = parentIdParam === 'null' ? null : parentIdParam;
    result = result.filter(item => item.parentId === pid);
  }

  // Search — solo sobre campos string
  const q = (params.get('search') || '').trim().toLowerCase();
  if (q) {
    result = result.filter(item =>
      Object.values(item).some(v =>
        v !== null && v !== undefined && String(v).toLowerCase().includes(q)
      )
    );
  }

  // Sort — carpetas siempre primero, luego sort del usuario dentro de cada grupo
  const orderBy  = params.get('orderBy');
  const orderDir = (params.get('orderDir') || 'asc').toLowerCase();
  result.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    if (!orderBy) return 0;
    const va = a[orderBy] ?? '';
    const vb = b[orderBy] ?? '';
    const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: 'base' });
    return orderDir === 'desc' ? -cmp : cmp;
  });

  // Paginate
  const pageSize   = Math.max(1, parseInt(params.get('pageSize')   || '10', 10));
  const pageNumber = Math.max(1, parseInt(params.get('pageNumber') || '1',  10));
  const total      = result.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start      = (pageNumber - 1) * pageSize;

  return { data: result.slice(start, start + pageSize), total, totalPages, pageNumber, pageSize };
}

/* ── Helpers ──────────────────────────────────────────────── */
async function loadJson(filename) {
  const base = `${self.location.origin}${API_PREFIX}data/`;
  const res  = await fetch(`${base}${filename}`);
  if (!res.ok) throw new Error(`No encontrado: ${filename}`);
  return res.json();
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type':                'application/json; charset=utf-8',
      'X-Mock-Api':                  `${SW_NAME}/${VERSION}`,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control':               'no-cache',
    },
  });
}

function errorResponse(status, message) {
  return new Response(JSON.stringify({ error: message, status }), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
