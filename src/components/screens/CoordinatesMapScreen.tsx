import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  Copy,
  Check,
  Crosshair,
  Compass,
  Globe2,
  Plus,
  Minus,
  Search,
  ExternalLink,
} from 'lucide-react';
import { ScreenHeader } from '../common/ScreenHeader';
import { cyberAudio } from '../../utils/audio';
import { Language, getSavedLanguage, translations } from '../../utils/i18n';
import L from 'leaflet';

interface CoordinatesMapScreenProps {
  onBack: () => void;
  currentLang?: Language;
}

const PRESET_LOCATIONS = [
  { name: 'Algiers', lat: 36.7372, lng: 3.0865, address: 'Algiers (El Djazaïr), Province of Algiers, Algeria' },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, address: 'Burj Khalifa, Downtown Dubai, United Arab Emirates' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, address: 'Chiyoda, Tokyo Metropolitan Area, Japan' },
  { name: 'London', lat: 51.5074, lng: -0.1278, address: 'Westminster, Greater London, United Kingdom' },
  { name: 'New York', lat: 40.7128, lng: -74.006, address: 'Manhattan, New York, NY, United States' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, address: 'Paris, Île-de-France, France' },
];

export const CoordinatesMapScreen: React.FC<CoordinatesMapScreenProps> = ({ onBack, currentLang }) => {
  const lang = currentLang || getSavedLanguage();
  const t = translations[lang];
  // Default: Algiers 36.7372, 3.0865 as specified by user
  const [lat, setLat] = useState('36.7372');
  const [lng, setLng] = useState('3.0865');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: 36.7372,
    lng: 3.0865,
  });

  const [addressInfo, setAddressInfo] = useState(
    'Algiers (El Djazaïr), Province of Algiers, Algeria'
  );
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [copied, setCopied] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Reverse geocode via OpenStreetMap Nominatim or preset match
  const fetchAddress = async (latitude: number, longitude: number) => {
    // Check preset match first
    const preset = PRESET_LOCATIONS.find(
      (p) => Math.abs(p.lat - latitude) < 0.01 && Math.abs(p.lng - longitude) < 0.01
    );
    if (preset) {
      setAddressInfo(preset.address);
      return;
    }

    setIsLoadingAddress(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          setAddressInfo(data.display_name);
        } else {
          setAddressInfo(`Geographic coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      } else {
        setAddressInfo(`Geographic coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    } catch {
      setAddressInfo(`Target Sector: Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Standard bright, clear OpenStreetMap tiles like normal Google Maps
      const map = L.map(mapContainerRef.current, {
        center: [currentCoords.lat, currentCoords.lng],
        zoom: 14,
        zoomControl: false, // We render custom cyber zoom controls
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Glowing Neon Green Cyber Pin
      const cyberIcon = L.divIcon({
        className: 'cyber-map-pin',
        html: `
          <div style="position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
            <div style="position:absolute; width:40px; height:40px; border-radius:50%; border:2px dashed #00FF41; animation:spin-slow 6s linear infinite; box-shadow:0 0 14px rgba(0,255,65,0.8);"></div>
            <div style="position:absolute; width:20px; height:20px; border-radius:50%; background:#00FF41; box-shadow:0 0 16px #00FF41;"></div>
            <div style="position:absolute; width:8px; height:8px; border-radius:50%; background:#ffffff;"></div>
            <div style="position:absolute; width:2px; height:44px; background:#00FF41; opacity:0.7;"></div>
            <div style="position:absolute; width:44px; height:2px; background:#00FF41; opacity:0.7;"></div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const marker = L.marker([currentCoords.lat, currentCoords.lng], {
        icon: cyberIcon,
        draggable: true,
      }).addTo(map);

      // Listen for marker drag
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        const newLat = parseFloat(pos.lat.toFixed(4));
        const newLng = parseFloat(pos.lng.toFixed(4));
        setLat(newLat.toString());
        setLng(newLng.toString());
        setCurrentCoords({ lat: newLat, lng: newLng });
        fetchAddress(newLat, newLng);
        cyberAudio.playClick();
      });

      // Listen for map click to place pin
      map.on('click', (e: L.LeafletMouseEvent) => {
        const newLat = parseFloat(e.latlng.lat.toFixed(4));
        const newLng = parseFloat(e.latlng.lng.toFixed(4));
        setLat(newLat.toString());
        setLng(newLng.toString());
        setCurrentCoords({ lat: newLat, lng: newLng });
        marker.setLatLng([newLat, newLng]);
        fetchAddress(newLat, newLng);
        cyberAudio.playClick();
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Invalidate size after DOM settles so map is never blank/grey
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
      setTimeout(() => {
        map.invalidateSize();
      }, 500);
    }

    return () => {
      // Map cleanup handled on screen switch if needed
    };
  }, []);

  // Update map position with smooth animation when coordinates change
  const handleShowOnMap = () => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      cyberAudio.playAlert();
      return;
    }

    if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
      cyberAudio.playAlert();
      return;
    }

    cyberAudio.playSuccess();
    setCurrentCoords({ lat: parsedLat, lng: parsedLng });

    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
      mapInstanceRef.current.flyTo([parsedLat, parsedLng], 14, {
        duration: 1.2,
      });
      if (markerRef.current) {
        markerRef.current.setLatLng([parsedLat, parsedLng]);
      }
    }

    fetchAddress(parsedLat, parsedLng);
  };

  const handleMyLocation = () => {
    cyberAudio.playScanBeep();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLat = parseFloat(pos.coords.latitude.toFixed(4));
          const newLng = parseFloat(pos.coords.longitude.toFixed(4));
          setLat(newLat.toString());
          setLng(newLng.toString());
          setCurrentCoords({ lat: newLat, lng: newLng });

          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
            mapInstanceRef.current.flyTo([newLat, newLng], 15, { duration: 1.2 });
            if (markerRef.current) {
              markerRef.current.setLatLng([newLat, newLng]);
            }
          }
          fetchAddress(newLat, newLng);
          cyberAudio.playSuccess();
        },
        () => {
          // Fallback to Algiers if permission denied
          setLat('36.7372');
          setLng('3.0865');
          setCurrentCoords({ lat: 36.7372, lng: 3.0865 });
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([36.7372, 3.0865], 14);
            if (markerRef.current) markerRef.current.setLatLng([36.7372, 3.0865]);
          }
          setAddressInfo('Algiers (El Djazaïr), Province of Algiers, Algeria');
          cyberAudio.playAlert();
        }
      );
    }
  };

  const handleZoomIn = () => {
    cyberAudio.playClick();
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    cyberAudio.playClick();
    mapInstanceRef.current?.zoomOut();
  };

  const handleCopyCoords = () => {
    const text = `${currentCoords.lat}, ${currentCoords.lng}`;
    navigator.clipboard.writeText(text);
    cyberAudio.playSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <ScreenHeader
        title={t.mapCoordsTitle}
        subtitle={t.mapCoordsSubtitle}
        onBack={onBack}
      />

      {/* Inputs Form */}
      <div className="rounded-3xl bg-white/95 dark:bg-zinc-950/80 border border-slate-200 dark:border-[#00FF41]/30 p-5 backdrop-blur-md space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-xs font-mono text-slate-700 dark:text-zinc-300 font-semibold">
          <span>{t.geoCoordsTitle}</span>
          <button
            onClick={handleMyLocation}
            className="text-emerald-600 dark:text-[#00FF41] hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{t.myLocation}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider block mb-1 font-semibold">
              {t.latitude}
            </label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleShowOnMap()}
              placeholder="36.7372"
              className="w-full bg-slate-50 dark:bg-black/90 border border-slate-300 dark:border-zinc-800 focus:border-emerald-500 dark:focus:border-[#00FF41] rounded-2xl py-2.5 px-3.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider block mb-1 font-semibold">
              {t.longitude}
            </label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleShowOnMap()}
              placeholder="3.0865"
              className="w-full bg-slate-50 dark:bg-black/90 border border-slate-300 dark:border-zinc-800 focus:border-emerald-500 dark:focus:border-[#00FF41] rounded-2xl py-2.5 px-3.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Buttons: Show on Map + My Location + Copy */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={handleShowOnMap}
            className="col-span-2 h-12 rounded-2xl bg-[#00FF41] text-black font-orbitron font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,65,0.4)] active:scale-95 transition-all cursor-pointer"
          >
            <Crosshair className="w-4 h-4" />
            <span>{t.showOnMap}</span>
          </button>

          <button
            onClick={handleCopyCoords}
            className="h-12 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-[#00FF41] text-slate-800 dark:text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer font-bold"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-[#00FF41]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'COPIED!' : t.copyCoords}</span>
          </button>
        </div>

        {/* Preset City Chips */}
        <div className="pt-2 border-t border-slate-100 dark:border-zinc-900">
          <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider block mb-1.5 font-semibold">
            QUICK PRESETS:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_LOCATIONS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  cyberAudio.playClick();
                  setLat(preset.lat.toString());
                  setLng(preset.lng.toString());
                  setCurrentCoords({ lat: preset.lat, lng: preset.lng });
                  setAddressInfo(preset.address);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.invalidateSize();
                    mapInstanceRef.current.flyTo([preset.lat, preset.lng], 14, { duration: 1.2 });
                    if (markerRef.current) markerRef.current.setLatLng([preset.lat, preset.lng]);
                  }
                }}
                className={`text-xs font-mono px-3 py-1 rounded-xl border transition-all cursor-pointer ${
                  currentCoords.lat === preset.lat && currentCoords.lng === preset.lng
                    ? 'border-emerald-500 dark:border-[#00FF41] bg-emerald-50 dark:bg-[#00FF41]/20 text-emerald-700 dark:text-[#00FF41] font-bold'
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900/80 text-slate-700 dark:text-zinc-300'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAP DISPLAY (Height: 400px, Full Width, Clear and Bright, Draggable & Zoomable) */}
      <div className="rounded-3xl border-2 border-emerald-400/60 dark:border-[#00FF41]/60 overflow-hidden box-neon-green relative shadow-xl bg-slate-100 dark:bg-black">
        {/* Top HUD Badge on map */}
        <div className="absolute top-3 left-3 z-20 bg-black/85 backdrop-blur-md border border-[#00FF41]/40 rounded-2xl px-3.5 py-1.5 flex items-center gap-2 pointer-events-none shadow-md">
          <MapPin className="w-4 h-4 text-[#00FF41] animate-bounce" />
          <div className="text-xs font-mono font-bold text-white tracking-wide">
            {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}
          </div>
        </div>

        {/* Custom Zoom Buttons */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-xl bg-black/85 border border-[#00FF41]/50 hover:bg-[#00FF41]/20 text-[#00FF41] flex items-center justify-center transition-all shadow-md cursor-pointer active:scale-95"
            aria-label="Zoom in"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-xl bg-black/85 border border-[#00FF41]/50 hover:bg-[#00FF41]/20 text-[#00FF41] flex items-center justify-center transition-all shadow-md cursor-pointer active:scale-95"
            aria-label="Zoom out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Map Canvas: 400px height, fully visible, interactive */}
        <div
          ref={mapContainerRef}
          className="w-full h-[400px] z-10 cursor-grab active:cursor-grabbing"
          style={{ height: '400px', width: '100%' }}
        />

        {/* Bottom map watermark info */}
        <div className="absolute bottom-2 left-3 z-20 text-[10px] font-mono text-black bg-white/90 px-2 py-0.5 rounded shadow pointer-events-none">
          Click or drag marker to reposition
        </div>
      </div>

      {/* LOCATION & ADDRESS DETAILS BELOW MAP */}
      <div className="rounded-3xl bg-white/95 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 pb-2">
          <span className="text-xs font-mono text-slate-700 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
            <Globe2 className="w-4 h-4 text-emerald-600 dark:text-[#00FF41]" />
            LOCATION TELEMETRY &amp; ADDRESS
          </span>
          <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
            WGS84 DATUM
          </span>
        </div>

        {/* Address Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-zinc-900 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-500 uppercase font-semibold">
            RESOLVED ADDRESS:
          </span>
          <p className="text-sm font-sans font-semibold text-slate-900 dark:text-white leading-relaxed">
            {isLoadingAddress ? 'Resolving reverse geocode telemetry...' : addressInfo}
          </p>
        </div>

        {/* Latitude and Longitude readouts */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-zinc-900">
            <span className="text-slate-500 dark:text-zinc-500 text-[10px] font-semibold block">
              LATITUDE:
            </span>
            <span className="text-base font-bold font-orbitron text-emerald-700 dark:text-[#00FF41]">
              {currentCoords.lat.toFixed(5)}°
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-zinc-900">
            <span className="text-slate-500 dark:text-zinc-500 text-[10px] font-semibold block">
              LONGITUDE:
            </span>
            <span className="text-base font-bold font-orbitron text-emerald-700 dark:text-[#00FF41]">
              {currentCoords.lng.toFixed(5)}°
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-zinc-400 pt-1">
          <span className="flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00FF41]" />
            {currentCoords.lat >= 0 ? 'Northern' : 'Southern'} Hemisphere ·{' '}
            {currentCoords.lng >= 0 ? 'Eastern' : 'Western'} Hemisphere
          </span>
          <span className="font-semibold text-emerald-600 dark:text-[#00FF41]">
            STATUS: PINNED
          </span>
        </div>
      </div>
    </div>
  );
};
