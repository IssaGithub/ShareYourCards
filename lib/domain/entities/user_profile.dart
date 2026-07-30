import 'package:equatable/equatable.dart';

import 'industry.dart';
import 'user_role.dart';

/// Nutzerprofil (Suchende oder Anbieter).
final class UserProfile extends Equatable {
  const UserProfile({
    required this.id,
    required this.name,
    required this.role,
    required this.industry,
    required this.location,
    required this.bio,
    required this.rating,
    required this.completedJobs,
    this.companyName,
    this.avatarColorSeed,
  });

  final String id;
  final String name;
  final UserRole role;
  final Industry industry;
  final String location;
  final String bio;
  final double rating;
  final int completedJobs;
  final String? companyName;
  final int? avatarColorSeed;

  String get displayTitle => companyName ?? name;

  @override
  List<Object?> get props => [
        id,
        name,
        role,
        industry,
        location,
        bio,
        rating,
        completedJobs,
        companyName,
        avatarColorSeed,
      ];
}
