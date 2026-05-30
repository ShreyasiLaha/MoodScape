import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage({ onOpenSettings, onOpenSOS, onOpenFeedback, favoritesCount }) {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger fade-in stagger animations
    setAnimate(true);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black select-none">
      
      {/* Autoplay Loop Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        poster="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80"
      >
        <source 
          src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4" 
          type="video/mp4" 
        />
        {/* Fallback image inside if video source fails */}
        <img 
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80" 
          alt="Misty nature forest" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </video>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/45 z-10"></div>

      {/* Transparent Navbar */}
      <header className="absolute top-0 left-0 w-full h-16 px-6 flex justify-between items-center z-30 bg-transparent">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="font-heading text-lg font-bold text-white tracking-tight">
            Hidden Places
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/results#favorites')} 
            className="text-white hover:text-white/80 text-xs font-semibold flex items-center gap-1.5 border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg transition"
          >
            ❤️ Saved <span className="bg-primary-green text-white text-[9px] px-1.5 py-0.5 rounded-full">{favoritesCount}</span>
          </button>
          
          <button 
            onClick={onOpenSettings} 
            className="text-white hover:text-white/80 text-xs font-semibold border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg transition"
          >
            ⚙️ Settings
          </button>

          <button 
            onClick={onOpenFeedback} 
            className="text-white hover:text-white/80 text-xs font-semibold border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg transition"
          >
            💬 Feedback
          </button>

          <button 
            onClick={onOpenSOS} 
            className="bg-sos-red hover:bg-sos-red/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md transition"
          >
            🚨 SOS
          </button>
        </div>
      </header>

      {/* Centered Main Brand Content */}
      <main className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 px-4">
        
        <div className={`transition-all duration-1000 transform ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="text-5xl block mb-4">🌿</span>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            Hidden Places
          </h1>
        </div>

        <div className={`mt-3 transition-all duration-1000 delay-300 transform ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-base sm:text-lg text-white/95 font-light leading-relaxed max-w-sm drop-shadow-sm">
            Discover secret places. Feel the city differently.
          </p>
        </div>

        <div className={`mt-8 transition-all duration-1000 delay-500 transform ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <button 
            onClick={() => navigate('/selector')}
            className="bg-primary-green hover:bg-primary-green/90 text-white font-heading text-base font-bold py-3.5 px-8 rounded-full shadow-lg hover:shadow-primary-green/20 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Explore Now ➔
          </button>
        </div>

      </main>

      {/* Bottom Floating Scroll Hint */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-white/70 animate-bounce">
        <span className="text-[10px] uppercase font-bold tracking-widest">↓ Start Exploring</span>
      </div>

    </div>
  );
}
