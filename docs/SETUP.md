# First Setup – Einmalige Einrichtung

Diese Anleitung führt dich einmalig durch die lokale Einrichtung von **Battleship Battle Royale**.

---

## 1. Voraussetzungen prüfen

Stelle sicher, dass folgende Tools installiert sind:
* **Git**
* **Java JDK 21** (oder neuer) – im Terminal prüfen mit `java -version`
* **Node.js** (Version 20 oder neuer) – im Terminal prüfen mit `node -v`

---

## 2. Repository klonen

Öffne ein Terminal in deinem gewünschten Projektordner und klone das Repository:

```bash
git clone https://github.com/AlexanderFlach/SWE-Schiffe-Versenken.git
cd SWE-Schiffe-Versenken
```

---

## 3. Backend einrichten & testen (Terminal 1)

Wechsle in den `backend`-Ordner und starte Spring Boot (beim ersten Start lädt Maven automatisch alle Abhängigkeiten herunter):

```bash
cd backend
```

* **Windows (PowerShell / CMD):**
  ```powershell
  .\mvnw.cmd spring-boot:run
  ```
* **macOS / Linux / Git Bash:**
  ```bash
  chmod +x mvnw && ./mvnw spring-boot:run
  ```

**Prüfung:** Sobald im Terminal `Started BackendApplication` erscheint, öffne im Browser `http://localhost:8080/api/health`. Wenn `{"status":"OK","game":"Battleship Battle Royale"}` angezeigt wird, läuft das Backend. Lass dieses Terminal einfach offen.

---

## 4. Frontend einrichten & testen (Terminal 2)

Öffne ein **zweites Terminal** im Hauptordner `SWE-Schiffe-Versenken` und installiere die Node-Pakete:

```bash
cd frontend
npm install
npm run dev
```

**Prüfung:** Öffne im Browser `http://localhost:5173`. Steht dort **„Verbunden: Battleship Battle Royale (OK)“**, funktioniert die Verbindung zwischen Frontend und Backend.

---

## 5. Wichtige Hinweise für die Entwicklung

* **Vite-Version nicht ändern:** Führe **kein** `npm audit fix --force` und kein Upgrade auf Vite 8 aus. Wir nutzen bewusst Vite 6, um Native-Binding-Fehler unter Windows/Node 20 zu vermeiden.
* **VS Code Java-Pfad:** Falls deine IDE beim Öffnen von Java-Dateien Paketfehler anzeigt (`expected package "main.java.com..."`), mache einen Rechtsklick auf `backend/pom.xml` → **Reload project**.
* **Git-Workflow:** Nie direkt auf `main` pushen. Erstelle für jede Aufgabe einen eigenen Branch (`feat/be-<feature>`, `feat/fe-<feature>` oder `art/<asset>`).