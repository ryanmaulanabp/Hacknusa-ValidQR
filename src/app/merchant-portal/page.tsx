'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Merchant } from '@/lib/types';
import { SELARU_LAT, SELARU_LON, JAKARTA_LAT, JAKARTA_LON } from '@/lib/mockData';
import StickerModal from '@/components/StickerModal';
import {
  Store,
  ArrowLeft,
  Plus,
  Trash2,
  QrCode,
  Download,
  AlertTriangle,
  CheckCircle,
  MapPin,
  RefreshCw,
  Eye,
  Sparkles,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

// Dynamically import Leaflet LocationPickerMap with SSR disabled
const LocationPickerMap = dynamic(() => import('@/components/LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] rounded-2xl bg-[#181B2F] border border-white/10 animate-pulse flex flex-col items-center justify-center text-xs text-slate-400 gap-2">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      <span>Memuat Peta Interaktif Leaflet...</span>
    </div>
  ),
});

export default function MerchantPortalPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const mapSectionRef = useRef<HTMLDivElement | null>(null);

  // Read-only viewing mode state for existing merchants
  const [viewingMerchant, setViewingMerchant] = useState<Merchant | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [city, setCity] = useState('BANDUNG');
  const [nmid, setNmid] = useState('');
  const [latitude, setLatitude] = useState(SELARU_LAT);
  const [longitude, setLongitude] = useState(SELARU_LON);
  const [waNumber, setWaNumber] = useState('6281234567890');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sticker Modal State
  const [selectedStickerMerchant, setSelectedStickerMerchant] = useState<{
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
  } | null>(null);

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/merchants');
      const data = await res.json();
      if (data.success) {
        setMerchants(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const handleSelectMerchantToView = (m: Merchant) => {
    setViewingMerchant(m);
    setName(m.name);
    setCity(m.city || 'BANDUNG');
    setNmid(m.nmid);
    setLatitude(Number(m.latitude));
    setLongitude(Number(m.longitude));
    setWaNumber(m.wa_number || '6281234567890');
    // Scroll smoothly to map container
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleResetToCreate = () => {
    setViewingMerchant(null);
    setName('');
    setCity('BANDUNG');
    setNmid('');
    setLatitude(SELARU_LAT);
    setLongitude(SELARU_LON);
    setWaNumber('6281234567890');
  };

  const handleGenerateSticker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert('Nama merchant wajib diisi');

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/v1/merchants/generate-sticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          city,
          nmid: nmid.trim() || undefined,
          latitude: Number(latitude),
          longitude: Number(longitude),
          wa_number: waNumber.trim() || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Tampilkan modal stiker secara instan dengan animasi confetti
        setSelectedStickerMerchant({
          id: data.id,
          nmid: data.nmid,
          name: data.name,
          city: data.city,
          latitude: Number(latitude),
          longitude: Number(longitude),
          qrDataUrl: data.qrDataUrl,
          rawPayload: data.rawPayload,
          hasConflict: data.hasConflict,
        });
        fetchMerchants();
      } else {
        alert(`Gagal: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMerchant = async (id: number) => {
    if (!confirm('Yakin ingin menghapus merchant ini?')) return;
    try {
      const res = await fetch(`/api/v1/merchants/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchMerchants();
      } else {
        alert(`Gagal menghapus: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  // Check which NMIDs have conflicts (> 1 record with same NMID)
  const nmidCounts = merchants.reduce((acc, m) => {
    acc[m.nmid] = (acc[m.nmid] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-[#070913] text-white p-4 md:p-8">
      {/* Pop-up Stiker QRIS Resmi */}
      <StickerModal
        isOpen={!!selectedStickerMerchant}
        onClose={() => setSelectedStickerMerchant(null)}
        merchant={selectedStickerMerchant}
      />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-400" />
                <h1 className="text-2xl font-extrabold">ValidQR Merchant Portal</h1>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pilih lokasi merchant dengan Leaflet, generate stiker QRIS, dan kelola database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-semibold text-xs border border-indigo-500/40 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <QrCode className="w-4 h-4" />
              <span>Buka Mobile App Scanner</span>
            </Link>

            <button
              onClick={fetchMerchants}
              disabled={loading}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Form Generator & Interactive Map */}
        <div ref={mapSectionRef} className="p-6 rounded-3xl bg-[#101424] border border-white/10 space-y-6 scroll-mt-6">
          {/* Banner Mode Lihat Lokasi (Read-Only) */}
          {viewingMerchant && (
            <div className="p-4 rounded-2xl bg-indigo-950/70 border border-indigo-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30 shrink-0">
                  <MapPin className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Mode Lihat Lokasi GPS Merchant</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Read-Only (Terkunci)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Menampilkan titik GPS real-time &amp; perimeter Geofence 20m untuk <strong className="text-white">{viewingMerchant.name}</strong> ({Number(viewingMerchant.latitude).toFixed(6)}, {Number(viewingMerchant.longitude).toFixed(6)}).
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedStickerMerchant({
                      id: viewingMerchant.id,
                      nmid: viewingMerchant.nmid,
                      name: viewingMerchant.name,
                      city: viewingMerchant.city,
                      latitude: Number(viewingMerchant.latitude),
                      longitude: Number(viewingMerchant.longitude),
                      wa_number: viewingMerchant.wa_number,
                    })
                  }
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Buka Stiker QRIS</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetToCreate}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tambah Merchant Baru</span>
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {viewingMerchant ? (
                  <>
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Lokasi GPS Realtime: {viewingMerchant.name}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Registrasi Merchant &amp; Generate Stiker QRIS</span>
                  </>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {viewingMerchant
                  ? 'Titik GPS dan radius toleransi geofence 20 meter ditampilkan secara realtime pada peta di bawah (read-only).'
                  : 'Titik GPS yang Anda pilih pada peta di bawah akan menjadi batas perimeter geofence 20 meter'}
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerateSticker} className="space-y-5 text-xs">
            {/* Merchant Identity Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1.5 font-semibold">Nama Merchant *</label>
                <input
                  type="text"
                  required
                  disabled={!!viewingMerchant}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Contoh: WARUNG BAKSO PAK BUDI"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#181B2F] border ${
                    viewingMerchant
                      ? 'border-white/5 text-slate-400 cursor-not-allowed opacity-80'
                      : 'border-white/10 text-white focus:border-indigo-500'
                  } text-xs focus:outline-none`}
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-semibold">Kota Merchant</label>
                <input
                  type="text"
                  disabled={!!viewingMerchant}
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="BANDUNG"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#181B2F] border ${
                    viewingMerchant
                      ? 'border-white/5 text-slate-400 cursor-not-allowed opacity-80'
                      : 'border-white/10 text-white focus:border-indigo-500'
                  } text-xs focus:outline-none`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1.5 font-semibold">
                  NMID (Kosongkan untuk generate otomatis / isi untuk uji Rebrand)
                </label>
                <input
                  type="text"
                  disabled={!!viewingMerchant}
                  value={nmid}
                  onChange={e => setNmid(e.target.value)}
                  placeholder="Contoh: ID10293847561"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#181B2F] border ${
                    viewingMerchant
                      ? 'border-white/5 text-slate-400 cursor-not-allowed opacity-80'
                      : 'border-white/10 text-white focus:border-indigo-500'
                  } font-mono text-xs focus:outline-none`}
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-semibold">Nomor WhatsApp Alert (Anti-Fraud)</label>
                <input
                  type="text"
                  disabled={!!viewingMerchant}
                  value={waNumber}
                  onChange={e => setWaNumber(e.target.value)}
                  placeholder="6281234567890"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#181B2F] border ${
                    viewingMerchant
                      ? 'border-white/5 text-slate-400 cursor-not-allowed opacity-80'
                      : 'border-white/10 text-white focus:border-indigo-500'
                  } text-xs focus:outline-none`}
                />
              </div>
            </div>

            {/* ── Leaflet Interactive Map Picker ── */}
            <div className="space-y-2 pt-2">
              <label className="block text-slate-300 font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  {viewingMerchant
                    ? `Lokasi GPS Terdaftar (Geofence 20m • Read-Only)`
                    : `Pilih Lokasi Merchant pada Peta (Leaflet Geofence 20m)`}
                </span>
                {viewingMerchant && (
                  <span className="text-[10px] text-emerald-300 font-normal flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Peta Terkunci
                  </span>
                )}
              </label>

              <LocationPickerMap
                latitude={latitude}
                longitude={longitude}
                onChange={(lat, lon) => {
                  if (viewingMerchant) return;
                  setLatitude(lat);
                  setLongitude(lon);
                }}
                height="320px"
                geofenceRadius={20}
                merchantName={name || 'Merchant'}
                readOnly={!!viewingMerchant}
                hideOverlays={!!selectedStickerMerchant}
              />

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="block text-[10px] text-slate-400 mb-1 font-mono">Latitude Terpilih</span>
                  <input
                    type="number"
                    step="any"
                    disabled={!!viewingMerchant}
                    value={latitude}
                    onChange={e => setLatitude(parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 rounded-xl bg-[#181B2F] border ${
                      viewingMerchant
                        ? 'border-white/5 text-slate-400 cursor-not-allowed opacity-80'
                        : 'border-white/10 text-white focus:border-indigo-500'
                    } font-mono text-xs focus:outline-none`}
                  />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 mb-1 font-mono">Longitude Terpilih</span>
                  <input
                    type="number"
                    step="any"
                    disabled={!!viewingMerchant}
                    value={longitude}
                    onChange={e => setLongitude(parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 rounded-xl bg-[#181B2F] border ${
                      viewingMerchant
                        ? 'border-white/5 text-slate-400 cursor-not-allowed opacity-80'
                        : 'border-white/10 text-white focus:border-indigo-500'
                    } font-mono text-xs focus:outline-none`}
                  />
                </div>
              </div>
            </div>

            {/* Submit / Action Buttons */}
            <div className="pt-2">
              {viewingMerchant ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedStickerMerchant({
                        id: viewingMerchant.id,
                        nmid: viewingMerchant.nmid,
                        name: viewingMerchant.name,
                        city: viewingMerchant.city,
                        latitude: Number(viewingMerchant.latitude),
                        longitude: Number(viewingMerchant.longitude),
                        wa_number: viewingMerchant.wa_number,
                      })
                    }
                    className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Lihat / Cetak Stiker QRIS</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToCreate}
                    className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Buat Merchant Baru</span>
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6C5CE7] to-[#8E7BFD] hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Sedang Membuat Stiker QRIS...</span>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4" />
                      <span>Generate &amp; Tampilkan Stiker QRIS</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Merchants Database Table */}
        <div className="p-6 rounded-3xl bg-[#101424] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Daftar Merchant Terdaftar ({merchants.length})</h2>
              <p className="text-xs text-slate-400">
                Klik baris merchant mana saja untuk melihat titik lokasi GPS di peta secara realtime (Read-Only)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">NMID</th>
                  <th className="py-2.5 px-3">Nama Merchant</th>
                  <th className="py-2.5 px-3">Kota</th>
                  <th className="py-2.5 px-3">Koordinat (Lat, Lon)</th>
                  <th className="py-2.5 px-3">Geofence</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {merchants.map(m => {
                  const hasConflict = nmidCounts[m.nmid] > 1;
                  const isSelected = viewingMerchant?.id === m.id;

                  return (
                    <tr
                      key={m.id}
                      onClick={() => handleSelectMerchantToView(m)}
                      className={`cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-950/60 border-l-4 border-indigo-500'
                          : 'hover:bg-white/5'
                      } ${hasConflict ? 'bg-amber-950/20' : ''}`}
                    >
                      <td className="py-3 px-3 font-mono text-slate-400">{m.id}</td>
                      <td className="py-3 px-3 font-mono font-bold text-indigo-300">
                        {m.nmid}
                        {hasConflict && (
                          <span className="block text-[9px] text-amber-400 font-normal">
                            ⚠ Rebrand Conflict
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-semibold text-white">
                          <span>{m.name}</span>
                          {isSelected && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Aktif di Peta
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{m.city || 'BANDUNG'}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                        {Number(m.latitude).toFixed(5)}, {Number(m.longitude).toFixed(5)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>±20m</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Tombol Lihat Lokasi GPS Realtime */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectMerchantToView(m);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg font-semibold text-[11px] border flex items-center gap-1 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                                : 'bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30'
                            }`}
                            title="Tampilkan Titik GPS di Peta (Read-Only)"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>{isSelected ? 'Sedang Dilihat' : 'Lokasi GPS'}</span>
                          </button>

                          {/* Tombol Lihat Stiker QRIS */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStickerMerchant({
                                id: m.id,
                                nmid: m.nmid,
                                name: m.name,
                                city: m.city,
                                latitude: Number(m.latitude),
                                longitude: Number(m.longitude),
                                hasConflict,
                                wa_number: m.wa_number,
                              });
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-semibold text-[11px] border border-indigo-500/30 flex items-center gap-1 transition-all cursor-pointer"
                            title="Lihat / Cetak Stiker QRIS"
                          >
                            <QrCode className="w-3 h-3" />
                            <span>Stiker</span>
                          </button>

                          {/* Tombol Hapus */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMerchant(m.id);
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                            title="Hapus Merchant"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
