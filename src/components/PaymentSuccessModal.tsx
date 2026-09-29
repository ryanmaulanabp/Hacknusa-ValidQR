'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/lib/LanguageContext';
import { ScanResponse } from '@/lib/types';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  ShieldCheck,
  Share2,
  Download,
  ArrowLeft,
  QrCode,
} from 'lucide-react';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  txId: string;
  response: ScanResponse | null;
}

export default function PaymentSuccessModal({
  isOpen,
  onClose,
  amount,
  txId,
  response,
}: PaymentSuccessModalProps) {
  const { t, balance } = useApp();

  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen || !response) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const merchantName = response.scanned_name || response.matched_name || 'Merchant ValidQR';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#0B0D1B] rounded-t-3xl sm:rounded-3xl border border-white/10 text-white shadow-2xl flex flex-col overflow-hidden max-h-[95vh] animate-in zoom-in-95 duration-200">
        {/* Celebration Header */}
        <div className="pt-6 pb-4 px-6 text-center bg-gradient-to-b from-emerald-950/40 to-transparent">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3 border border-emerald-500/30">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>

          <span className="text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {t('success_badge')}
          </span>

          <h2 className="text-xl font-extrabold mt-1 text-white">
            {t('success_title')}
          </h2>

          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {formatRupiah(amount)}
          </div>
        </div>

        {/* Receipt Card */}
        <div className="px-6 py-2 overflow-y-auto no-scrollbar">
          <div className="p-4 rounded-2xl bg-[#141728] border border-white/10 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-indigo-400" />
                {t('receipt_title')}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {t('receipt_badge_qris')}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{t('receipt_recipient')}</span>
                <span className="font-bold text-white text-right">{merchantName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">{t('receipt_city')}</span>
                <span className="text-slate-200">{response.merchant_city || 'BANDUNG'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">{t('receipt_nmid')}</span>
                <span className="font-mono text-slate-300">{response.nmid}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">{t('receipt_time')}</span>
                <span className="text-slate-200">{new Date().toLocaleString('id-ID')}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">{t('receipt_ref')}</span>
                <span className="font-mono text-indigo-300 font-bold">{txId}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">{t('receipt_source')}</span>
                <span className="text-slate-200">{t('receipt_source_val')}</span>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="font-semibold text-slate-300">{t('receipt_remaining')}</span>
                <span className="font-bold text-emerald-400">{formatRupiah(balance)}</span>
              </div>
            </div>

            {/* ValidQR Badge */}
            <div className="p-2.5 rounded-xl bg-[#0F1E15] border border-emerald-500/30 flex items-center gap-2 text-[11px] text-emerald-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold leading-tight">{t('shield_verified_title')}</div>
                <div className="text-[10px] text-emerald-400/80 leading-tight">
                  {t('shield_verified_desc')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-[#0A0D1A] border-t border-white/10 space-y-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#8E7BFD] hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('btn_back_home')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Struk pembayaran berhasil disimpan ke perangkat!')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Struk</span>
            </button>

            <button
              onClick={() => alert('Link struk pembayaran berhasil disalin!')}
              className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
