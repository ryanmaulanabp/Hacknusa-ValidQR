'use client';

import React from 'react';
import { useApp } from '@/lib/LanguageContext';
import { DEMO_PRESETS } from '@/lib/mockData';
import {
  ShieldCheck,
  CreditCard,
  Sparkles,
  CheckCircle,
  ShieldBan,
  AlertTriangle,
  Layers,
  ArrowRight,
  Store,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

interface DesktopCompanionWidgetsProps {
  onRunPreset: (preset: any) => void;
  onOpenScanner: () => void;
}

export default function DesktopCompanionWidgets({
  onRunPreset,
  onOpenScanner,
}: DesktopCompanionWidgetsProps) {
  const { t, isDarkMode, balance } = useApp();

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Virtual NusaPay Platinum Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-tr from-[#242B4D] via-[#3B457A] to-[#6C5CE7] text-white shadow-2xl border border-white/10 space-y-6">
        <div className="absolute right-0 top-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center font-black text-xs text-white">
              NP
            </div>
            <span className="font-extrabold tracking-widest text-sm">NUSAPAY</span>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            PLATINUM
          </span>
        </div>

        {/* EMV Chip Graphic & Card Number */}
        <div>
          <div className="w-10 h-8 rounded-md bg-gradient-to-tr from-amber-300 to-amber-500 shadow-inner flex items-center justify-center mb-3 opacity-90">
            <div className="w-6 h-5 border border-amber-800/40 rounded-sm" />
          </div>
          <span className="text-[10px] text-white/70 block uppercase tracking-wider">
            Nomor Kartu Virtual
          </span>
          <div className="text-xl font-mono tracking-widest font-bold text-white mt-0.5">
            4806 •••• •••• 2026
          </div>
        </div>

        <div className="flex items-end justify-between pt-2 border-t border-white/15">
          <div>
            <span className="text-[10px] text-white/70 uppercase">Pemilik Rekening</span>
            <div className="text-xs font-bold tracking-wide">RYAN MAULANA</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-white/70 uppercase">{t('active_balance')}</span>
            <div className="text-base font-extrabold text-white">{formatRupiah(balance)}</div>
          </div>
        </div>
      </div>

      {/* Quick Testing Presets Panel (HackNusa 2026) */}
      <div
        className={`p-5 rounded-3xl border transition-all ${
          isDarkMode
            ? 'bg-[#101424] border-white/10'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Skenario Pengujian (HackNusa)
            </h3>
          </div>
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
            3-Layer Demo
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mb-3">
          Klik tombol di bawah untuk langsung menguji verifikasi engine anti-fraud tanpa harus cetak stiker fisik:
        </p>

        <div className="space-y-2">
          {/* Preset A */}
          <button
            onClick={() => onRunPreset(DEMO_PRESETS.stickerA)}
            className="w-full p-3 rounded-2xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Stiker A: Merchant Asli
                </div>
                <div className="text-[10px] text-emerald-400/80 font-mono">
                  Pak Budi · VERIFIED (Hijau)
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Preset B */}
          <button
            onClick={() => onRunPreset(DEMO_PRESETS.stickerB)}
            className="w-full p-3 rounded-2xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/30 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <ShieldBan className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                  Stiker B: Overlay Attack (Penipu)
                </div>
                <div className="text-[10px] text-rose-400/80 font-mono">
                  Jarak ~122km · BLOCKED (Merah)
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-rose-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Preset C */}
          <button
            onClick={() => onRunPreset(DEMO_PRESETS.stickerC)}
            className="w-full p-3 rounded-2xl bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/30 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  Stiker C: Rebrand Fraud
                </div>
                <div className="text-[10px] text-amber-400/80 font-mono">
                  Nama Beda · WARNING (Kuning)
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Preset E: Mode Statis Eksklusif - QR Resmi Masjid */}
          <button
            onClick={() => onRunPreset(DEMO_PRESETS.stickerMasjid)}
            className="w-full p-3 rounded-2xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/40 text-left transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <span>Stiker E: QR Resmi Masjid</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Mode Statis
                  </span>
                </div>
                <div className="text-[10px] text-emerald-400/80 font-mono">
                  Infaq Masjid · VERIFIED (Hijau)
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Preset F: Rogue QR di Area Mode Statis (Penipuan Kotak Amal) */}
          <button
            onClick={() => onRunPreset(DEMO_PRESETS.stickerFakeKotakAmal)}
            className="w-full p-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/50 text-left transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <ShieldBan className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors flex items-center gap-1.5">
                  <span>Stiker F: Penipuan Kotak Amal</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                    QR Liar
                  </span>
                </div>
                <div className="text-[10px] text-rose-400 font-mono">
                  Pelanggaran Zona Statis · BLOCKED (Merah)
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-rose-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Preset G: Mode Dinamis Berdampingan (Food Court) */}
          <button
            onClick={() => onRunPreset(DEMO_PRESETS.stickerKantinBuJoko)}
            className="w-full p-3 rounded-2xl bg-indigo-950/30 hover:bg-indigo-900/40 border border-indigo-500/30 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <span>Stiker G: Pedagang Berdampingan</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                    Mode Dinamis
                  </span>
                </div>
                <div className="text-[10px] text-indigo-400/80 font-mono">
                  Food Court (3m dr Pak Budi) · VERIFIED
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Preset H: QR Masjid Tanpa GPS (Zero-Tolerance: BLOCKED) */}
          <button
            onClick={() => onRunPreset(DEMO_PRESETS.stickerMasjidNoGps)}
            className="w-full p-3 rounded-2xl bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/30 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <span>Stiker H: QR Masjid Tanpa GPS</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                    Wajib GPS
                  </span>
                </div>
                <div className="text-[10px] text-amber-400 font-mono">
                  GPS Mati/Off · BLOCKED (Zero-Tolerance)
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      {/* Admin Shortcuts */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <Link
          href="/merchant-portal"
          className="p-3.5 rounded-2xl bg-[#101424] hover:bg-[#181B2F] border border-white/10 hover:border-indigo-500/40 transition-all flex items-center gap-2 font-bold text-white group"
        >
          <Store className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>Merchant Portal</span>
          <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
        </Link>

        <button
          onClick={onOpenScanner}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/50 hover:to-purple-600/50 border border-indigo-500/40 transition-all flex items-center gap-2 font-bold text-white"
        >
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Buka Scanner Kamera</span>
        </button>
      </div>
    </div>
  );
}
