# syntax=docker/dockerfile:1

ARG PLATFORM=linux/arm64

FROM --platform=${PLATFORM} node:latest AS base

FROM base AS builder

WORKDIR /app

COPY package.json package-lock.json*  ./

RUN npm ci

COPY . .    

RUN chown -R node:node /app

USER node

RUN npm run build

FROM base AS runner

WORKDIR /app

COPY --from=builder /app .

ENTRYPOINT ["npm", "run", "start"]