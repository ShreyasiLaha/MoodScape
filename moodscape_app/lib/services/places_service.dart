import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/place.dart';

class PlacesService {
  static Future<List<Place>> fetchNearbyPlaces({
    required double lat,
    required double lng,
    required String mood,
    String searchQuery = '',
    int radius = 5000,
  }) async {
    final query = _buildQuery(lat: lat, lng: lng, mood: mood, radius: radius);
    final response = await http.post(
      Uri.parse('https://overpass-api.de/api/interpreter'),
      headers: const {'Content-Type': 'application/x-www-form-urlencoded'},
      body: 'data=${Uri.encodeComponent(query)}',
    );

    if (response.statusCode != 200) {
      return <Place>[];
    }

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    final elements = (decoded['elements'] as List<dynamic>? ?? <dynamic>[]);
    final places = elements
        .map((element) => _mapElement(element as Map<String, dynamic>))
        .whereType<Place>()
        .toList();

    final filtered = searchQuery.trim().isEmpty
        ? places
        : places.where((place) {
            final needle = searchQuery.toLowerCase();
            return place.name.toLowerCase().contains(needle) ||
                place.category.toLowerCase().contains(needle) ||
                place.address.toLowerCase().contains(needle);
          }).toList();

    return filtered.take(20).toList();
  }

  static Place? _mapElement(Map<String, dynamic> element) {
    final tags =
        (element['tags'] as Map<String, dynamic>? ?? <String, dynamic>{});
    final name = tags['name']?.toString();
    if (name == null || name.trim().isEmpty) {
      return null;
    }

    final lat = (element['lat'] ?? element['center']?['lat'])?.toString();
    final lng = (element['lon'] ?? element['center']?['lon'])?.toString();
    if (lat == null || lng == null) {
      return null;
    }

    final addressParts = <String>[
      tags['addr:street']?.toString() ?? '',
      tags['addr:city']?.toString() ?? '',
      tags['addr:state']?.toString() ?? '',
      tags['addr:country']?.toString() ?? '',
    ].where((part) => part.trim().isNotEmpty).toList();

    final address =
        addressParts.isEmpty ? 'Unknown location' : addressParts.join(', ');
    final category = tags['amenity']?.toString() ??
        tags['leisure']?.toString() ??
        tags['tourism']?.toString() ??
        'Place';

    return Place(
      id: element['id'].toString(),
      name: name,
      category: category,
      address: address,
      description: 'A discovered location around $address.',
      lat: double.parse(lat),
      lng: double.parse(lng),
      safetyRating: 3.5 + (element['id'].hashCode.abs() % 16) / 10,
      moods: <String>[category],
      times: <String>['Afternoon'],
      companions: <String>['Solo'],
      tips: <String>[
        'Always check hours before visiting.',
        'Great local spot!'
      ],
      image:
          'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    );
  }

  static String _buildQuery({
    required double lat,
    required double lng,
    required String mood,
    required int radius,
  }) {
    final tags = _tagsForMood(mood);
    return '''
[out:json][timeout:25];
(
  node$tags(around:$radius,$lat,$lng);
  way$tags(around:$radius,$lat,$lng);
  relation$tags(around:$radius,$lat,$lng);
);
out center;
''';
  }

  static String _tagsForMood(String mood) {
    switch (mood.toLowerCase()) {
      case 'peaceful':
      case 'stress relief':
        return '["amenity"~"library|place_of_worship"]';
      case 'romantic':
        return '["amenity"="cafe"]';
      case 'chill':
        return '["amenity"~"cafe|pub|bar"]';
      case 'adventure':
        return '["natural"~"wood|water|peak"]["leisure"~"park|nature_reserve"]';
      case 'fun':
        return '["amenity"~"restaurant|bar|pub"]';
      case 'study/work':
        return '["amenity"~"library|cafe"]';
      default:
        return '["amenity"~"cafe|restaurant|library|bar|pub"]';
    }
  }
}
