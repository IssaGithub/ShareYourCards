import '../entities/industry.dart';
import '../repositories/recommendation_repository.dart';

final class GetIndustries {
  const GetIndustries(this._repository);

  final RecommendationRepository _repository;

  Future<List<Industry>> call() => _repository.getIndustries();
}
