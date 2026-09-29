'use client';

import React from 'react';
import { useApp } from '@/lib/LanguageContext';
import { ShieldCheck, Radar, ChevronRight } from 'lucide-react';

export default function ValidQrShield({ onInfoClick }: { onInfoClick?: () => void }) {
  const { t, isDarkMode } = useApp();

  return (
    <div className="w-full">
      <div
        onClick={onInfoClick}
        className={`relative overflow-hidden rounded-xl p-3.5 border transition-all cursor-pointer ${
          isDarkMode
            ? 'bg-[#13172C] border-[#6C5CE7]/30 hover:border-[#6C5CE7]/60'
            : 'bg-white border-indigo-100 hover:border-indigo-300 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Pulsing Shield Icon */}
            <div className="relative flex items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C5CE7] to-[#A29BFE] flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-indigo-500/30 animate-ping pointer-events-none" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className={`text-[13px] font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {t('shield_title')}
                </h4>
                <span className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <p className={`text-[11px] mt-0.5 leading-snug ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('shield_desc')}
              </p>
            </div>
          </div>

          <div className="flex items-center text-indigo-400">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* 3 Sequential Layer Badges */}
        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            L1: NMID Check
          </span>
          <span className="text-slate-500">•</span>
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            L2: Hybrid Fuzzy
          </span>
          <span className="text-slate-500">•</span>
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            L3: GPS Geofence
          </span>
        </div>
      </div>
    </div>
  );
}
