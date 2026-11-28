# Ausführen – Projekt starten

Je nachdem, ob du gerade entwickelst oder ihr gemeinsam im WLAN/LAN spielen wollt, gibt es zwei Start-Modi.

---

## Modus A: Entwicklungsmodus (Lokal programmieren)

Für die tägliche Entwicklung laufen Backend und Frontend getrennt, damit Änderungen im Frontend sofort sichtbar sind (Hot Reload).

### 1. Backend starten (Terminal 1)
```bash
cd backend
```
* **Windows:** `.\mvnw.cmd spring-boot:run`
* **macOS / Linux / Git Bash:** `./mvnw spring-boot:run`

*(Warten, bis `Started BackendApplication` im Terminal steht.)*

### 2. Frontend starten (Terminal 2)
```bash
cd frontend
npm run dev
```

### 3. Im Browser öffnen
* **Spiel / Frontend:** `http://localhost:5173`
* **Backend-Healthcheck:** `http://localhost:8080/api/health`

*(Hinweis: Nach Änderungen am Java-Backend muss Terminal 1 mit `Strg + C` gestoppt und neu gestartet werden.)*

---

## Modus B: LAN- / Multiplayer-Modus (Spielen im selben WLAN)

Beim gemeinsamen Spielen läuft **nur der Server auf einem Host-Laptop**. Alle anderen Mitspieler brauchen weder Terminal noch IDE, sondern öffnen das Spiel einfach im Browser.

### 1. Frontend in das Backend bauen (nur auf dem Host-Laptop)
```bash
cd frontend
npm run build
```
*(Erzeugt die fertige Web-App direkt unter `backend/src/main/resources/static/`.)*

### 2. Server starten (nur auf dem Host-Laptop)
```bash
cd ../backend
```
* **Windows:** `.\mvnw.cmd spring-boot:run`
* **macOS / Linux:** `./mvnw spring-boot:run`

### 3. Lokale IP-Adresse des Host-Laptops herausfinden
* **Windows:** `ipconfig` im Terminal ausführen → Wert bei **IPv4-Adresse** ablesen (z. B. `192.168.178.42`).
* **macOS / Linux:** `ifconfig` oder `ip a` ausführen → lokale WLAN-IP ablesen.

### 4. Beitreten (alle Spieler)
Alle Mitspieler im selben WLAN öffnen im Browser:
```text
http://<HOST-IP>:8080
```
*(Beispiel: `http://192.168.178.42:8080`)*

---

## Schnelle Hilfe bei Startproblemen

* **„Port 8080 was already in use“:** Es läuft noch eine alte Backend-Instanz im Hintergrund. Schließe das alte Terminal oder beende den Java-Prozess im Task-Manager / Aktivitätsanzeige.
* **Mitspieler erreichen den Host im LAN nicht:** Prüfe unter Windows, ob beim ersten Start die **Windows-Firewall** für Java/OpenJDK blockiert wurde, und erlaube den Zugriff für private Netzwerke.