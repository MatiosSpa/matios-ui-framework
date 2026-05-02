/* ============================================================
   sw-datatable.js — MTS.DataTable Mock API
   Ubicación: datatable/sw-datatable.js
   Scope: ./ (intercepta solo dentro de datatable/)

   Registrar en demo.html:
     navigator.serviceWorker.register('./sw-datatable.js', { scope: './' })
   ============================================================ */

const SW_NAME = 'sw-datatable';
const VERSION = 'datatable-api-v3';

self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
  console.log(`[${SW_NAME}] Activo — interceptando /widgets/datatable/mock-api/*`);
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (!url.pathname.startsWith('/widgets/datatable/mock-api/')) return;
  if (url.pathname.endsWith('.json')) return; // dejar pasar JSONs estáticos
  event.respondWith(handleRequest(event.request, url));
});

/* ── Router ───────────────────────────────────────────────── */
async function handleRequest(request, url) {
  const path   = url.pathname.replace('/widgets/datatable/mock-api/', '').replace(/\/$/, '');
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
  const base = `${self.location.origin}/widgets/datatable/mock-api/data/`;
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
