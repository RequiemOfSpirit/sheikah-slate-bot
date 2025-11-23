# Dockerfile for the Twitch bot, intended to be built from the project root directory
FROM node:22-alpine AS base
WORKDIR /usr/local/app
COPY package*.json ./
COPY packages/api/package.json ./packages/api/
COPY packages/twitch-bot/package.json ./packages/twitch-bot/

FROM base AS build-stage
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
COPY . .
RUN npm run dist -w packages/api
RUN npm run dist -w packages/twitch-bot

FROM base AS runtime-stage
ENV NODE_ENV=production
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
COPY --from=build-stage /usr/local/app/packages/api/build/dist packages/api/build/dist
COPY --from=build-stage /usr/local/app/packages/twitch-bot/build/dist packages/twitch-bot/build/dist
COPY packages/twitch-bot/.env packages/twitch-bot/.env

CMD ["npm", "start", "-w", "packages/twitch-bot"]
