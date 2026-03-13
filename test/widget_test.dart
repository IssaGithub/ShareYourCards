import 'package:flutter_test/flutter_test.dart';
import 'package:share_your_cards/main.dart';

void main() {
  testWidgets('Zeigt den App-Titel an', (WidgetTester tester) async {
    await tester.pumpWidget(const ShareYourCardsApp());
    expect(find.text('ShareYourCards'), findsOneWidget);
  });
}
