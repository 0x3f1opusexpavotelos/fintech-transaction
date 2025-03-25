FROM oven/bun:alpine AS base

FROM base AS deps
# 1.install deps beased on perfer packages
WORKDIR /app
COPY package.json bun.lock ./
RUN  \
    if [ -f bun.lock] bun install --forzen-lockfile; \
    elif [ -f pnpm-lock.yaml]; then corepack enable pnpm && pnpm; \
    elif [ -f yarn.lock]; then yarn --frozen-lockfile; \
    elif [ -f package.json]; then npm ci; \
    else echo  "Lockfile not found."  && exit 1; \
    fi



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

RUN addgroup --system --gid 1005 nodejs
RUN adduser --system nextjs --uid 1005

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static


USER nextjs



EXPOSE 3000

ENV PORT=3000


# ENTRYPOINT ["doppler", "run", "--"]
# ensure a .env file in the root of project
# Install dotenvx
# RUN curl -sfS https://dotenvx.sh/install.sh | sh
# ENTRYPOINT ["dotenvx", "run", "--"]
CMD ["bun", "run", "server.js"]
