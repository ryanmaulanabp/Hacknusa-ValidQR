'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Crosshair, Sparkles } from 'lucide-react';
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

export default function LocationPickerMap({
  latitude,
  longitude,
  onChange,
  height = '300px',
  geofenceRadius = 15,
  merchantName = 'Lokasi Terpilih',
  readOnly = false,
}: LocationPickerMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const [isLocating, setIsLocating] = useState(false);

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

    // Create Map
    const map = L.map(containerRef.current, {
      center: [initialLat, initialLon],
      zoom: 18,
      zoomControl: true,
      attributionControl: false,
    });
    mapRef.current = map;

    // OpenStreetMap Tile Layer (Clean Standard OSM)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Marker
    const marker = L.marker([initialLat, initialLon], {
      draggable: !readOnly,
      icon: createMarkerIcon('#6C5CE7'),
    }).addTo(map);
    markerRef.current = marker;

    // Geofence Circle
    const circle = L.circle([initialLat, initialLon], {
      radius: geofenceRadius,
      color: '#6C5CE7',
      fillColor: '#8E7BFD',
      fillOpacity: 0.25,
      weight: 2,
      dashArray: '4, 4',
    }).addTo(map);
    circleRef.current = circle;

    // Tooltip / Popup
    marker.bindPopup(`<b>${merchantName}</b><br/>Radius Geofence: ${geofenceRadius}m`).openPopup();

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

    // Invalidate size after layout stabilization
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync position from props
  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !circleRef.current) return;
    if (isNaN(latitude) || isNaN(longitude)) return;

    const currentLatLng = markerRef.current.getLatLng();
    if (
      Math.abs(currentLatLng.lat - latitude) > 0.00001 ||
      Math.abs(currentLatLng.lng - longitude) > 0.00001
    ) {
      markerRef.current.setLatLng([latitude, longitude]);
      circleRef.current.setLatLng([latitude, longitude]);
      mapRef.current.panTo([latitude, longitude]);
    }
  }, [latitude, longitude]);

  // Update position helper
  const updatePosition = (lat: number, lon: number) => {
    const fixedLat = parseFloat(lat.toFixed(6));
    const fixedLon = parseFloat(lon.toFixed(6));

    if (markerRef.current) {
      markerRef.current.setLatLng([fixedLat, fixedLon]);
    }
    if (circleRef.current) {
      circleRef.current.setLatLng([fixedLat, fixedLon]);
    }
    onChange(fixedLat, fixedLon);
  };

  // Find My Device GPS Location
  const handleGetCurrentLocation = () => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      alert('Geolokasi tidak didukung oleh browser ini.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        updatePosition(lat, lon);
        if (mapRef.current) {
          mapRef.current.setView([lat, lon], 18);
        }
      },
      err => {
        setIsLocating(false);
        console.warn('GPS error:', err);
        alert('Gagal membaca GPS perangkat: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Quick preset helper
  const applyPreset = (lat: number, lon: number) => {
    updatePosition(lat, lon);
    if (mapRef.current) {
      mapRef.current.setView([lat, lon], 18);
    }
  };

  return (
    <div className="space-y-2">
      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
          <span>Klik peta atau geser pin untuk memilih lokasi</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 flex items-center gap-1 font-semibold transition-all"
            title="Gunakan GPS Perangkat Saat Ini"
          >
            <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Mencari...' : 'GPS Saya'}</span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset(SELARU_LAT, SELARU_LON)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10 transition-all font-medium text-[11px]"
          >
            Selaru (Bandung)
          </button>

          <button
            type="button"
            onClick={() => applyPreset(JAKARTA_LAT, JAKARTA_LON)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10 transition-all font-medium text-[11px]"
          >
            Monas (Jakarta)
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-white/15 shadow-inner"
        style={{ height }}
      >
        <div ref={containerRef} className="w-full h-full z-0" />

        {/* Live Coordinate Overlay Badge */}
        <div className="absolute bottom-2 left-2 right-2 sm:right-auto z-[400] px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-between sm:justify-start gap-3 shadow-lg pointer-events-none">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Crosshair className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </span>
          </div>
          <span className="text-[10px] text-indigo-300 font-semibold">
            Geofence: ±{geofenceRadius}m
          </span>
        </div>
      </div>
    </div>
  );
}
