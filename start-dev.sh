#!/bin/bash
set -e

echo "🚀 Starting Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start PostgreSQL in Docker for development
echo "🗄️ Starting PostgreSQL database..."
docker run --name postgres-dev \
    -e POSTGRES_DB=appdb \
    -e POSTGRES_USER=appuser \
    -e POSTGRES_PASSWORD=apppassword \
    -p 5432:5432 \
    -d postgres:15-alpine || echo "Database container already exists"

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Setup Backend
echo "🔧 Setting up Backend..."
cd backend

# Install dependencies if not exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Setup Prisma
echo "🔄 Setting up Prisma..."
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

# Start backend in background
echo "🚀 Starting backend server..."
npm run dev &
BACKEND_PID=$!

cd ..

# Setup Frontend
echo "🎨 Setting up Frontend..."

# Install dependencies if not exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend
echo "🌐 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development environment is ready!"
echo ""
echo "🔗 Available URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:4000"
echo "   Database: postgresql://appuser:apppassword@localhost:5432/appdb"
echo ""
echo "📋 Demo Credentials:"
echo "   Admin: admin / admin123 (ADMIN)"
echo "   User:  testuser / user123 (USER)"
echo "   Commander: commander / commander123 (ADMIRAL)"
echo ""
echo "To stop all services, press Ctrl+C"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID