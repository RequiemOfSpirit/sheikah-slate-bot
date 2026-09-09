# Dockerfile for the Discord bot, intended to be built from the project root directory
FROM node:22-alpine AS base
WORKDIR /usr/local/app
COPY package*.json ./
COPY packages/api/package.json ./packages/api/
COPY packages/discord-bot/package.json ./packages/discord-bot/

FROM base AS build-stage
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
COPY . .
RUN npm run dist -w packages/api
RUN npm run dist -w packages/discord-bot

FROM base AS runtime-stage
ENV NODE_ENV=production
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
COPY --from=build-stage /usr/local/app/packages/api/build/dist packages/api/build/dist
COPY --from=build-stage /usr/local/app/packages/discord-bot/build/dist packages/discord-bot/build/dist
COPY packages/discord-bot/scripts packages/discord-bot/scripts
COPY packages/discord-bot/.env packages/discord-bot/.env

CMD ["npm", "start", "-w", "packages/discord-bot"]
