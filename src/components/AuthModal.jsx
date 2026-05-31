import React, { useState } from 'react';
import { toast } from 'sonner';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Custom client-side validation toast
    if (!email.includes('@')) {
      toast.error('Invalid email address. Please enter a valid email.', {
        id: 'auth-error',
      });
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.', {
        id: 'auth-error',
      });
      return;
    }

    const toastId = toast.loading(isLogin ? 'Authenticating...' : 'Creating account...');

    // Simulate API authorization request
    setTimeout(() => {
      if (email === 'fail@moodscape.com') {
        toast.error('Authentication failed: Invalid credentials.', {
          id: toastId,
        });
      } else {
        const displayName = name.trim() || email.split('@')[0];
        toast.success(
          isLogin 
            ? `Welcome back, ${displayName}! 👋` 
            : `Welcome aboard, ${displayName}! 🚀`, 
          {
            id: toastId,
            icon: '🔑',
          }
        );
        
        // Save auth state
        localStorage.setItem('auth_user', JSON.stringify({ email, name: displayName }));
        if (onAuthSuccess) {
          onAuthSuccess({ email, name: displayName });
        }
        onClose();
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2500] flex justify-center items-center p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-lg border border-border overflow-hidden animate-fade-in-load">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h3 className="font-heading text-lg font-bold flex items-center gap-2 text-primary-green">
            {isLogin ? '🔐 Login to MoodScape' : '✨ Join MoodScape'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-text-secondary hover:text-text-primary text-2xl font-bold leading-none"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <p className="text-xs text-text-secondary leading-relaxed">
            {isLogin 
              ? 'Enter your credentials to access your saved spots, custom chatbot recommendations, and sync profiles.'
              : 'Create a free account to unlock personal guides, early alerts, and unlimited mood-based planning.'}
          </p>

          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Explorer Name"
                className="w-full p-2.5 border border-border rounded-lg text-sm bg-page focus:border-primary-green focus:outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="explorer@moodscape.com"
              className="w-full p-2.5 border border-border rounded-lg text-sm bg-page focus:border-primary-green focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-text-secondary mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 border border-border rounded-lg text-sm bg-page focus:border-primary-green focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-green hover:bg-primary-green/90 text-white text-xs font-bold py-3 rounded-lg shadow-sm transition mt-2"
          >
            {isLogin ? '🔐 Let\'s Go' : '🚀 Create Account'}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-primary-green hover:underline font-semibold"
            >
              {isLogin ? 'New to MoodScape? Sign up' : 'Already have an account? Login'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
