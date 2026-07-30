import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../core/constants/app_constants.dart';
import '../core/theme/app_theme.dart';
import '../data/datasources/recommendation_local_data_source_impl.dart';
import '../data/repositories/recommendation_repository_impl.dart';
import '../domain/usecases/get_current_user.dart';
import '../domain/usecases/get_matches.dart';
import '../domain/usecases/get_recommendations.dart';
import '../domain/usecases/set_user_role.dart';
import '../domain/usecases/swipe_on_recommendation.dart';
import 'presentation/providers/app_state.dart';
import 'presentation/screens/home_shell.dart';
import 'presentation/screens/onboarding_screen.dart';

/// Dependency Injection und Root-Widget.
class EmpfehlungsportalApp extends StatelessWidget {
  const EmpfehlungsportalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider(
          create: (_) => RecommendationLocalDataSourceImpl(),
        ),
        ProxyProvider<RecommendationLocalDataSourceImpl,
            RecommendationRepositoryImpl>(
          update: (_, dataSource, _) =>
              RecommendationRepositoryImpl(dataSource),
        ),
        ChangeNotifierProvider(
          create: (context) {
            final repository = context.read<RecommendationRepositoryImpl>();
            final appState = AppState(
              getCurrentUser: GetCurrentUser(repository),
              setUserRole: SetUserRole(repository),
              getRecommendations: GetRecommendations(repository),
              swipeOnRecommendation: SwipeOnRecommendation(repository),
              getMatches: GetMatches(repository),
            );
            appState.initialize();
            return appState;
          },
        ),
      ],
      child: MaterialApp(
        title: AppConstants.appName,
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        home: const _RootGate(),
      ),
    );
  }
}

class _RootGate extends StatelessWidget {
  const _RootGate();

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();

    if (state.loadState == AppLoadState.loading ||
        state.loadState == AppLoadState.initial) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (state.loadState == AppLoadState.error) {
      return Scaffold(
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(state.errorMessage ?? 'Unbekannter Fehler'),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => context.read<AppState>().initialize(),
                  child: const Text('Erneut versuchen'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    if (!state.hasCompletedOnboarding) {
      return const OnboardingScreen();
    }

    return const HomeShell();
  }
}
