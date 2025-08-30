# Dev stage
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile --ignore-scripts --silent --network-timeout 100000

# Prod stage with distroless image
FROM gcr.io/distroless/nodejs22-debian12 AS production
WORKDIR /app

# Copy dependencies and source
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY package.json ./

EXPOSE 3001
CMD ["src/server.js"]
