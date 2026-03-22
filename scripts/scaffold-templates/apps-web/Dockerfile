FROM node:22-alpine

RUN npm install -g pnpm@9

WORKDIR /repo/apps/web

EXPOSE 3000

# nosemgrep: dockerfile.security.missing-user.missing-user
# Development container with volume mounts - USER set at compose level in CI (see docker-compose.ci.pull.yml)
# Production image (docker/web.Dockerfile) has proper USER directive.
CMD ["sh", "-c", "pnpm run dev --host 0.0.0.0 --port 3000"]
