FROM oven/bun:alpine AS base

FROM base AS deps
# 1.install deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --forzen-lockfile

# 2. build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build



# 3.start the server
FROM base AS runner

WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Install dotenvx
RUN curl -sfS https://dotenvx.sh/install.sh | sh

EXPOSE 3000

# ensure a .env file in the root of project
CMD ["dotenvx", "run","--","bun", "run", "server.js"]
