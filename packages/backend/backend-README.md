# ⚙️ Wordle Backend

Fastify + TypeScript REST API.

## Starten

```bash
# Aus dem Root-Verzeichnis (empfohlen)
npm run dev:backend

# Oder direkt im Package
cd packages/backend
npm run dev
```

Läuft auf **http://localhost:3000**

---

## Umgebungsvariablen

Erstelle eine `.env` Datei im `packages/backend` Verzeichnis:

```env
PORT=3000
WORD_LIST_PATH=./data/words.txt
```

> Die `.env.example` Datei enthält alle verfügbaren Variablen als Referenz.

---

## API Endpunkte

### `POST /api/game`
Neue Spielsession starten.

**Response:**
```json
{
  "gameId": "abc123",
  "wordLength": 5,
  "maxAttempts": 6
}
```

---

### `POST /api/game/:gameId/guess`
Einen Guess abschicken.

**Request Body:**
```json
{
  "word": "crane"
}
```

**Response:**
```json
{
  "result": [
    { "letter": "c", "status": "absent" },
    { "letter": "r", "status": "present" },
    { "letter": "a", "status": "correct" },
    { "letter": "n", "status": "absent" },
    { "letter": "e", "status": "absent" }
  ],
  "gameOver": false,
  "won": false,
  "attemptsLeft": 5
}
```

---

### `GET /api/game/:gameId`
Aktuellen Spielstand abrufen.

---

## Letter Status

| Status | Bedeutung | Farbe |
|--------|-----------|-------|
| `correct` | Richtiger Buchstabe, richtige Position | 🟩 Grün |
| `present` | Buchstabe im Wort, falsche Position | 🟨 Gelb |
| `absent` | Buchstabe nicht im Wort | ⬛ Grau |

---

## Verfügbare Befehle

| Befehl | Beschreibung |
|--------|-------------|
| `npm run dev` | Entwicklungsserver mit Hot Reload |
| `npm run build` | TypeScript kompilieren |
| `npm run start` | Kompilierten Build starten |
| `npm run lint` | ESLint ausführen |

---

## API manuell testen

Mit [HTTPie](https://httpie.io) oder curl:

```bash
# Neue Session
curl -X POST http://localhost:3000/api/game

# Guess abschicken
curl -X POST http://localhost:3000/api/game/abc123/guess \
  -H "Content-Type: application/json" \
  -d '{"word": "crane"}'
```

> **Workshop-Hinweis:** Eine funktionierende API ist die Basis unserer E2E Tests. Wir schauen uns gemeinsam an, wie Cypress direkt gegen die API testen kann – unabhängig vom Frontend.
