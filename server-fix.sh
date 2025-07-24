#!/bin/bash
set -e

echo "🔧 Galactic Automation Hub - Server Fix Script"
echo "==============================================="
echo ""

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log-Funktion
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Root-Check
if [[ $EUID -ne 0 ]]; then
   error "Dieses Script muss als root ausgeführt werden (sudo)"
fi

PROJECT_DIR="/var/www/galactic-automation-hub"

log "🔍 Bestehende Installation reparieren..."

# Check if project exists
if [ ! -d "$PROJECT_DIR" ]; then
    error "Projekt-Verzeichnis $PROJECT_DIR nicht gefunden. Führen Sie zuerst das auto-install.sh aus."
fi

cd "$PROJECT_DIR"

# =============================================================================
# 1. STOP EXISTING CONTAINERS
# =============================================================================
log "🛑 Bestehende Container stoppen..."
docker compose down 2>/dev/null || true

# =============================================================================
# 2. FIX FRONTEND DEPENDENCIES
# =============================================================================
log "🔧 Frontend Dependencies reparieren..."

# Fix date-fns version conflict
sed -i 's/"date-fns": "4.1.0"/"date-fns": "^3.6.0"/' package.json
sed -i 's/"react-day-picker": "8.10.1"/"react-day-picker": "^8.10.1"/' package.json

# Remove and reinstall frontend dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

log "✅ Frontend Dependencies repariert"

# =============================================================================
# 3. FIX BACKEND DEPENDENCIES
# =============================================================================
log "🔧 Backend Dependencies reparieren..."

cd backend
rm -rf node_modules package-lock.json
npm install

cd "$PROJECT_DIR"

log "✅ Backend Dependencies repariert"

# =============================================================================
# 4. FIX DEPENDENCIES AND DOCKERFILES
# =============================================================================
log "📦 Dependencies und Dockerfiles aktualisieren..."

# Fix package.json dependencies
log "🔧 Fixing package.json dependencies..."
sed -i 's/"date-fns": "4\.1\.0"/"date-fns": "^3.6.0"/' package.json

# Update Frontend Dockerfile
cat > Dockerfile.frontend << 'EOF'
# --- Frontend Dockerfile ---
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies with legacy peer deps
COPY package*.json pnpm-lock.yaml* ./
RUN npm install --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["node", "server.js"]
EOF

log "✅ Dockerfiles aktualisiert"

# =============================================================================
# 5. REBUILD AND START
# =============================================================================
log "🔨 Container neu bauen und starten..."

# Clean up Docker
docker system prune -f

# Build and start with better options
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose up --build -d

log "✅ Container neu gestartet"

# =============================================================================
# 6. HEALTH CHECK
# =============================================================================
log "🩺 Health-Check mit Retries..."

# Wait and check health
for i in {1..15}; do
    sleep 10
    if curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
        log "✅ Backend läuft erfolgreich!"
        break
    else
        if [ $i -eq 15 ]; then
            warn "⚠️  Backend braucht möglicherweise noch mehr Zeit"
        else
            echo -n "."
        fi
    fi
done

# =============================================================================
# 7. STATUS SUMMARY
# =============================================================================
echo ""
echo "🎉 Reparatur abgeschlossen!"
echo "============================"
echo ""

# Get server IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')

echo -e "${GREEN}🔗 Ihre Anwendung sollte verfügbar sein unter:${NC}"
echo "   Frontend: http://$SERVER_IP:3000"
echo "   Backend:  http://$SERVER_IP:4000"
echo ""

echo -e "${BLUE}📋 Demo-Zugangsdaten:${NC}"
echo "   Admin:     admin / admin123"
echo "   User:      testuser / user123"
echo "   Commander: commander / commander123"
echo ""

echo -e "${YELLOW}🔧 Status prüfen:${NC}"
echo "   docker compose ps"
echo "   docker compose logs -f"
echo "   curl http://localhost:4000/api/health"
echo ""

log "🌌 Galactic Automation Hub sollte jetzt funktionieren!"

exit 0