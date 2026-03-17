---
theme: default
title: E2E Testing Workshop – Wordle
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: slide-left
mdc: true
colorSchema: light
themeConfig:
  primary: '#2D6CC7'
---

# Smarter Testen mit Cypress

## Wie KI den Einstieg erleichtert

---

# Hannah Ebert

**Software Architect · adesso SE**

<br/>

- Fokus auf Softwarearchitektur & Qualität
- E2E Testing & Developer Experience
- AI-gestützte Entwicklung

<br/>

> „Erst verstehen. Dann automatisieren."

---

# Florian Sowade

**Co-Founder & Software Entwickler · Suora GmbH**

<br/>

- Softwareentwicklung & Produktaufbau
- E2E Testing in der Praxis
- AI-Tooling im Entwickleralltag

<br/>

> „Werkzeuge sind so gut wie derjenige, der sie benutzt."

---

# Agenda

<v-clicks>

- **Testing Grundlagen** – Testpyramide & E2E Abgrenzung
- **Cypress Intro** – Was kommt von Haus aus mit?
- **AI & Testing** – Wie hilft uns AI, wie limitiert sie uns?
- **Wie starten wir** – Warum Grundlagen zuerst

</v-clicks>

---
layout: section
---

# Testing Grundlagen

---

# Die Testpyramide

<div class="flex justify-center">
  <img src="/images/testing-pyramid.png" class="h-72 rounded shadow" />
</div>

<v-clicks>

- Klassischer Ansatz: **viele Unit Tests, wenige E2E**
- Je höher, desto langsamer, teurer und brüchiger
- Fokus auf schnelles Feedback durch isolierte Tests

</v-clicks>

---

# Die Testing Trophy

<div class="flex justify-center">
  <img src="/images/testing-trophy.png" class="h-72 rounded shadow" />
</div>

<v-clicks>

- Moderner Gegenentwurf: **Fokus auf Integrationstests**
- Integrationstests geben das meiste Vertrauen pro Aufwand
- Static Analysis (TypeScript, ESLint) als Basis

</v-clicks>

---

# Was sind E2E Tests?

<v-clicks>

- Testen die Anwendung **von außen** – wie ein echter User
- Browser steuert die echte UI
- Backend, Datenbank, APIs: **alles läuft**
- Ziel: *„Funktioniert das System als Ganzes?"*

</v-clicks>

<br/>

<v-click>

> E2E Tests sind kein Ersatz für Unit Tests –
> sie sind die letzte Sicherheitslinie.

</v-click>

---

# Abgrenzung: Wann E2E?

| Testyp | Prüft | Geschwindigkeit |
|---|---|---|
| Unit | Logik einer Funktion | ⚡ sehr schnell |
| Integration | Zusammenspiel von Modulen | 🚀 schnell |
| E2E | Kompletter User Flow | 🐢 langsam |

<v-click>

**E2E sinnvoll für:**
- Kritische User Journeys (Login, Checkout, ...)
- Workflows, die viele Teile verbinden
- Regressionssicherung nach Releases

</v-click>

---

# Good Practices – E2E Testing

<v-clicks>

- **Teste User Flows, nicht Implementierungsdetails**
- Selektoren: `data-testid` statt CSS-Klassen oder XPath
- Tests sollen **unabhängig** voneinander sein
- **Kein geteilter State** zwischen Tests
- Deterministische Testdaten – kein Zufall
- Flaky Tests sofort adressieren, nicht ignorieren

</v-clicks>

---

# Bad Practices – E2E Testing

<v-clicks>

- ❌ Zu viele E2E Tests – alles was Unit Test sein kann, sollte Unit Test sein
- ❌ Tests die auf andere Tests angewiesen sind
- ❌ `cy.wait(3000)` – nie auf Zeit warten, auf State warten
- ❌ Produktionsdaten in Tests verwenden
- ❌ UI-Selektoren ohne `data-testid` (fragil!)
- ❌ Tests, die das Backend wirklich verändern (ohne Cleanup)

</v-clicks>

---
layout: section
---

# Cypress Intro

---

# Cypress – Batteries Included

<v-clicks>

- **Test Runner** direkt im Browser – kein Selenium/WebDriver
- **Automatisches Warten** – kein manuelles `wait`
- **Time Travel Debugging** – jeder Schritt als Screenshot
- **Netzwerk-Intercepting** – Requests abfangen & mocken
- **Component Testing** – nicht nur E2E
- **Dashboard** – CI-Integration, Parallelisierung

</v-clicks>

---

# Cypress – Grundstruktur

```js
describe('Wordle Game', () => {
  it('sollte ein Wort raten können', () => {
    cy.visit('/')

    cy.get('[data-testid="tile-input"]').type('CRANE')
    cy.get('[data-testid="submit-btn"]').click()

    cy.get('[data-testid="tile-0"]').should('have.class', 'correct')
  })
})
```

<v-click>

- `describe` / `it` – bekannt aus Jest/Mocha
- `cy.get()` – Element selektieren
- `cy.visit()` – URL aufrufen
- `.should()` – Assertion

</v-click>

---

# Backend-Mocking mit MSW

**Mock Service Worker** – Requests auf Netzwerkebene abfangen

<v-clicks>

- Läuft als **Service Worker** im Browser
- Kein Proxy, keine Code-Änderungen am Frontend
- Gleiche Mocks für Tests & lokale Entwicklung
- Unterstützt REST & GraphQL

</v-clicks>

<v-click>

```js
// handler.ts
http.get('/api/word', () => {
  return HttpResponse.json({ word: 'CRANE' })
})
```

> In Cypress: `cy.intercept()` als leichtgewichtige Alternative

</v-click>

---
layout: section
---

# AI & Testing

---

# Was nutzen wir?

<v-clicks>

- **Claude Code** (Anthropic) – direkt im Terminal/IDE
- AI-gestützte Code-Generierung für Testfälle
- Kontextbewusstes Refactoring & Review

</v-clicks>

<br/>

<v-click>

**Ziel heute:** AI als Pair-Programmer nutzen –
nicht als Blackbox, sondern als Werkzeug das wir verstehen.

</v-click>

---

# Vorteile: AI beim Testing

<v-clicks>

- 🚀 **Schneller Einstieg** – Boilerplate & Struktur generieren
- 🔍 **Edge Cases** – AI schlägt Szenarien vor, die man übersieht
- 📖 **Erklärungen** – unbekannte APIs sofort verstehen
- 🔄 **Refactoring** – Tests verbessern & vereinfachen
- 💡 **Ideen** – „Welche Tests fehlen noch?"

</v-clicks>

---

# Grenzen von AI

<v-clicks>

- ⚠️ **Alles reviewen** – AI macht Fehler, auch selbstbewusst
- ⚠️ **Kein echtes Verständnis** deiner Domäne
- ⚠️ **Halluzinierte APIs** – prüfen ob Methoden wirklich existieren
- ⚠️ **Spezifische Prompts nötig** – vage Fragen = vage Antworten
- ⚠️ **Sicherheit** – keine Secrets in Prompts

</v-clicks>

---

# Nachteile ehrlich betrachtet

<v-clicks>

- Verleitet dazu, Code zu übernehmen **ohne ihn zu verstehen**
- Kann Komplexität erzeugen statt reduzieren
- Tests die bestehen, aber **das Falsche testen**
- Over-Engineering durch generierte Abstraktion
- **Skill-Atrophie** wenn man zu früh auf AI verlässt

</v-clicks>

---

# Warum führt kein Weg daran vorbei?

<v-clicks>

- AI-Tools sind in der Industrie **Standard geworden**
- Produktivitätsgewinn ist real – wer sie nicht nutzt, ist langsamer
- **Qualität** entsteht durch den Entwickler, nicht durch AI
- Wer Grundlagen versteht, nutzt AI **effektiv**
- Wer Grundlagen nicht versteht, wird von AI **geführt**

</v-clicks>

<v-click>

> Die Frage ist nicht *ob* du AI nutzt,
> sondern *wie gut* du sie nutzt.

</v-click>

---

# Wie arbeite ich mich mit AI ein?

**Framework für neue Themen:**

<v-clicks>

1. **Grundkonzept verstehen** – erst selbst lesen, dann AI fragen
2. **Konkrete Fragen stellen** – „Erkläre mir X anhand von Y"
3. **Antworten hinterfragen** – „Warum so und nicht anders?"
4. **Gegenbeispiele fordern** – „Wann sollte ich das NICHT tun?"
5. **Selbst schreiben** – AI-Output als Referenz, nicht als Kopie

</v-clicks>

---
layout: section
---

# Wie starten wir?

---

# Warum Grundlagen zuerst?

<v-clicks>

- AI kann keinen Test schreiben, der **gut** ist, wenn du nicht weißt, was gut ist
- Testpyramide & Abgrenzung entscheiden über **Architektur**
- Schlechte Grundlagen → schlechte Tests → falsches Vertrauen
- Ein Test der besteht aber nichts testet ist **schlimmer als kein Test**

</v-clicks>

<v-click>

### Deshalb:
**Erst verstehen. Dann automatisieren. Dann mit AI beschleunigen.**

</v-click>

---
layout: center
---

# Let's go! 🚀

### Öffnet das Wordle-Projekt und wir legen los.

```bash
npm run dev --workspace=packages/frontend
```
