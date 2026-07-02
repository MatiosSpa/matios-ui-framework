/* ============================================================
   sw-calendar.js — Matios UI Calendar v2 Mock API
   Ubicación: widgets/calendar/sw-calendar.js
   Scope: ./ (relativo — solo intercepta dentro de widgets/calendar/)

   Registrar en demo.html:
     navigator.serviceWorker.register('./sw-calendar.js',
       { scope: './' })
   ============================================================ */

const SW_NAME = 'sw-calendar';
const VERSION = 'calendar-api-v9';
// Prefijo de la mock-api derivado del scope REAL del SW → location-independent
// (funciona en "/", "/live-demo/" o donde sea, sin hardcodear la ruta).
const API_PREFIX = new URL('./mock-api/', self.registration.scope).pathname;

self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  /* Solo interceptar rutas de la mock API — dejar pasar todo lo demás */
  if (!url.pathname.startsWith(API_PREFIX)) return;
  if (url.pathname.endsWith('.json')) return; /* dejar pasar los JSONs estáticos */
  event.respondWith(handleRequest(event.request, url));
});

/* ── Router ─────────────────────────────────────────────────── */
async function handleRequest(request, url) {
  const path   = url.pathname.replace(API_PREFIX, '').replace(/\/$/, '');
  const params = url.searchParams;
  const method = request.method;

  console.log(`[${SW_NAME} ${method}] /${path}`, Object.fromEntries(params));
  await delay(120 + Math.random() * 130);

  try {
    /* ── Catálogos estáticos ── */
    /* cal_events — nueva estructura { uid, startDate, startHour, endHour, data } */
    if (path === 'cal_events' && method === 'GET') {
      const dateStart = params.get('dateStart');
      const dateEnd   = params.get('dateEnd');
      const data      = await loadJson('cal_events.json');
      const result    = (dateStart && dateEnd)
        ? data.filter(e => e.startDate >= dateStart && e.startDate <= dateEnd)
        : data;
      return jsonResponse(result);
    }

    if (path === 'attendees' && method === 'GET') {
      const q    = params.get('q') || '';
      const data = await loadJson('attendees.json');
      const result = q
        ? data.filter(p =>
            p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.uid.toLowerCase().includes(q.toLowerCase())
          )
        : data;
      return jsonResponse(result);
    }
    if (path === 'meet_places' && method === 'GET') {
      const q    = params.get('q') || '';
      const data = await loadJson('meet_places.json');
      const result = q
        ? data.filter(p => p.place.toLowerCase().includes(q.toLowerCase()))
        : data;
      return jsonResponse(result);
    }
    if (path === 'campus'    && method === 'GET') return await serveJson('campus.json');
    if (path === 'jornadas'  && method === 'GET') return await serveJson('jornadas.json');
    if (path === 'modulos'   && method === 'GET') return await serveJson('modulos.json');
    if (path === 'usuarios'  && method === 'GET') return await serveJson('usuarios.json');
    if (path === 'planes'    && method === 'GET') return await serveJson('planes.json');

    /* ── Profesores — filtrados por campusCode ── */
    if (path === 'profesores' && method === 'GET') {
      const campusCode = params.get('campusCode');
      const data = await loadJson('profesores.json');
      const result = campusCode
        ? data.filter(t => t.campus?.some(c => String(c.campusCode) === String(campusCode)))
        : data;
      return jsonResponse(result);
    }

    /* ── Asignaturas — filtradas por campusCode ── */
    if (path === 'asignaturas' && method === 'GET') {
      const campusCode = params.get('campusCode');
      const data = await loadJson('asignaturas.json');
      if (campusCode) {
        const campus = data.find(c => String(c.campusCode) === String(campusCode));
        return jsonResponse(campus ? campus.courses : []);
      }
      const all = [...new Map(
        data.flatMap(c => c.courses).map(c => [c.courseCode, c])
      ).values()];
      return jsonResponse(all);
    }

    /* ── Salas — filtradas por campusCode ── */
    if (path === 'salas' && method === 'GET') {
      const campusCode = params.get('campusCode');
      const data = await loadJson('salas.json');
      const result = campusCode
        ? data.filter(s => String(s.campusCode) === String(campusCode))
        : data;
      return jsonResponse(result);
    }

    /* ── Eventos genéricos — generados dinámicamente por rango de fechas ── */
    if (path === 'events' && method === 'GET') {
      const dateStart = params.get('dateStart');
      const dateEnd   = params.get('dateEnd');
      const lang      = params.get('lang') || 'es';
      const eventos   = generateEvents(dateStart, dateEnd, lang);
      return jsonResponse(eventos, 200, {
        'X-Date-Start':     dateStart || 'all',
        'X-Date-End':       dateEnd   || 'all',
        'X-Total-Events':   String(eventos.length),
      });
    }

    /* ── CRUD cal_events — nueva estructura { uid, startDate, startHour... } ── */
    if (path === 'cal_events' && method === 'POST') {
      const body = await request.json().catch(() => ({}));
      /* Generar uid real si no viene */
      const uid = body.uid || crypto.randomUUID();
      console.log(`[${SW_NAME}] POST /cal_events → uid: ${uid}`, body);
      return jsonResponse({ ok:true, uid, message:'Evento creado' }, 201);
    }
    if (path.match(/^cal_events\/[^/]+$/) && method === 'PUT') {
      const body = await request.json().catch(() => ({}));
      const uid  = path.split('/')[1];
      return jsonResponse({ ok:true, uid, message:'Evento actualizado', ...body });
    }
    if (path.match(/^cal_events\/[^/]+$/) && method === 'DELETE') {
      const uid = path.split('/')[1];
      return jsonResponse({ ok:true, uid, message:'Evento eliminado' });
    }

    /* ── CRUD Eventos (POST / PUT / PATCH / DELETE) ── */
    if (path === 'events' && method === 'POST') {
      const body = await request.json().catch(() => ({}));
      console.log(`[${SW_NAME}] POST /events → simulado`, body);
      return jsonResponse({ ok: true, id: body.id ?? -(Date.now()), message: 'Evento creado' });
    }
    if (path.match(/^events\/[-\d]+$/) && method === 'PUT') {
      const body = await request.json().catch(() => ({}));
      return jsonResponse({ ok: true, message: 'Evento actualizado', ...body });
    }
    if (path.match(/^events\/[-\d]+$/) && method === 'PATCH') {
      const body = await request.json().catch(() => ({}));
      return jsonResponse({ ok: true, message: 'Evento parcheado', ...body });
    }
    if (path.match(/^events\/[-\d]+$/) && method === 'DELETE') {
      return jsonResponse({ ok: true, message: 'Evento eliminado' });
    }

    return errorResponse(404, `Endpoint no encontrado: ${path}`);

  } catch (err) {
    console.error(`[${SW_NAME}] Error en ${path}:`, err);
    return errorResponse(500, err.message);
  }
}

/* ── Generador de eventos por rango ────────────────────────── */
const TIPOS = [
  { tipo:'Reunión',    color:'#3b82f6', sala:'Sala A' },
  { tipo:'Cliente',    color:'#8b5cf6', sala:'Sala B' },
  { tipo:'Demo',       color:'#0ea5e9', sala:'Sala C' },
  { tipo:'Formación',  color:'#f59e0b', sala:'Lab'    },
  { tipo:'Review',     color:'#14b8a6', sala:'Sala B' },
  { tipo:'Planning',   color:'#6366f1', sala:'Sala A' },
  { tipo:'Workshop',   color:'#d946ef', sala:'Sala D' },
  { tipo:'Entrevista', color:'#f97316', sala:'Sala E' },
  { tipo:'Sync',       color:'#10b981', sala:'Online' },
];
const NOMBRES_ES = [
  'Reunión de equipo','Stand-up diario','Sprint planning','Code review','Demo producto',
  'Capacitación AWS','Almuerzo cliente','Retrospectiva','One on one','Tech talk',
  'Kick-off proyecto','Design review','QA testing','Deploy planning','Stakeholder meeting',
  'Budget review','Arquitectura','UX review','Data review','Security audit',
  'Team sync','Product roadmap','Release planning','Customer success','Onboarding',
];
const NOMBRES_EN = [
  'Team meeting','Daily stand-up','Sprint planning','Code review','Product demo',
  'AWS training','Client lunch','Retrospective','One on one','Tech talk',
  'Project kick-off','Design review','QA testing','Deploy planning','Stakeholder meeting',
  'Budget review','Architecture review','UX review','Data review','Security audit',
  'Team sync','Product roadmap','Release planning','Customer success','Onboarding',
];
const PERSONAS = [
  'Ana López','Carlos Ruiz','María Torres','Pedro Silva','Laura Gómez',
  'Diego Vargas','Carmen Soto','Rodrigo Pérez','Isabel Muñoz','Andrés Castro',
];
const HITOS_ES = ['Release','Entrega','Celebración','Feriado','Cierre mes','Congelamiento'];
const HITOS_EN = ['Release','Delivery','Celebration','Holiday','Month close','Freeze'];
const HITO_COLORS = ['#10b981','#f59e0b','#d946ef','#f43f5e','#0ea5e9','#8b5cf6'];

function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}
function pick(arr, rand) { return arr[Math.floor(rand() * arr.length)]; }
function toISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function addDays(base, n) { const d = new Date(base); d.setDate(d.getDate() + n); return d; }

function generateEvents(dateStart, dateEnd, lang = 'es') {
  if (!dateStart || !dateEnd) return [];
  const start   = new Date(dateStart + 'T00:00:00');
  const end     = new Date(dateEnd   + 'T23:59:59');
  const nombres = lang === 'en' ? NOMBRES_EN : NOMBRES_ES;
  const hitos   = lang === 'en' ? HITOS_EN   : HITOS_ES;
  const eventos = [];
  let id = 1;

  const mon = new Date(start);
  const dow = mon.getDay();
  mon.setDate(mon.getDate() - (dow === 0 ? 6 : dow - 1));

  for (let semana = -4; semana <= 8; semana++) {
    const lunSemana = addDays(mon, semana * 7);
    const weekSeed  = lunSemana.getFullYear() * 10000 +
                      (lunSemana.getMonth() + 1) * 100 +
                      lunSemana.getDate() + (lang === 'en' ? 9999 : 0);
    const rand = seededRand(weekSeed);
    const nEv  = 8 + Math.floor(rand() * 7);

    for (let e = 0; e < nEv; e++) {
      const dayOffset = Math.floor(rand() * 5);
      const fecha     = addDays(lunSemana, dayOffset);
      if (fecha < start || fecha > end) { for(let i=0;i<6;i++) rand(); continue; }

      const dayJS  = fecha.getDay();
      const tipo   = pick(TIPOS,    rand);
      const nombre = pick(nombres,  rand);
      const persona= pick(PERSONAS, rand);
      const startH = 8 + Math.floor(rand() * 9);
      const durMin = [30,45,60,90,120][Math.floor(rand() * 5)];
      const endMin = startH * 60 + durMin;
      const endH   = Math.min(Math.floor(endMin / 60), 19);
      const endM   = endH >= 19 ? 0 : endMin % 60;
      const isoDate = toISO(fecha);
      const attend  = 2 + Math.floor(rand() * 15);

      /* La API devuelve la estructura del calendario directamente
         — el dev no necesita datasourceParser */
      eventos.push({
        id:          id++,
        title:       nombre,
        description: `${persona} · ${tipo.sala} · ${durMin}min`,
        dayNumber:   dayJS,
        date:        isoDate,
        startH,      startM: 0,
        endH:        Math.min(endH, 19),
        endM:        endH >= 19 ? 0 : endM,
        color:       tipo.color,
        allDay:      false,
        data: {
          tipo:        tipo.tipo,
          responsable: persona,
          sala:        tipo.sala,
          duracionMin: durMin,
          asistentes:  attend,
        },
      });
    }

    /* All-day ocasional — sin hora, con allDay:true */
    if (rand() > 0.6) {
      const idx       = Math.floor(rand() * hitos.length);
      const dayOffset = Math.floor(rand() * 5);
      const fecha     = addDays(lunSemana, dayOffset);
      if (fecha >= start && fecha <= end) {
        eventos.push({
          id:       id++,
          title:    hitos[idx],
          dayNumber: fecha.getDay(),
          date:     toISO(fecha),
          allDay:   true,
          color:    HITO_COLORS[idx],
          data:     { tipo: lang === 'en' ? 'Milestone' : 'Hito' },
        });
      }
    }
  }

  console.log(`[${SW_NAME}] ${lang} | ${dateStart}→${dateEnd} | ${eventos.length} eventos`);
  return eventos;
}

/* ── Helpers ─────────────────────────────────────────────────── */
async function loadJson(filename) {
  const base = `${self.location.origin}${API_PREFIX}data/`;
  const res  = await fetch(`${base}${filename}`);
  if (!res.ok) throw new Error(`No encontrado: ${filename}`);
  return res.json();
}

async function serveJson(filename) {
  const data = await loadJson(filename);
  console.log(`[${SW_NAME}] ${filename} → ${Array.isArray(data) ? data.length + ' registros' : 'objeto'}`);
  return jsonResponse(data);
}

function jsonResponse(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type':                'application/json; charset=utf-8',
      'X-Mock-Api':                  `${SW_NAME}/${VERSION}`,
      'X-Response-Time':             `${Math.floor(120 + Math.random() * 130)}ms`,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control':               'no-cache',
      ...extra,
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
