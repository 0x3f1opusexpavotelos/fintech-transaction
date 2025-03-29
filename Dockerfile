# FROM node:lts-alpine AS base
FROM oven/bun:alpine AS base

FROM base AS deps
# 1.install deps beased on perfer packages
WORKDIR /app
COPY package.json bun.lock*  pnpm-lock.yaml* package-lock.json* yarn.lock* .npmrc* ./
RUN  \
    if [ -f bun.lock ]; then bun install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json]; then npm ci; \
    elif [ -f yarn.lock]; then yarn --frozen-lockfile; \
    else echo  "Lockfile not found."  && exit 1; \
    fi



# 2. build the application
FROM base AS builder


# https://github.com/vercel/next.js/discussions/14030
# build time argments must be present
# ARG ENV_VARIABLE
# ENV ENV_VARIABLE=${ENV_VARIABLE}
ARG NEXT_PUBLIC_ENV_VARIABLE
ENV NEXT_PUBLIC_ENV_VARIABLE=${NEXT_PUBLIC_ENV_VARIABLE}


WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# RUN corepack enable pnpm && pnpm run build
RUN bun run build


# 3.start the server
FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static


# ENTRYPOINT ["doppler", "run", "--"]
# ensure a .env file in the root of project
# Install dotenvx
# RUN curl -sfS https://dotenvx.sh/install.sh | sh
# ENTRYPOINT ["dotenvx", "run", "--"]


# ARG ENV_VARIABLE
# ENV ENV_VARIABLE=${ENV_VARIABLE}
ARG NEXT_PUBLIC_ENV_VARIABLE
ENV NEXT_PUBLIC_ENV_VARIABLE=${NEXT_PUBLIC_ENV_VARIABLE}


# disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# CMD ["node", "server.js"]
CMD ["bun", "server.js"]
