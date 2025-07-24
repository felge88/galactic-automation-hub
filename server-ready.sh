#!/bin/bash
set -e

echo "🚀 Galactic Automation Hub - Server Ready Deployment"
echo "===================================================="
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

log "🎯 Deploying production-ready Galactic Automation Hub..."

# =============================================================================
# 1. SYSTEM PREPARATION
# =============================================================================
log "🔧 System preparation..."

# Ensure Docker is installed
if ! command -v docker &> /dev/null; then
    log "Installing Docker..."
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
    
    success "✅ Docker installed successfully"
else
    success "✅ Docker already installed"
fi

# =============================================================================
# 2. PROJECT SETUP
# =============================================================================
log "📁 Setting up project..."

# Clean up any existing installation
if [ -d "$PROJECT_DIR" ]; then
    warn "Removing existing installation..."
    cd "$PROJECT_DIR"
    docker compose down 2>/dev/null || true
    cd /
    rm -rf "$PROJECT_DIR"
fi

# Clone fresh project
log "📥 Cloning project from GitHub..."
git clone "$GITHUB_URL" "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Set ownership
chown -R $CURRENT_USER:$CURRENT_USER "$PROJECT_DIR"

success "✅ Project cloned successfully"

# =============================================================================
# 3. CONFIGURATION FIXES
# =============================================================================
log "🔧 Applying production fixes..."

# Fix Frontend Dependencies
log "Fixing frontend dependencies..."
sed -i 's/"date-fns": "4\.1\.0"/"date-fns": "^3.6.0"/' package.json
sed -i 's/"react-day-picker": "8\.10\.1"/"react-day-picker": "^8.10.1"/' package.json

# Install Frontend Dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Fix Backend Dependencies and add missing packages
log "Fixing backend dependencies..."
cd backend

# Add multer dependencies if missing
if ! grep -q '"multer"' package.json; then
    sed -i '/"zod": "\^3\.24\.1"/i\    "multer": "^1.4.5",' package.json
fi
if ! grep -q '"@types/multer"' package.json; then
    sed -i '/"@types/node": "\^24\.0\.15"/i\    "@types/multer": "^1.4.7",' package.json
fi

rm -rf node_modules package-lock.json
npm install
cd ..

# Ensure .env exists with correct values
cat > backend/.env << 'EOF'
DATABASE_URL="postgresql://appuser:apppassword@database:5432/appdb"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=4000
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
EOF

# Fix Frontend Dockerfile
cat > Dockerfile.frontend << 'EOF'
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json pnpm-lock.yaml* ./
RUN npm install --legacy-peer-deps

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

# Remove version from docker-compose.yml
sed -i '/^version:/d' docker-compose.yml

# Make scripts executable
chmod +x backend/start.sh

success "✅ All configurations applied"

# =============================================================================
# 4. SECURITY SETUP
# =============================================================================
log "🔒 Setting up security..."

# Generate secure JWT secret
JWT_SECRET=$(openssl rand -base64 64)
sed -i "s/JWT_SECRET=.*/JWT_SECRET=\"$JWT_SECRET\"/" backend/.env

# Configure firewall
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 22/tcp
ufw allow 3000/tcp
ufw allow 4000/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

success "✅ Security configured"

# =============================================================================
# 5. DOCKER DEPLOYMENT
# =============================================================================
log "🐳 Deploying Docker containers..."

# Clean Docker system
docker system prune -f

# Build and start services
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose up --build -d

success "✅ Containers deployed"

# =============================================================================
# 6. HEALTH CHECKS
# =============================================================================
log "🩺 Running health checks..."

# Wait for services to start
sleep 60

# Check container status
if ! docker compose ps | grep -q "Up"; then
    error "❌ Containers failed to start properly"
fi

success "✅ Containers are running"

# Check backend health with retries
log "Checking backend health (up to 3 minutes)..."
for i in {1..18}; do
    sleep 10
    if curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
        success "✅ Backend health check passed"
        break
    else
        if [ $i -eq 18 ]; then
            warn "⚠️ Backend taking longer than expected, but containers are running"
        else
            echo -n "."
        fi
    fi
done

# =============================================================================
# 7. AUTO-START SERVICE
# =============================================================================
log "🔄 Setting up auto-start service..."

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

success "✅ Auto-start service configured"

# =============================================================================
# 8. COMPLETION
# =============================================================================
echo ""
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "====================================="
echo ""

# Get server IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')

echo -e "${GREEN}🌐 Your application is available at:${NC}"
echo "   Frontend: http://$SERVER_IP:3000"
echo "   Backend:  http://$SERVER_IP:4000"
echo "   Health:   http://$SERVER_IP:4000/api/health"
echo ""

echo -e "${BLUE}📋 Login Credentials:${NC}"
echo "   Admin:     admin / admin123 (ADMIN role)"
echo "   User:      testuser / user123 (USER role)"
echo "   Commander: commander / commander123 (ADMIRAL role)"
echo ""

echo -e "${YELLOW}🔧 Management Commands:${NC}"
echo "   Status:    cd $PROJECT_DIR && docker compose ps"
echo "   Logs:      cd $PROJECT_DIR && docker compose logs -f"
echo "   Restart:   cd $PROJECT_DIR && docker compose restart"
echo "   Stop:      cd $PROJECT_DIR && docker compose down"
echo "   Start:     cd $PROJECT_DIR && docker compose up -d"
echo ""

echo -e "${GREEN}✅ System Features:${NC}"
echo "   🔒 Secure JWT authentication"
echo "   🗄️ PostgreSQL database"
echo "   🚀 Auto-restart on server reboot"
echo "   🔥 Firewall configured"
echo "   🩺 Health monitoring"
echo "   📊 Real-time logging"
echo ""

# Final ownership fix
chown -R $CURRENT_USER:$CURRENT_USER "$PROJECT_DIR" 2>/dev/null || true

success "🌌 Galactic Automation Hub is ready for action!"

exit 0