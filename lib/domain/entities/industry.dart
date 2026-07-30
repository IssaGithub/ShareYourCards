import 'package:equatable/equatable.dart';

/// Gewerk / Branche.
final class Industry extends Equatable {
  const Industry({
    required this.id,
    required this.name,
    required this.iconName,
  });

  final String id;
  final String name;
  final String iconName;

  @override
  List<Object?> get props => [id, name, iconName];
}
