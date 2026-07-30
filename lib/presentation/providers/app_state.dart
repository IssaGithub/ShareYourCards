import 'package:flutter/foundation.dart';

import '../../domain/entities/match.dart';
import '../../domain/entities/recommendation_card.dart';
import '../../domain/entities/swipe_direction.dart';
import '../../domain/entities/user_profile.dart';
import '../../domain/entities/user_role.dart';
import '../../domain/usecases/get_current_user.dart';
import '../../domain/usecases/get_matches.dart';
import '../../domain/usecases/get_recommendations.dart';
import '../../domain/usecases/set_user_role.dart';
import '../../domain/usecases/swipe_on_recommendation.dart';

enum AppLoadState { initial, loading, ready, error }

/// Zentraler App-State für Rolle, Swipe-Deck und Matches.
final class AppState extends ChangeNotifier {
  AppState({
    required GetCurrentUser getCurrentUser,
    required SetUserRole setUserRole,
    required GetRecommendations getRecommendations,
    required SwipeOnRecommendation swipeOnRecommendation,
    required GetMatches getMatches,
  })  : _getCurrentUser = getCurrentUser,
        _setUserRole = setUserRole,
        _getRecommendations = getRecommendations,
        _swipeOnRecommendation = swipeOnRecommendation,
        _getMatches = getMatches;

  final GetCurrentUser _getCurrentUser;
  final SetUserRole _setUserRole;
  final GetRecommendations _getRecommendations;
  final SwipeOnRecommendation _swipeOnRecommendation;
  final GetMatches _getMatches;

  AppLoadState loadState = AppLoadState.initial;
  String? errorMessage;
  UserProfile? currentUser;
  List<RecommendationCard> recommendations = const [];
  List<Match> matches = const [];
  Match? lastMatch;
  bool hasCompletedOnboarding = false;

  bool get isReady => loadState == AppLoadState.ready && currentUser != null;

  Future<void> initialize() async {
    loadState = AppLoadState.loading;
    errorMessage = null;
    notifyListeners();

    try {
      currentUser = await _getCurrentUser();
      matches = await _getMatches();
      if (hasCompletedOnboarding) {
        await _loadRecommendations();
      }
      loadState = AppLoadState.ready;
    } on Object catch (e) {
      loadState = AppLoadState.error;
      errorMessage = e.toString();
    }
    notifyListeners();
  }

  Future<void> completeOnboarding(UserRole role) async {
    loadState = AppLoadState.loading;
    notifyListeners();

    try {
      currentUser = await _setUserRole(role);
      hasCompletedOnboarding = true;
      await _loadRecommendations();
      matches = await _getMatches();
      loadState = AppLoadState.ready;
    } on Object catch (e) {
      loadState = AppLoadState.error;
      errorMessage = e.toString();
    }
    notifyListeners();
  }

  Future<void> switchRole(UserRole role) async {
    if (currentUser?.role == role) {
      return;
    }
    loadState = AppLoadState.loading;
    notifyListeners();

    try {
      currentUser = await _setUserRole(role);
      await _loadRecommendations();
      loadState = AppLoadState.ready;
    } on Object catch (e) {
      loadState = AppLoadState.error;
      errorMessage = e.toString();
    }
    notifyListeners();
  }

  Future<Match?> swipe(
    int index,
    SwipeDirection direction,
  ) async {
    if (index < 0 || index >= recommendations.length) {
      return null;
    }

    final card = recommendations[index];
    final match = await _swipeOnRecommendation(
      cardId: card.id,
      direction: direction,
    );

    recommendations = List<RecommendationCard>.from(recommendations)
      ..removeAt(index);

    if (match != null) {
      lastMatch = match;
      matches = [match, ...matches];
    }
    notifyListeners();
    return match;
  }

  void clearLastMatch() {
    lastMatch = null;
    notifyListeners();
  }

  Future<void> refreshMatches() async {
    matches = await _getMatches();
    notifyListeners();
  }

  Future<void> _loadRecommendations() async {
    final role = currentUser?.role;
    if (role == null) {
      recommendations = const [];
      return;
    }
    recommendations = await _getRecommendations(role);
  }
}
