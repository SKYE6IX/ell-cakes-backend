# syntax=docker/dockerfile:1

FROM node:lts-alpine AS base

FROM base AS builder

RUN apk add --no-cache openssl

WORKDIR /app

ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-arm64-openssl-3.0.x
ENV PRISMA_CLIENT_ENGINE_TYPE=binary

COPY package.json package-lock.json*  ./

RUN npm ci

COPY . .

RUN chown -R node:node /app

USER node

RUN npm run build

RUN npx prisma generate --schema=schema.prisma

RUN npm prune --omit=dev

RUN rm -rf ~/.npm

FROM base AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.keystone .keystone
COPY --from=builder /app/schema.prisma /app/schema.prisma
COPY --from=builder /app/migrations /app/migrations

RUN npm cache clean --force

ENTRYPOINT ["npm", "run", "start"]