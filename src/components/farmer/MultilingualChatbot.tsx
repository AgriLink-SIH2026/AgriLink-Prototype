import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Globe,
  Bot,
  User,
  HelpCircle,
  Clock,
  Truck,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const MultilingualChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Marathi' | 'Kannada'>('English');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Namaste! I am AgriLink AI assistant. How can I assist you today with slot booking, gate passes, or factory procurement?',
      time: 'Just now',
    },
  ]);

  const quickPrompts = [
    { en: 'How do I update my vehicle number?', hi: 'गाड़ी नंबर कैसे अपडेट करें?', mr: 'वाहन क्रमांक कसा अपडेट करावा?' },
    { en: 'When do slot bookings open?', hi: 'स्लॉट बुकिंग कब शुरू होती है?', mr: 'स्लॉट बुकिंग कधी सुरू होते?' },
    { en: 'Current Sugarcane mill prices', hi: 'गन्ने का ताजा मिल भाव', mr: 'उसाचे चालू कारखान्याचे दर' },
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Simulated Multilingual AI answers tailored to AgriLink rules
    setTimeout(() => {
      let reply = "I can help with that! In AgriLink, slot bookings open strictly 7 days (1 week) prior to your harvest date for a 24-hour intake window. You can update your vehicle plate on your active dashboard card up until 6 hours before slot commencement.";

      const lower = text.toLowerCase();
      if (lower.includes('vehicle') || lower.includes('गाड़ी') || lower.includes('वाहन')) {
        reply = language === 'Hindi'
          ? "आप अपने किसान डैशबोर्ड पर 'Update Vehicle' बटन दबाकर स्लॉट शुरू होने के 6 घंटे पहले तक गाड़ी नंबर दर्ज या बदल सकते हैं।"
          : language === 'Marathi'
          ? "तुम्ही तुमच्या शेतकरी डॅशबोर्डवरील 'Update Vehicle' बटणावर क्लिक करून स्लॉट सुरू होण्याच्या ६ तास आधीपर्यंत वाहन क्रमांक अपडेट करू शकता."
          : "Under the flexible vehicle policy, you can submit or update your vehicle number up until 6 hours before slot start (T - 6h). After that, gate verification locks.";
      } else if (lower.includes('when') || lower.includes('booking') || lower.includes('कब') || lower.includes('कधी')) {
        reply = language === 'Hindi'
          ? "स्लॉट बुकिंग आपके चुने हुए कटाई (Harvest) दिन से ठीक 1 हफ्ता (7 दिन) पहले खुलती है। यह 24 घंटे की विंडो होती है।"
          : language === 'Marathi'
          ? "स्लॉट बुकिंग तुमच्या निवडलेल्या कापणीच्या तारखेच्या बरोबर १ आठवडा (७ दिवस) आधी उघडते. हा २४ तासांचा विंडो असतो."
          : "Advance Window Lock: Slot booking opens strictly 1 week (7 days) before your planned harvest date.";
      } else if (lower.includes('price') || lower.includes('rate') || lower.includes('भाव') || lower.includes('दर')) {
        reply = language === 'Hindi'
          ? "सह्याद्री सहकारी साखर कारखाना: ₹355/क्विंटल। पंचगंगा: ₹362/क्विंटल। आप सीधे डैशबोर्ड पर लाइव दरें देखकर स्लॉट बुक कर सकते हैं।"
          : "Sahyadri Sugar Mill is offering ₹355/Qtl (₹3.55/kg) and Panchaganga Crushing is at ₹362/Qtl. View the Price Comparison Dashboard above to book immediately.";
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Button (FAB) at bottom-right */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-3 bg-[#173522] hover:bg-[#244532] text-white rounded-full shadow-lg border border-[#244532] transition hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Open Multilingual AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-[#D97824]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="font-serif font-bold text-xs pr-1">AgriAI Assist</span>
        </button>
      </div>

      {/* Slide-over / Bottom Drawer Container */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#132619]/40 backdrop-blur-2xs animate-in fade-in">
          <div className="w-full sm:w-96 bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#DFD7C4] animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 bg-[#173522] text-[#EBE5D6] border-b border-[#244532] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#D97824] flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-white">AgriLink Multilingual AI</h3>
                  <p className="text-[10px] text-[#EBE5D6]/70">24/7 Farmer Procurement Advisory</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Language Switcher */}
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="px-2 py-1 rounded-lg bg-[#244532] text-[11px] font-bold text-white border border-[#173522] focus:outline-hidden"
                >
                  <option value="English">EN (English)</option>
                  <option value="Hindi">HI (हिंदी)</option>
                  <option value="Marathi">MR (मराठी)</option>
                  <option value="Kannada">KN (ಕನ್ನಡ)</option>
                </select>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-[#EBE5D6]/80 hover:text-white hover:bg-[#244532] transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-[#FAF7F0] text-xs font-sans">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-[#173522] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-[#D97824]" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#173522] text-[#EBE5D6] rounded-tr-xs'
                        : 'bg-white border border-[#DFD7C4] text-[#171713] rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[9px] opacity-60 block text-right mt-1">{msg.time}</span>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-[#D97824] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {/* Quick Prompts */}
              <div className="pt-2 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#777268] block">
                  Quick Inquiries:
                </span>
                {quickPrompts.map((q, idx) => {
                  const promptText = language === 'Hindi' ? q.hi : language === 'Marathi' ? q.mr : q.en;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(promptText)}
                      className="block w-full text-left p-2 rounded-xl bg-white hover:bg-[#EBE5D6] border border-[#DFD7C4] text-[11px] font-semibold text-[#173522] transition cursor-pointer"
                    >
                      &bull; {promptText}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-[#DFD7C4]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    language === 'Hindi'
                      ? 'अपना सवाल यहाँ लिखें...'
                      : language === 'Marathi'
                      ? 'येथे प्रश्न विचारा...'
                      : 'Ask about slots, prices, passes...'
                  }
                  className="flex-1 px-3 py-2 rounded-xl border border-[#DFD7C4] text-xs font-sans focus:outline-hidden focus:ring-2 focus:ring-[#173522] bg-[#FAF7F0]"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-[#173522] hover:bg-[#244532] text-white rounded-xl transition cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5 text-[#D97824]" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
