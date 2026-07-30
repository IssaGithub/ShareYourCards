import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';

/// Buttons unter dem Swipe-Deck.
class SwipeActionButtons extends StatelessWidget {
  const SwipeActionButtons({
    required this.onPass,
    required this.onLike,
    super.key,
  });

  final VoidCallback onPass;
  final VoidCallback onLike;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _RoundAction(
            icon: Icons.close_rounded,
            color: AppColors.pass,
            label: 'Links',
            onTap: onPass,
          ),
          _RoundAction(
            icon: Icons.favorite_rounded,
            color: AppColors.like,
            label: 'Rechts',
            large: true,
            onTap: onLike,
          ),
        ],
      ),
    );
  }
}

class _RoundAction extends StatelessWidget {
  const _RoundAction({
    required this.icon,
    required this.color,
    required this.label,
    required this.onTap,
    this.large = false,
  });

  final IconData icon;
  final Color color;
  final String label;
  final VoidCallback onTap;
  final bool large;

  @override
  Widget build(BuildContext context) {
    final size = large ? 72.0 : 60.0;
    return Column(
      children: [
        Material(
          color: Colors.white,
          elevation: 4,
          shadowColor: color.withValues(alpha: 0.35),
          shape: const CircleBorder(),
          child: InkWell(
            customBorder: const CircleBorder(),
            onTap: onTap,
            child: SizedBox(
              width: size,
              height: size,
              child: Icon(icon, color: color, size: large ? 34 : 28),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.inkMuted,
              ),
        ),
      ],
    );
  }
}
