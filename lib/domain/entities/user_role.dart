/// Rolle im zweiseitigen Marktplatz.
enum UserRole {
  seeker,
  provider;

  String get label => switch (this) {
        UserRole.seeker => 'Suchende:r',
        UserRole.provider => 'Anbieter:in',
      };

  String get description => switch (this) {
        UserRole.seeker =>
          'Finde passende Handwerker und Unternehmer für dein Vorhaben.',
        UserRole.provider =>
          'Entdecke Aufträge und Empfehlungsanfragen in deiner Branche.',
      };
}
