import 'package:equatable/equatable.dart';

import 'industry.dart';
import 'user_role.dart';

/// Vorschlagskarte im Swipe-Stack (Auftrag oder Anbieterprofil).
final class RecommendationCard extends Equatable {
  const RecommendationCard({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.description,
    required this.industry,
    required this.location,
    required this.budgetLabel,
    required this.urgencyLabel,
    required this.targetRole,
    required this.ownerId,
    required this.ownerName,
    required this.tags,
    this.distanceKm,
    this.rating,
  });

  final String id;
  final String title;
  final String subtitle;
  final String description;
  final Industry industry;
  final String location;
  final String budgetLabel;
  final String urgencyLabel;

  /// Rolle der Person, die diese Karte sehen soll.
  final UserRole targetRole;

  final String ownerId;
  final String ownerName;
  final List<String> tags;
  final double? distanceKm;
  final double? rating;

  @override
  List<Object?> get props => [
        id,
        title,
        subtitle,
        description,
        industry,
        location,
        budgetLabel,
        urgencyLabel,
        targetRole,
        ownerId,
        ownerName,
        tags,
        distanceKm,
        rating,
      ];
}
