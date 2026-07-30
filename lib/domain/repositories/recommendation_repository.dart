import '../entities/industry.dart';
import '../entities/match.dart';
import '../entities/recommendation_card.dart';
import '../entities/swipe_direction.dart';
import '../entities/user_profile.dart';
import '../entities/user_role.dart';

/// Vertrag für Empfehlungs- und Matching-Daten.
abstract interface class RecommendationRepository {
  Future<UserProfile> getCurrentUser();

  Future<UserProfile> setUserRole(UserRole role);

  Future<List<Industry>> getIndustries();

  Future<List<RecommendationCard>> getRecommendations(UserRole role);

  /// Speichert den Swipe und liefert optional einen Match.
  Future<Match?> swipe({
    required String cardId,
    required SwipeDirection direction,
  });

  Future<List<Match>> getMatches();

  Future<List<SwipeDecisionSummary>> getSwipeHistory();
}

final class SwipeDecisionSummary {
  const SwipeDecisionSummary({
    required this.cardId,
    required this.direction,
    required this.decidedAt,
  });

  final String cardId;
  final SwipeDirection direction;
  final DateTime decidedAt;
}
