# --- Backend Dockerfile ---
FROM node:18-alpine

WORKDIR /app

# Install bash for startup script
RUN apk add --no-cache bash

# Kopiere package.json und package-lock.json
COPY package*.json ./
RUN npm install

# Kopiere Prisma Schema
COPY prisma ./prisma

# Generiere Prisma Client
RUN npx prisma generate

# Kopiere restliche Dateien
COPY . .

# Build TypeScript
RUN npm run build

# Erstelle uploads und logs Ordner
RUN mkdir -p uploads logs

# Make startup script executable
RUN chmod +x start.sh

# Expose Port
EXPOSE 4000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start with script
CMD ["./start.sh"] 