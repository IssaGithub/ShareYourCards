import '../entities/user_profile.dart';
import '../entities/user_role.dart';
import '../repositories/recommendation_repository.dart';

final class SetUserRole {
  const SetUserRole(this._repository);

  final RecommendationRepository _repository;

  Future<UserProfile> call(UserRole role) => _repository.setUserRole(role);
}
