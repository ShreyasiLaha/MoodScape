import 'dart:async';

import 'package:flutter/material.dart';

import '../app_controller.dart';
import '../services/location_service.dart';

class SosDialog extends StatefulWidget {
  const SosDialog({super.key});

  @override
  State<SosDialog> createState() => _SosDialogState();
}

class _SosDialogState extends State<SosDialog> {
  Timer? _timer;
  int _countdown = 3;
  bool _sent = false;
  bool _askingPin = false;
  String? _locationName;
  double? _lat;
  double? _lng;
  final TextEditingController _pinController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _locationName = appController.userLocation.value?.name;
    _lat = appController.userLocation.value?.lat;
    _lng = appController.userLocation.value?.lng;
    _fetchLocation();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_countdown <= 1) {
        timer.cancel();
        if (!_askingPin) {
          _sendAlert();
        }
      } else {
        setState(() => _countdown -= 1);
      }
    });
  }

  Future<void> _fetchLocation() async {
    try {
      final location = await LocationService.getCurrentLocation();
      if (mounted) {
        setState(() {
          _locationName = location.name;
          _lat = location.lat;
          _lng = location.lng;
        });
      }
    } catch (_) {
      // Keep existing location if GPS is unavailable.
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pinController.dispose();
    super.dispose();
  }

  void _sendAlert() {
    setState(() {
      _sent = true;
    });
  }

  void _cancel() {
    final savedPin = null;
    if (savedPin == null) {
      Navigator.of(context).pop();
      return;
    }
    setState(() {
      _askingPin = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      insetPadding: const EdgeInsets.all(16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 380),
        child: Padding(
          padding: const EdgeInsets.all(22),
          child: _sent ? _buildSent(context) : _buildAlert(context),
        ),
      ),
    );
  }

  Widget _buildAlert(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Text('🚨', style: TextStyle(fontSize: 50)),
        const SizedBox(height: 10),
        const Text('EMERGENCY ALERT ACTIVATED',
            textAlign: TextAlign.center,
            style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w900,
                color: Color(0xFFD63E3E))),
        const SizedBox(height: 10),
        Text(
          'Are you in danger? Your location will be shared with emergency contacts.',
          textAlign: TextAlign.center,
          style: TextStyle(
              fontSize: 12, height: 1.55, color: Colors.grey.shade700),
        ),
        const SizedBox(height: 18),
        SizedBox(
          width: double.infinity,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: LinearProgressIndicator(
              minHeight: 18,
              value: (_countdown == 0 ? 1 : (3 - _countdown) / 3),
              backgroundColor: const Color(0xFFF0E7E7),
              valueColor:
                  const AlwaysStoppedAnimation<Color>(Color(0xFFD63E3E)),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text('Sending in $_countdown seconds...',
            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800)),
        const SizedBox(height: 18),
        if (_askingPin)
          Column(
            children: [
              const Text('Enter PIN to Cancel SOS:',
                  style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFFD63E3E))),
              const SizedBox(height: 8),
              TextField(
                controller: _pinController,
                keyboardType: TextInputType.number,
                maxLength: 4,
                obscureText: true,
                textAlign: TextAlign.center,
                decoration: InputDecoration(
                  counterText: '',
                  hintText: 'PIN',
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14)),
                ),
              ),
              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: () => Navigator.of(context).pop(),
                  style: FilledButton.styleFrom(
                      backgroundColor: const Color(0xFF2E6B4C),
                      foregroundColor: Colors.white),
                  child: const Text('Submit PIN'),
                ),
              ),
            ],
          )
        else
          Column(
            children: [
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: _sendAlert,
                  style: FilledButton.styleFrom(
                      backgroundColor: const Color(0xFFD63E3E),
                      foregroundColor: Colors.white),
                  child: const Text('🚨 Send Alert NOW'),
                ),
              ),
              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: _cancel,
                  child: const Text('❌ Cancel — I\'m Safe'),
                ),
              ),
            ],
          ),
      ],
    );
  }

  Widget _buildSent(BuildContext context) {
    final locationText = _locationName ?? 'Current Location';
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Text('📢', style: TextStyle(fontSize: 48)),
        const SizedBox(height: 10),
        const Text('SOS DISPATCHED',
            style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w900,
                color: Color(0xFF2E6B4C))),
        const SizedBox(height: 10),
        Text(
          'Your location ($locationText) has been captured for emergency contacts.',
          textAlign: TextAlign.center,
          style: TextStyle(
              fontSize: 12, height: 1.55, color: Colors.grey.shade700),
        ),
        const SizedBox(height: 16),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFFF8F7F4),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: const Color(0xFFE4E1D8)),
          ),
          child: Text(
            'Simulated emergency SMS:\n• To Dad: live location https://maps.google.com/?q=${_lat ?? 0},${_lng ?? 0}\n• To Mom: live location https://maps.google.com/?q=${_lat ?? 0},${_lng ?? 0}',
            style: const TextStyle(fontSize: 11, height: 1.5),
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          width: double.infinity,
          child: FilledButton(
            onPressed: () => Navigator.of(context).pop(),
            style: FilledButton.styleFrom(
                backgroundColor: const Color(0xFF2E6B4C),
                foregroundColor: Colors.white),
            child: const Text('Close Overlay & Return'),
          ),
        ),
      ],
    );
  }
}
