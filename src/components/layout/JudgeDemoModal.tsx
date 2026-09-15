import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';
import { navigate } from '../../utils/navigation';
import {
  Sprout,
  Factory,
  ArrowRight,
  X,
  Sparkles,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface JudgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JudgeDemoModal: React.FC<JudgeDemoModalProps> = ({ isOpen, onClose }) => {
  const { loginAsDemo } = useAuth();
  const { resetAllData } = useAppData();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSelectRole = async (role: UserRole) => {
    try {
      const res = await loginAsDemo(role);
      showToast(`Authenticated as demo ${role}: ${res.user.name}`, 'success');
      onClose();
      navigate(`/${role}/dashboard`);
    } catch (err) {
      showToast('Failed to initialize demo session.', 'error');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to default SIH presentation state?')) {
      resetAllData();
      showToast('Data reset to default presentation state.', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#132619]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-[#F3EFE4] border border-[#DFD7C4] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#DFD7C4]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#173522] text-[#EBE5D6] text-[11px] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D97824]" />
              <span className="tracking-wide uppercase">Smart India Hackathon 2026</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#171713]">
              Demo for SIH Judge
            </h3>
            <p className="text-xs text-[#777268] mt-1">
              Select a role below to instantly authenticate and evaluate the connected AgriLink workflow.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#777268] hover:text-[#171713] hover:bg-[#EBE5D6] transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Options */}
        <div className="mt-5 space-y-3">
          {/* Farmer Option */}
          <button
            type="button"
            onClick={() => handleSelectRole('farmer')}
            className="w-full text-left p-4 rounded-2xl bg-white hover:bg-[#FAF7F0] border border-[#DFD7C4] hover:border-[#173522] transition-all group shadow-2xs flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#173522] text-[#EBE5D6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6 text-[#D97824]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-base font-bold text-[#171713] group-hover:text-[#173522]">
                    Demo as Farmer
                  </h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Producer
                  </span>
                </div>
                <p className="text-xs text-[#777268] mt-0.5">
                  <strong>Ramesh Patel</strong> (Processing-crop farmer, Kolhapur) • Registered Crops &amp; Active Procurement
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#EBE5D6] group-hover:bg-[#173522] group-hover:text-white text-[#171713] flex items-center justify-center transition-colors shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Factory Option */}
          <button
            type="button"
            onClick={() => handleSelectRole('factory')}
            className="w-full text-left p-4 rounded-2xl bg-white hover:bg-[#FAF7F0] border border-[#DFD7C4] hover:border-[#173522] transition-all group shadow-2xs flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#173522] text-[#EBE5D6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Factory className="w-6 h-6 text-[#D97824]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-base font-bold text-[#171713] group-hover:text-[#173522]">
                    Demo as Processing Factory
                  </h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Operations
                  </span>
                </div>
                <p className="text-xs text-[#777268] mt-0.5">
                  <strong>Sahyadri Sugar Mill Ltd.</strong> • Intake Schedule, Queue, Weighment &amp; Invoicing
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#EBE5D6] group-hover:bg-[#173522] group-hover:text-white text-[#171713] flex items-center justify-center transition-colors shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Footer info & Reset option */}
        <div className="mt-6 pt-4 border-t border-[#DFD7C4] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-[#777268]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#173522]" />
            <span>Connected farmer and factory workflows ready for evaluation</span>
          </div>
          <button
            type="button"
            onClick={handleResetData}
            className="text-[#777268] hover:text-[#D97824] flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};
