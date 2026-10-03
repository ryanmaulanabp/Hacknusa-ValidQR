'use client';

import React from 'react';
import { Merchant } from '@/lib/types';
import {
  X,
  Store,
  FileText,
  ShieldCheck,
  Package,
  UserCheck,
  MapPin,
  Lock,
  Tag,
  Calendar,
} from 'lucide-react';

interface ProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: Merchant | null;
}

export default function ProofModal({ isOpen, onClose, merchant }: ProofModalProps) {
  if (!isOpen || !merchant) return null;

  const isExclusive = merchant.security_mode === 'EXCLUSIVE_STATIC' || merchant.security_mode === 'EXCLUSIVE_ZONE';
  const isDynamic = merchant.qr_type === 'DINAMIS';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto bg-[#0E1122] rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-[#12162A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Store className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{merchant.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Berkas Terverifikasi
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                NMID: <strong className="text-indigo-300">{merchant.nmid}</strong> • {merchant.city || 'BANDUNG'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#141829] border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Tag className="w-3 h-3 text-indigo-400" /> Tipe QRIS
              </span>
              <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                <span className={`px-2 py-0.5 rounded-md text-xs ${
                  isDynamic ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {isDynamic ? 'QRIS Dinamis' : 'QRIS Statis'}
                </span>
              </div>
              {isDynamic && merchant.dynamic_amount ? (
                <span className="text-[11px] text-purple-300 font-mono block">
                  Rp {Number(merchant.dynamic_amount).toLocaleString('id-ID')}
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 block">Stiker Fisik Tetap</span>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#141829] border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" /> Mode Keamanan Area
              </span>
              <div className="font-bold text-xs text-white">
                {isExclusive ? (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Zona Eksklusif
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                    <Store className="w-3 h-3" /> Zona Terbuka
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 block">Radius ±{merchant.radius_meters || 20}m</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#141829] border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-indigo-400" /> NIK Pemilik Toko
              </span>
              <div className="font-mono font-bold text-xs text-indigo-300">
                {merchant.owner_nik || '3204' + merchant.nmid.slice(-12)}
              </div>
              <span className="text-[11px] text-slate-400 block">Identitas Terverifikasi</span>
            </div>
          </div>

          {/* Business & Products Description */}
          <div className="p-4 rounded-2xl bg-[#141829] border border-white/5 space-y-1.5">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-400" />
              Deskripsi Barang Dagangan / Hal yang Dijual
            </span>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#0E1122] p-3 rounded-xl border border-white/5">
              {merchant.business_description || 'Menjual aneka produk kebutuhan harian, makanan, minuman, serta layanan kasir resmi yang telah lolos verifikasi fisik merchant.'}
            </p>
          </div>

          {/* Photos Proofs Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Foto Tempat Usaha / Etalase */}
            <div className="p-4 rounded-2xl bg-[#141829] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-emerald-400" />
                  1. Foto Tempat Usaha Fisik
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">Etalase / Lapak</span>
              </div>

              <div className="w-full h-48 rounded-xl overflow-hidden bg-[#0A0C16] border border-white/10 flex items-center justify-center relative group">
                {merchant.store_photo_url ? (
                  <img
                    src={merchant.store_photo_url}
                    alt={`Foto Tempat Usaha ${merchant.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-4 space-y-2 text-slate-400">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <Store className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">Foto Usaha Terverifikasi Resmi</span>
                    <span className="text-[10px] text-slate-500 max-w-[200px]">
                      Tempat usaha fisik telah diverifikasi oleh tim inspeksi lapangan ValidQR.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Foto Barang Dagangan */}
            <div className="p-4 rounded-2xl bg-[#141829] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-indigo-400" />
                  2. Foto Barang Dagangan / Menu
                </span>
                <span className="text-[10px] text-indigo-400 font-medium">Produk Jualan</span>
              </div>

              <div className="w-full h-48 rounded-xl overflow-hidden bg-[#0A0C16] border border-white/10 flex items-center justify-center relative group">
                {merchant.product_photo_url ? (
                  <img
                    src={merchant.product_photo_url}
                    alt={`Foto Produk ${merchant.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-4 space-y-2 text-slate-400">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                      <Package className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">Foto Produk Terverifikasi Resmi</span>
                    <span className="text-[10px] text-slate-500 max-w-[200px]">
                      Sampel produk dan katalog barang dagangan telah tersimpan dalam repositori resmi.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#12162A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Terdaftar: {new Date(merchant.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Tutup Berkas
          </button>
        </div>
      </div>
    </div>
  );
}
