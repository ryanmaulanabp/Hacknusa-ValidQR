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
  Sparkles,
  QrCode,
  Eye,
  Flag,
  ImageIcon,
  FileText,
  Check,
  Package,
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
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isReportingMismatch, setIsReportingMismatch] = useState(false);
  const [reportedAsMismatch, setReportedAsMismatch] = useState(false);

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

  const handleReportMismatch = async () => {
    if (!confirm('Apakah fisik toko atau barang di depan Anda benar-benar TIDAK SESUAI dengan foto database resmi? Laporan ini akan membatalkan transaksi dan dicatat ke log audit anti-fraud ValidQR.')) return;

    setIsReportingMismatch(true);
    try {
      await fetch('/api/v1/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nmid: response.nmid,
          merchant_name: response.matched_name || response.scanned_name,
          status: 'BLOCKED',
          color: 'RED',
          reason: 'SUSPECTED_FAKE_STORE',
          fuzzy_score: response.fuzzy_score,
          distance_meters: response.distance_meters,
          gps_available: response.gps_checked,
          raw_payload: payload?.rawPayload,
        }),
      });
      setReportedAsMismatch(true);
      setShowPhotoModal(false);
    } catch (err) {
      console.error('Failed to report mismatch', err);
      setReportedAsMismatch(true);
      setShowPhotoModal(false);
    } finally {
      setIsReportingMismatch(false);
    }
  };

  if (reportedAsMismatch) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4">
        <div className="w-full max-w-md bg-[#190909] rounded-t-3xl sm:rounded-3xl border border-rose-600/50 text-white shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center border border-rose-500/30">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                🚨 LAPORAN DUGAAN FRAUD DITERIMA
              </span>
              <h2 className="text-base font-black text-white mt-1">
                TRANSAKSI DIBATALKAN DEMI KEAMANAN
              </h2>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#291010] border border-rose-500/30 text-xs text-rose-200 space-y-2">
            <p className="leading-relaxed">
              Anda melaporkan bahwa <strong>foto fisik toko atau produk di hadapan Anda berbeda</strong> dengan berkas terdaftar pada sistem ValidQR untuk merchant <strong>{response.matched_name || response.scanned_name}</strong>.
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Laporan ini telah disimpan ke sistem audit keamanan anti-fraud. Pembayaran Anda dibatalkan secara aman tanpa pemotongan saldo.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>💡 Tips Pencegahan Penipuan QRIS:</span>
            </div>
            <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
              <li>Jangan melakukan transfer manual jika diarahkan ke rekening pribadi orang lain.</li>
              <li>Waspadai stiker QR yang ditempel menutupi kode QR akrilik resmi toko.</li>
              <li>Tanyakan kepada staf/pemilik toko resmi mengenai keaslian kode QR tersebut.</li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg transition-all cursor-pointer"
          >
            Tutup &amp; Batalkan Pembayaran
          </button>
        </div>
      </div>
    );
  }

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

          {/* WhatsApp Alert Notice if Blocked (Only on actual fraud attempts, not on missing GPS) */}
          {isBlocked && response.reason !== 'GPS_REQUIRED' && (
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

          {/* GPS Required Notice */}
          {response.reason === 'GPS_REQUIRED' && (
            <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-amber-300">Sinyal GPS Diperlukan:</span>
                <p className="text-slate-300 mt-0.5">
                  Sistem ValidQR mewajibkan GPS aktif pada ponsel untuk mencocokkan posisi fisik merchant. Silakan nyalakan GPS pada smartphone Anda lalu lakukan scan ulang.
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

          {/* QRIS Type & Dynamic Transaction Amount Card */}
          {response.qr_type === 'DINAMIS' && response.transaction_amount ? (
            <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-500/40 space-y-1 shadow-lg shadow-purple-950/30">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  QRIS Dinamis • Nominal Otomatis Terkunci
                </span>
                {response.invoice_number && (
                  <span className="text-[10px] font-mono text-purple-300/80">
                    {response.invoice_number}
                  </span>
                )}
              </div>
              <div className="text-2xl font-black text-white">
                Rp {Number(response.transaction_amount).toLocaleString('id-ID')}
              </div>
              <p className="text-[10px] text-purple-200/80 leading-tight">
                Nominal tagihan terkunci otomatis oleh sistem kasir resmi (Tag 54). Pembeli tidak perlu memasukkan nominal manual.
              </p>
            </div>
          ) : (
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tipe QR: <strong>QRIS Statis (Stiker Fisik Tetap)</strong></span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Input Nominal Manual</span>
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

          {/* ── Visual Store & Product Verification Card ── */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#12162A] to-[#181E38] border border-indigo-500/30 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-indigo-400" />
                <span>Verifikasi Visual Foto Toko</span>
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" /> Database Resmi
              </span>
            </div>

            {/* Thumbnail Preview Row */}
            <div className="flex items-center gap-2.5 bg-black/40 p-2 rounded-xl border border-white/5">
              <div className="relative w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-800 border border-white/10">
                {response.store_photo_url ? (
                  <img
                    src={response.store_photo_url}
                    alt="Foto Toko"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                )}
                <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-center text-slate-300 py-0.5 font-medium">
                  Toko
                </span>
              </div>

              {response.product_photo_url ? (
                <div className="relative w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-800 border border-white/10">
                  <img
                    src={response.product_photo_url}
                    alt="Foto Produk"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-center text-slate-300 py-0.5 font-medium">
                    Produk
                  </span>
                </div>
              ) : null}

              <div className="flex-1 min-w-0 pr-1">
                <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
                  {response.business_description || 'Cocokkan fisik etalase toko dan produk di depan Anda dengan foto resmi.'}
                </p>
                <span className="text-[10px] text-indigo-300 font-semibold mt-1 inline-flex items-center gap-1">
                  🔍 Cek sebelum bayar
                </span>
              </div>
            </div>

            {/* Action Buttons inside Card */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Periksa &amp; Cocokkan Fisik</span>
              </button>

              <button
                type="button"
                onClick={handleReportMismatch}
                disabled={isReportingMismatch}
                className="py-2 px-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-semibold flex items-center gap-1 transition-all shrink-0 cursor-pointer"
                title="Laporkan jika toko berbeda"
              >
                <Flag className="w-3 h-3 text-rose-400" />
                <span>Beda?</span>
              </button>
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
                    {response.reason === 'GPS_REQUIRED' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        ✗ GPS Wajib Aktif
                      </span>
                    ) : response.location_check === 'MATCH' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ✓ Dalam Radius
                      </span>
                    ) : response.location_check === 'MISMATCH' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        ✗ Melebihi Radius ({response.distance_meters}m)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        ? GPS Tidak Aktif
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {response.reason === 'GPS_REQUIRED' ? (
                      <span className="text-rose-300 font-medium">Koordinat GPS tidak tersedia pada perangkat saat pemindaian.</span>
                    ) : (
                      <>Jarak terhitung: <span className="font-bold text-white">{response.distance_meters !== null ? `${response.distance_meters} m` : 'Tidak tersedia'}</span> (Radius perimeter: {response.geofence_radius}m)</>
                    )}
                  </div>
                </div>

                {/* Layer 0 / Security Mode Policy */}
                <div className="p-2.5 rounded-xl bg-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      Kebijakan Area &amp; Mode Keamanan
                    </span>
                    {response.security_mode === 'EXCLUSIVE_STATIC' || response.security_mode === 'EXCLUSIVE_ZONE' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        🛡️ Zona Eksklusif
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        🏪 Zona Terbuka
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-snug">
                    {response.security_mode === 'EXCLUSIVE_STATIC' || response.security_mode === 'EXCLUSIVE_ZONE'
                      ? `Single-QR Lockdown aktif (Radius ±${response.geofence_radius}m). Hanya 1 QR resmi berizin (${response.matched_name || ''}) yang boleh aktif di zona ini. QR asing langsung diblokir seketika.`
                      : `Multi-QR Coexistence (Radius ±${response.geofence_radius}m). Pedagang resmi berdampingan aman bertransaksi tanpa saling memblokir.`}
                  </div>
                </div>

                {/* Tipe QRIS Spesifikasi */}
                <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <QrCode className="w-3 h-3 text-indigo-400" /> Spesifikasi Transaksi:
                  </span>
                  <span className="font-bold text-white">
                    {response.qr_type === 'DINAMIS' ? 'QRIS Dinamis (EMVCo Tag 01="12")' : 'QRIS Statis (EMVCo Tag 01="11")'}
                  </span>
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

      {/* ── Modal Inspeksi Detail Foto Fisik Toko & Produk ── */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0F1326] rounded-3xl border border-white/20 text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-white/10 bg-[#141829] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <Store className="w-4 h-4 text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Periksa Foto Fisik Toko &amp; Produk</h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    NMID: {response.nmid} • {response.matched_name || response.scanned_name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-2">
                <Eye className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <p className="leading-snug">
                  Cocokkan fisik etalase toko dan produk yang Anda lihat langsung di hadapan Anda dengan foto resmi dari database ValidQR di bawah ini sebelum menyelesaikan pembayaran.
                </p>
              </div>

              {/* Foto 1: Tempat Usaha Fisik */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-emerald-400" />
                    1. Foto Tempat Usaha / Etalase Fisik
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Tampak Depan</span>
                </div>
                <div className="w-full h-52 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 relative group">
                  {response.store_photo_url ? (
                    <img
                      src={response.store_photo_url}
                      alt="Foto Toko Resmi"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-1.5">
                      <ImageIcon className="w-8 h-8 text-slate-600" />
                      <span className="text-xs text-slate-400">Foto tempat usaha belum dilampirkan oleh penjual</span>
                    </div>
                  )}
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] text-emerald-300 font-medium">
                    ✓ Data Resmi ValidQR
                  </span>
                </div>
              </div>

              {/* Foto 2: Produk / Hal yang Dijual */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-purple-400" />
                    2. Foto Produk / Menu Jualan
                  </span>
                  <span className="text-[10px] text-purple-400 font-semibold">Barang Dagangan</span>
                </div>
                <div className="w-full h-52 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 relative group">
                  {response.product_photo_url ? (
                    <img
                      src={response.product_photo_url}
                      alt="Foto Produk Resmi"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-1.5">
                      <Package className="w-8 h-8 text-slate-600" />
                      <span className="text-xs text-slate-400">Foto katalog produk belum dilampirkan</span>
                    </div>
                  )}
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] text-purple-300 font-medium">
                    ✓ Sampel Resmi
                  </span>
                </div>
              </div>

              {/* Rincian Hal yang Dijual */}
              {response.business_description && (
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                    <FileText className="w-3 h-3 text-indigo-400" />
                    Rincian Barang Dagangan Resmi
                  </span>
                  <p className="text-xs text-white leading-relaxed">
                    {response.business_description}
                  </p>
                </div>
              )}

              {/* Checklist Keamanan */}
              <div className="p-3.5 rounded-2xl bg-[#141829] border border-white/5 space-y-2 text-xs">
                <span className="font-bold text-slate-200 block text-[11px]">
                  Panduan Keamanan Sebelum Bayar:
                </span>
                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <div className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Pastikan ciri fisik gerobak/toko/etalase di depan Anda mirip foto di atas.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Pastikan jenis barang/jasa yang Anda bayar sesuai dengan deskripsi resmi.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-rose-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>Bila stiker QR terlihat ditumpuk di atas kode lain atau kasir bukan orang resmi, jangan lanjutkan!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-white/10 bg-[#141829] flex flex-col sm:flex-row gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>✓ Fisik Toko Sesuai (Lanjut)</span>
              </button>

              <button
                type="button"
                onClick={handleReportMismatch}
                disabled={isReportingMismatch}
                className="py-3 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Flag className="w-4 h-4 text-rose-400" />
                <span>🚨 Laporkan Toko Berbeda</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
