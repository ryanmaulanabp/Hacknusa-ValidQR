'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Navigation,
  Crosshair,
  Search,
  Layers,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Compass,
  Radio,
} from 'lucide-react';
import { SELARU_LAT, SELARU_LON, JAKARTA_LAT, JAKARTA_LON } from '@/lib/mockData';

interface LocationPickerMapProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lon: number) => void;
  height?: string;
  geofenceRadius?: number; // in meters, default 15
  merchantName?: string;
  readOnly?: boolean;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onChange,
  height = '330px',
  geofenceRadius = 15,
  merchantName = 'Lokasi Terpilih',
  readOnly = false,
}: LocationPickerMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const geofenceCircleRef = useRef<L.Circle | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // GPS & Accuracy State
  const [isLocating, setIsLocating] = useState(false);
  const [isTrackingLive, setIsTrackingLive] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsStatusText, setGpsStatusText] = useState<string | null>(null);
  const [addressText, setAddressText] = useState<string>('Memuat alamat lokasi...');

  // Map Tile Style State: 'osm' | 'satellite'
  const [mapLayer, setMapLayer] = useState<'osm' | 'satellite'>('osm');

  // Place Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // D-Pad Step: 1m vs 5m
  const [nudgeStep, setNudgeStep] = useState<number>(1);

  // Custom Neon / Indigo Map Marker Icon (DivIcon avoids broken PNG assets)
  const createMarkerIcon = (color = '#6C5CE7') => {
    return L.divIcon({
      className: 'custom-leaflet-pin',
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="
            position: absolute;
            width: 34px;
            height: 34px;
            background: ${color};
            border: 2.5px solid #FFFFFF;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 16px rgba(108, 92, 231, 0.65);
            display: flex;
            align-items: center;
            justify-content: center;
          "></div>
          <div style="
            position: absolute;
            width: 10px;
            height: 10px;
            background: #FFFFFF;
            border-radius: 50%;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          "></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    });
  };

  // Reverse Geocoding Helper (Debounced)
  const reverseGeocodeTimer = useRef<NodeJS.Timeout | null>(null);
  const fetchAddress = (lat: number, lon: number) => {
    if (reverseGeocodeTimer.current) clearTimeout(reverseGeocodeTimer.current);
    reverseGeocodeTimer.current = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
        const res = await fetch(url, { headers: { 'Accept-Language': 'id,en' } });
        const data = await res.json();
        if (data && data.display_name) {
          setAddressText(data.display_name);
        } else {
          setAddressText(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
        }
      } catch {
        setAddressText(`${lat.toFixed(6)}, ${lon.toFixed(6)}`);
      }
    }, 400);
  };

  // Update position helper
  const updatePosition = useCallback(
    (lat: number, lon: number, customAccuracy?: number) => {
      const fixedLat = parseFloat(lat.toFixed(7));
      const fixedLon = parseFloat(lon.toFixed(7));

      if (markerRef.current) {
        markerRef.current.setLatLng([fixedLat, fixedLon]);
      }
      if (geofenceCircleRef.current) {
        geofenceCircleRef.current.setLatLng([fixedLat, fixedLon]);
      }

      // Update or clear accuracy halo
      if (customAccuracy !== undefined && mapRef.current) {
        if (accuracyCircleRef.current) {
          accuracyCircleRef.current.setLatLng([fixedLat, fixedLon]).setRadius(customAccuracy);
        } else {
          accuracyCircleRef.current = L.circle([fixedLat, fixedLon], {
            radius: customAccuracy,
            color: '#00CEC9',
            fillColor: '#00CEC9',
            fillOpacity: 0.15,
            weight: 1.5,
            dashArray: '3, 3',
          }).addTo(mapRef.current);
        }
      }

      fetchAddress(fixedLat, fixedLon);
      onChange(fixedLat, fixedLon);
    },
    [onChange]
  );

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return; // already initialized

    const initialLat = isNaN(latitude) ? SELARU_LAT : latitude;
    const initialLon = isNaN(longitude) ? SELARU_LON : longitude;

    // Create Map with high zoom allowance (up to 20 for meter-level precision)
    const map = L.map(containerRef.current, {
      center: [initialLat, initialLon],
      zoom: 18,
      maxZoom: 20,
      zoomControl: true,
      attributionControl: false,
    });
    mapRef.current = map;

    // Initial OSM Tile Layer
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      maxNativeZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Marker
    const marker = L.marker([initialLat, initialLon], {
      draggable: !readOnly,
      icon: createMarkerIcon('#6C5CE7'),
    }).addTo(map);
    markerRef.current = marker;

    // Geofence Circle (15 meter radius)
    const geofenceCircle = L.circle([initialLat, initialLon], {
      radius: geofenceRadius,
      color: '#6C5CE7',
      fillColor: '#8E7BFD',
      fillOpacity: 0.22,
      weight: 2,
      dashArray: '4, 4',
    }).addTo(map);
    geofenceCircleRef.current = geofenceCircle;

    // Fetch initial address
    fetchAddress(initialLat, initialLon);

    // Map Click Listener: Set position anywhere by clicking
    if (!readOnly) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        updatePosition(lat, lng);
      });

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        updatePosition(pos.lat, pos.lng);
      });
    }

    // Invalidate size after layout renders
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (watchIdRef.current !== null && typeof navigator !== 'undefined') {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Switch Tile Layer: OSM vs Satellite
  const toggleMapLayer = () => {
    if (!mapRef.current) return;
    const newLayerType = mapLayer === 'osm' ? 'satellite' : 'osm';

    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    if (newLayerType === 'satellite') {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 20,
          attribution: 'Esri World Imagery',
        }
      ).addTo(mapRef.current);
    } else {
      tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        maxNativeZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    setMapLayer(newLayerType);
  };

  // Sync position from props
  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !geofenceCircleRef.current) return;
    if (isNaN(latitude) || isNaN(longitude)) return;

    const currentLatLng = markerRef.current.getLatLng();
    if (
      Math.abs(currentLatLng.lat - latitude) > 0.000005 ||
      Math.abs(currentLatLng.lng - longitude) > 0.000005
    ) {
      markerRef.current.setLatLng([latitude, longitude]);
      geofenceCircleRef.current.setLatLng([latitude, longitude]);
      mapRef.current.panTo([latitude, longitude]);
    }
  }, [latitude, longitude]);

  // ── High-Precision Multi-Sample Satellite GPS Locator ───────────────
  const startHighPrecisionGps = (continuous = false) => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      alert('Geolokasi tidak didukung oleh browser ini.');
      return;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setIsLocating(true);
    if (continuous) setIsTrackingLive(true);
    setGpsStatusText('Mengunci sinyal satelit GNSS/GPS...');

    let bestAcc = 999999;
    let sampleCount = 0;
    const maxSamples = 8;

    // maximumAge: 0 forces direct hardware satellite readings without stale cache
    const watchId = navigator.geolocation.watchPosition(
      pos => {
        sampleCount++;
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const acc = Math.round(pos.coords.accuracy);

        setGpsAccuracy(acc);

        if (acc <= bestAcc || continuous) {
          bestAcc = acc;
          updatePosition(lat, lon, acc);
          if (mapRef.current) {
            mapRef.current.flyTo([lat, lon], 19, { animate: true });
          }
        }

        setGpsStatusText(`Akurasi GPS: ±${acc}m`);

        // If high precision <= 10m is achieved and not in continuous mode, finish
        if (!continuous && (acc <= 10 || sampleCount >= maxSamples)) {
          navigator.geolocation.clearWatch(watchId);
          watchIdRef.current = null;
          setIsLocating(false);
          setGpsStatusText(`GPS Terkunci: ±${acc}m`);
        }
      },
      err => {
        console.warn('GPS error:', err);
        setIsLocating(false);
        setIsTrackingLive(false);
        setGpsStatusText(`GPS Error: ${err.message}`);
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );

    watchIdRef.current = watchId;

    if (!continuous) {
      setTimeout(() => {
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
          setIsLocating(false);
        }
      }, 10000);
    }
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null && typeof navigator !== 'undefined') {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTrackingLive(false);
    setIsLocating(false);
    setGpsStatusText(null);
  };

  // ── Exact 1-Meter Geodesic Nudge (Presisi 1 Meter Matematis) ────────
  const nudgeMeter = (metersNorth: number, metersEast: number) => {
    const latDelta = metersNorth * 0.00000899;
    const cosLat = Math.cos((latitude * Math.PI) / 180);
    const lonDelta = (metersEast * 0.00000899) / (cosLat !== 0 ? Math.abs(cosLat) : 1);

    const newLat = parseFloat((latitude + latDelta).toFixed(7));
    const newLon = parseFloat((longitude + lonDelta).toFixed(7));
    updatePosition(newLat, newLon);
    if (mapRef.current) {
      mapRef.current.panTo([newLat, newLon]);
    }
  };

  // ── Address / Place Search (Nominatim OSM) ──────────────────────────
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSearchResults(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchQuery.trim()
      )}&limit=6&countrycodes=id`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'id,en' },
      });
      const data: SearchResult[] = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.warn('Place search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (item: SearchResult) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    updatePosition(lat, lon);
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lon], 19, { animate: true });
    }
    setShowSearchResults(false);
    setSearchQuery('');
  };

  return (
    <div className="space-y-2 select-none">
      {/* Search Bar & Map Controls Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          {/* Address Search Form */}
          <form onSubmit={handleSearch} className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari gedung / jalan / alamat toko..."
              className="w-full pl-8 pr-7 py-2 rounded-xl bg-[#181B2F] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Satellite Layer Toggle */}
          <button
            type="button"
            onClick={toggleMapLayer}
            className={`px-2.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              mapLayer === 'satellite'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                : 'bg-white/10 hover:bg-white/15 text-slate-200 border-white/10'
            }`}
            title="Ganti Tampilan Peta Satelit vs Jalan"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{mapLayer === 'satellite' ? 'Satelit' : 'Jalan'}</span>
          </button>

          {/* Live Continuous Tracking Toggle */}
          <button
            type="button"
            onClick={() => (isTrackingLive ? stopTracking() : startHighPrecisionGps(true))}
            className={`px-2.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isTrackingLive
                ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50 shadow-emerald-500/20'
                : 'bg-white/10 hover:bg-white/15 text-slate-300 border-white/10'
            }`}
            title="Lacak posisi GPS secara terus menerus"
          >
            <Radio className={`w-3.5 h-3.5 ${isTrackingLive ? 'animate-pulse text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">{isTrackingLive ? 'Live Track ON' : 'Live Track'}</span>
          </button>

          {/* High-Accuracy GPS Locator Button */}
          <button
            type="button"
            onClick={() => startHighPrecisionGps(false)}
            disabled={isLocating}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            title="Kunci Titik GPS Akurat dari Satelit HP Anda"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Kunci...' : 'GPS Saya'}</span>
          </button>
        </div>

        {/* Live Reverse Geocoded Address Box */}
        <div className="px-3 py-1.5 rounded-xl bg-[#12162A] border border-white/10 flex items-start gap-2 text-[11px] text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-white">Alamat Pin Terpilih: </span>
            <span className="text-slate-300">{addressText}</span>
          </div>
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <div className="relative z-[500]">
            <div className="absolute left-0 right-0 top-0 bg-[#12162A] border border-white/15 rounded-2xl shadow-2xl overflow-hidden max-h-48 overflow-y-auto divide-y divide-white/10">
              {isSearching ? (
                <div className="p-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>Mencari lokasi di OpenStreetMap...</span>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map(item => (
                  <button
                    key={item.place_id}
                    type="button"
                    onClick={() => selectSearchResult(item)}
                    className="w-full p-2.5 text-left text-xs hover:bg-white/10 transition-colors flex items-start gap-2 text-slate-200"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{item.display_name}</span>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-slate-400">
                  Lokasi tidak ditemukan. Coba ketik nama jalan, gedung, atau kelurahan.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Map Canvas Container */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-white/15 shadow-inner"
        style={{ height }}
      >
        <div ref={containerRef} className="w-full h-full z-0" />

        {/* GPS Live Accuracy Status Toast */}
        {gpsStatusText && (
          <div className="absolute top-2 left-2 z-[400] px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-emerald-500/40 text-[10px] text-emerald-300 font-semibold flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{gpsStatusText}</span>
          </div>
        )}

        {/* Micro-Adjustment D-Pad (Presisi 1 Meter) */}
        {!readOnly && (
          <div className="absolute top-2 right-2 z-[400] bg-black/85 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-2xl flex flex-col items-center gap-1">
            {/* Step Size Selector: 1m vs 5m */}
            <div className="flex items-center gap-1 pb-1 border-b border-white/10 text-[9px] font-bold">
              <button
                type="button"
                onClick={() => setNudgeStep(1)}
                className={`px-1.5 py-0.5 rounded ${
                  nudgeStep === 1 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Presisi 1 Meter"
              >
                1m
              </button>
              <button
                type="button"
                onClick={() => setNudgeStep(5)}
                className={`px-1.5 py-0.5 rounded ${
                  nudgeStep === 5 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Presisi 5 Meter"
              >
                5m
              </button>
            </div>

            <button
              type="button"
              onClick={() => nudgeMeter(nudgeStep, 0)}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
              title={`Geser Utara (+${nudgeStep}m)`}
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => nudgeMeter(0, -nudgeStep)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                title={`Geser Barat (-${nudgeStep}m)`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <div className="text-[8px] font-bold font-mono text-indigo-300 px-1 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40">
                ±{nudgeStep}m
              </div>
              <button
                type="button"
                onClick={() => nudgeMeter(0, nudgeStep)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                title={`Geser Timur (+${nudgeStep}m)`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => nudgeMeter(-nudgeStep, 0)}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
              title={`Geser Selatan (-${nudgeStep}m)`}
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Live Coordinate Overlay Badge */}
        <div className="absolute bottom-2 left-2 right-2 sm:right-auto z-[400] px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/15 text-white flex items-center justify-between sm:justify-start gap-3 shadow-lg pointer-events-none">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Crosshair className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-indigo-300 font-semibold">
              Geofence: ±{geofenceRadius}m
            </span>
            {gpsAccuracy !== null && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                ±{gpsAccuracy}m Akurat
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Preset Buttons Helper Bar */}
      <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-400">
        <span>Klik di mana saja pada peta atau cari alamat untuk menempatkan pin</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => updatePosition(SELARU_LAT, SELARU_LON)}
            className="hover:text-indigo-400 underline"
          >
            Selaru (Bandung)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => updatePosition(JAKARTA_LAT, JAKARTA_LON)}
            className="hover:text-rose-400 underline"
          >
            Monas (Jakarta)
          </button>
        </div>
      </div>
    </div>
  );
}
