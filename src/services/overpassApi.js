// Mapping amenity types to moods with accuracy
const amenityToMoods = {
  cafe: ["Chill", "Study/Work", "Fun"],
  restaurant: ["Fun", "Romantic", "Chill"],
  pub: ["Fun", "Chill"],
  library: ["Study/Work", "Peaceful", "Chill"],
  park: ["Peaceful", "Adventure", "Stress Relief"],
  nature_reserve: ["Adventure", "Peaceful", "Stress Relief"],
  monument: ["Adventure", "Romantic"],
  museum: ["Study/Work", "Fun"],
  place_of_worship: ["Peaceful", "Spiritual"],
  cinema: ["Fun", "Romantic"],
  theatre: ["Fun"],
  spa: ["Stress Relief", "Chill"],
  swimming_pool: ["Adventure", "Fun"],
  garden: ["Peaceful", "Romantic", "Stress Relief"],
  viewpoint: ["Adventure", "Romantic", "Peaceful"],
  bench: ["Peaceful", "Chill"],
  fountain: ["Peaceful", "Romantic"],
  artwork: ["Fun", "Romantic"]
};

// Mapping to companions
const amenityToCompanions = {
  cafe: ["Solo", "Duet", "Friends"],
  restaurant: ["Duet", "Friends", "Family"],
  library: ["Solo"],
  park: ["Solo", "Friends", "Family"],
  nature_reserve: ["Friends", "Family"],
  monument: ["Friends", "Family"],
  museum: ["Solo", "Duet", "Friends"],
  place_of_worship: ["Solo", "Family"],
  cinema: ["Duet", "Friends"],
  spa: ["Solo", "Duet"],
  garden: ["Solo", "Duet", "Family"]
};

// Mapping to best times
const amenityToTimes = {
  cafe: ["Morning", "Afternoon", "Evening"],
  restaurant: ["Afternoon", "Evening", "Night"],
  library: ["Morning", "Afternoon"],
  park: ["Morning", "Afternoon", "Evening"],
  nature_reserve: ["Morning", "Afternoon"],
  viewpoint: ["Morning", "Evening"],
  museum: ["Morning", "Afternoon"],
  garden: ["Morning", "Afternoon", "Evening"]
};

// Safety badges based on amenity type
const amenityToSafetyBadges = {
  cafe: ["Well-lit interior", "Staff on-site", "Visible from street", "Public area"],
  restaurant: ["Staff present", "Emergency exits", "Well-lit", "Good visibility"],
  library: ["Controlled access", "Library staff", "Well-organized", "Safe environment"],
  park: ["Open area", "Good visibility", "Public space", "Community presence"],
  place_of_worship: ["Community respected", "Regular visitors", "Safe zone"],
  museum: ["Security present", "Controlled access", "Well-maintained"],
  cinema: ["Security staff", "Public area", "Well-lit"],
  garden: ["Maintained space", "Good visibility", "Open area"]
};

// Enhanced image URLs based on amenity type
const amenityImages = {
  cafe: [
    "https://images.unsplash.com/photo-1495474472645-4c71bcdd2014?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80"
  ],
  restaurant: [
    "https://images.unsplash.com/photo-1517457373614-b7152f800fd1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1537521537707-da59b99ef681?auto=format&fit=crop&w=600&q=80"
  ],
  library: [
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80"
  ],
  park: [
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80"
  ],
  museum: [
    "https://images.unsplash.com/photo-1564339629033-319f0a38e289?auto=format&fit=crop&w=600&q=80"
  ],
  garden: [
    "https://images.unsplash.com/photo-1490084857252-93c97df49eaa?auto=format&fit=crop&w=600&q=80"
  ],
  viewpoint: [
    "https://images.unsplash.com/photo-1464207687429-7505649dae38?auto=format&fit=crop&w=600&q=80"
  ]
};

// Generate meaningful description based on tags
const generateDescription = (tags, address) => {
  const amenity = tags.amenity || tags.leisure || 'place';
  const descriptions = {
    cafe: `A cozy café offering a relaxed atmosphere in ${address || 'the area'}. Perfect for casual meetings and enjoying beverages.`,
    restaurant: `A dining establishment serving meals in ${address || 'the area'}. Great for enjoying food and social gathering.`,
    library: `A library providing access to books and reading spaces in ${address || 'the area'}. Ideal for study and research.`,
    park: `A public park offering outdoor recreational space in ${address || 'the area'}. Perfect for relaxation and nature.`,
    museum: `A museum showcasing art, history, or science collections in ${address || 'the area'}. Great for learning and culture.`,
    place_of_worship: `A place of spiritual gathering in ${address || 'the area'}. Open to visitors for meditation and prayer.`,
    garden: `A maintained garden space with plants and walking paths in ${address || 'the area'}. Perfect for peaceful strolls.`,
    viewpoint: `A scenic lookout point in ${address || 'the area'} offering panoramic views of the surrounding landscape.`,
    default: `A notable location in ${address || 'the area'} worth exploring.`
  };
  return descriptions[amenity] || descriptions.default;
};

// Calculate realistic safety rating based on amenity type
const calculateSafetyRating = (amenity) => {
  const baseRatings = {
    library: 4.9,
    cafe: 4.7,
    restaurant: 4.6,
    museum: 4.8,
    place_of_worship: 4.7,
    park: 4.5,
    garden: 4.6,
    cinema: 4.8,
    viewpoint: 4.4
  };
  const baseRating = baseRatings[amenity] || 4.5;
  // Add small variance (±0.1) for realistic variation
  const variance = (Math.random() - 0.5) * 0.2;
  return Math.max(3.5, Math.min(5, baseRating + variance)).toFixed(1);
};

// Get distance in readable format
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  if (distance < 0.5) return "< 0.5 miles";
  if (distance < 1) return "< 1 mile";
  return distance.toFixed(1) + " miles";
};

// Generate tips based on amenity type and features
const generateTips = (tags, amenity) => {
  const tips = {
    cafe: [
      "Try their house specialty during peak hours for the freshest preparation.",
      "Best seating is usually near windows for natural light and people-watching.",
      "Ask about their Wi-Fi password if you plan to work or study here."
    ],
    restaurant: [
      "Check their peak hours and try to avoid crowds if you prefer quieter dining.",
      "Ask your server for house recommendations and signature dishes.",
      "Make reservations during weekends for popular spots."
    ],
    library: [
      "Carry a valid ID for registration if it's your first visit.",
      "Explore the reading rooms for the best seating with natural light.",
      "Check their digital resources and online databases for remote access."
    ],
    park: [
      "Visit early morning for peaceful walks and fresh air.",
      "Check if there are any guided nature walks or programs scheduled.",
      "Bring water and wear comfortable shoes for extended exploration."
    ],
    museum: [
      "Check online for free entry hours or discounted days.",
      "Hire an audio guide for a more immersive experience.",
      "Don't miss the museum café for a relaxed break."
    ],
    garden: [
      "Visit during blooming season for the most scenic views.",
      "Bring a camera for beautiful photo opportunities.",
      "Early morning visits offer the best light and fewer crowds."
    ],
    default: [
      "Check hours of operation before planning your visit.",
      "Call ahead if you have specific questions or requirements.",
      "Best time to visit is during off-peak hours for a better experience."
    ]
  };
  return tips[amenity] || tips.default;
};

// Format address from OSM tags
const formatAddress = (tags, fallback) => {
  const parts = [];
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (tags['addr:city'] || tags['addr:town'] || tags['addr:village']) {
    parts.push(tags['addr:city'] || tags['addr:town'] || tags['addr:village']);
  }
  if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
  if (parts.length > 0) return parts.join(', ') + ', West Bengal';
  return fallback || 'West Bengal, India';
};

export const fetchNearbyPlaces = async (lat, lng, radius = 3000, category = 'all') => {
  // Overpass API URL
  const url = 'https://overpass-api.de/api/interpreter';
  
  // Mapping categories to OSM tags
  let tags = '';
  switch (category.toLowerCase()) {
    case 'cafe':
      tags = '["amenity"="cafe"]';
      break;
    case 'restaurant':
      tags = '["amenity"="restaurant"]';
      break;
    case 'library':
      tags = '["amenity"="library"]';
      break;
    case 'nature':
    case 'river side':
      tags = '["leisure"~"park|nature_reserve"]["natural"~"water|wood"]';
      break;
    case 'peaceful':
      tags = '["amenity"~"library|place_of_worship|garden"]';
      break;
    case 'chill':
      tags = '["amenity"~"cafe|pub|park"]';
      break;
    case 'adventure':
      tags = '["leisure"~"park|nature_reserve|viewpoint"]';
      break;
    default:
      tags = '["amenity"~"cafe|restaurant|library|museum|place_of_worship"]["leisure"~"park|garden|viewpoint"]';
  }

  // Build the query
  const query = `
    [out:json][timeout:25];
    (
      node${tags}(around:${radius},${lat},${lng});
      way${tags}(around:${radius},${lat},${lng});
      relation${tags}(around:${radius},${lat},${lng});
    );
    out center;
    >;
    out skel qt;
  `;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: "data=" + encodeURIComponent(query)
    });
    const data = await response.json();

    // Map Overpass results to our places.js format with enriched data
    return data.elements
      .filter(element => element.tags && element.tags.name)
      .map(element => {
        const pLat = element.lat || element.center?.lat;
        const pLon = element.lon || element.center?.lon;
        
        // Determine primary amenity type
        const amenity = element.tags.amenity || element.tags.leisure || 'place';
        
        // Get moods based on amenity
        const moods = amenityToMoods[amenity] || [category];
        
        // Get companions
        const companions = amenityToCompanions[amenity] || ["Solo", "Friends"];
        
        // Get best times
        const times = amenityToTimes[amenity] || ["Morning", "Afternoon"];
        
        // Calculate realistic safety rating
        const safetyRating = calculateSafetyRating(amenity);
        
        // Get safety badges
        const safetyBadges = amenityToSafetyBadges[amenity] || ["Public Area", "Community space"];
        
        // Select image
        const images = amenityImages[amenity] || [
          'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
        ];
        const image = images[Math.floor(Math.random() * images.length)];
        
        // Generate enhanced data
        const address = formatAddress(element.tags, 'West Bengal, India');
        const description = generateDescription(element.tags, address);
        const tips = generateTips(element.tags, amenity);
        const distance = getDistance(lat, lng, pLat, pLon);

        return {
          id: element.id.toString(),
          name: element.tags.name,
          category: element.tags.name_en || element.tags.brand || amenity.replace(/_/g, ' '),
          description: description,
          address: address,
          lat: pLat,
          lng: pLon,
          distance: distance,
          safetyRating: parseFloat(safetyRating),
          safetyBadges: safetyBadges,
          moods: moods,
          companions: companions,
          times: times,
          tips: tips,
          image: image,
          phone: element.tags['contact:phone'] || element.tags.phone || undefined,
          website: element.tags.website || element.tags['contact:website'] || undefined,
          openingHours: element.tags.opening_hours || undefined
        };
      })
      .sort((a, b) => {
        // Sort by safety rating (higher is better)
        return b.safetyRating - a.safetyRating;
      })
      .slice(0, 20); // Limit to 20 results
  } catch (error) {
    console.error("Error fetching from Overpass:", error);
    return [];
  }
};
