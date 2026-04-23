FROM node:20.19.0-bookworm-slim AS base
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

FROM base AS migrator
WORKDIR /app

ENV NODE_ENV=production
ENV HOME=/tmp
ENV npm_config_cache=/tmp/.npm
ENV NEXT_TELEMETRY_DISABLED=1

RUN mkdir -p /tmp/.npm

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

CMD ["sh", "-lc", "until ./node_modules/.bin/prisma migrate deploy; do echo \"Waiting for DB...\"; sleep 2; done"]

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

ENV PORT=3000
CMD ["node", "server.js"]

