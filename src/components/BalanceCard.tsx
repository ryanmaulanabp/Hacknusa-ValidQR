'use client';

import React from 'react';
import { useApp } from '@/lib/LanguageContext';
import { Eye, EyeOff, PlusCircle, ArrowUpRight, ArrowDownLeft, Clock, ShieldCheck } from 'lucide-react';

export default function BalanceCard({ onOpenHistory }: { onOpenHistory?: () => void }) {
  const { t, balance, isBalanceHidden, toggleBalanceHidden } = useApp();

  const formattedBalance = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(balance);

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3B5998] via-[#4A55A2] to-[#6C5CE7] p-5 sm:p-6 text-white shadow-xl shadow-indigo-900/30">
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-36 h-36 rounded-full bg-purple-500/20 blur-xl pointer-events-none" />

        {/* Card Header: Card Type & Eye toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
              {t('balance_type')}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-300 font-medium bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3" />
              ValidQR AI
            </span>
          </div>

          <button
            onClick={toggleBalanceHidden}
            className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-opacity bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm"
          >
            {isBalanceHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{isBalanceHidden ? t('show') : t('hide')}</span>
          </button>
        </div>

        {/* Balance Display */}
        <div className="mt-3">
          <div className="text-[12px] text-white/70 font-medium">
            {t('active_balance')}
          </div>
          <div className="text-[26px] font-extrabold tracking-tight mt-0.5">
            {isBalanceHidden ? '••••••••' : formattedBalance}
          </div>
        </div>

        {/* Quick Wallet Actions */}
        <div className="mt-5 pt-3 border-t border-white/15 grid grid-cols-4 gap-2">
          {/* Top Up */}
          <button
            className="flex flex-col items-center gap-1 group transition-transform active:scale-95"
            onClick={() => alert('Fitur Top Up Demo: Saldo aktif Anda adalah ' + formattedBalance)}
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white/25 transition-colors shadow-sm">
              <PlusCircle className="w-5 h-5 text-emerald-300" />
            </div>
            <span className="text-[11px] font-medium text-white/90">{t('topup')}</span>
          </button>

          {/* Transfer */}
          <button
            className="flex flex-col items-center gap-1 group transition-transform active:scale-95"
            onClick={() => alert('Fitur Transfer NusaPay')}
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white/25 transition-colors shadow-sm">
              <ArrowUpRight className="w-5 h-5 text-sky-300" />
            </div>
            <span className="text-[11px] font-medium text-white/90">{t('transfer')}</span>
          </button>

          {/* Tarik */}
          <button
            className="flex flex-col items-center gap-1 group transition-transform active:scale-95"
            onClick={() => alert('Fitur Tarik Tunai Tanpa Kartu')}
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white/25 transition-colors shadow-sm">
              <ArrowDownLeft className="w-5 h-5 text-amber-300" />
            </div>
            <span className="text-[11px] font-medium text-white/90">{t('withdraw')}</span>
          </button>

          {/* Riwayat */}
          <button
            className="flex flex-col items-center gap-1 group transition-transform active:scale-95"
            onClick={onOpenHistory}
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white/25 transition-colors shadow-sm">
              <Clock className="w-5 h-5 text-purple-200" />
            </div>
            <span className="text-[11px] font-medium text-white/90">{t('history')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
