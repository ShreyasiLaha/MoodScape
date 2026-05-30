import 'package:flutter/material.dart';

import '../widgets/sos_dialog.dart';

class LandingPage extends StatelessWidget {
  const LandingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF0D1B16), Color(0xFF18352A), Color(0xFF0A0F0C)],
          ),
        ),
        child: Stack(
          children: [
            Positioned(
              top: -120,
              left: -120,
              child: _Glow(
                  size: 280,
                  color: const Color(0xFF2E6B4C).withValues(alpha: 0.22)),
            ),
            Positioned(
              bottom: -100,
              right: -100,
              child: _Glow(
                  size: 240,
                  color: const Color(0xFFB8A76A).withValues(alpha: 0.16)),
            ),
            SafeArea(
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 20, vertical: 14),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Text('🌿', style: TextStyle(fontSize: 24)),
                            SizedBox(width: 8),
                            Text(
                              'Hidden Places',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ],
                        ),
                        Wrap(
                          spacing: 8,
                          children: [
                            _HeaderButton(label: 'Saved', onPressed: () {}),
                            _HeaderButton(label: 'Settings', onPressed: () {}),
                            _HeaderButton(label: 'Feedback', onPressed: () {}),
                            ElevatedButton(
                              onPressed: () => showDialog(
                                context: context,
                                builder: (_) => const SosDialog(),
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFFD63E3E),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 14, vertical: 10),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12)),
                              ),
                              child: const Text('🚨 SOS'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const Spacer(),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 540),
                      child: Column(
                        children: [
                          const Text('🌿', style: TextStyle(fontSize: 56)),
                          const SizedBox(height: 12),
                          const Text(
                            'Hidden Places',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 48,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -1,
                            ),
                          ),
                          const SizedBox(height: 14),
                          Text(
                            'Select your location first, then choose your mood, companion, and time to discover hidden places near you.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: Colors.white.withValues(alpha: 0.92),
                              fontSize: 16,
                              height: 1.55,
                            ),
                          ),
                          const SizedBox(height: 28),
                          FilledButton(
                            onPressed: () =>
                                Navigator.of(context).pushNamed('/selector'),
                            style: FilledButton.styleFrom(
                              backgroundColor: const Color(0xFF2E6B4C),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 34, vertical: 16),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(999)),
                            ),
                            child: const Text(
                              'Explore Now ➔',
                              style: TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.w800),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const Spacer(),
                  const Padding(
                    padding: EdgeInsets.only(bottom: 20),
                    child: Text(
                      '↓ Start Exploring',
                      style: TextStyle(
                          color: Colors.white70,
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 1.2),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _HeaderButton extends StatelessWidget {
  const _HeaderButton({required this.label, required this.onPressed});

  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(
        foregroundColor: Colors.white,
        side: const BorderSide(color: Colors.white24),
        backgroundColor: Colors.white.withValues(alpha: 0.08),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      child: Text(label,
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
    );
  }
}

class _Glow extends StatelessWidget {
  const _Glow({required this.size, required this.color});

  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: color,
      ),
    );
  }
}
