# --- Backend Dockerfile ---
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Prisma: Generate Client
RUN npx prisma generate

# Build TypeScript
RUN npx tsc

# Expose Port
EXPOSE 4000

# Start Backend
CMD ["node", "dist/server.js"] 