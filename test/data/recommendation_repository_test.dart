import 'package:empfehlungsportal/data/datasources/recommendation_local_data_source_impl.dart';
import 'package:empfehlungsportal/data/repositories/recommendation_repository_impl.dart';
import 'package:empfehlungsportal/domain/entities/swipe_direction.dart';
import 'package:empfehlungsportal/domain/entities/user_role.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  late RecommendationRepositoryImpl repository;

  setUp(() {
    repository = RecommendationRepositoryImpl(
      RecommendationLocalDataSourceImpl(),
    );
  });

  group('RecommendationRepository', () {
    test('liefert Branchen', () async {
      final industries = await repository.getIndustries();
      expect(industries, isNotEmpty);
      expect(industries.first.name, isNotEmpty);
    });

    test('Suchende erhalten Anbieter-Vorschläge', () async {
      await repository.setUserRole(UserRole.seeker);
      final cards = await repository.getRecommendations(UserRole.seeker);
      expect(cards, isNotEmpty);
      expect(
        cards.every((c) => c.targetRole == UserRole.seeker),
        isTrue,
      );
    });

    test('Anbieter erhalten Auftrags-Vorschläge', () async {
      await repository.setUserRole(UserRole.provider);
      final cards = await repository.getRecommendations(UserRole.provider);
      expect(cards, isNotEmpty);
      expect(
        cards.every((c) => c.targetRole == UserRole.provider),
        isTrue,
      );
    });

    test('Linker Swipe entfernt Karte ohne Match', () async {
      final cards = await repository.getRecommendations(UserRole.seeker);
      final firstId = cards.first.id;

      final match = await repository.swipe(
        cardId: firstId,
        direction: SwipeDirection.left,
      );

      expect(match, isNull);
      final remaining = await repository.getRecommendations(UserRole.seeker);
      expect(remaining.any((c) => c.id == firstId), isFalse);
    });

    test('Rechter Swipe kann Match erzeugen', () async {
      final cards = await repository.getRecommendations(UserRole.seeker);
      MatchCount matchesFound = 0;

      for (final card in cards) {
        final match = await repository.swipe(
          cardId: card.id,
          direction: SwipeDirection.right,
        );
        if (match != null) {
          matchesFound++;
        }
      }

      final stored = await repository.getMatches();
      expect(stored.length, matchesFound);
      expect(matchesFound, greaterThan(0));
    });
  });
}

typedef MatchCount = int;
