'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  Loader2,
  X,
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
  height = '320px',
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

  // GPS & Accuracy State
  const [isLocating, setIsLocating] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsStatusText, setGpsStatusText] = useState<string | null>(null);

  // Map Tile Style State: 'osm' | 'satellite'
  const [mapLayer, setMapLayer] = useState<'osm' | 'satellite'>('osm');

  // Place Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Custom Neon / Indigo Map Marker Icon (DivIcon avoids broken PNG assets)
  const createMarkerIcon = (color = '#6C5CE7') => {
    return L.divIcon({
      className: 'custom-leaflet-pin',
      html: `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
          <div style="
            position: absolute;
            width: 32px;
            height: 32px;
            background: ${color};
            border: 2.5px solid #FFFFFF;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 14px rgba(108, 92, 231, 0.6);
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
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -34],
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return; // already initialized

    const initialLat = isNaN(latitude) ? SELARU_LAT : latitude;
    const initialLon = isNaN(longitude) ? SELARU_LON : longitude;

    // Create Map with high zoom allowance
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

    // Map Click Listener
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

  // Update position helper
  const updatePosition = (lat: number, lon: number, customAccuracy?: number) => {
    const fixedLat = parseFloat(lat.toFixed(6));
    const fixedLon = parseFloat(lon.toFixed(6));

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

    onChange(fixedLat, fixedLon);
  };

  // ── High-Precision Multi-Sample Satellite GPS Locator ───────────────
  const handleGetCurrentLocation = () => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      alert('Geolokasi tidak didukung oleh browser ini.');
      return;
    }

    setIsLocating(true);
    setGpsStatusText('Menghubungkan sensor satelit GPS...');

    let bestAcc = 999999;
    let sampleCount = 0;
    const maxSamples = 8;

    // Force continuous fresh satellite readings with maximumAge: 0
    const watchId = navigator.geolocation.watchPosition(
      pos => {
        sampleCount++;
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const acc = Math.round(pos.coords.accuracy);

        setGpsAccuracy(acc);

        if (acc <= bestAcc) {
          bestAcc = acc;
          updatePosition(lat, lon, acc);
          if (mapRef.current) {
            mapRef.current.flyTo([lat, lon], 19, { animate: true });
          }
        }

        setGpsStatusText(`Akurasi GPS: ±${acc}m`);

        // If satellite precision reached <= 12m or enough samples gathered
        if (acc <= 12 || sampleCount >= maxSamples) {
          navigator.geolocation.clearWatch(watchId);
          setIsLocating(false);
          setGpsStatusText(`GPS Terkunci: ±${acc}m Presisi`);
        }
      },
      err => {
        console.warn('GPS watch error:', err);
        setIsLocating(false);
        setGpsStatusText(`Gagal: ${err.message}`);
        navigator.geolocation.clearWatch(watchId);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 12000,
      }
    );

    // Timeout safety net after 10s
    setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);
      setIsLocating(false);
    }, 10000);
  };

  // ── Micro-Adjustment Nudge (Geser Pin 1-2 Meter) ─────────────────────
  const nudge = (latDelta: number, lonDelta: number) => {
    const newLat = latitude + latDelta;
    const newLon = longitude + lonDelta;
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
      )}&limit=5&countrycodes=id`;
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
              placeholder="Cari gedung / jalan (misal: Telkom University, Buah Batu)..."
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

          {/* High-Accuracy GPS Locator Button */}
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            title="Kunci Titik GPS Akurat dari Satelit HP Anda"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Kunci...' : 'GPS Saya'}</span>
          </button>
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
                  Lokasi tidak ditemukan. Coba ketik nama jalan atau kota.
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

        {/* Micro-Adjustment D-Pad (Nudge 1 Meter) */}
        {!readOnly && (
          <div className="absolute top-2 right-2 z-[400] bg-black/75 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-lg flex flex-col items-center gap-0.5">
            <button
              type="button"
              onClick={() => nudge(0.000015, 0)}
              className="p-1 rounded-lg hover:bg-white/20 text-white"
              title="Geser Utara (+1.5m)"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => nudge(0, -0.000015)}
                className="p-1 rounded-lg hover:bg-white/20 text-white"
                title="Geser Barat (-1.5m)"
              >
                <ArrowLeft className="w-3 h-3" />
              </button>
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm" />
              <button
                type="button"
                onClick={() => nudge(0, 0.000015)}
                className="p-1 rounded-lg hover:bg-white/20 text-white"
                title="Geser Timur (+1.5m)"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => nudge(-0.000015, 0)}
              className="p-1 rounded-lg hover:bg-white/20 text-white"
              title="Geser Selatan (-1.5m)"
            >
              <ArrowDown className="w-3 h-3" />
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
        <span>Geser pin atau gunakan D-Pad di pojok kanan untuk akurasi meteran</span>
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
