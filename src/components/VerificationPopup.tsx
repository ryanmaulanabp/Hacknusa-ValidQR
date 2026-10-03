'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/LanguageContext';
import { ScanResponse, QrPayload } from '@/lib/types';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldBan,
  MapPin,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Send,
  ArrowRight,
  X,
  Lock,
  Store,
} from 'lucide-react';

interface VerificationPopupProps {
  response: ScanResponse | null;
  payload: QrPayload | null;
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export default function VerificationPopup({
  response,
  payload,
  isOpen,
  onClose,
  onProceed,
}: VerificationPopupProps) {
  const { t } = useApp();
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(true);

  if (!isOpen || !response) return null;

  const isExclusiveViolation = response.reason === 'EXCLUSIVE_ZONE_VIOLATION';
  const isGpsRequired = response.reason === 'GPS_REQUIRED_FOR_EXCLUSIVE_ZONE' || response.reason === 'GPS_REQUIRED';
  const isBlocked =
    isExclusiveViolation ||
    isGpsRequired ||
    response.status === 'BLOCKED' ||
    response.status === 'HARD_BLOCK' ||
    response.color.toUpperCase() === 'RED' ||
    response.location_check === 'MISMATCH';

  const isGpsSkipped = response.location_check === 'SKIPPED' && !isGpsRequired;
  const isFuzzyWarn = response.fuzzy_score < 100;
  const isWarning = !isBlocked && (response.status === 'REBRAND_WARNING' || response.status === 'SOFT_WARNING' || isGpsSkipped);
  const isVerified = !isBlocked && !isWarning;
  const isExclusiveVerified = isVerified && response.security_mode === 'EXCLUSIVE_STATIC';

  // Visual Theme Configuration
  const theme = isBlocked
    ? {
        bg: 'bg-[#190909]',
        cardBg: 'bg-[#291010]',
        border: 'border-rose-600/40',
        textPrimary: 'text-rose-400',
        accentBtn: 'bg-rose-600 hover:bg-rose-700 text-white',
        iconBg: 'bg-rose-500/20 text-rose-500',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        kicker: isExclusiveViolation
          ? '🚨 ZERO-TOLERANCE PERIMETER'
          : isGpsRequired
          ? '📍 GPS WAJIB AKTIF'
          : t('kicker_blocked'),
        title: isExclusiveViolation
          ? 'TRANSAKSI DITOLAK: QR LIAR / TIDAK SAH'
          : isGpsRequired
          ? 'PEMBAYARAN DITOLAK: GPS WAJIB AKTIF'
          : !response.nmid_valid
          ? t('title_unregistered')
          : t('title_blocked'),
        subtitle: isExclusiveViolation
          ? `Area ini menerapkan isolasi mutlak (Zero-Tolerance). Semua QR lain di sekitar area ${response.matched_name || 'Statis Eksklusif'} dilarang bertransaksi dan diblokir total!`
          : isGpsRequired
          ? response.reason === 'GPS_REQUIRED_FOR_EXCLUSIVE_ZONE'
            ? `Area ${response.matched_name || 'Statis Eksklusif'} menerapkan kebijakan Zero-Tolerance. GPS aktif dan akurat wajib disertakan untuk memvalidasi keberadaan fisik pembeli di lokasi resmi.`
            : 'Sistem anti-fraud ValidQR mewajibkan GPS aktif pada perangkat Anda untuk memvalidasi keberadaan fisik merchant demi mencegah penipuan QRIS.'
          : !response.nmid_valid
          ? t('sub_unregistered')
          : t('sub_blocked_overlay'),
        icon: isGpsRequired ? MapPin : ShieldBan,
      }
    : isWarning
    ? {
        bg: 'bg-[#1A1608]',
        cardBg: 'bg-[#2B230D]',
        border: 'border-amber-600/40',
        textPrimary: 'text-amber-400',
        accentBtn: 'bg-amber-500 hover:bg-amber-600 text-black font-bold',
        iconBg: 'bg-amber-500/20 text-amber-400',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        kicker: isGpsSkipped
          ? isFuzzyWarn
            ? t('kicker_name_diff_unverified')
            : t('kicker_unverified_loc')
          : t('kicker_name_mismatch'),
        title: isGpsSkipped
          ? isFuzzyWarn
            ? t('title_name_loc_unverified')
            : t('title_loc_unverified')
          : t('title_name_diff'),
        subtitle: isGpsSkipped ? t('sub_gps_skipped') : t('sub_name_diff'),
        icon: AlertTriangle,
      }
    : {
        bg: isExclusiveVerified ? 'bg-[#061814]' : 'bg-[#091A0E]',
        cardBg: isExclusiveVerified ? 'bg-[#0B251F]' : 'bg-[#102B19]',
        border: isExclusiveVerified ? 'border-teal-500/50' : 'border-emerald-600/40',
        textPrimary: isExclusiveVerified ? 'text-teal-300' : 'text-emerald-400',
        accentBtn: isExclusiveVerified
          ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:opacity-90 text-white'
          : 'bg-emerald-600 hover:bg-emerald-700 text-white',
        iconBg: isExclusiveVerified ? 'bg-teal-500/20 text-teal-300' : 'bg-emerald-500/20 text-emerald-400',
        badgeBg: isExclusiveVerified
          ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        kicker: isExclusiveVerified ? '🛡️ ZONA STATIS EKSKLUSIF TERPROTEKSI' : t('kicker_verified'),
        title: isExclusiveVerified ? 'MERCHANT RESMI TERKUNCI' : t('title_verified'),
        subtitle: isExclusiveVerified
          ? 'Single-QR Lockdown aktif. QR resmi terverifikasi dan dilindungi dari stiker liar.'
          : t('sub_verified'),
        icon: ShieldCheck,
      };

  const IconComponent = theme.icon;

  const fuzzyColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div
        className={`w-full max-w-md ${theme.bg} rounded-t-3xl sm:rounded-3xl border ${theme.border} text-white shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300`}
      >
        {/* Top Handle / Close Bar */}
        <div className="pt-3 px-5 flex items-center justify-between">
          <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto sm:hidden" />
          <button
            onClick={onClose}
            className="hidden sm:flex ml-auto p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-5 pt-3 pb-6 overflow-y-auto no-scrollbar space-y-4">
          {/* Main Status Header */}
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl ${theme.iconBg} flex items-center justify-center shrink-0 shadow-lg`}>
              <IconComponent className="w-8 h-8" />
            </div>

            <div>
              <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full border ${theme.badgeBg}`}>
                {theme.kicker}
              </span>
              <h2 className="text-lg font-extrabold mt-1 text-white leading-tight">
                {theme.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-snug">
                {theme.subtitle}
              </p>
            </div>
          </div>

          {/* WhatsApp Alert Notice if Blocked */}
          {isBlocked && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-2.5">
              <Send className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-emerald-400">WhatsApp Alert Terkirim:</span>
                <p className="text-slate-300 mt-0.5">
                  Notifikasi fraud otomatis dikirimkan ke nomor WhatsApp merchant terdaftar untuk segera memeriksa fisik stiker QRIS di lokasi.
                </p>
              </div>
            </div>
          )}

          {/* Detailed Geofence Distance Context */}
          {isBlocked && response.distance_meters !== null && response.distance_meters > 15 && (
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 space-y-1.5">
              <div className="font-extrabold text-white flex items-center gap-1.5 text-xs">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  Jarak ke Toko: {response.distance_meters >= 1000 ? `${(response.distance_meters / 1000).toFixed(2)} km (${response.distance_meters} m)` : `${response.distance_meters} meter`}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Toko <strong className="text-white">{response.matched_name || response.scanned_name}</strong> terdaftar di lokasi berjarak <strong>{response.distance_meters >= 1000 ? `${(response.distance_meters / 1000).toFixed(2)} km` : `${response.distance_meters} meter`}</strong> dari posisi Anda saat ini (batas toleransi kasir: {response.geofence_radius}m).
              </p>
              <div className="text-[10px] text-rose-300/80 pt-1 border-t border-rose-500/20">
                💡 <em>Catatan: Angka {response.distance_meters}m ini adalah <strong>jarak fisik sebenarnya</strong> antara posisi Anda dengan toko terdaftar, bukan kesalahan bacaan sensor GPS.</em>
              </div>
            </div>
          )}

          {/* Scanned Merchant Card */}
          <div className={`p-4 rounded-2xl ${theme.cardBg} border border-white/10 space-y-2`}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Merchant Terdeteksi</span>
              <span className="font-mono text-[11px] text-slate-400">NMID: {response.nmid}</span>
            </div>

            <div className="text-base font-bold text-white">
              {response.scanned_name || payload?.merchantName || 'Merchant QRIS'}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1 border-t border-white/10">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>{response.merchant_city || 'BANDUNG'}</span>
              <span>•</span>
              <span className="text-emerald-400">ValidQR Protected</span>
            </div>
          </div>

          {/* Verification Details Collapsible */}
          <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/30">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              <span>{t('header_detail')} (3-LAYER ENGINE)</span>
              {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showTechnicalDetails && (
              <div className="px-4 pb-4 pt-1 space-y-3 text-xs border-t border-white/5">
                {/* Layer 1: NMID Cross-Validation */}
                <div className="p-2.5 rounded-xl bg-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      Layer 1: NMID Cross-Validation
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ✓ Terdaftar Resmi
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    NMID dicocokkan ke database otoritas: <span className="font-mono text-white">{response.nmid}</span>
                  </div>
                </div>

                {/* Layer 2: Hybrid Fuzzy Name Matching */}
                <div className="p-2.5 rounded-xl bg-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Layer 2: Hybrid Fuzzy Match
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${fuzzyColor(response.fuzzy_score)}`}>
                      {response.fuzzy_score}% Skor
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-black/40 p-2 rounded-lg font-mono">
                    <div>
                      <div className="text-slate-500 text-[9px] uppercase">Scan Stiker</div>
                      <div className="text-white truncate font-medium">{response.scanned_name}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[9px] uppercase">Database Resmi</div>
                      <div className="text-emerald-300 truncate font-medium">{response.matched_name}</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400">
                    Algoritma: Levenshtein (40%) + Token Overlap (60%)
                  </div>
                </div>

                {/* Layer 3: GPS Geofence Check */}
                <div className="p-2.5 rounded-xl bg-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Layer 3: GPS Geofencing (±{response.geofence_radius}m)
                    </span>
                    {response.location_check === 'MATCH' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ✓ Dalam Radius
                      </span>
                    ) : response.location_check === 'MISMATCH' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        ✗ Melebihi Radius ({response.distance_meters}m)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        ? GPS Skipped
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Jarak terhitung: <span className="font-bold text-white">{response.distance_meters !== null ? `${response.distance_meters} m` : 'Tidak tersedia'}</span> (Radius perimeter: {response.geofence_radius}m)
                  </div>
                </div>

                {/* Layer 0 / Security Mode Policy */}
                <div className="p-2.5 rounded-xl bg-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      Kebijakan Area &amp; Mode Keamanan
                    </span>
                    {response.security_mode === 'EXCLUSIVE_STATIC' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        🛡️ Statis Eksklusif
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        🏪 Dinamis UMKM
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-snug">
                    {response.security_mode === 'EXCLUSIVE_STATIC'
                      ? `Single-QR Lockdown aktif (Radius ±${response.geofence_radius}m). Hanya QR resmi ${response.matched_name || ''} yang diizinkan beroperasi di lokasi ini.`
                      : `Multi-QR Coexistence (Radius ±${response.geofence_radius}m). Pedagang resmi berdekatan aman bertransaksi tanpa saling memblokir.`}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="p-4 bg-[#0A0D1A] border-t border-white/10 flex flex-col gap-2">
          {!isBlocked ? (
            <>
              <button
                onClick={onProceed}
                className={`w-full py-3.5 px-4 rounded-xl ${theme.accentBtn} font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]`}
              >
                <span>{isWarning ? t('btn_proceed_warning') : t('btn_proceed')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
              >
                {t('btn_close')}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
            >
              <span>{t('btn_close')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
