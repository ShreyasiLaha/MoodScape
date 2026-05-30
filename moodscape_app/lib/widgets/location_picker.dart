import 'package:flutter/material.dart';

import '../app_controller.dart';
import '../services/location_service.dart';

class LocationPicker extends StatefulWidget {
  const LocationPicker({super.key});

  @override
  State<LocationPicker> createState() => _LocationPickerState();
}

class _LocationPickerState extends State<LocationPicker> {
  final TextEditingController _searchController = TextEditingController();
  bool _isLocating = false;
  String? _errorText;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _setCurrentLocation() async {
    setState(() {
      _isLocating = true;
      _errorText = null;
    });
    try {
      final location = await LocationService.getCurrentLocation();
      appController.setLocation(location);
    } catch (error) {
      setState(() {
        _errorText = 'Could not get your location. Please search manually.';
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(error.toString().replaceFirst('Exception: ', ''))),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLocating = false;
        });
      }
    }
  }

  Future<void> _searchLocation() async {
    final query = _searchController.text.trim();
    if (query.isEmpty) {
      return;
    }
    setState(() {
      _isLocating = true;
      _errorText = null;
    });
    try {
      final location = await LocationService.searchLocation(query);
      appController.setLocation(location);
    } catch (error) {
      setState(() {
        _errorText = 'Location not found. Please try another place.';
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(error.toString().replaceFirst('Exception: ', ''))),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLocating = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE4E1D8)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x11000000),
            blurRadius: 24,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Where are you?',
            style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: Color(0xFF111827)),
          ),
          const SizedBox(height: 14),
          ValueListenableBuilder<UserLocation?>(
            valueListenable: appController.userLocation,
            builder: (context, location, _) {
              return SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _isLocating ? null : _setCurrentLocation,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                        vertical: 16, horizontal: 16),
                    backgroundColor: const Color(0xFFEAF0EC),
                    foregroundColor: const Color(0xFF2E6B4C),
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14)),
                  ),
                  icon: const Text('📍'),
                  label: Text(
                    _isLocating
                        ? 'Locating...'
                        : (location == null
                            ? 'Use Current Location'
                            : 'Using: ${location.name}'),
                    style: const TextStyle(fontWeight: FontWeight.w700),
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              const Expanded(child: Divider()),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Text(
                  'OR',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: Colors.grey.shade500,
                  ),
                ),
              ),
              const Expanded(child: Divider()),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Search city or place...',
                    filled: true,
                    fillColor: const Color(0xFFF8F7F4),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: Color(0xFFE4E1D8)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(color: Color(0xFFE4E1D8)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(
                          color: Color(0xFF2E6B4C), width: 1.2),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 14),
                  ),
                  onSubmitted: (_) => _searchLocation(),
                ),
              ),
              const SizedBox(width: 10),
              FilledButton(
                onPressed: _isLocating ? null : _searchLocation,
                style: FilledButton.styleFrom(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  backgroundColor: const Color(0xFF1F2937),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text('Set'),
              ),
            ],
          ),
          if (_errorText != null) ...[
            const SizedBox(height: 10),
            Text(
              _errorText!,
              style: const TextStyle(
                  fontSize: 12,
                  color: Color(0xFF8B2E2E),
                  fontWeight: FontWeight.w600),
            ),
          ],
        ],
      ),
    );
  }
}
