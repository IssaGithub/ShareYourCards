import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/constants/app_constants.dart';
import '../../core/theme/app_colors.dart';
import '../../domain/entities/user_role.dart';
import '../providers/app_state.dart';

/// Rollenwahl: Suchende oder Anbieter.
class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppColors.petrolDark,
              AppColors.petrol,
              Color(0xFF1A5A4A),
            ],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Spacer(flex: 2),
                Text(
                  AppConstants.appName,
                  style: theme.textTheme.displayLarge?.copyWith(
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  AppConstants.appTagline,
                  style: theme.textTheme.bodyLarge?.copyWith(
                    color: Colors.white.withValues(alpha: 0.85),
                    fontSize: 18,
                  ),
                ),
                const Spacer(flex: 2),
                Text(
                  'Wie möchtest du starten?',
                  style: theme.textTheme.titleLarge?.copyWith(
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Suchende und Anbieter erhalten passende Vorschläge – '
                  'rechts werten, links ablehnen.',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: Colors.white.withValues(alpha: 0.75),
                  ),
                ),
                const SizedBox(height: 28),
                _RoleCard(
                  role: UserRole.seeker,
                  icon: Icons.search_rounded,
                  onTap: () => context
                      .read<AppState>()
                      .completeOnboarding(UserRole.seeker),
                ),
                const SizedBox(height: 14),
                _RoleCard(
                  role: UserRole.provider,
                  icon: Icons.handyman_rounded,
                  onTap: () => context
                      .read<AppState>()
                      .completeOnboarding(UserRole.provider),
                ),
                const Spacer(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _RoleCard extends StatelessWidget {
  const _RoleCard({
    required this.role,
    required this.icon,
    required this.onTap,
  });

  final UserRole role;
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white.withValues(alpha: 0.1),
      borderRadius: BorderRadius.circular(18),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: AppColors.copper.withValues(alpha: 0.9),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(icon, color: Colors.white, size: 28),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      role.label,
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            color: Colors.white,
                          ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      role.description,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: Colors.white.withValues(alpha: 0.75),
                          ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.arrow_forward_ios_rounded,
                color: Colors.white.withValues(alpha: 0.6),
                size: 18,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
