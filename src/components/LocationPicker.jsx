import React, { useState } from 'react';
import { toast } from 'sonner';

export default function LocationPicker({ userLocation, setUserLocation }) {
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    const toastId = toast.loading("Requesting location permission...");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Try to reverse-geocode to a human readable name
          (async () => {
            try {
              toast.loading("Resolving your address details...", { id: toastId });
              const revRes = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`,
                { headers: { 'Accept': 'application/json' } }
              );
              const revJson = await revRes.json();
              const display = revJson && revJson.display_name ? revJson.display_name.split(',')[0] : 'Current Location';
              setUserLocation({ lat: latitude, lng: longitude, name: display });
              toast.success(`Location set to: ${display} 📍`, { id: toastId });
            } catch (err) {
              console.warn('Reverse geocoding failed, using coordinates only', err);
              setUserLocation({ lat: latitude, lng: longitude, name: 'Current Location' });
              toast.success("Location set based on GPS coordinates! 📍", { id: toastId });
            } finally {
              setIsLocating(false);
            }
          })();
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Location access denied or unavailable. Please enter a city manually.", { id: toastId });
          setIsLocating(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.", { id: toastId });
      setIsLocating(false);
    }
  };

  const handleSearchLocation = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const toastId = toast.loading(`Searching for "${searchQuery}"...`);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const display = data[0].display_name.split(',')[0];
        setUserLocation({ lat, lng, name: display });
        toast.success(`Location set to: ${display} 📍`, { id: toastId });
        setSearchQuery('');
      } else {
        toast.error("Location not found. Please try another search term.", { id: toastId });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast.error("Failed to find location. Check your network and retry.", { id: toastId });
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg mb-6">
      <h3 className="font-semibold text-white/90 mb-3 text-sm">Where are you today?</h3>
      
      <div className="flex flex-col gap-3">
        <button 
          onClick={handleGetCurrentLocation}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/10 text-white rounded-xl border border-white/10 font-semibold hover:bg-white/20 transition-all text-sm active:scale-98 shadow-sm"
          disabled={isLocating}
        >
          <span>📍</span>
          {isLocating ? 'Locating...' : (userLocation ? `Using: ${userLocation.name}` : 'Use Current Location')}
        </button>

        <div className="flex items-center gap-2 py-0.5">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-[10px] text-white/40 font-bold tracking-widest">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <form onSubmit={handleSearchLocation} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search city or place..." 
            className="flex-1 px-3 py-2 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-white/30 bg-white/5 text-white placeholder-white/40 focus:ring-1 focus:ring-white/25 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-bold transition-all border border-white/10 active:scale-95 shadow-sm"
          >
            Set
          </button>
        </form>
      </div>
    </div>
  );
}
