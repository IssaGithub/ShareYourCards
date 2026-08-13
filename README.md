# GewinnMax - Automatische Gewinnspiel-Teilnahme

Eine Webanwendung, mit der Benutzer sich registrieren und automatisch an kostenlosen Gewinnspielen in ihrer Region teilnehmen können.

## Features

- **Benutzer-Authentifizierung**: Registrierung und Login mit sicherer Passwort-Verschlüsselung
- **Regionale Filter**: Gewinnspiele nach Bundesland/Region filtern
- **Automatische Teilnahme**: Mit einem Klick an allen verfügbaren kostenlosen Gewinnspielen teilnehmen
- **Dashboard**: Übersicht über alle Teilnahmen und Statistiken
- **Moderne UI**: Dunkles, responsives Design

## Technologie-Stack

- **Backend**: Node.js mit Express.js
- **Datenbank**: SQLite (better-sqlite3)
- **Authentifizierung**: bcryptjs für Passwort-Hashing, express-session für Sessions
- **Frontend**: Vanilla HTML, CSS, JavaScript

## Installation

```bash
npm install
```

## Server starten

```bash
npm start
```

Der Server läuft auf `http://localhost:3000`

## API-Endpunkte

### Authentifizierung
- `POST /api/auth/register` - Neuen Benutzer registrieren
- `POST /api/auth/login` - Benutzer anmelden
- `POST /api/auth/logout` - Benutzer abmelden
- `GET /api/auth/me` - Aktuellen Benutzer abrufen
- `PUT /api/auth/settings` - Benutzereinstellungen aktualisieren

### Gewinnspiele
- `GET /api/gewinnspiele` - Alle Gewinnspiele abrufen (mit optionalem Region-Filter)
- `GET /api/gewinnspiele/regionen` - Verfügbare Regionen abrufen
- `GET /api/gewinnspiele/:id` - Einzelnes Gewinnspiel abrufen

### Teilnahmen
- `POST /api/teilnahme/einzeln/:id` - An einzelnem Gewinnspiel teilnehmen
- `POST /api/teilnahme/auto` - Automatisch an allen verfügbaren Gewinnspielen teilnehmen
- `GET /api/teilnahme/meine` - Eigene Teilnahmen abrufen
- `GET /api/teilnahme/statistik` - Teilnahme-Statistiken abrufen
- `DELETE /api/teilnahme/:id` - Teilnahme zurückziehen

## Verwendung

1. Registriere dich mit deinen Daten und wähle deine Region
2. Melde dich an, um zum Dashboard zu gelangen
3. Sieh dir alle verfügbaren kostenlosen Gewinnspiele an
4. Klicke auf "Auto-Teilnahme", um automatisch an allen Gewinnspielen teilzunehmen
5. Verwalte deine Teilnahmen und Einstellungen im Dashboard
