import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../logo_icon.png';

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

      {/* Cinematic atmospheric fog & gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/35 z-10"></div>
      
      {/* Soft light leak/fog glow overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.22] mix-blend-screen"
        style={{
          background: "radial-gradient(circle at 50% 60%, rgba(82, 183, 136, 0.15), transparent 75%)"
        }}
      ></div>

      {/* Transparent Navbar */}
      <header className="absolute top-0 left-0 w-full h-16 px-6 flex justify-between items-center z-30 bg-transparent">
        <div className="flex items-center gap-3">
          <img src={logoIcon} alt="MoodScape Logo" className="h-[32px] w-[32px] object-contain" />
          <span 
            className="text-[1.05rem] font-bold text-white tracking-wide" 
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            MoodScape
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
      <main className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 px-4 pb-[8vh]">
        
        <div className={`transition-all duration-[1200ms] ease-out transform ${animate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.98]'}`}>
          <span className="text-5xl block mb-6">🌿</span>
          <h1 
            className="font-medium text-white/90"
            style={{ 
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 4.5vw, 4.5rem)",
              textShadow: "0 2px 12px rgba(0,0,0,0.18)",
              letterSpacing: "0.06em",
              lineHeight: "1.2"
            }}
          >
            MoodScape
          </h1>
        </div>

        <div className={`mt-8 transition-all duration-[1200ms] delay-200 ease-out transform ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-base sm:text-lg text-white/90 font-light leading-relaxed max-w-sm drop-shadow-sm">
            Discover secret places. Feel the city differently.
          </p>
        </div>

        <div className={`mt-12 transition-all duration-[1200ms] delay-400 ease-out transform ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <button 
            onClick={() => navigate('/selector')}
            className="bg-primary-green hover:bg-primary-green/95 text-white font-heading text-base font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-[0_0_18px_rgba(45,106,79,0.3)] hover:scale-[1.03] active:scale-95 transition-all duration-500 ease-out"
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
