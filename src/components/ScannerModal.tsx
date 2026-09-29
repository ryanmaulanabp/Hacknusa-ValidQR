'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/LanguageContext';
import { QrPayload, ScanResponse } from '@/lib/types';
import { DEMO_PRESETS, SELARU_LAT, SELARU_LON } from '@/lib/mockData';
import { parseQRIS } from '@/lib/emvco';
import jsQR from 'jsqr';
import {
  X,
  Upload,
  Camera,
  MapPin,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  ShieldBan,
  RefreshCw,
  Flashlight,
  Radio,
} from 'lucide-react';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (response: ScanResponse, payload: QrPayload) => void;
}

export default function ScannerModal({ isOpen, onClose, onScanComplete }: ScannerModalProps) {
  const { t, isDarkMode } = useApp();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lon: number } | null>({
    lat: SELARU_LAT,
    lon: SELARU_LON,
  });
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<string>('Menghubungkan GPS satelit...');
  const [useRealGps, setUseRealGps] = useState<boolean>(true); // Default to live real GPS stream!
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // ── GPS Streaming Real-Time (watchPosition) ─────────────────────────
  // Mengikuti pola mobile_scanner & geolocator di Flutter:
  // koordinat dan tingkat akurasi (± meter) diperbarui secara real-time terus-menerus.
  useEffect(() => {
    if (!isOpen) return;

    let watchId: number | null = null;

    if (useRealGps && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      setGpsStatus('Mencari sinyal GPS satelit...');

      watchId = navigator.geolocation.watchPosition(
        pos => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const acc = Math.round(pos.coords.accuracy);

          setGpsLocation({ lat, lon });
          setGpsAccuracy(acc);
          setGpsStatus(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
        },
        err => {
          console.warn('GPS Stream Error:', err);
          setGpsStatus('GPS ditolak/tidak aktif: Fallback Selaru');
          setGpsLocation({ lat: SELARU_LAT, lon: SELARU_LON });
          setGpsAccuracy(null);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        }
      );
    } else {
      setGpsLocation({ lat: SELARU_LAT, lon: SELARU_LON });
      setGpsStatus('Gedung Selaru (-6.974021, 107.630342)');
      setGpsAccuracy(0);
    }

    return () => {
      if (watchId !== null && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isOpen, useRealGps]);

  // Start Camera Stream
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setErrorMessage(null);
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setHasCameraPermission(true);
        setIsScanning(true);
        requestAnimationFrame(tickScan);
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setHasCameraPermission(false);
      setErrorMessage(
        'Kamera tidak dapat diakses di browser ini. Anda tetap dapat menggunakan Upload Foto QR atau Preset Demo Cepat!'
      );
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && (track.getCapabilities() as any)?.torch) {
      try {
        await (track as any).applyConstraints({
          advanced: [{ torch: !torchOn }],
        });
        setTorchOn(!torchOn);
      } catch (err) {
        console.warn('Torch toggle failed', err);
      }
    } else {
      alert('Fitur flash/torch tidak didukung oleh browser/perangkat ini.');
    }
  };

  // Continuous frame scanning loop using jsQR
  const tickScan = () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(tickScan);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        handleRawQr(code.data);
        return; // stop scanning loop on hit
      }
    }

    animationFrameRef.current = requestAnimationFrame(tickScan);
  };

  // Handle scanned raw QR code data
  const handleRawQr = async (rawCode: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    stopCamera();

    try {
      const parsed = parseQRIS(rawCode);

      const payloadToSend = {
        nmid: parsed.nmid,
        name: parsed.merchantName,
        rawPayload: rawCode,
        latitude: gpsLocation?.lat,
        longitude: gpsLocation?.lon,
      };

      const res = await fetch('/api/v1/verify/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToSend),
      });

      const data: ScanResponse = await res.json();
      onScanComplete(data, parsed);
    } catch (err: any) {
      console.error('Scan processing error:', err);
      setErrorMessage(`Gagal memproses QRIS: ${err.message}`);
      setIsProcessing(false);
      startCamera();
    }
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleRawQr(code.data);
          } else {
            alert('Tidak ditemukan kode QR yang valid di dalam foto yang diupload.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Trigger quick demo preset
  const runPreset = (preset: typeof DEMO_PRESETS.stickerA) => {
    handleRawQr(preset.rawPayload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-md h-full max-h-[92vh] flex flex-col bg-[#0B0D1B] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {/* Header Bar */}
        <div className="px-5 py-4 flex items-center justify-between z-20 bg-gradient-to-b from-[#0B0D1B] to-transparent">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold">{t('scan_title')}</h2>
                {useRealGps && gpsAccuracy !== null ? (
                  <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ±{gpsAccuracy}m Akurat
                  </span>
                ) : (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Selaru Lock
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="line-clamp-1 font-mono">{gpsStatus}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTorch}
              className={`p-2 rounded-full border transition-all ${
                torchOn ? 'bg-amber-400 text-black border-amber-300' : 'bg-white/10 text-white border-white/10'
              }`}
              title="Flash"
            >
              <Flashlight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Camera Viewfinder Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          {/* Live Video */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
          />

          {/* Fallback placeholder if camera not active */}
          {!isScanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-[#0E1120]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3">
                <Camera className="w-8 h-8" />
              </div>
              <p className="text-xs text-slate-300 max-w-xs">
                {errorMessage || 'Akses kamera sedang dipersiapkan atau gunakan preset demo cepat di bawah ini.'}
              </p>
              <button
                onClick={startCamera}
                className="mt-3 px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Coba Nyalakan Kamera
              </button>
            </div>
          )}

          {/* Viewfinder Target Overlay */}
          <div className="relative z-10 w-64 h-64 border-2 border-indigo-400/80 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(108,92,231,0.5)]">
            {/* Viewfinder Corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#6C5CE7] rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#6C5CE7] rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#6C5CE7] rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#6C5CE7] rounded-br-xl" />

            {/* Red / Laser Scanner Line Animation */}
            <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#FF7675] to-transparent shadow-[0_0_12px_#FF7675] animate-laser" />
          </div>

          {/* Processing spinner indicator */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/75 z-30 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
              <div className="text-white font-bold text-sm tracking-wide">
                ValidQR AI Memeriksa 3-Layer...
              </div>
              <div className="text-xs text-indigo-300">
                NMID • Fuzzy Match • Geofence GPS
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-0 right-0 text-center z-10 px-4">
            <span className="text-xs text-white/90 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
              {t('scan_hint')}
            </span>
          </div>
        </div>

        {/* Bottom Action Sheet: Gallery & Presets */}
        <div className="px-5 py-4 bg-[#101424] border-t border-white/10 z-20 space-y-3">
          {/* Upload Button & GPS Toggle */}
          <div className="flex items-center justify-between gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-all"
            >
              <Upload className="w-4 h-4 text-sky-400" />
              <span>{t('scan_upload_btn')}</span>
            </button>

            <button
              onClick={() => setUseRealGps(!useRealGps)}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                useRealGps
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                  : 'bg-white/10 text-slate-300 border-white/10'
              }`}
              title="Toggle antara GPS Asli Perangkat vs Mock Gedung Selaru"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{useRealGps ? 'Live GPS Nyata' : 'Selaru Mock'}</span>
            </button>
          </div>

          {/* Quick Demo Testing Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {t('scan_demo_presets')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Preset A: VERIFIED */}
              <button
                onClick={() => runPreset(DEMO_PRESETS.stickerA)}
                className="p-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-emerald-400">Stiker A</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-[9px] font-bold text-white mt-1 line-clamp-1">Pak Budi Asli</div>
                <div className="text-[8px] text-emerald-300/80">VERIFIED (Hijau)</div>
              </button>

              {/* Preset B: BLOCKED */}
              <button
                onClick={() => runPreset(DEMO_PRESETS.stickerB)}
                className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-rose-400">Stiker B</span>
                  <ShieldBan className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div className="text-[9px] font-bold text-white mt-1 line-clamp-1">Overlay Jauh</div>
                <div className="text-[8px] text-rose-300/80">BLOCKED (Merah)</div>
              </button>

              {/* Preset C: WARNING */}
              <button
                onClick={() => runPreset(DEMO_PRESETS.stickerC)}
                className="p-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-amber-400">Stiker C</span>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-[9px] font-bold text-white mt-1 line-clamp-1">Rebrand Nama</div>
                <div className="text-[8px] text-amber-300/80">WARNING (Kuning)</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
