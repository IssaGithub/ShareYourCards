import 'package:empfehlungsportal/app.dart';
import 'package:empfehlungsportal/core/constants/app_constants.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Onboarding zeigt Rollenwahl', (tester) async {
    await tester.pumpWidget(const EmpfehlungsportalApp());
    await tester.pumpAndSettle();

    expect(find.text(AppConstants.appName), findsOneWidget);
    expect(find.text('Suchende:r'), findsOneWidget);
    expect(find.text('Anbieter:in'), findsOneWidget);
  });

  testWidgets('Suchende-Onboarding öffnet Entdecken', (tester) async {
    final view = tester.view;
    view.physicalSize = const Size(1080, 1920);
    view.devicePixelRatio = 1.0;
    addTearDown(view.resetPhysicalSize);
    addTearDown(view.resetDevicePixelRatio);

    await tester.pumpWidget(const EmpfehlungsportalApp());
    await tester.pumpAndSettle();

    await tester.tap(find.text('Suchende:r'));
    await tester.pumpAndSettle();

    expect(find.text('Anbieter-Vorschläge für dich'), findsOneWidget);
    expect(find.text('Entdecken'), findsOneWidget);
  });
}
