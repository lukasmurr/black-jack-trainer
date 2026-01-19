# 🃏 Blackjack Trainer

Ein interaktiver Blackjack-Trainer und Simulator, entwickelt mit modernem Angular 21. Diese Anwendung hilft Benutzern, die optimale Blackjack-Strategie ("Basic Strategy") zu erlernen und zu üben.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Angular](https://img.shields.io/badge/angular-v21-dd0031.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌟 Features

### 🎮 Spiel-Modus
Ein voll funktionsfähiges Blackjack-Spiel zum Spaß und zur Anwendung des Gelernten.
- **Klassisches Blackjack**: Dealer gegen Spieler.
- **Wett-System**: Setzen von Chips und Verwaltung der Bankroll.
- **Spielaktionen**: Hit, Stand, Double Down, Split.
- **Automatische Deck-Verwaltung**: Das Deck wird automatisch neu gemischt, wenn es zur Neige geht.

### 📚 Trainings-Modus
Ein dedizierter Modus, um die perfekte Strategie zu meistern.
- **Szenario-basiertes Lernen**: Das System präsentiert spezifische Hände (z.B. Soft 17 gegen Dealer 6).
- **Sofortiges Feedback**: Direkte Rückmeldung, ob die Entscheidung mathematisch korrekt war.
- **Erklärungen**: Detaillierte Begründungen für jede strategische Entscheidung.
- **Filter**: Üben Sie gezielt bestimmte Situationen (z.B. nur Paare oder Soft Hands).
- **Statistiken**: Verfolgen Sie Ihre Lernfortschritte und Genauigkeit.

## 🛠️ Technologien

Das Projekt wurde mit den aktuellsten Web-Technologien erstellt:

- **Framework**: [Angular 21](https://angular.io/)
- **Architektur**: Standalone Components, Signals, Control Flow Syntax (`@if`, `@for`).
- **Sprache**: TypeScript 5.9
- **Styling**: SCSS (Sass)
- **State Management**: Service-based mit Angular Signals
- **Build Tool**: Angular CLI (via Vite)

## 📂 Projektstruktur

```
src/
├── app/
│   ├── components/      # UI-Komponenten (Karten, Hand, Buttons etc.)
│   ├── models/          # TypeScript Interfaces & Typen
│   ├── pages/           # Hauptansichten (Game, Training)
│   ├── services/        # Geschäftslogik & State Management
│   │   ├── blackjack.service.ts   # Core Game Logic
│   │   ├── strategy.service.ts    # Strategie-Tabellen Logik
│   │   └── game-state.service.ts  # Globaler App-State
│   └── app.ts           # Root Component
├── public/              # Statische Assets (Icons, Strategy JSON)
└── styles.scss          # Globale Styles
```

## 🚀 Installation & Start

Stelle sicher, dass du [Node.js](https://nodejs.org/) installiert hast.

1. **Repository klonen**
   ```bash
   git clone https://github.com/yourusername/black-jack-trainer.git
   cd black-jack-trainer
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**
   ```bash
   npm start
   ```
   Öffne deinen Browser und navigiere zu `http://localhost:4200/`.

4. **Build für Produktion**
   ```bash
   npm run build
   ```

## 🚢 Deployment

Das Projekt ist für das Deployment auf GitHub Pages konfiguriert.

```bash
ng deploy --base-href=/black-jack-trainer/
```
*Hinweis: Falls es Probleme mit Font-Inlining gibt, ist dies in der `angular.json` bereits deaktiviert.*

## 📐 Strategie

Die Strategie-Daten basieren auf der Standard Blackjack Basic Strategy und werden aus der Datei `public/blackjack_strategy.json` geladen. Dies ermöglicht eine einfache Anpassung oder Erweiterung der Regeln.
