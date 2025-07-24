#!/bin/bash
set -e

# =============================================================================
# 🚀 Galactic Automation Hub - Auto Installation Script
# =============================================================================
# Dieses Script installiert alles Notwendige und startet die Anwendung
# 
# Usage: 
#   1. Script nach /var/www kopieren
#   2. chmod +x auto-install.sh
#   3. sudo ./auto-install.sh
# =============================================================================

echo "🌌 Galactic Automation Hub - Auto Installation"
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

# Variables
PROJECT_DIR="/var/www/galactic-automation-hub"
GITHUB_URL="https://github.com/felge88/galactic-automation-hub"
CURRENT_USER="${SUDO_USER:-$USER}"

log "🔧 System wird vorbereitet..."

# =============================================================================
# 1. SYSTEM UPDATE & BASIC TOOLS
# =============================================================================
log "📦 System-Update und Basis-Tools installieren..."

apt update && apt upgrade -y
apt install -y curl wget git ufw htop nano vim software-properties-common apt-transport-https ca-certificates gnupg lsb-release

log "✅ System aktualisiert und Basis-Tools installiert"

# =============================================================================
# 2. FIREWALL SETUP
# =============================================================================
log "🔥 Firewall konfigurieren..."

# Reset firewall
ufw --force reset

# Basic rules
ufw default deny incoming
ufw default allow outgoing

# Allow essential services
ufw allow ssh
ufw allow 22/tcp
ufw allow 3000/tcp    # Frontend
ufw allow 4000/tcp    # Backend (optional)
ufw allow 80/tcp      # HTTP
ufw allow 443/tcp     # HTTPS

# Enable firewall
ufw --force enable

log "✅ Firewall konfiguriert"

# =============================================================================
# 3. DOCKER INSTALLATION
# =============================================================================
log "🐳 Docker installieren..."

# Remove old Docker versions
apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Install Docker Compose (falls nicht schon dabei)
apt install -y docker-compose-plugin

# Add user to docker group
usermod -aG docker $CURRENT_USER

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Test Docker installation
docker --version || error "Docker-Installation fehlgeschlagen"
docker compose version || error "Docker Compose-Installation fehlgeschlagen"

log "✅ Docker erfolgreich installiert"

# =============================================================================
# 4. PROJECT SETUP
# =============================================================================
log "📁 Projekt-Setup..."

# Remove existing directory if it exists
if [ -d "$PROJECT_DIR" ]; then
    warn "Existierendes Projekt-Verzeichnis wird entfernt..."
    rm -rf "$PROJECT_DIR"
fi

# Clone project
log "📥 Projekt von GitHub klonen..."
git clone "$GITHUB_URL" "$PROJECT_DIR"

# Change to project directory
cd "$PROJECT_DIR"

# Set correct ownership
chown -R $CURRENT_USER:$CURRENT_USER "$PROJECT_DIR"

log "✅ Projekt erfolgreich geklont"

# =============================================================================
# 5. NODE.JS DEPENDENCIES FIX
# (Entfernt, da alles über Docker läuft)

# =============================================================================
# 6. SECURITY CONFIGURATION
# =============================================================================
log "🔒 Sicherheitskonfiguration..."

# Generate secure JWT secret
JWT_SECRET=$(openssl rand -base64 64)

# Update .env file
log "🔑 JWT Secret generieren und konfigurieren..."
if [ -f "backend/.env" ]; then
    sed -i "s/JWT_SECRET=.*/JWT_SECRET=\"$JWT_SECRET\"/" backend/.env
    log "✅ JWT Secret aktualisiert"
else
    warn ".env Datei nicht gefunden, wird übersprungen"
fi

# (Keine weiteren Skripte mehr ausführbar machen nötig)

log "✅ Sicherheitskonfiguration abgeschlossen"

# =============================================================================
# 7. APPLICATION DEPLOYMENT
# =============================================================================
log "🚀 Anwendung wird deployed..."

# Stop any existing containers
docker compose down 2>/dev/null || true

# Build and start application
log "🔨 Container werden gebaut und gestartet..."
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose up --build -d

# Wait for services to be ready
log "⏳ Warte auf Service-Start..."
sleep 30

log "✅ Deployment abgeschlossen"

# =============================================================================
# 8. HEALTH CHECK
# =============================================================================
log "🩺 System-Health-Check..."

# Check if containers are running
if docker compose ps | grep -q "Up"; then
    log "✅ Container laufen erfolgreich"
else
    error "❌ Container-Start fehlgeschlagen"
fi

# Check backend health (with retries)
log "⏳ Backend Health-Check (kann bis zu 2 Minuten dauern)..."
for i in {1..12}; do
    sleep 10
    if curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
        log "✅ Backend-Health-Check erfolgreich"
        break
    else
        if [ $i -eq 12 ]; then
            warn "⚠️  Backend-Health-Check fehlgeschlagen (Services starten möglicherweise noch)"
        else
            echo -n "."
        fi
    fi
done

# =============================================================================
# 9. SYSTEM SERVICE SETUP (Auto-Start)
# =============================================================================
log "🔄 Auto-Start Service einrichten..."

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

# Enable auto-start service
systemctl daemon-reload
systemctl enable galactic-automation.service

log "✅ Auto-Start Service eingerichtet"

# =============================================================================
# 10. NGINX SETUP (OPTIONAL)
# =============================================================================
read -p "🌐 Möchten Sie Nginx Reverse Proxy installieren? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log "🌐 Nginx Reverse Proxy wird installiert..."
    
    # Install Nginx
    apt install -y nginx certbot python3-certbot-nginx
    
    # Create Nginx config
    cat > /etc/nginx/sites-available/galactic-automation << EOF
server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    # Enable site
    ln -sf /etc/nginx/sites-available/galactic-automation /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default

    # Test and start Nginx
    nginx -t && systemctl restart nginx && systemctl enable nginx
    
    # Update firewall for Nginx
    ufw delete allow 3000/tcp 2>/dev/null || true
    ufw delete allow 4000/tcp 2>/dev/null || true
    ufw allow 'Nginx Full'
    
    log "✅ Nginx Reverse Proxy installiert"
    
    echo ""
    echo "🌐 Nginx ist konfiguriert. Für SSL-Setup führen Sie aus:"
    echo "   sudo certbot --nginx -d ihre-domain.com"
fi

# =============================================================================
# 11. COMPLETION SUMMARY
# =============================================================================
echo ""
echo "🎉 Installation erfolgreich abgeschlossen!"
echo "=========================================="
echo ""

# Get server IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')

echo -e "${GREEN}🔗 Ihre Anwendung ist verfügbar unter:${NC}"
if systemctl is-active --quiet nginx; then
    echo "   Frontend: http://$SERVER_IP"
    echo "   Backend:  http://$SERVER_IP/api"
else
    echo "   Frontend: http://$SERVER_IP:3000"
    echo "   Backend:  http://$SERVER_IP:4000"
fi
echo ""

echo -e "${BLUE}📋 Demo-Zugangsdaten:${NC}"
echo "   Admin:     admin / admin123"
echo "   User:      testuser / user123"
echo "   Commander: commander / commander123"
echo ""

echo -e "${YELLOW}🔧 Nützliche Befehle:${NC}"
echo "   Status prüfen:     cd $PROJECT_DIR && docker compose ps"
echo "   Logs anzeigen:     cd $PROJECT_DIR && docker compose logs -f"
echo "   Neustarten:        cd $PROJECT_DIR && docker compose restart"
echo "   Health-Check:      curl http://localhost:4000/api/health"
echo ""

echo -e "${GREEN}🚀 System-Services:${NC}"
echo "   ✅ Docker installiert und gestartet"
echo "   ✅ Firewall konfiguriert"
echo "   ✅ Auto-Start Service aktiviert"
echo "   ✅ Anwendung läuft"
if systemctl is-active --quiet nginx; then
    echo "   ✅ Nginx Reverse Proxy aktiv"
fi
echo ""

echo -e "${BLUE}📁 Projekt-Verzeichnis:${NC} $PROJECT_DIR"
echo -e "${BLUE}🗂️  Logs-Verzeichnis:${NC} $PROJECT_DIR/backend/logs"
echo ""

# Final health check
log "🔍 Finale System-Überprüfung..."
sleep 5

if curl -s http://localhost:4000/api/health | grep -q "ok" 2>/dev/null; then
    echo -e "${GREEN}✅ System läuft perfekt!${NC}"
else
    echo -e "${YELLOW}⚠️  System startet noch, bitte warten Sie 1-2 Minuten und prüfen Sie: http://$SERVER_IP:3000${NC}"
fi

echo ""
echo "🌌 Galactic Automation Hub ist einsatzbereit!"
echo "   Viel Spaß mit Ihrer neuen Anwendung! 🚀"
echo ""

# Ownership fix für den Fall, dass sudo verwendet wurde
chown -R $CURRENT_USER:$CURRENT_USER "$PROJECT_DIR" 2>/dev/null || true

exit 0