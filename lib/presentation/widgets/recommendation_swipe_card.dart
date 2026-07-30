import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../domain/entities/recommendation_card.dart';
import '../../domain/entities/user_role.dart';

/// Visuelle Swipe-Karte mit Overlay für Like/Pass.
class RecommendationSwipeCard extends StatelessWidget {
  const RecommendationSwipeCard({
    required this.card,
    this.swipeProgress = 0,
    super.key,
  });

  final RecommendationCard card;

  /// -1 … 1 (links negativ, rechts positiv).
  final double swipeProgress;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final likeOpacity = swipeProgress.clamp(0.0, 1.0);
    final passOpacity = (-swipeProgress).clamp(0.0, 1.0);

    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: AppColors.ink.withValues(alpha: 0.12),
            blurRadius: 24,
            offset: const Offset(0, 12),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: Stack(
          fit: StackFit.expand,
          children: [
            DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppColors.petrolDark,
                    AppColors.petrol,
                    AppColors.petrolLight.withValues(alpha: 0.9),
                    const Color(0xFF2A6F5E),
                  ],
                ),
              ),
            ),
            CustomPaint(painter: _PatternPainter()),
            Padding(
              padding: const EdgeInsets.all(22),
              child: LayoutBuilder(
                builder: (context, constraints) {
                  return SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    child: ConstrainedBox(
                      constraints: BoxConstraints(
                        minHeight: constraints.maxHeight,
                      ),
                      child: IntrinsicHeight(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                _Pill(
                                  label: card.industry.name,
                                  background:
                                      Colors.white.withValues(alpha: 0.15),
                                ),
                                const Spacer(),
                                if (card.distanceKm != null)
                                  _Pill(
                                    label: card.distanceKm! < 1
                                        ? 'Remote'
                                        : '${card.distanceKm!.toStringAsFixed(1)} km',
                                    background: Colors.white
                                        .withValues(alpha: 0.15),
                                  ),
                              ],
                            ),
                            const Spacer(),
                            const SizedBox(height: 16),
                            Text(
                              card.title,
                              style: theme.textTheme.displayMedium?.copyWith(
                                color: Colors.white,
                                fontSize: 28,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              card.subtitle,
                              style: theme.textTheme.bodyLarge?.copyWith(
                                color: AppColors.copperSoft,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              card.description,
                              maxLines: 4,
                              overflow: TextOverflow.ellipsis,
                              style: theme.textTheme.bodyLarge?.copyWith(
                                color: Colors.white.withValues(alpha: 0.9),
                                height: 1.4,
                              ),
                            ),
                            const SizedBox(height: 20),
                            Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: card.tags
                                  .map(
                                    (tag) => _Pill(
                                      label: tag,
                                      background: Colors.white
                                          .withValues(alpha: 0.12),
                                    ),
                                  )
                                  .toList(),
                            ),
                            const SizedBox(height: 20),
                            Row(
                              children: [
                                const Icon(
                                  Icons.place_outlined,
                                  color: Colors.white70,
                                  size: 18,
                                ),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    card.location,
                                    style:
                                        theme.textTheme.bodyMedium?.copyWith(
                                      color: Colors.white70,
                                    ),
                                  ),
                                ),
                                if (card.rating != null) ...[
                                  const Icon(
                                    Icons.star_rounded,
                                    color: AppColors.matchGold,
                                    size: 20,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    card.rating!.toStringAsFixed(1),
                                    style:
                                        theme.textTheme.labelLarge?.copyWith(
                                      color: Colors.white,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                            const SizedBox(height: 16),
                            Row(
                              children: [
                                Expanded(
                                  child: _MetaTile(
                                    icon: Icons.payments_outlined,
                                    label: card.budgetLabel,
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: _MetaTile(
                                    icon: Icons.schedule_outlined,
                                    label: card.urgencyLabel,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              card.targetRole == UserRole.seeker
                                  ? 'Anbieter-Vorschlag'
                                  : 'Auftrags- / Empfehlungsanfrage',
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: Colors.white54,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            if (likeOpacity > 0.05)
              Positioned(
                top: 28,
                left: 24,
                child: Opacity(
                  opacity: likeOpacity,
                  child: const _SwipeBadge(
                    label: 'INTERESSE',
                    color: AppColors.like,
                    angle: -0.2,
                  ),
                ),
              ),
            if (passOpacity > 0.05)
              Positioned(
                top: 28,
                right: 24,
                child: Opacity(
                  opacity: passOpacity,
                  child: const _SwipeBadge(
                    label: 'ABLEHNEN',
                    color: AppColors.pass,
                    angle: 0.2,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _Pill extends StatelessWidget {
  const _Pill({required this.label, required this.background});

  final String label;
  final Color background;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(
        label,
        style: Theme.of(context).textTheme.labelLarge?.copyWith(
              color: Colors.white,
              fontSize: 12,
            ),
      ),
    );
  }
}

class _MetaTile extends StatelessWidget {
  const _MetaTile({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(icon, size: 16, color: Colors.white70),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.labelLarge?.copyWith(
                    color: Colors.white,
                    fontSize: 12,
                  ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SwipeBadge extends StatelessWidget {
  const _SwipeBadge({
    required this.label,
    required this.color,
    required this.angle,
  });

  final String label;
  final Color color;
  final double angle;

  @override
  Widget build(BuildContext context) {
    return Transform.rotate(
      angle: angle,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          border: Border.all(color: color, width: 3),
          borderRadius: BorderRadius.circular(8),
          color: color.withValues(alpha: 0.15),
        ),
        child: Text(
          label,
          style: Theme.of(context).textTheme.labelLarge?.copyWith(
                color: color,
                fontWeight: FontWeight.w800,
                letterSpacing: 1.2,
              ),
        ),
      ),
    );
  }
}

class _PatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withValues(alpha: 0.04)
      ..strokeWidth = 1;

    const step = 28.0;
    for (double x = 0; x < size.width + size.height; x += step) {
      canvas.drawLine(
        Offset(x, 0),
        Offset(x - size.height, size.height),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
