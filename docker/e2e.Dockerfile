# Self-contained e2e image: Playwright + pnpm + apps/web (tests + deps pre-installed).
# Uses full Playwright base (~1.5GB). CI runs only Chromium; image size reduction via cache.
FROM mcr.microsoft.com/playwright:v1.49.0-jammy

RUN npm install -g pnpm@9

WORKDIR /app

# Copy only what e2e needs: package manifest, lockfile, config, tests, snapshots
COPY apps/web/package.json apps/web/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY apps/web/playwright.config.ts ./
COPY apps/web/e2e ./e2e

RUN chown -R pwuser:pwuser /app
USER pwuser

CMD ["pnpm", "test:e2e"]
