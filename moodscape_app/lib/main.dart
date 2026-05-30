import 'package:flutter/material.dart';

import 'pages/landing_page.dart';
import 'pages/results_page.dart';
import 'pages/selector_page.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MoodScapeApp());
}

class MoodScapeApp extends StatelessWidget {
  const MoodScapeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Hidden Places',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF2E6B4C),
          brightness: Brightness.light,
        ),
        scaffoldBackgroundColor: const Color(0xFFF6F4EE),
        fontFamily: null,
      ),
      initialRoute: '/',
      routes: {
        '/': (_) => const LandingPage(),
        '/selector': (_) => const SelectorPage(),
        '/results': (_) => const ResultsPage(),
      },
    );
  }
}
