class Place {
  const Place({
    required this.id,
    required this.name,
    required this.category,
    required this.address,
    required this.description,
    required this.lat,
    required this.lng,
    required this.safetyRating,
    required this.moods,
    required this.times,
    required this.companions,
    required this.tips,
    required this.image,
    this.distanceKm,
    this.distanceLabel,
  });

  final String id;
  final String name;
  final String category;
  final String address;
  final String description;
  final double lat;
  final double lng;
  final double safetyRating;
  final List<String> moods;
  final List<String> times;
  final List<String> companions;
  final List<String> tips;
  final String image;
  final double? distanceKm;
  final String? distanceLabel;

  Place copyWith({
    double? distanceKm,
    String? distanceLabel,
  }) {
    return Place(
      id: id,
      name: name,
      category: category,
      address: address,
      description: description,
      lat: lat,
      lng: lng,
      safetyRating: safetyRating,
      moods: moods,
      times: times,
      companions: companions,
      tips: tips,
      image: image,
      distanceKm: distanceKm ?? this.distanceKm,
      distanceLabel: distanceLabel ?? this.distanceLabel,
    );
  }
}
