import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:url_launcher/url_launcher.dart';

import '../app_controller.dart';
import '../models/place.dart';
import '../services/places_service.dart';
import '../widgets/sos_dialog.dart';

class ResultsPage extends StatefulWidget {
  const ResultsPage({super.key});

  @override
  State<ResultsPage> createState() => _ResultsPageState();
}

class _ResultsPageState extends State<ResultsPage> {
  final TextEditingController _searchController = TextEditingController();
  final MapController _mapController = MapController();
  List<Place> _allPlaces = <Place>[];
  bool _loading = true;
  String? _error;
  UserLocation? _location;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _location = appController.userLocation.value;
    _loadPlaces();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadPlaces() async {
    final location = _location;
    if (location == null) {
      setState(() {
        _loading = false;
        _error = 'No location selected. Please go back and choose a place.';
      });
      return;
    }

    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final mood = appController.selectedMood.value ?? 'Peaceful';
      final places = await PlacesService.fetchNearbyPlaces(
        lat: location.lat,
        lng: location.lng,
        mood: mood,
      );
      final withDistance = places.map((place) {
        final distanceKm =
            _distanceKm(location.lat, location.lng, place.lat, place.lng);
        return place.copyWith(
          distanceKm: distanceKm,
          distanceLabel: _distanceLabel(distanceKm),
        );
      }).toList();
      if (mounted) {
        setState(() {
          _allPlaces = withDistance;
        });
      }
    } catch (error) {
      if (mounted) {
        setState(() {
          _error = error.toString().replaceFirst('Exception: ', '');
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  List<Place> get _visiblePlaces {
    final query = _searchQuery.trim().toLowerCase();
    if (query.isEmpty) {
      return _allPlaces;
    }
    return _allPlaces.where((place) {
      return place.name.toLowerCase().contains(query) ||
          place.category.toLowerCase().contains(query) ||
          place.address.toLowerCase().contains(query);
    }).toList();
  }

  Future<void> _openDirections(Place place) async {
    final uri = Uri.parse(
      'https://www.google.com/maps/search/?api=1&query=${Uri.encodeComponent('${place.name} ${place.address}')}',
    );
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  void _showPlaceDetails(Place place) {
    showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Place details',
      barrierColor: Colors.black.withValues(alpha: 0.45),
      transitionDuration: const Duration(milliseconds: 250),
      pageBuilder: (context, animation, secondaryAnimation) {
        return Align(
          alignment: Alignment.centerRight,
          child: Material(
            color: const Color(0xFFF9F7F2),
            child: SizedBox(
              width: math.min(MediaQuery.of(context).size.width, 460),
              height: double.infinity,
              child: SafeArea(
                child: Column(
                  children: [
                    Container(
                      height: 210,
                      decoration: BoxDecoration(
                        image: DecorationImage(
                            image: NetworkImage(place.image),
                            fit: BoxFit.cover),
                      ),
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.black.withValues(alpha: 0.12),
                              Colors.black.withValues(alpha: 0.75)
                            ],
                          ),
                        ),
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                _BackButton(
                                    onPressed: () =>
                                        Navigator.of(context).pop()),
                                ValueListenableBuilder<Set<String>>(
                                  valueListenable:
                                      appController.favoritePlaceIds,
                                  builder: (context, favorites, _) {
                                    final saved = favorites.contains(place.id);
                                    return TextButton(
                                      onPressed: () => appController
                                          .toggleFavorite(place.id),
                                      style: TextButton.styleFrom(
                                        foregroundColor: Colors.white,
                                        backgroundColor: Colors.white
                                            .withValues(alpha: 0.18),
                                      ),
                                      child:
                                          Text(saved ? '❤️ Saved' : '🤍 Save'),
                                    );
                                  },
                                ),
                                TextButton(
                                  onPressed: () => showDialog(
                                      context: context,
                                      builder: (_) => const SosDialog()),
                                  style: TextButton.styleFrom(
                                      foregroundColor: Colors.white,
                                      backgroundColor: const Color(0xFFD63E3E)),
                                  child: const Text('🚨 SOS'),
                                ),
                              ],
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF2E6B4C),
                                    borderRadius: BorderRadius.circular(999),
                                  ),
                                  child: Text(place.category,
                                      style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 10,
                                          fontWeight: FontWeight.w800)),
                                ),
                                const SizedBox(height: 8),
                                Text(place.name,
                                    style: const TextStyle(
                                        fontSize: 22,
                                        fontWeight: FontWeight.w900,
                                        color: Colors.white)),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    Expanded(
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.all(18),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _StatRow(place: place, location: _location!),
                            const SizedBox(height: 18),
                            const _SectionLabel('Description'),
                            const SizedBox(height: 8),
                            Text(place.description,
                                style: const TextStyle(
                                    fontSize: 12,
                                    height: 1.6,
                                    color: Color(0xFF6B7280))),
                            const SizedBox(height: 18),
                            Row(
                              children: [
                                Expanded(
                                    child: _InfoCard(
                                        title: 'BEST TIME',
                                        value:
                                            '${place.times.first} ${place.times.contains('Night') ? '🌆' : '☀️'}')),
                                const SizedBox(width: 10),
                                Expanded(
                                    child: _InfoCard(
                                        title: 'COMPANION STATE',
                                        value: place.companions.join(', '))),
                              ],
                            ),
                            const SizedBox(height: 18),
                            const _SectionLabel('💡 Explorer Tips'),
                            const SizedBox(height: 8),
                            ...place.tips.map(
                              (tip) => Padding(
                                padding: const EdgeInsets.only(bottom: 6),
                                child: Text('• $tip',
                                    style: const TextStyle(
                                        fontSize: 12,
                                        color: Color(0xFF6B7280),
                                        height: 1.5)),
                              ),
                            ),
                            const SizedBox(height: 18),
                            const _SectionLabel('📍 Address'),
                            const SizedBox(height: 8),
                            Text(place.address,
                                style: const TextStyle(
                                    fontSize: 12, color: Color(0xFF6B7280))),
                          ],
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: SizedBox(
                        width: double.infinity,
                        child: FilledButton(
                          onPressed: () => _openDirections(place),
                          style: FilledButton.styleFrom(
                            backgroundColor: const Color(0xFF2E6B4C),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 15),
                          ),
                          child: const Text('🗺️ Get Directions'),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
      transitionBuilder: (context, animation, secondaryAnimation, child) {
        final offset =
            Tween<Offset>(begin: const Offset(1, 0), end: Offset.zero)
                .animate(animation);
        return SlideTransition(position: offset, child: child);
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final location = _location;
    final filtered = _visiblePlaces;
    return Scaffold(
      body: Column(
        children: [
          Container(
            height: 64,
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text('⬅️ Back',
                      style: TextStyle(fontWeight: FontWeight.w800)),
                ),
                const SizedBox(width: 8),
                const Text('Hidden Places',
                    style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF2E6B4C))),
                const Spacer(),
                SizedBox(
                  width: 260,
                  child: TextField(
                    controller: _searchController,
                    onChanged: (value) => setState(() => _searchQuery = value),
                    decoration: const InputDecoration(
                      prefixIcon: Icon(Icons.search, size: 18),
                      hintText: 'Search by name, tags...',
                      isDense: true,
                      filled: true,
                      fillColor: Color(0xFFF4F5F7),
                      border: OutlineInputBorder(
                          borderSide: BorderSide.none,
                          borderRadius: BorderRadius.all(Radius.circular(999))),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: location == null
                ? Center(child: Text(_error ?? 'No location selected'))
                : Column(
                    children: [
                      SizedBox(
                        height: MediaQuery.of(context).size.height * 0.45,
                        child: FlutterMap(
                          mapController: _mapController,
                          options: MapOptions(
                            initialCenter: LatLng(location.lat, location.lng),
                            initialZoom: 13,
                          ),
                          children: [
                            TileLayer(
                              urlTemplate:
                                  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                              userAgentPackageName: 'hidden_place_explorer',
                            ),
                            MarkerLayer(
                              markers: [
                                Marker(
                                  point: LatLng(location.lat, location.lng),
                                  width: 44,
                                  height: 44,
                                  child: const Icon(Icons.person_pin_circle,
                                      color: Color(0xFF2E6B4C), size: 42),
                                ),
                                ...filtered.map(
                                  (place) => Marker(
                                    point: LatLng(place.lat, place.lng),
                                    width: 42,
                                    height: 42,
                                    child: GestureDetector(
                                      onTap: () => _showPlaceDetails(place),
                                      child: const Icon(Icons.location_on,
                                          color: Color(0xFF2E6B4C), size: 38),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.all(18),
                          child: _loading
                              ? const Center(
                                  child: CircularProgressIndicator(
                                      color: Color(0xFF2E6B4C)))
                              : _error != null
                                  ? Center(
                                      child: Text(_error!,
                                          textAlign: TextAlign.center))
                                  : Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            const Text('Recommended Places',
                                                style: TextStyle(
                                                    fontSize: 18,
                                                    fontWeight:
                                                        FontWeight.w900)),
                                            Text(
                                                'Found ${filtered.length} spots',
                                                style: const TextStyle(
                                                    fontSize: 12,
                                                    fontWeight: FontWeight.w700,
                                                    color: Color(0xFF6B7280))),
                                          ],
                                        ),
                                        const SizedBox(height: 12),
                                        Expanded(
                                          child: filtered.isEmpty
                                              ? Center(
                                                  child: Column(
                                                    mainAxisSize:
                                                        MainAxisSize.min,
                                                    children: [
                                                      const Text('🗺️',
                                                          style: TextStyle(
                                                              fontSize: 42)),
                                                      const SizedBox(height: 8),
                                                      const Text(
                                                          'No spots matches criteria',
                                                          style: TextStyle(
                                                              fontWeight:
                                                                  FontWeight
                                                                      .w800)),
                                                      const SizedBox(height: 6),
                                                      Text(
                                                        'Try clearing search terms or go back to adjust selections.',
                                                        textAlign:
                                                            TextAlign.center,
                                                        style: TextStyle(
                                                            fontSize: 12,
                                                            color: Colors
                                                                .grey.shade700),
                                                      ),
                                                    ],
                                                  ),
                                                )
                                              : GridView.builder(
                                                  gridDelegate:
                                                      const SliverGridDelegateWithFixedCrossAxisCount(
                                                    crossAxisCount: 3,
                                                    mainAxisSpacing: 14,
                                                    crossAxisSpacing: 14,
                                                    childAspectRatio: 0.82,
                                                  ),
                                                  itemCount: filtered.length,
                                                  itemBuilder:
                                                      (context, index) {
                                                    final place =
                                                        filtered[index];
                                                    return _PlaceCard(
                                                      place: place,
                                                      saved: appController
                                                          .favoritePlaceIds
                                                          .value
                                                          .contains(place.id),
                                                      onTap: () =>
                                                          _showPlaceDetails(
                                                              place),
                                                      onFavorite: () =>
                                                          appController
                                                              .toggleFavorite(
                                                                  place.id),
                                                    );
                                                  },
                                                ),
                                        ),
                                      ],
                                    ),
                        ),
                      ),
                    ],
                  ),
          ),
        ],
      ),
    );
  }
}

class _PlaceCard extends StatelessWidget {
  const _PlaceCard(
      {required this.place,
      required this.saved,
      required this.onTap,
      required this.onFavorite});

  final Place place;
  final bool saved;
  final VoidCallback onTap;
  final VoidCallback onFavorite;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: const Color(0xFFE4E1D8)),
          boxShadow: const [
            BoxShadow(
                color: Color(0x10000000), blurRadius: 18, offset: Offset(0, 8))
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 112,
              decoration: BoxDecoration(
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(18)),
                image: DecorationImage(
                    image: NetworkImage(place.image), fit: BoxFit.cover),
              ),
              child: Stack(
                children: [
                  Positioned(
                    top: 10,
                    left: 10,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.65),
                          borderRadius: BorderRadius.circular(999)),
                      child: Text(place.category,
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 9,
                              fontWeight: FontWeight.w800)),
                    ),
                  ),
                  Positioned(
                    top: 10,
                    right: 10,
                    child: GestureDetector(
                      onTap: onFavorite,
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: const BoxDecoration(
                            color: Colors.white, shape: BoxShape.circle),
                        child: Text(saved ? '❤️' : '🤍',
                            style: const TextStyle(fontSize: 12)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(place.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                          fontSize: 13, fontWeight: FontWeight.w900)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Text('⭐', style: TextStyle(fontSize: 12)),
                      const SizedBox(width: 4),
                      Text(place.safetyRating.toStringAsFixed(1),
                          style: const TextStyle(
                              fontSize: 11, fontWeight: FontWeight.w800)),
                      const Spacer(),
                      Text(place.distanceLabel ?? '',
                          style: const TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF6B7280))),
                    ],
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      onPressed: onTap,
                      child: const Text('View Details ➔',
                          style: TextStyle(
                              fontSize: 11, fontWeight: FontWeight.w800)),
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

class _StatRow extends StatelessWidget {
  const _StatRow({required this.place, required this.location});

  final Place place;
  final UserLocation location;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE4E1D8)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text('⭐ ${place.safetyRating.toStringAsFixed(1)} / 5.0 Safety Score',
              style:
                  const TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
          Text('📍 ${place.distanceLabel ?? ''} away',
              style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF6B7280))),
        ],
      ),
    );
  }
}

class _InfoCard extends StatelessWidget {
  const _InfoCard({required this.title, required this.value});

  final String title;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE4E1D8)),
      ),
      child: Column(
        children: [
          Text(title,
              style: const TextStyle(
                  fontSize: 9,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF6B7280))),
          const SizedBox(height: 6),
          Text(value,
              textAlign: TextAlign.center,
              style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF2E6B4C))),
        ],
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  const _SectionLabel(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(text,
        style: const TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w900,
            letterSpacing: 1.1,
            color: Color(0xFF6B7280)));
  }
}

class _BackButton extends StatelessWidget {
  const _BackButton({required this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
          foregroundColor: Colors.white,
          backgroundColor: Colors.black.withValues(alpha: 0.38)),
      child: const Text('⬅️ Back'),
    );
  }
}

String _distanceLabel(double km) {
  if (km < 1) {
    return '${(km * 1000).round()} m';
  }
  return '${km.toStringAsFixed(km < 10 ? 1 : 0)} km';
}

double _distanceKm(double lat1, double lon1, double lat2, double lon2) {
  const earthRadiusKm = 6371.0;
  final dLat = _degToRad(lat2 - lat1);
  final dLon = _degToRad(lon2 - lon1);
  final a = math.sin(dLat / 2) * math.sin(dLat / 2) +
      math.cos(_degToRad(lat1)) *
          math.cos(_degToRad(lat2)) *
          math.sin(dLon / 2) *
          math.sin(dLon / 2);
  final c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
  return earthRadiusKm * c;
}

double _degToRad(double value) => value * math.pi / 180;
