# ShareYourCards

Eine Flutter-App, mit der du digitale Visitenkarten aus deinem Netzwerk zentral verwalten und mit wenigen Klicks mit anderen teilen kannst.

## Features

- Kontakte als digitale Visitenkarten anlegen, bearbeiten und löschen
- Suche über Name, Firma, Position, E-Mail, Telefon, Website und Notiz
- Persistente Speicherung auf dem Gerät (SharedPreferences)
- Teilen als lesbarer Kontakttext
- Teilen als vCard-Text (z. B. für CRM/Import-Workflows)

## Projekt starten

1. Flutter SDK installieren (inkl. passender Plattform-Toolchains).
2. Falls das Repository frisch geklont wurde und noch keine Plattformordner vorhanden sind:
   ```bash
   flutter create .
   ```
3. Abhängigkeiten laden:
   ```bash
   flutter pub get
   ```
4. App starten:
   ```bash
   flutter run
   ```

## Struktur

- `lib/main.dart`: komplette App-Logik (UI, Formulare, Persistenz, Share-Funktionen)
- `pubspec.yaml`: Abhängigkeiten und Flutter-Konfiguration
- `test/widget_test.dart`: einfacher Widget-Test für den Startscreen
