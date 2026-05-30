import React, { useState } from 'react';

export default function LocationPicker({ userLocation, setUserLocation }) {
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // West Bengal approximate bounding box
  const isWithinWB = (lat, lng) => {
    return lat >= 21.5 && lat <= 27.5 && lng >= 85.8 && lng <= 89.9;
  };

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (isWithinWB(latitude, longitude)) {
            setUserLocation({
              lat: latitude,
              lng: longitude,
              name: "Current Location"
            });
          } else {
            alert("Your current location is outside West Bengal. Please search for a place within WB.");
          }
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please enter a city manually.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const handleSearchLocation = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', West Bengal')}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        
        if (isWithinWB(lat, lng)) {
          setUserLocation({ lat, lng, name: data[0].display_name.split(',')[0] });
        } else {
          alert("The location found is outside West Bengal. Please try again.");
        }
      } else {
        alert("Location not found. Please try another place in West Bengal.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Failed to find location. Please try again.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
      <h3 className="font-semibold text-gray-800 mb-3 text-sm">Where are you?</h3>
      
      <div className="flex flex-col gap-3">
        <button 
          onClick={handleGetCurrentLocation}
          className="flex items-center justify-center gap-2 w-full py-2 bg-primary-green/10 text-primary-green rounded-lg font-medium hover:bg-primary-green/20 transition-colors text-sm"
          disabled={isLocating}
        >
          <span>📍</span>
          {isLocating ? 'Locating...' : (userLocation ? `Using: ${userLocation.name}` : 'Use Current Location')}
        </button>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <form onSubmit={handleSearchLocation} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search city in West Bengal..." 
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-green"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-black transition-colors"
          >
            Set
          </button>
        </form>
      </div>
    </div>
  );
}
