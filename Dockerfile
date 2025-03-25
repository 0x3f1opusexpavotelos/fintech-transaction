FROM oven/bun:alpine AS base

FROM base AS deps
# 1.install deps beased on perfer packages
WORKDIR /app
COPY package.json bun.lock ./
RUN  \
    if [ -f bun.lock] bun install --forzen-lockfile \
    elif [ -f yarn.lock]; then yarn --frozen-lockfile; \
    elif [ -f package.json]; then npm ci; \
    elif [ -f pnpm-lock.yaml]; then corepack enable pnpm && pnpm;



# 2. build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
#  build env
COPY .env .env
RUN bun run build



# 3.start the server
FROM base AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN adduser --system  --gid 1001 nodejs
RUN adduser --system nextjs --uid 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static


USER nextjs

# Install dotenvx
# RUN curl -sfS https://dotenvx.sh/install.sh | sh

EXPOSE 3000

ENV PORT=3000

# ensure a .env file in the root of project
# CMD ["dotenvx", "run","--","bun", "run", "server.js"]
CMD ["bun", "run", "server.js"]
