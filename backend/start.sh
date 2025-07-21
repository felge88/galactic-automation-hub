#!/bin/bash
set -e

echo "🚀 Starting Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until npx prisma db execute --command "SELECT 1"; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Generate Prisma Client
echo "🔄 Generating Prisma Client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Seed database (only if empty)
echo "🌱 Seeding database..."
npx prisma db seed || echo "⚠️ Seeding failed or already seeded"

# Start the application
echo "🎯 Starting application..."
exec npm start