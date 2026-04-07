FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
COPY apps/api/prisma apps/api/prisma/

# Install dependencies
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install

# Copy source
COPY tsconfig.base.json ./
COPY packages/shared packages/shared/
COPY apps/api apps/api/

# Build
RUN pnpm --filter @studeo/shared build
RUN pnpm --filter @studeo/api db:generate
RUN pnpm --filter @studeo/api build

EXPOSE 3001
CMD ["sh", "-c", "cd apps/api && npx prisma migrate deploy && node dist/index.js"]
