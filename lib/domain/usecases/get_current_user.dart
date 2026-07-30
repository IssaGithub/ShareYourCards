import '../entities/user_profile.dart';
import '../repositories/recommendation_repository.dart';

final class GetCurrentUser {
  const GetCurrentUser(this._repository);

  final RecommendationRepository _repository;

  Future<UserProfile> call() => _repository.getCurrentUser();
}
