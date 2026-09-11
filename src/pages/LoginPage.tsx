import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';
import { navigate } from '../utils/navigation';
import { JudgeDemoModal } from '../components/layout/JudgeDemoModal';
import {
  Sprout,
  User,
  ShieldCheck,
  Factory,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  Sparkles,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo, currentUser, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const urlParams = new URLSearchParams(window.location.search);
  const initialRole = (urlParams.get('role') as UserRole) || 'farmer';
  const redirectTarget = urlParams.get('redirect');

  // Quick fill accounts per role
  const demoAccounts = {
    farmer: {
      name: 'Ramesh Patel / Rajesh Patil',
      subtext: 'Sugarcane Farmer • Kolhapur',
      email: 'ramesh.patel@agrilink.in',
    },
    officer: {
      name: 'Rajesh Sharma',
      subtext: 'Agronomist / Field Officer',
      email: 'rajesh.sharma@agrilink.gov.in',
    },
    factory: {
      name: 'Sahyadri Cooperative Sugar Mill',
      subtext: 'Processing Unit • Kolhapur',
      email: 'procurement@sahyadrisugar.com',
    },
  };

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [identifier, setIdentifier] = useState(demoAccounts[initialRole]?.email || 'ramesh.patel@agrilink.in');
  const [password, setPassword] = useState('demo123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);

  // If already authenticated, redirect straight to user's dashboard
  React.useEffect(() => {
    if (isAuthenticated && currentUser) {
      const target =
        redirectTarget &&
        redirectTarget !== '/login' &&
        redirectTarget !== '/signup' &&
        redirectTarget !== '/'
          ? redirectTarget
          : `/${currentUser.role}/dashboard`;
      navigate(target);
    }
  }, [isAuthenticated, currentUser, redirectTarget]);

  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    // Autofill helper placeholder or email for convenience if empty or previous demo email
    if (!identifier || Object.values(demoAccounts).some((d) => d.email === identifier)) {
      setIdentifier(demoAccounts[role].email);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = identifier.trim() || demoAccounts[selectedRole].email;

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(cleanId, selectedRole);
      if (res.success && res.user) {
        showToast(`Welcome back, ${res.user.name}! Redirecting...`, 'success');
        const target =
          redirectTarget &&
          redirectTarget !== '/login' &&
          redirectTarget !== '/signup' &&
          redirectTarget !== '/'
            ? redirectTarget
            : `/${res.user.role}/dashboard`;
        navigate(target);
      } else {
        const err = res.error || 'Invalid email or password. Please try again.';
        setErrorMessage(err);
        showToast(err, 'error');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred during login. Please try again.');
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoAccess = async (role: UserRole) => {
    setIsSubmitting(true);
    try {
      const res = await loginAsDemo(role);
      showToast(`Authenticated as demo ${role}: ${res.user.name}!`, 'success');
      const target =
        redirectTarget &&
        redirectTarget !== '/login' &&
        redirectTarget !== '/signup' &&
        redirectTarget !== '/'
          ? redirectTarget
          : `/${role}/dashboard`;
      navigate(target);
    } catch (err) {
      showToast('Failed to start demo session.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EFE4] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <a href="/" className="inline-flex items-center gap-3 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-[#173522] flex items-center justify-center text-[#EBE5D6] shadow-md group-hover:scale-105 transition-transform">
            <span className="font-serif font-black text-2xl text-[#D97824]">A</span>
          </div>
          <div className="text-left">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#171713] block leading-none">
              AgriLink
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#777268] block mt-1">
              Smarter Procurement
            </span>
          </div>
        </a>

        <h2 className="font-serif text-3xl font-extrabold text-[#171713] tracking-tight">
          Sign In to AgriLink
        </h2>
        <p className="text-xs text-[#777268] mt-1.5 max-w-sm mx-auto">
          Access your transparent agricultural procurement portal, crop records, and live status.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FAF7F0] py-8 px-6 sm:px-10 rounded-3xl border border-[#DFD7C4] shadow-lg space-y-6">
          {/* SIH Judge Demo Access Banner */}
          <div className="p-3.5 bg-[#173522] text-[#EBE5D6] rounded-2xl border border-[#244532] shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D97824]" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D97824]">
                  SIH 2026 Judge Demo
                </span>
              </div>
              <span className="text-[10px] text-[#EBE5D6]/70 font-medium">One-Click Entry</span>
            </div>

            <button
              type="button"
              onClick={() => setIsJudgeModalOpen(true)}
              className="w-full py-2 px-3 bg-[#D97824] hover:bg-[#C3681B] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Demo for SIH Judge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Role Selection Tabs */}
          <div>
            <label className="text-[11px] uppercase font-bold tracking-wider text-[#777268] block mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'farmer', label: 'Farmer', icon: User },
                { id: 'officer', label: 'Field Officer', icon: ShieldCheck },
                { id: 'factory', label: 'Factory', icon: Factory },
              ].map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleTabChange(r.id as UserRole)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-[#173522] text-[#EBE5D6] shadow-sm'
                        : 'bg-white text-[#777268] border border-[#DFD7C4] hover:bg-[#EBE5D6]'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isSelected ? 'text-[#D97824]' : 'text-[#777268]'
                      }`}
                    />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick 1-Click Role Login Card */}
          <div className="p-3 bg-[#EBE5D6]/60 rounded-2xl border border-[#DFD7C4]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#777268]">
                Quick Demo Account
              </span>
              <span className="text-[10px] text-[#777268]">Preset Test Data</span>
            </div>
            <button
              type="button"
              onClick={() => handleQuickDemoAccess(selectedRole)}
              className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#FAF7F0] border border-[#DFD7C4] hover:border-[#173522] text-xs transition flex items-center justify-between group"
            >
              <div>
                <p className="font-bold text-[#171713] group-hover:text-[#173522]">
                  {demoAccounts[selectedRole].name}
                </p>
                <p className="text-[11px] text-[#777268]">
                  {demoAccounts[selectedRole].subtext}
                </p>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#EBE5D6] group-hover:bg-[#173522] group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>

          {/* Inline Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Standard Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#171713] block mb-1">
                Email, Phone, or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#777268] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder={demoAccounts[selectedRole].email}
                  disabled={isSubmitting}
                  className="w-full text-xs pl-10 pr-3 py-3 rounded-xl border border-[#DFD7C4] bg-white text-[#171713] focus:ring-2 focus:ring-[#173522] focus:border-[#173522] focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#171713]">Password</label>
                <span className="text-[11px] text-[#777268]">Demo: demo123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#777268] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="w-full text-xs pl-10 pr-3 py-3 rounded-xl border border-[#DFD7C4] bg-white text-[#171713] focus:ring-2 focus:ring-[#173522] focus:border-[#173522] focus:outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Login Button with loading state */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#173522] hover:bg-[#244532] active:bg-[#12281A] disabled:bg-[#777268]/50 disabled:cursor-not-allowed text-[#EBE5D6] rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#D97824]" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Log In as {selectedRole.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4 text-[#D97824]" />
                </>
              )}
            </button>
          </form>

          {/* Registration link */}
          <div className="text-center pt-3 border-t border-[#DFD7C4]">
            <p className="text-xs text-[#777268]">
              Don't have an account?{' '}
              <a
                href="/signup"
                className="font-bold text-[#173522] hover:text-[#D97824] transition underline"
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* SIH Judge Demo Modal */}
      <JudgeDemoModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
      />
    </div>
  );
};

