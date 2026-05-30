import 'package:flutter_test/flutter_test.dart';

import 'package:hidden_place_explorer/main.dart';

void main() {
  testWidgets('app shows landing page title', (WidgetTester tester) async {
    await tester.pumpWidget(const MoodScapeApp());

    expect(find.text('Hidden Places'), findsWidgets);
    expect(find.text('Explore Now ➔'), findsOneWidget);
  });
}
