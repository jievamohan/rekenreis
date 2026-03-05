# Solution: Fix Failing Playwright Tests

## Task 1: Add page title to Nuxt config
- In `apps/web/nuxt.config.ts`, add:
  ```ts
  app: {
    head: {
      title: 'Rekenreis',
    },
  },
  ```
- This sets a default `<title>` for all pages, fixing the `toHaveTitle(/rekenreis/i)` assertion.

## Task 2: Generate and commit visual regression baselines
- Run Playwright with `--update-snapshots` inside the e2e Docker container to generate baseline PNGs.
- Commit the generated snapshots under `apps/web/e2e/visual/play-visual.spec.ts-snapshots/`.
- Both `chromium` and `visual` project snapshots are needed.
