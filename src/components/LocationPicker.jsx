import React, { useState } from 'react';

export default function LocationPicker({ userLocation, setUserLocation }) {
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Try to reverse-geocode to a human readable name
          (async () => {
            try {
              const revRes = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`,
                { headers: { 'Accept': 'application/json' } }
              );
              const revJson = await revRes.json();
              const display = revJson && revJson.display_name ? revJson.display_name.split(',')[0] : 'Current Location';
              setUserLocation({ lat: latitude, lng: longitude, name: display });
            } catch (err) {
              console.warn('Reverse geocoding failed, using coordinates only', err);
              setUserLocation({ lat: latitude, lng: longitude, name: 'Current Location' });
            } finally {
              setIsLocating(false);
            }
          })();
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
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setUserLocation({ lat, lng, name: data[0].display_name.split(',')[0] });
      } else {
        alert("Location not found. Please try another place.");
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
            placeholder="Search city or place..." 
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
