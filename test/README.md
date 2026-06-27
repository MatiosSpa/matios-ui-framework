# Tests

Zero-dependency tests for Matios UI. No build step, no npm install — just Node.

## Smoke test

```bash
node test/smoke.js
```

Evaluates every component `.js` (excluding demos, examples, service workers and
apps) in a minimal browser-like stub and asserts:

1. Each script **loads without throwing** — catches syntax errors, broken
   references, and **TDZ regressions** such as `let MTS = MTS || {}` (which a
   plain `node --check` does **not** catch, because it is a runtime error).
2. The global `MTS` namespace gets **populated**.

Scripts load in *base-first* order (e.g. `matios-ui-chart.js` before
`matios-ui-chart-*.js`) to respect the include order used on real pages.

Exit code is non-zero on any failure, so it gates CI (`.github/workflows/ci.yml`).

> This layer catches load/initialization bugs. Rendering/interaction is verified
> against the live demos in the browser. A future Playwright layer can automate
> that too.
