import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hey explorer! 🌿 I\'m your MoodScape AI guide. How are you feeling today, and what kind of spot are you looking for?' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!inputMsg.trim()) {
      toast.error('Cannot send empty message. Please type your mood!', {
        id: 'bot-empty-error'
      });
      return;
    }

    const userMessage = inputMsg.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputMsg('');
    setIsTyping(true);

    const toastId = toast.loading('AI is formulating response...');

    // Simulate AI model latency
    setTimeout(() => {
      let botResponse = '';
      const query = userMessage.toLowerCase();

      if (query.includes('peaceful') || query.includes('quiet') || query.includes('calm')) {
        botResponse = 'For absolute peace, I recommend visiting the serene lakesides of Rabindra Sarobar in the early morning. It offers magical fog overlays! 🌅';
      } else if (query.includes('romantic') || query.includes('date') || query.includes('cozy')) {
        botResponse = 'Ah, a romantic escape! 💫 Try booking a window seat at The Corner Courtyard, or enjoy a cozy sunset walk along Princep Ghat.';
      } else if (query.includes('adventure') || query.includes('thrill') || query.includes('nature')) {
        botResponse = 'Adventure awaits! 🏕️ Grab a few friends and check out the walking trails inside the Acharya Jagadish Chandra Bose Indian Botanic Garden.';
      } else if (query.includes('stress') || query.includes('heal') || query.includes('meditate')) {
        botResponse = 'Take a deep breath. 🧘 The peaceful reading halls at National Library or a calm river breeze at Outram Ghat will work wonders for stress relief.';
      } else if (query.includes('error') || query.includes('fail')) {
        toast.error('AI Service Connection Timeout. Please try again.', { id: toastId });
        setIsTyping(false);
        return;
      } else {
        botResponse = 'That sounds wonderful! Based on your vibes, matching spots are highlighted in green on your map. Try checking the "Find Hidden Places" selector page! 🗺️';
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      setIsTyping(false);
      
      toast.success('MoodScape Bot replied! 🧠', {
        id: toastId,
        icon: '💬'
      });
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 select-none">
      
      {/* Chat Bubble Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary-green hover:bg-primary-green/95 text-white rounded-full flex items-center justify-center text-2xl shadow-lg border border-white/20 transition-transform active:scale-95 duration-300"
        title="MoodScape AI Chatbot"
      >
        💬
      </button>

      {/* Floating Chat Container */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-[320px] sm:w-[360px] h-[450px] bg-card rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden animate-fade-in-load">
          
          {/* Header */}
          <div className="bg-primary-green p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧠</span>
              <div>
                <h4 className="font-heading text-xs font-bold leading-none">MoodScape AI</h4>
                <span className="text-[9px] text-white/80 font-medium">Virtual vibe assistant</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-white/80 text-xl font-bold leading-none"
            >
              &times;
            </button>
          </div>

          {/* Messages Grid */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-page/50 no-scrollbar">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex flex-col max-w-[80%] ${
                  msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                <div 
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-primary-green text-white rounded-tr-none' 
                      : 'bg-card border border-border text-text-primary rounded-tl-none shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="self-start flex gap-1.5 p-3 bg-card border border-border rounded-2xl rounded-tl-none text-xs text-text-secondary shadow-xs">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            
            <div ref={endOfMessagesRef} />
          </div>

          {/* Input Form Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-card border-t border-border flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask for quiet, romantic or adventurous spots..."
              className="flex-1 px-3 py-2 border border-border rounded-lg text-xs bg-page focus:outline-none focus:border-primary-green"
            />
            <button
              type="submit"
              className="bg-primary-green hover:bg-primary-green/95 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
            >
              Send
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
