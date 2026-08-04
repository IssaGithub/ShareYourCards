# AXION Gutachten · Website & CRM

Webseite und integriertes CRM für das unabhängige Kfz-Sachverständigenbüro **AXION**.

## Features

### Öffentliche Website
- Landingpage inspiriert an typischen Kfz-Gutachten-Auftritten (Leistungen, Vergleich, FAQ, Bewertungen)
- Online-Anfrageformular mit optionalem Vor-Ort-Termin

### Gutachten-CRM (`/crm`)
- Dashboard mit Kennzahlen
- Anfragen / Leads (inkl. Konvertierung zu Kunden)
- Kunden- und Fahrzeugverwaltung
- Besichtigungstermine
- Gutachten-Fälle mit Status-Pipeline, Versicherung & Honorar
- Persistenz im Browser (`localStorage`) mit Demo-Daten

## Start

```bash
npm install
npm run dev
```

Öffnen: [http://localhost:3000](http://localhost:3000)

## GitHub Pages

```bash
npm run build:pages
```

Nach Aktivierung von **Settings → Pages → Source: GitHub Actions**:

**https://issagithub.github.io/ShareYourCards/**

## Tech

- Next.js (App Router, static export)
- TypeScript
- Tailwind CSS
- Client-seitiges CRM mit React Context
