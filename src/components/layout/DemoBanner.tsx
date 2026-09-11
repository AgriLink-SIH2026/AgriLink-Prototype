import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { navigate } from '../../utils/navigation';
import { Sparkles, RotateCcw, ChevronDown, ChevronUp, UserCheck } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { currentUser, switchUser } = useAuth();
  const { resetAllData } = useAppData();
  const { showToast } = useToast();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSwitch = (userId: string, roleName: string, targetPath: string) => {
    switchUser(userId);
    navigate(targetPath);
    showToast(`Switched active session to ${roleName}`, 'info');
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to default SIH presentation state?')) {
      resetAllData();
      showToast('Data reset to original demo state', 'success');
      window.location.reload();
    }
  };

  return (
    <aside aria-label="Smart India Hackathon Demo Quick Role Switcher" className="bg-[#12281A] text-[#FAF7F0] text-xs border-b border-[#244532] shadow-sm transition-all sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#D97824] animate-pulse" />
          <span className="font-sans font-semibold tracking-wider text-[#D97824] uppercase text-[10px] bg-[#173522] px-2 py-0.5 rounded border border-[#D97824]/30">
            SIH 2026 Judge Demo
          </span>
          <span className="text-[#A4B5A0] hidden sm:inline font-sans">
            Active: <strong className="text-white font-medium">{currentUser?.name || 'Guest'}</strong> (
            <span className="capitalize text-[#D97824] font-semibold">{currentUser?.role || 'None'}</span>)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isExpanded && (
            <div className="flex flex-wrap items-center gap-1.5 font-sans">
              <span className="text-[#8FA389] text-[11px] hidden md:inline">Quick Role Switch:</span>
              <button
                onClick={() => handleSwitch('farmer-1', 'Farmer (Ramesh Patel)', '/farmer/dashboard')}
                className={`px-2.5 py-1 rounded text-xs transition flex items-center gap-1.5 font-medium ${
                  currentUser?.id === 'farmer-1'
                    ? 'bg-[#D97824] text-white shadow-sm ring-1 ring-white/20'
                    : 'bg-[#173522] hover:bg-[#244532] text-[#EBE5D6] border border-[#244532]'
                }`}
                title="Switch to Ramesh Patel (Sugarcane Farmer)"
              >
                <UserCheck className="w-3 h-3 text-[#D97824]" />
                <span>👨‍🌾 Farmer</span>
              </button>

              <button
                onClick={() => handleSwitch('officer-1', 'Field Officer (Rajesh Sharma)', '/officer/dashboard')}
                className={`px-2.5 py-1 rounded text-xs transition flex items-center gap-1.5 font-medium ${
                  currentUser?.id === 'officer-1'
                    ? 'bg-[#244532] text-white shadow-sm ring-1 ring-white/20'
                    : 'bg-[#173522] hover:bg-[#244532] text-[#EBE5D6] border border-[#244532]'
                }`}
                title="Switch to Rajesh Sharma (Agronomist / Field Officer)"
              >
                <UserCheck className="w-3 h-3 text-[#9DC88D]" />
                <span>📋 Field Officer</span>
              </button>

              <button
                onClick={() => handleSwitch('factory-1', 'Factory (Sahyadri Sugar Mill)', '/factory/dashboard')}
                className={`px-2.5 py-1 rounded text-xs transition flex items-center gap-1.5 font-medium ${
                  currentUser?.id === 'factory-1'
                    ? 'bg-[#C3681B] text-white shadow-sm ring-1 ring-white/20'
                    : 'bg-[#173522] hover:bg-[#244532] text-[#EBE5D6] border border-[#244532]'
                }`}
                title="Switch to Sahyadri Cooperative Sugar Mill Ltd."
              >
                <UserCheck className="w-3 h-3 text-[#F5B461]" />
                <span>🏭 Factory</span>
              </button>

              <button
                onClick={handleReset}
                className="px-2 py-1 bg-[#173522] hover:bg-rose-950/80 text-[#D0DCD0] hover:text-rose-200 border border-[#244532] rounded transition flex items-center gap-1 text-xs"
                title="Reset test data back to default SIH demonstration records"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden lg:inline">Reset Demo</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
            title={isExpanded ? 'Collapse Switcher' : 'Expand Switcher'}
            aria-label={isExpanded ? 'Collapse Quick Role Switcher' : 'Expand Quick Role Switcher'}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
