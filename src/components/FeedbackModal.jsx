import React, { useState } from 'react';

export default function FeedbackModal({ isOpen, onClose }) {
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setFeedbackText('');
        onClose();
      }, 2000);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-modal-slide">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Give Feedback</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl font-light leading-none">
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">💚</div>
              <h3 className="text-lg font-bold text-gray-800">Thank You!</h3>
              <p className="text-sm text-gray-500">Your feedback helps us improve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rate your experience</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-transform ${star <= rating ? 'text-yellow-400 scale-110' : 'text-gray-200'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Any comments or suggestions?</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-shadow min-h-[100px]"
                  placeholder="Tell us what you think..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={rating === 0 || !feedbackText.trim()}
                className="w-full mt-2 bg-primary-green text-white font-semibold py-3 rounded-xl disabled:opacity-50 transition-opacity"
              >
                Submit Feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
