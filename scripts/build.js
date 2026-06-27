/* ============================================================
   MATIOS UI — build (esbuild)

   Toma el source global (window.MTS por <script>) SIN modificarlo y
   genera bundles distribuibles en dist/:

     dist/matios-ui.min.js   → global/IIFE (script tag, unpkg/jsdelivr)
     dist/matios-ui.esm.mjs  → ESM (bundlers: Vite/webpack) + export default MTS
     dist/matios-ui.min.css  → base + componentes (los temas van aparte)

   El source no se toca: esto es un canal de distribución adicional.
   Uso:  node scripts/build.js   (o  npm run build)
   ============================================================ */

'use strict';

const fs      = require('fs');
const path    = require('path');
const vm      = require('vm');
const esbuild = require('esbuild');
const { makeStubWindow } = require('../test/stub-window');
const { generate: generateTypes } = require('./gen-types');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// Baseline de navegadores (≈ ES2020: el source usa ?. y ?? y nada más nuevo).
// esbuild no eleva el código; solo garantiza que el dist no exceda este target.
const TARGET = ['chrome80', 'firefox78', 'safari14', 'edge80'];

const COMPONENT_DIRS = ['base', 'forms', 'navigation', 'overlays', 'display', 'layout', 'data', 'utilities', 'widgets', 'icons'];

/* ---- Descubrimiento (mismo criterio que test/smoke.js) ---- */
function isComponentJs(name) {
  if (!name.endsWith('.js')) return false;
  if (/\.test\./.test(name)) return false;
  if (/(^|[-.])demo/.test(name)) return false;
  if (/^sw-/.test(name)) return false;
  if (name === 'app.js') return false;
  return true;
}
function isComponentCss(name) {
  if (!name.endsWith('.css')) return false;
  if (/(^|[-.])demo/.test(name)) return false;
  return true;
}
function byStem(a, b) {
  return a.replace(/\.(js|css)$/, '').localeCompare(b.replace(/\.(js|css)$/, ''));
}
function collect(dirs, accept) {
  const out = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir).sort(byStem)) {
      const p  = path.join(dir, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) {
        if (name === 'demos' || name === 'examples' || name === 'node_modules' || name === 'test') continue;
        walk(p);
      } else if (accept(name)) {
        out.push(p);
      }
    }
  }
  dirs.forEach(function (d) { var full = path.join(ROOT, d); if (fs.existsSync(full)) walk(full); });
  return out;
}

// CSS: concatenación simple.
function concatCss(files) {
  return files.map(function (f) {
    const rel = path.relative(ROOT, f).replace(/\\/g, '/');
    return '/* ' + rel + ' */\n' + fs.readFileSync(f, 'utf8');
  }).join('\n\n');
}

// JS: cada archivo en su propio IIFE — aísla el scope top-level (sin colisiones
// ni hazards de ASI/tagged-template entre archivos) y comparte `window.MTS`.
// Mismo modelo que test/smoke.js (cada archivo en scope aislado, contexto compartido).
function concatJs(files) {
  return files.map(function (f) {
    const rel = path.relative(ROOT, f).replace(/\\/g, '/');
    return '/* ' + rel + ' */\n;(function(){\n' + fs.readFileSync(f, 'utf8') + '\n})();';
  }).join('\n\n');
}

function kb(str) { return (Buffer.byteLength(str, 'utf8') / 1024).toFixed(1) + ' KB'; }

async function main() {
  const jsFiles  = collect(COMPONENT_DIRS, isComponentJs);
  const cssFiles = collect(COMPONENT_DIRS, isComponentCss);
  const jsSrc    = concatJs(jsFiles);
  const cssSrc   = concatCss(cssFiles);

  fs.mkdirSync(DIST, { recursive: true });

  const banner = '/*! Matios UI v' + require('../package.json').version + ' | MIT | https://github.com/MatiosSpa/matios-ui-framework */';

  /* --- Global (script tag) — cada archivo ya está en su IIFE --- */
  const globalMin = await esbuild.transform(jsSrc, { minify: true, target: TARGET, legalComments: 'none' });
  fs.writeFileSync(path.join(DIST, 'matios-ui.min.js'), banner + '\n' + globalMin.code);

  /* --- ESM (bundlers) --- */
  const esmSrc = jsSrc + "\nexport default (typeof window !== 'undefined' ? window : globalThis).MTS;\n";
  const esmMin = await esbuild.transform(esmSrc, { minify: true, format: 'esm', target: TARGET, legalComments: 'none' });
  fs.writeFileSync(path.join(DIST, 'matios-ui.esm.mjs'), banner + '\n' + esmMin.code);

  /* --- CSS (base + componentes) --- */
  const cssMin = await esbuild.transform(cssSrc, { loader: 'css', minify: true, target: TARGET, legalComments: 'none' });
  fs.writeFileSync(path.join(DIST, 'matios-ui.min.css'), banner + '\n' + cssMin.code);

  /* --- Tipos TypeScript (.d.ts) generados desde el source --- */
  const types = generateTypes();
  fs.writeFileSync(path.join(DIST, 'matios-ui.d.ts'), types.dts);

  /* --- Verificación: el bundle global carga y puebla MTS; el source corre en strict (ESM) --- */
  const stub = makeStubWindow();
  vm.runInContext(fs.readFileSync(path.join(DIST, 'matios-ui.min.js'), 'utf8'), vm.createContext(stub), { filename: 'matios-ui.min.js' });
  const entries = stub.MTS ? Object.keys(stub.MTS).length : 0;
  if (entries < 50) { throw new Error('El bundle global no pobló MTS (entries=' + entries + ')'); }
  // ESM siempre es strict: corre el source en strict para detectar incompatibilidades.
  vm.runInContext('"use strict";\n;(function(){\n' + jsSrc + '\n})();', vm.createContext(makeStubWindow()), { filename: 'esm-strict-check' });

  console.log('\nMatios UI — build');
  console.log('  js  files: ' + jsFiles.length);
  console.log('  css files: ' + cssFiles.length);
  console.log('  dist/matios-ui.min.js   ' + kb(globalMin.code));
  console.log('  dist/matios-ui.esm.mjs  ' + kb(esmMin.code));
  console.log('  dist/matios-ui.min.css  ' + kb(cssMin.code));
  console.log('  dist/matios-ui.d.ts     ' + types.count + ' classes typed');
  console.log('  verify: MTS entries = ' + entries + ' (global ok, strict/ESM ok)');
  console.log('\n✓ build complete\n');
}

main().catch(function (e) { console.error(e); process.exit(1); });
