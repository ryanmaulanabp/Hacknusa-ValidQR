'use client';

import React from 'react';
import { useApp } from '@/lib/LanguageContext';
import { Sun, Moon, Globe, Bell } from 'lucide-react';

export default function Header() {
  const { t, isDarkMode, toggleTheme, isEnglish, toggleLanguage } = useApp();

  return (
    <header className="px-5 pt-3 pb-2 flex items-center justify-between">
      {/* User Avatar & Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#A29BFE] p-[2px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full rounded-full bg-[#181B2F] flex items-center justify-center font-bold text-white text-base overflow-hidden">
              RM
            </div>
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0B0D1B] rounded-full"></span>
        </div>

        <div>
          <div className="text-[12px] font-medium leading-none text-slate-400">
            {t('greeting')}
          </div>
          <div className={`text-[15px] font-bold mt-1 leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {t('user_name')}
          </div>
          <div className="text-[11px] font-semibold text-[#6C5CE7] mt-0.5 tracking-wide">
            {t('user_title')}
          </div>
        </div>
      </div>

      {/* Action Controls: Language Toggle, Theme Toggle, Notification */}
      <div className="flex items-center gap-1.5">
        {/* Language Switch */}
        <button
          onClick={toggleLanguage}
          title="Toggle Language"
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            isDarkMode
              ? 'bg-[#181B2F] text-slate-300 hover:text-white border border-white/10'
              : 'bg-white text-slate-700 hover:text-slate-900 shadow-sm border border-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-[#6C5CE7]" />
          <span>{isEnglish ? 'EN' : 'ID'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Dark/Light Mode"
          className={`p-2 rounded-full transition-all ${
            isDarkMode
              ? 'bg-[#181B2F] text-amber-400 hover:bg-[#20253f] border border-white/10'
              : 'bg-white text-slate-600 hover:text-slate-900 shadow-sm border border-slate-200'
          }`}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <button
          title="Notifikasi"
          className={`p-2 rounded-full relative transition-all ${
            isDarkMode
              ? 'bg-[#181B2F] text-slate-300 hover:text-white border border-white/10'
              : 'bg-white text-slate-600 hover:text-slate-900 shadow-sm border border-slate-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
