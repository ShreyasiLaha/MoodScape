import React, { useState, useEffect } from 'react';

export default function SettingsModal({ isOpen, onClose }) {
  const [contacts, setContacts] = useState([
    { name: '', phone: '' },
    { name: '', phone: '' },
    { name: '', phone: '' }
  ]);
  const [userName, setUserName] = useState(localStorage.getItem('sos_user_name') || 'Explorer');
  const [sosPin, setSosPin] = useState(localStorage.getItem('sos_pin') || '');

  // Load from localStorage on mount/open
  useEffect(() => {
    if (isOpen) {
      const savedContacts = localStorage.getItem('sos_contacts');
      if (savedContacts) {
        try {
          const parsed = JSON.parse(savedContacts);
          // Pad to 3 contacts
          const padded = [
            parsed[0] || { name: '', phone: '' },
            parsed[1] || { name: '', phone: '' },
            parsed[2] || { name: '', phone: '' }
          ];
          setContacts(padded);
        } catch (e) {
          console.error("Failed to parse sos_contacts", e);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleContactChange = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  const validatePhone = (phone) => {
    // Basic validation: must have at least 7 digits
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 7;
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Validate contacts (at least one contact must be completely filled or valid)
    const filledContacts = contacts.filter(c => c.name.trim() || c.phone.trim());
    
    for (let c of filledContacts) {
      if (!c.name.trim()) {
        alert("Please make sure all filled contacts have a name.");
        return;
      }
      if (!validatePhone(c.phone)) {
        alert(`Please enter a valid phone number for ${c.name}.`);
        return;
      }
    }

    localStorage.setItem('sos_contacts', JSON.stringify(filledContacts));
    localStorage.setItem('sos_user_name', userName.trim() || 'Explorer');
    localStorage.setItem('sos_pin', sosPin.trim());
    alert("Emergency contacts and safety preferences saved successfully!");
    onClose();
  };

  const handleSendTestAlert = () => {
    const filledContacts = contacts.filter(c => c.name.trim() && c.phone.trim());
    if (filledContacts.length === 0) {
      alert("Please fill out at least one contact with name and phone to send a test alert.");
      return;
    }
    
    // Grab mock location
    const testLocation = "https://maps.google.com/?q=40.7608,-111.8910";
    const testContact = filledContacts[0];
    
    const message = `ALERT PREVIEW to ${testContact.name} (${testContact.phone}):\n\n"${userName} may be in danger. Location: ${testLocation}"`;
    alert(message);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex justify-center items-center p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-lg overflow-hidden border border-border animate-fade-in-load">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h3 className="font-heading text-lg font-bold flex items-center gap-2">
            ⚙️ Safety Settings
          </h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-2xl font-bold leading-none">
            ×
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto max-h-[80vh] no-scrollbar">
          <p className="text-xs text-text-secondary leading-relaxed mb-4">
            Configure up to 3 emergency contacts that will be notified when the SOS system triggers.
          </p>

          <div className="mb-4">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Explorer Name"
              className="w-full p-2.5 border border-border rounded-lg text-sm bg-page focus:border-primary-green focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
              SOS Cancel PIN
            </label>
            <input
              type="password"
              value={sosPin}
              onChange={(e) => setSosPin(e.target.value)}
              placeholder="e.g. 1234"
              maxLength="4"
              pattern="\d*"
              className="w-full p-2.5 border border-border rounded-lg text-sm bg-page focus:border-primary-green focus:outline-none"
            />
            <p className="text-[9px] text-text-secondary mt-1">
              Required to cancel an active SOS countdown.
            </p>
          </div>

          <hr className="border-border my-4" />

          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-1.5">
            🚨 Emergency Contacts (Max 3)
          </h4>

          {contacts.map((contact, idx) => (
            <div key={idx} className="mb-4 bg-page p-3 rounded-lg border border-border/60">
              <h5 className="text-[11px] font-bold text-primary-green mb-2">
                Contact {idx + 1}
              </h5>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold uppercase text-text-secondary mb-1">Name</label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => handleContactChange(idx, 'name', e.target.value)}
                    placeholder="e.g. Dad"
                    className="w-full p-2 border border-border rounded-lg text-xs focus:border-primary-green focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-text-secondary mb-1">Phone</label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => handleContactChange(idx, 'phone', e.target.value)}
                    placeholder="e.g. (801) 555-0199"
                    className="w-full p-2 border border-border rounded-lg text-xs focus:border-primary-green focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              type="button"
              onClick={handleSendTestAlert}
              className="w-full border border-border hover:bg-page text-text-primary text-xs font-bold py-3 px-4 rounded-lg transition"
            >
              📨 Send Test Alert
            </button>
            <button
              type="submit"
              className="w-full bg-primary-green hover:bg-primary-green/90 text-white text-xs font-bold py-3 px-4 rounded-lg shadow-sm transition"
            >
              💾 Save Contacts
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
