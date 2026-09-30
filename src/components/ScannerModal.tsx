'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useApp } from '@/lib/LanguageContext';
import { QrPayload, ScanResponse } from '@/lib/types';
import { SELARU_LAT, SELARU_LON } from '@/lib/mockData';
import { parseQRIS } from '@/lib/emvco';
import jsQR from 'jsqr';
import {
  X,
  Upload,
  Camera,
  MapPin,
  RefreshCw,
  Flashlight,
  Radio,
  SwitchCamera,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';

const LocationPickerMap = dynamic(() => import('@/components/LocationPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[220px] rounded-2xl bg-[#181B2F] border border-white/10 flex items-center justify-center text-xs text-slate-400">
      Memuat Peta Leaflet...
    </div>
  ),
});

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
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<string>('Menghubungkan GPS satelit...');
  const [useRealGps, setUseRealGps] = useState<boolean>(true); // Default to live real GPS stream!
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastScanTimeRef = useRef<number>(0);
  const barcodeDetectorRef = useRef<any>(null);

  // ── GPS Streaming Real-Time (watchPosition) ─────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    let watchId: number | null = null;

    if (useRealGps && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      setGpsStatus('Mencari sinyal GPS satelit...');

      // Immediate hardware kickstart to avoid delay
      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const acc = Math.round(pos.coords.accuracy);
          setGpsLocation({ lat, lon });
          setGpsAccuracy(acc);
          setGpsStatus(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
      );

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
    } else if (!useRealGps) {
      if (!gpsLocation) {
        setGpsLocation({ lat: SELARU_LAT, lon: SELARU_LON });
        setGpsStatus('Gedung Selaru (-6.974021, 107.630342)');
        setGpsAccuracy(0);
      }
    }

    return () => {
      if (watchId !== null && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isOpen, useRealGps]);

  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const startCamera = useCallback(async () => {
    setErrorMessage(null);
    stopCamera();

    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCameraPermission(false);
      setErrorMessage(
        'Kamera browser membutuhkan koneksi aman (HTTPS). Silakan gunakan tombol Upload Foto!'
      );
      return;
    }

    try {
      const tryStream = async (constraints: MediaStreamConstraints) => {
        try {
          return await navigator.mediaDevices.getUserMedia(constraints);
        } catch {
          return null;
        }
      };

      // 1. Coba resolusi ideal & facingMode
      let stream = await tryStream({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      // 2. Fallback jika overconstrained
      if (!stream) {
        stream = await tryStream({
          video: { facingMode: facingMode },
        });
      }

      // 3. Fallback ke kamera default apapun
      if (!stream) {
        stream = await tryStream({ video: true });
      }

      if (!stream) {
        throw new Error('Tidak dapat membuka stream kamera');
      }

      streamRef.current = stream;

      const video = videoRef.current;
      if (video) {
        // Critical iOS & Android WebKit properties
        video.playsInline = true;
        video.muted = true;
        video.autoplay = true;
        video.setAttribute('playsinline', 'true');
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('muted', 'true');
        video.setAttribute('autoplay', 'true');
        video.srcObject = stream;

        // Tunggu frame pertama video siap
        await new Promise<void>((resolve) => {
          if (video.readyState >= 2) {
            resolve();
          } else {
            const onReady = () => {
              video.removeEventListener('loadeddata', onReady);
              resolve();
            };
            video.addEventListener('loadeddata', onReady);
            setTimeout(resolve, 600);
          }
        });

        try {
          await video.play();
        } catch (e) {
          console.warn('Autoplay error handled:', e);
        }

        setHasCameraPermission(true);
        setIsScanning(true);
        lastScanTimeRef.current = 0;
        animationFrameRef.current = requestAnimationFrame(tickScan);
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setHasCameraPermission(false);
      setErrorMessage(
        'Akses kamera ditolak atau tidak didukung browser. Buka izin kamera di browser Anda, atau gunakan Upload Foto / Demo Cepat!'
      );
    }
  }, [facingMode, stopCamera]);

  // Start Camera Stream when modal opens or camera flips
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  const switchCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
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

  // Continuous frame scanning loop with Native BarcodeDetector + Center Crop jsQR
  const tickScan = () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) {
      animationFrameRef.current = requestAnimationFrame(tickScan);
      return;
    }

    // Throttle to ~12 scans/sec to keep mobile CPU cool and responsive
    const now = performance.now();
    if (now - lastScanTimeRef.current < 85) {
      animationFrameRef.current = requestAnimationFrame(tickScan);
      return;
    }
    lastScanTimeRef.current = now;

    // ── 1. Native Hardware BarcodeDetector (Chrome Android / Chromium) ──
    if (typeof window !== 'undefined' && 'BarcodeDetector' in (window as any)) {
      try {
        if (!barcodeDetectorRef.current) {
          barcodeDetectorRef.current = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        }
        barcodeDetectorRef.current
          .detect(video)
          .then((barcodes: any[]) => {
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(80);
              }
              handleRawQr(barcodes[0].rawValue);
              return;
            }
            animationFrameRef.current = requestAnimationFrame(tickScan);
          })
          .catch(() => {
            // fallback to canvas scanner if detector fails
            runCanvasScan(video);
          });
        return;
      } catch {
        // Fallback to canvas
      }
    }

    // ── 2. Canvas + jsQR Fallback (iOS Safari / Firefox) ──
    runCanvasScan(video);
  };

  const runCanvasScan = (video: HTMLVideoElement) => {
    const canvas = canvasRef.current || document.createElement('canvas');
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (ctx) {
      const vw = video.videoWidth;
      const vh = video.videoHeight;

      if (vw > 0 && vh > 0) {
        // A. CROP KOTAK TENGAH (Fokus ke viewfinder kamera HP)
        // Mereduksi komputasi piksel sebesar 80%+ pada mobile 1080p
        const minEdge = Math.min(vw, vh);
        const sx = Math.floor((vw - minEdge) / 2);
        const sy = Math.floor((vh - minEdge) / 2);

        const cropSize = 380;
        canvas.width = cropSize;
        canvas.height = cropSize;
        ctx.drawImage(video, sx, sy, minEdge, minEdge, 0, 0, cropSize, cropSize);
        let imageData = ctx.getImageData(0, 0, cropSize, cropSize);

        let code = jsQR(imageData.data, cropSize, cropSize, {
          inversionAttempts: 'attemptBoth',
        });

        // B. Jika belum terdeteksi di kotak tengah, coba scaled full frame (lebar 360px)
        if (!code) {
          const fw = 360;
          const fh = Math.round((vh * 360) / vw);
          canvas.width = fw;
          canvas.height = fh;
          ctx.drawImage(video, 0, 0, fw, fh);
          imageData = ctx.getImageData(0, 0, fw, fh);
          code = jsQR(imageData.data, fw, fh, { inversionAttempts: 'attemptBoth' });
        }

        if (code && code.data) {
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(80);
          }
          handleRawQr(code.data);
          return;
        }
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
        accuracy: gpsAccuracy,
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

  // Handle File Upload with Native BarcodeDetector + jsQR Auto-Scale
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so user can pick the same file again if needed
    e.target.value = '';

    // 1. Try Hardware BarcodeDetector if available
    if (typeof window !== 'undefined' && 'BarcodeDetector' in (window as any) && 'createImageBitmap' in window) {
      try {
        const bitmap = await createImageBitmap(file);
        const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        const barcodes = await detector.detect(bitmap);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          handleRawQr(barcodes[0].rawValue);
          return;
        }
      } catch (err) {
        console.warn('BarcodeDetector on image file skipped:', err);
      }
    }

    // 2. Fallback to Canvas + jsQR with auto-downscaling
    const reader = new FileReader();
    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 900;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const imageData = ctx.getImageData(0, 0, w, h);
          const code = jsQR(imageData.data, w, h, { inversionAttempts: 'attemptBoth' });
          if (code && code.data) {
            handleRawQr(code.data);
          } else {
            alert('Tidak ditemukan kode QR yang valid di dalam foto. Pastikan gambar jelas dan tidak blur.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md">
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
                  <span className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    gpsAccuracy <= 20
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${gpsAccuracy <= 20 ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                    ±{gpsAccuracy}m {gpsAccuracy <= 20 ? 'Akurat' : 'Lemah'}
                  </span>
                ) : (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {useRealGps ? 'GPS Lock' : 'Titik Peta'}
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
              onClick={switchCamera}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              title="Ganti Kamera Depan/Belakang"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>

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
                {errorMessage || 'Akses kamera sedang dipersiapkan. Anda juga dapat menggunakan tombol Upload Foto.'}
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
          {/* Indoor GPS Warning Banner */}
          {useRealGps && gpsAccuracy !== null && gpsAccuracy > 25 && !showMapPicker && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-950/50 border border-amber-500/40 text-[11px] text-amber-200">
              <div className="flex items-center gap-1.5 line-clamp-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>GPS indoor (±{gpsAccuracy}m). Set titik di <strong>Peta</strong> untuk presisi 1m.</span>
              </div>
              <button
                onClick={() => setShowMapPicker(true)}
                className="px-2 py-0.5 rounded-lg bg-amber-500/30 hover:bg-amber-500/50 text-amber-300 font-bold text-[10px] shrink-0 ml-1.5"
              >
                Peta
              </button>
            </div>
          )}

          {/* Upload Button & GPS Toggle & Map Picker */}
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
              className="flex-1 py-2.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-all"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>{t('scan_upload_btn')}</span>
            </button>

            <button
              onClick={() => {
                setShowMapPicker(false);
                setUseRealGps(true);
                if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
                  setGpsStatus('Menyegarkan GPS satelit...');
                  navigator.geolocation.getCurrentPosition(
                    pos => {
                      const lat = pos.coords.latitude;
                      const lon = pos.coords.longitude;
                      const acc = Math.round(pos.coords.accuracy);
                      setGpsLocation({ lat, lon });
                      setGpsAccuracy(acc);
                      setGpsStatus(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
                    },
                    err => {
                      console.warn('GPS refresh error:', err);
                    },
                    { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
                  );
                }
              }}
              className={`py-2.5 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all ${
                useRealGps && !showMapPicker
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                  : 'bg-white/10 text-slate-300 border-white/10'
              }`}
              title="Gunakan & segarkan GPS satelit perangkat asli"
            >
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>GPS Asli</span>
            </button>

            <button
              onClick={() => setShowMapPicker(!showMapPicker)}
              className={`py-2.5 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all ${
                showMapPicker
                  ? 'bg-indigo-600/40 text-indigo-200 border-indigo-500/50 shadow-sm'
                  : 'bg-white/10 text-slate-300 border-white/10'
              }`}
              title="Pilih titik lokasi GPS pada peta Leaflet"
            >
              <MapPin className="w-3 h-3 text-indigo-400" />
              <span>Peta</span>
              {showMapPicker ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
          </div>

          {/* Collapsible Leaflet Map Picker Drawer */}
          {showMapPicker && (
            <div className="p-3 rounded-2xl bg-[#090B16] border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-indigo-300 font-semibold">
                <span>Pilih Lokasi GPS Pengguna (Leaflet)</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {gpsLocation ? `${gpsLocation.lat.toFixed(5)}, ${gpsLocation.lon.toFixed(5)}` : ''}
                </span>
              </div>
              <LocationPickerMap
                latitude={gpsLocation?.lat || SELARU_LAT}
                longitude={gpsLocation?.lon || SELARU_LON}
                onChange={(lat, lon) => {
                  setUseRealGps(false);
                  setGpsLocation({ lat, lon });
                  setGpsAccuracy(1);
                  setGpsStatus(`Peta: ${lat.toFixed(6)}, ${lon.toFixed(6)}`);
                }}
                height="250px"
                geofenceRadius={20}
                merchantName="Titik Scan Pengguna"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
