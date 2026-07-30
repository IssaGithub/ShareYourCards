import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_colors.dart';
import '../../domain/entities/user_role.dart';
import '../providers/app_state.dart';

/// Profil und Rollenwechsel.
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final user = state.currentUser;
    final theme = Theme.of(context);

    if (user == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.sand,
      appBar: AppBar(
        title: const Text('Profil'),
        backgroundColor: AppColors.sand,
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
        children: [
          Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppColors.petrolDark, AppColors.petrol],
              ),
              borderRadius: BorderRadius.circular(22),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CircleAvatar(
                  radius: 32,
                  backgroundColor: AppColors.copper,
                  child: Text(
                    user.name.isNotEmpty
                        ? user.name.substring(0, 1).toUpperCase()
                        : '?',
                    style: theme.textTheme.headlineMedium?.copyWith(
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  user.displayTitle,
                  style: theme.textTheme.headlineMedium?.copyWith(
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  user.name,
                  style: theme.textTheme.bodyLarge?.copyWith(
                    color: Colors.white70,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  user.bio,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: Colors.white.withValues(alpha: 0.85),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    _Stat(
                      label: 'Bewertung',
                      value: user.rating.toStringAsFixed(1),
                    ),
                    const SizedBox(width: 18),
                    _Stat(
                      label: 'Abgeschlossen',
                      value: '${user.completedJobs}',
                    ),
                    const SizedBox(width: 18),
                    _Stat(label: 'Ort', value: user.location),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Text('Aktuelle Rolle', style: theme.textTheme.titleLarge),
          const SizedBox(height: 8),
          Text(
            'Wechsle zwischen Suchende:r und Anbieter:in. '
            'Das Swipe-Deck zeigt dann passende Vorschläge.',
            style: theme.textTheme.bodyMedium,
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _RoleToggle(
                  role: UserRole.seeker,
                  selected: user.role == UserRole.seeker,
                  onTap: () => state.switchRole(UserRole.seeker),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _RoleToggle(
                  role: UserRole.provider,
                  selected: user.role == UserRole.provider,
                  onTap: () => state.switchRole(UserRole.provider),
                ),
              ),
            ],
          ),
          const SizedBox(height: 28),
          Text('Branche', style: theme.textTheme.titleLarge),
          const SizedBox(height: 10),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.sandDark),
            ),
            child: Text(
              user.industry.name,
              style: theme.textTheme.bodyLarge,
            ),
          ),
          const SizedBox(height: 28),
          Text('So funktioniert Swipe', style: theme.textTheme.titleLarge),
          const SizedBox(height: 10),
          const _HintTile(
            icon: Icons.swipe_right_alt,
            title: 'Rechts wischen',
            subtitle: 'Interesse zeigen – erhöht die Gewichtung / Chance auf Match',
          ),
          const SizedBox(height: 10),
          const _HintTile(
            icon: Icons.swipe_left_alt,
            title: 'Links wischen',
            subtitle: 'Ablehnen – Vorschlag wird ausgeblendet',
          ),
        ],
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  const _Stat({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          value,
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                color: Colors.white,
              ),
        ),
        Text(
          label,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Colors.white60,
                fontSize: 12,
              ),
        ),
      ],
    );
  }
}

class _RoleToggle extends StatelessWidget {
  const _RoleToggle({
    required this.role,
    required this.selected,
    required this.onTap,
  });

  final UserRole role;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? AppColors.petrol : AppColors.surface,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: selected ? AppColors.petrol : AppColors.sandDark,
            ),
          ),
          child: Text(
            role.label,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.labelLarge?.copyWith(
                  color: selected ? Colors.white : AppColors.ink,
                ),
          ),
        ),
      ),
    );
  }
}

class _HintTile extends StatelessWidget {
  const _HintTile({
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  final IconData icon;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.sandDark),
      ),
      child: Row(
        children: [
          Icon(icon, color: AppColors.copper, size: 28),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 2),
                Text(subtitle, style: Theme.of(context).textTheme.bodyMedium),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
