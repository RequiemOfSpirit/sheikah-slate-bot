# Dockerfile for the Discord bot, intended to be built from the project root directory
FROM node:22-alpine AS base
WORKDIR /usr/local/app
COPY package*.json ./
COPY packages/db/package.json ./packages/db/
COPY packages/discord-bot/package.json ./packages/discord-bot/

FROM base AS build-stage
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
COPY . .
RUN npm run dist

FROM base AS runtime-stage
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev --no-audit --no-fund
COPY --from=build-stage /usr/local/app/packages/db/dist packages/db/dist
COPY --from=build-stage /usr/local/app/packages/discord-bot/dist packages/discord-bot/dist
COPY packages/discord-bot/.env packages/discord-bot/.env

CMD ["npm", "start", "-w", "packages/discord-bot"]
