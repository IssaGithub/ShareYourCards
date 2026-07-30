/// Swipe-Richtung: rechts = Interesse, links = ablehnen.
enum SwipeDirection {
  left,
  right;

  bool get isLike => this == SwipeDirection.right;
}
