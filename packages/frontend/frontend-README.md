# Wordle Frontend

React + Vite + TypeScript SPA.

## Starten

# Aus dem Root-Verzeichnis (empfohlen)
```bash
npm run dev:frontend
```

# Oder direkt im Package
```bash
cd packages/frontend && npm run dev
```

Läuft auf **http://localhost:5173**

---

## Umgebungsvariablen

Erstelle eine `.env` Datei im `packages/frontend` Verzeichnis:

```env
VITE_API_URL=http://localhost:3000
```

> Die `.env.example` Datei enthält alle verfügbaren Variablen als Referenz.

---

## Verfügbare Befehle

| Befehl | Beschreibung |
|--------|-------------|
| `npm run dev` | Entwicklungsserver starten |
| `npm run build` | Produktions-Build |
| `npm run preview` | Build lokal vorschauen |
| `npm run lint` | ESLint ausführen |

---

## `data-testid` Konventionen

Alle interaktiven Elemente haben `data-testid` Attribute – das ist ein wichtiger Punkt im Workshop!

```
tile-{row}-{col}      → z.B. tile-0-0, tile-1-3
keyboard-key-{letter} → z.B. keyboard-key-a
submit-button
toast-message
```

> **Workshop-Hinweis:** Diese Attribute sind der Einstiegspunkt für unsere Cypress Tests. Wir schauen uns gemeinsam an, warum `data-testid` besser ist als CSS-Selektoren oder XPath.
