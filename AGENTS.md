# AGENTS.md – Battleship Battle Royale (Version 2.0)

## 1. Projektkontext & Teamstruktur
Dieses Repository enthält ein rundenbasiertes Multiplayer-LAN-Spiel, das *Schiffe versenken* als **Battle Royale** auf einer gemeinsamen Seekarte neu interpretiert.
- **Primäres Lernziel:** Strukturierte Zusammenarbeit eines 7-köpfigen Teams mit **Gemini** als KI-Assistent (Contract-First, saubere Git-Workflows, nachvollziehbare Pull Requests).
- **Team-Aufteilung (7 Personen):**
  - **Backend (Java / Spring Boot):** Daniel, Julius, Rey
  - **Frontend (Web-UI):** Julian, Alex, Alex
  - **Pixel-Art & Visuelle Assets:** Krushali
- **Koordination:** Absprachen und Dokumentation laufen über Discord; Code-Integration erfolgt ausschließlich über feature-basierte Git-Branches und Pull Requests.
- **Leitlinie gegen Zeitdruck:** Da Game-Design-Zeit und Team-Abstimmung unsere größten Engpässe sind[cite: 1], gilt strikt: **Erst den Core-Loop stabil bauen, danach optionale Mechaniken ergänzen.**

---

## 2. Tech-Stack & Architektur (Single Source of Truth)
- **Backend:** Java 21+, Spring Boot 3.x (`spring-boot-starter-web`, `spring-boot-starter-validation`)[cite: 1].
- **Frontend:** TypeScript + React + Vite + Tailwind CSS (ausgeliefert als statisches Build über `src/main/resources/static` im Spring-Boot-Server)[cite: 1].
- **Host-Modell (Listen-Server):** Der Spieler, der die Runde erstellt, startet damit den Spring-Boot-Server auf seinem Rechner und spielt selbst im Browser mit[cite: 1]. Alle anderen treten über seine lokale LAN-IP bei.
- **Verbindungsabbruch:** Bricht die Verbindung zum Host ab oder wird der Server beendet, ist die Runde sofort beendet[cite: 1] (keine Host-Migration, keine Persistenz/Datenbank).
- **Authoritative Server („Lügen bringt nichts“):** Alle Schiffspositionen, Treffer, Sichtbarkeiten und Timer liegen ausschließlich im RAM des Spring-Boot-Backends[cite: 1]. Das Frontend ist ein reiner Anzeige-Client ohne eigene Spiellogik.
- **Kommunikation:** REST-API (`@RestController`) + Short Polling (`GET /api/games/{gameId}/state?playerId=...`) mit `stateVersion`-Zähler zur Vermeidung von Race Conditions.

---

## 3. Verbindliche Spielregeln (Core Scope)
Diese Regeln sind fest beschlossen und bilden das Fundament für Backend und Frontend:

### Lobby & Spielwelt
- **Spieleranzahl:** Konfigurierbar für **4 oder 8 Spieler** pro Partie[cite: 1].
- **Gemeinsame Spielwelt („Das Meer“):** Alle Spieler agieren auf **einem großen gemeinsamen Ozean-Grid** (kein getrenntes Board pro Spieler)[cite: 1].
- **Sichtbarkeit (Fog of War):** Jeder Spieler sieht auf dem Meer seine eigenen Schiffe sowie aufgedeckte/getroffene Felder und Effekte in seiner Sichtweite[cite: 1]. Verdeckte gegnerische Schiffe werden vom Backend vor dem Versand des JSON-Responses strikt herausgefiltert.

### Rundenablauf & Zeitlimit
- **Zugbasiert mit Timer:** Spieler sind nacheinander am Zug[cite: 1]. Pro Zugphase gilt ein **Zeitlimit von 1 Minute (60 Sekunden)**[cite: 1]. Läuft die Zeit im Backend ab, wird die aktuelle Phase automatisch übersprungen bzw. beendet.
- **Drei feste Phasen pro Zug (strikt in dieser Reihenfolge):**
  1. **`USE_ITEM` (Items nutzen):** Der aktive Spieler kann ein verfügbares Item einsetzen (oder die Phase überspringen)[cite: 1].
  2. **`SHOOT` (Schießen):** Der aktive Spieler feuert auf Zielkoordinaten im gemeinsamen Meer[cite: 1].
  3. **`MOVE` (Bewegen):** Der aktive Spieler bewegt ein Schiff entsprechend seiner Bewegungsregeln[cite: 1].

### Schiffsarten (Basis-Klassen)
Folgende Schiffsarchetypen sind als Grundgerüst vorgesehen[cite: 1]:
- **Reconnaissance (Aufklärer):** Fokus auf Sichtweite / Mobilität[cite: 1].
- **Artillerie:** Fokus auf Feuerkraft / Reichweite[cite: 1].
- **U-Boot:** Besitzt eine Tauch-Mechanik (kann untertauchen)[cite: 1].

---

## 4. Backlog & Offene Design-Fragen (WICHTIG FÜR GEMINI)
Folgende Ideen befinden sich noch in der Konzeptionsphase (im Design-Dokument mit `?` markiert) und sind **noch nicht final beschlossen**[cite: 1].

> **Verbindliche Anweisung an Gemini:** Implementiere **keines** der folgenden Features eigenmächtig! Wenn du Code für Schiffe, Felder, Items oder Rundenphasen schreibst, halte die Architektur jedoch über saubere Interfaces (z. B. `ItemEffect`, `TileModifier`, `ShipAbility`) so erweiterbar, dass diese Punkte später ohne Umbau der Core-Engine ergänzt werden können:
- **Kollision & Bewegung:** Schiffe rammen?[cite: 1] Schiffe drehen?[cite: 1] Segmentweise Bewegung eines Schiffs bei Treffer?[cite: 1]
- **Items:** Schiffe teleportieren?[cite: 1] Fallen legen?[cite: 1] Kompass?[cite: 1] Sonar?[cite: 1]
- **Schiffs-Details:** Konkrete aktive und passive Fähigkeiten je Schiffstyp[cite: 1] (z. B. exakte Regeln fürs Ab- und Auftauchen des U-Boots[cite: 1]).
- **Umgebung & Events:** Felsen als Hindernisse auf dem Grid und ob diese zerstörbar sind?[cite: 1] Wetterevents wie Meteoriten (erzeugen neue Felsen) oder Tornados?[cite: 1]
- **Feedback:** Gezielte Event-Benachrichtigungen an Spieler bei bestimmten Aktionen?[cite: 1]

---

## 5. Verzeichnisstruktur & Zuständigkeiten
Um Merge-Konflikte zwischen Backend (Daniel, Julius, Rey) und Frontend (Julian, Alex, Alex, Krushali) zu vermeiden[cite: 1], gilt diese Trennung:

```text
backend/
└── src/
    ├── main/java/com/battleship/
    │   ├── controller/       # NUR REST-Endpunkte, Validation, Delegation
    │   ├── service/          # GameService, TurnTimerService, Locking, Fog-of-War-Filter
    │   ├── domain/           # Reine Java-Klassen (OceanGrid, Ship, TurnPhase, Item, Rules) – OHNE Spring!
    │   ├── dto/              # Java Records für Requests & Responses (Single Source of Truth)
    │   └── exception/        # Domain-Exceptions & @RestControllerAdvice
    └── test/java/com/battleship/
        └── domain/           # JUnit-5-Tests für Phasen, Bewegung, Treffer, Timer

frontend/
├── public/assets/sprites/    # Pixel-Art-Assets (Krushali) – feste Benennung nach Sprite-Manifest
└── src/
    ├── api/                  # fetch-Client für Spring-Boot-Endpunkte
    ├── types/                # TypeScript-Interfaces (1:1 Abbild der Backend-DTOs)
    ├── components/           # OceanGrid, PhaseIndicator, TimerBar, ShipHud, EventLog
    └── pages/                # LobbyPage, PlacementPage, GameArenaPage, GameOverPage