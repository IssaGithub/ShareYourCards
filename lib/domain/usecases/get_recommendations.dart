import '../entities/recommendation_card.dart';
import '../entities/user_role.dart';
import '../repositories/recommendation_repository.dart';

final class GetRecommendations {
  const GetRecommendations(this._repository);

  final RecommendationRepository _repository;

  Future<List<RecommendationCard>> call(UserRole role) =>
      _repository.getRecommendations(role);
}
