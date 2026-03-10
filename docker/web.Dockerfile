# Web runtime image for CI. Source is baked in; no volume mount in PR gate.
FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN chown -R node:node /app
EXPOSE 3000

USER node
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]
