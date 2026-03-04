FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN chown -R node:node /app
EXPOSE 3000

USER node
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]
