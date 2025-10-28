# syntax=docker/dockerfile:1

ARG PLATFORM=linux/arm64

FROM --platform=${PLATFORM} node:latest AS base

FROM base AS builder

WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

COPY . .    

RUN chown -R node:node /app

USER node

RUN npm run build

FROM base AS runner

WORKDIR /app

COPY --from=builder /app .

CMD ["npm", "run", "start"]