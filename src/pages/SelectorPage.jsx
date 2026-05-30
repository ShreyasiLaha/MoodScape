import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '../components/LocationPicker';

export default function SelectorPage({ 
  selectedMood, setSelectedMood,
  selectedCompanion, setSelectedCompanion,
  selectedTime, setSelectedTime,
  onOpenSOS,
  userLocation, setUserLocation
}) {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const moods = [
    { name: 'Peaceful', icon: '🌿', hint: 'Quiet & calm' },
    { name: 'Romantic', icon: '💫', hint: 'Scenic & cozy' },
    { name: 'Chill', icon: '😌', hint: 'Relax & unwind' },
    { name: 'Adventure', icon: '🏕️', hint: 'Explore & thrill' },
    { name: 'Stress Relief', icon: '🧘', hint: 'Heal & restore' },
    { name: 'Fun', icon: '🎉', hint: 'Lively & social' },
    { name: 'Study/Work', icon: '📚', hint: 'Focus zones' },
  ];

  const companions = [
    { name: 'Solo', icon: '🧍' },
    { name: 'Duet', icon: '👫' },
    { name: 'Friends', icon: '👥' },
    { name: 'Family', icon: '👨‍👩‍👧' }
  ];

  const times = [
    { name: 'Morning', icon: '🌅' },
    { name: 'Afternoon', icon: '☀️' },
    { name: 'Evening', icon: '🌆' },
    { name: 'Night', icon: '🌙' }
  ];

  const isComplete = selectedMood && selectedCompanion && selectedTime && userLocation;

  const handleCTA = () => {
    if (isComplete) {
      navigate('/results');
    }
  };

  return (
    <div className={`w-full h-full flex flex-col md:flex-row transition-opacity duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* LEFT PANEL: Selectors */}
      <aside className="w-full md:w-[400px] flex-shrink-0 bg-card border-r border-border flex flex-col relative h-full">
        
        {/* SOS banner strip (top) */}
        <div 
          onClick={onOpenSOS} 
          className="bg-sos-bg border border-sos-border rounded-xl m-4 p-3 flex justify-between items-center shadow-sm cursor-pointer hover:bg-sos-bg/85 transition"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-sos-red rounded-full animate-sos-blink"></span>
            <span className="text-xs font-bold text-sos-red tracking-tight">
              SOS active — tap if you feel unsafe
            </span>
          </div>
          <button className="bg-white border border-sos-border text-text-primary text-[10px] font-bold py-1 px-2.5 rounded-lg shadow-sm">
            🚨 SOS
          </button>
        </div>

        {/* Scrollable selectors grid */}
        <div className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar">
          
          <div className="mt-4">
            <LocationPicker userLocation={userLocation} setUserLocation={setUserLocation} />
          </div>

          <div className="mb-6 mt-2">
            <h1 className="font-heading text-2xl font-extrabold tracking-tight">
              How are you feeling?
            </h1>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              Pick your mood, companion, and time to discover hidden places.
            </p>
          </div>

          {/* Mood Section */}
          <div className="mb-6">
            <h2 className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-3">
              Your Mood
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
              {moods.map((m) => {
                const isSelected = selectedMood === m.name;
                return (
                  <div
                    key={m.name}
                    onClick={() => setSelectedMood(isSelected ? null : m.name)}
                    className={`p-3 border rounded-xl flex flex-col items-center text-center cursor-pointer transition-all duration-200 select-none ${
                      isSelected 
                        ? 'bg-selected-bg border-2 border-primary-green scale-[1.02] shadow-sm' 
                        : 'bg-card border-border hover:translate-y-[-1px] hover:shadow-sm'
                    } ${m.name === 'Study/Work' ? 'col-span-3 md:col-span-2' : ''}`}
                  >
                    <span className={`text-2xl mb-1.5 transition-transform ${isSelected ? 'scale-110 rotate-3' : ''}`}>
                      {m.icon}
                    </span>
                    <span className={`text-xs font-bold ${isSelected ? 'text-primary-green' : 'text-text-primary'}`}>
                      {m.name}
                    </span>
                    <span className="text-[9px] text-text-secondary mt-0.5 leading-none">
                      {m.hint}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Companion Section */}
          <div className="mb-6">
            <h2 className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-3">
              Who's with you?
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {companions.map((c) => {
                const isSelected = selectedCompanion === c.name;
                return (
                  <div
                    key={c.name}
                    onClick={() => setSelectedCompanion(isSelected ? null : c.name)}
                    className={`py-2 px-1 border rounded-xl flex flex-col items-center text-center cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'bg-selected-bg border-2 border-primary-green scale-[1.02]' 
                        : 'bg-card border-border hover:translate-y-[-1px]'
                    }`}
                  >
                    <span className="text-lg mb-1">{c.icon}</span>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-primary-green' : 'text-text-primary'}`}>
                      {c.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Section */}
          <div className="mb-6">
            <h2 className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-3">
              Time of Day
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {times.map((t) => {
                const isSelected = selectedTime === t.name;
                return (
                  <div
                    key={t.name}
                    onClick={() => setSelectedTime(isSelected ? null : t.name)}
                    className={`py-2 px-1 border rounded-xl flex flex-col items-center text-center cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'bg-selected-bg border-2 border-primary-green scale-[1.02]' 
                        : 'bg-card border-border hover:translate-y-[-1px]'
                    }`}
                  >
                    <span className="text-lg mb-1">{t.icon}</span>
                    <span className={`text-[9px] font-bold ${isSelected ? 'text-primary-green' : 'text-text-primary'}`}>
                      {t.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Sticky footer tags + find CTA */}
        <div className="absolute bottom-0 left-0 w-full bg-card border-t border-border p-5 z-20 shadow-md">
          <div className="flex flex-wrap gap-1.5 min-height-[28px] mb-3">
            {userLocation && (
              <span className="bg-primary-green text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 animate-fade-in-load">
                📍 {userLocation.name}
              </span>
            )}
            {selectedMood && (
              <span className="bg-primary-green text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 animate-fade-in-load">
                {moods.find(m => m.name === selectedMood)?.icon} {selectedMood}
              </span>
            )}
            {selectedCompanion && (
              <span className="bg-primary-green text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 animate-fade-in-load">
                {companions.find(c => c.name === selectedCompanion)?.icon} {selectedCompanion}
              </span>
            )}
            {selectedTime && (
              <span className="bg-primary-green text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 animate-fade-in-load">
                {times.find(t => t.name === selectedTime)?.icon} {selectedTime}
              </span>
            )}
          </div>
          
          <button
            onClick={handleCTA}
            disabled={!isComplete}
            className={`w-full bg-primary-green hover:bg-primary-green/90 text-white font-heading text-sm font-bold py-3.5 rounded-xl shadow-md transition-all duration-300 ${
              isComplete ? 'opacity-100 cursor-pointer' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            🗺️ Find Hidden Places
          </button>
        </div>

      </aside>

      {/* RIGHT PANEL: Blurred Preview Map */}
      <main className="hidden md:block flex-1 relative bg-page h-full">
        {/* Soft Blurred nature image acting as a map outline placeholder */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-[6px] opacity-25 scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')" }}
        ></div>
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-page/40 backdrop-blur-xs flex flex-col justify-center items-center p-8 z-10">
          <div className="text-center max-w-sm animate-fade-in-load">
            <span className="text-5xl block mb-4">🗺️</span>
            <h3 className="font-heading text-lg font-bold text-text-primary">
              Discover Hidden Places
            </h3>
            <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                Make your selections on the left panel to unlock custom recommendations mapped around your location.
            </p>
          </div>
        </div>
      </main>

    </div>
  );
}
