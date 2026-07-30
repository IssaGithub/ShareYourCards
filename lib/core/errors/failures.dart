import 'package:equatable/equatable.dart';

/// Domänenfehler ohne Framework-Abhängigkeiten.
sealed class Failure extends Equatable {
  const Failure(this.message);

  final String message;

  @override
  List<Object?> get props => [message];
}

final class ServerFailure extends Failure {
  const ServerFailure([super.message = 'Serverfehler']);
}

final class CacheFailure extends Failure {
  const CacheFailure([super.message = 'Lokaler Speicherfehler']);
}

final class NotFoundFailure extends Failure {
  const NotFoundFailure([super.message = 'Nicht gefunden']);
}
