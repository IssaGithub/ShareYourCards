import 'package:flutter/material.dart';
import 'package:flutter_card_swiper/flutter_card_swiper.dart';
import 'package:provider/provider.dart';

import '../../core/constants/app_constants.dart';
import '../../core/theme/app_colors.dart';
import '../../domain/entities/swipe_direction.dart';
import '../../domain/entities/user_role.dart';
import '../providers/app_state.dart';
import '../widgets/match_dialog.dart';
import '../widgets/recommendation_swipe_card.dart';
import '../widgets/swipe_action_buttons.dart';

/// Swipe-Deck mit Vorschlägen für Suchende bzw. Anbieter.
class DiscoverScreen extends StatefulWidget {
  const DiscoverScreen({super.key});

  @override
  State<DiscoverScreen> createState() => _DiscoverScreenState();
}

class _DiscoverScreenState extends State<DiscoverScreen> {
  final CardSwiperController _controller = CardSwiperController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final role = state.currentUser?.role ?? UserRole.seeker;
    final cards = state.recommendations;

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              AppColors.sand,
              Color(0xFFE8DFD0),
              AppColors.sandDark,
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 8),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            AppConstants.appName,
                            style: Theme.of(context).textTheme.headlineMedium,
                          ),
                          const SizedBox(height: 2),
                          Text(
                            role == UserRole.seeker
                                ? 'Anbieter-Vorschläge für dich'
                                : 'Aufträge & Empfehlungen für dich',
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ],
                      ),
                    ),
                    _RoleChip(role: role),
                  ],
                ),
              ),
              Expanded(
                child: cards.isEmpty
                    ? const _EmptyDeck()
                    : Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: CardSwiper(
                          controller: _controller,
                          cardsCount: cards.length,
                          numberOfCardsDisplayed:
                              cards.length < 2 ? cards.length : 2,
                          backCardOffset: const Offset(0, 28),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          isLoop: false,
                          onSwipe: (previousIndex, currentIndex, direction) {
                            return _handleSwipe(
                              context,
                              previousIndex,
                              direction,
                            );
                          },
                          cardBuilder: (
                            context,
                            index,
                            horizontalThresholdPercentage,
                            verticalThresholdPercentage,
                          ) {
                            return RecommendationSwipeCard(
                              card: cards[index],
                              swipeProgress: horizontalThresholdPercentage / 100,
                            );
                          },
                        ),
                      ),
              ),
              if (cards.isNotEmpty)
                SwipeActionButtons(
                  onPass: () => _controller.swipe(CardSwiperDirection.left),
                  onLike: () => _controller.swipe(CardSwiperDirection.right),
                ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }

  Future<bool> _handleSwipe(
    BuildContext context,
    int previousIndex,
    CardSwiperDirection direction,
  ) async {
    final swipeDirection = direction == CardSwiperDirection.right
        ? SwipeDirection.right
        : SwipeDirection.left;

    final appState = context.read<AppState>();
    final match = await appState.swipe(previousIndex, swipeDirection);

    if (match != null && context.mounted) {
      await showMatchDialog(context, match);
      appState.clearLastMatch();
    }
    return true;
  }
}

class _RoleChip extends StatelessWidget {
  const _RoleChip({required this.role});

  final UserRole role;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.petrol.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.petrol.withValues(alpha: 0.25)),
      ),
      child: Text(
        role.label,
        style: Theme.of(context).textTheme.labelLarge?.copyWith(
              color: AppColors.petrol,
              fontSize: 13,
            ),
      ),
    );
  }
}

class _EmptyDeck extends StatelessWidget {
  const _EmptyDeck();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.check_circle_outline,
              size: 64,
              color: AppColors.petrol.withValues(alpha: 0.5),
            ),
            const SizedBox(height: 16),
            Text(
              'Keine weiteren Vorschläge',
              style: Theme.of(context).textTheme.headlineMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Du hast alle aktuellen Empfehlungen bewertet. '
              'Schau später wieder vorbei oder wechsle die Rolle.',
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
