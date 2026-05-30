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
      tags = '["amenity"~"library|place_of_worship"]';
      break;
    case 'chill':
      tags = '["amenity"~"cafe|pub"]';
      break;
    default:
      tags = '["amenity"~"cafe|restaurant|library"]';
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

    // Map Overpass results to our places.js format
    return data.elements
      .filter(element => element.tags && element.tags.name)
      .map(element => {
        const pLat = element.lat || element.center?.lat;
        const pLon = element.lon || element.center?.lon;
        const address = [
          element.tags['addr:street'],
          element.tags['addr:city'],
          element.tags['addr:state'],
          element.tags['addr:country']
        ].filter(Boolean).join(', ') || 'Unknown location';

        return {
          id: element.id.toString(),
          name: element.tags.name,
          category: element.tags.amenity || element.tags.leisure || 'Place',
          description: `A discovered location around ${address}.`,
          address: address,
          lat: pLat,
          lng: pLon,
          safetyRating: (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1),
          safetyBadges: ['Public Area'],
          moods: [category],
          times: ['Afternoon'],
          companions: ['Solo'],
          tips: ['Always check hours before visiting.', 'Great local spot!']
        };
      })
      .slice(0, 20); // Limit to 20 results
  } catch (error) {
    console.error("Error fetching from Overpass:", error);
    return [];
  }
};
