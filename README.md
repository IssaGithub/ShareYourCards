# AuftragMatch – Empfehlungsportal

Flutter-App für Handwerker und Unternehmer aller Branchen: **Suchende** und **Anbieter** erhalten Vorschläge und bewerten diese per Swipe (rechts = Interesse, links = Ablehnen). Bei gegenseitigem Interesse entsteht ein Match.

## Features

- Rollenwahl: Suchende:r oder Anbieter:in
- Swipe-Deck mit Branchen-Vorschlägen (Demo-Daten)
- Matches bei Interesse
- Rollenwechsel im Profil
- Clean Architecture (Domain / Data / Presentation)

## Architektur

```
lib/
  core/           Theme, Konstanten, Fehler
  domain/         Entities, Repository-Verträge, Use Cases
  data/           Data Sources, Repository-Implementierung
  presentation/   Provider, Screens, Widgets
```

Abhängigkeiten fließen nur nach innen: Presentation → Domain ← Data.

## Starten

```bash
flutter pub get
flutter run
```

Web:

```bash
flutter run -d chrome
```

## Tests & Analyse

```bash
flutter analyze
flutter test
```

## Swipe-Logik

| Aktion | Bedeutung |
|--------|-----------|
| Rechts | Interesse / positive Gewichtung |
| Links  | Ablehnen |

Demo: ca. 40 % der Likes erzeugen einen Match (deterministisch über Card-ID).
