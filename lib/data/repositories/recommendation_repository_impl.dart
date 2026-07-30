import '../../domain/entities/industry.dart';
import '../../domain/entities/match.dart';
import '../../domain/entities/recommendation_card.dart';
import '../../domain/entities/swipe_direction.dart';
import '../../domain/entities/user_profile.dart';
import '../../domain/entities/user_role.dart';
import '../../domain/repositories/recommendation_repository.dart';
import '../datasources/recommendation_local_data_source.dart';

/// Repository-Implementierung – kapselt die Datenquelle.
final class RecommendationRepositoryImpl implements RecommendationRepository {
  const RecommendationRepositoryImpl(this._localDataSource);

  final RecommendationLocalDataSource _localDataSource;

  @override
  Future<UserProfile> getCurrentUser() => _localDataSource.getCurrentUser();

  @override
  Future<UserProfile> setUserRole(UserRole role) =>
      _localDataSource.setUserRole(role);

  @override
  Future<List<Industry>> getIndustries() => _localDataSource.getIndustries();

  @override
  Future<List<RecommendationCard>> getRecommendations(UserRole role) =>
      _localDataSource.getRecommendations(role);

  @override
  Future<Match?> swipe({
    required String cardId,
    required SwipeDirection direction,
  }) =>
      _localDataSource.recordSwipe(cardId: cardId, direction: direction);

  @override
  Future<List<Match>> getMatches() => _localDataSource.getMatches();

  @override
  Future<List<SwipeDecisionSummary>> getSwipeHistory() =>
      _localDataSource.getSwipeHistory();
}
