import React, { useState, useEffect, useRef } from 'react';

export default function SOSModal({ isOpen, onClose }) {
  const [countdown, setCountdown] = useState(3);
  const [isSent, setIsSent] = useState(false);
  const [coords, setCoords] = useState({ lat: 22.5726, lng: 88.3639 }); // Default Kolkata
  const [contacts, setContacts] = useState([]);
  const [pinPrompt, setPinPrompt] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const timerRef = useRef(null);

  // Load contacts and handle countdown on open
  useEffect(() => {
    if (isOpen) {
      setIsSent(false);
      setCountdown(3);
      setPinPrompt(false);
      setInputPin('');
      
      // Load saved contacts
      const savedContacts = localStorage.getItem('sos_contacts');
      if (savedContacts) {
        try {
          setContacts(JSON.parse(savedContacts));
        } catch (e) {
          console.error("Failed parsing sos_contacts", e);
        }
      } else {
        // Fallback default contact if none set
        setContacts([{ name: 'Dad', phone: '8015550199' }]);
      }

      // Try capturing real GPS location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoords({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.warn("Location capture failed, using West Bengal center: ", error.message);
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      }

      // Start countdown
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            if (!pinPrompt) sendAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isOpen]);

  if (!isOpen) return null;

  const sendAlert = () => {
    clearInterval(timerRef.current);
    setIsSent(true);
  };

  const handleCancel = () => {
    const savedPin = localStorage.getItem('sos_pin');
    if (savedPin) {
      clearInterval(timerRef.current);
      setPinPrompt(true);
    } else {
      clearInterval(timerRef.current);
      onClose();
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const savedPin = localStorage.getItem('sos_pin');
    if (inputPin === savedPin) {
      onClose();
    } else {
      alert('Incorrect PIN!');
      // Resume countdown if they got it wrong? Or just leave it paused?
      // Let's just leave it paused and wait for correct PIN or let them send.
    }
  };

  const getSmsLink = (contact) => {
    const userName = localStorage.getItem('sos_user_name') || 'Explorer';
    const cleanPhone = contact.phone.replace(/\D/g, '');
    const message = `EMERGENCY: ${userName} may be in danger. Live location tracking: https://maps.google.com/?q=${coords.lat},${coords.lng}`;
    return `sms:${cleanPhone}?body=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[3000] flex justify-center items-center p-4">
      <div className="bg-card w-full max-w-sm rounded-2xl shadow-lg border border-border p-6 text-center animate-fade-in-load">
        
        {!isSent ? (
          <div>
            <div className="text-5xl mb-4 animate-bounce">🚨</div>
            <h2 className="font-heading text-xl font-bold text-sos-red mb-2">
              EMERGENCY ALERT ACTIVATED
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed mb-6">
              Are you in danger? Your location will be shared immediately with your emergency contacts.
            </p>

            {/* Progress/Countdown Bar */}
            <div className="w-full bg-page h-6 rounded-full overflow-hidden border border-border mb-6 flex items-center justify-center relative">
              <div 
                className="bg-sos-red h-full absolute left-0 top-0 transition-all duration-1000"
                style={{ width: `${(3 - countdown) * 33.3}%` }}
              ></div>
              <span className="text-[10px] font-bold text-text-primary z-10">
                Sending in {countdown} seconds...
              </span>
            </div>

            {pinPrompt ? (
              <div className="mt-4 animate-fade-in-load">
                <p className="text-xs font-bold text-sos-red mb-2">Enter PIN to Cancel SOS:</p>
                <form onSubmit={handlePinSubmit} className="flex flex-col gap-2">
                  <input
                    type="password"
                    value={inputPin}
                    onChange={(e) => setInputPin(e.target.value)}
                    placeholder="PIN"
                    maxLength="4"
                    className="p-3 border border-border rounded-lg text-center text-xl focus:outline-none focus:border-sos-red"
                    autoFocus
                  />
                  <button type="submit" className="w-full bg-page border border-border py-2 rounded-lg text-sm font-bold mt-2">
                    Submit PIN
                  </button>
                  <button type="button" onClick={sendAlert} className="w-full bg-sos-red text-white py-2 rounded-lg text-sm font-bold mt-2">
                    I need help (Send SOS)
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={sendAlert}
                  className="w-full bg-sos-red hover:bg-sos-red/90 text-white font-heading text-sm font-bold py-3 rounded-lg shadow-sm transition"
                >
                  🚨 Send Alert NOW
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full border border-border hover:bg-page text-text-primary font-heading text-sm font-bold py-3 rounded-lg transition"
                >
                  ❌ Cancel — I'm Safe
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="text-5xl mb-4">📢</div>
            <h2 className="font-heading text-xl font-bold text-primary-green mb-2">
              SOS DISPATCHED
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed mb-6">
              Your location coordinates (<strong>{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</strong>) have been packaged for emergency contacts.
            </p>

            {/* Contacts targets simulated list */}
            <div className="bg-page border border-border rounded-lg p-3 text-left mb-6 font-mono text-[11px] text-text-secondary">
              <div className="text-xs font-bold text-text-primary mb-1">Simulated SMS Dispatches:</div>
              {contacts.map((c, i) => (
                <div key={i} className="mb-2 last:mb-0 border-b last:border-b-0 border-border/40 pb-1 last:pb-0">
                  <span className="text-primary-green font-bold">➔ To {c.name} ({c.phone}):</span>
                  <p className="mt-0.5 text-[10px] italic">
                    "{localStorage.getItem('sos_user_name') || 'Explorer'} may be in danger. Location: https://maps.google.com/?q={coords.lat.toFixed(4)},{coords.lng.toFixed(4)}"
                  </p>
                  
                  {/* Real Clickable SMS Link trigger */}
                  <a
                    href={getSmsLink(c)}
                    className="inline-block mt-1 bg-sos-red/10 text-sos-red hover:bg-sos-red/20 font-bold px-2 py-0.5 rounded text-[9px] font-body"
                  >
                    💬 Tap to open native Messages & Send
                  </a>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full bg-primary-green hover:bg-primary-green/90 text-white font-heading text-sm font-bold py-3 rounded-lg transition"
            >
              Close Overlay & Return
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
