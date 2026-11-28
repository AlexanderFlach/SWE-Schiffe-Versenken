# AGENTS.md – Leitplanken für KI-Assistenten (Battleship Battle Royale)

Diese Datei definiert verbindliche Architektur-, Code- und Stilvorgaben für KI-gestützte Entwicklung (Gemini, Copilot, Cursor etc.) im Projekt **Battleship Battle Royale**. Halte dich strikt an diese Regeln.

---

## 1. Projektübersicht & Architektur

* **Spielkonzept:** Rundenbasiertes/Echtzeit-nahes Multiplayer-„Schiffe versenken“ im Battle-Royale-Modus für ein lokales Netzwerk (LAN/WLAN).
* **Team-Setup (7 Personen):** 3× Backend, 3× Frontend, 1× Pixel-Art.
* **Host-Modell (Listen-Server):** Ein Host-Laptop startet das Spring-Boot-Backend (`0.0.0.0:8080`). Im LAN-Betrieb liefert Spring Boot das gebaute React-Frontend direkt aus `backend/src/main/resources/static/` aus.
* **Single Source of Truth (SSoT):** Allein das **Backend** hält den Spielzustand im Arbeitsspeicher und berechnet Treffer, Schiffszerstörungen, Item-Effekte, Runden-Timer und Siegbedingungen. Das Frontend ist ein reiner Anzeige- und Eingabe-Client.
* **Kommunikation:** Zustandslose REST-API (JSON) mit **Short Polling** durch das Frontend (z. B. alle 500–1000 ms).
* **Spielregeln:** Maßgeblich für alle Zahlenwerte, Schiffstypen, Items und Phasen ist ausschließlich `docs/GAME_RULES.md`. Erfinde keine eigenen Regeln, sondern frage nach, falls dort etwas fehlt.

---

## 2. Tech-Stack & Verbindliche Versionen

### Backend (`backend/`)
* **Sprache & Runtime:** Java 21 (Bytecode-Target 21)
* **Framework:** Spring Boot 4.2.x (`spring-boot-starter-webmvc`, `spring-boot-starter-validation`)
* **Build-Tool:** Maven Wrapper (`./mvnw` bzw. `.\mvnw.cmd`)
* **Datenhaltung:** Ausschließlich In-Memory (`ConcurrentHashMap`, thread-sichere Domänenobjekte). Keine Datenbank.

### Frontend (`frontend/`)
* **Framework:** React 19 + TypeScript (Strict Mode)
* **Bundler:** Vite 6 (`vite@^6` – **nicht** auf Vite 8/Rolldown aktualisieren)
* **Styling:** Tailwind CSS v4 über `@tailwindcss/vite` (`@import "tailwindcss";` in `src/index.css` – keine `tailwind.config.js` anlegen)
* **Assets:** Pixel-Art-Sprites liegen unter `frontend/public/assets/sprites/` und werden im Code über `/assets/sprites/<dateiname>.png` referenziert.

---

## 3. Verbotene Technologien & Anti-Patterns

Verwende unter keinen Umständen folgende Bibliotheken oder Muster:
1. **Keine Datenbanken / JPA / H2 / SQLite:** Alles lebt nur für die Dauer der Server-Laufzeit im RAM.
2. **Keine WebSockets / STOMP / SSE:** Die Synchronisation erfolgt ausschließlich über REST + Short Polling.
3. **Kein Lombok:** Lombok ist **nicht** in der `pom.xml` eingebunden. Nutze niemals `@Data`, `@Getter`, `@Builder` o. Ä. Nutze stattdessen Java `record`s für DTOs und reguläre Java-Klassen mit expliziten Konstruktoren/Methoden für Domänenmodelle.
4. **Keine Änderung an `spring-boot-starter-webmvc`:** In Spring Boot 4.x ersetzt `webmvc` das frühere `spring-boot-starter-web`. Nicht umschreiben.
5. **Keine schweren State-Management-Bibliotheken:** Kein Redux, MobX oder Zustand. Nutze React Hooks (`useState`, `useEffect`, `useCallback`, Custom Hooks).
6. **Keine Spiellogik im Frontend:** Das Frontend prüft höchstens offensichtliche UI-Zustände (z. B. Button deaktivieren, wenn man nicht am Zug ist), trifft aber niemals autoritative Entscheidungen über Treffer oder Spielende.

---

## 4. Verzeichnisstruktur & Paket-Konventionen

```text
SWE-Schiffe-Versenken/
├── AGENTS.md
├── docs/
│   └── GAME_RULES.md
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/battleship/backend/
│       ├── BackendApplication.java
│       ├── controller/      # REST-Endpunkte (@RestController, nur HTTP-Mapping & Validierung)
│       ├── service/         # Spiellogik, Session-Verwaltung, Timer-Auswertung
│       ├── domain/          # Interne Spielmodelle (GameSession, Player, Board, Ship, Item)
│       ├── dto/             # API-Verträge als Java records (Request/Response)
│       └── exception/       # Custom