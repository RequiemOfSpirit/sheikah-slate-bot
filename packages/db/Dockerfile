# Dockerfile for DB migrations, intended to be built from the project root directory
FROM node:22-alpine
WORKDIR /usr/local/app

COPY package*.json ./
COPY packages/db/package.json packages/db/
RUN --mount=type=cache,target=/root/.npm npm ci -w packages/db --no-audit --no-fund

COPY packages/db/.env packages/db/.env
COPY packages/db/migrations packages/db/migrations

CMD ["npm", "run", "db:migrate", "-w", "packages/db"]
