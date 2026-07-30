import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../core/theme/app_colors.dart';
import '../../domain/entities/match.dart';
import '../providers/app_state.dart';

/// Liste der gegenseitigen Matches.
class MatchesScreen extends StatelessWidget {
  const MatchesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final matches = context.watch<AppState>().matches;
    final dateFormat = DateFormat('dd.MM.yyyy · HH:mm');

    return Scaffold(
      backgroundColor: AppColors.sand,
      appBar: AppBar(
        title: const Text('Matches'),
        backgroundColor: AppColors.sand,
      ),
      body: matches.isEmpty
          ? const _EmptyMatches()
          : ListView.separated(
              padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
              itemCount: matches.length,
              separatorBuilder: (_, _) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                return _MatchTile(
                  match: matches[index],
                  dateLabel: dateFormat.format(matches[index].matchedAt),
                );
              },
            ),
    );
  }
}

class _MatchTile extends StatelessWidget {
  const _MatchTile({
    required this.match,
    required this.dateLabel,
  });

  final Match match;
  final String dateLabel;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.sandDark),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.petrol.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(
              Icons.handshake_rounded,
              color: AppColors.petrol,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(match.card.title, style: theme.textTheme.titleLarge),
                const SizedBox(height: 4),
                Text(
                  '${match.partnerName} · ${match.partnerCompany}',
                  style: theme.textTheme.bodyMedium,
                ),
                const SizedBox(height: 8),
                Text(
                  '${match.card.industry.name} · ${match.card.location}',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: AppColors.petrol,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  dateLabel,
                  style: theme.textTheme.bodyMedium?.copyWith(fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyMatches extends StatelessWidget {
  const _EmptyMatches();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.handshake_outlined,
              size: 56,
              color: AppColors.petrol.withValues(alpha: 0.4),
            ),
            const SizedBox(height: 16),
            Text(
              'Noch keine Matches',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            Text(
              'Wische nach rechts, wenn ein Vorschlag interessant ist. '
              'Bei gegenseitigem Interesse entsteht ein Match.',
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
