# Dockerfile for the API server, intended to be built from the project root directory
FROM node:22-alpine AS base
WORKDIR /usr/local/app
COPY package*.json ./
COPY packages/api/package.json ./packages/api/

FROM base AS build-stage
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
COPY . .
RUN npm run dist -w packages/api

FROM base AS runtime-stage
ENV NODE_ENV=production
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
COPY --from=build-stage /usr/local/app/packages/api/build/dist packages/api/build/dist
COPY packages/api/.env packages/api/.env

CMD ["npm", "start", "-w", "packages/api"]
