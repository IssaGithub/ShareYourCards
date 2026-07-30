import '../../domain/entities/industry.dart';
import '../../domain/entities/match.dart';
import '../../domain/entities/recommendation_card.dart';
import '../../domain/entities/swipe_direction.dart';
import '../../domain/entities/user_profile.dart';
import '../../domain/entities/user_role.dart';
import '../../domain/repositories/recommendation_repository.dart';

/// Abstrakte Datenquelle für lokale/Demo-Daten.
abstract interface class RecommendationLocalDataSource {
  Future<UserProfile> getCurrentUser();

  Future<UserProfile> setUserRole(UserRole role);

  Future<List<Industry>> getIndustries();

  Future<List<RecommendationCard>> getRecommendations(UserRole role);

  Future<Match?> recordSwipe({
    required String cardId,
    required SwipeDirection direction,
  });

  Future<List<Match>> getMatches();

  Future<List<SwipeDecisionSummary>> getSwipeHistory();
}
