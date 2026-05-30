import 'dart:convert';

import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;

import '../app_controller.dart';

class LocationService {
  static Future<UserLocation> getCurrentLocation() async {
    await _ensurePermission();
    final position = await Geolocator.getCurrentPosition(
      locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
    );
    final name = await reverseGeocode(position.latitude, position.longitude);
    return UserLocation(
      lat: position.latitude,
      lng: position.longitude,
      name: name,
    );
  }

  static Future<UserLocation> searchLocation(String query) async {
    final uri = Uri.parse(
      'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${Uri.encodeComponent(query)}',
    );
    final response =
        await http.get(uri, headers: const {'Accept': 'application/json'});
    if (response.statusCode != 200) {
      throw Exception('Location search failed');
    }
    final decoded = jsonDecode(response.body) as List<dynamic>;
    if (decoded.isEmpty) {
      throw Exception('Location not found');
    }
    final first = decoded.first as Map<String, dynamic>;
    return UserLocation(
      lat: double.parse(first['lat'].toString()),
      lng: double.parse(first['lon'].toString()),
      name: _readableName(first['display_name']?.toString() ?? query),
    );
  }

  static Future<String> reverseGeocode(double lat, double lng) async {
    try {
      final uri = Uri.parse(
        'https://nominatim.openstreetmap.org/reverse?format=json&lat=$lat&lon=$lng',
      );
      final response =
          await http.get(uri, headers: const {'Accept': 'application/json'});
      if (response.statusCode != 200) {
        return 'Current Location';
      }
      final decoded = jsonDecode(response.body) as Map<String, dynamic>;
      return _readableName(
          decoded['display_name']?.toString() ?? 'Current Location');
    } catch (_) {
      return 'Current Location';
    }
  }

  static Future<void> _ensurePermission() async {
    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }
    if (permission == LocationPermission.denied ||
        permission == LocationPermission.deniedForever) {
      throw Exception('Location permission denied');
    }
  }

  static String _readableName(String displayName) {
    final parts = displayName
        .split(',')
        .map((part) => part.trim())
        .where((part) => part.isNotEmpty)
        .toList();
    if (parts.isEmpty) {
      return 'Current Location';
    }
    if (parts.length >= 2) {
      return '${parts[0]}, ${parts[1]}';
    }
    return parts.first;
  }
}
