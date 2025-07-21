#!/bin/bash
set -e

echo "🚀 Starting Backend..."

# Wait for database to be ready with timeout
echo "⏳ Waiting for database connection..."
for i in {1..30}; do
  if npx prisma db execute --command "SELECT 1" >/dev/null 2>&1; then
    echo "✅ Database is ready!"
    break
  else
    echo "Database is unavailable - sleeping (attempt $i/30)"
    sleep 3
  fi
  
  if [ $i -eq 30 ]; then
    echo "❌ Database connection timeout after 90 seconds"
    exit 1
  fi
done

# Generate Prisma Client
echo "🔄 Generating Prisma Client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy || echo "⚠️ Migration failed, continuing..."

# Seed database (only if empty)
echo "🌱 Seeding database..."
npx prisma db seed || echo "⚠️ Seeding failed or already seeded"

# Create uploads directory if it doesn't exist
mkdir -p uploads/avatars

# Start the application
echo "🎯 Starting application..."
exec npm start