'use client';

import React from 'react';
import { useApp } from '@/lib/LanguageContext';
import { ArrowUpRight, ArrowDownLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function RecentTransactions({ onSeeAll }: { onSeeAll?: () => void }) {
  const { t, isDarkMode, transactions } = useApp();

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          {t('recent_title')}
        </h3>
        <button
          onClick={onSeeAll}
          className="text-xs font-semibold text-[#6C5CE7] hover:underline"
        >
          {t('see_all')}
        </button>
      </div>

      <div className="space-y-2.5">
        {transactions.slice(0, 5).map(tx => {
          const isBlocked = tx.status === 'BLOCKED';
          const isCredit = tx.type === 'credit';

          return (
            <div
              key={tx.id}
              className={`p-3.5 rounded-2xl flex items-center justify-between border transition-all ${
                isDarkMode
                  ? isBlocked
                    ? 'bg-[#1C1014] border-red-900/40'
                    : 'bg-[#141728] border-white/5 hover:border-white/10'
                  : isBlocked
                  ? 'bg-red-50 border-red-200'
                  : 'bg-white border-slate-100 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isBlocked
                      ? 'bg-rose-500/20 text-rose-500'
                      : isCredit
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-indigo-500/20 text-indigo-400'
                  }`}
                >
                  {isBlocked ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : isCredit ? (
                    <ArrowDownLeft className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4
                      className={`text-[13px] font-bold leading-snug line-clamp-1 ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {tx.title}
                    </h4>
                    {isBlocked && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-500 text-white">
                        BLOCKED
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span>{tx.category}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-[13px] font-bold ${
                    isBlocked
                      ? 'text-rose-400 line-through'
                      : isCredit
                      ? 'text-emerald-400'
                      : isDarkMode
                      ? 'text-white'
                      : 'text-slate-900'
                  }`}
                >
                  {isCredit ? `+ ${formatRupiah(tx.amount)}` : `- ${formatRupiah(tx.amount)}`}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {tx.id}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
