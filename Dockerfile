# Dockerfile
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

# Production image
FROM node:24-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Make the entry point executable
RUN chmod +x dist/index.js

ENV NODE_ENV=production

ENTRYPOINT ["node", "dist/index.js"]