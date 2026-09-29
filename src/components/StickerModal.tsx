'use client';

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { buildDemoPayload } from '@/lib/mockData';
import {
  X,
  Download,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: {
    id?: number;
    nmid: string;
    name: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    qrDataUrl?: string;
    rawPayload?: string;
    hasConflict?: boolean;
    wa_number?: string | null;
  } | null;
}

export default function StickerModal({ isOpen, onClose, merchant }: StickerModalProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const stickerCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen || !merchant) return;

    // Fire subtle celebration confetti on sticker view
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });

    const generateQR = async () => {
      if (merchant.qrDataUrl) {
        setQrUrl(merchant.qrDataUrl);
        return;
      }

      const payload =
        merchant.rawPayload ||
        buildDemoPayload(merchant.nmid, merchant.name, merchant.city || 'BANDUNG');

      try {
        const url = await QRCode.toDataURL(payload, {
          width: 480,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
        setQrUrl(url);
      } catch (err) {
        console.error('QR generation error:', err);
      }
    };

    generateQR();
  }, [isOpen, merchant]);

  if (!isOpen || !merchant) return null;

  const handleCopyPayload = () => {
    const payload =
      merchant.rawPayload ||
      buildDemoPayload(merchant.nmid, merchant.name, merchant.city || 'BANDUNG');
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md my-auto bg-[#0E1122] rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-white/10 bg-[#12162A]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Stiker Resmi QRIS Merchant</h2>
              <p className="text-[10px] text-slate-400">Siap cetak &amp; terproteksi ValidQR Geofence</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content / Sticker Preview Area */}
        <div className="p-6 flex flex-col items-center justify-center space-y-4">
          {merchant.hasConflict && (
            <div className="w-full p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Simulasi Rebrand:</strong> NMID ini memiliki beberapa pendaftaran merchant aktif.
              </span>
            </div>
          )}

          {/* Printable Official QRIS Physical Card */}
          <div
            ref={stickerCardRef}
            className="w-full max-w-[320px] bg-white text-slate-900 rounded-3xl p-5 shadow-2xl border-4 border-slate-200 text-center select-none"
          >
            {/* Top Red Bar: Official QRIS Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
              <div className="text-left">
                <span className="text-2xl font-black tracking-tighter text-[#D63031]">QRIS</span>
                <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-tight">
                  Pembayaran Nasional
                </span>
              </div>
              <div className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[9px] font-extrabold tracking-wider">
                GPN
              </div>
            </div>

            {/* Merchant Info */}
            <div className="my-3 space-y-0.5">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight line-clamp-1">
                {merchant.name}
              </h3>
              <div className="text-[10px] font-mono font-bold text-slate-500">
                NMID: <span className="text-indigo-600 font-extrabold">{merchant.nmid}</span>
              </div>
              <div className="text-[9px] text-slate-400 font-semibold uppercase">
                {merchant.city || 'BANDUNG'} • INDONESIA
              </div>
            </div>

            {/* Scannable QR Code */}
            <div className="p-2 bg-white rounded-2xl border-2 border-slate-200 inline-block shadow-sm">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt={`QRIS ${merchant.name}`}
                  className="w-56 h-56 mx-auto object-contain"
                />
              ) : (
                <div className="w-56 h-56 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400 animate-pulse">
                  Membuat QR Code...
                </div>
              )}
            </div>

            {/* Geofence Shield Badge */}
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>ValidQR Geofence: Radius 15m</span>
              </div>

              {merchant.latitude && merchant.longitude && (
                <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400 font-mono">
                  <MapPin className="w-2.5 h-2.5 text-slate-400" />
                  <span>
                    {Number(merchant.latitude).toFixed(6)}, {Number(merchant.longitude).toFixed(6)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-[320px] space-y-2 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={qrUrl}
                download={`QRIS_${merchant.name.replace(/\s+/g, '_')}_${merchant.nmid}.png`}
                className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PNG</span>
              </a>

              <button
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / Print</span>
              </button>
            </div>

            <button
              onClick={handleCopyPayload}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-[11px] flex items-center justify-center gap-1.5 border border-white/5 transition-all"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
              <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Raw EMVCo Payload (Untuk Tes)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
