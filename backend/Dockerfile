# Stage 1: Build stage
FROM node:22-slim AS builder

# Install OpenSSL for Prisma (needed on slim images)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 1. Copy config files first
COPY package.json pnpm-lock.yaml .npmrc ./

# 2. Install ALL dependencies
RUN pnpm install --frozen-lockfile

# 3. Copy Prisma and Generate
COPY prisma ./prisma/
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN pnpm prisma generate

# 4. Copy source and BUILD HERE
COPY . .
# Build TypeScript
RUN pnpm build

# Stage 2: Production stage
FROM node:22-slim AS runner

# Install OpenSSL for Prisma in production
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy ONLY the files needed to run the app
# We copy the node_modules and the built 'dist' folder from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Start the app from the compiled JS
CMD ["node", "dist/main.js"]
