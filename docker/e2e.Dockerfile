# Self-contained e2e image: Playwright + pnpm + apps/web (tests + deps pre-installed).
# No volume mount of source at runtime; node_modules baked in to avoid pnpm install during PR gate.
FROM mcr.microsoft.com/playwright:v1.49.0-jammy

RUN npm install -g pnpm@9

WORKDIR /app

# Copy only what e2e needs: package manifest, lockfile, config, tests, snapshots
COPY apps/web/package.json apps/web/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY apps/web/playwright.config.ts ./
COPY apps/web/e2e ./e2e

# Playwright image defaults to root; run as root for CI (trusted tests)
CMD ["pnpm", "test:e2e"]
