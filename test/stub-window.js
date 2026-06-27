/* ============================================================
   Stub mínimo de navegador para correr el source de Matios UI en
   Node (smoke test + verificación de build). Sin dependencias.
   ============================================================ */
'use strict';

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

module.exports = { makeStubWindow: makeStubWindow };
