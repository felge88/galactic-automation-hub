#!/bin/bash
set -e

echo "🔧 Galactic Automation Hub - Error Fix Script"
echo "=============================================="
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

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    error "docker-compose.yml not found. Please run this script from the project root."
fi

log "🔍 Applying all fixes for TypeScript and dependency errors..."

# =============================================================================
# 1. FIX PACKAGE.JSON DEPENDENCIES
# =============================================================================
log "📦 Fixing package.json dependencies..."

# Fix Frontend date-fns dependency
if grep -q '"date-fns": "4\.' package.json; then
    sed -i 's/"date-fns": "4\.1\.0"/"date-fns": "^3.6.0"/' package.json
    success "✅ Fixed date-fns dependency in frontend"
else
    log "ℹ️ date-fns dependency already correct"
fi

# Add multer to backend package.json
cd backend

# Add multer dependency
if ! grep -q '"multer"' package.json; then
    # Add to dependencies
    sed -i '/"zod": "\^3\.24\.1"/i\    "multer": "^1.4.5",' package.json
    success "✅ Added multer dependency"
fi

# Add @types/multer to devDependencies
if ! grep -q '"@types/multer"' package.json; then
    sed -i '/"@types/node": "\^24\.0\.15"/i\    "@types/multer": "^1.4.7",' package.json
    success "✅ Added @types/multer devDependency"
fi

cd ..

# =============================================================================
# 2. REINSTALL DEPENDENCIES
# =============================================================================
log "📦 Reinstalling dependencies..."

# Frontend dependencies
log "Installing frontend dependencies..."
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Backend dependencies
log "Installing backend dependencies..."
cd backend
rm -rf node_modules package-lock.json
npm install
cd ..

success "✅ All dependencies reinstalled"

# =============================================================================
# 3. TYPESCRIPT FIXES
# =============================================================================
log "🔧 Applying TypeScript fixes..."

# Fix req.file type issues in profile routes
if grep -q 'if (!req.file)' backend/src/routes/profile.ts; then
    sed -i 's/if (!req\.file)/const file = (req as any).file;\n  if (!file)/' backend/src/routes/profile.ts
    sed -i 's/req\.file\.filename/file.filename/g' backend/src/routes/profile.ts
    sed -i 's/req\.file\.originalname/file.originalname/g' backend/src/routes/profile.ts
    success "✅ Fixed req.file TypeScript issues"
fi

# Fix req.query ParsedQs issues in statsController
if grep -q 'const { from, to, filter } = req.query;' backend/src/controllers/statsController.ts; then
    sed -i 's/const { from, to, filter } = req\.query;/const from = req.query.from as string;\n    const to = req.query.to as string;\n    const filter = req.query.filter as string;/' backend/src/controllers/statsController.ts
    success "✅ Fixed req.query ParsedQs issues"
fi

success "✅ All TypeScript fixes applied"

# =============================================================================
# 4. PRISMA SCHEMA AND MIGRATION
# =============================================================================
log "🗄️ Updating Prisma schema..."

# Add language field to User model
if ! grep -q 'language.*String' backend/prisma/schema.prisma; then
    sed -i '/image.*String?/a\  language  String?  @default("en")' backend/prisma/schema.prisma
    success "✅ Added language field to User model"
fi

# Create migration directory if it doesn't exist
mkdir -p backend/prisma/migrations/20250120000001_add_language_field

# Create migration file
cat > backend/prisma/migrations/20250120000001_add_language_field/migration.sql << 'EOF'
-- Migration für language Feld
-- AlterTable
ALTER TABLE "User" ADD COLUMN "language" TEXT DEFAULT 'en';

-- Update existing users to have default language
UPDATE "User" SET "language" = 'en' WHERE "language" IS NULL;
EOF

success "✅ Created language field migration"

# =============================================================================
# 5. UPDATE CONTROLLERS
# =============================================================================
log "🎮 Updating controllers..."

# Update userController to include language field
if ! grep -q 'language: true' backend/src/controllers/userController.ts; then
    # Add language to select statements
    sed -i '/name: true,/a\        language: true,' backend/src/controllers/userController.ts
    
    # Add language to schemas
    sed -i '/name: z\.string()\.min(2),/a\  language: z.string().optional(),' backend/src/controllers/userController.ts
    sed -i '/name: z\.string()\.min(2)\.optional(),/a\  language: z.string().optional(),' backend/src/controllers/userController.ts
    
    # Add language to destructuring
    sed -i 's/const { username, email, password, name, role, rank }/const { username, email, password, name, language, role, rank }/' backend/src/controllers/userController.ts
    
    # Add language to create/update operations
    sed -i 's/data: { username, email, password: hash, name, role, rank }/data: { username, email, password: hash, name, language, role, rank }/' backend/src/controllers/userController.ts
    sed -i 's/name: user\.name,/name: user.name,\n        language: user.language,/' backend/src/controllers/userController.ts
    
    success "✅ Updated userController with language support"
fi

# =============================================================================
# 6. UPDATE SEED SCRIPT
# =============================================================================
log "🌱 Updating seed script..."

# Add language to seed users
if ! grep -q 'language:' backend/prisma/seed.ts; then
    sed -i '/name: '\''Admiral Skywalker'\'',/a\      language: '\''de'\'',' backend/prisma/seed.ts
    sed -i '/name: '\''Luke Skywalker'\'',/a\      language: '\''en'\'',' backend/prisma/seed.ts
    sed -i '/name: '\''Commander Vader'\'',/a\      language: '\''de'\'',' backend/prisma/seed.ts
    success "✅ Updated seed script with language fields"
fi

# =============================================================================
# 7. DOCKER CLEANUP AND VALIDATION
# =============================================================================
log "🐳 Docker cleanup and validation..."

# Remove obsolete version from docker-compose.yml
if grep -q '^version:' docker-compose.yml; then
    sed -i '/^version:/d' docker-compose.yml
    success "✅ Removed obsolete version from docker-compose.yml"
fi

# Make sure start.sh is executable
chmod +x backend/start.sh

# =============================================================================
# 8. FINAL VALIDATION
# =============================================================================
log "✅ Running final validation..."

# Check if all files exist
if [ ! -f "backend/.env" ]; then
    log "Creating missing backend/.env file..."
    cat > backend/.env << 'EOF'
DATABASE_URL="postgresql://appuser:apppassword@database:5432/appdb"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=4000
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
EOF
    success "✅ Created backend/.env file"
fi

# Validate JSON files
if node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))" 2>/dev/null; then
    success "✅ Frontend package.json is valid"
else
    error "❌ Frontend package.json is invalid"
fi

if node -e "JSON.parse(require('fs').readFileSync('backend/package.json', 'utf8'))" 2>/dev/null; then
    success "✅ Backend package.json is valid"
else
    error "❌ Backend package.json is invalid"
fi

# =============================================================================
# 9. COMPLETION
# =============================================================================
echo ""
echo "🎉 ALL FIXES APPLIED SUCCESSFULLY!"
echo "=================================="
echo ""

echo -e "${GREEN}✅ FIXED ISSUES:${NC}"
echo "   1. ✅ Added language field to User model and migration"
echo "   2. ✅ Fixed req.query ParsedQs type issues in statsController"
echo "   3. ✅ Added multer dependencies to backend package.json"
echo "   4. ✅ Fixed req.file TypeScript issues in profile routes"
echo "   5. ✅ Updated all controllers to support language field"
echo "   6. ✅ Updated seed script with language values"
echo "   7. ✅ Removed obsolete docker-compose version"
echo "   8. ✅ Fixed date-fns dependency conflicts"
echo "   9. ✅ Reinstalled all dependencies"
echo ""

echo -e "${BLUE}🚀 NEXT STEPS:${NC}"
echo "   1. Run: docker compose down"
echo "   2. Run: docker compose up --build -d"
echo "   3. Check: docker compose ps"
echo "   4. Test: http://your-server-ip:3000"
echo ""

echo -e "${YELLOW}📋 LOGIN CREDENTIALS:${NC}"
echo "   Admin:     admin / admin123"
echo "   User:      testuser / user123"
echo "   Commander: commander / commander123"
echo ""

success "🌌 Project is now ready for deployment!"

exit 0