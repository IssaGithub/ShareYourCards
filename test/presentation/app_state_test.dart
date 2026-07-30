import 'package:empfehlungsportal/domain/entities/industry.dart';
import 'package:empfehlungsportal/domain/entities/recommendation_card.dart';
import 'package:empfehlungsportal/domain/entities/swipe_direction.dart';
import 'package:empfehlungsportal/domain/entities/user_profile.dart';
import 'package:empfehlungsportal/domain/entities/user_role.dart';
import 'package:empfehlungsportal/domain/repositories/recommendation_repository.dart';
import 'package:empfehlungsportal/domain/usecases/get_recommendations.dart';
import 'package:empfehlungsportal/domain/usecases/swipe_on_recommendation.dart';
import 'package:empfehlungsportal/presentation/providers/app_state.dart';
import 'package:empfehlungsportal/domain/usecases/get_current_user.dart';
import 'package:empfehlungsportal/domain/usecases/get_matches.dart';
import 'package:empfehlungsportal/domain/usecases/set_user_role.dart';
import 'package:empfehlungsportal/domain/entities/match.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class _MockRepo extends Mock implements RecommendationRepository {}

void main() {
  late _MockRepo repository;
  late AppState appState;

  const industry = Industry(
    id: 'elektro',
    name: 'Elektro',
    iconName: 'bolt',
  );

  const user = UserProfile(
    id: 'u1',
    name: 'Test',
    role: UserRole.seeker,
    industry: industry,
    location: 'München',
    bio: 'Bio',
    rating: 4.5,
    completedJobs: 3,
  );

  const card = RecommendationCard(
    id: 'c1',
    title: 'Test Anbieter',
    subtitle: 'Elektro',
    description: 'Beschreibung',
    industry: industry,
    location: 'München',
    budgetLabel: '100 €',
    urgencyLabel: 'Sofort',
    targetRole: UserRole.seeker,
    ownerId: 'o1',
    ownerName: 'Owner',
    tags: ['A'],
  );

  setUpAll(() {
    registerFallbackValue(UserRole.seeker);
    registerFallbackValue(SwipeDirection.right);
  });

  setUp(() {
    repository = _MockRepo();
    when(() => repository.getCurrentUser()).thenAnswer((_) async => user);
    when(() => repository.getMatches()).thenAnswer((_) async => []);
    when(() => repository.getRecommendations(any()))
        .thenAnswer((_) async => [card]);
    when(() => repository.setUserRole(any())).thenAnswer((_) async => user);

    appState = AppState(
      getCurrentUser: GetCurrentUser(repository),
      setUserRole: SetUserRole(repository),
      getRecommendations: GetRecommendations(repository),
      swipeOnRecommendation: SwipeOnRecommendation(repository),
      getMatches: GetMatches(repository),
    );
  });

  test('Onboarding lädt Empfehlungen', () async {
    await appState.completeOnboarding(UserRole.seeker);

    expect(appState.hasCompletedOnboarding, isTrue);
    expect(appState.recommendations, hasLength(1));
    expect(appState.loadState, AppLoadState.ready);
  });

  test('Swipe entfernt Karte und speichert Match', () async {
    await appState.completeOnboarding(UserRole.seeker);

    final match = Match(
      id: 'm1',
      card: card,
      matchedAt: DateTime(2026, 1, 1),
      partnerName: 'Owner',
      partnerCompany: 'Elektro',
    );

    when(
      () => repository.swipe(
        cardId: any(named: 'cardId'),
        direction: any(named: 'direction'),
      ),
    ).thenAnswer((_) async => match);

    final result = await appState.swipe(0, SwipeDirection.right);

    expect(result, match);
    expect(appState.recommendations, isEmpty);
    expect(appState.matches, contains(match));
  });
}
