# 🚀 Production Server Setup - Ubuntu 22.04

## ✅ **Ist das Projekt server-ready?**
**JA!** Das Projekt ist vollständig produktionsbereit und läuft sofort auf einem frischen Ubuntu 22.04 Server.

## 🖥️ **Komplette Anleitung für frischen Ubuntu 22.04 Server**

### **Schritt 1: Server grundlegend vorbereiten (5 Minuten)**

```bash
# 1. System aktualisieren
sudo apt update && sudo apt upgrade -y

# 2. Grundtools installieren
sudo apt install -y curl wget git ufw htop

# 3. Firewall konfigurieren
sudo ufw allow ssh
sudo ufw allow 3000/tcp    # Frontend
sudo ufw allow 4000/tcp    # Backend API (optional)
sudo ufw allow 80/tcp      # HTTP (für Nginx, optional)
sudo ufw allow 443/tcp     # HTTPS (für SSL, optional)
sudo ufw --force enable

# 4. Firewall-Status prüfen
sudo ufw status
```

### **Schritt 2: Docker installieren (einzige Voraussetzung!)**

```bash
# Docker installieren
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# User zu Docker-Gruppe hinzufügen
sudo usermod -aG docker $USER

# Docker Compose (normalerweise schon dabei)
sudo apt install -y docker-compose-plugin

# Logout/Login oder Gruppe neu laden
newgrp docker

# Installation testen
docker --version
docker compose version
```

### **Schritt 3: Anwendung deployen (2 Minuten)**

```bash
# Repository klonen
git clone <your-repository-url>
cd <project-directory>

# WICHTIG: Sicherheitskonfiguration für Production
nano backend/.env
# Ändern Sie unbedingt:
# JWT_SECRET="IHR-SUPER-SICHERES-GEHEIMES-SECRET-HIER"

# Anwendung starten
docker compose down && docker compose up --build -d
```

### **Schritt 4: Status prüfen**

```bash
# Container-Status prüfen
docker compose ps

# Logs anzeigen
docker compose logs -f

# Health-Check
curl http://localhost:4000/api/health
```

## 🌍 **Internet-Erreichbarkeit**

### **✅ Sofort erreichbar unter:**
- **Frontend**: `http://IHRE-SERVER-IP:3000`
- **Backend**: `http://IHRE-SERVER-IP:4000`

### **🔍 Server-IP herausfinden:**
```bash
# Externe IP
curl ifconfig.me

# Interne IP
hostname -I
```

### **📋 Login-Test:**
- Username: `admin`
- Passwort: `admin123`

---

## 🔒 **Production-Optimierungen (optional)**

### **Option A: Nginx Reverse Proxy + SSL (empfohlen)**

```bash
# Nginx-Setup ausführen
./nginx-setup.sh

# Domain in Nginx-Config eintragen
sudo nano /etc/nginx/sites-available/app
# Ersetze "YOUR_DOMAIN.com" mit Ihrer Domain

# SSL-Zertifikat installieren
sudo certbot --nginx -d ihre-domain.com -d www.ihre-domain.com

# Firewall für Nginx anpassen
sudo ufw delete allow 3000/tcp
sudo ufw delete allow 4000/tcp
sudo ufw allow 'Nginx Full'
```

**Nach SSL-Setup erreichbar unter:**
- `https://ihre-domain.com` (sicher)

### **Option B: Cloudflare Tunnel (noch einfacher)**

```bash
# Cloudflare Tunnel installieren
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Tunnel erstellen (folgen Sie den Anweisungen)
cloudflared tunnel login
cloudflared tunnel create myapp
cloudflared tunnel route dns myapp ihre-domain.com

# Tunnel-Config erstellen
mkdir -p ~/.cloudflared
cat > ~/.cloudflared/config.yml << EOF
tunnel: <TUNNEL-ID>
credentials-file: ~/.cloudflared/<TUNNEL-ID>.json

ingress:
  - hostname: ihre-domain.com
    service: http://localhost:3000
  - hostname: api.ihre-domain.com
    service: http://localhost:4000
  - service: http_status:404
EOF

# Tunnel starten
cloudflared tunnel run myapp
```

---

## 📊 **Systemanforderungen**

### **Minimal:**
- **RAM**: 2 GB
- **Storage**: 10 GB
- **CPU**: 1 vCore
- **OS**: Ubuntu 22.04 LTS

### **Empfohlen:**
- **RAM**: 4 GB
- **Storage**: 20 GB
- **CPU**: 2 vCores

---

## 🔧 **Wartung & Monitoring**

### **Container-Management:**
```bash
# Status prüfen
docker compose ps

# Logs anzeigen
docker compose logs -f backend
docker compose logs -f frontend

# Container neustarten
docker compose restart

# Updates deployen
git pull
docker compose down
docker compose up --build -d
```

### **Datenbank-Backup:**
```bash
# Backup erstellen
docker exec app_database pg_dump -U appuser appdb > backup-$(date +%Y%m%d).sql

# Backup wiederherstellen
docker exec -i app_database psql -U appuser appdb < backup.sql
```

### **System-Monitoring:**
```bash
# Ressourcen-Nutzung
docker stats

# Disk-Space
df -h

# System-Load
htop
```

---

## 🚨 **Troubleshooting**

### **Port bereits belegt:**
```bash
sudo lsof -i :3000
sudo lsof -i :4000
sudo kill -9 <PID>
```

### **Container startet nicht:**
```bash
docker compose logs backend
docker compose logs frontend
docker compose logs database
```

### **Speicher-Probleme:**
```bash
# Docker aufräumen
docker system prune -f

# Alte Images löschen
docker image prune -a
```

### **Datenbank-Reset (Vorsicht!):**
```bash
docker compose down -v
docker compose up --build -d
```

---

## ⚡ **Ein-Kommando-Setup für Experten**

```bash
# Alles in einem Kommando (nur für frische Server!)
curl -fsSL https://get.docker.com | sudo sh && \
sudo usermod -aG docker $USER && \
newgrp docker && \
git clone <your-repo> app && \
cd app && \
docker compose up --build -d
```

---

## 🎯 **Checkliste für Go-Live**

- [ ] Server grundlegend konfiguriert
- [ ] Docker installiert und funktionsfähig
- [ ] Anwendung deployed und läuft
- [ ] Firewall korrekt konfiguriert
- [ ] JWT_SECRET geändert
- [ ] Health-Check erfolgreich
- [ ] Login funktioniert
- [ ] Optional: SSL/Domain konfiguriert
- [ ] Backup-Strategie implementiert

---

## 📞 **Support**

Bei Problemen:
1. Logs prüfen: `docker compose logs -f`
2. Health-Check: `curl http://localhost:4000/api/health`
3. Container-Status: `docker compose ps`

**Das Projekt ist 100% server-ready! 🚀**