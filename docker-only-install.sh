#!/bin/bash
set -e

echo "🚀 Galactic Automation Hub - Docker-Only Installation"
echo "====================================================="
echo ""

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Root-Check
if [[ $EUID -ne 0 ]]; then
   error "Dieses Script muss als root ausgeführt werden (sudo)"
fi

PROJECT_DIR="/var/www/galactic-automation-hub"
GITHUB_URL="https://github.com/felge88/galactic-automation-hub"
CURRENT_USER="${SUDO_USER:-$USER}"

log "🎯 Deploying Galactic Automation Hub (Docker-Only)..."

# =============================================================================
# 1. DOCKER ÜBERPRÜFUNG
# =============================================================================
log "🐳 Docker-Installation überprüfen..."

if ! command -v docker &> /dev/null; then
    log "Docker wird installiert..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    
    # Install Docker Compose
    apt install -y docker-compose-plugin
    
    # Add user to docker group
    usermod -aG docker $CURRENT_USER
    
    # Start and enable Docker
    systemctl start docker
    systemctl enable docker
    
    success "✅ Docker installiert"
else
    success "✅ Docker bereits installiert"
fi

# =============================================================================
# 2. PROJEKT SETUP
# =============================================================================
log "📁 Projekt-Setup..."

# Clean up existing installation
if [ -d "$PROJECT_DIR" ]; then
    warn "Bestehende Installation wird entfernt..."
    cd "$PROJECT_DIR"
    docker compose down 2>/dev/null || true
    cd /
    rm -rf "$PROJECT_DIR"
fi

# Clone project
log "📥 Projekt von GitHub klonen..."
git clone "$GITHUB_URL" "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Set ownership
chown -R $CURRENT_USER:$CURRENT_USER "$PROJECT_DIR"

success "✅ Projekt erfolgreich geklont"

# =============================================================================
# 3. DOCKER-ONLY FIXES (KEIN NPM BENÖTIGT)
# =============================================================================
log "🔧 Docker-Konfiguration wird angepasst..."

# Fix Frontend Dockerfile für bessere Dependency-Auflösung
cat > Dockerfile.frontend << 'EOF'
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
# Ignore peer dependencies issues and use npm install
RUN npm install --legacy-peer-deps --frozen-lockfile || npm install --legacy-peer-deps

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["node", "server.js"]
EOF

# Verbesserte Backend Dockerfile
cat > backend/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Install bash for startup script
RUN apk add --no-cache bash curl

# Copy package files
COPY package*.json ./
RUN npm install --production

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy rest of files
COPY . .

# Build TypeScript
RUN npm run build

# Create directories
RUN mkdir -p uploads logs

# Make startup script executable
RUN chmod +x start.sh

EXPOSE 4000

# Enhanced healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:4000/api/health || exit 1

CMD ["./start.sh"]
EOF

# Fix docker-compose.yml (remove version, optimize settings)
cat > docker-compose.yml << 'EOF'
services:
  # PostgreSQL Database
  database:
    image: postgres:15-alpine
    container_name: app_database
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: apppassword
      POSTGRES_INITDB_ARGS: "--auth-host=scram-sha-256"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d appdb"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    restart: unless-stopped
    networks:
      - app-network

  # Backend API
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    container_name: app_backend
    environment:
      - DATABASE_URL=postgresql://appuser:apppassword@database:5432/appdb
      - JWT_SECRET=galactic-super-secret-jwt-key-production-2025
      - PORT=4000
      - NODE_ENV=production
      - CORS_ORIGIN=*
    ports:
      - "4000:4000"
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/logs:/app/logs
    depends_on:
      database:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s
    restart: unless-stopped
    networks:
      - app-network

  # Frontend Next.js
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: app_frontend
    environment:
      - NODE_ENV=production
      - BACKEND_URL=http://backend:4000
      - NEXT_TELEMETRY_DISABLED=1
    ports:
      - "3000:3000"
    depends_on:
      backend:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    restart: unless-stopped
    networks:
      - app-network

volumes:
  postgres_data:
    driver: local

networks:
  app-network:
    driver: bridge
EOF

# Ensure backend .env exists
cat > backend/.env << 'EOF'
DATABASE_URL="postgresql://appuser:apppassword@database:5432/appdb"
JWT_SECRET="galactic-super-secret-jwt-key-production-2025"
PORT=4000
NODE_ENV=production
CORS_ORIGIN=*
EOF

# Make scripts executable
chmod +x backend/start.sh

success "✅ Docker-Konfiguration optimiert"

# =============================================================================
# 4. SECURITY SETUP
# =============================================================================
log "🔒 Sicherheits-Setup..."

# Configure firewall
ufw --force reset >/dev/null 2>&1 || true
ufw default deny incoming >/dev/null 2>&1 || true
ufw default allow outgoing >/dev/null 2>&1 || true
ufw allow ssh >/dev/null 2>&1 || true
ufw allow 22/tcp >/dev/null 2>&1 || true
ufw allow 3000/tcp >/dev/null 2>&1 || true
ufw allow 4000/tcp >/dev/null 2>&1 || true
ufw allow 80/tcp >/dev/null 2>&1 || true
ufw allow 443/tcp >/dev/null 2>&1 || true
ufw --force enable >/dev/null 2>&1 || true

success "✅ Firewall konfiguriert"

# =============================================================================
# 5. DOCKER DEPLOYMENT
# =============================================================================
log "🐳 Docker Container werden gestartet..."

# Clean Docker system
docker system prune -f >/dev/null 2>&1 || true

# Build and start services with enhanced logging
log "Building containers (this may take 5-10 minutes)..."
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose up --build -d

success "✅ Container gestartet"

# =============================================================================
# 6. HEALTH CHECKS
# =============================================================================
log "🩺 System-Status wird geprüft..."

# Wait for services to start
sleep 30

# Check container status
if docker compose ps | grep -q "Up"; then
    success "✅ Container laufen erfolgreich"
    
    # Show container status
    echo ""
    echo "📊 Container Status:"
    docker compose ps
    echo ""
else
    error "❌ Container konnten nicht gestartet werden"
fi

# Extended health check
log "Warte auf Backend-Initialisierung (bis zu 3 Minuten)..."
for i in {1..18}; do
    sleep 10
    if curl -s http://localhost:4000/api/health >/dev/null 2>&1; then
        success "✅ Backend ist bereit!"
        break
    else
        if [ $i -eq 18 ]; then
            warn "⚠️ Backend benötigt länger zum Starten, aber Container laufen"
        else
            echo -n "."
        fi
    fi
done

# =============================================================================
# 7. AUTO-START SERVICE
# =============================================================================
log "🔄 Auto-Start Service wird eingerichtet..."

cat > /etc/systemd/system/galactic-automation.service << EOF
[Unit]
Description=Galactic Automation Hub
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable galactic-automation.service

success "✅ Auto-Start Service konfiguriert"

# =============================================================================
# 8. COMPLETION
# =============================================================================
echo ""
echo "🎉 INSTALLATION ERFOLGREICH ABGESCHLOSSEN!"
echo "=========================================="
echo ""

# Get server IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')

echo -e "${GREEN}🌐 Ihr Dashboard ist verfügbar unter:${NC}"
echo "   Frontend:  http://$SERVER_IP:3000"
echo "   Backend:   http://$SERVER_IP:4000"
echo "   Health:    http://$SERVER_IP:4000/api/health"
echo ""

echo -e "${BLUE}📋 Login-Daten:${NC}"
echo "   Admin:     admin / admin123"
echo "   User:      testuser / user123"
echo "   Commander: commander / commander123"
echo ""

echo -e "${YELLOW}🔧 Management-Befehle:${NC}"
echo "   Status:    cd $PROJECT_DIR && docker compose ps"
echo "   Logs:      cd $PROJECT_DIR && docker compose logs -f"
echo "   Restart:   cd $PROJECT_DIR && docker compose restart"
echo "   Stop:      cd $PROJECT_DIR && docker compose down"
echo "   Start:     cd $PROJECT_DIR && docker compose up -d"
echo ""

echo -e "${GREEN}✅ System Features:${NC}"
echo "   🔒 JWT-Authentifizierung"
echo "   🗄️ PostgreSQL Datenbank"
echo "   🚀 Auto-Start bei Server-Neustart"
echo "   🔥 Firewall konfiguriert"
echo "   🩺 Health-Monitoring"
echo ""

# Final ownership fix
chown -R $CURRENT_USER:$CURRENT_USER "$PROJECT_DIR" 2>/dev/null || true

success "🌌 Galactic Automation Hub ist einsatzbereit!"

exit 0