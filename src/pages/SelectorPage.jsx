import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '../components/LocationPicker';
import { toast } from 'sonner';

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

  // Calming atmospheric preview details matching selected mood
  const moodAtmosphere = {
    Peaceful: {
      title: 'Peaceful Sanctuary',
      tag: '🌿 Solitude & Calm',
      quote: '"Within you is a quiet sanctuary to which you can retreat at any time." — Marcus Aurelius',
      bgImg: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80',
      description: 'Lakeside viewpoint trails, serene ancient forests, and silent reading gardens.'
    },
    Romantic: {
      title: 'Romantic Escape',
      tag: '💫 Sunset Dusk & Glow',
      quote: '"In all the world, there is no heart for me like yours." — Maya Angelou',
      bgImg: 'https://images.unsplash.com/photo-1518998053401-b883c52e4d0c?auto=format&fit=crop&w=800&q=80',
      description: 'Cozy fire-lit alleys, breathtaking evening scenic views, and boat rides.'
    },
    Chill: {
      title: 'Cozy Retreat',
      tag: '😌 Unwind & Recharge',
      quote: '"Relax, breathe deep, and let the city unfold around you."',
      bgImg: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
      description: 'Lush glasshouse bistros, peaceful tree-lined paths, and specialty tea houses.'
    },
    Adventure: {
      title: 'Wild Explorer',
      tag: '🏕️ Discovery & Thrills',
      quote: '"Adventure is worthwhile in itself." — Amelia Earhart',
      bgImg: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      description: 'Hidden forest hills, panoramic sky balconies, and unmapped hiking lanes.'
    },
    'Stress Relief': {
      title: 'Zen Restorative',
      tag: '🧘 Healing Ambience',
      quote: '"Calm is the mental state of absolute clarity and peace."',
      bgImg: 'https://images.unsplash.com/photo-1503756234508-e32369269deb?auto=format&fit=crop&w=800&q=80',
      description: 'Gentle riverbank ghats, therapeutic green lawns, and fresh garden views.'
    },
    Fun: {
      title: 'Social Gathering',
      tag: '🎉 Lively & Engaging',
      quote: '"Live with no excuses and travel with no regrets."',
      bgImg: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
      description: 'Vibrant local food courts, lively evening street hubs, and scenic community lounges.'
    },
    'Study/Work': {
      title: 'Focus Zone',
      tag: '📚 Silent Flow Space',
      quote: '"Focus is the fine art of eliminating distractions."',
      bgImg: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80',
      description: 'High-speed noise-free focus lounges, archive library tables, and green study gardens.'
    }
  };

  const currentAtmosphere = selectedMood ? moodAtmosphere[selectedMood] : {
    title: 'Discover Your Vibe',
    tag: '✨ Mood Explorer',
    quote: '"Discover places that match your soul\'s emotional currents."',
    bgImg: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80',
    description: 'Provide your mood, companion, and ideal timing on the selectors panel to map out custom-curated secret spots.'
  };

  const getMoodCardColorStyle = (moodName, isSelected) => {
    const colorMapping = {
      Peaceful: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.15)] scale-[1.02]',
      Romantic: 'border-pink-500/40 bg-pink-500/10 text-pink-300 shadow-[0_0_12px_rgba(244,114,182,0.15)] scale-[1.02]',
      Chill: 'border-teal-500/40 bg-teal-500/10 text-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.15)] scale-[1.02]',
      Adventure: 'border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.15)] scale-[1.02]',
      'Stress Relief': 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300 shadow-[0_0_12px_rgba(129,140,248,0.15)] scale-[1.02]',
      Fun: 'border-rose-500/40 bg-rose-500/10 text-rose-300 shadow-[0_0_12px_rgba(251,113,133,0.15)] scale-[1.02]',
      'Study/Work': 'border-blue-500/40 bg-blue-500/10 text-blue-300 shadow-[0_0_12px_rgba(96,165,250,0.15)] scale-[1.02]'
    };

    if (isSelected) {
      return colorMapping[moodName] || 'border-white bg-white/20 text-white';
    }
    return 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-white/80';
  };

  const isComplete = selectedMood && selectedCompanion && selectedTime && userLocation;

  const handleCTA = () => {
    if (isComplete) {
      navigate('/results');
    }
  };

  return (
    <div 
      className={`w-full h-full flex flex-col md:flex-row relative overflow-hidden bg-cover bg-center transition-opacity duration-700 ${animate ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80')" }}
    >
      
      {/* Immersive overlay masks */}
      <div className="absolute inset-0 bg-black/45 z-0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25 z-0 pointer-events-none"></div>

      {/* Background Ambient Glows */}
      <div className="bg-ambient-glow bg-gradient-to-r from-emerald-500/10 to-teal-500/5 top-[15%] left-[25%] w-[400px] h-[400px] pointer-events-none"></div>
      <div className="bg-ambient-glow bg-gradient-to-r from-amber-500/5 to-rose-500/5 bottom-[10%] right-[15%] w-[500px] h-[500px] pointer-events-none"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="ambient-particle w-1.5 h-1.5 top-[15%] left-[10%] [animation-delay:0s]"></div>
        <div className="ambient-particle w-2.5 h-2.5 top-[45%] left-[25%] [animation-delay:2s]"></div>
        <div className="ambient-particle w-2 h-2 top-[75%] left-[15%] [animation-delay:4.5s]"></div>
        <div className="ambient-particle w-1.5 h-1.5 top-[30%] left-[80%] [animation-delay:1.5s]"></div>
        <div className="ambient-particle w-2 h-2 top-[65%] left-[70%] [animation-delay:6s]"></div>
        <div className="ambient-particle w-3 h-3 top-[80%] left-[90%] [animation-delay:3.5s]"></div>
      </div>

      {/* LEFT PANEL: Selectors */}
      <aside className="w-full md:w-[420px] flex-shrink-0 bg-black/35 border-r border-white/10 flex flex-col relative h-full backdrop-blur-xl z-20 text-white">
        
        {/* SOS banner strip (top) */}
        <div 
          onClick={onOpenSOS} 
          className="bg-red-500/10 border border-red-500/35 rounded-2xl m-4 p-3.5 flex justify-between items-center shadow-md cursor-pointer hover:bg-red-500/15 transition-all duration-300"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-sos-red rounded-full animate-sos-blink"></span>
            <span className="text-xs font-bold text-red-400 tracking-tight">
              SOS active — tap if you feel unsafe
            </span>
          </div>
          <button className="bg-white/10 hover:bg-white/20 border border-red-500/25 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg shadow-sm transition active:scale-95">
            🚨 SOS
          </button>
        </div>

        {/* Scrollable selectors grid */}
        <div className="flex-1 overflow-y-auto px-6 pb-36 no-scrollbar">
          
          <div className="mt-2">
            <LocationPicker userLocation={userLocation} setUserLocation={setUserLocation} />
          </div>

          <div className="mb-6 mt-4">
            <h1 
              className="font-medium text-2xl text-white/95 tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              How are you feeling today?
            </h1>
            <p className="text-[11px] text-white/60 mt-1 leading-relaxed font-light font-sans">
              Tailor your escape by selecting your mood, companions, and ideal time.
            </p>
          </div>

          {/* Mood Section */}
          <div className="mb-6">
            <h2 className="text-[9px] font-extrabold text-white/40 tracking-widest uppercase mb-3">
              Your Current Mood
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-2 gap-2">
              {moods.map((m) => {
                const isSelected = selectedMood === m.name;
                return (
                  <div
                    key={m.name}
                    onClick={() => {
                      const nextMood = isSelected ? null : m.name;
                      setSelectedMood(nextMood);
                      if (nextMood) {
                        toast.success(`Mood set to: ${m.name} ${m.icon}`, {
                          id: 'mood-select',
                        });
                      } else {
                        toast.info('Mood cleared', {
                          id: 'mood-select',
                        });
                      }
                    }}
                    className={`p-3 border rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all duration-300 select-none ${getMoodCardColorStyle(m.name, isSelected)} ${m.name === 'Study/Work' ? 'col-span-3 md:col-span-2' : ''}`}
                  >
                    <span className={`text-2xl mb-1 transition-transform duration-300 ${isSelected ? 'scale-115 rotate-3' : ''}`}>
                      {m.icon}
                    </span>
                    <span className="text-xs font-bold tracking-wide">
                      {m.name}
                    </span>
                    <span className={`text-[9px] mt-0.5 leading-none transition-colors ${isSelected ? 'text-white/80' : 'text-white/40'}`}>
                      {m.hint}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Companion Section */}
          <div className="mb-6">
            <h2 className="text-[9px] font-extrabold text-white/40 tracking-widest uppercase mb-3">
              Who's with you?
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {companions.map((c) => {
                const isSelected = selectedCompanion === c.name;
                return (
                  <div
                    key={c.name}
                    onClick={() => setSelectedCompanion(isSelected ? null : c.name)}
                    className={`py-2.5 px-1 border rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all duration-300 select-none ${
                      isSelected 
                        ? 'bg-white/20 border-white text-white font-bold scale-[1.02] shadow-sm' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/80'
                    }`}
                  >
                    <span className="text-lg mb-0.5">{c.icon}</span>
                    <span className="text-[10px] font-bold tracking-wide">
                      {c.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Section */}
          <div className="mb-6">
            <h2 className="text-[9px] font-extrabold text-white/40 tracking-widest uppercase mb-3">
              Time of Day
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {times.map((t) => {
                const isSelected = selectedTime === t.name;
                return (
                  <div
                    key={t.name}
                    onClick={() => setSelectedTime(isSelected ? null : t.name)}
                    className={`py-2.5 px-1 border rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all duration-300 select-none ${
                      isSelected 
                        ? 'bg-white/20 border-white text-white font-bold scale-[1.02] shadow-sm' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/80'
                    }`}
                  >
                    <span className="text-lg mb-0.5">{t.icon}</span>
                    <span className="text-[9px] font-bold tracking-wide">
                      {t.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Sticky footer tags + find CTA */}
        <div className="absolute bottom-0 left-0 w-full bg-black/45 backdrop-blur-xl border-t border-white/10 p-5 z-20 shadow-lg">
          <div className="flex flex-wrap gap-1.5 min-height-[28px] mb-3">
            {userLocation && (
              <span className="bg-white/10 border border-white/15 text-white text-[9px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 animate-fade-in-load">
                📍 {userLocation.name}
              </span>
            )}
            {selectedMood && (
              <span className="bg-white/10 border border-white/15 text-white text-[9px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 animate-fade-in-load">
                {moods.find(m => m.name === selectedMood)?.icon} {selectedMood}
              </span>
            )}
            {selectedCompanion && (
              <span className="bg-white/10 border border-white/15 text-white text-[9px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 animate-fade-in-load">
                {companions.find(c => c.name === selectedCompanion)?.icon} {selectedCompanion}
              </span>
            )}
            {selectedTime && (
              <span className="bg-white/10 border border-white/15 text-white text-[9px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 animate-fade-in-load">
                {times.find(t => t.name === selectedTime)?.icon} {selectedTime}
              </span>
            )}
          </div>
          
          <button
            onClick={handleCTA}
            disabled={!isComplete}
            className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-heading text-sm font-bold py-3.5 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-500 ease-out active:scale-98 ${
              isComplete ? 'opacity-100 cursor-pointer' : 'opacity-30 cursor-not-allowed'
            }`}
          >
            🗺️ Find Hidden Places
          </button>
        </div>

      </aside>

      {/* RIGHT PANEL: Calming Immersive Atmospheric Preview */}
      <main className="hidden md:flex flex-1 relative h-full items-center justify-center p-12 z-10">
        
        {/* Softly breathing, floating translucent preview card */}
        <div 
          className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl rounded-3xl overflow-hidden transition-all duration-700 flex flex-col"
          style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}
        >
          
          {/* Card Scenic Cover Visual */}
          <div 
            className="h-48 bg-cover bg-center relative transition-all duration-700 flex items-end p-6"
            style={{ backgroundImage: `url('${currentAtmosphere.bgImg}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-0"></div>
            
            <div className="z-10 w-full flex justify-between items-center">
              <span className="bg-white/10 backdrop-blur-xs border border-white/20 text-white text-[9px] font-bold py-1 px-3 rounded-full uppercase tracking-wider">
                {currentAtmosphere.tag}
              </span>
            </div>
          </div>

          {/* Description & Ambience Details */}
          <div className="p-6 text-white flex-1 flex flex-col justify-between">
            <div>
              <h3 
                className="text-xl font-medium tracking-wide text-white/95"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {currentAtmosphere.title}
              </h3>
              
              <p className="text-xs text-white/70 leading-relaxed font-light mt-2.5">
                {currentAtmosphere.description}
              </p>
            </div>

            <div className="mt-8 border-t border-white/10 pt-4 text-left">
              <span className="text-[9px] font-extrabold text-white/40 uppercase tracking-widest block mb-1">
                Calming Resonance
              </span>
              <p className="text-xs italic text-white/80 leading-relaxed font-light font-heading">
                {currentAtmosphere.quote}
              </p>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
