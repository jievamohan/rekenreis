# Dependency Review: 0001-bootstrap-tooling

## Scope

Bootstrap adds dev-only tooling dependencies. No production runtime deps added beyond scaffold defaults.

## Web (apps/web)

- **Nuxt 3.13.2** – pinned for stability
- **Vue 3.5**, **TypeScript**, **ESLint**, **Vitest**, **vue-tsc** – standard tooling
- **pnpm audit**: 13 vulns (see security.md). Remediation: upgrade Nuxt to ≥3.16, update transitive deps. Follow-up task.

## API (apps/api)

- **Laravel 12** – from composer create-project
- **Larastan** – PHPStan Laravel extension (dev)
- **composer audit**: clean

## Risk

- Low. All new deps are dev/tooling.
- Web audit vulns are in dev/build tooling (nuxt, giget, etc.); production bundle may not include all. Track in security.md.
