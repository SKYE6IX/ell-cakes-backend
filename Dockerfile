# syntax=docker/dockerfile:1

FROM node:lts-alpine AS base

FROM base AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json package-lock.json*  ./

ENV NODE_ENV=production

RUN npm ci

COPY . .    

RUN chown -R node:node /app

USER node

RUN npm run build

FROM base AS runner

RUN apk add --no-cache openssl

WORKDIR /app

COPY --from=builder /app .

ENTRYPOINT ["npm", "run", "start"]