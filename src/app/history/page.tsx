'use client';

import React, { useEffect, useState } from 'react';
import { IncidentLog } from '@/lib/types';
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const [logs, setLogs] = useState<IncidentLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/incidents');
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#070913] text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-extrabold">Audit Log & Riwayat Scan</h1>
              <p className="text-xs text-slate-400">
                Log insiden keamanan real-time dari engine ValidQR
              </p>
            </div>
          </div>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>
        </div>

        {/* Logs List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Memuat data log insiden...
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#101424] border border-white/10 text-center text-slate-400 text-xs">
              Belum ada log scan tercatat. Lakukan scan QRIS di aplikasi untuk melihat riwayat.
            </div>
          ) : (
            logs.map((log, idx) => {
              const isBlocked = log.color === 'RED' || log.status === 'BLOCKED';
              const isWarning = log.color === 'YELLOW' || log.status === 'REBRAND_WARNING';

              return (
                <div
                  key={log.id || idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    isBlocked
                      ? 'bg-[#1C0E10] border-rose-600/30'
                      : isWarning
                      ? 'bg-[#1C170A] border-amber-500/30'
                      : 'bg-[#0E1B13] border-emerald-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isBlocked
                            ? 'bg-rose-500/20 text-rose-400'
                            : isWarning
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {isBlocked ? (
                          <ShieldAlert className="w-5 h-5" />
                        ) : isWarning ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : (
                          <ShieldCheck className="w-5 h-5" />
                        )}
                      </div>

                      <div>
                        <div className="font-bold text-sm text-white">
                          {log.merchant_name || 'Merchant QRIS'}
                        </div>
                        <div className="font-mono text-[11px] text-slate-400">
                          NMID: {log.nmid_scanned}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                          isBlocked
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : isWarning
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {log.status}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {log.created_at ? new Date(log.created_at).toLocaleString('id-ID') : '-'}
                      </div>
                    </div>
                  </div>

                  {/* Details row */}
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-300">
                    {log.fuzzy_score != null && (
                      <span>
                        Fuzzy Score: <strong className="text-white">{log.fuzzy_score}%</strong>
                      </span>
                    )}

                    {log.distance_meters != null && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        Jarak: <strong className="text-white">{log.distance_meters}m</strong>
                      </span>
                    )}

                    {log.reason && (
                      <span className="text-slate-400">
                        Alasan: <span className="font-mono text-white">{log.reason}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
