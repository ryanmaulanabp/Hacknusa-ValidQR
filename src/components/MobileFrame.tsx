'use client';

import React from 'react';
import { useApp } from '@/lib/LanguageContext';
import {
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Store,
  History,
  Activity,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface MobileFrameProps {
  children: React.ReactNode;
}

export default function MobileFrame({ children }: MobileFrameProps) {
  const { isDarkMode } = useApp();

  return (
    <div className="min-h-screen w-full bg-[#070913] text-slate-100 flex items-center justify-center p-0 md:p-6 lg:p-8">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Left Side: Desktop Companion Information Panel (Hidden on mobile) */}
        <div className="hidden lg:flex flex-col max-w-md space-y-6 text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold tracking-wider uppercase">
              <Award className="w-4 h-4 text-amber-400" />
              HackNusa 2026 · Top 30 Finalist
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              ValidQR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE]">NusaPay</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Adaptive Real-Time Anti-Fraud SDK untuk QRIS Nasional. Mendeteksi pemalsuan stiker dan penipuan overlay sebelum saldo pembeli terpotong.
            </p>
          </div>

          {/* 3 Sequential Layer Security Explainer */}
          <div className="p-4 rounded-2xl bg-[#101424] border border-white/10 space-y-3 text-xs">
            <div className="font-bold text-white flex items-center gap-2 text-sm">
              <Layers className="w-4 h-4 text-indigo-400" />
              3-Layer Sequential Security Engine
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="font-bold text-indigo-400">Layer 1: NMID Cross-Validation</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Validasi identitas unik Bank Indonesia. Mencegah penggantian QRIS bodong.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="font-bold text-amber-400">Layer 2: Hybrid Fuzzy Name Matching</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Levenshtein (40%) + Token Overlap (60%) untuk mendeteksi penipuan rebrand.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="font-bold text-emerald-400">Layer 3: GPS Geofencing (20m)</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Haversine distance check untuk memblokir Overlay Attack secara instan.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Link
              href="/merchant-portal"
              className="p-3 rounded-xl bg-[#141728] hover:bg-[#1E223D] border border-white/10 hover:border-indigo-500/40 transition-all flex items-center gap-2 font-semibold text-white"
            >
              <Store className="w-4 h-4 text-sky-400" />
              <span>Merchant Portal</span>
              <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
            </Link>

            <Link
              href="/history"
              className="p-3 rounded-xl bg-[#141728] hover:bg-[#1E223D] border border-white/10 hover:border-indigo-500/40 transition-all flex items-center gap-2 font-semibold text-white"
            >
              <History className="w-4 h-4 text-purple-400" />
              <span>Riwayat Scan</span>
              <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
            </Link>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-white/5">
            <span>Tim NusaPay: Alim & Ryan</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              API Server Online
            </span>
          </div>
        </div>

        {/* Center: Mobile Device Frame */}
        <div className="relative w-full max-w-md mx-auto">
          {/* Outer Phone Mockup (Desktop only frame) */}
          <div
            className={`w-full h-full md:h-[844px] md:max-h-[92vh] md:rounded-[48px] md:border-[10px] md:border-[#1E2338] md:shadow-[0_0_60px_rgba(108,92,231,0.25)] flex flex-col overflow-hidden relative transition-colors ${
              isDarkMode ? 'bg-[#0B0D1B]' : 'bg-[#F4F6FB]'
            }`}
          >
            {/* Phone Top Speaker & Camera Notch (Desktop only) */}
            <div className="hidden md:flex items-center justify-center pt-2 pb-1 z-30 pointer-events-none">
              <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#181B2F]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#0E1120]" />
              </div>
            </div>

            {/* Mobile Screen Children */}
            <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative">
              {children}
            </div>

            {/* Phone Bottom Indicator Line (Desktop only) */}
            <div className="hidden md:flex justify-center pb-2 pt-1 z-30 pointer-events-none">
              <div className="w-32 h-1 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
