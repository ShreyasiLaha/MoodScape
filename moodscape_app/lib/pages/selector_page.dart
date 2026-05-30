import 'package:flutter/material.dart';

import '../app_controller.dart';
import '../widgets/location_picker.dart';
import '../widgets/sos_dialog.dart';

class SelectorPage extends StatelessWidget {
  const SelectorPage({super.key});

  @override
  Widget build(BuildContext context) {
    final moods = <_Choice>[
      _Choice('Peaceful', '🌿', 'Quiet & calm'),
      _Choice('Romantic', '💫', 'Scenic & cozy'),
      _Choice('Chill', '😌', 'Relax & unwind'),
      _Choice('Adventure', '🏕️', 'Explore & thrill'),
      _Choice('Stress Relief', '🧘', 'Heal & restore'),
      _Choice('Fun', '🎉', 'Lively & social'),
      _Choice('Study/Work', '📚', 'Focus zones'),
    ];

    const companions = [
      _Choice('Solo', '🧍', ''),
      _Choice('Duet', '👫', ''),
      _Choice('Friends', '👥', ''),
      _Choice('Family', '👨‍👩‍👧', ''),
    ];

    const times = [
      _Choice('Morning', '🌅', ''),
      _Choice('Afternoon', '☀️', ''),
      _Choice('Evening', '🌆', ''),
      _Choice('Night', '🌙', ''),
    ];

    return Scaffold(
      body: LayoutBuilder(
        builder: (context, constraints) {
          final wide = constraints.maxWidth >= 980;
          final content = wide
              ? Row(
                  children: [
                    SizedBox(
                        width: 420,
                        child: _LeftPanel(
                            moods: moods,
                            companions: companions,
                            times: times)),
                    Expanded(child: _RightPanel()),
                  ],
                )
              : _LeftPanel(moods: moods, companions: companions, times: times);
          return content;
        },
      ),
    );
  }
}

class _LeftPanel extends StatelessWidget {
  const _LeftPanel(
      {required this.moods, required this.companions, required this.times});

  final List<_Choice> moods;
  final List<_Choice> companions;
  final List<_Choice> times;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFF6F4EE),
      child: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 10),
              child: GestureDetector(
                onTap: () => showDialog(
                    context: context, builder: (_) => const SosDialog()),
                child: Container(
                  width: double.infinity,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1E1E1),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFFE4B2B2)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.circle, size: 10, color: Color(0xFFD63E3E)),
                      SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          'SOS active — tap if you feel unsafe',
                          style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFFD63E3E)),
                        ),
                      ),
                      SizedBox(width: 8),
                      Text('🚨 SOS',
                          style: TextStyle(
                              fontSize: 10, fontWeight: FontWeight.w800)),
                    ],
                  ),
                ),
              ),
            ),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 128),
                children: [
                  const LocationPicker(),
                  const SizedBox(height: 18),
                  const Text(
                    'How are you feeling?',
                    style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF111827)),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Pick your mood, companion, and time to discover hidden places.',
                    style: TextStyle(
                        fontSize: 12, color: Color(0xFF6B7280), height: 1.5),
                  ),
                  const SizedBox(height: 18),
                  const _SectionTitle('Your Mood'),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: moods
                        .map((choice) => _SelectableCard(
                              label: choice.label,
                              icon: choice.icon,
                              subtitle: choice.subtitle,
                              selected: appController.selectedMood.value ==
                                  choice.label,
                              onTap: () => appController.setMood(
                                appController.selectedMood.value == choice.label
                                    ? null
                                    : choice.label,
                              ),
                            ))
                        .toList(),
                  ),
                  const SizedBox(height: 18),
                  const _SectionTitle("Who's with you?"),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: companions
                        .map((choice) => _SelectableCard(
                              label: choice.label,
                              icon: choice.icon,
                              subtitle: '',
                              selected: appController.selectedCompanion.value ==
                                  choice.label,
                              onTap: () => appController.setCompanion(
                                appController.selectedCompanion.value ==
                                        choice.label
                                    ? null
                                    : choice.label,
                              ),
                            ))
                        .toList(),
                  ),
                  const SizedBox(height: 18),
                  const _SectionTitle('Time of Day'),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: times
                        .map((choice) => _SelectableCard(
                              label: choice.label,
                              icon: choice.icon,
                              subtitle: '',
                              selected: appController.selectedTime.value ==
                                  choice.label,
                              onTap: () => appController.setTime(
                                appController.selectedTime.value == choice.label
                                    ? null
                                    : choice.label,
                              ),
                            ))
                        .toList(),
                  ),
                ],
              ),
            ),
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFFF6F4EE),
                border: Border(
                    top: BorderSide(
                        color: Colors.black.withValues(alpha: 0.08))),
                boxShadow: const [
                  BoxShadow(
                      color: Color(0x12000000),
                      blurRadius: 18,
                      offset: Offset(0, -4))
                ],
              ),
              padding: const EdgeInsets.fromLTRB(16, 14, 16, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ValueListenableBuilder<UserLocation?>(
                    valueListenable: appController.userLocation,
                    builder: (context, location, _) {
                      return Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          if (location != null)
                            _Chip(label: '📍 ${location.name}')
                          else
                            const _Chip(label: '📍 Select your location'),
                          if (appController.selectedMood.value != null)
                            _Chip(
                                label:
                                    '${_emojiForMood(appController.selectedMood.value!)} ${appController.selectedMood.value!}'),
                          if (appController.selectedCompanion.value != null)
                            _Chip(
                                label:
                                    '${_emojiForCompanion(appController.selectedCompanion.value!)} ${appController.selectedCompanion.value!}'),
                          if (appController.selectedTime.value != null)
                            _Chip(
                                label:
                                    '${_emojiForTime(appController.selectedTime.value!)} ${appController.selectedTime.value!}'),
                        ],
                      );
                    },
                  ),
                  const SizedBox(height: 12),
                  ValueListenableBuilder<UserLocation?>(
                    valueListenable: appController.userLocation,
                    builder: (context, location, _) {
                      final ready = location != null &&
                          appController.selectedMood.value != null &&
                          appController.selectedCompanion.value != null &&
                          appController.selectedTime.value != null;
                      return SizedBox(
                        width: double.infinity,
                        child: FilledButton(
                          onPressed: ready
                              ? () =>
                                  Navigator.of(context).pushNamed('/results')
                              : null,
                          style: FilledButton.styleFrom(
                            backgroundColor: const Color(0xFF2E6B4C),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16)),
                          ),
                          child: const Text('🗺️ Find Hidden Places',
                              style: TextStyle(
                                  fontSize: 15, fontWeight: FontWeight.w800)),
                        ),
                      );
                    },
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

class _RightPanel extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [Color(0xFFF5F7F2), Color(0xFFE7E1D2)],
            ),
          ),
        ),
        Positioned(
          top: 60,
          left: 60,
          right: 60,
          bottom: 60,
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.38),
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: Colors.white.withValues(alpha: 0.5)),
            ),
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('🗺️', style: TextStyle(fontSize: 56)),
                  const SizedBox(height: 10),
                  const Text('Discover Hidden Places',
                      style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF111827))),
                  const SizedBox(height: 8),
                  Text(
                    'Make your selections on the left panel to unlock custom recommendations mapped around your location.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        fontSize: 12,
                        color: Colors.black.withValues(alpha: 0.7),
                        height: 1.6),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _SelectableCard extends StatelessWidget {
  const _SelectableCard({
    required this.label,
    required this.icon,
    required this.subtitle,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final String icon;
  final String subtitle;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final cardWidth = label == 'Study/Work' ? double.infinity : 116.0;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        width: cardWidth,
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: selected ? const Color(0xFFEAF0EC) : Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
              color:
                  selected ? const Color(0xFF2E6B4C) : const Color(0xFFE4E1D8),
              width: selected ? 1.4 : 1),
          boxShadow: const [
            BoxShadow(
                color: Color(0x0F000000), blurRadius: 18, offset: Offset(0, 6))
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(icon, style: TextStyle(fontSize: selected ? 26 : 24)),
            const SizedBox(height: 8),
            Text(label,
                textAlign: TextAlign.center,
                style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: selected
                        ? const Color(0xFF2E6B4C)
                        : const Color(0xFF111827))),
            if (subtitle.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(subtitle,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                      fontSize: 10, color: Color(0xFF6B7280), height: 1.2)),
            ],
          ],
        ),
      ),
    );
  }
}

class _Chip extends StatelessWidget {
  const _Chip({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF2E6B4C),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(label,
          style: const TextStyle(
              color: Colors.white, fontSize: 10, fontWeight: FontWeight.w800)),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w900,
          color: Color(0xFF6B7280),
          letterSpacing: 1.2),
    );
  }
}

class _Choice {
  const _Choice(this.label, this.icon, this.subtitle);

  final String label;
  final String icon;
  final String subtitle;
}

String _emojiForMood(String mood) {
  switch (mood) {
    case 'Peaceful':
      return '🌿';
    case 'Romantic':
      return '💫';
    case 'Chill':
      return '😌';
    case 'Adventure':
      return '🏕️';
    case 'Stress Relief':
      return '🧘';
    case 'Fun':
      return '🎉';
    case 'Study/Work':
      return '📚';
    default:
      return '📍';
  }
}

String _emojiForCompanion(String companion) {
  switch (companion) {
    case 'Solo':
      return '🧍';
    case 'Duet':
      return '👫';
    case 'Friends':
      return '👥';
    case 'Family':
      return '👨‍👩‍👧';
    default:
      return '👥';
  }
}

String _emojiForTime(String time) {
  switch (time) {
    case 'Morning':
      return '🌅';
    case 'Afternoon':
      return '☀️';
    case 'Evening':
      return '🌆';
    case 'Night':
      return '🌙';
    default:
      return '🕒';
  }
}
