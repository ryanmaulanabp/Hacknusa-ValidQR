'use client';

import React from 'react';
import { useApp } from '@/lib/LanguageContext';
import {
  ShieldCheck,
  QrCode,
  Globe,
  Sun,
  Moon,
  Bell,
  Home,
  Wallet,
  History,
  Store,
  User,
} from 'lucide-react';
import Link from 'next/link';

interface ResponsiveNavbarProps {
  activeTab: 'home' | 'wallet' | 'history' | 'profile';
  onTabChange: (tab: 'home' | 'wallet' | 'history' | 'profile') => void;
  onScanClick: () => void;
}

export default function ResponsiveNavbar({
  activeTab,
  onTabChange,
  onScanClick,
}: ResponsiveNavbarProps) {
  const { t, isDarkMode, toggleTheme, isEnglish, toggleLanguage } = useApp();

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors ${
        isDarkMode
          ? 'bg-[#0B0D1B]/90 border-white/10 text-white'
          : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onTabChange('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C5CE7] to-[#A29BFE] flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                  NusaPay
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  ValidQR
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5 leading-none">
                Anti-Fraud Payment Web
              </span>
            </div>
          </div>

          {/* Desktop Nav Links (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-1 ml-8">
            <button
              onClick={() => onTabChange('home')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t('nav_home')}</span>
            </button>

            <button
              onClick={() => onTabChange('wallet')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'wallet'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>{t('nav_wallet')}</span>
            </button>

            <button
              onClick={() => onTabChange('history')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="w-4 h-4" />
              <span>{t('nav_history')}</span>
            </button>

            <Link
              href="/merchant-portal"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Merchant Portal</span>
            </Link>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Scan QRIS Action Button (Desktop prominence) */}
          <button
            onClick={onScanClick}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#8E7BFD] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-transform active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Scan QRIS</span>
            <span className="sm:hidden text-[11px]">Scan</span>
          </button>

          {/* Language Switch */}
          <button
            onClick={toggleLanguage}
            title="Ganti Bahasa"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isDarkMode
                ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isEnglish ? 'EN' : 'ID'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title="Ganti Mode Tampilan"
            className={`p-2 rounded-xl transition-all ${
              isDarkMode
                ? 'bg-white/5 hover:bg-white/10 text-amber-400 border border-white/10'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notification Bell */}
          <button
            title="Notifikasi"
            className={`p-2 rounded-xl relative transition-all hidden sm:flex ${
              isDarkMode
                ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
          </button>

          {/* User Profile Avatar */}
          <div
            onClick={() => onTabChange('profile')}
            className="flex items-center gap-2 pl-1 sm:pl-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6C5CE7] to-[#A29BFE] p-[2px] shadow-sm">
              <div className="w-full h-full rounded-[10px] bg-[#181B2F] flex items-center justify-center font-bold text-white text-xs">
                RM
              </div>
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold leading-tight text-white group-hover:text-indigo-300 transition-colors">
                Ryan Maulana
              </div>
              <div className="text-[10px] text-indigo-400 font-semibold leading-tight">
                Platinum
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
