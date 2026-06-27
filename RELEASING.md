# Releasing

Matios UI follows [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`.

- **MAJOR** — breaking changes to a component's public API (constructor, options, events, or markup contract).
- **MINOR** — new components, new opt-in options/methods, backward-compatible behavior.
- **PATCH** — fixes and docs that don't change the public API.

The framework is versioned as a single unit. Per-component changes are tracked by date inside each component's `.md`;
notable framework-level changes go in [`CHANGELOG.md`](./CHANGELOG.md).

## Release checklist

1. **Update the changelog** — move `[Unreleased]` items into a new `[x.y.z]` section with today's date.
2. **Bump the version** — `npm version <patch|minor|major>` (updates `package.json` and creates a git tag).
3. **Build & verify** — `npm run build` regenerates `dist/` (bundles + `.d.ts`) and self-verifies; `npm test` runs the
   smoke test. Both also run automatically on `prepublishOnly`.
4. **Publish to npm** — `npm publish` (runs `prepublishOnly` → build + test first). This is what enables the
   jsDelivr / unpkg CDN.
5. **Push** — `git push && git push --tags`.
6. **GitHub release** — create a release from the tag, pasting the changelog section.

> `dist/` is a build artifact (git-ignored) and is rebuilt on publish via `prepublishOnly`. It is not committed.

## Docs site

The explorer (`index.html`) **is** the docs site — a static, no-build catalog of every component with live demos and
their `.md` docs. It can be served by any static host:

- **GitHub Pages** — Settings → Pages → *Deploy from a branch* → `main` / root. No workflow needed (the site is static).
- A custom domain (e.g. `ui-framework.matios.cl`) is configured in the same Pages settings + a DNS `CNAME` record.
- Or any static host / CDN that serves the repository root.

The site loads the **source** component files directly (not `dist/`), so it works straight from the repo.

## Maintainer note

Publishing to npm and creating releases are manual, owner-driven steps — there is no automated publish workflow, by
design (no npm token in CI).
