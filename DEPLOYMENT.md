# 🚀 Deployment-Anleitung

## Schnellstart für Ubuntu Server

```bash
# 1. Repository klonen
git clone <your-repo-url>
cd <project-directory>

# 2. Einmalig: Docker installieren (falls nicht vorhanden)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# 3. Anwendung starten
docker compose down && docker compose up --build -d

# 4. Status prüfen
docker compose ps
docker compose logs -f
```

## URLs nach Deployment

- **Frontend**: http://your-server-ip:3000
- **Backend API**: http://your-server-ip:4000
- **Health Check**: http://your-server-ip:4000/api/health

## Demo-Zugangsdaten

- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

## Sicherheits-Hinweise für Production

1. **JWT_SECRET ändern**:
```bash
nano backend/.env
# Starkes, zufälliges Secret generieren!
```

2. **Firewall konfigurieren**:
```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 3000/tcp # Frontend
sudo ufw allow 4000/tcp # Backend (optional, nur wenn direkt erreichbar)
sudo ufw enable
```

3. **SSL/TLS hinzufügen** (empfohlen):
   - Reverse Proxy mit Nginx/Apache
   - Let's Encrypt Zertifikate
   - HTTPS-Weiterleitung

## Wartung

```bash
# Logs anzeigen
docker compose logs -f

# Container neustarten
docker compose restart

# Update deployen
git pull
docker compose down
docker compose up --build -d

# Datenbank-Backup
docker exec app_database pg_dump -U appuser appdb > backup-$(date +%Y%m%d).sql

# Cleanup (vorsichtig verwenden!)
docker system prune -f
```

## Troubleshooting

### Port bereits belegt
```bash
sudo lsof -i :3000
sudo lsof -i :4000
sudo kill -9 <PID>
```

### Container startet nicht
```bash
docker compose logs <service-name>
docker compose restart <service-name>
```

### Datenbankprobleme
```bash
# Container neustarten
docker compose restart database

# Volume löschen (VORSICHT: Datenverlust!)
docker compose down -v
docker compose up --build -d
```