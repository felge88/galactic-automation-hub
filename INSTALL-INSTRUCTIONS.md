# 🚀 Ein-Klick Installation - Galactic Automation Hub

## 📥 **Schnellste Installation (3 Befehle)**

```bash
# 1. Script herunterladen
cd /var/www
sudo wget https://raw.githubusercontent.com/felge88/galactic-automation-hub/main/auto-install.sh

# 2. Ausführbar machen
sudo chmod +x auto-install.sh

# 3. Installation starten
sudo ./auto-install.sh
```

**Das war's!** 🎉

---

## 🎯 **Was macht das Script?**

### ✅ **Automatisch installiert:**
- ✅ System-Updates (Ubuntu 22.04)
- ✅ Docker & Docker Compose
- ✅ Firewall-Konfiguration
- ✅ Projekt von GitHub
- ✅ Sichere JWT-Schlüssel
- ✅ Auto-Start Service
- ✅ Optional: Nginx Reverse Proxy

### 🔧 **Konfiguriert automatisch:**
- Ports: 3000 (Frontend), 4000 (Backend)
- Firewall: SSH, HTTP, HTTPS
- Auto-Start: Bei Server-Neustart
- Sicherheit: Starke JWT-Secrets

---

## 🌍 **Nach der Installation verfügbar unter:**

- **Frontend**: `http://IHRE-SERVER-IP:3000`
- **Backend**: `http://IHRE-SERVER-IP:4000`

### 📋 **Login-Daten:**
- **Admin**: `admin` / `admin123`
- **User**: `testuser` / `user123`
- **Commander**: `commander` / `commander123`

---

## 🛠️ **Alternative: Manueller Download**

Falls Sie das Script erst prüfen möchten:

```bash
# Script herunterladen und anzeigen
wget https://raw.githubusercontent.com/felge88/galactic-automation-hub/main/auto-install.sh
cat auto-install.sh

# Dann ausführen
sudo chmod +x auto-install.sh
sudo ./auto-install.sh
```

---

## 📊 **System-Anforderungen**

- **OS**: Ubuntu 22.04 LTS (frisch installiert)
- **RAM**: Mindestens 2 GB
- **Storage**: Mindestens 10 GB
- **Internet**: Für Downloads erforderlich

---

## 🔧 **Nach der Installation**

### **Status prüfen:**
```bash
cd /var/www/galactic-automation-hub
docker compose ps
```

### **Logs anzeigen:**
```bash
cd /var/www/galactic-automation-hub
docker compose logs -f
```

### **Neustarten:**
```bash
cd /var/www/galactic-automation-hub
docker compose restart
```

---

## 🚨 **Troubleshooting**

### **Script-Fehler:**
```bash
# Logs prüfen
sudo journalctl -u galactic-automation.service

# Container-Status
cd /var/www/galactic-automation-hub
docker compose ps
docker compose logs
```

### **Port bereits belegt:**
```bash
sudo lsof -i :3000
sudo lsof -i :4000
```

### **Firewall-Probleme:**
```bash
sudo ufw status
sudo ufw allow 3000/tcp
sudo ufw allow 4000/tcp
```

---

## 🎉 **Fertig!**

Nach der Installation läuft Ihr **Galactic Automation Hub** automatisch und startet bei jedem Server-Neustart mit!

**Viel Spaß mit Ihrer neuen Anwendung!** 🌌🚀