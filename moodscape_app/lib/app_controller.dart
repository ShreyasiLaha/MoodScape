import 'package:flutter/foundation.dart';

import 'models/place.dart';

class UserLocation {
  const UserLocation({
    required this.lat,
    required this.lng,
    required this.name,
  });

  final double lat;
  final double lng;
  final String name;
}

class AppController {
  AppController._();

  static final AppController instance = AppController._();

  final ValueNotifier<String?> selectedMood = ValueNotifier<String?>(null);
  final ValueNotifier<String?> selectedCompanion = ValueNotifier<String?>(null);
  final ValueNotifier<String?> selectedTime = ValueNotifier<String?>(null);
  final ValueNotifier<UserLocation?> userLocation =
      ValueNotifier<UserLocation?>(null);
  final ValueNotifier<Set<String>> favoritePlaceIds =
      ValueNotifier<Set<String>>(<String>{});
  final ValueNotifier<Place?> activePlace = ValueNotifier<Place?>(null);

  void setLocation(UserLocation location) {
    userLocation.value = location;
  }

  void setMood(String? value) {
    selectedMood.value = value;
  }

  void setCompanion(String? value) {
    selectedCompanion.value = value;
  }

  void setTime(String? value) {
    selectedTime.value = value;
  }

  void toggleFavorite(String placeId) {
    final next = Set<String>.from(favoritePlaceIds.value);
    if (next.contains(placeId)) {
      next.remove(placeId);
    } else {
      next.add(placeId);
    }
    favoritePlaceIds.value = next;
  }
}

final appController = AppController.instance;
