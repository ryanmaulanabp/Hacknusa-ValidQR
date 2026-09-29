'use client';

import React from 'react';
import { useApp } from '@/lib/LanguageContext';
import { Home, Wallet, QrCode, History, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'wallet' | 'history' | 'profile';
  onTabChange: (tab: 'home' | 'wallet' | 'history' | 'profile') => void;
  onScanClick: () => void;
}

export default function BottomNav({ activeTab, onTabChange, onScanClick }: BottomNavProps) {
  const { t, isDarkMode } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 max-w-md mx-auto z-30 pointer-events-none px-4 pb-4">
      <div
        className={`pointer-events-auto rounded-3xl border backdrop-blur-xl px-2 py-2 flex items-center justify-around shadow-2xl transition-all ${
          isDarkMode
            ? 'bg-[#101424]/90 border-white/10 text-slate-400'
            : 'bg-white/95 border-slate-200/80 text-slate-500 shadow-slate-300/40'
        }`}
      >
        {/* Beranda */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
            activeTab === 'home' ? 'text-[#6C5CE7] font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">{t('nav_home')}</span>
        </button>

        {/* Dompet */}
        <button
          onClick={() => onTabChange('wallet')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
            activeTab === 'wallet' ? 'text-[#6C5CE7] font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px]">{t('nav_wallet')}</span>
        </button>

        {/* Center Floating Scan QR Button */}
        <div className="relative -top-5 flex flex-col items-center">
          <button
            onClick={onScanClick}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#503EBD] via-[#6C5CE7] to-[#A29BFE] text-white flex items-center justify-center shadow-lg shadow-indigo-600/50 hover:shadow-indigo-600/70 border-4 border-[#0B0D1B] transform hover:scale-105 active:scale-95 transition-all"
            title="Scan QRIS ValidQR"
          >
            <QrCode className="w-7 h-7" />
          </button>
          <span className="text-[10px] font-bold text-[#6C5CE7] mt-1 tracking-wider">
            {t('scan')}
          </span>
        </div>

        {/* Riwayat */}
        <button
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
            activeTab === 'history' ? 'text-[#6C5CE7] font-bold' : 'hover:text-slate-200'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px]">{t('nav_history')}</span>
        </button>

        {/* Profil */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
            activeTab === 'profile' ? 'text-[#6C5CE7] font-bold' : 'hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">{t('nav_profile')}</span>
        </button>
      </div>
    </div>
  );
}
