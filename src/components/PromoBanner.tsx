'use client';

import React from 'react';
import { useApp } from '@/lib/LanguageContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function PromoBanner() {
  const { t } = useApp();

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#6B4EE6] via-[#8553E8] to-[#9B51E0] p-4 sm:p-5 text-white shadow-lg shadow-purple-900/25">
        {/* Glow circle */}
        <div className="absolute right-0 top-0 -mr-6 -mt-6 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="max-w-[75%]">
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              {t('promo_badge')}
            </span>

            <h3 className="text-base font-extrabold mt-1.5 leading-tight">
              {t('promo_title')}
            </h3>

            <p className="text-xs text-white/80 mt-0.5 leading-snug">
              {t('promo_desc')}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
