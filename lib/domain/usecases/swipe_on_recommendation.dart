import '../entities/match.dart';
import '../entities/swipe_direction.dart';
import '../repositories/recommendation_repository.dart';

final class SwipeOnRecommendation {
  const SwipeOnRecommendation(this._repository);

  final RecommendationRepository _repository;

  Future<Match?> call({
    required String cardId,
    required SwipeDirection direction,
  }) =>
      _repository.swipe(cardId: cardId, direction: direction);
}
