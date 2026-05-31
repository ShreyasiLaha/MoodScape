import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SelectorPage from './pages/SelectorPage';
import ResultsPage from './pages/ResultsPage';
import SettingsModal from './components/SettingsModal';
import SOSModal from './components/SOSModal';
import FeedbackModal from './components/FeedbackModal';
import AuthModal from './components/AuthModal';
import AIChatbot from './components/AIChatbot';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('explorer_favorites') || '[]')
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('auth_user') || 'null')
  );
  const [userLocation, setUserLocation] = useState(null); // null means not set, will prompt

  // Sync favorites count with modern toasts
  const handleToggleFavorite = (placeId, placeName) => {
    let updated;
    const isAdding = !favorites.includes(placeId);
    if (favorites.includes(placeId)) {
      updated = favorites.filter(id => id !== placeId);
      toast.info(`Removed "${placeName || 'spot'}" from favorites`, {
        id: `fav-${placeId}`,
      });
    } else {
      updated = [...favorites, placeId];
      toast.success(`Added "${placeName || 'spot'}" to favorites!`, {
        id: `fav-${placeId}`,
        icon: '❤️',
      });
    }
    setFavorites(updated);
    localStorage.setItem('explorer_favorites', JSON.stringify(updated));
  };

  return (
    <Router>
      <div className="w-full h-full relative font-body select-none">
        
        {/* Global Toaster for clean Sonner notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#ffffff',
              color: '#111111',
              border: '1px solid #e0e0e0',
              fontFamily: "'Inter', sans-serif",
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            },
          }}
        />

        {/* Main Routes */}
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage 
                onOpenSettings={() => setIsSettingsOpen(true)} 
                onOpenSOS={() => setIsSOSOpen(true)}
                onOpenFeedback={() => setIsFeedbackOpen(true)}
                favoritesCount={favorites.length}
                onOpenAuth={() => setIsAuthOpen(true)}
                user={user}
              />
            } 
          />
          <Route 
            path="/selector" 
            element={
              <SelectorPage
                selectedMood={selectedMood}
                setSelectedMood={setSelectedMood}
                selectedCompanion={selectedCompanion}
                setSelectedCompanion={setSelectedCompanion}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                onOpenSOS={() => setIsSOSOpen(true)}
                userLocation={userLocation}
                setUserLocation={setUserLocation}
              />
            } 
          />
          <Route 
            path="/results" 
            element={
              <ResultsPage
                selectedMood={selectedMood}
                selectedCompanion={selectedCompanion}
                selectedTime={selectedTime}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onOpenSOS={() => setIsSOSOpen(true)}
                userLocation={userLocation}
                onOpenAuth={() => setIsAuthOpen(true)}
                user={user}
              />
            } 
          />
        </Routes>

        {/* Global Permanent SOS button (Always visible on all screens, bottom right) */}
        <button
          onClick={() => setIsSOSOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-sos-red hover:bg-sos-red/90 text-white rounded-full flex items-center justify-center text-2xl shadow-lg border border-sos-border z-40 transition-transform active:scale-95 animate-sos-pulse"
          title="SOS Trigger Alert"
        >
          🚨
        </button>

        {/* Global chatbot float in the bottom left */}
        <AIChatbot />

        {/* Modals overlays */}
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
        
        <SOSModal 
          isOpen={isSOSOpen} 
          onClose={() => setIsSOSOpen(false)} 
        />

        <FeedbackModal 
          isOpen={isFeedbackOpen} 
          onClose={() => setIsFeedbackOpen(false)} 
        />

        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          onAuthSuccess={setUser}
        />

      </div>
    </Router>
  );
}
