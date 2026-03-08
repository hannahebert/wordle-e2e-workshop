# 🟩 Wordle E2E Testing Workshop

Willkommen zum interaktiven Workshop zum Thema E2E Testing mit KI! In diesem Workshop lernen wir **End-to-End Testing mit Cypress** mit KI als Hilfsmittel.

## 📋 Voraussetzungen

Bitte stelle sicher, dass folgende Tools installiert sind:

| Tool | Mindestversion | Prüfen mit |
|------|---------------|------------|
| Node.js | 20.x LTS | `node --version` |
| npm | 9.x | `npm --version` |
| Git | beliebig | `git --version` |

> **Tipp:** Node.js 20 LTS empfehlen wir via [nvm](https://github.com/nvm-sh/nvm) oder direkt von [nodejs.org](https://nodejs.org)

---

## 🚀 Schnellstart

### 1. Repository klonen

```bash
git clone https://github.com/<org>/wordle-e2e-workshop.git
cd wordle-e2e-workshop
```

### 2. Abhängigkeiten installieren

```bash
npm install
```

Das installiert alle Abhängigkeiten für Frontend, Backend und Cypress (npm workspaces).

### 3. Anwendung starten

```bash
npm run dev
```

Dieser Befehl startet **Frontend und Backend gleichzeitig**:

| Service | URL |
|---------|-----|
| Frontend (React) | http://localhost:5173 |
| Backend (Fastify) | http://localhost:3000 |

---

## 🧪 Cypress E2E Tests starten

```bash
npm run cypress:open
```

Öffnet den **Cypress Test Runner** – hier könnt ihr die Tests live beobachten. 👁️

### Headless (für CI/CD)

```bash
npm run cypress:run
```

---

## 📁 Projektstruktur

```
wordle-e2e-workshop/
├── packages/
│   ├── frontend/          # React + Vite + TypeScript
│   ├── backend/           # Fastify + TypeScript
│   └── shared/            # Gemeinsame Typen (GuessResult, GameState)
├── cypress/
│   ├── e2e/               # ← Hier schreiben wir die Tests
│   └── support/
├── package.json           # Root (npm workspaces)
└── README.md
```

---

## Einzelne Services starten (optional)

Falls ihr nur Frontend oder Backend einzeln starten möchtet:

```bash
# Nur Backend
npm run dev:backend

# Nur Frontend
npm run dev:frontend
```

---

## Probleme?

Schau in die jeweiligen READMEs:
- [`packages/frontend/README.md`](./packages/frontend/README.md)
- [`packages/backend/README.md`](./packages/backend/README.md)

Oder meld dich direkt bei den Speakern 
