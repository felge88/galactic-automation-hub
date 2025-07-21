# Full-Stack Application - Frontend & Backend

Ein vollständiges Full-Stack-Projekt mit Next.js Frontend und Express.js Backend, bereit für Docker-Deployment.

## 🚀 Schnellstart (Docker)

```bash
# Projekt klonen und in Verzeichnis wechseln
git clone <repository-url>
cd <project-directory>

# Docker Compose starten
docker compose down && docker compose up --build -d
```

Das war's! Die Anwendung ist unter folgenden URLs verfügbar:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Database**: PostgreSQL auf Port 5432

## 📋 Demo-Zugangsdaten

- **Admin**: admin / admin123 (ADMIN-Rolle)
- **User**: testuser / user123 (USER-Rolle)
- **Commander**: commander / commander123 (ADMIRAL-Rolle)

## 🏗️ Projektstruktur

```
├── app/                    # Next.js App Router
├── components/             # React Komponenten
├── lib/                    # Utility-Funktionen & API-Client
├── types/                  # TypeScript Type-Definitionen
├── backend/                # Express.js Backend
│   ├── src/               # Backend Quellcode
│   │   ├── controllers/   # Route-Controller
│   │   ├── middlewares/   # Express Middlewares
│   │   ├── routes/        # API-Routen
│   │   └── utils/         # Utility-Funktionen
│   ├── prisma/            # Prisma ORM
│   │   ├── schema.prisma  # Datenbankschema
│   │   ├── migrations/    # Datenbank-Migrationen
│   │   └── seed.ts        # Seed-Daten
│   └── Dockerfile         # Backend Container
├── docker-compose.yml     # Orchestrierung
└── Dockerfile.frontend    # Frontend Container
```

## 🛠️ Technologie-Stack

### Frontend
- **Next.js 14** - React Framework mit App Router
- **TypeScript** - Type-sichere Entwicklung
- **Tailwind CSS** - Utility-first CSS Framework
- **Radix UI** - Zugängliche UI-Komponenten
- **React Hook Form** - Formular-Management
- **Zod** - Schema-Validierung

### Backend
- **Express.js** - Web-Framework für Node.js
- **TypeScript** - Type-sichere Entwicklung
- **Prisma ORM** - Type-safe Datenbankzugriff
- **PostgreSQL** - Relationale Datenbank
- **JWT** - Authentifizierung (24h Token-Gültigkeit)
- **bcryptjs** - Passwort-Hashing
- **Socket.io** - Echzeit-Kommunikation

### DevOps
- **Docker** - Containerisierung
- **Docker Compose** - Multi-Container-Orchestrierung
- **PostgreSQL 15** - Production-ready Datenbank

## 🔧 Lokale Entwicklung

### Voraussetzungen
- Node.js 18+
- npm oder pnpm
- Docker (optional für Datenbank)

### Backend-Entwicklung

```bash
cd backend

# Dependencies installieren
npm install

# Umgebungsvariablen kopieren
cp .env.example .env

# Datenbank starten (Docker)
docker run --name postgres-dev -e POSTGRES_PASSWORD=password -e POSTGRES_DB=appdb -p 5432:5432 -d postgres:15

# Prisma Setup
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

# Development-Server starten
npm run dev
```

### Frontend-Entwicklung

```bash
# Im Hauptverzeichnis
npm install

# Umgebungsvariablen kopieren
cp .env.local.example .env.local

# Development-Server starten
npm run dev
```

## 🔐 Umgebungsvariablen

### Backend (.env)
```env
DATABASE_URL="postgresql://appuser:apppassword@localhost:5432/appdb"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
BACKEND_URL=http://backend:4000
```

## 📊 API-Dokumentation

### Authentifizierung
- `POST /api/login` - Benutzer-Login (username/password)
- `POST /api/register` - Benutzer-Registrierung (username/email/password/name)
- `GET /api/user/me` - Aktueller Benutzer (Auth erforderlich)

### Benutzer-Management (Admin)
- `GET /api/users` - Alle Benutzer
- `POST /api/users` - Neuen Benutzer erstellen
- `PUT /api/users/:id` - Benutzer aktualisieren
- `DELETE /api/users/:id` - Benutzer löschen

### System
- `GET /api/health` - Health Check

Alle geschützten Routen erfordern einen `Authorization: Bearer <token>` Header.

## 🐳 Docker-Konfiguration

### Services
1. **PostgreSQL Database** - Port 5432
   - Persistente Daten über Volume
   - Health Checks
   
2. **Backend API** - Port 4000
   - Automatische Prisma-Migration
   - Health Checks
   - Wartet auf Datenbank

3. **Frontend** - Port 3000
   - Optimierter Multi-Stage Build
   - Wartet auf Backend

### Volumes
- `postgres_data` - Persistente Datenbankdaten

### Netzwerk
- `app-network` - Interne Kommunikation zwischen Services

## 🔒 Sicherheit

- **CORS** - Konfiguriert für Frontend-Domain
- **Helmet** - Sicherheits-Headers
- **Rate Limiting** - Schutz vor Brute-Force
- **JWT** - Sichere Authentifizierung (24h Gültigkeit)
- **bcrypt** - Passwort-Hashing mit Salt
- **Input-Validierung** - Zod-Schema-Validierung
- **Unique Constraints** - Username und Email müssen eindeutig sein

## 📈 Production-Deployment

### Server-Anforderungen
- 2 GB RAM (minimal)
- 10 GB Speicher
- Docker & Docker Compose

### Deployment-Schritte

1. **Repository klonen**
```bash
git clone <repository-url>
cd <project-directory>
```

2. **Umgebungsvariablen anpassen**
```bash
# Backend
nano backend/.env
# Sichere JWT_SECRET generieren!

# Frontend (falls nötig)
nano .env.local
```

3. **Container starten**
```bash
docker compose down && docker compose up --build -d
```

4. **Logs prüfen**
```bash
docker compose logs -f
```

### Backup & Restore

```bash
# Datenbank-Backup
docker exec app_database pg_dump -U appuser appdb > backup.sql

# Datenbank-Restore
docker exec -i app_database psql -U appuser appdb < backup.sql
```

## 🐛 Troubleshooting

### Container startet nicht
```bash
# Logs prüfen
docker compose logs backend
docker compose logs frontend
docker compose logs database
```

### Datenbank-Verbindung fehlgeschlagen
```bash
# Container neu starten
docker compose restart database
docker compose restart backend
```

### Frontend kann Backend nicht erreichen
- CORS-Konfiguration prüfen
- Umgebungsvariablen prüfen
- Netzwerk-Konfiguration prüfen

### Port bereits belegt
```bash
# Andere Services auf Ports prüfen
sudo lsof -i :3000
sudo lsof -i :4000
sudo lsof -i :5432
```

## 🔄 Updates

```bash
# Code aktualisieren
git pull

# Container neu builden und starten
docker compose down
docker compose up --build -d
```

## 📝 Changelog

### v1.1.0
- **Username-basiertes Login** statt Email
- **Erweiterte Demo-User** (Admin, User, Commander)
- **Verbesserte Authentifizierung** mit 24h Token-Gültigkeit
- **Unique Constraints** für Username und Email

### v1.0.0
- Vollständige Docker-Integration
- PostgreSQL statt SQLite
- Optimierte Multi-Stage Builds
- Health Checks für alle Services
- Automatische Prisma-Migrationen
- Production-ready Konfiguration

## 📄 Lizenz

MIT License - Siehe LICENSE-Datei für Details.

## 🤝 Support

Bei Problemen erstellen Sie bitte ein Issue im Repository oder kontaktieren Sie das Entwicklungsteam.