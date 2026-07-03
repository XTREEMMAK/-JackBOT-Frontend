# syntax=docker/dockerfile:1

# ---- Build stage ------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Drop devDependencies now that build output exists
RUN npm prune --omit=dev

# ---- Runtime stage ------------------------------------------------------------
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

USER node

# adapter-node defaults to PORT=3000 / HOST=0.0.0.0 when unset.
# Override at `docker run` time with -e PORT=... -e HOST=... as needed.
EXPOSE 3000

CMD ["node", "build/index.js"]
