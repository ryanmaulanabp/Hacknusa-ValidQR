'use client';

import React from 'react';
import { useApp } from '@/lib/LanguageContext';
import {
  Smartphone,
  Zap,
  Droplets,
  CreditCard,
  HeartPulse,
  Gamepad2,
  ShoppingBag,
  LayoutGrid,
} from 'lucide-react';

export default function QuickServicesGrid() {
  const { t, isDarkMode } = useApp();

  const services = [
    { id: 'pulsa', label: t('service_pulsa'), icon: Smartphone, color: 'from-blue-500 to-sky-400' },
    { id: 'electric', label: t('service_electric'), icon: Zap, color: 'from-amber-500 to-yellow-400' },
    { id: 'water', label: t('service_water'), icon: Droplets, color: 'from-cyan-500 to-teal-400' },
    { id: 'emoney', label: t('service_emoney'), icon: CreditCard, color: 'from-indigo-500 to-purple-400' },
    { id: 'bpjs', label: t('service_bpjs'), icon: HeartPulse, color: 'from-emerald-500 to-teal-400' },
    { id: 'voucher', label: t('service_voucher'), icon: Gamepad2, color: 'from-rose-500 to-pink-400' },
    { id: 'shopping', label: t('service_shopping'), icon: ShoppingBag, color: 'from-orange-500 to-amber-400' },
    { id: 'more', label: t('service_more'), icon: LayoutGrid, color: 'from-slate-500 to-slate-400' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          {t('quick_services')}
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-y-4 gap-x-2">
        {services.map(s => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => alert(`Layanan ${s.label} siap digunakan!`)}
              className="flex flex-col items-center gap-1.5 group transition-transform active:scale-95"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                  isDarkMode
                    ? 'bg-[#181B2F] border border-white/5 group-hover:border-indigo-500/40 group-hover:bg-[#1E223D]'
                    : 'bg-white border border-slate-100 group-hover:border-indigo-200 group-hover:shadow-md'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${s.color} flex items-center justify-center text-white shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <span
                className={`text-[11px] font-medium text-center leading-tight line-clamp-1 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
