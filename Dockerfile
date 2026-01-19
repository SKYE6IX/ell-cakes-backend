# syntax=docker/dockerfile:1

FROM node:lts-alpine AS base

FROM base AS builder

RUN apk add --no-cache openssl

WORKDIR /app

ENV PRISMA_CLI_BINARY_TARGETS=linux-musl

ENV PRISMA_CLIENT_ENGINE_TYPE=binary

COPY package.json package-lock.json*  ./

RUN npm ci

COPY . .

RUN chown -R node:node /app

USER node

RUN npm run build

RUN npm prune --production

FROM base AS runner

RUN apk add --no-cache openssl

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.keystone .keystone

RUN npm cache clean --force

ENV NODE_ENV=production

ENTRYPOINT ["npm", "run", "start"]