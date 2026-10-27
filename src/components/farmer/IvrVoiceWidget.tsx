import React, { useState } from 'react';
import {
  PhoneCall,
  Phone,
  Volume2,
  CheckCircle2,
  Globe,
  Radio,
  X,
  Play,
  Square,
  ShieldCheck,
} from 'lucide-react';

export const IvrVoiceWidget: React.FC = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const tollFreeNumber = '1800-266-AGRI (1800-266-2474)';

  const ivrMenuOptions = [
    { key: '1', label: '24-Hour Slot Status & Confirmation', hi: 'स्लॉट स्थिति और पुष्टि के लिए 1 दबाएं' },
    { key: '2', label: 'Update Vehicle Number via Keypad', hi: 'गाड़ी नंबर दर्ज या बदलने के लिए 2 दबाएं' },
    { key: '3', label: 'Today’s Crop Buying Rates across Mills', hi: 'आज के मिल भाव और मंडी दरों के लिए 3 दबाएं' },
    { key: '4', label: 'Resend Gate Pass SMS & Pass ID', hi: 'गेट पास विवरण एसएमएस पर पाने के लिए 4 दबाएं' },
  ];

  return (
    <>
      {/* Informational Card for Dashboard */}
      <div className="bg-[#FAF7F0] p-5 sm:p-6 rounded-3xl border border-[#DFD7C4] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#173522] text-[#EBE5D6] flex items-center justify-center shadow-xs">
              <PhoneCall className="w-4 h-4 text-[#D97824]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#777268] block">
                FEATURE PHONE &amp; OFFLINE ACCESSIBILITY
              </span>
              <h4 className="font-serif text-base font-bold text-[#171713]">
                IVR Voice Access Service
              </h4>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            Toll-Free • 24x7
          </span>
        </div>

        <p className="text-xs text-[#777268] leading-relaxed">
          No smartphone or internet required. Book slots, update vehicle numbers, and check live buying rates by dialing our multilingual automated voice assistant.
        </p>

        <div className="p-3.5 bg-white rounded-2xl border border-[#DFD7C4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#777268] block">
              Toll-Free Hotline
            </span>
            <span className="font-mono text-sm sm:text-base font-extrabold text-[#173522]">
              {tollFreeNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:18002662474"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#173522] hover:bg-[#244532] text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#D97824]" />
              <span>Call Now</span>
            </a>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="px-3.5 py-2 bg-[#FAF7F0] hover:bg-[#EBE5D6] text-[#173522] rounded-xl text-xs font-bold border border-[#DFD7C4] transition cursor-pointer"
            >
              Simulate IVR Flow
            </button>
          </div>
        </div>
      </div>

      {/* Interactive IVR Simulator Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#132619]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#DFD7C4] animate-in fade-in zoom-in duration-150">
            <div className="bg-[#173522] text-[#EBE5D6] p-5 flex items-center justify-between border-b border-[#244532]">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#D97824] animate-pulse" />
                <h3 className="font-serif text-base font-bold text-white">
                  Live IVR Audio Simulator
                </h3>
              </div>
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="p-1.5 rounded-xl text-[#EBE5D6]/80 hover:text-white hover:bg-[#244532] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 font-sans text-xs text-[#171713] bg-[#FAF7F0]">
              <div className="p-4 bg-white rounded-2xl border border-[#DFD7C4] space-y-2 text-center">
                <span className="w-12 h-12 rounded-full bg-[#173522] text-white flex items-center justify-center mx-auto mb-2">
                  <Volume2 className="w-6 h-6 text-[#D97824] animate-bounce" />
                </span>
                <p className="font-serif text-sm font-bold text-[#173522]">
                  "Welcome to AgriLink Agricultural Helpline."
                </p>
                <p className="text-[11px] text-[#777268]">
                  "कृषि संपर्क सेवा में आपका स्वागत है। कृपया नीचे दिए गए विकल्पों में से चुनें:"
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#777268] block">
                  Interactive Keypad Prompts:
                </span>
                {ivrMenuOptions.map((opt) => (
                  <div
                    key={opt.key}
                    onClick={() => setActiveStep(Number(opt.key))}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                      activeStep === Number(opt.key)
                        ? 'bg-[#173522] text-white border-[#173522]'
                        : 'bg-white text-[#171713] border-[#DFD7C4] hover:bg-[#EBE5D6]'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-[#D97824] text-white font-mono font-bold flex items-center justify-center shrink-0">
                      {opt.key}
                    </span>
                    <div className="flex-1 leading-snug">
                      <p className="font-bold">{opt.label}</p>
                      <p className={`text-[10px] ${activeStep === Number(opt.key) ? 'text-[#EBE5D6]/80' : 'text-[#777268]'}`}>
                        {opt.hi}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {activeStep === 2 && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-[11px] space-y-1">
                  <strong className="block font-bold">Vehicle Keypad Speech-to-Text:</strong>
                  <span>"Speak or enter your 10-digit vehicle plate number. Cutoff reminder: must be confirmed 6 hours prior to slot."</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-[#DFD7C4] flex justify-end">
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="px-4 py-2 bg-[#173522] text-white rounded-xl text-xs font-bold hover:bg-[#244532] transition cursor-pointer"
              >
                Close Simulator
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
