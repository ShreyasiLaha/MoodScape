import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../logo_icon.png';
import { places as fallbackPlaces } from '../data/places';
import { fetchNearbyPlaces } from '../services/overpassApi';
import L from 'leaflet';

export default function ResultsPage({ 
  selectedMood,
  selectedCompanion,
  selectedTime,
  favorites,
  onToggleFavorite,
  onOpenSOS,
  userLocation
}) {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const markersGroupRef = useRef([]);
  
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [internalUserLoc, setInternalUserLoc] = useState(userLocation);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  // 1. Fetch dynamic places based on selectors and user location
  useEffect(() => {
    const fetchData = async () => {
      const loc = internalUserLoc || userLocation;
      if (!loc) return;

      setIsFetching(true);
      // Determine category based on mood or search query
      let category = 'all';
      if (searchQuery) category = searchQuery;
      else if (selectedMood === 'Chill' || selectedMood === 'Romantic') category = 'cafe';
      else if (selectedMood === 'Study/Work' || selectedMood === 'Peaceful') category = 'library';
      else if (selectedMood === 'Adventure' || selectedMood === 'Stress Relief') category = 'nature';

      const results = await fetchNearbyPlaces(loc.lat, loc.lng, 5000, category);
      if (results.length > 0) {
        setFilteredPlaces(results);
      } else {
        // Fallback to static if OSM returns nothing
        setFilteredPlaces(fallbackPlaces.slice(0, 5));
      }
      setIsFetching(false);
    };

    fetchData();
  }, [selectedMood, selectedCompanion, selectedTime, searchQuery, internalUserLoc, userLocation]);

  // 2. Initialize Leaflet Map
  useEffect(() => {
    // Standard Leaflet import check
    if (typeof window !== 'undefined' && !mapRef.current) {
      const mapInstance = L.map('results-map', {
        zoomControl: true
      }).setView([22.9868, 87.8550], 7);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);

      mapRef.current = mapInstance;

      // Use provided location or detect
      const loc = internalUserLoc || userLocation;
      
      const plotUserLocation = (lat, lng) => {
        // Create pulsing blue user marker
        const userIcon = L.divIcon({
          html: `<div class="custom-leaflet-marker user-marker">🧍</div>`,
          className: 'leaflet-user-divicon-wrapper',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        if (userMarkerRef.current) {
          mapInstance.removeLayer(userMarkerRef.current);
        }
        
        const marker = L.marker([lat, lng], { icon: userIcon })
          .addTo(mapInstance)
          .bindPopup("<b>Your Location</b>");
        
        userMarkerRef.current = marker;
        mapInstance.setView([lat, lng], 13);
      };

      if (loc) {
        plotUserLocation(loc.lat, loc.lng);
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setInternalUserLoc({ lat: latitude, lng: longitude, name: 'Current Location' });
            plotUserLocation(latitude, longitude);
          },
          (err) => console.warn(err.message),
          { enableHighAccuracy: true, timeout: 6000 }
        );
      }
    }

    // Invalidate map layout sizes on initialization delay
    setTimeout(() => {
      if (mapRef.current) mapRef.current.invalidateSize();
    }, 150);

    return () => {
      // Map cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 3. Update Markers when filtered places change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear previous markers
    markersGroupRef.current.forEach(m => mapRef.current.removeLayer(m));
    markersGroupRef.current = [];

    // Plot new green markers
    filteredPlaces.forEach(place => {
      const icon = L.divIcon({
        html: `<div class="custom-leaflet-marker">📍</div>`,
        className: 'leaflet-custom-marker-div',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const marker = L.marker([place.lat, place.lng], { icon })
        .addTo(mapRef.current);

      // Create Popup with Place name + details launch button
      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-center';
      popupContent.innerHTML = `
        <h5 class="font-heading font-bold text-xs text-text-primary">${place.name}</h5>
        <button class="mt-1.5 bg-primary-green hover:bg-primary-green/90 text-white text-[10px] font-bold px-2 py-1 rounded transition">
          View Details
        </button>
      `;

      popupContent.querySelector('button').onclick = () => {
        setSelectedPlace(place);
      };

      marker.bindPopup(popupContent);
      markersGroupRef.current.push(marker);
    });

    // Handle initial favorites hash routing parameters
    if (window.location.hash === '#favorites' && filteredPlaces.length > 0) {
      // Filter list showing favorites
      const favs = filteredPlaces.filter(p => favorites.includes(p.id));
      if (favs.length > 0) {
        setFilteredPlaces(favs);
        window.location.hash = ''; // clear hash
      }
    }

  }, [filteredPlaces, favorites]);

  const handleDirections = (place) => {
    if (confirm(`Open Google Maps navigation to ${place.name}?`)) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.address)}`, '_blank');
    }
  };

  const getEmojiForMood = (moodName) => {
    const list = { Peaceful: '🌿', Romantic: '💫', Chill: '😌', Adventure: '🏕️', 'Stress Relief': '🧘', Fun: '🎉', 'Study/Work': '📚' };
    return list[moodName] || '📍';
  };

  const getEmojiForCompanion = (comp) => {
    const list = { Solo: '🧍', Duet: '👫', Friends: '👥', Family: '👨‍👩‍👧' };
    return list[comp] || '👥';
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-page">
      
      {/* Search & Navigation header */}
      <header className="h-[60px] bg-white border-b border-border px-4 flex justify-between items-center z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/selector')} 
            className="text-text-primary hover:bg-page p-2 rounded-full transition flex items-center justify-center font-bold text-sm"
          >
            ⬅️ Back
          </button>
          <div className="flex items-center gap-2.5">
            <img src={logoIcon} alt="MoodScape Logo" className="h-[24px] w-[24px] object-contain hidden sm:inline" />
            <span 
              className="font-extrabold text-base hidden sm:inline text-primary-green tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              MoodScape
            </span>
          </div>
        </div>

        <div className="flex-1 max-w-xs mx-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-secondary">🔍</span>
            <input
              type="text"
              placeholder="Search by name, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 border border-border rounded-full text-xs bg-page focus:outline-none focus:border-primary-green focus:bg-white transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Selections display indicator */}
          <div className="hidden lg:flex gap-1">
            {selectedMood && <span className="bg-selected-bg text-primary-green text-[9px] font-bold px-2 py-0.5 rounded-full">{getEmojiForMood(selectedMood)} {selectedMood}</span>}
            {selectedCompanion && <span className="bg-selected-bg text-primary-green text-[9px] font-bold px-2 py-0.5 rounded-full">{getEmojiForCompanion(selectedCompanion)} {selectedCompanion}</span>}
          </div>
        </div>
      </header>

      {/* Main Sections (Map Top, Results Grid Bottom) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP SECTION: Map */}
        <section className="h-[45vh] sm:h-[50vh] relative border-b border-border flex-shrink-0 z-10">
          <div id="results-map" className="w-full h-full"></div>
        </section>

        {/* BOTTOM SECTION: Results Cards Grid */}
        <section className="flex-1 overflow-y-auto p-6 no-scrollbar bg-page">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading text-lg font-bold text-text-primary">
              Recommended Places
            </h2>
            <span className="text-xs font-semibold text-text-secondary">
              Found {filteredPlaces.length} spots
            </span>
          </div>

          {isFetching ? (
            <div className="flex justify-center py-10">
              <span className="text-primary-green animate-pulse">Loading amazing places...</span>
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="bg-white rounded-xl border border-border p-12 text-center max-w-md mx-auto my-6">
              <span className="text-4xl block mb-2">🗺️</span>
              <h4 className="font-heading font-bold text-sm">No spots matches criteria</h4>
              <p className="text-xs text-text-secondary mt-1 max-w-xs mx-auto leading-relaxed">
                Try clearing search terms or navigate back to adjust companion and time parameters.
              </p>
              <button 
                onClick={() => { setSearchQuery(''); navigate('/selector'); }}
                className="mt-4 bg-primary-green text-white text-xs font-bold py-2 px-6 rounded-lg shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
              {filteredPlaces.map((place, idx) => {
                const isSaved = favorites.includes(place.id);
                return (
                  <div
                    key={place.id}
                    onClick={() => setSelectedPlace(place)}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                    className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:translate-y-[-3px] hover:shadow-md transition-all duration-300 cursor-pointer animate-fade-in-load"
                  >
                    <div 
                      className="h-32 bg-cover bg-center relative"
                      style={{ backgroundImage: `url('${place.image}')` }}
                    >
                      <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold py-1 px-2.5 rounded-full uppercase tracking-wider">
                        {place.category}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(place.id);
                        }}
                        className="absolute top-2 right-2 bg-white/95 text-xs p-1.5 rounded-full shadow-sm"
                      >
                        {isSaved ? '❤️' : '🤍'}
                      </button>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-heading text-sm font-bold text-text-primary line-clamp-1">
                          {place.name}
                        </h4>
                        <span className="text-[10px] text-text-secondary font-bold whitespace-nowrap">
                          {place.distance}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-yellow-500 text-xs">⭐</span>
                        <span className="text-[11px] font-bold text-text-primary">
                          {place.safetyRating}
                        </span>
                        <span className="text-[10px] text-text-secondary border-l border-border pl-1.5 font-bold">
                          Safety: {Math.round(place.safetyRating * 20)}%
                        </span>
                      </div>

                      <button className="w-full mt-4 border border-border hover:bg-page text-primary-green font-heading text-xs font-bold py-2 rounded-lg transition">
                        View Details ➔
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>

      {/* PLACE DETAILS DRAWER (Slides in from right side) */}
      <div 
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          selectedPlace ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
      >
        {/* Backdrop overlay */}
        <div 
          onClick={() => setSelectedPlace(null)}
          className={`absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300 ${
            selectedPlace ? 'opacity-100' : 'opacity-0'
          }`}
        ></div>

        {/* Panel wrapper drawer */}
        <div 
          className={`absolute top-0 right-0 h-full w-full sm:w-[440px] bg-card shadow-2xl flex flex-col z-10 transition-transform duration-300 transform ${
            selectedPlace ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {selectedPlace && (
            <div className="flex flex-col h-full overflow-hidden">
              
              {/* Image Header with close overlay */}
              <div 
                className="h-52 bg-cover bg-center relative flex-shrink-0"
                style={{ backgroundImage: `url('${selectedPlace.image}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 z-0"></div>
                <button 
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-4 left-4 bg-black/55 hover:bg-black/75 text-white font-bold px-3 py-1.5 rounded-full text-xs shadow transition z-10"
                >
                  ⬅️ Back
                </button>
                <button 
                  onClick={() => onToggleFavorite(selectedPlace.id)}
                  className={`absolute top-4 right-16 bg-white border text-xs font-bold px-3 py-1.5 rounded-full shadow transition z-10 ${
                    favorites.includes(selectedPlace.id) ? 'bg-sos-bg text-sos-red border-sos-border' : 'text-text-primary'
                  }`}
                >
                  {favorites.includes(selectedPlace.id) ? '❤️ Saved' : '🤍 Save'}
                </button>
                <button 
                  onClick={onOpenSOS}
                  className="absolute top-4 right-4 bg-sos-red hover:bg-sos-red/90 text-white font-bold px-3 py-1.5 rounded-full text-xs shadow transition z-10"
                >
                  🚨 SOS
                </button>

                <div className="absolute bottom-4 left-5 right-5 z-10">
                  <span className="bg-primary-green text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedPlace.category}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-white mt-1">
                    {selectedPlace.name}
                  </h3>
                </div>
              </div>

              {/* Drawer Body Scroll */}
              <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
                
                {/* Rating row */}
                <div className="flex justify-between items-center bg-page border border-border rounded-xl p-3.5 shadow-xs mb-5">
                  <span className="text-xs font-bold text-text-primary flex items-center gap-1">
                    ⭐ <strong className="text-primary-green">{selectedPlace.safetyRating}</strong> / 5.0 Safety Score
                  </span>
                  <span className="text-xs font-bold text-text-secondary">
                    📍 {selectedPlace.distance} away
                  </span>
                </div>

                <div className="mb-5">
                  <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">Description</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {selectedPlace.description}
                  </p>
                </div>

                {/* Tags row */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  <div className="bg-page p-2 border border-border rounded-lg text-center">
                    <span className="text-[10px] font-bold text-text-secondary block">BEST TIME</span>
                    <span className="text-xs font-bold text-primary-green mt-0.5 inline-block">
                      {selectedPlace.times[0]} {selectedPlace.times.includes('Night') ? '🌆' : '☀️'}
                    </span>
                  </div>
                  <div className="bg-page p-2 border border-border rounded-lg text-center">
                    <span className="text-[10px] font-bold text-text-secondary block">COMPANION STATE</span>
                    <span className="text-xs font-bold text-primary-green mt-0.5 inline-block">
                      {selectedPlace.companions.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1.5">💡 Explorer Tips</h4>
                  <ul className="list-disc pl-4 text-xs text-text-secondary leading-relaxed space-y-1.5">
                    {selectedPlace.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-5">
                  <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">📍 Address</h4>
                  <p className="text-xs text-text-secondary">
                    {selectedPlace.address}
                  </p>
                </div>

              </div>

              {/* Directions footer */}
              <div className="p-4 border-t border-border bg-white flex-shrink-0">
                <button 
                  onClick={() => handleDirections(selectedPlace)}
                  className="w-full bg-primary-green hover:bg-primary-green/90 text-white font-heading text-sm font-bold py-3.5 rounded-xl shadow transition"
                >
                  🗺️ Get Directions
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

    </div>
  );
}
