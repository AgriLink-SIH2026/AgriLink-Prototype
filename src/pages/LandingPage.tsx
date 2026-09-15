import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserRole } from '../types';
import { navigate } from '../utils/navigation';
import { JudgeDemoModal } from '../components/layout/JudgeDemoModal';
import {
  Sprout,
  CheckCircle2,
  Building2,
  ArrowRight,
  Clock,
  FileX,
  Radio,
  Sparkles,
  Layers,
  Scale,
  ChevronRight,
  User,
  Factory,
  FileCheck,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { loginAsDemo, currentUser } = useAuth();
  const { showToast } = useToast();
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);

  const handleLaunchRole = async (role: UserRole) => {
    try {
      const res = await loginAsDemo(role);
      showToast(`Logged in as demo ${role}: ${res.user.name}`, 'success');
      navigate(`/${role}/dashboard`);
    } catch (err) {
      showToast('Failed to start demo.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EFE4] text-[#171713] selection:bg-[#D97824]/20 selection:text-[#173522] font-sans">
      {/* Top Navigation Bar matching reference */}
      <nav className="border-b border-[#DFD7C4] bg-[#F3EFE4]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#173522] flex items-center justify-center text-[#EBE5D6] shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-serif font-black text-xl text-[#D97824]">A</span>
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#171713] block leading-tight">
                AgriLink
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#777268] block">
                Smarter Procurement
              </span>
            </div>
          </a>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#777268]">
            <a href="#how-it-works" className="hover:text-[#171713] transition">
              How it works
            </a>
            <a href="#the-problem" className="hover:text-[#171713] transition">
              The problem
            </a>
            <button
              onClick={() => setIsJudgeModalOpen(true)}
              className="text-[#D97824] hover:text-[#C3681B] font-semibold flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo for SIH Judge</span>
            </button>
          </div>

          {/* Auth Controls */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <a
                href={`/${currentUser.role}/dashboard`}
                className="px-4 py-2 bg-[#173522] text-[#EBE5D6] rounded-xl text-xs font-bold hover:bg-[#244532] transition flex items-center gap-2"
              >
                <span>Dashboard ({currentUser.role})</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D97824]" />
              </a>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-xs font-semibold text-[#171713] hover:text-[#D97824] px-3 py-2 transition"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="px-4 py-2 bg-[#173522] text-[#EBE5D6] rounded-xl text-xs font-bold hover:bg-[#244532] shadow-sm transition"
                >
                  Get Started
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section matching Screenshot 3 */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column (Hero Content) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Agricultural Procurement Network Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBE5D6] text-[#D97824] text-xs font-semibold tracking-wider uppercase border border-[#DFD7C4]">
                <span className="w-2 h-2 rounded-full bg-[#D97824] animate-pulse" />
                <span>Agricultural Procurement Network</span>
              </div>

              {/* Editorial Serif Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#171713] tracking-tight leading-[1.1]">
                Smarter Agricultural<br />
                Procurement.<br />
                Connected.<br />
                Transparent.
              </h1>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-[#777268] leading-relaxed max-w-xl font-normal">
                AgriLink connects farmers directly with processing factories on one digital network,
                bringing certainty to harvest schedules, computerizing weighment, and securing automated settlements.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <a
                  href="/signup"
                  className="px-6 py-3.5 bg-[#173522] hover:bg-[#244532] text-[#EBE5D6] rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2 group"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-[#D97824]" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsJudgeModalOpen(true)}
                  className="px-6 py-3.5 bg-[#D97824] hover:bg-[#C3681B] text-white rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Demo for SIH Judge</span>
                </button>

                <a
                  href="/login"
                  className="px-5 py-3.5 bg-[#EBE5D6] hover:bg-white text-[#171713] border border-[#DFD7C4] rounded-xl font-bold text-xs transition"
                >
                  Sign In
                </a>
              </div>
            </div>

            {/* Right Column (ENTER AS ROLE Card matching Screenshot 3) */}
            <div className="lg:col-span-5">
              <div className="bg-[#173522] text-[#EBE5D6] rounded-3xl p-6 sm:p-7 border border-[#244532] shadow-2xl relative overflow-hidden">
                {/* Header row */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#244532]">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-[#EBE5D6]/70">
                    ENTER AS ROLE
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#D97824]">
                    v0.1
                  </span>
                </div>

                {/* Role Buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleLaunchRole('farmer')}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#244532] hover:bg-[#2d563e] border border-[#346347] text-left text-sm font-bold text-white flex items-center justify-between transition-all group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#173522] flex items-center justify-center text-[#D97824]">
                        <Sprout className="w-4 h-4" />
                      </div>
                      <span>Farmer</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#EBE5D6]/60 group-hover:text-[#D97824] group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLaunchRole('factory')}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#244532] hover:bg-[#2d563e] border border-[#346347] text-left text-sm font-bold text-white flex items-center justify-between transition-all group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#173522] flex items-center justify-center text-[#D97824]">
                        <Factory className="w-4 h-4" />
                      </div>
                      <span>Processing Factory</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#EBE5D6]/60 group-hover:text-[#D97824] group-hover:translate-x-1 transition-all" />
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section matching Screenshot 2 */}
      <section id="the-problem" className="py-20 border-t border-[#DFD7C4] bg-[#EBE5D6]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column (Editorial Header & Copy) */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#D97824] block">
                THE PROBLEM
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#171713] tracking-tight leading-tight">
                Procurement shouldn't run on memory and loose paper.
              </h2>
              <p className="text-sm text-[#777268] leading-relaxed pt-2">
                Today, farmers stand in queues without knowing when their crop will be weighed, and records
                scatter across handwritten slips that are hard to find and harder to trust.
              </p>
            </div>

            {/* Right Column: Grid of Pain Cards matching Screenshot 2 */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  code: 'PAIN 01',
                  title: 'Long waiting times',
                  desc: 'Hours spent on-site with no idea where in the line a farmer stands.',
                },
                {
                  code: 'PAIN 02',
                  title: 'No schedule information',
                  desc: 'No way to know when a factory will actually collect the crop.',
                },
                {
                  code: 'PAIN 03',
                  title: 'Uncertain status',
                  desc: 'No clear, shared view of whether a load is verified, weighed or paid.',
                },
                {
                  code: 'PAIN 04',
                  title: 'Fragmented paper records',
                  desc: 'Records split across notebooks and slips that are easy to lose.',
                },
              ].map((pain) => (
                <div
                  key={pain.code}
                  className="p-5 rounded-2xl bg-[#EBE5D6] border border-[#DFD7C4] hover:border-[#173522] transition-colors shadow-2xs"
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#D97824] block mb-1.5 font-mono">
                    {pain.code}
                  </span>
                  <h3 className="font-serif text-base font-bold text-[#171713] mb-1.5">
                    {pain.title}
                  </h3>
                  <p className="text-xs text-[#777268] leading-relaxed">
                    {pain.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Solution & Complete Lifecycle Section */}
      <section id="how-it-works" className="py-20 border-t border-[#DFD7C4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] uppercase font-bold tracking-widest text-[#D97824] block mb-2">
              COMPLETE LIFECYCLE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#171713] tracking-tight">
              How AgriLink Operates End-to-End
            </h2>
            <p className="text-xs sm:text-sm text-[#777268] mt-2">
              Every step is authenticated, validated by business rules, and shared in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                title: 'Farmer Registers Crop',
                desc: 'Enters acreage, crop variety and expected harvest date—no photo upload required.',
              },
              {
                step: '02',
                title: 'Farmer Compares Processors',
                desc: 'Compares processor bids, queue times and available intake slots across Pune buyers.',
              },
              {
                step: '03',
                title: 'Factory Schedules Intake',
                desc: 'Allocates a factory intake slot and prepares the digital gate queue for the farmer.',
              },
              {
                step: '04',
                title: 'Quality & Weighment',
                desc: 'Computerized weighbridge records Gross - Tare = Certified Net Weight; tests quality parameters.',
              },
              {
                step: '05',
                title: 'Instant Billing & Settlement',
                desc: 'Computerized bill generated instantly (Net Weight × Rate) and released to farmer account.',
              },
              {
                step: '06',
                title: 'Auditable Digital Ledger',
                desc: 'Permanent digital ledger preserved with full audit trail for future seasons and crop credit.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="p-6 rounded-2xl bg-[#EBE5D6] border border-[#DFD7C4] relative overflow-hidden group hover:border-[#173522] transition-all shadow-2xs"
              >
                <span className="text-3xl font-mono font-black text-[#777268]/20 absolute top-3 right-4">
                  {s.step}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D97824] block mb-1">
                  Step {s.step}
                </span>
                <h3 className="font-serif text-base font-bold text-[#171713] mb-1.5">
                  {s.title}
                </h3>
                <p className="text-xs text-[#777268] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two Roles Section */}
      <section className="py-20 bg-[#173522] text-[#EBE5D6] border-t border-[#244532]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#EBE5D6] tracking-tight">
              One Direct Platform for Farmers and Factories
            </h2>
            <p className="text-xs sm:text-sm text-[#EBE5D6]/70 mt-2">
              Tailored interfaces built specifically for the needs of each participant in the agricultural supply chain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Farmer */}
            <div className="p-7 rounded-3xl bg-[#244532] border border-[#346347] flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#173522] text-[#D97824] flex items-center justify-center mb-4">
                  <Sprout className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#EBE5D6] mb-2">Farmer</h3>
                <p className="text-xs text-[#EBE5D6]/70 leading-relaxed">
                  Simple, accessible portal for rural producers. Register crops, compare live factory offers, track
                  procurement progress in real time, view weighment certificates, and receive SMS alerts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleLaunchRole('farmer')}
                className="mt-6 w-full py-2.5 bg-[#D97824] hover:bg-[#C3681B] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <span>Access Farmer Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Factory */}
            <div className="p-7 rounded-3xl bg-[#244532] border border-[#346347] flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#173522] text-[#D97824] flex items-center justify-center mb-4">
                  <Factory className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#EBE5D6] mb-2">Processing Factory</h3>
                <p className="text-xs text-[#EBE5D6]/70 leading-relaxed">
                  Industrial operations desk for sugar mills, ginning units, and oil expellers. Manage
                  intake queues, record electronic weighment, and issue digital invoices.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleLaunchRole('factory')}
                className="mt-6 w-full py-2.5 bg-[#D97824] hover:bg-[#C3681B] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <span>Access Factory Operations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#DFD7C4] py-10 bg-[#F3EFE4] text-xs text-[#777268]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#173522] flex items-center justify-center text-[#D97824] font-serif font-bold text-sm">
              A
            </div>
            <span className="font-bold text-[#171713]">
              AgriLink — SIH 2026 (Problem ID: SIH26032)
            </span>
          </div>
          <p className="text-center sm:text-right">
            Engineered for Sugar, Textile, Oilseeds, and Plantation processing industries.
          </p>
        </div>
      </footer>

      {/* SIH Judge Demo Modal */}
      <JudgeDemoModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
      />
    </div>
  );
};
