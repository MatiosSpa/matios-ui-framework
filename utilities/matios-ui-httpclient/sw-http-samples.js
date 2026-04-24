/* ============================================================
   sw-http-samples.js
   Service Worker — Mock API para MTS.HttpClient demo.
   Intercepta requests a /http-samples/api/* y retorna
   respuestas simuladas sin necesitar un backend real.
   ============================================================ */

const SW_NAME    = 'sw-http-samples';
const SW_VERSION = '1.0.0';

/* ── Helpers ─────────────────────────────────────────────── */
const json = (data, status = 200, delay = 0) =>
  new Promise(resolve =>
    setTimeout(() =>
      resolve(new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
      })),
    delay)
  );

const jsonError = (message, status, delay = 0) =>
  json({ Message: message, status }, status, delay);

/* ── Datos mock ──────────────────────────────────────────── */
const USERS = [
  { id: 1, name: 'Ana López',    email: 'ana@empresa.com',   role: 'Admin'    },
  { id: 2, name: 'Diego Vargas', email: 'diego@empresa.com', role: 'Editor'   },
  { id: 3, name: 'Felipe Reyes', email: 'felipe@empresa.com',role: 'Viewer'   },
  { id: 4, name: 'Sofía Torres', email: 'sofia@empresa.com', role: 'Editor'   },
  { id: 5, name: 'Carlos Mora',  email: 'carlos@empresa.com',role: 'Viewer'   },
];

const POSTS = [
  { id: 1, userId: 1, title: 'Introducción a MTS UI',   body: 'Componentes de clase mundial...' },
  { id: 2, userId: 2, title: 'HttpClient en 5 minutos', body: 'Siempre resuelve, nunca rechaza...' },
  { id: 3, userId: 1, title: 'DevPanel tips',           body: 'Cómo sacarle el máximo provecho...' },
];

let _postIdSeq = POSTS.length + 1;

/* ── Router ──────────────────────────────────────────────── */
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (!url.pathname.startsWith('/utilities/matios-ui-httpclient/api/')) return;

  const path   = url.pathname.replace('/utilities/matios-ui-httpclient/api/', '').replace(/\/$/, '');
  const method = event.request.method;

  console.log(`[${SW_NAME}] ${method} /${path}`);

  event.respondWith(handleRequest(path, method, event.request, url.searchParams));
});

async function handleRequest(path, method, request, params) {

  /* ── GET /users ─────────────────────────────────────────── */
  if (path === 'users' && method === 'GET') {
    const page  = parseInt(params.get('page')  || '1');
    const limit = parseInt(params.get('limit') || '10');
    const start = (page - 1) * limit;
    const items = USERS.slice(start, start + limit);
    return json({ data: items, total: USERS.length, page, limit });
  }

  /* ── GET /users/:id ─────────────────────────────────────── */
  const userMatch = path.match(/^users\/(\d+)$/);
  if (userMatch && method === 'GET') {
    const user = USERS.find(u => u.id === parseInt(userMatch[1]));
    if (!user) return jsonError('Usuario no encontrado', 404);
    return json(user);
  }

  /* ── GET /posts ─────────────────────────────────────────── */
  if (path === 'posts' && method === 'GET') {
    return json(POSTS);
  }

  /* ── POST /posts ─────────────────────────────────────────── */
  if (path === 'posts' && method === 'POST') {
    let body = {};
    try { body = await request.json(); } catch {}
    if (!body.title) return jsonError('El campo title es obligatorio', 400);
    const newPost = { id: _postIdSeq++, userId: body.userId || 1, title: body.title, body: body.body || '' };
    POSTS.push(newPost);
    return json(newPost, 201);
  }

  /* ── PUT /posts/:id ─────────────────────────────────────── */
  const postMatch = path.match(/^posts\/(\d+)$/);
  if (postMatch && method === 'PUT') {
    const idx = POSTS.findIndex(p => p.id === parseInt(postMatch[1]));
    if (idx === -1) return jsonError('Post no encontrado', 404);
    let body = {};
    try { body = await request.json(); } catch {}
    POSTS[idx] = { ...POSTS[idx], ...body };
    return json(POSTS[idx]);
  }

  /* ── DELETE /posts/:id ──────────────────────────────────── */
  if (postMatch && method === 'DELETE') {
    const idx = POSTS.findIndex(p => p.id === parseInt(postMatch[1]));
    if (idx === -1) return jsonError('Post no encontrado', 404);
    POSTS.splice(idx, 1);
    return new Response(null, { status: 204 });
  }

  /* ── GET /error — simula 404 ────────────────────────────── */
  if (path === 'error' && method === 'GET') {
    return jsonError('El recurso solicitado no existe', 404);
  }

  /* ── GET /server-error — simula 500 para demo de retry ──── */
  if (path === 'server-error' && method === 'GET') {
    return jsonError('Error interno del servidor', 500);
  }

  /* ── GET /slow — delay 3s para demo de timeout ──────────── */
  if (path === 'slow' && method === 'GET') {
    return json({ message: 'Respuesta lenta', delayed: true }, 200, 3000);
  }

  /* ── POST /upload — intenta grabar en Cache API ────────────── */
  if (path === 'upload' && method === 'POST') {
    let filename = 'archivo';
    let size     = 0;
    let ext      = '';
    let saved    = false;
    let saveError = null;
    try {
      const formData = await request.formData();
      /* Log todos los campos recibidos para diagnóstico */
      for (const [key, val] of formData.entries()) {
        console.log(`[sw-http-samples] formData field → key:'${key}' type:${val?.constructor?.name} size:${val?.size ?? 'N/A'} name:${val?.name ?? 'N/A'}`);
      }
      const file = formData.get('archivo') || formData.get('file') || [...formData.values()].find(v => v instanceof File);
      if (file) {
        filename = file.name;
        size     = file.size;
        ext      = filename.split('.').pop().toLowerCase();
        console.log(`[sw-http-samples] upload recibido → ${filename} (${size} bytes, .${ext})`);
        /* Intentar grabar en Cache API */
        try {
          const arrayBuffer = await file.arrayBuffer();
          const cache       = await caches.open('upload_samples');
          const fakePath    = `/utilities/matios-ui-httpclient/upload_samples/${Date.now()}_${filename}`;
          await cache.put(fakePath, new Response(arrayBuffer, {
            headers: { 'Content-Type': file.type || 'application/octet-stream' },
          }));
          saved = true;
          console.log(`[sw-http-samples] ✅ archivo guardado en Cache API → ${fakePath}`);
        } catch(e) {
          saveError = e.message;
          console.warn(`[sw-http-samples] ⚠ no se pudo guardar en Cache API: ${e.message}`);
        }
      }
    } catch(e) {
      saveError = e.message;
      console.error(`[sw-http-samples] ❌ error leyendo formData: ${e.message}`);
    }
    const finalName = `${Date.now()}_${filename}`;
    return json({
      success:   true,
      filename,
      size,
      ext,
      saved,
      saveError: saveError || null,
      url:       `/utilities/matios-ui-httpclient/upload_samples/${finalName}`,
    }, 200);
  }

  /* ── GET /download — retorna JSON descargable ───────────── */
  if (path === 'download' && method === 'GET') {
    const content = JSON.stringify({ exported: true, users: USERS, timestamp: new Date().toISOString() }, null, 2);
    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type':        'application/json',
        'Content-Disposition': 'attachment; filename="export.json"',
      },
    });
  }

  /* ── GET /profile — retorna usuario autenticado mock ────── */
  if (path === 'profile' && method === 'GET') {
    return json(USERS[0]);
  }

  /* ── 404 — ruta no encontrada ───────────────────────────── */
  return jsonError(`Ruta no encontrada: /${path}`, 404);
}

self.addEventListener('install',  () => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
