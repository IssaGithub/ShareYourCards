# MOTORHALLE · Autowerkstatt & CRM

Webseite und integriertes Werkstatt-CRM für die Autowerkstatt **MOTORHALLE**.

## Features

### Öffentliche Website
- Landingpage mit Leistungen und Über-uns
- Online-Terminbuchung (schreibt direkt ins CRM)

### Werkstatt-CRM (`/crm`)
- Dashboard mit Kennzahlen
- Kundenverwaltung
- Fahrzeugverwaltung
- Termine (inkl. Statusfilter)
- Werkstattaufträge mit Kosten & Status
- Persistenz im Browser (`localStorage`) mit Demo-Daten

## Start

```bash
npm install
npm run dev
```

Öffnen: [http://localhost:3000](http://localhost:3000)

## Tech

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Client-seitiges CRM mit React Context
