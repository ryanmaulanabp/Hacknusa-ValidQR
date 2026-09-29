'use client';

import React, { useEffect, useState } from 'react';
import { Merchant } from '@/lib/types';
import { SELARU_LAT, SELARU_LON, JAKARTA_LAT, JAKARTA_LON } from '@/lib/mockData';
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
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import Link from 'next/link';

export default function MerchantPortalPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [city, setCity] = useState('BANDUNG');
  const [nmid, setNmid] = useState('');
  const [latitude, setLatitude] = useState(SELARU_LAT.toString());
  const [longitude, setLongitude] = useState(SELARU_LON.toString());
  const [waNumber, setWaNumber] = useState('6281234567890');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedSticker, setGeneratedSticker] = useState<{
    qrDataUrl: string;
    nmid: string;
    name: string;
    hasConflict: boolean;
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
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          wa_number: waNumber.trim() || null,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedSticker({
          qrDataUrl: data.qrDataUrl,
          nmid: data.nmid,
          name: data.name,
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
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
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
                Kelola data merchant resmi, generate stiker QRIS, dan simulasikan konflik rebrand
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-semibold text-xs border border-indigo-500/40 flex items-center gap-1.5 transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Buka Mobile App Scanner</span>
            </Link>

            <button
              onClick={fetchMerchants}
              disabled={loading}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Top Grid: Form Generator & Sticker Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form */}
          <div className="md:col-span-2 p-6 rounded-3xl bg-[#101424] border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Registrasi Merchant & Generate Stiker QRIS
            </h2>

            <form onSubmit={handleGenerateSticker} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nama Merchant *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Contoh: WARUNG BAKSO PAK BUDI"
                    className="w-full px-3 py-2 rounded-xl bg-[#181B2F] border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Kota Merchant</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="BANDUNG"
                    className="w-full px-3 py-2 rounded-xl bg-[#181B2F] border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    NMID (Kosongkan untuk acak / isi untuk tes Rebrand)
                  </label>
                  <input
                    type="text"
                    value={nmid}
                    onChange={e => setNmid(e.target.value)}
                    placeholder="Contoh: ID10293847561"
                    className="w-full px-3 py-2 rounded-xl bg-[#181B2F] border border-white/10 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nomor WhatsApp Alert</label>
                  <input
                    type="text"
                    value={waNumber}
                    onChange={e => setWaNumber(e.target.value)}
                    placeholder="6281234567890"
                    className="w-full px-3 py-2 rounded-xl bg-[#181B2F] border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Coordinates & Quick Preset Buttons */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-400 font-semibold">Koordinat GPS Geofence</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLatitude(SELARU_LAT.toString());
                        setLongitude(SELARU_LON.toString());
                      }}
                      className="text-[10px] text-indigo-400 hover:underline"
                    >
                      Preset: Gedung Selaru
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setLatitude(JAKARTA_LAT.toString());
                        setLongitude(JAKARTA_LON.toString());
                      }}
                      className="text-[10px] text-rose-400 hover:underline"
                    >
                      Preset: Jakarta Pusat
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={latitude}
                    onChange={e => setLatitude(e.target.value)}
                    placeholder="Latitude"
                    className="w-full px-3 py-2 rounded-xl bg-[#181B2F] border border-white/10 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={longitude}
                    onChange={e => setLongitude(e.target.value)}
                    placeholder="Longitude"
                    className="w-full px-3 py-2 rounded-xl bg-[#181B2F] border border-white/10 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6C5CE7] to-[#8E7BFD] hover:opacity-95 text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {isSubmitting ? (
                  <span>Menyimpan & Membuat QR...</span>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    <span>Generate & Simpan Stiker QRIS</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Generated Sticker Preview */}
          <div className="p-6 rounded-3xl bg-[#101424] border border-white/10 flex flex-col items-center justify-center text-center">
            {generatedSticker ? (
              <div className="space-y-3 w-full">
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Stiker Berhasil Dibuat!
                </div>

                {generatedSticker.hasConflict && (
                  <div className="p-2 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-300 text-[10px] flex items-center gap-1.5 text-left">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Perhatian: NMID ini memiliki beberapa record aktif (Simulasi Rebrand)!</span>
                  </div>
                )}

                <div className="bg-white p-3 rounded-2xl shadow-lg border border-slate-200 mx-auto inline-block">
                  <img
                    src={generatedSticker.qrDataUrl}
                    alt="Sticker QR"
                    className="w-48 h-48 mx-auto"
                  />
                  <div className="text-[11px] font-bold text-slate-800 mt-2 truncate max-w-[200px]">
                    {generatedSticker.name}
                  </div>
                  <div className="text-[9px] font-mono text-slate-500">
                    {generatedSticker.nmid}
                  </div>
                </div>

                <a
                  href={generatedSticker.qrDataUrl}
                  download={`stiker_${generatedSticker.nmid}.png`}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors block"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Gambar QR</span>
                </a>
              </div>
            ) : (
              <div className="text-center text-slate-400 space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-slate-500">
                  <QrCode className="w-8 h-8" />
                </div>
                <h3 className="text-xs font-bold text-white">Preview Stiker QR</h3>
                <p className="text-[11px] max-w-xs">
                  Isi formulir di sebelah kiri dan klik &quot;Generate &amp; Simpan&quot; untuk melihat kode QRIS fisik.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Merchants Database Table */}
        <div className="p-6 rounded-3xl bg-[#101424] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Daftar Merchant Terdaftar ({merchants.length})</h2>
              <p className="text-xs text-slate-400">Database resmi yang digunakan oleh Layer 1 &amp; Layer 3</p>
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
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {merchants.map(m => {
                  const hasConflict = nmidCounts[m.nmid] > 1;

                  return (
                    <tr
                      key={m.id}
                      className={`hover:bg-white/5 transition-colors ${
                        hasConflict ? 'bg-amber-950/20' : ''
                      }`}
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
                      <td className="py-3 px-3 font-semibold text-white">{m.name}</td>
                      <td className="py-3 px-3 text-slate-300">{m.city || 'BANDUNG'}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                        {m.latitude.toFixed(5)}, {m.longitude.toFixed(5)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          AKTIF
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeleteMerchant(m.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
