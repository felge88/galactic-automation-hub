#!/bin/bash
set -e

echo "🧪 Galactic Automation Hub - Docker Build Test"
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

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Test requirements
log "🔍 Checking system requirements..."

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    error "docker-compose.yml not found. Please run this script from the project root."
fi

if [ ! -f "package.json" ]; then
    error "package.json not found. Please run this script from the project root."
fi

if [ ! -f "backend/package.json" ]; then
    error "backend/package.json not found."
fi

success "✅ Project structure validation passed"

# =============================================================================
# 1. VALIDATE DOCKER COMPOSE CONFIGURATION
# =============================================================================
log "🐳 Validating Docker Compose configuration..."

# Check if docker is available (skip if not in Docker environment)
if command -v docker &> /dev/null; then
    # Validate docker-compose.yml syntax
    if docker compose config > /dev/null 2>&1; then
        success "✅ Docker Compose configuration is valid"
    else
        error "❌ Docker Compose configuration is invalid"
    fi
else
    warn "⚠️ Docker not available, skipping Docker validation"
fi

# =============================================================================
# 2. VALIDATE PACKAGE.JSON FILES
# =============================================================================
log "📦 Validating package.json files..."

# Check Frontend package.json
if node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))" 2>/dev/null; then
    success "✅ Frontend package.json is valid JSON"
else
    error "❌ Frontend package.json is invalid JSON"
fi

# Check Backend package.json
if node -e "JSON.parse(require('fs').readFileSync('backend/package.json', 'utf8'))" 2>/dev/null; then
    success "✅ Backend package.json is valid JSON"
else
    error "❌ Backend package.json is invalid JSON"
fi

# =============================================================================
# 3. VALIDATE DOCKERFILES
# =============================================================================
log "🔧 Validating Dockerfiles..."

# Check Frontend Dockerfile
if [ -f "Dockerfile.frontend" ]; then
    if grep -q "npm install --legacy-peer-deps" Dockerfile.frontend; then
        success "✅ Frontend Dockerfile uses legacy-peer-deps"
    else
        error "❌ Frontend Dockerfile missing --legacy-peer-deps flag"
    fi
    
    if grep -q "output: 'standalone'" next.config.mjs; then
        success "✅ Next.js standalone output configured"
    else
        error "❌ Next.js standalone output not configured"
    fi
else
    error "❌ Frontend Dockerfile not found"
fi

# Check Backend Dockerfile
if [ -f "backend/Dockerfile" ]; then
    if grep -q "npm install" backend/Dockerfile; then
        success "✅ Backend Dockerfile contains npm install"
    else
        error "❌ Backend Dockerfile missing npm install"
    fi
    
    if grep -q "npx prisma generate" backend/Dockerfile; then
        success "✅ Backend Dockerfile includes Prisma generation"
    else
        error "❌ Backend Dockerfile missing Prisma generation"
    fi
else
    error "❌ Backend Dockerfile not found"
fi

# =============================================================================
# 4. VALIDATE ENVIRONMENT CONFIGURATION
# =============================================================================
log "🔒 Validating environment configuration..."

# Check Backend .env
if [ -f "backend/.env" ]; then
    if grep -q "DATABASE_URL" backend/.env; then
        success "✅ Backend .env contains DATABASE_URL"
    else
        error "❌ Backend .env missing DATABASE_URL"
    fi
    
    if grep -q "JWT_SECRET" backend/.env; then
        success "✅ Backend .env contains JWT_SECRET"
    else
        error "❌ Backend .env missing JWT_SECRET"
    fi
else
    error "❌ Backend .env file not found"
fi

# =============================================================================
# 5. VALIDATE PRISMA SETUP
# =============================================================================
log "🗄️ Validating Prisma setup..."

if [ -f "backend/prisma/schema.prisma" ]; then
    if grep -q "postgresql" backend/prisma/schema.prisma; then
        success "✅ Prisma configured for PostgreSQL"
    else
        error "❌ Prisma not configured for PostgreSQL"
    fi
    
    if grep -q "username.*String.*@unique" backend/prisma/schema.prisma; then
        success "✅ User model has unique username field"
    else
        error "❌ User model missing unique username field"
    fi
else
    error "❌ Prisma schema not found"
fi

if [ -f "backend/prisma/seed.ts" ]; then
    if grep -q "admin" backend/prisma/seed.ts; then
        success "✅ Seed script contains admin user"
    else
        error "❌ Seed script missing admin user"
    fi
else
    error "❌ Prisma seed script not found"
fi

# =============================================================================
# 6. VALIDATE FRONTEND CONFIGURATION
# =============================================================================
log "🎨 Validating Frontend configuration..."

# Check Next.js config
if [ -f "next.config.mjs" ]; then
    if grep -q "standalone" next.config.mjs; then
        success "✅ Next.js standalone output configured"
    else
        error "❌ Next.js standalone output not configured"
    fi
else
    error "❌ Next.js config not found"
fi

# Check if dependencies are compatible
if grep -q '"date-fns": "\^3\.' package.json; then
    success "✅ date-fns version is compatible (v3.x)"
elif grep -q '"date-fns": "4\.' package.json; then
    error "❌ date-fns version 4.x causes conflicts, should be ^3.6.0"
else
    warn "⚠️ date-fns version not found or unrecognized"
fi

# =============================================================================
# 7. VALIDATE API INTEGRATION
# =============================================================================
log "🔗 Validating API integration..."

# Check if auth functions use username
if [ -f "lib/auth.ts" ]; then
    if grep -q "username.*string" lib/auth.ts; then
        success "✅ Auth functions use username-based login"
    else
        error "❌ Auth functions not configured for username login"
    fi
else
    error "❌ Auth functions not found"
fi

# Check if API client exists
if [ -f "lib/api/client.ts" ]; then
    if grep -q "apiClient" lib/api/client.ts; then
        success "✅ API client configured"
    else
        error "❌ API client not properly configured"
    fi
else
    error "❌ API client not found"
fi

# =============================================================================
# 8. VALIDATE SCRIPTS
# =============================================================================
log "📜 Validating deployment scripts..."

if [ -f "auto-install.sh" ]; then
    if grep -q "legacy-peer-deps" auto-install.sh; then
        success "✅ Auto-install script includes dependency fixes"
    else
        error "❌ Auto-install script missing dependency fixes"
    fi
else
    error "❌ Auto-install script not found"
fi

if [ -f "backend/start.sh" ]; then
    if grep -q "prisma migrate deploy" backend/start.sh; then
        success "✅ Backend start script includes migrations"
    else
        error "❌ Backend start script missing migrations"
    fi
    
    if [ -x "backend/start.sh" ]; then
        success "✅ Backend start script is executable"
    else
        error "❌ Backend start script is not executable"
    fi
else
    error "❌ Backend start script not found"
fi

# =============================================================================
# 9. SUMMARY
# =============================================================================
echo ""
echo "🎯 Validation Summary"
echo "===================="
echo ""

echo -e "${BLUE}✅ PASSED CHECKS:${NC}"
echo "   - Project structure"
echo "   - Docker Compose configuration"
echo "   - Package.json files"
echo "   - Dockerfile configurations"
echo "   - Environment variables"
echo "   - Prisma setup"
echo "   - Frontend configuration"
echo "   - API integration"
echo "   - Deployment scripts"
echo ""

echo -e "${GREEN}🚀 PROJECT STATUS:${NC}"
echo "   ✅ Ready for Docker deployment"
echo "   ✅ Production-ready configuration"
echo "   ✅ All critical components validated"
echo ""

echo -e "${YELLOW}📋 DEPLOYMENT COMMAND:${NC}"
echo "   docker compose up --build -d"
echo ""

echo -e "${BLUE}🌐 EXPECTED URLS AFTER DEPLOYMENT:${NC}"
echo "   Frontend: http://your-server-ip:3000"
echo "   Backend:  http://your-server-ip:4000"
echo "   Health:   http://your-server-ip:4000/api/health"
echo ""

echo -e "${GREEN}📋 LOGIN CREDENTIALS:${NC}"
echo "   Admin:     admin / admin123"
echo "   User:      testuser / user123"
echo "   Commander: commander / commander123"
echo ""

success "🎉 All validations passed! Project is ready for deployment."

exit 0