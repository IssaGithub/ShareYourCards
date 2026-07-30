import 'package:uuid/uuid.dart';

import '../../domain/entities/industry.dart';
import '../../domain/entities/match.dart';
import '../../domain/entities/recommendation_card.dart';
import '../../domain/entities/swipe_direction.dart';
import '../../domain/entities/user_profile.dart';
import '../../domain/entities/user_role.dart';
import '../../domain/repositories/recommendation_repository.dart';
import 'recommendation_local_data_source.dart';

/// In-Memory-Demo-Datenquelle mit Seed-Daten für alle Branchen.
final class RecommendationLocalDataSourceImpl
    implements RecommendationLocalDataSource {
  RecommendationLocalDataSourceImpl({Uuid? uuid}) : _uuid = uuid ?? const Uuid();

  final Uuid _uuid;

  static final List<Industry> _industries = [
    const Industry(id: 'elektro', name: 'Elektro', iconName: 'bolt'),
    const Industry(id: 'sanitaer', name: 'Sanitär & Heizung', iconName: 'water'),
    const Industry(id: 'maler', name: 'Maler & Lackierer', iconName: 'brush'),
    const Industry(id: 'tischler', name: 'Tischlerei', iconName: 'carpenter'),
    const Industry(id: 'dach', name: 'Dachdecker', iconName: 'roofing'),
    const Industry(id: 'garten', name: 'Garten & Landschaft', iconName: 'yard'),
    const Industry(id: 'it', name: 'IT & Digital', iconName: 'computer'),
    const Industry(id: 'beratung', name: 'Unternehmensberatung', iconName: 'business'),
    const Industry(id: 'logistik', name: 'Logistik', iconName: 'local_shipping'),
    const Industry(id: 'reinigung', name: 'Gebäudereinigung', iconName: 'cleaning'),
  ];

  UserProfile _currentUser = UserProfile(
    id: 'user-self',
    name: 'Alex Müller',
    role: UserRole.seeker,
    industry: _industries[0],
    location: 'München',
    bio: 'Suche zuverlässige Partner für Wohn- und Gewerbeprojekte.',
    rating: 4.8,
    completedJobs: 12,
    companyName: null,
    avatarColorSeed: 0x0F4C5C,
  );

  final List<_StoredSwipe> _swipes = [];
  final List<Match> _matches = [];

  late final List<RecommendationCard> _allCards = _buildSeedCards();

  @override
  Future<UserProfile> getCurrentUser() async => _currentUser;

  @override
  Future<UserProfile> setUserRole(UserRole role) async {
    _currentUser = UserProfile(
      id: _currentUser.id,
      name: _currentUser.name,
      role: role,
      industry: role == UserRole.provider ? _industries[1] : _industries[0],
      location: _currentUser.location,
      bio: role == UserRole.provider
          ? 'Meisterbetrieb mit Fokus auf Qualität und Termintreue.'
          : 'Suche zuverlässige Partner für Wohn- und Gewerbeprojekte.',
      rating: _currentUser.rating,
      completedJobs: _currentUser.completedJobs,
      companyName: role == UserRole.provider ? 'Müller Technik GmbH' : null,
      avatarColorSeed: _currentUser.avatarColorSeed,
    );
    return _currentUser;
  }

  @override
  Future<List<Industry>> getIndustries() async => List.unmodifiable(_industries);

  @override
  Future<List<RecommendationCard>> getRecommendations(UserRole role) async {
    final swipedIds = _swipes.map((s) => s.cardId).toSet();
    return _allCards
        .where((card) => card.targetRole == role && !swipedIds.contains(card.id))
        .toList(growable: false);
  }

  @override
  Future<Match?> recordSwipe({
    required String cardId,
    required SwipeDirection direction,
  }) async {
    _swipes.add(
      _StoredSwipe(
        cardId: cardId,
        direction: direction,
        decidedAt: DateTime.now(),
      ),
    );

    if (!direction.isLike) {
      return null;
    }

    final card = _allCards.cast<RecommendationCard?>().firstWhere(
          (c) => c?.id == cardId,
          orElse: () => null,
        );
    if (card == null) {
      return null;
    }

    // Demo: ca. 40 % der Likes erzeugen einen Match (deterministisch über Hash).
    final shouldMatch = cardId.hashCode.abs() % 5 < 2;
    if (!shouldMatch) {
      return null;
    }

    final match = Match(
      id: _uuid.v4(),
      card: card,
      matchedAt: DateTime.now(),
      partnerName: card.ownerName,
      partnerCompany: card.subtitle,
    );
    _matches.insert(0, match);
    return match;
  }

  @override
  Future<List<Match>> getMatches() async => List.unmodifiable(_matches);

  @override
  Future<List<SwipeDecisionSummary>> getSwipeHistory() async {
    return _swipes
        .map(
          (s) => SwipeDecisionSummary(
            cardId: s.cardId,
            direction: s.direction,
            decidedAt: s.decidedAt,
          ),
        )
        .toList(growable: false);
  }

  List<RecommendationCard> _buildSeedCards() {
    return [
      // Für Suchende: Anbieter-Vorschläge
      RecommendationCard(
        id: 'rec-provider-1',
        title: 'Elektro Schmidt Meisterbetrieb',
        subtitle: 'Elektro · 12 Jahre Erfahrung',
        description:
            'Installation, Smart Home und Störungsdienst. Schnelle Reaktion im '
            'Großraum München, Festpreisangebote innerhalb von 24 Stunden.',
        industry: _industries[0],
        location: 'München-Schwabing',
        budgetLabel: 'ab 65 €/h',
        urgencyLabel: 'Verfügbar ab Mo',
        targetRole: UserRole.seeker,
        ownerId: 'p1',
        ownerName: 'Thomas Schmidt',
        tags: const ['Smart Home', 'Notdienst', 'Gewerbe'],
        distanceKm: 3.2,
        rating: 4.9,
      ),
      RecommendationCard(
        id: 'rec-provider-2',
        title: 'Wärme & Wasser GmbH',
        subtitle: 'Sanitär & Heizung',
        description:
            'Badsanierung, Wärmepumpen und Heizungsmodernisierung. '
            'Fachbetrieb mit eigenen Monteuren und 5 Jahren Garantie.',
        industry: _industries[1],
        location: 'Unterhaching',
        budgetLabel: 'Festpreis möglich',
        urgencyLabel: 'Kurzfristig',
        targetRole: UserRole.seeker,
        ownerId: 'p2',
        ownerName: 'Sara König',
        tags: const ['Wärmepumpe', 'Bad', 'Förderung'],
        distanceKm: 8.1,
        rating: 4.7,
      ),
      RecommendationCard(
        id: 'rec-provider-3',
        title: 'Farbe & Raum Studio',
        subtitle: 'Maler & Lackierer',
        description:
            'Innenanstriche, Spachteltechnik und Gewerbeobjekte. '
            'Saubere Baustellenführung und termintreue Abwicklung.',
        industry: _industries[2],
        location: 'München-West',
        budgetLabel: 'ab 28 €/m²',
        urgencyLabel: 'Nächste Woche',
        targetRole: UserRole.seeker,
        ownerId: 'p3',
        ownerName: 'Jonas Weber',
        tags: const ['Innenraum', 'Gewerbe', 'Ökofarbe'],
        distanceKm: 5.4,
        rating: 4.6,
      ),
      RecommendationCard(
        id: 'rec-provider-4',
        title: 'Holzwerkstatt Lindner',
        subtitle: 'Tischlerei',
        description:
            'Maßmöbel, Einbauten und Türen. Individuelle Beratung vor Ort '
            'und Produktion in der eigenen Werkstatt.',
        industry: _industries[3],
        location: 'Pasing',
        budgetLabel: 'Angebot nach Aufmaß',
        urgencyLabel: '2–3 Wochen',
        targetRole: UserRole.seeker,
        ownerId: 'p4',
        ownerName: 'Marie Lindner',
        tags: const ['Maßmöbel', 'Einbau', 'Eiche'],
        distanceKm: 11.0,
        rating: 4.8,
      ),
      RecommendationCard(
        id: 'rec-provider-5',
        title: 'DigiFlow Consulting',
        subtitle: 'IT & Digital',
        description:
            'Prozessdigitalisierung für Handwerksbetriebe: CRM, Terminplanung '
            'und digitale Auftragsabwicklung.',
        industry: _industries[6],
        location: 'Remote / München',
        budgetLabel: 'Tagessatz 890 €',
        urgencyLabel: 'Flexibel',
        targetRole: UserRole.seeker,
        ownerId: 'p5',
        ownerName: 'Leo Hartmann',
        tags: const ['CRM', 'Automation', 'Handwerk'],
        distanceKm: 0,
        rating: 4.5,
      ),
      RecommendationCard(
        id: 'rec-provider-6',
        title: 'Grünraum Bayer',
        subtitle: 'Garten & Landschaft',
        description:
            'Gartengestaltung, Pflasterarbeiten und Pflegeverträge für '
            'Privat- und Gewerbeimmobilien.',
        industry: _industries[5],
        location: 'Grünwald',
        budgetLabel: 'ab 1.200 €',
        urgencyLabel: 'Frühjahrstermine',
        targetRole: UserRole.seeker,
        ownerId: 'p6',
        ownerName: 'Nina Bayer',
        tags: const ['Gestaltung', 'Pflaster', 'Pflege'],
        distanceKm: 14.2,
        rating: 4.9,
      ),
      // Für Anbieter: Auftrags- / Empfehlungsanfragen
      RecommendationCard(
        id: 'rec-job-1',
        title: 'Elektroinstallation Neubau EFH',
        subtitle: 'Privatauftrag · Familie Berger',
        description:
            'Komplette Elektroinstallation für Einfamilienhaus (140 m²), '
            'inkl. Netzwerk und Wallbox. Start Wunsch: in 3 Wochen.',
        industry: _industries[0],
        location: 'München-Bogenhausen',
        budgetLabel: 'Budget ca. 18.000 €',
        urgencyLabel: 'Start in 3 Wochen',
        targetRole: UserRole.provider,
        ownerId: 's1',
        ownerName: 'Familie Berger',
        tags: const ['Neubau', 'Wallbox', 'Netzwerk'],
        distanceKm: 4.5,
      ),
      RecommendationCard(
        id: 'rec-job-2',
        title: 'Badsanierung 2 Bäder',
        subtitle: 'Eigentümergemeinschaft',
        description:
            'Sanierung von zwei Bädern in Mehrfamilienhaus. Fliesen, Sanitär '
            'und neue Armaturen. Koordination mit Hausverwaltung nötig.',
        industry: _industries[1],
        location: 'Sendling',
        budgetLabel: 'Budget 22–28.000 €',
        urgencyLabel: 'Dringend',
        targetRole: UserRole.provider,
        ownerId: 's2',
        ownerName: 'Hausverwaltung Nord',
        tags: const ['Sanierung', 'MFH', 'Fliesen'],
        distanceKm: 6.8,
      ),
      RecommendationCard(
        id: 'rec-job-3',
        title: 'Büroumbau & Innenanstrich',
        subtitle: 'Startup Hub GmbH',
        description:
            'Anstrich und leichte Trockenbauarbeiten für 280 m² Bürofläche. '
            'Abend- und Wochenendarbeiten bevorzugt.',
        industry: _industries[2],
        location: 'Werksviertel',
        budgetLabel: 'Budget 9.500 €',
        urgencyLabel: 'Diesen Monat',
        targetRole: UserRole.provider,
        ownerId: 's3',
        ownerName: 'Startup Hub GmbH',
        tags: const ['Büro', 'Trockenbau', 'Wochenende'],
        distanceKm: 2.1,
      ),
      RecommendationCard(
        id: 'rec-job-4',
        title: 'Empfehlung: Küchenumbau',
        subtitle: 'Weiterempfehlung von Partner',
        description:
            'Kunde sucht Tischlerei für maßgefertigte Küche. Projekt bereits '
            'von Sanitärpartner empfohlen – schnelle Kontaktaufnahme erwünscht.',
        industry: _industries[3],
        location: 'Haar',
        budgetLabel: 'Budget offen',
        urgencyLabel: 'Empfehlung',
        targetRole: UserRole.provider,
        ownerId: 's4',
        ownerName: 'Partner Netzwerk',
        tags: const ['Empfehlung', 'Küche', 'Maßarbeit'],
        distanceKm: 12.3,
      ),
      RecommendationCard(
        id: 'rec-job-5',
        title: 'Digitalisierung Auftragsabwicklung',
        subtitle: 'Handwerksbetrieb Süd',
        description:
            'Einführung digitaler Auftrags- und Rechnungsprozesse für '
            '10-Personen-Betrieb. Schulung inklusive.',
        industry: _industries[6],
        location: 'Augsburg / Hybrid',
        budgetLabel: 'Budget 6–8.000 €',
        urgencyLabel: 'Q3',
        targetRole: UserRole.provider,
        ownerId: 's5',
        ownerName: 'Handwerksbetrieb Süd',
        tags: const ['Digitalisierung', 'Schulung', 'KMU'],
        distanceKm: 55,
      ),
      RecommendationCard(
        id: 'rec-job-6',
        title: 'Dachsanierung Reihenhaus',
        subtitle: 'Privat · Familie Kraus',
        description:
            'Neue Dacheindeckung und Dämmung, ca. 120 m². Gerüststellung '
            'kann gestellt werden. Angebot mit Zeitplan erbeten.',
        industry: _industries[4],
        location: 'Ottobrunn',
        budgetLabel: 'Budget ca. 35.000 €',
        urgencyLabel: 'Herbsttermin',
        targetRole: UserRole.provider,
        ownerId: 's6',
        ownerName: 'Familie Kraus',
        tags: const ['Dach', 'Dämmung', 'EFH'],
        distanceKm: 16.0,
      ),
    ];
  }
}

final class _StoredSwipe {
  const _StoredSwipe({
    required this.cardId,
    required this.direction,
    required this.decidedAt,
  });

  final String cardId;
  final SwipeDirection direction;
  final DateTime decidedAt;
}
