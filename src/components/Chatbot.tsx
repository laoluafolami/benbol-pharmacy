import { MessageCircle, X, Send, ExternalLink } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ChatMessage } from '../types';

interface ChatbotProps {
  onNavigate?: (page: string) => void;
}

interface BotResponse {
  text: string;
  links?: Array<{ label: string; page: string; icon?: string }>;
  suggestions?: string[];
}

export default function Chatbot({ onNavigate }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      message:
        "Hello! 👋 I'm the Benbol Pharmacy assistant. I'm here to help you with information about our services, medications, consultations, and more. What can I help you with today?",
      sender: 'bot',
      session_id: '',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // User info states
  const [showUserForm, setShowUserForm] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [confirmStep, setConfirmStep] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): BotResponse => {
    const lowerMessage = userMessage.toLowerCase();

    // Hours & Location
    if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('time') || lowerMessage.includes('when')) {
      return { 
        text: '⏰ We are open Monday-Saturday from 8:00 AM to 8:00 PM. We are closed on Sundays. For urgent matters outside these hours, please call us at 09167858034.',
        suggestions: ['What are your services?', 'How do I book an appointment?', 'Where are you located?']
      };
    }

    if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where') || lowerMessage.includes('find')) {
      return { 
        text: "📍 You can find us at Benbol Pharmacy, Vickie's Plaza, Lekki-Epe Expressway, Sun View 2nd gate Bus stop, Opposite Peace Garden & Crown Estates, Sangotedo, Lagos. Call us at 09167858034 for directions or visit our About page for more details.",
        links: [{ label: 'Learn More About Us', page: 'about' }],
        suggestions: ['How do I get there?', 'What services do you offer?', 'Can you deliver?']
      };
    }

    if (lowerMessage.includes('phone') || lowerMessage.includes('call') || lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
      return { 
        text: '📞 You can reach us at 09167858034 during business hours (Monday-Saturday, 8:00 AM - 8:00 PM). We are always happy to help! You can also use our contact form for inquiries.',
        links: [{ label: 'Contact Us', page: 'contact' }],
        suggestions: ['What services do you offer?', 'How do I book an appointment?', 'Do you deliver?']
      };
    }

    // Services
    if (lowerMessage.includes('service') || lowerMessage.includes('what do you offer') || lowerMessage.includes('what can you')) {
      return { 
        text: '💊 We offer a comprehensive range of pharmacy services:\n\n✓ Prescription Medications\n✓ Over-the-Counter (OTC) Products\n✓ Vitamins & Supplements\n✓ Walking Aids & Mobility Equipment\n✓ Pharmaceutical Counselling\n✓ Skin Care Products\n✓ Home Delivery Services\n\nClick below to explore our services in detail!',
        links: [{ label: 'View All Services', page: 'services' }],
        suggestions: ['Tell me about prescription refills', 'Do you have vitamins?', 'What about skincare?', 'Can you help with consultations?']
      };
    }

    // Prescription Refills
    if (lowerMessage.includes('prescription') || lowerMessage.includes('refill') || lowerMessage.includes('medication') || lowerMessage.includes('drug')) {
      return { 
        text: '💉 We make prescription refills easy! Here\'s how:\n\n1️⃣ Submit a refill request online through our website\n2️⃣ Call us at 09167858034\n3️⃣ Visit us in person\n\nMost prescriptions are ready within 15-30 minutes. We accept most major insurance plans. Need to submit a refill request now?',
        links: [{ label: 'Submit Refill Request', page: 'refill' }],
        suggestions: ['Do you accept insurance?', 'How long does it take?', 'Can you deliver?']
      };
    }

    // Insurance
    if (lowerMessage.includes('insurance') || lowerMessage.includes('coverage') || lowerMessage.includes('claim')) {
      return { 
        text: '🛡️ Yes, we accept most major insurance plans! Here\'s what you need to know:\n\n✓ Bring your insurance card with you\n✓ We will verify your coverage\n✓ We process your claims directly\n✓ Ask our staff about your specific plan\n\nFor questions about your coverage, call us at 09167858034.',
        suggestions: ['How do I submit a prescription?', 'Do you offer home delivery?', 'Can I book a consultation?']
      };
    }

    // Delivery
    if (lowerMessage.includes('delivery') || lowerMessage.includes('home delivery') || lowerMessage.includes('ship') || lowerMessage.includes('send')) {
      return { 
        text: '🚚 Yes, we offer home delivery services within our service area! Here\'s how it works:\n\n✓ Fast and reliable delivery\n✓ Available for medications and health products\n✓ Professional handling and packaging\n✓ Discreet delivery\n\nTo arrange delivery, please call us at 09167858034 or submit your order through our website.',
        links: [{ label: 'Submit Refill Request', page: 'refill' }],
        suggestions: ['How long does delivery take?', 'What areas do you deliver to?', 'Can I track my order?']
      };
    }

    // Appointments & Consultations
    if (lowerMessage.includes('appointment') || lowerMessage.includes('consultation') || lowerMessage.includes('counselling') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
      return { 
        text: '📅 We offer professional pharmaceutical consultations and health services! You can:\n\n✓ Book a consultation with our experienced pharmacists\n✓ Get medication reviews and advice\n✓ Receive health consultations\n✓ Get personalized recommendations\n\nBook your appointment online or call 09167858034. Our team is ready to help!',
        links: [{ label: 'Book Appointment', page: 'appointment' }],
        suggestions: ['What services do you offer?', 'How long does a consultation take?', 'What should I bring?']
      };
    }

    // What to bring to appointment
    if (lowerMessage.includes('bring') || lowerMessage.includes('what to bring') || lowerMessage.includes('what should i bring') || lowerMessage.includes('prepare') || lowerMessage.includes('preparation')) {
      return { 
        text: '🎒 Here\'s what to bring to your appointment at Benbol Pharmacy:\n\n📋 Essential Documents:\n✓ Valid ID or passport\n✓ Insurance card (if you have insurance)\n✓ Current medication list (if available)\n✓ Any recent medical records\n\n💊 Medical Information:\n✓ List of allergies\n✓ Current health conditions\n✓ Any questions or concerns\n\n💳 Payment:\n✓ Payment method (cash, card, or insurance)\n\n⏰ Timing:\n✓ Arrive 10-15 minutes early\n✓ We\'re open Monday-Saturday, 8:00 AM - 8:00 PM\n\nIf you have specific questions, call us at 09167858034!',
        links: [{ label: 'Book Appointment', page: 'appointment' }],
        suggestions: ['How do I book an appointment?', 'What services do you offer?', 'Do you accept insurance?']
      };
    }

    // Vitamins & Supplements
    if (lowerMessage.includes('vitamin') || lowerMessage.includes('supplement') || lowerMessage.includes('multivitamin') || lowerMessage.includes('herbal')) {
      return { 
        text: '🌿 We carry a wide range of vitamins and supplements including:\n\n✓ Multivitamins for all ages\n✓ Specialty supplements (Omega-3, Vitamin D, etc.)\n✓ Herbal remedies and natural products\n✓ Sports nutrition and performance supplements\n✓ Immune support products\n\nOur pharmacists can help you choose the right supplements for your specific needs. Visit us or call 09167858034 for personalized recommendations!',
        links: [{ label: 'View Services', page: 'services' }],
        suggestions: ['Do you have immune support products?', 'Can you recommend supplements for me?', 'What about sports nutrition?']
      };
    }

    // Skincare
    if (lowerMessage.includes('skincare') || lowerMessage.includes('skin care') || lowerMessage.includes('skin') || lowerMessage.includes('acne') || lowerMessage.includes('moisturizer')) {
      return { 
        text: '✨ We offer medical-grade skincare products including:\n\n✓ Anti-aging solutions\n✓ Acne treatments and prevention\n✓ Moisturizers and hydration products\n✓ Sun protection (SPF products)\n✓ Specialized treatments\n\nOur staff can provide personalized skincare recommendations based on your skin type and concerns. Visit us or call 09167858034 for a consultation!',
        links: [{ label: 'View Services', page: 'services' }],
        suggestions: ['Do you have acne treatments?', 'Can you recommend a moisturizer?', 'What about sun protection?']
      };
    }

    // Walking Aids & Mobility
    if (lowerMessage.includes('walking aid') || lowerMessage.includes('mobility') || lowerMessage.includes('wheelchair') || lowerMessage.includes('crutch') || lowerMessage.includes('walker') || lowerMessage.includes('cane')) {
      return { 
        text: '🚶 We stock a variety of mobility aids and equipment:\n\n✓ Canes and walking sticks\n✓ Crutches (axillary and forearm)\n✓ Walkers and rollators\n✓ Wheelchairs (manual and specialized)\n✓ Other mobility equipment\n\nWe provide professional fitting and consultation to ensure you get the right equipment for your needs. Visit us or call 09167858034 for assistance!',
        links: [{ label: 'View Services', page: 'services' }],
        suggestions: ['Do you offer fitting services?', 'What types of wheelchairs do you have?', 'Can you deliver mobility aids?']
      };
    }

    // OTC Products
    if (lowerMessage.includes('otc') || lowerMessage.includes('over the counter') || lowerMessage.includes('pain relief') || lowerMessage.includes('cold') || lowerMessage.includes('flu')) {
      return { 
        text: '💊 We have a full range of over-the-counter (OTC) products:\n\n✓ Pain relievers and fever reducers\n✓ Cold and flu medications\n✓ Allergy relief products\n✓ Digestive aids\n✓ First aid supplies\n✓ And much more!\n\nOur pharmacists can recommend the best OTC product for your symptoms. Visit us or call 09167858034!',
        links: [{ label: 'View Services', page: 'services' }],
        suggestions: ['What do you recommend for a cold?', 'Do you have allergy medication?', 'Can I get pain relief?']
      };
    }

    // Immunization Services
    if (lowerMessage.includes('immunization') || lowerMessage.includes('vaccine') || lowerMessage.includes('vaccination') || lowerMessage.includes('shot')) {
      return { 
        text: '💉 We offer professional immunization services! We provide:\n\n✓ Routine vaccinations\n✓ Travel vaccinations\n✓ Seasonal flu shots\n✓ Professional administration\n✓ Vaccination records\n\nOur trained pharmacists administer vaccines safely and professionally. Call us at 09167858034 to schedule your vaccination appointment!',
        links: [{ label: 'Book Appointment', page: 'appointment' }],
        suggestions: ['What vaccines do you offer?', 'Do I need a travel vaccine?', 'How much does it cost?']
      };
    }

    // FAQ & Help
    if (lowerMessage.includes('faq') || lowerMessage.includes('question') || lowerMessage.includes('help') || lowerMessage.includes('how do i')) {
      return { 
        text: '❓ Have questions? We have answers! Check out our FAQ section for common questions about our services, prescriptions, consultations, and more.',
        links: [{ label: 'View FAQ', page: 'faq' }],
        suggestions: ['What are your hours?', 'How do I book an appointment?', 'Do you deliver?']
      };
    }

    // Blog & Information
    if (lowerMessage.includes('blog') || lowerMessage.includes('article') || lowerMessage.includes('information') || lowerMessage.includes('learn') || lowerMessage.includes('health')) {
      return { 
        text: '📚 Check out our blog for helpful health tips, medication information, wellness advice, and more! Our pharmacists share valuable insights to help you make informed health decisions.',
        links: [{ label: 'Read Our Blog', page: 'blog' }],
        suggestions: ['What are your services?', 'How do I book an appointment?', 'Do you have vitamins?']
      };
    }

    // Policies
    if (lowerMessage.includes('privacy') || lowerMessage.includes('policy') || lowerMessage.includes('terms') || lowerMessage.includes('cookie')) {
      return { 
        text: '📋 We take your privacy and security seriously. Here are our policies:\n\n✓ Privacy Policy - How we protect your information\n✓ Terms of Use - Our terms and conditions\n✓ Cookie Policy - How we use cookies\n\nFeel free to review any of these policies.',
        links: [
          { label: 'Privacy Policy', page: 'privacy' },
          { label: 'Terms of Use', page: 'terms' },
          { label: 'Cookie Policy', page: 'cookies' }
        ]
      };
    }

    // Gratitude
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('appreciate')) {
      return { 
        text: "You're welcome! 😊 Is there anything else I can help you with today? Feel free to ask about our services, book an appointment, or get more information.",
        suggestions: ['What are your services?', 'How do I book an appointment?', 'Where are you located?']
      };
    }

    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('good morning') || lowerMessage.includes('good afternoon') || lowerMessage.includes('good evening')) {
      return { 
        text: 'Hello! 👋 Welcome to Benbol Pharmacy! How can I assist you today? You can ask about our services, book an appointment, submit a prescription refill, or anything else!',
        suggestions: ['What are your services?', 'How do I book an appointment?', 'Can I submit a prescription refill?']
      };
    }

    // Goodbye
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('see you') || lowerMessage.includes('farewell')) {
      return { 
        text: 'Thank you for contacting Benbol Pharmacy! 👋 We look forward to serving you. Have a great day!',
        suggestions: ['What are your services?', 'How do I book an appointment?', 'Where are you located?']
      };
    }

    // Default response with suggestions
    return { 
      text: "I'm here to help! 😊 You can ask me about:\n\n✓ Our services and products\n✓ Operating hours and location\n✓ Prescription refills\n✓ Booking appointments\n✓ Vitamins and supplements\n✓ Skincare products\n✓ Mobility aids\n✓ Insurance and delivery\n\nOr feel free to ask any other questions!",
      links: [{ label: 'View All Services', page: 'services' }],
      suggestions: ['What are your services?', 'How do I book an appointment?', 'Can I submit a prescription refill?']
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      message: inputMessage,
      sender: 'user',
      session_id: sessionId,
      user_name: userName,
      user_email: userEmail,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    try {
      await supabase.from('chat_messages').insert([userMessage]);
    } catch (error) {
      console.error('Error saving user message:', error);
    }

    setTimeout(async () => {
      const response = getBotResponse(inputMessage);
      const botResponse: ChatMessage = {
        message: response.text,
        sender: 'bot',
        session_id: sessionId,
        user_name: userName,
        user_email: userEmail,
      };

      setMessages((prev) => [...prev, botResponse]);

      try {
        await supabase.from('chat_messages').insert([botResponse]);
      } catch (error) {
        console.error('Error saving bot message:', error);
      }

      // Add link messages if available
      if (response.links && response.links.length > 0) {
        setTimeout(() => {
          response.links?.forEach((link, index) => {
            setTimeout(() => {
              const linkMessage: ChatMessage = {
                message: `link:${link.page}:${link.label}`,
                sender: 'bot',
                session_id: sessionId,
                user_name: userName,
                user_email: userEmail,
              };
              setMessages((prev) => [...prev, linkMessage]);
            }, index * 300);
          });
        }, 300);
      }

      // Add suggestion message if available
      if (response.suggestions && response.suggestions.length > 0) {
        setTimeout(() => {
          const suggestionMessage: ChatMessage = {
            message: `suggestions:${response.suggestions?.join('|')}`,
            sender: 'bot',
            session_id: sessionId,
            user_name: userName,
            user_email: userEmail,
          };
          setMessages((prev) => [...prev, suggestionMessage]);
        }, (response.links?.length || 0) * 300 + 300);
      }
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() && userEmail.trim()) {
      setConfirmStep(true);
    }
  };

  const handleConfirmUserInfo = async () => {
    setShowUserForm(false);
    setConfirmStep(false);
    
    // Save user info to first message
    const userInfoMessage: ChatMessage = {
      message: `Chat started - User confirmed their information`,
      sender: 'user',
      session_id: sessionId,
      user_name: userName,
      user_email: userEmail,
    };
    
    try {
      await supabase.from('chat_messages').insert([userInfoMessage]);
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  };

  const handleEditUserInfo = () => {
    setConfirmStep(false);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-teal-600 text-white p-4 rounded-full shadow-2xl hover:bg-teal-700 transition-all hover:scale-110 z-50"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-gray-200">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-full">
                <MessageCircle className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold">Benbol Pharmacy</h3>
                <p className="text-xs text-teal-100">Here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {showUserForm ? (
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col justify-center">
              {!confirmStep ? (
                <form onSubmit={handleUserInfoSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Email</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                  >
                    Continue
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Please confirm your information:</p>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-900">Name: <span className="font-normal">{userName}</span></p>
                      <p className="text-sm font-semibold text-gray-900">Email: <span className="font-normal">{userEmail}</span></p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleConfirmUserInfo}
                      className="flex-1 bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={handleEditUserInfo}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-96 bg-gray-50">
              {messages.map((msg, index) => {
                // Handle link messages
                if (msg.message.startsWith('link:')) {
                  const [, page, label] = msg.message.split(':');
                  return (
                    <div key={index} className="flex justify-start">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          onNavigate?.(page);
                        }}
                        className="max-w-[80%] bg-teal-600 text-white rounded-2xl px-4 py-3 rounded-bl-none hover:bg-teal-700 transition-colors font-semibold flex items-center space-x-2 group"
                      >
                        <span className="text-sm leading-relaxed">{label}</span>
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  );
                }

                // Handle suggestion messages
                if (msg.message.startsWith('suggestions:')) {
                  const suggestions = msg.message.replace('suggestions:', '').split('|');
                  return (
                    <div key={index} className="flex justify-start">
                      <div className="max-w-[80%] bg-white text-gray-800 border border-gray-200 rounded-2xl px-4 py-3 rounded-bl-none">
                        <p className="text-xs font-semibold text-gray-600 mb-2">💡 Quick suggestions:</p>
                        <div className="space-y-2">
                          {suggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setInputMessage(suggestion);
                                setTimeout(() => {
                                  const event = new KeyboardEvent('keypress', { key: 'Enter' });
                                  document.querySelector('input[placeholder="Type your message..."]')?.dispatchEvent(event);
                                }, 100);
                              }}
                              className="block w-full text-left text-sm px-3 py-2 rounded-lg bg-gray-50 hover:bg-teal-50 text-gray-700 hover:text-teal-700 transition-colors border border-gray-200 hover:border-teal-300"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Regular messages
                return (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.sender === 'user'
                          ? 'bg-teal-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}

          {!showUserForm && (
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
