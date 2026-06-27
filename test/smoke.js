/* ============================================================
   MATIOS UI — smoke test (Node puro, sin dependencias)

   Evalúa cada JS de componente en un stub mínimo de navegador y
   verifica que carga SIN lanzar excepción y que el namespace
   global MTS se puebla.

   Captura: errores de sintaxis, TDZ (p.ej. `let MTS = MTS || {}`),
   referencias rotas y cualquier throw en el top-level del script.

   Uso:  node test/smoke.js
   Sale con código 1 si algo falla (apto para CI).
   ============================================================ */

'use strict';

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

const ROOT = path.resolve(__dirname, '..');

/* ---- Stub mínimo de navegador (suficiente para top-level de los componentes) ---- */
function makeStubWindow() {
  const noop = function () {};
  function makeEl() {
    const node = {
      style: { setProperty: noop, removeProperty: noop, cssText: '' },
      dataset: {},
      classList: { add: noop, remove: noop, toggle: noop, contains: function () { return false; } },
      attributes: [], children: [], childNodes: [], firstChild: null, parentNode: null, parentElement: null,
      setAttribute: noop, getAttribute: function () { return null; }, removeAttribute: noop, hasAttribute: function () { return false; },
      appendChild: function (c) { return c; }, removeChild: noop, replaceChildren: noop, replaceWith: noop,
      append: noop, prepend: noop, insertBefore: function (c) { return c; }, insertAdjacentHTML: noop, insertAdjacentElement: noop,
      addEventListener: noop, removeEventListener: noop, dispatchEvent: function () { return true; },
      querySelector: function () { return null; }, querySelectorAll: function () { return []; },
      closest: function () { return null; }, matches: function () { return false; }, contains: function () { return false; },
      cloneNode: function () { return makeEl(); }, focus: noop, blur: noop, click: noop, remove: noop, scrollIntoView: noop,
      getBoundingClientRect: function () { return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }; },
      _html: '', _text: '',
    };
    Object.defineProperty(node, 'innerHTML', { get: function () { return node._html; }, set: function (v) { node._html = String(v); } });
    Object.defineProperty(node, 'textContent', { get: function () { return node._text; }, set: function (v) { node._text = String(v); } });
    return node;
  }

  const documentStub = {
    createElement: makeEl, createElementNS: makeEl, createTextNode: function () { return makeEl(); },
    createDocumentFragment: makeEl, createComment: function () { return makeEl(); },
    querySelector: function () { return null; }, querySelectorAll: function () { return []; },
    getElementById: function () { return null; }, getElementsByClassName: function () { return []; }, getElementsByTagName: function () { return []; },
    addEventListener: noop, removeEventListener: noop,
    body: makeEl(), head: makeEl(), documentElement: makeEl(),
    readyState: 'complete', cookie: '',
  };

  const win = {
    document: documentStub,
    navigator: { userAgent: 'node-smoke', language: 'en', languages: ['en'], clipboard: { writeText: function () { return Promise.resolve(); } } },
    location: { href: 'http://localhost/', search: '', hash: '', pathname: '/', origin: 'http://localhost' },
    history: { pushState: noop, replaceState: noop },
    addEventListener: noop, removeEventListener: noop, dispatchEvent: function () { return true; },
    setTimeout: function () { return 0; }, clearTimeout: noop, setInterval: function () { return 0; }, clearInterval: noop,
    requestAnimationFrame: function () { return 0; }, cancelAnimationFrame: noop,
    getComputedStyle: function () { return { getPropertyValue: function () { return ''; } }; },
    matchMedia: function () { return { matches: false, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop }; },
    CustomEvent: function () {}, Event: function () {}, MutationObserver: function () { return { observe: noop, disconnect: noop }; },
    ResizeObserver: function () { return { observe: noop, disconnect: noop }; },
    IntersectionObserver: function () { return { observe: noop, disconnect: noop }; },
    localStorage: { getItem: function () { return null; }, setItem: noop, removeItem: noop, clear: noop },
    sessionStorage: { getItem: function () { return null; }, setItem: noop, removeItem: noop, clear: noop },
    fetch: function () { return Promise.resolve({ ok: true, json: function () { return Promise.resolve({}); } }); },
    console: console,
  };
  win.window = win;
  win.self = win;
  win.globalThis = win;
  return win;
}

/* ---- Descubrir los JS de componente (excluye demos y tests) ---- */
function listComponentJs(dirs) {
  const out = [];
  // Excluye lo que no es un componente cargable como <script> de página:
  // demos, ejemplos, service workers (sw-*), apps de demo (app.js), tests.
  function isComponent(name) {
    if (!name.endsWith('.js')) return false;
    if (/\.test\./.test(name)) return false;
    if (/(^|[-.])demo/.test(name)) return false;
    if (/^sw-/.test(name)) return false;        // service workers (contexto SW, no página)
    if (name === 'app.js') return false;         // apps de demostración
    return true;
  }
  // Carga en orden "base-primero": ordena por stem para que p.ej.
  // matios-ui-chart.js cargue antes que matios-ui-chart-bar.js.
  function byStem(a, b) {
    return a.replace(/\.js$/, '').localeCompare(b.replace(/\.js$/, ''));
  }
  function walk(dir) {
    for (const name of fs.readdirSync(dir).sort(byStem)) {
      const p = path.join(dir, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) {
        if (name === 'demos' || name === 'examples' || name === 'node_modules' || name === 'test') continue;
        walk(p);
      } else if (isComponent(name)) {
        out.push(p);
      }
    }
  }
  dirs.forEach(function (d) { if (fs.existsSync(d)) walk(d); });
  return out;
}

/* ---- Correr ---- */
const componentDirs = ['base', 'forms', 'navigation', 'overlays', 'display', 'layout', 'data', 'utilities', 'widgets', 'icons']
  .map(function (d) { return path.join(ROOT, d); });

const win     = makeStubWindow();
const context = vm.createContext(win);

const files    = listComponentJs(componentDirs);
const failures = [];
let pass = 0;

for (const file of files) {
  const rel  = path.relative(ROOT, file).replace(/\\/g, '/');
  const code = fs.readFileSync(file, 'utf8');
  try {
    vm.runInContext(code, context, { filename: rel });
    pass++;
  } catch (e) {
    failures.push({ rel: rel, err: e.name + ': ' + e.message });
  }
}

const mtsEntries = win.MTS ? Object.keys(win.MTS).length : 0;

console.log('\nMatios UI — smoke (load)');
console.log('  files:  ' + files.length);
console.log('  passed: ' + pass);
console.log('  failed: ' + failures.length);
console.log('  MTS namespace entries: ' + mtsEntries);

if (failures.length) {
  console.error('\nFailures:');
  failures.forEach(function (f) { console.error('  ✗ ' + f.rel + '  —  ' + f.err); });
}

if (failures.length > 0 || mtsEntries === 0) {
  console.error('\nSMOKE FAILED\n');
  process.exit(1);
}
console.log('\n✓ all component scripts load clean\n');
