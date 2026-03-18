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
- hannah.ebert@adesso.de

<br/>

> „Erst verstehen. Dann automatisieren."

---

# Florian Sowade

**Co-Founder · Suora GmbH**

<br/>

- Hilft Teams, Software sinnvoll zu bauen (nicht nur technisch)
- Glaubt an Tests, wenn sie im Alltag helfen
- Nutzt KI als Werkzeug – nicht als Abkürzung
- f.sowade@suora.com

<br/>

> „Wenn Tests weh tun, haben wir sie falsch gebaut."

---
layout: center
---

<div class="absolute inset-0">
  <img src="/images/menti.png" class="w-full h-full object-cover" />
</div>

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
layout: two-cols
---

# Die Testpyramide

<v-clicks>

- Klassischer Ansatz: **viele Unit Tests, wenige E2E**
- Je höher, desto langsamer, teurer und brüchiger
- Fokus auf schnelles Feedback durch isolierte Tests

</v-clicks>

::right::

<img src="/images/testing-pyramid.png" class="h-72 rounded shadow mx-auto mt-8" />

---
layout: two-cols
---

# Die Testing Trophy

<v-clicks>

- Moderner Gegenentwurf: **Fokus auf Integrationstests**
- Integrationstests geben das meiste Vertrauen pro Aufwand
- Static Analysis (TypeScript, ESLint) als Basis

</v-clicks>

::right::

<img src="/images/testing-trophy.png" class="h-72 rounded shadow mx-auto mt-8" />

---

# Was ist Unit Testing?

<v-clicks>

- Testen von einzelnen Units
- Automatisiert
- Isoliert

</v-clicks>

---

# Was ist eine Unit?

<v-clicks>

- Der kleinste Baustein einer Applikation
- z.B. Komponente, Funktionen oder Klassen

</v-clicks>

---

# Grundannahme Unit Testing

<div class="flex items-center gap-10">
  <div class="flex-1">

Wenn **alle Units** korrekt funktionieren, dann funktioniert auch die **gesamte Applikation** korrekt.

  </div>
  <div class="flex-1 flex justify-center">
    <img src="/images/unit.jpg" class="h-56 rounded shadow mx-auto" />
  </div>
</div>

---

# Vorteile von Unit Testing

<v-clicks>

- **Frühes Erkennen von Fehlern:** Fehler können frühzeitig im Entwicklungsprozess entdeckt und behoben werden
- **Modularität:** Unit Tests fördern die Entwicklung modularen und wartbaren Codes
- **Schnelle Rückmeldung:** Entwickler erhalten schnell Rückmeldung über die Korrektheit ihres Codes

</v-clicks>

---

# Integration Tests

ABER Funktionieren die einzelnen Komponenten auch im Zusammenspiel miteinander?

<v-click>
  <div class="flex-1 flex justify-center">
    <video autoplay loop muted class="h-56 rounded shadow">
      <source src="/videos/integration-testing.mp4" type="video/mp4" />
    </video>
  </div>
</v-click>

---

# Integration Tests – Beispiele

<v-clicks>

- **Formular + Validierungsservice** – Zeigt die UI den richtigen Fehler bei ungültiger Eingabe?
- **Store + Komponente** – Aktualisiert sich die Ansicht korrekt nach einer State-Änderung?
- **Komponente + API** – Rendert die Liste korrekt nach einem erfolgreichen Fetch?
- **Router + Auth-Guard** – Wird ein nicht eingeloggter User weitergeleitet?


</v-clicks>

---

# End-To-End Tests

<v-clicks>

- Testen die Anwendung **von außen** – wie ein echter User
- Browser steuert die echte UI, Backend & Datenbank laufen mit
- Simulieren ganzheitliche Geschäftsabläufe aus Nutzersicht
- **Nachteil:** Langsam und teuer – müssen sich also lohnen

</v-clicks>

<v-click>

> E2E Tests sind kein Ersatz für Unit oder Integration Tests –
> sie sind die letzte Sicherheitslinie.

</v-click>

---

# Abgrenzung: Wann E2E?

| Testyp | Prüft | Geschwindigkeit |
|---|---|---|
| Unit | Logik einer Funktion | ⚡ sehr schnell |
| Integration | Zusammenspiel von Modulen | 🚀 schnell |
| E2E | Kompletter User Flow | 🐢 langsam |

---

# Wann sind E2E Tests sinnvoll?

<v-clicks>

- Kritische User Journeys (Login, Checkout, ...)
- Workflows, die viele Teile verbinden
- Regressionssicherung nach Releases

</v-clicks>

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
layout: center
---

<div class="absolute inset-0">
  <img src="/images/stars.jpg" class="w-full h-full object-cover" />
  <div class="absolute inset-0 bg-black/30" />
</div>
<div class="relative flex flex-col items-center gap-4 text-center">
  <div class="text-6xl font-bold text-white drop-shadow-lg">Die Anwendung</div>
  <div class="text-2xl text-white/80 drop-shadow">Schauen wir uns Wordle zuerst an</div>
</div>

---
layout: center
---

<div class="absolute inset-0">
  <img src="/images/stars.jpg" class="w-full h-full object-cover" />
  <div class="absolute inset-0 bg-black/30" />
</div>
<div class="relative flex flex-col items-center gap-4 text-center">
  <div class="text-4xl font-bold text-white drop-shadow-lg">Repository</div>
  <a href="https://github.com/hannahebert/wordle-e2e-workshop" target="_blank" class="text-lg text-white/80 hover:text-white drop-shadow !no-underline !border-none">
    github.com/hannahebert/wordle-e2e-workshop
  </a>
  <img src="/images/repo-qr.png" class="w-52 h-52 rounded-lg shadow-2xl" alt="QR-Code zum Repository" />
</div>


---
layout: center
---

<div class="absolute inset-0">
  <img src="/images/stars.jpg" class="w-full h-full object-cover" />
  <div class="absolute inset-0 bg-black/30" />
</div>
<div class="relative flex flex-col items-center gap-4 text-center">
  <div class="text-6xl font-bold text-white drop-shadow-lg">Cypress Intro</div>
</div>

---
layout: center
---

<div class="flex flex-col items-center gap-6 text-center">
  <div class="text-4xl" style="color:#2D6CC7">Die Cypress Philosophie</div>

  <v-clicks>
    <div class="text-6xl" style="color:#128589">Developer Experience</div>
  </v-clicks>
</div>

---

# Batteries Included – Das Cypress Setup

<v-clicks>

- Testing Framework: Mocha
- Assertion Library: Chai, Chai jQuery, Chai-Sinon
- Launcher / Test Runner
- Reporter
- Browser: Electron
- Proxy (für Request Stubbing)

</v-clicks>

---


# Die Cypress Desktop App

<v-clicks>

- Vereinfacht das Schreiben der Tests
- Visuell aufbereitetes Feedback
- Timetravel
- Übersichtliches Debugging

</v-clicks>

---

# Sehr einfaches Mocking / Stubbing

Wenn die Realität mal wieder nicht perfekt ist...

---

# Wundervolle Dokumentation

<v-clicks>

- ... um Cypress zu lernen
- ... um die Best Practices zu erfahren
- ... um CI aufzusetzen
- ...

</v-clicks>

---
layout: section
---

# Cypress Setup

---


# Cypress installieren

```bash {1|2}
$ npm install --save-dev cypress
$ npx cypress open
```



---
layout: center
---

<div class="absolute inset-0">
  <img src="/images/stars.jpg" class="w-full h-full object-cover" />
  <div class="absolute inset-0 bg-black/30" />
</div>
<div class="relative flex flex-col items-center gap-4 text-center">
  <div class="text-6xl font-bold text-white drop-shadow-lg">Testing & AI</div>
</div>

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
layout: center
---

<div class="absolute inset-0">
  <img src="/images/stars.jpg" class="w-full h-full object-cover" />
  <div class="absolute inset-0 bg-black/30" />
</div>
<div class="relative flex flex-col items-center gap-4 text-center">
  <div class="text-6xl font-bold text-white drop-shadow-lg">Let's see the magic</div>
</div>


---

# Commands: Query vs. Non-Query

<v-clicks>

- **Query**: Elemente finden
- **Non-Query**: Aktionen ausführen

</v-clicks>

<v-click>

=> Query Commands geben ein Element zurück, Non-Query Commands nicht.

</v-click>

<v-click>

```js
cy.get('button')      // Query Command
  .click();           // Non-Query Command
```

</v-click>

---

# Get vs. Find vs. Contains

<v-clicks>

- **`cy.get()`** - Findet ein Element
- **`cy.find()`** - Findet ein Kind-Element
- **`cy.contains()`** - Findet ein Element anhand des Textes

</v-clicks>

<v-click>

```js
cy.contains('Bingo');

cy.get('[data-cy="login-form"]')
  .find('h3')
  .should('contain', 'Anmeldung');
```

</v-click>


---
layout: center
---

<div class="absolute inset-0">
  <img src="/images/stars.jpg" class="w-full h-full object-cover" />
  <div class="absolute inset-0 bg-black/30" />
</div>
<div class="relative flex flex-col items-center gap-4 text-center">
  <div class="text-6xl font-bold text-white drop-shadow-lg">Ab zum nächsten Test</div>
</div>


---

# Chain of Commands – Retry Logic

```js
cy.get('my-selector')
  .should('have.length', 5)
  .eq(1)
  .should('contain', 'magic');
```

---

# Chain of Commands – Retry Logic

```js {1}
cy.get('my-selector')
```

---

# Chain of Commands – Retry Logic

```js {1-2}
cy.get('my-selector')
  .should('have.length', 5)    // FAIL
```

---

# Chain of Commands – Retry Logic

```js {1}
cy.get('my-selector')
```

---

# Chain of Commands – Retry Logic

```js {1-2}
cy.get('my-selector')
  .should('have.length', 5)
```

---

# Chain of Commands – Retry Logic

```js {1-3}
cy.get('my-selector')
  .should('have.length', 5)
  .eq(1)
```

---

# Chain of Commands – Retry Logic

```js {1-4}
cy.get('my-selector')
  .should('have.length', 5)
  .eq(1)
  .should('contain', 'magic');
```

---

# Chain of Commands – Retry Logic

```js {1-4}
cy.get('my-selector')
  .should('have.length', 5)
  .eq(1)
  .should('contain', 'magic'); // FAIL
```

---

# Chain of Commands – Retry Logic

```js {1}
cy.get('my-selector')
```

---

# Chain of Commands – Retry Logic

```js {1-2}
cy.get('my-selector')
  .should('have.length', 5)
```

---

# Chain of Commands – Retry Logic

```js {1-3}
cy.get('my-selector')
  .should('have.length', 5)
  ...
```

---
layout: center
---

<div class="absolute inset-0">
  <img src="/images/stars.jpg" class="w-full h-full object-cover" />
  <div class="absolute inset-0 bg-black/30" />
</div>
<div class="relative flex flex-col items-center gap-4 text-center">
  <div class="text-6xl font-bold text-white drop-shadow-lg">Zurück zum Doing... </div>
</div>

---
layout: center
---

# cy.request vs cy.intercept

---

# cy.request – Direkt API Testen

**Zweck:** HTTP-Anfragen direkt senden und prüfen.

**Einsatzgebiet:**

<v-clicks>

- Backend-APIs testen
- Testdaten vorbereiten (z. B. Benutzer erstellen)
- Systemzustände prüfen

</v-clicks>

---

# cy.request – Beispiel

```js {1|1-2|1-6}
cy.request('POST', '/api/login',
            { username: 'test', password: 'test123' })
  .then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('token');
  });
```

---

# cy.intercept – Netzwerkanfragen Steuern

**Zweck:**

<v-clicks>

- Anfragen abfangen und Stub- oder Mock-Daten verwenden
- Netzwerkverkehr überwachen

</v-clicks>

<v-click>

**Einsatzgebiet:**

- API-Fehler simulieren
- Tests isolieren (kein echter Backend-Aufruf)
- Frontend-Integration testen

</v-click>

---

# cy.intercept – Beispiel

```js {1|1-2|1-2,4|1-7}
cy.intercept('GET', '/api/data', { fixture: 'data.json' })
             .as('getData');

cy.visit('/dashboard');
cy.wait('@getData').then((interception) => {
  expect(interception.response.statusCode).to.eq(200);
});
```


---
layout: center
---

<div class="absolute inset-0">
  <img src="/images/stars.jpg" class="w-full h-full object-cover" />
  <div class="absolute inset-0 bg-black/30" />
</div>
<div class="relative flex flex-col items-center gap-4 text-center">
  <div class="text-6xl font-bold text-white drop-shadow-lg">Zurück zu AI</div>
</div>


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
