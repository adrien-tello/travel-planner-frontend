# Stage 1: Build stage
FROM node:22-slim AS builder

# Install OpenSSL for Prisma (needed on slim images)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# --- FIX: Set NODE_ENV to development so devDependencies (like TypeScript) are installed ---
ENV NODE_ENV=development 

# 1. Copy config files first
COPY package.json pnpm-lock.yaml .npmrc ./

# 2. Install ALL dependencies (pnpm install uses NODE_ENV to decide what to install)
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

# Now we can safely set NODE_ENV=production for the final runtime stage
ENV NODE_ENV=production

# Install OpenSSL for Prisma in production
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy ONLY the files needed to run the app
# We copy the package.json, node_modules (which only has prod deps now), and the built 'dist' folder from the builder stage
COPY --from=builder /app/package.json ./
# Note: The node_modules copied here will only contain production dependencies, as intended for the final runtime image
COPY --from=builder /app/node_modules ./node_modules 
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Start the app from the compiled JS
CMD ["node", "dist/main.js"]
