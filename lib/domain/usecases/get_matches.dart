import '../entities/match.dart';
import '../repositories/recommendation_repository.dart';

final class GetMatches {
  const GetMatches(this._repository);

  final RecommendationRepository _repository;

  Future<List<Match>> call() => _repository.getMatches();
}
