/* ============================================================
   MATIOS UI — generador de tipos (.d.ts)

   Lee cada componente (MTS.X = class), su JSDoc de constructor y sus
   métodos públicos, y emite un .d.ts UMD:

     - declare namespace MTS { interface XOptions; class X {...} }
     - export = MTS;  export as namespace MTS;  (global para <script>)

   Tipos ricos donde hay JSDoc @param options.*; permisivos (índice
   [key:string]: any) donde no, para no bloquear nunca al usuario.

   No se escribe a mano: se regenera desde el source. Lo invoca el build.
   ============================================================ */

'use strict';

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');
const { makeStubWindow } = require('../test/stub-window');

const ROOT = path.resolve(__dirname, '..');
const COMPONENT_DIRS = ['base', 'forms', 'navigation', 'overlays', 'display', 'layout', 'data', 'utilities', 'widgets', 'icons'];

// Funciones de utilidad de MTS (no son clases) — tipadas a mano.
const HAND_FUNCS = {
  registerLanguage: 'function registerLanguage(code: string, bundle: Record<string, any>): void;',
  registerLocale:   'function registerLocale(code: string, bundle: Record<string, any>): void;', // alias
  setLanguage:      'function setLanguage(code: string): void;',
  getLanguage:      'function getLanguage(): string;',
  getString:        'function getString(code?: string): Record<string, any>;',
};

/* ---- Descubrimiento (mismo criterio que smoke/build) ---- */
function isComponentJs(name) {
  if (!name.endsWith('.js')) return false;
  if (/\.test\./.test(name)) return false;
  if (/(^|[-.])demo/.test(name)) return false;
  if (/(^|[-.])i18n/.test(name)) return false;   // i18n no aporta API pública
  if (/^sw-/.test(name)) return false;
  if (name === 'app.js') return false;
  return true;
}
function collect(dirs) {
  const out = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir).sort()) {
      const p = path.join(dir, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) {
        if (name === 'demos' || name === 'examples' || name === 'node_modules' || name === 'test') continue;
        walk(p);
      } else if (isComponentJs(name)) {
        out.push(p);
      }
    }
  }
  dirs.forEach(function (d) { const f = path.join(ROOT, d); if (fs.existsSync(f)) walk(f); });
  return out;
}

/* ---- Mapeo de tipos JSDoc -> TS ---- */
function jsdocToTs(raw) {
  if (!raw) return 'any';
  let t = raw.trim();
  // uniones: "string|Element" -> "string | Element"
  if (t.indexOf('|') !== -1) {
    return t.split('|').map(jsdocToTs).join(' | ');
  }
  const low = t.toLowerCase();
  if (low === 'string') return 'string';
  if (low === 'number') return 'number';
  if (low === 'boolean' || low === 'bool') return 'boolean';
  if (low === 'array' || low === 'array<any>' || low === 'any[]') return 'any[]';
  if (low === 'function') return '(...args: any[]) => any';
  if (low === 'object') return 'Record<string, any>';
  if (low === 'element' || low === 'htmlelement') return 'HTMLElement';
  if (low === 'node') return 'Node';
  if (low === '*' || low === 'any') return 'any';
  if (low === 'void' || low === 'null' || low === 'undefined') return 'any';
  // tipos desconocidos -> any (no arriesgar tipos inválidos)
  return 'any';
}

/* ---- Extrae la JSDoc inmediatamente anterior a un índice ---- */
function jsdocBefore(src, idx) {
  const head = src.slice(0, idx);
  const m = head.match(/\/\*\*([\s\S]*?)\*\/\s*$/);
  return m ? m[1] : '';
}

/* ---- Parsea @param options.X {type} de un bloque JSDoc ---- */
function parseOptions(jsdoc) {
  const opts = {};
  const re = /@param\s+\{([^}]*)\}\s+(?:\[)?options\.([A-Za-z0-9_$]+)/g;
  let m;
  while ((m = re.exec(jsdoc)) !== null) {
    opts[m[2]] = jsdocToTs(m[1]);
  }
  return opts;
}

/* ---- Nombre del primer parámetro del constructor ---- */
function firstParam(ctorArgs) {
  const first = (ctorArgs.split(',')[0] || '').trim().replace(/=.*/, '').trim();
  return first;
}

/* ---- Métodos públicos de un bloque de clase (heurístico) ---- */
function publicMethods(body) {
  const names = new Set();
  const re = /(^|\n)\s*(static\s+)?([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    const isStatic = !!m[2];
    const name = m[3];
    if (name === 'constructor' || name === 'if' || name === 'for' || name === 'while' || name === 'switch' || name === 'catch' || name === 'function' || name === 'return') continue;
    if (name[0] === '_') continue;                // privados
    names.add((isStatic ? 'static ' : '') + name);
  }
  return Array.from(names);
}

/* ---- Procesar un archivo: devuelve [{name, options, ctor, methods}] ---- */
function parseFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  const classRe = /MTS\.([A-Z][A-Za-z0-9_$]*)\s*=\s*class\b/g;
  const found = [];
  let m;
  const indices = [];
  while ((m = classRe.exec(src)) !== null) { indices.push({ name: m[1], at: m.index, end: classRe.lastIndex }); }

  for (let i = 0; i < indices.length; i++) {
    const cur = indices[i];
    const bodyEnd = (i + 1 < indices.length) ? indices[i + 1].at : src.length;
    const body = src.slice(cur.end, bodyEnd);

    // constructor + su JSDoc
    const ctorM = body.match(/constructor\s*\(([^)]*)\)/);
    const ctorArgs = ctorM ? ctorM[1] : '';
    const ctorIdxAbs = ctorM ? (cur.end + body.indexOf(ctorM[0])) : -1;
    const jsdoc = ctorIdxAbs >= 0 ? jsdocBefore(src, ctorIdxAbs) : '';

    found.push({
      name: cur.name,
      options: parseOptions(jsdoc),
      first: firstParam(ctorArgs),
      hasCtor: !!ctorM,
      methods: publicMethods(body),
    });
  }
  return found;
}

/* ---- Claves reales de runtime: evalúa el source en el stub y lista MTS.* ---- */
// Incluye TODOS los JS de componente (igual que el bundle) para no perder
// miembros que no son `= class` (Toast, Icon, Sanitize, registerLocale…).
function evalForKeys() {
  const out = [];
  function ok(name) {
    if (!name.endsWith('.js')) return false;
    if (/\.test\./.test(name)) return false;
    if (/(^|[-.])demo/.test(name)) return false;
    if (/^sw-/.test(name)) return false;
    if (name === 'app.js') return false;
    return true;
  }
  function byStem(a, b) { return a.replace(/\.js$/, '').localeCompare(b.replace(/\.js$/, '')); }
  function walk(dir) {
    for (const name of fs.readdirSync(dir).sort(byStem)) {
      const p = path.join(dir, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) {
        if (name === 'demos' || name === 'examples' || name === 'node_modules' || name === 'test') continue;
        walk(p);
      } else if (ok(name)) { out.push(p); }
    }
  }
  COMPONENT_DIRS.forEach(function (d) { const f = path.join(ROOT, d); if (fs.existsSync(f)) walk(f); });

  const win = makeStubWindow();
  const ctx = vm.createContext(win);
  out.forEach(function (f) {
    try { vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f }); } catch (e) { /* el smoke ya valida la carga */ }
  });
  return win.MTS ? Object.keys(win.MTS) : [];
}

/* ---- Generar el .d.ts ---- */
function generate() {
  // 1) clases ricas (con JSDoc + métodos), parseadas del source sin i18n
  const classes = {};
  collect(COMPONENT_DIRS).forEach(function (f) {
    parseFile(f).forEach(function (c) { if (!classes[c.name]) classes[c.name] = c; });
  });

  // 2) claves reales de runtime (cubre lo que no es `= class`)
  const realKeys = evalForKeys();
  const keySet = {};
  realKeys.forEach(function (k) { keySet[k] = true; });
  // asegura que toda clase parseada esté presente aunque el eval no la exponga
  Object.keys(classes).forEach(function (k) { keySet[k] = true; });

  const names = Object.keys(keySet).sort();

  const lines = [];
  lines.push('// Auto-generated by scripts/gen-types.js — do not edit by hand.');
  lines.push('// Matios UI — TypeScript declarations (UMD).');
  lines.push('');
  lines.push('export = MTS;');
  lines.push('export as namespace MTS;');
  lines.push('');
  lines.push('declare namespace MTS {');

  let typedClasses = 0, looseMembers = 0;

  names.forEach(function (name) {
    // funciones de utilidad tipadas a mano
    if (HAND_FUNCS[name]) {
      lines.push('  ' + HAND_FUNCS[name]);
      lines.push('');
      return;
    }

    const c = classes[name];
    if (c) {
      typedClasses++;
      const optKeys = Object.keys(c.options);
      const ifaceName = name + 'Options';

      lines.push('  interface ' + ifaceName + ' {');
      optKeys.forEach(function (k) { lines.push('    ' + k + '?: ' + c.options[k] + ';'); });
      lines.push('    /** Any other option supported by the component. */');
      lines.push('    [key: string]: any;');
      lines.push('  }');

      lines.push('  class ' + name + ' {');
      const f = (c.first || '').toLowerCase();
      if (!c.hasCtor) {
        lines.push('    constructor(...args: any[]);');
      } else if (/^(opt|config|cfg)/.test(f) || f === '') {
        lines.push('    constructor(options?: ' + ifaceName + ');');
      } else {
        lines.push('    constructor(selector: string | Element, options?: ' + ifaceName + ');');
      }
      c.methods.forEach(function (mm) { lines.push('    ' + mm + '(...args: any[]): any;'); });
      lines.push('    [key: string]: any;');
      lines.push('  }');
      lines.push('');
    } else {
      // miembro no-clase (objeto utilitario / función / singleton): accesible y permisivo
      looseMembers++;
      lines.push('  const ' + name + ': any;');
      lines.push('');
    }
  });

  lines.push('}');
  lines.push('');
  lines.push('declare global {');
  lines.push('  interface Window { MTS: typeof MTS; }');
  lines.push('}');
  lines.push('');

  return { dts: lines.join('\n') + '\n', count: names.length, typedClasses: typedClasses, looseMembers: looseMembers };
}

module.exports = { generate: generate };

/* Permite correrlo suelto: node scripts/gen-types.js */
if (require.main === module) {
  const out = generate();
  const dist = path.join(ROOT, 'dist');
  fs.mkdirSync(dist, { recursive: true });
  fs.writeFileSync(path.join(dist, 'matios-ui.d.ts'), out.dts);
  console.log('types: ' + out.count + ' classes -> dist/matios-ui.d.ts');
}
