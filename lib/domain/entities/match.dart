import 'package:equatable/equatable.dart';

import 'recommendation_card.dart';
import 'swipe_direction.dart';

/// Einzelne Swipe-Entscheidung.
final class SwipeDecision extends Equatable {
  const SwipeDecision({
    required this.cardId,
    required this.userId,
    required this.direction,
    required this.decidedAt,
  });

  final String cardId;
  final String userId;
  final SwipeDirection direction;
  final DateTime decidedAt;

  @override
  List<Object?> get props => [cardId, userId, direction, decidedAt];
}

/// Gegenseitiges Interesse (Match).
final class Match extends Equatable {
  const Match({
    required this.id,
    required this.card,
    required this.matchedAt,
    required this.partnerName,
    required this.partnerCompany,
  });

  final String id;
  final RecommendationCard card;
  final DateTime matchedAt;
  final String partnerName;
  final String partnerCompany;

  @override
  List<Object?> get props => [
        id,
        card,
        matchedAt,
        partnerName,
        partnerCompany,
      ];
}
